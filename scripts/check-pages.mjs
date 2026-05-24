// Postbuild guard: fail the build if any content page didn't render to dist.
//
// Why this exists: on 2026-05-24 a flaky Cloudflare build non-deterministically
// dropped content-collection pages during render (memory pressure — the 36k-line
// book.md rendering to 4.2MB HTML was the trigger). The slug-validation that had
// been failing those builds was actually a safety net; when we bypassed it with
// link: refs, incomplete builds started DEPLOYING with pages 404ing. Nothing
// counted the pages and refused to ship a short build.
//
// This guard counts the .md/.mdx content sources under src/content/docs/ and
// verifies each produced an index.html in dist/. Any miss fails the build —
// so an incomplete build never deploys; Cloudflare keeps the last good one.
//
// Lesson (third time today): codified gates beat hoping. A missing page is a
// build failure, not a silent 404 in production.

import { readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { existsSync } from "node:fs";

const SRC = "src/content/docs";
const DIST = "dist";

if (!existsSync(SRC)) {
  console.error(`check-pages: source missing: ${SRC}`);
  process.exit(1);
}
if (!existsSync(DIST)) {
  console.error(`check-pages: dist missing: ${DIST} (did astro build run?)`);
  process.exit(1);
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (entry.isFile() && (entry.name.endsWith(".md") || entry.name.endsWith(".mdx"))) {
      out.push(full);
    }
  }
  return out;
}

// Map a content source path to the index.html Starlight should have emitted.
//   src/content/docs/index.mdx                        -> dist/index.html
//   src/content/docs/blog/topology.md                 -> dist/blog/topology/index.html
//   src/content/docs/blog/story/prologue.md           -> dist/blog/story/prologue/index.html
function expectedHtml(srcPath) {
  let rel = relative(SRC, srcPath).replace(/\.(md|mdx)$/, "");
  if (rel === "index") return join(DIST, "index.html");
  if (rel.endsWith("/index")) rel = rel.slice(0, -"/index".length);
  return join(DIST, rel, "index.html");
}

const sources = await walk(SRC);
const missing = [];
for (const src of sources) {
  const html = expectedHtml(src);
  if (!existsSync(html)) {
    missing.push({ src: relative(".", src), html: relative(".", html) });
  }
}

if (missing.length > 0) {
  console.error(`check-pages: ✘ ${missing.length} content page(s) did NOT render to dist:`);
  for (const m of missing) {
    console.error(`    ${m.src}  →  expected  ${m.html}  (MISSING)`);
  }
  console.error(`check-pages: build is incomplete — refusing to let it deploy.`);
  console.error(`If this is the Cloudflare flaky-render issue, retry the deploy; a complete build will pass.`);
  process.exit(1);
}

console.log(`check-pages: ✓ all ${sources.length} content pages rendered to dist.`);
