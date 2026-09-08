# Story branching — the plan

> **Status: PROPOSAL — v2 (2026-09-07).** v1 framed this as *trunk + branches*.
> That was wrong in one structural way: it left `main` as a trunk absorbing
> synthesis returns, which under-represents the biggest stream in the batch and
> gives merges a destination that does not exist. v2's shape is **Story (the
> past) → Fronts (the present) → Epilogue (eternal)**, with `main` as a front.
> Nothing here is settled. Decisions still open are marked
> **[OPEN]**. Written 2026-09-07 against `wat-rs` @ `3dc4f62b7` and this repo @
> `2eef971`. The *substance* pass — which realization lands in which post — is
> deliberately NOT in this doc; see §6. This doc's only job is to make the
> agreement possible: the shape, the file layout, the nav, and the assignment
> rules. Argue against this, not against scrollback.

---

## 1 — The problem, measured

The chronicle's last story post shipped **2026-06-23**. In the 76 days since,
`wat-rs` ran **2931 commits on `main` alone**, plus three other live branches on
three machines.

The narration model assumes arcs are **sequential** and that they **close**. Both
assumptions broke:

- Only four arcs closed in the window (170, 118, 298, and 296 — which then
  *reopened*, its INSCRIPTION deleted at `3a4f49202`). The five biggest campaigns
  — 278 (779 commits), 255 (557), 296 (202), 109 (198), 293 (185) — are all open.
- The work is no longer one trunk. Three fronts author their **own** journals:

  | front | branch | diverged | commits | docs authored |
  |---|---|---|---|---|
  | reason | `grok-rete` | 08-24 | 479 | **449** |
  | queue | `sns-sqs` | 08-30 | 271 | **451** |
  | compute | `claude-compute` | 08-30 | 133 | 14 |
  | — | `wat-revival` | 08-29 | 1 | **0** |

The number that settles the priority argument: the **entire published chronicle**
is 11,063 lines across 60 posts. **Arc 278's realizations alone are 12,329
lines.** The unnarrated source for one still-open arc exceeds the whole story
ever written. The story track cannot absorb this by volume — only by selection.

**The realizations layer is already branched. The story is the only layer still
pretending there is one line.** This plan stops that.

---

## 2 — The doctrine

### 2.1 Story, Fronts, Epilogue

Three standing parts. The shape is perpetual: fronts open and close beneath a
story that is at rest and an epilogue that never closes.

- **The Story** — the past. prologue → the branch point. It ends not on a
  cliffhanger but on honest commentary about what the work became: LLM-first
  development across concurrent hosts running frontier models. It **points
  forward** to the Fronts and to the Epilogue.
- **The Fronts** — the perpetual present. **At most three at once** (the stated
  ceiling of what one person can hold). Each lives as long as it must.
- **The Epilogue** — eternal, terminal, after everything. It already declares
  itself so: *"Perpetual Epilogue: The Sorcerer's Codex"*, `sidebar.order: 999`,
  *"This isn't done. Updated as the work continues… The codex is open. The
  entries continue."* Hoisting it out of the "Landing on the Greats" group makes
  the nav agree with what the page has always said.

### 2.1.1 A front is a PURPOSE, not a branch

The unit is the *work being done*, not where it runs or which ref carries it.
`claude-compute` and `sns-sqs` are two branches doing one job; they are one
front. This is what makes the names hold — v1's `reason` / `compute` / `queue`
mixed host names with an artifact name because it was naming the wrong thing.

The three live fronts:

| front | purpose | branches | host |
|---|---|---|---|
| **wat Under Its Own Law** | the language is made subject to the discipline it imposes on its users — every law wat enforces outward, turned on wat's own body | `main` | johndesktop |
| the exemplar | one reference implementation all of wat measures against, as the other subsystems mature | `grok-rete` | reason |
| services in anger | where services are flawed and deficient; the repeatable patterns for using wat in real use | `claude-compute` + `sns-sqs` | compute |
| **Ars Culta** | the craft that is tended — the grimoire, the tooling, the record; the console that arms the other three (§2.1.4, §3.6) | `datamancy.dev`, `pulsare`, `cingere`, this repo | portal |

Hosts do not decide names, but they are **content**: `portal` (the laptop where
all the work began, abandoned because constant Rust builds DoS'd it), the
migration to `johndesktop`, `reason` (where the ML work began years ago),
`compute` (an old home server repurposed). That migration is the physical
constraint that produced the topology, and it belongs in the branch-point post.

### 2.1.4 The fourth front — portal, the console

The builder runs **four** hosts, not three, and the fourth is a different shape.

> *"my laptop is now being used to drive datamancy, automation tooling (pulsare,
> cingere) and website updates… portal is my interface to the 3 remotes and the
> 'deployer' of my automation updates to the remotes."*

`portal` is the laptop where all the work began — abandoned as a build machine
because constant Rust builds DoS'd it, and now returned as the **console**: the
interface to the three remotes and the deployer of automation to them. Its
purpose is the instrument layer — the grimoire (how the work is done), the
tooling (how the machines talk), and the chronicle (the record of what they did).

