---
title: "The Coat That Fit"
description: "June 25 – August 16, 2026: two arcs that share one close tracker because they cannot close independently. Arc 293 opened on a bug the builder graded catastrophic — a wat struct and a wat record could not be operated on uniformly — and answered it by collapsing three Value variants into one and deleting inheritance outright. Pushing the same question one layer down surfaced arc 294: the holon record was built backwards, the derived VSA hologram sitting in the identity slot while the source EDN was demoted to a cache. The cure put the data back in its chair. The crowning recognition — that the central type's name had been lying since the bootstrap — was ruled void by the builder seven weeks later, and every deliverable it was supposed to crown had already shipped."
covers: 2026-06-25/2026-08-16
written: 2026-09-08
backfill: true
sidebar:
  order: 4
---

Backfill: this covers 2026-06-25 through 2026-08-16 and was written on 2026-09-08 from the two arcs' `REALIZATIONS.md` files, their design docs, the joint close tracker, one ruling document, and the commit bodies, all still in the tree. Floor counts and site counts below are the record's, quoted from commit bodies and not re-run; the two greps marked as mine were run against `wat-rs` at `3dc4f62b7`. Arc 294's directory outlived arc 294 — it is the repository's live seam holder as of September, and every parked seam points at it — so entries from late August sit in its `REALIZATIONS.md` and belong to other posts. What is here is one question asked twice. The second time, it was pushed a layer down, and the substrate's central record turned out to be built backwards.

Arc 293 and arc 294 have a single joint close tracker, and its first line says why:

> `# CLOSE SEQUENCE — 293 + 294 close TOGETHER (the single maintained tracker)`

The mechanism is a shared root, not adjacency. `CLOSE-SEQUENCE-293-294.md:9–16` records it: 294, the value-layer gut, was discovered inside 293, the aggregate type system. Chasing 293's construction parity surfaced that the holon record was built backwards; pulling that thread became 294. So 293's construction tail folds into 294, the homes are shared — `src/aggregate/` is 293.1's owed home, `src/holon/` is 294's — and 293.5's close is gated on the 294 value layer being done. They cannot close independently.

The tracker exists because the entanglement had already produced a real mislabelling. Two commits on 2026-06-27 are the drift being corrected: `fabf4a492` ("the 293.R2.x work is 294, not 293") and `ee1bfcf85` ("the invented R2.4 disavowed"). The builder's ruling, at `:5`:

> "293 and 294 getting entangled is a problem we've not faced and i don't want to experience this again — no slip out of sequence again."

`b1493d696` created the tracker the next day.

## A catastrophic bug and the shape under it (2026-06-25)

Arc 293 opened on a defect with no workaround. `293/REALIZATIONS.md:168`:

> "we cannot operate on structs and records trivially — that's a fucking catastrophic bug — decomplection is highest priority."

A `wat` struct and a `wat` record are both bags of named properties. They differed in three `Value` variants, three constructors, three identity fields, and 256 match sites. Any function that wanted to read a field had to know which of the three it was holding, which meant no function could be written once.

Three realizations landed that day. R1 re-derived structural surfaces by hating the word "parent". R3 found the factorization: holder × surface — what a thing is, underneath what it shows. R2 is the shape the whole unit turns on, `293/REALIZATIONS.md:163`:

> "the 'holder of things' is always a struct under the hood, right? … wat structs, records, holon-records should all be backed by a single common struct and then the 'struct-ness' or 'record-ness' is a thing on that common struct — { properties-as-struct, kind-as-enum }."

R2's own account of how it was reached is written into the record three separate times: the apparatus reached for the elaborate reading — this is a macro concern, those 256 match sites are essential heterogeneity — and the builder reached for the simple one, and the simple one was the truth each time. His tell, at `:167`:

> "i feel like one of us is missing something."

The fix was not a shim over the three. It was a decomplection: one property bag, with the struct-ness or record-ness demoted to a tag on it.

## The cosines, and the detour turns out to be the body (2026-06-26)

294 opened the next day on a probe the builder framed as a question rather than a plan: "294 — i think we're going to prove a simple edn measurement does or doesn't work?"

