import { NextRequest, NextResponse } from 'next/server';
import { pluggyClient } from '@/lib/pluggy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { connectorId, parameters, webhookUrl, clientUserId } = body;

    if (!connectorId) {
      return NextResponse.json({ error: 'Connector ID is required' }, { status: 400 });
    }

    // Create a new item (connection)
    const item = await pluggyClient.createItem(connectorId, parameters, {
      webhookUrl,
      clientUserId,
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}
