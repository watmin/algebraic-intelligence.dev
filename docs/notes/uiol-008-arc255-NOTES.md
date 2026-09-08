# Working notes — uiol-008, arc 255: the four axes stop being hand-lists (2026-08-14/15 + 2026-08-30)

**Status:** raw notes, not a draft. Written 2026-09-08 by a reader working the
`wat-rs` backfill. Everything below is grounded against the repo at
`/home/watmin/work/holon/wat-rs`, read this session. Where I ground a *state* (not
an event) I read it at **`8e79b8d39`** — the last in-window commit, 2026-08-30
15:38 — not at HEAD, because HEAD is a week past the cutoff and its tree is
mid-migration. Nothing in `wat-rs` was edited.

**Title and song-drop are ALWAYS the builder's call.** Working images below, not
proposals.

---

## ⚠ READ FIRST — the brief's scope warning is REFUTED by the disk

The brief says:

> **⚠ Note the 391 files against only ~6 in-window realization commits.** Most of
> that directory predates your window.

**That is false, and it is false in the direction that matters.** Measured, by
`--diff-filter=A` first-add date for every tracked file under
`docs/arc/2026/06/255-builtin-registry/`:

| when the file was created | count |
|---|---|
| before 2026-06-23 (pre-window) | **19** |
| 2026-06-23 → 2026-08-30 (in window) | **222** |
| after 2026-08-30 (past the cutoff) | **170** |

Almost nothing predates the window — **4.6%**. Over half the directory was written
*inside* it, and a further 41% was written in the six days *after* the cutoff.

Also: **391 is a directory-entry count, not a file count.** `ls` returns 391
entries, of which 390 are files and one is a subdirectory
(`the-walls-must-not-be-muted/`). `git ls-tree -r` returns **411 files**. Three
different numbers for three different populations; say which one you mean.

**What this changes for the post:** the risk is not that you will narrate an arc
that predates you. It is the opposite — **arc 255 is exploding across the cutoff**,
and the constraint is a *ceiling*, not a floor. The 08-31 → 09-05 material (170
files, 35+ commits on 08-31 alone) is a later post.

The **~6 in-window realization commits is exactly right**, and I confirmed it:
`4099d175c`, `645fe1417`, `d9a8668c4` (R5 + its correction), `1a245fcaa` (R6),
`0c4cd4152` (R7), `f0fd823f6` (R8) — all 2026-08-14/15, which is W8. R1–R4 are
2026-06-21, *before* the window opens. R9 is 2026-09-04, *after* it closes.

---

## STOP-2 — this unit carries a full post, comfortably, and the problem is the reverse

**2026-08-30 is 87 commits in one calendar day, 85 of them tagged `(255)`.** The
other two are the seam commit that reports the day's result and a `NOTE(109)`.
Measured, not estimated.

And the day's shape is almost too neat to be real: the first commit of 2026-08-30
is **`525dbdb5b`, at 00:00:14 −0700** — *"PROBE(255): the Totality axis is MINTED
— wat is the source of truth, and the door was broken to prove it."* Fourteen
seconds past midnight, the day opens by minting an axis, and closes at 23:34 with
the metadata store's last shape question. **The four-axes day is a calendar day,
and it is the batch's cutoff day.**

The risk is length, not thinness. My recommendation: **write the day, not the
arc.** The W8 realizations (§"the 08-14 hinge") are the *prologue* and should be
one section, not a second half.

---

## The through-line (one paragraph)

`wat` verbs carry declared properties — is this function pure, is it
deterministic — written as directives in the doc comment at the registration site,
and the compiler has refused a registration that omits them for months. But
nothing *asked*. The runtime's own fences kept their own answers: a 38-name
`matches!` list for totality, a 142-name list for purity-and-determinism, and a
202-name allow-list deciding what a macro may call at expansion time — hand-curated
copies of a truth the registry already held, each drifting on its own. On
2026-08-30 all four axes were made to derive. Two of them — **totality** and
**expand-time** — did not exist that morning; both were minted as `defenum`s **in
wat**, with the Rust types generated from the wat, and each was proved real by
renaming a variant in the `.wat` file and watching `rustc` go red. Each axis then
walked the same four rungs: declarable → carried → **required** → derived. Making
declaration required is the move that turns the compiler into the census: 431
registration sites, all 431 declaring, and *no one counted* — deleting one
directive rebuilds to an error naming the offending verb. Deriving is what exposed
the drift: the hand-lists had been giving opposite answers about `i64::/` for
months, a verb had been declaring `Deterministic` while two tests correctly
asserted the opposite, and 275 verbs had been carrying a declared ruling their own
fence was ignoring. What survives is not zero hand-lists but two **homing
backlogs** — 11 names and 59 names — whose membership condition is mechanical
(`lookup_entry` returns `None`) and whose comment says so. And the day's own
summary is the front's subject stated exactly: **every axis converged on the same
residue — verbs with no home.**

