# Cross-Repo Timeline

Chronological record of all meaningful work across all five repos.
Use this as the authoritative reference for narrative sequencing in blog posts.
Each entry shows: date, repo, what happened, and which blog series/post it feeds.

---

## Jan 16 — holon (Python): Day One

**2026-01-16** — `holon` initial commit: "Complete VSA/HDC neural memory system"

The first commit is already a functioning system — HTTP API, FAISS ANN indexing,
guards, negations. This wasn't day one of the thinking (that was years of Grok
conversations at Shield) but it was day one of the code. Everything built in a
single session with Grok Code and early Claude.

Within hours of the initial commit: HTTP API server, test client, performance
optimizations, negation support, configurable markers, comprehensive tests.

**Blog:** Series 2, post 1 (the first two weeks)

---

## Jan 17 — holon (Python): Rapid API Stabilization

**2026-01-17** — Burst of activity: bulk insert, positional encoding for lists,
guard refinements, `$any` wildcard, `.grok/GROK.md` context file added (Grok
session continuity), Rete-like forward chaining demo, MIT license, authorship.

Notable: the Rete demo appears this early. The forward chaining work was a
deliberate experiment to see if Holon's vector store could underpin rule-based
reasoning — the same instinct that would later produce the XDP/eBPF decision
tree.

**Blog:** Series 2, post 1

---

## Jan 24–25 — holon (Python): Batch 001 + 002, Sudoku

**2026-01-24** — Batch 001 challenges: task memory, recipe finder, bug reports,
spell search. All working. Graph matching (batch 002 RPM/graph) implemented the
same day. PDF quote finder scaffold.

**2026-01-25** — **Sudoku** (challenge 004). Multiple approaches: geometric VSA,
hybrid geometric + traditional solver. Commits range from "breakthrough" to
"docs: remove hype and fix Challenge 2 union rule". The honest assessment: VSA
cannot solve Sudoku. Constraint satisfaction requires exact backtracking — the
approximate similarity geometry of HDC is the wrong tool.

Also: mathematical primitives added (`prototype`, `difference`, `blend`,
`amplify`, `negate`). These were developed *during* the Sudoku work as
tools to attack it — and proved far more useful everywhere else.

**Blog:** Series 2, post 1 (batches 001-003); Series 2, post 2 (batch 004, P vs NP)

---

## Jan 26–30 — holon (Python): Batches 003–007, Scale Testing

**2026-01-26** — Unified `HolonClient` interface. API stabilization.

**2026-01-30** — Batches 003 (quote finder), 005 (unknown/omitted), 006 (LLM
memory augmentation), 007 (multi-domain demos including Rete challenge). All
solutions complete. Qdrant integration. 16k dimensions found to be the right
default for complex docs. Similarity function optimization: **123x speedup**.
`$or` superposition (23x speedup over naive OR). Code structure search.

Also: honest assessment document added. 81.7% accuracy at 1000 categories on
synthetic data. No baseline comparisons. All benchmarks on planted signal.

**Blog:** Series 2, post 2 (batches 004–005); Series 2, posts 3+ (batches 006–007)

---

## Jan 31 — holon (Python): Scale, Backends, Batch 008

**2026-01-31** — Qdrant stress test. Time encoding (`$time` marker). Temporal
similarity: same hour next week ≈ same vector. Batch 008 (7 challenges: event
correlation, ticket routing, config drift, API pattern analysis — 92–100%
accuracy). GPU backend (honest assessment: 40x for large batches, impractical
for streaming). TorchHD backend (98.4% precision on numeric fields, 300 ops/sec
— too slow).

Dimension selection guide added. Benchmarks across 1k/4k/8k/16k dims.

**Blog:** Series 2, post 3+

---

## Feb 1 — holon (Python): Batch 008 Complete, Primitives Polished

**2026-02-01** — All 7 batch 008 challenges complete. New primitives added
(`resonance`, `conditional_bind`, sequence encoding modes). `$mode` marker
standardized. "Brutally honest" README section. Parallel encoding (10 workers).

**Blog:** Series 2, post 3+

---

## Feb 2 — holon (Python): Challenge 009 — Scale Testing

**2026-02-02** — Challenge 009: deterministic training at scale.

Results on a 14-core, 54GB RAM machine:
- 1M records, 100 categories: 94.5% accuracy, 25,581 enc/sec, 44s, 3.9GB RAM
- 1M records, 1,000 categories: 84.5% accuracy
- 5M records, 1,000 categories: 84.4% accuracy, 23,322 enc/sec, 7.5 min, 19.5GB RAM

