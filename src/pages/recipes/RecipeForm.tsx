import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import type { Ingredient, Subrecipe } from '@/types';

const schema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  salePrice: z.string().min(1, 'El precio de venta es requerido'),
  foodCostPercentage: z.string().min(1, 'El porcentaje de costo de alimentos es requerido'),
  ingredients: z.array(
    z.object({
      ingredientId: z.string().min(1, 'El ingrediente es requerido'),
      quantity: z.string().min(1, 'La cantidad es requerida'),
    })
  ),
  subRecipes: z.array(
    z.object({
      subRecipeId: z.string().min(1, 'La subreceta es requerida'),
      quantity: z.string().min(1, 'La cantidad es requerida'),
    })
  ),
});

export function RecipeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [subrecipes, setSubrecipes] = useState<Subrecipe[]>([]);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      salePrice: '',
      foodCostPercentage: '',
      ingredients: [{ ingredientId: '', quantity: '' }],
      subRecipes: [],
    },
  });

  const ingredientsArray = useFieldArray({
    control: form.control,
    name: "ingredients"
  });

  const subRecipesArray = useFieldArray({
    control: form.control,
    name: "subRecipes"
  });

  useEffect(() => {
    loadIngredients();
    loadSubrecipes();
    if (id) {
      loadRecipe(parseInt(id));
    }
  }, [id]);

  async function loadIngredients() {
    try {
      const data = await api.ingredients.list();
      setIngredients(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al cargar los ingredientes',
        variant: 'destructive',
      });
    }
  }

  async function loadSubrecipes() {
    try {
      const data = await api.subrecipes.list();
      setSubrecipes(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al cargar las subrecetas',
        variant: 'destructive',
      });
    }
  }

  async function loadRecipe(id: number) {
    try {
      const data = await api.recipes.get(id);
      form.reset({
        name: data.name,
        salePrice: data.salePrice.toString(),
        foodCostPercentage: data.foodCostPercentage.toString(),
        ingredients: data.ingredients.map((i: any) => ({
          ingredientId: i.ingredientId.toString(),
          quantity: i.quantity.toString(),
        })),
        subRecipes: data.subRecipes.map((s: any) => ({
          subRecipeId: s.subRecipeId.toString(),
          quantity: s.quantity.toString(),
        })),
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al cargar la receta',
        variant: 'destructive',
      });
      navigate('/recipes');
    }
  }

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      const data = {
        name: values.name,
        salePrice: parseFloat(values.salePrice),
        foodCostPercentage: parseFloat(values.foodCostPercentage),
        ingredients: values.ingredients.map((i) => ({
          ingredientId: parseInt(i.ingredientId),
          quantity: parseFloat(i.quantity),
        })),
        subRecipes: values.subRecipes.map((s) => ({
          subRecipeId: parseInt(s.subRecipeId),
          quantity: parseFloat(s.quantity),
        })),
      };

      if (id) {
        await api.recipes.update(parseInt(id), data);
      } else {
        await api.recipes.create(data);
      }

      toast({
        title: 'Éxito',
        description: `Receta ${id ? 'actualizada' : 'creada'} correctamente`,
      });
      navigate('/recipes');
    } catch (error) {
      toast({
        title: 'Error',
        description: `Error al ${id ? 'actualizar' : 'crear'} la receta`,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-6">
      <h1 className="mb-8 text-4xl font-bold text-gray-900">
        {id ? 'Editar' : 'Nueva'} Receta
      </h1>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nombre de la receta" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio de Venta</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="1"
                        min="0"
                        placeholder="Precio de venta"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="foodCostPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Food Cost %</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="Porcentaje"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Ingredientes</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => ingredientsArray.append({ ingredientId: '', quantity: '' })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Ingrediente
                </Button>
              </div>

              {ingredientsArray.fields.map((field, index) => (
                <div key={field.id} className="flex gap-4">
                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.ingredientId`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione ingrediente" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ingredients.map((ingredient) => (
                              <SelectItem
                                key={ingredient.id}
                                value={ingredient.id.toString()}
                              >
                                {ingredient.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="Cantidad"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="self-start text-red-600 hover:text-red-500"
                    onClick={() => ingredientsArray.fields.length > 1 && ingredientsArray.remove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Subrecetas</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => subRecipesArray.append({ subRecipeId: '', quantity: '' })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Subreceta
                </Button>
              </div>

              {subRecipesArray.fields.map((field, index) => (
                <div key={field.id} className="flex gap-4">
                  <FormField
                    control={form.control}
                    name={`subRecipes.${index}.subRecipeId`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione subreceta" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subrecipes.map((subrecipe) => (
                              <SelectItem
                                key={subrecipe.id}
                                value={subrecipe.id.toString()}
                              >
                                {subrecipe.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`subRecipes.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="Cantidad (g)"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="self-start text-red-600 hover:text-red-500"
                    onClick={() => subRecipesArray.remove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/recipes')}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Guardar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}