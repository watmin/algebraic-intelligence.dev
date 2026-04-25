---
title: "The Detour"
description: "Apr 20–22: The wat-vm has stack frames now — the tail-call trampoline lifts the ceiling. Pipeline combinators land in five days the substrate had been built for. wat tests wat: the language verifies itself through the harness it wrote. Then fork replaces subprocess — the runtime no longer knows where its own body lives on disk."
sidebar:
  order: 23
---

The XX post ended April 19 with the Inscription class minted and Bundle's capacity guard wired. The substrate refused its own physics now — not by panic, but by typed value.

Three days followed. Each day a substrate arc the prior arcs had been quietly demanding. None of them planned. All of them earned by the work that came before.

---

## The Tail (April 20)

`arc 003 — tail-call trampoline`

Every driver-loop program wat ships — `Console/loop`, `Cache/loop-step`, every future `gen_server`-shaped program — was already written in tail-recursive shape. The evaluator didn't recognize it. Each recursive call burned one Rust stack frame. A Console driver processing ten thousand messages burned ten thousand frames. Past the default 8MB thread stack, crash.

The fix was structurally simple once named:

```rust
// New control-flow signal — sibling to TryPropagate
enum RuntimeError {
    TryPropagate(Value),
    TailCall(Arc<Function>, Vec<Value>, Arc<Env>),
    // ...
}

// apply_function wraps its body in a loop that catches TailCall,
// reassigns cur_func and cur_args, iterates
fn apply_function(...) -> Result<Value, RuntimeError> {
    loop {
        match eval_tail(&body, &env) {
            Err(RuntimeError::TailCall(f, args, env)) => {
                cur_func = f;
                cur_args = args;
                cur_env = env;
                continue;
            }
            other => return other,
        }
    }
}
```

`eval_tail` alongside `eval`, with four tail-aware helpers (`eval_if_tail`, `eval_match_tail`, `eval_let_tail`, `eval_let_star_tail`) that thread tail-position through the language's branching forms.

Two slices. Stage 1 handled named `define`s. Stage 2 extended detection to lambda values — bare-symbol heads that resolve to `Value::wat__core__lambda` in env, and inline lambda literals. Closure's `closed_env` traveled through the TailCall signal alongside the function.

11 integration tests. Self-recursion via `if` at 1M depth. Self-recursion via `match` at 100k (the Console/loop shape). Mutual recursion at 100k each way. Tail call inside `let*` body. `try` and `TailCall` coexisting on happy + error paths. Lambda tail calls across closure boundaries.

Scheme's R*RS specs mandate TCO. Erlang's BEAM has `call_only`. Rust itself doesn't — but the language we're hosting does, so we gave the evaluator the trampoline the spec wanted.

The ceiling above every long-running wat program had just lifted off.

---

## The Pipeline (April 20, late)

`arc 004 — CSP pipeline combinators`

The CSP pipeline pattern — source → stage → stage → terminal, bounded queues between, drop cascade at shutdown — had been the thing wat was built to host since the very first chapters. The primitives were all there. Expressing a three-stage pipeline still meant spawning each stage by hand, wiring channels, managing handles, dropping senders in the right order. Every pipeline author re-derived the plumbing.

Six combinators landed in `wat/std/stream.wat`:

```scheme
:wat::std::stream::Stream<T>     ; typealias for :(Receiver<T>, ProgramHandle<()>)
spawn-producer  : Producer<T> -> Stream<T>     ; entry point
map             : Stream<T> -> :fn(T)->U -> Stream<U>
filter          : Stream<T> -> :fn(T)->bool -> Stream<T>
chunks          : Stream<T> -> :i64 -> Stream<:Vec<T>>   ; N:1 batcher with EOS flush
for-each        : Stream<T> -> :fn(T)->() -> ()         ; terminal — drives + joins
collect         : Stream<T> -> :Vec<T>                  ; terminal — accumulates
fold            : Stream<T> -> Acc -> :fn(Acc,T)->Acc -> Acc  ; terminal aggregator
```

Each worker is a tail-recursive wat program. Arc 003 was the prerequisite arc 004 could not have landed without — every stage has to run indefinitely, every recursion has to be in tail position, only the trampoline makes that run in constant stack.

The arc surfaced two lessons. The book earned both.

### Absence is signal

Implementation tripped on a type-check failure in `infer_positional_accessor`. Typealiases weren't expanding at unification. wat-rs had two half-passes — `apply_subst` for type variables, `expand_alias` for aliases — and every shape-inspection site had to chain them manually. Half did; half didn't.