Qdrant integration: 440 inserts/sec, 13.5ms query. Distance metrics module
(cosine, Hamming, dot, weighted synthesis). Parallel encoding with shared
codebook: 2.9x speedup.

This was the moment the performance ceiling of Python became undeniable.
84% at 1000 categories is real — but only at 23k enc/sec with 10 cores.
The Rust port decision started crystallizing here.

**Blog:** Series 2 scale posts; setup for Series 3 (Rust)

---

## Feb 3 — holon (Python): Challenge 010 — Network Traffic, DDoS

**2026-02-03** — Challenge 010: network anomaly detection.

- HTTP anomaly detection: F1=1.000, **8,339 req/sec**, 0.12ms latency
- DDoS detection (SYN flood, DNS reflection, NTP amp, ICMP flood): 100% detection
- Two-phase detection: transition + classification
- Key insight: DDoS = variance drop + mean similarity rise (homogeneous traffic)

This is the pivot point. The structural encoding that started as a database idea
is now doing real-time network security at sub-millisecond latency in Python.

Accumulator primitives added. `create_accumulator()`, `accumulate()`, `decay()`,
`normalize_accumulator()`. The frequency-preserving property is critical: where
`prototype()` thresholds (loses frequency), accumulators preserve it — 99% benign
traffic dominates, F1=1.000.

**Blog:** Series 2, Challenge 010 post

---

## Feb 4 — holon (Python): Challenge 011 — Structural Detection

**2026-02-04** — Challenge 011: structural detection + mitigation synthesis.

The key discovery: naive atom bundling (F1=0.368) vs structural encoding
(F1=1.000). Role-filler binding makes `{dst_port: 80}` different from
`{src_port: 80}` even though both contain "80". This is the proof that
structural encoding is not just a theoretical claim.

Mitigation synthesis: `difference(attack_signature, baseline)` → extract
features → generate iptables rules. F1=1.000 on derived rules.

Three-dimensional detection: transition (0.936), classification (0.998),
binary (1.000). Prior/recent/divergence model for regime change detection.

**Blog:** Series 2, Challenge 011 post

---

## Feb 5–6 — holon (Python): Challenge 012, HolonClient Refactor

**2026-02-05** — Challenge 012: zero-hardcode anomaly detection.
**100% attack recall, 4% false positive rate.** No domain knowledge. No
port numbers, no protocol names, no labeled attack patterns. Pure frequency
accumulation over character class bitmasks.

Performance benchmark: zero-hardcode detector runs at production speed.

**2026-02-06** — `HolonClient` becomes the primary interface. Cross-reference
to holon-rs added (Rust port already underway by this date — see below).

**Blog:** Series 2, Challenge 012 post

---

## Feb 6 — holon-rs (Rust): Initial Implementation

**2026-02-06** — `holon-rs` initial commit: "Initial Rust implementation of
Holon VSA library". Same day: comprehensive tests, SIMD support, Challenge 008
port, benchmarks, Doctor Strange README aesthetic.

The Rust port started the same week as Challenge 012 in Python. Both were
running in parallel. The initial Rust commit already includes SIMD acceleration
(`--features simd`).

Benchmark snapshot from first week:
| Operation | Python | Rust | Speedup |
|-----------|--------|------|---------|
| encode_json | 75µs | 7µs | **10x** |
| similarity | 15µs | 1.4µs | **11x** |
| bind | 12µs | 0.8µs | **15x** |

**Blog:** Series 3, post 1 (why Rust, why now)

---

## Feb 7–8 — holon-lab-ddos: Lab Starts + holon-lab-baseline

**2026-02-07** — `holon-lab-ddos` initial scaffold. Working DDoS generator
with AF_PACKET and macvlan hairpin. XDP packet sampling and pcap capture.

**2026-02-08** — `holon-lab-baseline` initial commit. WordPress stack on Docker,
macvlan + Squid proxy (23 unique source IPs), Playwright + Ollama LLM agents.
3 admin agents (post creation, comment moderation), 20 user agents (browsing,
commenting). The traffic generator that would feed all subsequent experiments.

Also Feb 8: `holon-rs` adds Walkable trait (zero-serialization encoding), Batch
013 rate limiting port. `holon` (Python) adds batch 013.

