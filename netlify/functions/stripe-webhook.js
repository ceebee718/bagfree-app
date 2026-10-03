// netlify/functions/stripe-webhook.js
//
// Listens for Stripe webhook events. When a Checkout session completes
// successfully, this function notifies the BagFree owner via Formspree
// with all the reservation details.
//
// REQUIRED ENV VARS:
//   STRIPE_SECRET_KEY       — your Stripe secret key
//   STRIPE_WEBHOOK_SECRET   — from Stripe Dashboard → Developers → Webhooks → signing secret
//
// OPTIONAL FOR ORDER CONFIRMATION (already used by other BagFree functions):
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//
// SETUP IN STRIPE DASHBOARD:
//   1. Developers → Webhooks → "Add endpoint"
//   2. URL: https://bagfree.app/.netlify/functions/stripe-webhook
//   3. Subscribe to event: checkout.session.completed
//   4. After creating, reveal the "Signing secret" (whsec_...) and add it
//      as STRIPE_WEBHOOK_SECRET in Netlify env vars.

const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

// Stripe signature verification requires the unparsed request body.
exports.config = { rawBody: true };

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeSecret || !webhookSecret) {
    console.error('Stripe env vars not set');
    return { statusCode: 500, body: 'Server not configured' };
  }

  const stripe = new Stripe(stripeSecret, { apiVersion: '2024-06-20' });

  // Stripe signs every webhook so we know it's really from them.
  // The raw body matters here — do NOT JSON-parse before constructEvent.
  const sig = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
  if (!sig) {
    console.error('Missing stripe-signature header');
    return { statusCode: 400, body: 'Missing signature' };
  }

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  // Only handle the events we care about
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    const md = session.metadata || {};

    // Only act if payment actually succeeded
    if (session.payment_status !== 'paid') {
      console.log('Session completed but not paid:', session.id, session.payment_status);
      return { statusCode: 200, body: JSON.stringify({ received: true, skipped: 'not_paid' }) };
    }

    // Durable BagFree work happens before the owner notification.
    // If Supabase is configured and a database/RPC call fails, return 500 so
    // Stripe retries. Reward writes use the session id as an idempotency key.
    const processing = await processPaidBagFreeSession(session);
    if (!processing.ok) {
      console.error('BagFree payment processing failed:', processing.error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          received: false,
          error: 'BagFree payment processing failed',
        }),
      };
    }

    // Format amount nicely
    const amount = `$${(session.amount_total / 100).toFixed(2)} ${(session.currency || 'usd').toUpperCase()}`;

    // Send the owner a notification via Formspree
    const formspreeUrl = 'https://formspree.io/f/mvzvwrkp';
    const notification = {
      _subject: `💰 PAID — BagFree reservation in ${md.city || '?'} (${amount})`,
      type: 'paid_reservation',
      stripe_session_id: session.id,
      payment_status: session.payment_status,
      amount_total: amount,
      customer_email: session.customer_email || md.customer_email || '(unknown)',
      city: md.city || '',
      arrival: md.arrival || '',
      departure: md.departure || '',
      hotel: md.hotel || '',
      bundles_summary: md.bundles_summary || '',
      stripe_dashboard_url: `https://dashboard.stripe.com/${stripeEvent.livemode ? '' : 'test/'}payments/${session.payment_intent}`,
      submitted_at: new Date().toISOString()
    };

    try {
      const fetchFn = (typeof fetch !== 'undefined') ? fetch : (await import('node-fetch')).default;
      await fetchFn(formspreeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(notification)
      });
    } catch (err) {
      // Don't fail the webhook — Stripe will retry on non-2xx responses,
      // and we don't want to be retried just because Formspree had a hiccup.
      // The payment IS recorded in Stripe regardless.
      console.error('Formspree notification failed (payment still recorded in Stripe):', err.message);
    }
  } else {
    console.log('Ignoring event type:', stripeEvent.type);
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};

async function processPaidBagFreeSession(session) {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.BAGFREE_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.BAGFREE_SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.warn(
      'Supabase admin env vars not configured — skipping order/reward sync'
    );
    return { ok: true, skipped: 'supabase_not_configured' };
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const { data: order, error: orderLookupError } = await admin
    .from('orders')
    .select('id,user_id')
    .eq('stripe_session_id', session.id)
    .maybeSingle();

  if (orderLookupError) {
    return {
      ok: false,
      error: `order_lookup_failed: ${orderLookupError.message}`,
    };
  }
  let orderConfirmed = false;
  if (order?.id) {
    const paidDollars = Number(session.amount_total || 0) / 100;
    const { error: confirmError } = await admin
      .from('orders')
      .update({
        status: 'confirmed',
        subtotal: paidDollars,
        total: paidDollars,
      })
      .eq('id', order.id);

    if (confirmError) {
      return {
        ok: false,
        error: `order_confirm_failed: ${confirmError.message}`,
      };
    }
    orderConfirmed = true;
  }

  let userId = order?.user_id || null;
  const email =
    session.customer_details?.email ||
    session.customer_email ||
    session.metadata?.customer_email ||
    null;

  if (!userId && email) {
    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    if (profileError) {
      console.warn('Profile lookup for rewards failed:', profileError);
    } else {
      userId = profile?.id || null;
    }
  }

  if (!userId) {
    return {
      ok: true,
      orderConfirmed,
      pointsCredited: 0,
      rewardSkipped: 'no_matching_user',
    };
  }

  let earnRate = 5;
  const { data: rule, error: ruleError } = await admin
    .from('bag_rules')
    .select('value')
    .eq('key', 'earn_rate_per_dollar')
    .maybeSingle();

  if (ruleError) {
    console.warn(
      'Could not load BAG earn rate; using default 5:',
      ruleError
    );
  } else if (rule?.value != null) {
    const parsedRate = Number(rule.value);
    if (Number.isFinite(parsedRate) && parsedRate >= 0) {
      earnRate = parsedRate;
    }
  }

  const dollars = Number(session.amount_total || 0) / 100;
  const points = Math.floor(dollars * earnRate);

  if (points <= 0) {
    return { ok: true, orderConfirmed, pointsCredited: 0 };
  }

  const { data: result, error: rewardError } = await admin.rpc(
    'award_points',
    {
      p_user_id: userId,
      p_amount: points,
      p_reason: 'purchase',
      p_source_ref: `stripe_session:${session.id}`,
      p_idempotency_key: `stripe:${session.id}:purchase`,
      p_metadata: {
        stripe_session_id: session.id,
        amount_total_cents: session.amount_total,
        currency: session.currency,
        email,
      },
    }
  );
  if (rewardError) {
    return {
      ok: false,
      error: `reward_credit_failed: ${rewardError.message}`,
    };
  }

  return {
    ok: true,
    orderConfirmed,
    pointsCredited: points,
    newBalance: result?.[0]?.new_balance,
    duplicateReward: Boolean(result?.[0]?.was_duplicate),
  };
}
