// netlify/functions/submit-concierge-request.js
//
// Accepts a concierge booking request from the frontend. Flow:
//   1. Validate the payload
//   2. Resolve identity (signed-in user_id from Authorization header, or guest email)
//   3. If signed-in AND points_to_apply > 0:
//      - Validate against caps (30% of trip, min $200 trip, available balance)
//      - Place a hold on the points (so they can't be spent on something else)
//   4. Insert concierge_requests row
//   5. Email the Fora team via Resend
//
// Env vars needed:
//   SUPABASE_URL
//   SUPABASE_ANON_KEY
//   SUPABASE_SERVICE_ROLE_KEY
//   RESEND_API_KEY              - re_... key from resend.com
//   CONCIERGE_TEAM_EMAIL        - where to send the alert (e.g., concierge@bagfree.app)
//   CONCIERGE_FROM_EMAIL        - sender, e.g. hello@bagfree.app
//   SITE_URL                    - e.g. https://bagfree.app (used in admin links in the email)

const { createClient } = require('@supabase/supabase-js');

const ALLOWED_VIBES = new Set(['beach','city','wellness','culinary','business','family','other']);
const ALLOWED_BUDGETS = new Set(['under_500','500_1500','1500_5000','5000_plus','flexible']);

// Rough midpoint of each budget bucket, in cents — used as the upper bound
// for "is your points-to-apply within 30% of trip cost?" Conservative on
// purpose: better to under-hold than to over-promise.
const BUDGET_LOW_END_CENTS = {
  under_500:   20000,    // $200 minimum we enforce anyway
  '500_1500':  50000,    // $500
  '1500_5000': 150000,   // $1,500
  '5000_plus': 500000,   // $5,000
  flexible:    50000,    // assume $500 if user picked "flexible"
};

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // Parse body
  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (e) { return j(400, { error: 'Invalid JSON' }); }

  // Validate basic fields
  const { destination, travel_dates, travelers, vibe, budget_range,
          special_requests, points_to_apply, contact_email,
          contact_name, contact_phone, estimated_trip_cost } = body;

  if (!destination || typeof destination !== 'string' || destination.length < 2) {
    return j(400, { error: 'destination is required' });
  }
  if (!contact_email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact_email)) {
    return j(400, { error: 'A valid contact_email is required' });
  }
  if (vibe && !ALLOWED_VIBES.has(vibe)) {
    return j(400, { error: 'vibe is invalid' });
  }
  if (budget_range && !ALLOWED_BUDGETS.has(budget_range)) {
    return j(400, { error: 'budget_range is invalid' });
  }
  const pointsToApply = Math.max(0, parseInt(points_to_apply, 10) || 0);
  const travelersNum  = Math.min(20, Math.max(1, parseInt(travelers, 10) || 2));

  // Set up Supabase clients
  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey     = process.env.SUPABASE_ANON_KEY;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !anonKey || !serviceKey) {
    console.error('Supabase env vars missing');
    return j(500, { error: 'Server misconfigured' });
  }

  // Try to identify the caller (optional — guests are allowed)
  const authHeader = event.headers.authorization || event.headers.Authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  let userId = null;
  if (token) {
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false },
    });
    const { data: userData } = await userClient.auth.getUser();
    userId = userData?.user?.id || null;
  }

  // Admin client for all writes
  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  // If the user wants to apply points, they MUST be signed in
  if (pointsToApply > 0 && !userId) {
    return j(401, { error: 'Sign in to apply BAG Rewards points to your booking.' });
  }

  // Load rules from the database
  const { data: rules, error: rulesErr } = await admin
    .from('bag_rules')
    .select('key,value')
    .in('key', [
      'travel_redemption_rate_cents_per_point',
      'travel_redemption_max_pct',
      'travel_redemption_min_trip_cost_cents',
      'concierge_hold_days',
    ]);
  if (rulesErr) { console.error(rulesErr); return j(500, { error: 'Could not load rules' }); }

  const ruleMap = Object.fromEntries(rules.map(r => [r.key, r.value]));
  const centsPerPoint = Number(ruleMap.travel_redemption_rate_cents_per_point ?? 2);
  const maxPct        = Number(ruleMap.travel_redemption_max_pct ?? 30);
  const minTripCents  = Number(ruleMap.travel_redemption_min_trip_cost_cents ?? 20000);
  const holdDays      = Number(ruleMap.concierge_hold_days ?? 14);

  // Validate the points application
  let holdId = null;
  if (pointsToApply > 0) {
    // Estimate the trip cost. Prefer the user's own estimate if provided,
    // else use the low end of their selected budget bucket.
    const tripCents = Math.max(
      Number(estimated_trip_cost) || 0,
      BUDGET_LOW_END_CENTS[budget_range] || 50000
    );

    if (tripCents < minTripCents) {
      return j(400, {
        error: `Point redemption requires a trip cost of at least $${minTripCents/100}.`,
      });
    }

    const maxPointsValueCents = Math.floor(tripCents * (maxPct / 100));
    const maxPoints           = Math.floor(maxPointsValueCents / centsPerPoint);
    if (pointsToApply > maxPoints) {
      return j(400, {
        error: `You can apply at most ${maxPoints.toLocaleString()} points to this trip (${maxPct}% of estimated cost).`,
      });
    }

    // Place the hold (this also validates against available balance)
    const { data: holdResult, error: holdErr } = await admin.rpc('hold_points', {
      p_user_id: userId,
      p_amount: pointsToApply,
      p_purpose: 'concierge_request',
      p_source_ref: 'concierge:pending',
      p_expires_in: `${holdDays} days`,
    });
    if (holdErr) {
      console.error('hold_points failed:', holdErr);
      return j(400, { error: holdErr.message || 'Could not reserve points' });
    }
    holdId = holdResult?.[0]?.hold_id;
  }

  // Insert the concierge request
  const { data: reqRow, error: insErr } = await admin
    .from('concierge_requests')
    .insert({
      user_id:              userId,
      contact_email:        contact_email.trim(),
      contact_name:         (contact_name || '').trim() || null,
      contact_phone:        (contact_phone || '').trim() || null,
      destination:          destination.trim(),
      travel_dates:         (travel_dates || '').trim() || null,
      travelers:            travelersNum,
      vibe:                 vibe || null,
      budget_range:         budget_range || null,
      special_requests:     (special_requests || '').trim() || null,
      points_to_apply:      pointsToApply,
      points_hold_id:       holdId,
      estimated_trip_cost:  Number(estimated_trip_cost) || null,
      status:               'pending',
    })
    .select()
    .single();

  if (insErr) {
    console.error('insert failed:', insErr);
    // If the insert failed, try to release the hold we just placed
    if (holdId) {
      await admin.rpc('release_hold', { p_hold_id: holdId }).catch(() => {});
    }
    return j(500, { error: 'Could not save your request — please try again.' });
  }

  // Link the hold back to the request id (the FK was created with placeholder ref)
  if (holdId) {
    await admin.from('bag_point_holds').update({
      source_ref: `concierge_request:${reqRow.id}`,
    }).eq('id', holdId);
  }

  // Fire the team email (don't block the response on it)
  sendTeamEmail(reqRow, centsPerPoint).catch(e => console.error('Email failed:', e));

  return j(200, {
    ok: true,
    request_id: reqRow.id,
    estimated_response_time: '24 hours',
  });
};

