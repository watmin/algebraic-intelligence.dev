# Working notes — services-001, the front opens and `excursus` is invented

**Status:** raw notes, not a draft. Written 2026-09-08 by a reader working the
`wat-rs` backfill. Everything below is grounded against `origin/sns-sqs`,
`origin/claude-compute`, `origin/main` and `origin/grok-rete` in
`/home/watmin/work/holon/wat-rs`, read this session. **Nothing in `wat-rs` was
edited.** Line numbers into `docs/` are line numbers *in the blob on
`origin/sns-sqs`*, not on a checkout.

**Title and song-drop are ALWAYS the builder's call.** Working images below, not
proposals.

---

## ⚠ READ FIRST — THREE THINGS. The brief's window is REFUTED, one number in the
## record is FALSE, and STOP-3 fires in reverse.

### (1) ⛔ THE BRIEF IS WRONG ABOUT THE WINDOW. The SQS build is IN, not out.

The brief and `docs/BATCH-OUTLINES.md:476-477` both say:

> **The SNS/SQS build, R69, and the chaos-engineering series are all post-cutoff**
> and belong to the first weekly.

**Half of that is false and the false half is the biggest thing in the window.**

The cutoff is defined in `docs/STORY-BRANCHING.md:606-620`: end of W10, **Sunday
2026-08-30**, and the re-pinned marker for `sns-sqs` is **`ca405009b`**. Measured:

```
git log -1 --format='%h|%ad|%s' --date=iso ca405009b
ca405009b|2026-08-30 23:48:51 -0700|UN-IGNORED(278 item-c): self-scheduling was never broken …
```

So the window runs *through the end of* 2026-08-30. And:

```
git rev-list --count ca405009b ^origin/main ^origin/grok-rete ^origin/claude-compute
36
```

**All 36 of `sns-sqs`'s own in-window commits are on 2026-08-30**, from
`fe1e923d5` at 03:18:42 to `ca405009b` at 23:48:51 — a single 20.5-hour day. And
that day contains, verbatim from the log:

| hash | time | subject |
|---|---|---|
| `fe1e923d5` | 03:18 | `DRAWN(301): SNS lands in userland — and the Store cannot delete, so SQS cannot ack` |
| `f29d27729` | 03:43 | `STONE 2(301): the Store can delete — and SQS's ack becomes expressible` |
| `17d32938d` | **18:22** | **`EXCURSUS(001): SQS lands in userland — the thing this excursus was opened to build`** |
| `903bbbf1d` | 19:16 | `EXCURSUS(001): stone 4 struck as STOP-5 — … process workers cannot consume the queue` |
| `6498817d4` | 19:56 | `EXCURSUS(001): stone 5 — the guard's reach widens, and the wrong turn is no longer reachable` |
| `0e43b7d74` | 20:23 | `EXCURSUS(001): stone 6 — Envelope moves, the queue is green, and a second instance is unmasked` |
| `4139cddfc` | **21:01** | **`EXCURSUS(001): the fan-out proof lands — 8000 outcomes, distinct, zero duplicates`** |

`17d32938d`'s own body: **"EXCURSUS 001 IS COMPLETE. Nothing owed inside it."**

**SNS, SQS and the fan-out proof are all in-window.** The post is not "paperwork
plus a promise" — the thing the front exists to build was built and proven inside
the window, on the last day of it.

**What IS post-cutoff and must be excluded**, verified:
- **excursus 002** entirely — `002-handle-lifetime-wall/README.md:3` says
  *commissioned 2026-08-31*; stones land `380abc9d3` / `f7b7ddfc0` / `3415f307a`,
  all 2026-08-31.
- the arc-278 telemetry / circuit / long-polling / perf run — `8c9dfe7a5` onward,
  2026-08-31 17:01 → 2026-09-01 23:52.
- **R69** — `c9214b092`, 2026-09-02. ✅ brief correct.
- **the chaos series** — `0b052aa48` … `bdba15848`, 2026-09-03 → 09-06. ✅ brief correct.

### (2) ⛔ STOP-1 PARTIALLY FIRES. The README's account is true except for one number, and that number is in THREE places.

The excursus README's substantive story **checks out against the history** — see
§"The 301 incident, verified line by line" below. One claim does not.

`docs/excursus/README.md:34`:

> **Seventeen commit subjects still read `(301)` and always will** — git history
> is append-only.

**The actual count is ELEVEN.** Across *all* refs:

```
git log --all --format='%h|%s' | grep -E '\(301\)' | wc -l   →  11
git rev-list --count fe1e923d5^..8e41d13be                   →  12   (0 merges)
```

The range the README names (`fe1e923d5` … `8e41d13be`) holds **12** commits, of
which **11** carry `(301)` and one is `NOTE(109): a callable keyword in value
position has FOUR KINDS and THREE ANSWERS` (`167878ec5`). There is no other
`(301)` subject anywhere in the repository. Full list in §"The eleven" below.

The wrong number propagated to **three** places, and all three are live:
1. the commit body — `331543758`: *"seventeen commit subjects between `fe1e923d5`
   and `8e41d13be` read (301)"*
2. `docs/excursus/README.md:34`
3. `docs/COMPACTION-AMNESIA-RECOVERY.md:1567` (FM 21) — *"**17 commit subjects
   still say `(301)` and always will.**"*

**The irony is exact and it is post-worthy, but write it carefully.** The very
commit that retracts an unasked arc number *also* indicts its own
`--include=*.rs` census in the same body — *"I committed BOTH errors today — the
same arc number, and the same grep filter"* — and then misreports its own residue
by six. The lesson the commit is writing down is the lesson it is simultaneously
failing. **This is a finding for the builder, not a gotcha for the post's
opening; the post should state it plainly and move on.**

The README's *other* number holds up. "75 in-file references" — at
`331543758^`, `git grep -c '301'` over the moved directory returns **67 matching
lines**, plus **9** across the six `tests/rete/probe_arc301_*` files = **76
lines**. `git grep -c` counts lines, not occurrences, so 75 is within one of an
honest reading. Call it grounded, and say it is a line count.

### (3) ⛔ A LIVE CONTRADICTION — not residue. `001-sns-sqs/DESIGN.md` is still titled "Arc 301".

At the branch tip:

```
git show origin/sns-sqs:docs/excursus/2026/08/001-sns-sqs/DESIGN.md | head -1
# Arc 301 — SNS and SQS
```

`docs/excursus/README.md:37` says, four lines under the residue heading:
**"Arc 301 does not exist."** The unit's own spine document disagrees with its own
tree's README.

This is **not** the "append-only history" residue the README licenses. The
diffstat of the move commit shows exactly why:

```
git show --stat --format='' 331543758
 .../08/001-sns-sqs}/DESIGN.md   |   0
```

The sweep changed 26 files — every `BRIEF-`, `EXPECTATIONS-`, `SCORE-`, `NOTE-`
and `PROBE-` file got its `301` references rewritten — and **DESIGN.md moved with
zero line changes.** The one file that carries the title is the one file the
sweep did not touch. (`git grep -c` at `331543758^` shows `DESIGN.md:1` — a single
matching line: the title.)

And it is **stale twice over**. `DESIGN.md:3-4`:

> **Status: DRAWN 2026-08-30.** Stone 1 (SNS) is STRUCK in userland and needs no
> substrate change. Stone 2 (SQS) is blocked on ONE substrate decision, stated
> below and not taken.

By 21:01 that same day all seven stones were struck, `delete` was on the Store,
SQS was running, and the fan-out proof had landed. The DESIGN was ~20 hours out of
date at the end of the day it was written.

★ **And this is the same defect the day itself filed as a failure mode.**
`2b8cbbfe2` (22:18) caught the *sibling* file — `001-sns-sqs/README.md` — being
"five stones stale", rebuilt it from the SCOREs, and minted **FM 22 — pointing
the next self at an index you did not re-read**
(`docs/COMPACTION-AMNESIA-RECOVERY.md:1577+`). It fixed the index. It did not
open the DESIGN. **The class was named and the neighbouring instance survived the
naming.** Flag to the builder; I did not edit `wat-rs`.

### (4) STOP-2 — `claude-compute` is substantive, and I do NOT propose a cut.

Its 24 own commits carry a real tool (`wat-drift`), a real branch doctrine
(`docs/CLAUDE-COMPUTE.md`), two arc-278 NOTEs, and a fixed failure mode (FM 20).
They could carry a post. **They should not get one, because they are the second
instance of this window's one class**, and separating them would destroy the
post's strongest structural fact: two branches, two machines, three days, the
same failure. See §"Why one post, not two."

### (5) STOP-3 — fires in REVERSE. There is more than enough.

