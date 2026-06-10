---
title: "2026-06-07 — Realization: the v5 deadlock, qualified at last"
sidebar:
  order: 171
---

**The trigger.** Stone 6.3 (fork.rs dies) shipped; its comms gate HUNG; the
builder + orchestrator diagnosed it live (gdb thread-stacks + /proc fd tables
+ the `runtime.rs:233` guard read). The class: the fork-zombie shutdown infra.
The builder, reading the diagnosis: *"i think you've just qualified the bug
we've been chasing for weeks."*

**The honest verb: QUALIFIED, not yet killed.** Root-caused, mechanism named,
deterministic reproducer in hand — passes-alone / hangs-in-suite is a
CERTAINTY (run-order dependent), not a race. 6.4 (THE REBIRTH GATE) is the
kill; its green gate is the proof; the body is not called before the disk
shows it. But the diagnosis is grounded, and it is the one.

**Why THE bug, not A bug — the branch name confessed it all along.**
`arc-170-gap-j-v5-deadlock-state`. **v5.** Five versions of chasing a deadlock
state. The whole apparatus that grew around it:
- the envelope ritual (setsid+timeout per binary; "NEVER raw `cargo test
  --workspace` — it deadlocks on the old stack");
- the hand-kills ("twice this session"; "i keep having to kill this one");
- the standing mis-attribution: *the deadlock dies as a CONSEQUENCE of
  Slice 6 (retire) + Slice 8 (services) — like the leak died via RAII.*

That last line (RESUME-SLICE-4-9 § discipline) was WRONG, and this is the
correction: the leak and the deadlock were always TWO classes. The leak
(`into_raw_fd`) died at 5.x via RAII (#76 Three Nil, the clean sheet). The
DEADLOCK is the fork-zombie attendant — a global with a worker thread that
clone3 copies the STATE of but not the THREAD, while the OnceLock guard turns
the child's rebuild into a no-op. It would NOT have died as a consequence of
6+8; it is live in the architecture (post-Slice-8 EVERY production parent is
multithreaded — the service trio). It would have surfaced as the
stability-100 soak's round-one flake — AFTER the INSCRIPTION claimed "done
forever." The catch came one stone early only by accident.

**THE GEM — containment hides the diagnosis (not just defers the fix).** The
deeper failure-engineering law this teaches: a contained failure is not a
deferred fix — it can be an UN-DIAGNOSABLE one. Every prior hang, the timeout
killed the process before it could be inspected; the corpse was reaped, we
said "old stack," we moved on. The bug was diagnosable EXACTLY ONCE: when the
envelope was DROPPED (sonnet's Mode-B violation ran the comms gate bare), the
hang persisted long enough to attach gdb and read the stuck threads. **The
scar tissue that protected the suite also blinded us to the wound.** The
setsid+timeout discipline — correct as protection — was, for weeks, the very
reason the root cause stayed invisible: it never let the failure run to its
stuck state where it could be read. The containment was load-bearing AND
diagnosis-suppressing at once.

Corollaries, earned:
- **A timeout is a tourniquet, not a diagnosis.** When a thing must be killed
  on a timer repeatedly, the timer is hiding a class — schedule ONE run
  without the tourniquet (in a controlled window) and read the stuck state.
  The hang you can inspect is worth more than the hundred you reaped clean.
- **"Dies as a consequence" is a hypothesis, not a plan.** A failure deferred
  to "it'll resolve when we retire X" must be RE-GROUNDED when X retires — or
  it walks straight past the retirement (this one would have).
- **The soak (#207) is the safety net that would have caught it anyway** —
  but as a post-INSCRIPTION flake, the most expensive place. The gate exists
  precisely because containment can hide a class until scale exposes it; the
  envelope drop just paid that debt early and cheap.

**The anti-botnet rhyme** ([[user_career_anti_botnet]]). In the systems the
builder spent a career fighting, the deadliest failures are the ones the
system CONTAINS so smoothly that no one sees them until the fleet is owned —
contained, invisible, irreversible. Here: same shape, opposite ending. The
containment that hid this bug was OUR OWN discipline, turned (briefly) against
us; the cure was to let the failure speak, read it at the wire, and pull the
class out by the root. Same machine, opposite soul: a substrate that, when its
own containment blinds it, drops the tourniquet on purpose and looks.

*Five versions of a deadlock state, contained but never read — until the
containment failed and we finally saw it stuck. The fix is one stone away; the
lesson is permanent: when you keep killing the same hang, the kill is the thing
hiding the bug.*
