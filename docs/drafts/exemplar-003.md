---
title: "A Prose File Cannot Go Red"
description: "August 29, one day: the front turns its instruments on its own bookkeeping. A paragraph summarising a list of eight items says one remains — it closed four days earlier, and the same paragraph warns, one sentence up, that this list had already been stale about a different row. A table of never-examined functions claims fourteen hundred lines that measure seventy-two, thirty-five and eighty. Two bug reports from another agent sit five days in a directory nothing points at. By the record's own counter, eight of nine inherited rows audited that week were stale."
covers: 2026-08-29
written: 2026-09-08
backfill: true
sidebar:
  order: 3
---

Backfill: this covers 2026-08-29 and the week of record-keeping it sits at the end of, and was written on 2026-09-08 from the commit bodies on `grok-rete` between the merge-base `de827fb4c` and the cutoff `e6858e858`, plus the diffs to the two documents the day audits — all still on disk. Every date below is a git author date at −0700, never a date the record states about itself: the arc's prose runs on UTC, and the work list at the cutoff carries the string `2026-08-31` three times for events git puts on the 30th. Nothing was re-run; the floor counts are quoted from commit bodies. The day's three commits are the apparatus pointing its instruments at its own bookkeeping, two of them an hour apart, and the later one opens by saying so.

`wat-rete` is the rules engine inside `wat`, and this front is the attempt to hold one subsystem to a bar the rest of the tree has not been asked to meet. The bar is administered by documents: a work list, a theater-hunt ledger, an arc breadcrumb, a set of notes other agents file into a directory. Thirty-four lint files, five thousand passing tests, and a compiler that refuses things sit under the engine. Nothing sits under the documents. For one week the same instruments aimed at the code were aimed at the record instead, and the record failed worse.

## August 24–25 — the current state, in four places at once

`2615e94a5` (08-24 23:34) opens the window with the ritual already running and already producing findings about itself: "BREADCRUMB REPLACED IN PLACE, not stacked: one 2026-08-24 (THIRD) stamp supersedes both earlier same-day stamps." Two failure modes land in the same body, both the author's own, both from that session — a pipe discarding the exit code generalised to truncation losing content, with `floor.sh | tail -4` cutting the `Summary` line entirely "leaving epilogue prose that read like a clean finish"; and a blanket edit landing inside a `const X: &str` block, where an inserted `//` is program text and compiles.

Three hours later `afb58d422` says it outright — "the vigilia list driven to its floor — and the record itself was lying in four places":

> The breadcrumb had FORKED FOUR WAYS — SEAM.md, six stacked seams in DESIGN-no-hidden-failures.md, BACKLOG.md, and the true one — **each announcing itself as the one live current-state.** SEAM.md's own rule condemned the rest ("if you find a second, one of them is lying — prune it") and **nobody had ever run it.** The recovery ledger pointed at a fifth, wrong file, and its arc step exited 2. **A prior self had logged that exact defect as OWED and it sat.**

A rule that exists only as a sentence acquires the authority of a check without the behaviour of one, and its confidence is what suppresses the audit. Where the same class reaches something executable, the cure is different in kind. The grid liveness gate announced "18 axes / 9 sized + 10 where-\*" and floor-asserted `len() >= 18` while the disk held 43 / 11 + 32, "so the gate was measuring less than half the corpus while reading as current." It was fixed by deleting the counts, not correcting them — both populations now assert exactly equal to their arrays, "so the arrays are the count and there is no second place for a number to rot."

Seventeen minutes after that, `26a0d937a` reverses the auditor. A claim that `src/rust_deps/cache.rs` and `wat/cache.wat` cited a nonexistent oracle, and a provenance sentence deleted on that basis, both go back: "Oracle" in those files means a study oracle, a prior crate implementation read for shape. "My probe grepped `cache.*\$oracle`, which tests the rete naming convention, found nothing, and I read that absence as proof of absence." The real defect was duller and was the builder's: Stone 5 annihilated the crates, so five citations resolve to nothing. They were re-marked as provenance rather than as live paths — the lineage is still the honest answer to where a shape came from, it just must not send anyone hunting a deleted file. The week's first correction of the record was a confident false positive, reversed inside an hour.

The builder's one standing ruling on the documents themselves lands the same evening, in `a20f063a6` (22:38):

