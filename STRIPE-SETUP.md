# BagFree — Stripe Membership Setup Guide

## Overview

The membership system uses three Supabase Edge Functions:
- `stripe-checkout` — creates a Stripe Checkout Session when a user clicks "Get Gold/Emerald/Platinum"
- `stripe-webhook` — handles payment success: creates user account + membership record
- `concierge` — (already deployed) AI chat proxy

The flow: User picks tier → redirected to Stripe's hosted checkout → pays →
Stripe webhook fires → Edge Function creates their Supabase account + membership →
user redirected back to membership.html with a success banner.

---

## Step-by-step setup

### 1. Run the SQL migrations (Supabase SQL Editor)

Run these in order:
1. `membership-events-schema.sql` — creates tiers, events, registrations tables
2. `stripe-migration.sql` — adds Stripe price ID columns

### 2. Create Stripe Products + Prices

In [Stripe Dashboard](https://dashboard.stripe.com) → Products:

Create **3 products**, each with **2 recurring prices** (monthly + annual):

| Product | Monthly | Annual |
|---------|---------|--------|
| BagFree Gold Membership | $99/mo | $948/yr ($79/mo) |
| BagFree Emerald Membership | $49/mo | $468/yr ($39/mo) |
| BagFree Platinum Membership | $19/mo | $180/yr ($15/mo) |

After creating each price, copy the **Price ID** (starts with `price_`).

### 3. Store Price IDs in Supabase

In Supabase SQL Editor, run (with your real Price IDs):

```sql
UPDATE public.membership_tiers SET
  stripe_price_id_monthly = 'price_XXXXX',
  stripe_price_id_annual  = 'price_XXXXX'
WHERE id = 'gold';

UPDATE public.membership_tiers SET
  stripe_price_id_monthly = 'price_XXXXX',
  stripe_price_id_annual  = 'price_XXXXX'
WHERE id = 'emerald';

UPDATE public.membership_tiers SET
  stripe_price_id_monthly = 'price_XXXXX',
  stripe_price_id_annual  = 'price_XXXXX'
WHERE id = 'platinum';
```

### 4. Set Supabase secrets

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_XXXXX
supabase secrets set SITE_URL=https://bagfree.app
```

### 5. Deploy the Edge Functions

```bash
supabase functions deploy stripe-checkout --no-verify-jwt
supabase functions deploy stripe-webhook --no-verify-jwt
```

### 6. Create the Stripe Webhook

In [Stripe Dashboard](https://dashboard.stripe.com) → Developers → Webhooks → Add endpoint:

- **URL:** `https://vkctidpaghpdlmleezvq.supabase.co/functions/v1/stripe-webhook`
- **Events to listen for:**
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

After creating, copy the **Signing secret** (starts with `whsec_`):

```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_XXXXX
```

### 7. Deploy files

Upload to your site:
- `membership.html` — the membership + events page
- `index.html` — updated with "Membership" in the sidebar

---

## Testing with Stripe Test Mode

Before going live, use Stripe's test mode:
- Use `sk_test_` key instead of `sk_live_`
- Test card: `4242 4242 4242 4242` (any expiry, any CVC)
- Create test webhook with the same URL

Once verified, switch to live keys.

---

## What happens after payment

1. User completes Stripe Checkout
2. Stripe fires `checkout.session.completed` webhook
3. The webhook function:
   - Finds or creates a Supabase Auth user with their email
   - Creates a `user_memberships` record (tier, billing cycle, dates)
   - Updates their `profiles` row with tier + Stripe customer ID
4. User is redirected to `/membership.html?success=true&tier=gold`
5. The page shows a green "Welcome to BagFree Gold!" banner

---

## Managing subscriptions later

When a user upgrades, downgrades, or cancels in Stripe:
- `customer.subscription.updated` fires → membership status/tier updated
- `customer.subscription.deleted` fires → membership marked cancelled

To add a self-service portal (manage/cancel), use Stripe's Customer Portal:
```bash
supabase secrets set STRIPE_CUSTOMER_PORTAL_URL=https://billing.stripe.com/p/login/XXXXX
```
Then add a "Manage Subscription" link on the membership page pointing to it.
