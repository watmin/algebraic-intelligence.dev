# Working notes — exemplar-001, the front opens (2026-08-24 → 2026-08-30)

**Status:** raw notes, not a draft. Written 2026-09-08 by a reader working the
`grok-rete` branch. Everything below is grounded against `origin/grok-rete` and
`origin/main` in `/home/watmin/work/holon/wat-rs`, read this session. Nothing in
`wat-rs` was edited.

**Placement:** the OPENING post of a new front. The reading window is Monday
2026-08-24 (verified: `date -d 2026-08-24 +%A` → Monday) through Sunday
2026-08-30 (verified Sunday). Both endpoints are real boundaries, not
conveniences — see §1.

**Title and song-drop are ALWAYS the builder's call.** Working images below, not
proposals.

---

## ⚠ READ FIRST — three findings that change what the post can say

### STOP-1 (partial). The 214 reproduces EXACTLY. The 35 does not reproduce at all.

**214 own commits in-window: CONFIRMED, to the commit.** Method and numbers in
§9. The planner's instrument was right and I got the identical figure by an
independent path.

**"35 of them docs" does not reproduce under any definition I could construct.**
Three candidate definitions, all run over the same verified 214:

| definition | count |
|---|---:|
| subject prefixed `docs:` | **10** |
| commits whose changed-file set is entirely under `docs/` | **75** |
| commits touching `docs/` at all | **155** |

None is 35. Two near-misses exist and I distrust both as post-hoc fits:
`docs:`+`record:`+`audit:`+`arc:` prefixes = 35; `docs:`+`record:`+`proposal:` = 36.
**Do not put a docs count in the post unless the builder names the definition.**
The reproducible statement is the one that needs no definition: *of 214 commits,
75 changed nothing outside `docs/` and 155 touched `docs/` at all.* That is a
stronger sentence anyway — it says the record is more than a third of the work.

⚠ And note the shape: this is the front's own recurring defect wearing a
reader's clothes. `d024afb2e`'s work list opens with *"a count is not a finding"*
and `e6858e858` (the last commit in-window) is a whole stone about a count that
came back 37 when the population was 96. A docs figure quoted without its
instrument is exactly what Class F of the vigilia was minted to delete.

### STOP-2 (resolved, but the brief's list is a MERGE of two lists, and L1/L2 are not IDs)

The lettered list exists on disk. It is
`docs/arc/2026/06/278-rules-engine/VIGILIA-2026-08-30-WORK-LIST.md`, landed
in-window by `d024afb2e` (2026-08-30 18:54). But:

- **`A1 A2 A2b A4 C1` are real row IDs** in that file — Classes A (the doors),
  B (resource lifetime), C (the instruments), D (engine behaviour), E (error
  shape), F (the description layer). A2b is a sub-row surfaced by A2's own rider.
- **`L1` and `L2` are SEVERITY LEVELS, not findings.** The file's own header
  reads *"19 wards … **41 L1 + 70 L2**"* — 111 findings, banded. The commit
  subject the planner drew from is
  `curare: the vigilia's work list on disk — 41 L1 + 70 L2, Class A first`.
  A post that treats L1 as a finding beside A1 will be wrong on the record.
- **`T7` belongs to a DIFFERENT list** —
  `docs/arc/2026/06/278-rules-engine/NEXT-STRIKES-theater-hunt.md`, the
  "theater hunt". `175bbe865` (2026-08-29) is
  *"record: the exemplar-hunt table was fiction — all three 'open' rows stale"*
  and its body says *"the same disease as the T7 paragraph found an hour
  earlier."* T7 is from the hunt for *theater* — tests and rows that look like
  work and are not.

There are therefore **two lists running in-window**, and the difference matters:
the theater hunt is a list of things the record CLAIMS are open; the vigilia work
list is a list of things nineteen wards FOUND. The first kept turning out to be
fiction; the second is where the real strikes came from.

### STOP-3 (fires). The `fuzz`/`gen` strand is separable and should be its own post.

**34 of the 214 carry a `fuzz:` or `gen:` prefix** (16 + 18; verified). They are
almost entirely 2026-08-25 and 2026-08-26 and they build a *different artifact*:
`wat/gen.wat` (`:wat::gen::`), a generative/property-testing library written in
wat, promoted from scratch to stdlib inside the week
(`gen: PROMOTED to wat/gen.wat (:wat::gen::) — and the failure surface is a VALUE`,
2026-08-25).

It is separable — and it is also **where the word "exemplar" enters this front**,
which is the reason to give it its own post rather than to drop it. The builder's
question `6511e91a0` (2026-08-26) is about *wat-gen*, not rete. Suggested cut:
**exemplar-00N — "the tool that proves itself"**, covering the wat-gen vigilia
(17 wards, `curare: the vigilia against wat/gen.wat — 17 wards, and the tooling
failed its audit`), the promotion, the doc-surface gate, and the fact that the
fuzzer's first widened run found **two live rete defects**
(`fuzz: the fuzzer found two live rete defects on its first widened run`,
2026-08-25) and a third the next commit
(`fuzz: a third rete defect — ':not' over a DERIVED class ignores the derivation`).

