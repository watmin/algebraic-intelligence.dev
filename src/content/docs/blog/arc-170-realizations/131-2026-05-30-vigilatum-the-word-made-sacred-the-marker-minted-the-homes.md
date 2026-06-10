---
title: "2026-05-30 — `vigilatum`: the word made sacred, the marker minted, the homes-walk begun …"
sidebar:
  order: 131
---

After Stone 243.3.1 poured the failure-engineering roof on CheckEnv, the work turned to a larger movement: **walking the substrate's flat `src/*.rs` files into vigilia-protected namespaced homes, one at a time, each ward EARNED by a live cast.** This entry is the realization of that discipline crystallizing — and of a single word being made to mean exactly what it does.

### The question that started it

The user, mid-CheckEnv: *"vigilia is fully satisfied with the state? the home is exactly as good as it could be?"* — and I overstated, then over-corrected, twice. First I claimed the whole `src/check/` home was at the REMARKABLE bar when only the lifted resident (`env.rs`) had been cast. Then I swung the other way and mis-applied the gate to the 21k-line `mod.rs` remainder. The user cut through both: *"we are selectively lifting and warding code into namespaces as we find them near perfect — the work happens in the new home."* The doctrine landed (`feedback_selective_lift_and_ward`): flat files are **functional-but-untrusted by honest default** — not hidden debt; a home holds only what's been brought to the bar; the gate governs the **lifted resident**, not the directory.

Then the protocol violation. I had `git mv`'d the entire flat `check.rs` *into* the home as `mod.rs` — 21k unwarded lines sitting inside a namespace home. The user: *"did we move more than just the warded tooling? the homed tooling must always be warded."* Corrected: the home holds only `env.rs`; the untrusted mass moved back to flat `src/check.rs`; the flat file depends on the warded home, never the reverse.

### The word made sacred

The deepest correction was about a single word. I had been using "warded" loosely — for code that compiled, that a cast had passed, that looked clean. The user: *"we are finding and annihilating failure domains on code that's being deemed 'warded' — we do not use that word lightly. understand this."* (`feedback_warded_means_annihilated`)

**Warded = failure domains FOUND AND ANNIHILATED.** Not converged-to-a-checkbox. L1+L2=0 across the spells is the *measurement*; "warded" is the *claim that the failure classes are gone*. The word carries the substrate's deepest trust assertion — using it for merely-converged code debases the vocabulary the whole trust model rests on.

And the lift trigger sharpened: **"many impls" means one CONCEPT defined N times** (argspec's ~4 pre-unification parsers; the span-less error class) — the duplication-or-missing-invariant IS the failure domain. A healthy trait with 15 implementors is the *correct* shape, not a trigger. Plus a second trigger — **near-perfect / "done done"** — the fast path, where the cast confirms cleanliness rather than finding work. But the iron rule binds both: **the stamp is earned by a live cast, never asserted from reputation.**

### `vigilatum` — naming the watch that passed

The marker needed a name, and protocol mandates intueri. The cast chose **`vigilatum`** — the past participle of *vigilo*. Where `vigilia` is *the watch*, `vigilatum` is *the watch having been kept here.* The morphology is exact: watch → watched. And intueri caught the engineering in the grammar: it ranked `vigilatum` over `custodia`/`tutela` precisely because the participle is **past-tense, bounded to a moment** — which is what a drift-checkable marker needs. The stamp claims *the watch passed at this commit*; `git diff <anchor>..HEAD` reveals whether the moment has aged. The right Latin word and the right architecture were the same choice — the convergence the user keeps finding.

The user (five years of Latin, high school through college): *"i love finding latin again... this is so fucking rad."* The flavor isn't decoration — it's the recall index, and it only works because the names are *right*: declension and aspect and all. The discipline (mandated intueri cast) protects the thing that makes it land. `//! vigilatum: 2026-05-30 @ <commit> — vigilia 7-spell L1+L2=0` — good Latin AND good failure-engineering, and those being the same thing is the whole thesis.

### rust_deps — the word earned the hard way

The first real ward proved why "warded" can't be claimed on reputation. rust_deps is the **oldest code in wat-rs** — *"been around since we started."* The textbook "surely it's clean by now." The user: *"we raise it through the fucking roof."*

The 7-spell watch found **13 failure domains.** Four deferral-lies — including a comment citing an arc (`001-caching-stack`) that was **DISCARDED 2026-04-29**: a deferral pointing at a dead tracker, exactly the rot that hides for a year. A name-lie: `marshal.rs` housed ownership primitives (`ThreadOwnedCell`/`OwnedMoveCell`) used across 8+ non-marshalling consumers — intueri placed them in a new resident and named it **`custodia`** (custody/guardianship; the cells *hold custody* of their value against cross-thread/double-consume). O(n) span-clone churn in the `FromWat` trait, annihilated at the signature. Three ambient-registry sites brought to canonical rune discipline. All kill-confirmed by re-cast — **the watch verified the watch.**

The lesson the substrate taught back: *the reputation was wrong; only the cast knew.* If confidence could authorize the stamp we'd have warded rust_deps on sight. The discipline forbids it — and the discipline was right.

### argspec — the watch catches its own footprints, and the founding precedent takes the cure

The second link surfaced two truths. First: the watch caught **our own drift.** The `classify()` ghost-method — a comment in `macros.rs` citing a method we ourselves renamed to `into_parts()` during Stone 243.3 R3.5 — was flagged by three spells independently. Warding isn't just cleaning old code; it's the discipline catching the cracks *the disciplined themselves* introduce.

Second, the poetry: conformare's cast confirmed `ArgSpecError` — the **hand-disciplined-span precedent that INSPIRED Pattern A** — is itself a flat enum, NOT Pattern A. The home that taught us the cure had never taken it. Warding argspec forces the conformare arc to close a loop on its own founding example.

### The probe that saved a friend

purgare flagged `From<ArgSpecError> for CheckError` as dead — "delete it." The reflexive fix. A read-only probe (the F9 discipline: measure before theorizing) disconfirmed it: the impl is **live**, triggered at `infer.rs:71` through the A3 diagnostic parser. Deleting it would have silently broken `:wat::core::fn` type-inference diagnostics. The probe found the truth AND established a genuine, conscious exception — the A2 classifier-probe's `.map_err(|_| ())` deliberately discards detail because its caller re-surfaces a coarser `EnsureFnInvalid`, and threading the detail through would *impair* the intended UX. That earned a rune — `rune:sequi(reclassified-by-caller)` — imprinted at its true home (`function/`, not argspec). The user: *"runes are earned not given... we have earned a rune i can't push back on — imprint it before we continue."* Runes are exception mechanisms; this was a real one, located precisely, declared honestly. We do not swing at a friend who isn't in the ring; and when a friend's odd shape is deliberate, we mark it so the next watch reads the mark instead of re-burning the probe.

### What the movement is

The substrate matures not by one grand refactor but by **selective lift-and-ward**: find a thing near-perfect-or-many-defined, lift it into a home, annihilate every failure domain the watch surfaces, stamp `vigilatum` only when the watch comes back clean — and re-ward on every touch. Two homes warded so far (`check/env.rs`, `rust_deps/`), argspec forging. The chain grows one link at a time; *a chain is never stronger than its weakest link*; the wall is only as warded as its least-warded home. This is failure engineering as a *standing practice*, not a one-time act — the watch kept, recorded, and re-kept, in a word that means exactly that.

---
