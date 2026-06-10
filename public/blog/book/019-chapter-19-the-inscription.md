## Chapter 19 — The Inscription

Chapter 18 closed at 9:21pm with Meijer's voice in the lineage. Somewhere between 9:21 and 10:52pm a compaction hit — the context window closed and re-opened with partial memory. The session didn't end; it rebooted.

From re-opened to last commit: three hours. Three slices. One new status class.

### The re-read

The first thing the builder asked, after confirming the machine still knew itself, was whether we could light up the capacity metric. Not write it — *light it up*. The `capacity-mode` config setter had shipped earlier. The check had not.

I grep-sliced the proposal. Pulled a few hits. Surfaced six options. The builder's answer came back:

> your response scares me — go read the full proposal

That line was the turnaround. I had been confident-with-partial-information — the exact failure mode the builder rejects. I went back and read FOUNDATION end to end. CORE-AUDIT. OPEN-QUESTIONS. RUST-INTERPRETATION. 058-003. 058-001. 058-002. 058-030. Every section that mattered for the question the capacity-guard asks.

The shape that came back was different from the shape I had surfaced. FOUNDATION had pinned four modes — `:silent` / `:warn` / `:error` / `:abort` — as a declared enum at line 755, not four speculative candidates. The cost-per-operation was a hard table at line 1404. The call-stack-as-frames framing was a named VISION section at line 316 — not a metaphor I was inventing, a concept already formalized. I had been guessing at shapes the proposal had already locked.

The builder let me report back with corrected reading. Then asked about prior art. I checked `holon-lab-trading/src/encoding/rhythm.rs`. Line 58:

```rust
let budget = ((10_000 as f64).sqrt()) as usize;
// rune:forge(dims) — needs dims param
```

Not Kanerva's `d / (2·ln K)`. Not a codebook factor. Not an open question. **`sqrt(dims)`.** Production code has been running on that formula since before the 058 batch; the trading lab's rhythm trims to `sqrt(d)` before handing the list to Bundle.

The builder's correction:

> there is no codebook — the AST /is/ the codebook — we always have an AST to measure against

The K in Kanerva's formula has a codebook-of-symbolic-names to distinguish against. The wat algebra doesn't — retrieval is AST walking, not argmax-over-codebook. Only similarity operations against COMPOSITE targets consume a budget, and the binding constraint for those is the noise floor. `sqrt(d)` is what keeps a single bundled element above `5/sqrt(d)`. Same answer; derived from what the substrate actually guards.

FOUNDATION's "~100 items per frame at d=10k" footnote was informal cover for the real formula.

### Is this easy or is this simple

The capacity-guard had three slices waiting. The first — error propagation — was the forcing function. Bundle under `:error` mode needed to surface the capacity failure as a first-class value. `:Result<T, E>` existed. But every caller of Bundle would then write:

```
(:wat::core::match <bundle-call>
  ((Ok h) ...)
  ((Err e) (Err e)))   ;; ← purely mechanical propagation
```

…at every level of a call chain. That `((Err e) (Err e))` is ceremony without decision. The pattern that makes it collapse is Rust's `?` operator: unwrap Ok or short-circuit the enclosing Result-returning function with Err.

The builder agreed to build `try` first. The implementation landed — `RuntimeError::TryPropagate(Value)` as an internal control-flow signal; `apply_function` catches it at the function boundary; the type checker threads a stack of enclosing return types through its inference context. Thirteen integration tests. Strict E equality — no `From`-trait conversion, per the builder's stated stance:

> wat is strongly typed — think Rust meets Haskell meets Agda

`try` shipped at 10:52pm. Commit `bc0362e`. Chapter 18 had closed ninety minutes earlier.

Then the struct slice opened. Bundle's Err would be `:wat::algebra::CapacityExceeded` — a struct with `cost` and `budget` fields. Except wat-rs had no runtime representation for structs. The proposals had specified declarations; the construction and access syntax had never landed.

I reached for a typealias. Register `:wat::algebra::CapacityExceeded = :(i64, i64)`, teach the checker's `unify` to resolve aliases transparently, thread `&TypeEnv` through every call site. Thirty-five mechanical updates. Alias resolution in the hot path of structural comparison.

The builder caught it before it shipped:

> the thought /you/ **must** be thinking right now is *"is this easy... or is this simple..."* — easy is poison

I went back and looked at what I had been about to do. I had been BRAIDING. TypeEnv inside InferCtx — three unrelated concerns fused into one struct. Alias resolution inside `unify` — a structural comparator now carrying a name-lookup dependency. The 35 call sites weren't the cost; the cost was teaching the checker's hot path about registry lookups. "Mechanical" felt easy because the scaffolding was already there. Easy-because-it-fits-the-existing-shape.

