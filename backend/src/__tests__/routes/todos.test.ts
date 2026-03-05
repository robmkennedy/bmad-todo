import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../app.js';

/**
 * Todo API endpoint tests
 *
 * These integration tests verify the REST API endpoints for todo management.
 * They test the full request/response cycle including validation.
 *
 * Note: Database is cleared between tests by the global setup.
 */

describe('Todo API', () => {

  describe('GET /api/todos', () => {
    it('returns 200 with empty array when no todos', async () => {
      const response = await request(app).get('/api/todos');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('returns all todos', async () => {
      // Create some todos first
      await request(app).post('/api/todos').send({ text: 'First todo' });
      await request(app).post('/api/todos').send({ text: 'Second todo' });

      const response = await request(app).get('/api/todos');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    it('returns todos sorted by createdAt descending (newest first)', async () => {
      // Create todos - ordering is determined by createdAt timestamps
      // The backend generates timestamps, so we rely on sequential creation
      await request(app).post('/api/todos').send({ text: 'First todo' });
      await request(app).post('/api/todos').send({ text: 'Second todo' });

      const response = await request(app).get('/api/todos');

      expect(response.status).toBe(200);
      expect(response.body[0].text).toBe('Second todo');
      expect(response.body[1].text).toBe('First todo');
    });

    it('returns correct todo structure (id, text, completed, createdAt)', async () => {
      await request(app).post('/api/todos').send({ text: 'Test todo' });

      const response = await request(app).get('/api/todos');

      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('text');
      expect(response.body[0]).toHaveProperty('completed');
      expect(response.body[0]).toHaveProperty('createdAt');
    });
  });

  describe('POST /api/todos', () => {
    it('returns 201 with created todo', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ text: 'Buy milk' });

      expect(response.status).toBe(201);
      expect(response.body.text).toBe('Buy milk');
      expect(response.body.completed).toBe(false);
    });

    it('generates UUID v4 for id', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ text: 'Test todo' });

      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(response.body.id).toMatch(uuidRegex);
    });

    it('generates ISO 8601 timestamp for createdAt', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ text: 'Test todo' });

      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
      expect(response.body.createdAt).toMatch(isoRegex);
    });

    it('sets completed to false by default', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ text: 'Test todo' });

      expect(response.body.completed).toBe(false);
    });

    it('trims whitespace from text', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ text: '  Buy milk  ' });

      expect(response.status).toBe(201);
      expect(response.body.text).toBe('Buy milk');
    });

    it('persists todo in database', async () => {
      const postResponse = await request(app)
        .post('/api/todos')
        .send({ text: 'Persisted todo' });

      const getResponse = await request(app).get('/api/todos');

      expect(getResponse.body).toHaveLength(1);
      expect(getResponse.body[0].id).toBe(postResponse.body.id);
    });

    describe('validation', () => {
      it('returns 400 for empty text', async () => {
        const response = await request(app)
          .post('/api/todos')
          .send({ text: '' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });

      it('returns 400 for whitespace-only text', async () => {
        const response = await request(app)
          .post('/api/todos')
          .send({ text: '   ' });

        expect(response.status).toBe(400);
      });

      it('returns 400 for text > 500 characters', async () => {
        const longText = 'a'.repeat(501);
        const response = await request(app)
          .post('/api/todos')
          .send({ text: longText });

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });

      it('returns 400 for missing text field', async () => {
        const response = await request(app).post('/api/todos').send({});

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });

      it('returns structured error response', async () => {
        const response = await request(app)
          .post('/api/todos')
          .send({ text: '' });

        expect(response.status).toBe(400);
        expect(response.body.error).toHaveProperty('code');
        expect(response.body.error).toHaveProperty('message');
        expect(response.body.error).toHaveProperty('details');
      });
    });
  });
});

