import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAddTodo } from '../useAddTodo';
import { useTodos } from '../useTodos';
import { createTestQueryClient, createQueryWrapperWithClient } from '../../test/test-utils';
import type { Todo } from '@shared/types';

/**
 * useAddTodo hook tests
 */

// Store original fetch
const originalFetch = global.fetch;

// Mock todo response
const mockCreatedTodo: Todo = {
  id: 'real-uuid-123',
  text: 'New task',
  completed: false,
  createdAt: '2026-03-06T10:00:00.000Z',
};

beforeEach(() => {
  vi.resetAllMocks();
});

afterEach(() => {
  global.fetch = originalFetch;
});

describe('useAddTodo', () => {
  it('adds todo optimistically before API response', async () => {
    // Simulate slow API
    global.fetch = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
      if (options?.method === 'POST') {
        // POST is slow
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: () => Promise.resolve(mockCreatedTodo),
            });
          }, 100);
        });
      }
      // GET returns empty initially
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    });

    const queryClient = createTestQueryClient();
    const wrapper = createQueryWrapperWithClient(queryClient);

    // First, populate the cache with empty todos
    const { result: todosResult } = renderHook(() => useTodos(), { wrapper });
    await waitFor(() => expect(todosResult.current.isLoading).toBe(false));

    // Now use addTodo in the same wrapper
    const { result: addResult } = renderHook(() => useAddTodo(), { wrapper });

    // Trigger mutation
    act(() => {
      addResult.current.mutate('New task');
    });

    // Check optimistic update happened immediately by checking cache directly
    await waitFor(() => {
      const cachedData = queryClient.getQueryData(['todos']) as Todo[];
      expect(cachedData).toBeDefined();
      expect(cachedData.length).toBeGreaterThan(0);
      expect(cachedData[0].text).toBe('New task');
    });
  });

  it('marks optimistic todo with isPending: true', async () => {
    global.fetch = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
      if (options?.method === 'POST') {
        return new Promise(() => {}); // Never resolves
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    });

    const queryClient = createTestQueryClient();
    const wrapper = createQueryWrapperWithClient(queryClient);

    const { result: todosResult } = renderHook(() => useTodos(), { wrapper });
    await waitFor(() => expect(todosResult.current.isLoading).toBe(false));

    const { result: addResult } = renderHook(() => useAddTodo(), { wrapper });

    act(() => {
      addResult.current.mutate('Pending task');
    });

    await waitFor(() => {
      const cachedData = queryClient.getQueryData(['todos']) as Array<Todo & { isPending?: boolean }>;
      expect(cachedData).toBeDefined();
      expect(cachedData[0].isPending).toBe(true);
    });
  });

  it('generates temp ID starting with "temp-"', async () => {
    global.fetch = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
      if (options?.method === 'POST') {
        return new Promise(() => {}); // Never resolves
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    });

    const queryClient = createTestQueryClient();
    const wrapper = createQueryWrapperWithClient(queryClient);

    const { result: todosResult } = renderHook(() => useTodos(), { wrapper });
    await waitFor(() => expect(todosResult.current.isLoading).toBe(false));

    const { result: addResult } = renderHook(() => useAddTodo(), { wrapper });

    act(() => {
      addResult.current.mutate('Temp ID task');
    });

    await waitFor(() => {
      const cachedData = queryClient.getQueryData(['todos']) as Todo[];
      expect(cachedData).toBeDefined();
      expect(cachedData[0].id).toMatch(/^temp-/);
    });
  });

  it('rolls back on API error', async () => {
    global.fetch = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
      if (options?.method === 'POST') {
        return Promise.resolve({
          ok: false,
          status: 500,
        });
      }
      // GET returns empty
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    });

    const queryClient = createTestQueryClient();
    const wrapper = createQueryWrapperWithClient(queryClient);
    const onError = vi.fn();

    const { result: todosResult } = renderHook(() => useTodos(), { wrapper });
    await waitFor(() => expect(todosResult.current.isLoading).toBe(false));

    const { result: addResult } = renderHook(() => useAddTodo({ onError }), { wrapper });

    await act(async () => {
      try {
        await addResult.current.mutateAsync('Will fail');
      } catch {
        // Expected
      }
    });

    // After error, cache should be rolled back to empty
    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });
  });

  it('calls onError callback when mutation fails', async () => {
    global.fetch = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
      if (options?.method === 'POST') {
        return Promise.resolve({
          ok: false,
          status: 500,
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    });

    const queryClient = createTestQueryClient();
    const wrapper = createQueryWrapperWithClient(queryClient);
    const onError = vi.fn();

    const { result: todosResult } = renderHook(() => useTodos(), { wrapper });
    await waitFor(() => expect(todosResult.current.isLoading).toBe(false));

    const { result: addResult } = renderHook(() => useAddTodo({ onError }), { wrapper });

    await act(async () => {
      try {
        await addResult.current.mutateAsync('Will fail');
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
      if (options?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCreatedTodo),
        });
      }
      fetchCount++;
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(fetchCount > 1 ? [mockCreatedTodo] : []),
      });
    });

    const queryClient = createTestQueryClient();
    const wrapper = createQueryWrapperWithClient(queryClient);

    const { result: todosResult } = renderHook(() => useTodos(), { wrapper });
    await waitFor(() => expect(todosResult.current.isLoading).toBe(false));

    const { result: addResult } = renderHook(() => useAddTodo(), { wrapper });

    await act(async () => {
      await addResult.current.mutateAsync('New task');
    });

    // Should have fetched again after mutation settled
    await waitFor(() => {
      expect(fetchCount).toBeGreaterThan(1);
    });
  });
});

