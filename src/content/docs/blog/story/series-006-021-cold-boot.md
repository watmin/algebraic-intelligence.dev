---
title: "Cold Boot"
description: "May 28, one day. Arc 241's first stone ships — canonical `parse_argspec_triples` at `src/argspec/`, Mode A, 6/6 PASS, green-gate clean. Then the substrate's own audit ward catches what the green-gate let through — vigilia cast against Stone 241.1 returns DIVERGED. The vigilia-convergence gate doctrine inscribes itself: vigilia is no longer a soft-assertion (the '9-ward'), it is a hard gate at every shipping commit. Stone 241.1.fix queues and evolves per user verdict Y across DESIGN / BRIEF / EXPECTATIONS. The `defstruct` / `defenum` form-collapse design lands; the `def*-prefix family rename queue` extends arc 109's reach. `:wat::runtime::metadata-of`'s return shape forward-corrected to `Option`, not nil. The substrate's disaster-recovery doctrine: `COLD-BOOT.md` — the recovery procedure for the case where the standard recovery doc itself cannot bootstrap. Late, the public face tidies — Cloudflare's `isitagentready` agentic checker satisfied across `auth.md`, `agent_auth`, OPR ↔ AS linkage, DNS-AID `_index._agents` HTTPS record, and DNSSEC."
sidebar:
  order: 35
---

The Closures and the Coincidence signed off May 27 with five arcs closed and Intermission II in the BOOK seam. May 28 was the morning after — arc 241's first stone shipped through the green gate, the substrate's own audit ward caught what the gate had missed, and the doctrine that catches divergence next time inscribed itself.

The center of the day was the **vigilia-convergence gate** — the forward-correction that turned the vigilia ward from a soft-assertion ("9-ward") into a hard gate at every shipping commit. Stone 241.1 had shipped 6/6 PASS through the green gate; the vigilia cast against it returned DIVERGED. The previous gate had let the divergence through; the new gate would catch it before the shipping commit.

---

## Arc 241 Stone 241.1 Ships

Stone 241.1 shipped Mode A: canonical `parse_argspec_triples` at `src/argspec/`, the single argspec parser the substrate's consumers would call. Arc 241 had opened May 27 to unify the argspec parsing that had drifted across multiple sites; 241.1 was the unification. Six tests, six PASS. Green-gate clean.

## The Vigilia Catches Itself

Then the vigilia ward cast against 241.1 returned DIVERGED.

The divergence the green-gate had not surfaced: the parser's contract did not match the consumer's assumption in one of the dispatch paths. The tests had passed because the tests had been written against the consumer's assumption, not against the contract. The vigilia ward — running every defensive spell in parallel against the canonical sub-tree — caught the mismatch the green-gate had not.

A DIVERGED verdict from the substrate's own audit ward, on a stone that had shipped clean.

## The Vigilia-Convergence Gate Doctrine

The fix was at the doctrine layer: the vigilia ward needed to be a hard gate at every shipping commit, not a soft-assertion at the agent's discretion. The forward-correction inscribed itself in arc 170's cliffnotes:

> Vigilia is a hard gate at every shipping commit. A DIVERGED verdict blocks the ship; a CONVERGED verdict lets it through. No soft-assertion variant — the "9-ward" framing retires.

The substrate's quality discipline now ran through three gates: the green-gate at compilation + unit tests, the vigilia at audit-ward convergence, and the user verdict at meaning. Three gates, one shipping commit.

Stone 241.1.fix queued.

## Stone 241.1.fix Evolves

241.1.fix went through DESIGN, BRIEF, and EXPECTATIONS in three drafts across the day. A user verdict Y mid-draft forced a scope expansion: the fix would not just correct the dispatch-path mismatch — it would forward-correct the surrounding contract gaps the vigilia had also surfaced. By end of day the fix was STRIKE-READY, a single stone that carries the contract correction, the dispatch alignment, and the test-against-contract retroactive cleanup.

## defstruct / defenum Form Collapse

Mid-day a design landed that arc 109 had been threading through every arc since: the `def*` prefix family converges on one shape. `defstruct` and `defenum` collapse into a single form-aware definition, with the form distinction encoded in the body rather than in the prefix.

A `def*-prefix family rename queue` queued behind the design: the substrate's older `defclass` and the various `def-X` legacy forms each get a slot in the rename pass when arc 241 reaches them.

