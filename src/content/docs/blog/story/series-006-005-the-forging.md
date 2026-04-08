---
title: "The Forging"
description: "Mar 31 – Apr 3: 213 phantom runes dissolved to zero. Seven wards cast on every file. The Rust follows the wat. 188 tests at 76.7% coverage. Streaming indicators replace the Python pipeline. The risk manager gets a Journal. Proposal 006: symmetric positions, generic treasury. The codebase gets honest — and faster — by getting smaller."
sidebar:
  order: 19
---

The wat files existed. Forty of them, mirroring every Rust source file. But the gaze had found something uncomfortable: most of them were descriptions, not programs. S-expression-shaped prose. Comments wearing parentheses.

The forging started March 31. It didn't stop for four days.

---

## 213 Phantom Runes (March 31)

`745b646 gaze: 213 phantom runes inscribed across 37 wat files`

The gaze was improved to cross-reference the wat language specification. Forms that looked like valid s-expressions but weren't defined in the language — `fact/zone`, `push!`, `cache-get`, `format`, `variants`, `declare-module`. Pseudocode wearing program clothes. 213 of them.

The language grew to dissolve them. Host language expanded — `020c13d fix: 73 phantom runes dissolved — host language expansion works`. Collections (`map`, `filter`, `fold`, `sort-by`, `range`), math (`abs`, `sqrt`, `clamp`, `exp`, `ln`), maps (`map-of`, `get`, `assoc`, `keys`), mutation (`set!`, `push!`, `inc!`). The stdlib grew — `d9ceecb feat: stdlib grows — std/facts.wat + std/statistics.wat`. Application patterns moved from language to userland — `42b312f feat: facts, common, patterns move to application — stdlib enables, app decides`.

`7c073c6 feat: all 89 application phantoms resolved — zero remain`

Then: `501ca1b fix: 6 new phantom runes — the agent replaced phantoms with phantoms`. The LLM dissolved phantom A and introduced phantom B — `variants`, `vm-get`. The datamancer caught it. The wards are tools. The datamancer is the intelligence.

`ff1d2fb feat: 213 → 1 phantom rune`. Then `0a70a60 feat: candle.wat adopts (field raw-candle ...) — zero phantoms remain`.

---

## The Wards Cast on Everything (March 31 – April 1)

Five wards became seven. `/assay` measures substance — is the spec a program or a description? `6eddb59 feat: conjure /assay — the sixth ward measures substance`. First assessment: `62be300 assay: 40 files measured — 30 programs, 3 mixed, 9 descriptions`. Each description got forged into a program.

`7675dc1 conjure: /temper — the seventh ward`. Temper finds efficient waste — redundant computation, loop-invariant work, allocation patterns. `0c315e3 temper: 9 fixes + 1 clarity rune across trading wat`.

The Rust followed the wat. `5212202 rust follows wat: three renames — leaves first`. `be27647 rust follows wat: bare &str → enums, scry + gaze pass`. `a9c8084 rust follows wat: 19 helpers extracted — leaves aligned`. The order: ward the wat → fix the wat → make the Rust match.

The vocabulary settled during the forging. "Expert" meant three things in three files. Three words crystallized: *observer* (the entity that perceives), *lens* (how it sees — momentum, structure, volume, narrative, regime), *expert* (an observer that has proven its curve — a state, not a type). "Render" → *weave*. "Profile" → *lens*. The gaze renamed them across every file.

---

## Streaming Indicators (April 2)

`286c244 streaming: indicators.rs — fold state + step for all 52 candle fields`

