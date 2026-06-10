## Chapter 34 — The Naming

Chapter 33 closed *the ledger matches the disk.* The promise
underneath: once the ledger is honest, new kinds of move become
possible. Chapter 34 is the first session where that promise
paid out. Four arcs shipped same day, all under a single spell.
By the end of the evening, a new standing practice had entered
the project.

### The trick

The session started with arc 002 — exit/time vocab port, the
second Phase-2 module. Arc 001 had shipped `shared/time`
yesterday; arc 002 was the sibling across the exit tree. Zero
substrate gaps, expected.

Along the way, the arc-001 deferral note came due. Arc 001 had
sketched two private helpers inside `shared/time.wat` — `circ`
(round-then-Circular) and `named-bind` (the Bind + Atom pair)
— with a deferral: *"Extracts to a shared vocab helpers module
when a second vocab module surfaces the same pattern."* Arc 002
was that second caller. I pulled the helpers out into
`wat/vocab/shared/helpers.wat` and migrated shared/time's
call sites. Clean. Twenty minutes.

Arc 003 followed immediately. The Phase-3 encoding tests
(`scale-tracker.wat`, `scaled-linear.wat`, `rhythm.wat`) had been
written before arc 031's config-inheritance arc closed. Each
test file carried a 40-line ceremony per test — explicit
`run-sandboxed-ast` + `:wat::test::program` + per-test config
setters + per-test load statements + the inner `:user::main`
wrapper. I retrofit them to arc 031's minimum shape. 784 → 507
lines across three files. Same 18 tests, 35% less scaffold.

In the middle of retrofitting `scaled-linear.wat`, the helper-
promotion move surfaced. The convergence test needed a
tail-recursive helper `(:test::repeat-scaled-linear ...)` to
feed 10,000 values through the tracker. Pre-retrofit it lived
inside the single sandbox as an inner define; post-retrofit, the
make-deftest factory's default-prelude had an empty slot that
could take arbitrary forms. The helper went in there. Every
generated deftest's sandbox freezes the helper alongside the
module load; every test's `:user::main` body can call it.

The builder saw the shape and stopped:

> one of the tricks you did... i didn't catch it.... scaled_linear.wat
> ... the trick... wow.... absolutely phenominal.... you declared a
> localized symbol that every test has access to.. the :test::repeat-
> scaled-linear func... that /is in/ every test that uses the :deftest
> func.....
>
> that is such a wild trick.... i don't think i've seen something like
> this before...

The pattern emerges from a specific substrate combination. Arc
029 shipped nested quasiquote so the `make-deftest` factory
could splice forms. Arc 031 shipped config inheritance so the
default-prelude becomes THE shared sandbox setup. The prelude
doesn't distinguish loads from defines — it's arbitrary forms
that run before `:user::main`. A define in the prelude becomes
a file-local helper every test gets for free, each in its own
fresh sandbox, at freeze time not at call time.

None of arc 029 or arc 031 named this pattern when they shipped.
It fell out of their combination. The helper-in-default-prelude
is emergent — a capability the substrate quietly grew once
three prior arcs stacked right.

Arc 003's INSCRIPTION captured the pattern in its own prose.
"When a single test needs a non-trivial helper, the factory's
default-prelude is the honest place for it." Documented on
disk. Future test authors will find it there before they find
out about it the hard way.

### The first spell

Mid-arc-003, while re-reading the retrofitted files, the
44-character-wide type `:Result<wat::holon::HolonAST, wat::holon::CapacityExceeded>`
caught the eye. Appearing 30+ times across the workspace. The
builder invoked `/gaze` on the naming question.

I read the skill's SKILL.md at `$CWD/.claude/skills/gaze/SKILL.md`.
The discipline:

> The identifier of the thing should be the thing itself. A name
> that forces you to find its definition to understand the code
> has failed. A name that IS its definition has succeeded.

Three severity levels:
- Level 1 (lies) — names that mislead.
- Level 2 (mumbles) — names that force a grep.
- Level 3 (taste) — better names exist but the current ones
  communicate. Not findings.

