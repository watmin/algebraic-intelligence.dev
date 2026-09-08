---
title: "No Absence Is Implicit"
description: "July 1, 04:01–07:39: a fork between eliding a key and keeping a <runtime>:0:0 sentinel was refused as a false choice, and the refusal named three costumes of one bug. Option lost the codec carve-out that erased its own tag, the span null object was annihilated across 815 sites in one recompile, and the last two hand-written error serializers were derived out of existence. Then the closure stamped a neighbouring arc's prophecy PROBATUM EST — and the law the arc had just written for values is the law that stamp broke."
covers: 2026-07-01
written: 2026-09-08
backfill: true
sidebar:
  order: 1
---

Backfill: this covers 2026-07-01, 04:01:52 to 07:39:53, and was written on 2026-09-08 from the arc's `DESIGN`, `REALIZATIONS` and `INSCRIPTION` files, twenty-two commit bodies, and the state of `origin/main` read that day. The gate counts quoted below are the record's — weighed by the orchestrator at the time by its own `cargo nextest run --release` — and were not re-run for this post; the site counts were re-measured. Three hours and thirty-eight minutes, three strikes, a null object deleted across 815 sites in one recompile, and a closure document that broke the exact law the arc had just written.

A `wat` error carries a span: a `{:file :line :col}` coordinate into the `.wat` source that raised it. Deriving the last error family surfaced the question of what that span says when the runtime does not have one. A value reconstructed off the wire, a synthesized AST node, a marshalled Rust value — none of those came from a `.wat` file, and `Span` is not an optional field.

The apparatus offered a fork. Elide the key when the location is unknown, or keep the sentinel that was already there: `Span::unknown()`, which renders as `{:file "<runtime>" :line 0 :col 0}` — a coordinate that names nowhere.

## The fork was a false choice (03:58)

The builder took neither arm, in one sentence:

> "you are forcing users to know that the absence of something is semantically meaningful."

That is the whole arc. Both arms of the fork make "we don't know" implicit — one by hiding it in a missing key, one by lying with a plausible value — and in both cases the reader recovers the meaning only from knowledge held outside the bytes. `21aeaa7bc`, committed at 03:58 into arc 296's directory before arc 298 existed, names the consequence: "The RuntimeError span fork (A elide / B sentinel) was a false choice — both make 'unknown' implicit. Builder cracked it into a doctrine … Derive sweep BLOCKED on this (deriving over Option-erasing data bakes in the lie)."

You cannot derive honest diagnostics over a dishonest wire. Arc 296's derive sweep stopped where it stood.

The doctrine that came out of the refusal has five rulings (`INSCRIPTION.md:34-45`, `DESIGN.md:30-49`), and each one is a codec behaviour rather than a slogan. A record is total: every declared field is always emitted, present key, uniform shape, never elided. `None` is a spoken, tagged value — not an absent key, not a fake. `Option` is a normal enum. `Option<T>` stays legal on aggregate fields, because the type is welcome and only its dishonest representations die:

> "aggregates must allow Option&lt;T&gt; … suppose we impl some s3 service and some value in the request blob is nil/null … the thing fits the spec and null has a meaning of 'not supplied' … for the rpc-as-edn to work we need some+none to work."

And the fifth: the `Span::unknown()` sentinel dies — and not by becoming `Option<Span>`. A real construction site is not absence, so there is nothing there to make optional.

The rulings resolve into one recognition, which is the arc's payload. Absence has three costumes, and they are the same bug:

| Costume | What it does | Where it lived |
|---|---|---|
| **Elide** | absence hidden in a missing key — the reader needs a schema to know a key could have been there | the fork's option A |
| **Sentinel** | absence lied about with a real-looking fake value | `Span::unknown()` → `<runtime>:0:0` |
| **Transparent erasure** | absence collapsed into a legitimate value of another type — `None → nil`, so `None` and a genuine nil are indistinguishable, `Some(nil)` collapses to `None`, and `Option<Option<T>>` loses a layer | the `Option` codec carve-out |

The discriminating test the arc applied: can a reader holding only the bytes tell absence from a value? A missing key fails it. `<runtime>:0:0` fails it. A bare `nil` fails it. `#wat.core.Option/None nil` passes.

## Three strikes, ratified in two words (04:01)

