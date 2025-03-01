import { NextRequest, NextResponse } from 'next/server';
import { pluggyClient } from '@/lib/pluggy';

export async function GET(request: NextRequest) {
  try {
    // Get the item ID from the query parameters
    const itemId = request.nextUrl.searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    // Fetch identity information for the specified item
    const identity = await pluggyClient.fetchIdentityByItemId(itemId);

    return NextResponse.json({ identity });
  } catch (error) {
    console.error('Error fetching identity:', error);
    return NextResponse.json({ error: 'Failed to fetch identity' }, { status: 500 });
  }
}
