# AppNow v1

AppNow v1 starts as a developer-first data bridge:

1. Call an existing Mongo-backed API.
2. Keep only records with approved signals.
3. Write raw, approved, and Supabase-ready JSON files.
4. Upload transformed records to Supabase through PostgREST.

This is intentionally not a no-code builder yet. It is the smallest useful AppNow core: connect APIs, transform data, and make migration repeatable.

## Setup

```bash
cp .env.example .env
cp appnow.config.example.json appnow.config.json
```

Edit `.env`:

```bash
MONGO_API_BASE_URL=http://localhost:5000
MONGO_API_TOKEN=your_admin_jwt_if_needed
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
APPNOW_DRY_RUN=true
```

Edit `appnow.config.json` to match your source endpoints and Supabase tables.

Do not commit `.env`. It is ignored by Git.

## Commands

```bash
npm run check
npm run export
npm run upload
npm run migrate
```

- `check`: verifies config and required environment variables.
- `export`: calls the Mongo API, filters approved records, validates required fields, writes JSON.
- `upload`: validates previously transformed JSON, then uploads it to Supabase.
- `migrate`: export + upload in one command.

Keep `APPNOW_DRY_RUN=true` until the JSON output looks correct.

## Output

Exports are written to `data/exports/<timestamp>/`:

```txt
users.raw.json
users.approved.json
users.supabase.json
bookings.raw.json
bookings.approved.json
bookings.supabase.json
manifest.json
```

## Approval Rules

Each collection can define an approval rule:

```json
{
  "approval": {
    "mode": "field",
    "field": "status",
    "values": ["approved", "confirmed", "확정"]
  }
}
```

If a collection has no approval rule, AppNow uses conservative defaults:

- `isApproved === true`
- `approved === true`
- `status` is one of `approved`, `confirmed`, `active`, `확정`, `완료`

## Required Fields

Each collection can declare transformed fields that must exist before export/upload continues:

```json
{
  "requiredFields": ["id", "reservation_date", "status"]
}
```

Validation runs twice:

1. During `export`, after records are transformed.
2. During `upload`, before records are sent to Supabase.

This prevents bad mappings from silently creating incomplete Supabase rows.

## Secrets

Safe to commit:

- `.env.example`
- fake URLs
- config shape
- source endpoint paths
- Supabase table names

Do not commit or paste publicly:

- `MONGO_API_TOKEN`
- `SUPABASE_SERVICE_ROLE_KEY`
- production MongoDB connection strings
- any JWT or admin token

The Supabase project URL is usually not highly secret, but keep it in `.env` anyway so environments can change cleanly. The service role key is the dangerous one.

## What This Proves

This proves the AppNow foundation without scope creep:

- source connector
- approval filtering
- JSON artifact generation
- transformation rules
- validation before upload
- target connector
- repeatable migration runs

Later, the same shape can become code generation: source schema in, generated app/module files out.
