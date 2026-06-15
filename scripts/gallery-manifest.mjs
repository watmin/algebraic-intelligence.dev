#!/usr/bin/env node
//
// gallery-manifest — build src/gallery-manifest.json from the staged
// ~/grok-imagine/by-prompt/<slug>/ folders.
//
//   { "<slug>": { "prompt": "<verbatim prompt>", "images": ["<R2 url>", ...] } }
//
// The Gallery component imports this and renders each Incantatio's prompt (in a
// plain <pre> it fully controls — never wraps) plus its images straight from R2.
// The repo carries only this JSON, never the image bytes. Re-run after an upload.
//
// Usage:  node scripts/gallery-manifest.mjs

import { readFile, readdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const ROOT = process.env.GROK_DIR || join(homedir(), "grok-imagine");
const BY = join(ROOT, "by-prompt");
const OUT = "src/gallery-manifest.json";

const env = await readFile(join(ROOT, "r2.env"), "utf-8");
const base = (env.match(/^R2_PUBLIC_BASE=(.+)$/m) || [])[1]?.trim().replace(/\/+$/, "");
if (!base) {
  console.error("R2_PUBLIC_BASE is not set in r2.env");
  process.exit(1);
}

const manifest = {};
for (const slug of (await readdir(BY)).sort()) {
  let files;
  try {
    files = await readdir(join(BY, slug));
  } catch {
    continue; // not a directory
  }
  const imgs = files.filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f)).sort();
  if (!imgs.length) continue;
  let prompt = "";
  try {
    prompt = (await readFile(join(BY, slug, "_prompt.txt"), "utf-8")).trimEnd();
  } catch {}
  manifest[slug] = { prompt, images: imgs.map((f) => `${base}/${slug}/${f}`) };
}

const { writeFile } = await import("node:fs/promises");
await writeFile(OUT, JSON.stringify(manifest, null, 2) + "\n");
const groups = Object.keys(manifest).length;
const urls = Object.values(manifest).reduce((a, e) => a + e.images.length, 0);
const withPrompt = Object.values(manifest).filter((e) => e.prompt).length;
console.log(`wrote ${OUT}: ${groups} Incantationes, ${urls} image URLs, ${withPrompt} with prompts`);
