---
title: "2026-05-13 — Session-end breadcrumb: FD-multiplex shipped, sweep is the road home"
sidebar:
  order: 24
---

**Recovery anchor for post-compaction me.** This session did substantial closure work toward arc 170. Read this first.

### What shipped (commit chain on `arc-170-gap-j-v5-deadlock-state`)

The FD-multiplex slice — 8 commits — substrate-imposed-not-followed applied to shutdown lifecycle:

| Phase | Commit | What |
|---|---|---|
| Slice A f/u | `6a2ca0c` | workspace test-build Shutdown arms (3 test files) |
| Slice D | `198c30b` | PDEATHSIG race confirmed 10%, lifeline pipe 100/100 |
| Phase 1A | `61217c7` | shutdown worker polls N FDs |
| Phase 1B | `8714a6f` | spawn-process lifeline; PDEATHSIG retired |
| Phase 1C | `daa411a` | fork-program lifeline; PDEATHSIG retired |
| Phase 1D | `c1cb4dc` | substrate-mechanism probe + leak-zero gate; FIX Phase 1B FD-inheritance defect |
| Phase 1E | `d609c1e` | fork.rs close_inherited_fds_above_stdio FD hygiene |
| Phase 2 | `6062cfc` | tier-2 PipeFd Receivers wake on shutdown |
| Phase 3 | `bed1a71` | canonical child_post_fork_init helper + pidfd probe migration |

**Substrate guarantee earned:** no recv exposed by wat — crossbeam OR pipe-fd — can outlive a shutdown event. Three triggers (SIGTERM/SIGINT, parent-process death via lifeline, future signals via arc 197), two propagation paths (crossbeam Sender::Drop fanout, broadcast-pipe POLLHUP), one kernel primitive (FD-close-on-process-death / pipe-EOF-on-write-end-drop) applied at every boundary.

### Lessons from this session's mistakes (the ones I need to remember)

**1. I asserted Gap J was the blocker without grepping.** INTERSTITIAL's earlier sections diagnosed Gap J as the V5 reverter. I read those descriptions and reported "Gap J blocks slice 3b" as current state. Verification surfaced Gap J shipped weeks ago at `c3f2bf7` (`splice_type_decls_user` at src/types.rs:1277). `feedback_assertion_demands_evidence` failed: the disk truth wasn't checked before the claim. **Discipline: every assertion about substrate STATE needs a grep before it leaves my mouth.**

**2. I claimed "the testing-infra migration is feasible now" — also from stale framing.** The modern macros `:wat::test::run-hermetic` (Layer 1, wat/test.wat:574) and `run-hermetic-with-io<I,O>` (Layer 2) ALREADY EXIST, ALREADY route through spawn-process, and `deftest` + `deftest-hermetic` ALREADY use them. The user-facing migration is largely done. What remains is the LEGACY function-style wrappers (`:wat::test::run`, `run-ast`, `run-hermetic-ast`) which still call legacy substrate primitives. 32 active sites across wat-tests/ + tests/ + crates/ + examples/. **The remaining 170 work is mechanical sweep + delete, not architectural.**

**3. Pressure-flake substrate race surfaced but unresolved.** Phases 1A-3 eliminated the original 2 pressure failures (stream + lru) but the workspace failure count stayed at 11 — the failure SET rotated to different deftests hitting the same workspace-pressure 5000ms timeout. The chained-fork-pressure pattern persists. Not blocking arc 170 closure (the pre-existing 9 failures aren't FD-multiplex regressions) but worth naming as a future investigation. The substrate has a contention point under workspace fanout that Phase 3 didn't reach.

### User directive (load-bearing for everything that follows)

2026-05-13: *"we are killing all prior forms of thread and process management - the only remaining forms are spawn-thread and spawn-process / we can write whatever macros we want ontop of those - but there is exactly one way to make a thread and exactly one way to make a process - zero wiggle room / a macro making it convenient for tests is necessary for the UX but it must replace every test site - we are doing a massive refactor and i do not give a shit about how much we break / we do the hard work to ensure no fucking mistakes can ever happen again"*

Inscribed as memory `project_one_spawn_per_concern`. THE doctrine for arc 170 closure.

### Where we are mid-stride

**Slice 4a BRIEF + EXPECTATIONS committed at `5cf134d`.** Not yet sonnet'd. The 32-site sweep is the next move when work resumes.

The closure roadmap (tasks #308-#312):

- **4a** — sweep 32 legacy callers → `:wat::test::run-hermetic` (BRIEF on disk, awaiting sonnet)
- **4b** — wat-cli Stone B (`fork_program_from_source` → spawn-process, 6 hits in crates/wat-cli/src/lib.rs)
- **4c** — substrate Rust deletion (src/spawn.rs 351 lines, fork-program family from src/fork.rs, dispatch arms from src/runtime.rs, wat/kernel/sandbox.wat + hermetic.wat). KEEP `BareLegacy*Program` walker arms permanently as the structural guard.
- **4d** — Phase H clippy + warning sweep (mandatory INSCRIPTION precondition per DESIGN.md status header).
- **4e** — Slice 5 INSCRIPTION + closure. Unblocks arc 109 v1 milestone closure (task #229).

### Recovery instructions for post-compaction me

1. **Read this entry first.**
2. **Read `project_one_spawn_per_concern` memory** — the doctrine.
3. **Verify state on disk:**
   - `git -C /home/watmin/work/holon/wat-rs log --oneline | head -15` should show the 8 FD-multiplex commits + Slice 4a BRIEF commit (`5cf134d`).
   - `git status --short` should be clean.
4. **Pick up at Slice 4a:** the BRIEF is committed at `5cf134d`. Spawn sonnet on it. Time-box 90 min per EXPECTATIONS.
5. **DO NOT redo any of the FD-multiplex Phases 1A–3.** They are shipped. Verify with `ls docs/arc/2026/05/170-program-entry-points/SCORE-FD-MULTIPLEX-PHASE-*.md` — 7 SCORE docs should exist.
6. **DO NOT re-diagnose Gap J.** It shipped at `c3f2bf7` — `src/types.rs:1277` has `splice_type_decls_user`. Verify before any claim about register_types behavior.
7. **DO NOT re-investigate "is the testing-infra migration feasible."** The macros exist and route through spawn-process. Slice 4a is consumer sweep, not architectural design.

### The voice for the closure ahead

This session's discipline catches:
- "I don't know" said honestly when caught speculating (vs hedging)
- Four-questions YES/NO per candidate (not comparison-shopping)
- Stepping stones over one-shot
- Communicate through the disk (BRIEFs + SCOREs as the protocol)
- Substrate-imposed-not-followed: the structurally-impossible-to-bypass shape is the goal

Future-me: when you wake up here, the boss is in sight. Three weeks of refactoring on the 109 → 170 chain. Arc 170 closes when 4a-e ship. The user has been patient through V1-V5 reverts; deliver clean.

---
