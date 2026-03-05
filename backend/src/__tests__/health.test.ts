import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';

/**
 * Health endpoint tests
 *
 * These tests verify the /api/health endpoint is working correctly.
 * The endpoint is used for:
 * - Load balancer health checks
 * - Container orchestration readiness probes
 * - Basic connectivity verification
 */

describe('GET /api/health', () => {
  it('returns 200 with status ok', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('returns JSON content type', async () => {
    const response = await request(app).get('/api/health');

    expect(response.headers['content-type']).toMatch(/application\/json/);
  });

  it('responds within acceptable time (<100ms)', async () => {
    const start = Date.now();
    await request(app).get('/api/health');
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(100);
  });
});

