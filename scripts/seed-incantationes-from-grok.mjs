#!/usr/bin/env node
//
// seed-incantationes-from-grok — turn NEW Grok prompts into gallery pages, when
// the prompt rides INSIDE the grok manifest (the propaganda-poster batches name
// themselves in their own "Bold text at the top" field) rather than arriving as
// /tmp/prompts-NNN.md files.
//
// For every CORE (datamancy) prompt in ~/grok-imagine/manifest.json that does NOT
// already map to a gallery page, it:
//   1. extracts the embedded spell name (the poster's top-text) for the slug/title,
//   2. SEEDS src/gallery-manifest.json with { slug: { prompt: <verbatim>, images: [] } }
//      — the EXACT prompt, so grok-organize's exact-match fires before its 80-char
//      prefix fallback (all the posters share an identical prefix; only the exact
//      match disambiguates them),
//   3. emits /tmp/incantatio-extract.json + /tmp/incantatio-names.json in the shapes
//      scaffold-incantationes.mjs consumes, so the .mdx pages are written by the
//      existing tool, not by hand.
//
// Then the normal tail runs:  scaffold → grok-organize → r2-upload → gallery-manifest.
//
// Usage:  node scripts/seed-incantationes-from-grok.mjs

import { readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const ROOT = process.env.GROK_DIR || join(homedir(), "grok-imagine");
const GAL = "src/gallery-manifest.json";
const CORE = /inquisitor|shadowdancer|datamancer|datamancy/i;
const norm = (s) => s.replace(/\s+/g, " ").trim().toLowerCase();

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
    .replace(/-+$/g, "");

const titleCase = (s) =>
  s
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

// gloss for the title — keyed by the embedded spell name. Fallback = the bare
// spell, title-cased. (A new spell-poster batch auto-names from its own top-text;
// the gloss just reads nicer when we know it.)
const GLOSS = {
  EXIGERE: "Drive Out Deferred Work",
  COMPLECTENS: "Weave the Tests",
  "THE GRIMOIRE": null, // special-cased to "The Living Grimoire"
  NESCIENS: "Summon the Unknowing",
  SEQUI: "Follow the State",
  CONFORMARE: "Shape to a Common Standard",
  CERNERE: "Sift Valid From Phantom",
  EXCUSARE: "Weigh the Exemption",
  STRUERE: "Test What Is Built",
  INTUERI: "Does the Code Speak?",
  TEMPERARE: "Mix in Right Proportion",
  CONFERRE: "Bring Spec and Code Together",
  PERSPICERE: "See Through the Depth",
  PURGARE: "Purge Dead Thoughts",
  SECARE: "Cut Along the Grain",
  VIGILIA: "The Full Watch",
  CIRCUMSPICERE: "Look Around, Cast Last",
  PROBARE: "Test the Substance",
  MORA: "Hunt the Pause",
  RECOLLIGERE: "Gather the Scattered Self",
  EXAMINARE: "Study the Lair",
  SOLVERE: "Decomplect",
  CURARE: "Tend the Record",
};

// pull the poster's declared name out of the prompt body
function spellName(p) {
  const m = p.match(/Bold text at the top[^"]*"([^"]+)"/i);
  if (m) return m[1].trim().toUpperCase();
  if (/Pillars of Eternity/i.test(p)) return null; // the isometric scene — no top-text
  return null;
}

const gal = JSON.parse(await readFile(GAL, "utf-8"));
const existing = new Set(Object.values(gal).map((e) => norm(e.prompt || "")));
const existingHeads = [...existing].map((k) => k.slice(0, 80));
const matchExisting = (p) => {
  const k = norm(p);
  if (existing.has(k)) return true;
  const h = k.slice(0, 80);
  return existingHeads.some((eh) => eh.startsWith(h) || k.startsWith(eh));
};

const posts = JSON.parse(await readFile(join(ROOT, "manifest.json"), "utf-8")).posts;

// distinct CORE prompts with no page yet, ordered by image count (favorites lead)
const byPrompt = new Map();
for (const id in posts) {
  const p = posts[id].prompt || "";
  if (!CORE.test(p)) continue;
  const k = norm(p);
  if (!byPrompt.has(k)) byPrompt.set(k, { prompt: p, n: 0 });
  byPrompt.get(k).n++;
}
const news = [...byPrompt.values()]
  .filter((e) => !matchExisting(e.prompt))
  .sort((a, b) => b.n - a.n);

const usedSlugs = new Set(Object.keys(gal));
const roman = ["", "", "ii", "iii", "iv", "v"];
const extract = [];
const namesOut = [];
const navList = [];

for (const e of news) {
  const spell = spellName(e.prompt);
  let baseSlug, title;
  if (spell === null) {
    baseSlug = "pillars-boss-kill";
    title = "Pillars of Eternity — The Boss Kill";
  } else if (spell === "THE GRIMOIRE") {
    baseSlug = "the-living-grimoire";
    title = "The Living Grimoire";
  } else {
    baseSlug = slugify(spell);
    const gloss = GLOSS[spell];
    title = gloss ? `${titleCase(spell)} — ${gloss}` : titleCase(spell);
  }
  // disambiguate a repeated spell (a second take of the same incantation)
  let slug = baseSlug;
  let n = 1;
  while (usedSlugs.has(slug)) {
    n++;
    slug = `${baseSlug}-${roman[n] || n}`;
  }
  usedSlugs.add(slug);
  const dispTitle = n > 1 ? `${title} (${roman[n].toUpperCase()})` : title;

  gal[slug] = { prompt: e.prompt, images: [] };
  extract.push({ id: slug, prompt: e.prompt, defaultSlug: slug, defaultTitle: dispTitle });
  namesOut.push({ id: slug, slug, title: dispTitle });
  navList.push({ slug, title: dispTitle, n: e.n });
}

await writeFile(GAL, JSON.stringify(gal, null, 2) + "\n");
await writeFile("/tmp/incantatio-extract.json", JSON.stringify(extract, null, 2) + "\n");
await writeFile("/tmp/incantatio-names.json", JSON.stringify(namesOut, null, 2) + "\n");

console.log(`seeded ${news.length} new Incantationes into ${GAL} (images:[] — gallery-manifest fills them after upload)\n`);
for (const x of navList) console.log(`  ${String(x.n).padStart(3)}  ${x.slug.padEnd(26)} ${x.title}`);
console.log(`\nextract → /tmp/incantatio-extract.json   names → /tmp/incantatio-names.json`);
console.log(`next: scaffold-incantationes → grok-organize → r2-upload → gallery-manifest`);
