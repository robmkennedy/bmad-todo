import { useState, useRef, useEffect, FormEvent, ChangeEvent } from 'react';
import styles from './TaskInput.module.css';

export interface TaskInputProps {
  onSubmit: (text: string) => void | Promise<void>;
  isLoading?: boolean;
  placeholder?: string;
}

/**
 * TaskInput component
 *
 * A form for adding new tasks with validation and accessibility support.
 */
export function TaskInput({
  onSubmit,
  isLoading = false,
  placeholder = 'What needs to be done?',
}: TaskInputProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedText = text.trim();

    // Validate
    if (!trimmedText) {
      setError('Please enter a task');
      inputRef.current?.focus();
      return;
    }

    if (trimmedText.length > 500) {
      setError('Task must be 500 characters or less');
      inputRef.current?.focus();
      return;
    }

    try {
      await onSubmit(trimmedText);
      setText('');
      setError(null);
      inputRef.current?.focus();
    } catch {
      setError('Failed to add task. Please try again.');
    }
  };

  const inputClassName = [
    styles.input,
    error ? styles.inputError : '',
  ].filter(Boolean).join(' ');

  return (
    <form onSubmit={handleSubmit} className={styles.taskInputForm}>
      <div className={styles.inputWrapper}>
        <label htmlFor="task-input" className={styles.srOnly}>
          Add a new task
        </label>
        <input
          ref={inputRef}
          id="task-input"
          type="text"
          value={text}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={isLoading}
          className={inputClassName}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'task-input-error' : undefined}
        />
        {error && (
          <span
            id="task-input-error"
            className={styles.errorMessage}
            role="alert"
          >
            {error}
          </span>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className={styles.submitButton}
        aria-label="Add task"
      >
        {isLoading ? 'Adding...' : 'Add'}
      </button>
    </form>
  );
}

