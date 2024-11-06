import { Routes, Route } from 'react-router-dom';
import { SubrecipeList } from './SubrecipeList';
import { SubrecipeForm } from './SubrecipeForm';

export function Subrecipes() {
  return (
    <Routes>
      <Route index element={<SubrecipeList />} />
      <Route path="new" element={<SubrecipeForm />} />
      <Route path=":id/edit" element={<SubrecipeForm />} />
    </Routes>
  );
}