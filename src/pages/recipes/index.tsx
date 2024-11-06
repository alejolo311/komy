import { Routes, Route } from 'react-router-dom';
import { RecipeList } from './RecipeList';
import { RecipeForm } from './RecipeForm';

export function Recipes() {
  return (
    <Routes>
      <Route index element={<RecipeList />} />
      <Route path="new" element={<RecipeForm />} />
      <Route path=":id/edit" element={<RecipeForm />} />
    </Routes>
  );
}