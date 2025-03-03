import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Transaction } from '../_types';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface TransactionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
}

export function TransactionModal({ isOpen, onOpenChange, transaction }: TransactionModalProps) {
  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>Complete information about this transaction</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{transaction.description}</h3>
              {transaction.descriptionRaw &&
                transaction.descriptionRaw !== transaction.description && (
                  <p className="text-sm text-gray-400">{transaction.descriptionRaw}</p>
                )}
            </div>
            <div
              className={
                transaction.type === 'CREDIT'
                  ? 'text-finance-positive text-xl font-bold'
                  : 'text-finance-negative text-xl font-bold'
              }
            >
              {transaction.type === 'CREDIT' ? '+' : ''}
              {formatCurrency(transaction.amount, transaction.currencyCode)}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Transaction Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs text-gray-500 mb-1">Date</h4>
                <p>{formatDate(transaction.date)}</p>
              </div>
              <div>
                <h4 className="text-xs text-gray-500 mb-1">Type</h4>
                <p>{transaction.type}</p>
              </div>
              <div>
                <h4 className="text-xs text-gray-500 mb-1">Category</h4>
                <p>{transaction.category || 'Uncategorized'}</p>
              </div>
              <div>
                <h4 className="text-xs text-gray-500 mb-1">Account</h4>
                <p>{transaction.accountName}</p>
              </div>
              {transaction.status && (
                <div>
                  <h4 className="text-xs text-gray-500 mb-1">Status</h4>
                  <p>{transaction.status}</p>
                </div>
              )}
              {transaction.balance !== undefined && (
                <div>
                  <h4 className="text-xs text-gray-500 mb-1">Balance After Transaction</h4>
                  <p>{formatCurrency(transaction.balance, transaction.currencyCode)}</p>
                </div>
              )}
            </div>
          </div>

          {transaction.creditCardMetadata && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Credit Card Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  {transaction.creditCardMetadata.installmentNumber && (
                    <div>
                      <h4 className="text-xs text-gray-500 mb-1">Installment</h4>
                      <p>
                        {transaction.creditCardMetadata.installmentNumber} of{' '}
                        {transaction.creditCardMetadata.totalInstallments || '?'}
                      </p>
                    </div>
                  )}
                  {transaction.creditCardMetadata.totalAmount && (
                    <div>
                      <h4 className="text-xs text-gray-500 mb-1">Total Amount</h4>
                      <p>
                        {formatCurrency(
                          transaction.creditCardMetadata.totalAmount,
                          transaction.currencyCode
                        )}
                      </p>
                    </div>
                  )}
                  {transaction.creditCardMetadata.purchaseDate && (
                    <div>
                      <h4 className="text-xs text-gray-500 mb-1">Purchase Date</h4>
                      <p>{formatDate(transaction.creditCardMetadata.purchaseDate)}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {transaction.paymentData && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Payment Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  {transaction.paymentData.paymentMethod && (
                    <div>
                      <h4 className="text-xs text-gray-500 mb-1">Payment Method</h4>
                      <p>{transaction.paymentData.paymentMethod}</p>
                    </div>
                  )}
                  {transaction.paymentData.referenceNumber && (
                    <div>
                      <h4 className="text-xs text-gray-500 mb-1">Reference Number</h4>
                      <p>{transaction.paymentData.referenceNumber}</p>
                    </div>
                  )}
                  {transaction.paymentData.reason && (
                    <div>
                      <h4 className="text-xs text-gray-500 mb-1">Reason</h4>
                      <p>{transaction.paymentData.reason}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {transaction.merchant && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Merchant Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs text-gray-500 mb-1">Name</h4>
                    <p>{transaction.merchant.name}</p>
                  </div>
                  {transaction.merchant.businessName && (
                    <div>
                      <h4 className="text-xs text-gray-500 mb-1">Business Name</h4>
                      <p>{transaction.merchant.businessName}</p>
                    </div>
                  )}
                  {transaction.merchant.cnpj && (
                    <div>
                      <h4 className="text-xs text-gray-500 mb-1">CNPJ</h4>
                      <p>{transaction.merchant.cnpj}</p>
                    </div>
                  )}
                  {transaction.merchant.category && (
                    <div>
                      <h4 className="text-xs text-gray-500 mb-1">Category</h4>
                      <p>{transaction.merchant.category}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          <Accordion type="single" collapsible className="overflow-x-auto">
            <AccordionItem value="transaction">
              <AccordionTrigger>Transaction Details</AccordionTrigger>
              <AccordionContent>
                <pre className="max-w-full overflow-x-auto text-xs">
                  {JSON.stringify(transaction, null, 2)}
                </pre>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
}
