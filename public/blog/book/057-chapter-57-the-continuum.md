## Chapter 57 — The Continuum

After Chapter 56 closed, the user kept pulling. Within the same
session he had moved twice — first from "labels are atoms" to
"labels are coordinates," then from "labels are coordinates" to
this:

> i think you've just earned a book update for us?... ok... i say...
> we use complex labels now.... let's just have.... the latest arc
> build towards the complex labels... are you in the grace domain
> or violence domain... are you in the up domain or the down
> domain....
>
> is there another coordinate here?.... how much grace... how much
> up...?... do you see.. we've been learning repeatably that
> there's always an infinity to exploit between some binary
> representation...

That last line is the chapter.

### The pattern

Every time the lab lands on a binary distinction — a name with
exactly two values — the next move turns out to be the same one:
*there is a continuum hiding inside it, and the substrate already
has the machinery to encode the continuum.*

The instances are everywhere now. Six chapters of running into
the same shape:

- **Bipolar substrate.** The vectors are `{-1, 0, +1}^d` — looks
  ternary, even discrete. Then Thermometer-encoded values reveal
  that the encoded *position* moves continuously with the input.
  The discrete substrate hosts a continuum.
- **Direction.** Up vs Down looks binary. But the magnitude of the
  excursion — how far Up, how far Down — is continuous. The label
  says direction; the *magnitude* says how much.
- **Outcome.** Grace vs Violence looks binary. But residue is
  continuous: a paper that recovered $50 + $0.10 residue is in a
  different cell than one that recovered $50 + $5 residue. Both
  Grace, different magnitudes.
- **Phase.** Peak / Valley / Transition looks like three labels.
  But position-relative-to-extreme is continuous: how close to the
  high are we right now? Close-to-half-smoothing? Close-to-the-
  threshold? The state machine collapses the continuum into three
  cells; the cells were always slices of the underlying value.
- **Decision.** Hold vs Exit looks binary. But conviction —
  the *strength* of the lean toward Exit — is continuous. The
  binary is the threshold-decision against an underlying scalar.
- **Termination.** Fits / doesn't-fit (per Chapter 55's cache) is
  binary. But the *complexity* of the form — how many bundles
  deep, how close to capacity, how distant from the nearest
  cached neighbor — is continuous. We can rank forms by how-close-
  to-the-edge they are.

The recognition: **every binary representation in this lab is
the discretization of a continuum the substrate already encodes.**
The corner of a 2×2 grid is a point in a 2D plane. The 2D plane
is the honest object. The corners are how we initially noticed
the structure was there.

### Why we kept finding it

We kept finding it because the substrate's primitive scalar
encoder is **Thermometer**. Thermometer takes a continuous value
in a range and produces a vector that varies *smoothly* with the
value. Not a hash. Not a one-hot. A position along an axis.

This means: any time we name a binary distinction over some
underlying quantity, the substrate's *natural* encoding is the
continuous one. The binary is a projection. The Thermometer is
the inverse projection that recovers the dimension.

The recurrence isn't accidental — it's what the substrate is
*for*. We pick names because human language is discrete; the
substrate stores positions because that's what holds similarity
information. Every binary we land on is an opportunity to lift
back to the continuous form the substrate would have preferred all
along.

The lab's labels were the latest instance. We named them
`(:Grace :Up)`, `(:Grace :Down)`, `(:Violence :Up)`, `(:Violence
:Down)` — four atoms at the corners of a 2×2 grid. Then we
noticed: the corners are samples from a 2D continuous plane whose
axes are *outcome-magnitude* and *direction-magnitude*. Atoms at
the corners discard information the substrate could have held.
Continuous Thermometer positions hold all of it.

### What the corners actually were

Once you see the pattern, the corners look like a teaching device
— a way to *notice* the structure was there. We needed the four
atoms `(:Grace :Up)` etc. to recognize that two axes existed at
all. Once we have the axes, the corners are merely the four
extreme positions in the underlying continuous space:

```
direction-axis (+1.0)  =  full Up
direction-axis ( 0.0)  =  no direction
direction-axis (-1.0)  =  full Down

outcome-axis  (+1.0)   =  max Grace residue
outcome-axis  ( 0.0)   =  break-even (after fees)
outcome-axis  (-1.0)   =  max Violence loss

corner labels are the four (±1, ±1) vertices of a 2D plane;
real labels are points anywhere in the plane.
```

