#!/usr/bin/env node
//
// check-page-size — the size wall. A rendered page that is too large is a
// build-memory hazard, and this site has been bitten twice.
//
// `check-pages` verifies that each content source PRODUCED a page. It never
// measures what it produced. That gap is how two pages grew until they broke
// the build:
//
//   - the arc-170 realizations rendered to ~3.5 MB and had to be chunked
//     (206 pages, via mirror-monoliths)
//   - the BOOK rendered to 4.2 MB and was moved out of the content collection
//     entirely, served as a static .md
//
// Both were BUILD-MEMORY hogs, not Cloudflare rejections — the failure mode is
// Astro's content layer under a constrained container (the same class as the
// Node 20 truncation that shipped a two-thirds-empty site). So the wall is set
// against measured reality, not a platform cap:
//
//   measured 2026-09-07 over 555 rendered pages —
//     535 under 256 KB · 15 at 256-512 KB · 4 at 512 KB-1 MB · 1 over 1 MB
//     (largest: 300-wat-source-is-edn at 1.10 MB)
//
// HARD at 1.5 MB: nothing today exceeds it, and it sits well under the 3.5 MB
// that actually broke us. WARN at 1.0 MB so drift surfaces before it fails.
//
// The routine defence is the FRAGMENTER (mirror-realizations chunks any source
// over 250 KB). This wall is the backstop: in normal operation it never fires.
//
// Also checks the two Cloudflare Pages deployment caps, which are real limits
// rather than judgement calls: 25 MiB per file and 20,000 files per deployment.
// Assets are WARNED, never failed — media is the builder's call, not this
// script's.

import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

const DIST = "dist";
const MB = 1024 * 1024;

const PAGE_HARD = 1.5 * MB; // fail the build
const PAGE_WARN = 1.0 * MB; // surface drift
const CF_FILE_CAP = 25 * MB; // Cloudflare Pages: max file size
const CF_FILE_WARN = 20 * MB; // approaching it
const CF_FILE_COUNT = 20000; // Cloudflare Pages: max files per deployment

const fmt = (b) => `${(b / MB).toFixed(2)} MB`;

async function walk(dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = await walk(DIST);
const sized = await Promise.all(
  files.map(async (f) => ({ path: f, size: (await stat(f)).size })),
);

const pages = sized.filter((f) => f.path.endsWith(".html"));
const overHard = pages.filter((f) => f.size > PAGE_HARD).sort((a, b) => b.size - a.size);
const overWarn = pages
  .filter((f) => f.size > PAGE_WARN && f.size <= PAGE_HARD)
  .sort((a, b) => b.size - a.size);

const assetsOverCap = sized.filter((f) => f.size > CF_FILE_CAP);
const assetsNearCap = sized
  .filter((f) => f.size > CF_FILE_WARN && f.size <= CF_FILE_CAP)
  .sort((a, b) => b.size - a.size);

let failed = false;

if (overHard.length) {
  failed = true;
  console.error(
    `[check-page-size] FAIL — ${overHard.length} page(s) over the ${fmt(PAGE_HARD)} wall:`,
  );
  for (const f of overHard) {
    console.error(`  ${fmt(f.size).padStart(9)}  ${f.path}`);
  }
  console.error(
    `[check-page-size] a page this large is a build-memory hazard (arc-170 broke at ~3.5 MB).`,
  );
  console.error(
    `[check-page-size] fix: chunk the SOURCE, don't raise the wall. Realizations sources over`,
  );
  console.error(
    `[check-page-size] 250 KB are fragmented by mirror-realizations; monoliths by mirror-monoliths.`,
  );
}

if (assetsOverCap.length) {
  failed = true;
  console.error(
    `[check-page-size] FAIL — ${assetsOverCap.length} file(s) over Cloudflare's ${fmt(CF_FILE_CAP)} per-file cap:`,
  );
  for (const f of assetsOverCap) console.error(`  ${fmt(f.size).padStart(9)}  ${f.path}`);
}

if (files.length > CF_FILE_COUNT) {
  failed = true;
  console.error(
    `[check-page-size] FAIL — ${files.length} files exceeds Cloudflare's ${CF_FILE_COUNT}-file deployment cap.`,
  );
}

for (const f of overWarn) {
  console.error(`  ⚠ page ${fmt(f.size)} (warn ≥ ${fmt(PAGE_WARN)}): ${f.path}`);
}
for (const f of assetsNearCap) {
  console.error(
    `  ⚠ file ${fmt(f.size)} is ${((f.size / CF_FILE_CAP) * 100).toFixed(0)}% of Cloudflare's ${fmt(CF_FILE_CAP)} per-file cap: ${f.path}`,
  );
}

if (failed) process.exit(1);

const largest = pages.sort((a, b) => b.size - a.size)[0];
console.error(
  `[check-page-size] ✓ ${pages.length} pages under the ${fmt(PAGE_HARD)} wall (largest ${fmt(largest.size)}) · ${files.length}/${CF_FILE_COUNT} files`,
);