**Blog:** Series 4 (baseline lab); Series 6 setup (DDoS lab scaffold)

---

## Feb 9–10 — holon-lab-ddos: veth Lab PoC, 1.3M PPS

**2026-02-09** — veth-lab PoC: XDP DDoS mitigation proof-of-concept.
holon-rs integrated. **Stress test: 1.3M PPS attack, 99.5% drop rate.**

**2026-02-10** — holon (Python) and holon-rs both add batch 014: extended
primitives for explainable VSA (`segment`, `complexity`, `invert`,
`similarity_profile`, `attend`, `project`, `analogy`, `conditional_bind`).
holon-rs: vector bipolar distribution fix, doctest fixes.

**Blog:** Series 6, post 1 (veth lab, first results)

---

## Feb 11 — holon-lab-ddos: Tree Rete Engine, 1M Rules

**2026-02-11** — **Major milestone:** BPF tail-call DFS architecture.
1,000,000 rules compiled into a decision tree, enforced at line rate.
~5 BPF tail calls per packet regardless of rule count (O(depth), not O(rules)).

Also: tree Rete engine with blue/green deployment and s-expression rules.
p0f-level fields (OS fingerprinting) in detection loop.

holon (Python): 3D visualization module. holon-rs: $log/$linear markers,
Walkable support for magnitude-aware encoding.

**Blog:** Series 6, post 2 (1M rules, BPF tail-call DFS)

---

## Feb 12–14 — holon-lab-ddos: Rule Language, Predicates, Dashboard

**2026-02-12** — Comprehensive documentation suite: RETE.md, VSA.md, EBPF.md,
DECISIONS.md, SCALING.md. EDN rule format. PLAN-NEXT.md.

**2026-02-13** — Range predicates, Mask predicate, In predicate, rate limiter
observability. Named rate limiter buckets. holon-rs parity tracking (PARITY.md,
MISSING-PRIMITIVES.md).

**2026-02-14** — Real-time metrics dashboard (SSE streaming, DAG viewer).
Multi-tenant byte matching. Multi-line EDN rule support. Token bucket
nanosecond precision. Blue/green prefix list support.

**Blog:** Series 6, post 3 (rule language and architecture)

---

## Feb 15 — Multi-Repo: Payload Analysis, Batch 016

**2026-02-15** — Coordinated work across three repos:

- **holon** (Python): Batch 016 — windowed payload analysis, byte match
  rule derivation.
- **holon-rs**: Payload anomaly detection example, advanced vector ops,
  byte match derivation example.
- **holon-lab-ddos**: Full 2048-byte L4 payload analysis (32 windows),
  byte match rule derivation writeup. IPv4 header fingerprinting for OS
  detection. BPF RingBuf (replacing PerfEventArray). Token bucket fix.
  Comprehensive test coverage (tree compiler, token bucket, complex rulesets).
  1M rules proven: 50K → 1M scaling data.

**Blog:** Series 6, post 4 (payload analysis)

---

## Feb 16 — holon-lab-ddos: Decay Model, Dual Accumulator

**2026-02-16** — Decay-based per-packet processing with dual accumulator model.
`drift_rate` early detection, rule subsumption, anomaly suppression.
Full writeup with recording.

This is the architecture that produces the 750ms detection baseline —
the accumulator with decay needs time to build signal. The engram system
that would soon replace it for re-detected attacks cuts this to 3ms.

**Blog:** Series 6, post 5 (dual accumulator, decay model)

---

## Feb 17 — holon (Python): Batch 017 — Online Subspace + Engrams

**2026-02-17** — **Engram library.** CCIPCA-based online subspace learning.
Learned pattern snapshots with single-packet matching. 100% matching accuracy
across 4 attack types. Zero false activations on normal traffic. Full lifecycle:
detect → learn → mint → re-detect in 1 packet.

Also: drone behavioral cloning idea via engrams documented.

**Blog:** Series 2, post on batch 017 (engram origin in Python)

---

## Feb 19 — holon-rs + holon-lab-ddos: Engram Integration, Instant Rules

**2026-02-19** — holon-rs: memory layer, temporal encoding, showcase examples.
Python-level engram/subspace parity in Rust.

**2026-02-19** — holon-lab-ddos: **instant rule deploy on engram hit.**
Re-detected attacks recognized in a single packet. Rules deploy immediately
without waiting for drift-based detector.

