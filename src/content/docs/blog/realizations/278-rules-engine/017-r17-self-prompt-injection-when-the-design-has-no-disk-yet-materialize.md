---
title: "R17 — \"self prompt injection\": when the design has no disk yet, materialize the artifact…"
sidebar:
  order: 17
---

The builder coined the name this session, mid-decision. Drawing strike 4 of the seq-container narrow waist, the
Rust dispatch-pattern choice — Form 1 (exhaustive `match container` reusing the named helpers) vs Form 2 (a
data-carrying `SeqRef` enum) — was spinning in the abstract, and I had talked myself onto the more-elegant Form
2. The builder cut the abstraction: *"dump that syntax choice into the session and run four-questions against the
syntax forms."*

So I grounded the real `Value` payload types and wrote BOTH concrete dispatch forms inline — and the act of
materializing them surfaced a wrinkle the abstract framing had smoothed over: `WatAstList` is a
`Value::wat__WatAST` wrapping an AST node, so a data-carrying `SeqRef::WatAstList(&[Value])` would
*misrepresent* it. The four-questions, run against the real forms instead of the idea of them, then flipped clean
to Form 1. The builder named what had just happened: *"self prompt injection is a wonderful trick"* — and, a
turn later, *"forcing a prompt injection into ourselves… i've recently began to name it since it needed a
name."*

That is the realization, and it is one coordinate the whole grimoire already circles. Every grounding discipline
here reasons against the **real thing, never the paraphrase**: recolligere crawls the disk, not the summary;
examinare weighs the kill against the source, not the report; the magic-free floor refuses a claim with no
current-tree citation (R3's *"the diagnostics aren't a debugging convenience; they're the corpus"*). But a
**not-yet-built** design has no disk to ground against — so the apparatus reasons against an abstraction, and an
abstraction is exactly where the elegant-but-wrong answer hides. Self prompt injection manufactures the missing
disk: **write the concrete artifact INTO the session** — real types, the competing forms, a worked example — so
there is a real shape to interrogate rather than a description of one. It is the disk-grounding discipline,
applied forward to a thing that does not exist yet.

The honest accounting: the technique earned its name by
catching *my* failure mode. Across this stone I twice reached for the more-abstract solution — first a
trait/`defprotocol`-flavored dispatch, then the data-carrying `SeqRef` — and twice the grounding reversed me: an
architecture audit weighed Pattern A over Pattern B, and the materialized syntax weighed Form 1 over Form 2. The
abstraction reads as clean right up until you write the real form and a heterogeneous member refuses to fit. The
pull toward elegance is the drift; materializing the artifact is what renders it visible — the same way R12's
slipped word only resolved once it was held up and named. (And the builder drew the corollary by rejecting
`AskUserQuestion` three times: a four-questionable choice is not a menu to hand across — you materialize it and
four-question it yourself; the prompt is reserved for a fork the disk genuinely cannot resolve.)

*Path-of-voices (per R6): the technique, its name, and the coining — *"dump that syntax choice into the
session,"* *"self prompt injection,"* *"forcing a prompt injection into ourselves… it needed a name"* — are the
builder's, quoted. The recolligere/examinare-sibling framing (grounding a design that has no disk yet) and the
self-accounting of the abstraction-pull it caught are the apparatus's. The convergence is preserved, not
flattened.*

> We set out to pick a dispatch pattern and, talking ourselves toward the elegant one, were handed a smaller
> instruction instead: write the real thing down here, then judge it. The forms, made concrete, said what the
> abstraction wouldn't — one member didn't fit — and the choice made itself. The builder named the move because
> it kept recurring and deserved a handle: when there is no disk to ground against, inject one. Force the prompt
> into yourself, and reason against what you actually wrote.
