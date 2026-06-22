---
title: "2026-05-13 — How the shadow channel fans out across threads"
sidebar:
  order: 23
---

User request: capture the explainer here so future readers don't have to reconstruct it.

The shutdown cascade uses ONE channel and ONE sender that gets dropped. The fan-out — waking N blocked recvs simultaneously — happens INSIDE crossbeam, not in our code. The substrate addition is minimal; we piggyback on a well-known crossbeam invariant.

### The channel topology

```
ONE channel pair, created once at bootstrap (Slice A):
    SHUTDOWN_TX  ──┐
                   │  ONE crossbeam channel
    SHUTDOWN_RX  ──┘  (cloneable Receiver — every clone is a handle to the SAME channel)
```

`crossbeam::Receiver` is `Sync + Clone`. Many references / clones — same channel, same park-list.

### At each recv site (Slice B — wired in typed_recv)

```rust
let shutdown_rx: &Receiver<()> = SHUTDOWN_RX.get().unwrap();
crossbeam_channel::select! {
    recv(data_rx) -> msg => ...,
    recv(shutdown_rx) -> _ => RecvOutcome::Shutdown,
}
```

When this `select!` runs, crossbeam **parks the calling thread on BOTH channels' park-lists**. The thread is registered as "waiting for either data_rx OR shutdown_rx to do something."

100 threads blocked in their own `typed_recv` calls = 100 threads parked on the SHUTDOWN channel's park-list (each ALSO parked on its own data channel's list).

### The fan-out moment

When the worker drops the Sender (after kernel signal → wake-pipe → worker wakes):

```rust
unsafe { drop(Box::from_raw(ptr)); }  // ← Sender drops here, in normal context
```

Inside crossbeam's Sender::Drop:
1. Atomic refcount check: "Was I the last sender?" Yes.
2. Channel marked **Disconnected** (atomic state flip).
3. Crossbeam walks the channel's park-list — every thread parked on this channel gets unparked via futex wake (one syscall per parked thread, tight loop inside crossbeam).
4. Each woken thread's `select!` machinery re-checks the channels; sees shutdown_rx is now Disconnected; takes the shutdown branch.

### Visualized

```
                                ┌─ thread 1 (select on data_a + shutdown_rx)
                                ├─ thread 2 (select on data_b + shutdown_rx)
SHUTDOWN_TX drops ──→ channel ──┼─ thread 3 (select on data_c + shutdown_rx)
                    disconnects ├─ thread 4 (recv on shutdown_rx alone)
                                ├─ ...
                                └─ thread N (select on data_z + shutdown_rx)
                                  ALL WAKE — each select! re-checks,
                                  sees shutdown_rx Disconnected,
                                  returns its shutdown branch
```

Each thread's `typed_recv` returns `RecvOutcome::Shutdown` → wat-level `Err(ThreadDiedError::Shutdown)` → arc 110 Result/expect panics with diagnostic.

### Why this is ZERO-MUTEX clean

- The "park-list" lives inside crossbeam's channel state (internal atomic + intrusive queue). Not our code.
- From the substrate's perspective: hold a Sender in AtomicPtr, drop it via atomic swap, and crossbeam handles the wake-broadcast.

### Late entrants

A thread that calls `typed_recv` AFTER shutdown fires sees the channel already Disconnected → `select!` returns the shutdown branch immediately without parking. No race window — no way to "sneak past" shutdown.

### The implied shadow channel

Every `recv` exposed from the substrate has the shutdown channel implicitly multiplexed via `typed_recv`'s Rust impl. There is no API to opt out — `:wat::kernel::recv-without-shutdown` doesn't exist. **You cannot call recv without observing shutdown.** Forgetting is structurally impossible because the alternative doesn't exist.

The discipline is imposed at the substrate's primitive surface (per `feedback_substrate_owns_not_callers_match`), not at user wat sites. User services don't need to be shutdown-aware. They ARE shutdown-aware because the only channels they can recv from go through the multiplex.

### The principle in one line

**We don't write fan-out logic. We piggyback on crossbeam's Sender::Drop disconnect-broadcast, which is documented invariant of crossbeam-channel.** The substrate's role: ensure the Sender actually drops (worker thread does this in normal context after the signal handler wakes it via the wake-pipe).

---
