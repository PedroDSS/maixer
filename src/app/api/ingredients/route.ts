import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { AirtableService } from '@/lib/airtable';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to access ingredients' },
        { status: 401 }
      );
    }

    // Get all ingredients from Airtable
    const ingredients = await AirtableService.getAllIngredients();
    
    // Format the data for the frontend
    const formattedIngredients = ingredients.map(ingredient => ({
      id: ingredient.id,
      name: ingredient.fields.Name,
      category: ingredient.fields.Category,
      unit: ingredient.fields.Unit,
      calories: ingredient.fields.Calories,
      proteins: ingredient.fields.Proteins,
      carbs: ingredient.fields.Carbs,
      fats: ingredient.fields.Fats,
      isAllergen: ingredient.fields.IsAllergen,
      containsGluten: ingredient.fields.ContainsGluten,
      containsLactose: ingredient.fields.ContainsLactose
    }));

    return NextResponse.json(formattedIngredients);
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ingredients' },
      { status: 500 }
    );
  }
}