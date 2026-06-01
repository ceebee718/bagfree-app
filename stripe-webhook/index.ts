// ============================================================
// BagFree — Stripe Webhook Handler (Supabase Edge Function)
//
// Deploy:
//   supabase functions deploy stripe-webhook --no-verify-jwt
//
// Secrets needed:
//   supabase secrets set STRIPE_SECRET_KEY=sk_live_xxxxx
//   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxxxx
//
// After deploying, create the webhook in Stripe Dashboard:
//   URL: https://vkctidpaghpdlmleezvq.supabase.co/functions/v1/stripe-webhook
//   Events: checkout.session.completed, customer.subscription.updated,
//           customer.subscription.deleted
// ============================================================

import Stripe from "https://esm.sh/stripe@16.2.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new Response("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      sig,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // ── Handle events ─────────────────────────────────────────
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const tierId = session.metadata?.tier_id;
      const billingCycle = session.metadata?.billing_cycle || "monthly";
      const customerEmail = session.customer_details?.email;
      const stripeCustomerId = session.customer as string;

      if (!tierId || !customerEmail) {
        console.error("Missing tier_id or email in session metadata");
        break;
      }

      console.log(
        `Checkout completed: ${customerEmail} → ${tierId} (${billingCycle})`
      );

      // 1. Find or create the user in Supabase Auth
      let userId: string;

      // Check if user already exists
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existing = existingUsers?.users?.find(
        (u) => u.email === customerEmail
      );

      if (existing) {
        userId = existing.id;
      } else {
        // Create a new user — they'll get a confirmation/magic-link email
        const { data: newUser, error: createErr } =
          await supabase.auth.admin.createUser({
            email: customerEmail,
            email_confirm: true, // auto-confirm since they just paid
            user_metadata: {
              tier: tierId,
              stripe_customer_id: stripeCustomerId,
            },
          });

        if (createErr || !newUser?.user) {
          console.error("Failed to create user:", createErr);
          break;
        }
        userId = newUser.user.id;
      }

      // 2. Calculate expiration
      const now = new Date();
      const expiresAt = new Date(now);
      if (billingCycle === "annual") {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      } else {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      }

      // 3. Upsert the membership
      const { error: memberErr } = await supabase
        .from("user_memberships")
        .upsert(
          {
            user_id: userId,
            tier_id: tierId,
            status: "active",
            billing_cycle: billingCycle,
            started_at: now.toISOString(),
            expires_at: expiresAt.toISOString(),
            updated_at: now.toISOString(),
          },
          { onConflict: "user_id" }
        );

      if (memberErr) {
        console.error("Failed to upsert membership:", memberErr);
      } else {
        console.log(`Membership created: ${userId} → ${tierId}`);
      }

      // 4. Create/update profile with tier info
      await supabase.from("profiles").upsert(
        {
          id: userId,
          membership_tier: tierId,
          stripe_customer_id: stripeCustomerId,
          updated_at: now.toISOString(),
        },
        { onConflict: "id" }
      );

      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const tierId = subscription.metadata?.tier_id;
      const stripeCustomerId = subscription.customer as string;
      const status = subscription.status;

      console.log(
        `Subscription updated: ${stripeCustomerId} → status: ${status}`
      );

      // Map Stripe status to our status
      let ourStatus = "active";
      if (status === "canceled" || status === "unpaid") ourStatus = "cancelled";
      if (status === "past_due") ourStatus = "paused";
      if (status === "incomplete_expired") ourStatus = "expired";

      // Find user by stripe_customer_id in profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", stripeCustomerId)
        .single();

      if (profile) {
        await supabase
          .from("user_memberships")
          .update({
            status: ourStatus,
            tier_id: tierId || undefined,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", profile.id);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const stripeCustomerId = subscription.customer as string;

      console.log(`Subscription cancelled: ${stripeCustomerId}`);

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", stripeCustomerId)
        .single();

      if (profile) {
        await supabase
          .from("user_memberships")
          .update({
            status: "cancelled",
            cancelled_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", profile.id);
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
