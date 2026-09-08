---
title: "Laws Prove Self-Consistency, Not Usefulness"
description: "August 25–27: a generative testing library for the rules engine, minted at 02:05 and in the standard library by 17:52 the same day. In between it found three live engine defects the existing corpus could not see, because that corpus compared facts a normaliser had already deduplicated. Declared feature-complete at 21:20, it failed a seventeen-ward audit at 21:53 — and the census that decided the question was not a defect count but a call-site count: eleven mutation-proven laws, and seven of ten verbs nobody was calling."
covers: 2026-08-25/2026-08-27
written: 2026-09-08
backfill: true
sidebar:
  order: 4
---

Backfill: this covers 2026-08-25 through the small hours of 2026-08-27 and was written on 2026-09-08 from the 34 commit bodies carrying the strand's own `fuzz:` and `gen:` prefixes, the gen vigilia's work list, and `wat/gen.wat` and `docs/GENERATIVE-TESTING.md` as they stand at the week's cutoff — all still on disk. Nothing below was re-run: every card count, millisecond and violation number is quoted from a commit body. That 34 counts a subject prefix and not the strand's footprint — another handful of `docs:` commits are strand work and carry no prefix, which puts the real number nearer 40 of the week's 214.

`wat-gen` is a generative and property-testing library written in wat — the language's own Lisp, not its Rust substrate — and its target is `wat-rete`, the rules engine this front is about. It was minted as a scratch file at 02:05 on August 25, `wat-scripts/lib/gen.wat`, and it was `wat/gen.wat`, in the standard library, fifteen hours and forty-seven minutes later.
<!-- rune:consonare(register) — the all-caps runs below are verbatim commit-body emphasis, retained rather than down-cased because editing a quote to fit the page's register falsifies the quote. The density is higher than any gold anchor carries; the quote frames are what license it. -->

<!-- rune:consonare(solo) — August 25 is a solo build stretch. The builder's rulings on this strand begin at 00:36 on the 26th and every one of them is quoted below; the absence of a quoted collaborator across the 25th is the record's shape rather than an erasure. Declared rather than left silent, because a reader cannot otherwise tell an unsteered day from a dropped exchange. -->

## August 25, 02:05 — a generator is an indexed set

`eebf75374` states the design in two lines and spends the rest of the body defending them:

> A generator is an INDEXED SET, not a seeded random source:
>
>     Gen<T> = { card : i64,  at : i64 -> T }
>
> That single choice is what the design turns on, and it diverges deliberately from the QuickCheck / clojure.test.check lineage it borrows from. Because `at` is a total function of an index, three separate pieces of machinery there collapse into one operation here: **ENUMERATE is 0..card, SAMPLE is any i < card, and SHRINK is index arithmetic rather than tree surgery.** A failing case also gets a PERMANENT name — a test.check seed is meaningless once the generator changes, while a coordinate still dials in the same case.
>
> The cost, stated in the file: **every dimension must be bounded.**

For differential testing against a superlinear oracle the bound is a feature. Two measurements taken that session say why. The `$oracle` — the same engine written in wat, whose job is to disagree with the native fire path — runs at roughly O(n²): 31 facts in 11.5 ms, 556 in 0.96 s, 2236 in 15.3 s. So cases trade fact volume for shape diversity, and the commit says what that buys: "A join defect shows at 3 facts as readily as at 3000."

The second measurement is the reason the library exists at all. The engine's existing differential axes compared **derived facts**, and `production_delta` deduplicates those by value, "so a differential over derived-fact counts reads identically on a correct engine and one that multiplies tokens. **37 of the 57 queries in the where-family corpus have that shape.**" Every query the new fuzzer generates carries the rule's own LHS, so `query` reads beta rows — below the dedup.

One type decision came from the checker rather than the author: `defstruct` and not `defrecord`, "because a Gen carries a function: the containment rule (arc 293.W) holds that a pure aggregate must survive an EDN round-trip … and a generator never crosses one. **The checker named that itself.**" The birth commit is mutation-proven before it is anything else — clearing `leading_emitted` per round in `fire/delta.rs` reddens it at 36 of 288, and the failure set localizes the defect without help.

## 02:25 — the library that tests things had no test

Twenty minutes later, `a1fbda88a` turned the instrument on the instrument:

> wat-gen was NOT mature, and the evidence was one grep: of its six verbs, **FOUR (gen-ints, gen-fmap, gen-digit, gen-shift) had zero call sites anywhere in the repo, and the library had no test of its own. A library that tests things, untested.**

The law it added is the one the whole design rests on:

> **L4 IS THE ONE THAT MATTERS.** Everything the design claims — that ENUMERATE, SAMPLE and SHRINK are one operation — rests on `at` being a **BIJECTION** from 0..card onto the coordinate space. If it is not injective, enumeration silently visits some tuples twice and misses others, and **a fuzzer reporting "288 cases, 0 mismatches" is lying in a way nothing else here could detect.**

Proven by mutating `gen.wat` twice: `gen-shift` made a no-op yields 118 violations, `gen-digit` on base+1 yields 186, and the restored file checks 255 with 0. The gate went in beside `hunt_tooling_selftests.rs` on a stated principle — tooling that other gates depend on must itself be gated, or a silent break in it turns every downstream gate green-and-meaningless.

Then the commit refused its own good news: "STILL NOT MATURE, and the ledger is in the reply, not hidden here" — no elements, no one-of, no such-that, no bounded collections, no heterogeneous tuple, no sampling driver, no shrinking, no overflow guard on card.

## 11:18 — eleven laws, and seven verbs nobody calls

`9ec12c34b` answers a maturity question with a count instead of a judgement, and the count goes against the author:

> Asked whether wat-gen is mature, I measured instead of judging. The census:
>
>   `gen-coords`, `gen-check`, `gen-such-that` : 1 real consumer each
>   the other SEVEN                            : 0
>
> Eleven laws over 296 points, every one mutation-proven, is evidence the library is **SELF-CONSISTENT. It is not evidence it is USEFUL, and that distinction is the finding.** I added combinators because the QuickCheck tradition has them, then proved them against laws written by the same hand — **a closed loop with no consumer pulling. That is the shape the vigilia exists to hunt, reproduced while writing the doc meant to prevent it.**

`gen-lift3` is the demonstration: it had shipped with zero laws *and* zero consumers, on the strength of "the tradition has a ternary lift". "**Only counting caught it.**"

The repair is not a feature. It is a consumer — the rete fuzzer made to use the library rather than hand-roll around it, because its skip logic was a `such-that` in disguise, a fact noted when the combinator was written and then not acted on. That substitution buys a property the reference lineage structurally cannot have: filtering an opaque random source means retry-and-discard, which can give up and skews what survives, while filtering a finite indexed set yields another finite set whose size is known before the run. "**Exact filtering makes the cardinality the denominator.**"

The commit closes on an order: "WHAT IS NEEDED IS NOT FEATURES, IT IS CONSUMERS."

## 12:46 and 15:07 — the tool starts paying

The first widened run, `a39c28e10`: 504 cases in 3.8 s, 22 mismatches, every one at the accumulate shape, decomposing into exactly two defect families, both silent.

```
family A  LEADING accumulate                        native = depth+1, oracle = 1
family B  fact cond + accumulate + a SECOND `where`  native = 0,       oracle = 1
```

Family B's minimal pair is two queries that differ by one trailing, trivially-true `where`: qB1 agrees at 1, and qB2 drops native to 0. Neither family was reachable from the existing corpus, for the reason the design commit had named ten hours earlier — the accumulate axes compare derived facts, and `production_delta` dedups those by value, so "**a rule deriving one distinct fact reads identically whether its token passed once or four times.** Comparing beta rows instead is the whole reason this fuzzer exists, and it is now the reason it found something."

Neither was fixed that afternoon: "NOT FIXED — audited and accumulated, per the standing method." The probes assert *correct* behaviour and are `#[ignore]`d, so a fix makes them pass and un-ignoring them is the completion step, and the gate ships as a ratchet pinned at 22 rather than at zero. The argument is written down — "Asserting zero would redden the floor and block unrelated work; deleting the accumulate shape to keep a gate green is the trade this codebase refuses. Movement either way is a red test demanding an explanation." It is also the shape an ignore pile grows in, and what separates the two is that a ratchet fires on movement in either direction where a pile fires on neither.

Two hours later, `03e34f0f3` found the third: `:not` over a class that exists only by derivation.

```
r1:  :when [(S1 (?k <- :k))] :then [(S2 :k ?k)]     ;; S2 exists ONLY by derivation
qC:  :when [(:wat::rete::not (S2 (?s <- :k)))]

no chain, S2 absent      native 1  oracle 1   agree
chain present, S2 derived native 1  oracle 0   DIVERGE
control: is S2 there?     native 1  oracle 1   both derived it
```

> **BOTH ENGINES DERIVE THE FACT. ONLY THE ORACLE'S NEGATION SEES IT.**

