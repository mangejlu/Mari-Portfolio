# Connecting the guestbook

The mural works right now without any of this: without keys it saves to the
visitor's own browser, so you can judge the experience first. Everything below
is what makes it **shared** across visitors.

## 1. Make a Supabase project

[supabase.com](https://supabase.com) → new project. Free tier is far beyond
what a portfolio needs.

## 2. Run the schema

Supabase dashboard → **SQL Editor** → paste all of `supabase/schema.sql` → Run.

That creates the table and, importantly, the rules that protect it:

| Rule | Where it lives |
|---|---|
| Only the 6 palette colours allowed | Postgres `CHECK` |
| Name ≤ 24 chars, note ≤ 80 | Postgres `CHECK` |
| Profanity blocklist (English + Spanish) | `mural_guard()` trigger |
| No links (kills spam) | `mural_guard()` trigger |
| One note per browser per day | `mural_guard()` trigger |
| Max 20 notes site-wide per minute | `mural_guard()` trigger |
| Anyone can read and add; nobody can edit or delete | Row Level Security |

**None of this is enforced in the browser.** The site is static, so the anon key
is public and anything checked only in JavaScript could be bypassed with the
dev console. The browser-side checks exist purely so a visitor gets an instant
answer instead of waiting for a round trip.

## 3. Add the keys

Copy `.env.example` to `.env`, then from Supabase → Settings → API:

```
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

Both are safe to publish. The anon key only grants what the policies above
allow. **Never put the `service_role` key in this file** — that one bypasses
every rule.

Restart `npm run dev`. The line under the form stops saying "saved to this
browser" once it's connected.

## 4. Deploy

The site is fully static, so any host works: Vercel, Netlify, Cloudflare Pages.
Add the same two variables in the host's environment settings.

## Moderating

Supabase → Table Editor → `mural_tiles`. Deleting a row removes it from the
wall. The anon key can't delete, so this is the only way anything comes off.

## If you ever need to reset

```sql
truncate mural_tiles;
```
