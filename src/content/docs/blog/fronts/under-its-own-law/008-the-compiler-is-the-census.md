---
title: "The Compiler Is the Census"
description: "2026-08-30, one calendar day: 87 commits, 85 of them arc 255. Four consumers each kept a hand-curated copy of what wat's verbs had already declared — a 38-name totality list, a 142-name purity-and-determinism list, a 202-name expand-time allow-list — and two of them gave opposite answers about `i64::/` with nothing comparing them. The day opens at 00:00:14 by minting an axis that did not exist and closes with all four deriving from the registry, 431 registration sites declaring, and the drift the copies had been hiding on the record: a verb declaring `Deterministic` against two tests that had correctly said otherwise for years, 275 verbs carrying rulings their own fence ignored, and a gate named `is_pure_total` deciding neither purity nor totality."
covers: 2026-08-30
written: 2026-09-08
backfill: true
sidebar:
  order: 8
---

Backfill: this covers 2026-08-30 and was written on 2026-09-08 from the day's 87 commit bodies, arc 255's `REALIZATIONS.md`, and the tree as it stood at `8e79b8d39` — the last commit inside the window, 15:38 — rather than at HEAD, which is a week further on and mid-migration. The arc's directory holds 411 files by `git ls-tree -r`; only 19 of them predate 2026-06-23, so almost none of what follows is inherited. Floor counts, line counts and the two captured `E0599` failures are the record's, weighed by the orchestrator at the time and not re-run here. The day opens fourteen seconds past midnight by minting an axis that did not exist that morning, and the first thing the new axis does is convict the test file whose entire thesis was that the axes are declared.

A `wat` verb declares its own properties. At the registration site, in the doc comment, as directives: `@Purity`, `@Determinism`, `@Category`. The proc-macro had been refusing a registration that omits them for months — that duration is the commit's claim, not a measurement taken here — so the declarations were there, at every site, in the source, correct.

Nothing asked.

## Before 2026-08-30 — four copies of one truth

Four consumers needed to know whether a verb was pure, deterministic, or total. Each kept its own answer.

`intrinsic_meta`, in `src/rete/purity.rs`, is the rete fence. It carried two literal `matches!` lists — 142 names for pure-and-deterministic, and once totality existed at all, 38 names for total — plus early-return special cases and three namespace `starts_with` rules. Between them it named 177 verbs. `macros::is_pure_total`, in `src/macros/eval.rs`, decided what a verb is allowed to do at macro-expansion time, across roughly 411 lines and a hand-curated allow-list of 202 names. `rete/vocabulary.rs`'s `RETE_OPS` kept its own `op.meta.total`. And arc 278's `where` fence spelled the question out — `(and (pure? f) (deterministic? f) (total? f) (primitive? f))` — of which three predicates had a home in the record model's Layer-1 baseline and `total` had none.

The two big lists overlapped on 102 names. A hundred were macro-only, seventy-five rete-only. On `:wat::i64::/` they disagreed outright: `is_pure_total` blessed it, on the reasoning that division by zero is a deterministic located abort and never a panic, while `intrinsic_meta`'s total sub-list explicitly excluded it. Both had been shipping that way for months, and nothing in the build compared them. The diagnosis, from the commit that opened the day:

> That is not two lists drifting — it is **two DIFFERENT PROPERTIES wearing one name.**

Two properties, one name, months of shipping, and nothing in the build comparing them.

## The two weeks before: a wall does not know who wrote it (08-14/15)

Arc 255's method got named a fortnight earlier, across four realizations written on 08-14 and 08-15.

R6 records an afternoon that started at "can `:wat::core::string` become `:wat::string`?" and descended eight layers — is `join` in it, what does `join` accept, `Seqable`, what about the elements, `str` is partial, the total renderer already exists, adopting it broadcasts a crate name, the tag namespace, the trait — and at the floor of nearly every layer found the thing already built and already right. Nothing shipped. 1263 sites became three items.


R6's structural claim is what the four-axis design answers:

> **Not one was catchable from inside**, and the reason is structural, not a lapse: *every individual measurement was correct.* A name the apparatus wrote is internally consistent with the map the apparatus wrote it into. **Grepping your own map confirms your own map.**

The builder had already named the condition that makes it inescapable:

> "we have made all of these documents together... i have not written any code nor docs... just prompts.. all the way down...."

