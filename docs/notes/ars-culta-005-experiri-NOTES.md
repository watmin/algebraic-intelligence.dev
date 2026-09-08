# Working notes — Ars Culta, week of 2026-08-24 → 2026-08-30 (`experiri`)

**Status:** raw notes, not a draft. Someone else writes the post.
**Placement:** Ars Culta (the console — grimoire, tooling, record). Slot number is
the builder's call. **Title and song-drop are the builder's calls — I have chosen
neither and no working title below should be read as a proposal.**
**Written:** 2026-09-07, backfilling the ~11-week gap.

**Scope check (STOP trigger 1) — PASSED.** `git log --all --since=2026-08-24
--until=2026-08-31` in `datamancy.dev` returns exactly two commits, both on
2026-08-28, both author-dated and committer-dated `2026-08-28 14:31:34 -0700` and
`14:32:41 -0700`:

- `1db0ada` — *publish 2026-08-28T21-31-32Z — mint experiri — the executing ward*
  (25 files, +1465 / −55)
- `ebf6148` — *ledger: experiri warded — 17 rounds, 0 un-dispositioned*
  (1 file, +1)

Nothing else landed in the window. The week is genuinely one publish and one
ledger row — but the publish is 1465 lines and the ledger row is 1 line of ~1200
words, so "thin" is the wrong read. See §5.

---

## 1. The hook / through-line

**The grimoire minted its first ward that does not read — it runs.** Every other
spell in the book answers an observational question by looking at a file.
`experiri` exists for the one class no reader can reach: *the spec and the code
agree, and they are jointly wrong* — a surface the system advertises that nothing
can actually drive. Its evidence is an event, not a source. And because an
executing auditor fails in the **opposite direction** from a reading one — a
broken reader finds nothing and nothing reads as clean, a broken driver finds a
jackpot and a jackpot reads as a discovery — the whole page is organised around
refusing to believe itself: a mandatory calibration, a three-population census
that has to add up, and a `VERDICT:` line that may only claim what was actually
driven.

The week's second move is the same discipline turned on the console itself. The
publish that shipped the executing ward also shipped the gate that stops the
project's own warding ledger from vouching for files that changed after their
stamp — and that gate's **first act was to strike two of the ledger's own rows**,
one of which this very commit had just invalidated.

---

## 2. The story beats, in order

### Beat 1 — the failure class, named from a real corpse

`experiri/SKILL.md:31-39` (as shipped, commit `1db0ada`) states the case that
earned the spell. Quoting the shipped page verbatim:

> The worked case that earned this spell: a constructor row in a rules engine's
> operator table. It was declared in the table; the query fence admitted it; the
> type-checker typed it; the purity analysis approved it; the naming rule derived
> its name; the totality gate passed it. **Source and spec agreed completely — and
> both were wrong together**, because the table advertised a surface the executor
> had no implementation arm for. Every reading ward correctly reported harmony.
> The full guard (`vigilia`, the meta-spell that musters the inward set) converged
> **twice** on that subsystem — two consecutive recasts returning zero findings at
> either severity … while six such rows sat in it.

And the sentence the whole ward hangs on:

> **A reading cannot see an execution defect. A count cannot see a value defect; a
> list is only a claim; a declaration is only a promise.**

Then the twist that makes a corpus useless as an instrument here:

> And a corpus cannot stand in for the run. A corpus records what **compiled**, so
> it is structurally blind to what cannot be written. Three of those six broken
> rows appeared nowhere in a 1569-file corpus. That reads like neglect; it *was
> the symptom*.

*(Cross-ref for the writer: this is the same lesson recorded in this repo's own
memory index as* "Optimize for the EXPRESSIVITY SURFACE, not your corpus" *— but
that is a lead, not a citation. The 1569-file number is from the shipped spell
page.)*

### Beat 2 — the three properties, and the unit

`experiri/SKILL.md`, *The three properties that define the cast*:

1. **It EXECUTES.** "The only ward that must. Its evidence is a program that ran,
   never a file that parsed."
2. **It SYNTHESIZES its own callers.** "It may not sample the existing corpus,
   because the corpus is precisely the blind spot — it contains only what already
   worked."
3. **Its unit is (declaration × position)**, never the declaration alone.

The (declaration × position) grid is the intellectual core and the most portable
idea on the page. The worked asymmetry, verbatim:

> In the worked case one operator was reachable inside a fenced expression and
> refused as an inline constraint — same operator, same field, same comparison,
> two different answers. A ward that asked once per declaration must pick one, and
> either choice is a lie about half the surface.

The page carries a translation table (operator table → grammar productions;
serializer registry → write path and read path; HTTP route table → methods ×
content-types; plugin registry → lifecycle hooks; opcode table → operand shapes),
and the generalising question: **"what does the system's own admission rule vary
over, once the declaration is fixed?"**

The serializer row is the cheapest example for a lay reader: a type registered for
write and read is *one cell green and one cell dead* if it constructs and never
decodes — and no reading ward can see it, because construction and access are
declared in different places and neither contradicts the other.

### Beat 3 — the inversion, and why calibration is mandatory

`experiri/SKILL.md`, *The failure modes of an executing ward* — flagged on the
page itself as "the most important thing the spell has to teach":

> **A broken reader finds NOTHING; a broken driver finds a JACKPOT.** A filter
> matching no pattern reports an empty list, and empty reads as clean. But one
> mis-rendered position reports an entire *column* of refusals that looks exactly
> like a discovery — and this ward's findings are meant to be believed. The failure
> mode is a **false triumph**, which is the expensive direction.

Hence the hard requirement: **at least two pinned cells and four drives — two
expected-fire and two expected-refuse**, run before any real cell. The reason the
mix is non-negotiable is stated plainly and is a good line for the post:

> A driver that renders nothing passes an all-refuse control; a driver that never
> applies its constraint passes an all-fire control. Only a mixed control can fail
> in both directions.

And a failed calibration is not a do-over you can hide: "a cast you abandon before
reporting is not a cast, and the repaired run is the one you file… A cast without
a passing calibration is not evidence; it is a rumour with a table."

### Beat 4 — the census that has to add up

The report format is a three-population arithmetic, and the page says "the
arithmetic is the point." Illustrative shape from `experiri/SKILL.md`:

```
CALIBRATION: PASSED (2 cells, 4 drives)
COVERAGE: driven fenced-expression, inline-constraint | not driven aggregate-clause (no loader for that production) | untestable — | unadjudicated —
CELLS IN GRID:   120 = attempted 118 | exempt 2 (platform-gated 1, driver-limit 1) | never reached 0
ATTEMPTED:       118 = drove-and-discriminated 101 | unreachable 12 | inert 5 | driver defects 0
FINDINGS:         17 = unreachable 12 (L1) + inert 5 (L2)
DECLARATIONS: asymmetric 3   COST: 41s wall-clock, sharded 6 ways
VERDICT: the declared surface is NOT fully reachable
```

The gate on the verdict line is the honesty mechanism: *fully reachable* may be
claimed only when every cell was driven and classified **and** the `COVERAGE:`
line's *not driven*, *untestable* and *unadjudicated* slots are all empty, with
`exempt`, `never reached` and `driver defects` all 0. The page's own summary of
the standard:

> The test is not *did I find nothing* — it is *did every cell answer for itself*.

Also load-bearing and worth quoting: **a cast that cannot finish files a
cast-level Level 1 finding**, because otherwise "a findings-free row renders as
converged, and *a filter matching no pattern reports an empty list, and empty
reads as clean* is this ward's own diagnosis. **It applies to the ward.**"

### Beat 5 — the trial: 17 rounds, and 17 is an outlier

The ledger row (`docs/WARDING-LEDGER.md:20`, landed in `ebf6148`), verbatim in
part:

> `experiri/SKILL.md` (new spell — admission trial by combat) | `2026-08-28T21-32-27Z` |
> full applicable `vigilia` (docs-kind: `nesciens` + `cohaerere` + `exigere`,
> `circumspicere` last), fetched by value from the signed manifest, fresh
> subagents, **17 combat rounds**; `intueri` cast on the name per CONTRIBUTING;
> `nesciens` run with a blind sub-reader that **drove a real target every round** |
> **0 un-dispositioned.**

**Is 17 unusual? Yes — it is the highest in the ledger by ~3x.** Round counts from
every row I read in `docs/WARDING-LEDGER.md`:

| target | rounds | row |
|---|---|---|
| `cohaerere/SKILL.md` | 3 | line 18, stamped `2026-06-26T21-30-56Z` |
| `partire/SKILL.md` | 3 | line 19, stamped `2026-06-27T23-31-55Z` |
| `grimoire/SKILL.md` + `extirpare/SKILL.md` | 6 | struck row, stamped `2026-06-30T07-19-10Z` |
| `scripts/lib/spells.mjs` + `generate-vigilia-skill.mjs` | ×3 (full vigilia) | struck row, stamped `2026-06-05T11-18-37Z` |
| **`experiri/SKILL.md`** | **17** | line 20, stamped `2026-08-28T21-32-27Z` |
| `peragrare/SKILL.md` *(later, out of window — context only)* | 4 inward + 4 `circumspicere` + 1 narrow | line 22, stamped `2026-09-08T02-54-23Z` |

What the ledger says the 17 rounds *produced* — note that every one is a
**subtraction or a reversal**, not an addition:

> The trial changed the spell structurally: a `misdelivered` verdict was minted and
> **reversed** (it contradicted the ward's own agreement-jointly-wrong identity);
> the reporting section was cut 161→39 lines; the refusal fork was rewritten from
> an enumeration into a discriminator after each new surface added an arm.

`exigere` ran **0/0 ×16** — and the row records that the instrument "caught its own
blind spot three times and repaired before reporting."

### Beat 6 — the row that says the surface does not close

This is, to my reading, the single most unusual thing in the week. The ledger row
does not claim closure; it explicitly refuses to:

> **Bounded, and stated because it is true:** this is the only ward whose readers
> can *execute* it, so its test surface does not close — **eight target classes
> produced eight distinct finding sets**, and a ninth is expected to find more.

And the wild-verification clause, which is the row's only named external target:

> Verified in the wild: a blind reader found reproducible (declaration × position)
> asymmetries in CPython's `argparse` action registry (`parsers` reachable from
> `add_subparsers`, `TypeError` from `add_argument`), independently reproduced.

A warding row that means "converged on the surfaces driven", not "closed", is a
different kind of claim from every other row in the table — all of which converge.

### Beat 7 — the guard, and what class it pulls out of the ground

`scripts/check-warding-ledger.mjs` was **created** in `1db0ada` (126 lines). Its
own header names the class, verbatim (lines 9-13 as shipped):

> Nothing enforced that. A row could vouch for a file that had changed a dozen
> commits ago and the build stayed green — which is the exact failure mode the
> ledger's own header says it exists to avoid ("a stamp comment can go false while
> the build stays green"). **The ledger was the last claim in this repo held by
> vigilance alone.**

**The class it makes impossible:** *a proof-of-work record that silently outlives
the thing it proved.* The ledger's own rule (`docs/WARDING-LEDGER.md`, *Re-proving
a row*) already said "A row holds only as long as a fresh `vigilia` cast still
measures it warded" — and nothing checked it. Climbing `extirpare`'s ladder: the
rule was a **convention**; this commit makes it a **check that fires at build
time**. It does not reach the top rung (a shape the mistake cannot take) and the
script does not pretend otherwise.

Three design details worth the post, all in the shipped file:

- **Struck rows are excluded on purpose** (lines 24-26): *"a struck row is
  explicitly not a claim, so gating it would make the honest disposition
  impossible to record."* The gate is built so that the honest way out stays
  available.
- **A row that fails to parse refuses the whole run** (lines 49-64), with the
  reason stated in the source: *"a filter that matches no pattern reports an empty
  list, and empty reads as clean."* That is the same sentence `experiri` uses about
  itself, applied to the gate — the two artifacts were written under one idea.
- **Two distinct git failures are told apart** (lines 79-91): *"git exits 1 for
  'path changed' and 128 for 'bad revision'. A bare catch folds them together and
  reports a change against a ref git never resolved — which is what a shallow CI
  clone (fetch-depth 1) produces for every stamped commit."* This is a gate that
  was caught **fabricating a diagnosis** and fixed to refuse instead of guess.
  Its paired change is in the same commit: `.github/workflows/check-docs.yml`
  gained `fetch-depth: 0` with the comment *"the warding-ledger gate resolves each
  row's stamp commit; a depth-1 clone cannot see them and the gate refuses to
  guess."*

**Wiring** (also `1db0ada`): `package.json` gained `"ledger:check"`, prepended it
to `check:docs`, and `scripts/publish.mjs` gained an explicit call before
`docs:regen` — with the reason in the source: *"The ledger gate is in check:docs,
and publish runs docs:regen — so without this line ship would sign and push, and
CI would red main afterwards."*

