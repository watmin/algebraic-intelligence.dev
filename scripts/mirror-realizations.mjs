#!/usr/bin/env node
//
// mirror-realizations — index EVERY per-arc REALIZATIONS file from wat-rs onto
// the site. Companion to mirror-monoliths.mjs (which handles the two big chunked
// monoliths: the BOOK and the arc-170 INTERSTITIAL chronicle). This one handles
// the focused per-arc docs (the R1/R2/R3 findings logs, 57–973 lines each):
//
//   - auto-DISCOVERS `../wat-rs/docs/arc/**/REALIZATIONS*.md` (new arcs appear
//     on the next run with zero hand-wiring),
//   - renders ONE content page per file at
//     src/content/docs/blog/realizations/<arc>.md (they're focused — no chunking),
//   - generates an index landing (src/content/docs/blog/realizations/index.md):
//     a table grouped by month, plus a pointer to the 170 chronicle.
//
// The arc-170 INTERSTITIAL chronicle is EXCLUDED here — it's the huge
// chronological song-log, served chunked by mirror-monoliths at
// /blog/realizations/170-program-entry-points. (Its sibling REALIZATIONS-SLICE-* files ARE indexed
// here — they're ordinary focused docs.)
//
// LOCAL maintenance tool (not part of the Cloudflare build — that runner has no
// sibling repos). Run by hand after the substrate grows new realizations:
//   node scripts/mirror-realizations.mjs        (or: npm run mirror)
//   node scripts/mirror-realizations.mjs --check   (freshness probe, never writes)
//
// The nav "Realizations" group autogenerates from the output directory, so the
// only maintenance is re-running this and committing.

