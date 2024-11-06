import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import type { Subrecipe } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

interface SubrecipeDetailsProps {
  subrecipeId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubrecipeDetails({ subrecipeId, open, onOpenChange }: SubrecipeDetailsProps) {
  const { toast } = useToast();
  const [subrecipe, setSubrecipe] = useState<Subrecipe | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subrecipeId) {
      loadSubrecipe(subrecipeId);
    }
  }, [subrecipeId]);

  async function loadSubrecipe(id: number) {
    setLoading(true);
    try {
      const data = await api.subrecipes.get(id);
      setSubrecipe(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al cargar los detalles de la subreceta',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 text-gray-100 border-gray-700 max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            {loading ? 'Cargando...' : subrecipe?.name}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : subrecipe ? (
          <ScrollArea className="h-[calc(80vh-8rem)]">
            <div className="space-y-6 pr-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Costo Total</h3>
                  <p className="text-2xl font-bold text-green-500">
                    {formatCOP(subrecipe.totalCost)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Rendimiento</h3>
                  <p className="text-2xl font-bold text-gray-200">
                    {subrecipe.yield} g
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Columna de Ingredientes */}
                {subrecipe.ingredients.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-200">Ingredientes</h3>
                    <div className="space-y-3">
                      {subrecipe.ingredients.map((item) => (
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
                {subrecipe.childSubRecipes && subrecipe.childSubRecipes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-200">Subrecetas</h3>
                    <div className="space-y-3">
                      {subrecipe.childSubRecipes.map((item) => (
                        <div
                          key={item.childSubRecipeId}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50"
                        >
                          <div>
                            <p className="font-medium text-gray-200">{item.childSubRecipe.name}</p>
                            <p className="text-sm text-gray-400">
                              {item.quantity} g
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-500">
                              {formatCOP((item.childSubRecipe.totalCost / item.childSubRecipe.yield) * item.quantity)}
                            </p>
                            <p className="text-sm text-gray-400">
                              {formatCOP(item.childSubRecipe.totalCost)} / {item.childSubRecipe.yield}g
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