The first swing disconfirmed. `(cosine {:a 1 :b 2} {:a 1 :b 3})` over plain hand-typed EDN was rejected at type-check: the surface demanded `HolonAST | Record | Vector` and never EDN (`294/REALIZATIONS.md:127–136`). The data was not the thing you could measure. The derived hologram was, and the surface made you name the derivation before it would let you ask.

Lifted through `to-holon`, the cosines printed:

```
{:a 1 :b 2} vs itself        → 1.0      (exact coincidence)
{:a 1 :b 2} vs {:a 1 :b 3}   → 0.486    (one of two role-filler binds matches → ~½)
[1 2 3]     vs [1 2 4]       → 0.574    (two of three positional binds match)
{:a 1 :b 2} vs {:zzz :qqq}   → 0.011    (share nothing → near-orthogonal)
```

That is the project's origin walking back into the room. `294/REALIZATIONS.md:116–117`:

> "LOOK AT THE COSINES — it's been like 3 months since we've done a holon thing."
>
> "wat was my detouring all of the holon work because i fucking hate rust but need rust's perf."

`afb731de3` landed direct-EDN measurement over collections and scalars the same day; `e7ad4dec6` landed the showpiece the day after — the same `#holon` bytes read in Clojure and in `wat`. `ef0b4b4d4` notes that `cargo wat`'s first run is the homecoming cosines.

The chronicle starts with holon, a VSA library. `wat` was the route to holon's performance, and by June the route had become the body of the work. Three months of it had gone by without a holon thing, and the first one measured came back rejected by the substrate's own surface.

## One inversion wearing six faces (2026-06-26)

The ignition, `294/REALIZATIONS.md:16–19`:

> "we built it well enough for us to find what i'm calling catastrophic flaws … we can decide to gut what we did and do it better."
>
> "there is never 'well, there's 1+ ways to do a thing' — that is where catastrophic flaws get built."
>
> "i was never happy with the tagged stuff … it was a bridge to its annihilation."
>
> "edn goes in and vectors get built … holon can host all of edn."

`294/DESIGN.md:19–24` states the disease in one sentence and the cure in one more:

> **A derived encoding was made canonical, and the data it derives from was demoted to a cache.** … The cure, stated once: **EDN is the canonical data; everything else (the holographic vector, the wire form) is *derived from* EDN, never the other way.**

Concretely: a `HolonRecord` carried both its EDN fields and the VSA hologram encoded from them, and `Eq`/`Hash` delegated to the hologram. Identity was the encoding. The source data was the projection. Every operation on it was correct. The arrangement was backwards.

The design enumerates six faces of that one inversion, each cited to a line (`:26–:60`):

| # | flaw | where |
|---|---|---|
| 1 | construction split-brain — `struct-new` varargs vs `Record::of` vector vs holon `Record::of` vector-plus-hologram | `runtime.rs:11680` / `:13244` / `:13298` |
| 2 | holon record built backwards — hologram is identity, fields are the projection | `value/value.rs:329, 673, 924` |
| 3 | `#wat-edn.holon/*` tags are scar tissue from a hologram-canonical wire | `edn_shim.rs` |
| 4 | `HolonRepresentable` redundant with `EdnRepresentable` — all ~54 uses wire-only | `comms/mod.rs:134` |
| 5 | `HolonAST`-as-code-AST vestigial — `WatAST` 3412 mentions against 1161 | census |
| 6 | the strange loop ready to close — the rename | — |

Flaws 1 through 4 became strikes. Flaw 5 was re-sorted later and is still open. Flaw 6 was the arc's crown: the claim that stripping `HolonAST`'s borrowed roles leaves `Atom`/`Bind`/`Bundle`/`Permute` — the MAP-VSA algebra at `holon_ast.rs:59` — and therefore that `HolonAST` reduces to `Hologram`. The arc's name, `holon-returns-to-vsa`, was crowned for it; the builder's note on the name in `294/DESIGN.md:7–9` is "that one is just pleasant to read." 2026-08-14 is where that face goes.

## The strikes (2026-06-28 → 06-29)

Seven commits across two days:

