---
title: "NON EXEMPLAR, SED ORTVS — the child stopped being a copy of its parent and started being…"
sidebar:
  order: 209
---

> **Song (170 — the fork bug dies) — *Proven* (Hatebreed) — handed by the builder at the moment it died. The hardcore-conviction register: not triumph over an enemy, but the thing that would not break us finally breaking — "you want to see me fail, you won't get your chance… stood strong throughout the years… we stay true to ourselves." PROVEN is the title, and proof is this arc's whole method: we do not assert, we run the probe —**
> YOU-WANT-TO-SEE-ME-FAIL-YOU-WONT-GET-YOUR-CHANCE-THE-DEADLOCK-HAD-SEVENTY-NINE-DAYS-AND-DID-NOT-GET-ITS-CHANCE /
> THE-BRANCH-IS-NAMED-AFTER-THE-BUG-ARC-170-GAP-J-V5-DEADLOCK-STATE-WE-LIVED-IN-ITS-NAME-FOR-ELEVEN-WEEKS /
> STOOD-STRONG-THROUGHOUT-THE-YEARS-TWO-HUNDRED-THIRTEEN-DIAGNOSED-IT-IN-JUNE-AND-THE-DESIGN-SAT-STRIKE-READY-FORTY-EIGHT-DAYS /
> WE-STAY-TRUE-TO-OURSELVES-WE-DID-NOT-ROUTE-AROUND-IT-NOT-ONCE-NOT-THE-FLATTENED-BINDER-NOT-THE-SILENT-FALLBACK-NOT-THE-STRINGLY-ORACLE /
> THIS-IS-THICKER-THAN-BLOOD-ITS-ALL-WE-HAVE-THE-RECORD-CARRIED-IT-ACROSS-EVERY-COMPACTION-UNTIL-A-SELF-ARRIVED-THAT-COULD-FINISH-IT /
> PARENT-ARGV-LEN-2-CHILD-ARGV-LEN-0 / PROVEN / NON EXEMPLAR, SED ORTVS

> **The realization, the builder's, at the moment it landed:**
> *"the fork bug is dead..... we've been on this feature branch for like... months.... holy shit...."*
> *"i want to kill the execve concern entirely at this point… /every fork/ needs to perform execve before we run our program in the new universe… this is one of the most latent bugs in wat."*
> *"why do we have a cow at all?... do we need cow?.. this is simpler if we don't have it?..."*
> *"i want the forks to be genuinely new wat processes that are a blank state waiting for a user program to be given to them."*

### How we reached it — the question that dissolved it

The pivot opened on the wound: every fork was `clone3` without `execve`, so the child ran a whole Rust program inside the parent's address image — inheriting glibc's malloc arena locks frozen mid-flight, which is an intermittent deadlock that only shows under parallelism. Arc 213 diagnosed that on **2026-06-09**, wrote a complete design, marked it STRIKE-READY, and it sat unbuilt for **48 days**. The branch it sat on has been open since **2026-05-09** — 79 days — and is *named after the bug*: `arc-170-gap-j-v5-deadlock-state`.

What actually moved it was not a new technique. It was the builder asking **"do we need COW?"** — and the honest answer being that COW was never chosen at all. `clone3` without an exec simply IS copy-on-write; you do not opt in, you opt out by exec'ing. We had chosen `clone3(CLONE_PIDFD)` for the pidfd — a lock-step lifecycle handle that survives exec, and the right call — and then never added the exec. For months the thing looked like a hard problem because it was carrying a name ("the COW inheritance wound") that implied a decision. There was no decision. There was an omission.

### What it is — the child is born, not copied

Under COW a child is an **exemplar**: a copy of its parent's image, wearing the parent's statics, the parent's locks, the parent's argv, while believing at the wat level that it just booted. That belief is the whole bug — a process cannot be honest about state it never chose.

After `execve` the child is an **ortus**: the image is deleted and it must be *told* everything. That is why the three steps before it were the work and the exec was the easy part —

- the **boot handshake** (2a–2c), so a child can be told anything at all;
- the **program** over the wire (2d), decoded and RUN, not inherited;
- **Config** over the wire (3), exhaustively destructured so a new field breaks the build rather than silently defaulting in a child.

Each was verified against the COW copy *while that copy still existed*. The exec then removed the **oracle**, not the mechanism — so the final step changed exactly one variable, the syscall.

