---
title: "The Forging"
description: "Mar 31 – Apr 3: 213 phantom runes dissolved to zero. The Journal sign bug — one abs() call, 100% Buy predictions, weeks of silence. Streaming indicators discover two canonical violations. Seven wards cast on every file. 272 tests at 92.5% coverage. The codebase gets honest — and faster — by getting smaller."
sidebar:
  order: 19
---

The wat files existed. Forty of them, mirroring every Rust source file. But the gaze had found something uncomfortable: most of them were descriptions, not programs. S-expression-shaped prose. Comments wearing parentheses.

The forging started March 31. It didn't stop for four days.

---

## 213 Phantom Runes (March 31)

`745b646 gaze: 213 phantom runes inscribed across 37 wat files`

The gaze was improved to cross-reference the wat language specification. Every form in every wat file was checked against the grammar: does this s-expression correspond to a real language construct — a host form, a core primitive, a stdlib operation — or is it pseudocode wearing parentheses?

213 phantoms. `fact/zone` — not a language form. `cache-get` — not a language form. `push!` — not defined in the host language (yet). `format` — not defined. `declare-module` — invented by a previous agent. Across 37 files, the gaze found that more than half the s-expressions in the specifications didn't actually exist in the language.

The language grew to dissolve them. Collections: `map`, `filter`, `fold`, `sort-by`, `range`, `nth`, `first`, `rest`, `empty?`. Math: `abs`, `sqrt`, `clamp`, `exp`, `ln`, `signum`. Maps: `map-of`, `get`, `assoc`, `keys`. Mutation: `set!`, `push!`, `inc!`. The stdlib gained `std/facts.wat` and `std/statistics.wat`. Application patterns — fact constructors, common vocabulary — moved from the language to userland.

`7c073c6 feat: all 89 application phantoms resolved — zero remain`

Then I ran the gaze again.

`501ca1b fix: 6 new phantom runes — the agent replaced phantoms with phantoms`

Six new phantoms. The LLM that dissolved the originals had invented replacements — `use`, `variants`, `declare-module`, `declare-binary`, `vm-get`. Each one looked plausible. Each one was fake. The agent was fluent in s-expressions and had no idea which s-expressions the language actually defined. It generated valid-looking forms the way an LLM generates valid-looking citations — confidently, and wrong.

The wards are tools. The datamancer is the intelligence. I caught it. Inscribed the runes honestly. The language needed enum (for `variants`) and a module system (for `use` and `declare-module`). Those became proposals. The proposals were reviewed. The language grew. The phantoms dissolved.

`ff1d2fb feat: 213 → 1 phantom rune`. Then `0a70a60 feat: candle.wat adopts (field raw-candle ...) — zero phantoms remain`.

---

## The Wards Cast on Everything (March 31 – April 1)

Five wards became seven.

`6eddb59 feat: conjure /assay — the sixth ward measures substance`

The assay's first assessment: `62be300 assay: 40 files measured — 30 programs, 3 mixed, 9 descriptions`. Nine of forty specifications were descriptions — natural language narrating what the Rust does, not s-expressions expressing what the Rust should do. The hollow fold in `enterprise.wat` was the worst offender: 13 steps described in comments, 4 expressed as code. The assay measured 30% substance. Inscribed the rune.

Each description got forged into a program. The observer profiles — momentum, structure, volume, narrative, regime, generalist — were all descriptions. `2ec3a01 feat: 6 observer profiles become programs — assay runes dissolved`. Before: "the momentum observer uses RSI, Stochastic, and Williams %R." After: `(define-lens :momentum (list oscillators stochastic momentum))` — an actual list of module references that the encoder dispatches on.

The vocabulary settled during the forging. The gaze found "expert" meaning three things in three files — the observer entity, the lens it sees through, and the state of having proved its curve. Three words crystallized: *observer* (the entity), *lens* (how it sees), *expert* (a proven observer — a state, not a type). `0ea2db9 gaze: profile → lens, expert = proven observer`. Every file renamed. Every reference updated. The Rust followed: `5212202 rust follows wat: three renames — leaves first`.

`7675dc1 conjure: /temper — the seventh ward`. Temper finds efficient waste — redundant computation, loop-invariant work, allocation patterns that could be hoisted. `0c315e3 temper: 9 fixes + 1 clarity rune across trading wat`. One of the fixes: `deeaeff temper: hoist price delta in pending loop — let* binds once` — a price delta was being computed three times per pending entry inside a loop. The temper hoisted it. The Rust followed.

---

## The Journal Sign Bug (April 3)

This one had been hiding for days. Maybe weeks.

