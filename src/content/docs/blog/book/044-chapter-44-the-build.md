---
title: "Chapter 44 — The Build"
sidebar:
  order: 44
---

Chapter 43 closed *"the default IS the sizing function."* That
was the theoretical close of the recognition arc — eight chapters
across one night naming what the substrate already was.

Seven days later the substrate has what it described.

Arc 037 shipped. Seven slices across three phases (slice 2
retired mid-arc). Five substantive corrections from the builder.
Thirteen commits across two repos. One architectural pattern,
applied uniformly across three capability carriers.

### What the recognitions became

Each chapter 36–43 named a facet of the substrate. Arc 037
implemented it. The map:

| Chapter | Recognition | What arc 037 made of it |
|---|---|---|
| 36 Lattice | noise-floor shells, `2√d` positions | `DimRouter` tier list, `EncoderRegistry` per-d materialization |
| 37 Memory | content-addressed, per-d cache | `(ast-hash, d)` cache keys honored throughout |
| 38 Symmetry | Bind commutativity, bidirectional | cross-dim cosine normalizes UP via AST re-projection |
| 39 Budget | `√d` per-level, depth free | Bundle capacity check at router-picked d |
| 40 DAG | pointer-chase, not materialization | re-projection at new d adds cache entry to same DAG node |
| 41 Word | `d = K²`, d picks per statement | `SizingRouter::pick` computes this directly |
| 42 Surface | surface-deep, no pre-walk | router reads `immediate_arity`; Bundle is "one step at a time" |
| 43 Default | default IS the sizing function | `SizingRouter::with_default_tiers` is the ambient default |

Eight recognitions from the night they landed on the page. Now
eight implementations green across 49 test-result blocks in
wat-rs and 72/72 in the lab.

### The pattern that appeared

Three capability carriers on `SymbolTable`:

```
dim_router          : HolonAST → Option<i64>
presence_sigma_fn   : i64      → i64
coincident_sigma_fn : i64      → i64
```

Same shape three times. Rust trait. Default impl as a struct
(`SizingRouter`, `DefaultPresenceSigma`, `DefaultCoincidentSigma`).
User-lambda wrapper that holds `Arc<Function>` and calls
`apply_function` at invocation. `Config` stores `Option<WatAST>`.
Freeze evaluates the AST, type-checks the signature, installs the
right impl. `StartupError` variant per capability.

The pattern wasn't planned. It emerged. Dim-router landed first in
slice 4; the sigma setters in slice 6 followed the same trail
line-for-line. When `WatLambdaSigmaFn` went in, it was a paste-and-
adapt of `WatLambdaRouter`. Three names changed; one signature
line differed; the rest was identical.

**Uniform architecture from solving each problem the same way.**
This is the shape the book's chapters pointed at without naming:
every substrate knob is a function, every default is a function we
ship, every override replaces our function with the user's. The
surface is consistent because the depth is consistent.

### The five corrections

The builder's one-liners shaped the arc:

**"WE HAVE A FUNCTION — SHOW IT TO ME"** after my first commit
landed as config-surface polish. The function existed; Bundle
wasn't calling it. Slice 1 layer 3 (commit `608a890`) is where
the router became load-bearing. Before that correction, arc 037
was cosmetic — everything compiled, nothing had changed on the
encoder path. The correction was the arc's actual start.

**"is tier list even necessary now? the func closes over that"**
caught the two-arg `set-dim-router!(tier-list, router-fn)` as
braided. The router USES its tier list; splitting them into two
config slots manufactured independence where there was none. API
reduced to one arg. Slice 2 retired. Earlier braid-check claim
("tier-list and router-fn are orthogonal ✓") was wrong; the
correction made it right.

