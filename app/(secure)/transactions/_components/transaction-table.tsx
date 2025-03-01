import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { Transaction, Category } from '../_types';
import { FiltersComponent } from './filters-component';
import { PaginationControls } from './pagination-controls';

interface TransactionTableProps {
  accountId: string;
  transactions: Transaction[];
  categories: Category[];
  searchTerm: string;
  selectedCategory: string;
  selectedType: string;
  selectedDateRange: string;
  currentPage: number;
  totalPages: number;
  totalTransactions: number;
  pageSize: number;
  onSearchChange: (accountId: string, value: string) => void;
  onCategoryChange: (accountId: string, value: string) => void;
  onTypeChange: (accountId: string, value: string) => void;
  onDateRangeChange: (accountId: string, value: string) => void;
  onPageChange: (accountId: string, page: number) => void;
  onPageSizeChange: (accountId: string, pageSize: number) => void;
  onTransactionClick: (transaction: Transaction) => void;
  onClearFilters: (accountId: string) => void;
  getAvailableTypes: (accountId: string) => string[];
}

export function TransactionTable({
  accountId,
  transactions,
  categories,
  searchTerm,
  selectedCategory,
  selectedType,
  selectedDateRange,
  currentPage,
  totalPages,
  totalTransactions,
  pageSize,
  onSearchChange,
  onCategoryChange,
  onTypeChange,
  onDateRangeChange,
  onPageChange,
  onPageSizeChange,
  onTransactionClick,
  onClearFilters,
  getAvailableTypes,
}: TransactionTableProps) {
  return (
    <>
      <FiltersComponent
        accountId={accountId}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        selectedType={selectedType}
        selectedDateRange={selectedDateRange}
        categories={categories}
        availableTypes={getAvailableTypes(accountId)}
        onSearchChange={onSearchChange}
        onCategoryChange={onCategoryChange}
        onTypeChange={onTypeChange}
        onDateRangeChange={onDateRangeChange}
      />

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 font-medium text-gray-400">Description</th>
              <th className="text-left py-3 px-4 font-medium text-gray-400">Category</th>
              <th className="text-left py-3 px-4 font-medium text-gray-400">Date</th>
              <th className="text-right py-3 px-4 font-medium text-gray-400">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors cursor-pointer"
                  onClick={() => onTransactionClick(transaction)}
                >
                  <td className="py-4 px-4">
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
                        <div className="font-medium">{transaction.description}</div>
                        {transaction.descriptionRaw &&
                          transaction.descriptionRaw !== transaction.description && (
                            <div className="text-xs text-gray-400">
                              {transaction.descriptionRaw}
                            </div>
                          )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="outline" className="font-normal">
                      {transaction.category || 'Uncategorized'}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-gray-300">{formatDate(transaction.date)}</td>
                  <td
                    className={cn(
                      'py-4 px-4 text-right font-medium',
                      transaction.type === 'CREDIT'
                        ? 'text-finance-positive'
                        : 'text-finance-negative'
                    )}
                  >
                    {transaction.type === 'CREDIT' ? '+' : ''}
                    {formatCurrency(transaction.amount, transaction.currencyCode)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400">
                  No transactions match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaginationControls
        accountId={accountId}
        currentPage={currentPage}
        totalPages={totalPages}
        totalTransactions={totalTransactions}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />

      {transactions.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <Filter className="mx-auto mb-3 text-gray-500" size={24} />
          <p>No transactions match your filters.</p>
          <Button
            variant="link"
            className="mt-2 text-finance-accent"
            onClick={() => onClearFilters(accountId)}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </>
  );
}
