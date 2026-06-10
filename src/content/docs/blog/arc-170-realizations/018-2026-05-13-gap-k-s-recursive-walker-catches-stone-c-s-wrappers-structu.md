---
title: "2026-05-13 — Gap K's recursive walker catches Stone C's wrappers, structurally"
sidebar:
  order: 18
---

**The moment.** Stone C mints `:wat::kernel::Sender/from-pipe` + `:wat::kernel::Receiver/from-pipe` — wat-level wrappers that encode typed semantics over the substrate's real OS stdio. Sonnet, mid-implementation, restructured `run-hermetic-with-io-driver` to use the new wrappers. The substrate refused.

Sonnet's read of its own failure:

> *"The ProcessJoinBeforeOutputDrain checker is firing on the updated run-hermetic-with-io-driver. The checker sees Process/join-result proc and Process/stdout proc in the same let form as siblings... after Stone C, I'm calling (:wat::kernel::Process/stdout proc) at the outer level. The checker sees this as dangerous (same let form as join-result). I need to put the Receiver/from-pipe wrapping in an inner scope so it drops before join-result."*

**Why it caught it.** The user probed the right question pre-emptively: *"the {Sender,Receiver}/from-pipe will result in matching for the existing deadlock detection?"* The answer was yes — because `collect_process_calls` (src/check.rs:3317) recurses through ALL List children unless crossing a nested `fn`/`lambda` boundary. The wrapper form `(Receiver/from-pipe (Process/stdout proc))` doesn't hide the inner `Process/stdout` from the walker; the walker descends into it and registers it as an accessor call paired with `Process/join-result proc` in the same scope.

**The architectural recognition.** Gap K's rule (committed 2026-05-15 at `8ef69f4`) was written with **recursive descent through subforms**, not top-level-callee inspection. That choice — apparently a stylistic detail at write time — made the rule structurally future-proof against API surface growth. Every wrapper minted later that internally calls `Process/stdout` / `Process/stderr` / `Process/output` is automatically caught. The rule didn't anticipate `Sender/from-pipe` / `Receiver/from-pipe`; it caught them anyway because the WALK SHAPE accommodates them.

**Substrate-as-teacher applied to the substrate's own author.** The detection that protects users from output-drain-before-join just protected sonnet from shipping a deadlock pattern in substrate-side helper wat (run-hermetic-with-io-driver). Sonnet read the diagnostic, recognized the SERVICE-PROGRAMS.md lockstep pattern was the answer, restructured to inner-scope ownership of the Receivers. The substrate taught its author.

**The deeper rule for writing detection.** When a rule's job is "catch a pattern that produces a deadlock class," write the WALKER recursively through subforms (not top-level only), because:
1. The pattern lives at the semantic level (the API CALL exists somewhere in the let scope), not at the syntactic level (how it's wrapped)
2. Wrappers are inevitable — `from-pipe` today, more tomorrow
3. The cost is identical (a few lines of recursion)
4. The payoff compounds with API surface growth

If Gap K had been written as "inspect top-level callees in let-bindings," Stone C would have shipped a regression hidden by the wrapper layer. Recursive descent made the rule cheap and future-proof simultaneously.

**Carrying forward.** Every future substrate detection rule for "structural deadlock class" should follow this shape: walker descends through subforms, halts only at semantic scope boundaries (fn/lambda bodies), matches the named primitives wherever they appear lexically. The asymmetric stdin-direction concern flagged today (parent forgets to close stdin IOWriter before join → child stalls on readln → child can't write outputs → join blocks forever) — if it becomes a rule, it should follow the same recursive walker shape so the next wrapper minted over `Process/stdin` is caught without re-engineering.

The work-in-progress at this commit: Stone C sonnet restructuring the driver to put from-pipe wrappers + read loops in inner scope. Detection IS the verifier — restructure passes when ProcessJoinBeforeOutputDrain stops firing on the substrate's own helper wat.

---
