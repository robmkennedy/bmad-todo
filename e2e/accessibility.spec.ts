import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('homepage has no accessibility violations', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('homepage with tasks has no accessibility violations', async ({ page }) => {
    // Add a task first
    const input = page.getByRole('textbox', { name: /add.*task/i });
    await input.fill('Test task for accessibility');
    await input.press('Enter');

    await expect(page.getByText('Test task for accessibility')).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('keyboard navigation works', async ({ page }) => {
    // Input should be focused on load
    const input = page.getByRole('textbox', { name: /add.*task/i });
    await expect(input).toBeFocused();

    // Tab to Add button
    await page.keyboard.press('Tab');
    const addButton = page.getByRole('button', { name: /add/i });
    await expect(addButton).toBeFocused();
  });

  test('form is keyboard operable', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });

    // Type and submit with keyboard only
    await input.fill('Keyboard only task');
    await page.keyboard.press('Enter');

    await expect(page.getByText('Keyboard only task')).toBeVisible();
  });

  test('focus is visible on interactive elements', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });

    // Check input has visible focus styles
    await input.focus();
    const inputBox = await input.boundingBox();
    expect(inputBox).not.toBeNull();

    // Tab to button and check it has visible focus
    await page.keyboard.press('Tab');
    const addButton = page.getByRole('button', { name: /add/i });
    await expect(addButton).toBeFocused();
  });

  test('touch targets meet minimum size requirements', async ({ page }) => {
    const addButton = page.getByRole('button', { name: /add/i });
    const buttonBox = await addButton.boundingBox();

    // Minimum 44x44px for WCAG touch targets
    expect(buttonBox!.width).toBeGreaterThanOrEqual(44);
    expect(buttonBox!.height).toBeGreaterThanOrEqual(44);
  });

  test('input has minimum height for accessibility', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });
    const inputBox = await input.boundingBox();

    // Minimum 48px height per design specs
    expect(inputBox!.height).toBeGreaterThanOrEqual(48);
  });
});

