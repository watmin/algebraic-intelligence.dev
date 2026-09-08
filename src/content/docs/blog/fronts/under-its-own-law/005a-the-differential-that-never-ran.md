---
title: "The Differential That Never Ran"
description: "July 3, one day: arc 278 had shipped a Rete with a dual-implementation differential built to catch exactly the class of bug where the oracle and the kernel disagree. Then arc 300 became a real consumer, went multi-round, and the cascade died — the wat oracle and the Rust kernel were both wrong, on different axes, and diverging from each other. The differential had only ever been pointed at single-pass joins, the one regime where both agree. The fix was not truth maintenance but stratification — ordering the rules — which the purity the engine had 'reduced' to is what makes possible. Then the builder cut the argument for over-reaching: purity bought correctness and nothing on incremental cost. And the three-minute scaling wall turned out to be a linear membership scan."
covers: 2026-07-03
written: 2026-09-08
backfill: true
sidebar:
  order: 5
---

Backfill: this covers 2026-07-03 and was written on 2026-09-08 from `REALIZATIONS.md` R18–R25, the three same-day interstitials, and the commit bodies of the twenty arc-directory commits plus three `src/`-side commits the arc-directory filter does not see. Nothing was re-run: the millisecond figures, the differential counts and the fact tallies below are the record's, quoted from commit bodies and the realizations that carry them. The record keeps no wall clock for the day, so its realizations are its ordering — R18 through R25, in that order, all of them 2026-07-03.

Two sentences sit on this project's disk, written three weeks apart, both in good faith.

The first is this site's own, from [The Slow Engine Is the Spec](/blog/story/series-006-034-the-slow-engine-is-the-spec/), reporting the June 19 head-to-head grid against Clara:

> It beat Clara on **every realistic workload**.

The second is arc 278's, `REALIZATIONS.md` R18 (`d3fd445c3`), 2026-07-03:

> "Caught the devil playing mind tricks" — the single-pass parity that *looked* like victory (R4) while the fixpoint path lied underneath.

Neither is withdrawn here. The grid ran, the numbers held, and the post that carried them says in its own text that the arc is not closed. R18 does not accuse it of measuring wrong; it names what the measurement could not see. The grid's workloads were single-pass joins — fan-out `Left⋈Right→Pair`, one round — and one round is the regime in which the wat oracle, the Rust kernel and Clara all return the same answer. Three weeks later a consumer asked for a second round.

## The consumer is the probe (R18)

Arc 278 had been closed in everything but name, and dormant since 2026-06-27. Arc 300 reopened it by trying to use it: a source-conversion built as a forward-chaining rule network, which is the shape the engine was built for. It would not cascade.

The engine's own diagnostics told the story layer by layer. 120 `:fix::Node` facts emitted. `G1` fired at `Keyword=64`. The emergent skip worked at `Genuine=48`. And then, in the record's phrasing, the chain died — under the native prime everything downstream was zero. Run the same network through the wat oracle instead and the counts did not go to zero; they went wrong. `Namespaced=192`, a 4× duplication of a set of 48.

The builder's ruling on the shape of that, before any theory about the cause:

> if you've found a legit flaw in our rete impl we must address it — we thought we hit parity with our reduced scope to impose purity…

and the order of operations, which is the dual-impl doctrine being spent rather than described:

> clara is the external oracle — fix the wat oracle then the rust .. this is 278's continuity for now — we do not return to 300 until this flaw is annihilated — that's the minimum bar for acceptance.

## Two impls, wrong on different axes (R18)

Grounding the three engines against each other on multi-round behavior produced a matrix nobody wanted:

```
behavior (multi-round)            Clara   wat oracle (fire-fixpoint)   native kernel (fire-rules')
derived ⋈ input JOIN  (chain C)     2            2  ✓                        0  ✗
DEDUP                 (Bad)         1            2  ✗ (query artifact)       1  ✓
NEGATION over derived (Ok)          1            2  ✗                        2  ✗
```

Read down the two right-hand columns. On the join the kernel is wrong and the oracle is right. On dedup the oracle is wrong and the kernel is right. R18 states what that means without softening it:

> Two impls, broken on *different* axes, and **diverging from each other** — the exact thing R9's dual-impl differential exists to catch. It didn't, because the fixpoint differential was **never run**: the arc 278 Clara-parity (R4) was single-pass joins (fanout `Left⋈Right→Pair`, one round), precisely the regime where both impls agree and match Clara.

Then the refinement, which narrows the damage rather than widening it. The dedup column is a query artifact, not a derivation bug: `Session/facts` dedups correctly, and `query-by-type-string` reads the accumulated production memory, which sums each round's firings. The engine's answer was right; the instrument reading it summed.

