import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { AirtableService } from '@/lib/airtable';
import { GroqService } from '@/lib/groq';
import { RecipeStep } from '@/types/recipe';
import { z } from 'zod';

// Define validation schema for the request
const requestSchema = z.object({
  selectedIngredients: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      category: z.string(),
      unit: z.string(),
      calories: z.number(),
      proteins: z.number(),
      carbs: z.number(),
      fats: z.number(),
      isAllergen: z.boolean(),
      containsGluten: z.boolean(),
      containsLactose: z.boolean(),
    })
  ).optional(),
  manualIngredients: z.string().optional(),
  servings: z.number().min(1).max(20),
  allergies: z.string().optional(),
  useAirtableIngredients: z.boolean().default(true)
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to generate recipes' },
        { status: 401 }
      );
    }

    const user = await AirtableService.getUserByEmail(session.user.email);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = requestSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error.errors);
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }
    
    console.log('Validation successful, processing request with data:', validationResult.data);

    const { 
      selectedIngredients, 
      manualIngredients, 
      servings, 
      allergies, 
      useAirtableIngredients 
    } = validationResult.data;
    
    // Initialize Groq service
    const groqService = new GroqService();
    
    console.log('Processing with useAirtableIngredients:', useAirtableIngredients);
    console.log('Selected ingredients:', selectedIngredients?.length || 0);
    console.log('Manual ingredients:', manualIngredients);
    
    if (useAirtableIngredients && selectedIngredients && selectedIngredients.length > 0) {
      console.log('Using Airtable ingredients approach');
      // Convert selected ingredients to Airtable format
      const airtableIngredients = selectedIngredients.map(ingredient => ({
        id: ingredient.id,
        fields: {
          Name: ingredient.name,
          Category: ingredient.category,
          Calories: ingredient.calories,
          Proteins: ingredient.proteins,
          Carbs: ingredient.carbs,
          Fats: ingredient.fats,
          Unit: ingredient.unit,
          IsAllergen: ingredient.isAllergen,
          ContainsGluten: ingredient.containsGluten,
          ContainsLactose: ingredient.containsLactose
        }
      }));

      // Generate recipe using Groq with Airtable ingredients
      const recipeData = await groqService.generateRecipe(airtableIngredients);

      // Analyze nutrition using Groq
      const nutritionalAnalysis = await groqService.analyzeNutrition(airtableIngredients);

      // Parse instructions into step format
      const steps: RecipeStep[] = recipeData.instructions
        .split('\n')
        .filter(Boolean)
        .map((step: string, index: number) => ({
          stepNumber: index + 1,
          description: step.trim()
        }));

      // Create a recipe object in our app's format
      const recipe = {
        name: recipeData.name,
        description: recipeData.description,
        ingredients: recipeData.ingredients,
        steps,
        servings: recipeData.servings || servings,
        prepTime: recipeData.preparationTime,
        cookTime: recipeData.cookingTime,
        dishType: recipeData.category,
        allergens: nutritionalAnalysis.allergens || [],
        nutritionalInfo: {
          calories: nutritionalAnalysis.totalCalories,
          proteins: nutritionalAnalysis.totalProteins,
          carbohydrates: nutritionalAnalysis.totalCarbs,
          fats: nutritionalAnalysis.totalFats,
          vitamins: nutritionalAnalysis.vitamins.reduce((acc, vitamin) => {
            acc[vitamin] = 1;
            return acc;
          }, {} as Record<string, number>),
          minerals: nutritionalAnalysis.minerals.reduce((acc, mineral) => {
            acc[mineral] = 1;
            return acc;
          }, {} as Record<string, number>)
        },
        createdAt: new Date().toISOString(),
        userId: "rec123user1"
      };

      // Save recipe to Airtable
      const savedRecipe = await AirtableService.createRecipe(recipe);
      return NextResponse.json({ recipe: savedRecipe });
    } else {
      console.log('Using manual ingredients approach');
      // Use manual ingredients approach
      if (!manualIngredients || manualIngredients.trim() === '') {
        console.error('No manual ingredients provided');
        return NextResponse.json(
          { error: 'Please provide at least one ingredient' },
          { status: 400 }
        );
      }

      // Process allergies string
      const allergiesList = allergies ? allergies.split(',').map(a => a.trim()).filter(Boolean) : [];
      
      // Generate recipe using chat API
      const response = await groqService.chat(manualIngredients + (allergies ? ` sans ${allergies}` : ''));

      if (response.canCreateRecipe && response.recipeData) {
        // Process the recipe data from Groq
        const recipeData = response.recipeData;

        // Parse instructions into step format
        const steps: RecipeStep[] = recipeData.instructions
          .map((step: string, index: number) => ({
            stepNumber: index + 1,
            description: step.trim()
          }));

        // Create a simplified nutritional info (would be better with real data)
        const nutritionalInfo = {
          calories: 0,
          proteins: 0,
          carbohydrates: 0,
          fats: 0,
          vitamins: {},
          minerals: {}
        };

        // Create a recipe object in our app's format
        const recipe = {
          name: recipeData.name,
          description: recipeData.description,
          ingredients: recipeData.ingredients,
          steps,
          servings: recipeData.servings || servings,
          prepTime: recipeData.preparationTime,
          cookTime: recipeData.cookingTime,
          dishType: recipeData.category,
          allergens: allergiesList,
          nutritionalInfo,
          createdAt: new Date().toISOString(),
          userId: user.id
        };

        // Save recipe to Airtable
        const savedRecipe = await AirtableService.createRecipe(recipe);
        return NextResponse.json({ recipe: savedRecipe });
      } else {
        return NextResponse.json(
          { error: 'Failed to generate a valid recipe' },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('Error generating recipe:', error);
    return NextResponse.json(
      { error: 'Failed to generate recipe' },
      { status: 500 }
    );
  }
}