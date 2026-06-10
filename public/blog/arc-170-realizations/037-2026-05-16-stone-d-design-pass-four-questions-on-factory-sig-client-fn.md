## 2026-05-16 — Stone D design pass: four-questions on factory sig + client-fn sig + decomposition

Stone C2 shipped at commit `e4b9461`. Pivot to Stone D — `:wat::kernel::run-threads` bracket macro. The macro shape was settled in earlier design (variadic defmacro, Option A confirmed at INTERSTITIAL § 2026-05-16 design phase complete). Three implementation-level questions surfaced before drafting the BRIEF.

### Q1 — Factory signature

Each factory is the per-thread main-fn the bracket spawns. Two candidates:

**(A) `:Fn(ThreadPeer<I, O>) -> :nil`** — peer is what every other surface uses
- Obvious: YES — peer is the surface everywhere else (verbs, client, USER-GUIDE)
- Simple: YES — one concept; macro adapts to spawn-thread under the hood
- Honest: YES — factory writes the same shape as the rest of the system
- Good UX: YES — user thinks in peers, not raw channels
→ YES YES YES YES.

**(B) `:Fn(:Receiver<I>, :Sender<O>) -> :nil`** — matches spawn-thread directly
- Obvious: NO — spawn-thread transport detail leaks while user wraps it everywhere else
- Honest: NO — exposes raw channels in the factory signature
→ Disqualified.

**Q1 winner: (A).** Macro injects `(fn [rx, tx] (factory (ThreadPeer/new rx tx)))` adapter.

### Q2 — Client-fn signature for multi-factory

With N factories of heterogeneous types `ThreadPeer<R₁,Q₁>...ThreadPeer<Rₙ,Qₙ>`:

**(A) Variadic positional `(client-fn peer₁ peer₂ ... peerₙ)`**
- Obvious: YES — Lisp-natural fn call; matches `(map spawn ...)` INTERSTITIAL pseudocode
- Simple: YES — no Tuple wrapper concept to learn/destructure
- Honest: YES — each peer has concrete `ThreadPeer<Iₖ,Oₖ>` type post-expansion
- Good UX: YES — lambda args read directly
→ YES YES YES YES.

**(B) Single Tuple arg `(client-fn (Tuple peer₁ ... peerₙ))`**
- Simple: NO — destructure step at every call site
- Good UX: NO — extra wrapper user must unwrap
→ Disqualified.

**Q2 winner: (A).**

### Q3 — Decomposition

Stone C calibration: bounded stones win. Stone D ships three concerns (single-factory mechanics, heterogeneous expansion, panic cascade) that can stand alone.

**(Decompose) D1 + D2 + D3**
- Obvious: YES — Stone C lesson directly applicable
- Simple: YES — each stone has one teaching moment
- Honest: YES — admits three distinct concerns; doesn't pretend it's one feature
- Good UX: YES — atomic commits per capability; reviewers see one concern at a time; clean reverts
→ YES YES YES YES.

**(Atomic Stone D)**
- Simple: NO — three concerns muddled; sonnet holds all in context
- Good UX: NO — bigger commit, harder revert
→ Disqualified.

**Q3 winner: Decompose.**

### Resolved direction (A, A, decompose)

Four-questions all-YES on all three decisions. STONES.md updated with D1/D2/D3 subdivision; original monolithic Stone D superseded.

### Target expansion shape for D1 (single-factory)

```scheme
;; caller (D1 scope)
(:wat::kernel::run-threads
  (:wat::core::Tuple factory)
  client-fn)

;; macro expands to (approximately):
(:wat::core::let
  [thread       (:wat::kernel::spawn-thread
                  (:wat::core::fn
                    [server-rx <- :rust::crossbeam_channel::Receiver<I>
                     server-tx <- :rust::crossbeam_channel::Sender<O>]
                    -> :wat::core::nil
                    (factory (:wat::kernel::ThreadPeer/new server-rx server-tx))))
   client-peer  (:wat::kernel::ThreadPeer/new
                  (:wat::kernel::Thread/output thread)
                  (:wat::kernel::Thread/input  thread))
   result       (client-fn client-peer)
   _drained     (:wat::kernel::Thread/drain-and-join thread)]
  result)
```

No new substrate types (server peer + client peer are both `ThreadPeer<I, O>` with mirror type-param binding per Stone C1 design — auto-generated `ThreadPeer/new` does the construction). No new substrate verbs. Pure wat-level macro composition over existing primitives.

### D1/D2/D3 dependency chain

- D1 depends on Stone A (drain-and-join) + Stone C1 (ThreadPeer) — both shipped
- D2 depends on D1 (macro skeleton settled)
- D3 depends on D1 + D2 (panic cascade extends the working bracket)
- Stone E (`run-processes`) decomposes per same pattern (E1/E2/E3) when D family settles; Stone E mirrors D atop ProcessPeer (Stone C2 shipped)

### Status

Design pass complete. BRIEF-STONE-D1.md drafted next; sonnet dispatched in background.

---
