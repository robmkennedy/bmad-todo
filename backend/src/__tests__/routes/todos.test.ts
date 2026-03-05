import { describe, it, expect, beforeEach } from 'vitest';
// import request from 'supertest';
// import { app } from '../../app';
// import { db } from '../../db';
// import { todos } from '../../db/schema';

/**
 * Todo API endpoint tests
 *
 * These integration tests verify the REST API endpoints for todo management.
 * They test the full request/response cycle including validation.
 */

describe('Todo API', () => {
  beforeEach(async () => {
    // Clear database before each test
    // await db.delete(todos);
  });

  describe('GET /api/todos', () => {
    it.todo('returns 200 with empty array when no todos');

    it.todo('returns all todos');

    it.todo('returns todos sorted by createdAt descending (newest first)');

    it.todo('returns correct todo structure (id, text, completed, createdAt)');
  });

  describe('POST /api/todos', () => {
    it.todo('returns 201 with created todo');

    it.todo('generates UUID v4 for id');

    it.todo('generates ISO 8601 timestamp for createdAt');

    it.todo('sets completed to false by default');

    it.todo('trims whitespace from text');

    it.todo('persists todo in database');

    describe('validation', () => {
      it.todo('returns 400 for empty text');

      it.todo('returns 400 for whitespace-only text');

      it.todo('returns 400 for text > 500 characters');

      it.todo('returns 400 for missing text field');

      it.todo('returns structured error response');
    });
  });
});

/**
 * Example implementation (uncomment when app is ready):
 *
 * describe('Todo API', () => {
 *   beforeEach(async () => {
 *     await db.delete(todos);
 *   });
 *
 *   describe('GET /api/todos', () => {
 *     it('returns 200 with empty array when no todos', async () => {
 *       const response = await request(app).get('/api/todos');
 *
 *       expect(response.status).toBe(200);
 *       expect(response.body).toEqual([]);
 *     });
 *
 *     it('returns todos sorted by createdAt descending', async () => {
 *       await request(app).post('/api/todos').send({ text: 'First' });
 *       await request(app).post('/api/todos').send({ text: 'Second' });
 *
 *       const response = await request(app).get('/api/todos');
 *
 *       expect(response.body[0].text).toBe('Second');
 *       expect(response.body[1].text).toBe('First');
 *     });
 *   });
 *
 *   describe('POST /api/todos', () => {
 *     it('returns 201 with created todo', async () => {
 *       const response = await request(app)
 *         .post('/api/todos')
 *         .send({ text: 'Buy milk' });
 *
 *       expect(response.status).toBe(201);
 *       expect(response.body.text).toBe('Buy milk');
 *       expect(response.body.completed).toBe(false);
 *     });
 *
 *     it('returns 400 for empty text', async () => {
 *       const response = await request(app)
 *         .post('/api/todos')
 *         .send({ text: '' });
 *
 *       expect(response.status).toBe(400);
 *       expect(response.body.error).toBeDefined();
 *     });
 *   });
 * });
 */

