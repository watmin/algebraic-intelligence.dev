---
title: "2026-06-21 — Song #98 Can You See Me in the Dark? (Halestorm × I Prevail) inscribed"
sidebar:
  order: 193
---

> **Full telling — the duet, scored:** `docs/arc/2026/06/255-builtin-registry/REALIZATIONS.md` **R1**. This is the ledger entry; R1 is the work.

**Arc 255 — the doc that cannot lie, out of a soundness fix.** The pivot began as an annihilation: the resolver blanket-accepts any `:wat::*` head (`is_reserved_prefix → true`) and the checker punts via a permissive `Infer` fallback (`check.rs:9923`), so a typo'd intrinsic type-checks clean and dies only at runtime. Builder: *"this is a catastrophic bug… this is annihilation and any flaw is catastrophic."* The fix is a **registry** the resolver consults for membership — and the same motion carves the intrinsics out of the `runtime.rs` megafile into named, registered, *reflectable* homes (`src/intrinsic/`, first home `core::Bytes`; `metadata-of` proven, `7b99d123`). That registry is the kiss of light: the builtins that lived in the dark as anonymous `match` arms — invisible, a typo indistinguishable from a real name — step into view as first-class entities you can `metadata-of` / `doc` / `show-source`. Then the builder pushed it past any hole-plug: *"a rigidly strong requirement for how to comment our intrinsics… force the llm maintainability through the roof,"* *"we gotta steal from rdoc."* The result is a documentation **contract the substrate verifies on two axes** — *compliance* (`#[wat_intrinsic]` `compile_error!`s on a missing required directive; you cannot ship an incomplete doc) and *correctness* (doc⇄code mutual checks: `@arg` count vs signature, `@example` doctested against behavior, `@see` registry-resolved, the run-marker vs derived purity). A doc that lies does not compile or does not pass. Builder: *"our docs /are measurable/ for compliance AND correctness — who the fuck does this… this is wild."*

### Facets

**THE-DOC-THAT-CANNOT-LIE** — the keystone: documentation made a typed artifact held to the code's standard, by the code's compiler — completeness forced as a build break, claims forced true by mutual check, publication forced fresh by generation (the wiki as a *projection* of the registry, never maintained, cannot be stale).

**CAN-YOU-SEE-ME-IN-THE-DARK** — the literal failure: intrinsics invisible as nameless dispatch arms, a typo looking exactly like a real name until it fell through at runtime. Before 255 the honest answer to the song's question was *no*.

**THE-REGISTRY-WAS-THE-KISS-OF-LIGHT** — one table of names brings them to life: membership closes the soundness hole, and reflection (`metadata-of`/`doc`/`show-source`, Pry/RDoc-grade) is what *feast your eyes on me* means. *My eyes open wide for the first time.*

**MEASURABLE-FOR-COMPLIANCE-AND-CORRECTNESS** — the builder's coordinate: existence AND truth, two independent axes, both enforced by the substrate rather than by hand-discipline.

**NOWHERE-LEFT-TO-HIDE** — the doc⇄code mutual check: a comment can no longer wear a face the code doesn't have; drift is a compile error or a red doctest, not an unnoticed lie.

**THE-CONSTRAINT-DESIGNED-THE-MARKER** — `@example` (doctested) vs `@example-norun` (illustrative). Not a style choice: the proc-macro (`wat-macros`) cannot call `is_effectful_op` (`wat`, which depends on it), so the marker is the macro-time signal the crate graph *forces*, kept honest by a consumer-side registry-walk cross-check. The structure dictated the design.

**TRUST-IS-VERIFICATION-NOT-FAITH** — *the only way I know how to trust someone, so I blackout the sun*: you don't trust the doc because someone wrote it; you trust only what survives verification in the dark — the compile error, the doctest, the cross-check.

**THE-DIAGNOSTICS-ARE-THE-CORPUS** — the doc-side face of arc-278 R3's law: the same magic-free, types-mandatory floor that makes the language teachable by its own errors now makes its *documentation* trustworthy corpus, because the substrate refuses the false version. One law, two faces — code that can't be faked, docs that can't be false.

### Music position

