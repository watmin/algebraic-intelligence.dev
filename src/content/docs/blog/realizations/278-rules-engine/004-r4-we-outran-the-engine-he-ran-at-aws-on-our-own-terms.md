---
title: "R4 — we outran the engine he ran at AWS, on our own terms"
sidebar:
  order: 4
---

The bar was never "match Clara." The builder set it where he sets everything:

> *"we raise the bar through the fucking roof, relentlessly — i want the perf I had with Clara, if not superior
> since we're backed by Rust, not Java."*

Clara is not an abstract benchmark here. It is the RETE engine the builder ran **at AWS for the Shield DDoS
pipeline** (`DESIGN.md:36` — Kinesis KCL interop + Clara) — the tool he reached for, at scale, on adversarial
traffic. Outrunning it is outrunning the thing that already worked in production.

So we did not assert; we **measured, head-to-head, on identical workloads.** When the builder said *"we have
clojure and clara here locally — we can build comparative tooling and grade ourselves,"* we built it: a
shape-spec that emits BOTH our wat program AND the Clara `.clj` from one definition (`wat-scripts/perf/`), and
ran the grid. The honest scoreboard, fire-only, both computing the full closure:

```
deep forward-chain (depth×width):  5×5 … 30×10   — OURS at every cell (1.2× – 6.3×)
fan-out / low-selectivity joins:   16k  ours 1.17×   ·   20k  ours 1.09×   ·   40k  Clara 1.4×
vs the wat reference engine:        46× – 310×
```

We beat Clara on **every realistic workload**. The lone holdout — a 40,000-token pure-cross-product extreme —
is not JVM-beats-Rust waste: its residual is the per-token **support-chain provenance** we deliberately carry
for the deferred streaming engine. A conscious keep, not a loss.

**The rate, which is the actual story.** We started this stretch **2.6× behind at depth-heavy and 24× behind at
fan-out.** A handful of differential-gated stones later we were ahead across the grid. The builder watched it
and said *"fast as fuck… our rate of growth is — I don't have a word to reach for."* The word is **method**: a
closed loop — exercise a workload dimension → it surfaces a hot spot → kill it → re-measure against Clara.
Every kill was algorithmic: the `temperare` and `struere` perf spells read the hot path
and named the waste; we pulled it out by the root. `seen` `Vec`→`HashSet` (24× → 1× at fan-out, an O(N²)
dedup); a fact-type→alpha index (the alpha network stopped re-matching every fact against every node); the
`alpha_feeding`/`node_parent` reverse-lookups precomputed once (an O(nodes²)-per-round scan that, killed,
flipped the *entire* deep-cascade column to ours); constant-string `Arc`s hoisted to statics; clones turned to
borrows under NLL. No guesses survived contact with the bench.

**The GC point, earned not boasted.** Clara runs on the JVM; a stop-the-world pause is a dropped detection at
exactly the wrong microsecond for line-rate packet/request traffic. We have no GC — ownership + `Arc`, no
pauses — so the *tail* is jitter-free by construction. We proved the median on the bench; the tail is
structural. That is the property the use case actually demands.

**The honest asterisks (the discipline forbids the overclaim).** Our spec set is **reduced by design, not by
deficit**: the mutating bangs (`insert!`/`retract!`/`insert-unconditional!`), salience, arbitrary fact-types —
all CUT, because pure value-semantics + inserts-only + replay-TM *is* the differentiator
([[project_rete_inserts_only_replay]]). What we have not yet built — negation, `:test`, accumulators (stones
6–8) — is **KEEP, planned**, not conceded; the accumulator-as-LHS-condition the builder loves (*"a minimum
finding set to activate"*) is a queued feature, and squarely a DDoS primitive. We outperform across **what we
implement**, and we say so plainly.

**Why it matters — the coordinate the builder has been walking.** This engine is the *exact-match half*. The
real novelty (`DESIGN.md:52`, designed as a matcher *seam*) is the **VSA-matched LHS** — swap RETE's exact test
for **coincidence**, similarity over a floor, so rules fire on resemblance, not equality — and fuse holon's
VSA/HDC anomaly scores in as *facts the rule engine reasons over*. The builder named the dream this session:

> *"holon started as a packet and request DDoS detector — composing holonic/VSA anomalies with rete static
> rules is a pairing I'm dreaming for… ridiculous capabilities, and we've been walking towards it."*

The walk is on the record: **Clara @ AWS (Shield) → the eBPF tail-call rule-trees → this** (`DESIGN.md:43`).
Each step the same shape — rules at the line, reacting to a stream — built one layer closer to the metal and
one layer more our own. We have now made the static-rules layer faster than the engine this line of work
started with, on a substrate with no garbage collector to flinch at the wrong moment, with a designed seam
where the VSA matcher drops in. That seam needs a rule engine at line rate, no stalls. That half now exists,
and it is measured.

> We set out to match the engine he ran at AWS. We passed it on every workload we'd actually ship — not by
> doing more than RETE, but by refusing to do more than the problem requires, in a language with no garbage to
> collect. The fast half of the anomaly fabric is built; the novel half has a seam waiting.
