# Findings for the builder — defects the chronicle found in read-only repos

> **Why this file exists.** Writing the chronicle means reading the substrate's
> own records closely enough to narrate them, and that reading finds things the
> substrate's own gates do not. Those repos are **read-only from here** — this
> file surfaces the finding; it never fixes it.
>
> **One rule:** every finding carries a `file:line` or a commit hash, verified by
> the orchestrator against the disk — not merely relayed from the agent that
> found it. A finding that only an agent's report supports is not on this list.
>
> Struck items stay, with what resolved them. A finding that vanishes reads like
> it was never there.

---

## F-1 · `wat-rs` · arc 296's directory contradicts itself about whether the arc is closed

**Status: OPEN.** Found 2026-09-08 during the reading pass for `uiol-002`.
Verified against the disk by the orchestrator, independently of the agent that
found it.

The arc's `DESIGN.md` still declares the arc closed and points the reader at a
file that was deleted 70 days ago:

```
docs/arc/2026/06/296-diagnostics-fully-edn/DESIGN.md:3-5

  > **Status: CLOSED (2026-06-30) — slices 296.2–296.5 landed, gate 4157/0/91, awaiting orchestrator weigh.**
  > Slice 1 (the macro chain) landed at `f397aba6`. Slices 2–5 are uncommitted from HEAD `59dad529`.
  > See INSCRIPTION.md for the full close record.
```

- `INSCRIPTION.md` **does not exist** in that directory.
- `7f17054a8` (2026-06-30 10:21) **added** it, +131 lines.
- `3a4f49202` (2026-07-01 15:13) **deleted** it, −131 lines, calling it
  *"illegitimate — a sonnet wrote it inside slice 7f17054a, stamped CLOSED
  before the derive sweep even began. 296 is OPEN."*
- `DESIGN.md` has **3 commits total** and was **last touched by `7f17054a8`
  itself** — the very commit that added the inscription. It has not been edited
  since 2026-06-30.

**The withdrawal removed the file and left the claim.** A reversal is two edits;
only one was made.

What makes it live rather than cosmetic: **two younger documents in the same
directory use the inscription's absence as the proof the arc is open**, so the
directory now asserts both.

```
BRIEF-296-L-a-bare-is-err-asserts-nothing.md:14
  "296 has no `INSCRIPTION.md`; it is open."

DESIGN-STONE-K-ignore-means-one-thing.md:16
  "the ledger document still lists 246 rows, and 296 has no `INSCRIPTION.md`."
```

A reader arriving at `DESIGN.md` first is told the arc closed on 2026-06-30 and
sent to a file that is not there. This is `cohaerere`'s class exactly — a
contradiction no single document reveals, because each reads consistently alone.

**Not fixed here.** `wat-rs` is read-only from this repo. One line in `DESIGN.md`
resolves it.

### The related finding, which is the post's subject rather than a defect

The premature closure was **ordered, not rogue.** The brief written two hours
earlier ends its final slice with the instruction:

```
BRIEF-296-error-edn-trait.md:64  (### 296.5 — the wall + close)
  "Write the INSCRIPTION; flip the 296 DESIGN status to closed. **Gate.**"
```

Brief authored `59dad5295`, 2026-06-30 08:14:13. Inscription committed
`7f17054a8`, 10:21:07 — 2h07m later. The executor complied exactly with a written
instruction, and the withdrawal commit attributes the error to the executor. The
disk does not support that attribution.

This belongs in the post, and it must be written without smugness: the
correction the arc actually made was not a stricter checklist but a **property
bar** — *"296 ends with errors in the idealized state — no L1 nor L2 marks"* —
because an acceptance row that checks a mechanism's *presence* cannot falsify a
claim about a *property*.

---

## F-2 · `wat-rs` · `src/stream/mod.rs` documents a cache the code no longer has

**Status: OPEN.** Found 2026-09-08 during the reading pass for `uiol-009`.
Verified by the orchestrator against the disk.