60 own commits (`claude-compute` 24 + `sns-sqs` 36) over three days
(2026-08-28 12:14 → 2026-08-30 23:48), **84 files** of `docs/excursus/`, a
complete userland SNS+SQS with a measured 8000-outcome fan-out proof, seven
substrate changes it demanded, and **19 verbatim builder quotes**. The risk here
is a post that tries to carry all of it, not one that is thin.

---

## The hook / through-line (one paragraph)

The front opens with two branches doing two different jobs on two machines that
are not the builder's desk, and on the same three days both discover the same
thing about themselves. On `sns-sqs`, an apparatus that wanted to build an SNS and
an SQS in userland needed somewhere to keep DESIGN/BRIEF/EXPECTATIONS/SCORE, and
the tree offered exactly one such place — `docs/arc/NNN-slug/` — so it created
`docs/arc/2026/08/301-sns-sqs/` on the reasoning *"300 is the highest number, so
mine is 301."* The rule against that already existed, was already tagged for the
memory store, and had **already been broken once with the identical number**. It
broke again because the rule forbade the only act available: a rule can say *do
not mint an arc*, but if exploration has nowhere else to live, obeying it means
having nowhere to work. The answer was not a stronger rule but a second place —
**`docs/excursus/YYYY/MM/NNN-slug/`**, a sibling of `docs/arc/` with its own
number space, its own commit prefix `EXCURSUS(NNN):`, and promotion to an arc as a
deliberate builder ruling rather than a side effect. Meanwhile the work the tree
was invented to hold turned out to be worth holding: SNS shipped needing no
substrate change at all, and then *drawing* SQS — not building it — uncovered that
the Store could not `delete`, that `mem-store`'s `put` appended where DynamoDB's
`PutItem` replaces, and that `#inst` rendered at a variable width so that **every
range scan over a timestamp sort key was unsound**. Seven substrate fixes fell out
of a composition that was supposed to need none. And on the other branch, at the
same hours, a drift gate built to catch *retired names* reported clean against a
refresh whose 41 reds were a retired *form* — the same shape, one instrument over.
The branch doc's own generalisation is the sharpest line in the window: **"the
drifting thing is whatever main last made corpus-wide-illegal. Twice that was a
name. Once it was a form. Next time assume it is neither."**

Working images (builder's call): *the number that was not asked for* · *a place to
be wrong in* · *what the instrument cannot see* · *in anger*.

---

## The measurement, stated with what the instruments can and cannot see

**The front's own work, with explicit exclusion** (never a merge-base range —
`claude-compute` forked off `grok-rete`, merge-base `1facc1f94`):

```
git rev-list --count origin/claude-compute ^origin/main ^origin/grok-rete   →  24
git rev-list --count origin/main..origin/claude-compute                     →  133   ← WRONG. 109 inherited.
git rev-list --count ca405009b ^origin/main ^origin/grok-rete ^origin/claude-compute → 36
```

**60 own commits in-window.** This matches `docs/BATCH-OUTLINES.md:467-468`
("60 own commits in-window (`claude-compute` 24, `sns-sqs` 36)"), independently
re-derived here.

**The excursus tree exists on exactly one branch.** Measured, all four:

```
main            0
grok-rete       0
claude-compute  0
sns-sqs        84
```

**What these instruments cannot see:** commits that exist only in a working tree,
another clone, or grok's own repo and were never pushed to any ref here. The
`(301)` census in particular is a census of *this repository's refs*. If seventeen
subjects ever existed, eleven of them are what reached this disk, and the other six
are not findable from here. I state that because it is the only honest way the
"11 vs 17" finding can be written.

---

## The 301 incident, verified line by line

**Everything below is what the history actually shows.** Where it agrees with the
README I say so; where it does not, the disk wins.

**✅ The directory existed as an arc.** At `331543758^` the tree holds
`docs/arc/2026/08/301-sns-sqs/` with 20 files, plus six
`tests/rete/probe_arc301_*` files. The move commit's diffstat: 32 files changed,
+330/-73; `probe_arc301_delete_differential`, `probe_arc301_reput_differential`,
`probe_arc301_store_delete` (`.rs` and `.wat` each) → `probe_ex001_*`.
`331543758`'s body: *"21 files moved, 26 swept, 6 tests renamed …, the arc-109
cross-link repointed and fully qualified (2026/08/ alone is now ambiguous — two
trees carry dates)."*

**✅ The first occurrence is exactly where the README points, verbatim.**
`docs/arc/2026/06/255-builtin-registry/SEAM.md:118`:

> **I opened arc 301 unasked and committed it.** Retracted. The place existed —
> 296's own unmet gate — and I reached for a new number because I had declared 296
> finished when its *count* hit zero while its *gate* stayed open.
> `[[feedback_opening_an_arc_is_the_builders_ruling]]`

★ **And read the four lines ABOVE it, because `331543758` does and it is the
better beat.** The same SEAM paragraph carries:

> **Four instruments lied in one day, each answering a question I had not asked:**
> grep counted prose as code (**twice** …); `git log -1 <ref> -- <path>` answers
> *last commit at or before the ref* …; `mcp__wat__eval` held a two-day-old
> process; and a `--include=*.rs` census got reported as a fact about the tree.
> **Every number that held came from a compiler, an imposed wall, or a freshly
> built binary.** `[[feedback_state_what_the_instrument_can_see_before_quoting_it]]`

`331543758`'s body: *"I committed BOTH errors today — the same arc number, and the
same grep filter (the AutoSi census in the INST brief)."* **Two lessons, four
lines apart in one paragraph, both re-committed on one day.**

**✅ The retrieval diagnosis is stated and is the mechanism.** `331543758`:

> Both tags were **DANGLING**: this host was bootstrapped fresh this session and
> the memory store was empty, so the lessons lived only in an arc doc no session
> had reason to open. … **Prose in an arc doc is not a mechanism. The second
> occurrence is the proof.**

**✅ The deliberate non-rewrite is recorded**, and it is a good small beat:

> NOT REWRITTEN ON PURPOSE: `docs/arc/2026/06/255-builtin-registry/SEAM.md`'s
> "arc 301" is a historical citation; rewriting it would invert its meaning. Same
> line-scoping rule wat-drift learned by corrupting a comment that cited
> pre-rename spellings deliberately.

★ **Note what that sentence does: it cites the *other branch's* tool by name.**
`wat-drift` is `claude-compute`'s. The two branches were reading each other's
lessons in real time. That is the cheapest possible proof that this is one front.

**❌ "Seventeen commit subjects."** Eleven. See §"⚠ READ FIRST (2)".

### The eleven

All 2026-08-30, `-0700`, in log order:

```
8e41d13be  13:54  STONE INST(301): #inst renders at constant nanosecond width …
4d2e0e826  12:53  STONE 2c(301): mem's put replaces — and the oracle it fixed was hiding DATA LOSS in journal
75492bdb3  04:32  DRAWN(301): stone 2c — mem's put becomes a replace, because PutItem is
e53533a39  04:31  CORRECTION(301): the put divergence is NOT a tie — DynamoDB rules, and mem-store is the bug
ee9f8e978  04:22  NOTE(301): mem-store's `put` APPENDS where sqlite's REPLACES …
5ac8f4a80  04:16  STONE 2b(301): the backends AGREE — and the GSI path that STOP-2 rested on has now RUN
ffd1af14b  03:56  NOTE(301): a record accessor in VALUE position is typed `Record -> F` …
ce3df8a18  03:46  DRAWN(301): stone 2b — the delete differential, whose RED would be a result
f29d27729  03:43  STONE 2(301): the Store can delete — and SQS's ack becomes expressible
e6062b800  03:20  HANDOFF(301): stone 2 goes to grok — the gate is the probe, and STOP-2 is the live one
fe1e923d5  03:18  DRAWN(301): SNS lands in userland — and the Store cannot delete, so SQS cannot ack
```

The correction lands at `331543758`, **14:03** — ten hours and eleven subjects in.

---

## Why a third documentation form was the right answer — MECHANICALLY

**This is the post's payload. Four mechanisms, each one grounded.**

### Mechanism 1 — the rule forbade the only act that was available.

The rule already existed, in the vocabulary the README now uses
(`docs/excursus/README.md:16-18`):

> **An arc is commissioned. `docs/arc/NNN` is opened when the builder asks, and
> only then.** An arc number is identity — it appears in commit subjects, NOTE
> filenames, and cross-arc links, so minting one silently commissions work in the
> builder's name.