function j(status, payload) {
  return { statusCode: status, headers: cors, body: JSON.stringify(payload) };
}

async function sendTeamEmail(req, centsPerPoint) {
  const apiKey = process.env.RESEND_API_KEY;
  const to     = process.env.CONCIERGE_TEAM_EMAIL;
  const from   = process.env.CONCIERGE_FROM_EMAIL || 'concierge@bagfree.app';
  const site   = process.env.SITE_URL || 'https://bagfree.app';

  if (!apiKey || !to) {
    console.warn('Resend not configured — skipping team email');
    return;
  }

  const pointsValueCents = (req.points_to_apply || 0) * centsPerPoint;
  const dollars = (cents) => '$' + (cents / 100).toFixed(2);

  const html = `<div style="font-family:Georgia,serif;background:#F5EFE4;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #E8D5B0;">
    <div style="background:#C9A96E;height:3px;"></div>
    <div style="padding:28px 32px 8px;">
      <div style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#A6864A;margin-bottom:6px;">New Concierge Request</div>
      <h1 style="margin:0;font-size:24px;font-weight:300;letter-spacing:-0.3px;color:#0D1525;">
        ${escapeHtml(req.contact_name || 'A traveler')} wants to book
        <span style="font-style:italic;color:#A6864A;">${escapeHtml(req.destination)}</span>
      </h1>
    </div>

    <div style="padding:16px 32px;">
      <table style="width:100%;font-family:Arial,sans-serif;font-size:13px;line-height:1.7;">
        <tr><td style="color:#7A8090;width:140px;">Contact</td><td><a href="mailto:${escapeAttr(req.contact_email)}" style="color:#A6864A;">${escapeHtml(req.contact_email)}</a>${req.contact_phone ? ' · ' + escapeHtml(req.contact_phone) : ''}</td></tr>
        <tr><td style="color:#7A8090;">Destination</td><td>${escapeHtml(req.destination)}</td></tr>
        <tr><td style="color:#7A8090;">Dates</td><td>${escapeHtml(req.travel_dates || '—')}</td></tr>
        <tr><td style="color:#7A8090;">Travelers</td><td>${req.travelers}</td></tr>
        <tr><td style="color:#7A8090;">Vibe</td><td>${escapeHtml(req.vibe || '—')}</td></tr>
        <tr><td style="color:#7A8090;">Budget</td><td>${escapeHtml(req.budget_range || '—').replace(/_/g, ' ')}</td></tr>
        ${req.estimated_trip_cost ? `<tr><td style="color:#7A8090;">Est. cost</td><td>${dollars(req.estimated_trip_cost)}</td></tr>` : ''}
      </table>

      ${req.special_requests ? `
        <div style="margin-top:16px;padding:14px 16px;background:#FAF7F0;border:1px solid #E8D5B0;font-family:Georgia,serif;font-size:14px;line-height:1.7;color:#3A4252;">
          <div style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#A6864A;font-family:Arial,sans-serif;margin-bottom:6px;">Special requests</div>
          ${escapeHtml(req.special_requests).replace(/\n/g, '<br>')}
        </div>` : ''}

      ${req.points_to_apply > 0 ? `
        <div style="margin-top:16px;padding:14px 16px;background:#FFF8EC;border:1px solid #E8D5B0;">
          <div style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#A6864A;font-family:Arial,sans-serif;margin-bottom:6px;">BAG Rewards to apply</div>
          <div style="font-family:Georgia,serif;font-size:18px;color:#A6864A;">
            ${req.points_to_apply.toLocaleString()} points
            <span style="font-size:13px;color:#7A8090;">≈ ${dollars(pointsValueCents)} discount</span>
          </div>
          <div style="font-size:11px;color:#7A8090;font-family:Arial,sans-serif;margin-top:4px;">
            Points are held for 14 days. Use the admin panel to finalize when the booking confirms.
          </div>
        </div>` : ''}

      <div style="margin-top:20px;padding-top:16px;border-top:1px solid #EDE5D5;font-family:Arial,sans-serif;font-size:11px;color:#7A8090;">
        Request ID: <span style="font-family:monospace;color:#A6864A;">${req.id}</span><br>
        Submitted: ${new Date(req.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}<br>
        ${userId(req)}
      </div>

      <div style="margin-top:18px;">
        <a href="mailto:${escapeAttr(req.contact_email)}?subject=${encodeURIComponent('Your BagFree trip request — ' + req.destination)}" style="display:inline-block;background:#C9A96E;color:#0D1525;padding:11px 22px;text-decoration:none;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2.5px;text-transform:uppercase;font-weight:600;">Reply to traveler →</a>
      </div>
    </div>

    <div style="padding:14px 32px;background:#FAF7F0;border-top:1px solid #EDE5D5;font-family:Arial,sans-serif;font-size:10px;color:#7A8090;text-align:center;letter-spacing:1.5px;">
      BagFree Concierge · ${site.replace(/^https?:\/\//, '')}
    </div>
  </div>
</div>`;

  const subject = `Concierge: ${req.destination}${req.travel_dates ? ' · ' + req.travel_dates : ''} (${req.travelers} traveler${req.travelers === 1 ? '' : 's'})`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from:    `BagFree Concierge <${from}>`,
      to:      [to],
      reply_to: req.contact_email,  // hitting Reply goes to the traveler
      subject,
      html,
    }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Resend ${res.status}: ${txt}`);
  }
}

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);
}
function escapeAttr(s) { return escapeHtml(s); }
function userId(req)   { return req.user_id ? `User ID: ${req.user_id}` : 'Guest request (no account)'; }
