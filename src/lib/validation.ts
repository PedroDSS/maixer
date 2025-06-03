// lib/validation.ts
import { RegisterRequest } from '@/types/auth';
import { z } from 'zod';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ValidationUtils {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPassword(password: string): boolean {
    return password.length >= 8;
  }

  static validateRegistrationData(data: RegisterRequest): void {
    const { name, email, password } = data;

    if (!name || !email || !password) {
      throw new ValidationError('Tous les champs sont requis');
    }

    if (!this.isValidEmail(email)) {
      throw new ValidationError('Format d\'email invalide');
    }

    if (!this.isValidPassword(password)) {
      throw new ValidationError('Le mot de passe doit contenir au moins 8 caractères');
    }
  }
}

// Recipe validation schemas
export const recipeGenerationSchema = z.object({
  ingredients: z.array(
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
  servings: z.coerce
    .number()
    .min(1, 'Servings must be at least 1')
    .max(20, 'Servings must be at most 20'),
  allergies: z.string().optional(),
}).refine(data => {
  // Either ingredients array must have items OR manualIngredients must have content
  return (data.ingredients && data.ingredients.length > 0) || 
         (data.manualIngredients && data.manualIngredients.trim() !== '');
}, {
  message: "Please provide either selected ingredients or manual ingredients",
  path: ["ingredients"]
});

export type RecipeGenerationFormValues = z.infer<typeof recipeGenerationSchema>;