The Journal's `predict()` sorted discriminant scores by absolute cosine — `b.cosine.abs()`. For binary labels (Buy/Sell), this meant that a strong Sell signal (cosine = −0.25) and a strong Buy signal (cosine = +0.25) were ranked identically. The winner was always the first-registered label — Buy. Every prediction was Buy. Always.

The system was running. It was learning. The accumulators were accumulating. The discriminant was separating. The cosine was computing. And every single prediction came out the same direction.

I queried the database. 4,279 positive cosines. 4,844 negative cosines. Every prediction: Buy.

The fix:

```rust
// Before: direction destroyed
scores.sort_by(|a, b| b.cosine.abs().partial_cmp(&a.cosine.abs())
    .unwrap_or(std::cmp::Ordering::Equal));

// After: direction preserved
scores.sort_by(|a, b| b.cosine.partial_cmp(&a.cosine)
    .unwrap_or(std::cmp::Ordering::Equal));
```

One method call removed. `.abs()` deleted. Simulated on existing data: 46.3% → 51.1% accuracy. The momentum observer reached 53.3% on 10k candles.

This bug lived in the promoted holon-rs Journal — the "seventh primitive" from the Datamancer post. The trading lab's wrapper happened to work around it because it used the cosine sign directly. But the generic N-ary case was broken since March 29. Four days of every run producing 100% Buy predictions, and nobody noticed because the system kept running, kept learning, kept producing numbers that looked like numbers.

A working program that does nothing useful. The trading lab's `bpftool map dump` moment — the instrument that revealed the truth was a SQL query against the run database.

---

## Streaming Indicators (April 2)

`286c244 streaming: indicators.rs — fold state + step for all 52 candle fields`

The indicator pipeline had been Python — pre-computed columns in SQLite from a pandas script. The enterprise read 19 of them and recomputed the rest from raw OHLCV every candle. But pandas vectorized operations don't enforce causality. A rolling window computation in pandas can accidentally look forward. The pre-computed values were a chain of custody we couldn't verify.

The streaming pipeline computes every indicator as a fold step: `(state, raw_candle) → (state, computed_candle)`. State carries the rolling buffers — SMA windows, EMA state, RSI accumulators, Bollinger Band statistics. 52 indicator fields. Single-pass. The loop index is the proof.

The tests caught two canonical violations:

```rust
// Bug 1: EMA seeded from first value
// Standard (ta-lib): EMA is seeded from SMA over the warmup period
let mut ema = candles[0].close;  // WRONG — first value is not the SMA

// Bug 2: Wilder RSI returning partial averages during accumulation
// Standard (ta-lib): return 0.0 during warmup, not partial running average
let avg = accumulated_sum / count;  // WRONG — feeds partial values into recursion
```

Both were specification violations that the pre-computed pipeline had papered over. The EMA seed error meant the first ~100 MACD values diverged from the ta-lib standard. The Wilder warmup error meant RSI and ATR carried wrong intermediate values through the entire recursion. Fixed: `3e2df81 fix: EMA uses SMA seed (ta-lib canonical), not first-value`. `7827c3a fix: Wilder warmup returns 0.0 during accumulation, not partial average`.

`46ad6b7 test: 20 indicator unit tests — all match ta-lib canonical spec`

The tests found a third bug that wasn't in the pre-computed pipeline at all: `721cd3a fix: candle_field was missing 7 indicators + panic on unknown`. The `candle_field()` accessor — the function that maps string field names to candle values — was missing 7 of the 52 indicators. Any vocabulary module that referenced them would panic. The tests caught it before a production run did.

---

## Tests (April 2)

The testing campaign built from leaves to root, the same order the wat was forged:

| Step | Tests | Coverage | What was proven |
|------|-------|----------|----------------|
| `f1e0bc1` | 104 | 27% | Vocab leaves + accounting |
| `046d3c4` | 159 | 41.6% | Encoding + accounting |
| `ab8a9ae` | 176 | 63.5% | Encoder + indicator pipeline |
| `841a20b` | 188 | 76.7% | Leaves to root |
| `350ccc0` | 272 | 92.5% | Wards clean on full codebase |

188 to 272 tests in one day. The final push — 84 tests added in one commit — covered the enterprise heartbeat, position lifecycle, treasury operations, and the risk manager. Each test layer verified the layer below before testing the layer above. The remaining 7.5% is the heartbeat orchestration loop itself — integration-tested by runs, not by unit tests.

---

## Risk Gets a Journal (April 2)

`d95d05b risk: Template 1 risk manager — Journal learns Healthy/Unhealthy`

