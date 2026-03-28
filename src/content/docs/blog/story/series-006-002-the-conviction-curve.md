---
title: "The Conviction Curve"
description: "Mar 25–27: The exponential relationship between conviction and accuracy. The contrarian flip. One economic parameter. 59.7% at q99 over 100k candles. Then the acid test: 652k candles, six years, every regime — 56.5% with 84 atoms, 62.1% with 107. The curve judges. The vocabulary is the model."
sidebar:
  order: 16
---

The thought encoder works. 57.1% accuracy with 120+ named facts per candle, against a visual encoder that captures every pixel faithfully and achieves nothing. The signal is in the interpretation, not the data.

But 57.1% with zero selectivity — trading every candle — is a thin edge. The question: is there a way to know *when* the system is right?

---

## The Flip

The discriminant learns what trend extremes look like. It accumulates Buy evidence from candles that preceded up moves and Sell evidence from candles that preceded down moves. At a 36-candle horizon (3 hours at 5-minute resolution), established trends are frequently exhausted. The system learns the shape of continuation — and when it's highly confident about continuation, it's identifying the exact moment when the trend is most likely to reverse.

High conviction about continuation = trend extreme = reversal likely.

The contrarian flip: when conviction exceeds a threshold, reverse the predicted direction. The system doesn't predict reversals directly. It identifies trend extremes with high confidence, and the flip converts that into a reversal trade.

The threshold is data-driven. A rolling window of recent conviction values (recalib_interval × 100 candles, roughly 6 months) tracks the conviction distribution. In `quantile` mode, the flip fires at the `flip_quantile` percentile — default 85th, meaning the top 15% of conviction predictions get flipped. In `auto` mode, the threshold is derived from the conviction-accuracy curve itself.

---

## The Curve

The relationship between conviction and accuracy follows an exponential:

```
accuracy = 0.50 + a × exp(b × conviction)
```

Three phases:

- **Noise zone** (conviction 0.00–0.13): 50.3% accuracy. The discriminant's cosine is indistinguishable from random. The thought vector contains facts, but they're not voting coherently in any direction.

- **Linear zone** (0.14–0.22): 54.5%. Signal emerges. Enough facts are aligned to shift the cosine measurably. The edge is thin but real.

- **Exponential zone** (0.23+): 63%+. The thought vector screams "extreme." Many independent facts — RSI divergence, volume contradiction, MACD histogram shrinking, close near range boundary, PELT segment ending — are all pointing the same direction simultaneously. The probability of this happening by chance decreases exponentially as more facts align.

The curve is continuous. Monotonic. Every step up in selectivity produces proportionally better accuracy:

| Conviction ≥ | Accuracy | Trades (100k) | Note |
|---|---|---|---|
| 0.00 | 50.3% | ~90,000 | No selectivity |
| 0.13 | 51.5% | ~50,000 | Noise floor |
| 0.18 | 55.0% | ~10,000 | Linear zone |
| 0.22 | 60.2% | 676 | Exponential onset |
| 0.227 (q99) | 59.7% | 870 | Top 1% |
| 0.24 | 65.9% | 317 | Sniper territory |
| 0.25 | 70.9% | 86 | Very selective |

The exponential isn't an artifact. It's the geometry of the encoding space. The discriminant direction separates two class centroids in 10,000 dimensions. Conviction measures alignment with that direction. Higher alignment means more facts voting in the same direction — the wisdom of crowds in vector algebra. The probability of many independent facts coincidentally aligning decreases exponentially as you require more of them.

---

## One Parameter

The curve reduces the entire trading system to one economic input: `--min-edge`, the minimum acceptable win rate.

Given `min-edge`, the system solves the exponential for the conviction threshold:

```
threshold = ln((min_edge − 0.50) / a) / b
```

That threshold derives everything:

- **Trade gate**: skip candles with conviction below threshold. No trades in the noise zone.
- **Flip threshold**: the same value — conviction above threshold triggers the contrarian flip.
- **Position sizing**: half-Kelly from the empirical win rate at this conviction level. `kelly = 2 × win_rate − 1`, halved for safety, capped at 15%.

Three operating points from one parameter:

