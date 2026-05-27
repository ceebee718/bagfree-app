// netlify/functions/bag-credit-on-payment.js
//
// Stripe webhook handler — credits BAG points on completed checkouts.
//
// Setup:
//   1. Deploy this function
//   2. In Stripe Dashboard → Developers → Webhooks → Add endpoint:
//      URL:    https://bagfree.app/.netlify/functions/bag-credit-on-payment
//      Events: checkout.session.completed
//      Copy the "Signing secret" (whsec_...)
//   3. In Netlify env vars, add:
//      STRIPE_WEBHOOK_SECRET     = whsec_... (from step 2)
//      SUPABASE_URL              = https://<your-project>.supabase.co
//      SUPABASE_SERVICE_ROLE_KEY = <from Supabase: Project Settings → API → service_role>
//   4. You already have STRIPE_SECRET_KEY set
//
// Important: the SERVICE_ROLE key bypasses RLS. Never expose it to the client.

const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

// Tell Netlify not to parse the body — Stripe needs the raw body for signature
// verification. (Netlify passes the raw string in event.body.)
exports.config = { rawBody: true };

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!whSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured');
    return { statusCode: 500, body: 'Server misconfigured' };
  }

  // Verify the signature — proves the request really came from Stripe.
  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, whSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  // We only care about completed checkout sessions for now.
  if (stripeEvent.type !== 'checkout.session.completed') {
    return { statusCode: 200, body: 'Ignored' };
  }

  const session = stripeEvent.data.object;

  // Only credit points for paid sessions.
  if (session.payment_status !== 'paid') {
    return { statusCode: 200, body: 'Session not paid, skipping' };
  }

  // Find the user. We need their Supabase user_id to credit points.
  // The cleanest way: when you create the Checkout Session, pass the user's
  // Supabase ID via metadata.user_id. Until that's wired up, we fall back to
  // matching the customer_email to a profile.
  const email = session.customer_details?.email || session.customer_email;
  const userIdFromMetadata = session.metadata?.user_id;

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );

  let userId = userIdFromMetadata || null;
  if (!userId && email) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    if (error) {
      console.error('Profile lookup error:', error);
    }
    userId = profile?.id || null;
  }

  if (!userId) {
    // Guest checkout — no account to credit. Not an error, just nothing to do.
    // (You may want to log this for marketing follow-up: "create an account
    // to claim the points you would have earned.")
    console.log(`No user found for session ${session.id}, email=${email}. Skipping.`);
    return { statusCode: 200, body: 'No matching user' };
  }

  // Read the current earn rate from bag_rules.
  const { data: rule } = await supabase
    .from('bag_rules')
    .select('value')
    .eq('key', 'earn_rate_per_dollar')
    .single();
  const earnRate = Number(rule?.value ?? 5);

  // Stripe amounts are in cents. Convert to dollars, then multiply by earn rate.
  // Floor instead of round so we never over-credit (e.g., $9.99 → 49 points, not 50).
  const dollars = (session.amount_total || 0) / 100;
  const points = Math.floor(dollars * earnRate);

  if (points <= 0) {
    return { statusCode: 200, body: 'Nothing to credit' };
  }

  // Award via the RPC. Idempotency key uses the Stripe session id so retries
  // (Stripe will retry up to 3 days on non-2xx responses) cannot double-credit.
  const { data: result, error: rpcError } = await supabase.rpc('award_points', {
    p_user_id: userId,
    p_amount: points,
    p_reason: 'purchase',
    p_source_ref: `stripe_session:${session.id}`,
    p_idempotency_key: `stripe:${session.id}:purchase`,
    p_metadata: {
      stripe_session_id: session.id,
      amount_total_cents: session.amount_total,
      currency: session.currency,
      email: email,
    },
  });

  if (rpcError) {
    console.error('award_points failed:', rpcError);
    // Return 500 so Stripe retries. The idempotency_key means the retry won't
    // double-credit even if the first call actually succeeded.
    return { statusCode: 500, body: 'Internal error' };
  }

  console.log('Credited', points, 'points to', userId,
    '— new balance:', result?.[0]?.new_balance,
    result?.[0]?.was_duplicate ? '(duplicate webhook, no-op)' : '');

  return {
    statusCode: 200,
    body: JSON.stringify({
      credited: points,
      new_balance: result?.[0]?.new_balance,
      duplicate: result?.[0]?.was_duplicate,
    }),
  };
};
