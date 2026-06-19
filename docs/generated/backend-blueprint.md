# AppNow Backend Blueprint

Generated from `appnow.config.json`.

## Architecture Defaults

- Supabase/Postgres is the primary application database.
- MongoDB is a legacy/source connector, not the core runtime database.
- Service role access stays server-side only.
- Every exposed Supabase table starts with RLS enabled.
- Express routes validate params, query, and body before controllers.
- Mutation endpoints should support `Idempotency-Key` once real payments, bookings, or orders exist.
- OpenAPI is emitted early so frontend and backend can work from one contract.
- SHC-derived modules are extracted as contracts: auth, admin CRUD, initialize, request workflow, Kakao address.

## Runtime Modules

- `core`: env parsing, security middleware, logging, error handling, HTTP server.
- `db`: Supabase anon/admin clients and future typed repositories.
- `middleware`: auth, admin authorization, validation, idempotency, request context.
- `modules/auth`: register, login, provider boundaries.
- `modules/users`: profile and user-owned data.
- `modules/adminCrud`: controlled admin table access.
- `modules/bookings`: SHC-derived booking workflow template.
- `modules/requests`: generalized service-booking/request workflow.
- `modules/appInitialize`: versioned app bootstrap payload for frontend shells.
- `modules/integrations`: Kakao and future provider APIs.
- `templates/backend/mongo-legacy`: migration and source comparison only.

## Collections

### Users

- Source: `/api/admin/users`
- Supabase table: `users`
- Approval mode: `field`
- Primary key: `_id`
- Required fields: `id`, `name`
- Mapped fields: `id`, `legacy_user_id`, `name`, `phone`, `email`, `provider`, `is_admin`, `created_at`

| Surface | Endpoint | Notes |
| --- | --- | --- |
| Public list | `GET /api/users` | Only expose if RLS policy allows anonymous reads. |
| Auth list | `GET /api/users/mine` | Scope by `auth.uid()` or JWT subject. |
| Admin list | `GET /api/admin/users` | Uses service role through backend only. |
| Admin update | `PATCH /api/admin/users/:id` | Validate writable fields before update. |

### Bookings

- Source: `/api/admin/bookings`
- Supabase table: `bookings`
- Approval mode: `field`
- Primary key: `_id`
- Required fields: `id`, `reservation_date`, `reservation_time`, `status`
- Mapped fields: `id`, `legacy_user_id`, `name`, `reservation_date`, `reservation_time`, `status`, `total_price`, `created_at`

| Surface | Endpoint | Notes |
| --- | --- | --- |
| Public list | `GET /api/bookings` | Only expose if RLS policy allows anonymous reads. |
| Auth list | `GET /api/bookings/mine` | Scope by `auth.uid()` or JWT subject. |
| Admin list | `GET /api/admin/bookings` | Uses service role through backend only. |
| Admin update | `PATCH /api/admin/bookings/:id` | Validate writable fields before update. |

## Build Order

1. Generate Supabase tables with `npm run db:automation`.
2. Run generated RLS SQL before exposing tables through REST.
3. Generate this blueprint with `npm run backend:blueprint`.
4. Create typed Zod schemas for each collection's write surface.
5. Add request workflow tables and slot constraints for service-booking apps.
6. Add OpenAPI paths as routes become real.
7. Add tests around auth, RLS-sensitive reads, admin writes, and idempotent mutations.

## Done Means

- `/health`, `/ready`, and `/openapi.json` respond.
- `/api/app/initialize` returns a versioned bootstrap payload.
- Auth, admin, and user-owned routes are separated.
- No route spreads arbitrary request bodies into database writes.
- Admin lists are paginated and filtered server-side.
- Request booking has a database-level unique active slot constraint.
- Logs include request IDs and do not print secrets.
- App-specific policies are documented beside generated SQL.
