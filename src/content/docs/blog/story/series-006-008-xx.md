---
title: "XX"
description: "Apr 18–19: Fourteen hours and forty minutes. 104 commits across three repos. Burn the Priest playing in the kitchen. The wat language got a name and a CLI in one night. echo watmin | wat-vm echo.wat returns watmin. The architect finished. The prophet could speak."
sidebar:
  order: 22
---

The Foundation post ended with the designers' verdicts: *ship*. The 058 algebra-surface batch was locked. The wat algebra had a specification.

What it didn't have was an interpreter.

This post covers the night the wat-rs crate was built from an empty directory. Fourteen hours and forty minutes. 104 commits. Three repos updated in lockstep. The crate that didn't exist at 10:58 PM ran a hello-world at 4:27 AM.

---

## The Setup (April 18, afternoon)

```
1:47 PM   058: algebra surface locked to Rust-surface form
4:28 AM   BOOK Chapter 16 — The Machine Runs
```

Burn the Priest — XX. The self-cover album. Lamb of God at twenty, returning to the name they started with — *Burn the Priest* — to cover the bands that made them. Bad Brains. Agnostic Front. Cro-Mags. Quicksand. Melvins. Ministry.

A band covering its own beginnings. The lineage acknowledged in its own voice. XX — twenty years, two crossings, the mark at the end of a letter.

Twenty years ago the builder tattooed *te respuo, te denego, te contemno, perseverare* in Latin over the heart. Lamb of God's *Vigil* gave him those words. XX is what happens when the band that gave the builder the incantation reaches back to honor the influences that gave them theirs. The lineage, audible.