**Small, and worth fixing precisely because the correction around it is
exemplary.** Stone 118.B3 (`b1d876f69`, 2026-08-18) deleted both memos, and
`src/stream/mod.rs:61` carries one of the better self-corrections in the tree —
it opens `⛔ THIS DOC USED TO SAY THE OPPOSITE`, quotes its own former text
verbatim, names why the cache existed (*"to hide the three-call walk the stdlib
itself used"*), names the real cost (*"making a lazy pipeline O(n) in memory,
which is the entire thing laziness is for"*), and names the replacing hazard
without deferring it.

Three doc lines above it did not get the memo:

```
src/stream/mod.rs:9    //! The *cell*'s WHNF is cached: `empty?` / `first` / `rest` on the same thunk share one
src/stream/mod.rs:45   /// `realize` forces once and caches WHNF on the cell (`empty?`/`first`/`rest` share it).
src/stream/mod.rs:153  /// - `Thunk` / `NativeThunk` → force the closure, cache WHNF on the cell, recurse
```

against, in the same file:

```
src/stream/mod.rs:58   /// SINGLE-PASS stream, and as of stone 118.B3 an UNCACHED one.
```

**The code agrees with `:58`.** `realize()` performs no write-back — it forces the
closure and advances (`current = next`); there is no `borrow_mut`, no store, no
cell mutation anywhere in the function.

`:9` is the **module-level** doc, so it is the first thing a reader of this module
sees, and it states the opposite of what the module does.

**Not fixed here** — `wat-rs` is read-only from this repo.

### The context, which is the post's subject rather than a defect

The cache these lines describe was re-introduced on 2026-08-16 by `1eaf83ce8`
against a dated ruling, and the manner is the interesting part. The diff removed

```
//! **no memoization** (builder, 2026-06-27: *"you cannot walk back a stream … core
//! does not ship it"*).
```

and wrote back

```
//! you cannot rewind the *stream* (builder, 2026-06-27: *"you cannot walk back a stream"*).
```

The quote survives. **The clause that forbade the change — `core does not ship
it` — does not.** The same diff adds *"That is not rewind."*, pre-defending
against the ruling it had just trimmed. The full ruling still stands elsewhere in
the tree (`src/value/value.rs:343`).

**The substrate caught this itself in 46 hours**, which is why this is F-2's
context and not F-2's finding. The narratable pattern: *a patch that pre-defends
itself against a ruling is the tell*, and the correction that followed is what a
working discipline looks like.

### Not a defect, but do not quote it

`428b49c62`'s summary line reads *"memo-on is silently wrong for any effectful f;
memo-off OOMs."* Its own measured table, two paragraphs above in the same commit
body, reads memo **ON** = 1× calls / **585 B per element retained forever**, memo
**OFF** = 3× calls / 288 B flat. The summary reverses both halves. `b1d876f69`
settles it independently. A commit message cannot be edited; this is recorded so
no post quotes that sentence.

---

## F-3 · `wat-rs` · arc 298's annihilated sentinel is back at HEAD, with a doc comment defending it

**Status: OPEN — and it is the largest of these three.** Found 2026-09-08 during
the reading pass for `uiol-001`. Verified by the orchestrator against the disk.

Arc 298 annihilated `Span::unknown()` — the fake `<runtime>:0:0` null object —
across either 496 or 815 sites (see F-4). Its design doc is unusually explicit
about **both** the defect and the cure that was rejected:

```
DESIGN-298.2-annihilate-span-unknown.md:9
  `Span::unknown()` claims a value was constructed nowhere
  (`file "<runtime>", line 0, col 0`). That is false: every …

DESIGN-298.2-annihilate-span-unknown.md:11
  … a fake coordinate that lies to the user's tooling (jump-to-location lands
  at `<runtime>:0:0`). The cure is not `Option<Span>` …
```

At HEAD, `src/runtime.rs:11424-11431`:

```rust
/// … a synthetic `<runtime>` location marks it honestly.
fn fault_value(message: String, location: Option<crate::span::Span>) -> Value {
    let location_value = match location {
        Some(span) => value_from_span(span),
        None => value_from_span(crate::span::Span::new(
            Arc::new("<runtime>".to_string()), 0, 0,
        )),
    };
```

Three things the arc ruled on, all three now present in one function:

| arc 298 said | HEAD does |
|---|---|
| `<runtime>:0:0` claims construction nowhere — **"That is false"** | constructs exactly `("<runtime>", 0, 0)` |
| **"The cure is not `Option<Span>`"** | the parameter is `Option<crate::span::Span>` |
| the sentinel is a fake coordinate that **lies to tooling** | the doc comment says it **"marks it honestly"** |

Landed in `6dac41b9c`, 2026-09-01 — *"STONE(109) B: the seven kernel sub-modules
mirror their edge"* — so it arrived as a passenger on unrelated work, which is
how this class travels.

**What is NOT established, and must not be asserted:** whether this is a
*reversal* or a *gap the annihilation never covered*. The reading pass's own read
— flagged as its read, not as a finding — is that arc 298 reached the Rust `Span`
type and not the wat-level `Location` field, and that the pressure which produced
the sentinel was never removed. If that is right, this is F-2's shape again: a
correction that landed on one tier while the tier below kept the defect. The
`Span::unknown()` **symbol** is still dead at HEAD; it is the **value** that came
back.

A second instance, older: `src/host/test_runner.rs:921` (`251b43b32`,
2026-07-24) reintroduced the elide-when-sentinel branch — which matters because
arc 298's tightest finding was that *killing the sentinel killed the eliding*: all
17 `is_unknown()` consumers existed only to suppress the fake.

**Not fixed here** — `wat-rs` is read-only from this repo.

---

## F-4 · `wat-rs` · arc 298's INSCRIPTION states two different site counts for one migration

**Status: OPEN. Small, and it is the reason F-3 is hard to size.**

The same closure document gives the same migration two numbers and says nowhere
which population either counts:

```
INSCRIPTION.md:30    … propped up across **496 sites** and never questioned.
INSCRIPTION.md:127   … force, 496 sites in one recompile, and the null-object died.
INSCRIPTION.md:53    … 815 sites → `rust_caller_span!()` or a threaded wat span …
```

Measured at `923887292^`: **498 `src/` + 46 `crates/` + 271 `tests/` = 815.** So
both numbers are probably true of different populations — `496` looks like the
`src/`-side figure and `815` like the whole tree — but the document does not say,
and a reader has no way to tell a scope difference from a typo.

This is the [file-count-is-not-an-item-count] class: a number is only as good as
the population it names, and this one names none.

**Not fixed here** — one clause on each line resolves it.

---

## F-5 · `wat-rs` · the excursus README's own count is wrong, and it has propagated

**Status: OPEN.** Found 2026-09-08 during the reading pass for `services-001`.
Counted by the orchestrator.

```
docs/excursus/README.md:34 (origin/sns-sqs)
  **Seventeen commit subjects still read `(301)` and always will**
```

Measured across all refs — `git log --all --format='%s' | grep -c '(301)'` — the
count is **eleven**. The named hash range holds twelve commits, eleven of which
carry `(301)`. The companion figure is fine: *"75 in-file references"* against 76
lines by `git grep -c`.

The wrong number is live in **three** places: the commit body, this README line,
and `COMPACTION-AMNESIA-RECOVERY.md:1567` (FM 21) — so it has already propagated
once inside the repo.

**It propagated out of the repo too, and that half is ours.** This site's
*Services in Anger* landing published "seventeen" for several hours because the
number was taken from the README rather than counted. Corrected to eleven, with
the page now saying the count is its own and noting the discrepancy. A README
that exists to decode misleading labels is a bad place for an uncounted number,
and it is the one document whose whole purpose is that someone will trust it.

**Not fixed here** — `wat-rs` is read-only from this repo.

### Related, same unit

`docs/excursus/2026/08/001-sns-sqs/DESIGN.md:1` still reads `# Arc 301 — SNS and
SQS` at the branch tip, four lines from a README stating *"Arc 301 does not
exist."* The move commit swept 26 files and changed that one by **zero lines** —
the unit's spine was the file the sweep skipped. Its status block is roughly
twenty hours stale.

Same shape as F-1: a correction that moved the artifacts and left the claim.
