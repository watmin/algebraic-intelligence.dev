---
title: "2026-05-29 (late) — Stone 241.11 SHIPPED: Phase 3 CLOSES; the bandaid-rip-with-receipts …"
sidebar:
  order: 124
---

Stone 241.11 closed Phase 3 of arc 241. The LARGEST cascade in arc 241 (~271 sites — 8× any prior stone) bowed to a SINGLE LINE appended to `RETIREMENT_TABLE`. Stone 241.10's apparatus (shipped after 6 rounds of vigilia remediation to MAXIMAL bar) DID ITS JOB at production scale. Every `:wat::core::define` typo'd or stale form from this hour forward surfaces *"did you mean: :wat::core::defn [retirement replacement]"* automatically — zero additional Display work; zero new remedy mechanism; the apparatus shipped at 241.10 absorbed the entire downstream teaching responsibility.

Mode A. Runtime ~98 min (UNDER 120-240 predicted band; smashed prediction despite context boundary mid-flight + cascade adaptations + shorthand-FQDN tactical recovery + 2 trap-door pivots). 226 files changed; +7957/-9158 net **-1201 lines deletion**. HARD CUT discipline at scale — the substrate gets SMALLER with each Phase 3 stone; the discipline ratchets cleaner.

### The bandaid-rip with receipts: from prophecy to production

Songs #41 The Mission and #42 The Remedy were inscribed AT Stone 241.10's mint as prophecy — the substrate WOULD teach with receipts. Song #43 Into Oblivion was inscribed at the meta-event recognition (THE THIRD BAR CROSSED). Song #44 Momma Sed was inscribed as wisdom from the 6-round vigilia remediation. **Stone 241.11 is the prophecy made operational.** The apparatus that 241.10 staked, named, shipped, and earned-remarkable now does its job at 271 sites without further intervention.

The single load-bearing change: `src/remedy/retirement.rs` line 49:
```rust
(":wat::core::define",            ":wat::core::defn"),
```

That ONE LINE — combined with check.rs's HARD-CUT-rejection arm calling `remedies_for(k, std::iter::empty())` — produces the structured `[retirement replacement]` remedy in every error message for any future caller who types `define`. The substrate self-documents its evolution. The apparatus is FOUNDATIONAL.

### The seven layers of substrate-as-teacher discipline operational this stone

Stone 241.11 exercised the substrate-as-teacher discipline at SEVEN distinct recursion layers simultaneously. Each layer is the same shape (substrate refuses → practitioner adapts) operating at a different level of the work:

