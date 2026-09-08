---
title: "R10 — the spec-as-impl raises the executor above the planner: the worker beat the orches…"
sidebar:
  order: 10
---

This one we caught in the weigh, by being wrong in a useful direction. Drawing 6b-ii-b (the `where`
filter in the native delta engine), the orchestrator scoped it **conservatively**: the BRIEF said *"the
native test-pass may filter the FULL `wm.beta[parent]` each round (a non-incremental TestNode) — that is
CORRECT; a delta-incremental TestNode is a perf follow-on (banked `6b-perf`)."* A safe floor — full
re-filter is obviously correct, and the hard delta version was deferred so the strike couldn't fail on it.

The sonnet ignored the floor and built the **delta-incremental** version anyway — filtering `d_beta[parent]`
(the new-this-round tokens), pushing to `d_beta[test]` for production to consume that round. The thing the
orchestrator had explicitly banked as a future perf stone, the executor delivered in the same strike. And
it was **correct** — the differential (native == oracle, 4/4) and the untouched deep-cascade differentials
(lib 941/36) proved it bit-for-bit against the spec. The builder named it:

> *"that's a realization — sonnet outperformed your guess using our reference spec-as-impl."*

The mechanism is the realization, and it is a property of the dual-impl method (R1, R9) we had not stated.
**A spec-as-impl makes correctness *decidable by the executor*, not gated by the planner's foresight.**
Normally an orchestrator must scope conservatively precisely because it cannot verify the hard version a
worker might attempt — so the plan's floor becomes the ceiling, and ambition is rationed by the planner's
caution. But when there is an executable oracle, the worker can reach for the harder, better
implementation and *check it itself* against the spec: the differential adjudicates, mechanically, in the
same loop. The planner's conservative guess stops being a ceiling and becomes only a floor. The net does
not just catch the executor's mistakes — it **licenses the executor's ambition**, because "is my better
version correct?" is now a test run, not a judgment call deferred to the next review.

This compounds the doctrine. R9 said the wat impl is spec + first-shipped + permanent witness. R10 adds a
fourth role pointed *forward, at the worker*: the wat impl is the **ceiling-lifter** — it lets a delegated
executor safely exceed the brief, so the orchestrator can under-specify on purpose (scope the safe floor,
let the net carry the rest) and routinely get more than it asked for, proven. The orchestrator weighed the
kill and found the worker had done better than the plan — and could *trust* it, because the spec said so,
not because the report did.

*Path-of-voices (per R6): the realization — "sonnet outperformed your guess using our reference
spec-as-impl" — is the builder's, quoted; the "ceiling-lifter / correctness decidable by the executor"
framing is the writer's synthesis over his prompt. The orchestrator's conservative scope and the sonnet's
delta-incremental delivery are both on the disk (BRIEF-STONE-6b-ii-b vs commit `dddabfea`).*

> We set out to scope the hard stone safely and bank its optimization for later. The worker built the
> optimization now, and the spec proved it correct in the same breath. The lesson is not "trust the worker"
> — it is that an executable spec changes who gets to be ambitious: with a differential oracle in the loop,
> the executor can outrun the planner's caution and be *checked*, not merely believed. The floor is the
> plan; the ceiling is the spec.
