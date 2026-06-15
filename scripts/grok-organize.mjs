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

const counts = {};
let unmatched = 0;
for (const id in manifest) {
  const p = manifest[id].prompt || "";
  if (!CORE.test(p)) continue;
  const slug = slugFor(p);
  if (!slug) {
    unmatched++;
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
if (unmatched) console.log(`\n${unmatched} CORE image(s) didn't match a page prompt (skipped — tell me and I'll widen the match).`);
console.log(`\nCull:  open ${OUT}/ in a file manager → delete rejects → keep favorites.`);
console.log(`Then I upload the survivors to R2 and build the gallery manifest.`);