It had been written, tagged for memory, and **broken twice with the identical
number**. A rule that careful sessions break twice is not being ignored; it is
under-provisioned. The apparatus needed a *place* — the four per-stone artifacts
are the working method (`001-sns-sqs/README.md:5-9`: `BRIEF` (what to do) ·
`EXPECTATIONS` (written **before**, so the result cannot move the goalposts) ·
`HANDOFF` (the executor's entry point) · `SCORE` (written after the orchestrator's
**OWN re-run**, never from the report)) — and the tree offered exactly one
directory shape that housed them. **The excursus tree does not discourage the
mistake. It removes the occasion for it.** Exploration now has a home with the
same apparatus and a disjoint number space, so "start working" no longer requires
reaching into the arc numbers at all.

### Mechanism 2 — put the distinction where correction is IMPOSSIBLE.

`docs/excursus/README.md:21-24`:

> **Commit prefix is `EXCURSUS(NNN):`**, never `STONE n(NNN):`, so the log
> distinguishes the two at a glance. **That distinction is exactly what failed
> below.**

Here is why the prefix, not the directory, is the load-bearing half. The
correctable surfaces *were* corrected, in one commit: the directory moved, 76
in-file reference lines swept, six test files renamed, an arc-109 cross-link
repointed. What could not be corrected — and is the entire reason the mistake
mattered — is the append-only one. **Eleven commit subjects say `(301)` forever.**
A rule can be enforced on a directory tree by moving it; a rule can only be
enforced on a commit log *at write time*. So the mechanism is: encode the
distinction in the one medium that cannot be swept later, and encode it as the
first token, where a reader cannot miss it.

*(And note the recursion: the README exists precisely to be the decoder ring for
the residue the prefix was invented to prevent. "When reading this repository's
log, commits labelled `DRAWN(301)` / `STONE …(301)` / `HANDOFF(301)` /
`NOTE(301)` / `CORRECTION(301)` between `fe1e923d5` and `8e41d13be` belong to
excursus 001, not to any arc." — `README.md:35-37`.)*

### Mechanism 3 — the number space is disjoint, so promotion becomes an ACT.

`excursus/YYYY/MM/NNN-slug/` numbers from 001. `docs/excursus/README.md:12`:
*"`excursus-001` names the SNS/SQS work the way `arc-278` names rete."* And
`README.md:19-20`: *"This tree is where exploration lives until it earns a number.
**Promotion to an arc is a deliberate act by the builder, never a side effect.**"*
`docs/README.md:96-99` registers it in the substrate's own index, so it is not a
private convention.

Because the spaces are disjoint, nothing about doing the work advances an arc
counter. There is no gradient toward minting. Promotion is a discrete act by one
person.

### Mechanism 4 — and the SAME SHAPE was ruled on the SAME DAY in a second space.

This is the recognition that makes the post more than an incident report.
`76ed8e8b3` (17:54), builder verbatim:

> "we build in userland and promote to kernel.... wat-scripts/ ... it has raised
> wat-grep and wat-gen .... this feels like another.... wat-topic and wat-queue"

and

> "wat-scripts/{topic,queue}/ is agreeable.... we promote them to stdlib once they
> demonstrate excellence."

Same commit, on the precedent, quoting `349a2ea52`:

> "grep moves out of wat-scripts, that's where we host our repo's scripts, wat-grep
> is maturing into a wat feature."

and the promotion standard from the same source, which the excursus adopts:

> "mostly a MOVE of proven code, and **THE COUNTS ARE THE PROOF IT MOVED INTACT**"

★ **Two promotion ladders, ruled hours apart on one day, identical in shape:**

| | exploration lives at | promoted to | promotion is |
|---|---|---|---|
| documentation | `docs/excursus/NNN-slug/` | `docs/arc/NNN-slug/` | the builder's ruling |
| code | `wat-scripts/<name>/` | `wat/<name>.wat` | the builder's ruling, "once they demonstrate excellence" |

And `76ed8e8b3` makes the code ladder *subtler than "build here, move there"* —
after promotion, `wat-scripts/grep/` still exists, holding the **programs written
against** the feature (7 of them + a README) while the **tool** lives at
`wat/grep.wat`. Three slots, not two:

```
wat-scripts/<name>/   the feature while maturing -> then the corpus that USES it
wat/<name>.wat        the feature once promoted
wat-scripts/demos/    demonstrations of substrate capability, NOT proto-features
```

The same commit acts on that distinction: **SNS was in the wrong place** —
`wat-scripts/demos/sns/`, beside `stdio-service` and `stream-protocol` — and moved
to `wat-scripts/topic/sns-fanout.wat`. *"A proto-feature is not a demo."*

`17d32938d` restates it for the code, and it is the sentence to quote:
*"Promotion of wat-topic and wat-queue to `wat/topic.wat` and `wat/queue.wat` is
the builder's ruling; when it comes, the grep precedent sets the standard — 'the
counts are the proof it moved intact', and the counts are `"3 3"` and
`"bound=x;r1=a,b;r2=c;r3=;redel=b"`, to be RE-RUN after the move rather than taken
from a report."*

**One generalisation, and it is transferable past this repo entirely:** *a rule
that gates entry into a committed space needs an uncommitted space to gate people
INTO. Otherwise the rule's only compliant move is to not work.*

---

## What "in anger" actually bought — the substrate bill

**The brief's worry that an opening post would be all paperwork is unfounded.**
Here is what a userland composition, drawn to need *zero* substrate change,
actually extracted. Every row is a distinct in-window commit.

| # | what changed | where | why it mattered |
|---|---|---|---|
| 1 | `:wat::query::Store` gains **`delete`** | `f29d27729`, stone 2 | the `:features` block (`wat/query.wat:551-569`) was exactly four verbs — `ensure-schema`, `put`, `scan`, `scan-index`. **Append and read. SQS's ack was not expressible.** |
| 2 | the delete **differential**, mem vs sqlite, GSI included | `5ac8f4a80`, stone 2b | the backends agree; the GSI path a STOP rested on has now RUN |
| 3 | `mem-store`'s **`put` becomes a replace** | `4d2e0e826`, stone 2c | see §"the oracle" below — this is the biggest find in the window |
| 4 | **`#inst` renders at constant nanosecond width** | `8e41d13be`, stone INST — **one token**, `crates/wat-edn/src/writer.rs:227`, `SecondsFormat::AutoSi -> Nanos` | **every range scan over a timestamp sort key was unsound** |
| 5 | serialization options become a **value** (`WriteOpts`), then **optional** | `0fc49949e` + `257483a74` | ruled by the builder after rejecting three designs |
| 6 | journal's **`SortKey`** — a telemetry event carries its own identity | `0b4035211` | closes a live data-loss bug; first fully green floor in the excursus |
| 7 | the `:messages` completeness guard's **reach** widens to parametric field types | `6498817d4`, stone 5, `src/types/surface.rs` +137/-8 | makes stone 4's whole failure class unrepresentable |
| 8 | `PEER_SEVERED_SENTINEL` + `LociDiedError::Severed` | `3029800b8` + `5d803e407` | an owner-dropped handle stops reading as a clean close |
| 9 | two tests un-ignored after **38 days** | `ca405009b` | the cutoff marker itself; see §"the callback" |

**And the stones that needed nothing:** stone 1 (SNS), stone 3 (SQS), stone 4,
stone 6, stone 7. `17d32938d`: *"ZERO substrate change — `git status` on
`wat/ src/ crates/` is empty. Every primitive it needed already shipped, which is
what stones 2 through SORTKEY were for."*

### The mechanism of discovery, stated by the record itself

`5d5074156` (stone 3 DRAWN), and this is the sentence for the post:

> SNS shipped at stone 1. **Everything since was substrate debt that DRAWING THIS
> STONE uncovered:** receive needs a re-put (which found mem appending where
> sqlite replaced), ack needs a delete (which the Store did not have).

`001-sns-sqs/README.md` puts it as the shape of the whole detour:

> Stone 1 built SNS. **Drawing stone 3 is what uncovered everything between
> them** … Stones INST through SORTKEY are that debt, paid.

**A demo exercises what you thought of. An application exercises what the
substrate promised.** That is what "in anger" bought, and it is measurable: nine
substrate changes out of a composition budgeted for zero.

### The oracle — the best single find in the window

`ee9f8e978` → `e53533a39` → `75492bdb3` → `4d2e0e826`, 04:22 → 12:53.

`mem-store` was the differential **oracle** for `sqlite-store`. Its `put`
**appended** where sqlite's **replaced** — so `mem-store` could hold two rows
sharing one primary key. Builder, `e53533a39`:

> "both of these were replicating dynamodb - ddb does what here?"

That settled it. From the same commit body:

> The NOTE originally read: "the Store surface never says which one is right …
> both implementations are defensible readings of the contract. **THE CONTRACT IS
> THE DEFECT.**" That is FALSE, and the referent is named in the surface file
> itself: `wat/query.wat:7` — "The narrow waist is still DynamoDB's (pk, sk, data)
> + named-GSI".
>
> **HOW I GOT IT WRONG:** I searched `wat/query.wat`'s prose for key semantics,
> found none, and **read SILENCE AS AMBIGUITY.** The spec was not silent — it was
> elsewhere, and named.

The consequence, from `0b4035211`:

> **journal was silently dropping two metrics in three from every span close, on
> every conforming backend.**

And the two sentences the post should end that beat on —
`001-sns-sqs/README.md`:

> ★ **Stone 2c broke nothing. It removed a blindfold.** And the eventual fix was
> cheap *because* the substrate was made honest first — `SortKey.time` is a real
> `Instant` rather than a hand-padded string only because INST fixed the renderer.

`3487541e0` (the journal census) names the generalised bug:

> **journal loses metrics on EVERY backend that implements PutItem correctly.**
> Not a sqlite bug — a journal bug. **It looked backend-specific only because the
> oracle was broken in a direction that hid it.**

And the census verdict, which is the sharper half:

> ★ **AND THE VERDICT READS WRONG WITHOUT CARE:** 13 agreements are a fact about
> the CORPUS, not about the bug. … The only sequence that drives it is a span
> close, and a span emitting several metrics at one instant is what spans ARE.
> **The corpus barely exercises the shape production emits constantly.**
> `journal_backend_differential` is the proof: **it agreed for months while this
> collision lived.**

### The `#inst` bug, in one paragraph

`8e41d13be`:

> chrono's `AutoSi` emits "the shortest representation that is a multiple of 3
> digits", so `1.200000000s` printed `.200Z` while `1.200000100s` printed
> `.200000100Z` — and `'Z'` (0x5A) sorts after `'0'` (0x30), so **the EARLIER
> instant compared GREATER. Every range scan over a timestamp sort key was
> unsound.** `time-sk`'s hand-padding was a local workaround for that; the doc at
> `src/intrinsic/time.rs:70` already promised 9 digits. **The renderer was the
> thing out of line.**

Measured, before/after:

```
HEAD:  9-digit=false whole-second=false 6-digit=false 3-digit=false  widths=32/38/28
AFTER: 9-digit=true  whole-second=true  6-digit=true  3-digit=true   widths=38/38/38
```

**A one-token fix at `crates/wat-edn/src/writer.rs:227`.**

### The storage design, which is the elegant part and needs no hedging

From `5d5074156` and `17d32938d`:

```
pk = queue name · sk = a STABLE message id · GSI by-visible-at (ipk=queue, isk=visible-at)
send    -> put with isk = now
receive -> scan-index isk <= now, then RE-PUT each row with isk = now + timeout
ack     -> delete by (pk, sk)
```

> ★ **The visibility timeout is A RE-PUT THAT MOVES THE INDEX KEY INTO THE FUTURE.**
> No lock, no timer, no side state; redelivery is what happens when nobody moved it
> again. A STABLE sk means ack names the same key forever — no receipt-handle drift
> — and invisibility is ONE atomic put rather than put-new + delete-old, **which has
> a crash window that DUPLICATES the message.**

The safety argument, from `317e6496e`, is the load-bearing sentence and is *not*
what a reader would guess:

> ★ **THE TOPOLOGY IS THE SAFETY ARGUMENT, NOT DECORATION.** `receive` is
> `scan-index` THEN `put` — two Store calls. What makes that safe is NOT the put's
> atomicity; it is that **a defservice is a SERIALIZING ACTOR** ("the actor's loop
> is the ONE place mutation", `mem.wat:22-24`). So ONE queue service per queue, J
> workers dialing it. J queue services over one store would each serialize
> internally and not against each other — that reintroduces the race. **Real SQS
> closes the same hole with storage-layer atomicity; ours closes it with the
> actor.**

And the honest correction attached to it, same commit:

> ⛔ **A CORRECTION FROM THE CONVERSATION THAT LED HERE:** I first said two workers
> could both get the same message, having read the two Store calls and stopped
> before asking what serializes them. Wrong in the correct topology. The design is
> not flawed — but **its safety rests on an UNSTATED constraint**, and the queue's
> header ("one atomic put, no lock") is true and incomplete in a way that could
> mislead someone into running two instances for throughput.

### The proof, measured

`4139cddfc`, the orchestrator's **own re-run**:

```
"n=2000;m=4;j=3;total=8000;distinct=8000;dup=0;workers=9;empty=1"
Summary [ 299.582s] 5127 tests run: 5127 passed (2 slow), 17 skipped     FLOOR=0
```

> N messages -> 1 topic -> M queues -> J workers -> N x M outcomes. 2000 -> 4 -> 3
> -> 8000, distinct, zero duplicates, ~18 processes on 12 cores. **The actor's
> serialization — a claim derived from reading a comment six stones ago — is now a
> MEASURED FACT.**

---

## The story beats, in order

All times are **author** dates, `-0700`. (Note: `--since/--until` filter
*committer* date while `%ad` prints *author* date. Everything here is `%ad`.)

### 0. 2026-08-28 12:14 — `claude-compute` opens. `f3d1d4659`.

> `MERGE(claude-compute): grok-rete into main — the unification branch`
>
> Textually clean (`git merge-tree`: no conflicts). 8 files touched by both sides…
> **Semantic risk NOT covered by a clean text merge:** main's arc 255 retired and
> rehomed names across 1036 files … while grok-rete added a new `.wat` corpus …
> written against the pre-retirement spellings. **Verification is the release
> floor, not the merge.**

`docs/CLAUDE-COMPUTE.md`, its own opening lines, and this is what makes it a
*front* rather than a chore:

> An **observation post**, not a destination. It exists so `main` and `grok-rete`
> can keep diverging while someone watches what their union actually does. It is
> **never merged back into either parent.** When the three finally converge, delete
> it and cut a fresh one.

### 1. 2026-08-28 15:22 — `wat-drift` is built. `ac121524c`.

> Builds the thing this branch kept needing by hand. **Three times a merge shipped
> broken on a retired spelling in grok-rete-owned content, and each hand pass
> missed a different variant.**
>
> **WHY IT READS THE RETIREMENT TABLE.** Doing this by hand means maintaining a
> mental list of which families moved. **That list was WRONG here once** … So the
> tool carries no list: it parses main's `RETIREMENT_TABLE`
> (`src/remedy/retirement.rs`), which main updates as part of each stone and
> **therefore cannot go stale.**

Three things it got right only after getting them wrong, verbatim from the body —
all three are the same lesson wearing different clothes:

1. **Line-level, not file-level.** *"A retired name on a line main also has is
   main's business — the retirement table itself, `wat-scripts/fixes/*` (which
   carry old names as DATA), `255-stone-*-both-spellings.wat` (which assert both ON
   PURPOSE)."*
2. **Qualified names only.** *"Four table rows are bare wat constructors (`Some`,
   `:None`, `Ok`, `Err`); substring-matching those found Rust's own `Ok`/`Err`/`Some`
   everywhere — **327 hits, ~20 real.**"*
