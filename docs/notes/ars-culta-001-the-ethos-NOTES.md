# Working notes — ars-culta-001, the grimoire ethos (2026-06-26 → 2026-06-30)

**Status:** raw notes, not a draft. Written 2026-09-08 by a reader working the
`ars-culta` backfill. Everything below is grounded against `main` in
`/home/watmin/work/holon/datamancy.dev`, read this session. **Nothing in
`datamancy.dev` was edited** — it was treated as read-only throughout.

**Placement:** a CAMPAIGN post covering a five-day window, three efforts, ten
commits (the *entire* commit population of the repo in that window — see §1).
It is the front's first substantive unit and it is about the instrument layer
itself: the grimoire that governs how the work is done.

**Title and song-drop are ALWAYS the builder's call.** Working images below, not
proposals.

---

## ⚠ READ FIRST — three corrections to the brief's framing

None of these is fatal. All three make the post better and the writer needs them
before drafting.

### (a) The brief's grouping holds, but the *reason* is not the one implied

The plan folds `cohaerere`, `partire` and the ethos encoding together as "the
channel being hardened." **That grouping is correct and I can prove it
mechanically** — but not on subject matter. `cohaerere` is intra-document
self-consistency; `partire` is Parnas module cohesion; neither is *about* failure
or constraint engineering. Two real links do the work instead, and both are
verified below (§3): an **instrument chain** (cohaerere is the ward that warded
the other two, by slot, automatically) and a **shared structural move** (both new
wards are built so that an unsupported verdict has no form — which is the ethos's
own constraint-engineering discipline, applied to the instrument layer, in the
same week it was written down). **STOP-1 is NOT triggered.** Write the motion,
but write it on the mechanism, not on the theme.

### (b) The ethos encoding is ONE PARAGRAPH. State that plainly.

The literal artifact:

- `c4726bc` (2026-06-29): `grimoire/SKILL.md` **+10 / −7**; generator **+10 / −7**.
- `8cb9d0a` (2026-06-30): `grimoire/SKILL.md` **+16 / −16**; generator **+20 / −15**.

The ethos went from **6 numbered principles to 7**. Principle 2 (constraint
engineering) is new; principle 1 was reworded to name failure engineering and
spell out the ladder inline; principle 3 gained six words. That is the whole
change to the ethos proper. (The rest of `8cb9d0a`'s 32 lines is a
vocabulary root-fix — see §5.)

This is **not** a STOP-2. It is a bound the writer must respect: do not imply a
body of work. The argument *is* that one paragraph in the first-load surface is a
different kind of object from a chapter in a manual, and the post should make that
argument rather than inflate the artifact. A short honest post is the right post.

### (c) The trial-by-combat "protocol" was NOT written down yet in June

The brief's frame invites saying the spells were admitted "per the contributor
protocol." They were not. `CONTRIBUTING.md` as of `8cb9d0a` has a three-step
*Add or edit a spell* section with **no warding step at all** (verified:
`git show 8cb9d0a:CONTRIBUTING.md`, lines 26–37). The clause

> **5. Ward it before it ships — trial by combat.**

landed at `2ce6dd5` (**2026-09-07**), two months later. In June, trial-by-combat
was practice + a ledger row; the *rule* was written from the practice
afterwards. This is itself a ladder instance and it belongs in the post (§7).

---

## 1. The window, complete

`git -C datamancy.dev log --format='%h %ad %s' --date=short --since=2026-06-18 --until=2026-07-04`
returns **exactly ten commits**, and that is the whole population — this repo has
101 commits total across all refs, one branch (`main`). Nothing else landed. The
window is these three efforts and nothing but:

| Commit | Date | What |
|---|---|---|
| `e30125b` | 06-18 | publish — grimoire: kill the `/grimoire/<name>/` 404 trap in the casting path *(prior window; context only)* |
| `714de2d` | 06-26 | **publish — `cohaerere`**, new spell (3 finding-shapes: drift / scatter / assertion-clash) |
| `da6ce5c` | 06-26 | ledger: pin cohaerere warding to the publish commit |
| `7f7cea0` | 06-27 | **publish** *(no subject beyond the stamp — this is the `partire` publish)* |
| `9651cd1` | 06-27 | ledger: pin partire warding to the publish commit |
| `c4726bc` | 06-29 | **grimoire: encode BOTH problem-solving disciplines in the first-load ethos** |
| `8cb9d0a` | 06-30 | **grimoire: … — warded (full vigilia ×6, 0 L1)** |
| `4caedf8` | 06-30 | ledger: cite the actual warded grimoire commit (amend changed the hash) |
| `9476158` | 06-30 | **publish 2026-06-30T08-34-32Z** |
| `5964871` | 06-30 | ledger: grimoire ward PUBLISHED (live, signature-verified) |

Note the shape: every effort is **three commits** — the content, the ledger pin,
the publish. The record is a first-class deliverable of each unit, not a
byproduct.

