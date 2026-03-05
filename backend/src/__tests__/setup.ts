import { beforeAll, afterAll, afterEach } from 'vitest';

/**
 * Backend test setup
 *
 * This file configures the test environment for backend tests.
 * It's automatically loaded by Vitest via setupFiles config.
 */

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = ':memory:';

// Global test timeout
// vi.setConfig({ testTimeout: 10000 });

beforeAll(async () => {
  // Setup code that runs once before all tests
  console.log('🧪 Starting backend test suite...');
});

afterAll(async () => {
  // Cleanup code that runs once after all tests
  console.log('✅ Backend test suite complete');
});

afterEach(async () => {
  // Reset any mocks after each test
  // vi.restoreAllMocks();
});

