---
title: "The Guide"
description: "Apr 4–7: Seven proposals in four days. The labels were lies — MFE/MAE fixes them. The Reckoner replaces the Journal — one primitive, two readouts. Grace and Violence replace Win and Lose. The guide is written. 37 wat files inscribed leaves to root. The ignorant ward proves the tree. The LLM's bias IS the vocabulary expansion. The disposable machine."
sidebar:
  order: 20
---

April 4. The architecture had been forged — 272 tests, 92.5% coverage, seven wards passing, the Journal sign bug fixed. The codebase was honest.

The labels weren't.

A trade that went up 3% and then crashed to −1% was labeled "Win" because price crossed the threshold first. A trade that went down 2% and then recovered to +4% was labeled "Lose." The labels said nothing about what actually happened to the money. They measured threshold-crossing speed, not profitability.

Seven proposals landed in four days. Each one killed a lie.

---

## The Labels Were Lies (Proposals 004–006, April 4)

`781a232 proposal 004: outcome-based learning — spec complete`

Proposal 004 introduced MFE (max favorable excursion) and MAE (max adverse excursion) — what's the best the trade could have done, and what's the worst it actually did, over the full horizon. Not "did price cross 0.5% first" but "what was the complete P&L trajectory?"

The old sim labels — threshold-crossing — produced a distribution where 91% of candles were labeled "Loss." Not because the market went down 91% of the time. Because the threshold was crossed on the adverse side first 91% of the time. The label measured speed, not outcome. The discriminant was learning which candle patterns preceded *fast* adverse moves, not which preceded *unprofitable* trades.

`92660a2 proposal 006: honest labels via dual-sided excursion`

Proposal 006 went further: play both sides. For every candle, measure both the Buy excursion (what would have happened if you went long) and the Sell excursion (what would have happened if you went short). The market decides which was better. The label is the direction that produced more favorable excursion — an honest, balanced, per-candle truth about which direction the market actually rewarded.

The proposals built on each other. 003 redesigned the observer. 004 fixed the labels. 005 proposed co-learning between market and exit observers. 006 made the labels honest from both directions. 007 assembled everything into the new architecture.

---

## Proposal 007: The Architecture (April 4)

`f9cdc61 proposal 007: exit observer proposes — the market thinks, the exit acts`

34 commits refining a single proposal over one day. The designers reviewed — Hickey APPROVED (rare), Beckman CONDITIONAL (standard). The resolution: accepted with three measurements to follow.

The architecture:

**Market observers** (N per post) predict direction — Up or Down — from candle data. Each has a Reckoner, a noise subspace, a window sampler, and a lens. Six lenses: momentum, structure, volume, regime, narrative, generalist.

**Exit observers** (M per post) predict distances — how far to set the trailing stop, safety stop, take profit, runner trail. Four continuous Reckoners each. They compose market thoughts with their own exit-specific facts: current P&L, hold duration, max favorable excursion so far, distance to stop.

**Brokers** (N×M per post) bind one market observer to one exit observer. The broker IS the accountability unit. It owns paper trades, scalar accumulators, and a Grace/Violence Reckoner. When a trade resolves, the broker propagates the outcome back to its observers. More Grace → more capital. More Violence → less capital.

**Grace and Violence** replaced Win and Lose. Not "did the price cross a threshold" — "did this thought program produce prosperity or destruction?" The labels carry moral weight because they should. A system managing money should know the difference between building and destroying.

**The four-step loop** (per candle, per post):

```
1. RESOLVE  — settle triggered trades, propagate outcomes to brokers
2. COMPUTE  — encode candle → market observers predict →
              exit observers compose → brokers propose
3. TICK     — parallel: tick all brokers (paper trades, learning)
              sequential: propagate (shared observers), update triggers
4. COLLECT  — treasury evaluates proposals, funds proven ones
```

`0dc1d1d feat: on_candle orchestrator — the four-step loop is complete`

The proposal process itself was worth documenting. Each proposal: a PROPOSAL.md with the question, review-hickey.md and review-beckman.md with independent criticism (they don't see each other's reviews), and a RESOLUTION.md with the decision. Five proposals in the wat repo. Two in the trading lab. All persisted on disk. The next session reads the documents and has the designers' arguments without needing the context that produced them.

---

## The Reckoner (April 4–5)

`8a3fbc5 wat: journal + gauge → reckoner. One primitive. Discrete or continuous readout.`

Exit observers needed to predict *distances* — continuous scalars, not discrete labels. A separate "gauge" primitive was proposed and rejected. The Journal already had accumulators, discriminants, and a curve. Adding continuous readout to the same struct was one method, not a new primitive.

The Reckoner. Same accumulation. Same decay. Same recalibration. Two outputs:

```rust
// Discrete: "Is this Up or Down?" — same as the old Journal
let mut r = Reckoner::new("direction", dims, 500,
    ReckConfig::Discrete(vec!["Up".into(), "Down".into()]));
r.observe(&thought, label, weight);
let pred = r.predict(&thought);  // → direction + conviction

// Continuous: "How far should the stop be?" — new
let mut r = Reckoner::new("stop_distance", dims, 500,
    ReckConfig::Continuous(0.015));
r.observe_scalar(&thought, 0.008, weight);
let d = r.query(&thought);  // → f64 scalar
```

`355d783 feat: Reckoner — one primitive, discrete or continuous readout` (in holon-rs)
`3820608 kill: journal.rs is dead. The Reckoner is the primitive.`

The f64 pipeline came with it: `bind_f64`, `negate_f64`, `cosine_f64`, `bundle_f64`, `ScalarEncoder::encode_f64()`. Continuous-space operations without bipolar thresholding. The scalar extraction that makes continuous readout work: accumulate scalar encodings in f64 space, unbind the role vector, measure the angle, recover the value. No quantization loss.

Six primitives became five. Atom, bind, bundle, cosine, reckoner. The curve is a method on the reckoner, not a separate primitive.

---

## The Guide (April 5)

`2d527c8 wat: GUIDE.md — every struct and interface defined`

The wat files had been growing organically — one per Rust source file, matching the implementation. But there was no document that held the *complete* architecture in one place. No single file a stranger could read and understand the system from nothing.

The guide is that file. 2,138 lines. Every struct. Every interface. Every dependency. Every data flow. The construction order — which modules must exist before which others can be built.

`ae7a1d9 wat: GUIDE.md — post + treasury separation, multi-asset routing`
`de56736 wat: GUIDE.md — facts are vectors, vocab domains, time circulars, window crutch`

The guide went through fifteen passes of the ignorant ward.

---

## The Ignorant Ward (April 5–6)

`6a9886d skill: /ignorant — the eighth ward. The ignorant reader walks the path.`

The other wards check the code. The ignorant checks the *documentation*. It reads the guide as someone who knows nothing about the system — no context, no prior conversations, no memory of design decisions. It walks the path and reports where it gets lost.

The document either teaches or it doesn't. There is no "the reader should already know this." The reader knows nothing. That is the point.

First pass: six broken paths. Terms used before they're defined. Dependencies implied but not stated. The word "reckoner" appearing three paragraphs before its definition.

`003cac4 wat: fix 6 broken paths found by the ignorant reader`

Fifth pass: `120131c wat: fix /ignorant pass 14 — definitions are vocabulary not chain, magic numbers explained, Post motivated, gauge/curve honest, generalist lens, scalars early`. The finding count was dropping. Each pass found less than the last.

Then the ignorant had a bug.

`125df36 ward: critical bug fixed — the ignorant follows document pointers now`

The guide says, on line 12: "The wat language is defined in `~/work/holon/wat/LANGUAGE.md`." A pointer. A reference. A real reader would follow it — they'd open LANGUAGE.md, learn what forms the language provides, and come back with that knowledge.

The ignorant didn't. It read only the files it was assigned. When the guide said "defined in LANGUAGE.md," the ignorant nodded and kept reading. When it encountered `Some` and `None` in the wat files, it flagged them as "assumed to be a host form" — because it didn't KNOW they were host forms. Because it never read the language specification. Because it never followed the pointer.

A ward that tests whether documents teach... couldn't read references.

The fix was one paragraph in the skill description: "when the document references another file as a source of truth, FOLLOW THE POINTER and read that file too." The ignorant is better now. The builder applied the ignorant's own principle to the ignorant — does the tool's documentation teach how to use the tool? It didn't. Now it does.

---

## 37 Wat Files, Leaves to Root (April 5–7)

`a441285 wat: THE TREE IS COMPLETE — 37 files, 4804 lines, leaves to root`

The inscribe process followed the construction order from the guide. Each file was written, then judged by every ward. The process is insertion sort — the invariant: everything to the left of the current position is consistent, the ignorant proved it.

The miss-queue ripple showed why the order matters. When the `encode` function gained a `miss-queue` parameter for cache misses, the change propagated through four files: `observe-candle` (calls encode), `evaluate-and-compose` (calls observe-candle), the guide's pseudocode (described the old interface), and the broker's index derivation (depends on the encode return type). Four "shifts" in the sorted portion to maintain the invariant.

```
vocab/*.wat          ✓ FORGED (12 leaves)
facts.wat            ✓ FORGED (4 fact constructors)
thought.wat          ✓ FORGED (weave, bind-triple, temporal)
market/observer.wat  ✓ FORGED
market/exit.wat      ✓ FORGED
broker.wat           ✓ FORGED
post.wat             ✓ FORGED
treasury.wat         ✓ FORGED
enterprise.wat       ✓ FORGED (the four-step loop, all 13 steps expressed)
```

