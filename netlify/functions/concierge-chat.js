// netlify/functions/concierge-chat.js
//
// Server-side proxy for the BagFree Concierge Chat widget. Keeps the
// Anthropic API key off the client — the browser calls this function, and
// this function calls Claude.
//
// Env vars needed (set in Netlify dashboard → Site settings → Environment variables):
//   ANTHROPIC_API_KEY   - sk-ant-... key from console.anthropic.com
//   ANTHROPIC_MODEL      - optional, defaults to 'claude-sonnet-4-6' below
//
// Expected POST body from the frontend:
//   {
//     "system": "You are the BagFree concierge...",
//     "messages": [{ "role": "user" | "assistant", "content": "..." }, ...]
//   }
//
// Returns:
//   { "reply": "..." }   on success
//   { "error": "..." }   on failure

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

function j(statusCode, obj) {
  return { statusCode, headers: cors, body: JSON.stringify(obj) };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return j(405, { error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // This is the #1 cause of silent failures — the function runs fine but
    // has nothing to call Claude with. Surface it clearly instead of a
    // generic 500 so it's obvious in Netlify's function logs.
    console.error('[concierge-chat] ANTHROPIC_API_KEY is not set in environment variables');
    return j(500, { error: 'Server is not configured for chat yet (missing API key).' });
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return j(400, { error: 'Invalid JSON' });
  }

  const { system, messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return j(400, { error: 'messages array is required' });
  }

  // Cap history length and message size server-side too, defense in depth
  // even though the frontend already trims this.
  const trimmed = messages.slice(-18).map((m) => ({
    role: m.role === 'user' ? 'user' : 'assistant',
    content: String(m.content || '').slice(0, 4000),
  }));

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6',
        max_tokens: 400,
        system: system ? String(system).slice(0, 6000) : undefined,
        messages: trimmed,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[concierge-chat] Anthropic error:', JSON.stringify(data));
      const msg = (data && data.error && data.error.message) || 'Anthropic request failed';
      return j(502, { error: msg });
    }

    const reply = data && data.content && data.content[0] && data.content[0].text;
    if (!reply) {
      console.error('[concierge-chat] Unexpected Anthropic response shape:', JSON.stringify(data));
      return j(502, { error: 'No response from Claude' });
    }

    return j(200, { reply: reply.trim() });
  } catch (err) {
    console.error('[concierge-chat] Unhandled error:', err);
    return j(500, { error: 'Unexpected server error' });
  }
};
