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
  amount: z.string().min(1, 'Amount is required'),
  type: z.enum(['OPERATIVE', 'PERSONNEL', 'FOOD_COST']),
  date: z.string().min(1, 'Date is required'),
});

const expenseTypes = [
  { value: 'OPERATIVE', label: 'Operative' },
  { value: 'PERSONNEL', label: 'Personnel' },
  { value: 'FOOD_COST', label: 'Food Cost' },
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
        description: 'Failed to load expense',
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
        title: 'Success',
        description: `Expense ${id ? 'updated' : 'created'} successfully`,
      });
      navigate('/expenses');
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${id ? 'update' : 'create'} expense`,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="container max-w-2xl py-6">
      <h1 className="mb-6 text-3xl font-bold">
        {id ? 'Edit' : 'New'} Expense
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
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select expense type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {expenseTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
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
              onClick={() => navigate('/expenses')}
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