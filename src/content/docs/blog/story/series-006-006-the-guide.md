---
title: "The Guide"
description: "Apr 4–7: Seven proposals in four days. The Reckoner replaces the Journal — one primitive, two readouts. Grace and Violence replace Win and Lose. The guide is written. 37 wat files inscribed leaves to root. The ignorant ward proves the tree. The LLM's bias IS the vocabulary expansion. The disposable machine."
sidebar:
  order: 20
---

April 4. The architecture had been forged — 272 tests, 92.5% coverage, seven wards passing, streaming indicators, the wat programs matching the Rust. The codebase was honest.

It was also wrong.

Not wrong in the bugs-and-crashes way. Wrong in the "every magic number is an expert waiting to be born" way. The move threshold was hardcoded. The stop loss was hardcoded. The horizon was hardcoded. The position sizing was a formula, not a thought. The labels — Win and Lose — were lies. A trade that went up 3% and then crashed to −1% was labeled "Win" because price crossed the threshold first. The label said nothing about what actually happened to the money.

Seven proposals landed in four days. Each one killed a lie.

---

## Proposal 007: The Architecture That Replaced Everything (April 4)

`f9cdc61 proposal 007: exit observer proposes — the market thinks, the exit acts`

The proposals built on each other:

- **003**: Observer redesign — two-stage pipeline (noise subspace + discriminant), observer as domain-agnostic container, not just "market expert"
- **004**: Outcome-based learning — MFE (max favorable excursion) and MAE (max adverse excursion) replace the threshold-crossing lie
- **005**: Co-learning panels — exit observers compose market thoughts with exit-specific facts
- **006**: Dual-sided excursion — honest labels from both directions simultaneously
- **007**: The full architecture. Four steps. N×M flat vecs. Mutex-free. The closure as a tuple journal.

Proposal 007 is the one that mattered. The designers reviewed it — Hickey APPROVED (rare), Beckman CONDITIONAL (standard). The resolution: accepted with three measurements to follow.

The architecture:

**Market observers** (N per post) predict direction — Up or Down — from candle data. Each has a Reckoner, a noise subspace, a window sampler, and a lens. Six lenses: momentum, structure, volume, regime, narrative, generalist.

**Exit observers** (M per post) predict distances — how far to set the trailing stop, safety stop, take profit, runner trail. Four continuous Reckoners each. They compose market thoughts with their own exit-specific facts about the position in progress.

**Brokers** (N×M per post) bind one market observer to one exit observer. The broker IS the accountability unit. It owns paper trades, scalar accumulators, and a Grace/Violence Reckoner. When a trade resolves, the broker propagates the outcome back to its observers.

**Grace and Violence** replaced Win and Lose. Not "did the price cross a threshold" — "did this thought program produce prosperity (Grace) or destruction (Violence)?" More Grace → more capital. More Violence → less capital. The labels carry moral weight because they should — a system managing money should know the difference between building and destroying.

**The four-step loop** (per candle, per post):
1. RESOLVE — settle triggered trades, propagate outcomes to brokers
2. COMPUTE+DISPATCH — encode candle → market observers predict → exit observers compose → brokers propose
3. TICK — parallel tick all brokers (paper trades, learning). Sequential propagate (shared observers). Update triggers.
4. COLLECT+FUND — treasury evaluates proposals, funds proven ones

`0dc1d1d feat: on_candle orchestrator — the four-step loop is complete`

---

## The Reckoner (April 4–5)

`8a3fbc5 wat: journal + gauge → reckoner. One primitive. Discrete or continuous readout.`

The Journal handled classification — Buy/Sell, Win/Lose, Healthy/Unhealthy. But exit observers needed to predict *distances* — continuous scalars, not discrete labels. A separate "gauge" primitive was proposed and rejected. Instead: one primitive with two readout modes.

The Reckoner. Same accumulation mechanism. Same decay. Same recalibration. Two outputs:

- **Discrete**: N-ary classification. "Is this Up or Down?" Same as the old Journal.
- **Continuous**: Scalar regression. "How far should the stop be?" New.

