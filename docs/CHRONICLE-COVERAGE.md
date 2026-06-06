# Chronicle coverage — how far the story has narrated each holonic repo

> **One job:** answer *"when did we last cover repo X, and what's the gap to its
> HEAD?"* without re-deriving it from scratch every session. Every row is
> **hash-stamped** — an index into checkable `git log` state, never a standalone
> claim. If a cell and the live `git log` disagree, **the `git log` wins** and
> this file is the stale cache: fix it. (Same doctrine as the recovery file —
> the log is the disk.)

The chronicle is `algebraic-intelligence.dev` (this repo). It narrates the work
that lives in the other holonic repos. This file records, per repo, the
**coverage frontier** — where the story's narration of that repo currently stops
— next to that repo's current HEAD, so the delta (the uncovered work) is visible
at a glance.

**The rule:** when a new story post ships that narrates a source repo, update
that repo's row (frontier post + the source commit/arc it reaches) and re-stamp
the date. There is nothing else to maintain — the row points at git; git is the
truth.

**Last reconciled:** 2026-06-05, post-compaction recolligere rites — divergence caught and repaired: wat-rs had moved `78a066c1` → `cb59d79a`; arc 249 closed + inscribed since the prior stamp.

## The coverage table

| Repo | Role vs the chronicle | Source HEAD @ reconcile | Chronicle frontier | Gap |
|---|---|---|---|---|
| `algebraic-intelligence.dev` | **The chronicle itself** | `62d735d` (06-05) | — (it *is* the record) | — |
| `wat-rs` | Substrate — the live edge | `cb59d79a` (06-05, **arc 249 CLOSED + INSCRIBED** `2054ec3e` — see below; now in the 245-reopen triage, Stone 245.8 strike-ready) | **arc 243** · `series-006-024 The Warding` (in-flight snapshot) | **arcs 244 → 249, all closed** (see below) |
| `holon-rs` | The Rust port | `530650c` (05-22, arc 230) | series-003 (`the-rust-port` → `engrams`) + Implementations/Rust | commit-frontier not pinned; repo quiet since 05-22 |
| `holon-lab-ddos` | DDoS / XDP scrubber | `b4eed24` (03-08) | series-004 (L7) + series-005 (spectral firewall) + Labs/DDoS | none active; repo quiet since 03-08 |
| `holon-lab-trading` | Trading lab | `8541201` (06-01, BOOK Interm. VIII) | series-006-001/002/003 | story covers the lab; the BOOK/intermissions are a separate artifact, not chronicle-narrated |
| `datamancy` | Signed **MCP kernel** (frozen) | `7c2a0d5` (05-30, **1.0.0 frozen forever**) | series-007 (The Signed Record) | none — frozen by design |
| `datamancy.dev` | Grimoire publish source | `f9e7e88` (06-05, publish `2026-06-05T11-26-13Z`) | series-007 + **series-008-001** + **series-008-002 "Vigil"** (through the 06-05 warded-watch publish) | ~current |
| `datamancer.dev` | Pinned-key trust domain | `98a034c` (05-30) | series-007-001 (`the-hinge`) + index.mdx | ~current |
| `scratch` | **Drafting source** (arcs / songs / intermissions) | `1bbe746` (scratch 024) | not a narrated subject — its arcs *become* posts | n/a (source, not subject) |

## The active gap — wat-rs arcs 244 → 249

The only live coverage gap. The substrate story stops at **arc 243**
(`series-006-024`, written as an in-flight snapshot); wat-rs has since closed
six arcs. Grounded survey (2026-06-05) — post-worthy, with primary sources under
`wat-rs/docs/arc/2026/06/`:

- **244 — nil-literal-canonicalization** *(closed, inscribed)*. nil becomes a
  first-class AST literal (`WatAST::NilLit`); the "nil-as-type-keyword" heresy
  annihilated by a build-failing gate. Sharp before/after: a probe refuses →
  *"attack the substrate, never fix the probe."*
- **245 — wat-corpus-warding** *(closed, inscribed)*. The `wat/` stdlib — the
  surface users actually call — warded as a family; the honest bar `deftest-green`
  forged when `suite-green` failed on contact. circumspicere the load-bearing lens.
- **246 — collection-dispatch-home** *(closed, inscribed)*. `src/collection/`
  lifted + warded; three self-inflicted false-ward disasters caught **on the
  record** — the best "what warded actually costs" material. Begets arc 250
  (self-enforcing stamps).
- **247 — clojure-hof-order** *(closed, inscribed)*. seq HOFs flipped
  coll-first → fn-first (`(map f xs)`); a 6-week dialect lie hard-cut across ~65 sites.
- **248 — macro-comprehension** *(closed, inscribed)*. `for` in templates; the
  discovery that equality is a *relational intrinsic*, not a clause (the plan
  that reversed — the tool survives, the need dissolves).
- **249 — total-pure-macros** *(closed, inscribed — narratable as of 06-05)*.
  The hold's conditions landed: INSCRIPTION at
  `wat-rs/docs/arc/2026/06/249-total-pure-macros/INSCRIPTION.md`, the close
  inscribed (`2054ec3e` "macros are total, pure programs over forms"), the
  re-wards re-stamped (`5ce98e0b` core.wat perimeter, `330e4a6c`
  `src/collection/` against the updated vigilia). The macro engine: macros are
  total-pure *programs* over forms, default-deny fence; threading /
  `keyword/of` / `for` hard-cut from Rust and reborn as wat macros. The
  "macros are programs" capstone — third rigidity axis (237 type-strictness →
  247 dialect-honesty → 249 macro-purity).

Candidate post groupings (2026-06-05 survey): **247+248 "The Dialect Reckoning"**
(richest, ready) · **244 "Nil Is a Literal"** (tight, ready) · **245 "The Corpus
Warding"** (sequel to the existing warding posts) · **246 "What Warded Actually
Costs"** (the discipline post) · **249 "Macros Are Programs"** (closed + inscribed
06-05 — now ready; the capstone).

## How to update this file

1. A post ships narrating repo X → set X's **Chronicle frontier** to the new
   post + the source commit/arc it reaches; bump X's **Source HEAD** to the
   current `git -C X log -1`.
2. Re-stamp **Last reconciled**.
3. If a row's frontier and the live `git log` ever disagree, git wins — this
   file is the stale cache, not the truth.

---

*Keep it straight: the chronicle is derived from the substrate, and this is the
seam between them. One read here answers "where did we leave off," so no session
re-derives it from a thousand commits again.*
