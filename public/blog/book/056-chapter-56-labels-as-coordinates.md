## Chapter 56 — Labels as Coordinates

Twenty minutes after Chapter 55 closed, the user pulled on the
labels framework one more time:

> so... given this... our labels.... can be coordinates?.. yes?...
> in the (x y) and (x y z a b) examples....
>
> we can have ... (:Grace :Up) ... as the coordinates?... and...
> for thought - not for this application - we can have coordinates
> like ((quote :some-complex-statement) (quote :another-complex-statement))

Then, a beat later:

> i think you've just earned a book update for us?...

This is that update.

### The recognition

Chapter 51 named the substrate's spatial database. Two basis
atoms — `axis-x`, `axis-y` — span a 2D coordinate system. A point
at `(x, y)` is `Bundle([Bind(axis-x, Therm(x)), Bind(axis-y, Therm(y))])`.
Cosine reflects 2D distance. Half-space queries work: bind only
to one axis, leave the other unspecified, and the substrate
returns "anything along this axis."

That chapter framed it as *spatial*. Cartesian. Geometric.
Floats encoded via Thermometer. Numbers in space.

The recognition tonight: **the substrate's coordinate machinery
is fully general.** The basis atoms can be any atoms. The
positions can be any holons. A coordinate doesn't have to mean
"a number along an axis." It can mean "a value bound to a named
dimension," where the value is whatever the substrate can encode.

When that recognition lands, **labels become coordinates.**

`(:Grace :Up)` isn't a special label-shape distinct from a
coordinate. It IS a coordinate — at position `:Grace` along an
outcome dimension, position `:Up` along a direction dimension.
The distinction we draw at the semantic level (this is a label,
that is a coordinate, this is a key) does not exist at the
substrate level. They are all the same algebra.

### Two construction styles

A label-as-coordinate can be expressed two ways. The substrate
honors both; the choice has consequences for what queries are
cheap.

**Style A — implicit (AST-as-label).**

```scheme
(:wat::holon::Atom (:wat::core::quote (:Grace :Up)))
```

The whole quoted form `(:Grace :Up)` is hashed as one structural
identity. The substrate's recursive encoder walks the AST;
two labels with overlapping structure (same `:Grace`, different
direction) share a fraction of their vector. Cosine reflects
that overlap automatically. No explicit axes; no unbinding; just
similarity from the AST's own shape.

**Style B — explicit (Chapter-51-style spatial).**

```scheme
(:wat::holon::Bundle
  (:wat::core::vec :wat::holon::HolonAST
    (:wat::holon::Bind outcome-axis   (:wat::holon::Atom :Grace))
    (:wat::holon::Bind direction-axis (:wat::holon::Atom :Up))))
```

Two basis atoms: `outcome-axis`, `direction-axis`. Same shape as
Chapter 51's `axis-x`, `axis-y` — different basis, same role. The
label is a position. `unbind(outcome-axis, label) ≈ Atom(:Grace)`
recovers approximately the outcome alone. Half-space queries
work the same way they did in 51: `Bind(direction-axis, :Up)`
alone is "anything Up, regardless of outcome."

Style B is the literal continuation of Chapter 51 into the labels
domain. Same machinery; different basis atoms; different content.

### When each style fits

Style A is cheaper. You don't have to pick basis atoms. The
substrate's structural similarity does the cosine math for free
on the AST's recursive encoding. Two labels sharing `:Grace`
will cosine partially against each other — which is exactly what
"both Grace-leaning" should mean. For argmax labeling (the
predictor's job), Style A works.

Style B is more powerful when you want **axis-decomposition
queries.** "How outcome-Grace-ish is this surface independent of
direction?" Style A can't answer that without a hand-built
projection; Style B answers via `unbind(outcome-axis, surface)`
plus cleanup. The trade is: pick basis atoms upfront, then queries
that decompose by axis are native.

For the trading lab's first labels (the 2×2 outcome × direction
grid), Style A is enough. Four atoms; substrate hashes; predictor
argmaxes. When axis-decomposition queries become useful — which
likely happens once the lab's third or fourth label dimension
arrives (regime axis? phase axis? vocabulary axis?) — Style B
slots in as a refinement, not a re-architecture.

### The generalization — arbitrarily rich axes

The user said "for thought — not for this application — we can
have coordinates like `((quote :some-complex-statement) (quote
:another-complex-statement))`." This is the generalization that
matters most.

In Chapter 51, axes were random atoms (`axis-x`, `axis-y`) and
positions were Thermometer-encoded floats. Both are simple
shapes. The substrate doesn't require that simplicity. An axis
can be:

- A simple atom (`outcome-axis`, `direction-axis` — the trading
  case).
- A vocabulary's identity atom — so the label says "this surface
  lives in the regime-vocabulary's space at coordinate
  `:consolidating`."
