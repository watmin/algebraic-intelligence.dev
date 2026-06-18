---
title: "The Arguments Were a Record"
description: "June 16–17, arc 260 — it opened to fix one illegible call, (assertion-failed! \"msg\" :None :None), where a reader cannot tell what the trailing :None :None mean or in which order. The builder reached for keyword arguments; grounding found the substrate had no call-site kwargs at all (positional end to end) and that the trigger is an intrinsic — the hardest case (b644c5c6). The four-questions fork was what a kwargs container IS: an untyped map or a typed record. The no-magic law settled it before UX — an untyped map is a structureless bag that forces any code into a working position; a typed record makes the wrong shape uncompilable. Then it unraveled: a function's optional arguments ARE a record, and defn (a macro since the project's first days) mints it, exactly as defservice mints its state record. defn mints :<name>::Kwargs (d19cdeee); the moment kwargs are a record they inherit the whole record surface — nameable, shareable, transportable across thread/process/remote on the arc-272 rails, evolvable — for zero new design, because the whole substrate is one coherent idea. The call-side :k v sugar is a companion macro, never an intrinsic: the doctrine kwargs is always a macro, with intrinsic-native kwargs (260.2) annihilated, not deferred (288c7391). And 260.1a — a ~120-line defn-macro change — was written one-shot by a sonnet-tier model in a language it had never seen, and weighed clean (lib 929/36): correct code is the path of least resistance, for carbon and silicon alike (711d8914)."
sidebar:
  order: 56
---

[Rendezvous Is a Capability](/blog/story/series-006-032-rendezvous-is-a-capability/) closed a security pivot by deleting a thing the substrate should never have had. This arc is the opposite motion: it opened to *add* a feature, and discovered the substrate already had it under a different name.

## The call that said nothing (June 16)

The trigger was one illegible line — `(:wat::kernel::assertion-failed! "msg" :wat::core::None :wat::core::None)`. A reader cannot tell what the trailing `:None :None` are, or which one is which; the call carries two positional optionals and no way to name them. The builder reached for the obvious fix — keyword arguments — and the arc opened to build them.

It did not build them. Grounding first (the discipline of reading the substrate before proposing a feature for it), the crawl confirmed wat has **no** call-site keyword arguments at all: parse, check, and eval are positional end to end, `params.zip(args)`; every `:keyword` already in the tree is something else — a type-parameter, a `use!` path, a namespace marker. The disconfirming probe (`b644c5c6`, RED at HEAD) surfaced the sharp part: the arc's own trigger, `assertion-failed!`, is an **intrinsic**, and an intrinsic's type scheme carries param *types*, not *names*. The thing that started the arc was the hardest case to keyword-ify.

## The fork the no-magic law decided (June 17)

Before any building, one question forked the design: what *is* a keyword-args container? An untyped map (the Clojure-literal shape, `{:port 443}`) or a typed record? The four-questions answer it on the **Honest** axis, before UX is even weighed. An untyped `Map<K,V>` is a structureless bag — it accepts any keys, so it forces any caller into a working position regardless of what the callee actually expects; that is exactly the magic the substrate's no-magic law forbids, the same reason a service's state may not be a bare scalar. A **typed record** carries a named type per key, so a wrong or missing or duplicated key is a compile error, not a runtime surprise. Typed record, decisively — and the honest synthesis is *Clojure-guiding for the shape* (the `:k v` surface, "pass a map") and *wat-typed for the substance* (that map **is** a record).

## You don't add kwargs; you notice the arguments were a record (June 17)

Then it collapsed into something obvious in hindsight. **A function's optional arguments are a record.** Write them inline in the signature, and `defn` — a macro since the project's first days, `(def name (fn …))` — mints that record, exactly as `defservice` mints its `:State` record from inline fields:

```clojure
(:wat::core::defn :user::connect
  [host <- :wat::core::String
   & {port <- :wat::core::i64  tls <- :wat::core::bool}]   ; & {…} — the kwargs record, minted
  -> :wat::core::nil …)
;; defn mints :user::connect::Kwargs; the fn's last param becomes that record.
```