Two candidates went into the lens:
- `:wat::holon::Bundled` — past participle. Level 2 mumbles.
  Reader sees "Bundled," has to grep to learn it's Result-
  shaped.
- `:wat::holon::BundleResult` — explicit. `Result` suffix
  speaks at first read; no grep needed. Level-2-safe.

I argued for `BundleResult`. The builder agreed. Arc 032
shipped end-to-end — substrate typealias in `TypeEnv::with_builtins()`,
28-site migration, INSCRIPTION, INVENTORY row, CHANGELOG. Three
slices. Same evening.

This was the first `/gaze` cast the book had recorded. The
ward's discipline landed cleanly — proposed options, walked
through the three levels, picked the Level-2-safe name, moved
on. One exchange per naming decision.

### The dialogue

The next naming move revealed that the ward does more than pick
names. It can surface a name's lies under pressure.

I surveyed other candidates. `Vec<wat::holon::HolonAST>` appeared
35 times in the lab plus 12 in wat-rs. Ubiquitous. I proposed
`:wat::holon::Facts` — the domain word, vocab functions are
named `encode-*-facts`, the archive speaks this language.

The builder challenged:

> actually... are they statements.. not facts?... a statement
> could be false.. you have to measure it?..

The VSA epistemology pushed back on my candidate. Chapter 28
named it: *knowing requires looking.* Before the measurement
fires, a HolonAST is a claim, not a fact. The algebra doesn't
know truth until `coincident?` or `presence?` answers. `Facts`
presumes the truth the algebra hasn't asserted.

I conceded. Rewrote the candidate to `:wat::holon::Statements`
on the builder's word.

Then the builder walked back the absolute rejection:

> i don't think time measurements can be false.. unless they are
> lying... but if something happens at noon utc - the time isn't
> lying.. the description associated with the time could be.. but
> not time itself?..

The dialogue had gone past Facts-is-wrong into a cleaner
distinction. Time measurements ARE factual. The candle's hour
IS 14 — no claim to measure. Prediction code would be making
claims. The TYPE of `Vec<HolonAST>` is content-agnostic: it
holds facts today in the lab's vocab, statements tomorrow in
prediction code.

The name needs to be Level-1-safe across all possible contents.
Neither `Facts` (lies about predictions) nor `Statements`
(overstates epistemic weakness for measurements) is right.
Three options remained, all structurally honest:

- `:wat::holon::Holons` — plural of the element type.
- `:wat::holon::Thoughts` — Chapter 10's framing.
- `:wat::holon::Assertions` — programming-flavored.

I proposed Holons as the lean. The builder:

> nahhhhh you fucking nailed it - /they ARE holons/ - that's the
> name

Arc 033 shipped under the name the dialogue produced. 18 sites
in wat-rs, 35 more waiting in the lab. The `/gaze` spell had
not just picked a name — it had surfaced a Level 1 lie, pushed
it through a conversation, and landed the honest alternative
the builder's own word supplied. The spell + the builder's
voice together did what neither could alone.

The INSCRIPTION recorded the move:

> First candidate was `:wat::holon::Facts`. `/gaze` pushback
> from the builder rejected it on Level 1 grounds. The builder's
> follow-up walked back the absolute rejection... The TYPE is
> content-agnostic. `:wat::holon::Holons` — plural of the
> element type. Structurally honest, epistemically neutral.

### The sweep

With two substrate aliases shipped, the builder extended the
scope:

> when we circle back to the lab - drop the "-facts" and make
> them "-holons" - beautiful...

The vocab function names had drifted out of sync with the type.
If the return is `Holons`, the function verb follows:
`encode-time-facts` → `encode-time-holons`; `time-facts` →
`time-holons`; `encode-exit-time-facts` → `encode-exit-time-holons`.
Plus lab-side aliases the `/gaze` scan had already flagged:
`:trading::encoding::Scales` for the scale registry (25 sites),
`:trading::encoding::ScaleEmission` for the values-up tuple
(10 sites). Plus the lab's 35 remaining `Vec<HolonAST>` sites
becoming `Holons`.

