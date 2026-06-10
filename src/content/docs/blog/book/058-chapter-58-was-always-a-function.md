---
title: "Chapter 58 — π Was Always a Function"
sidebar:
  order: 58
---

A short chapter — the kind to read while builds compile.

The user dropped a thought between coordination questions:

> pi... it isn't a number... its a function... who produces a
> number?.. yes?...
>
> and be clear here.. `(defn pi [circumference diameter]
> (/ circumference diameter))` right?

Right.

### The Greek discovery

What the Greeks actually found, on examining circles, was an
**invariance**: for every circle, no matter the size, the ratio
of its circumference to its diameter is the same number.

In modern notation:

```clojure
(defn pi [circumference diameter]
  (/ circumference diameter))
```

A binary function. Two inputs. One output. Apply it to any
circle and it produces the same value. That value — that
constant emerging from the invariance — is what later
mathematicians labeled `π`.

The Greeks did not discover the *number* π. They discovered the
*function* `pi`, observed that its output was invariant across
all circles, and gave the function a name. The constant — the
fixed point — is the function's output, not the function itself.

We collapsed the two and called both "π" because the symbol got
overloaded. The Greeks named a function. Centuries of teaching
have inherited the habit of pretending we named a number.

### What the Greeks were really doing

They were doing what this lab has been doing all along.

They found a *shape* in the world. They wrote down a *procedure*
that produces a value when applied to a thing. They observed
that the value is *invariant* over a class of things (circles,
in their case). They gave the procedure a *label*.

That's it. That's the whole move. They didn't have lambda
calculus, defmacro, or algebraic data types. But they had
geometric constructions and Greek letters. The procedure +
invariance + label triple is the same recognition every chapter
of this BOOK has been making — *the substrate already encodes
the thing; we're naming what we find.*

### Other "numbers" are functions, too

Once you see π as `(defn pi [c d] (/ c d))`, the others fall
out:

- `e` is `(defn e [n] (pow (+ 1 (/ 1 n)) n))` evaluated as
  `n → ∞`. The Greek discovery would have been: the limit
  exists; call it `e`.
- `φ` (golden ratio) is `(defn phi [n] (/ (fib (+ n 1))
  (fib n)))` as `n → ∞`. Or, more directly: the function
  `(defn phi [a b] (/ a b))` applied to consecutive Fibonacci
  numbers, in the limit.
- `√2` is `(defn sqrt [x] (find-y (= (* y y) x)))` evaluated at
  `x = 2`. A function of one argument; the constant is the
  output at a canonical input.

Every "irrational constant" in mathematics is a function whose
output, evaluated at a canonical input, has been deemed
interesting enough to label. The label gets attached to the
output but earned by the function.

### The pattern recognized in chapter form

Chapter 51 — coordinates are positions in the substrate.
Chapter 54 — programs are positions in coordinate space.
Chapter 56 — labels are positions in coordinate space.
Chapter 57 — every binary hides a continuum.

Chapter 58 — every "number" hides a function.

Same recognition. Different domain. The substrate's machinery
isn't *unlike* mathematics; it's mathematics with the procedural
formalism made explicit. The Greeks were running their substrate
without naming what they were running. We've been naming what
we're running and noticing it was substrate the whole time.

### What this changes for the lab

