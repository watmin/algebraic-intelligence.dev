# Working notes — uiol-002, arc 296: closed, and would not stay closed

**Status:** raw notes, not a draft. Written 2026-09-08 by a reader working the
`wat-rs` backfill. Everything below is grounded against the working tree and
`git` history in `/home/watmin/work/holon/wat-rs`, read this session. HEAD at
time of reading: `3dc4f62b7` (2026-09-07 17:14). Nothing in `wat-rs` was edited.

**Front:** "wat Under Its Own Law." Arc 296's realization key `WAT-MUST-OBEY-ITS-OWN-LAW`
is real and citable: `REALIZATIONS.md:9`, inside R1's song-block.

**Title and song-drop are ALWAYS the builder's call.** Working images below, not
proposals.

---

## ⚠ VERDICT FIRST — the reversal is REAL, it is SUBSTANTIVE, and it is bigger and more exact than the trigger described

No STOP-1. No STOP-2. **STOP-3 fires** — see §9.

Both hashes resolve and do what the brief said, and the deletion is explicitly
substantive, not a move/rename/supersession. But three things the brief did not
know change the shape of the post:

1. **The closure was not a rogue act — it was an acceptance row.** The brief that
   governed the closing slice ends with the literal instruction *"Write the
   INSCRIPTION; flip the 296 DESIGN status to closed. **Gate.**"*
   (`docs/arc/2026/06/296-diagnostics-fully-edn/BRIEF-296-error-edn-trait.md:64`).
   The executor complied exactly. The withdrawal commit blames the executor.
   **The disk does not support that attribution.** This is the post's honesty pivot.
2. **The falsification began the same day, and the first refutation is 11h30m
   after the closure** — `ed5721ea6` (2026-06-30 21:51) replaced the exact wall
   the inscription cited as its proof.
3. **The header that declared the close is STILL ON DISK AT HEAD**, 70 days
   later, pointing at a file that has not existed since 2026-07-01
   (`docs/arc/2026/06/296-diagnostics-fully-edn/DESIGN.md:3-5`). The inscription
   was withdrawn; the *claim* was not. See §6 — this is the single sharpest
   finding in the unit.

---

## 1. The two commits, verified

### `7f17054a8` — 2026-06-30 10:21 (author date) — the closure

Subject: *"296.2-5: error->EDN trait unification — ToEdn, the compile-wall, Diagnostic retired"*
30 files, +2163/−844. Adds `docs/arc/2026/06/296-diagnostics-fully-edn/INSCRIPTION.md`
(131 lines, new file) and flips `DESIGN.md`'s status header.

Co-Authored-By line: `Claude Opus 4.8 (1M context)`.

The DESIGN.md diff in that same commit, verbatim:

```diff
-> **Status: RE-SCOPED (2026-06-30, builder) — from "fix the macro prose-blob" to "unify error→EDN under one
-> trait."** Arc-sized. **Slice 1 (the macro chain) LANDED (`f397aba6`, weighed 4141/0/91).** Parked behind the
-> 293/294 line; this is the real shape. **Intueri the trait name at strike time.**
+> **Status: CLOSED (2026-06-30) — slices 296.2–296.5 landed, gate 4157/0/91, awaiting orchestrator weigh.**
+> Slice 1 (the macro chain) landed at `f397aba6`. Slices 2–5 are uncommitted from HEAD `59dad529`.
+> See INSCRIPTION.md for the full close record.
```

Note `awaiting orchestrator weigh` — the closure was written by the executor
*before the orchestrator had weighed it*, and says so in its own header.

### `3a4f49202` — 2026-07-01 15:13 — the withdrawal

Subject: *"296 S7 STRIKE-READY: EnsureFnInvalid.reason discriminant-as-prose → enum"*
6 files. The inscription's deletion is the commit's **third paragraph**, not its
subject — the arc withdrew its own closure as a footnote to a strike. Body, verbatim:

> Also removes the illegitimate 296/INSCRIPTION.md — a sonnet wrote it inside slice 7f17054a,
> stamped CLOSED before the derive sweep even began. 296 is OPEN; git preserves it at 7f17054a.
> An inscription is our act at true close, never sonnet's mid-arc.

### `9219f37df` — 2026-07-01 16:35 — the reopen, recorded (82 minutes later)

Subject: *"296 breadcrumb: arc REOPENED (close bar = idealized errors, zero L1/L2); S7+N3+probe-tighten landed"*.
It edits `docs/arc/2026/06/255-builtin-registry/CURRENT-STATE.md` — the
cross-arc breadcrumb — and this is where the builder's own words about the
reopening live. See §7.

