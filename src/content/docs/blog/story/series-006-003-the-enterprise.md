---
title: "The Enterprise"
description: "Mar 27–28: Visual drops (3.7× speedup). The dead visual_groups code was still degrading throughput from 376/s to 83/s — three deletions fixed it. Four expert observers. Risk bundled with market = noise; risk as anomaly detection = $68k. The SELL P&L bug: every stop loss showed -100.35%. 80+ commits in two days."
sidebar:
  order: 17
---

March 27, afternoon. The 652k validation and the 107-atom expansion had landed that morning. By evening, 80+ commits would reshape the system from a monolith into an organization.

---

## Drop Visual (March 27)

`6a19b05 perf: remove visual encoding, 10 threads — 127/s → 470/s (3.7× faster)`

The viewport renderer, the raster cache, the visual journal, the orchestration modes — all gone. 3.7× speedup from deleting code that predicted nothing.

But the corpse kept metabolizing.

`f74e81c fix: remove dead visual_groups — unbounded O(n×dims) throughput killer`

Every flipped trade had been spawning a `PatternGroup` — a 10,000-dimensional centroid meant to cluster similar visual patterns. With visual encoding removed, the visual vector was always zero. A zero vector has cosine zero against everything. No group ever matched. Every trade created a new group. Each group: 10,000 floats. Each trade resolution: scan all groups, compute cosine against every one.

At candle 2,000: 376 candles per second. At candle 50,000: 83 candles per second. The system was spending more and more time thinking about nothing — comparing a zero vector against a growing pile of zero-vector centroids, each comparison a 10,000-element dot product that could only return zero.

The fix was three deletions. Remove the struct. Remove the loop. Remove the summary. Throughput returned to 251/s, flat from start to finish.

A thought that produces no signal is not inert. It occupies space. It accumulates state. It steals cycles from the thoughts that predict.

---

## The Expert Panel (March 27)

`7d9bd38 feat: expert panel — 4 specialized journals with vocabulary profiles`

A single thought journal bundles 120+ facts into one vector. Every fact votes in one superposition. The discriminant finds the direction that best separates buy from sell across *all* facts simultaneously. That works — 57%.

But a trader who uses Ichimoku thinks differently from one who watches RSI momentum. Bundling everything together means the Ichimoku signal and the RSI signal interfere in the superposition. What if they each had their own journal?

Four specialized observers, each with a named vocabulary profile:

- **Momentum**: RSI, Stochastic, Williams %R, StochRSI, ROC, Ultimate Oscillator
- **Structure**: Ichimoku, Fibonacci, Bollinger position, Keltner squeeze
- **Volume**: OBV, VWAP, MFI, buying/selling pressure
- **Narrative**: PELT segment stories, divergence, trend consistency

Plus a **generalist** with the full vocabulary — the null hypothesis.

`8bb590a feat: 120 new atoms from underdog + quant expert research` and `8a056da research: esoteric/forgotten TA — 78 more atoms from DSP, fractals, RQA, info theory` — the vocabulary exploded from 107 to 200+ atoms across the specialized profiles. DeMark Sequential, Choppiness Index, DFA alpha, Variance Ratio, Aroon, Fractal Dimension, Spectral Slope, Shannon Entropy Rate.

---

## The Risk Journey (March 27, afternoon–evening)

This is worth tracking commit by commit because the path was not straight.

`c6fd05c feat: risk thoughts — portfolio state bundled with market thoughts` — the hypothesis. Bundle `(at portfolio high-drawdown)` with market thoughts and let the discriminant learn.

`3a3ec64 finding: risk bundled with market = noise. Risk must be separate expert.` — the hypothesis was wrong. The market discriminant dominates and the risk signal drowns. Immediate and decisive.

`16108b2 feat: risk expert journal — portfolio state drives sizing multiplier` — try a separate Journal for risk. `8db1077 research: deep risk vocabulary — 204 atoms across 10 categories`. `1883a4b feat: deep risk vocabulary — from 8 to ~25 risk facts per candle`.

`b5fb3ce fix: risk expert predicts Win/Lose, not market direction` — critical fix. The risk Journal was trying to predict Buy/Sell. It should predict whether the *trade* will be profitable.

`42a0f7f feat: conditional curves replace risk journal — no prediction, just measurement` — another pivot. Maybe risk doesn't need a discriminant at all. Partition resolved predictions by drawdown depth, compute conditional curves. Right intuition, wrong tool — threw away the 25 rich risk facts.

`ae1baca feat: risk as anomaly detection — OnlineSubspace, gated updates, no labels` — the answer. The same `OnlineSubspace` from the DDoS lab, pointed at portfolio state instead of packet fields. Five branches: drawdown, accuracy, volatility, correlation, panel shape. Each learns what "healthy" looks like. Gated updates — it only learns during genuinely healthy moments (drawdown < 2%, accuracy > 55%, positive returns). The subspace never sees bad data.

`e353018 book: shield cognition comes home — $10k → $62k, anomaly detection manages risk`

The DDoS tool that couldn't be built at AWS — subspace-based anomaly detection as a risk management mechanism — running on a laptop, managing portfolio risk for a trading engine.

---

## $10,000 → $68,088 (March 28)

