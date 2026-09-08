# Working notes — exemplar-003, "the record audits itself"

**Status:** raw notes, not a draft. Written 2026-09-08 by a reader working the
`wat-rs` exemplar-front backfill. Everything below is grounded against
`origin/grok-rete` in `/home/watmin/work/holon/wat-rs`, read this session.
Nothing in `wat-rs` was edited.

**Window:** 2026-08-24 → 2026-08-30, the 214 in-window commits on `grok-rete`
(merge-base `de827fb4c`, cutoff `e6858e858` at 2026-08-30 23:54:11 −0700).

**Verdict: this unit survives, whole, and it is the strongest of the three.** All
three of the brief's quotes resolve to real commits with real diffs. **STOP-2 does
not fire.** The unit is not thin — it is *over*-supplied, and the drafting risk is
the opposite one: it has more grounded material than one post can carry, and
choosing what to cut is the writer's real work.

**Title and song-drop are ALWAYS the builder's call.** Working images below, not
proposals.

---

## ✅ The three quotes, located and verified

All three are **commit subjects**, all in window, all `git log --grep`-findable
(not `-S` — that pickaxes diff content, not messages), and all three carry a diff
that changes the artifact they indict.

| brief's quote | commit | author date (−0700) | artifact changed |
|---|---|---|---|
| *"the exemplar-hunt table was fiction — all three 'open' rows stale"* | `175bbe865` | 2026-08-29 23:42:59 | `NEXT-STRIKES-theater-hunt.md`, +39/−6 |
| *"the theater summary said T7 remained; it closed four days earlier"* | `c79fc5e01` | 2026-08-29 22:42:30 | `NEXT-STRIKES-theater-hunt.md`, +13/−6 |
| *"index the inbound notes — two sat unread for five days, one a silent wrong answer"* | `c99202e1a` | 2026-08-29 00:07:10 | `RETE-OPEN-WORK.md` +22, two new probes |

They are one hour apart (T7 at 22:42, exemplar-hunt at 23:42), which the second
commit says out loud: *"the same disease as the T7 paragraph found an hour
earlier."* That is the post's spine.

**And they are three of at least nine.** The strand runs the whole week; see the
beat list. The record keeps its own running tally of how many inherited rows it has
audited and how many were stale, which is the single best artifact in this unit.

---

## ⛔ The conflation hazard — checked, and it lands squarely on THIS unit

