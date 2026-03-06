import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useDeleteTodo } from '../useDeleteTodo';
import { useTodos } from '../useTodos';
import { createTestQueryClient, createQueryWrapperWithClient } from '../../test/test-utils';
import type { Todo } from '@shared/types';

/**
 * useDeleteTodo hook tests
 */

// Store original fetch
const originalFetch = global.fetch;

// Mock todos
const mockTodos: Todo[] = [
  {
    id: '123',
    text: 'Test task',
    completed: false,
    createdAt: '2026-03-06T10:00:00.000Z',
  },
  {
    id: '456',
    text: 'Another task',
    completed: true,
    createdAt: '2026-03-06T11:00:00.000Z',
  },
];

beforeEach(() => {
  vi.resetAllMocks();
});

afterEach(() => {
  global.fetch = originalFetch;
});

describe('useDeleteTodo', () => {
  it('removes todo optimistically before API response', async () => {
    global.fetch = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
      if (options?.method === 'DELETE') {
        // Slow DELETE
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ ok: true });
          }, 100);
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTodos),
      });
    });

    const queryClient = createTestQueryClient();
    const wrapper = createQueryWrapperWithClient(queryClient);

    // Load initial todos
    const { result: todosResult } = renderHook(() => useTodos(), { wrapper });
    await waitFor(() => expect(todosResult.current.isLoading).toBe(false));

    // Verify we have 2 todos
    expect(queryClient.getQueryData(['todos'])).toHaveLength(2);

    // Delete todo
    const { result: deleteResult } = renderHook(() => useDeleteTodo(), { wrapper });

    act(() => {
      deleteResult.current.mutate('123');
    });

    // Check optimistic update happened immediately
    await waitFor(() => {
      const cachedData = queryClient.getQueryData(['todos']) as Todo[];
      expect(cachedData).toHaveLength(1);
      expect(cachedData[0].id).toBe('456');
    });
  });

  it('calls DELETE /api/todos/:id', async () => {
    global.fetch = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
      if (options?.method === 'DELETE') {
        return Promise.resolve({ ok: true });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTodos),
      });
    });

    const queryClient = createTestQueryClient();
    const wrapper = createQueryWrapperWithClient(queryClient);

    const { result: todosResult } = renderHook(() => useTodos(), { wrapper });
    await waitFor(() => expect(todosResult.current.isLoading).toBe(false));

    const { result: deleteResult } = renderHook(() => useDeleteTodo(), { wrapper });

    await act(async () => {
      await deleteResult.current.mutateAsync('123');
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/todos/123',
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('rolls back on API error', async () => {
    global.fetch = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
      if (options?.method === 'DELETE') {
        return Promise.resolve({
          ok: false,
          status: 500,
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTodos),
      });
    });

    const queryClient = createTestQueryClient();
    const wrapper = createQueryWrapperWithClient(queryClient);
    const onError = vi.fn();

    const { result: todosResult } = renderHook(() => useTodos(), { wrapper });
    await waitFor(() => expect(todosResult.current.isLoading).toBe(false));

    const { result: deleteResult } = renderHook(() => useDeleteTodo({ onError }), { wrapper });

    await act(async () => {
      try {
        await deleteResult.current.mutateAsync('123');
      } catch {
        // Expected
      }
    });

    // Should call onError
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('calls onError callback when mutation fails', async () => {
    global.fetch = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
      if (options?.method === 'DELETE') {
        return Promise.resolve({
          ok: false,
          status: 404,
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTodos),
      });
    });

    const queryClient = createTestQueryClient();
    const wrapper = createQueryWrapperWithClient(queryClient);
    const onError = vi.fn();

    const { result: todosResult } = renderHook(() => useTodos(), { wrapper });
    await waitFor(() => expect(todosResult.current.isLoading).toBe(false));

    const { result: deleteResult } = renderHook(() => useDeleteTodo({ onError }), { wrapper });

    await act(async () => {
      try {
        await deleteResult.current.mutateAsync('nonexistent');
      } catch {
        // Expected
      }
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('invalidates queries on success', async () => {
    let fetchCount = 0;
    global.fetch = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
      if (options?.method === 'DELETE') {
        return Promise.resolve({ ok: true });
      }
      fetchCount++;
      // Return one less todo after delete
      const todos = fetchCount > 1 ? [mockTodos[1]] : mockTodos;
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(todos),
      });
    });

    const queryClient = createTestQueryClient();
    const wrapper = createQueryWrapperWithClient(queryClient);

    const { result: todosResult } = renderHook(() => useTodos(), { wrapper });
    await waitFor(() => expect(todosResult.current.isLoading).toBe(false));

    const { result: deleteResult } = renderHook(() => useDeleteTodo(), { wrapper });

    await act(async () => {
      await deleteResult.current.mutateAsync('123');
    });

    // Should have refetched after mutation
    await waitFor(() => {
      expect(fetchCount).toBeGreaterThan(1);
    });
  });
});

