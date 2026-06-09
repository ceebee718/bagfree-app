// ============================================================
// BagFree — Stripe Checkout (Supabase Edge Function)
//
// Deploy:
//   supabase functions deploy stripe-checkout --no-verify-jwt
//
// Secrets needed:
//   supabase secrets set STRIPE_SECRET_KEY=sk_live_xxxxx
//   supabase secrets set SITE_URL=https://bagfree.app
//
// How it works:
//   1. Frontend sends { tier_id: 'gold', billing_cycle: 'monthly' }
//   2. This function looks up the Stripe Price ID from membership_tiers
//   3. Creates a Stripe Checkout Session
//   4. Returns the session URL for redirect
// ============================================================

import Stripe from "https://esm.sh/stripe@16.2.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
const SITE_URL = Deno.env.get("SITE_URL") || "https://bagfree.app";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const { tier_id, billing_cycle = "monthly" } = await req.json();

    if (!tier_id || !["gold", "emerald", "platinum"].includes(tier_id)) {
      return json({ error: "Invalid tier_id" }, 400);
    }
    if (!["monthly", "annual"].includes(billing_cycle)) {
      return json({ error: "Invalid billing_cycle" }, 400);
    }

    // Look up the Stripe Price ID from the membership_tiers table
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const priceColumn =
      billing_cycle === "annual"
        ? "stripe_price_id_annual"
        : "stripe_price_id_monthly";

    const { data: tier, error: tierError } = await supabase
      .from("membership_tiers")
      .select(`id, name, ${priceColumn}`)
      .eq("id", tier_id)
      .single();

    if (tierError || !tier) {
      return json({ error: "Tier not found" }, 404);
    }

    const priceId = tier[priceColumn];
    if (!priceId) {
      return json(
        { error: `Stripe Price ID not set for ${tier.name} (${billing_cycle}). Add it to the membership_tiers table.` },
        500
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${SITE_URL}/membership.html?success=true&tier=${tier_id}`,
      cancel_url: `${SITE_URL}/membership.html?cancelled=true`,
      metadata: {
        tier_id: tier_id,
        billing_cycle: billing_cycle,
      },
      subscription_data: {
        metadata: {
          tier_id: tier_id,
          billing_cycle: billing_cycle,
        },
      },
      // Collect email so we can create their account after payment
      customer_creation: "always",
      allow_promotion_codes: true,
    });

    return json({ url: session.url, session_id: session.id }, 200);
  } catch (err) {
    console.error("Checkout error:", err);
    return json({ error: String((err as Error)?.message || err) }, 500);
  }
});
