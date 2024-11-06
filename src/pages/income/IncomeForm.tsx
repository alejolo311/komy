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
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';

const schema = z.object({
  amount: z.string().min(1, 'El monto es requerido'),
  date: z.string().min(1, 'La fecha es requerida'),
});

export function IncomeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: '',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  useEffect(() => {
    if (id) {
      loadIncome(parseInt(id));
    }
  }, [id]);

  async function loadIncome(id: number) {
    try {
      const data = await api.income.get(id);
      form.reset({
        amount: data.amount.toString(),
        date: format(new Date(data.date), 'yyyy-MM-dd'),
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al cargar el ingreso',
        variant: 'destructive',
      });
      navigate('/income');
    }
  }

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      const data = {
        amount: parseFloat(values.amount),
        date: new Date(values.date).toISOString(),
      };

      if (id) {
        await api.income.update(parseInt(id), data);
      } else {
        await api.income.create(data);
      }

      toast({
        title: 'Éxito',
        description: `Ingreso ${id ? 'actualizado' : 'creado'} correctamente`,
      });
      navigate('/income');
    } catch (error) {
      toast({
        title: 'Error',
        description: `Error al ${id ? 'actualizar' : 'crear'} el ingreso`,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-6">
      <h1 className="mb-8 text-4xl font-bold text-gray-900">
        {id ? 'Editar' : 'Nuevo'} Ingreso
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
                onClick={() => navigate('/income')}
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