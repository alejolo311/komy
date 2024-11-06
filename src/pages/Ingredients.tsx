import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { api } from '@/lib/api';

export function Ingredients() {
  const [ingredients, setIngredients] = useState<any[]>([]);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const data = await api.getIngredients();
        setIngredients(data);
      } catch (error) {
        console.error('Failed to fetch ingredients:', error);
      }
    };

    fetchIngredients();
  }, []);

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ingredients</h1>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Ingredient
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingredients.map((ingredient) => (
              <TableRow key={ingredient.id}>
                <TableCell>{ingredient.name}</TableCell>
                <TableCell>${ingredient.price}</TableCell>
                <TableCell>{ingredient.unit}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}