`aed218d milestone: $10,000 → $68,088. +580.9%. The thoughts survived.`

Two templates. Five market experts. Five risk branches. Named thoughts all the way down. The curve that decides its own memory depth. The subspace that only learns from healthy states. The minimum bet that never quits.

This number comes with caveats. Zero venue costs. Half-Kelly capped at 15%. Real costs on Jupiter/Solana (~0.35% per swap) would eat much of the edge. Later runs with costs modeled: 50k candles at 0.15% fee + 0.20% slippage → $10,000 → $19,710 (+97%), with $3,598 in total costs. 100k with costs → $10,000 → $6,165 (−38%) in the choppy 2023 regime.

The $68k headline is the architecture working. The economics need the experts that would replace every hardcoded parameter with learned values.

### Per-observer discriminant strength

After 50k candles:

| Observer | disc_strength | Domain |
|----------|--------------|--------|
| structure | 0.0019 | Ichimoku, Fibonacci, BB position |
| narrative | 0.0017 | PELT segments, temporal patterns |
| momentum | 0.0014 | RSI, Stochastic, oscillators |
| regime | 0.0012 | KAMA, choppiness, entropy |
| volume | 0.0009 | OBV, VWAP, pressure |

Small numbers — 0.0019 at D=10,000 means the prototypes differ by ~0.19 in L2 norm out of ~100. The signal is weak but real. The manager's job is to find the moments when multiple weak signals agree.

---

## The Monolith Breaks Apart (March 28)

`b7869c1 refactor: extract enterprise modules from trader3.rs monolith`

trader3.rs was 1,326 lines of interleaved concerns. The extraction happened module by module: `treasury.rs` (balances, swaps, costs), `portfolio.rs` (equity, drawdown, phases), `market/manager.rs` (reads expert opinions, encodes panel shape), `market/observer.rs` (Journal + WindowSampler + proof gate), `risk/mod.rs` (five OnlineSubspace branches), `sizing.rs` (Kelly from the curve), `ledger.rs` (SQLite, append-only).

`ce470cb rename: Expert → Observer — they perceive, they don't decide`

The manager's Journal doesn't see candle data. It sees the expert panel — each observer's conviction, encoded as a linear scalar bound to named action atoms. Panel shape facts: agreement, energy (mean conviction), divergence (variance), coherence (pairwise cosine between discriminants). Context: ATR regime, discriminant strength, circular time encoding. A journal over journals. The fractal repeats.

`adff9c6 feat: remove flip entirely — let discriminants learn the full pattern` — the hardcoded flip was removed. The manager's discriminant learns when high conviction means reversal and when it means continuation.

`a14081e feat: proof gates — experts must prove edge before the manager listens` — observers start muted. Rolling accuracy above 52% with 50+ resolved predictions earns voice. Below 50% over 200 loses it. The immune system from the DDoS lab, applied to expert management.

---

## The SELL P&L Bug (March 28)

`b02278d fix: SELL positions had -100% P&L — return_pct assumed BUY direction`

This one was found by debugging the DB. Every stop loss was a SELL position. Every SELL position showed −100.35% P&L. Despite tiny price movements — 0.1%, 0.3%. All −100.35%.

The cause: `unrealized_pnl` calculated `wbtc_held × price`. SELL positions hold USDC, not WBTC. `wbtc_held` was zero. The P&L was `0 − entry_cost = −100%` plus fees. Every SELL stop loss, regardless of price movement, reported the same catastrophic loss.

`8491c67 fix: position exit direction was hardcoded to "Sell" — BUY stops invisible`

Then a second bug in the same area: every exit was logged as "Sell" in the DB. BUY stops were firing correctly — the position closed, the P&L was computed — but the ledger recorded the direction as SELL. The enterprise was working. The ledger was lying. 1,302 BUY opens, zero BUY stop losses in the DB. The stops were invisible.

Once both bugs were fixed: 30 BUY runners at +1.80%, 753 stops at −1.39%. Fractional allocation saved the enterprise — −1.3% total loss despite 753 stops, because at 1.5% per position each stop loses ~0.02% of equity. At 100% sizing this would have been −40%+.

---

## What Two Days Built

80+ commits. The system went from a monolith with one journal to an enterprise with six observers, a manager, a risk tree, a treasury, managed positions with stop/TP/runner phases, and proof gates. The dead visual code killed throughput. The SELL P&L bug made every SELL position look catastrophic. The exit direction bug made BUY stops invisible. Each lie found by querying the database — the instrument that reveals truth.

None of this changed the primitives. Atom, bind, bundle, cosine, journal, curve. The enterprise is a composition, not a new invention.

---

## Likely Contributions to the Field

- **Two-template architecture**: Journal (prediction) and OnlineSubspace (reaction) as the only two learning primitives — the same two that power the DDoS lab, composed differently for a different domain. Risk as portfolio anomaly detection: five OnlineSubspace branches, worst-residual drives sizing
- **Manager-over-observers via VSA encoding of opinions**: second-order discriminant over discriminants, with circular time encoding and per-observer reliability
- **Proof gates as an immune system**: observers earn and lose voice through conviction-accuracy curves. No human curation. The DDoS engram system's adaptive trust model, applied to expert management
