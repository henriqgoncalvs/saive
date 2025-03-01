
import { Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  title: string;
  description: string;
  actionText?: string;
  actionUrl?: string;
  className?: string;
  type?: 'default' | 'success' | 'warning';
}

export const InsightCard = ({ 
  title,
  description,
  actionText,
  actionUrl,
  className,
  type = 'default'
}: InsightCardProps) => {
  return (
    <div className={cn(
      "glass-card rounded-xl p-5 relative overflow-hidden transition-all duration-300",
      type === 'success' && "border-l-4 border-l-finance-positive",
      type === 'warning' && "border-l-4 border-l-finance-chart-4",
      type === 'default' && "border-l-4 border-l-finance-accent",
      className
    )}>
      <div className="flex gap-3 items-start">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
          type === 'success' && "bg-finance-positive/10 text-finance-positive",
          type === 'warning' && "bg-finance-chart-4/10 text-finance-chart-4",
          type === 'default' && "bg-finance-accent/10 text-finance-accent"
        )}>
          <Lightbulb size={18} />
        </div>
        
        <div>
          <h3 className="font-medium text-lg mb-1">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
          
          {actionText && actionUrl && (
            <a 
              href={actionUrl} 
              className={cn(
                "inline-block mt-3 text-sm font-medium transition-colors",
                type === 'success' && "text-finance-positive hover:text-finance-positive/80",
                type === 'warning' && "text-finance-chart-4 hover:text-finance-chart-4/80",
                type === 'default' && "text-finance-accent hover:text-finance-accent/80"
              )}
            >
              {actionText}
            </a>
          )}
        </div>
      </div>
      
      <div className="absolute top-0 right-0 h-full w-1/3 opacity-5">
        <div className={cn(
          "h-full w-full transform rotate-12 translate-x-1/2 -translate-y-1/4",
          type === 'success' && "bg-finance-positive",
          type === 'warning' && "bg-finance-chart-4",
          type === 'default' && "bg-finance-accent"
        )} />
      </div>
    </div>
  );
};
