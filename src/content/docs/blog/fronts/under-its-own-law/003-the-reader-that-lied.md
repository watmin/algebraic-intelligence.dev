---
title: "The Reader That Lied"
description: "July 2 to August 25, 47 commits: arc 300 set out to convert a 1,173-file corpus off the surface wat bootstrapped with, so wat source would be read by one reader, and then retire the old surface. It never drove a single corpus file. Every time it went to check whether wat's reader was honest it found the reader lying — two reader crates that disagreed about whether é is a letter, one of them panicking on the answer; an EDN reader that refused 1/2 because wat had no rational number; a rewrite tool gated byte-identical against a copy of itself with the identical bug; and, in August, `(read-string \"\\\\a\")` returning a function call, so every codemod written to run the conversion had been told the user wrote something they did not write."
covers: 2026-07-02/2026-08-25
written: 2026-09-08
backfill: true
sidebar:
  order: 3
---

Backfill: this covers 2026-07-02 through 2026-08-25 and was written on 2026-09-08 from arc 300's `DESIGN.md`, its design stones and notes, its `REALIZATIONS.md`, and the commit bodies, all still on disk in `wat-rs` at `3dc4f62b7`. The floor counts are the record's — quoted from commit bodies that say the orchestrator re-ran them — and were not re-run for this post. The head counts, file counts and the two lexer sites below were measured against HEAD in the session that produced the notes.

`wat` has two readers. `crates/wat-reader/` reads wat source — 2,962 lines across its lexer and parser. `crates/wat-edn/` reads EDN — 1,380 lines. The split exists to break a build cycle, and `crates/wat-reader/Cargo.toml:10-13` says so. Arc 300 opened to end it, because wat's claim about itself is that its source is EDN, and if that is true then *one* reader should read it.

The line is `VNVS LECTOR NE DIVIDANTVR`. It was minted in arc 299's interstitial as "one reader, lest they diverge" (`299/REALIZATIONS.md:350`), adopted by 300 at `DESIGN.md:4`, and glossed in 300's own Stone D design as "lest they be divided." Both readings are on disk; neither is the only one. The phrase is load-bearing outside the arc too — `src/edn/bridge.rs:92` cites it in production source.

The plan had two halves and `DESIGN.md:33-35` states them as a law:

> **The law of the build (299 R3): convert, THEN retire.** Two accepted surfaces is still two readers (a compromised enforcement). The one reader stands only when the old surface is torn out of reader/checker/runtime. **Enforcement is unrepresentability.**

Forty-seven commits touch the arc directory between July 2 and August 25, twenty-six of them touching `REALIZATIONS.md`. In that span the arc drove zero corpus files. What it produced instead is everything the preparation was forced to find, and every find is the same shape: a reader being dishonest about wat's own source. Two readers disagreeing about whether `é` is a letter, and one of them panicking on the answer. An EDN reader refusing `1/2` because wat had no rational number. A rewriter that measured a two-character sigil by its twenty-two-character desugared name and ate the source next to it. A rules engine that re-derived every fact each round. And in August, a character literal that read back as a function call.

The builder had named the target before any of it, and the naming is the plainest statement of the arc's thesis in his own voice (`NOTE-identifier-must-become-a-type-before-the-drives.md:7-10`):

> "we will be abandoning colon-quoted-symbols in the very near future… `:wat::core::+` is going to be `wat.core/+`… the colon-quoted thing was a bad idea we haven't circled back to kill."

## July 2 — the law, and the lawgiver's exemption

`DESIGN.md:6-11` states the thesis without hedging: the rust-scheme surface — `:wat::core::if` heads, `<T>` angle generics, `<-`/`->` annotation arrows — is converted to faithful Clojure, which is EDN, so wat source becomes readable by one reader; then the rust-scheme surface is retired, "and divergence has no form."

The first stone, `384f5d6fc`, exists because the lawgiver had exempted itself. The binary already read faithful Clojure in call position. It did not read it in definition position, so a converted `(wat.core/defn user/main …)` parsed and then failed to register (`REALIZATIONS.md:49-53`). wat could read the dialect it was about to impose on everyone, except where it defines *itself*. `384f5d6fc` made a namespaced Symbol head dispatch to the macro the way a Keyword head does (`src/macros/expand.rs`) and made a Symbol def-name register as `:user::main` (`src/runtime.rs`), and its own verification line reads: "faithful `(wat.core/defn user/main …)` runs + entry invoked; rust-scheme baseline runs; whole disk 240 == baseline."

