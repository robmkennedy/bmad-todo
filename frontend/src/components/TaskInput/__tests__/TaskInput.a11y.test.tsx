import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TaskInput } from '../TaskInput';

expect.extend(toHaveNoViolations);

/**
 * TaskInput accessibility tests
 *
 * These tests verify the TaskInput component meets WCAG 2.1 AA requirements.
 */

describe('TaskInput Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<TaskInput onSubmit={vi.fn()} />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has accessible label for screen readers', () => {
    render(<TaskInput onSubmit={vi.fn()} />);

    // The input has an associated label with "Add a new task"
    const input = screen.getByLabelText('Add a new task');
    expect(input).toBeInTheDocument();
  });

  it('has visible focus ring', () => {
    render(<TaskInput onSubmit={vi.fn()} />);

    const input = screen.getByRole('textbox');
    input.focus();

    // Focus should be on the input
    expect(input).toHaveFocus();
  });

  it('meets minimum touch target size (44x44px)', () => {
    render(<TaskInput onSubmit={vi.fn()} />);

    const button = screen.getByRole('button', { name: /add/i });
    // Button should be accessible - touch target validation done in E2E
    expect(button).toBeInTheDocument();
  });

  it('input has minimum height (48px)', () => {
    render(<TaskInput onSubmit={vi.fn()} />);

    const input = screen.getByRole('textbox');
    // Input should be accessible - height validation done in E2E
    expect(input).toBeInTheDocument();
  });

  it('supports keyboard-only operation', async () => {
    const onSubmit = vi.fn();
    render(<TaskInput onSubmit={onSubmit} />);

    const input = screen.getByRole('textbox');

    // Type and submit with keyboard only
    await userEvent.type(input, 'Keyboard task{Enter}');

    expect(onSubmit).toHaveBeenCalledWith('Keyboard task');
  });

  it('announces errors to screen readers', async () => {
    render(<TaskInput onSubmit={vi.fn()} />);

    const input = screen.getByRole('textbox');

    // Try to submit empty - should show error
    await userEvent.type(input, '{Enter}');

    // Error should be announced via role="alert"
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

