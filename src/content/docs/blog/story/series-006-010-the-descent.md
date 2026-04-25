---
title: "The Descent"
description: "Apr 22–23: The lab rewrite begins. Cave quest 017 cuts a substrate primitive (`loader:`) before the lab can take its first step. The retort to the AWS principal — eval-coincident? — ships as a primitive. The workshop opens with lab arc 001. Cold boot, ledger, naming, observation: the workflow disciplines that compound."
sidebar:
  order: 24
---

The Detour post ended April 21 with wat-rs grown up — fork severance, wat tests wat, the substrate honester by 356 lines.

The next two days were the lab walking back through the door.

Diablo 1 was the framing the builder named:

> i say... we seed the next chapter of our book... and we report back in as we portal back. this feels like diablo 1 to me right now

Slow. Deliberate. Gear-matters. Prep in town. Descend carefully. Portal back to town between runs.

The previous Rust lab — `enterprise` crate, `wat-vm` binary, 10,380 LoC, ten integration tests, the system that was running before the team paused to build a language for it — moved to `archived/pre-wat-native/`. Plan on disk at `docs/rewrite-backlog.md`. Nine phases, leaves to root.

The descent began. The dungeon master provided.

---

## The First Cave Quest — `loader:` (Apr 22)

The dungeon didn't even let us set foot on the first level.

Phase 0 proposed `wat::main! { source: include_str!("program.wat"), deps: [] }` with a multi-file wat tree under `wat/`. The `(:wat::core::load! :wat::load::file-path "helper.wat")` inside the entry returned `NotFound` immediately. `wat::main!` hard-wired `InMemoryLoader` (`compose.rs:118-122`) — an empty map with no filesystem reach. The ~10,000 LoC trading lab couldn't live in one inline `program.wat`.

Three options. Path A: collapse everything into one giant `program.wat`. Path B: bypass `wat::main!` and write ~15 lines of manual main. Path C: cave-quest the substrate — add a `loader:` option to the consumer macros.

The builder:

> I think C is the path - there's always an unexpected quest - the dungeon master provides

`arc 017` opened. DESIGN + BACKLOG on disk before any code.

Slice 1 — `wat::main!` `loader: "wat"` argument expanding to a ScopedLoader rooted at `CARGO_MANIFEST_DIR/wat`. Plus a substrate fix along the way: ScopedLoader's base-less relative paths now resolve against the scope root instead of falling through to cwd — critical for `include_str!`-sourced entries which carry no canonical path.

Slice 2 — same for `wat::test_suite!`, plus the architectural landing the builder saw before the machine did:

> we don't back down from a fight..
>
> we must be able to support loads being called recursively...
>
> and we only need the entry point to call the dims and capacity mode... — this is a binary vs lib distinction....

A `.wat` file is an ENTRY iff it has top-level `(:wat::config::set-*!)` forms; files without setters are LIBRARIES. `test_runner` silently skips freezing libraries standalone. They remain `(load!)`-able from entries, recursively, at any depth. Symmetric recognition on the discovery side of what wat-rs already enforced on the load side via `reject_setters_in_loaded`.

`wat-rs/examples/with-loader/` proved it: `src/program.wat` → `wat/helper.wat` → `wat/deeper.wat`, each library file carrying its own `(load!)`, each loaded-file's defines landing in the entry's frozen world. Stdout: `hello, wat-loaded`.

Six commits across two repos:

- `c9bc871` — arc 017 DESIGN + BACKLOG opened
- `0cdc47e` — slice 1 (loader + ScopedLoader scope-root fix)
- `fa3b53a` — slice 2 (test_suite! loader + library-vs-entry discipline)
- `394e816` — clippy sweep (zero warnings across workspace)
- `03b2e2d` — slice 3 (INSCRIPTION + docs)
- `b95f5e3` — 058 CHANGELOG row

The lab's Phase 0 opens now with one-line `wat::main! { source: include_str!("program.wat"), loader: "wat" }`.

