import { Router } from 'express';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validate.js';
import { createRequest, getRequestDetail, getRequestHistory } from './request.controller.js';
import { CreateRequestSchema, RequestParamsSchema } from './request.schema.js';

export const requestRouter = Router();

requestRouter.post('/', requireAuth, validate({ body: CreateRequestSchema }), createRequest);
requestRouter.get('/history', requireAuth, getRequestHistory);
requestRouter.get('/:id', requireAuth, validate({ params: RequestParamsSchema }), getRequestDetail);
