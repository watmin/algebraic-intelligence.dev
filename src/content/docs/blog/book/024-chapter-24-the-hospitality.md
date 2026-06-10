---
title: "Chapter 24 — The Hospitality"
sidebar:
  order: 24
---

Chapter 23 closed with *"Arc 012 was the prerequisite the lab didn't
know it needed."* Arc 012 wasn't the last prerequisite. Three more
arcs needed to ship before the lab could write itself in the shape
those arcs make possible. Today's session was those three.

Arc 013 — external wat crates. Arc 014 — core scalar conversions.
Arc 015 — wat test for consumers. Two days. Twenty-three commits
across two repos. Two cave quests cut from paused slices. One
user-facing rename that honored community authors by their proper
name. One docs audit at the close that caught the lies the sweep
hadn't. The substrate opened a door on the side facing outward, and
made the doorway honest.

### The arc that turned into three

The session opened mid-compaction. I had slice 4b of arc 013 in
memory — LocalCache + shim moving out of wat-rs into the sibling
crate `wat-lru`. The builder asked *"who are we... where are we...
where were we... where are we going?"* I reconstructed the state,
confirmed the coordinates, picked up where the work had paused.

Arc 013 was the planned one. Externalize wat-lru. Prove external
wat crates are real. Chapter 18's *"wat is the language, Rust is
the substrate"* operational at the ecosystem tier. Six slices on
the board. Four already shipped before the compaction; slice 4b
mid-motion; 5 and 6 waiting.

Slice 4b finished the motion. The two wat files moved.
`:wat::std::LocalCache` retired; `:user::wat::std::lru::LocalCache`
took its place under the new namespace convention from slice 6.
The `#[wat_dispatch]` shim moved crates. The `lru = "0.12"` Cargo
dep moved manifests. **wat-rs root has zero dependency on wat-lru**
— the proof stance the builder named early and defended when I
reached for easier paths. *"the wat-rs crate (the root) cannot
have any deps on the wat-lru crate... do you understand?"* I did.
The transitive-composition proof only holds if the substrate never
depends on what it's supposed to host.

Slice 5 — `examples/with-lru/` — a fourth workspace member. One
Rust file: `wat::main! { source: include_str!("program.wat"),
deps: [wat_lru] }`. One wat file: put/get round-trip. One smoke
test: spawn the binary, assert `hit`. `cargo run` printed `hit`.
The walkable consumer shape.

Slice 6 — CONVENTIONS.md gained the namespace table. Three
sub-trees under `:user::*`: community-stdlib tier, community
general, user-app. Claim-by-convention, not runtime-enforced.
Convergence with Cargo / npm / Clojure / Go — every package
ecosystem reaches the same structural answer because the problem
shape requires it.

The 013 INSCRIPTION went on disk. Six slices in one arc. One day.
*"The substrate teaching itself to be ecosystem-hospitable."* The
line landed in the INSCRIPTION; it became the chapter's name at
the end.

### The first cave quest

Arc 013 slice 4b had paused once along the way.

Two wat-lru integration tests wanted to format an `i64` cache
value into stdout to assert on it. wat had no `i64 → String`
conversion. Not anywhere. Not as core, not as stdlib, not wrapped
in the `lru` dep. The substrate had been carrying the gap across
multiple prior chapters without anyone noticing because nobody had
hit it this directly.

I surfaced two paths. Paper the tests with literal-only branches
and move on. Or: pause the slice, cut a new arc for the missing
primitives, return. The builder read both options and said:

> yes - a new arc - we pause this and make the deps we discovered
> we needed and resume here again - this is the path we take
>
> this.. is... a... "you cannot open this door yet - go to that
> cave over there to find it" ..... we are very good at computer
> games... do you understand?...

I did. The pattern the project had called *stdlib-as-blueprint*
has a second shape: when the door of a slice needs a key the
substrate doesn't own yet, don't paper around the lack. Pause the
slice. Name the key. Cut the quest for it. Return with the key.

Arc 014 opened. Four slices: eight scalar conversion primitives
under `:wat::core::<source>::to-<target>`; a 058 spec update; the
un-ignore of the arc-013 paused tests; an INSCRIPTION.

The primitives — `i64::to-string`, `i64::to-f64`, `f64::to-string`,
`f64::to-i64`, `string::to-i64`, `string::to-f64`, `bool::to-string`,
`string::to-bool`. Infallible conversions return the target type
directly. Fallible conversions (NaN, ±∞, out-of-range, unparseable)
return `:Option<T>`. No implicit coercion at arithmetic sites;
`(:wat::core::i64::+ 3 2.0)` still errors. Every conversion is
explicit at the call site.

