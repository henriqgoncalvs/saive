import { useState, useEffect } from 'react';
import { CreditCard, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { PluggyService } from '@/lib/services/pluggy-service';
import { Account, Category, Transaction } from '../_types';
import { TransactionTable } from './transaction-table';
import { ResumeView } from './resume-view';
import { TransactionModal } from './transaction-modal';
import { useQuery, useQueries, QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

// Wrap the component with QueryClientProvider
export function TransactionsClientWithProvider() {
  return (
    <QueryClientProvider client={queryClient}>
      <TransactionsClient />
    </QueryClientProvider>
  );
}

export function TransactionsClient() {
  // State for filters - per account
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [selectedCategories, setSelectedCategories] = useState<Record<string, string>>({});
  const [selectedTypes, setSelectedTypes] = useState<Record<string, string>>({});
  const [selectedDateRanges, setSelectedDateRanges] = useState<Record<string, string>>({});

  // State for active tab
  const [activeTab, setActiveTab] = useState('resume');

  // State for pagination - per account
  const [pages, setPages] = useState<Record<string, number>>({});
  const [pageSizes, setPageSizes] = useState<Record<string, number>>({});

  // State for UI
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debounced search terms
  const debouncedSearchTerms = useDebounce(searchTerms, 500);

  // Fetch accounts using TanStack Query
  const {
    data: accounts = [],
    isLoading: isLoadingAccounts,
    error: accountsError,
  } = useQuery<Account[], Error>({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await PluggyService.getAllAccounts();
      return response.accounts || [];
    },
  });

  // Fetch categories using TanStack Query
  const {
    data: categories = [],
    // We don't need to track loading state for categories as it's not critical
  } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/pluggy/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      return data.categories || [];
    },
    // Don't show error for categories as it's not critical
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  // Initialize account-specific states when accounts are loaded
  useEffect(() => {
    if (accounts.length > 0) {
      const initialPages: Record<string, number> = {};
      const initialPageSizes: Record<string, number> = {};
      const initialSearchTerms: Record<string, string> = {};
      const initialSelectedCategories: Record<string, string> = {};
      const initialSelectedTypes: Record<string, string> = {};
      const initialSelectedDateRanges: Record<string, string> = {};

      accounts.forEach((account) => {
        initialPages[account.id] = 1;
        initialPageSizes[account.id] = 100;
        initialSearchTerms[account.id] = '';
        initialSelectedCategories[account.id] = 'all';
        initialSelectedTypes[account.id] = 'all';
        initialSelectedDateRanges[account.id] = 'all';
      });

      setPages((prev) => ({ ...prev, ...initialPages }));
      setPageSizes((prev) => ({ ...prev, ...initialPageSizes }));
      setSearchTerms((prev) => ({ ...prev, ...initialSearchTerms }));
      setSelectedCategories((prev) => ({ ...prev, ...initialSelectedCategories }));
      setSelectedTypes((prev) => ({ ...prev, ...initialSelectedTypes }));
      setSelectedDateRanges((prev) => ({ ...prev, ...initialSelectedDateRanges }));
    }
  }, [accounts]);

  // Fetch transactions for a specific account using TanStack Query
  const fetchAccountTransactions = async (accountId: string) => {
    const baseParams = new URLSearchParams();

    // Add account ID
    baseParams.append('accountId', accountId);

    // Add search term if provided
    if (debouncedSearchTerms[accountId]) {
      baseParams.append('search', debouncedSearchTerms[accountId]);
    }

    // Add category filter if selected
    if (selectedCategories[accountId] && selectedCategories[accountId] !== 'all') {
      baseParams.append('categoryId', selectedCategories[accountId]);
    }

    // Add transaction type filter if selected
    if (selectedTypes[accountId] && selectedTypes[accountId] !== 'all') {
      baseParams.append('type', selectedTypes[accountId]);
    }

    // Add date range filter
    if (selectedDateRanges[accountId] && selectedDateRanges[accountId] !== 'all') {
      const today = new Date();
      let fromDate;

      if (selectedDateRanges[accountId] === 'today') {
        fromDate = new Date(today);
        fromDate.setHours(0, 0, 0, 0);
      } else if (selectedDateRanges[accountId] === 'week') {
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 7);
      } else if (selectedDateRanges[accountId] === 'month') {
        fromDate = new Date(today);
        fromDate.setMonth(today.getMonth() - 1);
      }

      if (fromDate) {
        baseParams.append('from', fromDate.toISOString().split('T')[0]);
        baseParams.append('to', today.toISOString().split('T')[0]);
      }
    }

    // Add pagination parameters
    baseParams.append('page', pages[accountId]?.toString() || '1');
    baseParams.append('pageSize', pageSizes[accountId]?.toString() || '100');

    const response = await fetch(`/api/pluggy/transactions?${baseParams}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch transactions for account ${accountId}`);
    }

    const data = await response.json();

    // Add account name to each transaction
    const account = accounts.find((acc) => acc.id === accountId);
    const transactionsWithAccountName = data.transactions.map((transaction: Transaction) => ({
      ...transaction,
      accountName: account?.name || 'Unknown Account',
    }));

    return {
      transactions: transactionsWithAccountName,
      totalPages: data.totalPages,
      total: data.total,
    };
  };

  // Use TanStack Query to fetch transactions for the active account
  const { data: activeAccountData, isLoading: isLoadingTransactions } = useQuery({
    queryKey: [
      'transactions',
      activeTab,
      debouncedSearchTerms[activeTab],
      selectedCategories[activeTab],
      selectedTypes[activeTab],
      selectedDateRanges[activeTab],
      pages[activeTab],
      pageSizes[activeTab],
    ],
    queryFn: () => fetchAccountTransactions(activeTab),
    enabled: activeTab !== 'resume' && accounts.length > 0,
  });

  // Fetch resume transactions (latest 20 from each account) using TanStack Query
  const accountQueries = useQueries({
    queries: accounts.map((account) => ({
      queryKey: ['resumeTransactions', account.id],
      queryFn: async () => {
        const params = new URLSearchParams();
        params.append('accountId', account.id);
        params.append('page', '1');
        params.append('pageSize', '20'); // Get more transactions per account for the resume view

        const response = await fetch(`/api/pluggy/transactions?${params}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch transactions for account ${account.id}`);
        }

        const data = await response.json();
        const accountTransactions = data.transactions.map((transaction: Transaction) => ({
          ...transaction,
          accountName: account.name,
        }));

        // Sort transactions by date (newest first)
        accountTransactions.sort(
          (a: Transaction, b: Transaction) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        return {
          accountId: account.id,
          accountName: account.name,
          transactions: accountTransactions,
        };
      },
      enabled: activeTab === 'resume' && accounts.length > 0,
    })),
  });

  // Process resume transactions data
  const isLoadingResumeTransactions =
    activeTab === 'resume' && accountQueries.some((query) => query.isLoading);
  const resumeTransactionsError =
    activeTab === 'resume' && accountQueries.some((query) => query.error);

  // Convert the array of query results to the format expected by ResumeView
  const groupedResumeTransactions = accountQueries.reduce((acc, query) => {
    if (query.data) {
      acc[query.data.accountId] = {
        accountName: query.data.accountName,
        transactions: query.data.transactions,
      };
    }
    return acc;
  }, {} as Record<string, { accountName: string; transactions: Transaction[] }>);

  // Handle transaction click
  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  // Handle search change
  const handleSearchChange = (accountId: string, value: string) => {
    setSearchTerms((prev) => ({
      ...prev,
      [accountId]: value,
    }));
  };

  // Handle category change
  const handleCategoryChange = (accountId: string, value: string) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [accountId]: value,
    }));
    // Reset to page 1 when changing filters
    setPages((prev) => ({
      ...prev,
      [accountId]: 1,
    }));
  };

  // Handle type change
  const handleTypeChange = (accountId: string, value: string) => {
    setSelectedTypes((prev) => ({
      ...prev,
      [accountId]: value,
    }));
    // Reset to page 1 when changing filters
    setPages((prev) => ({
      ...prev,
      [accountId]: 1,
    }));
  };

  // Handle date range change
  const handleDateRangeChange = (accountId: string, value: string) => {
    setSelectedDateRanges((prev) => ({
      ...prev,
      [accountId]: value,
    }));
    // Reset to page 1 when changing filters
    setPages((prev) => ({
      ...prev,
      [accountId]: 1,
    }));
  };

  // Handle page change
  const handlePageChange = (accountId: string, page: number) => {
    setPages((prev) => ({
      ...prev,
      [accountId]: page,
    }));
  };

  // Handle page size change
  const handlePageSizeChange = (accountId: string, pageSize: number) => {
    setPageSizes((prev) => ({
      ...prev,
      [accountId]: pageSize,
    }));
    // Reset to page 1 when changing page size
    setPages((prev) => ({
      ...prev,
      [accountId]: 1,
    }));
  };

  // Handle clear filters
  const handleClearFilters = (accountId: string) => {
    setSearchTerms((prev) => ({
      ...prev,
      [accountId]: '',
    }));
    setSelectedCategories((prev) => ({
      ...prev,
      [accountId]: 'all',
    }));
    setSelectedTypes((prev) => ({
      ...prev,
      [accountId]: 'all',
    }));
    setSelectedDateRanges((prev) => ({
      ...prev,
      [accountId]: 'all',
    }));
    setPages((prev) => ({
      ...prev,
      [accountId]: 1,
    }));
  };

  const getAvailableTypes = () => {
    return ['all', 'CREDIT', 'DEBIT'];
  };

  // Determine loading state
  const isLoading =
    isLoadingAccounts ||
    (activeTab !== 'resume' && isLoadingTransactions) ||
    (activeTab === 'resume' && isLoadingResumeTransactions);

  // Determine error state
  const error =
    accountsError ||
    (activeTab === 'resume' && resumeTransactionsError ? 'Failed to load transactions' : null);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gradient">Transactions</h1>
      </div>

      <div className="glass-card rounded-xl p-5">
        {isLoading && accounts.length === 0 ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-[300px] mb-4" />
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Skeleton className="h-10 w-full md:w-1/2" />
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-10 w-[140px]" />
                <Skeleton className="h-10 w-[140px]" />
                <Skeleton className="h-10 w-[140px]" />
              </div>
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-gray-400">
            <Info className="mx-auto mb-3 text-gray-500" size={24} />
            <p>{error instanceof Error ? error.message : 'An error occurred'}</p>
            <Button
              variant="link"
              className="mt-2 text-finance-accent"
              onClick={() => window.location.reload()}
            >
              Try again
            </Button>
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <CreditCard className="mx-auto mb-3 text-gray-500" size={24} />
            <p>No accounts found. Connect your accounts to see your transactions.</p>
            <Button
              variant="gradient"
              className="mt-4"
              onClick={() => (window.location.href = '/pluggy')}
            >
              Connect Accounts
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="resume" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="resume">Resume</TabsTrigger>
              {accounts.map((account) => (
                <TabsTrigger key={account.id} value={account.id}>
                  {account.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="resume">
              {isLoadingResumeTransactions ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-40 w-full" />
                  ))}
                </div>
              ) : (
                <ResumeView
                  transactionsByAccount={groupedResumeTransactions}
                  onTransactionClick={handleTransactionClick}
                />
              )}
            </TabsContent>

            {accounts.map((account) => (
              <TabsContent key={account.id} value={account.id}>
                {isLoadingTransactions && activeTab === account.id ? (
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                      <Skeleton className="h-10 w-full md:w-1/2" />
                      <div className="flex flex-wrap gap-3">
                        <Skeleton className="h-10 w-[140px]" />
                        <Skeleton className="h-10 w-[140px]" />
                        <Skeleton className="h-10 w-[140px]" />
                      </div>
                    </div>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <TransactionTable
                    accountId={account.id}
                    transactions={activeAccountData?.transactions || []}
                    categories={categories}
                    searchTerm={searchTerms[account.id] || ''}
                    selectedCategory={selectedCategories[account.id] || 'all'}
                    selectedType={selectedTypes[account.id] || 'all'}
                    selectedDateRange={selectedDateRanges[account.id] || 'all'}
                    currentPage={pages[account.id] || 1}
                    totalPages={activeAccountData?.totalPages || 1}
                    totalTransactions={activeAccountData?.total || 0}
                    pageSize={pageSizes[account.id] || 100}
                    onSearchChange={handleSearchChange}
                    onCategoryChange={handleCategoryChange}
                    onTypeChange={handleTypeChange}
                    onDateRangeChange={handleDateRangeChange}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    onTransactionClick={handleTransactionClick}
                    onClearFilters={handleClearFilters}
                    getAvailableTypes={getAvailableTypes}
                  />
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        transaction={selectedTransaction}
      />
    </div>
  );
}
