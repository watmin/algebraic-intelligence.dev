---
title: "2026-05-13 — Networked programs ride the same substrate"
sidebar:
  order: 22
---

Mid-Slice-A-spawn the user articulated the architectural question downstream of all this work:

> *"we are laying the foundations for networked programs?... client and server disconnect ride the same substrate now?... we shouldn't panic on peers going away, but when threads or processes die the panic is warranted"*

Yes. The shutdown-aware-channels foundation we're laying (Slice A in flight) is what the wat network sits on. The doctrine distinguishes events at the right boundaries:

| Event | Surface | Wat-level | Panic? |
|---|---|---|---|
| Graceful close / peer left / network disconnect | recv → `Disconnected` | `Ok(None)` | No |
| Local thread crashed | `Thread/join-result` | `Err(ThreadDiedError::Panicked)` | Yes |
| Process shutting down | recv → `Shutdown` | `Err(ThreadDiedError::Shutdown)` | Yes |
| EDN parse failure (tier 2+) | recv → `DecodeError` | RuntimeError → thread death | Yes |

The distinguishing principle the user named: **whose universe is the partner in.** Same universe (local thread/process) → death is contract violation → panic. Different universe (remote node) → death is normal lifecycle → handle as Disconnected, take next request.

Networked programs (tier 3 future) get this for free. No new primitives. The same Disconnected/Shutdown variants with the same wat-level Result discipline.

**Full inscription** lives in `~/work/holon/scratch/WAT-NETWORK.md` § "2026-05-13 — Disconnect / panic discipline" — that's the wat-network meta-vision document; arc 170 is the substrate work that loads its foundation. Both files cross-reference each other.

The wat-network primitives (mTLS, content-addressed programs, signed eval) can be designed honestly **on top of** this layer, because the layer below already handles "peer went away, why doesn't matter" without poisoning local state.

---

## Cross-references

- `docs/INTENTIONS.md` — the soul; read first by any fresh agent
- `docs/COMPACTION-AMNESIA-RECOVERY.md` — the protocol that this file participates in
- `docs/SUBSTRATE-AS-TEACHER.md` — the discipline that makes the grind teach instead of frustrate
- Arc 170 SCORE docs — the per-iteration record of what shipped and what surfaced

---
