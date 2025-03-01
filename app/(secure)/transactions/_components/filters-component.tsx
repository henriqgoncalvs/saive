import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Category } from '../_types';

interface FiltersComponentProps {
  accountId: string;
  searchTerm: string;
  selectedCategory: string;
  selectedType: string;
  selectedDateRange: string;
  categories: Category[];
  availableTypes: string[];
  onSearchChange: (accountId: string, value: string) => void;
  onCategoryChange: (accountId: string, value: string) => void;
  onTypeChange: (accountId: string, value: string) => void;
  onDateRangeChange: (accountId: string, value: string) => void;
}

export function FiltersComponent({
  accountId,
  searchTerm,
  selectedCategory,
  selectedType,
  selectedDateRange,
  categories,
  availableTypes,
  onSearchChange,
  onCategoryChange,
  onTypeChange,
  onDateRangeChange,
}: FiltersComponentProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          type="text"
          placeholder="Search transactions..."
          className="pl-10 bg-gray-800/50 border-gray-700"
          value={searchTerm}
          onChange={(e) => onSearchChange(accountId, e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Select
          value={selectedCategory}
          onValueChange={(value) => onCategoryChange(accountId, value)}
        >
          <SelectTrigger className="w-[140px] bg-gray-800/50 border-gray-700">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.descriptionTranslated}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={(value) => onTypeChange(accountId, value)}>
          <SelectTrigger className="w-[140px] bg-gray-800/50 border-gray-700">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {availableTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type === 'all' ? 'All Types' : type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedDateRange}
          onValueChange={(value) => onDateRangeChange(accountId, value)}
        >
          <SelectTrigger className="w-[140px] bg-gray-800/50 border-gray-700">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
