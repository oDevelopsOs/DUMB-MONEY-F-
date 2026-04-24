export { renderers } from '../../renderers.mjs';

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://dumb-moneyy.vercel.app", "SSR": true};
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const prerender = false;
function serverEnv(name) {
  if (typeof process !== "undefined" && process.env?.[name]) {
    return process.env[name];
  }
  return Object.assign(__vite_import_meta_env__, { OS: process.env.OS })[name];
}
async function POST({ request }) {
  const body = await request.json().catch(() => ({}));
  const key = serverEnv("INDEXNOW_KEY");
  const keyLocation = serverEnv("INDEXNOW_KEY_LOCATION") || `https://dumb-moneyy.vercel.app/${key}.txt`;
  const host = serverEnv("INDEXNOW_HOST") || "dumb-moneyy.vercel.app";
  const incomingUrls = Array.isArray(body?.urls) ? body.urls : [];
  if (!key || !incomingUrls.length) {
    return new Response(JSON.stringify({ ok: false, error: "Missing INDEXNOW_KEY or URLs." }), { status: 400 });
  }
  const payload = {
    host,
    key,
    keyLocation,
    urlList: incomingUrls
  };
  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
  return new Response(
    JSON.stringify({
      ok: response.ok,
      status: response.status
    }),
    {
      status: response.ok ? 200 : 502,
      headers: { "content-type": "application/json" }
    }
  );
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
