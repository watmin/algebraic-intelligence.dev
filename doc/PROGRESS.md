# Blog Progress

Tracking the narrative arc of the Holon project across all posts.
Each top-level series will expand into multiple posts as we write them.
Update this file as posts move from outline → draft → published.

**Cross-repo timeline with commit-level detail:** see `doc/TIMELINE.md`

---

## Prologue

- `[~]` **Prologue: The Idea That Wouldn't Leave** — `blog/prologue.md`
  The origin story: VSA itch from a Clojure/conj talk, years at Shield doing
  informal research with no buy-in, Rete as the only win, post-AWS pivot,
  LLM-assisted dev unlocking everything, Grok for ideation / Claude for code,
  original DB use case, P vs NP detour, engram 750ms→3ms, naming.

---

## Status Key

- `[ ]` not started
- `[~]` outlined / in progress
- `[x]` published

---

## Series 1 — The Problem Space

*Why hyperdimensional computing? What were we actually trying to solve?*

The conceptual foundation: VSA/HDC as a framework for structured similarity,
what makes it different from embedding-based approaches, and why it maps
naturally onto anomaly detection problems.

### Posts

- `[ ]` **1.1 — What is a Holon?**
  Vectors, binding, bundling, and why algebraic structure beats lookup tables.
  The core intuition: similarity as geometry over high-dimensional space.

- `[ ]` **1.2 — The Anomaly Detection Angle**
  Why anomaly detection is a natural fit. The baseline/drift model.
  Contrast with threshold-based and ML-heavy approaches.
  Note: we use cosine similarity over dense vectors, not Hamming over binary.

- `[~]` **1.0 — VSA/HDC: A Working Introduction** — `blog/series-1-000-vsa-primer.md`
  Minimum viable theory: hypervectors, bind/bundle/cosine, why high dimensions
  give you nearly-orthogonal basis vectors, why the approach works for structured
  data. Ends with a list of what Holon adds beyond standard VSA.

- `[~]` **1.1 — Atoms, Vectors, and the Encoding Stack** — `blog/series-1-001-atoms-and-vectors.md`
  The foundational concept. Atomization → binding → bundling → document vector.
  Covers: deterministic atom hashing (SHA-256 → ChaCha8RNG), bipolar vectors,
  why the codebook is a cache not a source of truth, why the XDP sidecar needs
  no shared state, and the hash-with-geometric-properties insight.

- `[~]` **1.2 — The Holon Algebra: Operations Reference** — `blog/series-1-002-holon-ops.md`
  Exhaustive reference for all algebraic primitives: core algebra (unbind,
  prototype, prototype_add, negate, amplify, flip, blend, difference, analogy),
  pattern extraction (resonance, permute, cleanup, similarity_profile,
  complexity, invert), extended algebra (attend, project, reject,
  conditional_bind, segment), vector ops (sparsify, centroid, topk_similar,
  similarity_matrix, bundle_with_confidence, coherence, entropy, power,
  random_project), accumulator ops (accumulate/decay, accumulate_weighted,
  merge_accumulators, capacity, purity, participation_ratio), streaming ops
  (drift_rate, autocorrelate, cross_correlate), advanced (grover_amplify).
  Each with Python signature, intuition, and application where available.

- `[~]` **1.3 — Holon Memory: Subspaces and Engrams** — `blog/series-1-003-memory.md`
  The memory layer: OnlineSubspace (CCIPCA incremental PCA, update/residual/
  project/reconstruct/anomalous_component/snapshot, adaptive threshold),
  Engram (named subspace snapshot, eigenvalue signature, surprise profile,
  application-defined metadata), EngramLibrary (two-tier matching: eigenvalue
  pre-filter + full residual, match_spectrum, save/load). Includes the full
  lifecycle diagram and the surprise fingerprint / field attribution mechanism.

- `[ ]` **1.4 — Encoding the World (Extended)**
  Temporal encoding ($time, $log, $linear), Walkable trait for zero-copy
  encoding of arbitrary Rust types, n-gram mode for text.

- `[~]` **1.4 — Coordination-Free at Scale** — `blog/primers/series-1-004-coordination-free.md`
  The distributed systems angle. Thesis: shared vector space across nodes
  without coordination. No codebook distribution problem, no sync protocol,
  no shared state infrastructure. HQ learns; edge operates in the same
  geometric space by construction.   A learned engram (subspace snapshot: mean vector, k principal components,
  adaptive threshold, application-defined metadata) is a portable unit of
  geometric knowledge — bounded size, constant distribution cost regardless
  of what the pattern encodes. The consumer decides what to do on a hit;
  the engram is the memory, not the action. Per-packet scan cost grows linearly
  with engram count — fixed-width vector ops, SIMD-friendly, small constant.
  Passive upgrade: no code deployment, no restart, no config reload. Compare
  to rule-based systems where every new rule is an operational event.
  Implications for edge deployment, air-gapped nodes, and any architecture
  where coordination is the bottleneck.

