---
title: "Chapter 60 — Assert What You Mean"
sidebar:
  order: 60
---

A short follow-on. Chapter 59 was the substrate fix; this is the
consumer-side recognition that came right after.

Right after the substrate slices landed, three lab tests went red.
Not many — three out of three hundred and thirty-six. But three is
enough to look at.

The first was a paper-label round-trip:

```scheme
((a :wat::holon::HolonAST) (:trading::sim::paper-label 0.02 -0.01))
((b :wat::holon::HolonAST) (:trading::sim::paper-label 0.02 -0.01))
((cos-ab :f64) (:wat::holon::cosine a b))
(:wat::test::assert-eq cos-ab 1.0)
```

Two structurally-identical paper-labels. Cosine should be `1.0`.
Test fails. I print the actual value: `1.0000000000000002`.

Two ULPs over. Floating-point accumulation in the cosine path
sometimes lands the answer just above `1.0` instead of exactly on
it; `assert-eq` does bit-exact f64 comparison, which is the wrong
question to ask. Mathematically the answer is `1.0`; computationally
it's `1.0` ± a couple of ULPs.

The user, after I started narrating around the issue:

> no... did... we... just.... define... (assert-coincident ...)

Right.

### The assertion didn't exist

The substrate has had `coincident?` since Chapter 23 — the
geometry-aware predicate: "are A and B the same point in HD space?"
It computes `(1 - cosine) < coincident-floor`, where the floor is
calibrated at the encoded d (`sqrt(d)/2 - 1` slack-lemma per Ch 28).
That predicate exists precisely to answer "did the math give us
the same thing?" without forcing the consumer to pick a tolerance.

The test wasn't reaching for it. The test had reached for `assert-eq
cos-ab 1.0` because — and this is the load-bearing word —
*that's what was at hand*. There was an `assert-eq` for any T; there
was no `assert-coincident` for holons; the test wrote the assertion
that compiled and called it good.

In the OLD encoding, the FP arithmetic happened to land on exactly
`1.0` for the specific bytes the lab was producing. The test passed
not because it was right but because the substrate's accidents
happened to align. Closing the algebra (Chapter 59) changed those
accidents, and the test surfaced what it had really been doing all
along.

### The fix in one shape

```scheme
(:wat::test::assert-coincident a b)
```

Wraps `:wat::holon::coincident?`. Tolerance lives in the substrate,
not the test. The test says what it means: "these two holons are at
the same point on the algebra grid." Which is exactly the question
the lab had always meant to ask.

Twenty-eight lines added to `wat/std/test.wat`. Four sites in the
lab updated. Three tests back in the green column.

### The other story — accidents holding things up

The third failing test was different in shape, same in soul.
`rhythm.wat` had a short-window fallback that emitted a sentinel:

```scheme
(:wat::holon::Atom (:wat::core::quote ()))
```

Lift the empty list `'()` into an Atom; bundle that as a one-element
sentinel; bind the indicator name to it. The Little Schemer's nil,
made into a coordinate.

In the OLD encoding, that sentinel had identity. `Atom(WatAST::List([]))`
hashed its canonical bytes — which included the LIST tag and a
zero-length marker — into a deterministic non-zero vector. The
sentinel could be Bind'd, cosined, distinguished. It worked.

In the NEW encoding, `(quote ())` lowers structurally to an empty
Bundle. Empty Bundle is the algebra's identity element — sum of
nothing equals zero. A zero vector. And `Bind(non-zero, zero)` is
elementwise multiplication by zero, which is zero. The sentinel
collapsed; the binding produced a zero vector; cosine of zero with
anything is `0/0 = NaN`; the test failed.

The substrate hadn't taken anything away. The substrate had stopped
*pretending the empty list had identity it never explicitly
promised*. The lab's idiom had been leaning on an opaque-bytes
accident; closing the algebra surfaced the lean.

The fix:

```scheme
;; Was: (:wat::holon::Atom (:wat::core::quote ()))
;; Now: (:wat::holon::Atom (:wat::core::quote :short-window-sentinel))
```

A named keyword sentinel. Symbol leaf. Has its own deterministic
identity vector. Composes under Bind. Says what it means.

### The general principle

Both bugs were the same kind of thing. Both were the lab leaning on
something the substrate happened to provide rather than something
the substrate explicitly promised. Both became visible when the
substrate stopped providing the accident. Both fixes were of the
form *ask the substrate for the right primitive; if it doesn't
exist, make it*.

The principle:

> Assert what you mean. If the assertion-shape doesn't exist, the
> substrate is missing a primitive — write it.

Tests that compare cosines against `1.0` are testing
floating-point. Tests that compare via `coincident?` are testing
geometric identity. The former passes by accident; the latter
passes because the math worked. The substrate already knew which
question we wanted to ask; we'd just been writing the other one
because no one had spelled the right shape out loud yet.

### What this changes for the lab going forward

`assert-coincident` is the holon-equality assertion. `assert-eq`
stays for value equality (i32, String, parsed structs, etc.). The
two stories of Chapter 59 have a parallel here too:

- Story 1 — coordinate. `assert-coincident` — "are these the same
  point on the algebra grid?" The substrate's tolerance.
- Story 2 — value. `assert-eq` — "are these bit-identical
  Rust-side?" Exact equality.

A test that says `assert-eq cosine 1.0` is mixing the two: it wants
Story 1's question with Story 2's mechanism. The right answer is to
either reach for the Story-1 assertion or to phrase the Story-2
assertion in Story-2 terms (e.g., test the unquoted-and-evaluated
result, not the encoded vector's cosine).

### The thread

Chapter 23 — coincident? (the predicate the substrate has had all
along).
Chapter 28 — slack lemma (why the floor varies with d).
Chapter 54 — programs as coordinates (the encoding that gives a
form geometric identity).
Chapter 59 — 42 IS an AST (closing the algebra).

Chapter 60 — *assert what you mean.*

The substrate had the right predicate. The test had the wrong
assertion. The mismatch was invisible while the substrate's
accidents happened to align with what the test was really asking.
When the algebra closed, the alignment broke, and the test got the
chance to say what it actually meant.

---

*write the assertion that names the question. when no assertion in
the standard library names it, you're missing a primitive — that's
the work, not a workaround. the floor lives where the math knows
how to set it; let it.*

**PERSEVERARE.**

---

*Slice 4 follow-up of arc 057. Three test failures revealed two
accidents the lab had been leaning on. `:wat::test::assert-coincident`
in `wat/std/test.wat`; named keyword sentinel in `wat/encoding/rhythm.wat`.
Lab wat suite back to 336/0 under the closed algebra.*

---