3. **Both spellings.** *"Source `:wat::rete::core::i64::+` AND rendered
   `:wat.rete.core.i64/+`. The second hid in a test assertion and survived a pass
   that only knew the first."*

And the `--fix` scoping, which is the same rule the excursus applied to `SEAM.md`
three days later:

> A retired name in a comment is usually a deliberate citation. The first `--fix`
> did a whole-file replace and **rewrote an explanatory note that cited the
> pre-rename spellings on purpose, inverting its meaning** … `--fix` now touches
> only classified CODE lines, and prose is reported for review, never rewritten.

What it found that three hand passes missed: **6 code hits, 3 files** — including
`src/rete/expr_ir.rs:1803,1816`, *"diagnostics naming a RETIRED op, so a user would
be shown a dead name."*

### 2. 2026-08-29 19:57 — the CURARE that states the hold. `5aa91b973`.

Three corrections in one commit, and the third is a genuinely nasty tooling trap:

> 1. **THE HOLD IS STATED.** The branch carries main to tip, grok-rete only to
>    `1facc1f94`. **A green floor means MAIN is green, not that the union is** —
>    the distinction this branch exists to show …
> 2. **THE TRIGGER WAS WRONG, TWICE OVER.** … **I read a `'DRAWN(255): HOME-12'`
>    line in a log window and never checked for its STONE.**
> 3. **RERERE REPLAYS BAD RESOLUTIONS.** A throwaway probe resolved `src/lib.rs`
>    crudely; rerere recorded it and silently auto-applied it on the next merge,
>    making a `git checkout --ours` a no-op and **two rounds of measurement wrong
>    without a trace in `git status`.**

### 3. 2026-08-30 02:17 — `claude-compute` wraps. `f92f55dbd`. **THE branch's beat.**

