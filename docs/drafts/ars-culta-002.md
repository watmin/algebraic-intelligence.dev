<!--
TITLE PROPOSALS (builder picks; frontmatter below carries a placeholder, not a choice)
  1. "A Declaration Is Only a Promise"
  2. "The Ward That Runs"
  3. "A Broken Driver Finds a Jackpot"
-->
---
title: "PROPOSAL — A Declaration Is Only a Promise"
description: "August 28, one publish and one ledger row: the grimoire mints its first ward that does not read but runs. experiri exists for the class no reading instrument can reach — the spec and the code agree and are jointly wrong. Its unit is (declaration × position), and because an executing auditor fails in the opposite direction from a reading one, the whole 40KB page is built to refuse to believe itself. The same commit shipped the gate enforcing the warding ledger's re-prove rule, and that gate's first act was to strike two of its author's own rows."
covers: 2026-08-28
written: 2026-09-07
backfill: true
sidebar:
  order: 2
---

<!-- rune:consonare(solo) — datamancy.dev carries no attributed builder quotes in this window (measured: 0, against 247 on main); the warding trial's exchanges are not in the corpus and the builder cannot ratify a memory-only line. The third-person substrate report is honest here, not an erasure. -->

Backfill: this covers 2026-08-28 and was written on 2026-09-07 from the two commits, the spell page as shipped, the warding ledger, the signed manifest snapshot, and the blob store — all still on disk. `git log --all --since=2026-08-24 --until=2026-08-31` in `datamancy.dev` returns exactly two commits, stamped that Friday afternoon 67 seconds apart: `1db0ada`, "publish 2026-08-28T21-31-32Z — mint experiri — the executing ward", 25 files and +1465/−55; and `ebf6148`, "ledger: experiri warded — 17 rounds, 0 un-dispositioned", one file and one line. Two commits reads thin. The publish is 1465 lines and the ledger row is roughly 1200 words in one table cell, so it is not.

Every spell in the grimoire before this one **reads**. That is the right instrument for almost every question the book asks — no program tells you whether a name lies, whether a document coheres, whether prose rings true. Those are observational questions and a reader answers them. On August 28 the grimoire minted the exception.

## The class that has no divergence in it (as shipped, `1db0ada`)

A reading ward finds a divergence: the spec says X, the code does Y, one of them is wrong. `conferre` is built for exactly that shape, and it is the shape most audits assume. `experiri` was minted for the case where there is nothing to disagree with. From the shipped page:

> The worked case that earned this spell: a constructor row in a rules engine's operator table. It was declared in the table; the query fence admitted it; the type-checker typed it; the purity analysis approved it; the naming rule derived its name; the totality gate passed it. **Source and spec agreed completely — and both were wrong together**, because the table advertised a surface the executor had no implementation arm for. Every reading ward correctly reported harmony.

Six gates, all green, and no implementation arm behind the row. Nothing reads as wrong because nothing is inconsistent — the implementation simply is not there, and no reader goes looking for an absence that nothing references. The page names the cost with a number: the full guard converged **twice** on that subsystem, two consecutive recasts returning zero findings at either severity, while six such rows sat in it.

The second half closes off the obvious workaround. If reading cannot see it, sample the corpus — find the call sites, check them. That instrument is worse than useless here:

> And a corpus cannot stand in for the run. A corpus records what **compiled**, so it is structurally blind to what cannot be written. Three of those six broken rows appeared nowhere in a 1569-file corpus. That reads like neglect; it *was the symptom*.

That inversion is why the ward's second defining property is that it **synthesizes its own callers** and may not sample the corpus: the corpus contains only what already worked, which is precisely the blind spot. The first property is that it executes — its evidence is a program that ran, never a file that parsed. The epigraph the whole page hangs on states the ceiling every other instrument in the book is under:

> A reading cannot see an execution defect. A count cannot see a value defect; a list is only a claim; a declaration is only a promise.

## The unit is (declaration × position), and that is the portable part

The third property is the one worth stealing. The unit of the audit is not the declaration; it is the pair.

A **position** is a distinct site the system's own admission rules let a declaration appear in, and the page separates two sets that get conflated everywhere. The **admissible** set is every site the system says yes to — a property of the system, discovered, not chosen. The **driven** set is the subset a given cast actually drives — chosen, declared by name, and it is the coverage. The grid is their product only where every declaration admits every position, and the sum of each declaration's own positions where they differ.

