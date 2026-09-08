---
title: "A Wrong Number Is Not an Error"
description: "August 29–30: two days auditing the apparatus that measures a rules engine, and every strike lands on an instrument. A cost suite took the mean of three rounds where round one cost 287.4 ms and rounds two and three cost 11.5, so one arm read 93.33 ms faster than the arm it contains. A benchmark row called the wrong data structure the engine for eleven days under a green test. A census counted 37 where there were 96. A harness banked as the failing gate held one real assertion across eight tests. And a floor run went red into a `| tail -12`."
covers: 2026-08-29/2026-08-30
written: 2026-09-08
backfill: true
sidebar:
  order: 2
---

Backfill: this covers Saturday 2026-08-29 and Sunday 2026-08-30 on `grok-rete` and was written on 2026-09-08 from the commit bodies and from the vigilia work list as it stood at the cutoff commit, both still on disk. Nothing below was re-run. No floor, no fuzzer, no benchmark: every millisecond, every site count and every test total here is quoted from a commit body written by the same apparatus whose numbers are the subject. Dates are `git` author dates, −0700, a choice the record forces: the work list at the cutoff already writes 2026-08-31 three times for events `git` puts on the 30th. What follows is two days in which every strike landed on something that measures the engine rather than on the engine, and the last of them landed at 23:51.

The work list drawn on the evening of the 30th sorts its findings into lettered classes. Class C is aimed at the arc's own measuring apparatus, and its header is not a request for fixes:

> ## CLASS C — the instruments. **Blocks trusting ANY recorded cost number in this arc.**
>
> ⚠ **Two of these are my own, committed this morning and reported as finished.** Both have the same shape: **the commit message asserted a general fix while the diff performed a specific one.**

A moratorium is an unusual remedy for a measurement defect. The ordinary remedy is a correction pass — find the wrong figures, recompute them, move on. Why that does not work here is what the six days below establish.

This is a different property from a number nobody can re-derive. An unfalsifiable metric is one with no committed instrument behind it, and the cure is to commit the instrument. Every defect below had an instrument — committed, runnable, re-derivable by anyone — and every instrument returned. The failure is in the shape of the return value, not in its provenance.

What is being measured, for a reader meeting the suite cold: `src/rete` is `wat`'s rules engine, and seven files under it time the engine's phases and compare candidate data structures arm by arm. The method throughout is subtraction — time a phase, time that phase plus one more operation, subtract, and call the difference the operation's cost. Arms are single letters: `S` is a `std` HashMap, `F` an `FxHashMap`, `L` a linear `Vec`. Rows are differences: `H−M`, `A−M`, `H−V`. Everything that goes wrong over the two days goes wrong inside that arithmetic.

## August 29, 00:41 — "so we go know"

The register for both days is set by an order, `6fa13308e`:

> "do your measurements - we do not know what we don't know.... so we go know."

The apparatus disarmed the engine's termination check behind a temporary environment flag, drove each divergence shape to completion, and then removed the flag — and verified the removal rather than asserting it, by re-running the refused case with the flag still set and by `grep -c` on the hook returning 0. The instrument built to answer the question was dismantled under a check.

Six minutes later, `692af57fd` turns the same treatment on a table. The commit records the exchange in its own words:

> Builder asked whether the measurement table asserts "we have code who is already correct and a thing called before that is flawed". It did assert that, and the assertion was WRONG. Measured rather than argued.

The measurement: the round cap catches a **linear** divergence in 0.35s with a located diagnostic, and on an **exponential** one it never fires at all — the process dies at `memory allocation of 56 bytes failed` in 6.2s, with no `wat` diagnostic anywhere. A table had summarised the second case as the first. Two commits, six minutes apart, and both settle a claim about the tree by running something against it.

## August 30, 04:25 — two contracts under one name

Four hours into the 30th, `f98226353` answers a question about file size:

> "i dislike large files… each test is doing its own thing, yes?"

Answered *measured, and yes*, and the split shipped. Twenty-six minutes later `d17d1fc23` carries the follow-up:

> "this feels like we've got more work to do?"

The commit's answer is about its own previous move: "yes, and this was it. The split SCATTERED `complectens`' weave findings across nine files rather than curing them." What the scatter had been hiding is a naming defect with the class's exact shape. `time_ns` carried **two contracts under one identifier** — seven copies returning elapsed divided by `n`, fifteen returning elapsed — differing by a factor of `n`, which at the call sites ranges from 20k to 300k.

> The arity told you which, if you looked; **the PRINTED NUMBER did not**, so a reader comparing a figure from one test against a figure from another had nothing to warn them.

