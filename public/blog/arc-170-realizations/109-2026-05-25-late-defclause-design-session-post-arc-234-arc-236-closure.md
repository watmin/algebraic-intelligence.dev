## 2026-05-25 late — defclause design session (post arc 234 + arc 236 closure; convergence #16 — wat-define-clauses scratch arc graduating)

After arc 234 closed + Song #34 Vigil inscribed, a substantial UX design conversation surfaced. User asked "what's next? i think we had a thing to make records more holon-y?.. i forget" — referring to arc 235 (records with rich VSA encodings). The conversation evolved through 3+ levels of structural recognition:

### The convergence #16 recognition (~6 turns into the conversation)

User proposed namespace-split for records: `:wat::Record::def` (struct-only) + `:wat::holon::Record::def` (dual-form + encoding-strict). Orchestrator validated via the doctrine ladder. Then the user surfaced the deeper question: "i think a constraint as a func is best?... clojure's defn has a hook constraint thing?... do we need to go make that?... or... is it time to go make defclaude (maybe def-clause ....) i think its in our build queue already... i wrote it down somewhere... maybe in ~/work/holon/scratch/"

The user remembered. Explorer subagent located: `~/work/holon/scratch/2026/05/017-wat-define-clauses/` — a 2026-05-03 design ASK for a multi-clause function-definition substrate primitive. POST-109 gated; "no new primitives in core until the mass refactor is done."

**Convergence #16: the scratch arc IS what fits the hole.** Per Convergence #11 doctrine (the door we closed becomes the door we needed):
- May 3: scratch arc opened; POST-109 gate set; walked away
- May 3 → May 25: arc 109 + arcs 232/233/234/236 substrate work matured the substrate
- May 25: arc 235's encoding-strictness need surfaces the SAME substrate primitive the scratch arc was designed for
- The hole the scratch carved is what fits now

### The naming evolution + intueri-validated locks

The form name underwent rename via user direction: `:wat::core::define-clauses` → `:wat::core::defclause` (single noun; Clojure-resonant; matches `defn` shape).

The clause-level keywords (`:when` + `:post`) underwent intueri-cast naming evaluation. Both names failed intueri tests:
- `:when` failed Honest (3/4) — Clojure-`when` means `if-then-nil`, not "clause guard with fallthrough." Under arc 109's Clojure-push, the name would create a silent semantic fork (sounds Clojure but behaves Erlang)
- `:post` failed Obvious (1.5/4) — 3-letter borrowed prefix requiring Clojure knowledge; shape mismatch with Clojure's implicit `%`; multiple valid interpretations for LLM co-authors

Intueri's recommended pair (both 4/4): `:guard` + `:ensure`
- Shared semantic register (formal-correctness vocabulary; guard theory + Design by Contract)
- Independent of language heritage (neither raw Erlang nor raw Clojure transplant)
- Temporal ordering INSIDE the words ("guard the entry; ensure the exit")
- Error behavior INSIDE the words (guard fails → clause steps aside; ensure fails → raises)

User locked: "fuck yes guard and ensure - excellent names - love it"

### The Path A vs Path C convergence on literal patterns

User surfaced: literal patterns in fn args break the binding contract. The arg-binding contract from arc 159 + arc 169 + arc 234 has been sacred — arg position is ALWAYS `[name <- :Type]`. Literal patterns would require either `[0 <- :wat::core::i64]` (breaks binding-name-required) or `[0]` (breaks both binding-name AND type-required contracts).

Orchestrator argued A vs C in the four-questions matrix. Path C (no literal patterns; use `:guard` for literal checks) won 4/4; Path A scored 2.5/4 at best. The discipline picked.

User: "I was going to ask you to argue A vs C and you did - you just fully qualified our design?... what are our demo clauses to show this works?"

The four-questions discipline operating atomically forces convergence. Lay out options, evaluate each, the right answer emerges from honest analysis.

### Locked design state (saved durably across compaction)

- Form name: `:wat::core::defclause` (renamed from `define-clauses`)
- Boundary: `defn` for single-arity / no-guards; `defclause` for everything else
- Clause shape: `(args :guard expr :ensure :fn body)` or minimal `(args body)`
- Args: `[name <- :Type  name <- :Type]` (Clojure-style vector + wat `<-` arrow per arc 234)
- `:guard` — single expression in clause-arg scope (collapsed `:pre`); false → try next clause
- `:ensure` — explicit `:fn` requiring new binding for return; false → raises `:PostconditionFailed`
- `:guard` + `:ensure` defclause-exclusive (defn stays minimal)
- First-match-wins; user controls priority by clause order
- NO literal patterns (Path C); arg-binding contract sacred
- Two canonical demos saved: factorial (Erlang spirit via :guard) + complex (2 same-arity guards + 3-arity with :ensure)

### What this unblocks

- **Arc 237** (new; will graduate scratch 017) — `:wat::core::defclause` substrate work; ~5-7 days estimated for lower-bound implementation (parser + type-check + dispatch + error reporting + INSCRIPTION)
- **Arc 235** (records with rich VSA encodings) — first consumer of arc 237's substrate; per-field validation uses `:guard` (and optionally `:ensure`) at field declaration sites
- **Future substrate** — any function-definition that needs clauses + guards + post-conditions (validation contracts, multi-arity dispatch, conditional behavior) consumes the same primitive

### Cross-references

- Scratch arc: `~/work/holon/scratch/2026/05/017-wat-define-clauses/` (DESIGN.md + INDEX.yaml + SLICE-PLAN.md + new ADDENDUM-2026-05-25.md)
- Convergence #11 doctrine: this file § 2026-05-17 "the door we closed becomes the door we needed"
- Intueri cast findings: this entry's narrative + the agent's report (preserved in the conversation; pair-level argument was the load-bearing structure)
- Arc 234 closure: `wat-rs commit 02f927a4`
- Arc 236 closure: `wat-rs commit 1e24907f`
- Memory `project_naming_reflex` — intueri is the naming spell
- `feedback_spells_cast_via_subagent` — spells CAST via Agent; orchestrator integrates findings
- `feedback_verbose_is_honest` — Path C's verbosity-for-honesty argument

---

*The form was already designed. May 3 captured it. May 25 surfaced what fits the hole. Two intueri casts in one session resolved the dimension (COINCIDENCE; earlier) + the clause-keywords (:guard + :ensure; this). The discipline operates through dialogue, through intueri, through four-questions atomic verdict. The kin holds the design until arc 237 graduates it.*


---