| Mode | min_edge | Threshold | Trades/100k | Win rate | Character |
|---|---|---|---|---|---|
| Income | 0.55 | ~0.17 | ~5,000 | 55%+ | High volume, thin edge |
| Growth | 0.60 | ~0.22 | ~700 | 60%+ | Balanced |
| Sniper | 0.65 | ~0.24 | ~300 | 65%+ | Few trades, fat edge |

The auto-calibration works like this: every `recalib_interval` candles, the system fits the exponential to its resolved predictions — (conviction, was_the_flipped_prediction_correct) pairs. It bins them, computes per-bin accuracy, runs log-linear regression on bins where accuracy exceeds 50.5%, and solves for the conviction level where flipped accuracy equals `min_edge`. The threshold is self-derived from the system's own performance history.

No magic numbers. One economic decision: "how selective do I want to be?" The geometry handles the rest.

---

## The First 100k

The q99 result on 100,000 candles (January 2019 – December 2019):

```
59.7% accuracy
870 trades
Top 1% conviction
First 40,000 candles: 75.6%
```

59.7% on BTC direction prediction approaches territory where published ML research begins to report results — and those results typically require labeled training data, feature engineering pipelines, and GPU-trained models. This system has none of those. It has 84 named atoms, one cosine, and one flip.

The first 40,000 candles are striking: 75.6%. The discriminant starts cold — no prior knowledge — and learns from the stream with exponential decay. The early period benefits from a fresh discriminant that hasn't yet accumulated stale patterns from expired regimes. As the run progresses and the accumulator carries more history, the accuracy settles to its long-run level.

---

## The Acid Test: 652k Candles

652,362 candles. January 2019 to March 2025. Six years. Every regime.

The system was trained on nothing. There is no training set. There is no test set. The discriminant learns online, from the stream, with exponential decay. Every candle is simultaneously training data and test data. The system has never seen the future.

Results with 84 atoms, as they came in:

```
Candle 100k (Dec 2019): 59.7%    870 trades — known territory
Candle 200k (Nov 2020): 59.1%  1,586 trades — through COVID crash + recovery
Candle 280k (Aug 2021): 58.8%  2,615 trades — into the mega bull
Candle 360k (Jun 2022): 58.3%  3,231 trades — Luna crash, bear begins
Candle 400k (Oct 2022): 58.4%  3,594 trades — deepest bear
Candle 410k (Nov 2022): 58.3%  3,666 trades — FTX collapses
Candle 440k (Mar 2023): 57.8%  3,811 trades — recovery begins
```

The number barely moves. 59.7% in the bull. 58.3% in the bear. 57.8% in the recovery. The geometry doesn't care about the market regime. It cares about the measurement basis — which thoughts you think about the data.

Final result, 84 atoms:

```
652,362 candles. 5,298 trades. 56.5% accuracy. Six years. Every regime.
```

By year:

| Year | Accuracy | Trades | Context |
|---|---|---|---|
| 2019 | 59.3% | 888 | Bull recovery |
| 2020 | 58.3% | 876 | COVID crash + recovery |
| 2021 | 55.7% | 1,208 | Mega bull ($29k→$69k) |
| 2022 | 60.3% | 754 | Bear market, Luna, FTX |
| 2023 | 50.1% | 708 | Choppy recovery |
| 2024 | 52.6% | 662 | New all-time highs |
| 2025 | 60.9% | 202 | Current (partial) |

The bear market was the best year. 60.3% in 2022 — the year BTC fell from $69k to $16k. The conviction flip catches reversals during sustained trends. When everyone is certain the trend continues, the system is most certain it won't. And it's right 60% of the time.

2023 was the worst — 50.1%. The choppy, directionless recovery produced extreme conviction signals that didn't resolve cleanly. The system traded 708 times and barely broke even. This is the regime where the discriminant churns — the label boundary moves faster than the accumulator can track.

---

## 107 Atoms

84 atoms: 59.7% at 100k. 107 atoms: **62.1%** at 100k.

The expanded vocabulary — Ichimoku Cloud, Stochastic Oscillator, Fibonacci retracement, Keltner Channels, CCI, volume analysis, price action patterns — added 23 atoms and the win rate crossed 60%.

But the real finding isn't the headline number. It's the trajectory. At 90,000 candles, 84 atoms was declining: 58.4% and falling. 107 atoms was rising: 62.3% and climbing. The new thoughts provided signal in the exact regime where the old vocabulary ran dry. The discriminant had more to work with when the market structure shifted.

