## 2026-05-18 — Live reproduction of the orphan-pattern leak (pivot to arc 211)

Mid-arc-210-slice-1 cargo test workspace verification, the substrate's pre-existing duplicate-FD-of-own-stdio bug surfaced in REAL TIME as a hung test run. The signature inscribed in INTERSTITIAL § 2026-05-17 orphan-process leak investigation matched EXACTLY.

User direction 2026-05-18:
> *"we deadlocked -- what changes - do not kill anything... this is a situation we were waiting for?... who is not crashing now?... something is flawed and we have a literal reproduction of it..."*
> *"we pivot - we have an active reproduction - make the panic happen in all places it must and and prove we panic as we must where we must - then we prove we panic on the current reproduction and then we attack the reproduction until it passes - every deadlock must be a panic - we prefer parse time - but runtime is the next option"*

### The captured state (preserved for arc 211)

**Hung test:** `wat_arc170_program_contracts::t14_spawn_process_wait_handle_is_idempotent`

**Process chain (PPid intact — NOT orphan; live deadlock):**
- cargo test runner PID 2223413 (`do_wait`)
- wat_arc170_program_contracts test bin PID 2226716 (`futex_do_wait`; 3 threads)
- t14_spawn_process child PID 2226786 (`futex_do_wait`; 7 threads)

**Child's FD table (the signature):**
```
fd 0 -> pipe:[2658218]  (stdin READ)
fd 3 -> pipe:[2658218]  (READ — DUPLICATE of fd 0)
fd 1 -> pipe:[2658219]  (stdout WRITE)
fd 4 -> pipe:[2658219]  (WRITE — DUPLICATE of fd 1)
fd 2 -> pipe:[2658220]  (stderr WRITE)
fd 5 -> pipe:[2658220]  (WRITE — DUPLICATE of fd 2)
fd 29 -> pipe:[2658221] (lifeline READ — parent's fd 30 write)
```

**Parent's FD table (same self-lifeline pattern on parent side):**
```
fd 3 -> pipe:[2637227] (READ)
fd 6 -> pipe:[2637227] (WRITE — DUPLICATE)
fd 8 -> pipe:[2637228] (READ)
fd 9 -> pipe:[2637228] (WRITE — DUPLICATE)
fd 30 -> pipe:[2658221] (lifeline WRITE — child reads via fd 29)
```

**Pre-existing orphans (from yesterday, same fingerprint):**
- PID 1873491 (May 17 18:13) — `fd 3 = pipe:[2159153] READ` + `fd 4 = pipe:[2159154] WRITE`
- PIDs 1951496/1985751 (May 17 19:23/19:49) — same shape

### The diagnostic the bug teaches

Per `src/spawn_process.rs:303` comment: the substrate EXPLICITLY guards against "child is its own lifeline keeper" for the LIFELINE pipe (`drop(lifeline_w)` before dup2). But the SAME pattern applies to stdio pipes via the bootstrap's `synthesize_real_fd_stdio` path (lines 311-313 comment: *"the dup'd copies at fd 0/1/2 are now owned by the OS and will be inherited by bootstrap's synthesize_real_fd_stdio (which dups them again into the services)"*).

The services hold duplicate FDs of stdio by DESIGN (so kernel can dup2 over fd 0/1/2 for grandchild spawns). At child-exit, services don't close their duplicates → pipe writers > 0 → parent reads block on EOF that never arrives → deadlock.

### Why the substrate didn't panic (the discipline gap)

Three discipline layers:
1. **Parse-time walkers** — refuse-by-construction. **CAN'T SEE THIS** — bug is substrate-internal Rust, not wat AST.
2. **Check-time validation** — type-system. **CAN'T SEE THIS** — runtime state.
3. **Runtime observation** — **DOESN'T EXIST FOR THIS PATTERN.**

The substrate has no runtime-side panic site that says *"for each stdio pipe at fd 0/1/2, count other fds pointing at the same pipe inode. If count > 0 when a service teardown OR main-exit happens, PANIC immediately."*

The hang IS the observable consequence of the missing panic.

### Pivot — arc 211 opens

User directive locks the principle: **every deadlock must be a panic.** We prefer parse time; runtime is the next option. For this specific bug, runtime is the only option (substrate-internal Rust + runtime FD state).

Arc 211 phased:
1. AUDIT — identify ALL panic sites needed across substrate (every dup-fd-creation paired with every close-or-teardown site)
2. IMPLEMENT — add panic sites; prove panic fires by construction for the deadlock-state
3. PROVE — verify panic fires on the current reproduction (t14)
4. ATTACK — fix the leak (services close duplicates on teardown)
5. VERIFY — workspace cargo test green; orphans don't accumulate

**Why this is the substrate-as-teacher cascade applied to its own discipline gap:** the deadlock IS the report; the panic IS the diagnostic. Failure-engineering at the substrate-authoring layer.

### Arc 209 + arc 210 status

- Arc 210 slice 1: SHIPPED on disk (uncommitted at this inscription; will commit atomically with this entry); arc 210 slice 2 closure waits on arc 211 (workspace must be honestly green before closure paperwork per `feedback_closure_requires_workspace_green`).
- Arc 209 Stone A: BRIEF + EXPECTATIONS drafted (commit `88a6b75`); spawn deferred until arc 211 closes (no point shipping Stone A when the substrate's spawn-mechanism still deadlocks).

### Cross-references

- INTERSTITIAL § 2026-05-17 "Orphan-process leak investigation" — the original inscription that named this pattern + queued it for fix
- `src/spawn_process.rs:303` — the existing guard for LIFELINE self-keeper (the discipline applied at one layer; arc 211 extends it to stdio layer)
- `src/spawn_process.rs:311-313` — the comment naming the bootstrap-dup path that creates the duplicates
- `feedback_attack_foundation_cracks` — substrate trust is binary; the discipline that drives this pivot
- `feedback_any_defect_catastrophic` — >0 known defects = 0 trust; immediate pivot
- `feedback_substrate_owns_not_callers_match` — substrate owns "pipe writers actually close so EOF reaches parent"
- Song #3 "Ruin" — substrate as discipline of refusal; the panic IS the refusal
- Song #1 "The Other Side" — pain as guide; the deadlock IS the data

### User's voice

> *"every deadlock must be a panic - we prefer parse time - but runtime is the next option"*

This is doctrine. Arc 211 inscribes it as substrate-architectural commitment. Every future variant of "stdio writer leaks" becomes a panic with file:line, not a hang. The discipline reach extends to substrate-authors via runtime-side observation; parse-time-first remains the preference for future deadlock classes that wat AST can detect.

The live reproduction is precious. The dungeon master showed its hand; we mark the spot; we forge the trap; we walk past it; we close the class.

---
