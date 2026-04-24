import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_VqdT30Rp.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/api/indexnow.astro.mjs');
const _page3 = () => import('./pages/api/waitlist.astro.mjs');
const _page4 = () => import('./pages/corrections.astro.mjs');
const _page5 = () => import('./pages/data/pfof-routing-dataset.astro.mjs');
const _page6 = () => import('./pages/explainers/how-pfof-works.astro.mjs');
const _page7 = () => import('./pages/methodology.astro.mjs');
const _page8 = () => import('./pages/pfof.astro.mjs');
const _page9 = () => import('./pages/pfof-calculator.astro.mjs');
const _page10 = () => import('./pages/press.astro.mjs');
const _page11 = () => import('./pages/privacy.astro.mjs');
const _page12 = () => import('./pages/rss.xml.astro.mjs');
const _page13 = () => import('./pages/seo-ops.astro.mjs');
const _page14 = () => import('./pages/sitemap-index.xml.astro.mjs');
const _page15 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/api/indexnow.ts", _page2],
    ["src/pages/api/waitlist.ts", _page3],
    ["src/pages/corrections.astro", _page4],
    ["src/pages/data/pfof-routing-dataset.astro", _page5],
    ["src/pages/explainers/how-pfof-works.astro", _page6],
    ["src/pages/methodology.astro", _page7],
    ["src/pages/pfof/index.astro", _page8],
    ["src/pages/pfof-calculator.astro", _page9],
    ["src/pages/press.astro", _page10],
    ["src/pages/privacy.astro", _page11],
    ["src/pages/rss.xml.ts", _page12],
    ["src/pages/seo-ops.astro", _page13],
    ["src/pages/sitemap-index.xml.ts", _page14],
    ["src/pages/index.astro", _page15]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "5f15f3a3-ec2d-4f88-837b-4d53ab0e600c"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