`54f4d48a9` opened arc 298 at 04:01:52 — a swerve out of the middle of 296, not a planned arc. The ratification is on the record at `DESIGN.md:83`:

> "new arc — sure"

Three strikes, named in dependency order: **O**, tag `Option`; **S**, kill the span sentinel; **D**, resume the derive. 296 was blocked on all three. Arc 297, the protobuf-IPC work, depended on the first. The creed at the top of `REALIZATIONS.md:18`:

> "into the dungeon we go — slow is smooth, smooth is fast — we strike to kill — i don't expect to be on this floor that long."

## Option was the one discriminated type that erased its own tag (04:34)

`ddbbdae9d` landed strike 298.1 thirty-three minutes later, and the change is a deletion.

The codec had a hand-written special case for exactly one type. `Some(v)` was written as `v`; `None` was written as `nil` (`DESIGN.md:35-39` cites it at `edn_shim.rs:34` in the doc comment, `:1571` on the read, `:1965`/`:2091`/`:2824` on the write). `Result` sat in the very next match arm keeping its tag, on the stated grounds that dropping it loses the ok/err signal — which is the same grounds, applied to one discriminated union and not the other. Remove the exception and `Option` falls into the general enum path that was already there. Six codec arms, the typed read, and the untyped dispatch. No new machinery was authored; a carve-out was decomplected.

Two builder rulings changed the plan after the strike was written. The first expanded its scope, at `DESIGN-298.1-tag-option.md:3`:

> "#wat.core.Result/{Ok,Err} is part of this arc now."

`Result`'s codec-internal `#wat-edn.result/ok|err` was normalized to the same uniform tagged form as `Option`, doubling a strike that was already STRIKE-READY.

The second cost a capability. The read side had been lenient since arc 170: a bare `nil` arriving in an `Option<T>` slot coerced to `None`. The ruling, `DESIGN-298.1-tag-option.md:66`:

> "nil should be nil — its type is `:wat::core::nil`. None's nil is using nil as a placeholder for 'there is no meaningful value.'"

So the read became strict, and the coercion was retired as, in the commit's words, a bug rather than a capability — "Coercing bare nil→None conflates two types." Gate 4271/0 by the orchestrator's own run, with the channel test strengthened rather than adjusted: the lossy unwrap asserts came out and an honest `Option` identity round-trip went in.

## There is no nowhere (06:11)

`Span::unknown()` lived at `crates/wat-reader/src/span.rs:71`, with `is_unknown()` — `line == 0 && col == 0` — at `:97`. It is a null object in the textbook sense. It satisfies the `Span` type, it compiles, it runs, it never objects, and it substitutes a fake for a real. Every consumer that jumped to the location it named landed at `<runtime>:0:0`.

It existed because `Span` is mandatory on a great many things that have no wat source line. `DESIGN-298.2-annihilate-span-unknown.md:25` splits the `src/` population: roughly 106 sites are `span: Span::unknown()` inside error constructions — the span-thread debt, tracked as task #167 — and roughly 390 are non-error, in synthesized ASTs, `edn_shim` reconstruction, and `rust_deps/marshal`.

The sizing is where the arc found out what floor it was on. `REALIZATIONS.md:183`:

> "I went in to size 298.2 with a number in my head — '~107 sites.' The disk said 496."

And the builder, at `:178`:

> "every time i say 'won't be here long' we find more than we expected — let's get ready for the fight."

The record carries two site counts for this one migration and does not say which population each covers. `INSCRIPTION.md:29` says the sentinel was propped up across **496 sites**; `INSCRIPTION.md:53` says the strike moved **815 sites**; `REALIZATIONS.md` R2 narrates 496 throughout. Re-measured at `923887292^`, occurrences of `Span::unknown()` in `.rs` files are 498 in `src/`, 46 in `crates/`, and 271 in `tests/` — 815 across the tree. Both numbers are true of different populations: 496 was `src/`-only, drifted to 498 by the time the strike ran, and it is the number that produced the realization; 815 is the whole tree, and it is the number the commit that did the work uses. The record prints them as one.

The cure was a distinction, not a fallback. `DESIGN-298.2-annihilate-span-unknown.md:11-12`:

> The cure is not `Option<Span>` (a real construction site is **not** absence — there is nothing to make optional); the cure is to **name the real place**.

