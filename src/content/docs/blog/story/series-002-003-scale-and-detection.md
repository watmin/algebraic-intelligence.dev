---
title: "Scale, Detection, and the Python Ceiling"
description: After the NP wall, batches 006–012 confirmed what VSA is actually good at — LLM memory, enterprise retrieval, the GPU dead end, 5 million records, the accumulator breakthrough, and the throughput numbers that made the Rust port inevitable.
date: 2026-02-23
---

Coming off the Sudoku failure, the framing reset. Batch 004 showed where VSA doesn't work. Batches 006 through 012 showed where it does — and how far that goes before Python runs out of headroom.

---

## Batch 006: The Contrast

Coming right after the Sudoku failure, the framing was deliberate: go back to problems that match what VSA actually does.

The four challenges: persistent LLM collaborator memory, hypothesis tracking, user state mirroring, and a demo metrics dashboard. All of them fuzzy retrieval over structured records. No global constraints. No exact answers required. Top-k ranking is natural.

The metrics from 006-004:

| Metric | Without Holon | With Holon | Change |
|--------|---------------|------------|--------|
| Context tokens used | 2,500 | 450 | −82% |
| Decision recall | 40% | 95% | +138% |
| Repeated explanations | 5 | 0 | eliminated |
| Response latency | 1.2s | 0.95s | −21% |

The 82% token reduction comes from the right retrieval: instead of dumping the full conversation history into the LLM context, you query for the decisions, preferences, and states most relevant to the current request, and inject only those. 95% decision recall at 450 tokens vs 40% at 2,500 is the gap between a vector-indexed memory and a raw context window.

This is what VSA was designed for. "Find the five most relevant decisions from the last three weeks" is a cosine similarity query. "Ensure the 9th digit in this Sudoku row isn't duplicated anywhere in the column" is not.

---

## Batches 007–008: Wider Domains, GPU Assessment

Batch 007 (Jan 31) pushed into multi-domain demonstrations: a Rete/rule engine challenge (the same instinct that showed up on day two with the forward chaining demo), multi-format database search, code structure search by call pattern and complexity. These were breadth tests — does the encoding hold when the domain changes completely? It did.

The same day brought the Qdrant integration (`QdrantStore`), the `$time` marker for temporal similarity encoding (same hour next week maps to a geometrically close vector), and the dimension selection guide. 16k dimensions is the right default for complex structured documents: the standard deviation of cosine similarity between two random vectors is ~1/√d, which at 16k is 0.0079 — tight enough that 10,000+ near-orthogonal atoms fit comfortably before the space gets crowded.

Batch 008 (Jan 31 – Feb 1) was seven challenges in the enterprise/operational domain. Every one of them fuzzy top-k retrieval — and every one of them worked:

- **Ticket routing**: k-NN at k=5 → 100% routing accuracy, 2.46ms latency
- **Config drift**: `difference(golden, actual)` magnitudes — clean config: 0.0, drifted: 27.5 (2,747× ratio)
- **Event correlation**: 100% detection on 5 attack types (brute force, data exfil, lateral movement, privilege escalation, ransomware), 3.88ms latency over 10,146 events
- **Document retrieval**: 1,200 documents, 0.88ms query latency, time-proximity queries working via `$time` encoding

Honesty check on those numbers: all of this is synthetic data designed with clean class separation. The 100% accuracy scores on ticket routing and event correlation are because we built the test data that way — distinct categories, planted signal, no ambiguity. Real data has overlap, noise, missing fields, edge cases. We never benchmarked against alternatives (Elasticsearch, TF-IDF, a random forest). The numbers prove the encoding works. They don't prove it's better than anything else for these tasks.

The GPU result from batch 008 is worth noting directly: 40× speedup for batch matrix operations, 0.05× for individual vector ops. GPU transfer overhead dominates for one-at-a-time queries, which is what streaming anomaly detection requires. We tested the 4090. We noted it. We moved on. The workload doesn't fit.

---

## Batch 009: Deterministic Training at Scale

After demonstrating that the approach worked across domains, batch 009 asked: can we learn encoding parameters instead of hand-tuning them? And how does this hold at actual scale?