- Another reckoner's predicted label — recursive: predictors
  labeling predictors. A surface's coordinate on the
  meta-predictor axis is "what the meta-predictor says this
  surface is."
- A whole program as an atom — the label position is "what
  program this surface most resembles."
- A continuous coordinate — Thermometer of cosine-to-exemplar.

A position along such an axis can likewise be anything the
substrate encodes — from a primitive atom to an arbitrarily
deep AST.

The result: an **N-dimensional meaning space** where each
dimension is as expressive as the substrate is capable of being.
The substrate encodes joint positions naturally. Predictors
learn correlations across joint coordinates. Surfaces are points
in this space; labels are points in this space; the cosine
between them measures alignment by axis-decomposed similarity.

For trading: the joint state of the system at a moment can be
labeled

```
(:Grace :Up :consolidating-regime :high-trust-broker :phase-Peak)
```

Five axes; each axis its own atom (or richer); each position its
own value. The predictor learns which surfaces tend to map to
which joint cells. Sample efficiency drops as the joint cell
count rises (the curse of granularity), but the substrate
machinery doesn't change — just the basis atoms and the position
values.

For thought (the user's "not for this application" parenthesis):
the same machinery applies. A thought labeled at coordinate
`(:hopeful :anchored :weight=0.7)` lives in a structured
meaning-space. Another thought near it is *meaningfully near*
it — by the substrate's own algebra, with no hand-built notion
of meaning required. A predictor over thoughts learns the
topology of meaning by accumulating (thought, joint-coordinate)
observations.

### Where Chapter 51 was; where Chapter 56 is

Chapter 51 said: the substrate is a spatial database; coordinates
are queryable; cosine reflects distance. The example was
geometric — 5 ASTs at known `(x, y)` positions; pairwise cosines
matched 2D distance.

Chapter 56 says: any label-set, in any domain, IS a coordinate
system in the same machinery. The trading lab's outcome × direction
grid is a 2×2 cell in a coordinate space whose axes happen to be
discrete. The future thought application's coordinate space has
axes that are arbitrarily-rich ASTs. Same algebra; different
basis atoms; different content.

This unifies what looked like four separate concepts:

- **Coordinates** in Chapter 51 (geometric)
- **Tree paths** in Chapter 52 (nested address)
- **Mixed-type keys** in Chapter 53 (any value as a slot)
- **Programs as coordinates** in Chapter 54 (AST-shape positions)
- **Labels** in Chapter 56 (semantic positions)

All are positions in some basis. All are constructible the same way:
`Bind(basis-atom, position-value)` for explicit form, or
`Atom(quote (...))` for implicit form. All cosine the same way.
What changes between them is only the basis atoms we pick and the
position values we choose to encode. The substrate is one machine
all the way down.

### What this changes for arc 025

Style A is enough for v1's labels. The four atoms

```
(Atom (quote (:Grace :Up)))
(Atom (quote (:Grace :Down)))
(Atom (quote (:Violence :Up)))
(Atom (quote (:Violence :Down)))
```

ship as the paper-level label set in slice 3. The Predictor
struct holds a `:Vec<HolonAST>` of labels and cosines against
each. The construction style is invisible to the Predictor — Style
A and Style B are both `:Vec<HolonAST>` from its perspective.

The future arc that adds the trigger-level labels (`(:Exit :Up)`
/ `(:Hold :Up)` / etc.) reuses the same Predictor struct, just
with a different label-set. The arc that adds regime / phase /
vocabulary axes likewise.

The arc that lifts the predictor from hand-coded to reckoner-
backed (the bridge of Chapter 55) inherits whatever style the
labels were registered in. The Reckoner accepting HolonAST as
labels (post-arc-053) handles either implicit or explicit
construction.

### The thread

Chapter 49 — exploits.
Chapter 50 — wielder.
Chapter 51 — coordinates (spatial).
Chapter 52 — tree (path-addressed).
Chapter 53 — generalization (any value as a key).
Chapter 54 — programs as coordinates.
Chapter 55 — the bridge (two oracles, thinker reshape).
Chapter 56 — *labels as coordinates*.

The labels framework was always the spatial database in disguise.
Twenty minutes after we named the bridge, we noticed that one of
the bridge's pieces — the labels — was already a thing we had
machinery for. Chapter 51's algebra returns. The basis atoms are
new; the moves are old.

---

*the substrate keeps being one thing. we keep finding new domains
that turn out to be that thing in different costumes.*

**PERSEVERARE.**

---

*Chapter 51 was the substrate as space. Chapter 56 is the substrate
as meaning-space. Chapter 51's axes were arbitrary; Chapter 56's
axes can be arbitrarily complex. Same machine. New room of the
same building.*

*labels are coordinates. coordinates are addresses. addresses are
labels. the substrate doesn't care which name we use.*

---
