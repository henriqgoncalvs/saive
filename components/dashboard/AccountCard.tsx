
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, CreditCard, Wallet } from 'lucide-react';

interface AccountCardProps {
  type: 'cash' | 'credit';
  name: string;
  balance: number;
  available?: number;
  change: number;
  className?: string;
}

export const AccountCard = ({ 
  type, 
  name, 
  balance, 
  available, 
  change, 
  className 
}: AccountCardProps) => {
  const isPositive = change >= 0;
  const Icon = type === 'cash' ? Wallet : CreditCard;
  
  return (
    <div className={cn(
      "glass-card rounded-lg p-6 select-none relative overflow-hidden group",
      className
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary/10">
            <Icon size={18} className="text-primary" />
          </div>
          <h3 className="font-medium text-lg">{name}</h3>
        </div>
        <div className={cn(
          "text-xs px-2 py-1 rounded-full flex items-center gap-1",
          isPositive ? "bg-finance-positive/10 text-finance-positive" : "bg-finance-negative/10 text-finance-negative"
        )}>
          {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {Math.abs(change)}%
        </div>
      </div>

      <p className="text-muted-foreground text-sm mb-1">Current Balance</p>
      <h2 className="text-2xl font-semibold mb-4">${balance.toLocaleString()}</h2>
      
      {type === 'credit' && available !== undefined && (
        <div className="text-sm">
          <p className="text-muted-foreground">Available Credit</p>
          <p>${available.toLocaleString()}</p>
        </div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
};
