import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskItem } from '../TaskItem';
import type { OptimisticTodo } from '../../../hooks';

/**
 * TaskItem component tests
 */

const baseTodo: OptimisticTodo = {
  id: '123',
  text: 'Test task',
  completed: false,
  createdAt: '2026-03-06T10:00:00.000Z',
};

describe('TaskItem', () => {
  describe('rendering', () => {
    it('displays todo text', () => {
      render(<TaskItem todo={baseTodo} />);

      expect(screen.getByText('Test task')).toBeInTheDocument();
    });

    it('renders checkbox', () => {
      render(<TaskItem todo={baseTodo} />);

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('checkbox is unchecked for incomplete todo', () => {
      render(<TaskItem todo={baseTodo} />);

      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('checkbox is checked for completed todo', () => {
      const completedTodo = { ...baseTodo, completed: true };
      render(<TaskItem todo={completedTodo} />);

      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('applies strikethrough style for completed todo', () => {
      const completedTodo = { ...baseTodo, completed: true };
      const { container } = render(<TaskItem todo={completedTodo} />);

      const listItem = container.querySelector('li');
      expect(listItem?.className).toContain('completed');
    });

    it('shows pending indicator for optimistic todo', () => {
      const pendingTodo = { ...baseTodo, isPending: true };
      render(<TaskItem todo={pendingTodo} />);

      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });

    it('applies pending style for optimistic todo', () => {
      const pendingTodo = { ...baseTodo, isPending: true };
      const { container } = render(<TaskItem todo={pendingTodo} />);

      const listItem = container.querySelector('li');
      expect(listItem?.className).toContain('pending');
    });
  });

  describe('interaction', () => {
    it('calls onToggle when checkbox is clicked', async () => {
      const user = userEvent.setup();
      const onToggle = vi.fn();

      render(<TaskItem todo={baseTodo} onToggle={onToggle} />);

      await user.click(screen.getByRole('checkbox'));

      expect(onToggle).toHaveBeenCalledWith('123');
    });

    it('does not call onToggle when disabled', async () => {
      const user = userEvent.setup();
      const onToggle = vi.fn();

      render(<TaskItem todo={baseTodo} onToggle={onToggle} disabled />);

      await user.click(screen.getByRole('checkbox'));

      expect(onToggle).not.toHaveBeenCalled();
    });

    it('does not call onToggle when pending', async () => {
      const user = userEvent.setup();
      const onToggle = vi.fn();
      const pendingTodo = { ...baseTodo, isPending: true };

      render(<TaskItem todo={pendingTodo} onToggle={onToggle} />);

      await user.click(screen.getByRole('checkbox'));

      expect(onToggle).not.toHaveBeenCalled();
    });

    it('checkbox is disabled when disabled prop is true', () => {
      render(<TaskItem todo={baseTodo} disabled />);

      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('checkbox is disabled when todo is pending', () => {
      const pendingTodo = { ...baseTodo, isPending: true };
      render(<TaskItem todo={pendingTodo} />);

      expect(screen.getByRole('checkbox')).toBeDisabled();
    });
  });

  describe('accessibility', () => {
    it('checkbox has accessible label', () => {
      render(<TaskItem todo={baseTodo} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-label', 'Mark "Test task" as complete');
    });

    it('checkbox label indicates incomplete action for completed todo', () => {
      const completedTodo = { ...baseTodo, completed: true };
      render(<TaskItem todo={completedTodo} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-label', 'Mark "Test task" as incomplete');
    });

    it('supports keyboard navigation with Enter key', async () => {
      const user = userEvent.setup();
      const onToggle = vi.fn();

      render(<TaskItem todo={baseTodo} onToggle={onToggle} />);

      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();
      await user.keyboard('{Enter}');

      expect(onToggle).toHaveBeenCalledWith('123');
    });

    it('supports keyboard navigation with Space key', async () => {
      const user = userEvent.setup();
      const onToggle = vi.fn();

      render(<TaskItem todo={baseTodo} onToggle={onToggle} />);

      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();
      await user.keyboard(' ');

      expect(onToggle).toHaveBeenCalledWith('123');
    });
  });

  describe('delete button', () => {
    it('renders delete button when onDelete is provided', () => {
      const onDelete = vi.fn();
      render(<TaskItem todo={baseTodo} onDelete={onDelete} />);

      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('does not render delete button when onDelete is not provided', () => {
      render(<TaskItem todo={baseTodo} />);

      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });

    it('calls onDelete when delete button is clicked', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();

      render(<TaskItem todo={baseTodo} onDelete={onDelete} />);

      await user.click(screen.getByRole('button', { name: /delete/i }));

      expect(onDelete).toHaveBeenCalledWith('123');
    });

    it('does not call onDelete when disabled', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();

      render(<TaskItem todo={baseTodo} onDelete={onDelete} disabled />);

      await user.click(screen.getByRole('button', { name: /delete/i }));

      expect(onDelete).not.toHaveBeenCalled();
    });

    it('does not call onDelete when pending', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();
      const pendingTodo = { ...baseTodo, isPending: true };

      render(<TaskItem todo={pendingTodo} onDelete={onDelete} />);

      await user.click(screen.getByRole('button', { name: /delete/i }));

      expect(onDelete).not.toHaveBeenCalled();
    });

    it('delete button has accessible label with todo text', () => {
      const onDelete = vi.fn();
      render(<TaskItem todo={baseTodo} onDelete={onDelete} />);

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      expect(deleteButton).toHaveAttribute('aria-label', 'Delete "Test task"');
    });

    it('delete button is disabled when todo is pending', () => {
      const onDelete = vi.fn();
      const pendingTodo = { ...baseTodo, isPending: true };

      render(<TaskItem todo={pendingTodo} onDelete={onDelete} />);

      expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled();
    });
  });
});

