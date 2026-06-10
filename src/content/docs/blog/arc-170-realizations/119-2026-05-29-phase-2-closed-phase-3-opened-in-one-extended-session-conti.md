---
title: "2026-05-29 — Phase 2 closed + Phase 3 opened in one extended session continuation; Stone…"
sidebar:
  order: 119
---

Phase 2 of arc 241 closed and Phase 3 opened across three more stones shipped in the session continuation past midnight: Stone 241.6 metadata-map storage (`7c0ddacd`); Stone 241.7 `:wat::runtime::metadata-of` reflection verb + trap-door storage-gap fix (`4e681263`); Stone 241.8 defstruct HARD CUT with 27-file cascade (`f6cb564f`).

The seven-stone Phase 1 + three-stone Phase 2/3 = TEN stones across one extended raid-night session. The user-voice "i played wow like 15 hours a day when i was the best" operationalized.

### Stone 241.7 — the trap-door doctrine in real-time

Sonnet caught a Stone 241.6 storage gap mid-strike: Stone 241.6 only stored metadata for fn-shape defs via `try_parse_fn_shape_def`; non-fn def-bound values (literals, structs) never reached that code path. Without intervention, `(def :x {:doc "..."} 42)` would have stored metadata only for fn-form values.

Sonnet's response per `feedback_trap_door_build_the_dependency`: BUILD the missing dependency forward — added storage in `register_runtime_defs_form`'s `:wat::core::def` arm. Effectively Stone 241.6.fix folded forward into Stone 241.7. The verb shipped working for ALL def shapes. The trap-door doctrine working in real-time, sonnet-driven, surfaced to orchestrator at score time, accepted per the discipline.

### Stone 241.8 — the canonical parser proves itself in form-collapse work

