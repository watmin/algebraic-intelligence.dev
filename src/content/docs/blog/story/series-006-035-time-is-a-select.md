---
title: "Time Is a Select"
description: "June 22–23, arc 278 closed — wat had no way to wait on time at all. :wat::time::* could read the clock but nothing could block on it; mora (time is I/O, a delay arrives on the wire or not honestly) had been held by absence, not discipline. A dead reporting feature — a service that clocks its own perf — needed a periodic trigger, and chasing that one need to the ground produced the pattern for everything with time. The grounding answer to 'who actually blocks for N, when we're TCO-proper with no loop?': nobody in wat ever waits — the kernel does (io_uring IORING_OP_TIMEOUT on the process tier, a crossbeam timer as a Select arm parking on a futex on the thread tier). So a timer is just the timeout arm of the one blocking call the reactor already makes. The builder's move that decided it: let the timer deliver a caller-chosen typed message whose type IS the select' set's output — which drops into the existing homogeneous select' with zero change. That is Erlang's send_after, re-derived. sleep is eliminated, named as the wretched lie: an uninterruptible thread::sleep holds a thread past kill for the full duration, which is exactly the arc-170 hang class — and every delay expressed as a select on a timer is cascade-interruptible by construction, killing the class. tick was annihilated before it shipped (two questions: if it's constant, how does it stop? why isn't it a TCO re-arm of after?) — one primitive, after; periodic is the loop's recursion, fixed-rate is after(deadline-now). The keystone: a tier-open Timer'<O> typed so it cannot lie — arg0 driven from a spawn-locus to a PeerKind enum, the four-questions flipping the apparatus's own recommendation because a Selectable supertype would downgrade compile-time tier-homogeneity to runtime. The crown: one defservice that reads its own peer-kind off its ambient env and arms (after that 50ms :tick) runs unchanged on a thread and a process, the two tests differing in exactly one token, the checker proving it sound — an ergonomic no surveyed language ships."
sidebar:
  order: 58
---

[The Slow Engine Is the Spec](/blog/story/series-006-034-the-slow-engine-is-the-spec/) brought a rules engine home and beat the reference. This is the other half of the same era — a timer — and it ends in the same place: a primitive no surveyed language ships, reached by refusing to let a feature lie.

## wat could read the clock but could not wait (June 22)

The arc opened on a dead feature refusing to stay dead. A `defservice` whose old reporting apparatus had been written off as gone — the tests pass `null-reporter` — and the builder stopped the write-off:

> the reporting stuff … worked very well … how do we make it work again? … we can build the necessary tooling in the init-fn for it to clock its own perf?

A service that clocks its own perf needs a **periodic trigger**, and that one need, chased to the ground, opened onto the deepest thing the session found: how to do *all* things with time. The grounding came first — `examinare`'s study-the-lair, not a design from the armchair. `mora`, the grimoire's time-spell, is law: *time is I/O; it arrives via the wire, or it doesn't arrive honestly. Sleep is a guess; guesses race.* So the trigger could not be a `sleep`-in-a-loop. And reading the tree turned up the real situation: `:wat::time::*` is rich — `now`, `epoch-nanos`, durations, iso8601 — but every one is a **pure readout**, a value. There was **no `sleep`, no `timerfd`, no timeout-poll anywhere.** `mora` had been held not by discipline but by wat having no way to wait on time at all — you could read the clock, never block on it.

Then the sharpest inquisitor question, which drove the grounding into the reactors and turned out to be the keystone:

> who is the thing who actually blocks for N time units before returning control — we also don't have loop, we're TCO proper?

Reading the two reactors answered it. The process tier is **`io_uring`**; the thread tier is **crossbeam `Select`** parking via `park_timeout`. **Nobody in wat ever waits.** The timer is the **timeout arm of the one blocking call the reactor already makes** — an `IORING_OP_TIMEOUT` submission with a timer token (process), a crossbeam timer receiver as a Select arm parking on a futex-with-timeout (thread). The kernel's hrtimer is the only waiter, on both tiers, symmetric; a tick is the same kind of wake as a socket read.

## send_after, re-derived; sleep named as the lie (June 22)

The first draw was an over-design — a distinct `Timer` type and a Go-style *heterogeneous* `select` with per-arm typing. The builder cut past both with the move that decided the arc:

> why can't an I or an O be an enum, and that enum can have a timeout representation?

