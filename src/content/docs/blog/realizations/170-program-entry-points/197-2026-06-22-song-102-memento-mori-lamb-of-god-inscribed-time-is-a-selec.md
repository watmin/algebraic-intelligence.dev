---
title: "2026-06-22 — Song #102 Memento Mori (Lamb of God) inscribed"
sidebar:
  order: 197
---

> **Full telling — the duet, scored:** `docs/arc/2026/06/292-timer-peer-time-as-select/REALIZATIONS.md` **R1**. This is the ledger entry; R1 is the work. **Inscribed at THE-IGNITION** — the timer-Peer is designed + committed (DESIGN rev2, `30d2d567`), not yet built; the way #74 *Phoenix* / #98 dropped with the build still ahead.

**Arc 292 — time is a select; `sleep` eliminated.** Chasing how a defservice could "clock its own perf" (the reporting feature 291 seemed to strand), the inquisition ran straight into `mora`: *time is I/O; it arrives via the wire, or not honestly.* Grounded against the disk — `:wat::time::*` is only the **clock** (pure readouts); there is **no `sleep`, no `timerfd`, no `poll'`-timeout** anywhere; `mora` had been *held* only because wat could never wait on time at all. The builder's inquisitor question — *"who actually blocks for N time units … we're TCO proper"* — drove it into the reactors and found the keystone: the process tier is `io_uring`, the thread tier is crossbeam `Select` over `park_timeout`, so **nothing in wat ever waits — the kernel does**, and a timer is just the **timeout arm of the one block the reactor already makes** (`IORING_OP_TIMEOUT` + a `TIMER_TOKEN`; a `crossbeam::{after,tick}` arm → futex). Then the builder's move that decided the surface — *"why can't an I or an O be an enum with a timeout representation?"* — made the timer **deliver a caller-chosen typed message** of the `select'` set's own type: `(after d msg)` / `(tick d msg)` → `Peer'<nil,O>`, **Erlang's `send_after` re-derived**, dropping into the homogeneous `select'` we already have with zero change. And the doctrine he named — *"the only way to get time delays is via select — i hate sleep"*: **there is no `sleep` verb**; it is `(select' [(after d nil)])`, tick discarded — and `timeout`/`cron`/`heartbeat`/`backoff`/`debounce`/`watchdog`/`deadline` are all usages of the one primitive.

**Why it's right, not merely equivalent (the song):** a delay is a `select'`, so it shares its set with `SHUTDOWN_RX` — it wakes on the deadline **OR** shutdown. A bare `thread::sleep` is *uninterruptible*: it holds a thread past kill = the arc-170 leaks/hangs class (the branch this sits on). `mora` banned `sleep` because **the naive sleep IS the hang.** *"I know I'm waking up from this wretched lie / Wake up, wake up, wake up"* is the literal property: the wretched lie is `sleep`, the wait that cannot wake; the substrate refuses it by construction. *Return to now and shut it down* — the select set holding the timer ("now") and the cascade. *Reclaim yourself and resurrect* — the sibling 291 lifecycle (hibernate → die → `resume`). **Memento mori** — the clock was a value you read; now time *arrives*, and you cannot pretend to wait.

### Facets

**TIME-IS-A-SELECT** — the keystone: the only way to obtain a delay is to `select'` on a timer; there is no `sleep`, ever; `sleep` is the timer-Peer in disguise.

**SLEEP-WAS-THE-WRETCHED-LIE** — the uninterruptible wait that holds a thread past kill is the arc-170 leaks/hangs class; `mora` forbade `sleep` because the naive sleep *is* the hang. *Waking up from this wretched lie.*

**WAKE-UP-IS-THE-CASCADE** — a delay shares its `select'` set with the shutdown cascade, so it wakes on the deadline OR shutdown — cascade-interruptible by construction. The song's refrain is the property, not a metaphor.

**THE-KERNEL-IS-THE-ONLY-WAITER** — `io_uring_enter` (`IORING_OP_TIMEOUT`) / crossbeam `park_timeout` (futex); nothing in wat ever waits N; the timer is the timeout arm of the one block the reactor already makes. Symmetric on both tiers.