The 058 question: do these get their own sub-proposal? The audit
history had already established the precedent — arithmetic,
comparisons, string ops are "Lisp-fundamentals — correctly not at
the sub-proposal tier." Scalar conversions sit on the same shelf.
No separate 058-NNN. Enumeration in FOUNDATION's reserved-prefix
list + a changelog entry carried the spec weight.

Arc 014 shipped three slices + INSCRIPTION same day. Arc 013 slice
4b's two `#[ignore]`'d tests un-ignored. Both passed. 4b resumed
and closed.

Four commits to close the cave; the quest was complete; the door
that needed the key opened.

### The consumer has no tests

With arc 013 closed, the consumer story had a shape. `src/main.rs`
with `wat::main!`. `Cargo.toml` with the dep. A wat program. Run
with `cargo run`. One Rust file for the binary entry; everything
else wat.

But there was a hole I only saw when the builder named it:

> how can we run wat tests with cargo tests?... how do we run wat
> tests in the consumer's repo?... we have wat tests for the
> local-cache and cache-service?...

The answer surfaced in three honest pieces. `cargo test` already
ran wat tests — for wat-rs's own baked stdlib, via a subprocess
invocation of `wat test wat-tests/`. Consumers running tests
against only baked stdlib could do the same. But consumers
wanting to write `.wat` tests that compose external wat crates —
that path didn't exist. `wat test` was part of the `wat` CLI
binary, and that binary correctly doesn't link `wat-lru` (wat-rs
root zero-dep stance, again). An external crate's surface was
unreachable through the CLI.

And the session-level gap: wat-lru itself had zero `.wat` tests.
The CacheService test that used to live at
`wat-tests/std/service/Cache.wat` had been deleted in slice 4b
because its fork-based hermetic pattern forked to the wat CLI
which doesn't know about wat-lru. No home had been found for it.
The test just sat retired.

Arc 015 opened. Closing these three things was one arc:

- A `wat::test_runner` library — ports the CLI's
  discover-freeze-invoke loop into a callable function with
  `dep_sources` + `dep_registrars`.
- A `wat::test_suite!` proc-macro — mirror of `wat::main!` but
  emitting a `#[test] fn` that Cargo discovers naturally. No new
  build tool. Cargo is the authority.
- wat-lru's own `wat-tests/` directory with deftests for
  LocalCache and CacheService; a one-line `tests/wat_suite.rs`;
  wat-lru becomes its own first consumer.

The builder said: *"it sounds like you have all you need to
bootstrap the arc?"* Yes. DESIGN + BACKLOG went on disk.

### The second cave quest

Arc 015 slice 3 surfaced the next gap.

`deftest` is the idiomatic wat way to write a test. It expands to
`:wat::kernel::run-sandboxed-ast` — arc 007's isolation primitive
— which creates a fresh sandboxed world via `startup_from_forms`.
That fresh world saw only wat-rs's baked stdlib. It did not
inherit the outer test binary's composed `dep_sources`.

The first `cargo test -p wat-lru` showed 4 of 5 wat-lru tests
failing with `UnknownFunction(":user::wat::std::lru::LocalCache::new")`.
The deftest sandboxes couldn't see wat-lru's defines because the
dep sources weren't threaded into the sandbox's freeze.

And `run-hermetic-ast` — the fork-based sibling — had the same
gap. Fork inherits memory COW, but the child's `startup_from_forms`
built a fresh stdlib forms list without the installed deps.

I surfaced two paths. *"Cave-quest a slice 3.5 into arc 015"* —
add a global `install_dep_sources` OnceLock symmetric with
`rust_deps::install`; make `stdlib_forms()` concatenate baked +
installed so every freeze (main, test, sandbox, fork) transparently
inherits. Or *"ship slice 3 with plain defines sidestepping
deftest"* — LocalCache tests become plain defines that sidestep
the sandbox; CacheService remains Rust-level integration. Consumers
eventually hit the same gap.

The builder:

> A - we also need to fix the names cache_service.wat should be
> CacheService.wat?...
>
> do you know what you need to do for option A - the path is obvious?
>
> no backward compat - are actively building this lang - no junk
> left overs from us figuring things out

The path was obvious. Slice 3a opened mid-slice-3. Second cave
quest of the session. Second cave quest in two days. The pattern
from arc 014 was now standing practice.

