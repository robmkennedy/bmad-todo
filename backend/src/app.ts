import express from 'express';
import { todosRouter } from './routes/index.js';

/**
 * Express application factory
 *
 * Creates and configures the Express app.
 * Separated from server startup to enable testing.
 */
export function createApp() {
  const app = express();

  // Middleware
  app.use(express.json({ limit: '100kb' }));

  // CORS for development (allow frontend origin)
  app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (_req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // API Routes
  app.use('/api/todos', todosRouter);

  return app;
}

// Export app instance for testing
export const app = createApp();

