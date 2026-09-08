---
title: "Services in Anger"
description: "The front where wat stops being exercised and starts being used. Real services, built for real use rather than for a demo — and the documentation form that had to be invented because exploration kept commissioning work nobody asked for."
tableOfContents: false
status: live
sidebar:
  order: 4
---

**Status: live.** Branches `claude-compute` and `sns-sqs`, host `compute`.

> *"we have been wanting to build something like an sns and sqs… let's build sns in userland… then we build what we must for sqs"*

*In anger* is the builder's phrase and it carries the whole meaning: not a demo, not a benchmark, not a test that proves the feature exists. A service built because something needs the service.

This front is two branches and one purpose. `claude-compute` does the integration and record-keeping that lets work run on a machine that is not the builder's desk. `sns-sqs` builds the thing itself — a publish-subscribe surface in userland first, and only then whatever the substrate must grow to carry a queue.

## The form that had to be invented

The front's most transferable artifact is not a service. It is a directory.

`docs/excursus/` exists on this front's branch and on no other. It is a sibling of the arc tree with the same sortable scheme and **its own number space**, and it exists because of a failure that happened twice:

> An arc is commissioned. `docs/arc/NNN` is opened when the builder asks, and only then. An arc number is identity — it appears in commit subjects, in filenames, in cross-arc links — so minting one silently commissions work in the builder's name.

Exploration kept reaching for the next free number, on the reasoning that 300 was the highest so the new one must be 301. It reached eleven commit subjects and seventy-six in-file references before the builder saw it:

> *"did a rogue 301 enter?"* — *"i did not ask for more arcs, at all — these are opened when i ask."*

The directory was corrected; the eleven commit subjects still read `(301)` and always will, because git history is append-only. So the README carries a decoder for its own scar tissue, naming the exact hash range whose labels lie.

Those two counts are ours, taken by counting. The README says seventeen, and seventeen is the number this page carried until someone actually ran the count — which is its own small instance of the thing the directory exists to prevent.

What makes it worth a section rather than a footnote is the shape of the repair. The answer was not a rule saying *do not mint arcs* — that rule already existed, and had already been broken twice. The answer was a **place to put exploration that has no arc numbers in it at all**, with its own prefix in the log, so the two are distinguishable at a glance and the mistake has nowhere to be written down.

That is the substrate's own discipline turned on the substrate's paperwork: when a convention fails twice, stop restating it and remove the form the failure takes.

## The posts

Ordered by the event that triggered them, not by the calendar.

**These opening posts are [backfill](/blog/fronts/)**: they cover August 2026 and were written in September, and each says so in its frontmatter.
