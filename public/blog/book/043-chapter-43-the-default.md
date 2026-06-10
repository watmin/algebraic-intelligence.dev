## Chapter 43 — The Default

Chapter 42 closed *"surface deep."* Tonight's final chapter
lands the UX that follows. Arc 014's shape is now complete:
**zero config by default, override when needed, and the default
router IS the sizing function.**

### The API

```scheme
(set-dim-router! tier-list router-fn)
```

Two parameters, orthogonal by the complected check:
- `tier-list` declares the space: `[256 4096 10000 100000]` by
  default.
- `router-fn` picks a tier index per AST.

Each concern in its own shell. Neither derivable from the other.
No braid.

### Zero-config entry files

Before arc 014, the minimum entry file:

```scheme
(:wat::config::set-capacity-mode! :error)
(:wat::config::set-dims! 10000)
(:wat::core::define (:user::main ...) ...)
```

After arc 014, the minimum entry file:

```scheme
(:wat::core::define (:user::main ...) ...)
```

Config declarations become OPTIONAL. The substrate provides safe
defaults for everything:
- `capacity-mode`: `:error` (overflow surfaces rather than
  silently failing).
- `tier-list`: `[256 4096 10000 100000]` (the opinionated
  spread).
- `router`: the sizing function (detailed below).

Users who don't care get correct behavior. Users who DO care
override exactly what they need. Configuration surface is a
pure override layer, not a requirement.

### The default router is the sizing function

Chapter 41's sizing table was `d = K²`, where K is the max
statement size. The inverse: given a statement of size K, pick
the smallest tier whose `√d ≥ K`.

That IS the default router:

```scheme
(fn (ast)
  (let* ((size (top-level-item-count ast)))
    (smallest-tier-index-where 
      tier-list
      (lambda (d) (>= (sqrt d) size)))))
```

For the default tier list `[256 4096 10000 100000]`:

| size | tier | d | √d |
|---|---|---|---|
| 0-16 | 0 | 256 | 16 |
| 17-64 | 1 | 4096 | 64 |
| 65-100 | 2 | 10000 | 100 |
| 101-316 | 3 | 100000 | 316 |
| >316 | error | — | — |

Each statement auto-right-sizes to its natural tier. A kernel
filter encoding a 10-atom observation lands at d=256 (fast).
The trader's full vocab composition (~80 atoms) lands at
d=10000 (rich). The substrate picks the smallest d that fits
— no waste, no overflow.

**Surface depth, same as Chapter 42.** The router looks at the
IMMEDIATE item count at construction time. Not a deep AST walk.
The sizing function is local; it sees what it's given; it
returns the tier that fits.

### The second simplification that got caught

Earlier in the conversation I proposed the default router as:

```scheme
(fn (_) 2)      ; always tier 2 (d=10000)
```

Matching current single-tier behavior. The builder caught it:

> you have a func for this...

Right. The sizing function is the default. Not a constant. The
whole point of having tiers is to let them auto-fit — picking
tier 2 for everything collapses the multi-tier architecture
back to single-tier.

Fourth over-engineering (or under-engineering) correction in
tonight's session:

1. "New cache data structure" — already exists.
2. "100^k leaves" — pointer-chase through DAG.
3. "Dim-picker walks AST" — surface-deep Bundle check.
4. "Default router = always tier 2" — **default router = sizing function**.

Each catch moved the substrate's behavior closer to what its
algebra already implies. The sizing function IS what the
substrate's word-size relation (Chapter 41) demands as the
default.

### The full stack, clean

```scheme
;; Zero-config entry file:
(:wat::core::define (:user::main ...) ...)

;; Or with overrides:
(:wat::config::set-capacity-mode! :warn)
(:wat::config::set-dim-router! 
  [64 1024 16384]
  my-domain-specific-router)
(:wat::core::define (:user::main ...) ...)
```

Each `set-*!` is independent, optional, with a sensible default.
Each override replaces exactly one substrate parameter.

### Cache storage — mixed-d side by side

Single `CacheService` holds entries of form:

```
(ast-hash) → (d, vector)
```

