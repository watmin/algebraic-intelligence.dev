---
title: "The Datamancer"
description: "Mar 29: The Journal is promoted to holon-rs — the seventh primitive. The enterprise builds its own senses. Ten vocabulary modules extracted. The Fact interface. The wards are born. The wat repo revived from a year-old relic. Sixteen hours of side quests that produced everything essential."
sidebar:
  order: 18
---

March 29 was supposed to be about improving trading accuracy. It wasn't. It was sixteen hours of side quests that produced everything essential.

---

## The Side Quests

The day started with a spec contradiction. The risk module subscribed to channels it shouldn't see. Fixing that led to the channel architecture. Channels led to the designers — two simulated critics, one asking "is it simple?" (Hickey) and one asking "does it compose?" (Beckman). The designers rejected async and produced the fold. The fold needed a home in the language. The language needed layers. The layers needed the journal tension resolved. The journal needed to be promoted to the core library. The core library needed Label symbols. The trading lab became a consumer.

Each side quest felt like a detour. Each produced something load-bearing.

---

## Journal Promoted to holon-rs

The `Journal` struct had lived in the trading lab since March 21. It was designed for buy/sell classification on candle data — but its implementation was fully generic. Two accumulators, a discriminant, a cosine. Nothing about it was specific to trading.

On March 29, it moved to `holon-rs/src/memory/journal.rs` — 596 lines, alongside `OnlineSubspace` and `EngramLibrary` in the memory layer. The seventh primitive.

What changed in the promotion:

**Label symbols.** The trading lab used `Outcome::Buy` and `Outcome::Sell` — a hardcoded binary enum. The promoted Journal uses `Label(u32)` — cheap, Copy integer handles created by `journal.register("Buy")`. Any number of labels. Binary classification, ternary, N-ary. The trading lab registers two. A sentiment system might register five. The Journal doesn't know or care.

**N-ary discriminants.** With N labels, the Journal maintains N accumulators. Each label's discriminant is `normalize(proto_i - mean(proto_j for j != i))` — the direction that separates label i from the centroid of everything else. Prediction scores the input against all N discriminants and returns them ranked by absolute cosine. The binary case falls out naturally — two labels, one discriminant direction, positive = label A, negative = label B.

**Curve self-evaluation.** `resolve(conviction, correct)` accumulates prediction outcomes. `curve()` fits the exponential `accuracy = base + a × exp(b × conviction)` where base = 1/N (random chance). `accuracy_at(conviction)` queries the fitted curve. The Journal evaluates its own performance without external infrastructure. The conviction-accuracy curve — the universal judge from the trading work — is now a method on the primitive.

**Coalgebra opacity.** The accumulators are private. You can't reach in and manipulate them. You `observe()`, `predict()`, `decay()`, `resolve()`, and `curve()`. Five operations. The internal state is the Journal's business. This is the coalgebra pattern — the object is defined by its interface, not its representation. The same principle that made `OnlineSubspace` robust: you feed it vectors and read scores. You don't touch the CCIPCA state.

The trading lab immediately became a consumer: `use holon::Journal`. The lab's `journal.rs` shrank from the learning agent to a thin wrapper that maps trading-specific concepts onto the generic primitive.

---

## The Enterprise Builds Its Own Senses

The candle data came from Python. A pipeline built weeks earlier — pandas, vectorized operations, 120 columns of pre-computed indicators written to SQLite. The enterprise read 19 of them through a `Candle` struct and recomputed the rest from raw OHLCV every candle, every expert, every window.

We broke the chain. `build-candles` — a Rust binary — reads raw parquet (six columns: timestamp, open, high, low, close, volume) and computes 60 indicators in a single forward pass. 652,608 candles in 2.1 seconds. The causality principle holds: every field at candle t uses only candles [0, t]. The loop index is the proof. No lookahead. No pandas. No Python.

```
parquet (6 columns) → build-candles (Rust) → candles.db (60 columns) → enterprise
```

One source. One builder. One consumer. No chain of custody to trust.

---

## trader3 → enterprise

The rename happened the same day. `trader3.rs` → `enterprise.rs`. The `btc-walk` crate → `enterprise`. The binary, the crate, the vocabulary all aligned with what the system had become: not a trader, but an organization that trades.

