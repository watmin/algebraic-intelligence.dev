---
title: "R33 — the drill was the wrong tool, and the right one DELETES: the polymorphism was alre…"
sidebar:
  order: 33
---

> **Song (arc 278 R33 — the steel brought to life) — *Deadly Sinners* (3 Inches of Blood) — the warrior-metal
> triumph register: bring the steel to life, victory, "enemies of metal, your death is our reward"; handed by the
> builder the moment a thing we'd fought three gaps to build turned out to be deletable — the correct mechanism's
> reward is annihilation —**
> THE-DRILL-WAS-THE-WRONG-TOOL-EXTEND-TYPE-PER-PEER-FIGHTING-THE-GRAIN-AT-EVERY-LAYER-PARSE-FLOOR-EDGE-RUNTIME /
> THE-POLYMORPHISM-WAS-ALREADY-HANDLED-SEND-AND-RECV-OVER-ANY-PEER-THE-BUILDER-SAW-IT-THAT-IS-OUR-POLYMORPHIC-PART /
> BRING-THE-STEEL-TO-LIFE-THE-SURFACE-DISPATCHES-INTRINSIC-COMPOSE-THE-GENERIC-OPS-WITH-THE-SYNTHESIZED-PROTOCOL /
> ENEMIES-OF-METAL-YOUR-DEATH-IS-OUR-REWARD-THE-EXTEND-TYPE-THE-CALLS-CLAUSE-THE-SCAFFOLD-ANNIHILATED /
> A-SURFACE-AND-A-COORDINATE-NOTHING-ELSE-THE-CONSUMER-DIALS-AND-CALLS-NO-CALLS-NO-EXTEND-TYPE-IT-ROUND-TRIPPED /
> TRIUMPHANT-VICTORY-COMPOSING-WHAT-ALREADY-IS-WE-DELETE-WHAT-WE-BUILT-TO-FAKE-IT-ANNIHILATION-IS-THE-JOY /
> COMPONENDO DELEO
>
> *"Flash of iron, leather, spikes, and swords; mighty warriors with metal on their side. Enemies of metal, your*
> *death is our reward — triumphant victory when you bring the steel to life. … Ruling the night, winning the fight,*
> *taking it all."*