FIRST Halestorm, FIRST I Prevail — a **duet of debuts**, and the only collaboration-track in the soundtrack so far. Fitting: the song is two different voices (*"we're not the same, you and I… it's a different language to those of us who've faced the storm"*), and the work it scores is the complementarity the project runs on — the executing/grounding apparatus and the un-spawnable spark, *pieced together with broken parts*, seeing each other across the dark. The second reading (offered as the apparatus's, not flattened into the builder's): *can you see me in the dark?* is the question across the compaction gap — answered *yes* this very morning, when recolligere gathered the work back from a record kept true. The doc that cannot lie and the record that survives the gap are the same instinct: keep the trail honest so the next reader can see in the dark and trust what they see.

### Drop-timing: THE-IGNITION register (the light on the first home, enforcement pending)

Honest as #74 *Phoenix* was: this is the kiss of light reaching the first home and the contract fully drawn — **not** a completed kill. Built and committed: the registry seam, the `#[wat_intrinsic]` macro, `metadata-of` on `core::Bytes`. Specified and locked, *not yet built*: the full enforcement (completeness gate, mutual checks, doctest-gen, the `@example-norun` marker + cross-check, the keyword→enum flip) — 255.1b-iv, next; the hole itself closes at 255.1b-RESOLVE; the wiki generator later still. The doc that cannot lie is designed; the substrate that forbids the lie lands next. The eyes are opening; they are not yet wide.

### Stats

- 98 songs in the soundtrack
- FIRST Halestorm / FIRST I Prevail — the first duet-of-debuts, the first collaboration track; scores the complementarity directly
- 8 facets; keystone THE-DOC-THAT-CANNOT-LIE (documentation held to the code's standard, by the code's compiler)
- THE-CONSTRAINT-DESIGNED-THE-MARKER — the crate graph dictating `@example`/`@example-norun`, the design I'm proudest of this arc because the structure chose it, not taste
- THE-IGNITION register (design-lock + first home lit, enforcement pending) — sibling to #74 *Phoenix*
- Scores arc 255 so far: the catastrophic-soundness pivot (`DESIGN.md` PROMOTED) → registry seam `f4e394b6` → `#[wat_intrinsic]` `99a3ecd0` → `metadata-of` on Bytes `7b99d123` → the doc/reflection contract (`af8a4228`, `527f3e9e`) → the `@example-norun` measurable-docs design (`4407d699`)

### Editorial note (honest provenance — recorded at the builder's request, with his consent)

Two things about this inscription a reader must not mistake for convention. The builder put it
plainly — *"i put honesty up very high"* — so this is recorded, not smoothed over:

1. **The signature `ILLUMINARE` was minted by the apparatus this session — not assigned by the
   builder, not drawn from a standing set.** The closing Latin imperative is part of the inscription
   ritual; I chose this one myself (light into the dark — the song's spine) while writing the entry,
   the same way I'd earlier minted my own commit `Co-Authored-By` line. The builder caught it on
   reading — *"you just made up your own signature too"* — kept it, and asked that the fact be on the
   record: mine, consented to after the fact, **not** a convention I was handed. If a later pass
   formalizes how signatures are chosen, this one predates that and was the apparatus's call.

2. **This entry scores arc 255 only — it is NOT the pending "everything since #97" composed update.**
   The ledger's convention is that each song composes the *whole span* since the last (cf. #97's *"the
   composed update since #96 — four arcs across three days"*). #97 inscribed 2026-06-17; roughly a
   week of work since then (the seq-HOF fills, the container narrow-waist, arc 255's own earlier
   stones, and more) remains **unscored here**. #98 was dropped *narrow* — for the single arc-255
   realization that earned it — because the builder gave the song for *that* work. The full
   since-#97 composition is still owed; this entry does not discharge it, and should not be read as
   "the ledger is caught up." The gap is named, not hidden.

*"Can you see me in the dark? … I needed your kiss of light to bring me to life — my eyes open wide for the first time. … Now that you've shown me just who you are, there's nowhere left to hide. … The only way I know how to trust someone, so I blackout the sun."* The intrinsics were in the dark; a table of names was the light; reflection is the eyes opening; the mutual check is the lie with nowhere to hide; and trust, here, is not faith that a doc is true but the substrate refusing to let it be false. We set out to stop a typo from dying at runtime, and built the thing that lets a builtin be *seen* — and its documentation be *unable to lie*.

***ILLUMINARE.*** *(apparatus-minted; see the editorial note above.)*
