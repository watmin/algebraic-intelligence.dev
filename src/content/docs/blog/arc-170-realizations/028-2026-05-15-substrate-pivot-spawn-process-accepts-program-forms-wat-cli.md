---
title: "2026-05-15 — Substrate pivot: spawn-process accepts program forms (wat-cli IPC contract)"
sidebar:
  order: 28
---

**Pivot moment.** After the 4a chain shipped + 4c-α-i + 4c-α-ii landed, the slice 4c-α-ii migration honestly surfaced that the canonical `:wat::test::run-hermetic` macro's body-AST shape LOST CAPABILITIES the legacy `:wat::kernel::run-sandboxed src stdin scope` had:

- `(:wat::config::set-capacity-mode! ...)` at top-of-source (parse-time config) couldn't be expressed in body-AST shape (body is fn-wrapped runtime code; set-! is not a runtime verb)
- `scope :Option<String>` drove `ScopedLoader` containment — body-AST shape has no surface for it

User surfaced the architectural shape: **a wat process IS a wat program — and `wat some-file.wat` already defines the contract:** stdin = inputs; stdout = outputs; stderr = panics. Anything legal at the top of a wat file (top-level config setters, helper defines, type declarations, finally `(define :user::main ...)`) belongs in the substrate's program shape.

### The pivot

`:wat::kernel::spawn-process` changes signature:

```
;; Before (arc 170 slice 1c "fn-only" narrowing)
(:wat::kernel::spawn-process fn) -> Process<I,O>

;; After (this slice)
(:wat::kernel::spawn-process program :Vec<WatAST>) -> Process<I,O>
;; program is exactly what a wat file is — top-level forms ending in
;; (:wat::core::define (:user::main -> :nil) ...).
;; Substrate ships the forms; child parses them through the same path
;; as `wat some-file.wat` would; Config::from_source collects top-level
;; setters at parse time; :user::main runs at runtime.
```

**IPC contract = wat-cli contract.** spawn-process unifies semantically with `wat some-file.wat` — same operation, different access surfaces. stdin / stdout / stderr behave identically.

### Why this is the right answer (four-questions YES YES YES YES)

- **Obvious?** YES — wat process takes wat program; substrate is honest about what's happening.
- **Simple?** YES — substrate's contract unifies; macro layer absorbs ergonomics (still `(run-hermetic body)` at user surface).
- **Honest?** YES — no hiding of child program structure from the substrate API; substrate-imposed-not-followed discipline; macros own ergonomics, substrate stays uniform.
- **Good UX?** YES — 99% case (macro callers) unchanged at user surface; 1% case (config-needing tests) gets a clean variant `run-hermetic-with-config` that exposes the prelude slot.

### The decay record (honest)

This session, the orchestrator made multiple substrate-fact failures that landed in BRIEFs as wrong claims:

1. Asserted `scope` was "never functional plumbing" — wrong; ScopedLoader was real (sonnet caught it in 4c-α-ii SCORE Finding 3).
2. Framed `set-capacity-mode!` not-body-callable as a "finding" — it's core language design (config = startup-time / runtime code can't mutate it). User surfaced this as decay.
3. Then asserted set-! is "broken in any body regardless of context" — also wrong; set-! IS callable in a fork's child at top-of-source (parse-time). The body-AST shape constrains this, not the substrate.
4. Multiple `feedback_assertion_demands_evidence` failures: claiming substrate facts without grep.

User patience exhausted enough to surface the pattern: *"you have clearly forgotten too much."*

**Discipline for the slice ahead:** orchestrator's BRIEF describes the TARGET SHAPE and the WAT-CLI CONTRACT model; sonnet has authority on substrate-internal discovery (which fn in src/spawn_process.rs to modify; how the child receives the program; how the existing fn-shape callers update). The orchestrator does not assert substrate facts in this BRIEF that haven't been verified by grep.

### What this slice supersedes / re-evaluates

- **4c-α-iii (check.rs fixtures audit + migration)** — fixtures may need different migration shape under new substrate; re-evaluate post-pivot.
- **4c-α-iv (atomic delete sandbox.wat / hermetic.wat)** — sandbox.wat / hermetic.wat's wat-side helpers may become redundant under new substrate; re-evaluate.
- **4b (wat-cli Stone B — fork_program_from_source → spawn-process)** — naturally fits the new shape since spawn-process now matches wat-cli's IPC contract.
- **4c (substrate Rust deletion of spawn-program* / fork-program*)** — likely simplifies under new shape.
- **4d (Phase H clippy)** — unchanged.
- **5 (INSCRIPTION)** — incorporates the pivot.

The chain stays; the substrate redesign lands in the middle, then the cleanup completes with the new substrate as the foundation.

### Task

**#323 — arc 170 Slice 6 — spawn-process accepts program forms (wat-cli IPC contract)**

Decomposition (stepping stones) TBD per the slice's own BRIEF. Likely shape:
- α: substrate `spawn-process` signature change + canonical macros update (`run-thread`, `run-hermetic`, `run-hermetic-with-io`) to construct program shape
- β: mint `run-hermetic-with-config` macro variant exposing prelude slot
- γ: rescue capability-losing tests from 4c-α-ii (capacity-mode + scope) using the new variant
- δ: paperwork

### Current known-good state

- Tip: `ddfb6b5` (Slice 4c-α-ii sweep)
- Working tree: clean
- Tests passing per slice 4c-α-ii: 2271 passed / 2 failed (pre-existing rotation members)
- Worktrees clean; no orphan procs

The substrate teaches; we listen; we PIVOT and ship.

---
