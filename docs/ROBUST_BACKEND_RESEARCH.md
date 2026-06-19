# Robust Backend Research Notes

Goal: make AppNow generate a backend that feels unusually complete on day one, while still staying developer-first and not drifting into no-code scope.

## Primary Sources Checked

- Supabase RLS guide: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase API guide: https://supabase.com/docs/guides/api
- Express security best practices: https://expressjs.com/en/advanced/best-practice-security/
- Express performance and reliability: https://expressjs.com/en/advanced/best-practice-performance/
- OWASP API Security Top 10 2023: https://owasp.org/API-Security/editions/2023/en/0x11-t10/
- OpenAPI Specification 3.1.1: https://spec.openapis.org/oas/v3.1.1.html

## What Would Shock Developers

The backend is not shocking because it is huge. It is shocking because the boring production work is already there:

- Supabase/Postgres-first app runtime.
- MongoDB preserved as a legacy/source connector.
- RLS SQL generated immediately for every exposed table.
- Service role key used only by the server template.
- Express security middleware already wired.
- Request IDs and structured logs already wired.
- Zod validation before controllers.
- Mutation idempotency switch for booking/order/payment-like workflows.
- OpenAPI output from the backend and generated starter OpenAPI from AppNow config.
- Database automation, seed plan, and backend blueprint generated from the same config.

## Backend Baseline

Every generated backend should start with:

- `GET /health` for process liveness.
- `GET /ready` for dependency readiness.
- `GET /openapi.json` for contract inspection.
- env validation before server boot.
- CORS allowlist instead of wildcard defaults.
- Helmet headers.
- rate limiting.
- centralized error shape with request IDs.
- validation middleware for body, params, and query.
- auth and admin authorization as separate middleware.
- admin CRUD limited by explicit table allowlist.
- no direct spreading of arbitrary request bodies into database writes.

## Supabase Rules

- Enable RLS on generated tables before tables are exposed.
- Treat generated RLS as starter SQL, not final business policy.
- Keep `SUPABASE_SERVICE_ROLE_KEY` out of frontend code and public logs.
- Prefer app-specific policies that check `auth.uid()` explicitly.
- Use the backend admin client for migrations, admin CRUD, and trusted server tasks only.

## OWASP API Risks To Bake In Early

- Broken object-level authorization: scope user-owned reads and writes by user identity.
- Broken authentication: validate JWTs and keep auth middleware separate from role checks.
- Broken object property authorization: validate writable fields and block protected fields.
- Unrestricted resource consumption: add rate limits and body limits.
- Security misconfiguration: centralize headers, CORS, env validation, and error output.

## Scope Boundary

This is still AppNow v1, so avoid these for now:

- visual no-code schema editor.
- full user-facing app builder.
- multi-tenant billing engine.
- plugin marketplace.
- automatic deployment orchestration.

The valuable v1 target is faster developer backend creation: config in, Supabase schema/RLS/backend blueprint/OpenAPI starter out.
