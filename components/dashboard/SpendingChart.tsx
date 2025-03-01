
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface SpendingCategory {
  name: string;
  value: number;
  color: string;
}

const initialData: SpendingCategory[] = [
  { name: 'Food & Dining', value: 1200, color: '#8B5CF6' },
  { name: 'Shopping', value: 800, color: '#EC4899' },
  { name: 'Housing', value: 2400, color: '#10B981' },
  { name: 'Transportation', value: 600, color: '#F59E0B' },
  { name: 'Entertainment', value: 350, color: '#3B82F6' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-lg text-sm">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-gray-300">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export const SpendingChart = () => {
  const [animatedData, setAnimatedData] = useState<SpendingCategory[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setAnimatedData(initialData);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`glass-card rounded-xl p-5 h-[350px] transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <h3 className="text-lg font-medium mb-4">Monthly Spending</h3>
      <div className="h-[85%]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={animatedData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              animationDuration={1000}
              animationBegin={300}
              label={(entry) => entry.name}
              labelLine={{ stroke: '#8B5CF6', strokeWidth: 0.5 }}
            >
              {initialData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke="rgba(0,0,0,0.2)"
                  className="hover:opacity-80 transition-opacity duration-300"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