Note also: **`7f7cea0`, the `partire` publish, has an empty body.** Its subject is
`publish 2026-06-27T23-31-01Z` and nothing else. Everything known about what the
`partire` trial found lives in `docs/WARDING-LEDGER.md`, not in git. If the post
wants partire's story it has to quote the ledger.

---

## 2. The payload — the two disciplines in the grimoire's own words

All quotes in this section are **verbatim from `grimoire/SKILL.md` at HEAD**,
which is byte-identical to the published bytes (proven in §6). The text is
generated — the authored source is
`scripts/generate-grimoire-skill.mjs` (see §7) — so the same strings appear
there.

### Principle 1 — failure engineering (the backward discipline)

> **Failure engineering — a failure is data; pull the whole class out by the
> root.** When something breaks, STOP and read what it reports — it is the
> system asking for help, not friction to bypass. Fix the *class*, not the case:
> climb the ladder — a convention → a check that fires at construction → **a
> shape the mistake cannot be written down in** — until the *kind* of failure is
> structurally impossible. Never patch the stem; never construct the situation
> that needs the patch. The **backward** discipline: a concrete failure that
> *happened* becomes a general wall. *(in full: `extirpare`)*

### Principle 2 — constraint engineering (the forward discipline) — NEW

> **Constraint engineering — hold an invariant, and leave its violation without
> a form.** The dual, run *before* anything breaks: derive the *cannot* from what
> the thing **is** (*a struct holds a live socket → it cannot cross the wire*;
> *forgeable identity is not identity → a call must carry cryptographic proof*),
> then make that state **unrepresentable** — no constructor, no type, no path to
> it — climbing the *same* ladder, from the principle instead of the failure.
> The **forward** discipline: an invariant you *hold* becomes a wall the
> violation cannot take.

### The unity line — this is the post's payload, quote it exactly

> **Together the two are one commitment: the wrong thing has no representation —
> whether you foresaw it (constraint) or it taught you (failure). Constraint
> engineering is failure engineering done *before* the failure; failure
> engineering is constraint engineering done *after* it.**

Two shorter framings of the same thing, from the header line above principle 1
and from `c4726bc`'s body respectively:

> The two problem-solving disciplines come first — they are how a datamancer
> makes the wrong thing impossible, from the two opposite directions. Hold both.

> Failure engineering (backward — a failure that happened → a wall) was already
> principle #1; constraint engineering (forward — an invariant you hold → a state
> left without a form) was absent.

### The honest edge — the half most writing on this skips

> Two edges to watch: a *cannot* you cannot derive from the nature of the thing is
> a **convention wearing a wall's clothes** and will rot — *the discipline is the
> derivation, not the `no`*; and the *cannot* is a **gift to the caller**, not a
> restriction — when the only path is the right one, the wrong one is not there
> (this and the Good-UX question — see the four questions, next — are one act
> seen from two sides).

Two separate ideas in one sentence, and both are load-bearing:

1. **A falsifiability test on your own constraints.** Anyone can add a rule. The
   test is whether the `cannot` follows from what the thing *is*. If it does not,
   you have written a convention and painted it to look like a wall — and the
   ethos says it *will rot*.
2. **Constraint = UX.** Principle 3 is tied to this by a clause added in the same
   commit: *"**Decide with the four questions** — constraint engineering at design
   time."* The parenthetical says Good-UX and the `cannot` are "one act seen from
   two sides." That is a real reframing: the constraint is not what you take from
   the caller, it is the path you stop making them find.

---

## 3. The ladder, and where it lives

The ladder is stated **twice**, deliberately, in two places, and the difference
between the two statements is what the whole `8cb9d0a` combat turned on.

### In the ethos (inline, compressed) — `grimoire/SKILL.md` principle 1

> climb the ladder — a convention → a check that fires at construction → **a
> shape the mistake cannot be written down in**

### In `extirpare/SKILL.md`, §"The ladder — climbing toward impossibility"

> Eliminating a class is not one move; it is a ladder, and you climb as far as the
> material lets you:
>
> - **A convention** — "we agree not to do X." The weakest rung: it leans on every
>   future hand remembering. A convention is a failure class waiting for a tired
>   afternoon.
> - **A check that fires at construction time** — a build gate, a generated
>   artifact, a test that goes red the instant the mistake is committed. Now the
>   mistake is *caught*, not merely discouraged.
> - **A shape the mistake cannot be expressed in** — a type, a structure, an
>   interface where the wrong state has no constructor, no representation, no way
>   to be written down at all. The top rung: the failure is not caught because it
>   cannot occur.
>
> Climb until the failure is un-expressible, or until the material runs out — and
> when it runs out, say so, and hold the highest rung you reached. A check is
> worse than a type and far better than a convention.

**"Say so, and hold the highest rung you reached"** is the honesty clause of the
whole system, and it recurs three times in this unit (§7). Quote it.

`extirpare` also carries the rung above the ladder, which the ethos compresses to
seven words (*"never construct the situation that needs the patch"*):

