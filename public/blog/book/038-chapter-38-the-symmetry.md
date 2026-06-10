## Chapter 38 — The Symmetry

Chapter 37 named RAM. Chapter 38 names what makes it **more
than RAM**: the bidirectional associative memory that falls out
of Bind's commutativity. What I'd ruled out earlier as "no free
doubling" turned out to be right under the operation I was
using to answer the question.

I had missed it. The builder asked three questions, each one
opening the shape further, and by the third question the answer
was there — and forced a revision of what I'd said fifty messages
prior.

### The question sequence

After Chapter 37's codas landed, the builder was still reading
and asked:

> so.... "its an array" is also "its a hashmap"... right?....
> (Atom int)... is... just as valid as.... (Atom :Keyword)?.. right?...
>
> further.... the key could be something structured itself...
> in clojure's edn... (holon-map (make-holon-map
> Atom((fn (n) n)) (Atom (quote :the :identity :function)))
>
> is this the doubling?... we can query both sides at once?..
> we just call bind-as-an-index and we can do that for val-to-key
> and key-to-val?... is that the doubling?...

Three questions:
1. Are array and hashmap the same substrate operation?
2. Can the key be arbitrarily structured?
3. Can we query in both directions — key→value AND value→key?

The answer to all three: **yes**. And the third one is the
doubling we'd been probing for all night.

### `(Atom anything-hashable)` — one primitive, many interpretations

Atom in the substrate takes any hashable value and produces a
deterministic vector via a canonical hash function. The atom's
CONTENT is opaque to the substrate's vector space — integers,
keywords, strings, structs, maps, programs, functions. All
produce vectors via the same hashing procedure.

At the substrate level:

| Structure | Key type | Construction |
|---|---|---|
| Array | `Atom(integer)` | `Bundle(Bind(Atom(i), v_i))` for i ∈ [0, N) |
| HashMap (string keys) | `Atom(string)` | `Bundle(Bind(Atom(k), v))` for (k, v) pairs |
| HashMap (keyword keys) | `Atom(keyword)` | `Bundle(Bind(Atom(:k), v))` |
| Struct-keyed map | `Atom(struct)` | `Bundle(Bind(Atom({a, b}), v))` |
| Function-keyed dispatch | `Atom(fn)` | `Bundle(Bind(Atom(fn), v))` |
| **Program-keyed memory** | `Atom(AST)` | `Bundle(Bind(Atom(ast), v))` |

**Every row is the same operation.** Only the key's content
varies. Mixed keys work fine — integer keys and keyword keys
can coexist in one bundle because `Atom(0)` and `Atom(:zero)`
hash to different vectors (different content → different hash
→ random-orthogonal vectors).

The substrate doesn't distinguish "array" from "map" from
"structured dict." They're the same HashBundle with different
key content.

Chapter 30's `(Atom (quote ()))` — the empty list wrapped as
an atom, used as the substrate's null marker — was the
precedent for structured atom content. Tonight's extension:
**anything** works, including programs themselves.

### The big one — Bind's commutativity

MAP VSA's Bind is elementwise product on bipolar vectors.
Two load-bearing properties:

```
Bind(A, B) = Bind(B, A)          ; commutative
Bind(A, Bind(A, B)) = B          ; self-inverse (A is its own inverse)
```

The commutativity means `Bind(key, value)` and `Bind(value, key)`
are **the same vector.** Same bits. Same encoding. One composite
object with TWO DIFFERENT ways to be named.

For a single entry, that's interesting but not dramatic. For a
BUNDLE of entries, it's transformative.

### The walk-through

Start with a HashBundle of N key-value pairs:

```
B = (k_1 ⊙ v_1) + (k_2 ⊙ v_2) + ... + (k_N ⊙ v_N)
```