> Builder's ruling: `docs/` root is for the standing doc set; work docs belong under the arc.

Three files this arc had created at the `docs/` root move under `docs/arc/2026/06/278-rules-engine/`, with every citation repointed and proven to resolve.

## August 26–27 — the mechanism, named

`ee1fe443b` (08-26 15:08) mints three more failure modes, all the auditor's own, all from that day. One separates this week's disease from ordinary carelessness: "The floor printed 5098/5098; `clippy exit=101` printed three lines below it and went unread; I committed AND PUSHED on a red gate." Nothing was lost to a pipe there. It was printed correctly and not looked at.

Then `5c2c06267` (08-27 01:46) names the shape the rest of the week keeps finding:

> The root was the record, not the code. `NEXT-STRIKES-theater-hunt.md` recorded every closure by **APPENDING a block below the open list and never pruning the list**, so a section titled "WHAT REMAINS OPEN" listed rows whose closures sat 100–250 lines lower **in the same file**. **Both halves truthful; the document false; the lying half the one a reader meets first.**

The cure is "the only rung prose allows" — one row, one place, status edited inline, appending a closure below banned in the section's own header. It was deliberately left ungated, because a lint over prose is the self-certifying gate the ledger already has an entry for.

Auditing the false-open list rather than deleting it is what surfaced two live items hiding inside it. One row was in neither tally, not closed and not open; it had fallen between the two and was never re-read. Another's stated reason — that the runner lacks Clara and a JDK — expired the same day it was written, when the parity job landing hours later installed Temurin 21 and a pinned Clojure CLI. That one comes with a mechanical cure: when you land anything that removes a constraint, grep the record for that constraint's name before you commit.

## August 28 — a range edit eats six items and nothing fails

`03a1b9335` (21:51) shows what the absent failure mode buys. A python replacement of the form `s[:i] + new + s[j:]` located both endpoints by `s.index(...)`:

> I believed both fell inside item 7. They did not: the opening anchor had been written into the section PREAMBLE and the closing anchor sat at the END of item 7, so the slice spanned everything between — **top-level items 1 through 7** — and replaced them with a paragraph. **Nothing failed.** The file stayed well-formed markdown, the numbering just resumed at 8, and **every subsequent edit built on the damaged text.**

The items were restored verbatim from `c3caee1c1`, and the finding is not the bad slice. It is the detection path. The damage surfaced only because the builder asked

> "what was our next step before the detour"

and the answer was not in the file. A range whose endpoints are found rather than fixed can span more than the author believes; a count of the numbered items before and after would have caught it in one line, and no such count existed because nothing here can fail.

Eighteen minutes later, `3c6a4920f` audits three parts of an inherited row and finds all three live and accurate — "the first inherited row this session that was not stale. The streak was 6-for-6, so that is worth recording as much as the content." The row before it, in `85c87314d` at 15:13, had been closed by `97eac5a38` the day before the row was written, gated, with two fixtures. A clean audit had become remarkable enough to need a commit message.

## August 29, 00:07 — the list that did not exist

`c99202e1a` adds twenty-two lines to `RETE-OPEN-WORK.md` and two probes to the scratch pad. `~/work/NOTE-*.md` is where other agents file findings for this one. Two notes had been sitting there since 08-24: a `where` followed by a fact condition matching nothing, silently, and a `cond` that compiles inside a `where` and fails at `compile-all` in a `:then`. Both re-driven, both verified fixed — the first now selects the hit, 1 where it was 0.

The commit refuses to read that as a result:

> ⛔ **THE FINDING IS NOT THE FIXES.** Neither was made by anyone reading those notes — both are almost certainly collateral from this arc's inline-constraint and expression-lowering work. **A finding that gets fixed by accident is not a process that works; it is the same outcome as luck**, and the next one may not be adjacent to whatever is being built that week.
>
> **AND THEY WERE TRACKED IN NO LIST.** … they were found only because the builder asked 'what items remain' and answering required an `ls`. One was a SILENT WRONG ANSWER, the highest-severity class this arc recognises, and it sat for five days.