That is the only stone of the five that landed. It is also additive — it made the dual surface real without retiring anything, which the arc's own law calls a compromised enforcement, and which is the state at HEAD sixty-eight days later.

The conversion itself was written as rete `defrule`s, so the rule engine and the corpus it rewrites are the same program. `83b291f9b` states the invariant it runs under:

> rete is always pure in wat: the rules DEDUCE classification facts; the deductions are QUERIED OUT and ACTIONED (transform + I/O) by the drive, OUTSIDE rete. No `:then` ever transforms a value.

The lawgiver had exempted itself in def-position only, and the one stone that landed added a form rather than retiring one.

## July 2 — a gate that checked the tool against a copy of the tool

The purity invariant did not survive contact with the first real consumer, and the record kept the mistake as an artifact rather than sanding it out. `bc8afe76c` files rete's pure right-hand side as a defect in its own commit body:

> **STOP-1:** `build_insert_fact` / `resolve_operand` only handles `?var` / `:field` / literals — not nested expressions. … **The gap is exclusively in the v1 RHS.**

The apparatus then built a four-questions table that scored "extend rete's RHS" as the winner and recommended making the engine impure. The builder did not argue with the table (`REALIZATIONS.md:601-602`):

> "rete is only in memory — the rules are pure — you must consume them and action them — you may not do impure things in rete."
> "whatever deductions we make must be queried out — rete is always pure in wat."

The pure architecture then reproduced the `fix-text` golden byte-identical with `matcher.rs` untouched. `REALIZATIONS.md:634` records what that proved: "The 'gap' was never a gap. rete had everything we needed. The limit I had blamed was the law I should have kept."

Then the drive ran a batch apply and corrupted its output — merged tokens, lost parens, on the quasiquote-dense macro bodies in `Record.wat` and `core.wat`. It was caught by the builder reading a diff in vim, by eye. The automated gate had reported nineteen files byte-identical. `REALIZATIONS.md:742-744`:

> And the "byte-identical to fix-text" gate never caught it because fix-text has the same buggy apply — **two wrongs agreeing.** A same-source diff is NOT a correctness check.

The damage was confined to `/tmp` verification copies; `git status wat/` came back empty, because the drive had never been pointed at the real stdlib. The ledger line the arc kept for itself is "Slow is smooth, smooth is fast. I chased the impressive move … and verified against a bent blade."

The builder's cure was a shape, not a check (`REALIZATIONS.md:736`, `:738`):

> "do you query out N transforms and then apply them in sequence? does doing this change where char offsets are as the contents shift between movements? … is it not better to play this game one turn at a time — observe the board, find the next move, act on it, re-observe the board … until no turns remain … run the rules engine, do one unit of work, re-run, do a unit of work, until there's no work left."
> "we do not have recur — wat is TCO proper."

That doctrine has an origin outside this repository, kept literal in the handoff interstitial at `REALIZATIONS.md:805`:

> "this 'study the board, make the best move, then re-assess' is how i solved AWS IAM's load balancer problem where adding in a physical load balancer was outage inducing … i solved the 'new IAM LBs brick AWS' problem by making it a board game … turn based strategy … while i was on that team, they never experienced any observation of new load balancers coming into service … every move was calculated such that an outage could not be expressed … it took hours to bring a new load balancer into service, but an impairment was never observed … i did this as a (junior) system dev … i tried to show others how to solve problems … i'm still trying to do that."

"Every move was calculated such that an outage could not be expressed" is the arc's own "enforcement is unrepresentability," proven on production infrastructure years before it had a Latin name.

