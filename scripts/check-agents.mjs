#!/usr/bin/env node
//
// check-agents: blog/agents.md is the agent interface CONTRACT ("every way an
// agent can consume this site") — and it once rotted silently: a hardcoded
// "latest is series-006" claim survived two eras, a field name went stale
// against its .well-known file, and a shipped interface (/auth.md) was never
// documented at all. This gate annihilates that class: the page can only go
// stale by turning the build red first.
//
// Four gates, each loud:
//   1. SURFACE COVERAGE — every agent-facing discovery file must be mentioned
//      on the page (a new .well-known file that isn't documented fails here).
//   2. QUOTED CLAIMS — the field names/values the page quotes must exist in the
//      live files (a file reshaped without updating the page fails here).
//   3. WEBMCP PARITY — the tool list in §4 must match what webmcp.js actually
//      registers, both directions.
//   4. ROT PATTERNS — moving-claims the page must never carry again (a
//      series-NNN "latest" placeholder), and the mechanisms it relies on must
//      exist (the middleware's per-slug alternate link).
//
// Run from repo root (postbuild does): node scripts/check-agents.mjs

import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const PAGE = "src/content/docs/blog/agents.md";
const problems = [];

const page = await readFile(PAGE, "utf-8");

// ---- Gate 1: surface coverage --------------------------------------------
// Every file under public/.well-known/ plus the named site-root surfaces.
async function walk(dir, prefix = "") {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...(await walk(join(dir, e.name), rel)));
    else out.push(rel);
  }
  return out;
}

for (const rel of await walk("public/.well-known")) {
  const path = `/.well-known/${rel}`;
  if (!page.includes(path)) {
    problems.push(`surface not documented: ${path} exists but is never mentioned in ${PAGE}`);
  }
}
for (const path of ["/auth.md", "/llms.txt", "/webmcp.js", "/sitemap-index.xml"]) {
  if (!page.includes(path)) {
    problems.push(`surface not documented: ${path} is never mentioned in ${PAGE}`);
  }
}

// ---- Gate 2: quoted claims vs live files ----------------------------------
const serverCard = JSON.parse(await readFile("public/.well-known/mcp/server-card.json", "utf-8"));
if (serverCard["x-static-server"] !== true) {
  problems.push(`server-card.json no longer carries x-static-server: true — the page's row quotes it`);
}
if (!page.includes("x-static-server")) {
  problems.push(`${PAGE} no longer quotes x-static-server — keep the row in step with server-card.json`);
}

const authServer = JSON.parse(await readFile("public/.well-known/oauth-authorization-server", "utf-8"));
if (!Array.isArray(authServer.grant_types_supported) || authServer.grant_types_supported.length !== 0) {
  problems.push(`oauth-authorization-server grant_types_supported is no longer empty — the page claims "no auth flows"`);
}
if (!authServer.agent_auth) {
  problems.push(`oauth-authorization-server lost its agent_auth block — the page documents it`);
}
if (!page.includes("agent_auth")) {
  problems.push(`${PAGE} no longer mentions agent_auth — keep the oauth row in step`);
}

const protectedResource = JSON.parse(await readFile("public/.well-known/oauth-protected-resource", "utf-8"));
if (protectedResource["x-authentication-required"] !== false) {
  problems.push(`oauth-protected-resource x-authentication-required is no longer false — the page claims nothing is gated`);
}
if (!page.includes("x-authentication-required")) {
  problems.push(`${PAGE} no longer quotes x-authentication-required — keep the oauth row in step`);
}

// ---- Gate 3: WebMCP tool parity (both directions) --------------------------
const webmcp = await readFile("public/webmcp.js", "utf-8");
const registered = [...webmcp.matchAll(/name:\s*"([^"]+)"/g)].map((m) => m[1]);
if (registered.length === 0) {
  problems.push(`no tools parsed from public/webmcp.js — the gate's regex or the file shape changed`);
}
for (const name of registered) {
  if (!page.includes(`\`${name}\``)) {
    problems.push(`webmcp.js registers "${name}" but ${PAGE} §4 doesn't list it`);
  }
}
const section4 = page.split("## 4.")[1]?.split("## 5.")[0] ?? "";
for (const m of section4.matchAll(/- \*\*`([^`]+)`\*\*/g)) {
  if (!registered.includes(m[1])) {
    problems.push(`${PAGE} §4 lists "${m[1]}" but webmcp.js doesn't register it`);
  }
}

// ---- Gate 4: rot patterns + load-bearing mechanisms -------------------------
// The "latest is series-NNN" moving-claim class: a series prefix with a
// placeholder suffix means the page is asserting a current-edge by number again.
if (/series-\d+-NNN/.test(page)) {
  problems.push(`${PAGE} hardcodes a "series-NNN" moving claim — point at llms.txt instead (it regenerates)`);
}
// robots.txt and the page must carry the same Content-Signal value.
const robots = await readFile("public/robots.txt", "utf-8");
const signal = robots.match(/^Content-Signal:\s*(.+)$/m)?.[1]?.trim();
if (!signal) {
  problems.push(`public/robots.txt no longer carries a Content-Signal line — the page documents one`);
} else if (!page.includes(signal)) {
  problems.push(`${PAGE} Content-Signal text doesn't match robots.txt ("${signal}")`);
}
// The §1 Link-header claim rides on the middleware emitting the alternate rel.
const middleware = await readFile("functions/_middleware.ts", "utf-8");
if (!middleware.includes('rel="alternate"')) {
  problems.push(`functions/_middleware.ts no longer emits rel="alternate" — the page's Link-header claim depends on it`);
}

// ---- verdict ----------------------------------------------------------------
if (problems.length) {
  console.error(`[check-agents] ✗ the agents page drifted from the interfaces it documents:`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.error(`[check-agents] ✓ ${PAGE} matches the live interfaces (surfaces, quoted claims, webmcp tools, signals)`);
