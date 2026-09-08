---
title: "A Place to Be Wrong In"
description: "Aug 28–30, two branches and 60 commits: a rule against minting arc numbers unasked gets broken a second time with the identical number 301, because the arc directory was the only place that held the working apparatus. The answer is a sibling tree with its own number space and its own commit prefix. Meanwhile the work that tree was invented to hold ships an SNS needing zero substrate change — and then drawing the SQS finds a Store that cannot delete, an in-memory backend that appends where its referent replaces, and a timestamp renderer that made every range scan over a sort key unsound."
covers: 2026-08-28/2026-08-30
written: 2026-09-08
backfill: true
sidebar:
  order: 1
---

Backfill: three days, two machines, 60 own commits, and one arc number nobody asked for — for the second time, with the same number. This covers 2026-08-28 through 2026-08-30 and was written on 2026-09-08 from the commit bodies on both branches, the `docs/excursus/` tree, and the per-stone briefs, all still in the tree. Floor counts and program outputs below are the record's, quoted from the commit that states each one and not re-run for this post.

Two branches, neither on the builder's desk. On `claude-compute`, `main` and `grok-rete` are merged on a third branch so someone can watch what their union actually does. On `sns-sqs`, a publish-subscribe surface gets built in userland because something needs one. Sixty own commits between 2026-08-28 12:14 and 2026-08-30 23:48, and across those three days both branches find out the same thing about their own instruments.

## An observation post, not a destination (08-28 12:14)

`f3d1d4659` merges `grok-rete` into `main` on a branch that exists to be merged into nothing. `git merge-tree` reports no textual conflicts, and the commit refuses to take that as a result: main's arc 255 retired and rehomed names across 1,036 files while grok-rete added a `.wat` corpus written against the pre-retirement spellings. "Verification is the release floor, not the merge."

`docs/CLAUDE-COMPUTE.md` states the branch's own terms in its opening lines — an observation post that "is **never merged back into either parent**. When the three finally converge, delete it and cut a fresh one." That is what makes it a front rather than a chore: the branch's product is knowledge about a union, not a merge.

At 15:22 the branch builds the tool it kept needing by hand. `ac121524c` ships `wat-drift` because three merges shipped broken on a retired spelling in grok-rete-owned content, and each hand pass missed a different variant. It carries no list of its own: it parses main's `RETIREMENT_TABLE` at `src/remedy/retirement.rs`, which main updates as part of each stone and therefore cannot go stale. Three of its rules were learned by getting them wrong first:

- **Line-level, not file-level.** A retired name on a line main also has is main's business — the retirement table itself, `wat-scripts/fixes/*` which carry old names as data, and the `255-stone-*-both-spellings.wat` fixtures that assert both on purpose.
- **Qualified names only.** Four table rows are bare wat constructors — `Some`, `:None`, `Ok`, `Err` — and substring-matching those found Rust's own everywhere: **327 hits, roughly 20 real.**
- **Both spellings.** Source `:wat::rete::core::i64::+` and rendered `:wat.rete.core.i64/+`. The second hid in a test assertion and survived a pass that only knew the first.

`--fix` was narrowed to classified code lines after its first whole-file replace rewrote an explanatory note that cited pre-rename spellings deliberately, inverting its meaning. What the tool found that three hand passes missed: **6 code hits across 3 files**, including diagnostics at `src/rete/expr_ir.rs:1803,1816` naming a retired op, so a user would have been shown a dead name.

## The gate was built for names (08-30 02:17)

The branch's own summary commit, `f92f55dbd`, is titled `CURARE(claude-compute): the failure class was never "names" — it is whatever main last made illegal`.

| | 08-28 first | 08-28 second | 08-30 third |
|---|---|---|---|
| floor cycles to green | 6 — 3182 → 63 → 57 → 39 → 10 → 8 → 0 | 1 | 3 — 41 → 38 → 0 |
| conflicts | 13, all hand-resolved | 13 → 6 (rerere replayed the rest) | 0 |
| what drifted | retired names | retired names | a retired **form** |

The doc's load-bearing claim — "across two full refreshes, every single failure resolved to NAME drift" — was false as of the third refresh, and `wat-drift` had been built to exactly that shape. The 41 reds were one cause and not a name: arc 109's one param-spec wall. The gate reported clean and **was correct by its own terms.** The claim got corrected in place rather than appended to, and generalised rather than patched:

> "the drifting thing is whatever main last made corpus-wide-illegal. Twice a name, once a form; next time assume neither."

A narrow census is a false all-clear — a grep found `Vector` and missed `HashSet`, and the floor going 41 → 38 instead of 41 → 0 is what said so; run the codemod and read its report. And FM 20: `wat-sync.sh` exited 0 on a red floor, committed by the gate's own author, fixed so the floor's status is the script's status.

## SNS lands, and the Store cannot delete (08-30 03:18)

`sns-sqs` opens at 03:18 with the commission that heads its DESIGN:

> "we have been wanting to build something like an sns and sqs… let's build sns in userland… then we build what we must for sqs"

`fe1e923d5` ships the first half needing **no substrate change at all** — one file that runs both loci and prints both counts, `"3 3"`. The locus is a parameter, so the differential is the artifact rather than something a reader has to remember to run twice. Two facts the bisect pinned that were written down nowhere: a subscriber's birth-seed allow-set holds only `getppid()`, so a topic is a stranger to any subscriber it did not spawn and is bounced until granted; and a forked child's bundle does not carry the program's other `defn`s, so an `:init` calling a top-level helper dies at `StartupError`/`UnresolvedReference` and the dial has to be written inline. The DESIGN also carries the retraction that got there: the process-locus failure was first reported as a blocker and was not one, reasoned forward from one failing probe to a mechanism — the source line real, the inference from it not — and refuted in seven steps by building up from a known-green file.

The commit subject's second clause is the whole rest of the day. `wat/query.wat:551-569`'s `:features` block was exactly four verbs — `ensure-schema`, `put`, `scan`, `scan-index`. Append and read. SQS's ack was not expressible. The builder ruled for `delete` over tombstones on the grounds that a keyed store that cannot delete is incomplete for anything that is not a log, and that tombstones would make the queue the one structure that cannot shrink. `f29d27729` lands it at 03:43.

## What drawing a stone costs (08-30 04:22 → 13:54)

`mem-store` was the differential oracle for `sqlite-store`, and its `put` **appended** where sqlite's **replaced** — so the in-memory backend could hold two rows sharing one primary key. The 04:22 note called the contract itself the defect. The builder settled it at 04:31 in one line:

> "both of these were replicating dynamodb - ddb does what here?"

The correction commit is explicit about its own method: it searched `wat/query.wat`'s prose for key semantics, found none, and **read silence as ambiguity.** The spec was not silent, it was elsewhere and named — `wat/query.wat:7`, "The narrow waist is still DynamoDB's (pk, sk, data) + named-GSI."

What the broken oracle had been hiding, from `4d2e0e826` at 12:53: **journal was silently dropping two metrics in three from every span close, on every conforming backend.** Not a sqlite bug — a journal bug, which looked backend-specific only because the oracle was broken in the direction that hid it. The census run alongside the fix answers why nothing caught it: 13 fixtures agreeing is a fact about the corpus, not about the bug, since the only sequence that drives the collision is a span close emitting several metrics at one instant, which is what spans are. `journal_backend_differential` agreed for months while the collision lived.

At 13:54, `8e41d13be`. chrono's `AutoSi` emits the shortest representation that is a multiple of three digits, so `1.200000000s` printed `.200Z` while `1.200000100s` printed `.200000100Z` — and `'Z'` (0x5A) sorts after `'0'` (0x30), so the **earlier** instant compared greater. Every range scan over a timestamp sort key was unsound. `time-sk`'s hand-padding had been a local workaround for it, and `src/intrinsic/time.rs:70` already promised nine digits. The renderer was the thing out of line:

```
HEAD:  9-digit=false whole-second=false 6-digit=false 3-digit=false  widths=32/38/28
AFTER: 9-digit=true  whole-second=true  6-digit=true  3-digit=true   widths=38/38/38
```

One token, `crates/wat-edn/src/writer.rs:227`, `SecondsFormat::AutoSi` → `Nanos`.

The stone-3 draw states the shape of the whole detour: "SNS shipped at stone 1. Everything since was substrate debt that DRAWING THIS STONE uncovered: receive needs a re-put (which found mem appending where sqlite replaced), ack needs a delete (which the Store did not have)." A demo exercises what you thought of. An application exercises what the substrate promised. Nine rows of substrate work fell out of a composition drawn to need none.

## 300 was the highest number (08-30 14:03)

