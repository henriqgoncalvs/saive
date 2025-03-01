import { PluggyAccount, PluggyTransaction } from '@/lib/pluggy';

// Types for the frontend
export interface ConnectTokenResponse {
  accessToken: string;
}

export interface ItemResponse {
  item: {
    id: string;
    connector: {
      id: string;
      name: string;
      institutionUrl: string;
      imageUrl: string;
      primaryColor: string;
      type: string;
      country: string;
    };
    status: string;
    executionStatus: string;
    createdAt: string;
    updatedAt: string;
    parameter: Record<string, string>;
  };
}

export interface AccountsResponse {
  accounts: PluggyAccount[];
}

export interface TransactionsResponse {
  transactions: PluggyTransaction[];
}

export interface ConnectorsResponse {
  connectors: Array<{
    id: string;
    name: string;
    institutionUrl: string;
    imageUrl: string;
    primaryColor: string;
    type: string;
    country: string;
    credentials: Array<{
      label: string;
      name: string;
      type: string;
    }>;
  }>;
}

// API service for Pluggy
export const PluggyService = {
  // Connect token
  getConnectToken: async (): Promise<ConnectTokenResponse> => {
    const response = await fetch('/api/pluggy/connect-token');
    if (!response.ok) {
      throw new Error('Failed to get connect token');
    }
    return response.json();
  },

  // Items (connections)
  getItem: async (itemId: string): Promise<ItemResponse> => {
    const response = await fetch(`/api/pluggy/items?itemId=${itemId}`);
    if (!response.ok) {
      throw new Error('Failed to get item');
    }
    return response.json();
  },

  updateItem: async (itemId: string): Promise<ItemResponse> => {
    const response = await fetch('/api/pluggy/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itemId }),
    });
    if (!response.ok) {
      throw new Error('Failed to update item');
    }
    return response.json();
  },

  createItem: async (
    connectorId: string,
    parameters: Record<string, string>,
    options?: { webhookUrl?: string; clientUserId?: string }
  ): Promise<ItemResponse> => {
    const response = await fetch('/api/pluggy/items/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        connectorId,
        parameters,
        ...options,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to create item');
    }
    return response.json();
  },

  deleteItem: async (itemId: string): Promise<{ success: boolean }> => {
    const response = await fetch(`/api/pluggy/items/delete?itemId=${itemId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete item');
    }
    return response.json();
  },

  // Accounts
  getAllAccounts: async (): Promise<AccountsResponse> => {
    const response = await fetch(`/api/pluggy/accounts`);
    if (!response.ok) {
      throw new Error('Failed to get accounts');
    }
    return response.json();
  },

  // Accounts
  getAccounts: async (itemId: string): Promise<AccountsResponse> => {
    const response = await fetch(`/api/pluggy/accounts?itemId=${itemId}`);
    if (!response.ok) {
      throw new Error('Failed to get accounts');
    }
    return response.json();
  },

  // Transactions
  getTransactions: async (
    accountId: string,
    from?: string,
    to?: string
  ): Promise<TransactionsResponse> => {
    let url = `/api/pluggy/transactions?accountId=${accountId}`;
    if (from) url += `&from=${from}`;
    if (to) url += `&to=${to}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to get transactions');
    }
    return response.json();
  },

  // Connectors
  getConnectors: async (filters?: {
    name?: string;
    countries?: string[];
    types?: string[];
  }): Promise<ConnectorsResponse> => {
    let url = '/api/pluggy/connectors';
    const params = new URLSearchParams();

    if (filters) {
      if (filters.name) params.append('name', filters.name);
      if (filters.countries) params.append('countries', filters.countries.join(','));
      if (filters.types) params.append('types', filters.types.join(','));
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to get connectors');
    }
    return response.json();
  },
};
