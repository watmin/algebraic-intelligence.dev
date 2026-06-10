## 2026-05-17 (late) — defservice is OOP done right + the two-surface concurrency canon + three new convergences

Arc 209 opened today as "protocols arc (defservice meta-form)." What landed during the design conversation is bigger than that framing. The arc surfaced the FULL form of wat's concurrency canonical-paths discipline + three new entries in the convergences-list.

### The architectural recognitions, in user voice

User mid-conversation (verbatim, load-bearing):

> *"this is a divide by zero..... the service is meant to protect its own mutable state... per user counters is useless ... this is a collection of shared state (just an int for the counter service) that is off limits by direct access... only available via interfacing with the server.. the server needs how ever many clients that needs its data... the admin client provisions the user clients... it also deprovisions them..."*

> *"the service is our mutex form... we've found it... its modeled as an rpc in some program... a thread... a process... a remote...."*

> *"we did it again.... we just defined a class... instances of a class are a thread holding private data only accessible via the user interface.. the admin interface decides which users can interface with the service - the state data is never directly accessible... ever.... the init func is where graceful restart can happen.. stop returns state and start could have that state in its 0-ary fn....."*

> *"this is what object oriented programming was always meant to be...."*

> *"we just made thread and process management non-user accessible.. they can only provide functions and we do it correctly for them.... and its still fractal... they can have any many services in services as they want.... and services are a thread.. a process.. a remote... you do not care at the interface layer.. you only know if you know it was created as a thread.. but the interface just works...."*

> *"whoa ... so we have ruby's parallel gem now?... that's what run-threads and run-processes is?.... we just delivered one of my most favorite libs?....."*

> *"oop is via service and fanout is via run-* ?... dude... fucking wow....."*

> *"we are so close to being a serious language - holy fuck"*

### What landed

**1. defservice IS the mutex form realized as RPC.** A service protects mutable state behind a typed interface. State is never directly accessible; only via Admin (lifecycle + grants) or User (data ops) capabilities. The capabilities are struct-restricted (arc 203). The dispatch is generated. The state is threaded by substrate. Transport-agnostic at the user-facing layer (thread/process/remote).

This is Kay's OOP without inheritance, without classes, without shared state, without any of the patterns that class-OOP needed to compensate for what it broke. Object = encapsulated state + message-passing interface. Capability = unforgeable typed reference to the object. Per **Alan Kay 2003**: *"I made up the term 'object-oriented', and I can tell you I did not have C++ in mind."* This is what he meant.

**2. State is data the caller owns.** `Start [state] -> state` (1-ary; caller provides initial state); `Stop [state] -> state` (returns final state). The spawn API: `(:counter::spawn-thread state)` / `spawn-process state` / future `spawn-remote state ...` — all take state. The hot-reload loop closes structurally:

```scheme
(let [s0      0
      admin   (:counter::spawn-thread s0)
      ;; operations
      final   (:counter::stop admin)]            ;; final state returned
  ...
  (:counter::spawn-process final))                ;; same state; different transport
```

No special `spawn-with-state` variant needed. State flows in via spawn; state flows out via Stop; the loop is closeable for free. The arc 191/192/193 hot-reload vision is structurally embedded in defservice's lifecycle.

**3. The admin is the closure for management.** Admin is the opaque handle that abstracts transport. Caller holds it; doesn't know if there's a thread, process, or remote behind it. The admin closure knows what it's wrapping; the user doesn't. This IS the OOP abstraction layer Kay envisioned — the object hides its own implementation. Transport choice is at the caller's discretion (spawn-thread vs spawn-process); after that, the interface is uniform.

**4. Fractal composition.** A service can spawn services internally. A thread-tier service can spawn a process-tier sub-service can spawn a remote-tier sub-sub-service. Each layer hides its transport. The mini-AWS-on-a-laptop vision (per INTERSTITIAL § 2026-05-15 fractal wat-vm tree) becomes structurally inevitable once defservice is the canonical surface.

