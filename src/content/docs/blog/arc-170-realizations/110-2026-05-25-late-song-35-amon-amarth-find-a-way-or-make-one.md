---
title: "2026-05-25 late — Song #35 (Amon Amarth"
sidebar:
  order: 110
---

User dropped the song precisely AT the inflection point: Stone 237.1 (typeunion substrate primitive) shipped at `d40eb4a3` with 14/14 probe PASS at ~11 min sonnet wall-clock (well under the 60-120 min Mode A target band); Stone 237.2 sub-DESIGN + FM 2-bis probe + BRIEF + EXPECTATIONS authored + committed across `d888f79a` and `70861947`; sonnet just spawned on the defclause substrate work; the orchestrator just confirmed pre-flight baseline (827/0 lib + 52 clippy). The song lands in the gap between cleared chamber and second flight.

### Why this song, here

Amon Amarth's second appearance in the soundtrack (after #23 Raven's Flight — CONVERGENCE-ARRIVAL). The band carries mythic-Norse battle imagery for moments where the work IS combat against a structural foe AND the way-making is unmistakable.

This song's facet: **WE-MAKE-THE-WAY.**

Arc 237 — polymorphism consolidation — fights three foes at once: arc 146 Dispatch entity (the existing polymorphism-by-arg-type mechanism); hand-coded arithmetic special-case (`infer_arithmetic` + `eval_arithmetic_variadic` + `is_numeric` predicate — the lies the substrate has been carrying); per-Type variadic wrapper duplication. The consolidation requires NEW substrate primitives (typeunion + defclause) that don't fit the substrate's existing prescriptions.

The substrate's existing prescription, per `src/types.rs:1310` AnyBanned message:
> `:Any` is not part of the type system (058-030); use `:wat::holon::HolonAST` for any algebra value, **a named enum for closed heterogeneous sets**, or parametric T/K/V for generics.

For arithmetic UX, the named-enum recommendation would force wraps at every numeric call site (`(:wat::core::+ (:NumI64 1) (:NumF64 2.0))`). Painful + dishonest. Stone 237.1 made the way: typeunion as a DOCTRINE DEPARTURE — bounded named set of types, no wrapping, dispatch by actual type. The departure is justified by arithmetic UX (Stone 237.7's territory; not 237.1's concern but motivates it).

> *"Though your arrows block the sun, I'll find a way or make one"*

The substrate's prior prescription IS the arrows. typeunion is the way we MADE because the existing way didn't fit our specific structural need. The substrate-honesty discipline (arc 224 → 225 → 230 → 234 → 237) IS way-making — every doctrine evolution that promotes a hidden hand-coded lie to a first-class user-surface primitive.

### Pattern lineage

Per the session-arc trajectory:

> #28 PRICE-PAID → #30 BUILD-DELIVERED → #31 COLLECTIVE-VOICE → #32 EVOLUTIONARY-CATALYSIS → #33 APEX-PREDATOR-IDENTITY → #34 DEFIANT-VIGIL → **#35 WE-MAKE-THE-WAY**

The arc tightens: voice → evolution → identity → defiance → way-making. Defiance (Vigil) REFUSES what's wrong. Way-making (Find A Way) BUILDS what's right. They complete each other — defiance without way-making is sterile; way-making without defiance is naive.

### Amon Amarth thread (band-pattern emerging)

- Song #23 — Raven's Flight — CONVERGENCE-ARRIVAL (we arrived where Hickey + Clojure community has been; the four-corner protocol-record-extend pattern crystallized)
- Song #35 — Find A Way Or Make One — WE-MAKE-THE-WAY (we depart from the substrate's prior prescription because the structural need is real and the doctrine evolves)

Two songs, same band, same mythic-Norse battle frame, different work-shapes: convergence vs way-making. Convergence honors what was already there. Way-making mints what wasn't.

### What earned the song this session-arc

Per chronological commit chain through `70861947`:

```
04c46814  arc 237 OPEN: polymorphism consolidation DESIGN
3f1336d0  arc 237 Stone 237.1: sub-DESIGN + DESIGN diagnosis-findings absorbed
8edcfd21  arc 237: lock Vector-literal member syntax (Clojure not Scheme)
63657d95  arc 237 Stone 237.1: FM 2-bis probe (14 contracts, pre-stone disconfirming)
d1560c01  arc 237 Stone 237.1: BRIEF + EXPECTATIONS authored
d40eb4a3  arc 237 Stone 237.1 SHIPPED — :wat::core::typeunion (14/14 PASS, ~11 min)
d888f79a  arc 237 Stone 237.2: sub-DESIGN + FM 2-bis probe (12 contracts)
70861947  arc 237 Stone 237.2: BRIEF + EXPECTATIONS authored
            ↓ sonnet spawned on Stone 237.2 ↓
[Song #35 lands AT THIS MOMENT]
```

8 commits. 1 ship. 1 sonnet flight in progress. The pre-spawn discipline (sub-DESIGN + FM 2-bis probe + locked decisions + Stone 236.0/234.1 SCORE templates as references + baseline re-run) made Stone 237.1's ship MECHANICAL — ~11 min wall-clock vs 60-120 min target. The party-comp (Inquisitor + Shadowdancer) operates at peak rhythm.

### Replay triggers

- When a session's discipline produces a foundation stone that REQUIRES doctrine evolution to ship (not just consuming existing primitives) → way-making
- When the existing substrate prescription must be deviated from + the deviation is structurally justified
- When stand-alone-foe imagery applies (the arc is one party against one structural fragmentation)
- When "push on, I've come this far" applies (multi-stone session where the chain has been built)
- When "though your arrows block the sun, I'll find a way or make one" maps to a specific doctrine departure that earned its mint via empirical/structural necessity rather than convenience
- When Amon Amarth's mythic-Norse battle frame matches the moment (convergence OR way-making; band's role is the heavy combat-against-structural-foe energy)

### Cross-references

- Stone 237.1 SCORE — `docs/arc/2026/05/237-polymorphism-consolidation/SCORE-STONE-237.1.md`
- Arc 237 umbrella DESIGN — `docs/arc/2026/05/237-polymorphism-consolidation/DESIGN.md`
- Stone 237.2 sub-DESIGN — `docs/arc/2026/05/237-polymorphism-consolidation/DESIGN-STONE-237.2.md`
- AnyBanned recommendation (substrate's prior prescription) — `src/types.rs:1310`
- `feedback_clojure_not_scheme` — bracket lock doctrine (Vector for data; List for calls)
- `[[door-pattern]]` informal — door we closed becomes door we needed (Convergences #11/#16 + now this)

*The arrows blocked the sun. We made the way.*
