import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
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
  name: z.string().min(1, 'Name is required'),
  ingredients: z.array(
    z.object({
      ingredientId: z.string().min(1, 'Ingredient is required'),
      quantity: z.string().min(1, 'Quantity is required'),
    })
  ),
  subRecipes: z.array(
    z.object({
      subRecipeId: z.string().min(1, 'Subrecipe is required'),
      quantity: z.string().min(1, 'Quantity is required'),
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
      ingredients: [{ ingredientId: '', quantity: '' }],
      subRecipes: [{ subRecipeId: '', quantity: '' }],
    },
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
        description: 'Failed to load ingredients',
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
        description: 'Failed to load subrecipes',
        variant: 'destructive',
      });
    }
  }

  async function loadRecipe(id: number) {
    try {
      const data = await api.recipes.get(id);
      form.reset({
        name: data.name,
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
        description: 'Failed to load recipe',
        variant: 'destructive',
      });
      navigate('/recipes');
    }
  }

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      const data = {
        name: values.name,
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
        title: 'Success',
        description: `Recipe ${id ? 'updated' : 'created'} successfully`,
      });
      navigate('/recipes');
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${id ? 'update' : 'create'} recipe`,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="container max-w-2xl py-6">
      <h1 className="mb-6 text-3xl font-bold">
        {id ? 'Edit' : 'New'} Recipe
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Ingredients Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Ingredients</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  form.setValue('ingredients', [
                    ...form.getValues('ingredients'),
                    { ingredientId: '', quantity: '' },
                  ])
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Ingredient
              </Button>
            </div>

            {form.getValues('ingredients').map((_, index) => (
              <div key={index} className="flex gap-4">
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
                            <SelectValue placeholder="Select ingredient" />
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
                          placeholder="Quantity"
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
                  className="self-start text-red-600"
                  onClick={() => {
                    const ingredients = form.getValues('ingredients');
                    if (ingredients.length > 1) {
                      form.setValue(
                        'ingredients',
                        ingredients.filter((_, i) => i !== index)
                      );
                    }
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Subrecipes Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Subrecipes</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  form.setValue('subRecipes', [
                    ...form.getValues('subRecipes'),
                    { subRecipeId: '', quantity: '' },
                  ])
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Subrecipe
              </Button>
            </div>

            {form.getValues('subRecipes').map((_, index) => (
              <div key={index} className="flex gap-4">
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
                            <SelectValue placeholder="Select subrecipe" />
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
                          placeholder="Quantity"
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
                  className="self-start text-red-600"
                  onClick={() => {
                    const subRecipes = form.getValues('subRecipes');
                    if (subRecipes.length > 1) {
                      form.setValue(
                        'subRecipes',
                        subRecipes.filter((_, i) => i !== index)
                      );
                    }
                  }}
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
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}