---
title: "2026-05-18 (post-arc-211e) — Tooling-proven-by-use: closure-discipline doctrine extension"
sidebar:
  order: 64
---

Mid arc-211-closure question. Orchestrator was drafting arc 211 INSCRIPTION based on:
1. Arc 211 a/b/c/d/e all shipped
2. Workspace failure count down to 2 (t6 + probe_lifeline)
3. Both remaining failures determined to be arc 170 territory (not arc 211 scope)
4. Therefore: arc 211 done in its forward-corrected scope; INSCRIPTION ready

User HALTED:

> *"we only close an arc if its done done - if there's remaining work - we keep it open...."*

After investigation revealed the 2 remaining failures didn't need arc 211 closure to be addressed (substrate-correctness for t6 + libc-fork-pressure for probe_lifeline; neither blocked on spawn-program deliverable):

Orchestrator framed: "Close arc 211; open new arcs for each test."

User HALTED AGAIN with the load-bearing principle:

> *"i say we open two new arcs and 211 is blocked on closure of them... unquote being broken is an arc to address... libc::fork being mismanaged is another arc... 211 gave us the tooling - it is not closed until its tooling is proven to assist - we think it does - we do not know that it does until it does"*

### The doctrine extension

**Tooling-proven-by-use** — a tooling arc cannot close on shipped-code alone. It must remain OPEN until downstream consumer arcs have:
1. Used the tooling for real work
2. Inscribed in their SCORE/INSCRIPTION whether/how the tooling assisted
3. Closed honestly

Only then does the tooling arc close, with evidence in hand that its work was load-bearing for real fixes.

### Why this matters

The drift-form being prevented: "we shipped tooling = tooling works = arc done." That's the same template-thinking that produced the dup-removal incident (we shipped what looked like a cleanup; turned out load-bearing; broke 9 tests). Closure-by-shipped-code is the version of that pattern applied at the arc level.

`feedback_assertion_demands_evidence` applied to arc closure itself:

| Layer | "we think" version (rejected) | "we know" version (accepted) |
|---|---|---|
| Code | "we wrote it correctly" | "tests prove it correctly" |
| Substrate primitive | "the type signature looks right" | "consumers use it correctly" |
| **Tooling arc closure** | **"the tooling is shipped"** | **"downstream arcs proved the tooling load-bearing"** |

The pattern recurses upward. Substrate-as-teacher cascade applied to arcs: a tooling arc TEACHES by enabling downstream work; we can only declare it taught-something when something has been-taught-by-it.

### Concrete application — arc 211 blocked on arc 212 + arc 213

- **Arc 212** — runtime quasiquote substitution inside Vector<WatAST> constructor. Fixes t6. Uses arc 211b's panic-EDN diagnostic to scope precisely from the visible failure: `<entry>:11:61: unknown function: :wat::core::unquote`. When arc 212's SCORE inscribes "the EDN told us where to look," that's validation.
- **Arc 213** — libc::fork mismanagement under workspace pressure. Investigates probe_lifeline_pipe_proof's flake. Validates either: arc 211's tooling helped (if a panic surfaced) OR identifies a gap in arc 211's tooling for pure-hang cases (also load-bearing — informs future tooling).

When both close, arc 211 closes with proof in hand.

### Generalization to future arcs

Any future arc whose work is "build tooling" should adopt this discipline:
1. Inscribe in DESIGN that closure is contingent on N downstream consumers
2. Either name the consumers up-front (preferred) OR keep arc open until enough consumers materialize naturally
3. Closure SCORE references the consumer SCOREs as validation evidence
4. INSCRIPTION names the load-bearing role demonstrated by use

This isn't deferral. The tooling code IS shipped (arc-211 closure-condition #1 met). The arc stays OPEN to track validation, not because work remains. This is honest:
- "shipped" ≠ "validated"
- "validated" requires evidence
- Arc closure inscribes validated work

### Cross-references

- INTERSTITIAL § 2026-05-17 (post-arc-203-spawn) "Convergences" — the substrate convergence pattern (different layer; same energy)
- INTERSTITIAL § 2026-05-18 (latest) "Wretches And Kings" — REFUSAL (the practitioner refusing to ship dishonest framings; this discipline is the next layer down — refusing to declare validated)
- INTERSTITIAL § 2026-05-18 (latest) "When They Come For Me" — DISCERNMENT (the faculty of judging what's actually true; this is the faculty applied to the meta-question "is this arc done?")
- `feedback_assertion_demands_evidence` — the doctrine root
- `feedback_no_known_defect_left_unfixed` — sibling discipline
- `feedback_any_defect_catastrophic` — sibling discipline
- arc 211 DESIGN § "Tooling-proven-by-use closure condition" — the concrete application

### User's voice

> *"we only close an arc if its done done"*

> *"211 gave us the tooling - it is not closed until its tooling is proven to assist - we think it does - we do not know that it does until it does"*

Preserved. The principle is now inscribed at the substrate's doctrine layer. Future tooling arcs adopt this shape by default; future orchestrators apply this discipline at every "is the arc done?" moment.

**Closure-by-shipped-code is template thinking. Closure-by-validated-by-use is honest.**

---
