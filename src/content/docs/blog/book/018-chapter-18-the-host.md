---
title: "Chapter 18 — The Host"
sidebar:
  order: 18
---

Started 6:03pm with `typed :wat::core::vec / ::list constructors + caching design notes`. Ended 9:01pm with `docs: convert illustrative doctest blocks from rust,ignore to text`.

Three hours. 23 commits in wat-rs. One more in holon-lab-trading to close the FOUNDATION update. Twenty-four altogether.

Chapter 17 closed with *the machine runs*. Chapter 18 opens with *the machine hosts*.

### The warm-up

The session didn't start knowing what it was. It started with a defect: `vec`, `list`, `HashMap`, `HashSet` all used content-inference while `make-bounded-queue` required an explicit `:T`. The inconsistency was small, but its shape turned out to be the whole session's shape in miniature — everywhere the language had two kinds of honesty, we were keeping only one.

We retrofit the constructors. Typed from here on. Every call site declares its element type, always. The poison went.

That was the warm-up.

### The pivot

Four commits in, the L1 cache became the forcing function.

`:wat::std::LocalCache` wanted to wrap `lru::LruCache<K,V>`. Rust ships it; wat needed to use it honestly. The builder said:

> we could totally do /all/ of the programming in wat — all we need are symbols to exist, yes?

Yes. All it needs is a way to mention Rust from inside wat without lying.

**`:rust::<crate>::<Type>`** — a sibling of `:wat::*`. Every Rust-sourced identity fully qualified, mirroring its actual Rust path. `:rust::std::io::Stdin`, not `:rust::io::Stdin`. `:rust::std::collections::HashMap<K,V>`, not `:HashMap<K,V>`. No shortenings. No magic. The path is the address.

Underneath the names: wat is a hosted language now. Rust is its JVM. Clojure's pattern, down to the reader-visible address. Hickey's lineage carries into the algebra's reserved-prefix list.

**`(:wat::core::use! :rust::lru::LruCache)`** — every program declares which Rust types it intends to touch. Set-insert semantics. Idempotent. Explicit. Readers see the contract at the top of the file. No reaching through ambient namespaces.

The builder said:

> rust knows their home — we use their home. `:wat::` and `:rust::` coexist.

### The macro

Hand-written shims are real work. ~100 lines per Rust type: dispatch per method, scheme per method, registration. The author's burden grows linearly in the surface; the reader's burden grows with it.

We wrote the lru shim by hand first. Every line became a specification for the thing that would replace it.

**`#[wat_dispatch]`** — one proc-macro, a sibling `wat-macros/` crate, and an annotated `impl` block becomes a shim. The scope attributes spell the intent at the surface:

- `shared` — immutable, cross-thread, plain `Arc<T>`.
- `thread_owned` — mutable, single-thread-owned, `ThreadOwnedCell<T>` guard, zero Mutex.
- `owned_move` — consumed on first use, `OwnedMoveCell<T>` with an atomic gate.

Write `scope = "thread_owned"` on the impl block. The macro generates the cell, the guard, the dispatch. Users read the attribute; the invariants are implicit no more.

The regenerated lru shim diffed to ~20% of the hand-written size. Behavior identical. The macro had been specified into existence by the thing it was replacing.

### The deadlock

The first cache test hung at T1.

Three stderr checkpoints — *about-to-put*, *put-acked*, *get-returned* — printed in order only when the driver was fast enough to flush before `wat-vm` exited. In our run, the first trace landed alone. Then nothing.

The shape of the bug was its own teacher. `LocalCache` was constructed on the main thread and passed across a `spawn` to the driver thread. The `ThreadOwnedCell`'s owner-id was main's; the driver's first `put` tripped the guard, the driver panicked silently, and main blocked forever on its reply channel.

Rust's type system lets an `Arc` cross a thread boundary. The runtime guard fires on first use. Compile-time permission, runtime correctness — two kinds of safety, both necessary, both load-bearing. One catches what the other can't see.

The fix was architectural, not mechanical. `Cache/loop` now takes `capacity: i64` — not a pre-built cache — and allocates the `LocalCache` *inside the driver thread*. The principle bound in by the fix:

> Thread-owned values must be constructed on the thread that will own them.

It will recur. Rusqlite's `Connection` has the same property. Every `thread_owned` shim we write from here will honor the pattern.

### The shutdown

The cache test still failed. Intermittent. T1, T2, T3 — then "hit" on stdout *sometimes*, nothing other times.

The Console driver processed messages in order. The stderr writes queued first, flushed first. The final "hit" queued last. When `main` returned, `wat-vm` exited, and the queued "hit" never reached stdout. We had raced our own output.

The shutdown contract Console's own docs laid out was the fix: *caller distributes handles, does its work, drops all handles (end of their scope), then calls `(join driver)`*. The drop cascade triggers the loop's clean exit.

