const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const SERVICE_PLANS = {
  secondjourney: {
    name: 'Second Journey Service Plan',
    amount: 999,
    description: 'Physical clothing rental, hotel delivery, laundry/return handling, and real-world travel services.'
  },
  emerald: {
    name: 'Emerald Travel Service Plan',
    amount: 3900,
    description: 'Expanded physical clothing rental, hotel delivery, concierge fulfillment, and real-world travel services.'
  },
  gold: {
    name: 'Gold Concierge Travel Service Plan',
    amount: 6900,
    description: 'Concierge physical travel services, clothing rental, priority delivery, laundry/return handling, and offline fulfillment.'
  }
};

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const tier = String(body.tier || '').toLowerCase();
    const email = String(body.email || '').trim();
    const plan = SERVICE_PLANS[tier];

    if (!plan) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Invalid service plan tier' })
      };
    }

    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Valid email is required' })
      };
    }

    const host = event.headers.host || 'bagfree.app';
    const baseUrl = process.env.URL || `https://${host}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: plan.amount,
            product_data: {
              name: plan.name,
              description: plan.description
            }
          },
          quantity: 1
        }
      ],
      metadata: {
        type: 'real_world_service_plan',
        tier,
        email,
        note: 'Physical/offline BagFree travel services only. No digital subscription, virtual goods, or app feature unlock.'
      },
      success_url: `${baseUrl}/membership.html?success=true&tier=${encodeURIComponent(tier)}`,
      cancel_url: `${baseUrl}/membership.html?cancelled=true&tier=${encodeURIComponent(tier)}`
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: session.url, id: session.id })
    };
  } catch (err) {
    console.error('create-service-plan-checkout failed:', err);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        error: 'Failed to create service checkout session',
        detail: err.message
      })
    };
  }
};
