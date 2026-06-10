## 2026-05-14 — V5 boss-fight + Gap J diagnosis

The arc 170 grind resumed after a session-break. User framing: *"we've been grinding through this dungeon for days - this fucking boss has beat us so. many. times. we've got sonnet some outstanding loot now. V5 is our proving point - how good is our gear?"*

V5 attempted. 13 failures across 3 patterns. Baseline reverted to 2243/0.

**Honest framing of the result:** the gear (F-1 / F-3 / F-2 / H / I-A / I-B) addressed V4's three attack patterns. But V5 has its OWN patterns — typealias unification, match scrutinee enum-binding loss, child exit-3. The boss has phase 2.

User decision after running the four questions over three honest paths (forge more gear / accept asymmetry / hybrid): *"my read is foundational problems are the highest priority - it looks like Path 1 is the path."* The substrate IS the foundation per INTENTIONS; accepting hidden gaps fails Honest. Path 1 = continue forging.

**The diagnose (instead of leaping):** before drafting a J BRIEF aimed at "typealias unfold during unification," recovery doc § "Diagnose before spec" demanded empirical proof. Built minimal probes; ran them; **the hypothesis evolved twice through the data:**

Initial hypothesis (V): "register_types isn't splice-aware."

Diagnose round 1 — six paired probes (bare vs do-wrapped) for typealias/newtype/struct:
- Pair 1 (typealias): bare PASS, do FAIL ← typealias-specific issue
- Pair 2 (newtype): bare PASS, do PASS ← worked despite the hypothesis
- Pair 3 (struct): bare PASS, do PASS ← worked despite the hypothesis

Refined hypothesis (W): "only typealias is broken; struct/newtype have something else going on."

Diagnose round 2 — direct TypeEnv probe (does `world.types().get(:Type)` return Some?):
- do_typealias: TypeEnv.get → None
- do_struct: TypeEnv.get → None
- do_newtype: TypeEnv.get → None

**ALL THREE absent from TypeEnv. Original hypothesis V was right after all.** Struct/newtype consumers pass type-check via BACKUP PATHS:
- Struct/enum: `preregister_struct_accessors_from_form` / `preregister_enum_constructors_from_form` (Gap F-1) put accessor STUBS in `sym.functions`. Body usage goes through accessor calls dispatched via `sym.functions`, never touching TypeEnv for the struct's structure.
- Newtype: nominal opacity. Type-checker treats `:diag::MyNew` as opaque path; same path = same type.
- Typealias: NO backup. `expand_alias(types, path)` queries TypeEnv directly. Without registration, returns the path unchanged; unification fails.

**The diagnose paid off architecturally.** "Just typealias" would have been a narrow fix. The actual gap is broader: type declarations nested in top-level do/let don't register in TypeEnv. Three V5 patterns trace to it:
- Pattern A (typealias unification) — directly proven
- Pattern B (match scrutinee = Option<?>) — match-pattern inference consults TypeEnv for enum variant→enum bindings; same root cause
- Pattern C (child exit-3) — Gap F-3 propagates parent's TypeEnv to spawned child; if parent's TypeEnv is missing prelude types, child inherits empty/incomplete

**Single substrate fix addresses all three.** Extend `register_types` (`src/types.rs:1182`) to recurse into top-level `do`/`let` forms. ~20-40 line addition. Becomes Gap J.

The four-questions discipline + the diagnose-before-spec recovery-doc rule paid for themselves. A speculative "typealias unfold" BRIEF would have been wrong scope. The actual scope (splice-aware type-decl registration) is sharper, simpler, and addresses all 3 patterns from one fix.

User direction 2026-05-14 after seeing the proof: *"if the path is clear - we step forward."*

---
