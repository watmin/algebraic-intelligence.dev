---
title: "The Enterprise"
description: "Mar 27–28: Visual drops (3.7× speedup). Four expert observers. Risk as anomaly detection. $10k → $68k. The monolith breaks into treasury, observers, manager, proof gates. Managed positions discover six bugs in the ledger. 80+ commits in two days."
sidebar:
  order: 17
---

March 27, afternoon. The 652k validation and the 107-atom expansion had landed that morning. By evening, 80+ commits would reshape the system from a monolith into an organization.

---

## Drop Visual (March 27)

`6a19b05 perf: remove visual encoding, 10 threads — 127/s → 470/s (3.7× faster)`

The viewport renderer, the raster cache, the visual journal, the orchestration modes — all gone. Pixels don't predict. The controlled experiment was proven. Carrying the dead weight any further was sentimentality.

470 candles per second. Fast enough to run the full 652k dataset in 23 minutes.

---

## The Expert Panel (March 27)

`7d9bd38 feat: expert panel — 4 specialized journals with vocabulary profiles`

Four specialized observers, each with a named vocabulary profile:

- **Momentum**: RSI, Stochastic, Williams %R, StochRSI, ROC, Ultimate Oscillator
- **Structure**: Ichimoku, Fibonacci, Bollinger position, Keltner squeeze
- **Volume**: OBV, VWAP, MFI, buying/selling pressure
- **Narrative**: PELT segment stories, divergence, trend consistency

Plus a **generalist** with the full vocabulary — the null hypothesis.

`8737f16 feat: expert panel observe-only run + discovery` — the first run with all five journals learning in parallel. `8bb590a feat: 120 new atoms from underdog + quant expert research` and `8a056da research: esoteric/forgotten TA — 78 more atoms from DSP, fractals, RQA, info theory` — the vocabulary exploded from 107 to 200+ atoms across the specialized profiles.

---

## The Risk Journey (March 27, afternoon–evening)

This is worth tracking commit by commit because the path was not straight.

`c6fd05c feat: risk thoughts — portfolio state bundled with market thoughts` — the hypothesis from the [conviction curve post](/blog/story/series-006-002-the-conviction-curve/). Bundle `(at portfolio high-drawdown)` with market thoughts and let the discriminant learn.

`3a3ec64 finding: risk bundled with market = noise. Risk must be separate expert.` — the hypothesis was wrong. Portfolio state and market state live in different spaces. The discriminant can't separate buy-from-sell AND healthy-from-unhealthy in the same direction.

`16108b2 feat: risk expert journal — portfolio state drives sizing multiplier` — try a separate Journal for risk. `473e38c feat: expanded risk vocabulary — expert state + trade density`. `d8b0436 checkpoint: risk expert too thin, need deeper vocab design`. `8db1077 research: deep risk vocabulary — 204 atoms across 10 categories`. `1883a4b feat: deep risk vocabulary — from 8 to ~25 risk facts per candle`.

`b5fb3ce fix: risk expert predicts Win/Lose, not market direction` — critical fix. The risk expert was trying to predict Buy/Sell. It should predict whether the *trade* will be profitable, not which *direction* the market will go.

`42a0f7f feat: conditional curves replace risk journal — no prediction, just measurement` — another pivot. Risk doesn't need a discriminant. It needs to measure whether the current state is normal or abnormal.

`ae1baca feat: risk as anomaly detection — OnlineSubspace, gated updates, no labels` — the answer. The same `OnlineSubspace` from the DDoS lab, pointed at portfolio state instead of packet fields. Five branches: drawdown, accuracy, volatility, correlation, panel shape. Each learns what "healthy" looks like. The residual — how far current state falls from the learned normal — is the anomaly signal.

`e353018 book: shield cognition comes home — $10k → $62k, anomaly detection manages risk`

---

## $10,000 → $68,088 (March 28)

`aed218d milestone: $10,000 → $68,088. +580.9%. The thoughts survived.`

The first run with the five-branch risk tree and Kelly sizing from the conviction curve. 100k candles, zero venue costs, half-Kelly capped at 15%.

This number comes with caveats that matter. Real venue costs on Jupiter/Solana (~0.35% per swap) would eat much of the edge. Later runs with costs modeled: 50k candles at 0.15% fee + 0.20% slippage → $10,000 → $19,710 (+97%), with $1,115 in fees and $2,483 in slippage paid. A 100k run at the same costs → $10,000 → $6,165 (−38%) — the choppy 2023 regime kills the edge when costs are real.

The $68k headline is the architecture working, not a P&L prediction. But the architecture is validated: expert panel provides signal, risk tree modulates exposure, conviction curve sizes positions, and the whole thing composes from six primitives.

### Per-observer discriminant strength

After 50k candles:

