---
title: "2026-05-16 (deeper) — Control channels: Shutdown/Final convention + state recovery + tie…"
sidebar:
  order: 43
---

The Kay-OOP realization above named WHAT we have. This entry names how it COMPOSES into graceful lifecycle, state recovery, and cross-tier symmetry.

### User's voice (the chain of realizations)

> *"i think there's another thing here... these are control channels... we can cascade graceful shutdown trivially - users opt into it by using the pipes... we can have return value be the state of the system such that it can be re-inserted in the main-fn..."*

> *"is this a real thing?.... we could have a shutdown action that doesn't dispatch into itself and return whatevver its internal state is.. the client issues the server stop"*

> *"this pattern shape is the same for processes and soon to be remotes"*

> *"Flavor 1 is superior but we shouldn't advertisie :user::main in the thread context"*

> *"processes must always define :user::main .... there is no :user::main-process ... just like (:wat::kernel::readln) and (:wat::kernel::println data) operate on stdio"*

> *"remote will behave like threads and processes ... i think the remote process will be probably... something like a tokio loop?... 'green-threads' or whatever - later propblem - get our docs updated"*

### These ARE control channels

The Kay-OOP example earlier in this file (Counter with Get/Increment/Reset) showed the ALWAYS-dispatching loop. The deeper recognition: the SAME channel carries control alongside data. There is no separate "shutdown channel" — there's a `Shutdown` variant of the existing Request enum. The dispatch arm for `Shutdown` doesn't tail-recurse — it sends the final state as Response, then the fn returns. Thread exits cleanly. Client captures the final state from the Response.

### Settled conventions (user confirmed "both yes" 2026-05-16)

**1. `Shutdown` is the conventional Request-enum variant for terminal request.** Every actor's `I` enum carries a zero-arg `Shutdown` variant. The dispatch arm for Shutdown:
- Sends the Final response (carrying state)
- Returns nil (no tail recursion)
- Thread / process / remote terminates cleanly

**2. `Final<State>` is the conventional Response-enum variant carrying terminal state.** The shape `Final<State>` is the actor's commitment to expose its final state at shutdown. Client recvs Final → captures state → can re-spawn the actor with that state as the new `initial`. This IS the hot-reload carry-over mechanism that arcs 191/192/193 backlog called for; no new substrate needed.

Convention propagation: documented in canonical examples + USER-GUIDE; substrate does NOT enforce or auto-invoke. Each actor's per-actor shutdown verb is a 3-line user-defined wrapper following the convention.

### Settled pattern: explicit-coordinator-shutdown (Flavor 1)

Four-questions ran on two flavors of who-shuts-down-whom:

**Flavor A (substrate auto-shutdown via bracket helper):** bracket vends `run-threads/shutdown-all` helper that auto-synthesizes Shutdown variants, sends, collects Final. → DISQUALIFIED on Simple + Honest (substrate auto-invocation hides discipline; substrate awareness of user enum shape is heavy; per-peer special handling impossible without opting out; violates one-canonical-path).

**Flavor B (coordinator-explicit per-peer shutdown):** coordinator-fn's named delegate explicitly calls `(:peer-name/shutdown peer!)` per peer; bracket stays minimal (just spawn + drain-and-join). → YES YES YES YES (lifecycle visible inline; verbose-is-honest; convention named at variant level; substrate unchanged; per-peer flush-before-shutdown lives in that peer's shutdown verb where it's visible).

**Settled:** Flavor B. No bracket helper.

### Counter example refined — full lifecycle with Shutdown