The derivation rule generalizes to any registry: **what does the system's own admission rule vary over, once the declaration is fixed?** The page carries the translation table — an operator table's positions are the grammar productions that admit an operator; a serializer's type registry has the write path and the read path; an HTTP route table has the methods the route declares crossed with the content-types it accepts; a plugin registry has the lifecycle hooks the plugin claims; an opcode table has the operand shapes and addressing modes. The rule is stated negatively too: derive the set by asking the system, never by sampling where callers happened to use it, or a guessed position set manufactures findings against positions the system never offered.

Why the pair and not the declaration alone: in the worked case one operator was reachable inside a fenced expression and refused as an inline constraint — same operator, same field, same comparison, two different answers. A ward that asks once per declaration must pick one, and either choice is a lie about half the surface.

The serializer row is the cheapest version of the same fact. For a registered `Money` type, the write cell's fire-drive encodes `Money(3,"GBP")` and expects bytes; its refuse-drive encodes `Money(3,None)`, which the registry declares invalid, and expects a rejection. The read cell is then driven **separately, on the bytes the write cell produced** — fire-drive decodes them back to what the declaration says it returns, refuse-drive decodes a truncated copy. Two cells, four drives, and the read cell's verdict is independent of the write cell's. That independence is the point: a type that constructs and never decodes is one cell green and one cell dead, and no reading ward can see it, because construction and access are declared in different places and neither contradicts the other.

Two synthesis rules keep the drives honest, and both decide whether the harness measures the system or itself. The refuse-drive must be derived from the fire-drive by a **single negation of an operand the declaration itself constrains** — never of the routing or the rendering that got you there. Arity is explicitly not an operand: negating the number of arguments measures your calling convention, not the cell. And the fire-drive's expected answer comes from the declaration, never from the artifact the position serves — a driver that compares what a route returned against the file that route serves is comparing a thing to itself, and is green by construction.

## The direction an executing auditor fails in

This is flagged on the page as the most important thing the spell has to teach, and it is why the file is 40KB instead of 4KB.

> **A broken reader finds NOTHING; a broken driver finds a JACKPOT.** A filter matching no pattern reports an empty list, and empty reads as clean. But one mis-rendered position reports an entire *column* of refusals that looks exactly like a discovery — and this ward's findings are meant to be believed. The failure mode is a **false triumph**, which is the expensive direction.

Everything structural follows from that. A **calibration is mandatory** — at least two cells whose behaviour is already known, driven to four outcomes, two expected-fire and two expected-refuse, before a single real cell is touched. The mix is not decoration: a driver that renders nothing passes an all-refuse control, and a driver that never applies its constraint passes an all-fire control. Only a mixed control can fail in both directions. A failed calibration is not a do-over you get to hide either — the cast may be repaired and restarted, but once reported, a failed calibration is a cast-level finding and stays one. A cast without a passing calibration is a rumour with a table.

The subtler machinery is the attribution fork, which exists because "it refused" is two different facts. The question is whether the refusal was caused by the system under audit or by the harness; what the refusal names is evidence for that, not the test. A refusal naming the thing under test is usually the system's; one naming something else is usually the harness's; one naming the thing under test because a precondition the declaration requires was never established is the harness's, and the rule is to establish it and drive again before filing. Then the case that breaks the naming heuristic, and it is the ward's own signature finding: a refusal raised by the **position's own machinery, downstream of a call that succeeded**. The declaration ran and returned, and the position could not carry the result. It names neither the declaration nor the harness — and filing it as a driver defect erases exactly the asymmetry the ward exists to find.

The mirror-image test is as specific. A cell that fires when it should refuse gets re-driven against a fixture the declaration should not match, moving the operand and never the rendering; if the answer does not change, the same negation is re-rendered by a different mechanism before anything is concluded, because a rendering fault can be invariant under every operand. Only a cell whose answer holds under both a changed operand and a changed rendering is `inert`.

## The census has to add up, and the verdict is gated on it

The report is three populations and an arithmetic, and the page says the arithmetic is the point:

```
CALIBRATION: PASSED (2 cells, 4 drives)
COVERAGE: driven fenced-expression, inline-constraint | not driven aggregate-clause (no loader for that production) | untestable — | unadjudicated —
CELLS IN GRID:   120 = attempted 118 | exempt 2 (platform-gated 1, driver-limit 1) | never reached 0
ATTEMPTED:       118 = drove-and-discriminated 101 | unreachable 12 | inert 5 | driver defects 0
FINDINGS:         17 = unreachable 12 (L1) + inert 5 (L2)
DECLARATIONS: asymmetric 3   COST: 41s wall-clock, sharded 6 ways
VERDICT: the declared surface is NOT fully reachable
```

