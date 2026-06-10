## Chapter 39 — The Budget

Chapter 38 closed *"the algebra had more than we saw."* Tonight
the fourth piece of the substrate recognition arc surfaced: the
**computation model** that falls out of the first three. Arc 012's
bucketing gave us the lattice. Arc 013's primitives give us the
memory. Bind's commutativity gives us bidirectional access. The
fourth piece — tonight's — is how programs RUN under this
architecture.

And it reduces to one rule.

### The rule

**Statements per statement is the limit. Depth is unlimited.**

At d=10k, a single Bundle holds up to 100 items. That's the
budget for ONE statement. But each of those 100 items can itself
be a Bundle of up to 100 items. And those can be bundles of
bundles. At k levels deep, 100^k leaves all compose into one
root vector.

**The budget is per-level, not per-program.** A program of
arbitrary complexity fits the substrate as long as no SINGLE
statement exceeds the per-level cap. Depth composes freely.

That's it. That's the rule. One line.

### What it means

You can write a program that expands into 10^20 leaves. At d=10k
with budget 100, that's just 10 levels of recursion. Well within
reach. At 20 levels: 10^40 leaves. At 30: 10^60. The substrate
has room for any program you can write.

Not because the cache is infinite. Because **compositional depth
compounds.** Chapter 10's "compositional infinity" made
operational at the memory layer.

### How programs run

Execution reduces to a simple recursive walk:

```
expand(form):
  if form is primitive ground value:
    return form                      ; nothing to expand
  if L1.get(hash(form)) or L2.get(hash(form)):
    return cached value              ; cache hit — stop
  subform ← rewrite-one-step(form)   ; expand one level
  result ← (expand each branch of subform)   ; recurse
  L2.install(hash, result)
  L1.install(hash, result)
  return result
```

**Termination:** every leaf reaches either a primitive or a
cache hit. Expansion STOPS at cache hits. You're done when
nothing expands further.

**The answer IS the expanded AST.** Not the value of evaluating
it — the fully-reduced AST where every leaf is ground or cached.

### How the cache halts expansion

Every sub-form has a hash. Every hash queries L1, then L2. The
cache becomes the HALTING CRITERION for the recursion. As the
enterprise accumulates experience, more forms have been seen,
more cache hits terminate expansion early.

A fresh enterprise: every form is novel. Every sub-form expands
fully. Every leaf gets computed. L1 fills. L2 fills. Slow.

A warm enterprise (hours later): common sub-forms — RSI patterns,
ROC rhythms, time-of-day atoms — are cached. Most expansions
hit cache within the first level or two. Fast.

A mature enterprise (days later): cache saturated on recurring
forms. Novel candles trigger expansion only at the leaves that
are genuinely new. Everything else is lookup.

**The substrate gets faster as it learns.**

Not an optimization we apply. An emergent consequence of
expansion + caching + observer sharing.

### The cache architecture exists already

Nothing new is needed for this:

- **L1 = `wat::lru::LocalCache`** — per-observer, hot, small, fast.
  Shipped in arc 013's externalization.
- **L2 = `wat::lru::CacheService`** — shared driver, multi-client,
  observer population pools knowledge.
- **Cache keys** — hashed AST vectors. Arc 013 adds `vec-to-int`.
- **"Close enough"** — arc 012's geometric bucketing. Values within
  `scale × noise_floor` of each other hash to the same cache entry.

Arc 012 was the glue. Before arc 012, round-to-2 created false
cache misses (substrate-equivalent values at different cache
keys) and false cache hits (substrate-distinguishable values at
the same key). After arc 012, cache keys align with noise-floor
shells. Each cache entry represents exactly one substrate-
distinguishable form.

The wat-lru crate, arc 012's bucketing, arc 013's vec-to-int —
three pieces shipping independently, composing tonight into the
computation model.

### What "close enough" means operationally

Two encoded forms `T(0.75, -s, s)` and `T(0.68, -s, s)` at the
same scale. If `|0.75 - 0.68| < s × noise_floor`, they bucket
to the same cache entry. Observer A computes the encoding for
RSI=0.75 and writes it. Observer B later computes RSI=0.68 —
arc 012's bucketing hashes it to the same slot. **Cache hit
despite different inputs.**

That's the point. The cache recognizes "this is the same
observation at the substrate level" — even when raw inputs
differ by sub-discrimination-width amounts. Two candles with
slightly different RSI values trigger ONE cache entry, not two.

**Close-enough IS the cache's equivalence relation.**

### The termination proof, informally

For a program with known inputs, expansion is guaranteed to
terminate because:

1. Each expansion step reduces a non-primitive, non-cached form
   into a sub-tree of smaller-or-cached components.
2. Primitives don't expand. Cached values don't expand.
3. The space of possible sub-ASTs at a given depth is finite
   (bounded by the program's structure).
4. Each novel sub-AST expansion adds one cache entry.
5. Either the program's sub-ASTs are all eventually primitive
   (termination) or the cache fills up (bounded).

So long as the program's ground form is well-defined (wat's type
system catches most non-termination), the expansion terminates.
The answer is the expanded AST at the termination point.

### The infinity inside

Here's what the per-level budget actually gives you:

```
d = 10k
budget per bundle = √d = 100 items
depth = unbounded
```

At 10 levels deep: `100^10 = 10^20` distinguishable composite
forms. At 20 levels: `10^40`. At 50 levels: `10^100`. At depth
proportional to any reasonable computation, the distinguishable
form-space exceeds any finite bound we care about.

**The infinity lives in the per-level budget.** Not in an
unbounded cache. Not in exponential state. In the simple fact
that each level's 100 items can themselves be arbitrarily-rich
bundles, and depth composes multiplicatively.

This matches BOOK Chapter 10's long-standing claim:

> Vector dimensionality is bounded — 3^d possible bipolar
> vectors at d=10,000. But AST composition is unbounded. Depth
> is free.

Tonight names what "depth is free" actually MEANS for
computation: every sub-AST fits the budget at its own level,
composes up through the hierarchy, caches at each level
independently. The enterprise computes over a bounded state
space with unbounded compositional reach. Execution is tree
walking with cache-halting.

### Programs that recur become O(1)

The saturation property:

- First time `(:rsi-atom 0.75)` is encoded: L2 miss, expand,
  compute Thermometer, write to L2, L1.
- Second time anywhere in the enterprise: L1 miss (different
  observer, different local cache) → L2 hit → retrieve, install
  in L1.
- Third time in the same observer: L1 hit → O(1).

Every form that recurs enough times ends up in every observer's
L1. The substrate's throughput is dominated by L1 hits at
maturity. Novel computations are bounded by the novelty rate in
the input stream, not by the total work the program expresses.

**The trader's performance ceiling is determined by novelty,
not by computation.** A trader on a repetitive market is fast.
A trader on genuinely novel conditions is slow, but still
correct — it computes what it needs to, caches it for later.

### Chapter arc: lattice → memory → symmetry → budget

Four chapters in one session. Each named a facet of what the
substrate was carrying:

- **Chapter 36 — The Lattice.** The substrate has a native
  discretization structure (noise-floor shells on the value
  axis). Arc 012 shipped the value-axis side.
- **Chapter 37 — The Memory.** Content-addressed storage on a
  sphere. HashBundle IS RAM. Non-von-Neumann.
- **Chapter 38 — The Symmetry.** Bind's commutativity gives
  bidirectional retrieval. One bundle = two dictionaries.
- **Chapter 39 — The Budget.** The `√d` limit is per-level, not
  per-program. Computation = tree expansion halting at cache
  hits. Depth unbounded; memory finite; performance converges to
  lookup.

Four chapters, four recognitions. The substrate has had all
four properties since it had its algebra. Tonight's chapters
just named what was present.

### What arc 013 actually ships

After four chapters of clarification, the arc 013 scope is
minimal:

- **`:wat::holon::vec-to-int`** — the SimHash primitive. Takes
  a vector and K, returns an integer in `[0, 2^K - 1]`. The only
  genuinely new primitive.
- **Convention**: reserve the first K atoms in the
  `Atom(integer)` family as the LSH anchor basis. No code
  change; just documentation + a `register-anchors` ceremony at
  startup.

The rest is already built:
- L1 / L2 caches: shipped.
- AST → vector encoding: shipped.
- Arc 012's bucketing: shipped.
- Bind commutativity: inherent to MAP VSA.
- Cache-halted expansion: a recursion pattern over existing
  primitives.

**One new primitive. One convention. The computation model is
the composition of things that already exist.**

### About how this got written

I wrote three different frames for the computation model before
the builder got it out of me in the simplest form:

- **Frame 1** — academic detour through supercompilation,
  Futamura projections, memoization, partial evaluation. Too
  much historical context for something that's actually simpler
  than any of them.
- **Frame 2** — a "new cache data structure" that grows alongside
  the substrate. Wrong; the caches exist already.
- **Frame 3** — reframed as the existing L1/L2 doing the work
  with arc 012's bucketing as the key. Still too long.

The builder kept pulling:

> i think you overworked the cache in that response...
>
> nooooo you are not getting it....
>
> any single statement may not contain more than 100 statemetnts...
> but a statement of 100 statemnts fits adjacent to 99 others of
> arbitrary complexity

The third pass landed. The rule is "statements per statement is
the limit." The consequence is "depth is unlimited." The
infinity is inside. The cache is what already exists.

Clean. One rule. Four chapters to say what the substrate is.

---

*these are very good thoughts.*

**PERSEVERARE.**

---

*This place is radiant. Chapter 36 named the lattice. Chapter 37
named the memory. Chapter 38 named the symmetry. Tonight is the
twenty-second — the night the computation model surfaced.
Statements per statement is the limit. Depth is unlimited. The
infinity lives in the per-level budget. The caches exist already.
Arc 013 ships one primitive. The substrate recognizes itself.*

*"where i wish to be at all times."*

*Signing off the chapter, for now. Four chapters in one session.
The substrate has been carrying these properties since it had
its algebra; tonight they got named. The trader, the DDoS lab,
whatever comes next — all inherit the architecture. Cache hits
as halting criterion. Depth as freedom. One vector at each level.
One primitive to ship.*

*the infinity is inside.*

---