**`T7` is not a work-list row.** It belongs to
`docs/arc/2026/06/278-rules-engine/NEXT-STRIKES-theater-hunt.md`, the **theater
hunt** — a list of suspected performance theater, rows `T1`–`T8`. **T7 closed
2026-08-25** (`afb58d422`: *"T7: `Op::Or` hoisted to one frame per disjunction
(arithmetic, NOT a measured win — no axis reaches these arms). `Op::Not`
affirmatively CUT rather than deferred"*). It has nothing to do with:

- **work-list Class A (A1–A7)** — *an invariant proven at ONE door, assumed at ALL
  of them* — drawn 2026-08-30 18:54 (`d024afb2e`), closed 2026-08-31 (past cutoff).
  That is `001`'s and `002`'s material.
- **defect families A and C** — the fuzzer-found families, closed `b2939f12b`,
  2026-08-26 15:56, in window. That is `004`'s material.

**`L1`/`L2` are severity bands, not findings** (work list header: *"41 L1 + 70
L2"*). If this post mentions the vigilia at all, it must not letter anything.

**Recommendation: this post should touch no lettered system at all.** Its objects
are `T7`, the exemplar-hunt table, and the inbound-notes table — three *documents*.
Keeping it entirely at the document layer is also what keeps it from colliding with
`001`.

---

## The through-line (one paragraph)

The engine was being held to a standard, and the standard was administered by
documents — a work list, a hunt table, a theater ledger, a breadcrumb, a set of
inbound notes from other agents. For one week those documents were audited with the
same instruments that had been aimed at the code, and they failed worse than the
code did. A paragraph summarising a list of eight items said one remained; it had
closed four days earlier, and the very same paragraph contained a warning that this
list had already been stale about a different row. A table of "open, never
examined" functions claimed fourteen hundred lines of unexamined code across three
functions; measured, they were seventy-two, thirty-five and eighty — decomposed
weeks earlier by someone who never struck the row, so a reader would have gone
hunting work that did not exist. Two bug reports from another agent, one of them a
silent wrong answer — the highest-severity class the arc recognises — sat in a
directory nothing pointed at, for five days, and were found only because the builder
asked what remained and answering required an `ls`; both had been fixed by accident,
as collateral from unrelated work, which is *the same outcome as luck*. The record's
own counter is the finding: over nine inherited rows audited that week, **eight were
stale**, and the one that was not got a commit message saying so *because it was
remarkable*. None of these documents could go red. That is the whole mechanism: the
tree had thirty-four gates and five thousand tests and a compiler that refuses
things, and the layer telling everyone what to do next had no failure mode at all.

Working images (builder's call): *a summary of a list rots faster than the list* ·
*a stale open row invents work* · *eight of nine* · *the list that did not exist*.

---

## The story beats, in order

All times are **author dates, −0700**. ⚠ The arc's *prose* dates are **UTC** — see
"the clock", below — but every date in this section is git's.

### 1. 2026-08-24 23:34 — `2615e94a5`: the breadcrumb is replaced, not stacked

The week opens with the record-keeping ritual already in place and already
producing findings about itself. *"BREADCRUMB REPLACED IN PLACE, not stacked: one
2026-08-24 (THIRD) stamp supersedes both earlier same-day stamps."*

Two failure modes recorded, both the author's own, both from that session:

- **FM 20 generalised.** It was *"a pipe discards the exit code"*; it is broader —
  **truncation loses content too.** Three times in one session: `floor.sh | tail -4`
  threw away the exit code; the same pipe cut the `Summary` line entirely, *"leaving
  epilogue prose that read like a clean finish"*; and `run-all.sh | tail -60` dropped
  the grid's first axis, *"which then looked like an axis that never ran."* The cure
  is stated as a habit, not vigilance: **redirect to a file, read the file.**
- **FM 21 new.** A blanket edit landing **inside a string literal**. This repo carries
  wat source in `const X: &str = "…"` blocks, so an inserted `//` is program text and
  **it compiles**. The second incident is the one worth studying, in its own words:
  *"I caught a fifth corrupted site, fixed it, and concluded 'I matched an extra site'
  when the truth was 'my insertion point is inside a string' — then verified the wrong
  property, reading '12 insertions, 0 deletions' as reassurance about four sites it
  said nothing about."*

### 2. 2026-08-25 00:37 — `afb58d422`: the breadcrumb had FORKED FOUR WAYS

Subject, verbatim: *"278: the vigilia list driven to its floor — **and the record
itself was lying in four places**."* From the body, under the heading **THE RECORD
(found by the recolligere, on no ward's list)**:

> The breadcrumb had FORKED FOUR WAYS — SEAM.md, six stacked seams in
> DESIGN-no-hidden-failures.md, BACKLOG.md, and the true one — **each announcing
> itself as the one live current-state.** SEAM.md's own rule condemned the rest ("if
> you find a second, one of them is lying — prune it") and **nobody had ever run it.**
> The recovery ledger pointed at a fifth, wrong file, and its arc step exited 2. **A
> prior self had logged that exact defect as OWED and it sat.**

Two failure modes minted here, and both are load-bearing for the whole post:

- **FM 22** — *a rule in prose that nothing runs; its confidence suppresses the audit.*
- **FM 23** — *a deferral whose reason expires with nothing to re-read it.*

Also in this commit, and a good miniature of the same class: `conferre` found the
grid liveness gate saying *"18 axes / 9 sized + 10 where-\*"* and floor-asserting
`len() >= 18`, while the disk held **43 / 11 + 32** — *"so the gate was measuring
less than half the corpus while reading as current."* **Cured by DELETING the counts,
not correcting them**: both populations are now asserted exactly equal to their
arrays, *"so the arrays are the count and there is no second place for a number to
rot."*

### 3. 2026-08-25 00:54 — `26a0d937a`: and the correction was itself wrong

Seventeen minutes later. Subject: *"the cache citations were dangling, not
fabricated — **and I had the diagnosis backwards**."*

> I claimed `src/rust_deps/cache.rs` and `wat/cache.wat` cited a nonexistent oracle,
> and deleted a provenance sentence on that basis. Wrong. "Oracle" in these files means
> a STUDY oracle — a prior crate implementation read for shape, explicitly "NOT a copy
> of it" … My probe grepped `cache.*\$oracle`, which tests the rete naming convention,
> found nothing, and **I read that absence as proof of absence.** The deleted sentence
> is restored.

The real defect was duller and was the builder's point: Stone 5 annihilated the
crates, so five citations resolve to nothing. Marked as **provenance** rather than
live paths — *"the lineage is still the honest answer to 'where did this shape come
from', it just must not send anyone hunting a deleted file."*

This is the beat that keeps the post from being smug. The auditor's first correction
of the week was a false positive delivered with confidence, caught by the builder,
and reversed in under an hour.

### 4. 2026-08-25 11:07 — `2946d23ff`: striking a finding that was documented behaviour

> It cost an hour because **I theorised before grepping for prior art**, not because
> the substrate is inconsistent. **There is no work item.**
>
> Same failure shape as the study-oracle retraction earlier today: a confident
> structural claim about the substrate, made from one probe, without checking whether
> the codebase had already answered it.

The prior art it missed was one line in `wat/telemetry.wat:286`, quoted verbatim in
the commit: *"compile-time/macro-expand reflection of a baked record is DEAD, proven;
runtime resolves for both stdlib and user records."* A prior self had proved it and
written the resolution down.

### 5. 2026-08-26 12:40 — `fddedc205`: the doc's own headline claim was false

The doc-review vigilia — seven wards cast at `GENERATIVE-TESTING.md` on the builder's
order. The finding that justified the cast is `circumspicere` C1: §2 shipped
*"**Strictly better**, and only possible because the space is finite"* about
`such-that`. **True on bias and failure modes. False on cost**, and measured:

```
(such-that small? (ints 0 2000000))              4283 ms
(such-that small? (take 50 (ints 0 2000000)))     312 ms   <- same result, card 3
```

*"Worse, the doc **STEERED READERS INTO IT**: the one ordering rule it gave ('compose
the scatter BEFORE it') taught that order matters for CORRECTNESS and said nothing
about cost."*

And the reason no inward ward could catch it, which is the reusable half:

> **No inward ward could see this. They re-verified the numbers the doc QUOTES; nobody
> measured a shape it does not quote.**

The inward wards' haul, in the same body, is a catalogue of the class: *"Nineteen
laws"* as a present-tense claim six lines under a table saying 27; *"27 laws, every
one mutation-proven"* contradicted by the author's own suite, which says *"L12 is NOT
demonstrated"* — **"The doc rounded up the one thing the suite refused to"**;
`scripts/floor.sh` described in the past tense when it still passes no `--profile`
today; `:user::apply2`, **a verb that exists nowhere**, offered as proof that a
constructor is a function value.

(Cross-reference: this is `004`'s commit too. `003` should take **only** the
"no inward ward could see this" recognition and one example, and leave the rest.)

### 6. 2026-08-26 15:08 — `ee1fe443b`: three failure modes, all mine, all from today

- **FM 25 amended, not renumbered** — *"a destructive step must not sit in the same
  command as the step that justifies it."* Instance one was generation+removal;
  instance two edit+run; instance three **edit+rejection** — the builder rejected a
  call bundling a debug `eprintln!` edit with the build that ran it, *"and the edit
  had already written. Instrumentation sat in `src/rete/` through two release
  rebuilds."* Cure: *"write the edit, run the consumer separately, so a 'no' leaves the
  tree as it was."*
- **FM 26** — two gates in one command, only the loud one read. *"The floor printed
  5098/5098; `clippy exit=101` printed three lines below it and went unread; **I
  committed AND PUSHED on a red gate.**"* Explicitly distinguished from FM 20: *"a
  verdict LOST to a pipe"* versus *"nothing was lost here, it was printed correctly and
  not looked at."*
- **FM 27** — a benchmark figure from too few samples, then reasoned with. Two
  successive 3-sample reads of the **same binary** gave 265 and 288 µs/point; *"a ~9%
  regression was chased that did not exist, and three published figures were wrong."*

### 7. 2026-08-27 01:46 — `5c2c06267`: the mechanism, named

This is where the post gets its **why**, and it is one paragraph:

> The root was the record, not the code. `NEXT-STRIKES-theater-hunt.md` recorded every
> closure by **APPENDING a block below the open list and never pruning the list**, so a
> section titled "WHAT REMAINS OPEN" listed rows whose closures sat 100–250 lines lower
> **in the same file**. **Both halves truthful; the document false; the lying half the
> one a reader meets first.**

The cure is *"the only rung prose allows"* — **one row, one place, status edited
inline, appending a closure below banned in the section's own header.** Deliberately
**not gated**: *"a lint over prose is exactly the self-certifying gate FM 29 names."*

And the argument for auditing a stale list rather than deleting it — two live items
were hiding in the false-open list:

- **`partire` ×7 was in NEITHER tally** — not closed, not open. *"It fell between the
  two and was never re-read: **exigere's own rule broken inside the record that
  enforces it.**"* Re-grounded, and one of its citations had gone stale as written
  (`arm.rs` had moved to `src/rete/kernel/arm.rs`).
- **`circumspicere` 1's stated reason expired the same day it was written.** *"The
  runner lacks Clara and a JDK"* — and the parity job landing hours later installs
  Temurin 21 and a pinned Clojure CLI. **FM 23's second incident**, with a mechanical
  cure: *"when you land anything that removes a constraint, grep the record for that
  constraint's NAME before you commit."*

Also here: the prior stamp said *"2-for-2 stale"*; the real number was **4-for-4**.
The tally itself was under-reporting.

### 8. 2026-08-28 21:51 — `03a1b9335`: a range edit ate items 1–6

> Found only because the builder asked **"what was our next step before the detour"**
> and the answer was not in the file.
>
> **WHAT HAPPENED.** A python replacement of the form `s[:i] + new + s[j:]` located
> BOTH endpoints by `s.index(...)`. I believed both fell inside item 7. They did not:
> the opening anchor had been written into the section PREAMBLE and the closing anchor
> sat at the END of item 7, so the slice spanned everything between — **top-level items
> 1 through 7** — and replaced them with a paragraph. **Nothing failed.** The file
> stayed well-formed markdown, the numbering just resumed at 8, and **every subsequent
> edit built on the damaged text.**

Restored verbatim from `c3caee1c1`. And the lesson, which is this unit's thesis in
one sentence: *"a range whose endpoints are FOUND rather than fixed can span more than
the author believes, and **a prose file cannot go red**. A count of the numbered items
before and after would have caught it in one line."*

### 9. 2026-08-28 22:09 — `3c6a4920f`: the streak, and the one that wasn't stale

> All three parts audited against the tree and all three LIVE AND ACCURATE — **the
> first inherited row this session that was not stale. The streak was 6-for-6, so that
> is worth recording as much as the content.**

The immediately preceding tally is at `85c87314d` (2026-08-28 15:13): *"RETE-OPEN-WORK
item 2 (`reduce`'s 2-arity totality) was already closed by `97eac5a38` **the day
before the row was written**, gated, with two fixtures. **Sixth consecutive inherited
row in this arc found stale on audit.**"*

The same commit also carries a self-contained instance worth quoting for texture: the
CLAUDE.md delivery gap, where **both proposals on the table were refused** because
each *"create[s] a SECOND COPY of the doctrine, one by hand and one by resolution.
**This row exists because a second copy went stale.**"* What shipped instead was a
pointer that *"asserts nothing about wat-rs's CONTENT, so it cannot drift."*

### 10. 2026-08-29 00:07 — `c99202e1a`: the list that did not exist

The first of the brief's three. Verbatim from the body:

> ⛔ **THE FINDING IS NOT THE FIXES.** Neither was made by anyone reading those notes —
> both are almost certainly collateral from this arc's inline-constraint and
> expression-lowering work. **A finding that gets fixed by accident is not a process
> that works; it is the same outcome as luck**, and the next one may not be adjacent to
> whatever is being built that week.
>
> **AND THEY WERE TRACKED IN NO LIST.** `~/work/NOTE-*.md` is where other agents file
> findings for this one, and nothing pointed at that directory — **they were found only
> because the builder asked 'what items remain' and answering required an `ls`.** One
> was a SILENT WRONG ANSWER, the highest-severity class this arc recognises, and it sat
> for five days. Same disease as `partire` x7: **a real finding, tracked nowhere,
> indistinguishable from a finding that does not exist.**

The diff adds a five-row table to `RETE-OPEN-WORK.md` under the header **"Inbound
notes — the list that did not exist until 2026-08-29"**, with the instruction *"When
you file or receive a note, add its row here in the same motion."* The two five-day
notes, both filed 2026-08-24, both re-driven and verified fixed:

- `NOTE-rete-a-where-before-a-fact-condition-silently-matches-nothing.md` — *"a `where`
  followed by a fact condition matched NOTHING, silently."* Re-driven: selects the hit,
  **1, was 0**.
- `NOTE-rete-cond-lowers-on-the-lhs-but-not-the-rhs.md` — a `cond` compiling in a
  `where` and failing at `compile-all` in a `:then`.

⚠ **Grounding limit, stated because the post may want to quote the notes
themselves:** of the five notes named in that table, only **one** still exists on
disk today — `/home/watmin/work/NOTE-experiri-a-ward-that-executes.md` (12,209 bytes,
mtime 2026-08-27 22:59). The other four are not in `/home/watmin/work/`. **The record
does not say** what became of them. Everything above is from the commit body and the
diff, not from the notes.

### 11. 2026-08-29 22:42 — `c79fc5e01`: the summary that warned about itself

The second brief quote, and the sharpest single artifact in the unit. The paragraph
that was replaced, verbatim from the diff:

> The theater list above is closed **except T7**: **T1/T3/T5 struck**, **T8 cleared as
> not theater**, **T2/T6 struck 2026-08-24** (one defect, two hats — see their entries),
> **T4 was already landed and this list was stale about it**. **T7 alone remains, and it
> is COLD** …

**Read that fourth clause.** The paragraph contains its own warning — *"T4 was already
landed and this list was stale about it"* — one sentence before the claim that was
stale. The replacement says so:

> A reader trusting this summary would have gone hunting for a strike that had already
> landed, **exactly as the note about T4 in this same paragraph warns.**

And the rule, from the commit body:

> The lesson, written where it happened: **a SUMMARY of a list rots faster than the
> list.** Every per-item entry was correct throughout; only the paragraph that counted
> them was wrong. **Strike a closed row in BOTH places, or do not write the second one.**

T7's own entry, at the top of the same file, had said it closed on 2026-08-25 — one
day after the summary was written, four days before the audit.

### 12. 2026-08-29 23:42 — `175bbe865`: a stale OPEN row invents work

The third brief quote, one hour later. The table it replaced, from the diff:

| it said | actually, measured 2026-08-29 |
|---|---|
| `eval_axis_violation` — 590 lines, *"~480 code lines, never examined"* | **72 lines** (`purity.rs:1974..2045`) |
| `exec_compiled_rhs_at` — 451 lines, *"~405 code lines, never examined"* | **35 lines** (`compiled_rhs.rs:313..347`) |
| `exec_dim` — 388 lines, *"zero comments is its own defect"* | **80 lines**, and it opens with a real doc comment |

> They were decomposed and nobody struck the rows. **EIGHTH stale inherited row in this
> arc**, and the same disease as the T7 paragraph found an hour earlier — **but worse
> here, because a stale OPEN row INVENTS work.** Someone would have gone hunting ~1_400
> lines of unexamined code that does not exist.

**And measuring it was wrong twice before it was right** — this is the beat that keeps
the post honest, and it is in the same body:

> Counting braces ran past function ends on **braces inside string literals**
> (`lower_pat` came back as 1_632 lines; it is ~97). Using "the next top-level fn" as
> the boundary **swallowed to EOF** whenever a `mod` or `impl` followed
> (`eval_axis_violation` came back as 618). **Both caught by anchoring the result against
> one function read by hand.** The rule that works, given rustfmt: a top-level fn ends
> at the first column-0 `}`.

And the payoff, which is not "the table was wrong" but something better:

> **THE REAL FINDING IS NOT ON THE OLD LIST AT ALL.** The four genuinely unexplained
> functions are `apply_core_kind` (366 ln, 8%), `unpack_expr` (262, 0%),
> `filter_after_join` (259, 7%, nesting 9) and `exec` (202, 1%, nesting 7). Two of them
> … are in `expr_ir.rs`, **the ONE expression compiler every rete form now lowers
> through and the thing this arc spent weeks widening.** 568 lines between them at 8%
> and 1%, in a codebase whose exemplar row is 64%. **The hunt was reading a list written
> before that code existed.**

### 13. 2026-08-30 00:14 — `6fee011c0`: the correction goes where a reader lands

> The previous commit's body said "WHAT WAS ACTUALLY WRONG — a dead accumulator". That
> overstates it **and the builder caught it: nothing was wrong.**

Driven both ways; the two gates that redden for a genuinely broken `and` stayed green
across the change and go red when `and` is actually broken. What it cost was
**comprehension**, not correctness. And the placement decision is the beat:

> The correction goes in the **code comment** rather than a log rewrite, **because the
> comment is where a future reader actually lands.**

Plus the honest blind-spot note: *"a dead-but-correct expression is invisible to every
behavioural check by construction, and clippy cannot see it either … The only tool
that finds the class is mutation applied to the IMPLEMENTATION — a discipline this
codebase already runs on its gates, and a **known unbuilt blind spot** when turned
inward on values."*

### 14. 2026-08-30 02:43 / 04:09–04:11 — the breadcrumb's own #1, and three tries at one probe

`dc1a2693a`, subject: *"the breadcrumb's own #1 item was the thing that was wrong."*
The top work row *"sent the next self to `hash_join.rs` for a doc that is already
there, and to `session.rs` for 3 functions while `export.rs` sat at 24 unnamed as the
head of the list."* Corrected **in place, with the mis-measurement recorded rather
than quietly overwritten** — *"a number that was wrong for days is itself the lesson"*
— and the row now reads **RE-DERIVE, do not quote**.

Then, at 04:09, 04:10 and 04:11, three consecutive commits on one small probe:

- `b26eb9ab7` — *"the freshness probe promised more than it could keep."* v1 said the
  gap would be `docs/` only, *"and the very commit carrying it touched
  `src/rete/kernel/tests/mod.rs` — a comment, but the probe cannot tell a comment from
  code, so it would have fired a false alarm on a clean tree. **A probe that
  false-alarms teaches its reader to ignore it, which is worse than having none.**"*
- `533887b66` — *"the exclusion flag broke on the split it was written beside."*
  `--exclude` used `find -name`, a **basename** filter. `--exclude tests.rs` was correct
  while `kernel/tests.rs` was one file; *"the moment the same session turned it into
  `kernel/tests/*.rs` the flag matched NOTHING — no error, no warning, and the reported
  figure moved from 0 undocumented to 9."* **"This is the class the script's own header
  exists to warn about, occurring INSIDE the cure, one commit after the change that
  broke it."**
- `175a43dc2` — *"pin the freshness probe to a KIND, not a count."* **"Third wording
  today; the first two were both wrong, and that is the finding."** v2 tried to name its
  own commit hash, *"which cannot exist until the commit does."* v3 said *"expect ONE
  commit"* — invalidated by the very next `curare:` commit. **"A probe pinned to a COUNT
  rots on every subsequent write, so it is wrong more often than it is right."**

### 15. The rhythm underneath all of it

Two counts, both measured over the 214 in-window commits:

- **40** commits carry the `curare:` prefix — the record-tending ritual. That is **19%
  of the week's commits spent on the record**, before counting the 23 `record:` ones.
- **12** of those 40 do nothing but **re-point one freshness probe** at a new commit
  (`grep -c 're-point the freshness probe'` over the 214 subjects).

This is the texture the post needs and `001` does not have it: `001` gives the week's
docs arithmetic (*"75 changed nothing outside `docs/` and 155 touched `docs/` at
all"*), but not the **shape** — a ritual running twelve times in a week, whose own
instrument had to be rewritten three times in three minutes.

---

## Verbatim builder quotes, with locations

Method note: `git log --grep` over message bodies. Case-insensitive `builder` across
the 214 in-window bodies returns **52** lines. The builder's presence in *this* strand
is unusual and worth stating plainly in the post: **he is almost never the auditor. He
is the trigger.** Three of the strand's biggest findings exist only because he asked a
question whose answer was not in the file.

**3.1 — the question that found the missing items.** `03a1b9335` body ¶1:

> "what was our next step before the detour"

*"and the answer was not in the file."* This is the single best builder beat in the
unit: a routine orientation question surfaced six deleted top-level items that nothing
had failed on.

**3.2 — the question that found the unread notes.** `c99202e1a` body, §"AND THEY WERE
TRACKED IN NO LIST":

> "what items remain"

*"…and answering required an `ls`."* (Quoted in the commit as an indirect report of the
builder's ask; the exact wording in the body is `'what items remain'` in single quotes.
**Treat as reported speech, not as a verbatim utterance**, and say so if the post
quotes it.)

**3.3 — the correction that struck a claim of the apparatus's own.** `6fee011c0`, body
¶1 — again reported, not a direct quotation: *"That overstates it **and the builder
caught it: nothing was wrong.**"*

**3.4 — the ruling that moved the arc's docs.** `a20f063a6` (2026-08-25 22:38), body ¶1:

> Builder's ruling: `docs/` root is for the standing doc set; work docs belong under
> the arc.

Three files this arc had created at `docs/` root move under
`docs/arc/2026/06/278-rules-engine/`, *"Every citation repointed and PROVEN to
resolve."*

**3.5 — the ruling that deferred the docs, with a ground.** Work list, §"⏸ DEFERRED BY
BUILDER'S RULING, 2026-08-30", also in `d024afb2e`. **ALREADY QUOTED IN FULL IN `001`
— do not reuse.** Noted here only so a writer does not re-spend it.

**Quote count for this unit: 2 direct builder quotes (3.1, 3.4) and 2 reported ones
(3.2, 3.3), all in window, all located.** This is fewer than `002` or `004` carry, and
**that is itself the honest shape of the unit** — the record-audit strand is the
apparatus auditing itself, and the builder appears as the interruption that starts it,
not as the voice in it. Write it that way rather than manufacturing a quote count.

---

## The substance test — run by me

Strip every hash, date, file path and line number. What is left that `git log` does not
hold?

**Holds up:**

1. **A summary of a list rots faster than the list.** Every per-item entry in the
   theater hunt was correct throughout; only the paragraph that *counted* them was
   wrong. The mechanism is that an item has one owner and one edit site, while a summary
   has neither — it is written once, by someone reading, and nothing tells them to come
   back. The operational form is a rule: **strike a closed row in both places, or do not
   write the second one.**
2. **A stale OPEN row invents work; a stale CLOSED row merely hides it.** These are not
   the same defect and the second is much worse. The exemplar-hunt table would have sent
   someone hunting fourteen hundred lines of unexamined code that had been decomposed
   weeks earlier. Nobody would have found anything, and there would have been no signal
   that the list, rather than the search, was at fault.
3. **A finding tracked nowhere is indistinguishable from a finding that does not
   exist** — and, worse, **a finding fixed by accident is not a working process, it is
   luck.** Both notes got fixed as collateral from adjacent work. If the post has one
   sentence to spare on process, this is it: the fix rate looked fine and the intake was
   zero.
4. **A prose file cannot go red.** That is the structural asymmetry the whole unit
   turns on: thirty-four lint files, five thousand tests, a compiler that refuses things
   — and the layer that tells everyone what to do next has no failure mode at all. The
   cures the week arrived at are shaped by that: delete the count and let the array be
   the count; ban the second status site in the section's own header; put the correction
   in the code comment where a reader lands, not in a log rewrite; write a pointer that
   asserts nothing about the thing it points at, so it cannot drift.
5. **A probe that false-alarms teaches its reader to ignore it, which is worse than
   having none.** Three wordings in three minutes, each wrong differently: one promised
   a scope its own commit violated, one tried to name a hash that could not exist yet,
   one pinned to a count that the next commit invalidated. The general form: **pin a
   freshness check to a KIND, never to a COUNT** — a count rots on every subsequent
   write, so it is wrong more often than it is right.
6. **A rule written in prose that nothing runs — its confidence suppresses the audit.**
   (The record's own FM 22.) `SEAM.md` carried the rule *"if you find a second, one of
   them is lying — prune it"* while being one of four documents each claiming to be the
   single live state, and **nobody had ever run its own rule.** This generalises past
   documents: any check that exists only as a sentence acquires the authority of a check
   without the behaviour of one.
7. **A deferral's reason expires and nothing re-reads it.** (FM 23, and it recurred
   inside the week.) The mechanical cure the record arrived at is worth lifting whole:
   **when you land anything that removes a constraint, grep the record for that
   constraint's name before you commit.**
8. **The auditor's own error rate is the load-bearing evidence, not a caveat.** The
   correction of the cache citations was itself wrong and reversed in seventeen minutes;
   the exemplar-hunt measurement was wrong twice before it was right; a "finding" turned
   out to be documented behaviour rediscovered; a range edit destroyed six items and
   nothing failed. **A post that reports only the eight stale rows and not these is
   telling the flattering half**, and the record does not.

**Does not hold up without the log** (evidence, not argument): the ordinals (sixth,
seventh, eighth), the specific line counts (590→72, 451→35, 388→80), the five-day
figure, the 40/12 commit counts.

**One thing that is NOT in this unit and should not be smuggled in:** `001` already
owns *"an empty work list measures how hard you looked"*. That is a claim about
**search effort**; this unit's claims are about **transcription** — the finding was
correct and the record of it decayed. Keep them apart or the two posts blur.

---

## Explicit scope

**IN** (all author-date `[2026-08-24, 2026-08-31)`, `origin/grok-rete`):
- The three brief commits: `c99202e1a`, `c79fc5e01`, `175bbe865`.
- The strand around them: `2615e94a5`, `afb58d422`, `26a0d937a`, `2946d23ff`,
  `ee1fe443b`, `5c2c06267`, `03a1b9335`, `3c6a4920f`, `85c87314d`, `6fee011c0`,
  `dc1a2693a`, `b26eb9ab7`, `533887b66`, `175a43dc2`, `a20f063a6`.
- The two artifacts and their diffs: `NEXT-STRIKES-theater-hunt.md` (the theater summary
  and the exemplar-hunt table) and `RETE-OPEN-WORK.md` (the inbound-notes table).
- The failure-mode ledger entries minted in window: FM 20 (generalised), 21, 22, 23,
  25 (amended), 26, 27, 29, 30.
- The counts: 40 `curare:` / 23 `record:` / 12 freshness re-points out of 214.

**OUT:**
- **Everything lettered.** Class A, Classes B–F, defect families A/C. See the hazard
  section. `T7` is in — it is a theater-hunt row, not a work-list one — but the post must
  say which list it comes from in the same sentence it first names it.
- The vigilia work list itself (`001` and `002`).
- The instrument/benchmark campaign of 2026-08-30 (`002` re-scoped — though note the
  overlap risk below).
- The generative strand (`004`) — take only `fddedc205`'s "no inward ward could see
  this" and one example.

**CUTOFF:** `e6858e858`, 2026-08-30 23:54:11 −0700. The strand's last in-window beat is
the freshness-probe trio at 04:11 on the 30th, plus `6fee011c0` at 00:14. **Nothing in
this unit needs material past the cutoff**, which is one more reason to prefer it as the
second post.

⚠ **The clock.** The arc's *prose* dates are UTC; git author dates here are −0700.
Grounded: the work list at the cutoff commit carries the string `2026-08-31` three times
(lines 127, 186, 196) for events git dates at 23:03 and 23:51 on the **30th**, and
`2a7051c67` (20:59 −0700) cites `.floor/2026-08-31T03-33-26Z`. `001` used git's −0700
dates throughout; stay with it, and note it once if the post quotes a prose date.

---

## Open questions and gaps

1. **Overlap risk with the re-scoped `002`.** If `002` is re-scoped to "the
   instruments", then `dc1a2693a` (the breadcrumb's #1 was the mis-measurement) and
   `533887b66` (the `--exclude` basename break) sit on the boundary — they are
   instrument defects *recorded in* the record. **Recommendation: they belong to `003`**,
   because the beat is "the document sent the next hand to the wrong place", not "the
   number was wrong". Whoever drafts second should check.
2. **Four of the five inbound notes are not on disk.** Only
   `/home/watmin/work/NOTE-experiri-a-ward-that-executes.md` survives. Everything about
   the other four comes from the commit body and the diffed table. **The record does not
   say** where they went. Do not quote from them.
3. **The "eight of nine" tally is the record's own count, not mine.** I verified the
   sixth (`85c87314d`), the not-stale one (`3c6a4920f`), the seventh (`c79fc5e01`) and
   the eighth (`175bbe865`) by reading their bodies. **I did not independently enumerate
   rows one through five.** If the post uses the number, attribute it to the record.
4. **`5c2c06267` says the prior stamp's "2-for-2 stale" was really "4-for-4".** That is
   a *different* counter from the "sixth/seventh/eighth inherited row" one — it counts
   PILE 2 rows, not inherited rows. **Do not merge the two tallies.** I did not reconcile
   them and I do not think they reconcile.
5. **I did not run the floor or re-drive any probe.** Every floor number here is quoted
   from a commit body. The two re-driven note-fixes (`1, was 0`; `compiles and fires`)
   are the commit's claims about its own probes, which are preserved at
   `wat-scripts/scratch-pad/probe-where-before-fact-condition.wat` and
   `probe-cond-in-a-then.wat` — **a live re-run would be stronger and is one command.**
   Builder's call whether it is worth the cycle.
6. **`fddedc205`'s such-that measurement (4283 ms vs 312 ms)** is the best single number
   in the strand and it is `004`'s by rights. If `003` uses it, `004` must not.
7. **Slug.** `exemplar-003-the-record-audits-itself` as given. Title and song are the
   builder's. Working note: the phrase the record itself keeps reaching for is
   *"a summary of a list rots faster than the list"*, which is the closest thing this
   unit has to a native title.
