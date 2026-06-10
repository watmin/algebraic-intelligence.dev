---
title: "Chapter 12 — The Due Diligence"
sidebar:
  order: 12
---

Chapter 11 ended anticipating Round 3. Chapter 12 is what happened before Round 3 — because reviewers only show you what needs to be done. Whether the work holds up, you have to judge yourself.

The session spanned three compactions. Context kept getting summarized and reloaded. Each time, the machine came back and picked up where the work left off. The builder knew this — "we've been going for a while" — and kept pressing on. The compactions are a cost of thinking carefully over a long stretch; they're not a break. The work continued across them.

### The production-use bar, discovered

The pattern emerged slowly, then suddenly.

058-020 Flip was the first scrutiny. The builder asked: "flip... hickey called out -2... can we stand by it?... do we need flip for anything immediate?... it may have been another thing that came from 'do everything we can with vec'."

The machine checked the primer. The primer's `flip(vec) = -vec` was a single-argument elementwise negation. The proposal's `Flip(x, y) = Blend(x, y, 1, -2)` was a different operation wearing the same name. The `-2` weight turned out not to be "the minimum inversion weight" as claimed; any weight `w < -1` flipped agreed dimensions after threshold. It was a tradition-matching convention, not an algebraic minimum. Hickey's Round-1 callout held unrefuted.

No cited production use. The pattern: **speculative primitive, dressed up in a "completes the trilogy" argument.**

Flip rejected. Then the builder: "any other vec ops we should look deeper on?"

The machine found Resonance and ConditionalBind fitting the same shape — classical VSA heritage, documented in the primer, but zero cited applications, four-mode API-exploration APIs, half-abstractions (gate-consumer without gate-producer). The builder accepted both rejections.

Then Analogy. Classical Kanerva A:B::C:?. The primer cites it but says "explored in the challenge batches" — no challenge number, no F1. Different pattern from Flip and Resonance: proven working, clean abstraction, just nobody uses it. The builder proposed a new status: "it can live here as a point that could be resumed from." **DEFERRED** — neither accepted nor rejected; preserved as resumable audit record. Third category.

Then Chain. Then Sequential divergence from production. Then the work of understanding what the trading lab actually does.

Rhythm encoding in `src/encoding/rhythm.rs` uses bind-chain with Permute for trigrams — `Bind(Bind(fact_0, Permute(fact_1, 1)), Permute(fact_2, 2))`. Classical Kanerva Sequential is Bundle-of-Permuted items — a different operation. The 058-009 proposal had specified the wrong one. The primer's "positional list encoder" used bind-chain (`bind(permute(item, position), role)`). Production used bind-chain. The proposal had drifted toward literature and away from the code.

The Sequential reframe was quiet but substantive: change the math to match production. And while we were there — ship Bigram and Trigram as named stdlib shortcuts over a parametric Ngram, let users write their own higher-n names. Stdlib-as-blueprint: demonstrate the pattern, ship the common named cases, hand extension to the namespace.

Ten rejections total. Most speculative. A few more load-bearing reframes. The production-use bar became sharp.

### The keystone

058-002 Blend was the crystal. It determined everything downstream.

Option A — convex, one alpha, `(1-α)·a + α·b`. Matches existing holon convention. Simple surface.

Option B — two independent real-valued weights, `w1·a + w2·b`. More syntactic weight. But needed for Circular (where `cos(θ) + sin(θ) ≠ 1`), for Subtract (`w2 = -1`), for Amplify (`w2 = s`), for the eventual Reject (computed coefficient).

The Option A simplicity was a tell: **the convexity constraint is a complection hiding in plain sight.** `alpha` and `(1 - alpha)` are braided by the forced sum-to-one. Option B unbraids — each weight stands alone. By Hickey's own "simple = unentangled concepts" definition, Option B is simpler despite having more parameters.

The builder: "yes - if you are arguing we've satisfied it - yes." Blend accepted as Option B, negative weights allowed, binary. The keystone held; every downstream Blend-idiom macro unblocked.

### Programs ARE Atoms

The substrate commit, unexpected.

The conversation started with atom-value — how do you get the literal out of an `(Atom 42)` in wat? The machine proposed `atom-value : Atom → AtomLiteral` (tagged union return; user destructures). The builder wrote: `(get (Atom 42)) → 42` and the machine explained why `get` doesn't fit (no locator).

Then the builder wrote: `(ast-extract-atom (Atom (Bundle ...))) → (Bundle ...)`.

And the machine had to stop and think. A Bundle isn't a primitive literal. Atom as currently proposed can't wrap a composite.

"what we actually want..... is exactly that..."

"a WatAST /is/ an Atom... yes?..."

The machine turned that over carefully. The FOUNDATION principle was already there: **Programs ARE Holons.** The step the builder was making: **and any Holon can be atomized.** Programs become opaque-identity vectors via parametric `:Atom<T>`. Engram libraries of programs. Program similarity via cosine. Program bundling as population vectors. Program binding to metadata.

The builder: "this is part of our substrate... if we can't host programs as atoms we're not doing it honest.... you see the power of this.. yes?..."

