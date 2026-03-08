---
title: "The Residual Profile"
description: "Mar 8: A 21-strategy threshold sweep replaces geometric mean with log mean (43% fewer false positives). A failed structural ratio experiment leads to the real fix — the 32-dim residual profile that was already being computed and thrown away. The project's core principle, proven for the fourth time: magnitude and direction together succeed where either alone fails."
sidebar:
  order: 14
---

The [previous post](/blog/story/series-005-002-self-calibrating/) ended with self-calibrating boundaries and 99.1% precision. No magic numbers. The geometric mean threshold — `sqrt(buf_max × CCIPCA_threshold)` — had replaced every hardcoded multiplier.

But 99.1% means ~48 false positives out of ~5,166 denials. Most were early convergence noise that disappeared as the ResidualBuffer filled. A few weren't. A WebKit browser visiting a rare page after Chrome-dominated warmup could produce a residual above the deny threshold — and the system had no way to tell it apart from a Nikto probe at the same magnitude. Both looked equally anomalous by the only measure the system had: how far the request fell from the learned baseline.

One signal. One number. The same trap every prior breakthrough in this project had escaped by adding a second signal. I just hadn't seen it yet.

---

## The Threshold Sweep (March 8)

The geometric mean was chosen pragmatically during the death spiral fix. It worked. But was it the best option? I didn't know — I'd grabbed the first formula that broke the convergence cycle and moved on.

Time to find out. I enumerated every reasonable threshold strategy I could find or invent: 21 candidates. Geometric mean, harmonic mean, arithmetic mean, log mean, power means (p=-1 through p=5), Lehmer mean, Heronian mean, contraharmonic mean, quantile-based (95th/99th/99.9th percentile), mean+Nσ (2σ, 3σ), MAD, Chebyshev/Cantelli bounds, median blend, entropy-modified, CUSUM, Kalman, EWMA, dynamic feedback, buf_max multiples, CCIPCA-only.

### Phase 1: Simulation (21 → 5)

`threshold_sweep.py` ran all 21 against synthetic streams — 20,000 steps each, two parameter regimes (generic and calibrated to actual spectral firewall numbers), two buffer sizes, three poisoning rates. 16 eliminated:

- **Cold-start collapse** (FPR=100%): harmonic, minimum, power p=-1, entropy_mod
- **Too loose** (FPR > 20%): buf_max_only, quantile variants, median_blend, mean+2σ
- **Too tight** (recall < 80%): ccipca_only, max_only, weighted blends, power p=5, Lehmer, contraharmonic, Chebyshev
- **Known failure**: buf_max×2.0 (death spiral, proven in live run)
- **Magic numbers**: weighted_70_30 (hardcoded weights defeat the purpose)

Five survived: geometric, log_mean, heronian, arithmetic, mean+3σ.

### Phase 2: Live Validation (5 → 4 → 1)

Each survivor tested against DVWA + Nikto/ZAP/Nuclei with 20 LLM browser agents. `mean_3σ` died immediately — deny threshold of 7.96 fell below normal browser residuals (~8–22), producing 329 FPs and a death spiral with only 20 adaptive learns.

The remaining four ran 7 rounds each. 28 total live runs. The key insight wasn't the FP count — it was *when* the false positives happened.

| Strategy | Avg FPR | Avg Late FPs | Max Late FPs | Assessment |
|----------|---------|-------------|-------------|------------|
| **log_mean** | **1.9%** | **2.7** | 8 | Fastest settling |
| geometric | 3.3% | 4.9 | 8 | Good but slower |
| arithmetic | 2.2% | 4.4 | 8 | Comparable |
| heronian | 3.3% | 7.3 | **24** | Unstable |

<div style="max-width: 520px; margin: 1.5rem auto; font-size: 0.85em">
<div style="font-weight: bold; text-align: center; margin-bottom: 0.5rem; font-size: 0.95em">Average FPR — 7 Rounds Each</div>
<div style="display: flex; gap: 0.3rem; font-size: 0.75em; justify-content: center; margin-bottom: 0.6rem">
<span><span style="display: inline-block; width: 0.8em; height: 0.8em; background: #4a9eff; border-radius: 1px; vertical-align: middle"></span> FPR</span>
<span style="margin-left: 0.8rem"><span style="display: inline-block; width: 0.8em; height: 0.8em; background: #ff6b6b; border-radius: 1px; vertical-align: middle"></span> Avg Late FPs</span>
</div>