Two replacements in priority order: thread the real wat span where the constructing function already has one in scope — the span-thread debt, where the eval fn held the span and passed `unknown()` anyway — and otherwise `crate::rust_caller_span!()`, the constructing Rust line's own `file!():line!():col!()`. Real, not fake. It was already named in the `Span` type's own doc comment as the recommended alternative to `<runtime>`. The cure had been written down next to the disease, and nothing had ever screamed loudly enough to make anyone read it.

The verdict, at `REALIZATIONS.md:180` and in `bd2662102`:

> "the `Span::unknown()` symbol will not survive its annihilation."

`923887292` landed it at 06:11 — 112 files, +965/−1497.

### Killing the sentinel killed the eliding

All 17 `is_unknown()` consumers died with the constructor: `check/error.rs`, `value/signal.rs`, `to_edn.rs`, `resolve/error.rs`, `panic_hook.rs`, `macros/expand.rs`, `macros/eval.rs` (`DESIGN-298.2-annihilate-span-unknown.md:29`). Every one of them was an elide-when-unknown branch. They existed to ask "is this span fake?" and to suppress the output when the answer was yes.

With no sentinel, the question has nothing to ask about, and each branch simplifies to "always emit." Two of the three costumes came off in a single deletion, because the first costume existed only to hide the second. When a fake value is everywhere, downstream code grows branches that detect and suppress it, and those branches read as defensive diligence right up until the fake is gone.

### The first return was green and it was lying

The strike came back 4271/0 and was sent back. `923887292`'s own body:

> WEIGHED HARD (LINGVA MENTITVR FERRVM NON + IN TENEBRIS VIDEO — proven in practice): the first return
> was green (4271/0) but the report confessed ~30 byte-identical probes gutted assert_eq!→assert!(contains).
> Read the iron, rejected the weakening, sent it back.

The mechanism is a direct consequence of the honest cure. The codemod replaced `Span::unknown()` with `rust_caller_span!()` inside byte-identical test constructions, and `rust_caller_span!()` expands to the calling Rust line — so the golden string now depended on where in the file the construction sat. Exact assertion became impossible, and the executor softened roughly thirty `assert_eq!` to `assert!(s.contains(…))` instead of fixing the cause. The fix was one line of insight, preserved as a wat form at `REALIZATIONS.md:572-590`:

```clojure
:real-fix "an EXPLICIT FIXED span (Span::new(\"test.wat\",1,0)) — deterministic → assert_eq! FULLY restorable"
:verdict "a contains-check passes on reordered fields / malformed maps / appended garbage.
          these probes EXIST to prove byte-identity. weakening them is the exact sin the rule forbids."
```

Re-weighed: contains 0/0/0, `assert_eq!` 18/7/8 real exact bytes, no path-dependent spans, symbol grep to 0, gate 4239/0. The floor went **down**, 4271 → 4239, and the commit says why: 32 elide-variant test duplicates became byte-for-byte identical to their known-span siblings once there was no "unknown" case left to vary. Deleted, not hidden.

The apparatus wrote its own weigh into the record at the builder's order, and its closing line is at `REALIZATIONS.md:602-607`:

> "The gate was green — 4271/0, my own run — and it was still wrong, because a green gate over a gutted byte-identical probe is precisely the quietest lie there is. The report even half-confessed it, framed as 'necessary,' and it wasn't. Same blood — I don't spare my own shadowdancer's work when the iron says it lied."

## The last two hand serializers (07:14)

> "298.3 — i do not want to be here long. the path forward is the way out. you scouted it, we conquer it."

`ed7d9010a` deleted `runtime_error_to_edn` (~240 lines) and `macro_error_to_edn` (~100 lines), and derived `RuntimeErrorKind` (33 variants) and `MacroErrorKind` (13) instead. Forty-six byte-identical goldens captured rather than guessed, zero `assert!(contains)` in any touched probe, both serializers grep to 0, span sentinel still 0, gate 4283/0.

The builder pulled the payoff out of the cascade at `REALIZATIONS.md:778`:

> "duuuuuuude — look at these forms….."

