---
title: "VSA/HDC: A Working Introduction"
description: The minimum you need to understand Vector Symbolic Architectures and Hyperdimensional Computing before reading about how Holon uses them.
date: 2026-02-21
---

This isn't a survey paper. The VSA/HDC literature goes back to Kanerva (1988), Plate (1995), and further — there are proper treatments of the theory, the history, and the variants. This post covers only what you need to understand the rest of this site: what a hypervector is, what the three core operations do, and why the approach is interesting for structured data.

If you want the deep theory, [Kanerva's *Sparse Distributed Memory* (1988)](https://en.wikipedia.org/wiki/Sparse_distributed_memory) and [Gayler's "Vector Symbolic Architectures Answer Jackendoff's Challenges for Cognitive Neuroscience" (2003)](https://web-archive.southampton.ac.uk/cogprints.org/3983/1/Jackendoff_challenges_V3.pdf) are good starting points. This post is not that.

---

## The Core Idea

A hypervector is a very large vector of numbers — thousands of dimensions of values in `{-1, 0, 1}`. A point in a high-dimensional space.

The reason to use such high-dimensional vectors is a geometric property of high-dimensional spaces: **random vectors are nearly orthogonal.** Two random bipolar vectors have an expected cosine similarity of 0, with standard deviation ~1/√d where d is dimensionality. The higher the dimension, the tighter the near-orthogonality guarantee, and the more distinguishable basis vectors you can pack into the space before things start interfering.

The literature (Kanerva) suggests at least 10,000 dimensions for the guarantees to hold comfortably. In practice it's a tunable parameter with real tradeoffs:

- **Higher dimensions** (16,384): tighter orthogonality, better accuracy on complex documents with many fields, higher memory cost per vector (~16KB at 1 byte per dimension), slower ops
- **Lower dimensions** (4,096): looser orthogonality, viable for simpler structures and high-throughput streaming, smaller footprint, faster ops

Holon's experiments started at 16,384 and included explicit dimension sensitivity testing — one of the challenge batches dropped to 4,096 to characterize the tradeoff. Both proved viable for their respective tasks. The dimension is a user choice at initialization, not a fixed constant. Pick what fits the problem: number of distinct atoms you need, acceptable collision rate, available memory, throughput requirements.

---

## Which VSA Variant

There are several VSA implementations in the literature, and they differ in their choice of vector space and operations:

- **BSC** (Binary Spatter Code, Kanerva) — binary vectors `{0, 1}`, XOR for binding, majority vote for bundling
- **HRR** (Holographic Reduced Representations, Plate) — real-valued vectors, circular convolution for binding
- **MAP** (Multiply Add Permute, Gayler) — bipolar vectors `{-1, 0, 1}`, element-wise multiplication for binding, element-wise addition for bundling

Holon follows MAP. The video that originally sparked this project — [Carin Meier's "Vector Symbolic Architectures in Clojure"](https://www.youtube.com/watch?v=j7ygjfbBJD0) from Clojure/conj 2023 — explicitly uses MAP and walks through exactly this algebra. The bipolar vectors and multiply-for-bind, add-for-bundle operations in that talk are the same ones in Holon's kernel.

The key property MAP gives you: **binding is self-inverse.** `bind(bind(A, B), A) = B`. Unbinding uses the same operation as binding — just apply it again with one of the original inputs to recover the other. This is what makes field attribution possible: given a composite document vector and a field name vector, you can unbind to recover what value that field encoded. Holon's surprise fingerprint (which fields drove an anomaly) depends on this directly.

---

## Three Operations

VSA defines three core operations. Everything in Holon is built from these.

### Bind

**Element-wise multiplication.** Takes two vectors, produces one.

```python
def bind(a, b):
    return [x * y for x, y in zip(a, b)]
```

In VSA terminology, the two inputs are called the *role* and the *filler*. The role is the structural position — a field name, a relationship type, a slot in a schema. The filler is the value occupying that position. Binding encodes the relationship between them: not "the value 80 exists" and not "the field dst_port exists," but specifically "80 occupying the dst_port role."

Applied to a key-value pair:

```
role  = "dst_port"  →  [...,  0,  1, -1,  0,  1, ...]
filler = "80"       →  [..., -1,  0,  1, -1,  0, ...]
bind(role, filler)  →  [...,  0,  0, -1,  0,  0, ...]   # bound pair
```

The result is approximately orthogonal to *both* inputs — it encodes the *relationship* between them, not either one alone. `bind("dst_port", "80")` is distinct from `bind("src_port", "80")`: same value atom, different role atom, completely different result. Same value, different structural position, different vector.

The operation is invertible: `bind(bind(A, B), A) ≈ B`. Apply bind again with one component to recover the other. This self-inverse property is what makes field attribution possible later — given a document vector and a field name, you can unbind to recover what value that field encoded.

### Bundle

**Element-wise majority vote.** Combines bound pairs into a document vector.

```python
def bundle(vectors):
    sums = [sum(v[i] for v in vectors) for i in range(len(vectors[0]))]
    return [1 if s > 0 else -1 if s < 0 else 0 for s in sums]
```

Building on the bind example, a full document `{"dst_port": 80, "src_ip": "10.0.0.1"}`:

```
role  = "dst_port",  filler = "80"
bind(role, filler)        →  [...,  0,  0, -1,  0,  0, ...]   # field 1

role  = "src_ip",  filler = "10.0.0.1"
bind(role, filler)        →  [...,  0, -1,  0, -1,  0, ...]   # field 2

bundle(field_1, field_2)  →  [...,  0, -1, -1, -1,  0, ...]   # document vector
```

That final vector *is* the document. Not a pointer. Not a summary. The document encoded geometrically, in the same space as every atom and every bound pair. **Everything is a hypervector** — atoms, bound pairs, documents, queries. The operations take vectors in and produce vectors out at every step, and the result is always the same kind of thing.

The bundle is lossy — you can't perfectly reconstruct the individual components. But you can *probe*: compute cosine similarity between the document vector and any bound pair. If `bind("dst_port", "80")` is present, the score will be noticeably above zero. If it's absent, near zero.

### Query, Probe, Search — One Operation

All three are cosine similarity:

```python
def cosine(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    return dot / (norm(a) * norm(b))
```

Returns a value in `[-1, 1]`:
- `1.0` — identical vectors, same direction
- `0.0` — orthogonal, unrelated
- `-1.0` — opposite directions (used for negation)

The same operation serves different purposes depending on what you're asking:

**Probing a bundle** — "is this component present in this superposition?" Take a document vector and compute cosine similarity against a known bound pair, e.g. `bind(role("dst_port"), atom("80"))`. A high score means that role-filler relationship is encoded in the document. A near-zero score means it isn't. This is standard VSA vocabulary: probing is cosine similarity applied to a superposition with a known component.

**Comparing two documents** — "how structurally similar are these?" Same operation, both sides are document vectors. High similarity means they share many bound field pairs; low means they don't.

**Searching a store** — "which stored documents match this query?" Probe every stored document vector with the query vector, rank by score, return top-k. This is how Holon's similarity search works: the query is just another encoded document (possibly with fewer fields), and retrieval is a parallel probe across the store.

These aren't different operations — they're the same cosine similarity applied at different levels of abstraction. "Probe" isn't Holon-specific; it's the standard VSA term for querying a superposition with a known component. Holon just uses it as the primary retrieval mechanism at every layer.

Cosine is scale-invariant: it measures angle, not magnitude. A 2-field query probing a 10-field document can still score highly if those 2 fields are present and correctly bound — the query vector is a subspace of the document vector, and the geometry handles the rest.

Holon uses cosine throughout. Hamming distance is common in HDC literature for binary vectors, but cosine over dense bipolar vectors handles partial matches and frequency-weighted accumulators better for the use cases here.

---

## Why This Works for Structured Data

The binding operation is what makes VSA useful for data beyond text. In most embedding systems, you encode the *meaning* of a value — typically through trained weights over a corpus. VSA encodes *structure*: the relationship between a role and a filler, regardless of what those things mean.

`bind("dst_port", "80")` produces a vector that means "the value 80 occupying the dst_port role." No training. No corpus. No semantic weight. Just geometry encoding structure. Bundle ten of these and you have a document vector. Probe it with any role-value pair and you get a similarity score.

This is why the same approach — bind, bundle, query — works across task management data, recipe databases, network packets, and Raven's Progressive Matrices. The algebra doesn't know what the data means. It encodes structure. Structural similarity then falls out of cosine similarity for free.

---

## What Holon Adds

The three operations above are standard VSA. What Holon builds on top:

**Deterministic atom generation.** Rather than assigning atom vectors from a pre-shared codebook, Holon derives them from a hash function. Same atom string, same seed, same implementation: identical vector. No coordination required.

**Multiple scalar encoding paths.** Not everything should be a string atom. Numeric magnitudes, timestamps, and cyclical values have structure that string atomization destroys. Holon's `$linear`, `$log`, and `$time` encoders preserve that structure geometrically.

**The algebraic primitives.** Beyond bind/bundle/query: `prototype` (category essence from examples), `difference` (what changed between two states), `negate` (subtract a component from a superposition), `amplify` (boost signal), `blend` (weighted interpolation). Each one is a standard vector operation; the novelty is applying them systematically as a composable query language over structured data.

**Accumulators with decay.** A running bundle over a stream of vectors, where older contributions decay over time. The frequency-preserving property — 99% benign traffic keeps the accumulator close to normal — is what makes streaming anomaly detection work without labeled data.

**Engram memory.** Learned subspace snapshots of known patterns, matchable in a single packet. This is the piece that doesn't exist in the standard VSA literature.

Those are the subjects of the rest of this site. This post is just the ground floor.

---

A confession: the author of this site has never read any of the papers linked below. The entire VSA foundation for this project came from one Clojure/conj conference video, followed by months of conversations with Grok and Claude. Both models clearly have the research internalized — and it turns out you can probe that knowledge interactively much faster than reading the source papers. Somewhat on-brand for a project about probing vector representations for information.

For the proper theory:

- [Sparse Distributed Memory](https://en.wikipedia.org/wiki/Sparse_distributed_memory) — Wikipedia overview of Kanerva's foundational work (1988)
- [A comparison of vector symbolic architectures](https://arxiv.org/abs/2106.05268) — Schlegel, Neubert & Protzel (2021), open access; systematic evaluation of 11 VSA variants including MAP, BSC, and HRR
- [Vector Symbolic Architectures in Clojure](https://www.youtube.com/watch?v=j7ygjfbBJD0) — Carin Meier, Clojure/conj 2023; the talk that started this project

For how Holon implements the above: [Atoms, Vectors, and the Encoding Stack](/blog/primers/series-001-001-atoms-and-vectors/).
