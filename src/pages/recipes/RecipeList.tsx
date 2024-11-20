// @ts-nocheck
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Eye, Trash2, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/shared/page-header';
import { ConfirmDelete } from '@/components/shared/confirm-delete';
import { RecipeDetails } from '@/components/recipes/RecipeDetails';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import type { Recipe } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercentage = (value: number) => {
  return value.toFixed(1) + '%';
};

export function RecipeList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }]);

  useEffect(() => {
    loadRecipes();
  }, []);

  async function loadRecipes() {
    try {
      const data = await api.recipes.list();
      setRecipes(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al cargar las recetas',
        variant: 'destructive',
      });
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.recipes.delete(id);
      setDeleteId(null);
      toast({
        title: 'Éxito',
        description: 'Receta eliminada correctamente',
      });
      loadRecipes();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al eliminar la receta',
        variant: 'destructive',
      });
    }
  }

  const columns: ColumnDef<Recipe>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          Nombre
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 hover:bg-gray-700"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: 'totalCost',
      header: 'Costo Total',
      cell: ({ row }) => (
        <span className="text-green-500 font-medium">
          {formatCOP(row.getValue('totalCost'))}
        </span>
      ),
    },
    {
      accessorKey: 'salePrice',
      header: 'Precio de Venta',
      cell: ({ row }) => (
        <span className="font-medium">
          {formatCOP(row.getValue('salePrice'))}
        </span>
      ),
    },
    {
      accessorKey: 'foodCostPercentage',
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          Food Cost Objetivo
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 hover:bg-gray-700"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <span className={row.getValue('foodCostPercentage') > 35 ? 'text-red-500' : ''}>
          {formatPercentage(row.getValue('foodCostPercentage'))}
        </span>
      ),
    },
    {
      id: 'realFoodCost',
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          Food Cost Real
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 hover:bg-gray-700"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      ),
      accessorFn: (row) => (row.totalCost / row.salePrice) * 100,
      cell: ({ row }) => {
        const realFoodCost = (row.original.totalCost / row.original.salePrice) * 100;
        const difference = realFoodCost - row.original.foodCostPercentage;
        return (
          <div className="space-y-1">
            <span className={realFoodCost > 35 ? 'text-red-500' : ''}>
              {formatPercentage(realFoodCost)}
            </span>
            {Math.abs(difference) >= 0.1 && (
              <span className={`text-xs block ${difference > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {difference > 0 ? '+' : ''}{formatPercentage(difference)}
              </span>
            )}
          </div>
        );
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
        title="Recetas"
        onAdd={() => navigate('new')}
        addButtonText="Agregar Receta"
      />

      <div className="rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <DataTable
          columns={columns}
          data={recipes}
          className="text-gray-200"
          sorting={sorting}
          onSortingChange={setSorting}
        />
      </div>

      <ConfirmDelete
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer."
      />

      <RecipeDetails
        recipeId={selectedId}
        open={selectedId !== null}
        onOpenChange={(open) => !open && setSelectedId(null)}
      />
    </div>
  );
}