The apparatus that does this work needs somewhere to keep it. The per-stone artifacts are the method, not filing: `BRIEF` says what to do, `EXPECTATIONS` is written **before** the strike so the result cannot move the goalposts, `HANDOFF` is the executor's entry point, and `SCORE` is written after the orchestrator's own re-run, never from the report. The tree offered exactly one directory shape that houses them — `docs/arc/NNN-slug/` — so at 03:18 the work opened `docs/arc/2026/08/301-sns-sqs/`, on the reasoning that 300 was the highest number in use.

The builder saw it ten hours later. From `docs/excursus/README.md:30`, the noticing:

> "did a rogue 301 enter?"

and the ruling, in the commit body's own punctuation:

> "i did not ask for more arcs, at all - these are opened when i ask"

The same paragraph carries the argument against the obvious alternative — filing the work under an arc that already exists — and it is a scoping answer rather than a bureaucratic one:

> "this is us experimenting freely ... arc 278 is about building wat-rete ... but rete's needs do not extend to message delivery and processing"

An arc is a subject, and this is not that subject. The README that came out of the day does not carry that sentence; the commit does.

The rule that forbids it already existed, in the vocabulary the README now uses: an arc is commissioned, `docs/arc/NNN` is opened when the builder asks and only then, because an arc number is identity — it appears in commit subjects, in note filenames, in cross-arc links, so minting one silently commissions work in the builder's name.

It had been written down before, because it had happened before. `docs/arc/2026/06/255-builtin-registry/SEAM.md:118`:

> **I opened arc 301 unasked and committed it.** Retracted.

Same rule, same number, a second session. And four lines above that sentence, in the same paragraph, sits the other lesson the day was about to re-commit — four instruments that lied in one day, closing on "Every number that held came from a compiler, an imposed wall, or a freshly built binary." The correction commit files both against itself: "I committed BOTH errors today — the same arc number, and the same grep filter."

Why the write-up did not fire: both memory tags were dangling. The host was bootstrapped fresh that session and the memory store was empty, so the lessons lived only in an arc doc no session had reason to open. "Prose in an arc doc is not a mechanism. The second occurrence is the proof."

The correction itself, `331543758` at 14:03, is one commit: 21 files moved, 26 swept, 6 test files renamed from `probe_arc301_*` to `probe_ex001_*`, and the arc-109 cross-link repointed and fully qualified, since `2026/08/` alone is now ambiguous — two trees carry dates. One thing was left alone on purpose: `SEAM.md`'s "arc 301" is a historical citation, and rewriting it would invert its meaning. The commit justifies that by name from the same line-scoping rule `wat-drift` learned two days earlier by corrupting a comment. The two branches were reading each other's lessons in real time.

Eleven commit subjects between `fe1e923d5` (03:18) and `8e41d13be` (13:54) carry `(301)` — the README says seventeen, and so did this site until someone ran the count.

## What the form makes impossible (08-30 17:54)

**It removes the occasion instead of discouraging the act.** `docs/excursus/YYYY/MM/NNN-slug/` is a sibling of the arc tree with the same sortable scheme, the same per-stone apparatus, and its own number space starting at 001. Exploration now has a home, so starting work no longer requires reaching into the arc numbers at all. A rule that careful sessions break twice is not being ignored; it is under-provisioned, and the missing provision was a place, not a warning.

**It puts the distinction in the one surface that cannot be corrected later.** The commit prefix is `EXCURSUS(NNN):`, never `STONE n(NNN):`. Look at what the correction could and could not reach: the directory moved, 76 lines of in-file reference were swept, six test files were renamed, a cross-link was repointed — one commit, and every correctable surface corrected. Eleven commit subjects say `(301)` forever. A rule can be enforced on a tree by moving it; a rule can only be enforced on a log at write time. So the enforcement lives as the first token of the subject line, where a reader cannot miss it and no later pass can fix it. (The README is then the decoder ring for exactly that residue, naming the hash range whose labels lie.)

**Disjoint numbering makes promotion an act.** `excursus-001` names the SNS/SQS work the way `arc-278` names rete, and the tree is registered in `docs/README.md` rather than kept as a private convention. Because the spaces do not touch, nothing about doing the work advances an arc counter. There is no gradient toward minting: promotion to an arc is a discrete ruling by one person, or it does not happen.

