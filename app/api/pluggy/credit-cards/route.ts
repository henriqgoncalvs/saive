import { NextRequest, NextResponse } from 'next/server';
import { pluggyClient } from '@/lib/pluggy';

// Define our frontend-friendly credit card bill structure
interface CreditCardBill {
  id: string;
  accountId: string;
  name: string;
  status: string;
  dueDate: string;
  closeDate: string;
  amount: number;
  currencyCode: string;
  period: string;
}

// Define a type for the raw bill data from Pluggy SDK
type PluggyCreditCardBill = {
  id: string;
  dueDate: Date | string;
  [key: string]: unknown;
};

export async function GET(request: NextRequest) {
  try {
    // Get the account ID from the query parameters
    const accountId = request.nextUrl.searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }

    // Fetch credit card bills for the specified account
    const { results: creditCardBills } = await pluggyClient.fetchCreditCardBills(accountId);

    // Transform the credit card bills to a more frontend-friendly format using type assertion
    // since the Pluggy SDK types might not match exactly what we receive
    const transformedBills: CreditCardBill[] = creditCardBills.map((bill: PluggyCreditCardBill) => {
      // Handle date conversion if needed
      const dueDate =
        bill.dueDate instanceof Date
          ? bill.dueDate.toISOString()
          : typeof bill.dueDate === 'string'
          ? bill.dueDate
          : '';

      const closeDate =
        bill.closeDate instanceof Date
          ? bill.closeDate.toISOString()
          : typeof bill.closeDate === 'string'
          ? bill.closeDate
          : typeof bill.billingDate === 'string'
          ? bill.billingDate
          : '';

      return {
        id: bill.id,
        accountId: (bill.accountId as string) || accountId,
        name: (bill.name as string) || 'Credit Card Bill',
        status: (bill.status as string) || 'PENDING',
        dueDate,
        closeDate,
        amount: typeof bill.amount === 'number' ? bill.amount : 0,
        currencyCode: (bill.currencyCode as string) || 'USD',
        period: (bill.period as string) || '',
      };
    });

    return NextResponse.json({ creditCardBills: transformedBills });
  } catch (error) {
    console.error('Error fetching credit card bills:', error);
    return NextResponse.json({ error: 'Failed to fetch credit card bills' }, { status: 500 });
  }
}
