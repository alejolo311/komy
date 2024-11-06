import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  onAdd?: () => void;
  addButtonText?: string;
}

export function PageHeader({ title, onAdd, addButtonText }: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800/50">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{title}</h1>
      {onAdd && (
        <Button onClick={onAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="mr-2 h-4 w-4" />
          {addButtonText || 'Agregar'}
        </Button>
      )}
    </div>
  );
}