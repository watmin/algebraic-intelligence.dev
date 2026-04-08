---
title: "The Datamancer"
description: "Mar 29: 102 commits. The Journal is promoted to holon-rs — N-ary labels, curve self-evaluation. trader3 → enterprise. 405 lines of dead code removed. 13 vocabulary modules extracted via the Fact interface. The enterprise builds its own senses. The wards are born. The wat repo revived. Sixteen hours of side quests that produced everything essential."
sidebar:
  order: 18
---

March 29 was supposed to be about improving trading accuracy. It wasn't. By the end of the day: 102 commits, a core library promotion, a crate rename, 405 lines of dead code removed, 35 visual encoding references eliminated, 13 vocabulary modules extracted, a streaming fold architecture, a Rust-native candle builder, five automated wards, and a year-old repository brought back from the dead.

Sixteen hours of side quests that produced everything essential.

---

## The Side Quests

The day started with a spec contradiction. The risk module subscribed to channels it shouldn't see. Fixing that led to the channel architecture. Channels led to the designers — two simulated critics, one asking "is it simple?" (Hickey) and one asking "does it compose?" (Beckman). The designers rejected async and produced the fold. The fold needed a home in the language. The language needed layers. The layers needed the journal tension resolved. The journal needed to be promoted to the core library. The core library needed Label symbols. The trading lab became a consumer.

Each side quest felt like a detour. Each produced something load-bearing.

---

## Journal Promoted to holon-rs

`99f729c feat: Journal coalgebra with Label symbols — promoted to holon-rs`
`dada729 feat: journal curve + configurable params + N-ary base`

The `Journal` struct had lived in the trading lab since March 21 — the [238-line binary version](/blog/story/series-006-001-the-thought-machine/#the-journal) with hardcoded Buy/Sell accumulators. It was fully generic. Two accumulators, a discriminant, a cosine. Nothing about it was specific to trading or to two classes.

On March 29, it was generalized and promoted to `holon-rs/src/memory/journal.rs` — 596 lines, alongside `OnlineSubspace` and `EngramLibrary` in the memory layer:

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
    // Diagnostics
    last_cos_raw:       f64,
    last_disc_strength: f64,
    recalib_count:      usize,
}
```

What changed:

**`Label(u32)` symbols** replaced the hardcoded `Outcome::Buy`/`Outcome::Sell` enum. Cheap, Copy integer handles created by `journal.register("Buy")`. Binary, ternary, N-ary — the Journal doesn't know or care. The trading lab registers two labels. A sentiment system might register five.

**N-ary discriminants.** With N labels, each discriminant is `normalize(proto_i - mean(proto_j for j != i))`. Prediction scores against all N discriminants, returns them ranked by absolute cosine. The binary case falls out naturally.

**Curve self-evaluation.** `resolve(conviction, correct)` accumulates outcomes. `curve()` fits `accuracy = 1/N + a × exp(b × conviction)` where 1/N is random chance. The conviction-accuracy curve — the universal judge — is now a method on the primitive.

**Coalgebra opacity.** Five operations: `observe()`, `predict()`, `decay()`, `resolve()`, `curve()`. The accumulators are private. The internal state is the Journal's business.

`f7f72f6 feat: trading lab consumes holon::Journal — Label symbols, N-ary labels` — the trading lab became a consumer immediately.

*(The Journal was later renamed to [Reckoner](/blog/primers/series-001-003-memory/#reckoner--unified-discriminant-learner) when continuous scalar regression was added alongside discrete classification — one primitive, two readout modes. The [wat language](/blog/primers/series-001-005-the-wat-language/) reflects the current name.)*

---

## trader3 → enterprise

`2baae9d rename: trader3 → enterprise — the binary matches the architecture`
`3bb3f63 rename: btc-walk crate → enterprise`
`49967bb refactor: flatten rust/ to repo root + remove dead CLI flags + build capture`

The binary, the crate, the directory all aligned with what the system had become. Legacy binaries moved to `archived/`.

`fb51c75 clean: remove ALL visual encoding ghosts — 35 references eliminated`
`7e0bdaa clean: remove 405 lines of dead code from portfolio.rs (714 → 309)`
`43c4849 clean: remove IndicatorStreams, suppressed_facts, dead encode_view params`
`e2d0373 clean: remove 19 dead thoughts — zero warnings`
`9e83ec5 clean: remove tht_fast — dead dual-journal experiment`

What remained: `src/bin/enterprise.rs` (the heartbeat), `src/thought/` (Layer 0), `src/market/` (observer team + manager), `src/risk/` (portfolio health), `src/vocab/` (thought vocabulary), and core modules for candle, event, journal, ledger, portfolio, position, treasury, state, sizing.

---

## The Fact Interface

`04dc10a refactor: extract 7 vocab modules from thought/mod.rs`
`24da1e5 feat: Fact interface — data in, data out. Modules don't touch vectors.`
`8e315d8 feat: all 10 vocab modules on Fact interface + book hint`

