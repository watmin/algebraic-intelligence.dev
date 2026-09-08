# Working notes — uiol-004, arcs 293 + 294 (2026-06-25 → 2026-08-16)

**Status:** raw notes, not a draft. Written 2026-09-08 by a reader working the
`wat-rs` backfill. Everything below is grounded against the repo at
`/home/watmin/work/holon/wat-rs`, read this session (HEAD at read time:
`3dc4f62b7`, *"CURARE(294): correct the seam — COMMIT LOCALLY (the undo buffer),
do not PUSH a broken main"*). Nothing in `wat-rs` was edited.

**Title and song-drop are ALWAYS the builder's call.** Working images below, not
proposals.

---

## STOP-1 — ANSWERED: 293 and 294 are ONE unit, and the disk says so in its own words

This is not a judgement call I had to make. The repo contains a **single joint
close tracker**, and its first line is the answer:

`docs/arc/2026/06/294-holon-returns-to-vsa/CLOSE-SEQUENCE-293-294.md:1`

> `# CLOSE SEQUENCE — 293 + 294 close TOGETHER (the single maintained tracker)`

The mechanism of the joint is stated at `:9–:16` of the same file, and it is a
**shared root**, not adjacency:

> **294 (the value-layer gut) was discovered INSIDE 293 (the aggregate type
> system).** Chasing 293's construction parity surfaced that the holon record was
> built backwards; pulling that thread became 294. So:
> - 293's **construction tail folds into 294** (`aggregate-new`, `/from-map`)
> - The **homes are shared**: `src/aggregate/` (construction) is 293.1's owed
>   home; `src/holon/` (VSA) is 294's.
> - **293.5 close is GATED** on the 294 value-layer being done AND the aggregate
>   audit reaching zero spurious splits.
>
> They **cannot close independently.**

And the tracker exists because the entanglement had already caused a real
mislabelling failure — the builder, quoted at `:5`:

> "293 and 294 getting entangled is a problem we've not faced and i don't want to
> experience this again — no slip out of sequence again."

The commit that created the tracker is `b1493d696` (2026-06-28, *"docs:
CLOSE-SEQUENCE-293-294.md — the single maintained joint-close tracker (no slip
out of sequence)"*). Two commits the day before are the drift being corrected:
`fabf4a492` (*"curare: breadcrumb CORRECTION — the 293.R2.x work is 294, not 293;
point at 294/REMAINING-PATH.md"*) and `ee1bfcf85` (*"the invented R2.4
disavowed"*).

**Write it as one unit.** The joint is: *one arc opened on "make structs and
records operable uniformly," and the second arc is what fell out of the first when
that question was pushed one layer down into the value representation.*

---

## ⚠ READ SECOND — the planner's window for this unit is WRONG at the far end (STOP-3)

The planner's note says *"roughly 18 + 15 realization commits across W1–W2 plus
2026-08-25."* Two corrections, both grounded.

### (a) The realization-commit counts

Commits touching each arc's `REALIZATIONS.md`, measured (`git log -- <path>`):

| arc | REALIZATIONS commits | span |
|---|---|---|
| 293 | **15** | 2026-06-25 → 2026-07-04 |
| 294 | **16** | 2026-06-26 → 2026-08-25 |

Not 18+15. Close enough that nothing turns on it, but state what a number counts:
these are *commits that touched the file*, not realizations — 293 holds **R1–R10
plus 5 interstitial/amend commits**; 294 holds **R1, R2, R3, R5, R6, R7, R8, R9**
(there is no R4 in 294's file) plus interstitials and a doctrine note.

### (b) `2026-08-25` does NOT belong to this unit

294 R9 (`aaed8b2f2`, 2026-08-25, *"mutatis mutandis — every red today was a thing
that did not change when its subject did"*) is **not arc-294 subject matter.** Its
own body, `294/REALIZATIONS.md:1150`:

> The day set out to move `:wat::core::string::*` to `:wat::string::*`.

That is the **homes campaign** — arc 255's territory, and the material of
uiol-008. The same is true of the two entries before it:

- **R7** (`56ac6087e`, 2026-08-22) — the angle-bracket/turbofish annihilation
  (`294/REALIZATIONS.md:812–850`: the type-parse wall, `710 → 17 → 10 → 5 → 0`
  across 543 files, the comma as EDN whitespace). That is the front landing
  page's *"The angle bracket, the comma and the turbofish are annihilated"* — a
  different post.
- **R8** (`8c14bb4a0`, 2026-08-23) — same campaign, the prose channel: 351 sites,
  **142 rewritten, 203 KEPT**, *"you cannot build a wall on a page."*

**What happened is that 294's directory became the project's LIVE SEAM HOLDER.**
`294/SEAM.md` is the one live breadcrumb for the whole repo as of 2026-09-07, and
`251/SEAM.md`, `255/SEAM.md`, `278/SEAM.md` are all PARKED and point at it
(`294/SEAM.md:6`). So its `REALIZATIONS.md` kept accreting entries after the arc's
own subject was done. **The directory is not the arc.**

**Proposed boundary for uiol-004: 2026-06-25 → 2026-08-16.** The last commit that
is genuinely this unit's subject is `5ca6dab57` (2026-08-16 23:10, *"294.n:
`#wat-edn` is ANNIHILATED"*). Everything from 2026-08-22 in that directory belongs
to a sibling post.

---

## ⚠ READ THIRD — the arc's own KEYSTONE was ruled VOID, seven weeks later, by the builder

This is the strongest thing in the unit and the post should be built on it.

**What `HOLONAST-WAS-A-COAT` names.** It is one rune in 294 R1's song-line
(`294/REALIZATIONS.md:7`). The claim it compresses, from R1 itself
(`294/REALIZATIONS.md:41–44`):

> strip HolonAST's borrowed roles (code-AST → WatAST, wire → EDN) and **what
> remains is not a syntax tree at all.** It is `Atom`/`Bind`/`Bundle`/`Permute` —
> the MAP-VSA algebra (`holon_ast.rs:59`) that `encode` evaluates to a point in
> hyperspace. It was never an AST. It was a **Hologram wearing an AST's coat**,
> the truth hiding in the first half of its own name. **`HolonAST` reduces to
> `Hologram`.**

That reduction is what the arc's *name* was crowned for (`294/DESIGN.md:7–9`):
`holon-returns-to-vsa`, builder — *"that one is just pleasant to read"* — because
"HolonAST was minted for VSA (arc 057), accreted the AST + wire roles … and now
sheds them to return to its origin: pure VSA. The strange loop closes."

**It is wrong.** `341eb81e8` (2026-08-14, *"294 RULING: HolonAST and Hologram are
BOTH correctly named — R1's keystone is VOID"*), recorded in
`294/RULING-holonast-and-hologram-are-both-correctly-named.md`. Builder, verbatim
(`:9`, `:11`):

> *":wat::holon::Hologram is currently correctly defined.... the hologram is the
> thing you hold and can get objects out who point to more objects.... **the
> hologram is made from holons**"*
>
> *"**HolonAST needs no change**..... it is an AST for building holons.... its far
> more restrictive than WatAST.... but it can hold everything a WatAST can
> hold.... **HolonAST is an edn**.... whatever you can express with edn... you can
> build in holon-ast...."*

The ruling's own summary (`:22`): *"The stripping was right; the naming of what
remained was one step too far. It **is** a syntax tree — an AST for building
holons rather than for code. And the destination name was never vacant."*

**The incumbent's name is provable from its own definition**, and the ruling
proves it rather than asserting it — `src/hologram.rs:63` at the time (now
`src/holon/hologram.rs:63`):

```rust
pub struct Hologram {
    slots: Vec<HashMap<HolonAST, HolonAST>>,   // ← made OF holons, keyed BY holons
    capacity: usize,                            //   floor(sqrt(d)) — Kanerva cells
}
```

**Verified at HEAD: the rename never happened.** `git grep -o HolonAST -- src/`
returns **1165** occurrences; `pub struct Hologram` is at
`src/holon/hologram.rs:63`. Both names still stand.

**And the ruling shrank the work by two orders of magnitude.** Its own line: *"'The
remaining holon junk' is therefore three items, all in wat-rs, all on legal
ground — not 1263 sites across two repos. The cross-repo migration that looked
unavoidable an hour ago does not exist."*

**How it was found is the lesson, and the ruling says so in its own §"How this was
found, kept because the method is the lesson":**

> Not by measurement. The apparatus had measured `Hologram`'s 116 refs an hour
> earlier and reported them as *"the destination name"* — i.e. as progress toward
> the rename — when they were **the collision**.

The builder cut it twice: first on a dead precedent (*"078 is very old and we
changed away from that name in 109 or later"* — the crate `crates/wat-holon-lru`
is gone), then on the semantics. The ruling's own verdict: **"The taste-first read
beat the measurement-first read to the finding, again."**

---

## The through-line (one paragraph)

Arc 293 opened on a defect the builder graded catastrophic — you could not operate
on a `wat` struct and a `wat` record uniformly — and the fix was not a shim but a
**decomplection**: struct, record and holon-record were one property-bag written
three times, so three `Value` variants collapsed to one `Value::Aggregate` with a
kind tag, and inheritance was deleted outright because `parent` turned out to be a
stringly-typed shadow of the kind. Pushing that same question one layer down —
*how do these three actually get constructed?* — surfaced arc 294: the holon
record was built **backwards**, with the derived VSA hologram sitting in the
identity slot and the EDN data demoted to a cache. One inversion, six faces. The
cure put the data back in its chair (identity is the EDN fields; the hologram is a
derived index; the wire ships plain EDN; one holder-dispatched constructor), and
along the way the substrate applied its own one-canonical-path law to its own
foundation and found the axis it had built the wire wall for was **a purity check
wearing a movement-name**. And then the arc's crowning recognition — that the
central type's name had been lying since the bootstrap — was itself ruled **VOID**
by the builder seven weeks later, on the same taste that had found the rot in the
first place. Every deliverable survived the void. The keystone did not.

Working images (builder's call): *the coat that fit* · *a name that was right all
along* · *the data in its own chair* · *portable was the symptom*.

---

## The story beats, in order

Dates are author dates (`%ad`), the field I filtered on.

### 1. 2026-06-25 — the leak, and the decomplection (293 R1–R3)

The arc opens on a bug the builder called catastrophic
(`293/REALIZATIONS.md:168`):

> *"we cannot operate on structs and records trivially — that's a fucking
> catastrophic bug — decomplection is highest priority."*

Three realizations in one day. R1 re-derives **structural surfaces** by hating the
word "parent"; R3 finds **Holder × Surface** — *what you are* underneath *what you
show*. R2 is the shape the whole unit turns on (`293/REALIZATIONS.md:163`):

> *"the 'holder of things' is always a struct under the hood, right? … wat
> structs, records, holon-records should all be backed by a single common struct
> and then the 'struct-ness' or 'record-ness' is a thing on that common struct —
> { properties-as-struct, kind-as-enum }."*

R2's own account of how it was reached is the duet, stated three times over
(`293/REALIZATIONS.md:176–192`): the apparatus reached for the elaborate reading
(this is a macro concern; 256 match-sites are essential heterogeneity) and the
builder reached for the simple one and was right each time. His tell, verbatim
(`:167`): *"i feel like one of us is missing something."*

### 2. 2026-06-26 — holon comes home, and the first swing DISCONFIRMS (294 R1–R3, R5)

294 opens the next day. The builder's framing of the opening probe, quoted in
R2's body: *"294 — i think we're going to prove a simple edn measurement does or
doesn't work?"*

**The first attempt failed, and the failure was the find**
(`294/REALIZATIONS.md:127–136`): `(cosine {:a 1 :b 2} {:a 1 :b 3})` over plain
hand-typed EDN was **rejected at type-check** — the surface demanded
`HolonAST | Record | Vector`, never EDN. *The data is not the thing you measure;
the derived hologram is, and the surface makes you name the derivation.*

Lifted through `to-holon`, the cosines printed, and this is the beat where the
project's origin walks back into the room (`294/REALIZATIONS.md:132–136`):

```
{:a 1 :b 2} vs itself        → 1.0      (exact coincidence)
{:a 1 :b 2} vs {:a 1 :b 3}   → 0.486    (one of two role-filler binds matches → ~½)
[1 2 3]     vs [1 2 4]       → 0.574    (two of three positional binds match)
{:a 1 :b 2} vs {:zzz :qqq}   → 0.011    (share nothing → near-orthogonal)
```

Builder (`294/REALIZATIONS.md:116–117`):

> *"LOOK AT THE COSINES — it's been like 3 months since we've done a holon thing."*
>
> *"wat was my detouring all of the holon work because i fucking hate rust but need
> rust's perf."*

**This is the sentence the whole chronicle has been waiting for and it should not
be padded.** The site's own origin story is holon — a VSA library — and here the
builder names `wat` as the detour he took to get holon's performance, and the
detour turning out to be the body. `294/DESIGN.md` calls it a homecoming; R2's
title is *"holon came home, and home asks for the gut."*

**Corroborating landing:** `afb731de3` (2026-06-26, *"294.a LANDED: direct-EDN
measurement (collections+scalars) — weighed green"*), then `e7ad4dec6` (06-27,
*"294.b: the showpiece — same `#holon` bytes read in clj AND wat (LANDED)"*). The
grace note is `ef0b4b4d4` — *"cargo wat's first run is the homecoming cosines."*

### 3. 2026-06-26 — the six flaws and the one inversion

`294/DESIGN.md:19–24` states the disease once:

> **A derived encoding was made canonical, and the data it derives from was
> demoted to a cache.** … The cure, stated once: **EDN is the canonical data;
> everything else (the holographic vector, the wire form) is *derived from* EDN,
> never the other way.**

The six, each cited to `file:line` in the DESIGN (`:26–:60`):

| # | flaw | where |
|---|---|---|
| 1 | construction split-brain — `struct-new` varargs vs `Record::of` vector vs holon `Record::of` vector+hologram | `runtime.rs:11680` / `:13244` / `:13298` |
| 2 | holon record built backwards — hologram is identity, fields are the projection | `value/value.rs:329, 673, 924` |
| 3 | `#wat-edn.holon/*` tags are scar tissue from a hologram-canonical wire | `edn_shim.rs` |
| 4 | `HolonRepresentable` redundant with `EdnRepresentable` — all ~54 uses wire-only | `comms/mod.rs:134` |
| 5 | HolonAST-as-code-AST vestigial — WatAST 3412 mentions vs 1161 | census |
| 6 | the strange loop ready to close — the rename | — |

**Flaw #6 is the one that got voided.** Flaw #5 survived, re-sorted by the ruling
as *"a scoping cleanup, NOT a rename."*

### 4. 2026-06-28 → 06-29 — the strikes that landed, in the same week

| commit | date | what |
|---|---|---|
| `cf89fb52a` | 06-28 | 293 type-system: surfaces, methods-as-accessors, `defprotocol` annihilated. The acceptance demo green. |
| `9d1e3ff3b` | 06-28 | **293.R2.1 repr collapse — three `Value` variants → one `Value::Aggregate`.** Builder in the body: *"annihilate the variance ... i break shit because its already broken, successfully."* |
| `ed7ecd506` | 06-28 | **294.c.1 — the equality flip.** A HolonRecord's identity is its EDN data, not the hologram. (flaw #2 closed) |
| `f301a6fc4` | 06-28 | **294.c.2a — `aggregate-new`, the ONE holder-dispatched constructor.** (flaw #1 closed) |
| `eaaa69300` | 06-28 | follow-on: `kanerva_capacity`'s `floor(sqrt(d))` budget driven to ONE copy. Builder, per `ea2c77665`: *replicate = duplicate.* |
| `f51465d78` | 06-29 | 293 decl-a: `aggregatetype` is the ONE type-reg primitive. Floor 4112/0/91. |
| `c7572929d` | 06-29 | **inheritance annihilation.** `AggregateDef.parent` DELETED — it was *"a stringly-typed shadow of `holder`"*. `collect_all_record_fields`, `inherited_count`, `ROOT_PARENTS`, `abs_idx` all deleted. Floor 4113/0/92. |

Verified at the 2026-08-30 tree (`8e79b8d39`): `src/types.rs:211` is
`pub enum Nature`, `src/types.rs:311` is `pub struct AggregateDef`, and
`src/value/value.rs:355` carries the epitaph *"Arc 293.R2.1: `wat__holon__Record`
and `wat__core__Record` DELETED."* The collapse held.

Builder on the inheritance kill, quoted at
`CLOSE-SEQUENCE-293-294.md:42` — *"parent as an attribute is wrong"* — and the
retrospect in `293/REALIZATIONS.md:1005`:

> *"we've been trying to kill inheritance for… idk how long… i don't even know why
> i went down this path…. we built it to realize we don't need it… its easier
> without it."*

### 5. 2026-06-30 — PVRITAS NON MOTVS: the axis was named for its symptom (293 R7)

This is the beat that puts the unit squarely inside this front's subject, and it
is the cleanest "the enforcer submits to itself" moment in the pair.

The wire wall needed its predicate finished; the marker needed a name; the
apparatus ran a four-questions and two `intueri` casts and crowned
`:Portable`/`:Anchored` — *"a good, honest answer to the wrong question"*
(`293/REALIZATIONS.md:1015`). Then the builder turned the marker over
(`:1001`, `:1000`):

> *"strange…. very strange.. i viewed it as 'pure data' as in there's nothing but
> data in this… if a enum captures a socket… its impure?"*
>
> *"is that the name here?.. enums are pure or impure?"* · ***"and if that's the
> name…. does holder evolve into a purity check?"***

`is_portable = holder != Struct` **had always been a purity test.** The record's
own line (`:1021`): *"Portable was the symptom. Pure is the cause."*

Both candidate names passed the four questions, so the four could not separate
them. What did was a fifth question the builder named as a law (`:1003`):

> *"this feels like the only answer — the alternative reads like a deferral…..
> when we make our decisions we are building towards a solution that minimizes the
> chance of being revisited in the future — we bias towards long term stability..
> how does this bias change our mind?"*

The record's reading of it, and it generalizes past `wat` (`:1046–1052`): a
symptom-name is unstable *by construction*, because it gets revisited the moment
someone traces it to its cause; and **a decision that ships a known seam is not a
decision, it is a deferral.**

Two more corrections in the same session, both in the record and both worth the
post's honesty (`:1026`, `:1034`):

> *"decisions needs four-questions to inform the debate."*
>
> *"you typically never do any real coding work — we just do the design debates
> here and delegate to sonnet to build."*

**Cross-link, and it is real, not decorative:** this purity axis is *data*-purity
on a type; arc 255's `@Purity` axis (uiol-008) is *effect*-purity on a function.
R7 explicitly rules them **one purity family, not a collision** — *"the two uses
sit in different syntactic positions — data-purity on a type, effect-purity on a
function"* (`:1030`). The apparatus had "manufactured a wall where there was a
seam, and the builder walked through it."

Landing: `439ee19c9` / `4b933f9e4` (06-30), and the rename `Holder → Nature`
lands later at `4b9a6d7fb` (2026-07-06).

### 6. 2026-07-12 → 07-15 — the kwargs flip, and the week that was one bug wearing seven faces (294 R6)

Item 9a: bare aggregate name becomes the **kwargs macro**, positional demoted to
the type-name prime `:ns::T'`. The flip landed and **the floor went to 645
failures.**

The descent is in the commit subjects, one per drop:
`967aa344e` (645→165) · `525cd24cc` (165→150) · `292f9451b` (131→100) ·
`b6d0bc37f` (100→79) · `617a9ade0` (79→76) · `58eb45fff` (76→74) ·
`c55dd6a1b` (74→73) · `c8b6a2f80` (73→69) · `ee29884cd` (69→65) ·
`51e3aaf88` (65→64) · `73cfeefeb` (34→26) · `2a7156620` (34→26) ·
`b6efc3eb4` (22→18) · `ba91cb2b1` (18→15) · `1b9a9c43b` (15→13) ·
`60ce68e3f` (13→9) · `00bc5fd36` (9→7) · `fad5633f6` (7→6) ·
`3ca7c949f` (6→4) · `295186158` (4→3) · `555c4a97d` (loose-asserts 12→9) ·
`0d2164647` (3→2) · `6d6bc6855` (**FLOOR = 1**).

**The record's point is not the descent** (`294/REALIZATIONS.md:551`): *"the
apparatus **guessed the class wrong nearly every time**, and each wrong guess had
the same author: an assertion that could not speak."* Seven roots, none predicted
— including `fadb03dfa`, *"macro registration is SEQUENTIAL during expansion"*,
which was the whole defservice/deftest cluster in one.

The miniature, and it is a good beat (`:568–:574`): `peer_ipc` had been staring
the builder down since the flip — *"likely simpler than we realize."* It was **two
lines**. A bare-positional construction errored, and the `Err` arm called
`drain_server_stderr(&server)` to **report** the error, against a child still
blocked on `readln`. **The diagnostic path deadlocked on the very failure it
exists to report.**

Builder quotes from this stretch (`294/REALIZATIONS.md:526–533`):

> *"we have /very/ rich error messages.. are they failing us?"*
>
> *"we have tests that are an opaque failure and we are making an active choice to
> mask the failure instead of present it."*
>
> *"we cannot return to normal work until failures are the exact one — you
> proposing 2 stuns me… that's not an option."*

R6's rune: **DOLOR INDEX EST** — the ache was the instrument.

### 7. 2026-08-14 — the ruling voids the keystone (see §"READ THIRD")

`341eb81e8`. Note the sequencing: the void arrives **the same day** as `294.g`,
the first of the wire strikes, and it arrived out of an arc-255 afternoon (see
uiol-008 notes, §"the 08-14 hinge"). The arc got shorter and kept going.

### 8. 2026-08-14 → 08-16 — the wire strikes: flaws #3 and #4 close

| commit | date | what |
|---|---|---|
| `21b7079f8` | 08-14 | **294.g — the holon record's wire is PLAIN EDN.** `#t/Holo #wat-edn.holon/Bind [...]` (~250 bytes) → `#t/Holo {:x 1 :y 2}` (22). The holon-vs-base discriminator moves from **body shape** to the registry's `Nature`; the hologram is derived on arrival. Builder in the body: *"annihilation is our greatest joy .... then that's our target."* |
| `3656d1e46` | 08-16 | **294.h — `HolonRepresentable` is DELETED.** Trait + 9 impls + 7 delegating shims. Builder: *"i don't think we need HolonRepresentable at all now."* |
| `df6e2e91c` | 08-16 | **294.i — `#wat-edn.opaque` is dead.** Every resource decorates nil in its own home: `#wat.kernel/Sender nil`, `#wat.io/IOWriter nil`, `#wat.holon/Hologram nil`. `RustOpaque` vanishes from the wire. |
| `f6f8df3b5` | 08-16 | **294.j — the wire carries DATA under `#wat/holon`.** `from_holon_item(h) -> Ok(data)`; anything that is neither data nor directive **RAISES**. |
| `62807e376` | 08-16 | 294.k — the fabricated home RAISES; the arms were dead, as the wall proved. |
| `29598dfc8` | 08-16 | 294.l — the float sentinels go home. |
| `e00c4691b` | 08-16 | **294.m — `#wat-edn.cap` is GONE, and the REGISTRY is the wall now.** |
| `5ca6dab57` | 08-16 | **294.n — `#wat-edn` is ANNIHILATED.** Builder: *"20 refs.... they go... #wat-edn is annihilated..."* |

**Verified at HEAD:** `git grep -o '#wat-edn' -- src/ wat/ crates/` returns **0**.

**Three of these carry a beat that is better than the strike itself:**

1. **`294.i` — the correction that became the design** (`df6e2e91c` body). The
   apparatus had read `opaque_nil` as a *missing encoder* and proposed writing
   encoders for the VSA types — *"which would have meant INVENTING EDN for things
   that have none."* The builder's model, verbatim:

   > *"i expect these rust things to just decorate nil..... they contain no
   > edn.... `#wat.io/Sender nil` is the data literal for a Sender instance..... a
   > hologram is full of holonic data.. but it cannot be represented as edn.. we
   > can transmit these as edn but the receiver can gain no knowledge.... there's
   > no edn to represent a resource."*

   The nil body was correct and final. The only defect was that `opaque` occupied
   the namespace slot where the type's **home** belongs.

2. **`294.i` — the rider overrode the brief and was right.** The brief said
   *"delete the None door... not a licence to keep the door."* Measured:
   `encode_capability(inner, types: &TypeEnv)` takes its registry **by
   signature** — the `if let Some(t)` is a shape, not a choice — and
   `edn_shim.rs:3773` is its only call site, on the live process-tier `send'`
   path. Obeying would have silently deleted the entire capability-encode
   mechanism. The commit's own verdict: *"The brief was the upstream defect."*

3. **`294.m` — the namespace WAS the wall.** `if ns == "wat-edn.cap"` is how the
   decoder refused a forged capability. Once a capability wears its real home,
   `wat.kernel` stops meaning "capability" (Frame and Location live there too), so
   the refusal now asks the registry:

   ```rust
   let cap_type_path = ns_to_wat_path(ns, name);
   if crate::capability::is_capability_type_path(&cap_type_path) { ... }
   ```

   which the commit calls arc 198's ruling verbatim — *"ask the registry whether
   the key is live; never ask a string what it looks like."* The **encoder already
   did this; only the refusal asked a string.** And the two-key asymmetry
   collapsed: `codec.name` deleted, `type_path` the single key both directions.
   *"The fourth instance in this arc of one concept implemented twice, and the
   only one on a trust boundary."*

4. **`294.n` — the tags were dead but the diagnostics still said their name.**
   The apparatus's own "20 refs" was **44**; the honest census spans
   `src/ crates/ tests/ wat/ wat-tests/ wat-scripts/` over `.rs+.wat+.md`. And the
   wider grep caught what the narrow one could not: **11 of the 44 are Clojure
   namespaces**, `wat-edn.core` in the sibling `wat-edn-clj/` library — a live
   public API, not a tag. *"A grep cannot tell a tag from a namespace that happens
   to share its spelling."* Why it mattered most: a user hitting
   `"wat-edn.cap/address (name 200 bytes exceeds the 107-byte abstract-UDS limit)"`
   would grep for `wat-edn.cap` and find nothing.

---

## Scope — what is in, what is out

**IN (uiol-004):**
- 2026-06-25 → 2026-07-04: 293 R1–R10, the decomplection, the repr collapse, the
  inheritance annihilation, PVRITAS NON MOTVS.
- 2026-06-26 → 2026-06-30: 294 R1–R5, the homecoming cosines, the six flaws,
  `aggregate-new`, the equality flip.
- 2026-07-12 → 07-15: the kwargs flip, 645 → 1, 294 R6.
- 2026-08-14: the RULING that voids the keystone.
- 2026-08-14 → 08-16: 294.g through 294.n — the wire strikes.

**OUT:**
- 294 R7 (08-22) and R8 (08-23) — the turbofish/angle-bracket/comma annihilation.
  A different post; the front's landing page already names it.
- 294 R9 (08-25) — the `:wat::core::string` → `:wat::string` day. That is the
  homes campaign; see uiol-008.
- Everything after 2026-08-30 in `294/`: `SEAM.md`'s current state
  (2026-09-07, *"THE TREE IS DIRTY AND NOTHING RUNS"*, a floor of 2447/5238) and
  `RULING-holon-is-for-vsa-only-and-a-wall-will-say-so.md` (added 2026-09-07 —
  the one file in the directory created after the cutoff). **Both are past the
  batch cutoff.** The second one is a live continuation of this very question and
  will make a good later post; do not touch it here.
- 293's post-window residue: `NOTE-containment-wall-blind-to-rust-opaques.md`
  (2026-08-08) and `NOTE-peer-and-threadselfpeer-are-one-relation-never-stated.md`
  (2026-08-12) are in-window but belong to other strands (the first is instance #3
  of uiol-006's law and is already used there).

**File-count check, since the brief flagged one for 255 and the same instrument
should be pointed here:** by first-add date, **all 65 of 293's files** and **38 of
294's 39** were created inside the window; one 294 file (the 2026-09-07 ruling)
falls after. Neither directory predates the window.

---

## Verbatim builder quotes, with locations

Method note: I harvested from two channels — commit bodies (`git show -s`) and the
two `REALIZATIONS.md` files, whose "The realization quotes (the builder's, this
session — verbatim)" blocks are the repo's own convention for preserving them.
Nothing below is paraphrased, extended, or reconstructed; ellipses and spelling are
the record's. Line numbers are from the files as read this session.

**4.1 — the bug that opened 293.** `293/REALIZATIONS.md:168`

> "we cannot operate on structs and records trivially — that's a fucking
> catastrophic bug — decomplection is highest priority."

**4.2 — the shape.** `293/REALIZATIONS.md:163`

> "the 'holder of things' is always a struct under the hood, right? … wat structs,
> records, holon-records should all be backed by a single common struct and then
> the 'struct-ness' or 'record-ness' is a thing on that common struct —
> { properties-as-struct, kind-as-enum }."

**4.3 — the tell.** `293/REALIZATIONS.md:167`

> "i feel like one of us is missing something."

**4.4 — one data, two encodings.** `293/REALIZATIONS.md` R2 quote block (`:165`)

> "edn is a representation of data… holon is a representation of data — the same
> data can be encoded in edn or holon."

**4.5 — the purity turn.** `293/REALIZATIONS.md:1000–1001`

> "strange…. very strange.. i viewed it as 'pure data' as in there's nothing but
> data in this… if a enum captures a socket… its impure?"
>
> "is that the name here?.. enums are pure or impure?" · "and if that's the
> name…. does holder evolve into a purity check?"

**4.6 — the fifth question, named as a law.** `293/REALIZATIONS.md:1003`

> "this feels like the only answer — the alternative reads like a deferral…..
> when we make our decisions we are building towards a solution that minimizes the
> chance of being revisited in the future — we bias towards long term stability..
> how does this bias change our mind?"

**4.7 — the station correction.** `293/REALIZATIONS.md:1034` (and `:1199`)

> "you typically never do any real coding work — we just do the design debates
> here and delegate to sonnet to build."

**4.8 — four questions, not a lean.** `293/REALIZATIONS.md:1026`

> "decisions needs four-questions to inform the debate."

**4.9 — inheritance, in retrospect.** `293/REALIZATIONS.md:1005`

> "we've been trying to kill inheritance for… idk how long… i don't even know why
> i went down this path…. we built it to realize we don't need it… its easier
> without it."

**4.10 — `parent` is wrong.** `CLOSE-SEQUENCE-293-294.md:42`

> "parent as an attribute is wrong"

**4.11 — annihilate the variance.** `9d1e3ff3b` body

> "annihilate the variance ... i break shit because its already broken,
> successfully."

**4.12 — the ignition of 294.** `294/REALIZATIONS.md:16–19`

> "we built it well enough for us to find what i'm calling catastrophic flaws …
> we can decide to gut what we did and do it better."
>
> "there is never 'well, there's 1+ ways to do a thing' — that is where
> catastrophic flaws get built."
>
> "i was never happy with the tagged stuff … it was a bridge to its annihilation."
>
> "edn goes in and vectors get built … holon can host all of edn."

**4.13 — the keystone, as he received it.** `294/REALIZATIONS.md:20`

> "holy shit … it reduces to 'Hologram' — that's … woooooowwwww."

*(Quote this one WITH the void from 4.16, or not at all. Quoting the delight
without the retraction would be the chronicle reporting a wrong thing as the
finding.)*

**4.14 — the homecoming.** `294/REALIZATIONS.md:116–117`

> "LOOK AT THE COSINES — it's been like 3 months since we've done a holon thing."
>
> "wat was my detouring all of the holon work because i fucking hate rust but need
> rust's perf."

**4.15 — the entanglement ruling.** `CLOSE-SEQUENCE-293-294.md:5` and `:29`

> "293 and 294 getting entangled is a problem we've not faced and i don't want to
> experience this again — no slip out of sequence again."
>
> "this is our priority — we block all 293 and 294 work until this is resolved.
> build solutions such that they satisfy the closing requirements for 293 and 294
> if applicable."

**4.16 — THE VOID.** `294/RULING-holonast-and-hologram-are-both-correctly-named.md:9, :11`
(also `341eb81e8` body, and re-quoted at `255/REALIZATIONS.md:715–716`)

> ":wat::holon::Hologram is currently correctly defined.... the hologram is the
> thing you hold and can get objects out who point to more objects.... the
> hologram is made from holons"
>
> "HolonAST needs no change..... it is an AST for building holons.... its far more
> restrictive than WatAST.... but it can hold everything a WatAST can hold....
> HolonAST is an edn.... whatever you can express with edn... you can build in
> holon-ast...."

**4.17 — the dead precedent.** same ruling, §"How this was found"

> "078 is very old and we changed away from that name in 109 or later."

**4.18 — the wire model.** `df6e2e91c` (294.i) body

> "i expect these rust things to just decorate nil..... they contain no edn....
> #wat.io/Sender nil is the data literal for a Sender instance..... a hologram is
> full of holonic data.. but it cannot be represented as edn.. we can transmit
> these as edn but the receiver can gain no knowledge.... there's no edn to
> represent a resource."

**4.19 — the death warrant.** `df6e2e91c` body

> "#wat-edn/opaque has a death warrant."

**4.20 — what does and does not cross.** `f6f8df3b5` (294.j) body

> "we do not transmit bind, bundle, atom, etc etc.... /they are data/.... stuff
> like thermometers as they convey constructor details about the data."

**4.21 — the deletion of the trait.** `3656d1e46` (294.h) body

> "i don't think we need HolonRepresentable at all now."

**4.22 — the last tags.** `5ca6dab57` (294.n) body

> "20 refs.... they go... #wat-edn is annihilated..."

**4.23 — the doctrine note, its own commit.** `d5d17d49e` (2026-06-27, *"294:
doctrine — 'you may only sign your code' (the builder, verbatim)"*)

> "there is no option. period. you sign your code. you may only sign your code."

**4.24 — the diagnostic that could not speak.** `294/REALIZATIONS.md:526`, `:527`,
`:532`

> "we have /very/ rich error messages.. are they failing us?"
>
> "we have tests that are an opaque failure and we are making an active choice to
> mask the failure instead of present it."
>
> "we cannot return to normal work until failures are the exact one — you
> proposing 2 stuns me… that's not an option."

**Count: 24 quote blocks, all located.** The duet is not thin here — it is the
densest of any unit I have read. Note the pattern for the post's register: in 293
R2, R3, R7 the record's own account is *the apparatus reached for the elaborate
reading and the builder reached for the simple one, and the simple one was the
truth* — stated three times, by the apparatus, about itself. And in 294 the
builder's taste both **opened** the arc (finding rot no test reported: *"i'm not
convinced this holds"*) and **closed its keystone** (voiding a rename the
measurements were marching toward). Writing this as a solo substrate report would
not merely be a graded defect; it would invert the mechanism.

---

## The substance test — run by me

Strip every hash, date, file path and line number. What is left that `git log`
does not hold?

**Holds up:**

1. **A derived index can end up in the identity slot, and nothing will notice
   because everything still works.** The holon record stored both its fields and
   its VSA hologram, and `Eq`/`Hash` delegated to the hologram — so identity was
   the *encoding*, and the data was the cache. Every operation was correct; the
   arrangement was backwards. The class generalizes to any system that computes a
   digest, an embedding, or an index from data and then starts keying on it.

2. **A name can record a premise instead of a fact, and the correction can be
   wrong in the other direction.** `HolonAST` was named for VSA, accreted
   code-AST and wire duties, and the arc read the accretion as the name lying.
   The builder's ruling is the sharper reading: *the borrowed roles were real and
   shedding them was right; what remained was still an AST — one for building
   holons rather than for code — and the destination name was already occupied by
   something that had earned it.* Both halves matter: the rot was real, and the
   fix that felt inevitable was wrong. **A recognition is not a finding until the
   other road has read it.**

3. **Measurement can march you toward a wrong conclusion while every individual
   measurement is correct.** The apparatus measured `Hologram`'s 116 references
   and reported them as progress toward the rename; they were the collision. Its
   own account: *"A name the apparatus wrote is internally consistent with the map
   the apparatus wrote it into. Grepping your own map confirms your own map."*
   That is why the void required taste, and why it could not have come from the
   party holding the pen.

4. **"Portable" was the symptom; "pure" was the cause — and naming the cause is a
   stability decision, not an aesthetic one.** A symptom-name is unstable by
   construction: it gets revisited the moment someone traces it to its cause. This
   is a rule a reader can apply tomorrow, and it came with its own disqualifier —
   *a decision that ships a known seam is not a decision, it is a deferral.*

5. **Three things written once are not three things.** Struct, record and
   holon-record differed in three `Value` variants, three constructors, three
   identity fields and 256 match sites — and the apparatus read that surface area
   as essential heterogeneity while the builder read it as one thing written three
   times. He was right, and the tell was that he could not say why: *"i feel like
   one of us is missing something."*

6. **Deleting a namespace can delete a security check, because the namespace was
   the check.** `#wat-edn.cap`'s decoder refusal was `if ns == "wat-edn.cap"`.
   Giving capabilities their real home meant the string no longer discriminated,
   so the refusal had to start asking the registry — which the encoder had been
   doing all along. One concept implemented twice, and the only instance of it on
   a trust boundary.

7. **A tag can be dead and its name still reach a user.** `#wat-edn` was gone from
   the wire and still appeared in eleven user-visible error strings, two of which
   were pinned by golden tests. A retired name that survives in diagnostics sends
   users grepping for something that does not exist.

8. **The diagnostic path can deadlock on the failure it exists to report.** One
   `Err` arm drained a child's stderr while the child was blocked on `readln`. A
   thirty-second hang that read as a hard concurrency bug was two lines, and the
   test reasoned carefully about hangs in the happy path while never considering
   the error path hanging first.

**Does not hold up without the log** (evidence, not argument): the floor numbers
(4112 / 4113 / 4686 / 4694), the descent 645 → 1, the site counts, the byte counts
(250 → 22). Use them as texture; do not build a claim on them.

---

## Open questions and gaps

1. **Neither arc has closed.** `CLOSE-SEQUENCE-293-294.md:207` still shows
   **293.5 — CLOSE** as ⛔ gated on PHASE 1 = 0, items 8–12, and an empty ignore
   ledger. The post must not say "the arc closed." It should say what landed and
   what remains named.
2. **Flaw #5 is still open.** The ruling re-sorted it as *"a scoping cleanup, NOT
   a rename"* — HolonAST doing code-AST duty in `special_forms.rs` (17 vs WatAST's
   2) and `lower.rs` (29 vs 34). I did not check whether it has since been done.
3. **I did not run the floor.** Every floor number quoted here is from a commit
   body. If the post quotes one, it is quoting the record and should say so.
4. **I did not re-run the cosines.** The `1.0 / 0.486 / 0.574 / 0.011` block is
   quoted from `294/REALIZATIONS.md:132–136`. A live re-run would be a stronger
   artifact for the post and the demo is still in the tree
   (`294/BRIEF-294.a-direct-edn-measurement.md`, `afb731de3`). Builder's call
   whether that is worth the cycle.
5. **The `src/holon/` home was minted by an arc-255 commit, not a 294 one.**
   `d43f75887` (2026-08-26, *"HOME-8 strike 1(255): the VSA algebra leaves
   runtime.rs — the first real seam, and it is 1,493 lines wide"*) is the
   `--diff-filter=A` origin of `src/holon/{mod,ast,hologram}.rs`. 294's DESIGN
   calls `src/holon/` the arc's owed home; it was delivered inside the homes
   campaign, twelve days after the wire strikes and four days before the batch
   cutoff. **This is a genuine cross-post hinge with uiol-008** — mention it in
   one sentence, do not narrate 255 here.
6. **The 2026-09-07 file `RULING-holon-is-for-vsa-only-and-a-wall-will-say-so.md`
   is past the cutoff and I did not read it beyond its title.** If it says what its
   name says, the question this unit opened is still live and got a *wall* rather
   than a rename. That is a later post's ending, not this one's.
7. **Slug.** I used `uiol-004-arcs293-294` as given. Series placement, title and
   song are the builder's.