---

## Series 2 — Python: Experiments and Discovery

*The lab period. Running challenges, stress tests, building intuition.*

The Python implementation was where we figured out what Holon actually was.
Challenge batches 010–017 drove the design — each one forced a new capability.

### Posts

- `[~]` **2.0 — Python: The First Two Weeks** — `blog/series-2-001-first-experiments.md`
  Jan 16–Feb 5. Day-one architecture, database origin, Rete emerging on day two,
  challenge batches 001–012. Covers: structural encoding generalization, primitives
  origin in Sudoku work, 123x similarity speedup, n-gram encoding, scale to 5M records,
  F1=1.000 on challenge 011, zero-hardcode detection on challenge 012.

- `[ ]` **2.1 — The Original Idea: Structural Querying**
  Before anomaly detection — the database idea. Encoding JSON/EDN docs as
  hypervectors for sub-document structural queries. "Which documents contain
  this minimal JSON struct?" The Qdrant demo. Why we pivoted to streaming.
  Note: engram work later closes the loop back to the DB use case.

- `[ ]` **2.1 — Challenge 010: First Contact with Network Data**
  Anomaly detection on network traffic. F1=1.000, 8,339 req/sec.
  What worked immediately and what surprised us.

- `[ ]` **2.2 — Challenge 011: Structure and Cross-Pollination**
  Structural detection. Teaching Holon to generalize across attack variants.
  The moment we realized the algebraic structure was doing real work.

- `[ ]` **2.3 — Challenge 012: Zero-Hardcode Detection**
  100% recall, 4% false positive rate, no hand-tuned rules.
  What "zero-hardcode" actually means and why it matters.

- `[ ]` **2.4 — Challenge 017: Online Learning**
  CCIPCA-based online subspace. The system that updates itself in real-time.
  Streaming anomaly detection without retraining.

- `[ ]` **2.5 — Stress Testing and the Performance Wall**
  The experiments that revealed Python's limits.
  Throughput numbers, where the bottlenecks were, and what that told us
  about what a production system would need.

- `[ ]` **2.6 — The P vs NP Detour**
  Challenge 004 and the omitted 005 batch. What VSA's combinatorial
  structure representation might have to say here. Probably wrong. Maybe not.

- `[ ]` **2.7 — What Python Taught Us**
  The ergonomics and API design that survived into Rust.
  What we threw out, what we kept, and why.

---

## Series 3 — Rust: The Port

*Rebuilding for performance. 12x faster. SIMD. Production-grade.*

The Rust port wasn't just a translation — it forced cleaner abstractions
and unlocked performance characteristics the Python version couldn't reach.

### Posts

- `[ ]` **3.1 — Why Rust (and Why Now)**
  The decision. Performance requirements, safety, ecosystem fit.
  What we needed that Python couldn't give us.

- `[ ]` **3.2 — Architecture: Three Layers**
  kernel / memory / high-level. How the Python design mapped to Rust.
  Where it got cleaner and where it got harder.

- `[ ]` **3.3 — The Encoder**
  Deep dive into `encoder.rs` — the core of the kernel layer.
  How structured data becomes a hypervector in ~10x less time.

- `[ ]` **3.4 — Accumulator and Subspace**
  The memory layer. `accumulator.rs` and `subspace.rs`.
  Online learning, bundling, the math that makes similarity work at scale.

- `[ ]` **3.5 — SIMD: 5x on Top of 12x**
  The `simsimd` integration. What operations benefit, what the numbers look like.
  How to think about SIMD in a vector-heavy workload.

- `[ ]` **3.6 — Benchmarks: Python vs Rust**
  The full comparison table. encode_json (10x), similarity (11x), bind (15x).
  What drove each number and what the ceiling looks like.

---

## Series 4 — The Baseline Lab

*Building real traffic before building defenses against it.*

Before the DDoS scrubber could be meaningful, we needed traffic that
behaved like production — not synthetic floods, not replayed pcaps.
The baseline lab uses local LLM inference (4090) + LangChain/LangGraph
to simulate a realistic web application under real user behavior:
3 admin agents and 20 user agents generating dynamic content and HTTP
traffic. This became the ground truth all subsequent high-perf experiments
run against — and the HTTP traffic corpus will carry forward into the
Layer 7 scrubber and WAF work.

Repo: `holon-lab-baseline` (local clone)

### Posts

- `[ ]` **4.1 — Why Synthetic Traffic Isn't Enough**
  The problem with replayed pcaps and traffic generators.
  What "real" traffic actually requires: dynamic content, session state,
  realistic timing, varied behavior.

- `[ ]` **4.2 — The Agent Architecture**
  3 admin agents + 20 user agents via LangChain/LangGraph.
  How LLM inference on the 4090 drives dynamic content generation.
  What makes the traffic behave like a real application.