The cheap move was a one-site patch plus a BACKLOG note listing the other sites. The honest move was `reduce` — the single canonical type-normalization pass every mature type system has. The substrate had been missing it the whole time. The gap pointed at real substrate work, not at a patch.

### Verbose is honest

The design doc sketched a `pipeline` composer — a macro that would wire source through stages without the `let*` threading. The composer would eliminate per-stage type annotations and named bindings.

The machine argued for it. The builder pushed back. The eliminated annotations weren't ceremony; they were information: what each stage accepts, what it produces, named in the reader's direct line of sight. Hiding them traded wat's typed-binding discipline for conciseness.

Pipeline composer rejected. The audit-record went into a numbered procedure in `docs/CONVENTIONS.md`:

> Before adding any ergonomic form: write out what it expands to. List what it eliminates. For each eliminated thing — ceremony or information? If information, rejected or redesigned. If ceremony, earns its slot.

`:wat::kernel::send` got reshaped in the same arc. It had been Unit-returning — fire-and-forget on the Sender side, unlike `:wat::kernel::recv` which already returned `:Option<T>`. The asymmetry meant a stage that wanted to exit cleanly on consumer-drop needed a separate `send-or-stop` primitive. We retired the proposed primitive and made `send` itself Option-returning — `:Option<()>`, symmetric with recv. One primitive, one rule.

639 tests passing. The trading lab can compose pipelines today via `let*` and the shipped combinators.

---

## The Proof — wat tests wat (April 21)

`arc 007 — wat tests wat` opened. Every language that is a language crosses this line.

But arc 007 couldn't land alone. Slice 2a tried to construct `:user::main`'s arguments inside a sandbox and hit the wall. The stdio parameters were `:rust::std::io::Stdin` / `Stdout` / `Stderr` — concrete OS handles the sandbox couldn't substitute in-memory stand-ins for. The abstraction didn't exist.

`arc 008 — IO substrate` opened first. Three slices closed the gap:

- `:u8` as a primitive type
- `:wat::io::IOReader` / `:wat::io::IOWriter` — two opaque wat types, Rust's Read/Write split made wat-native
- `StringIoReader` / `StringIoWriter` — `ThreadOwnedCell`-backed for single-thread in-memory use
- `RealStdin` / `RealStdout` / `RealStderr` — trait-object wrappers around Rust stdlib's thread-safe handles

Same wat source runs against both; the trait objects hide the backing.

A lexer bug surfaced mid-migration. `"héllo"` — six UTF-8 bytes — was becoming eight bytes after the lexer's string pass. Root cause: byte-at-a-time iteration through a `&str` treated as `&[u8]`, each byte appended as a Latin-1 char and re-encoded. The fix was `char_indices()`. The substrate had been claiming to preserve UTF-8 and hadn't. It is honest now.

Then arc 007's slices landed:

**The capability gate.** `ScopedLoader`: canonicalize the candidate path, refuse any path whose canonical form doesn't start with the scope root. Forty lines of Rust. Handles `../` escape, symlink escape, absolute-path attempts. Plus the loader-on-SymbolTable pattern — the capability-carrier shape every serious language has. Common Lisp's specials, Scheme's parameters, Clojure's dynamic vars, Rust's `Session`, Ruby's globals, Haskell's `ReaderT`. Same shape everywhere.

**The hermetic fast-track.** `:wat::kernel::run-sandboxed-hermetic` shipped as a sibling primitive (not a mode flag) for tests whose driver threads would panic the in-process StringIo single-thread guard. The CLI flags reserved for hermetic — `--hermetic`, `--run-one` — retired entirely. A primitive-per-semantic keeps the surface honest.

The round-trip test proved the point:

```scheme
(:wat::eval-edn!
  (:wat::core::first
    (:wat::kernel::RunResult/stdout
      (:wat::kernel::run-sandboxed-hermetic
        "...(:wat::io::IOWriter/println stdout \"(:wat::core::i64::+ 40 2)\")..."
        (:wat::core::vec :String)
        :None))))
→ i64(42)
```

An outer wat program spawns a subprocess running inner wat code. The inner code prints a wat *expression* — source text — to its stdout. The outer captures the stdout string and hands it to `eval-edn!`. `eval-edn!` parses the expression and evaluates it in the outer runtime. **42 lands.**

Programs generate programs. Programs run programs. Programs evaluate the output of programs. The *programs-are-thoughts* commitment from Chapter 10 — operational at the testing layer.