> `CURARE(claude-compute): the failure class was never "names" — it is whatever
> main last made illegal`
>
> The doc's load-bearing claim was FALSE as of this refresh and is **corrected in
> place, not appended to.** It read "across two full refreshes, every single
> failure resolved to NAME drift" — **and `wat-drift` was built to exactly that
> shape.** The third refresh's 41 reds were one cause and not a name: arc 109's ONE
> PARAM-SPEC wall. **The gate reported clean and was correct by its own terms.**
>
> Generalised rather than patched: **the drifting thing is whatever main last made
> corpus-wide-illegal. Twice a name, once a form; next time assume neither.**

The refresh table from `docs/CLAUDE-COMPUTE.md` is a good visual for the post:

| | 08-28 first | 08-28 second | 08-30 third |
|---|---|---|---|
| floor cycles to green | 6 — 3182 → 63 → 57 → 39 → 10 → 8 → 0 | **1** | 3 — 41 → 38 → **0** |
| conflicts | 13, all hand-resolved | 13 → **6** (rerere replayed the rest) | **0** |
| what drifted | retired NAMES | retired NAMES | a retired **FORM** |

Same commit, three more recorded with their incidents:

> · **a NARROW CENSUS IS A FALSE ALL-CLEAR** — grep found `Vector`, missed
>   `HashSet`, and the floor went 41 -> 38 to say so. **Run the codemod, read ITS
>   report.**
> · a codemod cannot reach wat source inside a Rust string literal. **When a span
>   reads `:file "<entry>"`, the source is `.rs`, not the corpus.**
> · **`wat-sync.sh` exited 0 on a RED floor** (FM 20, committed by the gate's
>   author). Fixed: the floor's status is now the script's status.

And the fix it names and refuses to draw, which is the same *shape* as the
excursus answer — stop enumerating, make the thing structural:

> **80 recorded codemods plus the CLI's existing `--grep` census mode make every
> migration its own gate, which cannot go stale, because a new migration arrives
> already gated.**

### 4. 2026-08-30 03:18 — `sns-sqs` opens. `fe1e923d5`. SNS ships, and the Store cannot delete.

`docs/excursus/2026/08/001-sns-sqs/DESIGN.md:6`, the builder's framing, which heads
the whole unit:

> "we have been wanting to build something like an sns and sqs… let's build sns in
> userland… then we build what we must for sqs"

SNS shipped at stone 1 needing **no substrate change** —
`wat-scripts/topic/sns-fanout.wat`, one file that runs **both loci** and prints
both counts, `"3 3"`. *"The locus is a parameter, so the differential is the
artifact rather than a thing a reader must remember to run twice."*

Two facts the bisect pinned that were written down nowhere
(`DESIGN.md`, and `fe1e923d5`):

1. **A subscriber's birth-seed allow-set holds only `getppid()`.** The topic is a
   *stranger* to a subscriber it did not spawn, and is bounced until granted.
2. **A forked child's bundle does not carry the program's other `defn`s.** An
   `:init` that calls a top-level helper dies at
   `StartupError`/`UnresolvedReference`. **The dial must be written inline.**

★ And the method note, which is the good half of the beat: the process-locus
failure was *first reported as a blocker* and was not one.

> ⛔ **A CORRECTION IS ON THE RECORD IN `DESIGN.md`.** … That conclusion was
> reasoned FORWARD from one failing probe to a mechanism … — **the source line is
> real, the inference from it was not.** Building up from a known-green file
> refuted it in seven steps.

### 5. 04:22 → 12:53 — the oracle. `ee9f8e978` … `4d2e0e826`.

See §"the oracle" above. Builder: *"both of these were replicating dynamodb - ddb
does what here?"*

### 6. 13:54 — the `#inst` renderer. `8e41d13be`. One token.

Also carries the census confession that the 14:03 commit is about to repeat:

> ⛔ **THE CENSUS MISS IS MINE AND IT IS A REPEAT.** My BRIEF asserted "AutoSi
> appears in exactly two places". The executor found a third … My command was
> `grep -rn 'AutoSi' src/ crates/ --include=*.rs` — **the filter EXCLUDED THE .md
> and I reported the filtered count as unqualified fact.** … Twice in one session,
> the second time inside a BRIEF someone else had to correct. **The note is not
> working as a note. THE HABIT: never state a census without showing the command,
> so its scope is auditable rather than trusted.**

### 7. 14:03 — `331543758`. The excursus is minted.

The whole §"Why a third documentation form" section lands here. Builder verbatim,
two quotes in the body:

> "i did not ask for more arcs, at all - these are opened when i ask"

> "this is us experimenting freely ... arc 278 is about building wat-rete ... but
> rete's needs do not extend to message delivery and processing"

★ **That second quote is the ARGUMENT, and the README does not carry it.** It is
the answer to the obvious objection — "why not just file it under 278?" — and it is
a *scoping* answer, not a bureaucratic one: an arc is a subject, and this work is
not that subject. Use it.

### 8. 14:41 → 17:37 — the debt gets paid. WriteOpts, WO-OPT, the journal census, SortKey.

Four stones in three hours, ending at the excursus's **first fully green floor**
(`0b4035211`: `5121 tests run: 5121 passed … FLOOR=0`).

Two beats worth keeping:

- **`ecb2e71be`** — the builder corrects an under-specification in the *previous*
  stone: *"i say its optional... if you omit it, you get the defaults, if you want
  to change it, you pass the config ops you want for your call."* The commit's own
  verdict: **"THE EXECUTOR BUILT WHAT I WROTE; the specification was wrong."**
- **`3487541e0`** — a **stale control** nearly voided a good run:
  > ⛔ **MY CONTROL WAS STALE AND THE EXECUTOR WAS RIGHT NOT TO OBEY IT.** STOP-1
  > said `span_macros` MUST show mem 3 vs sqlite 1, else void the run. Both
  > returned 1. **The executor did not void it** … ★ **A control must be
  > RE-DERIVED when the thing it controls for has changed.** … **A stale control is
  > worse than none: it instructs the executor to discard a good run.**

### 9. 17:43 → 18:22 — SQS lands. `5d5074156` → `17d32938d`.

`"bound=x;r1=a,b;r2=c;r3=;redel=b"`, floor **5122/5122**, `FLOOR=0`, zero substrate
change. The two rows that could have been faked, from `17d32938d`:

> · **REDELIVERY.** `mora` forbids a sleep and `:wat::time::now` cannot be stepped,
>   so **THE CLOCK IS AN ARGUMENT** … No sleep, no flake, and it is the better
>   design anyway: **time is I/O, and a queue whose clock is injectable is a queue
>   you can test.**
>   ★ `r3=` **is the row the BRIEF did not ask for** and the one that makes the
>   sequence honest: an empty third receive INSIDE the window proves invisibility
>   persists. Without it, `redel=b` alone would pass on a queue that never made
>   anything invisible.
> · **THE BOUNDARY.** `bound=x` — sent at T0, received at T0. The inclusive-hi case
>   a too-small sentinel drops in silence; same class as SORTKEY's boundary and the
>   `#inst` width bug. **Third time that shape has been the thing worth pinning.**

### 10. 18:41 → 21:01 — stones 4–7. THE HALT IS THE BEAT.

**`001-sns-sqs/README.md` states the shape better than any summary I could write:**

> **Stones 4–7 are one arc, not four.** Stone 4 halted on a STOP trigger rather
> than improvising; what it surfaced (a peer surface silently missing a domain
> type) took stones 5 and 6 to root out, and only then could 7 land the proof stone
> 4 was drawn for. **The halt is why this worked.**

**Stone 4 (`903bbbf1d`) — struck as STOP-5, total=0.** The finding:

> `:queue::Envelope` is declared BESIDE `:queue::Queue` (line 36 vs 40), not inside
> its `:messages`. `wat/service.wat:792` ships only `(S::surface-forms)` into a
> forked child, so a `:peers` worker on a process cannot resolve `Envelope/id`. …
> ★ **The census explains why nothing caught it:** the userland surfaces carry only
> BUILTINS; the surfaces with real domain vocabulary (Store, Journal) are STDLIB.
> **wat-queue is the FIRST userland surface whose messages carry a userland type**,
> and it broke on first contact with a forked consumer. **SNS did not dodge this by
> design — it had nothing to lose.**

And why the executor reached for a workaround — a diagnosis of the *diagnostic*:

> `UnresolvedReference` carries path, span, and `context: &'static str` — **A FIXED
> PHRASE**, one of two literals (`src/resolve/error.rs:13`). **It can never carry
> anything COMPUTED** … What the child said, in full, was "this name is not a
> builtin or a registered function." The correct inference from that is "make it
> available another way" — the foreign read. **The diagnostic did not mislead; it
> UNDER-SPECIFIED, and the workaround follows.**

