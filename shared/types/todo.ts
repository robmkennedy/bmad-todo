/**
 * Todo type definitions
 *
 * These types are shared between frontend and backend to ensure
 * consistent data structures across the application.
 */

/**
 * Represents a Todo item in the system
 */
export interface Todo {
  /** Unique identifier (UUID) */
  id: string;
  /** The task description text (1-500 characters) */
  text: string;
  /** Whether the task has been completed */
  completed: boolean;
  /** ISO 8601 timestamp when the todo was created */
  createdAt: string;
}

/**
 * Request payload for creating a new todo
 */
export interface CreateTodoRequest {
  /** The task description text (1-500 characters, will be trimmed) */
  text: string;
}

/**
 * Request payload for updating an existing todo
 */
export interface UpdateTodoRequest {
  /** Optional updated task text */
  text?: string;
  /** Optional updated completion status */
  completed?: boolean;
}

/**
 * Standard API error response
 */
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

