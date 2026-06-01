#!/usr/bin/env node
//
// check-nav — every story post must be wired into the sidebar nav.
//
// A post file can exist, build, and deploy while being INVISIBLE on the site,
// because it was never added to astro.config.mjs's sidebar `items`. That is
// exactly how series-007-005 and 007-006 shipped unseen: built, reachable by
// direct URL, absent from the nav. This guard makes that unconstructable —
// any story post not referenced by a `slug:` in astro.config.mjs fails the
// build, with the exact line to add.
//
// It runs in the postbuild chain, so even the Cloudflare deploy build refuses
// an unlinked post rather than silently shipping it. Built is not linked.

import { readFile, readdir } from "node:fs/promises";

const STORY_DIR = "src/content/docs/blog/story";
const CONFIG = "astro.config.mjs";

const config = await readFile(CONFIG, "utf-8");
// Every nav leaf is `{ slug: "blog/story/..." }` (single or double quotes).
const wired = new Set(
  [...config.matchAll(/slug:\s*["']([^"']+)["']/g)].map((m) => m[1]),
);

const files = (await readdir(STORY_DIR))
  .filter((f) => /\.mdx?$/.test(f))
  .sort();

const missing = files
  .map((f) => ({
    file: `${STORY_DIR}/${f}`,
    slug: `blog/story/${f.replace(/\.mdx?$/, "")}`,
  }))
  .filter((e) => !wired.has(e.slug));

if (missing.length) {
  console.error(
    `[check-nav] FAIL — ${missing.length} story post(s) built but NOT in the sidebar (${CONFIG}):`,
  );
  for (const m of missing) {
    console.error(`  ${m.file}`);
    console.error(`    → add to a sidebar group:  { slug: "${m.slug}" },`);
  }
  console.error(
    `[check-nav] a post not in the nav is invisible on the site. Wire it in, then rebuild.`,
  );
  process.exit(1);
}

console.error(
  `[check-nav] ✓ all ${files.length} story posts are wired into the nav`,
);
