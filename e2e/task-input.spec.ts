import { test, expect } from './fixtures/base';

test.describe('TaskInput', () => {
  test.beforeEach(async ({ page, network }) => {
    const loadPromise = network.waitForTodosLoad(page);
    await page.goto('/');
    await loadPromise;
  });

  test('input is auto-focused on page load @p0', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });

    await expect(input).toBeFocused();
  });

  test('adds a new task via Enter key @p0', async ({ page, network }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });

    const createPromise = network.waitForTodoCreate(page);
    await input.fill('Buy groceries');
    await input.press('Enter');
    await createPromise;

    await expect(page.getByText('Buy groceries')).toBeVisible();
  });

  test('adds a new task via Add button @p0', async ({ page, network }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });
    const addButton = page.getByRole('button', { name: /add/i });

    const createPromise = network.waitForTodoCreate(page);
    await input.fill('Call mom');
    await addButton.click();
    await createPromise;

    await expect(page.getByText('Call mom')).toBeVisible();
  });

  test('input clears after adding task @p1', async ({ page, network }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });

    const createPromise = network.waitForTodoCreate(page);
    await input.fill('Buy groceries');
    await input.press('Enter');
    await createPromise;

    await expect(input).toHaveValue('');
  });

  test('input retains focus after adding task @p1', async ({ page, network }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });

    const createPromise = network.waitForTodoCreate(page);
    await input.fill('Buy groceries');
    await input.press('Enter');
    await createPromise;

    await expect(input).toBeFocused();
  });

  test('rejects empty submission @p1', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });

    await input.press('Enter');

    // Should show no tasks
    await expect(page.getByRole('listitem')).toHaveCount(0);
  });

  test('rejects whitespace-only submission @p1', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });

    await input.fill('   ');
    await input.press('Enter');

    // Should show no tasks
    await expect(page.getByRole('listitem')).toHaveCount(0);
  });

  test('trims whitespace from task text @p2', async ({ page, network }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });

    const createPromise = network.waitForTodoCreate(page);
    await input.fill('  Buy groceries  ');
    await input.press('Enter');
    await createPromise;

    // Task text should be trimmed
    await expect(page.getByText('Buy groceries')).toBeVisible();
  });

  test('supports Unicode characters and emojis @p2', async ({ page, network }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });

    const createPromise = network.waitForTodoCreate(page);
    await input.fill('Célébrer 🎉 la fête');
    await input.press('Enter');
    await createPromise;

    await expect(page.getByText('Célébrer 🎉 la fête')).toBeVisible();
  });

  test('handles maximum length text (500 chars) @p2', async ({ page, network }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });
    const maxText = 'a'.repeat(500);

    const createPromise = network.waitForTodoCreate(page);
    await input.fill(maxText);
    await input.press('Enter');
    await createPromise;

    await expect(page.getByText(maxText)).toBeVisible();
  });

  test('rejects text over 500 characters @p2', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });
    const longText = 'a'.repeat(501);

    await input.fill(longText);
    await input.press('Enter');

    // Task should not be added
    await expect(page.getByRole('listitem')).toHaveCount(0);
  });
});

