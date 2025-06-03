import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { AirtableService } from '@/lib/airtable';
import { RecipeCard } from '@/components/RecipeCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Search, ChefHat, Sparkles } from 'lucide-react';

export default async function AllRecipesPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login');
  }

  const recipes = await AirtableService.getAllPublicRecipes();

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-grow flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 w-full">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Toutes les Recettes
          </h1>
          <p className="text-gray-600">
            Découvrez toutes les recettes générées par la communauté
          </p>
        </div>
      </div>

      {recipes.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-lg text-center py-16 backdrop-blur-sm bg-white/90 shadow-lg border-0 ring-1 ring-orange-200 rounded-lg p-8 mx-auto">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg mb-4">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-orange-600">Aucune recette pour le moment</h2>
            <p className="text-gray-600 mb-6">
              Soyez le premier à créer une recette !
            </p>
            <Link href="/recipes/new">
              <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                <Sparkles className="h-4 w-4 mr-2" />
                Créer une Recette
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}