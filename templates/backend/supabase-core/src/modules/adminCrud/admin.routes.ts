import { Router } from 'express';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { requireAdmin } from '../../middleware/adminMiddleware.js';
import { deleteRow, listRows, updateRow } from './adminCrud.controller.js';

export const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);

adminRouter.get('/:table', listRows);
adminRouter.patch('/:table/:id', updateRow);
adminRouter.delete('/:table/:id', deleteRow);
