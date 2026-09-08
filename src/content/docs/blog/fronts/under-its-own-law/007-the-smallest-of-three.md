---
title: "The Smallest of Three"
description: "Late April 2026, one scratch repo, three sketches: a program-as-an-MCP-server, a REPL, and a small ask to let `main` see its arguments. The smallest one opened as arc 170 and closed eighty-one days later by shipping the other two — and the REPL, planned as a Rust crate wrapping a line-editing library, arrived as a stdlib wat module while the MCP bridge stayed in Rust because wat's own law refused to carry it."
covers: 2026-04-29/2026-07-29
written: 2026-09-07
backfill: true
sidebar:
  order: 7
---

Backfill: this covers 2026-04-29 through 2026-07-29 and was written on 2026-09-07 from a sibling scratch repository, arc 170's DESIGN and INSCRIPTION, the commit bodies, and the shipped source, all still on disk. The April directories in that scratch repository were reconstructed on 2026-05-01 by replaying `Write` and `Edit` tool calls out of six Claude session transcripts, after the assistant itself deleted the scratch tree during a repo move (`7fc430a`, scratch repo). The documents carry their own dates; the commit does not. It describes the CLI as it stood on 07-29, not as it stands now: the flag family kept growing after the close.

## Three sketches in one week (2026-04-29 → 2026-05-03)

Before arc 170 existed there was a scratch repo — a separate tree from `wat-rs`, one directory per idea, each carrying a `README`, an `INDEX.yaml` capturing the builder's direction verbatim at the decision points, and a design. Nothing in it compiles. It is where shapes get argued before they cost anything.

Three of those directories matter here, and they were opened within five days of each other.

- **`006-wat-mcp`** (2026-04-29) — a program-as-an-MCP-server. Shipped 07-29 as `wat --mcp`, with the loop in Rust.
- **`012-wat-repl`** (2026-05-02) — a REPL, planned as a Rust crate wrapping a line-editing library. Shipped 07-29 as `wat/repl.wat`, 144 lines of wat in the distribution.
- **`019-wat-cli-options`** (2026-05-03) — let `:user::main` accept argv. Opened as arc 170 on 05-09 and closed 07-29 by shipping the other two.

The first, `006-wat-mcp`, self-dates its framing to that day and opens on a continuation of the debugger arc:

> i just had a wild idea.... you talked about a :wat::pry::serve ... what if... we could have a program-as-an-mcp.... give the agent a way to run a program /and/ live debug it?...

The first sketch answered it the expensive way: walk the symbol table, emit JSON Schema per typed signature, publish each function as its own MCP tool, transcode JSON to wat values on the way in and back on the way out, and maintain that schema list as new batteries land. The builder deleted all five steps in one line:

> i think... the JSON rpc.. is just a thin wrapper... the input object would be something like '{"msg":":some-edn-form"}'

The arc's `the-collapse.md` records what that sentence removed rather than what it added: no symbol-table walk, no per-function tool registration, no stale tool list, no type-boundary mismatch, no transcoding pass, and — the one that matters — no second system of truth, because without a generated schema there is no published document that can drift from the substrate. What survives is what the arc's index wrote down that day: *JSON-RPC is just envelope; the payload is wat source as a string.* One tool.

The second, `012-wat-repl`, was split out on 2026-05-02 (`68f79d9`) on a distinction the builder drew by analogy:

> i think we rename and split... break the repl part into its own and the breakpoint/pry into its own.... ruby's irb doesn't do what pry does but pry builds upon irb....

Its README plans a self-contained Rust crate at `wat-rs/crates/wat-repl/`, depending on `rustyline` for line editing and history, with a Rust shim driving eval dispatch, an embeddable entry point `(:wat::repl::start :context ctx)`, and a CLI reached as `wat repl`.

## The smallest ask already had the word `repl` in it (2026-05-03 → 05-09)

The third, `019-wat-cli-options` (`078381c`), is the earliest artifact recording the ask that became arc 170 — six days before the arc opened:

