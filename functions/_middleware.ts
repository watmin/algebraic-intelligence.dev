// Cloudflare Pages middleware — content negotiation for markdown.
//
// When a request comes in with `Accept: text/markdown` preferred, and the URL
// has a `.md` companion in our static assets, serve the companion instead of
// the HTML page. Same URL, exact source markdown, no HTML round-trip.
//
// The `.md` companions are mirrored from `src/content/docs/blog/` during the
// build (see `scripts/copy-markdown.mjs`). They live at predictable paths:
//
//   /blog/topology/         → /blog/topology.md
//   /blog/book/             → /blog/book.md
//   /blog/story/<slug>/     → /blog/story/<slug>.md
//   /blog/primers/<slug>/   → /blog/primers/<slug>.md
//
// Pages with no markdown companion (homepage, projects/*, demos/*) fall
// through unchanged — Cloudflare's hosted "Markdown for Agents" feature
// (dashboard toggle) handles those if enabled.

interface Env {
  ASSETS: Fetcher;
}

/**
 * Returns true if the Accept header prefers `text/markdown` over `text/html`.
 * Handles q-values: `text/html;q=0.5, text/markdown;q=1.0` → markdown wins.
 */
function prefersMarkdown(accept: string): boolean {
  if (!accept) return false;

  let mdQ = -1;
  let htmlQ = -1;

  for (const part of accept.split(",")) {
    const [type, ...params] = part.trim().split(";").map((s) => s.trim());
    if (!type) continue;

    let q = 1;
    for (const param of params) {
      if (param.startsWith("q=")) {
        const parsed = parseFloat(param.slice(2));
        if (!isNaN(parsed)) q = parsed;
      }
    }

    if (type === "text/markdown") mdQ = Math.max(mdQ, q);
    else if (type === "text/html") htmlQ = Math.max(htmlQ, q);
    else if (type === "*/*") {
      // Generic catch-all — let an explicit text/markdown win against it
      if (mdQ < 0) mdQ = Math.max(mdQ, q * 0.5);
    }
  }

  return mdQ > 0 && mdQ >= htmlQ;
}

/**
 * Map an HTML page path to its markdown companion path.
 * Returns `null` if the path doesn't have a companion under our convention.
 */
function markdownCompanionPath(pathname: string): string | null {
  // Homepage — serve llms.txt as the agent-curated markdown summary.
  // The homepage is index.mdx (MDX with React-flavored components), so there's
  // no pure-markdown source to mirror. llms.txt IS the agent-facing index of
  // the site: structured pointer map, same content the homepage conveys, written
  // for agents to consume directly.
  if (pathname === "/" || pathname === "") return "/llms.txt";

  // Blog pages — companions mirrored from src/content/docs/blog/ during build
  if (!pathname.startsWith("/blog/")) return null;
  // Already a .md URL — no rewrite needed
  if (pathname.endsWith(".md")) return null;
  // Directory listings or root-blog index — no companion
  if (pathname === "/blog/" || pathname === "/blog") return null;

  // Strip trailing slash, append .md
  const base = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  return `${base}.md`;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const accept = request.headers.get("Accept") || "";

  // Fast path: not a GET/HEAD, or doesn't want markdown — fall through
  if (request.method !== "GET" && request.method !== "HEAD") {
    return next();
  }
  if (!prefersMarkdown(accept)) {
    return next();
  }

  const mdPath = markdownCompanionPath(url.pathname);
  if (!mdPath) {
    return next();
  }

  // Fetch the .md companion from static assets
  const mdUrl = new URL(mdPath, url.origin);
  const mdRequest = new Request(mdUrl.toString(), {
    method: request.method,
    headers: request.headers,
  });
  const response = await env.ASSETS.fetch(mdRequest);

  // If the companion doesn't exist (404), fall through to the HTML page
  if (!response.ok) {
    return next();
  }

  // Return with explicit markdown content-type + Vary so caches handle it
  const headers = new Headers(response.headers);
  headers.set("Content-Type", "text/markdown; charset=utf-8");
  headers.set("Vary", "Accept");
  headers.set("X-Markdown-Source", mdPath);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