> The deepest move sits one rung above the ladder: do not eliminate the failure —
> eliminate the *situation that produces it.* … The lock is not avoided; the
> shared-mutable-state-across-threads situation is never built.

### The worked examples, and an asymmetry worth stating honestly

Failure engineering has a whole primer with three worked examples
(`extirpare/SKILL.md`, §"Worked examples"). The sharpest for this post is #2,
because the grimoire *does this to itself* (§7):

> - **A hand-maintained index drifted from reality.** The patch: fix the index. The
>   extirpation: *generate* the index from the source of truth and *gate* it in the
>   build, so drift becomes a red build — the class of "the index can be wrong"
>   made un-expressible.

And #3, with its coda, which is the best single line in the primer:

> - **A stale document risked being trusted as current.** The patch: update it. The
>   extirpation: move it where its *path* declares it inactive — then find the
>   *instruction* that told every future hand to keep feeding it, and delete that
>   instruction.
>
> Notice the last one. The sharpest extirpation is often not the stale artifact —
> it is the *rule, habit, or arrangement that keeps producing it.*

**Constraint engineering has no primer and no worked examples** — only the two
inline derivations in principle 2 (*live socket → cannot cross the wire*;
*forgeable identity → cryptographic proof*). That is not an oversight; it is a
recorded, dispositioned decision, and it is the answer to the brief's first
question. See §4.

---

## 4. Why the FIRST-LOAD ethos is different from documenting it — the mechanism

This is the part a reader cannot get from the commit log, and it is grounded in
four separate places on disk.

### (i) The grimoire has two shelves, and they differ in *when they arrive*

`grimoire/SKILL.md` line 7 onward, verbatim:

> **Reading this index installs the datamancer: the operating principles below are
> yours for this session — adopt them.** The spells are tools you reach for on
> demand, but the ethos governs how you work even when you cast no ward.

and the closing line of the ethos block:

> That is the install. You now operate as a datamancer whether or not you cast a
> single ward.

The two shelves are **the ethos** (arrives with the index, unconditionally) and
**the spells** (a separate fetch, on demand, per target). Placement is not a
filing decision; it is an *availability* decision.

### (ii) "First load" is mechanically real, not a metaphor

The manifest description for the grimoire resource, from the signed manifest
published by `9476158`
(`manifests/68a2f13b…/manifest.json`, resource `grimoire`):

> `"START HERE — load this index first: reading it installs the datamancer's
> operating ethos (how you work even when you cast no spell), then catalogs the
> spells."`

A spell is fetched at `/<name>/SKILL.md` only when its moment arrives. The
grimoire is what an agent reads to become a datamancer at all.

### (iii) Constraint engineering was DELIBERATELY given no spell — and the record says why

From the warding-ledger row for this change
(`docs/WARDING-LEDGER.md:44`, added by `8cb9d0a`), under **Grounded-invalid (2)**:

> constraint engineering's no-dedicated-spell (`rune:circumspicere(accepted-by-design)`
> — the derivable dual over a shared ladder, the ethos its declared home, per the
> builder's *"encode in the grimoire"* directive)

Read what that says. A perimeter ward (`circumspicere`) **raised** the absence of a
constraint-engineering spell as a finding. The finding was **dispositioned as
accepted-by-design**, with a reason and a directive. The reason is structural:

- A **ward** is a defect class you *cast at a target* and it returns findings.
  Constraint engineering has no defect class — there is nothing to go find. You
  cannot cast "hold an invariant" at a file.
- A **primer** is a discipline you *read when its moment arrives*. Constraint
  engineering's moment is *before you write the first line* — which is not a
  moment you can notice and reach for.

So the only shelf that can hold it is the one that loads unconditionally. **The
placement is the argument.** A discipline you must already be holding cannot be a
thing you fetch.

### (iv) The corollary, and it is the post's sharpest sentence

Failure engineering *can* be a primer (`extirpare`) because a failure announces
itself — there is a moment to reach at. Constraint engineering has no such moment,
which is exactly why it is the discipline that gets skipped. **Documenting it
would have guaranteed it was never read.** The two disciplines are duals, and
their *filing* is asymmetric for the same reason their *direction* is.

---

## 5. The ward that forged the change — and it changed the change

`8cb9d0a` submitted the ethos edit to the grimoire's own guard. Method, from the
ledger row:

> full applicable `vigilia` (docs-kind: `nesciens` + `cohaerere` + `exigere`;
> `circumspicere` last), embedded by value, fresh subagents, **6 combat rounds**
> under the rune/disposition rule

### Round 1 found the ethos lying about its own honesty

The Round-1 **L1** (highest severity), verbatim from the ledger:

> `circumspicere`'s Round-1 L1 (the ethos pointing constraint engineering *"in
> full: `extirpare`"* when extirpare held only the shared *ladder*, not the forward
> discipline) **FIXED**: softened to claim the ladder only, the forward discipline
> housed in the ethos itself; re-verified RESOLVED at close (extirpare's three rungs
> are direction-neutral; the catalog promises no spell the disk lacks).

