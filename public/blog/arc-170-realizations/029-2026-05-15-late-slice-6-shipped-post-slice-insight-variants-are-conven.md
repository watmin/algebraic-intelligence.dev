## 2026-05-15 (late) — Slice 6 shipped + post-slice insight: variants are convenience scaffolding, drop them (Slice 7 task #324)

**Compaction-imminent breadcrumb.** Last session of the night before context likely truncates. Capture everything.

### What shipped today

| Commit | What |
|---|---|
| `b4dce9c` | Slice 6 BRIEF + EXPECTATIONS + pivot inscription |
| `dccd4a3` | Recovery doc Section 13 — IPC contract (stdout / stderr / exit-code triangle) |
| `6926507` | **Slice 6 shipped — spawn-process accepts program forms** |

Plus earlier today: `4dac42b` (4c-α-i BRIEF), `ee406b8` (4c-α-i shipped), `8adf62b` (4c-α-ii BRIEF), `ddfb6b5` (4c-α-ii shipped), `5baab75` (4a-γ-decorate BRIEF), `7e1f417` (4a-γ-decorate shipped), `c455919` (4a-γ-audit BRIEF), `f2e78ea` (4a-γ-audit shipped), `fb65951` (4a-γ-flip shipped). That's eleven commits.

### Slice 6 substrate-redesign findings (load-bearing)

1. **Declaration-form constraint root cause** — deftest-hermetic was wrapping declarations in a `do` INSIDE the entry fn body; under new substrate, declarations belong at top-level. Resolved by routing through new `run-hermetic-with-prelude` variant. Phase E's "DO NOT MODIFY deftest" comment superseded.

2. **TypeEnv no longer auto-propagates parent→child** — under new substrate, child boots with `TypeEnv::with_builtins() + stdlib + program-forms`. Parent's user-declared types NOT inherited. Correct under new contract ("send forms — what you see is what you ship"). Caller now responsible for putting type declarations in program prelude. Documented in `tests/probe_spawn_process_parent_type.rs` migration.

3. **T6 substrate-discovery gap** — `wat_arc170_program_contracts::t6_spawn_process_factory_with_capture_round_trips` originally tested closure-capture-across-fork. New substrate retires closure-extract; substrate-equivalent is runtime AST template construction via `:wat::core::quasiquote` + `:wat::core::unquote`. T6's migration to this shape FAILS — runtime quasiquote inside `(:wat::core::Vector :wat::WatAST ...)` constructor does not substitute unquoted symbols. Surfaced as downstream stone; T6's failure preserved with documenting comment.

### THE POST-SLICE INSIGHT (Slice 7 task #324)

User's framing 2026-05-15 late: *"if you're in a run-hermetic - you are a client to the server that runs in the hermetic environment - you can talk to it via stdin, stdout, stderr ... we could ask the far side to produce a value over stdout and collect the output ... we measure those values using the regular assertion tooling ... we could actually write as complex of an interaction we want here.. the hermetic side could implement a stdin server loop and send many 'mini tcp' messages back and forth..."*

**The architectural recognition:**
- The hermetic process IS a server (receives requests on stdin; produces values on stdout; emits errors on stderr)
- The parent IS a client (writes requests, reads values, applies assertions)
- The protocol is stdin/stdout/stderr (Recovery doc Section 13)
- Once the protocol is honest, the parent can drive ANY interaction (simple, request-response, mini-TCP, multi-stage workflows)

**Consequence:** the auxiliary macro variants are CONVENIENCE WRAPPERS, not architectural necessities. Every capability is achievable via `(spawn-process forms) → Process<I,O>` + caller-side driving:

| Variant | What it sugars | Substrate-honest replacement |
|---|---|---|
| `run-hermetic body` | spawn + wait + drain + RunResult | KEEP — body-only sugar for 99% case |
| `run-hermetic-with-prelude (prelude) body` | spawn + drain + RunResult with prelude in child | DROP — caller writes `(spawn-process (forms ~@prelude (define :user::main () body)))` then drives Process<I,O> |
| `run-hermetic-with-io :I :O inputs body` | spawn + send typed inputs + drain typed outputs + RunResultIO | DROP — caller writes `(spawn-process forms)` then drives raw stdin/stdout (typed wrappers via Sender/from-pipe + Receiver/from-pipe if useful) |

**Slice 7 task #324 created** — drop the two variants; migrate `deftest-hermetic` (back to plain `run-hermetic` body-only); migrate ~3 -with-io callers + the with-prelude proof deftest; helper functions for common driver patterns live as plain wat fns.

### Endpoint naming (settled — through MANY direction-shifts tonight)

```
:wat::test::run                       — thread (default; body sugar; cheap)
:wat::test::run-hermetic              — process (explicit isolation; body sugar)
:wat::test::deftest                   — expands to run (after 4c-β rename)
:wat::test::deftest-hermetic          — expands to run-hermetic (after Slice 7)

:wat::kernel::spawn-thread fn         — substrate primitive (thread)
:wat::kernel::spawn-process forms     — substrate primitive (process; takes Vec<WatAST>)
```