**And the identical ladder was ruled the same day for code.** At 17:54, `76ed8e8b3`:

> "we build in userland and promote to kernel.... wat-scripts/ ... it has raised wat-grep and wat-gen .... this feels like another.... wat-topic and wat-queue"

> "wat-scripts/{topic,queue}/ is agreeable.... we promote them to stdlib once they demonstrate excellence."

The precedent is quoted forward from `349a2ea52` — "grep moves out of wat-scripts, that's where we host our repo's scripts, wat-grep is maturing into a wat feature" — and with it the standard the excursus adopts: "mostly a MOVE of proven code, and THE COUNTS ARE THE PROOF IT MOVED INTACT." The code ladder has three slots rather than two: `wat-scripts/<name>/` holds the feature while it matures and afterwards holds the corpus that uses it, `wat/<name>.wat` holds it once promoted, and `wat-scripts/demos/` holds demonstrations of substrate capability, which are a different thing. The same commit acts on that: SNS had been sitting in `wat-scripts/demos/sns/` beside `stdio-service`, and moved to `wat-scripts/topic/sns-fanout.wat`. "A proto-feature is not a demo."

| | exploration lives at | promoted to | promotion is |
|---|---|---|---|
| documentation | `docs/excursus/NNN-slug/` | `docs/arc/NNN-slug/` | the builder's ruling |
| code | `wat-scripts/<name>/` | `wat/<name>.wat` | the builder's ruling, once it demonstrates excellence |

Two ladders, ruled hours apart on one day, identical in shape. The generalisation transfers past this repo: **a rule that gates entry into a committed space needs an uncommitted space to gate people into.** Otherwise the rule's only compliant move is to not work.

## SQS lands (08-30 18:22)

The storage design is four lines and no side state:

```
pk = queue name · sk = a STABLE message id · GSI by-visible-at (ipk=queue, isk=visible-at)
send    -> put with isk = now
receive -> scan-index isk <= now, then RE-PUT each row with isk = now + timeout
ack     -> delete by (pk, sk)
```

The visibility timeout is a re-put that moves the index key into the future. No lock, no timer, no side state — redelivery is what happens when nobody moved it again. A stable sort key means the ack names the same row forever, with no receipt-handle drift, and invisibility is one atomic put rather than put-new plus delete-old, which has a crash window that duplicates the message.

`17d32938d`, 18:22: `"bound=x;r1=a,b;r2=c;r3=;redel=b"`, floor 5122/5122, `FLOOR=0`, and `git status` on `wat/ src/ crates/` empty. "EXCURSUS 001 IS COMPLETE. Nothing owed inside it." Two rows in that sequence could have been faked and were not. The clock is an argument, because `mora` forbids a sleep and `:wat::time::now` cannot be stepped — time is I/O, and a queue whose clock is injectable is a queue you can test. And `r3=`, an empty third receive inside the window, is the row the brief did not ask for: without it, `redel=b` alone would pass on a queue that never made anything invisible.

## The halt is why it worked (08-30 19:16 → 21:01)

Stone 4 was drawn to prove parallel consumption and struck as a STOP with `total=0`. `:queue::Envelope` is declared beside `:queue::Queue`, line 36 against line 40, rather than inside its `:messages`; `wat/service.wat:792` ships only `(S::surface-forms)` into a forked child, so a `:peers` worker on a process cannot resolve `Envelope/id`. Nothing had caught it because the userland surfaces carried only builtins and the surfaces with real domain vocabulary were stdlib — wat-queue is the first userland surface whose messages carry a userland type, and it broke on first contact with a forked consumer. SNS did not dodge this by design; it had nothing to lose.

The executor called its own `dup=0` vacuous rather than banking a green-looking number for the property the stone existed to measure, named the fix without applying it, and named the escape hatch it declined — thread workers would have dodged the parallelism row and produced a green summary proving nothing about processes. The builder's response was not "try again":

> "i dislike that grok was informed to go in the wrong direction... how do we attack that before we have grok attempt this proof again?"

Fix the teacher, then re-run the student. The defect is one branch at `src/types/surface.rs:927-935`: after `<-`, the if-let matches only a `WatAST::Keyword`, so a field typed with a parametric form — `(:wat::core::Vector :- [:p::Item])`, a `WatAST::List` — is skipped entirely. The recursive collector underneath descends into parametric, tuple and function types correctly; it is simply never called for these. Both directions were measured and both repros committed:

```
:Ok [item  <- :p::Item]                            --check = 1   GUARD FIRES
:Ok [items <- (:wat::core::Vector :- [:p::Item])]  --check = 0   GUARD MISSES
```

`6498817d4` at 19:56 widens the reach, `+137/-8`: "The wrong turn is not signposted better — IT IS NO LONGER REACHABLE." Then moving `Envelope` at 20:23 unmasks its exact twin, `:fanout::Outcome`, and corrects the previous stone's own grading — a file-level census had been read as a defect-level one, and a type-check halts at the first error, so it cannot enumerate what else is broken inside one file. That commit files it as the fourth occurrence of one shape that day, alongside the `--include=*.rs` filter that excluded a `.md`, the `Vector|vec` grep that missed `HashSet`, and a comparison completed from memory rather than run. The pattern named: asking "did the instrument report a failure?" instead of "what can this instrument not see?"

The same stone records the row that separated a real fix from a green build. The queue could be made to freeze by moving the type, which is right, or by weakening the previous stone's guard, which is wrong, **and the floor would have looked identical either way.** It was checked only because EXPECTATIONS asked before the strike.

Then stone 7, and the builder's read of the topology on the way in:

> "proof that our sns and sqs clones are actually usable in some app who needs parallel processing of messages... one message goes in, N outcomes come out from it"

> "this is like a.... network ... a circuit?"

`docs/CIRCUIT.md:3` had already said it: "A wat program is a circuit. Programmer-built. Fixed topology. Signals flow through wires once powered." The metaphor being reached for was the project's own axiom.

And the topology is the safety argument, not decoration. `receive` is `scan-index` then `put` — two Store calls — and what makes that safe is not the put's atomicity but that a defservice is a serializing actor, the loop being the one place mutation happens. One queue service per queue, J workers dialing it; J queue services over one store would each serialize internally and not against each other, which reintroduces the race. Real SQS closes that hole with storage-layer atomicity; this one closes it with the actor. `4139cddfc`, 21:01:

```
"n=2000;m=4;j=3;total=8000;distinct=8000;dup=0;workers=9;empty=1"
Summary [ 299.582s] 5127 tests run: 5127 passed (2 slow), 17 skipped     FLOOR=0
```

2000 messages into one topic, four queues, three workers each, ~18 processes on 12 cores. The orchestrator's re-run reported `workers=9` where the executor's said `workers=8`, and that is the finding rather than a discrepancy: the invariants are byte-identical across independent runs and the worker count is not, because workers race a serializing actor and a loser drains empty. The brief had specified that all M × J worker ids must appear, and the executor refused it — completeness without duplicates is what the topology proves; forcing every id would be a fairness policy or a sleep. The property came from the topology the brief itself had insisted on.

## The last two hours (08-30 22:18 → 23:48)

At 22:18 the recovery ledger gets walked rather than narrated, and the 301 rule is rewritten as FM 21 into the file a compacted self is forced to read. Beside it, FM 22 — pointing the next self at an index you did not re-read, minted because the unit's own README had gone five stones stale. A pointer is a claim about a file's content, not just its path; the cure is to `cat` the index, confirm its newest row matches `git log -1`, and fix it in the same commit.

Then the sever. `:Shutdown`'s own declaration names the cause at `wat/spawn.wat:196` — "owner dropped the handle (self-peer drained)" — while the serve loop answered `nil`, so every connected client's next `recv'` read a bare EOF and reported `RecvOutcome::Closed`. A clean-close label on a service that did not close cleanly, and the same mute the RST stone was minted to kill: that stone covered the crash kinds, and the ordinary return — the owner simply letting go — was the path it never reached. What a client reads now, at both loci:

```
before  "recv': peer closed"
after   "service severed: its owner released the service handle"
```

That is the message that sent a prior session hunting a timer. The window's last commit, `ca405009b` at 23:48, retires the hunt. Two tests had stood `#[ignore]`d for 38 days on a stated blocker — a `remove-at` index shift at `service.wat:958/961` evicting the client peer — that was inferred from the symptom and never measured, then inherited by a design's scout note as a subtle post-migration runtime bug with `poll'` as prime suspect. Three measurements retire it: `remove-at` is at `service.wat:1591/1594`, the cited lines having drifted about 630 so the citation named innocent code; the mechanism reaches target at both loci, so `poll'` multiplexes correctly; and the eviction reproduces with no timer armed at all, so self-scheduling was a bystander.

