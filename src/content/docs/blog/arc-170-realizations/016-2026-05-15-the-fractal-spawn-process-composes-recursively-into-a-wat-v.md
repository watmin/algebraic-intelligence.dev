---
title: "2026-05-15 — The fractal: spawn-process composes recursively into a wat-vm tree"
sidebar:
  order: 16
---

User progression (sequential questions during Stone C in-flight, with the architecture clarifying with each one):

**Q1:** *"the dup action... what does it do?"*
→ Explained dup2 mechanically + the client/server pipe topology (3 pipes, dup2 in child to point fd 0/1/2 at the right pipe ends).

**Q2:** *"how does this break proper stdin... if we had something like `echo 'some-edn-str' | wat some.wat` where some.wat forks a few 'server' processes - the 'real' stdin the wat binary has is still the OS input?"*
→ Confirmed: dup2 only affects the CHILD's fd table. wat-cli's "real" stdin (the shell pipe) is unchanged. The spawned server has its OWN private pipes. Two completely separate stdio domains.

**Q3:** *"so... every 'server' process is provisioned dedicated pipes and the client can interface with them via these dedicated pipes?"*
→ Yes — that's the contract. Each spawn-process call provisions 3 dedicated pipes for that specific server. Client (parent) holds parent-side ends; server (child) sees them as fd 0/1/2 via dup2. Two servers can't see each other's pipes; each is isolated.

**Q4:** *"so.. a server could spawn its own server?.. and it'd just work?.."*
→ **YES. The architecture is fractal.**

### The recognition

Each spawn-process call produces a wat-vm process that is INTERCHANGEABLE with the wat-cli main: same bootstrap, same services trio, same stdio domain shape. From inside the spawned wat-vm's `:user::main`, it's just a wat-vm process running. It can itself spawn-process, recursing arbitrarily deep.

```
                  shell (echo "..." | wat l1.wat)
                       │
                       ▼
                  L1  (wat-vm, server)  ←── client of shell
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
       L2a         L2b         L2c   (each a wat-vm, each a server to L1)
        │                       │
   ┌────┴────┐              ┌───┴───┐
   ▼         ▼              ▼       ▼
   L3a       L3b           L3c     L3d   (each a wat-vm, each a server to its parent)
```

**Properties that fall out:**

- **Identical code at any level** — spawn-process is uniform; L1 and L3 look the same internally
- **Lifecycle cascades** — each child is its own pgrp (arc 106); parent exit/signals propagate down
- **Backpressure cascades** — pipes block when full; rate-limit propagates up the tree naturally
- **Crash isolation** — L3 panicking emits structured EDN to L2 (its parent); L2 chooses to crash or recover; crashes don't propagate unless parent chooses
- **No cross-talk** — L2a and L2b can't see each other's pipes; L3a (under L2a) can't reach L2b; process-tree isolation is structural
- **Each subtree is a wat-network in miniature** — same shape works locally as scales out to tier-3 (remote spawns over sockets) per TIERS.md uniformity claim

### Why this is what RUNTIME-BOOTSTRAP-BACKLOG is paying for

The substrate's invariant after Stones A + C land: *any wat-vm process has services + stdio.* Spawning recursively just produces more wat-vm processes, each inheriting the same invariant. Once a single wat-vm works correctly, N of them composed in a tree work correctly.

The "mini-AWS on a laptop" framing the user articulated months ago becomes structurally inevitable when spawn-process composes this cleanly. Same client/server pattern at every level of the tree. Same Sender<T>/Receiver<T> wat-level wrapper API regardless of tier (local thread, local process, remote-process-over-socket).

**User direction 2026-05-15:** *"we're proving this shortly - make notes in 170 so we don't forget."*

Stone C (in flight at this commit) is the load-bearing step. Once it lands clean: a wat program can spawn another wat program, treat it as a server, exchange EDN-typed requests/replies over private stdio pipes, recurse arbitrarily. The architectural fractal becomes empirically demonstrable.

### What we're proving shortly

Likely shape of the proof: a wat program that spawn-processes 2-3 servers; each server in turn spawn-processes its own sub-server; the L1 wat-cli reads shell stdin, fans the request through the tree, collects replies. Pure stdio at every edge. Each level a wat-vm running the canonical Server/Client pattern. EDN round-trips across the OS-process boundaries via the wat-level Sender/Receiver wrappers.

The proof closes the architectural loop: spawn-process isn't just a primitive; it's THE primitive that lets one wat-vm become a tree of wat-vms.

---
