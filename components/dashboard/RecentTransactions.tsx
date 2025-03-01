import { ArrowDown, ArrowUp, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

interface Transaction {
  id: string;
  merchant: string;
  category: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  accountName: string;
}

const transactionsData: Transaction[] = [
  {
    id: '1',
    merchant: 'Starbucks',
    category: 'Food & Dining',
    date: '2023-06-15',
    amount: 5.75,
    type: 'expense',
    accountName: 'Main Account',
  },
  {
    id: '2',
    merchant: 'Amazon',
    category: 'Shopping',
    date: '2023-06-14',
    amount: 49.99,
    type: 'expense',
    accountName: 'Credit Card',
  },
  {
    id: '3',
    merchant: 'Netflix',
    category: 'Entertainment',
    date: '2023-06-13',
    amount: 15.99,
    type: 'expense',
    accountName: 'Credit Card',
  },
  {
    id: '4',
    merchant: 'Salary',
    category: 'Income',
    date: '2023-06-12',
    amount: 3800,
    type: 'income',
    accountName: 'Main Account',
  },
  {
    id: '5',
    merchant: 'Uber',
    category: 'Transportation',
    date: '2023-06-10',
    amount: 12.5,
    type: 'expense',
    accountName: 'Credit Card',
  },
  {
    id: '6',
    merchant: 'Walmart',
    category: 'Groceries',
    date: '2023-06-08',
    amount: 87.32,
    type: 'expense',
    accountName: 'Main Account',
  },
];

export const RecentTransactions = () => {
  const [search, setSearch] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState(transactionsData);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const filtered = transactionsData.filter(
      (transaction) =>
        transaction.merchant.toLowerCase().includes(search.toLowerCase()) ||
        transaction.category.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredTransactions(filtered);
  }, [search]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      className={`glass-card rounded-xl p-5 h-full transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Recent Transactions</h3>
        <div className="relative w-1/3">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search..."
            className="pl-8 bg-gray-800/50 border-gray-700 focus:border-finance-accent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 space-y-1 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
        {filteredTransactions.map((transaction, index) => (
          <div
            key={transaction.id}
            className={cn(
              'flex items-center justify-between p-3 rounded-lg hover:bg-gray-800/30 transition-all cursor-pointer',
              isVisible ? `animate-slideUp` : 'opacity-0'
            )}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  transaction.type === 'income'
                    ? 'bg-finance-positive/10'
                    : 'bg-finance-negative/10'
                )}
              >
                {transaction.type === 'income' ? (
                  <ArrowUp className="h-4 w-4 text-finance-positive" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-finance-negative" />
                )}
              </div>
              <div>
                <p className="font-medium">{transaction.merchant}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-400">{transaction.category}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800/70 text-gray-300">
                    {transaction.accountName}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={transaction.type === 'income' ? 'text-finance-positive' : 'text-white'}>
                {transaction.type === 'income' ? '+' : '-'} ${transaction.amount}
              </p>
              <p className="text-xs text-gray-400">{formatDate(transaction.date)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
