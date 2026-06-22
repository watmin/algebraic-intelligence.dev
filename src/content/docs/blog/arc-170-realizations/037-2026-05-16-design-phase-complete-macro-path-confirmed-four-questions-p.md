---
title: "2026-05-16 (design phase complete) — macro path confirmed; four questions pass YES YES Y…"
sidebar:
  order: 37
---

**The macro question (Option A vs B) was the last open implementation-level concern.** User's framing on Q2 (Request/Reply naming + bidirectional handle types): settled as two distinct types (`Thread/Client<I,O>` + `Thread/Server<I,O>`) with Request/Reply being user-aliased semantic naming, not substrate-imposed. Heterogeneity via tuple, not Vec.

### The macro approach — confirmed on disk

User's nudge: *"i'm very confident we have solved all known type issues completely - but - go look at the macro stuff and confirm - the file system has all of you answers."*

Verified on disk (per `feedback_assertion_demands_evidence`):

**Exact precedent — `:wat::test::program`** at `wat/test.wat:228-231`:

```scheme
(:wat::core::defmacro
  (:wat::test::program & (forms :AST<wat::core::Vector<wat::WatAST>>)
    -> :AST<wat::core::Vector<wat::WatAST>>)
  `(:wat::core::forms ~@forms))
```

Variadic macro takes N AST forms; splices into `forms`. Exactly the pattern `run-threads` / `run-processes` need.

Substrate macro infrastructure confirmed:

- **Variadic params** via `&` (arc 150) — `& (name :AST<wat::core::Vector<wat::WatAST>>)` collects N forms
- **Quasiquote `~` + splice `~@`** — AST construction primitives
- **Computed unquote** (arc 143) — `,(substrate-call ...)` evaluates at expand-time
- **Hygiene** — Racket sets-of-scopes; generated bindings safe
- **Runtime quasiquote + struct->form** (arc 091 slice 8) — programmatic AST manipulation
- **`macroexpand` / `macroexpand-1`** (arc 030) — debugging
- **Symbol-headed application inference** (arc 161) — type system handles compound forms
- **The variadic foundation** is the substrate's explicit substrate-as-teacher principle for "Lisp-natural call shapes without falling back to defmacro-with-runtime-branching or Rust-only primitives" (USER-GUIDE § Variadic functions)

### Locked: Option A (macro) over Option B (substrate special form)

```scheme
(:wat::core::defmacro
  (:wat::kernel::run-threads
    (factories :AST<wat::WatAST>)         ;; the Tuple form AST
    (client-fn :AST<wat::WatAST>)
    -> :AST<wat::WatAST>)
  ;; pattern-match factories' AST to extract sf1/sf2/...sfN children
  ;; quasiquote + splice generates:
  ;;   let with N spawn-bindings + Tuple-construct + client-fn call + N drain-and-join
  ...)
```

Heterogeneity handled at EXPANSION TIME: the expanded code has N explicit spawn calls; each gets its own concrete `Thread<Ik,Ok>` type. Type checker sees fully-typed bindings post-expansion. No special-case substrate generics needed.

### Walker rule remains binary

`*_join-result` stays substrate-internal (removed from user namespace). The bracket macro expands to call substrate-vended `:wat::kernel::Thread/drain-and-join` (or equivalent) — itself a user-callable helper that wraps `*_join-result` internally. Walker rule: user code may NOT call `*_join-result` directly. The macro expansion uses the helper; users use the macro.

### Four questions verdict (final)

| | Status |
|--|--------|
| **Obvious** | YES — actor model + supervised brackets; convergent design across Erlang/Trio/Tokio/Loom/Akka |
| **Simple** | YES — N uniform pieces (spawn primitives + brackets + types + verbs + failure modes), each one piece, composing fractally |
| **Honest** | YES — substrate minimal; user composes; walker enforces; no hidden Result-wrapping; verbose-per-call-site is the form |
| **Good UX** | YES — one canonical path per unit type; fractal composition; type-system-enforced asymmetry; walker rejection teaches the right pattern |

**YES YES YES YES.**

### Status

**Design phase COMPLETE.** The architectural surface is durable. Implementation work has clear shape it can build on:

- Substrate primitives: `spawn-thread`, `spawn-process` (raw; test-mainly)
- Bracket macros: `run-threads`, `run-processes` (canonical user-facing)
- Substrate-vended helpers: `Thread/drain-and-join` etc. (called by bracket macro expansions)
- Types: `Thread<I,O>` / `Process<I,O>` + `Thread/Client<I,O>` / `Thread/Server<I,O>` (substrate-generated)
- Walker collapse: arc 117/133 sibling-binding machinery retires; replaced by binary `*_join-result`-in-user-namespace check
- Fallout: -with-io family + RunResultIO struct die as downstream consequence

**Arc 170 stays OPEN.** Per `feedback_realizations_open_directions`: design completion is NOT arc closure. Arc 170 closes via INSCRIPTION, when the substrate work + walker retirement + tests + USER-GUIDE updates have shipped.

**Next session's move (when user is ready):** start the implementation slice cadence. First slice probably: substrate `spawn-thread`/`spawn-process` typed-channel refinement (matches the new contract) + walker collapse + minimal bracket macro proof. Subsequent slices: full bracket macro implementation, -with-io fallout migration, type-namespace introduction, INSCRIPTION.

The design is durable. Future-me reads this section and knows the answer without re-litigating.

---