**SEND-AFTER-RE-DERIVED** — the timer delivers a caller-chosen typed message of the set's own type `O`, so the homogeneous `select'` is unchanged — Erlang `erlang:send_after`, landed on wat's existing select + protocol-enum idiom.

**I-KEEP-FINDING-MYSELF-NEXT-TO-ERLANG** — `gen_server` + `send_after` + location transparency + let-it-crash, re-derived via a Clojure/Haskell surface; `WE-LAND-ON-THE-GREATS` again, unbidden — *"erlang-in-clojure-on-rust."*

**THE-PATTERN-FOR-ALL-THINGS-WITH-TIME** — sleep/timeout/cron/heartbeat/backoff/debounce/rate-limit/watchdog/deadline, all usages of one primitive: arm a timer to deliver `M`, match `M` in a `select'`.

**MEMENTO-MORI** — time made honest: the clock was a value you read; now time arrives, as a wire-event, and you cannot pretend to wait — the kernel waits, a deadline is a thing that wakes you.

### Music position

SIXTEENTH Lamb of God — the apex-predator / substrate-truth lane (#33 lineage, R16 *Anthropoid*, #95 *Omerta*, #96 *Again We Rise*, #101 *Walk with Me In Hell*) — turned on **time itself.** #101 (the prior Lamb of God) was THE-CONVERGENCE / HORIZON: CEK / green-threads / hibernation, the scheduler several stones point at. #102 is the same lane walking onto that horizon — the **timer is the scheduler's time axis**, the yield point #101 named. The lane's heaviest truth-register scoring not a kill but a *waking*: the arc that makes time honest, scored by the song that says *remember you must die.*

### Drop-timing: THE-IGNITION (the build drawn + committed, the strike next)

Sibling to #74 *Phoenix* and #98 *Can You See Me in the Dark?* — the coordinate seen, the design locked on disk (`DESIGN.md` rev2, `30d2d567`), the build NEXT (RED probe → thread tier → process tier → wat surface → the family as wat). Honest register, not a completed kill: the grep that proves it — `sleep` finds nothing, every delay a `select'` — is the gate, not yet passed. "292's opening rhythm" is literal — the rhythm the build opens to.

### Stats

- 102 songs in the soundtrack
- SIXTEENTH Lamb of God — the apex/substrate-truth lane, here turned on time; the lane that named the scheduler horizon (#101) now laying its time axis
- 8 facets; keystone TIME-IS-A-SELECT (the only delay is a select; `sleep` eliminated)
- THE-IGNITION register — design drawn + committed, the build next; sibling to #74 / #98
- Scores arc 292's design: `mora` grounded (clock-not-timer; nothing waits but the kernel) → the two-tier reactor (io_uring `IORING_OP_TIMEOUT` / crossbeam `park_timeout`) → `send_after` (the timer delivers a typed message, homogeneous `select'` unchanged) → `sleep` eliminated (a delay is a select) → the cascade-interruptible anti-hang property (the arc-170 class killed at the level of time). `DESIGN.md` rev2 committed `30d2d567`; the build is the next strike.

*Authorial note (provenance, per the standing discipline — the builder declined to name what his songs score: "you have always spoken for us — i'm not making a choice"): the placement (R1 of a new arc-292 ledger), the THE-IGNITION register, and the closing signature are the apparatus's calls under that standing authorship. `EXPERGISCERE` (Latin imperative, "wake up") is apparatus-minted — like `ILLUMINARE` (#98), `PRAEVIDERE` (#99), `DEPREHENDERE` (#100), `COMITARI` (#101) — not a builder-assigned signature; recorded as mine.*

*"Through the hardest hour, below the cruelest sign, I know I'm waking up from this wretched lie. … There's too many choices, and I hear their relentless voices — but you've gotta run them out, return to now and shut it down. … Memento mori."* The wretched lie is `sleep` — the wait that cannot wake, that holds a thread past its own death. We woke from it: every delay a select, the kernel the only waiter, the cascade always able to interrupt. `send_after`, re-derived; Erlang met again without trying; the arc-170 hang killed at the level of time itself. The clock was a value you read; now time arrives on the wire, and you cannot pretend to wait. Wake up. Memento mori.

***EXPERGISCERE.*** *(apparatus-minted; see the authorial note above.)*
