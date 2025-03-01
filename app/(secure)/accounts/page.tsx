'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PluggyConnectButton } from '@/components/PluggyConnectButton';
import { Skeleton } from '@/components/ui/skeleton';

// Define the account structure
interface PluggyAccount {
  id: string;
  name: string;
  number: string;
  balance: number;
  currencyCode: string;
  type: string;
  subtype?: string;
}

// Define the item structure
interface PluggyItem {
  id: string;
  status: string;
  institution: {
    name: string;
    imageUrl: string;
    primaryColor: string;
  };
  accounts: PluggyAccount[];
}

export default function AccountsPage() {
  const { status } = useSession();
  const { toast } = useToast();
  const [items, setItems] = useState<PluggyItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedItemToUpdate, setSelectedItemToUpdate] = useState<string | null>(null);

  // Fetch user connections when session changes
  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserConnections();
    }
  }, [status]);

  // Fetch user connections from the server
  const fetchUserConnections = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/pluggy/items');

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch connections');
      }

      const data = await response.json();
      console.log(data);
      setItems(data.items || []);
    } catch (error) {
      console.error('Error fetching connections:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch connections');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle successful connection
  const handleConnectSuccess = async (itemId: string) => {
    try {
      setIsLoading(true);

      // Save the connection to the database
      const response = await fetch('/api/pluggy/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save connection');
      }

      const data = await response.json();

      // If we were updating an item, replace it in the list
      if (selectedItemToUpdate) {
        setItems((prev) =>
          prev.map((item) => (item.id === selectedItemToUpdate ? data.item : item))
        );
        setSelectedItemToUpdate(null);
        toast({
          title: 'Success',
          description: 'Successfully updated your connection',
        });
      } else {
        // Otherwise add the new item to the list
        setItems((prev) => [...prev, data.item]);
        toast({
          title: 'Success',
          description: 'Successfully connected to your financial institution',
        });
      }
    } catch (error) {
      console.error('Error saving connection:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your connection',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle disconnection
  const handleDisconnect = async (itemId: string) => {
    try {
      setIsDeleting(itemId);

      const response = await fetch(`/api/pluggy/items/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setItems((prev) => prev.filter((item) => item.id !== itemId));
        toast({
          title: 'Success',
          description: 'Successfully disconnected from your financial institution',
        });
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to disconnect');
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast({
        title: 'Error',
        description: 'Failed to disconnect from your financial institution',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  // Handle updating an existing connection
  const handleUpdateConnection = (itemId: string) => {
    setSelectedItemToUpdate(itemId);
  };

  if (status === 'loading') {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You need to sign in to connect your bank accounts</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild>
              <a href="/auth/signin">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      {isLoading ? (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center p-6">
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="p-6 text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={fetchUserConnections}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      ) : items.length === 0 ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Connect Your Financial Accounts</CardTitle>
            <CardDescription>
              You haven&apos;t connected any financial accounts yet. Connect your accounts to get
              started.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4 pt-2">
            <p className="text-center mb-4">
              Connect your bank accounts, credit cards, and investment accounts to see all your
              finances in one place.
            </p>
            <PluggyConnectButton
              onSuccess={handleConnectSuccess}
              onError={(error) => {
                toast({
                  title: 'Error',
                  description: error.message,
                  variant: 'destructive',
                });
              }}
              onClose={() => {
                console.log('Widget closed');
              }}
            >
              Connect Account
            </PluggyConnectButton>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Connected Accounts</h2>
            <PluggyConnectButton
              onSuccess={handleConnectSuccess}
              onError={(error) => {
                toast({
                  title: 'Error',
                  description: error.message,
                  variant: 'destructive',
                });
              }}
              onClose={() => {
                console.log('Widget closed');
              }}
            >
              Connect New Account
            </PluggyConnectButton>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  {item.institution.imageUrl && (
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: item.institution.primaryColor || '#f0f0f0' }}
                    >
                      <img
                        src={item.institution.imageUrl}
                        alt={item.institution.name}
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <CardTitle>{item.institution.name}</CardTitle>
                    <CardDescription>
                      Status:{' '}
                      <span
                        className={item.status === 'UPDATED' ? 'text-green-500' : 'text-amber-500'}
                      >
                        {item.status === 'UPDATED' ? 'Connected' : 'Updating...'}
                      </span>
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">Accounts</h3>
                    {item.accounts.length > 0 ? (
                      <div className="space-y-3">
                        {item.accounts.map((account) => (
                          <div
                            key={account.id}
                            className="flex justify-between items-center p-3 bg-muted/50 rounded-md"
                          >
                            <div>
                              <p className="font-medium">{account.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {account.type} {account.subtype ? `• ${account.subtype}` : ''} •{' '}
                                {account.number}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">
                                {new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: account.currencyCode,
                                }).format(account.balance)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No accounts found</p>
                    )}
                  </div>
                </CardContent>
                <div className="flex justify-end gap-2 p-4 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateConnection(item.id)}
                    disabled={isDeleting === item.id}
                  >
                    Update
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDisconnect(item.id)}
                    disabled={isDeleting === item.id}
                  >
                    {isDeleting === item.id ? 'Disconnecting...' : 'Disconnect'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Update connection dialog */}
      {selectedItemToUpdate && (
        <PluggyConnectButton
          updateItem={selectedItemToUpdate}
          onSuccess={handleConnectSuccess}
          onError={(error) => {
            toast({
              title: 'Error',
              description: error.message,
              variant: 'destructive',
            });
            setSelectedItemToUpdate(null);
          }}
          onClose={() => {
            console.log('Update widget closed');
            setSelectedItemToUpdate(null);
          }}
        />
      )}
    </div>
  );
}
