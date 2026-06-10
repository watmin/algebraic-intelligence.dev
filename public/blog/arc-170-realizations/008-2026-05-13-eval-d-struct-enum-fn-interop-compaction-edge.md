## 2026-05-13 — Eval'd struct/enum/fn interop (compaction edge)

**User (compaction imminent):** *"can we eval structs, enums in wat.. and then write functions who accept args of eval'd types and return eval'd types and operate on eval'd enums and so..."*

**The static-type discipline answer:**

**Within one program: NO.** Types are static, frozen at startup. After freeze, the SymbolTable + TypeEnv are immutable. A program cannot eval a struct declaration mid-flight and then have a fn (also mid-flight) accept/return/operate on it. The substrate REJECTS this with `DefineInExpressionPosition`-class errors. This is load-bearing for static checking + signed-eval verification + cross-machine reproducibility.

**Across programs via spawn: YES.** This is exactly what spawn-process + HolonAST-as-data + Gap H's closure-prologue lift enables:

1. **Parent program** constructs struct/enum/fn AS HolonAST data (quasiquote + composition; or built procedurally from runtime values)
2. **Parent** wraps the AST into a closure body (with the type declarations + fns at the body's do-prefix)
3. **Parent** calls `(:wat::kernel::spawn-process fn)` — this creates a NEW PROGRAM (child)
4. **Child's freeze** processes the lifted prologue at top-level. The new struct/enum/fn declarations are STATIC within the child's lifetime. The child's static type-check validates the fns + their args + return types.
5. **Child runs** with full static-type discipline; fns operate on the eval'd types as first-class static types.

So the user's intent IS achievable — it just maps to "build the AST, spawn a child, the child has those types statically." Each spawn = a new type universe; cross-universe is value-passing through typed channels (Sender<T> / Receiver<T>) where T is a type both universes agree on (typically declared in the parent and inherited via Gap F-3's type-registry propagation, or declared identically in both).

The deeper recognition: **wat's static-typing discipline composes with spawn-as-new-program**. The user has full power to "declare a type at runtime and use it" — by recognizing that "at runtime" is also "at the spawned child's startup." Gap H makes this clean. Gap F-3 propagates parent types to the child. The closure carries the program. The substrate enforces per-program static discipline.

This is the architectural reason spawn-process + HolonAST + closure-extraction + Gap F-3 + Gap H all compose into one capability: programmable program-construction with static-type guarantees per program. The user's intent ships as a side-effect of the gap-closure work.

---
