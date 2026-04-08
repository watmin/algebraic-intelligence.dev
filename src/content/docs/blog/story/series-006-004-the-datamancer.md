---
title: "The Datamancer"
description: "Mar 29: 102 commits. The Journal promoted to holon-rs — N-ary labels, curve self-evaluation. The thought encoder monolith split into 13 vocabulary modules via the Fact interface. 405 lines of dead code removed. trader3 → enterprise. The enterprise builds its own senses from raw parquet. The wards are born. The wat repo revived from a year-old relic."
sidebar:
  order: 18
---

March 29 was supposed to be about improving trading accuracy. It wasn't.

The day started with a spec contradiction. The risk module subscribed to channels it shouldn't see. That led to the channel architecture. The channel architecture led to the designers — two simulated critics, one asking "is it simple?" (Hickey) and one asking "does it compose?" (Beckman). The designers rejected async and produced the fold. The fold needed a home in the language. The language needed layers. The layers needed the journal tension resolved. The journal needed to be promoted to the core library. The core library needed Label symbols. The trading lab became a consumer.

Each side quest felt like a detour. Each produced something load-bearing. 102 commits by the end of the day.

---

## Journal Promoted to holon-rs

`99f729c feat: Journal coalgebra with Label symbols — promoted to holon-rs`
`dada729 feat: journal curve + configurable params + N-ary base`

