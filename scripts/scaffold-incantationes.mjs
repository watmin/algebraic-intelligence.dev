#!/usr/bin/env node
//
// scaffold-incantationes — write Fenestra Aetherii gallery pages from an
// extraction (extract-incantationes.mjs output) + an intueri names file.
//
// The gallery (src/content/docs/fenestra-aetherii/) files Grok Imagine art by
// the prompt that conjured it; each prompt-page is an "Incantatio". Pipeline:
//   1. extract-incantationes.mjs  → extract.json (every prompt, normalized)
//   2. intueri (cast)             → names.json   (crowned slug + title per id)
//   3. THIS script                → one .mdx page + one asset dir per prompt
//
// Usage:  node scripts/scaffold-incantationes.mjs <extract.json> <names.json>
//   extract.json: [{ id, prompt, defaultSlug, defaultTitle, ... }] (in delivery order)
//   names.json:   [{ id, slug, title }]  (intueri's names; override the defaults)
//
// Per entry, NEVER overwriting an existing page (idempotent across re-runs and
// future batches):
//   src/content/docs/fenestra-aetherii/<slug>.mdx   (title + verbatim prompt + <Gallery group>)
//   src/assets/fenestra-aetherii/<slug>/            (empty dir — drop the images here)
//
// The verbatim prompt is embedded in a ```text fence so it cannot break MDX.
// sidebar.order follows the extraction order, so the nav reads in delivery order.

import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { constants } from "node:fs";

const [, , extractPath, namesPath] = process.argv;
if (!extractPath || !namesPath) {
  console.error("usage: scaffold-incantationes.mjs <extract.json> <names.json>");
  process.exit(1);
}

const CONTENT_DIR = "src/content/docs/fenestra-aetherii";
const ASSET_DIR = "src/assets/fenestra-aetherii";

const extract = JSON.parse(await readFile(extractPath, "utf-8"));
const names = JSON.parse(await readFile(namesPath, "utf-8"));
const nameById = new Map(names.map((x) => [x.id, x]));

const exists = async (p) => {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

let created = 0;
let skipped = 0;
let order = 0;
for (const e of extract) {
  order++;
  const meta = nameById.get(e.id) || {};
  const slug = meta.slug || e.defaultSlug;
  const title = meta.title || e.defaultTitle;
  const page = `${CONTENT_DIR}/${slug}.mdx`;
  await mkdir(`${ASSET_DIR}/${slug}`, { recursive: true });
  if (await exists(page)) {
    console.log(`  = skip (exists): ${page}`);
    skipped++;
    continue;
  }
  const body = `---
title: ${JSON.stringify(title)}
description: ${JSON.stringify(`An Incantatio of the Fenestra Aetherii — ${title}.`)}
tableOfContents: false
sidebar:
  order: ${order}
---

import Gallery from '../../../components/Gallery.astro';

<Gallery group=${JSON.stringify(slug)} />
`;
  await writeFile(page, body, "utf-8");
  console.log(`  + ${slug.padEnd(28)} ${title}`);
  created++;
}

console.log(`\nscaffold: ${created} page(s) created, ${skipped} skipped.`);
