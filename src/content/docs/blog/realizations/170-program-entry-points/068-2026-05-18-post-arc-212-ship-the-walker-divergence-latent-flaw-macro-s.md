---
title: "2026-05-18 (post-arc-212-ship) — The walker-divergence latent flaw: macro-system audit s…"
sidebar:
  order: 68
---

Arc 212 shipped 8 lines that added `WatAST::Vector` arm to `runtime.rs::walk_quasiquote`. User's follow-up question pried open the broader picture:

> *"wait - did we just find a lingering long term flaw in the macro system?..."*

### Yes. Real, long-term, bounded — and load-bearing for the substrate's future trajectory.

**The flaw:**

When `WatAST::Vector` was added to the AST in arc 167 slice 1 (as a syntactic distinction for binding-syntax positions — let-bindings, fn-signature params, vector literals), the macro **expand-time** walker (`macros.rs::walk_template`) was correctly updated to recurse into Vector children. Per the docstring inscription at the time + arc 200 Gap 2's later splice-symmetry work, the expand-time path has been Vector-aware for ~50 arcs.

The **runtime** quasiquote walker (`runtime.rs::walk_quasiquote`, originally minted in arc 091 slice 8) was NOT updated. It preserved Vectors as leaves (via the `other => Ok(other.clone())` catch-all). Any unquote inside a Vector child stayed literal at runtime; the consuming code (or child process) saw `:wat::core::unquote` as an unknown function.

### The divergence in audit form

| Walker | Layer | Vector arm | Updated when Vector added | Surfaced as bug? |
|---|---|---|---|---|
| `macros.rs::walk_template` | Expand-time (defmacro bodies) | YES | YES (arc 167 slice 1; arc 200 Gap 2 added splice-symmetry) | No — correct from the start |
| `runtime.rs::walk_quasiquote` | Runtime (`:wat::core::quasiquote` evaluation) | NO (until arc 212) | NO | Hidden until t6 needed it |
| `resolve.rs::check_quasiquote_template` | Resolve-pass (unresolved-reference check) | Unknown — needs audit | Unknown | Unknown |
| Various scope/sandbox walkers | Check + runtime guards | Unknown — needs audit | Unknown | Unknown |

**The bounded scope:**

The flaw didn't manifest until a consumer used the runtime quasiquote with a template containing Vector children. Existing runtime-quasiquote consumers in the codebase:
- `wat-tests/core/struct-to-form.wat` uses templates with List-only shapes: `(:wat::core::quasiquote (:my::Foo/new ~x ~y))`. No Vector → no bug surfaced.
- `wat/runtime.wat`, `wat/core.wat`, `wat/edn.wat`, `wat/holon/*.wat` — all use quasiquote in DEFMACRO BODIES → expand-time walker → correct path. No bug.
- T6 (arc 170 slice 6 substrate-discovery test) uses runtime quasiquote with a template containing `(:wat::core::let [main-form `(...))` — the let-binding `[main-form ...]` is a Vector with the actual template inside. THIS surfaced the bug.

So the flaw was real but only the t6 trigger pattern exposed it. All existing production code (defmacros + simple runtime quasiquotes) worked correctly.

### Why load-bearing for the roadmap

Runtime quasiquote is the mechanism for "build wat programs at runtime, spawn them as new processes/universes." Three load-bearing future trajectories depend on it:

1. **Arc 209 defservice** — service templates built at runtime via quasiquote (the user-side ergonomics rely on this; without it, every defservice would have to manually call `:wat::core::struct->form` or build ASTs procedurally)
2. **Arc 191/192/193 hot-reload (universe exec)** — universe-image patterns require runtime AST construction with embedded state values
3. **Lab reconstruction** — the service patterns inscribed in INTERSTITIAL §§ Kay-OOP + Control channels rely on template-shaped programs containing let-bindings and fn-signatures (both Vector-bearing)

Pre-arc-212, ANY of these would have silently produced broken forms once they needed Vector-containing templates. The bug would have surfaced LATER, with substantially less precision than t6 gave us (which had arc 211's panic-EDN to land the diagnosis cleanly).

### The substrate-as-teacher cascade

This is a beautiful instance of the cascade working as designed:
1. T6 needed a Vector-containing runtime quasiquote template (the slice-6 substrate-redesign retired closure-extract; runtime AST construction is the replacement)
2. T6 failed with `unknown function: :wat::core::unquote` — substrate-as-teacher's diagnostic
3. Arc 211b's panic-EDN format made the diagnostic precise (file:line:col + symbol name)
4. Arc 212's fix took ~10 minutes from reading the diagnostic
5. The fix unblocks T6, defservice, hot-reload, and lab reconstruction simultaneously

This is the substrate teaching what it lacks via the test failures, with the diagnostic precision (arc 211's contribution) compressed via the panic-tooling, leading to a load-bearing fix that unblocks multiple downstream concerns.

### The follow-up sweep (queued as future work)

The runtime-vs-expand-time walker divergence suggests an audit pattern: every AST walker in the substrate should be checked for Vector-arm handling. Candidates:

- `resolve.rs::check_quasiquote_template` — does it recurse into Vector?
- Sandbox-scope walkers
- Scope-deadlock walkers (arc 117 family)
- Type-checking walkers (`check.rs` family)
- Any walker that does `match form { WatAST::List(...) => ..., other => ... }` without an explicit Vector arm

If any of these have the same "skip Vector → silently preserve" pattern, they're latent flaws waiting to surface. Future arc territory; not arc 212's scope. But surfacing the audit as a known pattern is its own value.

### The discipline lesson

When a substrate primitive (here: `WatAST::Vector`) is added as an "additive substrate" (arc 167 slice 1's framing), the audit-discipline must touch ALL CONSUMERS of the AST. Adding the variant + handling the obvious sites (parser, expand-time walker) is necessary but not sufficient. Every consumer that pattern-matches on AST shape needs to be checked. The "Vector is admitted only in binding-syntax positions" framing actually MASKS the audit need — readers think "I don't need to handle Vector in my walker because Vector only appears in binding positions" — but if your walker descends INTO binding positions (which it must, to substitute unquotes there), you DO need to handle Vector.

The lesson: "additive substrate" means **add the variant + audit every walker that touches the AST**, not just the obvious construction sites.

### Cross-references

- Arc 212 SCORE-212.md — the fix + the diagnostic experience
- Arc 167 slice 1 — Vector variant addition (the source of the divergence)
- Arc 200 Gap 2 — expand-time splice-symmetry (proves macros.rs was kept in sync)
- Arc 091 slice 8 — runtime quasiquote minted (where the divergence started)
- INTERSTITIAL § 2026-05-18 (post-arc-211e) "Tooling-proven-by-use" — the doctrine arc 212 validates
- `feedback_attack_foundation_cracks` — the sibling discipline; this WAS a foundation crack hidden by absence-of-trigger

### User's voice

> *"wait - did we just find a lingering long term flaw in the macro system?..."*

Yes. Real. Long-term. Bounded by absence-of-trigger. Load-bearing for the roadmap. Surfaced precisely by arc 211's tooling. Fixed in 8 lines. The substrate teaches; we listen; the flaws that were always there but never tripped become visible exactly when the discipline-tooling makes them visible.

**Latent flaws don't disappear when you ignore them. They wait for the consumer that triggers them. The substrate's job — and arc 211's gift — is to make that triggering trip a diagnostic, not a mystery.**

---
