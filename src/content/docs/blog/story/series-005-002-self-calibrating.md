---
title: "Self-Calibrating"
description: "Mar 4–6: Striped encoding eliminates attribution crosstalk, a parameter sweep finds 13x better separation at the same compute, and self-calibrating decision boundaries remove every hardcoded threshold. 20 LLM browser agents and 3 vulnerability scanners run concurrently — 99.1% precision, no hardcoded parameters."
sidebar:
  order: 13
---

The spectral firewall stopped Nikto cold. Zero exploitable vulnerabilities through the proxy, 10,121 requests denied, 41 microseconds per verdict. The architecture was validated.

But it was held together by `sigma_mult=3.5` and `deny_mult=2.0`. Two magic numbers calibrated by hand against one lab's traffic patterns. The detection worked; the attribution was garbage — `src_ip` scored nearly as high as genuinely anomalous fields because every fact about a request (~100 encoded bindings) was packed into one 4096-dimensional vector, right at the capacity ceiling. And Nikto was one scanner. What happens when 20 real browsers and 3 different scanners hit the proxy simultaneously?

This post covers the three days that answered those questions.

---

## Striped Encoding: Solving the Crosstalk Problem (March 4)

Every encoded fact about a request — `method⊗GET`, `tls.cipher_order.[0]⊗0x1301`, `headers.[2].[1]⊗text/html` — is a binding. A typical request produces ~100 of them. The previous design superimposed all ~100 into a single 4096-dimensional vector. The ratio of ~1 binding per 40 dimensions is near the Kanerva capacity ceiling (~123 items at D=4096). In practice, this meant crosstalk: the drilldown attribution showed `src_ip` scoring 47.5 while genuinely anomalous TLS fields scored 48.2. A 0.7-point spread across a 47–49 range. Useless for identifying which fields drove the anomaly.

The fix: **striped encoding**. Instead of one vector, encode into N independent vectors. Each binding is assigned to a stripe by hashing its fully-qualified domain name (the dotted path through the walkable structure) via FNV-1a:

```
src_ip                        → stripe 3
tls.cipher_order.[5]          → stripe 1
headers.[0].[1]               → stripe 0
path_shape.[1]                → stripe 27
```

With 32 stripes and ~100 leaves, each stripe holds ~3 bindings — a ratio of ~1:320 at DIM=1024, well within capacity. The crosstalk problem disappears.

This wasn't just a proxy-level hack. `StripedSubspace` went into holon-rs core as a generic primitive alongside `OnlineSubspace`. The capacity ceiling problem isn't specific to HTTP requests — any `Walkable` structure with enough fields will hit it. The striped encoder, the FQDN hashing, the per-stripe CCIPCA state — all of it lives in the library, not the application. The proxy just calls `StripedSubspace::new(dim, k, stripes)` the same way it calls `OnlineSubspace::new(dim, k)`. Any future holon-rs application that encodes high-cardinality structured data gets crosstalk-free attribution for free.

Each stripe is an independent `OnlineSubspace` with its own CCIPCA state. The aggregate residual is the RSS (root sum of squares) across stripes:

```
residual = √( r₀² + r₁² + ... + r₃₁² )
threshold = √( t₀² + t₁² + ... + t₃₁² )
```

Drilldown attribution now uses **cosine similarity** between the float anomalous component and the bipolar binding vector for each binding. This replaced the original L2-norm unbinding — which I'd let the LLM choose without challenging it. That was a mistake. Over a long session, Cursor's context auto-compaction eventually dropped the holon-specific details about our `{-1, 0, 1}` MAP-style VSA, and the LLM started implementing techniques from a different VSA family where L2-norm unbinding works. We ran in circles for a while — attribution scores were identical for every field and I couldn't figure out why. When I finally pushed back and asked *why* L2-norm, we realized the math was wrong: `||bind(A, R)|| = ||A||` for any role vector R in bipolar MAP, so every field gets an identical norm by construction. Cosine similarity — directional alignment between the anomaly and each binding — is the correct probe. Lesson: the LLM's knowledge is vast but not always grounded in *your* system. When the results don't make sense, challenge the method, not just the parameters.

Before striped encoding: `src_ip` at 47.5, all fields within a 2-point band. After: `src_ip` dropped out entirely. Top attributions: `tls.ext_order.[9]` (49.92), `tls.cipher_order.[21]` (49.68), `path_shape.[1]` (49.49). The Nikto TLS fingerprint and path probing patterns now dominate the attribution — exactly what you'd expect.

The same commit also removed `body_len` from the encoding. The original design encoded the HTTP body length as a leaf binding. But `body_len` comes from the `Content-Length` header — a trusted declaration from the client, not measured data. Encoding it gives the attacker a free knob to manipulate the vector without changing the actual request content. Data-first encoding means encoding what you observe, not what the client tells you.

The attribution was fixed. The performance was not. The initial striped config — 32 stripes × k=64 per stripe — consumed ~25M FLOPS per request and caused a 5x throughput regression. The pre-striped monolithic encoding was faster despite being wrong. I couldn't ship that. Dropping k to 8 per stripe cut compute to ~3M FLOPS and brought throughput back, but I was guessing at parameters. Was k=8 right? Was DIM=4096 still right now that each stripe only held ~3 bindings? Was 32 stripes the right split? I needed a systematic answer, not more tuning by feel. That became the parameter sweep.