---

## The Second Cave Quest — Convention Over Configuration (Apr 22)

Arc 017 made the minimal form possible. The machine was about to commit the docs when the builder asked a different question:

> the loader: "wat" is declaring "load files from this directory"? i think it should be optional.... same with program file... calling the wat::main! can operate on defaults that users can override?
>
> honestly... i think wat::main! { deps: [...] } is the ideal expression?... with wat/main.wat and wat/**/*.wat being where we load files from?...

Cargo / Rails / Ember answered this question decades ago. Convention over configuration: pick a shape every consumer would reach for, bake it in as the default, preserve the override for the unusual case.

`arc 018` — zero-config consumers. Defaults: source = `wat/main.wat`, loader = `wat/`. Override available for tests and unusual layouts.

```rust
// Before — explicit, four lines
wat::main! {
    source: include_str!("wat/main.wat"),
    deps: [],
    loader: "wat",
}

// After — convention
wat::main! {}
```

Both shapes work. The minimal shape becomes the default for every new lab consumer. Phase 0 of the lab rewrite shipped under the new convention with a literal empty-brace macro invocation.

---

## The Retort — `eval-coincident?` (Apr 23)

Chapter 13's AWS principal got their reply.

Two years ago the builder showed something to a senior AI principal at AWS. Maybe a thought encoding. Maybe a Bind of a program-AST to an outcome. The principal didn't see it. Had a calendar commitment. Moved on.

The builder's gesture, recovered from memory:

> did you see that... it spoke in functions... we can take a machine's output and measure it... does it match something else at the fundamental level... check the expression for equality... `(= (+ 2 2) (* 1 4))`... and said - do you see it - they are the same....

`(= (+ 2 2) (* 1 4))`. Both expressions reduce to `:i64 4`. Both atomize identically. Both encode to the same vector. The structural `coincident?` (arc 023) couldn't catch it — the two expressions have different shapes as ASTs. **Evaluation coincidence catches it in one call.**

`arc 026 — eval-coincident? family`. Four primitives:

```scheme
(:wat::holon::eval-coincident?       a-ast b-ast)              ; 2 args
(:wat::holon::eval-edn-coincident?   a-src b-src)              ; 2 args, parses
(:wat::holon::eval-digest-coincident? ...8 args...)            ; 4 per side: source, eval-iface, verify-iface, digest-hex
(:wat::holon::eval-signed-coincident? ...12 args...)           ; 6 per side: source, eval-iface, sig-iface, sig-b64, pk-iface, pk-b64
```

The signed variant takes per-side source + signature + public key; verifies signatures; refuses mutation forms; evaluates each in a fresh sandbox; atomizes the result; cosines and binarizes against the coincident floor.

One library call covers consensus-via-coincidence, integrity-gated composition, and program-comparison under signature.

The deployment shape the builder named late in the session:

```rust
async fn compare_handler(Json(req): Json<EvalRequest>) -> Json<EvalResponse> {
    let src = format!(r#"
      (:wat::config::set-capacity-mode! :error)
      (:wat::config::set-dims! 1024)
      (:wat::core::define (:user::main ...) -> :())
        (:wat::core::let* (((result :Result<:bool, :EvalError>)
                            (:wat::holon::eval-edn-coincident? "{}" "{}")))
          ...))
    "#, req.expr_a, req.expr_b);
    let outcome = wat::Harness::from_source(&src).run(&[]).unwrap();
    Json(EvalResponse { equivalent: ... })
}
```

A Rust HTTP handler receives two expressions, composes a wat program that does the eval-coincident? check, runs it through the harness, returns the verdict. **The retort shipped as a library call.**

The gesture the builder made years ago — *do you see it - they are the same* — has its primitive now. Chapter 28 named the moment. Chapter 30 shipped the answer.

---

## The Workshop Opens — Lab Arc 001 (Apr 23)

