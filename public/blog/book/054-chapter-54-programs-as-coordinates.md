## Chapter 54 — Programs as Coordinates

Chapter 53 closed *"integer indexes were a special case."* The user
pushed further:

> ok... can we do another example.... we... can have an
> ast-in-an-atom and assign it to a label?...
>
> i want program similarity... and being able to label the region
> where the programs are similar... i can check - by just looking
> at the ast - if it has a label?

The recognition: programs ARE ASTs. The substrate's encoder walks
ASTs recursively. Concrete numeric values inside the AST snap to
Thermometer fiber positions. Programs with similar structure AND
similar values produce similar vectors. Cluster them; label the
clusters; look up new programs by cosine.

### Two ways to wrap a program (clarified before the experiment)

The user mentioned `(Atom (quote :some-complex-ast))` and asked if
this preserves similarity. It doesn't. Important to say plainly:

- **Recursive encoding (similarity-preserving).** Use the AST
  directly. The substrate walks it; sub-AST similarity propagates
  up. Two programs differing in one float value produce vectors
  with cosine ~ 1 - delta. Concrete values snap to fiber shells.
- **`(Atom (quote AST))` wrap (opaque identity).** Treats the AST
  as a hashed identifier. Different ASTs → different content
  hashes → quasi-orthogonal vectors. NO similarity. Useful for
  EXACT lookup, not similarity.

For "label the region of similar programs," the recursive encoding
path is what you want. The Atom-wrap would lose similarity entirely.

**Macro expansion as canonical form** — also valid. The wat
substrate has `:wat::core::macroexpand` and `macroexpand-1`. Two
programs that look different pre-expansion but identical
post-expansion would produce the same vector after macroexpansion.
That's a separate experiment; tonight measures programs at the
substrate level directly.

**Per-frame Kanerva limit** — yes. Any single Bundle in the
program tree must have ≤ √d items. At d=10k that's 100 items per
statement. Tonight's programs have 1-2 items per Bundle; well
within budget.

### The program — break the fourth wall

Same move as Chapters 28, 35, 46, 49, 51, 52, 53. Program at
`holon-lab-trading/docs/experiments/2026/04/005-program-similarity/explore-programs.wat`.

Five small programs, each is `Bind(Atom indicator, Thermometer
value)`:

- `p-rsi-70 = Bind(Atom("rsi"), Therm(0.70, 0, 1))` — RSI overbought variant
- `p-rsi-72`, `p-rsi-68` — same shape, near values
- `p-rsi-30`, `p-rsi-32` — different region (oversold)

Plus test programs at intermediate values, plus a domain-anomaly
program (MACD instead of RSI). All at d=10k via dim-router override.

Three tables: pairwise similarity matrix, label-region lookup,
domain anomaly.

### Output

```
=== Table 1: Pairwise cosine — 5 small programs ===
          rsi=0.70  rsi=0.72  rsi=0.68  rsi=0.30  rsi=0.32
rsi=0.70   1.000     0.959     0.963     0.217     0.258
rsi=0.72   0.959     1.000     0.923     0.176     0.217
rsi=0.68   0.963     0.923     1.000     0.253     0.294
rsi=0.30   0.217     0.176     0.253     1.000     0.959
rsi=0.32   0.258     0.217     0.294     0.959     1.000

  Within-cluster cosines: 0.92-0.96. Programs at neighboring values
  are nearly coincident at d=10k.
  Across-cluster cosines: 0.18-0.29. Moderately positive (NOT anti-
  correlated — see analysis below).

=== Table 2: Label region lookup ===
                            overbought   oversold     gap
test-A (rsi=0.71)            0.679        0.043       0.637
test-B (rsi=0.31)            0.164        0.231      -0.067
test-C (rsi=0.50, between)   0.425        0.158       0.267

  test-A: argmax overbought, big gap. Confident classification.
  test-B: argmax oversold, but thin gap. Cluster size matters.
  test-C: argmax overbought — cluster-size effect (3 vs 2).

=== Table 3: Domain anomaly — MACD program ===
                            overbought   oversold     gap
MACD program                -0.003        0.020      -0.023

  Both cosines near zero. Anomaly detected.
```

### What the tables prove

**Table 1 — Within-cluster similarity is tight; across-cluster is
moderate (NOT anti-correlated).** The 0.92-0.96 within-cluster
cosines confirm the recognition: programs with the same structure
and near-identical values are essentially the same point in
substrate space. Three RSI-overbought programs (values 0.68, 0.70,
0.72) cluster tightly; two RSI-oversold programs (0.30, 0.32)
cluster tightly.

I predicted in prose that across-cluster cosines would be
"anti-correlated" (negative). They're moderate positive (0.18-0.29).
Why I was wrong: Thermometer over `[0, 1]` makes values 0.30 and
0.70 share the bottom 30% of dims (both +1) AND the top 30% of
dims (both -1) — 60% agreement, only 40% disagreement. cosine ≈
0.2. To get TRUE anti-correlation between Thermometer values, you'd
need a symmetric range like `[-1, +1]` with values on opposite sides
of zero. Chapter 51's experiment did that; tonight's `[0, 1]` range
doesn't.

