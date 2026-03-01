# Blog Progress

Tracking the narrative arc of the Holon project across all posts.
Written ~4–5 weeks after the work started, as a detailed audit log of the
journey. Retrospective commentary is expected and honest. Post boundaries
emerge from natural narrative breaks, not rigid structure.

**Cross-repo timeline with commit-level detail:** see `doc/TIMELINE.md`

---

## Status Key

- `[ ]` not started
- `[~]` outlined / in progress
- `[x]` published

---

## Prologue

- `[~]` **Prologue: The Idea That Wouldn't Leave** — `blog/story/prologue.md`
  The origin story: VSA itch from a Clojure/conj talk, years at Shield doing
  informal research with no buy-in, Rete as the only win, post-AWS pivot,
  LLM-assisted dev unlocking everything, Grok for ideation / Claude for code,
  original DB use case, P vs NP detour, engram 750ms→3ms, naming.

---

## Series 001 — Primers (Reference Material)

*Conceptual foundation. Not chronological — reference pages for the concepts
the story posts build on.*

- `[~]` **VSA/HDC: A Working Introduction** — `blog/primers/series-001-000-vsa-primer.md`
- `[~]` **Atoms, Vectors, and the Encoding Stack** — `blog/primers/series-001-001-atoms-and-vectors.md`
- `[~]` **The Holon Algebra: Operations Reference** — `blog/primers/series-001-002-holon-ops.md`
- `[~]` **Holon Memory: Subspaces and Engrams** — `blog/primers/series-001-003-memory.md`
- `[~]` **Coordination-Free at Scale** — `blog/primers/series-001-004-coordination-free.md`

---

## Series 002 — Python: Experiments and Discovery (Jan 16 – Feb 5)

*The lab period. The Python implementation was where we figured out what
Holon actually was. Challenge batches drove the design.*

- `[x]` **Python: The Foundation** — `blog/story/series-002-001-first-experiments.md`
  Jan 16–30. Day-one architecture, database origin, Rete on day two,
  batches 001–003 + 006, 123x similarity speedup, $or superposition,
  primitives forged in Sudoku work, what two weeks established.

- `[x]` **The NP Wall** — `blog/story/series-002-002-the-np-wall.md`
  Batch 004 (Sudoku, 44 approaches, Jan 25–30) and the never-started
  batch 005. What VSA can't do, why it can't, and the five primitives
  built in the attempt.

- `[x]` **Scale, Detection, and the Python Ceiling** — `blog/story/series-002-003-scale-and-detection.md`
  Batches 006–012 (Jan 30 – Feb 5). LLM memory, enterprise retrieval
  (007/008), GPU dead end, 5M record scale ceiling, accumulator
  breakthrough, structural encoding vs naive bundling, zero-hardcode
  detection, and the measured throughput that made the Rust port inevitable.

---

## Series 003 — Building the System (Feb 6 – Feb 20)

*One timeline across all repos. holon-rs, holon-lab-ddos, holon-lab-baseline,
and holon (Python) were all progressing simultaneously during this period.
The story is told chronologically, not per-repo.*

Posts below are approximate groupings. Boundaries will emerge during writing.

- `[x]` **The Rust Port** (Feb 6) — `blog/story/series-003-001-the-rust-port.md`
  Why Rust. The flat facade architecture (single `Holon` struct in `lib.rs`).
  Initial benchmarks: 10x encode, 11x similarity, 15x bind. SIMD from day one.
  Challenge 012 ported same day. Walkable trait (Feb 8). Batch 013 in parallel.

- `[x]` **The Labs** (Feb 7–8) — `blog/story/series-003-002-the-labs.md`
  DDoS lab scaffold: AF_PACKET, macvlan hairpin, XDP sampling, 45k PPS.
  Baseline lab: WordPress stack, ipvlan, LLM-driven agents (3 admin + 20
  user, 80/15/5 browser distribution). Batch 013 (pattern identification,
  rule derivation, rate decoding) in both languages. AF_XDP misunderstanding.
  First all-day weekend session and the mental load of LLM-assisted dev.

- `[x]` **1.3 Million Packets Per Second** (Feb 9–12) — `blog/story/series-003-003-1-3m-pps.md`
  veth-lab PoC with holon-rs integrated. Accidental 1.3M PPS stress test,
  99.5% drop rate. 3D visualization ("I want to see into the machine") — random
  orthogonal projection, geometric separation visible, engram concept seeded.
  Batch 014 (9 extended forensics primitives). Tree Rete engine with blue/green
  deploy. BPF tail-call DFS: 1,000,000 rules at line rate, O(depth) not
  O(rules). DAG compiler as compiled beta network. Six verifier battles.
  ProgramArray lifetime debugging. "Likely Contributions to the Field" section.

- `[x]` **The Rule Engine** (Feb 13–16) — `blog/story/series-003-004-the-rule-engine.md`
  EDN rule format with streaming parser (40% smaller, comment-supporting).
  Range, bitmask, and L4 byte-match predicates. Named rate limiter buckets.
  Real-time metrics dashboard (SSE, live DAG viewer, per-rule trendlines).
  IPv4 header fingerprinting (6 new dimensions, zero detection code changes).
  2048-byte L4 payload analysis with autonomous byte-match rule derivation.
  Decay-based dual accumulator model — the 750ms detection baseline.

