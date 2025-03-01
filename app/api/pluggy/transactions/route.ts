import { NextRequest, NextResponse } from 'next/server';
import { pluggyClient, transformTransaction } from '@/lib/pluggy';

// Define the type for transaction query parameters
interface TransactionQueryParams {
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
  type?: string;
  categoryId?: string;
  status?: string;
  search?: string;
}

export async function GET(request: NextRequest) {
  try {
    // Get all query parameters
    const accountId = request.nextUrl.searchParams.get('accountId');
    const from = request.nextUrl.searchParams.get('from');
    const to = request.nextUrl.searchParams.get('to');
    const pageParam = request.nextUrl.searchParams.get('page');
    const pageSizeParam = request.nextUrl.searchParams.get('pageSize');
    const type = request.nextUrl.searchParams.get('type');
    const categoryId = request.nextUrl.searchParams.get('categoryId');
    const status = request.nextUrl.searchParams.get('status');
    const search = request.nextUrl.searchParams.get('search');

    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }

    // Parse page and size parameters
    let page;
    let pageSize;
    if (pageParam) {
      page = parseInt(pageParam, 10);
    }
    if (pageSizeParam) {
      pageSize = parseInt(pageSizeParam, 10);
    }

    // Build query parameters for Pluggy API
    const queryParams: TransactionQueryParams = {
      from: from || undefined,
      to: to || undefined,
      ...(page && { page }),
      ...(pageSize && { pageSize }),
      type: type || undefined,
      categoryId: categoryId || undefined,
      status: status || undefined,
      search: search || undefined,
    };

    // Remove undefined values
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key as keyof TransactionQueryParams] === undefined) {
        delete queryParams[key as keyof TransactionQueryParams];
      }
    });

    // Fetch transactions for the specified account with filters
    const response = await pluggyClient.fetchTransactions(accountId, queryParams);

    // Transform the transactions to our format
    const transformedTransactions = response.results.map(transformTransaction);

    return NextResponse.json({
      transactions: transformedTransactions,
      total: response.total,
      totalPages: response.totalPages,
      page: response.page,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
