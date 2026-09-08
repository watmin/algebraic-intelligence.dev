# Working notes — exemplar-002, "the lettered audit"

**Status:** raw notes, not a draft. Written 2026-09-08 by a reader working the
`wat-rs` exemplar-front backfill. Everything below is grounded against
`origin/grok-rete` in `/home/watmin/work/holon/wat-rs`, read this session.
Nothing in `wat-rs` was edited.

**Window:** Monday 2026-08-24 → Sunday 2026-08-30. Verified: `git rev-list
origin/grok-rete ^origin/main --no-merges` = **479** commits total, of which
**214** carry an author date in `[2026-08-24, 2026-08-31)`. Merge-base is
`de827fb4c`; the last in-window commit is `e6858e858` (2026-08-30 23:54:11
−0700). All 214 are authored *and* committed `watmin`.

**Title and song-drop are ALWAYS the builder's call.** Working images below, not
proposals.

---

## ⛔⛔ STOP-1 FIRES. THE UNIT AS BRIEFED IS THE POST THAT ALREADY SHIPPED.

The brief describes `exemplar-002` as: *"Class A drawn — the doors. Nineteen
wards cast against a tree 184 commits and +19,496 lines past the last cast,
gates green throughout, returning 41 L1 + 70 L2, every finding on a surface the
28 lints cannot see. Five wards independently found five instances of one
class."*

**Every clause of that is already in the shipped `001`.** Not paraphrased —
`001`'s own `description:` frontmatter reads:

> Nineteen wards were cast against that green tree the same evening and returned
> 41 L1 + 70 L2, every finding on a surface the 28 lints cannot see. Five of them
> independently found five instances of one class: an invariant proven at one
> door and assumed at all of them.

And `001` §"Class A — three doors into a session" reproduces the work list's
Class A table verbatim (A1–A5, with the `found by` column), the `export.rs:15-17`
law, the *"None is a graph wall"* line, and then narrates **A1, A2, A2b and A4**
concretely — including the inert `or_insert`→`insert` mutation, the `arm_lease.rs:141`
green test, and the fix rule *"a wire-reachable invariant may not be spelled
`panic!`"*. `001` also carries the 14-row draw/strike/curare rhythm table for the
evening of the 30th, the STATUS-IS-EDITED-HERE banner, the docs-graveyard gate
with *"where does this file live such that it does not run?"*, and the Class F
directive quotes.

There is no second post in that material. Writing one produces a rerun.

### What IS unspent, and it is a full post

