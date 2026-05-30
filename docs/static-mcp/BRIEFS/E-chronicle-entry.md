# BRIEF — M5 — Chronicle entry for the static-MCP arc

**Goal**: Capture the static-MCP work in the website's story chronicle.
The reader of `series-006-021-cold-boot.md` would naturally arrive here
next.

**Status**: 💤 DEFERRED — creative, requires `/consonare` voice pass,
best written when the dust settles. Currently the work is still in
flight (DNS propagating, datamancer.dev not yet scaffolded). A
premature chronicle would miss material.

**Estimated effort when undeferred**: 60-90 minutes for first draft
+ consonare pass + potential re-correct

## Likely landing location

`algebraic-intelligence.dev/src/content/docs/blog/story/series-007-001-the-static-mcp.md`

(Or wherever series-007 starts. Per the existing pattern, series-006
appears to be the trader+wat era; the static-MCP work is a distinct
phase and probably warrants series-007.)

## Substrate content to draw on

Once written, the post should report (substrate-event register per the
voice discipline):

- **The recognition**: GitHub bot-blocking the existing
  agent-skills/index.json URLs surfaced the question "where does our
  instruction set live?" Answer: not on a platform that blocks LLMs.
- **The decision**: cryptographically verifiable static hosting. Raw
  markdown. The file IS the artifact. No rendering. SHA-256 in a
  manifest. Ed25519 signature on the manifest. Pin the pubkey in the
  npm consumption package. Vending our own trust.
- **The three-domain split**: chronicle (algebraic-intelligence.dev),
  identity (datamancer.dev), grimoire (datamancy.dev). Each one
  purpose. The naming is honest: practice / practitioner / artifact.
- **The zero-dep rewrite**: the package's whole selling point is trust
  through small auditable surface. Depending on a multi-thousand-line
  SDK with its own transitive tree contradicts that. Rolled our own
  JSON-RPC + MCP layer (~300 LOC). `npm view datamancy` reports
  `deps: none`. The trust narrative is consistent end-to-end.
- **The arc structure that survived a compaction**: the wat-rs pattern
  (DESIGN + REMAINING-ORDER + INSCRIPTIONS + per-arc BRIEFs) made the
  multi-session work pickup-able. The chronicle should name this — it's
  meta-substrate, the doctrine applied to the chronicle's own
  scaffolding.

## Voice discipline reminder

When writing, cast `/consonare` after the draft. Per the chronicle's
voice memory and existing gold anchors. Specifically:

- Substrate-verdict close earned by the section's evidence
- No song citations in prose (songs live in BOOK interludes)
- Operational verbs throughout
- Dated transitions
- Arc references inline as load-bearing inventory (commit hashes,
  URLs, version numbers)

## Out of scope

- Posting to socials / publicizing
- A BOOK Intermission about the trust narrative (separate writing
  decision, lives in `holon-lab-trading/BOOK.md`)
- Marketing copy ("revolutionary trust model!") — chronicle voice is
  event-reporting, not promotional
