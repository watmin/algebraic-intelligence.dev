---
title: "Python: The First Two Weeks"
description: From the initial commit to the first real results — day one architecture, the database origin, Rete emerging on day two, and the challenge batches that stress-tested the structural encoding hypothesis.
date: 2026-02-21
---

The prologue covers why this started. This post covers what happened when it actually started running.

One thing to keep in mind as you read: this is an after-hours hobby project. Not a startup. Not a funded research lab. Evenings and weekends, on a personal machine, after a full day of work. The reason that's relevant is that the pace numbers that follow — twelve challenge batches, F1=1.000 on anomaly detection, 5 million records stress-tested, a Rust port started — all happened inside twenty days of calendar time, which is not a lot of calendar time but is an extraordinary amount of *effective* time for a solo after-hours project.

That's the LLM-assisted development story as clearly as any benchmark can tell it. The mental model, the domain knowledge, the architectural intuition — those took years to build. But the translation from mental model to running code, which used to be the bottleneck that killed projects like this, collapsed. The gap between "I know what this should do" and "it is doing it" became hours instead of months. The rate of experimentation changed. You could test a hypothesis the same night you had it.

January 16, 2026. The first commit lands: "Initial commit: Complete VSA/HDC neural memory system." Note the tense. It's already complete. A full HTTP API, FAISS ANN indexing, negation support, guards, configurable markers — all in the first session, built with Grok Code and early Claude. The gap between the years of ideation and the first working code was measured in hours.

That pace didn't slow down. It accelerated. What follows is the story of the first two weeks, told in chronological order with the actual numbers.

---

## Jan 16–17: The Database

The original goal was not anomaly detection. It was a database.

The target was something DynamoDB and Elasticsearch can't do easily: structural sub-document queries. "Which documents contain this minimal JSON struct?" Not full-text keyword search — structural similarity. You have a thousand JSON blobs. You have a partial schema. Find everything that matches that partial schema, including wildcard fields and nested structures, without writing a query planner.

The insight: encode the JSON document as a hypervector where each field binding contributes to the overall structure, such that a probe document with fewer fields still has high cosine similarity to any stored document containing those fields. The structural encoding generalizes. The database doesn't need to know the schema ahead of time.

The first commit already demonstrates this working. Within hours of that commit: an HTTP API server over FastAPI, a test client, performance optimization passes, negation support in probe documents, configurable field markers. The system that would spend the next few weeks being tested and extended was essentially complete on day one.

Worth being specific about what "complete" means here, because it wasn't built on top of an existing VSA library. There isn't one that does what Holon does. The core had to be built from scratch: the deterministic atom vector generation, the bind/bundle/cosine stack, the encoding pipeline for structured documents, the accumulator primitives. The only external dependency was NumPy. The core VSA primitives — atom vector generation, bind, bundle, cosine similarity, the document encoding pipeline — were in that first session. The algebra didn't stop there; it grew incrementally as each challenge batch hit a wall and demanded something new. But the foundation that everything else built on was there from day one. The LLM-assisted development story is real, but it's not "LLM wrote a wrapper around existing tools." It's "LLM helped implement novel machinery from a mental model that had been accumulating for years, then kept pace as the experiments kept asking for more."

**Day two (Jan 17)** is when something unexpected happened. Buried in a burst of commits — bulk insert, positional encoding for lists, FAISS index fixes, MIT license — is a Rete-like forward chaining demo.

```
2026-01-17  Add Rete-like forward chaining demo: rule-based reasoning with facts, rules, and derived facts
```

This wasn't planned. It was an experiment: can Holon's vector store underpin rule-based reasoning? Can you encode facts as hypervectors, encode rules as structural patterns, and derive new facts through similarity search rather than symbolic pattern matching?

The answer was "sort of, and the interesting parts are promising." It was committed and set aside. But the instinct — that the same vector algebra that does structural document matching might also do Rete-style inference at scale — would resurface in the DDoS lab as the XDP/eBPF decision tree. The idea was in the repo on the second day of coding.

---

## Jan 24: Batches 001 and 002, Same Day

Eight days of API stabilization — bulk insert optimization, guard refinements, `$any` wildcard, positional list encoding, GROK.md session continuity file. Then on January 24, batch 001 and batch 002 both land in the same commit window.

Both of them. Same day. Which is relevant because batch 002 requires primitives that don't exist yet in the API — or at least, didn't exist before the batch 004 Sudoku work that happens the next day. More on that in a moment.