---

## The Parameter Sweep: DIM Doesn't Matter, K Does

After striped encoding shipped, I ran a systematic parameter sweep. The initial config was DIM=4096, K=8 per stripe, 32 stripes — inherited from the pre-striped design.

The sweep across DIM × K × STRIPES revealed something unexpected: **K (deflation steps per stripe) is the dominant quality lever, not DIM (vector dimension).**

At iso-compute budget (DIM × K × STRIPES ≈ 1M total operations):

| Config | full_p50 | Separation | vs Old |
|--------|----------|------------|--------|
| 4096×32×8 (old) | 2.1ms | 4.7x | baseline |
| 2048×32×16 | 1.3ms | 9.5x | 40% faster, 2x sep |
| **1024×32×32** | **997µs** | **13.0x** | **2.1x faster, 2.8x sep** |
| 512×64×32 | 800µs | 12.7x | 2.6x faster, 2.7x sep |

<div style="max-width: 600px; margin: 1.5rem auto; font-size: 0.9em">

<div style="font-weight: bold; text-align: center; margin-bottom: 0.2rem; font-size: 0.95em">Iso-Compute: Same Budget, Better Separation</div>
<div style="text-align: center; font-size: 0.75em; color: var(--sl-color-gray-4); margin-bottom: 0.8rem">Separation (blue) ↑ better · Latency (gray) ↓ better</div>

<div style="margin-bottom: 0.5rem">
<div style="font-size: 0.8em; margin-bottom: 0.25rem; color: var(--sl-color-gray-3)">4096×32×8 <span style="color: var(--sl-color-gray-4)">(old baseline)</span></div>
<div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.15rem">
<div style="background: #4a9eff; height: 1.2rem; border-radius: 2px; width: 36%"></div>
<span style="font-size: 0.8em">4.7x separation</span>
</div>
<div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.5rem">
<div style="background: var(--sl-color-gray-4); height: 0.6rem; border-radius: 2px; width: 100%"></div>
<span style="font-size: 0.8em; flex-shrink: 0">2.1ms</span>
</div>
</div>

<div style="margin-bottom: 0.5rem">
<div style="font-size: 0.8em; margin-bottom: 0.25rem; color: var(--sl-color-gray-3)">2048×32×16</div>
<div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.15rem">
<div style="background: #4a9eff; height: 1.2rem; border-radius: 2px; width: 73%"></div>
<span style="font-size: 0.8em">9.5x separation</span>
</div>
<div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.5rem">
<div style="background: var(--sl-color-gray-4); height: 0.6rem; border-radius: 2px; width: 62%"></div>
<span style="font-size: 0.8em; flex-shrink: 0">1.3ms</span>
</div>
</div>

<div style="margin-bottom: 0.5rem; padding: 0.4rem; border: 1px solid #4a9eff33; border-radius: 4px">
<div style="font-size: 0.8em; margin-bottom: 0.25rem; color: var(--sl-color-white)"><strong>1024×32×32 ★ winner</strong></div>
<div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.15rem">
<div style="background: #4a9eff; height: 1.2rem; border-radius: 2px; width: 100%"></div>
<span style="font-size: 0.8em; flex-shrink: 0"><strong>13.0x</strong> separation</span>
</div>
<div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.15rem">
<div style="background: var(--sl-color-gray-4); height: 0.6rem; border-radius: 2px; width: 48%"></div>
<span style="font-size: 0.8em; flex-shrink: 0"><strong>997µs</strong></span>
</div>
</div>

<div style="margin-bottom: 0.5rem">
<div style="font-size: 0.8em; margin-bottom: 0.25rem; color: var(--sl-color-gray-3)">512×64×32</div>
<div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.15rem">
<div style="background: #4a9eff; height: 1.2rem; border-radius: 2px; width: 98%"></div>
<span style="font-size: 0.8em">12.7x separation</span>
</div>
<div style="display: flex; align-items: center; gap: 0.4rem">
<div style="background: var(--sl-color-gray-4); height: 0.6rem; border-radius: 2px; width: 38%"></div>
<span style="font-size: 0.8em; flex-shrink: 0">800µs</span>
</div>
</div>

</div>

Same compute budget. Redistributing FLOPS from DIM into K — more deflation steps on smaller vectors — produced 2.1x faster processing AND 2.8x better separation between normal and anomalous traffic. The winner config (DIM=1024, K=32, 32 stripes) dropped below 1ms for the first time while tripling the geometric margin.

Why? The eigenvalue structure told the story: every config showed `explained_ratio = 1.0` with only 1 non-zero eigenvalue per stripe. Per-stripe data is rank-1 (~1.7 bindings per stripe on average). K doesn't capture additional eigenvalues — it deflates noise. More deflation steps on rank-1 data means cleaner residuals. DIM just adds dimensions for the noise to hide in.

