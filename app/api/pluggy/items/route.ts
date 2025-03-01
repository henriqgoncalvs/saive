import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { PluggyClient } from 'pluggy-sdk';
import { Session } from 'next-auth';

const prisma = new PrismaClient();

// GET all items for the authenticated user
export async function GET() {
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    // Type assertion for TypeScript
    const userId = session.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'User ID not found in session' }, { status: 400 });
    }

    const items = await prisma.pluggyItem.findMany({
      where: {
        userId,
      },
      include: {
        accounts: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error fetching Pluggy items:', error);

    return NextResponse.json({ error: 'Failed to fetch Pluggy items' }, { status: 500 });
  }
}

// POST to create a new item
export async function POST(request: NextRequest) {
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const { itemId } = await request.json();

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    // Type assertion for TypeScript
    const userId = session.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'User ID not found in session' }, { status: 400 });
    }

    // Initialize Pluggy client
    const clientId = process.env.PLUGGY_CLIENT_ID;
    const clientSecret = process.env.PLUGGY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'Pluggy API credentials not configured' }, { status: 500 });
    }

    const pluggyClient = new PluggyClient({
      clientId,
      clientSecret,
    });

    // Fetch item details from Pluggy
    const item = await pluggyClient.fetchItem(itemId);

    if (!item) {
      return NextResponse.json({ error: 'Item not found in Pluggy' }, { status: 404 });
    }

    // Fetch connector details
    const connector = await pluggyClient.fetchConnector(item.connector.id);

    // Create or update the item in the database
    await prisma.pluggyItem.upsert({
      where: { id: itemId },
      update: {
        status: item.status,
        connector: connector,
        institution: {
          name: connector.name,
          imageUrl: connector.imageUrl,
          primaryColor: connector.primaryColor,
        },
      },
      create: {
        id: itemId,
        userId,
        status: item.status,
        connector: connector,
        institution: {
          name: connector.name,
          imageUrl: connector.imageUrl,
          primaryColor: connector.primaryColor,
        },
      },
    });

    // Fetch accounts for this item
    const accounts = await pluggyClient.fetchAccounts(itemId);

    // Create or update accounts in the database
    if (accounts && accounts.results) {
      for (const account of accounts.results) {
        await prisma.pluggyAccount.upsert({
          where: { id: account.id },
          update: {
            name: account.name,
            number: account.number,
            balance: account.balance,
            currencyCode: account.currencyCode,
            type: account.type,
            subtype: account.subtype,
          },
          create: {
            id: account.id,
            itemId: itemId,
            name: account.name,
            number: account.number,
            balance: account.balance,
            currencyCode: account.currencyCode,
            type: account.type,
            subtype: account.subtype,
          },
        });
      }
    }

    // Return the item with accounts
    const createdItem = await prisma.pluggyItem.findUnique({
      where: { id: itemId },
      include: { accounts: true },
    });

    return NextResponse.json({ item: createdItem });
  } catch (error) {
    console.error('Error creating Pluggy item:', error);

    return NextResponse.json(
      {
        error: 'Failed to create Pluggy item',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
