import { Router } from 'express';
import { db, schema } from '../db/index.js';
import { z, ZodError } from 'zod';
import { desc } from 'drizzle-orm';

/**
 * Validation schema for creating a todo
 *
 * NOTE: This mirrors shared/schemas/todo.ts. We inline it here because:
 * 1. The shared package needs to be built before it can be imported
 * 2. For Sprint 1, we prioritize working code over perfect DRY
 *
 * TODO: In a future sprint, set up proper workspace imports or
 * build the shared package as part of the dev workflow.
 */
const createTodoSchema = z.object({
  text: z
    .string({
      required_error: 'Text is required',
      invalid_type_error: 'Text must be a string',
    })
    .trim()
    .min(1, 'Text cannot be empty')
    .max(500, 'Text cannot exceed 500 characters'),
});

const router = Router();

/**
 * GET /api/todos
 *
 * Returns all todos sorted by createdAt descending (newest first)
 */
router.get('/', async (_req, res) => {
  try {
    const todos = await db
      .select()
      .from(schema.todos)
      .orderBy(desc(schema.todos.createdAt));

    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch todos',
      },
    });
  }
});

/**
 * POST /api/todos
 *
 * Creates a new todo
 * Body: { text: string }
 * Returns: 201 with created todo
 */
router.post('/', async (req, res) => {
  try {
    // Validate input
    const validated = createTodoSchema.parse(req.body);

    // Generate UUID and timestamp
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    // Insert into database
    const newTodo = {
      id,
      text: validated.text,
      completed: false,
      createdAt,
    };

    await db.insert(schema.todos).values(newTodo);

    res.status(201).json(newTodo);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: error.flatten().fieldErrors,
        },
      });
      return;
    }

    console.error('Error creating todo:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create todo',
      },
    });
  }
});

export { router as todosRouter };

