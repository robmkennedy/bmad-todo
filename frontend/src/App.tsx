import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './styles/global.css';

/**
 * React Query client configuration
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
    },
  },
});

/**
 * Main App component
 *
 * This is the root component of the application.
 */
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <header>
          <div className="container">
            <h1>BMad Todo</h1>
          </div>
        </header>
        <main>
          <div className="container">
            <p>Welcome to BMad Todo!</p>
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
}

