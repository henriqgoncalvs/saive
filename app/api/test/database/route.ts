import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET() {
  const prisma = new PrismaClient();

  try {
    // Test the database connection by running a simple query
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      connected: true,
      message: 'Successfully connected to the database',
    });
  } catch (error) {
    console.error('Database connection error:', error);

    return NextResponse.json(
      {
        connected: false,
        message: error instanceof Error ? error.message : 'Unknown database error',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