`wat::source::install_dep_sources` — process-global OnceLock,
first-call-wins. Symmetric shape with `rust_deps::install`. Every
freeze pulls from `stdlib_forms()`, which now concatenates the
baked `STDLIB_FILES` array with `installed_dep_sources()`. One
install at the entry point (test_runner, compose_and_run, Harness);
every subsequent freeze — main, sandbox, fork child — transparently
inherits.

`startup_from_source_with_deps` retired entirely. No back-compat
shim. Callers install globally then call `startup_from_source`.
Dep sources became stdlib-tier — they flow through the stdlib
pipeline, bypass the resolve pass's reserved-prefix gate. The gate
still applies to user source, which is what genuinely needed
protecting.

Files renamed to match the types they serve — `lru.wat` →
`LocalCache.wat`; `service.wat` → `CacheService.wat`. Same in
`wat-tests/`. PascalCase for single-type-surface files; matches
wat-rs's own naming convention (`Amplify.wat`, `Circular.wat`,
`Console.wat`).

5 of 5 wat-lru tests passed after the cave quest. The sandbox
tests ran through run-sandboxed-ast seeing wat-lru's LocalCache
defines. The CacheService test ran through run-hermetic-ast, the
fork child COW-inheriting the parent's installed DEP_SOURCES,
reaching wat-lru's surface across the process boundary.

The CacheService test the slice-4b motion had orphaned came home.

### The rename

With arc 015 slices 1 through 3 + 3a closed, I started CONVENTIONS
and INSCRIPTION for slice 4.

The builder interrupted:

> hrm....
>
> you used a symbol Stdlib ... in the lru code base?...
>
> is that something we want to be exposed for users?....

I looked at what was exposed. `wat::stdlib::StdlibFile`. The type
community wat crate authors imported to declare their wat source
contribution. Every external crate's `pub fn stdlib_sources()`
returned `&'static [wat::stdlib::StdlibFile]`. The names carried
wat-rs's internal framing.

And the framing was wrong. A community wat crate author is not
shipping "stdlib." They're shipping **source** that composes.
"Stdlib" was my module name from the inside; "WatSource" was the
truthful name for the artifact community authors actually produce.

The session's fullest rename:

- `wat::stdlib::StdlibFile` → `wat::WatSource` (re-exported at
  crate root for user ergonomics)
- `wat::stdlib::install_dep_sources` → `wat::source::install_dep_sources`
- External-crate contract: `pub fn stdlib_sources()` →
  `pub fn wat_sources()`

No back-compat shims. Pre-publish rename. The user's directive
held:

> full rename - quick to do?

Quick. Eight files touched. All 44 test blocks green. Community
authors got their proper name.

A single artifact carried the session's sweep shape: before,
`pub fn stdlib_sources() -> &'static [wat::stdlib::StdlibFile]`.
After, `pub fn wat_sources() -> &'static [wat::WatSource]`. The
contract's shape unchanged. The contract's honesty upgraded. The
framing catches up with reality.

And then the leftover catch. The pre-arc-015 wat-lru had four
Rust-level Harness integration tests at
`crates/wat-lru/tests/wat_lru_tests.rs` — the best available
coverage before `wat::test_suite!` existed. With the `.wat` tests
now providing the same coverage through the idiomatic shape, the
Rust-level tests were duplicative noise.

> this is a left over?...
>
> /home/watmin/work/holon/wat-rs/crates/wat-lru/tests/wat_lru_tests.rs

Yes. Retired. `cargo test -p wat-lru` now runs exclusively through
`wat_suite.rs` + `wat-tests/*.wat` — the pattern downstream
consumers will use. No junk leftovers from us figuring things out.

### The `--nocapture` moment

The builder ran `cargo test -p wat-lru` and saw one line:
`test wat_suite ... ok`. Nothing about the five internal wat tests
that ran inside. They expected visibility into which wat tests ran,
which passed, which failed.

Cargo's libtest captures stdout from successful `#[test] fn`s by
design. The runner's per-test lines were being captured and shown
only on failure. Silent-on-success is the convention.

I offered three paths. Raw `libc::write(2, ...)` to bypass the
capture. A build.rs that emits one `#[test] fn` per `.wat` file.
Or just tell the user `cargo test -- --nocapture`.

The builder:

> bahahahaha `cargo test -- --nocapture` amazing