**The macro that argued for the substrate.** Slice 3 shipped six `:wat::test::*` forms — `assert-eq`, `assert-contains`, `assert-stdout-is`, `assert-stderr-matches`, plus `:wat::kernel::assertion-failed!` that `panic_any`s with an `AssertionPayload` the sandbox downcasts.

Slice 3 worked. Users could write tests. But every test call repeated config preamble + `:user::main` + IO contract + scaffolding. The test body — the part the author cared about — buried.

The obvious next move was `deftest` — a defmacro that collapses the scaffolding. Writing it surfaced an obstruction: the sandbox's entry point was `startup_from_source(src: &str)` — source text in. The defmacro's body would arrive as AST. To feed it to the sandbox, the macro would have to serialize the AST back to source text and let the sandbox re-parse it. Round trip. Honest-but-wasteful.

Two paths. Twenty lines of Rust to expose the serializer. Eighty lines to split the parse boundary and accept AST directly.

The second path was the honest one. **If the data is already AST, keep it AST.** Pretending it's text and parsing it back is the substrate lying to itself.

`startup_from_forms(Vec<WatAST>)` shipped. `:wat::kernel::run-sandboxed-ast` accepts forms directly. `deftest` expanded to a named zero-arg function returning `RunResult`. The sugar earned its slot because the substrate underneath carried real weight.

A door opened as a side effect: dynamically-generated tests, fuzzers, future compiler passes — any caller with AST in hand — now composes with the sandbox without serialize round trip.

After the migration, `wat test wat-tests/` ran 24 tests across 8 files in 107ms. Recursive discovery surfacing every deftest by `test-`-prefix convention. Random order per file via a nanos-seeded `xorshift64` inline — no `rand` dependency.

The assertion primitives assert about the assertion primitives. **The test harness tests itself.**

> If wat can test wat, the language is complete-for-its-own-verification.

The thesis held.

---

## The Renames

Two renames between the slices, both earned.

`wat-vm` → `wat`. The binary had been named after the "vm" framing from when the concept was new. The language is wat. The crate is wat. The binary is wat. One name per concept, per the namespace-honesty discipline. Twenty-nine files, one mechanical sed pass.

`wat/std/program/` → `wat/std/service/`. Console and Cache had been called "stdlib programs" in the original design. The concept firmed up after both shipped — they're long-running driver programs with client handles. Services. The builder's words: *"I just named them poorly."*

---

## The Severance — fork eliminates the binary path (April 21)

`arc 012 — fork and pipes`. One day. Sixteen commits. The language runtime no longer knows where it lives on disk.

Hermetic sandboxing had been operational since arc 007 slice 2c. `run-sandboxed-hermetic` spawned the wat binary as a subprocess. It worked. It also coupled the runtime to `std::env::current_exe()` — or, when that failed, to the `WAT_HERMETIC_BINARY` environment variable. The language knew where its own body was because it had to.

Arc 011 doubled the coupling. The AST-entry hermetic needed to get `Vec<WatAST>` into the subprocess, which meant serializing back to text, writing a tempfile, spawning to re-parse it. `wat_ast_to_source` and `wat_ast_program_to_source` landed — 200 lines of Rust that existed solely to bridge AST → source → subprocess.

The builder named the gap once, early in the session:

> do we need the wat binary path at all?... /we are in the wat program/ ... right?.. we can just fork from where we are?... if anyone fucks with a rust const it's scoped to their proc?.... we can literally just use rust's fork()?...

One question reframed the whole arc. The substrate did have a fork capability — libc was already a dep. The arc 008 IO traits already abstracted over readers and writers; pipe ends could fit the same surface. Arc 010's `:wat::core::forms` already captured forms as AST data that would survive a COW page copy. The pieces were there; they hadn't been assembled.

Path A was keep `current_exe` + env var, polish the tempfile dance. Path B was fork. The builder chose Path B without hesitation:

> we only go the honest long term path - no short cuts

Three substrate primitives. One struct. One wat stdlib define:

```scheme
:wat::kernel::pipe              -> :(IOWriter, IOReader)
:wat::kernel::fork-with-forms (forms) -> :ForkedChild
:wat::kernel::wait-child (handle)     -> :i64
```

`ForkedChild` is a four-field struct — handle, stdin, stdout, stderr — that mirrors what the old `Command::spawn` had been returning, minus the binary coupling. `ChildHandle` holds the child's pid + an `AtomicBool reaped` + a `OnceLock<i64> cached_exit`. `Drop` SIGKILLs and reaps via blocking `waitpid` if the caller never called wait-child — zombie-free by construction.

### The close-inherited-fds bug

