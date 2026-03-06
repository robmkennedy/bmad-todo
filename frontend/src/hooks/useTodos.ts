import { useQuery } from '@tanstack/react-query';
import type { Todo } from '@shared/types';

/**
 * Fetch all todos from API
 */
async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch('/api/todos');
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }
  return response.json();
}

/**
 * Query key for todos - exported for use in mutations
 */
export const todosQueryKey = ['todos'] as const;

/**
 * Hook for fetching todos using React Query
 *
 * @returns Query result with todos data, loading state, error state, and refetch function
 */
export function useTodos() {
  const query = useQuery({
    queryKey: todosQueryKey,
    queryFn: fetchTodos,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

