import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTodos, todosQueryKey } from '../useTodos';
import { createQueryWrapper } from '../../test/test-utils';
import type { Todo } from '@shared/types';

/**
 * useTodos hook tests
 */

// Store original fetch
const originalFetch = global.fetch;

// Test data
const mockTodos: Todo[] = [
  {
    id: '1',
    text: 'First task',
    completed: false,
    createdAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: '2',
    text: 'Second task',
    completed: true,
    createdAt: '2026-03-02T10:00:00.000Z',
  },
];

beforeEach(() => {
  vi.resetAllMocks();
});

afterEach(() => {
  global.fetch = originalFetch;
});

describe('useTodos', () => {
  it('exports todosQueryKey as ["todos"]', () => {
    expect(todosQueryKey).toEqual(['todos']);
  });

  it('returns isLoading true initially', () => {
    global.fetch = vi.fn().mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(() => useTodos(), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });

  it('fetches todos from /api/todos', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockTodos),
    });

    const { result } = renderHook(() => useTodos(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/todos');
    expect(result.current.data).toEqual(mockTodos);
    expect(result.current.isError).toBe(false);
  });

  it('returns data, isLoading, isError, error, and refetch', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockTodos),
    });

    const { result } = renderHook(() => useTodos(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current).toHaveProperty('data');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('isError');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('refetch');
    expect(typeof result.current.refetch).toBe('function');
  });

  it('sets isError true and provides error object when fetch fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useTodos(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('sets isError true when network error occurs', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useTodos(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('refetch function triggers new fetch', async () => {
    let fetchCount = 0;
    global.fetch = vi.fn().mockImplementation(() => {
      fetchCount++;
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTodos),
      });
    });

    const { result } = renderHook(() => useTodos(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetchCount).toBe(1);

    // Call refetch
    await result.current.refetch();

    expect(fetchCount).toBe(2);
  });
});