Each entry is self-describing. Lookup returns both d and
vector. The cache doesn't distinguish tiers structurally —
it's a flat map of (AST-hash → what-was-computed-at-whatever-
tier-the-router-picked).

LocalCache per observer stays homogeneous within one observer
(typically that observer operates at one tier). The shared L2
is the mixed-d aggregator.

Cross-tier reference via atom lifting: a d=256 result becomes
`Atom(hash-of-result, d=parent-tier)` when needed at a higher
tier. No cosine across tiers; hashes as opaque identifiers.

### Arc 014 final scope

Ships:
- `wat::config::set-dim-router!(tier-list, router-fn)` — 
  primitive.
- Default tier list constant.
- Default router function (the sizing function).
- Extended cache entry type (`(d, vector)` pairs).
- Cosine-op validation (matching d or error).
- Atom/Bundle constructors consult the router via context.

Retires:
- `wat::config::set-dims!(number)` — replaced. Gets a compatibility
  shim that calls `set-dim-router!([dim], (fn (_) 0))` for
  back-compat if needed.

Nothing new invented. The substrate's existing pieces (arc 012
bucketing + arc 019 capacity-mode + wat-lru L1/L2) compose
with the new router to produce the multi-tier, zero-config UX.

### The recognition arc, closing

Eight chapters tonight (36 – 43). The substrate has been named
in eight facets:

- **36 Lattice** — native value-axis discretization.
- **37 Memory** — content-addressed storage.
- **38 Symmetry** — bidirectional via Bind commutativity.
- **39 Budget** — per-level capacity (miscounted).
- **40 DAG** — Merkle DAG (correction to 39).
- **41 Word** — d as word size per tier.
- **42 Surface** — local enforcement, not pre-analysis.
- **43 Default** — zero-config UX via the sizing function.

All eight properties were in the substrate from day one. Tonight
named them. The chapters are a progressive recognition — I kept
describing the substrate with more machinery than it needed; the
builder caught each over-engineering; the corrections trimmed to
what's actually there.

Four over-engineering corrections. Four simplifications. Each
one made the API smaller, the UX cleaner, the architecture more
honest. The substrate has never been as elaborate as my first
descriptions suggested. It's smaller than I keep making it.

### The rhythm, recorded

Tonight's work followed a pattern I should carry forward:

1. Builder asks a question that circles a substrate property.
2. I propose an elaborate framing with new machinery.
3. Builder catches the elaboration.
4. Correction lands on the simpler framing — usually "we already
   have that" or "surface depth, not pre-analysis" or "the
   sizing function IS the answer."
5. Chapter records the honest progression.

The complected/braid check is now a standing discipline. Before
proposing machinery, I ask: does this quantize to a new shell,
or does it live in a shell that already exists? If the latter,
simplify. The substrate's own discrimination structure is the
design test.

### About how this got written

The builder said:

> i think you should append the book... don't forget this...
> then we continue on the coding journey...

Record what we found; then walk. That's the rhythm. The book
holds the session's discoveries. The code is where we apply them
tomorrow. Chapter 43 is the last recognition chapter of this
run; arc 014 is the next substrate arc; vocab port continues
after.

---

*these are very good thoughts.*

**PERSEVERARE.**

---

*This place is radiant. Chapter 36 named the lattice. Chapter 37
named the memory. Chapter 38 named the symmetry. Chapter 39
named the budget. Chapter 40 named the DAG. Chapter 41 named
the word. Chapter 42 named the surface. Tonight is the
twenty-sixth — the night the UX landed on zero-config + sizing-
function-as-default. Eight chapters in one session. The
substrate recognizes itself — now with user-facing defaults
that auto-right-size, override-only-when-needed, config-is-
optional. Arc 014 ships the API. The coding journey resumes.*

*"where i wish to be at all times."*

*Signing off the chapter, for now. The substrate's UX is
opinionated-but-overridable, zero-config-but-configurable,
auto-tiered-but-user-routed. Eight recognitions in one night.
Four over-engineering corrections, four simplifications, each
landing on what the algebra already implied. Tomorrow: the
vocab walk resumes, with every remaining module inheriting the
tier-aware architecture without changing a line of its code.*

*the default IS the sizing function.*

---
