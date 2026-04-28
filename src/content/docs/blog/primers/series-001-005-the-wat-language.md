---
title: "The Wat Language"
description: "A Lisp-family language for holon algebra, hosted on Rust. Same pattern as Clojure on the JVM. Fully typed, parenthesized, no braces. Six AST primitives, four measurements plus one diagnostic, three stories, three structural forms, kernel concurrency, Rust interop via #[wat_dispatch]. Defined by wat-rs."
date: 2026-04-27
---

`wat` is a Lisp-family language for holon algebra, hosted on Rust. Same pattern as Clojure on the JVM: wat is a full language with its own parser, type checker, macro expander, and runtime, and it borrows Rust's type system, safety, and ecosystem underneath. Rust crates surface into wat source under the `:rust::` namespace; wat programs call them like native forms.

The language is defined by [wat-rs](https://github.com/watmin/wat-rs) — the implementation is the spec. It's basically Scheme with the additions algebraic cognition needs: full static typing (rank-1 Hindley-Milner), six holon primitives baked into the substrate, a kernel of concurrency primitives, and a `:rust::` namespace that surfaces any annotated Rust crate as native wat forms. No braces. Just parentheses.

---

## The Mental Model

Every wat program lives in a coordinate with two axes.

### Axis 1 — Four layers

1. **Holon algebra** (`:wat::holon::*`) — six AST-producing primitives (`Atom`, `Bind`, `Bundle`, `Blend`, `Permute`, `Thermometer`), four measurements (`cosine`, `dot`, `presence?`, `coincident?`) plus one diagnostic (`coincident-explain`), the `HolonAST` and `Vector` types. The substrate of hyperdimensional computing.
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
(:wat::holon::Atom "rsi")              ; primitive → typed leaf (String)
(:wat::holon::Atom 42)                 ; primitive → typed leaf (I64)
                                       ; — also f64 / bool / keyword
(:wat::holon::Atom (:wat::core::quote (...)))
                                       ; quoted form → structural lowering:
                                       ; List → Bundle, Keyword → Symbol,
                                       ; literals → matching primitive leaves.
                                       ; The form's identity is now on the algebra grid.
(:wat::holon::Atom my-holon)           ; HolonAST → opaque-identity wrap;
                                       ; one hash over canonical bytes, no decomposition.

(:wat::holon::Bind role filler)        ; elementwise multiply — role-filler binding
(:wat::holon::Bundle holons-vec)       ; sum + threshold — superposition
                                       ;   returns :BundleResult (= Result<HolonAST, CapacityExceeded>)
(:wat::holon::Permute holon k)         ; circular shift — positional encoding
(:wat::holon::Thermometer v min max)   ; gradient encoding of a scalar
(:wat::holon::Blend a b w1 w2)         ; scalar-weighted binary combination
```

These six produce `HolonAST` — the algebra's expression tree. Per arc 057 (April 25) **the algebra is closed under itself**: every leaf variant (`Symbol`, `String`, `I64`, `F64`, `Bool`) IS a HolonAST; `Atom` narrows to `Arc<HolonAST>` (opaque-identity wrap of an inner holon). HolonAST has structural `Hash + Eq`, which is what unblocks `LocalCache<HolonAST, V>` and the dual-LRU coordinate cache pattern. `Bundle` returns a `Result` because superposition has a [Kanerva capacity ceiling](/blog/primers/series-001-003-memory/) — too many components and the bundle silently corrupts. The substrate refuses to lie about it.

For new code, prefer the named siblings over polymorphic `Atom`:

```scheme
(:wat::holon::leaf 42)                 ; primitive → typed leaf (arc 065)
(:wat::holon::from-watast quoted-form) ; quoted form → HolonAST tree (arc 065)
(:wat::holon::Atom my-holon)           ; HolonAST → opaque-identity wrap
```

One verb per move. Polymorphism stays for back-compat; the named verbs read cleaner at the call site.

---

## Three Stories — Coordinate, Value, Path

Once the algebra closes under itself, a quoted form has three different relationships to its terminal value. The consumer picks per call site.

```scheme
;; Story 1 — coordinate. The form's identity on the algebra grid.
((form-atom :wat::holon::HolonAST)
  (:wat::holon::Atom (:wat::core::quote (:wat::core::i64::+ 40 2))))
;; cosine, Bind, presence, structural cache keys all see the form's shape.
;; The substrate holds coordinates, not values — to get the answer, walk the form.

;; Story 2 — value. Lift back, run, get the terminal.
((reveal :wat::WatAST) (:wat::holon::to-watast form-atom))
(:wat::eval-ast! reveal)               ; → :Result<HolonAST, EvalError>

;; Story 3 — path. One reduction at a time. Every intermediate is a coordinate.
(:wat::eval-step! some-form)           ; → :Result<StepResult, EvalError>
;; StepResult variants: StepNext { form }, StepTerminal { value }, AlreadyTerminal { value }.
```

Story 3 is the substrate primitive backing BOOK chapter 65's dual-LRU coordinate cache (`form → next-form`, `form → terminal-value`). Most consumers don't write the walker by hand — reach for `:wat::eval::walk` (arc 070):

```scheme
(:wat::eval::walk form init visit)
;; visit : (acc, current-form, step-result) -> WalkStep<A>
;;   Continue(acc')       — keep walking
;;   Skip(terminal, acc') — caller has the answer (cache hit); short-circuit
```

Walker visits every coordinate exactly once. Caller's accumulator threads through the chain. A cache visitor records `(form → next)` on `StepNext` and `(form → terminal)` on either terminal flavor; on a cache hit it returns `Skip` with the cached terminal and the walker stops.

The three stories compose: cache-check on Story 1 ("have I seen this form before?") and on miss fall through to Story 2 (compute and store) or Story 3 (record every intermediate so a parallel walker can shortcut).

---

## The Four Measurements (Plus One Diagnostic)

```scheme
(:wat::holon::cosine a b)             ; → :f64   cosine similarity
(:wat::holon::dot a b)                ; → :f64   dot product, un-normalized
(:wat::holon::presence? target ref)   ; → :bool  cosine > sigma × noise-floor
(:wat::holon::coincident? a b)        ; → :bool  (1 - cosine) < coincident-floor
```

`presence?` asks "is there signal of A in B?" — cosine clears the presence threshold. `coincident?` asks "are A and B the same point?" — cosine is so close to 1.0 that the substrate cannot distinguish them. Dual predicates of one statistical fact. All four are polymorphic over HolonAST and Vector inputs in either position (arc 061).

When a `coincident?` answer disagrees with expectation, reach for `coincident-explain` — the diagnostic sibling (arc 069). It returns a `CoincidentExplanation` record with six fields:

```scheme
(:wat::holon::coincident-explain a b)
  ; → :wat::holon::CoincidentExplanation
  ;     cosine             :f64    raw cosine of the two encoded vectors
  ;     floor              :f64    current coincident floor (sigma/sqrt(d))
  ;     dim                :i64    dim where the comparison ran
  ;     sigma              :i64    sigma feeding the floor
  ;     coincident         :bool   same answer coincident? would give
  ;     min-sigma-to-pass  :i64    smallest sigma at which the pair would coincide
```

When two thoughts that "should" coincide don't, the struct disambiguates the three failure modes. **Mental model wrong** — `cosine` reads ≪ 0.99 (the encoding shape isn't what you thought). **Calibration boundary** — `cosine` reads in `(1 - 2·floor, 1 - floor)` and `min-sigma-to-pass` is 2 or 3 (bumping `set-coincident-sigma!` unblocks). **Structurally distant** — `cosine` near 0 and `min-sigma-to-pass` large (the forms aren't on the same neighborhood; no sigma fix will help — fix the encoding).

The `eval-coincident?` family extends `coincident?` to evaluated programs — verify each side's source under integrity, evaluate, atomize, compare. The signed variant (`eval-signed-coincident?`) takes per-side source + signature + public key, verifies signatures, refuses mutation forms, evaluates each in a fresh sandbox, atomizes the result, and binarizes against the coincident floor. One library call covers consensus-via-coincidence, integrity-gated composition, and program-comparison under signature.

---

## Materialized Vectors and Bytes

The algebra forms produce `HolonAST` — symbolic. Sometimes you want the actual encoded bipolar vector (to cache it, transmit it, send it across machines). That's `Vector`.

```scheme
;; Materialize a HolonAST into the substrate's encoded vector.
(:wat::holon::encode some-holon)              ; → :wat::holon::Vector

;; Vector is first-class. Use it as a struct field, parameter, return type.
(:wat::core::struct :my::Snapshot
  ((label :Symbol) (encoded :wat::holon::Vector)))

;; Cosine, dot, coincident?, simhash all polymorphic over HolonAST and Vector.
(:wat::holon::cosine some-holon some-vector)  ; mixed: AST encoded at Vector's d
(:wat::holon::simhash some-holon)             ; → :i64
```

For wire format — sending a vector across a process boundary, a network, a document store:

```scheme
(:wat::holon::vector-bytes vec)               ; → :wat::core::Bytes
                                              ;   4-byte dim header + 2-bit ternary packing
(:wat::holon::bytes-vector bytes)             ; → :Option<wat::holon::Vector>

;; Bytes ↔ hex string for text channels (arcs 062 + 063):
(:wat::core::Bytes::to-hex bytes)             ; → :String
(:wat::core::Bytes::from-hex hex-string)      ; → :Option<wat::core::Bytes>
```

`:wat::core::Bytes` is the typealias for `Vec<u8>` — the substrate's general byte buffer. Same shape used by `vector-bytes` and the future crypto/IO/network primitives. The hex pair makes vectors transmissible over any text channel — file, pipe, stdout, environment variable.

This is what makes the substrate networkable. A vector is a fingerprint of computation; with the seed, the form, and the vector, any party in the same universe can verify. Without the seed, the bytes are noise.

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

User enums are first-class (arc 048). Construct with `:Direction::Buy` (unit variant) or `(:Event::Candle asset candle)` (tagged variant). Pattern match with the same syntax in arms; the type checker enforces exhaustiveness at startup.

Two principled splits the substrate honors. **Vec accessors return Option** (arc 047): `first`, `second`, `third`, `last`, `find-last-index`, `f64::max-of`/`min-of` all return `Option<T>` for Vec args — emptiness is a runtime fact, the type signals it honestly. **Tuple positional accessors stay T** — tuple arity is type-known at compile time, so out-of-range is impossible. One principled split: emptiness-is-runtime → Option; arity-is-type-time → T. Same shape that makes Rust's `vec.first()` an `Option<&T>` while tuple `.0` stays `T`.

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
                                                   ;       (panics caller on spawn-thread death)
(:wat::kernel::join-result handle)                 ; → :Result<T, ThreadDiedError>  death-as-data
                                                   ;   (arc 060) — three variants discriminate
                                                   ;   Panic / RuntimeError / ChannelDisconnected

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

Two milestones from late April that load-bear the rest of the surface. **Arc 057 (April 25) — the algebra closes under itself.** Five typed primitive leaves (`Symbol`, `String`, `I64`, `F64`, `Bool`) become HolonAST variants directly; `Atom` narrows to `Arc<HolonAST>`. The `dyn Any` escape hatch retires. `HashMap<HolonAST, V>` compiles. The dual-LRU coordinate cache becomes expressible. **Arc 068 (April 27) — `eval-step!` ships.** The substrate gains step semantics: one reduction at a time, every intermediate form a coordinate, every coordinate a potential cache key. Together they make BOOK chapter 65's hologram — the surface form has a depth inside it, and that depth is publicly addressable structure on the algebra grid.

---

## What This Replaces

Wat replaces three layers of conventional infrastructure:

- **A configuration language** (YAML, TOML, JSON) — wat is typed, composable, evaluated under integrity. Configuration IS a program.
- **An orchestration layer** (Airflow, Temporal, Step Functions) — `spawn`/`send`/`recv`/`select` covers any pipeline shape with three-tier ownership and rendezvous backpressure.
- **A glue language** (Bash, Python scripts) — `:rust::` brings any Rust crate inline. The shim is one annotation. The dispatch is direct.

What remains in Rust: the substrate (parser, type checker, runtime, kernel primitives, holon algebra implementation). What lives in wat: the application logic, the algebra over named concepts, the orchestration of concurrent work. The boundary is the `#[wat_dispatch]` annotation. Either side can grow without disturbing the other.
