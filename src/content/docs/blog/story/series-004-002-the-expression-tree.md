---
title: "No Rules, No Signatures: The Expression Tree"
description: "Feb 27–28: A composable rule language defined as data, a Rete-spirit expression tree that evaluates 1M rules in under 3µs, VSA surprise probing for field attribution, and 7/7 attack waves mitigated."
sidebar:
  order: 10
---

The http-lab was detecting attacks and generating rules. But the rules were flat — `RuleSpec` structs with string fields and predicate values. The tree compiler knew about 13 hard-coded `FieldDim` variants: `SrcIp`, `Method`, `PathPrefix`, `Host`, `UserAgent`, `ContentType`, and seven TLS-layer fields (cipher hash, extension order, cipher set, extension set, group set, group hash). Adding a new detection dimension meant touching the enum, the tree compiler, and the evaluator.

Worse, the rules couldn't express composition. "The first value of the user-agent header" required special-casing in the detection code. "The length of the third path segment" wasn't expressible at all. The scraper detection from the previous post caught `Scrapy/2.11.0` by user-agent concentration — but the random 5-character product IDs in the path? No way to say `(count (nth path-parts 2)) = 5` in the existing rule format.

February 27 started with a clean sheet for the rule language.

---

## Rules Are Data

The design principle: rules should be expressed as data, not code. Not a custom DSL with its own grammar. Not opaque structs with encoded predicate types. Data that can be serialized, deserialized, inspected, printed to a dashboard tooltip, stored in an engram, recovered from disk, and round-tripped without loss.

EDN (Extensible Data Notation) is the format. Same as veth-lab's rule format. Clojure-style s-expressions over a standard, parseable notation.

A rule looks like this:

```clojure
{:name      ["http-lab" "scraper-005"]
 :comment   "Scrapy hitting 5-char product IDs"
 :constraints [(= (first (header "user-agent")) "Scrapy/2.11.0 (+https://scrapy.org)")
               (= (nth path-parts 1) "products")
               (= (count (nth path-parts 2)) 5)]
 :actions   [(rate-limit 80)]}
```

Each constraint is an operator applied to a dimension accessor, compared against a value. The dimensions are composable — `(first (header "user-agent"))` is `First(Header("user-agent"))` in the Rust type system. `(count (nth path-parts 2))` is `Count(Nth(Simple(PathParts), 2))`. The accessor chain resolves against live protocol data at evaluation time.

The rule is data. It round-trips through `parse_edn()` and `to_edn()` without loss. An engram stores rules as EDN strings. When the engram is deployed, those strings are parsed back into `RuleExpr` structs and compiled into the tree fresh — no special "engram rule" type, no deserialization adapter.

---

## Three Orthogonal Concepts

The rule language separates three concerns that traditional WAF configs entangle:

**Domain accessors** — protocol-specific fields. These know about TLS and HTTP:

```
method, path, path-parts, host, user-agent, src-ip,
query-raw, header-count, has-cookie, content-type,
tls-ciphers, tls-ext-types, tls-groups, tls-sni, ...
```

26 dimensions total (11 HTTP + 15 TLS). Adding a new protocol field means adding a domain accessor. The rest of the system doesn't change.

**Generic functions** — structural navigation that doesn't know anything about protocols:

```
first, last, nth, get, count, keys, vals, set, lower
```

These compose freely. `(first (header "user-agent"))` extracts the first value of the user-agent header list. `(count (nth path-parts 2))` counts the length of the third path segment. `(set path-parts)` converts the path segment list to an unordered set. `(lower (first (header "user-agent")))` lowercases. `(count (keys query-params))` counts distinct query parameter names.

The HTTP duplicate header problem surfaces here. Almost nobody thinks about headers being multi-valued — most HTTP frameworks expose `request.headers["user-agent"]` as a single string. But `Host` can appear twice. `Content-Length` can appear twice. `(header "user-agent")` returns a *list* of all values for that header name, in wire order. `(first ...)` extracts the first. `(count ...)` counts how many there are. This is how you express "did the client send duplicate Host headers?" — `(gt (count (header "host")) 1)`. A request smuggling probe that sends two `Transfer-Encoding` headers becomes detectable without a signature.

