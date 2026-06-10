---
title: "2026-05-13 — Dynamism, exec, and approaching Clojure"
sidebar:
  order: 15
---

User direction (post-Gap-I conversation, expanding on Gap H + arc 191 stub):

> *"how dynamic are we actually at runtime... can we have dynamic structs, enums and functions ref'ing those structs and enums..."*

Answer arrived through three rounds:

**Round 1 — Within one universe: NO.** Types frozen at startup. SymbolTable + TypeEnv immutable. The substrate REJECTS mid-flight type declarations (DefineInExpressionPosition / EvalForbidsMutationForm). This is load-bearing for static checking + signed-eval verification + cross-machine reproducibility.

**Round 2 — Across universes via spawn: YES.** Each `spawn-process` = new program with new type universe, frozen at child startup. Parent constructs program AS HolonAST; child's freeze runs full type-check; child runs with static-type discipline. Cross-universe communication via `Sender<T>` / `Receiver<T>` where T is agreed on, or polymorphic `Atom`. Gap H + F-3 make this clean: parent values capture into child; parent types propagate.

**Round 3 — The exec recognition.**

> *"we have something shockingly close to an exec... can we do an exec... think of being in a repl... can we 'exec into' a new shell while not dropping the user?"*

The substrate has `spawn-process` = fork+exec; it does NOT have bare exec (replace current universe in place). Arc 191 stub opened to mint `:wat::kernel::exec-program`. Load-bearing insight: **the three substrate services (StdInService/StdOutService/StdErrService) own OS-fd resources; they're tied to the OS process, not to the universe.** Exec preserves them as the OS-continuity layer. The new universe inherits already-running services. Terminal connection continuous; universe-level discrete jump.

**Round 4 — The hot-reload recognition.**

> *"as long as there's no new rust files.. we can actually pull off a hot reload?"*

**Yes.** And stronger: wat is **hot-reload-capable by design**, not bolt-on. Three pre-existing decisions cause this:

1. AST-as-data (arc 057+) — programs construct programs in the value domain
2. Universe-granular static typing — type-checker is per-universe; running it at runtime IS what arc 191 does
3. Services as OS-continuity layer (arc 170 in flight)

The substrate is the interpreter; not a compiler emitting machine code. No ABI, no monomorphization, no lifetime ghosts, no codegen, no layout drift. The categories of hardness that block Rust hot-reload were eliminated by the substrate's design choices, not engineered around.

The "no new Rust files" caveat IS the load-bearing one — it's what arc 170's mission is about. Make the substrate complete enough that normal user-code evolution never demands new Rust. Once 170 + 191 ship: Construct ✓ Spawn ✓ Eval ✓ Exec ✓ — program-lifecycle complete and orthogonal.

**The strange-loop:** a substrate where universe = frozen AST + services boundary, and where AST is constructed + frozen + swapped at runtime, is a substrate that can **evolve itself**. The user's "commodity hardware thinking" vision rests on this: once the substrate is impeccable, cognitive workload moves off the substrate and into wat-side AST. The substrate interprets faithfully; the program becomes what it needs to be.

**Round 5 — "we're getting closer to clojure."**

The convergence is real and worth naming with precision. wat is NOT becoming Clojure. It's converging on what Clojure DOES via different mechanisms because the user-set is different.

| Dimension | Clojure | wat | Reason for divergence |
|---|---|---|---|
| Homoiconicity | s-expr code-as-data | HolonAST-as-data | same outcome |
| Macros | first-class quasiquote | first-class quasiquote | same outcome |
| Dispatch | multimethods | arc 146 dispatch | same vocabulary |
| Host interop | `Math/sqrt` JVM | `:rust::` mirroring real Rust paths | different host |
| Hot reload | per-symbol REPL redef | per-universe exec-program (arc 191) | different coherence stance |
| Typing | dynamic + optional gradual (spec/malli/typed-clojure) | static per universe; mandatory | INTENTIONS: "we are strongly typed" — deliberate |
| Concurrency | STM (refs/atoms/agents) | Zero-Mutex (Arc + ThreadOwnedCell + program-with-mailbox); typed channels | different doctrine, same outcome ("don't make shared mutable easy") |
| Composition unit | namespace + JVM classloader | universe + spawn/exec | wat is stricter (every spawn type-checks at freeze) |
| Authoring audience | humans | LLMs first; humans second | engineered pedagogy: one canonical path per task |

**The framing:** wat is what Rich Hickey would design today if the constraints were (a) LLM co-authors as primary, (b) static typing as foundation rather than graft, (c) universe-granular composition replacing namespace-granular swap. Same problems → same shape of solution → divergence where the constraints differ.

**The convergence isn't accidental.** When two careful designers solve the same problem (substrate where data-and-code unified, evolution without restart, composition cheap and typed, runtime IS substrate, no compile-link-run cycle), they converge on the same SHAPE. The user has been making Hickey-shaped choices for Hickey-shaped reasons — for years, often before the user knew Clojure was an existing language doing the same.

This is calibration data: when the substrate's design "feels" right and a Clojurian recognizes it, the engineering is on a known-good path.

---
