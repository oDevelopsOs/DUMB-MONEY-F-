const endpoint = process.env.INDEXNOW_ENDPOINT || 'https://api.indexnow.org/indexnow';
const host = process.env.INDEXNOW_HOST || 'dumb-money-blond.vercel.app';
const key = process.env.INDEXNOW_KEY;
const keyLocation = process.env.INDEXNOW_KEY_LOCATION || `https://${host}/${key}.txt`;
const rawUrls = process.env.INDEXNOW_URLS || 'https://dumb-money-blond.vercel.app/';
const urlList = rawUrls
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

if (!key) {
  console.error('Missing INDEXNOW_KEY env var.');
  process.exit(1);
}

if (!urlList.length) {
  console.error('Provide at least one URL via INDEXNOW_URLS.');
  process.exit(1);
}

const payload = { host, key, keyLocation, urlList };
const response = await fetch(endpoint, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(payload),
});

if (!response.ok) {
  const body = await response.text();
  console.error(`IndexNow request failed (${response.status}): ${body}`);
  process.exit(1);
}

console.log(`IndexNow ping successful for ${urlList.length} URL(s).`);
