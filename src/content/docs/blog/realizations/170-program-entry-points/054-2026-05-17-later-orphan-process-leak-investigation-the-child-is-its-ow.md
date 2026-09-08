---
title: "2026-05-17 (later) — Orphan-process leak investigation: the \"child is its own lifeline k…"
sidebar:
  order: 54
---

User direction mid arc 208 slice 1 spawn: *"can we research what we think is causing the leaked procs?... its been a running theme of 170 as we've been working on process management.. we killed all other leaks and have just been carrying these along while we fix other things - i wonder if we're closer to resolving them.. not sure..."*

Followed by: *"get notes in the 170 arc so we don't forget it - we'll use those notes if the latest rounds of change don't fix it."*

### The session's empirical evidence

`pgrep -af "target/release/deps"` returned 6 orphan test processes accumulated from prior runs. Two distinct leak patterns:

**Pattern A — wat-test orphan pairs (PPID=1):**
- PID 1873467 (PPid=1; state S; wchan `anon_pipe_read`) + child 1873491 (PPid=1873467; state S; wchan `futex_do_wait`)
- PID 1951496 (PPid=1; same shape) + child 1951550 (same shape)

Process name `wat-test:::wat-` indicates wat-substrate-spawned subprocesses. The IMMEDIATE PARENT was killed/exited (PPid=1 = init = the original cargo test runner is dead), but these orphan subprocesses survived AND their own children (1873491, 1951550) also survived.

**Pattern B — stuck t12 chain (intact lineage; test never completed):**
- 1949329 → 1953005 (wat_arc170_program_contracts test bin) → 1953103 (t12_spawn_process_* deftest)
- All in `futex_do_wait`; test got hung mid-execution; lineage intact = NOT orphan, just stuck

### The smoking gun — FD table of orphan 1873467

13 open FDs (all pipes). Critical pair:

```
fd 3 -> pipe:[2159151]  (READ end)
fd 4 -> pipe:[2159151]  (WRITE end of the SAME pipe)
```

**The orphan is blocked on `anon_pipe_read` while itself holding the WRITE end of the pipe it's reading.** The read will never see EOF because the orphan is its own writer.

This is exactly the pattern `src/spawn_process.rs:303` explicitly tries to prevent:

```rust
// If the child keeps this copy open, the lifeline never EOFs when the
// parent dies — the child would be its own lifeline keeper.
// Closing it here ensures parent-death → POLLHUP on lifeline_r_raw.
drop(lifeline_w);
```

The substrate KNOWS this failure mode + intentionally guards against it. The orphan demonstrates the guard is incomplete somewhere along the spawn_process FD lifecycle.

### Hypothesis (not yet proven; needs instrumented FD tracing)

The fault candidates:

1. **`mem::forget(lifeline_r)` at `src/spawn_process.rs:339`** — the substrate keeps the child's `lifeline_r` raw fd alive across the child_post_fork_init transition by leaking the OwnedFd. The parent's flow may have a symmetric path where it keeps both ends accessible via a raw fd, then the OwnedFd drop doesn't actually close them.

