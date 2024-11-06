import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/shared/page-header';
import { ConfirmDelete } from '@/components/shared/confirm-delete';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import type { Subrecipe } from '@/types';

export function SubrecipeList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subrecipes, setSubrecipes] = useState<Subrecipe[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    loadSubrecipes();
  }, []);

  async function loadSubrecipes() {
    try {
      const data = await api.subrecipes.list();
      setSubrecipes(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load subrecipes',
        variant: 'destructive',
      });
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.subrecipes.delete(id);
      setDeleteId(null);
      toast({
        title: 'Success',
        description: 'Subrecipe deleted successfully',
      });
      loadSubrecipes();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete subrecipe',
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
      accessorKey: 'totalCost',
      header: 'Total Cost',
      cell: ({ row }) => (
        <span>${row.original.totalCost.toFixed(2)}</span>
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
        title="Subrecipes"
        onAdd={() => navigate('new')}
        addButtonText="Add Subrecipe"
      />

      <DataTable columns={columns} data={subrecipes} />

      <ConfirmDelete
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
      />
    </div>
  );
}