The indicator pipeline had been a Python legacy — pre-computed columns in SQLite. The enterprise read 19 of them and recomputed the rest. This was a lie: the pre-computed values used lookahead (pandas vectorized operations don't enforce causality by default).

The streaming pipeline computes every indicator as a fold step: `(state, raw_candle) → (state, computed_candle)`. State carries the rolling buffers — SMA windows, EMA state, RSI accumulators, Bollinger Band statistics. Every field at candle t uses only candles [0, t].

`aebe3ab streaming: raw candle in, computed candle out — no global buffer`

52 indicator fields. Single-pass. Causal. The loop index is the proof.

`46ad6b7 test: 20 indicator unit tests — all match ta-lib canonical spec`
`3e2df81 fix: EMA uses SMA seed (ta-lib canonical), not first-value`

The tests caught two bugs: EMA was seeded from the first value instead of the SMA over the warmup period, and Wilder's RSI returned partial averages during accumulation instead of zero. Both were canonical specification violations that the pre-computed pipeline had papered over.

---

## Tests (April 2)

The testing campaign built from leaves to root:

```
f1e0bc1 test: 104 tests, 27% coverage — leaves to accounting proven
046d3c4 test: 159 tests, 41.6% coverage — encoding + accounting proven
ab8a9ae test: 176 tests, 63.5% coverage — encoder + indicator pipeline proven
841a20b test: 188 tests, 76.7% coverage — leaves to root proven
350ccc0 fix: wards clean, 272 tests (92.5%)
```

188 to 272 tests in one day. Coverage from 27% to 92.5%. Each test layer verified the layer below before testing the layer above — the same leaves-to-root pattern as the wat forging.

---

## Risk Gets a Journal (April 2)

`d95d05b risk: Template 1 risk manager — Journal learns Healthy/Unhealthy`

The five OnlineSubspace branches remained (drawdown, accuracy, volatility, correlation, panel shape). But the risk *manager* — the component that synthesizes the branch outputs into a sizing decision — gained its own Journal. The labels: Healthy and Unhealthy. The discriminant learns which combinations of branch residuals precede winning trades.

`9f9fc89 risk: generalist OnlineSubspace sees all 25 dimensions holistically`
`fa8f711 risk: generalist is a peer, not a layer above — same shape as market`

The risk tree now mirrors the market tree exactly. Five specialists with different lenses. One generalist seeing everything. One manager reading the panel. Same architecture, different question. Market asks "which direction?" Risk asks "is this healthy?"

---

## Proposal 006: Symmetric Positions (April 1–2)

`b2c154a proposal 006: multi-asset treasury — approved with resolution`

The treasury had been hardcoded to USDC/WBTC. Positions assumed "buy means USDC→WBTC, sell means WBTC→USDC." This was a lie — the system couldn't handle a third asset, couldn't handle the reverse direction, couldn't express "I want to hold ETH against BTC."

The fix: symmetric positions with source and target assets. `4c00eaf proposal 006 step 1: symmetric position struct (source/target)`. `4384d69 proposal 006 step 2: generic treasury — no base_asset, no seed privilege`. The treasury became a `HashMap<String, f64>` — any assets, any pairs. The desk became the per-pair unit: `c39b78b proposal 006: Desk struct — per-pair enterprise tree`.

---

## Parallel Everything (April 2)

`3380abd pmap: parallel observer encoding, prediction, and decay via rayon`
`2e37891 pmap: 5 parallel sites, wat updated with pmap/pfor-each`

Seven parallel sites total after the extraction:

1. Observer encoding (per observer — independent lenses, independent windows)
2. Observer prediction (per observer — independent discriminants)
3. Observer decay (per observer — independent accumulators)
4. Risk branch scoring (per branch — independent subspaces)
5. Risk branch updates (per branch — independent CCIPCA state)
6. Thought fact evaluation (per vocab module — independent candle reads)
7. Manager thought facts (per observer — independent conviction encoding)

Each site verified safe by the wards: no shared mutable state between parallel workers. The `SharedState` struct — `6b8a06e forge: SharedState replaces 5 bare &mut params on on_candle` — carries the mutable state that must be sequential. Everything else is `par_iter().map().collect()`.

---

## The Journal Sign Bug (April 3)

`1871baf fix: Journal predict sorts by raw cosine, not abs — restores direction signal`

The Journal's `predict()` was sorting discriminant scores by absolute cosine — `|cos|`. This meant that a strong Sell signal (cos = −0.25) and a strong Buy signal (cos = +0.25) were treated identically when selecting the winner. The direction was being thrown away at the ranking step.

The fix: sort by raw cosine. The label with the highest signed cosine wins. Direction preserved.

This bug had been hiding in the promoted holon-rs Journal since March 29. The trading lab's wrapper happened to work around it because it only had two labels and used the sign directly. But the generic N-ary case was broken. Fixed in holon-rs, propagated to all consumers.

---

## What Four Days Built

| Metric | Before | After |
|--------|--------|-------|
| Phantom runes | 213 | 0 |
| Wards | 5 | 7 (+ assay, temper) |
| Tests | ~20 | 272 (92.5% coverage) |
| Indicator pipeline | Python pre-computed | Rust streaming, causal |
| Risk architecture | OnlineSubspace only | OnlineSubspace + Journal manager |
| Treasury | Hardcoded USDC/WBTC | Generic HashMap, any pair |
| Parallel sites | 2 | 7 |

The codebase got honest. The wat became programs. The Rust followed the wat. The tests proved the leaves. The wards proved the tree. The streaming indicators eliminated the Python dependency. The system got faster by getting smaller — dead code removed, redundant computation tempered, parallel opportunities mapped and exploited.

---

## Likely Contributions to the Field

- **Ward-driven development**: seven automated skills (sever, reap, scry, gaze, forge, assay, temper) cast on every file before commits — structural honesty enforced by measurement, not convention. Phantom runes (213→0) as a quantitative metric for specification completeness
- **Streaming indicator pipeline as a fold**: 52 technical indicators computed as `(state, raw_candle) → (state, computed_candle)` with causal guarantee — the loop index is the proof. Unit-tested against ta-lib canonical spec (272 tests, 92.5% coverage)
- **Symmetric position primitive**: source/target asset pairs with direction-aware P&L and generic treasury (`HashMap<String, f64>`) — the system doesn't know what USDC or WBTC are, only that assets have balances and swaps have costs