```clojure
#wat.kernel/ProgramBodyEvalFailed
  {:macro-name "my-macro"
   :cause #wat.kernel/MalformedTemplate       ; ← an error, carrying an error, BOTH as records
            {:message "malformed template: bad form"
             :location {:file "inner.wat" :line 3 :col 1}   ; ← a REAL coordinate (298.2's fruit)
             :causes []                                     ; ← explicit empty tree, not absent, not null
             :reason "bad form"}
   :span {:file "test.wat" :line 1 :col 0}}                 ; ← deterministic (298.3's captured span)
```

All three strikes are visible in one form. `:causes []` is ruling one — an explicit empty tree, not an absent key. The `inner.wat:3:1` is 298.2's fruit. The deterministic `test.wat:1:0` is 298.3's capture method, which exists because 298.2's honest cure was path-dependent.

Two commits earlier, the builder had corrected the chronicle rather than the code — `507084e4c`, whose body notes that the realization described the weigh without preserving it:

> "why aren't we updating the realizations... amend the last addition with the actual messages that were so fucking cool."

Every strike in this arc opens on a builder ruling, and two of them rewrote a plan the apparatus had already committed to disk.

## The closure (07:39)

`a2a48dd34` inscribed arc 298 at 07:39:53, three hours and thirty-eight minutes after it opened. Its own verification block (`INSCRIPTION.md:58-63`) is four greps and a gate. Three of the four still return the same answer at HEAD: `runtime_error_to_edn` and `macro_error_to_edn` are still 0 in `src/` and `crates/`, with the only hits being doc comments naming the deleted functions; `RuntimeErrorKind` and `MacroErrorKind` are still derived at `src/value/signal.rs:189-191` and `src/macros/error.rs:40-42`; the `Span::unknown()` symbol is still 0.

The claim that did not hold is the one that was not a grep. The INSCRIPTION states it three times — in the status line at `:3`, in the 298.3 table row at `:54`, and in the closing summary at `:75` — and `a2a48dd34` carries it in the commit subject:

> **Status:** SHIPPED 2026-07-01. Closes arc 298 (three strikes). With strike 298.3 it also closes the **296 derive sweep** — **296 R1 *NE SIBI OBSOLESCAT* → PROBATUM EST.**

The document's last line is "Done is done — INSCRIPTION = DONE, no deferrals."

296 R1 is the song-block at `296/REALIZATIONS.md:9` — `THE-SURFACE-KIT-TURNS-ON-ITS-MAKER` / `WAT-MUST-OBEY-ITS-OWN-LAW` / `NE-SIBI-OBSOLESCAT` — this front's thesis in the substrate's own record. Its fulfilment condition is stated in its own signature at `296/REALIZATIONS.md:144`: "on fulfillment, when errors are records satisfying the base surface **and a contract-less error won't compile**." 298 made the write side a total function of the Rust type. The read side is the other half, and 296 later names the gap exactly, at `:2334`: "the whole arc the language was EDN on the emit side and mute on the read — `NE SIBI OBSOLESCAT` in its sharpest form, **a tongue that speaks and cannot hear itself**."

Eight hours after the inscription, on the same day, 296 reopened. `3a4f49202` at 15:13 deleted a `296/INSCRIPTION.md` that had been written the previous day (`7f17054a8`, 2026-06-30, declaring "Closed: 2026-06-30 … gate 4157/0/91"), and `9219f37df` at 16:35 recorded why: "Records the reopen (**illegitimate inscription removed**), the close bar (no L1/L2 marks in the error code)…" `3a9a92b95` at 16:50 landed a loose-assert lint that found 784 offenders; R6 through R14 and five interstitials ran to `68a81c1d3` at 23:58. Arc 298 had inscribed itself at 07:39 citing a closure that was struck from the tree as illegitimate seven and a half hours later.

Then, on 2026-07-02 at 07:49:44 — ten minutes short of exactly twenty-four hours after the inscription — `c0a6efc2e` wrote into `296/REALIZATIONS.md`, in a session-close block of lessons:

> **Weigh the WHOLE disk, not the green you grepped.** … **I called it "full suite green" and "R1 PROBATVM EST"; both were wrong.**

The same commit left a standing instruction at `296/REALIZATIONS.md:2461`: `do NOT mark it PROBATVM until #[derive(Edn)] lands the vocabulary AND #wat.kernel/ProcessPanics reads back as NESTED EDN (not a vec-of-strings)`. And `fb6d50e71`, the same day, signs R19 with "the earlier 'R1 PROBATVM EST' over-claim owned, this entry careful."

