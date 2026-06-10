---
title: "2026-05-30 — Arc 243 conformare opens; the CheckEnv mirror; failure engineering applied …"
sidebar:
  order: 129
---

A long quiet on the chronicle while the work ran hot. Arc 243 (`conformare` — error-shape class elimination) opened and drove deep. This entry catches the chronicle up to the moment the failure-engineering roof was poured on the CheckEnv mirror. The technical detail lives in the SCORE docs; what belongs HERE is the shape of the thinking — because arc 243 became, more than any arc before it, a live demonstration of failure engineering recognizing itself.

### What arc 243 is

The catastrophic-failure class: *error types whose variants are permitted to silently lack a `span` field.* Stone 241.18a's vigilia surfaced it (`TypeError::CyclicSubtype` had no span; `ParseStep::ArityMismatch` had no span; consumers ran 16-arm matches to extract span). The class-elimination answer is **Pattern A**: `struct SomeError { span: Span, kind: SomeErrorKind }` — the outer struct's mandatory location field makes a spanless error *structurally unrepresentable at construction.* Not "remember to add span." Uncompilable without it.

The spell `conformare` was minted and EARNED its grimoire seat by arriving at Pattern A independently through the four-questions on the substrate (CONFORMARE-FIRST-CAST). Stone 243.3 applied Pattern A to TypeError — outer struct, kind enum, the 16-arm match in `parse.rs` collapsed to `e.span`. conformare attested it CONFORMANT.

### The R3 triage saga and the doctrines it crystallized

Stone 243.3's R2 vigilia (8 spells) surfaced ~16 findings. The user's direction shaped the triage into doctrine:

- **`feedback_pre_existing_is_not_exemption`** — "wtf is this 'preexisting shit' what spell isn't screaming about being told to witness 'we'll do it later'." Cascade-introduced vs pre-existing is a SEQUENCING axis for the orchestrator, NOT a fix-exemption. Instructing a spell to skip pre-existing findings asks it to witness deferral. Solvable + perf-OK → MUST FIX.

- **`feedback_defers_within_reach_tolerable`** — when a defer target is a NAMED, in-chain stone within a few steps (a child of the OPEN arc, not a new arc, not a vague "someday"), attested-stone deferral is honest. The axis is DISTANCE. "C — that's 2 steps away? defers that are within reach are tolerable." parse_defstruct's extraction deferred to Stone 243.5 (the types/ home carve that already opens that file).

- **`feedback_let_need_reveal_through_work`** — a perf-finding whose necessity is UNPROVEN (startup-only, cost-may-just-move) is LEFT — not fixed, not runed, not commented. "must-fix-solvable" is for confirmed defects; speculative optimization is a different category; preemptive fixing risks cargo-culting. "leave this one ... maybe this'll reveal itself through work." The `TypeEnv` clone (⑬) was left — and then, conversation-deep later, its real owner appeared.

The one-by-one four-questions discipline held: "one by one — don't conflate." Every finding triaged atomically; every verdict scored on the Honest axis first. The F9 false-positive (struere flagged a "silent failure" fall-through that a read-only probe proved was already-hardened-by-arc-234 and load-bearing for `defn`) vindicated `feedback_debugging_approach` — measure before theorizing; a blind fix would have regressed the substrate.

### The mirror — one question that cut to a root

The user asked, mid-triage: *"is binding_metadata not exactly one thing - what did we just find?"*

