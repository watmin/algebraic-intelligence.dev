## 2026-05-13 — Gap I-B and the three ways `def` was special

**User probe (after my first I-B framing assumed "just extend the validator's arm through is_declaration_form"):** *"why is def special relative to the others?..."*

The probe surfaced a load-bearing finding I had missed in my first draft. `def` is special in THREE ways, not just historically:

**1. Historical.** Arc 157 minted `def` recently with self-conscious position discipline (the arc title literally says "position rule"); minted the validator alongside. The other 7 forms predate the discipline mechanism — they got position rejection ad-hoc through runtime/freeze-time paths.

**2. Validator coverage.** Only `def` gets the check-time `DefNotTopLevel` emission. The other 7 fall through the validator's `_ =>` arm silently — no error. Their position discipline lives in runtime dispatch arms (define) or `refuse_mutation_forms` in `eval_in_frozen` paths (struct/enum/etc.).

**3. Runtime semantics — the load-bearing surprise.** `def`'s runtime dispatch arm at `src/runtime.rs:3522` is PERMISSIVE:
- Validates arity
- **Evaluates the RHS** (for side effects + error propagation)
- **Returns Unit**
- **Does NOT register the binding** (the comment says "module-level value registration is deferred to slice 1a-ii when the mutable module-env carrier is wired in")

The comment explicitly says: *"Position check already fired at `check_program` time; **this arm is only reached for legal top-level defs**."* The arm assumes the validator prevents def-at-expression-position from ever reaching it.

Compare the other 7:
- `define` → `DefineInExpressionPosition` runtime error (`runtime.rs:3539`) — loud rejection
- `struct`/`enum`/`newtype`/`typealias`/`defmacro`/`define-dispatch` → caught by `refuse_mutation_forms` — loud rejection

**The risk in naive Option B retirement:** if we retired ONLY the validator's def arm, def-at-expression-position would silently no-op — evaluate RHS, return Unit, never register. A footgun worse than today's loud-but-asymmetric behavior.

**The right shape (Option B-revised):** two-part retirement.
- Retire the validator's `:wat::core::def` arm (def falls through `_ =>` like the other 7)
- Tighten the runtime arm: def at expression position emits a position-class error (mint `DeclarationInExpressionPosition` carrying the head + span; route both `define` and `def` through it; retire `DefineInExpressionPosition` in place via sweep)

Four questions on Option B-revised:
- **Obvious?** YES — def behaves like the other 7 at runtime; one model
- **Simple?** YES — symmetric tightening; same pattern; pure deletion + small runtime adjustment
- **Honest?** YES — surfaces the design-intent (the arm was never meant to be a permissive fallback) and aligns reality with intent
- **Good UX?** Better than today — no silent failures; consistent error model across all 8 declarations

User verdict 2026-05-13: *"making it not special feels best."*

**The deeper recognition:** Gap I-B closes a latent arc-157 defect while restoring symmetry. The validator was carrying an assumption the runtime arm depended on. With Gap I-A's lift in place, that assumption broke. The runtime arm needs to be made self-sufficient — strict like its 7 siblings.

This is substrate-as-teacher in micro: the lift mechanism (Gap H + I-A) didn't just enable a new use case; it exposed that the existing position-discipline machinery had a quiet asymmetry (one form had a check-time guard + permissive runtime; the others had no check-time guard + strict runtime). Symmetry-correction follows.

---
