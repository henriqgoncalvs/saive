import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PluggyClient } from 'pluggy-sdk';
import { Session } from 'next-auth';

export async function GET() {
  const session = (await getServerSession(authOptions)) as Session | null;

  // Type guard for session
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const clientId = process.env.PLUGGY_CLIENT_ID;
    const clientSecret = process.env.PLUGGY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'Pluggy API credentials not configured' }, { status: 500 });
    }

    const pluggyClient = new PluggyClient({
      clientId,
      clientSecret,
    });

    // Create a connect token
    const connectToken = await pluggyClient.createConnectToken();

    return NextResponse.json({
      accessToken: connectToken.accessToken,
    });
  } catch (error) {
    console.error('Error generating connect token:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate connect token',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
