'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { InsightCard } from '@/components/dashboard/InsightCard';

// Sample data for charts
const monthlyData = [
  { name: 'Jan', income: 4000, expenses: 2400 },
  { name: 'Feb', income: 3000, expenses: 2500 },
  { name: 'Mar', income: 5000, expenses: 2800 },
  { name: 'Apr', income: 4500, expenses: 3000 },
  { name: 'May', income: 4200, expenses: 2700 },
  { name: 'Jun', income: 5500, expenses: 3200 },
];

const categoryData = [
  { name: 'Food & Dining', value: 1200, color: '#8B5CF6' },
  { name: 'Shopping', value: 800, color: '#EC4899' },
  { name: 'Housing', value: 2400, color: '#10B981' },
  { name: 'Transportation', value: 600, color: '#F59E0B' },
  { name: 'Entertainment', value: 350, color: '#3B82F6' },
  { name: 'Utilities', value: 420, color: '#6366F1' },
  { name: 'Healthcare', value: 250, color: '#14B8A6' },
];

const savingsData = [
  { name: 'Jan', amount: 500 },
  { name: 'Feb', amount: 600 },
  { name: 'Mar', amount: 800 },
  { name: 'Apr', amount: 750 },
  { name: 'May', amount: 900 },
  { name: 'Jun', amount: 1000 },
];

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name?: string;
    payload?: {
      name: string;
    };
  }>;
  label?: string;
}

const CustomBarTooltip = ({ active, payload }: ChartTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-lg text-sm">
        <p className="font-medium mb-1">{payload[0].payload?.name}</p>
        <p className="text-finance-positive">Income: ${payload[0].value.toLocaleString()}</p>
        <p className="text-gray-300">Expenses: ${payload[1].value.toLocaleString()}</p>
        <p className="text-gray-300 mt-1 text-xs">
          Savings: ${(payload[0].value - payload[1].value).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const CustomLineTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-lg text-sm">
        <p className="font-medium mb-1">{label}</p>
        <p className="text-finance-accent">Savings: ${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }: ChartTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-lg text-sm">
        <p className="font-medium mb-1">{payload[0].name}</p>
        <p className="text-gray-300">Amount: ${payload[0].value.toLocaleString()}</p>
        <p className="text-gray-300 text-xs mt-1">
          {(
            (payload[0].value / categoryData.reduce((acc, curr) => acc + curr.value, 0)) *
            100
          ).toFixed(1)}
          % of total
        </p>
      </div>
    );
  }
  return null;
};

function AnalyticsContent() {
  const [selectedPeriod, setSelectedPeriod] = useState<'1m' | '3m' | '6m' | '1y'>('6m');

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gradient">Financial Analytics</h1>
        <div className="flex gap-2">
          <Button
            variant={selectedPeriod === '1m' ? 'default' : 'outline'}
            className={
              selectedPeriod === '1m'
                ? 'bg-finance-accent hover:bg-finance-accent-hover'
                : 'border-gray-700'
            }
            onClick={() => setSelectedPeriod('1m')}
          >
            1M
          </Button>
          <Button
            variant={selectedPeriod === '3m' ? 'default' : 'outline'}
            className={
              selectedPeriod === '3m'
                ? 'bg-finance-accent hover:bg-finance-accent-hover'
                : 'border-gray-700'
            }
            onClick={() => setSelectedPeriod('3m')}
          >
            3M
          </Button>
          <Button
            variant={selectedPeriod === '6m' ? 'default' : 'outline'}
            className={
              selectedPeriod === '6m'
                ? 'bg-finance-accent hover:bg-finance-accent-hover'
                : 'border-gray-700'
            }
            onClick={() => setSelectedPeriod('6m')}
          >
            6M
          </Button>
          <Button
            variant={selectedPeriod === '1y' ? 'default' : 'outline'}
            className={
              selectedPeriod === '1y'
                ? 'bg-finance-accent hover:bg-finance-accent-hover'
                : 'border-gray-700'
            }
            onClick={() => setSelectedPeriod('1y')}
          >
            1Y
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card rounded-xl p-5 slide-up">
          <h2 className="text-lg font-medium mb-5">Income vs. Expenses</h2>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  width={80}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                  animationDuration={1500}
                />
                <Bar
                  dataKey="expenses"
                  name="Expenses"
                  fill="#EC4899"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 slide-up-delay-1">
          <h2 className="text-lg font-medium mb-5">Spending by Category</h2>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={1}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="rgba(0,0,0,0.2)"
                      className="hover:opacity-80 transition-opacity duration-300"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-5 slide-up-delay-2">
        <h2 className="text-lg font-medium mb-5">Monthly Savings Trend</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={savingsData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                width={80}
              />
              <Tooltip content={<CustomLineTooltip />} />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#071714' }}
                activeDot={{ r: 6, fill: '#10B981', strokeWidth: 2, stroke: '#071714' }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <InsightCard
          title="Spending Analysis"
          description="Your dining out expenses have increased by 18% compared to last month. This is primarily due to weekend restaurant visits."
          actionText="View Details"
          actionUrl="/transactions"
          type="warning"
          className="slide-up-delay-2"
        />
        <InsightCard
          title="Savings Milestone"
          description="Congratulations! You've reached 80% of your emergency fund goal. At your current rate, you'll reach your target in 2 months."
          actionText="View Savings"
          actionUrl="/savings"
          type="success"
          className="slide-up-delay-3"
        />
        <InsightCard
          title="Budget Report"
          description="You stayed within budget in 6 out of 8 categories this month. Housing and utilities were slightly over budget."
          actionText="Adjust Budget"
          actionUrl="/budget"
          className="slide-up-delay-3"
        />
      </div>

      <div className="glass-card rounded-xl p-5 slide-up-delay-3">
        <h2 className="text-lg font-medium mb-4">Financial Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-4">
            <h3 className="font-medium text-finance-accent">Spending Patterns</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="bg-finance-positive/20 text-finance-positive p-1 rounded-full">
                  ↓
                </span>
                <span>Your grocery spending decreased by 7% this month</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-finance-negative/20 text-finance-negative p-1 rounded-full">
                  ↑
                </span>
                <span>Entertainment expenses increased by 12% from last month</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-finance-accent/20 text-finance-accent p-1 rounded-full">→</span>
                <span>Your subscription services have remained stable at $114/month</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-finance-accent">Recommendations</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="bg-finance-chart-3/20 text-finance-chart-3 p-1 rounded-full">
                  ★
                </span>
                <span>Increase retirement contributions by 2% to optimize tax benefits</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-finance-chart-3/20 text-finance-chart-3 p-1 rounded-full">
                  ★
                </span>
                <span>Consider consolidating streaming services to reduce overlap</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-finance-chart-3/20 text-finance-chart-3 p-1 rounded-full">
                  ★
                </span>
                <span>Set up automated transfers to your savings account on payday</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return <AnalyticsContent />;
}