This is verifiable in the diff and I verified it. `c4726bc` shipped principle 2
ending:

> *(in full: `extirpare` — the shared ladder both climb)*

`8cb9d0a` changed that to:

> *(Both climb the one ladder `extirpare` teaches — convention → check → no-form;
> the forward discipline itself is this principle, and its home is this ethos.)*

**The first draft of the paragraph about making dishonesty structurally impossible
shipped a pointer to a document that did not contain what the pointer promised.**
It was a one-day-old claim-versus-disk divergence *inside the ethos*, and a
perimeter ward caught it. That is the best beat in the unit — the discipline was
run on the sentence that defines the discipline, and the sentence was wrong.

The corresponding fix in the *pointed-at* document, same commit
(`extirpare/SKILL.md` frontmatter `description`):

> ~~The meta-discipline beneath every ward — each spell is one failure class
> pulled out of the ground.~~
> → The meta-discipline beneath every **atomic** ward — each is one failure class
> pulled out of the ground (the meta-spell composes them).

### The spreading root-fix — the ladder climbed on a *word*

Also from the ledger row:

> The combat forged the change far past the original edit … then drove a
> *spreading* **cast-class** root-fix — `cast` reserved for the ward-spawn act
> across **6 sites** (Principle 5, How-to-cast, the blockquote, the intro, the
> install line, the anti-pattern), `extirpare` *"each spell"*→*"each **atomic**
> ward"*, the catalog pointer + header corrected; **declared + tagged the
> meta-spell** (`vigilia`, `vigilia-slot: aggregator`) so the taxonomy
> (`primer | ward`; atomic-vs-meta) is **complete by construction**.

Verified in the `8cb9d0a` diff — e.g. principle 5's title changed from *"Cast,
don't narrate"* to *"Cast a ward, don't narrate it"*, and *"whether or not you
cast a single spell"* → *"a single ward"*.

Read the shape: a word used two ways (**convention**) → a term reserved for one
act across every site (**a fix**) → a taxonomy **complete by construction**, with
the frontmatter key `vigilia-slot: aggregator` making the meta-spell a declared
kind rather than an exception (**the top rung**). That is the ladder from the
paragraph, climbed on the vocabulary of the paragraph, in the commit that shipped
the paragraph. **A vocabulary is a type system for prose** — that is the sentence
the post can land on.

### Convergence, verbatim

> Converged: `cohaerere` **COHERES**, `nesciens` 0-hard (1 soft grounded),
> `exigere` **0/0 ×6**, `circumspicere` surround clean on all 4 facets
> (catalog↔disk↔manifest **1:1**; Trust claims backed in
> `sign-manifest.mjs`/`publish.mjs`/the pinned KMS fingerprint). … 0
> un-dispositioned.

---

## 6. STOP-3 — the "full vigilia ×6, 0 L1" claim, and what backs it

**The artifact exists.** It is the warding-ledger row at
`/home/watmin/work/holon/datamancy.dev/docs/WARDING-LEDGER.md:44`, added by
`8cb9d0a` and now living under `## Struck rows` → `<details>` (see below). It
records the target, the ISO8601 stamp `2026-06-30T07-19-10Z`, the method, the
per-ward results, both dispositions, and the commit.

**State exactly what that artifact is and is not.** It is a *contemporaneous prose
record written by the same apparatus that ran the cast.* There is no per-round
transcript, no per-ward report file, no test output in the repo. The six rounds
are not independently reproducible from anything on disk. The post must say
"recorded", never "measured by an independent instrument."

**But three of the row's claims ARE independently verifiable, and I verified all
three this session:**

1. **The publish happened, with those exact bytes.** The row cites manifest head
   `sha256:68a2f13b…`. On disk:
   `manifests/68a2f13b8973df93493b60f4288d24397279a7faf1c1d232015e82b973932f1b/`
   with `manifest.json`, `manifest.json.sig`, `manifest.json.sig.txt`.
2. **The manifest's own epoch decodes to the claimed publish time.** `epoch`
   `1782808472` → `2026-06-30T08-34-32Z`, which is the stamp in `9476158`'s
   subject, to the second.
3. **The content-addressed blob matches the text I read.**
   `sha256(git show 9476158:grimoire/SKILL.md)` =
   `b359730c50f70c71519e65604cc848b58b0676528fddc5ba59aa734e39f7e110`, which is
   both the filename under `blobs/sha256/` and the `blob` field of the `grimoire`
   resource in that signed manifest. Same for
   `extirpare/SKILL.md` → `609c363f…0962f`. So the ethos quoted in §2 is
   byte-identical to what was signed and served.

**Verdict on STOP-3: NOT triggered, with a stated bound.** The ×6 / 0-L1 claim is
a recorded claim with a durable artifact and a signed publish trail; the round
count itself rests on the record's own word. Say it that way.

### And here is the beat the brief did not know about: the row was later STRUCK

`docs/WARDING-LEDGER.md`, `## Struck rows`, verbatim:

