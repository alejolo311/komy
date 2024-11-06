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
  amount: z.string().min(1, 'Amount is required'),
  date: z.string().min(1, 'Date is required'),
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
        description: 'Failed to load income record',
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
        title: 'Success',
        description: `Income record ${id ? 'updated' : 'created'} successfully`,
      });
      navigate('/income');
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${id ? 'update' : 'create'} income record`,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="container max-w-2xl py-6">
      <h1 className="mb-6 text-3xl font-bold">
        {id ? 'Edit' : 'New'} Income Record
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
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
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
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