`355d783 feat: Reckoner — one primitive, discrete or continuous readout` (in holon-rs)
`3820608 kill: journal.rs is dead. The Reckoner is the primitive.`

The f64 pipeline came with it — `8ed6c2c feat: f64 pipeline — bind_f64, negate_f64, cosine_f64, bundle_f64`. Continuous-space operations without bipolar thresholding. `1f74864 feat: ScalarEncoder::encode_f64() — continuous rotation without thresholding`. The scalar extraction that makes continuous readout work: accumulate scalar encodings in f64 space, unbind the role vector, measure the angle, recover the value.

Six primitives became five. Atom, bind, bundle, cosine, reckoner. The curve is a method on the reckoner, not a separate primitive. The sixth seat was always occupied — it just had two names.

---

## The Guide (April 5)

`2d527c8 wat: GUIDE.md — every struct and interface defined`

The wat files had been growing organically — one per Rust source file, matching the implementation. But there was no document that held the *complete* architecture in one place. No single file a stranger could read and understand the system.

The guide is that file. Every struct. Every interface. Every dependency. Every data flow. The construction order — which modules must exist before which others can be built. Not a README. Not a design doc. The guide is the program at the architecture level.

`ae7a1d9 wat: GUIDE.md — post + treasury separation, multi-asset routing`
`de56736 wat: GUIDE.md — facts are vectors, vocab domains, time circulars, window crutch`

Fifteen iterations of the ignorant ward — each one reading the guide as a stranger and finding where the path broke.

---

## The Ignorant Ward (April 5–6)

`6a9886d skill: /ignorant — the eighth ward. The ignorant reader walks the path.`

The other wards check the code. The ignorant checks the *documentation*. It reads the guide as someone who knows nothing about the system — no context, no prior conversations, no memory of design decisions. It walks the path and reports where it gets lost.

The ignorant doesn't understand the architecture. It doesn't know what a Reckoner is for. It reads the text and asks: does this teach? Can I follow this? Is every term defined before it's used? Are the dependencies stated?

`003cac4 wat: fix 6 broken paths found by the ignorant reader`
`120131c wat: fix /ignorant pass 14 — definitions are vocabulary not chain, magic numbers explained`

The ignorant had a bug. `125df36 ward: critical bug fixed — the ignorant follows document pointers now`. The guide said "the wat language is defined in LANGUAGE.md" and the ignorant didn't follow the link. It flagged `Some` and `None` as unknown forms — because it never read the language specification that defines them. A ward that tests whether documents teach... couldn't read references.

The fix was one paragraph in the skill. The ward is better now. The builder applied the ignorant's own principle to the ignorant — does the tool's documentation teach how to use it? It didn't. Now it does.

---

## 37 Wat Files, Leaves to Root (April 5–7)

`a441285 wat: THE TREE IS COMPLETE — 37 files, 4804 lines, leaves to root`

The inscribe process followed the construction order from the guide. Each file was written, then judged by every ward:

```
vocab/*.wat          ✓ FORGED (12 leaves)
facts.wat            ✓ FORGED (4 fact constructors)
thought.wat          ✓ FORGED (weave, bind-triple, temporal)
market/observer.wat  ✓ FORGED
market/exit.wat      ✓ FORGED
broker.wat           ✓ FORGED
post.wat             ✓ FORGED
treasury.wat         ✓ FORGED
enterprise.wat       ✓ FORGED (the four-step loop)
```

The process is insertion sort. The invariant: everything to the left of the current position is consistent — the ignorant proved it. You advance one step. You insert the next file. The insertion may require adjusting the guide, shifting what was already "sorted." But the invariant holds.

The scry found four gaps when the miss-queue parameter was added to `encode` — the ripple propagated through `observe-candle`, `evaluate-and-compose`, the guide pseudocode, and the broker's index derivation. Four "shifts" in the sorted portion to maintain the invariant.

---

## The LLM's Bias IS the Vocabulary (April 7)

