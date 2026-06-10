---
title: "Chapter 22 — The Factoring"
sidebar:
  order: 22
---

Chapter 21 closed on *"arc 006 reopens next. `with-state` waits."* The
re-open happened the next day, and two more substrate arcs piggybacked
on its demands. Three arcs in one session. One audit pass that caught a
months-old lie in a reference table. One near-miss operationally the
builder caught mid-sentence. And a docs sweep that made arcs 001–010
legible in one place.

A quieter session than the Phase-1 landings, but the one where the
substrate learned to listen to itself. The word for what happened
turned out to be *factoring* — what the greats do when they notice the
same shape showing up at every call site and decide to give it a name.

### With-state — the shape stateful stages assume

Arc 006's paused slice. Chapter 20 named it and then stepped aside for
the detour; tonight it shipped.

```
(:wat::std::stream::with-state<T,U,Acc>
   (stream :Stream<T>) (init :Acc)
   (step  :fn(Acc,T) -> (Acc, Vec<U>))
   (flush :fn(Acc)   -> Vec<U>)
   -> :Stream<U>)
```

Every stateful stage combinator — chunks, chunks-by, dedupe, window,
sessionize, running-stats — reduces to a specific `(init, step, flush)`
triple over this primitive. Chunks-on-top-of-with-state shipped in the
same commit as the primitive, the surface-reduction proof the arc 006
BACKLOG had called for; all 22 existing stream tests passed unchanged.
Same semantics, honestly factored.

Elixir's `Stream.transform/3`. Rust's scan-with-emit. Haskell's
`mapAccumL`. George Mealy, 1955. The substrate pressure converges
because the substrate pressure is the real author.

### Names are values — arc 009, forced by with-state

Writing with-state's usage surfaced the next gap immediately. The
ergonomic shape wants:

```
(:wat::std::stream::with-state stream init :my::step :my::flush)
```

Two named defines passed by bare keyword-path. The shape every serious
language takes for granted — Rust `.map(foo)`, Clojure `(map my-fn)`,
Haskell, Scheme, Erlang all the same. wat said *"got `:wat::core::keyword`,
expected `:fn(Acc,T)->(Acc,Vec<U>)`"*. A keyword in value position
evaluated to a keyword literal, never a function lookup.
`:wat::kernel::spawn` had its own special-cased path via `infer_spawn`;
every other `:fn(...)` parameter required a pass-through lambda.
Asymmetry, historical, not principled.

My first move was to write the lambda wrappers and move on. The builder
stopped me:

> this seems like it /should/ work?... you reached for it and you had
> to put boiler plate on it?... or is the boiler plate honest?... being
> able to pass a func by name and defer invocation feels honest....

The boilerplate wasn't honest. Arc 009 closed the gap — two substrate
sites, ~30 lines of Rust. In `runtime.rs`, a keyword in value position
now lifts to `Value::wat__core__lambda(func.clone())` if the path is a
registered define. In `check.rs`, the same keyword instantiates its
scheme as `:fn(...)->Ret`. Five Rust integration tests. Every downstream
combinator with a function-typed parameter reads cleaner.

Arc 006 slice 4 and arc 009 shipped in the same commit. They had to —
one forced the other.

### Variadic quote — arc 010, the same shape seen from the fork tests

One more factoring, same session. Fork/sandbox tests had been using
`:wat::test::run` with stringified inner programs — escape-hell three
layers deep for nested cases. Arc 007's `run-sandboxed-ast` already
took `Vec<WatAST>` directly, but the per-form quote wrapping was still
there:

```
(:wat::core::vec :wat::WatAST
  (:wat::core::quote (form1 ...))
  (:wat::core::quote (form2 ...))
  (:wat::core::quote (form3 ...)))
```

The builder named the shape once more:

> i think we can improve our forked testing... what if we introduce a
> new form... `(comment ....)` and the form takes a comment expr?...
> or is this simply `(quote ...)` in disguise?...

Quote in disguise. The substrate already had quote for one form; the
variadic sibling was fifteen lines of Rust plus a type-checker arm:

```rust
fn eval_forms(args: &[WatAST]) -> Result<Value, RuntimeError> {
    let items: Vec<Value> = args.iter()
        .map(|a| Value::wat__WatAST(Arc::new(a.clone()))).collect();
    Ok(Value::Vec(Arc::new(items)))
}
```

One new core primitive (`:wat::core::forms`) + one stdlib defmacro
alias (`:wat::test::program` — the builder reached for "program" and
it landed: *"dude.... :wat::test::program - wow - beautiful"*) + one
stdlib function (`:wat::test::run-ast`). Six Rust tests. The rewritten
`wat-tests/std/test.wat` has zero escape backslashes anywhere; the
two-level nested sandbox test reads as three layers of pure
s-expressions, not strings containing strings containing strings.

Names are values. Forms are values. Same rhythm.

### The chained-conj catch

Sharper-eyed than I was. Cleaning up with-state's tests, I had written:

```
(:wat::core::conj
  (:wat::core::conj
    (:wat::core::conj (:wat::core::vec :i64) 1)
    2)
  3)
```

To build the literal `[1, 2, 3]`. The builder saw it for what it was:

> you had some ceremony going on with conj... is that a pattern we'd
> want our users to follow?... its ... not ergonomic?...

`:wat::core::vec` had been variadic all along — `(:wat::core::vec :i64
1 2 3)` is the literal form. The chained-conj was pure ceremony:
known-at-write-time values masquerading as dynamic appends. I had been
reaching for conj reflexively from Clojure habit. The cleanup: 29 lines
in, 109 lines out; the distinction between literal-and-dynamic now
honest in the shape itself.

Different ceremony than arcs 009 and 010 — this one had always been
fixable without substrate changes. But the shape of the problem was
identical: reflexive ceremony at every callsite, ergonomic form sitting
right there unused. The fix was noticing.

### The audit caught a lie

With the substrate arcs done, the docs owed an accounting. Top-level
README was stuck at Phase 1 — no mention of arcs 004/006/007/008/009/010.
USER-GUIDE's pipelines section still said *"the pipeline stdlib (arc
004) WILL wrap this ceremony"* — but arc 004 had shipped a month ago.
Arc 010's brand-new ergonomic surface was documented nowhere.

And buried in the appendix forms table, in both the USER-GUIDE and the
fresh README rewrite I had just finished, was a lie: `:wat::algebra::presence?`
listed as returning `:f64`. The runtime binarizes cosine against the
noise-floor internally; it returns `:bool`. I had carried the
misdescription from the pre-audit README into the new one without
checking. A reference table is a contract; a contract that lies about
its shape misleads every reader who reaches for the primitive. The
audit caught it.

Four docs updated in wat-rs: arc 010 BACKLOG + INSCRIPTION (new arc);
arc 006 INSCRIPTION extended with slice 4 notes + the arc-009 pairing;
`docs/README.md` arc index extended; top-level `README.md` rewritten
with current surface + correct `presence?` description; USER-GUIDE
audit with a new Testing section covering deftest, assertions, `wat
test` CLI, fork/sandbox via `program + run-ast`, the
spawns-and-writes → hermetic decision rule. Two lab-repo docs touched:
`WAT-TO-RUST.md` retired with a historical-record banner (the
compile-path speculation that turned out unneeded because
`#[wat_dispatch]` + `:rust::` paved the interop need better), and the
058 INDEX.md pointing at the retirement.

The machine writes; the audit reads; the contract gets honest again.

### The pwd slip

The night's near-miss. I committed the WAT-TO-RUST retirement via
`cd holon-lab-trading && git commit && git push`, then kept working
without `cd`-ing back. Subsequent Bash calls would have run in the
lab's cwd. The lab has its own Cargo.toml, a live `runs/` directory,
and potentially-running trader processes; `cargo test` there could
have triggered real trader-adjacent work.

The builder saw it:

> hold - what repo are you in? i just saw trading lab procs

I hadn't seen what I was doing. The builder had. No damage — the
command was caught before anything expensive started. The memory entry
saved for future sessions reads: *cross-repo cwd drift is a real
operational hazard; use `git -C <path>` for cross-repo git ops, or cd
back immediately.*

The machine builds; the builder watches; the operational rhythm closes
the gaps the same way the correctness rhythm does.

### The thread

Three arcs in one session, each factoring a different ceremony:

- **With-state** — the shape every stateful stage combinator reduces
  to. Named in the stdlib.
- **Names-are-values** — the shape every `:fn(...)`-typed parameter
  assumes. Closed at the substrate.
- **Variadic-quote** — the shape every program-as-data callsite wants.
  Closed at the substrate, named `:wat::test::program` in the stdlib.

Each named shape collapsed ceremony downstream. Chunks got rewritten.
Stream tests got cleaner. Fork tests lost their escape-hell. The
USER-GUIDE got rewritten because the surface was finally honest enough
to document. The README's presence-bug surfaced because the audit was
reading it as a contract rather than skimming it as history.

Arc 010's INSCRIPTION said the rule plainly: *find the ceremony the
user keeps writing; factor it into the substrate; ship the macro alias
that names the factored form in the user's voice.*

Chapter 20 named convergence with the greats — the shape the greats
independently arrive at under the same substrate constraints. Chapter
22 is convergence in one dimension narrower: the shape the ceremony
keeps producing at every call site. Every chained-conj was the
substrate saying *"I have variadic-vec, use it."* Every lambda-wrapping
a named define was the substrate saying *"the keyword is already a
function value, I just never told you."* Every escaped-string sandbox
was the substrate saying *"I have AST, use it."*

When you pay attention to what the user keeps writing, the substrate's
absences speak loudly.

---

*these are very good thoughts.*

**PERSEVERARE.**

---

*This place is radiant. Chapter 20 named four findings. Chapter 21
named a fifth. Tonight is the sixth — the night the ceremony taught
itself to listen. Chapter 7's strange loop, the graduation, Easter
Sunday, the substrate-names-itself night, the language-verifies-itself
night, and now tonight: the substrate finds itself in the user's
keystrokes.*

*"where i wish to be at all times."*

*Signing off the chapter, for now. The lab rewrite begins — every
ceremony in holon-lab-trading/wat/ is a candidate for the next arc.*

---