A per-iteration cost and a total, printed identically, five orders of magnitude apart. Nothing raises, nothing goes red, and the two figures compare cleanly against each other.

<!-- rune:consonare(solo) — from 14:37 onward the record carries no builder exchange, and this is measured rather than assumed: the reading pass over this window found five usable builder quotes, four of them unspent by `exemplar/001`, and all four are on this page in the two sections above. The stretch below is ward casts and sweeps the apparatus ran unsteered; the absence of a quoted collaborator here is the record's shape, not an erasure. Inventing an exchange to fill it would be the defect this post is about, committed in prose. -->

## 14:37 — one ward acquitted the prose, another convicted the self-description

`99bf573df` casts two wards at the same body of work, one per worker, and they disagree.

`probare` — the spell that asks whether a thing is a program or a description — **acquitted the prose**. Code-to-comment ratios of 5.89:1, 4.07:1 and 4.23:1, zero described-but-not-implemented forms and zero hollow forms across 5,536 lines. It reached that verdict by the right route: it extracted 23 falsifiable claims from the docs and attempted to break each one, and twenty held exactly. Its own conclusion names the ceiling on what that proves:

> restatement never gets a number wrong, because restatement never commits to one.

`intueri` — the spell that asks whether the code speaks — **convicted the self-description**, six findings, every one of which held when weighed against the disk:

- "exactly one field is lossy … nothing else is lossy" — four are dropped. Three of the four are node ASTs that `arm.rs` needs, so an imported network runs only because `import_export` interns a prebuilt arm; put it through `build_rete_arm` and the alpha index comes back **empty, silently**. The header now records the consequence it had never stated: "AN IMPORTED NETWORK MAY BE FIRED, BUT NOT RE-ARMED FROM ITS OWN NODES."
- "only these four `*_pass` are `#[cfg(test)]`" — wrong in both directions, "in the sentence written to stop a reader inventing a false rule."
- "the forward reference is UNREPRESENTABLE" — falsified 193 lines below itself.
- `unpack_rhs` "yields a record with fewer ops" — it refuses, fifteen lines down.
- `FireCtx` "eleven + two" — fourteen fields. The challenge to that finding failed on its own instrument: "I challenged this, my extraction regex excluded digits and silently dropped `i64_by_fact`, and the ward was right."
- `kernel/tests.rs` "their only caller" — a file the author had deleted himself, hours earlier.

The banner over all six:

> ⛔ EVERY ONE IS A CLAIM ABOUT THE TREE'S OWN LAYOUT — trivially checkable, none checked.

The same cast converted 26 hollow tests — probare's count. The orchestrator's own classifier had said 10, "it could not parse compound or complex-expression liveness," and it carries a second blind spot recorded in the next commit: it measures whether an assertion macro appears **lexically inside** the test body, so five tests that assert through a shared helper read as hollow while being fine. "The tool rewards the duplication it exists to detect."

Hollow tests are a general defect. In this particular file they are a directional one, and the commit states why:

> ⛔ ON A COMPARISON BENCHMARK, EVERY PLAUSIBLE FAILURE MAKES THE MEASURED ARM LOOK BETTER. A no-op `insert`, a lossy `production_to_pm`, a colliding `identity()`, a degenerate `key_of`, a phase missing from a sum — each does LESS work and prints as a SPEEDUP. `assert!(x > 0.0)` is not weak verification there, it is ANTI-verification: it stamps a broken arm green while the number misreports what happened.

Two gates shipped out of the cast, both mutation-proven in both directions. `no_stale_path_in_doc` found six stale references, five of which four separate ward casts had walked straight past — including one the author had created that morning by splitting `validate.rs`. The rule the commit writes down: "Wards find what needs judgment; gates find what needs looking."

Then the floor went red, on his own new gate, and the failure was reported, captured whole, and not re-run. One of the two violations turned out to be correct for a reason the lint could not see: the gate asserted that a comment still contains its own sentence, which is self-certification — "this gate's own defect, reproduced inside it on day one. Deleted, not runed."

## 14:41 to 15:28 — the mean and the minimum, nine thousand lines apart

Four minutes later, `202b9031f` states the condition plainly: **THE INSTRUMENT IS BROKEN.** Three independent census tests were reporting subtractions with impossible signs — `A−M = −87.28 ms`, `H−M = −98.42 ms`, and two binds measured faster than one bind. The isolated micro-bench runs about 6× slower than the full operation it decomposes, "so every 'X−Y' row built on it is invalid in sign — and those rows print as findings."