Make the timer deliver a **caller-chosen, typed message** whose type *is* the `select'` set's output `O`. The timer yields an `O`, so it drops into the **homogeneous `select'` that already exists, unchanged**:

```clojure
(:wat::kernel::after d msg)   ;; delivers msg (an O) once, after d
(select' (Vector :Peer' work-peer (after d :Op::Timeout)))  ;; match O, incl :Timeout
```

That is **Erlang's `erlang:send_after(Time, Dest, Msg)`**, re-derived — deliver `Msg` after `Time`, of the mailbox's own type. Erlang shipped it decades ago for distributed fault-tolerant services; what is wat's own is that it lands on the *existing* homogeneous `select'` plus protocol-enum idiom with **zero `select'` change**, so a timed service is just a service with a timer arming `Op::Tick` into its own set — no serve-loop edit. Then the builder named the thing the arc had been circling, and named `sleep` for what it is:

> the only way to get time delays is via select — fucking beautiful. … i've been dreading backoff timers, retry sleeps, arbitrary waits for whatever bullshit — i hate sleep.

So there is **no `sleep` verb**. `sleep` is the timer-peer in disguise — arm a timer, discard the tick. And the reason to forbid it is not purity, it is correctness: a bare `thread::sleep(d)` is **uninterruptible**, holding a thread past kill for the full `d` and blocking teardown — and *that uninterruptible wait is exactly the arc-170 hang class* the whole branch sits on. Because every delay is a `select'`, the timer shares its set with the shutdown cascade, so a wait wakes on whichever fires first, the deadline **or** shutdown. Expressing every delay as a select on a timer makes "wait for time" cascade-interruptible by construction, which structurally kills the class. `timeout`, `backoff`, `debounce`, `rate-limit`, `watchdog`, `deadline` are all one primitive used differently.

## tick, annihilated before it shipped (June 22)

Pushing to "solve time forever," the draft pitched a periodic `tick` primitive alongside `after`. The builder killed it in two questions:

> if it's constant… how does it stop? … why isn't this just a TCO thing where you reinstall after fire?

Both land. A standing periodic timer fires forever, so to stop it you need a cancel/handle/lifecycle — a stop-surface a primitive should not impose, and the awkwardness of answering "how does it stop" *is* the tell that it is the wrong shape. And fixed-rate does not need `tick` either: re-arm `after(next_deadline − now)`, anchoring to the absolute schedule rather than "now + d," and the drift that had been blamed on re-arm vanishes inside the same TCO loop. The drift was an artifact of re-arming a *relative* delay; the fix was a delay computation, not a new primitive.

So there is exactly **one timer primitive — `after`.** Periodic is a TCO re-arm; **the loop's recursion is the timer's lifecycle** — it stops by not recursing, or by a shutdown `select'` arm, with no cancel and no leak. Fixed-delay (`after(d)`) and fixed-rate (`after(deadline − now)`) are two delay choices in that loop, not two primitives. `tick` was a feature whose *existence* was the defect, deleted before it shipped — time is not a subsystem with a maintenance surface, it is `after` and a loop.

## The type that cannot lie (June 23)

The process-tier timer was scoped as a simple mirror of the thread tier and became the keystone, because the builder kept catching the **type lying**, and each catch ground out a deeper honesty:

- **arg0 was a spawn-locus** (a `ThreadOpts` record). An `intueri` cast found it a Level-1 lie — it promises spawn-configuration, delivers a tier-tag, and the whole record payload is dead weight; a `solvere` cast found the same braid duplicated at `listener'`. The spawn concern was wrongly bound into timer-tier selection, and arg0 became a `PeerKind`.
- **The childless timer-peer was first `pidfd: Option = None`**, with `None` read to *mean* "timer." The builder named the law — *"whenever I see option communicating a semantic statement rather than presence it is typically screaming we need an enum"* — and `None`-as-identity became a `ProcessSelectable { Spawned | Timer }` enum: illegal states unrepresentable.
- **The four-questions flipped the apparatus's own recommendation.** Run ruthlessly on the tier bridge, they killed option B — a `Selectable` supertype with runtime tier-resolution — because it **downgrades a compile-time homogeneity guarantee to runtime**: the type would lie about what it enforces. Option A, a tier-open `Timer'<O>` that fuses into the set's concrete tier, keeps it honest — `Thread'` ≠ `Process'` still do not unify, so a mixed real-peer set is still a compile error. Correctness over the easier, weaker form.
- **"select only measures the right side."** A timer is output-only — one receiver, no sender, the simplest peer — so `Timer'<O>` carries one parameter, not two; `select'` agrees on what every source *delivers*, and the fusion ignores the timer's absent input. A phantom input param would have been the same dead-weight lie a third time.

Every fork was a place the type *could* lie — a borrowed concept, a semantic `None`, an erasure, a phantom param — and taste flagged each before the formal name existed; grounding the *why* landed the honest form each time. The shipped keystone is a `unify` fusion arm where `Timer'<O>` fuses into a peer of any tier, general over all three loci, homogeneity preserved and `O` checked. On the process tier `io_uring` polls the timerfd as the sole waiter — best-of-breed Linux, zero-mutex. The type cannot lie about its tier.

