const urls = [
  '/',
  '/about',
  '/privacy',
  '/methodology',
  '/corrections',
  '/press',
  '/pfof',
  '/pfof-calculator',
  '/explainers/how-pfof-works',
  '/data/pfof-routing-dataset',
  '/seo-ops',
];

export function GET({ site }) {
  const base = site || new URL('https://dumbmoney.io');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (pathname) => `  <url>
    <loc>${new URL(pathname, base).toString()}</loc>
    <changefreq>weekly</changefreq>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
