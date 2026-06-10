---
title: "2026-05-16 — Parse/resolve separation as load-bearing for macro reflection"
sidebar:
  order: 40
---

Arc 201 slice 3 (`signature-of-fn`) shipped with an unpredicted choice: input is fn-VALUE (post-eval), not fn-AST (raw WatAST). User asked "is this a crack?"

Initial answer: "false alarm — per freeze ordering, type defs land before macro expansion, so forward references resolve." User challenged: "is that actually true? assertion demanding evidence."

Investigation revealed:
- **Freeze ordering claim was WRONG.** Pipeline is: step 4 register defmacros + expand all macros → step 5 register type declarations. Macros expand BEFORE user types register.
- **But the conclusion holds** — for a different reason: `parse_fn_signature` calls `parse_type_keyword` (`src/runtime.rs:3271-3279`) which is pure string→TypeExpr conversion. No TypeEnv lookup. No registration check. `:MyApp::Spec` parses to `TypeExpr::Path("MyApp::Spec")` without checking whether `MyApp::Spec` resolves to anything.

The substrate engineered the separation:
- **Parse-time:** lookup-free. AST→TypeExpr is mechanical.
- **Check-time:** full TypeEnv consultation. Resolution happens at step 8 against the fully-expanded program.

That separation IS the load-bearing guarantee that makes expand-time reflection on fn-forms safe — regardless of macro/type-def ordering. We almost called this a crack; investigation revealed the design working exactly as engineered.

### The trade plainly

**What parse/resolve separation PREVENTS:** eager type resolution at parse-time. If you write `(:fn [x <- :MyApp::Foo] -> :nil ...)` and `MyApp::Foo` doesn't exist (yet, or ever), parse-time DOES NOT error. The unknown-type error doesn't surface until check-time.

**What we PURCHASE by allowing that:**
1. **Macros run before type-checking** — because macros GENERATE code the type-checker then checks. If macros required types resolved, they couldn't reference user types in generated code (chicken-and-egg).
2. **Forward references work** — any non-trivial Lisp program references types defined later in the file (or in `load!`'d files); eager resolution would forbid this.
3. **Reflection at macro-expand-time works** — exactly the D2 use case. `signature-of-fn` reads TypeExpr from a closure built at expand-time, before user types are registered.

**What we LOSE:** parse-time can't catch type-name typos. The typo surfaces at check-time instead of expand-time. But: check-time still runs before program execution, in the same `freeze` pass. User gets the error in their build — just one phase later. No user-facing capability is lost; only the moment-of-error-surfacing shifts.

**The trade is asymmetric in our favor.** Late-binding gain (macros + forward refs + reflection) >> late-binding cost (error message one phase later). Every Lisp ever made the same trade for the same reason — it's what makes macros possible.

### The pattern (now confirmed three times today)

- Arc 199 — rejected because computed-unquote + keyword/from-string + string::concat already shipped (arc 143 + arc 057 surface). Asserted gap; reality: engineered solution already present.
- Arc 201 slice 2 — `Atom/value` not minted because `:wat::core::atom-value` (arc 057) already serves. Asserted need; reality: engineered solution already present.
- Arc 201 slice 3 — fn-VALUE input choice nearly framed as defect. Investigation revealed parse/resolve separation makes the "concern" structurally impossible.

In all three cases: **the substrate has engineered properties we benefit from without remembering we engineered them.** Each consumer arc reveals more of those properties. The pattern's lesson: when reaching for "this is broken/missing," first check whether the substrate already has the property we're about to mint or work around.

### Reasoning correction (not just outcome correction)

Important distinction the user caught: the initial reasoning ("freeze ordering protects us") was wrong even though the conclusion ("not a crack") was right. Being right BY ACCIDENT is not the same as being right via correct reasoning. Per `feedback_assertion_demands_evidence`: investigate the chain, not just the outcome.

This is captured here as a discipline reinforcement: outcome-correctness without reasoning-correctness is a near-miss, not a hit. The substrate property that ACTUALLY saves us (parse/resolve separation) is now on record; future-me doesn't need to re-investigate.

### Connects to

- [[project_holon_universal_ast]] — same pattern at the HolonAST level (arc 057 primitives extending into reflection cleanly)
- `feedback_any_defect_catastrophic` — the discipline that drove the investigation in the first place
- `feedback_assertion_demands_evidence` — the discipline the user enforced when my reasoning was sloppy

---
