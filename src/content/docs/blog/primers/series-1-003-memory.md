---
title: "Holon Memory: Subspaces and Engrams"
description: How Holon learns geometric patterns from streaming data, snapshots them as engrams, and matches against them instantly on re-encounter.
date: 2026-02-21
---

The algebra ops reference covered how to operate on vectors you already have. This page covers how Holon *learns* — how it builds a geometric model of what "normal" looks like from a stream of examples, detects when something falls outside that model, and then persists that knowledge as a named, portable memory artifact called an engram.

This is the memory layer. It sits on top of the encoding stack and algebra ops, and it's what turns a collection of vector operations into a system that improves with experience.

A note on how this came together. At some point during the challenge batches, we built a 3D visualization — PCA projection of encoded traffic vectors, rendered so we could actually look at where things landed in space. Fake attack traffic and fake normal traffic showed up in dramatically different locations. Not close, not overlapping — separated. You could see it.

That's when it clicked. Those regions of space weren't arbitrary. They were measurable, describable, repeatable. If a cluster of vectors occupies a region, you can characterize that region geometrically. You can name it. You can ask whether a new vector falls inside or outside it. Engrams followed from that observation — they're the formalization of "this region of space is a thing we want to remember."

The theory came after the picture.

---

## The Core Concept: Manifold Learning

Any stream of encoded vectors — network packets, user events, document batches — occupies a region of the high-dimensional vector space. That region isn't random; it has structure. Normal HTTP traffic, for example, concentrates along certain directions: typical port distributions, common method/status combinations, characteristic byte-count ranges. The vectors don't fill all 16,384 dimensions equally — they cluster along a lower-dimensional manifold embedded in the full space.

`OnlineSubspace` learns that manifold from a stream of examples, one vector at a time, without storing any of the raw vectors. What it stores is a set of *principal components* — the directions of maximum variance in the observed data. These k directions (k ≪ dim — much less than — think 32 out of 16,384) define a subspace that captures the structure of normal.

Once learned, any new vector can be scored against the subspace. A vector that lies near the learned manifold has low reconstruction error (residual). A vector that falls far outside it — structurally unlike anything in the training stream — has high residual. That's the anomaly signal.

---

## `OnlineSubspace` — Incremental Manifold Learning

```
OnlineSubspace::new(dim=16384, k=32)
    dim: 16384  — vector dimensionality (must match encoder)
    k:   32     — number of principal components to track
```

