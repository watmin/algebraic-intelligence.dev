---
title: "The Wat Language"
description: "An s-expression specification language shaped for algebraic cognition. Two algebras (vector + reckoner), three structural forms (struct, enum, protocol), and a host language that compiles to Rust. 652 lines across 8 files define the entire system."
date: 2026-04-07
---

Wat is a specification language. It describes programs in s-expression form — what a module reads, what it emits, what it does not read. The wat leads. The Rust follows. Automated wards (`/scry`, `/gaze`, `/forge`) verify that the two agree.

The language originated as a year-old relic — Grok conversation links and a proof-of-concept continuation function on GitHub from March 2025. It was revived in March 2026 as the specification layer for the [trading enterprise](/blog/story/series-006-004-the-datamancer/), and has since grown into a complete language with two algebras, three structural forms, a standard library, and a documented compilation path to Rust.

8 files. 652 lines. Everything the system needs to specify itself.

---

## Two Algebras

### Algebra 1: Vector Algebra (4 Generators)

The same four operations that underpin the entire Holon project — from [DDoS detection](/blog/story/series-003-003-1-3m-pps/) to the [spectral firewall](/blog/story/series-005-001-the-spectral-firewall/) to the [trading enterprise](/blog/story/series-006-003-the-enterprise/):

```clojure
(atom name)                    → Vector      ; deterministic bipolar vector from hash
(bind role filler)             → Vector      ; compose two concepts (self-inverse)
(bundle fact1 fact2 ...)       → Vector      ; superimpose relationships
(cosine thought direction)     → Float       ; similarity measurement [-1.0, +1.0]
```

These are defined in `core/primitives.wat`. Everything in the [algebra ops primer](/blog/primers/series-001-002-holon-ops/) — `negate`, `amplify`, `difference`, `prototype`, `attend`, `coherence` — derives from these four in `std/vectors.wat`.

### Algebra 2: Reckoner Coalgebra (Learning & Prediction)