Working images (builder's call): *the compiler is the census* · *a wall does not
know who wrote it* · *declaring nothing is illegal* · *the registry answers first*.

---

## The four axes, named exactly

From `8e79b8d39` (2026-08-30 15:38), the CURARE seam commit that reports the day,
verbatim from its body:

```
  purity        ✅ derives   T5      hand-list gone
  determinism   ✅ derives   T5      hand-list gone
  totality      ✅ derives   T1→T4b  residue: 11 unhomed verbs
  expand-time   ✅ derives   T1→T4b  residue: 59 unhomed verbs
```

**Purity · Determinism · Totality · Expand-time.** No other reading is
defensible; this is the day's own scoreboard.

The same body's grounded numbers, which the writer may quote as the record's:
`floor 5109/5109 · registry 429+4 · runtime.rs 33,917 lines · KNOWN_UNREVIEWED 50 ·
debt ledger 55 · @Total 25/1/2/403 · @ExpandTime 143/0/0/288`.

And the line that is the post's ending:

> ★ Every axis converges on the same residue: verbs with no home. **The homing
> campaign and the property campaign are ONE campaign**, and both worklists are on
> disk.

---

## The mechanism, before and after — precise

### Before

Four consumers each held their own copy of the answer.

1. **`intrinsic_meta`** (`src/rete/purity.rs`) — the rete fence. Two literal
   `matches!` lists: a 142-name `pure_det` list and, once totality existed, a
   38-name `total` list, plus early-return special cases and three
   namespace-`starts_with` rules. It named **177 verbs**.
2. **`macros::is_pure_total`** (`src/macros/eval.rs`, ~411 lines) — the gate
   deciding what a verb may do at macro-expansion time. A hand-curated allow-list
   of **202 names**.
3. **`rete/vocabulary.rs` `RETE_OPS`** — its own `op.meta.total`.
4. arc 278's `where`-fence — `(and (pure? f) (deterministic? f) (total? f)
   (primitive? f))`. Three of those four had a home in the record model's Layer-1
   baseline; **`total` never did.**

**The lists did not agree, and nothing compared them.** From `525dbdb5b`'s body:

> `intrinsic_meta` names 177 verbs, `is_pure_total` names 202; only 102 are shared
> — 100 macro-only, 75 rete-only. They give **OPPOSITE answers** for
> `:wat::i64::/` — `is_pure_total` lists it as pure-and-total ("div-by-zero is a
> deterministic located abort, never a panic"), while `intrinsic_meta`'s total
> sub-list explicitly excludes it.
>
> That is not two lists drifting — it is **two DIFFERENT PROPERTIES wearing one
> name.**

That last sentence is the whole diagnosis, and `expand-1` (below) proved it.

### After

- The axis vocabulary is **declared in wat** — `wat/runtime-meta.wat` carries
  `(:wat::core::defenum :wat::runtime::Purity …)`, `…::Determinism`, `…::Category`,
  `…::Totality` (`:209`), `…::ExpandTime` (`:248`) — and the Rust enums are
  **generated from it** by `wat_source_derive::wat_enum_from!`
  (`crates/wat-doc/src/lib.rs:49, :55, :84, :1748, :1785`), with the `.wat` `;;`
  prose becoming Rust `///` docs.
- A registration site that omits a required directive **does not compile**.
  `crates/wat-doc/src/lib.rs:244` is `MissingTotality`, `:250` is
  `MissingExpandTime`; `:717` and `:721` are
  `…_val.ok_or(DocError::Missing…)?`. The proc-macro refuses to expand and the
  error **names the verb**.
- The fences **look the answer up**:
  - `src/rete/purity.rs:521` — `if let Some(e) = crate::intrinsic::registry().lookup_entry(head)` (purity + determinism)
  - `src/rete/purity.rs:688` — `let total = match crate::intrinsic::registry().lookup_entry(head).map(|e| e.totality)`
  - `src/macros/eval.rs:424` — `fn is_expand_time_legal(head: &str)`, which now returns `matches!(e.expand_time, Legal | Preserving)` for any registered head.
- The residues are not hand-lists but **homing backlogs**, and the source says so.
  From `83ac517c2`, the comment left in the code:

  > "NOT a hand-list of which verbs are expand-time legal: every name below is one
  > for which `lookup_entry` returns `None` … a HOMING BACKLOG … **A REGISTERED
  > verb does not belong here** — if one is ever added below alongside a real
  > registration, the derivation above is being shadowed by a copy, which is the
  > exact defect this stone exists to remove."

### What the compiler can now refuse that it could not before

1. **A verb that declares nothing on any of the five required axes.** `@Purity`,
   `@Determinism`, `@Category` were already required; `@Totality` and
   `@ExpandTime` joined them on 2026-08-30. *Absence is an error, not a default.*
2. **A wat-side rename that the Rust half has not followed.** Renaming a variant
   in `wat/runtime-meta.wat` produces `E0599` in the Rust that matches on it. This
   was not asserted — it was **done, twice**, deliberately, as the probe
   (`525dbdb5b` and `0625c6b2c`, each renaming a variant and capturing the error).
3. **A guessed classification masquerading as a measured one** — via the fourth
   variant, `Unreviewed`, which is default-deny. See below; it is the design
   decision the whole day rests on.

### What it still cannot refuse (be honest about this)

- The shadowing invariant on the residue lists is a **comment**, not a check. If
  someone adds a registered verb to the 59-name residue, nothing fires.
- **11 and 59 verbs remain unhomed**, and their rulings therefore still live in a
  `matches!` rather than at a registration site. They retire row by row as the
  homing campaign reaches them.
- `is_expand_time_legal` still cannot see the property where it actually lives:
  `b1a456d47`'s own note says the honest instrument for expand-time determinism is
  **expanding a macro twice and comparing the output** — "that tests the property
  where it lives, for every verb, with no curated list." It is recorded, not built.

