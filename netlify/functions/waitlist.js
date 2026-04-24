const crypto = require('node:crypto');

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const EXPECTATION_MAX_LEN = 1200;
const bucketStore = new Map();

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  };
}

function getClientIp(event) {
  const fromNetlify = event.headers?.['x-nf-client-connection-ip'];
  const fromForwarded = event.headers?.['x-forwarded-for']?.split(',')?.[0]?.trim();
  return fromNetlify || fromForwarded || 'unknown';
}

function consumeRateLimit(ip) {
  const now = Date.now();
  const existing = bucketStore.get(ip);
  if (!existing || existing.resetAt < now) {
    bucketStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { blocked: false };
  }
  existing.count += 1;
  bucketStore.set(ip, existing);
  return { blocked: existing.count > RATE_LIMIT_MAX_REQUESTS };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function getCount(supabaseUrl, serviceRole) {
  const response = await fetch(`${supabaseUrl}/rest/v1/waitlist?select=id`, {
    method: 'GET',
    headers: {
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
      Prefer: 'count=exact',
      Range: '0-0',
    },
  });
  if (!response.ok) return null;
  const count = response.headers.get('content-range')?.split('/')?.[1];
  const value = Number.parseInt(count || '', 10);
  return Number.isFinite(value) ? value : null;
}

async function insertWaitlist(supabaseUrl, serviceRole, payload) {
  return fetch(`${supabaseUrl}/rest/v1/waitlist`, {
    method: 'POST',
    headers: {
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(payload),
  });
}

exports.handler = async function handler(event) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRole) {
    return json(500, { ok: false, error: 'Server configuration missing.' });
  }

  if (event.httpMethod === 'GET') {
    const count = await getCount(supabaseUrl, serviceRole);
    if (count === null) return json(502, { ok: false, error: 'Failed to load counter.' });
    return json(200, { ok: true, count });
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method not allowed.' });
  }

  const ip = getClientIp(event);
  if (consumeRateLimit(ip).blocked) {
    return json(429, { ok: false, error: 'Too many requests. Please retry shortly.' });
  }

  const body = JSON.parse(event.body || '{}');
  const honeypot = typeof body?.company === 'string' ? body.company.trim() : '';
  if (honeypot) return json(200, { ok: true, accepted: true });

  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const expectationRaw = typeof body?.what_they_expect === 'string' ? body.what_they_expect.trim() : '';
  const what_they_expect = expectationRaw ? expectationRaw.slice(0, EXPECTATION_MAX_LEN) : null;
  const referrer = typeof body?.referrer === 'string' ? body.referrer.trim().slice(0, 1024) : null;
  if (!email || !isValidEmail(email)) return json(400, { ok: false, error: 'Invalid email.' });

  const userAgent = event.headers?.['user-agent'] || null;
  const ipHash = ip === 'unknown' ? null : crypto.createHash('sha256').update(ip).digest('hex');
  const response = await insertWaitlist(supabaseUrl, serviceRole, {
    email,
    what_they_expect,
    referrer,
    source: 'website',
    ip_hash: ipHash,
    user_agent: userAgent,
  });

  if (response.ok) return json(201, { ok: true });
  if (response.status === 409) return json(409, { ok: true, duplicate: true });

  const text = await response.text().catch(() => '');
  console.error('Waitlist insert failed', response.status, text);
  return json(502, { ok: false, error: 'Could not submit right now.' });
};
