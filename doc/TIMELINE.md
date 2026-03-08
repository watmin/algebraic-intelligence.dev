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

## Jan 24–30 — holon (Python): Batch 001 + 002, Sudoku

**2026-01-24** — Batch 001 challenges: task memory, recipe finder, bug reports,
spell search. All working. Graph matching (batch 002 RPM/graph) implemented the
same day. PDF quote finder scaffold.

**2026-01-25 through 2026-01-30** — **Sudoku** (challenge 004). 44 distinct
approaches across five days of commits. Starts with geometric VSA hypotheses,
ends with a FINAL_ASSESSMENT documenting every approach tried. Commits range
from "breakthrough" to "docs: remove hype and fix Challenge 2 union rule".
The honest assessment: VSA cannot solve Sudoku. Constraint satisfaction requires
exact backtracking — the approximate similarity geometry of HDC is the wrong tool.

Initial mathematical primitives exploration begins Jan 25. The five named
primitives — `prototype`, `difference`, `blend`, `amplify`, `negate` — are
committed Jan 30 (`c02b12a`) during the radical approach phase. These were
developed *during* the Sudoku work as tools to attack it — and proved far
more useful everywhere else.

**Blog:** Series 2, post 1 (batches 001-003); Series 2, post 2 (batch 004, P vs NP)

---

## Jan 26–31 — holon (Python): Batches 003, 006, 007, Scale Testing

**2026-01-26** — Unified `HolonClient` interface. API stabilization.
No Sudoku commits this day — a pause between the initial attempt (Jan 25)
and the radical approaches phase (Jan 28–30).

**2026-01-27** — Batch 003 (quote finder) initial solution. N-gram encoding
for fuzzy text search. Encoder improvements (configurable n-gram sizes,
geometric primitives). No Sudoku commits.

**2026-01-30** — Massive day. Sudoku wraps up: approaches 25–44, negate +
five new primitives added, FINAL_ASSESSMENT committed. Also: batch 006
(LLM memory augmentation). Enhanced batch 003 with primitives applied to text:
`prototype` for topic signatures (100% classification), `negate` for exclusion
queries. Similarity function optimization: **123x speedup** (loop → NumPy
matrix multiply). `$or` superposition (23x speedup over naive OR). Code
structure search. 16k dimensions confirmed as right default. Honest assessment
document added. Library consolidation.

**2026-01-31** — Batch 007 (multi-domain demos including Rete challenge).
`$time` marker for temporal similarity. Qdrant integration (`QdrantStore`).
Qdrant stress test. Dimension selection guide. Parallel encoding.
GPU support + batch 008 framework begins (see next entry).

Note: Batch 005 was never attempted — problems were queued but abandoned
when batch 004 exhausted patience. No batch 005 commits exist anywhere.

**Blog:** Series 2, post 2 (batch 004); Series 2, posts 3+ (batches 006–007)

---

## Jan 31 – Feb 1 — holon (Python): Batch 008, GPU Experiment

**2026-01-31** — Batch 008 begins: GPU support, batch 008 challenge framework,
first two challenges (API Request Pattern Analyzer). Dimension analysis for
prototype classification documented.

**2026-02-01** — All 7 batch 008 challenges complete (event correlation, ticket
routing, config drift, API pattern analysis — 92–100% accuracy). GPU backend
evaluated (honest assessment: 40x for large batches, impractical for streaming).
TorchHD backend (98.4% precision on numeric fields, 300 ops/sec — too slow).
New primitives (`resonance`, `conditional_bind`, sequence encoding modes).
`$mode` marker standardized. "Brutally honest" README section. Parallel
encoding (10 workers).

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

The initial architecture is a flat `src/lib.rs` with a single `Holon` struct —
a direct facade, not the layered structure that would come later. The three-layer
refactor (kernel/memory/highlevel) does not happen until Feb 20. Everything from
Feb 6 through Feb 19 builds on top of the original flat structure.

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
ipvlan + Squid proxy (23 unique source IPs), Playwright + Ollama LLM agents.
(Initial commit used macvlan; switched to ipvlan for AF_XDP support same day.)
3 admin agents (post creation, comment moderation), 20 user agents (browsing,
commenting). The traffic generator that would feed all subsequent experiments.

Also Feb 8: `holon-rs` adds Walkable trait (zero-serialization encoding), Batch
013 rate limiting port. `holon` (Python) adds batch 013.