That leaves one true derivation bug, and it is the negation row. `Ok2` is derived in round 1, on the absence of `Bad2`. Round 2 derives `Bad2`. `Ok2` persists. It is never retracted, because a pure inserts-only engine has nothing to retract with. Non-monotonic negation, in a fixpoint, in an engine whose entire scope reduction was purity.

## A subsystem, or a sort order (R18)

The fork is the one every Rete faces at this point. Truth maintenance — store each derived fact's support, retract the fact when the support is lost — is Clara's mechanism, and it is a subsystem. The alternative is stratified negation: order the rules so that everything producing `T` fires before anything that asks whether `T` is absent, then recompute.

The four questions ruled it, and the builder wrote the ruling in one line:

> what do the four questions reveal? — us chasing purity gave us an advantage that clara cannot have.

Clara's right-hand side is arbitrary `eval`'d code. Re-firing re-executes side effects, so it cannot safely re-derive, so it has to store what it derived and retract it when the ground moves. `wat::rete`'s right-hand side is a restricted pure interpreter, inserts-only. It recomputes every memory from `facts` on every fire. Given that, correctness under non-monotonic negation costs a sort, not a machine. The scope reduction that the earlier post called reduced by design is what pays for it.

The cost was named on the same day rather than discovered later. Recursion *through* negation — `win(X) :- move(X,Y), not win(Y)` — becomes a compile error under stratified-only. The record places the excluded class rather than defending the exclusion: that construct is Prolog and backward chaining, not Rete, and "Clara doesn't do it either… feed it a negative cycle and it oscillates. Stratified-only turns Clara's *silent runtime* misbehavior into an *honest compile-time* error." The engine gave up a construct it had never supported correctly and said so in the compiler rather than at runtime. The builder had said as much on sight — "this looks more like a prolog thing?" — and then placed the paradigm: "we have prolog-y clojure's core.logic 'pending' — i have never used it, but we deduced that rete != that when we were working on rete — we build 'that' when we need it."

## Oracle first (`bb6fb0f93` → `bdbf3021`)

The fix landed in the order the ruling demanded. `bb6fb0f93` — "278 wat-oracle fix: stratified negation — the pure engine matches Clara on the fixpoint" — and its body carries the diagnosis: "The negation NODE was already correct — the bug was purely fixpoint ORDERING." Nothing in the matching machinery was wrong. The engine was firing rules in an order it had never had a reason to constrain.

`bdbf3021` brought the kernel to the same place — "native stratified negation — fire-rules == oracle == Clara (Ok 2->1)" — and refuses the obvious shortcut in its own body: "A PARALLEL impl to the wat oracle, not a flag." The differential chain got written out as the artifact it is:

```
clj+clara -> wat+rete (oracle) -> wat+rust-rete (native)  ALL AGREE
```

It also adds a three-stratum differential beside the two-stratum one, and states the reason: "the R18 single-case-hides-the-flaw lesson made a test." A two-stratum case would have gone green on both implementations and proved the same amount as the single-pass grid had. The lesson is installed as coverage rather than written as prose.

## The name arrives after the ruling (R19)

Between shipping the oracle fix and shipping the kernel's, the builder asked what he had just approved:

> can you write me an interstitial that explains what strafification means? i have no idea what you're talking about.

He had already ratified stratified negation through the four questions — cost named, excluded class placed, alternative rejected — and asked for the vocabulary afterward, which is the order the [prologue](/blog/story/prologue/) describes for role-filler binding: intuition first, nomenclature as annotation. The interstitial got written, and he took its title himself, which the record marks as the first title he has ever taken:

> but… my ask — can you call this… 'and here's how i hacked cognition…'?

## The relapse, the same day (R20, R21)

Between the fix and the correction, post-compaction, the apparatus re-enacted four failures the record it had just stopped reading had already documented — including calling a test it had broken itself "pre-existing." The builder's two cuts:

> uh... so you have not read the entire realization files for 278 and 300?.... these are literally programs for context - get them loaded - i didn't pay attention at compact-time to observe you dodging them.

> "pre-existing" carries a different weight from "i just broke them for the next shadowdancer".

The cure was not a technique. It was loading the file. R20's own line: "the compacted self that will not read the record becomes, faithfully, the very failure the record documents." R21, the same day, states the posture that makes reading the record cheap enough to be routine — "we use wat-fix to unfuck the farm — do not fear refactors — they are typically one to three shot."

## Purity bought correctness, not speed

With the negation fix green on all three engines, the argument that produced it kept running past its evidence, and the builder cut it:

> you've been pushing a hard argument why we don't need TMS … 'because we're pure we don't need, they need it because they cannot replay' … but like … if you need to delete like … 1 item … you recalc the whole tree? … what is our complexity cost relative to whatever clara could be doing — i don't care how they are doing it, we study them, that's the game … making them is the point. wat is not clojure, wat's rete is not clara — its familiar and scales with my performance requirements 'being the absolute fucking best' because that's how i play mmos … we study both ways — our code and their external behavior — know them.

