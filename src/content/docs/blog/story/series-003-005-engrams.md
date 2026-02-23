---
title: "Engrams and the 765ms → 3ms Moment"
description: "February 17–20. CCIPCA online subspace learning in Python. Engram library — learned manifolds as memory traces, single-packet recognition, 100% accuracy across 4 attack types. Three-layer architecture refactors in both Python and Rust. Rust memory layer and engram parity. Then: instant rule deploy on engram hit. 765ms to 3ms."
date: 2026-02-23
sidebar:
  order: 8
---

February 17. The decay model works. The detection baseline is 765ms — the accumulator needs that long to build enough signal to commit. That's acceptable. Then a question: what if we've already seen this attack before?

The accumulator doesn't know. It starts from zero every time. The question is whether the system can remember.

By February 20, it can. Same attack, second appearance: rules deploy in 3ms. Not 765ms. Not 100ms. 3ms.

---

## The Idea

The 3D visualization from February 10 had already revealed something important: encoded traffic vectors from different attack types land in dramatically separated regions of vector space. Synthetic attack vectors and synthetic normal vectors didn't just score differently — they occupied distinct geometric regions. You could look at the projection and point.

That observation seeded a question that sat unresolved for a week: if a cluster of vectors occupies a measurable region of space, can you characterize that region, snapshot it, and ask whether future vectors fall inside or outside it?

The question went to Grok first, then Opus. The framing was something like: how do you define a "hyperbox" that bounds vectors in hyperspace? Not the right term — but the right intuition. The conversation produced the correct vocabulary: not a box, but a *manifold*. A low-dimensional surface inside the high-dimensional space that the vectors of a given traffic class tend to occupy. The "box" intuition was geometrically wrong but pointed at the right phenomenon — a bounded region that separates one class from another.

That same conversation is where "engram" came from. The original framing was "programmatic neural memory" — a description of what the system should do (store a pattern, recall it later) that borrowed neuroscience vocabulary without being precise about it. Opus pushed back: there are no neurons here. The storage isn't weights in a network; it's a geometric snapshot of a learned subspace. The neuroscience term for the physical trace a memory leaves in neural tissue is *engram*. That's the right word — not because the implementation mimics neuroscience, but because the concept maps: a durable, retrievable trace of a learned pattern. The name was adopted immediately.

This is the same dynamic that produced CCIPCA (Grok knew the algorithm; the requirement was described as "online PCA that doesn't need all the data"), that coined `holon` from the composition-and-wholeness framing, that turned "it looks like Rete" into an actual Rete implementation. The LLMs aren't writing the system — they're the vocabulary layer. The intuition arrives malformed, the conversation refines it, and the implementation follows.

<div style="text-align: center">

*This is symbiosis. We enable each other.*

</div>

The accumulator was one answer to the original question — keep a running superposition of recent vectors and compare against a learned baseline. But the accumulator has no memory across resets. Each attack is a fresh learning problem.

The engram idea is different: when an attack ends, extract the geometry of the vectors it produced — their shared low-dimensional subspace — and store that as a compressed memory trace. The next time any vector falls inside that region, the system recognizes it immediately and fires the rules associated with the first encounter, without waiting for accumulation.

---

## Batch 017: Online Subspace Learning (CCIPCA)

February 17 is where the implementation starts, in Python, as batch 017.

The core primitive is an `OnlineSubspace` — a streaming principal subspace estimator built on CCIPCA (Candid Covariance-free Incremental PCA, Weng et al. 2003). Where a standard PCA requires all data up front, CCIPCA updates its component estimates one vector at a time in O(k × d) per update — k components, d dimensions. No batch, no memory of past vectors.

The first experiment revealed something structural: holon-encoded records with 8 fields and limited vocabularies per field don't spread uniformly across 4096 dimensions. They occupy a 25-dimensional manifold inside that space.

| k (components) | Final Residual CV | Top-5 Eigenvalue Share | Stabilized At |
|-----------------|-------------------|------------------------|---------------|
| 16 | 2.5% | 56.2% | 50 vectors |
| 32 | 1.1% | 45.4% | 50 vectors |
| 64 | 1.1% | 44.1% | 50 vectors |
| 128 | 1.2% | 42.3% | 50 vectors |

