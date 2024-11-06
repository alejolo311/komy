import { useState, useEffect } from 'react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import { DateRangePicker } from '@/components/analytics/date-range-picker';
import { AnalyticsSummary } from '@/components/analytics/analytics-summary';

const EXPENSE_COLORS = {
  FOOD_COST: '#22c55e',
  OPERATIVE: '#3b82f6',
  PERSONNEL: '#f59e0b',
};

const EXPENSE_LABELS = {
  FOOD_COST: 'Costo de Alimentos',
  OPERATIVE: 'Gastos Operativos',
  PERSONNEL: 'Personal',
};

const formatCOP = (value: number = 0) => {
  if (typeof value !== 'number') return 'COP $0';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const PERIODS = [
  { value: '1', label: 'Último mes' },
  { value: '3', label: 'Últimos 3 meses' },
  { value: '6', label: 'Últimos 6 meses' },
  { value: '12', label: 'Último año' },
  { value: 'custom', label: 'Personalizado' },
];

export function Analytics() {
  const { toast } = useToast();
  const [period, setPeriod] = useState('1');
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(subMonths(new Date(), 1)),
    to: endOfMonth(new Date()),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [data, setData] = useState({
    totalSales: 0,
    totalExpenses: 0,
    expensesByType: [],
    expensePercentages: [],
  });

  useEffect(() => {
    if (period !== 'custom') {
      const months = parseInt(period);
      setDateRange({
        from: startOfMonth(subMonths(new Date(), months)),
        to: endOfMonth(new Date()),
      });
    }
  }, [period]);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  async function loadAnalytics() {
    try {
      const [sales, expenses, expensesByType, percentages] = await Promise.all([
        api.analytics.getTotalSales(dateRange.from.toISOString(), dateRange.to.toISOString()),
        api.analytics.getTotalExpenses(dateRange.from.toISOString(), dateRange.to.toISOString()),
        api.analytics.getExpensesByType(dateRange.from.toISOString(), dateRange.to.toISOString()),
        api.analytics.getExpensePercentages(dateRange.from.toISOString(), dateRange.to.toISOString()),
      ]);

      setData({
        totalSales: sales.totalSales || 0,
        totalExpenses: expenses.totalExpenses || 0,
        expensesByType: expensesByType.map((expense: any) => ({
          ...expense,
          name: EXPENSE_LABELS[expense.type as keyof typeof EXPENSE_LABELS],
          totalAmount: expense.totalAmount || 0,
        })),
        expensePercentages: percentages.map((expense: any) => ({
          ...expense,
          name: EXPENSE_LABELS[expense.type as keyof typeof EXPENSE_LABELS],
          percentage: expense.percentage || 0,
        })),
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al cargar los datos analíticos',
        variant: 'destructive',
      });
    }
  }

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    setShowDatePicker(value === 'custom');
  };

  const profit = data.totalSales - data.totalExpenses;
  const profitMargin = data.totalSales > 0 ? (profit / data.totalSales) * 100 : 0;

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-emerald-400 text-center mb-6">
          Análisis Financiero
        </h1>
        <div className="flex items-center justify-center gap-4">
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Seleccione período" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {PERIODS.map((p) => (
                <SelectItem
                  key={p.value}
                  value={p.value}
                  className="text-gray-200 focus:bg-gray-700 focus:text-white"
                >
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {showDatePicker && (
            <DateRangePicker
              from={dateRange.from}
              to={dateRange.to}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  setDateRange({ from: range.from, to: range.to });
                }
              }}
            />
          )}
          <p className="text-gray-400">
            {format(dateRange.from, 'PP', { locale: es })} -{' '}
            {format(dateRange.to, 'PP', { locale: es })}
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3 mb-8">
        <AnalyticsSummary
          title="Ventas Totales"
          value={formatCOP(data.totalSales)}
          description="Ingresos del período"
        />
        <AnalyticsSummary
          title="Gastos Totales"
          value={formatCOP(data.totalExpenses)}
          description="Gastos del período"
        />
        <AnalyticsSummary
          title="Margen de Beneficio"
          value={`${profitMargin.toFixed(1)}%`}
          description={`Beneficio: ${formatCOP(profit)}`}
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Distribución de Gastos</CardTitle>
            <CardDescription className="text-gray-400">
              Porcentaje por categoría
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.expensePercentages}
                    dataKey="percentage"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percentage }) =>
                      `${name}: ${percentage.toFixed(1)}%`
                    }
                  >
                    {data.expensePercentages.map((entry: any) => (
                      <Cell
                        key={entry.type}
                        fill={EXPENSE_COLORS[entry.type as keyof typeof EXPENSE_COLORS]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Gastos por Categoría</CardTitle>
            <CardDescription className="text-gray-400">
              Montos totales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.expensesByType}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#9ca3af' }}
                  />
                  <YAxis
                    tick={{ fill: '#9ca3af' }}
                    tickFormatter={(value) =>
                      new Intl.NumberFormat('es-CO', {
                        notation: 'compact',
                        compactDisplay: 'short',
                      }).format(value)
                    }
                  />
                  <Tooltip
                    formatter={(value: number) => [formatCOP(value), "Monto"]}
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: '#fff',
                    }}
                  />
                  <Bar
                    dataKey="totalAmount"
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}