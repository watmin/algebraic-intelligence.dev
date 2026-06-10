---
title: "2026-05-16 — arc 199 REJECTED + D1 refactored to clean call form"
sidebar:
  order: 38
---

Opened arc 199 (parametric-keyword expressiveness in defmacro) earlier same day on the back of Stone D1's verbose call form. DESIGN sketch ran four-questions on three candidates; Candidate 1 (expand-time `:wat::ast::parametric-keyword` constructor) led.

**Then user asked me to investigate existing substrate machinery.** Findings:

- `:wat::core::keyword/from-string` (src/check.rs:11931) — String → keyword Value (adds `:` prefix; rejects `:`-prefixed input)
- `:wat::core::keyword/to-string` (src/check.rs:11923) — keyword → String (strips `:` prefix)
- `:wat::core::string::concat` (src/check.rs:4653) — variadic String concat
- **Computed unquote at macro expand time** — arc 143 slice 2 (src/macros.rs:1010+). When `~(:keyword/op args...)` appears in a defmacro template, the expander substitutes macro params into the expression, calls `crate::runtime::eval` AT EXPAND TIME, then `value_to_watast` converts the result to a `WatAST` node landing at the `~(...)` position.
- `value_to_watast` (src/runtime.rs:8815) — `Value::wat__core__keyword(k) → WatAST::Keyword(k)` is the working conversion.

Production precedent: arc 143 slice 6's `:wat::runtime::define-alias` macro (wat/runtime.wat:22-29) uses the EXACT pattern — `~(:wat::runtime::rename-callable-name ...)` at expand time. In production since arc 143 shipped (2026-05).

**Arc 199 REJECTED 2026-05-16.** DESIGN.md inscribed with REJECTED header; original DESIGN text preserved as historical artifact (per `feedback_inscription_immutable`).

### Stone D1 refactored same-day

Macro signature changes:
- **Before:** `(run-threads :Receiver<I> :Sender<O> factory client-fn)` — caller spells out full channel wrappers
- **After:** `(run-threads :I :O factory client-fn)` — caller passes just type args; macro constructs `:Receiver<I>` / `:Sender<O>` at expand time via computed-unquote

Test call site updates: `:rust::crossbeam_channel::Receiver<wat::core::String>` → `:wat::core::String`. Test green; baseline preserved at 4.

### Macro dialect note (Clojure-style)

- `~` = unquote
- `~@` = unquote-splicing
- `,` = whitespace literal (commas are visual separator only, like Clojure)

Some substrate docs use classical Clojure `,` notation when DESCRIBING quasiquote semantics. The actual wat source uses `~`.

### D2/D3 unblocked

With arc 199 rejected and D1 on the clean shape, D2 (multi-factory) and D3 (panic cascade) build on the cleaner call form directly. Stone E (run-processes) similarly unblocks.

### Lesson captured

**Before opening a substrate arc, investigate existing substrate machinery for the pattern in question.** Arc 199's DESIGN sketch spent cycles on four-questions across three candidates for a non-problem. The fix: grep + read the relevant primitives FIRST.

Discipline anchor: `feedback_assertion_demands_evidence` — "the substrate is missing X" needs evidence the substrate doesn't have X. The user's intuition ("we solved symbols in macros already") was correct; the orchestrator's opening of arc 199 was the reflex `feedback_no_new_types` exists to catch — applied at substrate-arc level, not just at within-arc type/verb level.

Upstream of `feedback_no_new_types`: don't open new substrate arcs without proving the existing substrate doesn't already solve it.

---
