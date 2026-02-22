---
title: "The Holon Algebra: Operations Reference"
description: The full set of algebraic primitives Holon provides on top of VSA — what each operation computes, the intuition behind it, and where it appeared in the experiments.
date: 2026-02-21
---

The VSA primer covered the three foundational operations: bind, bundle, cosine similarity. The encoding post covered how structured data becomes vectors in the first place — atomization, scalar encoding paths, the full atomize→bind→bundle stack. With those in place, you can encode documents and query them.

That's not enough. The experiments kept running into things the base algebra couldn't express cleanly: extracting the common pattern from a set of examples, detecting what changed between two states, asking "find this but not that," maintaining a running sense of normal over a stream. The following is the full set of operations Holon provides on top of the VSA foundation.

Format: what it computes, the intuition, the Python signature, and an application where one exists. The applications are illustrative, not exhaustive — these operations compose, and the interesting uses come from combining them.

---

## Core Algebra

### `bind` — Associate two vectors

```python
def bind(a, b):
    return a * b   # element-wise multiplication
```

Creates an association between two vectors. The result is approximately orthogonal to both inputs — it encodes the *relationship* between them, not either one alone. Covered in depth in the VSA primer; included here for reference as the foundation everything else builds on.

The self-inverse property: `bind(bind(A, B), A) = B`. Apply bind again with one component to recover the other. This is what makes `unbind` possible.

---

### `bundle` — Superpose multiple vectors

```python
def bundle(vectors):
    sums = [sum(v[i] for v in vectors) for i in range(len(vectors[0]))]
    return [1 if s > 0 else -1 if s < 0 else 0 for s in sums]
```

Element-wise majority vote across a list of vectors. The result is simultaneously similar to all inputs — a superposition. Lossy: individual components can't be perfectly recovered, but they can be probed via cosine similarity. Also covered in the primer; included here for completeness.

---

### `unbind` — Retrieve a component from a bound pair

```python
def unbind(bound, key):
    return bind(bound, key)   # self-inverse: same operation as bind
```

Binding is self-inverse for bipolar vectors: `bind(bind(A, B), A) = B`. Unbinding is just binding again with one of the original inputs. Given a document vector and a field name atom, `unbind` recovers the value vector that was bound to that field — or a noisy approximation of it if the document contains many fields.

**Application:** Field attribution / surprise fingerprint. In the DDoS sidecar, `unbind(anomalous_component, role_vector)` isolates how much each field contributed to the out-of-subspace direction. The result is a ranked list of fields by surprise magnitude — which fields drove the anomaly. This is what makes it possible to derive concrete filtering rules from a learned vector.

---

### `prototype` — Extract the category essence

```python
def prototype(vectors, threshold=0.5):
    stacked = np.stack(vectors)
    total = np.sum(stacked, axis=0)
    n = len(vectors)
    result = np.zeros_like(total)
    result[total >  n * threshold] =  1
    result[total < -n * threshold] = -1
    return result
```

Finds the dimensions where a set of vectors agree — the stable signal across examples, with incidental variation filtered out. The threshold controls strictness: 0.5 = majority vote, 1.0 = unanimous.

Unlike `bundle` (which preserves frequency), `prototype` discards frequency and extracts only what's consistent.

**Application:** Graph topology classification. `prototype(star_examples, threshold=0.5)` produces a "star-ness" vector — the structural features present in at least half the examples. Probe any unknown graph against it and get a similarity score. Challenge 002: 100% topology classification across five families with no labeled training data.

---

### `prototype_add` — Incremental prototype update

```python
def prototype_add(proto, example, count):
    weighted = proto.astype(float) * count + example.astype(float)
    return threshold_bipolar(weighted / (count + 1))
```

Updates an existing prototype with one new example without re-computing from scratch. Useful for online learning where examples arrive one at a time. `count` is the number of examples already incorporated; the new example is weighted accordingly.

---

### `negate` — X but not Y

```python
def negate(superposition, component, method="subtract"):
    # method="subtract"       — fast, approximate
    # method="orthogonalize"  — removes the component's direction entirely
    # method="flip"           — inverts the component's influence
    ...
```

