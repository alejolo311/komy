import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  onAdd?: () => void;
  addButtonText?: string;
}

export function PageHeader({ title, onAdd, addButtonText }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-3xl font-bold">{title}</h1>
      {onAdd && (
        <Button onClick={onAdd} className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          {addButtonText || 'Add New'}
        </Button>
      )}
    </div>
  );
}