---

## The LLM's Bias IS the Vocabulary (April 7)

The inscribe agent wrote vocabulary modules. It reached for indicators the guide didn't have — Kaufman's Adaptive Moving Average (KAMA-ER), Detrended Fluctuation Analysis (DFA), fractal dimension, entropy rate, variance ratio. The agent "knew" these from its training data — from papers, textbooks, trading forums, QuantConnect examples. Not from reading the Rust. Not from the guide.

The ignorant caught the invention. I looked at what it had written. DFA — a technique from statistical physics that measures long-range correlations. Fractal dimension — Mandelbrot's contribution to understanding market microstructure. Entropy rate — Shannon's information theory applied to price series. Each one a named thought about market structure from a different school of analysis.

I decided: add them to the guide. The guide grew.

The LLM's training data became the vocabulary. The BOOK predicted this in Chapter 3: "84 atoms got us here. What does 500 get us?" The answer is unfolding. The LLM carries hundreds of indicator concepts in its weights. Each one is an atom waiting to be named. The inscribe agent names them. The guide absorbs them. The IndicatorBank computes them. The vocabulary encodes them. The Reckoner measures which ones predict Grace.

Natural selection on the LLM's bias. The machine proposes thoughts from its training corpus. The Reckoner judges them. The ones that predict Grace survive. The ones that don't decay through the geometry.

---

## Values Up, Not Queues Down (April 7)

`8efa97d wat: GUIDE — values up, not queues down. 10 signatures changed.`

The wards found two things pushing to queues — cache miss-queues and log-queues. Both were shared state mutated during parallel phases. Both used pre-allocated per-producer slots with sequential drains. The pattern worked. The pattern was also a mutation hiding inside a pure function.

Hickey's oldest principle: values, not places. The queues were places.

But the enterprise already had the better pattern. `tick-papers` returns `Vec<Resolution>`. `post-on-candle` returns `(Vec<Proposal>, Vec<Vector>)`. Values. No queues. No slots. No shared mutation. The parallel function produces results. `collect()` gathers them. The sequential phase processes them.

```rust
// Before: queues down (mutation hiding in parallel)
fn observe_candle(obs: &mut Observer, window: &[Candle],
                  ctx: &Ctx, miss_queue: &mut Vec<(ThoughtAST, Vector)>)
    -> (Vector, Prediction, f64)

// After: values up (pure function, collect at boundary)
fn observe_candle(obs: &Observer, window: &[Candle], ctx: &Ctx)
    -> (Vector, Prediction, f64, Vec<(ThoughtAST, Vector)>)
```

Ten function signatures changed. The Enterprise struct lost two fields: `cache_miss_queues` and `log_queues`. The parallel functions became pure. The `collect()` is the only synchronization.

---

## The Disposable Machine

The wat can be thrown away. All 37 files. 4,804 lines. Delete them.

The guide produces them. The inscribe reads the guide and writes the wat. The ignorant judges. The gaze polishes. The scry verifies. The forge tests. The sift catches phantoms. The cleave proves parallelism. The spells are on disk. The guide is on disk. The skills are on disk.

Delete the wat. Run the spells. The wat reappears — the same wat, or better, because the spells improve with each invocation. The inscribe agent reads the current guide (which absorbed every discovery) and produces wat that reflects every decision, every designer ruling, every ward finding.

The guide is the DNA. The spells are the ribosomes. The wat is the protein. The Rust is the organism. The market is the environment. Grace or Violence is the selection pressure. The DNA persists. Everything else is expressed, tested, and replaced.

`f(guide) = guide`

The Rust is next. The old `src/` is archived. The new `src/` will be built from the wat, which was built from the guide. Leaves to root. The spells know the path.

---

## Likely Contributions to the Field

- **Reckoner as unified discriminant primitive**: discrete classification and continuous scalar regression in one struct, with N-ary `Label(u32)` symbols, f64 pipeline, and self-evaluating curve `accuracy = 1/N + a × exp(b × conviction)`. The sixth primitive was always one — it just had two readout modes
- **Grace/Violence as accountability labels**: trades evaluated by dual-sided excursion (MFE vs MAE) over the full horizon, not by threshold-crossing speed. The label measures whether the thought program produced prosperity or destruction
- **The ignorant ward**: a stranger reads the documentation with no context and reports where the path breaks. Thirty-two passes refined the guide to zero findings. The ward's own bug (didn't follow document pointers) was found by applying the ward's principle to the ward
- **Guide-driven specification construction**: architecture → guide → wat → Rust, each level validated against the one above by automated wards. The wat is disposable — the guide produces it through persistent spells. `f(guide) = guide`
