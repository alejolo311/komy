import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/shared/page-header';
import { ConfirmDelete } from '@/components/shared/confirm-delete';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import type { Expense } from '@/types';

const expenseTypes = {
  OPERATIVE: 'Operative',
  PERSONNEL: 'Personnel',
  FOOD_COST: 'Food Cost',
};

export function ExpenseList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  async function loadExpenses() {
    try {
      const data = await api.expenses.list();
      setExpenses(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load expenses',
        variant: 'destructive',
      });
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.expenses.delete(id);
      setDeleteId(null);
      toast({
        title: 'Success',
        description: 'Expense deleted successfully',
      });
      loadExpenses();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete expense',
        variant: 'destructive',
      });
    }
  }

  const columns = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        const date = new Date(row.original.date);
        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => expenseTypes[row.original.type as keyof typeof expenseTypes],
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <span>${row.original.amount.toFixed(2)}</span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`${row.original.id}/edit`)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-600"
            onClick={() => setDeleteId(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container py-6">
      <PageHeader
        title="Expenses"
        onAdd={() => navigate('new')}
        addButtonText="Add Expense"
      />

      <DataTable columns={columns} data={expenses} />

      <ConfirmDelete
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
      />
    </div>
  );
}