`001` took Class A whole and left **Classes B, C, D, E and F almost untouched**
(it names "draw C1" in one table cell and quotes F's directive; nothing else).
The largest unspent block is **Class C — the instruments** — and around it, on
the 30th, sits a self-contained campaign `001` only glances at.

**The proposed re-scope, and the through-line that carries it:**

> *A codebase spent a week measuring itself, and then discovered the
> measurements were the least reliable thing it owned.*

Concretely, all in window, none of it in `001`:

- `89e8c3ed0` — every cost split in the suite took the **mean of 3 rounds** while
  the calibration function one page up took the **minimum**. One instrument, two
  estimators, the wrong one on the larger measurement. 106 accumulators converted.
- `b7d9d8e90` — a benchmark row **labelled the wrong data structure "(engine)"
  for eleven days**, under a green test, and the number beside the label was right.
- `99bf573df` — two wards cast at the same work **disagreed, both were right**, and
  the finding is the disagreement. It also yields the sharpest generalisable line
  of the week: *on a comparison benchmark, every plausible failure makes the
  measured arm look better.*
- `edd8f9807` — the orchestrator piped a floor run through `| tail -12` and
  **destroyed the only evidence of a red** it had just caused. 1,302 bytes survived.
- `78c0435ab` / `e6858e858` — C1's population counted **37** and was actually **96**,
  because the regex was shaped from the first site the counter read.
- `0192592cc` — a harness banked as "the failing gate" held **one real assertion
  across eight tests**. *"A `println!` of a correct matrix looks exactly like a
  proof and is not one."*
- Class C's own banner in the work list: **"Blocks trusting ANY recorded cost
  number in this arc."**

That is a campaign with a beginning (a work list row), a middle (five instrument
strikes in nine hours) and an end (a class-wide moratorium on the arc's own
numbers). Notes for it are below.

**If the writer rejects the re-scope**, the honest fold is: fold this unit's
Class C material into `003` (both are "the record was wrong about itself") and
ship two posts, not three. `004` stands alone either way. Two strong posts beat
three thin ones.

---

## ⚠ Three corrections to the brief and to `001`, all checkable

**1. `001` says `src/rete` is "42,384 lines across roughly ninety files". The
line count is exactly right; the file count is not.** At `e6858e858`,
`git ls-tree -r --name-only e6858e858 src/rete/` returns **56** paths, all `.rs`,
and their `wc -l` sums to **42,384**. Not ninety. (The work list's own figure,
42,012, is also correct — measured at the cast HEAD `78b1fad56`, about six hours
earlier. Two right numbers at two commits, not a contradiction.)

**2. "28 lints" is exactly right and can be stated with its population.** At
`e6858e858`, `tests/lint/` holds 34 tracked paths: 6 `.wat` fixtures, `mod.rs`,
and **28 `.rs` lint files**. That is what the number counts.

**3. "184 commits and +19,496/−11,996 lines" has two different bases, two commits
apart.** Both halves are real; they were measured from different points.
- `+19,496/−11,996` in `src/rete` reproduces **exactly** from `2615e94a5`
  (2026-08-24 23:34, the last commit of the 24th) to `78b1fad56`.
- But `git rev-list --no-merges 2615e94a5..78b1fad56` = **186**, not 184.
- **184** reproduces exactly from `26a0d937a` (2026-08-25 00:54) — and *that* base
  gives `+19,424/−11,990`.
- Similarly "19 files that did not exist then": my set-difference of
  `git ls-tree -r` between `2615e94a5` and `78b1fad56` gives **21** new files under
  `src/rete/`, not 19.

None of this changes the argument. It is worth one sentence in a post whose
subject is instruments, and it should be stated as *"the record's own scoping
numbers are two commits out of register"*, not as an error hunt.

---

## ⛔ The conflation hazard, checked and confirmed

Both lettered systems exist and they are eight weeks and two instruments apart.
Grounded:

| system | what | when | in window? |
|---|---|---|---|
| **defect families A, C** | earlier fuzzer-found defect families | `b2939f12b`, *"rete: families A and C CLOSED — they were ONE root, and the ratchet is now 0"*, **2026-08-26 15:56 −0700** | **YES** |
| **work-list Class A (A1–A7)** | *an invariant proven at ONE door, assumed at ALL of them* | drawn in `docs/arc/2026/06/278-rules-engine/VIGILIA-2026-08-30-WORK-LIST.md`, landed by `d024afb2e` **2026-08-30 18:54** | **drawn in window; CLOSED 2026-08-31, past the cutoff** |

Confirmed by the file's own history: `0787e3415` *"score: A7 weighed — Class A is
closed, and mutation 3 indicted A4"* is **2026-08-31 23:34**. Four of seven (A1,
A2, A2b, A4) were struck before midnight on the 30th; A3, A5, A6, A7 were not.

Also confirmed: **`L1` and `L2` are severity bands, not findings.** The work
list's header reads *"**41 L1 + 70 L2.**"* and F3 is titled *"the 70 L2 not
itemised here"*. And **`T7` belongs to a different list** —
`NEXT-STRIKES-theater-hunt.md` — where it is a *theater-hunt* row, closed
2026-08-25. See `003`'s notes; T7 is `003`'s material, not this unit's.

---

## ⏱ STOP-3 — where the boundary falls, and a clock problem

**A clock discrepancy the post must handle.** The arc's prose dates are **UTC**;
`git`'s author dates on these commits are **−0700**. The file at the cutoff
commit `e6858e858` (2026-08-30 23:54:11 −0700) already contains three strings
reading `2026-08-31`:

- `:127` — *"Found **2026-08-31** by the builder asking one question of a file I had
  just banked"* (that finding is `819c79b9a`, **2026-08-30 23:03 −0700**)
- `:186` — *"C1 ⚠ SCOPED **2026-08-31**"* (that is `78c0435ab`, **2026-08-30 23:51 −0700**)
- `:196` — *"Counted **2026-08-31** on the real signal"*

Cross-checked against the floor artifacts, which are UTC-stamped: `2a7051c67`
(2026-08-30 20:59 −0700) cites `.floor/2026-08-31T03-33-26Z`. So the last five
hours of the window are labelled "the 31st" inside the record and "the 30th" in
`git log`. **Pick one clock and say which in the post.** `001` used the −0700
author dates throughout; staying consistent with it is the safer call.

**What belongs to a later post, explicitly:**
- Class A's other four rows (A3, A5, A6, A7) — struck 2026-08-31, all past cutoff.
- Classes C, D, E, F's closures — every one of them lands 2026-09-01 through
  2026-09-04 (`git log … -- VIGILIA-2026-08-30-WORK-LIST.md` shows 50+ commits after
  the cutoff).
- **F3's referent does not exist.** `7ed71cf12` (2026-09-01 19:54): *"record: F3's
  referent does not exist — the 70 L2 have no ward reports."* At the cutoff, the
  work list points 70 findings at reports that were never written. That is a
  wonderful beat and it is **out of window** — flag it for a later unit, do not
  smuggle it in.

---

## The through-line (one paragraph) — for the re-scoped unit