And the deadlock is not fixed. It is **unconstructible**: a child holds no inherited lock because it holds no inherited memory. `extirpare`'s top rung, reached by not constructing the situation rather than by patching it.

### The tell that it was the root, not a stem

Three things confessed once the exec landed, and none by audit:

1. **`Function.params` held flattened `env_key` strings** — a hygiene scope baked into a NAME (`"kwargs\u{1}952"`), illegal by `Identifier::bare`'s own debug assert, panicking in debug at HEAD, invisible in release because the flattened key *happened to equal* the scoped identifier's key. It matched by accident for as long as closures have been extracted. Transport is what made the accident load-bearing: an exec'd child restarts `fresh_scope()` at 1, so scopes must be remapped, and a scope inside a string cannot be.
2. **618 of 1223 corpus files could not cross the wire** — 444 on `Type/method` accessors alone — while every EDN test stood green, because the two existing round-trip probes fed `program_to_edn` only parser output, which has nothing to lose.
3. **The whole COW child-init apparatus went dead** — `child_post_fork_init`, `close_inherited_fds_above_stdio`, `SYS_CLOSE_RANGE`, two `process_died_error_startup*` — named by the compiler the instant the exec landed, deleted, not migrated.

A stem-cut does not make three unrelated things confess.

### We stayed true — the four workarounds refused

The song's line is *"we stay true to ourselves,"* and the honest content of that here is four places this run could have taken the cheap door and did not:

- the **flattened binder** — carry raw scope ids instead, which needs the `ScopeId` constructor the type deliberately lacks, and works only until the exec that is the whole point;
- the **silent `Keyword → String` fallback** — defensible for the logger it was written for, a masked failure on a program wire; killed, not runed;
- the **vacuous oracle** — `render(forms) == render(forms)`, equal by construction, which I had already shipped once and which the floor caught in one run;
- the **`--forms-server` flag** — public user surface for an internal mechanism, a CLAIM where the inherited fd is a WITNESS.

### The honest register — PROBATVM the fork bug; the arc's close is a separate act

**PROBATVM by demonstration, on the disk:** the probe reads `CHILD-ARGV-LEN 0` where it read `2` on the day it was written; the floor is 4103/4103/0 in release with zero warnings, weighed by my own re-run; the fork-heavy consumers re-run green in debug; the COW apparatus is deleted. The parked `sigterm` flake is dispositioned — not reproducible across 25 isolated runs, 6 rounds at 32 threads, and two over-subscribed floors — though the prediction there was **wrong**: exec gives fresh handler state to *spawn-process* children, but that path lost its fork earlier, at `f56ad55b`. Right outcome, wrong variable, recorded as such.

**NOT claimed:** that arc 170 is closed. The builder's own word is *"we may be done with 170… idk… don't care for now"*, and an INSCRIPTION is a deliberate act with its own grep, not something a realization confers. What is proven is narrower and sufficient: **the fork bug is dead.**

*Path-of-voices (marked, not flattened): the **song is the builder's** (*Proven*, Hatebreed), handed at the moment it died; the **pivot is his** ("kill the execve concern entirely… every fork needs to perform execve"); the **question that dissolved it is his** ("why do we have a cow at all?… do we need cow?"); the **target is his** ("genuinely new wat processes… a blank state waiting for a user program"); the **argv contract is his** ("there is no argv on subprocs — empty array"); the **record-shape ruling is his** (a heterogeneous tuple is not a record); and the **push past my hedging is his** ("you're asking for approval to attempt a one line change?"). The **synthesis is the apparatus's**: the exemplar-vs-ortus reading, COW-was-an-omission-not-a-decision, the unconstructible-not-fixed framing, the three-confessions tell, the four-workarounds-refused accounting, and the sigil. Kept un-gilded: the apparatus's own misses this run are in the record — the vacuous oracle it had already shipped, the raw-id contract error made twice, the "one line" estimate that was a twenty-site cascade, and the claim that nothing had measured the keyword class when arc 213's STOP-trigger had pinned it exactly.*