### Batch 001: Four Problems, One Encoding

The four batch 001 challenges:

- **Task memory** — flat-ish documents with keyword fields, date strings, sets of tags, priorities
- **Recipe memory** — nested structure, ingredient lists, numeric duration fields, constraint queries
- **Bug report memory** — mixed free text and structured fields, duplicate detection
- **Spell search** — creative fuzzy lookup, guard queries, text-plus-structure encoding

Same approach across all four. Encode the document as a hypervector using role-filler binding, store it, query by encoding a probe document and finding similar vectors by cosine similarity.

*(The full encoding stack is covered in [Atoms, Vectors, and the Encoding Stack](/blog/primers/series-1-001-atoms-and-vectors/). The short version: every scalar value — a field name, a string, a number — maps to a unique high-dimensional vector called an atom. The mapping is deterministic within a language implementation: a hash of the atom string combined with a global seed produces a deterministic 4096-dimensional bipolar vector. Same atom, same language, any machine, any process: identical vector. No codebook to persist or distribute. The function is the codebook.)*

The mechanism: each field becomes a bound pair. A field name and its value are both atomized to vectors, then bound by element-wise multiplication into a product vector that's approximately orthogonal to both the key atom and value atom in isolation. The full document is the superposition (sum, normalized) of all its field bindings — "vectorized" back up from the atomized scalars into a single representation of the whole structure.

```python
from holon.kernel import bind, bundle, VectorManager

vm = VectorManager(dimensions=4096)

task = {
    "project": "work",
    "priority": "high",
    "status": "todo",
    "tags": ["urgent", "deadline"]
}

field_vectors = []
for key, value in task.items():
    if isinstance(value, list):
        # atomize each list element, bundle into a set vector, then bind to the role
        val_vec = bundle([vm.get_vector(v) for v in value])
    else:
        val_vec = vm.get_vector(str(value))   # atomize scalar value
    field_vectors.append(bind(vm.get_vector(key), val_vec))  # bind role atom to filler

doc_vector = bundle(field_vectors)  # superpose all bound pairs → one document vector
```

The `doc_vector` encodes all structural relationships simultaneously in a single 4096-dimensional vector. The orthogonality property is what makes it work: `{"priority": "high"}` and `{"severity": "high"}` both contain the atom "high", but the bound pair `bind("priority", "high")` is near-orthogonal to `bind("severity", "high")` — different roles produce different bound vectors even with the same filler. Structural similarity, not lexical similarity.

A probe document with fewer fields searches for documents that contain those field bindings — not an exact match, a geometric match. You probe with `{"priority": "high", "status": "todo"}` and find documents with those two fields regardless of what other fields they contain, because the probe vector is a subspace of the document vector.

Everything in batch 001 worked. That was the first thing to note: the same encoding strategy, unchanged, solved four completely different data domains. No domain-specific tuning. No schema definition. Bind, bundle, query.

The result that mattered wasn't the four working solutions — it was the generalization. One encoding strategy, four domains, all solved.

### Batch 002: Abstract Reasoning

Batch 002 goes somewhere different. Not "find similar documents" but "can VSA do abstract reasoning?"

**Raven's Progressive Matrices** are visual reasoning puzzles. A 3×3 grid where each cell contains a pattern, and the task is determining what fills the missing cell. The structural pattern is a transformation rule — progression, XOR, union — applied consistently across rows and columns.

This requires not just similarity search but transformation extraction. Given two consecutive cells in a row, what changed? The approach: `difference` vectors. `difference(cell_A, cell_B)` produces a vector representing "what changed." If the rule is consistent, the difference vectors across all rows should be similar to each other.

They were. Progression rules produced difference vectors with ~0.58 cosine similarity to each other. Difference vectors from other rule types clustered at ~0.19. The difference operation extracted the abstract transformation concept and made it geometrically queryable.

**Graph matching** pushed further. Given an arbitrary graph, identify its topological family — star, cycle, tree, chain, complete — from a VSA encoding alone. No graph isomorphism algorithm. No labeled structural features. Just: encode the graph as a hypervector, learn what each family looks like, classify new graphs by similarity.

The encoding: for each node, encode its local neighborhood (degree, connected node degrees) as a structured document, bundle all nodes into a graph-level vector. The `prototype` operation extracts the categorical essence:

```python
star_examples = [encode_graph(g) for g in star_graphs]
star_prototype = prototype(star_examples, threshold=0.5)
```

