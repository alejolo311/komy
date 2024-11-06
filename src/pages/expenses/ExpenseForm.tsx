import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
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
  amount: z.string().min(1, 'El monto es requerido'),
  type: z.enum(['OPERATIVE', 'PERSONNEL', 'FOOD_COST'], {
    required_error: 'El tipo es requerido',
  }),
  date: z.string().min(1, 'La fecha es requerida'),
});

const expenseTypes = [
  { value: 'OPERATIVE', label: 'Operativo' },
  { value: 'PERSONNEL', label: 'Personal' },
  { value: 'FOOD_COST', label: 'Costo de Alimentos' },
];

export function ExpenseForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: '',
      type: 'OPERATIVE',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  useEffect(() => {
    if (id) {
      loadExpense(parseInt(id));
    }
  }, [id]);

  async function loadExpense(id: number) {
    try {
      const data = await api.expenses.get(id);
      form.reset({
        amount: data.amount.toString(),
        type: data.type,
        date: format(new Date(data.date), 'yyyy-MM-dd'),
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al cargar el gasto',
        variant: 'destructive',
      });
      navigate('/expenses');
    }
  }

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      const data = {
        amount: parseFloat(values.amount),
        type: values.type,
        date: new Date(values.date).toISOString(),
      };

      if (id) {
        await api.expenses.update(parseInt(id), data);
      } else {
        await api.expenses.create(data);
      }

      toast({
        title: 'Éxito',
        description: `Gasto ${id ? 'actualizado' : 'creado'} correctamente`,
      });
      navigate('/expenses');
    } catch (error) {
      toast({
        title: 'Error',
        description: `Error al ${id ? 'actualizar' : 'crear'} el gasto`,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-6">
      <h1 className="mb-8 text-4xl font-bold text-gray-900">
        {id ? 'Editar' : 'Nuevo'} Gasto
      </h1>

      <div className="rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Monto</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="1"
                      min="0"
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Ingrese el monto"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Tipo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Seleccione el tipo de gasto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {expenseTypes.map((type) => (
                        <SelectItem
                          key={type.value}
                          value={type.value}
                          className="text-gray-200 focus:bg-gray-700 focus:text-white"
                        >
                          {type.label}
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
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Fecha</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/expenses')}
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