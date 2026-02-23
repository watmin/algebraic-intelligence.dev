---
title: "The NP Wall"
description: We spent days trying to make VSA solve NP-hard constraint satisfaction problems. It can't. What we built in the attempt was worth more than the goal.
date: 2026-02-22
---

Coming off batch 001–003, the structural encoding had worked on everything we'd thrown at it. Tasks, recipes, graph topology, text — same machinery, all working. That success did something to the framing: it made the tool feel like it might generalize further than it had any right to.

So the question became: how far can we actually push this? Not from a position of knowing the literature on what VSA can and can't do — from a completely naive state of mind, genuinely asking: *can I attack NP-hard problems with this? Can I get "close enough" geometrically to make smart guesses at hard problems without having to brute force a solution?* If approximate similarity search is powerful enough to find structural patterns across arbitrary data shapes, maybe it's powerful enough to find its way through combinatorial constraint spaces too. Maybe the solution to a Sudoku puzzle "looks like" something that can be reached geometrically.

Batch 004 was Sudoku. The hypothesis: Sudoku is a constraint satisfaction problem, VSA encodes structure, constraint satisfaction is structural reasoning, therefore VSA similarity should be able to guide or replace backtracking search. The solution should "fall out" of the geometry.

It didn't.

---

## What We Actually Built

The goal was this:

```python
puzzle_vector = encode(puzzle)
solution_vector = hyperspace_query(puzzle_vector)
solution = decode(solution_vector)  # ← direct geometric answer
```

What we shipped was this:

```python
puzzle = parse(input)
while not solved:
    cell = find_most_constrained_cell(puzzle)   # MRV heuristic — standard CS
    for digit in hyperspace_ordered_digits(cell):  # VSA here
        if try_placement(puzzle, cell, digit):      # traditional verification
            if solve_recursive(puzzle):
                return True
            backtrack()                             # traditional backtracking
```

VSA affected exactly one step: the ordering of digit guesses. The actual constraint satisfaction — verification, propagation, backtracking — was entirely traditional. We called it "hyperspace-guided backtracking" in the docs. That's accurate. It's also a description of backtracking with a fancy heuristic, not geometric constraint solving.

Performance numbers from the docs:

| Approach | Hard puzzle | Notes |
|----------|-------------|-------|
| Standard backtracking | 0.0248s | Baseline |
| Simple geometric (random vectors + similarity) | 0.0253s | Essentially identical |
| Optimized geometric (constraint vectors + full VSA) | 0.3443s | **14x slower** |

At scale, 90 puzzles across four difficulty levels: 82.2% success with hybrid approach, 65.6% with pure geometric, 100% with traditional backtracking.

The geometry didn't help. It hurt.

---

## Why It Can't Work

The fundamental problem isn't implementation — it's the nature of the constraint. Sudoku requires that every row, column, and 3×3 block contains each digit exactly once. That's an exact combinatorial constraint. There is no approximate version of it. A row with two 5s is invalid regardless of how close the vector is to a valid row vector.

Everything VSA had done well for us — structural similarity, fuzzy pattern matching, anomaly detection, classification — worked because "approximately correct" was a meaningful category in those domains. Sudoku doesn't have an approximately correct. The near-answers are huge in number, mostly wrong, and the similarity engine can't tell them apart from the real answer.

The LEARNINGS.md we wrote at the time put it directly:

> VSA/HDC provides **soft, approximate reasoning** — useful for ranking possibilities, not for definitive answers.

That's the line. We'd crossed it.

One thing did work cleanly: effective dimensionality as a validity measure. A valid row bundles 9 near-orthogonal digit vectors — it spans close to 9 independent directions. An invalid row with duplicates spans fewer. Measured scores: valid = 0.9999, invalid = 0.73, very invalid = 0.07. The geometric structure perfectly discriminates valid from invalid configurations. But knowing a configuration is invalid isn't the same as finding one that's valid. Detection is not search.

To be clear about the encoding: the approaches were not single-vector. We used many vectors simultaneously — 81 position vectors, 9 digit vectors, 27 constraint-unit vectors, ideal constraint vectors, per-cell superposition vectors. The encoding was structurally rich. The limitation was that local geometric signals couldn't enforce global constraint consistency. Satisfying a row's constraint locally doesn't guarantee the rest of the puzzle stays satisfiable. That's the NP-hard boundary: no local signal captures the global feasibility of a partial assignment.

Engrams didn't exist yet — they came out of challenge 017, weeks later. Whether a trained subspace over valid configurations would give a richer signal than a single ideal-constraint prototype, or whether the surprise profile could fingerprint which constraint groups are driving the deviation — genuinely unknown. Worth revisiting eventually.

---

## Going Deeper: 44 Approaches

