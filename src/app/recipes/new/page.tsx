'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RecipeGenerationFormValues, recipeGenerationSchema } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ChefHat, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { IngredientSelector, Ingredient } from '@/components/IngredientSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function NewRecipePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'selector' | 'manual'>('selector');
  const router = useRouter();
  const { data: session, status } = useSession();
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<RecipeGenerationFormValues>({
    resolver: zodResolver(recipeGenerationSchema),
    defaultValues: {
      ingredients: [],
      manualIngredients: '',
      servings: 2,
      allergies: '',
    },
  });

  // Effect to redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);
  
  // Effect to update form validation based on active tab
  useEffect(() => {
    // Don't run on first render until form is ready
    if (form) {
      // Reset validation errors when switching tabs
      form.clearErrors();
      
      // Clear the inactive field and validate the active one
      if (activeTab === 'selector') {
        form.setValue('manualIngredients', '', { shouldValidate: false });
      } else {
        form.setValue('ingredients', [], { shouldValidate: false });
      }
    }
  }, [activeTab, form]);
  
  const handleIngredientsChange = (ingredients: Ingredient[]) => {
    form.setValue('ingredients', ingredients, { shouldValidate: true });
  };

  async function onSubmit(data: RecipeGenerationFormValues) {
    try {
      setIsGenerating(true);
      console.log("Form submitted with data:", data);
      
      // Prepare the request body based on whether we're using selected ingredients or manual entry
      const requestBody = {
        selectedIngredients: data.ingredients || [],
        manualIngredients: data.manualIngredients || '',
        servings: data.servings,
        allergies: data.allergies || '',
        useAirtableIngredients: activeTab === 'selector'
      };
      
      console.log("Sending request to API with body:", requestBody);
      
      const response = await fetch('/api/recipes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log("API response status:", response.status);
      const result = await response.json();
      console.log("API response data:", result);

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate recipe');
      }

      toast.success('Recipe generated successfully!');
      router.push(`/recipes/${result.recipe.id}`);
    } catch (error) {
      console.error('Error generating recipe:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate recipe');
    } finally {
      setIsGenerating(false);
    }
  }

  // Show loading or redirect when session is loading
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Only render content when authenticated
  if (status !== 'authenticated') {
    return null;
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-grow flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
        <Link href="/recipes" className="inline-flex">
          <Button variant="ghost" size="icon" className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Nouvelle Recette</h1>
          <p className="text-muted-foreground">
            Créez une nouvelle recette basée sur vos ingrédients et préférences
          </p>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center pb-8">
        <Card className="w-full max-w-2xl backdrop-blur-sm bg-white/90 shadow-lg border-0 ring-1 ring-orange-200">
          <CardHeader className="text-center space-y-4 pb-6 sm:pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Générateur de Recette
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Notre IA créera une recette personnalisée basée sur vos ingrédients et préférences.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs 
                  defaultValue="selector" 
                  value={activeTab} 
                  onValueChange={(value) => setActiveTab(value as 'selector' | 'manual')}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="selector">Ingrédients Airtable</TabsTrigger>
                    <TabsTrigger value="manual">Saisie Manuelle</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="selector" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="ingredients"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Ingrédients</FormLabel>
                          <FormControl>
                            <IngredientSelector
                              onIngredientsChange={handleIngredientsChange}
                              className="w-full"
                            />
                          </FormControl>
                          <FormDescription className="text-gray-500 text-xs sm:text-sm">
                            Sélectionnez les ingrédients que vous souhaitez utiliser dans la recette.
                          </FormDescription>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="manual" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="manualIngredients"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Ingrédients</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Entrez les ingrédients séparés par des virgules (ex: poulet, riz, carottes, oignons)"
                              className="h-24 border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-gray-500 text-xs sm:text-sm">
                            Listez tous les ingrédients que vous souhaitez utiliser dans la recette.
                          </FormDescription>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
                
                <FormField
                  control={form.control}
                  name="servings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Nombre de Portions</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1} 
                          max={20} 
                          className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-gray-500 text-xs sm:text-sm">
                        Combien de personnes cette recette servira-t-elle ?
                      </FormDescription>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Allergies ou Intolérances Alimentaires (Optionnel)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Entrez les allergies séparées par des virgules (ex: gluten, lactose, noix)"
                          className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-gray-500 text-xs sm:text-sm">
                        Listez les allergies ou intolérances à éviter dans la recette.
                      </FormDescription>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium py-2.5 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-8"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span className="whitespace-nowrap">Génération en cours...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      <span className="whitespace-nowrap">Générer la Recette</span>
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="text-xs sm:text-sm text-gray-500 text-center px-4 py-4 sm:py-6">
            Astuce : Plus votre liste d'ingrédients est précise, meilleure sera la recette.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}