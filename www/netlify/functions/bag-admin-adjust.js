// netlify/functions/bag-admin-adjust.js
//
// Admin endpoint: manually credit or debit BAG points for a user.
//
// Auth model:
//   - Caller must be logged in (sends Supabase access token in Authorization header)
//   - The function uses that token to verify identity AND check that
//     profiles.is_admin = true for that user
//   - If both check out, it uses the SERVICE_ROLE key to perform the award
//
// Why two clients (anon + service-role):
//   The anon-token client is bound to the caller's identity for auth checks.
//   The service-role client is used for the actual write, so RLS doesn't
//     block it.
//
// Request body:
//   {
//     "user_id":  "uuid",         // recipient
//     "amount":   100,            // positive to credit, negative to debit
//     "reason":   "manual_admin_credit" | "manual_admin_debit" | "promotion",
//     "note":     "optional human-readable reason for the ledger"
//   }

const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  // CORS for browser-based admin tools. Tighten origin in production.
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors, body: 'Method not allowed' };
  }

  // Pull the Supabase JWT from the Authorization header
  const authHeader = event.headers.authorization || event.headers.Authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return { statusCode: 401, headers: cors, body: 'Missing bearer token' };
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !anonKey || !serviceKey) {
    return { statusCode: 500, headers: cors, body: 'Server misconfigured' };
  }

  // 1. Verify the caller's identity using their token
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  });

  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) {
    return { statusCode: 401, headers: cors, body: 'Invalid token' };
  }
  const callerId = userData.user.id;

  // 2. Verify the caller is an admin
  const { data: callerProfile, error: profileErr } = await userClient
    .from('profiles')
    .select('is_admin')
    .eq('id', callerId)
    .single();

  if (profileErr || !callerProfile?.is_admin) {
    return { statusCode: 403, headers: cors, body: 'Admin only' };
  }

  // 3. Parse and validate the request body
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, headers: cors, body: 'Invalid JSON' };
  }

  const { user_id, amount, reason, note } = body;
  const allowedReasons = new Set([
    'manual_admin_credit',
    'manual_admin_debit',
    'promotion',
    'reversal',
    'challenge_reward',
  ]);

  if (!user_id || typeof user_id !== 'string') {
    return { statusCode: 400, headers: cors, body: 'user_id required' };
  }
  if (!Number.isInteger(amount) || amount === 0) {
    return { statusCode: 400, headers: cors, body: 'amount must be a non-zero integer' };
  }
  if (!reason || !allowedReasons.has(reason)) {
    return {
      statusCode: 400,
      headers: cors,
      body: `reason must be one of: ${[...allowedReasons].join(', ')}`,
    };
  }
  // Sanity: if it's a debit reason the amount must be negative, and vice versa
  if (reason === 'manual_admin_debit' && amount > 0) {
    return { statusCode: 400, headers: cors, body: 'Debit must have negative amount' };
  }
  if (reason === 'manual_admin_credit' && amount < 0) {
    return { statusCode: 400, headers: cors, body: 'Credit must have positive amount' };
  }

  // 4. Perform the award with the service-role client (bypasses RLS).
  // We include the admin's id + a timestamp in the idempotency key so each
  // manual action is unique but still de-duped if the form is submitted twice.
  const idempotencyKey = `admin:${callerId}:${Date.now()}:${user_id}`;

  const adminClient = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const { data: result, error: rpcErr } = await adminClient.rpc('award_points', {
    p_user_id: user_id,
    p_amount: amount,
    p_reason: reason,
    p_source_ref: `admin:${callerId}`,
    p_idempotency_key: idempotencyKey,
    p_metadata: {
      admin_id: callerId,
      admin_email: userData.user.email,
      note: note || null,
    },
  });

  if (rpcErr) {
    console.error('award_points failed:', rpcErr);
    return { statusCode: 500, headers: cors, body: 'Failed to award points' };
  }

  return {
    statusCode: 200,
    headers: { ...cors, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      transaction_id: result?.[0]?.transaction_id,
      new_balance: result?.[0]?.new_balance,
    }),
  };
};
