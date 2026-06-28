#!/usr/bin/env node
//
// seed-worlds-batch — one-off, hand-authored names for the "THE DATAMANCER across
// iconic worlds & traditions" batch (2026-06-28). Every prompt's top-text is the
// identical "THE DATAMANCER", so seed-incantationes-from-grok's name-extraction
// can't disambiguate them — they need hand names. They distribute into EXISTING
// theme groups (Game Worlds / The Masters / The Old World), several as variants of
// pages that already exist (warhammer-40k, stained-glass).
//
// SELF-VALIDATING (same contract as seed-pantheon-batch): re-derives the new-prompt
// list (identical logic to seed-incantationes-from-grok / grok-organize), then for
// every NAMES row asserts its `check` substring lands on EXACTLY ONE new prompt and
// that it's the row's index. Any misalignment, count drift, or slug collision aborts
// before a single write.
//
//   node scripts/seed-worlds-batch.mjs            # validate only (no writes)
//   node scripts/seed-worlds-batch.mjs --apply    # seed manifest + emit scaffold inputs + nav

import { readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const ROOT = process.env.GROK_DIR || join(homedir(), "grok-imagine");
const GAL = "src/gallery-manifest.json";
const CORE = /inquisitor|shadowdancer|datamancer|datamancy/i;
const norm = (s) => s.replace(/\s+/g, " ").trim().toLowerCase();
const APPLY = process.argv.includes("--apply");

// index-ordered (by image count desc — the deterministic `news` sort below). Each row:
//   { check, group, slug, title }   check = a substring unique to that one prompt.
// group → existing astro nav label: game-worlds → "Game Worlds", masters → "The Masters",
//          old-world → "The Old World".
const NAMES = [
  { check: "on a crusade against darkness",                          group: "old-world",   slug: "crusader-knights",            title: "The Crusade" },
  { check: "colossal gothic cyber-temple academy",                   group: "game-worlds", slug: "warhammer-40k-datavatum",     title: "Warhammer 40K — The Datavatum" },
  { check: "amid the chaos of battle",                               group: "old-world",   slug: "crusader-battlefield",        title: "The Crusader Battlefield" },
  { check: "a majestic, intricate stained glass window",             group: "old-world",   slug: "stained-glass-ii",            title: "Stained Glass — The Cathedral Window" },
  { check: "photographed with masterful craftsmanship and museum-quality detail", group: "old-world", slug: "stained-glass-iii", title: "Stained Glass — Hyper-Real" },
  { check: "like the original drizzt do'urden book covers",          group: "game-worlds", slug: "forgotten-realms",            title: "Forgotten Realms" },
  { check: "ancient techno-dungeon chamber filled with skulls",      group: "game-worlds", slug: "warhammer-40k-techno-dungeon",title: "Warhammer 40K — Techno-Dungeon" },
  { check: "rendered with hyper-realistic detail",                   group: "old-world",   slug: "stained-glass-iv",            title: "Stained Glass — Luminous" },
  { check: "grimdark fantasy style of warhammer book covers",        group: "game-worlds", slug: "warhammer-fantasy",           title: "Warhammer Fantasy" },
  { check: "comic book style of judge dredd",                        group: "masters",     slug: "judge-dredd",                 title: "Judge Dredd" },
  { check: "perfect for a dungeons & dragons supplement cover",      group: "game-worlds", slug: "dungeons-and-dragons",        title: "Dungeons & Dragons" },
  { check: "street samurai / physical adept",                        group: "game-worlds", slug: "shadowrun",                   title: "Shadowrun" },
  { check: "art style of alan lee and john howe",                    group: "masters",     slug: "lord-of-the-rings",           title: "The Lord of the Rings" },
  { check: "depicted as divine figures in a single large stained glass panel", group: "old-world", slug: "stained-glass-v",     title: "Stained Glass — The Single Panel" },
];

const GROUP_LABEL = { "game-worlds": "Game Worlds", masters: "The Masters", "old-world": "The Old World" };

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
  if (!GROUP_LABEL[row.group]) errs.push(`[${i}] ${row.slug}: unknown group "${row.group}"`);
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
for (const g of Object.keys(GROUP_LABEL)) {
  const rows = NAMES.map((r, i) => ({ ...r, n: news[i].n })).filter((r) => r.group === g);
  if (!rows.length) continue;
  console.log(`${GROUP_LABEL[g]} (+${rows.length}):`);
  for (const r of rows) console.log(`  ${String(r.n).padStart(2)}  ${r.slug.padEnd(30)} ${r.title}`);
  console.log();
}

if (!APPLY) {
  console.log("(validate-only — re-run with --apply to seed the manifest + emit scaffold inputs + nav)");
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
const navLine = (r) => `                { slug: "fenestra-aetherii/${r.slug}" },`;
let nav = "";
for (const g of Object.keys(GROUP_LABEL)) {
  const rows = NAMES.filter((r) => r.group === g);
  if (!rows.length) continue;
  nav += `=== add to "${GROUP_LABEL[g]}" ===\n${rows.map(navLine).join("\n")}\n\n`;
}
await writeFile("/tmp/worlds-nav.txt", nav);
console.log(`✓ seeded ${NAMES.length} into ${GAL}; extract+names → /tmp; nav → /tmp/worlds-nav.txt`);
