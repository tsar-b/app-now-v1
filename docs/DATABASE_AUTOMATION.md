# Database Automation Creator

AppNow includes a database automation creator because manually creating Supabase tables, indexes, and seed plans burns too much time.

## Command

```bash
npm run db:automation
```

By default it writes:

```txt
database/automation/001_create_tables.sql
database/automation/002_enable_rls.sql
database/automation/seed-plan.md
```

You can change the output directory:

```bash
APPNOW_DB_AUTOMATION_DIR=./tmp/db npm run db:automation
```

## Inputs

The creator reads `appnow.config.json` or whichever config is set:

```bash
APPNOW_CONFIG=./appnow.mongo.config.example.json npm run db:automation
```

It uses:

- `collections[].name`
- `collections[].supabaseTable`
- `collections[].mapping`
- `collections[].approval`

## Output

`001_create_tables.sql` creates basic Supabase tables.

`002_enable_rls.sql` enables RLS and adds a service-role-only migration policy.

`seed-plan.md` explains import order and source-to-target mapping.

## Safety

Generated SQL is intentionally conservative.

Review before running in Supabase.

The first version does not create foreign keys automatically because generated relationships should be confirmed by a developer.

## Roadmap

Next automation steps:

1. Detect column mismatch against live Supabase.
2. Generate indexes from common query fields.
3. Generate frontend enum constants.
4. Generate admin CRUD table metadata.
5. Generate RLS policies for normal users after auth rules stabilize.
