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
