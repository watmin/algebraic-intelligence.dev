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

At AWS, this architecture had a name nobody understood: "shield cognition." VSA-based anomaly detection that thinks about network traffic the way a security expert does. Not pattern matching. Cognition. Named relationships between packet fields, compositional encoding, discriminant-based detection. The pitch was rejected. No one understood what it meant to build a machine that thinks. The people with AI/ML backgrounds reached for neural networks and gradient descent — the only framework that existed in their vocabulary.

After leaving AWS, the tools became inaccessible but the ideas remained. Markets became the proving ground — not because I was a trader, but because markets provide an adequate reference metric for the underlying thesis: that structured cognition over named relationships outperforms generic pattern matching. The DDoS and trading domains are structurally identical. A DDoS attack is an anomaly on a trend line. A market reversal is the same signal in a different stream. The encoding is the same. The discrimination is the same. The conviction curve is the same. The only difference is the vocabulary — what thoughts the system thinks about the data.

BTC was the obvious choice. 652,608 five-minute candles from January 2019 to March 2025. Six years of 24/7 data — bull markets, bear markets, the COVID crash, the 2021 euphoria, the Luna implosion, the FTX collapse, the recovery. No exchange closures, no holidays, no gaps. And a pre-computed SQLite database with 20 indicators per candle: OHLCV, SMAs (20/50/200), Bollinger Bands, RSI, MACD, DMI/ADX, ATR.

---

## The Pixel Obsession

I need to be honest about this part. I didn't know this was going to work.

I'd tried this before — years ago, multiple times — and every attempt had burned. The ideas survived, unnamed and unimplementable, accumulating in conversations with Grok and in pitches that got blank stares. "Expert systems can't outperform LLMs," the people with ML backgrounds told me. The framing was wrong for the audience. The vocabulary didn't exist. I knew what I meant and couldn't make anyone else see it.

The viewport encoding was the obsession. A 48-candle chart rendered as a pixel grid, encoded as a 10,000-dimensional vector. The same encoding that worked for JSON documents and HTTP requests — surely it would capture the patterns a human trader sees in a chart. I was going to make the machine see what a trader sees.

The first commit (March 15) was a Python scaffold — harness, feed, and system modules — architecture borrowed directly from the DDoS sidecar, pointed at candle data instead of packet data. `OnlineSubspace` for manifold learning, `StripedSubspace` for crosstalk-free attribution, `EngramLibrary` for pattern memory.

What followed was about two weeks of bashing. Not the elegant, each-commit-lands-a-feature kind of development the DDoS posts describe. Messy, uncertain, exploratory bashing. The repo is still a mess from it — I'll clean it up later. The Python code sprawls across dozens of experimental scripts, dead ends, and abandoned approaches. I wasn't even sure I was going to show any of it. I spent days tuning the rendering, tweaking color tokens, trying different panel layouts, feeding it all through the learning pipeline.

Then I got annoyed with Python's performance. With 652k candles to walk through and dozens of encoding experiments to try, Python's throughput was the bottleneck. The pivot to Rust wasn't a clean architectural decision — it was frustration with watching progress bars crawl while the ideas were moving faster than the implementation could keep up.

---

## The Rust Trader (March 21)

The initial Rust implementation landed in one session: a self-supervised BTC walker with confidence gating, recognition rejection, and a separation gate. 1,615 lines. The `Journaler` struct — the learning agent — was the direct descendant of the DDoS sidecar's `SubspaceDetector`, repurposed for a stream of candle encodings instead of packet encodings.

From there: trader → trader2 (abandoned after two days) → trader3 (the active system). Each iteration simplified the architecture. trader3 dropped to 1,326 lines and a `Journal` struct of 238 lines — the cleanest code in the project.

The viewport encoding came with us to Rust. That was still the bet. We kept trying — many approaches, many configurations, many ways to make the pixel encoding produce a discriminant that separated winners from losers. It would adapt and get stuck. Feedback loops poisoned the prototypes. The accumulator would converge on shared candle structure instead of predictive structure. Every fix for one failure mode introduced another.

I genuinely thought the project was going to join the pile of attempts that burned in a fiery death.

---

## The Thought Breakthrough

The thought system was something I wanted badly but didn't know how to express. The "wat language" — the idea that you could encode expert cognition as named algebraic objects — had been living on my GitHub as a relic for about a year. An early attempt at something I couldn't build yet. I didn't know it would work here. I didn't know how to connect it to trading.

