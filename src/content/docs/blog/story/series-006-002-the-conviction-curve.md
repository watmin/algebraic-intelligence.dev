---
title: "The Conviction Curve"
description: "Mar 25–27: trader3 lands with named journals and the P&L lie fixed (+228% was fiction, +5.49% was real). The conviction flip. The q99 discovery at 59.7% — from an explainability commit, not a tuning session. The exponential curve. One economic parameter. Then the acid test: 652k candles, six years, every regime."
sidebar:
  order: 16
---

The thought encoder works. 57.1% accuracy. But 57.1% with zero selectivity — trading every candle — is a thin edge. The question: is there a way to know *when* the system is right?

---

## trader3 (March 25)

`915487c feat: trader3 — named journals, input stripping, conviction flip, flip-zone-only trading`

The third iteration. Named journals — `visual` and `thought` as distinct `Journal` instances instead of anonymous accumulators. Input stripping — the mean-proto fix from the previous post. And the conviction flip.

The commit message buries the most important finding:

> P&L bug fixed: record_trade now uses outcome_pct (signed price return at first threshold crossing), not peak_abs_pct. Previous +228% was fiction.

+228% was fiction. The P&L calculation had been using the peak absolute price change — the maximum distance price traveled from entry, regardless of direction — instead of the actual return at the first threshold crossing. Every metric we'd been optimizing against was wrong. The honest number: +5.49%, 53.6% win rate, 10,539 trades. Smaller. Real.

The flip came from the same commit. The discriminant learns what trend extremes look like. At a 36-candle horizon (3 hours at 5-minute resolution), established trends are frequently exhausted. The system learns the shape of continuation — and when it's highly confident about continuation, it's identifying the exact moment when the trend is most likely to reverse.

High conviction about continuation = trend extreme = reversal likely.

The threshold is data-driven — the 85th percentile of recent conviction values, recomputed every 500 candles from a rolling window of ~50k observations. Below the threshold: skip entirely. "Low-conviction candles are ~49% accurate; trading them bleeds the edge away."

---

## The q99 Discovery (March 26)

`75c873a feat: explainability vectors, k=32 thought subspace, q99 discovery (59.7%)`

This commit wasn't about tuning. It was about explainability — adding the `trade_vectors` and `subspace_log` tables to the run database so we could analyze what the system was actually doing. The visual engram analysis (win-win vs win-loss cosine: gap = 0.0004) was one finding. The thought manifold analysis (d' = 0.734, regime-invariant eigenvalues) was another.

The q99 finding came from binning the resolved predictions by conviction and computing per-bin accuracy:

| Quantile | Conviction ≥ | Accuracy | Trades (100k) |
|---|---|---|---|
| q0 (all) | 0.00 | 50.3% | ~90,000 |
| q50 | 0.13 | 51.5% | ~50,000 |
| q85 | 0.18 | 54.0% | ~10,000 |
| q95 | 0.20 | 57.0% | ~5,000 |
| q99 | 0.227 | **59.7%** | 870 |
| q99.5 | 0.25 | 70.9% | 86 |

The relationship was monotonic. Every step up in selectivity produced proportionally better accuracy. This wasn't a lucky threshold — it was a curve.

---

## The Curve (March 26)

`f8ca66d docs+feat: exponential curve fit, comprehensive session notes`

The auto flip mode fits the curve analytically:

```
accuracy = 0.50 + a × exp(b × conviction)
```

Three phases: noise (0.00–0.13, 50.3%), signal (0.14–0.22, 54.5%), exponential (0.23+, 63%+). The exponential isn't an artifact — it's the geometry of the encoding space. Conviction measures how many independent facts are voting in the same direction. The probability of many independent facts coincidentally aligning decreases exponentially as you require more of them. The wisdom of crowds in vector algebra.

The curve reduces the system to one economic input: `--min-edge`, the minimum acceptable win rate.

```
threshold = ln((min_edge − 0.50) / a) / b
```

That threshold derives everything — trade gate, flip threshold, position sizing:

| Mode | min_edge | Trades/100k | Win rate | Character |
|---|---|---|---|---|
| Income | 0.55 | ~5,000 | 55%+ | High volume, thin edge |
| Growth | 0.60 | ~700 | 60%+ | Balanced |
| Sniper | 0.65 | ~300 | 65%+ | Few trades, fat edge |

In `auto` mode, the system fits the exponential to its own resolved predictions every `recalib_interval` candles: bin by conviction, compute per-bin accuracy, log-linear regression, solve for the conviction where flipped accuracy equals `min_edge`. The threshold is self-derived.

No magic numbers. One economic decision: "how selective do I want to be?"

The first 40,000 candles: **75.6%**. The discriminant starts cold and learns from the stream. Early accuracy benefits from a fresh discriminant. As history accumulates, accuracy settles to its long-run level.

---

## The Acid Test: 652k Candles (March 27)

