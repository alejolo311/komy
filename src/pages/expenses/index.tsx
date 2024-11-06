import { Routes, Route } from 'react-router-dom';
import { ExpenseList } from './ExpenseList';
import { ExpenseForm } from './ExpenseForm';

export function Expenses() {
  return (
    <Routes>
      <Route index element={<ExpenseList />} />
      <Route path="new" element={<ExpenseForm />} />
      <Route path=":id/edit" element={<ExpenseForm />} />
    </Routes>
  );
}