> i think we need to ship something like... wat-cli-options.. and we update the :user::main func to accept argv who is of a mandatory spec...
> wat file.wat some list of whatever arguments after the file
> argv is /always/ :
> $0 = the wat binary
> $1 = the wat file
> $N = whatever whitespace deliminted string values appaer after the file

It is the smallest of the three by a wide margin: a mandatory parameter shape on one function. Its own cross-reference section files `--mcp` under arc 006 and `wat repl` under arc 012, as a reserved subcommand belonging to somebody else's arc.

And the same document says where a REPL comes from:

> because wat is static, users /must/ compile their own cli if they want their symbols found - that's the agreement.. they can export their own binary with wat forms bound in the binary.. but they can and should make their own wat to get stuff like repl to work for them...

Arc 170 opened on 05-09, at `b433da7`. Beat one of its own conversation log is four words — make :user::main accept argv — and by beat fifteen the subject is the wire form of a spawned program (we don't communicate strings - we communciate ast) and by beat sixteen it is whether a program needs a name at all (why do we even need a name if the forms /are/ the thing that matters?). The framing line the arc kept:

> brutal rigidity brings the paradoxical unbounded flexibility if you play by the rules

The DESIGN's own name for that expansion is the *substrate-as-teacher cascade*. The arc absorbed program-entry contracts, closure extraction, typed channels, three substrate services, the execve rebirth, and a branch named after a deadlock, all of it [chronicled there](/blog/arc-170-realizations/). The parser's one global arity check became an enum with a variant per mode, and that is the only reason a mode wanting zero positionals could join as a variant rather than as another special case. The INSCRIPTION records that `argv` itself was among the last things in the arc to work, because the pipe it needed did not exist until the rest did.

## The valve was an arity check written for a different mode (2026-07-26)

On day 78, `92aa390` landed the original ask. The ambient had been there for weeks — the `ARGV` cell, `set_argv`, the `(:wat::runtime::argv)` verb, and a source comment in `distribution/mod.rs` stating the contract in full. Nothing passed through it.

The valve was one line in `argv::parse`: a single `positional.len() != 1`. `git log -S` puts it at `2b397cc` — arc 115, written to enforce `--check`'s grammar, and applied to every path. It predates the pipe arc 170 laid, and nobody revisited it when 170 added the ambient. `wat prog.wat --some arg` had been a usage error the whole time.

The fix is one sentence: arity belongs to the mode, not to the parser globally. A closed set is an enum, each variant carrying its own contract — `Check` takes exactly one positional because checking two files has no defined output shape; `Run` takes at least one and the rest belong to the program. Flags are recognised only before the entry path, so `wat prog.wat --check` hands `--check` to the program instead of silently switching the CLI into check mode. `argv[0]` became the resolved binary from `current_exe()` rather than the shell's spelling, because a bare `wat` off `PATH` is unusable to a program that does not also know the cwd and the search that produced it.

The comment written into that enum on 07-26 names the mode that would use it three days before it existed:

```rust
/// Verifying ONE file and RUNNING a program with arguments are
/// different contracts; giving each mode its own means a new mode
/// (`--repl`, which wants zero positionals) joins as a variant.
```

## The REPL was planned in Rust and arrived in wat (2026-07-29, 01:39)

Two days earlier the builder had set the closure condition, overruling a plan to close the arc on the fork bug:

> i think our next move is figuring out a repl.... i want to inscribe 170 with a repl.

And the reason, from the closure backlog:

> i think we just ship `wat --repl` so it can access the privileged tooling? that … kinda proves the demo isn't a demo.

`568cdf8` shipped it at 01:39. Not the sketched crate. No `rustyline`, no Rust frontend, no `wat repl` subcommand. `wat/repl.wat` is 144 lines of wat in the distribution, and the CLI entry is this, whole:

```clojure
(:wat::core::defn :user::main [] -> :wat::core::nil
   (:repl::turn (:wat::core::Vector :- [:wat::WatAST])))
```

That is the terminal artifact of an eighty-one-day arc about argv: a `:user::main` with an empty parameter list, in a mode declared to accept exactly zero positionals — because the REPL's program is baked into the binary and a trailing path would be a lie about what runs. What the argv work actually bought was not arguments. It was per-mode arity, and that is the only reason `Mode::Repl` could be a variant instead of another special case bolted onto a shared check.

The placement was the builder's call and it is recorded as a pushback. The file had first been put under `wat-scripts/` and reached by baking it — the commit's own word for that attempt is *timid*. The only thing keeping a shipped feature out of `wat/` was its `:user::main`, which is not a property of a REPL but of where an entry point was left. Moving it to the CLI made `wat/repl.wat` a stdlib module exposing `:repl::turn` and nothing else, and made the REPL a library: any program can call `(:repl::turn defs)` to embed a loop seeded with its own definitions, which a REPL-as-a-file could never offer.

Under the front's own law, the file states its own speed as a discipline:

> WHY IT IS SLOW ON PURPOSE. Every turn re-derives the entire world from `defs`. That is the R1/R9 dual-impl discipline: this is the correct-but-slow ORACLE. Its correctness is not argued, it is structural — the turn runs the ORDINARY program pipeline, so this REPL is exactly as strongly typed as a compiled program.

`defs` is a `Vector` of `WatAST` threaded through a tail call, and it is a loop parameter rather than a service, because state that never crosses callers does not need an address. The live environment is Rust-side, threaded separately by `eval-with-defs!`. The header also carries a confession: an earlier paragraph described a `:durable`/`:ephemeral` split — defservice vocabulary — for a file containing no defservice, a leftover from the demo REPLs that genuinely were a spawned service you dialled. It cost an hour of "is this a service or not" before the source itself settled the question, and it is kept visible in the source because a stale comment reads as grounded precisely because it is specific.

The gate was proved by breaking it rather than by exit code. `defs` grows in exactly one place, the `FormOutcome::Declared` arm; severing that line failed `definitions_persist_across_turns` and only that test, while the other four stayed green — which is how a REPL gate is usually vacuous, since asserting exit 0 proves a process exists. The load-bearing test is that a form which fails to check is reported and the session continues, which is why a REPL's failures have to be values.

## The other one stayed in Rust, and wat's own law is why (2026-07-29, 11:59)

Ten hours and twenty minutes later, `fd89bed` shipped `wat --mcp`: the 2026-04-29 sketch's wire, unchanged. Both modes are flags, which is the sketch's other reversal — `019` had reserved bare subcommand names for wat and a `user:` prefix for everyone else.

```
in:  {"jsonrpc":"2.0","id":1,"method":"tools/call",
      "params":{"name":"eval","arguments":{"edn":"(:wat::core::+ 2 2)"}}}
out: {"jsonrpc":"2.0","id":1,
      "result":{"content":[{"type":"text","text":"4"}],"isError":false}}
```

The commit states the property the sketch had reached for: the payload is never converted to JSON, it rides inside a JSON string as characters exactly as written.

But the loop is Rust, and the commit is explicit that this is the substrate's ruling and not convenience. wat's stdin and stdout are strict-EDN data channels by construction; a wat `println` EDN-encodes whatever it is handed. Printing a JSON frame from wat therefore delivers `"{\"jsonrpc\"…}"` — an escaped string literal, not a JSON object. Measured, not assumed. The channel is correctly refusing a foreign format, so the bridge sits at the transport beside argv and the frame reader, and `wat/mcp.wat` does not exist. It was named as a future stone in the same day's wrap-up and is still absent from the tree.

What the two modes do share is semantics, deliberately: `eval_form_against_defs` was factored out of `:wat::eval-with-defs!` and is called by both the wat verb and the Rust loop, so `--repl` and `--mcp` cannot drift on how a form is classified, on which arm grows the definition set, or on what a failure looks like. The MCP module owns the codec and owns no semantics. Its gate was proved the same way: cutting the single line `session.defs.push(form)` turns three of five tests red.

That refusal is this front's shape exactly. The law wat enforces outward — EDN all the way down, one honest encoding per channel — is what stopped wat from hosting its own JSON transport. The language did not get an exemption for its own tooling.

## How it closed (2026-07-29, 15:32)

The INSCRIPTION landed at `10234ed`, and the recognition it carries is [published in full](/blog/arc-170-realizations/210-the-closing-realization-per-portam-cogitamvs-arc-170-opened-on-argv-an/).

The stated precondition was measured rather than assumed. The DESIGN had carried since 2026-05-13 that clippy and rustc must both be clean before an INSCRIPTION ships. At close, `cargo build --release --all-targets` returned zero warnings and `cargo clippy --release --workspace` returned roughly 1,150, of which 831 were a single lint. The builder was shown the number and rescoped in the open:

> clippy isn't zeroed out - let's deal with that after merge - first thing we work on before anything else is driving it back to zero.

`d33010c` is the very next commit after the INSCRIPTION, "clippy sweep 1/N"; `770eeaf`, the following day, reports zero. The rescoping was honoured inside twenty-four hours, which is what turns a rescope into a plan rather than a dismissal.

The deferral grep was mandatory before the INSCRIPTION could ship, and its single permitted match is the affirmative form *out of arc 170's scope*, with every item under it carrying a named owner or an explicit statement that no arc owns it and why. The convention shipped as a convention, with a probe in `wat-scripts/scratch-pad/` that hands a rogue record to a two-type clause and type-checks green — the live witness that goes red the day the set is genuinely closed. The DESIGN was trued because it was lying: its status header still read IN FLIGHT with the deadlock as current blocker, two days after that deadlock had been made unconstructible.

The INSCRIPTION says seventy-nine days; the calendar from 2026-05-09 to 2026-07-29 is eighty-one, and seventy-nine lands on 07-27 — the day the deadlock died and the closure condition was set. The branch came home at 3,428 commits ahead of `main` and zero behind, floor `4183 passed, 262 skipped` as the INSCRIPTION states it. The smallest of the three sketches closed by shipping the other two.

## Likely Contributions to the Field

- **A prerequisite can close by delivering the arcs it was a prerequisite for, and that is a signal about which one was mis-sized.** Three features were sketched in one week; the two large ones were designed in detail and the small one was a parameter-shape change. The small one opened as an arc, absorbed a program-contract architecture, and shipped both large ones as its closing act, in under fourteen hours, from parts already on disk. The estimate that was wrong was not the small one's — it was the assumption that "let `main` see its arguments" is a leaf change rather than a statement about every entry point the runtime has.
- **A design planned in the host language and delivered in the target language is a measurement of the target.** The REPL was specified as a Rust crate wrapping a line-editing library, reached by a reserved subcommand. It shipped as 144 lines of wat in the distribution, with the CLI reduced to a one-form shim, and its correctness is structural rather than argued: the turn runs the ordinary program pipeline, so the interactive surface is exactly as strongly typed as a compiled program. Nothing about the plan was wrong when it was written. The substrate moved under it.
- **The same law can hand one feature to the language and refuse the other, in the same day.** wat could host its own REPL because a REPL is EDN in and EDN out. It could not host its own MCP server, because its stdout EDN-encodes what it is handed, so a JSON frame emitted from wat arrives as an escaped string literal rather than an object. The bridge stayed in Rust at the transport boundary, and the shared evaluation core was factored out so the two modes cannot drift. A language subject to its own rules gets no exemption for its own tooling, and the refusal is more informative than the acceptance.
- **A global arity check is a mode-shaped decision written in the wrong place, and it fails silently for months.** One `positional.len() != 1`, authored for a verification subcommand and applied to every path, made argument passthrough impossible while the entire ambient for it shipped and worked. Replacing it with a variant per mode was what let a zero-positional mode exist at all — the comment naming that mode was in the tree three days before the mode was.
- **A closure is an act with a grep.** The precondition measured rather than asserted; the miss rescoped by its author in the open and discharged in the next day of commits; a mandatory deferral scan whose one permitted match is affirmative; every out-of-scope item carrying an owner or a stated reason it has none; a convention shipped as a convention with a probe that goes red when it stops being one. None of that is specific to a language.
