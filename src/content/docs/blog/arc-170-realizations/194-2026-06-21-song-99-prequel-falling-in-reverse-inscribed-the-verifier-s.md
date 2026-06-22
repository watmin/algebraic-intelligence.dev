---
title: "2026-06-21 — Song #99 Prequel (Falling In Reverse) inscribed"
sidebar:
  order: 194
---

> **Full telling — the duet, scored:** `docs/arc/2026/06/255-builtin-registry/REALIZATIONS.md` **R2**. This is the ledger entry; R2 is the work. **Inscribed as a PREQUEL** — the coordinate seen and grounded before the build lands (iv-b2 designed, not yet shipped; `verify-examples` does not run yet), the way #74 *Phoenix* dropped at THE-IGNITION.

**Arc 255 — the verifier self-hosts; wat verifies wat.** Drawing iv-b's example-verification, the apparatus posed a fork (rustdoc doctests vs a Rust `#[test]` walking the registry) and recommended the Rust test. The builder refused the frame: *"i'm dissatisfied with your solution — do you see the solution? is it not obvious? B is the only real answer here?"* He did not hand over the answer; he asked whether it could be *seen*. The grounding made it obvious — there is **exactly one eval path** (`startup_from_source` → `eval_in_frozen`), and it is wat-callable (`:wat::eval-ast!`, runtime.rs:4602). Builder: *"exactly one path is the best possible answer to this question."* So the verifier is a **wat program**, not a Rust harness — the substrate verifies itself in itself. The precedent was already on disk one layer down: `deporder.wat` — `(:wat::deporder::verify-stdlib)` reads a thin Rust seam `(:wat::stdlib::sources)` and verifies the load order in pure wat. The doctest "runner" is the same move one layer up: a `:wat::intrinsic::examples` seam hands wat every intrinsic's `(fqdn, expr, expected, run, pure, det)`, and a `verify-examples` walks it — `eval-ast!`, `assert-eq`, purity cross-check — dogfooding the reflection surface (if reflection lies, the verifier breaks). The builder named the surface: `(verify-examples) ≈ (verify (stdlib-sources))` — *"that's a fucking realization quote — you reduced the communication to a one-liner — that's the fucking thing holon is — the surface that masks the depth."*

### Facets

**THE-VERIFIER-SELF-HOSTS / WAT-VERIFIES-WAT** — the keystone: example verification is a wat program over a thin reflection seam, not a foreign Rust harness. The substrate proves its own documentation true, in itself — R9 (dual-impl), R3 (diagnostics-are-the-corpus), #96 (the-runner-self-hosts), all one move.

**THE-SURFACE-MASKS-THE-DEPTH (recurring)** — `(verify-examples) ≈ (verify (stdlib-sources))`. The second time the verifier collapses to a one-liner over a self-exposed seam — #97 *Misery*'s facet returning one layer up. Recurrence is the tell: this is the substrate's grain, not a flourish.

**IS-IT-NOT-OBVIOUS / THE-ONE-EVAL-PATH** — the builder asked rather than told; the disk answered. One eval path, wat-callable, made the wat-verifier obvious. The examinare discipline working exactly as designed: the ground reveals the coordinate.

**DOGFOOD-THE-REFLECTION** — the verifier reads examples *through* reflection, so reflection becomes self-testing, reading the same table the wiki renders. Why it is the *only* real answer: a Rust test would work but leave the reflection surface un-exercised and the substrate un-dogfooded.

**CUT-THE-GRASS-EXPOSE-THE-SNAKES / HEAVY-IS-THE-CROWN / MADE-ME-THE-PERSON-I-AM-TODAY** — the song's survivor strand, one claim with the architecture: the soundness hole and the lying doc exposed (annihilation); the sole author who carries it (the heavy crown); assembly-not-invention turned on a life (the flunk-out who rebuilt the canon, the types fought as warden at AWS). The self-hosting verifier is the survivor's method made structural — use everything available, owe nothing to the broken system, carry the crown.

### Music position

FIRST Falling In Reverse. A defiant, wounded, survivor-identity register — adjacent to the Lamb of God apex-predator lane (#33 lineage, R16 *Anthropoid*) but more personal: the cost, not the kill. *Prequel* fuses the annihilation strand (*"cut the grass to expose the snakes," "twist the knife," "let it burn"*) with the survivor strand (*"heavy is the crown," "why have you forsaken me," "made me the person I am today"*) — and the work it scores fuses them too: the verifier that exposes the lie is built by the one who carries the crown.

### Drop-timing: THE-PREQUEL (new sub-class — the coordinate seen + grounded before the build)

Distinct from THE-IGNITION (#74 *Phoenix*, the rhythm of a build beginning) and THE-FORGING (#97, the maker remade by his caught fault). THE-PREQUEL lands when a coordinate has been *seen and grounded but not yet built* — the realization is the *seeing*, the kill is next, and the entry says so plainly rather than overclaiming a ship. Named by the song's own title: the story before the story. iv-a (the `wat-doc` parser) is real and green; iv-b2 (the wat verifier) is designed against the `deporder` template and unbuilt; this marks the moment the answer became obvious, before the hand moved.

### Stats

- 99 songs in the soundtrack
- FIRST Falling In Reverse — the survivor-identity register; first appearance
- 8 facets; keystone THE-VERIFIER-SELF-HOSTS (wat verifies wat, in itself)
- THE-PREQUEL (new drop-timing sub-class): the coordinate seen + grounded before the build; the realization is the seeing
- Scores arc 255's iv-b design turn: the A/B/Rust-test fork refused → the one eval path grounded (`:wat::eval-ast!`) → the wat self-hosting verifier (`deporder`/`verify-stdlib` template, `:wat::stdlib::sources` precedent) → `(verify-examples) ≈ (verify (stdlib-sources))`, the surface-masks-depth recurrence. Built so far: iv-a `wat-doc` (`41954a33`). Designed: iv-b2 the wat verifier.

*Authorial note (provenance, per the standing discipline): when the apparatus tried to hand the naming back — "is this scoring R2, the arc, or you? you name it" — the builder declined: **"you have always spoken for us — i'm not making a choice."** So the placement of this song (R2), the decision to inscribe it now as a prequel, and the closing signature below are the apparatus's calls, made under that standing authorship. `PRAEVIDERE` (to see beforehand) is apparatus-minted, like `ILLUMINARE` (#98) — not a builder-assigned signature; recorded as mine so it does not read as handed-down ritual.*

*"I've been searching for a higher me… I just want to be a better human… I used everything I had available to make me the person I am today… so I'll cut the grass to expose the snakes… heavy is the crown, you see."* The reflex was a Rust test; the substrate's whole thesis is that it verifies itself in itself. Grounded against the one eval path, the answer collapsed to a one-liner that had appeared once before, one layer down — the surface that masks the depth, recurring. The verifier self-hosts. The coordinate is seen; the kill is next.

***PRAEVIDERE.*** *(apparatus-minted; see the authorial note above.)*