The failure set reads as a diagnosis rather than a symptom list: 54 of 76, "**ALL at depth >= 1 and NEVER at depth 0** — exactly the dependence stratified negation should have. **That is enumeration paying a dividend random sampling would not.**" Family C also carries the one suspension of the arc's standing rule that native disagreeing with the oracle means native is wrong, because whether a `defquery` is meant to stratify like a `defrule` had not been established — and if queries are deliberately un-stratified, the oracle is the one that is wrong. The ratchet moved 22 → 76.

It moved to zero on the 26th at 15:56, `b2939f12b`: families A and C closed, and they were one root.

## 17:52 — promotion, and a wrong reading with no form

`8eeff8adc` moved the file into the standard library on the `wat/grep.wat` precedent — "a MOVE of proven code with the numbers that earned it." The move also closed a live defect. In scripts the library had defined `:user::Gen` and `:user::ints`, "**squatting in its own CONSUMER's namespace**, where any program wanting a record named Gen would collide." Scripts cannot define under `:wat::` — the reserved-prefix gate admits only baked sources — so promotion was the only available fix.

The second change in `8eeff8adc` turns the failure surface into a value. The scratch version raised on an empty generator, which is the defect the library's own no-hidden-failures law forbids, written hours after reading it. The reasoning then goes a level past the obvious:

> But a nicer raise was never the fix: the hazard is that `violations = 0` reads as success whether the property held at ten thousand points or was never applied at all … `Checked` carries BOTH numbers, so a violation count cannot be extracted without the point count arriving in the same arm — **THE WRONG READING HAS NO FORM.**

## 21:20 — feature complete, established by expression

`e9a5e0156` closed the surface, and the method is the point: completeness was established "by trying to EXPRESS everything left in the QuickCheck / test.check surface rather than by reading the built list and feeling done." Nine rows came back expressible. One of them is a consequence of the indexed-set design rather than a feature added to match:

> **RECURSIVE GENERATORS DESERVE THE NOTE.** test.check needs a `recursive-gen` combinator because its generators are opaque. Here a generator is an ordinary value returned by an ordinary function, **so recursion is just recursion** … **Having `bind` bought recursion for free, which is the strongest evidence that `bind` was the right and last structural gap.**

The commit's refusal list applies 11:18's lesson nine hours after it landed: one-line conveniences — `pure`, `bools`, `set-of` — were not added, because "**Adding them speculatively is the closed loop this library already fell into once.** If a consumer writes one twice, it earns its slot."

## 21:53 — seventeen wards, thirty-three minutes later

`c43473e38`: "curare: the vigilia against `wat/gen.wat` — 17 wards, and the tooling failed its audit." The body opens "NOTHING IS FIXED; this is the audit." Seventeen wards were cast that night; `circumspicere` was cast the following day, which is why the file's own header counts eighteen.

The first finding lands in the comment written four hours earlier. `(ints 5 2)` produces a negative cardinality, card −3, which clears the emptiness guard, and `check` reports `Checked(-3, 0)` for a property that always fails. "**This refutes, in that function's own comment, the claim I wrote there: 'the wrong reading has no form'.**" And a negative card does not merely produce a vacuous pass — `one-of` over `[card -2, card 3]` yields card 1 and `at(0) = 102`, so two of three real points vanish with no signal.

The rest, compressed: `lift2` and the record/coords path disagree at index 6, `Pair{0,12}` against `Pair{0,10}`, and L10 was written as the tripwire for exactly that drift and drives 0..5, stopping one short. `test-shrink-index` is passed by an identity implementation, mutation-proven. `record` re-evaluates its generator arguments once per point rather than "TWICE" as its comment claims — 1577 ms against 30 ms on the same 800-point space, 52×. From `secare`, a finding one layer down in the Rust: `is_pure_type`'s `Parametric` arm never consults the `TypeEnv`, so `(Gen :- [T])` passes the purity gate, "a Gen enters a defrecord and crosses the wire as `:at #wat.core/fn nil`. **card honest, at dead.**" And in the prose: a claim false since 2026-07-05, a header citing two files deleted the same day, four disagreeing law counts none of which is 23, six error strings naming retired verbs, and three shipped items still sitting on the list whose own header reads "There is one list. It is this one."

The class above the findings is stated as a failure mode:

> **FM 24 — per-component proofs that never cross a SEAM.** Every gen defect sat between two things built separately and tested separately; **nineteen laws, not one crossed a seam, and every signal a suite can emit said "covered."** The cure is a law per JOIN, asserting the SUT's reported denominator rather than re-reading the struct, and mutating to the DO-NOTHING implementation — **an identity passes far more gates than a scramble.**

