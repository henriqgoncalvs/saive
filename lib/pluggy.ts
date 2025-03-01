import { PluggyClient, Account, Transaction } from 'pluggy-sdk';

// Check if environment variables are properly set
const clientId = process.env.PLUGGY_CLIENT_ID;
const clientSecret = process.env.PLUGGY_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error('Pluggy API credentials are missing. Please check your .env.local file.');
}

// Initialize Pluggy client with environment variables
export const pluggyClient = new PluggyClient({
  clientId: clientId || '',
  clientSecret: clientSecret || '',
});

// Types for Pluggy data
export interface PluggyAccount {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: string;
  number?: string;
  // Add more fields as needed
}

export interface PluggyTransaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category?: string;
  type: 'CREDIT' | 'DEBIT';
  // Add more fields as needed
}

// Helper functions for data transformation
export const transformAccount = (account: Account): PluggyAccount => {
  return {
    id: account.id,
    name: account.name,
    balance: account.balance,
    currency: account.currencyCode,
    type: account.type,
    number: account.number,
  };
};

export const transformTransaction = (transaction: Transaction): PluggyTransaction => {
  // Extract category safely
  let categoryName: string | undefined = undefined;
  try {
    if (transaction.category) {
      // @ts-expect-error - Handle different possible category structures
      categoryName = transaction.category.description || transaction.category;
    }
  } catch (e) {
    console.error('Error extracting category:', e);
  }

  return {
    id: transaction.id,
    description: transaction.description,
    amount: transaction.amount,
    date: transaction.date.toISOString(),
    category: categoryName,
    type: transaction.type,
  };
};