Removes a component's influence from a superposition. Three methods depending on how cleanly you want the removal: `subtract` is fast and approximate; `orthogonalize` does proper geometric exclusion (projects out the component's direction); `flip` inverts its influence for stronger exclusion.

**Application:** Exclusion queries — "find recipes similar to pad thai but without shellfish." Encode the probe, negate the excluded component, search once. The geometry handles the filtering. Challenge 001 (spell search), challenge 003 (topic exclusion: differentiation but not integration, 5/5 precision).

---

### `amplify` — Strengthen a signal

```python
def amplify(superposition, component, strength=1.0):
    result = superposition.astype(float) + strength * component.astype(float)
    return threshold_bipolar(result)
```

Boosts a component's presence in a superposition. Items already similar to `component` score proportionally higher; unrelated items are unaffected.

**Application:** Query refinement. `amplify(query, known_good_prototype, strength=2.0)` sharpens the query toward a known category after an initial noisy search. Challenge 003: boosted matching scores from 0.22 to 0.59 (2.6×) with minimal effect on non-matching categories.

---

### `flip` — The opposite of a concept

```python
def flip(vec):
    return (-vec).astype(vec.dtype)   # +1 → -1, -1 → +1, 0 → 0
```

Element-wise negation. `similarity(vec, flip(vec)) ≈ -1.0`. The logical NOT of a vector — useful for encoding "the absence of X" or constructing queries that push away from a known direction.

---

### `blend` — Weighted interpolation

```python
def blend(vec1, vec2, alpha=0.5):
    result = (1 - alpha) * vec1.astype(float) + alpha * vec2.astype(float)
    return threshold_bipolar(result)
```

A vector geometrically between two inputs. Soft OR: items similar to either input score against the blend, with items similar to both scoring highest. `alpha` controls the balance.

**Application:** Fuzzy categorical queries — "find graphs that are either star-like or tree-like." Challenge 002. Also: intersection queries — "find quotes about both differentiation and integration" — `blend(diff_prototype, int_prototype)`. Challenge 003.

---

### `difference` — Compute what changed

```python
def difference(before, after):
    delta = after.astype(float) - before.astype(float)
    return threshold_bipolar(delta)
```

Encodes the delta between two states as a vector. Positive dimensions: what `after` has that `before` didn't. Negative dimensions: what was lost. The result lives in the same space as any other vector and can be probed, bound, or bundled.

**Application:** Transformation rule extraction. In Raven's Progressive Matrices (challenge 002), `difference(cell_A, cell_B)` encodes the structural change between cells. Consistent transformation rules cluster at ~0.58 cosine similarity within a type vs ~0.19 across types.

**Application:** Mitigation synthesis. `difference(attack_signature, baseline)` extracts the structural fingerprint of an attack — the dimensions where attack traffic diverges from normal. Those dimensions map back to concrete field values that become filtering rules. F1=1.000 on derived rules, challenge 011.

---

### `analogy` — Relational transfer

```python
def analogy(a, b, c):
    # A is to B as C is to ?
    delta = difference(b, a)
    return threshold_bipolar(c.astype(float) + delta.astype(float))
```

Transfers a learned relationship to a new context. If you know how A relates to B, apply that same transformation starting from C. Computes `C + (B - A)`.

**Application:** Cross-domain rule transfer. If "SYN flood against port 80" differs from baseline in a known direction, `analogy` can predict what "SYN flood against port 443" would look like — before seeing it. Explored in the challenge batches.

---

## Pattern Extraction

### `resonance` — Extract the agreeing dimensions

```python
def resonance(vec, reference):
    agree = (vec * reference) > 0
    result = np.zeros_like(vec)
    result[agree] = vec[agree]
    return threshold_bipolar(result)
```

Keeps only the dimensions of `vec` that agree in sign with `reference`. A soft filter: pulls out the part of a vector that's consistent with a known pattern, discarding the rest.

---

### `permute` — Positional encoding via circular shift

```python
def permute(vec, k):
    return np.roll(vec, k)   # shift all dimensions by k positions
```

Circular shift of vector dimensions. Applied to a sequence item before binding, it encodes position: `bind(permute(item, position), role)` distinguishes "item X at position 0" from "item X at position 1." Used internally by the positional list encoder.

---

### `cleanup` — Find closest match in a known set

