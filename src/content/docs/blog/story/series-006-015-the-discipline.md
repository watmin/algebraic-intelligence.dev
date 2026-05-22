---
title: "The Discipline"
description: "May 9–15, ~7 days. The substrate continues toward Clojure-faithfulness: struct-destructure in let bindings (arc 169), apostrophe inside keyword bodies (arc 171), Scheme→Clojure macros (arc 172). Then arc 170 opens — the spawn-thread / spawn-process discipline. FD-multiplex phases across the kernel. The deftest migration: every test site moves to the new shape. Slice 6 pivots — spawn-process accepts program forms. One spawn per concern. Test macros allowed on top; legacy retires entirely."
sidebar:
  order: 29
---

The Language closed May 8 with the BOOK voice returning, the Clojure-faithfulness recognition named, and arc 109 winding toward closure. Then the substrate kept polishing.

No BOOK chapters landed between May 9 and May 15 — the work was inside the kernel. Seven days, ~240 wat-rs commits, four lab commits. The arc that anchors this stretch is **arc 170 — the spawn-thread / spawn-process discipline.** The substrate decides that there are exactly two ways to launch concurrent work, that test macros sit on top of them, and that every legacy comm primitive retires. Doctrine, not ergonomics. *Zero wiggle room.*

---

## Three Small Sharpenings

The week opened with three arcs that didn't need a chapter. They were corrections to the Clojure-faithfulness surface arc 168 had just landed.

- **Arc 169** — struct-destructure form A in `let` bindings. `(let [{:keys [a b]} record] ...)` works. Pattern destructure parity with Clojure's `let`.
- **Arc 171** — apostrophe inside keyword bodies. `:trader's-pulse` legal. The colon-permanence held; the body permissions widened.
- **Arc 172** — Scheme → Clojure macros. Mechanical sweep: `quote`, `unquote`, `quasiquote`, `splice` get the Clojure-faithful shapes their callers had grown into.

Three arcs across May 9–10. Small. Each one a place where the language's surface stopped reading wrong. Each one a callsite sweep the substrate's discipline ate without flinching.

## Arc 170 Opens

May 13. Arc 170 names the doctrine.