For one week a rules engine was measured against itself on every axis anyone
could name — comment density, nesting, undocumented functions, per-phase
nanoseconds, arm-versus-arm ratios — and the week's real discovery was that the
measuring was worse than the thing measured. The benchmark suite took the mean of
three rounds while its own calibration function, nine thousand lines above,
took the minimum and said in a comment why; the first round of every arm paid a
one-time cost of 287 ms against 11 ms for identical work, so the reported figure
was mostly a report of **which arm ran first**, and three tables printed
subtractions with impossible signs. A row in another table had called the wrong
data structure "the engine" for eleven days — the number was right, the label
named a prior state, and nobody re-derives a table's row names. A census of the
damage counted 37 sites when there were 96, because the regex was shaped from the
first site its author read. A harness banked as "the failing gate" turned out to
hold one assertion across eight tests, the other seven printing a matrix and
comparing it to nothing. And when a floor run went red, the orchestrator piped it
through `tail -12` and destroyed the evidence — the one failure its own house
rules name by name. The pattern under all of it is not carelessness; it is that
**an instrument's errors are shaped like results**. A wrong count comes back as a
number. A hollow gate comes back green. A mislabelled arm comes back with a
correct figure beside a false name. None of them looks like an error, which is
why the work list's Class C does not ask for corrections — it declares that
**no recorded cost number in the arc can be trusted until the class closes.**