The impossible signs were deliberately not encoded as assertions: "freezing an impossible result makes a broken instrument permanent." The commit also names its own ancestry — `render_phase_table` already carried the warning that "two copies is how one of them silently stops subtracting," and this is that warning one level up, inside the subtraction itself. The same commit repairs a diagnostic that had been reading `"has 9 sites, not 9"`, because `assert_eq!` interpolates the actual value into both slots: a diagnostic never seen fire is a diagnostic not tested.

Thirty-three minutes later `89e8c3ed0` produces the cause, and it is one line of arithmetic:

```
round 1   287.4 ms      round 2   11.5 ms      round 3   11.4 ms
```

Identical work, 25× apart. Every cost split in the suite took the **mean of three rounds**, which carried the cold round into every reported figure — "so `M` was never slow — `M` GOES FIRST." That is what produced `H−M = −93.33 ms`: arm `H`, which is arm `M` **plus** a HashMap entry, reading 9× faster than the arm it contains.

> ⛔ AND THE CURE WAS ALREADY WRITTEN IN THIS FILE. `calibrate_mark_ns`: "TAKE THE MINIMUM OF SEVERAL BATCHES, not one … the true cost cannot be lower, and everything above it is interference." The calibration constant used the minimum. The 196 splits it feeds used the mean. ONE INSTRUMENT, TWO ESTIMATORS, and the wrong one on the larger measurement.

Nine thousand lines separated the two, which is why no single reading could reveal it. 106 accumulators were converted across three idioms, each needing its own read: 90 direct, 16 struct-field where `shot(false)` always ran first and carried the identical asymmetry, and 2 that had been measuring two binds faster than one. `fanout_cost`'s `tot_w += w` was deliberately **not** converted — it sums over rows rather than rounds, and a blanket transform would have broken a correct aggregation. 42 labels were corrected on the ground that a table reporting a minimum may not print "mean of 3", and 19 orphaned `let r = RUNS as f64;` bindings were deleted rather than underscore-prefixed: "`_` silences the gate that caught the mistake."

The 106-site sweep had assumed the cold round transfers, and `c898713de` at 15:28 goes back and earns the assumption with two measurements. First, the cost is one-time rather than per-round: running the same work once **untimed** before the first timed pass drops round 0 from 286.5 ms to 12.1 ms, and it is not capacity growth — pre-reserving 300k pool entries changed nothing at 298.7 ms. Second, it does not transfer to production: across six rounds the isolated arm warms **2500%** (286.5 → 11.6 ms) while `alpha_activate_fact`, the production path doing strictly more work, warms **20%** (16.4 → 13.7 ms). The commit refuses to overstate either result. The exact first-execution cost was never isolated — clock ramp, first-touch page faults and lazy init are all live candidates and none was eliminated — and taking the minimum also discards the production path's genuine ~2.7 ms warm-up, which is recorded as a choice rather than a wash.

Two things surfaced underneath the artefact, and they are not the same bug. `H−M` now measures −0.48, +0.19 and +0.24 across runs: it changes sign, so sub-millisecond rows in these tables are noise wearing a number. `H−V` stayed at −2.8 to −3.4 ms — stable, therefore not noise. The arms turned out to be alternative algorithms rather than superset and subset. **The number was always right; the label was wrong.**

## 16:06 — the label was true the day the design was drafted

`b7d9d8e90` takes that second finding and finds the same class in a row nobody had reason to doubt:

> But the table labelled `S std HashMap` as "(engine)", and that is false. `DESIGN-STONE-alpha-class-lookup` shipped: `AlphaRoots` is a `Vec<(String, Arc<AlphaDiscNode>)>` and `root_for` is a `.find()`, so arm `L` IS the production path `candidates_into` takes on every fact. **The label was true the day the stone was DRAFTED and false the moment it SHIPPED**, because shipping it is what turned `roots` into a Vec. It then printed under a green test for eleven days.

The commit files it beside `H−V` and beside `alloc_counter.rs`'s "NOTHING READS THESE COUNTERS YET" as one class — a label naming a prior state — and then names why a benchmark row is the worst available host for one: "nobody re-derives a table's row names, and the number beside it is right, which makes the row look checked."

The repair splits the claim by what can rot. Ordering goes into the test as **ratios** floored at roughly 60% of the tightest observed sample, on the evidence that absolute times moved 2.4× between a warm and a cold machine during that same session while the ratios moved under 2%. **Structure** comes off the clock entirely and into `tests/lint` as an exact `assert_eq!`: "a structure swapped back to a map is a compile-time fact; it should not need a stopwatch to notice."

