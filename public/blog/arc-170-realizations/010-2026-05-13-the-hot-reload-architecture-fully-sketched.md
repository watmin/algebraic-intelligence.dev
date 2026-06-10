## 2026-05-13 — The hot-reload architecture, fully sketched

The post-Gap-I-A "let's get insane" conversation surfaced a complete hot-reload architecture across multiple turns. Captured here so the arc stubs that came out (191 refresh + 192 + 193 + 194) have their context preserved.

**The progression:**

1. User asked how dynamic wat actually is. Within-universe: no (static types frozen at startup). Across universes via spawn: yes (each spawn = new type universe with full static checking).

2. User noticed we're close to POSIX exec. We have spawn-process (fork+exec); we don't have bare exec (replace current universe). Arc 191 stub opened to mint `:wat::kernel::exec-program`. Load-bearing insight: the three substrate services are tied to OS-process resources, not universes — they survive universe-swap as the OS-continuity layer.

3. User asked "as long as no new rust files... we can pull off a hot reload?" YES — and stronger: wat is hot-reload-capable BY DESIGN. AST-as-data + universe-granular static typing + services-as-continuity eliminate the categories of hardness that block hot reload in other runtimes. No ABI, no monomorphization, no codegen, no layout drift. The substrate is the interpreter; new AST + freeze IS the hot reload.

4. User noticed we're approaching Clojure. Yes, but the convergence is via different mechanisms because the constraints differ — static typing (mandatory), LLM-first authoring, universe-granular composition. wat is what Hickey would design today if the constraints were: LLM co-authors primary, static typing as foundation rather than graft, universe-granular composition replacing namespace-granular swap.

5. User asked "how insane can we take this hot reloading? everything that wat is edn? we should just edn-ify our state and boot into a new universe with our value?" YES. The boundary: open handles (channels, services, threads, call stacks) aren't data; everything else is. Three layers identified:
   - Layer 1 (arc 191): bare exec, no state carry-over
   - Layer 2 (arc 192): state-preserving exec with carry-over bindings
   - Layer 3 (arc 193): universe image dump/resume (Smalltalk-style)

6. User asked "how do threads exist in this universe jumping?" Surface three options (refuse / concurrent / kill); Erlang-precedent for concurrent universes; the channel-type-safety subtlety.

7. **User proposed cooperative migration: signal-driven state capture.** Compliant threads register a {capture-state, resume-from-state} interface; on reload signal they gracefully shutdown with their data; the substrate carries state over to the new universe. This is Erlang/OTP supervisor model applied to universe-jumping. The substrate provides minimal primitives (signal delivery + exec-with-state); a wat-side library codifies the pattern; user code is clean.

8. **Signal naming.** User first proposed SIGWINCH ("window changed" — metaphor for context-changed). Then noticed TUI collision risk and pivoted to **SIGEMT** ("emulator trap" — wat-cli IS an emulator/interpreter for wat-land; SIGEMT is the host interrupting the guest; semantically aligned with what reload IS at the OS-process level). SIGEMT is also unused in practice — no terminal driver, no shell, no daemon manager sends it. The substrate's reserved universe-reload signal is now SIGEMT.

9. **User asked "we could signal ourselves and cascade it.. (:wat::kernel::exec forms) who does all the things?"** The high-level all-in-one primitive emerged: `:wat::kernel::exec` does signal cascade + state collection + universe swap as one substrate-orchestrated operation. The user writes `(exec forms)`; the substrate does the dance. Three-tier primitive stack:
   - Bare: `exec-program` (arc 191)
   - Stateful: `exec-program-with-state` (arc 192)
   - **Orchestrated: `exec` (arc 194)** — the one users actually call

**The signal-cascade scope decision:** SIGEMT cascades INTRA-PROCESS only. Children spawned via spawn-process are separate universes; they handle their own reloads. The cascade reaches all threads in the wat-cli's OS process.

**Workers referenced by NAME, not function reference.** A worker registered as `:user::data-worker` exists in the old universe; if the new universe's AST also defines `:user::data-worker`, the substrate resolves the name in the new universe and resumes the worker there with carried-over state. This is the load-bearing piece that makes cross-universe resume work.

**What the user actually writes (the goal state):**

```scheme
(:wat::kernel::spawn-with-state :name :user::data-worker :initial-state {})
;; ... time passes; worker accumulates state ...
(:wat::kernel::exec next-program-ast)
;; ... old universe unwinds; new universe boots with workers resumed
```

That's it. Substrate handles SIGEMT, state collection, freeze, lift, exec, resume. User code is two lines.

**Comparison to existing runtimes:**

| Capability | Erlang/OTP | Smalltalk | Clojure | wat (after 191-194) |
|---|---|---|---|---|
| Per-symbol redef | — | yes | yes | — (universe-granular instead) |
| Per-universe swap | yes (module reload) | partial (image) | — | yes (exec) |
| Image dump/resume | — | yes | — | yes (193) |
| Static typing | no | no | optional | yes, per universe |
| Cooperative migration | yes (supervisor) | — | — | yes (194) |
| State carry-over | yes (handoff fns) | image-level | — | yes (192) |
| Signed reload | — | — | — | yes (signed-exec) |
| LLM-first authoring | no | no | no | yes (design intent) |

wat is the only runtime that has ALL of these — and they compose because none was designed in isolation. The substrate's design choices (AST-as-data, universe-granular static typing, services-as-OS-continuity, Zero-Mutex doctrine, typed channels) make every column in this table fall out from foundation rather than be bolted on.

**The architecture is shelved.** Arc 170 is still in flight; Phase 2a just closed (Gap I-B shipped during this conversation). Phase 2b lies ahead. The 191/192/193/194 stubs capture this conversation's vision so we can return to it after 170 closes. The user said: *"we'll chase these later... you've convinced me we should entertain this."*

---
