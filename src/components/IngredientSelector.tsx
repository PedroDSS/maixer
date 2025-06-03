'use client';

import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  unit: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  isAllergen: boolean;
  containsGluten: boolean;
  containsLactose: boolean;
}

interface IngredientSelectorProps {
  onIngredientsChange: (ingredients: Ingredient[]) => void;
  className?: string;
}

export function IngredientSelector({ onIngredientsChange, className }: IngredientSelectorProps) {
  const [open, setOpen] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIngredients() {
      try {
        setLoading(true);
        const response = await fetch('/api/ingredients');
        
        if (!response.ok) {
          throw new Error('Failed to fetch ingredients');
        }
        
        const data = await response.json();
        setIngredients(data);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchIngredients();
  }, []);

  const handleSelect = (ingredient: Ingredient) => {
    const isAlreadySelected = selectedIngredients.some(
      (selected) => selected.id === ingredient.id
    );

    if (!isAlreadySelected) {
      const newSelected = [...selectedIngredients, ingredient];
      setSelectedIngredients(newSelected);
      onIngredientsChange(newSelected);
    }
    
    setOpen(false);
  };

  const handleRemove = (ingredientId: string) => {
    const newSelected = selectedIngredients.filter(
      (ingredient) => ingredient.id !== ingredientId
    );
    setSelectedIngredients(newSelected);
    onIngredientsChange(newSelected);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between border-orange-200 focus:border-orange-400 focus:ring-orange-400"
            disabled={loading}
          >
            {loading 
              ? "Chargement des ingrédients..." 
              : "Sélectionner des ingrédients"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 max-h-[300px] overflow-y-auto">
          <Command>
            <CommandInput placeholder="Rechercher un ingrédient..." />
            <CommandEmpty>Aucun ingrédient trouvé.</CommandEmpty>
            <CommandGroup>
              {ingredients.map((ingredient) => (
                <CommandItem
                  key={ingredient.id}
                  value={ingredient.name}
                  onSelect={() => handleSelect(ingredient)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedIngredients.some(
                        (selected) => selected.id === ingredient.id
                      )
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <span className="flex-1">{ingredient.name}</span>
                  <span className="text-xs text-muted-foreground">{ingredient.category}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-2">
        {selectedIngredients.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucun ingrédient sélectionné
          </p>
        ) : (
          selectedIngredients.map((ingredient) => (
            <Badge
              key={ingredient.id}
              variant="secondary"
              className="bg-orange-100 text-orange-700 hover:bg-orange-200"
            >
              {ingredient.name}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 pl-1 text-orange-700 hover:text-orange-900 hover:bg-transparent"
                onClick={() => handleRemove(ingredient.id)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove</span>
              </Button>
            </Badge>
          ))
        )}
      </div>
    </div>
  );
}