The opening post should keep exactly one sentence of it: *the tool built to test
rete found three real rete defects in two days, and the builder then asked
whether the tool itself was an exemplar.* That sentence is the bridge into the
front's premise. Everything else about generators belongs in its own unit.

---

## The hook / through-line (one paragraph)

Correctness was finished. On the morning of 2026-08-30 the rete subsystem's named
work list was **empty** — every mechanically checkable axis green or retired with
a written reason, both prior ward casts' findings fixed or gated, 5,162 tests
passing. So nineteen wards were cast against a tree **184 commits and
+19,496/−11,996 lines in `src/rete` alone** past the last full cast, including
**19 files that did not exist then** — and they came back with **41 L1 + 70 L2**,
*"every single finding … on a surface the 28 lints cannot see"*
(`VIGILIA-2026-08-30-WORK-LIST.md:1-8`). **An empty work list was evidence about
how hard we had looked.** Five of the nineteen wards independently found five
instances of one class — *an invariant proven at one door and assumed at all of
them* — and the answer to "is `wat-rete` an exemplar" came back, in the
breadcrumb's own capitals, **NO, AND THE FULL VIGILIA SAID SO.** That is the
front's opening position: not a subsystem being announced as exemplary, but a
subsystem that has just measured, against a committed instrument, exactly how far
short it falls — and published the distance.