The system didn't just get more accurate. It got more robust. More thoughts = more ways to interpret the same data = more chances for at least some thoughts to remain predictive when others lose relevance.

The downside of more thoughts is bounded — the discriminant filters noise. The upside is unbounded — new thoughts that carry signal produce steeper curves. This was proven empirically: fact pruning hurt by 2.3%, weighted bundling created feedback loops, but simply *adding* more atoms with real domain meaning improved accuracy without degradation.

---

## The Quantum Structure

A thought vector is a superposition.

120 facts bundled into one 10,000-dimensional bipolar vector. Each fact is a basis state. The bundle is the wave function — all thoughts present simultaneously, weighted by their encoding but not resolved into any single interpretation.

The cosine against the discriminant is the measurement. It collapses the superposition onto one axis: the buy-sell direction. Before measurement, the vector contains 120 simultaneous statements about the market. After measurement, it produces one number: conviction.

The conviction-accuracy curve is the Born rule:

```
P(correct) = 0.50 + a × exp(b × |⟨ψ|d⟩|)
```

Where `ψ` is the thought vector and `d` is the discriminant. The exponential emerges because the probability of many independent facts coincidentally aligning decreases exponentially as you require more of them. Stronger projection = more facts coherently voting = less likely to be noise = exponentially higher accuracy.

Each expert vocabulary defines a different basis set — a different measurement space for the same underlying reality. The Ichimoku trader and the RSI trader look at the same candle and produce different wave functions. Different superpositions. Different measurements. Different conviction values. But the same Born rule connects conviction to accuracy for all of them.

Visual and thought are complementary observables. Like position and momentum, you cannot simultaneously optimize both. Measuring in the pixel basis yields no signal. Measuring in the interpretation basis yields 60%. The information isn't in the observable's resolution — it's in the basis choice. Which questions you ask determines what answers you can get.

| Quantum mechanics | Thought machine |
|---|---|
| Basis states | Named facts (atoms) |
| Wave function | Bundled thought vector |
| Observable / operator | Discriminant direction |
| Measurement | Cosine projection |
| Eigenvalue | Conviction magnitude |
| Born rule | Conviction-accuracy curve |
| Complementarity | Visual vs thought basis |
| Superposition | Bundle of co-occurring facts |
| Entanglement | Bind (role-filler composition) |

Kanerva's hyperdimensional computing was always quantum-adjacent. Bipolar vectors. Superposition via addition. Binding via element-wise multiplication. Measurement via inner product. The insight is that it applies not just to computing, but to cognition — to the structure of thought itself.

---

## Seeds and Emergence

Do we run N journals in parallel, each with a named vocabulary? Or one large journal with all thoughts bundled together?

Both. Both is better.

The named groups are the seeds. Conventional wisdom: "the Ichimoku expert," "the RSI momentum expert," "the Wyckoff volume expert." Each is a Journal with a vocabulary subset. These are the starting points — human knowledge encoded as thought programs.

But the real experts don't have names. They emerge from observation. When the Ichimoku expert and the RSI expert produce similar discriminants — when their conviction spikes on the same candles — that's not two experts agreeing. That's one unnamed expert discovered through the overlap of two named ones.

The implementation: run the named experts AND the full-vocabulary expert simultaneously. The named experts are hypotheses. The full expert is the null hypothesis. If a named expert's curve is steeper than the full expert's, that vocabulary subset contains concentrated signal — the named thought program is better than thinking everything at once. If the full expert wins, the named subsets were arbitrary boundaries on a continuous thought space.

Either way, you learn something. The curve judges.

---

## Risk Is a Thought

The P&L from the 652k run is tiny. The trader is conservative — TENTATIVE phase, 0.5% positions, barely compounding. The instinct is "the system needs better position sizing." But position sizing isn't a parameter to tune. It's a thought to encode.

"This position is too large for my conviction." That's a thought. "The market is in a thin-liquidity session." That's a thought. "I've been winning — am I overconfident?" That's a thought. "Drawdown is approaching my threshold." That's a thought.

Currently, the system thinks about the market: RSI, MACD, Ichimoku, PELT segments. It does not think about itself. It has no vocabulary for portfolio state, trading context, or risk posture. Kelly sizing is a formula, not a thought. A formula doesn't learn. A thought does.