<div style="margin-bottom: 0.35rem">
<div style="display: flex; align-items: center; gap: 0.3rem">
<span style="width: 5rem; text-align: right; flex-shrink: 0; color: var(--sl-color-gray-3)">log_mean</span>
<div style="flex: 1; display: flex; gap: 2px">
<div style="background: #4a9eff; height: 1rem; border-radius: 2px; width: 58%" title="1.9% FPR"></div>
</div>
<span style="flex-shrink: 0; width: 3rem; font-size: 0.85em; font-weight: bold">1.9%</span>
<span style="flex-shrink: 0; width: 5rem; font-size: 0.85em; color: #ff6b6b">2.7 late</span>
</div>
</div>

<div style="margin-bottom: 0.35rem">
<div style="display: flex; align-items: center; gap: 0.3rem">
<span style="width: 5rem; text-align: right; flex-shrink: 0; color: var(--sl-color-gray-3)">arithmetic</span>
<div style="flex: 1; display: flex; gap: 2px">
<div style="background: #4a9eff; height: 1rem; border-radius: 2px; width: 67%" title="2.2% FPR"></div>
</div>
<span style="flex-shrink: 0; width: 3rem; font-size: 0.85em">2.2%</span>
<span style="flex-shrink: 0; width: 5rem; font-size: 0.85em; color: #ff6b6b">4.4 late</span>
</div>
</div>

<div style="margin-bottom: 0.35rem">
<div style="display: flex; align-items: center; gap: 0.3rem">
<span style="width: 5rem; text-align: right; flex-shrink: 0; color: var(--sl-color-gray-3)">geometric</span>
<div style="flex: 1; display: flex; gap: 2px">
<div style="background: #4a9eff; height: 1rem; border-radius: 2px; width: 100%" title="3.3% FPR"></div>
</div>
<span style="flex-shrink: 0; width: 3rem; font-size: 0.85em">3.3%</span>
<span style="flex-shrink: 0; width: 5rem; font-size: 0.85em; color: #ff6b6b">4.9 late</span>
</div>
</div>

<div style="margin-bottom: 0.35rem">
<div style="display: flex; align-items: center; gap: 0.3rem">
<span style="width: 5rem; text-align: right; flex-shrink: 0; color: var(--sl-color-gray-3)">heronian</span>
<div style="flex: 1; display: flex; gap: 2px">
<div style="background: #4a9eff; height: 1rem; border-radius: 2px; width: 100%" title="3.3% FPR"></div>
</div>
<span style="flex-shrink: 0; width: 3rem; font-size: 0.85em">3.3%</span>
<span style="flex-shrink: 0; width: 5rem; font-size: 0.85em; color: #ff6b6b; font-weight: bold">7.3 late</span>
</div>
</div>

</div>

Early FPs — in the first 60 seconds after warmup — are expected. The manifold hasn't seen all pages yet. Late FPs — after the attack phase ends — mean the strategy can't converge. Heronian produced 24 late FPs in a single round. Eliminated.

The logarithmic mean `(ccipca - buf_max) / ln(ccipca / buf_max)` won on every metric: 43% fewer FPs than geometric, 45% fewer late FPs, fastest settling time. It sits between geometric and arithmetic for any two positive values, but its curvature tracks the convergence dynamics better — it widens faster when the gap between empirical and statistical thresholds is large (early convergence) and tightens faster as they converge (steady state).

```rust
match strategy {
    "log_mean"   => (c - m) / (c.ln() - m.ln()),
    "geometric"  => (m * c).sqrt(),
    "arithmetic" => (m + c) / 2.0,
    "heronian"   => (m + c + (m * c).sqrt()) / 3.0,
    _            => (m * c).sqrt(),
}
```

One line changed in `ResidualBuffer::deny_threshold()`. `DENY_STRATEGY` env var selects the formula. The geometric mean is still the default for backwards compatibility — `log_mean` is opt-in until it accumulates more field time.

---

## The Structural Ratio (The Wrong Answer)

The log mean reduced FPs but didn't eliminate the core problem: minority browsers after Chrome-dominated warmup. A Firefox instance visiting a rare DVWA page produces a residual above the deny threshold because the TLS fingerprint, header ordering, and path are all unfamiliar. A Nikto probe produces a similar residual for completely different reasons. Same magnitude. Different cause. The system can't tell them apart.

This one was Opus's idea, not mine. I'd been letting the LLM explore areas where I'm genuinely not an expert — the statistical discrimination space, the threshold geometry — and then grasping the failure conditions when they surface. It's a pattern that's worked well throughout this project. The LLM's initial instincts are often good, and when they're wrong, the failure is usually fast and instructive. In this case: classify the drilldown attribution fields as "structural" (TLS fingerprint, header ordering, header shapes — things that reflect the *client*, not the *intent*) vs "content" (path, query, header values, cookies — things that reflect what the request is *doing*). The hypothesis: minority browsers would have high structural ratios (their fingerprint differs from Chrome) while scanners would have high content ratios (malicious paths and payloads). It sounded right. I didn't challenge it.