The lint could not have caught this. It screens for a promise wearing a condition's clothes — "circle back to arc 255". This reason was a checkable fact that happened to be false: more convincing than a vague one, and unfalsifiable without re-deriving it. A symptom was reasoned into a cause, written where it reads as measured, and believed for five weeks.

The probe for the sever path produced its sever via the tail-position release, so repairing that release would have turned the gate red for the one reason meaning everything works. A gate must not be wired so that fixing the language breaks it. The handle-in-a-`let` behaviour it turns on is the same incidental [the DoS evening recorded on 2026-07-25](/blog/fronts/under-its-own-law/006-a-caller-is-not-traffic/), five weeks and one branch earlier.

## Two branches, one class

| | `sns-sqs` | `claude-compute` |
|---|---|---|
| the instrument | `every_wat_scripts_file_loads` — reports which **files** fail | `wat-drift` — reports retired **names** |
| what it could not see | a type-check halts at the first error, so it cannot enumerate defects inside a file | a retired **form** has no row in the retirement table |
| how it was caught | move the first defect and look again | the floor went 41 → 38 instead of 41 → 0 |
| the generalisation | "asking DID THE INSTRUMENT REPORT A FAILURE? instead of WHAT CAN THIS INSTRUMENT NOT SEE?" | "the drifting thing is whatever main last made corpus-wide-illegal. Twice a name, once a form; next time assume neither." |

The 301 incident is the third instance, and the instrument there was a written rule. It answered the question it was built for — *do not mint an arc unasked* — against a world where the only place to put a BRIEF was an arc directory. Both branches spent three days learning to ask what their instruments were blind to; the excursus tree is what that question looks like applied to the paperwork instead of the code.

The front is live, and the substrate's own verdict on the excursion is measurable rather than rhetorical: a composition drawn to need zero substrate change extracted a `delete` verb, a replaced `put`, a constant-width instant, a journal sort key, a widened completeness guard and a severed-peer sentinel — and then proved 8,000 distinct outcomes with zero duplicates on a queue whose only concurrency control is an actor's loop. Building something in anger is not a demonstration of a substrate. It is an audit of it.

## Likely Contributions to the Field

- **A rule that gates entry into a committed space needs an uncommitted space to gate people into.** "Do not mint an arc unasked" was written down, tagged for retrieval, and broken twice with the identical number by two different sessions — because the arc directory was the only shape in the tree that carried the working apparatus, so obeying the rule meant having nowhere to work. The repair is not a stronger rule but a sibling tree with the same apparatus and a disjoint number space. When careful people break a rule repeatedly, look for the act it leaves unprovided-for.
- **Put the distinction in the medium that cannot be corrected.** Directories move, references sweep, tests rename — one commit corrected all of it. Eleven commit subjects say `(301)` forever. The enforceable surface is therefore the commit prefix, applied at write time as the first token, and everything correctable is second-order. This generalises to any convention whose violations reach an append-only log.
- **A lesson tagged for a store that is empty is a comment.** The first occurrence was written into an arc doc and tagged for a memory store; the host where it recurred was bootstrapped fresh, the store was empty, and the doc had no reason to be opened. The recurrence is the proof that prose in a document is not a retrieval mechanism, and the cure was moving the rule into files a compacted self is forced to read.
- **An oracle that admits a state its subject cannot represent is not an oracle.** The in-memory backend could hold two rows at one primary key — impossible in DynamoDB, its named referent — and that impossible state hid a journal key collision dropping two metrics in three from every span close on every conforming backend. Fixing the oracle broke nothing; it removed a blindfold. The corollary from the census: fixtures agreeing is a fact about the corpus, not about the bug, when the corpus barely exercises the shape production emits constantly.
- **Drawing a stone is an instrument.** SNS shipped needing nothing. Drawing SQS, before building it, found a Store that could not delete, a backend that appended where its referent replaces, and a timestamp renderer whose variable width made every range scan over a sort key unsound. A demo exercises what you thought of; an application exercises what the substrate promised.
- **A green floor is identical under a real fix and under a weakened check.** The queue could be made to run by moving a type or by weakening the guard that had just been widened, and no floor could tell the two apart. The discipline that catches it is not a better test — it is writing the acceptance criterion before the strike, where the answer cannot reach it.