I should be honest here: I can read that paragraph back and follow the logic, but I didn't derive it. The LLM explained the eigenvalue analysis. I asked "why does K matter more than DIM?" and it walked me through the rank-1 structure, the deflation interpretation, the noise floor argument. I ran the experiments, I read the numbers, I made the engineering decisions — but the linear algebra intuition came from an LLM that has internalized decades of spectral analysis literature. I use CCIPCA, cosine similarity, eigenvalue decomposition, and Gini coefficients the way I use a power drill — I know what they do, I know when to reach for them, I can build things with them. I don't know how to manufacture them. The formal education would have made the vocabulary easier. It wouldn't have changed the result — the result comes from the algebra, not the credential. But the LLMs are what made the algebra accessible to someone who dropped out of computer science fifteen years ago.

The full DIM × K interaction table confirmed this:

| DIM | K=8 | K=16 | K=32 |
|-----|-----|------|------|
| 512 | 5.5x | 10.1x | **13.1x** |
| 1024 | 5.1x | 10.1x | 13.0x |
| 4096 | 4.7x | 9.2x | 13.0x |

<div style="max-width: 500px; margin: 1.5rem auto; font-size: 0.9em">

<div style="font-weight: bold; text-align: center; margin-bottom: 0.8rem; font-size: 0.95em">More Deflation Steps = Better Separation <span style="font-weight: normal; font-size: 0.85em; color: var(--sl-color-gray-4)">(DIM=1024)</span></div>

<div style="margin-bottom: 0.5rem">
<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem">
<span style="width: 3rem; text-align: right; flex-shrink: 0; font-size: 0.85em; color: var(--sl-color-gray-3)">K=8</span>
<div style="background: #4a9eff; height: 1.3rem; border-radius: 2px; width: 39%"></div>
<span style="flex-shrink: 0; font-size: 0.85em">5.1x</span>
</div>
<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem">
<span style="width: 3rem; text-align: right; flex-shrink: 0; font-size: 0.85em; color: var(--sl-color-gray-3)">K=16</span>
<div style="background: #4a9eff; height: 1.3rem; border-radius: 2px; width: 78%"></div>
<span style="flex-shrink: 0; font-size: 0.85em">10.1x</span>
</div>
<div style="display: flex; align-items: center; gap: 0.5rem">
<span style="width: 3rem; text-align: right; flex-shrink: 0; font-size: 0.85em; color: var(--sl-color-gray-3)">K=32</span>
<div style="background: #4a9eff; height: 1.3rem; border-radius: 2px; width: 100%"></div>
<span style="flex-shrink: 0; font-size: 0.85em"><strong>13.0x</strong></span>
</div>
</div>

<div style="text-align: center; font-size: 0.75em; color: var(--sl-color-gray-4)">Doubling K roughly doubles separation. The table above shows DIM doesn't matter — all three DIM values land within ±0.4x at each K.</div>

</div>

K=8 to K=16 nearly doubles separation. K=16 to K=32 adds another 30%. And the table shows the punchline: DIM barely matters. DIM=512 at K=32 (13.1x) beats DIM=4096 at K=16 (9.2x). The quality lever is deflation depth, not vector width.

Across every configuration tested: **0% FPR and 0% FNR** — but this is a synthetic scenario with cleanly separated traffic classes. The sweep was about performance, not correctness; the zero error rates reflect the clean class separation in the test data, not a guarantee for production traffic.

The config shipped as DIM=1024, K=32, STRIPES=32. `sigma_mult` was widened from 3.5 to 5.0 to accommodate the tighter residual distribution at higher K — this eliminated false positives on real DVWA traffic that the old threshold had been marginal on.

Control experiment: **Nikto finds 17 vulnerabilities hitting DVWA directly. Through the spectral firewall at the new config: zero.**

---

## The WAF Dashboard

The striped encoding commit also shipped a new dashboard. The existing `:9090/` dashboard showed aggregate charts — enforcement rates, anomaly scores, DAG visualization. The new `/waf` endpoint shows individual request verdicts.

Each request produces a verdict card: green for Allow, red for Deny, orange for RateLimit, blue for Warmup. The card contains the full request rendered as color-coded JSON — anomalous fields highlighted. Spectral attribution bars rank which dimensions contributed to the verdict. An anomaly gauge tracks the aggregate residual score across the sliding window.

The rendering uses `requestAnimationFrame` batching with scroll-pause — incoming verdict cards queue up and render in batches on each animation frame, and rendering pauses entirely when the user scrolls up to inspect a specific card. Under a 2,000 RPS flood, this maintains 60fps instead of the DOM thrashing you'd get from appending elements on every SSE event.

<div style="display: flex; flex-direction: column; align-items: center; text-align: center">

<video controls autoplay loop muted playsinline style="max-width: 100%">
  <source src="/demo-waf-dashboard.mp4" type="video/mp4" />
</video>

*The WAF dashboard streams every proxy verdict in real time. Each card shows the full request as color-coded JSON — anomalous fields highlighted. The spectral attribution bars rank which dimensions contributed to the deny decision: TLS cipher ordering, path structure, header values. The anomaly gauge tracks the aggregate residual score across the sliding window.*

</div>

---

## TLS Attribution Dominance