A prototype with threshold 0.5 keeps only dimensions that agree across at least 50% of the examples — the parts of the vector space that are consistently "star-like" rather than incidentally present in one example. The result: **100% classification accuracy across 15 test graphs from five topological families.** No supervised training in the traditional sense. A handful of examples and the prototype operation.

---

## Jan 25: Sudoku, Primitives, and an Honest Assessment

January 25. Batch 004. Sudoku.

This is where `prototype`, `difference`, `blend`, `amplify`, and `negate` appear as formal primitives — developed specifically as tools to attack the Sudoku constraint satisfaction problem. The commit history for batch 002 LEARNINGS was written *after* these primitives existed, which is why it reads as if they were always available. They weren't. The Sudoku work built them.

The Sudoku hypothesis: Sudoku is a constraint satisfaction problem. VSA encodes structure. Constraint satisfaction is structural reasoning. Therefore, VSA similarity should be able to guide or replace backtracking search.

The experiment was thorough. Three solver variants:
- Traditional backtracking: 0.0248s baseline
- Simple geometric (random vectors + similarity scoring): 0.0253s — essentially the same
- Optimized geometric (proper constraint vectors + full VSA reasoning): 0.3443s — **14x slower**

At scale (90 puzzles across four difficulty levels): 82.2% success with hybrid approach, 65.6% with pure geometric. Traditional backtracking: 100%.

The honest assessment, written directly into the docs at the time:

> **What we claimed:** Geometric constraint satisfaction using hyperspace similarity.
>
> **What we built:** Standard backtracking with VSA/HDC-based ordering heuristics.
>
> The hyperspace queries help *order guesses* during backtracking, but the actual constraint satisfaction uses traditional verification. This is valuable (faster convergence) but not the "radical" geometric solution originally envisioned.

This is the first wall. VSA is a similarity engine over high-dimensional spaces. It finds approximate matches. Sudoku requires exact constraint enforcement — every row, column, and block must contain each digit exactly once. There is no approximate version of that constraint. The geometric approach can guide the search (better than random tie-breaking, worse than constraint propagation), but it cannot replace it.

What the Sudoku work *did* produce: five algebraic primitives that turned out to be enormously useful everywhere else. `prototype` for category learning. `difference` for change extraction. `blend` for fuzzy categorical queries. `amplify` for signal boosting. `negate` for "X but NOT Y" exclusion. The primitives were forged in the wrong problem and immediately applied to better ones.

---

## Jan 26–30: API Stabilization, Batch 003, Scale

January 26 brings the unified `HolonClient` interface — a cleaner API layer over the encoding primitives. January 26 through 30 is a sustained push through batch 003, batch 006, batch 007, and the first scale experiments.

### Batch 003: Text and N-grams

Batch 003 is a single challenge: a quote finder. Ingest book text, index it, support fuzzy matching including partial phrases and word order flexibility.

This is the first time the work is primarily unstructured text rather than structured documents. The encoding: n-gram mode. A phrase encodes as the superposition of all its overlapping bigram and trigram windows.

```
"slope of the tangent" →
  superpose("slope of", "of the", "the tangent",
            "slope of the", "of the tangent")
```

The result is a vector similar to any other vector with significant n-gram overlap. Searching "slope tangent" finds "dy/dx is the slope of the tangent" because the n-gram overlap is high. Searching "slope tangent" does *not* find "derivative power rule" because they share no n-gram structure. Word order flexibility is implicit — "tangent slope" and "slope tangent" produce similar vectors because they share all the same unigrams and most bigrams.

Numbers: 2,897 text units, 188 units/second ingestion locally, 73 queries/second. Not fast. At this point we weren't optimizing — we were testing whether the n-gram approach even worked. It did.

The enhanced batch 003 solution applied the new primitives to text search and produced the clearest statement yet of what the primitives actually are. `prototype` over sample quotes learned topic signatures — 100% topic classification accuracy on unseen quotes. `negate` applied to text search: 5/5 differentiation quotes returned, 0/5 integration quotes returned. The query vector encodes the exclusion. The geometry does the filtering.

The bigger insight from batch 003 was about what n-gram encoding is doing. It's not semantic similarity — it's structural similarity at the character sequence level. "slope tangent" and "slope of the tangent" are geometrically close because they share structural subsequences. "slope tangent" and "derivative power rule" are geometrically far because they share none. This is a different kind of similarity than embedding-based systems produce: not trained meaning, not distributional statistics, but structural geometry.

