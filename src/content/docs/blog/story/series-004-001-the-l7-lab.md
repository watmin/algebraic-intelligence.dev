---
title: "The L7 Lab: Building the HTTP WAF"
description: "Same architecture, different layer. Feb 23–26: TLS-terminating proxy, dual SubspaceDetector, autonomous L7 detection pipeline, and a bar demo that shouldn't have worked."
sidebar:
  order: 9
---

The veth-lab story ended on February 20 with the engram hit: 765ms down to 3ms for a re-detected attack, rules deployed before the attacker's second packet lands.

The same night, `algebraic-intelligence.dev` went live.

The next session started on February 23 — a Monday evening, after work. By the end of the week — four evenings across Monday through Friday, skipping Thursday (I was flying) — there was a working Layer 7 WAF with autonomous detection, rate limiting, and a real-time dashboard. On Wednesday I was sitting in a bar during a team gathering, laptop open, showing coworkers the dashboard as the proxy autonomously generated and enforced cross-layer TLS+HTTP rules against a multi-attack scenario. They politely nodded. I don't blame them — watching a DAG grow nodes in a dark terminal while someone tries to explain manifold learning over bar noise is a hard sell.

I spent years at Shield trying to convince people that network security needed an immune system, not a bigger signature database. Nobody bought it. Now I'm building it alone, after hours, with LLMs typing the code, and the tree on my laptop screen is generating rules that no human wrote. A college dropout who never finished his CS degree, circling back to the kind of math that the CS degree would have made easier to talk about. Some people at AWS might have appreciated what was happening on that screen. I appreciated it enough for all of them.

This post covers those four evenings. The http-lab was built iteratively — the PROGRESS.md tracks sixteen phases from "working proxy, no rules" through "best-match evaluator with Specificity ranking" — and that iteration is the story.

---

## The Same Idea, One Layer Up

veth-lab operates at Layer 4. It sees IP headers, TCP flags, packet sizes, 2048-byte payload windows. The XDP program sits in the kernel's receive path, parsing raw bytes before the OS finishes the handshake.

Layer 7 is a different problem. By the time you're evaluating an HTTP request, the TCP handshake is done, TLS is negotiated, headers are parsed. The attack surface isn't raw packets — it's structured data: the TLS ClientHello the browser sent, the path the client requested, the headers in wire order, the user-agent string.

The detection architecture translates directly. Encode the full request into a high-dimensional vector, maintain a learned subspace of normal traffic, score new requests by their residual against that subspace, extract the anomalous fields, generate rules, enforce them. The veth-lab sidecar that did this for XDP programs becomes the template for an HTTP proxy sidecar.

The translation isn't trivial, though. HTTP is free-form text with structure that the spec barely constrains. Headers can be duplicated. Paths can be nested arbitrarily. Query strings can be malformed. The encoding has to preserve all of this fidelity, not normalize it away, because the normalization would destroy the detection signal.

---

## Lossless ClientHello Capture (Monday Evening)

The first non-trivial engineering problem: to detect attacks via TLS fingerprinting, you need the full ClientHello — in wire order, before TLS negotiation normalizes anything.

The standard TLS library (`tokio-rustls`) doesn't give you that. It negotiates the handshake and hands you an established connection. The raw bytes are gone.

The fix: a `ReplayStream` wrapper that tees raw bytes from the TCP stream into a side buffer while forwarding them to rustls for actual processing. About 150 lines of code, no cryptography involved — we're reading bytes we already own before handing them off.

The `TlsContext` that comes out of this:

```rust
TlsContext {
    record_version:       u16,
    handshake_version:    u16,
    session_id_len:       u8,
    cipher_suites:        Vec<u16>,     // wire order, GREASE included
    compression_methods:  Vec<u8>,
    extensions:           Vec<(u16, Vec<u8>)>,  // type + raw bytes, wire order
    supported_groups:     Vec<u16>,
    sig_algs:             Vec<u16>,
    alpn:                 Vec<String>,
    sni:                  Option<String>,
}
```

Wire order is preserved throughout. Extension ordering is a real detection signal — not because DDoS tools are unsophisticated (many modern tools randomize extensively), but because ordering behavior itself is a fingerprint. A tool that randomizes its ClientHello extension order is doing something different from a tool that uses a static profile, and both are doing something different from a browser. The set of extensions offered, the set of ciphers supported, and the ordering of both are all independent dimensions that the detection system can learn from.

