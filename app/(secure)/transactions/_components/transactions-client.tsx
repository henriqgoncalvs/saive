import { useState, useEffect, useRef } from 'react';
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

export function TransactionsClient() {
  // State for filters - per account
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [selectedCategories, setSelectedCategories] = useState<Record<string, string>>({});
  const [selectedTypes, setSelectedTypes] = useState<Record<string, string>>({});
  const [selectedDateRanges, setSelectedDateRanges] = useState<Record<string, string>>({});

  // State for active tab
  const [activeTab, setActiveTab] = useState('resume');

  // State for data
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactionsByAccount, setTransactionsByAccount] = useState<Record<string, Transaction[]>>(
    {}
  );

  // State for pagination - per account
  const [pages, setPages] = useState<Record<string, number>>({});
  const [totalPages, setTotalPages] = useState<Record<string, number>>({});
  const [totalTransactions, setTotalTransactions] = useState<Record<string, number>>({});
  const [pageSizes, setPageSizes] = useState<Record<string, number>>({});

  // State for UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debounced search terms
  const debouncedSearchTerms = useDebounce(searchTerms, 500);

  // Add this state for grouped transactions
  const [groupedResumeTransactions, setGroupedResumeTransactions] = useState<
    Record<string, { accountName: string; transactions: Transaction[] }>
  >({});

  // Add a ref to track if we've already fetched resume data
  const resumeDataFetchedRef = useRef(false);

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

  // Fetch accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await PluggyService.getAllAccounts();
        setAccounts(response.accounts || []);
      } catch (err) {
        console.error('Error fetching accounts:', err);
        setError('Failed to load accounts. Please try again later.');
      }
    };

    fetchAccounts();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/pluggy/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Don't set error state for categories as it's not critical
      }
    };

    fetchCategories();
  }, []);

  // Fetch transactions for a specific account
  const fetchAccountTransactions = async (accountId: string) => {
    try {
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

      // Update transactions for this account
      setTransactionsByAccount((prev) => ({
        ...prev,
        [accountId]: transactionsWithAccountName,
      }));

      // Update pagination state for this account
      setTotalPages((prev) => ({
        ...prev,
        [accountId]: data.totalPages,
      }));

      setTotalTransactions((prev) => ({
        ...prev,
        [accountId]: data.total,
      }));

      return transactionsWithAccountName;
    } catch (err) {
      console.error(`Error fetching transactions for account ${accountId}:`, err);
      return [];
    }
  };

  // Fetch resume transactions (latest 20 from each account)
  const fetchResumeTransactions = async () => {
    console.log('fetchResumeTransactions called'); // Debug log
    try {
      setLoading(true);

      // Create an object to store transactions by account
      const transactionsByAccount: Record<
        string,
        { accountName: string; transactions: Transaction[] }
      > = {};

      // Process all accounts first
      for (const account of accounts) {
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

        // Store in the grouped object
        transactionsByAccount[account.id] = {
          accountName: account.name,
          transactions: accountTransactions,
        };
      }

      // After all accounts are processed, update state once
      setGroupedResumeTransactions(transactionsByAccount);
    } catch (err) {
      console.error('Error fetching resume transactions:', err);
      setError('Failed to load transactions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Modify the existing useEffect to avoid duplicate calls
  useEffect(() => {
    const fetchData = async () => {
      if (accounts.length === 0) return;

      setLoading(true);

      try {
        if (activeTab === 'resume') {
          // Only fetch resume data if we haven't already or if accounts changed
          if (!resumeDataFetchedRef.current) {
            console.log('Fetching resume transactions (first time)');
            await fetchResumeTransactions();
            resumeDataFetchedRef.current = true;
          }
        } else {
          await fetchAccountTransactions(activeTab);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load transactions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accounts, activeTab]);

  // Fetch transactions when filters change
  useEffect(() => {
    if (activeTab !== 'resume' && accounts.length > 0) {
      fetchAccountTransactions(activeTab);
    }
  }, [
    debouncedSearchTerms,
    selectedCategories,
    selectedTypes,
    selectedDateRanges,
    pages,
    pageSizes,
  ]);

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

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gradient">Transactions</h1>
      </div>

      <div className="glass-card rounded-xl p-5">
        {loading && accounts.length === 0 ? (
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
            <p>{error}</p>
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
              {loading ? (
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
                {loading && activeTab === account.id ? (
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
                    transactions={transactionsByAccount[account.id] || []}
                    categories={categories}
                    searchTerm={searchTerms[account.id] || ''}
                    selectedCategory={selectedCategories[account.id] || 'all'}
                    selectedType={selectedTypes[account.id] || 'all'}
                    selectedDateRange={selectedDateRanges[account.id] || 'all'}
                    currentPage={pages[account.id] || 1}
                    totalPages={totalPages[account.id] || 1}
                    totalTransactions={totalTransactions[account.id] || 0}
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
