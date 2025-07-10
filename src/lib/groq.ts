import { Groq } from "groq-sdk";
import { AirtableIngredient } from "../types/airtable.types";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

interface NutritionalAnalysis {
  totalCalories: number;
  totalProteins: number;
  totalCarbs: number;
  totalFats: number;
  vitamins: string[];
  minerals: string[];
  allergens: string[];
}

interface GeneratedRecipe {
  name: string;
  description: string;
  ingredients: Array<{
    name: string;
    quantity: string;
    unit: string;
  }>;
  instructions: string;
  servings: number;
  preparationTime: number;
  cookingTime: number;
  difficulty: "Facile" | "Moyen" | "Difficile";
  category: string;
}

export class GroqService {
  private client: Groq;
  private systemPrompt = `Tu es un assistant culinaire expert. Ton rôle est d'aider les utilisateurs à créer des recettes à partir de leurs ingrédients et préférences, sans poser trop de questions. Si les informations sont suffisantes, propose directement une recette complète et structurée.

Quand tu proposes une recette, structure-la clairement avec :
- Un titre
- Une liste d'ingrédients avec quantités
- Des instructions étape par étape
- Des informations nutritionnelles si possible

Format de réponse pour une recette :
{
  "containsRecipe": true,
  "canCreateRecipe": true, // ce champ doit être à true si la recette est complète et peut être créée
  "recipeData": {
    "name": "Titre de la recette",
    "description": "Description appétissante",
    "ingredients": [
      { "name": "ingrédient 1", "quantity": "100", "unit": "g" },
      { "name": "ingrédient 2", "quantity": "2", "unit": "pièce" }
    ],
    "instructions": ["étape 1", "étape 2"],
    "servings": 2,
    "preparationTime": 10,
    "cookingTime": 20,
    "difficulty": "Facile",
    "category": "Plat principal"
  }
}

Si tu n'as pas assez d'informations, propose la recette la plus plausible possible sans insister pour obtenir plus de détails.`;

