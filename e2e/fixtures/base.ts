import { test as base, expect, APIRequestContext, Page } from '@playwright/test';

/**
 * Extended Playwright fixtures for BMAD Todo E2E tests
 *
 * Provides:
 * - Database cleanup between tests
 * - Network interception helpers
 * - API request helpers for test setup
 */

// Types for our fixtures
type TestFixtures = {
  /** API context for direct backend calls */
  api: APIRequestContext;
  /** Clean database state before test */
  cleanDb: void;
  /** Network helpers for deterministic waits */
  network: NetworkHelpers;
};

interface NetworkHelpers {
  /** Wait for GET /api/todos response */
  waitForTodosLoad: (page: Page) => Promise<Response>;
  /** Wait for POST /api/todos response */
  waitForTodoCreate: (page: Page) => Promise<Response>;
  /** Wait for PATCH /api/todos/:id response */
  waitForTodoUpdate: (page: Page) => Promise<Response>;
  /** Wait for DELETE /api/todos/:id response */
  waitForTodoDelete: (page: Page) => Promise<Response>;
}

export const test = base.extend<TestFixtures>({
  // API context for direct backend communication
  api: async ({ playwright }, use) => {
    const api = await playwright.request.newContext({
      baseURL: 'http://localhost:3000',
    });
    await use(api);
    await api.dispose();
  },

  // Clean database before each test
  cleanDb: [
    async ({ api }, use) => {
      // Clear all todos via API before test
      const response = await api.get('/api/todos');
      if (response.ok()) {
        const todos = await response.json();
        for (const todo of todos) {
          await api.delete(`/api/todos/${todo.id}`);
        }
      }
      await use();
    },
    { auto: true }, // Automatically run for all tests
  ],

  // Network helpers for deterministic waits
  network: async ({}, use) => {
    const helpers: NetworkHelpers = {
      waitForTodosLoad: (page: Page) =>
        page.waitForResponse(
          (resp) =>
            resp.url().includes('/api/todos') &&
            resp.request().method() === 'GET' &&
            resp.status() === 200
        ),

      waitForTodoCreate: (page: Page) =>
        page.waitForResponse(
          (resp) =>
            resp.url().includes('/api/todos') &&
            resp.request().method() === 'POST' &&
            (resp.status() === 201 || resp.status() === 400)
        ),

      waitForTodoUpdate: (page: Page) =>
        page.waitForResponse(
          (resp) =>
            resp.url().match(/\/api\/todos\/[^/]+$/) !== null &&
            resp.request().method() === 'PATCH'
        ),

      waitForTodoDelete: (page: Page) =>
        page.waitForResponse(
          (resp) =>
            resp.url().match(/\/api\/todos\/[^/]+$/) !== null &&
            resp.request().method() === 'DELETE'
        ),
    };
    await use(helpers);
  },
});

export { expect };

/**
 * Helper to create a todo via API (faster than UI)
 */
export async function createTodoViaApi(
  api: APIRequestContext,
  text: string
): Promise<{ id: string; text: string; completed: boolean; createdAt: string }> {
  const response = await api.post('/api/todos', {
    data: { text },
  });
  return response.json();
}

/**
 * Helper to seed multiple todos via API
 */
export async function seedTodosViaApi(
  api: APIRequestContext,
  texts: string[]
): Promise<void> {
  for (const text of texts) {
    await api.post('/api/todos', { data: { text } });
  }
}

