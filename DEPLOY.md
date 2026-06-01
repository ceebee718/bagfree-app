# BagFree Concierge — Edge Function Setup

Your Anthropic key is already a Supabase secret. You just need to deploy the
function that uses it. Two ways to do this:

## Option A — Supabase CLI (recommended)

1. Install the CLI (one time):
   - macOS:  `brew install supabase/tap/supabase`
   - Windows: `scoop install supabase`  (or see supabase.com/docs/guides/cli)

2. Log in and link your project (one time):
   ```
   supabase login
   supabase link --project-ref vkctidpaghpdlmleezvq
   ```

3. Put the function file in place. From your project folder:
   ```
   mkdir -p supabase/functions/concierge
   ```
   Copy `concierge/index.ts` (the file I gave you) into
   `supabase/functions/concierge/index.ts`.

4. Make sure the secret is set (you said it already is — this confirms the name).
   It MUST be named exactly ANTHROPIC_API_KEY:
   ```
   supabase secrets set ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```
   To check what's set:  `supabase secrets list`

5. Deploy:
   ```
   supabase functions deploy concierge --no-verify-jwt
   ```
   (`--no-verify-jwt` lets the browser call it with just the anon key.)

That's it. Your site will now reach Claude through:
  https://vkctidpaghpdlmleezvq.supabase.co/functions/v1/concierge


## Option B — Supabase Dashboard (no CLI)

1. Dashboard -> Edge Functions -> "Create a new function".
2. Name it exactly:  concierge
3. Paste the entire contents of `concierge/index.ts` into the editor.
4. Deploy.
5. Dashboard -> Project Settings -> Edge Functions -> verify the secret
   ANTHROPIC_API_KEY exists. If the name is different, either rename it to
   ANTHROPIC_API_KEY, or tell me the real name and I'll update the function.


## Test it

After deploying, run this from a terminal (replace ANON_KEY with your anon key):

```
curl -i -X POST \
  https://vkctidpaghpdlmleezvq.supabase.co/functions/v1/concierge \
  -H "Authorization: Bearer ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"hello"}],"max_tokens":50}'
```

A 200 response with JSON containing "content" means it works. Then open your
site, ask the concierge something, and you should get a real reply instead of
"Sorry — I had trouble responding."


## Common issues

- "ANTHROPIC_API_KEY not configured" -> the secret name doesn't match. Set it
  to exactly ANTHROPIC_API_KEY and redeploy.
- 401 / "Invalid JWT" -> you deployed without `--no-verify-jwt`. Redeploy with
  that flag, OR keep JWT on and make sure the browser sends the anon key (the
  site already does).
- 529 / overloaded -> Anthropic was briefly busy; just retry.
