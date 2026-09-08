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

### ⛔ CURRENT — 2026-09-08 (second replacement). Replace in place; never append.

**Nothing is pushed.** This repo is **~40 commits ahead of origin/main**, tree
clean, build green: **672 pages, all nine postbuild guards, largest page 0.77 MB.**
Push is deploy; no deploy has happened.

**FOUR POSTS WIRED AND LIVE IN THE BUILD:**
- `blog/story/series-006-036-one-machine-all-the-way-down` — the hinge, Story → Fronts → Epilogue.
- `blog/fronts/under-its-own-law/006-a-caller-is-not-traffic` — consonare **9**.
- `blog/fronts/under-its-own-law/007-the-smallest-of-three` — consonare **7**, shipped.
- `blog/fronts/ars-culta/002-a-declaration-is-only-a-promise` — consonare **7**, shipped with `rune:consonare(solo)`.

Both track landings exist (`under-its-own-law/index`, `ars-culta/index`), and
**Ars Culta is wired into the nav** with its naming reasoning in the config comment.

**⚠ THE BLOCKER ON THOSE TWO POSTS WAS FABRICATED.** They were held at 7 against
a *"house standard of 9"* that **appears nowhere in this repo**. `consonare`'s own
rule is **"If MATCHES at 7+ — the draft ships"**; DRIFTED begins at 6. Eleven
correction agents were spent clearing a bar that did not exist, and the
corrections took one post 8 → 7. Recorded as the second instance of **FM-9**
(a compaction summary inventing its own instruments). **Before holding anything
to a threshold, grep for the threshold.**

**`docs/drafts/` now holds only `uiol-006.md`** — the source draft of a post
already shipped. Everything else moved into the content collection.

**TWELVE UNITS AT SLOT.** Rooms mapped for three: arc 118's closure (`ba3bd70cb`,
floor 4772/4772, a four-month arc), arc 296's reversal (INSCRIPTION added
`7f17054a8` 06-30, **deleted `3a4f49202` 07-01**), The Exemplar's opening
(`de827fb4c` 08-24). §2 holds the full slate; §3 the order of work — items 1–5
are all shipped, so the remaining work is step 4, the reading pass.

**Still the builder's, and cheaper before a push than after:**
1. **Post titles.** Every one is a writer's proposal. **Lower stakes than
   previously recorded**: in Starlight the *filename* is the URL, so a title is
   display-only and swapping one breaks no link. `ars-culta/002` carries its two
   unchosen alternates in an HTML comment under the frontmatter.
2. **The hinge quotes the working session**, not commits — a different provenance
   from every other post, and the builder's words going public. His to strike.

**Sibling state:** `wat-rs` `3dc4f62b7`, 0 ahead, three untracked files that are
the builder's — do not touch. `datamancy.dev` has **moved past the cutoff**:
`peragrare` minted and warded 2026-09-07/08 (`2ce6dd5`, `7980bf4`). First-weekly
material, not this batch.

> **⛔ YOU ARE NEW.** You did not live the session written above. It is a cache,
> not your memory, and it was written by an instance that twice discovered it had
> invented its own instruments. Run `recolligere` from the signed channel and the
> freshness probe in `docs/COMPACTION-AMNESIA-RECOVERY.md` §2 step 0 **before you
> act on one line of it.**

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
| The Story (hinge) | 1 | — | — | — | — | — | — | **1** |
| wat Under Its Own Law | 9 | 5 | **2** | — | — | — | — | **2** |
| Ars Culta | 2 | 1 | — | — | — | — | — | **1** |
| The Exemplar | **4** | 3 | **1** | — | — | — | — | — |
| Services in Anger | 1 | 1 | — | — | — | — | — | — |
| **total** | **17** | **10** | **3** | — | — | — | — | **4** |

Counts reshaped 2026-09-07: 18 → 14, from a calendar grid to event units (§2).

### Live slot detail

Only slots past SLOT are listed. Everything else is in §2.

