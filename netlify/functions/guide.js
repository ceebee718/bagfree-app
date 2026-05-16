// netlify/functions/guide.js
//
// Powers The Nuor Edit city guide.
// Receives { city, category, desc } from the frontend,
// calls Claude, returns { items: [...] } as JSON.
//
// Required Netlify env var: ANTHROPIC_API_KEY

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

  let city, category, desc;
  try {
    ({ city, category, desc } = JSON.parse(event.body));
    if (!city || !category) throw new Error('Missing fields');
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Guide not configured' }) };
  }

  const systemPrompt = `You are a luxury travel curator for The Nuor Edit — a curated wardrobe rental and city guide platform. You provide editorial, insider-quality recommendations: the kind a well-connected local stylist would share, not generic tourist lists. Be specific, evocative, and genuinely useful. Respond ONLY with valid JSON — no markdown, no preamble, no trailing text.`;

  const userPrompt = `City: ${city}
Category: ${category}
Context: ${desc || category}

Provide exactly 5 curated recommendations. Use this exact JSON structure:
{
  "items": [
    {
      "name": "Venue or experience name",
      "description": "One evocative sentence — what makes it worth going",
      "insider": "One genuine insider tip (best seat, best time, what to order, what to avoid, or something most visitors miss)"
    }
  ]
}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic API error:', err);
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'Guide unavailable' }) };
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    // Strip any accidental markdown fences before parsing
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(parsed),
    };
  } catch (err) {
    console.error('Guide function error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Guide unavailable', detail: err.message }),
    };
  }
};
