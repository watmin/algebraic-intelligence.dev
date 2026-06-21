#!/usr/bin/env node
//
// seed-pantheon-batch — one-off, hand-authored names for the Greek-mythology
// ("The Pantheon") + isometric boss-fight batch (2026-06-21). Most Pantheon
// prompts self-name in their poster top-text, but they need `pantheon-` slugs to
// not collide with the propaganda "The Spells" pages, and 14 are themeless scenes
// that need hand names — so the whole batch is named explicitly here.
//
// SELF-VALIDATING: re-derives the new-prompt list (same logic as
// seed-incantationes-from-grok), then for every NAMES row asserts its `check`
// substring lands on EXACTLY ONE new prompt and that it's the row's index. Any
// misalignment, count drift, or slug collision aborts before a single write.
//
//   node scripts/seed-pantheon-batch.mjs            # validate only (no writes)
//   node scripts/seed-pantheon-batch.mjs --apply    # seed manifest + emit scaffold inputs

import { readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const ROOT = process.env.GROK_DIR || join(homedir(), "grok-imagine");
const GAL = "src/gallery-manifest.json";
const CORE = /inquisitor|shadowdancer|datamancer|datamancy/i;
const norm = (s) => s.replace(/\s+/g, " ").trim().toLowerCase();
const APPLY = process.argv.includes("--apply");

// index-ordered (by image count desc, the deterministic sort below). Each row:
//   { check, group, slug, title }   check = a substring unique to that one prompt.
const NAMES = [
  { check: "In a large multi-room ancient stone dungeon",                 group: "boss",     slug: "boss-kill-isometric",        title: "The Colossus — Isometric Boss Kill" },
  { check: 'Bold text at the top: "RECOLLIGERE"',                          group: "pantheon", slug: "pantheon-recolligere",        title: "Recolligere" },
  { check: "two younger divine agents carrying out their duties",         group: "pantheon", slug: "pantheon-the-college",        title: "The Divine College" },
  { check: 'Bold text at the top: "CURARE"',                              group: "pantheon", slug: "pantheon-curare",             title: "Curare" },
  { check: 'Bold text at the top: "EXAMINARE"',                           group: "pantheon", slug: "pantheon-examinare",          title: "Examinare" },
  { check: 'Bold text at the top: "CIRCUMSPICERE"',                       group: "pantheon", slug: "pantheon-circumspicere",      title: "Circumspicere" },
  { check: 'lettering: "THE GRIMOIRE"',                                   group: "pantheon", slug: "pantheon-the-grimoire",       title: "The Living Grimoire" },
  { check: 'Bold text at the top: "VOCARE"',                              group: "pantheon", slug: "pantheon-vocare",             title: "Vocare" },
  { check: 'Bold text at the top: "EXTIRPARE"',                           group: "pantheon", slug: "pantheon-extirpare",          title: "Extirpare" },
  { check: 'Bold text at the top: "CERNERE"',                             group: "pantheon", slug: "pantheon-cernere",            title: "Cernere" },
  { check: 'Bold text at the top: "COMPLECTENS"',                         group: "pantheon", slug: "pantheon-complectens",        title: "Complectens" },
  { check: "contemplates whether the code lives",                        group: "pantheon", slug: "pantheon-intueri-oracle",     title: "The Living Oracle" },
  { check: "balance the sacred proportions of computation",              group: "pantheon", slug: "pantheon-temperare-scene",    title: "The Sacred Proportions" },
  { check: 'Bold text at the top: "SOLVERE"',                             group: "pantheon", slug: "pantheon-solvere",            title: "Solvere" },
  { check: 'Bold text at the top: "SEQUI"',                               group: "pantheon", slug: "pantheon-sequi",              title: "Sequi" },
  { check: "perform the sacred act of purification",                     group: "pantheon", slug: "pantheon-purgare-scene",      title: "The Sacred Purification" },
  { check: "shaping error into unbreakable form",                        group: "pantheon", slug: "pantheon-conformare-forge",   title: "The Divine Forge" },
  { check: "perform the sacred unbinding",                               group: "pantheon", slug: "pantheon-solvere-unbinding",  title: "The Sacred Unbinding" },
  { check: "the Inquisitor and Shadowdancer follow the flow of state",   group: "pantheon", slug: "pantheon-sequi-flow",         title: "Follow the Flow of State" },
  { check: "Inside the vast archive halls",                              group: "pantheon", slug: "pantheon-recolligere-archive",title: "The Vast Archive" },
  { check: 'Bold text at the top: "VIGILIA"',                             group: "pantheon", slug: "pantheon-vigilia",            title: "Vigilia" },
  { check: 'Bold text at the top: "MORA"',                               group: "pantheon", slug: "pantheon-mora",               title: "Mora" },
  { check: 'Bold text at the top: "STRUERE"',                            group: "pantheon", slug: "pantheon-struere",            title: "Struere" },
  { check: 'Bold text at the top: "SECARE"',                             group: "pantheon", slug: "pantheon-secare",             title: "Secare" },
  { check: 'Bold text at the top: "CONFORMARE"',                         group: "pantheon", slug: "pantheon-conformare",         title: "Conformare" },
  { check: "the Inquisitor and Shadowdancer test what is built",         group: "pantheon", slug: "pantheon-struere-scene",      title: "Test What Is Built" },
  { check: "perform the sacred cut",                                     group: "pantheon", slug: "pantheon-secare-cut",         title: "The Sacred Cut" },
  { check: "A coherent, logically designed multi-room dungeon viewed from above. In the mid-ground", group: "boss", slug: "boss-kill-coherent-dungeon", title: "The Coherent Dungeon" },
  { check: 'Bold text at the top: "NESCIENS"',                           group: "pantheon", slug: "pantheon-nesciens",           title: "Nesciens" },
  { check: 'Bold text at the top: "TEMPERARE"',                          group: "pantheon", slug: "pantheon-temperare",          title: "Temperare" },
  { check: 'Bold text at the top: "PURGARE"',                            group: "pantheon", slug: "pantheon-purgare",            title: "Purgare" },
  { check: 'Bold text at the top: "INTUERI"',                            group: "pantheon", slug: "pantheon-intueri",            title: "Intueri" },
  { check: "execute a perfect dungeon crawl against a colossal boss entity", group: "pantheon", slug: "pantheon-examinare-boss", title: "The Colossal Crawl" },
  { check: "The scene shows a **coherent, logically designed multi-room dungeon**", group: "boss", slug: "boss-kill-logical-level", title: "The Logical Level" },
  { check: 'Bold text at the top: "PERSPICERE"',                         group: "pantheon", slug: "pantheon-perspicere",         title: "Perspicere" },
  { check: "In a corrupted wing of the Aetherium Datavatum",            group: "pantheon", slug: "pantheon-extirpare-roots",    title: "The Tangled Roots" },
  { check: "stand before a massive glowing chronicle-stone",            group: "pantheon", slug: "pantheon-curare-chronicle",   title: "The Chronicle-Stone" },
  { check: "a vast marble temple-academy",                              group: "pantheon", slug: "pantheon-grimoire-altar",     title: "The Living Grimoire (Altar)" },
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

// ---- validation -----------------------------------------------------------
const errs = [];
if (news.length !== NAMES.length) errs.push(`count drift: ${news.length} new prompts vs ${NAMES.length} NAMES rows`);
const slugs = new Set();
NAMES.forEach((row, i) => {
  if (slugs.has(row.slug)) errs.push(`dup slug in NAMES: ${row.slug}`);
  slugs.add(row.slug);
  if (gal[row.slug]) errs.push(`slug already a page: ${row.slug}`);
  const c = norm(row.check);
  const hits = news.map((e, j) => (norm(e.prompt).includes(c) ? j : -1)).filter((j) => j >= 0);
  if (hits.length !== 1) errs.push(`[${i}] ${row.slug}: check matched ${hits.length} prompts (want 1) — "${row.check.slice(0, 40)}"`);
  else if (hits[0] !== i) errs.push(`[${i}] ${row.slug}: check lands on prompt #${hits[0]}, not #${i} (misaligned)`);
});

if (errs.length) {
  console.error("VALIDATION FAILED:\n  " + errs.join("\n  "));
  process.exit(1);
}
console.log(`✓ validated: ${NAMES.length} names align 1:1 with the ${news.length} new prompts, all slugs fresh.\n`);
const pantheon = NAMES.map((r, i) => ({ ...r, n: news[i].n, prompt: news[i].prompt })).filter((r) => r.group === "pantheon");
const boss = NAMES.map((r, i) => ({ ...r, n: news[i].n, prompt: news[i].prompt })).filter((r) => r.group === "boss");
console.log(`The Pantheon (${pantheon.length}):`);
for (const r of pantheon) console.log(`  ${String(r.n).padStart(2)}  ${r.slug.padEnd(28)} ${r.title}`);
console.log(`\nThe Boss Kills (+${boss.length}):`);
for (const r of boss) console.log(`  ${String(r.n).padStart(2)}  ${r.slug.padEnd(28)} ${r.title}`);

if (!APPLY) {
  console.log("\n(validate-only — re-run with --apply to seed the manifest + emit scaffold inputs)");
  process.exit(0);
}

// ---- apply ----------------------------------------------------------------
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
// emit nav lists for astro.config
const navLines = (rows) => rows.map((r) => `                { slug: "fenestra-aetherii/${r.slug}" },`).join("\n");
await writeFile("/tmp/pantheon-nav.txt", `=== The Pantheon ===\n${navLines(pantheon)}\n\n=== add to The Boss Kills ===\n${navLines(boss)}\n`);
console.log(`\n✓ seeded ${NAMES.length} into ${GAL}; extract+names → /tmp; nav → /tmp/pantheon-nav.txt`);
