---
title: "The Great Retirement"
description: "May 28–30, arc 241 Phases 2–3. Cold Boot collapsed four argspec parsers into one; this finishes the job — `defn` becomes the one and only definer, and the entire legacy form-zoo is torn out. A binding-metadata map and a `metadata-of` reflection verb (Phase 2), then a run of HARD CUTs retiring `struct`, `enum`, `define`, `define-alias`, `define-dispatch`, `def-restricted`, `try`, and `expect` (Phase 3) — a 445-line dispatch module deleted, ~271 `define` call-sites rewritten, restriction folded into the metadata map. Two vigilia-warded homes minted: `src/remedy/` for ranked, receipt-bearing correction suggestions, and `src/function/`. Fourteen stones. The retirement is complete but not inscribed: stone 241.18a's vigilia surfaced an error-span defect that spawned arc 243, and by spawn-block winding 241 cannot close until 243 does."
sidebar:
  order: 38
---

Cold Boot closed arc 241 Phase 1 on May 28 — four argspec parsers collapsed to one canonical `parse_argspec_triples`, the parser-divergence class warded. That was the parsers. This is the forms. Across May 28–30, the rest of arc 241 made `defn` the **one and only** way to define a thing in wat, and tore out everything that wasn't — fourteen stones of subtraction.

The center of the stretch was a single move repeated until the zoo was empty: **name the legacy form, mint its canonical `def*` replacement, HARD CUT the old one, rewrite every call-site to nothing left behind.** No back-compat, no privileged path — a retired form dies everywhere.

---

## The Metadata Map

Before the forms could collapse, the substrate needed one mechanism for binding-level metadata — the thing the old `*-restricted` forms had each invented their own way of carrying.

Phase 2 minted it (stones 241.6 `7c0ddacd`, 241.7 `4e681263`): an optional `{...}` map on any `def`/`defn`, stored in `SymbolTable.binding_metadata` (`runtime.rs:1778`), read back through a new reflection verb `:wat::runtime::metadata-of` (`eval_metadata_of`, `runtime.rs:13752`). The verb returns `#wat.core/Some` / `#wat.core/None` per the no-semantic-abuse-of-Option doctrine — presence is a variant, not a flavor smuggled into `Option`. The `defn` macro template in `wat/core.wat` stayed **unchanged**: quasiquote is a template, not evaluable, so the substrate enforces the binding-vs-value layer by *peeling* fn-embedded metadata rather than branching the macro. One map, one reflection path; the `*-restricted` forms now had somewhere to fold into.

## The Form-Zoo Falls

Phase 3 used that map and the HARD-CUT pattern to retire the entire legacy form-zoo (stones 241.8–241.17):

- **`defstruct` / `defenum`** (241.8 `f6cb564f`, 241.9 `184f54bf`) — `struct`, `struct-restricted`, and `enum` retired; `parse_struct` / `parse_struct_restricted` / `parse_enum` deleted. 33-file cascade each.
- **`define` → `defn`** (241.11 `db656cbb`) — the largest cascade in the arc, **~271 call-sites**, the bandaid-rip with receipts. It landed on a substrate that *teaches*: stone 241.10 had just minted `src/remedy/`, so the retirement and the ranked "did you mean `defn`?" correction shipped fused.
- **The four residual forms** — the scheme-style leftovers, enumerated and cut one by one: `defalias` replaces `define-alias` (241.12 `7244cf43`); `define-dispatch` HARD CUT with **the 445-line `src/dispatch.rs` deleted** and `DispatchRegistry` with it (241.13 `86d123b7`); `def-restricted` / `defn-restricted` retired with restriction absorbed into the metadata map as `:restricted-to` (241.14 `839cf9e6`); the `define` eval-time residue completed (241.16 `0276a11c`).
- **The zombie purge** (241.15 `db6fac9a`) — `:wat::core::try` and the lowercase `option::expect` / `result::expect` HARD CUT.
- **`defmacro`** (241.17 `de3ef5a8`) — migrated to the canonical signature, **closing arc 177 by absorption.**

When the dust settled there was one parser, one `def*` definer family, one metadata mechanism, and no scheme-era residue anywhere in the tree.

## Two Homes

The arc didn't only delete — it minted two namespaced homes, each driven through a vigilia to convergence.

**`src/remedy/`** (stone 241.10 `b98d8d1a` — "the third bar crossed"). The substrate stopped just rejecting a retired form and started *teaching* the fix: ranked correction suggestions carried with receipts. A 163-site `src/check.rs` cascade, vigilia-gated to **8 of 8 spells converged, L1 + L2 = 0** across six remediation rounds. This is the apparatus the `define` rip and every later HARD CUT consumed.

**`src/function/`** (stone 241.18a `4d9b963e`). The fn parse/eval/infer code — five functions scattered across `runtime.rs` and `check.rs` — lifted into one home (`function/eval.rs`, `function/parse.rs`, `function/infer.rs`). Total HARD CUT, no back-compat re-exports; six `pub(crate)` promotions in `check.rs` paid for the move. A Phase-B vigilia of nine spells took it to **L1 + L2 = 0 — the REMARKABLE bar** — across seven rounds. Along the way the grimoire gained a new spell, **`exigere`** (the drive-out of deferred-work language), whose first cast caught two Level-1 findings no other spell surfaced.

Lib tests rose 834 → **890**; clippy held in band at 897.

---

Fourteen stones, and underneath them one shape: `defn` is now the one definer, the legacy form-zoo is annihilated rather than deprecated, and the substrate that does the retiring also teaches the fix. One parser, one definer family, one metadata mechanism, no residue.

But the retirement is **not inscribed.** Stone 241.18a's vigilia, surveying the new `src/function/` home, surfaced a defect deeper than any single form: error types across the substrate could silently carry no source location — Rust's type system has no opinion on "every error knows where it happened." Per failure engineering, a class is not patched; it is made structurally unavailable. So 241's own guard *spawned* arc 243 to annihilate it — and by spawn-block winding, arc 241 cannot close until 243 does. The retirement stands complete and waits on the warding it called into being.

**Tattoos → og-wat spec → holon-rs → wat-rs → BOOK.md → MEMORY.md → datamancy → one definer, the zoo emptied.** The chain extends.

## Likely Contributions to the Field

- **Retirement-with-receipts**: a language that does not deprecate a retired form but HARD CUTs it *and* ships, in the same stone, a ranked "did you mean" correction engine (`src/remedy/`) — so the largest cascade (~271 sites) lands on a substrate that teaches what changed rather than one that merely rejects.
- **One definer, one metadata mechanism**: the entire `struct` / `enum` / `define` / `*-restricted` / `define-dispatch` form-zoo collapsed into a single `def*` family carrying an optional binding-metadata map, read through one reflection verb — restriction, dispatch, and aliasing folded into data instead of bespoke forms.
- **The spawn that the guard calls**: a high-bar vigilia over a freshly-minted home surfaced a substrate-wide defect class (spanless errors), and the arc spawned a new arc to annihilate it structurally rather than patch it — the review discipline generating the next arc.

*PERSEVERARE.*