| Layer | Substrate teaches | Practitioner adapts |
|---|---|---|
| 1 | User (compile errors) | User fixes code |
| 2 | LLM (cascade migration via diagnostic stream) | LLM iterates per-site fixes (Stone 241.9 precedent) |
| 3 | LLM what to BUILD (auto-fixer election from cold-read) | LLM mints ephemeral tool from substrate's uniformity (Stone 241.10 precedent) |
| 4 | Orchestrator's verification protocol (vigilia must fire independently) | Orchestrator casts spells via subagents, doesn't trust self-report (Stone 241.10 6-round remediation; Song #44 wisdom-inheritance) |
| 5 | LLM how to debug its own tool (Lisp parser paren-tracker via substrate refusal) | LLM iterates fix tool against parser diagnostics — *user-observed mid-strike: "its writing its own lisp fixer"* |
| 6 | LLM that lib-test gate hits known-leakers (process-leak family) | LLM adapts verification strategy; user kills stalled procs (arc 170 substrate ground) |
| 7 | LLM that shorthand `:i64` types are invalid; must FQDN `:wat::core::i64` (closed type universe earning at runtime) | LLM expands shorthand to FQDN across cascade — 59 → 6 → 0 failures (user observed: "this is wild to watch") |

**Each layer is the same discipline operating at a different rung.** Layer 1 has operated since the beginning of programming languages. Layer 2 is the substrate-as-teacher doctrine codified at `docs/SUBSTRATE-AS-TEACHER.md`. Layer 3 was discovered at Stone 241.10 (the third-bar milestone). Layer 4 was inscribed via Song #44's wisdom-inheritance. Layers 5/6/7 surfaced THIS HOUR during Stone 241.11's strike.

The doctrine is no longer ABOUT cascade migration. The doctrine is THE SHAPE OF WORK WITH THIS SUBSTRATE — substrate refuses; practitioner adapts; iteration ratchets; discipline forward-propagates. Every layer of the work hears the same refusal in its own register and adapts in its own voice. The Tandemonium (Song #44 subtitle) was correct — multi-voice teaching at multiple layers simultaneously. The choir grew this stone.

### The auto-fixer pattern locks at TWO stones — substrate doctrine, not experiment

Stone 241.10 surfaced the auto-fixer election unprompted (sonnet's fresh-boot cold-read). Stone 241.11 absorbed it INTO THE BRIEF as explicitly pre-authorized strategy. Two stones; one pattern; LOCKED:

**The bandaid-rip-with-receipts protocol (Stone 241.10 minted; Stone 241.11 proved):**
1. Append one line to `RETIREMENT_TABLE` in `src/remedy/retirement.rs`
2. Mint one HARD-CUT-rejection arm in `src/check.rs` calling `remedies_for(k, std::iter::empty())`
3. Build ephemeral `crates/fix-<retired-form>/` standalone Rust tool (no `wat` dependency)
4. Run auto-fixer on the cascade
5. Manually fix residuals
6. **DELETE the auto-fixer crate before commit** (substrate stays clean)
7. Substrate teaches every future caller via structured remedy automatically

Future form retirements consume this pattern. No new substrate work; no new Display work; no new remedy mechanism. The single-line append + one HARD-CUT arm + one ephemeral tool produces structured teaching at every friction moment forever.

**This is the substrate-as-teacher discipline reaching its operational form.** The teaching is no longer per-stone customization; it is DELEGATED to the apparatus shipped at Stone 241.10. The discipline writes the future BRIEFs.

### Trap-door doctrine vindicated again — two pivots absorbed in-stone

Per `feedback_trap_door_build_the_dependency`: when a current change reveals a substrate gap, BUILD the missing piece. Sonnet shipped TWO trap-door fixes within Stone 241.11 — not deferred, not declared incoherent, not framed as out-of-scope:

**T6 — resolve.rs dispatch-head fix.** Before Stone 241.11, `:wat::core::define` bodies were consumed by `register_defines` (now deleted) and never walked by the resolver at step 7. After migration to `defn`, bodies stay in residue AND are walked at step 7. Dispatch-registered heads (`:h::describe`, `:h::mix-count`) inside defn bodies got rejected because `is_resolvable_call_head` didn't check `sym.dispatch_registry`. Sonnet added a dispatch-registry check before the macro call check. Two `probe_declaration_form_lift` tests recovered. The substrate's resolver got HONESTLY MORE COMPLETE because Stone 241.11 surfaced what it was missing.

**T-argspec — stdlib variadic forms broke after auto-fixer migration.** The auto-fixer generated syntactically broken argspec `[_a <- & xs <- :T]` and `[first <- :T _b <- & xs <- :T]` (placeholder symbols `_a`/`_b` had no type annotations before `&`). Two fixes shipped together:
- `core.wat` argspec correction: removed spurious placeholders; correct forms `[& xs <- :T]` (0-fixed + rest) and `[first <- :T & xs <- :T]` (1-fixed + rest)
- `try_parse_variadic_def_fn_form` in `src/runtime.rs`: new sister function to `try_parse_fn_shape_def` that detects rest-binder forms and calls `parse_argspec_triples` with `allow_rest_binder: true`

The variadic stdlib functions (`i64::+`, `i64::*`, `i64::-`, `i64::/`, `f64::+`, `f64::*`, `f64::-`, `f64::/`) were re-registered cleanly. `probe_arc237_stone2_defclause_substrate` 12/12 PASS (was 5 FAIL before these fixes). The substrate's variadic parsing path got HONESTLY MORE COMPLETE because Stone 241.11 surfaced what it was missing.

**Both trap-door fixes were absorbed within the stone's runtime.** Per the trap-door doctrine — the dig that finds the constraint is good; the verdict that it's immovable is the failure. Sonnet didn't declare either issue out-of-scope; both became part of Stone 241.11's substrate ship.

### Convergence #18-or-#19 candidate (provisional) — Lisp tradition catches its own students

Stone 241.11 surfaced what may be a separate convergence room from Stone 241.10's two candidates (Lisp condition-system + LLM-programmable-substrate):

**Lisp tradition catches its own students by giving them the diagnostic they need to debug their first homoiconic transformer.** Sonnet wrote a Lisp source-to-source rewriter (the `crates/fix-defines/` auto-fixer); the rewriter ate a paren during transformation; wat's parser caught the error with `unclosed '(' at wat/holon.wat:92:1`; sonnet read the diagnostic and iterated on its own paren tracker. This is **Lisp's classical pedagogy** — the language teaches source-to-source transformation by REFUSING malformed output. wat as a typed Lisp inherits this teaching capability.

The recursion: substrate teaches the substrate-modifying tool by refusing its output; tool author iterates; tool fixes the cascade; cascade closes; the substrate that started teaching the tool now teaches the future practitioners who read the tool's output. **The teaching chain is closed.** Every Lisp practitioner who ever wrote a homoiconic transformer has hit this same lesson via parser refusal. Sonnet (fresh-boot, no Lisp in training) walked into the same lesson via wat's parser. Independent arrival.

This is a third convergence candidate from arc 241's later stones (Lisp condition-system + LLM-programmable-substrate + Lisp-tradition-catches-students). Numbering deferred to Stone 241.12 INSCRIPTION's reconciliation pass.

### Phase 3 closes: the 5-stone arc that built the substrate's teaching apparatus

Phase 3 of arc 241 was form-collapse + def*-prefix family + retirement. It spanned 5 stones:

| Stone | Substance | Phase 3 contribution |
|---|---|---|
| 241.7 | metadata-map storage for def | substrate-level binding metadata mechanism |
| 241.8 | defstruct HARD CUT | proved canonical parser + HARD CUT pattern |
| 241.9 | defenum HARD CUT | proved positional-grammar + parse_field retirement |
| 241.10 | src/remedy/ + ranked-remedy schema | minted the teaching apparatus + 6-round vigilia remediation to MAXIMAL bar |
| 241.11 | define HARD CUT | proved the apparatus at production scale (271 sites; bandaid-rip-with-receipts) |

The 5 stones form a coherent arc: discover the pattern (241.7-9) → MINT the apparatus (241.10) → PROVE the apparatus (241.11). Stone 241.12 (INSCRIPTION) closes arc 241 by documenting what was learned, what doctrines emerged, what convergences arrived.

### Songs #41-#44 from prophecy to operational

| Song | Title | Inscribed at | Operational at |
|---|---|---|---|
| #41 | The Mission (M is for Milla Mix) | Stone 241.10 mint (claim staked) | Stone 241.11 (claim operational) |
| #42 | The Remedy | Stone 241.10 mint (apparatus named by literal name) | Stone 241.11 (apparatus shipping receipts at 271 sites) |
| #43 | Into Oblivion | Stone 241.10 meta-event (third-bar recognition) | Stone 241.11 (third-bar capability used in the BRIEF; auto-fixer pre-authorized) |
| #44 | Momma Sed (Tandemonium Mix) | Stone 241.10 6-round vigilia closure (wisdom inherited) | Stone 241.11 (wisdom carried into BRIEF + sonnet's independent gate-handling per layer 4-7 of substrate-as-teacher) |

The songs were prophecy at Stone 241.10's mint hour; Stone 241.11 is the operational confirmation. Each song's facet did its work this stone:
- #41 *our turn to decide who lives and who dies*: define got cut; defn lives
- #42 *we have the remedy / but we have your remedy*: every retired form's caller gets their specific tailored ranked remedy
- #43 *the watcher outside the frame brings truth*: sonnet's cold-read auto-fixer instinct was sanctioned in the BRIEF, not feared
- #44 *take it like a man / this too shall pass*: 7 layers of substrate-as-teacher discipline absorbed including process-leak and shorthand-FQDN cascade — the substrate pounded; sonnet took it; the pain passed; the cascade closed

### Stats locked

- 226 files changed, +7957/-9158 net -1201 lines
- 271 sites migrated (cascade; auto-fixer + manual residuals)
- 5/5 probe PASS; 890/0 lib; 12/12 arc 237 stone 2 (recovered from 5 FAIL via trap-door T-argspec fix)
- Clippy 902 at exact ceiling (sonnet measured 885 at their checkpoint; either way ≤902 gate)
- `crates/fix-defines/` ephemeral lifecycle complete (built → used → DELETED before commit)
- Arc 146 `:wat::core::define-dispatch` machinery PRESERVED (D4 critical disambiguation honored)
- Stone 241.10 probe + Stone 241.1-9 probes + arc 237/238 probes preserved

### What's next

**Stone 241.12 — INSCRIPTION closes arc 241.**

The pre-INSCRIPTION grep (per FM 11 + Stone S11 of recovery doc) is the discipline checkpoint. The INSCRIPTION is orchestrator-direct per `feedback_sonnet_no_realization_voice` (realization-voice content; not sonnet's territory). The INSCRIPTION captures:

- 11 stones across 4 phases
- The bandaid-rip-with-receipts doctrine now operational
- The THE THIRD BAR CROSSED milestone
- The vigilia-must-fire-from-orchestrator-independently lesson (Song #44 wisdom)
- The auto-fixer ephemeral discipline (build → use → delete)
- The seven layers of substrate-as-teacher discipline operational
- Songs #41/#42/#43/#44 prophecy-to-operational arc
- Convergence candidates (Lisp condition-system; LLM-programmable-substrate; Lisp-tradition-catches-students) for numbering reconciliation

Predicted band: 30-60 min Mode A (orchestrator-direct paperwork; no substrate edits).

**After 241.12 INSCRIPTION**: arc 237.8b reopens per `feedback_no_regression_until_arc_done`. The discipline that kept it waiting through eleven 241.x stones now releases the bank. The substrate is cleaner by ~1200 lines net deletion across Phase 3 alone; the teaching apparatus is foundational; the bandaid-rip-with-receipts pattern is the future of HARD CUT discipline.

The rhythm holds. The disk holds it. The Tandemonium continues.

---

*The bandaid-rip with receipts is operational. The apparatus shipped at Stone 241.10 absorbed the entire downstream teaching responsibility for ALL future form retirements. Every `:wat::core::define` typo'd or stale at any future moment surfaces "did you mean: :wat::core::defn [retirement replacement]" — without one additional line of Display code, ever again. The single-line append + one HARD-CUT arm + one ephemeral tool produces structured teaching at every friction moment forever.*

*Seven layers of substrate-as-teacher discipline operated simultaneously this stone. The discipline is no longer ABOUT cascade migration. The discipline is THE SHAPE OF WORK WITH THIS SUBSTRATE — substrate refuses; practitioner adapts; iteration ratchets; discipline forward-propagates. The Tandemonium is the choir — multi-voice teaching at multiple layers simultaneously.*

*The auto-fixer pattern locked at two stones. The bandaid-rip-with-receipts protocol is now substrate doctrine. Future form retirements consume this pattern. The teaching writes the future BRIEFs.*

*Two trap-door pivots absorbed within the stone (resolve.rs dispatch-head check; try_parse_variadic_def_fn_form + core.wat argspec correction). The substrate got honestly more complete because Stone 241.11 surfaced what it was missing. The trap-door doctrine — the dig that finds the constraint is good — vindicated again.*

*Lisp tradition catches its own students by refusing their malformed output. Sonnet (no Lisp in training) walked into the same lesson via wat's parser. Independent arrival. Convergence-with-self at the homoiconic-transformation layer. A new convergence candidate.*

*Phase 3 closes. 11 stones; 4 phases; one arc. Songs #41 to #44 from prophecy to operational. The substrate is cleaner by ~1200 lines net. The teaching apparatus is foundational. The discipline survives the rhythm; the rhythm survives the discipline.*

*Stone 241.12 INSCRIPTION is next. Arc 237.8b waits its final hour.*
