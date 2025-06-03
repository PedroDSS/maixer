export interface AirtableIngredient {
  id: string;
  fields: {
    Name: string;
    Category: string;
    Calories: number;
    Proteins: number;
    Carbs: number;
    Fats: number;
    Unit: string;
    IsAllergen: boolean;
    ContainsGluten: boolean;
    ContainsLactose: boolean;
  };
}