Three things the commit credits the executor with, and they are the shape of an
honest STOP:

> it called `dup=0` **VACUOUS** rather than banking a green-looking number for the
> very property the stone existed to measure; it **named the fix and did not apply
> it**; and it named the escape hatch it declined — "thread workers would dodge row
> 7", which would have produced a green summary and proven nothing about process
> parallelism.

**Builder's ruling → stone 5 (`09e8b0cdf`):**

> "i dislike that grok was informed to go in the wrong direction... how do we attack
> that before we have grok attempt this proof again?"

The commit's gloss: *"so: **fix the teacher, then re-run the student.**"* And the
defect, one branch, `src/types/surface.rs:927-935`:

```rust
if s.as_str() == "<-" {
    if let Some(WatAST::Keyword(k, _)) = children.get(i + 1) {   // ← ONLY a Keyword
```

> A field typed with a PARAMETRIC FORM — `(:wat::core::Vector :- [:p::Item])` — is a
> `WatAST::List` after the `<-`, so the if-let does not match and **the field is
> SKIPPED ENTIRELY.** `collect_user_type_paths` descends into Parametric/Tuple/Fn
> perfectly; **it is simply never CALLED for these. The collector is not the hole —
> the AST match is.**

Measured both directions, both repros committed under `repro/`:

```
:Ok [item  <- :p::Item]                            --check = 1   GUARD FIRES
:Ok [items <- (:wat::core::Vector :- [:p::Item])]  --check = 0   GUARD MISSES
```

> ★ This is extirpare's ladder with the check **ALREADY ON THE RIGHT RUNG** —
> construction-time, located, actionable — **and an incomplete reach.** Widen the
> reach and the class becomes unrepresentable. **It is a fix of REACH, not of
> WORDING.**

`6498817d4`'s verdict: *"The wrong turn is not signposted better — **IT IS NO
LONGER REACHABLE.**"*

**Stone 6 (`0e43b7d74`) — and the correction that makes the day's lesson.** Moving
`Envelope` unmasked a *second* instance, `:fanout::Outcome`, Envelope's exact twin.
Which corrected stone 5's own grading:

> ⛔ **AND IT CORRECTS MY GRADING OF STONE 5.** I graded row 7 as ZERO … and built a
> three-part instrument argument for it …
>
> **THAT ARGUMENT IS SOUND ABOUT FILES AND WRONG ABOUT DEFECTS.**
> `every_wat_scripts_file_loads` reports which FILES fail; **a type-check HALTS AT
> THE FIRST ERROR**, so it does not enumerate what else is wrong inside one. Two
> files failed at stone 5 and one was hiding a second defect behind the first …
>
> ★ **FOURTH OCCURRENCE OF ONE SHAPE TODAY:** `--include=*.rs` excluding a `.md`;
> `Vector|vec` missing `HashSet`; a comparison completed from memory rather than
> run; and now a file-level census read as a defect-level one. **The pattern is not
> carelessness about counting — it is asking "DID THE INSTRUMENT REPORT A FAILURE?"
> instead of "WHAT CAN THIS INSTRUMENT NOT SEE?"**
>
> The executor settled it the only way that settles it: moved the first defect and
> looked again. **That is a better instrument than any argument I made.**

Also in that commit, the row that made the difference between a real fix and a
green build:

> **ROW 8 IS THE ROW THAT MATTERED.** The obvious way to make the queue freeze was
> to move `Envelope`; the WRONG way was to weaken stone 5's guard — **AND THE FLOOR
> WOULD HAVE LOOKED IDENTICAL EITHER WAY.** … It was checked only because
> EXPECTATIONS asked before the strike.

**Stone 7 (`4139cddfc`) — and a discrepancy that is the finding.**

> ★ **MY RUN SAYS `workers=9`; THE EXECUTOR'S SAID `workers=8`. That is not a
> discrepancy — it is the finding, confirmed twice.** The invariants are
> byte-identical across independent runs; the worker count is not, because **workers
> race a serializing actor and a loser drains empty.**
>
> ⛔ **ROW 7 WAS A DEFECT IN MY BRIEF, NOT IN THE STRIKE.** I specified "all M x J
> worker ids appear" as the parallelism proof. … The executor: *"a worker that loses
> the race drains empty and does not stamp an id. Completeness without duplicates is
> what that topology actually proves, not equal split. Forcing every id would be a
> fairness policy or a sleep."*
>
> Correct, and I was wrong. **I derived the property from "12 workers exist so 12
> ids should appear" — but the topology I MYSELF INSISTED ON, one serializing actor
> per queue, is exactly what makes workers race.**

And the test encodes the correction:

```rust
assert!(workers > 0 && workers <= 4, "...so a zero summary cannot pass as complete")
```

> Had it been `assert_eq!(workers, 8)`, my `workers=9` would have made it flaky on
> its first independent run. **It survived exactly that.**

### 11. 22:18 — the index is caught stale. `2b8cbbfe2`. FM 21 and FM 22 are minted.

> Found by **walking** the recovery ledger rather than narrating it.

Two failure modes added, *"both roots rather than stems"* — verbatim:

> **FM 21** — minting an arc the builder never commissioned. Twice now, with the
> identical number 301. **The rule was written in an arc doc and tagged for a memory
> store that was empty, so it did not fire.** It now lives where a compacted self is
> forced to read it.
>
> **FM 22** — pointing the next self at an index you did not re-read. The breadcrumb
> that sent the next self to the stale index above was written the same session,
> citing it from memory. **A pointer is a claim about a file's content, not just its
> path.** Cure is mechanical: `cat` the index, confirm its newest row matches
> `git log -1`, fix it in the same commit.

*(This is the commit that makes §"⚠ READ FIRST (3)" a story rather than a nitpick:
it fixed the index and did not open the DESIGN one directory level up.)*

### 12. 22:32 → 23:48 — SEVERED, and the 38-day callback. `3029800b8` → `5d803e407` → `ca405009b`.

**This is the beat that ties the front to a post already shipped.** `uiol-006`
(2026-07-25, *"a caller is not traffic"*) recorded, as an incidental, that *"a
service `Handle` bound in a `let` is dropped before the let's tail body evaluates,
so a request issued from tail position returns `Closed`."* Thirty-eight days later,
on the last day of this window:

`3029800b8`:

> `:Shutdown`'s own declaration names the cause — `wat/spawn.wat:196`, "owner
> dropped the handle (self-peer drained)" — and the serve loop answered `nil`, so
> every connected client's next `recv'` read a bare EOF and reported
> `RecvOutcome::Closed`. **A clean-close label on a service that did not close
> cleanly.**
>
> That is the same mute arc 278's RST stone was minted to kill. … **It covered the
> crash kinds. The ordinary return — the owner simply letting go — was the one path
> it never reached.**

`5d803e407`, what a client now reads on the previously-mute path, both loci:

```
before  "recv': peer closed"
after   "service severed: its owner released the service handle"
```

> **That is the message that sent a prior session hunting the timer.**

`ca405009b` — the cutoff marker itself:

> Two tests stood `#[ignore]`d for **38 days** (born 2026-07-21 …) on a cause that
> **was never measured.** … The stated blocker: "the `remove-at` idx-shift
> (`service.wat:958/961`) evicting the client peer". Inferred from the symptom
> `recv': peer closed`, never verified, then inherited by a DESIGN's scout note as
> "a SUBTLE post-migration RUNTIME bug ... Prime suspect: `poll'`". **Three
> measurements retire it:**
>
> - `remove-at` is at `service.wat:1591/1594`. **The cited lines drifted ~630 and
>   now hold unrelated handle-name minting, so the citation named innocent code.**
> - the mechanism reaches target at BOTH loci … `poll'` multiplexes correctly.
> - **the eviction reproduces with NO timer armed at all.** Self-scheduling was a
>   bystander.

And the two sentences that should close the post:

> ★ **The lint could not have caught this.** It screens for a PROMISE wearing a
> condition's clothes ("circle back to arc 255"). **This reason was a checkable fact
> that happened to be FALSE — more convincing than a vague one, and unfalsifiable
> without re-deriving it. A symptom was reasoned into a cause, written where it
> reads as measured, and believed for five weeks.**

Plus the honest hygiene note, which is a real design idea:

> Also fixed here, before it could mislead anyone: `probe_severed_reaches_the_client`
> produced its sever VIA the tail-position release, so repairing that release would
> have turned the gate RED for the one reason meaning everything works. **A gate must
> not be wired so that fixing the language breaks it.**

