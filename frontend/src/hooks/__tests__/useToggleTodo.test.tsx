import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useToggleTodo } from '../useToggleTodo';
import { useTodos } from '../useTodos';
import { createTestQueryClient, createQueryWrapperWithClient } from '../../test/test-utils';
import type { Todo } from '@shared/types';

/**
 * useToggleTodo hook tests
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

describe('useToggleTodo', () => {
  it('toggles completion optimistically before API response', async () => {
    global.fetch = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
      if (options?.method === 'PATCH') {
        // Slow PATCH
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: () => Promise.resolve({ ...mockTodos[0], completed: true }),
            });
          }, 100);
        });
      }
      // GET returns todos
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

    // Toggle todo
    const { result: toggleResult } = renderHook(() => useToggleTodo(), { wrapper });

    act(() => {
      toggleResult.current.mutate({ id: '123', completed: true });
    });

    // Check optimistic update happened immediately
    await waitFor(() => {
      const cachedData = queryClient.getQueryData(['todos']) as Todo[];
      const todo = cachedData.find((t) => t.id === '123');
      expect(todo?.completed).toBe(true);
    });
  });

  it('marks todo as pending during mutation', async () => {
    global.fetch = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
      if (options?.method === 'PATCH') {
        return new Promise(() => {}); // Never resolves
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

    const { result: toggleResult } = renderHook(() => useToggleTodo(), { wrapper });

    act(() => {
      toggleResult.current.mutate({ id: '123', completed: true });
    });

    await waitFor(() => {
      const cachedData = queryClient.getQueryData(['todos']) as Array<Todo & { isPending?: boolean }>;
      const todo = cachedData.find((t) => t.id === '123');
      expect(todo?.isPending).toBe(true);
    });
  });

  it('calls PATCH /api/todos/:id with correct body', async () => {
    global.fetch = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
      if (options?.method === 'PATCH') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ ...mockTodos[0], completed: true }),
        });
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

    const { result: toggleResult } = renderHook(() => useToggleTodo(), { wrapper });

    await act(async () => {
      await toggleResult.current.mutateAsync({ id: '123', completed: true });
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/todos/123',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ completed: true }),
      })
    );
  });

  it('rolls back on API error', async () => {
    global.fetch = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
      if (options?.method === 'PATCH') {
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

    const { result: toggleResult } = renderHook(() => useToggleTodo({ onError }), { wrapper });

    await act(async () => {
      try {
        await toggleResult.current.mutateAsync({ id: '123', completed: true });
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
      if (options?.method === 'PATCH') {
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

    const { result: toggleResult } = renderHook(() => useToggleTodo({ onError }), { wrapper });

    await act(async () => {
      try {
        await toggleResult.current.mutateAsync({ id: '123', completed: true });
      } catch {
        // Expected
      }
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('can toggle from completed to incomplete', async () => {
    global.fetch = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
      if (options?.method === 'PATCH') {
        // Slow PATCH to check optimistic state
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: () => Promise.resolve({ ...mockTodos[1], completed: false }),
            });
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

    const { result: todosResult } = renderHook(() => useTodos(), { wrapper });
    await waitFor(() => expect(todosResult.current.isLoading).toBe(false));

    const { result: toggleResult } = renderHook(() => useToggleTodo(), { wrapper });

    act(() => {
      toggleResult.current.mutate({ id: '456', completed: false });
    });

    // Check optimistic update immediately (before API response)
    await waitFor(() => {
      const cachedData = queryClient.getQueryData(['todos']) as Todo[];
      const todo = cachedData.find((t) => t.id === '456');
      expect(todo?.completed).toBe(false);
    });
  });
});

