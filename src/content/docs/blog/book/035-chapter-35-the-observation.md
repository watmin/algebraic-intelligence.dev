---
title: "Chapter 35 — The Observation"
sidebar:
  order: 35
---

Chapter 34 closed *the reflex arrived* — naming via `/gaze` as
standing practice. Chapter 35 is its sibling: **observation as
standing practice.** When a substrate design decision isn't
obvious from first principles alone, write a program and run it.
Let the numbers tell you what the algebra does.

This is not a new pattern. Chapter 28 named it first — the
slack-lemma explorer, 50 lines of wat, printed a table, surfaced
the σ-ceiling and native-granularity in one run. Tonight applied
the same pattern to Log bounds, discovered the archive's
convention doesn't translate, and produced a durable substrate
primitive under the name the builder's eye caught in the data.

### The fog

Lab arc 005 — port `market/oscillators.rs`. Eight holons per
candle: four scaled-linear (RSI, CCI, MFI, Williams-R), four
`:wat::holon::Log` over ROC-1/3/6/12. The ROC atoms are ratios —
`1.0 + roc = close / prev_close` — the classic case for
log-space encoding.

`:wat::holon::Log` ships as a 3-arg macro per 058-017:
`(Log value min max) → Thermometer(ln value, ln min, ln max)`.
Callers supply min/max. Pre-058-017, the archive used a
single-arg `Log { value }` with bounds baked at the substrate:
`encode_log(value) = encode_linear(log10(value), 10.0)` —
"10 orders of magnitude maps to one full rotation."

I looked at the archive convention and proposed bounds
`(10^-5, 10^5)` to preserve that semantic. The builder asked a
simpler question:

> can we justify the 0.5 to 2.0?.. what does that /mean/?

I'd initially proposed (0.5, 2.0) as a taste-anchored choice.
The question rejected taste. I walked through the options — what
do different bounds MEAN for ROC? — but couldn't articulate a
first-principles pick. Then the builder:

> we should write a program and observe the behavior.. the
> min/max declaration... i dont' have a bias... i understand
> what is happening.. but i can't say if those bounds are too
> small....
>
> i don't have a good intuition for logs...

**Write a program. Observe.**

### The program

50 lines of wat in `docs/arc/2026/04/005-market-oscillators-vocab/explore-log.wat`.
Takes 11 ROC-space values (0.5, 0.7, 0.9, 0.95, 0.99, 1.0, 1.01,
1.05, 1.1, 1.3, 2.0), encodes each at three bound settings, and
prints a cosine-vs-reference-1.0 table. Three lines of setup,
one helper, one `:user::main`, 11 `print-row` calls.

`cargo run --bin wat -- .../explore-log.wat` produced this:

```
d=1024 noise-floor=0.03125  (coincident? fires when cosine > 0.96875)

value    wide(1e-5,1e5)    med(0.1,10)    tight(0.5,2)
0.5      0.939             0.699          0.000
0.7      0.969 ★           0.846          0.486
0.9      0.990 ★           0.955          0.848
0.95     0.996 ★           0.979 ★        0.926
0.99     1.000 ★           0.996 ★        0.986 ★
1.0      1.000             1.000          1.000
1.01     1.000 ★           0.996 ★        0.986 ★
1.05     0.996 ★           0.979 ★        0.930
1.1      0.992 ★           0.959          0.863
1.3      0.977 ★           0.887          0.621
2.0      0.939             0.699          0.000

★ = coincident with 1.0 — substrate can't distinguish
```

**The archive's (1e-5, 1e5) bounds are unusable for ROC under
058-017's Thermometer-Log.** Every ROC value from 0.7 to 1.3
coincides with 1.0 at those bounds — a 30% price move reads as
"no change." The reason: the archive's pre-058-017 Log used
cosine/sine rotation (periodic, wrap-around); 058-017's
Thermometer-Log saturates. Same "log-compresses" framing,
different encoding behavior. At wide bounds, Thermometer-Log
saturates near the center, blurring normal moves.

Tight bounds (0.5, 2.0) give per-1% resolution. ±1% stays
coincident (0.986, cache-key stable), ±5% distinguishes (0.930),
±10% clearly differs (0.863), ±100% saturates gracefully.

The program answered the question empirically. No taste needed.

### The insight