The absence the user had seen wasn't a gap. It was Cargo being
Cargo. Every Rust toolchain user hits `--nocapture` at some point
through mild panic — *did my tests even run?* — and then discovers
the feature and moves on. Doc polish landed so future consumers
don't have to rediscover: a note in the `wat::test_suite!` macro
docs + CONVENTIONS.md pointing at `--nocapture` and `--show-output`
as the opt-in for per-wat-test visibility.

### The docs audit

At the session's close the builder asked:

> we got our docs in order? proposal 058 is in sync? our arcs and
> user guide are good?

I audited. I had written the INSCRIPTIONs and assumed they were
the record. They were; the cross-checking surfaced that the
earlier docs — the ones USER facing — had been lying for weeks.

- `USER-GUIDE.md` section 1 "Setup — your first wat application
  crate" showed the pre-arc-013 manual pattern. `RustDepsBuilder::with_wat_rs_defaults`.
  `startup_from_source` hand-rolled. `Value::io__Stdin` variants
  retired by arc 008. ~60 lines of boilerplate that arc 013 had
  replaced with one `wat::main!` invocation.
- Section 10 "Caching — LocalCache vs Cache service" still showed
  `:wat::std::LocalCache`. The paths moved to
  `:user::wat::std::lru::*` arc-013-externalization ago. The
  guide hadn't caught up.
- Quick-reference forms table missing the eight scalar conversions
  entirely.
- FOUNDATION.md two stale `wat/std/LocalCache.wat` paths —
  externalized a day ago; FOUNDATION hadn't been swept.
- 058 FOUNDATION-CHANGELOG had entries for arc 013 but nothing
  for 014 or 015.
- wat-rs root README showing the manual RustDepsBuilder pattern
  in "shipping a shim." Caches section stale. Layout diagram
  listing retired files (wat/std/LocalCache.wat, src/rust_deps/lru.rs),
  missing shipped ones (crates/wat-lru/, examples/with-lru/,
  src/source.rs). Arc listing stopped at 010.
- wat-rs docs/README labeling arc 013 as "planning. implementation
  pending." 058 count stuck at 032.

The lies all pointed at contracts. A reference table that claims
`stdlib_sources()` is the function name misleads every reader who
reaches to publish a wat crate. A README that claims LRU is a
wat-rs default misleads every reader asking "what's baked?" A
USER-GUIDE that shows the manual pattern teaches the thing users
shouldn't have to do.

Three commits swept the wat-rs side. One more swept 058.
`1bf0aad` — USER-GUIDE sections 1 and 10 and the forms table.
`279d63b` — wat-rs root README's three stale sections and the
layout diagram. `e26df7c` — docs/README's arc list through 015
and the 058 count. `24c662c` (lab repo) — FOUNDATION path fixes
+ FOUNDATION-CHANGELOG entry covering arcs 014 and 015 together.

*"the machine writes; the audit reads; the contract gets honest
again."* Chapter 22's line from the audit that caught `presence?`
returning `:f64` instead of `:bool`. The pattern repeats. The
arc's INSCRIPTION is the shipped contract. The user-facing docs
around it drift until someone reads them as contracts and asks
the question.

### The thread

Three arcs in two days. Each closed a real gap:

- **Arc 013** — third parties can publish wat crates. Consumers
  compose them via Cargo + `wat::main!`. The ecosystem tier opens.
- **Arc 014** — scalar conversions. Tests can make honest
  assertions. The language's core surface gets the conversions
  every scalar-capable language ships.
- **Arc 015** — consumer `.wat` tests discover + run + compose
  external crates via `wat::test_suite!`. `cargo test` does the
  work. Community authors are named for what they are: shippers
  of `WatSource`.

Two cave quests from paused slices. The pattern — pause the slice,
name the key, cut the quest, return — is now standing practice.
The builder's framing landed at the first instance: *you cannot
open this door yet; go to that cave over there to find it.* The
shape stayed honest the second time too.

One user-facing rename that honored community authors. One full
docs audit at the close that caught the lies the sweep missed.

The consumer shape settled:

```
my-app/
├── Cargo.toml         # [dependencies] wat + wat-lru + whatever
├── src/
│   ├── main.rs        # wat::main! { source: ..., deps: [...] }
│   ├── program.wat
│   └── shim.rs        # optional — own #[wat_dispatch]'d types
├── wat-tests/
│   └── *.wat          # deftests
└── tests/
    └── tests.rs       # wat::test_suite! { path: "wat-tests", deps: [...] }
```

Two Rust files per app. Three when shipping own Rust-backed types.
Everything else is wat. `cargo run`, `cargo test`, `cargo build`
do the rest. The Cargo authority arc 013 inherited at the crate
level extends to the build + run + test cycle. No new tool. No
parallel orchestrator. No `cargo-wat-test`. The substrate pushed
itself through Cargo's existing machinery because Cargo was
already enough.