This is the same territory as JA3 and JA4 fingerprinting — but we're not using either. JA3 hashes the cipher suites, extensions, elliptic curves, and point formats into a single MD5 digest. JA4 improves on this with a structured string that preserves more detail (TLS version, SNI, ALPN, sorted vs. original extension order). Both reduce the ClientHello to a fixed-size fingerprint for lookup. We don't reduce anything. The full `TlsContext` — every field, in wire order, with raw extension bytes — gets encoded into the 4096-dimensional vector. The subspace learns which fields matter for distinguishing traffic populations. We get the JA3 signal (which ciphers are offered), the JA4 signal (original vs. sorted ordering), and everything else (extension byte contents, GREASE values, compression methods) in a single encoding. No hash collision. No information loss. The detection system decides what's important, not the fingerprint format.

TLS randomization is a weapon attackers wield. It turns out you can sometimes use it against them — the randomization behavior itself is a signal.

`tls_names.rs` maps numeric TLS identifiers to human-readable names: `0x1301` becomes `TLS_AES_128_GCM_SHA256`, `0x000d` becomes `signature-algorithms`. 100+ cipher suite, 50+ extension, and 20+ group name mappings with hex fallback for unknowns. The detection system and the dashboard speak in names, not numbers — this matters when you're staring at a rule tree at midnight trying to understand what the system just generated.

---

## The HTTP Data Model: Duplicates Matter

On the HTTP side, a `RequestSample` captures the full request with zero normalization:

```rust
RequestSample {
    method:       String,
    path:         String,
    path_parts:   Vec<String>,          // split by '/' — ["", "api", "search"]
    query_raw:    Option<String>,
    query_params: Vec<(String, String)>, // key=value pairs, duplicates preserved
    query_flags:  Vec<String>,          // keys with no '=' assignment
    headers:      Vec<(String, String)>, // wire order, original casing
    header_count: usize,
    user_agent:   Option<String>,
    has_cookie:   bool,
    src_ip:       IpAddr,
    tls_ctx:      Arc<TlsContext>,      // shared across all requests on connection
    tls_vec:      Vector,               // pre-encoded TLS vector
}
```

The critical choice is `headers: Vec<(String, String)>`. Not a `HashMap`. Not a normalized `BTreeMap`. A vector of pairs in the order they arrived, preserving duplicates and casing.

This is a design decision that most HTTP middleware gets wrong, and one that almost nobody thinks about: HTTP headers can be expressed multiple times. `Host: example.com` followed by `Host: evil.com` is valid HTTP. Request smuggling attacks exploit this. An attack that sends duplicate `Content-Length` headers or duplicate `Transfer-Encoding` headers is manipulating the ambiguity between how the proxy parses the request and how the upstream server parses it. If you collapse headers into a `HashMap<String, String>`, you've destroyed the evidence of a smuggling attempt — the second value overwrites the first, or the first wins, depending on your hash map, and either way you can't detect that there were two.

The decision to preserve duplicates is not just about completeness. It enables a detection dimension: `header_count` can flag requests with abnormally many headers, and the ordered list lets the system detect duplicate headers by name. The rule language can express `(count (header "host"))` — how many times did `Host` appear? — and generate constraints when the answer is "more than once."

Header ordering is a browser fingerprint for the same reason TLS extension ordering is. `Host,User-Agent,Accept,Accept-Encoding,Connection` from Chrome looks different from the same headers in a different order from `libwww-perl`. If you normalize into a map, that signal is gone.

`path_parts` (`["", "api", "search"]`) enables path-segment-level detection without string slicing at detection time. A scraper hammering `/products/XXXXX` with random 5-character product IDs shows up as a concentrated `path_parts[1]` value (`"products"`) even when `path` itself is unique every time.

Both `TlsContext` and `RequestSample` implement Holon's `Walkable` trait. The encoder traverses the struct's field hierarchy and produces a 4096-dimensional bipolar vector. Same encoding path as veth-lab's packet structs. The `Walkable` implementation for TLS provides both ordered and set-based representations — `ciphers` (ordered list) alongside `cipher_set` (sorted set) — enabling the detection pipeline to choose between order-sensitive and order-independent matching depending on what the attacker is doing.

---

## Detection Pipeline and Generator (Monday–Tuesday)