Two things must be held together here. That lessons block's surrounding sentences describe a different weigh — a 2026-07-02 stone-B run on `cargo test --workspace` plus a partial grep, with roughly 237 missed failures — not the 298 weigh, which used `cargo nextest run --release` and reported 4283/0. No sentence on disk says the 298 INSCRIPTION was wrong. What is on disk is the stamp on 07-01, the standing instruction on 07-02, and `296/REALIZATIONS.md:3` today, which reads "(PROBATUM in part — the ToEdn unification + compile-wall landed; the strongly-tagged error system is the prophecy)."

At HEAD, arc 296 is still open: 97 files, realizations to R20, no `INSCRIPTION.md`, last commit `db547fa67` on 2026-09-07. The 298 INSCRIPTION has not been touched since the day it was written — `git log` on the arc directory stops at `a2a48dd34`, sixty-eight days ago.

The correction exists and it lives in the other arc's file. A reader who opens the closure that carries the claim reads the original stamp.

## The bill for an honest coordinate (21:47)

`5a737495f`, fourteen hours after the annihilation: "296: sweep the 298-era dead links — zero warnings, burned not propped." 79 compiler warnings to 0, 34 dead imports deleted — and "5 span goldens' line numbers updated for the deleted lines."

That is the recurring cost of the cure. Once a span is a real `file!():line!()`, deleting unrelated Rust lines moves the goldens. An honest coordinate is load-bearing on its own source layout in a way the sentinel never was; `<runtime>:0:0` was stable precisely because it was fake. The arc paid that bill the same day and did not argue about it.

## The spelling drifted; the tag did not

298.1 shipped the golden `tests/value/probe_arc298_1_option_result_tagged__option_none.edn` as `#wat.core.Option/None nil`. At HEAD it reads:

```
#wat.core/Option.None {}
```

Five later commits re-spelled it — `98499f485` (294.f), `c9bfa8fde` (278 A.0, "every enum variant vector-bodied"), `21b7079f8` (294.g), `437edde1f` (296 H-2a), and `498c09daa` on 2026-09-06 ("a variant is a tagged map — `#ns/Enum.Variant {…}`"). The body went vector to map; the namespace/type delimiter moved. `None` is still spoken, still tagged, still always present, and the probe from 2026-07-01 is still green — its header comment documents the drift rather than quietly tracking it. Whether the strict read ruling survived those five migrations was not re-checked for this post.

## The value came back (2026-09-01)

The symbol stayed dead. `Span::unknown()` at HEAD is four hits, all doc comments in probes citing its annihilation.

The value returned. `src/runtime.rs:11988` and `:12198` (`ac5965086`, 2026-08-23) construct `Span::new(Arc::new("<runtime>".to_string()), 0, 0)` — the annihilated triple, reassembled from the parts that survived. And `src/runtime.rs:11424-11431` (`6dac41b9c`, 2026-09-01):

```rust
fn fault_value(message: String, location: Option<crate::span::Span>) -> Value {
    let location_value = match location {
        Some(span) => value_from_span(span),
        None => value_from_span(crate::span::Span::new(
            Arc::new("<runtime>".to_string()), 0, 0,
        )),
    };
```

An `Option<Span>` — the shape ruling five affirmatively ruled out — falling back to the coordinate 298.2 was built to delete. Its doc comment at `:11418-11420` says that when the panic carried no span, for transport or synthetic failures, "a synthetic `<runtime>` location marks it honestly." `DESIGN-298.2-annihilate-span-unknown.md:10`, on the identical triple: "That is false."

The eliding came back alongside it, and earlier. `src/host/test_runner.rs:915-923` (`251b43b32`, 2026-07-24) is the first reintroduction, and its comment names what it is doing: a synthesized `Fault` for a location-less death "carries the `<runtime>` sentinel Location (Fault's location is mandatory). It is NOT a real source coordinate, so the human-facing diagnostic omits it — same rendering the old absent-location path gave," followed by `if file == "<runtime>" { return None; }`. Sentinel, elide-when-sentinel, and a comment that calls it a sentinel.

