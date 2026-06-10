## 2026-05-16 (settled) — the actor-model surface: client/server symmetry, one canonical bracket per unit type

**Continuation of the deeper walk.** After the Erlang/OTP arrival, the design conversation went further into precise surface shape. Pinning the final form here.

### The actor-model arrival (named)

Walking the bracket pattern + main-fn semantics surfaced that what we're building IS the **actor model**. Every spawn is a client/server relationship:

- **Parent = client.** Holds peer handles to its servers.
- **Child = server.** Holds peer handle back to its client.
- **Communicate via readln/println** in both directions over those handles.
- **Each unit's main-fn returns Result<unit, Err>** — like an OS exit code (clean=0, failed=1). The MEANINGFUL data flows through the pipes during execution; the "return" is just exit status.
- **Brackets compose fractally** — Erlang OTP supervision tree with linked processes. Tokio JoinSet. Trio nurseries. Actor model.

### The canonical surface (settled)

**Substrate vends EXACTLY these primitives:**

```scheme
;; raw (basically test-only — user wraps these immediately in their UX tooling)
(:wat::kernel::spawn-thread  main-fn)    -> :Thread<I, O>
(:wat::kernel::spawn-process program)    -> :Process<I, O>

;; canonical (the recommended user path)
(:wat::kernel::run-threads   [tuple-of-server-fns client-fn] -> :T (client-fn (map spawn tuple-of-server-fns)))
(:wat::kernel::run-processes [tuple-of-server-programs client-fn] -> :T ...)

;; future:
(:wat::kernel::run-remotes ...)
```

`run-threads` and `run-processes` ARE the canonical brackets. Singular forms collapse — tuple-of-1 is the degenerate single-server case. Substrate vends ONE form per unit-type; user uses it for 1, N, or fractally-composed.

Substrate-internal-only (REMOVED from user namespace):
- `:wat::kernel::Thread/join-result`
- `:wat::kernel::Process/join-result`

User calls to these → compile error per the walker collapse. arc 117/133 sibling-binding machinery retires.

### User's principle on freestyle spawn

*"we basically never use it ourselves - we should only need to reach for those in testing.. we wrap on top of them immediately in our UX tooling.. the recommended path is the one users follow to not fuck up."*

Freestyle `spawn-thread` / `spawn-process` calls are LEGAL but undocumented-for-users. Substrate testing reaches for them; production wat code uses the brackets. Refusing the bracket gets fire-and-forget semantics (cascade kills orphans on parent exit; no join-result access).

This is **one-canonical-path-per-task discipline** applied at the substrate-API level. Per `project_wat_llm_first_design` energy: the recommended path IS the path.

### The symmetric verb surface

| Side | Thread API | Process API |
|------|------------|-------------|
| Server reads | `(:wat::kernel::Thread/readln peer)` | `(:wat::kernel::readln)` — ambient |
| Server writes | `(:wat::kernel::Thread/println peer data)` | `(:wat::kernel::println data)` — ambient |
| Client reads | `(:wat::kernel::Thread/readln peer)` | `(:wat::kernel::Process/readln server)` |
| Client writes | `(:wat::kernel::Thread/println peer data)` | `(:wat::kernel::Process/println server data)` |

**The ONLY asymmetry:** process-server uses ambient stdio because it has fd 0/1/2 in its universe (exactly one stdin, exactly one stdout — confirmed by user: *"a process can only ever have one stdin one stdout"*). Thread-server has no ambient — must use explicit peer handle. Otherwise: symmetric. Same verb names. Same shape.

### Type shape: Thread<I, O> not Thread<I, O, R>

User settled this:

*"the server has no significant return.. its like a process returning 0 or 1 .. 0 is a clean exit, 1 isn't."*

