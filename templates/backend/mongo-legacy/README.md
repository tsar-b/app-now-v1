# Mongo Legacy Backend Module

MongoDB is kept as a separate AppNow module.

Use it for:

- legacy SHC data import
- MongoDB source reads
- migration verification
- compatibility tools

Do not mix MongoDB persistence into the Supabase-first app backend.

## Boundary

```txt
Supabase core backend:
  app runtime
  auth
  admin CRUD
  bookings
  catalog

Mongo legacy module:
  read old data
  compare counts
  export JSON
  migrate to Supabase
```

## Template Files

```txt
mongoClient.ts
legacyExportService.ts
legacyCompareService.ts
```
