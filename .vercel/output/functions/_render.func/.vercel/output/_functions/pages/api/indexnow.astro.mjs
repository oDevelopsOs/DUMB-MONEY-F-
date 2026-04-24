export { renderers } from '../../renderers.mjs';

const prerender = false;
async function POST({ request }) {
  const body = await request.json().catch(() => ({}));
  Array.isArray(body?.urls) ? body.urls : [];
  {
    return new Response(JSON.stringify({ ok: false, error: "Missing INDEXNOW_KEY or URLs." }), { status: 400 });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