The [Reckoner](/blog/primers/series-001-003-memory/#reckoner--unified-discriminant-learner) — the memory-layer primitive that learns to separate classes or predict continuous values from a stream of labeled observations:

```clojure
(reckoner name dims refit-interval)     → Reckoner
(register reckoner name)                → Label     ; symbol handle, idempotent
(observe reckoner thought label weight) → ()        ; accumulate evidence
(predict reckoner thought)              → Prediction
(decay reckoner rate)                   → ()        ; fade older observations
(resolve reckoner conviction correct)   → ()        ; record outcome for curve
(curve reckoner)                        → (a, b)    ; accuracy = 1/N + a × exp(b × conviction)
(discriminant reckoner label)           → Vector|None
(recalib-count reckoner)                → Integer
```

Five core operations (`observe`, `predict`, `decay`, `resolve`, `curve`), four accessors. The accumulators are private — the coalgebra is defined by its interface, not its representation.

---

## Three Structural Forms

### Products (Structs)

```clojure
(struct enterprise-state
  observers            ; Vec<Observer>
  generalist           ; Observer
  manager              ; Reckoner
  risk-branches        ; Vec<RiskBranch>
  treasury             ; Treasury
  portfolio            ; Portfolio
  pending              ; VecDeque<Pending>
  positions            ; Vec<ManagedPosition>
  latest-candle?)      ; Option<Candle> — the ? suffix marks optional fields
```

Field access: `(:treasury state)`. Functional update: `(update state :treasury new-treasury :portfolio new-portfolio)` — parallel semantics, all fields updated simultaneously.

### Coproducts (Enums)

```clojure
(enum direction :long :short)          ; simple keyword variants

(enum event                            ; tagged variants carry data
  (candle asset candle)
  (deposit asset amount)
  (withdraw asset amount))

(match event                           ; exhaustive dispatch
  (candle a c)   (handle-candle a c)
  (deposit a n)  (handle-deposit a n)
  (withdraw a n) (handle-withdraw a n))
```

Match must be exhaustive — missing an arm is a spec violation. The forge ward checks this. The Rust compiler enforces it.

### Protocols (Type Classes)

```clojure
(defprotocol indicator
  "A scalar stream processor. State in, state out."
  (step [state input] "Advance by one input. Returns (state, output)."))

(struct sma-state buffer period)

(satisfies sma-state indicator
  :step sma-step)
```

Check-only, not dispatch. The forge verifies that `sma-step` exists with the right arity. Call `sma-step` directly by name — no dynamic dispatch, no vtables. Explicit, exhaustive: every protocol function must be mapped.

---

## Host Language

Standard Lisp forms for the program logic between algebraic operations:

**Arithmetic**: `+`, `-`, `*`, `/`, `abs`, `sqrt`, `mod`, `max`, `min`, `round`, `clamp`, `exp`, `ln`, `signum`

**Collections**: `list`, `len`, `nth`, `first`, `rest`, `last`, `append`, `map`, `filter`, `fold`, `sort-by`, `range`, `empty?`, `member?`, `some?`, `quantile`, `zeros`

**Maps**: `map-of` (flat key-value constructor), `get`, `assoc`, `keys`, `dissoc`

**Control**: `let`, `let*`, `define`, `if`, `when`, `when-let`, `cond`, `match`, `lambda`, `begin`

**Parallel**: `pmap`, `pfor-each` — semantically identical to `map`/`for-each`, signal that parallel execution is safe

**Mutation**: `set!`, `push!`, `pop!`, `inc!` — honest about mutation, map to `&mut self` in Rust

**Optionals**: `(Some value)`, `None` — Rust `Option<T>`. No `nil` value exists. Absence is structural: `field?` suffix on struct fields, `when` for conditional execution.

**Quote**: `'(...)` — s-expressions as data. The expression IS the tree.

**Type annotations** (optional): `[param : Type]` for parameters, `: ReturnType` for returns. Never enforced — purely metadata for tooling.

---

## Standard Library

```
std/scalars.wat      15 lines — encode-log, encode-linear, encode-circular
std/vectors.wat      44 lines — permute, difference, negate, amplify, prototype,
                                cleanup, attend, coherence, blend, l2-norm, zeros
std/memory.wat       28 lines — online-subspace (CCIPCA), update, residual, threshold
std/statistics.wat   41 lines — mean, variance, stddev, moments, skewness
```

128 lines of standard library. Everything derives from the core primitives or provides pre-algebra numeric helpers.

---

## Compilation to Rust

The wat-to-Rust mapping is documented in `docs/COMPILATION.md`:

| Wat | Rust |
|-----|------|
| All numbers | `f64` |
| `true` / `false` | `bool` |
| `struct` | `pub struct { pub field: T }` |
| `enum` | `enum` (exhaustive match) |
| `:field record` | `record.field` |
| `(update record :f1 v1)` | `Struct { f1: v1, ..record }` |
| `defprotocol` | `trait` |
| `satisfies` | `impl Trait for Struct` |
| `field?` suffix | `Option<T>`, initialized `None` |
| `set!`, `push!`, `inc!` | `&mut self` methods |
| `pmap` | `par_iter().map()` (rayon) |
| `(when cond body)` | `Option<T>` return via control flow |

---

## The Wards

Five automated skills verify that wat specifications and Rust implementations agree:

- **`/sever`** — dead imports, unreachable branches, vestigial modules
- **`/reap`** — computed values never read, struct fields never accessed
- **`/scry`** — wat specifications vs Rust implementations. When they disagree, the wat wins.
- **`/gaze`** — naming beauty, count accuracy. Three severities: lies (always report), mumbles (report), taste (do not chase)
- **`/forge`** — is the wat a valid program in the language? Checks: forms exist in the grammar, enum match is exhaustive, protocol satisfaction is complete

**Runes** suppress findings that can't be fixed — only acknowledged: `rune:gaze(complexity) — fold threading requires let* with discarded bindings`. The rune tells the ward: the datamancer has been here. This is conscious.

---

## The Enterprise Example

`examples/enterprise.wat` (315 lines) is the reference program — a complete trading enterprise specified in wat. It demonstrates struct definition, encoding layers, expert nodes, gate systems, position management, and exit logic. The corresponding Rust implementation in `holon-lab-trading/src/bin/enterprise.rs` follows the wat specification, verified by `/scry`.

The enterprise's `wat/` directory mirrors its `src/` directory — 37 specification files across 4,804 lines. Every Rust source file with business logic has a corresponding wat. The wat is the source of truth.

---

## Design Principles

**No `nil`.** Absence is structural — optional fields use `?` suffix, conditional execution uses `when`. There is no null value to accidentally propagate.

**Protocols are check-only.** `defprotocol` + `satisfies` declares that a struct implements a behavior. The forge verifies existence and arity. Call functions by name — no dynamic dispatch overhead.

**Quote is data.** `'(bind role filler)` is an s-expression tree, not an execution. This enables thought vectors to be specified as data structures that the encoder evaluates — the vocabulary IS a quoted program.

**The stdlib enables. The application decides.** The standard library provides operations (scalars, vectors, memory, statistics). No vocabulary. No encoding conventions. No application patterns. The boundary is the [Fact interface](/blog/story/series-006-004-the-datamancer/#the-fact-interface): the language knows how to bind and bundle. The application knows what "RSI divergence" means.
