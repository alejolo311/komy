import { Routes, Route } from 'react-router-dom';
import { IncomeList } from './IncomeList';
import { IncomeForm } from './IncomeForm';

export function Income() {
  return (
    <Routes>
      <Route index element={<IncomeList />} />
      <Route path="new" element={<IncomeForm />} />
      <Route path=":id/edit" element={<IncomeForm />} />
    </Routes>
  );
}