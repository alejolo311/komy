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
import type { Ingredient } from '@/types';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  ingredients: z.array(
    z.object({
      ingredientId: z.string().min(1, 'Ingredient is required'),
      quantity: z.string().min(1, 'Quantity is required'),
    })
  ),
});

export function SubrecipeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      ingredients: [{ ingredientId: '', quantity: '' }],
    },
  });

  useEffect(() => {
    loadIngredients();
    if (id) {
      loadSubrecipe(parseInt(id));
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

  async function loadSubrecipe(id: number) {
    try {
      const data = await api.subrecipes.get(id);
      form.reset({
        name: data.name,
        ingredients: data.ingredients.map((i: any) => ({
          ingredientId: i.ingredientId.toString(),
          quantity: i.quantity.toString(),
        })),
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load subrecipe',
        variant: 'destructive',
      });
      navigate('/subrecipes');
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
      };

      if (id) {
        await api.subrecipes.update(parseInt(id), data);
      } else {
        await api.subrecipes.create(data);
      }

      toast({
        title: 'Success',
        description: `Subrecipe ${id ? 'updated' : 'created'} successfully`,
      });
      navigate('/subrecipes');
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${id ? 'update' : 'create'} subrecipe`,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="container max-w-2xl py-6">
      <h1 className="mb-6 text-3xl font-bold">
        {id ? 'Edit' : 'New'} Subrecipe
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/subrecipes')}
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