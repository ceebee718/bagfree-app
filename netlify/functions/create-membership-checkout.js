// netlify/functions/create-membership-checkout.js
// Creates a Stripe Checkout Session for BagFree membership subscriptions

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { priceId, email, tier, billing } = JSON.parse(event.body || '{}');

    if (!priceId) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing priceId' }) };
    }

    const sessionParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: 'https://bagfree.app/dashboard.html?membership=success&tier=' + (tier || ''),
      cancel_url: 'https://bagfree.app/membership.html?canceled=true',
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata: {
        tier: tier || '',
        billing: billing || '',
        source: 'bagfree-membership-page',
      },
    };

    // Pre-fill email if provided
    if (email) {
      sessionParams.customer_email = email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url, sessionId: session.id }),
    };
  } catch (err) {
    console.error('Stripe checkout error:', err.message);
    return {
      statusCode: err.statusCode || 500,
      headers,
      body: JSON.stringify({ error: err.message || 'Failed to create checkout session' }),
    };
  }
};