Implemented using [CCIPCA (Candid Covariance-free Incremental PCA, Weng et al. 2003)](https://ieeexplore.ieee.org/document/1217609). CCIPCA updates the principal components one vector at a time with O(k·dim) cost per update — no matrix inversions, no batch requirements, no stored history. The subspace evolves continuously as new data arrives.

### Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| `k` | 32 | Number of principal components. More k = richer manifold model, higher compute cost. |
| `amnesia` | 2.0 | Forgetting exponent. Higher = forgets old data faster, adapts more quickly to drift. |
| `ema_alpha` | 0.01 | EMA decay for threshold tracking. Lower = smoother threshold, slower to adapt. |
| `sigma_mult` | 3.5 | How many standard deviations above the running average before something is flagged as anomalous. Higher = less sensitive, fewer false positives. |
| `reorth_interval` | 500 | Re-orthogonalize components every N updates to prevent numerical drift. |

### Core operations

**`update(vec)`** — Feed one vector into the subspace. Updates the mean, advances all k principal components via CCIPCA, updates the adaptive threshold EMA. Returns the residual of the new vector against the current subspace — useful for monitoring how anomalous the training stream is during warmup.

**`residual(vec)`** — Score a vector without updating. Returns reconstruction error: how far the vector falls from the learned manifold.

```python
def residual(x, mean, components):
    # Start with the centered vector
    remainder = x - mean
    # Remove the projection onto each principal component
    for component in components:
        projection = dot(remainder, component)  # how much of remainder lies along this component
        remainder = remainder - projection * component
    # What's left is the part the subspace can't explain
    return norm(remainder)
```

Low residual = the subspace explains most of the vector = in-distribution. High residual = the subspace can't account for it = anomalous.

**`project(vec)`** — Project a vector onto the subspace. Returns the component of the vector that lies within the learned manifold — what the subspace "recognizes" of the input.

**`reconstruct(vec)`** — Reconstruct the vector from the subspace. `mean + project(vec)`. The reconstructed vector is the subspace's best approximation of the input.

**`anomalous_component(vec)`** — The residual vector: `vec − reconstruct(vec)`. Not a scalar — the full-dimensional vector representing what the subspace *cannot* explain. This is the raw material for the surprise fingerprint.

**`threshold()`** — The current adaptive anomaly threshold. Updated every time `update()` is called:

```python
threshold = running_average_residual + sigma_mult * running_stddev_residual
```

"Is this vector anomalous?" is just `residual(vec) > threshold`. The threshold tracks the stream — if the stream gets noisier overall, the threshold rises to match. `sigma_mult` (default 3.5) controls how far above average something has to be before it trips the alarm.

**`explained_ratio()`** — Fraction of variance in the training stream captured by the k components. Useful for deciding whether k is large enough for the data.

**`snapshot()`** — Serialize the current subspace state into a `SubspaceSnapshot` — the mean vector, all k component vectors, and threshold state. Snapshots are what get stored in engrams.

---

## `Engram` — A Named Memory

An engram is a named, serializable snapshot of a trained `OnlineSubspace`, plus metadata.

An engram can be serialized to disk, sent over the wire, and loaded on a different machine — and it will score incoming vectors exactly the same way it did on the node that minted it. This works because every node independently derives the same atom vectors from the same hash function. The vectors stored inside the engram were computed in a space that every other node already lives in. Load the engram, start scoring — no setup, no sync, no negotiation. The [coordination-free post](/blog/primers/series-1-004-coordination-free/) covers why this works at the encoding level.

```python
@dataclass
class Engram:
    name:                 str               # human-readable label
    snapshot:             SubspaceSnapshot  # mean, 32 components, threshold state
    eigenvalue_signature: list[float]       # normalized, used for fast pre-filtering
    surprise_profile:     dict[str, float]  # field → surprise magnitude at mint time
    metadata:             dict[str, Any]    # application-defined
```

### What each field is

**`snapshot`** — The full learned subspace at the moment of minting. Sufficient to reconstruct the `OnlineSubspace` and score any new vector against it.

**`eigenvalue_signature`** — A compact fingerprint of the pattern's "shape" in vector space. Each principal component captures some amount of variance in the training data; the eigenvalue for that component says how much. Scaled so the whole list has length 1 (so two signatures are comparable regardless of how much data each subspace saw — you're comparing proportions, not raw magnitudes). Used as a fast pre-filter: before running full residual scoring against every engram, the library ranks candidates by eigenvalue similarity to narrow the field cheaply.

**`surprise_profile`** — A per-field breakdown of what drove the anomaly at mint time. Computed by unbinding the anomalous component with each field's role vector and measuring the result's magnitude. Higher magnitude = that field contributed more to the anomaly. Application-specific: in the DDoS lab, this maps to concrete field names (`src_ip`, `dst_port`, `ttl`). In other applications, whatever fields were encoded.

**`metadata`** — Arbitrary application-defined key-value pairs. The DDoS lab stores EDN rule strings here — the filtering rules that were active when the engram was minted. A fraud detection system might store transaction category labels. A user-behavior model might store session context. The engram doesn't interpret the metadata; it carries it.

### Minting

Engrams are minted through `EngramLibrary::add()` rather than constructed directly. The library computes the eigenvalue signature, validates the snapshot, and stores the engram under its name.

### Matching

`engram.residual(vec)` scores a probe vector against the engram's stored subspace. The result is the same reconstruction error as `OnlineSubspace::residual` — how far the probe falls from the pattern this engram learned. Low residual = the probe looks like the pattern this engram represents.

