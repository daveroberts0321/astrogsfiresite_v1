import '@astrojs/internal-helpers/path';
import 'kleur/colors';
import { p as NOOP_MIDDLEWARE_HEADER, q as decodeKey } from './chunks/astro/server_Yi5bUcOU.mjs';
import 'clsx';
import 'cookie';
import 'es-module-lexer';
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
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
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

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/dave/coding/Astro/gsfiresite_v1/","cacheDir":"file:///C:/Users/dave/coding/Astro/gsfiresite_v1/node_modules/.astro/","outDir":"file:///C:/Users/dave/coding/Astro/gsfiresite_v1/dist/","srcDir":"file:///C:/Users/dave/coding/Astro/gsfiresite_v1/src/","publicDir":"file:///C:/Users/dave/coding/Astro/gsfiresite_v1/public/","buildClientDir":"file:///C:/Users/dave/coding/Astro/gsfiresite_v1/dist/","buildServerDir":"file:///C:/Users/dave/coding/Astro/gsfiresite_v1/.netlify/build/","adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/category_id_.Bmbk-3Ef.css"}],"routeData":{"route":"/category_[id]","isIndex":false,"type":"page","pattern":"^\\/category_([^/]+?)\\/?$","segments":[[{"content":"category_","dynamic":false,"spread":false},{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/category_[id].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/category_id_.Bmbk-3Ef.css"}],"routeData":{"route":"/product_[id]","isIndex":false,"type":"page","pattern":"^\\/product_([^/]+?)\\/?$","segments":[[{"content":"product_","dynamic":false,"spread":false},{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/product_[id].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/category_id_.Bmbk-3Ef.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/dave/coding/Astro/gsfiresite_v1/src/pages/category_[id].astro",{"propagation":"none","containsHead":true}],["C:/Users/dave/coding/Astro/gsfiresite_v1/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/dave/coding/Astro/gsfiresite_v1/src/pages/product_[id].astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-page:src/pages/category_[id]@_@astro":"pages/category__id_.astro.mjs","\u0000@astro-page:src/pages/product_[id]@_@astro":"pages/product__id_.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_B3xxxfBr.mjs","C:/Users/dave/coding/Astro/gsfiresite_v1/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_oJaSgReT.mjs","C:/Users/dave/coding/Astro/gsfiresite_v1/src/pages/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.FBJJiIZS.js","C:/Users/dave/coding/Astro/gsfiresite_v1/src/pages/product_[id].astro?astro&type=script&index=0&lang.ts":"_astro/product__id_.astro_astro_type_script_index_0_lang.Njx9s3lD.js","C:/Users/dave/coding/Astro/gsfiresite_v1/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts":"_astro/Layout.astro_astro_type_script_index_0_lang.Dz1eUK_Y.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["C:/Users/dave/coding/Astro/gsfiresite_v1/src/pages/index.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"DOMContentLoaded\",()=>{const s=document.getElementById(\"newsletter-form\"),e=document.getElementById(\"form-message\");s&&e&&s.addEventListener(\"submit\",async a=>{a.preventDefault();const n=new FormData(s);try{const t=await fetch(\"/api/submitEmail\",{method:\"POST\",body:n});if(e.classList.remove(\"hidden\"),t.ok){const r=await t.json();e.textContent=r.message||\"Thank you for subscribing!\",e.className=\"mt-2 text-sm text-green-500\",s.reset()}else{const r=await t.json();e.textContent=r.message||\"An error occurred. Please try again.\",e.className=\"mt-2 text-sm text-red-500\"}}catch(t){console.error(\"Error:\",t),e.classList.remove(\"hidden\"),e.textContent=\"An error occurred. Please try again later.\",e.className=\"mt-2 text-sm text-red-500\"}})});"],["C:/Users/dave/coding/Astro/gsfiresite_v1/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts","const o=document.getElementById(\"mobile-menu-button\"),s=document.getElementById(\"mobile-menu\"),r=document.querySelector(\".menu-open\"),m=document.querySelector(\".menu-close\");o&&s&&r&&m&&o.addEventListener(\"click\",()=>{s.classList.toggle(\"hidden\"),r.classList.toggle(\"hidden\"),m.classList.toggle(\"hidden\")});const n=document.getElementById(\"newsletter-form\"),e=document.getElementById(\"form-message\");n&&e&&n.addEventListener(\"submit\",async c=>{c.preventDefault();const a=new FormData(n);try{const t=await fetch(\"/api/submitEmail\",{method:\"POST\",body:a});if(e.classList.remove(\"hidden\"),t.ok)e.textContent=\"Thank you for subscribing!\",e.className=\"mt-2 text-sm text-green-500\",n.reset();else{const l=await t.json();e.textContent=l.message||\"An error occurred. Please try again.\",e.className=\"mt-2 text-sm text-red-500\"}}catch(t){console.error(\"Error:\",t),e.classList.remove(\"hidden\"),e.textContent=\"An error occurred. Please try again later.\",e.className=\"mt-2 text-sm text-red-500\"}});"]],"assets":["/_astro/category_id_.Bmbk-3Ef.css","/favicon.svg","/_astro/product__id_.astro_astro_type_script_index_0_lang.Njx9s3lD.js"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"N1Dpjb9Tmo8Eslp1m4t7XHdZqX6MuxSfYV6DWVmXFgs="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
