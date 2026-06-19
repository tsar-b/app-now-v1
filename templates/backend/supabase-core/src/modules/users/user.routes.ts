import { Router } from 'express';
import { requireAuth } from '../../middleware/authMiddleware';
import { deleteMe, getMe, updateMe } from './user.controller';

export const userRouter = Router();

userRouter.get('/me', requireAuth, getMe);
userRouter.patch('/me', requireAuth, updateMe);
userRouter.delete('/me', requireAuth, deleteMe);
