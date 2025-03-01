import { useCallback } from 'react';

// Define the event payload type
interface ConnectEventPayload {
  event: string;
  metadata?: Record<string, unknown>;
}

interface PluggyConnectOptions {
  connectToken: string;
  onSuccess?: (data: { item: { id: string } }) => void;
  onError?: (error: { message: string }) => void;
  onClose?: () => void;
  onEvent?: (payload: ConnectEventPayload) => void;
  updateItem?: string;
  includeSandbox?: boolean;
}

interface PluggyConnectResult {
  openConnect: (options: PluggyConnectOptions) => void;
  isPluggyLoaded: boolean;
}

/**
 * Hook to interact with Pluggy Connect through the BFF approach
 *
 * This hook provides a function to open the Pluggy Connect widget
 * using the react-pluggy-connect component. It assumes the component
 * is already imported and available in your component.
 *
 * @returns An object with functions to interact with Pluggy Connect
 */
export function usePluggyConnect(): PluggyConnectResult {
  // Always return true since we're using the react-pluggy-connect component
  // which handles the loading of the Pluggy Connect widget
  const isPluggyLoaded = true;

  /**
   * Open the Pluggy Connect widget
   *
   * This function doesn't directly interact with the Pluggy API.
   * Instead, it returns the options that should be passed to the
   * PluggyConnect component from react-pluggy-connect.
   *
   * The actual connection is handled by the PluggyConnectButton component
   * which uses the BFF approach to get the connect token.
   */
  const openConnect = useCallback((options: PluggyConnectOptions) => {
    // This function is just a pass-through for the options
    // The actual connection is handled by the PluggyConnect component
    // which is imported and used in the PluggyConnectButton component

    if (!options.connectToken) {
      console.error('Connect token is required');
      if (options.onError) {
        options.onError({ message: 'Connect token is required' });
      }
      return;
    }

    // The widget will be opened by the PluggyConnect component
    // This hook just provides the interface for consistency
  }, []);

  return {
    openConnect,
    isPluggyLoaded,
  };
}
