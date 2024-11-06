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

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

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
        description: 'Error al cargar los ingredientes',
        variant: 'destructive',
      });
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.ingredients.delete(id);
      setDeleteId(null);
      toast({
        title: 'Éxito',
        description: 'Ingrediente eliminado correctamente',
      });
      loadIngredients();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al eliminar el ingrediente',
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
      accessorKey: 'price',
      header: 'Precio',
      cell: ({ row }) => (
        <span className="text-green-500 font-medium">
          {formatCOP(row.original.price)}
        </span>
      ),
    },
    {
      accessorKey: 'unit',
      header: 'Unidad',
      cell: ({ row }) => {
        const unitLabels: Record<string, string> = {
          'kg': 'Kilogramos',
          'g': 'Gramos',
          'l': 'Litros',
          'ml': 'Mililitros',
          'unit': 'Unidad',
        };
        return unitLabels[row.original.unit] || row.original.unit;
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
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
        title="Ingredientes"
        onAdd={() => navigate('new')}
        addButtonText="Agregar Ingrediente"
      />

      <div className="rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <DataTable 
          columns={columns} 
          data={ingredients}
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
    </div>
  );
}