**Writer's note — do not describe the guard as it exists today.** The version at
HEAD is materially different (it uses `execFileSync`, and it replaced the
extension-sniffing path filter with a disk-resolution discriminator plus a
`dropped` refusal, and it prints both failure lists before exiting). Those changes
came from the *later* excusare/peragrare weeks, not this one. `git show
1db0ada:scripts/check-warding-ledger.mjs` is the week's artifact.

### Beat 8 — the guard's first act was to strike its author's own rows

`1db0ada` added a **`## Struck rows`** section to `docs/WARDING-LEDGER.md` and
moved two previously-live rows into it, verbatim:

> - **`scripts/lib/spells.mjs`, `scripts/generate-vigilia-skill.mjs`** — struck
>   `2026-08-28`. Stamped `2026-06-05T11-18-37Z` (`0da95bb`). `spells.mjs` gained
>   the frontmatter name-vs-directory gate during the `experiri` landing;
>   `generate-vigilia-skill.mjs` changed at `af00e81`.
> - **`grimoire/SKILL.md` + `scripts/generate-grimoire-skill.mjs`,
>   `extirpare/SKILL.md`** — struck `2026-08-28`. Stamped `2026-06-30T07-19-10Z`
>   (`8cb9d0a`). The index gained a `### Runes` section during the `experiri`
>   landing — **and that section shipped three successive false universals before
>   converging, which is precisely why the row could not stand.**

Both rows were invalidated *by this same commit*. The gate that enforces the
ledger's honesty rule cost its author two of the three warded claims he had.

The struck rows are kept **verbatim under a `<details>` block** rather than
deleted — history preserved, claim withdrawn.

### Beat 9 — the fossil in the blob store