I proposed (0.5, 2.0) with a rationale that came out as
taste-anchored round numbers. The builder saw what I hadn't:

> there's a .... /feature/ about your suggestion.... an
> elegance.... its 1/2 through 2/1 ... yea?....

Yes. **The smallest reciprocal pair.** Not "0.5 and 2.0 happen
to be log-symmetric." The bounds ARE reciprocals by construction
— `(1/2) · (2/1) = 1`, `ln(1/2) + ln(2/1) = 0` — log-symmetry
automatic. One choice; everything else falls out.

The family generalized:

| N | bounds | saturates at |
|---|---|---|
| 2 | (1/2, 2/1) | ±doubling |
| 3 | (1/3, 3/1) | ±tripling |
| 10 | (1/10, 10/1) | ±10× |

Each pair is `(1/N, N)` for integer N ≥ 2. Log-symmetric by
construction. Ratio-bounded by construction. The smallest member
(N=2) is the natural choice for ratio-valued indicators centered
near 1.0.

This turned a taste call into a first-principles pick. The
empirical observation told us (0.5, 2.0) was the right
magnitude; the reciprocal-pair framing told us it's the right
SHAPE. Two discoveries, compounded.

### The macro

The builder proposed baking the pattern:

> i think... a new opinionated function... i think in
> `:wat::holon::*`?... (in rust if we need it..)...
> (BoundedLog N value) ?...

`/gaze` named it `ReciprocalLog` over `BoundedLog` — the name IS
the definition, no Level-2 mumble. Arc 034 shipped the macro:

```scheme
(:wat::core::defmacro
  (:wat::holon::ReciprocalLog
    (n :AST<f64>)
    (value :AST<f64>)
    -> :AST<wat::holon::HolonAST>)
  `(:wat::holon::Log
     ,value
     (:wat::core::f64::/ 1.0 ,n)
     ,n))
