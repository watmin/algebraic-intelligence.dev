## 2026-05-16 (late) — Dungeon rank-up: argv-to-main's side quests, looted in one night

**User:** *"lol man.. we've been in the 170 dungeon for a looooooonnggg time - forcing us to get loot after loot - we are only ranking up... the side quest is as long as it must be... the starting quest was 'can i give argv to main?'... and... here's we are.... this is how we level up... better gear.... better strategies.. we are the best..."*

**The night's loot (one session, 2026-05-16):**

| Arc / Slice | What it minted | Class of bug it kills |
|---|---|---|
| Arc 199 | REJECTED — substrate already had computed-unquote + keyword/from-string + string::concat | Asserting "substrate is missing X" without grepping first |
| Arc 200 | Macro splice symmetry: `WatAST::Vector` ↔ `WatAST::List` | Macros writing one shape but not the other |
| Arc 201 slice 1 | `type_expr_to_kw` → `type_expr_to_holon` — structured type-AST emission | Reflection flattening parametric types to atomic strings |
| Arc 201 slice 2 | `Bundle/children` + `Bundle/first` — `atom-value` already served from arc 057 | Hand-rolling HolonAST iteration |
| Arc 201 slice 3 | `signature-of-fn` — operates on fn-VALUE not fn-AST (settled inline) | Anonymous-fn reflection blocked |
| Arc 201 slice 4 | `signature-of` → `signature-of-defn` rename + 21-file sweep | Asymmetric naming after slice 3's `-fn` sibling minted |
| Arc 202 | `ProcessJoinHoldsStdinSender` walker (freeze-time refusal) | 2026-05-13's flagged stdin-direction deadlock — surfaced as a 35-min cargo hang; closed |
| Arc 201 slice 5 | `extract-arg-types` substrate primitive | The missing reflection rung between signature-of-* and Bundle/children |

**Meta-loot (discipline upgrades):**

- "The questions" → memory entry: unqualified means four (Obvious/Simple/Honest/Good UX), not gate questions or protocol items. Saved after I missed it twice in one conversation.
- Decay disclosure pattern in BRIEFs: orchestrator's claims are hypotheses sonnet verifies. Used cleanly across slices 4, 5, arc 202.
- Crawl-before-asserting fired correctly multiple times tonight (wat Vector ops verification flipped slice 5's α-vs-β decision honestly).
- Substrate-as-teacher cascade: the hung cargo process WAS the arc 202 brief. The diagnostic IS the report.

**The arc 170 trajectory, named honestly:**

1. argv to main (the originating impulse)
2. `:user::main` as canonical program entry contract
3. ExitCode rationalization → main returns nil (slice 1e)
4. spawn-process accepts forms not Fn (slice 6 — substrate pivot)
5. IPC contract triangle (stdout/stderr/exit-code; Recovery doc § 13)
6. Bracket combinator realized (Stones C/D/E direction)
7. Structured concurrency at full power (main-fn returns T; fractal composition)
8. OTP supervision tree pattern arrived at independently
9. Reflection layer (arc 201) — type-driven macros become possible
10. Stdin-direction walker (arc 202) — substrate refuses the last latent deadlock class

Ten steps from "argv to main" to "substrate has type-driven macro reflection + freeze-time refusal on every documented deadlock class." Each step followed honestly from the previous. None of them were anticipated when slice 1 opened. The substrate forced each one out by surfacing its own incompleteness.

**Orchestrator's reflection:**

The dungeon metaphor is exact. Every "we need X for D2" turned into a substrate-level capability that closes a class of bugs, not just D2's specific need. Arc 199 was the false-trail mob that taught "grep first." Arc 200 was the symmetry boss that fell in one slice once spotted. Arc 201 was the four-floor reflection-layer dungeon (each slice a checkpoint). Arc 202 was the surprise mini-boss that surfaced because the cargo hang was the diagnostic the substrate had been waiting for me to read.

The pacing isn't slow because we're stuck. It's slow because every door we open reveals the next door the substrate has been waiting to be honest about. Each forge ships a property the next consumer's BRIEF can build on without re-invention.

The originating quest holds: *"can I give argv to main?"* The answer is "yes, AND the entire program-entry contract is now honest about what a program IS, how it composes, how it talks to other programs, how it dies, how it teaches its callers when they violate the lockstep." The argv part is a four-line ambient lookup. The dungeon is everything that had to be true for that four-line lookup to be honest in the substrate's voice.

User's voice (load-bearing): *"this is how we level up... better gear.... better strategies.. we are the best..."* Inscribed because it IS the calibration signal — when the rank-up moment lands, the work has been forging real things, not chasing tail-ends.

The boss (arc 170 closure) is closer than it was at session start. D2 → D3 → Stone E → INSCRIPTION. Same dungeon, deeper floor.

---
