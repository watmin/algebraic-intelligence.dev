---
title: "The Rust Port"
description: February 6. Python was the specification language — 239 tests, every primitive proven, every encoding pattern validated. Translating that spec to Rust was nearly a single shot. This is how it started and what the first day produced.
date: 2026-02-23
---

February 5. The Python implementation of zero-hardcode detection is committed. 100% attack recall, 4% false positive rate, no domain knowledge. The benchmark result appended to the batch 012 LEARNINGS is: `encode_data()`: 182 µs/packet. At 3,100 packets/sec single-core, a 1Gbps link at full packet rate is a 1:489 sampling ratio. The Python number is precise. The gap to production is also precise.

The Rust port started the next day.

---

## Python as the Rosetta Stone

Python wasn't the target. It was the specification language.

The LLMs can wield Python fluently — the standard libraries, the NumPy idioms, the data structure conventions. Building in Python first meant the LLMs had an enormous surface area of prior knowledge to draw from. Every primitive, every encoding pattern, every accumulator operation could be expressed in Python rapidly and correctly because the LLMs had seen thousands of examples of Python like it.

Rust is different. Rust's borrow checker, lifetime annotations, and trait system mean the LLM has to reason about ownership while also reasoning about the domain. That's a harder problem to get right in one shot without a reference implementation to validate against.

So Python came first deliberately — not because Python was the right language for packet-rate streaming, but because Python was the right language for proving the approach. Each challenge batch tightened the spec: here's what encode_data() needs to do, here's what the accumulator needs to preserve, here's the F1 number that constitutes correctness. By the time the Python implementation was complete, it was a precise behavioral specification with 239 passing tests.

Once that existed, the Rust port was nearly a single shot. The commit message says it: 2,554 lines in one evening. Not because Rust is easy, but because the spec was complete. Every function in `lib.rs` had a Python equivalent with known inputs, known outputs, and a test that validated the behavior. The LLM translated the specification into idiomatic Rust — same semantics, different execution model.

---

## One Evening, Thirteen Files

The initial commit message: "Initial Rust implementation of Holon VSA library." The commit itself: 2,554 lines across 13 files. One evening.

```
.gitignore
Cargo.toml
README.md
benches/benchmarks.rs
src/accumulator.rs    — frequency-preserving streaming ops
src/encoder.rs        — JSON encoding with role-filler binding
src/error.rs
src/lib.rs            — the flat Holon facade
src/primitives.rs     — bind, bundle, negate, amplify, prototype, difference, blend, resonance, permute
src/scalar.rs         — continuous scalar encoding (linear, log, circular)
src/similarity.rs     — cosine, dot, euclidean, hamming, and more
src/vector.rs         — bipolar vector type ({-1, 0, 1})
src/vector_manager.rs — deterministic atom→vector mapping via SHA256+ChaCha8
```

This is the full Python algebra, ported. Not a stub. Not a proof of concept. Everything from `vector_manager.rs` (SHA256+ChaCha8 for atom hashing, same deterministic approach as Python) to `accumulator.rs` (the streaming accumulator from challenge 010) to `encoder.rs` (role-filler binding, sequence modes, the works).

---

## The Flat Facade

The architecture at this point is flat. Everything lives in `src/`, exposed through a single `Holon` struct in `lib.rs`:

```rust
/// The main Holon client - primary interface for all operations.
pub struct Holon {
    encoder: Encoder,
    vm: VectorManager,
}

impl Holon {
    pub fn new(dimensions: usize) -> Self { ... }
    pub fn encode_json(&self, json: &str) -> Result<Vector> { ... }
    pub fn similarity(&self, a: &Vector, b: &Vector) -> f32 { ... }
    pub fn bind(&self, a: &Vector, b: &Vector) -> Vector { ... }
    pub fn bundle(&self, vectors: &[&Vector]) -> Vector { ... }
    pub fn prototype(&self, vectors: &[&Vector]) -> Vector { ... }
    pub fn difference(&self, a: &Vector, b: &Vector) -> Vector { ... }
    pub fn create_accumulator(&self) -> Accumulator { ... }
    pub fn accumulate(&self, acc: &mut Accumulator, v: &Vector) { ... }
    // ... and so on
}
```

The re-exports at the top of `lib.rs` make the underlying types accessible — `Encoder`, `VectorManager`, `Primitives`, `Similarity`, `Accumulator` are all pub — but the primary interface is the `Holon` struct. It's a facade over the flat module structure.

This is not the three-layer architecture described in the current README. That comes later — February 20, two weeks after this commit, after the engram work makes the separation between kernel, memory, and highlevel obvious. The starting point is simpler: one struct, all operations, same API shape as the Python `HolonClient`.

The parallel is exact by design. When challenge 012 was running in Python and the Rust port was being built, both needed to use the same concepts. The Python `HolonClient.encode_json()` maps directly to `Holon::encode_json()`. The Python `accumulate()` maps to `Holon::accumulate()`. Any experiment that worked in Python could be ported to Rust by mechanical translation of the API calls.

---

## SIMD From Day One

The same evening: `--features simd` is in `Cargo.toml` and the similarity computation branches on it. This wasn't an afterthought:

```toml
[features]
simd = ["dep:simsimd"]

[dependencies]
simsimd = { version = "6.5", optional = true }
```

The Python ceiling wasn't just "Python is slow" — it was specifically that NumPy's vectorized operations, while fast for batch work, have overhead that compounds in per-packet streaming. A Rust implementation could eliminate that overhead entirely, and SIMD on top of that was the path to the numbers the DDoS lab would need.

---

## First Benchmarks

