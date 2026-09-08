# Batch outlines — the August backfill

> **Companion to `STORY-BRANCHING.md`.** That doc settles the *shape*; this one
> holds the *slots* and, as they're written, the outlines. Cutoff: **2026-08-31**
> (§5 there). 18 posts: 1 Story hinge + 17 front posts.
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

### Section sketch (7 + the declared close)

1. **The pause, stated first.** No throat-clearing. The chronicle stopped on
   2026-06-23; this is the first post since. Not because the work stopped —
   **2931 commits on `main` alone** in that window — but because the work outran
   the telling.
2. **The machine that couldn't.** `portal`, the laptop where all of this began.
   The mechanism, not the anecdote: a Rust build is not an event, it is the
   steady state, and constant builds made the machine unusable *while* the work
   was happening. This is a structural limit on how much parallel thought one
   person can hold, not a hardware complaint.
3. **Four hosts that don't contend.** `portal` → `johndesktop` (the migration
   forced by §2). Then `reason` (where the ML work began years ago) and `compute`
   (an old home server repurposed). The property that matters: **each host
   contends only with itself.** Isolation of resources is isolation of attention.
4. **What the isolation bought.** Three orthogonal hard problems on one
   substrate, concurrently — wat Under Its Own Law (`main`), The Exemplar
   (`grok-rete`, opened 08-24), Services in Anger (`claude-compute` + `sns-sqs`,
   08-30) — plus the console. Real volumes per front; the numbers are the
   argument.
5. **The second operator.** The duet: Grok on its own branch and its own worktree
   from **2026-08-03**, then `grok-rete` from 08-24. Frontier models on separate
   hosts, not threads on one. `pulsare` and `cingere` are **September** — a
   forward-pointer here, not content.
6. **Why the story ends here.** A single line of narration cannot represent
   concurrent orthogonal work without flattening it — and flattening it is the
   one dishonesty available. The chronicle was the honest form for one machine.
   At four it stops being one. So the Story ends and the Fronts begin.
7. **The backfill, declared.** The fronts' first posts cover June→August and are
   written now. Say it in the hinge, not only in the front indexes.
8. **`## Likely Contributions to the Field`** — per the builder's gloss, *"a place
   where we reflect on something we may have legitimately built that's beyond
   common knowledge."* Candidates, to be judged honestly rather than asserted:
   resource isolation across hosts as the enabling condition for one person
   running concurrent LLM-driven orthogonal work; and the journal-as-branches
   structure itself, where the record's topology matches the work's.

**Voice check before it ships:** `WRITING-GUIDE.md` first (the weeds rule —
mechanism over summary), then `consonare` cast against the gold anchors, then
`check-nav` + `check-contributions`.

---

## 2 — The front slots (17), measured

Weeks run Monday. Volumes are commits in that week on that front's branches.
**Empty weeks produce no post** (`STORY-BRANCHING.md` §2.6).

### wat Under Its Own Law — `fronts/under-its-own-law/` — 10 posts

| slot | week | commits | outline |
|---|---|---|---|
| 001 | W1 · 06-22 | 303 | — owes the read |
| 002 | W2 · 06-29 | 344 | — |
| 003 | W3 · 07-06 | 127 | — |
| 004 | W4 · 07-13 | 114 | — |
| 005 | W5 · 07-20 | 208 | — |
| 006 | W6 · 07-27 | 287 | — |
| 007 | W7 · 08-03 | 153 | — |
| 008 | W8 · 08-10 | 259 | — |
| 009 | W9 · 08-17 | 462 | — |
| 010 | W10 · 08-24 | 345 | — |

Known anchors, unread: arc **170** closes 07-29 (the arc behind the 170
chronicle) · arc **118** closes 08-19 · arc **296** closes 06-30 then **reopens**
· arc **255**'s four-axes day 08-30 · arc **294**'s repudiation of
`series-006-016 "The Loop Closes"` (`HOLONAST-WAS-A-COAT`) · arc **109** as
surface annihilation.

### portal (the console) — name **[OPEN]**, intueri not yet cast — 5 posts

| slot | week | work |
|---|---|---|
| 001 | W1 · 06-22 | `cohaerere` minted + published; `partire` warded; 17 scratch design commits |
| 002 | W2 · 06-29 | the grimoire ethos — failure + constraint engineering as first-load discipline, warded + published; the site's brand/logo/theme + landing reframe (26 commits) |
| — | W3–W7 | **silent.** No posts. The gap is true. |
| 003 | W8 · 08-10 | grimoire dual-surface (resources *and* tools); publish hardening — refuse a manifest whose `previous` has no snapshot |
| 004 | W9 · 08-17 | grimoire + vigilia — *"embedding is the fallback"* |
| 005 | W10 · 08-24 | **`experiri` minted + published 08-28** — the executing ward, warded 17 rounds, 0 un-dispositioned |

### The Exemplar — `fronts/exemplar/` — 1 post

| slot | week | commits | note |
|---|---|---|---|
| 001 | W10 · 08-24 | 235 | the front opens 08-24; 122 docs authored in-window |

### Services in Anger — `fronts/services/` — 1 post

| slot | week | commits | note |
|---|---|---|---|
| 001 | W10 · 08-24 | 180 | opens 08-30; `claude-compute` wraps itself 08-30 (its own CURARE), `sns-sqs` runs on |

---

## 3 — Order of work

1. ~~the size wall~~ — **shipped** (`d89022c`).
2. **the fragmenter** — unblocks `npm run mirror`.
3. **`npm run mirror`** — ~12,700 lines of realizations land; the posts get
   something real to cite.
4. **the reading pass** — then and only then, fill the 17 slots.
5. the guard extension (`blog/fronts/**`) before the first front post exists.
