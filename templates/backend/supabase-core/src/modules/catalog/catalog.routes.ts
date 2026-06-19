import { Router } from 'express';
import { initializeCatalog } from './catalog.controller';

export const catalogRouter = Router();

catalogRouter.get('/initialize', initializeCatalog);
