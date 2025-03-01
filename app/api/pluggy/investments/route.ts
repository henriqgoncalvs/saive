import { NextRequest, NextResponse } from 'next/server';
import { pluggyClient } from '@/lib/pluggy';
import { Investment } from 'pluggy-sdk';

// Define our frontend-friendly investment structure
interface PluggyInvestment {
  id: string;
  name: string;
  number?: string | null;
  balance: number;
  amount: number;
  type: string;
  date: string;
  value: number;
  quantity: number;
  itemId: string;
}

export async function GET(request: NextRequest) {
  try {
    // Get the item ID or account ID from the query parameters
    const itemId = request.nextUrl.searchParams.get('itemId');
    const accountId = request.nextUrl.searchParams.get('accountId');

    if (!itemId && !accountId) {
      return NextResponse.json(
        { error: 'Either Item ID or Account ID is required' },
        { status: 400 }
      );
    }

    let investments: Investment[] = [];

    // Fetch investments based on the provided parameters
    if (itemId) {
      const response = await pluggyClient.fetchInvestments(itemId);
      investments = response.results;
    } else if (accountId) {
      // If we have accountId, we need to filter investments by account
      // First, get the item that owns this account
      const accounts = await pluggyClient.fetchAccounts(accountId);
      if (accounts.results.length > 0) {
        const itemIdFromAccount = accounts.results[0].itemId;
        const response = await pluggyClient.fetchInvestments(itemIdFromAccount);
        // Filter investments by accountId
        investments = response.results.filter((inv) => inv.id.startsWith(accountId));
      }
    }

    // Transform the investments to a more frontend-friendly format
    const transformedInvestments: PluggyInvestment[] = investments.map((investment) => {
      // Convert date to string if it's a Date object
      const dateString =
        investment.date instanceof Date
          ? investment.date.toISOString()
          : typeof investment.date === 'string'
          ? investment.date
          : '';

      return {
        id: investment.id,
        name: investment.name,
        number: investment.number,
        balance: investment.balance || 0,
        amount: investment.amount || 0,
        type: investment.type || '',
        date: dateString,
        value: investment.value || 0,
        quantity: investment.quantity || 0,
        itemId: investment.itemId,
      };
    });

    return NextResponse.json({ investments: transformedInvestments });
  } catch (error) {
    console.error('Error fetching investments:', error);
    return NextResponse.json({ error: 'Failed to fetch investments' }, { status: 500 });
  }
}
