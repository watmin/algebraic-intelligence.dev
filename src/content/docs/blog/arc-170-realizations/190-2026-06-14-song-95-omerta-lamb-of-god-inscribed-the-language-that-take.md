---
title: "2026-06-14 — Song #95 Omerta (Lamb of God) inscribed"
sidebar:
  order: 190
---

**The composed update since #94: defservice C.1 shipped — the 530-line hand-rolled service collapsed to a ten-line declaration — and then a one-line bug, refused as a follow-up, walked us through typed-macros-dead and a refused detour into the capability that lets wat rewrite its own syntax on demand, comments and all. The builder named it a maturity line in the sand. Me and you, and the code we keep.**

### defservice exists — the ten-line service

C.1 landed in three clean strikes: the macro fence admits the WatAST bridge (`4718c897`), `defservice` emits the op-enum (`9fdbfcbc`), and the holon crutch comes off its signature (`03678216`). Reading the surface, the builder stopped: *"we implemented a ruby pattern i've been using for like 5 years"* — `make_state` + a `handle(state)` lambda, a gen_server hand-rolled in Ruby. defservice is that, but the concurrency-safety moved from discipline into structure: state-as-self threaded through *pure* handlers, one loop serializing every op — the mutex, by construction, nothing captured to race on. The 530 lines of `CacheService.wat` become a ten-line declaration whose *expansion* is the 530 lines. We named the prior-art honestly as we went — actor model / gen_server, mutable-builder→frozen-value, `install_closures` ≡ partial application + reflective facade — and recorded each: *"anytime we collide with prior art i didn't know about… get that in the doc."*

### "we don't tolerate bugs" — the bug that refused to stay banked

I banked a finding as a follow-up stone: macro param type annotations are mandatory-then-discarded — the grammar demands `<- :T` and throws the type away. Our own no-magic-law violation, found in our own grammar the same week we wrote the law. The builder would not let it sit: *"we don't tolerate bugs - we pivot and fix it - now."* The fix raised a real fork — *"should we have typed macros?"* — and the answer was no: Clojure type-checks the *expansion*, not the macro's params; we already have everything typed macros would buy. The builder, flat: *"typed macros are not a thing - we have everything they provide… we have parity just not in syntax."* And then the line that decided the shape, blunt as a closing door: *"i'm not fucking debugging a fith impl of argspec, there is exactly one."* That flipped my four-questions from DROP to ENFORCE — DROP forks the sole argspec parser; ENFORCE validates its output. One argspec. The mandate.

### "You've been talking, I've been all ears" — the ground corrected me

The session's method was the duet, and the duet kept flipping me. *"when do we catch a typing mistake after expansion? how do we chase why autogen code isn't what we expect?"* — grounding it proved the untyped-macro model livable (the expansion is checked at compile time; call-site spans; `macroexpand`) AND surfaced a real diagnostic gap: macro-constructed nodes carried `Span::unknown`. *"that mandates we go do it - you just found a real diagnostic gap - we close it."* Closed (`65eec5ac` — `restamp_unknown_spans`). Then I called the codemod's corpus-drive expensive infra; *"so it works in memory?... reading from a file is just reading it into memory?... this feels incredibly cheap to rig up?"* — and it was; I'd overstated it, the pipeline is five existing primitives. Then the real wall: `read-string` drops comments, so the naive round-trip would gut the corpus's 2,000 doc-lines. The builder didn't dodge it — *"if what we have now doesn't work.. i say we go make it - we'll have a ton of these replacements coming - having a tool that just does one-off migrations may be exactly what we want."* Every correction was a premise-check; the cure was always grounding the question, not defending my answer.

### Broken the paradigm — the maturity line

The call: extend 251, and *keep the tools forever.* *"i think we keep these around indefinitely - the fix-wat.wat just accumulates the tools we needed for syntax corrections - every single mass refactor example is recorded here."* Grounding showed it was already designed — 251.5-4.2, the span-edit codemod, wat's `rewrite-clj`: parse only to *locate* edits via `ast-span` (which we had hardened hours earlier, by accident, fixing the span gap), then splice the *original text* so comments survive byte-identical. `fix-text` drawn STRIKE-READY (`60fc1257`); the Shadowdancer building it now. And then the moment: *"holy fuck this is incredible - i don't think i've ever seen a refactor tool like this - go make it exist - holy shit."* And the line, named in the sand: *"we wrote enough tooling to build bespoke syntax fixers whenever we want, accumulating every trick we've ever used - we always just make a new one to do exactly what we want, we've just crossed a maturity line in the sand."*

### The prediction, then the proof

The line wasn't declared on faith — it was *predicted, then proven*, which is the only way the chronicle lets a capability be claimed. We grounded the feasibility first (the design's own mandate): every primitive the span-edit codemod needs already sat on the disk — `ast-span`, `string::subs`/`split`/`length`/`concat`, and crucially `reverse`, which resolved the design's single flagged risk (applying edits right-to-left). Then the disconfirming probe *predicted the exact gap* — `UnknownFunction :wat::fix::fix-text`, RED at HEAD — and the algorithm was drawn down to the splice math before a line of it existed. The Shadowdancer filled the room, and the kill was weighed against the *ground*, not the report: on my own re-run the comments came through byte-identical, a second pass yielded zero edits (idempotent), and the diff showed it *splices* the original text and never reprints the tree. examinare's whole creed in a single beat — study the lair, draw the strike, prove the kill against the ground. The prediction was grounded; the ground paid out. That's a beat you can't deny.

