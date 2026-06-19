import express from 'express';
import cors from 'cors';
import { registerRoutes } from '../routes/index.js';
import { errorHandler } from './errors.js';

export function createHttpServer() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  registerRoutes(app);
  app.use(errorHandler);

  return app;
}