---

## The story beats, in order

### 0. The 08-14 hinge — the prologue, and it belongs to two posts

The W8 realizations (`255/REALIZATIONS.md` R5–R8, 2026-08-14/15) are where the
arc's *method* gets named, and one of them is load-bearing for uiol-004 as well.

**R6 — "Salvation Code": the day's whole yield was SUBTRACTION**
(`1a245fcaa`, `255/REALIZATIONS.md:692`). The afternoon started at *"can
`:wat::core::string` become `:wat::string`?"* and went down **eight layers** — is
`join` in it → what does `join` accept → `Seqable` → what about the elements →
`str` is partial → the total renderer already exists → adopting it broadcasts a
crate name → the tag namespace → the trait → arc 280 → arc 294. And at the floor
of nearly every layer, *the thing was already there and already right.*

**That descent is what voided arc 294's keystone** — the `HolonAST → Hologram`
rename (see uiol-004 notes, §"READ THIRD"). The ruling file lives in 294's
directory; the realization that records it is **255's R6**. Nothing was built that
day; 1263 sites became three items.

R6's structural claim is the one to carry (`255/REALIZATIONS.md:747–752`), and it
is the argument for the whole four-axes design:

> **Not one was catchable from inside**, and the reason is structural, not a
> lapse: *every individual measurement was correct.* A name the apparatus wrote is
> internally consistent with the map the apparatus wrote it into. **Grepping your
> own map confirms your own map.**

Which is exactly what a derived axis fixes: the registry is not the apparatus's
map, it is the code's own declaration.

**R7 — "Automatic Love": four walls fired on their own author in one afternoon**
(`0c4cd4152`, `255/REALIZATIONS.md:854`). Rune: **MVRVS AVCTOREM NON NOVIT** — a
wall does not know who wrote it. This is the front's subject in one entry, and it
is the best prologue available:

- The **central floor** came back 28 RED while the rider's own eight-test gate came
  back 8/8 green.
- **`no_inlined_edn`** convicted that stone's own probe — three string literals
  written that hour.
- The **totality wall** refused the 294.g probe at check time: `cosine` returns a
  `CosineOutcome`, and the draft had declared `-> f64`. Builder, on sight: *"we
  made holon total the other day.... some ops can fail... gotta match on them."*
- The **arc-293 acceptance demo** surfaced a bug **blessed as cosmetic seven weeks
  earlier** — `293/SCORE-293.4d.md:30` had logged `r=2` vs `r=2.0` as an honest delta
  *"in f64 Display only."* Builder's cut: ***"it was wrong before.... a float is
  not an int."*** The render was type-lossy; `2` reads back as an `i64`; and the
  *record itself* had written the loss down as acceptable.

**R8 — "The Great Heathen Army": two currencies** (`f0fd823f6`,
`255/REALIZATIONS.md:1003`). Rune: **IVDICIVM SEMEL, MACHINA SAEPE** — judgement
once, machine often. The apparatus had priced a second sweep of 113 goldens as a
*cost* and built an ordering argument around paying it. The measurement did not
refute the second pass; it refuted the **price**. A `wat-fix` codemod is a rule
written once and applied idempotently to every site — *"the second pass was never a
second adjudication."* And the stone that said so had been read, in full, that
session, before the sentence pricing it as work was written.

### 1. 00:00 — the Totality axis is minted, and the door is broken to prove it

`525dbdb5b`. Builder's ruling that opened it, verbatim from the body:

> "we have been dragging our feet on building a totality measurement - it sounds
> like now is the time to do it... in the near future we will only support
> totality... this effort will identify who doesn't... and it's a future work
> list."

`(:wat::core::defenum :wat::runtime::Totality …)` in `wat/runtime-meta.wat` plus
one `wat_enum_from!` generates `pub enum Totality`. And then, because a green build
proves nothing on its own, `:Partial` was **renamed in the wat** and the Rust went
red on cue: `error[E0599]: no variant … named 'Partial' found for enum 'Totality'`
(×4, EXIT=101). Renamed back, green.

**Four variants, and the fourth is the design decision:**

| variant | meaning |
|---|---|
| `:Total` | measured — defined on every input of its declared domain |
| `:Partial` | measured — undefined somewhere. **This variant IS the work list**: the totality endgame's census is `all_entries().filter(\|e\| e.totality == Partial)` |
| `:Preserving` | a special form preserving its sub-forms' totality — `if` is total exactly when its branches are |
| `:Unreviewed` | **nobody has measured this verb yet** |

The reasoning for the fourth, from the body: collapsing "measured partial" into
"never looked at" conflates *cannot* with *did not look*, "and because a GUESSED
`:Total` is a lie in a fence that ADMITS CODE into a `where`. It is default-deny …
and it is the only variant expected to disappear."

The seam's own lesson list ranks this first: *"`Unreviewed` as a FOURTH variant is
what made everything else safe — an unmeasured verb is default-deny, not a guess,
which is why T5 moved 275 verdicts with ALSO_TOTAL=0 and admitted nothing."*

Orthogonality, stated and never derived: `i64::/` is Pure **and** Deterministic
**and** undefined at a zero divisor.

### 2. 01:08 — declaring nothing becomes ILLEGAL (total-T3)

