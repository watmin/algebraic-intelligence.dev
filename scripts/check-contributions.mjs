#!/usr/bin/env node
//
// check-contributions — every story post declares a Likely-Contributions close.
//
// Per consonare Rule 13 (declared close, never a silent break): a story post
// either NAMES its field-contributions in a `## Likely Contributions to the
// Field` section, or keeps the heading with an explicit "None — a reflective
// interlude" line. Either way the HEADING is present. A post that silently
// drops it is invisible-by-omission — the reader can't tell an intentional
// omission from a forgotten one. This guard makes the heading's presence
// mechanical: any story post without it fails the build. Populated-vs-None is
// a judgment call and stays consonare's soft job; the heading is universal and
// belongs here, the same split as check-nav (mechanical) vs the spell (soft).
//
// Framing pieces are allowlisted — prologue and epilogue are not arc-posts,
// and prologue is also a consonare gold anchor (must not be modified).

import { readFile, readdir } from "node:fs/promises";

const STORY_DIR = "src/content/docs/blog/story";
const HEADING = "## Likely Contributions"; // matches "...to the Field" too
const ALLOWLIST = new Set(["prologue.md", "epilogue.mdx"]);

const files = (await readdir(STORY_DIR))
  .filter((f) => /\.mdx?$/.test(f) && !ALLOWLIST.has(f))
  .sort();

const missing = [];
for (const f of files) {
  const body = await readFile(`${STORY_DIR}/${f}`, "utf-8");
  if (!body.includes(HEADING)) missing.push(`${STORY_DIR}/${f}`);
}

if (missing.length) {
  console.error(
    `[check-contributions] FAIL — ${missing.length} story post(s) with no '${HEADING} to the Field' close:`,
  );
  for (const m of missing) console.error(`  ${m}`);
  console.error(
    `[check-contributions] per consonare Rule 13, declare the close: name the contributions, OR keep the heading with an explicit "None — a reflective interlude" line. (Framing pieces are allowlisted in this script.)`,
  );
  process.exit(1);
}

console.error(
  `[check-contributions] ✓ all ${files.length} story posts declare a Likely-Contributions close`,
);