```scheme
;; Request + Response enums (Counter/Request gains Shutdown; Counter/Response gains Final)
;; (Pseudocode shape; actual enum declaration follows wat's `(:wat::core::enum ...)` form)

(:wat::core::enum :Counter/Request
  Get
  (Increment :wat::core::i64)
  Reset
  Shutdown)                                                              ;; ← convention

(:wat::core::enum :Counter/Response
  (Value :wat::core::i64)              ;; Get returns current value
  (Ok    :wat::core::i64)              ;; Increment/Reset acknowledge with NEW value
  (Final :wat::core::i64))              ;; ← convention; Shutdown returns final state

;; Constructor — state IS the bare i64 (no HashMap-as-Box; see addendum)
(:wat::core::defn :counter/spawn
  [initial <- :wat::core::i64]
  -> :wat::kernel::Thread<Counter/Request, Counter/Response>
  (:wat::kernel::spawn-thread
    (:wat::core::fn [server-rx! <- :Receiver<Counter/Request>
                     server-tx! <- :Sender<Counter/Response>]
                    -> :wat::core::nil
      (:counter/dispatch server-rx! server-tx! initial))))

;; Dispatch loop — each handler is THREE LINES: compute, send-reply, recur.
;; Shutdown arm doesn't recur; returns nil; thread exits.
(:wat::core::defn :counter/dispatch
  [server-rx! <- :Receiver<Counter/Request>
   server-tx! <- :Sender<Counter/Response>
   state      <- :wat::core::i64]
  -> :wat::core::nil
  (match (recv server-rx!)

    ;; Read — no state change; reply current; recur same state
    ((Counter/Request/Get)
       (:wat::core::do
         (send server-tx! (Counter/Response/Value state))
         (:counter/dispatch server-rx! server-tx! state)))

    ;; Mutate-computed — let-bind new state once; reply + recur with it
    ((Counter/Request/Increment n)
       (:wat::core::let [new-n (+ state n)]
         (send server-tx! (Counter/Response/Ok new-n))
         (:counter/dispatch server-rx! server-tx! new-n)))

    ;; Mutate-literal — no compute; reply + recur with the literal
    ((Counter/Request/Reset)
       (:wat::core::do
         (send server-tx! (Counter/Response/Ok 0))
         (:counter/dispatch server-rx! server-tx! 0)))

    ;; Terminal — reply with Final<state>; no recur; thread exits
    ((Counter/Request/Shutdown)
       (send server-tx! (Counter/Response/Final state)))))                ;; ← single expression; fn returns nil

;; Per-actor shutdown verb — 3-line user-defined wrapper following the convention
(:wat::core::defn :counter/shutdown
  [peer! <- :wat::kernel::ThreadPeer<Counter/Request, Counter/Response>]
  -> :wat::core::i64
  (do
    (:wat::kernel::Thread/println peer! (Counter/Request/Shutdown))
    (match (:wat::kernel::Thread/readln peer!)
      ((Counter/Response/Final state) state))))
```

### Coordinator-explicit user form at the thread tier

```scheme
;; The thread-coordinator's named delegate — PLACEHOLDER name :user::thread-main.
;; The substrate doesn't bless this name; users pick whatever fits their domain
;; (e.g., :my-app::orchestrate). The placeholder exists for DOCS to avoid
;; confusing the thread-coordinator role with :user::main (which IS literal,
;; substrate-blessed, only at the process tier).
(:wat::core::defn :user::thread-main
  [logger!  <- :wat::kernel::ThreadPeer<Log/Request, Log/Response>
   counter! <- :wat::kernel::ThreadPeer<Counter/Request, Counter/Response>]
  -> :wat::core::Tuple<:Log/State, :wat::core::i64>            ;; Counter/State = bare i64
  (do
    (:log/info logger! "starting")
    (:counter/increment counter! 5)
    (:counter/increment counter! 3)
    (:log/info logger! "done")
    (:wat::core::Tuple
      (:log/shutdown logger!)              ;; sends Shutdown; recvs Final; returns Log/State
      (:counter/shutdown counter!))))      ;; sends Shutdown; recvs Final; returns i64

;; Bracket invocation — coordinator-fn body delegates to the named fn
(:wat::kernel::run-threads
  (:wat::core::fn [logger!  <- :wat::kernel::ThreadPeer<Log/Request, Log/Response>
                   counter! <- :wat::kernel::ThreadPeer<Counter/Request, Counter/Response>]
                  -> :wat::core::Tuple<:Log/State, :wat::core::i64>
    (:user::thread-main logger! counter!))
  (:log/spawn)
  (:counter/spawn 0))
;; Returns the Tuple of final states. Both threads have exited cleanly.
;; The states can be re-inserted into a new spawn for continuity (hot-reload).
```

