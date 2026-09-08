---
title: "R11 — the impl decouples from difficulty: measured, the Rust port is a flat ~4-minute sh…"
sidebar:
  order: 11
---

R9 said the wat impl is the spec and the Rust is a checked shadow. R10 said the shadow can be ambitious.
R11 is the first time we *measured* the shadow — and the number is sharper than the doctrine claimed. The
builder caught it by stopwatch, mid-Stone-8:

> *"whoa — did we do the rust port just now? … we spent like 40 min in wat and like 3min in rust … this is
> a crazy result … we're building the rust side so much faster now."*

The capability tier (Stones 6–8) is a controlled experiment by construction: each stone builds **the same
feature twice** — once in the wat oracle, once in the native kernel — as two separately-delegated sonnet
strikes. So the per-strike build durations are directly comparable. Reconstructed from the subagent
transcripts' first→last timestamps (UTC; the 8-b figure cross-validated three ways — agent file
`10:28:49→10:32:41`, task telemetry `232,019 ms`, and the git STRIKE-READY→green window all agree on 3m52s):

```
 stone               feature              oracle (wat)   native (Rust)   ratio
 Stone 6 (dddabfea)  where / TestNode      7m 14s         5m 23s        1.34×
 Stone 7 (88fa8eb6)  :not / NegationNode   7m 28s (~)     3m 51s        1.9× (~)
 Stone 8 (ef2b572a)  accumulators / Accum  15m 18s        3m 52s        3.96×
```

(Confidence: the native column and Stone 8's oracle are content-tag-confirmed in the transcripts — the agents
that mention `TestNode` / `NegationNode` / `AccumulateNode` — and window-matched to the commits. Stone 7's
oracle, `~7m 28s`, is the one soft figure: inferred from the agent whose run *ends* at the 7-a green commit,
not content-confirmed, hence the `~`. The trend holds without it — 6 and 8 alone are 1.34× → 3.96×.)

The single ratio (Stone 8's 3.96×) is the headline, but the **column shape is the real finding**. Read the
native column down: **5m23s → 3m51s → 3m52s.** The Rust port is converging to a flat ~4 minutes *regardless
of how hard the feature is.* Now read the oracle column: **7m → 7.5m → 15m**, scaling with conceptual
weight — accumulators (fold semantics, honest typing, gather-fold-extend) were twice the thinking of
negation, and the wat time records it. Because the impl cost is flat while the spec cost scales, **the ratio
widens with difficulty: 1.3× → 1.9× → 4×.** The harder the feature, the bigger the win — which is exactly
backwards from how impl effort normally behaves.

The mechanism is the explanation, and it is structural, not luck. The native strike carries **no
discovery burden**: by the time it starts, the oracle has already answered *what* to compute (8-b's
`accumulate_value` is a near-line-for-line transcription of the wat `accumulate-pass-for-token`), the
differential will mechanically prove *correct* (`native == oracle`, 5/5), and the prior native stone has
already shown *how* (8-b copied 7-b's gather/extend shape in `fire_fixpoint_delta`, which copied 6b-ii-b's).
The first native filter-pass (6b-ii-b) was the slowest precisely because no kernel pattern existed yet to
copy; once it did, every subsequent native strike became a transcription. **The cost of a feature moved
permanently to the spec, and the impl became a commodity** — predictable, cheap, and bounded by typing
speed rather than thinking speed.

The honest bound: this is n=3, all in one kernel, all accumulate/filter-family features that share the
`fire_fixpoint_delta` shape — so some of the native convergence is structural similarity, not pure doctrine.
The load-bearing data point against that objection is Stone 8: it is genuinely harder than 6 or 7 (distinct
fold logic, empty-case typing, a `PM<i64→PV>` aggregate), and the native strike *still* held the line at
3m52s. Difficulty rose; impl time didn't. That is the doctrine, not the repetition.

*Path-of-voices (per R6): the observation — the 40-min/3-min split, "we're building the rust side so much
faster now" — is the builder's, by stopwatch, quoted. The measurement (subagent-transcript timestamps), the
table, and the "the impl decouples from difficulty / the spec carries the weight" framing are the writer's
synthesis over his prompt to compare across stones. Each duration traces to a subagent file + a git commit
window (Stone 7's oracle the one soft, window-inferred figure, marked above); nothing here rests on the
workers' self-reports.*

> We set out to compare two build times and found the doctrine's hidden corollary: the checked shadow is also
> *flat*. Build the same feature twice and the wat half grows with the idea while the Rust half stays a
> four-minute transcription — so the harder the problem, the more lopsided the win. We did not make Rust
> faster to write. We moved the thinking out of it, and what's left is too small to be slow.
