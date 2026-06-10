---
title: "2026-05-17 — Stone C2's deliberate shortcut surfaces; Stone C3 opens to fix it"
sidebar:
  order: 45
---

**User's framing 2026-05-17, mid arc 203 slice 2 sonnet spawn:** *"why is a process using a crossbeam with stdio exist?... is this honest?"*

The trigger: sonnet's transcript revealed it was about to model `:counter::Client`'s channel fields after ProcessPeer's pattern, which declares its `rx` + `tx` fields as `:rust::crossbeam_channel::Receiver<I>` + `:rust::crossbeam_channel::Sender<O>` (src/types.rs:1003-1066) — DESPITE the comment at lines 1020-1027 saying the underlying transport is PipeFd-backed via `Sender/from-pipe` / `Receiver/from-pipe` over `Process/stdin` + `Process/stdout`.

### The substrate-as-author confession

The comment at src/types.rs:1040-1045 acknowledges the shortcut explicitly:

> *"The Receiver<I> / Sender<O> field types are deliberately the SAME typed-channel substrate ThreadPeer uses — `typed_recv` / `typed_send` are transport-polymorphic (Crossbeam tier-1 for threads, PipeFd tier-2 for processes), so the Process/readln + Process/println eval handlers can mirror Thread/readln + Thread/println verbatim modulo the struct tag."*

The Stone C2 author named the type after the THREAD-TIER backing crate so both Process verbs and Thread verbs could share dispatch logic. The RUNTIME is transport-polymorphic (Value wrapper branches at recv/send time). But the TYPE-KEYWORD at the user level lies — a Process's "Sender" is NOT a `crossbeam_channel::Sender`; it's an OS-pipe-backed typed-channel abstraction.

### Four questions (atomic per `feedback_four_questions_yes_no`)

User: *"the dishonesty is offensive."* Compass run on three paths (A=fix substrate first; B=continue, fix later; C=continue + maybe-fix-if-trip):

- **Path A (fix substrate first):** Obvious YES (foundation-first matches arc 117/126/198 precedent); Simple YES (N uniform renames per `feedback_simple_is_uniform_composition`); Honest YES (names what the abstraction IS); Good UX YES (no more "why does Process have crossbeam" confusion). **YES YES YES YES.**
- **Path B (defer):** Obvious NO (substrate-level lie remains visible regardless of consumer cleanliness); Simple NO (deferral pattern accumulates cognitive debt; `feedback_no_known_defect_left_unfixed` rejects). DISQUALIFIED.
- **Path C (surface-then-defer):** Same disqualification as B with extra rationalization.

### What this becomes — Stone C3 (not arc 204)

Orchestrator's initial reflex: open arc 204. User correction 2026-05-17: *"this is not a new arc - we introduced a defect in the current arc - we fix what we break when we break it - new set of slices in the current arc."* Per `feedback_stay_in_arc_until_inscribed`: arc 170 is still open; the defect originated in Stone C2; the fix lives in arc 170 as a new stone.

**Stone C3 opened** in `BRACKET-IMPLEMENTATION-STONES.md`:
- Rename `:rust::crossbeam_channel::Receiver/Sender` → `:wat::kernel::Receiver/Sender` in ThreadPeer + ProcessPeer field declarations
- Update `Sender/from-pipe` + `Receiver/from-pipe` return type registrations
- Sweep consumers that explicitly reference the dishonest names in type-annotation positions
- Aliases (per arc 109 K-channel rename, src/check.rs:3056-3057) unify the names at the type-system level, so behavior is unchanged; lie is removed

Blocks arc 203 slice 3 (ServiceWithProvisioning) — slice 3's multi-user consumer would inherit the lie if substrate weren't fixed first.

### The architectural lesson (worth carrying forward)

The "share dispatch logic by sharing the type-keyword" shortcut Stone C2 took was the wrong abstraction boundary. The dispatch logic is shared via runtime polymorphism (`typed_recv` branches on the Value variant); the TYPE-KEYWORD should name the ABSTRACTION (typed-channel), not the implementation crate (crossbeam happens to back one tier).

Future substrate primitives that share runtime polymorphism across multiple transports should name the type after the abstraction, not after any single transport's backing implementation. The rule generalizes: **type names describe what the value IS at the substrate-API level; runtime polymorphism is an implementation concern, not a naming concern.**

This is `feedback_attack_foundation_cracks` + `feedback_any_defect_catastrophic` in operation: substrate trust is binary, >0 defects = 0 trust, immediate pivot when a defect surfaces — even when no current consumer trips on it (slice 2 ships clean via ThreadPeer composition; the defect remains visible at the substrate's documented surface).

### Cross-references

- `BRACKET-IMPLEMENTATION-STONES.md` § Stone C3 — the open work
- `src/types.rs:1003-1066` — the defect site (ProcessPeer field declarations)
- `src/types.rs:1040-1045` — the author's confession comment
- `src/check.rs:3056-3057` + `492-493` — arc 109 K-channel rename that already established `:wat::kernel::Sender/Receiver` aliases
- arc 203 slice 2 SCORE Honest Delta 3 — the consumer-side dodge (ThreadPeer composition) that sidestepped the defect at slice 2
- `feedback_attack_foundation_cracks` + `feedback_any_defect_catastrophic` + `feedback_no_known_defect_left_unfixed` — the doctrine chain that gates this pivot
- `feedback_stay_in_arc_until_inscribed` — why this is Stone C3 in arc 170, not a new arc

---