Working images (builder's call): *every plausible failure makes the measured arm
look better* · *the mean and the minimum, nine thousand lines apart* · *the label
follows the arithmetic*.

---

## The story beats, in order

All times are **author dates, −0700**, from `git log --date=format`.

### 1. 2026-08-30 14:37 — `99bf573df`: two wards disagree, and both are right

Cast `intueri` and `probare` at the session's own work, one ward per worker.

- **`probare` ACQUITTED the prose.** 5.89:1, 4.07:1, 4.23:1 code-to-comment, zero
  described or hollow forms across 5,536 lines. It got there properly — took 23
  falsifiable claims out of the docs and tried to break each; twenty held exactly.
  Its conclusion, verbatim from the body, is sharper than the argument it settled:
  > restatement never gets a number wrong, because restatement never commits to one.
- **`intueri` CONVICTED the self-description**, and every finding held against the
  disk. Six, verbatim from the body:
  - *"exactly one field is lossy … nothing else is lossy"* — **four** are dropped.
    Three are node ASTs `arm.rs` needs, so an imported network runs only because
    `import_export` interns a prebuilt arm. Put it through `build_rete_arm` and the
    alpha index comes back **empty, silently**. The header now records the
    consequence nothing had: **"AN IMPORTED NETWORK MAY BE FIRED, BUT NOT RE-ARMED
    FROM ITS OWN NODES."**
  - *"only these four `*_pass` are `#[cfg(test)]`"* — wrong in **both** directions,
    *"in the sentence written to stop a reader inventing a false rule."*
  - *"the forward reference is UNREPRESENTABLE"* — falsified **193 lines below
    itself**.
  - `unpack_rhs` *"yields a record with fewer ops"* — it **refuses**, fifteen lines down.
  - `FireCtx` *"eleven + two"* — fourteen fields. *"I challenged this, my extraction
    regex excluded digits and silently dropped `i64_by_fact`, and the ward was right."*
  - `kernel/tests.rs` *"their only caller"* — **a file the author had deleted himself,
    hours earlier**.
- The banner over all six: **"⛔ EVERY ONE IS A CLAIM ABOUT THE TREE'S OWN LAYOUT —
  trivially checkable, none checked."**
- **26 hollow tests converted** (probare's count; the orchestrator's own classifier
  said 10 — *"it could not parse compound or complex-expression liveness"*).
- **The generalisation, verbatim, and it is the unit's best line:**
  > ⛔ ON A COMPARISON BENCHMARK, EVERY PLAUSIBLE FAILURE MAKES THE MEASURED ARM LOOK
  > BETTER. A no-op `insert`, a lossy `production_to_pm`, a colliding `identity()`, a
  > degenerate `key_of`, a phase missing from a sum — each does LESS work and prints as
  > a SPEEDUP. `assert!(x > 0.0)` is not weak verification there, it is
  > ANTI-verification: it stamps a broken arm green while the number misreports what
  > happened.
- **Two gates, both mutation-proven both ways.** `no_stale_path_in_doc` found **six**
  stale references, **five of which four ward casts walked straight past** — including
  one the author created that morning by splitting `validate.rs`. The recorded rule:
  *"Wards find what needs judgment; gates find what needs looking."*
- **The floor went red and it was his own gate**, reported, captured whole, **not
  re-run**. One of the two violations was right for a reason the lint could not see:
  asserting that a comment still contains its own sentence is **self-certification** —
  *"this gate's own defect, reproduced inside it on day one. Deleted, not runed."*
- Closes with an enumeration: **six instrument errors in one day, every one returning
  a confident number rather than an error** — the doc-detector reading an attribute as
  absent documentation; `--exclude` matching nothing once its target became a
  directory; the classifier at 10 against 26; the `FireCtx` count; `40_000` reasoned
  where `120_200` was measured; and a classifier blind to assertions inside a helper,
  *"rewarding the duplication it exists to detect."*

### 2. 14:41 — `202b9031f`: the metrics are retired with reasons, and the instrument is named broken

`001` already spends the comment-density retirement and the nesting normalisation.
**What `001` does not take** is the rest of this commit:

- **"THE INSTRUMENT IS BROKEN."** Three independent census tests report subtractions
  with **impossible signs** — `A−M = −87.28 ms`, `H−M = −98.42 ms`, and **2 binds
  measured faster than 1 bind**. The isolated micro-bench runs ~6× *slower* than the
  full operation it decomposes, *"so every 'X−Y' row built on it is invalid in sign —
  and those rows print as findings."*
- **Deliberately NOT encoded as assertions**: *"freezing an impossible result makes a
  broken instrument permanent."*
- It names its own ancestry: this is `render_phase_table`'s own warning — *"two copies
  is how one of them silently stops subtracting"* — **one level up, in the subtraction
  itself**.
- The caveat on his own tool: the hollow-test classifier measures *"no assertion macro
  LEXICALLY INSIDE the test body"*, so five tests that assert through a shared helper
  **read as hollow while being fine**. *"The tool rewards the duplication it exists to
  detect."*
- And a diagnostic that read `"has 9 sites, not 9"` because `assert_eq!` interpolates
  the actual value into both slots — **"a diagnostic never seen fire is a diagnostic
  not tested."**

### 3. 15:14 — `89e8c3ed0`: one instrument, two estimators

The mechanism beat. `001` quotes the builder's challenge to this and the rule that
came out of it; it does not carry the measurement.

```
round 1   287.4 ms      round 2   11.5 ms      round 3   11.4 ms
```

25×, for identical work. Taking the **mean** carried that cold round into every
reported figure — *"so `M` was never slow — `M` GOES FIRST."* `H−M` read
**−93.33 ms**, i.e. arm H (arm M **plus** a HashMap entry) ran 9× *faster* than M.

> ⛔ AND THE CURE WAS ALREADY WRITTEN IN THIS FILE. `calibrate_mark_ns`: "TAKE THE
> MINIMUM OF SEVERAL BATCHES, not one … the true cost cannot be lower, and everything
> above it is interference." The calibration constant used the minimum. The 196 splits
> it feeds used the mean. ONE INSTRUMENT, TWO ESTIMATORS, and the wrong one on the
> larger measurement.

106 accumulators converted across three idioms, each needing its own read (90 direct,
16 struct-field where `shot(false)` always ran first and carried the identical
asymmetry, 2 that measured two binds faster than one). **Not converted:**
`fanout_cost`'s `tot_w += w`, which sums over **rows**, not rounds — *"a blanket
transform would have broken a correct aggregation."* 42 labels corrected — *"a table
that reports a minimum may not print 'mean of 3'."* 19 orphaned `let r = RUNS as f64;`
bindings **deleted, not `_`-prefixed**: *"`_` silences the gate that caught the
mistake."*

**Two things surfaced under the artefact, and neither is the same bug:**
1. **A resolution floor.** `H−M` now measures −0.48, +0.19, +0.24 across runs — *it
   changes sign*. **"sub-millisecond rows in these tables are noise wearing a number."**
2. **A mislabelled subtraction that was never a defect.** `H−V` stayed at −2.8..−3.4 ms:
   stable, so not noise. The arms are *alternative algorithms*, not superset and subset.
   **"THE NUMBER WAS ALWAYS RIGHT; THE LABEL WAS WRONG."**

### 4. 15:28 — `c898713de`: the sweep was correct by luck

`001` has the builder's *"why is the first round slow?... is this disingenuous?"* and
the durable rule. **It does not have the two measurements that earned it**, and they
are the substance:

1. **The cost is one-time, not per-round.** Running the same work once *untimed* before
   the first timed pass drops round 0 from **286.5 ms to 12.1 ms**. And it is **not
   capacity growth** — pre-reserving 300k pool entries changed nothing (298.7 ms).
2. **It does not transfer to production.** Over six rounds the isolated arm warms
   **2500%** (286.5 → 11.6 ms) while `alpha_activate_fact`, the production path *doing
   more work*, warms **20%** (16.4 → 13.7 ms).

Plus two refusals to overstate, both in the commit: **the exact first-execution cost
was never isolated** (clock ramp, first-touch page faults, lazy init all live
candidates, none eliminated), and the minimum *also* discards the production path's
genuine ~2.7 ms warm-up, which is a **choice**, stated as one.

### 5. 16:06 — `b7d9d8e90`: eleven days

> But the table labelled `S std HashMap` as "(engine)", and that is false.
> `DESIGN-STONE-alpha-class-lookup` shipped: `AlphaRoots` is a
> `Vec<(String, Arc<AlphaDiscNode>)>` and `root_for` is a `.find()`, so arm `L` IS the
> production path `candidates_into` takes on every fact. **The label was true the day
> the stone was DRAFTED and false the moment it SHIPPED**, because shipping it is what
> turned `roots` into a Vec. It then printed under a green test for eleven days.

And the class: *"Same class as this arc's `H−V` mislabelled subtraction and
`alloc_counter.rs`'s 'NOTHING READS THESE COUNTERS YET': a label naming a prior state.
**A benchmark row is the worst host for it — nobody re-derives a table's row names, and
the number beside it is right, which makes the row look checked.**"*

The fix splits by **what can rot**: the ordering goes in the test as ratios floored at
~60% of the tightest observed sample (*"absolute times moved 2.4x between a warm and
cold machine during this very session while the ratios moved under 2%"*); the
**structure** goes off the clock into `tests/lint` as an exact `assert_eq!` — *"a
structure swapped back to a map is a compile-time fact; it should not need a stopwatch
to notice."*

Closing beat, and it belongs in the post: an `assert_eq!(winner, "L")` **stood for
about a minute** before being struck, because `f >= 1.5 * l` implies `f > l`, which
*is* `winner == "L"` by definition. *"It would have read as the headline claim and
tested nothing — the precise defect the 26-test R59 sweep removed from this file,
re-minted while writing that sweep's last row."*

### 6. 20:59 — `2a7051c67`: and the gate written that morning was the wrong shape

Two ratio floors reddened the release floor. The arm survived this time:

```
S  std HashMap        4.49 ms
F  FxHashMap          2.54 ms
L  linear Vec         1.57 ms
panicked at accum_alpha_cost.rs:883 — `s >= 3.0 * l`, S/L = 2.86
```

Both ratios compressed because **L, the smallest arm, inflated 0.23 → 1.57 ms — 6× —
under a 5,173-test parallel runner.** *"A fixed additive term landing on all three arms
hurts the smallest most and drags every ratio toward 1."* In isolation the gate passes
8 for 8 with 70% headroom, *"which is exactly why it looked sound when I wrote it this
morning."*

**"THE DEFECT IS NOT THE THRESHOLD, so raising it would be patching the stem."** Two
facts settle it: the floors were measured over **six independent process runs** and
enforced over **three in-process samples** — different instruments, the enforcing one
weaker; and the gated arm is ~0.23 ms, where the file's own sibling note already
records that a sub-millisecond row is noise wearing a number. **"Gating a
sub-millisecond measurement on a shared parallel runner is a category error no sample
count fixes."**

And the honest closing: **"⚠ AND THE ENGINE DID NOT CHANGE."** The Vec was chosen
~2026-08-19. *"No path got faster or slower here — an over-claiming test stopped
claiming."*

### 7. 19:16 — `edd8f9807`: the evidence was destroyed by the hand that had read the rule

Out of chronological order above because it belongs beside the others thematically;
in the log it sits between two Class A strikes. Verbatim:

> ⛔ But the same run had one unrelated failure — `accum_alpha_class_lookup_split`, the
> ratio gate I added this morning — AND I DESTROYED ITS ARM by piping the run through
> `| tail -12`. 1,302 bytes survive. **That is the first failure `wat-rs/CLAUDE.md`
> names, committed by the hand that read that rule today.**

What was gathered afterwards, deliberately, *"since there was no evidence left to
preserve"*: 8 consecutive isolated runs, 8 PASS, F/L 2.56–2.84 against a 1.5 floor and
S/L 5.00–5.58 against 3.0. *"The failure appeared only under a 593-test parallel run
carrying extra per-arm instrumentation. **Contention is plausible and UNPROVEN.**"*
Recorded as a trap door so a later rider's red is not misattributed.

(The same commit's *first* half is the STOP-1 pass for the A1 wall — a temporary check
at `build_rete_arm` found **zero** violations of `child > parent` across 593 tests, so
*"the rule is the right rule"*, temp check reverted. `001` does not use it. It is a
clean small beat if the post wants one.)

### 8. 22:59 — `0192592cc`: a `println!` of a correct matrix

> Counted before drawing A3: **ONE real Rust assertion across EIGHT tests.** … The
> README said: "Appended now, it is a mutation proof that costs nothing to obtain: it
> reddens on the defect, and it must go green on the cure and on nothing else." **That
> is FALSE, and I wrote it confidently on the same day this arc removed 26 tests that
> asserted nothing.** A rider following it would have appended SEVEN hollow tests to the
> release floor.
>
> The `assertion-failed!` strings inside the embedded wat are what make a careless grep
> say otherwise — they are wat source, not Rust gates. …
>
> **A `println!` of a correct matrix looks exactly like a proof and is not one.**

The artifact is kept: it is the reconnaissance that drove **238 declared-surface cells**
and found both A3 and D5 (`36288679e` — `src/rete/reachability.rs` swept RETE_OPS in
**two** positions; `vocabulary.rs`'s own module doc declares **four**; experiri wrote
the missing two). Its value is *"the synthesis harness and the fixture shapes, not its
verdicts."*

### 9. 23:51 / 23:54 — `78c0435ab`, `e6858e858`: C1, and the third wrong instrument of the day

The population: **96 divides by `RUNS` across 7 files, against 35 `MINIMUM` headers**
(accum_cost 29, fanout_cost 28, rank_and_instrument 21, strat_cost 7, accum_alpha_cost
6, cascade_cost 4, harvest_cost 1). The row had said *"~18 accumulators in 8 files"*;
both halves were wrong.

> ⛔ A FIRST COUNT OF 37 IS KEPT IN THE ROW AS THE LESSON. The regex was
> `^\s*[a-z_]+ */= r;` — shaped from the first site I read (`fire /= r;`) — and it
> cannot see `let (a, b) = (a / r, b / r);`, which is how `harvest_cost` and
> `strat_cost` spell it. **It reported `rank_and_instrument.rs` as ZERO where the file
> has 21. `vocare` had named those exact sites during the cast and my own grep
> contradicted the ward. The ward was right.**
>
> Same class as `--exclude tests.rs` matching nothing and `doc-coverage.sh` counting
> 1,917 `cfg(test)` lines as production: **an instrument shaped by the first example it
> saw, reporting a subset as a total. Third instance on this arc — and this one was
> produced in the same message as a promise not to produce another wrong number.**

And the contract decision the strike turns on, verbatim from `e6858e858`:

> ★ ONE CONTRACT DECISION: **the LABEL follows the ARITHMETIC, never the reverse.** The
> cheap way to make the gate green is to change 35 headers from MINIMUM to MEAN —
> passing every test while performing the original defect in the opposite direction.

The gate that comes out of it **needs no stopwatch**: *"a test file printing a MINIMUM
header may not divide by RUNS"*, file-scoped deliberately **so a partial conversion is
unshippable** — *"a half-swept file is the defect itself."*

### 10. The banner the campaign earns — the work list's Class C header

`VIGILIA-2026-08-30-WORK-LIST.md` at the cutoff, verbatim:

> ## CLASS C — the instruments. **Blocks trusting ANY recorded cost number in this arc.**
>
> ⚠ **Two of these are my own, committed this morning and reported as finished.** Both
> have the same shape: **the commit message asserted a general fix while the diff
> performed a specific one.**

And `d024afb2e`'s body says the same about itself in plainer words: *"Naming a class in
prose is not pulling it. Until Class C closes, no cost number in this arc's record can
be trusted."*

---

## The other unspent rows, if the post wants a wider sweep

These are all at the cutoff version of the work list (340 lines,
`git show e6858e858:docs/arc/2026/06/278-rules-engine/VIGILIA-2026-08-30-WORK-LIST.md`),
and none is narrated in `001`. Use them as texture, not as sections.

- **B1** — `with-network` / `with-overlay` release the arm lease in a `do` **after** the
  body, *"so any raise skips it — and the ceiling-breach path raises INSIDE that body,
  so the leak is guaranteed exactly when memory pressure is highest."* And:
  **"`grep 'impl Drop' src/rete/` is empty."** Its doc claims parity with
  `with-open-file`; *"a `let`+`do` is not a scope guard."*
- **D3** — `CallUser` arity never checked; surplus arg written into an arbitrary slot,
  beyond `inner.len()` dropped silently. The file header says *"`lower` IS TOTAL OR IT
  REFUSES."*
- **D4** — `EXEC_SP` is inert: the `RefMut` spans `f`, so every nested frame takes the
  `Err` arm and `start` is always 0. **The doc holds BOTH claims** — `:96` *"nested
  calls stack"* (false) and `:99` *"the `Err` arm is a correctness path"* (true).
- **E1/E2** — `check_field_at`'s doc promises *"the span of the FIELD rather than the
  clause"*; both callers pass `clause.span()`. And `validate/mod.rs:1019`'s unknown-field
  arm is mis-documented **and unreachable** — *"Four `UnknownField` producers, one dead,
  and the dead one documents better behaviour than any live one."*
- **F1** — the five lints the cast earned, one of which is literally *"`MINIMUM of`
  header may not co-occur with `/= r`"*, and one of which is *"non-vacuity guards on
  walking gates — **10 of 15** lack one."*
- **The verification-status section**, which is the work list refusing to launder a
  ward's word into a fact: *"Every L1 above was weighed against the disk by the
  orchestrator, not credited to the report. … **Passed through on the ward's citation,
  not independently re-derived: the remainder. A row's evidence is its ward's report
  until someone re-reads it.**"*
- **`partire`'s two corrections to the arc's own record**: `arm.rs` is ~1,251 production
  lines, not the 593 the breadcrumb states — *"and that 593 was itself recorded as a
  **correction** of an earlier wrong figure."* (`001` uses the `reachability.rs` half of
  this pair; the `arm.rs` half is unspent.)

---

## Verbatim builder quotes, with locations

Method note: `git log --grep` on the message body (**not** `-S`, which pickaxes diff
content). Case-insensitive `builder` over the 214 in-window bodies returns **52** lines;
the dominant forms are `Builder: "…"`, `Builder's ruling: "…"`, `Builder ruling: "…"`.
Below are the ones inside this re-scoped unit's strand. **`001` already spends 2.1.**

**2.1 — the challenge that unmade the sweep.** `c898713de`, body ¶1 (and re-quoted at
`c26b730e0`). **ALREADY IN `001` — do not reuse as a headline.**

> "why is the first round slow?... is this disingenuous?"

**2.2 — the split that scattered rather than cured.** `d17d1fc23` (2026-08-30 04:25),
body ¶1:

> "this feels like we've got more work to do?"

The commit's answer, and it is the beat: *"yes, and this was it. The split SCATTERED
`complectens`' weave findings across nine files rather than curing them."* `time_ns`
carried **two contracts under one name** — 7 copies returning elapsed/n, 15 returning
elapsed — differing by a factor of n, 20k to 300k at the call sites. *"The arity told
you which, if you looked; **the PRINTED NUMBER did not**, so a reader comparing a figure
from one test against a figure from another had nothing to warn them."*

**2.3 — the file split.** `f98226353` (2026-08-30 03:59), body ¶1:

> "i dislike large files… each test is doing its own thing, yes?"

Answered *"measured, and yes"*, and the commit then **refutes the ward's own refusal
against the disk** — a nice small instance of the same class.

**2.4 — go measure.** `6fa13308e` (2026-08-29 00:41), body ¶1:

> "do your measurements - we do not know what we don't know.... so we go know."

The apparatus then disarmed the termination check behind a temporary env flag, drove
each shape to completion, and **removed the flag** — verified by re-running the refused
case with the flag still set and `grep -c` on the hook returning 0.

**2.5 — a table asserting a thing it had not established.** `692af57fd` (2026-08-29
00:47), body ¶1:

> Builder asked whether the measurement table asserts "we have code who is already
> correct and a thing called before that is flawed". It did assert that, and the
> assertion was WRONG. Measured rather than argued.

The measurement: the round cap catches a **linear** divergence in 0.35s with a located
diagnostic; on an **exponential** one it never fires and the process dies at
*"memory allocation of 56 bytes failed"* in 6.2s, **no wat diagnostic at all.**

**2.6 — the register, unpolished.** `2361bf8b3` (2026-08-26 18:38). **ALREADY IN `001`**
(quoted there in full). Noted here only so a writer does not re-spend it.

**Quote count for this unit: 5 usable builder quotes, of which 4 are unspent by `001`.**
All are questions or orders, none is an approval — which is itself the pattern `001`
already named; do not re-argue it, just let it hold.

---

## The substance test — run by me

Strip every hash, date, file path and line number. What is left that `git log` does not
hold?

**Holds up:**

1. **An instrument's failures are shaped like results.** A wrong count returns a number.
   A hollow gate returns green. A mislabelled arm returns a correct figure beside a false
   name. None of the three presents as an error, which is why they survive review and why
   the correct response is a moratorium (*"blocks trusting ANY recorded cost number"*)
   rather than a correction pass.
2. **On a comparison benchmark, every plausible failure makes the measured arm look
   better.** This is the strongest generalisable sentence in the week and it is not in
   `001`. A no-op insert, a lossy conversion, a colliding hash, a phase missing from a
   sum — each does less work and prints as a speedup, so a liveness assertion there is
   **anti-verification**: it stamps a broken arm green while the number misreports what
   happened. This carries to any A/B benchmark anywhere.
3. **A label names a state; the state moves and the label does not.** "(engine)" was true
   the day the design was drafted and false the moment it shipped, because shipping it is
   what changed the data structure. A benchmark row is the worst possible host, because
   *the number beside the label is right*, which makes the row look checked. Generalises
   past benchmarks to every `// NOTE:` that describes a prior world.
4. **Two estimators inside one instrument, and the wrong one on the larger
   measurement.** The calibration constant took a minimum and said in a comment why; the
   196 splits it fed took a mean. The distance between them was nine thousand lines, so
   nobody ever read them together. The general form is not "use the minimum" — it is that
   an instrument with two ways of reducing samples has a defect that no individual reading
   can reveal.
5. **A census is a claim about the shape of what you are counting, and the shape comes
   from the first example you looked at.** 37 against 96, because the regex was cut from
   the first site read and could not see the destructuring spelling. Three instances of
   this exact class in one arc, and the third arrived in the same message as a promise not
   to produce another wrong number.
6. **The label follows the arithmetic, never the reverse.** Stated as a contract decision
   because the cheap green was available and named: change 35 headers from MINIMUM to
   MEAN, pass every test, perform the original defect in the opposite direction. Naming
   the cheap green in the stone is what stops a rider taking it.
7. **A gate that measures time on a shared parallel runner is a category error no sample
   count fixes.** Measured over six isolated process runs, enforced over three in-process
   samples — *different instruments, the enforcing one weaker* — and the smallest arm
   inflated 6× under load, dragging every ratio toward 1. The cure is not a looser
   threshold; it is moving the claim off the clock, where a structural fact belongs.
8. **A `println!` of a correct matrix looks exactly like a proof.** And the strings that
   make a grep think otherwise were wat source, not Rust assertions.

**Does not hold up without the log** (evidence, not argument): the site counts (106, 96,
26, 42, 19), the floor numbers, the millisecond figures, the commit ordering.

**One thing I want to flag as a risk for the writer.** Items 1–3 above are close to
`001`'s "a metric with no committed instrument is unfalsifiable". They are *not* the same
claim — `001`'s is about **provenance** (you cannot re-derive it), this unit's is about
**shape** (its errors do not look like errors) — but a careless draft will collapse them.
Make the distinction explicit in the first two paragraphs or the post reads as a rerun.

---

## Explicit scope

**IN** (all author-date `[2026-08-24, 2026-08-31)`, `origin/grok-rete`):
- `99bf573df`, `202b9031f`, `89e8c3ed0`, `c898713de`, `b7d9d8e90`, `2a7051c67`,
  `6f14aa100` — the 30th's instrument campaign.
- `edd8f9807`, `0192592cc`, `36288679e`, `78c0435ab`, `e6858e858` — the audit's own
  instruments failing.
- `d17d1fc23`, `f98226353` — the naming/split beats, 04:00 on the 30th.
- Work-list **Classes B, C, D, E, F** and the **Verification status** section, as they
  stand at `e6858e858`.

**OUT:**
- **All of Class A.** `001` owns it — the table, the three doors, A1/A2/A2b/A4, the
  rhythm table, the graveyard gate. Reference in one sentence at most.
- The exemplar table, `doc-coverage.sh`, comment-density retirement, nesting
  normalisation, `c4647f89a`'s exemplar strike, the "verdict is NO" breadcrumb — **all in
  `001`.**
- The generative strand (`fuzz:`/`gen:`) — that is `004`.
- The bookkeeping audits (exemplar-hunt table, T7, inbound notes) — that is `003`.

**CUTOFF:** `e6858e858`, 2026-08-30 23:54:11 −0700. Class C's rows were **drawn** in
window and **closed** 2026-09-01 → 2026-09-04. If the post wants to say how it came out,
it must say that it is looking past the window and name the commits (`4bc04cff2`
*"Class C's original four are closed; C13 withdrawn"*, 2026-09-02 13:36). Do not imply
the class closed inside the week; it did not.

---

## Open questions and gaps

1. **I did not run the floor, the benchmarks, or any gate.** Every floor number
   (5046 → 5181), every millisecond, every site count here is **quoted from a commit
   body**. Given this unit's subject, the post should say so in as many words — quoting a
   number from the record of a week that proved its numbers wrong is a live hazard, and
   naming it is cheaper than pretending otherwise.
2. **`001` says "roughly ninety files" for `src/rete`; the disk says 56.** Grounded above.
   Someone should decide whether that is worth a correction on the shipped page.
3. **The "184 commits / +19,496 lines" register error** (§⚠ 3) is two commits wide. It is
   *checkable* and slightly delicious in this unit, but it is also the kind of thing that
   reads as gotcha if given more than a clause. Recommend: one parenthetical, or omit.
4. **The UTC/−0700 clock split** must be resolved before drafting, not during. See STOP-3.
5. **`b2939f12b`'s "families A and C"** is in window and `001` already quotes it once (for
   the Clara agreement). If this unit mentions defect families at all it must not use the
   letters without the word "families" attached — see the hazard table.
6. **I did not read the 19 ward reports**, because at the cutoff they do not exist as
   files. The work list's F3 points at them and `7ed71cf12` (2026-09-01) records that the
   referent does not exist. Everything I have about individual wards comes from the work
   list's `found by` column and the commit bodies.
7. **Slug.** `exemplar-002-the-lettered-audit` was the planner's; if the re-scope is
   taken, the slug should move with it. Title and song are the builder's.
