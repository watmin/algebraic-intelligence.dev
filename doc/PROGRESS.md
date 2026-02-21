# Blog Progress

Tracking the narrative arc of the Holon project across all posts.
Each top-level series will expand into multiple posts as we write them.
Update this file as posts move from outline → draft → published.

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

- `[ ]` **1.3 — Encoding the World**
  How arbitrary structured data (packets, JSON, time series) becomes a
  hypervector. Scalar encoding, temporal encoding, the Walkable trait.

---

## Series 2 — Python: Experiments and Discovery

*The lab period. Running challenges, stress tests, building intuition.*

The Python implementation was where we figured out what Holon actually was.
Challenge batches 010–017 drove the design — each one forced a new capability.

### Posts

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

- `[ ]` **2.6 — What Python Taught Us**
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

*The implementation. Architecture, the compiled tree, the RETE sidecar.*

The production system. How Holon's engram memory system runs at kernel
speed in XDP, what the sidecar architecture looks like, and what's novel
about the RETE-inspired compiled tree approach.

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

- `[ ]` **5.4 — The RETE Approach**
  What's RETE, why it maps onto packet classification, and what's novel
  about our compiled-tree variant for this use case.

- `[ ]` **5.5 — Engram Memory at Kernel Speed**
  How engram minting and recall work in the eBPF context.
  The 765ms advantage: firing before drift-based detection notices.

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
| Baseline lab | `holon-lab-baseline` (local clone, separate repo) |