The vocabulary modules had been methods on `ThoughtEncoder` — a monolith mixing domain logic with vector operations. Each method called `Primitives::bind()` directly.

The extraction: thirteen modules across 1,060 lines, each returning `Fact` data — not vectors:

```rust
pub enum Fact<'a> {
    Zone       { indicator: &'a str, zone: &'a str },
    Scalar     { indicator: &'a str, value: f64, scale: f64 },
    Comparison { predicate: &'a str, a: &'a str, b: &'a str },
    Bare       { label: &'a str },
}
```

| Module | Lines | Domain |
|--------|-------|--------|
| `regime.rs` | 260 | KAMA, choppiness, DFA, entropy, fractal dimension, Aroon |
| `persistence.rs` | 101 | Hurst exponent, autocorrelation, ADX zones |
| `flow.rs` | 98 | OBV, VWAP, MFI, buying/selling pressure |
| `divergence.rs` | 92 | RSI divergence via PELT segment peaks/troughs |
| `oscillators.rs` | 91 | Williams %R, StochRSI, Ultimate Oscillator, ROC |
| `ichimoku.rs` | 90 | Tenkan, kijun, senkou spans, cloud zones, TK cross |
| `timeframe.rs` | 84 | Cross-timeframe agreement (multi-window) |
| `price_action.rs` | 50 | Inside/outside bars, gaps, consecutive candles |
| `stochastic.rs` | 44 | %K vs %D, overbought/oversold, crosses |
| `fibonacci.rs` | 37 | Proximity to retracement levels (0.236–0.786) |
| `keltner.rs` | 36 | Channels, BB vs Keltner squeeze detection |
| `momentum.rs` | 25 | ROC, CCI zones |

The encoder renders facts to geometry: `Fact::Zone` → `bind(indicator_atom, zone_atom)`, `Fact::Scalar` → `bind(indicator_atom, encode_linear(value, scale))`, `Fact::Comparison` → `bind(predicate_atom, bind(a_atom, b_atom))`. No module touches `VectorManager`. No module calls `bind()`. They observe the candle window and name what they see.

Adding a new vocabulary module means writing a function that takes candles and returns `Vec<Fact>`. No vector knowledge required.

---

## The Enterprise Builds Its Own Senses

`fd7063f feat: build-candles — the enterprise builds its own senses`
`7022792 feat: Candle struct expanded to 60 fields — enterprise drinks from the richer well`

The candle data came from Python — pandas, vectorized operations, 120 columns of pre-computed indicators. The enterprise read 19 of them and recomputed the rest from raw OHLCV every candle.

`build-candles` — a Rust binary — reads raw parquet (six columns: timestamp, open, high, low, close, volume) and computes 60 indicators in a single forward pass. 652,608 candles in 2.1 seconds. The causality principle holds: every field at candle t uses only candles [0, t]. The loop index is the proof.

```
parquet (6 columns) → build-candles (Rust) → candles.db (60 columns) → enterprise
```

One source. One builder. One consumer. No Python.

---

## The Streaming Fold

`b123faf feat: pure fold — extract all DB IO from on_candle via LogEntry`
`2280f8c feat: streaming interface — on_event + single-candle on_candle`
`140c6aa refactor: heartbeat uses EnterpriseState — the fold's carrier type`