The one-turn fixpoint was the wrong cure, and the disk corrected it across a compaction gap. `056e6f084` found the real cause: reader-macro sigils — `` ` ``, `~`, `~@` — desugar to keyword heads whose `ast-span` covers the one- or two-character sigil while their `ast-name` is the twenty-two-character fully-qualified name, so `old-len = (length name)` overshoots and eats the source next to it. The bug lived in the canonical `:wat::fix::fix-text`, and the rete drive had faithfully replicated it. The fix is a gate that never opens: a `genuine?` predicate asserting `span-len == len`, which a desugared sigil simply never passes. "The absence of an activation IS the skip."

A reader whose reported span does not match the text the user wrote. Seven weeks later, the arc found that shape again.

## July 2 — the cascade that stalled the arc

Building the conversion as a real forward-chaining rete consumer broke the engine, and the layer-by-layer diagnosis at `REALIZATIONS.md:936-940` is legible without knowing rete: 120 `:fix::Node` facts in, `Keyword=64`, `Genuine=48` — the emergent skip working exactly as designed — then `Namespaced=192`, which cannot happen, because `Namespaced` is a subset of the 48. Fourfold duplication. `HeadConv=0`.

Two engine facts fell out. `fire-rules'`, the native prime, is single-pass and cannot cascade a multi-layer network; a minimal three-link chain yields `C=0`. `fire-fixpoint`, the wat oracle, has no truth maintenance — it re-derives and re-inserts every derived fact each round, so a fact multiplies with the round count. Confirmed against Clara, the reference Rete implementation and the engine the builder had run at AWS Shield: Clara `Bad=1 / Ok=1`, wat fixpoint `Bad=2 / Ok=2`, chain `C=2` for both.

Why arc 278's Clara-parity benchmarks had missed it is on the record (`REALIZATIONS.md:950`):

> the **fixpoint path — multi-round, where truth-maintenance is the whole game — was never differential-tested against Clara.** The purity-reduced parity is real for what it measured; it simply never measured this.

The builder pivoted the whole arc on it (`REALIZATIONS.md:952-954`):

> "we thought we hit parity with our reduced scope to impose purity…"
> "if you've found a legit flaw in our rete impl we must address it."
> "this is one of the greatest hits we've had — we pivot to 278 or whatever rete is — we fix it over there — we resume 300 once we get this fixed."

The drive stops here. It never resumes.

## July 3 — two readers, one alphabet

`0d16b83a2` lands red probes against both readers with the same non-ASCII bytes. They refuse them differently. `wat-edn` returns a clean `Err`. `wat-reader` panics, because `lex_symbol` walks bytes and mid-slices a multi-byte character. Two readers of the same source, one of which crashes the compiler on a token the other rejects politely.

`dd5ae8645` fixed the panic and did not fix the divergence. `wat-edn` now accepts `😀`, `é`, `λ` and `foo→bar` as tokens, matching `clojure.edn`. `wat-reader` refuses them with `LexError::UnexpectedChar`, placed after the string and char dispatch so `lex_symbol` never sees a lead byte at all. The commit body is explicit about which half it is doing:

> it does not parse the token (that's wat-edn's job; **the 300 convergence unifies them later**).

The same body notes what is left: "only 1/2 (ratio) remains, deferred (no rational type yet)."

## July 3 — the exemption list was the door

`825cd2261` built the instrument that made the divergence measurable: a committed corpus of 66 EDN inputs, each with `clojure.edn`'s verdict baked in, and a test asserting that wat-edn matches the oracle except on named exemptions. The rule is directional and stated verbatim in the commit — "wat must accept everything clj accepts (clj:OK/wat:ERR = bug)."

The doctrine that came out of it is `AD ORACVLVM, NON AD LIBRVM` — to the oracle, not to the book. wat had been losing parity by faithfully implementing a thirteen-year-old EDN specification document where the running `clojure.edn` diverges from it: `:/` is illegal by the doc and accepted by clj; ratios and `##Inf`/`##NaN` are silent in the doc and read by clj; the doc's grammar is ASCII and clj takes any Unicode symbol. The builder's law (`REALIZATIONS.md:1006`):

> "parity is the only option — non-parity is an illegal state"
> "clj is the oracle."

The record keeps the failure that made the doctrine necessary, unlaundered, at `REALIZATIONS.md:1008`: twice in one session the apparatus enshrined non-parity. It briefed an ASCII-only-token stance that rejects what clj accepts — after running the differential that proved clj reads them — and had a rider add a `NonAsciiInToken` error that would have guaranteed parity could never exist. The catch was one line:

> "is this achieving parity or guaranteeing it cannot exist?"