| Observer | disc_strength | Domain |
|----------|--------------|--------|
| structure | 0.0019 | Ichimoku, Fibonacci, BB position |
| narrative | 0.0017 | PELT segments, temporal patterns |
| momentum | 0.0014 | RSI, Stochastic, oscillators |
| regime | 0.0012 | KAMA, choppiness, entropy |
| volume | 0.0009 | OBV, VWAP, pressure |

Small numbers — 0.0019 at D=10,000 means the buy and sell prototypes differ by ~0.19 in L2 norm out of ~100. The signal is weak but real. The manager's job is to find the moments when multiple weak signals agree.

---

## The Monolith Breaks Apart (March 28)

`b7869c1 refactor: extract enterprise modules from trader3.rs monolith`

trader3.rs was 1,326 lines of interleaved concerns. The extraction happened module by module:

- **`treasury.rs`** — asset balances, swap execution, venue costs. Knows balances, not predictions.
- **`portfolio.rs`** — equity tracking, drawdown, position management.
- **`market/manager.rs`** — reads expert opinions, not candle data. Encodes panel shape: agreement, energy, divergence, coherence.
- **`market/observer.rs`** — `Observer` struct with Journal, WindowSampler, resolved queue, proof gate.
- **`risk/mod.rs`** — five OnlineSubspace branches, worst-residual drives sizing multiplier.
- **`sizing.rs`** — Kelly from the curve, position caps from max drawdown.
- **`ledger.rs`** — SQLite logging. Append-only.

`ce470cb rename: Expert → Observer — they perceive, they don't decide`

---

## The Manager Doesn't Encode Candles

`7836bec feat: manager journal thinks in expert opinions via Holon encoding`

The manager's Journal sees the expert panel, not market data. Each candle, the manager encodes:

- Expert opinions: conviction per observer, bound to named action atoms (buy/sell/proven/tentative)
- Panel shape: agreement, energy (mean conviction), divergence (variance), coherence (pairwise cosine between discriminants)
- Context: ATR regime, discriminant strength, time (circular encoding — `60d5a6e fix: circular encoding for time — hour 23 is near hour 0`)

A journal over journals. The fractal repeats.

`adff9c6 feat: remove flip entirely — let discriminants learn the full pattern` — the hardcoded flip was removed. The discriminant learns when high conviction means reversal and when it means continuation.

`a14081e feat: proof gates — experts must prove edge before the manager listens` — observers start muted. Rolling accuracy above 52% with 50+ resolved predictions earns voice. Below 50% over 200 predictions loses it. The immune system from the DDoS lab, applied to expert management.

---

## Managed Positions (March 28, evening)

`67de1a2 feat: managed positions — fractional, stop/TP, partial profit, cooldown`

Entry → stop loss (3 × ATR) → take-profit (6 × ATR) → runner (trailing stop at 1.5 × ATR) → close. The discoveries from the first runs (`DISCOVERIES.md`, entries 24–34):

`b02278d fix: SELL positions had -100% P&L — return_pct assumed BUY direction`

`8491c67 fix: position exit direction was hardcoded to "Sell" — BUY stops invisible` — 1,302 BUY opens, zero BUY stop losses in the DB. The stops were firing. The ledger was lying.

Once fixed: 30 BUY runners at +1.80%, 753 stops at −1.39%. Fractional allocation saved the enterprise — −1.3% total loss despite 753 stops, because at 1.5% per position each stop loses ~0.02% of equity.

`f95db11 feat: exit expert — learns when positions improve vs deteriorate` — the exit expert encodes P&L trajectory, hold phase, max favorable excursion, ATR at entry vs now, stop distance. It learns but doesn't act yet — the optimal trailing distance should come from the runner distribution.

---

## What Two Days Built

80+ commits. The system went from a monolith with one journal to an enterprise with six observers, a manager, a risk tree, a treasury, managed positions, proof gates, and 200+ atoms across specialized profiles. The architecture mirrors an organization chart: observers perceive, the manager aggregates, risk modulates, treasury executes, the ledger records.

None of this changed the six primitives. Atom, bind, bundle, cosine, journal, curve. The enterprise is a composition, not a new invention.

---

## Likely Contributions to the Field

- **Two-template architecture**: Journal (prediction via discriminant) and OnlineSubspace (reaction via anomaly detection) as the only two learning primitives — the same two that power the DDoS lab, composed differently for a different domain
- **Manager-over-observers via VSA encoding of opinions**: the manager's Journal learns from encoded panel shape (agreement, energy, divergence, coherence) rather than raw data — a second-order discriminant over discriminants, with circular time encoding and per-observer reliability
- **Proof gates as an immune system for expert panels**: observers earn and lose voice through demonstrated conviction-accuracy curves, with no human curation
- **Risk as portfolio anomaly detection**: five OnlineSubspace branches monitoring drawdown, accuracy, volatility, correlation, and panel shape — worst-residual drives sizing. No rules about what "dangerous" means, only a learned model of what "normal" means