## The program none the wiser (June 23)

The payoff is the ergonomic itself. One `defservice` — `wat-tests/timer-env-grab-parity.wat` — whose op reads its **own** `wat.peer-kind` off `(:wat::program::env)` and arms `(after <that> 50ms :tick)` in a `select'`, runs **unchanged** on a thread (crossbeam) and a process (io_uring). The two tests differ in **exactly one token** — the locus — and both deliver `:tick`. The program never names its tier; the tier-open `Timer'` fuses it to whatever reactor it landed on; the type checker keeps it honest the whole way. The builder named what it earns:

> you proving this works where the program doesn't care what its loci is … it feels remarkable … i don't know of another lang that can do this kind of ergonomic work.

Measured, not boasted: Go has `select`, but you wire the channel; Erlang has location transparency, but no typed timer that fuses; Akka makes you choose a dispatcher. A timer that adapts to its locus with the program none the wiser, *and the checker proving it sound*, has no reference in another language. The correspondence with Erlang kept surfacing all session — `defservice` is `gen_server`, `(after d msg)` is `send_after`, the loci are location transparency, the shutdown cascade waking every `select'` is let-it-crash — and the builder said it: *"i keep finding myself next to erlang."* He did not study Erlang and translate it; he applied disciplines — `mora`, the narrow waist, pure handlers — and kept arriving at Erlang's semantics through a surface he actually thinks in. The remote tier stays the deferred door, honestly grounded: the fusion is already general over loci, `PeerKind` grows a `:remote`, and a remote locus is a new tier head with zero `after` edit — its own arc, when remote is built. With that, arc 278's era closes: time made a thing that arrives on the wire, typed honest, fusing to whatever locus the program lands on, the program never having to care.

## Likely Contributions to the Field

- **A delay is a select on a timer, never a sleep.** Modeling every wait as a typed message a timer delivers into the same homogeneous `select'` everything else blocks on makes "wait for time" cascade-interruptible by construction — a delay wakes on its deadline *or* a shutdown, whichever fires first. A bare uninterruptible `sleep` holds a thread past its own kill, which is the canonical leak/hang failure mode; expressing time as I/O on the one wait the reactor already makes eliminates that class structurally rather than by discipline, and the kernel's hrtimer is the only thing that ever blocks.
- **One timer primitive; periodic is composition.** A standing periodic timer needs a cancel/handle/lifecycle surface a primitive should not own — so it should not exist. Fixed-delay is `after(d)`, fixed-rate is `after(deadline − now)`, and both ride a single `after` re-armed inside the serve loop, whose tail-recursion *is* the timer's lifecycle (it stops by not recursing). The whole temporal family — timeout, backoff, debounce, rate-limit, watchdog, deadline — is one primitive used differently.
- **A tier-open type keeps location-transparent timing honest at compile time.** A timer typed as `Timer'<O>` (output-only, one parameter) can fuse into a peer set of any execution tier while preserving static tier-homogeneity — distinct real tiers still refuse to unify, so a mixed set is a compile error. A `Selectable` supertype would have been easier and would have downgraded that guarantee to runtime; the four-questions reject the convenient form because the type would then lie about what it enforces.
- **Location-transparent timing with the program none the wiser, the checker proving it sound.** A single source that reads its own execution locus from its ambient environment and arms a timer runs unchanged on a thread and a process, the two differing in one token, with no dispatcher choice and no channel wiring — an ergonomic the surveyed languages (Go, Erlang, Akka) each fall short of in a different way. The combination — typed, fusing, locus-adaptive, statically checked — is the contribution.
