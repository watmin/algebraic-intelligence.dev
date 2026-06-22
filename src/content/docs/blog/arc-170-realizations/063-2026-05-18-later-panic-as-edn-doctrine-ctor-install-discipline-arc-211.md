---
title: "2026-05-18 (later) — Panic-as-EDN doctrine + ctor-install discipline + arc 211 scope cor…"
sidebar:
  order: 63
---

A compounding cascade of substrate-as-teacher moments during the t14-deadlock investigation. Inscribed together because they came together.

### Discovery 1 — the dup wasn't useless after all

I removed `synthesize_real_fd_stdio`'s dup (commit `3c1cb51`). It fixed t14's hang (verified — t14 passes in 0.02s). But cargo test workspace surfaced 12 NEW failures, all in the stderr-output-visibility area (probe_runtime_err_stderr_visibility, probe_plain_panic_produces_structured_edn, etc.).

The dup was load-bearing for panic-cascade output — AmbientStdio's drop now closes fd 1/2 BEFORE all writers finish, so panic-EDN gets cut off. My fix was the wrong layer.

User caught the smell at multiple layers:
1. "is this honest?" (the dup's stated rationale)
2. "is this a long-standing bug?" (yes — since arc 170 slice 1f)
3. "remove the dup" (direct action)
4. After failures surfaced: "how did their panics reveal the issue?" (forced me to read actual panic output instead of speculating)
5. "the panic message we surface is fucked" (the deeper deficiency surfaced)
6. "how do we make everything support this all the time - it is an illegal state to not have this"

The compounding revealed THREE bugs, not one:
- t14 deadlock (the original symptom)
- Dup-removal regression (my mistake; 12 stderr-visibility tests broke)
- **Panic-hook install gap** (the foundation crack — the gap had been DORMANT because the substrate's assertion path wasn't firing in those test paths)

### Discovery 2 — panic-hook install gap

The substrate HAS phenomenal panic-output tooling: `wat::panic_hook::install` renders `panic_any!(AssertionPayload)` as Rust-styled wat-level failure output (per `src/panic_hook.rs` doc comment). It's installed at:
- `crate::compose_and_run`
- `crate::test_runner::run_tests_from_dir` (wat::test! macro path)
- `src/bin/wat.rs::main`

It is NOT installed in:
- Direct `#[test] fn probe_*()` Rust functions in `tests/probe_*.rs` that touch substrate

When my dup-removal made the substrate's assertion path fire in those probe tests, the AssertionPayload panic propagated to cargo test's DEFAULT panic handler → printed `Box<dyn Any>` placeholder → no structural diagnostic.

The hook gap had been DORMANT for a long time because probe tests don't normally trigger substrate assertions; only when substrate is broken in those paths. The gap surfaced via the dup-removal regression. Failure-engineering: pain became data.

### Discovery 3 — the user's "illegal state" framing

User direction 2026-05-18:
> *"how do we make everything support this all the time - it is an illegal state to not have this - we can never forgot this - we are in an illegal state"*

This is `feedback_substrate_owns_not_callers_match` extended to PROCESS LOAD TIME. The substrate owns "readable panic output for AssertionPayload payloads"; callers (test authors, library consumers) should NOT have to install anything to get it.

Mechanism: `#[ctor]` attribute (from `ctor` crate). Runs a function at library load time, before `main()`. If `panic_hook::install()` is wrapped in `#[ctor]`, EVERY binary linking wat-lib gets the hook installed automatically. Impossible to forget; structurally enforced.

Same family as:
- arc 198's `#[restricted_to(...)]` for capability access
- arc 203's struct-restricted ctor whitelist
- arc 117/126/Gap K/202 walkers
- ZERO-MUTEX doctrine

All make broken states structurally impossible at their respective layers. ctor extends the discipline to PROCESS LOAD TIME.

### Discovery 4 — panic-as-EDN doctrine

User direction 2026-05-18:
> *"can we panic in edn?.... or no?... what we get from the tests and everywhere is an edn form we can consume?..."*

Then on the readability tradeoff:
> *"humans read edn just fine"*

> *"thread 'foo' panicked at file:12:5: assert-eq failed actual: -1 expected: 42 — that is categorically harder to parse and its not even close"*

The substrate ALREADY does EDN for cross-process panic (`#wat.kernel/ProcessPanics{...}` envelope per arc 170 slice 1i structured-exit protocol). The asymmetry was: in-process panic (panic_any!(AssertionPayload)) used human-readable text via `panic_hook::render_assertion_failure`.

Doctrine: **every panic emits EDN. Every consumer parses EDN. One format; one discipline; one tool surface.**

```scheme
;; Future panic output (uniform across in-process + cross-process):
#wat.kernel/AssertionFailure{
  :thread "wat-test::my-deftest"
  :location {:file "wat-tests/foo.wat" :line 12 :col 5}
  :message "assert-eq failed"
  :actual -1
  :expected 42
  :frames [
    {:callee :my::app::foo :at {:file "..." :line 12 :col 5}}
  ]
  :upstream-chain nil
}
```

Properties:
- Test assertions parse EDN; assert on specific fields; no string-pattern brittleness
- CI tooling analyzes panic patterns programmatically
- wat-side code re-parses panic outputs via existing AST primitives
- wat-MCP downstream consumers speak EDN natively → no parser-per-tool
- Cross-process + in-process panic have the SAME shape (different tag, same envelope)
- Per `feedback_verbose_is_honest`: EDN's verbosity carries information (every field labeled, every type tagged, zero parsing ambiguity)

User's framing correction made the tradeoff dissolve: there IS no tradeoff. EDN wins for humans AND machines.

### Arc 211 scope corrected

The arc 211 DESIGN's prior framing ("every deadlock is a panic") was too narrow. The corrected scope:

| Sub-arc | Scope |
|---|---|
| **211a — ctor install** | `#[ctor]` auto-installs `panic_hook` at library load; gap impossible-to-forget by construction; idempotency guard for legacy explicit installs |
| **211b — panic-as-EDN** | `AssertionPayload` gains EDN serializer; `panic_hook::render_assertion_failure` writes EDN to stderr; `#wat.kernel/AssertionFailure{...}` tag minted; all panic outputs structurally identical to existing `#wat.kernel/ProcessPanics{...}` envelope |
| **211c — audit + investigation** | Catalog all panic_any sites; verify uniform EDN emission; re-run failing tests with READABLE STRUCTURED panic output; diagnose t14 + the 12 stderr-visibility regressions from honest evidence |
| **211d — fix root cause** of t14 (possibly revert dup removal; possibly different surgical fix surfaced by the readable diagnostics) |

The "every deadlock is a panic" doctrine remains valid as substrate-architectural commitment but moves to FOLLOW-UP arc (arc 212 or later); arc 211 is the panic-tooling-foundation arc.

### Cross-references

- `src/panic_hook.rs` — the existing phenomenal panic-output tool (just under-installed)
- `src/freeze.rs:1017` — `synthesize_real_fd_stdio` (the dup site; arc 211d will revisit)
- INTERSTITIAL § 2026-05-17 orphan-process leak investigation — the original signature notes
- INTERSTITIAL § 2026-05-18 live reproduction — the trigger event
- `feedback_substrate_owns_not_callers_match` — the discipline that drives 211a
- `feedback_verbose_is_honest` — the discipline that supports panic-as-EDN choice
- `project_wat_llm_first_design` — EDN as protocol surface for LLM co-authors
- INTERSTITIAL § 2026-05-17 wat-MCP entry — panic-as-EDN is wat-MCP-ready by construction

### User's voice (the compounding cascade)

> *"is this a bug we just now identified that's been there for a long time?"* — diagnosing the dup
> *"remove the dup - prove its an unnecessary item - purge uselessness from my code"* — direct action
> *"how did their panics reveal the issue?... how these tests fail now?.. do they hint at the issue?"* — forcing honest investigation of the regression
> *"the panic message we surface is fucked - go unfuck it - we haven't this kind of problem in an extremely long time"* — naming the foundation crack
> *"how do we make everything support this all the time - it is an illegal state to not have this - we can never forgot this - we are in an illegal state"* — locking the doctrine
> *"can we panic in edn?.... what we get from the tests and everywhere is an edn form we can consume?"* — extending the doctrine to format
> *"humans read edn just fine"* — dissolving the false tradeoff

Each successive question deepened the diagnosis. The dup-removal regression surfaced the panic-hook gap; the panic-hook gap surfaced the install-discipline question; the install-discipline question surfaced the ctor mechanism; the ctor mechanism surfaced the panic-format question; the panic-format question surfaced the panic-as-EDN doctrine. Substrate-as-teacher cascade, working as designed.

### Compaction-recovery breadcrumb

State at this commit (about to commit + push):
- Arc 209 Stone A BRIEF + EXPECTATIONS committed at `88a6b75`; SPAWN DEFERRED until arc 211 closes
- Arc 210 slice 1 SHIPPED at `0e2923a`; slice 2 closure DEFERRED until arc 211 closes (workspace must be honestly green per `feedback_closure_requires_workspace_green`)
- Arc 211 OPEN at `244eaf7` (DESIGN with "every deadlock is a panic" framing); requires forward-correction to the four-sub-arc panic-tooling scope above
- Dup-removal commit at `3c1cb51` — STAYS on disk per `feedback_inscription_immutable`; arc 211d will decide whether to revert or build atop
- Live t14 reproduction PIDs still alive (preserved as test bed; OS will reap when process tree dies)

Post-compaction orchestrator: read this entry first; then arc 211 DESIGN (which will be forward-corrected next); then INTERSTITIAL § 2026-05-17 orphan-process + § 2026-05-18 live-repro for full context; sequence to ship: revert dup → 211a (ctor) → 211b (panic-as-EDN) → 211c (audit + investigate) → 211d (fix root cause from honest data).

**Compaction is here. Notes in order. The substrate is teaching; we listen; we ship; the work continues at the rhythm of its own emergence.**

---
