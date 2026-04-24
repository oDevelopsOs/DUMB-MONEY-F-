const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

export async function POST({ request }) {
  const body = await request.json().catch(() => ({}));
  const key = import.meta.env.INDEXNOW_KEY;
  const keyLocation = import.meta.env.INDEXNOW_KEY_LOCATION || `https://dumb-moneyy.vercel.app/${key}.txt`;
  const host = import.meta.env.INDEXNOW_HOST || 'dumb-moneyy.vercel.app';
  const incomingUrls = Array.isArray(body?.urls) ? body.urls : [];

  if (!key || !incomingUrls.length) {
    return new Response(JSON.stringify({ ok: false, error: 'Missing INDEXNOW_KEY or URLs.' }), { status: 400 });
  }

  const payload = {
    host,
    key,
    keyLocation,
    urlList: incomingUrls,
  };

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return new Response(
    JSON.stringify({
      ok: response.ok,
      status: response.status,
    }),
    {
      status: response.ok ? 200 : 502,
      headers: { 'content-type': 'application/json' },
    },
  );
}
