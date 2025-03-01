import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { CreditCard, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface AccountCardProps {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: string;
  number?: string;
}

export function AccountCard({ id, name, balance, currency, type, number }: AccountCardProps) {
  return (
    <Card className="bg-primary-solid bg-noise hover:bg-primary-solid-light transition-colors">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <CreditCard size={16} className="text-gray-400" />
              <p className="text-sm text-gray-400">{type}</p>
            </div>
            <h3 className="text-lg font-medium mt-1">{name}</h3>
            {number && <p className="text-xs text-gray-400 mt-1">•••• {number.slice(-4)}</p>}
          </div>
          <Link href={`/accounts/${id}`} className="text-gray-400 hover:text-white">
            <ExternalLink size={16} />
          </Link>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-400">Balance</p>
          <h4 className="text-xl font-bold mt-1">{formatCurrency(balance, currency)}</h4>
        </div>
      </CardContent>
    </Card>
  );
} 