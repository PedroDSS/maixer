import Airtable from 'airtable';
import { AirtableUser } from '@/types/auth';
import { AirtableIngredient } from '@/types/airtable.types';
import { Recipe, RecipeRequest } from '@/types/recipe';

// Ensure we have environment variables or use fallback values
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const USERS_TABLE_NAME = process.env.AIRTABLE_USERS_TABLE || 'Users';
const RECIPES_TABLE_NAME = process.env.AIRTABLE_RECIPES_TABLE || 'Recipes';
const INGREDIENTS_TABLE_NAME = process.env.AIRTABLE_INGREDIENTS_TABLE || 'Ingredients';

// Validate required environment variables
if (!AIRTABLE_API_KEY) {
  console.error('Missing AIRTABLE_API_KEY environment variable');
}

if (!AIRTABLE_BASE_ID) {
  console.error('Missing AIRTABLE_BASE_ID environment variable');
}

const base = new Airtable({
  apiKey: AIRTABLE_API_KEY,
}).base(AIRTABLE_BASE_ID || '');

const usersTable = base(USERS_TABLE_NAME);
const recipesTable = base(RECIPES_TABLE_NAME);
const ingredientsTable = base(INGREDIENTS_TABLE_NAME);

export class AirtableService {
  static async checkUserExists(email: string): Promise<boolean> {
    try {
      const records = await usersTable
        .select({
          filterByFormula: `{Email} = '${email}'`,
          maxRecords: 1,
        })
        .firstPage();

      return records.length > 0;
    } catch (error) {
      console.error('Error checking user existence:', error);
      throw new Error('Database query failed');
    }
  }

  static async getUserByEmail(email: string): Promise<AirtableUser | null> {
    try {
      const records = await usersTable
        .select({
          filterByFormula: `{Email} = '${email}'`,
          maxRecords: 1,
        })
        .firstPage();

      return records.length > 0 ? records[0] as AirtableUser : null;
    } catch (error) {
      console.error('Error fetching user from Airtable:', error);
      return null;
    }
  }

  static async createUser(userData: {
    Name: string;
    Email: string;
    Password: string;
  }): Promise<AirtableUser> {
    try {
      const records = await usersTable.create([
        {
          fields: userData,
        },
      ]);

      return records[0] as AirtableUser;
    } catch (error) {
      console.error('Error creating user in Airtable:', error);
      throw new Error('User creation failed');
    }
  }

  // Ingredient-related methods
  static async getAllIngredients(): Promise<AirtableIngredient[]> {
    try {
      const records = await ingredientsTable
        .select({
          sort: [{ field: 'Name', direction: 'asc' }]
        })
        .all();

      return records as AirtableIngredient[];
    } catch (error) {
      console.error('Error fetching all ingredients from Airtable:', error);
      throw new Error('Failed to fetch ingredients');
    }
  }

  static async getIngredientsByName(names: string[]): Promise<AirtableIngredient[]> {
    try {
      if (names.length === 0) return [];

      // Create a filter formula that matches any of the ingredient names
      const filterFormula = names.map(name => `SEARCH('${name.replace(/'/g, "\\'")}', {Name})`).join(', ');
      const finalFormula = `OR(${filterFormula})`;

      const records = await ingredientsTable
        .select({
          filterByFormula: finalFormula
        })
        .all();

      return records as AirtableIngredient[];
    } catch (error) {
      console.error('Error fetching ingredients from Airtable:', error);
      throw new Error('Failed to fetch ingredients');
    }
  }

  // Recipe-related methods
  static async getAllPublicRecipes(): Promise<Recipe[]> {
    try {
      const records = await recipesTable
        .select({
          sort: [{ field: 'CreatedAt', direction: 'desc' }],
        })
        .all();

      return records.map((record) => ({
        id: record.id,
        name: record.get('Name') as string,
        description: record.get('Description') as string,
        ingredients: JSON.parse(record.get('Ingredients') as string),
        steps: JSON.parse(record.get('Steps') as string),
        servings: record.get('Servings') as number,
        prepTime: record.get('PrepTime') as number,
        cookTime: record.get('CookTime') as number,
        dishType: record.get('DishType') as string,
        allergens: JSON.parse(record.get('Allergens') as string),
        nutritionalInfo: JSON.parse(record.get('NutritionalInfo') as string),
        createdAt: record.get('CreatedAt') as string,
        userId: record.get('UserId') as string,
      }));
    } catch (error) {
      console.error('Error fetching public recipes from Airtable:', error);
      throw new Error('Failed to fetch public recipes');
    }
  }

  static async getAllRecipes(userId: string): Promise<Recipe[]> {
    try {
      const records = await recipesTable
        .select({
          filterByFormula: `{UserId} = '${userId}'`,
          sort: [{ field: 'CreatedAt', direction: 'desc' }],
        })
        .all();

      return records.map((record) => ({
        id: record.id,
        name: record.get('Name') as string,
        description: record.get('Description') as string,
        ingredients: JSON.parse(record.get('Ingredients') as string),
        steps: JSON.parse(record.get('Steps') as string),
        servings: record.get('Servings') as number,
        prepTime: record.get('PrepTime') as number,
        cookTime: record.get('CookTime') as number,
        dishType: record.get('DishType') as string,
        allergens: JSON.parse(record.get('Allergens') as string),
        nutritionalInfo: JSON.parse(record.get('NutritionalInfo') as string),
        createdAt: record.get('CreatedAt') as string,
        userId: record.get('UserId') as string,
      }));
    } catch (error) {
      console.error('Error fetching recipes from Airtable:', error);
      throw new Error('Failed to fetch recipes');
    }
  }

