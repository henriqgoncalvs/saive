import { NextRequest, NextResponse } from 'next/server';
import { pluggyClient, transformAccount } from '@/lib/pluggy';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get the item ID from the query parameters
    const itemId = request.nextUrl.searchParams.get('itemId');

    if (!itemId) {
      // Get all accounts
      const accounts = await prisma.pluggyAccount.findMany();
      return NextResponse.json({ accounts });
    } else {
      // Fetch accounts for the specified item
      const { results: accounts } = await pluggyClient.fetchAccounts(itemId);
      const transformedAccounts = accounts.map(transformAccount);
      return NextResponse.json({ accounts: transformedAccounts });
    }
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}