The enterprise consumed candles in a batch loop with state scattered across mutable variables in `main()`. The refactoring:

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

`7bad7ca refactor: eliminate historical candle lookback from on_candle` — each observer maintains its own window. No random access into the past. The causality principle holds at the code level.

---

## The Wards

`bb67dce feat: the wards — sever, reap, scry, gaze`
`b24be52 feat: conjure /forge — the fifth ward`

The codebase had accumulated lies. Five skills, born from necessity:

- **`/sever`** — dead imports, unreachable branches, vestigial modules
- **`/reap`** — computed values never read, struct fields never accessed
- **`/scry`** — wat specifications vs Rust implementations
- **`/gaze`** — names that mumble, counts that lie, abbreviations that don't speak
- **`/forge`** — is the wat a valid program or prose wearing s-expression clothes?

`/wards` runs all five in parallel. `/trinity` runs the first three before every commit.

The gaze learned severity levels from its own oscillation: **lies** (always report), **mumbles** (report), **taste** (do not chase). **Runes** emerged for things that couldn't be fixed — only acknowledged: `rune:gaze(complexity) — fold threading requires let* with discarded bindings; wat has no begin-with-bindings form.`

One rune on the heartbeat revealed the language was missing aggregate types. The 16-parameter heartbeat wasn't bad code — it was a missing language form. The struct proposal followed. The heartbeat went from 16 parameters to 4. The rune dissolved.

---

## The Wat Repo Revived

A year ago — March 2025 — I'd started a repo called `wat`. Grok conversation links, a proof-of-concept continuation function, a reference language spec. The ideas couldn't be built yet. The repo sat dormant.

`eb98602 refactor: trading lab wat/ depends on ~/work/holon/wat/ for core+stdlib`

On March 29, the wat repo came back to life. Not as a language implementation — as a specification language. The enterprise's `wat/` directory mirrors its `src/` directory. Every Rust source file with business logic has a corresponding wat specification.

The wat doesn't replace Rust. It *precedes* Rust. `/scry` verifies that the two agree. When they don't, the wat wins. The language provides the algebra (`scalars.wat`, `primitives.wat`, `memory.wat`, `journal.wat`). The application provides the vocabulary. The boundary is the Fact interface.

---

## What March 29 Built

Throughput — 222 candles/second on the 50k benchmark, up from 139/s before the extraction. The speedup came from removing lies, not from optimization. Dead code was dead weight. The system got faster by getting honest.

The enterprise doubled its money on the first benchmark after the side quests. Not because the side quests improved accuracy. Because they removed lies (portfolio equity tracking was wrong — `08d4d78 fix: treasury is the source of truth — portfolio.equity lie is dead`), fixed divergence (`c1dc2c9 fix: manager learns direction only — remove profitability double-learn`), and killed dead thoughts (`fb51c75 clean: remove ALL visual encoding ghosts — 35 references eliminated`).

Honest architecture produces honest results.

*(The philosophical meaning of this work — the datamancer identity, the distinction between AI and datamancy, the expression problem, Faraday's field lines — is in [The Book](/blog/book/).)*

---

## Likely Contributions to the Field

- **Journal as a promoted VSA primitive**: N-ary discriminant learner with `Label(u32)` symbols, coalgebra opacity (five operations, private accumulators), and self-evaluating conviction-accuracy curve `accuracy = 1/N + a × exp(b × conviction)` — 596 lines in holon-rs alongside OnlineSubspace and Engram
- **Fact interface for vocabulary scaling**: 13 modules across 1,060 lines returning typed `Fact` data (`Zone`, `Scalar`, `Comparison`, `Bare`), rendered to geometry by the encoder — modules grow without coupling to vector operations
- **Specification-as-source via wat**: every business logic module has a wat specification verified by `/scry` (spec-code agreement), `/gaze` (naming beauty), and `/forge` (language validity) — severity levels and rune suppression for conscious exceptions
- **Ward system for architectural honesty**: five automated skills running before every commit, with rune-driven language evolution (a rune revealed the missing struct form, which was then designed and adopted)