User's framing on naming: *"these live in `:wat::test::*` namespace — that's the TEST vocabulary; `run` and `run-hermetic` describe what the TEST does. The substrate mechanism (thread vs process) is implementation detail surfaced at the `:wat::kernel::spawn-*` layer."* Symmetry: `run` / `run-hermetic` mirrors `spawn-thread` / `spawn-process`; the `-hermetic` suffix is the explicit-marker pattern.

### Chain status post-slice-6

| Task | Status | Re-evaluated under new substrate |
|---|---|---|
| #316 (4c-β: rename `run-thread` → `run`) | pending | Mechanical sweep; ~30-45 min; next obvious move |
| #324 (Slice 7: drop -with-prelude + -with-io) | **NEW pending** | Substantive simplification; ~60 min |
| #321 (4c-α-iii: check.rs fixtures) | pending | Fixtures may now migrate to spawn-process(forms) shape |
| #322 (4c-α-iv: delete legacy wat wrappers) | pending | sandbox.wat + hermetic.wat cleanup; legacy `:wat::kernel::run-sandboxed*` verbs become deletion candidates |
| #309 (4b: wat-cli Stone B) | pending | wat-cli naturally fits — it's just spawn-process + OS-bridging |
| #310 (4c: substrate Rust deletion) | pending | spawn-program* + fork-program* retire; check.rs walker BareLegacy* arms STAY per `project_one_spawn_per_concern` |
| #311 (4d: clippy + warning sweep) | pending | INSCRIPTION precondition |
| #312 (5: INSCRIPTION + closure) | pending | Arc 170 closure; supersedes arc 109 v1 milestone (task #229) |

### Decay record (full session — for honest accounting)

I made multiple substrate-fact failures during this session. Sonnet caught most of them via on-the-disk verification. Each one is a `feedback_assertion_demands_evidence` violation:

1. **Claimed `scope` was "never functional plumbing"** — wrong; ScopedLoader was real. Sonnet's 4c-α-ii SCORE Finding 3 corrected.
2. **Framed `set-capacity-mode!` not-body-callable as a "finding"** — it's core language design (config = startup-time only). User surfaced this as decay.
3. **Claimed set-! is "broken in any body regardless of context"** — wrong; set-! IS callable in a fork's child at top-of-source (parse-time). Body-AST shape is what constrains it.
4. **Mistook the 4 deadlocked procs for orphan-pattern** — they were proper live deadlocks (parent-child intact). User surfaced.
5. **BRIEF mandated minting `run-hermetic-with-prelude`** — sonnet shipped per BRIEF; user's later insight surfaced this as scaffolding to drop.

User's framing: *"you have clearly forgotten too much."*

**Discipline anchor:** orchestrator describes target shape + names doctrine; sonnet has authority on substrate-internal discovery; orchestrator does NOT assert substrate facts in BRIEFs without grep verification. Slice 6 BRIEF made this explicit via DECAY DISCLOSURE section — sonnet correctly treated orchestrator claims as hypotheses.

### What's on disk (the hibernation state)

- **Git tip:** `6926507` (Slice 6 shipped)
- **Working tree:** clean (modulo the 4 orphan procs the user is leaving alone for now)
- **Recovery doc Section 13:** captures the IPC triangle (stdout / stderr / exit code)
- **All slice BRIEFs / EXPECTATIONS / SCOREs** for completed slices: on disk
- **Slice 7 task #324:** created with description capturing the simplification
- **This INTERSTITIAL entry:** the recovery anchor

### Recovery instructions for next-session me

1. **Read this entry first.**
2. **Read Recovery doc Section 13** — the IPC contract is foundational; user re-affirmed it tonight via the client-server framing.
3. **Verify state via `git -C /home/watmin/work/holon/wat-rs log --oneline | head -15`** — `6926507` (Slice 6) at tip.
4. **DO NOT redo slice 6.** Substrate redesign shipped + 3 load-bearing findings inscribed in SCORE-SLICE-6-*.md.
5. **DO NOT re-investigate the variant-drop decision.** User's client-server insight is authoritative; variants are scaffolding; drop in Slice 7.
6. **Next action (when user resumes):** ask whether to start Slice 7 (drop variants) OR Slice 4c-β (rename run-thread → run) OR both in sequence. Either way: BRIEF + EXPECTATIONS + sonnet + verify + commit per protocol.
7. **The 4 orphan procs** (PIDs 267537/267572 from 14:31; 294293/294324 from 4:47) — user said leave them alone for now. Re-check status when resuming.
8. **Decay discipline:** every substrate claim needs grep evidence at the moment. Orchestrator's mental model decayed significantly tonight; sonnet's on-the-disk verification was the saving grace. Continue the DECAY DISCLOSURE pattern in BRIEFs.

The substrate teaches; we listen; we ship; the orchestrator learns humility; the disk remembers.

---
