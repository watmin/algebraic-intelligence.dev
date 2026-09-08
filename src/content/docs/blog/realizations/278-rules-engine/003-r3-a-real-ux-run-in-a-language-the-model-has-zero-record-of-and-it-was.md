---
title: "R3 — a real UX run in a language the model has zero record of, and it was *obvious*"
sidebar:
  order: 3
---

This one we noticed by living it, not by planning it. To get the "hard data" perf measurement the builder
wanted, I sat down and wrote a non-trivial wat program from scratch — `wat-scripts/perf/deep-cascade.wat`: a
depth-N × width-M forward-chain cascade where every level is a 2-way join on the prior level's *derived* facts,
the rule set **built at runtime** by folding `build-rule` over a `range` with `quasiquote` splicing the level
literal, the engine driven through `fire-rules` / `fire-rules'`, timed with `:wat::time::now`, the result a
record `println` renders to EDN. Quasiquote codegen, higher-order folds, the rete verbs, the time API, EDN
output — a real program, not a snippet.

wat has **effectively zero presence in the model's training corpus.** There is no Stack Overflow for it, no
idiom to recall, no "this is how you usually do X in wat." Every line I wrote, I wrote from the language's
*structure*, not from memory of having seen it. By the dynamically-typed-lisp prior, that should have been a
slow, error-prone slog of guess-run-guess.

It was the opposite. Four mistakes, and each one the language *named for me*:

- `query` wouldn't take the constructor — the checker said `param #2 expects :wat::core::fn; got
  Fn(i64,i64)->cascade::Node`, file:line attached → switch to `query-by-type-string`. One shot.
- `foldl` wanted a typed accumulator — `expects PV<…?54>; got PV` → annotate `PV<wat::rete::Rule>`. One shot.
- The sneaky one: `(:wat::core::PersistentVector :wat::rete::Rule)` silently captured the **constructor fn as a
  vector element** (types-as-forms: a bare type name *is* its constructor). The checker printed `got
  PV<Fn(String,…)->Rule>` — the wrong type, spelled out → seed the fold with `(build-rule 1)`. One shot. In a
  dynamically-typed lisp this is a vector with a function hiding in it and a *silent wrong answer* three
  functions later. Here it was a compile error that pointed at the exact shape.
- `readln` rejected the source-constructor form on the wire — `EDN parse error at byte 6: keyword begins with
  ::` → feed it `[depth width]`. One shot.

Four bugs, four exact diagnostics, four one-shot fixes. No spelunking. The builder named the coordinate after
I'd landed on it:

> *"is it fair to say that our diagnostics made it trivial for you to debug and correct your attempt?"*

Yes — and then he saw the deeper thing:

> *"we just casually did a real UX run and it was… trivial… in a lang you're embedding as zero record of… this
> is like wat's purpose as a proof."*

That is the realization. wat's stated purpose is **Rust without Rust's syntax — a spec language**
([[project_wat_is_spec_rust_is_impl]]). This session proved a consequence of that purpose that we had not
stated: **a language whose correctness is forced by types and honest diagnostics is authorable by a model that
has never seen it.** The embedding had no wat idioms to lean on, so the *only* thing carrying me to correct
code was the language's own feedback loop — and it was enough. The proof is not "the LLM knows wat." The proof
is "the LLM *doesn't*, and wrote it correctly anyway, because the language refuses to let vagueness compile."

This is the exact complement of the doctrine that shaped the substrate
([[feedback_no_magic_that_lets_llm_fake_correctness]]): *no magic affordance may let a lower-tier LLM fake
correctness — typed records are mandatory so a made-up field is uncompilable.* We built that to stop an LLM from
**faking** correctness. What this run showed is the same property's other face: the very design that won't let
you fake it also won't let you **fail silently when you've never seen the language** — every wrong shape is a
located, named compile error, so a no-prior model is *forced toward* correctness instead of *away from*
detection. The magic-free, types-mandatory floor isn't just a guard against bad LLMs; it's what makes the
language *teachable by its own error messages*, in real time, to a reader with no history of it.

> We set out to make a language an LLM couldn't lie in. We discovered it's also a language an LLM writes
> correctly the first time it meets it — for the same reason. The diagnostics aren't a debugging convenience;
> they're the corpus.