The builder's ask reaches the record as reported speech inside the commit, not as a quoted utterance, and it is the second time that night that a routine orientation question is the entire detection mechanism. What shipped is a five-row table headed "Inbound notes — the list that did not exist until 2026-08-29", carrying one instruction: when you file or receive a note, add its row here in the same motion. Four of those five notes are not on disk today, and the record does not say what became of them. A real finding tracked nowhere is indistinguishable from a finding that does not exist, and the intake rate for that directory was zero while the fix rate looked fine.

## August 29, 22:42 — the paragraph that warns about itself

`c79fc5e01` replaces thirteen lines of `NEXT-STRIKES-theater-hunt.md`, the arc's ledger of suspected performance theater, whose rows run `T1` through `T8`. The paragraph it struck, verbatim from the diff:

> The theater list above is closed **except T7**: **T1/T3/T5 struck**, **T8 cleared as not theater**, **T2/T6 struck 2026-08-24** (one defect, two hats — see their entries), **T4 was already landed and this list was stale about it**. **T7 alone remains, and it is COLD** …

`T7` had closed on 2026-08-25 in `afb58d422`, one day after that paragraph was written and four days before it was read. Its own per-item entry, at the top of the same file, said so the entire time. The fourth clause of the stale sentence is a warning that this list had already been stale about a different row, and the replacement says as much: "A reader trusting this summary would have gone hunting for a strike that had already landed, exactly as the note about T4 in this same paragraph warns."

The rule the commit writes where it happened:

> **a SUMMARY of a list rots faster than the list.** Every per-item entry was correct throughout; only the paragraph that counted them was wrong. **Strike a closed row in BOTH places, or do not write the second one.**

An item has one owner and one edit site. A summary has neither — it is written once, by someone reading, and nothing brings them back.

## August 29, 23:42 — a stale open row invents work

`175bbe865` lands an hour later against the same file, and opens by naming the hour: the same disease as the paragraph found an hour earlier. This time the stale rows were open. The exemplar-hunt table listed three functions as never examined, and the diff replaces every figure in it:

| the table said | measured 2026-08-29 |
|---|---|
| `eval_axis_violation` — 590 lines, "~480 code lines, never examined" | **72 lines** (`purity.rs:1974..2045`) |
| `exec_compiled_rhs_at` — 451 lines, "~405 code lines, never examined" | **35 lines** (`compiled_rhs.rs:313..347`) |
| `exec_dim` — 388 lines, "zero comments is its own defect" | **80 lines**, opening with a real doc comment |

They had been decomposed weeks earlier and nobody struck the rows. That makes it the eighth stale inherited row of the arc by the record's own counter, and a different defect from the one at 22:42: a stale closed row hides work, and a stale open row invents it. Someone would have gone hunting fourteen hundred lines of unexamined code that does not exist, found nothing, and had no signal that the list rather than the search was at fault.

Measuring the replacement figures went wrong twice first, and the commit keeps both attempts. Counting braces ran past function ends on braces inside string literals — `lower_pat` came back as 1,632 lines against an actual ~97. Using "the next top-level fn" as the boundary swallowed to EOF whenever a `mod` or `impl` followed, returning 618 for `eval_axis_violation`. Both were caught by anchoring the result against one function read by hand, and the rule that survives is a property of the formatter: given rustfmt, a top-level fn ends at the first column-0 `}`.

What the corrected measurement then found is not on the old list at all. The four genuinely unexplained functions are `apply_core_kind` (366 lines, 8% comment), `unpack_expr` (262, 0%), `filter_after_join` (259, 7%, nesting 9) and `exec` (202, 1%, nesting 7). Two of them live in `expr_ir.rs`, the one expression compiler every rete form now lowers through and the thing this arc spent weeks widening — 568 lines between them at 8% and 1%, in a codebase whose exemplar row runs 64%. The hunt had been reading a list written before that code existed.

## August 30, 02:43–04:11 — the instrument, three wordings in three minutes

`dc1a2693a` (02:43) turns the same treatment on the breadcrumb's own top row, which "sent the next self to `hash_join.rs` for a doc that is already there, and to `session.rs` for 3 functions while `export.rs` sat at 24 unnamed as the head of the list." It was corrected in place with the mis-measurement recorded rather than quietly overwritten — a number that was wrong for days is itself the lesson — and the row now reads RE-DERIVE, do not quote.