- `[x]` **Engrams and the 765ms → 3ms Moment** (Feb 17–20) — `blog/story/series-003-005-engrams.md`
  CCIPCA online subspace learning in Python (batch 017, 13 experiments). Engram
  library: single-packet recognition, 100% accuracy across 4 attack types, zero
  false activations, persistent save/load. Three-layer architecture refactor in
  Python (Feb 18) and Rust (Feb 20). Rust memory layer and engram parity.
  Sidecar refactor (3812 → 1140 lines in main.rs, 7 modules). Two integration
  bugs caught: IP address EDN round-trip quoting, raw vs normalized vector
  domain mismatch. Instant rule deploy on engram hit: **765ms → 3ms.**
  765ms lead time over drift-based detection, measured. Site launched same day.

---

## Series 004 — The L7 Lab (Feb 23–28)

*http-lab: Layer 7 WAF. Same architecture, different layer. Same week as
site launch. Two posts covering the scaffold + detection pipeline (Feb 23–26)
and the rule language + manifold firewall concept (Feb 27–28).*

- `[ ]` **The L7 Lab: Building the HTTP WAF** (Feb 23–26) — `blog/story/series-004-001-the-l7-lab.md`
  Four after-hours sessions. http-lab scaffold: TLS-terminating proxy,
  lossless ClientHello via ReplayStream, dual SubspaceDetector (TLS + REQ),
  FieldTracker, EngramLibrary, Rete-spirit DAG tree for HTTP. 97 tests day
  one. Detection pipeline alignment with veth-lab (Feb 24–25): per-IP token
  bucket rate limiting (with honest critique — per-IP is wrong for production,
  DoS vector), engram memory, multi-attack scenarios, RwLock 14s stall bug,
  adaptive TLS ordered-vs-set matching, real-time SSE dashboard (uPlot, DAG
  viz, per-rule counters). Specificity ranking (Feb 26). Bar anecdote.
  Concentration-based rules catching attacks; shape detection and surgical
  compound rules deferred to post 2.

- `[ ]` **No Rules, No Signatures: The Expression Tree** (Feb 27–28) — `blog/story/series-004-002-the-expression-tree.md`
  Composable Lisp-like rule language: 26 dimensions (11 HTTP + 15 TLS),
  13 operators, accessor chains (`(first (header "user-agent"))`,
  `(count (nth path-parts 2))`). HTTP duplicate headers as multi-valued
  lists, not single strings. `expr_tree.rs`: Rete-spirit DAG compiler,
  O(depth) evaluation, 1M rules at 1.1–2.6µs hit, 50ns miss. Zero-clone
  recursion. 16-core: 6M+ evals/sec. VSA surprise probing (`drilldown_probe`),
  shape encoding (fixed-length attacks via ScalarValue::linear),
  SurpriseHistory cross-tick consistency. Rule refinement + engram resilience
  bugs fixed. 287 tests. 7/7 attack waves mitigated (full results here).
  Manifold firewall concept moved to epilogue — just an idea, not built.

---

## Source Material Index

| Source | Location |
|--------|----------|
| **Cross-repo timeline** | `doc/TIMELINE.md` |
| Python README | `/holon/README.md` |
| Python docs (83 files) | `/holon/docs/` |
| Challenge learnings | `/holon/docs/` (batches 002–017) |
| Rust README | `/holon-rs/README.md` |
| Rust architecture | `/holon-rs/docs/ARCHITECTURE.md` |
| Encoder impl | `/holon-rs/src/kernel/encoder.rs` |
| Accumulator impl | `/holon-rs/src/kernel/accumulator.rs` |
| Vector impl | `/holon-rs/src/kernel/vector.rs` |
| Subspace impl | `/holon-rs/src/memory/subspace.rs` |
| Holon lib entrypoint | `/holon-rs/src/lib.rs` |
| Engram memory doc | `/holon-lab-ddos/veth-lab/docs/ENGRAM-MEMORY.md` |
| eBPF filter impl | `/holon-lab-ddos/veth-lab/filter/src/lib.rs` |
| Baseline lab | `/holon/holon-lab-baseline/` (local, 2 commits) |
| Clojure port | `~/work/holon-clj/src/holon/core.clj` (no git, Neanderthal BLAS) |
| http-lab architecture | `/holon-lab-ddos/http-lab/docs/ARCHITECTURE.md` |
| http-lab progress | `/holon-lab-ddos/http-lab/docs/PROGRESS.md` |
| Manifold firewall concept | `/holon-lab-ddos/http-lab/docs/CONCEPT-MANIFOLD-FIREWALL.md` |
| Rule language spec | `/holon-lab-ddos/http-lab/docs/RULE-LANGUAGE.md` |
| Expr types | `/holon-lab-ddos/http-lab/proxy/src/expr.rs` |
| Expr tree compiler | `/holon-lab-ddos/http-lab/proxy/src/expr_tree.rs` |