I noticed something in the attribution logging: across 4,520 deny events against Nikto, `tls.ext_order.[1]` appeared in **99.5%** of denials as the top contributing field. Nikto's cipher suite and extension ordering collectively outranked all HTTP-level fields in cosine attribution.

This is technically correct — it's the same signal as JA3 and JA4 fingerprinting. Nikto's TLS stack produces a distinctly different ClientHello from a real browser. With ~30 TLS leaf bindings per request (cipher order, extension order, group order, set-based variants), the TLS fingerprint collectively dominates the anomaly.

The practical limitation: this means the spectral firewall's attribution is "this client has a weird TLS fingerprint" for almost every denial, even when the HTTP-level behavior (path probing, missing headers, no cookies) is equally anomalous. The detection is correct — the traffic IS anomalous — but the *explanation* is one-dimensional. HTTP fields appear in the attribution tail but rarely crack the top-5.

This isn't a bug to fix. It's a finding to understand. TLS fingerprinting is a powerful detection signal — so powerful that it dominates when present. For attacks that use a legitimate browser TLS stack (browser-based bots, compromised machines), the TLS signal disappears and HTTP attribution takes over. The system adapts — but the operator looking at the dashboard during a Nikto scan will see TLS fields dominating, which could be misleading about which layer of defense is doing the work.

---

## char_list Encoding: Fuzzy String Matching (March 5)

The original encoding treated string fields as atomic hashes — `Mozilla/5.0 (Windows NT 10.0)` and `Mozilla/5.0 (X11; Linux)` produced maximally orthogonal vectors. Two user-agent strings sharing 90% of their content had zero vector similarity. The subspace had to learn each variant independently, and adaptive learning couldn't generalize — every unseen string looked maximally anomalous regardless of how similar it was to known traffic.

### Touching holon-rs Core

The fix required changes to holon-rs itself — the core library — not just the proxy. This was the first time I'd touched the encoder since holon-rs stabilized a month earlier.

The `Walkable` trait defines how data structures describe themselves for encoding — the contract between application code and the VSA encoder. Each field returns a `WalkableValue` variant: `Scalar` (atomic hash), `List` (positional composition into one vector), `Set` (unordered composition), `Map`. Atomic strings use `Scalar`. TLS cipher suites and extension lists use `List`. But for HTTP headers, I needed something the system didn't have: per-element fan-out, where each header gets its own independent leaf binding so the drilldown can attribute anomalies to *individual* headers rather than the header collection as a whole.

So I added `Spread` — a new `WalkableValue` variant. `Spread` is the inverse of `List`: instead of composing items into one vector, each element fans out into its own indexed path (`headers.[0]`, `headers.[1]`, ...) and gets its own leaf binding. Both encoders had to learn the new semantics — the striped encoder had been silently flattening `List` into independent bindings, which was wrong (it destroyed the positional composition that makes `List` useful for fuzzy matching). 88 lines across `encoder.rs` and `walkable.rs` to get `List`, `Set`, and `Spread` all encoding correctly in both paths.

### The char_list Helper

With `Spread` in place, `char_list` decomposes a string into a `List` of single-character scalars:

```rust
fn char_list(s: &str) -> WalkableValue {
    WalkableValue::List(
        s.chars().map(|c| scalar_s(c.to_string())).collect()
    )
}
```

Position matters — `"abc"` and `"abd"` share the first two character bindings and differ on the third. Similar strings produce similar vectors. Character-level 1-gram encoding with positional binding.

Every field in `RequestSample`'s `Walkable` implementation needed a decision: atomic or char_list? Categorical identifiers (method, header names, cookie keys) stay `Scalar` — `Content-Type` should be an exact match. High-cardinality values (path, query, header *values*, src_ip) get `char_list` — `text/html; charset=utf-8` should fuzzy-match with `text/html`. Headers became `Spread` of `[name, char_list(value)]` pairs — each header independently attributable, with the name as an exact anchor and the value fuzzy-matched.

### What Changed

Leaf count dropped from ~100 per request to ~53 (normal) and ~36 (attack). The `List` composition collapses what was previously many individual atoms into single composed bindings. With 32 stripes, each stripe now holds ~1.7 bindings — solidly rank-1, exactly what the parameter sweep's eigenvalue analysis predicted.

But the real payoff was in adaptive learning. With atomic encoding, the residual buffer couldn't stabilize — every unseen user-agent variant or path looked maximally anomalous, so `buf_max` kept jumping and the self-calibrating boundaries never converged. With `char_list`, a path like `/products/12345` that the baseline had never seen but was structurally similar to `/products/67890` produced a moderate residual instead of a maximum one. The boundaries stabilized. Soft updates started working.

Live attribution showed the gradient:

- `/` (seen during warmup): not in top-5 attributions
- `/cgi-bin/` (real path, unseen): attribution score 0.6
- `/CCsGfZ2r.eml` (random probe): attribution score 0.7

Fuzzy matching in action — the cosine between the learned normal and a slightly-unusual-but-real path is closer than the cosine between normal and a random scanner probe.

