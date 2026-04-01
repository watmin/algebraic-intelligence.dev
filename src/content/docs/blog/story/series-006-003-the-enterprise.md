---
title: "The Enterprise"
description: "Mar 27–28: Visual drops. Four specialized experts emerge. Risk as anomaly detection produces $10k → $62k. The monolith breaks apart into treasury, observers, manager, and proof gates. Every magic value is an expert waiting to be born. The flip emerges from geometry, not hardcoded."
sidebar:
  order: 17
---

March 27. The thought encoder was proven — 57% with 84 atoms, 62% with 107. The conviction-accuracy curve was real, monotonic, exponential. The system worked.

What it wasn't, yet, was a *system*. trader3 was a 1,326-line monolith with a single thought journal, a dead visual journal still burning CPU, and a hardcoded flip threshold. It predicted, but it didn't *organize*. It had thoughts, but no way to discover which thoughts belonged to which expert.

Two days later, it was an enterprise.

---

## Drop Visual

The first commit of the day removed visual encoding entirely.

127 encode/s → 470 encode/s. A 3.7× speedup from deleting code that predicted nothing. The viewport renderer, the raster cache, the visual journal, the orchestration modes that tried to combine visual with thought — all gone. The controlled experiment was proven. Pixels don't predict. Named relationships predict. Carrying the dead weight any further was sentimentality.

10 threads, thought-only, 470 candles per second. Fast enough to run the full 652k dataset in 23 minutes. Fast enough to iterate.

---

## The Expert Panel

A single thought journal bundles 120+ facts into one vector. Every fact votes in one superposition. The discriminant finds the direction that best separates buy from sell across *all* facts simultaneously. That works — 57%.

But a trader who uses Ichimoku thinks differently from a trader who watches RSI momentum. Their concepts overlap but their emphasis differs. Bundling everything together means the Ichimoku signal and the RSI signal interfere in the superposition. What if they each had their own journal?

Four specialized experts, each with a named vocabulary profile:

- **Momentum**: RSI, Stochastic, Williams %R, StochRSI, ROC, Ultimate Oscillator — the oscillator school
- **Structure**: Ichimoku, Fibonacci, Bollinger position, Keltner squeeze — the price structure school
- **Volume**: OBV, VWAP, MFI, buying/selling pressure — the flow school
- **Narrative**: PELT segment stories, divergence, trend consistency — the temporal school

Plus a **generalist** with the full vocabulary — the null hypothesis against which the specialists compete.

Each expert gets its own `Journal`. Same learning machinery. Different thoughts. Different discriminants. Different conviction-accuracy curves.

---

## Risk as a Thought — Then as a Tree

The BOOK.md from the conviction curve post proposed that risk should be a thought — `(at portfolio high-drawdown)` bundled with market thoughts. We tried it.

**Risk bundled with market = noise.** The portfolio state and the market state live in different spaces. Bundling them into one vector means the discriminant has to separate buy-from-sell AND healthy-from-unhealthy in the same direction. It can't. The market discriminant dominates and the risk signal drowns.

The finding was immediate and decisive: **risk must be a separate tree, not a bundled thought.** Market says WHAT (direction). Risk says HOW MUCH (sizing).

This led to risk as anomaly detection — the same `OnlineSubspace` from the DDoS lab, pointed at portfolio state instead of packet fields. Five branches, each monitoring a different health dimension:

- **Drawdown**: how far below peak equity
- **Accuracy**: recent win rate trajectory
- **Volatility**: ATR regime and acceleration
- **Correlation**: expert agreement patterns
- **Panel**: observer panel shape (conviction distribution)

Each branch is an `OnlineSubspace` that learns what "healthy" looks like in its domain. The residual — how far current state falls from the learned normal — is the anomaly signal. The worst residual across all branches drives a risk multiplier that scales position sizing.

When the portfolio is in familiar territory (low residual across all branches), full sizing. When any branch sees something it hasn't learned — a novel drawdown pattern, an accuracy collapse, a volatility regime shift — the multiplier drops. The system doesn't need rules about what "dangerous" looks like. It needs to know what "normal" looks like. Everything else is caution.

**Two templates emerged**: prediction (Journal) and reaction (OnlineSubspace). The DDoS lab used OnlineSubspace for attack detection. The trading lab uses Journal for direction prediction and OnlineSubspace for health monitoring. Same two primitives, different compositions. The project keeps discovering that its toolkit is smaller than expected.

---

## $10,000 → $62,000

The first run with risk-as-anomaly-detection and Kelly sizing from the conviction curve:

```
$10,000 → $62,000. +520%.
```

This number comes with caveats. It's a 100k-candle paper trade with zero venue costs, perfect execution, and hindsight-derived move thresholds. The Kelly sizing is aggressive (half-Kelly capped at 15%). Real execution would face slippage, fees, and the psychological weight of drawdowns that paper trading doesn't simulate.

But the architecture was validated. The expert panel provided signal. The risk tree modulated exposure. The conviction curve sized positions. The enterprise — the system of systems — produced results that no single component could achieve alone.

---

## The Monolith Breaks Apart

March 28. trader3.rs was 1,326 lines of interleaved concerns — encoding, prediction, learning, position management, risk assessment, logging. Everything happened in one function. Every change risked breaking something unrelated.

The extraction happened module by module:

- **`treasury.rs`** — asset balances, swap execution, venue cost accounting. The treasury knows balances, not predictions. It executes what the manager approves.
- **`portfolio.rs`** — equity tracking, drawdown measurement, position management. Positions are independent managed trades with entry, stop, take-profit, and trailing runner phases.
- **`market/manager.rs`** — the manager reads expert opinions, not candle data. It encodes a thought vector from the expert panel's shape: who agrees, who disagrees, conviction magnitudes, reliability scores, tenure.
- **`market/observer.rs`** — the `Observer` struct. Each expert observer has a Journal, a WindowSampler (discovers its own optimal lookback window from experience), a resolved prediction queue, and a proof gate.
- **`risk/mod.rs`** — five OnlineSubspace branches, worst-residual drives sizing multiplier.
- **`sizing.rs`** — Kelly from the curve, position caps from max drawdown.
- **`ledger.rs`** — SQLite logging. Append-only. Run artifacts are training data.

The `Expert` struct was renamed to `Observer` — "they perceive, they don't decide." The manager decides. The observers report what they see. The naming precision matters because it enforces the boundary: an observer's Journal learns direction, but the observer doesn't take positions. The manager aggregates opinions. The treasury executes trades. Each module does one thing.

---

## The Manager Doesn't Encode Candles

The most important architectural decision: **the manager's Journal doesn't see candle data.** It sees the expert panel.

Each candle, the manager encodes a thought vector from:

- **Expert opinions**: each observer's conviction, encoded as a linear scalar bound to a named action atom (buy/sell/proven/tentative)
- **Panel shape**: agreement (do the observers agree?), energy (mean conviction), divergence (variance in convictions), coherence (pairwise cosine between observer discriminants)
- **Context**: volatility regime (ATR), discriminant strength, time (circular encoding for hour and day)

The manager learns a second-order pattern: "when the observers produce THIS shape of opinions, the market tends to go THIS direction." It's a journal over journals. The fractal repeats — the same six primitives (atom, bind, bundle, cosine, journal, curve) compose at every level.

---

## The Flip Emerges from Geometry

The hardcoded flip was removed. No more `if conviction > threshold: reverse()`. Instead, the discriminant itself learns the full pattern — including what trend extremes look like, including what reversals look like, including the relationship between conviction magnitude and outcome.

The manager sees observer opinions. If the momentum observer says "strong buy" with high conviction during a period where high-conviction momentum predictions have historically preceded reversals, the manager's discriminant has already learned that pattern. The flip isn't a rule applied on top. It's a geometric property of the learned manifold.

This is cleaner and more powerful. The hardcoded flip assumed that high conviction *always* means reversal. The learned flip discovers *when* high conviction means reversal and when it means continuation. The conviction-accuracy curve varies by regime. The geometry captures that variation.

---

## Proof Gates — The Immune System

Not every observer gets a voice. The proof gate requires each observer to demonstrate edge before the manager listens.

An observer starts muted. Its predictions are logged but don't feed the manager. As its resolved predictions accumulate, the system fits the conviction-accuracy curve for that observer. When the curve shows edge — a rolling accuracy above 52% with at least 50 resolved predictions — the observer is "proven" and its opinions flow to the manager.

If accuracy drops below 50% over 200 recent predictions, the observer loses its proof status and goes muted again. It keeps learning — its Journal still accumulates — but its opinions don't influence trading decisions until it re-proves.

This is the immune system from the DDoS lab, applied to expert management. A new observer is an untrusted stranger. It earns trust through demonstrated performance. It loses trust through demonstrated failure. No human decides which observers to listen to. The proof gate measures. The geometry judges.

---

## Every Magic Value Is an Expert Waiting to Be Born

The 0.52 accuracy threshold for phase transition — that's a human judgment about when to start trusting. Make it an expert. The 36-candle horizon — that's a human judgment about how far to look ahead. Make it an expert. The 0.5% move threshold — that's a human judgment about what counts as a meaningful move. Make it an expert.

Every hardcoded constant in the system is a decision that could be learned. The expert panel pattern scales: add an observer with a vocabulary that encodes the relevant state, give it a Journal, let it discover the pattern, gate it behind proof. The enterprise grows by turning parameters into observers.

The `WindowSampler` was the first instance of this. Each observer discovers its own optimal lookback window — the number of candles to encode — by sampling from a log-uniform distribution over [12, 2016] candles and tracking which windows produce the best resolved predictions. The window isn't a CLI flag anymore. It's learned.

---

## What Two Days Built

The system went from a monolith with one journal to an enterprise with six observers, a manager, a risk tree, a treasury, managed positions with stop/TP/runner phases, and proof gates. The architecture mirrors an organization chart: observers perceive, the manager aggregates, risk modulates, treasury executes, the ledger records.

The vocabulary went from 107 atoms to 200+ across specialized profiles. The risk system went from a hardcoded threshold to five OnlineSubspace branches. The position management went from "entry and exit at horizon" to managed trades with ATR-based stops, take-profit, partial profit-taking, and trailing runners.

None of this changed the six primitives. Atom, bind, bundle, cosine, journal, curve. Everything composes from these. The enterprise is a composition, not a new invention.

---

## Likely Contributions to the Field

- **Two-template architecture**: Journal (prediction via discriminant) and OnlineSubspace (reaction via anomaly detection) as the only two learning primitives needed — the same two that power the DDoS lab, composed differently for a different domain
- **Manager-over-observers via VSA encoding of opinions**: the manager's Journal learns from encoded expert panel shape (agreement, energy, divergence, coherence) rather than raw data — a second-order discriminant over discriminants
- **Proof gates as an immune system for expert panels**: observers earn and lose voice through demonstrated conviction-accuracy curves, with no human curation — the same adaptive trust model as the DDoS engram system, applied to expert management
- **Risk as portfolio anomaly detection**: five OnlineSubspace branches monitoring different health dimensions, worst-residual drives sizing — no rules about what "dangerous" means, only a learned model of what "normal" means