### The 123x Speedup

Late January brings the first major performance result worth noting separately. Commit message: "Optimize similarity function: 123x speedup."

The similarity function computes cosine distance between a query vector and all stored vectors to find the top-k matches. The naive implementation: a Python loop over all stored vectors. The optimized implementation: a single NumPy vectorized operation over the entire store as a 2D matrix.

```python
# Before: loop
scores = [cosine_similarity(query, stored) for stored in store]

# After: matrix multiply
# store is (n_docs, n_dims), query is (n_dims,)
# dot products in one call, norms precomputed at insert time
dots = store_matrix @ query_vector
scores = dots / (store_norms * query_norm)
```

123x. The algorithmic change was obvious in retrospect. It's a reminder that the early implementations were prioritizing correctness over performance — and that the performance ceiling of Python wasn't the vector math itself, it was unnecessary Python overhead around it.

### $or as Superposition

Another late-January result: `$or` implemented as VSA superposition. A query that asks "find items matching A OR B" can be expressed as a single vector — the superposition of the A probe and the B probe — rather than two separate similarity searches with results merged.

The speedup: 23x over the naive OR (two separate searches, merge, deduplicate). The superposition approach does one search in the same time. More importantly, the superposition query captures "similar to A or B" in a geometrically coherent way — items that are partially similar to both A and B score higher than items that are highly similar to only one of them.

This is VSA doing something algebraically meaningful that would require explicit post-processing logic in a traditional system.

---

## Jan 31: Scale, Batch 008, Dimension Analysis

January 31. Time encoding, Qdrant integration, batch 008, and the first real dimension sensitivity analysis.

**Time encoding (`$time` marker)**: temporal similarity encoded geometrically. Two timestamps from the same hour of the same day of the week map to similar vectors. Same time next week: high similarity. Monday 9am vs Sunday 9pm: low similarity. Time enters the vector as a smooth geometric property, not as a string comparison.

**Dimension analysis**: the question is which dimensionality gives the best tradeoff between accuracy and memory/compute cost. 1k, 4k, 8k, 16k. Result: 16k dimensions is the right default for complex structured documents. The standard deviation of cosine similarity between two random vectors is ~1/√d — at 16k that's 0.0079, tight enough that 10,000+ near-orthogonal atoms fit comfortably before the space gets crowded.

**Batch 008**: seven challenges in the enterprise/operational domain. Event correlation, ticket routing, configuration drift detection, API request pattern analysis. Accuracy: 92–100% across all seven. TorchHD GPU backend experimented with (98.4% precision on numeric fields, 300 ops/sec — too slow for any streaming use case; the GPU overhead dominates for per-item operations).

The GPU experiment is important to be honest about: the 4090 doesn't help here. The VSA operations are per-item, not batch. GPU throughput only matters when you're processing thousands of items simultaneously. For streaming anomaly detection — where each packet or request arrives individually and needs an answer immediately — the GPU is the wrong tool. CPU vectorized NumPy at 4096 or 16384 dimensions is the right tool.

---

## Feb 1–5: Challenge 009–012, the Performance Ceiling

The first five days of February are where Python's limits became undeniable.

**Challenge 009** (Feb 2): deterministic training at scale on a 14-core, 54GB RAM machine.

| Scale | Categories | Accuracy | Throughput | Time | Memory |
|-------|-----------|---------|-----------|------|--------|
| 1M records | 100 | 94.5% | 25,581 enc/sec | 44s | 3.9GB |
| 1M records | 1,000 | 84.5% | — | — | — |
| 5M records | 1,000 | 84.4% | 23,322 enc/sec | 7.5 min | 19.5GB |

23,322 encoding operations per second across 10 parallel workers on a machine with 54GB RAM. At that rate, 1M records takes 44 seconds. The accuracy at 1000 categories — 84.4% — is on synthetic data with planted signal. Real-world data would be harder. The performance ceiling is visible.

**Challenge 010** (Feb 3): first contact with real network traffic. HTTP anomaly detection.

- F1=1.000
- 8,339 requests/second
- 0.12ms per request

This is where the database idea met the domain that would eventually become everything. The structural encoding that works for recipe search and graph topology also works for HTTP requests — because it doesn't care what the data means, only how it's structured. A request with `{"method": "POST", "path": "/api/login", "status": 200}` encodes the same way a recipe encodes. The roles and fillers are different atoms, but the binding-bundling process is identical.