**It is honestly asymmetric and should be labelled so.** The other three fronts
are hard problems on one substrate. Portal builds what they run on and records
what they do. That keeps the builder's stated ceiling intact: **three concurrent
hard problems, plus the console** — not four hard problems.

**Portal is also where the series-007/008 body goes forward.** The Story ending
(§2.1.2) leaves *The Signed Record* and *The Command Channel* — the datamancy /
grimoire lineage — with no forward home. Portal is it. That lineage does not
stop; it moves from a Story body to a live front.

Measured in the batch window (2026-06-23 → 08-31): ~64 commits across
`datamancy.dev` (15), `scratch` (19), this repo (28), `datamancy` (2). The
marquee item is **`experiri` minted and published 2026-08-28 — the executing
ward, warded 17 rounds, 0 un-dispositioned**; alongside the grimoire ethos
encoding (06-30), `cohaerere` (06-26), and the publish hardening (08-16).
`pulsare` and `cingere` are **September** — they fall past the cutoff and belong
to the first weekly update, not this batch.

**SETTLED 2026-09-07: `Ars Culta`.** The reasoning is in §3.6.

### 2.1.2 The story ENDS — ruled 2026-09-07

`main` is a front, not a trunk — so **there is no spine for a synthesis return to
be absorbed into.** A merge is therefore *arrival*: the front's own closing post,
plus the topology recorded on the Fronts overview. Merging is its own story
event and is allowed to be one.

**RULED 2026-09-07 (option (b), decided on the four questions — see §5.1): the
Story ENDS.** It closes on a hinge post — honest commentary rather than a
cliffhanger — and points forward to the Fronts and to the Epilogue. Everything
after 2026-06-23, where the chronicle actually stopped, is front-shaped.

The hinge's thesis is the builder's, and it is the batch's strongest line:

> *"the story was a single machine all the way down… now i'm running 4."*

That is what ends: not the work, but the era in which one machine carried it.

### 2.1.3 How this relates to `topology.md` (they do not conflict)

`blog/topology.md` is **published content** and describes *trunk → branch → cliff
notes → synthesis return* for the BOOK. That remains true and unchanged. The
Fronts are a different axis, and conflating them would misread both:

- **topology.md's branch is DEPTH.** One thread, too dense for the trunk's
  cadence — arc-170's interstitial. It curls back into the *same* narrative
  because it was always the same thread. Its return is **absorption**: the trunk
  writes a chapter it could not have written without the branch's walk.
- **A front is BREADTH.** An independent, orthogonal problem. It merges as
  *code*; it may never merge as *narrative*. Its return is **arrival**: the front
  finished, and the record says what came back with it. A front that stays its
  own thing is not a failure.

So the BOOK keeps growing depth-branches; the Story grows breadth-fronts. One
page can hold both without either claiming the other's semantics. If the two ever
need reconciling on the public site, that is a `topology.md` amendment — **[OPEN]**,
and out of scope here.

**The merge event is written when the recognition lands, not when the merge
commit does.** Otherwise git mechanics start driving prose, and we ship an
arrival for a merge that has not taught us anything yet.

### 2.2 The journaling threshold — how a track is earned

> **A front earns a story track when it journals** — not when it commits, but
> when it authors its own realizations.

Applied to *purposes*, not refs: a front's journal is the union of its branches'
realizations.

**And not to one repo.** The threshold was first measured over `wat-rs` branches,
which made it look like a `wat-rs/docs/arc/**` rule. It is not. **A front's
journal is wherever that front journals.** The portal front (§2.1.4) journals
across `datamancy.dev`, `datamancy`, `scratch`, `pulsare`, `cingere` and this
repo — no `wat-rs` branch at all — and it clears the threshold comfortably.

Measurable on disk, not a judgment call, and self-maintaining. Against the
current tree it discriminates correctly without tuning: `wat-revival` did real
work in the window (the `:- [...]` codemod — 1675 sites across 386 files) and
authored **zero** docs, so it gets no track and that work belongs to the trunk.

### 2.5 The contributions close — front posts owe it too

A front post carries `## Likely Contributions to the Field` on the same terms as
a trunk post: **if contributions may have happened, note them; if there is
nothing, there is nothing.** The heading is always present (mechanical, guarded);
populated-vs-None stays consonare's soft call.

The builder's gloss, which is sharper than what `check-contributions.mjs`
currently says and should be carried into `WRITING-GUIDE.md`:

> *"this is a place where we reflect on something we may have legitimately built
> that's beyond common knowledge."*

Not a summary, not a victory lap — a check on whether the work went past what is
commonly known. Consequence: the guard extension (§7.1) enforces **both**
nav-wiring and the contributions heading over `blog/fronts/**`.

### 2.3 Track status — a front says what it is

**SETTLED 2026-09-07.** A track carries `status` in its index frontmatter:

```yaml
status: live | landed | parked
parked: 2026-11-02        # date + one line of why, when parked
```