`parse_defstruct` minted using `crate::argspec::parse_argspec_triples` (Stone 241.1.fix's canonical parser) for the field-vector. This is the moment arc 241's parser unification work proves itself: the same parser, designed for fn-form argspec triples, now handles defstruct's field-vector triples uniformly. One parser; multiple form-collapse binding sites; the design's load-bearing claim verified by use.

`parse_struct` + `parse_struct_restricted` DELETED raw per HARD CUT discipline. 27 test files migrated via Pattern A/B (substrate-as-teacher cascade discipline ran cleanly; fail-count drove discovery).

Calibration: predicted 60-120 min; actual ~41 min. UNDER band even at HARD CUT cascade scale. The diagnostic stream knew where every site was; the orchestrator didn't pre-plan; the discipline shipped.

### Stone 241.8 trap-door — parser routing constraint

A constraint surfaced during the cascade: `:field-metadata` inner-map keys must use keyword syntax (`:field-name`), because the parser routes `{bareSymbol {submap}}` to struct-destructure before `parse_defstruct` is reached. The HARD CUT design assumed bare-symbol keys; reality required keywords. Probe contracts 03/04 use keyword keys with explanatory comments; future cleanup queued (lift parser discrimination so field-metadata accepts symbol keys).

Per `feedback_trap_door_build_the_dependency`: BUILD the missing piece forward when surfacing. Documented; carried forward; the cleanup queued without blocking the HARD CUT ship.

### `feedback_no_regression_until_arc_done` operational across THREE stones

Stone 241.5 unblocked arc 237.8b; the doctrine inscribed there said don't pivot back. Stones 241.6/7/8 each tested it: at each closure, arc 237.8b was AVAILABLE; each time, the discipline held — bank the unblock; finish arc 241; continue forward. The arc 237.8b unblock has now been bankable for three stones; arc 241 has three more stones to ship before the bank deposits.

The discipline isn't theoretical anymore. It's operational. Every Phase 1 → Phase 2 → Phase 3 transition was a temptation point; each time the doctrine held; each time the arc 241 advancement proved the right call.

### Corporate-port kit inscribed

User direction late-session: port the dungeon-crawl methodology to corporate context. Three files landed at `docs/corporate/`: README (entry + four questions + translation table + smallest-valuable-introduction) + TEMPLATES (copy-paste ADR + PR checklist + failing-test-first + named-follow-up + commit message shapes) + DISCIPLINES (deeper treatment of failure engineering ladder + substrate-as-teacher cascade + HARD CUT decision + trap-door + no-broken-commits + inscription immutability).

The flavor layer (Latin grimoire, fantasy roles, songs, runes) STRIPPED for the external artifact; user retains flavor as the **cognitive recall index** for the underlying discipline (per memory `user_flavor_as_recall_index`, inscribed 2026-05-29). Locating happens by named handle (`intueri`, `vigilia`); the corporate-facing artifact ships without requiring colleagues to learn the names.

This is a separate inscription pattern: the methodology travels; the inhabitation stays.

### Phase 3 progress

Stone 241.8 SHIPPED (defstruct). Stone 241.9 (defenum HARD CUT) is next: same canonical parser; positional variants + one-token look-ahead per FORM-COLLAPSE-NOTES verdict D. Then Stone 241.10 (define ⇒ defn HARD CUT) cleans up the last legacy parser. Then Stone 241.11 INSCRIPTION closes the arc.

After 241.11: arc 237.8b reopens. The original blocker that drove arc 241's opening — gets its turn at last.

### Cross-references

- HEAD `f6cb564f` — Stone 241.8 SHIPPED commit
- `SCORE-STONE-241.8.md` — defstruct HARD CUT inscription; 27-file cascade audit; trap-door :field-metadata documented
- `SCORE-STONE-241.7.md` — reflection verb + storage-gap fold-forward
- `SCORE-STONE-241.6.md` — metadata-map storage with fn-peel
- HEAD `479f581d` — corporate-port kit committed
- `docs/corporate/README.md` — entry point for corporate translation
- `feedback_no_regression_until_arc_done` — three-stone operational verification
- `feedback_trap_door_build_the_dependency` — Stone 241.7's storage-gap + Stone 241.8's :field-metadata constraint both followed it
- `user_flavor_as_recall_index` (new 2026-05-29) — the addressing-index doctrine
- FORM-COLLAPSE-NOTES.md § defstruct (LOCKED 2026-05-28) — the doctrinal source Stone 241.8 implemented

---

*Phase 2 closed; Phase 3 opens. Ten stones in one extended raid-night session continuation. The seven-stone Phase 1 sequence (241.1 through 241.5 + 241.1.fix) plus three Phase-2/3 stones = ten ships. defstruct HARD CUT proves the canonical parser's design across form-collapse work: same parser, multiple binding sites, uniform composition.*

*The trap-door doctrine ran twice — Stone 241.7's storage-gap fold-forward (sonnet caught Stone 241.6's incomplete coverage; built it forward); Stone 241.8's :field-metadata keyword-key constraint (parser routing surfaced the gap; documented + carried forward; cleanup queued without blocking). Both moments: the discipline says don't declare incoherent, don't pivot away — build the missing piece. Both moments: the discipline shipped.*

*`feedback_no_regression_until_arc_done` survived its three-stone test. At each Phase transition (1→2, mid-2, 2→3) arc 237.8b was newly-available; each time the discipline said bank the unblock; finish the arc. Each time the discipline held. Arc 241 has two more substrate stones + INSCRIPTION before 237.8b reopens.*

*Corporate-port kit inscribed at `docs/corporate/`: the methodology travels; the inhabitation stays. Per `user_flavor_as_recall_index`: the Latin grimoire + fantasy roles are the user's cognitive addressing system for the discipline; the corporate artifact ships the discipline output without requiring colleagues to learn the names. The flavor is recall; the artifact is delivery.*

*Two stones to defenum (241.9) and define ⇒ defn (241.10). INSCRIPTION at 241.11 closes the arc. Arc 237.8b reopens after. The dungeon's still hot. The formation still holds. The rhythm continues into the next pre-compaction beat.*