But with the visual approach failing and failing again, the question became unavoidable: what if the problem isn't the learning machinery? What if it's the encoding? What if a chart — no matter how faithfully captured — simply doesn't contain the signal a trader uses to predict?

A trader doesn't see pixels. They see an interpretation of pixels. "RSI is diverging." "Volume is contradicting the rally." "Close is near the range high." Those are named relationships with directional meaning. The raster grid is the medium. The information is in what the trader *notices*.

The thought encoder started rough. Named facts about the current market state, composed via Holon's bind/bundle algebra: `(above close sma20)`. `(crosses-below macd-line macd-signal)`. `(diverging close up rsi down @3)`. `(seg close up 0.0234 dur=12 @0 ago=0)`. Each fact is a compositional binding of atoms — role-filler pairs, the same mechanism that encodes `{dst_port: 80}` in the DDoS lab. The facts bundle into one 10,000-dimensional vector.

We molded the thought vocabulary quickly. PELT-based segment narratives replaced fixed-scale atoms. Continuous log-encoded magnitudes replaced discrete intensity levels. The vocabulary grew from a handful of comparisons to 120+ facts per candle. And every improvement to the thought encoder, we'd backport to visual and try again.

Visual never improved. The lesson was relearned many times.

---

## Two Encodings, One Algebra

trader3 now runs both systems in parallel — not because visual helps, but because the controlled comparison is too valuable to discard. Same vector space. Same learning machinery. Different inputs. The experiment that proves the thesis.

**Visual encoding**: a 48-candle OHLCV window rendered as a 4-panel raster grid — price with volume bars, RSI, MACD, DMI/ADX. 25 pixel rows per panel, 23 color tokens. Each pixel cell is a set of color tokens. The full viewport encodes as a 10,000-dimensional bipolar vector via positional binding — the same encoding that works for JSON documents, just applied to a pixel grid. **50.5%.**

**Thought encoding**: 120+ named facts about the current market state, composed via bind/bundle. Each fact is a compositional binding — role-filler pairs in the same algebra. The facts bundle into one 10,000-dimensional vector. **57–62%.**

Both encodings feed identical `Journal` instances. Two accumulators — buy and sell — collect evidence from candles labeled by what happened next. When price crosses a threshold (0.5% or ATR-based) within a 36-candle horizon, the candle gets labeled Buy or Sell. The journal accumulates the encoded vector into the appropriate accumulator, weighted by the magnitude of the move. Bigger moves teach more strongly.

Every 500 updates, the journal recalibrates: it computes the discriminant — `normalize(buy_proto − sell_proto)` — the direction in vector space that maximally separates the two class centroids. Prediction is one cosine against this discriminant. Positive = Buy, negative = Sell, magnitude = conviction.

One critical fix in the journal: **mean-stripping**. The buy and sell prototypes share ~90% of their structure — the shared candle patterns that appear in both up and down moves. Without stripping, the cosine is dominated by this shared structure and the discriminant signal drowns. The fix: at prediction time, subtract the mean of the two prototypes from the input before computing cosine. This removes the shared structure and leaves only the deviation that's informative for direction.

---

## Visual Doesn't Predict

Visual alone: **50.5% accuracy**. Barely above random. After weeks of trying.

Even after thought proved itself, we kept trying to save visual. Visual amplification — use visual conviction to boost thought's signal. No improvement; the convictions were correlated. Visual as a veto — skip trades where visual disagrees. Made it worse; the disagreement *was* the signal. Visual engrams — cluster winning visual vectors into pattern groups and recognize "chart patterns."

We ran the definitive analysis on visual engrams:

```
Win-Win cosine:  0.4031
Win-Loss cosine: 0.4026
Gap:             0.0004
```

There is no structure in the visual encoding that separates winning trades from losing trades. None. The most faithful possible representation of a price chart — every pixel, every color, every indicator line — contains no exploitable pattern for predicting direction.

The eigenvalue analysis confirmed it: BTC pixel encoding has a near-uniform variance distribution. No low-dimensional manifold. Unlike L7 HTTP traffic — which showed clear structure that CCIPCA could learn — the pixel encoding of price charts is diffuse. The encoding is faithful, but the underlying predictive signal is not geometric at the pixel level.

Visual still runs in trader3. We could drop it entirely — reclaim the compute budget, simplify the pipeline. We're in an iterative place now. It stays because the controlled comparison is the cleanest proof of the thesis: same algebra, same journal, same dimensions, same data. The only variable is the encoding. Pixels predict nothing. Named relationships predict 60%.