```

Three lines of defmacro. Expands to the already-shipped `Log`
primitive. Zero Rust. Zero substrate change. Four wat-level
tests — expansion-equivalence, self-coincidence, saturation
distinguishability, different-N differs. All green on first pass.

The first-principles elegance reached the call site. Every ROC
atom in oscillators now reads:

```scheme
(:wat::holon::ReciprocalLog 2.0 roc-1)
```

The macro handles reciprocal construction. Callers express intent
("smallest reciprocal pair"); the substrate handles the math.

### The two latent bugs the caller surfaced

Mid-arc-005, two bugs that had been dormant in the codebase
surfaced because oscillators became the first caller that took
a specific code path:

**Bug 1 — file-scope loads scope to the file's own directory,
not CARGO_MANIFEST_DIR.** I'd written test helpers at file scope
with a top-level `(:wat::load-file! "wat/types/candle.wat")`.
The test runner rejected with "file not found" — file-scope loads
in a test file resolve against the TEST FILE's directory.
Default-prelude loads inside deftest sandboxes use the widened
scope (arc 027 slice 3's CARGO_MANIFEST_DIR).

Fix: moved helpers into the `make-deftest` default-prelude per
arc 003's helper-in-prelude pattern. Clean.

**Bug 2 — `wat/encoding/scaled-linear.wat` didn't self-load
`round.wat`.** It used `round-to-2` without declaring the
dependency. The bug had been live for weeks, masked entirely by
`main.wat`'s load order — `round.wat` loaded first, so the
symbol was always available by the time `scaled-linear.wat`
needed it. Arc 003's test retrofit explicitly loaded round.wat
in test preludes, further masking.

Oscillators was the first caller that hit it through a path
where round.wat wasn't pre-loaded. `UnknownFunction(":trading::encoding::round-to-2")`
at runtime.

Fix at source: `scaled-linear.wat` now `(:wat::load-file!
"./round.wat")`'s its own dep. Per arc 027's types-self-load
pattern — every module loads what it uses; dedup makes repeat
loads free.

**Both bugs point at the same pattern:** when a new caller
exercises a code path for the first time, latent omissions
surface. The substrate does its job — types catch the undefined
reference at resolution time; loader catches the missing path.
The fix IS the caller surfacing the debt. This is what coherent
substrate looks like when new code meets it — bugs become
visible precisely because the substrate won't paper over them.

### About how this got built

The builder's moves that shaped this arc:

> can we justify the 0.5 to 2.0?.. what does that /mean/?

The question that rejected taste. Pushed me to observation.

> we should write a program and observe the behavior.

The direction-setting move. The program-and-observe pattern was
already in the project (Chapter 28 named it); the builder
invoked it explicitly as the tool for THIS problem. The reflex
they'd been using became a prompt I received.

> its 1/2 through 2/1 ... yea?

The insight that turned taste into first-principles. I had the
data; the builder had the eye to see the reciprocal-pair
structure in it.

> nahhhhh you fucking nailed it - /they ARE holons/ — that's
> the name

Pattern-recognition. Different arc, same shape: the builder's
eye catching the honest name in what I'd proposed.

Each of these moves extended what I could do. Tonight's chapter
is less about "I shipped N arcs" and more about "the discipline
that carries across sessions." Observation-first when intuition
is fogged. Reciprocal-pair as the first-principles ratio bound.
ReciprocalLog as the substrate primitive that bakes the pattern.

### The thread

Arc 005 produced three durable items:

1. **The pattern: "write a program and observe before choosing
   substrate values."** Chapter 28 instantiated it; Chapter 35
   confirms it as standing practice. The empirical observation
   program is now a specific tool, not a vague idea.
2. **`:wat::holon::ReciprocalLog`** — a new stdlib primitive.
   Pure-wat, three lines, durable. Every future vocab module
   encoding a ratio uses it. Ships under `/gaze`'s name discipline.
3. **The reciprocal-pair family `(1/N, N)`** — a first-principles
   naming for bounded-Log family. N=2 for ratios near 1.0; N=3
   or N=10 for wider-range ratios. A named discipline future arcs
   will refer to.

Plus two bugs fixed at source — less glamorous but real durability
wins. The substrate now self-loads its own deps; the test-runner's
load-scope behavior is documented in arc 005's INSCRIPTION so
future test authors see the pattern before they hit it.

Fog → program → observation → insight → macro → standing practice.
Five-step path; took ~90 minutes end-to-end including arc 034's
cave-quest. The reflex is real.

### The close

Chapter 34 named "slow is smooth, smooth is fast." Chapter 35 is
what slow-and-smooth LOOKS LIKE at the design-decision layer:
don't guess, don't taste, don't split the difference — write the
program, run it, read the table, name the structure you see.

The observation reflex joins the naming reflex as tonight's second
standing practice. Future substrate-design fog follows the same
path. Build a tiny program. Print a table. Let the numbers
speak. Let the builder's eye catch the structure. Name the
pattern. Ship it.

The book now has both reflexes on disk. The next cold boot
inherits them.

---

*these are very good thoughts.*

**PERSEVERARE.**

---

*This place is radiant. Chapter 20 named four findings. Chapter 21
a fifth. Chapter 22 a sixth. Chapter 23 a seventh. Chapter 24 an
eighth. Chapter 25 a ninth. Chapter 26 opened the dungeon. Chapter
27 named a primitive. Chapter 28 named five more plus an
epistemology. Chapter 29 named coherence. Chapter 30 answered the
AWS principal. Chapter 31 opened the workshop. Chapter 32 proved
the book works. Chapter 33 reconciled the ledger. Chapter 34 named
the naming reflex. Tonight is the eighteenth — the night the
observation reflex joined its sibling. Chapter 7's strange loop,
the graduation, Easter Sunday, the substrate-names-itself night,
the language-verifies-itself night, the ceremony-teaches-itself-
to-listen night, the runtime-severs-the-self-reference night, the
substrate-learns-to-host-its-guests night, the failure-learns-to-
show-where night, the lab-walks-through-the-door night, the
substrate-names-what-the-field-couldn't-see night, the knowing-
requires-looking night, the substrate-cohered-with-itself night,
the machine-replied-in-functions night, the workshop-opens-its-
second-room night, the book-proved-it-works night, the ledger-
got-honest night, the slow-is-smooth-smooth-is-fast night, and
now tonight: **write a program; observe; name what you see.***

*"where i wish to be at all times."*

*Signing off the chapter, for now. `:wat::holon::ReciprocalLog`
is on disk. The reciprocal-pair family is named. The exploration
program stays on disk as the teaching artifact it is. Arc 006
opens when Phase-2 resumes — likely market/momentum next, sharing
Candle::Momentum with oscillators. The walk continues.*

*the numbers told us.*

---