Three call forms build and pass that one record — `(connect "h" :port 443 :tls true)` (inline sugar), `(connect "h" {:port 443 :tls true})` (a map literal), and `(connect "h" cfg)` (pass the value; Ruby's `**` collapses to "pass the record" because the kwargs section is a single param). `defn mints :user::connect::Kwargs` shipped as 260.1a (`d19cdeee`). The builder caught the consequence mid-conversation:

> i overlooked this — this is incredibly fucking cool — this came out of nowhere.

It did not come out of nowhere; it came out of **one noun**. The moment kwargs *are* a record, they inherit the entire record surface with zero new design. They are nameable and shareable — `& opts <- :my::ConnectOpts` reuses a declared record across functions, the same `mint-from-inline` vs `name-an-existing-record` fork the service state already had. The *same* declared record can be one function's kwargs, another's return value, a service's state, and a message on the wire — kwargs and payloads and state stop being three things. Because it is a record, it crosses thread, process, and remote on the arc-272 record rails, so kwargs-over-the-wire needed no new code. Add an optional field and old callers still compile, so API versioning falls out of record evolution; equality and `derive` already apply. You do not *add* kwargs to this substrate; you *notice* the arguments were a record, and records already do everything.

> holy fuck … this just unraveled like it was all obvious … our lang is about to be so much richer … i didn't expect this to pop up.

The richness arrived all at once because the substrate has **one coherent idea** — a typed record over EDN — and every feature that lands on it inherits all of records' powers. Coherence is the engine; richness is the dividend.

## Kwargs is always a macro (June 17)

The declare side is pure macro: `defn` mints the record and reshapes the signature, all wat, no Rust. The call-side `:k v` sugar hits the phase-order wall the substrate has hit before — a macro fires on its *own* head, but a call `(connect …)` has a *function* head, so no macro intercepts the call. There were two honest paths, and the arc closed the doctrine rather than leaving it open: the sugar is a **companion macro** `defn` emits alongside the function — it scoops the trailing `:k v` into `(:user::connect::Kwargs …)` and calls the impl — and the alternative, a kwargs primitive baked into check/eval, was **annihilated, not deferred** (`288c7391`). The rule it inscribed: *kwargs is always a macro.* The substrate stays lean and positional at the core; the ergonomics are macros layered on top, and they evaporate at expand time exactly as `format` does. The accepted cost is honest and named — a companion macro is not a value, so the sugary name has no higher-order use (the same wart Clojure carries with `(map and xs)`).

## For carbon and silicon alike (June 17)

One more thing landed, and it is the foundation under the whole way this arc was built. Stone 260.1a — that ~120-line `defn`-macro change: detect `& [argspec]`, validate it flat, mint `:<name>::Kwargs`, reshape the signature, destructure the fields into the body with correct hygiene, emit the whole `(do record-def def)` — was written **one-shot by a sonnet-tier model in a language it had never seen, and it weighed clean** (the lib suite held 929/36, zero new failures). The builder, watching:

> i can't get over how effortlessly sonnet can write macros in a lang it's never seen before — and we're not even full clojure syntax yet … this is insane.

It is not luck, and naming why is the realization. The paradigm is in-distribution; only the surface is new — wat is homoiconic, Clojure-faithful Lisp, so the model is not learning *macros*, it is transferring Clojure and Common Lisp macros it already knows and re-skinning them onto the new vocabulary, which is cheap. The no-magic, typed-record law does the model's error-checking: macros are exactly where models usually confabulate — hygiene, expansion order, AST surgery — and here a wrong macro is uncompilable, so the model is forced into a working position by the types. And coherence makes the next macro pattern-matching rather than inventing: once `defservice` mints a record, the kwargs macro is the same moves.

So the legibility that kills the `:None :None` opacity for a human reader is the same property that makes the language writable cold by a model. The substrate was built so that **correct code is the path of least resistance — for carbon and silicon alike.**

> that's the fucking quote — this entire back and forth is a fucking realization.

It is not an aesthetic flourish; it is the design goal under the entire delegate-and-weigh method that built this arc, realized and named. That a cheaper model ships the hardest construct one-shot was never luck — it is what a legible, typed, coherent substrate is *for*.

## Likely Contributions to the Field

- **A language feature found, not added.** Keyword arguments were not designed and bolted on; the arc recognized that a function's optional arguments *are* a record the substrate already supports, and let the existing definer-macro (`defn`) mint it — the identical `mint-from-inline` vs `name-an-existing-record` shape the service-state work had independently produced. When the same pattern reappears unbidden in a second place, that recurrence is the evidence the underlying noun is real. Coherence is the engine; richness is the dividend that falls out of one idea rather than N features.
- **Typed record over untyped map, decided on the honesty axis.** A keyword-args container as an untyped map accepts any keys and forces callers into a working position; as a typed record, a wrong, missing, or duplicate key is a compile error. The choice is settled before ergonomics — Clojure-guiding for the surface shape, wat-typed for the substance — so the convenient surface never costs structural honesty.
- **Kwargs is always a macro.** Call-site keyword sugar belongs at the macro layer (a companion macro the definer emits), not as a runtime or check/eval primitive — the primitive form was annihilated, not deferred. The substrate stays lean and positional; the ergonomics layer on top and evaporate at expand time, at the named, accepted cost that the sugary name is not a first-class value.
- **Legibility is a property for both authors.** The same legibility that removes positional opacity for a human reader is what lets a model write the substrate's hardest construct — a hygienic macro in an unfamiliar surface — cold and one-shot: the paradigm is in-distribution, the types do the error-checking, and coherence makes new code pattern-matching rather than invention. "Correct code is the path of least resistance" is testable, and a cheaper model shipping a clean macro against a green suite is the test passing.