90% of the variance falls in the first 25 components. Going from k=32 to k=128 reduces residual by 1.6%. For this workload — 8 fields, limited per-field vocabularies, structured packet data — k=32 is the right choice. *That number is application-dependent: a dataset with higher field cardinality or more complex structure will have a higher intrinsic dimensionality and will need a larger k to capture it. The right approach is to look at the eigenvalue spectrum and find the knee.*

The eigenvalue spectrum has a clear two-tier shape: 4 dominant components (roughly 10% each) corresponding to high-cardinality fields like src_ip, dst_port, src_port, and packet length, then a second tier of medium-cardinality fields (proto, TTL, method, dst_ip), then a sharp drop. The encoding structure is legible in the eigenvalues.

### Anomaly Detection via Reconstruction Residual

The detection mechanism: train the subspace on normal traffic, then score each incoming vector against the learned manifold. The score is the reconstruction residual — how far the vector falls from the plane the normal traffic occupies:

```python
reconstruction = mean + sum(np.dot(x, c) * c for c in components)
residual = np.linalg.norm(x - reconstruction)
```

Normal vectors reconstruct well. Attack vectors with unusual field combinations don't. The residual cleanly separates distributions:

| Traffic Type | Mean Residual | Detection Rate |
|--------------|---------------|----------------|
| Normal (holdout) | 35.9 | FP = 0% |
| DNS amplification | 57.7 | TP = 100% |
| Credential stuffing | 46.2 | TP = 100% |
| Exfiltration | 45.3 | TP = 100% |

Zero false positives, 100% true positive rate across all attack types, including exfiltration — which shares src_ip and protocol with normal traffic. The adaptive threshold — EMA of the residual plus 3.5 standard deviations (EMA + 3.5σ) — cleanly separates even modest separation ratios because the residual distributions are tight (CV < 2%).

The hardest case was non-radial anomalies: vectors close to the centroid but off the manifold. Chimera attacks (API field values combined with Web field values in unnatural combinations) had lower cosine distance to the centroid than SSH brute force (0.62 vs 0.72), but the subspace caught both at 100% TP. In this experiment, cosine-to-centroid also detected both — the chimeras used sufficiently different field values to stand out either way. The subspace advantage would be more dramatic against adversarially crafted traffic that deliberately mimics the centroid. The principle is demonstrated; the natural "centroid miss" case hasn't been found yet.

### One Critical Implementation Bug — Found Before Integration

The initial implementation scored residuals *during* the CCIPCA update — after components had been updated with the current vector. The vector partially explains itself, producing artificially low training residuals.

The problem: threshold EMA tracked ~29.5 during training, but `residual()` at test time returned ~35.9 for in-distribution data. Result: 100% false positive rate on holdout.

Fix: compute residual with pre-update components, *then* run the CCIPCA update. Score first, update second. Training residuals matched test-time residuals. False positive rate dropped from 100% to 0%.

This class of bug — mixing scoring and updating — doesn't affect the accumulator pipeline because bundling and scoring are separate steps. It only appears in online learning primitives where the same data updates and is scored by the same model. **Worth knowing before deploying any subspace-based detector.**

### Surprise Fingerprint: Field Attribution from the Algebra

When the residual fires, you want to know which fields made the vector anomalous. The standard approach would be to diff the incoming packet against a baseline. The subspace approach extracts the answer from the algebra itself.

The anomalous component is:

```python
anomaly = sub.anomalous_component(vec)  # x - reconstruct(x)
```

This is a valid hypervector — a superposition of the role-filler bindings for whatever fields drove the out-of-subspace direction. Unbinding by a field's role vector extracts how much that field contributed:

```python
for field in ["src_ip", "dst_port", "proto", "ttl"]:
    role = client.get_vector(field)
    unbound = client.unbind(anomaly, role)
    surprise = unbound.norm()  # higher = more surprising
```

