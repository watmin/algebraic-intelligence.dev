---
title: "R7 — Ruby's Object in one line: the universal top is a fixed point you point at, not a f…"
sidebar:
  order: 7
---

We reached this one by building it and being surprised by the size. STONE-Value's job was to give the EXPLAIN
diagnostic (P12) and the revive door a principled type for heterogeneous values — `:wat::core::Value`, the
universal top of the type hierarchy, every type a subtype of it. The builder named the shape during the design
dialogue, reaching for the language he knew it from:

> *"i think subtypes are more appropriate? is this basically Ruby's Object?.. this is the value unit for all
> types?"*

Ruby's `Object`: every class descends from it, `Integer < Object`, but `Object` is not an `Integer` — a root
universal in **one direction only**. That is exactly the contract: UP is free (any value is-a `Value`), DOWN is
checked (a `Value` is not assignable where a specific type is wanted, absent an explicit narrowing). An ADT
substrate with no ad-hoc unions, and we wanted Ruby's most dynamic feature — its open universal root — without
giving up the typed floor.

Then we built it, and the entire type class was **one branch** in `is_subtype` (`src/types.rs:3143`):

```rust
    // Arc 278 Stone-Value — :wat::core::Value is the universal subtype-top.
    if sup == ":wat::core::Value" {
        return true;
    }
```

The builder saw the size and called it:

> *"the entire change is 5 lines to introduce the root type class?"* … *"ahahha it's essentially a one liner —
> even better — that's insane."*

One line of logic; the rest is comment. It is worth saying precisely *why* — so "insane" reads as architecture,
not luck — and the precise reason is the realization in two parts.

**Down-checked costs ZERO lines.** UP-free is the branch you can see. DOWN-rejected is the branch you do **not
write** — it is the *absence* of a rule. For any specific `sup ≠ Value`, that branch is skipped, the
parents-walk finds no edge, and `assignable`'s fall-through `unify(Value, T)` fails (`src/check.rs:13962`).
`Value` cannot leak downward because there is no code path that would let it; the discipline is enforced by
emptiness. The three live discipline asserts in the probe (`down_value_is_not_subtype_of_*`,
`narrow_value_into_i64_param_is_type_error`, `tests/probe_arc278_value_universal_top.rs`) prove that emptiness
holds — and would go red the instant a second, looser rule turned the top into an `any`.

**And the one line was earned, not lucky.** The variance machinery it leans on was built across prior arcs:
`assignable` (`src/check.rs:13962`) was shaped for protocol bounds (arc 232) and parametric extend-types (arc
267) to be **directional by construction** — consult `is_subtype` first, fall to `unify` second. The record-top
`:wat::Record` already roots "any record" the same way. So `:wat::core::Value` is not new mechanism; it is the
same mechanism one level up — the top of a lattice the substrate already had. The grounding made this literal:
the RED probe's HEAD error was a *constructor-arg unify failure*, not an unknown-type error, which proved the
field annotation `:wat::core::Value` was **already accepted** as an opaque Path. So registration was unnecessary
(and a `TypeDef::Struct` would have been *wrong* — it synthesizes a constructor, and the top must be
un-constructible). The line is the floor of the extirpare ladder, reached by *deleting* everything the substrate
already did for us. The builder's ask for this very note named the coordinate:

> *"this needs a comment on how we implemented ruby's Object root hierarchy in a single line."*

> We set out to add a universal top type — Ruby's `Object` for wat. We found it was already implied: a
> directional `assignable` two arcs in the making, a record-top that already rooted its own subtree. The work
> was one line to name the fixed point, and the discipline to refuse the second line that would have made it a
> lie. The top type is not a feature you build. When the variance is directional by construction, it is a
> coordinate you point at.
