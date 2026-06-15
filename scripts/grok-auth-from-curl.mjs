#!/usr/bin/env node
//
// grok-auth-from-curl — turn a browser "Copy as cURL (bash)" into the auth file
// grok-fetch.mjs reads. Refreshing creds is then: copy the cURL from DevTools,
// paste it into ~/grok-imagine/curl.txt, run this — no hand-editing JSON.
//
// What expires: cf_clearance / __cf_bm (Cloudflare, short-lived) are why a later
// run 403s; sso (session JWT) lasts much longer. Re-copying the cURL refreshes
// the short ones — it is NOT a re-login.
//
// Usage:  node scripts/grok-auth-from-curl.mjs [curl-file]
//   default file: ~/grok-imagine/curl.txt   (or pipe the cURL on stdin)
// Prints WHICH key cookies are present — never their values.

import { readFile, writeFile, chmod } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const ROOT = process.env.GROK_DIR || join(homedir(), "grok-imagine");
const src = process.argv[2] || join(ROOT, "curl.txt");

let text;
try {
  text = await readFile(src, "utf-8");
} catch {
  text = await readFile(0, "utf-8"); // stdin fallback
}

// Chrome's bash cURL uses single-quoted args; cookies/headers here carry no
// embedded single quotes, so a simple single-quote capture is sufficient.
const headers = {};
for (const m of text.matchAll(/-H\s+'([^']*)'/g)) {
  const i = m[1].indexOf(":");
  if (i > 0) headers[m[1].slice(0, i).trim().toLowerCase()] = m[1].slice(i + 1).trim();
}

let cookie = "";
const b = text.match(/(?:-b|--cookie)\s+'([^']*)'/);
if (b) cookie = b[1];
else if (headers["cookie"]) cookie = headers["cookie"];

if (!cookie) {
  console.error("no cookie found (expected -b '...' or -H 'cookie: ...')");
  process.exit(1);
}

const auth = {
  cookie,
  statsigId: headers["x-statsig-id"] || "",
  userAgent: headers["user-agent"] || "Mozilla/5.0",
};

const out = join(ROOT, "auth.json");
await writeFile(out, JSON.stringify(auth, null, 2) + "\n");
await chmod(out, 0o600);

const names = new Set(cookie.split(";").map((c) => c.split("=")[0].trim()));
const want = ["sso", "sso-rw", "cf_clearance", "__cf_bm", "x-userid"];
console.log(`auth.json updated (${out}, chmod 600).`);
console.log("cookies present:", want.map((w) => `${w}:${names.has(w) ? "✓" : "✗"}`).join("  "));
console.log(`statsigId: ${auth.statsigId ? "✓" : "✗ MISSING"}   userAgent: ${auth.userAgent.slice(0, 38)}…`);
