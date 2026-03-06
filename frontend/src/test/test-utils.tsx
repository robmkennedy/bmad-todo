import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '../hooks/useToast';
import { ToastContainer } from '../components/Toast';

/**
 * Create a fresh QueryClient for tests with retry disabled
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

/**
 * Create a wrapper component with QueryClientProvider for testing hooks/components
 */
export function createQueryWrapper() {
  const queryClient = createTestQueryClient();
  return function QueryWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

/**
 * Create a wrapper that uses a specific QueryClient instance
 * Useful when multiple hooks need to share the same cache
 */
export function createQueryWrapperWithClient(queryClient: QueryClient) {
  return function QueryWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

/**
 * Create a wrapper with QueryClient and ToastProvider for component testing
 * Includes ToastContainer to render toast notifications
 */
export function createAppWrapper() {
  const queryClient = createTestQueryClient();
  return function AppWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          {children}
          <ToastContainer />
        </ToastProvider>
      </QueryClientProvider>
    );
  };
}

/**
 * Create a wrapper with specific QueryClient and ToastProvider
 */
export function createAppWrapperWithClient(queryClient: QueryClient) {
  return function AppWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          {children}
          <ToastContainer />
        </ToastProvider>
      </QueryClientProvider>
    );
  };
}