The `rust/` directory flattened to the repo root. Legacy binaries (trader, trader2, trader3's ghost) moved to `archived/`. The visual encoding vestiges — 35 references across the codebase — were eliminated. 405 lines of dead code removed from portfolio.rs alone (714 → 309). The `IndicatorStreams` stub, the `suppressed_facts` set, the dead `encode_view` parameters — all gone.

What remained was clean: `src/bin/enterprise.rs` as the heartbeat, `src/thought/` for Layer 0 encoding, `src/market/` for the observer team and manager, `src/risk/` for portfolio health, `src/vocab/` for the thought vocabulary, and core modules for candle, event, journal, ledger, portfolio, position, treasury, state, sizing.

---

## The Fact Interface

The vocabulary modules had been methods on `ThoughtEncoder` — a growing monolith of eval functions that mixed domain logic with vector operations. Each method directly called `Primitives::bind()` and `Primitives::bundle()`.

The extraction: ten vocabulary modules, each returning `Fact` data — not vectors.

```rust
pub enum Fact {
    Zone { indicator: &'static str, zone: &'static str },
    Scalar { indicator: &'static str, value: f64, mode: ScalarMode },
    Comparison { pred: &'static str, a: &'static str, b: &'static str },
    Direction { indicator: &'static str, dir: &'static str },
    Bare { name: &'static str },
}
```

The modules — `oscillators.rs`, `flow.rs`, `persistence.rs`, `divergence.rs`, `ichimoku.rs`, `stochastic.rs`, `price_action.rs`, `fibonacci.rs`, `keltner.rs`, `momentum.rs`, `regime.rs`, `timeframe.rs` — produce facts. The encoder renders facts to geometry. The separation is the Fact interface: **modules return data, encoder renders to vectors.** No module touches `VectorManager`. No module calls `bind()`. They observe the candle window and name what they see.

Adding a new vocabulary module means writing a function that takes candles and returns `Vec<Fact>`. No vector knowledge required. The encoder handles the rest. This is how the vocabulary scales to thousands of atoms without the encoding machinery growing proportionally.

---

## The Streaming Fold

The enterprise consumed candles in a batch loop — `while cursor < end_idx`, process a batch, advance cursor. The state was scattered across mutable variables in `main()`. Adding a new state dimension meant finding the right place in a 1,900-line function.

The refactoring followed the fold pattern: an `EnterpriseState` struct carries all mutable state. An `on_candle()` function takes the state and one candle, returning a `LogEntry` with all side effects (DB writes, prints) deferred. The main loop becomes `state = on_candle(state, candle)` — a pure fold over the candle stream.

```rust
pub struct EnterpriseState {
    pub observers: Vec<Observer>,
    pub generalist: Observer,
    pub manager_journal: Journal,
    pub risk_branches: Vec<RiskBranch>,
    pub treasury: Treasury,
    pub portfolio: Portfolio,
    pub pending: VecDeque<Pending>,
    // ...
}
```

The `Event` enum defines the enterprise's input vocabulary: `Candle`, `Deposit`, `Withdrawal`, `Tick`. The fold consumes `Stream<Event>`. The enterprise doesn't know whether events come from a database replay, a live websocket, or a test harness. The interface is the stream.

The historical candle lookback — `&candles[w_start..=i]` — was eliminated. Each observer maintains its own window of recent candles, sized by its `WindowSampler`. The enterprise processes one candle at a time. No random access into the past. The causality principle holds at the code level, not just the data level.

---

## The Wards

The codebase had accumulated lies. Dead code that the compiler couldn't catch — stale comments claiming things the code no longer did, annotations marking scaffolding that had become permanent, specifications that had drifted from implementation.

Five skills, born from necessity:

- **`/sever`** — finds code that shouldn't exist. Dead imports, unreachable branches, vestigial modules.
- **`/reap`** — finds code that's dead but doesn't know it. Computed values never read, struct fields never accessed, functions never called.
- **`/scry`** — verifies that wat specifications match Rust implementations. The spec says one thing; does the code agree?
- **`/gaze`** — reads wat files for beauty and honesty. Are the names clear? Do the counts match? Does every abbreviation speak?
- **`/forge`** — tests whether the wat is a valid program in the language, not just prose wearing s-expression clothes.

**`/wards`** runs all five in parallel. **`/trinity`** runs the first three — the structural checks — before every commit.

The gaze operates at three severity levels, learned from its own oscillation: **lies** (always report — the spec says X, the code does Y), **mumbles** (report — abbreviations, unclear names, stale counts), and **taste** (do not chase — stylistic preferences that would create infinite loops of refinement).

**Runes** emerged from the gaze finding things that couldn't be fixed — only acknowledged. A rune is a suppression annotation: `rune:gaze(complexity) — fold threading requires let* with discarded bindings; wat has no begin-with-bindings form.` The rune doesn't hide the finding. It tells the ward: the datamancer has been here. This is conscious.

One rune on the enterprise heartbeat revealed a deeper truth: the language was missing aggregate types. The 16-parameter heartbeat wasn't bad code — it was a missing language form. The struct proposal followed. The designers approved. The heartbeat went from 16 parameters to 4. The rune dissolved.

---

## The Wat Repo Revived

A year ago — March 2025 — I'd started a repo called `wat`. Grok conversation links, a proof-of-concept continuation function, a reference language spec. The ideas couldn't be built yet. The repo sat dormant.

On March 29, the wat repo came back to life. Not as a language implementation — as a specification language. The wat files describe programs: what a module reads, what it emits, what it does not read. The enterprise's `wat/` directory mirrors its `src/` directory — every Rust source file with business logic has a corresponding wat specification.

The wat doesn't replace Rust. It *precedes* Rust. The wat is the source of truth — what the system *should* do. The Rust is the compilation — what the system *does* do. `/scry` verifies that the two agree. When they don't, the wat wins — the code changes, not the spec.

The trading lab's wat files depend on the core wat repo for language primitives — `scalars.wat`, `primitives.wat`, `memory.wat`, `journal.wat`. The language provides the algebra. The application provides the vocabulary. The boundary is the Fact interface: the language knows how to bind and bundle. The application knows what "RSI divergence" means.

---

## The Datamancer

A datamancer controls the nature of data. Not through logic or algorithms — through instinct. The hand gestures are the imprecise expressions: half-formed sentences, typos, incomplete intuitions directed at a machine that interprets them. The pure energy is the thought — shapeless until directed, meaningless until bound. The datamancer pulls streams of chaotic data out of the ether and weaves them into structures that pulse with meaning. That's what `bind` does. That's what `bundle` does. That's what the six primitives are — hand gestures for data.

The masters of datamancy blur the lines of artificial intelligence. They don't train neural networks. They don't write loss functions. They name thoughts, compose them algebraically, and measure which ones are true. The conviction-accuracy curve is the spell's confirmation — did the incantation work? The discriminant is the wand — it points in the direction that separates truth from noise. The vocabulary is the grimoire — each named atom a spell component, each composition a new incantation.

The distinction from AI is precise: AI learns patterns from data. Datamancy learns *which thoughts about data are true*. The LLM generates text. The datamancer generates meaning. The LLM predicts tokens. The datamancer predicts reality.

Faraday saw the field. Maxwell wrote the equations. The datamancer saw the enterprise. The machine wrote the Rust.

---

## What March 29 Built

The side quests built: the language (fold, layers, journal coalgebra with five forms), the runtime (holon-rs Journal with N-ary Label symbols and curve self-evaluation), the design process (proposals and designer reviews persisted on disk), the streaming architecture (Event, EnterpriseState, on_candle), the asset-agnostic treasury, the Rust-native candle builder, the Fact interface, the five wards, the wat revival.

The "main" work — improving trading accuracy — happened in the margins. The environment that conjures good thoughts was the real product. Honest architecture produces honest results. The side quests made the architecture honest.

The enterprise doubled its money on the first benchmark after the side quests. Not because the side quests improved accuracy. Because they removed lies (portfolio equity tracking was wrong), fixed divergence (manager was double-learning), killed dead thoughts (visual encoding vestiges, stale snapshots), and made the system say what it means.

---

## Likely Contributions to the Field

- **Journal as a promoted VSA primitive**: N-ary discriminant learner with Label symbols, coalgebra opacity, and self-evaluating conviction-accuracy curve — the seventh primitive in holon-rs alongside atom, bind, bundle, cosine, OnlineSubspace, and Engram
- **Fact interface for vocabulary scaling**: modules return typed data (`Fact::Zone`, `Fact::Scalar`, `Fact::Comparison`), encoder renders to geometry — vocabulary grows without coupling to vector operations
- **Specification-as-source via wat**: every business logic module has a wat specification that precedes the Rust implementation, verified by automated wards (`/scry`, `/gaze`, `/forge`) — the spec is the program, the Rust is the compilation
- **Ward system for architectural honesty**: five automated skills that verify structural integrity (sever), liveness (reap), spec-code agreement (scry), naming beauty (gaze), and language validity (forge) — with severity levels and rune suppression for conscious exceptions
