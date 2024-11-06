import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/shared/page-header';
import { ConfirmDelete } from '@/components/shared/confirm-delete';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import type { Income } from '@/types';

export function IncomeList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    loadIncomes();
  }, []);

  async function loadIncomes() {
    try {
      const data = await api.income.list();
      setIncomes(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load income records',
        variant: 'destructive',
      });
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.income.delete(id);
      setDeleteId(null);
      toast({
        title: 'Success',
        description: 'Income record deleted successfully',
      });
      loadIncomes();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete income record',
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
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <span className="text-green-600 font-medium">
          ${row.original.amount.toFixed(2)}
        </span>
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
        title="Income"
        onAdd={() => navigate('new')}
        addButtonText="Add Income"
      />

      <DataTable columns={columns} data={incomes} />

      <ConfirmDelete
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
      />
    </div>
  );
}