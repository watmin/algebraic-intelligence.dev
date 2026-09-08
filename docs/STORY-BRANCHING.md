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

Hosts do not decide names, but they are **content**: `portal` (the laptop where
all the work began, abandoned because constant Rust builds DoS'd it), the
migration to `johndesktop`, `reason` (where the ML work began years ago),
`compute` (an old home server repurposed). That migration is the physical
constraint that produced the topology, and it belongs in the branch-point post.

### 2.1.2 The story is AT REST, not ended

`main` is a front, not a trunk — so **there is no spine for a synthesis return to
be absorbed into.** A merge is therefore *arrival*: the front's own closing post,
plus the topology recorded on the Fronts overview. Merging is its own story
event and is allowed to be one.

But the Story is not sealed. A recognition large enough reopens it with a new
era. At rest, not finished — which is the only honest state for a chronicle whose
subject is still running.

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

Measurable on disk, not a judgment call, and self-maintaining. Against the
current tree it discriminates correctly without tuning: `wat-revival` did real
work in the window (the `:- [...]` codemod — 1675 sites across 386 files) and
authored **zero** docs, so it gets no track and that work belongs to the trunk.

### 2.3 Parked is not dead

`PARKED IS NOT DEAD` is already the substrate's own language (arc 294's `SEAM.md`).
A front track that stops needs an honest terminal state, not silent abandonment.
**[OPEN]** — what that state is called on the page, and whether it is a frontmatter
field, a closing section, or a nav marker.

### 2.4 The cadence rule

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

**[OPEN]** — front ordering within the group (by open date? by activity?), and
whether a closed front collapses or moves to an "arrived" sub-group.

## 5 — The cutoff

**End of August 2026.** The last 4–7 days stay running and unjournaled, per §2.4.
Pinned markers:

| front | marker | date | inside | running |
|---|---|---|---|---|
| `main` (trunk) | `cdabf403d` | 08-31 | 2618 commits | 311 |
| `grok-rete` (reason) | `6d7775643` | 08-31 | 122 docs | 329 docs |
| `sns-sqs` (queue) | `1736d7a69` | 08-31 | 151 docs | 301 docs |
| `claude-compute` (compute) | `f92f55dbd` | 08-30 | 133 commits, 15 docs | **0 — complete** |
| `wat-revival` | `d06ce33da` | 08-30 | — | no track (0 docs) |

What the line catches, and why it lands well:

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
2. **A page-size wall.** `300-wat-source-is-edn` already renders to a **1.2 MB**
   single page; arc 278's realizations grew 2,755 → **12,329 lines** and would
   render to roughly **4.5 MB** — past the ~3.5 MB that forced the arc-170
   chunking. `check-pages` counts that each source rendered; it never measures
   what it rendered. The 170 lesson was absorbed as a one-off migration, not a
   wall. **This blocks `npm run mirror`** — running it today ships the 4.5 MB page.
3. **Multi-front realizations mirror.** `mirror-realizations.mjs` hardcodes
   `SRC_ROOT = "../wat-rs/docs/arc"` — one working tree, therefore one branch. It
   is structurally incapable of seeing more than one front. Needs one pass per
   front, each landing under that front's track.
4. **`CHRONICLE-COVERAGE.md`: one row per front**, not one row per repo. Last
   reconciled 2026-06-17; currently the stale cache.
5. **`WRITING-GUIDE.md` §Series-Specific Notes is wrong.** It describes "Series 6
   (XDP + eBPF scrubber)" and "Series 7 (current state and roadmap)". Live, 006 is
   the trading lab → wat, 007 is the signed record, 008 the command channel. The
   voice anchor consonare casts against carries a series map that does not match
   the site.

---

## 8 — Open decisions

- ~~The `language` front's name~~ — **SETTLED 2026-09-07: "wat Under Its Own Law."**
  intueri cast; builder ruled. §3.4
- **[OPEN]** Whether a front post owes the `## Likely Contributions` close, or
  whether that is a Story-only obligation (consonare Rule 13's scope). Decides
  whether the guard extension enforces the heading or only nav-wiring.
- **[OPEN]** The parked-front terminal state — `PARKED IS NOT DEAD` is already
  the substrate's language, but a track needs somewhere to *say* it: frontmatter,
  closing section, or nav marker. §2.3
- **[OPEN]** Front ordering in the sidebar; closed-front presentation. §4.2
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
