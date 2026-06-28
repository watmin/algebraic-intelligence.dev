#!/usr/bin/env node
//
// grok-organize — stage CORE (datamancy) images by Incantatio, for culling.
//
// Reads the scaffolded gallery pages for the slug↔prompt map, filters the grok
// manifest to datamancy prompts (Inquisitor / Shadowdancer / datamancer), groups
// the images by prompt → slug, and SYMLINKS each into
//   ~/grok-imagine/by-prompt/<slug>/
// plus a _prompt.txt per folder. Browse one prompt's variants together, delete
// the rejects; the originals in media/ are never touched. The survivors are what
// the upload step pushes to R2.
//
// Usage:  node scripts/grok-organize.mjs

import { readFile, readdir, mkdir, symlink, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const ROOT = process.env.GROK_DIR || join(homedir(), "grok-imagine");
const MEDIA = join(ROOT, "media");
const OUT = join(ROOT, "by-prompt");
const MANIFEST = "src/gallery-manifest.json";
const CORE = /inquisitor|shadowdancer|datamancer|datamancy/i;
const norm = (s) => s.replace(/\s+/g, " ").trim().toLowerCase();

// slug -> prompt, read from the gallery manifest — the durable source of truth
// now that pages render the prompt from it rather than embedding a fence.
const promptToSlug = new Map();
const slugToPrompt = new Map();
{
  const manifest = JSON.parse(await readFile(MANIFEST, "utf-8"));
  for (const [slug, e] of Object.entries(manifest)) {
    if (e.prompt) {
      promptToSlug.set(norm(e.prompt), slug);
      slugToPrompt.set(slug, e.prompt);
    }
  }
}
const keys = [...promptToSlug.keys()];
const slugFor = (p) => {
  const k = norm(p);
  if (promptToSlug.has(k)) return promptToSlug.get(k);
  const head = k.slice(0, 80);
  const hit = keys.find((ek) => ek.startsWith(head) || k.startsWith(ek.slice(0, 80)));
  return hit ? promptToSlug.get(hit) : null;
};

const manifest = JSON.parse(await readFile(join(ROOT, "manifest.json"), "utf-8")).posts;

if (existsSync(OUT)) await rm(OUT, { recursive: true });
await mkdir(OUT, { recursive: true });

const SHOW_UNMATCHED = process.argv.includes("--show-unmatched");
const counts = {};
let unmatched = 0;
const unmatchedByPrompt = new Map(); // norm(prompt) -> { prompt, n } — the same grouping the seed scripts' `news` uses
for (const id in manifest) {
  const p = manifest[id].prompt || "";
  if (!CORE.test(p)) continue;
  const slug = slugFor(p);
  if (!slug) {
    unmatched++;
    const k = norm(p);
    if (!unmatchedByPrompt.has(k)) unmatchedByPrompt.set(k, { prompt: p, n: 0 });
    unmatchedByPrompt.get(k).n++;
    continue;
  }
  const dir = join(OUT, slug);
  if (!counts[slug]) {
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, "_prompt.txt"), slugToPrompt.get(slug) + "\n");
    counts[slug] = 0;
  }
  const target = join(MEDIA, `${id}.jpg`);
  if (existsSync(target)) {
    try {
      await symlink(target, join(dir, `${id}.jpg`));
    } catch {}
    counts[slug]++;
  }
}

const slugs = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
const total = Object.values(counts).reduce((a, b) => a + b, 0);
console.log(`staged ${total} CORE images into ${slugs.length} prompt folders under:`);
console.log(`  ${OUT}/\n`);
for (const s of slugs) console.log(`  ${String(counts[s]).padStart(3)}  ${s}`);
if (unmatched) {
  console.log(`\n${unmatched} CORE image(s) didn't match a page prompt (skipped — tell me and I'll widen the match).`);
  if (SHOW_UNMATCHED) {
    // index order matches the seed scripts' `news` (same manifest insertion order → same stable tie order),
    // so the printed #i IS the index a seed-batch NAMES row must sit at.
    const news = [...unmatchedByPrompt.values()].sort((a, b) => b.n - a.n);
    console.log(`\n${news.length} distinct unmatched prompt(s) — verbatim, in seed-script \`news\` index order (count desc):\n`);
    news.forEach((e, i) => {
      console.log(`#${String(i).padStart(2)}  [${String(e.n).padStart(2)} img]  ${e.prompt.replace(/\s+/g, " ").trim()}\n`);
    });
  } else {
    console.log(`(re-run with --show-unmatched to print the distinct unmatched prompts verbatim, for naming a seed-batch.)`);
  }
}
console.log(`\nCull:  open ${OUT}/ in a file manager → delete rejects → keep favorites.`);
console.log(`Then I upload the survivors to R2 and build the gallery manifest.`);
