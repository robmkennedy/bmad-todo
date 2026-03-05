import { test, expect } from '@playwright/test';

test.describe('Critical Path: Add a Task', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('user can add a task and see it in the list', async ({ page }) => {
    // Given: User visits the app
    const input = page.getByRole('textbox', { name: /add.*task/i });

    // When: User types a task and presses Enter
    await input.fill('Complete Sprint 1 test plan');
    await input.press('Enter');

    // Then: Task appears in the list
    await expect(page.getByText('Complete Sprint 1 test plan')).toBeVisible();

    // And: Input is cleared and focused
    await expect(input).toHaveValue('');
    await expect(input).toBeFocused();
  });

  test('user can add multiple tasks', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });

    await input.fill('First task');
    await input.press('Enter');

    await input.fill('Second task');
    await input.press('Enter');

    await input.fill('Third task');
    await input.press('Enter');

    // Verify all tasks are visible
    await expect(page.getByText('First task')).toBeVisible();
    await expect(page.getByText('Second task')).toBeVisible();
    await expect(page.getByText('Third task')).toBeVisible();
  });

  test('tasks persist after page refresh', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });
    await input.fill('Persistent task');
    await input.press('Enter');

    await expect(page.getByText('Persistent task')).toBeVisible();

    // Refresh the page
    await page.reload();

    // Task should still be visible
    await expect(page.getByText('Persistent task')).toBeVisible();
  });

  test('newest tasks appear at the top', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });

    await input.fill('First task');
    await input.press('Enter');

    await input.fill('Second task');
    await input.press('Enter');

    // Get all task items
    const tasks = page.getByRole('listitem');

    // Second task should be first (newest first)
    await expect(tasks.first()).toContainText('Second task');
  });
});

