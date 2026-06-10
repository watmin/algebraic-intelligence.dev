## 2026-05-16 (Stone C revision) — Q2 settled-revised: ONE `ThreadPeer<I, O>` type with type-param swap (not Client/Server pair)

**Forward-correcting a prior design decision** per `feedback_inscription_immutable` — past INTERSTITIAL entries called for two distinct types (`Thread/Client<I, O>` + `Thread/Server<I, O>`) generated from one logical `Thread<I, O>` declaration. That was the answer that "fell out" of the design conversation; user surfaced 2026-05-16 (post-arc-198 closure) that the simpler answer was sitting right there.

### User's question

*"why isn't it just a (:wat::kernel::Thread/println peer data) and (:wat::kernel::Thread/readln peer)... the server-ness and client-ness isn't relevant?... we need a new type who holds the appropriate ends of the pipe pair?.. client = (rx, tx), server = (tx, rx)... a ThreadPeer?... we provision the pipes and then assign the appropriate pipes positions to the peer instance?.. making a thread needs two peer instances who cross communicate?..."*

The answer: yes. The Client/Server role is CONCEPTUAL — the structure is identical on both sides (a pipe pair with a write end + a read end). The "side" is encoded by which type-parameter binding each peer instance gets.

### The settled-revised type

```scheme
:wat::kernel::ThreadPeer<I, O>
;;   I = "what I read (input to this peer)"
;;   O = "what I write (output from this peer)"

;; ONE verb family, peer-relative:
(:wat::kernel::Thread/readln peer)       -> :I
(:wat::kernel::Thread/println peer data) -> :wat::core::nil   ;; data : O
```

For a Request/Reply protocol:
- Server peer: `ThreadPeer<Request, Reply>` — reads Request, writes Reply
- Client peer: `ThreadPeer<Reply, Request>` — reads Reply, writes Request

**Both peers are instances of the SAME struct with mirror type-parameter bindings.** The substrate bracket wires two pipes, constructs both peer instances with the appropriate type params, hands each to its respective fn.

### Four questions (corrected)

| | Two distinct types (Client/Server) | **Single ThreadPeer with swap** |
|--|--|--|
| Obvious | Marginal — explicit roles, but ceremony | YES — peer is peer; side is param swap |
| Simple | NO — two generators per declaration; two verb families | YES — one struct; one verb family |
| Honest | Marginal — naming difference; structure identical | YES — names the structure (pipe pair); roles are conceptual |
| Good UX | Marginal — verbose | YES — fewer concepts to learn; same verbs on both sides |

**Single type wins YES YES YES YES.** Previous Client/Server framing failed on simple — substrate would have minted two type-generators per logical declaration, two verb families per type, more surface area for users to learn. The single-type-with-swap is the correct shape.

### Process side — partial asymmetry stays

Process server has ambient stdin/stdout (one stdio per OS process). So:

- `:wat::kernel::ProcessPeer<I, O>` — client-side wrapper around `(Process/stdin, Process/stdout)`
- Process server uses ambient `(readln)` / `(println)` — no peer struct needed
- ONE ProcessPeer type, only instantiated on the parent (client) side

Thread is symmetric (two peers cross-wired); Process is asymmetric (client gets a peer; server uses ambient). The asymmetry is honest — it reflects the substrate primitive difference (Thread channels vs OS process stdio).

### Stone C scope shrinks

Per the prior STONES.md draft: "120-180 min sonnet; type-system work is fiddly."

Post-revision:
- ONE `ThreadPeer<I, O>` substrate type + 2 verbs
- ONE `ProcessPeer<I, O>` substrate type + 2 verbs (mirror)
- Bracket setup mechanics (substrate-internal pipe wiring + peer construction)
- Tests for both type minting + verb dispatch

~60-90 min total. Decomposable into C1 (Thread family) + C2 (Process family) per the arc 198 slice 2 lesson: small bounded stones beat one-shot multi-piece changes.

### Status

**Design correction committed.** STONES.md updated with the revised Stone C scope. Future-me reads this section and knows: one peer type per unit, mirror type-param bindings encode side, ambient-stdio asymmetry on Process is real.

---