`a98f19fce` took the ward green at "all but rationals": `##` symbolic values through a `lex_hash` arm, `:/` accepted as `Keyword('/')` while `::foo`, `:foo/` and `:/foo` stay refused because clj refuses them. Two pre-existing tests that asserted the specification document's reading were flipped to the oracle's answer. The tests were wrong; the running reference was right.

What remained in the exemption list was two rows — ratios `1/2` and `-3/4`, annotated "no rational type, deferred." The only thing standing between wat and clj-parity as an EDN reader was a number wat did not have.

## July 3 — the tower was the bill for that one line

Closing that exemption produced stones A and B (`f72ef02b2`), then C1 bigint (`8edfbc14d`), C2 rational arithmetic (`305c7e3d8`), C3 checked overflow (`c872d2d12`), C4 mixed-float contagion (`bbfc347a5`), and C5 comparison and ordering. The rational type was minted in both readers on purpose, so the two layers could not drift apart on it — `crates/wat-reader/Cargo.toml:19-21` carries the note: "Same workspace version as wat-edn's Stone A `Value::Rational` (arc 300 stone A); no version drift between the two layers."

The mechanism that made the tower tractable is R5's, at `REALIZATIONS.md:1104`:

> **a numeric tower is not an engine you build, it is a pattern you install arms into** — deduce the contagion rule against the oracle, prove it on one type, and every remaining type and mixed pair is mechanical.

`+ - * /` are `defclause`s folding a per-type two-ary intrinsic — `i64::+`, `f64::+` — over their arguments, so adding a numeric type is one contagion arm per mixed-operand pair. C1 installs `i64⊕bigint→bigint`. C2 installs `rational⊕i64→rational` and `rational⊕f64→f64`, plus the collapse: ratio arithmetic that reduces to a whole number returns a bigint, because clj's Ratio track is BigInteger-backed. C4 installs `i64⊕f64→f64`. The builder watched the generalization arrive (`REALIZATIONS.md:1091-1094`):

> "whoa… did we just unlock (wat.core/+ 1 2.0) => 3.0? … its installing clauses for mixed types … i gave up on these early on.. i think we revisit those."
> "fuckign rad."

Two of the arms are rulings rather than mechanics. C3 found that wat's i64 `+ - *` used `wrapping_*`, so `(+ i64::MAX 1)` returned `i64::MIN` and reported success — the commit's own words, "a wrong value with no signal (the substrate's own doctrine violated)." The ruling was don't wrap, error: a distinct `RuntimeErrorKind::IntegerOverflow`, and explicitly not bigint auto-promotion, because clj's `+` throws and `+'` promotes and wat takes clj's default. C4 is a documented doctrine reversal — it retires arc 237.8a's "no implicit numeric coercion," on the grounds that 237.8a "rejected all mixed arithmetic as a workaround for the unsolved N-ary problem; this session solved N-ary … so the reason dissolved." Three of 237.8a's tests were flipped. A rule was deleted because its cause had been fixed.

## July 3 — what parity was ruled to mean

`cfef447f9` lands the equality grid as parked work in progress. Its construction is one string comparison doing two jobs: each corpus row is written once in `wat.core/…` form, the oracle row is the same string with `wat.core` swapped for `clojure.core`, both sides render to canonical EDN, and because clj's `pr-str` is type-discriminating — `1`, `1N`, `1.0` and `1/2` all print differently — a single string comparison carries value and type at once.

The builder had asked for it in his own terms (`REALIZATIONS.md:1290`):

> "can you check if we have (wat.core/+ 1 2) functional? … it would be /very cool/ to see a head to head showdown … for all the things — find the flaws — build the grid — prove we've done it — we've been building like mad for 2 months to make clojure on rust."

The numeric tower came back 14/14 byte-for-byte. The grid surfaced sixteen flaws, among them the map writer's missing comma — `{:a 1 :b 2}` where clj prints `{:a 1, :b 2}` — and `get` returning an `Option` where clj returns the value. The apparatus filed the second one as a flaw to fix. The builder reclassified the finding set (`REALIZATIONS.md:1356-1358`):