---

## `EngramLibrary` — Pattern Memory Bank

The library holds many engrams and provides efficient matching across all of them.

```python
library = EngramLibrary(dim=16384)
library.add("pattern_name", trained_subspace, surprise_profile, metadata)
matches = library.match_vec(probe_vec, top_k=3, prefilter_k=10)
# → [("pattern_name", residual), ...] sorted ascending (lower = better fit)
```

### Two-tier matching

Scoring every engram with full residual computation for every probe is O(n·k·dim) — expensive at scale. The library uses a two-tier strategy:

**Tier 1 — Eigenvalue pre-filter** (O(k·n)): Rank engrams by eigenvalue energy. Higher energy = the subspace captured more variance = a "broader" pattern. This is a cheap proxy for which engrams are plausible candidates. The top `prefilter_k` engrams proceed to tier 2.

**Tier 2 — Full residual scoring** (O(k·dim) per candidate): Compute actual reconstruction error for each candidate. Return top-k sorted ascending by residual.

For small libraries (≤ `prefilter_k` engrams), tier 1 is skipped and all engrams are scored directly.

### `match_spectrum` — Eigenvalue-only matching

```python
matches = library.match_spectrum(probe_eigenvalues, top_k=5)
# → [(name, cosine_similarity), ...] sorted descending
```

Even faster than `match_vec` — skips full residual computation entirely and just compares eigenvalue shapes using cosine similarity.

The interesting use case: instead of probing with a single packet vector, you train a short-window subspace over the last 30 seconds of traffic, then ask "does the *shape* of this window match any known pattern?" You're comparing learned geometry to learned geometry — the variance fingerprint of a live traffic window against the variance fingerprints of known attack patterns. If a SYN flood is building, the eigenvalue shape of the current window starts resembling the eigenvalue shape of previously seen SYN floods before any individual packet would trigger a residual hit. Early warning, cheap to compute, no per-packet scoring required.

### Persistence

```python
library.save("engrams.json")
library = EngramLibrary.load("engrams.json")
```

The full library serializes to JSON — mean vectors, component matrices, threshold state, eigenvalue signatures, surprise profiles, metadata. On load, subspaces are reconstructed lazily (on first `residual()` call) to avoid paying the full reconstruction cost upfront. On restart, previously learned patterns are immediately available for matching.

---

## The Full Lifecycle

```
warmup stream
    │
    ▼ update() for each vector
OnlineSubspace (adapting)
    │
    ▼ anomaly_streak ≥ threshold, attack subsides
snapshot() + add() to library
    │
    ▼ new probe arrives
EngramLibrary.match_vec(probe)
    │
    ├── residual below engram threshold → HIT: known pattern recognized
    │       └── application fires response (rules, alert, action, ...)
    │
    └── no hit → unknown pattern, begin learning new subspace
```

The engram isn't the action — it's the memory. What happens on a hit is entirely up to the application. The DDoS lab deploys firewall rules. A fraud system might flag a transaction. A recommendation engine might serve a cached result. The pattern recognition is the library's job; the response is yours.

---

## Surprise Fingerprint: Unbinding the Anomaly

The `surprise_profile` deserves a closer look because it demonstrates something specific about why Holon's algebraic transparency matters.

When a pattern is detected, the anomalous component is:

```
anomalous = vec - reconstruct(vec)   # what the subspace can't explain
```

This is a full-dimensional vector in the same space as everything else. Because of VSA's binding algebra, you can unbind it with any field's role vector to isolate that field's contribution:

```python
for field_name in ["src_ip", "dst_port", "ttl", ...]:
    role_vec = encoder.get_vector(field_name)
    unbound  = bind(anomalous_component, role_vec)
    surprise  = norm(unbound)   # higher = more anomalous in this field
```

The result is a ranked list of which fields drove the anomaly — not a black-box score, but a decomposed, interpretable attribution. This is only possible because the encoding is algebraically transparent: the field relationships are recoverable from the vector because they were built from reversible operations.