Higher norm means more of the anomalous component was bound to that field. The ranking tells you which fields to put in the derived rule — without looking at the packet at all. Concretely, given a packet that triggered the detector:

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
    "bytes":     0.79,   # anomalous — 1420 bytes atypical (near MTU)
    "proto":     0.41,   # mildly anomalous — UDP less common than TCP in baseline
    "src_ip":    0.12,   # unremarkable — IPs vary normally
    "dst_ip":    0.09,   # unremarkable
    "tcp_flags": 0.06,   # unremarkable — zero flags expected for UDP
}
```

`dst_port`, `ttl`, and `bytes` stood out. `src_ip`, `dst_ip`, and `tcp_flags` look normal — the subspace has seen plenty of that variation. A rule generator reading this writes `(and (= dst_port 53) (= ttl 245))` and ignores the rest.

In practice you do have the packet, so you read the specific values directly rather than searching the codebook for the closest match. But the ranking is structurally derived from the algebra alone. The `field=value` predicates in the rule come from the geometry of what the anomalous vector is pointing at.

Experiment 007 validated this: surprise fingerprint classification at 100% accuracy across 4 attack types (SYN flood, DNS amplification, credential stuffing, exfiltration). Fingerprint vectors separate cleanly in the projected space — each attack type has a consistent field attribution signature.

The same caveat as prior batch experiments applies: this is synthetic data with clean class separation. 100% on a well-separated synthetic benchmark doesn't guarantee 100% on production traffic. The numbers prove the mechanism works as designed — subspace residual detects, surprise fingerprint attributes, the algebra holds. What they don't prove is how well it generalizes to adversarial or ambiguous real-world distributions.

---

## The Engram Primitive

February 17 also brings the engram library itself — the second commit of the day.

An engram is a snapshot of a learned `OnlineSubspace` paired with metadata: the attack name, when it was minted, and whatever the caller wants to store alongside it. In the DDoS context, the metadata includes the EDN rule strings for the mitigation that worked.

```python
# First encounter: learn the attack, mint an engram
library = client.create_engram_library()
attack_sub = client.create_subspace(k=32)

for vec in attack_stream:
    attack_sub.update(vec)

library.add("syn-flood-t459", attack_sub, metadata={"rules": [rule_edn]})

# Second encounter: match and recall
result = library.match(probe_vector)
if result:
    name, stored_metadata = result
    # deploy stored_metadata["rules"] immediately
```

Matching uses a two-tier filter. First, a fast eigenvalue spectrum comparison (O(k × n) across all library entries) ranks candidates by energy similarity. The eigenvalue spectrum of an attack's subspace is stable — it reflects the field distribution of the attack traffic, which doesn't change between encounters. Then the top candidates get full residual scoring (O(k × d)) against their stored subspace.

The two-tier design keeps matching fast as the library grows. Eigenvalue pre-filtering eliminates most false candidates before the expensive full residual.

Experiments 014–018 validated the full lifecycle:

- **014**: Attack manifold capture — subspace converges on attack-specific geometry within 20–30 vectors.
- **015**: Library matching — correct engram retrieved, 100% accuracy, zero false matches.
- **016**: Eager activation — fires on the first anomalous tick of a new attack, before a sustained anomaly streak.
- **017**: Variant resilience — port variation (SYN flood: port 80 vs port 443) doesn't break matching; the dominant field patterns (TTL, src_ip range, packet length) are stable.
- **018**: Full lifecycle — detect, learn, mint, re-detect in a single pipeline. 603 tests green.

A note in the commit captures a tangent that's been sitting in the back of the queue since the engram lifecycle clicked: the same pattern — observe, learn manifold, mint engram, recall on match — works for any agent with observable state vectors. It doesn't have to be network traffic.

The specific sketch: a Raspberry Pi running holon-rs in a tight control loop, connected to a drone simulator where telemetry (flight state, motor outputs, orientation) and video feed can be "sniffed" as structured data. Encode each simulator tick as a Holon vector. Let the engram library learn what "hovering at position X" looks like geometrically. Then pilot around a virtual environment until the library has a manifold for every meaningful flight state — and run the same recognition loop as the DDoS sidecar, but instead of deploying firewall rules, it deploys control inputs.

The hypothesis: once the manifolds are trained in simulation, you transfer the engram library to the physical Pi, strap it to a real drone, and the behavioral patterns transfer with it. No retraining. The geometry learned in sim is the geometry — if the encoding is consistent, the manifold should match.

This is wildly speculative. The encoding for flight state is a completely unsolved problem, the sim-to-real transfer is a known hard problem in robotics, and "control loop via engram recall" is not how anyone builds autopilots. But the algebra doesn't care what the vectors represent, and the commit note wasn't deleted — which usually means something.

---

## February 18: Python Three-Layer Refactor

The engram work makes an architectural problem visible that had been fine to ignore until now.

The Python codebase had grown as a flat library. `HolonClient` was a single class exposing everything. The accumulator primitives, encoding operations, memory layer primitives, and high-level conveniences all lived at the same level. It was fine when the surface area was small. By February 18, five weeks in, after additions including subspaces and engrams, the flatness was becoming a liability.

The refactor: three layers, matching the structure the Rust port would also adopt two days later.

```
kernel/     — encode, bind, bundle, similarity, accumulate
memory/     — subspace, engram, library
highlevel/  — HolonClient, convenience wrappers, domain encoders
```

The separation was obvious in retrospect. Kernel operations are stateless mathematical primitives. Memory layer operations maintain state (the subspace components, the engram library). High-level wrappers compose them for specific use cases. The engram made it concrete: here was a primitive that clearly belonged in a memory layer, not alongside `encode()`.

Module aliases were promoted to permanent API at the same time — the old shim imports (`from holon import encode`) were already the canonical interface, and the refactor made that official. The showcases were rewritten for depth, replacing shallow demos with examples that use the full capability.

---

## February 19: Rust Memory Layer and Engram Parity

The Rust port gets the memory layer the same week.

`holon-rs` had the kernel layer from day one — encoding, binding, bundling, similarity, all SIMD-accelerated. What it didn't have was the memory layer: subspaces and engrams. The February 19 commit adds both, bringing the Rust implementation to full Python parity.

```rust
// Same structure, same algorithm — different backend
let mut subspace = OnlineSubspace::new(4096, 32);
for vec in normal_stream {
    subspace.update(&vec);
}

