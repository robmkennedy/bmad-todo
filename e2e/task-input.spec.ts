import { test, expect } from '@playwright/test';

test.describe('TaskInput', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('input is auto-focused on page load', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });

    await expect(input).toBeFocused();
  });

  test('adds a new task via Enter key', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });

    await input.fill('Buy groceries');
    await input.press('Enter');

    await expect(page.getByText('Buy groceries')).toBeVisible();
  });

  test('adds a new task via Add button', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });
    const addButton = page.getByRole('button', { name: /add/i });

    await input.fill('Call mom');
    await addButton.click();

    await expect(page.getByText('Call mom')).toBeVisible();
  });

  test('input clears after adding task', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });

    await input.fill('Buy groceries');
    await input.press('Enter');

    await expect(input).toHaveValue('');
  });

  test('input retains focus after adding task', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });

    await input.fill('Buy groceries');
    await input.press('Enter');

    await expect(input).toBeFocused();
  });

  test('rejects empty submission', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });

    await input.press('Enter');

    // Should show no tasks
    await expect(page.getByRole('listitem')).toHaveCount(0);
  });

  test('rejects whitespace-only submission', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });

    await input.fill('   ');
    await input.press('Enter');

    // Should show no tasks
    await expect(page.getByRole('listitem')).toHaveCount(0);
  });

  test('trims whitespace from task text', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });

    await input.fill('  Buy groceries  ');
    await input.press('Enter');

    // Task text should be trimmed
    await expect(page.getByText('Buy groceries')).toBeVisible();
  });

  test('supports Unicode characters and emojis', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });

    await input.fill('Célébrer 🎉 la fête');
    await input.press('Enter');

    await expect(page.getByText('Célébrer 🎉 la fête')).toBeVisible();
  });

  test('handles maximum length text (500 chars)', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });
    const maxText = 'a'.repeat(500);

    await input.fill(maxText);
    await input.press('Enter');

    await expect(page.getByText(maxText)).toBeVisible();
  });

  test('rejects text over 500 characters', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });
    const longText = 'a'.repeat(501);

    await input.fill(longText);
    await input.press('Enter');

    // Task should not be added
    await expect(page.getByRole('listitem')).toHaveCount(0);
  });
});