**NOT a TCO defect** — both `ca405009b` and `002/DESIGN.md` are explicit, and this
agrees with `uiol-006`'s §4b, which recorded the builder correctly killing the TCO
alarm on 2026-07-25. What was wrong was the *separate* `#[ignore]` reason.
**`uiol-006` was right; the ignore-reason next to it was the lie.**

---

## Why one post, not two — the two branches are one class

Three days, two machines, and the **same defect class fires on both**, each time
in an instrument built by the person it fooled:

| | `sns-sqs` | `claude-compute` |
|---|---|---|
| the instrument | `every_wat_scripts_file_loads` — reports which **files** fail | `wat-drift` — reports retired **names** |
| what it could not see | a type-check halts at the first error, so it cannot enumerate **defects** inside a file | a retired **form** has no row in the retirement table |
| how it was caught | move the first defect and look again (`0e43b7d74`) | the floor went 41→38 instead of 41→0 (`f92f55dbd`) |
| the generalisation | *"asking DID THE INSTRUMENT REPORT A FAILURE? instead of WHAT CAN THIS INSTRUMENT NOT SEE?"* | *"the drifting thing is whatever main last made corpus-wide-illegal. Twice a name, once a form; next time assume neither."* |

And **the 301 incident itself is the third instance**, which is why the front's
opening is one story: `331543758` files it as *"the same arc number, and the same
grep filter"*, and its source — `SEAM.md:118` and the four lines above it —
carries the two lessons in one paragraph.

The two branches were also literally reading each other: `331543758` justifies not
rewriting `SEAM.md` by citing *"the same line-scoping rule **wat-drift** learned by
corrupting a comment that cited pre-rename spellings deliberately"* — a tool that
lives on the other branch, learned two days earlier.

**`docs/BATCH-OUTLINES.md:466-468` already allocates 1 post. Concur, and the
reason is stronger than the commit count.**

---

## Verbatim builder quotes, with locations — NINETEEN, all verified this session

**Method note.** The dominant forms in this repo are `Builder: "…"`,
`Builder's ruling: …`, `Builder-ruled: "…"`. I walked all 60 in-window commit
bodies and both excursus README/DESIGN files rather than grepping, because a grep
tuned to one form misses the others — the exact failure the window itself keeps
recording. Two quotes below live **only in docs**, not in any commit; I say so
explicitly at each.

**⚠ ONE VERBATIM DISCREPANCY, and the commit is the primary.** The README renders
Q1 with an em-dash; the commit body has a hyphen:

- `docs/excursus/README.md:30-31` — *"i did not ask for more arcs, at all **—**
  these are opened when i ask."*
- `331543758` body — `"i did not ask for more arcs, at all - these are opened when i ask"`

**Use the commit's form.** The builder types hyphens; the README typographically
normalised him.

---

**Q1 — the ruling that mints the tree.** `331543758`, body ¶1:

> "i did not ask for more arcs, at all - these are opened when i ask"

**Q2 — the argument for a separate tree, and the README does NOT carry it.**
`331543758`, same paragraph:

> "this is us experimenting freely ... arc 278 is about building wat-rete ... but
> rete's needs do not extend to message delivery and processing"

**Q3 — the noticing.** ⚠ **DOCS ONLY.** `docs/excursus/README.md:30`. **This
phrase appears in no commit message anywhere in the repository** (verified:
`git log --all --grep='rogue' -i` returns five commits, none of them this):

> "did a rogue 301 enter?"

Cite it as the README, not as a commit. It is a genuine committed artifact, but
the post must not attribute it to a commit body.

**Q4 — what the excursus was opened to build.** ⚠ **DOCS ONLY** —
`docs/excursus/2026/08/001-sns-sqs/DESIGN.md:6`, and it appears in no commit
message:

> "we have been wanting to build something like an sns and sqs… let's build sns in
> userland… then we build what we must for sqs"

*(Note the ellipses in the source are `…`, single characters.)*

**Q5 — the Store ruling.** `fe1e923d5`, body, reported speech:

> Builder's ruling: option (a), add `delete`; not tombstones — a keyed store that
> cannot delete is incomplete for anything that is not a log, and tombstones would
> make the QUEUE the one structure that cannot shrink.

*(This one is the apparatus paraphrasing, not the builder's words. Use it as
attribution of the **decision**, never inside quotation marks as speech.)*

**Q6 — the referent settles the contract.** `e53533a39`, body ¶1:

> "both of these were replicating dynamodb - ddb does what here?"

**Q7 — the accessor bug called cold.** `ffd1af14b`, body ¶1 (grok reports; the
builder rules):

> "that feels like a bug"

Full context, same line: grok — *"mapv won't take a record accessor as a function
here. I'll wrap Row/sk and IndexRow/isk in explicit fns."* Builder: *"that feels
like a bug."* Then: *"Measured by probe; it is one."*

**Q8 — the promotion ladder, two clauses.** `76ed8e8b3`, body ¶1:

> "we build in userland and promote to kernel.... wat-scripts/ ... it has raised
> wat-grep and wat-gen .... this feels like another.... wat-topic and wat-queue"

and

> "wat-scripts/{topic,queue}/ is agreeable.... we promote them to stdlib once they
> demonstrate excellence."

**Q9 — the precedent, quoted forward from `349a2ea52`.** `76ed8e8b3` body:

> "grep moves out of wat-scripts, that's where we host our repo's scripts, wat-grep
> is maturing into a wat feature."

**Q10 — the promotion standard, from the same source.** `76ed8e8b3` body:

> "mostly a MOVE of proven code, and THE COUNTS ARE THE PROOF IT MOVED INTACT"

**Q11 — the files are invisible.** `34cf54dd4`, body ¶1:

> "are the grok files written? i don't see them"

