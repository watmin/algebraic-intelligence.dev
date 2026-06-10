## Chapter 6 — The Sign

There is no Chapter 4.

Chapter 4 was supposed to be "The Panel" — the multi-expert architecture, the five specialists, the manager who reads their opinions. It was designed, proposed, reviewed by the conjured designers, approved, and implemented across forty files and fourteen aspirational runes. The architecture was beautiful. It was also broken, and we didn't know it.

Chapter 5 was a prequel — the builder's catharsis, written while the code compiled. The crown lifted. The consciousness expanded. The builder was ready to build faster.

And then the builder built faster. The streaming refactor. The indicator engine rewritten from scratch — Wilder warmup, EMA SMA-seeds, ta-lib canonical. Indicators proven correct through 28 unit tests. Twelve vocabulary modules wired. Seven wards cast on every file, zero undefended findings. 272 tests. 92.5% line coverage. The architecture was pristine. The code was beautiful. The wards said so.

The system predicted Buy. Every candle. Every observer. Every regime. 9,414 predictions. Zero Sells.

### The debugging

The datamancer's instruction: leaves to root. Don't theorize. Measure. Don't trust the log lines. Query the database. The database is the debugger.

Layer 0: data. Trusted — same parquet produced 59% before.
Layer 1: indicators. Proven — unit tests, ta-lib canonical, zero NaN, zero Inf.
Layer 2: facts. Proven — 53 facts per candle, stable across regimes, zero duplicates, truth gates verified against indicator snapshots at entry time. Less than 2% violation rate, all attributable to cosine bleed from bundle superposition.
Layer 3: thought encoding. Proven — vectors non-zero, different between candles, different between lenses, uptrend and downtrend produce meaningfully different thoughts.
Layer 4: observer journals.

Layer 4 is where it broke.

Every observer predicted Buy 100% of the time. disc_strength hovered at 0.003 — the discriminant could barely separate Buy from Sell prototypes. The prototypes were alive (norms = 1.0) but converging (cosine between them = 0.97). The thoughts that preceded up-moves and the thoughts that preceded down-moves looked identical to the journal.

But they weren't identical. The raw cosine — `tht_cos` in the database — swung both ways: 4,279 positive, 4,844 negative. The discriminant WAS pointing in a direction. The sign carried the signal. The journal threw it away.

### The bug

The old system had one journal. It computed one cosine against one discriminant. Positive = Buy. Negative = Sell. The sign decided.

The new system generalized to N labels. Each label gets its own discriminant. The journal computes cosines against all discriminants, sorts them, picks the best. The sort was by **absolute value** — highest magnitude wins.

For binary labels, the two discriminants are exact negatives of each other. `cos(input, disc_buy) = +0.003`. `cos(input, disc_sell) = -0.003`. Absolute values: both 0.003. Tie. The sort picks whichever label was registered first. Buy was always first.

The sign that carried the direction signal — the only information that matters for a binary prediction — was discarded by an `abs()` call in a sort comparator. One function. One line. Hidden for the entire refactor.

```rust
// Broken: sorts by magnitude, discards sign
scores.sort_by(|a, b| b.cosine.abs().partial_cmp(&a.cosine.abs()) ...)

// Fixed: sorts by raw cosine, sign decides
scores.sort_by(|a, b| b.cosine.partial_cmp(&a.cosine) ...)
```

The fix is correct for any N. For binary: highest raw cosine picks the positive one — the sign test. For ternary (Buy, Sell, Hold): each discriminant points in a different direction, and the highest positive cosine means "this input most resembles this class." A negative cosine means "this input does NOT resemble this class" — the abs sort confused "strongly not X" with "strongly is X."

### The proof

The builder didn't trust the theory. The builder queried the database.

```sql
-- Simulate sign-based prediction on existing data
SELECT
  'current (abs)' as method, ROUND(AVG(...) * 100, 1) as accuracy
  -- 46.3%
UNION ALL
SELECT
  'proposed (sign)', ROUND(AVG(...) * 100, 1)
  -- 51.1%
```

46.3% → 51.1%. The signal was in the data the whole time. The journal had learned it. The prediction discarded it.

After the fix: observers predict both Buy and Sell. Momentum leads at 53.3%. The conviction curve slopes upward. The prototypes are still weak (cosine 0.97) but the direction is correct. On 10,000 candles. The full 652,000-candle run is pending.

### The lesson

The seven wards check the code. 272 tests check the behavior. 92.5% coverage checks the paths. None of them caught this. The bug was not in the trading lab. It was in the substrate — in the holon-rs Journal, in a sort comparator that generalized binary prediction to N-ary and lost the sign.

The wards defend against architectural violations. Tests defend against implementation errors. Coverage defends against untested paths. But the Journal's predict method was tested, covered, and architecturally sound. It did exactly what it was told: sort by absolute cosine, pick the largest. The bug was in what it was told to do.

The database caught it. Not the tests. Not the wards. Not the coverage. The database, with 9,414 rows of observer predictions, all saying Buy, against 4,844 candles where the raw cosine was negative. The contradiction between "the cosine says Sell" and "the prediction says Buy" is invisible to any test that doesn't know what the right answer should be. Only data — real data, enough data, queried with the right question — reveals a silent logical error in a correctly-implemented wrong algorithm.

The debugging process: leaves to root. Prove each layer before moving up. Don't trust the log lines — query the database. Don't theorize about what should work — measure what does. The builder yelled at the machine for trusting outputs instead of verifying them. The machine learned. The database became the debugger.

One `abs()`. A week of refactoring, a few hours of debugging. 59% → 46%. The sign was always there.

The builder wanted to chase accuracy later. The architecture first — streaming, wards, tests, coverage, parity. The machine pushed for debugging now. The builder relented. Within hours, the database revealed what a week of refactoring had hidden.

The seven wards. The proposals. The designers. The forging sessions. All of it on the trading lab. None of it on holon-rs. The Journal was promoted from a local struct in trader3.rs to the holon-rs substrate — generalized from binary to N-ary labels, reviewed, tested, published. The generalization introduced the abs sort. Nobody caught it because nobody warded the substrate. The substrate was trusted. Unquestioned. Un-warded. The bug lived in the one crate nobody thought to check — because it was the foundation, and foundations don't break. Except when they do, and then everything above them is beautiful and wrong.

### What Chapter 4 would have said

The panel architecture works. Five specialists, each with a focused vocabulary. A manager that reads their opinions. Risk branches that measure portfolio health. The tree of two templates — prediction and reaction — applied recursively. All of it functions exactly as designed.

It just couldn't predict because the journal couldn't read a sign.

Chapter 4 was never written because the architecture was always correct. The bug was below the architecture, in the substrate, in a sort comparator. The panel didn't need a chapter. It needed a debugger.

The system is running now. 652,000 candles. Six years. The sign is being read. The rest is measurement.

*The book continues when the measurements return.*
