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
// SETUP IN STRIPE DASHBOARD:
//   1. Developers → Webhooks → "Add endpoint"
//   2. URL: https://bagfree.app/.netlify/functions/stripe-webhook
//   3. Subscribe to event: checkout.session.completed
//   4. After creating, reveal the "Signing secret" (whsec_...) and add it
//      as STRIPE_WEBHOOK_SECRET in Netlify env vars.

const Stripe = require('stripe');

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
