---
title: "The Slow Engine Is the Spec"
description: "June 17–20, arc 278 — bring the rules engine home. The builder ran Clara (a Rete in Clojure) on the AWS Shield DDoS pipeline; arc 278 rebuilds that engine in wat. A complete Rete fell out in a day — alpha matching, equality joins with real cross-condition unification, production firing, cascade to a monotone fixpoint, truth maintenance with transitive retraction, a homoiconic defrule/query surface — green against a day-one acceptance test that never moved. Then it benched O(N²), 130–820 facts/s, hopeless for line rate. The realization: the slow wat engine is not waste to delete, it is a known-correct executable spec — the differential oracle the fast Rust kernel must match bit-for-bit, which fell out for free because the engine was built correctness-first in pure value-semantics (Session in, Session out). wat resumed its original role — Rust without Rust's syntax, a spec language. The Rust fire kernel then beat the AWS engine head-to-head on every realistic workload (deep forward-chain 1.2–6.3× ours, fan-out 1.09–1.17× ours, vs the wat reference 46–310×), from 2.6×/24× behind to ahead, every kill algorithmic and differential-gated — and with no GC to stall the tail at the wrong microsecond. The dual-impl doctrine, named: the wat spec is the executable spec, the first shipped impl, and the permanent witness; solve the user-facing impl in wat, flip the guts to Rust behind a freeze boundary, keep the wat one as a standing differential. Honest open edge: the feature set is reduced by design (mutating bangs, salience cut), and the arc isn't closed — a few collection-HOF side-quests remain to let users supply their own query/accumulator fns, and the VSA-matched-LHS seam (fire on resemblance, not equality) is designed but unbuilt."
sidebar:
  order: 57
---

[The Arguments Were a Record](/blog/story/series-006-033-the-arguments-were-a-record/) closed on coherence — power recognized in the substrate rather than built. This post is the largest thing that recognition has yet afforded: a complete Rete rules engine, brought home into wat, that beat the engine its author ran in production at AWS — and a realization about *why* the slow first version was the most valuable artifact, not the throwaway.

## Bringing the engine home (June 17)

The builder ran **Clara** — a Rete engine in Clojure — on the **AWS Shield DDoS pipeline**: Kinesis KCL interop, rules over adversarial traffic at scale (`DESIGN.md:36`). Arc 278 rebuilds that engine in wat. He named the target plainly:

> i've been grinding towards a high perf clara in rust to use with my tooling.

The tooling is wat; `wat::rete` is the Clara. And a complete one fell out in a day — the north star went green, and he said it plain:

> we built a complete rete in under a day — that's…. insane.

What shipped end to end: alpha matching; **equality joins with real cross-condition unification** (the `HashJoinNode` — the part every toy evaluator hand-waves); production firing; **cascade to a monotone fixpoint**; **truth maintenance with transitive retraction** (retract a supporting fact and its whole derived chain vanishes); and a homoiconic `defrule`/`query` surface — green against `cold-and-windy`, an acceptance test written on day one that never moved. Not a naive stand-in: the thing Forgy's 1974 thesis is about, with the parts CLIPS/Drools/Clara bolt on.

It read as insane; it was **assembly, not invention**. The hard parts were already on the shelf from prior arcs — persistent collections, the total-pure macro engine (249), types-as-forms (251), records, the symbol-table reflection. Rete was orchestration of Rust with clean syntax, which is what wat is for; every earlier arc turned out to be a stone in this foundation without knowing it. The strike discipline did the compounding: each stone drawn as a DESIGN plus a RED probe that fails on *exactly* the gap, fired to one sonnet, weighed against an independent re-run and the diff, shipped green. Slow is smooth; never the same boss twice.

## The slow engine is the spec (June 18)

Then it was benched for the first time (`perf_arc278_fire_baseline.rs`):

```
N= 25  (  50 facts)   ~61 ms     ~820 facts/s
N=100  ( 200 facts)  ~762 ms     ~260 facts/s
N=400  ( 800 facts) ~6134 ms     ~130 facts/s
```

Per-fact cost climbing 1.2 ms → 7.7 ms — textbook O(N²) (re-run-from-scratch × a deferred-index cross-join). 130–820 facts/s is four-to-seven orders of magnitude under line rate. The wat-interpreted fire loop is, measured, hopeless for the bar. The instinct was to call that a failure of the wat stones. The builder saw the opposite:

> this is insane to me — we have a known correct-but-slow impl that we can directly measure against — we didn't plan for this… it just fell out… wat guides the rust impl … this is how wat started as a spec language, not an interpreted one — this is a realization.

That is the realization the era turns on. The slow wat engine is not waste to delete — it is a **known-correct executable specification**, and the Rust fire kernel to be built (delta propagation, keyed joins, native mutable memories behind a freeze boundary) is the *optimization* that must match it **bit-for-bit on every input**. The hardest, most error-prone code in any Rete — incremental delta plus the truth-maintenance cascade, Clara's hazard #1 — gets validated against a reference so simple it is obviously correct. And the net cost nothing: it fell out of building correctness-first in wat.

