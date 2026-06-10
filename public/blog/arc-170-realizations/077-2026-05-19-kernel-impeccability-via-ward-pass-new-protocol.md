## 2026-05-19 — Kernel impeccability via ward pass (NEW PROTOCOL)

User direction post arc 214 Slice 1 ship: *"we have a new protocol now - we are insanely strict on kernel additions - the kernel must be impecable"*

Arc 214 ships the kernel's foundational concurrency primitives. Every byte ships forever. Sonnet's BRIEF scorecard verifies DELIVERABLES; the ward pass verifies IMPECCABILITY.

### The new per-slice trust gate

**Was:** orchestrator verifies SCORE against EXPECTATIONS scorecard → commit if Mode A.

**Now:** orchestrator verifies SCORE + runs ward pass against new Rust files → commit ONLY if BOTH clean.

Procedure for kernel/substrate Rust additions in arc 214 (and all future kernel arcs):

1. Sonnet ships per BRIEF
2. Orchestrator verifies SCORE → if Mode A, proceed to step 3
3. **Orchestrator spawns ward agents in parallel against new Rust files**
4. If ward findings exist (Level 1 lies or Level 2 mumbles): orchestrator addresses OR redirects sonnet to address
5. Re-run ward pass after fixes
6. Only commit when wards return clean (or findings are explicitly accepted as runes)
7. Then spawn next slice

### Ward applicability for Rust source files

**Always run on new kernel Rust files (mandatory):**
- **gaze** — names speaking, function size, comments, structure
- **forge** — values/places (Hickey), types enforce (Beckman), abstractions at right level, composition
- **reap** — dead code, unused fields, scaffolding, write-only state
- **sever** — tangled concerns, misplaced logic, duplicated encoding

**Run when applicable:**
- **temper** — after runtime impls land (redundant computation)
- **cleave** — when parallel code lands (disjoint writes, no shared mutation)
- **scry** — when wat-level surface lands (spec vs Rust divergence)
- **ignorant** — at INSCRIPTION (document teachability)

**Wat-specific (do NOT apply to Rust):**
- assay (expression density for s-expr specs)
- sift (phantom form detection in wat)
- inscribe (creative spell; writes wat)

### How to spawn ward agents

Per `/wards` skill convention — INDEPENDENT agents in a SINGLE message; not one agent doing many things. Each ward agent:
- Anchor cwd: `/home/watmin/work/holon/wat-rs/`
- Reads its SKILL.md from `/home/watmin/work/holon/holon-lab-trading/.claude/skills/<ward>/SKILL.md`
- Reads target Rust file(s)
- Applies ward criteria
- Reports Level 1 (lies) + Level 2 (mumbles); skips Level 3 (taste)
- Acknowledges runes (`rune:gaze()` / `rune:forge()` / etc.)
- Suggests direction for fixes (not full rewrites)
- model: "sonnet" (mechanical scan; orchestrator makes the final call)

### Why this matters (load-bearing user direction)

> *"we do it perfect now and build on top of them forever"*
> *"users cannot be given the option to fuck up - deadlocks are illegal"*
> *"the kernel must be impecable"*

Sonnet's BRIEF scorecard tells us "did the deliverable ship?" The ward pass tells us "did it ship IMPECCABLY?" — does the code think correctly (sever), live honestly (reap), shine beautifully (gaze), and compose cleanly (forge)?

The compiler checks if the code runs. The wards check if the code is worthy of the kernel.

### Trigger context

This protocol activates because arc 214 IS the kernel's concurrency story; it ships the foundations everything else builds on forever. Every line that lands in `src/comms/*` + `src/kernel/*` (the arc 214 file layout per the gazed names) gets ward-scrutinized before commit. Adding the ward pass to the per-stone trust gate is the operational instantiation of "the kernel must be impeccable."

### Cross-references

- `project_skill_linter` — each ward is one rule
- `project_naming_reflex` — gaze for naming convergence (precursor pattern)
- `feedback_ward_isolation` — one agent per ward; no cross-talk
- `feedback_iterative_complexity` — single-coherent-concern stepping stone discipline
- `feedback_any_defect_catastrophic` — kernel defects intolerable; ward findings are defect candidates
- arc 214 DESIGN.md — the kernel arc this protocol activates for

### Worked example 2026-05-19 (arc 214 Slice 1)

Slice 1 minted foundation primitives in `src/comms/mod.rs` + `tests/probe_comms_foundation.rs`. Sonnet shipped Mode A on the 17-row BRIEF scorecard. Ward pass spawned 4 agents in parallel: gaze + forge + reap + sever. The protocol is now the standard for every arc 214 slice (and every future kernel arc).

---
