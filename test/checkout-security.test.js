const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const repoRoot = path.resolve(__dirname, '..');
const checkoutPath = path.join(
  repoRoot,
  'netlify/functions/create-checkout.js'
);
const webhookPath = path.join(
  repoRoot,
  'netlify/functions/stripe-webhook.js'
);

function loadWithMocks(modulePath, mocks) {
  const originalLoad = Module._load;
  delete require.cache[require.resolve(modulePath)];

  Module._load = function (request, parent, isMain) {
    if (Object.prototype.hasOwnProperty.call(mocks, request)) {
      return mocks[request];
    }
    return originalLoad.call(this, request, parent, isMain);
  };

  try {
    return require(modulePath);
  } finally {
    Module._load = originalLoad;
  }
}

function baseCheckoutPayload(bundle) {
  return {
    city: 'Savannah',
    arrival: '2026-10-10',
    departure: '2026-10-13',
    hotel: 'The Alida',
    email: 'traveler@example.com',
    bundles: [bundle],
  };
}

test('checkout ignores client-supplied prices and titles', async () => {
  let capturedSessionParams;
  class FakeStripe {
    constructor() {
      this.checkout = {
        sessions: {
          create: async (params) => {
            capturedSessionParams = params;
            return { url: 'https://checkout.test/session', id: 'cs_test_1' };
          },
        },
      };
    }
  }

  process.env.STRIPE_SECRET_KEY = 'sk_test_fake';
  const { handler } = loadWithMocks(checkoutPath, { stripe: FakeStripe });

  const event = {
    httpMethod: 'POST',
    headers: { host: 'bagfree.app' },
    body: JSON.stringify(
      baseCheckoutPayload({
        id: 'mens-basic',
        qty: 2,
        size: 'M',
        price: 0.01,
        title: 'Tampered title',
      })
    ),
  };

  const response = await handler(event);
  assert.equal(response.statusCode, 200);
  assert.ok(capturedSessionParams);

  const line = capturedSessionParams.line_items[0];
  assert.equal(line.quantity, 2);
  assert.equal(line.price_data.unit_amount, 4500);
  assert.equal(
    line.price_data.product_data.name,
    "Men's Basic Emergency Travel Kit"
  );
  assert.equal(line.price_data.product_data.metadata.bundle_id, 'mens-basic');
  assert.equal(line.price_data.product_data.metadata.size, 'M');
});

test('checkout rejects unknown product ids before Stripe', async () => {
  let stripeCalled = false;
  class FakeStripe {
    constructor() {
      this.checkout = {
        sessions: {
          create: async () => {
            stripeCalled = true;
            return { url: 'should-not-happen', id: 'nope' };
          },
        },
      };
    }
  }

  process.env.STRIPE_SECRET_KEY = 'sk_test_fake';
  const { handler } = loadWithMocks(checkoutPath, { stripe: FakeStripe });
  const response = await handler({
    httpMethod: 'POST',
    headers: { host: 'bagfree.app' },
    body: JSON.stringify(baseCheckoutPayload({ id: 'not-a-real-product' })),
  });

  assert.equal(response.statusCode, 400);
  assert.equal(stripeCalled, false);
  assert.match(JSON.parse(response.body).error, /Unknown bundle/);
});

test('server catalog matches live web checkout ids and prices', () => {
  const { BAGFREE_CATALOG } = require(
    path.join(repoRoot, 'netlify/functions/bagfree-catalog.js')
  );
  const html = fs.readFileSync(
    path.join(repoRoot, 'departure-lounge-landing.html'),
    'utf8'
  );

  const start = html.indexOf('const BUNDLES = [');
  const end = html.indexOf('];', start) + 2;
  assert.ok(start >= 0 && end > start);

  const bundles = vm.runInNewContext(
    `${html.slice(start, end)}\nBUNDLES;`,
    {}
  );

  assert.equal(bundles.length, Object.keys(BAGFREE_CATALOG).length);
  for (const bundle of bundles) {
    const serverProduct = BAGFREE_CATALOG[bundle.id];
    assert.ok(serverProduct, `Missing server catalog item: ${bundle.id}`);
    assert.equal(
      serverProduct.unitAmount,
      Math.round(Number(bundle.price) * 100),
      `Price mismatch for ${bundle.id}`
    );
    assert.equal(serverProduct.title, bundle.title);
  }
});

test('paid Stripe webhook confirms matching pending order', async () => {
  const updateCalls = [];
  const eqCalls = [];

  class FakeStripe {
    constructor() {
      this.webhooks = {
        constructEvent: () => ({
          type: 'checkout.session.completed',
          livemode: false,
          data: {
            object: {
              id: 'cs_test_paid',
              payment_status: 'paid',
              amount_total: 4500,
              currency: 'usd',
              customer_email: 'traveler@example.com',
              payment_intent: 'pi_test_1',
              metadata: { city: 'Savannah' },
            },
          },
        }),
      };
    }
  }
  const fakeSupabase = {
    createClient: () => ({
      from: (table) => {
        assert.equal(table, 'orders');
        return {
          update: (payload) => {
            updateCalls.push(payload);
            return {
              eq: async (column, value) => {
                eqCalls.push([column, value]);
                return { error: null };
              },
            };
          },
        };
      },
    }),
  };

  process.env.STRIPE_SECRET_KEY = 'sk_test_fake';
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_fake';
  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-test';

  const originalFetch = global.fetch;
  global.fetch = async () => ({ ok: true });

  try {
    const { handler } = loadWithMocks(webhookPath, {
      stripe: FakeStripe,
      '@supabase/supabase-js': fakeSupabase,
    });
    const response = await handler({
      httpMethod: 'POST',
      headers: { 'stripe-signature': 'sig_test' },
      body: '{}',
    });

    assert.equal(response.statusCode, 200);
    assert.deepEqual(updateCalls, [{ status: 'confirmed' }]);
    assert.deepEqual(eqCalls, [['stripe_session_id', 'cs_test_paid']]);
  } finally {
    global.fetch = originalFetch;
  }
});