Mid-implementation, the child crashed on its first `closedir`. The diagnostic dump told the whole story:

```
--- CHILD STDERR (raw bytes len=289) ---
FORKED
AFTER-DUP2
thread 'child_stderr_full_dump' panicked at
library/std/src/sys/fs/unix.rs:887:9:
unexpected error during closedir: Os { code: 9, kind:
Uncategorized, message: "Bad file descriptor" }
```

The fork worked. The dup2 worked. The fd-sweep didn't — the iterator was closing the directory it was reading from while still reading.

The fix was structural, not mechanical: collect candidate fds first, let the iterator drop cleanly, then close the collected fds. The iterator's own fd shows up in the collected list but is already closed by the time we try it again — `libc::close` returns -1 with EBADF which we ignore.

### The retirement

The replacement landed: `wat/std/hermetic.wat` — the file that IS the new `:wat::kernel::run-sandboxed-hermetic-ast`. ~50 lines of wat stdlib on top of fork-with-forms + wait-child. Same keyword path. Same signature. Same return shape. Every existing caller worked unchanged.

Then the retirement. The string-entry `run-sandboxed-hermetic` Rust primitive retired — its whole point had been *"run source in a subprocess,"* which is the old shape. `run_hermetic_core` + `expect_option_string` + `split_captured_lines` retired alongside. `wat_ast_to_source` + `wat_ast_program_to_source` and their eight unit tests retired because the bridge they built no longer had a shore to reach: **fork passes AST through memory, not through text.**

The retirement commit alone was −477 lines, +121. **The substrate shrank by 356 lines and became honester.**

### The near-miss

Mid-afternoon, slice 3 had just shipped. The Rust suite was green — 518 unit tests, 25+ integration test groups, zero failures. The machine started drafting the commit message.

The builder stopped it:

> hold... wat test - you only measured the rust tests?...

The wat-level tests in `wat-tests/` run through the `wat test` CLI, not through cargo — and they exercise the stdlib through the SAME hermetic path the machine had just moved. Console. Cache. The service tests that were the original hermetic clients.

The machine built the release binary, ran `wat test wat-tests/`. Thirty-one tests. All green. The wat-stdlib hermetic verified end-to-end against the same test corpus the old Rust primitive had served.

The machine had almost shipped the retirement without the proof. The builder saw what the machine didn't.

---

## What Three Days Built

| Day | Arc | Substrate change |
|------|-----|-----------------|
| Apr 20 | 003 | TailCall control-flow signal — constant stack for tail-recursive programs |
| Apr 20 | 004 | Six pipeline combinators on top of arc 003. send returns `:Option<()>` |
| Apr 21 | 008 | `:wat::io::IOReader` / `IOWriter` + StringIo + Real stdio. UTF-8 lexer fix |
| Apr 21 | 007 | wat tests wat. `deftest` macro. ScopedLoader capability. AST-entry sandbox |
| Apr 21 | 012 | fork + pipes + ChildHandle. The runtime severs from its own binary path |
| | rename | wat-vm → wat. wat/std/program/ → wat/std/service/ |

The language can now verify itself through the harness it wrote. Programs generate programs. Programs run programs. Programs evaluate the output of programs.

The runtime is no longer coupled to its own filesystem location. The substrate shrank by 356 lines and became honester.

The wat-rs grow-up arc.

---

## Likely Contributions to the Field

- **Tail-call trampoline via internal control-flow signal**: `RuntimeError::TailCall(Arc<Function>, Vec<Value>, Arc<Env>)` caught at the function boundary, with `eval_tail` and four tail-aware helpers threading tail-position through `if`/`match`/`let`/`let*`. R*RS-mandated TCO on a Rust host that doesn't have it
- **wat tests wat through AST-entry sandbox**: `startup_from_forms(Vec<WatAST>)` lets `deftest` feed the sandbox AST without serialize round-trip. The test harness tests itself — assertion primitives assert about the assertion primitives. The language is complete for its own verification
- **Fork-from-current-process eliminates binary-path coupling**: `:wat::kernel::pipe`, `fork-with-forms`, `wait-child` replace `Command::spawn`. The runtime no longer needs `current_exe()` or env vars; AST passes through COW-inherited memory, not text serialization. ZERO-MUTEX-friendly via OnceLock for the wait-child idempotence
- **Verbose-is-honest formalized as a procedure**: `docs/CONVENTIONS.md` codifies the rule for ergonomic forms — write what it expands to, list what it eliminates, classify each eliminated thing as ceremony or information. Rejected the pipeline composer because the eliminated bindings carried information
