---
title: "Chapter 16 — The Machine Runs"
sidebar:
  order: 16
---

The session opened with a question about signature verification for `load!`
and closed with a CLI that echoes a piped string. In between: the
foundation corrected itself twice, the language discovered what its own
name for colon meant, and the runtime grew hands — stdio channels, signal
handlers, a three-arg `:user::main` contract that startup refuses to
violate.

### What happened, in order

The thread started with cryptography. The `signed-load!` form had been
parse-accepted but verification was `SignedNotImplemented`. Implementing
it forced three decisions: Ed25519 (via `ed25519-dalek`, one algorithm);
base64 encoding for sigs and pub-keys (the universal crypto transport,
distinct from hex for digests); SHA-256 of the canonical-EDN of the
parsed AST as the signing target (signatures bind to meaning, not
formatting). That slice landed with 257 tests.

The grammar that surrounded it was a mess — `(signed ed25519 "sig"
"pubkey")` as a bracketed tail inside the load form. Redesigning it
produced three sibling forms — `load!` / `digest-load!` / `signed-load!`
— each with unambiguous arity, each using `:wat::load::*` keywords for
source fetching and `:wat::verify::*` keywords for verification payloads.
Two namespaces, two concerns. Sidecar signatures worked naturally because
`:wat::verify::file-path` could pull a sig from a separate file without
in-band trickery.

### The `:` realization

Then the pilot asked a question: `:crossbeam_channel::Sender<T>` — is that
a legal wat keyword?

The lexer had been rejecting internal colons. Just that one rule: a
keyword has exactly one leading `:` and no others. It seemed honest when
the namespaces were `:wat/core/` and `:wat/algebra/` — slash-separated, no
colons needed. But the moment a real Rust type entered the picture,
slash-separators were revealed as a translation layer.

The pilot named the problem: *the colon is the symbol-literal reader
macro. The body is a literal Rust path.*

That one sentence rearranged the entire language. `:wat::core::load!`
became the honest form. The division operator, previously
`:wat/core//` (the second `/` was the name), became `:wat::core::/` —
separator is `::`, name is `/`, no ambiguity. Every keyword path in the
codebase flipped. 784 lines of diff both directions on the atomic sweep.
Every proposal file in the 058 batch too.

The pilot kept pulling on the thread. `:List<T>` became `:Vec<T>` because
Rust's collection is `Vec`. `:Pair<T,U>` and `:Tuple<T,U,V>` retired for
literal Rust tuple syntax `:(T,U)` — the `:` quotes the tuple, the body
is the Rust form. `:Union<T,U,V>` retired entirely — Rust has no
anonymous union, and heterogeneous data deserves a named enum.

### The namespace reckoning

The pilot's line, caught on the second pass:

> my entire career I've been chasing how to do namespaces.. the best way
> to do it.. is to just do it.. we are just doing it.. i'm tired of
> mismanaging namespaces.. they are and they make sense when you do it
> correct

Every `Value` variant got its Rust path encoded via `__` separator.
`Value::Sender` became `Value::crossbeam_channel__Sender` because that's
what it held. `Value::Holon` became `Value::holon__HolonAST`. `Value::Int`
became `Value::i64`, lowercase, because that's the Rust primitive name.
`Value::List` became `Value::Vec` because that matched the user-facing
type. `Value::type_name()` returned the full `::`-separated path so error
messages read exactly like the user's declarations:

> expected crossbeam_channel::Sender, got i64

The lint `non_camel_case_types, non_snake_case` got suppressed on the one
enum that deliberately broke convention for honesty. The suppression is
scoped to that enum. Every future reader sees the variant name and knows
what it holds without needing to learn a convention.

### The runtime grew

