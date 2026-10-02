// netlify/functions/create-checkout.js
//
// Creates a Stripe Checkout session for a BagFree arrival reservation.
// Product identity and pricing are resolved server-side from bagfree-catalog.js.
// Client-supplied title/price/image values are intentionally ignored.
//
// REQUIRED ENV VAR:
//   STRIPE_SECRET_KEY

const Stripe = require('stripe');
const { BAGFREE_CATALOG } = require('./bagfree-catalog');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders(), body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    console.error('STRIPE_SECRET_KEY env var is not set');
    return json(500, { error: 'Stripe is not configured on the server' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (_) {
    return json(400, { error: 'Invalid JSON' });
  }

  const {
    city,
    arrival,
    departure,
    hotel,
    email,
    guest_name: guestName,
    phone,
    bundles,
  } = payload;

  if (
    !email ||
    !hotel ||
    !city ||
    !arrival ||
    !departure ||
    !Array.isArray(bundles) ||
    bundles.length === 0
  ) {
    return json(400, {
      error:
        'Missing required fields. Need email, hotel, city, arrival, departure, and at least 1 bundle.',
    });
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email))) {
    return json(400, { error: 'Invalid email address' });
  }

  if (bundles.length > 20) {
    return json(400, { error: 'Too many line items' });
  }

  let canonicalBundles;
  try {
    canonicalBundles = bundles.map(canonicalizeBundle);
  } catch (err) {
    return json(400, { error: err.message || 'Invalid bundle' });
  }

  const lineItems = canonicalBundles.map(({ id, qty, size, product }) => {
    const productData = {
      name: product.title,
      metadata: {
        bundle_id: id,
        ...(size ? { size } : {}),
      },
    };

    if (product.image) {
      productData.images = [product.image];
    }

    return {
      price_data: {
        currency: 'usd',
        product_data: productData,
        unit_amount: product.unitAmount,
      },
      quantity: qty,
    };
  });

  const stripe = new Stripe(stripeSecret, { apiVersion: '2024-06-20' });
  const baseUrl =
    process.env.URL || `https://${event.headers.host || 'bagfree.app'}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: String(email).slice(0, 320),
      success_url: `${baseUrl}/thank-you.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/departure-lounge-landing.html`,
      metadata: {
        city: String(city).slice(0, 200),
        arrival: String(arrival).slice(0, 50),
        departure: String(departure).slice(0, 50),
        hotel: String(hotel).slice(0, 500),
        customer_email: String(email).slice(0, 320),
        guest_name: String(guestName || '').slice(0, 200),
        phone: String(phone || '').slice(0, 100),
        bundles_summary: canonicalBundles
          .map(({ qty, size, product }) => {
            const sizeText = size ? ` — Size ${size}` : '';
            return `${qty}× ${product.title}${sizeText} ($${(
              product.unitAmount / 100
            ).toFixed(2)})`;
          })
          .join(' | ')
          .slice(0, 500),
      },
      payment_intent_data: {
        description: `BagFree — ${String(city).slice(
          0,
          100
        )}, arriving ${String(arrival).slice(0, 30)}`,
        statement_descriptor_suffix: 'BAGFREE',
        metadata: {
          city: String(city).slice(0, 200),
          arrival: String(arrival).slice(0, 50),
          departure: String(departure).slice(0, 50),
          hotel: String(hotel).slice(0, 500),
        },
      },
      allow_promotion_codes: false,
      automatic_tax: { enabled: false },
    });

    return json(200, { url: session.url, id: session.id });
  } catch (err) {
    console.error('Stripe checkout creation failed:', err);
    return json(500, {
      error: 'Failed to create checkout session',
      detail: err.message || String(err),
    });
  }
};

function canonicalizeBundle(input) {
  const id = String(input?.id || '');
  const product = BAGFREE_CATALOG[id];
  if (!product) {
    throw new Error(`Unknown bundle: ${id || '(missing id)'}`);
  }

  const qtyRaw = Number(input?.qty);
  const qty = Math.max(
    1,
    Math.min(Number.isFinite(qtyRaw) ? Math.floor(qtyRaw) : 1, 10)
  );

  const size = String(input?.size || '').trim().slice(0, 20);

  return { id, qty, size, product };
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      ...corsHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
