import { z } from 'zod';

/**
 * Zod validation schemas for Todo operations
 *
 * These schemas are shared between frontend and backend
 * to ensure consistent validation.
 */

/**
 * Schema for creating a new todo
 *
 * - text: Required string, 1-500 characters, whitespace trimmed
 */
export const createTodoSchema = z.object({
  text: z
    .string({
      required_error: 'Text is required',
      invalid_type_error: 'Text must be a string',
    })
    .trim()
    .min(1, 'Text cannot be empty')
    .max(500, 'Text cannot exceed 500 characters'),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;

/**
 * Schema for updating an existing todo
 *
 * All fields are optional - only provided fields will be updated
 */
export const updateTodoSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'Text cannot be empty')
    .max(500, 'Text cannot exceed 500 characters')
    .optional(),
  completed: z.boolean().optional(),
});

export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;

/**
 * Schema for todo ID parameter
 */
export const todoIdSchema = z.object({
  id: z.string().uuid('Invalid todo ID'),
});

export type TodoIdInput = z.infer<typeof todoIdSchema>;

/**
 * Full Todo schema (for responses)
 */
export const todoSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  completed: z.boolean(),
  createdAt: z.string().datetime(),
});

export type TodoOutput = z.infer<typeof todoSchema>;