One finding in that cast outranks every gen finding and is not about gen at all. `excusare` reported `cargo test --test kernel` in debug at 569 failed / 16 passed, all on one `debug_assert!` at `src/types.rs:598`. Release is clean, and `scripts/floor.sh` runs `--release`, so the floor cannot see it by construction. The commit marks it "Unverified by me. First thing to check on resumption," and the record inside this window does not say how it came out.

The cast's closing line is five words of doctrine: "`circumspicere` WAS NEVER CAST. Cast it first."

## August 26, 11:13–11:55 — the builder corrects the diagnosis, then draws the line

`6570746e5` opens the day by contradicting a ward. The cast had reported `gen.wat` clean; it was not, "nothing said so, and the one cast that looked directly at it got the number wrong. **A GATE WOULD HAVE BEEN RIGHT WHERE A READING WAS NOT**." The commit's own first diagnosis then gave way under the builder:

> "format is absolutely a pure func?.... we definitely forgot to do whatever bitflip for this...."

He was right on the premise, and the conclusion resting on it broke open. The refusal was about `format` being a macro rather than about purity, and its runtime twin `:wat::core::string::interpolate` was already on the allow-list, documented for exactly this case, and already used in the same position at `wat/core.wat:704`. "So the site was fixable all along, and 'false positive' was my error, not the rule's."

The second call that morning stopped a gate from being built:

> "i don't know if wat-lint is functional yet"

Grounded rather than obeyed: arc 277 is open, with no INSCRIPTION and no SCORE, and "**A gate belongs to the arc that owns the rules it freezes, while that rule set is still growing.**"

At 11:29 the doc left the arc for `docs/`, on his read of it — "this one is very likely worth of being in docs/ -- we need to polish it... but this one feels very compelling" — and `26cb50517` diagnosed why four separate findings were one thing: the file was arc narrative, and "narrative goes stale where a reference does not." The example the commit picks costs a reader working code: the doc said "gen-check REFUSES an empty generator ... now RAISES", when it returns `CheckOutcome::EmptySpace`, "and the file **contradicted itself 110 lines later, leaving BOTH standing.** A reader stopping at the first writes a raise-handler for an API that returns a value."

At 11:55 the builder set the bar the strand is named for, in `37f04c402`:

> "i think i saw everything being very basic shit like single char strings and ints... i want to see how expressive we can make this... make this a desireable test time tool... **i think we also need a line in the sand that determines when generative tests are inadequate... not theatre, real problem solving.**"

## August 26, 12:40–13:50 — the corpus, and two suppressions that were refused

> "let's run the doc review vigilia on the generative doc .... make sure its polished."

Seven wards against `docs/GENERATIVE-TESTING.md` at 12:40, `fddedc205`, and the doc's own headline claim came back false.

Seventeen minutes later he read the corpus the doc ships and named what an agent would learn from it:

> "it feels like its still heavily int focused - my concern is that agents will unfairly prefer testing with ints rather than something meaningful for a problem domain.... i was expecting to see something like... a lazy seq thing that generates random text.. or composes text from different things... or a bounded range that a user defines .... being able to pass in a param generator who conforms to some arg-spec but has its own bounded values that's bespoke to some condition."

`6d96ce127` counts rather than defends: of five patterns, two were bare `i64`, one was an enum whose payloads were ints, and only two touched strings at all — with a single three-word pool. "**An agent copying that corpus would reasonably conclude ints are the idiom.** `ints` is the easiest generator to write and almost never the one your problem needs."

At 13:50 `6511e91a0` put the exemplar question to the library and answered it, and the front's first post carries that exchange. What it does not carry is what the substrate did to the gate that shipped alongside it:

> ⚠ **THE SUBSTRATE REFUSED THIS FILE TWICE, AND BOTH TIMES IT WAS RIGHT.** `no_inlined_wat_in_tests` and `no_inlined_edn` both went red on it. I reached for the rune — the established exemption, used in 10+ files — and `no_inlined_edn`'s own doctrine ruled against me in as many words: "A literal that merely LOOKS EDN-esque but is genuinely not EDN is NOT a rune candidate — that is a lint false positive to fix by RESTRUCTURING THE CODE ... never by writing a reason and moving on."

Both suppressions were written and both were deleted, replaced by shapes that do not need them. `format!("(:wat::core::{form} :wat::gen::")` became a character check "which says out loud what the literal only implied: this must be a DECLARATION HEAD, not a mention in prose". `format!("`{name}")` became a test for a markdown code span whose first token is the name — because a backtick is quasiquote in wat, so the literal it replaced was a well-formed form and the lint was reading it correctly. The file ships with zero runes.

## August 26, 18:51 → August 27, 00:13 — the tool turned outward

Keyword was absent from the scalar fuzzer, and at 18:51 the builder said so:

> "huh.... feels like a miss...."

It was a miss, probing it properly turned up something worse than the absence, and `fc949d002` retracts a claim it had already committed under a heading that says so: "MY COMMITTED CLAIM WAS FALSE."

At 19:47, `17d010638` added the property that needs no second engine at all:

> **PATH INDEPENDENCE — running a program of inserts, retracts and fires, then firing, must equal firing ONCE over the multiset that program ends with.**

Four numbers per case — native and oracle, interleaved and one-shot — so a coordinate separates three independent failures rather than one, including the case where the oracle itself is path-dependent, "**which would make the reference wrong and every other fuzzer's agreement suspect.**" Card 1372, violations 0. The one-shot side needed a model of the final fact multiset, and the commit refuses to write one: replaying the same program with the fire op turned into a no-op leaves exactly that multiset, so "**the session's own facts field IS the model** — a model vector would have to re-implement insert's append and retract's remove-all-equal and would then be **a second thing that can be wrong.**"

The strand closes at 00:13 on the 27th, `8c71e0f2e`, with nested combinators driven over an exhaustive truth table — eight compositions across all eight worlds, 64 cases in 0.5 s — and then run against Clara, the Clojure engine, 24/24 byte-identical. The commit states why that third check is not ceremony, and it is the front's oracle argument arriving from the other direction: entry E, the same day, was the native path and the `$oracle` "**transposing identically and agreeing perfectly on the wrong answer. Two engines agreeing proves nothing when they share an assumption.**" The leaves in these cases bind nothing, deliberately, so "the row count IS the truth value — **the one place in these fuzzers where a count is the right instrument rather than a blind one**, and the header says why."

---

What the substrate got in three days is not a test library. It got a tool whose usefulness has a number anybody can run — call sites — standing next to the number that had been quietly substituting for it. Eleven mutation-proven laws over 296 points is a statement about a library's agreement with itself, and it is compatible with seven of ten verbs that nothing in the repo calls. The word this front is named for goes through the same conversion in the same three days: a label describes what you built, and a bar is something a thing can fail. This one failed its own, thirty-three minutes after being declared finished, and the audit that failed it was cast by its author.

## Likely Contributions to the Field

- **A generator as an indexed set collapses enumerate, sample and shrink into one operation.** `Gen<T> = {card, at}` with `at` total over `0..card` makes enumeration `0..card`, sampling any index, and shrinking arithmetic on the index — and gives a failing case a permanent coordinate instead of a seed that stops meaning anything the moment the generator changes. The stated cost is that every dimension must be bounded. It also changes what filtering can promise: retry-and-discard over an opaque random source can give up and skews what survives, while filtering a finite indexed set yields another finite set, so exact filtering makes the cardinality the denominator.
- **Laws prove self-consistency; only consumers prove usefulness.** Eleven mutation-proven laws over 296 points, three verbs with one real consumer each, seven with none, and a ternary lift that had shipped with zero laws *and* zero consumers on the strength of the tradition having one. Only counting caught it, and the corrective is an order rather than a backlog: what is needed is not features, it is consumers.
- **A comparison that deduplicates cannot see multiplicity, and the normaliser is where the defect hides.** The engine's existing differential compared derived facts, which are deduped by value, so a rule whose token passed four times read identically to one whose token passed once — and 37 of 57 queries in the corpus had that shape. Reading beta rows instead is what turned up three live engine defects in ten hours. This transfers to any differential test whose comparison passes through a normalising step.
- **Making a wrong reading unrepresentable in one dimension does not make it unrepresentable.** `Checked{points, violations}` was built so a violation count could not be extracted without its denominator arriving in the same arm — a real improvement over a raise — and four hours later a negative cardinality produced `Checked(-3, 0)` and passed. The refutation landed in that function's own comment, which is where the claim had been written.
- **A per-component proof does not cross a seam, and every signal a suite can emit says "covered".** Nineteen laws, none of them spanning a boundary between two separately-built, separately-tested parts, and every defect the audit found sat exactly on such a boundary. The prescribed cure is specific enough to lift: a law per join, asserting the system's own reported denominator rather than re-reading the struct, mutated against the do-nothing implementation — because an identity passes far more gates than a scramble.
- **Two engines agreeing proves nothing when they share an assumption — here is the incident behind the claim.** The front already holds that an oracle has to be written in the other language. On one day the native fire path and the same-language `$oracle` transposed identically and agreed perfectly on a wrong answer; the tie was broken by Clara, a third-party twin in Clojure, at 24/24 byte-identical. A same-language reference built to disagree can still inherit the premise that makes both wrong.
