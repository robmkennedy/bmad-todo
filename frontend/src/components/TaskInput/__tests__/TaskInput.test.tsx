import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskInput } from '../TaskInput';

/**
 * TaskInput component tests
 *
 * These tests verify the task input component functionality.
 */

describe('TaskInput Component', () => {
  // Setup userEvent with act() wrapper for proper React state handling
  const user = userEvent.setup();

  describe('rendering', () => {
    it('renders input field', () => {
      render(<TaskInput onSubmit={vi.fn()} />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders Add button', () => {
      render(<TaskInput onSubmit={vi.fn()} />);
      expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    });

    it('has placeholder text', () => {
      render(<TaskInput onSubmit={vi.fn()} />);
      expect(screen.getByPlaceholderText(/what needs to be done/i)).toBeInTheDocument();
    });

    it('auto-focuses input on mount', () => {
      render(<TaskInput onSubmit={vi.fn()} />);
      expect(screen.getByRole('textbox')).toHaveFocus();
    });
  });

  describe('submission', () => {
    it('calls onSubmit with text when Enter pressed', async () => {
      const onSubmit = vi.fn();
      render(<TaskInput onSubmit={onSubmit} />);

      const input = screen.getByRole('textbox');
      await act(async () => {
        await user.type(input, 'Buy milk{Enter}');
      });

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith('Buy milk');
      });
    });

    it('calls onSubmit when Add button clicked', async () => {
      const onSubmit = vi.fn();
      render(<TaskInput onSubmit={onSubmit} />);

      const input = screen.getByRole('textbox');
      await act(async () => {
        await user.type(input, 'Buy milk');
      });

      const button = screen.getByRole('button', { name: /add/i });
      await act(async () => {
        await user.click(button);
      });

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith('Buy milk');
      });
    });

    it('clears input after successful submission', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      render(<TaskInput onSubmit={onSubmit} />);

      const input = screen.getByRole('textbox');
      await act(async () => {
        await user.type(input, 'Buy milk{Enter}');
      });

      await waitFor(() => {
        expect(input).toHaveValue('');
      });
    });

    it('trims whitespace before submission', async () => {
      const onSubmit = vi.fn();
      render(<TaskInput onSubmit={onSubmit} />);

      const input = screen.getByRole('textbox');
      await act(async () => {
        await user.type(input, '  Buy milk  {Enter}');
      });

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith('Buy milk');
      });
    });

    it('retains focus after submission', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      render(<TaskInput onSubmit={onSubmit} />);

      const input = screen.getByRole('textbox');
      await act(async () => {
        await user.type(input, 'Buy milk{Enter}');
      });

      await waitFor(() => {
        expect(input).toHaveFocus();
      });
    });
  });

  describe('validation', () => {
    it('does not submit empty text', async () => {
      const onSubmit = vi.fn();
      render(<TaskInput onSubmit={onSubmit} />);

      const input = screen.getByRole('textbox');
      await act(async () => {
        await user.type(input, '{Enter}');
      });

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('does not submit whitespace-only text', async () => {
      const onSubmit = vi.fn();
      render(<TaskInput onSubmit={onSubmit} />);

      const input = screen.getByRole('textbox');
      await act(async () => {
        await user.type(input, '   {Enter}');
      });

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('shows visual feedback for invalid input', async () => {
      render(<TaskInput onSubmit={vi.fn()} />);

      const input = screen.getByRole('textbox');
      await act(async () => {
        await user.type(input, '{Enter}');
      });

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });

    it('sets aria-invalid when validation fails', async () => {
      render(<TaskInput onSubmit={vi.fn()} />);

      const input = screen.getByRole('textbox');
      await act(async () => {
        await user.type(input, '{Enter}');
      });

      await waitFor(() => {
        expect(input).toHaveAttribute('aria-invalid', 'true');
      });
    });
  });

  describe('loading state', () => {
    it('disables input during submission', () => {
      render(<TaskInput onSubmit={vi.fn()} isLoading={true} />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('disables button during submission', () => {
      render(<TaskInput onSubmit={vi.fn()} isLoading={true} />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('shows loading indicator during submission', () => {
      render(<TaskInput onSubmit={vi.fn()} isLoading={true} />);
      expect(screen.getByRole('button')).toHaveTextContent(/adding/i);
    });
  });
});

