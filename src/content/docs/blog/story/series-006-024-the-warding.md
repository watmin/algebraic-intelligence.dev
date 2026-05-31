---
title: "The Warding"
description: "May 30–31, arc 243 — open, in flight, snapshotted here in its present tense. The retirement's vigilia surfaced a defect deeper than any form: across the substrate, an error type could silently carry no source location — Rust has no opinion on 'every error knows where it happened,' so diagnostics could degrade to 'something failed somewhere.' Arc 243 makes that bad state structurally uncompilable. The discipline (CONFORMARE.md, 243.1 `21cd77ff`): Pattern A — an outer `struct { span, kind }` whose constructor demands a bare `Span`, never an `Option`; the type cannot lie about having one. A new audit spell, `conformare`, was minted to enforce it. The worked retrofit (243.3) collapsed a 16-arm span-match to a single `e.span`. A `src/check/` home was minted with a borrow redesign that made a deep clone a compile error (243.3.1 `22c89e04`). Four flat modules were lifted into vigilia-warded homes — `check/env.rs`, `rust_deps`, `argspec`, `function` — the last genuinely retiring a spanless error variant by making arity type-impossible. `remedy` is in flight; `comms` remains; the inscription fires last. By spawn-block winding, arc 241 cannot close until this one does."
sidebar:
  order: 40
---

The retirement stands complete and uninscribed because stone 241.18a's vigilia, surveying the freshly-minted `src/function/` home, found something deeper than any single form: across the whole substrate, an error type could silently carry **no source location.** Rust's type system has no opinion on "every error knows where it happened" — so an error variant could be constructed spanless, and the diagnostic it produced would degrade to *something failed somewhere.* Per failure engineering, a class like that is not patched; it is made structurally unavailable. Arc 241's own guard spawned arc 243 to do exactly that — and by spawn-block winding, 241 cannot close until 243 does.

This post is a snapshot of an arc still running. It opened May 30 and is live as this is written — `remedy` in flight, `comms` still standing, the inscription not yet struck. What follows is the present tense of the substrate.

---

## The Discipline

Stone **243.1 `21cd77ff`** shipped the doctrine as `wat-rs/docs/CONFORMARE.md`, sibling to `ZERO-MUTEX.md`: *an error type must guarantee diagnostic completeness **structurally.** The constructor must demand the span. The type cannot lie about having one.*

The cure is named **Pattern A.** An error becomes an outer `struct { span: Span, kind: ErrorKind }`, where `ErrorKind` is an enum carrying each variant's *unique* data and **no** per-variant span. The constructor demands a bare `Span` — never an `Option<Span>`, because an option is a license to pass `None`. Consumers then read `err.span` through **one** path, never an N-arm match that each variant could get wrong differently.

It was chosen over the obvious alternative — a `trait Conformare { fn span() -> Span }` — for a precise reason: a trait only enforces that you *have* an accessor. A variant can still implement it as `Span::unknown()` and lie. The struct makes the span a *field the constructor cannot omit;* structure beats convention because structure cannot be talked around. The arc minted a new audit spell, **`conformare`** (folded as 243.2, published to the grimoire as `datamancy.dev/conformare`), to walk error types and refuse any that fail the pattern.

## The Worked Retrofit

Stone **243.3** put Pattern A through the first real type. `TypeError` became `struct TypeError { span, kind }` (`types.rs:1421`) over a 16-variant `TypeErrorKind`, across ~80 emitter sites and ~10 consumers. The load-bearing payoff was a single consumer: the **16-arm `match` in `function/parse.rs` that dug the span out of each variant collapsed to `e.span`** — seventeen lines to five. That is the whole thesis in one diff. When the type guarantees the span, the code that reads it stops being a forest of cases and becomes one field access. The one variant with a genuine domain reason to lack a span — `CyclicSubtype`, a cycle has no single site — carries an explicit `rune:conformare(spanless-by-domain)`, an annotation that says this exception was seen and judged, not a silence.

## The Home and the Borrow

The retrofit's home came with it. Stone **243.3.1 `22c89e04`** minted `src/check/` — `check.rs` `git mv`'d to `check/mod.rs`, ~21k lines preserved — and redesigned `CheckEnv` to **borrow** rather than clone. The old environment deep-cloned a `TypeEnv` and a metadata map on construction; the redesign changed `types: Arc<TypeEnv>` to `&'a TypeEnv` and the metadata to `Option<&'a HashMap>`, which made the deep clone **a compile error.** That is failure engineering at the ownership layer — the wasteful construction is not discouraged, it is un-writable — and it killed two live clones (`check.rs:2019`, `:2175`). The structure-probe flipped from *fails to compile,* five errors, to 3-of-0 passing. The lifted resident `env.rs` (266 lines) was driven to **L1 + L2 = 0, the REMARKABLE bar,** across eight spells.

