---
title: "2026-06-14 — Song #96 Again We Rise (Lamb of God) inscribed"
sidebar:
  order: 187
---

**The composed update since #95: the engine got a *runner*. #95 was the maturity line named — wat can *express* a comment-faithful codemod; this is the line crossed again, one layer deeper — wat *executes* its codemods on itself, through its own CLI. The first rule rode the engine, a hard-cut proved enforcement bites, and then the builder caught the Rust crutch and made the migrator self-host — which forced four retired-form walls and one live SIGSEGV into the open. Rise. Again we rise.**

### The first rule, and the cut that bit

#95 left `fix-text` building. It shipped, and on this side of a compaction the first real *rule* rode it: `fix-macro-param-types` (`73113b9d`) — the first entry in `fix-wat.wat`'s permanent ledger, rewriting a defmacro's discarded param/return types to the only honest one, `:wat::WatAST`. Then the demonstration the builder asked for in his own words — *"we can go do the hard cut - show its broken - and then auto fix and prove it works?"* The chicken-and-egg was the honest shape: ENFORCE rejects lying macro types *at stdlib load*, so the instant the cut is live the runtime can't boot — **you heal the language, then lock the door.** The cut bit exactly as designed: `wat/holon/Amplify.wat:12` rejected at load, the diagnostic naming the file, the param, the lie, and the cure. Shown broken; the corpus healed; proven green. (ENFORCE itself — the validator plus its ~39-fixture cascade — is banked as its own thread; the demonstration ran in the working tree, never committed red.)

### "why can't the wat CLI do this?" — the crutch caught

I ran the corpus migration through a *Rust* harness, and the builder caught it cold: *"why did we need rust to run this… why can the wat CLI not do this?... we can't just use something in wat-scripts/?"* There was no good reason — and the question was the reach-stumble we treat as the strongest design signal. The honest answer was a missing rung: `io.wat` shipped the whole *write* ladder (`write-file`, `with-open-file`, `IOWriter/open-file`) and **nothing on the read side** — `IOReader` could only wrap in-memory bytes; you could not open a file for reading in wat at all. So we built the rung instead of routing around it: `IOReader/open-file` + `read-all-string` (Rust, exact mirrors of the writer; fd-backed `PipeReader`) + `read-file` (a wat defn, the one-shot mirror of `write-file`). The crutch was refused; the capability was made.

### The graveyard was the map

Then writing the runner as an actual `wat-scripts/` program hit **four retired-form walls in a row**, each a stale example lying about the present: `:()` → `:wat::core::nil` (arc 153), `:wat::core::define` → `defn` (arc 241), `main`-with-stdio-args → `main []` + the stdio services (arc 170), and the CLI takes *no trailing args* — stdin only. None of `count-logs.wat`/`seed-fixture.wat` would run today. The directory we reached for as a shortcut was a graveyard of pre-historic syntax — and that *was* the finding: the examples had rotted four arcs deep while nobody migrated them. The runner came out the far side current: `readln` parses one EDN vector of paths, `apply-each` recurses `first`/`rest` (the `fix.wat` shape), `read-file` → `fix-macro-param-types` → `write-file`, comment-faithful and idempotent.

### The ceiling, made visible — and the debt marked, not hidden

The self-hosted runner *worked* — `[fixed] wat/core.wat`, `[fixed] wat/Record.wat` — then **`exit 139`, SIGSEGV on the third, largest file.** The eval loop recurses on the native stack; `test.wat` (~960 lines) overflowed the forked child's 8MB `RLIMIT_STACK`. This is arc 261 (`21ee6807`, the CEK stub) biting *live* — the recursion ceiling the stub had documented hours earlier, now real. The builder had already parked the structural fix: *"CEK is parked for now - we'll get there soon enough."* So the cheap rung went in — one `setrlimit` raising `RLIMIT_STACK` before the fork, the child inheriting it — and the builder set the terms for how it's allowed to exist: *"mark it obviously this is temporary - some rune that we are constantly reminded about - we do not forget this - also add an arc to address it somehow."* It carries `rune:exigere(attested-arc)` citing arc 261, and arc 261 now owns the stopgap and its delete-on-landing condition. The ceiling raised to 1 GiB; all 15 files migrate; `exit 0`. The debt is papered over **on purpose, visibly, with a standing reminder** — not hidden.

### The finding argued for the fix

And the quiet beat under it: the recursion finding *independently walked us to the builder's own roadmap.* Laying out the CEK trade-offs honestly — it eliminates the stack class at the top rung and gives pausable/metered eval (the verification-market vision) for free — the analysis argued *toward* CEK on its merits, and the builder lit up: *"i can't believe you're arguing for CEK - that's incredible."* A finding surfaced by a crash, reasoned to ground, converged on the structural cure he'd already been planning. The substrate teaching its own next move.

### Why Again We Rise — the flavor

