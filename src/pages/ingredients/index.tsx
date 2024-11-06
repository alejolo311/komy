import { Routes, Route } from 'react-router-dom';
import { IngredientList } from './IngredientList';
import { IngredientForm } from './IngredientForm';

export function Ingredients() {
  return (
    <Routes>
      <Route index element={<IngredientList />} />
      <Route path="new" element={<IngredientForm />} />
      <Route path=":id/edit" element={<IngredientForm />} />
    </Routes>
  );
}