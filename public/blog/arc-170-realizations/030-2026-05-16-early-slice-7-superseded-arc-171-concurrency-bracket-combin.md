## 2026-05-16 (early) — Slice 7 SUPERSEDED; arc 171 (concurrency-bracket-combinator) is the actual move

**Pivot record.** Compaction-recovery breadcrumb was just committed (`b678a92`). Then design conversation continued past the original Slice 7 framing. User rejected three orchestrator softening moves; the architectural commitment shifted substantively. Inscribing here as the durable record.

### The decay-disclosure for this entry

Orchestrator drafted Slice 7 as "drop -with-prelude + -with-io variants; keep driver as public API." User pushed back four times:

1. *"is run-hermetic-with-io-driver a thing to keep? ... shouldn't it just be run and run-hermetic - why do we have these extra crap? - users could make those if they want"* — drop the driver too.
2. *"i think the rule is now - processes must be waited on in the order they spawn? ... we can generalize ... (run-servers list-of-start-fns use-fn-for-servers) ... users can't fuck up if we do it for them"* — mint a bracket combinator.
3. *"-with-io is a crutch - we as the platform don't provide those - users make them for themselves - we do it full honest ... we unrelentingly refuse easy solutions"* — no transitional helpers, no safety nets, no scope-defer.
4. *"if that's the case - we just observe when they don't use our helpers - that's the illegal form - you didn't play by the rules - fuck you - learn to"* — walker collapses to binary check.

Orchestrator failures: (a) hedged by keeping the driver as "public API"; (b) framed bracket as "good UX concern" rather than identity; (c) suggested defer to arc 171 vs ship-tonight as if those were equivalent; (d) suggested walker stays as "safety net." Each was a softening move masquerading as design rigor. User named the pattern: refusing easy solutions IS what wat-rs does. Saved as `feedback_refuse_easy_solutions` (identity not heuristic).

### The architecture (settled)

**Substrate vends ONLY:**

```scheme
:wat::kernel::spawn-process    ;; raw primitive (Vec<WatAST> -> Process<I,O>)
:wat::kernel::spawn-thread     ;; raw primitive (Fn -> Thread<I,O>)
:wat::kernel::run-processes    ;; bracket combinator (NEW — arc 171)
:wat::kernel::run-threads      ;; bracket combinator (NEW — arc 171)
```

**Bracket signature (TBD precise shape; design slice 171-1):**

```scheme
(:wat::kernel::run-processes
  (Vec<Fn[]->Process<I,O>>)         ;; start-fns
  (Fn[Vec<Process<I,O>>]->T))       ;; body fn
  -> ???                            ;; T vs Result<T, ProcessGroupError> — 171-1 decides
```

**Substrate guarantees:** all start-fns run; body runs with procs; substrate joins each proc in order after body returns; drain happens before join (substrate-internal).

**Walker rule (collapses to binary):**
- `:wat::kernel::Process/join-result` REMOVED from user wat namespace; substrate-internal only
- `:wat::kernel::Thread/join-result` REMOVED from user wat namespace; substrate-internal only
- User calls to either → compile error: *"Use (run-processes ...) / (run-threads ...). You didn't play by the rules."*
- Arc 117 + 133 walker machinery (sibling-binding analysis, Sender-bearing classification, `process-join-before-output-drain` error, etc.) RETIRES — hundreds of lines of `check.rs` collapse to one structural check

**Consequence of refusing the bracket:** user spawns a Process, gets the value, can call `Process/stdin/stdout/stderr` for I/O, but cannot join. Cascade (pgid + killpg per `project_signal_cascade`) kills the orphan child on parent exit. User gets no useful return value. Fire-and-forget by refusal. The substrate doesn't sandbox the user; it simply refuses to give them the join.

**Test-namespace fallout (no separate slice — happens as part of arc 171's migration sweep):**

| Form | Status |
|---|---|
| `:wat::test::run` (thread sugar — body only) | KEEP (post-arc-170-slice-4c-β rename of run-thread) |
| `:wat::test::run-hermetic` (process sugar — body only) | KEEP |
| `:wat::test::deftest` / `deftest-hermetic` | KEEP (factory macros) |
| `:wat::test::make-deftest` / `make-deftest-hermetic` | KEEP |
| `:wat::test::run-hermetic-with-prelude` | **DROP** — deftest-hermetic inlines the expansion |
| `:wat::test::run-hermetic-with-io` | **DROP** — user-side concern |
| `:wat::test::run-hermetic-with-io-driver` | **DROP** — user-side concern |
| `:wat::test::run-hermetic-send-inputs` | **DROP** — user-side helper |
| `:wat::test::run-hermetic-drain-outputs` | **DROP** — user-side helper |
| `:wat::test::RunResultIO<O>` (src/types.rs) | **DROP** — user-side struct |

Test callers of `-with-io` (3 sites: ambient-stdio.wat:117, wat_arc170_program_contracts.rs T18/T18b) migrate to: `run-processes` + user-written Sender/Receiver/from-pipe orchestration in the body fn. NO substrate-vended Layer 2 typed-I/O helper.

`run-hermetic` body sugar internally uses run-processes with a single start-fn (or stays as direct spawn-process — design slice decides which). Same for `run` (thread sugar) → run-threads.

### Naming settled

**`:wat::kernel::run-processes` + `:wat::kernel::run-threads`** (sibling-to-spawn-*). Not a separate `:wat::concurrency::*` namespace — that's anticipatory design with no second resident (per `feedback_no_new_types` energy applied at namespace level).

### Task moves

- **#324 (original Slice 7) — superseded.** Description updated to point at #325 + #326.
- **#325 — arc 171 umbrella** created.
- **#326 — arc 171-1 DESIGN** created. Output: `docs/arc/2026/05/171-concurrency-bracket-combinator/DESIGN.md`. No implementation in 171-1.
- **#316 (4c-β rename run-thread → run) — re-evaluates** under arc 171 (run-thread internally calls run-threads or stays direct? 171-1 decides).
- **#321 (4c-α-iii check.rs fixtures) — re-evaluates** under arc 171.
- **#322 (4c-α-iv atomic delete) — re-evaluates** under arc 171.

### What is on disk (hibernation state)

- **Git tip:** `b678a92` (Slice 6 INTERSTITIAL breadcrumb).
- **This entry:** captures the arc 171 architectural commitment.
- **Memory:** `feedback_refuse_easy_solutions` saved + indexed.
- **Tasks:** #324 superseded; #325 + #326 created.
- **No code changes** — this is design-phase only. Arc 171-1 produces DESIGN.md; implementation in subsequent slices.

### Recovery instructions for next-session me

1. **Read this entry first.** Architecture is settled; do NOT re-litigate. The user is firm on: substrate vends bracket; walker collapses; *_join-result hidden; -with-io family dies; no transitional helpers.
2. **Read `feedback_refuse_easy_solutions`.** Every "transitional helper" / "safety net" / "scope-defer-to-later" instinct is a violation of the identity. Hard + correct over easy + wrong.
3. **Next action (when user resumes):** start arc 171-1 DESIGN. Output: `docs/arc/2026/05/171-concurrency-bracket-combinator/DESIGN.md`.
4. **Do NOT touch the bracket signature without surfacing.** The exact shape (return type Result<T,_> vs T, heterogeneity strategy, body-fn vs body-form) is 171-1's job to settle, not orchestrator's reflex.
5. **Walker retirement comes in implementation slices**, not 171-1. DESIGN identifies WHICH parts of arc 117/133 retire; implementation deletes them.

The substrate refuses; the user does the work; we ship the hard part because that's what we do.

---
