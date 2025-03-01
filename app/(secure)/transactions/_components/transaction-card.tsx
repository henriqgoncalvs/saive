import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { Transaction } from '../_types';

interface TransactionCardProps {
  transaction: Transaction;
  onClick: (transaction: Transaction) => void;
}

export function TransactionCard({ transaction, onClick }: TransactionCardProps) {
  return (
    <Card
      key={transaction.id}
      className="bg-primary-solid bg-noise cursor-pointer hover:bg-primary-solid-light transition-colors"
      onClick={() => onClick(transaction)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center',
                transaction.type === 'CREDIT' ? 'bg-finance-positive/20' : 'bg-finance-negative/20'
              )}
            >
              {transaction.type === 'CREDIT' ? (
                <ArrowUpRight size={14} className="text-finance-positive" />
              ) : (
                <ArrowDownLeft size={14} className="text-finance-negative" />
              )}
            </div>
            <CardTitle className="text-base">{transaction.description}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm text-gray-400">{formatDate(transaction.date)}</div>
        <div className="text-sm text-gray-400">Account: {transaction.accountName}</div>
        <Badge variant="outline" className="mt-2 font-normal">
          {transaction.category || 'Uncategorized'}
        </Badge>
      </CardContent>
      <CardFooter className="pt-2">
        <div
          className={cn(
            'text-lg font-medium ml-auto',
            transaction.type === 'CREDIT' ? 'text-finance-positive' : 'text-finance-negative'
          )}
        >
          {transaction.type === 'CREDIT' ? '+' : ''}
          {formatCurrency(transaction.amount, transaction.currencyCode)}
        </div>
      </CardFooter>
    </Card>
  );
}