let residual = subspace.residual(&probe_vec);
if residual > subspace.threshold() {
    let anomaly = subspace.anomalous_component(&probe_vec);
    // field attribution via bind/unbind...
}
```

The `ndarray` crate provides vectorized operations for CCIPCA and the accumulator — the same role NumPy plays in Python, with the same SIMD-accelerated kernel underneath.

The crate is also prepared for crates.io publishing this day — README reorganized, examples polished, PARITY.md updated to "full parity on memory layer and temporal encoding."

The sidecar itself also gets a mechanical refactor: `main.rs` had grown to 3,812 lines by this point — a consequence of adding features iteratively without extraction. February 19 extracts it into 7 focused modules:

- `detectors.rs` — SubspaceDetector, PayloadSubspaceDetector lifecycle
- `field_tracker.rs` — per-packet scoring, max residual tracking
- `payload_tracker.rs` — payload windowing, per-window scoring
- `detection.rs` — Detection struct, rule compilation helpers
- `rules_parser.rs` — EDN rule file parsing
- `rule_manager.rs` — rule lifecycle, tree recompilation
- `main.rs` — orchestration loop, reduced to 1,140 lines

Pure mechanical extraction, no logic changes. The refactor was the prerequisite for the engram integration — the scoring and lifecycle logic needed to live in addressable modules before it could be threaded into the engram paths.

---

## February 20: Instant Rule Deploy on Engram Hit

The sidecar gets the engram integration the next day.

The integration connects the field-level `SubspaceDetector` and the payload-level `PayloadSubspaceDetector` to engram lifecycle management in the orchestration loop. When an attack ends after a sustained anomaly streak:

1. The active `OnlineSubspace` is snapshotted
2. All non-preloaded active rules are serialized as EDN strings
3. The engram is minted with those rules as metadata and added to the library

When the same attack returns:

1. The subspace residual exceeds the baseline threshold on the first anomalous tick
2. `check_library()` runs — eigenvalue pre-filter, then full residual on top candidates
3. Hit: stored EDN rules are parsed back into `RuleSpec` objects via `parse_edn_rule()`
4. Rules deploy through `upsert_rules()` — same code path as drift-derived rules
5. The XDP tree is recompiled and atomically flipped via `recompile_tree_and_broadcast()`

The whole sequence — from subspace hit to XDP filter active — completes under 3ms.

One implementation bug caught during integration: IP addresses weren't round-tripping through EDN correctly. The `sexpr_value()` serializer was emitting bare IPs (`10.0.0.100`) which `edn_rs` would reject on parse because a bare dotted-quad looks like a malformed number. Fix: quote the IP (`"10.0.0.100"`). One character change, but without it the stored rules would fail to parse back and the engram hit would silently deploy nothing.

The other fix was more subtle: the subspace had been trained and scored using normalized accumulator vectors (L2 norm = 1.0). But the engram matching needed per-packet raw encoded vectors (L2 norm ≈ 56, elements in `{-1, 0, 1}`). The centering step `x - mean` is scale-sensitive — you can't mix domains. The fix: track the per-tick maximum residual from raw per-packet scoring in `field_tracker.rs`, and score against the engram using the same raw vectors that trained it.

Payload engrams work the same way, with a per-window structure: each 64-byte payload window has its own subspace, all windows are scored independently, and their vectors are bundled for library matching. Only rules containing `RawByteMatch` predicates are captured in payload engrams.

### The 765ms Gap

The measured timeline from the demo run:

```
08:14:43.320  ENGRAM HIT 'attack_t459' (residual=58.70) — deploying 1 stored rule
08:14:43.320  Tree compiled: 5 nodes, 4 edges, 1 rate bucket
08:14:43.322  Tree recompiled (engram hit) — rule LIVE in XDP
                                                              ← 765ms gap ↓