**Blog:** Series 4 (baseline lab); Series 6 setup (DDoS lab scaffold)

---

## Feb 9–10 — veth Lab PoC, 1.3M PPS, Batch 014, Visualization

**2026-02-09** — holon-lab-ddos: veth-lab PoC: XDP DDoS mitigation
proof-of-concept. holon-rs integrated. **Stress test: 1.3M PPS attack,
99.5% drop rate.**

**2026-02-10** — holon (Python): 3D visualization module — PCA projection of
encoded traffic vectors into 3D space, rendered to inspect where vectors
actually land. Also batch 014: extended primitives for explainable VSA
(`segment`, `complexity`, `invert`, `similarity_profile`, `attend`, `project`,
`analogy`, `conditional_bind`).

holon-rs: batch 014 ports, vector bipolar distribution fix, doctest fixes.

**Key insight moment:** synthetic attack traffic and synthetic normal traffic
appeared in dramatically separated regions of the projected space. Visually
distinct, no overlap. This made the geometric separation concrete and observable
— not an abstraction but something you could look at. The observation that
these regions were measurable and nameable led directly to the engram concept:
if a cluster of vectors occupies a region of space, you can characterize that
region, snapshot it, and ask whether future vectors fall inside or outside it.
Engrams formalized what the visualization revealed. (Demo video added Feb 11.)

**Blog:** Series 6, post 1 (veth lab, first results)

---

## Feb 11 — holon-lab-ddos: Tree Rete Engine, Blue/Green Deploy

**2026-02-11** — Tree Rete engine with blue/green deployment and s-expression
rules. p0f-level fields (OS fingerprinting) in detection loop. Vector-derived
rate limiting integration with holon-rs.

holon (Python): streaming demo video added to visualization README.
holon-rs: $log/$linear markers, Walkable support for magnitude-aware encoding.

**Blog:** Series 6, post 2 (tree rete engine)

---

## Feb 12–14 — BPF Tail-Call DFS, Rule Language, Dashboard

**2026-02-12** — **Major milestone:** BPF tail-call DFS architecture.
1,000,000 rules compiled into a decision tree, enforced at line rate.
~5 BPF tail calls per packet regardless of rule count (O(depth), not O(rules)).
Comprehensive documentation suite: RETE.md, VSA.md, EBPF.md, DECISIONS.md,
SCALING.md. PLAN-NEXT.md.

**2026-02-13** — EDN rule format with streaming parser. Range predicates, Mask
predicate, In predicate, rate limiter observability. Named rate limiter buckets.
Legacy flat rules and bitmask Rete engine removed.
holon-rs: parity tracking (PARITY.md, MISSING-PRIMITIVES.md).

**2026-02-14** — Real-time metrics dashboard (SSE streaming, DAG viewer).
Multi-tenant byte matching. Multi-line EDN rule support. MaskEq predicates,
pattern guards, per-rule drop metrics. IN/NOT/OR predicates removed in favor
of explicit rule philosophy.

**Blog:** Series 6, post 3 (1M rules, BPF tail-call DFS, rule language)

---

## Feb 15 — Multi-Repo: Batch 016, Infrastructure Hardening

**2026-02-15** — Coordinated work across three repos:

- **holon** (Python): Batch 016 — windowed payload analysis, byte match
  rule derivation.
- **holon-rs**: Payload anomaly detection example, advanced vector ops,
  byte match derivation example. Python parity for distance metrics.
- **holon-lab-ddos**: IPv4 header fingerprinting for OS detection. BPF
  RingBuf (replacing PerfEventArray). Nanosecond-precision token bucket fix.
  Comprehensive test coverage (tree compiler, token bucket, complex rulesets).

**Blog:** Series 6, post 4 (infrastructure)

---

## Feb 16 — holon-lab-ddos: Payload Analysis, Decay Model

**2026-02-16** — Full 2048-byte L4 payload analysis (32 windows). Windowed
payload VSA with multi-byte l4-match rule derivation. Byte match derivation
writeup.

Decay-based per-packet processing with dual accumulator model.
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

## Feb 18 — holon (Python): Three-Layer Architecture Refactor

