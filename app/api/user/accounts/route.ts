import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PluggyAuthService } from '@/lib/services/pluggy-auth-service';
import { Session } from 'next-auth';

// Get all accounts from all Pluggy connections for the authenticated user
export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accounts = await PluggyAuthService.getUserAccounts(session.user.id);

    return NextResponse.json({ accounts });
  } catch (error) {
    console.error('Error getting user accounts:', error);
    return NextResponse.json({ error: 'Failed to get user accounts' }, { status: 500 });
  }
}