  static async getRecipeById(recipeId: string): Promise<Recipe | null> {
    try {
      const record = await recipesTable.find(recipeId);
      
      if (!record) return null;

      return {
        id: record.id,
        name: record.get('Name') as string,
        description: record.get('Description') as string,
        ingredients: JSON.parse(record.get('Ingredients') as string),
        steps: JSON.parse(record.get('Steps') as string),
        servings: record.get('Servings') as number,
        prepTime: record.get('PrepTime') as number,
        cookTime: record.get('CookTime') as number,
        dishType: record.get('DishType') as string,
        allergens: JSON.parse(record.get('Allergens') as string),
        nutritionalInfo: JSON.parse(record.get('NutritionalInfo') as string),
        createdAt: record.get('CreatedAt') as string,
        userId: record.get('UserId') as string,
      };
    } catch (error) {
      console.error('Error fetching recipe from Airtable:', error);
      throw new Error('Failed to fetch recipe');
    }
  }

  static async createRecipe(recipeData: Omit<Recipe, 'id'>): Promise<Recipe> {
    try {
      const fields = {
        Name: recipeData.name,
        Description: recipeData.description,
        Ingredients: JSON.stringify(recipeData.ingredients),
        Steps: JSON.stringify(recipeData.steps),
        Servings: recipeData.servings,
        PrepTime: recipeData.prepTime,
        CookTime: recipeData.cookTime,
        DishType: recipeData.dishType,
        Allergens: JSON.stringify(recipeData.allergens),
        NutritionalInfo: JSON.stringify(recipeData.nutritionalInfo),
        CreatedAt: recipeData.createdAt,
        UserId: recipeData.userId,
      };
      
      const records = await recipesTable.create([{ fields }]);
      const record = records[0];

      return {
        id: record.id,
        name: record.get('Name') as string,
        description: record.get('Description') as string,
        ingredients: JSON.parse(record.get('Ingredients') as string),
        steps: JSON.parse(record.get('Steps') as string),
        servings: record.get('Servings') as number,
        prepTime: record.get('PrepTime') as number,
        cookTime: record.get('CookTime') as number,
        dishType: record.get('DishType') as string,
        allergens: JSON.parse(record.get('Allergens') as string),
        nutritionalInfo: JSON.parse(record.get('NutritionalInfo') as string),
        createdAt: record.get('CreatedAt') as string,
        userId: record.get('UserId') as string,
      };
    } catch (error) {
      console.error('Error creating recipe in Airtable:', error);
      throw new Error('Failed to create recipe');
    }
  }

  static async searchRecipes(
    userId: string,
    searchParams: { name?: string; ingredient?: string; dishType?: string }
  ): Promise<Recipe[]> {
    try {
      // Start with a base filter for the user
      let filterFormula = `{UserId} = '${userId}'`;
      
      // Add name filter if provided
      if (searchParams.name) {
        // SEARCH is more reliable than FIND for partial text search
        filterFormula = `AND(${filterFormula}, SEARCH(LOWER('${searchParams.name}'), LOWER({Name})))`;
      }
      
      // Add dish type filter if provided and not the "all" value
      if (searchParams.dishType && searchParams.dishType !== '_all') {
        filterFormula = `AND(${filterFormula}, {DishType} = '${searchParams.dishType}')`;
      }

      const records = await recipesTable
        .select({
          filterByFormula: filterFormula,
          sort: [{ field: 'CreatedAt', direction: 'desc' }],
        })
        .all();

      let recipes = records.map((record) => ({
        id: record.id,
        name: record.get('Name') as string,
        description: record.get('Description') as string,
        ingredients: JSON.parse(record.get('Ingredients') as string),
        steps: JSON.parse(record.get('Steps') as string),
        servings: record.get('Servings') as number,
        prepTime: record.get('PrepTime') as number,
        cookTime: record.get('CookTime') as number,
        dishType: record.get('DishType') as string,
        allergens: JSON.parse(record.get('Allergens') as string),
        nutritionalInfo: JSON.parse(record.get('NutritionalInfo') as string),
        createdAt: record.get('CreatedAt') as string,
        userId: record.get('UserId') as string,
      }));

      // Filter by ingredient if provided (can't do this in Airtable formula)
      if (searchParams.ingredient) {
        const ingredientLower = searchParams.ingredient.toLowerCase();
        recipes = recipes.filter((recipe) => 
          recipe.ingredients.some((ingredient) => 
            ingredient.name.toLowerCase().includes(ingredientLower)
          )
        );
      }

      return recipes;
    } catch (error) {
      console.error('Error searching recipes in Airtable:', error);
      throw new Error('Failed to search recipes');
    }
  }
}