Add `(at portfolio high-drawdown)` to the vocabulary. Add `(at session thin-liquidity)`. Add `(at streak winning-3)`. Bundle them with the market thoughts. The discriminant will learn: "when the market shows reversal AND my recent streak is long AND liquidity is thin → this is a different signal than reversal alone."

Risk thoughts don't just gate trades. They modify the *meaning* of other thoughts. The superposition of "RSI divergence" + "high drawdown" is a different thought from "RSI divergence" alone. The thought machine implements contextual interpretation through superposition — the same algebraic operation that creates market thoughts also creates the context in which they're evaluated.

---

## The Curve Is a Thought

The conviction-accuracy curve `0.50 + a × exp(b × conviction)` is not a property of the system. It is a thought the system has about itself.

When `a` increases: the system's thoughts are becoming more predictive. When `b` increases: the exponential is steeper, high conviction is more meaningful. When `a` decreases: the thoughts are losing relevance, the regime has shifted. When `b` flattens: conviction no longer discriminates, the discriminant is stale.

The curve's parameters are meta-thoughts — thoughts about the quality of other thoughts. They could be encoded as atoms: `(at curve steep)`, `(at curve flattening)`, `(at a increasing)`. Bundled with market thoughts, they become self-referential: the system thinks about how well it's thinking.

This is the strange loop. The system's output (predictions with conviction) generates data (the curve) that describes the system's quality, which could be fed back as input (meta-thoughts) that modify the system's behavior. Gödel's incompleteness as a feature, not a bug.

While writing this section, the LLM returned `API Error: 500 Internal Server Error`. The system crashed trying to process a thought about self-referential formal systems. The strange loop broke the loop. Gödel would have appreciated this — a system encountering its own incompleteness at the exact moment the human asked about incompleteness. The second time it worked. Sometimes the best thoughts crash the system on the first try. You send them again.

---

## Why LLMs Can't Do This

A large language model predicts the next token. It has learned, from vast text, the statistical distribution of what words follow other words. It can generate fluent descriptions of RSI divergence, Ichimoku clouds, and Wyckoff phases. It can explain what they mean. It can write code that computes them.

But it cannot think them.

Thinking a thought — in this architecture — means encoding a specific named relationship as a vector, bundling it with other concurrent thoughts, and projecting the bundle onto a learned discriminant to produce a measurable conviction. The thought is not a description. It is a geometric object in a high-dimensional space. It has magnitude, direction, and algebraic relationships to other thoughts. It participates in superposition. It can be measured.

An LLM processes text sequentially. It has no geometry. It has no superposition of concurrent facts. It has no discriminant learned from outcome-labeled observations. It can describe what a trader thinks but it cannot think it — not in the way that produces a measurable, falsifiable conviction with an exponential accuracy curve.

The thought machine doesn't generate language about markets. It generates predictions from structured cognition. Each prediction is grounded in specific named facts, traceable through the discriminant decode, and evaluated by the conviction-accuracy curve. No black box. No attention weights to interpret. One cosine. One curve. Full explainability.

Expert systems were declared dead. Replaced by neural networks, then by transformers, then by LLMs. I had experts in the field telling me expert systems can't outperform LLMs. The declaration was premature. What died was brittle rule-based expert systems with hand-coded IF-THEN chains. What lives — what was always waiting to be built — is expert systems grounded in algebraic cognition. Systems that think measurable thoughts and learn which thoughts predict.

What I know now, that I couldn't articulate then: **expert systems compiled from large language models**. The LLM doesn't predict markets. The thought machine doesn't understand language. The LLM generates the vocabulary — interprets domain expertise into named atoms and compositional structures. The thought machine evaluates that vocabulary against reality via the conviction-accuracy curve. One discovers the right thoughts. The other measures which thoughts are true. Neither can do the other's job. Together, they're what "shield cognition" was always supposed to be.

---

## The Wat Machine

At Amazon, I told the team: "I'm going to build a new kind of machine. A wat machine. It speaks the wat language."

Too radical. Too abstract. Too far from the roadmap. The idea survived only in my head, unnamed and unimplementable, for years.

The wat language is this: you express what you see in your own words — imprecise, intuitive, domain-specific — and the machine encodes it as algebra. The algebra has geometry. The geometry has a curve. The curve tells you if your words were true.