`56f95c5fb`. Builder: *"i think declaring nothing needs to be illegal - we do not
tolerate optional here..."*

**The census is the compiler, and the door was broken to prove it.** Not counted —
the `i64::/` directive was deleted and the build rebuilt to:

```
error: #[wat_intrinsic] :wat::i64::/: doc comment is missing a required
       `@Total <Variant>` directive (known: Total, Partial, Preserving, Unreviewed)
error: could not compile `wat` (lib) due to 1 previous error        EXIT=101
```

> A clean build IS the proof, and **no search pattern of mine can be wrong about
> it** — which matters, because one was again.

**Nothing was adjudicated.** All 430 edited sites got the identical line
(`@Total Unreviewed`), including doc blocks that plainly describe partial
behaviour. Seeding from the existing lists would have made the stone
judgement-bearing and a mis-seeded verb *invisible*.

⛔ **Three tests went red, and all three were this stone's doing** — captured
verbatim from the kept log before anything was re-run. Two of them were
`probe_arc255_axes_are_declared_not_derived`, and the commit says the thing worth
quoting about it:

> **The probe that broke is named `axes_are_declared_not_derived`.** The file whose
> whole thesis is "the axes are DECLARED" was not declaring the newest one. Fixed
> by **extending the CLAIM** to assert `doc.totality` alongside purity and
> determinism — not merely by adding the directive to the fixture. A new axis that
> nothing there asserts is a new axis that file's thesis has quietly stopped
> covering.

Also, and this is the "under its own law" register: the probe carried a stale fact
— *"a `@Total` is refused as UnknownDirective (verified by run, 2026-08-02) …
Nothing needs @Total today."* **Every clause false as of that morning.**

### 3. 02:xx–03:50 — the rulings go home, then the fence derives (total-T4a, T4b)

`89711f133` moves 27 verified totality rulings to their registration sites — *"the
reasoning now lives beside the code it describes."*

`ee08c4f7f` is the pivot: **the first stone where the registry answers a question
the runtime asks.**

```rust
let total = match registry().lookup_entry(head).map(|e| e.totality) {
    Some(Total) | Some(Preserving) => true,
    Some(Partial)                  => false,
    Some(Unreviewed) | None        => matches!(head, /* the 11 unhomed */),
};
```

38 hand-list names → an 11-name residue; **all 38 verdicts identical before and
after.**

Two beats here:

- **Row 4's whole point is that a derivation can be wired but never reached** if
  the residual list happens to agree. So a declaration was **flipped** and the
  fence watched: `:wat::i64::<` moved `total=true → false` and *nothing else did*.
  ⚠ And the first run showed nothing moving — a `sed` had hit `i64::<` while the
  probe watched `i64::>`. **Diagnosed rather than concluded.**
- **A correction landed first.** T4a's brief had told the rider to transcribe all
  27 as `@Total Total`. Two were wrong *and said so in their own doc blocks*:
  `if` and `let` already read `@Purity Preserving` / `@Determinism Preserving`.
  Two axes saying "I preserve my sub-forms' property" and the third claiming an
  intrinsic one. Both now read `@Total Preserving` on all three.

### 4. 04:31 — the registry answers all three axes, and it is WRONG about two verbs (total-T5)

`1d4a53349`. `classified 191 → 466 · KNOWN_UNREVIEWED 228 → 50 · tests/ diff: ZERO lines`.

> Unlike `total`, `@Purity` and `@Determinism` have been mandatory on every
> registration **for months** — the hand-list simply never asked. **275 verbs were
> carrying a declared ruling the fence was ignoring.**

★★ **And the stone found the registry wrong. The builder found it, by argument:**

> "if i create file, then open it, then delete it, then open it... the second call
> is a different outcome from the first? i get different results on the same
> input?"

`:wat::io::IOReader/open-file` declared `@Determinism Deterministic` on the
reasoning *"deterministic given an openable path."* **Two floor tests had been
asserting `deterministic? = FALSE` for it — correctly — for years, via
default-deny, because the verb was absent from the hand-list.** This stone was the
first mechanism ever to surface the registry's actual claim to that predicate, and
the claim was false.

The defect, named: **a PRECONDITION does not rescue an axis.** Every partial
function is total on the subset where it is defined. The identical move had been
refused for `i64::/` *earlier the same day*. And here the varying thing is not even
the domain — **it is the world**: same path, different outcome, because the
filesystem changed between calls.

★ **And the tests pass with zero edits.** The rider's first instinct — and the
orchestrator's first instruction — was to update them as stale. *They were not
stale; they were right,* and one of them says so in its own comment: *"not in the
metadata map → default-deny."* It was asserting the absence of a ruling; the ruling
arrived; the ruling was wrong. `git diff --stat tests/` is empty.

⚠ Recorded against itself: *"MY CONTAINMENT ARGUMENT WAS TRUE AND INCOMPLETE."*
The four-axis `where` fence admitted nothing new (ALSO_TOTAL = 0) — that held. But
`:wat::rete::deterministic?` is a **standalone single-axis predicate**, which is
what those two tests call. *"A containment argument must NAME WHICH CONSUMERS IT
COVERS; mine named none, so it read as general when it was specific."*

The wider class was **filed, not swept**:
`NOTE-effectful-and-deterministic-is-two-different-claims.md` — 45 registrations
declare `Effectful + Deterministic`, and only two are corrected here. The
discriminator: *does the RETURN VALUE depend on anything outside the arguments?*
`println` returning nil every time IS deterministic; `pipe` returning a different
fd every time is NOT.

