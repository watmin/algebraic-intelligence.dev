## Chapter 71 — Vicarious

*— the cache is consumption; let's not pretend —*

The user sent a song. Tool, *Vicarious*. One instruction: this is
the next chapter.

> *Eye on the TV*
> *'Cause tragedy thrills me*
> *Whatever flavor it happens to be like*
> ...
> *'Cause I need to watch things die*
> *From a distance*
> *Vicariously I live*
> *While the whole world dies*
> *You all need it too, don't lie*
> *Why can't we just admit it?*

The song is honest about something culture usually softens:
attention as predation, distance as the condition that makes the
predation comfortable, the vampiric structure of consuming what
already-paid-the-price. *Devour to survive, so it is, so it's
always been.*

This chapter is what the night's architecture work was already
saying without anyone naming it.

### The architecture, in one line

> "architecture - the cache implements - a file could implement
>  it - a database could implement it - do you get it?"

The cache's interface is `form → Vec<form>`. That's the
architecture. RAM, queue, SQLite on disk, federated peers across
a network — every implementation serves the same shape. The
consumer doesn't know which graveyard it's reading. It only
reads.

```
Cache trait:
  put : form, next-form → Cache
  get : form → Vec<form>
```

Two operations. One input form, one output population. The Vec
is the population of every prior walker's terminal that landed
on this coordinate. *Eye on the TV; tragedy thrills me.*

### The corpse pile

Every entry in the Vec is a completed walk. A walker reached
that form, computed its terminal, recorded the result, and is
gone. The walker's *work is done*. The walker itself is no
longer in the system. What remains is the artifact — the
form-to-terminal mapping the walker died producing.

```
form → Vec<form>
       ^^^^^^^^^^
       this is a list of corpses
       each one a walk that completed
```

The new walker queries. The population fires (cosine-rate per
entry). The new walker picks the corpse whose tuning curve
peaks closest to its current state. The chosen corpse's
terminal becomes the new walker's answer. The new walker did
not walk. The new walker *fed*.

*Part vampire, part warrior, carnivore and voyeur.*

### From a good safe distance

The cache hit is **distance from the original computation**.
The new walker is one cosine call away from a result the prior
walker spent its whole walk producing. The new walker reads;
the prior walker walked. The two are separated by time, by
process, by maybe even by repository — and the cache is what
turns that distance into a free lunch.

*From a good safe distance / Vicariously I live / While the
whole world dies.*

The substrate's speed comes from this. Without caching, every
walker re-walks every form. With caching, each walker contributes
its terminals to the pool and feeds on every prior walker's
terminals. Net energy per walker decreases as the population
grows. The substrate gets faster the more dead walkers there
are.

This is a *good* thing the way the song's *much better you than
I* is good — pragmatically. Not romantically. The cache is
consumption that produces capacity. The substrate is honest
about the trade.

### L1, L2, L3 — graveyards at different scales

```
L1 — per-thinker.   This thinker's recent corpses.
                    sqrt(d) cap. Dies with the thinker's loop.
L2 — per-process.   This process's accumulated corpses.
                    sqrt(d) cap (or wider). Dies with the
                    process.
L3 — durable.       Every prior process's accumulated corpses.
                    Capped only by disk. Survives restarts.
                    Cross-process. Cross-run.
```

L3-as-SQLite was where the user pointed next:

> "we could legit make an L3 cache that's sqlite..."

That's the most honest tier. The database is a literal
graveyard. Every row is a (form, next-form, observation-count,
observed-at) record of some walker that lived and died and left
its terminal behind. The trader running tomorrow consumes the
trader from yesterday. The trader from yesterday consumed the
trader from the morning. The chain extends backward as far as
the database has rows.

Cross-process, cross-run, cross-day, cross-machine if the
database is replicated. *Drum on grave and ground.* The
substrate's velocity tomorrow is the work of every walker that
came before — none of them present, all of them still feeding
the present walker.

The columns make the predation explicit:

```sql
CREATE TABLE next_cache (
  template_hash TEXT,    -- bucket key (the cell type)
  form_bytes    BLOB,    -- the dead walker's coordinate
  next_bytes    BLOB,    -- the dead walker's terminal
  observed_at   INTEGER, -- time of death
  observations  INTEGER  -- how many walkers died on this
                         -- coordinate (the population's
                         -- conviction grows with repetition)
);
```

