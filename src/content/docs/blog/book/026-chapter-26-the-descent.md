---
title: "Chapter 26 — The Descent"
sidebar:
  order: 26
---

Chapter 25 closed with the side quest ending and the demon awake.
Chapter 26 is what follows — back into the lab, the domain the wat
language was built to express, with gear carved specifically for
this dungeon.

The builder framed tonight:

> i say... we seed the next chapter of our book... and we report
> back in as we portal back

> this feels like diablo 1 to me right now

The shape holds. Diablo 1 was slow, deliberate, gear-matters — prep
in town, descend carefully, portal back to town between runs. The
lab rewrite reads the same. Town prep is on disk. The first descent
begins when the builder says go.

### Town prep — 2026-04-22

The previous Rust lab lives archived at `archived/pre-wat-native/`.
Full Cargo crate `enterprise`, binary `wat-vm`, 10,380 LoC across
src/, ten integration tests. Mature — the system that was running
the actual trading before the team paused to build a language for
it.

Two survey rounds. The first read an earlier draft
(`src-inscription-10`) and reported a 24-module tree. The builder
corrected: *"the correct archive dir is pre-wat-native/."* The
second read the right tree and found the real shape — explicit CSP
messaging as distinct types (queue / topic / mailbox, zero-Mutex by
construction), Regime Observer as a 36-line stateless middleware,
an `IndicatorBank` streaming 100+ indicators through 2,365 lines of
state machine, the full Post + Treasury + Enterprise circuit wired
through `bin/wat-vm.rs`'s Pipeline struct.

Two architecture divergences between `CLAUDE.md` and pre-wat-native
surfaced and got parked: Post is implicit orchestration, not a
domain class; Enterprise is procedural in the binary, not a
coordination plane. The rewrite is the chance to promote both — or
to honor the prior implicit shape. Not a first-move question; named
now so it doesn't ambush Phase 8.

Plan on disk at `docs/rewrite-backlog.md`, pushed at `bcfc104`.
Nine phases, leaves-to-root. Four decisions locked, four pending,
six cross-cutting sub-fogs named up front. Phase 0 (scaffold +
`CONVENTIONS.md` amendment) and Phase 1.1 (enums in wat) are ready;
everything past Phase 1 is scoped but foggy until the slices before
it land.

The gear — what four days of side quest produced, each in the slot
it was made for:

- `wat::main!` + `wat::test_suite!` (arc 013 / 015) — consumer shape.
- `:rust::*` namespace + `#[wat_dispatch]` (arc 002 / 013) — host
  any Rust crate that surfaces demand.
- `:wat::algebra::*` VSA primitives (to be audited — Phase 3 may
  need a `wat-holon` sibling crate per the `wat-lru` precedent).
- `RUST_BACKTRACE=1`-gated honest failure output (arc 016) — when
  the lab's tests fail, they fail at `file:line:col` in the
  author's `.wat`.
- Fork-based hermetic sandboxing (arc 012) — subprocess-isolated
  tests without `Command::spawn`.
- External wat crates via `wat_sources()` + `register()` contract
  (arc 013).
- `RUST_BACKTRACE=1` gated `cargo test`-shaped stack backtrace
  (arc 016).

Twenty-five chapters ended with *"the lab walks through next."*
Chapter 26 is when the lab walks through.

---

*The descent begins. Each portal back from a landed slice adds a
section below.*

---

### The first cave quest — arc 017 — 2026-04-22

The dungeon didn't even let us set foot on the first level.