The entire record is in the apparatus's hand, which means it is authored by the one party that cannot check it. A registry is not the apparatus's map. It is the code's own declaration, at the site, refused by the compiler when absent.

R7 catalogues four walls firing on their own author in a single afternoon, under the rune `MVRVS AVCTOREM NON NOVIT` — a wall does not know who wrote it. The central floor came back 28 red while the rider's own eight-test gate came back 8/8 green. The `no_inlined_edn` lint convicted that stone's own probe — three string literals written that hour. The totality wall refused its author's own probe declaration at check time, because `cosine` returns a `CosineOutcome` and the draft had written `-> f64`; the builder, on sight:

> "heh.. we made holon total the other day.... some ops can fail... gotta match on them..."

And an arc-293 acceptance demo surfaced a defect that had been blessed as cosmetic seven weeks earlier — `r=2` against `r=2.0`, logged in `293/SCORE-293.4d.md:30` as an honest delta "in f64 Display only." The render is type-lossy: `2` reads back as an `i64`. The builder's cut:

> "it was wrong before.... a float is not an int...."

R8 priced the method. The apparatus had costed a second sweep across 113 goldens as work and built an ordering argument around paying for it. The measurement did not refute the second sweep; it refuted the price. A `wat-fix` codemod is a rule written once and applied idempotently to every site, so the second pass was never a second adjudication. Rune: `IVDICIVM SEMEL, MACHINA SAEPE` — judgement once, machine often.

Two weeks later that method got pointed at the four lists.

## 00:00:14 — an axis is minted in wat, and the door is broken to prove it

`525dbdb5b` lands fourteen seconds into 2026-08-30. The builder's ruling, from the body:

> "we have been dragging our feet on building a totality measurement - it sounds like now is the time to do it... in the near future we will only support totality... this effort will identify who doesn't... and it's a future work list."

The axis is declared in `wat`, not in Rust. `wat/runtime-meta.wat` gains `(:wat::core::defenum :wat::runtime::Totality …)` alongside `Purity`, `Determinism` and `Category`, and one `wat_source_derive::wat_enum_from!` invocation in `crates/wat-doc/src/lib.rs` generates `pub enum Totality` from it, carrying the `.wat` file's `;;` prose across as Rust `///` docs.

A green build proves nothing about which direction that generation runs, so the door was broken. `:Partial` was renamed in the `.wat` file and the Rust went red on cue — `error[E0599]: no variant … named 'Partial' found for enum 'Totality'`, four times, `EXIT=101` — then renamed back. The wat is the source of truth because the Rust cannot survive without it.

Four variants shipped, and the seam commit's lesson list puts the fourth first:

| variant | meaning |
|---|---|
| `:Total` | measured — defined on every input of its declared domain |
| `:Partial` | measured — undefined somewhere. This variant is the work list: the census is `all_entries().filter(\|e\| e.totality == Partial)` |
| `:Preserving` | a special form preserving its sub-forms' totality — `if` is total exactly when its branches are |
| `:Unreviewed` | nobody has measured this verb yet |

Collapsing `Unreviewed` into `Partial` would conflate "cannot" with "did not look," and a guessed `:Total` is a lie inside a fence that admits code into a `where`. It is default-deny, and it is the only variant expected to disappear.

Orthogonality was stated that morning and derived from nothing: `i64::/` is pure, and deterministic, and undefined at a zero divisor. Three axes, three independent answers, one verb.

## 01:08 — declaring nothing becomes illegal

`56f95c5fb`. The builder:

> "i think declaring nothing needs to be illegal - we do not tolerate optional here..."

`@Total` became required. `crates/wat-doc/src/lib.rs:244` is `DocError::MissingTotality`; `:717` is the `…_val.ok_or(DocError::MissingTotality)?` that raises it. The proc-macro refuses to expand, and the error names the verb. The proof was the door again — the directive was deleted from `i64::/` and the build rebuilt to:

```
error: #[wat_intrinsic] :wat::i64::/: doc comment is missing a required
       `@Total <Variant>` directive (known: Total, Partial, Preserving, Unreviewed)
error: could not compile `wat` (lib) due to 1 previous error        EXIT=101
```

This is the hinge for all four axes, and the stone states why in a sentence written by an author who had been wrong about a count twice that day:

> A clean build IS the proof, and **no search pattern of mine can be wrong about it** — which matters, because one was again.

