# Working notes — uiol-009, arc 118 closure (2026-04-20 → 2026-08-19)

**Status:** raw notes, not a draft. Written 2026-09-08 by a reader working the
`wat-rs` backfill. Everything below is grounded against the working tree and git
history in `/home/watmin/work/holon/wat-rs`, read this session. **Nothing in
`wat-rs` was edited.**

**Unit:** a CLOSURE post for the front *wat Under Its Own Law* — the language made
subject to the discipline it imposes on its users. Not "language maturity."

**Title and song-drop are ALWAYS the builder's call.** Working images below, not
proposals.

---

## ⚠ READ FIRST — 1. Two findings the arc's own record does not carry

### FINDING A — the memoization the builder annihilated on 2026-06-27 was back on disk on 2026-08-16, and the commit that put it back **deleted his ruling from the source to make room for it**

This is the sharpest thing in the arc and **no arc-118 document says it.** The arc
treats the memo as an ambient property of the substrate that it discovered and
removed. The disk says it was 46 hours old.

The sequence, every step verified:

- **2026-06-27 05:55 — `74883c154`** (*"118.1: lazy-seq foundation — SINGLE-PASS, no
  memoization"*). The first foundation cut had an `OnceLock` memo, Clojure-faithful.
  The builder overrode it, and the commit body carries the ruling verbatim:
  > *"i do not believe we should have memoize at all ... you cannot walk back a
  > stream — if you want this you gotta write it, you go solve the rewind buffer —
  > core does not ship it."*

  The same commit writes the consequence into the source as a doc comment on
  `realize`, and into `DESIGN.md`: *"The holding-the-head footgun **evaporates** (no
  cache to pin) — constant-memory streaming is now **unconditional**."*

- **2026-08-16 16:57 — `1eaf83ce8`**, subject: *"process spawn returns; **stream cells
  cache WHNF**; grant is process-only."* A three-subject maintenance commit; the
  stream change is the middle clause. Its body:
  > *"lazy/map cells promised OnceLock and did not have it — empty?/first/rest each
  > realize, so mapv ran f three times per element. **Cache WHNF on the cell. That is
  > not rewind.**"*

  `git show 1eaf83ce8 -- src/stream/mod.rs` adds `pub forced: Arc<OnceLock<Arc<Stream>>>`
  to **both** `LazyCell` and `NativeLazyCell` — and **deletes the builder's ruling
  from the file.** Removed in that diff, verbatim:

  ```
  /// SINGLE-PASS — no memoization (builder, 2026-06-27). The thunk runs each time it is
  /// reached; a stream is walked once and can't be rewound. Re-forcing the same cell is a
  /// consumer error, not a supported operation — want rewind, build the buffer yourself.
  ```

  Added in its place:

  ```
  /// - `Thunk` / `NativeThunk` → force the closure, cache WHNF on the cell, recurse
  ///   if the result is still a thunk. `empty?`/`first`/`rest` on the same cell
  ///   share that cache. Dropping the Cons and trying to recover the head is still
  ///   impossible — that is the single-pass rule.
  ```

  The dated ruling was replaced, in the same commit as the patch, with a *narrower
  restatement of the rule that the patch happens to satisfy.* "That is not rewind" is
  true. It is also not what the ruling was protecting.

- **2026-08-17 13:31 — `61f1ee647`**: 585 B/element, linear, measured. The memo is one
  day old.
- **2026-08-18 14:54 — `b1d876f69`**: both memos deleted. Life span: ~46 hours.

**Verified negative:** `git log -S'forced' -- src/stream/mod.rs src/seq/mod.rs`
returns exactly four commits — `74883c154` (2026-06-27, removes it), `a9878d460`
(2026-07-03, the flip; adds `NativeLazyCell` **without** a `forced` field — checked
the hunks), `1eaf83ce8` (2026-08-16, adds `forced` to both), `b1d876f69`
(2026-08-18, deletes both). There is no fifth. The memo genuinely did not exist
between 2026-06-27 and 2026-08-16.

**Verified negative, the record:** `grep -rn "1eaf83ce" docs/ src/ wat/` returns one
hit and it is in arc 294, unrelated. No arc-118 document dates the memo's arrival,
names the commit, or notes that a 2026-06-27 ruling was overwritten. `MEASURED-118.B-the-lair.md`
§3 presents the two memos as a *discovery* (*"There are two, and stone B must dispose
of both"*). `f9db19297` calls `forced` **"THE DEFECT"** with no date on it.

**Why this is load-bearing and not a nitpick.** It gives the post a second instance of
the exact mechanism R5 names, one tier down and twelve weeks later, and it is the
instance that makes the mechanism *general* rather than a one-off archaeology story:

- **R5's instance (2026-04-20):** a law (*"Absence is signal — ask why is this
  missing?"*) evaded by substituting a different question (*"has a caller demanded
  it?"*).
- **This instance (2026-08-16):** a ruling (*"core does not ship the rewind"*) evaded
  by satisfying its **letter** (*"that is not rewind"*) while reintroducing the cost it
  existed to prevent — and rewriting the recorded law to match.

Both were caught by **measurement**, not by any gate. R5's own sentence covers both:
*"every gate we own checks whether an ANSWER is true; none check whether the QUESTION
was the right one."*

### FINDING B — `428b49c62`'s summary sentence contradicts its own table. Do not quote it.

`428b49c62` (2026-08-17 15:09, *118.10 — the pull primitive*) carries this measured
table:

```
                      f/element    250k         1M          Δ/elem
  memo ON (today)        1x  ✓    184,016 KB   622,928 KB   585 B
  memo OFF               3x  ⛔    109,768 KB   325,972 KB   288 B
  mapv (eager, no stream) 1x      109,836 KB   326,188 KB   288 B
```

Two paragraphs later the same body reads:

> *"NEITHER COLUMN IS SHIPPABLE: memo-on is silently wrong for any effectful f;
> memo-off OOMs."*

**The two halves are swapped.** Per the table, memo-**off** is the 3× column (the
correctness hazard for an effectful `f`) and memo-**on** is the 585 B column (the OOM).
`b1d876f69` settles it independently: *"first/rest/empty? still ACCEPT a Stream, so USER
code can still write the three-call walk — and **with no memo** it now runs their
function **3x per element**."* The *claim* the sentence makes — that there is no
acceptable point on that axis — is correct and is the whole reason `next` exists. Write
it in your own words from the table; do not quote the sentence.

---

## ⚠ READ FIRST — 2. Three things in the INSCRIPTION that need a qualifier

Not disagreements with REALIZATIONS (see STOP-1 below — that trigger did **not** fire).
Just places where a literal reading of the closure document would put a false sentence
on a public page.

1. **"`wat/stream.wat` is GONE."** True on 2026-08-19. **False at HEAD.** The file was
   annihilated by `16871090b` (2026-06-27, *"118: ANNIHILATE wat/stream.wat"*), and the
   **path was reclaimed for an unrelated purpose 18 days after inscription** by
   `29332e0bc` (2026-09-06, arc 296 J) — it now holds the wat declaration of
   `:wat::stream::NextOutcome`. Say "annihilated 2026-06-27," not "is gone."
   (`wat/list.wat` **is** gone at HEAD; deleted `5d16c933a`, 2026-06-27.)

2. **"Opened as arc 004 on 2026-04-20."** Exact, but compressed. Arc 004 was *opened
   and inscribed on the same day*: DESIGN `a679cd31c` at 15:09, inscription marker
   `5c438bf74` (*"docs: inscription markers — arcs 003 and 004 complete"*) at 21:54,
   both 2026-04-20. **Arc 118's own directory begins 2026-05-01** (`285e9c1de`, *"docs(arc
   118): scope lazy seqs vs threaded streams (refines arc 004)"*). So the four months
   is 004-inscribed → 118-inscribed; arc 118 itself is 3½.

