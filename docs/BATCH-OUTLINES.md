# Batch outlines — the August backfill

> **Companion to `STORY-BRANCHING.md`.** That doc settles the *shape*; this one
> holds the *slots* and, as they're written, the outlines. Cutoff: **Sun 2026-08-30**,
> week-aligned (§5 there). 18 posts: 1 Story hinge + 17 front posts.
>
> **Only the hinge is outlined.** The other 17 owe a read of ~12,700 lines of
> realizations first — which owes the fragmenter, which owes `npm run mirror`.
> Slots below carry their measured week, range and volume so the skeleton is real
> even while the substance is absent. **Do not fill a slot from a commit subject
> line.** That is how arc 109 got mis-summarized as "megafile decomposition"
> (`STORY-BRANCHING.md` §3.4).

---

## The declared frame — every post in this batch is BACKFILL

These 17 front posts cover **2026-06-23 → 08-31** and are **written in September
2026**. They are not live journal entries and must not read as though they were.
The builder's rule:

> *"explaining how the fronts are coming into existence and that their first
> posts are a backfilling exercise from a long pause… honesty never fails us
> here."*

Mechanically, each backfilled post carries both dates in frontmatter:

```yaml
covers: 2026-W27          # the week the post narrates
written: 2026-09-XX       # when it was actually authored
backfill: true            # drop this field once the cadence is live
```

Each front's `index.md` says plainly that its opening posts are backfill from the
pause. Going forward, weekly posts are written in-week and carry no `backfill`.

This matters beyond bookkeeping: `topology.md` already draws the distinction the
site runs on — *"The BOOK is the real-time recognition trail. The Story is the
retrospective."* The Fronts are meant to be the **perpetual present**. This batch
is the one time they aren't, so it gets said out loud rather than papered over.

---

## 0 — STATUS LEDGER

> ⚠ **This tracker is bounded and mortal.** `docs/archived/README.md` records that
> this project's hand-maintained trackers drifted and were retired (FM-7): *"the
> live state of the site is the git log → the rendered content → the memory."*
> That still holds. This ledger is legitimate only because it is **a campaign
> tracker with a declared death**: it covers 18 posts of one backfill batch and is
> **deleted when the batch ships**. It is not a perpetual PROGRESS.md.
> **Where it disagrees with the disk, the disk wins and this file is stale.**

### The pipeline states

`SLOT` → `NOTES` → `DRAFT` → `CONSONARE` → `VERIFIED` → `WIRED` → `SHIPPED`

| state | means | who |
|---|---|---|
| **SLOT** | measured week + volume; no substance yet | — |
| **NOTES** | working notes produced (the `series-008-002-NOTES.md` form) **and weighed against the disk by the orchestrator** | reader agent → orchestrator |
| **DRAFT** | post drafted from notes + gold anchors + WRITING-GUIDE | writer agent |
| **CONSONARE** | graded by an **unprimed** third agent; verdict + score recorded | consonare cast |
| **VERIFIED** | every hash / date / `file:line` fact-checked — **consonare does NOT check facts**, so this is the orchestrator's job and it is where arc 109 got mis-summarized once already | orchestrator |
| **WIRED** | nav entry + `check-nav` + `check-contributions` green | orchestrator |
| **SHIPPED** | committed | orchestrator |

### Per-front progress — 4 concurrent, orthogonal tracks

Fronts advance independently and will not stay in step. That is the point; do not
batch them into lockstep waves.

| front | slots | SLOT | NOTES | DRAFT | CONSONARE | VERIFIED | WIRED | SHIPPED |
|---|---|---|---|---|---|---|---|---|
| The Story (hinge) | 1 | 1 | — | — | — | — | — | — |
| wat Under Its Own Law | 9 | 9 | — | — | — | — | — | — |
| Ars Culta | 2 | 1 | **1** | — | — | **1** | — | — |
| The Exemplar | 1 | 1 | — | — | — | — | — | — |
| Services in Anger | 1 | 1 | — | — | — | — | — | — |
| **total** | **14** | **13** | **1** | — | — | **1** | — | — |

Counts reshaped 2026-09-07: 18 → 14, from a calendar grid to event units (§2).

### Live slot detail

Only slots past SLOT are listed. Everything else is in §2.

| slot | state | consonare | notes |
|---|---|---|---|
| `ars-culta/002` (experiri) | **NOTES ✓ + VERIFIED** | — | notes at `docs/notes/ars-culta-005-experiri-NOTES.md`; scope, orphan-blob find, byte-identity and ledger strike all re-checked against the disk by the orchestrator. **BLOCKED on the builder: no verbatim quotes exist in the repo** (see below) |

**⛔ `ars-culta/002` blocker — consonare rule 11.** The repository contains **no
verbatim builder quotes** for this week. Two exist only in session memory, the
load-bearing one being *"the final run is always the full run again, all spells
return zero L1 and zero L2"* — the bar that produced the 17 rounds. Written from
the commits alone this post reports a collaborative arc as a solo
substrate-report, which is **Level-1 drift**. Three honest exits, and only three:
the builder confirms the quotes; or the stretch was genuinely solo and the post
carries `rune:consonare(solo)` with a reason; or the post does not ship. Inventing
a plausible quote is not on the list.

