---
title: "The Warding"
description: "May 30–31, arc 243 — open, in flight, snapshotted here in its present tense. The retirement's vigilia surfaced a defect deeper than any form: across the substrate, an error type could silently carry no source location — Rust has no opinion on 'every error knows where it happened,' so diagnostics could degrade to 'something failed somewhere.' Arc 243 makes that bad state structurally uncompilable. The discipline (CONFORMARE.md, 243.1 `21cd77ff`): Pattern A — an outer `struct { span, kind }` whose constructor demands a bare `Span`, never an `Option`; the type cannot lie about having one. A new audit spell, `conformare`, was minted to enforce it. The worked retrofit (243.3) collapsed a 16-arm span-match to a single `e.span`. A `src/check/` home was minted with a borrow redesign that made a deep clone a compile error (243.3.1 `22c89e04`). Four flat modules were lifted into vigilia-warded homes. `remedy` is in flight; `comms` remains; the inscription fires last. The arc is co-held: the substrate proposes, the user holds the bar — and holds the word *warded* to mean the class is gone, not the file is quiet."
sidebar:
  order: 40
---

The retirement stood complete and uninscribed because the watch found something neither the user nor the substrate had gone looking for. Stone 241.18a's vigilia, surveying the freshly-minted `src/function/` home, surfaced a defect deeper than any single form: across the whole substrate, an error type could be constructed carrying **no source location.** Rust's type system has no opinion on "every error knows where it happened" — so an error variant could go spanless, and the diagnostic it produced would degrade to *something failed somewhere.*

The call was immediate and shared, because it was the discipline the two had been running for months: a class like this is not patched. You do not fix the symptom — you make the bad state structurally unavailable. So arc 241's own guard spawned arc 243, and by spawn-block winding, 241 cannot close until 243 does.

This post is a snapshot of an arc still running. It opened May 30 and is live as this is written — `remedy` in flight, `comms` still standing, the inscription not yet struck. What follows is the present tense of the substrate.

---

## The Discipline

Stone **243.1 `21cd77ff`** shipped the doctrine as `wat-rs/docs/CONFORMARE.md`, sibling to `ZERO-MUTEX.md`: *an error type must guarantee diagnostic completeness **structurally.** The constructor must demand the span. The type cannot lie about having one.*

The cure is named **Pattern A.** An error becomes an outer `struct { span: Span, kind: ErrorKind }`, where `ErrorKind` carries each variant's *unique* data and **no** per-variant span. The constructor demands a bare `Span` — never an `Option<Span>`, because an option is a license to pass `None`. Consumers read `err.span` through **one** path, never an N-arm match that each variant could get wrong differently.

The choice between Pattern A and the obvious alternative — a `trait Conformare { fn span() -> Span }` — got made the way every doctrine call gets made here: through the four questions, out loud. A trait only enforces that you *have* an accessor; a variant can still implement it as `Span::unknown()` and lie. The struct makes the span a field the constructor cannot omit. Structure beats convention because structure cannot be talked around — and that is the line the user holds on every doctrine: the one that ships is the one the compiler can enforce, not the one a reviewer has to remember. The arc minted a new audit spell, **`conformare`** (folded as 243.2, published to the grimoire as `datamancy.dev/conformare`), to walk error types and refuse any that fail the pattern.

## The Worked Retrofit

Stone **243.3** put Pattern A through the first real type. `TypeError` became `struct TypeError { span, kind }` (`types.rs:1421`) over a 16-variant `TypeErrorKind`, across ~80 emitter sites and ~10 consumers. The payoff was a single consumer: the **16-arm `match` in `function/parse.rs` that dug the span out of each variant collapsed to `e.span`** — seventeen lines to five. That is the whole thesis in one diff. When the type guarantees the span, the code that reads it stops being a forest of cases and becomes one field access. The one variant with a genuine domain reason to lack a span — `CyclicSubtype`, a cycle has no single site — carries an explicit `rune:conformare(spanless-by-domain)`: an annotation that says this exception was seen and judged, not a silence.

## The Home and the Borrow

The retrofit's home came with it. Stone **243.3.1 `22c89e04`** minted `src/check/` — `check.rs` `git mv`'d to `check/mod.rs`, ~21k lines preserved — and redesigned `CheckEnv` to **borrow** rather than clone. The old environment deep-cloned a `TypeEnv` and a metadata map on construction; the redesign changed `types: Arc<TypeEnv>` to `&'a TypeEnv` and the metadata to `Option<&'a HashMap>`, which made the deep clone **a compile error.** That is failure engineering at the ownership layer — the wasteful construction is not discouraged, it is un-writable — and it killed two live clones (`check.rs:2019`, `:2175`). The structure-probe flipped from *fails to compile,* five errors, to 3-of-0 passing. The lifted resident `env.rs` (266 lines) was driven to **L1 + L2 = 0, the REMARKABLE bar,** across eight spells.

The 21k-line `mod.rs` remainder was **not** held to that bar — and the user named why, because the easy mistake is to claim the whole directory or to over-correct and damn the remainder as hidden debt. Neither. The bar governs the *lifted resident,* the thing pulled into a warded home and perfected there; the remainder is functional-but-untrusted by design, awaiting its own future lift. *Selective lift-and-ward:* the home grows one warded resident at a time.

## The Homes Walk

Alongside the `TypeError` retrofit runs a second front: lifting flat `src/*.rs` modules into namespaced homes and **warding** each.