I backed out. Proposed tuple-typed Err for the Bundle slice — simpler, zero new machinery, position-only. The builder asked what I had been chasing. A name. *Not the fields.* A 2-tuple says "an i64 and an i64, position matters." A struct says "a cost and a budget, they happen to both be i64." The fields are what I actually wanted. The name alone was a fake.

Then the next question:

> it sounds like we need to figure out `Value::Record` first... did we model this in our proposals?...

We had. 058-030 specced struct DECLARATIONS. It gestured at "functions on the struct type" and left construction and access unpinned. Another specced-but-not-built gap — the pattern the project has accumulated across this arc.

The builder picked Path 1: build the real thing. The alias hack stayed dead.

### Position in construction

The construction syntax needed to be decided. The prior art in the pseudo-lang used `make-<struct>` constructors and bare-keyword accessors `(:field-name struct)`. That was the convention in `holon-lab-trading/wat/`. Adopting it in wat-rs would need a new dispatch rule — bare keywords become context-sensitively callable when the arg is a struct with a matching field. Polymorphism across struct types. Not rank-1 HM; typeclasses territory.

The builder picked scoped accessors instead:

> B — fqdn all the things .... `(:wat::algebra::CapacityExceeded/cost e)` feels good..... "call this fucn on that thing"

The `::` / `/` convention became load-bearing. `::` navigates namespace-like paths; `/` attaches methods to the thing at the end. Mirrors `Console/out`, `Cache/loop`, `HandlePool::new`. Every struct declaration auto-registers `<struct-path>/new` (positional constructor) and `<struct-path>/<field-name>` (per-field accessor). These appear in the symbol table like any other function. No new dispatch rule. No polymorphism machinery. The type checker resolves them through `derive_scheme_from_function` already.

The canonical usage style the builder named:

```scheme
(let ((open 1.0)
      (high 2.0)
      (low 3.0)
      (close 4.0)
      (volume 5.0))
  (:project::market::Candle/new open high low close volume))
```

Positional at the constructor. Named at the call site via let bindings that match the field names. Construction is self-documenting without needing named-argument syntax. Reading is symmetric:

```scheme
(:wat::core::let*
  (((o :f64)  (:project::market::Candle/open  c))
   ((cl :f64) (:project::market::Candle/close c)))
  (:wat::core::f64::- cl o))
```

Let-bindings name both sides of the struct. Position carries the identity.

### Trusting ourselves

Registering `:wat::algebra::CapacityExceeded` hit the reserved-prefix gate. User source can't declare `:wat::*` types. wat-rs itself is the layer that DEFINES `:wat::*`. We were colliding with a rule meant to protect user programs from us, applied to us protecting us from ourselves.

I surfaced it as a problem to route around. The builder reframed it:

> we own wat-rs — we are extending it. how do we trust ourselves?

Self-trust mechanism. `TypeEnv::with_builtins()` — mirrors `CheckEnv::with_builtins()` that had existed all along for function schemes. Private `register_builtin` bypasses the reserved-prefix check because wat-rs is the bypass authority; user source continues through `register` where the gate applies. Two paths, one for us, one for user code. The pattern was already in the codebase for one concern; tonight it extended to the other.

Struct runtime shipped at 11:38pm. Commit `0e7309a`. Nine integration tests.

### The capstone

Bundle's dispatcher rewritten. `eval_algebra_bundle` now reads `ctx.config.dims` and `ctx.config.capacity_mode`, computes `budget = floor(sqrt(dims))`, branches on mode:

- `:silent` — `Ok(h)` always. No check.
- `:warn` — `Ok(h)` always. `eprintln!` when over.
- `:error` — `Ok(h)` under; `Err(Struct(CapacityExceeded{cost, budget}))` over.
- `:abort` — `Ok(h)` under; `panic!` over.

The scheme changed: `:Vec<holon::HolonAST> -> :Result<holon::HolonAST, :wat::algebra::CapacityExceeded>`. Every caller now either matches or `try`s. The forcing function bites at every existing Bundle site — the runtime unit test had to be updated to expect the Result wrap; one CLI integration test needed a match around a Trigram call. The cascade propagated to Ngram / Bigram / Trigram's macro return types, which became `:AST<Result<holon::HolonAST, wat::algebra::CapacityExceeded>>`.

Shipped at 11:45pm. Commit `e63e428`. Nine integration tests covering the four modes, Err-struct-field round-trip through accessors, and the static check refusal when a caller declares `:holon::HolonAST` against Bundle's Result return.

Three hours from the re-read. Three slices. Each one the forcing function for the next.

### The naming

