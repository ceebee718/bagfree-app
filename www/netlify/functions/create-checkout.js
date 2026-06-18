const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { items } = JSON.parse(event.body);

    const line_items = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.desc || '',
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${event.headers.origin}/#shop?success=true`,
      cancel_url: `${event.headers.origin}/#shop`,
      shipping_address_collection: { allowed_countries: ['US'] },
      custom_fields: [
        {
          key: 'hotel_name',
          label: { type: 'custom', custom: 'Hotel name' },
          type: 'text',
        },
        {
          key: 'room_number',
          label: { type: 'custom', custom: 'Room number' },
          type: 'text',
        },
      ],
      metadata: {
        source: 'bagfree-app',
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error('Stripe error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
