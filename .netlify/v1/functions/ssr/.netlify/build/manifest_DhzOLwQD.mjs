import '@astrojs/internal-helpers/path';
import 'cookie';
import 'kleur/colors';
import 'es-module-lexer';
import { n as NOOP_MIDDLEWARE_HEADER, o as decodeKey } from './chunks/astro/server_BMCR24Hs.mjs';
import 'clsx';
import 'html-escaper';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from tRPC error code table
  // https://trpc.io/docs/server/error-handling#error-codes
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 405,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/Helo%20Uss%20Uss/OneDrive/Desktop/DUMB_MONEY/Dumbmoney/","adapterName":"@astrojs/netlify","routes":[{"file":"about/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"api/indexnow","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/indexnow","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/indexnow\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"indexnow","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/indexnow.ts","pathname":"/api/indexnow","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"api/waitlist","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/waitlist","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/waitlist\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"waitlist","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/waitlist.ts","pathname":"/api/waitlist","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"corrections/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/corrections","isIndex":false,"type":"page","pattern":"^\\/corrections\\/?$","segments":[[{"content":"corrections","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/corrections.astro","pathname":"/corrections","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"data/pfof-routing-dataset/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/data/pfof-routing-dataset","isIndex":false,"type":"page","pattern":"^\\/data\\/pfof-routing-dataset\\/?$","segments":[[{"content":"data","dynamic":false,"spread":false}],[{"content":"pfof-routing-dataset","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/data/pfof-routing-dataset.astro","pathname":"/data/pfof-routing-dataset","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"explainers/how-pfof-works/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/explainers/how-pfof-works","isIndex":false,"type":"page","pattern":"^\\/explainers\\/how-pfof-works\\/?$","segments":[[{"content":"explainers","dynamic":false,"spread":false}],[{"content":"how-pfof-works","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/explainers/how-pfof-works.astro","pathname":"/explainers/how-pfof-works","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"methodology/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/methodology","isIndex":false,"type":"page","pattern":"^\\/methodology\\/?$","segments":[[{"content":"methodology","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/methodology.astro","pathname":"/methodology","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"pfof/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/pfof","isIndex":true,"type":"page","pattern":"^\\/pfof\\/?$","segments":[[{"content":"pfof","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/pfof/index.astro","pathname":"/pfof","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"pfof-calculator/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/pfof-calculator","isIndex":false,"type":"page","pattern":"^\\/pfof-calculator\\/?$","segments":[[{"content":"pfof-calculator","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/pfof-calculator.astro","pathname":"/pfof-calculator","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"press/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/press","isIndex":false,"type":"page","pattern":"^\\/press\\/?$","segments":[[{"content":"press","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/press.astro","pathname":"/press","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"privacy/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/privacy","isIndex":false,"type":"page","pattern":"^\\/privacy\\/?$","segments":[[{"content":"privacy","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/privacy.astro","pathname":"/privacy","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"rss.xml","links":[],"scripts":[],"styles":[],"routeData":{"route":"/rss.xml","isIndex":false,"type":"endpoint","pattern":"^\\/rss\\.xml\\/?$","segments":[[{"content":"rss.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/rss.xml.ts","pathname":"/rss.xml","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"seo-ops/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/seo-ops","isIndex":false,"type":"page","pattern":"^\\/seo-ops\\/?$","segments":[[{"content":"seo-ops","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/seo-ops.astro","pathname":"/seo-ops","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"sitemap-index.xml","links":[],"scripts":[],"styles":[],"routeData":{"route":"/sitemap-index.xml","isIndex":false,"type":"endpoint","pattern":"^\\/sitemap-index\\.xml\\/?$","segments":[[{"content":"sitemap-index.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/sitemap-index.xml.ts","pathname":"/sitemap-index.xml","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"site":"https://dumbmoney.io","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/Helo Uss Uss/OneDrive/Desktop/DUMB_MONEY/Dumbmoney/src/pages/about.astro",{"propagation":"none","containsHead":true}],["C:/Users/Helo Uss Uss/OneDrive/Desktop/DUMB_MONEY/Dumbmoney/src/pages/corrections.astro",{"propagation":"none","containsHead":true}],["C:/Users/Helo Uss Uss/OneDrive/Desktop/DUMB_MONEY/Dumbmoney/src/pages/data/pfof-routing-dataset.astro",{"propagation":"none","containsHead":true}],["C:/Users/Helo Uss Uss/OneDrive/Desktop/DUMB_MONEY/Dumbmoney/src/pages/explainers/how-pfof-works.astro",{"propagation":"none","containsHead":true}],["C:/Users/Helo Uss Uss/OneDrive/Desktop/DUMB_MONEY/Dumbmoney/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/Helo Uss Uss/OneDrive/Desktop/DUMB_MONEY/Dumbmoney/src/pages/methodology.astro",{"propagation":"none","containsHead":true}],["C:/Users/Helo Uss Uss/OneDrive/Desktop/DUMB_MONEY/Dumbmoney/src/pages/pfof-calculator.astro",{"propagation":"none","containsHead":true}],["C:/Users/Helo Uss Uss/OneDrive/Desktop/DUMB_MONEY/Dumbmoney/src/pages/pfof/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/Helo Uss Uss/OneDrive/Desktop/DUMB_MONEY/Dumbmoney/src/pages/press.astro",{"propagation":"none","containsHead":true}],["C:/Users/Helo Uss Uss/OneDrive/Desktop/DUMB_MONEY/Dumbmoney/src/pages/privacy.astro",{"propagation":"none","containsHead":true}],["C:/Users/Helo Uss Uss/OneDrive/Desktop/DUMB_MONEY/Dumbmoney/src/pages/seo-ops.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/api/indexnow@_@ts":"pages/api/indexnow.astro.mjs","\u0000@astro-page:src/pages/api/waitlist@_@ts":"pages/api/waitlist.astro.mjs","\u0000@astro-page:src/pages/corrections@_@astro":"pages/corrections.astro.mjs","\u0000@astro-page:src/pages/data/pfof-routing-dataset@_@astro":"pages/data/pfof-routing-dataset.astro.mjs","\u0000@astro-page:src/pages/explainers/how-pfof-works@_@astro":"pages/explainers/how-pfof-works.astro.mjs","\u0000@astro-page:src/pages/methodology@_@astro":"pages/methodology.astro.mjs","\u0000@astro-page:src/pages/pfof/index@_@astro":"pages/pfof.astro.mjs","\u0000@astro-page:src/pages/pfof-calculator@_@astro":"pages/pfof-calculator.astro.mjs","\u0000@astro-page:src/pages/press@_@astro":"pages/press.astro.mjs","\u0000@astro-page:src/pages/privacy@_@astro":"pages/privacy.astro.mjs","\u0000@astro-page:src/pages/rss.xml@_@ts":"pages/rss.xml.astro.mjs","\u0000@astro-page:src/pages/seo-ops@_@astro":"pages/seo-ops.astro.mjs","\u0000@astro-page:src/pages/sitemap-index.xml@_@ts":"pages/sitemap-index.xml.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_DhzOLwQD.mjs","/astro/hoisted.js?q=0":"_astro/hoisted.DkxZ5PLr.js","/astro/hoisted.js?q=1":"_astro/hoisted.CtHeoN-f.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/about.DyXcGo65.css","/dumb-money-logo-square.png","/dumb-money-logo.png","/favicon.png","/favicon.svg","/llms-full.txt","/llms.txt","/og-image.png","/robots.txt","/about/index.html","/api/indexnow","/api/waitlist","/corrections/index.html","/data/pfof-routing-dataset/index.html","/explainers/how-pfof-works/index.html","/methodology/index.html","/pfof/index.html","/pfof-calculator/index.html","/press/index.html","/privacy/index.html","/rss.xml","/seo-ops/index.html","/sitemap-index.xml","/index.html"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"jt5JvrVRb5cmVL2p5ZIvrmE//D9NAVUs+9qGCl5PBjk=","experimentalEnvGetSecretEnabled":false});

export { manifest };