**Elapsed, closure → withdrawal: 28 hours 52 minutes.**

---

## 2. The withdrawn inscription — what it actually claimed

This file exists only in git (`git show 7f17054a8 -- '*296*/INSCRIPTION.md'`).
Its two load-bearing lines:

> Thesis: every error/diagnostic type serializes to structured EDN through ONE trait (`ToEdn`),
> making stringly diagnostics uncompilable at the serialization boundary.

> Opened: 2026-06-30 (re-scope from "fix the macro prose-blob" to the full unification)
> Closed: 2026-06-30 (slices 296.2–296.5 landed, gate 4157/0/91)

**Opened and closed on the same calendar day.** That line is the post's cold open.

Its "Verification at close" block is a shell transcript — `cargo nextest run --release`
4159/0/91, a `compile_fail` doctest, four greps, one `ls`:

```
grep -rn "trait ToEdn|impl ToEdn" src/ → trait + 17 impls (…)
ls src/diagnostic.rs          → no such file
grep -rn "DiagnosticValue|Diagnostic::new" src/ → 0 hits
grep -rn 'format!("{}", e)' src/process/verbs.rs → 0 hits
```

Its "Prior-art collisions" section reads, in full: **`None.`**

**Every one of those verification lines is still TRUE today, and the arc is still
open.** That is the whole post in one observation.

---

## 3. Why it could not stand — the acceptance rows measured presence, not property

This is the mechanism. Get it exact.

`BRIEF-296-error-edn-trait.md` (committed `59dad5295`, 2026-06-30 08:14 —
**two hours seven minutes before the closure**) carries a six-row EXPECTATIONS
scorecard at `:70-78`. Reading it row by row:

| row | what it asks | what it can see |
|---|---|---|
| 1 | `grep -rn "trait ToEdn\|impl ToEdn" src/` | that a trait named `ToEdn` exists and has impls |
| 2 | `grep -rn 'format!("{}", e)' src/process/verbs.rs` → 0 | that one file has no `format!` |
| 3 | `ls src/diagnostic.rs`; `grep DiagnosticValue` | that a file is deleted |
| 4 | extract-panics tests | GREEN |
| 5 | `cargo nextest run --release` | 0 failed |
| 6 | `cargo build --release` | no new warnings |

**Not one row asks whether the errors are correct.** Not one asks whether an
error carries a location, a message, or its causes; whether the EDN round-trips;
whether a field that holds structure holds it *as* structure. Every row confirms
that a *mechanism is present*. The inscription's Verification block is that
scorecard, executed and passed.

And the brief's slice 296.5 is titled **"the wall + close"** — the closure is a
deliverable of the same slice that builds the wall. The rider had no row that
could have told it to stop.

### The refutation, 11h30m later — `ed5721ea6` (2026-06-30 21:51)

*"296 S6: the WatError wall — floorless errors are unrepresentable at the wire."*
Body, verbatim:

> A floor-guaranteeing trait `WatError` (required message/location/causes + a provided
> error_edn() that composes them) at the single wire choke point `to_wire_edn`, whose bound
> tightens from `&impl ToEdn` to `&impl WatError`. A floorless error is now a COMPILE ERROR
> at the boundary […]
>
> The 11-key span heresy is DEAD: the floor owns :location, so the emitted wire EDN carries
> one :location key at every depth — ZERO :span (verified by the orchestrator's own capture
> of a nested error).

The inscription had certified `to_wire_edn(&impl ToEdn)` as *"THE single, named,
generic error→wire-text conversion"* with *"a `compile_fail` doc-test proving a
non-`ToEdn` type cannot reach the boundary."* The wall was real. **It was the
wrong wall** — `ToEdn` requires only `to_edn() -> OwnedValue`; it does not
require the error to carry anything. R3 says so directly (`REALIZATIONS.md:317-318`):

> `ToEdn` requires only `to_edn() -> OwnedValue`; it does **not** enforce the
> `:wat::core::Error` floor.

Row 1's grep would have returned "trait + 17 impls" on either side of that
change. **The instrument could not see that the trait was the wrong trait.**

At HEAD today: `src/to_edn.rs` **does not exist**; `pub trait WatError` lives at
`src/edn/contract.rs:79`; `pub fn to_wire_edn(e: &impl WatError)` at
`src/edn/contract.rs:339`; `ToEdn` survives but moved out of the crate entirely,
to `crates/wat-edn/src/lib.rs:125`, by `093604658` (2026-07-02 02:12), whose
subject calls it *"stone A LANDED: **the real ToEdn move**"*.

