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
- **Street smart, not book smart.** The author came to VSA/HDC through
  a Clojure conference video and years of Grok conversations, not through
  reading Kanerva or Gayler. The formal vocabulary (role-filler binding,
  MAP variant, prototype learning) was discovered after the fact — the
  experiments came first. When writing, this means: explain mechanisms
  from first principles before introducing the academic term for them,
  not the other way around. The work stands on its own results. The
  nomenclature is annotation, not foundation.

---

## Technical Depth

### Show the math when it matters

If a concept has a mathematical basis, state it. Don't hide behind
analogies when the actual formulation is clearer. Hypervector binding
is element-wise multiplication over bipolar vectors. Bundling is
majority vote or superposition. Say so. Then explain what that means
operationally.

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

### Synthetic data caveat

Nearly all challenge batch experiments use synthetic data. When presenting
accuracy numbers (F1, precision, recall, classification accuracy), state
explicitly that the data is synthetic and note what that means for the result:

- Synthetic data with clean class separation flatters accuracy scores.
  100% on a well-separated synthetic benchmark does not mean 100% on
  real production data.
- We never benchmarked against standard alternatives (Elasticsearch,
  TF-IDF, scikit-learn classifiers) for most challenges.
- The numbers prove the encoding works as designed. They don't prove
  it's better than alternatives for the same task.

This caveat applies to every challenge batch post. Include it whenever
presenting classification or detection accuracy. Detection numbers on
network data (batches 010–012) are more meaningful because the attack
patterns are structurally realistic even if synthetically generated —
but still note it.

### Explain the why, not just the what

"We used element-wise multiplication for binding" is the what. The why is: multiplying two bipolar `{-1, 0, 1}` vectors element-wise is its own inverse — applying the same key vector twice returns the original — and it distributes the bound structure in ways that maintain statistical independence across dimensions. That's what belongs in the post.

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

### Use Mermaid for architecture diagrams

Starlight supports Mermaid fenced code blocks (` ```mermaid `). Use them
for any diagram showing data flow, component relationships, or
multi-step processes. ASCII box-and-arrow diagrams render poorly across
screen sizes and don't get syntax highlighting. Keep Mermaid diagrams
simple — labels should be short, connections should be legible without
zooming.

Code snippets, commit message quotes, s-expression rules, and short
inline sequences (`A → B → C`) don't need Mermaid — keep those as
plain fenced code blocks.

### Wiring a new post in

When you add a story post, wire it into the nav in `astro.config.mjs` (the
`check-nav` build guard fails the build if you forget) and give it a
`## Likely Contributions to the Field` close (the `check-contributions`
guard enforces it). That is the whole checklist — the nav *is* the post
listing, and the guards keep it honest. There is no hand-maintained index
or progress tracker to update: the old `index.mdx` table-of-contents and
`docs/PROGRESS.md` are retired (the latter in `docs/archived/`); the
deployed `src/` plus the git log are the record.

---

## Terminology

- **Rete** — not RETE. Named after the Latin word for "net" by Charles Forgy (1970s). Not an acronym.
- **Kanerva** — Pentti Kanerva, originator of hyperdimensional computing / Sparse Distributed Memory (1988)
- **McCarthy** — John McCarthy, inventor of LISP (1958). The symbolic AI lineage this work draws from.
- The framing: this work deliberately embraces "ancient" and "fringe" AI — Rete, VSA/HDC, symbolic structure — that the modern ML orthodoxy ignores. That's not a weakness to hedge around. It's the thesis.
- **The verb for what Holon does**: prefer **"recognition"** — it recognizes structure algebraically in high-dimensional space. Avoid "inference" (implies statistics), "reasoning" (implies symbolic AI in the classical sense), "prediction" (implies a training/serving split). When in doubt: "algebraic recognition".
- **Holon vectors are NOT opaque.** Unlike neural network embeddings, Holon vectors are algebraically transparent — if you have the codebook (basis vectors), you can probe the vector and recover what's bound into it. The XDP rule derivation proves this: concrete filtering rules are extracted from learned vectors. Never describe hypervectors as black boxes. They are structured, queryable representations.
- **Not neural.** There are no neurons, no weights, no activation functions. The term "programmatic neural memory" was considered and rejected. Prefer **"algebraic memory"** when describing engrams and the memory system.
- **Deterministic encoding = consensus without synchronization.** Holon's encoder is effectively a hash function: same input → same vector on any machine. But unlike MD5/SHA, the output has exploitable geometric properties (similarity, decomposition, probing). This means distributed systems can achieve agreement on representations without coordination. Use this framing when discussing distributed or deployment implications.
- **Never split languages in a Holon deployment.** Vectors produced by different language implementations are not compatible — the encoding structure is identical but the specific numbers differ due to different RNGs. Any system that mixes Python and Rust vectors in the same space will produce meaningless results. This is not a limitation to hedge or caveat around; it is a design constraint. All nodes in a deployment use the same language. There is no cross-language vector portability, none is planned, and none is needed. Do not imply otherwise.
- **VSA** — Vector Symbolic Architecture (or Architectures)
- **HDC** — Hyperdimensional Computing
- **holon-rs** — lowercase, hyphenated
- **holon-lab-ddos** — lowercase, hyphenated
- Similarity metric in this work: **cosine similarity** over dense vectors, not Hamming distance over binary vectors

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