**Result: 750ms → 3ms.** The accumulator baseline took 750ms to accumulate
enough signal. The engram system recognizes a previously-seen attack in the
first packet: 3ms.

holon (Python): major refactor to clean three-layer architecture
(kernel/memory/highlevel). Showcases rewritten for depth.

**Blog:** Series 6, post 6 (engram integration, 750ms → 3ms)

---

## Feb 20 — holon-rs: Three-Layer Refactor + ndarray

**2026-02-20** — holon-rs: three-layer module structure (kernel/memory/highlevel)
matching Python. ndarray for vectorized CCIPCA and accumulator operations.
`get_vector()` exposed on Encoder.

holon-lab-ddos: sidecar refactored to use kernel/memory layer imports directly.
Engram writeup finalized (ENGRAM-MEMORY.md).

**Blog:** Series 3, architecture post

---

## Feb 20 (evening) — algebraic-intelligence.dev: Site Created

**2026-02-20** — algebraic-intelligence.dev repository created. Initial static
HTML placeholder. Astro + Starlight scaffold. Logo added. Site structure
organized: The Story / The Library / Demos / Guides.

**Blog:** Meta (this site's own origin)

---

## Summary: The Three-Week Arc

| Period | Focus | Key Output |
|--------|-------|------------|
| Jan 16–17 | Python foundation | Working VSA library, HTTP API |
| Jan 24–25 | Batch 001, Sudoku wall | Structural encoding proven; NP limits found |
| Jan 26–31 | Batches 003–008, scale | 123x similarity speedup, 5M records, Qdrant |
| Feb 1–5 | Batches 009–012 | 94.5% at 1M scale, F1=1.0 detection, zero-hardcode |
| Feb 6 | holon-rs starts | 10–15x speedup from day one |
| Feb 7–8 | Labs start | DDoS lab scaffold, baseline traffic generator |
| Feb 9–11 | veth-lab PoC | 1.3M PPS, 99.5% drop rate, 1M rules proven |
| Feb 12–15 | Rule language | EDN rules, dashboard, payload analysis |
| Feb 16 | Decay model | 750ms dual-accumulator baseline |
| Feb 17 | Engrams (Python) | Single-packet attack recognition |
| Feb 19 | Engrams (Rust + XDP) | **750ms → 3ms** instant rule deploy |
| Feb 20 | Architecture cleanup | Three-layer refactor, site launched |

---

## Blog Series ↔ Timeline Mapping

| Blog Series | Timeline Coverage |
|-------------|-------------------|
| Series 1: Problem Space | Background; no commits |
| Series 2: Python experiments | Jan 16 – Feb 6 (holon) |
| Series 3: Rust port | Feb 6 – Feb 20 (holon-rs) |
| Series 4: Baseline lab | Feb 8 (holon-lab-baseline) |
| Series 5: DDoS problem framing | Feb 3–8 (context from Python + lab start) |
| Series 6: XDP + eBPF scrubber | Feb 7 – Feb 20 (holon-lab-ddos) |
| Series 7: Current state | Feb 20 onwards |

---

## Notes for Writing

- **Batches 004 and 005** are the P vs NP attempt. Batch 004 is committed
  (Sudoku, `FUTURE_RADICAL_APPROACHES.md`). Batch 005 is "omitted" per the
  author — presumably the experiments didn't produce anything worth committing.
  Both feed Series 2 post 2.

- **holon-lab-baseline** has only 2 commits. The lab was built but the traffic
  hasn't yet been fed into scrubber experiments. Series 4 should note this
  honestly — the infrastructure exists, the integration is pending.

- **The three-layer architecture** (kernel/memory/highlevel) was refactored
  into both Python (Feb 19) and Rust (Feb 20) in the same sprint as the engram
  integration. This is not coincidence — the engram work made the architectural
  separation obvious.

- **holon-clj** exists at `~/work/holon-clj/`. No git history — a single file
  (`src/holon/core.clj`) with deps: Clojure 1.12, Neanderthal 0.49 (BLAS/LAPACK),
  Fluokitten (category theory / functors). Neanderthal gives native BLAS operations
  on BLAS vectors — the Clojure port uses proper numeric tower, not NumPy. This is
  likely very early exploration, pre-dating the Python commits. Worth covering in
  Series 2 or a dedicated Series 7 Clojure post as the "closing the circle" moment
  (McCarthy's Lisp → Clojure's JVM Lisp → Neanderthal BLAS → proper HDC).
