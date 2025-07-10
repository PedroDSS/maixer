export interface NutritionalInfo {
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
  vitamins: Record<string, number>;
  minerals: Record<string, number>;
}

export interface Ingredient {
  name: string;
  quantity: string;
  unit?: string;
}

export interface RecipeStep {
  stepNumber: number;
  description: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  servings: number;
  prepTime: number;
  cookTime: number;
  dishType: string;
  allergens: string[];
  nutritionalInfo: NutritionalInfo;
  createdAt: string;
  userId: string;
}

export interface RecipeRequest {
  ingredients: string[];
  servings: number;
  allergies: string[];
}