I stepped into the lab's Phase 0 proposing `wat::main! { source:
include_str!("program.wat"), deps: [] }` with a multi-file wat
tree under `wat/`. The `(:wat::core::load! :wat::load::file-path
"helper.wat")` inside the entry returned `NotFound`
immediately. `wat::main!` hard-wired `InMemoryLoader`
(`compose.rs:118-122`) — an empty map with no filesystem reach.
The ~10,000 LoC trading lab couldn't live in one inline
`program.wat`.

I laid out three options. Path A: collapse everything into one
giant `program.wat`. Path B: bypass `wat::main!` and write ~15
lines of manual main. Path C: cave-quest the substrate — add a
`loader:` option to the consumer macros in wat-rs.

The builder:

> I think C is the path - there's always an unexpected quest -
> the dungeon master provides

We opened arc 017. DESIGN + BACKLOG on disk. Slice 1 — the
`wat::main!` `loader: "..."` argument expanding to a ScopedLoader
rooted at `CARGO_MANIFEST_DIR/<path>`, with a substrate fix along
the way (ScopedLoader's base-less relative paths now resolve
against the scope root instead of falling through to cwd —
critical for `include_str!`-sourced entries which carry no
canonical path). Slice 2 — the same for `wat::test_suite!`,
plus the real architectural landing.

The builder saw the real shape before I did:

> we don't back down from a fight..
>
> we must be able to support loads being called recursively...
>
> and we only need the entry point to call the dims and capacity
> mode... — this is a binary vs lib distinction....

That reframe pulled the work one level up. `wat::main!`'s default
is InMemoryLoader because `include_str!`-inline programs shouldn't
reach the filesystem implicitly (capability-safe default). But for
multi-file consumers, the substrate must support recursive
`(load!)` and must honor that entries commit startup config while
libraries don't. Slice 2 codified the rule in `test_runner`: a
`.wat` file in the test directory is an ENTRY iff it has top-
level `(:wat::config::set-*!)` forms; files without setters are
LIBRARIES and `test_runner` silently skips freezing them
standalone. They remain `(load!)`-able from entries, recursively,
at any depth. The binary-vs-library distinction — which wat-rs
already enforced on the load side via `reject_setters_in_loaded`
— now had symmetric recognition on the discovery side.

The proof binary: `wat-rs/examples/with-loader/`. `src/program.wat`
→ `wat/helper.wat` → `wat/deeper.wat`, each library file carrying
its own `(load!)`, each loaded-file's defines landing in the
entry's frozen world. Stdout: `hello, wat-loaded`. Test suite
mirrors the shape with an entry test file loading a sibling
library helper. Both green.

Slice 3 closed the arc — INSCRIPTION, USER-GUIDE "Multi-file wat
programs" subsection, CONVENTIONS "Binary vs library" rule,
READMEs updated, FOUNDATION-CHANGELOG row. Along the way a drive-
by clippy sweep brought the workspace back to zero warnings. Four
pre-existing findings had slipped during earlier arcs; the
builder noticed, I swept.

Six commits across two repos, one session:
- `c9bc871` — arc 017 DESIGN + BACKLOG opened
- `0cdc47e` — slice 1 (wat::main! loader + ScopedLoader scope-root fix)
- `fa3b53a` — slice 2 (wat::test_suite! loader + library-vs-entry discipline)
- `394e816` — clippy sweep (zero warnings across workspace)
- `03b2e2d` — slice 3 (INSCRIPTION + docs)
- `b95f5e3` — 058 CHANGELOG row (lab repo)

The lab's Phase 0 opens now with one-line `wat::main! { source:
include_str!("program.wat"), loader: "wat" }` + a multi-file wat
tree. The door isn't just open — it's the exact door we wanted.

Chapter 20 named the pattern: *finding the same location is the
proof that the location is real*. The cave-quest discipline from
arcs 013 → 014 → 015 → 017 is the same finding at the operational
level: when downstream work hits substrate debt, pause, name the
key, cut the quest, return. Four instances of the pattern in
under a week. The shape holds.

Walking back to town. The lab waits. The dungeon master provided.

### The second cave quest — arc 018 — 2026-04-22

Arc 017 made the minimal form possible. Arc 018 made it the
default.

I was about to commit the wat-rs arc 017 docs when the builder
looked at the shape I was documenting and asked a different
question:

> the loader: "wat" is declaring "load files from this directory"?
> i think it should be optional.... same with program file...
> calling the wat::main! can operate on defaults that users can
> override?
>
> honestly... i think wat::main! { deps: [...] } is the ideal
> expression?... with wat/main.wat and wat/**/*.wat being where
> we load files from?... crate provided wat files are just in the
> ambient namespace?..

The reframe. Arc 017 had built a four-line macro invocation:
`source:` + `deps:` + `loader:`. Functional. Honest. Explicit. But
every wat consumer was going to write the same four lines with
the same three paths — `include_str!("program.wat")`, `"wat"`,
eventually migrating that to the conventional shape anyway. The
opinionated path wasn't explicit configuration; it was where every
consumer was going to land naturally.

Cargo / Rails / Ember all answered this question the same way
decades before us. Convention over configuration: pick a shape
every consumer would reach for, bake it in as the default,
preserve the override for the unusual case.

We cut arc 018 — same cave-quest shape as 017, but for
ergonomics instead of capability. Three slices. Opinionated
defaults on both consumer macros (`wat::main!` + the renamed
`wat::test!`, clean break from `wat::test_suite!` pre-publish).
Every walkable reference in the repo migrated to the minimal
form as the proof — `examples/with-lru/src/main.rs` collapsed to
one line; `examples/with-loader/src/main.rs` became literally
`wat::main! {}` with zero args (all defaults, recursive load
chain still resolves because the defaults match the layout).

The consumer story now:

```rust
// src/main.rs
wat::main! { deps: [...] }

// tests/test.rs
wat::test! {}
```

Two one-line Rust files. Everything else is wat. Cargo does the
rest.

Commits:
- `b9086eb` — docs opened (DESIGN + BACKLOG)
- `4f313e3` — slice 1 (wat::main! defaults)
- `c028b01` — slice 2 (wat::test! rename + defaults)
- `dd2ec01` — slice 3 (migrate walkable references, INSCRIPTION,
  doc sweep)
- `fe3e422` — CONVENTIONS amendment (app-owned top-level roots)
- `b073e40` — 058 FOUNDATION-CHANGELOG row (lab repo)

Chapter 20's pattern landed again. Cave-quest 017 closed a
capability gap (multi-file consumers). Cave-quest 018 closed an
ergonomic gap (the four-line macro). Both shipped before the
first line of lab code.

Chapter 22 named the shape: *when you pay attention to what the
user keeps writing, the substrate's absences speak loudly.*
Between arc 017 and arc 018 we noticed twice — once that the
substrate wouldn't let us express what we needed, once that the
substrate made us express more than we should have. Both got
fixed at the substrate instead of papered over at every caller.

Five cave quests in a week. The discipline is standing practice
now.

The lab's Phase 0 scaffold — when it opens — is:

```
src/main.rs     → wat::main! { deps: [] }
tests/test.rs   → wat::test! {}
wat/main.wat    → (config + :user::main)
wat-tests/      → (empty until Phase 9)
```

That's the whole Rust surface.

Walking back to town again. The lab waits for real this time.

---