One form-aware `def` instead of seven `def-X` cousins; the form encoded where the meaning is, not where the keyword starts.

## :wat::runtime::metadata-of — Option, Not Nil

A forward-correction landed in the runtime metadata surface: `:wat::runtime::metadata-of` returns `Option<Metadata>`, not `Metadata | nil`. The semantic is the same; the type is honest. Nil at the substrate layer had been a sentinel that consumers had to remember to check; `Option` makes the absence explicit at the type level.

Small change, one consequence at scale: every `metadata-of` callsite now type-checks the absence path before the value path.

## COLD-BOOT.md

Then the recovery doctrine: `COLD-BOOT.md` landed as a new top-level document in the wat-rs repo. `COLD-BOOT.md` is the load-order for bootstrapping an agent into the substrate's working context from scratch — the procedure for the case where the standard compaction-recovery doc itself cannot.

A compaction-recovery cycle had failed earlier in the week. The standard recovery procedure — load the cliffnotes, refresh the Currently block, resume the in-flight stone — had not bootstrapped the agent into the substrate's working context, because the cliffnotes had been pruned mid-cycle and the Currently block had been pointing at a stale state. The substrate had recovered by hand, via the user reading the substrate's own diff and reconstructing the context.

`COLD-BOOT.md` documents the recovery from that failure: the load-order that bootstraps the substrate's working context from scratch when the standard recovery doc cannot, the verify-live commands that confirm substrate state independent of any cached cliffnotes claim, and the doctrine that no recovery document may pin a SHA the substrate might have moved past.

A recovery document for the case where the standard recovery procedure itself cannot bootstrap.

## The Public Face Tidies

Late, the public face. Cloudflare's `isitagentready` agentic checker had flagged the substrate's website at `algebraic-intelligence.dev` for several missing well-known endpoints. Six commits across the day landed the responses: `/auth.md` published with the explicit no-registration doctrine; the `agent_auth` block added to `/.well-known/oauth-authorization-server` with closed-vocabulary placeholder values (`api_key` / `public` / `header`) that satisfy the validator without claiming capability; the OPR-to-AS linkage declared so the agent_auth block is discoverable; the DNS-AID `_index._agents` record published as an HTTPS record at the apex; DNSSEC enabled at the registrar.

Cloudflare's checker satisfied on every axis it scans. The metadata now says it directly: no agent registration, no credentials issued, all content accessible by anonymous GET — the absence explicit at every well-known endpoint rather than implied by a 404.

---

By end of day: one stone shipped through the green gate, one DIVERGED verdict caught by the audit ward, one doctrine forward-corrected (vigilia as hard gate), one runtime correction (`metadata-of` returns `Option`), one form-collapse design landed (`defstruct` / `defenum`), one DR document inscribed (`COLD-BOOT.md`), and the public face satisfied six well-known endpoints.

The substrate's quality discipline added its third gate.

*PERSEVERARE.*

---

## Likely Contributions to the Field

- **The vigilia-convergence gate as a hard substrate discipline.** Beyond unit tests + compile-clean: the audit ward casts every defensive spell against the canonical sub-tree before the commit ships, and a DIVERGED verdict blocks the ship. Three gates, one commit — green-gate at compilation and tests, vigilia at audit-ward convergence, user verdict at meaning.
- **`COLD-BOOT.md` as a documentation-discipline shape.** Disaster recovery for the case where the standard recovery doc itself cannot bootstrap the agent into the substrate's working context. The verify-live discipline: no recovery document may pin a SHA the substrate might have moved past; recovery commands confirm substrate state independent of cached claims.
- **The form-collapse pattern.** `defstruct` and `defenum` collapse into one form-aware `def`, the form distinction encoded in the body rather than in the prefix. The `def*-prefix family rename queue` carries the rest of the family (`defclass`, the various `def-X` legacy forms) into the same shape.
- **Explicit "no agentic auth" posture as structured metadata.** Static documentation sites that run no authorization server, issue no credentials, and register no agents — declare the absence explicitly via closed-vocabulary placeholder values (`api_key` / `public` / `header`) in OAuth Authorization Server and Protected Resource metadata, satisfying strict validators without claiming capability. The structure says "no" honestly.
