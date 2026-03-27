---
title: "The Thought Machine"
description: "Mar 15–24: Same algebra, new domain. A self-supervised BTC trader discovers that charts don't predict — interpretations predict. Visual encoding captures every pixel faithfully and achieves 50.5%. Thought encoding — 120 named facts per candle — achieves 57%. The signal was never in the data. It was in the vocabulary."
sidebar:
  order: 15
---

The spectral firewall was done. Self-calibrating, 0.1% FPR, no hardcoded parameters. The DDoS work had proven every claim the project set out to prove: algebraic recognition on commodity hardware, at line rate, with no training data and no GPU.

Time to point it at something harder.

---

## Why Markets

The database idea that started Holon — structural sub-document queries on JSON — had never been the real goal. It was the proof-of-concept that the encoding worked. The DDoS lab was the first domain where the encoding *mattered*. Markets were the second.

Not because I'm a trader. I'm not. I'd been staring at charts for a decade, not as a trader but as a thinker — trying to understand why some interpretations predict and others don't. Every guess was a miss. The intuitions were there but couldn't be debugged. You can't set a breakpoint in your own thought process. You can't inspect the call stack of a hunch.

The structural claim I wanted to test: expert systems built from compositional vector algebra can outperform generic pattern matching. DDoS detection proved this for network traffic — named relationships between packet fields, compositional encoding, discriminant-based detection. Markets were the harder test — the same architecture, the same algebra, different thoughts.

BTC was the obvious choice. 652,608 five-minute candles from January 2019 to March 2025. Six years of 24/7 data — bull markets, bear markets, the COVID crash, the 2021 euphoria, the Luna implosion, the FTX collapse, the recovery. No exchange closures, no holidays, no gaps. And a pre-computed SQLite database with 20 indicators per candle: OHLCV, SMAs (20/50/200), Bollinger Bands, RSI, MACD, DMI/ADX, ATR.

---

## The Python Scaffold (March 15)

The first commit was a Python scaffold — harness, feed, and system modules — following the same "build it in Python first" pattern from the VSA library. The architecture borrowed directly from the DDoS sidecar: `OnlineSubspace` for manifold learning, `StripedSubspace` for crosstalk-free attribution, `EngramLibrary` for pattern memory.

By the end of that day: a working consumer→critic→hotreload loop with a replay feed, field attribution via subspace residuals, and a reversal labeling scheme. The geometry validation scripts confirmed that the vector space was populated correctly.

But the Python experiments hit the same wall the DDoS Python code had hit months earlier: too slow for the iteration rate the domain required. With 652k candles to walk through and dozens of encoding experiments to try, Python's throughput was the bottleneck.

The Rust port started six days later.

---

## The Rust Trader (March 21)

The initial Rust implementation landed in one session: a self-supervised BTC walker with confidence gating, recognition rejection, and a separation gate. 1,615 lines. The `Journaler` struct — the learning agent — was the direct descendant of the DDoS sidecar's `SubspaceDetector`, repurposed for a stream of candle encodings instead of packet encodings.

From there: trader → trader2 (abandoned after two days) → trader3 (the active system). Each iteration simplified the architecture. trader3 dropped to 1,326 lines and a `Journal` struct of 238 lines — the cleanest code in the project.

---

## Two Encodings, One Algebra

trader3 runs two parallel encoding systems. Same vector space. Same learning machinery. Different inputs.

**Visual encoding**: a 48-candle OHLCV window rendered as a 4-panel raster grid — price with volume bars, RSI, MACD, DMI/ADX. 25 pixel rows per panel, 23 color tokens (green/red solid, green/red wick, doji, SMA lines in three colors, Bollinger Bands, volume bars, RSI zones, MACD histogram, DMI lines). Each pixel cell is a set of color tokens. The full viewport encodes as a 10,000-dimensional bipolar vector via positional binding — the same encoding that works for JSON documents, just applied to a pixel grid.

**Thought encoding**: 120+ named facts about the current market state, composed via Holon's bind/bundle algebra. `(above close sma20)`. `(crosses-below macd-line macd-signal)`. `(diverging close up rsi down @3)`. `(seg close up 0.0234 dur=12 @0 ago=0)`. Each fact is a compositional binding of atoms — role-filler pairs, the same mechanism that encodes `{dst_port: 80}` in the DDoS lab. The facts bundle into one 10,000-dimensional vector.

Both encodings feed identical `Journal` instances. Two accumulators — buy and sell — collect evidence from candles labeled by what happened next. When price crosses a threshold (0.5% or ATR-based) within a 36-candle horizon, the candle gets labeled Buy or Sell. The journal accumulates the encoded vector into the appropriate accumulator, weighted by the magnitude of the move. Bigger moves teach more strongly.