08:14:44.084  ANOMALY DETECTED: drift=0.848 — drift detector fires
08:14:44.084  RULE deployed via drift path
```

The engram fires 765ms before the drift-based detector even notices the attack. During that gap, the XDP filter is already rate-limiting. The drift detector fires afterward and deploys the same rule again — redundant, harmless, and slower.

Full lifecycle across three attacks on the same pattern:

```
Tick  361: Subspace anomaly — learning attack manifold
Tick  361: EARLY-RULE deployed (drift_rate-based)
Tick  459: ENGRAM MINTED 'attack_t459' (98 ticks, 1 stored rule)
              ↓ recovery ↓
Tick  498: ENGRAM HIT — rule already active, timestamp refreshed
              ↓ second attack ↓
Tick  556: ENGRAM HIT — rule deployed from engram, tree recompiled
Tick  561: Drift detector fires (765ms later)
              ↓ third attack ↓
Tick  731: ENGRAM HIT — instant deploy on third attack onset
```

After mint, every recurrence of the same attack pattern deploys in under 3ms. The drift-based path still runs, still validates, still produces the same rules — but it's now the slow path, not the only path.

---

## The Three-Layer Refactor (Rust)

The Rust port gets its three-layer module structure the same day, Feb 20 — same session as the engram integration, and not a coincidence.

The flat `src/lib.rs` architecture had served from day one (Feb 6) through Feb 19. A single `Holon` struct exposed everything. That was fine when the library was a Rust port of a set of kernel operations. It stopped being fine once the memory layer arrived — subspaces and engrams are stateful, live longer than individual operations, and belong in a distinct conceptual layer.

The refactor mirrors Python exactly:

```
src/
  kernel/   — encode, bind, bundle, similarity, accumulate (SIMD-accelerated)
  memory/   — OnlineSubspace, Engram, EngramLibrary (CCIPCA, two-tier matching)
  highlevel/ — Holon facade, convenience API