- **live** — running. The default.
- **landed** — merged and told. Its arrival post exists.
- **parked** — stopped without landing. `PARKED IS NOT DEAD` (arc 294's `SEAM.md`)
  — it may resume. Carries a date and one line of why.

**Why this is not optional.** An unlabelled track that goes quiet does not read
as "paused"; it reads as abandoned. This site proved that on itself: it stopped
updating for **76 days** (2026-06-23 → 2026-09-07) and said nothing, and a reader
could only assume the work had been given up. The builder's own words:

> *"we stopped updating the website for 2 months… readers can only assume we gave
> up. So — you can pick a label; it's on us to label them correctly."*

The mechanism is cheap. Keeping it honest is the standing obligation.

### 2.6 The unit — a week forward, an EVENT backward

**Amended 2026-09-07, on measurement.** The first cut said *one post per week per
front that had work*. That rule is right for the **forward cadence** and wrong for
the **backfill**, and the difference is not a detail:

> **Going forward, the week is the honest unit because the week is when you
> write.** The cadence creates the unit. **Backfilling imposes a calendar on work
> that never had one.**

Arc 278 did not happen in weeks. It happened in strands that open on one Monday
and close on another. A probe on W5 (2026-07-20→26, 180 commits) returned
**MIXED, lopsided to SLICE**: its two largest strands both opened *before* the
week (R51 `:born #inst "2026-07-19"`) and closed *after* it (`591adcdf6`,
07-28 — "the last raising IPC verb walled"), and R57 explicitly retracts R55's
claim that the law was "complete". Exactly one strand was self-contained — the
RequestMalformed DoS — and it is **one day**, not one week.

The probe's verdict, which is the rule now:

> a per-week grid will both **over-count** (nine slice-posts) and **under-count**
> (it has no cell for a one-day story)

**So the backfill allocates by EVENT. More than one post may share a week, and a
week may hold none.** Five unit kinds, each with a datable trigger:

| unit | trigger |
|---|---|
| **closure** | an `INSCRIPTION` lands; the arc is done |
| **reversal** | a closure is *undone* — the INSCRIPTION deleted, the arc reopened |
| **campaign** | a long strand with real recognition, still open; bounded by its own realizations |
| **incident** | a self-contained story, often one day, that the calendar would bury |
| **opening** | a front begins; the branch diverges |

### 2.6.2 The mirror CHANGED what the story owes

Recorded 2026-09-07, because it surprised the campaign that produced it.

Running `npm run mirror` this session published ~12,700 lines of realizations,
including arc 170's closing realization as its own rendered page —
`210-the-closing-realization-per-portam-cogitamvs-…`, 216 lines, live. Its song,
its three faces, its *"convicts its own builder"* line: all now served verbatim.

**A story post that reframes a published realization is redundant by
construction.** The reader on `uiol-007` reached that verdict independently and
argued *against* a full-length post on the unit it was briefed to read — which is
the correct answer and the one the brief had to make it safe to give.

So the doctrine gains a clause:

> **The story's job is what the raw record cannot carry.** Where the realizations
> are served, the chronicle does not re-narrate them — it supplies what they lack:
> the prehistory that lives in another repository, the shape of a decision, the
> anatomy of an act the record only reports the result of.

This is the trunk/branch relation from `topology.md` arriving at the story layer:
the branch holds the depth, and the trunk writes what the branch's walk *earned*
rather than repeating the walk.

### 2.6.1 The census that decided it

Two instruments over 2026-06-22→08-30 on `origin/main`, both cheap and both
re-runnable. Recorded because the slate is derived from them, not asserted.

**⚠ CORRECTED 2026-09-07 — read this before using the numbers below.** The first
reading of this census was *"recognition density is inverse to commit density."*
That inference is wrong, and the builder's correction is the right one:

> *"the rate of realizations slowed down as we began to do the extensive grunt
> work that the arcs revealed."*

**Realization density measures DISCOVERY, not WORK.** A realization-quiet week is
an execution week — the arcs had already revealed what needed doing, and the doing
does not generate new recognitions. So the low W7–W10 numbers are **not** evidence
that little worth narrating happened there, and a slate weighted on this axis
alone leans early and wrong. Use it as ONE axis beside the commit corpus, never as
the allocator.

**Realization-writing commits**
per week: W1 43 · **W2 127** · W3 18 · W4 12 · W5 39 · W6 14 · W7 3 · W8 6 ·
W9 6 · W10 3.

| week | commits | realization commits |
|---|---|---|
| W2 06-29→07-05 | 349 | **127** (+11,678 lines, 70 distinct R-entries — verified not a migration) |
| W9 08-17→08-23 | **442** | **6** |

The busiest week by commits wrote almost nothing down. A calendar grid weights by
the wrong axis.

**Closure is RARE.** Five closure events in ~2,600 commits, and only three that
held: arc **292** (06-23, already narrated as `series-006-035`) · arc **296**
(06-30, then **reopened** — INSCRIPTION deleted) · arc **298** (07-01) · arc
**170** (07-29) · arc **118** (08-19, opened as arc 004 on 2026-04-20 — a
four-month arc). The window is overwhelmingly *open* work, which is exactly why
the chronicle's narrate-only-what-closed rule had nothing to say for eleven weeks.

**THE COMMIT CORPUS IS A PRIMARY SOURCE, NOT AN INDEX.** Measured 2026-09-07 —
explicitly attributed builder quotes in commit *bodies* in the window:

| front | repo / branch | attributed quotes |
|---|---|---|
| wat Under Its Own Law | `origin/main` | **247** |
| Services in Anger | `origin/sns-sqs` · `origin/claude-compute` | **226** · **221** |
| The Exemplar | `origin/grok-rete` | **191** |
| Ars Culta | `datamancy.dev` | **0** |

Verbatim and attributed — *"floats are decided.... capabilities are a kernel
namespace thing?"*, *"we need to curare and compact - we'll continue on the far
side."* So **consonare rule 11 is satisfiable from commits for three of four
fronts**, and every reader brief must name the commit bodies as a quote source,
not only the realizations.

The zero on `datamancy.dev` is **repo-specific, not a reading failure** — that
repo does not commit in this style. It is why `ars-culta/002` is blocked, and why
`rune:consonare(solo)` is the honest disposition there rather than a shortfall.

**W2 is not a week, it is an era** — 296×43 · 278×34 · 300×25 · 298×12 · 293×8,
five arcs peaking at once, in the week immediately after the chronicle stopped.

### 2.4 The cadence rule### 2.4 The cadence rule

> **The journaling frontier trails the working frontier by one cadence.**

Active work is never required to journal itself while it is still moving. Each
update reaches to roughly a week back and stops. This is a standing rule, not a
one-off for this batch.

---

## 3 — Where content lives

### 3.1 The constraint that decides the layout

`scripts/check-nav.mjs` and `scripts/check-contributions.mjs` both do a
**non-recursive** `readdir("src/content/docs/blog/story")` filtered on `/\.mdx?$/`.
A subdirectory under `blog/story/` is returned as a bare name, fails the
extension filter, and is **silently skipped by both guards**.

So nesting front posts at `blog/story/fronts/…` would put them outside both
guards — recreating precisely the failure `check-nav` exists to prevent (its own
header: *"that is exactly how series-007-005 and 007-006 shipped unseen"*).

**Therefore front tracks live in a peer directory AND the guards are extended to
cover it.** The guard extension is a required work item, not a follow-up (§7).

### 3.2 The layout

```
src/content/docs/blog/
  story/                          THE STORY — the past. Unchanged; at rest.
    prologue.md
    series-006-NNN-*.md           substrate body, sequence continues (next: 036)
    series-007-*.md               the signed-record body   (unchanged)
    series-008-*.md               the command-channel body (unchanged)
                                  final era ends on the LLM-first commentary
                                  and points forward
  fronts/                         THE FRONTS — the perpetual present. Max 3 live.
    index.md                      overview + branch-topology diagram (dates)
    under-its-own-law/  001-*.md …  wat Under Its Own Law   (main)
    exemplar/  001-*.md …         the exemplar             (grok-rete)
    services/  001-*.md …         services in anger        (claude-compute+sns-sqs)
  story/epilogue.mdx              THE EPILOGUE — eternal, order 999, hoisted out
                                  of the "Landing on the Greats" group to sit
                                  last in the nav, after the Fronts.
```

**Precedent:** `blog/witness/` is already a peer narrative track with its own
numbering (001–005 + index), hand-wired in the sidebar, outside both guards. The
site has done this once. Front tracks are the same move.

**[OPEN]** — the epilogue file stays at `story/epilogue.mdx` (no move, no broken
URL) and is re-placed in the *sidebar* only. Confirm that's the intent rather
than an actual file move.

### 3.3 Naming

- **Story** keeps `series-NNN-MMM-slug` — the number *is* the body. 006 =
  substrate, 007 = signed record, 008 = command channel. Sequence unbroken.
- **Fronts** take `fronts/<front>/NNN-slug` — no series number. A front is not a
  body; it is a live workstream. It must not claim a Story sequence number it
  does not hold.
- **Front names come from intueri** — the name must say what the work IS, never
  where it runs.
  - `exemplar` — **"The Exemplar."** Says exactly what it is.
  - `services` — **"Services in Anger."** The builder's phrase; "in anger" carries
    the whole meaning (real use, not a demo).
  - `under-its-own-law` — **"wat Under Its Own Law."** SETTLED — intueri cast
    2026-09-07, ruled by the builder. See §3.4.
  - `ars-culta` — **"Ars Culta."** SETTLED 2026-09-07. See §3.6.

### 3.4 The `main` front's name — the cast and its record

The builder's shorthand was *"language maturity."* intueri (cast 2026-09-07,
against the R1 blocks of arcs 255 / 296 / 300 / 294 / 293 / 251 / 109) graded it
**Level 2 — it mumbles**, on three counts:

1. **Referent collision, not label collision.** `series-006-014` is titled *"The
   Language"* and its description already reads *"The substrate language
   **matures** into Clojure-faithfulness. **Arc 109** sweeps every primitive
   type…"* — the May era spent *maturation*, *Clojure-faithfulness*, and arc 109
   by name. A "language maturity" front inherits an exhausted promise.
2. **It names the location, not the work.** It was the residual after two
   purposes were carved out — the name for *whatever happens on `main`*. That is
   `utils.rs` wearing a domain's clothes, and it violates §3.3's own rule. The
   other two front names would survive their branches moving hosts; this one
   would not.
3. **"Maturity" is a completion verb on a perpetual thing.** Eras are past and
   may take completion verbs (*Matures*, *Hardens*, *Become*). A front runs "as
   long as it must" (§9); naming it for a stage predicts a finish line the
   doctrine refuses.

**The substantive finding: the front's subject is not growth, it is
self-subjection.** The arcs' own keys say so — `WAT-MUST-OBEY-ITS-OWN-LAW` (296)
· `THE-LAW-SPARES-NO-ONE-NOT-EVEN-WAT-ITSELF` and `AGENT-SMITH-IS-MR-ANDERSON`
(300) · `NE-SIBI-OBSOLESCAT` (298) · `A-STRINGLY-ERROR-IN-AN-EDN-LANGUAGE-IS-SELF-BETRAYAL`
(296) · `THE-NAME-WAS-LYING-SINCE-THE-BOOTSTRAP` (294). Maturity is the
flattering outside view; from inside, the language is being made to submit to the
law it enforces on everyone else. All keys verified present on disk 2026-09-07.

