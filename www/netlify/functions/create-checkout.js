// netlify/functions/create-checkout.js
//
// Creates a Stripe Checkout session for a BagFree arrival reservation.
// Called by departure-lounge-landing.html when the user clicks "Reserve my arrival".
//
// REQUIRED ENV VARS (set in Netlify → Site Settings → Environment Variables):
//   STRIPE_SECRET_KEY  — your Stripe secret key (sk_test_... in test mode, sk_live_... when live)
//
// Returns: { url, id } where url is the Stripe-hosted Checkout page to redirect to.
// On error: { error, detail } with appropriate status code.

const Stripe = require('stripe');

exports.handler = async (event) => {
  // CORS preflight + method guard
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders(), body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders(), body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    console.error('STRIPE_SECRET_KEY env var is not set');
    return { statusCode: 500, headers: corsHeaders(), body: JSON.stringify({ error: 'Stripe is not configured on the server' }) };
  }

  // Parse payload
  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { city, arrival, departure, hotel, email, bundles } = payload;

  // Validate required fields
  if (!email || !hotel || !city || !arrival || !departure || !Array.isArray(bundles) || bundles.length === 0) {
    return {
      statusCode: 400,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Missing required fields. Need email, hotel, city, arrival, departure, and at least 1 bundle.' })
    };
  }

  // Validate email format
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ error: 'Invalid email address' }) };
  }

  const stripe = new Stripe(stripeSecret, { apiVersion: '2024-06-20' });

  // Build Stripe line items from the cart
  const line_items = bundles.map((b) => {
    const unitAmount = Math.round(Number(b.price) * 100); // dollars → cents
    if (!Number.isFinite(unitAmount) || unitAmount <= 0) {
      throw new Error(`Invalid bundle price for: ${b.title}`);
    }
    const product_data = {
      name: b.title,
      metadata: { bundle_id: String(b.id || '') }
    };
    // Stripe requires images to be publicly accessible HTTPS URLs
    if (b.image && /^https:\/\//.test(b.image)) {
      product_data.images = [b.image];
    }
    return {
      price_data: {
        currency: 'usd',
        product_data,
        unit_amount: unitAmount
      },
      quantity: Math.max(1, Math.min(Number(b.qty) || 1, 99))
    };
  });

  // Build redirect URLs from the request origin
  const baseUrl = process.env.URL || `https://${event.headers.host || 'bagfree.app'}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      customer_email: email,
      success_url: `${baseUrl}/thank-you.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/departure-lounge-landing.html`,
      // Metadata travels with the session and is on the webhook payload
      metadata: {
        city,
        arrival,
        departure,
        hotel: String(hotel).slice(0, 500),
        customer_email: email,
        // Compact summary string (Stripe limits metadata values to 500 chars)
        bundles_summary: bundles
          .map((b) => `${b.qty || 1}× ${b.title} ($${Number(b.price).toFixed(2)})`)
          .join(' | ')
          .slice(0, 500)
      },
      // What appears on the customer's card statement
      payment_intent_data: {
        description: `BagFree — ${city}, arriving ${arrival}`,
        statement_descriptor_suffix: 'BAGFREE',
        metadata: { city, arrival, departure, hotel: String(hotel).slice(0, 500) }
      },
      // Stripe will email the customer a receipt automatically
      // (no extra config needed; receipts are on by default for paid sessions)
      allow_promotion_codes: false,
      // Auto-collect tax if you enable Stripe Tax later. Off by default.
      automatic_tax: { enabled: false }
    });

    return {
      statusCode: 200,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url, id: session.id })
    };
  } catch (err) {
    console.error('Stripe checkout creation failed:', err);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        error: 'Failed to create checkout session',
        detail: err.message || String(err)
      })
    };
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}
