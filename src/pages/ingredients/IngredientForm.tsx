import { useEffect } from 'react';
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
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.string().min(1, 'Price is required'),
  unit: z.string().min(1, 'Unit is required'),
});

const units = ['kg', 'g', 'l', 'ml', 'unit'];

export function IngredientForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      price: '',
      unit: '',
    },
  });

  useEffect(() => {
    if (id) {
      loadIngredient(parseInt(id));
    }
  }, [id]);

  async function loadIngredient(id: number) {
    try {
      const data = await api.ingredients.get(id);
      form.reset({
        name: data.name,
        price: data.price.toString(),
        unit: data.unit,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load ingredient',
        variant: 'destructive',
      });
      navigate('/ingredients');
    }
  }

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      const data = {
        ...values,
        price: parseFloat(values.price),
      };

      if (id) {
        await api.ingredients.update(parseInt(id), data);
      } else {
        await api.ingredients.create(data);
      }

      toast({
        title: 'Success',
        description: `Ingredient ${id ? 'updated' : 'created'} successfully`,
      });
      navigate('/ingredients');
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${id ? 'update' : 'create'} ingredient`,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="container max-w-2xl py-6">
      <h1 className="mb-6 text-3xl font-bold">
        {id ? 'Edit' : 'New'} Ingredient
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

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
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

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/ingredients')}
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