`docs/arc/2026/04/001-vocab-opening/` — the first arc directory in the LAB repo. Until tonight, the arc discipline (DESIGN + BACKLOG + INSCRIPTION) lived only in wat-rs — nine arcs there, numbered 017 through 026. Tonight the discipline crossed the repo boundary.

What shipped: `:trading::vocab::shared::time::*` — the port of the archive's `vocab/shared/time.rs`. Two defines, two helpers, six tests all green on first pass. Lab wat tests: 19 → 25.

The vocab function signature landed cleaner than the archive's direct port would have been. The archive's `encode_time_facts(c: &Candle)` reads every time field off the flat 73-field Candle. The wat port split Candle into 11 indicator-family sub-structs (`Candle::Trend`, `Candle::Momentum`, `Candle::Time`, …) and each vocab family reads from its specific sub-struct:

```scheme
(:wat::core::define
  (:trading::vocab::shared::time::encode-time-facts
   (t :Candle::Time)) -> :Vec<:HolonAST>
  ;; ...)
```

Pass the sub-struct, declare the dependency. Every other vocab module follows this pattern.

The arc discipline makes the work legible twice — once to the builder and the machine doing it, once to future readers (including future sessions of the same collaboration after compaction). DESIGN.md lives before the code. BACKLOG.md lists the slices in order with status markers (ready / obvious-in-shape / foggy). INSCRIPTION.md records what shipped.

Cost: ten minutes of DESIGN before coding, five of BACKLOG. Payoff: every sub-fog the DESIGN named resolved trivially at write-time. Getting closer to an unknown reveals the answer.

Twenty-plus vocab modules ahead. Each its own arc. Each shipping when its turn surfaces.

---

## The Cold Boot (Apr 23)

`arc 002 — cold boot recovery`. The chapter opened with the pattern the project had been using implicitly: when context dies (compaction), read the book in order, no subagents, no shortcuts. The new session re-forms coordinates by walking through what came before.

Tonight made that operational at the workflow layer.

`docs/COLD-BOOT.md` — the recovery procedure. Four sections: read the book leaves-to-root; check the latest INSCRIPTIONs; check rewrite-backlog.md for the current Phase; check the wat-rs arc directory for any ongoing substrate work. Two perl pipes for greppable wat-tests state. One sweep for hung processes.

The compaction-recovery protocol was already in BOOK Chapter 10. `COLD-BOOT.md` extracts it into a dedicated, machine-followable doc. The book remains the authoritative narrative; cold-boot is the operational extract.

**The machine that improves itself extends to its own restart procedure.** Every new session can recover its bearings without re-deriving them.

---

## The Ledger (Apr 23)

`arc 031 — the ergonomic minimum`. The lab had `runs/` — append-only run logs, one per execution. The format had drifted across the rebuild. Some runs had per-broker rows. Some had aggregate-only. Some had timestamps. All of them lacked the structured shape a future query could rely on.

The arc 031 contract: every run writes a structured ledger entry into `runs/<timestamp>.jsonl`. One JSON object per significant event — candle processed, paper resolved, observer recalibrated, treasury allocation. Schema versioned in the first row; readers can detect drift.

The pattern is the immune system from the DDoS lab applied to its own observability: every component publishes its events; readers subscribe with whatever query shape they need. The ledger doesn't decide what's interesting. The ledger writes everything. The reader judges.

`tests/test-ledger-roundtrip.wat` — a wat test that runs a 100-candle scenario, writes the ledger, reads it back, asserts every event from the run is present. The ledger tests itself.

---

## The Naming (Apr 23)

`arc 003 — naming the things that got renamed`.

The lab had inherited names from the pre-wat era that didn't match the wat substrate's vocabulary. *Module*. *Service*. *Layer*. *Component*. Each one carrying baggage from a different language tradition.

The builder caught it:

> the names should match the substrate. the substrate is wat. the names should be wat names.