> "we achieve parity — fight. we do not yield rust's static typing — map get is an #wat.core.Option/{Some,None} — we are not an impl, we are a dialect — exactness is not the objective — structural expressiveness is the parity, not exactness."
> "if a value is optional, it is explicitly optional — we additionally have things clojure does not have like enums, match, result and so on — expressiveness and familiarity is the parity target, not exactness."

R8's coda is the bridge running the other way: the Clojure-side library reads wat's `#wat.core.Option/Some 42` back as a native `#wat_edn.Some{:value 42}` — Clojure consuming a roster it does not itself have. The builder's framing of what that makes the relationship (`REALIZATIONS.md:1428-1430`):

> "this is what we call /upgrade/ — we continue."
> "we do not abandon clojure — it brought us edn — this is how we bridge it to rust."

## August 13 — a diff that would have been flawless and wrong

`7e0409397` opened STOP-0 and stone 300.0 six weeks later, and it stopped the drive one step before it ran. `type_expr_to_clojure_form` spliced parametric type arguments flat, so the conversion would have written the whole corpus into a grammar that had already been superseded. Its own line:

> ★ THE PILOT'S OWN STOPS CANNOT CATCH THIS. They check for UNINTENDED edits; this is an INTENDED edit in a stale grammar. The 300.1 diff would be flawless and wrong.

The blast radius was thirteen fixtures, and the reason it was thirteen and not thousands is that the corpus was clean — because the drive had never run.

The stone was then executed by a different arc. `a9c1f1edd`, on August 20, says why in its own words: "Home is 109 because 109's purpose is killing the dialect we bootstrapped with." Arc 109's `②-i` made the renderer bracket (`0422b67ff`) and `②-i-b` added the `:-` parameterization operator (`c9938cc7b`), both the same day. The form the builder had ruled — "we needed an unambiguous generics form.... `(type [parametrics] & literals)`" — landed as `(wat.type/Vector :- [wat.type/i64])`, readable at `src/edn/render.rs:1560-1700`.

Arc 300's `DESIGN.md:15` and `:86` still record the pre-`:-` spelling, `(wat.type/Vector [wat.type/i64])`. The design that filed a note titled "the type converter emits the superseded form" is now itself stale against the disk in exactly that way. And `src/edn_shim.rs`, which the 300 documents cite by line number throughout, no longer exists — the converter moved into `src/edn/render.rs`, so every `edn_shim.rs:NNNN` coordinate in the arc's paperwork is dead.

Both drives still route through the same door — `wat-scripts/fixes/to-faithful-clojure-rete.wat:227` and `to-faithful-clojure-net.wat:258` both call `:wat::keyword::to-type-form`, which now emits the ruled form. No commit anywhere says "300.0 is done" or "STOP-0 is lifted."

## August 13–25 — the comparator, and a row pinned wrong on purpose

The builder's ruling on the comparator was three fragments long — "we fix the bug — c5 first.", "we fix the bug", "the comparator... we need to fix that... no warts." C5b (`1f1873e19`) found that `(< 9007199254740992.0 9007199254740993)` returned `false`. 2⁵³+1 is not representable in f64, so coercing the exact operand down to a float rounded it onto 2⁵³ and the two compared equal. Both directions returned `false`; only one of those two answers is correct, and it is correct by accident, which is why the gate demands both.

The fix is a door rather than a patch. `src/value/numeric_order.rs` owns `numeric_order(a, b) -> NumOrd { Ord | Incomparable | NotNumeric }` — three states, not two, because conflating "this is NaN" with "this is not a number type" is what let the tables drift. The census found three comparison tables, not one: `runtime.rs:9793`, `runtime.rs:13020`, and `rete/matcher.rs`, whose doc comment had already named its own duplication and cited a line number that had since drifted from `~:10615` to `13020`.

The ruling was EXACT, which makes wat knowingly non-clj-faithful above 2⁵³ inside an arc whose thesis is Clojure faithfulness. The reasoning is on the record: C5's shipped contract already promised "the numeric-value comparison," so EXACT makes the shipped contract true, and the clj-faithful choice "would have edited the contract down to the bug." It ships with its honesty clause attached — the claim that clj agrees above 2⁵³ is carried unverified, because there is no JVM in the loop by standing direction: "i do not wish to have the jvm requirement in our CI tooling."