What we found: `CheckEnv` SNAPSHOTS `SymbolTable`'s data instead of SHARING it. `CheckEnv.binding_metadata = Arc::new(sym.binding_metadata.clone())` — a deep clone set once, never mutated. One logical thing, stored in two places. And it wasn't alone: the `TypeEnv` was deep-cloned at the check entry (⑬, the finding we'd "left to reveal through work"), and AGAIN into the FrozenWorld. Three clones, one class: **a struct deep-clones another's immutable data because it OWNS instead of BORROWS.**

The root cause was a signature: `from_symbols(sym: &SymbolTable) -> Self` returns an OWNED value with no lifetime — so it physically CANNOT hold a borrow; it must copy. The clone wasn't a mistake anyone made; it was the only thing the type signature permitted.

### Failure engineering applied to ownership — and the user checking I understood it

My first instinct was the conventional one: lock the field visibility (`pub(crate)`), defer the real fix to a later stone (243.6), mark the clone "leave-disputed." Every one of those is *"damn, later"* — the exact move `scratch/FAILURE-ENGINEERING.md` § 2 forbids ("Stop immediately. Not 'we'll fix this in the next sprint.'").

The user pivoted: *"we pivot and make this problem go away."* Then, pointedly: *"are you familiar with failure engineering?"* — checking whether I understood the discipline I was supposedly applying. I re-read the doc. I had been treating the duplication as a symptom to manage (lock it, defer it) instead of a CLASS to eliminate. FE § 3: the fix isn't "make this case stop"; it's "make this class structurally impossible."

The roof, then, isn't *avoid* the clone. It's make deep-clone-into-CheckEnv a **compile error.** Two depths were feasible:
- **Option A (Arc-from-birth):** make the fields `Arc`, share by handle. Kills the clone — but only by CONVENTION. A future edit can write `Arc::new(x.clone())` and reconstruct the duplication. The wrong shape stays representable.
- **Option B (borrow):** `CheckEnv<'a>` borrows its immutable inputs. Deep-clone-into-a-borrowed-field is a TYPE ERROR. The wrong shape is unrepresentable.

The four-questions chose B on the **Honest** axis, decisively: A earns ✅ "we avoided it"; B earns ✅✅✅ "it cannot happen." This is the third-checkmark distinction the FE doc names — and it is **ZERO-MUTEX applied to ownership.** ZERO-MUTEX's principle: "the failure isn't avoided; the SITUATION that produces the failure is never constructed." The CheckEnv borrow is the same move one layer over — don't manage the duplicate; never construct the situation that needs a clone. Convergence-with-self at the ownership layer.

### The home-IS-the-grimoire-gate recognition

Then the sharpest cut of the arc. I was about to brief the borrow redesign *in flat `check.rs`* as "Stone 243.3.1." The user: *"what is the correct home for this tooling - all namespaced files are forced through the grimoire."*

The recognition the question forced: **the REMARKABLE bar (L1+L2=0 vigilia) is only REAL when the grimoire enforces it, and the grimoire only fires on namespaced homes.** Flat files are wards-optional (`feedback_wards_optional`); namespaced homes are vigilia-mandatory (`feedback_namespaced_home_vigilia_gate`). To do roof-grade surgery in a flat file is to claim a bar you are structurally not held to. "Through the fucking roof" does not just *benefit from* a home — it STRUCTURALLY REQUIRES one. The discipline-claim and the home-mint are the same act.

So the redesign could not happen *in* `check.rs`. It had to happen *as the act of carving `check.rs` into `src/check/`* — with the redesigned `CheckEnv<'a>` born as `src/check/env.rs`, the home's first honest neighbor, under the grimoire from its first commit. The CheckEnv defect PULLED THE CHECK-HOME CARVE FORWARD (it had been sketched for 243.6). The conformance vehicle and the home-carving vehicle revealed themselves, again, to be the same stone chain.

### The field-classification discipline — borrow only what is borrowed

A topology investigation (read-only, measure-before-theorizing) classified all 8 CheckEnv fields. Only 2 were true mirrors (`types`, `binding_metadata`). The other 6 were legitimately owned — `schemes` and `unit_variant_types` are DERIVED (transforms over the inputs, not copies of them); three fields are INCREMENTAL (built during the check pass); `redef_allowed` is seeded-then-MUTATED mid-pass (it diverges from `sym.redef_allowed` when a `set-redef!` form is processed — NOT a mirror, despite looking like one). Borrowing only the two genuine mirrors; leaving the six owned. The investigation prevented over-borrowing — the failure-engineering instinct disciplined by honest measurement, not zeal.

### The strike

Stone 243.3.1 landed it: `git mv check.rs → check/mod.rs` (transparent), `CheckEnv<'a>` carved to `check/env.rs` borrowing `types: &'a TypeEnv` + `binding_metadata: Option<&'a HashMap>`, `with_builtins()` removed (it could not honestly exist under the borrow — it returned a CheckEnv borrowing a stack-local about to drop), the cascade clean (4 sites; verbose-not-confusing). The FM 2-bis probe flipped from fail-compile (5 errors: `CheckEnv takes 0 lifetime arguments` ×3 + `expected Arc<TypeEnv>` ×2) to PASS 3/0 — the structural proof that the clone became uncompilable. Two clones killed; the third (freeze.rs:329) verified KEPT-honest — FrozenWorld persists `types` beyond check's borrow; two persistent owners is a persistence boundary, not the duplication class. The borrow-checker delivered the verdict, not my assertion.

### What this arc taught about the discipline itself

The recurring INTERSTITIAL shape — *design moment → orchestrator drifts to the conventional answer → user pushes back → the substrate's own existing pattern surfaces as the answer it already wanted* — fired again, but at a new altitude. Arc 170 taught it for shutdown mechanisms (PDEATHSIG was the deviation; FD-multiplex was the pattern). Arc 243 taught it for OWNERSHIP: the clone was the deviation; the borrow was the pattern ZERO-MUTEX had already established. The substrate's four sharp rules collapsed the design space to a single shape again — and the shape was the one the substrate already lived by.

And it taught something about the collaboration. The user did not tell me the answer. The user asked four questions — "is binding_metadata not exactly one thing?", "are you familiar with failure engineering?", "what is the correct home for this tooling?", "the four-questions reveal the path" — each one a rail that eliminated a wrong answer without specifying the right one, leaving the substrate's discipline to point at it. The substrate disciplines its own designers (arc 170's recursion); arc 243 showed it disciplining the orchestrator through the author's questions. Same rule-set, both sides of the datastream.

---