The second commit of the day ("Fix compilation errors and add benchmarks") includes the first measured numbers. These are criterion benchmarks against the Python timings from the batch 012 performance log:

| Operation | Python | Rust (initial) | Speedup |
|-----------|--------|----------------|---------|
| bind | 12 µs | 5.2 µs | **2.3x** |
| similarity | 15 µs | 4.2 µs | **3.6x** |
| encode_json | 75 µs | 10.9 µs | **6.9x** |

Bundle and scalar operations showed even larger gains — 6x and ~20x respectively per the commit message, though the Python absolute numbers weren't recorded for those.

The commit message is honest: "2-20x speedup over Python." Not the 10-15x the README shows now. The initial numbers were from an unoptimized build; the final numbers came after profiling, tighter allocations, and the SIMD fix in the next commit.

The SIMD cosine fix landed the same day (`Fix SIMD cosine and Challenge 008 rate detection`). The fix mattered — the initial SIMD implementation had a bug in the cosine computation that produced wrong results. Running the SIMD path on incorrect math produces fast wrong answers, which is worse than slow correct ones. Fixed and validated before the day was out.

After the fix and a release build:

| Operation | Python | Rust | Speedup |
|-----------|--------|------|---------|
| encode_json | 75 µs | 7 µs | **10x** |
| similarity | 15 µs | 1.4 µs | **11x** |
| bind | 12 µs | 0.8 µs | **15x** |
| Full detection pipeline | 15s | 1.2s | **12x** |

With SIMD: similarity gets an additional **5x** on top of the 11x base. For the streaming detection workload — where similarity is computed on every packet — that compounds directly into packet throughput.

---

## Challenge 012 Ported the Same Day

The first Rust example isn't "hello world." It's a port of Python challenge 012 — the zero-hardcode detector — validating that the Rust implementation produces the same detection results as Python.

```
DETECTION RESULTS
------------------------------------------------------------
Phase              Packets   Detected       Rate       Status
warmup                 300          0         0% ○ LEARNING
DNS Attack           15000      14993       100% ✓ DETECTED
recovery-1             150          6         4% ✓ CLEAN
SYN Flood            18000      17993       100% ✓ DETECTED
recovery-2             150          6         4% ✓ CLEAN
NTP Attack           15000      14993       100% ✓ DETECTED
final                  150          6         4% ✓ CLEAN
------------------------------------------------------------
ATTACK RECALL                               100%
FALSE POSITIVE RATE                           4%
```

Identical results to Python. The vectors are not cross-compatible between languages — the same atom encoded in Python and Rust will produce different numbers because the RNG implementations differ. But the detection behavior is identical because the structure of the computation is the same. That validation was the point of the port: confirm the algorithm, not the bytes.

---

## Two Days Later: Walkable

February 8. The Walkable trait.

The JSON encoding path requires a round-trip through string serialization: a Rust struct becomes a JSON string, the JSON parser produces a `serde_json::Value` tree, the encoder walks the tree. For the DDoS sidecar where packets arrive at 3,100/sec (Python) and much faster (Rust), that string allocation matters.

The Walkable trait eliminates it:

```rust
pub trait Walkable {
    fn walk_type(&self) -> WalkType;
    fn walk_scalar(&self) -> Option<f64> { None }
    fn walk_map_items<'a>(&'a self) -> Box<dyn Iterator<Item = (&'a str, &'a dyn Walkable)> + 'a>;
    fn walk_list_items<'a>(&'a self) -> Box<dyn Iterator<Item = &'a dyn Walkable> + 'a>;
}
```

Any Rust struct implementing `Walkable` can be encoded directly — the encoder walks the struct's fields and values without serializing them to JSON first. The benchmarks from the commit:

- `encode_walkable`: ~6.2 µs/packet
- `encode_json` (via JSON path): ~6.5 µs/packet

Nearly identical throughput, but with meaningful differences: compile-time type safety, no runtime JSON parse errors, cleaner code in the sidecar. The packet struct used in the DDoS lab implements `Walkable` directly — no `to_json()` call in the hot path.

The same day: Python's `holon` repo gets a `Walkable` interface mirror. And batch 013 — vector-derived rate limiting — lands in both repos simultaneously.

This established the pattern that held for the rest of the project: anything added to Rust gets immediately backported to Python, and anything discovered useful in Python gets ported to Rust. The two implementations are kept in sync deliberately — not for redundancy, but as a second tier of validation. Each repo has its own unit tests, but the deeper assurance is behavioral agreement: if the same encoding logic on the same input produces the same similarity scores in both languages, the implementation is almost certainly correct. If they diverge, something is wrong in one of them and the tests will find it. Two implementations of the same algebra in two different type systems, with two independent test suites, catching two different classes of bugs. The Python implementation's 239 tests and the Rust implementation's growing suite are not redundant — they're complementary.

---

## What February 6 Established

The Rust port started as a flat facade mirroring the Python API. It had SIMD from the first day. It validated the zero-hardcode detector. It benchmarked at 10-15x Python on the operations that mattered.

What it didn't have: the three-layer architecture (that's Feb 20), the memory layer (Feb 19), engram support (Feb 19-20), or any of the DDoS lab integration that would make the speedup meaningful at packet rates.

Those come next — and they don't arrive in sequence. The DDoS lab is already running by Feb 7. The baseline lab starts Feb 8. From here the work spreads across all four repos simultaneously, feeding back into each other: the lab exposes what the library needs, the library gains the capability, the lab uses it.

---

Next: February 7–8 — the DDoS lab scaffold, the baseline lab, and the first week where everything is happening at once.
