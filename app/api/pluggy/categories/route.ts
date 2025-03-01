import { NextRequest, NextResponse } from 'next/server';
import { pluggyClient } from '@/lib/pluggy';

export async function GET(request: NextRequest) {
  try {
    // Get the parentId from the query parameters (optional)
    const parentId = request.nextUrl.searchParams.get('parentId');

    // Fetch categories from Pluggy API
    const { results: categories } = await pluggyClient.fetchCategories();

    // Filter by parentId if provided
    const filteredCategories = parentId
      ? categories.filter((category) => category.parentId === parentId)
      : categories;

    return NextResponse.json({ categories: filteredCategories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
