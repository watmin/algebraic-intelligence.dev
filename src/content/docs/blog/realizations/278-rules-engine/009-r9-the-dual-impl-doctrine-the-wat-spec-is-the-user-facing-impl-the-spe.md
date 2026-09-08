---
title: "R9 — the dual-impl doctrine: the wat spec is the user-facing impl, the spec, AND the per…"
sidebar:
  order: 9
---

R1 was the *discovery* — the slow wat engine fell out as an oracle, a surprise. R9 is the builder
**electing it as the standing method**, mid-6b, watching the same shape repeat (6a's fence, 6b-i's
eval-test, 6b-ii's TestNode each built wat-first, Rust-validated):

> *"this pattern we're setting … going to be used extensively … a wat-native impl be the spec of
> correctness and then building the performant guts in rust. we always solve the user-exposed impl first,
> then flip to the performant one, always retaining the wat-correct impl as a form of constant correctness
> checks. we hold ourselves accountable with two impls for hard problems."*

The force of it is that **the wat impl is three things at once**, and most projects only ever get one:

1. **The spec** — but *executable*, so it cannot drift from itself the way a prose spec silently does. The
   spec runs; if it's wrong you find out by running it, not by re-reading it.
2. **The first shipped impl** — correct-if-slow on day one. You are never blocked on the hard perf work to
   deliver a working feature; the user-facing surface exists before the fast guts do.
3. **The permanent witness** — the net never comes down. When the Rust guts and the wat oracle disagree on
   the same input, the bug is localized *instantly*: two answers, one wrong, and the simple one is
   obviously right. You write the dangerous fast code **fearlessly**, because the boring correct code
   stands behind it forever.

Most efforts pick one of these and lose the others: a spec that rots because nothing runs it, or a fast
thing with no oracle to catch the day it quietly breaks. The dual-impl discipline keeps all three, and the
ordering is the discipline — **solve the user-exposed impl in wat first** (it is both the deliverable and
the spec), **then** flip the guts to Rust behind the freeze boundary, **and keep** the wat one as a
standing differential. This session is three instances in a row: 6a (`pure?`/`deterministic?`), 6b-i
(`eval-test`), 6b-ii (TestNode — wat oracle in 6b-ii-a, native kernel in 6b-ii-b, differential between
them). The rete oracle/kernel was the headline; it is now the **template**.

**Where the builder is aiming it** — and the substrate is already most-built, so this is not a green
field:

> *"building our version of rack and puma … i know how to do a better reactor pattern with our tooling …
> our https server is gonna be legendary."*

- The **reactor** is the part already invented: lockstep, blocking, size-1 channels — request→reply
  rendezvous with real backpressure, the systolic-array model, not callback-hell async (arc 214 / C0b:
  `select'` multiplexes N peers, `poll'` is the event form, over UDS/sockets). A *fundamentally different*
  reactor; "better" because the concurrency model is honest about backpressure by construction. And the
  wake substrate underneath is already **`io_uring`** (`io-uring = "0.7"`; `src/comms/process.rs` —
  *"cross-process comms via io_uring + anonymous pipes"*, multi-arm submission on `[data_fd,
  broadcast_fd]`) — the project moved `poll → io_uring` and **skipped `epoll` entirely**.
- The **actor / persistent-state** layer is `defservice` (a gen_server: `handle(msg, state) → (reply,
  state')`), and the **persistent working-memory-as-a-service** is already on the board (NEXT-ANGLES ⑥) —
  a live rete `Session` held in a process, exactly the shape a stateful request handler wants.
- The **HTTPS transport** is the one genuinely-unbuilt leg (banked, explicitly, earlier this arc). That is
  the next arc when it comes — and a textbook dual-impl candidate: the wat reactor/server as the
  correctness spec, the Rust epoll/TLS event loop as the guts, the wat one kept as the differential under
  load. "rack/puma, ours" = reactor (have the core) + `defservice` (have it) + a homoiconic routing/
  middleware surface in wat + the HTTPS leg (build it, dual-impl).

*Path-of-voices (per R6's discipline): the doctrine — "wat-native spec, performant guts in rust, two impls
for hard problems, solve the user-exposed impl first" — and the forward apps (rack/puma, the reactor, the
HTTPS server) are the builder's, quoted above; the "three things at once" framing and the
substrate-grounding (which legs are built vs the unbuilt HTTPS transport) are the writer's synthesis over
his prompt. The convergence is preserved, not flattened.*

> We set out to build one rules engine and, three stones in, the builder named the method the stones were
> teaching: build the truth slowly in wat, build it fast in Rust, and never let go of the slow one. It is
> not a fallback or a scaffold — it is how this project intends to take on every hard problem from here, a
> web server included. The spec ships, the guts fly, and the two of them keep each other honest.