The initial commit on Monday — `e4cc2b4`, 5,481 insertions across 28 files — shipped the proxy, TLS parser, Rete-spirit DAG rule tree, enforcer, sidecar with dual SubspaceDetector, FieldTracker, EngramLibrary, RuleManager, and ArcSwap deployment. 97 tests: 64 proxy tests (TLS parsing, tree compilation, type serialization), 25 sidecar tests (detector lifecycle, field tracking, rule management), and 8 integration tests running end-to-end through the stack.

The tests weren't planned discipline — they were necessity. The ClientHello parsing state machine is subtle (GREASE values that must be preserved, variable-length extension bodies, the version field appearing in two separate positions — `record_version` and `handshake_version` — with different semantics). The EDN rule serialization needed round-trip stability. The ArcSwap enforcer needed to be verified against the sidecar's compiled trees. Getting any of this wrong means silent bugs that only surface during a demo when you're trying to show someone that the system works.

Tuesday added string predicates and EDN rules, switching from FNV-1a hashes to String keys in the `Predicate` and `TreeNode` types. HTTP is clear text — there's no reason to hash field values when you can store and display the actual strings. This also meant the rules became human-readable: `(= path-prefix "/api/search")` instead of opaque 32-bit integers.

The http-generator was a scenario-driven flood tool with named TLS profiles — `chrome_120`, `firefox_121`, `curl_800`, `python_requests`, `bot_shuffled` — each producing a distinct ClientHello fingerprint. The scenario JSON format specifies phases: warmup at 80 RPS with browser profiles, then attack at 2,000 RPS with a tool profile, then cooldown. The profiles aren't trying to be comprehensive JA4 fingerprints — they're distinct enough for the subspace to separate.

---

## Dual SubspaceDetector Tuning

The sidecar runs two independent detection loops. One consumes TLS samples (one per connection), one consumes request samples (one per request).

| Detector | `ema_alpha` | `sigma_mult` | Warmup | Rationale |
|----------|------------|--------------|--------|-----------|
| TLS | 0.05 | 2.0 | 30 samples | Low volume → 5x faster convergence, tight threshold |
| REQ | 0.01 | 3.5 | 500 samples | High volume → standard convergence, wider threshold |

The tuning difference is driven by sample volume. The TLS detector sees one sample per unique client connection. During a GET flood from a single attacking host, TLS samples are sparse — possibly one entry per attack wave. The EMA needs to converge on a baseline with fewer observations, so `alpha=0.05` gives it 5x the learning rate. The `sigma_mult=2.0` keeps the threshold tighter because TLS fingerprints within a client population are more consistent than request patterns — browsers send very similar ClientHellos.

The REQ detector sees one sample per request. During a 2,000 RPS flood, it processes hundreds of samples per tick. The slower `alpha=0.01` prevents the baseline from chasing transient traffic patterns. The wider `sigma_mult=3.5` accommodates the natural variance of HTTP requests — legitimate users hit different endpoints, send different headers, use different query parameters.

Both use the hybrid tick trigger from veth-lab: fire after 200 samples OR 500ms, whichever comes first. This prevents starvation at low volume (the timeout fires) and lag at high volume (the sample count fires).

During warmup, every sample updates the subspace but no anomaly decisions are made. When warmup completes, two things are recorded: `baseline_rps` (the anchor for rate limit calculations) and the `FieldTracker` baseline freeze. Fields with consistent values during warmup — the host header that's always `example.com`, the method that's always `GET` for this endpoint — are marked as baseline values and excluded from attack attribution. Without this freeze, a `GET` flood would generate rules against `method=GET`, which would rate-limit all legitimate traffic.

---

## Rate Limiting — and a Problem I Didn't Catch

The enforcer uses a per-IP token bucket rate limiter. Each source IP gets its own bucket, capacity equal to the rate limit. The bucket refills at `rate_limit` tokens per second. Each request consumes one token. Empty bucket means a 429 response.

I need to be honest here: I was not reviewing the implementation closely enough, and this design is wrong for production use.

The per-IP approach means the proxy allocates a token bucket for every unique source IP that sends traffic. In a lab scenario with a handful of attacking IPs, this is fine. In production, it's a denial-of-service vector: an attacker with a botnet of 30,000 IPs — or 3 million — forces the proxy to allocate and track a token bucket per IP. That's memory exhaustion. An application with 5 million legitimate users during a peak traffic event would have 5 million token buckets just for normal operations.