`a9aa7e2 milestone: 56.5% across 652k candles (6 years), BOOK.md`

652,362 candles. January 2019 to March 2025. No training set. No test set. The discriminant learns online with exponential decay. Every candle is simultaneously training data and test data. The system has never seen the future.

```
Candle 100k (Dec 2019): 59.7%    870 trades — known territory
Candle 200k (Nov 2020): 59.1%  1,586 trades — through COVID crash + recovery
Candle 280k (Aug 2021): 58.8%  2,615 trades — into the mega bull
Candle 360k (Jun 2022): 58.3%  3,231 trades — Luna crash, bear begins
Candle 400k (Oct 2022): 58.4%  3,594 trades — deepest bear
Candle 410k (Nov 2022): 58.3%  3,666 trades — FTX collapses
Candle 440k (Mar 2023): 57.8%  3,811 trades — recovery begins
```

The number barely moves. The geometry doesn't care about the regime. It cares about the measurement basis.

**652,362 candles. 5,298 trades. 56.5% accuracy. Six years. Every regime.**

| Year | Accuracy | Trades | Context |
|---|---|---|---|
| 2019 | 59.3% | 888 | Bull recovery |
| 2020 | 58.3% | 876 | COVID crash + recovery |
| 2021 | 55.7% | 1,208 | Mega bull ($29k→$69k) |
| 2022 | **60.3%** | 754 | Bear market, Luna, FTX |
| 2023 | 50.1% | 708 | Choppy recovery |
| 2024 | 52.6% | 662 | New all-time highs |
| 2025 | 60.9% | 202 | Current (partial) |

The bear market was the best year. 60.3% in 2022 — the year BTC fell from $69k to $16k. The conviction flip catches reversals during sustained trends. When everyone is certain the trend continues, the system is most certain it won't.

2023 was the worst — 50.1%. Choppy, directionless recovery where extreme conviction signals didn't resolve cleanly. The discriminant churns when the label boundary moves faster than the accumulator can track.

---

## 107 Atoms (March 27)

`9aa35f0 feat: massive vocabulary expansion — Ichimoku, Stochastic, Fibonacci, Keltner, CCI, price action`
`2d0cd02 book + milestone: 62.1% with expanded vocabulary (107 atoms, 100k candles)`

84 atoms at 100k: 59.7%. 107 atoms at 100k: **62.1%**.

23 new atoms — Ichimoku Cloud, Stochastic Oscillator, Fibonacci retracement, Keltner Channels, CCI, volume analysis, price action patterns. At 90,000 candles, 84 atoms was declining: 58.4% and falling. 107 atoms was rising: 62.3% and climbing. The new thoughts provided signal in the exact regime where the old vocabulary ran dry.

The downside of more thoughts is bounded — the discriminant filters noise. The upside is unbounded. Fact pruning hurt by 2.3%. Weighted bundling created feedback loops. Simply *adding* atoms with real domain meaning improved accuracy without degradation. The vocabulary is the model.

---

## What Happened Next — in the Same Day

The 652k validation and the 107-atom expansion both happened on March 27. By that evening, visual encoding was dropped entirely (`6a19b05 perf: remove visual encoding, 10 threads — 127/s → 470/s`). The dead visual_groups code was still running — every flipped trade spawned a new 10,000-dimensional centroid that never matched anything, degrading throughput from 376/s at candle 2,000 to 83/s at candle 50,000. `f74e81c fix: remove dead visual_groups — unbounded O(n×dims) throughput killer`. Three deletions. Back to 251/s flat.

Four specialized expert journals were scaffolded (`7d9bd38 feat: expert panel`). Risk-as-a-thought was tried and found to be noise (`3a3ec64 finding: risk bundled with market = noise`). Risk as anomaly detection produced `f49556b milestone: risk state carries massive signal — 84.5% at peak, 47.8% in drawdown`.

That's the [next post](/blog/story/series-006-003-the-enterprise/).

*(The philosophical implications — the quantum structure, why LLMs can't think thoughts, the wat machine, the expression problem — are in [The Book](/blog/book/).)*

---

## Likely Contributions to the Field

- **The conviction-accuracy curve**: `accuracy = 0.50 + a × exp(b × conviction)` — continuous, monotonic, exponential. Discovered from an explainability commit, not a tuning session. One economic parameter (`min_edge`) derives trade gate, flip threshold, and position sizing. Validated on 652,362 candles across 6 years
- **Contrarian flip from discriminant conviction**: high discriminant confidence identifies trend extremes. 59.7% at q99, 60.3% in the 2022 bear market. Threshold self-derived from the conviction distribution
- **Self-supervised walk-forward validation**: no train/test split. Every candle is simultaneously training and test data. The 652k-candle run is a single unbroken walk-forward pass with online learning
- **Vocabulary as model**: 23 atoms added → 57% to 62%, same algorithm, same dimensions, same hyperparameters. The discriminant discovers which thoughts predict. The human's job is to name the thoughts