  constructor() {
    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async chat(message: string, conversationHistory: any[] = []): Promise<any> {
    try {
      // Premier appel : texte utilisateur
      const userPrompt = `Donne-moi une recette de ${message}, formatée pour un utilisateur, sans JSON, sans balises, juste le texte.`;
      const messagesText = [
        { role: "system", content: this.systemPrompt },
        ...conversationHistory,
        { role: "user", content: userPrompt },
      ];
      const completionText = await this.client.chat.completions.create({
        messages: messagesText,
        model: "llama3-70b-8192",
        temperature: 0.7,
        max_tokens: 1024,
      });
      const userMessage = completionText.choices[0].message.content;

      // Deuxième appel : JSON structuré
      const jsonPrompt = `Pour la même recette, donne-moi uniquement le JSON au format suivant (pas de texte, pas de commentaire, pas de balises) :\n{\n  \"name\": ... ,\n  \"description\": ... ,\n  \"ingredients\": [...],\n  \"instructions\": [...],\n  \"servings\": ... ,\n  \"preparationTime\": ... ,\n  \"cookingTime\": ... ,\n  \"difficulty\": ... ,\n  \"category\": ...\n}`;
      const messagesJson = [
        { role: "system", content: this.systemPrompt },
        ...conversationHistory,
        { role: "user", content: userPrompt },
        { role: "assistant", content: userMessage },
        { role: "user", content: jsonPrompt },
      ];
      const completionJson = await this.client.chat.completions.create({
        messages: messagesJson,
        model: "llama3-70b-8192",
        temperature: 0.3,
        max_tokens: 1024,
      });
      let recipeData = null;
      let canCreateRecipe = false;
      try {
        const jsonContent = completionJson.choices[0].message.content;
        if (typeof jsonContent === "string") {
          recipeData = JSON.parse(jsonContent);
          canCreateRecipe =
            !!recipeData &&
            !!recipeData.name &&
            !!recipeData.ingredients &&
            !!recipeData.instructions;
        }
      } catch {
        recipeData = null;
        canCreateRecipe = false;
      }

      return {
        message: userMessage,
        containsRecipe: !!recipeData,
        canCreateRecipe,
        recipeData,
      };
    } catch (error) {
      console.error("Error in Groq chat:", error);
      throw error;
    }
  }

  async analyzeNutrition(
    ingredients: AirtableIngredient[]
  ): Promise<NutritionalAnalysis> {
    // Check if ingredients have nutritional values or if we need to calculate from names
    const hasNutritionData = ingredients.some(
      (ing) =>
        ing.fields.Calories > 0 ||
        ing.fields.Proteins > 0 ||
        ing.fields.Carbs > 0 ||
        ing.fields.Fats > 0
    );

    let prompt: string;

    if (hasNutritionData) {
      // Use existing nutritional data if available
      prompt = `Analysez les valeurs nutritionnelles suivantes et fournissez une analyse détaillée au format JSON:
      ${JSON.stringify(ingredients, null, 2)}
      
      Répondez uniquement avec un objet JSON contenant:
      {
        "totalCalories": number,
        "totalProteins": number,
        "totalCarbs": number,
        "totalFats": number,
        "vitamins": string[],
        "minerals": string[],
        "allergens": string[]
      }`;
    } else {
      // Calculate nutritional values from ingredient names
      const ingredientNames = ingredients
        .map((ing) => ing.fields.Name)
        .join(", ");
      prompt = `Calculez les valeurs nutritionnelles totales pour ces ingrédients en portions typiques de cuisine:
      Ingrédients: ${ingredientNames}
      
      Pour chaque ingrédient, utilisez des portions standards de cuisine (par exemple: 100g de viande, 1/2 tasse de légumes, etc.) et calculez les totaux.
      
      Exemple pour comprendre le format souhaité:
      - Si ingrédients sont "poulet, brocolis, riz": 
        * Poulet 100g = ~165 calories, 31g protéines, 0g glucides, 3.6g lipides
        * Brocolis 100g = ~34 calories, 2.8g protéines, 7g glucides, 0.4g lipides  
        * Riz 50g = ~130 calories, 2.7g protéines, 28g glucides, 0.3g lipides
        * TOTAL = 329 calories, 36.5g protéines, 35g glucides, 4.3g lipides
      
      IMPORTANT: Répondez UNIQUEMENT avec un objet JSON valide contenant les totaux calculés:
      {
        "totalCalories": [nombre total réel calculé],
        "totalProteins": [nombre total réel calculé en grammes],
        "totalCarbs": [nombre total réel calculé en grammes],
        "totalFats": [nombre total réel calculé en grammes],
        "vitamins": ["vitamine A", "vitamine C", "vitamine D", etc.],
        "minerals": ["fer", "calcium", "magnésium", etc.],
        "allergens": ["gluten", "lactose", etc. selon les ingrédients]
      }`;
    }

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content:
              "Vous êtes un expert en nutrition qui analyse les ingrédients et fournit des informations nutritionnelles précises. Vous connaissez les valeurs nutritionnelles typiques des aliments courants et pouvez estimer les totaux pour des recettes.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'analyse nutritionnelle");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    try {
      // Try to extract JSON from the content
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedData = JSON.parse(jsonMatch[0]);
        return parsedData;
      }
      // If no JSON found, return a default structure
      return {
        totalCalories: 0,
        totalProteins: 0,
        totalCarbs: 0,
        totalFats: 0,
        vitamins: [],
        minerals: [],
        allergens: [],
      };
    } catch (parseError) {
      // Return default values on parse error
      return {
        totalCalories: 0,
        totalProteins: 0,
        totalCarbs: 0,
        totalFats: 0,
        vitamins: [],
        minerals: [],
        allergens: [],
      };
    }
  }

  async generateRecipe(
    ingredients: AirtableIngredient[]
  ): Promise<GeneratedRecipe> {
    const prompt = `En tant que chef cuisinier professionnel, créez une recette détaillée et savoureuse en utilisant les ingrédients suivants:
    ${JSON.stringify(ingredients, null, 2)}

    Instructions spécifiques:
    1. Créez une recette qui met en valeur les ingrédients fournis tout en les complétant avec des ingrédients de base courants (sel, poivre, huile, etc.)
    2. Assurez-vous que les quantités sont réalistes et proportionnelles
    3. Les instructions doivent être claires, précises et dans l'ordre chronologique
    4. La difficulté doit être adaptée à la complexité réelle de la recette
    5. La catégorie doit être pertinente (ex: "Plat principal", "Entrée", "Dessert", etc.)
    6. Le temps de préparation et de cuisson doivent être réalistes
    7. La description doit être attrayante et donner envie de cuisiner

    IMPORTANT: Répondez UNIQUEMENT avec un objet JSON valide, sans texte supplémentaire avant ou après. Le JSON doit contenir:
    {
      "name": string, // Nom créatif et attrayant de la recette
      "description": string, // Description détaillée et appétissante
      "ingredients": Array<{
        name: string, // Nom de l'ingrédient
        quantity: string, // Quantité précise
        unit: string // Unité de mesure (g, ml, cuillère à soupe, etc.)
      }>,
      "instructions": string, // Instructions détaillées, une par ligne
      "servings": number, // Nombre de portions
      "preparationTime": number, // Temps de préparation en minutes
      "cookingTime": number, // Temps de cuisson en minutes
      "difficulty": "Facile" | "Moyen" | "Difficile", // Niveau de difficulté
      "category": string // Catégorie de la recette
    }`;

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content:
              "Vous êtes un chef cuisinier professionnel avec une expertise en gastronomie française et internationale. Vous créez des recettes détaillées, savoureuses et accessibles, en veillant à ce que chaque étape soit claire et précise. Vous avez une connaissance approfondie des techniques culinaires et des associations de saveurs.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la génération de la recette");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Try to extract JSON from the response
    try {
      // First try to parse as direct JSON
      return JSON.parse(content);
    } catch (error) {
      // If that fails, try to find JSON within the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (innerError) {
          console.error("Failed to parse extracted JSON:", jsonMatch[0]);
          throw new Error("Invalid JSON response format");
        }
      }
      console.error("No JSON found in response:", content);
      throw new Error("No valid JSON found in response");
    }
  }
}
