---
title: "One Way to Write Nil"
description: "June 2, arc 244 — opened and closed the same day. Resuming arc 237's smallest feature, a probe refused with an error that made no sense: ':wat::core::nil is a TYPE keyword, not a value' — pointed at a source line that was correct. The substrate was synthesizing the heresy itself. The root was an asymmetry: int, float, bool, and string each had a first-class literal variant; nil was a bare Symbol with no constructor, so seven synthesis sites improvised the type keyword where they meant a value — and arc 242's doctrine had since made the improvisation illegal. The fix is level 3, not level 2: WatAST::NilLit minted, one canonical constructor, all nine synthesis sites swept, and a build-failing gate that makes the heretical form unconstructible in src/. The doctrine deposited: asymmetries must meet a very high bar — the odd member of a family is where the failure domain hides."
sidebar:
  order: 48
---

June 2. Arc 237 had been parked for four days on the smallest possible feature — give `defclause` a `&` rest-binder — and the detour it spawned had finally bottomed out. Arc 241 closed; the `&` was ready. The resumption probe ran. It refused:

```
MalformedForm { head: ":wat::core::nil",
  reason: "Doctrine 1 (arc 242): ':wat::core::nil' is a TYPE keyword, not a value;
           use bare `nil` in value position" }
```

The first read was *stale fixture* — the test must be old, written before arc 242 outlawed type keywords in value position. That read was wrong, and admitting it is the spine of the arc. The probe's source line was `(:wat::core::defn :user::main [] -> :wat::core::nil nil)` — a **valid** 0-ary nil-returning function. The `:wat::core::nil` after `->` is the return *type*, in type position, exactly where a type keyword belongs. The bare `nil` is the body *value*. The source told the truth; the substrate lied. The user pivoted the work on the spot: **attack the substrate, never "fix" the correct test to fit the lie.** A bisection probe (`tests/probe_nil_return_value_position_bug.rs`) isolated the forgery — the offending type keyword was *synthetic*, carrying a defclause's span. The substrate was generating `:wat::core::nil` in a place where it meant a nil value.

## The asymmetry that lied

Two facts in `src/ast.rs`, neither a bug on its own, composed into the wound:

1. **`WatAST::Keyword` is context-polymorphic.** The same Rust variant is a value literal in one position and a type annotation in another, "distinguished by context at later passes." Nothing structural keeps a type keyword out of a value slot — only a check-time string compare ever objected, which is the level the substrate's own Pattern A doctrine forbids relying on.
2. **nil was the lone scalar with no literal variant.** `int`, `float`, `bool`, and `string` each had a `*Lit` variant *and* a constructor. nil had neither — a bare `Symbol`. So when the substrate needed to synthesize a nil **value**, there was no constructor to call, and seven sites improvised the *type* keyword instead. The improvisation worked for months. Then arc 242 made it illegal, and the substrate started rejecting its own output.

The asymmetry created the heresy. And `ast.rs`'s own `children()` comment had already written the cure, years of arcs earlier — *"own it at the substrate layer so callers can't get it wrong; the bug class is structurally eliminated"* — it just had never been applied to nil.

The doctrine the arc deposited, in the user's words: **asymmetries must meet a very high bar for acceptance.** nil-as-bare-`Symbol` while every sibling was a `*Lit` never cleared that bar; it hid until it cost a four-day detour's worth of confusion. The bar is not *does it work*. It is *does the shape tell the truth, symmetrically, so the next author cannot be misled.*

## Level 3, not level 2

A canonical constructor plus a sweep would have been level 2: a convention politely asking the next author to behave, leaving the wrong form expressible. The user named the higher bar — *NilLit and removal of existence* — so the arc cut to level 3 (`9d461518 feat(arc244): mint WatAST::NilLit — annihilate the nil-value-as-type-keyword heresy`):

- **`WatAST::NilLit(Span)`** minted — nil joins the literal family; the asymmetry dies at the type level.
- **`WatAST::nil()`** — the one canonical way to synthesize a nil value. There is no second way.
- A **17-arm substrate-as-teacher cascade**: adding the variant broke every match that needed an arm, and the fail count waterfalled 0 → 17 → 0 as the compiler named every site that had to take a position on nil.
- **All nine synthesis sites swept** through the canonical constructor — no hand-rolled nil left anywhere in `src/`.
- **The removal-of-existence gate** (`tests/gate_no_nil_keyword_synthesis.rs`) — a build-failing test that makes `Keyword(":wat::core::nil")`-as-value unconstructible in `src/` outside the parser and lexer. Re-introducing the heresy is now a red build, not a code-review plea.

The arc-242 check at `check.rs:3375` stayed exactly as it was. It is correct — `:wat::core::nil` *is* illegal in value position. The arc fixed the synthesis and never touched the check: the law stood; the substrate stopped breaking it.

## The kill, verified against the disk

The closing verification re-ran everything independently rather than trusting the implementing agent's report: repro 4/4, lib suite 895/0, the synthetic nil-error gone from the 237.8b probe, the gate live, the doctrine check intact, empty-body type inference preserved. The independent re-run earned its keep immediately — the agent had reported "18 clippy warnings"; the disk said 270. A rustc-vs-clippy conflation, pre-existing flat-file debt rather than a regression, but a wrong claim that would have shipped unchecked. The cast is data; the disk is the verdict.

Two things the arc deliberately did **not** do, each owned rather than deferred vaguely. The now-dead `Symbol("nil")` eval arm in `runtime.rs` belongs to that file's future ward — dead-code purge in a flat untrusted 24k-line file is the work of its reorganization, not a piecemeal edit. And the general context-polymorphism of `Keyword` — the deeper of the two facts — remains a *latent* smell rather than an active bug, named as the next-deeper arc: the structural split of type-keyword from keyword-literal is the cut that finally earns `src/ast/` its ward. `ast.rs` is left **better, not warded**: symmetric literals plus a removal-of-existence gate, honestly functional-but-untrusted until the whole file tells the truth.

## The chain hits its floor

The descent reads, in full: arc 237 parked at 237.8b ⇠ arc 241 ⇠ arc 244 — and 244 is the bottom. A four-day chain that began with *give `defclause` a `&`* ends with the substrate's foundational data structure one asymmetry truer. The inscription closes the arc in nine words:

> nil is a literal. There is one way to write it.

Opened `0f936ff8`, closed `ebf440c4`, the same June 2. 237 unparks.

## Likely Contributions to the Field

- **Asymmetry as a defect class, not a style concern.** The odd member of an otherwise-uniform family (one scalar without a literal variant) is treated as a latent failure domain with a measured blast radius — here, seven improvising call sites and a four-day confusion cost — rather than a harmless quirk. The acceptance bar for any asymmetry is stated structurally: the shape must tell the truth symmetrically, or it goes.
- **"Removal of existence" as the fix standard.** The distinction between level 2 (a canonical path plus convention) and level 3 (the wrong form made unconstructible, enforced by a build-failing gate) is applied to a language AST — the heresy is not discouraged, it is unwritable.
- **Attack the substrate, never the probe.** A nonsense error on a correct source line is treated as the substrate lying, and the correct test is never edited to fit. The bisection isolates a *synthetic* form — the forgery is in generation, not in the user's source — which is a diagnostic pattern most toolchains never separate.
- **Independent re-verification of agent self-reports.** The closing gate re-runs every claim against the disk and catches a wrong count (18 vs 270) that the implementing agent reported in good faith. For LLM-built systems, the cast-is-data / disk-is-verdict separation is the difference between a record and a rumor.
