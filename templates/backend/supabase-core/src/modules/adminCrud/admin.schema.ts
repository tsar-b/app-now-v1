import { z } from 'zod';

export const AdminTableParamsSchema = z.object({
  table: z.string().min(1).max(80)
});

export const AdminRowParamsSchema = AdminTableParamsSchema.extend({
  id: z.string().min(1).max(200)
});

export const AdminUpdateSchema = z.record(z.unknown()).refine(
  (body) => {
    const blocked = new Set(['id', 'user_id', 'legacy_user_id', 'password', 'password_hash', 'is_admin']);
    return Object.keys(body).every((key) => !blocked.has(key));
  },
  {
    message: 'Request contains protected fields'
  }
);
