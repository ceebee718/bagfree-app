const test = require('node:test');
const assert = require('node:assert/strict');

const { handler } = require('../netlify/functions/embr-travel-brain');

test('Travel Brain proxy forwards a valid anonymous subject id to Embr', async () => {
  const calls = [];
  const originalFetch = global.fetch;
  process.env.EMBR_API_BASE_URL = 'https://api.example.test';
  process.env.EMBR_APP_ID = 'bagfree';
  process.env.EMBR_API_KEY = 'test-key';

  global.fetch = async (url, options) => {
    calls.push({ url, options, body: JSON.parse(options.body) });
    return {
      ok: true,
      status: 200,
      json: async () => ({ content: 'Best move: travel lighter.' }),
    };
  };

  try {
    const response = await handler({
      httpMethod: 'POST',
      body: JSON.stringify({
        userMessage: 'Help me pack',
        history: [],
        anonymousSubjectId: '550e8400-e29b-41d4-a716-446655440000',
      }),
    });

    assert.equal(response.statusCode, 200);
    assert.equal(calls.length, 1);
    assert.equal(
      calls[0].body.anonymousSubjectId,
      '550e8400-e29b-41d4-a716-446655440000'
    );
    assert.equal(calls[0].body.appId, 'bagfree');
    assert.equal(calls[0].body.environment, 'production');
  } finally {
    global.fetch = originalFetch;
  }
});

test('Travel Brain proxy drops invalid anonymous subject values', async () => {
  let forwarded;
  const originalFetch = global.fetch;

  global.fetch = async (_url, options) => {
    forwarded = JSON.parse(options.body);
    return {
      ok: true,
      status: 200,
      json: async () => ({ content: 'Next step: keep it light.' }),
    };
  };

  try {
    const response = await handler({
      httpMethod: 'POST',
      body: JSON.stringify({
        userMessage: 'Hello',
        history: [],
        anonymousSubjectId: 'private@example.com',
      }),
    });

    assert.equal(response.statusCode, 200);
    assert.equal(Object.hasOwn(forwarded, 'anonymousSubjectId'), false);
  } finally {
    global.fetch = originalFetch;
  }
});