---

## Thought Predicts

Thought alone: **57.1% accuracy**. Real signal.

The gap — `d' = 0.734` separation between winning and losing thought vectors — exists because thought encoding captures *relationships*, not pixels. When a trader looks at a chart, they don't process a 25×48 grid of colored cells. They think: "RSI is diverging from price. Volume is declining on this rally. The MACD histogram is shrinking. This looks exhausted."

Those are named relationships with directional meaning. The raster grid is the medium. The information is in the extraction — the named facts, the predicates, the compositional structure of what the trader notices.

The visual encoder was a faithful camera. The thought encoder was the trader watching the camera feed and having opinions. The camera captured everything and predicted nothing. The opinions predicted 60% of reversals.

This is the fundamental insight: **you cannot build prediction from perception. You build it from cognition.** The encoding that works is not the one that captures the most data. It's the one that captures the most meaning.

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

### What this means

The thought vocabulary — the set of named facts the encoder evaluates — is the system's cognitive architecture. Different vocabularies produce different thoughts. Different thoughts produce different discriminants. Different discriminants produce different conviction-accuracy curves.

The vocabulary IS the model. The discriminant is learned. The threshold comes from one parameter. Everything reduces to: **what thoughts do you think about the market?**

A trader who uses Ichimoku thinks in clouds, tenkan-sen, kijun-sen. A Wyckoff trader thinks in accumulation phases, springs, upthrusts. An Elliott wave trader thinks in impulse and corrective waves. These aren't different algorithms. They're different thought programs. Each thought program is a vocabulary. Each vocabulary feeds a Journal. Each Journal develops a discriminant. Each discriminant produces a conviction-accuracy curve. The curves compete.

You don't design the winning expert. You encode every technical concept you can find — every indicator, every pattern, every named relationship that any school of trading has ever used. You create overlapping expert journals with different vocabulary subsets. You run the stream. The champions emerge.

### The nature of the atoms

The vectors are named. They are self-describing. They implement their own identity function.

The atom `"rsi"` isn't an arbitrary label attached to a random vector. It's a deterministic mapping: the same seed always produces the same vector. The name IS the vector. The vector IS the name. `VectorManager::get_vector("rsi")` returns the unique, reproducible geometric object that represents that concept in 10,000-dimensional space.

Thoughts can have linear relations. `encode_linear(rsi_value, scale)` produces a vector whose position on a continuous manifold represents the exact RSI reading. Two RSI values that are close produce similar vectors. The similarity IS the linear relation — embedded in the encoding, not computed after it. The scalar encoding implements the linear trait: nearby values → nearby vectors → high cosine → the discriminant can exploit the gradient.

Thoughts can be composed of thoughts. `bind(diverging, bind(close_up, rsi_down))` — a function applied to functions. `diverging` is a higher-order concept that takes two directional observations and produces a relational fact. The composition is algebraic, not procedural. There are no IF-THEN rules. There are no control flow branches. There is only binding and bundling — the two operations of a functional algebra over thoughts.

This is functional programming over cognition. Functions that take thoughts and return thoughts. Compositions that build complex concepts from simple ones. Evaluation by projection — the discriminant is the interpreter, the conviction is the return value. The vocabulary is the standard library. The expert's knowledge is the program.

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

The architecture is clean. The insight — cognition over perception — is proven. What remains is the discovery that makes it a *system*: the conviction-accuracy curve, the contrarian flip, and the reduction of everything to one economic parameter. Then the acid test: 652,362 candles across six years, every regime BTC has seen since January 2019.

---

## Likely Contributions to the Field

- **Visual vs. thought encoding as a controlled experiment**: same vector space, same learning machinery, same dimensionality, same data — the only variable is the encoding. Visual (pixel-faithful) achieves 50.5%. Thought (named compositional facts) achieves 57%. The gap is not in the learning algorithm or the data. It's in the encoding — which relationships you choose to name
- **PELT segment narrative as a VSA encoding primitive**: using change-point detection on raw indicator streams to produce compositional facts (indicator × direction × magnitude × duration × temporal position), replacing fixed-scale trending/reversal atoms with continuous log-encoded magnitudes. The segment narrative is regime-invariant — the same encoding structure works across bull, bear, and choppy markets
- **Journal as a modality-agnostic learning agent**: a 238-line struct that handles any encoding modality via two accumulators, one discriminant, and one cosine — proven on both raster grids and compositional fact vectors without modification
