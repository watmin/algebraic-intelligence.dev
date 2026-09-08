# Working notes — exemplar-004, "the generative strand"

**Status:** raw notes, not a draft. Written 2026-09-08 by a reader working the
`wat-rs` exemplar-front backfill. Everything below is grounded against
`origin/grok-rete` in `/home/watmin/work/holon/wat-rs`, read this session.
Nothing in `wat-rs` was edited.

**Window:** 2026-08-24 → 2026-08-30 (merge-base `de827fb4c`, cutoff `e6858e858` at
2026-08-30 23:54:11 −0700), 214 in-window commits.

**Verdict: this unit survives and it is the cleanest of the three.** It has a hard
boundary (one library, one file, six days), a beginning and an end, and almost none
of it is spent by `001`. It is also the only one of the three that is a *building*
story rather than an *auditing* one, which the batch needs.

**Title and song-drop are ALWAYS the builder's call.** Working images below, not
proposals.

---

## ⛔⛔ THE BRIEF'S CENTRAL CLAIM IS FALSE ON THE DISK. Do not build the post on it.

The brief says of `6511e91a0`: *"It is where the word **exemplar** enters the
corpus."* **It is not, twice over.**

**1. "exemplar" has been in this repo's commit bodies since at least 2026-05-27 —
three months earlier, and on `origin/main` too.** Measured:
`git log origin/grok-rete -i --grep='exemplar'`, oldest first:

| commit | author date | subject fragment |
|---|---|---|
| `7d5fbcbdb` | **2026-05-27 17:48** | *"arc 240 Stone 240.3a — WorkUnitLog.wat recipe **exemplar** (FM 2-bis proven)"* |
| `30fcd2d1c` | 2026-06-06 21:05 | *"first value/ unreachable **exemplar** + gate hardening"* |
| `e35badfa5` | 2026-06-22 13:27 | *"special-form doc-contract — if/let **exemplar** + enum-marker flip"* |

`7d5fbcbdb`, `e401c1833`, `fef2c8d97`, `97c6ace85`, `458ad8ade` all appear on
`origin/main` as well, so this is not a `grok-rete` artifact.

**2. Even inside the window, `6511e91a0` is not first.** The first in-window use is
**`78e344bac`, 2026-08-26 00:36:59** — *thirteen hours earlier* — and it is also a
builder quote, also about wat-gen:

> Builder's ruling: "we polish the gen testing doc - after - the wat-gen tooling is
> deemed an exemplar - code, then docs."

