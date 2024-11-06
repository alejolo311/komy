import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/shared/page-header';
import { ConfirmDelete } from '@/components/shared/confirm-delete';
import { SubrecipeDetails } from '@/components/subrecipes/SubrecipeDetails';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import type { Subrecipe } from '@/types';

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function SubrecipeList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subrecipes, setSubrecipes] = useState<Subrecipe[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

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
        description: 'Error al cargar las subrecetas',
        variant: 'destructive',
      });
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.subrecipes.delete(id);
      setDeleteId(null);
      toast({
        title: 'Éxito',
        description: 'Subreceta eliminada correctamente',
      });
      loadSubrecipes();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al eliminar la subreceta',
        variant: 'destructive',
      });
    }
  }

  const columns = [
    {
      accessorKey: 'name',
      header: 'Nombre',
    },
    {
      accessorKey: 'totalCost',
      header: 'Costo Total',
      cell: ({ row }) => (
        <span className="text-green-500 font-medium">
          {formatCOP(row.original.totalCost)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedId(row.original.id)}
            className="hover:text-white"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`${row.original.id}/edit`)}
            className="hover:text-white"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-600 hover:text-red-500"
            onClick={() => setDeleteId(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container max-w-6xl mx-auto py-6">
      <PageHeader
        title="Subrecetas"
        onAdd={() => navigate('new')}
        addButtonText="Agregar Subreceta"
      />

      <div className="rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <DataTable
          columns={columns}
          data={subrecipes}
          className="text-gray-200"
        />
      </div>

      <ConfirmDelete
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer."
      />

      <SubrecipeDetails
        subrecipeId={selectedId}
        open={selectedId !== null}
        onOpenChange={(open) => !open && setSelectedId(null)}
      />
    </div>
  );
}