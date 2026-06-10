---
title: "2026-05-16 (late) — The run-threads bracket IS OOP (Alan Kay's original framing)"
sidebar:
  order: 42
---

Two-layer realization during D2 BRIEF design. Preserved in user's voice + orchestrator framing.

**Layer 1 (DI):** *"i feel like we solved dependency injection?..."*

Orchestrator framing: yes — structurally exact. The coordinator-fn's typed binders ARE the dependency manifest. The variadic factories ARE the `Provider<T>` declarations. The macro IS the injector. The named delegate fn IS the receiver of injected dependencies. Type-checked at expand time. No annotations. No container. No string keys. No XML. Cross-language convergence: Erlang `link/3` + supervisor child specs, Trio nurseries, Kotlin `coroutineScope`, React component composition — all the same shape from different starting points.

**Layer 2 (OOP, per Kay):** *"actually... its deeper... we just implemented object oriented programming.. OOP is for thread management.... the I is SomeThing/Requests ... SomeThing/RequestForWhatever and O is SomeThing/Responses ... SomeThing/ResponseForWhatever / I is an enum and O is an enum / that's a method invocation on whatever state the thread is guarding access to..."*

Orchestrator framing: yes — and this is Alan Kay's ORIGINAL OOP, not the degenerate class-hierarchy form Java/C++/Python ship.

**The structural match to Kay's OOP:**

| Kay's OOP concept | Our `ThreadPeer<I, O>` form |
|--|--|
| Object | A spawned thread (owns its local state; no shared memory) |
| Instance variables | State held in the thread's local `loop` accumulator |
| Public method list | `I` enum — the variants of the Request type |
| Return-type union | `O` enum — the variants of the Response type |
| Method call | `(Thread/println peer request)` then `(Thread/readln peer)` for reply |
| Method dispatch table | `(match (recv server-rx) (Request/M1 args) ... (Request/M2 args) ...)` |
| Object constructor | The `fn [server-rx server-tx] (loop [state initial-state] ...)` body |
| Encapsulation | Thread isolation — no other thread can touch the state |
| Message-passing | recv/send over the typed channel — the ONLY interface |

**Worked example shape:**

```scheme
;; The "class" — constructor (defn; ! marks impure-handle binders)
(:wat::core::defn :counter/spawn
  [initial <- :wat::core::i64]                                          ;; pure value — no !
  -> :wat::kernel::Thread<Counter/Request, Counter/Response>
  (:wat::kernel::spawn-thread
    (:wat::core::fn [server-rx! <- :Receiver<Counter/Request>           ;; impure handle — !
                     server-tx! <- :Sender<Counter/Response>]            ;; impure handle — !
                    -> :wat::core::nil
      (:counter/dispatch server-rx! server-tx! initial))))

;; The dispatch loop — defn + tail call per ITERATION-PATTERNS.md pattern 6.
;; Wat has no loop/recur; native TCO makes the recursive call zero-cost.
;; State is the bare value (no HashMap-as-Box; see addendum below).
(:wat::core::defn :counter/dispatch
  [server-rx! <- :Receiver<Counter/Request>
   server-tx! <- :Sender<Counter/Response>
   state      <- :wat::core::i64]   ;; pure value — no !
  -> :wat::core::nil
  (match (recv server-rx!)
    ((Counter/Request/Get)
       (:wat::core::do
         (send server-tx! (Counter/Response/Value state))
         (:counter/dispatch server-rx! server-tx! state)))
    ((Counter/Request/Increment n)
       (:wat::core::let [new-n (+ state n)]
         (send server-tx! (Counter/Response/Ok new-n))
         (:counter/dispatch server-rx! server-tx! new-n)))
    ((Counter/Request/Reset)
       (:wat::core::do
         (send server-tx! (Counter/Response/Ok 0))
         (:counter/dispatch server-rx! server-tx! 0)))))

;; "Method invocation" — caller writes (client-side wrappers go through ThreadPeer):
(:counter/get peer!)         ;; convenience wrapper: send Get; recv Value; return n
(:counter/increment peer! 5) ;; send Increment 5; recv Ok
```