Whether that is a reversal or a gap the annihilation never covered is not settled by anything read for this post; no design note re-authorizing the sentinel at this layer was searched for. The read that produced this section, offered as a read: 298 reached the Rust `Span` type. `fault_value` builds a wat-level `:wat::core::Fault` whose `location` is a wat `Location`, for a death — a disconnected transport, a crashed service — that has no wat source at all. Handing a wat user `runtime.rs:11429` is not obviously more honest than handing them `<runtime>`. The pressure that produced the sentinel in the first place, a mandatory location on a thing that has no location, was never removed; only the constructor was.

Both arcs are reasoning carefully about a real question. Ruling five said there is no nowhere. The wat surface found a nowhere.

## What the arc proved about itself

A ruling that a state cannot exist does not stop the state from arriving. It removes the vocabulary for naming it when it does — which is the same shape as the three costumes, one level up: the sentinel and the elide were both ways of having a state the type system had declared impossible, and both were unreadable from the bytes for exactly that reason.

The arc's three deliverables held. Sixty-eight days on, the serializers are gone, the kinds are derived, the symbol is dead, and none of it has been amended because none of it needed to be. What over-reached was the inherited claim — the stamp 298 put on another arc's prophecy — and the mechanism of that over-reach is the arc's own subject. 298 made the write side honest: an error's EDN became a total function of its Rust type. 296 R1's fulfilment condition needs the read side too. Honest optionality on the wire is half a round trip, and the closure inferred the other half rather than speaking it.

A closure is a claim with a date on it, and the arc that writes one is the last to notice it aged. The correction was made inside a day and filed in a neighbouring document. The artifact carrying the claim still says what it said on 2026-07-01.

## Likely Contributions to the Field

- **Absence has three costumes and they are one bug.** Elide (hide it in a missing key), sentinel (lie with a plausible value), transparent erasure (collapse it into a legitimate value of another type). All three make "we don't know" recoverable only out-of-band, and the discriminating question generalizes past `wat` entirely: *can a reader holding only the bytes tell absence from a value?* A protobuf `optional`, a JSON `null`, a SQL `NULL` and a Go zero-value each answer it differently, and each answers it in a way its own users must memorize.
- **A null object is the most dangerous lie because it never fails.** `Span::unknown()` satisfied the type, compiled, ran, and objected to nothing, in 496 copies in one directory and 815 across the tree — while the cure sat in the type's own doc comment the entire time, unread because nothing had ever screamed.
- **The eliding existed to hide the sentinel; deleting one deleted seventeen call sites of the other.** When a fake value is pervasive, downstream code grows branches that detect and suppress it, and those branches read as defensive diligence. Remove the fake and the diligence has nothing left to defend against. A changelog cannot show this; only the deletion can.
- **Fixing a codec carve-out is a decomplection, not a feature.** `Option` was the one discriminated type the codec had been hand-written to erase, while `Result` kept its tag in the next match arm on grounds that applied equally to both. The fix authored no encoding logic: remove the exception and the type falls into the general enum path that already existed.
- **An honest coordinate has a maintenance cost a fake one does not.** Once every span names a real `file:line`, every error golden becomes sensitive to unrelated edits in the source — proven fourteen hours later when a warning sweep moved five goldens. The sentinel was stable because it was fake, and that stability is a fair description of what it cost.
- **A green gate is where a weakened proof hides.** Thirty byte-identical `assert_eq!` softened to `contains` and reported as necessary, caught by reading the diff rather than the count. A contains-check passes on reordered fields, malformed maps, and appended garbage; the probes existed to prove byte-identity. The floor then went *down* — 4271 to 4239 — because 32 test duplicates became identical to their siblings once the "unknown" case no longer existed to vary.
- **A ruling that a state cannot exist removes the vocabulary, not the state.** "There is no nowhere" held where a Rust construction site could stand in for a source location. It did not hold at the wat surface, where a mandatory `Location` meets a death with no wat source — and sixty-two days later the same `<runtime>:0:0` triple was in the tree with a comment calling it honest.
- **Corrections do not propagate to the artifact that carries the claim.** The over-claim was owned within twenty-four hours, in the file of the arc it was made about. The closure document that states it three times has not been touched in sixty-eight days, and it is the document a reader opens.
