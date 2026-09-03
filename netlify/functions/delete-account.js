const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event) {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: cors,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.BAGFREE_SUPABASE_URL;
    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.BAGFREE_SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return {
        statusCode: 500,
        headers: cors,
        body: JSON.stringify({ error: 'Server missing Supabase admin configuration' })
      };
    }

    const authHeader = event.headers.authorization || event.headers.Authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (!token) {
      return {
        statusCode: 401,
        headers: cors,
        body: JSON.stringify({ error: 'Missing authorization token' })
      };
    }

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data: userData, error: userError } = await admin.auth.getUser(token);

    if (userError || !userData || !userData.user) {
      return {
        statusCode: 401,
        headers: cors,
        body: JSON.stringify({ error: 'Invalid or expired session' })
      };
    }

    const user = userData.user;
    const userId = user.id;

    // Best-effort cleanup of app-owned user data. Ignore missing tables.
    const cleanupTables = [
      { table: 'profiles', column: 'id' },
      { table: 'orders', column: 'user_id' },
      { table: 'service_plans', column: 'user_id' },
      { table: 'memberships', column: 'user_id' },
      { table: 'game_profiles', column: 'user_id' },
      { table: 'donations', column: 'user_id' },
      { table: 'concierge_requests', column: 'user_id' }
    ];

    for (const item of cleanupTables) {
      try {
        await admin.from(item.table).delete().eq(item.column, userId);
      } catch (e) {
        console.warn('delete-account cleanup skipped:', item.table, e.message);
      }
    }

    const { error: deleteError } = await admin.auth.admin.deleteUser(userId);

    if (deleteError) {
      return {
        statusCode: 500,
        headers: cors,
        body: JSON.stringify({ error: 'Could not delete account', detail: deleteError.message })
      };
    }

    return {
      statusCode: 200,
      headers: cors,
      body: JSON.stringify({ ok: true, deleted: true })
    };
  } catch (err) {
    console.error('delete-account failed:', err);
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({ error: 'Delete account failed', detail: err.message })
    };
  }
};
