import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { AirtableService } from '@/lib/airtable';
import { RecipeCard } from '@/components/RecipeCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface SearchPageProps {
  searchParams: {
    name?: string;
    ingredient?: string;
    dishType?: string;
  };
}

export default async function RecipeSearchPage({ searchParams }: SearchPageProps) {
  try {
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

    const { name, ingredient, dishType } = searchParams;
    const isSearching = name || ingredient || dishType;
    
    // Get all recipes for dropdown options
    const allRecipes = await AirtableService.getAllRecipes(user.id);
    
    // Extract unique dish types for filter dropdown
    const dishTypes = Array.from(new Set(allRecipes.map(recipe => recipe.dishType))).filter(Boolean).sort();
    
    // Search recipes if search params are provided
    let searchResults = [];
    if (isSearching) {
      searchResults = await AirtableService.searchRecipes(user.id, {
        name,
        ingredient,
        dishType,
      });
    }

    return (
      <div className="container py-8 relative z-10">
        <div className="flex items-center mb-8 gap-4">
          <Link href="/recipes">
            <Button variant="ghost" size="icon" className="text-orange-600 hover:bg-orange-50">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Rechercher des Recettes
            </h1>
            <p className="text-gray-600">
              Trouvez des recettes par nom, ingrédient ou type de plat
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="backdrop-blur-sm bg-white/90 shadow-lg border-0 ring-1 ring-orange-200 mb-8">
            <CardContent className="pt-6">
              <form className="grid grid-cols-1 md:grid-cols-3 gap-4" action="/recipes/search">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la Recette
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Rechercher par nom"
                    defaultValue={name}
                    className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                  />
                </div>
                
                <div>
                  <label htmlFor="ingredient" className="block text-sm font-medium text-gray-700 mb-2">
                    Ingrédient
                  </label>
                  <Input
                    id="ingredient"
                    name="ingredient"
                    placeholder="Rechercher par ingrédient"
                    defaultValue={ingredient}
                    className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                  />
                </div>
                
                <div>
                  <label htmlFor="dishType" className="block text-sm font-medium text-gray-700 mb-2">
                    Type de Plat
                  </label>
                  <Select name="dishType" defaultValue={dishType}>
                    <SelectTrigger className="border-orange-200 focus:border-orange-400 focus:ring-orange-400">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent className="border-orange-200">
                      <SelectItem value="_all">Tous les types</SelectItem>
                      {dishTypes.map((type) => (
                        type && <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-3">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium py-2.5 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Rechercher
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {isSearching && (
            <>
              <h2 className="text-xl font-semibold mb-4 text-orange-600">
                {searchResults.length === 0
                  ? 'Aucune recette trouvée'
                  : `${searchResults.length} recette${searchResults.length > 1 ? 's' : ''} trouvée${searchResults.length > 1 ? 's' : ''}`}
              </h2>
              
              {searchResults.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in search page:', error);
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4 text-orange-600">Une erreur est survenue</h1>
          <p className="mb-6 text-gray-600">
            Nous n'avons pas pu traiter votre recherche. Veuillez réessayer plus tard.
          </p>
          <Link href="/recipes">
            <Button className="bg-orange-500 hover:bg-orange-600">
              Retourner à Mes Recettes
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}