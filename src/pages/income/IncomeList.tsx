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

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

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
        description: 'Error al cargar los ingresos',
        variant: 'destructive',
      });
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.income.delete(id);
      setDeleteId(null);
      toast({
        title: 'Éxito',
        description: 'Ingreso eliminado correctamente',
      });
      loadIncomes();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al eliminar el ingreso',
        variant: 'destructive',
      });
    }
  }

  const columns = [
    {
      accessorKey: 'date',
      header: 'Fecha',
      cell: ({ row }) => {
        const date = new Date(row.original.date);
        return date.toLocaleDateString('es-CO');
      },
    },
    {
      accessorKey: 'amount',
      header: 'Monto',
      cell: ({ row }) => (
        <span className="text-green-500 font-medium">
          {formatCOP(row.original.amount)}
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
        title="Ingresos"
        onAdd={() => navigate('new')}
        addButtonText="Agregar Ingreso"
      />

      <div className="rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <DataTable 
          columns={columns} 
          data={incomes}
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