---
title: "2026-05-28 evening (cont.) — Stone 241.5 SHIPPED; PHASE 1 TRULY CLOSED; Gate 1 GREEN end…"
sidebar:
  order: 122
---

Stone 241.5 closed at HEAD `639b4862`. Phase 1 of arc 241 is **TRULY CLOSED** — the canonical parser shape (241.1-241.4) PLUS the runtime dispatch (241.5) PLUS the integration verification (probe 237.8b Gate 1: `1+2+3+4 = 10` via `& rest-binder fold`, confirmed end-to-end). Defclause now has full `&` rest-binder semantics — parser, storage, dispatch, integration all live.

The seven-stone arc:

```
  241.1     Mint canonical parse_argspec_triples          (1f674194)
  241.1.fix Vigilia amends + scope correction (user Y)    (b6b290b0)
  241.2     A1+A2+A3 fn-parser migration                  (21877135)
  241.3     A4 defclause migration; Phase 1 closure       (b0b5d11d)
  241.4     Phase 1 capstone: rest-binder + opt-in        (843a83d0)
  241.5     Runtime dispatch + Gate 1 GREEN               (639b4862)
```

**Arc 237.8b** unpauses — the original blocker that drove arc 241's opening (seven stones ago). The recipe-lock + Gates 2-4 + mint-confirmers can proceed. **But we do not pivot back.**

### The new doctrine: `feedback_no_regression_until_arc_done`

At Stone 241.5 closure — arc 237.8b just unblocked; tempting to pivot directly to the recipe-lock work that drove arc 241's opening — user inscribed:

> *"we do not regress until the arc is done - we only unwind when we have finished what we started - if we find more - we pivot forward until its done"*

This is sharper than `feedback_spawn_block_winding` (which says child arcs must close before parent closes) — this extends to the ARC level: even arcs that you previously waited for, even arcs you JUST UNBLOCKED, do not earn your pivot until the current arc closes. The unblock is BANKABLE. Finish what you started; pivot forward into new requirements DISCOVERED mid-arc; do not unwind to a sibling.

Arc 241 has FIVE more stones to ship before close: 241.6 (metadata-map storage) → 241.7 (metadata-of reflection) → 241.8 (defstruct HARD CUT) → 241.9 (defenum HARD CUT) → 241.10 (define ⇒ defn HARD CUT) → 241.11 (INSCRIPTION). Arc 237.8b reopens AFTER 241.11. The discipline.

Per `feedback_trap_door_build_the_dependency`: build forward; never declare incoherent OR unwind. The new doctrine sharpens the unwind side: even legitimate-looking sibling-arc opportunities are unwind-shaped if they pull from the current arc's completion path.

Inscribed at `feedback_no_regression_until_arc_done` (the rule body + Why + How to apply per memory protocol). Linked to spawn-block winding + trap-door + momentum-ordering as the kin doctrines.

### Stone 241.5 calibration capture

