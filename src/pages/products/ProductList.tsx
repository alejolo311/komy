import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/shared/page-header';
import { ConfirmDelete } from '@/components/shared/confirm-delete';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import type { Product } from '@/types';

export function ProductList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const data = await api.products.list();
      setProducts(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive',
      });
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.products.delete(id);
      setDeleteId(null);
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
      loadProducts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product',
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
      accessorKey: 'isFinishedProduct',
      header: 'Type',
      cell: ({ row }) => (
        <span>
          {row.original.isFinishedProduct ? 'Finished Product' : 'Recipe Based'}
        </span>
      ),
    },
    {
      accessorKey: 'purchasePrice',
      header: 'Purchase Price',
      cell: ({ row }) =>
        row.original.isFinishedProduct ? (
          <span>${row.original.purchasePrice?.toFixed(2)}</span>
        ) : (
          '—'
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
        title="Products"
        onAdd={() => navigate('new')}
        addButtonText="Add Product"
      />

      <DataTable columns={columns} data={products} />

      <ConfirmDelete
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
      />
    </div>
  );
}