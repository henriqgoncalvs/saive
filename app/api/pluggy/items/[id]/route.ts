import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { PluggyClient } from 'pluggy-sdk';
import { Session } from 'next-auth';

const prisma = new PrismaClient();

// GET a specific item
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { id } = params;

  try {
    // Ensure the item belongs to the user
    const item = await prisma.pluggyItem.findFirst({
      where: {
        id,
        userId: session.user?.id,
      },
      include: {
        accounts: true,
      },
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Error fetching Pluggy item:', error);

    return NextResponse.json({ error: 'Failed to fetch Pluggy item' }, { status: 500 });
  }
}

// DELETE an item
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { id } = params;

  try {
    // Ensure the item belongs to the user
    const item = await prisma.pluggyItem.findFirst({
      where: {
        id,
        userId: session.user?.id,
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found or not authorized to delete' },
        { status: 404 }
      );
    }

    // Delete the item from Pluggy
    try {
      const clientId = process.env.PLUGGY_CLIENT_ID;
      const clientSecret = process.env.PLUGGY_CLIENT_SECRET;

      if (clientId && clientSecret) {
        const pluggyClient = new PluggyClient({
          clientId,
          clientSecret,
        });

        await pluggyClient.deleteItem(id);
      }
    } catch (pluggyError) {
      console.error('Error deleting item from Pluggy:', pluggyError);
      // Continue with local deletion even if Pluggy deletion fails
    }

    // Delete the item from the database (cascade will delete accounts)
    await prisma.pluggyItem.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting Pluggy item:', error);

    return NextResponse.json({ error: 'Failed to delete Pluggy item' }, { status: 500 });
  }
}
