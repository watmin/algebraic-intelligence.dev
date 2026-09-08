---
title: "2026-05-16 (deeper) — main-fn returns T; we arrived at Erlang/OTP; arc 170 started from …"
sidebar:
  order: 35
---

**Hammock-driven refinement, walked deeper into the bracket.** The previous entries had the SHAPE of the combinator right but not the full payload semantics. Walking it out exposed:

### Design refinements (correcting my earlier reply)

**Process main-fn:** `:Fn[] -> :T` (NOT `:Fn[] -> :nil`).
- T can be nil — nil is a valid T; nil return = exit-0 semantics
- Non-nil T = the "rich stdout" the user explicitly produces
- Body inside main-fn still uses ambient byte-stdio (println etc.) and can construct Sender/Receiver/from-pipe for typed channels — those are user concerns
- User's exact framing: *"would we ever want to capture the ret val here?... we could totally do something like... build an http server who has an OS main who spawns N threads to manage N processes... the orchestrator is a thread manager for a bunch of threads who each are an individual process manager"*

**Thread main-fn:** `:Fn[Receiver<I>, Sender<O>] -> :T` (or equivalent N-ary channel-taking shape).
- N-ary because threads don't have ambient stdio like processes do — channels come in as args
- Returns T just like processes

**Bracket return:** `Result<R, ProcessGroupErr>` where R is body-fn's return type.
- I had this WRONG in the earlier entry (claimed bare T) — corrected here
- Result wrapper is the explicit "this CAN fail because units can die" surface
- Err carries the panic chain when "anybody panics we all panic"

```scheme
(:wat::kernel::run-processes
  (Vec<Fn[]->Process<T>>)        ;; start-fns; each spawns a Process<T>
  (Fn[Vec<Process<T>>]->R))      ;; body; gets the procs; returns R
  -> :Result<R, ProcessGroupErr>
```

**Link semantics (verbatim user):** *"threads can panic and processes can panic - so - the thread ret type is always an IO <Result,Err> / if anybody panics we all panic - we issue graceful shutdowns and then panic."* This is Erlang's `link/1` semantics — strong coupling, all-or-nothing, supervisor-tree.

**Fractal composition:** every level has a main-fn that returns T → brackets compose → signals propagate up and down via cascade.

### The Erlang/OTP arrival

User verbatim: *"did i seriously just step to where erlang has always been?... this pattern was already here?.... outstanding - this is an actual metric we've been using - if we arrive where another great has been - we know we are where we should be."*

**The metric, named explicitly:** when independent design arrives at a place a "great" has been before, that IS the validation signal. Per `user_no_literature`: foundational questions surface AFTER the practice. The substrate teaches; we follow; eventually we walk into a building Erlang and Trio and Loom designers spent decades constructing — and that arrival is evidence we were honest.

What specifically we arrived at:
- **Hierarchical supervision** — main-fn returns T; brackets compose fractally; signals propagate; Erlang OTP supervision trees
- **Link-and-cascade** — Erlang's `link/1` exactly. Not `monitor` (observe without coupling). All-or-nothing.
- **Graceful-then-forceful shutdown** — OTP's `shutdown` strategy: send shutdown, wait, escalate. Existing `project_signal_cascade` machinery (pgid+killpg) is the substrate primitive.
- **Process groups as first-class** — already there at the OS level; the bracket gives it a wat-level surface
- **Structured concurrency family** — Trio nurseries, Kotlin coroutineScope, Project Loom, Tokio JoinSet. All independently converged on this pattern because it IS the right shape.

The HTTP-server example the user drew: *"build an http server who has an OS main who spawns N threads to manage N processes where N is the CPU count - you can have concurrent, parallel HTTP servers - like a dedicated tokio process per thread - and it can IPC up and down... this feels like how nginx does workers and event limits."* That's literally `inet.gen_tcp` + `supervisor` from OTP, mapped to wat. nginx workers + Erlang supervision tree + tokio per thread, all the same shape.

### The arc 170 origin trajectory

User verbatim: *"this entire arc 170 started from 'i want to add argv to main'."*

**Eight steps from "argv to main" to OTP supervision:**

1. argv to main (the originating impulse)
2. `:user::main` as canonical program entry contract
3. `ExitCode` rationalization → main returns nil (slice 1e)
4. `spawn-process` accepts forms not Fn (slice 6 — the substrate pivot)
5. IPC contract triangle inscribed (Recovery doc Section 13: stdout/stderr/exit-code)
6. Bracket combinator realized (this conversation)
7. Structured concurrency at full power (main-fn returns T; fractal composition)
8. OTP supervision tree pattern arrived at independently

Each step followed honestly from the previous. None anticipated the next. The destination revealed itself.

### Substrate questions still open

**How does process's T return value reach parent?** Three candidates:
1. Stdout-EDN final line — substrate auto-serializes T to fd 1; conflicts with user's free println use
2. Dedicated return-value pipe (fd 3 or similar) — clean but adds an OS fd per process
3. Existing structured-exit-protocol (slice 1i — already shipped) — most likely path; T probably rides on that channel

For threads: T comes back via Rust `apply_function` return; trivial. The process/thread asymmetry is honest substrate (process needs a transport; thread is just a Rust return).

**Graceful-shutdown specifics:** how long do we wait before SIGTERM → SIGKILL? Fixed policy (e.g., 100ms graceful + 100ms SIGTERM + SIGKILL) or knob? Default to fixed; no knobs unless proven necessary.

**Panic message assembly:** which unit died + with what chain. Bracket collects + assembles. Format TBD.

### Status

**Arc 170 is open.** The bracket-direction has substantive new payload. The Erlang arrival is named, witnessed, on disk. Future-me reads this and sees: we walked from "argv to main" to OTP. That trajectory is the proof.

User said: *"this is a realization update - this is incredible."* Honored. Captured. Not paperworked.

---
