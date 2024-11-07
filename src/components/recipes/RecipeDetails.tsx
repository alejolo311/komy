// @ts-nocheck
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import type { Recipe } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle } from 'lucide-react';

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercentage = (value: number) => {
  return value.toFixed(1) + '%';
};

interface RecipeDetailsProps {
  recipeId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecipeDetails({ recipeId, open, onOpenChange }: RecipeDetailsProps) {
  const { toast } = useToast();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (recipeId) {
      loadRecipe(recipeId);
    }
  }, [recipeId]);

  async function loadRecipe(id: number) {
    setLoading(true);
    try {
      const data = await api.recipes.get(id);
      setRecipe(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al cargar los detalles de la receta',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const isPriceWarning = recipe?.salePrice < recipe?.minSalePrice;
  const realFoodCost = recipe ? (recipe.totalCost / recipe.salePrice) * 100 : 0;
  const foodCostDifference = recipe ? realFoodCost - recipe.foodCostPercentage : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 text-gray-100 border-gray-700 max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            {loading ? 'Cargando...' : recipe?.name}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : recipe ? (
          <ScrollArea className="h-[calc(80vh-8rem)]">
            <div className="space-y-6 pr-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Costo Total</h3>
                  <p className="text-2xl font-bold text-green-500">
                    {formatCOP(recipe.totalCost)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Precio de Venta</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-gray-200">
                      {formatCOP(recipe.salePrice)}
                    </p>
                    {isPriceWarning && (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  {isPriceWarning && (
                    <p className="text-sm text-yellow-500">
                      Precio mínimo sugerido: {formatCOP(recipe.minSalePrice)}
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Food Cost</h3>
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <p className={`text-2xl font-bold ${realFoodCost > 35 ? 'text-red-500' : 'text-gray-200'
                        }`}>
                        {formatPercentage(realFoodCost)}
                      </p>
                      <p className="text-sm text-gray-400">real</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className={`text-lg ${recipe.foodCostPercentage > 35 ? 'text-red-500' : 'text-gray-400'
                        }`}>
                        {formatPercentage(recipe.foodCostPercentage)}
                      </p>
                      <p className="text-sm text-gray-400">objetivo</p>
                    </div>
                    {Math.abs(foodCostDifference) >= 0.1 && (
                      <p className={`text-sm ${foodCostDifference > 0 ? 'text-red-400' : 'text-green-400'
                        }`}>
                        {foodCostDifference > 0 ? '+' : ''}
                        {formatPercentage(foodCostDifference)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Columna de Ingredientes */}
                {recipe.ingredients.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-200">Ingredientes</h3>
                    <div className="space-y-3">
                      {recipe.ingredients.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50"
                        >
                          <div>
                            <p className="font-medium text-gray-200">{item.ingredient.name}</p>
                            <p className="text-sm text-gray-400">
                              {item.quantity} {item.ingredient.unit}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-500">
                              {formatCOP(item.ingredient.price * item.quantity)}
                            </p>
                            <p className="text-sm text-gray-400">
                              {formatCOP(item.ingredient.price)} / {item.ingredient.unit}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Columna de Subrecetas */}
                {recipe.subRecipes && recipe.subRecipes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-200">Subrecetas</h3>
                    <div className="space-y-3">
                      {recipe.subRecipes.map((item) => (
                        <div
                          key={item.subRecipeId}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50"
                        >
                          <div>
                            <p className="font-medium text-gray-200">{item.subRecipe.name}</p>
                            <p className="text-sm text-gray-400">
                              {item.quantity} g
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-500">
                              {formatCOP((item.subRecipe.totalCost / item.subRecipe.yield) * item.quantity)}
                            </p>
                            <p className="text-sm text-gray-400">
                              {formatCOP(item.subRecipe.totalCost)} / {item.subRecipe.yield}g
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}