The accumulator primitive is introduced here. Where `prototype()` extracts category essence by thresholding agreement (lossy), `accumulate()` builds a running sum that preserves frequency. 99% of traffic is benign — the accumulated baseline vector has a strong benign signal. An anomalous request's structural fingerprint diverges from the baseline. The divergence is measurable in a single cosine similarity computation.

**Challenge 011** (Feb 4): structural detection. The proof that role-filler binding is doing real work, not a convenience.

The experiment: encode `{"dst_port": 80}` and `{"src_port": 80}` using naive atom bundling (just concatenating all the values) versus structural binding (binding each value to its role). 

Naive bundling: both documents contain the atom "80". They look similar. F1=0.368 on attack detection — the naive approach can't distinguish "80 as a destination port" from "80 as a source port."

Structural binding: `bind("dst_port", "80")` ≠ `bind("src_port", "80")`. The binding operation makes them orthogonal. The structural distinction is encoded in the geometry. F1=1.000.

That difference — 0.368 vs 1.000 — is the clearest single demonstration of what structural encoding buys you. It's not a trick or an optimization. It's the foundational claim of the approach: structure encodes into geometry, and geometric similarity then reflects structural similarity.

**Challenge 012** (Feb 5): zero-hardcode detection.

100% attack recall. 4% false positive rate. No port numbers. No protocol names. No labeled attack patterns. No domain knowledge of any kind. The detector learns from the stream of traffic what "normal" looks like, and flags deviations.

The mechanism: character class bitmasks over byte sequences, accumulated into a frequency-preserving baseline vector. "Normal" traffic uses a consistent distribution of byte patterns. Attack traffic — SYN floods, NTP amplification, DNS reflection — uses a systematically different distribution. The geometric distance between a packet's structural fingerprint and the accumulated baseline is the anomaly score.

This is what the Prologue means by "the geometry does the work." There is no hand-tuned rule here. No expert system. No feature engineering beyond the choice of encoding scheme. The algebra, accumulating over a stream of real packets, learns what normal looks like — and flags what isn't.

---

## What Twenty Days Established

By February 6 — twenty days after the first commit, all of it after hours — the Python implementation had run through twelve challenge batches, scale-tested up to 5 million records, and produced F1=1.000 on anomaly detection without any domain knowledge.

To be precise about what "twenty days after hours" means here: this is not twenty days of full-time engineering. It's twenty days of evenings. Every challenge batch, every scale test, every primitive added to the algebra — squeezed into the hours after a full working day. The throughput is abnormal for that constraint, and the reason is the tool loop. The rate-limiting step in exploratory engineering is usually "write the thing, run it, interpret the result, think about what to try next, write the next thing." LLM-assisted development compresses every step in that loop except the thinking. The thinking still takes as long as it takes. But everything else — boilerplate, API wiring, test scaffolding, iteration — is gone. What remains is the experiment itself.

Several things were clear:

**The structural encoding generalizes further than expected.** Tasks, recipes, graphs, text, network packets — same encoding, all working. The hypothesis held across wildly different data shapes.

**The primitives are a complete algebra.** `bind`, `bundle`, `prototype`, `difference`, `blend`, `amplify`, `negate` compose to cover a surprising range of query types: exact lookup, fuzzy search, categorical classification, anomaly detection, exclusion queries, and "what changed" queries. The primitives weren't designed to cover all these cases — they emerged from experiments, and they happened to be composable.

**The performance ceiling is visible and specific.** Python tops out at ~23k encode operations/second with 10 workers, ~8k similarity queries/second for streaming. For a database, that might be acceptable. For real-time packet processing at 1M+ packets per second, it's not. The Rust port was already underway — it started the same week as challenge 012. Both tracks were running simultaneously by February 6.

**The database is still there.** The streaming anomaly detection work is exciting, but the original use case — structural sub-document querying over large document stores — is validated too. The challenge 009 scale test at 1M and 5M records with Qdrant integration is that demonstration. The database and the stream processor are the same system. The engram work we'd do a few weeks later would close the loop back on this: learned patterns from streaming data become indexed, queryable memory. The database and the detector become one.

---

Next: batches 004 and 005, where we tried to make VSA do something it fundamentally cannot do, built the primitive algebra in the attempt, and learned exactly where approximate geometric reasoning ends and exact symbolic reasoning must begin.

