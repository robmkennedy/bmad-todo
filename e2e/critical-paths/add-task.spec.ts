import { test, expect } from '../fixtures/base';

test.describe('Critical Path: Add a Task', () => {
  test.beforeEach(async ({ page, network }) => {
    // Network-first: set up response wait before navigation
    const todosLoadPromise = network.waitForTodosLoad(page);
    await page.goto('/');
    await todosLoadPromise;
  });

  test('user can add a task and see it in the list @p0 @critical', async ({ page, network }) => {
    // Given: User visits the app
    const input = page.getByRole('textbox', { name: /add.*task/i });

    // When: User types a task and presses Enter
    const createPromise = network.waitForTodoCreate(page);
    await input.fill('Complete Sprint 1 test plan');
    await input.press('Enter');
    await createPromise; // Deterministic wait for API response

    // Then: Task appears in the list
    await expect(page.getByText('Complete Sprint 1 test plan')).toBeVisible();

    // And: Input is cleared and focused
    await expect(input).toHaveValue('');
    await expect(input).toBeFocused();
  });

  test('user can add multiple tasks @p0', async ({ page, network }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });

    // Add tasks with network waits
    let createPromise = network.waitForTodoCreate(page);
    await input.fill('First task');
    await input.press('Enter');
    await createPromise;

    createPromise = network.waitForTodoCreate(page);
    await input.fill('Second task');
    await input.press('Enter');
    await createPromise;

    createPromise = network.waitForTodoCreate(page);
    await input.fill('Third task');
    await input.press('Enter');
    await createPromise;

    // Verify all tasks are visible
    await expect(page.getByText('First task')).toBeVisible();
    await expect(page.getByText('Second task')).toBeVisible();
    await expect(page.getByText('Third task')).toBeVisible();
  });

  test('tasks persist after page refresh @p0', async ({ page, network }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });

    // Create task with network wait
    const createPromise = network.waitForTodoCreate(page);
    await input.fill('Persistent task');
    await input.press('Enter');
    await createPromise;

    await expect(page.getByText('Persistent task')).toBeVisible();

    // Refresh the page with network wait
    const reloadPromise = network.waitForTodosLoad(page);
    await page.reload();
    await reloadPromise;

    // Task should still be visible
    await expect(page.getByText('Persistent task')).toBeVisible();
  });

  test('newest tasks appear at the top @p1', async ({ page, network }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });

    // Add first task
    let createPromise = network.waitForTodoCreate(page);
    await input.fill('First task');
    await input.press('Enter');
    await createPromise;

    // Add second task
    createPromise = network.waitForTodoCreate(page);
    await input.fill('Second task');
    await input.press('Enter');
    await createPromise;

    // Get all task items
    const tasks = page.getByRole('listitem');

    // Second task should be first (newest first)
    await expect(tasks.first()).toContainText('Second task');
  });
});