### Tier-placeholder convention (corrected per user 2026-05-16)

The naming asymmetry is HONEST — it tracks the substrate's asymmetry:

| Tier | Bracket macro | Peer type | Worker substrate entry | Coordinator delegate placeholder (docs) |
|--|--|--|--|--|
| Thread | `:wat::kernel::run-threads` | `ThreadPeer<I,O>` | none — worker is a fn taking raw channels (no ambient anything) | **`:user::thread-main`** (placeholder for docs; users name however) |
| Process | `:wat::kernel::run-processes` (Stone E) | `ProcessPeer<I,O>` | **`:user::main`** (LITERAL; substrate-blessed; ambient stdio via `readln`/`println`) | none — `:user::main` IS where the work lives; bracket coordinator-body delegates to whatever name the user picks |
| Remote | `:wat::kernel::run-remotes` (future) | `RemotePeer<I,O>` (future) | TBD when remote ships (probably mirrors process: each remote IS a wat-vm process running on a remote host) | TBD — placeholder convention settles when the implementation does |

The user's framing on remote: *"remote will behave like threads and processes ... i think the remote process will be probably... something like a tokio loop?... 'green-threads' or whatever - later propblem."* Later problem; the SHAPE is shared (Peer + Request/Response + Shutdown/Final + bracket); the implementation choice (OS process over network vs tokio task vs green-thread) settles when the slice happens.

### Why processes don't get a separate placeholder

Per user 2026-05-16: *"processes must always define :user::main .... there is no :user::main-process ... just like (:wat::kernel::readln) and (:wat::kernel::println data) operate on stdio."*

The substrate doesn't have a "process-tier readln" distinct from generic `readln` — `readln` IS the process-tier mechanism (operates on ambient stdio). Symmetrically: `:user::main` IS the process-tier entry; there's no `:user::process-main` to disambiguate.

The placeholder `:user::thread-main` exists ONLY because thread workers don't have an ambient surface OR a substrate-blessed entry name. The bracket's coordinator-fn body needs SOME named delegate (per the "always delegate" pattern); docs need a placeholder name; that name should NOT conflict with `:user::main`. Hence `:user::thread-main`.

### What this unblocks

**Graceful cascading shutdown:** supervisor's coordinator decides to shut down → sends Shutdown to each peer → peer's dispatch arm sends Final<State> + returns → thread exits → join unblocks → coordinator captures all states + returns. Per Erlang OTP `terminate/2` exactly. Mechanism: typed channels + tail-call-or-not. Substrate: unchanged.

**State recovery for hot-reload (arcs 191/192/193):** the Final<State> Response IS the carry-over mechanism. After exec/state-preserving-exec, the new universe re-spawns the actor with `(actor/spawn old-state)`. Per INTERSTITIAL § "Round 4 — the hot-reload recognition" (line 477+): this is exactly the "stateful exec-program-with-state" the user envisioned. The substrate didn't need a new primitive; the convention names what's there.

**Cross-tier symmetry without conflation:** processes get `:user::main` literal (ambient stdio + substrate entry); threads get `:user::thread-main` placeholder (no ambient, no blessed entry); remotes settle when they ship. The pattern shape is uniform; the tier-specific surfaces are honest about their substrate-level differences.

### Lock-step alignment with mini-TCP

