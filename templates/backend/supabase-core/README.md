# Supabase Core Backend Template

This is the main AppNow backend template.

It borrows useful SHC backend patterns:

- JWT/auth middleware shape
- admin route separation
- user profile endpoint
- booking/catalog initialize endpoint
- Kakao integration boundary
- admin CRUD pattern

But the core database is Supabase/Postgres, not MongoDB.

MongoDB remains separate under `templates/backend/mongo-legacy`.

## Intended Structure

```txt
src/
  core/
    env.ts
    errors.ts
    http.ts
  db/
    supabaseClient.ts
    supabaseAdmin.ts
  middleware/
    authMiddleware.ts
    adminMiddleware.ts
  modules/
    auth/
    users/
    adminCrud/
    catalog/
    bookings/
    integrations/
      kakao/
  routes/
    index.ts
```

## Core Rule

All app writes go through Supabase first.

MongoDB is only for:

- legacy migration
- compatibility import
- source-of-truth comparison during transition