> **Rewritten 2026-09-08 against the live site.** The version this replaces was a
> *plan*: it described "Series 6 (XDP + eBPF scrubber)" and "Series 7 (current
> state and roadmap)", and had no Series 8 at all. The site was not built that
> way. **A voice anchor carrying a wrong map is worse than one carrying none**,
> because a writer trusts it instead of opening the posts. If this map and
> `src/content/docs/blog/story/` disagree, the posts win — fix this file.

**The story is PAST and it ENDS.** It closes at `series-006-036` and hands off to
the Fronts. Everything below is a body that finished; nothing new is written into
one. New writing goes to a front (see the next section).

| body | posts | what it actually covers |
|---|---|---|
| **001 — Primers** | 5 | Not narrative. Technical reference: VSA, atoms, ops, memory, wat. Be precise about the mathematics — binding, bundling, similarity — because everything downstream needs the reader to have it right. |
| **002 — Python experiments** | 3 | The initial commit through the first six challenge batches. Rete emerging on day two, the 123× speedup, and the primitives forged in the Sudoku failure. The challenge batches ARE the story — recount them, do not summarize them. |
| **003 — The Rust port** | 5 | February. Python was the specification language — 239 tests, every primitive proven — so translating it was nearly single-shot. Then the labs, 1.3M pps, the rule engine, engrams. The benchmarks and the implementation decisions are the core; include the numbers. |
| **004 — The L7 lab** | 2 | Feb 23–26. Same architecture, one layer up: TLS-terminating proxy, dual SubspaceDetector, and the expression tree. |
| **005 — The spectral firewall** | 3 | Mar 1–3. A concept doc becomes working code in three days — four-layer geometric anomaly detection at 41µs, denial tokens sealed with AES-256-GCM, self-calibration, the residual profile. |
| **006 — The substrate** | **36** | The largest body by far. Opens on the trading lab (Mar 15–24: the pixel obsession, the pivot to Rust, the recognition that the signal was in the vocabulary) and becomes **wat** — the language, the grimoire, the arcs, the warding. Ends at `036`, the hinge. This is the body most backfill posts sit adjacent to, and where the gold anchors' voice comes from. |
| **007 — The signed record** | 7 | datamancy becomes a cryptographically verified static MCP: one pinned ECDSA P-256 key, every spell verified against a KMS-signed manifest before a byte reaches the model, so content-tamper can never become prompt-injection. |
| **008 — The command channel** | 3 | A career spent severing botnet C2, inverted into building one — broadcasting an ethos to members who opt in, over a chain of trust instead of compromise. Same architecture as the swarm, opposite soul. |

**Ordering warning.** The sidebar is grouped by **era**, not sorted by filename:
`series-008-*` sits in an *earlier* era group than `series-006-036`. Read
`astro.config.mjs` for reading order; never infer it from `ls`.

## Writing for a front, not a body

New work goes to `blog/fronts/<front>/NNN-slug`. A front differs from a body in
three ways that change how you write:

- **A front is perpetual present; a body is past and closed.** Never write a front
  post toward a finish line, and never give a front a completion verb.
- **A front is a PURPOSE, not a branch.** One front can span several git branches
  and several repos. Do not let a post become "what happened on branch X".
- **Posts are ordered by the EVENT that triggered them** — a closure, a reversal,
  a campaign, an incident, an opening — not by the calendar. A week may hold
  several posts, or none.

**Backfill posts carry `backfill: true` and say so on the page**, in a note naming
what they were written from and when. The note is not an apology, and it is not
neutral: the post that scored 9 ended its note on **what the reader is about to
get**, and the two that scored 7 ended theirs on a limitation and on an inventory.
Give it a hook.

The full doctrine is `docs/STORY-BRANCHING.md`.