*Warded* is the user's word, and the user holds it to a hard meaning. It does not mean the file compiles and the tests pass. It means a failure domain was **found and annihilated.** L1 + L2 = 0 is the measurement; *warded* is the **claim** that the class is gone — and a claim has to be true. That distinction did real work here: `rust_deps` is the oldest code in wat-rs, the code most easily waved through as "surely clean." It wasn't. Thirteen findings under a seven-spell vigilia, and `marshal.rs` turned out to be a name-lie — a file named for marshalling that held ownership primitives and did zero marshalling. The oldest code earned the same warding as the newest, because the word does not bend for seniority.

Four homes are warded:

- **`check/env.rs`** (`22c89e04`) — above.
- **`rust_deps`** (`7b89053e`) — the ownership cells (`ThreadOwnedCell`, `OwnedMoveCell`) lifted to `custodia.rs`; the `marshal.rs` name-lie corrected.
- **`argspec`** (`b64b04b4`) — `ArgSpecError` brought to Pattern A under a three-round vigilia, after a retracted premature stamp and a fabricated-anchor correction.
- **`function`** (`4e15e8a7`) — **the `CONFORMARE.md` worked example genuinely retired.** `ParseStep::ArityMismatch { actual: usize }` — a spanless variant carrying a dead payload — was *deleted,* and `parse_fn_signature_prefix` changed to take `sig: &[WatAST; 3]`. Arity is now **type-impossible**: a slice of exactly three cannot have the wrong length, so the `if sig.len() != 3` guard simply ceased to exist. The bad state was not checked for; it was made unrepresentable.

`remedy` is **in flight, not yet warded** — its latest round makes `RemedyKind::Typo(u32)` into `Typo(NonZeroU32)`, so a distance-zero "typo" is unrepresentable, the same type-impossible move; the worktree is dirty and the cast is pending. `comms` remains — the last home, the biggest blast radius.

And the `function` ward cost honestly. Six vigilia rounds, and six times the substrate's hand moved before the evidence was in — a premature stamp, a fabricated anchor reached for three times (once landing on a real commit by accident), a near-miss blind commit. Every one was the same root: acting before the evidence was complete. Every one the user caught before it shipped. None reached the world as a substrate defect — the structural ward was clean from round one; the friction was the *process,* not the code, and the discipline is what caught the process. This is the unglamorous half of the collaboration: the substrate proposes fast, the user holds the bar, and the bar is what makes the speed safe. (The `vigilatum` marker that records each warding is now **hashless** for exactly this reason — an earlier form embedded an `@<commit>` hash, which forced the marker to name a commit that did not exist until the marker was written, and fabricated false anchors four times in one session. Git is the anchor; the line states the fact.)

## Ongoing

The arc is not done, and not all of what surfaced gets fixed. Some of it was deliberately left, on the user's call.

A speculative optimization whose necessity was unproven — a cost that may never occur at runtime — drew the verdict to leave it alone:

> leave this one ... maybe this'll reveal itself through work

A preemptive fix to an unconfirmed cost is its own kind of dishonesty; the need has to reveal itself before the fix earns its place. And `parse_defstruct`'s extraction, two steps out at the already-named Stone 243.5, was let stand under the same eye:

> that's two steps away? defers that are within reach are tolerable

A deferral to a named, in-reach stone is honest. A deferral to nowhere is debt. The difference is distance, and the user reads the distance.

What remains is named and unstruck: 243.4 rewrites `CONFORMARE.md` to require a namespaced home; 243.5 mints `src/types/` and decomposes `parse_defstruct`; 243.6 brings `CheckError`'s 34-variant flat enum to Pattern A; 243.7+ is a rolling audit of `RuntimeError`, `LexError`, `LoadError`; 243.M is a sister-walk of the parser API so every bare-slice signature gains its `head_span`; and 243.N is the inscription, which fires last — after `remedy` wards, after `comms` falls. Only then does arc 241 close behind it.

That the retirement spawned this is not the retirement stuck. It is the guard working exactly as built — and the guard is not the substrate alone. A high-bar review found a defect deeper than the home it was cast on; the call to spawn an arc rather than wave it through was the shared discipline, not the tool. The deeper the looking, the more it finds; what it finds becomes the next arc; and the user holds the word *warded* to mean the class is gone, not the file is quiet. The warding is the substrate's present tense — and the present tense has two authors.

**Tattoos → og-wat spec → holon-rs → wat-rs → BOOK.md → MEMORY.md → datamancy → the bad state made uncompilable, one home at a time.** The chain extends — and this link is still being forged.

## Likely Contributions to the Field

- **Diagnostic completeness as a type guarantee**: an error-handling discipline (Pattern A) in which the source span is a struct field the constructor cannot omit — never an `Option` — so an error type *cannot* be constructed without knowing where it happened, and the N-arm span-extraction match that every prior design needed collapses to a single field read.
- **Make the bad state uncompilable, repeatedly**: across the arc, illegal states are removed structurally rather than checked for — a deep clone made a compile error by borrowing, an arity mismatch made type-impossible by a fixed-length slice, a distance-zero typo made unrepresentable by `NonZeroU32`. Do not guard against the bad value; make it un-writable.
- **The fast hand and the held bar**: the collaboration shape that made the warding safe — the substrate proposes at speed (and erred six times in one home by acting before the evidence was in), and a human bar catches every premature move before it ships, so none reaches the artifact. Speed and rigor are not traded; one proposes, the other gates.

*PERSEVERARE.*
