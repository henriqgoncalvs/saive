import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AccountCard } from './account-card';
import { Account } from '@/app/(secure)/transactions/_types';

interface AccountsSectionProps {
  accounts: Account[];
}

export function AccountsSection({ accounts }: AccountsSectionProps) {
  return (
    <Card className="bg-primary-solid bg-noise">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Accounts</CardTitle>
        <Link href="/accounts">
          <Button variant="link" className="text-finance-accent">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.length > 0 ? (
            accounts
              .slice(0, 4)
              .map((account) => (
                <AccountCard
                  key={account.id}
                  id={account.id}
                  name={account.name}
                  balance={account.balance}
                  currency={account.currency}
                  type={account.type}
                  number={account.number}
                />
              ))
          ) : (
            <div className="col-span-2 text-center py-6 text-gray-400">
              <p>No accounts found. Connect your accounts to get started.</p>
              <Link href="/pluggy">
                <Button variant="gradient" className="mt-4">
                  Connect Accounts
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