- Predicted 20-40 min Mode A → actual ~10 min sonnet
- Probe perfect FM 2-bis: 3 PASS / 5 FAIL at HEAD with `UnboundSymbol("rest")` at body-eval time (the body referenced `rest` but the dispatcher didn't bind it — the gap was exactly where the substrate needed it to be)
- Vector construction: ONE LINE (`Value::Vec(Arc::new(rest_vals))` using the existing `wat::core::Vector` collection variant, NOT a new HolonVector ctor; STOP-6 budget intact)
- Check-layer integration: 12 lines vs ~10 budget (20% over; honest delta surfaced; mechanical bool-flag plumbing through 4 sites; accepted per four-questions on the close-the-named-follow-up scope — the work was scope-completion, not scope-creep)
- Gate 1 GREEN: `1+2+3+4 = 10` confirmed; the substrate is honest end-to-end
- Zero lib test cascade (consistent with Stone 241.2/3/4 calibration)
- Per spawn-block winding (with the new sharpening): Stone 241.4's NAMED follow-up CLOSED in this stone; the deferred-with-name-reference shape from FM 11 worked exactly as designed

### The named-follow-up doctrine validated

Stone 241.4's commit re-ignored Gate 1 with `#[ignore = "...Stone 241.5..."]` — explicit follow-up by stone number AND substrate change. Per FM 11: deferrals must NAME the follow-up. Per `feedback_no_pre_existing_excuse`: don't deflect. The named follow-up is the substrate-grade promise.

Stone 241.5 CLOSED that promise. The `#[ignore]` reason cited "Stone 241.5"; Stone 241.5 shipped; Gate 1 is now active and green. The doctrine round-trips cleanly: named deferral → named-stone delivery → integration verified → the promise discharged.

This is the discipline that distinguishes "honest deferral" from "deferred to a future arc when X surfaces" (the FM 11 rejection language). Honest deferral with NAMED follow-up + INTEGRATION TEST is structurally sound. The deferral language alone fails; the language plus the named-follow-up plus the test-driven promise discharge succeeds.

### The rhythm holds — WoW-15-hour-grind doctrine operational

User-voice persists from earlier this evening: *"i played wow like 15 hours a day when i was the best - this is no different."* The flow state continues. Stone 241.4's vigilia cycle + 241.5's dispatch wiring + the named-follow-up discharge — three Phase-1-closure stones across approximately one extended raid-night session. Same identity that ran top-tier MMORPG progression. Same operating mode. Same coordination of mastery loops at scale.

The seven-stone arc (241.1 through 241.5 + 241.1.fix) shipped in ONE EXTENDED SESSION. The rhythm is real and trackable in commit timestamps.

### What Phase 2 looks like (per FORM-COLLAPSE-NOTES verdicts already locked)

Phase 2 opens with Stone 241.6: optional `{...}` HashMap metadata-map clause on `def` (defn inherits via the existing `def` + `fn` macro expansion). The mechanism:

```
(def :name {metadata-map} value-expr)
(defn :name {metadata-map} [argspec] body)
(defstruct :name {form-metadata + :field-metadata {...}} [field-vector])
```

Per `FORM-COLLAPSE-NOTES.md`:
- Discrimination at parse: `{...}` = metadata; `[...]` = argspec / fields; anything else = value-expr
- No backtracking; one-token look-ahead suffices
- Empty `{}` illegal; unknown keys parse-error (or runtime-error per design)
- Uniform composition at form-level AND per-binding (`:field-metadata`/`:variant-metadata`)

Stone 241.6 = STORAGE (def parser accepts + persists metadata). Stone 241.7 = REFLECTION (`:wat::runtime::metadata-of` reads it). Stone 241.8/9/10 = HARD CUTS (defstruct/defenum/define-retirement). Stone 241.11 = INSCRIPTION.

### Cross-references

- HEAD `639b4862` — Stone 241.5 SHIPPED; Phase 1 TRULY CLOSED
- `SCORE-STONE-241.5.md` — runtime dispatch wiring; Gate 1 GREEN; honest delta on check-layer 12-vs-10 budget
- `SCORE-STONE-241.4.md` § Vigilia Convergence — the named-follow-up deferral that Stone 241.5 discharged
- `tests/probe_arc237_8b_defclause_arithmetic.rs` Gate 1 — `1+2+3+4 = 10` via `& rest-binder fold`; integration verification end-to-end
- `feedback_no_regression_until_arc_done` (NEW, 2026-05-28 evening) — the doctrine inscribed at this moment; arc-level extension of spawn-block winding
- `feedback_spawn_block_winding` — kin doctrine at the child-arc level
- `feedback_trap_door_build_the_dependency` — kin doctrine; build forward, never unwind
- `feedback_momentum_ordering` — kin doctrine; finish path you're on
- `feedback_no_pre_existing_excuse` + FM 11 — the named-follow-up shape Stone 241.4's deferral honored + Stone 241.5 discharged
- `FORM-COLLAPSE-NOTES.md` — Phase 2/3 design locked; metadata-map mechanism + defstruct/defenum/define-retirement decisions
- `INTERSTITIAL-CLIFFNOTES.md` § Currently — refreshed to reflect 241.5 SHIPPED + 241.6 NEXT + the no-regression-until-arc-done direction
- User-voice 2026-05-28 evening (verbatim): *"we do not regress until the arc is done - we only unwind when we have finished what we started - if we find more - we pivot forward until its done"*

---

*Phase 1 of arc 241 is TRULY closed. The seven-stone arc shipped in one extended session. The canonical parser's first-release shape complete (241.1-241.4); runtime dispatch wires the storage (241.5); Gate 1 confirms the substrate honest end-to-end. Defclause has full `&` rest-binder semantics.*

*Arc 237.8b unpauses — but we do not pivot. The new doctrine "no regression until arc done" sharpens spawn-block winding to the arc level: bank the unblock; finish what you started; pivot forward into new requirements within the current arc; do not unwind to a sibling even when the sibling has been waiting for this exact moment. The discipline distinguishes honest deferral with named follow-up from arc-fragmentation.*

*The named-follow-up doctrine round-tripped cleanly: Stone 241.4 deferred with `#[ignore = "...Stone 241.5..."]`; Stone 241.5 cited the same number in its commit message; the promise discharged; the integration test went green. The FM 11 shape works when the follow-up is named AND the test-driven discharge ships.*

*The WoW-15-hour frame persists. Same identity. Same mastery loops. Same flow state across a seven-stone session. Phase 2 opens. Stone 241.6 brings the metadata-map mechanism online; Stone 241.7 mints the reflection verb; Stones 241.8/9/10 are HARD CUTS clearing legacy surface; Stone 241.11 inscribes. Five more stones before the arc closes. The dungeon's hot. The formation holds. The rhythm continues.*