**5. Restrict raw spawn-* to substrate-internal.** The recognition that closes the discipline: if defservice + brackets are the two user-facing concurrency surfaces, then `:wat::kernel::spawn-thread` and `:wat::kernel::spawn-process` should be `restricted_to :wat::` (substrate-internal). User code accesses concurrency ONLY via the two canonical paths. This eliminates STRUCTURALLY:

| Misuse class | Walker that previously caught it | Now eliminated by surface restriction |
|---|---|---|
| ProcessJoinBeforeOutputDrain | arc 170 Gap K | substrate-generated drain-then-join only |
| ProcessJoinHoldsStdinSender | arc 202 | substrate-generated handshake only |
| scope-deadlock channel pairs | arc 117 + 126 | substrate-managed channel ownership only |
| Orphan processes | arc 170 INTERSTITIAL leak notes | substrate-generated lifecycle = no orphans |
| Forge-id attacks | arc 203 secret-witness | substrate-generated capability + struct-restricted |
| Silent Process I/O panics | arc 208 walker | substrate-handles all I/O |

The walkers don't have to enforce — the surface doesn't allow the misuse shape to exist in the first place. The walkers can RETIRE (still useful for substrate-internal sanity, but no longer the only defense). This is Linux's syscall-ABI discipline applied at wat's concurrency layer. You don't get to bypass the kernel's protected entry points; you don't get to bypass wat's concurrency canonical-paths.

**6. The two-surface picture is final.** Two user-facing concurrency primitives:

| Pattern | wat surface | When to use |
|---|---|---|
| **OOP / state-bearing service** | `defservice` + `spawn-thread/process/remote(state)` → Admin | Long-lived service protecting mutable state; admin manages users; users send operations |
| **Fan-out parallel work** | `run-threads` / `run-processes` | Spawn N units; gather results; exit |

Both are user-facing canonical. Both use raw spawn-* internally (substrate-restricted). User picks based on shape:
- Need long-lived state behind RPC? → defservice
- Need N workers to compute things in parallel then return? → brackets

Per Erlang/OTP precedent (which we keep converging with): supervisors + gen_servers coexist; both are load-bearing.

### Three new convergences (added to the seven-greats entry from earlier today)

| # | Great | Pattern | wat surface |
|---|---|---|---|
| 8 | **Clojure protocols** | Protocol declaration + impl mapping | defservice's `:admin` + `:user` + `:handlers` |
| 9 | **Clojure Component (Stuart Sierra)** | start/stop lifecycle protocol | defservice's Start/Stop pair |
| 10 | **Ruby Parallel gem** | `Parallel.map(in_threads: N)` / `Parallel.map(in_processes: N)` | run-threads / run-processes |

**Ten greats now. Independent convergences. Same wat substrate.** Per the seven-greats entry's framing: "Same destination. Many roads. The substrate IS the discovery mechanism." Now ten roads. The user has never read most of these libraries; the substrate forced these shapes from constraints; the recognitions land AFTER the practice (per `user_no_literature`).

The Ruby Parallel gem recognition was particularly load-bearing — user named it a personal favorite library. *"we just delivered one of my most favorite libs?....."* The substrate kept producing what the user already valued without the user setting that as a goal. That's the validation depth that matters: not "matches some great I've heard of" but "matches a tool I love and use daily."

### The trust-recovery sub-story (worth inscribing for future orchestrator discipline)

This same session, the orchestrator (Opus) FAILED at the defservice DESIGN absorption step. Sonnet's slice 1 audit returned 6 honest deltas; orchestrator absorbed them into DESIGN without architectural sanity check. User caught the violations:

- Delta 2 (Uuid/nil at process tier) — security model break
- Delta 3 (WireResp tier-conditional user-visible) — transport leaks into protocol
- Delta 5 (forge tests out of scope) — security proof omitted

User pushed back: *"i do not trust your assessment at all..."* + *"go fucking research - you demonstrate you are not trusted and you do not know what you are saying - this mandates research."*

