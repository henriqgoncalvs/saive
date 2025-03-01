
import { cn } from '@/lib/utils';
import { Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';

interface GoalProps {
  title: string;
  current: number;
  target: number;
  endDate: string;
  color: string;
}

const goals: GoalProps[] = [
  {
    title: "Vacation Fund",
    current: 2500,
    target: 5000,
    endDate: "2023-12-31",
    color: "#3B82F6"
  },
  {
    title: "Emergency Fund",
    current: 8000,
    target: 10000,
    endDate: "2023-10-15",
    color: "#10B981"
  },
  {
    title: "New Laptop",
    current: 800,
    target: 2000,
    endDate: "2023-09-30",
    color: "#EC4899"
  }
];

export const GoalProgress = () => {
  const [progressValues, setProgressValues] = useState<number[]>(goals.map(() => 0));
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const timer = setTimeout(() => {
      setProgressValues(goals.map(goal => (goal.current / goal.target) * 100));
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={`glass-card rounded-lg p-5 h-full transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Target size={18} className="text-primary" />
        </div>
        <h3 className="text-lg font-medium">Savings Goals</h3>
      </div>
      
      <div className="space-y-5">
        {goals.map((goal, index) => {
          const percentage = (goal.current / goal.target) * 100;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{goal.title}</h4>
                  <p className="text-xs text-muted-foreground">Target date: {formatDate(goal.endDate)}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${goal.current.toLocaleString()} <span className="text-muted-foreground">/ ${goal.target.toLocaleString()}</span></p>
                  <p className="text-xs text-muted-foreground">{percentage.toFixed(0)}% Complete</p>
                </div>
              </div>
              
              <Progress 
                value={progressValues[index]} 
                className="h-2 bg-muted"
                style={{ '--progress-background': goal.color } as React.CSSProperties}
                // Removed the indicatorClassName prop as it's not in the component definition
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
