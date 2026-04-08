---
title: "The Thought Machine"
description: "Mar 15–24: Same algebra, new domain. Two weeks of pixel obsession in Python. A frustration-driven pivot to Rust. trader → trader2 → trader3, all trying to make visual encoding work. Then v10 — PELT segments, 17 indicator streams, 120+ named facts. 50.5% vs 57.1%. The signal was never in the data. It was in the vocabulary."
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

The viewport encoding was the obsession. A 48-candle chart rendered as a pixel grid, encoded as a 10,000-dimensional vector. 25 pixel rows per panel, 4 panels (price+volume, RSI, MACD, DMI/ADX), 23 color tokens — green/red solid bodies, green/red wicks, doji, SMA lines in three colors, Bollinger Bands, volume bars, RSI zones, MACD histogram, DMI lines. The same encoding that worked for JSON documents and HTTP requests — surely it would capture the patterns a human trader sees in a chart.

The first commit (`b766690`, March 15) was a Python scaffold: harness, feed, and system modules, architecture borrowed directly from the DDoS sidecar. `OnlineSubspace` for manifold learning, `StripedSubspace` for crosstalk-free attribution, `EngramLibrary` for pattern memory. 101 passing unit tests on the first day.

What followed was about two weeks of bashing. Not the elegant, each-commit-lands-a-feature kind of development the DDoS posts describe. Messy, uncertain, exploratory bashing. I spent days tuning the rendering, tweaking color tokens, trying different panel layouts, feeding it all through the learning pipeline.

Then I got annoyed with Python's performance. With 652k candles to walk through and dozens of encoding experiments to try, Python's throughput was the bottleneck. 24 candles per second. The pivot to Rust wasn't a clean architectural decision — it was frustration with watching progress bars crawl.

---

## Rust: trader → trader2 → trader3 (March 21–25)

March 21. The first Rust commit:

`9111c14 feat: Rust self-supervised BTC trader with confidence gating, recognition rejection, and separation gate`

1,615 lines in one session. The `Journaler` struct — the learning agent — was the direct descendant of the DDoS sidecar's `SubspaceDetector`, repurposed for candle encodings instead of packet encodings.

The same day: `86fd549 feat: thought vector system, batch-parallel encoding, visual cache` — batch-parallel encoding via rayon, throughput from 24/s to 75/s. The `VisualCache` pre-computed atom and position vectors to eliminate cloning in the hot loop.

Then: `40483df fix: conviction metric + sep-gated raw accumulation, best 100k run (+7.89%)`. The first result that wasn't random. +7.89% P&L on 100k candles. But the commit message tells the real story:

> Thought vectors are compositionally self-similar, so ungated raw adds caused cos(buy,sell) to explode from 0.79→0.99 between 30-40k candles. Gate delays cascade onset by ~10k candles... Cascade still occurs at 40-50k — needs further work.

The prototypes were converging. The buy and sell accumulators were becoming identical because every candle looks mostly the same — the shared structure dominates. Without gating, the discriminant collapsed. The +7.89% was real but fragile.

The viewport encoding came with us to Rust. That was still the bet. trader → trader2 (abandoned after two days) → trader3. Each iteration simplified the architecture. trader3 dropped to 1,326 lines and a `Journal` struct of 238 lines.

trader3's commit message (`915487c`) is worth quoting:

> P&L bug fixed: record_trade now uses outcome_pct (signed price return at first threshold crossing), not peak_abs_pct. Previous +228% was fiction.

The +228% from an earlier run was a lie — the P&L calculation used the peak absolute price change instead of the actual directional return. The fix dropped the headline number from +228% to +5.49%. Honest numbers are smaller numbers. But +5.49% with 53.6% win rate on 10,539 trades was real.

I genuinely thought the project was going to join the pile of attempts that burned in a fiery death.

---

## v10: The Thought Breakthrough (March 23–24)

March 23: `0ce2f67 feat: raw cosine prediction + proportional contrastive learning (v9)`. The ninth version of the learning system.

March 24: `80ce321 feat: segment narrative thought encoding with PELT change-point detection (v10)`.

That commit changed everything. The commit message runs to 30 lines. Here's what it did:

PELT (Pruned Exact Linear Time) change-point detection on 17 raw indicator streams — `ln(close)`, `ln(sma20)`, `ln(volume)`, `rsi`, `macd_line`, `macd_hist`, `dmi_plus`, `adx`, candle body, range, upper/lower wick. Each stream segmented independently. Each segment becomes a compositional fact: indicator × direction × log-encoded magnitude × log-encoded duration, bound to a position vector (newest=0) and a chronological anchor (candles-ago). Zone states at segment boundaries — `(zone rsi overbought beginning @0)`.

