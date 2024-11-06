import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/shared/page-header';
import { ConfirmDelete } from '@/components/shared/confirm-delete';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import type { Ingredient } from '@/types';

export function IngredientList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    loadIngredients();
  }, []);

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

  async function handleDelete(id: number) {
    try {
      await api.ingredients.delete(id);
      setDeleteId(null);
      toast({
        title: 'Success',
        description: 'Ingredient deleted successfully',
      });
      loadIngredients();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete ingredient',
        variant: 'destructive',
      });
    }
  }

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => (
        <span>${row.original.price.toFixed(2)}</span>
      ),
    },
    {
      accessorKey: 'unit',
      header: 'Unit',
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
        title="Ingredients"
        onAdd={() => navigate('new')}
        addButtonText="Add Ingredient"
      />

      <DataTable columns={columns} data={ingredients} />

      <ConfirmDelete
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
      />
    </div>
  );
}