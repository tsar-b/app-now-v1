import { z } from 'zod';

const EnvSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.string().default('development'),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  JWT_SECRET: z.string().min(24),
  KAKAO_REST_API_KEY: z.string().optional(),
  KAKAO_ADMIN_KEY: z.string().optional()
});

export const env = EnvSchema.parse(process.env);
