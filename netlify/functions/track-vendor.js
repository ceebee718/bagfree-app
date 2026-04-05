const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY // service role key — set in Netlify env vars
  );

  let body;
  try { body = JSON.parse(event.body); } catch { return { statusCode: 400, body: 'Invalid JSON' }; }

  const { vendor_id, event_type, city } = body;
  if (!vendor_id || !event_type) return { statusCode: 400, body: 'Missing fields' };

  const today = new Date().toISOString().split('T')[0];
  const cityKey = city || 'unknown';

  // Upsert stat row for today
  const { error } = await supabase.rpc('upsert_vendor_stat', {
    p_vendor_id: vendor_id,
    p_date: today,
    p_city: cityKey,
    p_views: event_type === 'view' ? 1 : 0,
    p_clicks: event_type === 'click' ? 1 : 0,
  });

  if (error) return { statusCode: 500, body: error.message };
  return { statusCode: 200, body: 'OK' };
};