### Source shapes a reader must be told about

Three, and a reader pointed at only the first will report an empty week:

1. **`docs/arc/**/REALIZATIONS*.md`** — may be **appended to on a branch**. sns-sqs
   added R69 to arc 278's log; a file-level diff shows only "+70 lines" and loses it.
2. **`docs/excursus/2026/08/**`** — `sns-sqs` **only** (84 files). Full strike
   vocabulary (BRIEF / EXPECTATIONS / SCORE / HANDOFF ×16, DESIGN, NOTE, PROBE).
   Not on `main`, not in the arc tree, invisible to the realizations mirror.
3. **Ars Culta's sources are not in `wat-rs` at all** — `datamancy.dev`,
   `datamancy`, `pulsare`, `cingere`, `scratch`, and this repo.

**Walk the commits, not the files.** Globbing finds the end state and loses the
sequence, the intent, and anything folded into an existing document.

---

## 1 — The hinge · `series-006-036` · The Story's last post

**Status:** outline ready. **Written:** now, from the present, looking back.

**The builder's framing, verbatim — this is the post's spine:**

> *"the final story post is a recollection of this…. moving to N concurrent hosts
> who only contend with their own resources — freeing me up to explore many
> concurrent, orthogonal topics."*

> *"the story was a single machine all the way down… now i'm running 4."*

**The number.** The pause is **76 days / ~11 weeks** since the last Story post
(`1664de4`, 2026-06-23), or 65 days / 9.2 weeks since the site was touched at all
(`2eef971`, 2026-07-04). Use the real figure — a post whose move is honesty about
a silence cannot round the silence down.

### The hinge JUMPS the gap — it does not narrate it

**This is the load-bearing constraint on the post.** The builder:

> *"the story just jumps ~3 months to the future to express that work never
> stopped, updates to the site stopped… and now there's concurrent, orthogonal
> work happening and the updates will reflect the various efforts these fronts
> are working on."*

The hinge does **not** tell the story of the 76 days. The fronts do that — 17
posts of it. The hinge states the jump, explains why the shape changed, names
where the work went, and hands off. It should be **short**. An earlier draft of
this outline had it narrating the era, which would have done the fronts' job and
flattened exactly what the branching exists to preserve.

### Section sketch (6 + the declared close)

1. **The jump, stated first.** No throat-clearing. The chronicle stopped
   2026-06-23; this is the first post since — 76 days. **The work never stopped;
   the telling did.** 2931 commits on `main` alone in that window.
2. **The machine that couldn't.** `portal`, the laptop where all of this began.
   Mechanism, not anecdote: a Rust build is not an event, it is the steady state,
   and constant builds made the machine unusable *while* the work was happening.
   A structural limit on how much parallel thought one person can hold.
3. **Four hosts that don't contend.** `portal` → `johndesktop`, then `reason`
   (where the ML work began years ago) and `compute` (an old home server
   repurposed). The property that matters: **each host contends only with
   itself.** Isolation of resources is isolation of attention.
4. **Where the work went — the hand-off.** Names the four fronts and their
   volumes as *evidence that work continued*, then points at them. **Does not
   narrate them.** This section is a door, not a room.

   **This section also absorbs the console.** Ars Culta's backfill was cut 5 → 2
   because four of its five weeks *are this post's subject* — the tooling being
   put in place so work could be handed to other machines. The specifics belong
   here as evidence, not as four posts of their own: `cohaerere` minted (06-26),
   `partire` warded (06-27), the dual-surface — resources **and** tools (08-16),
   the publish hardening that refuses a manifest whose `previous` has no snapshot
   (08-16), and vigilia's *"embedding is the fallback"* (08-22). That is what
   "building the capacity to run four fronts" actually consisted of.
5. **Why the story ends here.** A single line of narration cannot hold concurrent
   orthogonal work without flattening it, and flattening it is the one
   dishonesty available. The chronicle was the honest form for one machine; at
   four it stops being one.
6. **The backfill, declared — and why it is a feature.** The fronts' first posts
   cover June→August and are written now. Said plainly. And the form this
   produces is richer than a live journal would have been: each backfilled post
   carries **both vantages at once** — the week's work as it happened, and the
   view from the far side of the pause, which knows how it turned out. A live
   entry has only the first. The builder:

   > *"we'll get to have a history/journaling lesson along with reflective nature
   > from the future on this… this should be a rich consumer experience."*

7. **`## Likely Contributions to the Field`** — per the builder's gloss, *"a place
   where we reflect on something we may have legitimately built that's beyond
   common knowledge."* Candidates, to be judged rather than asserted: resource
   isolation across hosts as the enabling condition for one person running
   concurrent LLM-driven orthogonal work; and the journal-as-branches structure,
   where the record's topology matches the work's.

**Voice check before it ships:** `WRITING-GUIDE.md` first (the weeds rule —
mechanism over summary), then `consonare` cast against the gold anchors, then
`check-nav` + `check-contributions`.