The `Journal` struct had lived in the trading lab since March 21 — the [238-line binary version](/blog/story/series-006-001-the-thought-machine/#the-journal) with hardcoded Buy/Sell accumulators. Two accumulators, a discriminant, a cosine. Nothing about it was specific to trading or to two classes.

On March 29, it was generalized and promoted to `holon-rs/src/memory/journal.rs` — 596 lines:

```rust
pub struct Journal {
    name:            String,
    label_names:     Vec<String>,
    accumulators:    Vec<Accumulator>,    // one per registered label
    dims:            usize,
    updates:         usize,
    recalib_interval: usize,
    discriminants:   Vec<Option<Vec<f64>>>, // one direction per label
    mean_proto:      Option<Vec<f64>>,
    // Curve self-evaluation
    resolved:        Vec<(f64, bool)>,    // (conviction, correct?)
    curve_a:         f64,
    curve_b:         f64,
    curve_valid:     bool,
}
```

**`Label(u32)` symbols** replaced the hardcoded `Outcome::Buy`/`Outcome::Sell` enum. Cheap, Copy integer handles created by `journal.register("Buy")`. Binary, ternary, N-ary — the Journal doesn't know or care.

**N-ary discriminants.** Each label's discriminant: `normalize(proto_i - mean(proto_j for j != i))`. Prediction scores against all N, returns them ranked by cosine. The binary case falls out naturally.

**Curve self-evaluation.** `resolve(conviction, correct)` accumulates outcomes. `curve()` fits `accuracy = 1/N + a × exp(b × conviction)`. The conviction-accuracy curve — the universal judge — is now a method on the primitive.

**Coalgebra opacity.** Five operations: `observe()`, `predict()`, `decay()`, `resolve()`, `curve()`. The accumulators are private.

`f7f72f6 feat: trading lab consumes holon::Journal — Label symbols, N-ary labels` — the trading lab became a consumer immediately.

*(The Journal was later renamed to [Reckoner](/blog/primers/series-001-003-memory/#reckoner--unified-discriminant-learner) when continuous scalar regression was added alongside discrete classification — one primitive, two readout modes. The [wat language](/blog/primers/series-001-005-the-wat-language/) reflects the current name.)*

---

## trader3 → enterprise

`2baae9d rename: trader3 → enterprise — the binary matches the architecture`
`3bb3f63 rename: btc-walk crate → enterprise`
`49967bb refactor: flatten rust/ to repo root + remove dead CLI flags + build capture`

The cleanup was surgical:

`fb51c75 clean: remove ALL visual encoding ghosts — 35 references eliminated` — imports, type parameters, CLI flags, DB columns, logging calls. Thirty-five references to a system that had been dead since March 27 but was still tangled through the codebase.

`7e0bdaa clean: remove 405 lines of dead code from portfolio.rs (714 → 309)` — the portfolio module had nearly doubled in size through accretion. More than half was dead — structs never constructed, methods never called, fields never read.

`43c4849 clean: remove IndicatorStreams, suppressed_facts, dead encode_view params` — the `IndicatorStreams` stub from v9 was still being passed around as a parameter to every encode call. It did nothing. Removing it touched 14 call sites.

`e2d0373 clean: remove 19 dead thoughts — zero warnings` — the `/dead-thoughts` skill found 19 computed values that were never consumed. Each one was a binding operation in the encoding loop — a `Primitives::bind()` call producing a vector that nothing ever read. Dead thoughts metabolizing.

What remained was clean: `src/bin/enterprise.rs` as the heartbeat, `src/thought/` for encoding, `src/market/` for the observer team and manager, `src/risk/` for portfolio health, `src/vocab/` for the thought vocabulary, and core modules for everything else.

---

## The Fact Interface

`04dc10a refactor: extract 7 vocab modules from thought/mod.rs`
`24da1e5 feat: Fact interface — data in, data out. Modules don't touch vectors.`

The thought encoder had been a 1,870-line monolith — `eval_comparisons_cached`, `eval_segment_narrative`, `eval_ichimoku`, `eval_stochastic`, thirteen `eval_*` methods that mixed domain logic with vector operations. Each method called `Primitives::bind()` and `Primitives::bundle()` directly. Adding a new indicator required understanding both the technical analysis concept AND the vector encoding machinery.

The extraction separated the two concerns:

```rust
pub enum Fact<'a> {
    Zone       { indicator: &'a str, zone: &'a str },
    Scalar     { indicator: &'a str, value: f64, scale: f64 },
    Comparison { predicate: &'a str, a: &'a str, b: &'a str },
    Bare       { label: &'a str },
}
```

Thirteen modules across 1,060 lines — `oscillators.rs` (91 lines), `flow.rs` (98), `persistence.rs` (101), `divergence.rs` (92), `ichimoku.rs` (90), `regime.rs` (260), `timeframe.rs` (84), and six more. Each returns `Vec<Fact>`. The encoder renders facts to geometry: `Fact::Zone` → `bind(indicator_atom, zone_atom)`, `Fact::Scalar` → `bind(indicator_atom, encode_linear(value, scale))`, `Fact::Comparison` → `bind(predicate_atom, bind(a_atom, b_atom))`.

No module touches `VectorManager`. No module calls `bind()`. They observe the candle window and name what they see. Adding a new vocabulary module means writing a function that takes candles and returns `Vec<Fact>`. No vector knowledge required.

---

## The Enterprise Builds Its Own Senses

`fd7063f feat: build-candles — the enterprise builds its own senses`

The candle data came from Python — pandas, vectorized operations, 120 columns of pre-computed indicators. The enterprise read 19 of them and recomputed the rest.

`build-candles` — a Rust binary — reads raw parquet (six columns: timestamp, open, high, low, close, volume) and computes 60 indicators in a single forward pass. 652,608 candles in 2.1 seconds. The causality principle holds: every field at candle t uses only candles [0, t].

```
parquet (6 columns) → build-candles (Rust) → candles.db (60 columns) → enterprise
```

One source. One builder. One consumer. No Python. No chain of custody to trust.

---

## The Streaming Fold

`b123faf feat: pure fold — extract all DB IO from on_candle via LogEntry`
`2280f8c feat: streaming interface — on_event + single-candle on_candle`

The enterprise had consumed candles in a batch loop with state scattered across mutable variables in `main()`. The refactoring followed the fold pattern:

```rust
pub struct EnterpriseState {
    pub observers:       Vec<Observer>,
    pub generalist:      Observer,
    pub manager_journal: Journal,
    pub risk_branches:   Vec<RiskBranch>,
    pub treasury:        Treasury,
    pub portfolio:       Portfolio,
    pub pending:         VecDeque<Pending>,
    pub positions:       Vec<ManagedPosition>,
    // ... 30+ fields of enterprise state
}
```

`on_candle()` takes the state and one candle, returns a `LogEntry` with all side effects deferred. The `Event` enum defines the input vocabulary: `Candle`, `Deposit`, `Withdrawal`. The enterprise doesn't know whether events come from a database replay or a live websocket.

`7bad7ca refactor: eliminate historical candle lookback from on_candle` — each observer maintains its own window. The historical `&candles[w_start..=i]` array indexing was eliminated. The enterprise processes one candle at a time.

---

## The Wards

`bb67dce feat: the wards — sever, reap, scry, gaze`
`b24be52 feat: conjure /forge — the fifth ward`

The codebase had accumulated lies. Dead code the compiler couldn't catch. Stale comments. Specifications that had drifted from implementation. Five skills, born from necessity:

- **`/sever`** — braided concerns, misplaced logic, duplicated encoding
- **`/reap`** — computed values never read, struct fields never accessed, functions never called
- **`/scry`** — wat specifications vs Rust implementations. When they disagree, the wat wins.
- **`/gaze`** — names that mumble, counts that lie, abbreviations that don't speak. Three severities: lies (always report), mumbles (report), taste (do not chase)
- **`/forge`** — values not places, types that enforce, functions that compose

`/wards` runs all five in parallel. `/trinity` runs the first three before every commit.

**Runes** — suppression annotations for things that can't be fixed, only acknowledged: `rune:gaze(complexity) — fold threading requires let* with discarded bindings`. The rune tells the ward: the datamancer has been here. This is conscious.

One rune on the heartbeat revealed the language was missing aggregate types. The 16-parameter function wasn't bad code — it was a missing language form. The struct proposal followed. The heartbeat went from 16 parameters to 4. The rune dissolved.

---

## The Wat Repo Revived

A year ago — March 2025 — I'd started a repo called `wat`. Grok conversation links, a proof-of-concept continuation function, a reference language spec. The ideas couldn't be built yet. The repo sat dormant.

`eb98602 refactor: trading lab wat/ depends on ~/work/holon/wat/ for core+stdlib`

On March 29, the wat repo came back to life. Not as a language implementation — as a specification language. The enterprise's `wat/` directory mirrors its `src/` directory. Every Rust source file with business logic has a corresponding wat specification. The wat doesn't replace Rust. It *precedes* Rust. `/scry` verifies that the two agree. When they don't, the wat wins.

---

## What March 29 Built

102 commits. The throughput — 222 candles/second on the 50k benchmark, up from 139/s before the extraction — came from removing lies, not from optimization. Dead code was dead weight. 405 lines removed from one file. 35 visual ghosts eliminated. 19 dead thoughts reaped. The system got faster by getting honest.

The enterprise doubled its money on the first benchmark after the side quests. Not because the side quests improved accuracy. Because they removed lies (`08d4d78 fix: treasury is the source of truth — portfolio.equity lie is dead`), fixed divergence (`c1dc2c9 fix: manager learns direction only — remove profitability double-learn`), and killed dead thoughts.

Honest architecture produces honest results.

---

## Likely Contributions to the Field

- **Journal as a promoted VSA primitive**: N-ary discriminant learner with `Label(u32)` symbols, coalgebra opacity (five operations), and self-evaluating conviction-accuracy curve — alongside OnlineSubspace and Engram in the memory layer
- **Fact interface for vocabulary scaling**: 13 modules across 1,060 lines returning typed `Fact` data, rendered to geometry by the encoder — modules grow without coupling to vector operations
- **Specification-as-source via wat**: every business logic module has a wat specification verified by `/scry`, `/gaze`, and `/forge` — the spec is the program, the Rust is the compilation
- **Ward system for architectural honesty**: five skills with severity levels and rune suppression. The gaze's oscillation between passes produced the severity model (lies / mumbles / taste). Runes that reveal missing language forms (the struct proposal from the heartbeat rune)
