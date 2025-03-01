import { NextRequest, NextResponse } from 'next/server';
import { pluggyClient } from '@/lib/pluggy';

export async function DELETE(request: NextRequest) {
  try {
    // Get the item ID from the query parameters
    const itemId = request.nextUrl.searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    // Delete the item
    await pluggyClient.deleteItem(itemId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