| commit | date | what |
|---|---|---|
| `cf89fb52a` | 06-28 | 293 type system: surfaces, methods-as-accessors, `defprotocol` annihilated; acceptance demo green |
| `9d1e3ff3b` | 06-28 | 293.R2.1 repr collapse — three `Value` variants become one `Value::Aggregate` |
| `ed7ecd506` | 06-28 | 294.c.1 — the equality flip: a `HolonRecord`'s identity is its EDN data, not its hologram (flaw 2) |
| `f301a6fc4` | 06-28 | 294.c.2a — `aggregate-new`, the one holder-dispatched constructor (flaw 1) |
| `eaaa69300` | 06-28 | `kanerva_capacity`'s `floor(sqrt(d))` budget driven to one copy |
| `f51465d78` | 06-29 | 293 decl-a: `aggregatetype` is the one type-registration primitive; floor 4112/0/91 |
| `c7572929d` | 06-29 | inheritance annihilation; floor 4113/0/92 |

The builder in `9d1e3ff3b`'s body:

> "annihilate the variance ... i break shit because its already broken, successfully."

`c7572929d` deleted `AggregateDef.parent`, and with it `collect_all_record_fields`, `inherited_count`, `ROOT_PARENTS` and `abs_idx`. It could go because `parent` had been a stringly-typed shadow of the holder tag the collapse had just introduced — the same discriminator, spelled as a string, in a second place. The builder's ruling on it, at `CLOSE-SEQUENCE-293-294.md:42`, is four words:

> "parent as an attribute is wrong"

And in retrospect, `293/REALIZATIONS.md:1005`:

> "we've been trying to kill inheritance for… idk how long… i don't even know why i went down this path…. we built it to realize we don't need it… its easier without it."

The collapse held. At the 2026-08-30 tree (`8e79b8d39`), `src/types.rs:211` is `pub enum Nature`, `src/types.rs:311` is `pub struct AggregateDef` with no `parent`, and `src/value/value.rs:355` carries the epitaph: "Arc 293.R2.1: `wat__holon__Record` and `wat__core__Record` DELETED."

## Portable was the symptom (2026-06-30)

The wire wall needed its predicate finished and the marker needed a name. The apparatus ran a four-questions pass and two `intueri` casts and crowned `:Portable` / `:Anchored`, which the record grades at `293/REALIZATIONS.md:1015` as a good, honest answer to the wrong question.

Then the builder turned the marker over (`:1000–1001`):

> "strange…. very strange.. i viewed it as 'pure data' as in there's nothing but data in this… if a enum captures a socket… its impure?"
>
> "is that the name here?.. enums are pure or impure?" · "and if that's the name…. does holder evolve into a purity check?"

It does, and it always had been one. `is_portable = holder != Struct` is a purity test with a movement-name on it: a thing is portable because it is pure, and the check had been reading the consequence. The record's line, at `:1021`: "Portable was the symptom. Pure is the cause."

Both candidate names passed the four questions, so the four could not separate them. What separated them was a fifth question the builder stated as a law (`:1003`):

> "this feels like the only answer — the alternative reads like a deferral….. when we make our decisions we are building towards a solution that minimizes the chance of being revisited in the future — we bias towards long term stability.. how does this bias change our mind?"

The record's reading generalizes past `wat` (`:1046–1052`): a symptom-name is unstable by construction, because it gets revisited the moment someone traces it to its cause, and a decision that ships a known seam is not a decision but a deferral. The same session carries two corrections to the apparatus's own conduct, both kept (`:1026`, `:1034`): "decisions needs four-questions to inform the debate," and "you typically never do any real coding work — we just do the design debates here and delegate to sonnet to build."

R7 also had to rule on a collision that turned out not to be one. The purity axis it had just named is data-purity on a type; arc 255's `@Purity` axis is effect-purity on a function. R7 ruled them one family — the two uses sit in different syntactic positions (`:1030`) — and recorded that the apparatus had manufactured a wall where there was a seam, and the builder walked through it. `439ee19c9` and `4b933f9e4` landed the axis on 06-30; `Holder` became `Nature` at `4b9a6d7fb` on 07-06.

## The flip, and 645 (2026-07-12 → 07-15)