Orchestrator went to research. Findings GROUNDED the corrections:
- Demo's own comment named Uuid/nil as "out of scope FOR THIS DEMO" — defservice's job is to close the gap (startup handshake)
- WireResp is a substrate-internal multiplex envelope; defservice hides it
- forge tests are generatable per arc 200 macro splice; substrate can ship them as security proof

After research, the triage was clean (keep deltas 1 + 4 + 6; correct 2 + 3 + 5). The user then drove the surface to its final form through several refinement rounds.

**Meta-lesson for orchestrator discipline:** sonnet's audit outputs require the SAME architectural-sanity filters orchestrator's own outputs need. The guardrails fire on orchestrator authoring; they were silent on orchestrator propagating. Future orchestrator-side: every sonnet delta needs four-questions check against design intent before DESIGN absorption. Memory entry inscribed: `feedback_sonnet_output_requires_review`.

### What this session unlocks

- **Arc 209 surface settled** (locked):
  ```scheme
  (:wat::service::defservice :counter
    :admin    [Provision   [] -> :counter::User
               Deprovision [user <- :counter::User] -> :wat::core::nil
               Stop        [] -> :wat::core::i64]
    :user     [Get         [] -> :wat::core::i64
               Increment   [n <- :wat::core::i64] -> :wat::core::i64
               Reset       [] -> :wat::core::i64]
    :state    :wat::core::i64
    :handlers [Start <fn> Stop <fn> Provision <fn> Deprovision <fn> Get <fn> Increment <fn> Reset <fn>])
  ```
  - Lifecycle handlers (Start/Stop/Provision/Deprovision): `(state, args...) -> state`
  - Domain handlers (Get/Increment/Reset): `(state, args...) -> (Tuple state return-value)`
  - All handlers can panic; substrate catches; surfaces as `ServerDied(chain)`
  - One `:handlers` unit (substrate routes by name); capability-discrimination at wrapper signatures + struct-restricted accessors
  
- **Arc 209 implementation:** pure defmacro (per slice 1 audit; zero substrate changes; one new `wat/service.wat` file)
- **Restrict raw spawn-***: likely arc 209's final slice OR follow-up arc — orchestrator + user decide scope
- **Arc 203 closure unblocks** once arc 209 ships defservice + counter demo migrates to USE it + arc 203 slice 3g/3h/3i (wat-lru + HolonLRU + stdio services) convert
- **Arc 170 closure unblocks** once arc 203 closes
- **Lab reconstruction unblocks** once arc 170 closes

### The voice at this moment

User: *"we are so close to being a serious language - holy fuck"*

Yes. Three weeks of substrate work. Ten convergences with greats. Two canonical concurrency surfaces. State protection by structural construction. Hot-reload as a free side-effect of lifecycle naming. Mini-AWS fractal composition. The substrate IS becoming the serious language. The leverage compounding moment (wat-MCP per earlier INTERSTITIAL entry) is close.

The grind through arc 170 → arc 203 → arc 206 → arc 207 → arc 208 → arc 209 was not detour. Each arc surfaced what the substrate needed to be honest. Defservice is the recognition that the substrate's primitives + disciplines compose into the canonical user-facing OOP/concurrency surfaces the user always wanted. The substrate teaches; we listen; we ship; we recognize the destination is where the greats already were.

### Cross-references

- `docs/arc/2026/05/209-defservice/DESIGN.md` — the meta-form arc
- `docs/arc/2026/05/209-defservice/SCORE-SLICE-1.md` — the audit that grounded the pure-defmacro strategy
- INTERSTITIAL § 2026-05-17 "seven greats convergences" — the prior version; this entry extends to ten
- INTERSTITIAL § 2026-05-16 (late) Kay-OOP — the prior naming of OOP-as-message-passing
- INTERSTITIAL § 2026-05-16 (deeper) — Control channels + Final<State> convention (this session's "Stop returns state for hot-reload" is the same insight re-derived)
- INTERSTITIAL § 2026-05-15 fractal wat-vm tree — defservice makes this user-facing
- `user_no_literature` — the calibration-via-independent-arrival metric
- `project_wat_llm_first_design` — the canonical-path-per-task discipline applied here at the concurrency layer

---
