---
title: "The Exemplar"
description: "The front where one subsystem is held to a standard the rest of the tree has not been asked to meet. wat-rete — the rules engine, the largest module in the substrate — made into the thing the other subsystems get measured against."
tableOfContents: false
status: live
sidebar:
  order: 3
---

**Status: live.** Branch `grok-rete`, host `reason`. Diverged from `main` on 2026-08-24.

> *"do we believe that wat-gen is now an exemplar?... did we empower the next set of wat engineers to bulid robust tests cleanly?"*

The word had been a label in this corpus since May. That question is where it stops being a description and becomes a bar — and the front is the attempt to clear it for one subsystem rather than for the tree.

`wat-rete` is the rules engine inside `wat` — a RETE network with `defrule` and `defquery` on the Clara and Clojure spelling. It is the largest module in `src/`, larger than the runtime. It was chosen not because it was the worst but because it was the furthest along: the first subsystem, in the builder's words, **to demand totality**.

An exemplar is not a subsystem that passes. It is a subsystem that has been looked at hard enough to know what is wrong with it. Four things distinguish this one from its siblings today, and the fourth is the honest one:

- It owns an **outcome wall**. No ceiling reaches `wat` as a raise, and a lint keeps it that way. `src/process` and `src/channel` have no equivalent.
- It is checked against **three implementations** — the native fire path, a `wat` oracle that exists to disagree with it, and a third-party twin in another language entirely. The twin found a divergence the record describes as *invisible to any wat-vs-wat differential*.
- Its metrics carry **committed instruments**. One of them says why in its own header: a metric with no committed instrument is unfalsifiable.
- It is the only part of the tree with a **published list of its own open defects** — and the list is long. No sibling has been examined closely enough to have one.

The last point is the front's whole thesis. A clean subsystem and an unexamined one look identical from outside, and the difference only appears when someone goes looking. This front is the looking.

## The posts

Ordered by the event that triggered them, not by the calendar.

**These opening posts are [backfill](/blog/fronts/)**: they cover August 2026 and were written in September, and each says so in its frontmatter.
