import { Router } from 'express';
import { login, register } from './auth.controller.js';
import { validate } from '../../middleware/validate.js';
import { LoginSchema, RegisterSchema } from './auth.schema.js';

export const authRouter = Router();

authRouter.post('/register', validate({ body: RegisterSchema }), register);
authRouter.post('/login', validate({ body: LoginSchema }), login);
