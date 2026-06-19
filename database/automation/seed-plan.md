# AppNow Seed Plan

Generated database automation plan.

## Import Order

Use this order unless foreign keys are added manually:

1. users
2. bookings

## Collection Map

| Source | Supabase Table | Approval Mode |
| --- | --- | --- |
| users | users | field |
| bookings | bookings | field |

## Notes

- Keep `APPNOW_DRY_RUN=true` until table SQL is reviewed.
- Run `001_create_tables.sql` first.
- Run `002_enable_rls.sql` after confirming service-role-only migration behavior.
- Add app-specific user-facing RLS policies later.
- The reusable service-booking core creates `requests`, catalog tables, `request_options`, `pricing_tiers`, and `audit_logs`.
- The generated `requests_unique_active_slot_idx` prevents double booking for active request statuses.