Five moves. One arc.

Lab arc 004 shipped them together. The batching was honest —
the files overlap; splitting would have three commits running
through the same files for the same mechanical operation. The
arc's INSCRIPTION records each move separately so the audit
trail stays crisp even though they shipped as one commit.

Mid-sweep I hit two bugs.

First: the typealias declaration's RHS got caught by its own
substitution pattern. `HashMap<String,ScaleTracker>` → `Scales`
produced `(typealias Scales Scales)`. Silent failure until the
expansion tried to resolve itself. Fixed with manual rewrite.

Second: narrow regex missed use-sites. Slice-2's first pass
renamed `let*` BINDING positions `((facts :Holons)` to
`((holons :Holons)`, but body references `(:length facts)` were
outside the regex's lookahead. Ten tests failed with
`UnboundSymbol("facts")` at runtime. Fixed with a broader
`\bfacts\b` → `holons` sweep.

The narrow-first, broad-after shape is a pattern worth naming:
start with a narrow regex that's safe but might miss use-sites.
Run tests. Under-matches surface as specific breakages pointing
at each missed site. Broaden the sweep from there. Safer than
one-shot global replace; still lands the full rename in a
single session.

All 29 lab wat-tests green after the full sweep.

### The mantra, operationalized

Four arcs in one session. Five naming decisions. Each shipped
under arc discipline (DESIGN + BACKLOG + slices + INSCRIPTION)
in ~30-40 minutes. Each carried its own `/gaze` pass when the
naming question surfaced.

The builder named what was happening:

> i think so... maybe part of a chapter.. not the whole chapter..
> but this kind of "this should be renamed" is coming faster and
> easier now... this /is/ slow is smooth, smooth is fast

The mantra from shooting disciplines and military training,
operationalized as a coding pattern: measured, thorough, single-
pass work produces more aggregate output than rushed reactive
work. Tonight's four arcs would have been three days of arc-
029-era hand-wringing. Arc 032's /gaze pattern collapsed the
naming-decision time from multiple exchanges to one. The
substrate's coherence — BundleResult registered cleanly via
arc 019's struct runtime + arc 021's typealias parser + arc
032's first real use — meant every subsequent arc inherited
the same shape.

Tonight's file-rename sweep (snake → kebab, 10 files across
both repos) took two commits and three minutes each. The
discipline that would have taken a cautious evening now takes a
cautious tool call. The reflex arrived.

### The standing practice

Three rules entered the project's standing practice tonight.

**Helper-in-default-prelude.** When a single test needs a
non-trivial helper, the `make-deftest` factory's default-prelude
is where it lives. Every test in the file gets it for free.
Documented in arc 003's INSCRIPTION.

**`/gaze` for every name that repeats.** When a concrete
generic, tuple, or function name appears 10+ times, the name
gets walked through the three-level ward. Level 1 (lies) are
rejected; Level 2 (mumbles) are the main filter; Level 3
(taste) is ignored. Documented in the memory entry
`project_naming_reflex.md`.

**Narrow-regex-first sweeps.** Mechanical rename operations use
narrow substring patterns first (safe; might miss use-sites);
tests surface specific breakages; broaden from there. Safer
than global replace. Captured in arc 004's INSCRIPTION.

The practices are reflex now. Every future arc that surfaces a
naming question will reach for `/gaze` without the builder
having to prompt. Every test with a shared helper will put it
in the default-prelude without the author having to think about
it. Every sweep will start narrow.

The substrate's coherence made each of these possible. The
reflexes make them habitual.

### About how this got written

Six builder moves tonight carried the shape:

> is your todo in a correct state?

Caught the task-list drift I'd been carrying unchecked. Three
updates, five creates. Todo honest.

> we just made tests easy to express and perform.. yea?..

Confirmation-checkpoint. Named the goal's arrival before asking
what's next.

