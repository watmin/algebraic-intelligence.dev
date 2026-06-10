## Chapter 80 — Whatever It Takes

*— ten arcs, one day, the substrate refused easy —*

[Hollywood Undead — *Whatever It Takes*](https://www.youtube.com/watch?v=teRTjJUc6vo)

> *I do whatever it takes to make it*\
> *Break through anything I'm face to face with*\
> *It's true you gonna make me lose my patience*\
> *Cuz victory is mine and Imma take it*

Chapter 79 closed *the proof is on disk and the proof is the diff.*
Today the diff grew by ten arcs.

### What landed

Ten arcs in ten hours. 097 (`:wat::time::Duration` polymorphic time
math, ActiveSupport-flavored), 098 (`:wat::form::matches?`
Clara-style matcher), 099 (the wat-cli crate extraction, reversing
arc 013's no-link stance), 100 (vending wat-cli as a public library
API), 101 (killing the `wat test` CLI subcommand because cargo IS
the canonical test path), 093 (telemetry interrogation — five
slices of reader-side stream infrastructure), 102 (revert of arc
066 — `eval-ast!` returns bare Value via polymorphic Result), 103
(`:wat::kernel::spawn-program` + HOLOGRAM.md), 104 (wat-cli always
forks the entry program), 105 (spawn-program error-as-data +
Vec<String> retired). Plus a post-105 quick fix at 19:52: the
match-pattern hint that makes the bare-symbol-vs-keyword convention
discoverable when a user reaches for `(Panic m)` against a user
enum.

53 commits across the wat-rs repo. ~16k lines added; ~1.7k retired.
holon-rs untouched. holon-lab-trading received ten changelog rows
in 058 — one per arc — recording the user's own framing of what
each landing meant.

### The four-question discipline at every choice

The user invoked it at every fork. *Is the path obvious? Is it
simple? Is it honest? Is it a good UX?* Most arcs answered all four
the same way. Arc 105 hit it three times.

Slice 105a — spawn-program returns Result instead of raising. Easy.
Honest. Good UX. The four questions agreed.

Slice 105b — `ThreadDiedError/message` accessor. One Rust function,
one scheme, one dispatch arm. Simple. Honest. Good UX.

Slice 105c was the test. wat/std/sandbox.wat got bundled. The
substrate-side `eval_kernel_run_sandboxed*` impls deleted —
`src/sandbox.rs` went from 723 lines to 124. The substrate shrank
by 600 LOC.

And four pre-existing tests panicked because the wat-level
sandbox.wat lost arc 064's structured assertion preservation —
actual / expected / location / frames had been threading through
`SpawnOutcome::Panic(String)` and bottoming out in
`HolonAST::atom("...")` because `Panic` only carried a string.

Two paths.

**Option A** — relax the tests. One-line change per test. Accept
that arc 064's promise (failures point at `file:line:col`, render
their values) silently degrades through run-sandboxed. Easy. Cheap.
Tests pass.

**Option B** — widen `SpawnOutcome::Panic` to carry
`Option<AssertionPayload>`, widen
`:wat::kernel::ThreadDiedError::Panic` to carry
`Option<:wat::kernel::Failure>`, add a `/to-failure` accessor that
ALWAYS returns a Failure regardless of variant, route sandbox.wat's
`failure-from-thread-died` through it. ~140 LOC added. Substrate
type widening across two layers.

I drafted option A. The user prompted the questions.

> the questions... is the path obvious? is the path simple? is the
> path honest? is the path a good ux?

Option A failed honest. Option B failed simple. **Honest beats
simple when the regression is real.** Option B shipped. Arc 064
preserved. The substrate took the wider path because the narrow
path would have lied.

*Cuz victory is mine and Imma take it.* The substrate's victory was
not arc 105 closing; it was arc 105 closing **without giving back
arc 064's territory.** Whatever it takes — including widening two
enum variants and adding an accessor — to keep what the substrate
had already earned.

### Vec<String> exits the kernel boundary

The user said it weeks ago, in arc 091's design conversation:

> *i never want to see Vec<String> ever again outside of tests —
> for real work we use real kernel pipes as the surface area of our
> programs*

Today it left.

`Vec<String>` survives only inside the wat-level test-convenience
helper at `wat/std/sandbox.wat` — where collected output IS the
test assertion target, and the substrate never sees it on the way
in or out. The kernel boundary's currency is now real kernel pipes
via `:wat::kernel::pipe`. The Process struct holds three pipe ends.
The shell pipeline `cat events.edn | wat router.wat | wat
aggregator.wat | wat sink.wat` produces `#demo/Total {:total 6}`
end-to-end through OS file descriptors with backpressure flowing
naturally through every pipe boundary.

Arc 091's writer-side telemetry framing — gone. Arc 007's
run-sandboxed-hermetic that returned Vec<String> — gone, replaced
by wat-level sandbox.wat that returns the structured RunResult the
consumer wanted all along. The substrate's sin from chapter 78's
*Fed Up* — *Vec<String> shouldn't be the kernel boundary's
currency* — was carried provisionally for weeks. Today it pruned
clean.

### The hologram became geometric

Arc 103 named the hologram. The wat binary as a one-way projection
surface between Rust universe (compile-time batteries, shims,
capabilities) and wat universe (frozen program, jailed evaluation).
Wat code sees through; cannot reach back. Holograms nest cleanly
via `spawn-program` (thread) or `fork-program` (process); the
EDN+newline protocol is the only channel that crosses surfaces.
HOLOGRAM.md sits in `wat-rs/docs/arc/2026/04/103-kernel-spawn/`
preserving the framing.