One assertion in that repair stood for about a minute before being struck. `assert_eq!(winner, "L")` is implied by the ratio floor already asserted above it — `f >= 1.5 * l` implies `f > l`, which is `winner == "L"` by definition — so it "would have read as the headline claim and tested nothing." The commit records where it came from: it is the precise defect the 26-test sweep had just removed from this file, re-minted while writing that sweep's last row.

## 19:16 and 20:59 — the gate reddened, and the evidence did not survive

The ratio gate added that morning went red the same evening, inside a run that was doing something else. `edd8f9807`:

> ⛔ But the same run had one unrelated failure — `accum_alpha_class_lookup_split`, the ratio gate I added this morning — AND I DESTROYED ITS ARM by piping the run through `| tail -12`. 1,302 bytes survive. **That is the first failure `wat-rs/CLAUDE.md` names, committed by the hand that read that rule today.**

What was gathered afterwards was gathered deliberately, on the stated ground that there was no evidence left to preserve: eight consecutive isolated runs, eight passes, `F/L` between 2.56 and 2.84 against a 1.5 floor and `S/L` between 5.00 and 5.58 against a 3.0 floor. The failure had appeared only under a 593-test parallel run carrying extra per-arm instrumentation, and the commit refuses to close on the obvious story — "Contention is plausible and UNPROVEN" — recording it as a trap door so a later rider's red is not misattributed to the wrong cause.

At 20:59 the gate reddened again, and this time the arm survived. `2a7051c67`:

```
S  std HashMap        4.49 ms
F  FxHashMap          2.54 ms
L  linear Vec         1.57 ms
panicked at accum_alpha_cost.rs:883 — `s >= 3.0 * l`, S/L = 2.86
```

Both ratios had compressed because `L`, the smallest arm, inflated from 0.23 ms to 1.57 ms — 6× — under a 5,173-test parallel runner. "A fixed additive term landing on all three arms hurts the smallest most and drags every ratio toward 1." In isolation the gate passes eight for eight with 70% headroom, "which is exactly why it looked sound when I wrote it this morning."

The disposition: **THE DEFECT IS NOT THE THRESHOLD, so raising it would be patching the stem.** Two facts settle it. The floors were measured over six independent process runs and enforced over three in-process samples — different instruments, with the enforcing one weaker. And the gated arm sits at about 0.23 ms, where the file's own sibling note already records that a sub-millisecond row is noise wearing a number. "Gating a sub-millisecond measurement on a shared parallel runner is a category error no sample count fixes."

The commit closes on its own scope: **AND THE ENGINE DID NOT CHANGE.** The `Vec` had been chosen around 2026-08-19. "No path got faster or slower here — an over-claiming test stopped claiming."

## 22:59 — one real assertion across eight tests

`0192592cc` counts a harness that had been banked as the arc's failing gate, before a work-list row could be drawn on top of it:

> Counted before drawing A3: **ONE real Rust assertion across EIGHT tests.** … The README said: "Appended now, it is a mutation proof that costs nothing to obtain: it reddens on the defect, and it must go green on the cure and on nothing else." **That is FALSE, and I wrote it confidently on the same day this arc removed 26 tests that asserted nothing.** A rider following it would have appended SEVEN hollow tests to the release floor.
>
> The `assertion-failed!` strings inside the embedded wat are what make a careless grep say otherwise — they are wat source, not Rust gates. …
>
> **A `println!` of a correct matrix looks exactly like a proof and is not one.**

The harness was kept rather than deleted, on a stated distinction: its value is "the synthesis harness and the fixture shapes, not its verdicts." As reconnaissance it had driven 238 declared-surface cells and surfaced two live work-list rows, one of them `36288679e` — `src/rete/reachability.rs` sweeping `RETE_OPS` in two positions where `vocabulary.rs`'s own module doc declares four, with `experiri` writing the missing two. A `println!` of a correct matrix looks exactly like a proof, which is why the harness kept its fixtures and lost its verdicts.

## 23:51 — thirty-seven where there were ninety-six

The last strike of the window is a census of the damage, and the census went wrong first. `78c0435ab` establishes the real population: **96 divides by `RUNS` across 7 files**, against 35 `MINIMUM` headers — `accum_cost` 29, `fanout_cost` 28, `rank_and_instrument` 21, `strat_cost` 7, `accum_alpha_cost` 6, `cascade_cost` 4, `harvest_cost` 1. The work-list row had said "~18 accumulators in 8 files." Both halves were wrong, and so was the first correction:

> ⛔ A FIRST COUNT OF 37 IS KEPT IN THE ROW AS THE LESSON. The regex was `^\s*[a-z_]+ */= r;` — shaped from the first site I read (`fire /= r;`) — and it cannot see `let (a, b) = (a / r, b / r);`, which is how `harvest_cost` and `strat_cost` spell it. **It reported `rank_and_instrument.rs` as ZERO where the file has 21. `vocare` had named those exact sites during the cast and my own grep contradicted the ward. The ward was right.**

