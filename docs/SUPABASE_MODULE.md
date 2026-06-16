# Supabase Module

Supabase should be a separate AppNow module, not mixed into the Mongo source connector.

## Mental Model

AppNow has two sides:

```txt
source node -> transform -> target node
```

For this project:

```txt
MongoDB or Mongo API -> JSON artifacts -> Supabase
```

Supabase is the target node.

## Required Supabase Values

```txt
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

The URL is not very sensitive. The service role key is highly sensitive.

Never commit:

```txt
SUPABASE_SERVICE_ROLE_KEY
```

## First-Time Supabase Setup

1. Create a Supabase project.
2. Create target tables.
3. Copy the project URL.
4. Copy the service role key only into local `.env` or GitHub Actions secrets.
5. Keep `APPNOW_DRY_RUN=true`.
6. Run export.
7. Inspect generated JSON counts.
8. Run dry-run upload.
9. Turn dry-run off only when the JSON and table columns match.

## Table Creation Strategy

Start with simple text/number/date columns. Do not over-model relations on day one.

Suggested `users` table:

```sql
create table if not exists users (
  id text primary key,
  legacy_user_id integer,
  name text,
  phone text,
  email text,
  provider text,
  is_admin boolean,
  created_at timestamptz,
  migrated_at timestamptz,
  migration_source text
);
```

Suggested `bookings` table:

```sql
create table if not exists bookings (
  id text primary key,
  legacy_user_id integer,
  name text,
  reservation_date text,
  reservation_time text,
  status text,
  total_price integer,
  created_at timestamptz,
  migrated_at timestamptz,
  migration_source text
);
```

## RLS Warning

For migration tables, use the service role key server-side only.

Do not put the service role key in:

```txt
frontend app
mobile app
public GitHub repo
screenshots
chat logs
```

Later, when the data is serving a real app, enable Row Level Security and write policies.

## AppNow Supabase Module Boundary

Code should stay grouped like this:

```txt
src/connectors/supabaseRest.js
src/pipeline/uploadSupabase.js
docs/SUPABASE_MODULE.md
```

Future module:

```txt
src/modules/supabase/
  schemaSqlGenerator.js
  tableProbe.js
  uploadPlan.js
```

## Current State

Current AppNow supports:

- dry-run upload
- table probe when `SUPABASE_SERVICE_ROLE_KEY` exists
- batch upsert through PostgREST
- required-field validation before upload

Still needed:

- SQL generation from `appnow.config.json`
- column mismatch detection
- GitHub Actions secrets support
- migration run logs