430 sites got edited. All 430 got the identical line, `@Total Unreviewed`, including doc blocks that plainly describe partial behaviour. Seeding from the existing hand-lists would have made the sweep judgement-bearing and a mis-seeded verb invisible; sweeping with one constant leaves every ruling still to be made and countable. 430 is the number of sites the sweep edited, which is not the number that declare: `src/intrinsic/i64.rs:171` already carried the directive, so 431 sites declare when the build comes back green.

Three tests went red, and all three were this stone's doing. Two of them were `probe_arc255_axes_are_declared_not_derived`:

> **The probe that broke is named `axes_are_declared_not_derived`.** The file whose whole thesis is "the axes are DECLARED" was not declaring the newest one.

It was fixed by extending the claim to assert `doc.totality` alongside purity and determinism, not by adding the directive to the fixture. A new axis that nothing in that file asserts is a new axis that file's thesis has quietly stopped covering. The same probe was also carrying a stale fact in a comment — that a `@Total` directive is refused as `UnknownDirective`, verified by run on 2026-08-02, and that nothing needs `@Total` today. Every clause of it false as of that morning.

## 02:00–03:50 — the rulings go home and the fence starts asking

`89711f133` moves 27 verified totality rulings out of wherever they had been reasoned about and onto the registration sites themselves, so the reasoning lives beside the code it describes. A correction landed before the transcription did: the brief had told the rider to write all 27 as `@Total Total`, and two were wrong in a way their own doc blocks announced. `if` and `let` already read `@Purity Preserving` and `@Determinism Preserving` — two axes saying "I preserve my sub-forms' property" while the third was about to claim an intrinsic one. Both now read `@Total Preserving` on all three axes.

`ee08c4f7f` is the first stone in which the registry answers a question the runtime asks:

```rust
let total = match registry().lookup_entry(head).map(|e| e.totality) {
    Some(Total) | Some(Preserving) => true,
    Some(Partial)                  => false,
    Some(Unreviewed) | None        => matches!(head, /* the 11 unhomed */),
};
```

The 38-name hand-list becomes an 11-name residue, and all 38 verdicts are identical before and after. Identical verdicts are exactly what a wired-but-unreached derivation would also produce, so a declaration was flipped and the fence watched: `:wat::i64::<` moved `total=true → false`, and nothing else moved with it. The first run of that check showed nothing moving at all — a `sed` had landed on `i64::<` while the probe watched `i64::>`. It was diagnosed rather than concluded, which is the only reason the row means anything.

## 04:31 — the registry answers, and it is wrong about `open-file`

`1d4a53349` points purity and determinism at the registry too. `classified 191 → 466 · KNOWN_UNREVIEWED 228 → 50 · tests/ diff: ZERO lines`.

> Unlike `total`, `@Purity` and `@Determinism` have been mandatory on every registration **for months** — the hand-list simply never asked. **275 verbs were carrying a declared ruling the fence was ignoring.**

Deriving is what let anyone read those 275 rulings for the first time, and one of them was false. The builder found it by argument:

> "if i create file, then open it, then delete it, then open it... the second call is a different outcome from the first? i get different results on the same input?"

`:wat::io::IOReader/open-file` declared `@Determinism Deterministic`, on the reasoning "deterministic given an openable path." A precondition does not rescue an axis: every partial function is total on the subset where it is defined, and the identical move had already been refused for `i64::/` earlier the same day. Here the thing that varies is not even the domain. It is the world — same path, different outcome, because the filesystem changed between the calls.

Two floor tests had been asserting `deterministic? = FALSE` for that verb, correctly, for years. They passed with zero edits. They were not stale, and one of them says why in its own comment: not in the metadata map, so default-deny. It was asserting the absence of a ruling; the ruling arrived; the ruling was wrong. Both the rider's first instinct and the orchestrator's first instruction were to update them.

The stone also recorded itself against itself. Its containment argument — that the four-axis `where` fence admitted nothing new, `ALSO_TOTAL = 0` — held, and was incomplete, because `:wat::rete::deterministic?` is a standalone single-axis predicate and that is what those two tests call:

> A containment argument must NAME WHICH CONSUMERS IT COVERS; mine named none, so it read as general when it was specific.

The wider class was filed rather than swept. `NOTE-effectful-and-deterministic-is-two-different-claims.md` counts 45 registrations declaring `Effectful + Deterministic`, of which two are corrected here, and names the discriminator: does the return value depend on anything outside the arguments? `println` returning nil every time is deterministic. `pipe` returning a different fd every time is not.