Concretely — given a packet that triggered the detector:

```python
packet = {
    "src_ip":   "203.0.113.42",
    "dst_ip":   "10.0.0.1",
    "dst_port": 53,
    "proto":    "UDP",
    "ttl":      245,
    "bytes":    1420,
    "tcp_flags": 0,
}

surprise_profile = {
    "dst_port":  0.91,   # strongly anomalous — port 53 unexpected
    "ttl":       0.87,   # strongly anomalous — TTL 245 unusual
    "bytes":     0.79,   # anomalous — 1420 bytes atypical for this traffic (near MTU)
    "proto":     0.41,   # mildly anomalous — UDP less common than TCP in baseline
    "src_ip":    0.12,   # unremarkable — IPs vary normally
    "dst_ip":    0.09,   # unremarkable
    "tcp_flags": 0.06,   # unremarkable — zero flags expected for UDP
}
```

`dst_port`, `ttl`, and `bytes` stood out. `src_ip`, `dst_ip`, and `tcp_flags` look normal — the subspace has seen plenty of that variation. A rule generator reading this can write `(and (= dst_port 53) (= ttl 245))` and ignore the rest.

The surprise profile is computed at mint time and stored in the engram. On a hit, it's immediately available — no recomputation needed.

---

## Likely Contributions to the Field

The same caveat as the algebra ops page: honest assessment, not a priority claim.

**The engram architecture as a whole.** HDC memory systems in the literature store class prototypes or cluster centroids — fixed vectors representing known categories. [LifeHD (2024)](https://arxiv.org/abs/2403.04759) uses a two-tier associative memory with cluster centroids. [GrapHD](https://www.frontiersin.org/articles/10.3389/fnins.2022.757125/full) stores graph-structured memories. None of these match Holon's approach: storing a full learned *subspace* (not a centroid) as the memory artifact, with eigenvalue pre-filtering for efficient retrieval, application-defined metadata attached to each engram, and a lifecycle that covers minting, matching, persistence, and cold-start recovery. The engram is not a prototype vector — it's a named, serializable learned manifold with an associated metadata payload.

**CCIPCA subspace learning as the detection primitive.** The HDC anomaly detection literature ([HyperDetect](https://discovery.researcher.life/article/hyperdetect-a-real-time-hyperdimensional-solution-for-intrusion-detection-in-iot-networks/de033f6a64413122a5ec093d5b136eed), and others) uses prototype vectors and cosine similarity thresholds. Holon provides `OnlineSubspace` — an online incremental PCA (CCIPCA) primitive that learns the manifold of observed data and scores new vectors as reconstruction error against it. The DDoS lab uses this for anomaly detection against normal traffic baselines; other applications can use it however they choose. The detection mechanism itself — manifold-aware rather than prototype-based — does not appear in the HDC literature we reviewed.

**Two-tier eigenvalue pre-filter for engram matching.** Using the normalized eigenvalue signature of a stored subspace as a fast pre-filter before full residual scoring — O(k·n) before O(k·dim) — is a specific engineering contribution. The eigenvalue signature encodes the "shape" of a learned pattern compactly enough to cheaply rank candidates before paying the full scoring cost.

**Field attribution via VSA unbinding of the anomalous component.** The surprise fingerprint — unbinding the reconstruction residual with field role vectors to isolate per-field anomaly contributions — exploits VSA's algebraic transparency in a way that doesn't appear in HDC anomaly detection literature. Neural anomaly detection systems can't do this at all; their representations aren't decomposable. Holon's can because the encoding is built from reversible operations.

**Passive upgrade via engram distribution.** A learned pattern can be serialized, transmitted, and matched against in the same vector space on any node — no code deployment, no vocabulary sync. The engram is a self-contained unit of geometric knowledge: load it, score against it, done. How consumers handle hot-loading is application-defined, but the format makes it viable in a way that prototype-vector or rule-based systems don't. This distribution model doesn't appear in the HDC deployment literature.

If any of this maps to existing published work, we'd genuinely want to know.