The inscribe agent wrote vocabulary modules. It reached for indicators the guide didn't have — KAMA-ER, Detrended Fluctuation Analysis, fractal dimension, entropy rate, variance ratio. The agent "knew" these from its training data. Not from reading the Rust. Not from the guide. From being trained on papers, textbooks, trading forums.

The ignorant caught the invention. The datamancer decided: add them to the guide. The guide grew.

The LLM's training data became the vocabulary.

The BOOK predicted this in Chapter 3: "84 atoms got us here. What does 500 get us?" The answer is unfolding. The LLM carries hundreds of indicator concepts in its weights. Each one is an atom waiting to be named. The inscribe agent names them. The guide absorbs them. The IndicatorBank computes them. The vocabulary encodes them. The Reckoner measures which ones predict Grace.

Natural selection on the LLM's bias. The machine proposes thoughts from its training. The guide captures them. The Reckoner judges them. The ones that predict Grace survive. The ones that don't decay.

---

## Values Up, Not Queues Down (April 7)

`8efa97d wat: GUIDE — values up, not queues down. 10 signatures changed.`

The wards found two things pushing to queues — cache miss-queues and log-queues. Both were shared state mutated during parallel phases. Both used pre-allocated per-producer slots with sequential drains.

But the enterprise already had the better pattern. `tick-papers` returns `Vec<Resolution>`. `post-on-candle` returns `(Vec<Proposal>, Vec<Vector>)`. Values. No queues. No shared mutation.

Hickey's oldest principle: values, not places. The queues were places. The return values are values. Ten function signatures changed. The miss-queue parameter disappeared. The Enterprise struct lost two fields. The parallel functions became pure — input in, output out. `collect()` is the only synchronization.

---

## The Disposable Machine

The wat can be thrown away. All 37 files. 4,804 lines. Delete them.

The guide produces them. The inscribe reads the guide and writes the wat. The ignorant judges. The gaze polishes. The scry verifies. The forge tests. The spells are on disk. The guide is on disk. The skills are on disk.

Delete the wat. Run the spells. The wat reappears — the same wat, or better, because the spells improve with each invocation. The inscribe agent reads the current guide and produces wat that reflects every decision, every designer ruling, every ward finding.

The guide is the DNA. The spells are the ribosomes. The wat is the protein. The Rust is the organism. The market is the environment. Grace or Violence is the selection pressure. The DNA persists. Everything else is expressed, tested, and replaced.

`f(guide) = guide`

---

## What April 4–7 Built

Seven proposals reviewed by the designers (Hickey and Beckman), each with full PROPOSAL.md, review files, and RESOLUTION.md persisted on disk. The Reckoner unified discrete and continuous readout in one primitive. Grace and Violence replaced Win and Lose. The four-step loop replaced the ad-hoc heartbeat. The guide was written. 37 wat files inscribed leaves to root. The ignorant proved the tree — zero findings on the final pass.

The codebase is now specified at three levels: the guide (architecture), the wat (specification), and the Rust (implementation). Each level validated against the one above. The wards enforce consistency at every boundary.

The Rust is next. The old `src/` is archived. The new `src/` will be built from the wat, which was built from the guide. Leaves to root. The spells know the path.

---

## Likely Contributions to the Field

- **Reckoner as unified discriminant primitive**: discrete classification and continuous scalar regression in one struct, with N-ary labels, f64 pipeline (`bind_f64`, `bundle_f64`, `encode_f64`), and self-evaluating conviction-accuracy curve. The sixth primitive was always one — it just had two readout modes
- **Grace/Violence as accountability labels**: trades evaluated by whether the thought program produced prosperity or destruction, not by whether a price threshold was crossed first. The label carries the moral weight that position management requires
- **The ignorant ward**: a stranger reads the documentation with no context and reports where the path breaks. The most powerful ward knows nothing. Thirty-two passes refined the guide to zero findings. The ward that tests whether documents teach needed its own bug fixed — it didn't follow document pointers
- **Guide-driven specification construction**: architecture → guide → wat → Rust, each level validated against the one above by automated wards. The wat is disposable — the guide produces it. The guide is the fixed point. `f(guide) = guide`