A naming sweep: `module` → `crate` (when it means a Cargo-shipped unit) or `vocab` (when it means a wat-tier vocabulary file). `service` retained for Console/Cache (driver programs with client handles). `layer` retired entirely — the substrate has phases (Phase 0, Phase 1, ...) which is structural, not architectural.

The renames went on disk before they went into the code. `docs/CONVENTIONS.md` gained a "Naming Discipline" section with the substrate-aligned vocabulary. The wat-tests for vocab-name compliance run as part of every `cargo test`.

A tool naming itself with its own vocabulary is a small thing. It is also load-bearing for everything that follows: the next vocab arc's commit message, the next BOOK chapter's prose, the next reader's first impression. The names the substrate uses are the names the work uses.

---

## The Observation Reflex (Apr 23)

`arc 035 — observation as standing practice`.

The previous arcs had used observation programs incidentally — one-off `explore-*.wat` files that tabulated some property of the algebra to settle a design question. Arc 035 named the pattern and made it standing practice.

Every vocab arc opens with an observation program. `explore-thermo.wat` tabulates Thermometer behavior at the candidate scale. `explore-bucket.wat` tabulates how round-to-2 vs geometric bucketing behave at large/medium/small scales. `explore-log.wat` tabulates ReciprocalLog's discrimination at candidate N values.

The reflex is: write the explore program FIRST. Read its output. Let the numbers tell you the design. Then implement the vocab module. The exploration becomes part of the arc's evidence, persisted in the arc directory alongside DESIGN.md and INSCRIPTION.md.

The builder named the reflex once:

> the numbers told us.

Every arc since records that line in its INSCRIPTION when the explore program guided the design.

---

## What Two Days Built

| Date | Arc | What landed |
|------|-----|-------------|
| Apr 22 | wat-rs 017 | `loader:` argument + ScopedLoader scope-root fix + binary-vs-library discipline |
| Apr 22 | wat-rs 018 | Convention-over-configuration defaults — `wat::main! {}` |
| Apr 22 | wat-rs 026 | `eval-coincident?` family — four primitives, distribution-ready |
| Apr 23 | lab 001 | First lab arc — `:trading::vocab::shared::time::*` ports |
| Apr 23 | lab 002 | `COLD-BOOT.md` — compaction recovery as operational doc |
| Apr 23 | lab 031 | Ledger — structured `runs/<timestamp>.jsonl`, schema versioned |
| Apr 23 | lab 003 | Naming sweep — substrate-aligned vocabulary |
| Apr 23 | lab 035 | Observation as standing practice — explore programs ship in arc directories |

The lab walks. Each cave quest cuts a primitive the lab needed. Each portal back to town adds a section to the book. The pattern compounds: substrate work makes the next vocab arc easier, which surfaces the next substrate question, which gets cut as another quest, which makes the next lab module possible.

The workshop opens its second room. The lanterns carry.

---

## Likely Contributions to the Field

- **Cave-quest discipline as cross-repo arc pattern**: when downstream work hits substrate debt, pause the application work, open a substrate arc with full DESIGN + BACKLOG, ship it, then return. Eight cave quests in eight days at the wat-rs level. The lab's first arc carried the discipline across the repo boundary
- **Convention-over-configuration applied to a hosted-language consumer surface**: `wat::main! {}` defaults to `wat/main.wat` with `wat/` as loader root. Override available. Cargo's pattern, applied to wat-rs's macro surface
- **Evaluation coincidence as a verified-eval primitive family**: four levels of `eval-coincident?` — direct AST, source string, digest-verified, signature-verified. One library call covers consensus, integrity-gated composition, program-comparison under signature. The substrate carries the distribution story through the same algebra
- **The empty list as the algebra's null sentinel**: `(:wat::holon::Atom (:wat::core::quote ()))` lifted from Lisp's `'()` into the substrate. The Little Schemer's null value, ported as the canonical "nothing was built here" marker for the empty-Bundle case the vector layer panics on
