import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { AirtableService } from '@/lib/airtable';
import { RecipeCard } from '@/components/RecipeCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Search, ChefHat, Sparkles, Filter } from 'lucide-react';

interface AllRecipesPageProps {
  searchParams: {
    name?: string;
    ingredient?: string;
    dishType?: string;
  };
}

export default async function AllRecipesPage({ searchParams }: AllRecipesPageProps) {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login');
  }

  // Extract search params
  const { name, ingredient, dishType } = searchParams;
  const isSearching = name || ingredient || dishType;
  
  // Get all recipes to extract dish types for filter dropdown
  const allRecipes = await AirtableService.getAllPublicRecipes();
  
  // Extract unique dish types for filter dropdown
  const dishTypes = Array.from(new Set(allRecipes.map(recipe => recipe.dishType))).filter(Boolean).sort();
  
  // Determine which recipes to display
  let recipes = allRecipes;
  
  // If searching, filter the recipes
  if (isSearching) {
    // Filter by name if provided
    if (name) {
      const nameLower = name.toLowerCase();
      recipes = recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(nameLower)
      );
    }
    
    // Filter by dish type if provided and not the "all" value
    if (dishType && dishType !== '_all') {
      recipes = recipes.filter(recipe => recipe.dishType === dishType);
    }
    
    // Filter by ingredient if provided
    if (ingredient) {
      const ingredientLower = ingredient.toLowerCase();
      recipes = recipes.filter((recipe) => 
        recipe.ingredients.some((ing) => 
          ing.name.toLowerCase().includes(ingredientLower)
        )
      );
    }
  }

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

      <div className="mb-8">
        <form className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              id="name"
              name="name"
              placeholder="Rechercher par nom ou ingrédient..."
              defaultValue={name || ingredient}
              className="pl-9 border-orange-200 focus:border-orange-400 focus:ring-orange-400 h-10"
            />
          </div>
          
          <div className="w-full sm:w-40">
            <Select name="dishType" defaultValue={dishType}>
              <SelectTrigger className="border-orange-200 focus:border-orange-400 focus:ring-orange-400 h-10">
                <SelectValue placeholder="Type de plat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">Tous les types</SelectItem>
                {dishTypes.map((type) => (
                  type && <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            type="submit" 
            className="bg-orange-500 hover:bg-orange-600 text-white h-10"
          >
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </Button>
        </form>
      </div>

      {isSearching && recipes.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2 text-orange-600">Aucune recette trouvée</h2>
          <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
        </div>
      ) : recipes.length === 0 ? (
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