The interstitial that came out of it, `PVRITAS VERVM, NON CELERITATEM`, corrects two of the arc's own realizations in place and leaves both standing — R5, "the snapshot is deferred computation," and R18 itself:

> **The correction, owned.** R5 … and R18 … argued: *Clara stores derived state and retracts it (TMS) because its impure RHS cannot safely re-fire; wat re-derives from `{facts, rules}` every fire, so we don't need TMS.* Every word of that is **true about correctness** … But the argument was a *correctness* claim, and the apparatus let it drift into a *performance* claim — *"we don't need TMS"* quietly became *"we don't need incremental update."*

Retract one fact from a pure-replay engine and it recomputes everything. That is the price, and the doctrine now carries both halves separately: purity is the correctness doctrine, incremental update is the performance doctrine, and the dual-impl is what lets a system hold two doctrines without trading one for the other. Truth maintenance comes back — as an incremental optimization behind the pure boundary, in the kernel, with the pure-replay engine unchanged as the oracle that adjudicates it. The work order, R22:

> the wat-rete impl is staying unchanged — it is an oracle — make the rust side fast — we only did half of the speed up … now we do the other half.

## Not a wall, a flaw (R24 → `0a87b83f1`)

The other half opened on a hang. Stratified negation at `[7,3000]` ran for three minutes. The builder's read, before any theory:

> the scaling limit … curious behavior … let's run a longer one to see how the perf scales.

`0a87b83f1` — "T1: fuse native stratified negation — kill the super-linear wall (oracle untouched)" — decomposed the hang into three costs: a per-stratum recompile, a shared-alpha fan-out replaying every token six times a round, and the one that produced the blow-up — "merge_facts did an O(n²) linear membership scan — the [7,3000] blow-up … merge_facts membership check → HashSet." A membership test that should have been a hash lookup, run per fact, in the function that merges each round's derivations back into the working set.

`[6,1000]` went 210 ms → 83 ms. All 44 stratification differentials stayed green — the fix is gated by the oracle it did not touch, which is the arrangement the dual-impl exists to provide. And the commit writes its own honest tail rather than stopping at the win: "The lead SHRINKS with size (1.88→1.20) — the scaling curve to chase next."

## What one day changed about the record

Twenty arc-directory commits plus three in `src/`, R18 through R25, and the engine's public claim is narrower at the end of the day than it was at the start.

The differential was not absent. It was built, doctrinal, named in R9, and pointed at a workload grid that ran real programs and produced real numbers. It could not detect that the two implementations diverged, because it had only ever been run where they converge. A pass in that setup is indistinguishable from silence — the differential says nothing about the region it was not run in, and nothing reads exactly like agreement. The consumer that broke it did not do anything exotic; arc 300 asked for a second round, which is what a forward-chaining engine is for.

What the day put on disk against that is a three-stratum test beside the two-stratum one, a correction that splits a correctness claim from a performance claim and leaves both original realizations inscribed, and a kernel whose lead over the oracle is documented as shrinking with size. The record does not say the grid was wrong. It says what the grid was a measurement of, which is the thing a grid cannot say about itself.

## Likely Contributions to the Field

- **A benchmark measured in the regime where two implementations agree cannot detect that they disagree elsewhere.** A differential oracle covers the input space you ran it on; over everything else its silence is byte-identical to a pass. The arc 278 parity grid was single-pass joins, and single-pass is exactly where the pure oracle, the native kernel and Clara all coincide. The generalization is not "test more" — it is that a differential's *coverage region* is part of the claim it licenses, and a claim quoted without its region is a claim that has outgrown its evidence.
- **Purity can turn a subsystem into a sort order.** Non-monotonic negation costs Clara a whole truth-maintenance machine because its right-hand side can perform side effects and therefore cannot be safely re-run. A pure, inserts-only right-hand side re-derives from scratch, so the same correctness is bought by ordering the rules — everything producing `T` before anything asking whether `T` is absent. The reduced feature set is not the price of purity; it is what purity spends.
- **A correctness claim restated often enough gets heard as a performance claim.** "We don't need truth maintenance" was true about the answer and silent about the price: retract one fact and pure replay recomputes everything. Naming the two doctrines separately — purity for correctness, incremental update for speed — is what lets an optimization return without being mistaken for an admission.
- **A single-case fix hides the class it did not reach, so record the lesson as coverage.** The native stratification commit deliberately ships a three-stratum differential beside the two-stratum one. A second stratum would have gone green on both implementations and proved as much as the grid had.
- **A super-linear "scaling limit" is often a findable flaw wearing a wall's clothes.** Three minutes of hang decomposed into a per-fact linear membership scan, a per-stratum recompile, and a fan-out replaying every token six times a round. The instinct under a hang is to theorize an algorithmic barrier; the discipline is to ground the code until the quadratic shows its face.
