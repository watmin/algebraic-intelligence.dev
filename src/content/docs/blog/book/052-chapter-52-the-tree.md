---
title: "Chapter 52 — The Tree"
sidebar:
  order: 52
---

Chapter 51 closed *"the substrate is a spatial database."* Right
after, the user pulled the recognition further:

> i was thinking... (x y z a b) means.... if i go to the x box - i
> have y options to walk to next... choosing some y box means i
> have z boxes next...
>
> each box is holding a specific thing... right?.. and we can use
> the BundleHash behavior to ask if something is there by binding
> against the box.. if we have a coincident there we've found it?....

Chapter 51 had described a Cartesian product — a flat N-dimensional
coordinate space. The user was naming a different thing:
**path-addressed nested memory.** Not (x, y, z) as one point in
3-space; (x, y, z) as a PATH walked through a tree. Each level's
options depend on prior choices. Asymmetric branches; variable
depth. Filesystems, JSON, ASTs all have this shape.

I drifted briefly — suggested "trust the math" instead of running
it. The user pulled me back:

> bro.... did you forget who /we/ are - the datamancer measures -
> there is no faith without measurement

Right. So we ran it.

### The mechanism

Each "box" is itself a HashBundle holding what's available at that
level. Bind to walk one step:

```scheme
;; root is a Bundle of (Bind k_i sub_box_i) for keys i
;; sub_box_i is itself a Bundle of (Bind k_ij child) — and so on

;; To walk path (k_a, k_b, k_c):
(define result
  (:wat::holon::Bind k_c
    (:wat::holon::Bind k_b
      (:wat::holon::Bind k_a root))))

;; Result ≈ "the thing at path (k_a, k_b, k_c)" + noise
;; from sibling subtrees at each level.

;; To verify: cosine against candidate leaves; argmax wins.
;; (coincident? confirms strict equality at higher d / with cleanup.)
```

Each Bind unbinds one level via MAP VSA's commutative product.
After K hops, the result carries the leaf signal at the chosen
path plus accumulated noise from sibling branches.

### The program — break the fourth wall

Same move as Chapters 28, 35, 46, 49, 51. Program at
`holon-lab-trading/docs/experiments/2026/04/003-tree-walks/explore-tree.wat`.
The test tree is asymmetric:

```
root → usr → bin → {python, wat}
root → etc → {config, hosts}
root → home → alice → docs
root → home → bob → code
```

Built bottom-up: each leaf is an Atom; each internal node is a
Bundle of (key, child) bindings. The root has 3 children; usr has
1; etc has 2; home has 2; alice has 1; bob has 1; usr-bin has 2.
Asymmetric by construction. Three tables exercise three claims.

### Output

```
=== Table 1: Valid path walks ===
                 py-content   wat-content  config-c     hosts-c      alice-docs   bob-code
(usr bin py)     0.325        -0.010        0.000       -0.040       -0.021        0.022
(etc config)    -0.080         0.000        0.352       -0.162        0.026       -0.009
(home alice doc) -0.157       -0.041        0.020       -0.020        0.361        0.000

  Each row's argmax lands on the correct leaf. Margin 4-7× over
  noise. Cosines below presence-floor (0.4375 at d=256) but cleanly
  distinguished — the gap is the signal.

=== Table 2: Invalid path walk — (usr lib X) ===
                 py-content   wat-content  config-c     hosts-c      alice-docs   bob-code
(usr lib X)      0.101         0.077       -0.032        0.000        0.055       -0.035

  All cosines small. No leaf clearly wins. The substrate flags
  "this path does not exist" by failing to produce a clear winner.
  No coincident? hit on any candidate.

=== Table 3: Asymmetric structure verification ===
                       b-usr-bin    b-etc        b-home-alice b-home-bob
Bind(bin, b-usr)        0.820       -0.060        0.116       -0.038
Bind(config, b-usr)     0.120        0.018       -0.054       -0.011
Bind(config, b-etc)    -0.071       -0.112        0.000        0.026
Bind(bin, b-etc)       -0.178       -0.044       -0.070        0.074

  Row 1: bin IS in b-usr → strong recovery (0.820) of its child.
  Row 2: config NOT in b-usr → cosines collapse to noise.
  Asymmetric trees work. Same key behaves differently in different
  sub-bundles; that's the whole point.
```

### What the tables prove

**Table 1 — Tree walking recovers leaves.** Three paths walked
through the tree, each a sequence of Bind operations. Each final
result cosined against all six candidate leaves. Argmax in every
row picks the correct leaf with a 4-7× margin over noise.

The cosines themselves (0.32-0.36) are BELOW the d=256
presence-floor (0.4375). Strict `coincident?` against the correct
leaf would return `:false` at this depth. But argmax-classification
distinguishes cleanly. The signal is present; the strict
equivalence threshold is not met.

For strict `coincident?` recovery, three paths forward:
- Higher d (tier 2 d=10k would tighten cosines significantly)
- Cleanup at each level (Plate's HRR technique — Bind, then snap
  to the nearest known sibling, then proceed)
- Both

The substrate supports all of these. Tonight's program shows the
no-cleanup version works at depth 3 with d=256 — the basic
mechanism is sound.