⚠ **`001` carries a softer version of the same error** and it should be checked
before this post ships: `001` §"August 26 — the word arrives as a question" says
*"The word exemplar does not enter this corpus as a designation. It enters as the
builder asking whether something already is one."* The three earlier uses above are
**exactly designations** ("recipe exemplar", "unreachable exemplar", "if/let
exemplar"), and the first in-window use is a **ruling**, not a question. Flag it.

### What IS true, and it is better

The generative strand is where **"exemplar" stops being a label applied to a thing
and becomes a standard a thing has to meet.** That is groundable and it is the
post's real claim:

- Both of the week's builder rulings that use the word land on **wat-gen**, not on
  rete: `78e344bac` (2026-08-26 00:36, *"deemed an exemplar"*) and `6511e91a0`
  (2026-08-26 13:50, *"do we believe that wat-gen is now an exemplar?"*).
- The arc's rete-exemplar **initiative** is minted four days downstream, at
  `9d05bd4b7` (2026-08-30 02:08): *"curare: re-point the breadcrumb at the exemplar
  initiative"*, whose body reads *"The breadcrumb now leads with the INITIATIVE
  (mature wat-rete into an exemplar) rather than with the last thing done."*
- In-window, `grep -ci exemplar` over the 214 bodies returns **20 lines across 15
  commits**; the two earliest are the two wat-gen rulings.

**Write it as: the standard was invented on a different artifact, and rete inherited
it.** That is a claim the disk supports and it is a stronger opening than the one the
brief proposed.

---

## ✅ "Exactly 34 commits" — confirmed, and here is what the number counts

`git log origin/grok-rete ^origin/main --no-merges`, author-date filtered to
`[2026-08-24, 2026-08-31)`, subjects matching `^(fuzz|gen):` → **34**. Broken out:
**16 `fuzz:` + 18 `gen:`**.

**State the population when you use it**, because three other numbers are also true
and mean different things:

| number | what it counts |
|---|---:|
| **34** | commits whose subject begins `fuzz:` or `gen:`, in window |
| **19** | in-window commits that touch `wat/gen.wat` (which only exists after 17:52 on the 25th) |
| **~6 more** | in-window `docs:` commits that are strand work but carry no `fuzz:`/`gen:` prefix — `2946d23ff`, `a20f063a6`, `26cb50517`, `fddedc205`, `e9a5e0156`, `c43473e38` (a `curare:`), `6d96ce127` is `gen:` so already counted |

So **34 is a subject-prefix count, not the strand's footprint.** The strand's real
footprint is roughly 40 of the week's 214 commits, and the honest sentence is *"34
commits carry the strand's own prefixes; another handful carry its docs."*

Other numbers grounded at the cutoff commit `e6858e858`:
- `wat/gen.wat` — **992 lines**, **27** top-level `(:wat::core::defn|defmacro` forms
  (the doc's "27 verbs" table is exactly right).
- `docs/GENERATIVE-TESTING.md` — **592 lines**.
- Born as `wat-scripts/lib/gen.wat` at `eebf75374`, **2026-08-25 02:05**; promoted to
  `wat/gen.wat` at `8eeff8adc`, **2026-08-25 17:52**. **Fifteen hours and forty-seven
  minutes from first commit to stdlib.**

---

## ⛔ The conflation hazard — the one that lands on THIS unit

**Defect families A and C are this unit's letters, and they are not Class A.**
`b2939f12b`, **2026-08-26 15:56 −0700**: *"rete: families A and C CLOSED — they were
ONE root, and the ratchet is now 0."* Those are the **fuzzer-found** defect families
from `RETE-FIX-LIST.md` — family A (leading accumulate), family B (fact cond +
accumulate + second `where`), family C (`:not` over a derived class). They are eight
weeks and a different instrument away from the vigilia work list's **Class A (A1–A7)**,
which was drawn on 2026-08-30 and closed 2026-08-31.

**If this post names a family letter, it must write the word "family" beside it every
single time.** `001` already quotes `b2939f12b` once (for the Clara agreement) without
the letters doing any work; keep it that way, or spell it out.

Also: `L1`/`L2` here are the **gen vigilia's** severity bands (`GEN-VIGILIA-2026-08-25.md`
header: *"CLOSED IN CODE … every L2"*), which happen to be the same band names the
rete work list uses. Same bands, different cast. Do not let the two casts' counts
touch.

---

## The through-line (one paragraph)

At two in the morning on the second day of the week, a rules engine that already had
two independent implementations of itself acquired a third kind of check: a library
for generating its own test cases, written in the language it tests. The design
choice is one line — a generator is `{card, at}`, an **indexed set** rather than a
seeded random source — and everything follows from it: enumeration is `0..card`,
sampling is any index, shrinking is arithmetic on the index, and a failing case gets
a permanent name instead of a seed that becomes meaningless the moment the generator
changes. Within ten hours the library had found three live defects in the engine it
was built for, two of them invisible to the existing corpus for a reason worth the
whole post: the old tests compared **derived facts**, which are deduplicated by
value, so a rule that fired four times and a rule that fired once read identically.
Within sixteen hours it was promoted into the standard library. And within twenty
hours — the same day it was declared feature-complete — **seventeen wards were cast
against it and it failed its own audit.** A negative cardinality sailed through the
emptiness guard and silently ate two of three real points; two gates could not go
red, one of them passed by an identity function; a comment said a generator's
arguments were evaluated twice when they were evaluated once per point, fifty-two
times slower; and the prose contained a claim that had been false since July. The
response was not to defend it. It was the builder asking whether the thing was now
*an exemplar* — a word this repo had used for months as a compliment and that week
started using as a bar — followed by the answer that mattered: as an artifact yes,
by every measure applicable from inside, **but one thing had been reported without
being built**, and *that is the difference between a good doc and an exemplar.*

Working images (builder's call): *a generator is an indexed set* · *the checker
checks the checker* · *feature complete and failing its audit on the same day* ·
*laws prove self-consistency, not usefulness*.

---

## The story beats, in order

All times are **author dates, −0700**.

### 1. 2026-08-25 02:05 — `eebf75374`: the design turns on one line

> A generator is an INDEXED SET, not a seeded random source:
>
>     Gen<T> = { card : i64,  at : i64 -> T }
>
> That single choice is what the design turns on, and it diverges deliberately from
> the QuickCheck / clojure.test.check lineage it borrows from. Because `at` is a total
> function of an index, three separate pieces of machinery there collapse into one
> operation here: **ENUMERATE is 0..card, SAMPLE is any i < card, and SHRINK is index
> arithmetic rather than tree surgery.** A failing case also gets a PERMANENT name — a
> test.check seed is meaningless once the generator changes, while a coordinate still
> dials in the same case.
>
> The cost, stated in the file: **every dimension must be bounded.** For differential
> testing against a superlinear oracle that is a feature, not a limit.

Two measurements shaped it, both taken that session, and the second is the one the
post needs:

- The oracle is ~O(n²) — 31 facts 11.5 ms, 136 → 81 ms, 556 → 0.96 s, 2236 → 15.3 s.
  *"So cases trade fact VOLUME for shape DIVERSITY. A join defect shows at 3 facts as
  readily as at 3000."*
- **Comparing derived facts is blind.** `production_delta` dedups by value, *"so a
  differential over derived-fact counts reads identically on a correct engine and one
  that multiplies tokens. **37 of the 57 queries in the where-family corpus have that
  shape.**"* Every query in the new fuzzer carries the rule's own LHS, so `query`
  reads beta, **below the dedup.**

Also a small, load-bearing type decision: `defstruct` not `defrecord`, *"because a Gen
carries a function: the containment rule (arc 293.W) holds that a pure aggregate must
survive an EDN round-trip … and a generator never crosses one. **The checker named that
itself.**"*

Mutation-proven at birth: clearing `leading_emitted` per round in `fire/delta.rs`
reddens it at **36 of 288**, and *"the failure SET localizes the defect without help."*

### 2. 02:25 — `a1fbda88a`: the checker checks the checker

> wat-gen was NOT mature, and the evidence was one grep: of its six verbs, **FOUR
> (gen-ints, gen-fmap, gen-digit, gen-shift) had zero call sites anywhere in the repo,
> and the library had no test of its own. A library that tests things, untested.**

The law that matters, and the reason the whole design is not a lie:

> **L4 IS THE ONE THAT MATTERS.** Everything the design claims — that ENUMERATE, SAMPLE
> and SHRINK are one operation — rests on `at` being a **BIJECTION** from 0..card onto
> the coordinate space. If it is not injective, enumeration silently visits some tuples
> twice and misses others, and **a fuzzer reporting "288 cases, 0 mismatches" is lying
> in a way nothing else here could detect.**

Mutation-proven twice against `gen.wat` itself: `gen-shift` made a no-op → 118
violations; `gen-digit` using base+1 → 186 violations. Restored: 255 checked, 0
violations. And the gate is sibling to `hunt_tooling_selftests.rs`, on a stated
principle — *"tooling other gates depend on must itself be gated, or a silent break in
it turns every downstream gate green-and-meaningless."*

The commit ends by refusing its own good news: **"STILL NOT MATURE, and the ledger is
in the reply, not hidden here"** — no elements, no one-of, no such-that, no bounded
collections, no heterogeneous tuple, no sampling driver, no shrinking, no overflow
guard on card.

### 3. 11:18 — `9ec12c34b`: laws prove self-consistency, not usefulness

The best single recognition in the strand, and it is an argument against the author's
own work:

> Asked whether wat-gen is mature, I measured instead of judging. The census:
>
>   `gen-coords`, `gen-check`, `gen-such-that` : 1 real consumer each
>   the other SEVEN                            : 0
>
> Eleven laws over 296 points, every one mutation-proven, is evidence the library is
> **SELF-CONSISTENT. It is not evidence it is USEFUL, and that distinction is the
> finding.** I added combinators because the QuickCheck tradition has them, then proved
> them against laws written by the same hand — **a closed loop with no consumer
> pulling. That is the shape the vigilia exists to hunt, reproduced while writing the
> doc meant to prevent it.**

`gen-lift3` is the proof: it shipped with **zero laws and zero consumers**, *"on the
strength of 'the tradition has a ternary lift'. **Only counting caught it.**"*

And the fix is not a feature — it is a consumer: *"ONE REAL CONSUMER GAINED, by making
the rete target actually use the library rather than hand-roll around it: its skip
logic was **a `such-that` in disguise**, as noted when the combinator was written and
then not acted on."* Which then buys a property test.check structurally cannot have:
*"filtering an opaque random source means retry-and-discard, which can give up and
skews what survives. **Exact filtering makes the cardinality the denominator.**"*

Closing order, verbatim: **"WHAT IS NEEDED IS NOT FEATURES, IT IS CONSUMERS."**

### 4. 12:46 and 15:07 — `a39c28e10`, `03e34f0f3`: the tool starts paying

`001` compresses this into one sentence (*"Its first widened run found two live rete
defects; the next commit found a third"*). The mechanism is unspent and it is the best
technical content in the unit.

**First widened run — 504 cases, 3.8 s, 22 mismatches, all at the accumulate shape,
decomposing into exactly two families, both silent:**

```
A  LEADING accumulate                        native = depth+1, oracle = 1
B  fact cond + accumulate + a SECOND `where`  native = 0,       oracle = 1
```

Family B's minimal pair is the kind of thing a post should show: *"qB1 and qB2 differ
by ONE trailing trivially-true `where`. qB1 agrees at 1; qB2 drops native to 0."*

**Why the existing corpus could not see either**, verbatim, and it is the same
mechanism the design commit named at 02:05:

> the accumulate axes (accum, min-finding) compare DERIVED FACTS, and
> `production_delta` dedups those by value — **a rule deriving one distinct fact reads
> identically whether its token passed once or four times.** Comparing beta rows instead
> is the whole reason this fuzzer exists, and it is now the reason it found something.

**And it is not fixed.** *"NOT FIXED — audited and accumulated, per the standing
method."* The probes assert **correct** behaviour and are `#[ignore]`d, so a fix makes
them pass and un-ignoring is the completion step. The gate becomes **a ratchet pinned
at 22 rather than a zero** — with the reasoning stated: *"Asserting zero would redden
the floor and block unrelated work; **deleting the accumulate shape to keep a gate green
is the trade this codebase refuses.** Movement either way is a red test demanding an
explanation."*

**Family C, two hours later** (`03e34f0f3`) — `:not` over a **derived** class:

```
r1:  :when [(S1 (?k <- :k))] :then [(S2 :k ?k)]     ;; S2 exists ONLY by derivation
qC:  :when [(:wat::rete::not (S2 (?s <- :k)))]

no chain, S2 absent      native 1  oracle 1   agree
chain present, S2 derived native 1  oracle 0   DIVERGE
control: is S2 there?     native 1  oracle 1   both derived it
```

> **BOTH ENGINES DERIVE THE FACT. ONLY THE ORACLE'S NEGATION SEES IT.**

And the diagnosis-not-symptom-list beat: *"The failure SET is a diagnosis rather than a
symptom list: **54 of 76, ALL at depth >= 1 and NEVER at depth 0** — exactly the
dependence stratified negation should have. **That is enumeration paying a dividend
random sampling would not.**"*

⚠ **And it is flagged as a semantics question, not a wiring bug** — the one entry in
the list where the arc's standing rule (*native disagreeing with the oracle means
native is wrong*) is suspended, because *"whether a `defquery` is MEANT to stratify like
a `defrule` is worth establishing, because if queries are deliberately un-stratified
then the ORACLE is the one that is wrong."* Ratchet 22 → 76.

(Closure is `b2939f12b`, 2026-08-26 15:56, *"families A and C CLOSED — they were ONE
root, and the ratchet is now 0"* — **in window**. `001` quotes this commit for a
different sentence.)

### 5. 17:52 — `8eeff8adc`: promotion, and the failure surface becomes a value

> PROMOTION, on the `wat/grep.wat` precedent: **a MOVE of proven code with the numbers
> that earned it.**

Two things in this commit are unspent and both are good:

**The namespace was a live defect, not a promotion chore.** *"In scripts the library
defined `:user::Gen`, `:user::ints` — **squatting in its own CONSUMER's namespace**,
where any program wanting a record named Gen would collide. Scripts cannot define under
`:wat::` (reserved-prefix gate admits only baked sources), so promotion was the only
available fix."*

**The failure surface is now a matchable value**, and the reasoning goes one level past
the obvious:

> The previous version RAISED on an empty generator — the same defect the
> no-hidden-failures LAW forbids, written hours after reading it. **But a nicer raise
> was never the fix:** the hazard is that `violations = 0` reads as success whether the
> property held at ten thousand points or was never applied at all … `Checked` carries
> BOTH numbers, so a violation count cannot be extracted without the point count
> arriving in the same arm — **THE WRONG READING HAS NO FORM.**

Remember that last sentence. **It gets refuted four hours later by the vigilia**, in
that function's own comment. That is the post's turn.

### 6. 21:20 — `e9a5e0156`: feature complete, checked by expression

Completeness established *"by trying to EXPRESS everything left in the QuickCheck /
test.check surface rather than by reading the built list and feeling done."* Nine rows;
the one worth quoting:

> **RECURSIVE GENERATORS DESERVE THE NOTE.** test.check needs a `recursive-gen`
> combinator because its generators are opaque. Here a generator is an ordinary value
> returned by an ordinary function, **so recursion is just recursion** …
> **Having `bind` bought recursion for free, which is the strongest evidence that `bind`
> was the right and last structural gap.**

And the refusal, which is `9ec12c34b`'s lesson applied within nine hours: *"NOT ADDED,
DELIBERATELY: one-line conveniences (pure, bools, set-of) … **Adding them speculatively
is the closed loop this library already fell into once.** If a consumer writes one
twice, it earns its slot."*

### 7. 21:53 — `c43473e38`: seventeen wards, and the tooling fails its audit

**Thirty-three minutes after "feature complete", on the day of promotion.** Subject:
*"curare: the vigilia against `wat/gen.wat` — 17 wards, and the tooling failed its
audit."* Body opens: **"NOTHING IS FIXED; this is the audit."**

The findings, verbatim, *"in code I declared feature-complete and promoted the same
day, on 19 mutation-proven laws. Each reproduced by hand before crediting"*:

- **a NEGATIVE card sails through the emptiness guard into a vacuous pass** —
  `(ints 5 2)` → card −3, check reports `Checked(-3, 0)` for an always-failing property.
  **"This refutes, in that function's own comment, the claim I wrote there: 'the wrong
  reading has no form'."**
- **worse: a negative card SILENTLY EATS POINTS.** `one-of` over `[card -2, card 3]`
  yields card 1 and `at(0) = 102` — **two of three real points vanish, no signal.**
- `lift2` and the record/coords path **disagree at index 6** (`Pair{0,12}` vs
  `Pair{0,10}`). *"L10 was written as the tripwire for exactly that drift and drives
  0..5, **stopping one short.**"*
- `test-shrink-index` **is passed by an IDENTITY implementation** — mutation-proven.
- `record` re-evaluates its generator arguments **per point**, not *"TWICE"* as its
  comment says: **measured 1577 ms vs 30 ms on the same 800-point space, 52×.**
- **a substrate finding, from `secare`**: `is_pure_type`'s `Parametric` arm never
  consults the `TypeEnv`, so `(Gen :- [T])` passes the purity gate and *"a Gen enters a
  defrecord and crosses the wire as `:at #wat.core/fn nil`. **card honest, at dead.**"*
- and the prose: a claim *"false since 2026-07-05"*, a header citing two files deleted
  the same day, **four disagreeing law counts, none of them 23**, six error strings
  naming retired verbs, and *"three shipped items still on the list that says 'There is
  one list. It is this one.'"*

Two more things in this commit that the post should not lose:

> ⚠ **ONE THING OUTRANKS EVERY GEN FINDING.** `excusare` reported `cargo test --test
> kernel` in DEBUG at **569 failed / 16 passed**, all on one `debug_assert!` …
> Release is clean, and `scripts/floor.sh` runs `--release`, so **THE FLOOR CANNOT SEE
> THIS BY CONSTRUCTION.**

> **FM 24 — per-component proofs that never cross a SEAM.** Every gen defect sat between
> two things built separately and tested separately; **nineteen laws, not one crossed a
> seam, and every signal a suite can emit said "covered."** The cure is a law per JOIN,
> asserting the SUT's reported denominator rather than re-reading the struct, and
> mutating to the DO-NOTHING implementation — **an identity passes far more gates than a
> scramble.**

And the closing line, which is the vigilia doctrine in five words: *"`circumspicere`
WAS NEVER CAST. Cast it first."*

(⚠ Count check: the commit says **17 wards**; `GEN-VIGILIA-2026-08-25.md`'s header at
the cutoff says **18** — *"17 reported on 2026-08-25; `circumspicere` was cast
2026-08-26"* — and `wat/gen.wat`'s own header says *"18-ward vigilia 2026-08-25"*.
Both are right at their own moment. Say "seventeen on the night, eighteen with the one
that surveys what the rest turned their backs on", or the reader will think it is an
error.)

### 8. 2026-08-26, 00:36 → 13:50 — the day it becomes an exemplar, or does not

- **00:36 `78e344bac`** — the builder's ruling *"we polish the gen testing doc - after -
  the wat-gen tooling is deemed an exemplar - code, then docs."* Taken *"in the vigilia's
  own recorded order, which puts the GATES first — 'before any other fix, or a fix cannot
  be verified.'"* ⚠ `001` already quotes this ruling.
- **11:13 `6570746e5`** — the ward said `gen.wat` was clean; **it was not**, and the
  builder's pushback corrected the diagnosis. Two beats here and both are good. First:
  *"gen.wat was never clean, nothing said so, and the one cast that looked directly at it
  got the number wrong. **A GATE WOULD HAVE BEEN RIGHT WHERE A READING WAS NOT** — which
  is the case for the ratchet, made against the ward itself."* Second, the builder's
  correction: *"format is absolutely a pure func?.... we definitely forgot to do whatever
  bitflip for this...."* — right on the premise, wrong conclusion broken open. The refusal
  was about `format` being a **macro**, not about purity, and its runtime twin
  (`:wat::core::string::interpolate`) was on the allow-list, documented for exactly this
  case, and already used in the same position at `wat/core.wat:704`. **"So the site was
  fixable all along, and 'false positive' was my error, not the rule's."**
- **11:29 `26cb50517`** — the doc stops being a build log. *"Findings H/I/J/L were four
  symptoms of one thing: the file was **arc narrative** … and **narrative goes stale
  where a reference does not.**"* The rot list is long and worth one example: *"gen-check
  REFUSES an empty generator ... now RAISES"* — *"it returns `CheckOutcome::EmptySpace`,
  and the file **contradicted itself 110 lines later, leaving BOTH standing.** A reader
  stopping at the first writes a raise-handler for an API that returns a value."*
- **12:40 `fddedc205`** — the doc-review vigilia, seven wards, and *"the doc's own
  headline claim was false"*. See `003`'s notes; **`003` and `004` must split this
  commit.** Recommendation: `004` takes the `such-that` measurement (4283 ms vs 312 ms,
  same result) and the doc's steering; `003` takes only *"No inward ward could see this.
  They re-verified the numbers the doc QUOTES; nobody measured a shape it does not
  quote."*
- **13:50 `6511e91a0`** — the builder's question, the answer, and the last gate. ⚠
  **`001` spends this commit almost entirely**: the question, the *"as an artifact yes …
  That is the difference between a good doc and an exemplar"* answer, and
  `gen_doc_surface_matches.rs` with its both-direction mutation proof and stated ceiling.
  **What `001` does NOT take**, and it is a full beat:

  > ⚠ **THE SUBSTRATE REFUSED THIS FILE TWICE, AND BOTH TIMES IT WAS RIGHT.**
  > `no_inlined_wat_in_tests` and `no_inlined_edn` both went red on it. I reached for the
  > rune — the established exemption, used in 10+ files — and `no_inlined_edn`'s own
  > doctrine ruled against me in as many words: *"A literal that merely LOOKS EDN-esque
  > but is genuinely not EDN is NOT a rune candidate — that is a lint false positive to
  > fix by RESTRUCTURING THE CODE ... never by writing a reason and moving on."*

  Both suppressions written, both deleted, both replaced by a shape that does not need
  them, and **both restructurings read better than the literals** — `format!("(:wat::core::{form} :wat::gen::")`
  became a char check *"which says out loud what the literal only implied: this must be a
  DECLARATION HEAD, not a mention in prose"*, and `format!("`{name}")` became *"a markdown
  code span whose first token is this name"* — because **a backtick is quasiquote in wat,
  so that literal was a well-formed form.** Final state: **zero runes.**

### 9. 2026-08-26 12:57 → 2026-08-27 00:13 — the tool is turned outward again

Three commits that close the strand, and they are the answer to *"is it useful?"*:

- **`6d96ce127` (12:57)** — the builder read the corpus and said it was int-biased. The
  reply counts honestly rather than defending: *"of five patterns, TWO were bare i64 (P4,
  P5), one was an enum whose payloads were ints (P3), and only P1/P2 touched strings —
  with a single 3-word pool. **An agent copying that corpus would reasonably conclude ints
  are the idiom.** `ints` is the easiest generator to write and almost never the one your
  problem needs."*
- **`17d010638` (19:47)** — **path independence**, and it is the strand's strongest
  property because it does not need a second engine:

  > **PATH INDEPENDENCE — running a program of inserts, retracts and fires, then firing,
  > must equal firing ONCE over the multiset that program ends with.**

  Four numbers per case (native/oracle × interleaved/one-shot), and *"the coordinate
  separates three independent failures"* including `oi != o1`, *"the ORACLE is
  path-dependent, **which would make the reference wrong and every other fuzzer's
  agreement suspect**."* card 1372, violations 0. And the model refusal is a small
  masterpiece: *"the one-shot needs no hand-written fact model: replaying the SAME program
  with the fire op turned into a no-op leaves exactly the final multiset, so **the
  session's own facts field IS the model** — a model vector would have to re-implement
  insert's append and retract's remove-all-equal and would then be **a second thing that
  can be wrong.**"*
- **`8c71e0f2e` (2026-08-27 00:13)** — nested combinators over an exhaustive truth table
  (8 compositions × all 8 worlds = 64 cases, 0.5 s), **and checked against Clara,
  24/24, byte-identical**. The reason that step is not ceremony is stated in the commit
  and it is `001`'s oracle argument arriving from a different direction: *"entry E, the
  SAME DAY, was native and `$oracle` **transposing identically and agreeing perfectly on
  the wrong answer.** **Two engines agreeing proves nothing when they share an
  assumption.**"*

  And a nice inversion of the strand's own rule: the leaves bind nothing deliberately, so
  the readout is a clean 0/1 and *"the row count IS the truth value — **the one place in
  these fuzzers where a count is the right instrument rather than a blind one**, and the
  header says why."*

### 10. What the file says about itself at the cutoff

`git show e6858e858:wat/gen.wat`, the header, is a self-contained artifact and the post
could end on it:

> ;; AUDITED — 18-ward vigilia 2026-08-25, `circumspicere` 2026-08-26, doc-review vigilia
> ;; 2026-08-26. Every defect that could compute a WRONG ANSWER is fixed …
>
> ;; ⚠ THE SHIPPED NUMBERS AND THE VERB SURFACE LIVE IN `docs/GENERATIVE-TESTING.md`, NOT
> ;; HERE. This banner used to restate them, and a doc-review vigilia caught the
> ;; consequence: two hand-maintained descriptions of one library, disagreeing … **One home
> ;; per fact. This file explains the CODE; the doc carries the numbers.**
>
> ;; ⚠ ENTRIES NAME THE VERB, NEVER A LINE NUMBER. The first version of this banner cited
> ;; `:53`, `:150`, `:311` and six error-string lines — and **EVERY ONE of those numbers was
> ;; wrong within a day, because fixing the entries above them moved the lines below.**
> ;; Cite the verb; grep finds it.

---

## Verbatim builder quotes, with locations

`git log --grep` over message bodies (**not** `-S`). This unit is unusually rich —
the builder is present at nearly every turn of the strand, and almost never as an
approval.

**4.1 — the ruling that ordered the work, and the first in-window "exemplar".**
`78e344bac` (2026-08-26 00:36), body ¶1. ⚠ **ALREADY IN `001`.**

> "we polish the gen testing doc - after - the wat-gen tooling is deemed an exemplar -
> code, then docs."

**4.2 — the question that names the bar.** `6511e91a0` (2026-08-26 13:50), body ¶1.
⚠ **ALREADY IN `001`.** Quoted here for completeness because the unit cannot avoid
referencing it; do not spend it as a headline.

> "do we believe that wat-gen is now an exemplar?... did we empower the next set of wat
> engineers to bulid robust tests cleanly?"

**4.3 — the order for the doc-review cast.** `fddedc205` (2026-08-26 12:40), body ¶1:

> "let's run the doc review vigilia on the generative doc .... make sure its polished."

**4.4 — the expressiveness demand, and the line in the sand.** `37f04c402`
(2026-08-26 11:55), body ¶1. **The longest and best builder quote in the strand:**

> "i think i saw everything being very basic shit like single char strings and ints...
> i want to see how expressive we can make this... make this a desireable test time
> tool... **i think we also need a line in the sand that determines when generative tests
> are inadequate... not theatre, real problem solving.**"

**4.5 — the corpus is int-biased.** `6d96ce127` (2026-08-26 12:57), body ¶1:

> "it feels like its still heavily int focused - my concern is that agents will unfairly
> prefer testing with ints rather than something meaningful for a problem domain.... i
> was expecting to see something like... a lazy seq thing that generates random text.. or
> composes text from different things... or a bounded range that a user defines .... being
> able to pass in a param generator who conforms to some arg-spec but has its own bounded
> values that's bespoke to some condition."

**4.6 — the pushback that corrected the diagnosis.** `6570746e5` (2026-08-26 11:13),
§"⚠ AND MY FIRST DIAGNOSIS WAS WRONG":

> "format is absolutely a pure func?.... we definitely forgot to do whatever bitflip for
> this...."

**4.7 — the caution that stopped a gate being built.** `6570746e5`, §"the ratchet is
buildable now and deliberately NOT built":

> "i don't know if wat-lint is functional yet"

Grounded rather than obeyed: *"arc 277 is OPEN (no INSCRIPTION, no SCORE)… **A gate
belongs to the arc that owns the rules it freezes, while that rule set is still
growing.**"*

**4.8 — the promotion of the doc.** `26cb50517` (2026-08-26 11:29), body ¶1:

> "this one is very likely worth of being in docs/ -- we need to polish it... but this
> one feels very compelling"

**4.9 — where work docs live.** `a20f063a6` (2026-08-25 22:38), body ¶1:

> Builder's ruling: `docs/` root is for the standing doc set; work docs belong under the
> arc.

**4.10 — the miss that found something worse.** `fc949d002` (2026-08-26 18:51), body ¶1:

> "huh.... feels like a miss...."

On keyword being absent from the scalar fuzzer. *"it is, and probing it properly found
something worse than absence"* — and then the commit retracts its own committed claim:
**"MY COMMITTED CLAIM WAS FALSE."**

**4.11 — the register.** `2361bf8b3` (2026-08-26 18:38). ⚠ **ALREADY IN `001`**, quoted
there in full (*"bro - those if ladders are awful - you gotta use cond"*). Noted so a
writer does not re-spend it.

**Quote count for this unit: 9 direct builder quotes in window, of which 6 are unspent
by `001`.** The pattern worth naming, and it is different from `003`'s: here the builder
is not the trigger for an audit — **he is the consumer**, asking whether the tool is
usable by someone who is not its author. 4.4, 4.5 and 4.2 are all the same question in
three registers.

---

## The substance test — run by me

Strip every hash, date, file path and line number. What is left that `git log` does not
hold?

**Holds up:**

1. **A generator as an indexed set collapses three mechanisms into one.** `{card, at}`
   with `at` total over `0..card` makes enumerate, sample and shrink the same operation,
   and gives a failing case a **permanent name** instead of a seed that dies when the
   generator changes. The cost is stated and accepted: every dimension must be bounded.
   That is a real design argument against a thirty-year lineage, and it is decidable on
   its merits by a reader who has never seen this codebase.
2. **Exact filtering makes the cardinality the denominator.** Filtering an opaque random
   source means retry-and-discard, which can give up and skews what survives; filtering a
   finite indexed set yields a new finite set whose size you know before the run. This is
   the sharpest concrete consequence of (1), and the strand found it by trying to delete a
   hand-rolled skip check.
3. **Laws prove self-consistency; only consumers prove usefulness.** Eleven
   mutation-proven laws over 296 points, and seven of ten verbs had zero call sites. The
   author had built combinators because the tradition has them and then proved them
   against laws written by the same hand — *"a closed loop with no consumer pulling"* —
   and the ternary lift shipped with zero laws *and* zero consumers on the strength of
   tradition alone. **Only counting caught it.** The corrective is stated as an order:
   what is needed is not features, it is consumers.
4. **A per-component proof does not cross a seam, and every signal says "covered".**
   (The record's FM 24.) Nineteen laws, not one of them crossing a boundary between two
   separately-built, separately-tested parts — and every gen defect found by the vigilia
   sat exactly on such a boundary. The prescribed cure is specific enough to steal: a law
   per **join**, asserting the system's own reported denominator rather than re-reading
   the struct, mutated to the **do-nothing** implementation — because **an identity passes
   far more gates than a scramble.**
5. **A comparison that deduplicates cannot see multiplicity.** The existing corpus
   compared derived facts, which are deduped by value, so a rule that fired four times and
   a rule that fired once read identically — and 37 of 57 queries had that shape. The
   fuzzer's whole reason for existing is that it reads beta rows, below the dedup. This
   generalises to any differential test whose comparison passes through a normalising
   step: **the normaliser is where the defect hides.**
6. **"The wrong reading has no form" is a claim that can be refuted in its own
   comment.** The `Checked{points, violations}` shape was designed so a violation count
   could not be read without its denominator arriving in the same arm — a genuinely good
   move — and four hours later a **negative** cardinality produced `Checked(-3, 0)` and
   sailed through as a pass. Making a wrong reading unrepresentable in one dimension does
   not make it unrepresentable.
7. **Two engines agreeing proves nothing when they share an assumption**, and this unit
   demonstrates it rather than asserting it: on one day the native path and the same-language
   oracle transposed identically and agreed perfectly on a wrong answer, and it took the
   third-party Clojure twin to break the tie. (`001` makes this claim; **this unit has the
   incident that proves it**, and the two should be cross-referenced deliberately rather
   than accidentally.)
8. **Feature-complete and audit-failing on the same day is not a contradiction — it is
   what the two words measure.** Completeness was established by trying to *express* every
   remaining thing in the reference surface; the audit measured whether the built thing
   computes right answers. The strand's own summary of the distinction is that warding and
   consumer count are *confidence* questions, not *completeness* ones. Thirty-three minutes
   separated the two verdicts and both were correct.
9. **A suppression you were entitled to write, twice refused, twice replaced by a shape
   that reads better.** The rune existed, was established, was used in ten other files, and
   the lint's own doctrine said a look-alike is not a rune candidate. Both restructurings
   made the condition *more* explicit than the literal had been. **Zero runes** is the
   outcome, and the ladder — convention beaten by a check beaten by a shape the mistake
   cannot be written in — is applied here to the author's own first instinct rather than to
   someone else's code.

**Does not hold up without the log** (evidence, not argument): the card counts (288, 504,
828, 1372, 64), the ratchet numbers (22, 76, 120/1260, 0), the 52× and 10.7× figures, the
floor numbers, the verb and law counts.

---

## Explicit scope

**IN** (all author-date `[2026-08-24, 2026-08-31)`, `origin/grok-rete`):
- The 34 `fuzz:`/`gen:` commits, spanning `eebf75374` (2026-08-25 02:05) →
  `8c71e0f2e` (2026-08-27 00:13).
- The strand's un-prefixed commits: `2946d23ff`, `a20f063a6`, `c43473e38`, `e9a5e0156`,
  `26cb50517`, `fddedc205`, `ee1fe443b`, `fc949d002`, `6241ae1d8`.
- The artifacts at the cutoff: `wat/gen.wat` (992 ln, 27 verbs),
  `docs/GENERATIVE-TESTING.md` (592 ln),
  `docs/arc/2026/06/278-rules-engine/GEN-VIGILIA-2026-08-25.md`,
  `tests/lint/gen_doc_surface_matches.rs`, `wat-tests/gen.wat`,
  `wat-tests/gen-patterns.wat`, the five `wat-tests/rete/differential-fuzz-*.wat`.
- **Defect families A, B, C** and their closure at `b2939f12b` (2026-08-26 15:56) — in
  window, and the strand's payoff.

**OUT:**
- **`6511e91a0`'s three big beats** — the builder's question, the *"good doc vs
  exemplar"* answer, and the doc-surface gate with its mutation proof and stated ceiling.
  `001` spends all three. Take **only** the twice-refused-suppression half.
- The *"code, then docs"* ruling as a headline — `001` has it.
- *"bro - those if ladders are awful"* — `001` has it.
- The one-sentence summary *"a fuzzer built to test the engine found three real engine
  defects in two days"* — `001` has it; **this unit must give the mechanism, not the
  summary**, or it reads as a restatement.
- The vigilia work list, Class A–F, the exemplar table, `doc-coverage.sh` (`001`, `002`).
- The bookkeeping audits (T7, exemplar-hunt table, inbound notes) — `003`.

**CUTOFF:** `e6858e858`, 2026-08-30 23:54:11 −0700. **This unit does not need the
cutoff.** Its arc closes cleanly at `8c71e0f2e` on 2026-08-27 00:13, three and a half
days early. The only later touch is the fuzzers continuing to run on the floor. **That
is an argument for making it the second post rather than the last** — it has a real
ending, where `002` and `003` both trail into work that finishes past the window.

⚠ **The clock.** The arc's prose dates are UTC; git author dates are −0700. Grounded in
`002`'s notes. `001` used git's −0700; stay with it.

---

## Open questions and gaps

1. **⛔ The brief's "where the word exemplar enters the corpus" is refuted.** See the
   top section. The post must not repeat it, and someone should decide whether `001`'s
   softer version of the same sentence warrants a correction on the shipped page.
2. **I did not run anything.** No floor, no fuzzer, no `cargo wat`. Every card count,
   ratchet number, millisecond and violation count here is **quoted from a commit body**.
   The differential fuzzers are all still on disk at the cutoff
   (`wat-tests/rete/differential-fuzz*.wat`) and a live re-run would be a genuinely
   stronger artifact for a post about a test tool. Builder's call.
3. **The `excusare` debug-mode finding is unresolved in this window.** `c43473e38` records
   `cargo test --test kernel` in DEBUG at 569 failed / 16 passed on one `debug_assert!`
   (`src/types.rs:598`), *"Unverified by me. First thing to check on resumption."* **I did
   not find its resolution inside the window.** It is the sharpest instance of *"the floor
   cannot see this by construction"* in the whole batch, and the record does not say, in
   window, how it came out. Worth ten minutes past the cutoff before drafting — if it was
   real, it is a beat; if it was environmental, saying so is also a beat.
4. **The 17/18 ward count needs one clarifying clause** or it reads as an error. See
   beat 7.
5. **`fddedc205` is shared with `003`.** Split it as recommended in beat 8 or both posts
   will quote the same `such-that` measurement.
6. **The family-A/B/C closure (`b2939f12b`) is `001`'s commit too** — `001` quotes its
   Clara sentence. Quoting the *same commit* for a different sentence is fine and probably
   good (it ties the posts together); quoting the same sentence is not. Check before
   drafting.
7. **The `#[ignore]`-as-ratchet decision deserves scrutiny the post may not want to
   give it.** `a39c28e10` pins a gate at 22 known divergences rather than at zero, with a
   stated argument. That is a defensible engineering call and it is also exactly the shape
   `wat-rs/CLAUDE.md` and this project's own memory record as *how the ignore pile grew*
   (a house convention that is the mechanism). The commit anticipates the objection
   (*"movement either way is a red test demanding an explanation"*) and the ratchet did in
   fact go to 0 nine days later. **Include it or leave it, but do not present it as
   uncomplicated.**
8. **Slug.** `exemplar-004-the-generative-strand` as given. Title and song are the
   builder's. Working note: the strand's own strongest self-description is
   *"the checker checks the checker"* and *"laws prove self-consistency, not usefulness"*.