Runner-up, recorded in case the name is ever re-cast: **"No Second Spelling"** —
and note "second spelling" is live builder vocabulary, 20 occurrences across 18
files under `wat-rs/docs/arc/2026/`, not a coinage.

**Two cautions carried forward, both ruled acceptable:**

- **`The Naming Law`** is an existing post title (`series-006-023`, arc 242 — *"a
  naming law for the type system, legislated by the user and handed to the type
  checker to enforce"*). Adjacent vocabulary, different law — and arguably
  supportive: that post established that wat legislates and mechanically
  enforces; this front is that machinery turned inward.
- **A label beginning with lowercase `wat` is a first.** Only `"The Birth of wat"`
  uses it, mid-label. Deliberate — `wat` is the language's name and the site
  writes it lowercase everywhere.

**Correction on the record:** the brief handed to the ward summarized arc 109 as
*"decomposition of the megafile; runtime.rs below 30,000 lines."* That was drawn
from a single commit message and is wrong about a 198-commit arc. 109's stones
are `annihilate-the-angle-bracket` (+ wave 2) · `set-the-angle-form-ablaze` ·
`angle-brackets-are-illegal` · `the-comma-dies-in-the-reader` ·
`the-turbofish-dies-too` · `the-heresy-stops-being-taught` ·
`the-prose-stops-teaching-a-dead-syntax` · `reap-the-angle-machinery` ·
`edn-only-rust-stdio-enforcement`. **109 is surface annihilation, and belongs
with 300, not with housekeeping.** Judged as decomposition it drags every
candidate toward "tidying."

### 3.6 `Ars Culta` — the portal front's name

**Ars Culta** — *ars, artis*: skill, craft, systematic technique (nearer Greek
*technē* than English "art"). *culta*: perfect passive participle of *colō,
colere* — to till, to dwell in, to tend, to practise, to honor, **to worship**.

**The craft that is tended.**

Why this and not the alternatives, since a name outlives the argument that chose
it:

- **The agent is the builder.** Every serious candidate was passive; the fork was
  *who acts*. `Ars Incluta` (*inclutus* < PIE \*ḱlu-tós, "heard") means the craft
  that is **spoken of** — the agent is outside, and the claim is ratified by other
  people. `Ars Culta` means the craft that has been **tended** — the agent is the
  practitioner. For a front whose whole premise is *"building wat for the sake of
  building wat,"* the tending is the subject and the renown is not.
- **It is the builder's own word.** He said *"I am a devotee of Hephaestus here."*
  The Latin for devotee is **cultor** — tiller, tender, worshipper — and `culta`
  is that word's participle. *cultor · cultus · cultura*, whence English *cult*
  and *culture*. The devotion is the root of the name, not decoration on it.
- **It cannot overclaim.** `Incluta` asserts renown, which is true or false
  depending on other people; `WRITING-GUIDE.md` says *confident but not
  overclaiming*, and a section label reading "the renowned craft" is the site
  vouching for its own fame. "Tended" is a claim about effort that nobody can
  take away.
- **A cold reader gets nearer.** English carries no visible reflex of *inclutus*;
  *culta* lands near *cultivate* and *culture*, and those guesses are correct —
  which matters for a sidebar label that has no definition to jump to.

**Rejected, with reasons worth keeping:**

- **`Fabrica`** — the better word for *making* (it carries the craft, not just the
  room, and English "forge" descends from it via Old French). **Killed on a live
  referent collision:** every occurrence of the fabr- stem in this corpus is
  "fabricate" in its pejorative sense, and it is one of the chronicle's named
  sins — *"the practitioner fabricated a cast"*, *"fabricated false anchors four
  times"*. On this site the root means **lying**.
- **`Officina`** — clean (zero prior use) and correct, but it names the *room*.
  *Officina* < *opus* + *facere*: the shop where work happens. `Ars Culta` names
  the craft and the tending of it.
- **`Ars Incluta` / `Arte Inclutus`** — Homer's epithet for Hephaestus is
  κλυτοτέχνης, and *inclutus* is not a translation of *klytos* but its **cognate**
  (both continue \*ḱlu-tós; cf. Sanskrit *śrutá-*, Old Irish *cloth*, Greek
  *kléos*). Beautiful, and the wrong axis — see above. Noted also: *Ars Incluta*
  is not the epithet's shape; κλυτοτέχνης qualifies the god, so the faithful
  rendering is *arte inclutus* or *inclutus artifex*.
- **"portal" / "the console" / "the instrument layer"** — all void, and the record
  should say why plainly. "portal" is a hostname, killed by §3.3's own rule. The
  other two were **the orchestrator's own inventions**, fed to a ward as if they
  were candidates; the findings against them were findings about made-up words.
  The `Console` collision was additionally judged against the *chronicle* — a
  historical record in which retired types naturally appear. That is the
  recovery file's own FM-2: *presence is not aliveness*.

**Calibration note (`curare`).** intueri was cast on this name and **did not
produce it.** Its recommendation (`Discipline as a Dependency`) and runner-up
(`Minted from Failure`) were both set aside; its structural finding was
withdrawn; two of its three Level-1 verdicts were against words the orchestrator
had invented. The cast said so itself: *"the body here does not exist… five
outlined posts is a plan, not prose."* The §3.4 cast paid because arc 109's
realizations were on disk to judge against. **A name for a track with no written
body is not a target a ward can measure.** Do not cast on the remaining front
names until their posts exist.

### 3.5 Naming precedent — the nav records its own casts

`astro.config.mjs` already carries five dated intueri comments above era labels,
e.g. *"intueri (cast on the six arcs, 2026-06-05) named this era for the one move
all six share…"*, and one **re-cast**: *"intueri (re-cast 2026-06-01) renamed this
from 'The Static MCP' — that named only the first post."*

Era naming here is an established, documented, ward-driven practice. **A front
label landing in the sidebar owes the same comment** — the cast, its date, and
the one move the name holds. That is a required part of the nav wiring, not a
nicety.

## 4 — The nav

### 4.1 What we have, and why it prompts the question

Current sidebar order interleaves the bodies by *when written*, not by subject —
so series-007 (The Signed Record) and series-008 (The Command Channel) sit
**between** `006-024` and `006-025`, interrupting the substrate spine. That is
the "random segment with the wat-rs stuff written around it." It is honest about
chronology and awkward about subject.

Repeating that pattern for three concurrent fronts would flatten concurrency into
sequence — the current dishonesty in a new costume.

### 4.2 Proposal — three standing groups

```
The Story                        ← the past, readable end to end
  … existing eras, unchanged …
  Landing on the Greats            006-034, 006-035
  <final era>                      006-036+ — the branch point and the honest
                                   commentary on LLM-first development;
                                   points forward to the Fronts

The Fronts                       ← the perpetual present, max 3 live
  Overview                         branch topology + real dates (mermaid)
  The Exemplar                     live      (grok-rete)
  Services in Anger                live      (claude-compute + sns-sqs)
  wat Under Its Own Law            live      (main)

The Epilogue                     ← eternal, order 999, last
```

**Why this shape:**

- It answers *"where does the story continue?"* with one arrow instead of an
  interleaving. v1's era-interleaving is what made series-007/008 read as a
  "random segment" sitting between `006-024` and `006-025`.
- Concurrency is expressed as concurrency. Three peers, live, none subordinate —
  which is the thing the current single-line model cannot say.
- The epilogue's own frontmatter already asks for this position.
- **Precedent exists in this nav:** the "The Book" group already holds trunk
  chapters + the arc-170 branch + the realizations index under one group.

**The chronology objection** — peer groups lose the sense of *when* fronts ran
relative to each other — is answered on `fronts/index.md` with a Mermaid branch
diagram carrying real dates (the repo already depends on `astro-mermaid`).

**Front ordering is by when the front OPENED** — time of creation, oldest first
(ruled 2026-09-07). Not by activity, not by status; a front that goes quiet does
not move. Current order:

1. **wat Under Its Own Law** — continuous with the trunk; the oldest.
2. **The Exemplar** — opened 2026-08-24.
3. **Services in Anger** — opened 2026-08-30.

**[OPEN]** — whether a landed or parked front collapses by default in the nav.
Ordering itself is settled.

## 5 — The cutoff

**End of W10 — Sunday 2026-08-30.** Week-aligned, because the week is the
journal's unit (§2.6); an 08-31 cutoff was ragged, since 08-31 is a *Monday* and
would have pulled one day of W11 into the batch. The batch is therefore **exactly
ten weeks**, W1 (Mon 06-22) → W10 (Sun 08-30), and the last 4-7 days stay running
per §2.4. Re-pinned markers:

| front | marker | date |
|---|---|---|
| `main` (wat Under Its Own Law) | `146a90b92` | 08-30 |
| `grok-rete` (The Exemplar) | `e6858e858` | 08-30 |
| `sns-sqs` (Services in Anger) | `ca405009b` | 08-30 |
| `claude-compute` (Services in Anger) | `f92f55dbd` | 08-30 — its own CURARE; branch landed |
| `wat-revival` | — | no track (0 docs) |

**W11 (Mon 08-31 → Sun 09-06) is the FIRST WEEKLY UPDATE**, and it is already
complete on disk: `main` 369 · `grok-rete` 242 · `sns-sqs` 222 · **`pulsare` 6 ·
`cingere` 22**. The cadence restarts by itself, and the automation tooling lands
in the first weekly rather than being crammed into the backfill.

Note `claude-compute` has zero commits in W11 — it wrapped on 08-30. Its front,
**Services in Anger**, stays `live` regardless: a front is a purpose with
possibly several branches, and `sns-sqs` runs on. The doctrine handles the
transition without amendment.

What the line catches:

- **`claude-compute` is a completed track** — opened, ran, and wrapped inside the
  window, its final commit its own CURARE. A front track that ships with its
  synthesis return already written, by the front itself.
- **The duet is inside the batch.** `origin/grok` ran 08-03 → 08-16 (~370 commits)
  in its own worktree; `grok-rete` opened 08-24 and still runs. The duet began
  **August 3rd**. What falls in September is not the duet but its formalization —
  `pulsare` (09-05) and `cingere` (09-05) — which becomes the first weekly update.
- The batch therefore reads: one trunk, one front landing, two fronts still
  running. Which is the honest picture, found on the disk rather than imposed.

---

## 6 — What is NOT in this doc

**The substance.** Which realization, commit, or recognition lands in which post
is *not* decided here, and cannot be until ~12,700 lines of new realizations are
actually read. Everything above is skeleton and assignment rule.

Trunk candidates identified by *closure and volume only* — each still owes a read
before it earns a post: arc **170** closing (07-29, the arc that produced the
chronicle branch) · arc **118** closing (08-19) · arc **296** closing *and
reopening* · arc **255**'s four-axes day (08-30) · arc **109**'s revival
(runtime.rs drops below 30,000 lines) · the **branch point** itself.

Do not treat that list as a slate. It is a reading list.

**One beat already surfaced, and it is the strongest hook found so far.** This
site published `series-006-016 "The Loop Closes"` — *"the strange loop closes:
HolonAST — minted three months ago to encode VSA expressions — gets turned on the
substrate's own types."* Arc 294's R1 keys are `HOLONAST-WAS-A-COAT` and
`THE-NAME-WAS-LYING-SINCE-THE-BOOTSTRAP`. **The front repudiates something the
chronicle narrated as a triumph.** Both verified on disk 2026-09-07. The register
across these arcs is not growth but reckoning — "self-betrayal", "why are we
defending bad choices", "the apparatus defended the obsolescence" — and the
front's opening post owes that inversion.

**What no name captures.** The migration machinery is the front's real
capability: 251's *"wat builds its own bespoke, comment-faithful syntax fixers on
demand"*, `wat-revival`'s 1675 sites across 386 files, 300's conversion expressed
as rete `defrule`s. The reason wat *can* be put under its own law is that it can
rewrite its whole body in one motion. Every candidate named the law; none named
the arm that swings it. If the front's posts turn out to be mostly codemod
substrate, the name is worth re-casting.

---

## 7 — Required work items

1. **Extend `check-nav.mjs` and `check-contributions.mjs`** to cover
   `blog/fronts/**` before the first front post exists. Non-negotiable — §3.1.
2. **The size wall — a build guard, measured in rendered bytes.** **File size is
   the metric**: it is what Cloudflare actually constrains, and what broke us
   before. `check-pages` counts that each source rendered; it never measures what
   it rendered.

   *Measured 2026-09-07 across the last build (555 HTML pages):* 535 are under
   256 KB · 15 are 256–512 KB · 4 are 512 KB–1 MB · **1 is over 1 MB**
   (`300-wat-source-is-edn`, 1.10 MB). The site's own record names two things
   that broke: the arc-170 realizations at **~3.5 MB** and the BOOK at **4.2 MB**,
   both *build-memory* hogs (not Cloudflare rejections).

   > **WALL: fail the build on any rendered page > 1.5 MB.**

   Nothing today exceeds it (max 1.10 MB), and it sits well under the 3.5 MB
   known-breakage line — a real ratchet with headroom. An earlier proposal of
   500 KB was **wrong**: it would have failed five pages that build fine today,
   including already-chunked BOOK chapters.

3. **The fragmenter — chunk on source file size.** Rendered ÷ source measures
   **~3.3–4.6×** across the unchanged arcs (markdown → Starlight HTML), so ~4× is
   the planning ratio.

   > **FRAGMENT: any realizations source > 250 KB (≈1 MB rendered).**

   Today that is exactly three files — `278-rules-engine` (**1,469 KB** source →
   **~5.9 MB** rendered, past the arc-170 breakage line), `296-diagnostics-fully-edn`
   (331 KB), `300-wat-source-is-edn` (328 KB). The next largest, `293` at 141 KB
   (~0.56 MB), stays whole and sits comfortably under the wall. So in normal
   operation the fragmenter keeps every page well clear and **the wall never
   fires** — it is the backstop, not the routine.

   **Section count is NOT the metric, and was rejected on the data.** A ~30-section
   cutoff would catch only 278 (68 sections) and miss 296 (20) and 300 (17) — the
   two pages already over 1 MB. Sections do not predict size: `170-slice-1` has 8
   sections in 2,052 lines; `272` has 7 in 386. Inside 278 the sections run
   **36 to 1,179 lines**.

   **The break-er-up-er already exists.** `mirror-monoliths.mjs` chunks on
   `/^## /` into `<NN>-<slug>.md` pages — that is how arc-170 became 206 pages. It
   has simply never been pointed at the per-arc realizations. 278 probes clean for
   it: 1 `#`, 68 `##` (all `## RN — …`), 235 `###` nested *inside* entries, so
   `##` is a true top-level seam; 68 chunk pages, median 147 lines.

   **Safety, per source.** mirror-monoliths' own comment says its split is safe
   *"because the source has no `##` subheadings inside an entry body (verified)."*
   That verification is per-file. The fragmenter must **refuse to chunk** a file
   whose heading structure looks unsafe rather than silently mangling it.

   **Expect total bytes to go UP.** arc-170's 206 chunks are 41 MB in `dist/`. The
   win is that no single page is a hog, not that the site shrinks.

3b. **UNRELATED LIVE RISK, found by the same measurement.**
   `dist/demo-self-calibrating.mp4` is **22.10 MB** against Cloudflare Pages'
   **25 MiB per-file** cap — 88% of the limit. A re-encode that grows it breaks
   the deploy. File count is fine (1,710 of 20,000; chunking adds ~120).

4. ~~**`CHRONICLE-COVERAGE.md`: one row per front**, not one row per repo.~~
   **SHIPPED 2026-09-08.** Restructured to five front rows (the closed Story plus
   four fronts), every HEAD re-measured, the per-repo table kept as a secondary
   reverse index. Front rows are measured with **explicit exclusion**
   (`rev-list <branch> ^origin/main ^origin/grok-rete`) and the file states why:
   measured that day, `claude-compute` was **133 ahead by the naive range and 24
   by its own work**. It also surfaced something nobody was tracking — `holon-rs`
   moved to `c19f378` on 08-03 while the old file called it "quiet since 05-22".
5. ~~**`WRITING-GUIDE.md` §Series-Specific Notes is wrong.**~~ **SHIPPED
   2026-09-08.** Rewritten against the live posts: eight body rows with real post
   counts and real subjects, and a new **"Writing for a front, not a body"**
   section — a front is perpetual present, is a purpose rather than a branch, and
   orders by event rather than calendar. Four of the seven original entries named
   the wrong subject and 008 was missing entirely. The replaced text is quoted in
   the file's own header note, because **a voice anchor carrying a wrong map is
   worse than one carrying none** — a writer trusts it instead of opening the
   posts. Also records the ordering trap: the sidebar is era-grouped, so
   `series-008-*` precedes `series-006-036`.

---

## 8 — Open decisions

- ~~The `language` front's name~~ — **SETTLED 2026-09-07: "wat Under Its Own Law."**
  intueri cast; builder ruled. §3.4
- ~~Whether a front post owes the `## Likely Contributions` close~~ — **RULED
  2026-09-07: YES, same rule as the trunk.** §2.5
- ~~The parked-front terminal state~~ — **SETTLED 2026-09-07:** `status: live |
  landed | parked` in the track index's frontmatter. §2.3
- ~~Front ordering~~ — **RULED: by open date, oldest first.** §4.2
- **[OPEN]** Whether a landed/parked front collapses by default in the nav. §4.2
- **[OPEN]** Epilogue: sidebar re-placement only, no file move. §3.2
- **[OPEN]** Whether the no-worktree doctrine (site recovery §1, wat-rs FM 7-bis)
  was revisited when the Grok front took its own worktree at
  `/home/watmin/work/wat-rs-grok`. Reading the rule, it targets *harness-spawned*
  worktrees, so there is likely no contradiction — but if it was reconsidered,
  that is a beat for the branch-point post.

---

## 9 — The repeatable pattern

This is not a one-time reorganization. The builder expects to run concurrent
orthogonal work again, at a stated ceiling of **three at once**. So the shape has
to survive fronts opening and closing indefinitely:

- A purpose that starts journaling **opens** a front (§2.2).
- A front runs as long as it must. No cadence is imposed on it beyond §2.4.
- A front that lands writes its **arrival** and moves to the closed state.
- A front that stops without landing takes the **parked** state — not deleted,
  not silently dropped.
- The Story stays at rest unless a recognition reopens it.
- The Epilogue never closes.

The nav shape is constant regardless of how many fronts are live; only the
membership of the Fronts group changes.