**A hard, physical artifact of a repair that was itself wrong.** The publish
commit added four content-addressed blobs to `blobs/sha256/` (which
`scripts/generate-manifest.mjs:22-27` documents as *"immutable content,
append-only"*). Three are referenced by the signed manifest: `3d49e26…`
(`experiri/SKILL.md`), `d34b7c9…` (the new `grimoire/SKILL.md`), `3bd57a2…` (the
new `vigilia/SKILL.md`).

The fourth, `blobs/sha256/957c3ac7209a0de4e8e2b30aa7d432e4621097590fdfb69a8496fe1132913a7f`,
**is referenced by no manifest in the repository.** I checked every manifest under
`manifests/*/manifest.json` plus `.well-known/mcp/manifest.json`: 122 blobs on
disk, 121 referenced, **exactly one orphan — this one, added in this commit.**

`diff` against the published grimoire shows it differs in exactly two places:

1. Its `### Runes` paragraph asserts a rune is *"an inline marker placed in the
   substrate under audit"* — full stop. The published version reads: *"It is
   placed in the substrate under audit, **or, where a ward says so, declared in the
   cast when that substrate is not yours to edit.**"*
2. It is missing the *"**One ward is not a scan:** `experiri` **executes** the
   surface it audits…"* paragraph entirely.

Defect (1) is a **false universal that `experiri` itself falsifies** — the shipped
spell's own `## The rune` section requires exactly the case the orphan's sentence
forbids: *"A rune you cannot place is still a judgment you must record. … When the
roster is not yours to edit — a stdlib, a vendored dependency, a generated table —
declare the exemption **in the cast** instead."*

**Grounded:** the orphan exists, it is unreferenced, it landed in `1db0ada`, and
its two diffs are exactly as stated.
**Inference (label it as such in the post):** that it is the residue of a publish
attempt hashed by `generate-manifest` and then superseded before the manifest was
signed. `generate-manifest.mjs` is the only thing in the repo documented as
writing blobs, so a blob with no manifest is the shape a stopped publish leaves —
but I did not find a log entry proving a specific aborted run.

This is the ledger's *"three successive false universals"* line, made physical. It
is the best single image in the week.

### Beat 10 — what minting the spell forced elsewhere (the ripple)

Every one of these is in `1db0ada`; each answers "why did file X change?"

- **`grimoire/SKILL.md`** gained two things. A brand-new `### Runes — the mark the
  audited thing leaves` section, because until now the rune convention lived only
  in per-spell pages and the README, and `experiri`'s rune needed a second
  positional (a position qualifier) the index had never described. And a safety
  line placed in the *casting* instructions, ahead of everything else: *"**One ward
  is not a scan:** `experiri` **executes** the surface it audits — a synthesized
  caller is a real call — so cast it only against a target whose side effects you
  can undo. Every other ward only reads."* Both are generated — the same strings
  are in `scripts/generate-grimoire-skill.mjs`, so the index cannot drift from
  them.
- **`vigilia/SKILL.md`** gained `experiri` as a **conditional** code ward, in three
  places (the table row, the prose list, the generated selection rule). Its trigger
  is a conjunction and the second half is the interesting one: *"a target that
  DECLARES a surface it claims is callable … **AND can be loaded and driven in the
  caster's own process without irreversible effect** — a disposable instance, a
  rolled-back transaction, or a fixture."* The watch had never before had to gate a
  ward on *whether running it is safe*.
- **`README.md`** — the global rune paragraph was rewritten. Old: *"When a spell
  encounters its rune, it skips the site and records the exemption in its report.
  Runes suppress the finding without denying its presence."* New: *"…it records the
  exemption in its report, with its reason. Whether the spell then honours the rune
  on sight or **adjudicates** the reason — and fails the rune if it does not hold —
  is that spell's own rule."* `experiri` adjudicates; the README's universal was
  false the moment it shipped. The README also gained the "One ward is not a scan"
  warning **directly under the line that advertises every cast as a "mechanical
  scan"** — i.e. the doc that sold the whole practice as read-only had to be
  amended.
- **`scripts/lib/spells.mjs`** gained **two build gates**, both with the same
  confession in the comment — *"They matched by inspection until this line
  existed."* / *"That universal has shipped false three times; it matched by
  inspection until this line existed."*
  - a `## The rune` section is now **required** in every non-primer spell, because
    the grimoire index now tells readers a ward's rune rules live there — *"a ward
    without one makes the index's claim false"*;
  - frontmatter `name` must equal the directory name, because *"they travel down
    different pipes and only meet at the consumer… a mismatch ships a SIGNED
    manifest whose catalog advertises a spell that 404s, and nothing downstream
    would notice: each pipe is internally consistent."*

That second gate is the sharpest constraint-engineering move of the week: a
signed-but-unfetchable catalog entry is now a red build rather than a thing nobody
would notice.

### Beat 11 — the publish, and what it chained to

Read from `manifests/510bcd9e…/manifest.json`, its `.sig.txt`, and
`.well-known/mcp/server-card.json` at `1db0ada`. Not described in general terms —
these are the actual values:

- **Version:** `2026-08-28T21-31-32Z`. **`serverInfo.commit`: `af00e81`** — the
  *previous* commit, because the manifest is generated before the publish commit
  that carries it exists. **`epoch`: `1787952692`.**
- **Head:** `sha256:510bcd9e9bd9e9df2991dcfc8924221b259a2b726590f7c956ed7715c11911bd`.
  I verified the directory name **is** the SHA-256 of the manifest bytes it
  contains — the snapshot is self-certifying by path.
- **`previous`:** `sha256:2cdeab2dab8ea38be3f61396ea07c1878631a9b24d69df9a2ea95f87f17049bc`.
  I resolved it: that manifest's `serverInfo` is
  `{"name":"datamancy.dev","version":"2026-08-23T04-09-58Z","commit":"19934aa"}`,
  it holds **28** resources, and `has experiri: False`. It shipped in commit
  `af00e81` — *"publish 2026-08-23T04-09-58Z — grimoire + vigilia: embedding is the
  fallback when workers cannot reach the MCP."* It chains onward to
  `sha256:7e5b3fca…`.
- **Resource count 28 → 29** (`server-card.json` `x-resource-count`), the one new
  entry being `experiri` → `blobs/sha256/3d49e26…`, `size: 40487`.
- **Signature** (`manifest.json.sig.txt`, verbatim header): *"ECDSA P-256 /
  SHA-256 detached signature over /.well-known/mcp/manifest.json (raw DER at
  manifest.json.sig). The `npx datamancy` adapter pins the public key and verifies
  this on every fetch."* DER base64:
  `MEUCIQDC1nVixR0ia6azWJoHeOUk/v2lGt+Dwe+87O8U3/eZKwIgC7CECZ2qMeDljIrzyhVrGXiyi2b0xdFs4ITytU318LQ=`
- **Snapshot integrity, checked not assumed:** `.well-known/mcp/manifest.json` and
  `manifests/510bcd9e…/manifest.json` at `1db0ada` are **byte-identical** (both
  hash `510bcd9e…`), and their `.sig` files are byte-identical too (both
  `0c7702f7…`).

**The chain has a nice shape for the writer:** the publish that shipped the ward
whose whole subject is *"the worker must actually be able to run what the index
promises"* chains directly to the publish whose subject was *"embedding is the
fallback when workers cannot reach the MCP"* — i.e. the immediately-previous link
in the signed chain is the one about a worker that cannot reach the thing it was
told to fetch. That is a real hash relation in the file, not a metaphor. Whether
it is worth making anything of is a judgment call; I note it because 008-002 used
exactly this move and the builder liked it.

### Beat 12 — the two commits are two commits for a structural reason

Worth one sentence in the post because it is a nice small proof that the loop is
closed. The ledger row cites commit `1db0ada` as the commit that landed the fixes.
`scripts/publish.mjs` now runs `ledger:check` *inside* `ship`. So the row cannot
live in the publish commit — it must cite a commit that does not exist until the
publish commit is made. Two commits, 67 seconds apart (`14:31:34` → `14:32:41`),
is the shape the gate forces.

---

## 3. Live-vs-shipped check (asked for explicitly; established, not assumed)

I fetched `experiri` through the datamancy MCP and compared it against the shipped
file.

- `sha256sum experiri/SKILL.md` on disk = `3d49e26025c482901b5fe590c701f72082555aa3659f575b1c5894dfa71df3d1`,
  272 lines, 40487 bytes.
- `git log -- experiri/SKILL.md` returns **exactly one commit, `1db0ada`** — the
  file has not been touched since it shipped.
- The manifest snapshot from that publish lists `experiri` at sha256
  `3d49e26…`, size `40487`.
- The **current** `.well-known/mcp/manifest.json` (now at 30 resources, version
  `2026-09-08T02-52-58Z`) **still lists `experiri` at `3d49e26…`, size `40487`.**

**Verdict: no difference. The bytes served today are the bytes minted that week.**
That is not true of its neighbours — `grimoire/SKILL.md` has changed since (the
live copy carries `DATAMANCY_PIN` freshness language the 2026-08-28 version does
not), so if the writer quotes the grimoire, quote `git show
1db0ada:grimoire/SKILL.md`, not the live fetch.

---

## 4. Verbatim builder quotes

**In the two commits and every file they touch: there are none.** I looked in:
both commit messages (`git show 1db0ada`, `git show ebf6148` — the second has a
substantive body, but it is authored prose in the project voice, not an exchange);
`docs/WARDING-LEDGER.md`; `experiri/SKILL.md`; `grimoire/SKILL.md`;
`vigilia/SKILL.md`; `README.md`; `CONTRIBUTING.md`; `scripts/*.mjs`. The one
quotation-shaped thing in the repo from an earlier arc is the builder's *"encode
in the grimoire"* directive, cited inside the **struck** grimoire row — that is
June's row, not this week's, and it is a paraphrase in a table cell.

**Two verbatim builder lines exist, but only in the session memory, not in the
repository.** Per the standing rule I am reporting them with their location and
flagging them as un-corroborated:

1. `/home/watmin/.claude/projects/-home-watmin-work-holon/memory/feedback_the_fix_holds_the_sentence_explaining_it_is_false.md:39`
   — attributed to the builder, dated 2026-08-28, minting `experiri`:
   > *"the final run is always the full run again, all spells return zero L1 and zero L2."*

   Context in that file: the session had been re-casting only the ward that kept
   failing and reading "every finding is in my previous repair" as convergence.
   This line is what forced the full simultaneous re-cast. **It is the bar that
   produced the 17 rounds** — if the writer wants one builder line, this is the one,
   and it must be attributed as "from the session record", not "from the commit".

2. Same file, line 10 — the framing under which the whole trial ran:
   > *"trial by combat — the grimoire asserts if the addition is worthy."*

   **Partially corroborated:** the phrase "trial by combat" appears in this week's
   ledger row and in the June rows, so the *practice* predates the week. But the
   sentence as quoted is memory-only. Note also that `CONTRIBUTING.md`'s explicit
   *"Ward it before it ships — trial by combat"* rule was **not** written this week
   — `git log -- CONTRIBUTING.md` shows that paragraph landed at `2ce6dd5`
   (2026-09-08). Do not cite CONTRIBUTING rule 5 as this week's doctrine.

3. A third quotation in memory is attributed to a **ward**, not the builder —
   `project_datamancy_two_spells_shipped.md:24`, `nesciens` refusing to predict
   convergence: *"a ninth target class will probably find a fifth thing."* The
   ledger's own, grounded paraphrase is *"a ninth is expected to find more."* Use
   the ledger's wording unless the builder confirms the quote.

**Consequence for the post (consonare rule 11):** the week's *repository* record
is genuinely solo — the builder appears in it only as `Author:
watministrator <john@shields.wtf>` and in the `Co-Authored-By` trailer. If the
post is written from the commits alone it will read as a solo substrate-report and
fail the voice ward. The builder's presence has to come from quote (1), which
means the writer should **confirm it with the builder before publishing**, since
its only source is my own session note.

---

## 5. The substance test, run by me

*Strip every hash, date, file path and cross-link from this post. What recognition
or mechanism is left?*

**Verdict: it survives, comfortably. This is not a thin week.** Five things remain
when the metadata is gone, and none of them is in `git log`:

1. **A failure class with a name and a corpse.** *The spec and the code agree and
   are jointly wrong.* Every reading instrument correctly reports harmony; the full
   guard converged **twice** on a subsystem holding six broken rows. Any engineer
   who has watched a green suite sit on top of a dead feature recognises this
   instantly, and most have no name for it.
2. **A mechanism: (declaration × position).** The insight that reachability is not
   a property of the thing declared but of the *pair* — a type green on write and
   dead on read; an operator that fires fenced and refuses inline — with a
   generalising question anyone can apply to their own registry: *what does the
   system's own admission rule vary over, once the declaration is fixed?* This
   transfers to route tables, plugin registries, codecs, opcode tables. It is
   portable engineering, not project lore.
3. **The inversion, which is genuinely counter-intuitive.** *A broken reader finds
   nothing; a broken driver finds a jackpot.* Therefore an executing audit must be
   calibrated against known-answer cells in **both** directions before it is
   believed, because an all-refuse control and an all-fire control each pass a
   different broken driver. This is the reason the ward is 40KB instead of 4KB, and
   it is the reason a reader should trust its output.
4. **A record that refuses to claim closure.** The proof row says, in the ledger,
   that the test surface **does not close** — eight target classes, eight distinct
   finding sets, a ninth expected to find more. Every other row in that table
   converges. A discipline that writes down "this one didn't finish and here is
   what that means" is the recognition-carrying moment.
5. **The recursion, which is the week's best image.** The commit that shipped the
   executing ward also shipped the gate enforcing the ledger's re-prove rule — and
   that gate immediately struck two of the three rows the ledger held, one of them
   invalidated by that same commit. Meanwhile the append-only blob store kept a
   fossil: a version of the index whose new paragraph about runes stated a
   universal the new ward itself falsifies. The tool built to catch promises the
   system cannot keep caught its own author, twice, on the day it was built.

**Where the post is at risk of thinness:** the *code volume* is small — one 126-line
script, two ~15-line validator gates, four one-line index insertions. If the writer
frames this as "what shipped", it is a short post. The material is in the
*discipline* and the *self-application*, exactly as 008-002 was. Frame it that way.

**One honest deflation to keep:** the guard climbs `extirpare`'s ladder from
convention to *check*, not to *unrepresentable*, and `CONTRIBUTING.md` (in its
later revision) says so outright: the gate *"cannot see a spell that has no row at
all, so this step is held by discipline and by this paragraph, not by the build."*
Do not let the post imply the class was annihilated. It was raised one rung, and
the remaining hole is documented.

---

## 6. Open questions and gaps

**Discrepancies between memory and repository (STOP trigger 3 — both readings
reported, neither picked):**

1. **The date.** `project_datamancy_two_spells_shipped.md:16` states *"Both landed
   on 2026-09-07"* and lists `1db0ada` + `ebf6148` among them. **Git says
   otherwise:** both commits are author-dated *and* committer-dated **2026-08-28**
   (`14:31:34` and `14:32:41`, `-0700`), and the manifest version is
   `2026-08-28T21-31-32Z`. The memory's own table gives experiri's version as
   `2026-08-28T21-31-32Z`, so the memory is internally inconsistent. Most likely
   reading: the memory was written on 2026-09-07 (when `excusare` shipped) and its
   opening sentence over-generalised to both. **I have used the git dates
   throughout.** The week 2026-08-24 → 2026-08-30 is correct for this front.

2. **The eight target classes.** The ledger row grounds *"eight target classes
   produced eight distinct finding sets"* and names exactly one — CPython's
   `argparse`. The memory
   (`project_datamancy_two_spells_shipped.md`) names all eight: *a rules engine,
   CPython codecs, `hashlib`, this repo's middleware, FastAPI routes, `argparse`,
   jinja2 filters, `struct`.* **Seven of those eight appear nowhere in
   `datamancy.dev`.** The list is plausible and I have no reason to doubt it, but it
   is uncited. **If the post wants the list, the builder must confirm it** — or the
   post says "eight target classes" and names only `argparse`, which is what the
   signed record supports.

3. **"circumspicere blocked three publishes."** The memory claims this across the
   experiri *and* excusare landings. I can ground **three artifacts in `1db0ada`
   that match three of the four findings it names**: the shallow-clone fabricated
   diagnosis (the `git cat-file -e` guard + `fetch-depth: 0`), the README rune
   universal fixed only in the grimoire (the README paragraph rewrite), and every
   cast being advertised as a read-only "mechanical scan" (the "One ward is not a
   scan" line inserted under exactly that bullet). The fourth (`vigilatum`) belongs
   to the following week. **What I cannot ground is the count "three publishes"** —
   the orphan blob is hard evidence of *at least one* stopped publish, and no more.

**Things I could not establish, and what would settle each:**

4. **What the 17 rounds actually looked like.** The repo holds only the ledger's
   summary. No per-round reports, no cast transcripts, no `nesciens` output are
   committed anywhere in `datamancy.dev`. If the writer wants a beat-by-beat of the
   trial, it does not exist on disk — it would have to come from the session at
   `https://claude.ai/code/session_01DmSpHpSw8653LHbwefvXKd` (named in `ebf6148`'s
   trailer), which I did not open.

5. **The provenance of the orphan blob** — stated as an inference in Beat 9. What
   would settle it: any publish log, or a reflog/stash from that session. I found
   neither.

6. **The `experiri` prototype.** The spell page says the prototype drove *"77
   declarations × 2 positions = 154 cells … past its test runner's deliberate
   30-second kill, and sharded six ways"*, and that it *"lives in the project that
   commissioned this ward, not in this grimoire."* It is not in `datamancy.dev`.
   Given the 1569-file corpus and the rules-engine-over-a-typed-DSL description, the
   obvious candidate is `wat-rs` — but **I did not verify that and it must not be
   asserted in the post without a citation.** Settling it: locate the harness in the
   commissioning repo, which is a separate read.

7. **`vigilia`'s round count for experiri vs the ledger's `exigere` count.** The row
   says **17 combat rounds** and `exigere` **0/0 ×16`. The one-round gap is not
   explained anywhere I could find; it may simply be that round 1 predated `exigere`
   joining the cast. Low stakes — but if the post quotes both numbers, note that
   they differ by one rather than silently picking either.

**Builder decisions still open (do not pre-empt):** slot number within Ars Culta;
title; song-drop; whether to use the `previous`-link rhyme from Beat 11; whether
to lead with the ward or with the guard-that-struck-its-own-rows.

---

## 7. Mechanics for the drafter

- Chronicle prose must be warded with **`consonare`** (fresh, uncontexted subagent)
  before publish. Rule 11 (collaborator present) is the live risk here — see §4.
  Rule 12 (substance) I believe this survives — see §5.
- Every quotation in these notes is copied from a file I opened this session.
  Quotations from `grimoire/SKILL.md` must be taken from `git show
  1db0ada:grimoire/SKILL.md`, **not** the live MCP fetch — the live index has moved
  on. Quotations from `experiri/SKILL.md` may be taken from either; they are the
  same bytes (§3).
- Quotations from `scripts/check-warding-ledger.mjs` must be taken from `git show
  1db0ada:scripts/check-warding-ledger.mjs` — the working-tree version is two
  weeks of later repairs ahead (§ Beat 7, writer's note).