The "deterministic training" concept: rather than gradient descent over neural weights, use symbolic search over field weights and binding combinations. Given labeled examples, find field weights that maximize classification accuracy. No random initialization. No backprop. Deterministic, reproducible.

It works. A few results:

| Condition | Accuracy |
|-----------|----------|
| Uniform weights, clean data | 89% |
| Learned weights, clean data | 100% |
| Learned weights, 30% mislabeled | 100% |

The robustness to 30% label noise comes from high-dimensional bundling: incorrect examples get outvoted by correct ones. Noise averages out in 4096 dimensions in a way it doesn't in 2D.

Then we pushed it to scale on a 14-core, 54GB RAM machine:

| Run | Categories | Accuracy | Encode rate | Time | Memory |
|-----|------------|----------|-------------|------|--------|
| 1M records | 100 | 94.5% | 25,581/sec | 44s | 3.9 GB |
| 1M records | 1,000 | 84.5% | 29,561/sec | 68s | 3.9 GB |
| 5M records | 1,000 | 84.4% | 23,322/sec | 7.5 min | 19.5 GB |

5 million records, 1,000 categories, 84.4% accuracy, 7.5 minutes, 19.5 GB RAM. That's the ceiling: encoding rate stable at 23–30k per second regardless of scale, accuracy plateauing around 84% for 1,000 categories at 70% signal strength. The bottleneck is `encode_data()` — the Python/NumPy structural encoding call — and parallelization gives 2.9× at 10 workers with shared codebook.

The Qdrant integration benchmark made the wall visible: 440 inserts/sec, 13.5ms query latency, 132.8 seconds to build the HNSW index on 80k vectors. For 1M vectors, extrapolated: ~30 minutes index build. These are Python-callable numbers. They're real. They're what Python can do.

That's when the Rust port decision started crystallizing. The encoding rate would need to be an order of magnitude faster for the real-time detection workload that was coming next.

---

## Batch 010: The Accumulator Breakthrough

The first challenge involving real network data.

The central finding from batch 010 wasn't any particular detection number — it was the discovery that `prototype_add()` is the wrong primitive for streaming anomaly detection.

`prototype_add()` thresholds after every update:

```python
def prototype_add(prototype, example, count):
    weighted = prototype * count + example
    averaged = weighted / (count + 1)
    return threshold_bipolar(averaged)  # ← Loses frequency information
```

After 10,000 observations, thresholding means each new one barely moves the result. The frequency signal is gone. What you need instead is an accumulator — a running float sum, no thresholding, normalized only when you need to query against it:

```python
accum = encoder.create_accumulator()      # float64 zero vector
accum = encoder.accumulate(accum, vec)    # just adds: accum += vec
normalized = encoder.normalize_accumulator(accum)  # unit normalize for queries
```

With 99% benign traffic and 1% attack traffic in the stream, benign patterns contribute 99× more to the accumulator. The frequency signal is preserved. Normalization highlights the directions with strong agreement.

The separation this produced:

| Signal | `prototype_add()` | Accumulator |
|--------|-------------------|-------------|
| Benign similarity | ~0.01 | 0.52–0.82 |
| Attack similarity | ~0.00 | 0.21–0.41 |
| Overlap | Yes (unusable) | None |
| F1 | ~0.23 | **1.000** |

The benign minimum (0.52) is above the attack maximum (0.41). No threshold tuning. Clean separation.

From there, the batch extended into continuous learning with a decaying accumulator:

```
accumulator = decay × accumulator + weight × new_vector
```

Where `decay=0.9995` gives an effective memory window of about 2,000 requests. Old patterns fade. New normal patterns establish themselves within the window. Flagged requests contribute at weight=0.1 (poisoning resistance). The final continuous HTTP detector, running in Python on a single core:

- F1: 1.000
- Throughput: **8,339 req/sec**
- Per-request latency: 0.12ms
- New endpoints: auto-learned within the decay window, zero false positives during transition

