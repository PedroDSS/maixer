import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { AirtableService } from '@/lib/airtable';
import { NutritionInfo } from '@/components/NutritionInfo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Users, AlertTriangle, ArrowLeft, ChefHat, Utensils } from 'lucide-react';

interface RecipePageProps {
  params: {
    id: string;
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = params;
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  const userEmail = session.user?.email;

  if (!userEmail) {
    redirect('/login');
  }

  const user = await AirtableService.getUserByEmail(userEmail);

  if (!user) {
    redirect('/login');
  }

  try {
    const recipe = await AirtableService.getRecipeById(id);

    if (!recipe) {
      notFound();
    }

    const totalTime = recipe.prepTime + recipe.cookTime;

    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-grow flex flex-col">
        <div className="max-w-4xl mx-auto">
          <Link href="/recipes" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Retour aux recettes</span>
          </Link>
          
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            {recipe.name}
          </h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
              {recipe.dishType}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="h-4 w-4 text-orange-500" />
              <span>{totalTime} min</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Users className="h-4 w-4 text-orange-500" />
              <span>{recipe.servings} portion{recipe.servings > 1 ? 's' : ''}</span>
            </div>
          </div>

          <p className="text-lg mb-8 text-gray-700">{recipe.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-2">
              <Card className="backdrop-blur-sm bg-white/90 shadow-lg border-0 ring-1 ring-orange-200">
                <CardHeader>
                  <CardTitle className="text-xl text-orange-600 flex items-center gap-2">
                    <Utensils className="h-5 w-5" />
                    Ingrédients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 divide-y divide-orange-100">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex justify-between py-2">
                        <span className="font-medium text-gray-800">{ingredient.name}</span>
                        <span className="text-gray-600">
                          {ingredient.quantity} {ingredient.unit}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {recipe.allergens.length > 0 && (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                      <div className="flex items-center gap-2 text-amber-600 mb-2">
                        <AlertTriangle className="h-5 w-5" />
                        <h3 className="font-medium">Attention aux Allergènes</h3>
                      </div>
                      <p className="text-amber-700">
                        Cette recette contient : {recipe.allergens.join(', ')}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-1">
              <NutritionInfo nutritionalInfo={recipe.nutritionalInfo} />
            </div>
          </div>

          <Card className="mb-8 backdrop-blur-sm bg-white/90 shadow-lg border-0 ring-1 ring-orange-200">
            <CardHeader>
              <CardTitle className="text-xl text-orange-600 flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-6">
                {recipe.steps.map((step) => (
                  <li key={step.stepNumber} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-center font-medium shadow">
                      {step.stepNumber}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching recipe:', error);
    notFound();
  }
}