Item 9a made a bare aggregate name the kwargs macro and demoted positional construction to the type-name prime `:ns::T'`. The flip landed and the floor went to 645 failures.

The descent is written into twenty-three commit subjects, one per drop — `967aa344e` 645→165, `525cd24cc` 165→150, `b6d0bc37f` 100→79, `73cfeefeb` 34→26, `1b9a9c43b` 15→13, `295186158` 4→3, and `6d6bc6855` floor = 1.

The record declines to make the descent the point. `294/REALIZATIONS.md:551`: "the apparatus **guessed the class wrong nearly every time**, and each wrong guess had the same author: an assertion that could not speak." Seven roots, none predicted from the failure text — including `fadb03dfa`, "macro registration is SEQUENTIAL during expansion," which was the whole `defservice`/`deftest` cluster in one line.

The miniature is at `:568–:574`. `peer_ipc` had been staring the builder down since the flip, and his read of it was "likely simpler than we realize." It was two lines. A bare-positional construction errored, and the `Err` arm called `drain_server_stderr(&server)` to report the error — against a child still blocked on `readln`. The diagnostic path deadlocked on the failure it exists to report, and the test around it had reasoned carefully about hangs in the happy path while never considering that the error path could hang first.

His demands across that stretch (`:526`, `:527`, `:532`):

> "we have /very/ rich error messages.. are they failing us?"
>
> "we have tests that are an opaque failure and we are making an active choice to mask the failure instead of present it."
>
> "we cannot return to normal work until failures are the exact one — you proposing 2 stuns me… that's not an option."

R6's rune is DOLOR INDEX EST: the ache was the instrument.

## The ruling (2026-08-14)

Seven weeks after the crown, `341eb81e8` landed under the subject "294 RULING: HolonAST and Hologram are BOTH correctly named — R1's keystone is VOID."

Here is how the keystone had been received, `294/REALIZATIONS.md:20`:

> "holy shit … it reduces to 'Hologram' — that's … woooooowwwww."

And here is the same person killing it, `RULING-holonast-and-hologram-are-both-correctly-named.md:9` and `:11`:

> ":wat::holon::Hologram is currently correctly defined.... the hologram is the thing you hold and can get objects out who point to more objects.... the hologram is made from holons"
>
> "HolonAST needs no change..... it is an AST for building holons.... its far more restrictive than WatAST.... but it can hold everything a WatAST can hold.... HolonAST is an edn.... whatever you can express with edn... you can build in holon-ast...."

The ruling proves the incumbent's name from its own definition rather than asserting it — `src/hologram.rs:63` at the time, `src/holon/hologram.rs:63` now:

```rust
pub struct Hologram {
    slots: Vec<HashMap<HolonAST, HolonAST>>,   // ← made OF holons, keyed BY holons
    capacity: usize,                            //   floor(sqrt(d)) — Kanerva cells
}
```

A `Hologram` is a structure made of holons and keyed by holons. `HolonAST` is what you build a holon out of — an AST, more restrictive than `WatAST`, and expressive over exactly what EDN is expressive over. Neither name was vacant and neither was wrong. The ruling's own summary, at `:22`: the stripping was right, and the naming of what remained was one step too far. The layering, with every name correct:

```
EDN ≅ HolonAST --encode--> a holon --stored in--> Hologram
```

Two things about how it was found are kept in the ruling under a heading that says why they are kept. First, it did not come from measurement: an hour earlier the apparatus had measured `Hologram`'s 116 references and reported them as the destination name — as progress toward the rename — when they were the collision. Its own account: "A name the apparatus wrote is internally consistent with the map the apparatus wrote it into. Grepping your own map confirms your own map." Second, the builder cut it twice — once on a dead precedent ("078 is very old and we changed away from that name in 109 or later"; the crate it named is gone), and once on the semantics. The verdict recorded: the taste-first read beat the measurement-first read to the finding, again.

The ruling also shrank the work by two orders of magnitude. Its own line: "'The remaining holon junk' is therefore three items, all in wat-rs, all on legal ground — not 1263 sites across two repos. The cross-repo migration that looked unavoidable an hour ago does not exist."

