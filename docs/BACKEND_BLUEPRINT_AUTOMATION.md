# Backend Blueprint Automation

`npm run backend:blueprint` reads `appnow.config.json` and writes:

- `docs/generated/backend-blueprint.md`
- `docs/generated/openapi-starter.json`

The command is meant to sit between data migration and backend implementation.

## Workflow

1. Configure source collections and field mappings in `appnow.config.json`.
2. Run `npm run db:automation` to generate table SQL, RLS SQL, and seed plan.
3. Run `npm run backend:blueprint` to generate backend module and route guidance.
4. Copy the useful pieces into the Supabase backend template.
5. Add Zod schemas before enabling writes.

## Why This Exists

Backend creation usually loses time in repeated planning:

- Which tables exist?
- Which fields are required?
- Which routes are public, user-owned, or admin-only?
- Which tables should be exposed through admin CRUD?
- Which OpenAPI paths need to exist first?

The blueprint answers those from the same config AppNow already uses for export and upload.

## Command

```bash
npm run backend:blueprint
```

Override output location:

```bash
APPNOW_BACKEND_BLUEPRINT_DIR=./tmp/backend npm run backend:blueprint
```