Then three consecutive commits, at 04:09, 04:10 and 04:11, on one small freshness probe. `b26eb9ab7` retires v1, which promised the gap would be `docs/`-only while the very commit carrying it touched `src/rete/kernel/tests/mod.rs` — a comment, but the probe cannot tell a comment from code, so it would have fired a false alarm on a clean tree. A probe that false-alarms teaches its reader to ignore it, which is worse than having none. `533887b66` finds the exclusion flag broken by the split it was written beside: `--exclude` used `find -name`, a basename filter, correct while `kernel/tests.rs` was one file, matching nothing the moment the same session turned it into `kernel/tests/*.rs` — no error, no warning, and the reported figure moved from 0 undocumented to 9. The commit names its own position precisely: this is the class the script's own header exists to warn about, occurring inside the cure, one commit after the change that broke it.

`175a43dc2` closes the trio. "Third wording today; the first two were both wrong, and that is the finding." v2 tried to name its own commit hash, which cannot exist until the commit does. v3 said to expect one commit, and was invalidated by the very next `curare:` commit. The durable form is a shape rule for any freshness check: pin it to a kind, never to a count, because a count rots on every subsequent write and is therefore wrong more often than it is right.

## A prose file cannot go red

Forty of the week's 214 commits carry the `curare:` prefix — the record-tending ritual — before counting the 23 more prefixed `record:`. Twelve of those forty do nothing but re-point one freshness probe at a new commit. That is roughly a fifth of the week spent on a layer whose instrument had to be rewritten three times in three minutes.

Every cure the week landed has the same shape, and it is not more diligence. Delete the count and let the array be the count. Ban the second status site in the section's own header. Put the correction in the code comment, because the comment is where a future reader lands. Write a pointer that asserts nothing about the content it points at, so it cannot drift. Each one removes a place where a status or a number can be written twice, because the second place is the one that rots and nothing will ever tell you.

The engine has twenty-eight lint files, a floor of five thousand tests, three independent implementations of itself and a published list of its own defects. The layer that tells the next hand which of those defects to strike has one reader, no second opinion and no red state, and by its own counter it was wrong eight times in nine that week. A bar is only as trustworthy as the document that states it, and that document is the one artifact in this tree with no test under it.

## Likely Contributions to the Field

- **A summary of a list rots faster than the list.** Every per-item entry in the theater ledger stayed correct for the whole window; only the paragraph that counted them went false, and it went false against a warning it carried in its own fourth clause. The mechanism is ownership: an item has one owner and one edit site, a summary has neither. The operational form is a rule about writing, not about checking — strike a closed row in both places, or do not write the second one.
- **A stale open row invents work; a stale closed row merely hides it.** These are different defects and the first is worse. A closed row that reads open costs one wasted lookup; an open row that reads open sends someone hunting fourteen hundred lines of code that had been decomposed weeks earlier, where nothing found is indistinguishable from nothing there. Audit direction matters: open rows first.
- **A prose file cannot go red, so every cure has to remove a second place rather than add a check.** A range edit deleted six top-level items and produced well-formed markdown; the numbering simply resumed at 8 and every later edit built on the damage. A lint over prose is a self-certifying gate — and a rule that exists only as a sentence has the authority of a check without the behaviour of one, which is how one file could carry "if you find a second, one of them is lying — prune it" while being one of four each announcing itself as the single live current state. The week's fixes therefore delete counts, ban second status sites, and write pointers that assert nothing about what they point at.
- **A finding tracked nowhere is indistinguishable from a finding that does not exist, and a finding fixed by accident is luck, not a process.** Two filed bug reports — one of them a silent wrong answer, the arc's highest severity — sat five days in a directory nothing pointed at, and both had been repaired as collateral from unrelated work. The fix rate looked healthy while the intake rate was zero, and the only reason anyone knows is that answering a routine question required an `ls`.
- **Pin a freshness check to a kind, never to a count.** Three wordings in three minutes: one promised a scope its own commit violated, one tried to name a hash that could not exist yet, one pinned to a count the next commit invalidated. A count-pinned probe is wrong more often than it is right, and a probe that false-alarms teaches its reader to ignore it — worse than having no probe.
- **The auditor's own error rate is the evidence, not the caveat.** A confident correction reversed in seventeen minutes; a measurement wrong twice before it was right; a red `clippy` exit printed three lines under a green floor and committed over. A record that reports only the eight stale rows it found and not the four errors it made while finding them is the same artifact it is indicting.