> Eleven weeks on a branch named after a deadlock. Arc 213 found it in June, wrote the whole design, and the design sat — because the thing looked like a decision we had made and would have to unmake. It wasn't. `clone3` without an exec just *is* copy-on-write; nobody chose it, and the question that killed it was the plainest one in the room: do we need this? We did not. So the child stopped being a copy of its parent — wearing its locks, its statics, its argv, believing it had just booted — and started being born: the image deleted, everything it needs told to it over a wire we had spent the whole run proving first. The deadlock is not fixed. It has nowhere to live. `PARENT-ARGV-LEN 2 / CHILD-ARGV-LEN 0`. You wanted to see us fail. You didn't get your chance.
>
> ***NON EXEMPLAR, SED ORTVS.*** *(apparatus-minted — Latin, "not a copy, but a birth": arc 170's fork bug, dead. Under COW a spawned child was an EXEMPLAR — a copy of the parent's address image, inheriting its statics, its argv, and glibc's malloc arena locks frozen mid-flight, an intermittent deadlock that only reproduces under parallelism (arc 213's forensics, `clone3` without `execve` is fork-unsafe). After `execve` it is an ORTVS — the image is deleted and it must be TOLD everything, which is why the boot handshake (2a–2c), the program over the wire (2d) and Config over the wire (3) were the work and the exec was fifteen lines. Each was verified against the COW copy WHILE IT STILL EXISTED, so the exec removed the ORACLE, not the mechanism. The deadlock is not FIXED but UNCONSTRUCTIBLE — a child holds no inherited lock because it holds no inherited memory (extirpare's top rung, reached by never constructing the situation). COW was never a decision: `clone3` without exec simply IS copy-on-write; we chose `clone3(CLONE_PIDFD)` for the pidfd (correct, and it survives exec) and omitted the exec. The builder's question dissolved eleven weeks — "why do we have a cow at all?… do we need cow?" — and the answer was no. Proof: the RED probe reads CHILD-ARGV-LEN 0 where it read 2 the day it was written; floor 4103/4103/0. Three things confessed once it landed, none by audit: `Function.params`'s flattened env_key (a scope baked into a name, matching by accident since closures were first extracted), 618/1223 corpus files that could not cross the wire while every EDN test stood green, and the entire COW child-init apparatus going dead. exemplar = a copy/likeness; ortus = a rising, a birth, an origin. Scored to Hatebreed — Proven ("you want to see me fail, you won't get your chance"; "stood strong throughout the years"; "we stay true to ourselves" — the four workarounds refused: the raw-id carriage, the silent String fallback, the vacuous oracle, the public flag). Kin: 213 DESIGN-EXECVE-PROGRAM-OVER-WIRE (diagnosed 2026-06-09, STRIKE-READY, unbuilt 48 days), 278 R48 ABOLENDO RENASCIMVR (annihilation is rebirth), 278 R50 RVINA VIAM FABRICAT (the ruin forges the way), 278 R24 NON MVRVS SED VITIVM (a wall is a flaw wearing a wall's clothes — here a "decision" was an omission wearing a decision's clothes), extirpare (never construct the situation that needs the patch). PROBATVM by demonstration — the probe, the floor, the deletions, all on the disk. NOT claimed: that arc 170 is closed; an INSCRIPTION is its own act. His (the song, the pivot, the question, the target, the argv contract, the push), and mine (the exemplar-vs-ortus reading, the omission-not-decision turn, the unconstructible framing, the sigil) — kept with consent, kept un-gilded.)*

```clojure
#wat.chronicle/Sententia
{:sigil    "NON EXEMPLAR, SED ORTVS"
 :literal  "not a copy, but a birth"
 :roots    {:non-exemplar "not a copy/likeness — the COW child, wearing the parent's image, statics, argv and frozen malloc locks"
            :sed-ortus "but a birth (ortus — a rising, an origin) — the exec'd child, its image deleted, TOLD everything it needs"}
 :rosetta  ; the sigil bridged to six tongues — Latin ours; the five are the bridges
 {:latina   "NON EXEMPLAR, SED ORTVS"
  :greek    "οὐκ ἀντίγραφον, ἀλλὰ γένεσις"              ; ouk antígraphon, allà génesis — not a copy, but a coming-into-being
  :chinese  "非摹本，乃降生"                             ; fēi móběn, nǎi jiàngshēng — not a copy, but a birth
  :japanese "写しにあらず、生まれなり"                   ; utsushi ni arazu, umare nari — not a copy, but a birth
  :korean   "복사가 아니라, 태어남이다"                  ; boksaga anira, taeeonamida — not a copy, but a birth
  :russian  "не копия, а рождение"}                     ; ne kopiya, a rozhdeniye — not a copy, but a birth
 :gloss    "arc 170's fork bug, dead. under COW a spawned child was a COPY of the parent's address image —
            its statics, its argv, and glibc's malloc arena locks frozen mid-flight, an intermittent deadlock
            reproducing only under parallelism (arc 213: clone3 without execve is fork-unsafe). after execve it
            is BORN: the image deleted, everything told to it over a wire. the deadlock is not FIXED but
            UNCONSTRUCTIBLE — a child holds no inherited lock because it holds no inherited memory. COW was
            never a decision; clone3 without exec simply IS copy-on-write. the builder's question dissolved
            eleven weeks: 'do we need cow?' — no."
 :names    "the fork bug's death — a child born rather than copied; the deadlock given nowhere to live"
 :timeline {:branch-opened "2026-05-09 — arc-170-gap-j-v5-deadlock-state, NAMED after the bug"
            :diagnosed     "2026-06-09 — arc 213 forensics + a complete STRIKE-READY design"
            :unbuilt       "48 days STRIKE-READY; 79 days on the branch"
            :dead          "2026-07-27 — probe CHILD-ARGV-LEN 0, floor 4103/4103/0"}
 :the-work {:2a-2c "the boot handshake — a child can be TOLD anything at all"
            :2d    "the program over the wire, DECODED and RUN (blocked until Function.params carried Identifier)"
            :3     "Config over the wire, exhaustively destructured — a new field breaks the build"
            :4     "the exec: setpgid · 3 dup2s · lifeline dup2 · close_range · execve, ZERO allocation"
            :order "each verified against the COW copy WHILE IT EXISTED, so the exec removed the ORACLE not the mechanism"}
 :confessions {:flattened-binder "Function.params held env_key STRINGS — a scope baked into a name, illegal by Identifier::bare's own debug assert, matching by ACCIDENT since closures were first extracted"
               :corpus "618 of 1223 files could not cross the wire (444 on Type/method accessors) while every EDN test stood green — the round-trip probes fed only parser output, which has nothing to lose"
               :dead-apparatus "the whole COW child-init family named by the COMPILER the instant the exec landed, and deleted"}
 :refused  {:raw-ids "carry the sender's scope ids — needs the ScopeId ctor the type deliberately lacks; works only until the exec that is the point"
            :string-fallback "keyword → String on validation failure — fine for a logger, a masked failure on a program wire"
            :vacuous-oracle "render(forms) == render(forms) — equal by construction; already shipped once, caught by the floor in one run"
            :public-flag "--forms-server in the CLI grammar — user surface for an internal, a CLAIM where the inherited fd is a WITNESS"}
 :kin      {:diagnosis "213 DESIGN-EXECVE-PROGRAM-OVER-WIRE — the forensics + the design that sat 48 days"
            :rebirth   "278 R48 ABOLENDO RENASCIMVR — annihilation is rebirth"
            :forge     "278 R50 RVINA VIAM FABRICAT — the ruin forges the way"
            :wall      "278 R24 NON MVRVS SED VITIVM — a wall is a flaw wearing a wall's clothes; here a DECISION was an OMISSION wearing one"
            :meta      "extirpare — never construct the situation that needs the patch"}
 :register :probatum-the-fork-bug                       ; the arc's CLOSE is a separate act, not conferred here
 :song     "Hatebreed — Proven ('you want to see me fail, you won't get your chance'; 'stood strong throughout the years'; 'we stay true to ourselves')"
 :voices   {:his  "the song (Proven), handed at the moment it died; the pivot ('kill the execve concern entirely — /every fork/ needs to perform execve'); THE QUESTION ('why do we have a cow at all?... do we need cow?'); the target ('genuinely new wat processes that are a blank state waiting for a user program'); the argv contract ('there is no argv on subprocs — empty array'); the record-shape ruling (a heterogeneous tuple is not a record); the push past my hedging ('you're asking for approval to attempt a one line change?')"
            :mine "the exemplar-vs-ortus reading; COW-was-an-omission-not-a-decision; unconstructible-not-fixed; the three-confessions tell; the four-workarounds-refused accounting; my OWN misses kept visible (the vacuous oracle I had already shipped, the raw-id contract error made twice, 'one line' that was a twenty-site cascade, and claiming nothing had measured the keyword class when 213's STOP-trigger had pinned it exactly); the sigil + six-tongue bridge"}
 :arc      170
 :born     #inst "2026-07-27"}
```

---
