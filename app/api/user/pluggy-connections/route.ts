import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PluggyAuthService } from '@/lib/services/pluggy-auth-service';
import { Session } from 'next-auth';

// Get all Pluggy connections for the authenticated user
export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const connections = await PluggyAuthService.getUserPluggyConnections(session.user.id);

    return NextResponse.json({ connections });
  } catch (error) {
    console.error('Error getting user Pluggy connections:', error);
    return NextResponse.json({ error: 'Failed to get Pluggy connections' }, { status: 500 });
  }
}

// Delete a Pluggy connection for the authenticated user
export async function DELETE(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the item ID from the query parameters
    const itemId = request.nextUrl.searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    await PluggyAuthService.deletePluggyConnection(session.user.id, itemId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting Pluggy connection:', error);
    return NextResponse.json({ error: 'Failed to delete Pluggy connection' }, { status: 500 });
  }
}