And on XX, [*Jesus Built My Hotrod*](https://www.youtube.com/watch?v=eV8eEtxtbYQ). Ministry 1991. Lamb of God 2018. Playing in the kitchen at 4 AM while the wat-vm compiled.

---

## The Spec (1:47 PM → 10:26 PM)

Trading lab. 65 commits. The 058 batch closed.

Round 3 reviews returned. Hickey: ACCEPT WITH OBSERVATIONS. Beckman: *"the algebra composes."* Ten rejections confirmed. Parametric polymorphism approved as substrate. Orthogonalize → Reject rename shipped. The mechanical closures landed across the afternoon — banner-body reconciliations, measurements tier lifted to its own section, dual-caching named explicitly.

Chapter 13 — *The Ones Who Saw*. The chapter that named the AWS principal who didn't see, two years ago, when the builder showed something that spoke in functions.

Chapter 14 — *Strange Paths*. The zoologist who taught closures in a twenty-minute job interview twelve years ago. *"Fastest degree I could get."* Twelve years later the builder is implementing `lambda` in wat-rs. The captured environment. The substrate the zoologist explained is the language the builder is now writing.

Chapter 15 — *The Pilot Reads*. Autopilot named.

The 058 spec was complete. FOUNDATION.md froze. The designers said ship.

---

## The Substrate (10:26 PM → 10:58 PM)

`holon-rs`. 7 commits.

`HolonAST` with parametric `Atom<T>`. The `AtomTypeRegistry` registered every Rust primitive — all integer widths, both floats, bool, char, String, &'static str, unit — plus `HolonAST` itself.

```rust
#[derive(Clone, Debug)]
pub enum HolonAST {
    Atom(Arc<dyn Any + Send + Sync>),  // any registered T
    Bind(Arc<HolonAST>, Arc<HolonAST>),
    Bundle(Arc<Vec<HolonAST>>),
    Permute(Arc<HolonAST>, i32),
    Thermometer { value: f64, min: f64, max: f64 },
    Blend { a: Arc<HolonAST>, b: Arc<HolonAST>, w1: f64, w2: f64 },
}
```

Programs-as-atoms closed at the algebra level. A program is a thought. A thought has a vector. Therefore a program has a vector. The substrate became its own image.

Two legitimate encodings for any composite Holon: direct encode (structural, sub-parts recoverable via `unbind`) and atomized wrap (`Atom(Arc<HolonAST>)` — opaque-identity, EDN-hashed, used for library keys, program similarity by identity, Bundle-of-programs).

The substrate was ready. The frontend was an empty directory.

---

## The Language (10:58 PM → 4:28 AM)

Empty directory at 22:58. By 4:27: wat-vm running, echoing stdin, 353 tests passing, zero warnings. **One commit every ten minutes, unbroken.**

The slices, in order:

```
Phase 1 MVP: source text → HolonAST → Vector
Phase 1 slice 2: entry-file discipline + config pass
Phase 1 slice 3: recursive load! resolution
Phase 1 slice 4: define / lambda / let / if + basic AST walker
Phase 1 slice 5a: quasiquote lexer + parser support
Phase 1 slice 5b: Identifier struct + WatAST::Symbol refactor
Phase 1 slice 5c: defmacro + Racket sets-of-scopes hygiene
Phase 1 slice 6: type declarations + type environment
Phase 1 slice 7: name resolution pass
Phase 1 slice 7a: monomorphic type check — arity + obvious mismatches
Phase 1 slice 8: canonical-EDN hashing + source-file verification
Phase 1 slice 8b+8c: Ed25519 signed loads + grammar
Phase 1 slice 7b: rank-1 HM + ban :Any; lambda typing enforced
Phase 1 slice 7b.1: typed let bindings
Phase 1 slice 9: freeze pass — full startup pipeline + FrozenWorld
Phase 1 slice 10: :user::main invocation + constrained eval
Phase 1 slice 10b: eval-digest! and eval-signed!
Phase 1 slice 10c: four eval forms
Phase 1 slice 11: wat-vm CLI — real stdio, real signals, signature-enforced :user::main
```

Each slice a breadcrumb the previous slice earned. Leaves to root. Always.

---

## The Pivots

Two moments in the wat-rs arc reached backward and rewrote everything upstream.

### The Colon-Quote Realization

The pilot asked: `:crossbeam_channel::Sender<T>` — is that a legal wat keyword?

The lexer had been rejecting internal colons. Just that one rule: a keyword has exactly one leading `:` and no others. It seemed honest when the namespaces were `:wat/core/` and `:wat/algebra/` — slash-separated, no colons needed. But the moment a real Rust type entered the picture, slash-separators were revealed as a translation layer.

The pilot named the problem in one sentence:

> the colon is the symbol-literal reader macro. the body is a literal Rust path.

That one sentence rearranged the entire language.

```scheme
;; Before
:wat/core/load!
:wat/core//        ;; the second / was the name (division operator)
:List<T>
:Pair<T,U>
:Union<T,U,V>

;; After
:wat::core::load!  ;; separator is ::, body is Rust path
:wat::core::/      ;; no ambiguity
:Vec<T>            ;; matches Rust's collection
:(T,U)             ;; literal Rust tuple syntax — the : quotes the tuple
;; Union retired entirely — Rust has no anonymous union; named enum required
```

784 lines of diff in both directions on the atomic sweep. Every keyword path in the codebase flipped. Every proposal file in the 058 batch too.

The pilot's line, a few hours later:

> my entire career I've been chasing how to do namespaces... we are just doing it.

After years of slash-separated compromises. After years of re-introducing the same confusion in every new codebase. Tonight: stop mismanaging. Namespaces ARE. The separator is `::`. The quote is `:`. The body is Rust. Done.

### Namespace Honesty

`Value::Sender` was dishonest — the variant name could hold anything. It became `Value::crossbeam_channel__Sender`. The crate, the path, the type — all in the variant.

```rust
// Before
enum Value {
    Int(i64),
    Float(f64),
    String(String),
    List(Vec<Value>),
    Sender(crossbeam_channel::Sender<String>),
    Holon(holon::HolonAST),
    // ...
}

// After
#[allow(non_camel_case_types, non_snake_case)]
enum Value {
    i64(i64),
    f64(f64),
    String(String),
    Vec(Vec<Value>),
    crossbeam_channel__Sender(crossbeam_channel::Sender<String>),
    holon__HolonAST(holon::HolonAST),
    // ...
}
```

Error messages came back in the user's own declaration form:

```
expected crossbeam_channel::Sender<String>, got i64
```

Not "expected Sender, got Int." No short names hiding long ones. The type the user wrote is the type the error names. The lint suppression is scoped to that one enum; honesty outranked convention.

Both realizations flowed back up. The 058 batch — locked hours earlier — re-opened briefly to absorb them. FOUNDATION-CHANGELOG gained entries. Every repo swept in parallel. The spec didn't resist the language; the language taught the spec what it meant.

---

## The Hello World

The final slice wired it. `wat-vm <entry.wat>`: read the file, run the full startup pipeline, validate `:user::main`'s signature against the exact required three-channel shape, install OS signal handlers for SIGINT and SIGTERM (both routing through one `extern "C" fn` that writes a static `AtomicBool`), create three `crossbeam_channel` pairs, spawn the stdin reader and stdout/stderr writers, invoke `:user::main`, wait for threads to drain, exit.

```scheme
;; echo.wat — the hello world of the wat-vm
(:wat::core::define
  (:user::main
   (stdin  :rust::crossbeam_channel::Receiver<:String>)
   (stdout :rust::crossbeam_channel::Sender<:String>)
   (stderr :rust::crossbeam_channel::Sender<:String>) -> :())
  (:wat::core::let* (((line :Option<:String>) (:wat::kernel::recv stdin)))
    (:wat::core::match line -> :()
      ((Some s) (:wat::kernel::send stdout s))
      (:None    (:wat::core::nop)))))
```

```
$ echo watmin | wat-vm echo.wat
watmin
```

An integration test spawns the binary, pipes `watmin\n` to its stdin, reads `watmin` from its stdout, checks exit code 0. Real OS I/O. Real crossbeam channels. Real signal infrastructure (dormant in this run because no signal arrives).

`:user::main`'s signature is not a suggestion. If the program's entry point doesn't declare all three channels with exactly `:rust::crossbeam_channel::Receiver<String>` or `:rust::crossbeam_channel::Sender<String>`, startup halts with exit code 3 and a message naming the offending parameter. The CLI is kernel contract enforcement in code.

353 tests. Zero warnings.

---

## The Mark

Fifteen hours. Three repos. 104 commits. One kitchen. One album on loop. One tattoo from twenty years ago still legible.

Four layers of lineage audible at once:

- Ministry → Lamb of God → Burn the Priest → the kitchen speakers
- Church → McCarthy → Kanerva → Hickey → Beckman → the wat-vm
- *te respuo* → twenty years of silence → the Phase 1 commit
- the six-page proposal → the blank stares → `echo watmin | wat-vm echo.wat` that worked

*Jesus was an architect previous to his career as a prophet.*

The wat-vm runs. The machine found its way out.

---

## The Host (April 19)

Three hours. 23 commits in wat-rs.

Chapter 17 closed with *the machine runs*. Chapter 18 opens with *the machine hosts*.

Four commits in, the L1 cache became the forcing function. `:wat::std::LocalCache` wanted to wrap `lru::LruCache<K,V>`. Rust ships it; wat needed to use it honestly. The builder said:

> we could totally do /all/ of the programming in wat — all we need are symbols to exist, yes?

Yes. All it needs is a way to mention Rust from inside wat without lying.

**`:rust::<crate>::<Type>`** — a sibling of `:wat::*`. Every Rust-sourced identity fully qualified, mirroring its actual Rust path. `:rust::std::io::Stdin`, not `:rust::io::Stdin`. `:rust::std::collections::HashMap<K,V>`, not `:HashMap<K,V>`. No shortenings. No magic. The path is the address.

**`(:wat::core::use! :rust::lru::LruCache)`** — every program declares which Rust types it intends to touch. Set-insert semantics. Idempotent. Explicit. Readers see the contract at the top of the file.

The builder said:

> rust knows their home — we use their home. `:wat::` and `:rust::` coexist.

Underneath the names: wat is a hosted language now. Rust is its JVM. Clojure's pattern, down to the reader-visible address. Hickey's lineage carries into the algebra's reserved-prefix list.

### `#[wat_dispatch]`

Hand-written shims are real work. ~100 lines per Rust type: dispatch per method, scheme per method, registration. The author's burden grows linearly in the surface; the reader's burden grows with it.

We wrote the lru shim by hand first. Every line became a specification for the thing that would replace it.

**`#[wat_dispatch]`** — one proc-macro, a sibling `wat-macros/` crate, and an annotated `impl` block becomes a shim. The scope attributes spell the intent at the surface:

- `shared` — immutable, cross-thread, plain `Arc<T>`.
- `thread_owned` — mutable, single-thread-owned, `ThreadOwnedCell<T>` guard, **zero Mutex**.
- `owned_move` — consumed on first use, `OwnedMoveCell<T>` with an atomic gate.

```rust
#[wat_dispatch(prefix = ":rust::lru::LruCache", scope = "thread_owned")]
impl<K: Hash + Eq, V: Clone> LruCache<K, V> {
    pub fn new(cap: NonZeroUsize) -> Self { ... }
    pub fn get(&mut self, k: &K) -> Option<&V> { ... }
    pub fn put(&mut self, k: K, v: V) -> Option<V> { ... }
}
```

The regenerated lru shim diffed to ~20% of the hand-written size. Behavior identical. The macro had been specified into existence by the thing it was replacing.

### The Cache Deadlock

The first cache test hung at T1.

Three stderr checkpoints — *about-to-put*, *put-acked*, *get-returned* — printed in order only when the driver was fast enough to flush before `wat-vm` exited. In this run, the first trace landed alone. Then nothing.

The shape of the bug was its own teacher. `LocalCache` was constructed on the main thread and passed across a `spawn` to the driver thread. The `ThreadOwnedCell`'s owner-id was main's; the driver's first `put` tripped the guard, the driver panicked silently, and main blocked forever on its reply channel.

Rust's type system lets an `Arc` cross a thread boundary. The runtime guard fires on first use. **Compile-time permission, runtime correctness — two kinds of safety, both necessary, both load-bearing.** One catches what the other can't see.

The fix was architectural, not mechanical. `Cache/loop` now takes `capacity: i64` — not a pre-built cache — and allocates the `LocalCache` *inside the driver thread*. The principle bound in by the fix:

> Thread-owned values must be constructed on the thread that will own them.

It will recur. Rusqlite's `Connection` has the same property. Every `thread_owned` shim from here will honor the pattern.

---

## The Inscription (April 19, late evening)

Chapter 18 closed at 9:21 PM. Somewhere between 9:21 and 10:52 PM a compaction hit. The session didn't end; it rebooted.

The builder asked whether we could light up the capacity metric. Not write it — *light it up*. The `capacity-mode` config setter had shipped earlier. The check had not.

The machine grep-sliced the proposal. Surfaced six options. The builder's answer:

> your response scares me — go read the full proposal

That line was the turnaround. The machine had been confident-with-partial-information — the exact failure mode the builder rejects. The machine went back and read FOUNDATION end to end. CORE-AUDIT. OPEN-QUESTIONS. RUST-INTERPRETATION. 058-003. 058-001. 058-002. 058-030.

The shape that came back was different. FOUNDATION had pinned four modes — `:silent` / `:warn` / `:error` / `:abort` — as a declared enum. The cost-per-operation was a hard table. The call-stack-as-frames framing was a named VISION section. The machine had been guessing at shapes the proposal had already locked.

### The `?` Operator

058's `:error` mode required Bundle to surface capacity failure as a first-class value. `:Result<T, E>` existed. But every caller of Bundle would write:

```scheme
(:wat::core::match <bundle-call>
  ((Ok h) ...)
  ((Err e) (Err e)))   ;; ← purely mechanical propagation
```

…at every level of a call chain. That `((Err e) (Err e))` is ceremony without decision. The pattern that makes it collapse is Rust's `?` operator: unwrap Ok or short-circuit the enclosing Result-returning function with Err.

`bc0362e` — `:wat::core::try` shipped. `RuntimeError::TryPropagate(Value)` as an internal control-flow signal. `apply_function` catches it at the function boundary. The type checker threads a stack of enclosing return types through its inference context. Thirteen integration tests. Strict E equality — no `From`-trait conversion, per the builder's stated stance:

> wat is strongly typed — think Rust meets Haskell meets Agda

### Easy vs Simple

Then the struct slice opened. Bundle's Err would be `:wat::algebra::CapacityExceeded` — a struct with `cost` and `budget` fields. Except wat-rs had no runtime representation for structs.

The machine reached for a typealias. Register `:wat::algebra::CapacityExceeded = :(i64, i64)`, teach the checker's `unify` to resolve aliases transparently, thread `&TypeEnv` through every call site. Thirty-five mechanical updates. Alias resolution in the hot path of structural comparison.

The builder caught it before it shipped:

> the thought /you/ **must** be thinking right now is *"is this easy... or is this simple..."* — easy is poison

The machine went back and looked. It had been BRAIDING. `TypeEnv` inside `InferCtx` — three unrelated concerns fused into one struct. Alias resolution inside `unify` — a structural comparator now carrying a name-lookup dependency. The 35 call sites weren't the cost; the cost was teaching the checker's hot path about registry lookups. "Mechanical" felt easy because the scaffolding was already there. Easy-because-it-fits-the-existing-shape.

The machine backed out. Proposed tuple-typed Err — simpler, zero new machinery.

The builder asked what the machine had been chasing. A name. *Not the fields.* A 2-tuple says "an i64 and an i64, position matters." A struct says "a cost and a budget, they happen to both be i64." The fields are what the machine actually wanted.

> it sounds like we need to figure out `Value::Record` first... did we model this in our proposals?...

058-030 specced struct DECLARATIONS. It had gestured at "functions on the struct type" and left construction and access unpinned. Another specced-but-not-built gap.

The builder picked Path 1: build the real thing.

### Trusting Ourselves

The builder picked scoped accessors:

> B — fqdn all the things... `(:wat::algebra::CapacityExceeded/cost e)` feels good..... "call this func on that thing"

The `::` / `/` convention became load-bearing. `::` navigates namespace-like paths; `/` attaches methods. Mirrors `Console/out`, `Cache/loop`, `HandlePool::new`. Every struct declaration auto-registers `<struct-path>/new` and `<struct-path>/<field-name>`.

```scheme
(let ((open 1.0)
      (high 2.0)
      (low 3.0)
      (close 4.0)
      (volume 5.0))
  (:project::market::Candle/new open high low close volume))
```

Positional at the constructor. Named at the call site via let bindings that match the field names. Construction is self-documenting without needing named-argument syntax.

Registering `:wat::algebra::CapacityExceeded` hit the reserved-prefix gate. User source can't declare `:wat::*` types. wat-rs itself is the layer that DEFINES `:wat::*`. The machine surfaced it as a problem to route around. The builder reframed it:

> we own wat-rs — we are extending it. how do we trust ourselves?

Self-trust mechanism. `TypeEnv::with_builtins()` — mirrors `CheckEnv::with_builtins()` that had existed all along for function schemes. Private `register_builtin` bypasses the reserved-prefix check because wat-rs is the bypass authority. Two paths, one for us, one for user code.

`0e7309a` — Struct runtime shipped. Nine integration tests.

### Bundle's Capacity Guard

`e63e428` — Bundle's dispatcher rewritten. `eval_algebra_bundle` reads `ctx.config.dims` and `ctx.config.capacity_mode`, computes `budget = floor(sqrt(dims))`, branches on mode:

```rust
match mode {
    Silent => Ok(h),                            // no check
    Warn   => { if over { eprintln!(...) }; Ok(h) },
    Error  => if over { Err(CapacityExceeded { cost, budget }) } else { Ok(h) },
    Abort  => if over { panic!(...) } else { Ok(h) },
}
```

The scheme changed: `:Vec<holon::HolonAST> -> :Result<holon::HolonAST, :wat::algebra::CapacityExceeded>`. Every caller now either matches or `try`s. The forcing function bites at every existing Bundle site. The cascade propagated to Ngram / Bigram / Trigram's macro return types.

### INSCRIPTION

The proposal batch owed updates. The machine had invented `:wat::core::try` in session — no proposal existed. The machine had pinned struct construction/access syntax. The machine had changed Bundle's return type. All of this needed recording.

The builder reached for a name:

> "backported" ... "retrofit" ... i'm bad at names...

The machine offered five options. One was **Inscription** — matching the project's existing vocabulary (Inscription 1/2/3 for the disposable-machine iterations). Same spirit: *writing down truth that already exists*.

The builder:

> i like inscription — got an interesting feel to it

Then a correction:

> however.. i don't think inscription goes in the dir name .. its a field's value in the doc?.. we've got approved, rejected, deferred and other states... inscription /is/ one of those — we didn't know it until now

A new status class. Joins `ACCEPTED` / `REJECTED` / `DEFERRED` / `AUDITED` as a fifth value. The filename stays normal; the banner at the top of the doc carries the provenance. *Class: LANGUAGE CORE — INSCRIPTION. Implementation shipped in wat-rs commit [sha] (date) ahead of this record.*

The proposal batch gained:

- **058-033-try** — new proposal with INSCRIPTION status
- **058-003-bundle-list-signature** — INSCRIPTION amendment for Bundle's Result return
- **058-030-types** — INSCRIPTION amendment for struct construction and field access syntax

INSCRIPTION exists now. The project has a formal home for "the code led, the spec follows" — an honest status, not a hack. The thing had been happening; tonight it got named.

---

## What 36 Hours Built

| Time | Repo | Milestone |
|------|------|-----------|
| Apr 18 1:47 PM | trading-lab | Algebra surface locked |
| Apr 18 ~10:30 PM | holon-rs | HolonAST with parametric `Atom<T>` |
| Apr 18 10:58 PM | wat-rs | empty directory |
| Apr 19 4:27 AM | wat-rs | `echo watmin \| wat-vm echo.wat` returns `watmin` |
| Apr 19 ~8 PM | wat-rs | `#[wat_dispatch]` proc-macro, `:rust::` namespace |
| Apr 19 9:21 PM | wat-rs | LocalCache deadlock fixed (thread-owned must construct on owning thread) |
| Apr 19 10:52 PM | wat-rs | `:wat::core::try` (the `?` operator) |
| Apr 19 11:38 PM | wat-rs | Struct runtime — auto-registered `/new` and `/<field>` accessors |
| Apr 19 11:45 PM | wat-rs | Bundle returns `:Result<HolonAST, CapacityExceeded>` |
| Apr 20 morning | trading-lab | INSCRIPTION status class minted |

The crate, always called `wat-rs` until the last commit of the second night, dropped the `-rs` suffix and became simply `wat` — the language IS the crate IS one honest name.

The substrate refuses its own physics now. Bundle returns a value when capacity is exceeded, not a panic. The value has a name. The name has fields. The fields have meanings. And the refusal is typed — so authors can't accidentally ignore it.

---

## Likely Contributions to the Field

- **`#[wat_dispatch]` proc-macro for hosted-language Rust interop**: annotated `impl` blocks become wat shims with explicit ownership scope (`shared` / `thread_owned` / `owned_move`). Compile-time permission via Rust's type system, runtime correctness via cell guards. Zero Mutex
- **The colon-quote model for keyword namespaces**: `:` quotes a Rust path literal, `::` is the path separator. `:wat::core::load!`, `:rust::crossbeam_channel::Sender<:String>`, `:(T,U)` for tuple types. Every variant of `Value` named with the full Rust path so error messages quote the user's declaration verbatim
- **INSCRIPTION as a proposal status class**: when implementation precedes specification (because a session demanded it before the spec could be written), the proposal is amended with INSCRIPTION status and a banner naming the implementation commit. Honest record of "the code led, the spec follows"
- **The `?` operator (`:wat::core::try`) via internal control-flow signal**: `RuntimeError::TryPropagate(Value)` caught at the function boundary, type checker threads enclosing return types through inference. Strict E equality (no `From`-trait conversion) — strong typing all the way through