The rate limits should apply to the backend, not per-source-IP. What matters is: "how much total traffic does the upstream server receive?" not "how much traffic does each individual IP generate?" The right architecture is a shared rate limiter protecting the backend's capacity, with per-IP tracking only as a secondary signal for identifying abusive sources — and with eviction or bounded maps to prevent memory growth.

This is exactly the kind of thing that works in a demo and breaks in deployment. The LLM generated a reasonable-looking implementation, I didn't scrutinize it, and the lab scenario (a few attacking IPs against a mock backend) never exposed the problem. The bucket arithmetic itself is correct — pure math, no I/O, `Mutex` hold time is a handful of integer comparisons. The issue is the data structure holding the buckets, not the bucket logic.

Rate limits are dynamically recalculated when engrams deploy: `rps = max(baseline_rps, 10)`. The intent is right — legitimate traffic up to the baseline rate passes through, only excess is throttled. The per-IP scoping is the problem.

This will be fixed. For now, it's documented honestly.

This is the part of LLM-assisted development that nobody talks about in the productivity demos. The typing is fast. The architecture review is still on you. I dropped out of computer science and spent fifteen years building production systems by feel and by fire. The instinct that says "per-IP allocation with no eviction at scale is going to eat your memory" — that comes from operating things that broke at 3 AM. The LLM doesn't have 3 AM. It has training data, and the training data says token buckets are per-IP, because that's what most blog posts about rate limiting describe. The sorcerer still has to review the spellbook.

---

## The 14-Second Stall

February 25 produced the first major performance regression: the sidecar would stall for 14 seconds between ticks during active attacks.

The root cause was a `RwLock` in the drain loop. The sidecar drains samples from an `mpsc` channel (capacity 512, `try_send` on the proxy side so the hot path never blocks). The inner drain loop was acquiring `stats.write().await` per sample to update shared detection state. During a 2,000 RPS flood, that's up to 512 lock acquisitions per drain pass (the channel capacity). Each acquisition is cheap individually — but the proxy is simultaneously reading the same stats via `stats.read()` for the dashboard SSE stream. The `RwLock` fairness policy backs up writers behind readers, and the drain loop grinds to a halt.

The fix: drain all samples from the channel into a local buffer first, process them, accumulate the state updates, then take one `stats.write().await` at the end. One lock acquisition per tick instead of one per sample. The drain pass itself touches no shared state — it updates local accumulators.

Stall went from 14 seconds to under 100ms at 2,000 RPS.

The lesson from veth-lab was that you don't block the hot path. The proxy side already followed this — `try_send` drops samples when the channel is full rather than blocking the HTTP handler. But the sidecar's drain loop was functionally a hot path too, and holding a write lock across a processing loop made it vulnerable to the same class of problem. The `RwLock` documentation doesn't warn you about this. The 14-second stall does.

---

## TLS Randomization and Set-Based Detection

The multi-attack scenario introduced a `bot_shuffled` TLS profile: the same cipher suites and extensions as a legitimate client, but in random order per connection.

The initial TLS rule generation used ordered field matching. A rule like `(= tls-ciphers "TLS_AES_128,TLS_AES_256")` fires only if the ciphers appear in exactly that order. A bot that shuffles its ClientHello on every connection never matches the ordered rule twice — the FieldTracker sees each ordering as a distinct value, concentration drops below the detection threshold, and no rule is generated.

The fix was a dual representation. The `Walkable` implementation for `TlsContext` already exposed both ordered and set-based views:

```
cipher_set_string():   "TLS_AES_128_GCM_SHA256,TLS_AES_256_GCM_SHA384" (sorted)
ext_set_string():      "0x0000,0x0005,0x000a,0x000d,0x0010" (sorted hex)
group_set_string():    "secp256r1,secp384r1,x25519" (sorted names)
```