C5b also deliberately captured a wrong answer in its own gate, row 12, with a comment saying so: NaN mapped to `Ordering::Equal`, so `(<= 1 NaN)` was `true`. C5c (`e718e2b8b`) is that row, and nothing else. Its body: "Today that row is the thing that had to change, and it was findable in one grep instead of a rediscovery. **Flag-don't-fold paid for itself inside 24 hours.**"


`=` and `not=` were left alone. `(not= 1 NaN)` is still `true`, IEEE's one exception — "that was gate row 7 and the trap for an over-eager fix."

## August 25 — a character literal that read back as a function call

The last stone started as a codemod guard and became the arc's own counterexample. The builder's question was four words long (`DESIGN-STONE-D-char-joins-the-literal-lane.md:7`):

> "how can there be a line of code with no line?"

The measurement, verbatim from `d3431b07b` and `39c098738`:

```
(:wat::core::read-string "\\a")
  BEFORE  #wat.core.ReadOutcome/Forms [((:wat.core/char/of "a"))]
  AFTER   #wat.core.ReadOutcome/Forms [(\a)]
```

A char was first-class at both ends — `wat_edn::Value::Char(char)` in the data layer, `Value::wat__core__Char(char)` in the runtime — and absent only in the middle, where the parser desugared `\a` into a three-node call. Every other scalar owns a `*Lit` variant; `\c` alone did not. So every wat program that reads wat — every `wat-fix` codemod, `wat/lint.wat`, `wat/grep.wat`, including the codemods written to run 300's own conversion — had been told the user wrote something they did not write. `DESIGN-STONE-D…:44-46` states why the stone is 300's and not a new arc's: "A literal the one reader silently rewrites into a call is that law's own counterexample." The gate that shipped with it, `tests/wat_lang/gate_char_literal_is_a_literal.rs:7`, says the same thing in one line: "Arc 300's law is `VNVS LECTOR NE DIVIDANTVR`; that desugar was its counterexample."

The gap had been shipped four times as a fact of the language, three routing around it and one refusing to cross: `parser.rs:404` performed the desugar; `runtime.rs:21366` explained that "WatAST has no CharLit variant; render as `(:wat::core::char/of "c")`"; `closure_extract.rs:1999` said "Char is portable: encode as a `char/of` call"; and `wat_edn_bridge.rs:816` returned `Edn::Char(c) => Err(UnsupportedEdnForm)`, with `:540` listing Char under "no WatAST counterpart." Every one of those comments is accurate. None of them asks whether the fact should be true.

Two further comments rested on the hole rather than routing around it. `edn_shim.rs:3996` and `:4651` both asserted that `watast_to_edn` and `edn_to_watast` are a total bijection — true on the image, "and true there PRECISELY BECAUSE no WatAST can produce an `Edn::Char` today. The hole is what keeps the claim alive." And arc 300 had looked straight at the desugar and cited it as precedent: Stone B's design says Rational follows the Int/Float precedent, "NOT the Char/Uuid precedent (desugar → char/of)," filed as a deliberate divergence from the newest scalar precedent. `d3431b07b`: "Seen, cited, diverged from — as a legitimate alternative design, never as a hole. **Being NEWEST is what made it read as authoritative.**"

The non-vacuity control then caught the gate's own vacuity. Restoring the desugar and re-running turned only one of three tests red; `a_char_literals_span_covers_exactly_its_own_text` stayed green, because it read the top-level form's span, which under the desugar is the List's span, and that really is two columns wide. The phantom lived one level down, on the synthesized Keyword child. The test's doc comment had claimed it guarded the regression, and was corrected to say what the control actually measured.

Measured deletions, by the striker's run: the phantom-span census 1461 → 1411, with `char/of` gone from it entirely, having been 50 of those; the type cascade 19 → 0 in one pass, all `E0004`, twelve files, roughly thirty-one sites. Floor 5046/5046, zero failures, clippy zero. And a third layer the design had not known about, found by the rider: `HolonAST` already carries a native `Char(char)` leaf, so `CharLit` lowers directly where `RationalLit` and `BigIntLit` lower to a rendered string, "strictly better than the two precedents it was modelled on."

The builder's ruling, on being shown it (`DESIGN-STONE-D…:3-4`):