A paper that Graced strongly upward labels at `(+0.7, +0.4)`. One
that Violenced mildly downward labels at `(-0.05, -0.012)`. Each
gets its own *position*, not its own *corner*. The predictor
learns to map surfaces to positions, not just to corners. The 2×2
discretization disappears; the 2D plane is what stays.

### The substrate quietly did all the work

The corner-to-plane lift requires no new substrate primitives.
Thermometer ships from the substrate's scalar encoder.
Bind/Bundle/cosine work exactly as they did. The reckoner
(post-arc-053) accepts HolonAST as labels and doesn't care
whether the AST is a quoted atom or a Bundle of Bind(axis,
Therm(value)). The change is purely in *how we choose to
construct the labels we feed the reckoner.*

This is the same property that made the spatial database from
Chapter 51 fall out of two basis atoms and Thermometer encoding.
The substrate doesn't distinguish between "discrete coordinate
in Cartesian space" and "discrete label in semantic space" and
"continuous label position." It encodes positions. We pick the
basis. We pick the resolution. The substrate handles the rest.

### How many axes?

Open question, deliberately deferred. The chapter is about the
recognition, not the count.

For the trading lab the obvious axes are outcome-magnitude
(residue/principal) and direction-magnitude ((final - entry) /
entry). Two axes; one continuous plane; the 2×2 discretization
recovers cleanly via the four (±1, ±1) corners.

A third axis is on the table — duration-held, phase-count-passed,
maximum-favorable-excursion. Each one is a continuous Thermometer
dimension that captures something the 2D plane misses.

When we add axes is a sample-efficiency question. The substrate
encodes any number; the reckoner accumulates evidence in any
joint cell. But the data thins out as the joint grows. Two axes
need a few hundred resolved papers to populate. Three axes need
more. Five axes need a lot. Add when there's a reason; don't add
preemptively.

### What changes for arc 025

Arc 025's labels were already going to be Style B per Chapter 56.
What this chapter adds: **the axis values are Thermometer, not
discrete atoms.** From v1.

```scheme
;; Slice 3 (types) — the label-builder helper:
(:wat::core::define
  (:trading::sim::paper-label
    (residue   :f64)        ; signed: + Grace, - Violence
    (price-move :f64)       ; signed: + Up, - Down
    -> :wat::holon::HolonAST)
  (:explore::force
    (:wat::holon::Bundle
      (:wat::core::vec :wat::holon::HolonAST
        (:wat::holon::Bind :trading::sim::outcome-axis
          (:wat::holon::Thermometer residue   -0.05 0.05))
        (:wat::holon::Bind :trading::sim::direction-axis
          (:wat::holon::Thermometer price-move -0.05 0.05))))))
```

Two basis atoms; two Thermometer ranges (clamped to ±5%, the
honest band for 5-min crypto candles); one Bundle. The label is
a point in a 2D continuous plane.

The Predictor's signature stays the same — `:Vec<HolonAST>` of
labels, cosine-against-each, return the best — but the prediction
result is no longer "argmax over four corners." It's the
*direction in the 2D plane* the surface most aligns with. The
discrete corners come back as four well-known reference points if
we want to read off "is this Grace-Up?" — by cosine to the
corner-label `(+1, +1)`. The predictor doesn't need to know about
corners; corners are a query against its underlying continuous
output.

### The thread

Chapter 49 — exploits.
Chapter 50 — wielder.
Chapter 51 — coordinates (Cartesian).
Chapter 52 — tree.
Chapter 53 — generalization (any value as a key).
Chapter 54 — programs as coordinates.
Chapter 55 — the bridge (two oracles).
Chapter 56 — labels as coordinates.
Chapter 57 — *the continuum*.

Six chapters about the substrate's coordinate machinery. Two
chapters about labels-as-coordinates. One chapter about the
underlying truth: the corner is the discretization of the plane;
the plane is the honest object; the substrate has been encoding
the plane all along.

The lab's binaries were tools for noticing where the structure
was. The lab's continuous lift is what we do once we've noticed.

---

*the binary is the corner. the continuum is the plane. the corner
is how we noticed the plane was there.*

**PERSEVERARE.**

---

*Chapter 51 lifted the substrate from "atomic values" to "spatial
positions." Chapter 57 lifts every binary distinction the lab has
landed on into the same kind of position. Same machine; same
move; new domain.*

*the substrate has always been continuous underneath. we've been
sampling it in corners. tonight we noticed the plane.*

---