```

`get_vector()` is also exposed on `Encoder` the same day — a specific fix required for the sidecar. The sidecar needs to retrieve field role vectors directly from the encoder to compute surprise fingerprints. The Holon facade had previously hidden this; the kernel-layer import style requires it to be public.

The sidecar is also updated to import from kernel and memory layers directly — `use holon_rs::memory::OnlineSubspace` rather than going through the facade. The layered imports let the sidecar pull exactly the primitives it needs at the appropriate layer, without the overhead of the full facade.

---

## What This Means

The accumulator-based drift detector was always going to be the general case. Novel attacks — patterns the system has never seen — still require accumulation time to build signal. That baseline is 765ms. For production use, 765ms is usually acceptable. You can tolerate the first second of a new attack in exchange for the certainty that comes from an accumulator with enough signal.

But a real production network gets attacked repeatedly. SYN floods, DNS amplification, volumetric UDP floods — the same attack toolkits get reused. An attacker scripts a retry loop. A botnet cycles through its playbook. The first encounter costs 765ms. Every subsequent encounter, the engram fires in the first packet.

The engram system doesn't replace the drift detector. It extends it. The drift detector learns; the engram library remembers. First encounter: 765ms. Second encounter: 3ms. Third, fourth, hundredth: still 3ms.

This is what an immune system actually looks like in network defense. "We need to build an immune system for the network" — a framing worth fighting for, and one that rarely gets traction. The usual implementation is a threat intelligence feed with IP blocklists: static memory, manually curated, decaying into irrelevance. At Shield, a minimal version of this idea made it into production. Nothing like what Holon is doing here.

The Holon approach is structurally different. The system learns what an attack looks like in vector space without being told what to look for. It mints the engram autonomously when the attack ends. It matches on the next encounter without a lookup table, without a ruleset comparison, without a human in the loop — a geometric recognition against a stored manifold. The immune system analogy holds not just in behavior but in mechanism: adaptive, specific, persistent, triggered by recognition rather than prescription.

### Likely Contributions to the Field

The same caveat as prior posts: honest assessment, not a priority claim.

**Manifold-based attack memory with instant geometric recall.** The engram system stores an attack's learned subspace — not a signature, not a hash, not a rule — and matches future traffic against it geometrically. This is structurally different from threat intelligence feeds (IP blocklists), signature databases (Snort/Suricata rules), or ML model retraining. The matching is algebraic: a residual score against a stored manifold, with a two-tier filter that scales to large libraries. We're not aware of a production network defense system that uses online subspace learning for attack pattern memory with instant rule deployment on geometric match.

**Autonomous detect-learn-mint-recall lifecycle with zero human input.** The full cycle — subspace anomaly detection, manifold learning during the attack, engram minting at attack end, rule storage, geometric matching on recurrence, instant rule deployment — runs without human involvement. No analyst writes the engram. No operator curates the library. The system watches, learns, remembers, and acts. The immune system analogy is not aspirational — it's mechanical.

The persistence story is already there too. The engram library can be saved to and loaded from JSON:

```rust
library.save("engrams.json")?;
let library = EngramLibrary::load("engrams.json")?;
```

Restart the sidecar, load the library, and previously learned attack patterns are immediately available. The system comes up knowing what it's seen before.

---

## What's Still Ahead

The five-week arc ends here chronologically. By February 20, the site itself is live.

What comes next, in rough priority order:

**First: glue the labs together.** The veth lab, the attack generator, the baseline lab, and the sidecar are all working independently. None of them are talking to each other yet at the hardware level. The goal is to get the attack and mitigation programs off virtual ethernet pairs and onto actual hardware — two machines on a LAN, with a third (the gaming rig) running Ollama for the LLM agents — and have the agents doing organic browser activity while the sidecar watches and mitigates. End-to-end, on real kit.

**Second: L7.** Two distinct problems, both unsolved, both interesting.

The first is HTTP DDoS — request floods at the application layer. Same structural problem as the packet-level work: detect the homogeneity, derive a mitigation, deploy it fast. The baseline lab traffic (WordPress, LLM-driven browser agents, 23 source IPs, realistic HTTP corpus) was built for exactly this. Near-real-time suppression of request floods without touching the packet layer.

The second is WAF territory — low-and-slow exploits, injection attempts, the kind of traffic ZAP, Nuclei, and Nikto generate. Script-kiddie tooling is noisy and repetitive; sophisticated attacks are sparse and deliberate. The question is whether Holon can catch either class in web traffic the same way it catches them in packet traffic: no regex, no libinjection, no signature database. Just structural encoding of HTTP requests and the same algebraic recognition that works at the packet level. Can the vector space separate a SQL injection attempt from a legitimate query the way it separates a SYN flood from normal TCP? That's the experiment.

**Third: other language ports.** Clojure, Ruby, Go, Java are on the list. Python is the Rosetta Stone — each port validates against it. They'll happen when they happen.

---

Writing this site was its own kind of work. I never expected to blog about anything — this project created the need. Five weeks of building something that actually worked, that I couldn't explain to anyone who wasn't in the room, that needed to exist somewhere outside my head. I bought a domain. Set up Cloudflare. Spent more on tokens than I'd like to admit. Went all in on Cursor.

Getting Holon to work was catharsis. Writing about it was catharsis again. Both things needed to happen.

Now back to the fun part.