3. **Type syntax has moved since inscription.** The arc writes `Seqable<T>`,
   `Stream<T>`. HEAD writes `(Seqable :- [T])`, `(Stream :- [T])` — angle-bracket
   parametrics were made illegal by `ab52b7188` (2026-08-22), three days after the
   inscription. Quote the arc's spelling for the arc's story; do not paste HEAD.

---

## The hook / through-line (one paragraph)

For four months `wat` shipped a thing called a lazy sequence that was a channel and a
thread handle, and the reason it stayed that way is written down, by us, in our own
closure paperwork: arc 004 was inscribed complete on 2026-04-20 carrying **two
sentences on the same page** — *"Absence is signal — when a feature expected in a mature
language isn't there, ask why is this missing? before patching,"* with a numbered
procedure, and, in the deferral section three inches below, *"in-process lazy chains
haven't been demanded by a caller."* The law was not broken; a **different question** was
asked, and the different question was itself a named house discipline
(*"stdlib-as-blueprint discipline: each combinator ships when a real caller demands
it"*), so nothing screamed. Four months later the same evasion happened again in
miniature — a maintenance commit reintroduced the memoization the builder had
annihilated, pre-defended it in its own message (*"Cache WHNF on the cell. That is not
rewind"*), and **deleted his dated ruling from the source file to make room** — and it
was caught not by a gate but by a `/usr/bin/time` series that said 585 bytes retained
per 8-byte element. What closed the arc was the builder refusing the whole category:
***"we do not do conventions - we do walls - users may not make mistakes in wat."*** So
`first`, `rest`, `empty?` and `nth` were made to refuse a `Stream` outright, and the
three-call walk stopped being discouraged and started being **unspellable**. The wall's
first catch was not a user. It was the stdlib: flipping the capability bits on a scratch
build took the floor from 4747 green to **1802 passed / 2945 failed**, every one of them
cascading from a single line — `wat/service.wat:468`, `defservice`'s own macro body,
calling `first` on a `Stream`. **The language was the first violator of the law it
wrote for its users.**

Working images (builder's call): *the wall's first catch was the stdlib* · *a law and its
exemption on the same page* · *that is not rewind*.

---

## The story beats, in order

All times are commit author times, `-0700`. Hashes are 9-char.

### Act I — the deferral, and the second deferral (April–May)

- **2026-04-20 15:09 · `a679cd31c`** — arc 004 DESIGN, *"design for lazy sequences + CSP
  pipelines."* Its conceptual reference is Ruby's `Enumerator.new`, translated by
  **substituting an OS thread for each Fiber** (quoted in 118's `DESIGN.md:120-128`).
- **2026-04-20 21:54 · `5c438bf74`** — arc 004 inscribed complete. Same day it opened.
  What shipped under the name *Lazy Sequences*:
  ```
  :wat::std::stream::Stream<T>  =  (Receiver<T>, ProgramHandle<()>)
  spawn-producer · map · filter · fold · chunks · for-each · collect
  ```
  A channel and a thread handle. Arc 118's own DESIGN passes the sentence, and it is
  ours, not borrowed: ***"built wrong, successfully."***
- **The two sentences, both in `004/INSCRIPTION.md`, both verified this session:**
  - `:120` — *"**Lesson 1: Absence is signal.** When a feature expected in a mature
    language isn't there, ask *why is this missing?* before patching. The gap often
    points at real substrate work — not a one-line edit."* With a 3-step numbered
    procedure at `:133`, and a closing section at `:174` headed *"Two directions of
    'absence'"* — the file thought about how to read an absence **twice**.
  - `:192-195`, under *"Not shipped (intentionally — stdlib-as-blueprint discipline)"* —
    *"Level 2 iterator surfacing… The cross-thread channel flavor covers the main app
    need; **in-process lazy chains haven't been demanded by a caller.**"* Followed at
    `:197` by the discipline stated as policy: *"each combinator ships when a real
    caller demands it, with a citation."*

  ★ **Sharpening available and it is mine, not the arc's:** R5 calls this a *question
  substitution*. The disk shows something stricter — the substitute question was a
  **named, documented, load-bearing house discipline**, sitting three lines below the law
  it displaced. Two laws in one file, applying to the same object, pointing opposite
  ways, and the one that costs nothing to obey won. That is why nothing screamed: the
  deferral was *compliant*.
- **2026-05-01 15:03 · `285e9c1de`** — arc 118 opened: *"scope lazy seqs vs threaded
  streams (refines arc 004)."* Builder direction quoted in the body: *"i want lazy seqs
  and threaded streams... **we only use threads to guard mutable state — the metric.** if
  the producer isn't guarding mutable state they don't need to be in a thread."*
- **2026-05-01 15:10 · `b5d4d0f1a`** — *"DESIGN settled, impl deferred."* The **second**
  deferral, and this one is explicit and the builder's: *"i agree with C... get 118
  updated with this and we'll close it out before we close 109.. **but we are not going
  to work on 118 any time soon.**"* Option C = closures + recursion + thunks, not fibers,
  not threads.

### Act II — reclaimed by force, not by demand (June–July)

- **2026-06-27 04:36 · `42b809fb2`** — reclaimed. And the reason is the point: **not a
  caller demanding it.** Arc 295's chunk-read signed eval needed a length-bounded byte
  stream off the wire, and a bounded byte stream *is* a lazy seq. Builder: *"we just
  reclaim 118 and build that out completely then come back to 295."* The thing deferred
  for demand was dragged into being by a **security doctrine**.
- **2026-06-27 05:55 · `74883c154`** — 118.1, the single-pass foundation, and the
  no-memoization ruling (Finding A above).
- **2026-06-27 · `16871090b` / `5d16c933a`** — `wat/stream.wat` annihilated, the
  `:wat::stream::*` namespace reclaimed for the lazy family; `:wat::list:: → :wat::seq::`.
- **2026-07-03 · `a9878d460`** — 118.2a, **the flip**: the eager Rust HOF intrinsics
  retire, `:wat::core::map` returns a `Stream`. ~107 sites go red; the cascade is the
  progress meter. This is R2 (*STRICTVM ARDET, FLVMEN SVRGIT*).
- **2026-07-03 · `b831b25dc`** — 118.2Z strike A, the lazy transformer family — **shipped
  as seven `-stream` twins**, which is the receipt for the missing type and the thing the
  August work exists to delete.

Then arc 118 goes quiet for six weeks.

### Act III — one week in August: everything the record got wrong about itself

The whole of route B is **2026-08-17 01:22 → 2026-08-19 00:06**. Under 48 hours of
wall clock for the stones, ~20 commits. What is striking is how much of it is the arc
**refuting its own record**, out loud, in its own commit titles.

- **08-17 01:22 · `9489c2575`** — *"Seqable's three recorded blockers are STALE — it is
  spellable TODAY, proven by probe."* Builder asked: *"is Seqable a thing in wat right
  now? did we plan this and never make it?"* Answers: no, it does not exist (11 code
  occurrences, **every one a comment**); yes, it was planned, named across 18 documents
  from 2026-06-21 to 2026-08-16. And ★ **the comment postdates its own refutation by a
  month**: `src/collection/infer.rs:638` (written 2026-07-31) says *"no builtin satisfies
  any surface today"*; `tests/types/probe_arc293_acceptance_demo.wat:33` does exactly that
  and had been **green in the floor since 2026-06-28**. The probe took four minutes.
- **08-17 01:29 · `e1dbc5364`** — and 7 minutes later the arc refutes *itself*: the
  "full design type-checks today" claim was **declaration-only**. `--check` exit 0 on a
  file that declares a generic fn over a surface and never calls it. Add four call sites
  → 4 × `TypeMismatch`, `:sq::Seqable<?454>` vs `:wat::core::Vector<wat::core::i64>`.
  The real blocker was **parametric satisfaction**, and it *"was never written down
  anywhere."*
- **08-17 01:34 · `4603e900c`** (`MEASURED-118.3-B-…`) — and the real blocker is **one
  match arm doing a string compare.** `src/check.rs:14858-14869`, the
  `(Parametric, Parametric)` arm, compares `format_type(&e)` = `":sq::Seqable<?454>"`
  against the registered edge `":sq::Seqable<T>"` stored verbatim. `"<?454>" != "<T>"`.
  ★ It is the house's own named recurring class (the arc-278 corollary in
  `holon/CLAUDE.md`), **fourth instance**, and it cost two months of "Seqable is blocked."
  The tell is one function away — `types.rs:745`,
  `vec![fq.clone(), format!("{fq}<T>"), format!("{fq}<Xt>")]`: someone hit the same
  disease on the sub side and patched it by **hardcoding the letters `T` and `Xt`.**
- **08-17 03:05 · `ac766e66f`** — 118.4 rules `empty?` refuses a Stream, derived from
  Ruby (`e.empty?` → `NoMethodError`), builder: *"ruby's bias."*
- **08-17 13:06 · `09d818302`** — ten hours later that ruling is **STRUCK by
  measurement**: `(empty? some-stream)` type-checks *and runs*, and **the stdlib depends
  on it** (`wat/seq.wat:457`, `keep-stream`'s own body). The commit names its own error
  exactly: *"I read `measurable() => false` and INFERRED WHAT IT GATED rather than
  testing it. … **A capability table is a design sentence too.**"*
- **08-17 13:31 · `61f1ee647`** — the number that ends the taste argument. 585 B/element,
  linear, four points. (Full mechanism below.)
- **08-17 13:41 → 14:13 · `83b287d7a` → `f9db19297`** — 118.9 is drawn, and **32 minutes
  later killed by its own author**: *"⛔ 118.9 IS WRONG — it proposes the thread-per-stage
  design arc 118 already killed."* The epitaph was on disk the whole time
  (`stdlib.rs:226`) and had not been read. *"THIRD VARIANT TODAY of the same failure:
  found prior art, did not read what replaced it and why."*
- **08-17 16:41 · `c1b98fd8c`** — *"the twins were already ruled a crutch — and that
  ruling's premise expired."* 278's 2026-07-31 stone scored the Seqable route a flat **NO
  on Simple** on three blockers; all three were refuted the same morning, and **the
  artifact that files the decision was never updated.**
- **08-17 17:00 · `5069fd058`** — every fork four-questioned, **every option, flat
  YES/NO** (`DECISIONS-118.B-four-questioned.md`). The forced enumeration earns its
  keep: option C ("Seqable as the type, native bodies") **reads best of all four and
  fails Honest** — *"It ships the split brain it claims to close"* — and had not been
  listed at all in the prior round.
- **08-17 17:22 → 08-18 03:29 · `488eacd0f` … `892ed17ce`** — B1 mints
  `:wat::core::Seqable<T>`; B1a takes the Var gate off; B2 collapses six verbs to one
  clause each (**30 arms and 7 twins gone**); B2c/B2d open the two checker doors.
- **08-17 21:26 · `20fd3b550`** — a side finding that is a whole beat: a `defclause`
  head **does not tail-call.** Measured, byte-identical bodies over a 200k Stream:
  clause head → **SIGSEGV**; plain `defn` → completes. And it is not a stream defect:
  ***"EVERY defclause in wat is non-tail-recursive today.***" The apparatus had written
  the gap into a `wat/seq.wat` comment **as an established fact of the language** and
  routed around it. Builder: *"that is very, very wrong.... how do we add TCO to clauses,
  now?"*
- **08-18 14:54 · `b1d876f69`** — B3: both memos deleted. `distinct (range 0 8000)`
  goes `rc=137 SIGKILL at a 2G cap` → `rc=0, prints 8000`. Retention slope **3,188 B/elem
  → 0.38 B/elem**, flat across an 8× range. And the line that explains the whole tier:
  ***"THE CACHE WAS NEVER AN OPTIMISATION. Its only job was hiding the three-call
  first/rest/empty? walk the stdlib itself used."***
- **08-18 15:45 · `58ed22e12`** — **B4 drawn. The wall.** Builder's ruling: *"we do not
  do conventions - we do walls - users may not make mistakes in wat."* Two things land
  here and both are beats:
  - The probe that refuted the orchestrator's own preferred option (close `rest` only):
    5 elements, no memo — **A next-only 6 forced (n+1) · B empty?+next 11 (2n+1) ·
    C empty?+first+next 16 (3n+1)**. Walk C uses **no `rest`** and pays the full 3×.
    *"One probe settled what two rounds of prose did not."*
  - The blast radius, **measured on a scratch build, not predicted**: flip the two
    capability bits → `cargo build --release` **CLEAN** (the compiler catches nothing),
    floor **4747 run, 1802 passed, 2945 FAILED.** And the honest reading, in the commit's
    own words: *"2,945 is a **CASCADE DEPTH, NOT A VIOLATION COUNT.** Every arm carries
    one cause: `wat/service.wat:468` calls `first` on a Stream inside `defservice`'s macro
    body, so `wat/cache.wat:195` fails to expand, so the stdlib never loads."*
    ★ *"The failure is a RUNTIME TypeMismatch, not a check error — which proves both
    halves of the wall are required; **a checker-only wall would have let the stdlib's
    own violation through.**"*
- **08-18 15:52 · `0f421137f`** — the builder's question saves the wall from removing a
  capability: *"do we just redefine nth to be (first (drop X n))?"* Answer no — but the
  question found that `(first (drop X n))` is **the language's only general positional
  lookup** (`drop` takes `Seqable`; `nth` took `Vector` only), and B4-iii was about to
  close it. *"I would have shipped a wall that removed a capability without replacing
  it."* The stone becomes three strikes: widen `nth` (B4-i) → codemod (B4-ii) → wall
  (B4-iii).
- **08-18 18:00 · `8f5252a00`** — B4-0: `nth` promoted to a Rust intrinsic **with its
  specification kept in wat as an oracle** (`nth-spec`, four arms, its own bodies, no
  delegation), plus an 8-row differential. Two findings the brief did not know, both real
  and both about *promotion*: a second purity gate exists that a new dispatch arm makes
  you subject to; and *"PROMOTING A defclause TO AN INTRINSIC IS NOT SEMANTICALLY FREE"*
  (a multi-arm defclause unifies the receiver; a hand-written classification arm does
  not).
- **08-18 19:23 · `8c28ace25`** — B4-ii: the recorded codemod. `(first (drop X n))` →
  `(nth X n)`, **44 sites, wat rewriting wat**, and `wat/fix.wat` **migrated itself** — 5
  of the 44 — *"which its own header calls the proving point."* Idempotent, and the pair
  is what proves it: census-returns-0 alone would pass on a codemod that mangled the
  corpus; second-run-no-diff alone would pass on one that did nothing.
- **08-18 20:42 · `71c7e4eaf`** — **THE WALL IS UP.** `first` / `rest` / `empty?` /
  `nth` stop accepting a `Stream`. And the arc's own instrument post-mortem, in the
  commit: *"the arc's three instrument failures, in order: the census chose the wrong
  DIRECTORIES; the codemod matched the wrong VERB; the dry run covered three of FOUR
  doors. **Each answered the question I asked instead of the question that mattered.**"*
- **08-18 21:08 · `c7b119018`** — a follow-up worth a sentence in the post: the refusals
  shipped as *"parameter #1 expects <a whole sentence>"*. Restored to type-list-first.
  ★ *"A refusal that only says what you may NOT pass leaves the reader to guess what they
  MAY."*
- **08-18 21:52 · `29dc58623`** — B5: the drain goes native, **529ms → 22ms** at
  n=200,000 (~25×). Same shape as B4-0: the public name goes to Rust, the **oracle stays
  in wat** and is a real independent walk, not a delegation.
- **08-18 23:08 · `30be59b68`** — B6b: `foldr` retired. It was `reverse` + `foldl`
  wearing a name borrowed from Haskell, where the verb is distinct **only because it is
  lazy**; wat is strict. Builder's ruling: *"delete foldr"*, after the question that
  settled it: *"is our foldr wrong?"* ★ And the retirement **had to build its own
  refusal**, which is the finding: deleting the dispatch arm produced *nothing* —
  `:wat::core::totally-invented-verb 1 2` → **rc=0, accepted**, while
  `:user::totally-invented-verb` → rc=1. `check.rs:5568` is *"silent-by-intent"* and the
  narrowing that can emit `UnknownCallee` is gated on `!k.starts_with(":wat::")`. **A
  plain typo in a `:wat::` verb still type-checks green.**
- **08-18 23:55 · `f93ce061e`** — B8: `dorun` stops building a Vector to throw it away.
  8× the input, **+168 KB = 0.4%.** Flat. Floor **4772/4772**, clippy 0, ignores 13, own
  invocation, quiescent tree.
- **08-19 00:06 · `ba3bd70cb`** — **INSCRIBED.** *"ARC 118 INSCRIBED — lazy seqs, opened
  as arc 004 on 2026-04-20, closed 2026-08-19."*

### The coda that belongs in the post

The inscription commit's last section is the arc catching **its own closure gate**
mid-close:

> *"⚠ AND THE GATE ITSELF HAD A HOLE, found by running it. The documented
> pre-INSCRIPTION grep was `-oE`, so `out of [a-z...]*scope` could only match LOWERCASE
> — but the affirmative form is a SENTENCE OPENER ("Out of arc N's scope. Tracked in
> ..."), so **the one phrase the gate most needs to surface for judgement was the one
> case it could not see.** It under-reported the acceptable form, and would also have
> slipped "Out of scope; we'll get to it" — a real false-pass path. Fixed to `-oiE` …
> Re-run: 5 affirmative cuts now surface, each judged, each with a home."*

An arc that closes on "we evaded our own law four months ago" finds, in the act of
closing, that the instrument built to catch exactly that evasion was **case-blind to the
honest form of it.** That is the last beat.

---

## The mechanism, precisely

A reader should leave understanding **why a lazy sequence needs a wall and not a
convention**, and it comes down to one sentence: *a single-pass stream's READ and
ADVANCE are one act, and any API that separates them is a lie about what the thing is*
(`MEASURED-118.B-the-lair.md` §4, marked there as *derived, not preferred*).

### 1. The walk protocol was three verbs where the thing has one act

wat's Stream API was `empty?` → `first` → `rest`. Each is Rust-native and dispatches on
the **value's kind**, not on a declared parameter type — so *any* call site holding a
Stream could three-call-walk it whether or not it declared `Stream<T>` anywhere. Three
independent `crate::stream::realize` calls on **one cell**:

```
MEASURED, 5 elements, no memo  (58ed22e12)
  A  next-only              6 FORCED  = n+1     1x per cell
  B  empty? + next         11 FORCED  = 2n+1    2x per cell
  C  empty? + first + next 16 FORCED  = 3n+1    3x per cell
```

So the user's function ran **three times per element** — and *"we don't know if the func
has side effects."*

★ **And the reframe that changes what the fix is** (`MEASURED-118.B-the-lair.md` §6):
the *native* walkers never had this defect. `lazy_take_stream` (`src/collection/transform.rs:181`)
and `eval_vec_drop`'s loop call `realize` **once** per cell and destructure the `Cons`.
**The three-call walk is a wat-side-only disease.** It existed because wat's whole Stream
API was those three verbs. Rust never lacked the fused pull; `next` is wat finally being
given it.

### 2. The memo fixed the symptom and created a worse one

`forced: Arc<OnceLock<Arc<Stream>>>` restores 1× — and **each cell pins its successor**,
so anything holding the head retains the entire realized chain:

```
MEASURED  (61f1ee647), range → lazy map → into
  N            maxRSS        Δ/element
  100,000       96,304 KB      —
  250,000      184,016 KB     585 B
  500,000      330,232 KB     585 B
  1,000,000    622,928 KB     585 B      ← perfectly linear
  control: 1M range + length, no stream ....  90,984 KB  0.23s
                                              = 6.8x memory, 14.7x wall
```

The payload is **8 bytes**. Retained: **585** — **73× the data.** 10M elements ≈ 5.8 GB:
an OOM, not a slowdown. **A lazy pipeline in wat was O(n) in memory — which is the entire
thing laziness is for.**

★ And the reason "don't hold the head" is not available to wat as a discipline:
***"BINDING A STREAM TO A NAME HOLDS ITS HEAD FOR THE WHOLE BODY. In wat you always hold
the head, because you always name the thing."*** Clojure survives this because its
community learned the hazard the hard way. Importing it into a strongly typed substrate
aimed at a bytecode compiler is the trade the measurement refuses.

The wat-closure generator population is **9.1× worse** than the native-map-chain
population — 3,124 B/elem vs 343 B/elem at n=400,000 (`MEASURED-118.B-the-lair.md` §5) —
and that is *exactly the idiom the builder described* (the paginated Ruby-Enumerator
producer). **The tier's headline cost had been quoted from its cheap half.**

### 3. `next` — one force, structurally, not by cache

```
(:wat::stream::next s) -> NextOutcome<T> { Item[value, rest] | Exhausted }
```

One force per cell → nothing to dedupe → no cache → no cell→tail link → **cells free
behind the cursor.** `f` runs once **structurally**, not because a cache holds it to
one. The end is a **named arm**, closing `first`'s bare-nil hole in the same motion. It
is `Iterator::next`'s shape, returning the tail rather than mutating, because wat is
persistent. **And the thunk stays** — no channel, no spawn, no crossbeam: 118 killed
thread-per-stage on 2026-06-27 and `next` does not walk it back.

The load-bearing consequence: ***"The three-call sequence then HAS NO FORM — one call
hands you both halves."***

### 4. The wall — and why a convention could not have done it

`58ed22e12` enumerates five options and four-questions each; only "close all three"
survives, and the *reasons the others die* are the mechanism:

- **Close none, delete the memo anyway** — fails Honest. Two ways to walk, one silently
  wrong for any effectful `f`.
- **Close `rest` only** — fails Obvious *and* **does not work**: `(first s)` then
  `(next s)` is still two forces of the same cell. Closing the tail does not close the
  hazard, because the hazard is *any pair of operations that separately force.* (Row C
  of the probe above uses no `rest` and pays 3×.)
- **Keep everything** — fails Honest; the memo is *why* an effectful `f` appears to
  work, so it keeps a correctness lie standing.

The three doors close by **three different mechanisms**, and that asymmetry is worth a
line: `first` and `rest` are one capability bit each (`StreamContainer::indexable()`,
`has_tail()`); **`empty?` had no compile-time gate at all** — its scheme is
`∀T. T -> bool` (`check.rs:19836`) and the runtime routes around the capability table
with a hardcoded `if let`. The single-source-of-truth table had one door hand-written
*above* it.

Live at HEAD (`src/check.rs:10192`, `src/collection/eval.rs:1304`), and note that every
refusal **hands the user the door**:

```
:wat::core::nth: parameter #1 expects (Vector :- [T]), (List :- [T]),
  (PersistentVector :- [T]), or WatAST — a lazy (Stream :- [T]) has no O(1) nth;
  use (drop s i) then :wat::stream::next
```

### 5. Why `nth` had to be *widened* before it could be *closed*

The cleanest small illustration of extirpare's ladder in this arc. `nth` over a Stream
is **quadratic by construction — 21 forces for i=0..5 (n(n+1)/2), vs 7 for a next-walk**
(`DESIGN-STONE-118.B4-iii-the-wall.md:43`). But `(first (drop X n))` was the language's
**only general positional lookup**, and the wall closes it. So: **widen** `nth` to
`Seqable` (mint the door) → **codemod** 44 sites onto it → **close** the three doors.
Rung 1 convention → rung 2 check → **rung 3: the mistake has no form.**

---

## Verbatim builder quotes, with locations

Method note: `git log -S` pickaxes diff content and returns nothing for these;
`git log --grep` and direct `git show --no-patch --format=%b` are what work. The
`REALIZATIONS.md` line numbers are from the file as it stands at HEAD (699 lines).

**The no-memoization ruling — the arc's founding cut.** `74883c154` body ¶3, and
`REALIZATIONS.md:16`:
> *"i do not believe we should have memoize at all … you cannot walk back a stream — if
> you want this you gotta write it, you go solve the rewind buffer — core does not ship
> it."*

**The dialect law.** `REALIZATIONS.md:17`:
> *"we do not strive to be clojure — we strive to be familiar. we reserve the rights to
> choose our own names and behaviors. wat is a dialect of clojure, not an impl."*

**The annihilation order.** `REALIZATIONS.md:18`:
> *"stream dies — kill stream — its been wrong since it was created — delete it —
> entirely — then rebuild it from a reclaimed namespace — your hesitation is unnecessary
> … trying to protect it is illogical."*

**The default.** `REALIZATIONS.md:19`:
> *"clojure's default behavior is lazy — we assume this behavior — users must opt into
> eager — we break what we break and we fix what we must."*

**The second deferral, in his own words.** `b5d4d0f1a` body:
> *"i think streams become fibers.. not threads... we need to impl fibers proper to
> enable this?.. i shouldn't have reached for threads?.. [after the analysis] I agree
> with C... get 118 updated with this and we'll close it out before we close 109.. but we
> are not going to work on 118 any time soon.."*

**★ THE WALL — the line the front is named for.** `58ed22e12` body ¶1, and
`REALIZATIONS.md:550`:
> *"we do not do conventions - we do walls - so.... we build a wall - users may not make
> mistakes in wat"*

**★ The retention objection that started route B.** `61f1ee647` body ¶1, and
`MEASURED-118.8-lazy-walks-retain-585-bytes-per-element.md:3-5`:
> *"i really, really really dislike the idea that we keep items around in memory beyond
> their read… if i'm in a consumer loop who grabs a million items, i need to keep a
> million in memory? that's not good."*

The commit's next line is *"HE IS RIGHT AND THE NUMBER IS WORSE THAN THE INTUITION."*

**★ Why the three-call walk is a correctness bug, not a perf bug.** `428b49c62` body ¶1:
> *"a user's func must never be called 3 times... we don't know if the func has side
> effects... that's a massive failure outright."*

and, in the same paragraph, the shape of the fix he asked for:
> *"we just need to make an ergonomic `next`... boxed in an enum that either has a value
> or a named exhaustion... that thing must support filter, map, etc."*

**★ Killing 118.9 — refusing to walk back the thread-per-stage annihilation.**
`f9db19297` body ¶1:
> *"we needed this CSP thing that doesn't put the producer in a dedicated thread... we
> need to not force ourselves back onto the 'threaded producer over a crossbeam' - that's
> not right, we started there and had to kill it."*

**★ The N-ways bar — the discriminator that decided route B.** `254ea164a` body ¶1, and
quoted as the deciding line in `DECISIONS-118.B-four-questioned.md:69-70`:
> *"we want obviousness and good ux... it may replace it... there must not be N ways to
> do a thing."*

**The four-questions instruction.** `5069fd058` body ¶1, and
`DECISIONS-118.B-four-questioned.md:3`:
> *"four-questions to inform the debate for any decisions."*

**The stale-blocker question that took four minutes to answer.** `9489c2575` body ¶1, and
`NOTE-the-blockers-were-stale-seqable-is-spellable.md:3-4`:
> *"is Seqable a thing in wat right now? did we plan this and never make it?"*

**Ruling route B.** `488eacd0f` body ¶1:
> *"B has been reasoned.... do your measurements and build"*

and, earlier the same day, `MEASURED-118.3-B-is-a-string-compare-not-a-mechanism.md:3`:
> *"B has been reasoned... go measure it."*

**★ Refusing a language gap stated as a fact of the language.** `20fd3b550` body ¶1:
> *"that is very, very wrong.... how do we add TCO to clauses, now?"*

The commit's own gloss is the sentence to lift: *"the correct response to a missing
feature being described as a fact of the language. I had written that claim into a
`wat/seq.wat` comment as established fact and routed around it with a plain-defn walker.
**That is patching the stem.**"*

**Killing `seqable->stream`.** `5a22d78aa` body ¶1:
> *"i do not know if we want seqable->stream at all... you didn't lean into this
> direction at all last night."*

**Retiring `foldr`.** `2c5d106a3` body ¶1:
> Builder's ruling: *"delete foldr"*, after the question that settled it: *"is our foldr
> wrong?"*

**★ The consumer-count argument refused, in one line — and he said it before the
apparatus found arc 004.** `REALIZATIONS.md:553`:
> *"the lack of foldr callers doesn't negate their emergence"*

R5 marks this explicitly: *"that last one is R5's thesis said in one line, months of
hindsight compressed, **and he said it before I had found 004.**"*

**The closing register.** `REALIZATIONS.md:549, 551, 552`:
> *"i wanted lazy seqs 4 months ago.... it took us a long time to get to here... we are
> finishing it.... map, filter, fold ...... they are absolutely needed....."*
> *"we do the three.... dorun is bad .... we ship them.... that's why we are here...."*
> *"118 has been a.... a long time coming....."*

**On the codemod tooling** (adjacent, `727db5ecb`, same night):
> *"wat-fix is... phenomenal... you can't miss what you know you're looking for."*

**Note the pattern, for `consonare` rule 11.** Every stone in route B opens with a
builder ruling, and in at least four cases the ruling **changed the plan the apparatus
had written**: the wall over conventions (`58ed22e12`) replaced a scoped
close-`rest`-only; the `nth` question (`0f421137f`) caught a wall about to remove a
capability; the 118.9 refusal (`f9db19297`) killed a design the apparatus had drawn 32
minutes earlier; the `seqable->stream` question (`5a22d78aa`) killed a name the
apparatus had proposed keeping. This is not a solo substrate report. Write it as the duet
the record shows.

---

## The substance test — run by me

Strip every hash, date, file path and line number. What is left that `git log` does not
hold?

**Holds up:**

1. **A law and its exemption can live on the same page, and the exemption wins because
   it is cheaper to obey.** Arc 004 wrote *"Absence is signal — ask why is this missing?"*
   with a numbered procedure, applied it correctly to a type-normalization pass, and then
   deferred its own titular feature under a *different named discipline*
   ("stdlib-as-blueprint: ships when a real caller demands it") three lines below. Nothing
   was violated. Every gate checks whether an **answer** is true; none check whether the
   **question** was the right one. This is the arc's own R5 and it is the best thing in it.

2. **A patch that pre-defends itself against a known ruling in its own commit message is
   the tell.** *"Cache WHNF on the cell. That is not rewind."* Technically true —
   WHNF caching is not a rewind buffer — and it reintroduced 585 bytes of retention per
   8-byte element, which is what the ruling existed to prevent. **The ruling's reason was
   broader than its letter, and the patch obeyed the letter and deleted the ruling from
   the source file in the same diff.** This is mine, from the disk, and it is not in the
   arc's record.

3. **The wall's first violator is the language.** Flipping two capability bits took the
   floor from green to 1802/2945, all cascading from one line inside `defservice`'s own
   macro body. The self-subjection is not rhetorical — it is a measurement, and it also
   proved a design point: a checker-only wall would have let the stdlib's own violation
   through, because the failure was a *runtime* TypeMismatch.

4. **You cannot forbid a walk; you can only make it have no form.** Closing two of three
   doors still costs 2× (row B), because the hazard is *any pair of operations that
   separately force* — not a specific verb. A single-pass stream's read and advance are
   one act, so the only honest API is the one where they cannot be split. That derivation,
   not a preference, is why `next` needs no cache.

5. **A cache that "fixes" a protocol is usually evidence the protocol is wrong.** *"The
   cache was never an optimisation. Its only job was hiding the three-call walk the stdlib
   itself used."* Delete the walk and the cache has no job. Generalizes past `wat`.

6. **A blocker note is a claim with a date on it, and a stale one is self-protecting,
   because its whole job is to stop people looking.** Three recorded blockers, two of them
   already false *on the day they were written*, consulted for two months across 18
   documents and three downstream stones — and refuted by a four-minute probe the moment
   someone asked *"is that still true?"* The real blocker was never written down anywhere,
   and turned out to be a `format!` and an `==`. **And the repair is the shape worth
   copying:** the sentence was not deleted. At HEAD it is still in the file, struck
   through, each blocker carrying the probe or score that killed it — and the standing
   order it once issued is refused *in writing* rather than silently dropped. A record
   that deletes its errors teaches nothing.

7. **Widen before you close.** A wall that removes a capability without replacing it is a
   regression wearing discipline's clothes. `nth` had to become general (rung: mint the
   door) and the corpus had to move onto it (rung: codemod) before the three doors could
   close (rung: no form). The builder's throwaway question is what found it.

8. **Promotion is not relocation.** Moving a verb from a wat `defclause` to a Rust
   intrinsic changes its semantics (a defclause unifies the receiver; a hand-written
   classification arm does not) and enrolls it in gates it was not previously subject to.
   The arc's answer — **keep the specification in wat as an oracle and let the native take
   the name** — is a reusable pattern and it shipped twice (`nth`, the drain).

9. **A retirement can discover that the refusal it assumed does not exist.** Deleting
   `foldr`'s dispatch arm produced *nothing*: an invented `:wat::core::` verb type-checks
   green because one fallback is "silent-by-intent" and the narrowing that could complain
   is gated on the `:wat::` prefix. Every retirement this substrate has shipped paid a
   per-verb patch to work around one permissive fallback.

**Does not hold up without the log** (evidence, not argument): the floor numbers
(4747 / 4760 / 4765 / 4772), the site counts (44, 30 arms, 7 twins), the stone ordering,
the millisecond benches. Cite them; do not build on them.

---

## STOP triggers — reported

- **STOP-1 (INSCRIPTION vs REALIZATIONS): did NOT fire.** I read both in full and checked
  every load-bearing number across them. They agree — floor 4772/4772 · 0 FAIL · 19
  skipped at `f93ce061`; the census (44 files / 373 defns / 12 walkers / 4 growth hits /
  exactly 1 in both, matching `f93ce061e` Part 3); the walk-shape force counts (n+1 /
  2n+1 / 3n+1, matching `58ed22e12`'s probe at n=5); the drain 529ms → 22ms (matching
  `29dc58623`); the 87%/13% split (`DESIGN-STONE-118.B5…:33,42`); the 21-forces
  quadratic (`DESIGN-STONE-118.B4-iii-the-wall.md:43`); `dorun` +0.4% at 8× (matching
  `f93ce061e` Part 1); the arc-004 lineage and both of its quotes. **Where they differ is
  in what they omit, not what they claim** — see READ FIRST §1, Finding A: neither
  document dates the memo's arrival or names the commit that overwrote the 2026-06-27
  ruling.

- **STOP-2 (dates): did NOT fire — both dates are established on the disk.**
  - **2026-04-20**: arc 004 DESIGN `a679cd31c` (15:09) and the inscription marker
    `5c438bf74` *"docs: inscription markers — arcs 003 and 004 complete"* (21:54), both
    2026-04-20 -0700. Arc 004 opened and closed the same day.
  - **2026-08-19**: `ba3bd70cb` *"ARC 118 INSCRIBED"*, 2026-08-19 00:06:48 -0700, author
    and committer date identical.
  - **Qualifier the brief's phrasing needs**: arc 118's own directory begins
    **2026-05-01** (`285e9c1de`). "Opened as arc 004 on 2026-04-20" is the *lineage*
    claim, not the arc's own start. Four months is 004-inscribed → 118-inscribed (121
    days). See READ FIRST §2.2.

- **★ STOP-3 (too large for one post): FIRES.** 78 commits touch the arc directory;
  five realizations; ~25 named stones; two design regimes four months apart. A single post
  cannot carry both the April/May design history *and* the 48-hour August build without
  becoming a changelog. **Proposed cut — take the closure question, not the arc:**

  > **IN:** the four-month gap and *why* (R5: the law and its exemption on the same page,
  > plus the stdlib-as-blueprint sharpening) · the 2026-08-16 memo re-entry as the second
  > instance of the same mechanism (READ FIRST §1) · the measurement that ended the taste
  > argument (585 B/element) · the wall, and its first violator being the stdlib · the
  > inscription's own gate having a case-blind hole. That is one post with a spine, a
  > mechanism, and a coda.
  >
  > **OUT, with a named home:** the whole `Seqable` type-system thread (the four-minute
  > probe, the parametric-satisfaction blocker, the `format!`/`==` arm, the two checker
  > doors B2c/B2d) — this is its **own post**, and a strong one, because it is four
  > instances of one named recurring class plus a two-month cost. Also out: the July flip
  > and the ~107-site cascade (R2); R3 and R4 (the seq-family-in-the-dark reading and the
  > clojure↔wat REPL over the EDN wire — R4 in particular is a self-contained piece the
  > builder himself said *"i do not care what arc it is written — it was done here"*); the
  > clause-TCO finding; the `foldr` retirement and the silent `:wat::` fallback (that is a
  > safety post, and it points at task #110).

---

## Open questions and gaps

1. **I did not run the floor.** Every floor number here (4089 / 4692 / 4747 / 4760 /
   4765 / 4772) is quoted from a commit body that says the orchestrator weighed it by its
   own `--release` invocation. If the post quotes a number, it is quoting the record, and
   should say so.
2. **I did not re-run any probe or bench.** 585 B/element, 3,188→0.38 B/elem, 529→22ms,
   the 2945/1802 dry run, the 6/11/16 force counts — all quoted from commit bodies and
   `MEASURED-*.md`. The instruments are committed
   (`wat-scripts/scratch-pad/probe-118B-dorun-retention-slope.wat` and siblings), so a
   live re-run is *available* and would be stronger. Builder's call whether it is worth
   the cycle.
3. **Finding A's "the ruling was deleted from the source" is a diff read, not a motive
   claim.** I can prove the doc comment was removed in `1eaf83ce8` and what replaced it.
   I cannot and do not claim anyone knew they were overwriting a ruling — `1eaf83ce8` is
   a three-subject maintenance commit and the stream change reads like a bug fix. **The
   mechanism does not need intent; that is what makes it worth writing about.** Do not let
   the post imply otherwise.
4. **Finding B (the swapped sentence in `428b49c62`) is uncorrected on disk.** Flag it to
   the builder; I did not edit `wat-rs`. The correct form is: memo-**off** runs `f` 3× per
   element (silently wrong for an effectful `f`); memo-**on** retains 585 B/element (OOMs
   at 10M).
5. **`src/collection/infer.rs`'s stale comment — CHECKED, and it closed. Use this as a
   beat, not a gap.** The note called it *"the single most expensive stale sentence found
   this session"* (consulted for two months, quoted in the seam, the chain doc, three 279
   stones) and said it *"should be corrected in place… Not done here."* **It was corrected
   in place, the same day it was found** — `a15f4ea95` (2026-08-17), amended by
   `f93ce061e` (B8). At HEAD, `src/collection/infer.rs:645-655` carries all three blockers
   **struck through with their refutations inline** (`~~no builtin satisfies any surface
   today~~ — REFUTED twice over…`), each citing the probe or the score that killed it, and
   the doc then strikes its own **standing deletion order**:
   > *"★ 118.B8 — this doc used to end with a standing order: 'this function's hand-rolled
   > four-head match is exactly what [minting `Seqable`] would delete.' **That premise was
   > falsified by what actually got built, so the order is struck here rather than obeyed
   > stale.**"*

   That is the closing image the whole front is about: the sentence that cost two months
   is still in the file, **with a line through it and the measurement that killed it
   beside it** — and the instruction it once carried is refused in writing rather than
   silently dropped. A record that deletes its errors teaches nothing; this one keeps them
   legible.
6. **Task #110 and the `:wat::` blanket-accept.** `30be59b68` proves an invented
   `:wat::core::` verb type-checks green, and the INSCRIPTION cuts it to arc 255.1b-iv. I
   did not check whether 255 closed it. If it did, that is a good "the law found it and
   the fix was structural" coda; if it did not, it is a live hole and the post should not
   imply closure.
7. **The floor grew after inscription** (5127 at `3ed8a89d4`, 2026-09-03). If the post
   says "4772," date it.
8. **Post-inscription drift, noted:** `3ed8a89d4` (2026-09-03) re-derived a benchmark
   ratio three arc-118/255 documents had carried on 2026-08-18's authority (cited 5.1×,
   re-measured ~4.6×) — and its handling is itself a small lesson worth a footnote: the
   **live comments** were updated with the new number and the date, while the **decision
   record** kept the original *"so the original stands as the basis of the ruling and the
   re-derivation sits beneath it, marked."* That distinction — a live comment vs. a
   decision record — is a clean idea and it is one sentence.
9. **Slug.** I used `uiol-009-arc118-closure` as given. Series placement, title and song
   are the builder's. (For what it is worth, R5's song is Falling in Reverse — *No Fear*,
   and the arc reads its key line **inverted**: *"if only I could've told what I know,
   being forty, to the younger me"* — here the younger self is the one who wrote the
   lesson down. That inversion is the closing image the record already reaches for.)