```python
def cleanup(noisy, codebook):
    return max(codebook, key=lambda v: cosine_similarity(noisy, v))
```

Given a noisy or composed vector and a set of clean reference vectors, returns the closest match. The VSA equivalent of nearest-neighbor lookup — used to snap a probe result back to a known atom after unbinding introduces noise.

---

### `similarity_profile` — Similarity as a vector

```python
def similarity_profile(vec_a, vec_b):
    return (vec_a * vec_b).astype(np.int8)
```

Returns dimension-wise agreement between two vectors — not a scalar, but a full-length vector where each element encodes whether the two vectors agree (+1), disagree (-1), or are neutral (0) at that dimension. More information than cosine similarity alone; can be used to identify *which* dimensions drive similarity or dissimilarity.

---

### `complexity` — How mixed is this vector?

```python
def complexity(vec):
    # Returns 0.0 (clean single concept) to 1.0 (dense superposition)
    ...
```

Measures how much a vector is a superposition of many things vs. a clean single signal. Low complexity: the vector is close to a single atom or bound pair. High complexity: it encodes a large bundle with many components. Useful for deciding whether a probe result is meaningful or noise-dominated.

---

### `invert` — Reconstruct components from a vector

```python
def invert(vec, codebook, top_k=5, threshold=0.3):
    # Returns [(name, similarity), ...] sorted by similarity
    ...
```

Given a vector and a codebook of named reference vectors, returns the top-k matches above a similarity threshold. Inverse lookup: "what known things are encoded in this vector?" Used for debugging, introspection, and extracting human-readable structure from a learned or composed vector.

---

## Extended Algebra

### `attend` — Soft attention

```python
def attend(query, memory, strength=1.0, mode="soft"):
    # mode="soft"    — smooth weighting based on agreement
    # mode="hard"    — binary resonance (same as resonance())
    # mode="amplify" — boost agreeing dimensions proportionally
    ...
```

Weighted resonance — emphasizes the parts of `memory` that agree with `query`, suppressing the rest. Analogous to attention in transformer models but implemented as pure vector algebra with no learned weights. Three modes trade off smoothness against sharpness of the selection.

---

### `project` — Project onto a subspace

```python
def project(vec, subspace, orthogonalize=True):
    # Returns the component of vec that lies within the subspace
    # defined by the exemplar vectors
    ...
```

Finds the component of `vec` that can be explained by a set of exemplar vectors. `orthogonalize=True` runs Gram-Schmidt first to produce a proper orthogonal basis. The complement operation is `reject`.

**Application:** Engram matching. The baseline subspace is a learned manifold of normal traffic. `project(packet_vec, baseline_components)` reconstructs the packet as the subspace sees it; the residual (`vec - project(...)`) measures how far outside the normal manifold the packet falls.

---

### `reject` — What can't be explained by a subspace

```python
def reject(vec, subspace, orthogonalize=True):
    # Returns vec - project(vec, subspace)
    # The residual: what the subspace cannot reconstruct
    ...
```

The orthogonal complement of `project`. Extracts the component of `vec` that lies *outside* the subspace — what's anomalous, what's novel, what the learned normal can't account for. High residual = anomalous.

**Application:** Anomaly detection. The sidecar scores every packet as `reject(packet_vec, baseline_subspace)`. If the residual exceeds the adaptive threshold, the packet is anomalous. This is the core detection mechanism.

---

### `conditional_bind` — Gated binding

```python
def conditional_bind(vec_a, vec_b, gate, mode="positive"):
    # Bind only where gate > 0 (mode="positive")
    # or gate < 0 (mode="negative")
    # or gate != 0 (mode="nonzero")
    # or |gate| > 75th percentile (mode="strong")
    ...
```

Binds two vectors only at dimensions where a gate condition is met. Selective binding: encodes a relationship only where a third vector "permits" it. Useful for conditional encoding — "bind A to B only where context C is active."

---

### `segment` — Find structural breakpoints in a stream

```python
def segment(stream, window=100, threshold=0.3, method="prototype"):
    # Returns list of indices where structural segments begin
    # method="prototype"   — compare to running prototype
    # method="diff"        — compare consecutive vectors
    # method="accumulator" — compare to running accumulator
    ...
```