| slot | state | consonare | notes |
|---|---|---|---|
| `uiol-009` (arc 118 closure) | **NOTES ✓ — orchestrator-verified, WITH A CORRECTION** | — | `docs/notes/uiol-009-arc118-closure-NOTES.md`. **19 verbatim quotes. Substance PASSES (9 items).** Dates grounded: opened `5c438bf74` 2026-04-20, inscribed `ba3bd70cb` 2026-08-19. Through-line: *a law and its exemption written on the same page, and the exemption won because it was cheaper to obey* — then **the wall's first violator was the language itself** (flipping two capability bits took the floor 4747 green → 1802/2945, all cascading from `defservice`'s own macro body). ⚠ **The file opens with an orchestrator correction: its Finding A was half wrong.** The evasion is real (`1eaf83ce8` truncates the builder's quote at the forbidding clause and pre-defends), but the substrate **caught it in 46 hours** (`b1d876f69`) and documented it against itself in source — the reader had grepped only `docs/`. Write it as a discipline working, never as "nobody noticed." **STOP-3 fired → the `Seqable` type-system thread splits out.** Live defect → **F-2**. |
| `uiol-002` (arc 296 reversal) | **NOTES ✓ — orchestrator-verified** | — | `docs/notes/uiol-002-arc296-reversal-NOTES.md`. **19 verbatim quotes / 6 locations. Substance PASSES (7 items survive stripping).** The reversal is real and bigger than the trigger: 28h52m, and **the closure was ORDERED** — `BRIEF-296-error-edn-trait.md:64` says *"Write the INSCRIPTION; flip the 296 DESIGN status to closed. Gate."*, authored 2h07m before the executor complied. The withdrawal commit blames the executor; the disk does not support that. **STOP-3 fired → scoped to the first 29 hours.** The 08-16 second closure (`9b5410118`, falsified 12h41m later by `691b78e2f`) becomes a coda. Candidate separate units: the `WatError` wall, Stone K, R20. **Live defect surfaced → `FINDINGS-FOR-THE-BUILDER.md` F-1.** |
| `exemplar-001` (the front opens) | **NOTES ✓ — orchestrator-verified** | — | `docs/notes/exemplar-001-the-front-opens-NOTES.md`. **11 verbatim quotes. Substance PASSES decisively (10 items).** Census 214 **confirmed**, "35 docs" **refuted**. Corrected the slate's finding-list description (A1–A7 are IDs; L1/L2 are severity bands; T7 is a different list) and its post count (**STOP-3 → 4 posts**, the 34-commit generative strand separates). **Ends at "four of seven struck"** — Class A closes 08-31, past cutoff. |
| `uiol-007` (**the prehistory**) | **NOTES ✓ + VERIFIED + RE-SUBJECTED** | — | ⚠ **reader argues AGAINST a full post** — the closing realization is already published verbatim (216 lines). Survives: the `scratch` prehistory + the anatomy of the closing act. **UNBLOCKED** — `scratch` is holonic and in scope (builder, 2026-09-07) |

**`uiol-007` — scratch provenance, for the drafter.** The prehistory is real and
citable, with one nuance that must be stated rather than smoothed:

- The `scratch` repo is at its tip (`62a6b60`, 2026-06-30, 0 behind origin) and
  holds the May commits directly: `68f79d9` (05-02) *"arc 012 — extract wat-repl
  as foundation"*; `078381c` (05-03) *"arc 019 — wat-cli-options: argv parsing DSL
  + `:user::main` contract"*.
- **The April material was RECOVERED FROM JSONL TRANSCRIPTS** on 2026-05-01
  (`7fc430a`). The documents self-date — `2026/04/006-wat-mcp/one-tool-surface.md`
  carries `date: 2026-04-29`, `**Started:** 2026-04-29`, and attributed
  `User's framing 2026-04-29:` lines. So **the content date is 04-29 and the
  commit date is 05-01**; a draft may cite the framing, but must not imply a
  contemporaneous commit.
- **Not to be confused with `wat-rs/wat-scripts/scratch-pad/`**, which is a
  different thing, was modified 2026-09-07, and is post-cutoff regardless.

**Standing recommendation unchanged:** the reader argued against a full-length
post because the closing realization is already published verbatim. With scratch
in scope, the unit has one strong section (the prehistory) and one strong
mechanism (the anatomy of the closing act) — which is a **short** post, or a fold.
The builder rules.
| `uiol-006` (the DoS incident) | **CONSONARE ✓ — MATCHES / 9** | 7→8→9 | **strongest unit read so far — ready to draft.** 10 quotes, all four instances grounded, and the inherited arc-258 claim REFUTED on the disk |
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

### What the pilot cost, and what it proved

`uiol-006` ran the full pipeline: **SLOT → NOTES → VERIFIED → DRAFT →
CONSONARE(7) → correct → CONSONARE(8) → correct → CONSONARE(9)**. Nine agent
casts including the reader. That is the *calibration* run, not the per-post cost
— the remaining units inherit the briefs, the source-shape map, the quote-search
command, and the two correction passes' lessons.

**Shipped as graded at 9.** One mild repair scar remains and is deliberately NOT
fixed: at `:89–91` the section closes Stone 1 twice, because the first correction
pass relocated the `variant-names-of` paragraph there and it reads as
chronologically prior with an unnamed antecedent. The ward defines 9 as *"one
borderline line… the post can ship at 9"*, and editing after a grading breaks the
property that **what ships is what was graded**.

**Lessons the next writer inherits rather than rediscovers:**

- **Relocating a paragraph into a section requires naming its antecedent in its
  new home**, or the seam shows. This scar is exactly that.
- **Length is measured in WORDS, not lines.** The anchors run 1,778–3,667 words;
  `series-006-011` is 399 lines at 3,667 words. A line-count target sent the first
  writer trimming against a number that meant nothing.
- **Italics have a measurable band: 1.09–2.91 per 1k words.** The first draft came
  in at 10.62. Check it before casting: `sed 's/\*\*[^*]*\*\*//g' F | grep -oE '\*[^*]+\*' | wc -l`.
- **Hashes are 7 characters**, matching the anchors.
- **consonare does not check facts.** Both a fabricated hash and a wrong elapsed
  time ("five hours" where the clock says 2h26m) were caught by the orchestrator
  and by a corrector working past its brief — never by the ward.

### The correction loop — how it goes wrong

Learned on `uiol-007` (8 → 7 → 7) and `ars-culta-002` (7 → 7 → 7). Both regressed
or stalled under correction, and the root cause was the same and was **the
orchestrator's**, not the writers':

> **A correction pass that grows the post is suspect.** Voice defects are
> *removed*, not explained. Every fix briefed as "land this / name that / carry
> one more" adds prose, and additive fixes to a voice problem produce more voice.

Four rules, each paid for:

1. **Cut, don't move.** When a ward flags a line as out-of-register, deleting it
   is the fix. Relocating it preserves the register and only changes its address —
   that is how a scoping caveat became a Level-1 self-narration in the lead, and
   how a `--grep` note landed as a fact connected to nothing.
2. **Brief three to five findings, never all of them.** A cast returns 5–8; each
   round I briefed every one; the accumulation became the next grader's headline
   finding — "editorial register" on one post, "a document defending itself" on
   the other (five sourcing disclaimers, where the anchors bound themselves once).
3. **Open every corrector brief with:** *"If you write a new sentence to answer a
   finding, you have failed the pass."* And **require the word count to fall.**
   The two passes that worked took 121 and 105 words out; the pass that regressed
   put 112 in.
4. **When a corrector flags its own fix as borderline, act on it.** One did —
   *"What the rigidity bought inside this post's own scope is the next section's
   subject"* — I let it stand, and the next grader found it. An agent's own doubt
   about its own edit is the cheapest finding available.

**And the escalation rule:** if two correction passes do not raise the score,
stop correcting. The spell's own guidance is that voice cannot be fixed
surgically when the shape is wrong — the next move is a fresh draft from the
notes, not a fifth surgery.

### Instruments that lied, and their replacements

Every one of these produced a plausible number for a question I had not asked.
The pattern is constant: **state what the instrument can see before quoting it.**

| wrong | right | what it cost |
|---|---|---|
| `git log -S "quote"` | `git log --grep` | `-S` pickaxes DIFF content, not messages. All nine quotes came back NOT FOUND; I was one step from reporting the writer had fabricated every quote in a post. |
| `... \| cut -c1-150` | `... \| fold -w N` | Read a truncation as the content and concluded a corrector had not made an edit it had made. |
| `--since/--until` + `%ad` | `awk` over `%ad` | `--since/--until` filter on **committer** date while `%ad` prints **author** date; up to 47 commits' difference per week in the grid that allocates posts. |
| `mb..branch` for own-work | `branch ^main ^other` | Branches inherit from each other. 109 of `claude-compute`'s 133 commits are `grok-rete`'s; a merge-base range gave a third of one front's output to another. |
| arc-tag regex `\(([0-9]{3})` | match `NNN:` and `NNN 24y` too | Reported 4 arc mentions in a week of 180 commits. |
| row count in a table | count of *live* rows | The warding ledger keeps struck rows in a separate section; "three live rows" was four. |

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
| 002 | **reversal** | arc **296** — closed, and would not stay closed. **SCOPED 2026-09-08 to the first 29 hours** (06-30 07:07 → 07-01 16:35) — the arc is still OPEN at HEAD and is far too large for one post | INSCRIPTION added `7f17054a8` 06-30 10:21, **deleted** `3a4f49202` 07-01 15:13. **Elapsed 28h52m**, both verified |
| 003 | **campaign** | arc **300** + the EDN-surface line — *VNVS LECTOR NE DIVIDANTVR* | 25 realization commits, W2 |
| 004 | **campaign** | arcs **293/294** — struct-record symmetry; `HOLONAST-WAS-A-COAT` | 18 + 15 realization commits, W1–W2 + 08-25 |
| 005 | **campaign** | arc **278** — the rules engine, W2→W6 | 116 realization commits; the largest, still open |
| 006 | **incident** | the RequestMalformed DoS — *walls need traffic* | one day, 2026-07-25 (`753b1b9c2`, `91bbb8cd3`) |
| 007 | **prehistory** | *the smallest of three ate the other two* — April's scratch sketches (wat-mcp, wat-repl, wat-cli-options) and what the argv ask became | `scratch` arcs 006 (04-29) / 012 (05-02) / 019 (05-03); closure 07-29 is the payoff |
| 008 | **campaign** | arc **255** — four axes stop being hand-lists | 6 realization commits W8; the four-axes day 08-30 |
| 009 | **closure** | arc **118** — opened as arc 004 on 2026-04-20. **SCOPED 2026-09-08** (STOP-3): keeps the four-month gap, the memo re-entry, the 585 B measurement, the wall, and the inscription gate's own case-blind hole | INSCRIBED `ba3bd70cb` 2026-08-19; opened `5c438bf74` 2026-04-20. 78 commits, 5 realizations, ~25 stones, two design regimes |
| 010? | **candidate** | **the `Seqable` type-system thread** — split out of 009 by the reading pass: four instances of one named class plus a two-month cost, with R2/R3/R4, clause-TCO, and the `foldr` / silent-`:wat::`-fallback safety finding | not yet a decided slot — the builder rules |

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

### The Exemplar — `fronts/exemplar/` — 4 posts

**Reading pass 2026-09-08. The planner's census was half right, and the finding
list was described wrongly. Corrected here; both were verified by the
orchestrator against the disk, not taken from the agent's report.**

- **214 own in-window commits — CONFIRMED, reproduces exactly.**
  `git rev-list origin/grok-rete ^origin/main --no-merges`, author-date filtered
  08-24…08-30. Zero merges.
- **"35 docs" — REFUTED. It reproduces under no definition.** `docs:` subject
  prefix = **10**; docs-only file sets = **75**; commits touching `docs/` = **155**.
  A post must not quote a docs count until the builder names the definition;
  **75 / 155 are the reproducible sentences.**
- **⚠ The exclusion runs the OTHER WAY here.** `claude-compute` forked *off*
  `grok-rete` on 08-28, so excluding `^origin/claude-compute` when measuring
  `grok-rete` **deletes 109 of grok-rete's own 08-24…08-27 commits.** Exclude the
  sibling when measuring `claude-compute` (24 own, vs 133 naive); do **not**
  exclude it when measuring `grok-rete` (479 all-time ahead of main).

**⛔ The lettered list was described wrongly in the previous slate, and a post
written from that description would have been wrong on the record.**
`A1`–`A7` are **finding IDs** in `docs/arc/2026/06/278-rules-engine/VIGILIA-2026-08-30-WORK-LIST.md`,
each an *invariant proven at one door and assumed at all of them*. **`L1` and `L2`
are severity bands, not findings** — that file's header reads **"41 L1 + 70 L2."**
`T7` belongs to a *different* list, `NEXT-STRIKES-theater-hunt.md`. The old
slate's "A1/A2/A2b/A4/C1/L1/L2/T7" mixed all three.

**⛔ Boundary: Class A CLOSED 2026-08-31 — one day past the cutoff.** The header
of that section reads *"CLASS A — the doors. CLOSED 2026-08-31 (A1…A7). This was
the root."* A3, A5, A6, A7 all close on the 31st. **The opening post ends at
"four of seven struck", never at "Class A closed."**

| # | kind | unit | evidence |
|---|---|---|---|
| 001 | **opening** | the front opens; `wat-rete` begins becoming the exemplar all of wat measures against | `grok-rete` diverges 2026-08-24. The exemplar claim rests on five grounded things: rete is *"the first subsystem to demand totality"* (`57e2adc9b`); **three implementations** — native fire, a wat `$oracle` built to disagree, and Clara 0.24.0 in Clojure on a 33-cell grid (`33/33 :match, 33/33 :us`, `b35327830`), where the third-party twin found an acceptance divergence *"invisible to any wat-vs-wat differential"*; a committed instrument (`scripts/doc-coverage.sh`, whose header says *"A metric with no committed instrument is unfalsifiable"*); 111→0 undocumented fns ≥15 lines and 26→0 tests-that-cannot-fail; and the honest one — it is the only part of the tree with a published list of its own 111 open defects. **The verdict at cutoff is NO, in the breadcrumb's own capitals, and that is the spine.** |
| 002 | **campaign** | the audit — Class A drawn: an invariant proven at ONE door and assumed at ALL of them | 19 wards cast against a tree 184 commits and +19,496 lines past the last cast, gates green throughout, returning **41 L1 + 70 L2** — every finding on a surface the 28 lints cannot see. **Five wards independently found five instances of one class.** The through-line: the named work list was **empty** on the morning of 08-30, and *an empty work list was evidence about how hard we had looked.* |
| 003 | **campaign** | the record audits itself — the front turning its instruments on its own bookkeeping | *"the exemplar-hunt table was fiction — all three 'open' rows stale"* · *"the theater summary said T7 remained; it closed four days earlier"* · *"index the inbound notes — two sat unread for five days, one a silent wrong answer"* |
| 004 | **campaign** | **the generative strand — NEW, promoted by the reading pass (STOP-3)** | Exactly **34 commits**, building a different artifact (`wat/gen.wat`). Separable, and it is where the word *exemplar* enters: *"do we believe that wat-gen is now an exemplar?… did we empower the next set of wat engineers to bulid robust tests cleanly?"* (`6511e91a0`). The opening keeps one bridging sentence to it. |

**Quote density is high here — 11 verbatim builder quotes with hashes, from 124
`builder` lines across the 214 commit bodies.** Pattern for the writer: the
builder's interventions in this window are almost never approvals; at least four
commits carry a subject saying the builder's pushback corrected the apparatus.

### Services in Anger — `fronts/services/` — 1 post

Censused 2026-09-07: **60 own commits in-window** (`claude-compute` 24,
`sns-sqs` 36), 65 docs. **1 is correct, not stingy** — and this reverses my
earlier guess that the front was under-allocated.

In-window, `claude-compute` is doing integration and record-keeping
(*"INTEGRATION: refresh to main's tip"*, *"CURARE: the hold, the corrected
trigger, and the rerere hazard"*) and wraps itself on 08-30 with its own CURARE.
`sns-sqs` lands the excursus corpus at the boundary — its `DESIGN.md` reads
**"Status: DRAWN 2026-08-30"**, the cutoff day itself. **The SNS/SQS build, R69,
and the chaos-engineering series are all post-cutoff** and belong to the first
weekly.

| # | kind | unit | evidence |
|---|---|---|---|
| 001 | **opening** | the front opens — and **`excursus` is invented**: a third documentation form for large efforts that are not arcs, in full strike vocabulary outside the arc tree | `docs/excursus/2026/08/001-sns-sqs/` + `002-handle-lifetime-wall/`; `claude-compute` wraps 08-30 |

> **⚠ Instrument note, recorded because it nearly corrupted this slate.**
> `claude-compute` branched off **`grok-rete`**, not off `main` — merge-base
> `1facc1f94`, 2026-08-28 — so **109 of its 133 commits are The Exemplar's work,
> inherited.** A branch-range census attributed a third of one front's output to
> another and made both look alike (identical `gen`/`fuzz`/`docs` counts were the
> tell). Fronts inherit from each other; **a front's own work must be measured
> with explicit exclusion** — `git rev-list <branch> ^origin/main ^origin/grok-rete`
> — never with a merge-base range. This is the doctrine's own "a front is a
> purpose, not a branch" biting at the measurement layer.

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
