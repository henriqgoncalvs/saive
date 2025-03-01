import { Info } from 'lucide-react';
import { Transaction } from '../_types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface ResumeViewProps {
  transactionsByAccount: Record<
    string,
    {
      accountName: string;
      transactions: Transaction[];
    }
  >;
  onTransactionClick: (transaction: Transaction) => void;
}

export function ResumeView({ transactionsByAccount, onTransactionClick }: ResumeViewProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Recent Transactions by Account</h2>

      {Object.keys(transactionsByAccount).length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(transactionsByAccount).map(
            ([accountId, { accountName, transactions }]) => (
              <Card key={accountId} className="bg-primary-solid bg-noise">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{accountName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-primary-solid-light cursor-pointer transition-colors"
                        onClick={() => onTransactionClick(transaction)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'w-6 h-6 rounded-full flex items-center justify-center',
                              transaction.type === 'CREDIT'
                                ? 'bg-finance-positive/20'
                                : 'bg-finance-negative/20'
                            )}
                          >
                            {transaction.type === 'CREDIT' ? (
                              <ArrowUpRight size={12} className="text-finance-positive" />
                            ) : (
                              <ArrowDownLeft size={12} className="text-finance-negative" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{transaction.description}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">
                                {formatDate(transaction.date)}
                              </span>
                              <Badge variant="outline" className="text-xs h-5 px-1">
                                {transaction.category || 'Uncategorized'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div
                          className={cn(
                            'text-sm font-medium',
                            transaction.type === 'CREDIT'
                              ? 'text-finance-positive'
                              : 'text-finance-negative'
                          )}
                        >
                          {transaction.type === 'CREDIT' ? '+' : ''}
                          {formatCurrency(transaction.amount, transaction.currencyCode)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <Info className="mx-auto mb-3 text-gray-500" size={24} />
          <p>No recent transactions found.</p>
        </div>
      )}
    </div>
  );
}