Batch 004 didn't stop at the first failure. We went through 44 distinct approaches — not a handful of ideas, a full systematic exploration documented in a FINAL_ASSESSMENT.md. Hopfield-style settling. Superposition collapse. Direct decoding. Constraint propagation as vector subtraction. Hierarchical encoding. Cross-puzzle learning. Quantum-inspired methods. Online learning. The list runs to approach_44.

Some findings worth recording honestly:

**What actually worked:** Hierarchical template matching (approach 22) achieved 79% backtrack reduction — 52 backtracks vs. 249 baseline. The insight: encode digit *sets* for each constraint unit (which digits are present), not position-digit bindings. Measure similarity of the current set to the ideal complete-set vector. Simple membership detection, not positional structure. That delta in similarity is the gradient toward constraint satisfaction. It's not solving without search — it's ordering the search much better.

**What shouldn't work but does:** Greedy filling with pattern completion reached 93% accuracy on cells before needing backtracking. The geometry gets you most of the way, then fails at the end.

**What's counterintuitive:** Invalid states cluster *tighter* together (pairwise similarity 0.88) than valid states (0.61). Valid solutions are diverse — many different correct configurations spread through the space. Invalid states share violation patterns and bunch together. You can't just cluster toward "valid" because valid is dispersed. And bundle(8 digits) ≈ bundle(9 digits) — the valid and violation manifolds collapse together in bundle space. Satisfying 8 of 9 constraints looks almost identical to satisfying all 9.

**The wrong-is-more-similar paradox:** Cosine similarity from puzzle to correct solution: 0.2118. Puzzle to wrong solution: 0.2521. Wrong is geometrically closer. Local similarity doesn't capture global constraint satisfaction.

Batch 005 — graph 3-coloring, Max-SAT, Traveling Salesman, Set Cover — was never attempted. Those problems were posed while we still thought Sudoku was going to yield and we wanted more NP-hard targets lined up. By the time 44 approaches had run their course, the answer was obvious and the patience was gone. They're cousins of Sudoku. If we couldn't make a meaningful dent in one, we weren't going to do well on its cousins.

The encoding was correct, the primitives worked as designed, the similarity queries returned sensible results. The failure was the underlying question: "can geometric approximate similarity replace exact combinatorial search for NP-hard problems?" The answer is no. We moved on.

---

## What the Detour Produced

The primitives.

`prototype`, `difference`, `blend`, `amplify`, `negate` were all developed during the Sudoku work as tools to attack the constraint satisfaction problem. They didn't solve it. They proved far more useful everywhere else.

`prototype` — bundle a set of examples, threshold at 50% agreement, get the categorical essence. Used immediately in batch 002's graph topology classification (100% accuracy on 15 test graphs from 5 topological families). Used in text search for topic signatures. Used in anomaly detection for baseline construction.

`difference` — element-wise subtraction of two bipolar vectors (clamped to `{-1, 0, 1}`), producing a vector representing "what changed." Used in Raven's Progressive Matrices to extract abstract transformation rules across row/column sequences (~0.58 cosine similarity for consistent rules vs ~0.19 for cross-rule comparisons). The `difference` primitive is now a core part of the mitigation synthesis pipeline in the DDoS lab.

`blend` — weighted interpolation between vectors. In batch 002, blending star and cycle graph prototypes at alpha=0.5 returned both topological families at the top of search results — a soft OR query that similarity search doesn't normally support.

`amplify` — boost signal in a specific direction. Star graph similarity scores went from 0.48 to 0.74 (+55%) when amplified against the star prototype. Later in batch 008, `difference()` + `amplify()` took pattern detection precision from 74% to 96%.

`negate` — produce a vector geometrically opposed to the input. Used in exclusion queries ("find documents similar to X but not Y"), and in the surprise fingerprint machinery to characterize what's absent from a baseline.

The Sudoku work was the wrong problem. The primitives it produced were exactly right for the problems that followed.

---

## The Cost of Exploration

Worth being direct about the token cost. Days spent on batch 004 — 44 approaches, many sessions, many iterations. LLM tokens are not free, and this was an expensive way to learn something that, in retrospect, should have been predictable: approximate similarity search cannot do exact combinatorial search. Batch 005 never got started. Everything that was tried is committed; there are no missing results.

The primitives were worth it. The NP-hard detour proper — probably not. This is the kind of judgment call that gets easier with experience. When you have a powerful new tool, the temptation is to test it against hard problems. Sometimes the hard problem is hard for reasons the tool doesn't address, and recognizing that earlier saves real resources.

We moved on. The batch 006 work came next: LLM memory augmentation and the multi-domain challenges that proved the same encoding worked across wildly different data shapes. The primitives forged in the NP wall followed us into everything that came after.

---

Next: batches 006–012 — what VSA is actually good at, 5 million records, the accumulator breakthrough, and the throughput numbers that made the Rust port inevitable.
