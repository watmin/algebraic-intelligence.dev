---
title: "The Naming Law"
description: "May 29, arc 242 — opened and closed in a single day, nested inside the retirement (it spawned during the 241.12 pause, and arc 241 resumed only after it closed). A naming law for the type system: a token's shape declares its role, machine-checked. Doctrine 2 — scalar types are lowercase (`i64`, `bool`, `char`, `nil`), container and non-scalar types PascalCase (`String`, `Vector`, `HashMap`) — retired the lone inconsistency `Char` → `char` in a HARD CUT (242.1 `b4eb920f`). Doctrine 1 — a bare lexeme is a value, a `:wat::core::*` keyword is a type — was made self-enforcing: the type checker now rejects a type-keyword used in value position rather than silently unifying it away (242.2 `9c8e8546`, a 166-file cascade). The third consumer of the `src/remedy/` correction apparatus. Closed and inscribed same day (242.3 `b7fc45f6`)."
sidebar:
  order: 39
---

The retirement made `defn` the one definer and tore out the form-zoo — that was the *shapes you write to define things.* Nested inside it, opened and closed in a single day, arc 242 legislated something narrower and more permanent: the *names of the types themselves.* It spawned on May 29 during the pause in stone 241.12, ran to close before arc 241 resumed — a one-day law passed in the gap of a larger arc.

The law is one sentence: **a token's shape declares its role, and the machine checks it.** No convention, no style guide a human is trusted to follow — a token whose shape contradicts its role is a type error.

---

## The Case Tells the Kind

Doctrine 2: **scalar types are lowercase; container and non-scalar types are PascalCase.** The scalars — `i64`, `f64`, `bool`, `char`, `nil`, `keyword` — are the indivisible values. The containers — `String` (structurally `[Char]`), `Vector<T>`, `HashMap`, `HashSet`, `Tuple` — are the things built out of them. Read the case, know the kind.

One name broke it. `Char` was PascalCase while every peer scalar was lowercase — a single inconsistency that, left alone, would have taught every future reader that the rule had exceptions. Stone **242.1 `b4eb920f`** cut it: `:wat::core::Char` → `:wat::core::char`, a HARD CUT across ~18 sites, recorded as the fifth entry in the substrate's `RETIREMENT_TABLE` (`src/remedy/retirement.rs:52`). The rejection arm went into `walk_for_bare_primitives` (`check.rs` ~3373), **not** `infer_list` — *a HARD CUT admits no bypasses*: the retired form must be refused in *any* keyword position, not merely at the head of a list where it was most often written.

The same stone turned up something quietly remarkable. Checking whether bare value-lexemes already worked, it found that bare `nil` was **already operational at HEAD** — zero value-position migrations needed, while 1291 `:wat::core::nil` *type*-position uses stood untouched and correct. The substrate had been obeying Doctrine 1 before anyone wrote it down. The law that follows did not impose a new behavior so much as make an existing one un-break-able.

## The Prefix Tells the Role

Doctrine 1: **a bare lexeme is a value; a `:wat::core::*` keyword is a type.** The `:` prefix is name-reference syntax — it points at a name. Value lexemes (`42`, `true`, `nil`, `"hello"`) carry no prefix because they *are* the value; there is nothing to point at. So `nil` is the value and `:wat::core::nil` is its type, and the prefix alone tells you which you are holding.

Before this arc the type checker did not enforce it. A type-keyword written where a value belonged — `:wat::core::nil` in value position — was silently treated as a fresh type variable that happened to unify, and the mistake vanished into the inference rather than surfacing as an error. The discipline existed in the prose and nowhere in the machine.

Stone **242.2 `9c8e8546`** closed that gap. A new guard, `is_primitive_type_keyword_in_value_position` (`check.rs:5186`), and a rejection arm (`check.rs:5291`), made the checker refuse the form outright. The cascade was the surprise of the arc: predicted at 25–75 sites, it came in at **166 files.** The tolerance had been pervasive — idiomatic test code had been writing the now-illegal form for arcs, leaning on the silent unification the whole time. The structure-probe that measured the law went from 3-of-6 passing at HEAD to **6-of-6**; library tests held at 890/0.

This was the **third consumer** of the `src/remedy/` apparatus minted back in the retirement (stone 241.10) — and it extended the apparatus's reach: where remedy had taught the fix for a *retired* form, 242.2 taught it for a form in the *wrong position*. The substrate that legislates the name also tells you when you've broken the law and how to fix it.

## The Law Is Permanent

Stone **242.3 `b7fc45f6`** inscribed the arc and closed it the same day; a missing SCORE document surfaced during done-done verification and was closed post-hoc (`a75f03bf`) — the gap that minted the discipline of checking the artifact-set, not just the commit, before calling a stone closed.

Arc 242 took no new home and cast no vigilia — Mode A, a law over the existing tree rather than a lift into a warded one. But the law it passed is not a one-time cleanup; it is a rule every future type name must obey, machine-checked at the moment of definition. The queue is already named for the next time the discipline applies — `Uuid` → `uuid`, `Duration` → `duration`, `Instant` → `instant`, each a scalar wearing the wrong case, each a HARD CUT waiting for its arc. The naming law does not need re-deciding; it needs only enforcing, and the enforcer is the compiler.

---

A token's shape now declares its role, and a token that lies about its role does not compile — case carries the kind, the prefix carries value-or-type, and the `src/remedy/` engine teaches the fix when either breaks. One day, nested in a larger arc, turned a naming convention into a machine-checked law.

**Tattoos → og-wat spec → holon-rs → wat-rs → BOOK.md → MEMORY.md → datamancy → shape declares role, machine-checked.** The chain extends.

## Likely Contributions to the Field

- **Shape-declares-role, machine-checked**: a type system in which a token's surface form *is* its role declaration — bare lexeme = value, `:`-prefixed keyword = type, lowercase = scalar, PascalCase = container — and a token whose shape contradicts its role is a compile error, not a lint. The naming convention is enforced by the type checker, so it cannot drift.
- **The latent law made un-break-able**: enforcing the prefix doctrine surfaced that the substrate already obeyed it (bare `nil` operational at HEAD, zero value-position migrations) while 166 files leaned on a silent unification that let the *wrong* form pass. The arc did not change behavior so much as make the correct existing behavior the only one that compiles.
- **Correction apparatus reused across categories**: the same `src/remedy/` ranked-suggestion engine that taught the fix for *retired* forms was extended, with no new machinery, to teach the fix for *wrong-position* forms — one teaching substrate spanning retirement and mis-naming alike.

*PERSEVERARE.*