Detects where the structural character of a vector stream changes. A breakpoint is a point where the current vector is sufficiently dissimilar to the recent baseline. Three methods trade off sensitivity against noise tolerance.

**Application:** Traffic regime detection. `segment(packet_stream)` identifies where traffic transitions from one regime to another — e.g., the onset of an attack, a shift in user behavior, a protocol change — without labeled examples.

---

## Vector Operations

### `sparsify` — Keep the strongest dimensions

```python
def sparsify(vec, k):
    # Zero all but the k dimensions with largest absolute values
    ...
```

Keeps only the top-k dimensions by magnitude, zeroing the rest. Reduces interference when bundling many vectors — noisy low-signal dimensions are suppressed before they pollute the superposition. Also useful for approximate nearest-neighbor indexing where sparse vectors are more efficient.

---

### `centroid` — True geometric average

```python
def centroid(vectors):
    sums = np.sum(np.stack([v.astype(float) for v in vectors]), axis=0)
    normalized = sums / np.linalg.norm(sums)
    return threshold_bipolar(normalized)
```

The continuous geometric mean of a set of vectors, normalized before thresholding. Unlike `bundle` (majority vote) or `prototype` (thresholded majority), `centroid` preserves the continuous weight distribution before committing to bipolar. Better for interpolation and gradient-like operations.

---

### `topk_similar` — Top-k retrieval

```python
def topk_similar(query, candidates, k=5):
    scores = [(i, cosine_similarity(query, c)) for i, c in enumerate(candidates)]
    return sorted(scores, key=lambda x: -x[1])[:k]
```

Returns the k most similar vectors from a candidate set. Generalization of `cleanup` (top-1) for retrieval, ranking, and recommendation. The basis of Holon's similarity search: encode a query document, run `topk_similar` against a stored vector set, return ranked results.

---

### `similarity_matrix` — Batch pairwise similarities

```python
def similarity_matrix(vectors):
    # Returns NxN matrix where matrix[i][j] = cosine_similarity(i, j)
    ...
```

All pairwise cosine similarities for a set of vectors. Useful for cluster analysis, visualizing separation between categories, and debugging encoding quality — if two prototypes that should be distinct score 0.8 against each other, the encoding has a collision problem.

---

### `bundle_with_confidence` — Bundle plus per-dimension margins

```python
def bundle_with_confidence(vectors):
    # Returns (bundled_vector, confidence_margins)
    # confidence_margins[i] = abs(sum_i) / n  ∈ [0.0, 1.0]
    # 0.0 = perfect tie at dimension i, 1.0 = unanimous
    ...
```

Like `bundle`, but also returns how confident the majority vote was at each dimension. A 512-to-512 tie and a 1000-to-24 majority both threshold to the same +1, but they carry very different levels of confidence. The margins can feed into weighted similarity scoring or guide `sparsify` to zero out low-confidence dimensions.

---

### `coherence` — Cluster tightness

```python
def coherence(vectors):
    # Mean pairwise cosine similarity
    # 1.0 = all identical, 0.0 = random/orthogonal, negative = anti-correlated
    ...
```

Measures how concentrated a set of vectors is. High coherence: they're all saying the same thing. Low coherence: they're spread across the space. 

**Application:** Attack signal detection. A window of network traffic with high coherence is homogeneous — potentially a volumetric attack. Normal traffic is diverse and incoherent. `coherence` gives a single number that summarizes the structural spread of a traffic window.

---

### `entropy` — Information content

```python
def entropy(vec):
    # Normalized Shannon entropy of the {-1, 0, 1} distribution
    # 0.0 = all same value, ~1.0 = equal distribution
    ...
```

Information-theoretic entropy of a vector's element distribution. A clean atom vector fresh from the hash function has near-maximum entropy (roughly equal +1, -1, 0 distribution). A heavily bundled superposition of many similar vectors loses entropy as dimensions saturate. Useful for diagnosing encoding quality and detecting degenerate vectors.

---

### `power` — Fractional binding strength

```python
def power(vec, exponent):
    # exponent=0   → zero vector (identity-like)
    # exponent=1   → original vector
    # 0 < exp < 1  → interpolate toward neutral
    # exp > 1      → sharpen (integer: repeated self-binding)
    ...
```

