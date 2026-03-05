import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { App } from '../App';

/**
 * Provider tests
 *
 * These tests verify that React Query and other providers are correctly configured.
 */

// Store original fetch
const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([]),
  });
});

afterEach(() => {
  global.fetch = originalFetch;
});

describe('Providers', () => {
  it('QueryClientProvider wraps the app', async () => {
    await act(async () => {
      render(<App />);
    });

    // App should render without crashing - this proves QueryClientProvider works
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('QueryClient allows queries to execute without errors', async () => {
    await act(async () => {
      render(<App />);
    });

    // If QueryClient wasn't configured properly, the app would crash
    // The presence of these elements proves providers are working
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('app structure is correct with providers', async () => {
    await act(async () => {
      render(<App />);
    });

    // Verify basic app structure
    expect(screen.getByRole('banner')).toBeInTheDocument(); // header
    expect(screen.getByRole('main')).toBeInTheDocument(); // main
  });
});

