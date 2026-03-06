import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../app.js';
import {
  createTodoInput,
  createUpdateInput,
  edgeCases,
  invalidCases,
  resetFactoryCounter,
} from '../factories/todo-factory.js';

/**
 * Todo API endpoint tests
 *
 * These integration tests verify the REST API endpoints for todo management.
 * They test the full request/response cycle including validation.
 *
 * Priority tags:
 * - @p0: Critical path - must pass for release
 * - @p1: High priority - core functionality
 * - @p2: Medium priority - edge cases and validation
 * - @p3: Low priority - nice to have coverage
 *
 * Note: Database is cleared between tests by the global setup.
 */

describe('Todo API', () => {
  // Reset factory counter before each test for deterministic data
  beforeEach(() => {
    resetFactoryCounter();
  });

  describe('GET /api/todos', () => {
    it('returns 200 with empty array when no todos @p0', async () => {
      const response = await request(app).get('/api/todos');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('returns all todos @p0', async () => {
      // Create some todos first using factory
      const todo1 = createTodoInput();
      const todo2 = createTodoInput();
      await request(app).post('/api/todos').send(todo1);
      await request(app).post('/api/todos').send(todo2);

      const response = await request(app).get('/api/todos');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    it('returns todos sorted by createdAt descending (newest first) @p1', async () => {
      // Create todos - ordering is determined by createdAt timestamps
      const todo1 = createTodoInput({ text: 'First todo' });
      const todo2 = createTodoInput({ text: 'Second todo' });
      await request(app).post('/api/todos').send(todo1);
      await request(app).post('/api/todos').send(todo2);

      const response = await request(app).get('/api/todos');

      expect(response.status).toBe(200);
      expect(response.body[0].text).toBe('Second todo');
      expect(response.body[1].text).toBe('First todo');
    });

    it('returns correct todo structure (id, text, completed, createdAt) @p1', async () => {
      const todoInput = createTodoInput();
      await request(app).post('/api/todos').send(todoInput);

      const response = await request(app).get('/api/todos');

      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('text');
      expect(response.body[0]).toHaveProperty('completed');
      expect(response.body[0]).toHaveProperty('createdAt');
    });
  });

  describe('POST /api/todos', () => {
    it('returns 201 with created todo @p0', async () => {
      const todoInput = createTodoInput({ text: 'Buy milk' });

      const response = await request(app)
        .post('/api/todos')
        .send(todoInput);

      expect(response.status).toBe(201);
      expect(response.body.text).toBe('Buy milk');
      expect(response.body.completed).toBe(false);
    });

    it('generates UUID v4 for id @p1', async () => {
      const todoInput = createTodoInput();

      const response = await request(app)
        .post('/api/todos')
        .send(todoInput);

      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(response.body.id).toMatch(uuidRegex);
    });

    it('generates ISO 8601 timestamp for createdAt @p1', async () => {
      const todoInput = createTodoInput();

      const response = await request(app)
        .post('/api/todos')
        .send(todoInput);

      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
      expect(response.body.createdAt).toMatch(isoRegex);
    });

    it('sets completed to false by default @p1', async () => {
      const todoInput = createTodoInput();

      const response = await request(app)
        .post('/api/todos')
        .send(todoInput);

      expect(response.body.completed).toBe(false);
    });

    it('trims whitespace from text @p2', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send(edgeCases.whitespace);

      expect(response.status).toBe(201);
      expect(response.body.text).toBe('Trimmed task');
    });

    it('persists todo in database @p0', async () => {
      const todoInput = createTodoInput({ text: 'Persisted todo' });

      const postResponse = await request(app)
        .post('/api/todos')
        .send(todoInput);

      const getResponse = await request(app).get('/api/todos');

      expect(getResponse.body).toHaveLength(1);
      expect(getResponse.body[0].id).toBe(postResponse.body.id);
    });

    describe('validation', () => {
      it('returns 400 for empty text @p1', async () => {
        const response = await request(app)
          .post('/api/todos')
          .send(invalidCases.empty);

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });

      it('returns 400 for whitespace-only text @p2', async () => {
        const response = await request(app)
          .post('/api/todos')
          .send(invalidCases.whitespaceOnly);

        expect(response.status).toBe(400);
      });

      it('returns 400 for text > 500 characters @p2', async () => {
        const response = await request(app)
          .post('/api/todos')
          .send(invalidCases.tooLong);

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });

      it('returns 400 for missing text field @p1', async () => {
        const response = await request(app)
          .post('/api/todos')
          .send(invalidCases.missingText);

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });

      it('returns structured error response @p1', async () => {
        const response = await request(app)
          .post('/api/todos')
          .send(invalidCases.empty);

        expect(response.status).toBe(400);
        expect(response.body.error).toHaveProperty('code');
        expect(response.body.error).toHaveProperty('message');
        expect(response.body.error).toHaveProperty('details');
      });
    });
  });

  describe('PATCH /api/todos/:id', () => {
    it('returns 200 with updated todo when updating completed @p0', async () => {
      // Create a todo first
      const todoInput = createTodoInput();
      const createResponse = await request(app)
        .post('/api/todos')
        .send(todoInput);
      const todoId = createResponse.body.id;

      // Update completed status
      const response = await request(app)
        .patch(`/api/todos/${todoId}`)
        .send(createUpdateInput({ completed: true }));

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(todoId);
      expect(response.body.completed).toBe(true);
      expect(response.body.text).toBe(todoInput.text);
    });

    it('can toggle completed back to false @p1', async () => {
      // Create a todo and mark it complete
      const todoInput = createTodoInput({ text: 'Toggle test' });
      const createResponse = await request(app)
        .post('/api/todos')
        .send(todoInput);
      const todoId = createResponse.body.id;

      await request(app)
        .patch(`/api/todos/${todoId}`)
        .send(createUpdateInput({ completed: true }));

      // Toggle back to false
      const response = await request(app)
        .patch(`/api/todos/${todoId}`)
        .send(createUpdateInput({ completed: false }));

      expect(response.status).toBe(200);
      expect(response.body.completed).toBe(false);
    });

    it('returns 200 with updated todo when updating text @p0', async () => {
      // Create a todo first
      const todoInput = createTodoInput({ text: 'Original text' });
      const createResponse = await request(app)
        .post('/api/todos')
        .send(todoInput);
      const todoId = createResponse.body.id;

      // Update text
      const response = await request(app)
        .patch(`/api/todos/${todoId}`)
        .send(createUpdateInput({ text: 'Updated text' }));

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(todoId);
      expect(response.body.text).toBe('Updated text');
    });

    it('updates both text and completed in single request @p1', async () => {
      const todoInput = createTodoInput({ text: 'Original' });
      const createResponse = await request(app)
        .post('/api/todos')
        .send(todoInput);
      const todoId = createResponse.body.id;

      const response = await request(app)
        .patch(`/api/todos/${todoId}`)
        .send(createUpdateInput({ text: 'Updated', completed: true }));

      expect(response.status).toBe(200);
      expect(response.body.text).toBe('Updated');
      expect(response.body.completed).toBe(true);
    });

    it('trims whitespace from text updates @p2', async () => {
      const todoInput = createTodoInput({ text: 'Original' });
      const createResponse = await request(app)
        .post('/api/todos')
        .send(todoInput);
      const todoId = createResponse.body.id;

      const response = await request(app)
        .patch(`/api/todos/${todoId}`)
        .send(createUpdateInput({ text: '  Trimmed text  ' }));

      expect(response.status).toBe(200);
      expect(response.body.text).toBe('Trimmed text');
    });

    it('persists updates in database @p0', async () => {
      const todoInput = createTodoInput();
      const createResponse = await request(app)
        .post('/api/todos')
        .send(todoInput);
      const todoId = createResponse.body.id;

      await request(app)
        .patch(`/api/todos/${todoId}`)
        .send(createUpdateInput({ completed: true }));

      // Fetch and verify
      const getResponse = await request(app).get('/api/todos');
      const todo = getResponse.body.find((t: { id: string }) => t.id === todoId);
      expect(todo.completed).toBe(true);
    });

    it('returns current todo when no updates provided @p2', async () => {
      const todoInput = createTodoInput();
      const createResponse = await request(app)
        .post('/api/todos')
        .send(todoInput);
      const todoId = createResponse.body.id;

      const response = await request(app)
        .patch(`/api/todos/${todoId}`)
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(todoId);
      expect(response.body.text).toBe(todoInput.text);
    });

    it('returns 404 for non-existent todo @p1', async () => {
      const fakeId = '00000000-0000-4000-8000-000000000000';

      const response = await request(app)
        .patch(`/api/todos/${fakeId}`)
        .send(createUpdateInput({ completed: true }));

      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('NOT_FOUND');
      expect(response.body.error.message).toBe('Todo not found');
    });

    it('returns 400 for invalid UUID @p2', async () => {
      const response = await request(app)
        .patch('/api/todos/not-a-uuid')
        .send(createUpdateInput({ completed: true }));

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    describe('validation', () => {
      it('returns 400 for empty text @p1', async () => {
        const todoInput = createTodoInput();
        const createResponse = await request(app)
          .post('/api/todos')
          .send(todoInput);
        const todoId = createResponse.body.id;

        const response = await request(app)
          .patch(`/api/todos/${todoId}`)
          .send(createUpdateInput({ text: '' }));

        expect(response.status).toBe(400);
        expect(response.body.error.code).toBe('VALIDATION_ERROR');
      });

      it('returns 400 for text > 500 characters @p2', async () => {
        const todoInput = createTodoInput();
        const createResponse = await request(app)
          .post('/api/todos')
          .send(todoInput);
        const todoId = createResponse.body.id;

        const response = await request(app)
          .patch(`/api/todos/${todoId}`)
          .send(createUpdateInput({ text: 'a'.repeat(501) }));

        expect(response.status).toBe(400);
        expect(response.body.error.code).toBe('VALIDATION_ERROR');
      });

      it('returns 400 for non-boolean completed @p2', async () => {
        const todoInput = createTodoInput();
        const createResponse = await request(app)
          .post('/api/todos')
          .send(todoInput);
        const todoId = createResponse.body.id;

        const response = await request(app)
          .patch(`/api/todos/${todoId}`)
          .send({ completed: 'yes' });

        expect(response.status).toBe(400);
        expect(response.body.error.code).toBe('VALIDATION_ERROR');
      });
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('returns 204 No Content on successful delete @p0', async () => {
      // Create a todo first
      const todoInput = createTodoInput({ text: 'Todo to delete' });
      const createResponse = await request(app)
        .post('/api/todos')
        .send(todoInput);
      const todoId = createResponse.body.id;

      // Delete the todo
      const response = await request(app).delete(`/api/todos/${todoId}`);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    it('removes todo from database @p0', async () => {
      // Create a todo
      const todoInput = createTodoInput({ text: 'Todo to delete' });
      const createResponse = await request(app)
        .post('/api/todos')
        .send(todoInput);
      const todoId = createResponse.body.id;

      // Verify it exists
      const beforeDelete = await request(app).get('/api/todos');
      expect(beforeDelete.body.some((t: { id: string }) => t.id === todoId)).toBe(true);

      // Delete it
      await request(app).delete(`/api/todos/${todoId}`);

      // Verify it's gone
      const afterDelete = await request(app).get('/api/todos');
      expect(afterDelete.body.some((t: { id: string }) => t.id === todoId)).toBe(false);
    });

    it('returns 404 for non-existent todo @p1', async () => {
      const fakeId = '00000000-0000-4000-8000-000000000000';

      const response = await request(app).delete(`/api/todos/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('NOT_FOUND');
      expect(response.body.error.message).toBe('Todo not found');
    });

    it('returns 400 for invalid UUID @p2', async () => {
      const response = await request(app).delete('/api/todos/not-a-uuid');

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('does not affect other todos when deleting one @p1', async () => {
      // Create multiple todos using factory
      const todo1Input = createTodoInput({ text: 'Keep this' });
      const todo2Input = createTodoInput({ text: 'Delete this' });
      const todo3Input = createTodoInput({ text: 'Keep this too' });

      const todo1 = await request(app).post('/api/todos').send(todo1Input);
      const todo2 = await request(app).post('/api/todos').send(todo2Input);
      const todo3 = await request(app).post('/api/todos').send(todo3Input);

      // Delete the middle one
      await request(app).delete(`/api/todos/${todo2.body.id}`);

      // Verify others still exist
      const remaining = await request(app).get('/api/todos');
      expect(remaining.body).toHaveLength(2);
      expect(remaining.body.some((t: { id: string }) => t.id === todo1.body.id)).toBe(true);
      expect(remaining.body.some((t: { id: string }) => t.id === todo3.body.id)).toBe(true);
    });
  });
});

