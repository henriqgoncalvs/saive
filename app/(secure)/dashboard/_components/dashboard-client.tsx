import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { PluggyService } from '@/lib/services/pluggy-service';
import { formatCurrency } from '@/lib/utils';
import { Account, Transaction } from '@/app/(secure)/transactions/_types';
import { StatCard } from './stat-card';
import { AccountsSection } from './accounts-section';
import { TransactionsSection } from './transactions-section';
import { BalanceChart } from './balance-chart';

export function DashboardClient() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for charts - replace with real data in production
  const balanceData = [
    { date: 'Jan', balance: 5000 },
    { date: 'Feb', balance: 6200 },
    { date: 'Mar', balance: 5800 },
    { date: 'Apr', balance: 7500 },
    { date: 'May', balance: 8200 },
    { date: 'Jun', balance: 7800 },
  ];

  const spendingData = [
    { date: 'Jan', amount: 1200 },
    { date: 'Feb', amount: 1500 },
    { date: 'Mar', amount: 1800 },
    { date: 'Apr', amount: 1300 },
    { date: 'May', amount: 2000 },
    { date: 'Jun', amount: 1600 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch accounts
        const accountsResponse = await PluggyService.getAllAccounts();
        const fetchedAccounts = accountsResponse.accounts || [];
        setAccounts(fetchedAccounts);

        // Fetch recent transactions
        if (fetchedAccounts.length > 0) {
          const recentTransactions: Transaction[] = [];

          for (const account of fetchedAccounts) {
            const params = new URLSearchParams();
            params.append('accountId', account.id);
            params.append('page', '1');
            params.append('pageSize', '5');

            const response = await fetch(`/api/pluggy/transactions?${params}`);
            if (!response.ok) {
              throw new Error(`Failed to fetch transactions for account ${account.id}`);
            }

            const data = await response.json();
            const accountTransactions = data.transactions.map((transaction: Transaction) => ({
              ...transaction,
              accountName: account.name,
            }));

            recentTransactions.push(...accountTransactions);
          }

          // Sort by date (newest first) and take the first 10
          recentTransactions.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setTransactions(recentTransactions.slice(0, 10));
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate total balance across all accounts
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  // Calculate income and expenses from transactions
  const income = transactions
    .filter((t) => t.type === 'CREDIT')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === 'DEBIT')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold text-gradient">Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Welcome back! Here&apos;s an overview of your finances.
        </p>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-gray-400">
          <p>{error}</p>
          <button
            className="text-finance-accent mt-2 underline"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Balance"
              value={formatCurrency(totalBalance, accounts[0]?.currency || 'USD')}
              icon={<Wallet size={24} />}
              trend={{ value: 12.5, isPositive: true }}
            />
            <StatCard
              title="Income"
              value={formatCurrency(income, accounts[0]?.currency || 'USD')}
              icon={<TrendingUp size={24} />}
              trend={{ value: 8.2, isPositive: true }}
            />
            <StatCard
              title="Expenses"
              value={formatCurrency(expenses, accounts[0]?.currency || 'USD')}
              icon={<TrendingDown size={24} />}
              trend={{ value: 3.1, isPositive: false }}
            />
            <StatCard
              title="Accounts"
              value={accounts.length.toString()}
              icon={<CreditCard size={24} />}
            />
          </div>

          {/* Charts and Accounts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BalanceChart
              balanceData={balanceData}
              spendingData={spendingData}
              currency={accounts[0]?.currency || 'USD'}
            />
            <AccountsSection accounts={accounts} />
          </div>

          {/* Transactions */}
          <div>
            <TransactionsSection transactions={transactions} />
          </div>
        </>
      )}
    </div>
  );
}