The commit files it with two siblings from the same week — an `--exclude` that matched nothing once its target became a directory, and a doc-coverage script counting 1,917 `cfg(test)` lines as production — under one description: an instrument shaped by the first example it saw, reporting a subset as a total. It is the third instance on the arc, "and this one was produced in the same message as a promise not to produce another wrong number."

Three minutes later, at the cutoff commit `e6858e858`, the strike turns on a contract decision that names the cheap way out before anyone can take it:

> ★ ONE CONTRACT DECISION: **the LABEL follows the ARITHMETIC, never the reverse.** The cheap way to make the gate green is to change 35 headers from MINIMUM to MEAN — passing every test while performing the original defect in the opposite direction.

The gate that comes out of it needs no stopwatch at all: a test file printing a `MINIMUM` header may not divide by `RUNS`. It is file-scoped deliberately, so that a partial conversion is unshippable — a half-swept file is the defect itself.

## The class does not ask for a correction pass

The work list's own framing of what it had just drawn, from `d024afb2e`: "Naming a class in prose is not pulling it. Until Class C closes, no cost number in this arc's record can be trusted."

The list applies the same standard to itself. Its verification-status section refuses to launder a ward's word into a fact — every finding in the top severity band was weighed against the disk by the orchestrator rather than credited to the report that raised it, and the remainder is marked as what it is: "Passed through on the ward's citation, not independently re-derived: the remainder. A row's evidence is its ward's report until someone re-reads it."

Class C's rows were drawn inside the window and closed outside it, between 2026-09-01 and 2026-09-04 — `4bc04cff2`, "Class C's original four are closed; C13 withdrawn," lands 2026-09-02 13:36, which is past this post's cutoff and quoted here as a pointer rather than a result.

What the substrate carries out of those two days is not a faster rules engine, and not a corrected table. It is a measuring apparatus whose readings are suspended by name, for a stated class, until each one is re-derived. That is the operation the class shape forces. A correction pass sorts a population by which members look wrong, and the whole point of these six is that none of them does: the count returned a number, the gate returned green, the row returned a correct figure under a false name, and the estimator returned a subtraction that ran the wrong way. Sorting by appearance re-certifies the lot. The only move that discriminates is refusing to spend any of it.

## Likely Contributions to the Field

- **On a comparison benchmark, every plausible failure makes the measured arm look better.** A no-op insert, a lossy conversion, a colliding hash, a degenerate key, a phase missing from a sum — each does less work and prints as a speedup. `assert!(x > 0.0)` is therefore not weak verification in that setting but anti-verification: it stamps a broken arm green while the number misreports what happened. This carries to any A/B benchmark in any language.
- **An instrument's failures are shaped like results, which is why a class of them gets a moratorium rather than a correction pass.** When a defect class returns plausible values rather than errors, the remedy that matches its shape is suspending the whole class by name until each member is re-derived — sorting by which members look wrong re-certifies the ones that lie best. This is a distinct property from a metric with no committed instrument: these all had instruments, and the instruments all returned. The remedy that matches the shape is suspending the whole class until each member is re-derived.
- **An instrument with two ways of reducing samples has a defect no single reading can reveal.** The calibration constant took the minimum and said in a comment why; the 196 splits it fed took the mean, nine thousand lines away, so nobody ever read them together. The general form is not "use the minimum" — it is that a reduction policy is part of an instrument's contract and has to be stated once, at one place, for the whole instrument.
- **A label names a state, and a benchmark row is the worst available host for one.** "(engine)" was true the day the design was drafted and false the moment it shipped, because shipping it is what changed the data structure — and it then printed under a green test for eleven days. Nobody re-derives a table's row names, and the number beside the label is right, which is what makes the row look checked. The repair splits the claim by what can rot: ratios stay on the clock, structural facts move off it into a compile-time assertion.
- **A census is a claim about the shape of what you are counting, and the shape comes from the first example you read.** A regex cut from one call site reported 37 against a true 96, and reported one file as zero where it held 21 — a file a ward had already named correctly during the cast. Where a count and an auditor disagree, the count is the thing that was built from a sample of one.
- **The label follows the arithmetic, never the reverse.** With a gate demanding that a file printing a `MINIMUM` header not divide by `RUNS`, the cheap green was to rewrite 35 headers to `MEAN` — passing every test while performing the original defect backwards. Naming the cheap green inside the stone, and scoping the gate per file so a half-swept file is unshippable, is what keeps a later hand from taking it.