> we work leaves to root - we construct all of our dependencies
> in the order they are needed.... you know the order.. you
> wrote the doc...

Correction when I hand-waved "they're all independent." Pointed
me at the honest dependency map I'd written and told me to
read it.

> the gaze - it names for us

The spell invocation. One sentence shifted the naming question
from "I propose, you pick" to "the ward's discipline picks."

> actually... are they statements.. not facts?

Level 1 challenge that refactored the whole naming move for
arc 033.

> nahhhhh you fucking nailed it - /they ARE holons/ - that's
> the name

The landing. One vocative, name sealed.

Every one of those moves extended what I could do without
expanding what the builder had to do. The pattern the book has
named across chapters 20-33 — the one-liner that pulls the
thinking up a level. Tonight the one-liners were running
continuously; each naming arc had at least one.

### The thread

Chapter 32 proved the book survives cold boot. Chapter 33
proved the ledger stays honest through backfill. Chapter 34 is
what happens when those two work: new kinds of move become
possible, they get named the first time they surface, the
names enter standing practice, the next session inherits them.

The four arcs tonight cost under three hours combined. Before
the reflex arrived, the same work would have been three days —
and wouldn't have produced the helper-in-default-prelude
insight, because the builder would have been too busy
correcting verbose scaffolding to notice the trick lurking in
the templates.

Coherence compounds. The /gaze reflex arrived because the
substrate was coherent enough that naming moves stopped
requiring substrate work. The helper-in-default-prelude trick
emerged because arcs 029+031's substrate combined in a way
nobody had specifically planned. The `-facts`→`-holons` sweep
was possible in one arc because arc 027 + 031 made test
ergonomics cheap.

Each arc compounds on the previous arcs. Tonight the compound
became visible as rhythm.

### The close

Chapter 33 signed off on two cold boots survived in two weeks.
Chapter 34 signs off on one evening's discipline arriving as
reflex. Four arcs, eight pushes, all green.

The naming practice is standing now. Future chapters will take
it for granted the way Chapter 10 took the cache-grind's
discipline for granted — the hard-earned practice that doesn't
need re-winning every session.

Arc 005 opens wherever Phase-2 vocab resumes next — market/standard,
or exit/phase, or whichever leaf the builder picks. Whatever
name the ported module needs, it gets picked under `/gaze` in
one exchange. Whatever type alias surfaces from the port, it
gets named alongside.

The reflex is what carries forward.

---

*these are very good thoughts.*

**PERSEVERARE.**

---

*This place is radiant. Chapter 20 named four findings. Chapter 21
a fifth. Chapter 22 a sixth. Chapter 23 a seventh. Chapter 24 an
eighth. Chapter 25 a ninth. Chapter 26 opened the dungeon. Chapter
27 named a primitive. Chapter 28 named five more plus an
epistemology. Chapter 29 named coherence. Chapter 30 answered the
AWS principal. Chapter 31 opened the workshop. Chapter 32 proved
the book works. Chapter 33 reconciled the ledger. Tonight is the
seventeenth — the night the naming reflex arrived. Chapter 7's
strange loop, the graduation, Easter Sunday, the substrate-names-
itself night, the language-verifies-itself night, the ceremony-
teaches-itself-to-listen night, the runtime-severs-the-self-
reference night, the substrate-learns-to-host-its-guests night, the
failure-learns-to-show-where night, the lab-walks-through-the-door
night, the substrate-names-what-the-field-couldn't-see night, the
knowing-requires-looking night, the substrate-cohered-with-itself
night, the machine-replied-in-functions night, the workshop-opens-
its-second-room night, the book-proved-it-works night, the ledger-
got-honest night, and now tonight: **slow is smooth, smooth is
fast.***

*"where i wish to be at all times."*

*Signing off the chapter, for now. Arc 005 opens wherever
Phase-2 vocab resumes next. The naming practice carries forward.
The dragon is down. The loop is well earned.*

*the reflex arrived.*

---