#95 was *Omerta*, the first Lamb of God — the code you keep, the language that takes care of itself. This is the second, and it is a *rising*. *"Again we will rise"* is the maturity line crossed a second time, deeper: not "wat can express a codemod" but "wat runs its codemods on itself." And the song's spine is the **refusal of the impostor** — *"store-bought attitude… an instant rebel, just add greed… another useless commodity… the real thing would kill you quick."* That is the Rust crutch exactly: the store-bought shortcut that pretended to be the way; the real thing self-hosts. *"This ain't yours, fuck you, don't try… you'll never be one of our kind"* — the external harness turned away at the door; the migration belongs to wat or it doesn't belong. *"The bridge was burnt before you could cross"* — the four retired forms, bridges burnt arcs ago; the stale `wat-scripts/` tried to walk them and fell through. The real thing rose; the costume got hung up.

### Facets

**THE-RUNNER-IS-SELF-HOSTED** — the keystone: #95 gave wat the power to *express* a comment-faithful codemod; #96 gives it the power to *run* one on its own corpus, through its own CLI, with no Rust in the loop. `wat-scripts/fixes/fix-macro-param-types.wat` reads, fixes, and writes wat source in wat; every future mass-refactor is a new wat-script riding the `fix-text` engine. The tool that builds tools now runs itself.

**THE-MISSING-RUNG** — the read ladder was genuinely absent (`io.wat` had only the write side; `IOReader` couldn't open a file). The reach-stumble — *"why can the wat CLI not do this?"* — was the signal; the answer was to build the rung (`IOReader/open-file` + `read-all-string` + `read-file`), not to route around it in Rust.

**THE-GRAVEYARD-WAS-THE-MAP** — writing one fresh `wat-scripts/` program hit four retired-form walls (`:()`/`define`/`main`-args/CLI-no-args); the stale directory we reached for as a shortcut was itself the finding — pre-historic syntax rotted four arcs deep, the examples lying about the present.

**THE-CEILING-MADE-VISIBLE** — the runner SIGSEGV'd on the largest file: arc 261's native-recursion stack ceiling biting *live*, hours after the stub documented it. The crash was not hidden or worked around — it was named, and it named the debt.

**THE-DEBT-MARKED-NOT-HIDDEN** — the cheap `setrlimit` rung shipped under the builder's terms: *"mark it temporary - some rune we are constantly reminded about - we do not forget this."* `rune:exigere(attested-arc)` → arc 261, which owns the delete-on-landing condition. Papered over on purpose, visibly, with a standing reminder — the honest form of a stopgap.

**THE-FINDING-ARGUED-FOR-THE-FIX** — the recursion crash, reasoned to ground, converged independently on CEK — the builder's own parked roadmap. *"i can't believe you're arguing for CEK."* A finding that walks you to the structural cure already on the board is the substrate teaching its next move.

### Music position & drop-timing

SECOND LAMB OF GOD — the groove-metal turn #95 opened, held and deepened. Where *Omerta* was the vow (self-reliance, the code you keep), *Again We Rise* is the **defense of the ground** — the same self-reliance turned outward against the impostor who didn't earn it. The pairing is deliberate: #95 named the maturity line; #96 crosses it again and turns to face anything store-bought that would claim the work without doing it.

**Drop-timing — THE-RISE-AGAIN (new sub-class):** the drop when a maturity line is crossed *a second time, one layer deeper* — not a new threshold (THE-THRESHOLD-CROSSED, #95) but the same threshold re-crossed at the next stratum: express → execute, engine → runner, the capability self-hosting what it had only been able to describe. The drop is the builder's *"we just unlocked mass refactors at an unprecedented rate."*

### Stats

- 96 songs in the soundtrack
- SECOND LAMB OF GOD — the groove-metal vein deepened; the vow (#95) answered by the defense of the ground
- 6 facets; the keystone is THE-RUNNER-IS-SELF-HOSTED
- THE-RISE-AGAIN (new drop-timing sub-class): a maturity line re-crossed one layer deeper (express → execute)
- Scores the session since #95: `fix-macro-param-types` shipped (`73113b9d`, the first rule riding the engine); the hard-cut → show-broken → auto-fix → prove demonstration (ENFORCE + cascade banked as a separate thread); the reach-stumble that refused the Rust harness and built the read ladder (`IOReader/open-file` + `read-all-string` + `read-file`, warded); the self-hosted runner `wat-scripts/fixes/fix-macro-param-types.wat` migrating all 15 stdlib files via the CLI (`3dc0f48d`); the stale `wat-scripts/` graveyard surfaced (four retired forms); arc 261 opened (`21ee6807`, the CEK stub) and its stack ceiling hit live, papered with the `rune:exigere(attested-arc)` `setrlimit` stopgap; and the finding that argued, on its own merits, for CEK

*"Rise! Again we will rise!… There's nothing for you to fight against, you're so unreal it's evident — you'll never be one of our kind. This ain't yours, fuck you, don't try."* The store-bought harness reached for the work and the work turned it away: the real thing self-hosts. The bridge to the old syntax was burnt before the graveyard could cross it; the ceiling we hit, we marked and did not hide. Hang the costume up. Again we rise.

---