The rename never happened, and nothing reduced to anything. Read at `3dc4f62b7`, `git grep -o HolonAST -- src/` returns 1,165 occurrences and `pub struct Hologram` stands at `src/holon/hologram.rs:63`. Flaw 5 was re-sorted by the same ruling as a scoping cleanup rather than a rename — `HolonAST` still doing code-AST duty in `special_forms.rs` and `lower.rs` — and whether that has since been done is not verified here.

The void arrived out of an arc-255 afternoon, on the same day as `294.g`, the first of the wire strikes. The arc got shorter and kept going.

## The wire strikes (2026-08-14 → 08-16)

| commit | date | what |
|---|---|---|
| `21b7079f8` | 08-14 | 294.g — the holon record's wire is plain EDN: `#t/Holo #wat-edn.holon/Bind [...]` (~250 bytes) becomes `#t/Holo {:x 1 :y 2}` (22) |
| `3656d1e46` | 08-16 | 294.h — `HolonRepresentable` deleted: trait, 9 impls, 7 delegating shims |
| `df6e2e91c` | 08-16 | 294.i — `#wat-edn.opaque` is dead; every resource decorates nil in its own home |
| `f6f8df3b5` | 08-16 | 294.j — the wire carries data under `#wat/holon`; anything neither data nor directive raises |
| `62807e376` | 08-16 | 294.k — the fabricated home raises; the arms were dead, as the wall proved |
| `29598dfc8` | 08-16 | 294.l — the float sentinels go home |
| `e00c4691b` | 08-16 | 294.m — `#wat-edn.cap` is gone, and the registry is the wall |
| `5ca6dab57` | 08-16 | 294.n — `#wat-edn` is annihilated |

294.g is flaw 3 closing. The discriminator between a holon record and a base record moved off the body's shape and onto the registry's `Nature`, so the hologram stopped needing to ride the wire and started being derived on arrival. 294.h is flaw 4, and the builder's line in its body is the whole justification: "i don't think we need HolonRepresentable at all now."

Three of the strikes have a second half.

**294.i — the correction that became the design.** The apparatus had read `opaque_nil` as a missing encoder and proposed writing encoders for the VSA types, which the commit body says would have meant inventing EDN for things that have none. The builder's model:

> "i expect these rust things to just decorate nil..... they contain no edn.... `#wat.io/Sender nil` is the data literal for a Sender instance..... a hologram is full of holonic data.. but it cannot be represented as edn.. we can transmit these as edn but the receiver can gain no knowledge.... there's no edn to represent a resource."

The nil body was correct and final. The only defect was that `opaque` sat in the namespace slot where the type's home belongs. The line that opened the strike is shorter: "#wat-edn/opaque has a death warrant."

**294.i again — the rider overrode the brief and was right.** The brief said to delete the `None` door and called that not a licence to keep it. Measured: `encode_capability(inner, types: &TypeEnv)` takes its registry by signature, so the `if let Some(t)` is a shape rather than a choice, and `edn_shim.rs:3773` is its only call site, on the live process-tier `send'` path. Obeying would have silently deleted the entire capability-encode mechanism. The commit's verdict on the instruction it disobeyed: "The brief was the upstream defect."

**294.m — the namespace was the wall.** `if ns == "wat-edn.cap"` is how the decoder refused a forged capability. Give capabilities their real home and the string stops discriminating, because `wat.kernel` also houses `Frame` and `Location`. So the refusal had to start asking the registry:

```rust
let cap_type_path = ns_to_wat_path(ns, name);
if crate::capability::is_capability_type_path(&cap_type_path) { ... }
```

which is arc 198's ruling verbatim — ask the registry whether the key is live, never ask a string what it looks like. The encoder had been doing this all along; only the refusal asked a string. The two-key asymmetry collapsed with it: `codec.name` deleted, `type_path` the single key in both directions. The commit calls it the fourth instance in the arc of one concept implemented twice, and the only one sitting on a trust boundary.

