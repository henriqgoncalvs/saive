
import { cn } from '@/lib/utils';
import { ArrowUp } from 'lucide-react';

interface BankAccount {
  name: string;
  logo: string;
  balance: number;
  percentage: number;
  date: string;
}

interface BankAccountsCardProps {
  totalBalance: number;
  accounts: BankAccount[];
  className?: string;
}

export const BankAccountsCard = ({ totalBalance, accounts, className }: BankAccountsCardProps) => {
  return (
    <div className={cn("glass-card rounded-lg p-6 select-none relative overflow-hidden", className)}>
      <h3 className="text-lg font-medium mb-2">Minhas Contas</h3>
      
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">Saldo Gral.</p>
        <h2 className="text-3xl font-semibold">R$ {totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
      </div>
      
      <div className="space-y-4">
        {accounts.map((account, index) => (
          <div key={index} className="border-t border-slate-800/50 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-slate-800">
                  <img src={account.logo} alt={account.name} className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium">{account.name}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>({account.percentage.toFixed(2)}%)</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{account.date}</p>
                </div>
              </div>
              <div className="text-finance-positive font-medium">
                R$ {account.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