These changes live in holon-rs (the Rust library) and the proxy's `Walkable` implementation. The Python reference implementation still uses the old atomic string encoding — backporting `char_list` and `Spread` is on the list, but the Rust side is where the live system runs.

### K Re-Optimization

K was re-optimized from 32 to 20 based on the new encoding. With ~1.7 leaves per stripe, K=32 was over-deflating — extracting noise structure that wasn't there. A fine-grained sweep (K=8 through K=32, step 2) found a dramatic knee:

<div style="max-width: 520px; margin: 1.5rem auto; font-size: 0.85em">
<div style="font-weight: bold; text-align: center; margin-bottom: 0.5rem; font-size: 0.95em">K Re-Optimization After char_list (DIM=1024, 32 stripes)</div>
<div style="display: flex; gap: 0.3rem; font-size: 0.75em; justify-content: center; margin-bottom: 0.6rem">
<span><span style="display: inline-block; width: 0.8em; height: 0.8em; background: #4a9eff; border-radius: 1px; vertical-align: middle"></span> Separation (×)</span>
<span style="margin-left: 0.8rem"><span style="display: inline-block; width: 0.8em; height: 0.8em; background: #ff6b6b; border-radius: 1px; vertical-align: middle"></span> Deny margin</span>
</div>

<div style="margin-bottom: 0.35rem">
<div style="display: flex; align-items: center; gap: 0.3rem">
<span style="width: 2rem; text-align: right; flex-shrink: 0; color: var(--sl-color-gray-3)">K=8</span>
<div style="flex: 1; display: flex; gap: 2px">
<div style="background: #4a9eff; height: 1rem; border-radius: 2px; width: 45%" title="3.2x separation"></div>
</div>
<span style="flex-shrink: 0; width: 3rem; font-size: 0.85em">3.2×</span>
<span style="flex-shrink: 0; width: 5.5rem; font-size: 0.85em; color: #ff6b6b; font-weight: bold">−8 FAIL</span>
</div>
</div>

<div style="margin-bottom: 0.35rem">
<div style="display: flex; align-items: center; gap: 0.3rem">
<span style="width: 2rem; text-align: right; flex-shrink: 0; color: var(--sl-color-gray-3)">K=12</span>
<div style="flex: 1; display: flex; gap: 2px">
<div style="background: #4a9eff; height: 1rem; border-radius: 2px; width: 49%" title="3.5x separation"></div>
</div>
<span style="flex-shrink: 0; width: 3rem; font-size: 0.85em">3.5×</span>
<span style="flex-shrink: 0; width: 5.5rem; font-size: 0.85em; color: #ff6b6b; font-weight: bold">−1 FAIL</span>
</div>
</div>

<div style="margin-bottom: 0.35rem">
<div style="display: flex; align-items: center; gap: 0.3rem">
<span style="width: 2rem; text-align: right; flex-shrink: 0; color: var(--sl-color-gray-3)">K=14</span>
<div style="flex: 1; display: flex; gap: 2px">
<div style="background: #4a9eff; height: 1rem; border-radius: 2px; width: 52%" title="3.7x separation"></div>
</div>
<span style="flex-shrink: 0; width: 3rem; font-size: 0.85em">3.7×</span>
<span style="flex-shrink: 0; width: 5.5rem; font-size: 0.85em; color: #e8a838">+9 tight</span>
</div>
</div>

<div style="margin-bottom: 0.35rem">
<div style="display: flex; align-items: center; gap: 0.3rem">
<span style="width: 2rem; text-align: right; flex-shrink: 0; color: var(--sl-color-gray-3)">K=16</span>
<div style="flex: 1; display: flex; gap: 2px">
<div style="background: #4a9eff; height: 1rem; border-radius: 2px; width: 58%" title="4.1x separation"></div>
</div>
<span style="flex-shrink: 0; width: 3rem; font-size: 0.85em">4.1×</span>
<span style="flex-shrink: 0; width: 5.5rem; font-size: 0.85em; color: #7bc96f">+20</span>
</div>
</div>

<div style="margin-bottom: 0.35rem">
<div style="display: flex; align-items: center; gap: 0.3rem">
<span style="width: 2rem; text-align: right; flex-shrink: 0; color: var(--sl-color-gray-3)">K=18</span>
<div style="flex: 1; display: flex; gap: 2px">
<div style="background: #4a9eff; height: 1rem; border-radius: 2px; width: 72%" title="5.1x separation"></div>
</div>
<span style="flex-shrink: 0; width: 3rem; font-size: 0.85em">5.1×</span>
<span style="flex-shrink: 0; width: 5.5rem; font-size: 0.85em; color: #7bc96f">+39</span>
</div>
</div>

<div style="margin-bottom: 0.35rem; background: rgba(74, 158, 255, 0.08); padding: 0.15rem 0.3rem; border-radius: 3px; border-left: 3px solid #4a9eff">
<div style="display: flex; align-items: center; gap: 0.3rem">
<span style="width: 2rem; text-align: right; flex-shrink: 0; font-weight: bold">K=20</span>
<div style="flex: 1; display: flex; gap: 2px">
<div style="background: #4a9eff; height: 1rem; border-radius: 2px; width: 94%" title="6.7x separation"></div>
</div>
<span style="flex-shrink: 0; width: 3rem; font-size: 0.85em; font-weight: bold">6.7×</span>
<span style="flex-shrink: 0; width: 5.5rem; font-size: 0.85em; color: #4a9eff; font-weight: bold">+59 ✓</span>
</div>
</div>