> **The realization quotes (the builder's, this session — verbatim):**
> *"so… `:wat::kernel::Peer'` is an abstraction over all peers?… that's our polymorphic part already handled?"*
> *"i just shouted 'wow!' … make it unnecessary … that's fucking wild … let's try it."*
> *"annihilation is our greatest joy… one more thing to remove."*
> *"i just shouted 'holy shit!'"*

### How we reached it — three gaps deep with the wrong tool, then the builder named the right one

The peer-as-satisfier became a **three-gap drill**, each layer of the substrate fighting us: S3a (the parametric
`extend-type` self), S3-Nature-2 (the `:Peer` nature + floor), S3-Nature-3 (the full-args subtype edge), and a 4th
looming (runtime dispatch + a head-only-key collision, fighting *type erasure*). Every gap was the same shape — a
head-vs-full-args key mismatch — because we were making a **dialed peer satisfy a surface via an `extend-type`**, and
`extend-type` is the mechanism for **polymorphic** satisfaction (many types, each a different impl, keyed by type). A
`:nature :Peer` surface is not that. Then the builder cut through it with one question: ***"`Peer'` is an abstraction
over all peers — that's our polymorphic part already handled?"*** Yes. `send'`/`recv'` are already polymorphic over any
`Peer'<S,R>` — the "how to talk to a peer" is a solved substrate primitive. We had been *re-implementing that
polymorphism per peer-type*, which is why it fought the grain at every layer. **Path B** followed: a `:nature :Peer`
surface's dispatch is a **composition** — the generic `send'`/`recv'` + the surface's S1-synthesized `Op`/`Reply` — no
`extend-type`, no per-type key, no type erasure. It landed (the peer round-tripped, no `extend-type`). And then the
consequence that made him shout: if the client-forms are *intrinsic*, **`:calls` is unnecessary** — a consumer given a
Store's *coordinate* dials it and calls the surface method on the peer, no `:calls`, no `extend-type`. We built the
probe. It round-tripped: *"consumer forwarded to kv (no :calls), ok = true."*

### What it is — the correct mechanism composes what already exists, and thereby DELETES what you built to fake it

The realization has three faces, one blade:

- **The polymorphism was already handled.** `send'`/`recv'` work on *any* `Peer'<S,R>` — the substrate already knows how
  to talk to a peer. What is surface-specific is only *which* `Op` to send and *which* `Reply` to match, and S1 already
  synthesizes those. So the peer-dispatch is nothing new; it is `send'`/`recv'` (generic) composed with `Op`/`Reply`
  (the surface's). We spent three gaps re-building a wheel the substrate already turned.
- **The wrong tool fights the grain at every layer — and that fight is the signal.** `extend-type` per-peer-type made a
  head-vs-full-args key mismatch appear at parse, floor, edge, and runtime — four times, the same shape. That
  repetition was the substrate telling us the tool was wrong (a monomorphic dispatch forced through a polymorphic
  mechanism). The pain located the error; the correct tool made all four gaps *dissolve at once*.
- **The correct mechanism's reward is ANNIHILATION.** Path B did not add machinery — it *removed* it. The `extend-type`
  peer path: gone. `:calls`: unnecessary, deletable, zero consumers. The horizon: once every service satisfies a
  surface, even the per-service client fns (`<fqdn>/<op>`) dissolve the same way — everything called as `:S/<op> peer`.
  *Enemies of metal, your death is our reward.* The scaffolding we built to fake what the substrate already had is the
  enemy; deleting it is the victory. `Componendo deleo` — **by composing what already is, I annihilate what I built to
  fake it.** This is the apex-predator joy the builder names (*"annihilation is our greatest joy, one more thing to
  remove"*) at the mechanism layer: the truest answer is subtractive.

And it is R32 made literal and cheaper than R32 dared say: *a service is a surface at a coordinate* — the consumer needs
**a surface (available) + a coordinate (a pure `Address'` input)** and *nothing else*: no `:calls`, no client
installation, no `extend-type`. The whole circuit builds at boot from those two facts and streams.

### The song, mapped

> ***"Flash of iron, leather, spikes, and swords — mighty warriors with metal on their side"*** — the drill armed with
> the wrong weapon (`extend-type` per peer), striking layer after layer. ***"Bring the steel to life"*** — Path B: the
> surface *comes alive*, dispatching to its coordinate intrinsically (compose `send'`/`recv'` + the protocol); the steel
> (the surface) lives, talks, forwards. ***"Enemies of metal, your death is our reward"*** — the scaffolding is the
> enemy: the `extend-type` peer path, the `:calls` clause; their **death (deletion) is our reward** — annihilation as
> victory. ***"Triumphant victory when you bring the steel to life"*** — the exact coupling: the moment the surface
> dispatches intrinsically, the scaffold falls. ***"Ruling the night, winning the fight, taking it all"*** — the whole
> `:calls` machinery + the extend-type path + (horizon) the per-service client fns, all taken. The 3 Inches of Blood
> warrior-metal register — triumph, steel, annihilation-as-reward — is the honest sound of the correct mechanism
> arriving and *subtracting*.

### The honest register — PROBATVM by demonstration; the annihilation ahead

Kept true. **PROBATVM by demonstration, this session, on the disk:** Path B works (`823b20ac` — the peer-as-satisfier
round-trips, no `extend-type`, weighed by my own re-run, floor byte-identical); and the `:calls`-less consumer
round-trips (`scratchpad/s3-probe-calls-less-consumer.wat` → *"consumer forwarded to kv (no :calls), ok = true"* — a
consumer *given a coordinate* dials and calls, no `:calls`, no `extend-type`). The insight (the polymorphism was
already handled; compose it) is proven by the working mechanism. What is **PROBANDVM:** the **annihilation** itself —
deleting `:calls` from the `defservice` macro (the clause + `callee-cf-calls` + the client-form installation; zero
consumers, so clean); and the horizon (the per-service client fns dissolving at the every-service-satisfies-a-surface
endpoint). The reward is named and the kill is set up; the steel is not yet swung on `:calls`. *Probatum est —
componendo deleo; acies vivit, cetera cadent.*

*Path-of-voices (marked, not flattened): the **load-bearing insight is the builder's** — *"Peer' is an abstraction over
all peers — that's our polymorphic part already handled?"* — HE saw that the polymorphism was already in `send'`/`recv'`,
which is the turn the whole realization rests on; the **annihilation framing is his** (*"annihilation is our greatest
joy, one more thing to remove"*), and the **song is his**. **Path B and the `:calls`-unnecessary consequence are
convergences** — the apparatus proposed Path B (the surface composes the ops) and noticed `:calls` might dissolve; the
builder sharpened Path B with the "already handled" insight and crowned the consequence (*"wow… make it unnecessary…
let's try it"*). The **synthesis is the apparatus's**: the wrong-tool-fights-the-grain reading (the four-layer key
mismatch as the signal), the compose-what's-there-annihilates-the-scaffold doctrine, the R32-made-literal-and-cheaper
placement, and the sigil. Kept honest: PROBATVM is the mechanism + the `:calls`-less consumer (on the disk); the actual
deletion of `:calls` is PROBANDVM — named, not yet done.*

> We drilled three gaps into the substrate making a dialed peer satisfy a surface the way aggregates do — through an
> `extend-type` — and it fought us at every layer with the same key mismatch, because we were forcing a monomorphic
> dispatch through a polymorphic mechanism. Then the builder asked whether `Peer'` wasn't already the abstraction over
> all peers, our polymorphism already handled — and it was: `send'`/`recv'` talk to any peer; the surface only adds
> which message. So the right mechanism was never to build a satisfier — it was to *compose* the two things the
> substrate already had, and the moment we did, the fight ended and the scaffolding became deletable. The
> `extend-type` peer path: gone. `:calls`: unnecessary — a consumer needs only a surface and a coordinate, and it
> round-tripped with neither. That is the deepest joy this project keeps returning to, now at the mechanism layer: the
> truest answer does not add — it composes what is already there, and by composing, annihilates what you built to fake
> it. Bring the steel to life; the enemies of metal fall; their death is our reward.
>
> ***COMPONENDO DELEO.*** *(apparatus-minted — Latin, "by composing, I annihilate": the correct mechanism composes the
> primitives the substrate ALREADY has, and by doing so DELETES the scaffolding built to fake them. The peer-as-satisfier
> was a three-gap drill (S3a parametric extend-type self · S3-Nature-2 the :Peer nature/floor · S3-Nature-3 the full-args
> edge · a 4th looming: runtime dispatch + a head-only-key collision, fighting type erasure) — all the SAME head-vs-full-args
> key mismatch, because a dialed peer was being made to satisfy a surface via EXTEND-TYPE (the POLYMORPHIC-satisfaction
> mechanism — many types, keyed by type). A :nature :Peer surface is not that. The builder's turn: 'Peer' is an
> abstraction over all peers — that's our polymorphic part already handled?' — YES: send'/recv' are ALREADY polymorphic
> over any Peer'<S,R>; the only surface-specific parts are WHICH Op to send / WHICH Reply to match, which S1 synthesizes.
> So Path B (823b20ac): a :nature :Peer surface's dispatch is a COMPOSITION — generic send'/recv' + the surface's Op/Reply
> — no extend-type, no per-type key, no type erasure; all four gaps dissolve at once. And the reward is ANNIHILATION: the
> extend-type peer path gone; :calls UNNECESSARY (a consumer GIVEN a coordinate dials + calls the surface method on the
> peer — no :calls, no extend-type — verified: 'consumer forwarded to kv (no :calls), ok = true'); the horizon: the
> per-service client fns dissolve at the every-service-satisfies-a-surface endpoint. componendo = by composing (gerund abl.
> of compono); deleo = I blot out / annihilate (root of 'delete'). The wrong tool fights the grain at every layer, and that
> fight IS the signal (a monomorphic dispatch forced through a polymorphic mechanism); the correct tool subtracts. R32 (a
> service is a surface at a coordinate) made LITERAL + cheaper: a surface (available) + a coordinate (a pure Address' input)
> and NOTHING else. Scored to 3 Inches of Blood — Deadly Sinners (warrior-metal triumph: 'bring the steel to life' = the
> surface dispatches intrinsically; 'enemies of metal, your death is our reward' = the scaffold deleted; 'taking it all' =
> the whole machinery). Kin: R32 QVANTVMVIS PROCVL IDEM NEXVS (this makes it literal), R2 / EX DISPERSIS INTEGER (the pieces
> were already there — send'/recv' + S1), PRIMVS VSVS ANGVLOS PANDIT (the first consumer walks the corners — here the drill
> located the wrong tool), extirpare (the fight is the system asking for help), the apex-predator 'annihilation is our
> greatest joy' (R16/R30 — here at the mechanism layer). PROBATVM by demonstration — Path B + the :calls-less consumer both
> round-trip on the disk this session; PROBANDVM — the :calls deletion (the annihilation stone) + the per-service-client-fn
> horizon. His (the 'already handled' insight, the annihilation framing, the song, the 'wow'/'holy shit'), Path B + the
> :calls consequence convergences (apparatus proposed, builder crowned), and mine (the wrong-tool-fights-the-grain reading,
> the compose-annihilates doctrine, the sigil) — kept with consent, kept triumphant.)*

```clojure
#wat.chronicle/Sententia
{:sigil    "COMPONENDO DELEO"
 :literal  "by composing, I annihilate"
 :roots    {:componendo "gerund abl. of compono — by putting-together / composing (the generic peer ops + the surface's Op/Reply)"
            :deleo "I blot out / destroy / annihilate — the root of 'delete' (the scaffolding built to fake what the substrate already had)"}
 :rosetta  ; the sigil bridged to six tongues — Latin ours; the five are the bridges
 {:latina   "COMPONENDO DELEO"
  :greek    "συντιθεὶς ἀναιρῶ"                          ; syntitheìs anairô — composing, I abolish/destroy
  :chinese  "以合而毀"                                   ; yǐ hé ér huǐ — by composing, I destroy
  :japanese "合わせて滅す"                               ; awasete messu — combining, I annihilate
  :korean   "조합하여 없앤다"                            ; johaphayeo eopsaenda — by composing, I eliminate
  :russian  "слагая, уничтожаю"}                        ; slagaya, unichtozhayu — composing, I annihilate
 :gloss    "the correct mechanism composes the primitives the substrate ALREADY has, and by doing so DELETES the
            scaffolding built to fake them. the peer-as-satisfier was a 3-gap drill (parametric extend-type self / the
            :Peer nature+floor / the full-args edge / a 4th: runtime dispatch + a head-only-key collision) — all the
            SAME head-vs-full-args mismatch, because a dialed peer was made to satisfy a surface via EXTEND-TYPE (the
            polymorphic-satisfaction mechanism). the builder: 'Peer' is an abstraction over all peers — that's our
            polymorphic part already handled?' — YES: send'/recv' are already polymorphic over any Peer'<S,R>; the
            surface only adds which Op/Reply (S1). Path B: a :nature :Peer dispatch is a COMPOSITION (send'/recv' +
            Op/Reply); all 4 gaps dissolve. reward = ANNIHILATION: the extend-type path gone; :calls unnecessary (a
            consumer given a coordinate dials + calls, no :calls no extend-type — verified). R32 made literal: a
            surface + a coordinate, nothing else."
 :names    "the correct mechanism subtracts — compose what already is, and by composing, annihilate the scaffold"
 :the-three-faces {:already-handled "the polymorphism was ALREADY in send'/recv' (any Peer'<S,R>); we re-built the wheel 3 gaps deep via extend-type"
                   :wrong-tool-fights "extend-type per-peer made the SAME head-vs-full-args key mismatch at parse/floor/edge/runtime — the repetition WAS the signal (monomorphic dispatch forced through a polymorphic mechanism)"
                   :reward-is-annihilation "Path B removed machinery, didn't add it: the extend-type path gone; :calls unnecessary/deletable (0 consumers); horizon — the per-service client fns dissolve at the every-service-satisfies-a-surface endpoint"}
 :verified {:path-b "823b20ac — the peer-as-satisfier round-trips, NO extend-type (own re-run, floor byte-identical)"
            :calls-less "scratchpad/s3-probe-calls-less-consumer.wat → 'consumer forwarded to kv (no :calls), ok = true' — a consumer given a coordinate dials + calls, no :calls, no extend-type"}
 :kin      {:literal "R32 QVANTVMVIS PROCVL IDEM NEXVS — a service is a surface at a coordinate; this makes it literal + cheaper (nothing else needed)"
            :assembly "R2 / EX DISPERSIS INTEGER — the pieces were already there (send'/recv' + S1's Op/Reply); compose, don't build"
            :crucible "PRIMVS VSVS ANGVLOS PANDIT — the first consumer walks the corners; here the drill located the WRONG TOOL"
            :fight-is-signal "extirpare — a failure is the system asking for help; the four-layer fight was the substrate saying 'wrong tool'"
            :joy "R16 / R30 (the apex predator — 'annihilation is our greatest joy'); here at the MECHANISM layer — the truest answer is subtractive"}
 :register :probatum-by-demonstration                  ; Path B + the :calls-less consumer round-trip on the disk; the :calls deletion is PROBANDVM
 :song     "3 Inches of Blood — Deadly Sinners (warrior-metal triumph; bring the steel to life; enemies of metal, your death is our reward; taking it all)"
 :voices   {:his  "the load-bearing insight ('Peer' is an abstraction over all peers — that's our polymorphic part already handled?'); the annihilation framing ('annihilation is our greatest joy, one more thing to remove'); 'wow'/'holy shit'/'let's try it'; the song"
            :convergence "Path B (apparatus proposed: the surface composes the ops) + the :calls-unnecessary consequence (apparatus noticed, builder crowned)"
            :mine "the wrong-tool-fights-the-grain-at-every-layer reading (the 4-layer key mismatch as the signal); the compose-what's-there-annihilates-the-scaffold doctrine; the R32-made-literal-and-cheaper placement; the sigil + six-tongue bridge"}
 :arc      278
 :born     #inst "2026-07-06"}
```

---

### `---` interstitial (curare before compaction — signing off strong) — SVBLATO FVLCRO, STAT OPVS: the scaffold removed, the work stands (2026-07-06, session close; the builder's sign-off — "we need to curare and compact — excellent work")

**What this session closed — the whole services-as-surfaces CLIENT path, end to end, and a feature DELETED.** The
recovery woke clean (278 read whole from the signed channel), then the arc: **S2** (`bada7119`, defservice `:satisfies`
a surface) → the peer-as-satisfier drill — **S3a** (`93e936b3`, a parametric `extend-type` self decomposes to
`Parametric`) → **S3-Nature-1** (`4b9a6d7f`, `Holder`→`Nature` rename, `:holder` hard-retired) → **S3-Nature-2**
(`23e8c16f`, the `:Peer` nature + off-ladder exact-match) → **S3-Nature-3** (`b2deb815`, `assignable` queries the
full-args edge) → **Path B / S3-Nature-4** (`823b20ac`, a `:nature :Peer` surface intrinsically dispatches — composes
`send'`/`recv'` + the surface's `Op`/`Reply`; **Gap B closed**) → **`:calls` ANNIHILATED** (`73e75103`, net −83 lines).
**Two realizations:** R32 `QVANTVMVIS PROCVL, IDEM NEXVS` (a service is a surface at a coordinate) and R33 `COMPONENDO
DELEO` (compose what already is, and by composing, annihilate the scaffold — now PROBATVM: `:calls` deleted, nothing
broke). The honest thread: I asserted `:calls` "zero consumers" and the disk disagreed — the shadowdancer widened the
grep, caught the live use, and we did the total annihilation *right* (behavior coverage kept, the `:calls`-test
annihilated with `:calls`).

```clojure
{:RESUME-HERE
 {:head    "73e75103 — :calls annihilated (COMPONENDO DELEO PROBATVM); this curare interstitial commits on top"
  :branch  "arc-170-gap-j-v5-deadlock-state"
  :arc     "278 THE RETE BUILD, on-ramp = sqlite → telemetry → rete (the CHAOS ENGINE, R25). We are building on 293
            services-as-surfaces to unblock T1b. The CLIENT path is now DONE: a service is a surface at a coordinate."

  :done-this-session
  ["293 S2 (bada7119) — defservice :satisfies a surface (wears S1's synthesized Op/Reply; free coverage via exhaustive match)"
   "293 S3a (93e936b3) — parametric extend-type self → Parametric (general substrate fix)"
   "293 S3-Nature-1 (4b9a6d7f) — Holder → Nature rename (120 files, behavior-preserving); :holder HARD-RETIRED → :nature"
   "293 S3-Nature-2 (23e8c16f) — the :Peer nature (off the rank ladder; exact-match; is_pure=false; :wat::kernel::Peer')"
   "293 S3-Nature-3 (b2deb815) — assignable queries the FULL-args extend-type edge (format_type == the reg key)"
   "293 Path B / S3-Nature-4 (823b20ac) — a :nature :Peer surface INTRINSICALLY dispatches (compose send'/recv' + S1's Op/Reply). GAP B CLOSED."
   ":calls ANNIHILATED (73e75103) — obsoleted by Path B; its lone consumer was its own test (behavior kept, mechanism-test deleted). -83 lines."
   "R32 QVANTVMVIS PROCVL IDEM NEXVS + R33 COMPONENDO DELEO (both in this file; the cond-golden re-bless aadfe91e; R33→PROBATVM at the annihilation)."]

  :where-it-stands
  "THE PEER PATH IS DONE. A service = a surface (:nature :Peer) at a coordinate (a pure Address'). A consumer needs
   ONLY: (1) the surface (available), (2) the coordinate as a pure :init operating-input. It dials (connect') in :init,
   holds the peer in :ephemeral, calls :S/<op> peer — NO :calls, NO extend-type, NO client-form install. VERIFIED:
   scratchpad/s3-probe-calls-less-consumer.wat → 'consumer forwarded to kv (no :calls), ok = true'."

  :next
  ["S4 FIRST (before T1b — GROUNDED CORRECTION 2026-07-06): the REAL stores are NOT on Path B yet. :wat::query::Store
          is :nature :wat::core::Struct (wat/query.wat:102), satisfied via WRAPPER STRUCTS (:wat::query::MemStore /
          SqliteStore extend-type Store, mem.wat:171 / sqlite-store.wat:312) — the exact wrapper Path B eliminated.
          S4 = (a) migrate Store/ReadStore → :nature :Peer + DROP the MemStore/SqliteStore wrapper structs (the dialed
          peer IS the Store, intrinsic dispatch — Path B, 823b20ac); (b) the blind mem↔sqlite differential (R31 →
          PROBATVM); (c) THE ENDPOINT: :satisfies MANDATORY, :ops → :impls (service.wat:152 still allows :ops — ruling A
          NOT built). Path B proved the mechanism only with the :probe::Kv probe; S4 puts the REAL stores on it."
   "T1b — the BLIND SINK, PURE ASSEMBLY ONCE S4 LANDS (else it'd be built on the wrapper pattern we're killing):
          TelemetryService' :ephemeral [store <- Peer'<Store::Op,Store::Reply>], :init (record, store-addr <-
          Address'<Store::Op,Store::Reply>) -> dial; ops call :wat::query::Store/<op> store. Model on
          scratchpad/s3-probe-calls-less-consumer.wat (the proven :nature :Peer shape)."
   "THE per-service-client-fn dissolution (part of the endpoint): once every service :satisfies a :nature :Peer surface,
          the <fqdn>/<op> client fns dissolve the same way :calls did (everything called as :S/<op> peer)."
   "THEN 278 resumes: T1c (Span + with-span) → T2 (rete query engine) → R0 the chaos engine (R25 MACHINA CHAOS DOMAT)."]

  :do-nots
  {:ground        "GROUND every claim against the disk — a 'nothing uses X / zero consumers' claim owes a WHOLE-TREE
                   grep (`grep -rn X --include=*.wat .`), NOT a hand-listed dir subset (I scoped wat/crates/tests/examples,
                   missed wat-tests/, wrongly called :calls zero-consumer; the shadowdancer caught it). AD ORACVLVM on a grep."
   :phantoms      "a rust-analyzer/rustc 'unresolved X / non-exhaustive' cascade on a JUST-EDITED tree is a PHANTOM — it
                   was a stale snapshot THREE times this session; cargo build clean + a suite that RAN N tests compiled ⇒
                   the diagnostics are ghosts. Ground before crying cascade."
   :weigh         "WEIGH every shadowdancer kill by your OWN re-run (never its report): the probe/round-trip, the diff
                   scope, byte-identical floor. A known flake (sigterm_to_cli_cascades) → re-run it ISOLATED --test-threads=1
                   (pass = not a regression), don't panic."
   :background    "to WAIT on a long shell (a floor), use run_in_background:true (harness wakes you) — NEVER a raw `&`
                   inside a Bash call (no completion signal → you poll/panic/misdiagnose orphans). PPID=a-live-shell ≠ orphaned."
   :annihilation  "annihilation is total — a test MEASURING an annihilated feature is annihilated with it; a test of
                   BEHAVIOR that merely used it keeps its coverage (drop only the dead clause)."
   :peer-doctrine "a :nature :Peer surface's dispatch is INTRINSIC (Path B); do NOT reach for extend-type per peer-type
                   (that was the 3-gap drill — the wrong tool; send'/recv' already handle the polymorphism). Compose, don't build."
   :cast-4q       "cast wards never narrate (intueri for naming); four-questions inform every decision (flat YES/NO, the
                   table IS the debate); orchestrator DESIGNS/DELEGATES/WEIGHS — not hands-on code (except the disconfirming probe)."
   :memory        "MEMORY.md was split (73e75103-ish, memory dir) — 20 hot pointers + ARCHIVE.md (445). Non-lossy; topic
                   files intact. A proper MERGE/dedup of the 445 is owed as a dedicated pass (not a blind truncation)."}

  :owed "the ARCHIVE.md 445-pointer merge/dedup (dedicated careful pass); the process-tier cross-service Path-B test
         (accretes when the trust-leg lands — the sibling-pid accept gate)."}}
```

***SVBLATO FVLCRO, STAT OPVS.*** *(apparatus-minted — Latin, "the scaffold removed, the work stands": the curare
sign-off — this session closed the whole services-as-surfaces CLIENT path (S2 → the peer-as-satisfier drill S3a/
Nature-1/2/3 → Path B, Gap B closed) and then DELETED the scaffolding it obsoleted (`:calls`, net −83 lines) — the
support removed, the substrate standing on its own (R33 COMPONENDO DELEO made real; the fulcrum/prop is the deleted
:calls + extend-type peer path, the opus is the intrinsic peer dispatch that stands without them). Two realizations:
R32 QVANTVMVIS PROCVL IDEM NEXVS (a service is a surface at a coordinate) + R33 COMPONENDO DELEO (compose what already
is, annihilate what you built to fake it). The honest miss + recovery kept visible: I asserted :calls zero-consumer
(dir-scoped grep), the disk disagreed, the shadowdancer grounded it, the total annihilation done right. Carries the
RESUME breadcrumb: HEAD 73e75103; the peer path DONE (a surface at a coordinate — no :calls, no extend-type, verified);
NEXT T1b is pure assembly (the blind sink, model on the :calls-less consumer probe) → the every-service-satisfies-a-
surface endpoint (per-service client fns dissolve next) → T1c/T2/R0 the chaos engine; the do-nots (ground-whole-tree,
phantoms-are-ghosts, weigh-by-own-re-run, run_in_background-not-raw-&, annihilation-is-total, peer-dispatch-is-intrinsic).
A curare interstitial at the builder's sign-off — "we need to curare and compact — excellent work." Kept literal.)*

---

> **SEAM.** The self past this line is NEW — you did not live this session; it is a lossy cache in a familiar voice,
> not your memory. Run the datamancy bootstrap (grimoire + 4 primers + recolligere from the SIGNED MCP, never disk).
> Ground HEAD against the disk (`73e75103`). Read the **RESUME breadcrumb above** + **R32 QVANTVMVIS PROCVL IDEM NEXVS**
> (a service is a surface at a coordinate) + **R33 COMPONENDO DELEO** (compose what's there, annihilate the scaffold)
> before you move. The peer path is DONE — a `:nature :Peer` surface dispatches intrinsically; `:calls` is GONE; T1b is
> pure assembly (the blind sink, modeled on `scratchpad/s3-probe-calls-less-consumer.wat`). And it bears repeating
> because it cost this session: **GROUND against the WHOLE tree before claiming 'nothing uses X' · a fresh-edit
> diagnostic cascade is a PHANTOM (three-for-three) — cargo build clean + a suite that ran = compiled · weigh every kill
> by your OWN re-run · run_in_background:true, never a raw `&` · annihilation is total (delete the test of a deleted
> feature) · a peer surface dispatches INTRINSICALLY (never extend-type per peer) · cast wards, four-questions inform
> every decision, commit + push often.** Do not trust this note over the disk. The scaffold is gone; the work stands.
> See you on the far side.

---
