import { NextRequest, NextResponse } from 'next/server';
import { pluggyClient } from '@/lib/pluggy';

// Define the connector types based on Pluggy SDK
type ConnectorType =
  | 'PERSONAL_BANK'
  | 'BUSINESS_BANK'
  | 'INVOICE'
  | 'INVESTMENT'
  | 'TELECOMMUNICATION'
  | 'DIGITAL_ECONOMY'
  | 'PAYMENT_ACCOUNT'
  | 'OTHER';

// Define the parameters for fetching connectors
interface ConnectorFilters {
  name?: string;
  countries?: string[];
  types?: ConnectorType[];
  [key: string]: string | string[] | ConnectorType[] | undefined;
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering connectors
    const name = request.nextUrl.searchParams.get('name');
    const countries = request.nextUrl.searchParams.get('countries');
    const types = request.nextUrl.searchParams.get('types');

    // Prepare parameters for fetching connectors
    const params: ConnectorFilters = {};

    if (name) params.name = name;
    if (countries) params.countries = countries.split(',');

    // Handle types with proper type casting
    if (types) {
      params.types = types.split(',').filter((type): type is ConnectorType => {
        return [
          'PERSONAL_BANK',
          'BUSINESS_BANK',
          'INVOICE',
          'INVESTMENT',
          'TELECOMMUNICATION',
          'DIGITAL_ECONOMY',
          'PAYMENT_ACCOUNT',
          'OTHER',
        ].includes(type as ConnectorType);
      });
    }

    // Fetch connectors with optional filters
    const { results: connectors } = await pluggyClient.fetchConnectors(params);

    return NextResponse.json({ connectors });
  } catch (error) {
    console.error('Error fetching connectors:', error);
    return NextResponse.json({ error: 'Failed to fetch connectors' }, { status: 500 });
  }
}
