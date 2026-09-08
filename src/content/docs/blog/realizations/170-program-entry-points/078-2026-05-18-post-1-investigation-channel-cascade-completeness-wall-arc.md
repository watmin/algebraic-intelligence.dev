---
title: "2026-05-18 (post-δ-1 investigation) — Channel-cascade-completeness wall (arc 213 χ) + th…"
sidebar:
  order: 78
---

### What surfaced

Arc 213 δ-1 (additive `pidfd: Pidfd` field to ChildHandleInner) introduced a **15% hang rate** in `wat_arc170_program_contracts` under parallel cargo test execution, accompanied by **4+ accumulating orphan test-binary processes** per trial-batch — the exact class arc 213 exists to prevent.

Per `feedback_defect_fix_or_panic_never_revert` (saved this session) + user's halt 2026-05-18: *"do not revert - we have an active replication - prove a fix exists or a panic is observerable - deadlocks are illegal - do not lose our observable / this is absolutely no longer acceptable - this guidance is expired"* — the replication stayed on disk.

(Mid-investigation: the dirty tree got reverted by an `&&` chain that I mistakenly believed was rejected. The full δ-1 transcript was recovered via the procedure in `wat-rs/docs/arc/2026/05/121-deftests-as-cargo-tests/AGENT-TRANSCRIPT-RECOVERY.md` — agent JSONLs preserve every Edit/Write input verbatim, replayable via a Python script. Save: `feedback_jsonl_transcript_recovery`. The new doctrine `feedback_defect_fix_or_panic_never_revert` is what kept the discipline intact through the recovery cycle.)

### The diagnosis (chronological)

1. **Replication preserved** + reproduced: 3 hangs / 20 trials (15% rate); 4 orphan test binaries accumulated; all on `futex_do_wait`
2. **strace on orphan PID 266881:** 7 threads, 6 sharing futex `0x5ee725db17d8` value=2 (single crossbeam channel), main on different futex; **NO thread in poll()** — shutdown_worker absent
3. **/proc/<orphan>/fd inspection:** 7 fds total — stdio (0/1/2) + lend_ambient dups (3/4/5) + fd 48 → `pipe:[547088]`; no wake_pipe / broadcast_pipe → shutdown_worker either never started OR already exited
4. **System-wide pipe inode 547088 search:** ONLY fd 48 in orphan 266881 holds it — ZERO writers — **the lifeline IS at EOF**
5. **Thread names (`/proc/PID/task/<tid>/comm`):** `t17b_run_hermet` (main) + 3× `wat-thread:::wa` + `wat-stdin-bridg` + `wat-stdout-brid` + `wat-stderr-brid` — the orphan is the TEST BINARY itself running `t17b_run_hermetic_layer1_failing_assertion_surfaces_failure`; the 6 sharing-futex threads are the trio bridges + wat-level spawn-thread threads

### The root cause

The substrate's shutdown cascade design (per § 2026-05-13 "How the shadow channel fans out"):
- `init_shutdown_signal_with_inputs` spawns a worker thread that polls lifeline_r + wake_pipe + broadcast_pipe
- On POLLHUP / POLLIN: worker drops SHUTDOWN_TX
- crossbeam's intrusive park-list broadcasts wake to every parked recv on a SHUTDOWN_RX clone
- ALL recv()s in the substrate are supposed to route through `typed_recv` (src/typed_channel.rs), which does `select! { data_rx, shutdown_rx }`

