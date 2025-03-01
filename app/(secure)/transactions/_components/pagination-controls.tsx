import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PaginationControlsProps {
  accountId: string;
  currentPage: number;
  totalPages: number;
  totalTransactions: number;
  pageSize: number;
  onPageChange: (accountId: string, page: number) => void;
  onPageSizeChange: (accountId: string, pageSize: number) => void;
}

export function PaginationControls({
  accountId,
  currentPage,
  totalPages,
  totalTransactions,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationControlsProps) {
  if (totalPages <= 1 && totalTransactions <= 50) return null;

  return (
    <div className="flex justify-between items-center mt-6">
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-400">{totalTransactions} transactions</div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Show</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              onPageSizeChange(accountId, Number(value));
            }}
          >
            <SelectTrigger className="w-[80px] h-8 text-xs bg-gray-800/50 border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="200">200</SelectItem>
              <SelectItem value="300">300</SelectItem>
              <SelectItem value="500">500</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-400">per page</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(accountId, Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        <div className="flex items-center gap-1 px-2">
          <span className="text-sm font-medium">{currentPage}</span>
          <span className="text-sm text-gray-400">of</span>
          <span className="text-sm font-medium">{totalPages}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(accountId, Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