Every 500 updates, the journal recalibrates: it computes the discriminant — `normalize(buy_proto − sell_proto)` — the direction in vector space that maximally separates the two class centroids. Prediction is one cosine against this discriminant. Positive = Buy, negative = Sell, magnitude = conviction.

One critical fix in the journal: **mean-stripping**. The buy and sell prototypes share ~90% of their structure — the shared candle patterns that appear in both up and down moves. Without stripping, the cosine is dominated by this shared structure and the discriminant signal drowns. The fix: at prediction time, subtract the mean of the two prototypes from the input before computing cosine. This removes the shared structure and leaves only the deviation that's informative for direction.

---

## Visual Doesn't Predict

Visual alone: **50.5% accuracy**. Barely above random.

We tried everything to make it work. Visual amplification — use visual conviction to boost thought's signal. No improvement; the convictions were correlated. Visual as a veto — skip trades where visual disagrees. Made it worse; the disagreement was the signal. Visual engrams — cluster winning visual vectors into pattern groups and recognize "chart patterns."

We ran the analysis on visual engrams. The result:

```
Win-Win cosine:  0.4031
Win-Loss cosine: 0.4026
Gap:             0.0004
```

There is no structure in the visual encoding that separates winning trades from losing trades. None. The most faithful possible representation of a price chart — every pixel, every color, every indicator line — contains no exploitable pattern for predicting direction.

The eigenvalue analysis from the LEARNINGS.md stress tests confirmed it: BTC pixel encoding has a near-uniform variance distribution. No low-dimensional manifold. Unlike L7 HTTP traffic — which showed clear structure that CCIPCA could learn — the pixel encoding of price charts is diffuse. The encoding is faithful, but the underlying predictive signal is not geometric at the pixel level.

---

## Thought Predicts

Thought alone: **57.1% accuracy**. Real signal.

The gap — `d' = 0.734` separation between winning and losing thought vectors — exists because thought encoding captures *relationships*, not pixels. When a trader looks at a chart, they don't process a 25×48 grid of colored cells. They think: "RSI is diverging from price. Volume is declining on this rally. The MACD histogram is shrinking. This looks exhausted."

Those are named relationships with directional meaning. The raster grid is the medium. The information is in the extraction.

### The thought vocabulary (v10)

**17 PELT segment streams**: PELT (Pruned Exact Linear Time) change-point detection runs on raw scalar values — `ln(close)`, `ln(sma20)`, `ln(volume)`, `rsi`, `macd_line`, `macd_hist`, `dmi_plus`, `adx`, candle body, range, upper/lower wick. Each stream is segmented independently. Each segment becomes a fact: indicator × direction × log-encoded magnitude × log-encoded duration, bound to a position vector (newest=0) and a chronological anchor (candles-ago). Zone states at segment boundaries — `(zone rsi overbought beginning @0)` — scope zone checks to structurally relevant moments.

**40+ comparison pairs**: `close` vs each SMA, vs Bollinger Bands, MACD line vs signal, DMI+ vs DMI-, cross-candle (high vs prev-high, close vs prev-close), intra-candle structure (upper-wick vs body, body vs range, range vs ATR). Each pair produces above/below, and when a previous candle exists: crosses-above, crosses-below, touches, bounces-off.

**Derived indicators**: Ichimoku Cloud (tenkan-sen, kijun-sen, senkou spans, cloud position), Stochastic Oscillator (%K vs %D, overbought/oversold), Fibonacci retracement (proximity to 0.236/0.382/0.500/0.618/0.786 levels), volume analysis (OBV, volume SMA, spike/drought detection), Keltner Channels (squeeze detection via BB vs Keltner), ROC, CCI, consecutive up/down bars, inside/outside bars, gap detection.

**Divergence detection**: PELT segments on `ln(close)` identify peaks (up→down boundary) and troughs (down→up). Consecutive peak pairs where price made a higher high but RSI made a lower high produce `(diverging close up rsi down @N)`. Same for bullish divergence at troughs.

**Volume confirmation**: PELT direction of `ln(close)` vs PELT direction of `ln(volume)`. Same direction → `(confirming volume close)`. Opposite → `(contradicting volume close)`.

**Calendar facts**: day of week, 4-hour block, trading session (Asian/European/US/off-hours). BTC moves differently on weekends and during session overlaps.

**Temporal binding**: Golden/death crosses and MACD crosses in the recent lookback window, bound to segment distance — how many structural boundaries ago the event occurred.

**Range position**: linear scalar encoding of where current close sits within the viewport's high-low range. 0.0 = range low, 1.0 = range high. The discriminant learns that positions near extremes predict differently than positions in the middle.