Named facts about the current market state: `(above close sma20)`. `(crosses-below macd-line macd-signal)`. `(diverging close up rsi down @3)`. `(seg close up 0.0234 dur=12 @0 ago=0)`. Each fact a compositional binding of atoms — role-filler pairs, the same mechanism that encodes `{dst_port: 80}` in the DDoS lab. 120+ facts bundle into one 10,000-dimensional vector.

What it replaced: fixed-scale trending/reversal atoms, discrete intensity levels (low/medium/high), the `IndicatorStreams` vector encoding pipeline. All removed. Continuous log-encoded magnitudes and PELT-derived structural segments replaced everything.

---

## Visual Doesn't Predict

Visual alone: **50.5% accuracy**. Barely above random. After weeks of trying.

Even after thought proved itself, we kept trying to save visual. Visual amplification. Visual as a veto. Visual engrams — cluster winning visual vectors into pattern groups and recognize "chart patterns."

The definitive analysis (`75c873a`):

```
Win-Win cosine:  0.4031
Win-Loss cosine: 0.4026
Gap:             0.0004
```

There is no structure in the visual encoding that separates winning trades from losing trades. None. The commit message is blunt: "Charts don't predict; interpretations of charts predict. Visual engrams are a dead end."

The eigenvalue analysis confirmed it: thought vectors have `d' = 0.734` separation and 2.4× more structural variation than visual. The thought manifold is regime-invariant — explained ratio stable at 53%, eigenvalues stable across all regimes. Only the discriminant direction shifts. The data structure doesn't change between bull and bear. The separation direction does.

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

238 lines. Two accumulators collect evidence from candles labeled by what happened next — when price crosses a threshold (0.5% or ATR-based) within a 36-candle horizon. Every 500 updates, the journal recalibrates: `discriminant = normalize(buy_proto − sell_proto)`. Prediction is one cosine against this discriminant.

The critical fix: **mean-stripping**. The buy and sell prototypes share ~90% of their structure. Without stripping, `cos(buy, sell)` was 0.99 — the discriminant signal drowned in shared candle structure. The fix: subtract `(buy + sell) / 2` from the input before the cosine. This removes the shared structure and leaves only the deviation that's informative for direction.

The same struct runs visual and thought without modification. The complexity is in the encoding, not the learning.

---

## What Failed

The EXPERIMENT_LOG runs to 573 lines and the LEARNINGS to 899 lines. Every failure documented.

**The prototype convergence cascade** (`40483df`): ungated accumulation caused `cos(buy, sell)` to explode from 0.79 to 0.99 over 10k candles. The buy and sell prototypes became identical. Sep-gating delayed the cascade but didn't prevent it. The mean-stripping fix in trader3 addressed it properly — subtract the shared structure instead of trying to prevent accumulation.

**Every adaptation experiment failed.** Faster decay (0.998), adaptive state machine, dual journal blending with subspace residual — all worse than fixed 0.999. The discriminant needs memory depth.

**Fact pruning hurt by 2.3%.** The discriminant handles noisy facts on its own.

**Weighted bundling created a positive feedback loop.** The discriminant's biases were amplified instead of corrected.

**Higher dimensions showed no improvement.** 16k and 20k identical to 10k. Signal is the bottleneck, not capacity.

**The +228% P&L lie** (`915487c`): `peak_abs_pct` instead of `outcome_pct`. Fiction. The honest number was +5.49%.

---

## Where This Leaves Off

```
Candle stream
    ├── Visual encoder: 4-panel raster → 10,000D vector (50.5%)
    │       └── Visual Journal
    │
    ├── Thought encoder: 120+ PELT facts → 10,000D vector (57.1%)
    │       └── Thought Journal
    │
    └── Orchestration → Trader → paper P&L
```

Thought alone: **57.1%**. Real signal. `d' = 0.734`. But 57.1% with zero selectivity — trading every candle — is a thin edge. The question: is there a way to know *when* the system is right?

*(The deeper meaning — cognition over perception, the vocabulary IS the model, functional programming over thought — is in [The Book](/blog/book/).)*

---

## Likely Contributions to the Field

- **Visual vs. thought encoding as a controlled experiment**: same 238-line Journal, same 10,000 dimensions, same data — the only variable is the encoding. Visual: 50.5%, gap=0.0004. Thought: 57.1%, `d'=0.734`. The gap is not the algorithm. It's the encoding.
- **PELT segment narrative as a VSA encoding primitive**: change-point detection on 17 raw indicator streams producing compositional facts (indicator × direction × log-magnitude × log-duration × position × chrono-anchor). Regime-invariant — explained ratio stable at 53% across bull, bear, and choppy markets
- **Mean-stripping for prototype blurring**: subtracting `(buy + sell) / 2` from the input before cosine to remove ~90% shared candle structure — the fix for the prototype convergence cascade that destroyed discriminant signal
