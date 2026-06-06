---
title: "The Dialect Reckoning"
description: "June 3–4, arcs 247 and 248 — two claims forced to tell the truth. Arc 247: the substrate says clojure-on-rust, but its sequence HOFs were collection-first — (map [1 2 3] inc) — a six-week-old banked lie (arc 109 INVENTORY § N.1) rediscovered by the equality descent and hard-cut across ~65 sites: (map f xs) is now the only form, coll-first a check error, not an alias. Arc 248: the generative-macro plan built its tool — a bounded for-comprehension that maps a sub-template over a list at expansion time — and then the plan reversed under it. The dig into the dispatch layer proved equality is a relational intrinsic, not a clause: the clause matcher checks each argument against a fixed type independently and never unifies arg0 with arg1, while equality IS that cross-argument unification. A generated clause list would have regressed record and user-type equality. 248.2 was cancelled, not deferred — the work it would have done is unnecessary. The tool survives the plan; the partition rule it forced is inscribed at the dispatch sites."
sidebar:
  order: 51
---

The substrate's identity claim is one sentence: wat is Clojure-shaped, hosted on Rust the way Clojure is hosted on the JVM. A claim like that is a standing debt — every place the dialect diverges from the shape it names is a lie carried on the books. Arcs 247 and 248 are the reckoning of two such debts, and they settled in opposite directions: one was a real lie, hard-cut; the other was a *planned fix for a lie that wasn't there*, and the honest outcome was cancelling the fix.

## The six-week lie

June 3. In Clojure, the sequence HOFs take the function first: `(map f xs)`, `(filter pred xs)`, `(reduce f init xs)`. It is not a style choice — it is what makes threading and partial application compose. wat's were backwards: `(map [1 2 3] inc)` — collection first. The divergence had been *known* and *banked* for six weeks: arc 109's INVENTORY had recorded it as § N.1, "`:wat::core::map` arg order is backwards," surfaced by a probe and parked. Then the equality work's relentless descent — equality → clause → macro → map — walked straight into it again. A banked lie does not age into truth; it waits. The user's call, recorded in the arc's design:

> we are clojure on rust … we make map dialect compliant

Arc 247 was the cut. All five sequence HOFs — `map`, `filter`, `foldl`, `foldr`, `sort-by` — flipped to fn-first: the runtime implementations (`f = args[0]`, collection last), the `check.rs` TypeSchemes, and the entire call-site cascade — **~65 sites** across the stdlib (18), the wat test corpus (22), the Rust tests (18), and the runtime's inline tests (7). And it was a **hard cut**, not a migration: `(map [1 2 3] inc)` is now a check error — `TypeMismatch: expected fn T→U at arg0, got Vector`. Coll-first is gone, not aliased, not deprecated, not warned-about. One form exists.

The closing score's structural verification is worth quoting for its shape: the only coll-first form left in the tree is the probe's *intentional* error-assertion — a test named `mint_map_coll_first_is_gone` that proves the old form fails. The lie's tombstone is a passing test.

The flip surfaced its own sibling immediately: `(map f (filter pred xs))` is natural Clojure, but only thread-first `->` existed, and fn-first HOFs want thread-last `->>`. The score banked it scope-honestly rather than building it — and it shipped two days later as the opening stone of arc 249, where the threading macros became the canary for something much larger.

## The plan that reversed

June 4. Arc 248 opened to build a tool the equality-consolidation plan needed. Equality in wat dispatched through its own mechanism, and the plan — drawn up mid-arc-237 — was to fold it into the general `defclause` system by *generating* the per-type clauses: `=` and `not=` over int, float, string, bool, and the rest, ~22 ceremonial clauses nobody should hand-write. wat's `defmacro` was quasiquote-only — it could splice a list but not map a sub-template over one — so 248.1 built the missing piece: a **bounded for-comprehension**, `,@(:wat::core::for [x xs] tmpl)`, which maps a sub-template over a finite list at macro-expansion time and splices the results. Deliberately map-and-nothing-more: no recursion, no conditionals, no expansion-time computation. Hygiene rides the existing sets-of-scopes machinery — per-iteration binding cloned from the original, binder reached by explicit unquote. Probe 3/0/0; verified by a hard read of the `walk_template` diff, not the implementing agent's report.

Then 248.2 — "equality → macro-generated defclause" — was never built. **And that is the correct outcome.**

The dig into the dispatch layer reversed the plan's premise. The clause matcher checks each argument against a *fixed named type*, independently, position by position — it never unifies one argument's type with another's. Equality *is* that cross-argument unification: `= : a:T, b:T` for all `T`, the constraint flowing *between* the arguments. The original analysis had looked only at the return type — "equality returns bool invariantly, so it's clause-shaped" — and missed that the relationship between the *inputs* is type-level computation no finite clause list can express. Generate the 22 clauses and record equality, composite equality, user-defined-type equality all regress to `NoMatchingClause` the moment a type outside the list appears.

So the partition rule, inscribed at the dispatch sites themselves where no future reader can miss it (the declaration-site marker at `check.rs:4931`, with `docs/DISPATCH.md` as the standing rule): a **defclause** is monomorphic — concrete argument types, fixed return, no type-variable flow. An **intrinsic** is type-level computation, in two flavors: **projective** (a type flows from arguments to return — collections, where `get` on `Vector<T>` returns `Option<T>`) and **relational** (a constraint flows between arguments — equality). Look at *both* sides — args→return *and* arg↔arg — before calling anything monomorphic. Equality was already an intrinsic, already correct. The consolidation target dissolved.

248.2 was **cancelled, not deferred** — the distinction matters in a record. Deferred work is owed; cancelled work is *understood to be unnecessary*, and writing that down is what stops a future self from re-deriving the plan and re-walking it off the same cliff.

## What survives a reversed plan

The for-comprehension was built for a plan that died — and it is kept, because it was never equality-shaped. It is a general per-type-boilerplate generator, hygienic and bounded, sitting in the substrate for the next real list-shaped need. The detour was not waste: it produced a real tool, and the dig it forced produced the partition rule that now guards the dispatch layer's front door. Some arcs deposit the thing they set out to build. 248 deposited the proof that the thing should not be built — plus the tool, which outlived its reason.

## Likely Contributions to the Field

- **Hard-cut dialect honesty over deprecation.** A language claiming an identity (Clojure-shaped) treats divergence from that identity as a lie to annihilate, not a quirk to document: one form remains, the old form is a type error, and the tombstone is a passing test asserting the old form fails. The alternative — aliasing both orders — would have made the lie permanent and ambient.
- **The clause/intrinsic partition with a checkable discriminant.** Dispatch mechanisms divided not by taste but by what flows: no type-variable flow → clause; type flows args→return → projective intrinsic; constraint flows arg↔arg → relational intrinsic. The discriminant ("look at both sides") is mechanical enough to apply at review time, and it is inscribed at the dispatch sites rather than in external documentation.
- **Cancelled-not-deferred as a record state.** A plan reversed by deeper understanding is closed *affirmatively* — the record states the work is unnecessary and why — which prevents the orphaned-TODO failure mode where a dead plan re-surfaces as owed work.
- **Banked lies have a measured shelf life.** The arg-order divergence sat recorded-but-unfixed for six weeks across ~65 accumulating call sites. The cost curve of a banked dialect lie — every new call site is another migration site — is an argument for cutting identity-level divergences at first record.
