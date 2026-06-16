# Local Test Results

Date: 2026-06-16

## Secrets Handling

`/Users/allan/Documents/blyat.md` was treated as sensitive.

Only recognized key names were printed. Secret values were not echoed.

Imported keys:

```txt
MONGO_URI
SUPABASE_URL
```

Missing keys:

```txt
MONGO_DATABASE
MONGO_API_BASE_URL
MONGO_API_TOKEN
SUPABASE_SERVICE_ROLE_KEY
```

## Node Probe

MongoDB source node:

```txt
database: shc
users records: 54
bookings records: 1
```

Supabase target node:

```txt
skipped because SUPABASE_SERVICE_ROLE_KEY is not set
```

## JSON Export

Export succeeded.

Output directory:

```txt
data/exports/2026-06-16T10-16-53-745Z
```

Counts:

```txt
users raw: 54
users approved: 0
users transformed: 0

bookings raw: 1
bookings approved: 0
bookings transformed: 0
```

Why approved records are zero:

```txt
users do not have isApproved/approved fields
the only booking has status 대기
```

This means the pipeline works, but approval rules must be adjusted depending on whether AppNow should migrate:

```txt
all records
only confirmed/completed records
only manually approved records
```

## Dry-Run Upload

Dry-run upload succeeded.

No records were uploaded because transformed JSON contains zero rows under the current approval rules.
