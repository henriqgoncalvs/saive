// Define interface for account data
export interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: string;
  number?: string;
}

// Define interface for category data
export interface Category {
  id: string;
  name: string;
  parentId?: string;
  parentName?: string;
  description?: string;
  descriptionTranslated?: string;
}

// Define interface for transaction data with extended properties
export interface Transaction {
  id: string;
  description: string;
  descriptionRaw?: string;
  type: string;
  amount: number;
  date: string;
  category?: string;
  categoryId?: string;
  accountId: string;
  accountName?: string;
  currencyCode?: string;
  status?: string;
  balance?: number;
  operationType?: string;
  creditCardMetadata?: {
    installmentNumber?: number;
    totalInstallments?: number;
    totalAmount?: number;
    purchaseDate?: string;
    payeeMCC?: number;
  };
  paymentData?: {
    paymentMethod?: string;
    referenceNumber?: string;
    reason?: string;
    payer?: {
      name?: string;
      documentNumber?: {
        value?: string;
        type?: string;
      };
    };
    receiver?: {
      name?: string;
      documentNumber?: {
        value?: string;
        type?: string;
      };
    };
  };
  merchant?: {
    name: string;
    businessName: string;
    cnpj: string;
    category?: string;
  };
}