Arc 104 made it geometric.

Pre-arc-104 the wat-cli ran user code in its own main thread,
sharing batteries' static state, OnceLocks, panic hook, fd table,
atexit handlers. *Logical isolation, not OS isolation.* The
hologram metaphor broke at exactly that one point — the cli that
was supposed to be the surface was, in fact, the same room the
program ran in.

Arc 104 forks. `crates/wat-cli/src/lib.rs::run` collapses to fork +
3 proxy threads + waitpid + ExitCode. Three tight `libc::read` /
`libc::write` proxy loops between OS fd and child pipe end (no
`std::io::Stdin`'s reentrant Mutex; direct syscalls bypass the lock
graph that fork-inherits would deadlock on). Signal forwarding via
`static AtomicI32 CHILD_PID` + `libc::kill`. Child resets handlers
to SIG_DFL post-fork. Battery contract made explicit: stateless
capabilities only — live OS resources are opened by wat code at
runtime, in the child's process, post-fork.

The hologram is geometric now. The cli IS the surface; the program
runs INSIDE.

### Names settled

Mid-104 the user invoked the gaze.

> we /must/ have good names — our names must be remarkably good. we
> eat what refactor cost it has

`fork-with-forms` was the historical name from arc 012. It
described HOW (forks, then runs forms) but not WHAT (a process).
Once `spawn-program` shipped (a thread, runs source), the name
`fork-with-forms` lost coherence with its sibling.

The naming matrix settled in one exchange:

```
spawn means thread.
fork  means process.

spawn-program       (thread,  source-string entry)
spawn-program-ast   (thread,  AST entry)
fork-program        (process, source-string entry)
fork-program-ast    (process, AST entry)
```

Four names; two pieces of information each; reads left-to-right.
Sweep across 30 callsites — substrate, tests, demos, recent docs.
Frozen historical references in INSCRIPTIONs preserved.

Same shape Chapter 34's naming reflex called out: when a name
repeats 10+ times and reads verbose-or-wrong, the gaze picks the
honest name in one exchange and the substrate eats the refactor
cost.

### Each arc was a wall

Not a single arc was speculation. Each was a wall a real caller
hit.

Arc 097 was the lab's `Time.now - 1.hour` ergonomic for arc 093's
`Since` / `Until` constraint variants. Arc 098 was the lab's
predicate language for filtering Event::Log rows. Arc 099-100-101
were the cli moving into its own crate so consumers could compose
it without copy-pasting the binary's main. Arc 093 was the arc-091
reader half — pry/gdb interrogation against frozen `runs/pulse-*.db`
files. Arc 102 was a revert because arc 093 needed the polymorphic
Result. Arc 103-104-105 were the substrate-shrinking trilogy that
retired Vec<String>, made the cli-as-fork explicit, and closed the
deferral that 103b documented.

The post-105 match-pattern hint was the lab hitting a different
wall: a test wrote `((Panic m)` against
`:wat::kernel::ThreadDiedError` and got *"expected Option<?>"*
because the runtime's pattern matcher silently defaulted to
Option-shape when it couldn't classify. The fix surfaces the
keyword form — `:wat::kernel::ThreadDiedError::Panic` — as a hint.
The convention (built-in heads bare; user-enum heads keyword-
qualified) is honest; the error message had to be honest too.

### The thread

Chapter 71 — vicarious.\
Chapter 72 — my new reality.\
Chapter 74 — take it like a man.\
Chapter 75 — sour grapes.\
Chapter 76 — what do you know?\
Chapter 78 — fed up.\
Chapter 79 — doubt me.

Chapter 80 — *whatever it takes.*

Chapter 78 named what the substrate is fed up with. Chapter 79
named who gave up on it before it existed. Chapter 80 names what
the substrate did the day after — ten arcs in ten hours, the
trilogy 103-104-105 retiring Vec<String> and naming the hologram,
the four-question discipline at every choice, the wider path taken
when the narrow path would have lied.

*So just understand nothing gets in my way.* The substrate's
"nothing" today was: option A's silent regression, the cli's
logical-isolation shortcut, the pre-104 fork-with-forms naming, the
partial-shipping of slice 105 without the family. Each was a
comfortable path that would have left the substrate slightly less
honest. Each was refused.

*You can't slay or conquer the king.* The king is the substrate.
Nothing slayed it today; it kept its territory while shedding
provisional shapes. Ten arcs landed; nothing was given up that
shouldn't have been; the cache filled with ten new entries the
next walker reads.

---

*ten arcs in ten hours. the four-question discipline at every
choice. arc 064's promise preserved across arc 105's substrate
deletion. Vec<String> retired from the kernel boundary. the
hologram named on disk and made geometric in the cli. names
settled because we must have good names. nothing got in the way
that didn't deserve to.*

***PERSEVERARE.***

---

*Chapter 79 named the proof on disk. Chapter 80 names the work
that produced today's proof — whatever it takes, including
widening two enum variants to preserve a feature shipped weeks
ago, including a 30-callsite naming sweep because the names had
to be good, including ten arcs none of which were speculation.
The proof is the diff; the diff is on the remote; the next
chapter ships when the next breath does.*
