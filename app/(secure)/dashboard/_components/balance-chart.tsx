import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  TooltipProps,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface BalanceChartProps {
  balanceData: {
    date: string;
    balance: number;
  }[];
  spendingData: {
    date: string;
    amount: number;
  }[];
  currency: string;
}

export function BalanceChart({ balanceData, spendingData, currency }: BalanceChartProps) {
  const [chartType, setChartType] = useState('balance');

  const data = chartType === 'balance' ? balanceData : spendingData;
  const chartTitle = chartType === 'balance' ? 'Balance History' : 'Spending History';
  const dataKey = chartType === 'balance' ? 'balance' : 'amount';
  const gradientColor = chartType === 'balance' ? '#4F46E5' : '#EF4444';

  const CustomTooltip = ({ active, payload, label }: TooltipProps<string, string | number>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-primary-solid p-3 rounded-md border border-gray-700 shadow-lg">
          <p className="text-xs text-gray-400">{label}</p>
          <p className="text-sm font-medium">
            {formatCurrency(Number(payload[0].value) || 0, currency)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-primary-solid bg-noise">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{chartTitle}</CardTitle>
        <Select value={chartType} onValueChange={setChartType}>
          <SelectTrigger className="w-[140px] bg-gray-800/50 border-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="balance">Balance</SelectItem>
            <SelectItem value="spending">Spending</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={gradientColor} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={gradientColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                axisLine={{ stroke: '#333' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                axisLine={{ stroke: '#333' }}
                tickLine={false}
                tickFormatter={(value) => `${currency} ${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={gradientColor}
                fillOpacity={1}
                fill="url(#colorGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
