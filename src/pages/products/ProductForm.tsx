import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import type { Recipe } from '@/types';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['finished', 'recipe']),
  purchasePrice: z.string().optional(),
  recipeId: z.string().optional(),
});

export function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      type: 'finished',
      purchasePrice: '',
      recipeId: '',
    },
  });

  const watchType = form.watch('type');

  useEffect(() => {
    loadRecipes();
    if (id) {
      loadProduct(parseInt(id));
    }
  }, [id]);

  async function loadRecipes() {
    try {
      const data = await api.recipes.list();
      setRecipes(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load recipes',
        variant: 'destructive',
      });
    }
  }

  async function loadProduct(id: number) {
    try {
      const data = await api.products.get(id);
      form.reset({
        name: data.name,
        type: data.isFinishedProduct ? 'finished' : 'recipe',
        purchasePrice: data.purchasePrice?.toString(),
        recipeId: data.recipeId?.toString(),
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load product',
        variant: 'destructive',
      });
      navigate('/products');
    }
  }

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      const data = {
        name: values.name,
        isFinishedProduct: values.type === 'finished',
        purchasePrice:
          values.type === 'finished'
            ? parseFloat(values.purchasePrice || '0')
            : undefined,
        recipeId:
          values.type === 'recipe'
            ? parseInt(values.recipeId || '0')
            : undefined,
      };

      if (id) {
        await api.products.update(parseInt(id), data);
      } else {
        await api.products.create(data);
      }

      toast({
        title: 'Success',
        description: `Product ${id ? 'updated' : 'created'} successfully`,
      });
      navigate('/products');
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${id ? 'update' : 'create'} product`,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="container max-w-2xl py-6">
      <h1 className="mb-6 text-3xl font-bold">
        {id ? 'Edit' : 'New'} Product
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

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Product Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="finished" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Finished Product
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="recipe" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Recipe Based
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {watchType === 'finished' && (
            <FormField
              control={form.control}
              name="purchasePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Price</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      min="0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {watchType === 'recipe' && (
            <FormField
              control={form.control}
              name="recipeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipe</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a recipe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {recipes.map((recipe) => (
                        <SelectItem
                          key={recipe.id}
                          value={recipe.id.toString()}
                        >
                          {recipe.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/products')}
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