import { Recipe } from '@/types/recipe';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Clock, Users } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { id, name, description, dishType, prepTime, cookTime, servings } = recipe;
  const totalTime = prepTime + cookTime;

  return (
    <Link href={`/recipes/${id}`} className="block group transition-all">
      <Card className="h-full overflow-hidden hover:shadow-lg transition-all backdrop-blur-sm bg-white/90 border-0 ring-1 ring-orange-200 group-hover:ring-orange-300">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl text-gray-800 group-hover:text-orange-600 transition-colors">
              {name}
            </CardTitle>
            <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
              {dishType}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2 text-gray-600">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex flex-wrap gap-2">
            {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
              <Badge key={index} variant="secondary" className="text-xs bg-amber-50 text-amber-700 hover:bg-amber-100">
                {ingredient.name}
              </Badge>
            ))}
            {recipe.ingredients.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-amber-50 text-amber-700 hover:bg-amber-100">
                +{recipe.ingredients.length - 3} autres
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-gray-600 pt-0">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-orange-500" />
            <span>{totalTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-orange-500" />
            <span>{servings} portion{servings > 1 ? 's' : ''}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}