It works as an oracle for a precise reason: the wat engine is pure value-semantics — `Session` in, `Session` out, no hidden state — so the differential test is a total-function comparison, the oracle's frozen `Session` against the kernel's, structurally. The kernel's internal mutation during fire is sealed behind the freeze boundary, never observable; the only thing compared is the immutable result. Two engines, one contract, byte-for-byte. wat had resumed its first role:

> i view wat as an orchestration of rust — wat exists because i want rust without rust's syntax.

The interpreter was a convenience that grew on top; the original job was to *say what the system does* so Rust could do it fast underneath. The rete engine made that literal: wat says the semantics, Rust executes them at speed, wat keeps Rust honest.

## Outrunning the engine he ran at AWS (June 19)

The bar was never "match Clara." It was, as always:

> we raise the bar through the fucking roof, relentlessly — i want the perf I had with Clara, if not superior since we're backed by Rust, not Java.

So it was measured, head-to-head, on identical workloads — a shape-spec emitting **both** the wat program and the Clara `.clj` from one definition, run on a grid. The honest scoreboard, fire-only, both computing the full closure:

```
deep forward-chain (depth×width):  5×5 … 30×10   — OURS at every cell (1.2× – 6.3×)
fan-out / low-selectivity joins:   16k  ours 1.17×  ·  20k  ours 1.09×  ·  40k  Clara 1.4×
vs the wat reference engine:        46× – 310×
```

It beat Clara on **every realistic workload**. The lone holdout — a 40,000-token pure-cross-product extreme — is not JVM-beats-Rust waste; its residual is the per-token support-chain provenance carried deliberately for a deferred streaming engine, a conscious keep. And the *rate* is the actual story: the stretch started **2.6× behind at depth-heavy and 24× behind at fan-out**, and a handful of stones later was ahead across the grid. The builder watched it: *"fast as fuck… our rate of growth is — I don't have a word to reach for."* The word is **method** — a closed loop: exercise a workload dimension, surface a hot spot, kill it, re-measure against Clara. Every kill was algorithmic, named by the `temperare`/`struere` perf passes reading the hot path: a `seen` `Vec`→`HashSet` (24× → 1× at fan-out, an O(N²) dedup); a fact-type→alpha index so the alpha network stopped re-matching every fact against every node; reverse-lookups precomputed once (an O(nodes²)-per-round scan that, killed, flipped the entire deep-cascade column); constant `Arc`s hoisted to statics; clones turned to borrows under NLL. No guess survived contact with the bench.

The GC point is earned, not boasted. Clara runs on the JVM, where a stop-the-world pause is a dropped detection at exactly the wrong microsecond for line-rate traffic. wat has no GC — ownership plus `Arc`, no pauses — so the *tail* is jitter-free by construction. The median was proven on the bench; the tail is structural, and at the line predictable latency may matter as much as raw throughput.

## The dual-impl doctrine, named (June 19)

R1 was the discovery — the oracle fell out by surprise. Watching the same shape repeat three stones running (the purity fences, the eval-test, the TestNode each built wat-first then Rust-validated), the builder elected it as the standing method:

> a wat-native impl be the spec of correctness and then building the performant guts in rust. we always solve the user-exposed impl first, then flip to the performant one, always retaining the wat-correct impl as a form of constant correctness checks. we hold ourselves accountable with two impls for hard problems.

The force of it is that the wat impl is **three things at once**, where most projects get one: an *executable* spec (it runs, so it cannot silently drift from itself the way prose rots); the *first shipped impl* (correct-if-slow on day one, so the user-facing surface exists before the fast guts do); and the *permanent witness* (when the Rust guts and the wat oracle disagree, the bug is localized instantly — two answers, one wrong, the simple one obviously right). You write the dangerous fast code fearlessly because the boring correct code stands behind it forever.

And the doctrine had a corollary nobody had stated, caught by stopwatch mid-Stone-8:

> whoa — did we do the rust port just now? … we spent like 40 min in wat and like 3min in rust.

Because Stones 6–8 build the same feature twice — once in the oracle, once in the kernel — the durations are directly comparable. Read the native column down: **5m23s → 3m51s → 3m52s**, converging to a flat ~4 minutes *regardless of how hard the feature is*. Read the oracle column: **7m → 7.5m → 15m**, scaling with conceptual weight (accumulators, with fold semantics and honest empty-case typing, were twice the thinking of negation). The impl cost is flat because the native strike carries **no discovery burden** — the oracle already answered *what*, the differential will mechanically prove *correct*, and the prior native stone showed *how*, so each Rust port becomes a near-line-for-line transcription. The cost of a feature moved permanently to the spec; the impl became a commodity, bounded by typing speed, not thinking speed. The harder the feature, the wider the win — exactly backwards from how impl effort normally behaves.

