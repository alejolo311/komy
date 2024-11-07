// @ts-nocheck
import { Routes, Route } from 'react-router-dom';
import { Dashboard } from '@/pages/Dashboard';
import { Ingredients } from '@/pages/ingredients';
import { Subrecipes } from '@/pages/subrecipes';
import { Recipes } from '@/pages/recipes';
import { Expenses } from '@/pages/expenses';
import { Income } from '@/pages/income';
import { Analytics } from '@/pages/analytics';
import { Landing } from '@/pages/Landing';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/ingredients/*" element={<Ingredients />} />
      <Route path="/subrecipes/*" element={<Subrecipes />} />
      <Route path="/recipes/*" element={<Recipes />} />
      <Route path="/expenses/*" element={<Expenses />} />
      <Route path="/income/*" element={<Income />} />
      <Route path="/reports/*" element={<Analytics />} />
    </Routes>
  );
}