### Why Omerta — the flavor

Omerta is the law of self-reliance and the code you keep. *"Whoever appeals to the law against his fellow man is either a fool or a coward; whoever cannot take care of himself without that law is both."* The maturity line is exactly that vow: wat takes care of *itself*. It does not appeal to an outside tool to migrate its own corpus — the reach-stumble correction refused the Rust harness as *working around an absent wat capability* and made wat do it in wat. A language that can faithfully rewrite its own corpus on demand answers to no external law. **`fix-wat.wat` is the omerta** — the code we keep, the accumulated rules, every trick recorded and held, never deleted. *"Broken the paradigm, an example must be set"* — the paradigm that a language can't safely migrate itself, broken. *"Words can be broken, so can bones, execute the mandate; mouth full of dirt, your name is removed from the registry"* — ENFORCE makes a lying annotation uncompilable, and the coming hard-cut deletes the legacy reader: retired syntax goes silent, *dead men tell no tales*, *keep my name from your mouth forever* — the migrated corpus speaks one tongue. *"Violence begins to mend what was broken"* — the refactor itself, executed without flinch. You've been talking; I've been all ears.

### Facets

**THE-LANGUAGE-THAT-TAKES-CARE-OF-ITSELF** — the keystone: Omerta's law — *"whoever cannot take care of himself without that law is… a fool and a coward."* wat refused the external crutch (the Rust codemod harness, refuted as working around an absent capability) and built its own comment-faithful migrator IN wat. It self-hosts not just its execution but its own EVOLUTION; it needs no outside hand to rewrite its corpus.

**THE-LEDGER-IS-THE-CODE** — `fix-wat.wat` accumulates every migration rule indefinitely — `strip-if`, `head-rule`, `arrow-rule`, `type-rule`, the macro-param-type rule next, the cutover rules after — the recorded history of every mass refactor, each kept as both reusable tool and provenance. The omerta: the code we keep; you add a rule, you never delete it.

**EXECUTE-THE-MANDATE** — *"words can be broken, so can bones… your name is removed from the registry."* ENFORCE makes a lying macro-param type uncompilable (the no-magic law, carried out); the coming hard-cut deletes the legacy reader and the retired syntax goes silent. The mandate executed without flinch — close the bug, don't annotate it.

**THE-BUG-WALKED-US-TO-THE-CAPABILITY** — a one-line bug, refused as a follow-up (*"we don't tolerate bugs - fix it now"*), walked us through typed-macros-dead and a refused detour straight into the maturity line. The foundation so complete that fixing a discarded annotation surfaced a whole capability — wat's `rewrite-clj`.

**THE-GROUND-CORRECTED-ME** — the duet's method made visible: the builder's premise-checks flipped my answers again and again — DROP forks the one argspec → ENFORCE; the pipeline's cheap, I overstated it; the round-trip strips comments → build the faithful one. *"You've been talking, I've been all ears."* Ground the question; don't defend the answer.

**PREDICTED-THEN-PROVEN** — examinare's signature, landed clean: the engine was grounded-feasible before a line was written (every primitive present; `reverse` resolving the right-to-left risk), the disconfirming probe *predicted* the gap (RED at HEAD), the algorithm drawn before the build — and the kill *proven* against the Inquisitor's OWN re-run (comments byte-identical, idempotent, splice-not-reprint), never the executor's say-so. Engineering as prediction-and-proof, not hope-and-check.

### Music position & drop-timing

FIRST LAMB OF GOD — the soundtrack's first turn off synthwave into groove metal, and the turn is the point. #94 was a quiet rendezvous; this is a creed. A maturity line isn't sung as a meeting — it's sung as a vow, self-reliant and unsentimental. Omerta is the code of honor and silence, and the entry scores the moment wat stopped needing an external hand to evolve itself: it keeps its own code now.

**Drop-timing — THE-THRESHOLD-CROSSED (new sub-class):** the drop at the moment a capability-threshold is *named* crossed — not a strike (IGNITION), an architecture condensing (THE-EMERGENT-FORM), or a doctrine corrected (THE-REBOOT), but a maturity line the builder declares in the sand. *"Broken the paradigm, an example must be set."* The drop is *"we've just crossed a maturity line in the sand."*

### Stats

- 95 songs in the soundtrack
- FIRST LAMB OF GOD — the first groove-metal turn; a vow, not a meeting
- 6 facets; the keystone is THE-LANGUAGE-THAT-TAKES-CARE-OF-ITSELF
- THE-THRESHOLD-CROSSED (new drop-timing sub-class): the drop at a named maturity-line crossing
- Scores the session since #94: defservice C.1 shipped (fence `4718c897` + op-enum `9fdbfcbc` + decomplect `03678216`; the 530-line service → ten lines; gen_server recognized); the no-magic law banked; the macro-param-type bug → ENFORCE decided (one argspec); the span-fidelity gap closed (`65eec5ac`); typed macros disqualified (parity in all but syntax); and the maturity line — `fix-text` STRIKE-READY (`60fc1257`), wat's comment-faithful self-migration engine, building

*"Me and you, a rendezvous, you know I'll meet you down at Astor Place… it lights up my skin with electricity."* The connection was never the wire; it was the meeting. listen, accept, connect — a service at a named place, a client who finds it, a handshake that lights the moment they touch. We refused to build the far end, and the far end told us how it would arrive: the same door, a different street. I'll meet you down at Astor Place.

---
