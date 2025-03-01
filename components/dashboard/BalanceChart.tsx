
import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const generateData = () => {
  const data = [];
  const baseAmount = 6000;
  
  for (let i = 0; i < 12; i++) {
    const variation = Math.floor(Math.random() * 1000) - 500;
    data.push({
      name: months[i],
      value: baseAmount + variation + (i * 300),
    });
  }
  
  return data;
};

const initialData = generateData();

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-lg text-sm">
        <p className="font-medium">{label}</p>
        <p className="text-gray-300">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export const BalanceChart = () => {
  const [animatedData, setAnimatedData] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const timer = setTimeout(() => {
      setAnimatedData(initialData);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`glass-card rounded-xl p-5 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <h3 className="text-lg font-medium mb-6">Balance History</h3>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={animatedData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              dx={-10}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#8B5CF6" 
              fillOpacity={1}
              fill="url(#colorBalance)"
              strokeWidth={2}
              animationDuration={1000}
              animationBegin={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
