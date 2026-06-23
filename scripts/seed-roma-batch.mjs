#!/usr/bin/env node
//
// seed-roma-batch — the "Roma Aeterna" batch (2026-06-23): a futuristic
// Greco-Roman cyberpunk world where Rome never fell. 3 scene prompts (no poster
// top-text), hand-named into a new "Roma Aeterna" group. Same self-validating
// pattern as seed-pantheon-batch: each name's anchor substring must land 1:1 on
// exactly its prompt, or it refuses to write.
//
//   node scripts/seed-roma-batch.mjs            # validate only
//   node scripts/seed-roma-batch.mjs --apply    # seed + emit scaffold inputs

import { readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const ROOT = process.env.GROK_DIR || join(homedir(), "grok-imagine");
const GAL = "src/gallery-manifest.json";
const CORE = /inquisitor|shadowdancer|datamancer|datamancy/i;
const norm = (s) => s.replace(/\s+/g, " ").trim().toLowerCase();
const APPLY = process.argv.includes("--apply");

// index-ordered (by image count desc). group "roma" → the new "Roma Aeterna" nav group.
const NAMES = [
  { check: "walk through a crowded, neon-lit marble street",                  group: "roma", slug: "roma-aeterna-neon-street",  title: "The Neon Forum" },
  { check: "walking down the grand marble steps of the Aetherium Datavatum",  group: "roma", slug: "roma-aeterna-temple-steps", title: "The Temple Steps" },
  { check: "stand together on a grand marble terrace overlooking",            group: "roma", slug: "roma-aeterna-terrace",      title: "The City Overlook" },
];

const gal = JSON.parse(await readFile(GAL, "utf-8"));
const existing = new Set(Object.values(gal).map((e) => norm(e.prompt || "")));
const heads = [...existing].map((k) => k.slice(0, 80));
const matchEx = (p) => {
  const k = norm(p);
  if (existing.has(k)) return true;
  const h = k.slice(0, 80);
  return heads.some((eh) => eh.startsWith(h) || k.startsWith(eh));
};

const posts = JSON.parse(await readFile(join(ROOT, "manifest.json"), "utf-8")).posts;
const by = new Map();
for (const id in posts) {
  const p = posts[id].prompt || "";
  if (!CORE.test(p)) continue;
  const k = norm(p);
  if (!by.has(k)) by.set(k, { prompt: p, n: 0 });
  by.get(k).n++;
}
const news = [...by.values()].filter((e) => !matchEx(e.prompt)).sort((a, b) => b.n - a.n);

const errs = [];
if (news.length !== NAMES.length) errs.push(`count drift: ${news.length} new prompts vs ${NAMES.length} NAMES`);
const slugs = new Set();
NAMES.forEach((row, i) => {
  if (slugs.has(row.slug)) errs.push(`dup slug: ${row.slug}`);
  slugs.add(row.slug);
  if (gal[row.slug]) errs.push(`slug already a page: ${row.slug}`);
  const c = norm(row.check);
  const hits = news.map((e, j) => (norm(e.prompt).includes(c) ? j : -1)).filter((j) => j >= 0);
  if (hits.length !== 1) errs.push(`[${i}] ${row.slug}: check matched ${hits.length} (want 1)`);
  else if (hits[0] !== i) errs.push(`[${i}] ${row.slug}: lands on #${hits[0]}, not #${i}`);
});
if (errs.length) {
  console.error("VALIDATION FAILED:\n  " + errs.join("\n  "));
  process.exit(1);
}
console.log(`✓ validated: ${NAMES.length} names align 1:1 with the ${news.length} new prompts.\n`);
NAMES.forEach((r, i) => console.log(`  ${String(news[i].n).padStart(2)}  ${r.slug.padEnd(26)} ${r.title}`));

if (!APPLY) {
  console.log("\n(validate-only — re-run with --apply)");
  process.exit(0);
}

const extract = [];
const namesOut = [];
NAMES.forEach((row, i) => {
  gal[row.slug] = { prompt: news[i].prompt, images: [] };
  extract.push({ id: row.slug, prompt: news[i].prompt, defaultSlug: row.slug, defaultTitle: row.title });
  namesOut.push({ id: row.slug, slug: row.slug, title: row.title });
});
await writeFile(GAL, JSON.stringify(gal, null, 2) + "\n");
await writeFile("/tmp/incantatio-extract.json", JSON.stringify(extract, null, 2) + "\n");
await writeFile("/tmp/incantatio-names.json", JSON.stringify(namesOut, null, 2) + "\n");
await writeFile("/tmp/roma-nav.txt", NAMES.map((r) => `                { slug: "fenestra-aetherii/${r.slug}" },`).join("\n") + "\n");
console.log(`\n✓ seeded ${NAMES.length}; scaffold inputs → /tmp; nav → /tmp/roma-nav.txt`);