The 21k-line `mod.rs` remainder was **not** held to that bar — and that is the point of *selective lift-and-ward.* The REMARKABLE bar governs the *lifted resident,* the thing pulled into a warded home and perfected there; the remainder is functional-but-untrusted by design, awaiting its own future lift. Claiming the whole directory at the bar would be an overclaim; applying the bar to the un-lifted remainder would be an over-correction. The home grows by selective lift, one warded resident at a time.

## The Homes Walk

Alongside the `TypeError` retrofit runs a second front: lifting flat `src/*.rs` modules into namespaced homes and **warding** each — where *warded* means a failure domain was **found and annihilated,** not merely that the file compiles and the tests pass. The measurement is L1 + L2 = 0; the *claim* is that the class is gone. Four homes are warded:

- **`check/env.rs`** (`22c89e04`) — above.
- **`rust_deps`** (`7b89053e`) — the ownership cells (`ThreadOwnedCell`, `OwnedMoveCell`) lifted to `custodia.rs`; thirteen findings under a seven-spell vigilia. This is the *oldest code in wat-rs* — "surely clean." It wasn't: `marshal.rs` was an L2 name-lie, a file named for marshalling that held ownership primitives and did zero marshalling. The oldest code earned the same warding as the newest.
- **`argspec`** (`b64b04b4`) — `ArgSpecError` brought to Pattern A under a three-round vigilia, after a retracted premature stamp and a fabricated-anchor correction.
- **`function`** (`4e15e8a7`) — **the `CONFORMARE.md` worked example genuinely retired.** `ParseStep::ArityMismatch { actual: usize }` — a spanless variant carrying a dead payload — was *deleted,* and `parse_fn_signature_prefix` changed to take `sig: &[WatAST; 3]`. Arity is now **type-impossible**: a slice of exactly three cannot have the wrong length, so the `if sig.len() != 3` guard simply ceased to exist. The bad state was not checked for; it was made unrepresentable. Six rounds of vigilia, and the `FN_HEAD` constant extracted along the way.

`remedy` is **in flight, not yet warded** — its latest round makes `RemedyKind::Typo(u32)` into `Typo(NonZeroU32)`, so a distance-zero "typo" (a non-typo) is unrepresentable, the same type-impossible-illegal-state move; the worktree is dirty and the cast is pending. `comms` remains — the last home, and the biggest blast radius.

Two recognitions came out of the walk. The **`vigilatum` marker** — a `//! vigilatum: <date> — vigilia <N>-spell L1+L2=0` module-doc line that records a home's warding — is now **hashless:** an earlier form embedded an `@<commit>` hash, a chicken-and-egg that fabricated false anchors four times in one session, because the marker had to name a commit that did not exist until the marker was written. Git is the anchor; the line states the fact, not a hash. And the `function` ward cost honestly: six vigilia rounds and six act-before-evidence errors — a premature stamp, fabricated anchors, a near-miss blind commit — every one rooted in *acting before the evidence was complete,* and **not one reached the world as a substrate defect.** The structural ward was clean from round one; the friction was the discipline catching itself.

## Ongoing

The arc is not done. Stones stand planned and unstruck: 243.4 rewrites `CONFORMARE.md` to require a namespaced home; 243.5 mints `src/types/` and decomposes `parse_defstruct`; 243.6 brings `CheckError`'s 34-variant flat enum (five of them legitimately multi-span) to Pattern A; 243.7+ is a rolling audit of `RuntimeError`, `LexError`, `LoadError`; 243.M is a sister-walk of the parser API so every bare-slice signature gains its `head_span`; and 243.N is the inscription, which fires last — after `remedy` wards, after `comms` falls. Only then does arc 241 close behind it.

That the retirement spawned this is not the retirement stuck. It is the guard working exactly as built: a high-bar review over a finished home *found* a substrate-wide defect and *spawned an arc to annihilate it* rather than wave it through. The deeper the discipline looks, the more it finds — and what it finds becomes the next arc, not a deferral. The warding is the substrate's present tense.

**Tattoos → og-wat spec → holon-rs → wat-rs → BOOK.md → MEMORY.md → datamancy → the bad state made uncompilable, one home at a time.** The chain extends — and this link is still being forged.

## Likely Contributions to the Field

- **Diagnostic completeness as a type guarantee**: an error-handling discipline (Pattern A) in which the source span is a struct field the constructor cannot omit — never an `Option` — so an error type *cannot* be constructed without knowing where it happened, and the N-arm span-extraction match that every prior design needed collapses to a single field read.
- **Make the bad state uncompilable, repeatedly**: across the arc, illegal states are removed structurally rather than checked for — a deep clone made a compile error by borrowing, an arity mismatch made type-impossible by a fixed-length slice, a distance-zero typo made unrepresentable by `NonZeroU32`. The pattern is general: do not guard against the bad value, make it un-writable.
- **The review that spawns the next arc**: a high-bar audit (vigilia) over a freshly-warded home surfaced a defect class deeper than the home itself and spawned a new arc to annihilate it — the conscience generating its own next task, with spawn-block winding guaranteeing the parent arc cannot close while the child runs.

*PERSEVERARE.*