## 12:53 — the registry decides which of its own copies to destroy

`1437057b6` deletes the bridges. `src/rete/purity.rs` goes 2565 → 2369 lines, and all 535 verdicts are identical — the diff against baseline is empty.

The deletion set was derived rather than transcribed. A name goes if and only if `registry().lookup_entry(name)` returns `Some`. The stone says why it handed the rider a rule instead of a list:

> I handed the rider no list, only a prediction to check, because **my counts have been wrong repeatedly today and a copied list would have carried whichever error I made this time. The registry decided which of its own copies to destroy.**

The safety argument then proves itself rather than being checked. A genuinely shadowed name cannot move a verdict when deleted, because the registry answers first — so verdict-invariance is not evidence that the deletions were safe, it is the proof that every deleted name was unreachable. Non-vacuity came from removing `:wat::core::foldl`, a name that genuinely still answers: exactly one line moved. Restored, identical.

One name came out by hand rather than by the rule. `:wat::core::when` had `lookup_entry` returning `None` and also resolved to nothing at all; the rider confirmed against the real binary before deleting it, and got `#wat.runtime/UnknownFunction {:message "unknown function: :wat::core::when"}` back. A purity ruling for a verb the language does not have — not stale, not shadowed, a verdict on a subject that was never there.

## 13:44 — one defect wearing three faces

`b1a456d47` renames `is_pure_total` to `is_expand_time_legal` and removes zero entries. The audit that justifies the rename ran all 202 blessed names against their own registrations:

```
LISTED_BUT_EFFECTFUL          0
LISTED_BUT_NONDETERMINISTIC   4   macro-call-site · fresh-symbol · keys · values
LISTED_BUT_TOTAL_PARTIAL      1   :wat::i64::/
```

Zero effectful verbs blessed. Default-deny had held perfectly across all 202 entries.

The stone's own first answer was wrong. It opened by removing `:wat::hashmap::keys` and `values` as drift, and the removal is retracted. The builder's question is what broke it open:

> "why does keys being nondeterministic cause us issues at macro time? what restriction is in play that shouldn't be? this is honestly asking can we use sets — and i think the answer is yes... they are pure data collections."

A `HashMap` is pure data and `keys` is a pure projection: the same map yields the same set every time, and only the order is unspecified. The hazard the gate is reached for is a macro whose expansion varies between runs, which is a property of a use, not of a verb — and a verb-level determinism gate cannot tell the two apart. The measurement agreed before the argument did: removing the two names made `:wat::core::format` (`wat/core.wat:1639`) undefinable and took 247 of 415 targeted tests red. The commit's reading of its own number:

> I read that as a discovery about `format`. It was a verdict on my change.

`keys`, `values` and `i64::/` had all looked like standing contradictions for one reason, and it was not three defects. A function named `is_pure_total` was deciding a property that is neither purity nor totality. Rename it and four paradoxes stop being paradoxes at once.

## 13:53 — the axis nothing could predict

`0625c6b2c` mints `ExpandTime` down the same path: a `defenum` in `wat/runtime-meta.wat:248`, `wat_enum_from!` generating the Rust, and `:RuntimeOnly` renamed in the wat to watch the `E0599` arrive. Its shape — `Legal | RuntimeOnly | Preserving | Unreviewed` — was the builder's ruling, but the commit body reports that ruling rather than quoting him, so the four names as written are the apparatus's words for his decision.

Expand-1's audit had produced a witness for every claim the new axis needed to make, so the independence is measured rather than asserted:

| verb | its other axes | expand-time |
|---|---|---|
| `:wat::i64::/` | `@Total Partial` | legal — a zero divisor at expand time is a compile-time failure, strictly better |
| `:wat::core::fresh-symbol` | Nondeterministic | legal — a fresh gensym per call is what makes hygienic expansion possible |
| `:wat::hashmap::keys` | Nondeterministic | legal — a pure projection whose order alone is unspecified |
| every `@Purity Effectful` | — | not legal, zero exceptions across 202 entries |

> **No combination of purity, determinism and totality predicts membership.**