<div style="margin-bottom: 0.35rem">
<div style="display: flex; align-items: center; gap: 0.3rem">
<span style="width: 2rem; text-align: right; flex-shrink: 0; color: var(--sl-color-gray-3)">K=24</span>
<div style="flex: 1; display: flex; gap: 2px">
<div style="background: #4a9eff; height: 1rem; border-radius: 2px; width: 97%" title="6.9x separation"></div>
</div>
<span style="flex-shrink: 0; width: 3rem; font-size: 0.85em">6.9×</span>
<span style="flex-shrink: 0; width: 5.5rem; font-size: 0.85em; color: #7bc96f">+61</span>
</div>
</div>

<div style="margin-bottom: 0.35rem">
<div style="display: flex; align-items: center; gap: 0.3rem">
<span style="width: 2rem; text-align: right; flex-shrink: 0; color: var(--sl-color-gray-3)">K=28</span>
<div style="flex: 1; display: flex; gap: 2px">
<div style="background: #4a9eff; height: 1rem; border-radius: 2px; width: 99%" title="7.0x separation"></div>
</div>
<span style="flex-shrink: 0; width: 3rem; font-size: 0.85em">7.0×</span>
<span style="flex-shrink: 0; width: 5.5rem; font-size: 0.85em; color: #7bc96f">+63</span>
</div>
</div>

<div style="margin-bottom: 0.35rem">
<div style="display: flex; align-items: center; gap: 0.3rem">
<span style="width: 2rem; text-align: right; flex-shrink: 0; color: var(--sl-color-gray-3)">K=32</span>
<div style="flex: 1; display: flex; gap: 2px">
<div style="background: #4a9eff; height: 1rem; border-radius: 2px; width: 100%" title="7.1x separation"></div>
</div>
<span style="flex-shrink: 0; width: 3rem; font-size: 0.85em">7.1×</span>
<span style="flex-shrink: 0; width: 5.5rem; font-size: 0.85em; color: #7bc96f">+63</span>
</div>
</div>

<div style="text-align: center; font-size: 0.8em; color: var(--sl-color-gray-3); margin-top: 0.5rem; font-style: italic">Knee at K=20: separation jumps from 5.1× to 6.7×, then plateaus. K=20→32 buys 6% more separation at 44% more latency.</div>
</div>

K=8 through K=12 *fail in live validation* — the deny margin goes negative, meaning attack scores fall below the deny threshold. K=14 barely works. The knee at K=20 is where noise deflation becomes effective: below 20, there are still enough noisy dimensions to inflate the normal residual and widen the threshold. Above 20, you're deflating noise that isn't there. K=20 at 167µs gives nearly identical deny margin to K=32 at 240µs — 30% less latency for the same protection. Live validation confirmed: 9,971 Nikto denials, 18 informational-only findings, 0 exploitable vulnerabilities.

---

## Self-Calibrating Decision Boundaries (March 6)

Everything so far tested sequential scenarios: normal traffic, then attack traffic, then recovery. Real traffic doesn't work that way — legitimate users and attackers arrive concurrently, not in phases. The spectral firewall needed a test that looked more like the real thing. That meant building a lab.

### The Concurrent Lab

The setup reused the LLM browser agent infrastructure from `holon-lab-baseline` — the Playwright + Ollama stack I'd built weeks earlier for generating realistic WordPress traffic. Adapted here for DVWA: 20 LLM-driven browser agents running Grok-4-fast via Playwright, three browser engines (80% Chromium, 15% WebKit, 5% Firefox), each agent performing realistic DVWA browsing — login, navigate, submit forms, click links. Alongside them, concurrently: Nikto, ZAP, and Nuclei running their full scan suites against the same proxy.

Getting 20 browsers to look like 20 distinct clients took some plumbing. Each agent needed its own source IP — the spectral firewall encodes `src_ip` as a binding, so if all 20 agents share `127.0.0.1`, the baseline learns that all traffic comes from one address and any other IP looks anomalous. I set up a `dummy0` interface with 20 addresses (10.99.0.1–20) and configured local TCP forwarding so each Playwright instance binds to its own IP. Not conceptually hard, but the kind of networking yak-shave that eats an afternoon: getting the kernel routing right, making sure the proxy sees the real source address instead of the forwarded one, verifying that TLS handshakes carry the correct source through the entire pipeline.

Traffic source labeling via `X-Traffic-Source` header — stripped before VSA encoding so the spectral firewall can't cheat. The label is only used for post-hoc analysis to determine which verdicts were true positives and which were false positives.

90 seconds of browser-only warmup, then ~140 seconds of mixed traffic.

Results:

| Verdict | Browser agents | Attack tools |
|---------|---------------|-------------|
| Deny | **0** | **3,605** |
| Rate-limit | **0** | **30** |

