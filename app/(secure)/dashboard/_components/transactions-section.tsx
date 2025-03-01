import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { Transaction } from '@/app/(secure)/transactions/_types';

interface TransactionsSectionProps {
  transactions: Transaction[];
}

export function TransactionsSection({ transactions }: TransactionsSectionProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="bg-primary-solid bg-noise">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <Link href="/transactions">
          <Button variant="link" className="text-finance-accent">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      transaction.type === 'CREDIT'
                        ? 'bg-finance-positive/20'
                        : 'bg-finance-negative/20'
                    )}
                  >
                    {transaction.type === 'CREDIT' ? (
                      <ArrowUpRight size={14} className="text-finance-positive" />
                    ) : (
                      <ArrowDownLeft size={14} className="text-finance-negative" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{formatDate(transaction.date)}</span>
                      <span>•</span>
                      <span>{transaction.accountName}</span>
                    </div>
                  </div>
                </div>
                <div
                  className={cn(
                    'font-medium',
                    transaction.type === 'CREDIT'
                      ? 'text-finance-positive'
                      : 'text-finance-negative'
                  )}
                >
                  {transaction.type === 'CREDIT' ? '+' : ''}
                  {formatCurrency(transaction.amount, transaction.currencyCode)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-400">
              <p>No recent transactions found.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 