Raises a vector to a real-valued power. For bipolar vectors, fractional powers interpolate between the neutral vector and the original; integer powers apply repeated binding (which for bipolar vectors is periodic — odd powers return the original, even powers return the all-positive mask). Useful for continuous control of binding "strength."

---

### `random_project` — Dimensionality reduction

```python
def random_project(vec, target_dims, seed=42):
    # Johnson-Lindenstrauss random projection
    # Preserves pairwise distances with high probability
    ...
```

Reduces a high-dimensional vector to a lower-dimensional one while approximately preserving pairwise distances (Johnson-Lindenstrauss lemma). Useful when storing or transmitting many vectors and the full dimensionality isn't needed for the task at hand.

---

## Streaming Operations

### `accumulate` / `decay` — Frequency-preserving running bundle

```python
# Conceptually:
accumulator += new_vector       # accumulate
accumulator *= decay_factor     # decay older signal
baseline = normalize(accumulator)  # current "normal"
```

Maintains a running float sum over a stream — not thresholded, not normalized yet. Unlike `bundle` or `prototype` (which both threshold and lose frequency), the accumulator preserves the fact that a field appearing in 99% of packets should dominate the baseline 99× more than one appearing once.

**Application:** Baseline learning. Accumulate traffic over a warmup period; the result encodes the normal distribution of field values weighted by frequency. Challenge 010: F1=1.000 on HTTP anomaly detection at 8,339 requests/second, 0.12ms latency. The critical property: 99% benign traffic saturates normal dimensions; attack traffic's deviant dimensions stand out against that saturation.

---

### `accumulate_weighted` — Weighted accumulation

```python
def accumulate_weighted(accumulator, example, weight):
    return accumulator + weight * example.astype(float)
```

Like `accumulate` but with an explicit weight per vector. Useful when source reliability, recency, or confidence varies — a high-confidence signal can contribute more than a noisy one without requiring repeated addition.

---

### `merge_accumulators` — Combine parallel accumulators

```python
def merge_accumulators(accum_a, accum_b):
    return accum_a + accum_b
```

Adds two accumulators together. Since accumulation is a running float sum, merging is exact — no approximation, no information loss. Enables parallel accumulation: shard a stream across workers, accumulate independently on each, merge at the end. The result is identical to single-threaded accumulation over the combined stream.

**Application:** Distributed baseline learning. Multiple nodes accumulate their local traffic independently; merge into a shared baseline periodically. No coordination required during accumulation — only at merge time.

---

### `capacity` — How full is the accumulator?

```python
def capacity(accumulator, codebook_size):
    # Returns 1.0 (empty) → 0.0 (saturated)
    # Based on: max reliable items ≈ d / (2 * ln(codebook_size))
    ...
```

Estimates remaining capacity as a fraction of theoretical maximum. As more vectors accumulate, dimensions saturate and the ability to distinguish individual components degrades. When capacity approaches 0.0, adding more vectors produces diminishing returns — consider decaying, clearing, or snapshotting the accumulator.

---

### `purity` — How concentrated is the accumulator?

```python
def purity(accumulator):
    # Returns 1.0 (single clean vector) → ~1/N (N dissimilar vectors accumulated)
    # Analogous to Tr(ρ²) from quantum mechanics
    d = len(accumulator)
    return min(d / sum(v**2 for v in accumulator), 1.0)
```

Quantum-inspired concentration measure. A freshly accumulated single vector has purity ≈ 1.0. As N dissimilar vectors accumulate, purity drops to ≈ 1/N. High purity means the accumulator is dominated by a consistent signal; low purity means it's a diffuse mixture. Useful for deciding whether a baseline is stable enough to use for detection.

---

### `participation_ratio` — Effective active dimensions

```python
def participation_ratio(accumulator):
    v = accumulator.values   # the raw float vector
    numerator   = sum(x**2 for x in v) ** 2   # square of total energy
    denominator = sum(x**4 for x in v)        # sum of per-dimension energy squared
    pr = numerator / denominator
    # High = energy spread across many dimensions (diffuse / normal traffic)
    # Low  = energy concentrated in few dimensions (structured / attack signal)
    return pr
```