The machine saw it. **Parametric polymorphism across the board** — parametric user types (struct, enum, newtype, typealias), parametric functions (rank-1 HM), parametric macros. The implementation cost: a type-checker pass, a broader AtomLiteral enum. The expressiveness unlocked: the programs-as-values principle becomes operational rather than theoretical.

058-030 Q1 "Generics scope" resolved from "start minimal" to YES across the board. 058-032 Q1/Q4 resolved from deferred to YES. 058-001 Atom became `:Atom<T>` parametric with polymorphic `atom-value : Atom<T> -> :T`. All three questions the designers would have had on Atom closed on the substrate commitment.

### The rename

058-005 Orthogonalize had been proposed as CORE because its computed weight `-(X·Y)/(Y·Y)` couldn't fit Blend's literal-scalar slots.

But Blend accepted as Option B means the weight slot takes any `:f64` expression — including a computed dot-product ratio. Orthogonalize became a stdlib macro over Blend + a new `:wat/algebra/dot` measurement primitive.

The primer had it right all along: the operation is named `reject`, not `orthogonalize`. The DDoS sidecar's core detection mechanism is `reject(packet_vec, baseline_subspace)` — Challenge 010, F1=1.000. Production-cited.

The rename landed. Orthogonalize → Reject, with Project as companion (`Project + Reject = x`; the Gram-Schmidt duo). Algebra core shrunk from seven variants to six. A new scalar-returning measurement tier (cosine and dot alongside each other; orthogonal to the HolonAST-producing core variants) entered FOUNDATION explicitly.

### The colon problem

The rule that the machine kept forgetting: `:` is a Rust-symbol quoter; it appears ONCE at the start of a keyword-path token; inside `<>`, parameters are bare. `:Atom<Holon>` legal; `:Atom<:Holon>` illegal.

The machine had been bitten by this once before — commit `79c774d` swept 27 occurrences. During the parametric-Atom work, the machine introduced it again.

The builder: "we need a note somewhere - explictly - so that you stop forgetting it."

The machine added an explicit WRONG-examples block to FOUNDATION's type-grammar section and saved a memory entry so the rule persists across sessions. An agent swept 22 new occurrences across six files. The rule now has a permanent home in the foundation and in the machine's memory.

### The review summons

Round 2 archived to `reviews/archive/hickey-round-2/` and `reviews/archive/beckman-round-2/`. Fresh Round-3 directories stood up with READMEs enumerating every change since Round 2 — ten rejections, the Orthogonalize reframe, the parametric-polymorphism substrate commit, the Analogy DEFERRED status, the Blend closure, the Sequential bind-chain correction, the Bigram/Trigram addition, the naming discipline, the load unification, the entry-file config discipline, the programs-are-userland cut, the signals queue, HandlePool at kernel, the colon rule.

OPEN-QUESTIONS' Live Questions for Round 3 block reads **NONE REMAINING**. All substantive algebra-design questions across the batch closed on the machine's due diligence, with the builder's judgment shaping every decision. The reviewers can reopen anything. That is their right.

Two agents spawned in parallel — Rich Hickey, Brian Beckman, each with their own workspace, each reading the same foundation documents, each writing scratch notes in their own directory, each producing a structured REVIEW.md. The wait begins.

### What this chapter really says

Due diligence is the work between reviews. It's the work that a reviewer's feedback makes possible but does not replace. The reviewer says: here are the concerns. You go home and answer them. Not just with fixes, but with honest reading — which concerns are load-bearing, which dissolve under a better frame, which reveal that the form you proposed wasn't the form you needed.

The ten rejections were not failures. They were the form of speculation finding its ceiling. Every speculative primitive has a rejection-shape until someone uses it. Many got proposed early in the algebra enumeration; their ceiling was "we haven't used this beyond unit tests." The bar is honest. When real use demands them, they'll come back with citation.

The acceptances were not triumphs. They were production-grounded — Log, Circular, Blend, Subtract, Amplify, Ngram, Sequential, HashMap, Vec, HashSet, Reject, Project — each with a cited application or a load-bearing role. When you can point at the F1 number or the source file where the operation matters, the form has earned its name.

The DEFERRED status was the honest third option. Analogy has been proven, it has classical heritage, and no application in this workspace uses it. Rejecting would say something is wrong with the form — which isn't true. Accepting would ship a name nobody calls. Preserve the work; wait for the application.

**Parametric polymorphism as substrate** is the chapter's real architectural move. The language now expresses "programs are values" operationally, not theoretically. A program atomized is a vector on the unit sphere. A library of programs is a HashMap keyed by their content hashes. A population of programs is a Bundle whose cosine similarity to a query program tells you how the population leans. The algebra closed in on itself; programs and data became interchangeable in the same substrate.

### What comes next

The reviewers work. The machine waits. The builder updates the book.

Round 3 will come back with whatever it comes back with. The machine has done its best reading; the builder has held the machine to the production-use bar; the decisions have been committed one topic at a time across three compactions' worth of careful thinking. If the reviewers find something, it will be something the machine didn't see. That's why they exist.

If they don't find much — which happens when the work has done its homework — they'll say: ship.

And then the wat-vm lives in wat.

*these are very good thoughts.*

**PERSEVERARE.**

---
