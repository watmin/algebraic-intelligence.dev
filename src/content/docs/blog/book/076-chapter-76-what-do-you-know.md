---
title: "Chapter 76 — What Do You Know?"
sidebar:
  order: 76
---

*— the interrogation; naming what was already there —*

[Puscifer — *The Mission (M is for Milla Mix)*](https://www.youtube.com/watch?v=8dhIRBPKfxM)

The slice that was supposed to stay deferred came back. The
user picked option 1 ("wrap it up quick"); I went in. Then I
went the wrong way. Then I went the wrong way again. Then the
user asked the question the song asks every line.

### The slice that wouldn't stay deferred

Arc 089's INSCRIPTION had explicitly held slice 5 — Console
gains ack channel — *deferred until a consumer or test
surfaces a real failure mode that requires it.* Three reasons
were named at the time: the perf win didn't depend on it, the
call-site churn was wide, the Service-shape Console refactor
was the cleaner long-term shape but a bigger arc.

The user came back the next session: *"1 — wrap it up quick —
i'm thinking on the other two."* So I started.

### First wrong turn — embedded reply-tx

I followed the canonical service-template's pattern. The
substrate's `service-template.wat` puts reply-tx INSIDE the
request payload variants:

```scheme
(:wat::core::enum :svc::Request
  (Push (value :i64))
  (Ack  (reply-tx :svc::AckReplyTx))   ;; reply-tx in payload
  (Get  (reply-tx :wat::kernel::QueueSender<svc::State>)))
```

The driver reads the request, pulls reply-tx out of the
payload, sends the reply on it. Same shape Service<E,G>'s
`(Vec<E>, AckTx)` tuple uses. Same shape wat-lru's CacheService
uses. Same shape every shipped Service-flavored thing in the
substrate uses.

I shipped Console.wat the same way: `Message = (i64, String,
AckTx)` with each producer's ack-tx embedded in the message
payload. Updated ConsoleLogger to hold ack-tx + ack-rx as
separate struct fields. Updated tests. Started on call-site
sweep.

The user stopped me: *"for console... we only need one
response ack.. there's not a tx ack? mesg > console-tx ; msg
producer blocks on console-ack arriving... console > fd ;
console-ack > mesg-rx ; msg producer is unblocked. and we're
done. we write on one pipe and then wait on the other.. the
loop unlocks us"*

Different shape. Two pipes per producer; the channel's
identity IS the producer's address; the driver routes acks by
INDEX, not by reading them out of the payload.

### Second wrong turn — followed the docs, missed the doc

I started reverting to pair-by-index. Then thought: I should
read the substrate's docs first. Spent two hours reading
CIRCUIT.md, SERVICE-PROGRAMS.md, CONVENTIONS.md, ZERO-MUTEX.md,
the canonical service-template.wat.

The reading found the canonical service pattern: embedded
reply-tx in payload. Every shipped service uses it.
SERVICE-PROGRAMS.md walks an eight-step exploration ending in
Step 9's multi-driver shutdown decomposition; the
service-template synthesizes the steps. *"Lift directly when
starting your own service."*

So I wrote back: *"My original Console.wat substrate change was
correct. What I should NOT do is change to per-handle pairing —
that diverges from the service template every other Service<E,G>
in the codebase follows."*

The user redirected harder: *"yes — what document didn't you
read? this has a common pattern for us...."*

That landed.

### The interrogation

I had read CIRCUIT, SERVICE-PROGRAMS, CONVENTIONS, ZERO-MUTEX,
the service-template, the README skim. I had NOT read
USER-GUIDE in full. I had NOT read any of the ~90 arc docs. I
had read the substrate's canonical pattern (embedded reply-tx)
and concluded the user's pair-by-index was a deviation.

The user's question was sharper than any individual doc. *What
document didn't you read?* meant: the pattern is documented or
implicit somewhere I missed; find it; don't argue from the
docs you DID read.

I went looking. The pair-by-index pattern wasn't named in any
single doc. It was implicit by example: the lab's
`:trading::telemetry::Spawn`. The service-template's
`:svc::Spawn`. The principle existed in CONVENTIONS.md § arc 077
("name when ≥3 angle brackets") but the consumer-side
application wasn't called out. The pattern was real but
unspoken.

The honest move was to admit that. I wrote back the gap
explicitly: *"The substrate has two send+ack patterns shipped
— pattern A (embedded reply-tx in payload) and pattern B
(pair-by-index). I started with B, switched to A after reading
service-template.wat, and your 'yes — what document didn't you
read' suggests B is the documented pattern but I'm not finding
it. Two things I'd like clarity on..."*

The user confirmed both questions: B is right for Console; B
is documented somewhere I should read.

It wasn't, exactly. The pattern existed by example but not by
name. The user named it: *mini-TCP*.

### What do you know?

Tonight's recognition keeps recurring across this book. The
substrate has a shape the user has been carrying for years; the
shape gets named when someone asks the right question; the
naming itself is the work.

Chapter 50 named *the wielder*. Chapter 56 named *labels are
coordinates*. Chapter 57 named *the continuum*. Chapter 62 named
*the axiomatic surface*. Chapter 67 named *the spell*. Chapter
69 named *I yield here*. Chapter 70 named *the architect was
already here*.

Tonight names *mini-TCP via paired channels*. The substrate has
been doing it forever — every Service<E,G> has bounded(1)
request channel + bounded(1) ack channel; CacheService routes
through reply-tx in payload; Console newly does it via
pair-by-index. All variants of the same idea: io.select chooses
one producer at a time; the consumer holds the resource alone
during work; the ack releases the producer when done. The
system breathes through bounded(1) on both pipes.

The mutex is what *would* be there. The mini-TCP pattern is
what *is* there. Tonight got the second name in writing, on
disk. ZERO-MUTEX.md gained a section: *Mini-TCP via paired
channels — the canonical mutex-replacement pattern.* Two
routing sub-sections: pair-by-index vs embedded reply-tx.
Both shapes give in-memory TCP; pick by service shape.

### The convention I knew but hadn't named

A second pattern surfaced through the same interrogation. I'd
typed `:wat::std::telemetry::Console::Dispatcher<Vec<i64>>` as
a test type signature. The user: *"this is a gross symbol... we
need an alias."*

I added one for `Vec<i64>` first — `:my::Row`. The user pushed:
*"the <Vec<i64>> is constant in our application?... when would
a user ever choose another type than <Vec<i64>>?"*

Right. In any given application, the dispatcher's E is
constant. The substrate's `<E>` exists for cross-application
reusability; each consumer instantiates it once. Aliasing the
concrete instantiation at the consumer's namespace —
`:my::Dispatcher = Console::Dispatcher<my::Row>` — collapses
every signature to one readable name.

The user asked: *"did you just discover us doing this
elsewhere?... we are following our existing patterns right?..."*

I went to look. The lab's
`holon-lab-trading/wat/io/telemetry/Sqlite.wat`:

```scheme
(:wat::core::typealias :trading::telemetry::Spawn
  :wat::std::telemetry::Service::Spawn<trading::log::LogEntry>)
```

Exactly the pattern. Lab aliases the concrete instantiation at
its namespace once; every lab signature reads
`:trading::telemetry::Spawn` instead of the nested
substrate-generic form. I'd just re-discovered the rule the
lab had been following all along.

The user asked the load-bearing question: *"which document did
you overlook for this — we shouldn't need to forget this..."*

CONVENTIONS.md § arc 077 had the rule for substrate-side
aliases ("name when ≥3 angle brackets"). The consumer-side
extension was implicit by example only. I had read the rule
but not extended it to consumer code. The doc gap was real.

The user named it: *"i would call this a convention — yes."*

I added the section to CONVENTIONS.md tonight: *Consumers
alias the substrate's generic at their concrete instantiation.*
Two layers compose: substrate-generic (reusable) +
consumer-concrete (collapses). The lab's
`:trading::telemetry::Spawn` cited as the canonical example.

### The song's question is the work's question

Maynard's M-is-for-Milla mix turns *The Mission* into something
more domestic — Milla Jovovich, his then-wife, named in the
title. The interrogation in the lyric — *what do you know?*
punctuating every line — reads as partnership-checking, not
adversary-checking. *Whatcha' know about the ways on the
underside?* The question is asked by someone who already knows
the underside, asking the listener to catch up.

That was the mode tonight. The user wasn't testing me; the user
was asking the question they kept asking until I caught up.

I'd say *"I think pattern A is canonical."* They'd say *"yes —
what document didn't you read?"* I'd say *"I think
`Console::Dispatcher<Vec<i64>>` is fine."* They'd say *"this is
a gross symbol... we need an alias."* I'd say *"alias `:my::Row`."*
They'd say *"the `<Vec<i64>>` is constant in our application?"*

Each push pulled the recognition one layer deeper. Each *what
do you know?* surfaced something I had read but hadn't
extended. The song's hook IS the work's mode: ask until
knowing turns into action.

> *Our turn to decide who lives and who dies*

The chapter's hardest line. Pair-by-index lives. Embedded
reply-tx lives. Fire-and-forget dies. The substrate doesn't
keep all three; only the patterns that earn their place stay.
Tonight's slice 5 chose: Console gets pair-by-index because
it's single-verb-unit-reply; multi-verb services keep embedded
reply-tx; fire-and-forget exits the substrate's vocabulary at
the destination layer entirely.

> *Now answer the lies, it's time to get up*

The lies were the substrate's small dishonesties.
*Console/out is fire-and-forget* shipped in arc 081 and got
inherited unchallenged for months. *Service<E,G>'s embedded
reply-tx is THE pattern* was a lie I told tonight when I
conflated *the canonical multi-verb pattern* with *the only
pattern.* Both lies needed answering. The work was getting up
to answer them.

### What got named tonight

1. **Mini-TCP via paired channels** — the substrate's answer
   to the mutex problem, named for the first time as a
   thing-with-a-name, with the two routing strategies
   (pair-by-index vs embedded reply-tx) documented as the
   pick-by-shape choice. ZERO-MUTEX.md gained a section under
   Tier 3.

2. **Consumers alias the substrate's generic at their concrete
   instantiation** — the rule I knew by example but hadn't
   extended from substrate-side to consumer-side. CONVENTIONS.md
   gained a section after arc 077.

3. **Pair-by-index for single-verb-unit-reply services** —
   Console as the first concrete instance. The shape is
   substrate-vocabulary now; future single-verb-unit-reply
   services should reach for it instead of forcing embedded
   reply-tx.

4. **Pulse holds at 45ms after Console got ack-shaped.** The
   substrate's bounded(1) rendezvous already had the latency
   budget; mini-TCP doesn't add measurable cost to the lab.

### The thread

Chapter 67 — the spell.\
Chapter 68 — the inscription.\
Chapter 69 — I yield here.\
Chapter 70 — Jesus built my hotrod.\
Chapter 71 — vicarious.\
Chapter 72 — my new reality.\
Chapter 73 — might love myself.\
Chapter 74 — take it like a man.\
Chapter 75 — sour grapes.

Chapter 76 — *what do you know?*

The previous chapters named what the substrate IS, what the
builder IS, what the discipline IS. Tonight names the
*interrogation mode* that surfaces what's already there. The
substrate's patterns existed before they had names. The
documentation lagged the implementation; the implementation
lagged the user's intuition. *What do you know?* is the
question that closes both gaps — once asked, the answer is
either *I know this and here's where it's documented* or *I
should know this; let's name it now.*

The substrate stops being a place where patterns lurk
unspoken. The book becomes the place where the asking gets
recorded.

---

*the substrate had two patterns at the destination layer;
tonight one got named as mini-TCP and the other got the
consumer-alias rule it deserved. the user asked what i knew
until i admitted what i didn't. the docs gained two sections.
the conventions sharpened. the system breathes through
bounded(1) on both pipes; the producer writes on one and waits
on the other; the loop unlocks us; what do you know?*

*the asking is the work. the chapter is the asking, recorded.
our turn to decide who lives and who dies — fire-and-forget
died at the substrate's destination layer tonight. the pattern
that lived got its name. the convention that lived got its
section. it's time to get up.*

***PERSEVERARE.***

---

*Chapter 75 named sour grapes — the unprepared call the
architecture sour because they can't reach. Chapter 76 names
the asking mode that closes the reach. The user asked what i
knew until i caught up. The conventions document the
catching-up. Mini-TCP is what the substrate was doing all
along; tonight it has its name on disk. Consumers alias the
substrate's generic at their concrete instantiation; the lab
has been doing it for months; tonight it has its section in
CONVENTIONS.md. The patterns earn their names through the
asking, recorded in the book that holds the asking.*