- `[ ]` **4.3 — What the Baseline Produces**
  The HTTP traffic corpus. Shape of normal, shape of load.
  How we use it as ground truth in experiments.

- `[ ]` **4.4 — Forward Use: L7 Scrubber and WAF**
  Why this lab pays dividends beyond DDoS.
  The plan for Layer 7 detection, WAF rule generation, and
  behavioral fingerprinting against realistic traffic.

---

## Series 5 — The DDoS Problem

*Why standard approaches fall short. The case for learned, adaptive mitigation.*

Before the implementation — the problem framing. Why existing scrubbers
are brittle, why rules rot, and why a memory-based approach changes the calculus.

### Posts

- `[ ]` **4.1 — The Scrubber Landscape**
  How traditional DDoS mitigation works (threshold, rate limit, BGP blackhole).
  Where they break down against modern adaptive attacks.

- `[ ]` **4.2 — The Rule Rot Problem**
  Hand-written rules drift against real attack traffic.
  The maintenance burden and the detection gap.

- `[ ]` **4.3 — Enter Engram Memory**
  The concept: learned pattern snapshots that survive between attacks.
  Single-packet recognition vs. drift-based detection.

---

## Series 6 — XDP + eBPF Scrubber

*The implementation. Architecture, the compiled tree, the Rete sidecar.*

The production system. How Holon's engram memory system runs at kernel
speed in XDP, what the sidecar architecture looks like, and what's novel
about the Rete-inspired compiled tree approach.

### Posts

- `[ ]` **5.1 — XDP and eBPF: The Right Layer**
  Why kernel-space packet processing. XDP vs. TC vs. userspace.
  Performance profile and the tradeoffs we accepted.

- `[ ]` **5.2 — The Architecture**
  Per-packet subspace scoring → per-tick lifecycle → engram minting →
  instant rule deploy. The full pipeline, end to end.

- `[ ]` **5.3 — The Sidecar: Detection in Userspace**
  Why detection lives in the sidecar, not the kernel.
  The compiled tree via sidecar and how it communicates back.

- `[ ]` **5.4 — The Rete Approach**
  What's Rete, why it maps onto packet classification, and what's novel
  about our compiled-tree variant for this use case.

- `[ ]` **5.5 — Engram Memory at Kernel Speed**
  How engram minting and recall work in the eBPF context.
  750ms → 3ms: what that number actually means at the packet level.
  The engram fires in a single packet; the drift detector needs hundreds.

- `[ ]` **5.6 — veth Lab: Testing Without Hardware**
  The virtual ethernet lab setup. How we stress tested the scrubber
  without dedicated network hardware.

- `[ ]` **5.7 — Results**
  Numbers. Sub-second rule deployment on re-detected attacks.
  What "765ms before drift-based detection" means operationally.

---

## Series 7 — Where It Stands and What's Next

*Current state across all three codebases. Honest assessment. Forward look.*

### Posts

- `[ ]` **6.1 — Current State: Python**
  API maturity, what's stable, what's still experimental.
  Where Python Holon makes sense to use today.

- `[ ]` **6.2 — Current State: Rust**
  `holon-rs` v0.1.0. What's implemented, what's missing, roadmap.

- `[ ]` **6.3 — Current State: DDoS Lab**
  What's deployed, what's still lab-grade, path to production.

- `[ ]` **6.4 — Language Roadmap**
  Python bindings for holon-rs, Go, Ruby.
  What the ecosystem could look like.

- `[ ]` **6.5 — The Bigger Picture**
  HDC/VSA beyond network security. Other domains where this fits.
  What we think algebraic intelligence actually means.

---

## Source Material Index

Quick reference for where to pull content when writing each post.

| Source | Location |
|--------|----------|
| **Cross-repo timeline** | `doc/TIMELINE.md` |
| Python README | `/holon/README.md` |
| Python docs (83 files) | `/holon/docs/` |
| Challenge learnings | `/holon/docs/` (batches 002–017) |
| Rust README | `/holon-rs/README.md` |
| Encoder impl | `/holon-rs/src/kernel/encoder.rs` |
| Accumulator impl | `/holon-rs/src/kernel/accumulator.rs` |
| Vector impl | `/holon-rs/src/kernel/vector.rs` |
| Subspace impl | `/holon-rs/src/memory/subspace.rs` |
| Holon lib entrypoint | `/holon-rs/src/lib.rs` |
| Engram memory doc | `/holon-lab-ddos/veth-lab/docs/ENGRAM-MEMORY.md` |
| eBPF filter impl | `/holon-lab-ddos/veth-lab/filter/src/lib.rs` |
| Baseline lab | `/holon/holon-lab-baseline/` (local, 2 commits) |
| Clojure port | `~/work/holon-clj/src/holon/core.clj` (no git, Neanderthal BLAS) |