2. **Nested spawn-process FD inheritance.** When parent A spawns child B, then child B (in the parent's address space briefly) calls another spawn-process to create grandchild C, the FD table inheritance may dup C's lifeline FDs into A's table. Phase 1E (`fork.rs close_inherited_fds_above_stdio`) was supposed to close non-stdio FDs at child startup, but the fix may not cover all paths (it covers fork.rs; doesn't necessarily cover spawn_process.rs's path).

3. **The grandparent-test-runner death sequence** — when cargo test (grandparent of A) is killed mid-run (e.g., SIGTERM from user, harness timeout, panic-induced exit), its FDs DO close. But if A had passed any FDs to its own child B by inheritance, those FDs survive in B regardless of grandparent state. The "child is its own lifeline keeper" pattern visible in orphan 1873467 has the orphan holding fd 4 (its own pipe's write end). That fd 4 wasn't inherited from cargo test (cargo test wouldn't have written-end ownership for a pipe A was supposed to read from); it was CREATED by A or its progeny.

### What's been tried (the running theme of arc 170)

| Phase / Slice | Aim | Result |
|---|---|---|
| Slice C (initial) | PDEATHSIG-based orphan prevention | DEVIATED — race window between fork + prctl; superseded |
| Slice D | Empirical orphan-rate measurement; lifeline-pipe vs PDEATHSIG A/B | Confirmed lifeline-pipe 100/100, PDEATHSIG ~10% race |
| Phase 1A | Shutdown worker polls N FDs | Shipped; lifeline mechanism foundation |
| Phase 1B | spawn-process lifeline; retire PDEATHSIG | Shipped; the canonical mechanism |
| Phase 1C | fork.rs symmetric retirement | Shipped |
| Phase 1D | Substrate-mechanism probe + leak-zero gate | Shipped; passed at time of slice |
| Phase 1E | fork.rs `close_inherited_fds_above_stdio` defect | Shipped; FD hygiene at fork.rs path |
| Phase 2 | Tier-2 PipeFd Receivers wake on shutdown | Shipped |
| Phase 3 | Canonical `child_post_fork_init` helper | Shipped |

Yet the leak persists. The current orphan signature is post-all-of-the-above. The Phase 1E fix covered `fork.rs`; the spawn_process.rs path may have its own FD-inheritance leak the Phase 1E sweep didn't reach.

### What WILL NOT fix this directly

- **Arc 208 (Process I/O Result flip)** — flipping `Process/println` + `Process/readln` to Result-returning addresses a DIFFERENT concern: panic-on-disconnect at user wat level. Orphan leak is at substrate FD lifecycle, not user error-handling.
- **Arc 207 (typed Uuid)** — orthogonal concern; type-system honesty for UUID surface.
- **The protocols arc (defservice meta-form)** — orthogonal; abstracts service patterns; doesn't touch spawn_process FD path.

### What WILL fix it (the investigation path when ready)

1. **Instrumented FD tracing of `src/spawn_process.rs`** — log every `make_pipe` + every `drop` of OwnedFd with the pipe inode. Run the failing pattern (likely nested spawn-process from a parent that's killed mid-flight). Observe where pipe 2159151's write-end ownership lands and why it doesn't drop.

2. **Audit `mem::forget(lifeline_r)` callers** — every `mem::forget` of an OwnedFd is a deliberate FD leak. Each one needs justification + counter-mechanism (the raw fd is consumed by some other path that closes it). If the counter-mechanism doesn't fire in some code path (e.g., panic during child_post_fork_init), the FD is genuinely leaked.

3. **Test the nested-spawn hypothesis** — write a focused probe: parent spawns child, child spawns grandchild, kill parent, observe whether child + grandchild both exit cleanly. If grandchild leaks, FD-inheritance-across-fork is the bug.

4. **Mirror Phase 1E for spawn_process.rs** — if the audit confirms FD inheritance leakage, add `close_inherited_fds_above_stdio`-equivalent at the spawn_process post-fork path. Phase 1E protected fork.rs; spawn_process needs the same shield.

### Concrete signature for future-me to verify the leak is RESOLVED

When investigation concludes:
- Run: `for i in $(seq 1 20); do cargo test --release --workspace --no-fail-fast 2>&1 | tail -5; pkill -9 -f "target/release/deps"; sleep 1; done`
- After: `pgrep -af "target/release/deps" | wc -l` should return 0 across all 20 trials
- The `lifeline_pipe_zero_orphans_across_100_trials` baseline failure should also stabilize to 0/100 if the same root cause underlies it

### When to act on these notes

Per user direction: *"we'll use those notes if the latest rounds of change don't fix it."*

Arc 207 (typed Uuid) shipped; arc 208 (Process I/O Result) in flight. Neither addresses this. If after both ship + after arc 203 / arc 170 closure work continues, the orphan signature is STILL present in `pgrep` output → these notes are the diagnostic. Open a focused FD-hygiene-investigation arc with the audit path above.

If the orphan signature has DISAPPEARED post-some-other-arc unexpectedly (some indirect path closed it), great — the notes were preserved as failure-engineering record per `project_failure_engineering` doctrine; no action needed.

### Why this got kicked down the road historically

Per user 2026-05-17 framing: *"we killed all other leaks and have just been carrying these along while we fix other things - i wonder if we're closer to resolving them."* The arc 170 chain prioritized:
- Shutdown-aware channels (slices 1-5)
- spawn-process bootstrap (Stone A, C, etc)
- structured-exit protocol (slice 1i)
- bracket combinators (D1-D3)
- typed Uuid (arc 207)
- Process I/O Result (arc 208)

Each was higher-leverage than chasing the residual orphan leak. The leak persists but doesn't block production code (it accumulates in test runs; reaped periodically). When the substrate is otherwise impeccable, this is the last leak to close.

### Cross-references

- `src/spawn_process.rs:303` (the comment naming the failure mode)
- `src/spawn_process.rs:339` (`mem::forget(lifeline_r)` — the deliberate leak point for child side)
- INTERSTITIAL § 2026-05-13 "Slice D surfaced Slice C as the deviation" — the lifeline-pipe vs PDEATHSIG architectural correction
- INTERSTITIAL § 2026-05-13 (FD-multiplex shipped) — the 8-commit chain Phase 1A-3
- `tests/probe_lifeline_pipe_proof.rs` — the dedicated leak-zero gate (currently flaky)
- `project_signal_cascade` memory — pgid + killpg cascade (independent mechanism; doesn't fix this)
- `feedback_no_speculation` — the user direction that drove arc 170 to empirical measurement over hypothesis

---