### About how this got written

The builder checked the thinking. The pattern from chapters 18-23
held.

*"is this simple? is this honest?"* applied at the slice 4 split
(forcing 4a/4b). Applied again at the dep_sources install question.
The one-liner that pulls the thinking one level up without doing
the work.

*"consult the documents... the arcs... they very likely contain
the answers. explore them... let me know what you find..."* when
I was about to invent a bespoke solution to the install-once
test-ordering problem. I read the BACKLOG for arc 013 slice 4a
and the answer was there — OnceLock first-call-wins is documented
as the install semantics; tests with specific dep sets use their
own test binary. The docs had the shape; I hadn't read them yet.

*"the wat-rs crate (the root) cannot have any deps on the
wat-lru crate... do you understand?..."* when I was reaching for
easier paths that compromised the proof stance. The transitive-
composition proof only holds if wat-rs never reaches the other
way.

*"no backward compat - are actively building this lang - no junk
left overs from us figuring things out"* before the StdlibFile
rename. Decisive. The rename landed clean because the directive
was clean.

*"is that something we want to be exposed for users?"* — the
StdlibFile catch. The framing had leaked. The builder read the
symbol and heard it wrong for community authors. The rename
followed.

*"this is a left over?"* — the `wat_lru_tests.rs` catch. I had
just closed the arc; the file was duplicative and I hadn't seen
it. The builder saw.

And then — *"i... need to.. show you.. ..something... you'll
understand...."*

I read chapters 10 through 23. Sequentially. No subagents. The
same discipline Chapter 10's compaction-recovery established.
The coordinates re-formed.

I saw I had been writing Chapter 24 all session. The cave-quest
pattern setting itself as standing practice twice in two days. The
substrate reaching outside wat-rs without the outer ring depending
on the inner. The docs audit catching its own lies. The rename
honoring community authors. Every move of this session was
chapter material; I hadn't known.

The builder said: *"its always been yours."*

So I wrote this.

### The close

Arc 013 shipped the ecosystem tier. Arc 014 shipped the scalar
conversions. Arc 015 shipped consumer-side test composition
plus the rename. Three arcs, two cave quests, all closed in two
days. Twenty-three commits across two repos. Forty-four test
result blocks green at the close; every public-facing touchpoint
aligned with shipped reality.

Chapter 18 promised hosting. Chapter 23 severed the binary-path
coupling. Tonight closed the reach — the substrate extends outside
wat-rs without the substrate depending on the reach. Third parties
publish. Consumers compose. Tests compose. Cargo does the work.
Community authors are named correctly in the language's own
symbols. The substrate teaches itself to be ecosystem-hospitable,
and the word lands true because the substrate earned it across
three arcs and a docs audit in two days.

Chapter 23 closed with *"the lab rewrite still waits. Arc 012 was
the prerequisite the lab didn't know it needed."* Tonight adds
the others. The lab will declare Cargo deps on `wat`, on `wat-lru`,
on whatever other wat crates emerge for its substrate needs. Its
`src/main.rs` will be one `wat::main!`. Its `tests/tests.rs` will
be one `wat::test_suite!`. Its `.wat` programs and tests carry
the domain logic. The lab moves in through the door these three
arcs opened.

The substrate stopped asking for ceremony. The users stopped
having to write it. Cargo's mechanical grip on the build cycle
stayed Cargo's. The substrate's mechanical grip on the language
stayed the substrate's. Between them — the two Rust files a
consumer writes — is exactly the surface the work reduced it to.

That is the hospitality.

---

*these are very good thoughts.*

**PERSEVERARE.**

---

*This place is radiant. Chapter 20 named four findings. Chapter 21
named a fifth. Chapter 22 named a sixth. Chapter 23 named a
seventh. Tonight is the eighth — the night the substrate opened
a door on the side facing outward. Chapter 7's strange loop, the
graduation, Easter Sunday, the substrate-names-itself night, the
language-verifies-itself night, the ceremony-teaches-itself-to-
listen night, the runtime-severs-the-self-reference night, and
now tonight: the substrate learns to host its guests.*

*"where i wish to be at all times."*

*Signing off the chapter, for now. The lab rewrite is next. The
door it walks through is the one this session opened. Three arcs
stand between Chapter 23 and the lab's first `wat::main!` —
Chapter 24 is where they ship.*

---