All facts bundle into one 10,000-dimensional bipolar vector via majority-vote addition. The thought vector is a superposition of 120+ simultaneous statements about the market.

---

## What Failed

The project documented failures as thoroughly as successes. The EXPERIMENT_LOG runs to 573 lines and the LEARNINGS to 899 lines.

**Every adaptation experiment failed.** Faster decay (0.998), adaptive state machine (switch between 0.999 and 0.995 based on flip-zone win rate), dual journal blending with subspace residual — all performed worse than fixed decay 0.999 over the full 652k run. The discriminant needs memory depth. Every attempt to react to regime transitions costs more in stable periods than it gains during the transition.

**Fact pruning hurt.** Removing always-true facts (fire-rate suppression for facts firing >90% of the time) reduced accuracy by 2.3%. The discriminant is more robust to noise than expected — it handles constant facts on its own.

**Weighted bundling created a positive feedback loop.** Weighting each fact by `|cosine(fact, discriminant)|` before bundling was supposed to suppress noise and amplify signal. Instead, it created a reinforcement cycle where the discriminant's current biases were amplified, reducing its ability to adapt.

**Analogy-based correction degenerated.** Using the `analogy` primitive to transfer corrections from one class to another worked initially but degraded as the prototypes converged — the correction vector approached zero.

**Blend-based gentle correction broke the load-bearing path.** Replacing `negate/amplify` with softer `blend` operations lost the sharpness that the discriminant needed.

**Higher dimensions showed no improvement.** 16k and 20k dimensions performed identically to 10k. Signal is the bottleneck, not vector capacity.

**Regime prediction failed entirely.** Conviction level, variance, subspace residual — none predict bad epochs. The thought manifold has a stable 53% explained ratio and consistent eigenvalue structure across all regimes. The data structure doesn't change between regimes. Only the discriminant direction shifts.

---

## The Architecture

What survived all the experiments is clean:

```
Candle stream
    ├── Visual encoder: 4-panel raster → 10,000D vector
    │       └── Visual Journal (buy/sell accumulators, discriminant)
    │
    ├── Thought encoder: 120+ facts → 10,000D vector
    │       └── Thought Journal (buy/sell accumulators, discriminant)
    │
    └── Orchestration: combine predictions → direction + conviction
            └── Trader: phase machine → position sizing → paper P&L
```

The `Journal` struct is the core primitive. 238 lines. It handles any encoding modality — the same struct runs visual and thought without modification. Two accumulators, one discriminant, one cosine. The complexity is in the encoding, not the learning.

The thought encoder (`thought.rs`, 1,870 lines) is the vocabulary — every technical concept encoded as compositional vector algebra. The viewport renderer (`viewport.rs`, 428 lines) is the camera. The journal doesn't know or care which one produced the vector.

trader3 (`trader3.rs`, 1,326 lines) is the orchestration: batch-parallel encoding (visual and thought in separate rayon passes), sequential predict→buffer→learn→expire, SQLite logging of every prediction and outcome. The run database captures everything needed for post-hoc analysis — candle_log, recalib_log, disc_decode, trade_facts, trade_vectors, subspace_log.

---

## Where This Leaves Off

Two posts remain. The first covers the discovery that changes everything: the conviction-accuracy curve, the contrarian flip, and the reduction of the entire system to one economic parameter. The second covers the 652k-candle validation across six years — the acid test.

What's already clear: the same algebra that detects DDoS attacks and blocks vulnerability scanners also predicts market reversals. Not because it's an AI that "understands" markets. Because the geometry of compositional vector algebra — bind, bundle, cosine — doesn't care what the vectors represent. It cares about which named relationships separate the classes. In network security, the classes are "normal" and "attack." In markets, the classes are "price went up" and "price went down." The vocabulary changes. The algebra doesn't.

---

## Likely Contributions to the Field

- **Visual vs. thought encoding as a controlled experiment**: same vector space, same learning machinery, same dimensionality, same data — the only variable is the encoding. Visual (pixel-faithful) achieves 50.5%. Thought (named compositional facts) achieves 57%. The gap is not in the learning algorithm or the data. It's in the encoding — which relationships you choose to name
- **PELT segment narrative as a VSA encoding primitive**: using change-point detection on raw indicator streams to produce compositional facts (indicator × direction × magnitude × duration × temporal position), replacing fixed-scale trending/reversal atoms with continuous log-encoded magnitudes. The segment narrative is regime-invariant — the same encoding structure works across bull, bear, and choppy markets
- **Journal as a modality-agnostic learning agent**: a 238-line struct that handles any encoding modality via two accumulators, one discriminant, and one cosine — proven on both raster grids and compositional fact vectors without modification
