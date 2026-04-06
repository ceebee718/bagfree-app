exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const SUPABASE_URL = process.env.SUPABASE_URL || 'https://hoipvmhwjxdipbnnxdwd.supabase.co';
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

  let body;
  try { body = JSON.parse(event.body); } catch { return { statusCode: 400, body: 'Invalid JSON' }; }

  const { vendor_id, event_type, city } = body;
  if (!vendor_id || !event_type) return { statusCode: 400, body: 'Missing fields' };

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
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        vendor_id,
        stat_date: today,
        city: cityKey,
        card_views: isView ? 1 : 0,
        website_clicks: isView ? 0 : 1,
      })
    }
  );

  if (!response.ok) {
    const err = await response.text();
    return { statusCode: 500, body: err };
  }

  return { statusCode: 200, body: 'OK' };
};
