import type { NextFunction, Request, Response } from 'express';
import { createHash } from 'node:crypto';
import { env } from '../core/env.js';
import { HttpError } from '../core/errors.js';

type CachedResponse = {
  body: unknown;
  expiresAt: number;
  fingerprint: string;
  statusCode: number;
};

const cache = new Map<string, CachedResponse>();

export function requireIdempotencyKey(req: Request, res: Response, next: NextFunction) {
  if (!env.REQUIRE_IDEMPOTENCY_KEY || !['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method)) {
    next();
    return;
  }

  pruneExpired();

  const key = req.header('idempotency-key');
  if (!key) throw new HttpError(400, 'Idempotency-Key header is required', 'IDEMPOTENCY_KEY_REQUIRED');

  const scopedKey = `${req.method}:${req.originalUrl}:${key}`;
  const fingerprint = createFingerprint(req.body);
  const cached = cache.get(scopedKey);

  if (cached) {
    if (cached.fingerprint !== fingerprint) {
      throw new HttpError(409, 'Idempotency-Key was reused with a different payload', 'IDEMPOTENCY_CONFLICT');
    }
    res.status(cached.statusCode).json(cached.body);
    return;
  }

  const originalJson = res.json.bind(res);
  res.json = (body: unknown) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      cache.set(scopedKey, {
        body,
        expiresAt: Date.now() + env.IDEMPOTENCY_TTL_MS,
        fingerprint,
        statusCode: res.statusCode
      });
    }
    return originalJson(body);
  };

  next();
}

function createFingerprint(body: unknown) {
  return createHash('sha256').update(JSON.stringify(body ?? {})).digest('hex');
}

function pruneExpired() {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (value.expiresAt <= now) cache.delete(key);
  }
}
