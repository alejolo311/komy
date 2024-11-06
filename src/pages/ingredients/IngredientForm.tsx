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
  name: z.string().min(1, 'El nombre es requerido'),
  price: z.string().min(1, 'El precio es requerido'),
  unit: z.string().min(1, 'La unidad es requerida'),
});

const units = [
  { value: 'kg', label: 'Kilogramos' },
  { value: 'g', label: 'Gramos' },
  { value: 'l', label: 'Litros' },
  { value: 'ml', label: 'Mililitros' },
  { value: 'unit', label: 'Unidad' },
];

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
        description: 'Error al cargar el ingrediente',
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
        title: 'Éxito',
        description: `Ingrediente ${id ? 'actualizado' : 'creado'} correctamente`,
      });
      navigate('/ingredients');
    } catch (error) {
      toast({
        title: 'Error',
        description: `Error al ${id ? 'actualizar' : 'crear'} el ingrediente`,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-6">
      <h1 className="mb-8 text-4xl font-bold text-gray-900">
        {id ? 'Editar' : 'Nuevo'} Ingrediente
      </h1>

      <div className="rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Nombre</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Ingrese el nombre del ingrediente"
                    />
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
                  <FormLabel className="text-gray-200">Precio</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="1"
                      min="0"
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Ingrese el precio"
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
                  <FormLabel className="text-gray-200">Unidad</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Seleccione una unidad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {units.map((unit) => (
                        <SelectItem
                          key={unit.value}
                          value={unit.value}
                          className="text-gray-200 focus:bg-gray-700 focus:text-white"
                        >
                          {unit.label}
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
                className="border-gray-700 text-gray-200 hover:bg-gray-800 hover:text-white"
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