The Layer-1 baseline had reserved `expand_time_legal` on 2026-06-21 and never built it. A hand-curated allow-list carried the property in its place and grew what the commit body records as a measured 174-verb gap that nothing could see, because a false refusal surfaces only when some macro body happens to call the missing verb — which is precisely how `format` had surfaced twenty minutes earlier. The variant names carry their reasons the same way the others do: `RuntimeOnly` says what the verb is, that it needs state which does not exist yet, rather than saying it was refused.

## 14:39 → 15:35 — required, homed, derived

The expand-time axis walked the remaining rungs in under an hour.

`985be9a78` at 14:39 makes `@ExpandTime` required — `DocError::MissingExpandTime` at `crates/wat-doc/src/lib.rs:250`, raised at `:721`. Its subject reads "430 verbs declare"; its body reads `431 registration sites · 431 declare · 0 missing`. A commit subject is a headline, not a measurement — 430 is once again the count the sweep edited, because `fresh-symbol` already carried the directive, and 431 is the population. The 202-name allow-list is untouched with zero diff: the mandate and the derivation are deliberately separate stones. The door was broken again, on `:wat::i64::+` this time, and the error named that verb. The axes probe's claim was extended in advance rather than patched afterwards — `assert_eq!(doc.expand_time, ExpandTime::Unreviewed, "@ExpandTime is parsed from the doc, not inferred")` — because `@Total`'s equivalent stone had been briefed against `-p wat-doc -p wat-macros` and so could not see three reds living in the `tests/` tree, which belongs to the `wat` package.

`f84f37ba0` moves 141 blessings home, each carrying its group's reasoning. The rider refused to transcribe two of them and was right: `keys` and `values` are accepted arms of the predicate while a comment eight lines below still claimed expand-1 had removed them. Expand-1 removed them, retracted the removal before shipping, and corrected one copy of the paperwork. A patch that fixes one copy of a claim has fixed one copy of a claim — introduced by the retraction inside the stone whose whole job was auditing that class.

A STOP fired for real in the same stone, against its own design. The design said nothing reads `entry.expand_time` yet; the axis's own witness test does, and had pinned `:wat::i64::*` as its "declares nothing" negative control — one of the 143 verbs this stone legitimately blesses. The fix is structural rather than a repoint. A negative control drawn from the pure-and-deterministic population is a control waiting to be blessed. It is now `:wat::kernel::println`, which is `@Purity Effectful`, and the audit found zero effectful verbs blessed across all 202 entries, so the control cannot drift.

`83ac517c2` at 15:35 points the gate at the registry: `is_expand_time_legal` becomes `matches!(e.expand_time, Legal | Preserving)` for any registered head, 202 names become a 59-name backlog, 490 names are baselined, and every verdict is identical. `Unreviewed` and `RuntimeOnly` both yield false — default-deny, which is the reason `Unreviewed` was minted as a fourth variant rather than folded into a pole.

The rider's targeted run came back 273/273 green. The floor came back red: `🔥 RETIRED NAME IN A RUST STRING — src/macros/eval.rs:505  sort'`. A co-located rune is attached to a line, so moving the line dropped an earned exemption. Not a new offender — a lost one, and that lint is the only thing in the tree that would have noticed. It was the third time that day a full floor caught something an acceptance filter could not.

## 15:38 — the scoreboard, and what it still cannot refuse

`8e79b8d39`, the seam commit that scores the day:

```
  purity        ✅ derives   T5      hand-list gone
  determinism   ✅ derives   T5      hand-list gone
  totality      ✅ derives   T1→T4b  residue: 11 unhomed verbs
  expand-time   ✅ derives   T1→T4b  residue: 59 unhomed verbs
