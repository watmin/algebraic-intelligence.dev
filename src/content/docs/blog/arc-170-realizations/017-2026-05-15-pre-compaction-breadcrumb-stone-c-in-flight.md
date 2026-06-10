---
title: "2026-05-15 — Pre-compaction breadcrumb: Stone C in flight"
sidebar:
  order: 17
---

State at this commit (`85ecb0c` on `arc-170-gap-j-v5-deadlock-state`):

**Shipped:**
- Stone A (`92926a2`): `bootstrap_wat_vm_process` extracted; substrate-owned bootstrap helper exists at `src/freeze.rs`; `BootstrapArgs` + `ProcessRuntime` types; tested by `tests/probe_bootstrap_wat_vm_process.rs`.
- Slice 1i (`bc64691`): substrate-wide structured-stderr-only enforcement. spawn-process / fork-program child exits emit `#wat.kernel/ProcessPanics` EDN. Slice 1i SCORE on disk.
- Gap K (`b015b1d`): run-hermetic-driver drain-then-join. Detection 0 fires.

**In flight at compaction:**
- Stone C BRIEF + EXPECTATIONS committed at `ba6a4d8`. Sonnet running in background. ScheduleWakeup at 02:03:00 server time. 10-row scorecard. Substrate refactor + wat-level Sender/Receiver from-pipe wrappers + consumer sweep + TIERS.md amendment.

**Recovery breadcrumb for post-compaction me:**

1. **Read first:** this file (you're here) + `RUNTIME-BOOTSTRAP-BACKLOG.md` + `BRIEF-STONE-C-SPAWN-PROCESS-STDIO.md` + `EXPECTATIONS-STONE-C-SPAWN-PROCESS-STDIO.md`
2. **Check git state:** `git log --oneline -10` on `arc-170-gap-j-v5-deadlock-state`. If a Stone C SCORE doc + commit landed past `85ecb0c`, sonnet succeeded; verify it independently (FM 9 + path-honesty audit on probes) before doing anything else.
3. **Check working tree:** `git status --short`. If dirty with Stone C edits (src/spawn_process.rs / wat/kernel/queue.wat / wat/test.wat / tests/probe_spawn_process_*.rs / SCORE-STONE-C-*.md), sonnet returned uncommitted — verify the 10-row scorecard from EXPECTATIONS independently, then atomic commit. If clean past `85ecb0c`, sonnet either hasn't returned yet OR was killed.
4. **Process state:** `pgrep -af "target/release/deps/test-"` — orphans if any. Reap with `pkill -9 -f "target/release/deps/test-"` before any new cargo run.
5. **If sonnet still pending:** the agent ID `ad0619df5a712b2ce` won't be useable across compaction (orchestrator-side reference dies); future-me checks the task completion notification or assumes sonnet completed and verifies via disk. ScheduleWakeup at 02:03 fires regardless.
6. **Baseline expectations:** pre-Stone-C workspace was 167 pass / 7 fail / 0 detection. Post-Stone-C may shift (consumer migration adds probes; pattern-2 teacher firings should be 0 after consumer sweep). Verify honestly.
7. **Next stones after Stone C:** B (wat-cli shim), D (spawn-thread bootstrap_wat_thread), E (apply_function context check), F (Pattern 3 substrate-author scan), G (docs). Critical path: A→C done → B+D parallel → E → F → G.

**The user's directive 2026-05-15** (verbatim, load-bearing): *"we're proving this shortly - make notes in 170 so we don't forget."* The "proof" is the recursive wat-vm tree (L1→L2→L3 stdio composition). Stone C lands the foundation; the proof follows.

**Open architectural threads** (parking lot for post-Stone-C work):
- arc 195 stub: `Struct/from` kwarg constructor (Process struct + similar are the immediate beneficiaries)
- arc 109 § I rename queue: `raise!`→`panic!`, `string::concat`→`String/concat`, etc.
- arc 147 typed-Value Rust-construction class (related-class section appended 2026-05-15)
- The 7 svc-test workspace failures (5 svc + 2 tmp) — surfaced real diagnostics post-slice-1i but underlying defects still pending investigation

**Memory entries inscribed this session (post-compaction me check `MEMORY.md`):**
- `feedback_substrate_owns_not_callers_match` (the cognitive lesson behind Stone A/C framing)
- `feedback_brief_constraint_contradictions` (BRIEF authoring discipline; corrected hard-constraint pattern)
- `feedback_eprintln_is_terminal` (eprintln/raise!/assertion-failed! taxonomy)
- `feedback_asking_to_read_means_read` ("if asking to read, just read")
- COMPACTION-AMNESIA-RECOVERY.md § FM 17 (discipline-after-pushback meta-FM)

The discipline cascade is on disk. The architectural recognition (fractal wat-vms) is in this file. The work-in-progress is named at this breadcrumb. Compaction-survival is engineered; future-me has what it needs.

---