The five OnlineSubspace branches remained — drawdown, accuracy, volatility, correlation, panel shape. Each learns what "healthy" looks like in its domain, same as the DDoS lab's subspace learns what "normal traffic" looks like. But the risk *manager* — the component that synthesizes the branch outputs into a sizing decision — had been using `worst_residual` as a raw multiplier. No learning. No discrimination.

The fix: give the risk manager its own Journal. Two labels: Healthy and Unhealthy. Feed it the 25-dimensional risk feature vector — all five branch residuals, plus drawdown depth, multi-scale accuracy, ATR regime, loss clustering, recovery progress. The discriminant learns which *combinations* of branch states precede winning trades.

`9f9fc89 risk: generalist OnlineSubspace sees all 25 dimensions holistically`

The risk generalist is a single OnlineSubspace across all 25 risk features — the same "one manifold sees everything" approach used for the market generalist. `fa8f711 risk: generalist is a peer, not a layer above — same shape as market`. The risk tree now mirrors the market tree exactly. Five specialists. One generalist. One manager. Same architecture, different question.

---

## Proposal 006: Symmetric Positions (April 1–2)

`b2c154a proposal 006: multi-asset treasury — approved with resolution`

The treasury had been lying. It assumed "buy means USDC→WBTC, sell means WBTC→USDC." Positions had a `direction` field but the P&L calculation assumed Buy. The stop-loss trigger assumed Buy. The exit logging assumed Buy. SELL positions showed −100% P&L because `return_pct()` subtracted in the wrong direction.

`4c00eaf proposal 006 step 1: symmetric position struct (source/target)` — positions now have `source_asset` and `target_asset`. A BUY is USDC→WBTC. A SELL is WBTC→USDC. The P&L calculation is direction-aware. The stop trigger is direction-aware. The exit log is direction-aware.

`4384d69 proposal 006 step 2: generic treasury — no base_asset, no seed privilege` — the treasury became `HashMap<String, f64>`. Any assets. Any pairs. The desk became the per-pair unit. The system doesn't know what USDC or WBTC are. It knows that assets have balances and swaps have costs.

---

## Parallel Everything (April 2)

`3380abd pmap: parallel observer encoding, prediction, and decay via rayon`

Seven parallel sites mapped and exploited:

1. Observer encoding (per observer — independent lenses, independent windows)
2. Observer prediction (per observer — independent discriminants)
3. Observer decay (per observer — independent accumulators)
4. Risk branch scoring (per branch — independent subspaces)
5. Risk branch updates (per branch — independent CCIPCA state)
6. Thought fact evaluation (per vocab module — independent candle reads)
7. Manager thought facts (per observer — independent conviction encoding)

Each site verified safe by the wards: no shared mutable state between parallel workers. `6b8a06e forge: SharedState replaces 5 bare &mut params on on_candle` — the mutable state that must be sequential is collected into one struct. Everything else is `par_iter().map().collect()`.

---

## What Four Days Built

| Metric | Before | After |
|--------|--------|-------|
| Phantom runes | 213 | 0 |
| Wards | 5 | 7 (+ assay, temper) |
| Tests | ~20 | 272 (92.5% coverage) |
| Indicator pipeline | Python pre-computed | Rust streaming, causal, ta-lib verified |
| Risk architecture | OnlineSubspace only | OnlineSubspace + Journal manager |
| Treasury | Hardcoded USDC/WBTC | Generic HashMap, any pair |
| Parallel sites | 2 | 7 |
| Journal sign bug | 100% Buy predictions | Direction restored (51.1%) |

The sign bug is the one that matters most. Four days of forging — phantom runes, streaming indicators, 272 tests, seven wards — and the biggest fix was deleting `.abs()` from one sort comparator. The system had been running with its direction sense destroyed. The codebase got honest. The numbers followed.

---

## Likely Contributions to the Field

- **Ward-driven development**: seven automated skills (sever, reap, scry, gaze, forge, assay, temper) cast on every file before commits — structural honesty enforced by measurement, not convention. Phantom runes (213→0) as a quantitative metric for specification completeness
- **Streaming indicator pipeline as a fold**: 52 technical indicators computed as `(state, raw_candle) → (state, computed_candle)` with causal guarantee — the loop index is the proof. Two canonical violations caught (EMA seed, Wilder warmup), unit-tested against ta-lib spec (272 tests, 92.5% coverage)
- **Symmetric position primitive**: source/target asset pairs with direction-aware P&L and generic treasury (`HashMap<String, f64>`) — the system doesn't know what USDC or WBTC are, only that assets have balances and swaps have costs