Measures how many dimensions carry meaningful energy. For a single clean vector all dimensions contribute equally — high PR. As structure concentrates into fewer dimensions (e.g., a narrow attack pattern), PR drops. Complements `purity`: purity measures how many *vectors* are mixed in; participation ratio measures how many *dimensions* are active.

---

### `drift_rate` — Rate of change of similarity

```python
def drift_rate(stream, window=1):
    sims = [cosine_similarity(stream[i], stream[i-1]) for i in range(1, len(stream))]
    return [sims[i] - sims[i-1] for i in range(1, len(sims))]
```

The temporal derivative of the similarity series. Distinguishes attack types by *rate* of structural change: flash floods (high drift, all at once), ramp-ups (accelerating drift), organic shifts (slow drift). Fires earlier than accumulator-based detection for sudden attacks.

---

### `autocorrelate` — Periodicity detection

```python
def autocorrelate(stream, max_lag):
    # acf[k] = mean cosine_similarity(stream[t], stream[t-k])
    # Peak at lag k → period-k pattern in the stream
    ...
```

Computes similarity of a vector stream with itself at different time lags. A peak at lag k means the stream repeats with period k. Useful for detecting periodic attack patterns, traffic cycles, or regular behavioral rhythms.

---

### `cross_correlate` — Causal relationship detection

```python
def cross_correlate(stream_a, stream_b, max_lag):
    # xcf[k] = mean cosine_similarity(stream_a[t-k], stream_b[t])
    # Peak at lag k → patterns in stream_a precede stream_b by k steps
    ...
```

Similarity between two vector streams at different time offsets. A peak at lag k means patterns in stream_a tend to precede patterns in stream_b by k time steps — a causal relationship in the vector domain.

---

### `segment` — Structural breakpoints in a stream

Covered above under Extended Algebra — listed here as a reminder that it's equally a streaming operation.

---

## Advanced Operations

### `grover_amplify` — Iterative signal amplification

```python
def grover_amplify(signal, background, iterations=1):
    # Iteratively: attend to signal, reflect about background mean
    # Each iteration amplifies the signal component
    ...
```

Quantum-inspired amplitude amplification. Iteratively marks dimensions that agree with `signal` and reflects about the `background` mean — amplifying the signal component at the expense of background noise. Useful for extracting a weak signal buried in a strong background after a single `attend` pass isn't sufficient.

---

### `bundle_with_confidence` / `coherence`

Covered above under Vector Operations.

---

## Algebraic Explainability

Most anomaly detection systems are black boxes. They produce a score. They don't tell you *why*. Post-hoc explanation methods like SHAP exist to patch this gap, but they're approximations computed after the fact — they explain the model's behavior, not the data's structure.

Holon doesn't have this problem. Explainability falls out of the algebra for free.

The reason: every document vector is built from reversible operations. `bind(role, filler)` is self-inverse — binding again with the same role recovers the filler direction. That means any composite vector — a document vector, a prototype, an accumulator baseline, an anomalous component — can be decomposed back into field-level contributions using `unbind`.

When a vector is flagged as anomalous, the anomalous component is the part the learned subspace can't explain:

```python
anomalous = vec - reconstruct(vec, subspace)
```

That component is still a full-dimensional vector in the same algebraic space. You can unbind it with any field's role vector and measure the result's magnitude:

```python
fields = ["src_ip", "dst_ip", "dst_port", "proto", "ttl", "bytes", "tcp_flags"]

surprise = {}
for field in fields:
    role_vec = encoder.get_vector(field)
    unbound  = bind(anomalous, role_vec)
    surprise[field] = norm(unbound)

# surprise = {
#     "dst_port":  0.91,   # strongly anomalous
#     "ttl":       0.87,   # strongly anomalous
#     "bytes":     0.79,   # anomalous — 1420 bytes, near MTU
#     "proto":     0.41,   # mildly anomalous
#     "src_ip":    0.12,   # unremarkable
#     "dst_ip":    0.09,   # unremarkable
#     "tcp_flags": 0.06,   # unremarkable
# }
```

`dst_port` and `ttl` drove the anomaly. `src_ip` and `dst_ip` are noise. A rule generator reads the top of the list: `(and (= dst_port 53) (= ttl 245))`. Done.

