---
title: "The Thought Machine"
description: "Mar 15–24: Same algebra, new domain. Two weeks of pixel obsession in Python. A frustration-driven pivot to Rust. trader → trader2 → trader3, all trying to make visual encoding work. Then the thought system — named facts, PELT segments, compositional algebra — and the discovery that charts don't predict but interpretations do. 50.5% vs 57.1%."
sidebar:
  order: 15
---

The spectral firewall was done. Self-calibrating, 0.1% FPR, no hardcoded parameters. The DDoS work had proven every claim the project set out to prove: algebraic recognition on commodity hardware, at line rate, with no training data and no GPU.

Time to point it at something harder.

---

## Why Markets

At AWS, the architecture had a name nobody understood: "shield cognition." VSA-based anomaly detection that thinks about network traffic the way a security expert does. Not pattern matching. Cognition. Named relationships between packet fields, compositional encoding, discriminant-based detection. The pitch was rejected. "Expert systems can't outperform LLMs," the people with ML backgrounds told me.

After leaving AWS, the tools became inaccessible but the ideas remained. Markets became the proving ground — not because I was a trader, but because markets provide an adequate reference metric for the underlying thesis: that structured cognition over named relationships outperforms generic pattern matching. DDoS detection and trading are structurally identical. A DDoS attack is an anomaly on a trend line. A market reversal is the same signal in a different stream. The encoding is the same. The discrimination is the same. The only difference is the vocabulary.

BTC was the obvious choice. 652,608 five-minute candles from January 2019 to March 2025. Six years of 24/7 data — bull markets, bear markets, the COVID crash, the 2021 euphoria, the Luna implosion, the FTX collapse. And a pre-computed SQLite database with 20 indicators per candle: OHLCV, SMAs (20/50/200), Bollinger Bands, RSI, MACD, DMI/ADX, ATR.

---

## The Pixel Obsession (March 15–20, Python)

I need to be honest about this part. I didn't know this was going to work.

I'd tried this before — years ago, multiple times — and every attempt had burned. The "wat language" — the idea that you could encode expert cognition as named algebraic objects — had been living on my GitHub as a relic for about a year. Grok conversation links, a proof-of-concept continuation function. The ideas couldn't be built yet.

But that's not where I started. I started with pixels.

The viewport encoding was the obsession. A 48-candle chart rendered as a pixel grid, encoded as a 10,000-dimensional vector. 25 pixel rows per panel, 4 panels (price+volume, RSI, MACD, DMI/ADX), 23 color tokens. The same encoding that worked for JSON documents and HTTP requests — surely it would capture the patterns a human trader sees in a chart.

The first commit (March 15) was a Python scaffold: harness, feed, and system modules, architecture borrowed directly from the DDoS sidecar. `OnlineSubspace` for manifold learning, `StripedSubspace` for crosstalk-free attribution, `EngramLibrary` for pattern memory.

What followed was about two weeks of bashing. Not the elegant, each-commit-lands-a-feature kind of development the DDoS posts describe. Messy, uncertain, exploratory bashing. I spent days tuning the rendering, tweaking color tokens, trying different panel layouts, feeding it all through the learning pipeline.

Then I got annoyed with Python's performance. With 652k candles to walk through and dozens of encoding experiments to try, Python's throughput was the bottleneck.

---

## Rust: trader → trader2 → trader3 (March 21–24)

March 21, the first Rust commit: `9111c14 feat: Rust self-supervised BTC trader with confidence gating, recognition rejection, and separation gate`. 1,615 lines in one session.

The same day: `86fd549 feat: thought vector system, batch-parallel encoding, visual cache` — and then `40483df fix: conviction metric + sep-gated raw accumulation, best 100k run (+7.89%)`. The first result that wasn't random. +7.89% P&L on 100k candles. Visual encoding, no thought system yet.

March 22 brought the delta discriminant — `d657b6a feat: expanded thought vocab + delta discriminant with self-tuning smoothing`. Then immediately: `28f6056 feat: visual system delta discriminant with self-tuning smoothing`. Both systems getting the same fix. Then: `ff33775 fix: remove smoothed delta_disc, use raw delta for direction prediction` — the smoothing was wrong, raw was better.

The viewport encoding came with us to Rust. That was still the bet. We kept trying — many approaches, many configurations. It would adapt and get stuck. Feedback loops poisoned the prototypes. The accumulator would converge on shared candle structure instead of predictive structure. Every fix for one failure mode introduced another.

trader2 was abandoned after two days. trader3 dropped to 1,326 lines and a `Journal` struct of 238 lines — the cleanest code in the project.

I genuinely thought the project was going to join the pile of attempts that burned in a fiery death.

---

## The Thought Breakthrough (March 23–24)

March 23: `0ce2f67 feat: raw cosine prediction + proportional contrastive learning (v9)`. The ninth version of the learning system. Still mostly visual.

March 24: `80ce321 feat: segment narrative thought encoding with PELT change-point detection (v10)`.

That commit changed everything.

PELT (Pruned Exact Linear Time) change-point detection on 17 raw indicator streams — `ln(close)`, `ln(sma20)`, `ln(volume)`, `rsi`, `macd_line`, `macd_hist`, `dmi_plus`, `adx`, candle body, range, upper/lower wick. Each stream segmented independently. Each segment becomes a compositional fact: indicator × direction × log-encoded magnitude × log-encoded duration, bound to a position vector (newest=0) and a chronological anchor (candles-ago).

