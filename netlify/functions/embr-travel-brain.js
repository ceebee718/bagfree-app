exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');

    const history = Array.isArray(body.history)
      ? body.history
      : Array.isArray(body.messages)
        ? body.messages
        : [];

    const lastUserMessage =
      [...history].reverse().find((m) => m && (m.role === 'user' || m.role === 'human'))?.content ||
      [...history].reverse().find((m) => m && (m.role === 'user' || m.role === 'human'))?.text ||
      '';

    const userMessage = String(
      body.userMessage ||
      body.message ||
      body.input ||
      lastUserMessage ||
      ''
    ).trim();

    const systemPrompt = String(body.systemPrompt || body.system || '').trim();

    if (!userMessage) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing userMessage',
          detail: 'Expected userMessage, message, input, or a user message in messages/history.'
        })
      };
    }

    const baseUrl = process.env.EMBR_API_BASE_URL || 'https://api.embrintelligence.ai';
    const appId = process.env.EMBR_APP_ID || 'bagfree';
    const apiKey = process.env.EMBR_API_KEY || '';

    const embrRes = await fetch(`${baseUrl}/app-intelligence/respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        'x-embr-app-id': appId,
        ...(apiKey ? { 'x-embr-app-key': apiKey } : {})
      },
      body: JSON.stringify({
        appId,
        message: userMessage,
        userMessage,
        messages: history,
        systemPrompt,
        environment: 'production',
        domain: 'travel',
        feature: 'bagfree_travel_brain',
        context: {
          app: 'BagFree',
          product: 'Travel Brain',
          travelerProfile: body.profile || {},
          activeTrip: body.activeTrip || {},
          instruction:
            'Act as BagFree Travel Brain: a refined travel concierge that connects trip intent to itinerary ideas, packing intelligence, hotel delivery, and BagFree kit recommendations.'
        }
      })
    });

    const data = await embrRes.json().catch(() => ({}));

    if (!embrRes.ok) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Travel Brain temporarily unavailable',
          detail: data?.error || data?.message || `Embr API error ${embrRes.status}`,
          embrStatus: embrRes.status,
          embr: data
        })
      };
    }

    const text = (
      data.text ||
      data.reply ||
      data.response ||
      data.message ||
      data.answer ||
      data.output ||
      data.content?.[0]?.text ||
      data.data?.text ||
      ''
    ).trim();

    const finalText = text || 'I had trouble generating your itinerary. Please try again.';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        text: finalText,
        reply: finalText,
        message: finalText,
        content: finalText,
        source: 'embr'
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Travel Brain temporarily unavailable',
        detail: err.message
      })
    };
  }
};
