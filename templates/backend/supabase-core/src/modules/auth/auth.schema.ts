import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(1).max(120),
  phone: z.string().max(50).optional(),
  email: z.string().email(),
  password: z.string().min(8).max(200),
  provider: z.enum(['standard', 'kakao', 'apple', 'guest']).default('standard')
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(200)
});