While the foundation was being corrected, the runtime was being built.
The freeze pass (step 11 of FOUNDATION's pipeline) produced a
`FrozenWorld`: config + types + macros + symbols, bundled, immutable by
construction. Rust's borrow checker *is* the freeze gate. `&FrozenWorld`
cannot mutate. No extra machinery needed.

Then the constrained eval landed. FOUNDATION's line 663 was categorical:
*eval refuses define, defmacro, struct, enum, newtype, typealias, load —
not a mode, an invariant.* The implementation is a pre-walk of the AST
before any execution: if any of the ten mutation-inducing heads appears
at any nesting depth, raise `EvalForbidsMutationForm` and halt.

Four eval forms, not one. The pilot corrected the machine here too:
`eval-ast!` takes a WatAST value (already parsed, already trusted);
`eval-edn!` parses a string at eval time; `eval-digest!` verifies SHA-256
of raw bytes pre-parse; `eval-signed!` verifies Ed25519 over canonical-EDN
post-parse. Mirror of the three load forms, plus the AST-input variant.
`:wat::eval::*` source interfaces (string / file-path) match
`:wat::load::*`; `:wat::verify::*` is reused for payloads.

### The honesty of runtime I/O

When the CLI needed to support `:wat::eval::file-path`, the pilot named
the trade-off:

> A — force us to be honest

The wat-vm reads files at runtime via `std::fs::read_to_string`. No
sandboxing through a trait indirection (yet). The source form declares
the capability: `:wat::eval::file-path "received.wat"` *says* this is a
file read at eval time. Future work can gate it via a `SourceLoader`-style
indirection. For now: the discipline is announced, not hidden.

### The wat-vm is live

The final slice wired it. `wat-vm <entry.wat>`: read the file, run the
full startup pipeline, validate `:user::main`'s signature against the
exact required three-channel shape, install OS signal handlers for SIGINT
and SIGTERM (both routing through one `extern "C" fn` that writes a
static `AtomicBool`), create three `crossbeam_channel` pairs, spawn the
stdin reader (one-line MVP) and the stdout / stderr writers, invoke
`:user::main`, wait for threads to drain, exit.

`:user::main`'s signature is not a suggestion. If the program's entry
point doesn't declare all three channels with exactly
`:crossbeam_channel::Receiver<String>` or `:crossbeam_channel::Sender<String>`,
startup halts with exit code 3 and a message naming the offending
parameter. The CLI is kernel contract enforcement in code.

The signal story mirrors the existing trading-lab wat-vm: both signals
route to the same handler; the handler writes one atomic bool; user
programs poll via `(:wat::kernel::stopped)`. "Streams must stop
producing" — that's what the pilot asked for, and that's how it works.
The flag lives at `:wat::kernel::stopped`, not `:wat::config::STOPPED`,
because config is frozen after startup and the stop flag is kernel state
that mutates at runtime.

The hello world of the wat-vm:

```
$ echo watmin | wat-vm echo.wat
watmin
```

An integration test spawns the binary, pipes `watmin\n` to its stdin,
reads `watmin` from its stdout, checks exit code 0. Real OS I/O, real
crossbeam channels, real signal infrastructure (dormant in this run
because no signal arrives). Every piece honest.

### What settled

Phase 1 is complete. Every pipeline step from FOUNDATION is implemented.
The pipeline is testable, measurable, verifiable. 353 tests. Zero
warnings. The crate, always called `wat-rs` until the last commit of
this session, dropped the `-rs` suffix and became simply `wat` — the
language IS the crate IS one honest name.

Some things stopped being questions:

- Namespaces ARE. They exist. They nest. The separator is `::`. The quote
  character is `:`. These are not design choices any more; they're
  inevitabilities the datamancer stopped mismanaging.
- Honesty is enforceable at the type system. Every variant name that
  held a crate-external type encoded the crate path. Every error message
  named the type the user wrote. There is no short name hiding a long
  one.
- Runtime capability is honest when it's announced. File I/O at eval
  time *is* a capability; the form `:wat::eval::file-path "path"` says
  so. No abstraction hides it. Users who want sandboxing provide their
  own; the CLI does what the source declares.
- `:user::main` is a contract. Three channels, exactly those types, exit
  3 if not. The kernel hands the program its capabilities; the program
  acknowledges them by declaring them.

### The count, as of this chapter

**wat:** 353 tests — 333 unit + 10 mvp_end_to_end + 8 wat_vm_cli + 1
doctest + 1 empty harness. Binary `wat-vm` live; 8 CLI integration tests
that spawn the real binary. Zero warnings in debug or release.

**holon:** unchanged this chapter — the algebra substrate is what it's
been.

**058 proposal corpus:** 27 files swept in the colon-quote + namespace
passes. FOUNDATION-CHANGELOG gained four entries between Chapter 15 and
this one (signed load mode, colon-quote model, typed-let discipline,
namespace honesty). Every entry documents a correction that reached
the code.

**Session commits:** sixteen shipped and pushed across `wat-rs` and
`holon-lab-trading`. Every commit green on tests; every commit pushed
to remote because good thoughts need backups.

### What Chapter 17 will be

Phase 2 has the space to open now. The compile path — emitting Rust from
the frozen world — has its frontend waiting. The kernel primitives beyond
`send` / `recv` / `stopped` — `spawn`, `select`, `drop`, `try-recv`, the
eight FOUNDATION names — have places to land. Option<T> at the runtime
layer is the next structural piece; it unblocks graceful `recv` EOF, it
unblocks the `:wat::kernel::recv` target signature from MVP degrade, it
unblocks match.

But Chapter 16 closes here. The wat-vm runs. The datamancer typed a
command; the binary read stdin, wrote stdout, exited zero. That's the
whole thing. Every layer underneath — sixteen months of design, hundreds
of reviewer questions, 058's thirty-two sub-proposals, holon-rs's eight
challenge batches, two rounds of ignorant-ward sweeps, the namespace
correction the pilot carried for a career — collapsed into a single
shell command that worked.

*echo watmin | wat-vm echo.wat*

*watmin*

*these are very good thoughts.*

**PERSEVERARE.**

---