---

## 2 — The slate, allocated by EVENT

**Reshaped 2026-09-07** from a calendar grid to event units, on the census in
`STORY-BRANCHING.md` §2.6.1. **More than one post may share a week; a week may
hold none.** 14 posts, down from 18 — and every one is *about* something, where a
weekly slice was about whatever fell inside seven days.

### wat Under Its Own Law — `fronts/under-its-own-law/` — 9 posts

| # | kind | unit | trigger |
|---|---|---|---|
| 001 | **closure** | arc **298** — Honest Optionality | INSCRIPTION 2026-07-01 |
| 002 | **reversal** | arc **296** — closed, and would not stay closed | INSCRIPTION added 06-30, **deleted** at `3a4f49202` |
| 003 | **campaign** | arc **300** + the EDN-surface line — *VNVS LECTOR NE DIVIDANTVR* | 25 realization commits, W2 |
| 004 | **campaign** | arcs **293/294** — struct-record symmetry; `HOLONAST-WAS-A-COAT` | 18 + 15 realization commits, W1–W2 + 08-25 |
| 005 | **campaign** | arc **278** — the rules engine, W2→W6 | 116 realization commits; the largest, still open |
| 006 | **incident** | the RequestMalformed DoS — *walls need traffic* | one day, 2026-07-25 (`753b1b9c2`, `91bbb8cd3`) |
| 007 | **closure** | arc **170** — *PER PORTAM COGITAMVS* | INSCRIPTION 2026-07-29 |
| 008 | **campaign** | arc **255** — four axes stop being hand-lists | 6 realization commits W8; the four-axes day 08-30 |
| 009 | **closure** | arc **118** — opened as arc 004 on 2026-04-20 | INSCRIBED 2026-08-19; a four-month arc |

Ordered by trigger date, not by week. Note 005 (arc 278) may not survive as one
post — 116 realization commits is a lot for one page, and the strip test will
decide whether it is one campaign or two. **That is a reader's finding to make,
not a planner's to assume.**

### Ars Culta — `fronts/ars-culta/` — 2 posts

Reduced from 5. The builder's own read: *"the work i'm doing on portal hasn't
triggered any realization or deep commentary — its just been getting tooling in
place to have my work offloaded to other hosts."* That story is **the hinge's**
(§1), and four weekly posts would have retold it four times. What remains is the
work that is not the hinge's subject:

| # | kind | unit | trigger |
|---|---|---|---|
| 001 | **campaign** | the grimoire ethos — failure + constraint engineering encoded as first-load discipline | published 2026-06-30 |
| 002 | **campaign** | `experiri` — the first ward that RUNS rather than reads | published + warded 17 rounds, 2026-08-28 |

`002` is **read and verified** (§0). It is **blocked** on consonare rule 11 — no
verbatim exchange exists in the corpus, and the builder does not recall the
session, so the memory-only quote cannot be ratified. Its disposition will be
`rune:consonare(solo)` with a reason naming the infrastructure character of the
stretch, or it does not ship.

`cohaerere`/`partire` (W1), the dual-surface and publish hardening (W8), and
vigilia's *"embedding is the fallback"* (W9) fold into 001 as the same motion —
the channel being hardened — rather than taking slots of their own.

### The Exemplar — `fronts/exemplar/` — 1 post

| # | kind | unit | trigger |
|---|---|---|---|
| 001 | **opening** | the front opens; `wat-rete` begins becoming the exemplar | `grok-rete` diverges 2026-08-24; 235 commits, 122 docs in-window |

### Services in Anger — `fronts/services/` — 1 post

| # | kind | unit | trigger |
|---|---|---|---|
| 001 | **opening** | the front opens; **`excursus` is invented** — a third documentation form for large efforts that are not arcs | `claude-compute` + `sns-sqs` diverge 08-30; `claude-compute` wraps itself the same day with its own CURARE |

**⚠ These two fronts have NOT had a census.** Their allocation is one post each
because each is one week old at the cutoff, not because anyone measured their
recognition density the way `main`'s was measured. If either turns out to hold
more, it holds more. Do not treat 1 as a finding.

## 3 — Order of work

1. ~~the size wall~~ — **shipped** (`d89022c`).
2. **the fragmenter** — unblocks `npm run mirror`.
3. **`npm run mirror`** — ~12,700 lines of realizations land; the posts get
   something real to cite.
4. **the reading pass** — then and only then, fill the 17 slots.
5. the guard extension (`blog/fronts/**`) before the first front post exists.

---

## 4 — After the batch: W11 is the first weekly

**W11 (Mon 2026-08-31 → Sun 09-06)** is already complete on disk and is the first
post-batch weekly: `main` 369 · `grok-rete` 242 · `sns-sqs` 222 · **`pulsare` 6 ·
`cingere` 22**. The automation tooling lands here rather than in the backfill,
which is the right home for it — the batch ends with the work becoming four
hosts; the first weekly shows the instruments that made that survivable.

Posts in W11 onward are written in-week and carry no `backfill` field.
