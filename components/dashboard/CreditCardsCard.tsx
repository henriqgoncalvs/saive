
import { cn } from '@/lib/utils';
import { CreditCard } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface CreditCard {
  name: string;
  lastDigits: string;
  balance: number;
}

interface CreditCardsCardProps {
  totalBalance: number;
  limit: number;
  percentage: number;
  cards: CreditCard[];
  className?: string;
}

export const CreditCardsCard = ({ totalBalance, limit, percentage, cards, className }: CreditCardsCardProps) => {
  return (
    <div className={cn("glass-card rounded-lg p-6 select-none relative overflow-hidden", className)}>
      <h3 className="text-lg font-medium mb-1">Meus Cartões</h3>
      <p className="text-sm text-muted-foreground mb-2">Uso de cartões de crédito</p>
      
      <h2 className="text-3xl font-semibold mb-4">R$ {totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
      
      <div className="mb-6">
        <div className="flex justify-between items-center text-sm mb-2">
          <span>{percentage.toFixed(2)}%</span>
          <span>R$ {limit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <Progress value={percentage} className="h-2 bg-slate-700">
          <div className="h-full bg-blue-500 rounded-full" />
        </Progress>
      </div>
      
      <div className="space-y-4">
        {cards.map((card, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-800">
                <CreditCard size={16} className="text-primary" />
              </div>
              <div>
                <p className="font-medium">{card.name}</p>
                <p className="text-xs text-muted-foreground">xxxx{card.lastDigits}</p>
              </div>
            </div>
            <div className="font-medium">
              R$ {card.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
