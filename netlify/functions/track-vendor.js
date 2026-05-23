// netlify/functions/track-vendor.js
//
// Records vendor card views / website clicks in Supabase.
//
// Required env vars (set in Netlify → Site configuration → Environment variables):
//   SUPABASE_URL          — your project URL (public, safe to expose)
//   SUPABASE_SERVICE_KEY  — service_role key (SECRET — never expose to browsers)
//
// The service_role key is used here because this function writes analytics
// rows that bypass RLS. It's safe in a server-side Netlify Function because
// the key never reaches the browser. Do NOT add SUPABASE_SERVICE_KEY to
// SECRETS_SCAN_OMIT_KEYS — if the scanner finds it in built files, that's
// a real leak.

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('track-vendor: missing SUPABASE_URL or SUPABASE_SERVICE_KEY env var');
    return { statusCode: 500, body: 'Server misconfigured' };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { vendor_id, event_type, city } = body;
  if (!vendor_id || !event_type) {
    return { statusCode: 400, body: 'Missing fields' };
  }

  const today = new Date().toISOString().split('T')[0];
  const cityKey = city || 'unknown';
  const isView = event_type === 'view';

  // Use Supabase REST API directly with fetch — no npm package needed
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/vendor_stats`,
    {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        vendor_id,
        stat_date: today,
        city: cityKey,
        card_views: isView ? 1 : 0,
        website_clicks: isView ? 0 : 1,
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    console.error('track-vendor: Supabase REST error', response.status, err);
    return { statusCode: 500, body: err };
  }

  return { statusCode: 200, body: 'OK' };
};
