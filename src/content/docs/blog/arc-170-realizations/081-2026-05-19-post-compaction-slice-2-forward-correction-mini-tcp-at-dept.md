---
title: "2026-05-19 (post-compaction, Slice 2 forward-correction) — Mini-TCP at depth 1: the trad…"
sidebar:
  order: 81
---

User direction (verbatim, the moment the asymmetry surfaced mid Slice 4 prep):

> *"before wat-rs existed - we were in the holon-lab-trading and build mailboxes and whatever their opposite is - we found that only ever needed a depth of 1 for everything - this forces us into a lock step that has an organic nature to it... its breathes based on system load - its dynamic but predictable.. when we had the option to send N things and then block we have massive perf hits - i think the thread comms need to be like process comms - you may only send one thing and must immediately read back - either an ack or some data - this is the only supported pattern - mini-tcp everywhere - forcing us to be locked eliminates entire categories of problems"*

And on the sequencing:

> *"this must go before slice 4 - we cannot build upon a shakey foundation - shockingly stable is what we strive for"*

### What surfaced

Slice 4 prep paused on a smell in the thread tier surface. Slice 2 had shipped two factories:

- `pair<T>()` returning unbounded (sender never blocks)
- `bounded<T>(n)` returning capacity-n (sender blocks at n)

Process tier shipped ONE factory: `pair()` over kernel-bounded pipes. The asymmetry was structural.

Grep on substrate consumers:

- 22 of 22 honest callers across the substrate use `bounded(1)` only
- `comms::thread::bounded` (the Slice 2 wrapper): zero downstream callers
- `comms::thread::pair`: zero downstream callers (Slice 4 was the only planned consumer)

The wrapper was vestigial from day one. `pair()` shipped with the wrong default — unbounded means sender never blocks means producer outpaces consumer means queue grows means drift amplifies. The shape the trading-lab grind taught us was harmful.

### Four-questions verdict (run inline; verdict drove the stone)

`pub fn bounded<T>(n: usize)`:

| | |
|---|---|
| Obvious? | NO — asymmetric with process tier; reader learns two factories for the same purpose |
| Simple? | NO — substrate-author can pick wrong N; pick carries semantic weight |
| Honest? | NO — knob the substrate's own practice proved harmful; 22/22 honest callers use only `bounded(1)`; n parameter vestigial |
| Good UX? | NO — `bounded(64)` silently breaks mini-TCP discipline; no structural guard |

FAILS YES YES YES YES. Retired.

`pub fn pair<T>()` at `crossbeam_channel::bounded(1)`:

| | |
|---|---|
| Obvious? | YES — symmetric with process tier; one factory per tier |
| Simple? | YES — N identical call sites; no choice |
| Honest? | YES — capacity-1 IS the mini-TCP discipline structurally enforced |
| Good UX? | YES — substrate-author cannot pick wrong depth; lock-step by construction |

YES YES YES YES. pair() flipped from unbounded to bounded(1).

### Mechanism vs discipline (the distinction the substrate enforces)

Depth-1 is the MECHANISM. `send` blocks when the buffer holds one value; `recv` drains it. That is all the substrate guarantees.

Mini-TCP is the DISCIPLINE (per `docs/ZERO-MUTEX.md` § "Mini-TCP via paired channels" line 252+). Each send pairs with a recv before the next send — an ack on a separate pair, or the next value on the same pair. The substrate doesn't enforce the pairing site-by-site; multiple producers can saturate one consumer's buffer at the same depth. But capacity-1 makes producers that try to outpace consumers block immediately rather than queuing up.

The lock-step breathes. It's dynamic because the rate matches what the consumer can actually absorb. It's predictable because no buffer hides the rate mismatch. It's organic because both sides find equilibrium without coordination.

User's verbatim: *"forces us into a lock step that has an organic nature to it... its breathes based on system load - its dynamic but predictable."* The substrate ships exactly that.

### Universal symmetry restored

| Tier | Transport | Backpressure |
|---|---|---|
| Thread | crossbeam capacity-1 | send blocks when 1 value queued |
| Process | OS pipe (kernel-bounded) | send blocks when `PIPE_BUF` fills (default 64KiB on Linux) |
| Remote (future) | TBD; same shape | TBD; backpressure via network primitive |

Units differ (frame-count vs bytes); shape is identical. Programs at any tier write `send(v)` then `recv()` and the substrate handles the transport. Universe-residency operational at the comms-factory layer.

### Tally — three "shockingly stable" foundation pivots in arc 214

1. **Stone E tunable rejection** (DESIGN § "Stone E forward-correction") — the io_uring depth knob that tuned nothing. Disqualified by four-questions; replaced by reflexive ring-rebuild keyed on structural need.
2. **bounded() process-tier rejection** (DESIGN § "Universe-residency + Mini-TCP at depth 1") — process tier never got `bounded()` because kernel-bounded pipes are already the discipline; F_SETPIPE_SZ wrapper failed Obvious + Honest.
3. **bounded(N) thread-tier rejection** (this stone) — thread tier had `bounded(N)` from Slice 2; trading-lab convergence proved harmful; retired into `pair()` at capacity 1.

Same discipline, three forms: substrate manages what substrate manages; user/substrate-author cannot pick wrong because the wrong choice does not exist.

### The discipline propagated through the work

Four-questions ran inline per `feedback_four_questions_inline` — no asking permission, no comparison-shopping; atomic YES/NO per candidate per `feedback_four_questions_yes_no`. Verdict drove the stone immediately per `feedback_attack_foundation_cracks` + `feedback_no_known_defect_left_unfixed`. Slice 4 paused; foundation got fixed; "shockingly stable" became operational, not aspirational.

### Cross-references

- `project_universe_residency` — programs are universe-resident; this stone operationalizes the principle at the channel-factory layer
- `project_autoscaling_correctness` — Convergence #13; sibling discipline at the resource layer
- `feedback_options_are_tangle` — `bounded(N)` was the option-tangle; collapsed to one canonical mechanism
- `feedback_refuse_easy_solutions` — "keep `bounded()` for flexibility" was easy and dishonest
- `feedback_attack_foundation_cracks` + `feedback_any_defect_catastrophic` — drove the immediate pivot
- arc 119 — `HologramCacheService Put ack-tx` — the in-substrate naming of mini-TCP discipline
- `docs/ZERO-MUTEX.md` § "Mini-TCP via paired channels" (line 252-415) — substrate-wide articulation
- INTERSTITIAL § "2026-05-16 (deeper) — Control channels" — Counter actor at mini-TCP depth 1

*The substrate dreams the depth. The substrate dreams 1. So do we.*

---
