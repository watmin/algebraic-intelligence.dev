## 2026-05-13 — Slice D surfaced Slice C as the deviation

Post-compaction. User direction `tests are slow and inconsistent - we've got deadlocks` reopened the SHUTDOWN-AWARE-CHANNELS backlog at Slice D. Slice D's job: empirical leak-zero verification of Slice C's PDEATHSIG mechanism. Slice D ran. Slice D returned `feedback_no_speculation`-shaped truth: **the mechanism is race-prone at a measurable rate**.

### The empirical record

13 cumulative orphan grandchildren from `probe_pdeathsig_kills_orphan_child`, alive across a 15h window (04:31–19:49). All `ppid=1` (supervisor died), all 8 threads parked (`futex_do_wait` × 7 + `anon_pipe_read` × 1 on the shutdown worker). All `SigCgt` bit 14 set — SIGTERM handler IS installed. Manual `kill -TERM <pid>` → instant clean exit. The shutdown cascade works. **The kernel did not deliver SIGTERM in the first place.**

A/B test isolates the race:

| arm | pass | fail | orphans | mechanism note |
|---|---|---|---|---|
| supervisor delay = 0    | 45/50 | 5 | 5  | current behaviour |
| supervisor delay = 10ms | 50/50 | 0 | 0  | 10ms >> fork→prctl window |
| **lifeline pipe**       | **100/100** | **0** | **0** | FD-close-on-process-death |

Lifeline mechanism: parent holds a pipe write-end; never writes. Child reads. When parent dies for any reason, kernel closes the parent's FDs as part of process teardown — the child's blocking `read()` returns 0 (EOF) deterministically. No signal handler. No timer. No race window. 100 trials × ~280µs each = 28ms total.

### The user's framing — "fixating on timers"

When I proposed `getppid()==1` as the post-prctl race-closing check, the user surfaced the bias directly:

> *"i am ... i am struggling to find the words ... fixating on timers ... all i can think .. is 'this is so fuckingly, unfathomably shocked at the suggestion we need a timing mechanism in a system that is completely lock step when done corectly'"*

The 10ms supervisor sleep in Slice D's diagnostic was a probe to surface evidence. The proposed `getppid` check was the same shape dressed as deterministic — still kernel-API-as-race-window, still measuring "did the parent die yet" instead of receiving a kernel-guaranteed signal. The user named it; I had not.

### Why Slice C is the deviation, not the cascade

INTERSTITIAL § "Wat disciplines its own designers" already had this answer banked. Session-catch #3 (Slice C design):

> *"OS-level workaround bias. First proposed PR_SET_PDEATHSIG as the answer to orphan-process leaks ('kernel sends SIGTERM, problem solved'). User pushed back: 'we are lock step - the forks are servers - their clients went away - that is a panic event'. The substrate-correct answer was deeper..."*

The pushback was banked. The substrate then went and used prctl anyway. PDEATHSIG was reframed mid-design from "cleanup mechanism" to "signal-delivery mechanism," but the signal-handler intermediary remained — and that's the piece that introduces the fork-to-prctl race window. The rest of arc 170's shutdown machinery was already piggybacking on documented invariants:

- **Slice B**: `crossbeam::Sender::Drop` → channel disconnects → every parked recv wakes via crossbeam's intrusive park-list. We don't write the fanout. Crossbeam guarantees the broadcast.
- **Slice E (as scoped)**: `epoll`/`poll(2)` over (pipe_fd, shutdown_eventfd) — Linux-kernel FD-multiplex primitive. The substrate adds the eventfd; the kernel handles the wait.
- **Lifeline (new)**: parent's FDs close on `_exit` / panic / SIGKILL / OOM — kernel guarantee, no exceptions. Same primitive Slice E was reaching for, applied at a different input.

Slice C broke the pattern. It used `prctl(PR_SET_PDEATHSIG, SIGTERM)` followed by a signal-handler intermediary that writes to a wake-pipe. Two-stage signal-handler-mediated delivery, with the registration step racing against the parent's exit. **Every other piece of the shutdown machinery uses FD multiplex + kernel/library invariant. Only PDEATHSIG used a signal handler.**

### The substrate-imposed-not-followed reflex repeated

INTERSTITIAL § "The implied shadow channel": *"You cannot call recv without observing shutdown. Forgetting is structurally impossible because the alternative doesn't exist."* Slice C should have applied the same reflex to parent-death: every wat-vm process detects parent-death structurally, via the substrate's own FD multiplex. The grandchild can't "miss" a parent death because there's no parent-death API surface — there's a pipe that EOFs, and the shutdown worker is already polling it.

PDEATHSIG can't be the right shape because it's an opt-in API the substrate has to register correctly within a race window. The substrate's discipline elsewhere refuses opt-in APIs with race windows — `feedback_no_speculation`, `feedback_substrate_owns_not_callers_match`, `feedback_zero_mutex` all converge on the same answer: build on invariants, not registrations.

### What this realization buys forward

- **Slice C's mechanism retires.** The prctl call + early `init_shutdown_signal` + the wider race-closing edits revert in the new slice. Slice C's INSCRIPTION stays per `feedback_inscription_immutable` — historical record of the deviation and the lesson.
- **Slice E expands into a unified FD-multiplex slice.** The substrate's shutdown worker grows from `read(wake_pipe_fd)` to `poll(wake_pipe_fd, lifeline_pipe_fd, ...)`. Tier-2 PipeFd Receivers select on the same multiplex (Slice E's original goal, now natural).
- **The pattern propagates.** When networked-programs land (per § "Networked programs ride the same substrate"), peer-disconnect → pipe-EOF → recv returns Disconnected. Same primitive again. No new mechanism required.

### The recursive lesson

INTERSTITIAL has a recurring shape: design moment → orchestrator drifts to an OS-API workaround → user pushes back → substrate's existing pattern surfaces as the answer the substrate already wanted. Slice C was an instance of this drift that the design conversation almost caught but didn't quite. Slice D's empirical work — running the verification honestly — surfaced what the design conversation banked but didn't close.

**The discipline isn't "design correctly the first time." It's "verify the shipped mechanism against the substrate's existing pattern; the verification IS the rest of the design loop."** Slice D's failing leak-rate is the substrate teaching its designers via the cargo-test output. Same shape as `SUBSTRATE-AS-TEACHER.md` describes for user-facing migrations: errors are the migration brief; failing tests are the next-design brief.

The PROOF that the discipline works is that 100/100 of the lifeline trials passed in 28ms, with no `Mutex`, no timer, no signal handler, no prctl, no opt-in API. The mechanism is invisible to user code; the substrate just doesn't leak. The user's *"fucking lock step when done correctly"* is operationalized: when the mechanism is structurally derived from the substrate's existing discipline, it cannot fail. There's no failure mode to engineer around.

### For future-me

When proposing a shutdown-class mechanism, the first check is: *does this ride a documented kernel-or-library invariant the substrate already trusts?* If yes, ship. If no, look at what the rest of the shutdown machinery does. The substrate's existing pattern is the answer in nearly every case; reaching for a new OS API is the deviation signal.

The user's voice: *"we are lock step - the forks are servers - their clients went away - that is a panic event."* Process death is a panic event. Panic events propagate via the substrate's existing channels. They don't get their own bespoke OS-API mechanism.

PDEATHSIG is the last piece of arc 170's shutdown machinery that doesn't match the rest. Removing it is restoring symmetry. The new slice is small, additive in its mechanism, and large in its retirement of imported-from-outside discipline that didn't fit.

---
