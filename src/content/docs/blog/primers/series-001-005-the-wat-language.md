---
title: "The Wat Language"
description: "A Lisp-family language for holon algebra, hosted on Rust. Same pattern as Clojure on the JVM. Fully typed, parenthesized, no braces. Six AST primitives, four measurements, three structural forms, kernel concurrency, Rust interop via #[wat_dispatch]. Defined by wat-rs."
date: 2026-04-24
---

`wat` is a Lisp-family language for holon algebra, hosted on Rust. Same pattern as Clojure on the JVM: wat is a full language with its own parser, type checker, macro expander, and runtime, and it borrows Rust's type system, safety, and ecosystem underneath. Rust crates surface into wat source under the `:rust::` namespace; wat programs call them like native forms.

The language is defined by [wat-rs](https://github.com/watmin/wat-rs) — the implementation is the spec. It's basically Scheme with the additions algebraic cognition needs: full static typing (rank-1 Hindley-Milner), six holon primitives baked into the substrate, a kernel of concurrency primitives, and a `:rust::` namespace that surfaces any annotated Rust crate as native wat forms. No braces. Just parentheses.

---

## The Mental Model

Every wat program lives in a coordinate with two axes.

### Axis 1 — Four layers

1. **Holon algebra** (`:wat::holon::*`) — six AST-producing primitives (`Atom`, `Bind`, `Bundle`, `Blend`, `Permute`, `Thermometer`), four measurements (`cosine`, `dot`, `presence?`, `coincident?`), the `HolonAST` type. The substrate of hyperdimensional computing.
2. **Language core** (`:wat::core::*`) — the language's own mechanics: `define`, `lambda`, `let*`, `match`, `if`, `cond`, `try`, `struct`, `enum`, `newtype`, `typealias`, `defmacro`. Cannot be written in wat itself.
3. **Kernel** (`:wat::kernel::*`) — concurrency and I/O: `spawn`, `make-bounded-queue`, `send`, `recv`, `select`, `HandlePool`, plus `:wat::io::IOReader`. The things that move bytes between processes.
4. **Stdlib** (`:wat::std::*`) — non-algebra conveniences written in wat: stream combinators, `Console` service, hermetic-test wrapper.

### Axis 2 — Two namespaces

- **`:wat::*`** — forms and types defined by the language itself
- **`:rust::*`** — types surfaced from Rust crates via `#[wat_dispatch]`. Every Rust type's path is its actual Rust path: `:rust::crossbeam_channel::Sender<T>`, `:rust::lru::LruCache<K,V>`. No short aliases.

User code lives under its own prefix (`:my::`, `:project::`, `:alice::`). `:wat::*` and `:rust::*` are reserved.

A program declares which Rust types it uses via `(:wat::core::use! :rust::some::Type)` — per-program opt-in.

---

## The Six Algebra Primitives

```scheme
(:wat::holon::Atom "rsi")              ; seed a vector from a literal
(:wat::holon::Atom 42)                 ; typed — int, float, bool, string, keyword
(:wat::holon::Atom my-ast)             ; or any registered composite type

(:wat::holon::Bind role filler)        ; elementwise multiply — role-filler binding
(:wat::holon::Bundle holons-vec)       ; sum + threshold — superposition
                                       ;   returns :BundleResult (= Result<HolonAST, CapacityExceeded>)
(:wat::holon::Permute holon k)         ; circular shift — positional encoding
(:wat::holon::Thermometer v min max)   ; gradient encoding of a scalar
(:wat::holon::Blend a b w1 w2)         ; scalar-weighted binary combination
```

These six produce `HolonAST` — the algebra's expression tree. `Atom` accepts any registered hashable type, including `HolonAST` itself: programs are atoms. `Bundle` returns a `Result` because superposition has a [Kanerva capacity ceiling](/blog/primers/series-001-003-memory/) — too many components and the bundle silently corrupts. The substrate refuses to lie about it.

---

## The Four Measurements

```scheme
(:wat::holon::cosine a b)             ; → :f64   cosine similarity
(:wat::holon::dot a b)                ; → :f64   dot product, un-normalized
(:wat::holon::presence? target ref)   ; → :bool  cosine > sigma × noise-floor
(:wat::holon::coincident? a b)        ; → :bool  (1 - cosine) < coincident-floor
```

`presence?` asks "is there signal of A in B?" — cosine clears the presence threshold. `coincident?` asks "are A and B the same point?" — cosine is so close to 1.0 that the substrate cannot distinguish them. Dual predicates of one statistical fact.

The `eval-coincident?` family extends `coincident?` to evaluated programs — verify each side's source under integrity, evaluate, atomize, compare. The signed variant (`eval-signed-coincident?`) takes per-side source + signature + public key, verifies signatures, refuses mutation forms, evaluates each in a fresh sandbox, atomizes the result, and binarizes against the coincident floor. One library call covers consensus-via-coincidence, integrity-gated composition, and program-comparison under signature.

---

## The Eleven wat-Written Idioms

Each lives in `wat/holon/<Name>.wat` and expands to algebra-core primitives at parse time:

```scheme
(:wat::holon::Log v min max)              ; Thermometer on (ln v)
(:wat::holon::ReciprocalLog n v)          ; Log v (1/n) n — log-symmetric ratio bounds
(:wat::holon::Circular v period)          ; Blend of cos/sin-basis atoms
(:wat::holon::Sequential list)            ; positional bind-chain
(:wat::holon::Ngram n list)               ; n-wise adjacency
(:wat::holon::Bigram list)                ; Ngram 2
(:wat::holon::Trigram list)               ; Ngram 3
(:wat::holon::Amplify x y s)              ; Blend x y 1 s — boost y in x
(:wat::holon::Subtract x y)               ; Blend x y 1 -1 — remove y from x
(:wat::holon::Reject x y)                 ; Gram-Schmidt reject step
(:wat::holon::Project x y)                ; Gram-Schmidt project step
```

The substrate ships only what it must. Everything else composes from these.

---

## Writing Functions

Every parameter is typed. Return type is declared after `->`. Body must produce the declared return type. The type checker verifies at startup; bad types fail before any code runs.

```scheme
;; named function — registered in the symbol table at startup
(:wat::core::define (:my::app::double (n :i64) -> :i64)
  (:wat::core::i64::* n 2))

;; anonymous function — produces a :fn(i64,i64)->i64 first-class value
(:wat::core::lambda ((x :i64) (y :i64) -> :i64)
  (:wat::core::i64::+ x y))

;; sequential let — every binding typed, later can reference earlier
(:wat::core::let*
  (((a :i64) 10)
   ((b :i64) 20)
   ((sum :i64) (:wat::core::i64::+ a b)))
  sum)

;; pattern match — exhaustive, checked at startup
(:wat::core::match some-option -> :i64
  ((Some v) (:wat::core::i64::* v 2))
  (:None 0))

;; error propagation — like Rust's ?
(:wat::core::try fallible-call)

;; typed boolean branch
(:wat::core::if (gt? n 0) :i64
  n
  (:wat::core::i64::* n -1))
```

User namespaces are keyword-paths: `:my::app::deeply::nested::fn`. Compose freely.

---

## The Three Structural Forms

```scheme
(:wat::core::struct :my::Position
  ((source :Asset) (target :Asset) (size :f64)))

(:wat::core::enum :my::Direction
  :Buy :Sell)

(:wat::core::enum :my::Event
  ((Candle :Asset :Candle))
  ((Deposit :Asset :f64)))

(:wat::core::newtype :my::BasisPoints :i64)

(:wat::core::typealias :Holons (:Vec :wat::holon::HolonAST))
```

`struct` is product. `enum` is sum. `newtype` is a wrapper that gets compile-time enforcement. `typealias` is a name for a type expression. No `nil`. No truthiness. Absence is structural — `:Option<T>` is the only way.

---

## Concurrency — Three Tiers, Zero Mutexes

Every piece of state lives in one of three tiers:

| Tier | Mechanism | Used for |
|---|---|---|
| 1 — Immutable | `Arc<T>`, frozen at startup | Config, symbol table, registered functions |
| 2 — Thread-owned | `ThreadOwnedCell<T>` | Per-thread hot state (LocalCache) |
| 3 — Program-owned | A spawned wat program + channels | Shared-access state (Console, Cache) |

**There is no Mutex.** Zero. If you find yourself wanting one, you have a tier question to answer.

```scheme
;; queues — single-owner, like Linux fds
(:wat::kernel::make-bounded-queue :Candle 1)     ; rendezvous (default — backpressure)
(:wat::kernel::make-bounded-queue :Candle 64)    ; buffer of 64
(:wat::kernel::make-unbounded-queue :LearnSignal) ; fire-and-forget

(:wat::kernel::send sender value)    ; → :Option<()>  Some on sent, None on disconnect
(:wat::kernel::recv receiver)        ; → :Option<T>   Some(v) on recv, None on disconnect
(:wat::kernel::try-recv receiver)    ; → :Option<T>   None if empty OR disconnected
(:wat::kernel::drop handle)          ; → :()          close a sender or receiver

;; fan-in — caller owns the loop, removes disconnected receivers
(:wat::kernel::select receivers)     ; → :(i64, Option<T>)

;; spawn — OS thread running a named function
(:wat::kernel::spawn :my::app::worker arg1 arg2)  ; → :ProgramHandle<T>
(:wat::kernel::join handle)                        ; → :T  blocks for return value

;; HandlePool — claim-or-panic distribution of N handles to N consumers
(:wat::kernel::HandlePool::new "console" senders)
(:wat::kernel::HandlePool::pop pool)        ; panics if empty
(:wat::kernel::HandlePool::finish pool)     ; panics on orphans
```

Default to `bounded(1)`. It's the rendezvous shape that gives backpressure naturally — slow consumer throttles the producer. Larger buffers trade throughput for latency. Senders and receivers are single-owner — not cloneable. Like Linux `write(fd, data)`: whoever holds the fd owns the capability.

---

## Rust Interop — Surfacing a Crate Type

```rust
// In your Rust crate, on the impl block you want to surface:
use wat_macros::wat_dispatch;

#[wat_dispatch(prefix = ":rust::lru::LruCache")]
impl<K: Hash + Eq, V: Clone> LruCache<K, V> {
    pub fn new(cap: NonZeroUsize) -> Self { ... }
    pub fn get(&mut self, k: &K) -> Option<&V> { ... }
    pub fn put(&mut self, k: K, v: V) -> Option<V> { ... }
}
```

```scheme
;; Then in wat:
(:wat::core::use! :rust::lru::LruCache)

(:wat::core::let*
  (((cache :rust::lru::LruCache<:String, :Holon>)
    (:rust::lru::LruCache::new 1024)))
  ...)
```

The proc-macro generates the shim code. The `:rust::` namespace surfaces the Rust impl as native wat forms. Three scope modes (`pub`, `pub(crate)`, hidden) control which methods cross the boundary. Method dispatch is direct — no vtables, no dynamic lookup, no runtime cost beyond a function call.

This is how wat scales without reimplementing the world: `:rust::crossbeam_channel`, `:rust::ed25519_dalek`, `:rust::serde_json` — anything in the Rust ecosystem becomes a wat form by adding `#[wat_dispatch]` to its impl block.

---

## The wat-rs Stack

```
holon   (algebra substrate — 6 primitives, encode, AtomTypeRegistry)
   ↑
wat     (wat-rs — frontend + interpret runtime + :rust:: shims)
   ↑
holon-lab-trading / holon-lab-ddos / any wat-consuming application
```

A wat application is a small Rust crate that delegates to two macros:

```rust
// build.rs — compile-time tree walker
fn main() {
    wat_macros::build_wat_tree!("src/wat");
}

// main.rs — runtime entry
fn main() {
    wat::run_entry!("src/wat/main.wat");
}
```

The runtime walks the INTERPRET path: parse → load-resolve → macro-expand → register types → register defines → resolve → type-check → freeze → invoke `:user::main`. UpperCalls (`:wat::holon::Atom`, `:wat::holon::Bind`, …) dispatch to `holon::HolonAST` and encode via `holon::encode`.

A source-to-source COMPILE path was sketched in the 058 batch's `WAT-TO-RUST.md` but retired April 21 — Rust-interop turned out to be covered by `#[wat_dispatch]` and the `:rust::` namespace, and native binary emission has no current caller.

---

## Testing — wat tests wat

```scheme
(:wat::test::deftest "double works"
  (:wat::test::assert-eq (:my::app::double 21) 42))
```

```rust
// tests/test.rs
wat::test! {
    discovery_root: "src/wat",
}
```

`cargo test` runs every `deftest` in the wat tree through the standard Rust test harness. Failures are reported with wat-side source locations (file:line:column). Hermetic mode spawns isolated runtimes for tests that exercise services or threads.

---

## Error Handling

```scheme
;; absence
(:Option<:i64>)
(Some 42)
:None

;; fallible computation
(:Result<:T, :E>)
(Ok value)
(Err err)

;; the canonical algebra Result — Bundle's capacity check
:wat::holon::BundleResult  ; = :Result<:HolonAST, :CapacityExceeded>
```

There is no panic-by-default. There is no `nil` to silently propagate. `try` propagates `Result` errors like Rust's `?`. `match` on `:Option` and `:Result` is exhaustive — startup fails if you miss an arm.

---

## The 058 Algebra-Surface Batch

The wat language as it exists today is the realization of the 058 proposal batch in [holon-lab-trading/docs/proposals/2026/04/058-ast-algebra-surface/](https://github.com/watmin/holon-lab-trading). Forty-plus design proposals reviewed by simulated Hickey and Beckman, resolved into a coherent language surface, then implemented in wat-rs across six weeks of work-arcs. The batch covers the algebra primitives, the type system, the namespace structure, the concurrency tiers, the testing model, and the Rust interop. The proposals stay on disk as the design record — anyone reading wat-rs can trace any decision back to the question that produced it.

---

## What This Replaces

Wat replaces three layers of conventional infrastructure:

- **A configuration language** (YAML, TOML, JSON) — wat is typed, composable, evaluated under integrity. Configuration IS a program.
- **An orchestration layer** (Airflow, Temporal, Step Functions) — `spawn`/`send`/`recv`/`select` covers any pipeline shape with three-tier ownership and rendezvous backpressure.
- **A glue language** (Bash, Python scripts) — `:rust::` brings any Rust crate inline. The shim is one annotation. The dispatch is direct.

What remains in Rust: the substrate (parser, type checker, runtime, kernel primitives, holon algebra implementation). What lives in wat: the application logic, the algebra over named concepts, the orchestration of concurrent work. The boundary is the `#[wat_dispatch]` annotation. Either side can grow without disturbing the other.