This pattern IS the same lock-step from `ZERO-MUTEX.md:295-297` ("the lock is the loop body itself; the release is the ack send"). Client sends Request, blocks on recv Response; server recv Request, processes, sends Response. Bounded(1) channels prevent racing. The Shutdown variant is just a terminal Request whose Response carries the final state. Per the user: *"we block on client read and then block on client write and then block on client read and so on?... always lock step."* Confirmed — strict alternation; both sides advance in lockstep.

### Cross-references

- INTERSTITIAL § 2026-05-16 (late) — Kay-OOP entry (the prior layer in the same realization)
- INTERSTITIAL § 2026-05-13 "Round 4 — the hot-reload recognition" (line 477+) — Final<State> IS the carry-over mechanism for arcs 191/192/193
- INTERSTITIAL § 2026-05-13 "How the shadow channel fans out" — shutdown event broadcast; this pattern is the user-level COOPERATIVE shutdown that composes alongside (orthogonal to substrate-level signal cascade)
- INTERSTITIAL § 2026-05-13 "Networked programs ride the same substrate" — the cross-tier ride is exactly this pattern, projected onto remote transport
- `docs/ZERO-MUTEX.md` § "Mini-TCP" — the substrate mechanism this convention names at the user level
- `docs/SERVICE-PROGRAMS.md` § "The lockstep" — the service-program discipline this convention follows
- Arc 170 STONES.md § Stone E (`run-processes`) — symmetric bracket at the process tier
- Arc 191/192/193 backlog — hot-reload (state recovery via Final<State> IS the missing piece these arcs called for)

### Addendum — service-with-provisioning + tier-choice for shared-state services

**User's framing 2026-05-16:** *"we should enqueue both a thread and process flavor of these ... the caches and intra-process shared state .. not inter-process - but no reason they couldn't be... but perf and similar you'd almost always want a threaded shared state server"*

The Counter pattern is one-actor-one-state. The fractal-deployment extension is **service-with-provisioning** — a shared-state actor whose Request enum carries lifecycle messages alongside domain operations:

```scheme
(:wat::core::enum :CacheService/Request
  ;; Lifecycle (provisioning conversation on the control channel)
  Provision
  (Deprovision :wat::core::keyword)        ;; release handle by id
  ;; Domain operations (via issued handles)
  (Get :wat::core::keyword :Key)
  (Put :wat::core::keyword :Key :Value)
  ;; Terminal
  Shutdown)

(:wat::core::enum :CacheService/Response
  (ClientHandle :wat::core::keyword)        ;; lifecycle reply — carries the new handle
  Ok                                         ;; deprovision / put ack
  (Value :wat::core::Option<:Value>)        ;; get reply
  (Final :wat::core::HashMap<:Key, :Value>)) ;; terminal — Shutdown returns cache state
```

The service's dispatch loop handles ALL of these via the existing three-line handler pattern. Provisioning is just another match arm; no new mechanism. Service's accumulator state tracks issued handles (so it knows who has what; can refuse on capacity; can detect leaks at shutdown).

### Fractal deployment composition (the lab-trading shape)

```
Top supervisor (run-processes — cross-asset manager)
├─ BTC desk supervisor (run-threads under BTC process)
│   ├─ BTC market observer    (handles: cache-h1, log-h1, db-h1)
│   ├─ BTC risk observer      (handles: cache-h2, log-h2)
│   └─ BTC treasury observer  (handles: cache-h3, db-h2)
└─ ETH desk supervisor (run-threads under ETH process)
    └─ ETH market observer    (handles: cache-h4, log-h4, db-h3)

Shared services (running alongside the supervisor tree):
  cache-service-peer        ← thread-tier (intra-process, hot path)
  log-service-peer          ← thread-tier (intra-process, high volume)
  db-service-peer           ← thread-tier (intra-process)
                              OR process-tier IF actual DB I/O benefits from process isolation
```