**Zero false positives.** Every denied request came from an attack tool. Every browser agent request was allowed. The LLM-driven browsers are more diverse than a single user but less diverse than real production traffic — 20 instances across 3 browser engines is a stronger test than synthetic scenarios but not a substitute for genuine organic traffic at scale.

This didn't work on the first try. The first run blocked nothing — 0 denials, 1,374 adaptive learns (the system was learning attack traffic as normal), 27 manifold republishes (each republish shifted the baseline closer to the attacker). Three cascading issues:

| Parameter | Before | After | Problem |
|-----------|--------|-------|---------|
| `sigma_mult` | 5.0 | 3.0 | Threshold inflated by diverse training data |
| `deny_mult` | 2.0x | 1.5x | Deny floor too high for tighter thresholds |
| `ADAPTIVE_RESIDUAL_GATE` | 0.7 | 0.5 | Overly permissive → model self-poisoning |

The diverse training data (20 different browser configurations) increased the variance of normal traffic, which inflated the CCIPCA threshold. The wider threshold pushed the deny floor (`threshold × deny_mult`) above the attack scores. The overly permissive adaptive gate (0.7 of threshold) admitted attack samples into the learning loop, which shifted the baseline toward the attack distribution, which lowered the scores further.

Run 2 with the tightened parameters: 3,605 denials, 0 FP. But tightening magic numbers by hand is exactly the problem. The right answer is to eliminate the magic numbers entirely.

### Deriving Thresholds from Data

Constants tuned for Nikto-only traffic failed against diverse concurrent traffic. Constants re-tuned for diverse traffic might fail against a different mix. Every deployment would need its own calibration. That's not a product.

The solution: derive all decision boundaries from the observed data.

**`ResidualBuffer`** — a rolling buffer (capacity 500) that tracks confirmed-normal residuals. A residual enters the buffer only if the request was allowed AND the backend returned 2xx or 3xx. The backend response gate is critical: if the spectral firewall allows a request that the backend rejects (4xx, 5xx), the request's residual doesn't inform the threshold. This prevents error-response traffic from inflating the baseline.

Two thresholds derived from the buffer:

```
score_threshold = buf_max
deny_threshold  = sqrt(buf_max × CCIPCA_threshold)
```

`score_threshold` is the empirical allow ceiling — the largest residual the system has ever seen from confirmed-normal traffic. If a new request's residual falls below this, it's within the observed normal range.

