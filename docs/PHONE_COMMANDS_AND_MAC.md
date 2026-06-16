# Phone Commands And Mac Setup

## What Allan Should Send From Phone

Use short, explicit commands. Best format:

```txt
Continue AppNow v1.
Repo/source: /Users/allan/Documents/Codex/2026-06-09/eh-comrade-where-did-my-other/work/appnow-v1
Task: [specific task]
Rules:
- Commit meaningful checkpoints if a GitHub repo exists.
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
Create a GitHub-ready README and initial commit plan for AppNow v1.
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

## Keeping The Mac Running In A Bag

Important: running a closed Mac inside a bag can trap heat. For long tasks, the safest setup is to leave it plugged in on a desk with airflow.

If you still need it to keep working while closed:

1. Plug the Mac into power.
2. Open System Settings.
3. Go to Battery.
4. Click Options.
5. Enable "Prevent automatic sleeping on power adapter when the display is off" if available.
6. Set "Low Power Mode" to Never or Only on Battery.
7. Use a tool like Amphetamine if you already trust/install it.

For terminal-only work, you can also run:

```bash
caffeinate -dimsu
```

Keep that terminal open. Stop it with `Ctrl+C`.

Best practical setup:

- Start `caffeinate -dimsu`.
- Keep the Mac plugged in.
- Do not zip it inside a tight bag during heavy builds.
- Let GitHub be the handoff layer so you can command work from your phone.