*(The commit's answer is the beat: "they were written and committed, **and both
reasons they were invisible are mine**." The path had changed and the handoff had
accreted to 357 lines with stone 3's entry point at line 324 — the bottom.)*

**Q12 — the opts arity.** `ecb2e71be`, body ¶1:

> "i say its optional... if you omit it, you get the defaults, if you want to change
> it, you pass the config ops you want for your call"

**Q13 — the circuit, and the shape.** `317e6496e`, body ¶1, two clauses:

> "proof that our sns and sqs clones are actually usable in some app who needs
> parallel processing of messages... one message goes in, N outcomes come out from
> it"

and, on the shape:

> "this is like a.... network ... a circuit?"

★ **The commit's reply is the best small moment in the window** — the builder
reached for a metaphor and it was his own axiom: *"IT IS A CIRCUIT, AND THAT IS
THIS PROJECT'S OWN WORD. `docs/CIRCUIT.md:3` — 'A wat program is a circuit.
Programmer-built. Fixed topology. Signals flow through wires once powered... The
shape of `:user::main` is the wiring diagram.' **The builder's instinct was not a
metaphor being reached for; it was the axiom they already wrote.**"*

**Q14 — fix the teacher, not the student.** `09e8b0cdf`, body ¶1:

> "i dislike that grok was informed to go in the wrong direction... how do we attack
> that before we have grok attempt this proof again?"

**Q15 — the excursus-002 commission.** ⚠ **DOCS ONLY** —
`docs/excursus/2026/08/002-handle-lifetime-wall/README.md:3`. **POST-CUTOFF
(2026-08-31); include only as the forward pointer, if at all:**

> "i say we do it"

**Q16 — the first occurrence, the apparatus's own words.**
`docs/arc/2026/06/255-builtin-registry/SEAM.md:118` (not the builder, but the
record the builder's rule was written into):

> **I opened arc 301 unasked and committed it.** Retracted.

**Q17 — the four lying instruments, same paragraph, four lines up.**
`SEAM.md:112-116`:

> **Every number that held came from a compiler, an imposed wall, or a freshly built
> binary.**

**Q18 — the resolution rule for the merge branch.** `0d2d823dd`, body ¶1,
reported: *"Rule applied throughout, per the builder: grok-rete's LOGIC is right,
its NAMES are main's."* Restated as standing doctrine in
`docs/CLAUDE-COMPUTE.md`:

> **Rust conflicts** — resolve as (grok-rete's LOGIC) × (main's NAMES), per builder
> ruling. **Never pick a side wholesale.**

**Q19 — the executor refusing a rune.** ⚠ **POST-CUTOFF** (excursus 002,
`002-handle-lifetime-wall/README.md`), but it is the sharpest executor line in the
tree and worth knowing exists:

> "a rune there would make a green floor that fires on nothing"

---

★ **Note the pattern, for `consonare` rule 11 — and it is different from
`uiol-006`'s.** In the DoS unit, the builder's interventions were *pivots*
("annihilate it"). Here, **eight of the fourteen in-window rulings are the builder
correcting a specification the apparatus had already written** — the arc number
(Q1), the contract's referent (Q6), the accessor's status (Q7), the opts arity
(Q12), the direction of the fix (Q14). And the apparatus says so about itself, at
`ecb2e71be`: **"THE EXECUTOR BUILT WHAT I WROTE; the specification was wrong."**
Write it as a *duet in which the second voice keeps catching the first's
under-specification*, not as approvals.

---

## The substance test — run by me

Strip every hash, date, file path and line number. What is left that `git log`
does not hold?

**Holds up — eight items, and item 1 alone would carry the post:**

1. **A rule that gates entry into a committed space needs an uncommitted space to
   gate people into.** "Do not mint an arc unasked" was written, tagged, and broken
   twice with the identical number by two different sessions. It kept failing
   because the arc directory was the only place carrying the working apparatus —
   BRIEF, EXPECTATIONS, HANDOFF, SCORE. Obeying the rule meant having nowhere to
   work. The fix was not a stronger rule; it was a second place with the same
   apparatus and a disjoint number space. **When careful people break a rule
   repeatedly, look for the act it leaves unprovided-for.**

2. **Identity is whatever the append-only medium makes of a name.** The directory
   moved, ~76 reference lines were swept, six test files were renamed — one commit.
   **Eleven commit subjects say `(301)` forever.** So the enforcement that matters
   is not the tree, it is the *prefix*: put the distinction in the one surface that
   cannot be corrected later, at write time, as the first token. Everything else can
   be swept; the log cannot.

3. **A lesson tagged for a store that is empty is a comment.** The first occurrence
   was written into an arc doc and tagged for memory. The host where it recurred was
   bootstrapped fresh; the store was empty; the lesson lived in a document the
   second session had no reason to open. **The recurrence is the proof that prose in
   a doc is not a retrieval mechanism** — and the cure the day chose was to move the
   rule into the two files a compacted self is *forced* to read.

4. **A demo exercises what you thought of; an application exercises what the
   substrate promised.** SNS shipped needing nothing. *Drawing* SQS — before
   building it — found that the Store could not delete, that the in-memory backend
   appended where its own referent replaces, and that the timestamp renderer made
   every range scan over a sort key unsound. **Nine substrate changes out of a
   composition budgeted for zero.** This is the whole argument for "in anger."

5. **An oracle that admits a state its subject cannot represent is not an oracle.**
   The differential passed for months. `mem-store` could hold two rows at one
   primary key — impossible in DynamoDB, the named referent — and that impossible
   state is exactly what hid a journal key collision dropping two metrics in three
   from every span close, on *every* conforming backend. **Fixing the oracle broke
   nothing; it removed a blindfold.** And the corollary the census added: 13 of 15
   fixtures agreeing is a fact about the corpus, not about the bug — *"the corpus
   barely exercises the shape production emits constantly."*

6. **Fix the teacher, then re-run the student.** A halt is not a delay. Stone 4
   stopped on a STOP trigger with `total=0` and *named* the fix without applying it;
   the builder's response was not "try again" but "how do we attack that before we
   have grok attempt this proof again?"; two stones widened the *guard's reach* so
   the wrong turn stopped being reachable; and only then did the proof land. Four
   stones, one arc. **The record's own line: "the halt is why this worked."**

7. **"Did the instrument report a failure?" is the wrong question. "What can this
   instrument not see?" is the right one.** Five instances in three days, on two
   machines: `--include=*.rs` excluding a `.md`; a grep for `Vector|vec` missing
   `HashSet`; a comparison half-run and half-remembered; a file-level census read as
   a defect-level one (a type-check halts at the first error, so it cannot enumerate
   what else is broken inside one file); and a drift gate shaped for retired *names*
   reporting clean against a retired *form*. **And the strongest generalisation
   anyone reached: the drifting thing is whatever the main line last made illegal —
   twice a name, once a form, next time assume neither.**

8. **A green floor can be identical under a real fix and under a weakened check.**
   Stone 6's row 8 exists only because EXPECTATIONS were written *before* the strike:
   the queue could be made to freeze by moving the type (right) or by weakening the
   guard (wrong), **and the floor would have looked the same either way.** The
   discipline that catches that is not a better test, it is writing the acceptance
   criterion before you know the answer.

**Does not hold up without the log** (evidence, not argument): the floor numbers
(5094 → 5131), the commit counts, the site counts, and the exact ordering of the
thirteen stones. Useful as texture and citation; not load-bearing.

**Verdict: PASSES DECISIVELY.** Eight items, of which 1, 2, 4, 5 and 7 are
mechanisms a reader could not have derived from the commit subjects.

---

## Open questions, gaps, and things I did not do

1. **⛔ THE "SEVENTEEN" IS WRONG IN THREE PLACES AND ALL THREE ARE LIVE** —
   `331543758`'s body (uncorrectable), `docs/excursus/README.md:34`, and
   `docs/COMPACTION-AMNESIA-RECOVERY.md:1567` (FM 21). The correct sentence is:
   *eleven commit subjects between `fe1e923d5` and `8e41d13be` read `(301)`; the
   range holds twelve commits, the twelfth being `167878ec5`, `NOTE(109)`.*
   **Flag to the builder. I did not edit `wat-rs`.**

2. **⛔ `001-sns-sqs/DESIGN.md` is titled `# Arc 301 — SNS and SQS` at the branch
   tip**, four lines' worth of README contradicting it, and its status block is ~20
   hours stale (says stone 2 is "blocked on ONE ruling"; all seven struck). **The
   move commit changed it by zero lines.** Same class as FM 22, one file over from
   where FM 22 was minted. **Flag to the builder.**

3. **A date-zone trap the writer will hit.** `SCORE-stone-5-surface-guard-reach.md`
   opens *"Executor: grok, **2026-08-31**"* and cites `.floor/2026-08-31T02-42-31Z/`
   — while the commit is `2026-08-30 19:56 -0700`. **The SCOREs date in UTC; the
   commits are `-0700`.** The cutoff marker is a commit, so `-0700` governs. A
   writer reading the SCOREs will conclude stones 5–7 are post-cutoff. **They are
   not.**

4. **I did not run the floor, or any `.wat` program.** Every floor number here
   (5094 / 5103 / 5113 / 5119 / 5121 / 5122 / 5126 / 5127 / 5129 / 5131) and every
   program output (`"3 3"`, `"bound=x;r1=a,b;r2=c;r3=;redel=b"`,
   `"n=2000;m=4;j=3;total=8000;distinct=8000;dup=0;workers=9;empty=1"`) is **quoted
   from a commit body that states the orchestrator's own re-run.** If the post
   quotes a number, it is quoting the record and should say so. `wat-rs` is
   read-only for me by instruction.

5. **The `002` unit is post-cutoff but is the natural sequel, and it closes the
   `uiol-006` thread.** `002-handle-lifetime-wall` (commissioned 08-31) states the
   rule — *"A `Peer` may not escape a scope that CREATES its service's `Handle`"* —
   and its commit `f7b7ddfc0` reads *"this defect was diagnosed five weeks ago and
   dismissed as contrived."* Five weeks before 08-31 is 07-25 — the DoS day.
   **Note it as the forward pointer; do not narrate it.**

6. **`ffd1af14b`'s "perverse" finding is in-window, unnarrated here, and might be a
   better inset than anything I chose.** Three probes: a direct accessor call is
   GREEN; the same accessor in value position over `(Vector :- [:probe::R])` is RED;
   over `(Vector :- [:wat::core::Record])` — *more abstract* — it is GREEN.
   **Being more specific about your data makes the program stop compiling.** The
   commit is explicit about its own limit: *"I measured the behaviour and found the
   compensating call-site path. I did NOT find the line that BUILDS the scheme with
   a Record receiver."* Not drawn; a type-system question, filed to arc 109 at the
   builder's direction (`167878ec5`).

7. **I did not audit whether the excursus tree survives to today.** It exists on
   `origin/sns-sqs` only (0 files on `main`, `grok-rete`, `claude-compute`,
   verified). `sns-sqs`'s tip is `dd11bf858`, 2026-09-07 — the branch is still
   running. Whether excursus 001 or 002 has since been *promoted* to an arc I did
   not check, and it would be a good final line for the post if one has.

8. **`claude-compute` has zero commits in W11 — it wrapped on 08-30**
   (`docs/STORY-BRANCHING.md:627`). Its last own commit is its own CURARE,
   `f92f55dbd`. The front stays live because `sns-sqs` runs on. **A front is a
   purpose, not a branch** — and this post is the cleanest possible demonstration
   of that doctrine, because the front's two halves ran on different branches, in
   different number spaces, and produced the same lesson.

9. **Slug.** I used `services-001-the-front-opens` as given. Series placement,
   title and song are the builder's.
