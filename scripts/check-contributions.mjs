#!/usr/bin/env node
//
// check-contributions — every narrative post declares a Likely-Contributions close.
//
// Per consonare Rule 13 (declared close, never a silent break): a post either
// NAMES its field-contributions in a `## Likely Contributions to the Field`
// section, or keeps the heading with an explicit "None — a reflective interlude"
// line. Either way the HEADING is present. A post that silently drops it is
// invisible-by-omission — the reader cannot tell an intentional omission from a
// forgotten one. This guard makes the heading mechanical; populated-vs-None is a
// judgement call and stays consonare's soft job. Same split as check-nav
// (mechanical) vs the spell (soft).
//
// The builder's gloss on what the section is FOR, which is sharper than "list
// your contributions" and should govern how it is filled:
//
//   "this is a place where we reflect on something we may have legitimately
//    built that's beyond common knowledge."
//
// Not a summary, not a victory lap — a check on whether the work went past what
// is commonly known.
//
// SCOPE: both narrative tracks (scripts/lib/posts.mjs). Front posts owe the
// close on the same terms as trunk posts — ruled 2026-09-07, STORY-BRANCHING.md
// §2.5. Two things are exempt, and only two:
//   - framing pieces (prologue, epilogue) — not arc-posts, and the prologue is a
//     consonare gold anchor that must not be modified
//   - landings (any index page) — a track's overview is not a post

import { readFile } from "node:fs/promises";
import { discoverPosts } from "./lib/posts.mjs";

const HEADING = "## Likely Contributions"; // matches "...to the Field" too
const FRAMING = new Set(["blog/story/prologue", "blog/story/epilogue"]);

const posts = await discoverPosts();
const owing = posts.filter((p) => !p.isLanding && !FRAMING.has(p.slug));

const missing = [];
for (const p of owing) {
  const body = await readFile(p.file, "utf-8");
  if (!body.includes(HEADING)) missing.push(p);
}

if (missing.length) {
  console.error(
    `[check-contributions] FAIL — ${missing.length} post(s) without a declared close:`,
  );
  for (const m of missing) console.error(`  ${m.file}`);
  console.error(
    `[check-contributions] per consonare Rule 13, declare the close: name the contributions, OR keep the heading with an explicit "None — a reflective interlude" line.`,
  );
  console.error(
    `[check-contributions] the section asks what you may have legitimately built that is beyond common knowledge — not a summary. Framing pieces and track landings are exempt.`,
  );
  process.exit(1);
}

const story = owing.filter((p) => p.kind === "story").length;
const front = owing.filter((p) => p.kind === "front").length;
const exempt = posts.length - owing.length;
console.error(
  `[check-contributions] ✓ all ${owing.length} posts declare a Likely-Contributions close (${story} story, ${front} front; ${exempt} exempt)`,
);