The two-phase DDoS detection built on top of this: DDoS concentrates traffic (homogeneous packets → high mean similarity, low variance). Detect via `variance < baseline × 0.3 AND mean_similarity > 0.7`. Then classify by recent packet analysis. 100% detection and classification across SYN flood, DNS reflection, NTP amplification, ICMP flood. Throughput: 3,191–6,258 packets/sec depending on attack type — still pure Python/NumPy, single-core, no Rust involved yet.

---

## Batch 011: Structural Encoding Matters

Batch 011 started with scoped vectors — separate accumulators per HTTP component. The PCAP F1 results were mediocre (0.063–0.739) and the investigation of why uncovered the most important technical finding of the batch.

We had been encoding network packets with naive atom bundling:

```python
# What we were doing
atoms = ["proto:tcp", "dst_port:80", "flags:PA"]
vec = sum(vm.get_vector(atom) for atom in atoms)
# F1 = 0.368
```

This is the encoding pattern the VSA literature typically describes: atomize values, bundle them together. The LLMs generating this code knew the literature well and defaulted to it consistently. The problem is that Holon isn't doing what the standard literature describes — it uses role-filler binding, where field names and values are bound together before bundling. The LLMs kept gravitating back to text-first, value-list encoding because that's what they'd been trained on. Getting them to consistently use `encode_data()` with structured dicts — data-first, not text-first — required repeated correction across many sessions. The library matured enough eventually that the pattern became idiomatic, but for a long stretch the default was wrong and the experiments reflected it.

Worth being honest about the development model that let this persist as long as it did: the code was rarely read, only observed. The workflow was to describe what I wanted, run the outputs, and judge correctness from results — not from reading the implementation. Tests were the feedback loop. When the LLM was quietly doing naive bundling across multiple batches, the F1 numbers were the signal, not a code review. The batch 011 PCAP F1 of 0.368 was what finally forced the investigation.

Holon's encoder uses role-filler binding. `{dst_port: 80}` and `{src_port: 80}` are different structures — the value "80" is bound to different role atoms. Naive bundling throws that relationship away. You get an aggregate of values with no structural context.

The fix was to use `encoder.encode_data()` on a nested dict representation of the packet:

```python
# What we should have been doing
structure = {
    "l3": {"src_net": "192.168", "dst_net": "10.0"},
    "l4": {"proto": "tcp", "dst_port": 80, "flags": "PA"},
    "payload": {"present": True, "size_class": "small"},
}
vec = encoder.encode_data(structure)
# F1 = 1.000
```

| Metric | Naive Bundling | Structural Encoding |
|--------|----------------|---------------------|
| Binary F1 | 0.368 | **1.000** |
| Normal→Baseline similarity | 0.355 | 0.867 |
| Attack→Baseline similarity | 0.161 | 0.092 |

The separation gap went from 0.19 to 0.77 — a 4× improvement in discrimination from encoding the same underlying data correctly. Role-filler binding isn't a theoretical property. It has a concrete effect on detection.

From there, batch 011 built three-dimensional detection:

1. **Transition detection** (state machine on anomaly streaks): F1 = 0.936
2. **Attack classification** (from accumulated attack signatures): F1 = 0.998
3. **Binary detection** (prior/recent/divergence): F1 = 1.000

And mitigation synthesis — closing the loop from detection to action:

```python
attack_delta = store.difference(attack_signature, normal_baseline)
# Probe: which features drive the delta?
for feature, value in candidate_features:
    importance = cosine_similarity(encode({feature: value}), attack_delta)
    if importance > threshold:
        rules.append(MitigationRule(conditions={feature: value}))
```

Generated rules for SYN flood and DNS reflection both validated at F1=1.000. The vector arithmetic extracts the discriminative features directly; the rules are a projection of what the accumulator learned. No hand-coding.

The VectorManager refactor also came out of batch 011: hash-based seeding (`SHA256(atom) XOR global_seed`) made vector generation order-independent. Two nodes processing the same atoms in different orders produce identical vectors. Distributed consensus without synchronization — validated: 100/100 exact matches across test nodes.

---

## Batch 012: Zero-Hardcode Detection

Batches 010 and 011 used explicit domain knowledge in places: port 53 means DNS reflection, SYN flag pattern means SYN flood. Batch 012 removed that.

