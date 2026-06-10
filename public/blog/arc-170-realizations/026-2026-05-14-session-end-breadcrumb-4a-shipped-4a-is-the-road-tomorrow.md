## 2026-05-14 — Session-end breadcrumb: 4a-α shipped, 4a-β is the road tomorrow

**Recovery anchor for next-session me.** Read this first if compaction hit overnight.

### What shipped today (commit chain on `arc-170-gap-j-v5-deadlock-state`)

| Commit | What |
|---|---|
| `3c3fb10` | Rescope inscription: thread/process conflation correction; 5-stone chain replacing wrong-direction 5cf134d BRIEF; INTERSTITIAL § 2026-05-14 names the substrate model; new BRIEF + EXPECTATIONS for stone 4a-α; SUPERSEDED prologues on yesterday's BRIEF + EXPECTATIONS |
| `ddb3cad` | Slice 4a-α SHIPPED — `:wat::test::run-thread` Layer 1 macro + `run-thread-driver` + `failure-from-thread-died` helper minted in `wat/test.wat`; standalone deftest at `wat-tests/run-thread.wat` proves Ok-path + Err-path; SCORE 6/6 PASS; workspace 2264/9 (below 11 baseline) |

### Lessons earned this session (the ones that must not repeat)

**1. Thread/process transport conflation.** I pattern-matched stdio-capture machinery from `run-hermetic-driver` (pipe drain + extract-panics) onto a hypothetical thread driver. User taught the correction: stdin/stdout/stderr are PROCESS-process comm wires (OS pipes carrying EDN across fork); Sender/Receiver are THREAD-thread comm wires (crossbeam, typed in-process). Threads don't have their own stdio because they share the parent's fd 0/1/2. The substrate model is ONE wat surface (`<I,O>`), THREE transports (crossbeam / pipes+EDN / TCP+EDN); the wat-level caller doesn't know which transport.

**2. spawn-thread vs spawn-process fn-arity asymmetry.** spawn-thread requires `:Fn(:Receiver<I>, :Sender<O>) -> :nil` per arc 114 (runtime.rs:16543-16547). spawn-process accepts `[] -> nil` (Layer 1 contract at test.wat:567 — only for spawn-process). The two substrate primitives diverge at this layer; the run-thread macro absorbs the divergence via unused `_in`/`_out` channel params (stream.wat:94-99 idiom). The test-writer surface stays symmetric. Future-me: when minting any thread-side helper, ALWAYS check what eval_kernel_spawn_thread expects — don't assume symmetry with eval_kernel_spawn_process.

**3. Citation discipline.** I cited task #296 ("three substrate services in_progress") as a deftest-flip blocker without reading runtime.rs:16623 — the services code is SHIPPED; the task-tracker label is stale paperwork. Lesson: every assertion about substrate STATE needs grep evidence at the moment of the assertion; tracker labels can lag the code.

**4. "Going to study" must be ACTUALLY studying.** I drafted a reading list and halted — the user called it out as lying. The asking IS the signal; just read. `feedback_asking_to_read_means_read` violation; tightened.

### What's on disk tomorrow-me needs

- `BRIEF-SLICE-4A-ALPHA-MINT-RUN-THREAD.md` + `EXPECTATIONS-SLICE-4A-ALPHA-MINT-RUN-THREAD.md` + `SCORE-SLICE-4A-ALPHA-MINT-RUN-THREAD.md` — slice 4a-α complete record.
- `BRIEF-SLICE-4A-LEGACY-TEST-RUN-SWEEP.md` + `EXPECTATIONS-SLICE-4A-LEGACY-TEST-RUN-SWEEP.md` — both SUPERSEDED (prologues land at file top); preserved as failure-engineering artifacts.
- `INTERSTITIAL-REALIZATIONS.md` § 2026-05-14 — the rescope rationale + the substrate model + the conflation record + (after this entry) the session-end breadcrumb.

### Recovery instructions for next-session me

1. **Read this entry first.** Then read `INTERSTITIAL-REALIZATIONS.md` § 2026-05-14 (the rescope rationale + substrate model) — that's the architectural context tomorrow's work rides on.
2. **Verify state on disk:**
   - `git -C /home/watmin/work/holon/wat-rs log --oneline | head -10` should show `ddb3cad` (slice 4a-α) at the tip.
   - `git status --short` should be clean.
3. **The chain (in the task system, not in git):**
   - #308 (4a-α mint) → **COMPLETED** today
   - #313 (4a-β sweep 32 callers) → **NEXT** — pending, unblocked
   - #314 (4a-γ flip deftest macro body to `run-thread`) → blocked by #313
   - #315 (4c-α delete legacy wat wrappers) → blocked by #314
   - #316 (4c-β rename `run-thread` → `run` + `run-thread-driver` → `run-driver`) → blocked by #315
   - #310 (substrate Rust deletion) → blocked by #315 + #309
   - #312 (INSCRIPTION) → blocked by #316 + #310 + #311
4. **The first thing to do tomorrow:** draft `BRIEF-SLICE-4A-BETA-SWEEP-LEGACY-CALLERS.md` + `EXPECTATIONS-SLICE-4A-BETA-SWEEP-LEGACY-CALLERS.md`. Sweep 32 callers per the original BRIEF's pattern catalog (P1: `:wat::test::run` string-form, 5 sites; P2a: `:wat::test::run-ast` literal-vector, 18 sites; P3: `:wat::test::run-hermetic-ast`, 9 sites). DESTINATIONS CORRECTED PER TODAY'S RESCOPE: 23 thread-based callers → `:wat::test::run-thread`; 9 hermetic callers → `:wat::test::run-hermetic`. The old BRIEF's P-pattern decomposition + STOP triggers are reusable; the destination split is what changes.
5. **DO NOT redo 4a-α.** The mint shipped at `ddb3cad`; the `run-thread` primitive is functional and verified; #313's sweep operates on the settled foundation.
6. **DO NOT touch `deftest` macro yet.** 4a-γ does the flip; 4a-β is sweep-only.
7. **Substrate divergence pattern is already in use.** When writing 4a-β BRIEF, note that callers migrate to `(run-thread <body>)` / `(run-hermetic <body>)` — body-only macros; the unused-channel idiom is INSIDE the macro, not at the call site. Test writers see no transport difference.

### Open follow-up tracked (not deferred, surfaced for whoever does the Rust-side cleanup)

- **runtime.rs:17485 stale doc comment.** References `wat/kernel/sandbox.wat`'s `failure-from-thread-died` which no longer exists. The new `:wat::test::failure-from-thread-died` (test.wat:622) is the only wat-side caller of `ThreadDiedError/to-failure` in the loaded stdlib path. Doc comment cleanup is appropriate during the Rust-side substrate work in #310 / #311 — surfaced here so it isn't lost.

### The voice for tomorrow

This session's discipline catches:
- Read disk before asserting substrate state
- "Going to study" means READ NOW, not "compile a reading list"
- Substrate asymmetries are honest (spawn-thread ≠ spawn-process arities); discover before drafting
- Stepping stones over one-shot — 4a-α as the foundation 4a-β rests on; the split was right
- Atomic commit per slice; SCORE before commit; orchestrator verifies independently

The boss (arc 170 closure) is closer than yesterday. Stone 4a-α was the architectural correction's first proof-of-concept; 4a-β is mechanical sweep on settled foundation. The substrate teaches; we listen; we ship.

---