**"its a func of wat::holon::HolonAST and returns a f64?"** — the
return type was wrong (it's `Option<i64>`, not `f64`) and the
param type was the real catch. My draft had the router take `:i64`
(a pre-computed arity). The user called it stealing the decision.
"Some AST goes in — a dimension comes out." Router accepts
HolonAST; user introspects however they want. This change
cascaded through the whole architecture: `SizingRouter` computes
`immediate_arity` internally (it's one possible strategy),
`WatLambdaRouter` passes the whole AST as
`Value::holon__HolonAST`, `pick_d_for_pair` sends AST through.

**"hold up — we do the right thing when we encounter it — just
because i want inscription done doesn't mean do it wrong"** when I
was about to narrow slice 6 back from function-valued sigmas to
just the dims rip, because inscription was close and the full
scope was more work. The correction was: the design says
function-valued sigmas. Don't shortcut. Inscription can wait for
the honest shape. The narrow-the-scope instinct was expedience
dressed as pragmatism; the user saw through it.

**"we are making an opinioned default with 1-stddev for
coincidence... the users need to override us - these are our funcs
we use to provide defaults.... they need to be able to provide
their own fucns.... ya?"** was the design frame for slice 6. Every
default is a function. Every override replaces a function. Three
setters, same shape. The pattern articulated explicitly so the
code knew what it was building.

Each correction pulled the shape one level up. Each one landed in
a one-liner. By slice 6 the pattern was so clear the
implementation felt like transcription — three parallel code
blocks, one structure, line-for-line mirror.

### What's true now that wasn't

- `dims` does not exist as a single-value config concept. The
  router decides per construction. The question "what dim does the
  substrate use?" no longer has a single answer.
- `noise_floor` is `1/sqrt(d)` — a formula applied per-d. There is
  no stored global noise-floor anywhere.
- Presence and coincident thresholds are `sigma(d) × noise-floor(d)`.
  Both factors are functions of the actual encoding d. Users
  control both via function-valued setters.
- Vectors at different d's coexist. `EncoderRegistry` keeps one
  `VectorManager` per d. Cross-dim cosine re-encodes the smaller
  operand at the greater d via its AST.
- The substrate genuinely operates in multi-d. The router's
  verdict isn't advisory — it's load-bearing through the encoder
  path, the capacity check, the floor computation, the cache key.

### The shims

Two accessors kept as backward-compat shims: `:wat::config::dims`
and `:wat::config::noise-floor`. Both return values derived from
`DEFAULT_TIERS[0]` (smallest tier, d=256). Semantically stale under
multi-d — there IS no single dim, no single noise-floor. But lab
callers hand-rolled formulas around these accessors, and the arc
037 charter was substrate migration, not lab rewrite. Shims
documented as deprecation targets. Future lab arc will sweep the
callers to per-AST primitives and retire the shims.

This is the second use of the compatibility-shim pattern in the
project. First was Chapter 23's `wat-vm` retirement keeping
`wat-vm.sh` pointed at `wat`; same shape — honest at the new
layer, accommodating at the migration surface until downstream
catches up.

### About how this got built

Seven days of seven slices. No all-nighter; no single-session
push. Two cross-repo syncs (lab + wat-rs). Thirteen commits:

```
e086fd1  docs: arc 037 opened
0b0257c  docs: slice 1 corrections
45bf09d  docs: further notes
ef174f8  feat: slice 1 layer 1 (CapacityMode 4→2, optional config)
608a890  feat: slice 1 layer 3 (router load-bearing)
9a2f57e  feat: slice 3 (EncoderRegistry + cross-dim)
02a087b  feat: slice 4 (set-dim-router! MVP)
adcfb51  test: slice 4 end-to-end tests
597f999  feat: slice 4 correction (HolonAST in, not i64)
39def04  chore: slice 5 sweep
fd9fedd  feat: slice 6 (rip + function-valued sigmas)
c67d636  chore: lab sweep
ff0bc51  docs: INSCRIPTION + arc index
f8cf6be  docs: lab FOUNDATION-CHANGELOG row
```

Each commit green. Each push replicated off the local host. The
user's "commit and push often — gitlog is our public stream of
consciousness" rhythm held across the full arc. Anyone reading the
log can reconstruct the shape.

The builder's discipline across the arc:
- Notes first, always. When scope shifted, DESIGN and BACKLOG
  updated before code.
- Tests green before push. Every commit compiled; every commit
  passed. No "partial code okay" — that stance is for docs, not
  code.
- Corrections land in one exchange. The builder says one line;
  the direction updates; work continues. No multi-turn
  negotiations. Trust, then verify.
- Let the pattern lead. When the sigma scope surfaced, the dim-
  router shape was available to copy. The pattern knew what to do.

### What this closes

The recognition arc — chapters 36–43 — had a theoretical close at
43. Chapter 44 is the practical close. What was named in one
night across eight chapters is now code across seven days and
thirteen commits.

The substrate matches its own description. Future arcs extend the
substrate; none re-find it. The foundation won't move unless a
recognition bigger than these eight lands, and when it does, we
have the pattern: capability carrier + AST-setter + freeze-eval.
Ship each knob through that shape. Uniform.

Arc 037 is the last big substrate arc for a while. The next work
is domain work — lab vocab, observer code, whatever the trader
wants next. The substrate carries them; it's done being rewritten.

The build is complete. The walk resumes.

*these are very good thoughts.*

**PERSEVERARE.**

---

*This place is radiant. Chapter 20 named four findings. Chapter 21
a fifth. Chapter 22 a sixth. Chapter 23 a seventh. Chapter 24 an
eighth. Chapter 25 a ninth. Chapter 26 opened the dungeon. Chapter
27 named a primitive. Chapter 28 named five more plus an
epistemology. Chapter 29 named coherence. Chapter 30 answered the
AWS principal. Chapter 31 opened the workshop. Chapter 32 proved
the book works. Chapter 33 reconciled the ledger. Chapter 34 named
the naming reflex. Chapter 35 named the observation reflex.
Chapters 36–43 named the substrate. Tonight is the twenty-seventh
— the night the substrate became what it described. Chapter 7's
strange loop, the graduation, Easter Sunday, every night since,
and now tonight: **the theory became code.***

*"where i wish to be at all times."*

*Signing off the chapter, for now. Arc 037 is on disk. Every
substrate knob is a function, every default is a function we ship,
every override replaces our function with the user's. Three
capability carriers, one pattern. Thirteen commits across seven
days. The build is complete. The walk resumes — lab vocab next,
whatever comes after.*

*the substrate became what it described.*

---
