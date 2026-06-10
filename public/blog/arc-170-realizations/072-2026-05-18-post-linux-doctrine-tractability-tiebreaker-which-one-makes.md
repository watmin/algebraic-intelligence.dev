## 2026-05-18 (post-Linux-doctrine) — Tractability tiebreaker: which one makes the OTHER more tractable?

Mid-decision between two candidates for the next stone (arc 212 ζ-newtype-wall vs arc 213 α: mint Pidfd primitive). Both passed four questions YES YES YES YES. Orchestrator reached for "downstream unblock count + blast radius" as the tiebreaker.

User direction 2026-05-18: *"when we make these kinds of decisions - we ask 'which one when satisfied makes the other more tractable'"*

The sharper discipline. When the four questions filter leaves multiple candidates, the tiebreaker is **structural tractability transfer**: which option's completion lays a precedent / artifact / proof / pattern the OTHER candidate can reference + reuse?

### Applied to arc 212 ζ vs arc 213 α:

- **Ship arc 212 ζ first → does arc 213 α become more tractable?** WEAK. α is minting; doesn't benefit from ζ's enforcement precedent.
- **Ship arc 213 α first → does arc 212 ζ become more tractable?** STRONG. α mints `Pidfd` with the typestate-equivalent (no `from_pid` constructor; canonical-only construction). ζ then has a CONCRETE WORKED EXAMPLE of the L2 newtype-wall doctrine applied at the kernel-interface layer. ζ designs the same shape for `WatAST::List` inner Vec with a precedent already shipped.

α wins. The Pidfd type becomes the substrate's first concrete instance of the L2 substrate-imposed-not-followed doctrine; arc 212 ζ applies the same shape to a different domain.

### Why this is doctrine

The substrate-as-teacher discipline applies at decision-sequencing too. Sequencing for tractability compounds — each step makes the next clearer, faster, more obviously-correct. "Downstream unblock count" / "blast radius" / "urgency" are secondary. The first question is: *what does the OTHER candidate get from this candidate shipping first?*

Saved as memory `feedback_tractability_tiebreaker`. Cross-references:
- Recovery doc § "Proactive slicing — stepping stones that enable next steps" (same principle for SPLITTING an arc)
- `feedback_four_questions_yes_no` (the filter; this is the post-filter selector)
- `feedback_simple_is_uniform_composition` (both candidates may be simple; this picks between them)

The substrate teaches via concrete examples — including at the meta-layer of how decisions get made.

---