> - **`grimoire/SKILL.md` + `scripts/generate-grimoire-skill.mjs`,
>   `extirpare/SKILL.md`** — struck `2026-08-28`. Stamped `2026-06-30T07-19-10Z`
>   (`8cb9d0a`). The index gained a `### Runes` section during the `experiri`
>   landing — and that section shipped three successive false universals before
>   converging, which is precisely why the row could not stand.

The strike came in at `1db0ada` (2026-08-28) — **the same commit that first added
`scripts/check-warding-ledger.mjs`**, verified with
`git log --diff-filter=A -- scripts/check-warding-ledger.mjs`. The gate's own
header comment says what it was built for:

> `docs/WARDING-LEDGER.md` says: "A row is a claim, not a permanent guarantee… "
> **Nothing enforced that.** A row could vouch for a file that had changed a dozen
> commits ago and the build stayed green — which is the exact failure mode the
> ledger's own header says it exists to avoid ("a stamp comment can go false while
> the build stays green"). **The ledger was the last claim in this repo held by
> vigilance alone.**

So: the ledger row that certifies this post's subject was **rung 1 (a convention)
when it was written**, became rung 2 (a check) two months later, and the check's
first act was to invalidate that row. Not because the ward was false — because the
vouched file moved and nobody re-cast.

The ledger's own header already said so, and this is the honest-edge quote of the
whole unit:

> **A row is a claim, not a permanent guarantee.** It says "warded as of this
> measurement." Drift after the stamp is caught by *re-running the watch*, never by
> trusting the row. … The green check is not the bar; the disposition is.

**This is the post's ending.** The unit's own certificate demonstrated its own
principle by expiring, on schedule, in public, in the ledger that predicted it.

---

## 7. The ladder, walked by the repo on itself — four instances, all grounded

The post should show the disciplines running on the instrument layer, not just
being written into it. All four are on disk.

| # | The thing | Rung 1 (convention) | Rung 2 (check) | Rung 3 (no form) |
|---|---|---|---|---|
| 1 | **The catalog index** | "keep the index in sync" | `npm run check:docs` runs `generate-grimoire-skill.mjs --check` (+ vigilia, readme, llms, agent-ready) and fails the build on drift | The index is **generated** from spell frontmatter; `CONTRIBUTING.md` step 3: *"Do not hand-edit `grimoire/SKILL.md`."* A drifted index has no form — regeneration overwrites it |
| 2 | **The warding ledger** | a prose row (June) | `scripts/check-warding-ledger.mjs` (2026-08-28), wired into `check:docs` and into `ship` before signing | **not reached, and said so** — see below |
| 3 | **The taxonomy of spells** | "cast" used loosely for primers and wards | — | `vigilia-slot: aggregator` frontmatter + the 6-site `cast`-class fix; the ledger: taxonomy *"complete by construction"* (`8cb9d0a`) |
| 4 | **The publish ceremony** | — | `npm run ship`, fail-closed, gates in order: signing session → regen → `claims:check` → `ledger:check` → **KMS sign** | signing key held non-exportably in AWS KMS; the apparatus can ward but **cannot publish** (`8cb9d0a`: *"KMS/SSO-gated, the builder's step"*) |

**Instance 2 is the one to write**, because the repo names the rung it did *not*
reach, exactly as `extirpare` instructs. `CONTRIBUTING.md` step 5:

> The ledger's own gate (`npm run ledger:check` … ) verifies that every **vouched
> path** is unchanged since its stamp — **it cannot see a spell that has no row at
> all**, so this step is held by discipline and by this paragraph, not by the
> build.

And the gate's own source states its bound in a comment rather than papering it —
`scripts/check-warding-ledger.mjs`:

> **BOUND, stated because it is real:** a token that is neither path-like nor on
> disk is indistinguishable from prose, so an extensionless token that does not
> resolve — deleted, moved, or mistyped — falls out of both lists and the row
> vouches for less than it claims. The cure is the convention, not the heuristic …

and, on its own vacuity:

> NOTE what this does and does not do. `rows` and `liveDataRows` are derived from
> the SAME filtered lines, so `rows.length !== liveDataRows` can never fire — it is
> a shape assertion, not an independent count. The real work is `unparsed`.

A gate that documents which of its own assertions can never fire. That is
"say so, and hold the highest rung you reached", written in JavaScript.

**Instance 4 is the constraint-engineering demonstration.** `8cb9d0a`'s body:

> **NOT YET PUBLISHED** — live MCP serves the prior ethos until `manifest:publish`
> + sign + ship (KMS/SSO-gated, the builder's step).

The apparatus warded the change, wrote the ledger row, committed — and then
stopped, because it structurally cannot sign. The `cannot` is derived from what
the thing *is* (a private key that never touches a disk), not from a policy. That
is principle 2 operating on the repo that published principle 2, on the day it
published it.

---

## 8. The two new wards — what defect class each pulls out of the ground

### `cohaerere` — 2026-06-26 (`714de2d`), fidelity, `vigilia-slot: docs-kind`

*to cling together.* Its reading line:

> whether a document is self-consistent: its definitions are used consistently and
> its assertions do not contradict

The class it owns, and the reason it needed to exist — `cohaerere/SKILL.md`,
§"The failure this spell exists to catch":

> The defect lives **in the relationship between sections, never in any one of
> them.** This is the whole reason it survives a full guard … So every section
> passes every spell, and the document still contradicts itself.

Three shapes: **drift** (a term redefined by later usage), **scatter** (N
undeclared definitions, no governing one), **assertion clash** (two sections
asserting incompatible facts about one subject). Per the ledger, the trial itself
produced the third:

> the dogfood drove the spell from 2 finding-shapes → 3 (added **assertion-clash**,
> the most common kind)

The spell cast on itself found the most common shape of the defect it was written
to catch, and had to be rewritten to hold it. That is the whole trial-by-combat
argument in one fact.

Its grounding clause is the structural move that matters (§9):

> An incoherence is a claim about **two or more places at once**, so a cohaerere
> finding is **withdrawn unless it cites them all** … One citation is half a
> finding; none is a guess wearing the auditor's robe.

### `partire` — 2026-06-27 (`7f7cea0`), craft, `vigilia-slot: conditional-code`

*to divide into its parts.* Parnas, quoted in the spell's own epigraph
(*On the Criteria To Be Used in Decomposing Systems into Modules*, 1972).
The question: *should this file be split, and if so, where?*

> Size is not the question. A three-thousand-line parser can be one concern — one
> design decision (the grammar) expressed at length. A two-hundred-line file mixing
> key management, HTTP routing, and audit logging is three concerns, three reasons
> to change, fused into one name.

Its discriminator — **the independent-test surface**:

> Two modules with genuinely different reasons to change can each be tested without
> the other. Two modules that still share a secret cannot … **No independent test
> surface → accidental seam → the cut is withdrawn.** This is what keeps partire
> from being a size or style heuristic in disguise.

Its trial, from the ledger, is a *falsification of the spell by its own guard*:

> the combat forged the spell — it had implied **solvere was a hard prerequisite**,
> contradicting the two-arm `vigilia-trigger`; `cohaerere` drove out 3 clashes …
> and a convergence-round **L1**: the LEAVE Reporting-format template hadn't
> inherited the conditional solvere-corroboration) → demoted solvere to one of two
> honest arms → COHERES.

and the dogfood:

> **dogfood** (`partire`-on-`partire`) → **LEAVE**: one coherent ward, not two fused.

---

## 9. Why the three are ONE motion — the mechanism, verified

Two independent links. Both check out on disk.

### Link A — the instrument chain, wired by the slot mechanism

`714de2d`'s diff to `vigilia/SKILL.md` adds one row and edits one line:

> `| **cohaerere** | Intra-document semantic self-consistency | cast on documentation targets — README, USER-GUIDE, walkable text |`
>
> - **docs ward** — … **nesciens**, **cohaerere**.

From 06-26 onward, **every docs-kind vigilia musters cohaerere automatically.**
So:

- **06-26**: cohaerere minted; admitted by trial-by-combat; dogfooded on itself;
  joins the docs-kind slot. 3 rounds.
- **06-27**: partire minted. Its trial is docs-kind (a `SKILL.md` is a document) →
  **cohaerere musters** and drives out 3 clashes including a convergence-round L1.
  3 rounds.
- **06-30**: the ethos change. Method line: *"docs-kind: `nesciens` + `cohaerere` +
  `exigere`; `circumspicere` last."* **cohaerere musters again**, and converges
  `COHERES`. 6 rounds.