Named facts about the current market state: `(above close sma20)`. `(crosses-below macd-line macd-signal)`. `(diverging close up rsi down @3)`. `(seg close up 0.0234 dur=12 @0 ago=0)`. Each fact a compositional binding of atoms — role-filler pairs, the same mechanism that encodes `{dst_port: 80}` in the DDoS lab. 120+ facts bundle into one 10,000-dimensional vector.

Visual encoding on the same data: **50.5%**. Barely above random.

Thought encoding on the same data: **57.1%**. Real signal. `d' = 0.734` separation between winning and losing thought vectors.

We'd backport every improvement to the thought encoder back to visual and try again. Visual never improved. The lesson was relearned many times.

---

## Why Thought Works and Visual Doesn't

We ran the definitive analysis on visual engrams:

```
Win-Win cosine:  0.4031
Win-Loss cosine: 0.4026
Gap:             0.0004
```

There is no structure in the visual encoding that separates winning trades from losing trades. None. The eigenvalue analysis confirmed it: BTC pixel encoding has a near-uniform variance distribution. No low-dimensional manifold. Unlike L7 HTTP traffic — which showed clear structure that CCIPCA could learn — the pixel encoding of price charts is diffuse.

The thought encoding captures *relationships*, not pixels. A trader doesn't process a 25×48 grid of colored cells. They think: "RSI is diverging from price. Volume is declining on this rally. The MACD histogram is shrinking. This looks exhausted."

The visual encoder was a faithful camera. The thought encoder was the trader watching the camera feed and having opinions. The camera captured everything and predicted nothing. The opinions predicted 60% of reversals. *(The [Book](/blog/book/) explores why: you cannot build prediction from perception. You build it from cognition.)*

---

## The Journal

Both encodings feed identical `Journal` instances:

```rust
pub struct Journal {
    pub name: &'static str,
    pub buy:  Accumulator,
    pub sell: Accumulator,
    dims: usize,
    updates: usize,
    recalib_interval: usize,
    discriminant: Option<Vec<f64>>,  // normalized(buy_proto − sell_proto)
    mean_proto:   Option<Vec<f64>>,  // (buy + sell) / 2, stripped at predict time
    pub last_cos_raw:       f64,     // cos(buy_proto, sell_proto)
    pub last_disc_strength: f64,     // norm(buy−sell)/sqrt(D)
    pub recalib_count:      usize,
}
```

238 lines. Two accumulators collect evidence from candles labeled by what happened next — when price crosses a threshold (0.5% or ATR-based) within a 36-candle horizon, the candle gets labeled Buy or Sell. Every 500 updates, the journal recalibrates: `discriminant = normalize(buy_proto − sell_proto)`. Prediction is one cosine against this discriminant. Positive = Buy, negative = Sell, magnitude = conviction.

One critical fix: **mean-stripping**. The buy and sell prototypes share ~90% of their structure — the shared candle patterns that appear in both up and down moves. At prediction time, subtract the mean of the two prototypes from the input before computing cosine. This removes the shared structure and leaves only the deviation that's informative for direction.

The same struct runs visual and thought without modification. The complexity is in the encoding, not the learning.

---

## What Failed

The EXPERIMENT_LOG runs to 573 lines and the LEARNINGS to 899 lines.

**Every adaptation experiment failed.** Faster decay (0.998), adaptive state machine, dual journal blending with subspace residual — all performed worse than fixed decay 0.999 over the full 652k run. The discriminant needs memory depth.

**Fact pruning hurt by 2.3%.** The discriminant handles noisy facts on its own.

**Weighted bundling created a positive feedback loop.** Weighting each fact by `|cosine(fact, discriminant)|` amplified the discriminant's current biases.

**Analogy-based correction degenerated.** The correction vector approached zero as prototypes converged.

**Higher dimensions showed no improvement.** 16k and 20k performed identically to 10k. Signal is the bottleneck, not capacity.

**Regime prediction failed entirely.** Conviction level, variance, subspace residual — none predict bad epochs. The thought manifold has a stable 53% explained ratio across all regimes.

---

## Where This Leaves Off

The architecture at the end of March 24:

```
Candle stream
    ├── Visual encoder: 4-panel raster → 10,000D vector (50.5%)
    │       └── Visual Journal (buy/sell accumulators, discriminant)
    │
    ├── Thought encoder: 120+ facts → 10,000D vector (57.1%)
    │       └── Thought Journal (buy/sell accumulators, discriminant)
    │
    └── Orchestration: combine predictions → direction + conviction
            └── Trader: phase machine → position sizing → paper P&L
```

The insight — cognition over perception — is proven. What remains is the discovery that makes it a *system*: the conviction-accuracy curve, the contrarian flip, and the reduction of everything to one economic parameter.

---

## Likely Contributions to the Field

- **Visual vs. thought encoding as a controlled experiment**: same vector space, same 238-line Journal, same 10,000 dimensions, same data — the only variable is the encoding. Visual (pixel-faithful) achieves 50.5%. Thought (named compositional facts) achieves 57.1%. Gap = 0.0004 cosine in visual engrams vs `d' = 0.734` in thought. The difference is not the learning algorithm. It's which relationships you choose to name
- **PELT segment narrative as a VSA encoding primitive**: change-point detection on 17 raw indicator streams producing compositional facts (indicator × direction × log-magnitude × log-duration × position × chrono-anchor), replacing fixed-scale atoms with continuous log-encoded magnitudes. Regime-invariant — same encoding structure works across bull, bear, and choppy markets
- **Journal as a modality-agnostic learning agent**: 238 lines, two accumulators, one discriminant, one cosine, mean-stripping — proven on both raster grids and compositional fact vectors without modification