import { readdir, readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { splitSafety, chunkPages } from "./lib/chunk.mjs";

const SRC_ROOT = "../wat-rs/docs/arc";
const OUT_DIR = "src/content/docs/blog/realizations";
const SIDEBAR_OUT = "src/sidebar-realizations.mjs";
// A fragmented arc is unreadable as one page but is still ONE DOCUMENT, and an
// agent wants it in one fetch. mirror-monoliths served exactly this for arc 170
// ("the continuous scroll; an agent's one fetch") and folding 170 in here would
// have silently dropped the capability. So every fragmented arc gets a raw whole
// instead — the merge extends the capability rather than trading it away.
const RAW_DIR = "public/blog/realizations";
const CHRONICLE_LINK = "/blog/realizations/170-program-entry-points/";
const CHECK = process.argv.includes("--check");

// FRAGMENTATION. A per-arc log that renders past ~1 MB is a build-memory hazard
// of exactly the kind that forced the arc-170 chunking (~3.5 MB) and moved the
// BOOK out of the collection (4.2 MB). Rendered/source measures ~3.3-4.6x on
// this corpus, so 250 KB of source is ~1 MB rendered — the line.
//
// Today that is three files: 278-rules-engine (1,469 KB source -> ~5.9 MB
// rendered), 296-diagnostics-fully-edn (331 KB), 300-wat-source-is-edn (328 KB).
//
// A fragmented arc becomes <slug>/index.md (the landing) + <slug>/NNN-*.md, so
// the landing's URL is UNCHANGED (/blog/realizations/<slug>/) and no existing
// link breaks. The sidebar autogenerates the nested group with zero nav edits.
//
// check-page-size.mjs is the backstop: if this threshold is ever wrong, the wall
// fails the build rather than shipping a hog.
const FRAGMENT_BYTES = 250 * 1024;

const titleCase = (s) =>
  s.split("-").filter(Boolean).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

// Discover every arc's findings log.
//
// TWO RULES, and both were learned rather than designed.
//
// 1. INTERSTITIAL-REALIZATIONS.md is INCLUDED (arc 170's chronicle). It used to
//    be special-cased into mirror-monoliths with its own top-level nav group, a
//    thin landing and a raw serve. Measured, that exception did not survive:
//    170's source is 1736 KB against arc 278's 1472 KB — 18% apart, the same
//    order of magnitude — and 278 is served here, fragmented, with no ceremony.
//    Both mirrors already shared one chunker, so the split was two mechanisms
//    doing one job. The builder's read: "i don't see a reason for it to stand
//    out given many other realizations have met the fragmentation bar."
//
// 2. REALIZATIONS-SLICE-*.md is EXCLUDED. These match the glob and are not
//    findings logs — `170/REALIZATIONS-SLICE-1.md` opens "Realizations — slice
//    1 review" and reviews what one slice shipped against what DESIGN settled.
//    The glob was matching a FILENAME PREFIX and reading it as a document kind.
//    Note that R-numbering cannot discriminate here: 15 genuine logs carry zero
//    `## R1` headings because the older arcs did not number them. The title is
//    the tell — every real one says "Arc N — Realizations" or "Realizations —
//    Arc N"; the slice review says "slice 1 review".
async function discover() {
  const all = await readdir(SRC_ROOT, { recursive: true });
  return all
    .filter((p) => /(^|\/)(INTERSTITIAL-)?REALIZATIONS[^/]*\.md$/.test(p))
    .filter((p) => !/REALIZATIONS-SLICE-/i.test(p))
    .map((rel) => {
      // rel = "2026/06/272-rendezvous-inherited-capability/REALIZATIONS.md"
      const parts = rel.split("/");
      const file = parts[parts.length - 1];
      const arcDir = parts[parts.length - 2];
      const month = parts.slice(0, 2).join("/"); // "2026/06"
      const m = arcDir.match(/^(\d+)-(.+)$/);
      const arcNum = m ? parseInt(m[1], 10) : 0;
      const arcName = m ? m[2] : arcDir;
      // a REALIZATIONS-SLICE-1.md → suffix " (Slice 1)" / slug "-slice-1"
      const sm = file.match(/^REALIZATIONS-(.+)\.md$/i);
      const suffix = sm ? sm[1].toLowerCase() : "";
      const slug = suffix ? `${arcNum}-${arcName}-${suffix}` : `${arcNum}-${arcName}`;
      const title = `Arc ${arcNum} — ${titleCase(arcName)}${suffix ? ` (${titleCase(suffix)})` : ""}`;
      return { rel, abs: join(SRC_ROOT, rel), month, arcNum, arcName, slug, title };
    })
    .sort((a, b) => a.arcNum - b.arcNum || a.slug.localeCompare(b.slug));
}

// One focused-doc → the set of files it produces, as relPath -> content.
//
// ONE producer, consumed by BOTH the writer and --check. When check computed its
// own expected shape separately, it could pass while the writer emitted something
// else; sharing this function makes that class unrepresentable.
//
// Small doc  -> { "<slug>.md": page }
// Large doc  -> { "<slug>/index.md": landing, "<slug>/NNN-x.md": chunk, ... }
function filesFor(doc, body) {
  const stripped = body.replace(/^\s*#\s+.*\n+/, "");
  const files = new Map();
  const bytes = Buffer.byteLength(body, "utf8");

  if (bytes <= FRAGMENT_BYTES) {
    const desc = `Realizations — the findings log for ${doc.title}.`;
    const fm = `---\ntitle: ${JSON.stringify(doc.title)}\ndescription: ${JSON.stringify(desc)}\nsidebar:\n  order: ${doc.arcNum}\n---\n\n`;
    files.set(`${doc.slug}.md`, fm + stripped.replace(/\s+$/, "") + "\n");
    return { files, chunks: 0, refused: "" };
  }

  // Too large to render whole. Split only if the document is genuinely segmented;
  // a source whose `## ` is doing double duty would be torn in half SILENTLY —
  // the chunks would build, render, and be wrong. Refuse instead, and let the
  // size wall fail the build so a human decides.
  const lines = stripped.split("\n");
  const { safe, bounds, why } = splitSafety(lines);
  if (!safe) {
    const desc = `Realizations — the findings log for ${doc.title}.`;
    const fm = `---\ntitle: ${JSON.stringify(doc.title)}\ndescription: ${JSON.stringify(desc)}\nsidebar:\n  order: ${doc.arcNum}\n---\n\n`;
    files.set(`${doc.slug}.md`, fm + stripped.replace(/\s+$/, "") + "\n");
    return { files, chunks: 0, refused: why };
  }

  const pages = chunkPages(lines, bounds);
  const kb = Math.round(bytes / 1024);
  const landing = [
    "---",
    `title: ${JSON.stringify(doc.title)}`,
    `description: ${JSON.stringify(`Realizations — the findings log for ${doc.title}, served in ${pages.length} parts.`)}`,
    "tableOfContents: false",
    "sidebar:",
    // ORDER 0, NOT the arc number. This landing sits INSIDE its own group beside
    // chunk pages ordered 1..N, and Starlight's order is scoped to the directory.
    // With `order: 300` against chunks 1..17 the landing sorted LAST; with
    // `order: 170` against chunks 1..210 it sorted 170th — buried mid-list. The
    // arc number orders this arc among OTHER arcs, and that is decided by the
    // generated sidebar fragment's array position, not here.
    "  order: 0",
    "---",
    "",
    `This arc's findings log is **${kb} KB** across **${pages.length}** entries — too large to render as one page, so it is served one page per entry below.`,
    "",
    `**Raw, whole.** → [the full log, one file](/blog/realizations/${doc.slug}.md) — the continuous scroll, and an agent's one fetch.`,
    "",
    "| # | Entry |",
    "|---|---|",
    ...pages.map((c) => `| ${c.order} | [${c.title.replace(/\|/g, "\\|")}](/blog/realizations/${doc.slug}/${c.num}-${c.slug}/) |`),
    "",
  ].join("\n");
  files.set(`${doc.slug}/index.md`, landing);

  for (const c of pages) {
    const fm = `---\ntitle: ${JSON.stringify(c.title)}\nsidebar:\n  order: ${c.order}\n---\n\n`;
    files.set(`${doc.slug}/${c.num}-${c.slug}.md`, fm + c.body);
  }
  return { files, chunks: pages.length, refused: "" };
}

// The index landing: a table per month + a pointer to the chronicle.
function indexPage(docs, lineCounts, chunkCounts) {
  const byMonth = new Map();
  for (const d of docs) {
    if (!byMonth.has(d.month)) byMonth.set(d.month, []);
    byMonth.get(d.month).push(d);
  }
  const monthLabel = (m) => {
    const [y, mm] = m.split("/");
    const names = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${names[parseInt(mm, 10)]} ${y}`;
  };
  const lines = [
    "---",
    'title: "Arc Realizations"',
    'description: "The per-arc findings logs — every realization captured during wat-rs development, indexed by arc."',
    "tableOfContents: false",
    "sidebar:",
    "  order: 0",
    "---",
    "",
    "The **realizations** are the findings logs the substrate accretes as it's built — the sharp distinctions, prior-art collisions, dead ends, and doctrines named *while the context was live*, one file per arc. This is the index; each row is that arc's whole log.",
    "",
    `> The big one — the **arc-170 interstitial chronicle** (the chronological song-log, 16k+ lines) — lives on its own at [Arc 170 — Full Realizations](${CHRONICLE_LINK}). The focused per-arc logs are below.`,
    "",
  ];
  for (const [month, ds] of [...byMonth.entries()].sort()) {
    lines.push(`## ${monthLabel(month)}`, "");
    lines.push("| Arc | Realizations | Lines |", "|---|---|---|");
    for (const d of ds) {
      const ch = chunkCounts.get(d.slug) || 0;
      lines.push(`| ${d.arcNum} | [${titleCase(d.arcName)}${d.slug.includes("-slice") ? " (slice)" : ""}](/blog/realizations/${d.slug}/) | ${lineCounts.get(d.slug)}${ch ? ` · ${ch} parts` : ""} |`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// The sidebar fragment.
//
// Starlight's `autogenerate` puts GROUPS before PAGES, so a fragmented arc
// (which becomes a subdirectory) jumps ahead of every flat arc regardless of
// its `sidebar.order`. Measured: 278/296/300 sorted above 109, and the flat
// files below them were in perfect numeric order.
//
// The fix is not a hand-written nav list — that is the hand-maintained list this
// substrate spent arc 255 killing. This script already knows every arc, its
// number, and whether it fragmented. So it DERIVES the sidebar and the config
// imports it: new arcs still appear with zero nav edits, and the order is arc
// order because the thing that owns the arcs decides it.
// ---------------------------------------------------------------------------
const sidebarModule = (docs, chunkCounts) => {
  const entries = docs.map((d) =>
    chunkCounts.has(d.slug)
      ? `  { label: ${JSON.stringify(d.title)}, collapsed: true, autogenerate: { directory: "blog/realizations/${d.slug}" } },`
      : `  { slug: "blog/realizations/${d.slug}" },`,
  );
  return [
    "// GENERATED by scripts/mirror-realizations.mjs — do not edit by hand.",
    "// Ordered by arc number. A fragmented arc becomes a nested group; a flat one",
    "// is a single page. Re-run `npm run mirror` after the substrate grows arcs.",
    "export default [",
    '  { slug: "blog/realizations" },',
    ...entries,
    "];",
    "",
  ].join("\n");
};

// Every .md under OUT_DIR, relative — for orphan detection across nested chunk
// directories (a flat readdir cannot see a fragmented arc's pages).
async function servedFiles(dir, prefix = "") {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...(await servedFiles(join(dir, e.name), rel)));
    else if (e.name.endsWith(".md")) out.push(rel);
  }
  return out;
}

async function main() {
  if (!existsSync(SRC_ROOT)) {
    if (CHECK) process.exit(0); // CF/CI: no sibling repo, not our job
    console.error(`  ✗ realizations source missing: ${SRC_ROOT} (sibling repo not checked out?)`);
    process.exit(1);
  }
  const docs = await discover();
  const lineCounts = new Map();
  const chunkCounts = new Map();
  const refusals = [];
  // relPath -> content, for EVERY file the mirror owns. Built once; the writer
  // and --check both read this, so they cannot disagree about the shape.
  const want = new Map();

  for (const d of docs) {
    const body = await readFile(d.abs, "utf-8");
    lineCounts.set(d.slug, body.split("\n").length);
    const { files, chunks, refused } = filesFor(d, body);
    if (chunks) chunkCounts.set(d.slug, chunks);
    if (refused) refusals.push({ slug: d.slug, why: refused });
    for (const [rel, content] of files) want.set(rel, content);
  }
  want.set("index.md", indexPage(docs, lineCounts, chunkCounts));

  // A source over the threshold that could NOT be split safely is a real problem:
  // it will render whole and the size wall will fail the build. Say so loudly at
  // mirror time rather than letting the wall be the first news.
  for (const r of refusals) {
    console.error(`  ⚠ realizations: ${r.slug} is over ${Math.round(FRAGMENT_BYTES / 1024)} KB but was NOT split — ${r.why}`);
    console.error(`    it will render whole; check-page-size may fail the build. Fix the source's heading structure, or split it by hand.`);
  }

  if (CHECK) {
    let drift = 0;
    for (const [rel, content] of want) {
      const path = join(OUT_DIR, rel);
      const served = existsSync(path) ? await readFile(path, "utf-8") : "";
      if (served !== content) drift++;
    }
    const sidebarWant = sidebarModule(docs, chunkCounts);
    const sidebarHave = existsSync(SIDEBAR_OUT) ? await readFile(SIDEBAR_OUT, "utf-8") : "";
    if (sidebarWant !== sidebarHave) drift++;
    const orphans = (await servedFiles(OUT_DIR)).filter((f) => !want.has(f));
    if (drift || orphans.length) {
      console.error(`  ⚠ realizations: ${drift} page(s) stale${orphans.length ? `, ${orphans.length} orphan(s)` : ""} — run \`npm run mirror\``);
    } else {
      console.error(`  ✓ realizations: ${docs.length} arc logs current${chunkCounts.size ? ` (${chunkCounts.size} fragmented)` : ""}.`);
    }
    process.exit(0);
  }

  // rebuild the dir from scratch so a renamed/removed arc — or an arc that has
  // grown past the threshold and changed shape — cannot leave a stale page
  if (existsSync(OUT_DIR)) await rm(OUT_DIR, { recursive: true, force: true });
  for (const [rel, content] of want) {
    const path = join(OUT_DIR, rel);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content);
  }

  await writeFile(SIDEBAR_OUT, sidebarModule(docs, chunkCounts));

  if (existsSync(RAW_DIR)) await rm(RAW_DIR, { recursive: true, force: true });
  await mkdir(RAW_DIR, { recursive: true });
  for (const d of docs) {
    if (!chunkCounts.has(d.slug)) continue;
    await writeFile(join(RAW_DIR, `${d.slug}.md`), await readFile(d.abs, "utf-8"));
  }

  const totalLines = [...lineCounts.values()].reduce((a, b) => a + b, 0);
  const frag = [...chunkCounts.entries()].map(([s2, n]) => `${s2} (${n})`).join(", ");
  console.error(
    `  ✓ realizations: ${docs.length} arc logs + index (${totalLines} lines, ${want.size} files) → ${OUT_DIR}/ — arcs ${docs[0].arcNum}…${docs[docs.length - 1].arcNum}`,
  );
  if (frag) console.error(`    fragmented: ${frag}`);
}

main().catch((e) => {
  console.error("[mirror-realizations] FATAL:", e instanceof Error ? e.message : e);
  process.exit(1);
});