Working images (builder's call): *the empty list* · *three doors into a session* ·
*an invariant proven at one door* · *nineteen wards against a green tree*.

---

## 1. The divergence, and why the window's endpoints are real

**Monday 2026-08-24, 18:00:10 −0700 — `de827fb4cbd3598183a85249b39fe462dc33ff5c`.**
This is `git merge-base origin/grok-rete origin/main`. It is a MERGE of grok-rete
INTO main, and its body is the best possible opening for this front because it is
a demonstration of the front's whole method before the front has a name. Verbatim
excerpts:

> MERGE grok-rete — both filed bugs come home, and the accounting is by NAME

> **FLOOR ACCOUNTED BY NAME, NOT ARITHMETIC** — 5025 -> 5043, and a rise hides a
> loss:
>
> GAINED 18, LOST 0

…followed by the eighteen named, four each for the two bugs the two sides filed
*against each other*. And then:

> ★ **THE SECOND ONE IS WHY THE CORPUS EXISTS.** A self-join rule returned 0
> across all 54 stdlib files, which is a completely plausible answer to "are there
> duplicate definitions". Only a positive control — a fixture defining the same
> name twice, which ALSO returned 0 — separated "nothing matched" from "the
> question was never asked".

That is the divergence commit. Everything after it on `grok-rete` is this front.

**Sunday 2026-08-30** closes on `e6858e858` at 23:54 — `strike: draw C1`. Floor at
that commit, quoted from its body: **5181/5181, 21 skipped.** The window opens at
a floor of **5046/5046** (`051bc9c5b`, 2026-08-24). I did **not** re-run the
floor; every floor number in these notes is quoted from a commit body.

---

## 2. What `wat-rete` IS — grounded, for a reader meeting it cold

`wat` is a Lisp with a Rust substrate (`wat-rs`). `wat-rete` is its **rules
engine**: a RETE network, the classic forward-chaining pattern matcher, built as a
first-class subsystem of the language.

- **Size.** `src/rete/` is **42,384 lines** across ~90 files at the cutoff
  (`e6858e858`), and `circumspicere`'s L1 in the work list names it *"the largest
  module in `src/`"*. Plus `wat/rete.wat` and `wat/rete/{acc,compile,syntax}.wat`
  and five files under `wat/rete/oracle/`.
- **The user surface** is `defrule` / `defquery` — the Clara/Clojure spelling.
  Rules are data first: `wat/rete.wat` declares
  `(:wat::core::defrecord :wat::rete::Rule [name lhs rhs])` with the comment
  *"a rule as pure data (not yet compiled into network nodes)"*, and `Query` as
  *"a named parametric query (Clara defquery). No `:then`; answers are binding
  maps."*
- **The dual implementation is the point.** `src/rete/mod.rs:1-8` states it:
  *"The wat files are compile + `$oracle` reference, not the production fire
  path."* Native fire is `fire-rules` (sealed Rust in `src/rete/kernel/`); the wat
  reference is `fire-rules$oracle`. **The engine ships with a second
  implementation of itself, in the other language, whose job is to disagree.**
- **And a THIRD oracle, outside the project entirely.** `b2939f12b` (2026-08-26)
  closes two defect families and its exit rule includes: *"Clara 0.24.0 ran on
  both and agrees, byte-identical to native and the `$oracle`."* Clara is the
  Clojure rules engine. There is a benchmark harness (`the grid`) that runs the
  same axes against Clara — `b35327830` (2026-08-30) reads
  **`33/33 :accuracy :match, 33/33 :winner :us`**.

**Why THIS is the thing chosen to be made exemplary** — the ground is in
`57e2adc9b` (2026-08-30), and it is the builder's:

> "this is core's tooling and core is not yet total… that cannot be held against
> rete as **rete is the first subsystem to demand totality**."

Rete is where the substrate first tried to make a subsystem *total* — no raise, no
crash, every refusal a matchable value. It got there first, so it is the one that
can be held up. The commit's own reading: *"it inverts the credit: rete built the
outcome wall for the ceilings it owns and checks the arithmetic it does not."*

---

## 3. The rhythm: **draw → strike → curare**, and it is literally legible in one evening

The planner's description is correct and the log shows it cleanly. 2026-08-30,
`git log` times, all `−0700`:

| time | commit | phase |
|---|---|---|
| 18:54 | `d024afb2e` | the work list lands — 41 L1 + 70 L2, Class A first |
| 19:02 | `16b095f5e` | **draw** the fourth wall (A1) |
| 19:16 | `edd8f9807` | STOP-1 passed — 593 tests, zero graph-invariant violations |
| 19:45 | `788e5b66d` | **strike** — `rete/import`: the FOURTH wall |
| 20:02 | `305df3ba8` | **draw** A2 — a wire value panics the host |
| 20:43 | `c449cd24d` | **strike** — nine arms become refusals |
| 21:09 | `d28066404` | **draw** the silent zero (A2b) |
| 21:38 | `d081142a9` | **strike** — split `operand_slot`'s conflated `None` |
| 21:41 | `74e7f2dd7` | **curare** — A1, A2, A2b closed |
| 21:53 | `a584a3165` | **draw** A4 — the session ceiling |
| 22:55 | `42704d57b` | **strike** A4 |
| 22:55 | `af75d480f` | **curare** — A4 closed, and two corrections to the fix shape |
| 23:03 | `819c79b9a` | **vigilia** — docs/** is a graveyard by construction |
| 23:11 | `fc0cde28b` | **draw** the docs graveyard gate |
| 23:42 | `9ee04f945` | **gate** — every docs/arc `.wat` loads, or declares why not |
| 23:51 | `78c0435ab` | **vigilia** — C1 scoped: 96 divides across 7 files |
| 23:54 | `e6858e858` | **draw** C1 |

Five hours, five findings drawn, four struck, each closure written down as its own
commit. The cycle is not a schedule — it is a **contract about where a finding's
status lives**. The work list says so in a banner:

> ⛔ **STATUS IS EDITED HERE, IN PLACE. Never append a closure below a row.** A
> row's status living in two places IS the defect — `exigere` found exactly that
> in this arc's TRACKED DECISIONS this same day, in a section whose own header
> bans it. One row, one place.

---

## 4. Class A — the one finding worth more than the other 110

This is the substance of the post. From
`VIGILIA-2026-08-30-WORK-LIST.md:22-38`, verbatim:

> ## ⛔ THE CLASS ABOVE THE FINDINGS — an invariant proven at ONE door, assumed at ALL of them
>
> **There are THREE doors into a Session:** `arm-session` (`compile-all`),
> `import_export`, and a hand-assembled `Session` record. **The first proves
> things. The other two do not**, and almost every instance below is the second
> door.

| # | invariant | proven at | assumed at | found by |
|---|---|---|---|---|
| A1 | node ids ascend (topological) | minting, on compile | the wire, unchecked | `circumspicere` |
| A2 | fold values are `i64` | `build_rete_arm` | `acc.rs`'s `panic!` | `circumspicere` |
| A3 | acc-form head is callable | the fence, via `RETE_OPS` | the executor, via `sym.get` | `experiri` (driven) |
| A4 | session byte ceiling | one thread-local origin | every session on that thread | `secare` + `sequi` |
| A5 | termination is verified | `arm-session` | *"the one door EVERY rule passes"* | `circumspicere` |

> **The question to ask of every remaining invariant in this engine: which door
> proved this, and how many doors are there?**

Five wards, working independently, found five instances. **That is the recognition
the post exists to deliver**, and it generalises past rete, past wat, past rules
engines: *a proof is attached to a code path, not to a value, and a system grows
new paths faster than it re-proves.* The engine had a compiler that proved things
and a deserializer that did not, and every invariant the compiler established was
being spent by code reached through the deserializer.

The self-description was worse than silent — it was affirmatively wrong.
`export.rs:15-17` states its own law, quoted in the work list:

> *"it consumes bytes some other process wrote, and every one of them can be a
> lie."*

and `export.rs:2015` calls `import_export` *"the file's one place where untrusted
bytes become a runnable network."* The header **counts three walls** (range
refusal, slot bounds, three compat gates). The work list's next sentence:
**"None is a graph wall."**

Concrete consequences, in-window (A1, A2, A2b, A4 all closed on 08-30; A3, A5,
A6, A7 closed 08-31 and belong to the NEXT post):

- **A1** — nothing checked that a child id resolves, that a Negation/Exists/
  Accumulate `aid` names an Alpha, or that `child > parent`, while `node.rs:192`
  and `arm.rs:592` both state the passes **require** ascending id order. Fixed by
  a fourth wall between phases 3 and 5 (`788e5b66d`).
- **A2** — a `panic!` licensed by a comment reading *"AccFold compile proved
  i64"*, **a proof `import_export` never runs**. No `catch_unwind` on the program
  path: a Rust panic, no span, no rule named. The work list's fix rule is the
  quotable one: *"a wire-reachable invariant may not be spelled `panic!`. A rune
  here must name the DOOR, not the compiler."* (`c449cd24d`.)
- **A4** — `SESSION_ORIGIN` was one `Cell` per THREAD, rebased by every
  `compile-all`. A second session re-bases the first, `saturating_sub` floors the
  reading at 0, and the first session has **no ceiling at all for the rest of its
  life**. `arm_lease.rs:141` is a GREEN test holding two live sessions on one
  thread. (`42704d57b`.)

The A4 closure is worth the post's space because of how it states its own size:

> **The strike converted an unsafe silent failure (a session with no ceiling at
> all) into a safe conservative one. A per-session origin is not a per-session
> allocator.**

and because the prescribed mutation **did not work**:

> **The prescribed mutation was INERT.** "Make `mark_session_origin` clobber
> regardless of id" (`or_insert` → `insert`) left every arm of the probe GREEN,
> because with distinct keys the two behave identically.

---

## 5. What makes it an EXEMPLAR, concretely — the bar, the instrument, the verdict

This is the section that decides whether the front is a signpost or a claim. The
answer is that the bar is **a committed script and two mutation-proven lint
gates**, and the verdict as of the cutoff is **NO**.

### 5.1 The instrument is committed, and it exists because a number rotted

`scripts/doc-coverage.sh`. Its own header (verbatim, `:3-12`):

> **WHY THIS IS COMMITTED.** A doc-coverage number was recorded in an arc
> breadcrumb with no instrument beside it, and the number was WRONG in a way
> nobody could see: it read only the line directly above `fn`, so every function
> whose doc sits above an attribute — `#[allow(...)]`, `#[inline]`,
> `#[cfg(test)]` — counted as undocumented. …
>
> **A metric with no committed instrument is unfalsifiable:** it cannot be
> re-derived, so it rots silently and is quoted for weeks. If you record a
> doc-coverage figure anywhere, cite this script and the flags you ran it with, so
> the next reader can reproduce or refute it.

It also names the comparison trap in its own usage notes: *"`src/rete` carries a
10k-line `kernel/tests/` module that its siblings have no equivalent of, so an
unqualified line count compares test bulk rather than code. An earlier recorded
table used that exclusion silently, and the number could not be reproduced until
someone guessed it."*

### 5.2 The bar is a comparison against SIBLING subsystems, normalised

From the breadcrumb at the cutoff
(`CURRENT-STATE-annihilate-interpretation.md`, stamp six, 2026-08-30). **Note the
header: "Re-derive, do not quote."**

| axis | `src/rete` | `src/process` | `src/channel` | verdict |
|---|---:|---:|---:|---|
| undocumented fns ≥15 ln | **0** (was 111) | 4 (12%) | 0 | ✅ done |
| tests that cannot fail | **0** (was 26) | — | — | ✅ done |
| nesting ≥8, NORMALISED | **1.1%** (9/817) | 0/85 | **14%** (1/7) | ✅ ahead of channel |
| largest test file | **1,676** (was 10,189) | — | — | ✅ done |
| comment density | 29% | 39% | 53% | ⚰️ **RETIRED** |

Two things in that table are the post's best material, and both are about
**retiring a metric with a reason** rather than chasing it:

- ⚰️ *"COMMENT DENSITY IS A DEAD METRIC. Do not chase it. Deleting 22 duplicated
  functions and 37 duplicated closures — an unambiguous improvement — moved it
  **zero points**. It counts lines, not information, and can be raised to 50% by
  restating every line. … AND IT MAY POINT THE WRONG WAY: `probare` exists to ask
  'is this a program or a description?', so `channel`'s 53% is as plausibly a
  FINDING as a target."*
- ⚠ *"The nesting row was previously RAW COUNTS ('rete 10, process 0, channel 1'),
  which penalised the directory with 817 functions against one with 7.
  Normalised, rete is ahead of `channel`."*

### 5.3 The exemplary ROW is a named function, not an abstraction

`c4647f89a` (2026-08-30): *"The exemplar strike, measured against the row this
codebase already ruled exemplary (`intrinsic_meta` in `purity.rs`: 571 lines, 64%
comment, nesting 2)."* The bar is one function in the tree, cited by name, with
three numbers.

And the same commit says what the gap actually was, which is not what a
coverage number would suggest:

> **THE GAP WAS NEVER STRUCTURE.** Nesting was already sound and the file records
> INCIDENTS well … What it stated nowhere was CONTRACTS — what a function is and
> guarantees. Its public entry point, `lower`, had no doc at all while being the
> front door of the arc's expression compiler.

…followed by ⛔ **FOUR OF MY OWN DOCS WERE WRONG AND WERE CAUGHT BY VERIFYING
THEM. Writing them from signatures is exactly how a file acquires confident
lies.**

### 5.4 The bar is enforced by gates that were mutation-proven in both directions

Four in-window, all in `tests/lint/` (34 lint files at cutoff):

1. **`gen_doc_surface_matches.rs`** (`6511e91a0`, 08-26) — a verb in `wat/gen.wat`
   not in the doc is a red build; a `:wat::gen::` name in the doc that does not
   exist is a red build. *"MUTATION-PROVEN IN BOTH DIRECTIONS … Clean
   discrimination: each catches only its own direction."* And it states its own
   limit: *"it CANNOT check that a documented verb is documented CORRECTLY."*
2. **`no_stale_path_in_doc.rs`** (`99bf573df`, 08-30) — a path named in a doc must
   exist. *"Found SIX stale references, FIVE of which four ward casts walked
   straight past, including one I created by splitting `validate.rs`."*
3. **`rete_header_claims_are_asserted.rs`** (same commit) — *"the three claims
   that rotted today are now executable. Prose keeps the WHY; the gate keeps the
   WHAT."*
4. **`docs_wat_loads_or_declares_why_not.rs`** (`9ee04f945`, 08-30) — every
   `.wat` under `docs/arc/**` loads, or carries a closed-vocabulary rune saying
   why it does not.

### 5.5 THE VERDICT, and it is the front's whole opening claim

`CURRENT-STATE-annihilate-interpretation.md`, stamp six, verbatim:

> **⛔⛔ START HERE. THE INITIATIVE IS: MATURE wat-rete INTO AN EXEMPLAR the rest
> of wat matures against.** Correctness is done; the exemplar work is not.

> **⛔⛔ THE ANSWER TO "IS IT AN EXEMPLAR" IS: NO, AND THE FULL VIGILIA SAID SO —
> 41 L1 + 70 L2.**

and, from `c26b730e0` (08-30 15:30), the sentence that should probably close the
post:

> THE EXEMPLAR VERDICT is now "one item short", and it carries the caveat that
> matters: **an exemplar claim is itself a claim about the tree**, and this
> session is a long argument for not believing those without a check. SIX of my
> own instruments returned confident wrong numbers today. The two gates in
> tests/lint/ are what make the table re-derivable. **DO NOT DECLARE THE EXEMPLAR
> FROM THE FILE — RUN THE SCRIPT.**

Three hours later `6f14aa100` refuses even that improvement:

> The exemplar verdict changes shape rather than flipping to YES. "One item short"
> becomes "the named list is empty" … **An empty work list is evidence about how
> hard we have looked. The next hand should not read "empty" as "clean."**

Two and a half hours after *that*, the nineteen-ward cast returned 111 findings.
The sequence — empty list → "empty is not clean" → 111 findings, all inside one
day — is the post.

**So: what is now true of `wat-rete` and not yet of its siblings?**
Grounded, and stated at its true size:

1. It is **the first subsystem to demand totality** — builder's words, `57e2adc9b`.
   The outcome wall exists for every ceiling rete owns (`FireOutcome` /
   `InsertOutcome` / `CompileOutcome`); a ceiling never reaches wat as a raise;
   a lint keeps it so. `src/process` and `src/channel` have no equivalent.
2. It is the only subsystem carrying **three implementations** — native Rust fire,
   a wat `$oracle`, and a third-party twin (Clara 0.24.0 in Clojure) that the
   grid runs against it.
3. It has **0 undocumented functions ≥15 lines and 0 tests that cannot fail**
   (both were 111 and 26); `src/process` still has 4 undocumented.
4. Its metrics table is **derivable from one committed script** and defended by
   two mutation-proven gates, so the claim can be refuted by a reader.
5. And — the honest one — **it has the only published list of its own 111 open
   defects.** No sibling has been looked at hard enough to have one.

That last point is the exemplar, and it is worth saying plainly: what makes rete
the thing the rest of wat measures against is not that it is clean. It is that it
is the only part of the tree whose distance from clean has been measured with an
instrument anyone can re-run.

---

## 6. Verbatim builder quotes, with commit hashes

**Method:** `git log origin/grok-rete ^origin/main` in-window → 214 bodies →
case-insensitive `builder` → **124 matching lines across the 214**. Every quote
below re-read verbatim from `git log -1 --format=%b <hash>`. Hyphens, ellipses,
lowercase and the one typo are the builder's. This is a duet and the record says
so at nearly every stone.

**6.1 — the word "exemplar" enters the front.** `6511e91a0`, 2026-08-26:

> "do we believe that wat-gen is now an exemplar?... did we empower the next set
> of wat engineers to bulid robust tests cleanly?"

The commit's answer is the front's definition: *"as an artifact yes, by every
measure applicable from inside — but ONE thing was blocking it and I had reported
it without building it. … **That is the difference between a good doc and an
exemplar.**"*

**6.2 — the ordering ruling.** `78e344bac`, 2026-08-26:

> "we polish the gen testing doc - after - the wat-gen tooling is deemed an
> exemplar - code, then docs."

**6.3 — why rete is the one held up.** `57e2adc9b`, 2026-08-30:

> "this is core's tooling and core is not yet total… that cannot be held against
> rete as rete is the first subsystem to demand totality."

**6.4 — the docs deferral, with its ground.** `d024afb2e`'s work list,
`VIGILIA-2026-08-30-WORK-LIST.md`, § DEFERRED BY BUILDER'S RULING:

> "our docs outside of arcs are very out of date — we've just been grinding on
> code correctness — our compiler and runtime provide coordinates and prompt
> injections as errors for corrections… i'm less keen on truing up our docs and
> more keen on ensuring our code is an exemplar; docs come after the code churn is
> satisfied."

The file's own note on it is the interesting half: *"The reason this is deferred
and not struck: the correction mechanism for a wat author is the compiler's own
located diagnostic, not the README — so a stale README costs a reader
orientation, not correctness. **That is a real ruling with a real ground, and it
holds only while the ground does.**"*

**6.5 — the directive that minted Class F.** Same file, § CLASS F:

> "counts are always wrong, every time... we must make our file suitable for greps
> for on the fly counting as necessary" · "more lints are almost always better"

Which the list turns into **F0 — THE RULE:** *"A number in prose is replaced by
**the command that derives it**, not by a corrected number. … Correcting them buys
weeks. Deleting the claim is the fix."*

**6.6 — the challenge that unearned a sweep of 106 sites.** `c898713de`, 08-30:

> "why is the first round slow?... is this disingenuous?"

The commit: *"A fair challenge, because discarding an inconvenient round IS what
taking a minimum does. … I swept 106 sites without checking whether the reasoning
transferred."* It transferred — after two measurements were run to earn it. The
lesson it records: **"THE NUMBER IS WRONG" AND "I KNOW WHY THE NUMBER IS WRONG"
ARE DIFFERENT CLAIMS, AND ONLY THE SECOND LICENSES A FIX.**

**6.7 — the one question that drew the docs graveyard gate.** `fc0cde28b`, 08-30:

> "where does this file live such that it does not run?"

The answer: `wat_scripts_fixes_load.rs` states *"ALL wat must remain correct,
always"* and walks `wat-scripts/` only. Ten `.wat` files under `docs/arc/`;
driven: 4 alive, 3 red-by-design, **1 rotted silently ~8 weeks**, 2 deliberately
preserved. Same commit, the builder's verbatim instruction on the preserved pair:

> "we need to know what bad looks like to make good - keep it here... we must not
> forget what bad looks like."

**6.8 — the pushback that unravelled a wrong conclusion.** `979607007`, 08-26:

> "what i64::+ did you attempt to use?... :wat::rete::i64::+ is total.."

The commit: *"That pushback unravelled a wrong conclusion I had committed an hour
earlier. … All three of my attempted exploits were refused for ONE unrelated
reason … which is what finally proved my probes had never tested the hole at
all."* Then the hole was demonstrated for real, and closed.

**6.9 — the session-boundary ruling that shaped a week of work.** `52213d3b0`, 08-29:

> "the session is the boundary - it may not consume more than the configured
> amount of memory, 1G by default.... insert affects memory just as must ... as
> insert via derivation in fire-rules... yes?... we can exhaust memory before
> fire-rules begins?"

and `5c7e8e66f`, same day:

> "make this an actual memory limit ... not an 'items in memory' limit ... but
> that's determined by the 'fattest' record ... or we impose it at run time as we
> insert?"

and `e440b1029`, on a default chosen by symmetry:

> "why is 10k our preferred limit - i want our default to be actually good."

The commit's own answer: *"It was chosen to match `DEFAULT_MAX_FIRE_ROUNDS`. That
is symmetry, not evidence, and the two bound DIFFERENT THINGS: a round cap bounds
WORK per fire, this bounds STATE."*

**6.10 — the two that drove the 08-30 file splits.** `f98226353`:

> "i dislike large files… each test is doing its own thing, yes?"

(`kernel/tests.rs`, 10,189 lines → 13 files, largest 1,676.) And `d17d1fc23`:

> "this feels like we've got more work to do?"

*"— yes, and this was it. The split SCATTERED complectens' weave findings across
nine files rather than curing them."*

**6.11 — the register, if the post wants one line of it.** `2361bf8b3`, 08-26:

> "bro - those if ladders are awful - you gotta use cond"

**Pattern worth writing explicitly:** in this window the builder's interventions
are almost never approvals. `6511e91a0`, `78e344bac`, `57e2adc9b`, `c898713de`,
`fc0cde28b`, `979607007`, `e440b1029`, `d17d1fc23` are all *challenges to a claim
the apparatus had already committed*, and in at least four cases the challenge
was right and the commit that answered it says so in its own subject line
(`gen: lint-stdlib flagged gen.wat and was RIGHT — the builder's pushback
corrected my diagnosis`; `curare: the totality item was mis-filed against rete —
struck at the builder's correction`). **Write it as a duet or the post will be
false to the record.**

---

## 7. The substance test — run by me

Strip every hash, date, file path and line number. What is left that `git log`
does not hold?

**Holds up:**

1. **An empty work list is a measurement of how hard you looked, not of how clean
   the code is.** The named list was empty on the morning of 08-30 — every
   mechanical axis green, both prior ward casts closed — and nineteen wards cast
   the same evening returned 111 findings, *every one on a surface the 28 lints
   could not see*. The gates were green throughout. This is the single most
   transferable thing in the window and it needs no rete knowledge at all.
2. **A proof attaches to a code path, not to a value — and a system grows new
   paths faster than it re-proves them.** Three doors into a session; one proves
   things; the other two spend the proof. Five independent auditors found five
   instances without coordinating. The generalised question the list writes down —
   *which door proved this, and how many doors are there?* — is an instrument
   anyone can carry to any codebase.
3. **A wire-reachable invariant may not be spelled `panic!`** — and the comment
   licensing the panic named the compiler, which is exactly the door the wire does
   not pass through. A rune must name the door, not the prover.
4. **A metric with no committed instrument is unfalsifiable.** It cannot be
   re-derived, so it rots silently and gets quoted for weeks. The corollary the
   week actually earned: *do not declare the exemplar from the file — run the
   script.*
5. **Retiring a metric with a written reason is a result.** Comment density was
   deleted, not chased, on the evidence that an unambiguous improvement (deleting
   22 duplicated functions and 37 duplicated closures) moved it zero points — and
   with the observation that a high number may be a FINDING, not a target.
6. **A count is not a finding.** Recorded as a rule at the top of the work list,
   demonstrated twice inside the same 24 hours (a divide-by-RUNS census that came
   back 37 against a population of 96; a hollow-test classifier that said 10
   against 26), and — see STOP-1 — it is the reason I refuse to quote a docs
   count in this post.
7. **"The number is wrong" and "I know why the number is wrong" are different
   claims, and only the second licenses a fix.** A 106-site sweep was correct *by
   luck* until two measurements earned it, and the thing that forced the
   measurement was one question from the builder.
8. **On a comparison benchmark, every plausible failure makes the measured arm
   look better** — a no-op insert, a lossy conversion, a colliding identity, a
   phase missing from a sum: each does less work and prints as a speedup.
   Therefore *"`assert!(x > 0.0)` is not weak verification there, it is
   ANTI-verification: it stamps a broken arm green while the number misreports
   what happened."* 26 such tests converted in one commit.
9. **A ward finds what needs judgment; a gate finds what needs looking.** Four
   ward casts walked past five of six stale doc paths that a twelve-line lint
   found immediately — and one of the five had been created by the same session
   that walked past it.
10. **An oracle must be written in the other language.** The Clara twin found an
    ACCEPTANCE divergence — wat accepts a binding inside `:not` that Clara refuses
    at compile time — which the commit names as *"invisible to any wat-vs-wat
    differential"*. Two implementations of one thing in one language cannot
    specify each other.

**Does not hold up without the log** (evidence, not argument): the floor numbers,
the 214/34/111/41/70 counts, the commit ordering, the specific line numbers in
`export.rs` and `alloc_counter.rs`.

**Verdict: the substance test passes decisively.** Points 1, 2 and 8 are
recognitions a reader cannot get from the commit log even if they read all 214
bodies, because each is a *pattern across* commits that only the vigilia's own
framing names.

---

## 8. Open questions and gaps

1. **I did not run the floor, the grid, or `scripts/doc-coverage.sh`.** Every
   number in §5.2 is quoted from the breadcrumb, which itself says *"Re-derive, do
   not quote."* If the post prints that table it should either say it is quoting
   the record, or someone should run
   `scripts/doc-coverage.sh src/rete --exclude /tests/` at `e6858e858` first.
   Given §5.5's own warning, **running it would make the post materially
   stronger.**
2. **A3, A5, A6, A7 close on 2026-08-31 — one day past the cutoff** — and their
   closures are the richest entries in the whole Class A table (A6 is *"not a
   SIGSEGV — a stack-guard ABORT"*, and the same 20,000-deep Export is *"ACCEPTED
   on a 256 MiB thread and aborts on a 2 MiB one"*, so acceptance was a property
   of the importing THREAD). **Excluded here. They are the next post's spine.**
   The opening post should end at "Class A is the root, and four of seven are
   struck", not at "Class A closed."
3. **`claude-compute` forked off `grok-rete` at `1facc1f946…` on 2026-08-28
   16:12** — verified with `git merge-base` and `git merge-base --is-ancestor`. So
   the 109 commits a naive `grok-rete ^main ^claude-compute` range removes are
   **grok-rete's OWN work from 08-24 to 08-27**, inherited by the sibling. The
   exclusion runs the OTHER way from what the brief's phrasing might suggest:
   `^claude-compute` is the wrong flag for measuring grok-rete and the right one
   for measuring the sibling. §9 shows both.
4. **The `record:` prefix (23 in-window) is its own genre** and I have not
   characterised it. It appears to be the far-side ledger — findings written down
   after the fact, including corrections of the project's own prior records
   (`record: the theater summary said T7 remained; it closed four days earlier`;
   `record: the exemplar-hunt table was fiction`). If the post wants a section on
   *how the record maintains itself*, that is where it lives, and it is a strong
   candidate for its own unit.
5. **`b7d9d8e90` — "the benchmark called the wrong arm 'the engine' for eleven
   days"** — I read the subject but not the body in depth. Given point 8 of the
   substance test, this may be the sharpest single instance of the
   anti-verification class in the window. Worth ten minutes before drafting.
6. **`experiri` appears in-window as a NEW ward** (`proposal: experiri — the ward
   the vigilia does not have`, 08-27; `proposal: experiri's honest coverage — it
   would NOT have caught everything`, 08-27) and it is `experiri` that drives A3.
   The user's memory index records `experiri` as a datamancy spell shipped
   2026-09-07 after 17 rounds. **The ward was minted in this window and hardened
   over the following two weeks.** That is a cross-repository thread the builder
   may or may not want surfaced; I have not verified the datamancy side.
7. **Slug.** I used `exemplar-001-the-front-opens` as given. Series placement,
   title and song are the builder's.

---

## 9. My census — method shown, reproduce it

All commands from `/home/watmin/work/holon/wat-rs`. Ref tips at the time of
reading: `origin/grok-rete` = `b6ffdff1d`, `origin/main` = `3dc4f62b7`,
`origin/claude-compute` = `f92f55dbd`.

```bash
# THE DIVERGENCE
git merge-base origin/grok-rete origin/main     # de827fb4c  2026-08-24 18:00:10 -0700
git merge-base origin/claude-compute origin/grok-rete   # 1facc1f94  2026-08-28 16:12:17

# GROK-RETE'S OWN WORK — exclude main ONLY.
# Do NOT also exclude claude-compute: the sibling branched OFF grok-rete on 08-28,
# so ^origin/claude-compute deletes 109 of grok-rete's own 08-24..08-27 commits.
git rev-list --count origin/grok-rete ^origin/main                        # 479 (all time)
git rev-list --count origin/grok-rete ^origin/main ^origin/claude-compute # 370 — WRONG for this purpose

# THE SIBLING'S own work, for contrast — here the extra exclusion IS correct:
git rev-list --count origin/claude-compute ^origin/main ^origin/grok-rete # 24

# IN-WINDOW, filtering on the field printed (%ad = AUTHOR date, matching --date=short):
git rev-list origin/grok-rete ^origin/main --format='%ad|%H|%s' --date=short --no-commit-header \
  | awk -F'|' '$1>="2026-08-24" && $1<="2026-08-30"' | wc -l                # 214  ✅
```

**Per-day, author date, `grok-rete ^main`:**

| date | day | commits |
|---|---|---:|
| 2026-08-24 | Mon | 8 |
| 2026-08-25 | Tue | 22 |
| 2026-08-26 | Wed | 35 |
| 2026-08-27 | Thu | 24 |
| 2026-08-28 | Fri | 38 |
| 2026-08-29 | Sat | 37 |
| 2026-08-30 | Sun | 50 |
| **total** | | **214** |

(The remaining 265 of the 479 fall 08-31 → 09-06 and belong to later posts.)

**Prefix histogram of the 214** — the front's shape in one table:

| prefix | n | | prefix | n |
|---|---:|---|---|---:|
| `rete:` | 53 | | `docs:` | 10 |
| `curare:` | 40 | | `strike:` | 9 |
| `record:` | 23 | | `grid:` | 5 |
| `gen:` | 18 | | `measure:` | 4 |
| `fuzz:` | 16 | | `vigilia:`/`proposal:` | 3 each |

plus ~20 singletons (`278:`, `4.1:`, `gate:`, `audit:`, `experiri:`, `ci:`,
`holon:`, `alloc:`, `probe:`, `export:`, `edn:`, `config:`, `fix-list:`, `arc:`).

**Docs subset — three definitions, none of which is 35** (see STOP-1):

```bash
# docs: prefix
grep -cE '\|docs' window.txt                                # 10
# changed-file set entirely under docs/
# (per-commit: git show --pretty=format: --name-only $h)    # 75
# touching docs/ at all                                     # 155
```

**Floor, quoted from commit bodies, never re-run by me:**
`051bc9c5b` (08-24) **5046/5046** → `e6858e858` (08-30 23:54) **5181/5181**.
Waypoints: 5100 (`b2939f12b`, 08-26), 5162 (`c4647f89a`, 08-30 00:33),
5164 (`99bf573df`, 08-30 14:37).

**`src/rete` at the cutoff (`e6858e858`):** 42,384 lines. Largest files:
`purity.rs` 2,599 · `export.rs` 2,332 · `kernel/fire/mod.rs` 2,086 ·
`reachability.rs` 1,917 (⚠ **0 production lines** — `src/rete/mod.rs:86` wraps the
whole file in `#[cfg(test)]`, which the work list records as invisible to any
per-file scan *including `scripts/doc-coverage.sh`*) · `vocabulary.rs` 1,879.

**What my instruments could not see:** the prefix histogram is a `sed` over
subject lines, so a commit whose subject does not use the `prefix:` convention
falls into the singleton tail (~20 of 214). The `builder` harvest is a
case-insensitive substring over commit BODIES only — it cannot see rulings that
reached the tree as doc text without the word, and it cannot see anything said in
conversation and never written down. The docs-only classification uses
`git show --name-only`, which would misreport a merge commit — checked: **there
are zero merge commits inside the 214**, so that hazard does not apply here.