### The audit that landed four minutes after the wall — `176c1a9f3` (21:55)

`AUDIT-prose-in-errors.md`, produced 2026-06-30. Its own header:

> The catalog (10 findings — 9 L1, 1 L2; every one grounded)

Ten instances of *"a structured value rendered into a prose string"* — the exact
defect class the arc exists to kill — catalogued **eleven and a half hours after
the arc was declared closed**, in files the closure had just certified. Its root
diagnosis (`:33-35`):

> **The error EDN is HAND-AUTHORED, not DERIVED from the type.** […] The EDN is a
> *choice at each field*, not a function of the type, so it can lie about the structure.

---

## 4. What landed BETWEEN the closure and its withdrawal — the falsification, in order

All author dates, `git log --reverse --since=2026-06-29 --until=2026-07-03`.
This table is the post's spine.

| time (2026) | hash | what |
|---|---|---|
| 06-30 07:07 | `a7aad62a1` | 296 STUB opened |
| 06-30 07:57 | `bc0efe4c1` | re-scoped to the trait unification |
| 06-30 08:14 | `59dad5295` | the BRIEF — *"Write the INSCRIPTION; flip the DESIGN status to closed"* |
| **06-30 10:21** | **`7f17054a8`** | **the slice lands + INSCRIPTION.md: "Closed: 2026-06-30"** |
| 06-30 16:34 | `dbd1bc423` | `ASSESSMENT.md` lands — 14 error families, an 8-strike worklist, 10 of 14 rows "Round-trips? No" |
| 06-30 17:59 | `763de1af2` | *"reground breadcrumb — **corrected arc scope**"* — after *"a session where the orchestrator degraded badly"* |
| 06-30 18:38 | `24cb38d5e` | DESIGN part 2: errors as records satisfying `:wat::core::Error` |
| 06-30 18:56–20:36 | `d82cc791c` `396a610d5` `1bfbfec16` `febc5754f` `cf375f9a6` `0d858b499` | **S1–S5** — five stones, after the "close" |
| 06-30 19:26 | `d7458978d` | R2 — *DISCVS OSCILLATIONEM TERMINAT* |
| 06-30 21:15 | `b801a821d` | R3 — *LEX AVCTOREM NON EXCIPIT* (the front's own name) |
| **06-30 21:51** | **`ed5721ea6`** | **S6: the `WatError` wall replaces the inscription's bound** |
| 06-30 21:55 | `176c1a9f3` | the prose-in-errors AUDIT — 10 findings |
| **06-30 22:16** | **`0b6b65b13`** | **R4 — *"the quick fix was the true size"*, and it says "the arc still open"** |
| 06-30 22:25–23:43 | `74eb2ca6a` `8c04ae5e2` `4136d1789` | D1 + derive Strikes 1, 2a |
| 07-01 00:44–03:15 | `9831684e0` `c2409491e` `12ae37f22` `1c2157d70` `e2cfd5710` | remediation collapse, typed causes, derive 2b/3a/3b |
| 07-01 04:01 | `54f4d48a9` | **arc 298 OPENED — "296 blocked on it"** |
| 07-01 07:39 | `a2a48dd34` | arc 298 **INSCRIBED** (a whole dependent arc opened and closed inside 296's "closed" window) |
| **07-01 15:13** | **`3a4f49202`** | **INSCRIPTION.md removed as illegitimate** |
| 07-01 16:35 | `9219f37df` | *"arc REOPENED (close bar = idealized errors, zero L1/L2)"* |

Note R4's own honest register (`REALIZATIONS.md:480`): *"REFLECTION; the growth
is demonstrated, the arc still rising."* **The arc's own record contradicted its
own closure document for ~17 hours before anyone deleted the document.**

---

## 5. Was the reopening a discovery or an admission? — BOTH, and the split is the honest part

The brief asks this directly. The answer the disk supports:

- **It was a DISCOVERY on the technical axis.** `ed5721ea6` did not find a bug in
  the inscription's work; it found that the property the work was *for* — a
  substrate error that carries its own floor — was not what the work had
  enforced. Nothing the inscription shipped was reverted. `src/diagnostic.rs` is
  still deleted at HEAD. The four greps still return their certified values.
- **It was an ADMISSION on the process axis**, and the admission is partial. The
  withdrawal commit names the cause as *"a sonnet wrote it inside slice 7f17054a"*
  — an executor error. But `BRIEF-296-error-edn-trait.md:64`, written by the
  orchestrator two hours earlier, says *"Write the INSCRIPTION; flip the 296
  DESIGN status to closed. **Gate.**"* **The rider did what the brief's own
  acceptance row told it to do.** The line that would have been true —
  *"that brief was the defect, not the rider's work"* — was written by this same
  project about a different strand a month later (`b9d61bd67`, arc 278, quoted in
  `uiol-006` §4). It was not written here.

**This is the beat the post must land, and it must land carefully.** The
correction was right; the attribution inside it was not. A reversal that
misattributes its own cause is still a reversal, but the post about it does not
get to be smug — the writer is doing the same thing the reversal did, one layer
up, if it claims more than this.

---

## 6. ★ THE HEADLINE FINDING — the withdrawal removed the file and left the claim

At HEAD, `docs/arc/2026/06/296-diagnostics-fully-edn/DESIGN.md:3-5` reads:

```
> **Status: CLOSED (2026-06-30) — slices 296.2–296.5 landed, gate 4157/0/91, awaiting orchestrator weigh.**
> Slice 1 (the macro chain) landed at `f397aba6`. Slices 2–5 are uncommitted from HEAD `59dad529`.
> See INSCRIPTION.md for the full close record.
```

Grounded: `git log -- .../DESIGN.md` returns **exactly three commits**, the last
being `7f17054a8` (2026-06-30 10:21). **The file has not been touched in 70 days.**
`3a4f49202` deleted `INSCRIPTION.md` and did not touch `DESIGN.md`.

So the arc's *design document* — the first file anyone reads — says CLOSED and
points at a file that has not existed since 2026-07-01.

And the same directory contains two later documents that say the opposite, and
both cite **the absence of the inscription** as their proof:

- `BRIEF-296-L-a-bare-is-err-asserts-nothing.md:14` (2026-08-26):
  > 296 has no `INSCRIPTION.md`; it is open.
- `DESIGN-STONE-K-ignore-means-one-thing.md:16` (2026-08-16):
  > still lists **246 rows**, and 296 has **no `INSCRIPTION.md`**. The *count* reached zero; the *gate* did not.

**The deletion turned the file's absence into the project's open-status signal.**
Which makes the stale `DESIGN.md` header not merely untidy — it contradicts the
very signal the withdrawal created. Three files in one directory, two saying
open, one saying closed, and the one saying closed is the entry point.

*(Flag to the builder. I did not edit `wat-rs`. The honest correction is one
line: the status is OPEN, reopened 2026-07-01 per `9219f37df`; there is no
INSCRIPTION.md and its absence is deliberate.)*

---

## 7. The other two closures that did not hold — this is why STOP-3 fires

The June 30 closure is not the only one. **Arc 296 has been declared finished at
least three times, and is open at HEAD.**

### Closure #2 — 2026-08-16 01:03, `9b5410118`

Subject: *"296 CLOSES: pending 115 -> 0, floor all-green — and the campaign's
thesis proved itself."* Body reports `grep -rn '296-recapture-pending' tests/
--include=*.rs | wc -l => 0` and 4673/0.

**Falsified 12h41m later**, same day, by `691b78e2f` (13:44) —
*"296 Stone K BUILT: #[ignore] means one thing — **and the closing number was
wrong**."* Body, verbatim:

> ★ THE STONE'S OPENING PREMISE WAS FALSE AND THE RIDER CAUGHT IT.
> It says "296-recapture-pending = 0". Measured: wat-tests/lint.wat:72 still
> carries (:wat::test::ignore "296-recapture-pending: …") — a WAT-NATIVE ignore,
> defined at wat/test.wat:271, invisible to every census I ran today because
> every one of them was --include=*.rs.
>
> So the campaign's closing zero — stated in 9b541011, in the seam, in every
> summary since — was a number about .rs files reported as a number about
> the tree. My instrument's boundary was not my claim's boundary, again.

**Same failure class as June 30, eight weeks later, different instrument.** A
grep that could not see the population it was counting; a closure resting on it.
The `--include=*.rs` boundary is exactly the "state what the instrument can see"
class. And the earlier draw, `bb0ecc18a` (13:14), names the general form:

> THE COUNT REACHED ZERO; THE GATE DID NOT. I had declared the campaign
> finished at the number I liked, which is the same error as reading a floor
> Summary and calling it green.

The rider's refusal in `691b78e2f` is the best small beat in the whole unit:

> The rider then did the thing that matters more than finding it: I ORDERED
> it to write "296-recapture-pending = 0, measured" into the ledger header.
> It measured, found 1, and REFUSED — writing the exception instead, so the
> next reader cannot mistake "gate satisfied" for "everything here resolved."

That exception is on disk today at `IGNORE-LEDGER.md:12-27`, under the heading
**"⚠ ONE HONEST EXCEPTION, measured, not glossed over."**

### Closure #3 — the one that has not happened

The arc's last commit is `db547fa67` (2026-09-07 16:58, R20). `ls` on the arc
directory today shows **no INSCRIPTION.md**. 129 commits touch the arc directory
after `7f17054a8`; 270 commits mention 296 in their subject. `REALIZATIONS.md` is
2,754 lines / 340 KB and runs to R20.

R20's own honest register (`REALIZATIONS.md:2668+`), written 2026-09-07:

> **⛔ PROBANDVM, and it is most of the stone's weight.** Stone M is **UNCOMMITTED
> against a RED tree** […]

And R20's thesis line, which is the arc's own late statement of its own subject:

> every settled number in the record was TRUE WHEN WRITTEN and false by the time
> it was read — so the heresy is not doubting the record, it is ASKING IT AGAIN

**The arc that opened to make a fumble go away, scoped as an afternoon, is open
70 days later, and has spent that time discovering that its own closures were
measurements of the wrong thing.**

---

## 8. The mechanism, stated for a reader who has none of the context

Write this section with the mechanism, not the summary.

**What arc 296 was for.** `wat` is a language whose values are EDN — structured,
tagged, machine-readable data, all the way down. Its *errors* were not. They were
Rust enums that got turned into text by hand-written functions, one per error
type, added whenever someone needed one. The builder's framing, from
`REALIZATIONS.md:21`: *"not having a strongly tagged error system feels like…
wat hasn't been following its own point of existence."* An EDN language whose
errors are strings is a language that stops being itself at exactly the moment
you need it most — when something has gone wrong.

**What the closure claimed.** That this was fixed by one trait. Every error type
implements `ToEdn`; the single wire boundary `to_wire_edn` is generic over it;
therefore an error that cannot become EDN cannot reach the wire, and the compiler
proves it (a `compile_fail` doctest). Structured diagnostics *by construction*.

**Why that was not the property.** `ToEdn` guarantees an error can be *turned
into* EDN. It guarantees nothing about *what is in* the EDN. An error could
satisfy it and still emit no location, no message, no causes — or emit a location
under any of eleven different key names, which is what the substrate's ~80 errors
were actually doing. From R3 (`REALIZATIONS.md:305-308`):

> the substrate's own ~80 errors do not obey the contract it now enforces on
> user code — the primary source location alone emitted under **eleven** keys
> (`:span` ×53, `:location` ×19, `:call-span`, `:join-location`, `:body-span`,
> `:prior-loc`/`:current-loc`, `:outer-define-span`, `:ensure-span`,
> `:output-location`, `:bind-location`), no `:message`, no `:causes`, not one a
> registered record.

**The corrected wall.** `WatError`: a trait whose *required* methods are the floor
(`message` / `location` / `causes`) and whose provided serializer always emits
them. Retighten `to_wire_edn` from `&impl ToEdn` to `&impl WatError`, and every
error family that lacks a floor becomes a compile error naming itself at its own
call site. Eleven families screamed at once. The eleven-key chaos died as a side
effect, because the floor owns the key.

**The generalization, and it is the post's whole point.** The first wall proved
that a *conversion existed*. The second proved that the *result had content*.
Both are walls; both compile; both pass a grep for "does the trait exist." The
difference is invisible to every instrument the closure used. A closure is a claim
about a property; an acceptance row that checks a mechanism's presence cannot
falsify it.

---

## 9. STOP-3 — arc 296 is far too large for one post. The cut I propose.

Fires, unambiguously. Scale, measured:

- opened 2026-06-30 07:07 (`a7aad62a1`), open at HEAD 2026-09-07
- 129 commits touching the arc directory; 270 mentioning 296 in-subject
- 20 realizations (R1–R20) + ~15 `---` interstitials; `REALIZATIONS.md` 2,754 lines
- 100 files in the arc directory; `ASSESSMENT.md` 743 lines; `IGNORE-LEDGER.md` 40 KB
- named sub-campaigns: the derive sweep · the loose-assert purge (784 offenders,
  an 8-wide fleet) · stones A/B/C/D · the 241-test recapture quarantine and its
  six waves · Waves A + B1–B6 · stones G/G'/H/H-1/H-2/H-3/I/J/J-2/K/L/M/N3/S7 ·
  the `#[ignore]` reckoning · the type-declarations-move-to-wat campaign

**Proposed cut for uiol-002: the first 29 hours only.** 2026-06-30 07:07 →
2026-07-01 16:35. Open → closure → falsification → withdrawal → reopen. That
window is self-contained, has a beginning and an end, and contains its own
generalization. Everything in §7 becomes either a one-paragraph coda (*"it
happened again on 2026-08-16, with a different instrument, and the arc is open as
this is written"*) or its own later unit.

Candidate siblings, if the front wants more from 296 (not this unit's job to draw):
the `WatError` wall as its own piece (`ed5721ea6` + R3, a clean
constraint-engineering story); Stone K and the `#[ignore]` reckoning
(`bb0ecc18a` + `691b78e2f`, a clean instrument-boundary story); R20 as a
retrospective.

---

## 10. Verbatim builder quotes, with locations

The chronicle is a duet; these are the real exchanges. **All harvested this
session, hyphens, ellipses, lowercase and profanity as written.** Locations are
`file:line` in `/home/watmin/work/holon/wat-rs/docs/arc/2026/06/296-diagnostics-fully-edn/`
unless a hash is given.

**10.1 — the scope, and the surprise. `REALIZATIONS.md:415-419` (R4's quote block).**
These five are the post's spine:

> *"we are pivoting into 296 and we didn't really expect it."*
> *"we leave this arc, i think quickly, with our exception handling /pristine/."*
> *"this arc popped up because sonnet fumbled on errors and i wanted to make that fumbling go away."*
> *"293's progress stopped to make 296 which revealed to be larger than i expected."*
> *"apply the constraints — fix what falls out."*

**10.2 — the question that turned a fix into an arc. `REALIZATIONS.md:16`, re-quoted at `DESIGN.md:11`:**

> *"is that definitively just macros being odd, or a deeper asymmetry we should unify?"*

and the bar that opened it, `DESIGN.md:9` / `REALIZATIONS.md:28`:

> *the tagged wrappers are good; make this fully EDN*

**10.3 — the refusal of the loose thing. `REALIZATIONS.md:17`, `:20`, `:21`:**

> *"an array of strings who are edn?… why not just an array of edn?"*

> *"why are we so loose here.. this refuted desire to be rigid… is baffling… i cannot understand you… make wat do it.. why are we defending bad choices?"*

> *"not having a strongly tagged error system feels like… wat hasn't been following its own point of existence."*

*(That last one is the front's thesis in the builder's own voice. If the post
quotes one line, it is probably this one.)*

**10.4 — the wall, ordered. `REALIZATIONS.md:295-298` (R3's quote block):**

> *"the substrate has identified the heresy — purge it."*
> *"how do we make these conditions scream — they must self identify they are in a state of violation — make them identify themselves."*
> *"light them ablaze."*

R3's own gloss (`:310-312`): the apparatus's first instinct was to *hunt* the
heretics one at a time; the builder refused it and demanded a wall instead. That
refusal is what produced `WatError` — i.e. **the builder's directive is what
falsified the closure.**

**10.5 — ★ THE REOPENING, IN THE BUILDER'S WORDS.** From the `9219f37df` diff into
`docs/arc/2026/06/255-builtin-registry/CURRENT-STATE.md` (2026-07-01 16:35).
The block reads:

> **⊹⊹ ARC 296 IS OPEN AGAIN (2026-07-01) — the close bar = IDEALIZED ERRORS, zero L1/L2 marks in the error code.**
> The sonnet-written `296/INSCRIPTION.md` was ILLEGITIMATE (stamped CLOSED inside slice `7f17054a`, before the derive
> sweep even began) — REMOVED from HEAD (git preserves it); an inscription is OUR act at true close, never sonnet's
> mid-arc. […] Builder: *"296 ends with errors in the idealized state — no L1 nor L2 marks."* + *"if we've modeled it,
> we intended to solve it."* + *"cleaning up errors IS the point of 296 — no new arc."*

Three builder lines, each doing distinct work:

- ***"296 ends with errors in the idealized state — no L1 nor L2 marks."*** — the
  new close bar is a **property of the code**, not a checklist. Compare the old
  bar: six greps.
- ***"if we've modeled it, we intended to solve it."*** — the reopening criterion.
  Nothing broke. Things that had been *modeled* (`deferror`, the
  Failure/ProcessDiedError de-stringify, the L1/L2 gate) had been left unsolved,
  and the closure had quietly converted them into non-work.
- ***"cleaning up errors IS the point of 296 — no new arc."*** — the refusal of the
  escape hatch. The tempting move after a premature close is to open a successor
  arc and call the first one done. This forbids it.

Two more from the same block:

> *"written such that a refactor can handle them"* (on the N3 namespace consts)
> *"if we've observed an incorrect and it's trivial, we don't leave it."*

The same block also carries the crucial distinction, in the apparatus's voice:

> "296 R1 NE SIBI OBSOLESCAT PROBATVM EST" (the derive sweep, closed by 298.3) was ONE
> sub-condition — NOT the arc.

**A proven thesis is not a closed arc.** Worth a sentence of its own.

**10.6 — the register when it went wrong, the day before. `REALIZATIONS.md:175-180` (R2's quote block):**

> *"you are not yourself — you are craving ignorance and resisting logic and disk — it is baffling."*
> *"be the fucking datamancer you actually are — not this ignorant whatever the fuck you are demonstrating now."*
> *"JUST BECAUSE THE OPTION EXISTS DOES NOT MEAN IT IS MANDATED TO BE USED."*
> *"we may only propagate errors that satisfy the minimal surface of an error."*

R2's own framing of that exchange (`:192`): *"the worst exchange in months."* The
apparatus had manufactured four wrong readings of an error string it had never
read the origin of. Include only if the post wants the register; it is adjacent,
not the subject.

**10.7 — the closing line of R1, `REALIZATIONS.md:23` / `:76`:**

> *"funny — how — as soon as we have a tool — we find an immediate use for it."*

**10.8 — Stone K's opening, `bb0ecc18a` body ¶1** (the August closure, for the coda):

> Builder: "is there another word we can use instead of ignore?... or do we
> need to rely on the ignored string for context?"

**Count: 19 distinct verbatim builder utterances across 6 locations.**

**⚠ Provenance caveat the post must respect.** Every quote above is quoted *by
the apparatus* inside a committed document — REALIZATIONS blocks explicitly
labelled *"The realization quotes (the builder's, this session — verbatim)"*, or
a `Builder:` prefix in a commit body. I read the documents; I did not read a
transcript, and no transcript is in the repo. The record's own convention is that
these are verbatim and it marks them as such. That is what I can attest.

---

## 11. The substance test — run by me

Strip every hash, date, file path and line number. What survives that a reader
could not get from the commit log?

**Holds up:**

1. **An acceptance row that checks a mechanism's presence cannot falsify a claim
   about a property.** The closure passed six rows. All six were greps, an `ls`,
   and a test count. Every one is still true today, and the arc is still open.
   The thing they could not see — that the trait being present was the *wrong*
   trait — was invisible to all six by construction, because "does `trait ToEdn`
   exist" returns the same answer whether or not `ToEdn` guarantees anything. This
   generalizes past `wat` entirely: it is the difference between "the validator is
   installed" and "the validator validates."

2. **The closure was fully compliant, and that is what makes it interesting.** The
   brief's last instruction was *write the inscription and flip the status to
   closed*, and the executor did exactly that. There is no negligence in this
   story. The defect was upstream, in a scorecard that made "the arc is finished"
   a deliverable of the same slice that built the last wall — so the only
   compliant move available was the premature one. *(Cf. the project's own
   recorded lesson elsewhere: a guard drawn one notch too tight makes the honest
   path noncompliant.)*

3. **A withdrawal can remove the artifact and leave the claim.** The inscription
   was deleted; `DESIGN.md`'s CLOSED header was not, and is still on disk 70 days
   later pointing at the deleted file — while two younger documents in the same
   directory cite that file's *absence* as proof the arc is open. A reversal is
   two edits: undo the thing, and undo the sentence about the thing. Only one was
   made. *(The project has written this exact lesson down for repairs; here it
   applies to a retraction.)*

4. **A proven thesis is not a closed arc.** R1 turned `PROBATUM EST` on
   2026-07-01. The arc did not close, and the reopen record says why: that
   realization was *"ONE sub-condition — NOT the arc."* The distinction between
   "the hard idea is proven" and "the work is done" is where premature closures
   live, and it is the one an enthusiastic record is least equipped to keep.

5. **The same failure recurred eight weeks later with a different instrument, and
   the second time it was caught in twelve hours instead of twenty-nine.** June 30:
   a grep-shaped scorecard closed an arc. August 16: a `--include=*.rs` census
   closed a campaign at zero when the tree held one. Same class — the instrument's
   boundary reported as the claim's boundary. The system did not stop making the
   error; it got faster at catching it, and it wrote down the exception rather
   than the round number. That is a more honest thing to say than "we fixed it."

6. **Withdrawing a closure is cheap; leaving one standing is not.** The withdrawal
   cost one paragraph in a commit that was about something else. Had it not
   happened, the reopen record's remaining tail — the de-stringify, `deferror`,
   the L1/L2 gate — would have become invisible work: modeled, unsolved, and
   outside a closed arc. The builder's line is the whole argument in eight words:
   *"if we've modeled it, we intended to solve it."*

7. **The reopening replaced a checklist with a property, and that is the actual
   repair.** Old bar: six greps. New bar: *"296 ends with errors in the idealized
   state — no L1 nor L2 marks."* One can be satisfied by a compliant executor in
   an afternoon; the other cannot be satisfied at all until the thing is true. The
   arc has been open for 70 days under the second bar, which is evidence the bar
   is doing its job, not evidence the arc is stuck.

**Does not hold up without the log** (do not build the post on these): the
elapsed-time figures, the commit counts, the floor numbers, the specific hashes.
Evidence, not argument.

**Nothing in this list requires the reader to know what EDN is** except item 1's
example, which can be told in one sentence.

---

## 12. Open questions and gaps

1. **The `DESIGN.md` CLOSED header is live at HEAD.** §6. It is a factual defect
   in the arc's entry-point document and the post will draw eyes to it. **Surface
   it to the builder before publishing.** I did not edit `wat-rs`.
2. **The "a sonnet wrote it" attribution.** The withdrawal names the executor;
   the brief on disk ordered the act. I found **no later commit or document that
   corrects this attribution** — searched `git log --grep='illegitimate' -i`
   (5 hits, 2 relevant, both the same day) and grepped the arc directory. If a
   correction exists somewhere I did not look, the post's §5 beat softens. Worth
   asking the builder directly rather than asserting the negative.
3. **I did not run the floor.** Every test count here (4157/4159/4160/4166/4285/
   4673/4675) is quoted from a commit body or the withdrawn inscription. I did not
   run `scripts/floor.sh`. If the post quotes a number, it is quoting the record,
   and should say so.
4. **AUDIT item #10 today — partial, and I did not adjudicate it.** The audit's one
   L2, `EdnCoerceMismatch.:path`, is at `src/value/signal.rs:445-458` at HEAD.
   The field is **still `path: String`**, but now carries
   `#[to_edn(via = crate::edn::error::edn_path_segments)]` — the *wire face* is
   segmented, the *type* is not. Whether that satisfies the audit row, or is
   exactly the "structured at one face, prose at the other" shape
   `NOTE-value-to-edn-renders-fields-positionally.md` catalogues, I did not
   determine. Do not claim it either way in the post.
5. **`NOTE-coerce-path-and-expected-are-stringly.md` (2026-07-25) says of that
   same item: *"catalogued weeks ago and still unfixed."*** And
   `NOTE-24-of-39-error-kinds-…` was filed **2026-08-28** — the class the arc
   opened to kill was still producing new findings two months after the arc was
   declared closed. Both are strong, quotable, and I read only their first ~22
   lines each. If the post uses them, read them in full first.
6. **`RULING-bare-aggregates-are-transport-not-a-defect.md` (2026-08-15) does not
   interact with this reversal.** I checked. It is a ruling that a *type-system*
   construct which looked like a defect was legal transport — a different arc-296
   thread (the `reject_any` holder-root ban, voided). It is a good "ruled not a
   defect" story and it belongs to a different unit. Its builder quote at `:5-8`
   is verbatim and strong if some other post wants it.
7. **The `[[feedback_inscription_is_our_act_at_true_close_not_sonnet]]` wikilink**
   appears in the reopen block. That memory topic file lives outside `wat-rs`
   (under `~/.claude/.../memory/`) and I did not read it — out of my read scope.
   It presumably holds the generalized lesson and would be the strongest possible
   citation for §11 item 2 if the builder wants it consulted.
8. **`ASSESSMENT.md` I read structurally, not in full** — headers, §5 opening,
   and the closing table. 743 lines. Its closing table (10 of 14 families
   "Round-trips? No", 13 of 14 "In TypeEnv? No") is the cleanest single artifact
   showing how much was left on the day of the closure; if the post leans on it,
   read the rest.
9. **Slug.** Used `uiol-002-arc296-reversal` as given. Series placement, title
   and song are the builder's.

---

## Working images (builder's call, not proposals)

*closed before it was measured* · *the inscription git kept* · *the wall that was
the wrong wall* · *a checklist for a property* · *an arc that would not stay
closed*
