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
    data?.content?.[0]?.text ||
    data?.output ||
    ''
  );
}

async function callEmbr(body) {
  const baseUrl = process.env.EMBR_API_BASE_URL || 'https://api.embrintelligence.ai';
  const appId = process.env.EMBR_APP_ID || 'bagfree';
  const apiKey = process.env.EMBR_API_KEY;

  if (!apiKey) {
    throw new Error('EMBR_API_KEY not configured');
  }

  const response = await fetch(`${baseUrl}/app-intelligence/respond`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
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
    text,
    source: 'embr',
    raw: data,
  };
}

async function callClaudeFallback(body) {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!anthropicKey) {
    throw new Error('ANTHROPIC_API_KEY not configured for fallback');
  }

  const fullPrompt = `${body.systemPrompt || ''}

User conversation:
${(body.history || []).map((m) => `${m.role}: ${m.content}`).join('\n')}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: body.model || 'claude-sonnet-4-20250514',
      max_tokens: body.max_tokens || 2000,
      messages: [{ role: 'user', content: fullPrompt }],
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.error?.message || `Claude fallback error ${response.status}`);
  }

  const text = normalizeText(data);

  if (!text) {
    throw new Error('Claude fallback returned no response text');
  }

  return {
    text,
    source: 'claude_fallback',
    raw: data,
  };
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

  try {
    const embrResult = await callEmbr(body);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(embrResult),
    };
  } catch (embrError) {
    console.error('Embr Travel Brain error:', embrError.message);

    try {
      const fallbackResult = await callClaudeFallback(body);

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          ...fallbackResult,
          embrError: embrError.message,
        }),
      };
    } catch (fallbackError) {
      console.error('Travel Brain fallback error:', fallbackError.message);

      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Travel Brain unavailable',
          detail: fallbackError.message,
          embrError: embrError.message,
        }),
      };
    }
  }
};
