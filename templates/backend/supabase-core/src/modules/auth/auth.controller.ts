import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../core/env';
import { HttpError } from '../../core/errors';
import { supabaseAdmin } from '../../db/supabaseAdmin';

export async function register(req: Request, res: Response) {
  const { name, phone, email, password, provider = 'standard' } = req.body;
  if (!name || !email || !password) {
    throw new HttpError(400, 'name, email and password are required', 'VALIDATION_ERROR');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({ name, phone, email, password_hash: passwordHash, provider })
    .select('id, legacy_user_id, name, email, provider, is_admin')
    .single();

  if (error) throw new HttpError(400, error.message, 'REGISTER_FAILED');
  res.status(201).json({ user: data });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new HttpError(400, 'email and password are required', 'VALIDATION_ERROR');
  }

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('id, legacy_user_id, email, password_hash, provider, is_admin')
    .eq('email', email)
    .single();

  if (error || !user?.password_hash) {
    throw new HttpError(401, 'Invalid login', 'INVALID_LOGIN');
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw new HttpError(401, 'Invalid login', 'INVALID_LOGIN');

  const token = jwt.sign(
    {
      sub: user.id,
      userId: user.legacy_user_id,
      isAdmin: user.is_admin,
      provider: user.provider
    },
    env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token });
}
