---
title: "2026-05-14 — Mid-session breadcrumb: 4a-β shipped + three-rule classification surfaced +…"
sidebar:
  order: 27
---

**Hibernation anchor.** The session has progressed substantially past yesterday's end-of-day breadcrumb. Filesystem state is the resume protocol.

### What shipped this session

| Commit | What |
|---|---|
| `988360d` | recovery doc — FM 7-bis: NEVER use git worktrees. User directive 2026-05-14: *"never use work trees - they backfire in nasty ways - i do not trust llms to operate worktrees"* + *"only do work in ~/work/holon/wat-rs/ — all other locations are illegal."* The harness injects `.claude/worktrees/agent-<id>/` paths into sub-Agent cwd context EVEN WITHOUT `isolation: "worktree"` — no real worktree gets created (verified via `git worktree list`); sub-Agents get confused investigating phantom state. Prescription: cwd-anchor sub-Agent prompts explicitly; mandate `pwd` verification + `git -C <anchor>` for git ops; reject `.claude/worktrees/` paths as illegal. |
| `3536f12` | Slice 4a-β SHIPPED. 15 active legacy callers swept (BRIEF's "32" was stale; honest recalibration in SCORE — slice 3 phase C had already retired many). 8 → `run-thread`, 6 → `run-hermetic`, 1 preserved as `run-hermetic-ast` (Layer-2 escalation in ambient-stdio.wat:110 — readln-echo stdin-driven; documented for 4c-α). Workspace 2263/10 (within ≤11 baseline). |

### The three-rule classification — load-bearing for 4a-γ

**Empirically surfaced during 4a-β sweep + reinforced by user teaching afterward.** Any test BODY exhibiting any of these traits MUST use `run-hermetic` (process boundary; fresh runtime; pipe-captured stdio); otherwise `run-thread` is safe:

1. **Reads `RunResult.stdout` or `RunResult.stderr` slots.** Threads share parent's fd 0/1/2; `run-thread` returns empty stdio Vecs by design. Tests asserting on captured output need process pipes.
2. **Calls `:wat::kernel::println` / `eprintln` / `readln` in the body.** Stdio verbs route to ambient services in both transports, but in thread mode the output goes to PARENT's stdout (test runner pollution; no per-thread capture). In process mode the child has its own fd 0/1/2 captured by parent pipes.
3. **Calls `:wat::config::set-*!` family verbs in the body.** Per-runtime config mutation. Threads share the parent's runtime — calling `set-capacity-mode!` / `set-dim-router!` / `set-redef!` / `set-eval-redef!` etc. from a thread mutates state the parent is also reading. ILLEGAL cross-thread. Hermetic gives the body a dedicated runtime to mutate; the substrate-honest reason hermetic testing exists.

User direction (2026-05-14): *"the point of the hermetic testing framework - the tests should still work - they just need a dedicated runtime to measure in."*

The three rules collapse to one architectural axis: **does the body need a private, captured, mutable runtime?** If yes, hermetic. If no, thread.

Documented as a substrate fact in `docs/COMPACTION-AMNESIA-RECOVERY.md` § Failure mode 7-ter.

### 4a-γ (#314) decomposed into three sub-stones

Four-questions + stepping-stones discipline ran on the deftest macro flip. Bundle vs split — split wins because audit-first makes decorate tractable, decorate makes flip safe.

| Sub-stone | Task | What |
|---|---|---|
| 4a-γ-audit | #317 | Scan every `:wat::test::deftest` body in the codebase; classify by three-rule; produce worklist. NO code edits. Pure information; visibility before semantic shift. |
| 4a-γ-decorate | #318 | Apply `deftest` → `deftest-hermetic` renames at audit-flagged sites. Mechanical per-site. |
| 4a-γ-flip | #314 | One-line change: deftest macro body at `wat/test.wat:303` flips from `(:wat::test::run-hermetic ~body)` → `(:wat::test::run-thread ~body)`. Lands the doctrine. |

After 4a-γ-flip: every deftest body either runs in a thread (cheap, safe per audit) or is `deftest-hermetic` (process, explicit). The mid-migration placeholder `run-thread` retires in 4c-β when it renames to `run` (and `run-thread-driver` → `run-driver`).

### Endpoint (settled — user confirmation 2026-05-14)

After all of 4a-γ + 4c-α + 4c-β:

```
:wat::test::run            ← thread (default; cheap; in-process)
:wat::test::run-hermetic   ← process (explicit; isolated runtime; captured stdio)
:wat::test::deftest         ← expands to :wat::test::run
:wat::test::deftest-hermetic ← expands to :wat::test::run-hermetic
```

Symmetric naming; mechanism matches name; user surface honest; one canonical primitive per transport per `project_one_spawn_per_concern`. The mid-migration names (`run-thread`, `run-thread-driver`) are scaffolding — they retire in 4c-β.

### Filesystem hibernation state

If the session disconnects abruptly, the disk contains everything needed to resume:

- This INTERSTITIAL entry — recovery anchor with the three-rule classification + sub-stone decomposition.
- `docs/COMPACTION-AMNESIA-RECOVERY.md` § FM 7-bis (worktree doctrine) + § FM 7-ter (three-rule classification).
- `BRIEF-SLICE-4A-GAMMA-AUDIT-DEFTEST-BODIES.md` + `EXPECTATIONS-SLICE-4A-GAMMA-AUDIT-DEFTEST-BODIES.md` (next commit; the first sub-stone's brief).
- Task chain: #317 → #318 → #314 → #315 → #316 (in task system).
- Git tip after the next slice-setup commit: covers the audit BRIEF + EXPECTATIONS; sonnet runs the audit; produces SCORE; orchestrator commits when network returns.

### Recovery instructions for next-session me

1. Read this entry (the discipline + the sub-stone decomposition).
2. Verify state on disk: `git -C /home/watmin/work/holon/wat-rs log --oneline | head -10` should show `3536f12` (4a-β ship) + `988360d` (FM 7-bis) + the next slice-setup commit covering 4a-γ-audit BRIEF + EXPECTATIONS.
3. Sonnet may have shipped a SCORE for 4a-γ-audit by now — check for `SCORE-SLICE-4A-GAMMA-AUDIT-DEFTEST-BODIES.md`. If present + working tree clean: audit done; pick up at #318 (decorate). If present + working tree has audit-doc only: orchestrator-commit needed.
4. **DO NOT redo any of 4a-α, 4a-β, FM 7-bis inscription, or the three-rule classification.** All landed.
5. The next deliberate action: based on audit SCORE, draft the decorate BRIEF for #318. The audit produces the worklist; decorate applies the renames; flip lands the macro change.

The substrate teaches; we listen; we ship; the disk remembers.

---
