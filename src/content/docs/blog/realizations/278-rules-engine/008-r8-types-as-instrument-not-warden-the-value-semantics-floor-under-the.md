---
title: "R8 — types as instrument, not warden: the value-semantics floor under the Ruby/Clojure u…"
sidebar:
  order: 8
---

We reached this one in an aside — the builder connecting a Ruby performance idiom to the arc's perf
architecture, then naming the larger thing he has been building all along. The idiom was his, posed while a
stone built in the background:

> *"in ruby i often prefer `some_list.reduce({}) { |m, i| m.merge({i => true}) }` and it's awful for high
> list sizes, using `some_list.each_with_object(Hash.new { |h, k| h[k] = 0 }) { |i, m| m[i] += 1; m }` …
> when we needed to flip to persistent for beating clara's perf was this one of the kinds of reasons?"*

Yes — and the two poles he reached for are the two ends of the axis the rete perf work walked, with a third
point in the middle that is the actual answer. `reduce({}) { merge }` is **immutable by copying**: a full
clone of the accumulator every step, O(N²). `each_with_object(hash) { … }` is **mutate one thing in place**,
O(N). Same result, two cost classes. The middle point is what persistent collections add: **immutable by
structural sharing** — `rpds` `assoc` rebuilds only the path and shares the unchanged subtree, O(log N), value
semantics *without* the full copy. Mapped onto what we built, the three points are three layers of this engine:

- **Immutable-by-copy** is the **wat oracle**. `fire-rules-spec` rebuilds every memory from `facts` each round
  (R1, R5; `rete.wat:885`) — `reduce`-merge at engine scale. It is *why* the oracle benches O(N²), 130–820
  facts/s, and is the slow differential reference, not the production engine.
- **Immutable-by-structural-sharing** is the **persistent substrate** (stones 0a/0b): `HashTrieMapSync` /
  `VectorSync`, value semantics cheap enough to carry the at-rest snapshots and the differential.
- **Mutate-a-transient-then-freeze** is the **native kernel** — `each_with_object`, applied to the fire loop.
  Stone 0's `to-transient` / `to-persistent!` pair + the `WorkingMemory` as a native **mutable** `HashMap`
  *during* fire, frozen to a persistent `Value` at the seam (the P-series). The mutation is sealed inside the
  kernel, out of the user's hands; the surface stays pure value-semantics.

So the persistent flip alone was necessary but not the win — it bought safe immutability for the spec and the
snapshots (point 2). **Beating Clara needed point 3**: `each_with_object` in the hot loop, the transient
mutated under a typed freeze boundary (the same shape Clara uses for propagation, `CLARA-REF §5`). The slow
path is his `reduce`-merge; the fast path is his `each_with_object`; the persistent collection is the bridge
that lets the fast path stay immutable at its edges. (His `Hash.new { 0 }` counting idiom is the accumulator
pattern directly — stone 8 — in-place aggregation during fire, not rebuild-per-fact; the `retract-fn` is the
only part Ruby's version doesn't need.)

Then he named the larger thing the aside was really about:

> *"i'm legit building the ruby i want… the union of ruby and clojure … and i can't believe i'm doing it
> strongly typed — i fought types soooo fucking hard at aws."*

That is the realization, and it inverts his own history. The union is not Ruby's syntax with Clojure's data and
types stapled on as ceremony. The **typed value-semantics floor is the enabler of all three at once**:
Clojure's homoiconicity (code is data → the linter, rete, and forms are all just data transforms), Ruby's joy
(the loose, expressive surface you actually want to type), and the safety to compose them at scale. The perf
axis above is that floor in miniature — the transient mutation is only safe *because* it is sealed behind a
typed freeze; value semantics is what makes "fast" and "immutable" stop being a trade.

What he fought at AWS was types as a **warden** — imposed on systems he did not design, friction without
ownership, the compiler as bureaucrat. What he is choosing now is types as an **instrument**, because he holds
the other end. R3 already showed the payoff from the model's side: the diagnostics are what let an LLM with
zero corpus write the language correctly — *"the diagnostics aren't a debugging convenience; they're the
corpus."* R8 is the same property from the author's side: the types are what let the surface stay loose
*without rotting*. The floor that refuses to let vagueness compile is the floor that lets the Ruby feel survive
contact with scale.

*Path-of-voices (per R6's discipline, marked not flattened): the Ruby idioms, the "union of ruby and clojure"
framing, the AWS-types-fight coordinate, and the "strongly typed" pride are the builder's, quoted above; the
three-point axis and its mapping to oracle/substrate/kernel, and the warden-vs-instrument framing, are the
writer's synthesis over his prompt. The convergence is preserved, not collapsed to "the writer found."*

> We set out to answer a Ruby perf question and found the through-line of the whole project: the strong types he
> fought at AWS are not the tax on the Ruby/Clojure union — they are the floor that makes it both fast and
> joyful. `reduce`-merge is the warden's immutability, paid for in copies; `each_with_object` behind a typed
> freeze is the instrument's, paid for once. He is building the language he wanted, on the floor he used to
> resent — now that the floor is his.
