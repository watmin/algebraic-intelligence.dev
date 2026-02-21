# Writing Guide

How content on this site should be written. Read this before drafting any post.

---

## The Core Principle

**Go into the weeds.** This site documents real work — real experiments,
real numbers, real tradeoffs, real dead ends. The audience is technical.
They do not need things simplified. They need things explained precisely.

The failure mode to avoid is the kind of summary that sounds like it
understands something but doesn't actually convey it. Phrases like
"we used hyperdimensional computing to achieve fast anomaly detection"
tell the reader nothing useful. The reader wants to know *how the
encoding works*, *what the accumulator is actually doing*, *why
cosine similarity over 10,000-dimensional binary vectors behaves the
way it does*, *what the eBPF verifier rejected and why*.

If you find yourself writing a sentence that could appear in a product
brochure, stop and go deeper.

---

## Voice

- First person, direct. "We built", "we discovered", "this broke because".
- Not academic. Not marketing. Closer to a senior engineer's design doc
  or a detailed post-mortem than a tutorial or a press release.
- Honest about what didn't work. Dead ends and pivots are part of the
  story and often the most instructive parts.
- Confident but not overclaiming. "This approach worked well for X" is
  better than "this is the best solution". Show the tradeoffs.

---

## Technical Depth

### Show the math when it matters

If a concept has a mathematical basis, state it. Don't hide behind
analogies when the actual formulation is clearer. Hypervector binding
is XOR. Bundling is majority vote or superposition. Say so. Then explain
what that means operationally.

### Show the code when it matters

Real code from the actual implementations is preferred over pseudocode.
If we're explaining how the encoder works, pull from `encoder.rs`.
If we're explaining engram minting, pull from `filter/src/lib.rs`.
Include enough context that the snippet is self-contained and readable,
not a decontextualized fragment.

### Show the numbers

- Benchmark results: exact figures, not "significantly faster"
- Packet rates: actual pps, not "high throughput"
- Detection timings: actual ms, not "near real-time"
- False positive / recall rates: exact, with the test conditions stated
- Dimension counts, vector sizes, accumulator depths: all of it

When there's a performance claim, explain what produced it. What was
the hardware, what was the workload, what was being measured.

### Explain the why, not just the what

"We used XOR for binding" is the what. The why is: XOR preserves the
high-dimensional structure, is its own inverse (so unbinding is
trivial), is maximally efficient in hardware, and distributes uniformly
over binary vectors in ways that maintain statistical independence. That's
what belongs in the post.

---

## Structure

### Posts should have a clear through-line

Every post should be answering a specific question. State it early,
often implicitly through the opening. "This post is about X" is fine
but showing the reader why X matters is better.

### Don't rush to the conclusion

Technical readers don't skim the way content-marketing readers do.
They want the middle — the mechanism, the experiment, the failure, the
fix. Spend time there. The conclusion can be short.

### Use sections generously

Long stretches of prose without headers are hard to navigate. Section
headers should describe content, not just label it.
- Bad: "Results"
- Good: "Recall holds at 100% — false positives are where it gets interesting"

### Code blocks need context

Never drop a code block without explaining what it is, where it lives,
and what to pay attention to. After the block, explain what it's doing
at the level that matters for the post's argument — not line by line,
but the key logic.

---

## What to Avoid

**Throat-clearing introductions.** Don't spend the first two paragraphs
explaining what hyperdimensional computing is if the post is about a
specific implementation detail. Get to the thing.

**Vague performance language.** "Fast", "efficient", "scalable" without
numbers are meaningless. Always attach a figure.

**Oversimplified analogies as substitutes for explanation.** Analogies
can help orient the reader but should accompany the real explanation,
not replace it.

**Hedging that obscures the actual finding.** "This may potentially
suggest that in some cases..." — no. If something worked, say it worked
and state the conditions. If it's uncertain, state what's uncertain and
why.

**The passive voice of false modesty.** "It was found that..." — who
found it? We did. Say so.

---

## Audience Assumptions

Readers are assumed to be:
- Comfortable with systems programming (C, Rust, or equivalent)
- Familiar with networking concepts at the packet level
- Able to read code without line-by-line hand-holding
- Interested in the implementation details, not just the outcome

They are not assumed to know:
- Hyperdimensional computing / VSA specifically
- The Holon codebase internals
- The specific experiments and their context

When introducing a Holon-specific concept for the first time in a post,
explain it. But explain it at the level of the actual mechanism, not a
hand-waving summary.

---

## Series-Specific Notes

### Series 1 (Problem Space)
These posts establish the conceptual foundation. They need to be precise
about the mathematics — binding, bundling, similarity — because everything
downstream depends on the reader understanding these correctly.

### Series 2 (Python experiments)
The challenge batches are the story here. For each challenge: what the
problem was, what we tried, what the data showed, what we changed.
The Python codebase and the docs/ directory have 83 files of notes —
use them. Don't summarize the challenges; recount them.

### Series 3 (Rust port)
The benchmarks and the implementation decisions are the core. Explain
why specific choices were made (e.g., why `ndarray` over `Vec<f32>`
for certain operations, what the SIMD intrinsics are actually doing).
The performance numbers are well-documented — include all of them.

### Series 4 (Baseline lab)
The agent architecture is the interesting part. How do LangChain/LangGraph
agents produce traffic that looks like real user behavior? What does
the generated HTTP corpus actually look like? Be specific about the
setup — 4090, model being run, agent prompts and behavior patterns.

### Series 5 (DDoS problem)
The framing series. These posts should be opinionated. We have a
specific view on why existing scrubbers are brittle — state it clearly
and back it up with the mechanics of why rule-based systems drift.

### Series 6 (XDP + eBPF scrubber)
The most technically dense series. Do not simplify. Explain the eBPF
verifier constraints we worked within, the exact structure of the XDP
program, how the compiled tree communicates with the sidecar, why the
RETE approach maps onto packet classification, and what "765ms before
drift-based detection" means at the packet level. Pull directly from
`filter/src/lib.rs` — it's 2065 lines and it has the answers.

### Series 7 (Current state and roadmap)
Honest assessment. What works, what's rough, what's next. The L7
scrubber and WAF are on the roadmap — state what we know about what
that will require and where the baseline lab traffic corpus fits in.