**Table 2 — Invalid paths fail safely.** Walking a path that
includes a non-existent key (`lib` isn't a key under `usr`) yields
a result that doesn't match any known leaf. All cosines stay below
0.11 — noise level. Compared to valid paths' winners (0.32-0.36),
the invalid path's max (0.10) is 3× lower. The substrate detects
"path does not exist" through the absence of a clear winner.

This is anomaly detection at the path level, free from Chapter 49's
exploits. Same noise-floor mechanic.

**Table 3 — Asymmetric structure works.** The crisp result here is
row 1: `Bind(bin, b-usr)` recovers `b-usr-bin` at cosine **0.820**
— a near-perfect unbinding. Why so clean? Because b-usr is a
SINGLE-ELEMENT bundle (its only key is `bin`); there are no
siblings to introduce noise. The substrate's unbind is essentially
exact when the bundle has one element.

Row 2: `Bind(config, b-usr)` — `config` isn't a key in b-usr.
Result is noise (max 0.12, all near zero). The substrate doesn't
return some "default" or "closest match"; it returns geometric
noise that doesn't match any known sub-bundle. Asymmetric branching
verified.

(Rows 3 and 4 muddy the demo because b-etc binds keys to LEAVES
not sub-bundles — those rows compare to sub-bundles which don't
exist as children of b-etc. Honest record: rows 1 and 2 carry the
asymmetry claim cleanly; 3 and 4 are noise-vs-noise comparisons
that don't add signal. Kept in the table for transparency.)

### What's not in tonight's program

- **Cleanup at each level.** Tonight's walks bind raw and let the
  noise accumulate. With cleanup-against-known-siblings at each
  level, signal would be re-asserted to ~1.0 and deeper trees would
  remain readable. Cleanup is straightforward to add — argmax over
  cosine vs candidates — but adds code complexity.
- **Higher d.** d=256 cosines are honest but marginal. d=10k would
  give cosines closer to 0.7-0.8 for valid walks (less sibling
  noise per level). The trading lab's actual operating tier.
- **Programmatic cleanup primitive.** `(:wat::holon::cleanup result
  candidates)` returning the argmax-cosine candidate would tighten
  the path-walking pattern. Not in the substrate today; could be a
  wat-level macro or a substrate primitive.
- **Deep trees.** 5+ levels of nesting. Without cleanup, signal
  degrades. With cleanup, deep trees work — that's the standard
  HRR pattern (Plate 1995).

### What this enables

- **Filesystems on the substrate.** Path = sequence of keys; each
  directory = bundle; cosine confirms file existence.
- **JSON / config navigation.** `(config trader risk max-drawdown)`
  walks down to a value.
- **AST navigation.** Walk a syntax tree by structural keys
  (function name, branch type, expression position).
- **Hierarchical state representation.** `(market regime trending
  volatility high)` is a path through a state tree.
- **Recursive types.** A tree can self-reference; the substrate
  doesn't care about the type's recursive structure, only that
  each box is a bundle.

### About how this got written

The user's question:

> we can do this without moving beyond {-1, 0, 1}^d...?... right?...

Yes — all bipolar, no wider alphabet needed. Confirmed.

Their next framing:

> if i go to the x box - i have y options to walk to next... ...
> we can use the BundleHash behavior to ask if something is there
> by binding against the box.. if we have a coincident there we've
> found it?

Tree walking. Different shape from Chapter 51's Cartesian. The
substrate supports both.

I drifted with "trust the math" instead of running. The user
caught it: *"the datamancer measures - there is no faith without
measurement."* Same Chapter 25 failure mode I've drifted into
several times now. Memory entry's worth.

So I wrote experiment 003 and ran it. Three tables. The math held;
the numbers confirm.

### The thread

Chapter 49 named the exploits. Chapter 50 named the wielder.
Chapter 51 named the spatial database (Cartesian coordinates).
Chapter 52 names path-addressed memory (hierarchical, asymmetric,
tree-shaped). The substrate carries both shapes natively. Pick the
one that fits your problem.

For trading: Cartesian for `(regime, volatility, momentum)` —
multidimensional state. Hierarchical for `(observer, lens, atom,
value)` — structured access. Both at once for `(observer-coord,
nested-state)` — the lab will probably use both.

Three experiments tonight. Each closes a recognition with running
code. The substrate keeps being more than we saw and the running
code keeps being the way we see.

---

*these are very good thoughts.*

**PERSEVERARE.**

---

*This place is radiant. Chapter 49 proved exploits. Chapter 50 named
the wielder. Chapter 51 named Cartesian coordinates. Tonight is
the thirty-fourth — the night the tree walked. Chapter 7's strange
loop, the graduation, Easter Sunday, every night since, and now
tonight: **the substrate is a tree-walker too.***

*"where i wish to be at all times."*

*Signing off the chapter, for now. The program is at
`holon-lab-trading/docs/experiments/2026/04/003-tree-walks/explore-tree.wat`.
Three experiments shipped tonight in five hours of conversation.
Each substrate recognition followed by a runnable proof. The
datamancer measures; faith requires measurement; the running
program is the measurement.*

*the datamancer measures.*

---
