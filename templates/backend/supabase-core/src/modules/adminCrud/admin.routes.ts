import { Router } from 'express';
import { requireAuth } from '../../middleware/authMiddleware';
import { requireAdmin } from '../../middleware/adminMiddleware';
import { deleteRow, listRows, updateRow } from './adminCrud.controller';

export const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);

adminRouter.get('/:table', listRows);
adminRouter.patch('/:table/:id', updateRow);
adminRouter.delete('/:table/:id', deleteRow);
