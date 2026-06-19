# Backend Templates

AppNow backend templates are now split into two tracks:

```txt
Supabase core backend = main app runtime
Mongo legacy backend = migration/source compatibility
```

## Supabase Core

Location:

```txt
templates/backend/supabase-core
```

Purpose:

- Express API runtime.
- Supabase/Postgres as primary database.
- Auth/session routes.
- User profile routes.
- Admin CRUD routes.
- Booking routes.
- Catalog initialize endpoint.
- Kakao address integration boundary.

This template is based on useful SHC backend v1 concepts, but cleaned up:

- admin routes are separated
- auth middleware is isolated
- Supabase service role is server-side only
- catalog initialize is a first-class module
- Mongo is not mixed into app runtime

## Mongo Legacy

Location:

```txt
templates/backend/mongo-legacy
```

Purpose:

- Read old MongoDB data.
- Count legacy collections.
- Export legacy records.
- Compare migration counts.

This module should not be used as the primary runtime database for new AppNow-generated apps.

## Database Automation

Command:

```bash
npm run db:automation
```

Purpose:

- Generate starter Supabase table SQL.
- Generate starter RLS SQL.
- Generate a seed/import plan.

This is intentionally conservative. It avoids foreign keys until the app-specific relationships are confirmed.

## Next Backend Template Tasks

1. Generate these templates from an AppNow project spec.
2. Add column mismatch detection against live Supabase.
3. Generate richer admin CRUD metadata.
4. Add service-level tests for auth/admin/catalog.
5. Add Kakao login template after address search is stable.
