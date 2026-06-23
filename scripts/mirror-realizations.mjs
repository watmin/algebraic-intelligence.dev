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
// /blog/arc-170-realizations. (Its sibling REALIZATIONS-SLICE-* files ARE indexed
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
import { join } from "node:path";

const SRC_ROOT = "../wat-rs/docs/arc";
const OUT_DIR = "src/content/docs/blog/realizations";
const CHRONICLE_LINK = "/blog/arc-170-realizations/";
const CHECK = process.argv.includes("--check");

const titleCase = (s) =>
  s.split("-").filter(Boolean).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

// Discover every REALIZATIONS*.md under the arc tree, except the 170 chronicle.
async function discover() {
  const all = await readdir(SRC_ROOT, { recursive: true });
  return all
    .filter((p) => /(^|\/)REALIZATIONS[^/]*\.md$/.test(p))
    .filter((p) => !/INTERSTITIAL-REALIZATIONS\.md$/.test(p))
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
      const sm = file.match(/REALIZATIONS-(.+)\.md$/i);
      const suffix = sm ? sm[1].toLowerCase() : "";
      const slug = suffix ? `${arcNum}-${arcName}-${suffix}` : `${arcNum}-${arcName}`;
      const title = `Arc ${arcNum} — ${titleCase(arcName)}${suffix ? ` (${titleCase(suffix)})` : ""}`;
      return { rel, abs: join(SRC_ROOT, rel), month, arcNum, arcName, slug, title };
    })
    .sort((a, b) => a.arcNum - b.arcNum || a.slug.localeCompare(b.slug));
}

// One focused-doc → one page. Drop the source's leading `# H1` (the frontmatter
// title becomes the rendered H1; keeping the source H1 duplicates it).
function pageFor(doc, body) {
  const stripped = body.replace(/^\s*#\s+.*\n+/, "");
  const desc = `Realizations — the findings log for ${doc.title}.`;
  const fm = `---\ntitle: ${JSON.stringify(doc.title)}\ndescription: ${JSON.stringify(desc)}\nsidebar:\n  order: ${doc.arcNum}\n---\n\n`;
  return fm + stripped.replace(/\s+$/, "") + "\n";
}

// The index landing: a table per month + a pointer to the chronicle.
function indexPage(docs, lineCounts) {
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
      lines.push(`| ${d.arcNum} | [${titleCase(d.arcName)}${d.slug.includes("-slice") ? " (slice)" : ""}](/blog/realizations/${d.slug}/) | ${lineCounts.get(d.slug)} |`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

async function main() {
  if (!existsSync(SRC_ROOT)) {
    if (CHECK) process.exit(0); // CF/CI: no sibling repo, not our job
    console.error(`  ✗ realizations source missing: ${SRC_ROOT} (sibling repo not checked out?)`);
    process.exit(1);
  }
  const docs = await discover();
  const bodies = new Map();
  const lineCounts = new Map();
  for (const d of docs) {
    const body = await readFile(d.abs, "utf-8");
    bodies.set(d.slug, body);
    lineCounts.set(d.slug, body.split("\n").length);
  }
  const idx = indexPage(docs, lineCounts);

  if (CHECK) {
    let drift = 0;
    const seen = new Set(["index.md"]);
    for (const d of docs) {
      seen.add(`${d.slug}.md`);
      const served = existsSync(join(OUT_DIR, `${d.slug}.md`)) ? await readFile(join(OUT_DIR, `${d.slug}.md`), "utf-8") : "";
      if (served !== pageFor(d, bodies.get(d.slug))) drift++;
    }
    const idxServed = existsSync(join(OUT_DIR, "index.md")) ? await readFile(join(OUT_DIR, "index.md"), "utf-8") : "";
    if (idxServed !== idx) drift++;
    // stale pages no longer backed by a source file
    const onDisk = existsSync(OUT_DIR) ? (await readdir(OUT_DIR)).filter((f) => f.endsWith(".md")) : [];
    const orphans = onDisk.filter((f) => !seen.has(f));
    if (drift || orphans.length) {
      console.error(`  ⚠ realizations: ${drift} page(s) stale${orphans.length ? `, ${orphans.length} orphan(s)` : ""} — run \`npm run mirror\``);
    } else {
      console.error(`  ✓ realizations: ${docs.length} arc logs current.`);
    }
    process.exit(0);
  }

  // rebuild the dir from scratch so a renamed/removed arc can't leave a stale page
  if (existsSync(OUT_DIR)) await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(join(OUT_DIR, "index.md"), idx);
  for (const d of docs) await writeFile(join(OUT_DIR, `${d.slug}.md`), pageFor(d, bodies.get(d.slug)));
  const totalLines = [...lineCounts.values()].reduce((a, b) => a + b, 0);
  console.error(`  ✓ realizations: ${docs.length} arc logs + index (${totalLines} lines) → ${OUT_DIR}/ — arcs ${docs[0].arcNum}…${docs[docs.length - 1].arcNum}`);
}

main().catch((e) => {
  console.error("[mirror-realizations] FATAL:", e instanceof Error ? e.message : e);
  process.exit(1);
});