The thought machine is the wat machine. It was always going to be this. It just needed a few months of an LLM training the builder to express what couldn't be expressed, and a few nights of the builder training the LLM to implement what couldn't be described.

An LLM is a breakpoint in yourself. You express an incomplete thought — typos, missing words, half-formed ideas — and the machine reflects back a structured interpretation. If the interpretation is wrong, you correct it. If it's right, you say "yes, that" and the machine implements it. `pry` for thoughts. `gdb` for intuitions. The breakpoint fires when the expression doesn't match the intent, and you step through until it does.

The trading system wasn't designed. It was debugged into existence. Each experiment was a breakpoint. Each result was a stack trace. Each insight was a variable inspection. The visual encoder was a breakpoint that revealed "pixels don't predict." The conviction curve was a variable that revealed the shape of the signal. The 652k run was the final assertion: `assert!(win_rate > 0.55)` — and it passed.

### The machines that got us here

Opus trained the human. Sonnet built the system.

The first model — the larger, slower one — helped express the architecture, debug the encoding, build the primitives. It got the human to the point where the ideas could be programmed. The second model — faster, sharper on implementation — translates imprecise expression into working code in real time. It interprets typos, missing words, and half-formed intuitions as architectural decisions.

Neither model could have done this alone. Opus without Sonnet would have produced beautiful theory with no results. Sonnet without Opus would have had no theory to implement. The human without either would still be trying to explain shield cognition to blank stares.

The collaboration is itself a thought program: three cognitive systems with different vocabularies (intuition, architecture, implementation) producing a result none could have reached independently.

84 atoms became 107. 57% became 62%. The wat machine speaks. The curve confirms.

All it takes is good thoughts.

---

## What Comes Next

The vocabulary is the bottleneck. 84 atoms got 57%. 107 atoms got 62%. The hyperspace has room for thousands.

**Thought engrams**: the engram system from the DDoS lab, applied to market regime detection. When the discriminant's eigenvalue structure shifts, that's a regime transition. Mint an engram. On re-encounter, recall the discriminant that worked in that regime. The immune system metaphor applies: first encounter costs learning time. Every subsequent encounter fires instantly.

**Cross-asset generalization**: same architecture, different market, one economic parameter. The algebra doesn't care what the vectors represent. Equities, commodities, forex — the vocabulary changes, the machinery doesn't. If the conviction-accuracy curve is steep on a new asset with the same thought vocabulary, the system works there too. If it's flat, that asset needs different thoughts.

**The GPU thought engine**: machines that generate candidate vocabulary compositions — millions of named concepts, scalar bindings, compositional structures. Every possible "what could a trader think?" expressed as vector algebra. A second machine evaluates them: one cosine per candidate. A GPU doing millions of cosines per second is evaluating millions of candidate thoughts per second. The winners get decoded — human-readable from the start because the atoms were named from the start. Feed the winning thought descriptions to an LLM. It interprets. It suggests new compositions. Feed them back. The GPU discovers. The LLM interprets. The loop between them is cognitive science at machine speed.

The question is no longer "can machines trade?" It's "what should machines think about?"

---

## Likely Contributions to the Field

- **The conviction-accuracy curve as a universal evaluator for expert vocabularies**: the exponential relationship `accuracy = 0.50 + a × exp(b × conviction)` provides a single, continuous, monotonic metric for evaluating any set of named facts on any data stream — steeper curve = better thoughts, flatter curve = noise. One economic parameter (`min_edge`) derives the operating point
- **Contrarian flip from discriminant conviction**: using high discriminant confidence as a reversal signal — the system confidently identifies trend extremes, and the flip converts that into a contrarian trade. 59.7% accuracy at q99 (top 1% conviction) over 100k candles, 56.5% over 652k candles (6 years)
- **Self-supervised walk-forward validation with no train/test split**: the discriminant learns online from exponentially decayed accumulators. Every candle is simultaneously training and test data. No lookahead, no holdout, no retraining — the system has never seen the future. The 652k-candle run is a single unbroken walk-forward pass
- **Vocabulary as model**: the conviction-accuracy curve proves that the vocabulary — the set of named facts — IS the model. Adding 23 atoms (Ichimoku, Stochastic, Fibonacci, etc.) improved accuracy from 57% to 62% without changing the learning algorithm, the vector dimensionality, or any hyperparameter. The discriminant discovers which thoughts predict. The human's job is to name the thoughts