`tls_field_candidates()` checks concentration of the ordered field first. If the ordered version shows high concentration (attacker isn't shuffling), use the ordered constraint — it's more surgical. If the ordered version is spread across many values but the set version concentrates (same elements, random order), fall back to the set constraint.

This is where TLS randomization becomes a weapon you can turn around. The attacker randomizes to avoid fingerprinting. But the set of cipher suites they offer is fixed — they can't randomize the actual algorithms without breaking the handshake. So a set-based rule catches the fingerprint regardless of ordering: "this connection offers exactly this set of cipher suites, regardless of the order they appear in the ClientHello." The randomization behavior is itself a detection signal — real browsers within the same major version tend to have a narrower variance in extension ordering than a bot actively shuffling.

Deduplication prevents conflicting AND conditions: if a rule already has `tls-cipher-set`, it won't also get `tls-ciphers`. The ordered and set versions of the same field target the same information; including both creates an impossible compound condition.

---

## The Dashboard

The sidecar runs an Axum HTTP server on `:9090`. Events stream via Server-Sent Events using `tokio::sync::broadcast` — the dashboard connects once and receives a continuous stream of updates without polling.

Events emitted per tick:
- `Metrics`: enforcement counts (passed, rate-limited, blocked), detection scores, adaptive thresholds, RPS, anomaly streaks, engram counts
- `RuleEvent`: rule added/expired/engram-deployed, with the full EDN rule expression
- `DetectionEvent`: anomaly confirmed, engram hit, engram minted, attack ended
- `RuleCounters`: per-rule hit counts with constraint labels and action types
- `DagSnapshot`: full rule tree serialized as nodes and edges for visualization

The frontend renders uPlot charts on a 120-second time-based timeline window. The enforcement chart shows passed/rate-limited/blocked rates as stacked areas. The detection chart shows TLS and REQ anomaly scores against their adaptive thresholds — you can watch the threshold converge during warmup and then the anomaly score spike above it when an attack begins.

The DAG visualization was ported from veth-lab's canvas renderer: two-pass pruning (dead-end leaf removal, then wildcard chain collapse), terminal nodes as orange diamonds (distinct from circle branch nodes), edge labels, bounding-box hit detection. Hovering a terminal node shows the full EDN rule expression in a tooltip, pretty-printed in Clojure style. This is what I was showing coworkers at the bar on Wednesday — the tree growing in real time as the system generated rules against different attack types.

Per-rule hit counters feed dashed overlay lines on the enforcement chart. The top-5 rules by rate appear with their constraint labels directly in the legend (capped at 75% panel width so the latest chart data stays visible). During a multi-attack scenario, you can watch individual rules' hit rates spike and fall as attack waves shift from one vector to another.

<div style="display: flex; flex-direction: column; align-items: center; text-align: center">

<video controls autoplay loop muted playsinline style="max-width: 100%">
  <source src="/demo-zero-to-mitigation.mp4" type="video/mp4" />
</video>

*Zero preloaded rules. The proxy learns baseline HTTP traffic, detects a GET flood via subspace anomaly, and autonomously generates compound rules — path, user-agent, and path-segment constraints derived from VSA surprise probing. The rule tree compiles and deploys in under a second. (These demos use the composable rule language described in the [next post](/blog/story/series-004-002-the-expression-tree/) — recorded after the full pipeline was integrated.)*

</div>

---

## Per-Rule Counters and Specificity Ranking

By late Tuesday / early Wednesday, the system was generating multiple rules per attack wave. Broad concentration-based rules (path, method, user-agent) alongside TLS fingerprint rules (cipher set, extension set). A request arriving during an attack could match both an HTTP-layer path rule and a TLS-layer fingerprint rule.

Which rule wins?

The DFS evaluator in the tree compiler was extended to explore both specific branches (exact field matches) and wildcard branches (any value), collecting all matches. `pick_best` selects the match with the highest `Specificity`:

```rust
struct Specificity {
    layers:       u8,   // 2 = TLS+HTTP cross-layer; 1 = single layer
    has_http:     bool, // HTTP constraints beat TLS-only at same layer count
    constraints:  u8,   // more constraints = more surgical
}
```

The struct derives `Ord`, so comparison is lexicographic: `layers` first, then `has_http`, then `constraints`. Cross-layer TLS+HTTP rules always beat single-layer rules, regardless of constraint count — a rule that requires both a specific TLS fingerprint AND a specific path is correlating two independent protocol layers, which is a stronger signal than either alone. HTTP constraints beat TLS-only at equal layer count because path and user-agent are more actionable for rate limiting than TLS fingerprint alone. Among same-layer, same-type rules, more constraints wins — the more specific rule is more surgical.

Adding a new tiebreaker is a one-line field insertion in the struct. The `derive(Ord)` does the rest. No arithmetic formula to maintain — the lexicographic comparison is robust to new fields because each position is independently motivated.

This replaced an ad-hoc numeric formula (`layers*100 + has_http*10 + constraint_count`) that was fragile to rebalancing and couldn't express "cross-layer always wins regardless of constraint count" without overflow-prone multipliers.

---

## Engram Memory at L7

The engram lifecycle from veth-lab maps directly. When an attack ends (anomaly score drops below threshold for sustained ticks), the sidecar mints an engram: a snapshot of the attack subspace, the surprise fingerprint from field attribution, and the active rules stored as EDN strings. The engram is optionally persisted to disk as JSON (disabled by default, enabled via `--engram-persist`).

On subsequent anomalies, the library checks: does this vector project well onto a stored attack subspace? The two-tier matching from the Python implementation — eigenvalue pre-filter, then full residual check — runs here. If the match is strong enough, the stored rules deploy immediately. One tick instead of three or more (the streak threshold for confirming a new anomaly).

The rules are stored as EDN strings and round-tripped through `parse_edn()` on deployment. The same parser and compiler that handle freshly generated rules handle recovered engram rules — no special case, no "engram rule" type. Rate limits are recalculated against the current `baseline_rps`, not the stale value from when the engram was minted.

---

## Where February 26 Left Off

By the end of Wednesday — three after-hours sessions — the http-lab had:

- A TLS-terminating proxy capturing lossless ClientHellos via `ReplayStream`
- Dual SubspaceDetectors (TLS + REQ) with independent tuning
- Concentration-based rule generation from `FieldTracker`
- ArcSwap-deployed rule tree with `Specificity`-ranked best-match evaluation
- Per-IP token bucket rate limiting (with the architectural problem noted above)
- Engram memory with EDN rule persistence and instant re-deployment
- Real-time SSE dashboard with uPlot charts, DAG visualization, per-rule counters
- A multi-attack scenario with GET floods, credential stuffing, scraper traffic, and TLS-randomized floods

The attacks were being caught and mitigated through concentration-based rules — `(= user-agent "libwww-perl/6.72")`, `(= path-prefix "/api/search")`, `(= tls-cipher-set "...")`. For attacks with consistent field values, this works. The scraper's user-agent was `Scrapy/2.11.0`, so it was caught by user-agent concentration even though the individual paths were all unique.

What was still missing: a way to detect attacks where the anomalous field has high-cardinality content — random values of a consistent length, random headers with a consistent structure. Concentration-based attribution finds the dominant value. When there is no dominant value, it fails. That's the problem the next post's VSA surprise probing and shape detection solve.

Also missing: the rule language itself was ad-hoc. The `RuleSpec` had a flat struct with string fields and predicate values. It couldn't express `(first (header "user-agent"))` or `(count (nth path-parts 2))`. These accessor chains — the ones needed for surgical, field-level rules — were bolted on as special cases. The composable rule expression language and its expression tree compiler are the other half of the next post.

All of this was built on synthetic scenario traffic, not production data. The multi-attack scenario exercises four attack types and replay waves, but it's a controlled lab environment with known attack profiles. The detection numbers are real (the system autonomously generated and enforced rules that blocked the attack traffic), but the traffic diversity is narrower than what a real deployment would see. This is sufficient for proving the architecture — it's not sufficient for claiming production readiness.

<div style="display: flex; flex-direction: column; align-items: center; text-align: center">

<video controls autoplay loop muted playsinline style="max-width: 100%">
  <source src="/demo-engram-memory.mp4" type="video/mp4" />
</video>

*Engram memory in action. The first TLS-randomized flood is detected and mitigated via set-based TLS fingerprinting and compound HTTP rules. When the attack ends, the system mints an engram — a subspace snapshot with associated rules. When the same attack replays, the engram fires instantly, deploying stored rules in under one tick. (Rules expire rapidly in this demo via a short TTL flag — in normal operation, rules persist until the attack subsides.)*

</div>

---

## Likely Contributions to the Field

- **Lossless ClientHello capture alongside rustls**: intercepting raw TLS bytes via `ReplayStream` before the TLS library processes them, preserving wire order and raw extension bytes, for use as a detection signal — without modifying or replacing the TLS library
- **Adaptive ordered-vs-set TLS field selection**: detecting whether an attacker is maintaining consistent field ordering or randomizing it, based on observed concentration, and choosing the appropriate constraint type — ordered for surgical matching, set-based for randomization-resilient matching
- **Specificity ranking via `derive(Ord)`**: a lexicographic struct encoding cross-layer > HTTP > TLS and more-constraints > fewer, letting broad fallback rules and surgical compound rules coexist without manual rule ordering