**Per-observer spawn sequence (supervisor's coordinator-fn body):**

```scheme
(:wat::core::let
  ;; Provision per-observer handles via control-channel conversations
  [cache-h1   (:cache-service/provision cache-svc!)
   log-h1     (:log-service/provision   log-svc!)
   db-h1      (:db-service/provision    db-svc!)
   market-obs (:btc-market/spawn cache-h1 log-h1 db-h1)
   ;; ... operations using the observers ...
   ;; Deferred shutdown cascade
   _shut-obs  (:btc-market/shutdown market-peer)
   _dep-c1    (:cache-service/deprovision cache-svc! cache-h1)
   _dep-l1    (:log-service/deprovision   log-svc!   log-h1)
   _dep-d1    (:db-service/deprovision    db-svc!    db-h1)]
  ...)
```

What this gives the architecture for free:
- **Dynamic membership** — observers spawn over time; handles provisioned on demand; no static pre-allocation
- **Per-client typed handles** — service tracks who-has-what; mis-use surfaces structurally
- **Bounded resources** — service can refuse Provision when at capacity; backpressure on control channel
- **Cascade shutdown is honest** — supervisor exit deprovisions all held handles; no leaks
- **Service-side state recovery** — service's Final<State> on Shutdown carries the cache contents → hot-reload re-spawns with seeded state (arcs 191/192/193 hot-reload)
- **Per-client per-service-state** — service tracks per-handle metadata in its accumulator
- **Fractal** — desk supervisor is itself an actor the top-level provisioned for; pattern composes at every tier

### Tier-choice guidance for shared-state services

**Thread tier is the workhorse** for intra-process shared state. Pick it for:
- Caches (LRU, hologram cache, query result cache)
- Logs (high volume; intra-process; structured-event accumulator)
- In-memory registries (symbol tables, handle pools, metrics)
- Anything where multiple in-process actors need shared mutable state with sub-millisecond latency

**Why thread tier wins for intra-process shared state:**
- No EDN serialization cost (values pass by reference/clone in same address space)
- Microsecond channel latency (crossbeam) vs millisecond pipe + parse latency
- No per-message memory duplication
- Same isolation guarantee (typed channels + immutable values prevent races)
- Mini-TCP discipline holds identically

**Process tier is for crash-isolation, sandboxing, or true cross-process boundaries.** Pick it when:
- The service's own crash should NOT take down the supervisor tree (independent restart)
- The service uses OS resources you want sandboxed (file descriptors, network connections, untrusted code)
- The service genuinely IS cross-process (one wat-vm spawns another; service belongs to one, clients in others)
- The serialization cost is dwarfed by the I/O cost the service is doing anyway (DB queries, network calls)

For lab-trading's intra-asset shared state (caches, logs, in-mem db caches): **thread tier always.** Cross-asset coordination is already process-tier (top supervisor spawns per-asset processes); within each asset's process, threaded services serve the intra-asset observers.

### What this unblocks (queued for proof after Counter actor lands)

Two ServiceWithProvisioning proofs queued in the task system:
1. **Thread-tier ServiceWithProvisioning proof** — cache-service actor with Provision/Deprovision; supervisor coordinator-fn provisions on spawn + deprovisions on cascade; intra-process workhorse demonstration
2. **Process-tier ServiceWithProvisioning proof** — same pattern over ProcessPeer + EDN-serialized RPC; documents the perf-vs-isolation trade-off explicitly

Both prove the pattern at their tier; together they validate the cross-tier symmetry. After they land, lab-trading reconstruction has the substrate-canonical model.

### Connection to lab-trading reconstruction

Per `project_lab_reconstruction`: lab archived as reference; reconstruction tests fresh-user-follow-along; wat-rs is the durable substrate; substrate work doesn't wait for lab.

The arc 089/091/096/119 services (Db, WorkUnit, telemetry, Cache/HolonLRU) were minted as ad-hoc service-templates with mini-TCP discipline before the Counter actor pattern + Shutdown/Final convention + supervisor brackets were inscribed. The reconstruction inherits ALL of this as the uniform model:
- Each service is an actor with Provision/Deprovision/Domain/Shutdown Requests
- Each observer is an actor consuming provisioned handles
- Each desk is a supervisor (run-threads bracket) over its observers
- Cross-asset is a supervisor (run-processes bracket) over per-asset processes
- Hot-reload (arcs 191/192/193 future) composes via Final<State> carry-over

The lab doesn't need a new ARCHITECTURE — it needs to BE this architecture. The substrate composes; the pattern is canonical; the reconstruction follows the inscription.

### Cross-references

- `project_lab_reconstruction` — the destination application
- `project_trading_lab` — current state of the lab (active arcs)
- Arc 089 / 091 / 096 (services) + arc 119 (cache services) — historical service-template work; refactored under this uniform pattern during lab reconstruction
- INTERSTITIAL § 2026-05-16 (deeper) "Control channels" — the convention this extends
- Arc 191/192/193 backlog — hot-reload (Final<State> from service Shutdown is the carry-over mechanism)
- Task entries (added 2026-05-16) — thread-tier + process-tier ServiceWithProvisioning proofs queued

---

### Compaction breadcrumb 2026-05-16 (late) — handoff state

**Tip commit:** `9638145` (this entry pre-dates a planned compaction; tonight's chain since arc 201 closure runs ~20 commits — see § "Dungeon rank-up" + § "Trajectory now (10 → 11 floors)" for the narrative arc).

**In-flight sonnet at compaction:** Counter actor pattern proof — agent `af695dd8289e66fb6`. Output file:
`/tmp/claude-1000/-home-watmin-work-holon/bc87fd88-050a-4542-bf0c-ccb5a18db436/tasks/af695dd8289e66fb6.output`

State on disk (UNCOMMITTED — sonnet hasn't completed):
- `wat-tests/counter-actor-proof-thread.wat` (214 lines)
- `wat-tests/counter-actor-proof-process.wat` (197 lines)
- `docs/arc/2026/05/170-program-entry-points/SCORE-COUNTER-ACTOR-PROOF.md` — NOT YET written

**Recovery instructions for post-compaction orchestrator:**

1. **Read this section first.** Then read INTERSTITIAL § 2026-05-16 (late) Kay-OOP entry + § (deeper) control-channels entry + the immediately preceding § service-with-provisioning addendum.

2. **Verify state:**
   - `git -C /home/watmin/work/holon/wat-rs log --oneline | head -5` should show `9638145` at tip
   - `git -C /home/watmin/work/holon/wat-rs status --short` should show two untracked `wat-tests/counter-actor-proof-*.wat` files + `.claude/worktrees/` (harness state — leave alone per FM 7-bis)

3. **Check sonnet completion:**
   - If `docs/arc/2026/05/170-program-entry-points/SCORE-COUNTER-ACTOR-PROOF.md` EXISTS: sonnet completed. Verify load-bearing rows (run `cargo test --release -p wat --test counter-actor-proof-thread` + `--test counter-actor-proof-process` — exact test invocation depends on how wat-tests deftest sites surface via cargo). Then atomic commit (test files + SCORE) per standard cadence. Push.
   - If SCORE DOES NOT exist: sonnet didn't complete. Read the BRIEF + EXPECTATIONS at `docs/arc/2026/05/170-program-entry-points/BRIEF-COUNTER-ACTOR-PROOF.md` + `EXPECTATIONS-COUNTER-ACTOR-PROOF.md`. Inspect the two `wat-tests/counter-actor-proof-*.wat` files; decide: respawn sonnet to finish, OR adopt the work + write SCORE yourself, OR start fresh. Use the discipline (orchestrator owns SCORE drafting; sonnet wrote tests).

4. **Honest-delta watch:** EXPECTATIONS predicted 1-3 inscription↔substrate gaps would surface (recv-Result handling, ambient verb spellings, ProcessPeer/new arg order). When SCORE lands, read for these. If any gap, INSCRIBE forward-correction in a new INTERSTITIAL entry per `feedback_inscription_immutable` — past Counter examples stay; new entry names the correction.

**Queued after Counter actor proof lands:**

| # | Item | Source |
|---|------|--------|
| 1 | ServiceWithProvisioning thread-tier proof | Task #338 + INTERSTITIAL § service-with-provisioning |
| 2 | ServiceWithProvisioning process-tier proof | Task #339 + same |
| 3 | D3 — panic cascade + ProcessGroupErr | STONES.md § D3 |
| 4 | Stone E — run-processes bracket (mirrors D2) | STONES.md § Stone E |
| 5 | Stones F/G/H — fallout cleanup + walker retirement + INSCRIPTION | STONES.md |
| 6 | Arc 170 closes via Stone H's INSCRIPTION | STONES.md final |

**Decisions settled tonight that post-compaction me MUST honor (no re-litigation):**

- `Shutdown` is the conventional terminal Request variant (every actor)
- `Final<State>` is the conventional terminal Response variant (carries actor's accumulator)
- Flavor 1 (coordinator-explicit per-peer shutdown) over Flavor 2 (bracket auto-helper) — disqualified Flavor 2 on Simple + Honest
- Tier-placeholder convention: `:user::thread-main` placeholder (thread); `:user::main` LITERAL (process; ambient stdio); remote TBD
- `!` suffix on impure-handle binders (ThreadPeer/ProcessPeer/IOWriter/etc.); pure values unsuffixed
- HashMap-as-Box is ANTI-PATTERN; bare value is the state (no Box primitive — DISQUALIFIED on four)
- Three-line handler shape per match arm (compute, send, recur); Terminal is single send
- Thread tier IS the workhorse for intra-process shared state (caches, logs, registries); process tier when crash-isolation or boundary value exceeds EDN-serialization cost
- ServiceWithProvisioning pattern: shared-state actor with Provision / Deprovision Request variants alongside domain ops
- Fractal deployment composition is the lab-trading shape; reconstruction inherits this as the canonical model

**Key disk anchors for fresh post-compaction agent (read in order):**

1. `docs/COMPACTION-AMNESIA-RECOVERY.md` — the protocol
2. This file `INTERSTITIAL-REALIZATIONS.md` — search for "2026-05-16" and read those entries in document order; tonight's chain runs Kay-OOP → control-channels → service-with-provisioning → THIS BREADCRUMB
3. `docs/arc/2026/05/170-program-entry-points/BRACKET-IMPLEMENTATION-STONES.md` — status of each stone
4. `docs/arc/2026/05/170-program-entry-points/BRIEF-COUNTER-ACTOR-PROOF.md` + `EXPECTATIONS-COUNTER-ACTOR-PROOF.md` — what sonnet is/was working on
5. `docs/arc/2026/05/170-program-entry-points/SCORE-STONE-D2-COORDINATOR.md` — what shipped immediately before this work
6. `docs/USER-GUIDE.md` § "Runtime reflection" (extended in arc 201 closure) — what's exposed to users now

**Branch state:**
- `arc-170-gap-j-v5-deadlock-state` is the working branch
- Lab repo (`/home/watmin/work/holon/holon-lab-trading`) at `8701317` (058 changelog rows for arcs 200/201/202; main branch; clean)

**Open scheduled wakeup:**
- A wakeup is scheduled for the Counter actor proof sonnet's failure-to-communicate fallback (~22:47 UTC). If sonnet completes first, task-notification arrives normally + wakeup is no-op when it fires. If sonnet hangs, wakeup fires and orchestrator decides keep-waiting vs TaskStop per recovery doc § 7 time-boxing discipline.

The substrate teaches; we listen; we ship; the disk remembers.

---

### Addendum — state-shape taxonomy + handler-shape taxonomy + Box rejected

**User's framing 2026-05-16:** *"i agree that State is whatever it must be ... we can just TCO the state into the next iteration"* + *"the increment call .. it looks wrong... it should be ... (let [new-n (+ state n)] (send server-tx! (Counter/Response/Ok new-n)) (:counter/dispatch server-rx! server-tx! new-n)) ... that's the whole handler?..."*

Yes — that IS the whole handler. Three lines per arm: compute, send, recur. The Counter example above was updated in place per these recognitions.

**State-shape taxonomy — when to use what:**

| State shape | Right type | When |
|--|--|--|
| Single value | The value itself — `:i64`, `:String`, `:bool`, `:Vector<T>` | The actor guards ONE thing. No HashMap-as-Box; the bare scalar IS the state. |
| Multiple named fields | `struct` — `(:wat::core::struct :Counter/State [count :i64 last-update-ts :i64 mutations :i64])` | Multiple fields known at write time; types matter; field access is positional. |
| Dynamic key→value pairs | `:HashMap<K, V>` | Keys determined at runtime; user-data caches; symbol tables; honest map semantics. |

**The HashMap-as-Box anti-pattern (corrected in this entry):** earlier drafts of the Counter example used `:HashMap<:keyword, :i64>` as `{:count value}` — a single-key map wrapping one integer. Pure ceremony; same as `Box<i64>` in Rust but worse (no Rust ownership reason in wat). The bare `:i64` is the honest form. Reflex was wrong; corrected.

**Box primitive — four questions:**

| | Score |
|--|-------|
| Obvious | NO — "box" is a Rust ownership concept (heap-allocate for recursive types or shared mutable semantics); wat is immutable + by-value; no aliasing problem |
| Simple | NO — adds a substrate type for zero new capability; bare `T` works wherever `Box<T>` would |
| Honest | NO — names a Rust pattern in wat where it doesn't fit |
| Good UX | NO — actively harmful: users (and AI authors) reach for it reflexively and obfuscate single-value state |

→ **DISQUALIFIED on all four.** No `Box<T>` primitive. Use bare values.

**Handler-shape taxonomy (per match arm in a dispatch loop):**

| Arm shape | Form | Example |
|--|--|--|
| **Read** | `(:wat::core::do (send ...) (:dispatch ... state))` — state unchanged; reply current; recur same state | Get |
| **Mutate-computed** | `(:wat::core::let [new (...)] (send ... new) (:dispatch ... new))` — let-bind new state once; reply + recur with it (DRY) | Increment |
| **Mutate-literal** | `(:wat::core::do (send ... lit) (:dispatch ... lit))` — no compute; reply + recur with the literal value | Reset |
| **Terminal** | `(send ... (Final state))` — single expression; fn returns nil implicitly; no recur; thread exits | Shutdown |

Three lines per handler (Read/Mutate-computed/Mutate-literal); single line for Terminal. Each handler is one tiny mini-TCP roundtrip. The lockstep is structural (bounded(1) channels prevent racing). The dispatch fn body IS the encapsulation boundary. This IS Kay's OOP, mini-TCP, and DI — three vocabularies, one shape.

**Inscription history (for future readers):**

The Counter example in this entry was refined three times in the same session:
1. Initial draft used `loop`/`recur` (Clojure idiom) — corrected per ITERATION-PATTERNS.md § Pattern 6 (wat has no loop/recur; native TCO via recursive defn).
2. Second draft used `:HashMap<:keyword, :i64>` as `{:count value}` (HashMap-as-Box anti-pattern) — corrected to bare `:i64` per the state-shape taxonomy above.
3. Third draft used zero-arg `Ok` Response with two-form match arm bodies — corrected to one-arg `Ok` carrying new state + let-bind-then-use handler form per the handler-shape taxonomy above.

Each iteration tightened toward the canonical form. The path is preserved here so future readers see how the recognition refined, not just the final form.

---