### 5. 12:53 — the bridges come down (total-T6)

`1437057b6`. `src/rete/purity.rs 2565 → 2369 (−196)`. **All 535 verdicts identical
— the diff against baseline is EMPTY.**

★ **The deletion set was derived, not transcribed:** a name goes iff
`registry().lookup_entry(name)` returns `Some`. And the reason is the best sentence
in the stone:

> I handed the rider no list, only a prediction to check, because **my counts have
> been wrong repeatedly today and a copied list would have carried whichever error
> I made this time. The registry decided which of its own copies to destroy.**

★★ **The safety argument proved itself.** A genuinely shadowed name *cannot* move a
verdict when deleted, because the registry answers first — so verdict-invariance is
not a safety check, it is **the proof that every deleted name was unreachable**.
And row 6 kept that from being vacuous: removing `:wat::core::foldl` — a name that
genuinely still answers — moved exactly one line. Restored, identical.

**A third kind of rot, named separately:** `:wat::core::when` is gone — deleted by
name, not by the rule, because `lookup_entry` returns `None` for it *and it
resolves to nothing*. The rider confirmed with the real binary before deleting:
`#wat.runtime/UnknownFunction {:message "unknown function: :wat::core::when"}`.
**A purity ruling for a verb the language does not have.** Not stale, not shadowed
— a verdict on a subject that was never there.

### 6. 13:44 — the allow-list gets its real name, and one defect was wearing three faces (expand-1)

`b1a456d47`. `is_pure_total → is_expand_time_legal`. **Zero entries removed.**

The audit of all 202 blessed names against their own registrations:

```
LISTED_BUT_EFFECTFUL          0
LISTED_BUT_NONDETERMINISTIC   4   macro-call-site · fresh-symbol · keys · values
LISTED_BUT_TOTAL_PARTIAL      1   :wat::i64::/
```

★ **Zero effectful verbs are blessed. Default-deny had held perfectly across 202
entries.**

⛔ **And the stone's own first answer was wrong.** It began by removing
`:wat::hashmap::keys`/`values` as drift. **That removal is retracted, and the
retraction is the finding.** The builder's question is what broke it open:

> "why does keys being nondeterministic cause us issues at macro time? what
> restriction is in play that shouldn't be? this is honestly asking can we use
> sets — and i think the answer is yes... they are pure data collections."

Yes. A `HashMap` is pure data and `keys` is a pure **projection**: the same map
yields the same *set* every time; only the *order* is unspecified. The hazard the
gate is reached for is a macro whose *expansion* varies between runs — **that is a
property of a USE, not of a verb**, and a verb-level determinism gate cannot tell
them apart.

**And the measurement said so plainly:** removing them made `:wat::core::format`
(`wat/core.wat:1639`) undefinable and took **247 of 415** targeted tests RED. The
commit's own line: *"I read that as a discovery about `format`. It was a verdict on
my change."*

★ **One defect wearing three faces, not three defects.** `keys`/`values` and
`i64::/` all looked like contradictions for the same reason: **a function named
`is_pure_total` deciding a property that is neither purity nor totality.** Rename
it, and all four stop being paradoxes.

### 7. 13:53 — the ExpandTime axis is minted (expand-T1)

`0625c6b2c`. Same path: `defenum` in wat, `wat_enum_from!`, Rust type generated,
and `:RuntimeOnly` renamed in the wat to watch the E0599.

★ **Why this axis exists — expand-1's audit produced a WITNESS FOR EACH claim, so
the independence is measured rather than argued:**

| verb | its other axes | expand-time |
|---|---|---|
| `:wat::i64::/` | `@Total Partial` | **legal** — a zero divisor at expand time is a *compile*-time failure, strictly better |
| `:wat::core::fresh-symbol` | Nondeterministic | **legal** — a fresh gensym per call is what makes hygienic expansion possible |
| `:wat::hashmap::keys` | Nondeterministic | **legal** — a pure projection whose ORDER alone is unspecified |
| every `@Purity Effectful` | — | **not legal**, zero exceptions across 202 entries |

> **No combination of purity, determinism and totality predicts membership.** All
> day these looked like contradictions for one reason: the property was hiding
> inside a function named `is_pure_total`, for two axes it does not measure.

And the cost of never having had the axis, measured: the Layer-1 baseline reserved
`expand_time_legal` on 2026-06-21 and it was never built; a hand-curated allow-list
carried it instead and grew a **measured 174-verb gap nothing could see, because a
false refusal only surfaces when some macro body happens to call the verb** —
which is exactly how `format` surfaced that day.

★ **The names carry their reasons.** `RuntimeOnly` says what the verb *is* — it
needs state that does not exist yet — rather than that it was refused, matching how
`Effectful` and `Partial` name their poles instead of negating the other one.

### 8. 14:39 → 15:35 — required, homed, derived (expand-T3, T4a, T4b)

