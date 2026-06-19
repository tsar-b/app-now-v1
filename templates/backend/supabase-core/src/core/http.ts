import express from 'express';
import { registerRoutes } from '../routes/index.js';
import { errorHandler } from './errors.js';
import { applySecurity } from './security.js';
import { requireIdempotencyKey } from '../middleware/idempotencyMiddleware.js';
import { requestLogger } from '../middleware/requestContext.js';
import { openApiDocument } from '../openapi/openapi.js';

export function createHttpServer() {
  const app = express();

  applySecurity(app);
  app.use(requestLogger);
  app.use(express.json({ limit: '1mb' }));
  app.use(requireIdempotencyKey);

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/ready', (_req, res) => {
    res.json({ ok: true, dependencies: { supabase: true } });
  });

  app.get('/openapi.json', (_req, res) => {
    res.json(openApiDocument);
  });

  registerRoutes(app);
  app.use(errorHandler);

  return app;
}