> "wow — that's a crazy flaw to find this late in wat's maturity — make it."

## At HEAD, 2026-09-08

The complete set of `300.x` stone commits in the repository is three: `384f5d6fc` for 300.1, and `bc8afe76c` plus `83b291f9b` for 300.2 as a probe and a rules rewrite, run against a `/tmp` copy with `wat/source.wat` explicitly untouched by its own body. Stones 300.3, 300.4 and 300.5 have no commits. `wat/core.wat` carries 800 `:wat::core::` occurrences in head position, against the DESIGN's baseline of 560. `grep -o 'wat\.core/'` returns two hits in that file and both sit on one comment line at `wat/core.wat:2120`, so the faithful surface has zero code sites in that file. The corpus that drive must eventually convert has grown from 1,173 `.wat` files to 1,888.

And the two readers are still two. `crates/wat-reader/src/lexer.rs:536` refuses a non-ASCII character outright; `crates/wat-edn/src/lexer.rs:281` decodes the UTF-8 scalar and accepts it. `dd5ae8645` promised that "the 300 convergence unifies them later." Later has not arrived, and `NE DIVIDANTVR` is therefore not a slogan you have to grade on intent — it is two files, and today it measures divided.

An arc that shipped one additive stone and drove no files still produced a live differential ward against `clojure.edn`, a truth-maintenance bug in the rules engine that a parity benchmark had certified around, a numeric tower down to IEEE NaN policy, two comparator bugs, a self-superseding design document, and a reader that had been lying about character literals since before anyone thought to ask. The migration was the plan. The audit was the product, and it was only ever an audit because the arc kept trying to check whether wat's reader told the truth about wat.

## Likely Contributions to the Field

- **Two readers of one language diverge on the axis nobody registered as a decision.** Not the type system and not the evaluation rule — the alphabet. One reader accepted `é` in a symbol and the other panicked on it, because one iterated characters and one iterated bytes. Any system that ships a second parser for its own source has this exposure, and the divergence will not be where the design review looked.
- **A gate cannot see the subject it shares a defect with, and only a control says which gates are blind.** The batch drive was gated "byte-identical to `fix-text`" while `fix-text` carried the identical span bug — nineteen files reported clean, output corrupt; two wrongs agreeing is a same-source diff, not a correctness check, and the honest gate is a round trip. The same blindness has a cheaper tell: restoring the desugar turned one of three span tests red, which is how the other two were revealed as vacuous — they read the top-level form's span while the phantom lived one level down on a synthesized child, under a doc comment claiming a guarantee it had never provided.
- **A synthetic benchmark tests the shape you thought to write; a real consumer tests the shape the problem demands.** The rete engine passed Clara parity because the parity runs were single-pass joins. The first multi-layer cascade found that the fixpoint path re-inserts every derived fact each round. The parity claim was true for what it measured and silent about what it did not.
- **A deferred type is a bill, and it comes due in full.** wat could not reach parity as an EDN reader because it had no rational number, and the exemption sat in the ward's own list saying so. Closing that one line produced bigint, rational arithmetic, checked overflow instead of silent wrapping, float contagion, exact cross-type ordering above 2⁵³, and an IEEE NaN policy.
- **A numeric tower is a pattern you install arms into, not an engine you build.** With `+ - * /` as clause-dispatched folds over a per-type two-ary intrinsic, a new numeric type costs one contagion arm per mixed-operand pair — which is why mixed int/float arithmetic, abandoned years earlier as large, turned out to be two arms.
- **Being the newest precedent is what makes a hole authoritative, and documentation is how it survives.** `\c` desugared to a function call, and this arc's own Stone B cited that desugar as the newest scalar precedent while deliberately diverging from it. Four accurate comments described the gap as a fact of the language and none asked whether it should be true — including two that documented `watast_to_edn`/`edn_to_watast` as a total bijection, a claim that held only because no `WatAST` could produce an `Edn::Char`. The missing feature was the proof.
- **A campaign can be worth more for what its preparation found than for what it shipped.** Arc 300 set out to migrate 1,173 files and drove none of them, while the corpus grew to 1,888. Every artifact it produced came from checking a premise it needed before the migration could start, which is an argument for keeping the preparation's findings as first-class output rather than as overhead against a deliverable that never landed.