Server returns `Result<unit, Err>` — just exit status. R param drops from the type. The MEANINGFUL data flows through I/O channels during execution. The bracket's return is `Result<R, ProcessGroupErr>` where R is the **client-fn's** computed value (NOT the server's).

```scheme
spawn-thread  main-fn  -> :Thread<I, O>      ;; main-fn :Fn[Receiver<I>, Sender<O>] -> Result<unit, Err>
spawn-process program  -> :Process<I, O>     ;; program: top-level forms with :user::main returning Result<unit, Err>

run-threads  [tuple client-fn] -> Result<R, ProcessGroupErr>
run-processes [tuple client-fn] -> Result<R, ProcessGroupErr>
```

### Three failure modes, three locations

Cleanly separated, substrate doesn't conflate them:

| Failure mode | Type | Location |
|--------------|------|----------|
| Peer died mid-operation | `Result<_, ThreadDiedError>` | Wraps every send/recv (arc 111 existing) |
| Server panicked uncaught | `ProcessGroupErr` (panic chain) | Bracket's return wrapper; structured-exit OOB |
| App-level "bad input" | User's choice — e.g., `O = Result<X, AppErr>` | Inside user's chosen O type |

Substrate handles #1 and #2. User handles #3 if they want it. Substrate does NOT force `Thread<I, Result<O, Err>>` — that would double-wrap with arc 111 and conflate app-errors with substrate-errors.

### Heterogeneous tuple iteration

Factories produce different `Process<I, O>` types — Vec is homogeneous, can't hold them. **Tuple is required** per arc 109 slice 1g.

Open implementation question: how does the bracket iterate a heterogeneous tuple to spawn each? Two candidates:
- **Macro expansion** — bracket is a wat-level macro that expands to N explicit spawn calls (types resolve at expansion time)
- **Substrate-internal primitive** — substrate knows about tuples; iterates internally

Likely macro. Cleaner separation; substrate primitives stay focused.

### What dies as fallout

Everything from the original "Slice 7 drop variants" framing dies — but as DOWNSTREAM CONSEQUENCE of the bracket existing, not as the primary goal:

| Form | Status |
|---|---|
| `:wat::test::run-hermetic-with-prelude` | **DIES** |
| `:wat::test::run-hermetic-with-io` | **DIES** |
| `:wat::test::run-hermetic-with-io-driver` | **DIES** |
| `:wat::test::run-hermetic-send-inputs` | **DIES** |
| `:wat::test::run-hermetic-drain-outputs` | **DIES** |
| `:wat::test::RunResultIO<O>` (src/types.rs) | **DIES** |
| arc 117/133 sibling-binding walker machinery | **RETIRES** (collapses to one binary check) |

What stays:
- `:wat::test::run` / `:wat::test::run-hermetic` body-only sugar (post-arc-170-slice-4c-β rename)
- `:wat::test::deftest` / `deftest-hermetic` factory macros
- `:wat::test::make-deftest` / `make-deftest-hermetic` factory-of-factories

### Still open

**Q2: bidirectional handle type — one type with direction-aware dispatch, or two distinct types?**

With `Thread<I, O>`:
- Client-side handle: reads O, writes I
- Server-side handle: reads I, writes O

Same I/O parameters; opposite roles. Two candidate shapes:
1. **One type, dispatch-polymorphic verbs** — `Thread<I, O>` is the handle; `Thread/readln` is dispatched (arc 146 dispatch mechanism) on whether the value is a client-side or server-side instance.
2. **Two distinct types** — `:wat::kernel::Thread/Client<I, O>` + `:wat::kernel::Thread/Server<I, O>` as separate types with their own readln/println impls. Substrate generates both from one declaration.

Reading 2 may be more honest (different operations get different types); Reading 1 is more wat-flavored (dispatch-polymorphism is already substrate machinery). Open for digesting.

### Status

The actor-model surface IS the answer to "I want to add argv to main." Eight steps + this realization layer. Arc 170 stays open.

User said: *"let's got our docs straight."* This entry is the docs-straight. The next session walks into a settled architectural surface with one remaining clarification (Q2). Implementation slices come later — shape is now durable.

---
