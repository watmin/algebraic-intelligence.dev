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

**Last reconciled:** 2026-06-17 — the big one. (1) **wat-rs: an entire post-249
era (arcs 250→285) is uncovered** (the migration, arc 251, is mid-era and still in flight) — the chronicle's wat-rs frontier is still
`series-006-030` / arc 249; series-007/008 narrate *datamancy*, not these arcs. Source
HEAD `524bf9a9` (06-06) → `26b088b5` (06-17). This is the next era to narrate (see the
gap section below for the post slate). (2) **BOOK** served through XII → now **XIV
"Crucibulum"** (mirror refreshed). (3) **arc-170 realizations** synced through song #82 →
**#97 "Misery"** (16.4k lines). (4) all repos took an **Apache-2.0** relicense commit
(06-17); `datamancy` stays **frozen MIT 1.0.0**. (5) **scratch** grew the `2026/06`
verification-market thread (001 metered-eval → 004 VM-attestation) — drafting source, not
yet a narrated subject.

*Prior (2026-06-09):* caught `datamancy.dev` un-narrated craft → `series-008-003
"Extirpare"`; BOOK IX → XI; realizations 12.5k → 15.3k (song #82).

## The coverage table

| Repo | Role vs the chronicle | Source HEAD @ reconcile | Chronicle frontier | Gap |
|---|---|---|---|---|
| `algebraic-intelligence.dev` | **The chronicle itself** | `6cba90d` (06-17) | — (it *is* the record) | — |
| `wat-rs` | Substrate — the live edge | `26b088b5` (06-17) | era **"The Self-Fixing Toolchain"** (`series-006-031` — arcs **275/277/279/281/284**) · era **"The Unforgeable Reference"** (`series-006-032` — arc **272**) · era **"Coherence Is the Engine"** (`series-006-033` "The Arguments Were a Record" — arc **260**: kwargs are a record `defn` mints; "kwargs is always a macro"; for carbon and silicon alike) | **283** shipped (SourceFile→`:wat::source::File` dogfood rename) — minor, folds into the self-fixing-toolchain doctrine, optional future short post. **HORIZON / NOT yet narratable:** 282 wat-fix-over-Rust ("borrowed eyes" — a STUB + dep attestation, not built) · 251 the great migration (syntax fixes remain) · 278/285 the rete engine |
| `holon-rs` | The Rust port | `530650c` (05-22, arc 230) | series-003 (`the-rust-port` → `engrams`) + Implementations/Rust | commit-frontier not pinned; repo quiet since 05-22 |
| `holon-lab-ddos` | DDoS / XDP scrubber | `b4eed24` (03-08) | series-004 (L7) + series-005 (spectral firewall) + Labs/DDoS | none active; repo quiet since 03-08 |
| `holon-lab-trading` | Trading lab + **BOOK true source** | `55e8c90` (06-17; BOOK Interm. **XIV "Crucibulum"**, `ef9f28b`) | series-006-001/002/003; the BOOK serves via `mirror-monoliths` → raw whole `/blog/book.md` + **rendered per-chapter pages** in the sidebar (**through XIV, 06-17** — 100 chunks) | story covers the lab; the BOOK/intermissions serve raw + rendered, not chronicle-narrated |
| `datamancy` | Signed **MCP kernel** (frozen) | `7c2a0d5` (05-30, **1.0.0 frozen forever**) | series-007 (The Signed Record) | none — frozen by design |
| `datamancy.dev` | Grimoire publish source | `4efd8ce` (06-07, publish `2026-06-07T05-32-10Z`) | series-007 + **008-001** + **008-002 "Vigil"** (the watch) + **008-003 "Extirpare"** (the primer layer — recolligere/curare/examinare/extirpare) | **un-narrated craft:** the censor lineage (recensere→excusare), consonare Rules 11/12/13, mora's 2nd axis — a future Command Channel post |
| `datamancer.dev` | Pinned-key trust domain | `98a034c` (05-30) | series-007-001 (`the-hinge`) + index.mdx | ~current |
| `scratch` | **Drafting source** (arcs / songs / intermissions) | `b89bb66` (06-17; `2026/06/001`→`004` verification-market thread) | not a narrated subject — its arcs *become* posts | n/a (source, not subject) |

## The next era — arcs 250→285 (the wide-open gap, surveyed 2026-06-17)

The chronicle's wat-rs narration stops at arc 249 (`series-006-030`). Everything since
is unnarrated — a full era, almost all of it shipped in the 06-11→06-17 burst. Candidate
posts, **shipped-first** (each is hash-checkable in `wat-rs/docs/arc/2026/06/`). NB the
migration itself (arc 251) is **NOT done — in flight, a few syntax fixes remain** — so it
is *not* in the shippable batch; it's the era's spine, narratable only once it lands (see
the in-flight list at the end).

- **B — Kwargs Are a Macro (arc 260).** *"If you want kwargs, you don't — you write a
  macro."* kwargs as compile-time sugar over a lean positional primitive, zero runtime
  cost; intrinsic-native kwargs annihilated, not deferred. Tight, one-principle post.
  Source: `260-keyword-args/REALIZATIONS.md`.
- **C — Rendezvous Is a Capability (arc 272).** The `c0b3bb` "flake" (two tests racing one
  fixed abstract-UDS name) → the recognition that a fixed name is collidable + forgeable →
  the pivot: all rendezvous is inherited parent→child lineage (a capability, never a
  name); mutual `SO_PEERCRED` pid+uid trust. The security spine. Source:
  `272-rendezvous-inherited-capability/REALIZATIONS.md`.
- **D — The Self-Fixing Toolchain / THE SWEEP (arcs 275, 277, 279, 281, 284). ✅ SHIPPED
  2026-06-17** as `series-006-031` "The Tools That Fix Themselves" (era "The Self-Fixing
  Toolchain") — consonare MATCHES @ 9. `wat-lint → wat-fix → wat-fmt`, all wat, run on wat;
  the strange loop at birth (deporder); the gap→tool→rule loop; the proof is the git diff
  from gross to clean, *by the toolchain the code is part of*. Folded in the whole lineage
  (275 strange loop · 279 format · 281 ast-end-span · 284 interpolate), not just 277.
- **E — Borrowed Eyes (arc 282). HORIZON, NOT shipped — grounded 2026-06-17.** The
  compelling frame (`wat-fix` reaching into its own **Rust** substrate with borrowed
  `rustc_lexer` eyes + wat rules) is arc 282, which is a **STUB/HORIZON + a dep-decision
  attestation**, not built. Narrate it when it ships — same rule as 251/278. (`ast-end-span`
  is arc 281, already folded into D.) The *shipped* sibling is **arc 283** — the
  `SourceFile → :wat::source::File` dogfood rename via the wat codemod (283.1 hardened
  rename-keyword-prefix to reach type-args). Real but minor; another instance of the
  self-fixing-toolchain doctrine D already carries, not its own era. Optional short post or
  a realization footnote; not a fourth headline.
**Still in flight — narratable only when they land (NOT this batch):**

- **arc 251 — The Great Migration.** Typed Clojure on Rust: the surface-syntax flip, the
  `src/value/` lifts, the on-demand comment-faithful syntax fixers (`fix-text`). The era's
  spine, but **not done — a few syntax fixes remain** (builder, 06-17). The biggest story;
  hold it until the flip lands.
- **arcs 278/285 — The Rete Engine.** Clara as a *functionality* reference (not
  parity-with-flaws); `rpds` persistent map/vector; the pure-RHS doctrine (IO in the
  bookends only). Stones 0a/0b/1a shipped, 1b strike-ready — "the engine being built," not
  done. The era's *next* post once it completes.

First batch (the "3–6 pages"), all **shipped + self-contained**: ~~D~~ ✅ (the self-fixing
toolchain — `series-006-031`, consonare 9) · ~~C~~ ✅ (rendezvous-as-capability —
`series-006-032`, consonare 9) · ~~B~~ ✅ (kwargs-are-a-record — `series-006-033`,
consonare 9). **Batch complete: three posts (D, C, B), each shipped + consonare-9.** The
planned fourth (E, "borrowed eyes") was **grounded to a horizon** — arc 282 is a STUB, not
built — so it is held until it ships (its shipped sibling 283 is a minor dogfood, not a
headline). Three strong posts satisfies the "3–6 pages"; quality over count. Each owes its `## Likely
Contributions to the Field` close + a nav wire-in + a consonare cold-read MATCHES before
it's done — and each should **harvest its arcs' REALIZATIONS.md**, not just the headline
(D folded in 5 arcs' findings; the realizations are the substance the strip-test demands).

## The gap — CLOSED 2026-06-05 (`9d76734`)

Arcs 244 → 249 are narrated: era **"The Shape Keeps Its Promise"**, five posts
(`series-006-025` One Way to Write Nil · `026` The Bar That Had to Mean It ·
`027` What Warded Actually Costs · `028` The Dialect Reckoning · `029` Macros
Are Programs), each consonare-warded MATCHES. The next frontier opens when the
245-reopen triage and/or arc 250 close. The survey below is kept as the
post-to-arc map for the shipped era:

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