**2026-02-18** — holon (Python): major refactor to clean three-layer architecture
(kernel/memory/highlevel). Module aliases promoted, TimeScale wrapper added,
showcases rewritten for depth. The engram integration made the architectural
separation obvious — the refactor followed naturally.

**Blog:** Series 2 or Series 3 (architecture retrospective)

---

## Feb 19 — holon-rs: Memory Layer, Engram Parity

**2026-02-19** — holon-rs: memory layer, temporal encoding, showcase examples.
Python-level engram/subspace parity in Rust. Crate prepared for crates.io
publishing.

holon-lab-ddos: sidecar refactored — split main.rs into focused modules.
Bucket key derivation fix. Dead code cleanup. (Engram integration in sidecar
happens the next day.)

**Blog:** Series 3 (Rust memory layer)

---

## Feb 20 — Three-Layer Refactor, Engram Hit, 750ms → 3ms

**2026-02-20** — holon-rs: three-layer module structure (kernel/memory/highlevel)
matching Python. ndarray for vectorized CCIPCA and accumulator operations.
`get_vector()` exposed on Encoder.

holon-lab-ddos: **instant rule deploy on engram hit.** Re-detected attacks
recognized in a single packet. Rules deploy immediately without waiting for
drift-based detector. Sidecar refactored to use kernel/memory layer imports
directly. Engram writeup finalized (ENGRAM-MEMORY.md).

**Result: 750ms → 3ms.** The accumulator baseline took 750ms to accumulate
enough signal. The engram system recognizes a previously-seen attack in the
first packet: 3ms.

**Blog:** Series 3, architecture post; Series 6, post 6 (engram hit, 750ms → 3ms)

---

## Feb 20 (evening) — algebraic-intelligence.dev: Site Created

**2026-02-20** — algebraic-intelligence.dev repository created. Initial static
HTML placeholder. Astro + Starlight scaffold. Logo added. Site structure
organized: The Story / The Library / Demos / Guides.