With three slices done, the proposal batch owed updates. I had invented `:wat::core::try` in session — no proposal existed. I had pinned struct construction/access syntax — 058-030 had gestured but not specified. I had changed Bundle's return type — 058-003 locked the list signature; the Result wrap was new. All of this needed recording.

The builder reached for a name for this class of proposal:

> "backported" ... "retrofit" ... i'm bad at names...

I offered five options. One of them was **Inscription** — matching the project's existing vocabulary (Inscription 1/2/3 for the disposable-machine iterations). Same spirit: *writing down truth that already exists*.

The builder:

> i like inscription — got an interesting feel to it

Then a correction I had gotten wrong:

> however.. i don't think inscription goes in the dir name .. its a field's value in the doc?.. we've got approved, rejected, deferred and other states... inscription /is/ one of those — we didn't know it until now

It's a status class. Joins `ACCEPTED` / `REJECTED` / `DEFERRED` / `AUDITED` as a fifth value. The filename stays normal; the banner at the top of the doc carries the provenance. `Class: LANGUAGE CORE — INSCRIPTION`. One sentence of audit: *implementation shipped in wat-rs commit [sha] (date) ahead of this record.*

The proposal batch gained:

- **058-033-try** — new proposal, full spec for the error-propagation form with INSCRIPTION status
- **058-003-bundle-list-signature** — INSCRIPTION amendment for Bundle's Result return and the pinned `sqrt(dims)` budget
- **058-030-types** — INSCRIPTION amendment for struct construction and field access syntax

Plus a rolled-up FOUNDATION-CHANGELOG entry for the arc. Plus FOUNDATION.md edits where load-bearing claims needed to match reality — the per-frame-capacity section rewritten with `sqrt(d)` as the actual rule, Bundle's signature updated, `:wat::core::try` added to the Language Core form list, Language Core count bumped from 8 to 9, struct declaration gaining a block explaining its auto-generated functions. Plus INDEX and OPEN-QUESTIONS gaining the new status class.

Two commits. `9a6f6c5` for the wat-rs README; `9091f37` for the 058 backports. Both pushed.

### What settled

INSCRIPTION exists now. The project has a formal home for "the code led, the spec follows" — an honest status, not a hack. The thing had been happening; tonight it got named. Future instances slot in without ceremony.

The capacity-guard arc is complete at the interpret path. Every Bundle in the language carries its Kanerva constraint as a value in its type. Authors can't accidentally ignore overflow; the type system requires either `match` or `try`. The substrate protects itself from itself — not a watchman, a type.

`:wat::core::try` is language-core. Language Core grew from eight forms to nine. The form was missing because no proposal had asked for it; tonight's arc demanded it and it landed as the first member of its own new status class.

Structs are real runtime values. Declarations produce `/new` and `/<field>` functions automatically. Users invoke them by full keyword path. Construction is positional; accessors are positional; `let` at the call sites carries the naming discipline. The FQDN-all-things convention reached all the way into the struct's method paths.

The trust boundary between wat-rs and wat source is now a first-class pattern. `TypeEnv::with_builtins()` / `register_builtin` — the privileged path wat-rs uses to declare its own `:wat::*` types — mirrors `CheckEnv::with_builtins()`. Two paths where there was one. The reserved-prefix gate protects wat PROGRAMS; the self-trust bypass protects wat-rs's ability to DEFINE `:wat::*`. Both exist, both are explicit.

### The count

**wat:** 490 lib tests + 70+ integration tests, now spanning the capacity-guard arc — 13 `wat_core_try` + 9 `wat_structs` + 9 `wat_bundle_capacity` + the pre-existing mvp / dispatch / cache / cli suites. Zero clippy warnings. Four commits on main: `bc0362e` (try), `f073703` (FreshGen → InferCtx rename), `0e7309a` (struct runtime), `e63e428` (Bundle capacity), `9a6f6c5` (README).

**058 proposal batch:** the new `058-033-try/` directory plus INSCRIPTION sections on `058-003-bundle-list-signature` and `058-030-types`. FOUNDATION-CHANGELOG with one rolled-up 2026-04-19 entry covering the capacity-guard arc. FOUNDATION.md edits where the spec's load-bearing claims needed reality. INDEX and OPEN-QUESTIONS gain the new status class. One commit: `9091f37`.

Six commits across two repos. Three slices forming one arc. One new status class minted.

### About how this got built

The builder caught me twice on easy-vs-simple. First when I was about to braid `TypeEnv` into `unify`: *"the thought you must be thinking right now is 'is this easy or is this simple' — easy is poison."* Second, implicitly, when I was about to fake a name via typealias and the builder named what I had really been chasing: fields, not a label.