Each boundary is load-bearing. A runed cell is `exempt` and deliberately **not** in `attempted` — the rune took it out before synthesis, and counting it as attempted would be the false triumph the ward refuses. A driver defect sits inside `attempted`, because it was tried and did answer, and is excluded from `FINDINGS`, because a driver defect is not a disposition: that cell has no verdict yet, and the column counts only defects still standing when the report is filed.

The `VERDICT:` line may claim `fully reachable` only when every cell was driven and classified **and** the coverage line's `not driven`, `untestable` and `unadjudicated` slots are all empty, with `exempt`, `never reached` and `driver defects` at zero. The standard the page states for itself: the test is not whether the cast found nothing, it is whether every cell answered for itself.

And the clause that makes the ward safe to muster inside the watch at all: a cast that cannot finish — failed calibration, no cell whose answer is known, a surface that dies mid-run, a roster that enumerates nothing — reports what it has and files the stop as one cast-level Level 1 finding. The reason is the ward's own diagnosis turned inward. A findings-free row renders as converged, and a filter matching no pattern reports an empty list. That applies to the ward.

## Seventeen rounds, and every one of them a subtraction (`ebf6148`, 14:32)

The ledger row is the second commit of the week. Its method cell records a full applicable `vigilia` in docs-kind — `nesciens`, `cohaerere`, `exigere`, with `circumspicere` last — fetched by value from the signed manifest, fresh subagents, **17 combat rounds**, `intueri` cast on the name, and `nesciens` run with a blind sub-reader that drove a real target every round.

Seventeen is an outlier by roughly three times. Every other admission trial in that ledger sits at three rounds (`cohaerere`, stamped 2026-06-26; `partire`, 2026-06-27) or six (the grimoire index plus `extirpare`, 2026-06-30). `exigere` ran 0/0 across 16 of them, and the row notes the instrument caught its own blind spot three times and repaired before reporting. The one-round gap between 17 and 16 is not explained anywhere on disk; most likely round one predates `exigere` joining the cast.

What seventeen rounds bought is the interesting part, because none of the three structural outcomes is an addition:

> a `misdelivered` verdict was minted and **reversed** (it contradicted the ward's own agreement-jointly-wrong identity); the reporting section was cut 161→39 lines; the refusal fork was rewritten from an enumeration into a discriminator after each new surface added an arm.

A verdict minted and then withdrawn because it contradicted the ward's own identity. A reporting section cut by three quarters. An enumeration that kept growing an arm per surface, replaced by the one-line attribution rule above. The trial's product was a smaller spell.

## The row that refuses to claim closure

Every other row in that ledger converges. This one, by its own wording, does not:

> **Bounded, and stated because it is true:** this is the only ward whose readers can *execute* it, so its test surface does not close — **eight target classes produced eight distinct finding sets**, and a ninth is expected to find more.

The signed record names exactly one of those eight: a blind reader found reproducible (declaration × position) asymmetries in CPython's `argparse` action registry — `parsers` reachable from `add_subparsers`, a `TypeError` from `add_argument` — independently reproduced. The other seven classes are not written down in `datamancy.dev`, so this post does not name them.

A proof-of-work row meaning "converged on the surfaces driven" rather than "closed" is a different kind of claim from every other row in the table, and it is a claim the ward's own arithmetic forced its author to make about the ward.

## The gate that struck two of its author's four rows

The same publish created `scripts/check-warding-ledger.mjs`, 126 lines. Its header names the class it pulls out, and names it against the ledger's own header:

> Nothing enforced that. A row could vouch for a file that had changed a dozen commits ago and the build stayed green — which is the exact failure mode the ledger's own header says it exists to avoid ("a stamp comment can go false while the build stays green"). The ledger was the last claim in this repo held by vigilance alone.

The class is a proof-of-work record that silently outlives the thing it proved. The ledger's own re-proving rule already said a row holds only as long as a fresh cast still measures it warded — and nothing checked it. On `extirpare`'s ladder that rule was a convention; this commit makes it a check that fires at build time. It does not reach the top rung, and the repo does not pretend it does: the gate cannot see a spell that has no row at all, so that step is still held by discipline.

Three details in the script are worth reading, because each is a place a gate could have quietly lied.

**Struck rows are excluded on purpose.** The parser slices the file at the `## Struck rows` heading and gates only what is above it, with the reason in the source: a struck row is explicitly not a claim, so gating it would make the honest disposition impossible to record. The gate is built so the honest way out stays available.

**A row that fails to parse refuses the whole run.** The live data rows are counted independently of the parse, and any mismatch exits 1 — with a comment that is the same sentence `experiri` uses about itself: "a filter that matches no pattern reports an empty list, and empty reads as clean." Two artifacts in one commit, written under one idea. There is related paranoia in the same parser: the commit token is scanned for from the right rather than read at a fixed index, because a row's Result prose can itself contain a `|`, which shifts every cell after it — and in this ledger the Result cells are thousand-word blobs full of pipes.

**Two git failures are told apart.** `git` exits 1 for "path changed" and 128 for "bad revision", and a bare catch folds them together and reports a change against a ref git never resolved — which is what a shallow CI clone produces for every stamped commit. So the script resolves the ref first with `git cat-file -e` and reports the two conditions separately, and the same commit adds `fetch-depth: 0` to the workflow with the reason in the YAML: the gate resolves each row's stamp commit, a depth-1 clone cannot see them, and it refuses to guess. That is a gate caught fabricating a diagnosis and repaired to refuse instead.

Then the gate ran. Going into `1db0ada` the ledger held four live rows. Two were moved into a new `## Struck rows` section by that same commit — `scripts/lib/spells.mjs` with `scripts/generate-vigilia-skill.mjs`, stamped 2026-06-05, and `grimoire/SKILL.md` with `extirpare/SKILL.md`, stamped 2026-06-30 — and both were invalidated by the very commit that shipped the gate. `spells.mjs` gained new gates during the landing; the grimoire index gained its Runes section, and the strike note says why that row could not stand: **that section shipped three successive false universals before converging.** The struck rows are kept verbatim under a `<details>` block rather than deleted — history preserved, claim withdrawn. Two rows survived. The third the ledger holds today is `experiri`'s own, written 67 seconds later.

## The fossil the append-only store kept

`scripts/generate-manifest.mjs` documents `blobs/sha256/` as immutable and append-only, and notes that re-running generate refreshes the latest pointer and the blobs while the immutable signed snapshot is written later, by `sign-manifest.mjs`. That layout has a consequence nobody designed for.

The publish added four blobs. Three are referenced by the signed manifest: `3d49e26…` (`experiri/SKILL.md`), and the new `grimoire` and `vigilia` pages. The fourth, `957c3ac…`, is referenced by no manifest in the repository. Checked across every `manifests/*/manifest.json` plus `.well-known/mcp/manifest.json`: **122 blobs on disk, 121 referenced, exactly one orphan** — that one, added by this commit.

It is a version of `grimoire/SKILL.md`, and it differs from the published index in exactly two places. It is missing the "one ward is not a scan" paragraph entirely. And its Runes paragraph asserts a flat universal: a rune is "an inline marker placed in the substrate under audit", full stop. The shipped index reads "It is placed in the substrate under audit, **or, where a ward says so, declared in the cast when that substrate is not yours to edit.**"

The universal is false, and the thing that falsifies it is the spell shipping in the same commit. `experiri`'s rune section requires exactly the case the orphan's sentence forbids — a rune you cannot place is still a judgment you must record, so when the roster is not yours to edit (a stdlib, a vendored dependency, a generated table) the exemption is declared in the cast instead, with the same categories, the same reason rule, and counted in `exempt`. The reason that matters rather than being a formality: casting against a roster you cannot write to must not force `exempt` to 0, because that turns a deliberate exemption into a finding and lets an incomplete cast satisfy the fully-reachable gate.

So the store holds a paragraph superseded inside its own commit, by its own commit's other file. That the blob is the residue of a publish attempt hashed by `generate-manifest` and then abandoned before signing is an **inference** — it is the shape a stopped publish leaves, given that generate writes blobs and sign writes snapshots, but no log entry proving a specific aborted run was found. What is not an inference is the orphan, its content, and its commit.

## What minting one ward forced everywhere else

Every other file in the publish answers "why did this change?" the same way: an existing universal was false the moment an executing ward existed.

The **grimoire index** gained the `### Runes` section, because until then the rune convention lived only in per-spell pages and the README, and `experiri`'s rune needed an optional second positional the index had never described. It also gained a safety line ahead of the casting instructions — one ward is not a scan; it executes the surface it audits, a synthesized caller is a real call, so cast it only against a target whose side effects you can undo. Both strings live in `scripts/generate-grimoire-skill.mjs`, so the index cannot drift from them.

**`vigilia`** gained `experiri` as a conditional code ward in three places, and its trigger is a conjunction whose second half is new to the watch: a target that declares a callable surface **and** can be loaded and driven in the caster's own process without irreversible effect. The watch had never before had to gate a ward on whether running it is safe.

The **README**'s global rune paragraph was rewritten. It had said runes suppress the finding without denying its presence; it now says the spell records the exemption with its reason, and whether it honours the rune on sight or adjudicates it is that spell's own rule. `experiri` adjudicates, so the README's universal was false the moment the spell shipped. The README also took the "one ward is not a scan" warning directly under the bullet advertising every cast as a mechanical scan — the document that sold the whole practice as read-only had to be amended by the arrival of one ward.

**`scripts/lib/spells.mjs`** gained two build gates, both carrying the same confession in the comment: "They matched by inspection until this line existed." The first requires a `## The rune` section in every non-primer spell, because the index now tells readers a ward's rune rules live there, so a ward without one makes the index's claim false — and that universal, the comment notes, has shipped false three times. The second requires frontmatter `name` to equal the directory name, and its reasoning is the sharpest constraint-engineering move of the week: the two travel down different pipes and meet only at the consumer, so a mismatch ships a signed manifest whose catalog advertises a spell that 404s, and nothing downstream would notice, because each pipe is internally consistent. A signed-but-unfetchable catalog entry is now a red build.

The publish itself lands as version `2026-08-28T21-31-32Z`, resource count 28 → 29, `experiri` at 40487 bytes, its `serverInfo.commit` pointing at `af00e81` because the manifest is generated before the publish commit that carries it exists. Those bytes are still what the server hands out: `experiri/SKILL.md` has exactly one commit in its history, and the manifest live today lists it at the same hash and the same size.

## Two commits, because the gate forces two

The ledger row cites `1db0ada` as the commit that landed the fixes. `scripts/publish.mjs` now runs `ledger:check` inside ship, with the reason at the call site: the ledger gate is in `check:docs`, and publish runs `docs:regen`, so without that line ship would sign and push and CI would red main afterwards. Which means the row cannot live in the publish commit — it has to cite a commit that does not exist until the publish is made. Two commits, 67 seconds apart, is not a tidying habit. It is the shape the gate forces.

## Likely Contributions to the Field

- **(declaration × position) as the unit of a reachability audit.** Reachability is not a property of the declared thing; it is a property of the pair. A type green on write and dead on read, an operator that fires fenced and refuses inline — one declaration, two answers, and a per-declaration audit must lie about half the surface. The derivation generalizes to any registry through one question: what does the system's own admission rule vary over, once the declaration is fixed? The admissible set must be read out of the system, while the driven subset is declared by name, because that subset is the coverage.
- **An executing auditor fails in the opposite direction from a reading one, and the calibration follows from that.** A broken reader finds nothing and nothing reads as clean; a broken driver finds a jackpot and a jackpot reads as a discovery. Hence a mandatory mixed control before any real cell: an all-refuse control passes a driver that renders nothing and an all-fire control passes a driver that never applies its constraint, so only two-fire-plus-two-refuse can fail in both directions. This is the argument for why an execution-based audit needs more apparatus than a reading one, not less.
- **A verdict gated on its own coverage arithmetic, with the null result made expensive.** Three populations that must add up, a fully-reachable claim admissible only when every unsettled slot is empty, and a cast that cannot finish filing a cast-level finding rather than an empty row — because a findings-free row renders as converged. The instrument is built so silence cannot be read as proof.
- **A proof-of-work ledger gated against its own re-prove rule, one rung and labeled as one rung.** The gate excludes struck rows on purpose so the honest disposition stays recordable, refuses the run when a row fails to parse rather than reporting the survivors, and distinguishes "path changed" from "revision unresolvable" so a shallow clone cannot make it fabricate a diagnosis. It climbs convention → build check, not to unrepresentable, and the remaining hole — a spell with no row at all — is documented rather than implied away.
- **An append-only content store turns a superseded claim into physical evidence.** One orphan blob among 122 preserves a paragraph the same commit's other file falsified, in a store whose design forbids deletion. A record that cannot forget is a different kind of record from one that is merely versioned: the withdrawn claim is recoverable, byte for byte, without anyone having chosen to keep it.