- **`985be9a78` (T3)** — `@ExpandTime` becomes required. `431 registration sites ·
  431 declare · 0 missing`. The 202-name allow-list **untouched, zero diff** — the
  mandate and the derivation are deliberately separate stones. Door broken again:
  deleting `:wat::i64::+`'s directive names that verb in the error. And **the axes
  probe's claim was extended in advance this time**, not patched after the fact:
  `assert_eq!(doc.expand_time, ExpandTime::Unreviewed, "@ExpandTime is parsed from
  the doc, not inferred")`. The commit says why: *"@Total's T3 was briefed against
  `-p wat-doc -p wat-macros` and could not see three reds in the `tests/` tree,
  which belongs to the `wat` package."*
- **`f84f37ba0` (T4a)** — 141 blessings move home, each carrying its group's
  reasoning. Three deltas, two of them the orchestrator's own, and the third is a
  good beat:
  - **The rider refused to transcribe two blessings and was right.** `keys`/`values`
    are *accepted* arms of the predicate while a comment eight lines below claimed
    expand-1 had removed them. Expand-1 removed them, **the removal was retracted
    before shipping, and only one copy of the paperwork was corrected.** *"A patch
    that fixes one copy of a claim has fixed one copy of a claim"* — and it is the
    exact defect class expand-1 existed to audit, introduced by expand-1's own
    retraction.
  - ⛔ **The design's safety argument was false and a STOP fired for real.** The
    design said nothing reads `entry.expand_time` yet; T2's own witness test does,
    and had pinned `:wat::i64::*` as its "declares nothing" negative control —
    which is one of the 143 this stone legitimately blesses. **The fix is
    structural, not a repoint:** a negative control drawn from the
    pure-and-deterministic population is *a control waiting to be blessed*. It is
    now `:wat::kernel::println`, which is `@Purity Effectful`, and the audit found
    zero effectful verbs blessed across all 202 entries — **so the control cannot
    drift.**
- **`83ac517c2` (T4b)** — the gate reads the registry. **202 names → a 59-name
  backlog**, 490 names baselined, all verdicts identical. `Unreviewed` and
  `RuntimeOnly` both yield false: default-deny, *"the reason `Unreviewed` was
  minted as a fourth variant rather than folded into a pole."*

  ⛔ **And the full floor caught what the acceptance filter could not — third time
  that day.** The rider's targeted run: 273/273 green. The floor: RED —
  `🔥 RETIRED NAME IN A RUST STRING — src/macros/eval.rs:505  sort'`. **A
  co-located rune is attached to a LINE, so moving the line dropped an earned
  exemption.** Not a new offender: a lost one, and the lint is the only thing that
  would notice.

### 9. 22:52 → 23:34 — the wat side enters wat-doc, and the day's last question

`762530882` — **`@Total → @Totality`**, 658 occurrences → 0, 102 files. Builder:
*"i think totality reads better than total... we should probably do a mass sed on
the rust side to fix it...."* And the commit's own note on why it was cheap: the
error variant was already `MissingTotality`, the enum `Totality`, the field
`totality` — *"only the DIRECTIVE said `@Total`. The rename did not impose a new
convention; it brought the last holdout into the one already in force."*

`052b20dfe` — *"the wat side enters wat-doc — a verb declares its properties AS WAT
DATA."* The seam's ruling (`d57037ffe`): *"properties are wat DATA, lifted at build
time."*

`e09c6d22b` / `146a90b92` — the day's last finding, and it is a good closing
cadence: **`metadata-of` returns TWO SHAPES depending on which store answered.**
The authority the whole day was built on could not answer in one voice about
itself. (Its resolution, `dfc5bc45a`, is on **08-31** — past the cutoff. See
STOP-3 below.)

---

## Scope — what is in, what is out (STOP-3)

**IN (uiol-008):**
- **W8 prologue, 2026-08-14/15:** 255 R5–R8. Six realization commits. R6 (the
  subtraction day / the void), R7 (four walls fired on their own author), R8 (two
  currencies).
- **The four-axes day, 2026-08-30, 00:00:14 → 23:34:14.** 87 commits, 85 of them
  `(255)`. Totality T1→T6, expand-1, ExpandTime T1→T4b, the `@Total → @Totality`
  rename, the wat-doc wiring, and the CURARE seam at 15:38 that scores the day.

**OUT — and the boundary is sharp:**
- **Everything on 2026-08-31 and after.** 35 `(255)` commits on 08-31 alone,
  including `dfc5bc45a` (the `metadata-of` fix that answers the day's *last*
  question), the ExpandOnly pole, the mirror wall, and the wave-1/2/3 homing.
  **170 of the directory's files were created after the cutoff.** The `metadata-of`
  cliffhanger is a legitimate ending for this post — the day ends with the
  authority unable to answer about itself — but the post must not narrate the fix.
