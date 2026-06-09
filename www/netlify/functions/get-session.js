// netlify/functions/get-session.js
//
// Fetches a Stripe Checkout Session by ID and returns a sanitized payload
// for the thank-you page. Used as a fallback when localStorage is empty
// (different device, cleared storage, shared link, refresh after delay).
//
// Required env var:
//   STRIPE_SECRET_KEY   - same key used by create-checkout.js
//
// Called via: GET /.netlify/functions/get-session?session_id=cs_xxx

const Stripe = require('stripe');

exports.handler = async (event) => {
  // Allow GET (simpler) and OPTIONS (for any CORS preflight if you ever
  // call this from a different origin)
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders(), body: '' };
  }
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const sessionId =
    (event.queryStringParameters && event.queryStringParameters.session_id) || '';

  // Basic validation — Stripe session IDs start with 'cs_'
  if (!sessionId || !/^cs_[a-zA-Z0-9_]+$/.test(sessionId)) {
    return {
      statusCode: 400,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Invalid or missing session_id' }),
    };
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    // Expand line_items so we get product names + amounts in one round-trip.
    // We also expand the product on each line item for the image (which we
    // attached via product_data.images when we created the session).
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price.product'],
    });

    // Only reveal paid sessions. An unpaid/expired session means either
    // the user navigated here too early or someone's poking at the URL.
    if (session.payment_status !== 'paid') {
      return {
        statusCode: 200,
        headers: corsHeaders(),
        body: JSON.stringify({
          paid: false,
          payment_status: session.payment_status,
        }),
      };
    }

    // Build a shape that matches what the thank-you page already expects
    // from localStorage. This keeps the frontend rendering code identical
    // whether the data comes from localStorage or from Stripe.
    const md = session.metadata || {};
    const bundles = (session.line_items?.data || []).map((li) => {
      const product = li.price && typeof li.price.product === 'object' ? li.price.product : null;
      return {
        name: li.description || (product && product.name) || 'Bundle',
        title: li.description || (product && product.name) || 'Bundle',
        qty: li.quantity || 1,
        price: (li.price && li.price.unit_amount != null) ? li.price.unit_amount / 100 : 0,
        image: (product && product.images && product.images[0]) || null,
      };
    });

    const total =
      session.amount_total != null ? session.amount_total / 100 : null;

    const shipping =
      session.shipping_details || session.customer_details?.address
        ? {
            name: session.shipping_details?.name || session.customer_details?.name || null,
            address: session.shipping_details?.address || session.customer_details?.address || null,
          }
        : null;

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        paid: true,
        email: session.customer_details?.email || session.customer_email || null,
        city: md.city || null,
        hotel: md.hotel || null,
        arrival: md.arrival || null,
        departure: md.departure || null,
        bundles,
        total,
        shipping,
      }),
    };
  } catch (err) {
    console.error('get-session error:', err);
    // Stripe returns 404-ish errors as type 'StripeInvalidRequestError'
    const isNotFound = err && (err.statusCode === 404 || err.code === 'resource_missing');
    return {
      statusCode: isNotFound ? 404 : 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        error: isNotFound ? 'Session not found' : (err.message || 'Stripe error'),
      }),
    };
  }
};

function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    // Locked down to same-origin in practice — Netlify serves the function
    // from the same domain as the page. Loosen if you call cross-origin.
    'Cache-Control': 'no-store',
  };
}