`deny_threshold` uses the geometric mean of the empirical maximum and the statistical estimate from CCIPCA. This is the key insight: `buf_max` alone is too tight during early convergence (the buffer hasn't seen enough samples to represent the full normal distribution). CCIPCA's threshold alone is too loose (it's a statistical estimate, not an empirical bound). The geometric mean splits the difference — conservative enough to avoid false positives during convergence, tight enough to catch attacks once the buffer stabilizes.

No `sigma_mult`. No `deny_mult`.

The death spiral bug was the hardest to find: `buf_max × 2.0` as the deny threshold (an earlier attempt) was too tight during early convergence, which denied normal traffic, which prevented learning, which froze the threshold at its initial too-tight value, which denied more normal traffic. The geometric mean fix breaks this cycle because `CCIPCA_threshold` provides a loose upper bound that allows learning to continue even when `buf_max` is small.

### Anomaly Breadth

The `ResidualBuffer` alone doesn't solve the poisoning problem from run 1. The adaptive learning gate — the thing that decides which post-warmup samples are safe to learn from — still needs to reject attack traffic without a hardcoded threshold.

Detection says "is this request anomalous?" Attribution says "which fields?" Breadth asks a third question: "is the anomaly concentrated in a few fields, or spread across many?" A narrow anomaly — one unusual header value on an otherwise normal request — is probably a legitimate variant the baseline should absorb. A broad anomaly — unusual across TLS fingerprint, header structure, path pattern, and cookie presence simultaneously — is probably an attack.

Three threshold-free metrics quantify this:

- **Concentration** (max / mean score): high = narrow, one field dominates
- **Shannon entropy** (normalized [0,1]): high = broad, energy spread uniformly
- **Gini coefficient** ([0,1]): low = broad, high = concentrated

The dangerous quadrant is **broad + sub-threshold**: a request that doesn't trigger the residual threshold but is moderately anomalous across many dimensions. This is the profile of slow poisoning — exactly what run 1 demonstrated. The breadth gate prevents learning from these: only narrow, sub-threshold, backend-confirmed-success samples update the baseline. No `ADAPTIVE_RESIDUAL_GATE` magic number. The breadth metrics are derived from the attribution scores themselves.

### Putting It Together

With the ResidualBuffer deriving thresholds and anomaly breadth guarding the learning gate, one more piece: the `StripedSubspace` is saved to disk on graceful shutdown and loaded on boot. A node that restarts resumes with its learned baseline instead of re-learning from scratch. No cold-start vulnerability. Configurable warmup count via `WARMUP_SAMPLES` env var.

The combined system: 5,118 attack denies, **99.1% precision** (5,118 / 5,166 total denies). The ~48 false positives all occurred during early convergence — the ResidualBuffer hadn't accumulated enough samples yet. Once the buffer stabilized, the thresholds converged to the correct boundary within about 30 seconds of post-warmup traffic.

<div style="display: flex; flex-direction: column; align-items: center; text-align: center">

<video controls autoplay loop muted playsinline style="max-width: 100%">
  <source src="/demo-self-calibrating.mp4" type="video/mp4" />
</video>

*20 LLM-driven browsers learning the baseline, then three scanners hitting simultaneously. The early minutes are noisy — the system is still figuring out what "normal" looks like, and some legitimate requests get caught in the crossfire as the ResidualBuffer fills and the thresholds converge. Watch the deny count during warmup: it's not zero. That's honest convergence, not a tuned demo. Once the scanners arrive, nearly all the noise is gone — scanner probes light up red while browser traffic flows through. A stray false positive still slips through at steady state. This is a lab with 20 synthetic browsers — a real deployment would have orders of magnitude more observational data to build a richer representation of "normal," and that FP rate would shrink accordingly. No hardcoded thresholds. The boundaries calibrated themselves from live traffic.*

</div>

---

## Von Neumann's Three Properties

Somewhere during the self-calibration work, I realized this system had crossed a line I hadn't been aiming at.

John von Neumann described three properties of self-reproducing automata: the automaton must contain a *description* of itself, a *constructor* that can build a copy from that description, and the description must function as both data and program. He was talking about cellular automata and the theoretical underpinnings of biological reproduction. He wasn't talking about firewalls.

But the spectral firewall satisfies all three. The engram — the `StripedSubspace` with its eigenvectors, eigenvalues, and threshold statistics — IS the description. It geometrically defines "what normal traffic looks like." Not rules, not signatures. A subspace. Serializable to disk, transferable between nodes, complete: given the engram, a new node knows what normal is without observing any traffic.

Warmup and adaptive learning are the constructor. Given traffic (or a federated engram from HQ), the system constructs its enforcement posture autonomously. No human tuning.

The part that caught me off guard: the engram is simultaneously data and program. The eigenvectors ARE the projection matrices used for classification. There's no "interpret the engram and produce a classifier" step. Serialized to disk, it's data — portable eigenvectors. Loaded into memory, it's a program — executable policy. The description's mathematical structure IS the interpretation. Von Neumann's infinite regress problem — needing an interpreter to use the description — doesn't apply. The algebra is self-interpreting.

HQ federation extends this to fleet scale: the engram replicates across nodes, each copy autonomously calibrates its own decision boundaries from local traffic, and the system's enforcement posture propagates without centralized coordination. The analogy to biological replication isn't decorative. It's structural.

---

## What This Week Proved

Three days of commits. Three problems from the end of the last post, all addressed.

Attribution crosstalk — eliminated by striped encoding with FQDN leaf hashing. The parameter sweep showed DIM is irrelevant for rank-1 data; K controls quality. Sub-millisecond with 13x separation.

Magic numbers — eliminated by the ResidualBuffer and geometric mean thresholds. The system calibrates itself from observed traffic. No `sigma_mult`. No `deny_mult`. No manual tuning.

Traffic diversity — 20 concurrent LLM browser agents alongside three vulnerability scanners. 3,605 attack denials, 99.1% precision. A stray false positive during convergence, near-zero at steady state. Not perfect — a lab with 20 synthetic browsers is a harder baseline to learn than real deployment traffic with thousands of diverse clients. The precision would improve with richer observations. But the architecture doesn't require tuning to get there.

The spectral firewall that existed on Tuesday night was a validated prototype with known limitations. By Friday it was self-calibrating, self-attributing, and proven against the most diverse concurrent traffic test the project has run. No hardcoded parameters. No signatures. No training data. No GPU. No rules authored by a human.

The geometry is the rule. The data calibrates the boundary. The algebra does the rest.

---

## Likely Contributions to the Field

- **Striped FQDN leaf hashing for crosstalk-free VSA attribution**: distributing leaf bindings across independent subspaces by fully-qualified domain name hash, reducing per-stripe binding count from ~100 to ~1.7 and eliminating the attribution crosstalk that makes monolithic high-dimensional encoding unusable for field-level anomaly explanation
- **Self-calibrating decision boundaries via empirical-statistical geometric mean**: `deny_threshold = sqrt(buf_max × CCIPCA_threshold)` — combining the tight empirical maximum of confirmed-normal residuals with the loose statistical estimate from incremental PCA, eliminating all hardcoded threshold multipliers while avoiding the convergence death spiral
- **Iso-compute parameter reallocation** (DIM → K): demonstrating that deflation steps (K) dominate detection quality over vector dimensionality (DIM) for rank-1 per-stripe data, enabling 2.1x latency reduction AND 2.8x separation improvement at identical compute budget
- **char_list positional character encoding for fuzzy VSA string matching**: decomposing strings into character-level positional bindings that preserve similarity between string variants, reducing leaf count by ~50% while enabling gradient-based attribution between seen, similar-unseen, and random strings
- **Von Neumann automaton framing for learned security postures**: the engram as simultaneously description and program (data-is-policy), with self-calibrating constructors and federated replication — eliminating the interpreter/policy separation that makes traditional WAF rule management brittle