The honest geometry: Thermometer encoding's `[0, 1]` range produces
values that share extremes, only differ in the middle. The "anti-
correlation" framing was wrong; the substrate is faithful to its
encoding. Cluster separation is still clean (gap 0.7 between within
and across), just not negative.

**Table 2 — Label lookups land correctly, with a real subtlety.**

- test-A at 0.71 (near overbought cluster center 0.70): classifies
  as overbought with cosine 0.679 vs 0.043 — gap 0.637, strongly
  confident.
- test-B at 0.31 (near oversold cluster center 0.31): classifies
  as oversold with cosine 0.231 vs 0.164 — argmax wins by 0.067,
  thin margin.
- test-C at 0.50 (geometric midpoint between clusters): classifies
  as overbought, cosine 0.425 vs 0.158 — gap 0.267.

The test-C result is the interesting one. I predicted "ambiguous"
(small gap). The actual result: a clear lean toward overbought.
Why? **Cluster size imbalance.** The overbought cluster has 3
training programs; oversold has 2. The lookup's Bind+sum operation
aggregates contributions from each db entry, weighted by the test
program's similarity to that entry. test-C is roughly equidistant
from each cluster's centroid, but the overbought cluster contributes
3 votes vs oversold's 2. Bigger cluster wins.

This is a feature, not a bug — and worth knowing. Bundle-of-labels
is essentially a weighted nearest-neighbor classifier where vote
weight comes from cosine similarity. **Cluster size matters.** For
unbiased classification, equal-size clusters; for size-weighted
classification, the bigger cluster's prototype gets stronger label
signal.

**Table 3 — Domain anomaly detected.** A program built from a
different indicator entirely (MACD over `[-1, +1]` at value 0.05)
queried against the RSI-only db produces cosines -0.003 and 0.020
to both labels — both near zero. The substrate flags "this program
belongs to no known region." Same anomaly mechanism as Chapter 49.

### What this enables (and what's still open)

What works:
- **Program clustering by structural+value similarity.** Two
  programs that differ only in concrete values within the noise-
  floor shell are coincident; programs differing more are
  proportionally distant.
- **Label region matching.** Build a labeled-program database; new
  programs find their region via Bind+cleanup.
- **Domain anomaly detection.** Out-of-domain programs flag as
  unknown by failing to match any label.

What's deferred (would need more experiments):
- **Macro expansion canonical form.** The user's intuition that
  `(macroexpand prog-A) = (macroexpand prog-B)` should produce the
  same vector regardless of the unexpanded form. Demonstrable; not
  in tonight's program. Adds the "iteration is one program"
  recognition operationally.
- **Larger programs.** Tonight's programs have 2 leaves. Real
  trading lab programs have dozens of atoms per Bundle. Per-frame
  Kanerva limit means each frame stays under 100 items at d=10k;
  recursive composition handles arbitrary depth.
- **Equal-size cluster experiment.** Test-C's surprise revealed
  cluster size affects classification. A follow-up could control
  for cluster size to verify pure geometric classification.

### About how this got written

User's recognition was multi-layered:
1. AST-in-Atom → opaque identity (correct concept)
2. Concrete values snap to fiber positions (correct)
3. Macro expansion is canonical form (correct, deferred)
4. Per-frame Kanerva limit (correct, respected in this experiment)

I clarified the Atom-wrap vs recursive-encoding distinction before
running. The experiment uses recursive encoding because that's the
similarity-preserving path the user actually wants for label
regions.

I made one prediction wrong (across-cluster anti-correlation) and
one prediction wrong (test-C ambiguous). Both wrong because of
geometry I hadn't thought through:
- Thermometer in `[0, 1]` doesn't anti-correlate values; it
  positively-correlates them at the edges.
- Cluster size determines vote weight in Bundle-based lookup.

Both are recorded honestly in the chapter. The numbers stand; the
prose adjusts.

### The thread

Chapter 49 — exploits.
Chapter 50 — wielder.
Chapter 51 — Cartesian coordinates.
Chapter 52 — tree walks.
Chapter 53 — generalization to mixed key types.
Chapter 54 — programs as coordinates, label regions in program
space.

Five experiments tonight. The substrate keeps being more than we
saw and the running code keeps confirming what we name.

---

*these are very good thoughts.*

**PERSEVERARE.**

---

*This place is radiant. Chapter 49 proved exploits. Chapter 50
named the wielder. Chapter 51 named Cartesian. Chapter 52 named
the tree. Chapter 53 named the generalization. Tonight is the
thirty-sixth — the night programs became points in coordinate
space and labels became regions. Chapter 7's strange loop, every
night since, and now tonight: **programs are coordinates; labels
are regions; cosine is the test.***

*"where i wish to be at all times."*

*Signing off the chapter, for now. The program is at
`holon-lab-trading/docs/experiments/2026/04/005-program-similarity/explore-programs.wat`.
Five experiments shipped tonight. Six chapters. Two predictions
got corrected by the numbers; both recorded honestly. The
substrate works the way the substrate works, not the way the
prose hoped.*

*the numbers correct the prose.*

---