## The snapshot is deferred computation (June 19)

The builder wanted the engine to do what his AWS pipeline did: fetch the exact state a host was processing — facts and as-of rules from S3 — revive it on a dev machine, overwrite facts or swap rules, watch the system evolve. That loop triaged misfiring DDoS rules in prod. Reading how Clara serializes its diagnostic blob surfaced *why* Clara has to carry a mammoth one: its RHS is **arbitrary `eval`'d code**, so re-firing re-executes side effects, so it cannot safely re-derive — it must store the whole working memory, the un-fired agenda, an identity-sharing graph, under a verbatim warning that it may not deserialize against another Clara version.

`wat::rete` can re-derive. Its RHS is a restricted pure interpreter — inserts-only, no side effects; `fire-rules` recomputes every memory from `facts` each call, pure replay; working memory is a deterministic function of `(facts × rules)`. Every reason Clara had to serialize derived state was eliminated by construction, so the durable blob collapses to its irreducible core — **`{facts, rules}`** — and the derived facts and full provenance regenerate on re-fire, because the provenance *is* the token-match data the joins rebuild every fire.

> whoaaaaaaa — so we don't need the final forms because we are entirely pure and reconstructable? … we do everything in memory because we forced purity — there is no unknowns, just deferred computation?

That is it: the snapshot is not a frozen result but a **suspended pure computation** — `{facts, rules}` is a thunk, firing forces it; purity is what makes the suspension safe, because the forced result carries zero information not already in the inputs. Clara stored the answer because it could not re-force the thunk; wat stores the thunk. It is call-by-need at the persistence layer, and the blob carries no engine internals, so it is version-stable where Clara's is version-fragile. *"this is actually better than what i spent years fighting for and eventually building."*

## What's done, and what is honestly not (June 20)

The engine is feature-complete against what it sets out to be — alpha, joins, production, cascade, truth maintenance, negation, `:test`, accumulators, the Rust kernel beating Clara across the grid — and the feature set is **reduced by design, not by deficit**: the mutating bangs (`insert!`/`retract!`/`insert-unconditional!`) and salience are *cut*, because pure value-semantics plus inserts-only plus replay-truth-maintenance *is* the differentiator.

But arc 278 is not closed, and the chronicle does not pretend it. A few collection side-quests remain — rounding out the seq HOFs (`map`/`filter`/`foldl`/`reverse`/`take`/`drop`/`concat`) across the container family — so that users can supply their **own** query and accumulator functions over the engine, not just the built-ins. That tooling is the open edge the work is on now; the formal close waits on it. And the real novelty is designed but unbuilt: a **VSA-matched LHS** — swap Rete's exact test for *coincidence*, similarity over a floor, so rules fire on resemblance rather than equality, and fuse holon's VSA anomaly scores in as *facts the rule engine reasons over*. The walk is on the record — Clara at AWS Shield → the eBPF tail-call rule-trees → this — each step rules-at-the-line, one layer closer to the metal and one layer more its own. The static-rules half is now built and measured, faster than the engine the line of work started with; the seam where the geometric matcher drops in is waiting.

## Likely Contributions to the Field

- **The slow reference implementation is the asset, not the throwaway.** Building a complex engine correctness-first in a pure, value-semantics language yields, for free, a *known-correct executable specification* — the differential oracle the optimized implementation is held to bit-for-bit. The most dangerous code in the system (incremental delta plus the truth-maintenance cascade) is then written fearlessly, because a reference too simple to be wrong adjudicates every input. The cost of the oracle is zero: it is the first version, kept.
- **The dual-impl doctrine, and its decoupling corollary.** Solve the user-facing implementation in the spec language first (it is both the deliverable and the spec), flip the guts to a fast native kernel behind a freeze boundary, and keep the spec as a standing differential — so the spec, the first ship, and the permanent witness are one artifact instead of three that rot separately. Measured across same-feature-twice stones, the native port time goes *flat* (~4 min) while the spec time scales with conceptual difficulty — the thinking moved permanently to the spec, and the implementation became a transcription whose win widens as problems get harder.
- **Purity collapses the durable snapshot to its inputs.** When the engine's right-hand side is pure and inserts-only, working memory is a deterministic function of `{facts, rules}`, so a persisted session is a *suspended computation* — store the thunk, force on demand — not a serialized result. The derived state and its full provenance regenerate on re-fire, the blob carries no engine internals and is therefore version-stable by construction, and a rules engine whose RHS is arbitrary evaluated code cannot have any of this.
- **No GC is a correctness property at the line, not just a speed one.** A garbage-collected rules engine pays a stop-the-world tail-latency spike at an adversary-chosen microsecond; an ownership-based native kernel has a jitter-free tail by construction. For line-rate detection the predictable tail can matter as much as the median, and it comes from the substrate, not from tuning.
