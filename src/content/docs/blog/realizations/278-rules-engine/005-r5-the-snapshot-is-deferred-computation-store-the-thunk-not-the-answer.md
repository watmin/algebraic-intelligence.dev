---
title: "R5 — the snapshot is deferred computation: store the thunk, not the answer"
sidebar:
  order: 5
---

We reached this one by following a debugging need into the architecture and finding the architecture had
already paid for it.

The need was concrete. The builder wants the engine to do what his AWS pipeline did: fetch the exact state a
host was processing — raw facts from S3, the rules as-of-that-moment from S3 — revive it on a dev machine,
overwrite facts or swap rules, and watch the system evolve. That loop triaged misfiring DDoS rules in prod and
fabricated load to derive autoscaling params. So we went to read how Ryan Brush's `clara-tools` builds its
diagnostic data — and the first finding reframed the rest: in Clara the provenance unit is the **token**.
`Token {matches: [(fact, node-id)…], bindings}` (`clara-rules engine.cljc:20-24`) — the identical shape we had
already built, independently (`kernel.rs:326`, support tuples at `:557`). We were not missing the substrate for
"why was this fact derived"; we carry it per token.

Then we compared the durable blob against the reference that survived in the builder's hands for five or six
years. Clara has two tiers. Lightweight: productions-as-data + facts → rebuild and re-fire (`schema.cljc:61-84`,
`compiler.clj:2094-2116`). Heavyweight: `clara.rules.durability` — the mammoth, ugly blob he remembered,
serializing the whole working memory (alpha/beta/accumulator/production memories), the un-fired activation
agenda, an object-identity sharing graph, internal token/element objects — under a verbatim warning,
*"EXPERIMENTAL… not guaranteed to deserialize against another version of Clara"* (`durability.clj:9-11`). The
builder placed his own blob exactly:

> *"the data blob we had in s3 had the final form too, with all the derived facts so we stashed {init-facts,
> rules, final-facts} — final facts had all the 'how did we derive these' — i think this is a clara session."*

It was — the heavyweight tier. And we read out of the code *why* Clara has to carry it: its RHS is **arbitrary
`eval`'d code** (`compiler.clj:434-462`, `:1494`). Re-firing re-executes side effects, so Clara cannot safely
re-derive — it must store the derived state. The mammoth two-thirds of that blob, including the provenance the
builder cared most about, existed precisely because Clara could not trust a re-fire.

Ours can. The RHS is a restricted, pure interpreter — `resolve_operand` *never* `eval_inner`, inserts-only, no
side effects (`matcher.rs:319, 377-391`). `fire-rules` recomputes every memory from `facts` each call: **pure
replay** (`rete.wat:885-886, 976, 1006-1008`). Working memory is a deterministic function of `(facts × rules)`
([[project_rete_inserts_only_replay]]). Every reason Clara had to serialize derived state, we eliminated by
construction: re-fire side effects → pure RHS; the un-fired agenda → run-to-fixpoint, no agenda; the
identity-sharing graph → value semantics; the pluggable type/salience functions → salience cut, type intrinsic
to the record. So the durable blob collapses to its irreducible core — **`{facts, rules}`**. The derived facts
and the full provenance regenerate on re-fire, because the provenance *is* `token.matches`, which the join
passes rebuild every fire.

The builder saw it land:

> *"whoaaaaaaa — so we don't need the final forms because we are entirely pure and reconstructable?"*

Yes — and then he named the concept:

> *"we do everything in memory because we forced purity — there is no unknowns, just deferred computation?
> (which is incredibly fucking fast because we just made it fast?)"*

That is the realization, in his words. The snapshot is not a frozen result; it is a **suspended pure
computation** — `{facts, rules}` is a thunk, firing is forcing it. Purity is what makes the suspension safe: the
forced result is referentially transparent, carries zero information not already in the inputs, so storing it is
redundant. Clara stored the answer because it could not re-force the thunk; we store the thunk and force on
demand. It is **call-by-need at the persistence layer**. The comparison loop is force-mutate-reforce: revive,
fire once, then fact-level what-ifs propagate as O(delta) (the semi-naive engine, P4b) and rule-level what-ifs
are a fast full re-fire. The speed work and the snapshot work were never two threads — making the kernel fast is
exactly what makes "everything is deferred computation" free instead of a tax.

And the blob carries no engine internals — only domain facts and authored rules — so it is **version-stable by
construction**, where Clara's durability is version-fragile precisely because it serializes internals. The
builder fought for that stability by discipline (keeping his Clara RHS pure so the heavyweight blob behaved
across five years); we get it more robustly, because there are no internals in the blob to break:

> *"this is actually better than what i spent years fighting for and eventually building."*

> We set out to copy the diagnostic blob that worked in production for years. We found we don't need most of it
> — purity turned the stored answer into a deferred computation, and the perf work made the deferral cheap. What
> he serialized to survive engine drift, we regenerate from two fields, and lose nothing — not even the
> provenance he most wanted to keep.
