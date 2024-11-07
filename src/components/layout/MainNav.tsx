// @ts-nocheck
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  ChefHat,
  CookingPot,
  DollarSign,
  Home,
  LineChart,
  Package,
  Receipt,
  Sandwich,
} from 'lucide-react';

const navigation = [
  { name: 'Ingredientes', href: '/ingredients', icon: CookingPot },
  { name: 'Subrecetas', href: '/subrecipes', icon: ChefHat },
  { name: 'Recetas', href: '/recipes', icon: Receipt },
  { name: 'Gastos', href: '/expenses', icon: Package },
  { name: 'Ingresos', href: '/income', icon: DollarSign },
  { name: 'Reportes', href: '/reports', icon: LineChart },
];

interface MainNavProps {
  className?: string;
}

export function MainNav({ className }: MainNavProps) {
  const location = useLocation();

  return (
    <nav className={cn('flex flex-col md:flex-row gap-1', className)}>
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
              location.pathname === item.href &&
              'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
              'md:px-4 md:py-2'
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="md:hidden lg:inline">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}