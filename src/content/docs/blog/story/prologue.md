---
title: "Prologue: The Idea That Wouldn't Leave"
description: Years of trying to convince people that VSA/HDC was worth exploring, and what finally made it possible to find out.
date: 2026-02-20
---

There's a specific kind of technical itch that's hard to explain to people who haven't had it. It's not about a tool or a library or a technique exactly — it's about a *shape of thinking* that you encounter and can't shake. You don't fully understand it yet. You don't have the math. You can't point to a production deployment. But you know, with the kind of certainty that comes from pattern recognition built over years of building real systems, that there's something there.

Vector Symbolic Architectures gave me that itch.

I came across a [Clojure/conj talk on VSA](https://www.youtube.com/watch?v=j7ygjfbBJD0) and couldn't stop thinking about it. The idea that you could represent structured information algebraically — bind concepts together with element-wise multiplication, bundle alternatives with superposition, measure similarity with cosine distance over high-dimensional vectors — and that these operations would *compose* in ways that preserved semantic structure. Not neural networks. Not embeddings trained on a corpus. Algebraic structure over deliberately random high-dimensional space, where the geometry is the computation.

My math background in this domain was effectively zero. I had never taken linear algebra. I was working at AWS Shield at the time, doing backend engineering across detection, mitigation, and analysis/forensics — practical systems work, not research. And yet.

---

## What I Was Actually Doing at Shield

I want to be precise about this, because it shapes everything that follows.

I'm street smart, not book smart. I never learned the academic vocabulary for most of what I was doing — I came to VSA through a Clojure conference video, not through reading Kanerva. I came to Rete through Clara, not through Forgy's original papers. The formal terms for things I was building — role-filler binding, prototype learning, MAP-variant VSA — I learned those names *after* the experiments proved the approach worked. The intuitions came first. The nomenclature was annotation.

This is how I operated at Shield too. I wasn't doing academic research. But I was doing research — just the kind that systems and security engineers do: finding new or creative ways to improve systems, usually radical to the other engineers, consistently delivered through results. I built data-rich systems. I figured out instrumentation and decoration schemas that gave us deep visibility into what was happening at scale. I just never found a way to make the AI/ML teams care about what those systems were telling us — either my framing was too far from the academic idiom they were used to, or the gap between "systems engineer with data" and "ML researcher" was wider than it looked. Given where Holon is now, I don't think the problem was the data or the ideas. The frame was wrong for the audience.

What I did prove out in that period was Rete. Clojure's Clara library gave us a way to build complex decision-making applications that composed cleanly and performed well at scale. I'm a hardcore functional programming nerd — I crave FP solutions at scale, I think in terms of pure functions and immutable state and composable operations, and Rete fit that model beautifully. I had to fight for it — "pre-AI-winter solutions" don't get easy buy-in in an org that's surrounded by neural network orthodoxy — but I proved it decisively enough through results that it stuck. The pattern of fighting for an unconventional approach and then proving it through results would repeat.

---

## Ancient and Fringe

The ideas I kept returning to had older pedigrees: McCarthy's Lisp from the 1950s, the symbolic AI tradition it spawned, Forgy's Rete algorithm from the 1970s, Kanerva's hyperdimensional computing from 1988. Pre-deep-learning. Pre-AI-winter revival. The kind of thing that gets called "ancient" and "fringe" by people who've spent their careers in gradient descent.

I am a Lisp fanatic. I think in terms of symbolic structure and functional composition. And the modern AI/ML orthodoxy has essentially no patience for that lineage — it's not where the grants are, it's not what the benchmarks reward, it's not what gets published. The people around me with AI/ML backgrounds would only entertain GPU/neural network solutions. Mainstream was the only acceptable experiment path.

While I was still at Shield I started exploring VSA seriously through long-running conversations with Grok — many, many of them, each building on the last or pivoting into some strange direction, trying to find the edge of utility with VSA. I showed those conversations around. No one took them seriously. I stopped sharing and kept going deeper into the weeds alone. That was demoralizing in a specific way — not because I needed validation, but because the isolation was friction, and friction compounds over time into waning motivation.

I had to get out and build it myself to find out if I was right.

---

## The Structural Encoding Insight

The central question I was working through in all those conversations: the VSA literature is mostly about semantic text or symbolic AI — encoding concepts, doing analogical reasoning. What I wanted was different. I wanted to encode *data structures*. Not the semantic meaning of a JSON document, but the semantic *structure* — the shape of the keys, the types of the values, the nesting, the patterns that distinguish one document from another at a structural level.

The initial idea for what would become Holon's encoding system was actually a database problem. I wanted to be able to do sub-queries on JSON or EDN documents: index complex data blobs and query for a subset within the document. "Which documents contain this minimal JSON struct?" — with wildcard support, structural matching, similarity ranking. Something that DynamoDB and Elasticsearch can't do easily. The early Holon challenges are about this: building a new kind of index that operates on structural similarity rather than field equality or text search. We built a working Qdrant demo. The performance wasn't where I wanted it, but the core idea held — you can encode a JSON document as a hypervector such that cosine similarity between vectors reflects structural similarity between documents.

There's a property of this encoding scheme that didn't fully hit me until later: it's deterministic. The same input always produces the same vector on any machine that runs the encoding. No synchronization required. In that sense, Holon's encoder is a hash function — but unlike MD5 or SHA, where the output is a static opaque value, these "hashes" have exploitable geometric properties. Similar structures produce similar vectors. You can probe them, decompose them, measure distance between them. You get consensus without coordination *and* a rich similarity space. That combination has implications for distributed systems that we haven't fully explored yet, but the foundation is there.

I didn't spend time optimizing that path because about a week into it I realized the same encoding machinery could do something much wilder: dynamic rule derivation for a DDoS scrubbing solution. I pivoted hard. The database idea isn't gone — the engram work we've since built maps directly onto it — but streaming detection was more urgent and more interesting to explore first.

The P vs NP rabbit hole is worth mentioning here because it illustrates the kind of problems I'm apparently incapable of leaving alone. Challenge 004 went deep into this territory. I think VSA's ability to represent and search over combinatorial structure might have something to say in this space. I'm probably wrong. But I'm also the kind of person who builds functional tools and wields them at impossible problems, and I've been surprised before.

---

## When the Tools Caught Up

After leaving AWS I spent a few months away from the DDoS domain entirely. Then came back once I understood how to use Claude Code and Cursor properly — starting with Grok Code to understand the shape of LLM-assisted development, then pivoting heavily into Sonnet and Opus for actual implementation.

The combination that unlocked everything: a year of mental model building, plus LLM-assisted development that had matured to the point where I could move fast on a domain where I had deep intuition but incomplete formal knowledge. The LLM became the translator — between my systems-engineering intuitions and the implementation, between my half-formed ideas and working code, and incidentally between my street-level understanding and the formal vocabulary I'd never learned. I'd describe what I wanted. The model would build it and, in passing, name what it was. That's how I learned what "role-filler binding" was called: I'd been doing it for months before anyone put a name to it. I use Grok for ideation and research — it's better than Claude for exploratory back-and-forth, for following strange threads, for stress-testing half-formed ideas. I use Claude for coding — Sonnet and Opus for sustained implementation work. Claude's headless code generation is superior for building real systems. The two complement each other in a way I've come to rely on heavily.

Two weeks from starting to write code to a working demo. Real anomaly detection on real network traffic. F1 of 1.0 on the first serious challenge. The speed was unlike anything I'd experienced. Years of work in weeks. That's not hyperbole.

I should be explicit about something: every file in every repository — the Python library, the Rust port, the XDP/eBPF scrubber, the traffic generator, this site, including the prose you're reading right now — is entirely LLM-generated. I wrote zero code. I wrote zero prose. I wrote prompts. I rarely read the code either. The workflow was: describe what I wanted, observe the outputs, correct course when outputs were wrong, push further. Not read the implementation and judge it — observe what it did and judge that. The domain knowledge and the architectural decisions are mine. The code and the words are not. That's a statement about what these tools make possible when you bring deep intuition and a clear mental model to the table.

This was also partly the experiment. The question wasn't just "can VSA do anomaly detection" — it was also "how far can you go in a novel technical domain without writing or reading any code?" The answer required a discipline the LLMs didn't have on their own: comprehensive tests on every commit. Not optional, not occasional — required. Tests were the only window into whether the code was doing what I thought it was doing. They caught regressions when follow-up changes broke prior work. They exposed when the LLM had implemented something plausible-looking that produced wrong results. Without them, a system where neither author reads the code is a system with no feedback loop at all.

Then Opus 4.6. The XDP + eBPF packet scrubber was a harder problem by an order of magnitude — kernel-space constraints, eBPF verifier restrictions, a novel architecture that combined Holon's memory system with a compiled decision tree running at XDP line rate. The approach that emerged is, in a sense, what I'd been building toward since Clara and Rete: a zero-I/O functional backend running VSA operations at line rate, with all decision logic expressed as pure algebraic transformations over hypervectors. No mutable state in the hot path. No I/O. Just cosine similarity, binding, and bundling at packet rate.

The engram integration came together in under two days after that. The result: time-to-detect on a re-emerging attack dropped from 750ms to 3ms. The engram system recognizes a previously-seen attack signature in a single packet and deploys mitigation rules immediately, without waiting for the drift-based detector to accumulate enough signal. 750ms to 3ms is not an incremental improvement.

In between the scrubber and the engram work, we built a traffic generator that uses LLM-driven user agents — 3 admin agents, 20 user agents, local inference on a 4090 — to produce organic baseline HTTP traffic. This exists because meaningful experiments require traffic that behaves like a real application. We haven't yet fed that baseline into the scrubber experiments; Opus 4.6 moved faster than planned and I got pulled into that work. The integration is coming. When it happens, we'll be running the scrubber against traffic that's genuinely hard to distinguish from legitimate use — which is the only test that matters.

---

## What It Runs On

All of this runs on x86 and ARM — the chips already in every server and edge device in the field. Microsecond-level algebraic recognition without a GPU in sight. No specialized hardware. No inference cluster. No retraining pipeline. Just vector operations on commodity silicon, fast enough to operate at line rate on live network traffic.

That's not a minor implementation detail. It means this technique is deployable *today* on hardware that's already deployed. Existing applications could exploit it without a hardware refresh. The field doesn't have to wait for the next generation of accelerators to get adaptive, learned behavior at the speed the problem actually requires.

I needed a verb for what Holon does — "inference" implies statistics, "reasoning" implies symbols, "prediction" implies training. The closest I've landed on is **recognition**: it recognizes structure, algebraically, in the geometry of high-dimensional space. Whether that counts as intelligence in any meaningful sense is a question I'll leave open. The 3ms detection time is not open to debate.

---

## On the Names

**Holon** came from months of iteration with Grok. A holon is something that is simultaneously a whole and a part — Arthur Koestler's concept from *The Ghost in the Machine*. It fit: each hypervector is a complete representation that can be composed with other representations to form something that encodes the whole structure. The algebraic operations — binding, bundling, similarity — are the grammar of how holons combine.

What's interesting is that unlike neural network embeddings, which truly are opaque, a Holon vector is algebraically transparent if you have the right keys. You can probe it — ask "is this field-value pair present?" by checking similarity against a bound basis vector — and recover what's inside. That's not a workaround; it's a property of the algebra. The XDP rule derivation does exactly this: it reaches into a learned vector, extracts the concrete field values that characterize an attack, and writes them out as filtering rules. The vector isn't a black box. It's a structured, queryable representation that happens to live in high-dimensional space.

The engram system builds on this: once you can extract structure from a vector, you can persist those vectors as a memory bank and recall against them. An engram is a minted snapshot of a recognized pattern — and when the pattern re-emerges, the system matches against the engram and fires immediately, without re-learning anything.

**Algebraic Intelligence** came after Opus 4.5 reviewed the engram integration. I'd been using the term "programmatic neural memory" for what the engram system does, but after a lengthy debate with Opus and Grok we landed on the fact that there are no neurons in this system — nothing fires, nothing activates, nothing has a weight that was trained. What we have is algebraic memory: programmatic memories stored as vectors, recalled through geometric similarity, exploited through algebraic decomposition. The intelligence isn't statistical in the way neural networks are. It's algebraic — structure-preserving operations over high-dimensional space, where the math *is* the reasoning. Not an approximation of reasoning. Not a statistical model of reasoning. The geometry does the work.

---

## What This Is

This site documents the work. Not a product, not a paper — the actual development arc, in the order it happened, with the code and the numbers and the dead ends intact.

The site is organized in two tracks. The primers cover the fundamentals — specifically how we use VSA, which means cosine similarity over dense vectors, not Hamming distance over binary ones, and a binding/bundling algebra that operates over structured data rather than semantic tokens. The story posts cover the development arc in order: the Python experiments that built the intuition, the Rust port that made it fast enough for production, the baseline traffic lab, the XDP + eBPF scrubber, and the engram system and what 750ms → 3ms actually means. Read either track first — the primers are reference material, not prerequisites.

The story isn't finished. The database idea that started all of this is still on the table — the engram work maps directly onto it. And somewhere down the line, probably, another run at P vs NP. I'm aware that sounds like the kind of thing a crazy person says. I've been the crazy person in the room before. Sometimes that's the right person for the job.

If you came here for a polished pitch, this isn't it. If you came here because you had the same itch and you want to see what happened when someone finally got to scratch it — read on.