**Operators** — comparisons and membership tests:

```
=, exists, prefix, suffix, contains, regex,
gt, lt, gte, lte, subset, superset
```

13 operators. `=` for exact match. `prefix`/`suffix`/`contains` for string patterns. `subset`/`superset` for set containment (does the request's cipher suite set include all of these ciphers?). `regex` for when nothing else fits — it's there, but it's the slowest operator and the detection system never generates regex rules autonomously.

The key insight: you don't need magic named shortcuts like `host-prefix` or `user-agent-exact`. You compose `prefix` with `(first (header "host"))`. The language has no special cases — everything is composition of three orthogonal concepts.

---

## The Type System

`Dimension` in Rust is a recursive enum:

```rust
pub enum Dimension {
    Simple(SimpleDim),           // protocol fields: path, method, tls-ciphers, ...
    Header(String),              // (header "user-agent") — all values for that name
    Cookie(String),
    Query(String),
    First(Box<Dimension>),       // (first ...) — first element of list
    Last(Box<Dimension>),
    Nth(Box<Dimension>, i32),    // (nth ... 2) — element at index
    Get(Box<Dimension>, String), // (get ... "key") — value for key in map
    Count(Box<Dimension>),       // (count ...) — length/size
    Keys(Box<Dimension>),
    Vals(Box<Dimension>),
    SetOf(Box<Dimension>),       // (set ...) — convert to unordered set
    Lower(Box<Dimension>),       // (lower ...) — lowercase
}
```

Every `Dimension` knows its protocol layer via `is_tls()` and `is_http()`. This propagates through composition: `Count(Nth(Simple(PathParts), 2))` is HTTP because `PathParts` is HTTP. `First(Simple(TlsCiphers))` is TLS because `TlsCiphers` is TLS. The `Specificity` evaluator from the previous post uses this to score cross-layer rules (constraints spanning both TLS and HTTP) above single-layer rules. A dimension's `layer_rank()` returns 0 for TLS, 1 for HTTP, 2 for unknown — even deeply nested accessor chains carry their layer identity.

Dimension extraction (`extract_from_request()`, `extract_from_tls()`) resolves the accessor chain against live protocol data. `First(Header("user-agent"))` walks: find all header pairs named `user-agent` → collect values into a `Value::List` → extract first element → return `Value::Str`. This happens at evaluation time, not compilation time. The tree doesn't store extracted values — it stores the accessor chain and resolves it per-request.

`Value` carries the runtime data:

```rust
pub enum Value {
    Str(String),
    Num(i64),
    Bool(bool),
    List(Vec<Value>),
    Set(BTreeSet<String>),
    Pair(Box<Value>, Box<Value>),
    Nil,
}
```

`Value::Set` uses a `BTreeSet<String>` — sorted, deduplicated, deterministically comparable. EDN serialization renders it as `#{"TLS_AES_128" "TLS_AES_256"}` with proper set notation. The ordered vs. set TLS detection from the previous post is implemented at this level: `TlsCiphers` returns a `Value::List` (wire-ordered), `TlsCipherSet` returns a `Value::Set` (sorted, order-independent).

---

## The Expression Tree Compiler

`ExprCompiledTree` replaces the old `CompiledTree` with a dimension-agnostic compiler. The tree doesn't know what a `Dimension` means — it only knows how to group rules by their constraint on a given dimension and recursively build subtrees.

Compilation:

```rust
pub fn compile_expr(rules: &[RuleExpr]) -> ExprCompiledTree {
    let dim_order = compute_dim_order(rules);
    let refs: Vec<&RuleExpr> = rules.iter().collect();
    let shadow = compile_recursive(&refs, 0, &dim_order);
    // ...flatten shadow tree into flat Vec<ExprTreeNode>...
    ExprCompiledTree { nodes, root, dim_order, rule_fingerprint, rule_labels }
}
```

`compute_dim_order` counts how many rules constrain each dimension and sorts by participation count, descending. The most commonly constrained dimension becomes the root level. This maximizes tree pruning: a dimension that participates in 80% of rules at the root eliminates more branches early than one that participates in 20%. The ordering is computed once at compile time — it doesn't change per-request.

`compile_recursive` partitions rules by their constraint value on the current dimension and recurses:

```rust
fn compile_recursive<'a>(
    rules: &[&'a RuleExpr],
    dim_idx: usize,
    dim_order: &[Dimension],
) -> Rc<ShadowNode> {
    // ...
    let mut grouped: HashMap<String, Vec<&'a RuleExpr>> = HashMap::new();
    let mut wildcard_rules: Vec<&'a RuleExpr> = Vec::new();

    for rule in rules {
        match rule_constraint_key_cow(rule, dim) {
            Some(key) => grouped.entry(key.into_owned()).or_default().push(rule),
            None      => wildcard_rules.push(rule),
        }
    }
    // recurse into each group + into wildcard
}
```

Rules with no constraint on the current dimension become wildcards. They recurse into every branch — a rule with no `method` constraint matches regardless of method, appearing in the `method=GET` subtree, the `method=POST` subtree, and the wildcard subtree simultaneously. This is the Rete beta network: shared structure where rules agree, branching where they diverge.

The critical optimization: `&[&'a RuleExpr]` — borrows throughout. The compiler never deep-copies a `RuleExpr`. At 1M rules, cloning each rule at each recursion level would be O(n × depth) allocation. Borrowing makes it O(n) total — each rule is touched once per dimension level via a pointer indirection.

Four additional optimizations brought 2-dim 1M-rule compilation from 8.3 seconds down to 3.2 seconds:

- **`canonical_key_cow()`** returns `Cow<'_, str>` — zero-alloc for `Value::Str` (the common case), allocates only for complex types like sets
- **`compute_dim_order`** counts rules per dimension instead of collecting all unique values per dimension — eliminates building a million-entry `HashMap` just to count its size
- **FNV hash fingerprint** over sorted rule identity hashes — O(n) tree identity check for ArcSwap deduplication instead of O(n log n) string concatenation
- **Lazy rule labels** — `constraints_sexpr()` computed on demand for dashboard display, not during compilation of a million rules that may never be displayed

---

## Evaluation: O(Depth), Not O(Rules)

Evaluation is a descent through the compiled tree. At each level, the request's field value for that dimension is extracted (via the accessor chain), canonicalized, and used as a `HashMap` key. A hit routes to the specific child. A miss routes to the wildcard child. The DFS collects all terminal matches, the `Specificity` evaluator picks the best.

At 2 dimensions, 1M rules:
- Hit p50: **1,109ns** — miss p50: **50ns**

At 6 dimensions (TLS fingerprint + method + path + user-agent + content-type + SNI), 1M rules:
- Hit p50: **2,573ns** — miss p50: **50ns**

The miss path is 50ns regardless of tree size. A non-matching request does one hash miss at the root and returns immediately. No rules are consulted. No rules are iterated. The tree's structure ensures this: if the request's root-dimension value doesn't match any branch, execution terminates. The remaining 999,999 rules might as well not exist.

The hit path scales with depth, not with rule count. At 6 dimensions, each level is one `HashMap` lookup plus one dimension extraction (the `(first (header "user-agent"))` accessor involves a linear scan through the headers list to find the named header — typically 5–15 headers, so 5–15 string comparisons). Six levels = six lookups + six extractions. Adding another 900K rules doesn't add lookups — they share the same tree structure.

Full scale table for 4-dimension rules (src-ip + method + path + user-agent):

```
rules      compile    hit p50    miss p50
  100        0ms       724ns       63ns
  1,000      8ms       997ns       76ns
 10,000     35ms      1323ns       65ns
100,000    335ms      1411ns       70ns
500,000   2330ms      1689ns       72ns
1,000,000 4263ms      1875ns       50ns
```

Hit latency increases by 2.6x across a 10,000x increase in rule count. The miss path is flat: 63ns at 100 rules, 50ns at 1M rules. There's no rule count in the miss path's cost model at all.

### What This Means for Rule Engine Design

Traditional WAF engines evaluate rules sequentially — O(n) per request. Snort, ModSecurity, most commercial products: each rule is tested against each request, left to right, until a match or the list exhausts. The optimization is rule ordering (move your most common patterns early) and early termination on first match. Adding rules degrades throughput linearly.

The expression tree eliminates this entirely. There's no "evaluate rule" step. The request's field values are hashed and used to navigate to the matching terminal node. No rule is ever checked — the structure of the tree *is* the check. Irrelevant branches are never reached. This is what makes the tree self-optimizing: the dimension ordering puts the highest-participation dimensions at the root, maximizing early pruning, and the `HashMap` branching at each level means evaluation cost is determined by how many dimensions the matching rule constrains, not how many rules exist.

At 100K rules with a realistic mixed-complexity distribution (10% single-dimension through 5% six-dimension), every tier evaluates under 2.4µs on a single core. 100% correctness verified across all tiers with unique per-rule rate limits. On 16 cores with read-only ArcSwap access to the compiled tree, that's approximately 6M+ rule evaluations per second for mixed workloads.

No production router or firewall I know of can host a million rules while maintaining sub-microsecond evaluation. We set 1M as a parameter and benchmarked it. The scaling doc shows we could set it to 10M — the architecture doesn't care, each rule is one edge in a sparse DAG. The compile time scales linearly (3.2s for 1M 2-dim, 5.9s for 1M 6-dim), but in practice the detection system produces tens of rules per attack wave, making compilation sub-millisecond. The ArcSwap atomic flip means the proxy never blocks during recompilation.

---

## VSA Surprise Probing

The rule language tells the tree *what* to match. The detection system needs to discover *what to match* — which fields, which values, which structural patterns.

FieldTracker concentration was the first mechanism: track per-field-value frequencies with exponential decay, flag values that dominate during an attack. This works for attacks with consistent content — all requests hitting `/api/search`, all using `libwww-perl/6.72`. It fails for attacks with high-cardinality content: a scraper generating random product IDs. Every path is unique. No value dominates. Concentration detection sees nothing.

VSA surprise probing is the second mechanism, and it solves this problem using the same algebraic decomposition that the Holon library was built on.

When the SubspaceDetector flags an anomaly, the anomalous vector component is extracted:

```python
anomaly = baseline.anomalous_component(vec)
# The component of the request vector that falls outside
# the learned normal subspace — what the subspace can't explain.
```

The `drilldown_probe` function unbinds this anomalous component against the role vector for every walkable field in the request:

```rust
let anomaly_vec = Vector::from_f64(&anomaly);

let probe_norm = |key: &str| -> f64 {
    let role = encoder.get_vector(key);
    let unbound = Primitives::bind(&anomaly_vec, &role);
    unbound.data().iter().map(|&x| (x as f64).powi(2)).sum::<f64>().sqrt()
};
```

This works because Holon's binding is its own inverse: `bind(bind(A, Role), Role) = A`. Binding the anomalous component against a field's role vector extracts the portion of the anomaly that came from that field. A high norm means the field contributed significantly to the anomaly. A low norm means the field looks normal. This is the same algebraic unbind operation used in the Python experiments for field attribution — it's now running autonomously on live traffic.

The probe sweeps hierarchically:

1. **Top-level fields**: `headers`, `path_parts`, `query_parts`, `header_shapes`, `path_shape`, `query_shape`, `header_order`, `cookies` — ranked by anomaly contribution
2. **Positional elements** within the top 4 anomalous top-level fields: which specific header? which path segment?
3. **Nested elements** within positional hits: header name vs. header value? path segment content vs. path segment length?

Each probe hit carries both the literal value and the structural value:

```rust
pub struct ProbeHit {
    pub target:        ProbeTarget,  // what was probed (e.g., "headers.[2].[1]")
    pub score:         f64,          // anomaly contribution (norm)
    pub content_value: String,       // literal value from the sample
    pub shape_value:   usize,        // length of the value
    pub header_name:   String,
}
```

For a scraper request hitting `/products/abc12`:
- `path_parts.[2]` has a high score — the third path segment is where the anomaly lives
- `content_value` is `"abc12"` — not useful for a rule, every request has different content
- `shape_value` is `5` — consistent across all scraper requests

### Shape Encoding: When Content Varies but Structure Doesn't

The detection system applies **content-before-shape priority**: if the same field appears with a consistent literal value across ticks, use the literal. If the literal varies but the length is consistent, use the length.

`user-agent: Scrapy/2.11.0` — same literal every time — generates:
```clojure
(= (first (header "user-agent")) "Scrapy/2.11.0 (+https://scrapy.org)")
```

`/products/XXXXX` — random literals, fixed 5-character length — generates:
```clojure
(= (count (nth path-parts 2)) 5)
```

Shape encoding uses `ScalarValue::linear` to encode field lengths into the VSA vector. `path_shape` encodes the length of each path segment. `header_shapes` encodes the length of each header name and value. `query_shape` encodes query key/value lengths. These are separate walkable fields from the content fields — the subspace learns both the content distribution and the shape distribution of normal traffic.

A fixed-length high-cardinality attack — random strings of identical length — produces zero concentration in content fields but total concentration in shape fields. The probing detects this: the content probe shows low scores (variance across samples cancels out), the shape probe shows high scores (consistent length across samples reinforces).

`DetectionKind` encodes the priority hierarchy:
- `Content` — literal value match (most surgical)
- `Shape` — length match (catches high-cardinality attacks)
- `Duplicate` — header count match (catches smuggling attempts)

---

## SurpriseHistory: Cross-Tick Consistency

One probe hit from one anomalous tick is noise. An unusual request might trigger a probe hit on path structure one tick and on user-agent the next — that's transient variance, not an attack pattern.

`SurpriseHistory` is a ring buffer that tracks `ProbeHit` results across ticks:

```rust
pub struct SurpriseHistory {
    buffer: VecDeque<Vec<ProbeHit>>,
    capacity: usize,
}
```

Before emitting a detection, the system requires that the same field shows up as anomalous in multiple consecutive ticks. A field that appears in the top hits across 3+ consecutive ticks is a structural characteristic of the attack. A field that spikes once and disappears is filtered out.

This prevents a single unusual request from generating rules. The threshold for action is cross-tick consistency: the same surprise, repeatedly. The detection system has patience — it waits for the signal to stabilize before committing to a rule that will be compiled into the tree and enforced against live traffic.

---

## The Two Bugs

Two bugs that existed in the earlier concentration-based implementation surfaced as the system matured with surprise probing.

**Bug A: Rule Refinement Discarded**

The `is_redundant` check in the rule manager was rejecting rules whose constraint set was a superset of an existing rule's constraints. The logic: the broader rule already covers the match space, so the more specific rule is redundant.

This is correct for sequential rule evaluation — if the broader rule fires first, the specific rule is unreachable. But with the expression tree and Specificity ranking, broader and narrower rules coexist by design. The tree picks the most specific match. A broad rule `(= path "/api/search")` created at streak=3 (before surprise data matures) becomes a fallback. The surgical compound rule `{path + user-agent + path-parts}` created at streak=5 (with full surprise probing) wins for requests that match all constraints.

The fix: remove the subsumed-superset check. Only reject exact duplicates. Let the tree's `Specificity` ranking handle prioritization — that's what it was built for.

**Bug B: Engram Resilience**

The engram fast-path was `if/else`: engram hit → deploy stored rules → skip fresh rule generation. This created a poisoning risk.

Shape encoding causes structural similarities between unrelated attacks. A scraper hitting 5-char product IDs has a similar eigenvalue spectrum to an attack hitting 5-char session tokens on a different path. The engram library reports a match based on geometric similarity. The stored rules deploy — but they target the wrong path, the wrong user-agent. No fresh rules are generated. The current attack continues unmitigated.

The fix: engram hit triggers fast-path deployment AND parallel fresh rule generation. The engram's rules deploy immediately to `rule_mgr` (enforcement). The system falls through to `learn_attack()` and generates fresh rules from the current traffic. If the engram's rules work, the anomaly resolves quickly. If they don't, the fresh rules cover it within a few more ticks.

Engram poisoning is prevented architecturally: `deploy_engram_rules` populates the rule manager from stored metadata. `attack_rules` accumulates freshly generated rules during the current attack. New engrams mint only from `attack_rules` — stored engram rules are never inherited. Each engram cycle stores only what was learned fresh, preventing stale rules from compounding across deployments.

---

## Seven Waves, All Mitigated

With the expression tree integrated, surprise probing active, and both bugs fixed, the full `multi_attack.json` scenario ran end-to-end. 15 phases — four attack types, four replay waves, warmup/lull/cooldown transitions:

| Wave | Attack | Mechanism | Result |
|------|--------|-----------|--------|
| 1 | GET flood `/api/search` (`libwww-perl/6.72`) | Concentration (UA + path) + surprise (path-parts) | MITIGATED |
| 2 | Credential stuffing (`python-requests`) | Concentration (method + content-type) + TLS set | MITIGATED |
| 3 | Scraper (`Scrapy/2.11.0`) — random 5-char product IDs | Shape detection: `(count (nth path-parts 2)) = 5` | MITIGATED |
| 4 | Shuffled TLS `/api/data` (`bot_shuffled`) | Set-based TLS matching + HTTP compound | MITIGATED |
| 5 | Replay wave 1 | Existing rules still active | MITIGATED |
| 5b | Replay wave 4 | Engram hit — instant rule deploy | MITIGATED |
| 6 | Replay wave 2 | Engram hit — instant rule deploy | MITIGATED |

Wave 3 is the one the previous post's concentration-based system couldn't fully characterize. The user-agent was consistent (`Scrapy/2.11.0`), so the scraper was caught — but the path-level constraint was a blunt `path-prefix=/products`. With surprise probing, the system discovers that `path_parts[2]` has a fixed length of 5 across all scraper requests, and generates the surgical shape constraint. The rule went from "rate-limit anything under /products" to "rate-limit /products requests where the product ID is exactly 5 characters long, from Scrapy."

Live-generated rules from the final scenario run:

```clojure
;; Surgical compound rule — surprise probing found user-agent + path-parts
{:constraints [(= path "/api/search")
               (= (nth path-parts 2) "search")
               (= (nth path-parts 1) "api")
               (= (first (header "user-agent")) "libwww-perl/6.72")]
 :actions     [(rate-limit 80)]}

;; Shape detection — scraper hitting random 5-char product IDs
{:constraints [(= tls-ext-types #{"0x0000" "0x0005" ...})
               (= (first (header "user-agent")) "Scrapy/2.11.0 (+https://scrapy.org)")
               (= (nth path-parts 1) "products")
               (= (count (nth path-parts 2)) 5)]
 :actions     [(rate-limit 80)]}

;; TLS-randomized attack — set-based fingerprint, immune to shuffle
{:constraints [(= tls-ext-types #{"0x0000" "0x0005" "0x000a" ...})
               (= tls-ciphers #{"0x00ff" "0x1301" ...})
               (= tls-groups #{"0x0017" "0x0018" "0x001d"})]
 :actions     [(rate-limit 80)]}
```

All of these rules were generated autonomously from traffic observation. No signature database. No libinjection. No regex. The system noticed which fields were anomalous, what their values or shapes were, and generated compound constraints spanning both TLS and HTTP layers.

This is synthetic scenario traffic — the attack profiles are controlled lab constructs. The detection numbers are real (rules were generated and enforced), but the traffic diversity is narrower than production. The architecture is proven. Production readiness requires real traffic validation.

<div style="display: flex; flex-direction: column; align-items: center; text-align: center">

<video controls autoplay loop muted playsinline style="max-width: 100%">
  <source src="/demo-shape-and-crosslayer.mp4" type="video/mp4" />
</video>

*Two attack types, autonomously mitigated. Credential stuffing generates cross-layer rules spanning TLS fingerprint and HTTP method/path/content-type. The scraper attack randomizes product IDs — the system detects the fixed 5-character ID length via shape encoding, producing `(= (count (nth path-parts 2)) 5)` without ever seeing the same ID twice.*

</div>

---

## 287 Tests, All Passing

The expression tree integration replaced the entire live pipeline:
- `RuleSpec` → `RuleExpr`
- `CompiledTree` → `ExprCompiledTree`
- Detection → rule generation → compilation → ArcSwap deploy → enforcement

287 tests pass. The legacy types and `tree.rs` were retained for reference but removed from the live path. Engram rules serialize as EDN strings and round-trip through the new parser — the old JSON struct format is gone from the enforcement path.

---

## What Four Evenings Built

TLS-terminating proxy, lossless ClientHello capture, dual SubspaceDetector, composable rule expression language with 26 dimensions and 13 operators, expression tree compiler evaluating a million rules in under 3 microseconds, VSA surprise probing for per-field attribution, shape detection for high-cardinality attacks, engram resilience against geometric false-matches, 287 tests, 7/7 attack waves mitigated autonomously.

No signatures. No training data. No libinjection, no regex database, no YARA rules. Four after-hours sessions from empty directory to a working Layer 7 WAF that generates its own rules from traffic observation.

That's the thing that shouldn't exist. It does.

And the part that keeps me up at night: none of this requires a GPU. The entire pipeline — encode, learn, score, probe, generate, compile, enforce — runs on commodity CPUs. Element-wise multiply. Dot product. Streaming matrix update. Operations that every processor manufactured in the last twenty years can execute. The "AI" here isn't a model you download from a cloud endpoint. It's a program that learns at runtime from its own observations, using math that Kanerva described in 1988 and nobody in network security bothered to try.

Every router, every edge device, every Raspberry Pi collecting sensor data in a factory — they could all be doing meaningful work in this space. Train the subspace on a beefy machine with full traffic history, distribute the learned manifold and engram library to field devices, and those devices do real-time scoring and recognition on commodity hardware. Or let the field device learn locally from its own observations. Either way, the encoding is deterministic — same input, same vector, on any machine with the same codebook. The data has a programmatic address in hyperspace. Every machine that shares the codebook can operate on it without coordination, without new infrastructure, without a GPU.

I dropped out of computer science. Spent fifteen years hacking on systems that broke under load and learning why. Came to VSA through a conference video. Came to Rete through another conference video. Came to manifold learning by asking an LLM what a hyperbox is. YouTube and LLMs — that's the curriculum. The formal education would have made the vocabulary easier. It wouldn't have changed the result — the result comes from the algebra, not the credential.

The next step is something we haven't built yet — but the concept is documented, and it inverts everything described so far. That's in the epilogue.

---

## Likely Contributions to the Field

- **Rete-spirit DAG compilation for s-expression rule languages**: a dimension-agnostic recursive compiler that produces O(depth) evaluation over composable accessor chain rules, with O(n) compilation and ~50ns miss path regardless of rule count — applied to composable rules with nested accessor chains (`(first (header "user-agent"))`, `(count (nth path-parts 2))`), which is novel for WAF rule engines. The academic precedent is Rete (Charles Forgy, 1970s) — designed for production-system inference, not packet/request classification. The adaptation: Rete's discrimination network compiled once, evaluated many times, against structured network data
- **VSA surprise probing for field attribution via algebraic unbind**: using `bind(anomalous_component, role_vector)` to recover per-field anomaly contribution — a content-addressable decomposition that produces ranked, actionable field attributions without training a classifier. The probe result becomes a rule constraint via `DetectionKind` priority (Content > Shape > Duplicate)
- **Shape-based detection via VSA length encoding**: encoding field *lengths* into the vector alongside field *values*, enabling detection of attacks where content is random but structure is fixed — a dimension that concentration-based systems miss entirely
- **SurpriseHistory cross-tick consistency gate**: requiring anomalous fields to persist across multiple consecutive ticks before generating rules, filtering transient noise from structural attack characteristics
- **Engram resilience via parallel fast-path + learning**: decoupling engram deployment from fresh rule generation, preventing compounding poisoning from geometric false-matches between structurally similar but semantically unrelated attacks