**Blog:** Meta (this site's own origin)

---

## Feb 21–22 — holon (Python): Batch 018, Projector Fix

**2026-02-21** — Batch 018 challenge doc added: eigenvalue-as-probe window
matching. Using the eigenvalue spectrum as a cheap pre-filter for engram
library matching — O(k) comparison instead of O(k×dim) full residual.
Concept: `match_spectrum()` for window-level pattern matching.

**2026-02-22** — `.gitignore` updates. Projector docstring corrected:
"orthogonal random projection" (QR decomposition), not plain random projection.

**Blog:** Series 3 context (batch 018, match_spectrum concept)

---

## Feb 23 — holon-lab-ddos: http-lab Scaffold

**2026-02-23** — `http-lab` initial implementation: Layer 7 WAF proxy
mirroring veth-lab's architecture at HTTP. Same day as site launch.

Core components in one session:
- TLS-terminating reverse proxy (tokio-rustls) with lossless ClientHello
  parsing via custom `ReplayStream` — bytes captured before rustls sees them
- `TlsContext`: full lossless ClientHello (cipher suites, extensions,
  supported groups, ALPN — all in wire order)
- `RequestSample`: full HTTP request (path_parts, query_params, headers
  in wire order, preserving duplicates and casing)
- Both implement `Walkable` → holon Vector encoding
- Rete-spirit DAG rule tree ported from veth-lab for HTTP dimensions
- holon-rs sidecar with dual SubspaceDetector (TLS + REQ), EngramLibrary,
  FieldTracker, RuleManager, ArcSwap deployment
- `http-generator`: scenario-driven HTTP flood with named TLS profiles
  (chrome_120, firefox_121, curl_800)
- 97 tests: TLS parser, rule tree, enforcer, integration pipeline

**Blog:** Series 4, post 1 (http-lab: L7 WAF scaffold)

---

## Feb 24–25 — holon-lab-ddos: Autonomous L7 WAF

**2026-02-24** — String predicates, EDN rules, engram lifecycle fixes.
Switched from FNV-1a hashes to String keys in Predicate/TreeNode — HTTP
is clear-text, readability matters. EDN rule syntax matching veth-lab.
Individual sample scoring (no bundling/averaging). Concentration-based
field attribution. TLS detector separately tuned (faster convergence,
tighter threshold for lower sample volume). Baseline RPS tracking.
FieldTracker baseline freeze at warmup completion.

**2026-02-25** — Full autonomous detection pipeline:
- Per-IP token bucket rate limiting (true rate limiting, 429 on excess)
- Engram memory: minting with surprise fingerprint + EDN rules, instant
  re-deployment with dynamically recalculated rate limits
- Multi-attack scenarios: `multi_attack.json` — 15 phases, 4 attack types
  + 4 replay waves (GET flood, credential stuffing, scraper, TLS-randomized)
- TLS randomization: `bot_shuffled` profile (consistent ciphers/extensions,
  random ordering) → caught via set-based TLS fields (cipher_set, ext_set,
  group_set) — order-independent detection
- 14-second stall bug found and killed: `RwLock` contention in drain loop,
  moved stats writes outside the hot path
- Real-time SSE dashboard: uPlot charts, detection state panels, active
  rules, event log, 120-second timeline window

**Blog:** Series 4, post 1 (detection pipeline, rate limiting, dashboard,
multi-attack scenarios)

---

## Feb 26 — holon-lab-ddos: DAG Viz, Per-Rule Counters, Specificity

**2026-02-26** — Three major additions in one session:

**DAG visualization**: interactive rule tree canvas (ported from veth-lab),
terminal nodes as orange diamonds, two-pass pruning (dead-end leaves +
wildcard chain collapse), bounding-box hit detection, tooltip with full
EDN rule expression.

**Per-rule hit counters**: `RULE_COUNTERS` global map, incremented on
every rule match. Top-5 rules by rate overlaid as dashed lines on the
enforcement chart. Rule labels via `constraints_sexpr()` (no wrapper noise).
Legend capped at 75% width to keep latest chart data visible.

**Best-match Specificity evaluator**: DFS explores both specific AND
wildcard branches, selects highest `Specificity` (lexicographic: layers →
has_http → constraints). Cross-layer TLS+HTTP rules beat single-layer.
HTTP constraints preferred over TLS-only at same constraint count. Adding
a new tiebreaker is a one-line field insertion.

7-wave multi-attack scenario, all mitigated:
GET flood, credential stuffing, scraper (via shape detection), shuffled
TLS, 3 replay waves (2 engram hits + 1 existing rules).

**Blog:** Series 4, post 1

---

## Feb 27 — holon-lab-ddos: Composable Rule Language + Expression Tree

**2026-02-27** — Rule language and tree compiler:

**RULE-LANGUAGE.md** spec written: Lisp-like s-expressions over EDN.
Three orthogonal concepts: domain accessors (TLS/HTTP protocol fields),
generic functions (`first`, `last`, `nth`, `get`, `count`, `keys`,
`vals`, `set`, `lower`), and operators (`=`, `exists`, `prefix`,
`suffix`, `contains`, `regex`, `gt`/`lt`, `subset`/`superset`).
No magic named shortcuts — `(first (header "host"))` replaces `host`.
26 dimensions (11 HTTP + 15 TLS), 13 operators. Extensible by adding
domain accessors only.

**`expr.rs`**: `RuleExpr`, `Expr`, `Dimension`, `Operator`, `Value`
types. Full EDN parser/serializer via `edn-rs`. Dimension extraction
(`extract_from_request()`, `extract_from_tls()`) resolves accessor
chains against live protocol data.

**`expr_tree.rs`**: Rete-spirit DAG compiler for `RuleExpr`. Dynamic
dimension ordering (by rule participation count). Dual match modes:
Exact (HashMap O(1)) + Membership (O(|collection|)). Guard predicates
for tier-2 operators. Zero-clone recursion (`Cow` canonical keys, borrow
slices). Lazy rule labels. FNV fingerprint for O(1) tree identity.

Performance (1M rules, release):
- 2-dim hit p50: 1,109ns — miss p50: 50ns
- 6-dim hit p50: 2,573ns — miss p50: 50ns
- Compilation: 3.2s (2-dim), 5.9s (6-dim)
- 16-core throughput: ~6M+ evals/sec (mixed workload)

**holon (Python)**: engram manifold visualization concept added to
`visualization/README.md` — UMAP on k-D subspace coefficients instead
of random orthogonal projection, preserving manifold geometry.

**Blog:** Series 4, post 2 (rule language, expression tree, benchmarks)

---

## Feb 28 — holon-lab-ddos: VSA Surprise Probing, Engram Resilience, Manifold Firewall

**2026-02-28** — Completing the autonomous mitigation pipeline:

**VSA Surprise Probing** (`drilldown_probe`): unbinds anomalous vector
component against role vectors for every walkable field, ranks by
residual reduction. `SurpriseHistory` ring buffer requires cross-tick
consistency before emitting a detection. `DetectionKind`: Content (same
literal value) > Shape (same length) > Duplicate (repeated headers).

**Shape Encoding**: path_shape (segment lengths via `ScalarValue::linear`),
query_shape (key/value lengths), header_shapes (per-header name+value
length). Catches fixed-length high-cardinality attacks — e.g., a scraper
hitting 5-char product IDs with random values.

**Bug Fix A — Rule Refinement**: removed `is_redundant` subsumed check.
Broader rules (streak=3, early) now coexist with surgical compound rules
(streak=5, surprise data ready). Tree Specificity picks the most surgical
match. Before fix: compound rules were silently discarded.

**Bug Fix B — Engram Resilience**: engram hit no longer short-circuits
fresh rule generation. Fast-path deployment AND parallel learning. If
engram's rules miss (false-match), fresh rules cover the gap. No
poisoning: fresh rules stored separately from deployed engram rules.

**Full scenario result**: 7/7 attack waves mitigated, including:
- Scraper via shape detection (`(count (nth path-parts 2)) 5`)
- Shuffled TLS via set-based matching
- Replay waves via engram memory
- Compound cross-layer rules: `{path + user-agent + tls-ext-types}`

**Expression tree integration**: full pipeline swap from `RuleSpec`/
`CompiledTree` to `RuleExpr`/`ExprCompiledTree`. All 287 tests passing.
Engram rules serialized as EDN strings (round-trip stable).

**CONCEPT-MANIFOLD-FIREWALL.md**: Four-layer defense architecture:
- Layer 3: rule tree (~50ns, known threats)
- Layer 0: normal allow list (manifold membership, ~0.4ms)
- Layer 1: surprise-as-rule (residual IS the enforcement signal)
- Layer 2: window-level spectrum matching (meta engrams, early warning)
Inversion: the geometry IS the rule. Attacker must be genuinely normal.

Also Feb 28:
- `--rule-ttl` CLI flag for demo screencaptures (short expiry shows engram
  recall from cold state), three demo scenario configs
- Distinct TLS profiles in generator: `curl_800` uses TLS 1.2 only + 3
  ciphers, `python_requests` drops ChaCha — creating genuine ClientHello
  divergence for TLS detection validation

**Blog:** Series 4, post 2

---

## Mar 1 — holon (Python): Batch 018 Experiments — Spectral Firewall Validation

**2026-03-01** — 16 experiments validating the four-layer spectral firewall
architecture end-to-end in Python (8,152 insertions across 21 files).

New library primitives:
- `OnlineSubspace.subspace_alignment()` — directional manifold comparison
  (principal angles between subspaces)
- `EngramLibrary.match_alignment()` — library-wide alignment scoring

Key findings:
- Magnitude (spectrum) and direction (alignment) are complementary; neither
  suffices alone (experiment 004)
- Combined dual-signal pre-filter: 100% accuracy at 75–80% compute savings
- `drilldown_probe` attributes anomaly to leaf fields (`tls.version`,
  `headers.[1].[1]`) rather than monolithic parents
- Denial tokens seal complete verdict in ~2KB, round-trip 100%
- Preprod engrams generalize to production at 100% coverage
- CI/CD engram promotion validated

Introduces `match_spectrum` (eigenvalue cosine), `subspace_alignment`
(principal angles), `match_alignment` (library-level directional matching),
and recursive drilldown surprise probing — all validated against the
four-layer architecture conceived in the Feb 28 concept doc.

**Blog:** Series 5, post 1

---

## Mar 2 — holon-lab-ddos: Manifold Firewall Implemented — 41µs

**2026-03-02** — The concept doc from Feb 28 becomes code. Four-layer defense
with no signatures, no training data, no GPU:
- Layer 3: symbolic rule tree (~50ns known patterns)
- Layer 0+1: manifold scoring (encode + project + residual, inline)
- Layer 2: window spectrum matching (async threat classification)

New modules:
- `proxy/src/manifold.rs`: `ManifoldState`, `evaluate_manifold`, `drilldown_audit`
- `proxy/src/denial_token.rs`: AES-256-GCM sealed context tokens
- `proxy/src/http.rs`: inline manifold scoring after Layer 3 eval
- `sidecar/src/detectors.rs`: `WindowTracker`, normal engram freeze/thaw
- `runner/src/engram_cli.rs`: engram list/export/import for CI/CD

Experiment infrastructure:
- Generator: `dvwa_browse`, `scanner`, `smuggle` patterns + per-phase
  instrumentation (PHASE_RESULT with latency p50/p95/p99)
- `scenarios/manifold_firewall.json`: 10-phase validation scenario
- `scenarios/dvwa/`: Docker DVWA + Nikto live test setup

Validated results (64,678 requests, 205 seconds):
- Scanner deny rate: 97–100%
- Normal false positive rate: 0%
- DDoS rate-limit rate: 91%
- Deny-path latency p50: **41 microseconds**
- Training: 500 samples (~6 seconds), unsupervised, online

309 tests passing (247 proxy + 62 sidecar).

**Blog:** Series 5, post 1

---

## Mar 3 — holon-lab-ddos: DVWA+Nikto Live Validation, Spectral Firewall Branding

**2026-03-03** — Validated against a real Nikto scanner targeting a live DVWA
instance. **10,121 requests denied, 0 exploitable vulnerabilities found
through the proxy.**

Bug fixes:
- `WindowTracker` spectrum classification runs on first contact (empty library)
- NaN residuals default to Deny, NaN drilldown scores sort deterministically

Features:
- Denial key persisted to disk, `holon-engram unseal` CLI decodes tokens
- Enriched `DenialContext` (query, user-agent, headers, cookie keys)
- Generator `--cookie` flag for real authenticated DVWA sessions (94% 2xx)
- End-to-end `run-nikto.sh`: DVWA setup, auth, warmup, scan, summary

**Branding:** "manifold firewall" → "spectral firewall" across all docs,
comments, and UI text. Code identifiers unchanged.

**Blog:** Series 5, post 1

---

## Mar 4 — holon-lab-ddos: Striped Encoding, WAF Dashboard, Parameter Sweep

**2026-03-04** — Intensive optimization day across four commits:

**Striped encoding** (32×4096, k=8 per stripe) with FQDN leaf hashing for
crosstalk-free anomaly attribution. Cosine similarity replaces broken
L2-norm drilldown. Performance tuned: k=64→8 per stripe (8x speedup),
double/triple residual computation eliminated (14x total reduction).

**WAF dashboard** (`/waf`): streaming SSE verdict cards with color-coded
JSON request views, spectral attribution bars, anomaly gauge, and trendline.
Incremental DOM rendering with `rAF` batching and scroll-pause for 60fps
under load.

**Attribution logging + TLS dominance finding**: structured `log_attribution()`
prints top 15 fields per deny. Discovered that Nikto's cipher/extension
ordering dominates cosine attribution (99.5% of denies) — 30+ TLS leaf
bindings collectively outrank HTTP fields. Technically correct (same signal
as JA3/JA4) but limits WAF-level discrimination. HTTP fields appear in
attribution tail.

**Parameter sweep** (`DIM=1024, K=32`): at same compute budget (DIM×K×STRIPES=1M):
- Old (4096×32×8): 2.1ms, 4.7x separation
- New (1024×32×32): 997µs, **13.0x separation**
- `sigma_mult` widened 3.5→5.0 (eliminates FP on real DVWA traffic)

Control experiment: **Nikto finds 17 vulns hitting DVWA directly, 0 through
the spectral firewall.**

Docs: next investigations outlined (leaf binding ground truth, adaptive
learning with four approaches: gated continuous, multi-tier probation,
engram stacking, amnesia-gated).

**Blog:** Series 5, post 2

---

## Mar 5 — holon-lab-ddos: char_list Encoding, HQ Federation Design

**2026-03-05** — Encoding refinement and federation architecture:

**char_list encoding**: character-level positional encoding for path, query,
src_ip, and header values. Similar strings produce similar vectors (fuzzy
matching) instead of maximally orthogonal hashes. Header values use
char_list; names stay atomic. Leaf count dropped from ~100 to ~53/36
(normal/attack) thanks to `List` composition. K optimized 32→20 (30%
less residual latency, near-identical deny margin).

**Anomaly breadth design**: breadth and adaptive learning are complementary —
breadth is the intelligence that makes adaptive learning safe against slow
poisoning. Documents the 2D decision space (residual × breadth), the
dangerous "broad + sub-threshold" quadrant, and three threshold-free
candidates (entropy, concentration ratio, Gini coefficient).

**HQ federation investigation**: centralized engram collection/redistribution.
HQ periodically collects learned state from edge nodes, merges, redistributes
as cold-boot starting points. Engram merge strategies: subspace union,
eigenvector averaging, concatenate-refit, federated CCIPCA.

**Key design decision**: the engram (learned spectral subspace) is the
primary federated artifact — the geometric "shape of normal." Rules are
a separate DDoS-specific reactive mechanism, not the primary federation
value.

**Blog:** Series 5, post 2

---

## Mar 6 — holon-lab-ddos: Multi-Tool Attack, Self-Calibration, von Neumann

**2026-03-06** — The most consequential day since the manifold firewall
implementation. Four major developments:

**Multi-tool concurrent attack experiment**: 20 LLM browser agents
(Grok-4-fast + Playwright, 3 engines, 20 source IPs) alongside Nikto +
ZAP + Nuclei, all concurrent. **3,605 attack denials, 0 browser-agent
denials.** Traffic source labeling via `X-Traffic-Source` header (stripped
before VSA encoding). Tuned sigma_mult 5.0→3.0, deny_mult 2.0→1.5,
adaptive gate 0.7→0.5 after discovering threshold inflation and adaptive
poisoning with diverse training data.

**Self-calibrating decision boundaries** — eliminates all magic numbers:
- Rolling `ResidualBuffer` tracks confirmed-normal residuals (allowed +
  backend 2xx/3xx), providing ground truth for threshold calibration
- `score_threshold` = buf_max (empirical allow ceiling)
- `deny_threshold` = sqrt(buf_max × CCIPCA_threshold) — geometric mean
  of tight empirical and loose statistical boundaries
- Backend response status gate: only learn from 2xx/3xx responses
- Baseline engram persistence: save/load StripedSubspace on shutdown/boot
- Configurable warmup count via `WARMUP_SAMPLES` env var
- Validated: 5,118 attack denies, **99.1% precision**, ~3 early FPs during
  convergence then zero

**Von Neumann automaton analysis**: the spectral firewall structurally
satisfies von Neumann's three properties of self-reproducing automata —
the engram is both the description (geometric knowledge of normal traffic)
and the program (projection matrices that produce verdicts). Self-calibrating
thresholds and HQ federation complete the analogy at fleet scale.

**Async HQ federation with versioned rollback**: hosts call home on
jittered intervals (push local engram, fetch latest merged norm). HQ is
passive — merges, versions, serves. No push, no poll, no fleet coordination.
Versioned engrams enable instant rollback: pin to prior version, freeze
merging, fleet converges organically. Resilience: HQ down = local autonomy,
network partition = local autonomy, bad merge = version rollback,
compromised node = engram validation + rollback.

Also: gitignore/Cargo.lock tracking fixes (`f12acab`, `b083016`, `123454c`).

**Blog:** Series 5, post 2

---

## Summary: The Six-Week Arc

| Period | Focus | Key Output |
|--------|-------|------------|
| Jan 16–17 | Python foundation | Working VSA library, HTTP API |
| Jan 24 | Batch 001 + 002 | Structural encoding proven across 8 challenges |
| Jan 25–30 | Batch 004: Sudoku wall | NP limits found; 5 primitives forged (Jan 30) |
| Jan 27–30 | Batches 003, 006, scale | 123x speedup, $or superposition (both Jan 30) |
| Jan 31–Feb 1 | Batch 007, 008, Qdrant | 92–100% accuracy, GPU assessed, 7 domains |
| Feb 2–5 | Batches 009–012 | 94.5% at 1M scale, F1=1.0 detection, zero-hardcode |
| Feb 6 | holon-rs starts | 10–15x speedup, flat facade architecture |
| Feb 7–8 | Labs start | DDoS lab scaffold, baseline traffic generator |
| Feb 9–10 | veth-lab PoC, visualization | 1.3M PPS, 99.5% drop rate, 3D PCA viz |
| Feb 11 | Tree rete engine | Blue/green deploy, p0f fields, rate limiting |
| Feb 12 | **1M rules proven** | BPF tail-call DFS, O(depth) not O(rules) |
| Feb 13–14 | Rule language, dashboard | EDN rules, predicates, SSE metrics |
| Feb 15 | Infrastructure hardening | RingBuf, token bucket fix, test coverage |
| Feb 16 | Payload analysis, decay model | 2048-byte L4 windows, 750ms baseline |
| Feb 17 | Engrams (Python) | Single-packet attack recognition |
| Feb 18 | Python three-layer refactor | kernel/memory/highlevel architecture |
| Feb 19 | Engrams (Rust) | Memory layer, crates.io prep |
| Feb 20 | Rust three-layer + engram hit | **765ms → 3ms**, kernel/memory layer imports |
| Feb 21–22 | Batch 018, projector fix | match_spectrum concept, docstring correction |
| Feb 23 | http-lab scaffold | TLS proxy, dual SubspaceDetector, 97 tests |
| Feb 24–25 | Full L7 detection pipeline | Rate limiting, engram memory, TLS randomization |
| Feb 26 | DAG viz, Specificity ranking | 7/7 attack waves mitigated, per-rule counters |
| Feb 27 | Rule language + expr tree | 26 dims, 13 ops, 1M rules at 1.1–2.6µs |
| Feb 28 | VSA probing, manifold firewall | Engram resilience, 287 tests, concept doc |
| Mar 1 | Batch 018 experiments (Python) | 16 experiments, spectral firewall validated E2E |
| Mar 2 | **Manifold firewall implemented** | Four-layer defense, **41µs deny latency**, 309 tests |
| Mar 3 | DVWA+Nikto live validation | 10,121 denials, 0 exploitable vulns, spectral branding |
| Mar 4 | Striped encoding, param sweep | Cosine attribution, WAF dashboard, **13x separation** |
| Mar 5 | char_list encoding, HQ design | Fuzzy string matching, engram federation architecture |
| Mar 6 | **Self-calibrating boundaries** | 20 LLM browsers + 3 scanners, 0 FP, **99.1% precision** |

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
| Series 4, post 1: http-lab scaffold + L7 pipeline | Feb 23–26 (holon-lab-ddos) |
| Series 4, post 2: Rule language + manifold firewall | Feb 27–28 (holon-lab-ddos) |
| Series 5, post 1: The Spectral Firewall | Mar 1–3 (holon + holon-lab-ddos) |
| Series 5, post 2: Self-Calibrating | Mar 4–6 (holon-lab-ddos) |

---

## Notes for Writing

- **Batch 004** is the P vs NP attempt. Sudoku. 44 approaches committed across
  five days (Jan 25–30), ending with `FUTURE_RADICAL_APPROACHES.md` and
  `FINAL_ASSESSMENT.md`. Feeds Series 2 post 2 (the NP wall).
  **Batch 005 was never attempted.** The problems (graph 3-coloring, Max-SAT,
  TSP, Set Cover) were queued while batch 004 was still in progress. By the
  time 44 approaches had run their course, patience and tokens were exhausted.
  There are no batch 005 commits anywhere. The problems were abandoned, not omitted.

- **holon-lab-baseline** has only 2 commits. The lab was built but the traffic
  hasn't yet been fed into scrubber experiments. Series 4 should note this
  honestly — the infrastructure exists, the integration is pending.

- **The three-layer architecture** (kernel/memory/highlevel) was refactored
  into Python (Feb 18) and Rust (Feb 20) in the same sprint as the engram
  integration. This is not coincidence — the engram work made the architectural
  separation obvious. The initial Rust implementation (Feb 6) used a flat
  `src/lib.rs` facade with a single `Holon` struct. The layered structure
  was not the starting point; it was the destination.

- **holon-clj** exists at `~/work/holon-clj/`. No git history — a single file
  (`src/holon/core.clj`) with deps: Clojure 1.12, Neanderthal 0.49 (BLAS/LAPACK),
  Fluokitten (category theory / functors). Neanderthal gives native BLAS operations
  on BLAS vectors — the Clojure port uses proper numeric tower, not NumPy. This is
  likely very early exploration, pre-dating the Python commits. Worth covering in
  Series 2 or a dedicated Series 7 Clojure post as the "closing the circle" moment
  (McCarthy's Lisp → Clojure's JVM Lisp → Neanderthal BLAS → proper HDC).