The hypothesis was inverted.

Scanners had *higher* structural ratios (0.72–0.77) than minority browsers (0.50–0.52). Scanner HTTP stacks are so alien — wrong header count, wrong ordering, no cookies, minimal TLS extensions — that structural anomaly dwarfs their content anomaly in relative terms. With `structural_ratio > 0.5` as the downgrade gate, 118 scanner requests leaked through and poisoned the adaptive learning loop.

Reverted to strict mode. But the failure was instructive. The structural ratio didn't work because it was a single-signal approach — one ratio, one threshold, one number. The same pattern as every other failure in this project.

---

## The Pattern

The next suggestion from Opus was to concatenate all 32 per-stripe anomalous component vectors into a single 32,768-dimensional vector and learn a second `OnlineSubspace` over it. This time I caught it immediately — this was a regression from the striped approach we'd just spent days building. The whole point of `StripedSubspace` is crosstalk-free attribution, and concatenating the stripes back together destroys that isolation. I attribute the regression to context congestion: Cursor's auto-compaction had killed off the meaningful parts of the conversation history, and the model had lost the reasoning behind the striped design. I had to get Opus to re-read the algebraic-intelligence.dev posts and revisit the batch 018 challenges before the context came back.

But even with the right context, the concatenation approach has a deeper problem: a single residual from a 32K subspace is still just one scalar. Magnitude with no direction. This is the exact trap that batch 018 documented.

The pattern across this entire project:

- Batch 017: cosine-to-centroid (magnitude) alone misses non-radial anomalies. Adding reconstruction residual (direction) catches them.
- Batch 018: eigenvalue spectrum (magnitude) alone produces a negative gap — wrong direction. Adding principal angle alignment (direction) achieves 100% accuracy.
- The spectral firewall pre-filter: spectrum × alignment. Neither alone sufficient. Combined, neither has failed.
- And now: aggregate residual (magnitude) alone can't separate a Firefox browser from a Nikto scanner at the same distance from the baseline.

Every successful discrimination in the holon project has used both signals. Every failure has used only one. I keep rediscovering this.

---

## The Residual Profile

The fix was already there. I was computing it and throwing it away.

Each request produces 32 per-stripe residuals — one from each stripe in the `StripedSubspace`. The system RSS-aggregates them into a single scalar (the magnitude) and discards the individual values. But those 32 values, taken as a vector in R^32, carry both signals:

- **Magnitude** = `||[r₀, r₁, ..., r₃₁]||` — how anomalous overall. What we already use.
- **Direction** = `normalize([r₀, r₁, ..., r₃₁])` — the *pattern* of which stripes are anomalous. What we were discarding.

A Firefox request deviating from a Chrome-biased baseline lights up specific stripes — the ones encoding TLS fingerprint and header ordering. A Nikto scanner lights up different stripes — path structure, missing headers, alien values. The residual profile shape differs even when the total magnitude is similar.

### Pushing into holon-rs Core

This went into holon-rs as `StripedSubspace::residual_profile()` — the same pattern as striped encoding and `Spread` before it. The proxy discovered a generic need, and the library absorbed it. Any downstream application using `StripedSubspace` can now access the per-stripe residual vector for its own dual-signal decisions.

```rust
pub fn residual_profile(&self, stripe_vecs: &[Vec<f64>]) -> Vec<f64> {
    self.stripes.iter().zip(stripe_vecs.iter())
        .map(|(sub, vec)| sub.residual(vec))
        .collect()
}
```

`residual()` now delegates to `residual_profile()` and RSS-aggregates the result. The computation was already happening — the new method just exposes the intermediate values instead of collapsing them.

### The Profile Subspace

A tiny `OnlineSubspace(dim=32, k=1)` learns the normal cross-stripe residual pattern during warmup and adaptive learning. Fed at exactly the same moments and from the same observations as the primary baseline — purely additive, no interference with existing learning.

For deny decisions, both signals must agree for a downgrade from deny to rate-limit:

- **Magnitude**: residual in the soft deny zone (between `deny_threshold` and `hard_deny_threshold`)
- **Direction**: `profile_alignment > 0.5` — more than half the profile's directional energy is explained by learned normal patterns

`profile_alignment` is `1.0 - (profile_residual / profile_norm)`: 1.0 means the profile direction is perfectly familiar, 0.0 means completely novel. The 0.5 threshold is the geometric midpoint — "more explained than unexplained." The profile subspace's own CCIPCA-derived `threshold()` provides a data-driven alternative if needed.