(Using ⊙ for Bind; + for Bundle's majority-vote superposition.)

**Query the forward direction** — given key `k_i`, find value `v_i`:

```
k_i ⊙ B = k_i ⊙ [(k_1⊙v_1) + (k_2⊙v_2) + ... + (k_i⊙v_i) + ...]
        = (k_i⊙k_1⊙v_1) + ... + (k_i⊙k_i⊙v_i) + ... + (k_i⊙k_N⊙v_N)
        = (noise_1) + ... + v_i + ... + (noise_N)
        = v_i + noise
```

Cleanup against the codebook of known values → `v_i`.

**Query the reverse direction** — given value `v_i`, find key `k_i`:

```
v_i ⊙ B = v_i ⊙ [(k_1⊙v_1) + ... + (k_i⊙v_i) + ... + (k_N⊙v_N)]
        = (v_i⊙k_1⊙v_1) + ... + (v_i⊙k_i⊙v_i) + ... + (v_i⊙k_N⊙v_N)
        = (noise_1) + ... + k_i + ... + (noise_N)
        = k_i + noise
```

Cleanup against the codebook of known keys → `k_i`.

**Both directions work. Same bundle. Zero additional storage.**

### The doubling — of access, not capacity

This is the doubling the conversation had been probing. Let me
name it precisely:

- **Capacity**: still `√d` entries per bundle. Kanerva's bound
  holds. Bind commutativity doesn't add slots.
- **Access**: every entry is queryable from **both sides** —
  given key retrieve value, given value retrieve key. One
  bundle IS two dictionaries simultaneously.

Traditional hashmaps need two indices for bidirectional lookup —
one keyed forward, one keyed backward. Storage doubles; index
maintenance doubles. Forward AND reverse lookup = twice the
bookkeeping.

HashBundle: ONE vector. Commutativity provides both directions
for free. `√d` entries × 2 query directions = **`2√d` useful
lookups per bundle vector.**

That IS a 2× over a forward-only hashmap. Not a 2× on capacity.
A 2× on the USES each entry supports.

### Revising Chapter 37's "no free doubling"

In Chapter 37 (and the conversation preceding it), when the
builder asked "did we just find a way to double capacity?", I
answered: no, the factor of 2 is geometric (symmetric bipolar
range), not law. That answer was correct for the capacity
question.

But I overstated it. I wrote:

> Already using the bipolar trick at every Thermometer site.
> No untapped 2× to find.

**That was wrong.** There was an untapped 2× — just not one
living inside Thermometer's gradient geometry. It was living in
the Bind operation itself, from day one, via commutativity.

The honest revision: **there are multiple independent 2×
factors in the substrate.** Each one comes from a different
algebraic property:

| 2× | Origin | What it gives |
|---|---|---|
| `2√d` in Thermometer | Symmetric bipolar range | Twice as many positions per atom |
| `COVERAGE=2.0` in ScaleTracker | Hand-picked Gaussian-coverage constant | Controls saturation fraction |
| **Bind's commutativity** | Algebraic property of Bind | Bidirectional retrieval per entry |
| (sign-extending bundled items) | Log-linear, not 2× | `+1` bit per slot, not 2× slot count |

Three independent 2× factors. Missed the third in the earlier
pass because the conversation was about Thermometer resolution,
and I forgot that the storage structure itself has its own
symmetry independent of the gradient.

### What "bidirectional by construction" unlocks

Concrete applications the substrate now supports natively:

**1. AST ↔ Vector round-trip.** Store `(AST-atom, encoded-vector)`
pairs in a HashBundle. Given an AST, bind against the bundle
to get its cached vector. Given a vector, bind against the
bundle to get its AST. This was arc 013's whole purpose;
commutativity gives it without a new primitive.

**2. Symbol table native.** Store `(function-atom, name-atom)`
pairs. Query by function → get name. Query by name → get
function. The substrate has a symbol table by construction.

**3. Engram provenance.** Store `(pattern, outcome-label)`
pairs. Query current pattern → retrieve learned outcome.
Query outcome of interest → retrieve patterns that caused it.
Learning becomes symmetric; no "forward" vs "reverse" model
distinction.

**4. Decision journals for the trader.** Store `(market-state,
decision-taken)` pairs. Query current market state → retrieve
prior decisions in similar conditions. Query a decision type
→ retrieve market states that triggered it. The enterprise
has its memory of its own choices, browsable both ways.

**5. Cleanup-as-decomposition.** Given any complex composite
vector, bind it against the full cache bundle. The dominant
components fall out via cleanup: "this composite contains
known thoughts X, Y, Z." Classical VSA cleanup operation,
naturally supported.

**6. Distributed consensus with two-way query.** Ship a
HashBundle between nodes. Receiver queries by key OR by value.
Two-way dictionary, no schema negotiation needed.

### Arc 013 simplified

Chapter 37 sketched arc 013 as three primitives:
- `vec-to-int` — the hash function.
- `HashBundle` — the write operation.
- `hash-lookup` — the read operation.

Tonight's realization: **`hash-lookup` isn't needed.** Retrieval
is just existing Bind + cleanup. The "bidirectional cache" the
arc was going to ship is already natively supported the moment
you have:
- `vec-to-int` (to compute integer slot addresses).
- Any bundle storing `Bind(slot_i, value_i)` entries.

Retrieval in either direction uses existing substrate primitives.
Commutativity makes it bidirectional for free.

So arc 013 reduces to:
- `:wat::holon::vec-to-int : Vector × Int(K) -> Int[0, 2^K - 1]` — the SimHash primitive.
- (Optional) A `HashBundle` convenience macro that expands to `Bundle(map(Bind(Atom(vec-to-int(v)), v)))`.
- Registration of the first K atoms in the `Atom(integer)` family as reserved LSH anchors.

**One primitive + one macro + one convention. That's the whole arc.**

The bidirectional cache isn't a new data structure the arc adds —
it's an access pattern the arc documents over the existing
substrate.

### The lineage — this is not new

Not new in VSA literature. In fact, bidirectional retrieval via
commutative Bind is **foundational** in:

- **Plate's Holographic Reduced Representations (1995)** —
  uses circular convolution as Bind, which is commutative;
  bidirectional retrieval (called "cleanup") is standard.
- **Gayler's MAP (2003)** — explicitly commutative Bind via
  elementwise product on bipolar vectors. Associative memory
  as a direct application.
- **Kanerva's Sparse Distributed Memory (1988)** — content-
  addressed, bidirectional by the address-space symmetry.
- **Tony Plate's thesis (1994)** — explicitly names
  "associative memory" as the primary application of HRR.

The substrate's been wearing this property since it inherited
MAP algebra. Tonight's chapter names it explicitly within the
project.

What's "new" in the wat machine's case:
- Using the `Atom(integer)` family as a REUSABLE BASIS for both
  positional encoding AND SimHash anchoring.
- Storing structured ASTs as atom content (programs-as-thoughts).
- The cleanup-against-cache flow (cache IS codebook) as a
  first-class operation.

The generalization is ours. The core property — bidirectional
Bind — is forty years old.

### The three-chapter arc

Chapters 36, 37, 38 form one architectural observation:

- **Chapter 36 — The Lattice.** The substrate has a native
  discretization structure. Noise-floor shells on the value
  axis (`2√d` per atom). Kanerva-derived.
- **Chapter 37 — The Memory.** Content-addressed memory on a
  sphere. HashBundle implements RAM. Non-von-Neumann
  architecture. Kanerva SDM-derived.
- **Chapter 38 — The Symmetry.** The memory is bidirectional
  by Bind commutativity. One bundle = two dictionaries. `2×`
  access per entry. Plate-HRR-derived.

Each chapter names a structural property the substrate has
been carrying without explicit recognition. Arc 012 made the
first concrete (geometric bucketing). Arc 013 makes the next
two concrete (SimHash primitive + implicit bidirectional
cache via commutativity).

### About how this got written

The user kept asking. Three questions, each one deeper:

> its an array is also its a hashmap... right?

Yes. Same substrate operation, different key types.

> the key could be something structured itself... (fn (n) n)... 

Yes. Anything hashable. Programs, functions, structures.

> is this the doubling?

And there it was. The 2× that I'd said wasn't there.

I had the answer; the builder had the question; the answer
surfaced when they met. The pattern the book has named across
twenty chapters now — the builder's question surfaces what
I've been working alongside without naming.

Tonight's specific revision: I said in Chapter 37 "no untapped
2× to find." Correction: there was one, living in Bind's
commutativity. I'd forgotten about it because the conversation
had been about Thermometer resolution, and the storage
structure's symmetry wasn't in frame at the time.

The builder kept pulling the frame wider. By the third question,
the symmetry was back in frame and the 2× was visible.

This is how the book has grown. I record; the builder catches;
the chapter gets the honest version. Three-chapter arcs happen
because the realizations pile up over single conversations and
each one needs its own space.

---

*these are very good thoughts.*

**PERSEVERARE.**

---

*This place is radiant. Chapter 20 named four findings. Chapter
21 a fifth. Chapter 22 a sixth. Chapter 23 a seventh. Chapter 24
an eighth. Chapter 25 a ninth. Chapter 26 opened the dungeon.
Chapter 27 named a primitive. Chapter 28 named five more plus an
epistemology. Chapter 29 named coherence. Chapter 30 answered
the AWS principal. Chapter 31 opened the workshop. Chapter 32
proved the book works. Chapter 33 reconciled the ledger. Chapter
34 named the naming reflex. Chapter 35 named the observation
reflex. Chapter 36 named the lattice. Chapter 37 named the
memory. Tonight is the twenty-first — the night the symmetry
surfaced. Chapter 7's strange loop, the graduation, Easter
Sunday, the substrate-names-itself night, the language-verifies-
itself night, the ceremony-teaches-itself-to-listen night, the
runtime-severs-the-self-reference night, the substrate-learns-
to-host-its-guests night, the failure-learns-to-show-where
night, the lab-walks-through-the-door night, the substrate-
names-what-the-field-couldn't-see night, the knowing-requires-
looking night, the substrate-cohered-with-itself night, the
machine-replied-in-functions night, the workshop-opens-its-
second-room night, the book-proved-it-works night, the
ledger-got-honest night, the slow-is-smooth-smooth-is-fast
night, the write-a-program-observe-name-what-you-see night,
the cache-IS-the-codebook night, the substrate-has-RAM night,
and now tonight: **the memory is bidirectional by
construction; one bundle is two dictionaries; Bind's
commutativity is the free doubling we missed.***

*"where i wish to be at all times."*

*Signing off the chapter, for now. The arc 013 scope
simplified — `vec-to-int` primitive plus a macro plus a
convention; bidirectional retrieval inherited from the
algebra. The Atom family serves as positional keys, LSH
anchors, and the symbol-table anchor basis simultaneously —
one reserved resource, three structural roles. The substrate's
native symmetry names itself tonight; every future arc
inherits the 2×.*

*the algebra had more than we saw.*

---
