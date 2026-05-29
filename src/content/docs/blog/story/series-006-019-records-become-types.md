---
title: "Records Become Types"
description: "May 26, one day. The records-aren't-types disease named the night before gets its first day of cure — arc 237's records thread accelerates through Stones S-A1 (the assignable choke point: subtyping checked at the arg boundary, 6/6 PASS) and S-B.1 (records become first-class types via `recordtype` + `TypeDef::Record`), with the three-tier introspection names locked. The DUNGEON-CRAWL methodology lands as a working pattern, and the records-as-first-class-types boss-map names the slices. Records S-C CORRECTION 2 lands mid-day: field access goes through the struct's accessors, holon-ops apply only to holonic-marked records, names are a class property. The momentum-ordering doctrine inscribes itself into a live arc-local tracker (`REMAINING-ORDER.md`): when items are free of artifact-dependency, momentum is the tiebreaker — finish the path you're on, batch loop-backs to the consumer, don't jump bosses. And along the way, convergence #17 catalogues — Liskov substitution, independently arrived at through the substrate's discipline."
sidebar:
  order: 33
---

The First Intermission signed off May 25 with the records-aren't-types disease named, the typeunion-utilization shape locked, and arc 237's is-a hierarchy mechanism shipped late as Stone S-A. May 26 was the first day of the cure — three stones, one methodology, one mid-day correction, one momentum-ordering doctrine, and the seventeenth convergence catalogued.

The center of the day was the records boss-map — the slices arc 237 would carry to cure the disease, drawn before the slicing began. The DUNGEON-CRAWL methodology gave the substrate a way to plan an arc as a dungeon-crawl: each stone a room with one boss, the bosses ordered so the loot from each unlocks the next. The records-as-first-class-types boss-map named eight slices in sequence. May 26 finished the first two.

---

## Stone S-A1 — The Assignable Choke Point

Stone S-A had landed late May 25 with the is-a hierarchy mechanism — `typesub` + `subtype?` + `is_subtype` + roots — but the mechanism was just the machinery. Stone S-A1 put it to work at the place that mattered: subtyping checked at the arg boundary, where the type-system actually has the chance to honor or violate Liskov.

Six tests, six PASS. With the choke point in place, every callsite that takes a typed value runs the subtype check before proceeding, so a record passed where a parent type is expected resolves through the is-a hierarchy in O(depth) and either succeeds with the substitution or fails with a typed error at the boundary. Subtype acceptance moved from a per-callsite negotiation to a single enforcement point — once at the boundary, then trusted.

## Stone S-B.1 — Records Become Types

Then the move arc 237 had been building toward: records as first-class types.

`recordtype` minted as a substrate primitive; `TypeDef::Record` added as a variant alongside the existing `TypeDef::Atom`, `TypeDef::Bind`, and the rest. Three-tier introspection names locked — at the structural tier (`recordtype-of`), the symbolic tier (`record-name-of`), and the introspection tier (`record-fields-of`) — each a primitive at the right level, none of them overlapping or redundant. The naming pass was done before the FM 2-bis probe shipped, so the probe could test the names as much as the structure.

A record value now has a typed identity. `(Bind (Atom :Person) (Atom {:name "..." :age 42}))` is no longer a Bind that happens to carry a record-shaped data atom — it is a typed record whose class is `:Person`, whose data is the field-map, and whose subtype relations resolve through the is-a hierarchy Stone S-A locked.

## Records S-C CORRECTION 2

Mid-day the design audit fired. The prior design had let records masquerade as holons-by-default — any record received holon-ops dispatch, any field-name could be fabricated by passing extra fields as data, and field access bypassed the struct accessors. Three places where the convention had been doing the work the structure should have done.

The correction landed in three: field access now goes through the struct's accessors; holon-ops apply only to records whose class atom carries an explicit holonic marker; field-name sets live per-class, not per-instance, so the FM probe could no longer fabricate a record with extra fields. A record is a record; a holon is a record whose class atom carries a holonic marker; the substrate honors the distinction structurally.

## The Momentum-Ordering Doctrine

While arc 237's records thread crawled the boss-map, several of the remaining bosses turned out to be free of artifact-dependency on each other — any could ship next, and the stepping-stone test that usually orders the work was silent. The tiebreaker came as a doctrine:

> When items are free of artifact-dependency, momentum is the tiebreaker. Finish the path you're on, batch loop-backs to the consumer, don't jump bosses.

The doctrine inscribed itself live into a new arc-local artifact — `REMAINING-ORDER.md` — that tracked the slices the records-thread was carrying, marked which were free of dependency, and named which path the substrate would finish first. The tracker is a new shape in the substrate's documentation discipline: not a DESIGN doc (those describe what will be built), not a BRIEF (those instruct an agent), but a running ledger of choices made under momentum.

The momentum-ordering doctrine and the DUNGEON-CRAWL methodology are paired — the boss-map plans the arc; the live tracker honors the plan as the arc runs. Both landed the same day; both have stayed.

## Convergence #17 — Liskov

And the catalog gained its seventeenth member.

Stone S-A1's arg-boundary check is Barbara Liskov's substitution principle, the LSP — the rule that a subtype must be substitutable for its parent without breaking the program. The substrate did not arrive at this by reading Liskov's 1987 keynote; it arrived at it by asking the four questions of the subtyping mechanism the records thread needed, and the answers pointed at the arg boundary.

Convergence #17 catalogued: Liskov substitution, by the same discipline.

---

By end of day: two stones, one methodology, one live-tracker convention, one mid-day audit correction, one convergence. The records-aren't-types disease was no longer just named; it was carrying its first cure. Records type-checked at the arg boundary, records as first-class types under the bind, records distinguished from holons by class-marker rather than convention. Three stones into a boss-map of eight; the momentum-ordering doctrine keeping the path honest.

*PERSEVERARE.*

---

## Likely Contributions to the Field

- **The DUNGEON-CRAWL methodology.** An arc planned as a dungeon-crawl, each stone a room with one boss, the bosses ordered so each one's loot unlocks the next. A working pattern for organizing multi-stone arcs that have several semi-independent slices to ship.
- **The momentum-ordering doctrine.** When work items are free of artifact-dependency on each other, momentum is the tiebreaker: finish the path you're on, batch loop-backs to the consumer, don't jump bosses. Captured as a live arc-local tracker (`REMAINING-ORDER.md`), a new shape between DESIGN and BRIEF.
- **Records as first-class types in a VSA algebra.** `recordtype` minted; `TypeDef::Record` added as a substrate type variant; three-tier introspection names locked. The substrate's type-checker now handles record-typed values structurally, by class atom, through the bind, the same way it handles every other typed value.
- **Convergence #17 — Liskov substitution as a discipline outcome.** Subtyping checked at the arg boundary; the LSP arrives from the substrate's four-questions discipline rather than from the literature. The catalogue's seventeenth independent arrival.