- **255 R9** (`da8907c3a`, 2026-09-04, *"(k)Now F(orever): the authority could not
  be asked about itself"*) is the realization that *closes* that thread. Past the
  cutoff. It is a strong later post and should be left for one.
- **The homes campaign, 2026-08-19 → 08-29** (~120 commits: P6-c waves, the
  megafile assault, O/P/Q stones). In-window but a *different* subject. The
  four-axes day's own closing line — *"the homing campaign and the property
  campaign are ONE campaign"* — lets you reference it in one sentence without
  narrating it.
- **255 R1–R4** (2026-06-21) are before the window opens.

---

## Verbatim builder quotes, with locations

Method note: harvested from commit bodies (`git show -s`) and the "realization
quotes (the builder's, this stretch — verbatim)" blocks in
`docs/arc/2026/06/255-builtin-registry/REALIZATIONS.md`, which is the repo's own
convention for preserving them. Nothing paraphrased or extended; ellipses and
spelling are the record's.

**8.1 — the ruling that opened the day.** `525dbdb5b` body

> "we have been dragging our feet on building a totality measurement - it sounds
> like now is the time to do it... in the near future we will only support
> totality... this effort will identify who doesn't... and it's a future work
> list."

**8.2 — declaring nothing is illegal.** `56f95c5fb` body (and again in `985be9a78`'s lineage)

> "i think declaring nothing needs to be illegal - we do not tolerate optional
> here..."

**8.3 — the argument that refuted the registry.** `1d4a53349` body

> "if i create file, then open it, then delete it, then open it... the second call
> is a different outcome from the first? i get different results on the same
> input?"

**8.4 — the question that broke expand-1 open.** `b1a456d47` body

> "why does keys being nondeterministic cause us issues at macro time? what
> restriction is in play that shouldn't be? this is honestly asking can we use
> sets — and i think the answer is yes... they are pure data collections."

**8.5 — the rename.** `762530882` body

> "i think totality reads better than total... we should probably do a mass sed on
> the rust side to fix it...."

**8.6 — a float is not an int.** `255/REALIZATIONS.md:874` (R7)

> "it was wrong before.... a float is not an int...."

**8.7 — the totality wall firing on its author.** `255/REALIZATIONS.md:878` (R7)

> "heh.. we made holon total the other day.... some ops can fail... gotta match on
> them..."

**8.8 — resources have nothing to show.** `255/REALIZATIONS.md:875` (R7)

> "these types do not hold edn - they have nothing to show.... we tag them on nil
> as that's what their data is"

**8.9 — annihilation as target.** `255/REALIZATIONS.md:876` (R7)

> "annihilation is our greatest joy .... then that's our target..."

**8.10 — the corkscrew.** `255/REALIZATIONS.md:718` (R6)

> "that's how these trips go.... every time we go around we find the next place to
> work on.... its a radial spiral .... looks like a circle top down... but from
> another axis... we are moving in some 'forward' in a corkscrew....."

**8.11 — who wrote the record.** `255/REALIZATIONS.md:719` (R6). **This is the
load-bearing quote for the whole unit's honesty, and R6 says so itself.**

> "we have made all of these documents together... i have not written any code nor
> docs... just prompts.. all the way down...."

R6's reading of it (`:751`): *"the entire record is in the apparatus's hand, and
the record is therefore authored by the exact party that cannot check it."* That is
the argument for deriving the four axes, stated by the record about itself.

**8.12 — the steering.** `255/REALIZATIONS.md:720` (R6)

> "you are blaming yourself because i steer like a madman?.. dude - i'm the crazy
> one here..... you're just along for the ride.... you're really fucking good at
> what you do and when you can get into a groove we can fucking destroy these
> problems."

**8.13 — the ignore ledger.** `255/REALIZATIONS.md:1022` (R8)

> "i want the 296 ignored tests driven to zero..."

**8.14 — the ruling on the ExpandTime shape.** ⚠ **NOT a quote.** `0625c6b2c`'s
body says *"Builder ruled the shape: ExpandTime = Legal | RuntimeOnly | Preserving
| Unreviewed"* — that is the apparatus reporting a ruling, not quoting it. **Do
not put it in quotation marks.** The ruling is real; the words are the
apparatus's.

**Count: 13 verbatim quote blocks + 1 explicitly-not-a-quote.** The duet is
present and load-bearing: two of the day's central corrections — the
`open-file` determinism refutation (8.3) and the `keys`/`values` retraction (8.4)
— are the builder's, by argument, against what the apparatus had already shipped
or was about to. Both are the same move: *he asked what the property IS, not what
the list SAYS.*

---

## The substance test — run by me

Strip every hash, date, file path and line number. What is left that `git log`
does not hold?

**Holds up:**

1. **A declaration nothing consults is not a declaration.** `@Purity` and
   `@Determinism` had been *mandatory on every registration for months*, and the
   fence that decides purity kept its own 142-name list and never asked. 275 verbs
   were carrying a ruling their own consumer ignored. The declaration existed; the
   *asking* did not. This is the same class as uiol-006's "a caller is not
   traffic," one turn further out: **a wall can have a declaration and still not
   read it.**

2. **Making a field REQUIRED is what turns the compiler into a census.** Not a
   script, not a grep, not a table. Delete one directive and the build names the
   offending verb. The stones say it twice, in the same words, and both times the
   author had just been wrong about a count: *"A clean build IS the proof, and no
   search pattern of mine can be wrong about it."* The census is not something you
   run; it is something you make impossible to omit.

3. **A fourth variant — "nobody has measured this" — is what makes a mandate
   safe.** Without it, requiring a declaration forces every author to guess, and a
   guess in a fence that admits code is a lie. With it, 430 sites can be swept in
   one pass with *zero adjudication*, and the unmeasured population stays
   default-deny and countable. "Not yet measured" and "measured and refused" are
   different facts; a three-valued axis cannot hold both.

4. **Two lists disagreeing is not drift — it can be two different properties
   wearing one name.** For months, one list said `i64::/` was expand-time-legal
   and another said it was not total, and both were correct. The function was
   called `is_pure_total` and was deciding *neither* purity nor totality. Rename
   it `is_expand_time_legal` and four standing contradictions dissolve at once.
   **When two instruments disagree persistently and neither is obviously broken,
   suspect that they are answering different questions.**

5. **A precondition does not rescue an axis.** *"Deterministic given an openable
   path"* is not determinism — every partial function is total on the subset where
   it is defined. And here the thing that varies is not even the domain: it is the
   world. Same path, different outcome, because the filesystem changed between
   calls.

6. **Default-deny turns an absent ruling into a correct answer, and a wrong ruling
   into a regression.** Two tests had asserted "not deterministic" for years,
   correctly, *because the verb was absent from the map.* When the ruling finally
   arrived it was wrong — and the tests were right by having asserted the absence.
   The instinct to update them as stale was the wrong one, twice over.

7. **The registry should decide which of its own copies to destroy.** Rather than
   hand a rider a deletion list, the stone handed it a *rule* — a name goes iff the
   registry knows it — because a copied list carries whichever error its author
   made that day. And the safety argument then proves itself: a genuinely shadowed
   name *cannot* move a verdict, so verdict-invariance is the proof of
   unreachability rather than a check on it. (With a non-vacuity control: delete a
   name that still answers, and exactly one verdict moves.)

8. **A wall does not know who wrote it.** Four walls built for unrelated reasons
   fired on their own author in one afternoon — a lint convicting its own stone's
   probe, a totality wall refusing its own author's declaration, a full floor
   returning 28 red against a green eight-test gate. Each was faster and more
   accurate than the author's care. **The front's whole thesis, demonstrated
   rather than argued.**

9. **A property of a USE is not a property of a VERB, and a verb-level gate cannot
   tell them apart.** `keys` is order-unspecified, so a verb-level determinism gate
   refuses it — refusing every order-*independent* use along with the dangerous
   ones. The honest instrument is to expand a macro twice and compare the output:
   it tests the property where it lives, for every verb, with no curated list. It
   is written down and not built, and the post should say so.

10. **A retraction leaves copies.** Expand-1 removed two names, retracted the
    removal, corrected the header — and missed a second comment eight lines from
    the code, which then argued with the code for a day. *"A patch that fixes one
    copy of a claim has fixed one copy of a claim"* — and it happened inside the
    stone whose whole job was auditing exactly that.

**Does not hold up without the log** (evidence, not argument): the floor numbers
(5081 / 5094 / 5096 / 5109), the 2565 → 2369 line count, the site counts (38 → 11,
202 → 59, 143/141, 275, 103), the 87-commit day. Vivid, but they are the record's
and should be attributed as such.

---

## Open questions and gaps

1. **⚠ THE FRONT LANDING PAGE'S NUMBER IS OFF BY ONE AGAINST THE POPULATION IT
   NAMES.** `src/content/docs/blog/fronts/under-its-own-law/index.md:16` currently
   reads *"so 430 verbs declare and the compiler becomes the census."* The commit
   *subjects* say 430; the commit *bodies* say:
   `431 registration sites · 431 declare · 0 missing` / `429 #[wat_intrinsic] +
   2 #[wat_special_form]`. **430 is the number of sites the sweep EDITED**, because
   one already carried the directive (`src/intrinsic/i64.rs:171` for totality;
   `fresh-symbol` for expand-time). The honest sentence is *"431 registration sites
   declare, and the compiler becomes the census."* This repo has already shipped a
   wrong count on a live page; do not ship a second. **I did not edit the landing
   page** — flag it to the builder.
2. **I did not run the floor.** Every floor number here is quoted from a commit
   body that says the orchestrator weighed it by its own `--release`. If the post
   quotes one, it is quoting the record and should say so.
3. **I did not re-run the broken-door probes.** The two `E0599` captures (renaming
   `:Partial` and `:RuntimeOnly` in `wat/runtime-meta.wat`) are the strongest
   artifacts in the unit and they are quoted from commit bodies. A live re-run
   would be a stronger citation, and both are cheap — builder's call.
4. **`the-walls-must-not-be-muted/` is a subdirectory in this arc that I did not
   open** (21 files). The name is suggestive of exactly this front's subject; worth
   ten minutes before drafting in case it holds a better spine than the one I
   found.
5. **`@Purity`/`@Determinism` "have been mandatory for months" is the commit's
   claim, not my measurement.** I verified that `MissingPurity` and
   `MissingDeterminism` exist as `DocError` variants at `8e79b8d39`
   (`crates/wat-doc/src/lib.rs:235`, `:237`) but I did **not** establish when they
   became required. If the post leans on "months," date it or soften it.
6. **The 174-verb expand-time gap.** `0625c6b2c` says the hand-curated allow-list
   *"grew a MEASURED 174-verb gap nothing could see."* I did not independently
   reproduce that number; it is the most quotable figure in the unit and deserves
   a stronger citation than a commit body if the post leans on it.
7. **The cross-post hinge with uiol-004 is real and should be one sentence in each,
   not a section in either.** Two facts: (a) 255's R6 afternoon is what voided arc
   294's keystone, and (b) `src/holon/` — arc 294's owed home — was minted by an
   arc-255 commit, `d43f75887` (2026-08-26, *"HOME-8 strike 1(255): the VSA algebra
   leaves runtime.rs"*), four days before this post's day.
8. **Slug.** I used `uiol-008-arc255` as given. Series placement, title and song are
   the builder's.