```

Alongside it, the record's own numbers for the day: `floor 5109/5109 · registry 429+4 · runtime.rs 33,917 lines · KNOWN_UNREVIEWED 50 · debt ledger 55 · @Total 25/1/2/403 · @ExpandTime 143/0/0/288`.

What survives is not zero hand-lists. It is two residues of 11 and 59 names, and the difference is that their membership condition is mechanical: every name in them is one for which `lookup_entry` returns `None`. The comment `83ac517c2` left in the code says so, and states the invariant that would be violated:

> "NOT a hand-list of which verbs are expand-time legal: every name below is one for which `lookup_entry` returns `None` … a HOMING BACKLOG … **A REGISTERED verb does not belong here** — if one is ever added below alongside a real registration, the derivation above is being shadowed by a copy, which is the exact defect this stone exists to remove."

That invariant is a comment, not a check. Add a registered verb to the 59-name residue and nothing fires. The 70 unhomed verbs still keep their rulings in a `matches!` rather than at a registration site, and they retire row by row as the homing campaign reaches them — which is why the seam's closing line reads as it does: every axis converged on the same residue, verbs with no home, and the homing campaign and the property campaign are one campaign with both worklists on disk.

And `is_expand_time_legal` still measures a verb where the property belongs to a use. The honest instrument for expand-time determinism is expanding a macro twice and comparing the output — that tests the property where it lives, for every verb, with no curated list at all. It is written down in `b1a456d47`'s own note. It is not built.

## 23:34 — the authority cannot answer about itself

The evening cleaned up the vocabulary. `762530882` renames `@Total` to `@Totality` across 658 occurrences in 102 files, on the builder's call:

> "i think totality reads better than total... we should probably do a mass sed on the rust side to fix it...."

It was cheap because the convention already existed everywhere else: the error variant was `MissingTotality`, the enum `Totality`, the field `totality`. Only the directive said `@Total`. The rename did not impose a new convention; it brought the last holdout into the one already in force. Then `052b20dfe` takes the wat side into `wat-doc` — a verb declares its properties as wat data, lifted at build time.

At 23:34, `e09c6d22b` and `146a90b92` record the day's last finding. `metadata-of` returns two different shapes depending on which store answered. The registry that had spent twenty-three and a half hours becoming the single voice on four axes for 431 verbs could not answer in one voice about itself. Its resolution is on 08-31 and belongs to a later post.

The day did not add a fact to the substrate. Every `@Purity` and `@Determinism` ruling it derived from had already been sitting at its registration site, required, for months; what changed is that something asked. That is the whole distance between a declaration and a wall: 275 verbs were carrying rulings their own fence ignored, and the moment the fence read them one of those rulings turned out to be false, refuted by two tests that had been correct for years on the strength of having asserted nothing at all. A hand-list cannot be wrong in a way anyone finds out about. A derivation can, and did, twice before lunch.

## Likely Contributions to the Field

- **A declaration nothing consults is not a declaration.** `@Purity` and `@Determinism` were mandatory at every registration site for months while the fence that decides purity kept a 142-name `matches!` and never asked — 275 verbs carrying a ruling their own consumer ignored. This is one turn further out than "dead code rots": the wall existed, the declaration existed, the reading did not. Auditing whether a declared property is *consulted* is a distinct check from auditing whether it is *declared*, and only the first one finds this.
- **Making a field required is what turns a compiler into a census.** Not a script, not a grep, not a table. Delete one directive and the build names the offending verb, so the count cannot be wrong in the direction that matters. The stones say it in the same words twice, both times written by an author who had just been wrong about a count: a clean build is the proof, and no search pattern of mine can be wrong about it.
- **A fourth variant meaning "nobody has measured this" is what makes a mandate safe.** A three-valued axis forces every author under a new mandate to guess, and a guess inside a fence that admits code into a `where` is a lie. With `Unreviewed` as an explicit, default-deny pole, 430 sites were swept in one pass with zero adjudication, the unmeasured population stayed countable, and the later derivation moved 275 verdicts while admitting nothing new. "Not yet measured" and "measured and refused" are different facts.
- **Two instruments disagreeing persistently, with neither obviously broken, is evidence they answer different questions.** One list said `i64::/` was expand-time legal, another said it was not total, and both were correct for months. The function deciding the first was called `is_pure_total` and was measuring neither purity nor totality. Renaming it dissolved four standing contradictions at once without removing a single entry.
- **A precondition does not rescue an axis.** "Deterministic given an openable path" is not determinism — every partial function is total on the subset where it is defined — and in the `open-file` case the thing that varies is not the domain but the world: same path, different result, because the filesystem changed between calls. The corollary is that default-deny turns an absent ruling into a correct answer and a wrong ruling into a regression, which is why two tests asserting nothing more than absence were right for years and right again on the day the ruling arrived.
- **Hand a rider the rule, not the list, and let the registry decide which of its own copies to destroy.** A copied deletion list carries whichever error its author made that day; a membership rule — a name goes iff `lookup_entry` returns `Some` — does not. The safety argument then proves itself instead of being checked, because a genuinely shadowed name cannot move a verdict when deleted. Pair it with a non-vacuity control: delete a name that still answers, and exactly one verdict moves.
