# Phone Commands And Mac Setup

## What Allan Should Send From Phone

Use short, explicit commands. Best format:

```txt
Continue AppNow v1.
Repo/source: tsar-b/app-now-v1
Task: [specific task]
Rules:
- Commit meaningful checkpoints to GitHub.
- Do not add Supabase SDK yet; use REST unless needed.
- Keep Mongo API as the source specialty.
- Keep scope for me first, programmers second.
```

Useful commands:

```txt
Add a collection config for SHC bookings and users.
```

```txt
Add validation that blocks upload if required mapped fields are missing.
```

```txt
Create GitHub Actions check workflow for AppNow v1.
```

```txt
Convert this prototype into a backend module for smart-homecare-backend-v2.
```

## What I Still Need From You

To run a real migration, I need:

- Mongo API base URL.
- Admin JWT or API token, if the endpoints are protected.
- Which endpoints count as source collections.
- Which field means approved for each collection.
- Supabase project URL.
- Supabase service role key.
- Target Supabase table names and column names.

Do not paste long-lived production secrets into random places. Use `.env` locally, and rotate any key that gets exposed.

## Keeping The Mac Running

Important: running a closed Mac inside a bag can trap heat. For long tasks, the safest setup is to leave it plugged in on a desk with airflow.

Closed-lid on battery is not reliable. macOS normally sleeps when the lid closes unless it is in a supported clamshell setup with power and external peripherals. `caffeinate` helps prevent idle sleep, but it usually does not override lid-close sleep by itself.

For terminal-only work, run:

```bash
caffeinate -dimsu
```

Keep that terminal open. Stop it with `Ctrl+C`.

Best practical setup during travel or WMSCOG:

- Keep the Mac physically with you.
- Leave the lid open if you need work to keep running.
- Dim the display all the way down.
- Lock the screen with Control-Command-Q.
- Keep it plugged in if possible.
- Give it airflow; do not zip it inside a tight bag during builds or long network jobs.
- Let GitHub be the handoff layer so you can command work from your phone.