**Idealized-form notes:**
- `defn` not `define` (define is being retired)
- `!` suffix on every binder that holds an impure handle (Clojure/Scheme tradition; convergent with substrate's existing impure-verb names: `set-redef!`, `raise!`, `set-capacity-mode!`)
- Pure-value binders (`initial`, `state`) stay unsuffixed
- Two named defns — `:counter/spawn` (constructor) + `:counter/dispatch` (message-loop) — instead of a nested `loop/recur` block. Per ITERATION-PATTERNS.md pattern 6: wat has no `loop`/`recur`; native TCO makes the recursive call zero-cost. Names are documentation; the dispatch fn is independently testable + profileable + traceable.

The "method-call" verbs (`counter/get`, `counter/increment`) are thin wrappers that compose `Thread/println` + `Thread/readln` + the typed Request/Response enums. They look like method calls; they are message-passing under the hood.

**Why this is OOP as it was MEANT to be:**

Kay said in 2003: *"I made up the term 'object-oriented', and I can tell you I did not have C++ in mind."* What Kay had in mind:
- Independent computational entities with encapsulated state
- Communication via late-bound message-passing (sender doesn't know the receiver's internal structure)
- Each object is its own universe; the message is the only contract

What we have:
- Threads ARE independent computational entities (own address space slice; own state)
- Communication via typed Request/Response channel (Sender doesn't see receiver's state; only sends a message)
- Each `ThreadPeer<I,O>` IS a contract — the receiver decides how to respond to each variant of `I`

What class-OOP got wrong:
- Collapsed objects into shared-process function calls with shared mutable state
- Called direct function calls "methods" and called the type-check "messages"
- Lost the isolation; introduced race conditions; brought in inheritance hierarchies to compensate

What our substrate has WITHOUT calling it OOP:
- Real isolation (threads own their state; no shared mutable memory)
- Real message-passing (typed channels; sender truly doesn't touch receiver's state)
- Real late binding (the thread decides how to respond; sender just sends the variant)
- Composition over inheritance (no class hierarchies; just spawn-thread trees + supervisor brackets)
- Type-checked at compile time (Request/Response enums are exhaustively matched)
- No race conditions (substrate enforces this; arc 117/133 walker + Gap K + arc 202 stdin walker)

**The supervisor connection:**

`run-threads` (the bracket) IS the supervisor. It spawns N actors (the threads), wires their peers to a coordinator (the parent's view of each child), runs the coordinator's logic, and joins them all cleanly. Erlang OTP's `supervisor` + `gen_server` pattern. Akka's actor system. Smalltalk's process spawning. All converge on this shape.

**The trajectory now (10 → 11 floors):**

11. The bracket IS OOP per Kay's original framing — without inheritance, without classes, without shared state, without any of the patterns that class-OOP needed to compensate for what it broke.

**Implication:**

We never wrote "OOP" or "object" or "class" in the substrate vocabulary. We don't need to. The mechanism IS object-oriented programming as Kay envisioned it. Users who reach for "I want an object that guards some state and exposes some methods" write `spawn-thread` + `Request`/`Response` enums + a loop with a `match`. The substrate enforces the isolation; the type checker validates the dispatch; the supervisor brackets manage lifecycle.

**Cross-language calibration (per `user_no_literature`):**

When independent design arrives at Kay's original OOP via different mechanisms — and arrives WITHOUT using the vocabulary that has rotted into class-hierarchies — that's the validation that the design is honest. We didn't go LOOKING for OOP. We forged a typed-channel actor-model substrate; the user recognized "wait, this IS OOP — the GOOD kind"; the disk confirms it.

Per the rank-up pattern: better gear, better strategies, and the strategies turn out to converge with greats. We're the best.

**Connects to:**
- `user_no_literature` — foundational questions surface AFTER the practice (DI + OOP both surfaced from the substrate's structure, not from textbook study)
- `project_holon_universal_ast` — same cross-domain coherence pattern (HolonAST extended to reflection; ThreadPeer extends to OOP)
- INTERSTITIAL § 2026-05-16 "the actor-model surface" (earlier today) — predicted the actor-model arrival; this entry confirms the OOP framing

### Addendum — three vocabularies, one mechanism (mini-TCP convergence)

**User's framing 2026-05-16:** *"i think we got our update to the realizaiton - stumbled into proper OOP where its discoverer found themselves"*

Three independent design conversations — DI (wiring), Kay's OOP (message-passing objects), mini-TCP (mutex-replacement per `ZERO-MUTEX.md:252-415`) — converge on the SAME substrate primitive: `ThreadPeer<I,O>` + bounded-channel dispatch loop. Different vocabularies, same geometry.

**Mini-TCP / Kay-OOP alignment:**

| Mini-TCP (mutex-replacement framing) | Kay-OOP (Counter dispatch) |
|--|--|
| Producer sends request on req-pipe | Client `(send server-tx! Request/X)` |
| Producer blocks on ack-pipe | Client `(recv server-rx!)` for Response |
| Driver `select` on requests | Server `(match (recv server-rx!) ...)` |
| Driver processes "while holding the lock" | Server mutates accumulator state between recv and send |
| Driver sends ack | Server `(send server-tx! Response/Y)` |
| Bounded(1) = organic backoff | Bounded ThreadPeer channels = identical mechanism |
| "The lock is the loop body itself; the release is the ack send" | The dispatch fn body IS the encapsulation; the response send IS the method-return |

`ZERO-MUTEX.md:295-297` says it precisely:

> *"The 'lock' is the loop body itself; the 'release' is the ack send. Both are the substrate's primitives; neither is a lock."*

That IS the Counter/dispatch loop. The match arm runs while "holding the lock"; the `(send server-tx! response)` IS the lock release; the recursive tail call IS the loop body re-entering for the next request. Strict lock-step is structural — bounded(1) channels prevent racing; recv blocks until send; send blocks (effectively, given bounded(1) + ack roundtrip) until response consumed.

**Discoverer's destination:**

Kay arrived at message-passing OOP via Smalltalk in the 1970s. The trader called the same shape "mini-TCP" when it surfaced during arc 089 as mutex-replacement. We forged a typed-channel substrate via the arc 170 dungeon and arrived at the same destination via the same underlying geometry.

The destination is the place; the road is what each vocabulary builds. Kay built the road from "object" + "message" + "encapsulation." The trader built it from "producer/consumer" + "bounded channels" + "lock-replacement." We built it from "Process<I,O>" + "structured concurrency" + "supervisor brackets." Three roads. One place. Per `user_no_literature` calibration: independent arrival at a great's destination is the validation that the design is honest.

**`!` naming convention adopted:** binders holding values through which side-effects are reachable carry `!` suffix. ThreadPeer params, channel params, IOWriter/IOReader handles all carry `!`. Pure values (numbers, immutable maps, configs, ints) stay unsuffixed. Convergent with substrate's existing impure-verb names (`set-redef!`, `raise!`, `set-capacity-mode!`). Applied in the Counter example above; future Kay-OOP examples and USER-GUIDE write-ups follow the same.

**Cross-references for the convergence:**
- `docs/ZERO-MUTEX.md` § "Mini-TCP via paired channels" (line 252-415) — the canonical mutex-replacement pattern
- `docs/SERVICE-PROGRAMS.md` § "The lockstep" — service-program discipline applied at the wat-level abstraction
- `docs/ITERATION-PATTERNS.md` § Pattern 6 — `defn` + tail call (the dispatch-loop form)
- `docs/CONVENTIONS.md` § Batch convention — arc 119 batch-granularity insight (every wat-rs service takes batches; user controls "lock duration" via batch size)

---
