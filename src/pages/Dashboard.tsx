import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

export function Dashboard() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [expenses, incomeVsExpenses] = await Promise.all([
          api.analytics.expensePercentages(),
          api.analytics.incomeVsExpenses(),
        ]);
        setAnalytics({ expenses, incomeVsExpenses });
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold text-white">Dashboard Overview</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-200">Food Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-emerald-400">
                {analytics?.expenses?.foodCost || 0}%
              </div>
              <div className="flex items-center text-emerald-400">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">2.5%</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-400">vs last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-200">Operating Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-blue-400">
                {analytics?.expenses?.operative || 0}%
              </div>
              <div className="flex items-center text-red-400">
                <ArrowDownIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">1.2%</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-400">vs last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-200">Personnel Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-purple-400">
                {analytics?.expenses?.personnel || 0}%
              </div>
              <div className="flex items-center text-emerald-400">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">0.8%</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-400">vs last month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 bg-gray-800 border-gray-700 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-200">Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analytics?.incomeVsExpenses || []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#34D399"
                  strokeWidth={3}
                  dot={{ fill: '#34D399', strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#F87171"
                  strokeWidth={3}
                  dot={{ fill: '#F87171', strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 mt-8 md:grid-cols-2">
        <Card className="bg-gray-800 border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-200">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-gray-700">
                  <div>
                    <p className="text-gray-200 font-medium">New Order #{1000 + i}</p>
                    <p className="text-sm text-gray-400">2 minutes ago</p>
                  </div>
                  <span className="text-emerald-400 font-bold">$149.99</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-200">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-gray-700">
                  <div>
                    <p className="text-gray-200 font-medium">Product {i + 1}</p>
                    <p className="text-sm text-gray-400">32 orders today</p>
                  </div>
                  <div className="w-24 h-2 rounded-full bg-gray-600">
                    <div
                      className="h-full rounded-full bg-blue-400"
                      style={{ width: `${85 - (i * 15)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}