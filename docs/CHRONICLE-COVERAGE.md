# Chronicle coverage — how far the story has narrated each holonic repo

> **One job:** answer *"when did we last cover repo X, and what's the gap to its
> HEAD?"* without re-deriving it from scratch every session. Every row is
> **hash-stamped** — an index into checkable `git log` state, never a standalone
> claim. If a cell and the live `git log` disagree, **the `git log` wins** and
> this file is the stale cache: fix it. (Same doctrine as the recovery file —
> the log is the disk.)

The chronicle is `algebraic-intelligence.dev` (this repo). It narrates the work
that lives in the other holonic repos. This file records, per repo, the
**coverage frontier** — where the story's narration of that repo currently stops
— next to that repo's current HEAD, so the delta (the uncovered work) is visible
at a glance.

**The rule:** when a new story post ships that narrates a source repo, update
that repo's row (frontier post + the source commit/arc it reaches) and re-stamp
the date. There is nothing else to maintain — the row points at git; git is the
truth.

**Last reconciled:** 2026-09-08 — **restructured to one row per FRONT**
(`STORY-BRANCHING.md` §7 item 4). The per-repo table below is kept as a secondary
index, because a front spans several repos and you sometimes need the other
direction. The prior reconcile was 2026-06-17; the ~3-month gap between them is
the batch this file now tracks.

## The coverage table — one row per front

**The Story is CLOSED.** It ends at `series-006-036` and hands off. It takes no
new coverage; it appears here only so the handoff point is visible.

Front rows are measured with **explicit exclusion**, never a merge-base range:
`git -C wat-rs rev-list <branch> ^origin/main ^origin/grok-rete`. This is not
pedantry — measured today, `claude-compute` is **133 commits ahead of main by the
naive range and 24 by its own work**; the other 109 are `grok-rete`'s, inherited.
A merge-base range attributes a third of one front's output to another.

| Front | Where it lives | Source HEAD @ reconcile | Own work | Chronicle frontier | Gap |
|---|---|---|---|---|---|
| **The Story** *(closed)* | — | — | — | `series-006-036` "One Machine All the Way Down" — the hinge | **none, by design.** The body ended; the work moved to the fronts. |
| **wat Under Its Own Law** | `wat-rs` `main`, host `johndesktop` | `3dc4f62b7` (09-07) | 6,233 commits total | `fronts/under-its-own-law/006` (the DoS incident, 07-25) · `007` (the scratch prehistory, 04-29→07-29) | **7 of 9 slots unwritten.** Arcs 298, 296, 300, 293/294, 278, 255, 118. See `BATCH-OUTLINES.md` §2. |
| **Ars Culta** | `datamancy.dev`, `pulsare`, `cingere`, this repo; host `portal` | `datamancy.dev` `7980bf4` (09-07) | — | `fronts/ars-culta/002` (experiri, 08-28) | **1 of 2 slots unwritten** (the grimoire ethos, 06-30). **Past the cutoff and uncovered:** `peragrare` minted + warded 09-07/08 (`2ce6dd5`, `7980bf4`); `pulsare` (`c7173dd`) and `cingere` (`80a46a6`) both 09-07. All first-weekly material. |
| **The Exemplar** | `wat-rs` `grok-rete`, host `reason` | `b6ffdff1d` (09-06) | **479** ahead of main | **none — front not yet opened on the site** | **all 3 slots unwritten.** Diverged 08-24; the reading pass is in flight. |
| **Services in Anger** | `wat-rs` `claude-compute` + `sns-sqs`, host `compute` | `claude-compute` `f92f55dbd` (08-30) · `sns-sqs` `dd11bf858` (09-07) | **24** own (133 naive — 109 inherited) · **271** | **none — front not yet opened on the site** | **1 slot unwritten** (the front opens; `excursus` is invented). The SNS/SQS build, R69 and the chaos series are **post-cutoff** — first weekly. |

**Two fronts have no landing page yet.** `blog/fronts/` currently holds
`under-its-own-law/` and `ars-culta/`. `exemplar/` and `services/` are wired
neither in the content collection nor in `astro.config.mjs`; creating either one
means a landing page **and** a nav group, or `check-nav` fails the build.

## The batch that closes this gap

The ~3-month gap this file records is being closed by one campaign, tracked in
**`docs/BATCH-OUTLINES.md`** — 16 slots allocated by EVENT (closure, reversal,
campaign, incident, opening), not by calendar week. **That file is the live
status; this one is the frontier.** Where they disagree, check both against the
git log, which outranks each.

The cutoff is **Sun 2026-08-30**. Work after it belongs to the first weekly, and
this table names the post-cutoff items per front so they are not accidentally
backfilled.

## The per-repo index (secondary)

Kept because a front spans several repos and the reverse lookup is sometimes what
you need. **HEADs re-measured 2026-09-08.**

| Repo | Role vs the chronicle | HEAD @ reconcile | Front it feeds |
|---|---|---|---|
| `algebraic-intelligence.dev` | **The chronicle itself** | `7d49bad` (09-08) | Ars Culta |
| `wat-rs` | Substrate — the live edge; four branches, four fronts | `3dc4f62b7` (09-07) | all three substrate fronts |
| `datamancy.dev` | Grimoire publish source | `7980bf4` (09-07) | Ars Culta |
| `datamancy` | Signed **MCP kernel** (frozen 1.0.0) | `8eac896` (08-16) | Ars Culta |
| `pulsare` | tmux command channel — knock, don't spawn | `c7173dd` (09-07) | Ars Culta — **post-cutoff** |
| `cingere` | Automation tooling | `80a46a6` (09-07) | Ars Culta — **post-cutoff** |
| `holon-rs` | The Rust port | `c19f378` (08-03) | none active — narrated by series-003 |
| `holon-lab-trading` | Trading lab + **BOOK true source** | `55e8c90` (06-17) | none active — BOOK serves via `mirror-monoliths` |
| `holon-lab-ddos` | DDoS / XDP scrubber | `0de6606` (06-17) | none active — narrated by series-004/005 |
| `datamancer.dev` | Pinned-key trust domain | `4f4c5e6` (06-17) | narrated by series-007-001 |
| `scratch` | **Drafting source** (arcs / songs / intermissions) | `62a6b60` (06-30) | source, not subject — and the prehistory `fronts/under-its-own-law/007` is drawn from |

> **`holon-rs` moved and nobody noticed.** The prior reconcile called it "quiet
> since 05-22". It is at `c19f378` (08-03) — *"similarity: name the degenerate
> epsilon so the consumer can share it"*. Unnarrated, and not in any front's
> slate. Not necessarily a post; recorded so it stops being invisible.