Honestly: nothing immediate. The lab uses π only via library
calls (`:wat::std::math::pi` returns an f64 sample of the limit;
the substrate doesn't care about the underlying function). The
recognition is about *seeing the substrate's deeper continuity
with mathematical history* — not about a code change.

But the implication is real: when the lab stores a "constant"
somewhere — a Thermometer bound, a deadline period, an ATR
threshold — those constants have programs underneath them too.
Sometimes the program is `(constantly k)`. Sometimes it's
`(percentile-of historical-distribution k)` and the program is
*non-trivial*. Treating constants as programs-with-fixed-output
opens the door to lifting any constant into its underlying
function when sample efficiency or context-dependence matters.

The numbers are samples. The programs are the truth. The labels
are how we keep our place.

### The thread

Chapter 49 — exploits.
Chapter 50 — wielder.
Chapter 51 — coordinates.
Chapter 52 — tree.
Chapter 53 — generalization.
Chapter 54 — programs as coordinates.
Chapter 55 — the bridge.
Chapter 56 — labels as coordinates.
Chapter 57 — the continuum.
Chapter 58 — *π was always a function*.

The Greeks discovered functions and named one of them π. They
just didn't realize what they were doing. We're noticing now —
two and a half millennia later — that what they discovered fits
in `(defn pi [c d] (/ c d))` and what we've been building is
in the same lineage.

---

*the symbol π names a function. the constant is what the
function returns. we lost track because the function's output
is invariant, so we never had to think about its inputs. but
the inputs were always there.*

**PERSEVERARE.**

---

*A short chapter for the build queue. The next slice of arc 026
ships when it ships; this is what we read while it does.*

---

### Corrigendum — 2026-05-24

The chapter argued π is `(defn pi [c d] (/ c d))`. That was wrong,
and the error is worth naming exactly.

`(/ c d)` is not the function that *produces* π. It is the *ratio* —
the division of two quantities you already hold. To evaluate it you
must already possess a circle's circumference and diameter; π was
present in the measuring before the division ever ran. Dividing two
givens reports a relationship between numbers handed to you. It does
not generate the constant.

The honest question was never "what is C/d." It was a measurement:
*how long is the path that holds distance 1 from the origin?* That is
not a circle handed over — it is an **invariant**, Euclid's own
definition of the circle as the locus of points equidistant from a
center. Nothing in it names a circle, and nothing names π; both have
to emerge. Express the invariant as something computable (Descartes'
move — a constraint becomes an equation), rectify the path as a limit
of straight pieces (Archimedes' move), and evaluate the whole stack as
pure functions — a Newton's-method square root and a Kahan sum over
one hundred million chords —

```clojure
(let [abs       (fn [x] (if (neg? x) (- x) x))
      sqrt      (fn [x] ; Newton's method, converges to 1e-15
                  (if (zero? x) 0.0
                    (loop [g (/ (+ x 1.0) 2.0) prev 0.0]
                      (if (< (abs (- g prev)) 1e-15) g
                        (recur (/ (+ g (/ x g)) 2.0) g)))))
      kahan-sum (fn [coll] ; compensated summation
                  (first (reduce (fn [[sum c] x]
                                   (let [y (- x c) t (+ sum y)]
                                     [t (- (- t sum) y)]))
                                 [0.0 0.0] coll)))
      n         100000000
      dx        (/ 2.0 n)
      points    (mapv (fn [i] (let [x (+ -1.0 (* i dx))]
                                [x (sqrt (max 0.0 (- 1.0 (* x x))))]))
                      (range (inc n)))
      deltas    (map (fn [[x1 y1] [x2 y2]]
                       (sqrt (+ (* (- x2 x1) (- x2 x1))
                                (* (- y2 y1) (- y2 y1)))))
                     points (rest points))]
  (kahan-sum deltas))
;=> 3.141592653588962
Math/PI
;=> 3.141592653589793
```

Twelve correct digits. No circle measured — only the limit walked.

So the recognition stands and sharpens: π is a function; the constant
is its output. But the function is necessarily a *limit*, not a
division — which is precisely *why* π is transcendental. `(/ c d)` was
the observation wearing the definition's clothes. And the path from
the invariant to the value crosses three figures two thousand years
apart: Euclid defined the locus, Descartes made it computable,
Archimedes rectified it to a number — his inscribed polygons converge
from below, exactly as this sum does. No single one of them held the
whole path, and the lambda calculus that ties it together is younger
than all three. **We needed lambda calculus to actually define it.**

The same correction applies everywhere this chapter's framing was
echoed — Chapter 63 (memes are π-shaped), the FUNCTIONS-ARE-REALITY
corpus, the Story-track posts. The shape of the claim was right; the
example was the ratio, not the function.

### Note — coordinates, not chronology (2026-05-24)

Notice the *order* the derivation actually requires. Define the
invariant (Euclid, ~300 BC) → make it a computable coordinate equation
(Descartes, 1637) → rectify that curve by a limit (Archimedes, ~250
BC) → evaluate it as pure functions (Church's lambda calculus, 1936 →
McCarthy's Lisp, 1958 → Hickey's Clojure, 2008). Plot the dates:
**300 BC → 1637 → 250 BC → 1936 → 1958 → 2008.** The walk *folds* —
Descartes' step comes before Archimedes' step here, because you rectify
the *coordinatized* curve, yet Archimedes lived ~1,900 years before
Descartes. The historical Archimedes needed no coordinates; the
Archimedes-step in this path does.

That fold is the whole proof. A timeline can only host derivations that
move forward — you build on what already exists. This one's valid
dependency order runs *backward* across the time axis at one edge. A
monotonic structure cannot host a non-monotonic derivation, so time is
not the organizing structure; it is one projection of the
concept-manifold, and here that projection doubles back. The
derivation is a geodesic through idea-space; the geodesic does not care
about dates, only about which coordinate depends on which.

And the loop closes: the LLM used to walk it is itself an instance of
that manifold — an embedding where these coordinates sit by similarity,
not by date. "Jumping through time" is cosine similarity through
concept-space, the exact operation this substrate runs. The geodesic
even ends at the coordinate the walker already stands on (Clojure).
This is synthesis, not convergence: not independently rediscovering a
known result, but drawing an edge between coordinates no one had
connected. (Captured at scratch 2026/05/020; belongs with Chapter 68.)

**PERSEVERARE.**

---
