const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

function normalizeText(data) {
  return (
    data?.text ||
    data?.reply ||
    data?.response ||
    data?.message ||
    data?.answer ||
    data?.output ||
    data?.content?.[0]?.text ||
    data?.data?.text ||
    ''
  );
}

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Invalid JSON' }),
    };
  }

  const baseUrl = process.env.EMBR_API_BASE_URL || 'https://api.embrintelligence.ai';
  const appId = process.env.EMBR_APP_ID || 'bagfree';
  const apiKey = process.env.EMBR_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'EMBR_API_KEY not configured' }),
    };
  }

  try {
    const response = await fetch(`${baseUrl}/app-intelligence/respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'x-embr-app-id': appId,
        'x-embr-api-key': apiKey,
      },
      body: JSON.stringify({
        appId,
        domain: 'travel',
        feature: 'bagfree_travel_brain',
        userMessage: body.userMessage,
        message: body.userMessage,
        messages: body.history || [],
        systemPrompt: body.systemPrompt || '',
        context: {
          app: 'BagFree',
          product: 'Travel Brain',
          travelerProfile: body.profile || {},
          activeTrip: body.activeTrip || {},
          instruction:
            'Act as BagFree Travel Brain: a refined travel concierge that connects trip intent to itinerary ideas, packing intelligence, hotel delivery, and BagFree kit recommendations.',
        },
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data?.error || data?.message || `Embr API error ${response.status}`);
    }

    const text = normalizeText(data);

    if (!text) {
      throw new Error('Embr returned no response text');
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        text,
        source: 'embr',
      }),
    };
  } catch (err) {
    console.error('Embr Travel Brain error:', err);

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Travel Brain temporarily unavailable',
        detail: err.message,
      }),
    };
  }
};
