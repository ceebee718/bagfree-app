// netlify/functions/config.js
//
// Returns public Supabase config to the browser.
// Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in Netlify:
//   Site settings → Environment variables
//
// Note: SUPABASE_PUBLISHABLE_KEY is the "publishable" / "anon" key — it's
// designed to be exposed to browsers. Security relies on Row Level Security
// policies in Supabase, NOT on the key being secret. Never put the
// service_role key here.

exports.handler = async function() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify({
        error: 'Server misconfigured: SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY missing.'
      }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      // Cache for 1 hour at the edge — config changes are rare and a stale
      // value here just means waiting up to an hour for a rotation to propagate
      'Cache-Control': 'public, max-age=3600',
    },
    body: JSON.stringify({ url, key }),
  };
};