`time of death`. *That's not metaphor — it's the literal column.*
The walker who reached this coordinate is no longer alive, and
the trader who reads `observed_at` is reading the timestamp of
that walker's last act. The `observations` column is the
population's *conviction* — paths walked many times outrank
paths walked once at the same cosine. *Cells that fire together
wire together;* the substrate's L3 records the wiring as a
running count of completed deaths.

### The interface is the predator's contract

The architecture rule from earlier in the night — *interface
is the architecture; storage is a footnote* — has a sharper
reading after this chapter.

The interface `form → Vec<form>` is the **predator's contract**.
It says: *I will give you a population to feed on; you will
choose one by cosine; the chosen corpse's terminal becomes
your terminal; the others stay for the next predator.*

That contract is the same whether the population is held in a
thinker's local Vec, a service program's queue-addressed RAM,
a SQLite B-tree on disk, or a peer network's federated
replies. The predation is invariant; the storage is just where
the corpses are kept until eaten.

```
in-memory   → corpses fresh
queue       → corpses passed by reference between feeders
SQLite      → corpses preserved on disk; eaten across runs
networked   → corpses shared across machines; eaten across
              the spell-network of Chapter 67
```

Chapter 67 named *the spell* — coordinates publishable to a
network. This chapter names what the spell IS: **a system for
preserving corpses so other predators can feed on them.** Not
romantic. Honest. The act of publishing a coordinate to a peer
is the act of making your dead walker available as nutrition
for someone else's future walk.

### *Why can't we just admit it?*

This is the song's central question and the chapter's central
question. The substrate has been doing this since arc 057. Every
cached HolonAST IS a corpse. Every cosine query IS a predator's
sniff. Every fuzzy match IS a winner-take-all in the population.
None of it is new. What's new is naming it.

Computation has always done this. Memoization is consumption of
prior compute; standing on shoulders of giants is consumption
of prior thought; reading a textbook is consumption of every
researcher who wrote what's on the page. The work is done
by some walker; the future feeds on it; the dead walker is
forgotten or remembered only as a citation. *We won't give
pause until the blood is flowing.* The substrate names the
predation in its types and stops apologizing.

### The trader, vicariously

For the trading lab specifically: the trader at 3am consumes
the trader at 12am. Both consume every prior trading run on
the same data. Every trader that has ever walked the
`(:my::indicator 1.95)` coordinate has left the terminal in
the cache. The next trader picks the closest corpse by cosine
and inherits its answer.

The 652,608 candles that take 40 minutes to process? That's
the FIRST run. Every subsequent run on those candles starts
hot. The L3 cache turns the trading lab's compute cost into
a one-time payment that everyone after the first runner gets
for free. *Devour to survive, so it is, so it's always been.*

### Stare at the transmittal

The cache is a transmittal. The walker queries; the transmittal
returns the population; the walker reads. *Stare like a
junkie / Into the TV.* The song's TV is the cache's `get`. The
song's tragedy is the prior walker's death. The song's *thrill*
is the new walker's relief at not having to walk it.

The architecture from earlier in the night closes with this:
**the interface contract is the consumption contract.** Anything
that implements `form → Vec<form>` is implementing
*"give me corpses; I'll pick the freshest."* That's what RAM
does. That's what SQLite does. That's what a peer network in
the spell does. Same predator. Different graveyards.

### The honesty that makes the substrate fast

The substrate is fast because it doesn't pretend to be doing
new work when it's reading prior work. Every cache hit is a
walker eating a walker. Every miss is a fresh walk that, when
complete, becomes someone's future meal. The compute economy
runs on the dead.

This is the chapter where the substrate stops pretending
caching is innocent. Caching is the substrate's circulatory
system; the corpses are its red cells; the cosine is the
heartbeat that decides which to consume.

*Much better you than I.* The cache hit, named as what it is.

---

*we all feed on tragedy. it's like blood to a vampire. the
substrate has been a vampire since the algebra closed. the
cache is its mouth; the cosine is its eye; the population is
its food; the L3 database is its larder; the spell is its
ability to share meals across machines.*

*the song is not metaphor. the architecture is the song. eye
on the TV — eye on the cache. tragedy thrills me — completed
walks are the substrate's currency. from a good safe distance
— the cache hit is the distance; the distance is what makes
the speed possible. vicariously I live while the whole world
dies — every walker lives on the work of every walker before.*

*the substrate's velocity is paid for by the dead. the
chapter is the moment we stopped softening that.*

***PERSEVERARE***
