# BagFree — Security Fixes Applied & Remaining Steps

This covers the 5 issues raised. Items marked **[DONE IN CODE]** are already
handled in index.html / the Edge Function. Items marked **[YOUR ACTION]** are
Supabase dashboard settings only you can apply.

---

## 1. Supabase anon key is public  →  lock down RLS  [YOUR ACTION]

The anon key is *meant* to be public — safety comes from Row Level Security.
The browser queries `searchable_content`, so that table must be read-only to the
public and every other table must be locked down.

In Supabase → Table Editor → each table → enable RLS, then add policies:

**searchable_content** — public read only (the SQL I gave you already does this):
```sql
alter table public.searchable_content enable row level security;
create policy "public read" on public.searchable_content for select using (true);
-- NO insert/update/delete policy for anon → writes are blocked.
```

**profiles, trips, delivery_items** — owner-only. RLS is already enabled per
your screenshot ("Users can read/insert/update own ..."). Confirm there is NO
policy with `using (true)` for select on these — they should be scoped to
`auth.uid() = user_id`. Example:
```sql
create policy "read own" on public.trips
  for select using (auth.uid() = user_id);
```

**coverage_waitlist** — you have "Anyone can join waitlist" (insert) and
"No public reads". That's correct: people can sign up but can't read others'
emails. Leave as-is.

Verify nothing leaks: open this URL in a private browser tab (replace KEY):
```
https://vkctidpaghpdlmleezvq.supabase.co/rest/v1/profiles?select=*&apikey=KEY
```
It should return `[]` or a permission error — NOT a list of users.

---

## 2. Concierge function can be abused  [DONE IN CODE] + [YOUR ACTION]

The hardened Edge Function (concierge/index.ts) now has:
- **Domain-locked CORS** — set the `ALLOWED_ORIGINS` secret to your real
  domain(s). Until you do, it falls back to "*" (fine for testing only).
- **Per-IP rate limiting** — 15 requests/minute/IP (tune at top of file).
- **Input validation** — max 20 messages, 2000 chars each, 12000 total.
- **Model + token ceiling pinned server-side** — client can't request a
  bigger/more expensive model or huge `max_tokens`.

[YOUR ACTION] Set the origin allow-list and deploy WITH jwt verification:
```
supabase secrets set ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
supabase functions deploy concierge        # note: NO --no-verify-jwt
```
Deploying without `--no-verify-jwt` means callers must present a valid Supabase
key/session — the site already sends the anon key, so it keeps working, but
random anonymous scripts are rejected.

**Strongest option (optional):** require a logged-in user. If you add Supabase
Auth, the function can check the JWT belongs to a real session before calling
Claude, so only signed-in users can spend your credits.

**Also set a hard spend cap** in the Anthropic Console (Billing → usage limits)
so even a worst case can't run up an unbounded bill.

---

## 3. No Content Security Policy  [DONE IN CODE]

Added a CSP `<meta>` tag to index.html that restricts:
- scripts → self + cdnjs (React/Babel) + Vimeo only
- styles/fonts → self + Google Fonts only
- images → self + data URIs + Unsplash only
- network (connect-src) → your Supabase project ONLY
- frames → Vimeo only; object-src none; base-uri self

Note: `'unsafe-inline'`/`'unsafe-eval'` are required because the page uses
in-browser Babel and inline scripts. To remove them later, pre-compile the JSX
to a plain .js file at build time, then tighten the CSP to drop those two.
For an even stronger guarantee, also send the same policy as an HTTP response
header from your host (meta-tag CSP is good; header CSP is better).

---

## 4. localStorage analytics  [DONE IN CODE]

`track()` now redacts free-text fields (search queries, seed text, etc.) before
writing to localStorage — it stores `[redacted:N]` instead of the raw text.
Chat message *content* was never written to localStorage. The full payload still
prints to the browser console for live debugging but is not persisted.

When you build the Phase-2 server analytics, POST events over HTTPS to your own
endpoint and avoid storing anything personally identifying.

---

## 5. Prompt / cost abuse  [DONE IN CODE]

Handled by the same caps as #2, on both ends:
- **Client:** chat box has `maxLength=2000`; history trimmed to recent turns.
- **Server:** message count/length/total caps + `max_tokens` ceiling (600) +
  pinned model. Oversized or malformed requests are rejected with a 400 before
  any Anthropic call is made (so they cost you nothing).

---

## Quick checklist

- [ ] Run the searchable_content SQL (enables its public-read RLS).
- [ ] Confirm profiles/trips/delivery_items are owner-scoped (no `using(true)` select).
- [ ] `supabase secrets set ALLOWED_ORIGINS=https://yourdomain.com`
- [ ] `supabase functions deploy concierge`  (without --no-verify-jwt)
- [ ] Set a spend cap in the Anthropic Console.
- [ ] Deploy the new index.html.
