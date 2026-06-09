// netlify/functions/submit-creator-application.js
//
// Receives BagFree Creator Program applications and writes them to Airtable.
// This is the points-program version — no wallet/crypto fields.
//
// Required env vars in your Netlify site settings:
//   AIRTABLE_API_KEY        — Personal Access Token with data.records:write
//   AIRTABLE_BASE_ID        — appXXXXXXXXXXXXXX
//   AIRTABLE_CREATOR_TABLE  — e.g. "Creator Applications"
//
// Set up the Airtable table with these field names (or adjust mapping below):
//   Full Name (single line text)
//   Email (email)
//   City (single line text)
//   Country (single line text)
//   Instagram (single line text)
//   TikTok (single line text)
//   YouTube (URL)
//   Other Social (single line text)
//   Follower Count (single select: under-1k, 1k-10k, 10k-50k, 50k-250k, 250k+)
//   Primary Niche (single select)
//   Why Join (long text)
//   Example Content (URL)
//   Agreed Disclosure (checkbox)
//   Agreed Terms (checkbox)
//   Submitted At (date/time)
//   Status (single select: New, Reviewing, Approved, Rejected) — default New
//   IP Address (single line text)
//   User Agent (long text)

exports.handler = async (event) => {
  // CORS / method gating
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_CREATOR_TABLE } = process.env;
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_CREATOR_TABLE) {
    console.error('Missing Airtable env vars');
    return { statusCode: 500, body: JSON.stringify({ error: 'Server not configured' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  // Required field validation — mirror what the client form requires
  const required = ['fullName', 'email', 'city', 'whyJoin'];
  for (const k of required) {
    if (!payload[k] || String(payload[k]).trim() === '') {
      return { statusCode: 400, body: JSON.stringify({ error: `Missing field: ${k}` }) };
    }
  }
  if (!payload.instagram && !payload.tiktok && !payload.youtube) {
    return { statusCode: 400, body: JSON.stringify({ error: 'At least one social profile required' }) };
  }
  if (!payload.agreedDisclosure || !payload.agreedTerms) {
    return { statusCode: 400, body: JSON.stringify({ error: 'All acknowledgments must be accepted' }) };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid email' }) };
  }

  const fields = {
    'Full Name':       payload.fullName,
    'Email':           payload.email,
    'City':            payload.city,
    'Country':         payload.country || '',
    'Instagram':       payload.instagram || '',
    'TikTok':          payload.tiktok || '',
    'YouTube':         payload.youtube || '',
    'Other Social':    payload.otherSocial || '',
    'Follower Count':  payload.followerCount || '',
    'Primary Niche':   payload.primaryNiche || '',
    'Why Join':        payload.whyJoin,
    'Example Content': payload.exampleContent || '',
    'Agreed Disclosure': !!payload.agreedDisclosure,
    'Agreed Terms':      !!payload.agreedTerms,
    'Submitted At':    payload.submittedAt || new Date().toISOString(),
    'Status':          'New',
    'IP Address':      event.headers['x-forwarded-for'] || event.headers['client-ip'] || '',
    'User Agent':      event.headers['user-agent'] || '',
  };

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_CREATOR_TABLE)}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ records: [{ fields }], typecast: true }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error('Airtable error', res.status, errText);
      return { statusCode: 502, body: JSON.stringify({ error: 'Upstream error' }) };
    }
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ ok: true }),
    };
  } catch (e) {
    console.error('Airtable fetch failed', e);
    return { statusCode: 500, body: JSON.stringify({ error: 'Submission failed' }) };
  }
};