**The gap:** 15 substrate recv sites BYPASS typed_recv and call `crossbeam_channel::Receiver::recv()` directly:
- `src/thread_io.rs`: 9 sites (trio bridges + ThreadIO plumbing — the orphan's `wat-stdin-bridg` / `wat-stdout-brid` / `wat-stderr-brid` threads ARE these)
- `src/runtime.rs`: 5 sites (`ProgramHandleInner::InThread(rx) => match rx.recv()` — spawn-thread wait paths)
- `src/freeze.rs`: 1 site (same `InThread(rx).recv()` pattern)

Pre-δ-1: the test binary's ChildHandleInner::Drop ran `libc::kill(pid, SIGKILL) + libc::waitpid(pid, ...)` which BRUTE-KILLS the child regardless of cascade-completeness. The SIGKILL fallback masked the bare-recv class gap.

Post-δ-1: Pidfd held in ChildHandleInner shifts WHEN Drop fires (now tied to last Arc<ChildHandleInner> drop, possibly never on test scope-exit paths where Process struct held longer). When SIGKILL doesn't get to fire, the cascade is the only path — and it has the 15-site gap.

### Four-questions verdict (run YES/NO atomically per `feedback_four_questions_yes_no`)

| Candidate | Obvious | Simple | Honest | Good UX |
|---|---|---|---|---|
| (A) L2 wall: substrate-owned `wat::channel::Receiver<T>` newtype; bare `crossbeam::Receiver::recv()` unreachable outside `typed_channel.rs`; all 15 sites migrate via compile errors | YES | YES | YES | YES |
| (B) Migrate 15 sites + walker forbidding bare recv | YES | NO | NO | NO |
| (C) Fix-then-wall (B then A) | YES | NO | YES | YES (eventually) |
| (D) Narrow patch of δ-1 to avoid trigger | NO | YES | NO | NO |
| (E) Revert | — | — | — | FORBIDDEN |

**A wins YES-YES-YES-YES.** Same shape as arc 198 `restricted_to` / arc 203 struct-restricted / arc 212 ζ-newtype-wall — substrate-imposed-not-followed at the channel layer.

### The χ doctrine (load-bearing)

> **"We are our own users — and i don't want to observe this failure ever again."** — user 2026-05-18

This is the substrate's identity-doctrine restated: every gap we find IN OUR OWN USAGE is a gap the substrate must eliminate STRUCTURALLY. Not via convention, not via walker discipline, not via "be careful next time." Via type-system impossibility.

The χ stone (channel-cascade-completeness wall) is the build-tools-prove-against-known-failures discipline applied at the channel layer:
- **TOOL**: `wat::channel::Receiver<T>` newtype + restricted imports
- **KNOWN FAILURE**: 15% hang rate on `wat_arc170_program_contracts` parallel runs
- **PROOF**: post-χ, 50-trial replication shows ZERO hangs

Per `feedback_attack_foundation_cracks` + `feedback_no_known_defect_left_unfixed`: the crack δ-1 surfaced IS the fix-target; the fix lives in arc 213 (per "we fix what we break when we break it"), inserted as χ BEFORE δ-1 ships.

### Stone chain (revised)

| Stone | Status | Description |
|---|---|---|
| α | ✅ SHIPPED `5e43d7c` | Pidfd + spawn_lifelined primitive |
| β | ✅ SHIPPED `e44940d` | run_in_fork migration |
| γ-1 | ✅ SHIPPED `33d8f2c` | fork_program_ast migration (closes no-lifeline gap) |
| γ-2 | ✅ SHIPPED `ad81386` | fork_program_from_source canonicalization |
| γ-3 | ✅ SHIPPED `4ae371a` | spawn_process canonicalization |
| **χ (NEW)** | PENDING | **L2 wall on crossbeam Receiver; 15 sites migrate; cascade completeness verified by 50-trial proof** |
| δ-1 | dirty tree (replication intact) | pidfd field on ChildHandleInner — ships clean post-χ (cascade-completeness eliminates the hang class) |
| δ-2 | pending | wait/kill paths use Pidfd methods |
| δ-3 | pending | retire libc::waitpid/kill fallback; remove pid field |
| ε | pending | 5 probe /proc reads → pidfd observation |
| ζ | pending | L2 libc::fork/clone3/waitpid/pidfd_* module privacy |
| η | pending | INSCRIPTION |

### Connection to existing doctrines

- `feedback_substrate_owns_not_callers_match` — the channel-cascade discipline lives in `typed_recv`; callers are benefactors; bare recv shouldn't be reachable
- `feedback_simple_is_uniform_composition` — 15 site migrations via substrate-as-teacher cascade ARE simple
- `feedback_never_deadlock` — every comm site lands deliberately; the wall enforces this beyond what convention can
- `feedback_attack_foundation_cracks` — the crack δ-1 surfaced IS the diagnostic; attack the crack
- `feedback_defect_fix_or_panic_never_revert` — the replication preservation IS the discipline that let us SEE the cascade gap
- `project_holon_universal_ast` — same cross-domain coherence pattern: substrate primitives extend to new gaps via the same shape

### What's next

χ DESIGN + BRIEF + EXPECTATIONS land next. Stone scope:
- Mint `wat::channel::{Receiver<T>, Sender<T>, unbounded(), bounded(n), select!}` substrate-owned wrappers
- Public surface = cascade-aware only (typed_recv-equivalent semantics)
- Restrict `crossbeam_channel` imports to `src/typed_channel.rs` ONLY (`restricted_to :wat::typed_channel` per arc 198 pattern)
- Migrate 15 bare-recv sites via substrate-as-teacher cascade (compile errors guide sonnet through each)
- Proof gate: 50-trial replication of `wat_arc170_program_contracts` shows 0 hangs; broader workspace baseline preserved

User's voice on the doctrine: *"we build tools and prove they work against known failures / we are our own users - and i don't want to observe this failure ever again."*

Inscribed because the substrate's identity is built on this discipline. When future-me reads this, the message is: this orphan/hang failure mode is structurally extinct after χ. If you ever see it again, the wall has been breached — investigate the breach, don't accept the failure.

**The discipline is non-negotiable. The wall enforces it. The cascade reaches every recv. The hang class is gone.**

---

### Compaction breadcrumb 2026-05-18 (δ-1 replication preserved on dirty tree)

**Post-compaction me — read this first.**

**State at compaction:**
- Branch: `arc-170-gap-j-v5-deadlock-state`
- Tip: (commit hash of THIS inscription — see `git log --oneline | head -3`)
- Dirty tree:
  - `src/fork.rs` (MODIFIED — δ-1's `pub pidfd: Pidfd` field on ChildHandleInner + Debug impl)
  - `src/spawn_process.rs` (MODIFIED — δ-1's ChildHandleInner::new(pidfd, ...) site)
  - `docs/arc/2026/05/213-libc-fork-mismanagement/SCORE-213-DELTA-1-CHILDHANDLE-PIDFD-FIELD.md` (UNTRACKED — sonnet's δ-1 score; preserved as failure-engineering artifact)
  - `docs/arc/2026/05/213-libc-fork-mismanagement/BRIEF-213-DELTA-2-MIGRATE-WAIT-KILL.md` (UNTRACKED — δ-2 prep; safe; not blocking)
  - `docs/arc/2026/05/213-libc-fork-mismanagement/EXPECTATIONS-213-DELTA-2-MIGRATE-WAIT-KILL.md` (UNTRACKED — same)

**The δ-1 replication on disk is PRECIOUS.** Per `feedback_defect_fix_or_panic_never_revert` — DO NOT `git checkout HEAD -- src/fork.rs src/spawn_process.rs`. The 15% hang rate on `wat_arc170_program_contracts` is the substrate teaching us the channel-cascade-completeness gap. The dirty tree is the artifact.

If recovery is needed (somehow lost): the procedure is in `wat-rs/docs/arc/2026/05/121-deftests-as-cargo-tests/AGENT-TRANSCRIPT-RECOVERY.md`. Sonnet δ-1 agent ID was `ada514b10616a8e8f`; transcript at `/tmp/claude-1000/-home-watmin-work-holon/bc87fd88-050a-4542-bf0c-ccb5a18db436/tasks/ada514b10616a8e8f.output`. See memory `feedback_jsonl_transcript_recovery`.

**Next obvious move (after compaction):**

1. Read this INTERSTITIAL section (the χ doctrine + diagnosis) — you're here
2. Verify dirty tree intact: `git status --short` should show src/fork.rs + src/spawn_process.rs modified, the 3 docs/ files untracked
3. Verify replication still triggers: `for i in 1..=10; do timeout 15 cargo test --release --test wat_arc170_program_contracts; done` should show some hangs
4. **Draft + spawn χ-1**: mint `wat::channel::Receiver<T>` substrate wrapper; replace `crossbeam_channel::Receiver` field types where they appear in substrate; CALLERS still use `.recv()` (compile errors come from removing that surface in χ-3 OR from the wrapper's API not exposing recv directly)
   - Actually cleaner χ-1 scope: mint the wrapper + the new `unbounded()` / `bounded()` constructors that return the wrapper; substrate code that constructs channels via crossbeam_channel directly remains valid; χ-2 migrates them
5. **χ-2**: migrate 15 sites (the bare-recv ones identified in the inscription above). Sonnet uses cargo build cascade for guidance
6. **χ-3**: add `restricted_to` on `crossbeam_channel` import in non-typed_channel substrate files (compile-time wall)
7. **χ-4**: 50-trial replication of `wat_arc170_program_contracts` — must show 0/50 hangs. If yes: commit χ + δ-1 atomically; declare arc 213 χ shipped + δ-1 ships clean.
8. If 50-trial shows ANY hang: the cascade still has a gap; investigate further; do NOT commit χ

**Critical doctrine reminders post-compaction:**

- `feedback_defect_fix_or_panic_never_revert` — DO NOT revert dirty tree
- `feedback_substrate_owns_not_callers_match` — typed_recv is THE one location for cascade-awareness; bare recv unreachable structurally
- `feedback_simple_is_uniform_composition` — 15 site migrations IS simple via substrate-as-teacher cascade
- `feedback_attack_foundation_cracks` — δ-1 surfaced the crack; the wall IS the fix; substrate identity built on this
- User direction (load-bearing): *"we are our own users - and i don't want to observe this failure ever again"*

**Branch tip + commits this session (for sanity):**
- `5e43d7c` arc 213 α SHIPPED
- `e44940d` arc 213 β SHIPPED
- `33d8f2c` arc 213 γ-1 SHIPPED
- `ad81386` arc 213 γ-2 SHIPPED
- `4ae371a` arc 213 γ-3 SHIPPED (γ phase complete; zero bare libc::fork())
- `cca5bd3` arc 213 δ-1 BRIEF + EXPECTATIONS (the BRIEF; δ-1 work itself uncommitted on dirty tree)
- (THIS commit) — INTERSTITIAL χ doctrine + compaction breadcrumb

**Tasks (in TaskCreate registry):**
- #368 ✅ arc 213 α
- #374 ✅ arc 213 β
- #375 ✅ arc 213 γ-1
- #376 ✅ arc 213 γ-2
- #377 ✅ arc 213 γ-3
- #378 in_progress arc 213 δ-1 (the dirty-tree work; PAUSED pending χ)
- (NEW after compaction): arc 213 χ stones (χ-1/χ-2/χ-3/χ-4)

**The substrate is being inscribed; the doctrine is durable; the wall is the next move. See you on the other side.**


---
