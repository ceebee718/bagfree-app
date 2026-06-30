const { createClient } = require('@supabase/supabase-js');

function getHeader(event, name) {
  const headers = event.headers || {};
  const lowerName = name.toLowerCase();

  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() === lowerName) {
      return headers[key];
    }
  }

  return '';
}

async function countRows(supabase, table, applyFilter) {
  try {
    let query = supabase.from(table).select('*', {
      count: 'exact',
      head: true,
    });

    if (applyFilter) {
      query = applyFilter(query);
    }

    const { count, error } = await query;

    if (error) {
      return { value: 'Pending', error: error.message };
    }

    return { value: count ?? 0, error: null };
  } catch (err) {
    return { value: 'Pending', error: err.message };
  }
}

exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-embr-status-key',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ ok: false, error: 'Method not allowed' }),
    };
  }

  const expectedKey = process.env.BAGFREE_STATUS_KEY || '';
  const incomingKey = getHeader(event, 'x-embr-status-key');

  if (!expectedKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        ok: false,
        error: 'BagFree status key is not configured.',
      }),
    };
  }

  if (incomingKey !== expectedKey) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ ok: false, error: 'Unauthorized' }),
    };
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.BAGFREE_SUPABASE_URL || '';
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.BAGFREE_SUPABASE_SERVICE_ROLE_KEY ||
    '';

  const hasSupabase = Boolean(supabaseUrl && supabaseServiceKey);
  const hasEmbr = Boolean(process.env.EMBR_API_KEY);
  const hasStripe = Boolean(process.env.STRIPE_SECRET_KEY || process.env.STRIPE_WEBHOOK_SECRET);

  let totalUsers = 'Pending';
  let totalMemberships = 'Pending';
  let payingUsers = 'Pending';
  const sourceErrors = [];

  if (hasSupabase) {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const profiles = await countRows(supabase, 'profiles');
    const memberships = await countRows(supabase, 'user_memberships');
    const activeMemberships = await countRows(
      supabase,
      'user_memberships',
      (query) => query.eq('status', 'active')
    );

    totalUsers = profiles.value;
    totalMemberships = memberships.value;
    payingUsers = activeMemberships.value;

    for (const item of [profiles, memberships, activeMemberships]) {
      if (item.error) {
        sourceErrors.push(item.error);
      }
    }
  }

  const generatedAt = new Date().toISOString();

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      ok: true,
      appId: 'bagfree',
      appName: 'BagFree',
      source: 'bagfree-netlify',
      status: 'partial-live',
      generatedAt,
      connections: {
        site: 'live',
        netlifyFunctions: 'live',
        travelBrain: 'connected',
        embrApi: hasEmbr ? 'configured' : 'missing-key',
        supabase: hasSupabase ? 'configured' : 'pending',
        stripe: hasStripe ? 'configured' : 'pending',
      },
      intelligence: {
        embrConnected: true,
        travelBrainConnected: true,
        feature: 'bagfree_travel_brain',
      },
      business: {
        totalUsers,
        totalMemberships,
        payingUsers,
        activeUsers: 'Pending',
        estimatedRevenue: 'Pending',
        payments: hasStripe ? 'Stripe Configured' : 'Data Pending',
      },
      needsSetup: [
        totalUsers === 'Pending' ? 'Supabase user counts' : null,
        payingUsers === 'Pending' ? 'Membership/payment counts' : null,
        'Active-user tracking',
        'Revenue reporting',
      ].filter(Boolean),
      sourceErrors,
    }),
  };
};
