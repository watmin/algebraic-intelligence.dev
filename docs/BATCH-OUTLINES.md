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

### ⛔ CURRENT — 2026-09-08 (third replacement). Replace in place; never append.

**Nothing is pushed.** ~49 commits ahead of origin/main, tree clean, build green:
**678 pages, 73 narrative posts, 12 front posts, all nine guards.**

**EIGHT OF SEVENTEEN SHIPPED.** All four fronts exist, carry landings, and are
wired into the nav. **Ars Culta is COMPLETE** — both slots shipped, and its two
posts interlock: `001`'s ledger row, the one certifying its own week, is one of
the two rows `002`'s gate struck.

| front | shipped | remaining |
|---|---|---|
| The Story (hinge) | 1/1 | — |
| wat Under Its Own Law | 6/**12** | 004, 008 + **arc 278 split into 005a–005d** |
| Ars Culta | **2/2** | — |
| The Exemplar | 1/4 | 002 (re-scoped), 003, 004 — all at NOTES |
| Services in Anger | **1/1** | — |

**THE BATCH GREW 17 → 20, and that is the reading pass working.** Arc 278's room
is 702 files and 12,329 lines of realizations; its reader was briefed to propose
its own cut rather than be forced onto one page, and returned **four units with a
declared orphan** (2026-07-04→07-07, 60 commits — strong material, wrong front).
The Exemplar's `002` was **re-scoped rather than written**, because as briefed it
was the post already shipped as `001`.

**THE PIPELINE WORKS AND THE NUMBERS SAY WHY.** The two posts written before the
reading passes took **four consonare casts each to reach 7**. The four written
after took **one cast each to reach 8**. Nothing about the writing changed. What
changed is that the briefs carried the reading pass's corrections already — the
refuted census, the mislabelled letters, the scope cuts — so no writer spent a
draft on a wrong premise, and nobody ran an additive correction loop afterward.

**Every correction pass is subtractive.** Measured each time, prose only. The one
pass where the total rose, the increase was entirely a rune comment; the prose
fell 2870 → 2859.

**FIVE FINDINGS FOR THE BUILDER** in `FINDINGS-FOR-THE-BUILDER.md`, all verified
by the orchestrator against the disk, none fixed — `wat-rs` is read-only:
F-1 (arc 296's DESIGN still says CLOSED, pointing at a file deleted 70 days ago,
while two younger docs cite its absence as proof it is open) · F-2 (three doc
lines assert a cache the code no longer has) · **F-3, the largest — arc 298's
annihilated `<runtime>:0:0` sentinel is back at HEAD, taking the `Option<Span>`
the design explicitly rejected, with a doc comment calling it honest** · F-4 (one
migration, two site counts, no population named) · F-5 (the excursus README's
"seventeen" is eleven — **and this site published that number before counting
it**).

**⚠ THE MISTAKE WORTH CARRYING.** F-5 is mine. I took a README's self-report and
shipped it to a live page. The README exists specifically to decode misleading
labels, which made me trust it *more* rather than less. **A source's self-report
is a claim, not a measurement** — the correction stayed visible on the page.

**Still the builder's:** post titles (display-only — the filename is the URL, so
a swap breaks no link; alternates are recorded above) and whether the hinge may
quote his working-session words.

**Sibling state:** `wat-rs` `3dc4f62b7`, 0 ahead, three untracked files that are
his — do not touch. `datamancy.dev` `7980bf4` has moved past the cutoff
(`peragrare`, 09-07/08): first-weekly material, not this batch.

> **⛔ YOU ARE NEW.** You did not live the session written above. It is a cache,
> not your memory, and the instance that wrote it discovered three times that it
> had invented its own instruments — a freshness probe, a scoring standard, and a
> count it never ran. Run `recolligere` from the signed channel and the freshness
> probe in `docs/COMPACTION-AMNESIA-RECOVERY.md` §2 step 0 **before you act on one
> line of it.**

### ⛔ Off-limits source material

**`wat-rs` arc 300 `REALIZATIONS.md`, R9–R17.** The reading pass identified these
nine realization commits as **the builder's personal history**, signed in the
record *"kept with consent"*, and correctly declined to summarize them. **That
stands as a hard boundary for this batch**: no reader, writer or grader reads,
quotes, characterizes or works around them. Whether any of it is publishable is
the builder's call and has not been asked.

This is separate from the witness items, which are also untouched.

### Title alternates — the writers' unchosen proposals

Recorded here because the in-page scaffolding was stripped (two consonare casts
flagged it as draft apparatus addressing the author from inside the page). **The
title is display-only — the FILENAME is the URL — so any swap below is free and
breaks no link.**

| shipped post | wired title | the alternates |
|---|---|---|
| `services/001` | **A Place to Be Wrong In** | The Number That Was Not Asked For · What the Instrument Cannot See |
| `ars-culta/001` | **A Discipline You Fetch Is a Discipline You Skip** | The Shelf That Loads First · Constraint Engineering Has No Moment |
| `under-its-own-law/001` | **No Absence Is Implicit** | There Is No Nowhere · Half a Round Trip |
| `exemplar/002` | **A Wrong Number Is Not an Error** | Every Failure Prints as a Speedup · The Mean and the Minimum, Nine Thousand Lines Apart |
| `exemplar/003` | **A Prose File Cannot Go Red** | A Summary of a List Rots Faster Than the List · Eight of Nine |
| `under-its-own-law/005c` | **A Fence Around Its Own Tongue** | You Cannot Compile a Lie · The Closed Alphabet |
| `under-its-own-law/005b` | **The Law Caught in Its Own Words** | A Raise Is Not a Surfacing · Mute Has No Form |
| `under-its-own-law/005a` | **The Differential That Never Ran** | The Regime Where Both Are Right · Not a Wall, a Flaw |
| `under-its-own-law/004` | **Built Backwards** | Portable Was the Symptom · The Data Back in Its Chair |
| `under-its-own-law/008` | **The Compiler Is the Census** | Declaring Nothing Is Illegal · Two Different Properties Wearing One Name |
| `under-its-own-law/003` | **The Reader That Lied** | Two Readers, One Alphabet · It Never Drove a File |
| `under-its-own-law/002` | **Closed Before It Was Measured** | The Inscription Git Kept · A Checklist for a Property |
| `under-its-own-law/009` | **The Wall's First Violator** | A Law and Its Exemption on the Same Page · Cheaper to Obey |
| `ars-culta/002` | **A Declaration Is Only a Promise** | The Ward That Runs · A Broken Driver Finds a Jackpot |
| `exemplar/001` | **An Empty List Is Not a Clean One** | Which Door Proved This · Nineteen Wards Against a Green Tree |

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
| wat Under Its Own Law | **12** | — | **1** | — | — | — | — | **11** |
| Ars Culta | 2 | — | — | — | — | — | — | **2** |
| The Exemplar | 4 | — | **1** | — | — | — | — | **3** |
| Services in Anger | 1 | — | — | — | — | — | — | **1** |
| **total** | **20** | — | **2** | — | — | — | — | **18** |

Counts reshaped 2026-09-07: 18 → 14, from a calendar grid to event units (§2).

### Live slot detail

Only slots past SLOT are listed. Everything else is in §2.

| slot | state | consonare | notes |
|---|---|---|---|
| `services-001` (the front opens) | **NOTES ✓ — orchestrator-verified, SLATE REFUTED** | — | `docs/notes/services-001-the-front-opens-NOTES.md`. **19 verified quotes. Substance PASSES DECISIVELY (8 items).** Through-line: *a rule that gates entry into a committed space needs an uncommitted space to gate people into.* **The slate's "post-cutoff" claim is refuted — the whole SNS/SQS build is in window.** STOP-1 partially fired: the README's "seventeen" is **eleven**, counted. Live defects → **F-5**. |
| `uiol-001` (arc 298 closure) | **NOTES ✓ — orchestrator-verified** | — | `docs/notes/uiol-001-arc298-closure-NOTES.md`. **26 verbatim quotes. Substance PASSES (8 items).** A 3h38m arc — 04:01:52 → 07:39:53 on 2026-07-01 — that swerved out of 296 and inscribed itself the same morning. Through-line: **the law the arc wrote for values — absence must be spoken, never inferred — is the law its own closure document broke.** Three failure modes named as one bug: elide, sentinel, transparent erasure. Tightest mechanism: **killing the sentinel killed the eliding** — all 17 `is_unknown()` consumers existed only to suppress the fake. ⚠ One quote at `REALIZATIONS.md:390` is **from a different Claude thread relayed by the builder — do NOT attribute it to him.** STOP-1 fired on INSCRIPTION-vs-later-record, not internally. Live defects → **F-3** and **F-4**. |
| `uiol-003` (arc 300 campaign) | **NOTES ✓ — orchestrator-verified, WITH A CORRECTION** | — | `docs/notes/uiol-003-arc300-campaign-NOTES.md`. **~35 verbatim utterances across 20 entries. Substance PASSES (11 items).** **ONE post, not two** — the joint is a committed artifact: the clj-oracle differential reached parity *"all but rationals"*, and closing that one exemption produced the whole numeric tower. **Through-line: the reader that lied.** The arc never drove a single corpus file; its product is everything the preparation was forced to find, each one a reader being dishonest about wat's own source. **VERIFIED AND IT IS THE SPINE: the two readers are still two at HEAD and disagree about the ALPHABET** — `wat-reader/src/lexer.rs:536` refuses non-ASCII, `wat-edn/src/lexer.rs:281` accepts `\é`. ⚠ **The notes open with a correction**: "1305 heads" is the occurrence count; heads are **800**, lines are 931. ⛔ **R9–R17 off limits.** Lead with the readers, not `AGENT-SMITH` — that headline is already `009`'s. |
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
| 005a | **campaign** | arc 278 · **the differential that never ran** — one day, 2026-07-03, 20 arc-dir commits | A real consumer went multi-round and found the fixpoint had never been differentially tested — **both impls wrong on different axes, diverging from each other.** The fix was not truth maintenance but *ordering the rules*, which purity is what makes possible. Then the builder cut the argument for over-reaching (purity bought correctness, not speed), and a three-minute "scaling wall" turned out to be a linear scan. **Hook:** `series-006-034` published *"beat Clara on every realistic workload"*; R18 records *"the single-pass parity that lied underneath."* |
| 005b | **campaign** | arc 278 · **the law that caught itself** — 2026-07-16 → 07-24, 129 commits | *wat never hides a failure* — proclaimed, then caught blessing the exact mechanism that masks, then found masking **inside its own verifier** (the harness swallowed a crashing child and passed the test), then proved incomplete by *use* after "complete". Cure: one sentence enforced across seven verbs and two compile-time discard doors. **Ending:** the seventh outcome wall never shipped and was never abandoned — it was **refused for a stated reason** (`770eeaf7d`, a locus has no return value), which is a better close than a completion. |
| 005c | **campaign** | arc 278 · **a fence around its own tongue** — 2026-07-31 → 08-06, 214 commits. **The richest unit: 9 recognitions survive the strip** | *"How do we compile our `where` clauses?"* is a total-knowledge demand, so it audited seven substrate lies nobody was hunting — and then the language **fenced its own query surface**: `is-pure ∧ is-det ∧ is-total ∧ is-rete`, with **`:wat::core::foldl` refused inside wat's own DSL**, and `total?` — which had shipped callable-and-unarmed — getting its first real consumer. |
| 005d | **campaign** | arc 278 · **the watch that found nothing** — 2026-08-17 → 08-27, 103 commits | The compiled program named as a 614-byte residual; a theater hunt returning two honest **negative** verdicts; wat-grep violating the no-hidden-failures law **in code annotated with that law's name**; the vigilia run to a preset fixed point of two empty recasts — **and then a wat-native fuzzer finding 72 divergences four days later.** ⚠ **Half this unit is branch-only** (`b2939f12b` and the 08-25→08-27 fuzzer campaign are on `grok-rete`/`gen-tests`, not `main`); the notes carry a main-only fallback shape. |
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
| 002 | **campaign** | ⛔ **RE-SCOPED — as briefed this unit IS the shipped `001`.** `001`'s own `description:` already carries the nineteen-wards/41-L1-70-L2 sentence and its Class A section narrates the table. **002 becomes THE INSTRUMENTS:** Class C (*"Blocks trusting ANY recorded cost number in this arc"*) plus the 30th's unspent campaign — a mean-vs-minimum estimator reading `H−M` as **−93.33 ms**, a benchmark that called the wrong arm "the engine" **for eleven days**, `probare` acquitting the prose while `intueri` convicted the self-description, a `| tail -12` that destroyed a red's only evidence, a census that counted 37 where there were 96, and a harness with **one assertion across eight tests.** | 19 wards cast against a tree 184 commits and +19,496 lines past the last cast, gates green throughout, returning **41 L1 + 70 L2** — every finding on a surface the 28 lints cannot see. **Five wards independently found five instances of one class.** The through-line: the named work list was **empty** on the morning of 08-30, and *an empty work list was evidence about how hard we had looked.* |
| 003 | **campaign** | the record audits itself — the front turning its instruments on its own bookkeeping | *"the exemplar-hunt table was fiction — all three 'open' rows stale"* · *"the theater summary said T7 remained; it closed four days earlier"* · *"index the inbound notes — two sat unread for five days, one a silent wrong answer"* |
| 004 | **campaign** | **the generative strand — NEW, promoted by the reading pass (STOP-3)** | Exactly **34 commits**, building a different artifact (`wat/gen.wat`). Separable, and it is where the word *exemplar* enters: *"do we believe that wat-gen is now an exemplar?… did we empower the next set of wat engineers to bulid robust tests cleanly?"* (`6511e91a0`). The opening keeps one bridging sentence to it. |

**⛔ TWO DIFFERENT LETTERED SYSTEMS LIVE ON THIS FRONT. Do not conflate them —
`002` is literally "the lettered audit", so it is the post most at risk.**

| system | what the letters are | when |
|---|---|---|
| **defect families A, C** | earlier defect families, closed together | `b2939f12b`, **2026-08-26 15:56** — *"families A and C CLOSED — they were ONE root, and the ratchet is now 0"*. **Inside the window.** |
| **work-list Class A (A1–A7)** | doors: *an invariant proven at ONE door, assumed at ALL of them* | drawn in `VIGILIA-2026-08-30-WORK-LIST.md` on the 30th. **The CLASS closed 2026-08-31 (the file's own header). FOUR OF SEVEN closed on the 30th** — `74e7f2dd7` 21:41 (A1, A2, A2b) and `af75d480f` 22:55 (A4), author == committer, both in window. A3/A5/A6/A7 are the 31st. |

**Resolved 2026-09-08, after two readers disagreed.** The arc-278 reader flagged
the "closed 08-31" claim as wrong because the two closure commits it found are
dated 08-30; the exemplar reader had said the class closed 08-31. **Both are
right and the distinction is the post's:** four members closed inside the window,
the class closed outside it. `exemplar-001` shipped saying *"four of seven
struck"*, which is correct as written.

**⛔ AND THE WORK LIST IS NOT ON `main`.** It exists only on `origin/grok-rete`
(checked: main 0, grok-rete 1, claude-compute 0, sns-sqs 0). **It therefore
belongs to The Exemplar, not to wat Under Its Own Law** — `uiol-005` is a `main`
unit and must not claim it.

Both are real, both are "A", and they are eight weeks and two instruments apart.
The hinge's *"families A and C closed together"* is the **first** one and is
correctly in-window — verified `b2939f12b`, 08-26. `exemplar-001` uses the
**second** and correctly stops at "four of seven struck". A post that merges them
would date one event to the other's day.

**⛔ TWO ERRORS WERE FOUND IN THE SHIPPED `001` AND CORRECTED IN PLACE (2026-09-08).**
It said the word *exemplar* did not enter the corpus as a designation — it had
been a label in commit bodies **since 2026-05-27**, and even in-window
`78e344bac` (08-26 00:36) precedes `6511e91a0` by **13 hours**. It also said
`src/rete` was *"roughly ninety files"*; at the cutoff commit it is **56**. The
true and better claim, now on the page: the strand is where the word stops being
a description and becomes a bar.

**Quote density is high here — 11 verbatim builder quotes with hashes, from 124
`builder` lines across the 214 commit bodies.** Pattern for the writer: the
builder's interventions in this window are almost never approvals; at least four
commits carry a subject saying the builder's pushback corrected the apparatus.

### Services in Anger — `fronts/services/` — 1 post

**Reading pass 2026-09-08. The slate was WRONG about the cutoff, and the disk
refuted it — correcting here.**

**⛔ "The SNS/SQS build is post-cutoff" is FALSE.** The cutoff marker `ca405009b`
is **2026-08-30 23:48:51**, and **all 36 `sns-sqs` own commits are that same
day** — including stone 3 (`17d32938d`, SQS lands, 18:22) and stone 7
(`4139cddfc`, the 8,000-outcome fan-out proof, 21:01). The build is **in window
and is the post's body.** Only R69 (09-02) and the chaos series (09-03+) are
post-cutoff, plus excursus `002` (08-31) and the arc-278 circuit/perf run.

**⚠ ZONE TRAP.** The `SCORE-*` files date in **UTC** while commits are `-0700`,
so `SCORE-stone-5` reads "2026-08-31" for a commit dated 08-30 19:56. **Reading
the SCOREs instead of the commits pushes stones 5–7 past the cutoff and out of
the post.** Date from the commits.

| # | kind | unit | evidence |
|---|---|---|---|
| 001 | **opening** | the front opens — `excursus` is invented, and the work it was invented to hold turns out to be worth holding | Two branches, two machines, three days (`2026-08-28 12:14` → `08-30 23:48`), **60 own commits**, and **the same defect class fires on both.** On `sns-sqs` the apparatus needed a home and the tree offered exactly one shape, so it minted `arc 301` unasked — **the second time with the identical number.** On `claude-compute`, a drift gate built for retired *names* reported clean against a refresh whose 41 reds were a retired *form*. **19 verified quotes**, two of which the planner did not have — including the actual argument, absent from the README: *"this is us experimenting freely … arc 278 is about building wat-rete … but rete's needs do not extend to message delivery and processing"*. |

**What the excursus form makes impossible — four grounded mechanisms**, and this
is the post's payload:

1. It removes the **occasion** rather than discouraging the act — exploration gets
   the same apparatus in a disjoint number space, so *starting work* no longer
   touches arc numbers at all.
2. The `EXCURSUS(NNN):` prefix puts the distinction in **the one surface that
   cannot be corrected later.** The tree moved and 76 reference lines swept in one
   commit; eleven commit subjects say `(301)` forever.
3. Disjoint numbering makes **promotion a discrete builder act** — there is no
   gradient toward minting.
4. **The identical ladder was ruled the same day for code**: `wat-scripts/<name>/`
   → `wat/<name>.wat`, *"once they demonstrate excellence"*, with the grep
   precedent's standard — *"the counts are the proof it moved intact."*

**And the work is not paperwork.** SNS shipped needing **zero substrate change**;
then *drawing* SQS found the Store could not `delete`, `mem-store`'s `put`
appended where DynamoDB's `PutItem` replaces, and `#inst` rendered at variable
width — so **every range scan over a timestamp sort key was unsound.**

**`claude-compute`'s 24 own commits are NOT split out** (STOP-2 considered and
declined): they are the window's second instance of its one class, and splitting
them destroys the post's strongest fact.

**Do not quote the README's "seventeen".** Counted: **eleven**. See
`FINDINGS-FOR-THE-BUILDER.md` F-5 — this site published the README's number
before counting it. Also: *"did a rogue 301 enter?"* exists **only** at
`docs/excursus/README.md:30` and in no commit anywhere; the other arcs quote is
in a commit body, which is primary where the README normalised its punctuation.

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
