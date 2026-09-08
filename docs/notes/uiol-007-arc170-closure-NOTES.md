# Working notes — uiol-007: the closure of arc 170 (INSCRIPTION 2026-07-29)

**Status:** raw notes, not a draft. Read-only pass over `wat-rs` @ `origin/main` (plus the sibling
`scratch` repo, see §3a). Nothing edited in `wat-rs`.

**Placement:** settled that the *unit* is the **close**, not the arc. The arc's body is already
served as 210 rendered pages at `/blog/arc-170-realizations/`, and the closing realization itself
is published **verbatim** at
`src/content/docs/blog/arc-170-realizations/210-the-closing-realization-per-portam-cogitamvs-arc-170-opened-on-argv-an.md`
(216 lines, the full `PER PORTAM COGITAMVS` entry including the song, the three faces, the
un-gilded section, and the clippy admission). **Read that page before drafting.** It is the single
biggest constraint on this post: the *recognition* is not new material.

**Builder's calls (never mine):** the title, the song-drop, and whether this post exists at all
given §5's verdict.

---

## 1. What is settled / what is the builder's call

**Settled (grounded this session):**
- The unit is the close. The arc body is a link.
- The closing sigil is `PER PORTAM COGITAMVS` — already published in full.
- The post's *only* unpublished substance is the **scratch-repo prehistory** (§3a) plus the
  **anatomy of the closing act** (§3f). Everything else duplicates page 210.

**Builder's call:**
- Title. Song. (Never mine.)
- Whether §5's honest verdict ("thin, but two things survive") is worth a post, or whether this
  becomes a short coda appended to the existing chronicle index rather than a standalone piece.
- Whether the scratch repo is publishable at all — it is a *separate repo* (`holon/scratch`,
  extracted per `wat-rs` commit `d7bf03a`) and I do not know its publication status. **Ask before
  quoting it publicly.** Everything in §3a is gated on that.

---

## 2. The hook / through-line — one paragraph

On 2026-04-29 the builder sketched `wat-mcp`: *"what if... we could have a program-as-an-mcp"*, and
collapsed the design himself to one line — JSON-RPC is envelope, the payload is wat source as a
string, **one tool**. On 2026-05-02 he split out `wat-repl` as its own arc. On 2026-05-03 he asked
for the smallest of the three: *"we update the `:user::main` func to accept argv."* Six days later
that third one became **arc 170**. Eighty-one days after that, on 2026-07-29 between 01:39 and
15:32 — fourteen hours — arc 170 closed by shipping `wat --repl` and then `wat --mcp`, ten hours
apart, in a shape neither sketch had predicted (the planned REPL was a rustyline Rust crate reached
by `wat repl`; what shipped is a stdlib **wat** module, `wat/repl.wat`, exposing `:repl::turn`, with
`--repl` as a `Mode` variant that existed only because the argv work had already split the CLI's
global arity check per-mode). **The arc that was supposed to pass a string array closed by
delivering the two arcs it was a prerequisite for.** That is the one move. Not "argv became a door"
— that is page 210's line and it is already published. This is: *the prerequisite ate its
successors, and the closure condition was one of them.*

---

## 3. The story beats, in order, each cited

### 3a. THE PREHISTORY — three sketches, one repo over (⚠ the only genuinely unpublished material)

Sibling repo `/home/watmin/work/holon/scratch` (git; the arcs below are all committed there).
**None of this appears in `wat-rs`'s INSCRIPTION, and none appears in the published
`arc-170-realizations` chronicle** — verified by grep: `INSCRIPTION.md` mentions `scratch` only once
and it is `wat-scripts/scratch-pad/probe-label-closed-set.wat` (line 59, unrelated); the closing
realization (`INTERSTITIAL-REALIZATIONS.md:17483–17705`) contains no reference to scratch arcs 006
or 012.

