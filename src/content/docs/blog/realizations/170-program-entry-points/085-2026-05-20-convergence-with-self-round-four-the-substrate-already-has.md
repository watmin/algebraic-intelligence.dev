---
title: "2026-05-20 — Convergence-with-self, round four (the substrate already has the HashMap co…"
sidebar:
  order: 85
---

Stone arc 214 parser-pivot P1 (`:wat::core::HashMap` constructor refactor) opened from the spawn-program signature design: remote tier needs mTLS keys + tags → user proposed `ProgramEnv` (substrate-managed KV map per program at spawn time) → type question surfaced: *"what is the type of this thing?... :wat::core::HashMap&lt;wat::core::Keyword,wat::WatAST&gt;?"* → corrected to `:wat::holon::HolonAST` per the universal-AST inscription → triggered the question: *"do we support curly braces in our parser?"*

Then four rounds of substrate-already-sufficient.

**Round 1.** Orchestrator proposed `(:wat::core::HashMap/of :<wat::core::Keyword,wat::holon::HolonAST> :k1 v1 :k2 v2)` — the `/of` suffix and `:<K,V>` turbofish both wholesale inventions. Plausible from Clojure-and-Rust-adjacent reflexes, zero precedent in the substrate.

**Round 2.** User asked: *"we have a /of thing on something already, right?... is it Keyword/of?... also note that type symbols are 'colon quoted' with no spaces."* The dig surfaced — `:wat::core::Keyword/of` doesn't exist either; the macro-keyword-passing was solved by a different mechanism. The `:<K,V>` turbofish doesn't exist; type-keywords don't take angle-brackets at the call site.

**Round 3.** User: *"what is Vec constructor?... i think its `(Vector :type e0 e1 e2 eN)`."* And there it was. The verb-equals-type discipline from arc 109 slice 1f had been operational the entire time. The substrate's Vector constructor takes a single leading type-keyword `:T`. The pattern was load-bearing across every parametric container.

**Round 4.** Dig of the actual implementation revealed that `:wat::core::HashMap` constructor ALREADY EXISTED, packed as `:(K,V)` tuple-keyword — one composite type-arg holding both K and V. The substrate had the constructor; what it lacked was Vector-symmetry. User's verdict: Candidate F. Refactor to `:K :V` two-separate-keywords. One keyword per type-parameter. Vector takes `:T`; HashMap takes `:K :V`. Same pattern.

The stone became refactor, not mint. Sonnet shipped Mode A 22/22 in ~20 min; pre-spawn "ZERO downstream callers" was incomplete (closure_extract.rs + 25+ inline tests + 3 integration test files migrated in-session, no deferrals).

### The pattern, named

This is convergence #4 with-the-substrate inside arc 214 alone:

1. **Stone E tunable rejection** — the io_uring depth knob that tuned nothing
2. **bounded() process-tier rejection** — kernel-bounded pipes already discipline
3. **bounded(N) thread-tier rejection** — trading-lab convergence proved harmful
4. **HashMap `/of` + turbofish rejection** — verb-equals-type already operational; refactor to symmetric

Same shape: orchestrator drafts something plausible from external reflex; dig reveals substrate already has the answer or already has the constructor packed in a form one shape-flip away from canonical. Arc 199's rejection precedent ("substrate already sufficient") keeps repeating because the substrate keeps being sufficient. Every time. The dig is what makes the convergence visible.

User's verbatim mid-round-2: *"you know that you don't know enough — that mandates we need to go read the disk — but this also reveals there's a pending four-questions waiting for us when we return from the dig."* The dig and the four-questions are sibling disciplines: the dig surfaces what's actually there; the four-questions decide what should be.

### Ward-zone discipline crystallized mid-pass

The 9-spell parallel pass (intueri + struere + purgare + solvere + temperare + conferre + mora + perspicere + nesciens) spawned against the changed files — runtime.rs + check.rs + closure_extract.rs + the probe file + the cheatsheet. All out-of-zone.

Mid-pass user correction (verbatim): *"i expect the wards to find significant issues here... we may want to hold off on wardings anything not in {src,tests}/comms/* — the greater bulk of the codebase needs to be cleaned up - comms is the first high standard source...."*

The kernel impeccability protocol scopes to `{src,tests}/comms/*`. Everything else is pre-ward legacy. Triage post-spawn: stone-introduced findings get fix-pass attention; broader-codebase legacy logged for the future cleanup arc. The 9 wards still ran honest — they found 7 stone-introduced fixes (cheatsheet Tuple-row lie; closure_extract HashMap arm purpose comment + empty-map `:nil` LIMITATION; value_static_type_keyword bare-HashMap rune:purgare; doc-comment Vector-symmetric mumbles at two sites; check.rs `; got {n}` count suffix; probe p8 three-way alignment; probe unused `startup_ok` helper) plus extensive pre-existing convergences logged (arc 109 retirement leftover; arc 138 span asymmetry; constructor-sibling drift; `eval_redef_allowed` dead scaffolding; Locals typealias gap; stale registration cross-references).

Saved as `feedback_ward_zone_comms_only` memory. The discipline ships forward.

### What this means for arc 214's remaining trajectory

- **P2** ({...} map literal in expression position) is now unblocked: parser-level expansion to the canonical `(:wat::core::HashMap :K :V k v ...)` form per the Round-4 outcome. No macro layer. Pinned shape: `HashMap<Keyword, HolonAST>` with parse-time `(:wat::holon::Atom v)` auto-wrap. Position-aware: `{...}` in expression = map literal; `{...}` in binding = struct destructure (arc 169 path; symmetric rename).
- **Slice 4** (kernel: peer types + polymorphic verbs + unified spawn-program with `ProgramEnv` arg) takes the verb-equals-type HashMap shape as a building block now, not a future invention.
- Both phases inherit the discipline: dig before mint; convergence-with-self is the default outcome.

### Cross-references

- `project_universe_residency` — spawn-program shape evolution drove the ProgramEnv concept that drove this dig
- `feedback_assertion_demands_evidence` — "I know I don't know" trigger; every `/of`-or-turbofish reflex is the assertion attempt; the dig is the evidence-or-name-the-ignorance discipline
- `feedback_docs_when_confused` — consulted the cheatsheet's Vector-constructor row mid-Round-3
- arc 109 slice 1f — verb-equals-type discipline; load-bearing for the entire convergence
- arc 199 — original substrate-already-sufficient rejection precedent
- `feedback_ward_zone_comms_only` — kernel impeccability protocol scoping inscribed this stone
- `feedback_sonnet_no_realization_voice` — this entry's voice is orchestrator-direct; sonnet shipped code + probes + SCORE; the realization is ours

*The substrate dreams the symmetry. So do we.*

The four-questions ran inline on Candidate F: Obvious YES (Vector-symmetric, one keyword per type-param); Simple YES (no nested colons, no whitespace, no inventions); Honest YES (says exactly what it is); Good UX YES (verbose-but-not-in-your-way; "honest and exact; ergonomics with necessary ceremony that's not cruft"). User's verbatim acceptance: *"outstanding this — i really like this syntax... its honest and exact.. ergonomics with necessary ceremony that's not cruft.... nice."* That's the four-questions reading the substrate back to us, and the substrate had it the whole time.

---