294.n closes the tags. The builder's instruction was "20 refs.... they go... #wat-edn is annihilated..." The honest census found 44, spanning `src/ crates/ tests/ wat/ wat-tests/ wat-scripts/` over `.rs`, `.wat` and `.md`, and the wider grep caught what the narrow one could not: 11 of the 44 are Clojure namespaces — `wat-edn.core` in the sibling `wat-edn-clj` library, a live public API, not a tag. A grep cannot tell a tag from a namespace that happens to share its spelling. The reason it mattered was downstream of all of that: a user hitting `"wat-edn.cap/address (name 200 bytes exceeds the 107-byte abstract-UDS limit)"` would grep for `wat-edn.cap` and find nothing. Run at `3dc4f62b7`, `git grep -o '#wat-edn' -- src/ wat/ crates/` returns 0.

## What stands

Neither arc has closed. `CLOSE-SEQUENCE-293-294.md:207` still shows 293.5 gated on a phase count reaching zero, on items 8 through 12, and on an empty ignore ledger. `src/holon/`, which 294's design names as the arc's owed home, was not delivered by a 294 commit at all: it was minted on 2026-08-26 by `d43f75887`, an arc-255 strike moving the VSA algebra out of `runtime.rs`, twelve days after the wire strikes ended.

What did land is the inversion, corrected in every face it wore. Identity is the EDN fields; the hologram is a derived index; the wire ships plain EDN under a real home; one holder-dispatched constructor builds all three kinds; inheritance is gone because its discriminator already existed with a better spelling. None of that depended on the rename, and none of it moved when the rename stopped existing.

The keystone is the exception, and it failed differently from ordinary error. `HolonAST` was minted for VSA, accreted a code-AST role and a wire role, and the arc read that accretion as the name having lied. That reading was half right: the borrowed roles were real and shedding them was correct. What it got wrong is what remained — still a syntax tree, one for building holons rather than for code — and it got it wrong while every individual measurement was accurate. The apparatus counted `Hologram`'s references correctly and filed them under the wrong heading, because it was grepping a map it had drawn. The correction could not come from the party holding the pen.

A campaign can be entirely right about the rot and entirely wrong about the cure, and the two verdicts are independent. A recognition is not a finding until the other road has read it.

## Likely Contributions to the Field

- **A derived index in the identity slot is invisible because everything still works.** The holon record stored its EDN fields and the VSA hologram encoded from them, and `Eq`/`Hash` delegated to the hologram — so identity was the encoding and the data was the cache. No operation was incorrect; the arrangement was backwards. The class generalizes to any system that computes a digest, an embedding, or an index from data and then starts keying on it.
- **A symptom-name is unstable by construction, so naming the cause is a stability decision rather than an aesthetic one.** `is_portable = holder != Struct` had always been a purity test. Both candidate names passed the four questions, and what separated them was a fifth: which answer minimizes the chance of being revisited? Its disqualifier travels with it — a decision that ships a known seam is not a decision, it is a deferral.
- **Three things written once are not three things.** Struct, record and holon-record differed in three `Value` variants, three constructors, three identity fields and 256 match sites, and that surface area read as essential heterogeneity from inside. Collapsing it also killed inheritance, because `parent` turned out to be a stringly-typed shadow of the kind tag the collapse introduced — a second spelling of a discriminator that now existed once.
- **Deleting a namespace can delete a security check, because the namespace was the check.** `#wat-edn.cap`'s decoder refusal was `if ns == "wat-edn.cap"`. Giving capabilities their real home meant the string stopped discriminating, so the refusal had to start asking the registry — which the encoder had been doing all along. One concept implemented twice, and the only instance of it on a trust boundary.
- **Measurement can march you toward a wrong conclusion while every individual measurement is correct.** `Hologram`'s 116 references were counted accurately and reported as progress toward a rename when they were the collision. A name the apparatus wrote is internally consistent with the map the apparatus wrote it into; grepping your own map confirms your own map. The refutation shrank the remaining work from 1263 sites across two repos to three items in one.
- **The diagnostic path can deadlock on the failure it exists to report.** One `Err` arm drained a child's stderr while the child was blocked on `readln`. A thirty-second hang that read as a hard concurrency bug was two lines, and the surrounding test had reasoned carefully about hangs in the happy path while never considering that the error path could hang first.
