'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import dynamic from 'next/dynamic';
import type { ConnectEventPayload, PluggyConnect as PluggyConnectType } from 'react-pluggy-connect';

// Dynamically import PluggyConnect to avoid SSR issues
// This is important because the Pluggy Connect widget uses browser-only APIs
const PluggyConnect = dynamic(
  () => import('react-pluggy-connect').then((mod) => mod.PluggyConnect),
  { ssr: false }
) as typeof PluggyConnectType;

// Define props for our button component
// We extend ButtonProps to allow all standard button props to be passed through
interface PluggyConnectButtonProps extends Omit<ButtonProps, 'onError'> {
  onSuccess?: (itemId: string) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
  updateItem?: string; // Optional itemId to update an existing connection
}

// Define the Item interface for Pluggy Connect
interface PluggyItem {
  id: string;
  [key: string]: unknown;
}

// Define the error type for Pluggy Connect
interface PluggyConnectError {
  message: string;
  data?: {
    item: PluggyItem;
  };
  code?: string;
}

/**
 * PluggyConnectButton - A button that opens the Pluggy Connect widget
 *
 * This component follows the approach used in the Pluggy quickstart repository:
 * https://github.com/pluggyai/quickstart/blob/master/frontend/nextjs/pages/index.tsx
 *
 * It handles:
 * 1. Fetching a connect token from the server
 * 2. Opening the Pluggy Connect widget when clicked
 * 3. Managing loading states
 * 4. Providing callbacks for success, error, and close events
 */
export function PluggyConnectButton({
  onSuccess,
  onError,
  onClose,
  updateItem,
  className,
  ...props
}: PluggyConnectButtonProps) {
  const [connecting, setConnecting] = useState(false);
  const [connectToken, setConnectToken] = useState<string | undefined>();
  const { toast } = useToast();

  // Fetch a connect token from the server
  const generateToken = useCallback(async () => {
    try {
      const response = await fetch('/api/pluggy/connect-token');
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.accessToken) {
        throw new Error('No access token received');
      }

      setConnectToken(data.accessToken);
      return data.accessToken;
    } catch (error) {
      console.error('Error getting connect token:', error);
      if (onError && error instanceof Error) {
        onError(error);
      } else if (onError) {
        onError(new Error('Failed to get connect token'));
      }
      toast({
        title: 'Error',
        description: 'Failed to get connect token',
        variant: 'destructive',
      });
      return null;
    }
  }, [onError, toast]);

  // Handle success event from Pluggy Connect
  const handleSuccess = useCallback(
    (itemData: { item: { id: string } }) => {
      console.log('Successfully connected account:', itemData.item);
      if (onSuccess) {
        onSuccess(itemData.item.id);
      }
      setConnecting(false);
    },
    [onSuccess]
  );

  // Handle error event from Pluggy Connect
  const handleError = useCallback(
    (error: PluggyConnectError) => {
      console.error('Error connecting account:', error);
      if (onError) {
        onError(new Error(error.message || 'Unknown error'));
      }
      setConnecting(false);
    },
    [onError]
  );

  // Handle close event from Pluggy Connect
  const handleClose = useCallback(() => {
    console.log('Pluggy Connect widget closed');
    if (onClose) {
      onClose();
    }
    setConnecting(false);
  }, [onClose]);

  // Handle events from Pluggy Connect for logging/debugging
  const handleEvent = useCallback((payload: ConnectEventPayload) => {
    const { event } = payload;
    console.log('[Pluggy Connect event]', event);
  }, []);

  // Open the Pluggy Connect widget
  const handleOpenConnect = useCallback(async () => {
    try {
      // Get a connect token if we don't have one
      if (!connectToken) {
        const token = await generateToken();
        if (!token) return;
      }

      setConnecting(true);
    } catch (error) {
      console.error('Error opening Pluggy Connect:', error);
      if (onError && error instanceof Error) {
        onError(error);
      } else if (onError) {
        onError(new Error('Failed to open Pluggy Connect'));
      }
      toast({
        title: 'Error',
        description: 'Failed to open Pluggy Connect',
        variant: 'destructive',
      });
    }
  }, [connectToken, generateToken, onError, toast]);

  return (
    <>
      <Button onClick={handleOpenConnect} disabled={connecting} className={className} {...props}>
        {connecting ? 'Connecting...' : props.children || 'Connect Bank Account'}
      </Button>

      {/* 
        The PluggyConnect component is only rendered when connecting is true
        This follows the pattern in the Pluggy quickstart repo
        https://github.com/pluggyai/quickstart/blob/master/frontend/nextjs/pages/index.tsx
      */}
      {connecting && connectToken && (
        <PluggyConnect
          connectToken={connectToken}
          updateItem={updateItem}
          onSuccess={handleSuccess}
          onError={handleError}
          onClose={handleClose}
          onEvent={handleEvent}
          includeSandbox={true} // Enable sandbox for testing
        />
      )}
    </>
  );
}