- **`scratch/2026/04/006-wat-mcp`, dated 2026-04-29** (`INDEX.yaml:10`). Builder verbatim
  (`INDEX.yaml:16-19`):
  > *"i just had a wild idea.... you talked about a :wat::pry::serve ... what if... we could have a
  > program-as-an-mcp.... give the agent a way to run a program /and/ live debug it?..."*

  And the collapse (`INDEX.yaml:26-28`):
  > *"i think... the JSON rpc.. is just a thin wrapper... the input object would be something like
  > '{\"msg\":\":some-edn-form\"}'"*

  `INDEX.yaml:31-34`: *"JSON-RPC is just envelope; the payload is wat source as a string. The
  substrate doesn't translate types. The agent talks wat directly. **One MCP tool: `wat-eval`.**"*

  **What shipped 91 days later** (`fd89bedee`, 2026-07-29 11:59:23 -0700, commit body):
  ```
  in:  {"jsonrpc":"2.0","id":1,"method":"tools/call",
        "params":{"name":"eval","arguments":{"edn":"(:wat::core::+ 2 2)"}}}
  out: {"jsonrpc":"2.0","id":1,
        "result":{"content":[{"type":"text","text":"4"}],"isError":false}}
  ```
  Same body: *"The payload is NEVER converted to JSON — it rides inside a JSON string as
  characters, exactly as written."* — the 2026-04-29 sketch's wire, exactly.
  **Honest limit, do not overclaim:** the sketch's *other* half (live debugging / `wat-pause`
  integration, `(:wat::pause::ls)` discovery) did **not** ship, and `--mcp` shipped from arc 170's
  Rust transport layer, not as the sketched crate. `wat/mcp.wat` is explicitly *not built* —
  `72b061aeb` names it "Stone 2b".

- **`scratch/2026/05/012-wat-repl`, opened 2026-05-02** (scratch commit `68f79d9`, "arc 005 —
  rename wat-pry → wat-pause; arc 012 — extract wat-repl as foundation"). Planned as a Rust crate:
  `README.md:89` "rustyline (line editing + history)", `README.md:91` "Rust shim (rustyline
  frontend; eval dispatch)", one entry point `(:wat::repl::start :context ctx)`, CLI `wat repl`.

  **What shipped:** `wat/repl.wat` — a stdlib **wat** module. `wat/repl.wat:13` states it in its own
  header: *"vocabulary, for a file that contains NO defservice: `:repl::turn`/`eval-and-loop`/
  `eval-form`"*; `wat/repl.wat:124` defines `:repl::turn`; `wat/repl.wat:138`: *"`:repl::turn` and
  nothing else runs on load. The entry point lives in the CLI's `--repl`"*. No rustyline. Not a
  subcommand.