This works on any anomalous vector from any detection method — cosine drift, coherence threshold, residual scoring — as long as the vector was encoded with Holon's algebra. The encoding is transparent because it was built from operations that compose and decompose cleanly. No training a separate explainer. No approximation. The explanation is in the vector.

Neural anomaly detectors can't do this. Their representations aren't decomposable — the field relationships are baked into weights, not recoverable from the output. Holon's are recoverable because that's how the encoding was designed.

---

## Composition

These operations compose. A few examples of what that enables:

```python
# "More like A, less like B" — single query vector
query = negate(amplify(base_query, prototype_A), prototype_B)

# Extract what distinguishes attack traffic from normal
fingerprint = difference(prototype(attack_windows), normalize(baseline_accumulator))

# Find the most anomalous field in a suspicious packet
for field in field_names:
    surprise = unbind(reject(packet_vec, baseline_subspace), role(field)).norm()

# Detect causal lag between two traffic streams
lags = cross_correlate(ingress_stream, egress_stream, max_lag=50)
```

The primitives were designed to be combinable. The interesting applications — and most of the ones that appeared in the challenge batches — come from composition rather than individual operations. The library is a vocabulary; what you build with it is up to you.

---

## Likely Contributions to the Field

A caveat first: we haven't done an exhaustive literature survey. The author came to VSA through a conference video, not through reading papers. What follows is an honest assessment of what we couldn't find documented when we looked — not a claim of priority, but a flag for anyone doing serious research in this space.

**`negate` — removing a component from a superposition.** The standard VSA literature defines bind, bundle, permute, and cleanup as the core operations. Subtraction from a superposition — "X but not Y" as a geometric query primitive — does not appear as a named, documented operation in the sources we reviewed. The math is elementary (subtract and threshold), but its application as a first-class query operator with multiple removal methods (subtract, orthogonalize, flip) appears to be novel.

**`amplify` — boosting a component's presence.** The inverse of negate, and equally absent from the literature as a named operation. Using amplification as a query refinement step — sharpening a probe toward a known category after an initial search — doesn't appear to be documented.

**`difference` as a standalone query primitive.** Delta vectors appear implicitly in analogical reasoning literature (Plate, Gayler), but using `difference(before, after)` as a named, reusable operation for change detection, transformation extraction, and rule derivation doesn't appear to be documented as such.

**`drift_rate` — temporal derivative of similarity.** Computing the rate of change of consecutive similarities over a vector stream, and using that rate to distinguish attack types (flash flood vs. ramp-up vs. organic drift), is not documented in HDC literature that we found.

**`coherence` as an attack signal.** Applying mean pairwise cosine similarity to a traffic window as a homogeneity detector — high coherence = potential volumetric attack — is a Holon-specific application. The `coherence` metric itself appears in clustering literature but not in VSA/HDC anomaly detection.

**`purity` and `participation_ratio` on accumulators.** Applying quantum-inspired concentration measures (Tr(ρ²) purity, participation ratio) to VSA accumulators for diagnosing saturation and signal quality doesn't appear in the HDC literature.

**Frequency-preserving accumulation for baseline learning.** Using a running float sum (not a thresholded bundle) specifically to preserve frequency weighting — so that 99% benign traffic dominates the baseline 99× more than 1% — as the foundation for streaming anomaly detection is a Holon-specific technique. Streaming HDC work exists ([Thomas et al., 2022](https://arxiv.org/abs/2209.09868)) but uses different mechanisms.

**Hash-function-as-codebook for coordination-free deployment.** Standard VSA systems require a pre-shared codebook. Deriving atom vectors deterministically from a hash of the atom string combined with a seed — eliminating the codebook distribution problem entirely — does not appear in the VSA literature. This is documented in detail in the encoding post.

**Algebraic explainability without a separate explainer.** Neural anomaly detectors require post-hoc methods (SHAP, LIME, attention visualization) to approximate why a decision was made. Those approximations explain the model, not the data. In Holon, the explanation is in the vector — `unbind(anomalous_component, role_vec)` recovers per-field anomaly contributions directly, with no approximation, because the encoding was built from reversible operations. This is not a feature bolted on; it's a consequence of the algebra. We haven't found this framed as an explicit property in the VSA literature.

If any of this maps to existing published work we haven't found, we'd genuinely want to know.