The tool minted on Friday was an instrument in Saturday's admission and in
Tuesday's. Nobody chose it each time — the slot did. `partire` joins the
*conditional-code* slot instead (`7f7cea0`'s vigilia diff), so it did **not**
muster on the ethos; its membership in the motion is as cohaerere's first external
target, not as a participant in the ethos ward. **Say that precisely; do not imply
partire warded the ethos.**

### Link B — both new wards encode constraint engineering in their own output format

This is the subject-matter link, and it is stronger than it first looks. Both
spells minted that week are built so that **an unsupported verdict has no form**:

- `cohaerere`: *"Every reported finding carries all its citations and its grounded
  demonstration of incompatibility — verdict-flip or meaning-shift (drift), absent
  governing definition (scatter), or both-cannot-be-true (clash) — **or it is
  withdrawn.**"*
- `partire`: *"A LEAVE verdict is worthless unless it is **defensible**"* /
  *"A SPLIT verdict is worthless unless it is **actionable**"*, and *"No independent
  test surface → accidental seam → **the cut is withdrawn.**"*

Neither says "please cite your sources" (a convention). Each defines the *shape* of
an admissible verdict such that an ungrounded one is not a weak finding — it is
**not a finding**. That is principle 2 applied to the instrument's own output, and
it was built into two wards in the same week the principle got written into the
ethos.

**The motion, stated:** *the week the grimoire wrote down how to make wrong things
impossible, it also built two instruments that make an ungrounded verdict
impossible, and then used one of them to prove the writing.*

Working images (builder's call): *the paragraph that loads first* · *the ward that
warded the ethos* · *a vocabulary is a type system for prose* · *the certificate
that expired on schedule*.

---

## 10. Builder quotes — the census, and the solo-rune verdict

### VERDICT: `rune:consonare(solo)` WILL BE NEEDED. One quote exists, four words long.

### The one quote

**10.1 — the placement directive.** `docs/WARDING-LEDGER.md:44`, inside the
grimoire row's **Grounded-invalid (2)** disposition. First written by `8cb9d0a`;
still at HEAD.

> per the builder's *"encode in the grimoire"* directive

Four words. It is genuinely load-bearing — it is the recorded authority for the
single most interesting decision in the unit (constraint engineering gets no spell;
its home is the ethos) — but it is four words inside a table cell, not a ruling
with a voice.

### One attributed reference that is NOT a quote

`8cb9d0a` body: *"KMS/SSO-gated, **the builder's step**."* Names the builder's
role in the ceremony. No speech.

### What I searched, and what each instrument could not see

| Instrument | Scope | Result |
|---|---|---|
| `git log --all -i --grep='builder'` | every commit message on every ref (101 commits) | **1 hit**: `8cb9d0a` — and it is the "builder's step" reference, not a quote |
| `git log --all -i --grep=` for `watmin`, `ruled`, `he said`, `asked`, `steer`, `verdict from` | same | `watmin` 0, `ruled` 0, `he said` 0, `asked` 0, `steer` 0, `verdict from` 0 |
| `git log --all -i --grep='directive'` | same | 1 (`8cb9d0a`, same commit) |
| `grep -rniE '\b(directive\|ruled\|watmin\|the owner\|his instruction)\b' --include='*.md'` | every markdown file in the tree, excluding `blobs/` | 7 hits; **1** is a builder attribution (the ledger row above). The rest: 3 GitHub URLs containing `watmin/`, and 3 uses of "ruled" as a technical term in `exigere`/`mora` |
| `grep -rn 'builder' --include='*.md,*.mjs,*.json,*.txt'`, excluding `blobs/` | whole tree | 4 hits; 1 is the ledger attribution, 3 are "AST builders" / "literal AST builders" in `complectens` and `cernere` |
| Read in full | the 10 commit bodies in the window; `cohaerere/SKILL.md`; `partire/SKILL.md`; `extirpare/SKILL.md`; `grimoire/SKILL.md`; `docs/WARDING-LEDGER.md`; `CONTRIBUTING.md`; `README.md` (head); `package.json`; `scripts/check-warding-ledger.mjs` | no further builder speech |

**What these instruments could not see, stated so the absence is falsifiable:**

- **`blobs/` was excluded** from the greps. It is the content-addressed copy of the
  same published markdown — same bytes, so excluding it changes no count, but I did
  not re-run to confirm byte-for-byte across every blob.
- **`CONTRACT.md` and `RECOVERY.md` do not exist in this repo.** `CONTRIBUTING.md`
  links both to the sibling `github.com/watmin/datamancy` npm-package repo, which I
  did not have and did not fetch. If builder voice lives anywhere in this project,
  the package repo's `RECOVERY.md` is the first place to look.
- **Three of the four publish commits have empty or stamp-only bodies**
  (`714de2d` carries a one-line subject only; `7f7cea0` and `9476158` carry the
  stamp). The `partire` effort's entire narrative exists only in the ledger. So the
  quote-bearing surface here is *structurally* thin: this repo's publish commits are
  ceremony receipts, not stories.
- I did not read the four `.well-known/` JSON files or `sitemap.xml` in full;
  they are generated discovery artifacts and would not carry speech.

### The comparison the writer should make in the frontmatter note

The sibling unit measured **0 attributed builder quotes** in this repo over a
comparable window against **247** in `wat-rs`'s `main`. This unit finds **1**, of
four words. The direction is identical and the cause is now visible: **in `wat-rs`
the commit body is the record; in `datamancy.dev` the commit body is a receipt and
the record is a ledger table.** A ledger row summarises a cast; it does not
transcribe a conversation. The corpus cannot discharge the quotation obligation
because of how it is shaped, not because the collaboration was absent — and
`8cb9d0a`'s "the builder's step" plus the KMS gate prove the collaboration was
structural (the apparatus literally cannot ship without him).

**Never extend the four words. Never turn the ledger's third-person summaries into
first-person builder speech.** Declare the solo rune and say why, in one sentence,
citing `docs/WARDING-LEDGER.md:44`.

---

## 11. The substance test — run by me

Strip every hash, date, file path, line number and cross-link. What survives that a
reader could not get from the commit log?

**Holds up:**

1. **Where a discipline lives determines whether it runs.** A grimoire has two
   shelves — what loads first, and what you reach for. Failure engineering can sit
   on the second shelf because a failure announces itself; there is a moment to
   reach at. Constraint engineering has no such moment — its moment is before the
   first line exists — so putting it on the second shelf would guarantee it was
   never read. **The disciplines are duals, and their filing is asymmetric for the
   same reason their direction is.** This is a recognition, and it generalises far
   past this repo: every onboarding doc, style guide and "engineering principles"
   page is a filing decision disguised as a writing decision.
2. **The two disciplines are one commitment seen from two sides.** *"Constraint
   engineering is failure engineering done before the failure; failure engineering
   is constraint engineering done after it."* Most writing treats "make illegal
   states unrepresentable" and "postmortem → guardrail" as unrelated practices from
   unrelated traditions. They climb the same three rungs; only the starting point
   differs — a principle you hold, or a failure that happened.
3. **A `cannot` you cannot derive is a convention wearing a wall's clothes.** This
   is the falsifiability test for your own constraints, and it is the half almost
   everyone skips. *The discipline is the derivation, not the `no`.* Anyone can add
   a rule; the question is whether the prohibition follows from what the thing *is*.
   If it does not, it will rot — and it will rot while looking exactly like a wall.
4. **A constraint is a gift to the caller.** *"When the only path is the right one,
   the wrong one is not there."* The grimoire identifies this with the Good-UX
   question — "one act seen from two sides." Constraint is usually sold as safety
   and experienced as friction; this inverts it, and the inversion is the honest
   reading.
5. **A vocabulary is a type system for prose.** The trial found one word used two
   ways, and the fix was not "use it carefully" — it was reserving the word for one
   act at every site, then making the taxonomy *complete by construction* with a
   declared kind for the exception. The ladder applies to language, and the top rung
   there is "the ambiguity has no place to live."
6. **The first draft of the paragraph about structural honesty was itself
   dishonest** — it pointed at a document that did not contain what the pointer
   promised — and only a perimeter pass, cast last on purpose, caught it. The
   general form: *the document that states a discipline is not exempt from it, and
   is unusually likely to violate it, because writing the principle feels like
   satisfying it.*
7. **A certificate is a claim with a date on it.** The ledger says so in its own
   header — *"the green check is not the bar; the disposition is"* — and then this
   unit's own row was struck two months later by a gate that had not existed when
   the row was written. Nothing was falsified; the vouched file simply moved. **A
   record that predicts its own expiry, and then expires, is worth more than one
   that claims permanence.**
8. **The practice climbed its own ladder, slowly, in public.** Trial-by-combat in
   June: a habit plus a ledger row. In August: a build gate. In September: a written
   contributor step — that *still names what it cannot see* (a spell with no row at
   all). Three rungs over three months, with the shortfall stated at each one. That
   is what "say so, and hold the highest rung you reached" looks like when it is
   actually practised rather than quoted.

**Does not hold up without the log** (evidence, not argument): the round counts
(3/3/6), the L1/L2 tallies, the commit ordering, the manifest hashes, the exact
line-diff sizes. Useful as proof; not the point.

---

## 12. Open questions and gaps

1. **The six rounds have no transcript.** The ledger row is the only record of the
   `8cb9d0a` combat. No per-ward report, no round-by-round diff, nothing in
   `docs/`. If the builder has the session transcripts, one real round-1 finding
   quoted at length would be worth more than any paraphrase I can offer. **Ask.**
2. **`7f7cea0`'s body is empty.** The partire publish carries a stamp and nothing
   else. Everything about that trial comes from the ledger. If the post narrates
   partire, it must attribute to the ledger, not to git.
3. **I did not run anything.** No `npm run check:docs`, no `ledger:check`, no
   `ship`. Every gate behaviour above is read from `package.json`,
   `CONTRIBUTING.md` and `scripts/check-warding-ledger.mjs` — not observed. The
   repo was treated as read-only. If the post claims a gate *fails* on drift, it is
   quoting the script's own comment and should say so.
4. **The `### Runes` section that struck the row is a separate story.** The strike
   note says it *"shipped three successive false universals before converging."*
   That is a different unit (the `experiri` landing, 2026-08-28) and I did not
   ground it. Do not narrate it here — cite the strike, name the cause in the
   ledger's own words, and stop.
5. **The sibling npm-package repo was not read.** `github.com/watmin/datamancy`
   holds `CONTRACT.md` and `RECOVERY.md`, both linked from `CONTRIBUTING.md` and
   neither present here. `RECOVERY.md` is a recovery file — by principle 6 of the
   ethos it is exactly the artifact that would carry the builder's own words. **If
   the quotation obligation matters to this post, that is the one place left to
   look**, and I could not reach it.
6. **The `e30125b` precedent (2026-06-18, one week earlier)** — *"kill the
   `/grimoire/<name>/` 404 trap in the casting path"* — is a fourth ladder instance
   sitting just outside the window: a path convention that 404'd, fixed by writing
   the negative case into the index prose. I read the subject line only, not the
   diff. Worth ten minutes if the post wants a fourth column in §7's table.
7. **Slug.** Used `ars-culta-001-the-ethos` as given. Series placement, title and
   song are the builder's.
