import { createClient } from '@supabase/supabase-js';
import { createHash } from 'node:crypto';
export { renderers } from '../../renderers.mjs';

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://dumb-moneyy.vercel.app", "SSR": true};
const prerender = false;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1e3;
const RATE_LIMIT_MAX_REQUESTS = 10;
const EXPECTATION_MAX_LEN = 1200;
const bucketStore = /* @__PURE__ */ new Map();
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" }
  });
}
function getClientIp(request) {
  const fromNetlify = request.headers.get("x-nf-client-connection-ip");
  const fromForwarded = request.headers.get("x-forwarded-for")?.split(",")?.[0]?.trim();
  return fromNetlify || fromForwarded || "unknown";
}
function consumeRateLimit(ip) {
  const now = Date.now();
  const existing = bucketStore.get(ip);
  if (!existing || existing.resetAt < now) {
    const next = { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
    bucketStore.set(ip, next);
    return { blocked: false, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }
  existing.count += 1;
  bucketStore.set(ip, existing);
  const blocked = existing.count > RATE_LIMIT_MAX_REQUESTS;
  return { blocked, remaining: Math.max(0, RATE_LIMIT_MAX_REQUESTS - existing.count) };
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function serverSecret(name) {
  if (typeof process !== "undefined" && process.env?.[name]) {
    return process.env[name];
  }
  return Object.assign(__vite_import_meta_env__, { OS: process.env.OS })[name];
}
function getSupabaseAdmin() {
  const supabaseUrl = serverSecret("SUPABASE_URL");
  const serviceRole = serverSecret("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRole) return null;
  return createClient(supabaseUrl, serviceRole, { auth: { persistSession: false } });
}
async function GET() {
  const start = Date.now();
  const supabase = getSupabaseAdmin();
  if (!supabase) return json({ ok: false, error: "Server configuration missing." }, 500);
  const { count, error } = await supabase.from("waitlist").select("*", { count: "exact", head: true });
  const elapsedMs = Date.now() - start;
  if (error) {
    console.error(JSON.stringify({ event: "waitlist_count_failed", error: error.message, elapsedMs }));
    return json({ ok: false, error: "Failed to load counter." }, 502);
  }
  console.info(JSON.stringify({ event: "waitlist_count_ok", count: count || 0, elapsedMs }));
  return json({ ok: true, count: count || 0 });
}
async function POST({ request }) {
  const start = Date.now();
  const ip = getClientIp(request);
  const rate = consumeRateLimit(ip);
  if (rate.blocked) {
    return json({ ok: false, error: "Too many requests. Please retry shortly." }, 429);
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return json({ ok: false, error: "Server configuration missing." }, 500);
  const body = await request.json().catch(() => ({}));
  const honeypot = typeof body?.company === "string" ? body.company.trim() : "";
  if (honeypot) {
    console.warn(JSON.stringify({ event: "waitlist_honeypot_triggered", ip }));
    return json({ ok: true, accepted: true });
  }
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const expectationRaw = typeof body?.what_they_expect === "string" ? body.what_they_expect.trim() : "";
  const what_they_expect = expectationRaw ? expectationRaw.slice(0, EXPECTATION_MAX_LEN) : null;
  const referrer = typeof body?.referrer === "string" ? body.referrer.trim().slice(0, 1024) : null;
  if (!email || !isValidEmail(email)) {
    return json({ ok: false, error: "Invalid email." }, 400);
  }
  const userAgent = request.headers.get("user-agent");
  const ipHash = ip === "unknown" ? null : createHash("sha256").update(ip).digest("hex");
  const payload = {
    email,
    what_they_expect,
    referrer,
    source: "website",
    ip_hash: ipHash,
    user_agent: userAgent
  };
  const { error } = await supabase.from("waitlist").insert(payload);
  const elapsedMs = Date.now() - start;
  if (error) {
    const duplicate = error.code === "23505";
    if (duplicate) {
      console.info(JSON.stringify({ event: "waitlist_duplicate", ipHash, elapsedMs }));
      return json({ ok: true, duplicate: true }, 409);
    }
    console.error(JSON.stringify({ event: "waitlist_insert_failed", code: error.code, message: error.message, elapsedMs }));
    return json({ ok: false, error: "Could not submit right now." }, 502);
  }
  console.info(JSON.stringify({ event: "waitlist_insert_ok", ipHash, elapsedMs, remaining: rate.remaining }));
  return json({ ok: true }, 201);
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