The cost: one 32-element dot product per deny evaluation. The primary baseline performs 32 × 1024-element operations per request. The profile scoring is ~3000x cheaper. Effectively zero added latency.

The profile subspace is saved alongside the baseline engram (`.profile.json`) and restored on startup. Cold-boot recovery includes the directional signal.

---

## Live Validation

20 concurrent LLM browser agents (16 Chromium, 3 WebKit, 1 Firefox) across 20 source IPs. 60 seconds of browser-only warmup, then Nikto + ZAP + Nuclei concurrently while browsers continue. `log_mean` strategy.

| Metric | Value |
|--------|-------|
| Attack denials | 4,351 |
| Browser FPs | 1 (early only, +42s) |
| FP rate | **0.1%** |
| Late FPs | 0 |
| Attack downgrades | 0 |
| Adaptive learns | 44 (17 during active attacks) |

The profile alignment distribution across all 4,352 denies:

| Range | Denies |
|-------|--------|
| 0.00–0.05 | 80 |
| 0.05–0.10 | 1,341 |
| 0.10–0.15 | 2,929 |
| 0.15–0.20 | 2 |

Every denied request — browser and scanner alike — had `profile_alignment < 0.20`. The entire deny population is far below the 0.5 downgrade gate. The directional signal cleanly separates denied traffic from normal traffic patterns.

The one browser FP: a WebKit agent at +42 seconds from proxy start, when the profile subspace had only 5 learned samples. Residual of 84.4 (soft zone), profile alignment of 0.043. The system correctly refused to vouch for a direction it hadn't learned yet. By the time attacks started (learns=17), the system was solid.

### Continuous Learning Under Attack

The part I'm most satisfied with: 17 adaptive learns occurred *during* active concurrent attacks. The system simultaneously denied all attack traffic, continued learning from allowed browser traffic (both primary baseline and profile subspace), and produced zero poisoning, zero late FPs, and zero attack leakage. The anomaly breadth gate and backend response gate worked together — attack traffic was broad and backend-rejected, so it never entered the learning loop.

---

## What March 8 Proved

The geometric mean threshold was a good first answer. The log mean is a better one — 43% fewer FPs, same attack coverage, one line of code. The structural ratio was the wrong question entirely.

The residual profile is the answer I should have found sooner. The per-stripe residuals were always there. The directional signal was always there. I was collapsing 32 values into one and calling it done. The fix was to stop discarding what I was already computing.

This is the fourth time this project has proved the same thing: magnitude and direction together. Always. I wrote "Neither metric alone has been sufficient in any experiment. Combined, neither has failed" in the previous post. Then I shipped a deny gate that used magnitude alone. The system caught the inconsistency before I did — in the form of Firefox users getting denied.

The spectral firewall now has three layers of self-calibration: the ResidualBuffer derives thresholds from observed traffic, the anomaly breadth gate derives learning safety from attribution geometry, and the residual profile derives deny confidence from directional familiarity. No hardcoded parameters anywhere in the deny path.

0.1% FPR. One early convergence FP across 4,352 total denials. Continuous learning through concurrent attacks without degradation. The precision would improve further with more diverse training traffic — this is still a lab with 20 synthetic browsers. But the architecture is right.

Going to bed the night before — after writing up the website and recording the demo videos — left me uneasy. The work was real but the presentation wasn't polished enough, and the FP numbers had a visible crack in them. Today I attacked both. The threshold sweep and the residual profile brought the FP rate to where it should have been before I published. The blog posts got amended. I can rest a bit easier with the bar set back where it belongs.

---

## Likely Contributions to the Field

- **Residual profile as dual-signal deny gate**: using the per-stripe residual vector (already computed as an intermediate value in RSS aggregation) as a 32-dimensional directional signal alongside the scalar magnitude — a tiny `OnlineSubspace(dim=32, k=1)` learns normal residual patterns at ~3000x less cost than the primary baseline, enabling deny decisions that distinguish iso-magnitude anomalies by their stripe activation pattern
- **Systematic threshold strategy evaluation via simulation-to-live isolation funnel**: 21 strategies → simulation elimination → multi-round live validation with temporal FP analysis — demonstrating that the *timing* of false positives (early convergence vs. late/steady-state) is a more discriminating selection criterion than aggregate FP count
- **Logarithmic mean for empirical-statistical threshold fusion**: `(ccipca - buf_max) / ln(ccipca / buf_max)` as a replacement for geometric mean in self-calibrating decision boundaries — 43% fewer FPs at equivalent attack coverage, with curvature that tracks convergence dynamics