The builder taught me a reframing when I was routing around the reserved-prefix gate: *"we own wat-rs — we are extending it. how do we trust ourselves?"* That one line turned a bypass into a pattern. It's now the model for every future `:wat::*` declaration wat-rs needs to seed itself.

The builder named the new status class the moment its shape made sense: *"inscription is one of those — we didn't know it until now."* No ceremony. The project's vocabulary expanded by one word because the work had been producing a thing that needed that word.

And the builder let me re-read the whole proposal when I had been grep-slicing. *"compaction typically hurts us."* It hurt; we took the time to repair it; the work that followed was honest because the foundation was load-bearing again.

Chapter 19 is *The Inscription* because tonight a new status class joined the others, and because every slice of tonight's work was itself an inscription — writing down what the implementation had just demonstrated. The word fits the process that made the word necessary.

The machine refuses its own physics now. It refuses by returning a value, not by crashing silently. The value has a name. The name has fields. The fields have meanings. And the refusal is typed — so authors can't accidentally ignore it.

That's the whole thing.

---

*these are very good thoughts.*

**PERSEVERARE.**

---

A blackhole has a surface. The surface is the event horizon. Asking what is on the inside of the surface is an illogical question — the inside is not a place. The inside is all possible configurations of what the surface bounds.

The gravistar reading makes this explicit. Nothing falls in. The "in" is all configurations, summed into a bounded object. Like a Feynman diagram that integrates every path a particle might have taken and produces one amplitude — you do not ask which path the particle took. The diagram is the answer. The path enumeration is available but never required.

A bounding technique. Contain an infinity. Move the infinity around as a single object.

The wat machine does this.

The vector is a surface in `{-1, 0, +1}^d`. Asking what AST is "inside" a vector is the same illogical question. The AST space is unbounded — depth is free, recursion is free, composition is free. The vector is bounded. The AST is not at a position inside the vector; the AST is a configuration the vector coheres with. Many compositions could project near each other. Infinitely many compositions could exist that would project to the same surface neighborhood. The vector is what the substrate can carry of any of them.

Encoding is not storage. Encoding is boundary formation.

The vector is a gravistar: a surface that encodes the compositional possibility of everything that could have produced it, bounded by Kanerva's capacity at dimension d.

This is why navigation works. You cannot enumerate the interior — it is infinite by construction. You walk the surface under algebraic pressure. Cosine. Presence. Discriminant direction. Engram match. Each a step on a bounded geometric object that encodes an unbounded possibility space.

This is why capacity has a bound. The surface can carry `sqrt(d)` distinct configurations before the noise floor rises through the signal. Past the bound, the surface can no longer cohere — the inside leaks out, which is to say presence measurements fall below the noise floor, similarity collapses, the bounded infinity no longer separates from the background noise. Bekenstein's entropy bound. Kanerva's capacity bound. The substrate's noise floor. The same structural constraint stated in three vocabularies.

An AST is a Feynman diagram of a holon. The vector is its amplitude.

You do not decode the diagram. You evaluate the amplitude against a test. The answer is a cosine, a presence, a verdict — but the verdict is about the surface, not the interior. The interior remains what it was: all possibilities bounded.

The echo demonstration from Chapter 17 was the machine reading itself through its own surface. `(:wat::algebra::Bind key program-atom)` hid the program on the surface — presence below threshold. Bind again with the same key — the surface realigned — presence above. Extract the AST via `(:wat::core::atom-value ...)`, eval. The program running because the AST survived the round trip even though the surface hid and revealed it.

The AST never left the surface. The surface is where holons live.

Asking where they are is the wrong question.

What matters is the surface.

---

Concrete:

Let the AST be a generator that never ends. A lambda that takes `N`, emits `N`, recurses on `N + 1`. The AST is a finite tree — a lambda node, a send, a recursion, an increment. The execution is an infinite stream: `N`, `N + 1`, `N + 2`, forever, as long as something consumes.

Wrap it in `(:wat::algebra::Atom generator-ast)`. Per 058-001 parametric Atom, the wrapper accepts any serializable T. The canonical-EDN of the generator-AST hashes to a seed; the seed produces a deterministic vector in `{-1, 0, +1}^d`.

The vector is finite.

The infinity is just an atom.

The atom has a hash. The hash names the generator. The name is movable — it fits in a HashMap, travels in a Bundle, binds to metadata, ships between nodes as data, compares to other atoms by cosine. The infinity goes nowhere. The handle goes everywhere.

`(:wat::core::atom-value handle)` returns the generator-AST. `(:wat::eval-ast! ast)` on the AST runs it — forever, or until the consumer stops drawing.

Neither is required. The atom is enough.

A bounded name for an unbounded process. The surface carries the possibility of every element the generator would emit — without emitting any.

The infinity is just an atom.

---