- **`scratch/2026/05/019-wat-cli-options`, dated 2026-05-03** (scratch commit `078381c`). **This is
  the earliest artifact recording the argv ask** — six days before arc 170 opened. Builder verbatim
  (`INDEX.yaml:15-24` / `README.md:5-15`):
  > *"i think we need to ship something like... wat-cli-options.. and we update the `:user::main`
  > func to accept argv who is of a mandatory spec...*
  > *wat file.wat some list of whatever arguments after the file*
  > *argv is /always/ :*
  > *$0 = the wat binary*
  > *$1 = the wat file*
  > *$N = whatever whitespace deliminted string values appaer after the file"*

  And, in the same document (`README.md:34-37`), the line that makes the whole post:
  > *"because wat is static, users /must/ compile their own cli if they want their symbols found -
  > that's the agreement.. they can export their own binary with wat forms bound in the binary.. but
  > they can and should make their own wat to get stuff like **repl** to work for them..."*

  **The word `repl` is in the original argv ask.** In that document it is a *reserved wat-cli
  subcommand* belonging to a different arc (`README.md:92`, `:96`; `README.md:199-200` "arc 012
  (wat-repl) — wat-cli ships wat-repl as default battery; `wat repl` is a reserved subcommand"), and
  `--mcp` is cross-referenced the same way (`README.md:197-198` "arc 006 (wat-mcp) — `--mcp` flag
  similarly"). Both were somebody else's arc. Arc 170 shipped both.

  This document is also cited *inside* arc 170's own DESIGN as the source for Q3
  (`DESIGN.md:1086-1087`): *"Per scratch/2026/05/019-wat-cli-options: 'no silent argv reshaping;
  what the binary received is what the program sees.'"* — so the link is the arc's own, not mine.

### 3b. The arc's opening, as arc 170 itself recorded it

- Arc opened `b433da7cd`, 2026-05-09 08:53:49 -0700, *"arc 170 DESIGN: program entry-point
  contracts + :user::main argv"*. Body carries the builder's framing line: *"brutal rigidity brings
  the paradoxical unbounded flexibility if you play by the rules"* (also at `DESIGN.md:505-507`).
- The DESIGN's own conversation log, beat 1 (`DESIGN.md:1117`):
  > 1. User: *"make :user::main accept argv"*
- Beat 15 (`DESIGN.md:1131`): *"we don't communicate strings - we communciate ast"*
- Beat 16 (`DESIGN.md:1132`): *"why do we even need a name if the forms /are/ the thing that
  matters?"*
- `DESIGN.md:1081`: *"the shape of those functions /is/ the contract.. i think the only strict one
  is :user::main?.."*
- The DESIGN's own summary of what happened to the ask (`DESIGN.md`, historical block):
  *"Arc 170 originally started as 'add argv to `:user::main`.' Substrate-as-teacher cascade revealed
  full program-contract architecture…"*

### 3c. The final week — what closing it actually required

Filtered `git log --date=short origin/main` for 2026-07-23..07-30, arc-170 commits. The last mile,
in order:

| when | commit | what |
|---|---|---|
| 07-26 | `92aa390f4` | **argv actually reaches `:user::main`** — the original ask, wired on day 78 |
| 07-26→27 | `a9d2a26c0` → `5078ce28a` | the execve crusade: `NOTE-execve-is-never-called` → **THE FORK EXECS** |
| 07-27 | `83c2a6467` | `NON EXEMPLAR, SED ORTVS` — the fork bug dead; the deadlock *unconstructible* |
| 07-27 | `b9f19ea5a` | **stopping is a protocol** — the stop asks, waits, severs last |
| 07-27 | `fe77b1f5b`→`d7df1e199` | `eval-with-defs!`, then the REPL itself |
| 07-28 | `591adcdf6` | **`readln` returns an outcome** — the last raising IPC verb walled, 77 files migrated by codemod |
| 07-28 | `ff7756630` `357a223ad` `5b7b58e49` `4c3bd08e8` | closure items #3, #4, #6, #7 |
| 07-29 01:39 | `568cdf822` | **`wat --repl`** — the closure condition |
| 07-29 02:49 | `b9d48a654` | `:wat::edn::read-json` — the JSON bridge's missing half |
| 07-29 11:59 | `fd89bedee` | **`wat --mcp`** |
| 07-29 15:32 | `10234edbf` | **INSCRIPTION** |

**The whole close is one day, 01:39 → 15:32.** Timestamps from `git log --format='%h %ai'`. The
"one turn later" of the realization is 10h20m.

Two beats worth the weeds, because they are *mechanism* not narration:

- **`92aa390f4` — the gate was an arc-115 arity check.** Body: *"The valve was `argv::parse`'s
  single `positional.len() != 1`, which `git log -S` puts at 2b397cc0 — ARC 115, written to enforce
  `--check`'s grammar and applied to every path. It predates the pipe 170 laid… `wat prog.wat --some
  arg` has been EX_USAGE this whole time."* The fix: *"arity belongs to the MODE, not to the parser
  globally"* — `Mode::{Check,Run}` as an enum. **This is what let `--repl` exist.** `568cdf822`:
  *"`Mode::Repl` joins as a VARIANT with its own arity contract — exactly the case arc 170 split the
  global `positional.len() != 1` for (argv.rs's comment named `--repl` by name before it existed)."*
  Still true on disk today: `src/distribution/argv.rs:33` — *"different contracts; giving each mode
  its own means a new mode (`--repl`, …)"*.

- **`5078ce28a` — the deadlock made unconstructible, not fixed.** Body: *"clone3 without an execve
  IS copy-on-write… We chose clone3 for CLONE_PIDFD… The exec was simply never added. Arc 213
  diagnosed that in June and wrote the design; it sat unbuilt."* The probe line:
  ```
  PARENT-ARGV-LEN 2
  CHILD-ARGV-LEN  0        ← the probe has been RED at 2/2 since the day it was written
  ```
  And the argv connection nobody would guess: *"`set_argv(vec![])` at the spawned entry. It works
  now for the reason it could not before: ARGV is a set-once OnceLock, so under COW the child
  inherited it already-populated and the write was a SILENT no-op."* **Under COW, argv could not be
  made empty — the arc's own subject was the witness for the arc's oldest bug.**

### 3d. The closure condition was a *use-the-thing* test, and it worked immediately

- Set by the builder on 2026-07-27, superseding the apparatus's own read one hour earlier
  (`8ffae2073` body): *"The builder's ruling at the close supersedes what I wrote an hour earlier:
  arc 170 does NOT close on the fork bug, it closes on a REPL."* Quote:
  > *"i think our next move is figuring out a repl.... i want to inscribe 170 with a repl."*
- The *why*, in his words (`CLOSURE-BACKLOG.md:73`):
  > *"i think we just ship `wat --repl` so it can access the privileged tooling? that … kinda proves
  > the demo isn't a demo."*
- And it convicted immediately. `fd89bedee` body: *"⚠ THE GATE FOUND A DEFECT, and it is INHERITED,
  not introduced: a record returned from a session loses its declared field names."*
  ```
  ordinary program :  #usr/Point {:x 3 :y 4}       ← correct
  session (--repl) :  #usr/Point {:field-0 3 :field-1 4}
  ```
  *(This face — "the channel's first act was to convict its own builder" — is already published on
  page 210. Do not re-tell it; if used at all, use it as one clause pointing at the link.)*

### 3e. The gates were proved by breaking them

- `568cdf822`: *"`defs` grows in exactly one place — the `FormOutcome::Declared` arm. Severing it
  failed `definitions_persist_across_turns` and ONLY that test… which is how a REPL gate is usually
  vacuous (assert exit 0 and you have proven a process exists)."*
- `fd89bedee`: *"Cutting the single line `session.defs.push(form)` turns 3 of the 5 tests RED."*
- `b9d48a654`: *"RED-PROVED twice (before and after the parametric fix)… absence of a crash is not
  evidence, the surviving evaluation is."*

### 3f. The anatomy of the closing act itself (the other unpublished thing)

This is the part a reader can *take away*, and it is in the INSCRIPTION, which is **not** on the
site.

1. **The stated precondition was measured, not assumed, and rescoped in the open.**
   `INSCRIPTION.md:64-90`. The DESIGN had carried since 2026-05-13: clippy + rustc both clean before
   the INSCRIPTION ships. Measured at close:
   ```
   cargo build --release --all-targets   →  0 warnings          ✓ met
   cargo clippy --release --workspace    →  ~1150 warnings      ✗ NOT met
   ```
   831 of ~1150 are one lint. Builder ruling on being shown it (`INSCRIPTION.md:82-84`):
   > *"clippy isn't zeroed out - let's deal with that after merge - first thing we work on before
   > anything else is driving it back to zero."*
   And it was: `d33010c95` (2026-07-29) is the *very next commit after the INSCRIPTION*, "clippy
   sweep 1/N"; `76cd88cc4` (07-30) reports "clippy 1874 -> 79, result_large_err ZERO"; `770eeaf7d`
   (07-30) "clippy 1874 -> 0". **The rescoping was honoured within 24 hours.** Confirms the
   INSCRIPTION's claim rather than resting on it.

2. **The deferral grep is a gate, not a habit.** `10234edbf` body: *"The mandatory pre-INSCRIPTION
   deferral grep (FM 11, wrap-proof form) returns ONE match: 'out of arc 170's scope', the
   affirmative form FM 11 explicitly accepts, and every item under it carries a named home."*
   Four out-of-scope items, each with an owner (`INSCRIPTION.md:92-118`): the `:field-0` render → arc
   296; `mapv`/`filterv` refusing `PersistentVector` → arc 278's board; the multi-line REPL form →
   arc 300; value-continuity-across-turns → *stated as owned by no arc, with the reason*.

3. **A convention was shipped as a convention, with a live witness that will go red.**
   `INSCRIPTION.md:56-62`: the two-type `ps` vocabulary is *"a **convention, not a wall**"*, and
   `wat-scripts/scratch-pad/probe-label-closed-set.wat` hands the clause a rogue record and
   type-checks green — *"the live witness [that] goes red the day the set is genuinely closed."*
   Closing it structurally means an enum, which costs the readable `ps` line; *"weighed, and the
   readable form kept."*

4. **The DESIGN was trued because it was lying.** `10234edbf` body: its status header still read
   IN FLIGHT with *"CURRENT BLOCKER (Phase 2b): Gap J"* — the deadlock the branch is named after,
   killed at `5078ce28`. Now marked CLOSED with everything below it historical
   (`DESIGN.md:3-13`). `CLOSURE-BACKLOG.md:3-7` banner-marked SUPERSEDED so its "ONE remains" line
   cannot be read as current.

---

## 4. Verbatim builder quotes, with locations

Harvested; nothing invented; nothing paraphrased. Grouped by where they sit relative to the close.

**Setting the closure condition (07-27):**
1. *"i think our next move is figuring out a repl.... i want to inscribe 170 with a repl."*
   — commit `8ffae2073` body, 2026-07-27.
2. *"i think we just ship `wat --repl` so it can access the privileged tooling? that … kinda proves
   the demo isn't a demo."* — `docs/arc/2026/05/170-program-entry-points/CLOSURE-BACKLOG.md:73`.
3. *"we may be done with 170… idk… don't care for now"*
   — `INTERSTITIAL-REALIZATIONS.md:17423` (also `83c2a6467` body, as *"we may be done with 170… idk"*).

**The fork bug (07-26/27):**
4. *"i want to kill the execve concern entirely at this point… /every fork/ needs to perform execve
   before we run our program in the new universe… this is one of the most latent bugs in wat."*
   — `INTERSTITIAL-REALIZATIONS.md:17376`.
5. *"why do we have a cow at all?... do we need cow?.. this is simpler if we don't have it?..."*
   — `INTERSTITIAL-REALIZATIONS.md:17377`. (Commit `83c2a6467` body cites it and calls it *"The
   builder's question [that] dissolved the whole thing"*; the realization at `:17429` says it
   *"dissolved eleven weeks"*.)
6. *"i want the forks to be genuinely new wat processes that are a blank state waiting for a user
   program to be given to them."* — `INTERSTITIAL-REALIZATIONS.md:17378`.
7. *"there is no argv on subprocs — empty array"* — `INTERSTITIAL-REALIZATIONS.md:17425` / `:17475`.
8. *"you're asking for approval to attempt a one line change?"* — same lines.

**At the close (07-29), the three the chronicle records as verbatim:**
9. *"i think we've done it - i think we can inscribe 170's closure and merge (not rebase) every
   commit to main"* — `INTERSTITIAL-REALIZATIONS.md:17501`.
10. *"we've been on 170's deadlock branch for 2.5+ months"* — `:17502`.
11. *"wow..... we can think in wat in the harness now... you have a repl (not perfect, maybe not
    great, but functional and proven...)"* — `:17503`.
    **The apparatus kept his calibration over its own warmer read** (`:17544`, `:17579-17581`) —
    worth naming explicitly if the post touches the register at all.
12. *"clippy isn't zeroed out - let's deal with that after merge - first thing we work on before
    anything else is driving it back to zero."* — `INSCRIPTION.md:82-84`, and again in `10234edbf`.

**Adjacent, same window, if a wider voice is wanted:**
13. *"check doesn't do enough, we need it to do more"* — `53d8ff6d8` body (07-28).
14. *"you need to register these shapes as edn records?"* — `1b17cb561` body (07-26).
15. *"if we are >0 we consider it a failure like a unit/integ test fail."* — `4536e1d3a` body
    (07-30, the clippy ratchet — i.e. the *after*).

**From the opening, for the spine (§3a/§3b):** quotes at `scratch/…/019-wat-cli-options/README.md:5-37`
and `INDEX.yaml:15-44`; `scratch/…/006-wat-mcp/INDEX.yaml:16-34`; `DESIGN.md:1117`, `:1131`, `:1132`,
`:1081`, `:505-507`.

**⚠ Correction to the brief's own figure.** The brief states *"origin/main carries 247 explicitly
attributed builder quotes in commit bodies in this window"* with a given regex. **That number does
not reproduce.** Measured this session:

| query | window | count |
|---|---|---|
| brief's regex `^\s*>?\s*\*?\*?(the )?builder[,:]` | 07-20…07-30 (the brief's own) | **3** |
| same regex | 05-09…07-30 (whole arc) | 48 |
| any line containing `builder` | 05-09…07-30 | 706 |
| lines with `builder` *and* a `"` | 05-09…07-30 | 104 |

The *claim behind* the figure holds — the collaborator is abundantly present in the commit record
and I found 15 usable verbatim quotes without straining. But 247 is not a number I can stand
behind, and the brief's own window returns 3 for its own regex. Flagged per the cite-or-discard
rule.

---

## 5. The substance test — run by me, honestly

**Method:** strip every hash, date, and cross-link. What recognition or mechanism is left that a
reader could not get from `git log` or from the already-published interstitial chronicle?

**The finding that hurts:** the closing realization is **published verbatim already**, at
`/blog/arc-170-realizations/210-…`, 216 lines, including the song, the three faces, the
"convicts-its-own-builder" line, the un-gilded register, and the clippy admission. Every framing the
INSCRIPTION offers — *the closure condition was an aperture*, *zero new substrate*, *a law is
completed by use*, *the REPL is where a language becomes speakable* — is on that page in the
apparatus's own words. **A post built on those beats is redundant by construction, exactly as the
brief warned.** I checked: `grep -rl "PER PORTAM" src/` returns that page and nothing else, but
`grep -rl "clippy isn't zeroed out\|all seven"` also returns it, so even the INSCRIPTION-only
material is partly there.

**What survives the strip — two things, and I think only two:**

1. **The prehistory (§3a).** *An arc opened on the smallest of three features sketched in the same
   week and closed by delivering the other two, in a shape neither sketch had predicted.* That
   sentence has no hash in it, is not on the site, is not in the INSCRIPTION, is not in the
   chronicle, and lives in a **different repository** — which is precisely why nothing downstream
   ever recorded it. The specific reversal is the interesting part: the REPL was sketched as a Rust
   crate wrapping rustyline, reached by a reserved subcommand; it shipped as a *wat* module in the
   distribution, and the CLI mode is a one-form shim over it. The thing planned as Rust arrived as
   wat. That is a claim about what happens to a design when the substrate it targets gets good
   enough — and it is not a claim anyone has made yet.

2. **The anatomy of closing (§3f).** *A closure is an act with a grep.* The precondition measured
   rather than assumed; the miss rescoped **by its author, in the open, with the work named as the
   next unit** — and then actually done in the next 24 hours of commits; the deferral grep as a
   mandatory gate whose one permitted match is the *affirmative* form; every out-of-scope item
   carrying a named owner or an explicit "owned by no arc, here is why"; a convention shipped as a
   convention with a probe that will go red when it stops being one. That is transferable
   machinery. It is not a story about wat.

**Verdict:** **thin but real — roughly one strong section and one strong closing mechanism, not a
full post on its own.** My honest read: this should probably be a *short* piece whose whole job is
(1) the prehistory reversal and (2) the closing discipline, that links page 210 for the recognition
and refuses to re-narrate it. If the builder wants a full-length post, the prehistory needs to carry
it, and that means the scratch repo has to be quotable (see §1). If it isn't, §5 collapses to §3f
alone and I would argue against the post.

I am stating this plainly because the brief asked me to: *"not much" is a finding*, and it is closer
to the truth here than I expected going in.

---

## 6. What this post must NOT do

- **Must not re-tell `PER PORTAM COGITAMVS`.** It is published verbatim at
  `/blog/arc-170-realizations/210-…`. Link it. Do not paraphrase the three faces, do not re-map the
  song, do not re-quote the Latin gloss. One clause plus a link is the maximum.
- **Must not narrate the arc body.** Program contracts, closure extraction, `TIERS.md`'s tier 0→3,
  the `Peer'` family and the de-prime, the three substrate services, the no-hidden-failures crusade,
  stdio-as-defservice, the whole `INTERSTITIAL-CLIFFNOTES.md` (195 KB) — all of it belongs to the
  linked chronicle. Nothing above should appear as a *beat*; the execve stone and the arity stone
  appear in §3c only because each is a load-bearing *mechanism of the close*.
- **Must not re-tell "the channel convicted its own builder."** Page 210's load-bearing face,
  already published, marked `★` there.
- **Must not present the apparatus as sole author.** The closure condition, the pivot that killed
  the fork bug, the clippy rescoping, the calibration, and the merge order are all the builder's,
  and the chronicle marks them so at `:17579-17581` and `:17689`. Any draft that reads as a
  substrate report is a `consonare` rule-11 Level-1 failure.
- **Must not describe anything from a commit subject.** Every claim in §3 came from a commit *body*,
  a file line, or a timestamp.
- **Must not claim a `--no-ff` merge.** See §7.

---

## 7. Open questions and gaps

1. **⚠ THE MERGE WAS A FAST-FORWARD, not `--no-ff`.** The builder asked to *"merge (not rebase)
   every commit to main"* (`:17501`) and `10234edbf`'s body says *"the merge to main (--no-ff
   recommended, 3428 commits ahead / 0 behind)"*. What is on `origin/main` today has **no merge
   commit**: `git rev-list --merges 10234edbf..0364cca61` → `0`, and `d33010c95`'s sole parent is
   `10234edbf`. Both `arc-170-gap-j-v5-deadlock-state` and `origin/arc-170-gap-j-v5-deadlock-state`
   still exist with tip `10234edbf`, fully contained in main. **This does not contradict the
   INSCRIPTION** (which only *recommended* `--no-ff`), so it is not a STOP — but no draft may say
   "merged with `--no-ff`" or "the merge commit". Safe phrasing: *"the branch came home."*

2. **"79 days" vs 81 calendar days.** `INSCRIPTION.md:5` says *"opened 2026-05-09, 79 days"*.
   2026-05-09 → 2026-07-29 is **81** days; 79 days lands on **2026-07-27** — the day the fork bug
   died and the builder said *"we may be done with 170… idk"* and set the REPL condition. Small,
   internally explicable, not a contradiction. **The commit count is exact and I verified it:**
   `git rev-list --count b433da7cd..10234edbf` → **3428**, matching the INSCRIPTION's "3428 commits
   ahead of main" precisely. If the post uses a duration, prefer *"eleven weeks"* or *"seventy-nine
   days"* quoted **as the INSCRIPTION's own figure**, not restated as measured fact.

3. **The floor `4183/4183, 262 skipped` is not re-verifiable by me.** It is a claim about the tree
   at `10234edbf`. It is *consistent* with the monotone run of same-day figures in commit bodies
   (`568cdf822` 4175 → `b9d48a654` 4175 → `fd89bedee` 4180 → INSCRIPTION 4183). I did not run the
   floor and the tree has moved 5+ weeks since. Cite it as the INSCRIPTION's stated figure.

4. **The brief's "247 builder quotes" does not reproduce.** See §4's table. Do not put that number
   in a draft.

5. **Publication status of the `holon/scratch` repo is unknown to me** and the whole of §3a depends
   on it. `wat-rs` commit `d7bf03a` records "scratch: extracted to its own repo; remove from holon
   tracking + gitignore", so it is a real separate repo, but I do not know whether it is public or
   whether the builder wants pre-arc sketches quoted. **Ask before drafting §3a.** If the answer is
   no, §5's verdict drops to "§3f only" and I would recommend against a standalone post.

6. **I did not check whether `wat --mcp` still exists in its 07-29 shape.** `src/distribution/argv.rs`
   today shows `--repl`, `--mcp` *and* `--grep` (line 108 carries a builder quote dated 2026-08-24:
   *"it must be --grep to match with --repl and --mcp"*), so the mode family grew after the close.
   Out of scope for a post about the close, but a draft must not imply the CLI's mode set has been
   static since.

7. **Unread, deliberately:** `INTERSTITIAL-CLIFFNOTES.md` (195 KB) beyond confirming it does not
   index the closing sigil; `REALIZATION-CAPABILITY-CIRCUIT.md` (156 KB); the ~200 BRIEF/SCORE/
   EXPECTATIONS files. All are arc-body material and by the scoping constraint belong to the linked
   chronicle. If a draft wants a beat from any of them, that beat is probably out of scope.