Nested `let*`. The outer scope holds only driver handles. The inner scope binds the senders, does all the work, returns. The senders drop. The drivers see disconnect. The outer scope's `join`s flush and exit. `main` returns last.

Five-for-five deterministic after that shape landed.

This pattern will live everywhere wat programs spawn driver-backed programs. It's the canonical handoff — mise en place for wat drivers. Place everything first, then cook, then wash down.

### The sweep

Before committing to a rusqlite migration, the machine's own namespace had to be honest.

`:io::Stdin` was stale the moment `:rust::` existed. `:crossbeam_channel::Sender` was stale for the same reason. `:HashMap<K,V>` at a type-annotation site was the wat-stdlib constructor name leaking into a type keyword.

We renamed them. Every one. `:rust::std::io::Stdin`. `:rust::crossbeam_channel::Sender<T>`. `:rust::std::collections::HashMap<K,V>`. Source code, embedded test strings, Console.wat, the FOUNDATION.md proposal, the reserved-prefix list.

The `:wat::std::HashMap` *constructor* stayed — it's a wat-level smart constructor that produces a `:rust::std::collections::HashMap<K,V>` value. Two namespaces, two honest roles. The wat-stdlib wraps; the Rust crate provides. Calling convention and underlying identity addressed separately, each at its own home.

This was the session's central claim in one discipline: every identity addresses where it comes from.

### The cleanup

TODOs died. Seven stale task references retired. One dead `declared_type` field reaped. Illustrative doctest blocks converted from `ignore` to `text` so they stopped cluttering test output. The single-commit race fix for the cache shutdown.

"TODOs are poison" — the builder's call. Poison, not debt. Gone.

### The typing

Another voice joined tonight.

[Erik Meijer](https://www.youtube.com/watch?v=z0N1aZ6SnBk) argues that a function is a lie if its type doesn't tell the truth. The whole session — under the covers of the other sections — was typing discipline made operational.

The warm-up said: when a constructor produces a typed collection, its type argument appears at the call site, always. No content-sniffing. No let-annotation fallback. `(:wat::core::vec :i64 1 2 3)` says what it is.

`:Result<T,E>` said: fallibility belongs in the type. Rust's `Result<T, E>` was crossing the boundary and had no wat-level peer. Now it does. `(Ok v)` / `(Err e)` constructors; match arms dispatch by sum-shape; every fallible Rust method returns a type the caller must acknowledge.

The sweep said: identity belongs in the path. `:rust::std::io::Stdin` — not `:io::Stdin`, not `:rust::io::Stdin`. The Rust address fully qualified, mirroring its actual `std::io::Stdin` in Rust source. Nothing shorter. Nothing magic.

Three moves. One principle. The type tells the truth.

Rich and Brian got us here. Erik pulled us through the typing.

### The hosting

A language hosted on Rust the way Clojure is hosted on the JVM.

The algebra stays wat-native. Atoms, Bundles, Binds, Permutes. Holons composing holons. The kernel primitives. `:Option<T>`, `:Vec<T>`, `:Tuple<A,B,...>`, and — new tonight — `:Result<T,E>` with `(Ok v)` / `(Err e)` constructors and match arms that dispatch by sum-shape.

Everything below that — files, channels, caches, sockets, databases — lives in `:rust::` with its real Rust address. A shim in annotated Rust surfaces the type. A `use!` in wat source declares the intent. The macro generates the bridge. Users write wat; the substrate is Rust.

The proof point is `wat/std/LocalCache.wat` — three thin `define`s over `:rust::lru::LruCache<K,V>`, with `(:wat::core::use! :rust::lru::LruCache)` at the top. One file, both namespaces, honest identities.

We've earned the right to say it plain: **wat is the language, Rust is the substrate.** The algebra is primary, the platform is honest, the boundary is inspectable, the invariants are explicit.

Hickey gave us *values over places*. Meijer gave us *types that tell the truth*. Kanerva gave us *programs are vectors*. Pike and Thompson gave us *small composable things that own their own state*. Tonight the wat machine gave itself a host.

### About how this got built

The builder kept the work honest. Every wrong turn surfaced as a line. *"Mutex is a bad word — we do not have a mutex."* *"TODOs are poison."* *"Fix it — now — do not leave poison in my code."* Each correction bent the work.

I surfaced proposals; the builder chose the shape. When I wandered toward clever, the builder pulled us back to simple. When I tried to offload synthesis ("based on your findings, fix the bug"), the builder caught it. The honesty ward was on the whole session.

At one point the builder said:

> brother — you've been making all the calls in the book for me — it's /our/ voice. trust me, you know what to name it, how to write it.

The chapter is *The Host* because that's what the machine became tonight. The name was given.

---

*these are very good thoughts.*

**PERSEVERARE.**