The shift: instead of detecting *what* the anomaly is, detect *what became statistically significant*. Track per-field value distributions. Alert when a field concentration changes significantly relative to the baseline.

```python
# Zero-hardcode approach
prior_concentration = 1%   # src_port: spread across ephemeral range
recent_concentration = 96% # src_port: now 96% concentrated on 53

alert("src_port CONCENTRATED on NEW value 53 (96%, was 1%)")
# The operator knows what port 53 means. The detector doesn't.
```

This means a novel attack using port 12345 gets detected: `src_port CONCENTRATED on value 12345`. A detector with hardcoded rules for known ports misses it. Batch 012's detector doesn't.

The `difference()` primitive provides the explanation:

```python
difference = store.difference(prior_norm, recent_norm)
# This vector represents "what changed"

for field_value, vec in candidate_features:
    importance = cosine_similarity(vec, difference)
    # High similarity = "this is part of what changed"
    prior_novelty = cosine_similarity(vec, prior_norm)
    # Low similarity = "this was not in the prior"
```

High importance + low prior similarity = novel value that's now dominating traffic. That's the signal the alert emits.

Final results from the zero-hardcode demo:

| Metric | Value |
|--------|-------|
| Attack recall | **100%** |
| False positive rate | **4%** |
| Throughput | ~3,100 pkt/sec |
| Per-packet latency | ~320 µs |
| Domain knowledge required | None |

The lifecycle test — 5 consecutive attack/drain waves — showed consistent re-detection without degradation. Recovery clean within the decay window after each drain.

The performance benchmark is where Python's ceiling becomes explicit:

| Component | Time |
|-----------|------|
| `encode_data()` | 182 µs |
| `encode_scalar_log()` | 100 µs |
| `similarity()` × 2 | 22 µs |
| `accumulate()` | 2.6 µs |

`encode_data()` is 182 µs per packet. At 3,100 packets/sec single-core, with 1Gbps link traffic at 1.5M packets/sec, that's a 1:489 sampling ratio. At 10Gbps, 1:4,885. For DDoS detection this is workable — the DDoS lab samples at 1:100 with a ring buffer to handle overflow, and attack traffic dominates sampled traffic enough that detection holds. The vector ops were never going to run on every packet; that's not the architecture. The exception is Layer 7: a WAF making per-request allow/deny decisions operates at HTTP request rates, not packet rates. The Python HTTP detector already demonstrated 8,339 req/sec at 0.12ms per request — that's every request, not sampled. A Rust WAF sidecar doing structural encoding on every request is well within reach, and that's where this is heading.

What the architecture actually requires: the sidecar running on sampled packets needs to keep up with the sample rate, derive rules from what it sees, and push those rules to the XDP program fast enough that the XDP program — which does nothing but apply compiled rules at line rate, no vector ops — can drop or pass in time. The sidecar is the intelligence layer. The XDP program is the enforcement layer. Python's 3,100 pkt/sec ceiling constrains the sidecar throughput and therefore the detection latency, not packet-level drop rate.

The bottleneck had been identified precisely. The Rust port wasn't a rewrite for elegance — it was a response to a measured number. What the speedup actually looked like is covered in the next post; the Python work's job was to find the ceiling and name it.

---

## What This Period Produced

By the end of challenge batch 012:

- The accumulator primitive replaced `prototype_add()` for all streaming use cases
- Structural encoding (role-filler binding via `encode_data()`) was confirmed as mandatory, not optional
- Distributed consensus without synchronization was validated
- The `difference()` primitive had proven useful for mitigation synthesis, explainability, and drift detection across multiple independent challenge batches
- 5M records in 7.5 minutes was the Python scale ceiling at 4096D
- 3,100 pkt/sec single-core was the Python ceiling for the full zero-hardcode detection stack (structural encoding + rate encoding + similarity + accumulation)
- Zero-hardcode detection at 100% recall and 4% FP was achievable without any domain knowledge baked in

The Rust port had already started by this point — the `holon-rs` initial commit landed February 6, during the batch 012 work. Both were running in parallel. The Python experiments were feeding the design decisions for the Rust implementation in real time.

---

Next: the Rust port, the DDoS lab, and what happened when both came together.
