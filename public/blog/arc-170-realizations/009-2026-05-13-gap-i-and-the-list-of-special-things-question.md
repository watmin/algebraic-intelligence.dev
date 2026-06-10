## 2026-05-13 — Gap I and the "list of special things" question

**User (after Gap H shipped):** *"does this need to be extended for def and defn?"* Then, after the answer pointed at the broader pattern: *"what else is missing from this list?.. when we add defclause later it'll be required?.. what about defmacro?.. how should we manage this list of special things long term?"*

**The substrate-as-teacher diagnostic Gap H left:** `is_prelude_form` (closure_extract.rs:1762) matched 3 of 8 declaration forms — define/struct/enum. The 5 missing — def/defmacro/define-dispatch/newtype/typealias — would each trigger position-discipline errors at fn-body do-prefix despite all being top-level-only by the same constraint.

**Architectural realization:** the substrate already had the source-of-truth list — `is_mutation_form` (freeze.rs:1248). Three drifted lists existed:

| System | Site | Covers |
|---|---|---|
| Mutation-rejection | `is_mutation_form` | ALL 8 declarations + 3 loads + config setters (union) |
| Position-validator | `validate_def_position_with_wrapper` | ONLY `:wat::core::def` |
| Prelude-lift | `is_prelude_form` (Gap H) | 3 of 8 declarations |

One source-of-truth. Two narrower drifted copies. The user's question — *"how should we manage this list of special things long term?"* — named the discipline gap. The substrate-as-teacher pattern was teaching again: each mint that hit one site without updating the others created drift; the right move is centralization, not enumeration.

**Four questions on the unification scope:**
- Candidate A: route everything through `is_mutation_form` verbatim → FAILS Honest. The predicate is a UNION over three semantic categories (declarations bind names; loads bring in external content; config setters mutate runtime state). Routing the lift through the union would assert all three categories ARE declarations. They're not.
- Candidate B: mint narrower `is_declaration_form` for the 8 declaration forms only → all four questions hold. Honest scope-bounding for loads + config setters (out-of-scope, not deferred; if a real caller surfaces, a separate arc examines independently).

Verdict: Candidate B. The deeper insight: **one predicate per semantic concern**. `is_mutation_form` keeps its current callers (`refuse_mutation_forms` — correct there; the freeze-eval refusal IS about "any registry mutation"). `is_declaration_form` is the new narrower subset predicate routing the prelude-lift + the check-validator unification.

**Gaze on the name:**
- `is_top_level_form` — LIES (Level 1). Loads + config setters are also top-level-only; the name promises geography but delivers taxonomy. Lies by omission about its own siblings.
- `is_startup_form`, `is_binding_form`, `is_definer_form`, `is_def_form` — MUMBLE (Level 2). Each forces the reader to find the definition to recover the set.
- `is_declaration_form` — SPEAKS. Names what the forms ARE; clean prior claim from type/module systems; nests cleanly under `is_mutation_form` as a readable subset. Chosen, not defaulted.

**Stepping-stone split of Gap I:**
- **Gap I-A** — predicate mint + lift unification. Strictly additive. Extends Gap H's lift to the 5 forms it missed.
- **Gap I-B** — position-validator extension. Surfaces earlier catches (check-time) for 7 forms currently caught at runtime or freeze-time. Risk: may cascade through tests expecting specific error variants. Proactive stepping-stone after I-A: the predicate is already proven; I-B is "one function gets the additional arms via shared predicate."

The recovery doc's proactive-slicing test answers YES — splitting I makes I-B's BRIEF smaller and lets I-A's purely-additive change verify independently.

---