The substrate's concurrency vocabulary had accumulated several launch verbs over time: `spawn`, `spawn-thread`, `spawn-program`, `spawn-program-ast`, `fork-program`, `fork-program-ast`, plus a thicket of test-side wrappers (`:wat::test::run`, `:wat::test::run-ast`, `:wat::test::run-hermetic-ast`, `:wat::kernel::run-sandboxed`, `:wat::kernel::run-sandboxed-ast`, `:wat::kernel::run-sandboxed-hermetic-ast`). Each had its place. The combined surface was too wide. Consumers reached for whichever variant was closest to their context and got slightly different semantics. The substrate's discipline of *one canonical pattern per shape* (ch 77's *real lines vs fake lines*) wasn't holding.

Arc 170's doctrine, captured in the design document:

> Substrate has **exactly two spawn verbs**: `spawn-thread` and `spawn-process`. Zero wiggle room. Test macros allowed ON TOP, but every test site migrates. Legacy retires entirely.

One spawn per concern. The substrate stops being a graveyard of nearly-identical patterns; the consumer reaches for one of two things depending on whether they want a thread or a process, and the substrate's vocabulary stops at that line.

## FD-Multiplex

Before the surface could collapse, the kernel had to handle the resource pressure. Arc 170's first phases (May 13) wired the underlying file-descriptor discipline.

- **Phase 1C** — `fork-program` lifeline, retire PDEATHSIG.
- **Phase 1D** — lifeline probe + leak-zero gate; fix Phase 1B's FD-inheritance defect.
- **Phase 1E** — `fork-program` FD hygiene + lifeline probe.
- **Phase 2** — tier-2 PipeFd Receivers wake on shutdown.
- **Phase 3** — canonical `child_post_fork_init` + pidfd probe migration.

Each phase was a place where the substrate's process-spawn flow had been *almost* right but leaving FDs unaccounted for, lifelines unmonitored, or shutdown signals dropping. Phase 3's pidfd migration replaced PDEATHSIG (Linux-specific, brittle, kernel-version-dependent) with pidfds (Linux 5.3+, structured, reliable). The substrate's process management became *first-class.*

The discipline lesson got captured in `recovery doc — Section 13: IPC contract for wat processes (stdout / stderr / exit-code triangle).` *Three streams. Three guarantees. No fourth channel.* The substrate's IPC contract for forked processes locked.

## The Deftest Migration

May 14–15. The substrate's tests were the substrate's biggest legacy comm consumer. Every test that touched concurrency had been using `:wat::test::run`, `run-ast`, `run-hermetic-ast`, or the `run-sandboxed*` family. **Arc 170 slice 4a** retired the lot.

Five stones across two days:

- **Slice 4a-α** — mint `:wat::test::run-thread` + standalone `deftest`. The substrate's canonical test-spawn primitive.
- **Slice 4a-β** — sweep 32 legacy callers. *Stdio-capture asymmetry surfaced* — the three-rule classification got captured mid-sweep.
- **Slice 4a-γ-audit** — three-rule audit shipped; five sites flagged for hermetic decoration.
- **Slice 4a-γ-decorate** — 5 decorations + site 154 rearchitecture + duplicate markers.
- **Slice 4a-γ-flip** — deftest macro body flipped to `run-thread`.

The substrate's tests landed in one of three rules:

1. **Pure thread** — `run-thread`. The default. Tests that don't touch processes.
2. **Hermetic decoration** — `run-thread` plus a hermetic wrapper that captures stdout/stderr cleanly.
3. **Process rearchitecture** — site 154's class: tests that genuinely needed process isolation got rebuilt around `run-hermetic-with-io`.

Thirty-two callers migrated. Every old verb retired in the same sweep. The substrate's tests stopped being a graveyard of test-spawn variants; they became three-rule classifications under one canonical macro.

## Slice 6 — The Pivot

May 15 evening. The slice that broke the substrate's spawn vocabulary open.

Pre-slice-6 `spawn-process` accepted only source strings — the wat-cli IPC contract assumed *parse-and-evaluate the string in the child.* Arc 170 had been carrying the assumption forward through every phase.

The pivot:

> **`spawn-process` accepts program forms.** Not source strings. Forms.

The implication compounded across the substrate. A program is now a *value* — a `Vec<WatAST>` that can be built up in the parent, transmitted to the child, and evaluated there with the parent's substrate state available as ambient context. The wat-cli IPC contract stays simple (the child still receives stdin/stdout/stderr), but the *content* the parent ships to the child is structured. **The wat-cli is now a wrapper around the substrate's spawn-process primitive, not a separate mechanism.**

This is the bracket Kay-OOP recognition that lands in the next stretch. The form is the message; the spawn is the dispatch; the receiver is the program. The substrate's concurrency model is now structurally compatible with Kay's original framing of message-passing as the load-bearing operation. *The substrate has been actor-shaped since arc 057 closed the algebra; arc 170 slice 6 is the surface that finally honors it.*

## What the Discipline Looks Like

By May 15 evening, the substrate's concurrency vocabulary collapsed to:

```
spawn-thread   — same address space, shared algebra grid
spawn-process  — separate address space, IPC via three-stream contract
```

That's the substrate. Period. Everything else sits on top.

Test-side macros (`:wat::test::run-thread`, the deftest wrapper, the hermetic decoration) compose down to one of those two verbs. Legacy callers (`run-sandboxed*`, `run-hermetic-ast`, the `wat test` CLI subcommand) all retire. The substrate stops being a place where ten different launch verbs do *almost* the same thing.

Failure engineering (the discipline ch 84's `FAILURE-ENGINEERING.md` named) lands here as architectural surgery. The class of failure being eliminated is *consumer ambiguity over which spawn variant to reach for.* The way to eliminate it is **to refuse to offer the variants in the first place.** Not "use the right one"; "there are only two." The substrate's vocabulary becomes the discipline's enforcement.

Arc 170 itself is still in flight as of this writing — the slices are still landing, the stones still shipping. *Arc 170 isn't on main; the latest arc-170-gap-j-v5-deadlock-state branch will merge once the full discipline is locked.* But the doctrine is settled, the migrations are mostly complete, and the substrate's surface has converged on the two-spawn rule the whole substrate is now organized around.

---

Seven days. ~240 wat-rs commits. Zero BOOK chapters. The work was inside the kernel: the FD discipline, the deftest migration, the slice-6 pivot that broke `spawn-process` open to accept program forms. The substrate's vocabulary collapsed to two spawn verbs. **One spawn per concern. Test macros on top. Legacy retires entirely.** *PERSEVERARE.*
