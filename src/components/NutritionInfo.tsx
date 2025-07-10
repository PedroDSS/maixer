import { NutritionalInfo } from '@/types/recipe';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface NutritionInfoProps {
  nutritionalInfo: NutritionalInfo;
}

export function NutritionInfo({ nutritionalInfo }: NutritionInfoProps) {
  // Calculate percentage for macronutrients
  const totalMacros = nutritionalInfo.proteins + nutritionalInfo.carbohydrates + nutritionalInfo.fats;
  const proteinPercentage = Math.round((nutritionalInfo.proteins / totalMacros) * 100);
  const carbsPercentage = Math.round((nutritionalInfo.carbohydrates / totalMacros) * 100);
  const fatsPercentage = Math.round((nutritionalInfo.fats / totalMacros) * 100);

  return (
    <Card className="backdrop-blur-sm bg-white/90 shadow-lg border-0 ring-1 ring-orange-200">
      <CardHeader>
        <CardTitle className="text-xl text-orange-600 flex items-center gap-2">
          <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow">
            <span className="text-white text-xs font-bold">N</span>
          </div>
          Informations Nutritionnelles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <div className="text-lg font-medium text-gray-800">Calories</div>
            <div className="text-lg font-medium text-orange-600">{nutritionalInfo.calories} kcal</div>
          </div>
          <Separator className="my-4 bg-orange-100" />
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Protéines</div>
              <div className="font-medium text-gray-800">{nutritionalInfo.proteins}g</div>
              <Progress value={proteinPercentage} className="h-2 mt-1 bg-orange-100" />
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Glucides</div>
              <div className="font-medium text-gray-800">{nutritionalInfo.carbohydrates}g</div>
              <Progress value={carbsPercentage} className="h-2 mt-1 bg-orange-100" />
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Lipides</div>
              <div className="font-medium text-gray-800">{nutritionalInfo.fats}g</div>
              <Progress value={fatsPercentage} className="h-2 mt-1 bg-orange-100" />
            </div>
          </div>
        </div>

        <Tabs defaultValue="vitamins">
          <TabsList className="grid w-full grid-cols-2 bg-orange-50">
            <TabsTrigger 
              value="vitamins" 
              className="data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow"
            >
              Vitamines
            </TabsTrigger>
            <TabsTrigger 
              value="minerals"
              className="data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow"
            >
              Minéraux
            </TabsTrigger>
          </TabsList>
          <TabsContent value="vitamins" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(nutritionalInfo.vitamins).map(([vitamin, value]) => (
                <div key={vitamin} className="flex justify-between items-center py-1 border-b border-orange-50">
                  <div className="font-medium text-gray-700">Vitamine {vitamin}</div>
                  <div className="text-orange-600 font-medium">{value}%</div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="minerals" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(nutritionalInfo.minerals).map(([mineral, value]) => (
                <div key={mineral} className="flex justify-between items-center py-1 border-b border-orange-50">
                  <div className="font-medium text-gray-700 capitalize">{mineral}</div>
                  <div className="text-orange-600 font-medium">{value}%</div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}