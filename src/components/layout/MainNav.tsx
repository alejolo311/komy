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
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Ingredients', href: '/ingredients', icon: CookingPot },
  { name: 'Subrecipes', href: '/subrecipes', icon: ChefHat },
  { name: 'Recipes', href: '/recipes', icon: Receipt },
  { name: 'Products', href: '/products', icon: Sandwich },
  { name: 'Expenses', href: '/expenses', icon: Package },
  { name: 'Income', href: '/income', icon: DollarSign },
  { name: 'Analytics', href: '/analytics', icon: LineChart },
];

export function MainNav() {
  const location = useLocation();

  return (
    <nav className="flex flex-col gap-2">
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50',
              location.pathname === item.href &&
                'bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-50'
            )}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}