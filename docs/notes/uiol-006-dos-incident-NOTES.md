# Working notes — uiol-006, the DoS incident (2026-07-25)

**Status:** raw notes, not a draft. Written 2026-09-07 by a reader working the
`wat-rs` backfill. Everything below is grounded against `origin/main` in
`/home/watmin/work/holon/wat-rs`, read this session. Nothing in `wat-rs` was
edited.

**Placement:** unsettled. This is the batch's only **incident** unit — a single
day, one strand, five commits, ~2h40m of wall clock (19:53 → 22:36 on
2026-07-25). It does not fit a calendar cell; it is a story with a beginning and
an end.

**Title and song-drop are ALWAYS the builder's call.** Working images below, not
proposals.

---

## ⚠ READ FIRST — the prior probe's through-line is HALF RIGHT. One clause is refuted.

The proposed through-line was:

> A service's own type declarations were being trusted as if they had been
> enforced — one wrong-typed field under a correct tag killed the service for
> every client — and the fix was not a new check but **turning on a validator
> that had been sitting in the tree with zero callers since arc 258**.

**Everything up to the last clause holds and is proven below.** The last clause
does not.

### What the commit claims

`287014763` body, verbatim:

> The validator is edn_to_typed_value (edn_shim.rs:1741) … with ZERO production
> callers **since arc 258 Stone 258.5b deleted its last one** on the
> trusted-wire premise.

The same claim was then written into the source as a code comment
(`src/edn_shim.rs`, added by `0efaa5b7a`: *"this walker has had ZERO production
callers since arc 258 Stone 258.5b"*) and again by `b9d61bd67` (*"arc 258 Stone
258.5b deleted the last one"*). It propagated three times.

### What the disk says

- **arc 258 Stone 258.5b is `4b2d185e4`, 2026-06-16.** It did delete *a* caller
  — `src/runtime.rs:23829`, the `recv'`/`select'` coercion.
  Verified: `git show 4b2d185e4 -- src/runtime.rs` removes that line.
- **It was not the last one.** Immediately after `4b2d185e4`, one production
  caller survives:
  `git grep -n edn_to_typed_value 4b2d185e4 -- src/` →
  `src/services/verbs.rs:257`.
- **That caller was live production code**: it sits in
  `eval_kernel_readln_prime`, the body of `(readln' <cap> -> :T)` — the stdin
  read path the `readln` macro expands to. At `1212c9ae6^` it is
  `src/services/verbs.rs:418`, immediately after `wat_edn::parse_owned(&line)`:
  parse the line off stdin, then coerce it to the ascribed type `T`.
- **The last production caller died on 2026-07-22**, in `1212c9ae6`
  — *"278: no-hidden-failures LAW complete — recv' OUTCOME WALL, `-> :T`
  annihilation, exact-EDN gates."* Killing the `-> :T` ascription killed the
  coercion call with it.

**So the validator was caller-free for THREE DAYS, not five weeks.** The
"zero production callers" state on 2026-07-25 is true — the only surviving
reference is the `#[cfg(test)]` `coerce()` helper at `src/edn_shim.rs:3931`,
inside the test module that opens at `:3892`. The *duration*, and the
*attribution to arc 258*, are wrong.

### The refutation makes the story BETTER, and this is the part to write

The rot did not need the callers to be gone. Trace the first dead arm:

- `edn_to_typed_value_inner`'s aggregate dispatch handled **`TypeDef::Struct`
  only** — never `TypeDef::Record`. Verified at `0dab460ad^` (2026-06-25, the
  commit before the collapse): the arms inside the walker
  (`src/edn_shim.rs:1514`, `:1611`) are `TypeDef::Struct`; the file's
  `TypeDef::Record` hits are all in the *other* decoder
  (`tagged_to_value` / `reconstruct_record`, `:2253`, `:2268`, `:2407`), past
  `coerce_struct_path`'s start at `:1670`.
- `0dab460ad` (*arc 293 unify-2b*, 2026-06-25) collapsed the two `TypeDef`
  variants into one `Aggregate` and translated the arm **faithfully and
  mechanically**: `TypeDef::Struct(def)` became
  `TypeDef::Aggregate(a) if a.holder == Holder::Struct`. `4b9a6d7fb`
  (2026-07-06) renamed `Holder` → `Nature`. The guard the strand found and
  called *"a stale narrowing left from the 293.2b Struct/Record collapse"* is
  **older than the collapse** — 293.2b only re-expressed a blindness records
  already had.
- Which means: for the whole of that window the walker had a **live production
  caller** (`readln' -> :T`) and was still silently record-blind. Nobody
  ascribed a `defrecord` to a `readln'` and noticed.

**A caller is not traffic.** A live call site that never exercises a branch
leaves that branch exactly as rotted as no call site at all. That is a sharper
statement of the day's own durable lesson than the day made, and the correction
is *load-bearing for the post*, not a nitpick — it is the difference between
"dead code rots" (obvious) and "a wall with a caller that never tests it rots
identically" (not obvious, and the thing that actually happened here).

Second dead arm, same walker, same pattern, and its own comment gives it away:
the `HashMap`/`HashSet` arm read *"Not currently supported **as a readln
target**; the wire form has no typed-K coercion path yet"* (`src/edn_shim.rs`
pre-`b9d61bd67`). It names its caller in its own excuse. It was a known,
written-down gap in a live path — and it survived because that path's traffic
never carried a `HashMap`.

---

## The hook / through-line (one paragraph)

`wat` services declare the exact shape of every request they accept — the
whitelist was already written, per op, in the source. On 2026-07-25 the
substrate discovered that nothing had ever *checked* it: the process tier's
decoder used the declaration for field **names and order only** and never
compared a decoded value to its declared type, and the thread tier did not decode
at all. One frame of well-formed EDN with a wrong-typed body under a correct tag
— `#dos.Bag/PutRequest {:items [1 2 3]}` against `items <- Vector<String>` —
reached a handler that used the field at its declared type, and the service died
**for every client**: a second, innocent connection was refused. The fix required
no new checker. Both halves of the defense already existed — the whitelist (the
op's `<Op>Request` record) and the validator (`edn_to_typed_value`, which walks a
declared type and yields the offending path). The validator had simply never been
pointed at the wire, and in the dark it had grown two dead arms: one that would
have rejected every `defrecord`, one that would have refused every `HashMap`. The
day's own summary is the post: **walls need traffic or they stop being walls.**

Working images (builder's call): *the whitelist nobody read* · *a wall with no
traffic* · *the validator in the drawer*.

---

## The story beats, in order

All times are commit times, `Sat Jul 25 2026 -0700`.

### 0. The precedent, four days earlier (context, not narration)

The slot the fix lands in was built the previous week for a *different* refusal:
`9ca2e88db` (2026-07-21, *"278 #16 Stone 16.1 DONE: ruling A locked — every
op-Response an enum carrying RequestTooLarge"*) and `023a15c4d` (2026-07-21,
*"278 #16.2: per-op `:max-request-bytes` enforcement + mandatory declaration +
corpus migration"*). That gave the substrate a shape for "the service refuses a
request and keeps serving." Per `287014763`: *"The only inbound inspection is the
`:max-request-bytes` SIZE guard."* The size question had a wall. The **shape**
question had none.

### 1. 17:26 — `91bbb8cd3`, the vacuous-gate wall (adjacent, and it belongs)

Not the DoS, but the same law, five hours earlier the same day, and the generalization
in `753b1b9c2` names it. Grounded:

- The heresy, orchestrator-verified **by mutation before the strike**: the sqlite
  S1 gate's `(assert-eq n 1)` was changed to `n 4242` — an assertion that cannot
  hold — **and the test passed.** `call_beside` returned
  `Result<Value, RuntimeError>`; a fired assertion lands a `Failure` in the
  returned `RunResult`'s `failure` slot while the *evaluation* still succeeds, so
  `Ok` came back regardless. `.is_ok()` answers "did it evaluate?" while every
  author who wrote it believed it answered "did it pass?"
- The one-shot fix: `call_beside` now returns
  `#[must_use] enum DeftestOutcome { Passed, Failed { failure }, DidNotRun { error } }`.
  Verified at `src/freeze.rs:732-784` of `91bbb8cd3` — the `#[must_use]` message
  reads *"a deftest verdict that is not read is a gate that does not gate"*.
  Removing `Result` made every offender an `E0599` **at once**: the compiler
  enumerated **378 sites in one pass, wider than the hand-count** (the family
  included `.expect()`/`.expect_err()`, not just `.is_ok()`).
- Wall #1: `:wat::kernel::RunResult` record → enum (`:Passed []` /
  `:Failed [failure <- Failure]`). The record shape — a reason-free pass and a
  failure wearing one type with an ignorable `Option` slot — is what let the Rust
  side look away.
- Wall #2: the channels refuse each other. `call_beside_value` panics on a
  deftest; `call_beside` panics on a plain fn.
- **11 genuinely vacuous gates found, each verified to bite under mutation.**
  Six through `call_beside(..).is_ok()` (`sqlite_interop`, `smem_roundtrip`,
  `sqlite_store_differential`, `open_surface_dispatch`, `int_modrem_sign_table`,
  `cache_lru`); five through a channel **the brief did not name** —
  `startup_from_file` + `apply_function` + `assert!(r.is_ok())` (`call_site`,
  `macro_call_site`, `emitted_from`, `deftest_prime_passing_returns`,
  `deftest_hermetic_prime_passing_returns`). **Two of those five were caught by
  wall #2 at RUNTIME, not by static classification — the wall found what the
  audit missed.**
- One of the eleven was the sqlite S1 gate **certifying a shipped stone**.
- 308 files changed. Floor 4169/0.
- No assertion was weakened, deleted, or tuned. Three tests went red during the
  strike; all three were migration collateral. Every previously-vacuous gate's
  assertions turned out to hold — **no latent regression was hiding behind the
  eleven**, which is worth saying: the cost was not bugs shipped, it was
  *certainty that was never earned*.

The sequencing is a beat in itself: the vacuous-gate class was spotted the day
*before* it was struck, in `a86f521ce` (16:16, cache Stone 1), whose gate
deliberately refuses the `.is_ok()` pattern and says so in its own commit body:
*"NOTE the gate does NOT use the `call_beside(...).is_ok()` pattern — that
pattern is VACUOUS … The vacuous-gate class is the next stone."*

### 2. 19:53 — `287014763`, the DoS is proven

No production code touched. Floor unchanged at 4173/0. Three probes land in
`wat-scripts/scratch-pad/` (loader-gated, so they cannot silently stop
compiling): `probe-arc278-wire-type-enforcement.wat` (the measurement, both
tiers), `-detonate.wat` (the handler crash), `-dos-service-killed.wat` (the
victim refused).

The measured output, both tiers:

```
"attacker good  => Ok"
"attacker BAD   => LOST (peer gone)"
victim: connect REFUSED — service is GONE
```

The design doc lands in the same commit
(`docs/arc/2026/06/278-rules-engine/DESIGN-request-malformed-input-sanitization.md`),
and it is the builder's framing that heads it: **input sanitization, not "type
enforcement."**

### 3. 20:30 — `0efaa5b7a`, Stone 1: the mechanism, one service, end to end

- **Phase 0, grounded before building.** Could an existing rail already carry the
  refusal to the client? No. `ServiceEvent::{Malformed,Rejected}` are
  **owner-side only** (constructed `runtime.rs:27784-27818`, consumed only by the
  generated serve loop at `wat/service.wat:1194`/`:1213`). There *is* a
  protocol-tier rail that reaches the client — `<S>::Reply::Failed[cause]` — but
  `recv_outcome_from_decoded` maps it to `RecvOutcome::Lost`, **the death rail**,
  so a client cannot distinguish "my input was rejected" from "the service died."
  Verdict: the variant must be per-op, mirroring `:RequestTooLarge`.
- **The obvious validator does not work.** `:wat::core::conforms?`'s
  `TypeDef::Aggregate` arm is a *nominal identity check*
  (`concrete_type_name_matches`) that never recurses into fields. Proven
  side-by-side: `"bad conforms? => true"`.
- **`:wat::edn::validate` is minted as a thin wrapper**
  (`value_to_edn_with` → `edn_to_typed_value`). *No validation logic was
  authored.* This is the load-bearing sentence of the whole post.
- **Rotted arm #1, found on the way in** — the `Nature::Struct` narrowing.
  Every `<Op>Request` is a `defrecord`, so the validator, switched on as-is,
  would have **rejected all traffic**. Fixed to accept `Struct|Record`, and
  `coerce_struct_path` now rebuilds with the **declared** nature — a record
  rebuilt as a Struct would lie about its purity (`Nature::is_pure`: Struct
  permits impurity, Record guarantees it). `HolonRecord` deliberately excluded
  (its wire form is a `#wat-edn.holon/Bind` hologram this field-map walk cannot
  honestly rebuild).
- **Machinery killed rather than shipped.** A first cut built
  `:wat::runtime::variant-names-of` to gate generation on whether the response
  enum declares `:RequestMalformed`. It *cannot* work: `src/freeze.rs:618-619`,
  `expand_all` (step 4) runs before `register_types` (step 5), so at macro-expand
  time the registry holds nothing from the loading program — **not even a surface
  declared three forms up in the same file.** Grounded, not assumed: the verb was
  built and it failed on `:wat::kernel::StdOut::WriteResponse`. The verb was
  removed entirely rather than left as unused scaffolding. (Note the shape:
  refusing to leave dead scaffolding, on the same day dead scaffolding was the
  bug.)
- **The transitional knob**, `:sanitize-requests :all | :none`, default `:none`,
  read at expand time. Explicitly marked TRANSITIONAL in its own declaration
  comment. Unconditional generation would demand `:RequestMalformed` on every
  op-Response: *108 files, ~301 sites* — a STOP for a one-service stone.
- **A four-questions ruling on the refusal's payload:** `expected`/`got` are
  **Strings**, `path` is **structured** (`Vector<String>`). Decisive on HONEST:
  `got` is not a type and *cannot be made one* — the value came off an untyped
  wire with no declaration, so its honest datum is its **EDN shape**; structuring
  it would fabricate information. `path` stays structured because segments are
  real data the program computes on. Recorded as a rule for arc 296: *the
  prose-vs-structured rule binds data the program COMPUTES ON; a type rendered
  for a human or a log is not that.* The commit notes this resolved an open
  question *"in the opposite direction from the orchestrator's instinct, on
  better grounds."*
- **Acceptance = the DoS probe inverted**, both tiers:
  `"thread attacker BAD => MALFORMED at [\"items\" \"[0]\"] expected=:wat::core::String got=Integer"` /
  `"thread victim good => Ok"`, and the same for process.
- **And the commit says the hole is still open.** Verbatim:
  *"⚠ THE DoS REMAINS LIVE FOR EVERY SERVICE THAT HAS NOT OPTED IN — which is all
  of them."* `probe-arc278-wire-dos-service-killed.wat` is kept reproducing the
  kill unchanged, deliberately, as the before/after pair. Floor 4175/0.

### 4. 21:30 — `b9d61bd67`, Stone 2: the knob is annihilated

The builder read the knob and refused it (quote §5.3). The commit's own
self-assessment is worth quoting in the post: *"The orchestrator's Stone-1 brief
created it by scoping the sweep away and pre-authorizing a STOP on the cascade;
**that brief was the defect, not the rider's work.**"*

What landed:

- `src/types.rs` — `:RequestMalformed` is **checker-forced** on every serviceable
  op-Response, same block/site/error as ruling A's `:RequestTooLarge`. Built by
  *parsing* the canonical spelling so `Vector<String>` and `(Vector String)`
  compare equal (new lock test). Still live at today's HEAD:
  `src/types.rs:2607` (`RM_VARIANT`), `:2843`, `:6600`.
- `wat/service.wat` — the clause parse, the `:all`/`:none` read, the macro-error
  and the `if` in `guarded-arm` are **deleted**. *No knob, no default, no escape
  hatch.*
- `wat-scripts/fixes/mandate-request-malformed.wat` — the recorded migration,
  written in wat, rewriting wat. Dry-run + diffed before applying; **idempotent**
  (re-run across all 109 paths, diffstat byte-identical). It discovers
  **structurally**: an enum is a ruling-A op-Response *iff it carries
  `:RequestTooLarge`*; a match needs the arm *iff it already faces
  `::RequestTooLarge`*. Arm bodies are decided from the RTL arm's own body —
  propagation for a service-to-service consumer (so it cannot swallow a
  downstream shape refusal) or terminal `assertion-failed!`. Keying on the AST
  leaves the string `"RequestTooLarge"` byte-untouched inside string literals.
- **299 sites across 109 files** (175 enum declarations + 124 caller arms). *"A
  first sweep with `--include="*.wat"` missed 6 `.wat.bad` fixtures; the checker
  named them"* — a nice small instance of impose-the-check-and-read-the-screams.
- **Rotted arm #2** — the `HashMap`/`HashSet` "not yet supported" stub.
  Unconditional generation made it refuse **well-formed production traffic**:
  `Store::PutRequest` → `StoredRow.index-keys <- HashMap<String,IndexKey>`, so
  every journal write came back `RequestMalformed` at
  `["rows" "[0]" "index-keys"]` — **29 of 36 first-run failures.** Implemented,
  not exempted. The commit's own line: *"STOP-1 was for a GENUINELY
  un-validatable type; an arm nobody wrote is not that."*
- **A hand-fix that is the same DoS one tier up**, and this is a good beat:
  `wat/query.wat`'s `sift-rules` propagates `RequestTooLarge` through an
  *unquoted* head (`~resp-rtl-kw`) which the codemod cannot read structurally, so
  it fell to the terminal `assertion-failed!` arm — **which would kill that
  service on a downstream shape refusal.** Caught and given `resp-rm-kw` +
  propagate.
- **Perf, measured not asserted** (stash → build → time → restore): the
  `every_wat_scripts_file_loads` gate went **25.5s → 29.0s isolated (~14%)** —
  the cost of `edn::validate` on every request **including every `println`,
  because stdio is a defservice, so printing is a service call.** Under full-floor
  contention it hit the old 90s kill (measured at 88.085s — two seconds of
  margin), which is what prompted the `.config/nextest.toml` change in the same
  commit: warn 120s / kill 240s, plus `priority = 100` so the gate starts in the
  first wave and overlaps the other ~4100 tests instead of trailing them into the
  most contended moment.
- **Incidental, reported not papered over:** a service `Handle` bound in a `let`
  is dropped before the let's tail body evaluates, so a request issued from tail
  position returns `Closed`. Reproduced on both tiers. (This is the thread that
  the TCO false alarm grew out of — see §4b.)
- The result, same probe file, same day:
  `"attacker BAD => MALFORMED at [\"items\" \"[0]\"] …"` / `"victim good => Ok"`.
  Floor 4178/0.

### 4b. The false alarm, correctly dismissed — the "TCO bug" that was not one

From `753b1b9c2` and its `REALIZATIONS.md` entry (the far-side note added by that
commit, `docs/arc/2026/06/278-rules-engine/REALIZATIONS.md`):

Late in the run the apparatus reported *"an actual bug in TCO, latent since near
the start."* The builder refused it (quote §5.5). The apparatus then agreed, and
the note states the resolution:

> The reap at a tail transfer is **TCO and RAII composing CORRECTLY.** TCO means
> the frame is gone; arc 259 S2d makes RAII teardown deliberate doctrine —
> guarded by a hinge test that **hangs forever** if drain-before-join stops
> firing — and a resource bound but not carried forward is therefore reaped.

The probe that "found" it *bound an admin `Handle` and immediately tail-called
out of its scope* — **a form nobody writes**, as the builder identified:
*"admin things just stay bound in the 'main' fn and the clients are sent off to
do work."*

Three things survive the detour, and the notes say so explicitly:

1. **The false `Closed`** — a reap reports `RecvOutcome::Closed`, which R53
   reserves for a genuine clean EOF. Even a bad form deserves an honest failure,
   not a wrong one.
2. **`Handle` bundles admin + address** — `{handle <- Peer'<Admin,Status>,
   addr <- Address'<Op,Reply>}`. To hand out a client address you must hold admin
   authority. An **ocap separation failure** (authority to USE ≠ authority to
   CONTROL), and *it is what invites the bad form.* A design question, not a bug.
3. **DROPPED: the `Peer'` liveness-claim field** — *"it would make a bad form
   work instead of making it not-arise."*

And the hard lesson that produced the escalation, kept visible in the record:

> A `grep 'impl Drop'` **misses `impl<I,O> Drop`** — the generic impl at
> `src/kernel/peer.rs:146` WAS the mechanism, and the apparatus asserted "there
> is no Drop on the Handle" from that bad grep, which is what sent the builder's
> ruling off a cliff.

Plus: *"Relaying subagent findings in your own voice, faster than the builder can
audit, is poison"* — three forwarded findings were wrong. And the rule that
should have stopped it: *"A probe that provokes a surprising result from a form
nobody writes is not a finding. Ask 'who writes this?' BEFORE escalating."*

**Why this belongs in the post, not a footnote:** on the same day, the same
apparatus found a real vulnerability and manufactured a fake one, and only one of
them survived contact with the question *who writes this form?* The DoS probe
sends a frame **any client can send**. The TCO probe wrote a form **nobody
writes**. That distinction — *is this reachable by someone who is not you?* — is
the whole difference between a finding and an artifact, and it is exactly the
distinction the DoS turns on (the wire is reachable by an arbitrary caller; the
trusted-wire premise assumed it was not).

### 5. 22:36 — `753b1b9c2`, the curare: the law is written down

Floor 4163 → 4178 across the run. The generalization, verbatim:

> **THE DURABLE LESSON:** nearly every find was a wall that existed but could not
> be turned on, so it rotted unobserved — the write-only derive, TWO dead arms in
> `edn_to_typed_value`, the eight hardcoded opaque paths, 11 vacuous gates.
> **Walls need traffic or they stop being walls.**

---

## The four instances of the law — ALL FOUR GROUNDED

| # | The wall | Where it rotted | Grounding |
|---|---|---|---|
| 1 | **The write-only derive** | `:wat::core::Span` had **no decode schema at all** — its wat-reader derive is write-only `ToEdn` — so **no error's `:location` could ever STRICT-decode.** Hand-registered alongside `:wat::kernel::Location`. | `b24450166` (2026-07-25 14:42, *"296 stone D (D3): annihilate the startup-error string-wrap"*), body §"The prerequisite bug found on the way". Same commit names the root: `#[derive(Edn)]`'s `rust_type_to_wat_path` (`crates/wat-to-edn-derive/src/lib.rs:179-196`) maps only 6 scalars and hard-rejects every generic. |
| 2 | **Two dead arms in `edn_to_typed_value`** | (a) the `Nature::Struct` narrowing — would have rejected **every `defrecord`**, i.e. every request. (b) the `HashMap`/`HashSet` "not yet supported" stub — refused **29 of 36** first-run journal writes. | (a) `0efaa5b7a` diff, `src/edn_shim.rs:1876-1899`; predates 293.2b — see the refutation section. (b) `b9d61bd67` diff, `src/edn_shim.rs:1988-2048`. |
| 3 | **The eight hardcoded opaque paths** | `validate_aggregate_containment` (`src/check.rs:14213`) *works* — `IOWriter` in a record field is rejected, and it sees through type parameters. But `is_pure_type` (`src/check.rs:14097`) knows Rust opaques as **eight hardcoded path strings**; anything absent falls to `None => true`, "portable by convention". **Every `#[wat_dispatch]` opaque minted since is invisible.** | `7deed6a55` (2026-07-25 18:13). Counted in the source at `7deed6a55:src/check.rs`: `wat::kernel::ChildHandle`, `wat::io::IOReader`, `wat::io::IOWriter`, `wat::holon::{OnlineSubspace, Reckoner, Engram, EngramLibrary, Hologram}` — **exactly 8.** Proven with three probes, all exit 0 where they must be exit 3 — including `(defrecord :probe::Smuggle [c <- :wat::cache::Lru<String,i64>])`, **the substrate's own Stone-1 primitive from six hours earlier.** Recorded, not fixed — builder: *"i'm not chasing it now."* |
| 4 | **11 vacuous gates** | See §3 beat 1. 378 sites lit at once; 11 gates proving nothing; one of them the sqlite gate **certifying a shipped stone**; 5 of the 11 came through a channel the brief never named, and **2 of those 5 were caught by the wall at runtime, not by the audit.** | `91bbb8cd3`, body + `src/freeze.rs:732-784`. |

**The instance the day itself did not list, and probably should have:** the wall
that could not be turned on *and killed a service* — the tag-driven decode. Same
class, worst consequence.

---

## The security mechanism, precisely

Write this section with the mechanism, not the summary. A reader should leave
understanding the **vulnerability class**, which is: *a declaration trusted as
though it had been enforced, at a boundary whose name asserted the trust.*

### The frame

```clojure
#dos.Bag/PutRequest {:items [1 2 3]}        ;; declared: items <- Vector<String>
```

It is **well-formed EDN**. It carries the **correct tag** — the service's own
`PutRequest` type. The only thing wrong with it is that the elements are
integers where the declaration says strings. It passes every check the service
had.

From `wat-scripts/scratch-pad/probe-arc278-wire-dos-service-killed.wat`
(`287014763`), the handler is three lines and correct:

```clojure
(put [s req]
  ;; uses the field AT ITS DECLARED TYPE — correct against the declaration
  (:wat::service::Outcome::Reply s
    (:dos::Bag::PutResponse::Ok
      (:wat::core::string::length
        (:wat::core::nth (:dos::Bag::PutRequest/items req) 0)))))
```

`string::length` on an integer. **There is no bug in the handler.** The handler
did the one thing a declaration entitles it to do: believe the declaration.

### Why nothing caught it — both tiers, two different reasons

- **Thread tier: no decode at all.** `ReactorClass::InMemory`
  (`src/runtime.rs:27585-27591`) passes the `Value` through crossbeam
  **verbatim**. There is no serialization boundary to check at.
- **Process tier: the decode is tag-driven, not target-driven.**
  `reconstruct_record` (`src/edn_shim.rs:2751-2765`) uses the declared fields for
  **names and order only** — read at `287014763^`, the loop is:
  `for (fname, fty) in def.fields.iter()` → look the key up by name →
  `edn_to_value_caps(fv, …)` (**untyped**, decodes whatever is there) →
  `rewrap_option_field(fty, inner)`. **The declared `fty` reaches
  `rewrap_option_field` and nothing else. It is never compared to the decoded
  value.** Verified line by line.
- The only inbound inspection was the `:max-request-bytes` **size** guard.

The function is named **`decode_trusted_wire`**, and that is the whole class in
one identifier. The commit says it exactly right: *"Honest when both ends are
ours; false by construction for a `defservice` any client can `connect'` to, and
the substrate's stated end goal is fully distributed."* The name recorded a
premise that had quietly stopped being true.

### Why the service died for ALL clients, not just the attacker

This is the question the post must answer, and the answer is architectural. A
`defservice` is **one serve loop over one durable state**, multiplexing every
connected client through a `select'`. There is no per-request isolation boundary
— no worker, no thread-per-connection, no supervisor restarting a crashed
handler. The handler runs *inside* the loop. When `string::length` detonated, the
raise propagated out of the handler, out of the dispatch arm, out of `serve` —
and **the locus died.** The attacker's own peer reports `LOST (peer gone)`, and
the probe then proves the severity by having a **second, innocent client connect
after the bad frame**:

```
"attacker good  => Ok"
"attacker BAD   => LOST (peer gone)"
victim: connect REFUSED — service is GONE
```

One frame from any caller, no privilege required, and the whole service is gone
for everyone. That is a denial of service, not a crash.

### What sanitization changed — and the one design choice that made it cheap

The fix went in **exactly where the size guard already was**: `guarded-arm` in
`wat/service.wat` (~`:1060`), which is **post-decode, inside the generated
dispatch arm, before the handler.** That placement is the whole reason the fix is
small, and it is what a Rust-side decode fix could not have bought — *the thread
tier never decodes*, so a decoder fix covers exactly half the system.

The generated form (from `0efaa5b7a`'s `wat/service.wat` diff):

```clojure
(:wat::core::match (:wat::edn::validate ~req-binder ~req-ty-kw)
  (:wat::edn::Validation::Valid ~outcome-match)
  ((:wat::edn::Validation::Invalid ~mpath-sym ~mexp-sym ~mgot-sym)
    (:wat::core::match (:wat::kernel::send' (:wat::core::nth selectables idx)
        (~reply-variant-kw (~rm-ctor-kw ~mpath-sym ~mexp-sym ~mgot-sym)))
      (:wat::kernel::SendOutcome::Sent   (~serve-name self l selectables state))
      (:wat::kernel::SendOutcome::Closed (~serve-name self l selectables state))
      ((:wat::kernel::SendOutcome::Lost _c) (~serve-name self l selectables state)))))
```

Read the three arms of the inner match: **whatever happens to the refusal —
sent, client already gone, client lost — the loop recurses into `serve` with
state unchanged.** The handler never ran. The refusal itself cannot kill the
service either. That is the same discipline the size guard already used, reused
verbatim.

The **whitelist is authored code that already existed**: `req-ty-kw` is built by
string-interpolating the S1 convention `<proto>::<Op>Request` — the same
convention `op-methods` uses to build the client method's `req` param. *One
convention, two consumers.* Nothing new is declared anywhere.

The refusal a client gets is a **matchable per-op variant**, not a death:
`:RequestMalformed [path <- Vector<String> expected <- String got <- String]`
(shape locked in `src/types.rs:2843`, still there at HEAD), carrying the offending
coordinate — `["items" "[0]"] expected=:wat::core::String got=Integer`.

**Why per-op and not one global refusal:** Phase 0 established that the only
existing client-reaching rail, `<S>::Reply::Failed[cause]`, is mapped by
`recv_outcome_from_decoded` onto `RecvOutcome::Lost` — the **death rail**. A
client could not distinguish "you sent me garbage" from "I died." Making the
refusal a variant on the op's own Response enum is what makes it *matchable*,
and that is what forced the 299-site sweep.

### The ladder, if the post wants extirpare's frame

- **Rung 1 (convention):** "don't send malformed frames." That was the state of
  the world; `decode_trusted_wire` was that convention, written as a function
  name.
- **Rung 2 (check at the boundary):** Stone 1 — the guard exists and can be
  turned on per service. **The builder refused to stop here**, because a knob
  whose off-position is "crash on bad input" is not a choice.
- **Rung 3 (no form for the mistake):** Stone 2 — the checker *forces*
  `:RequestMalformed` on every serviceable op-Response (`src/types.rs`), the
  generator emits the guard for every op of every service unconditionally, and
  the clause that could have disabled it **no longer parses.** A service that
  crashes on a malformed request is no longer expressible.

---

## Verbatim builder quotes, with locations

Method note, because the brief's grep was calibrated for a different form: the
pattern `'^\s*>?\s*\*?\*?(the )?builder[,:]'` over
`--since=2026-07-20 --until=2026-07-30` returns **3** hits. The dominant forms in
this repo are `Builder-ruled: "…"`, `Builder: "…"`, `Builder's ruling: "…"` and
inline `the builder: "…"`; case-insensitive `builder` over the same window
returns **122** lines. The eight below are the ones inside this strand and the
commits it cites — harvested verbatim, hyphens and all, with hash + section.

**5.1 — the ruling that named the work.** `287014763`, body ¶1, and again as the
epigraph of `DESIGN-request-malformed-input-sanitization.md`:

> "we must have a request-malformed ... the whitelist of what we accept is
> already explicit - a bad caller (malicious or dumb) cannot crash anything."

The commit adds, and this is the framing beat: *"His framing, and it is the right
one: INPUT SANITIZATION at a trust boundary, not 'type enforcement'."*

**5.2 — the same ruling, re-quoted at the head of Stone 1.** `0efaa5b7a`, body ¶1
(*"Builder-ruled on seeing the DoS proven:"*) — identical text. Worth noting for
the post that the ruling is carried forward verbatim into each stone rather than
paraphrased.

**5.3 — the knob is refused.** `b9d61bd67`, body ¶1:

> "annihilate it - who the fuck would opt into crashing on bad input - why would
> this ever be an option to consider."

**5.4 — the vacuous-gate pivot.** `91bbb8cd3`, body ¶1
(*"Builder-ruled on discovery:"*):

> "we pivot and address this - now ... i do not care what amount of work is
> necessary for this - this behavior is unacceptable - what is the type check
> that sets all heretics ablaze in one shot?"

*(The last clause is the commit's own title in the builder's voice — "one shot"
is literally what `#[must_use] DeftestOutcome` delivered: 378 sites in one
compile.)*

**5.5 — the TCO false alarm, killed.** Two forms of the same ruling. `753b1b9c2`
body:

> "we're trying to solve a problem that isn't one... TCO 'being broken' for all
> of wat's life is hard to trust"

and the fuller version in the `REALIZATIONS.md` far-side note added by the same
commit:

> "i feel like we're trying to solve a problem that isn't one… TCO 'being broken'
> for like all of wat's life is very not predictable and hard to trust"

**5.6 — who writes this form.** Same `REALIZATIONS.md` note:

> "admin things just stay bound in the 'main' fn and the clients are sent off to
> do work."

**5.7 — the trust cost.** `753b1b9c2` body, and again in the note:

> "i have lost /all trust/ in you"

full form in `REALIZATIONS.md`:

> "i have lost /all trust/ in you… terrified you are prompt injecting poison."

**5.8 — the ocap read.** `REALIZATIONS.md` note, on `Handle` bundling
admin+address:

> "clients and admins must not intermingle at all."

**5.9 — the opaque-paths find, recorded not chased.** `7deed6a55`, body ¶1:

> "did you find a legit flaw in our enforcement?" — yes. "i'm not chasing it now"

**5.10 — the third generics fix, called cold.** `REALIZATIONS.md` note:

> "generics being wiped from symbols… another string parser thing."

*(Adjacent strand — the parametric-defservice work. Include only if the post
wants the day's texture; it is not this unit's subject.)*

**Two more from the day, if the post needs the register outside the strand:**
`b24450166` — *"annihilate this - we are meant to be edn all the way down -
masking it in a string is unacceptable."* (this is the write-only-derive
commit, instance #1 of the law). `a86f521ce` — *"all the cache tooling moves -
wat needs it - not having these in the core distribution of wat is unacceptable
... it is not a carbon copy - it is a correct impl of what they need to be in
modern wat."*

**Note the pattern for `consonare` rule 11:** every single stone in this strand
opens with a builder ruling, and in two cases (5.3, 5.4) the ruling *changed the
plan the apparatus had written*. Stone 2 exists **because the builder rejected
Stone 1's scoping**, and the commit says so about its own author: *"that brief
was the defect, not the rider's work."* This is not a solo substrate report with
quotes bolted on; the decisions are the builder's and the record says so at every
stone. Write it that way.

---

## The substance test — run by me

Strip every hash, date, file path and line number. What is left that `git log`
does not hold?

**Holds up:**

1. **A declaration is not an enforcement, and a *name* can carry the premise that
   they are the same.** `decode_trusted_wire` was accurate when written and
   became a lie without changing a character. The class generalizes past `wat`
   entirely: every schema-shaped system has a boundary where the schema is used
   for *layout* and assumed for *validity*, and the two are one function call
   apart.
2. **A caller is not traffic.** This is the sharpened law, and it is mine, from
   the refutation — the record says "zero callers since arc 258" and the disk
   says the walker had a live production caller for four weeks while being
   record-blind. A branch nothing exercises rots identically whether or not the
   function around it is called. This is *why* "walls need traffic" is the right
   phrasing and "dead code rots" is not.
3. **The fix that costs nothing to build can still cost 299 sites to install.**
   The validator was already written. The whitelist was already declared. Zero
   lines of validation logic were authored — `:wat::edn::validate` is a wrapper.
   And it still took a codemod across 109 files, because *making the refusal
   matchable by the client* is what makes it useful, and a matchable refusal is a
   variant on an enum every caller matches. Free to invent, expensive to deliver.
4. **Turning a wall on is how you discover it is broken.** Two dead arms surfaced
   in the same walker in two hours — one that would have rejected every request,
   one that refused 29 of 36 real writes — and neither was findable by reading.
   The screaming was the instrument. Cf. imposing the check rather than
   surveying for the worklist.
5. **A knob whose off-position is the vulnerability is not a knob.** Stone 1
   shipped a `:sanitize-requests :none` default and documented it as
   transitional; the builder deleted the whole axis an hour later. The general
   form: an option is only an option if both positions are defensible.
6. **On the same day, the same apparatus found a real vulnerability and
   manufactured a fake one**, and the discriminator was one question — *who
   writes this form?* The DoS probe sends a frame any client can send. The TCO
   probe wrote a form nobody writes. The question is the same one the DoS turns
   on: is this reachable by someone who is not you?
7. **A vacuous gate is worse than a missing one**, because it spends the
   credibility of a green check. Eleven of them, one certifying a shipped stone.
   And the fix was not an audit — it was deleting the type that made the mistake
   expressible (`Result` → `#[must_use] DeftestOutcome`), which enumerated 378
   sites *wider than the hand-count* and caught 2 more at runtime that the static
   audit had missed.
8. **The cost is honest and worth stating:** ~14% on the load gate, because every
   `println` is a service call and now every service call validates. Measured
   (stash → build → time → restore), not asserted, and the nextest budget was
   moved in the same commit rather than the measurement being quietly dropped.

**Does not hold up without the log** (do not build the post on these): the exact
site counts, the floor numbers, the commit ordering. Useful as evidence, not as
argument.

---

## Open questions and gaps

1. **The arc-258 attribution is now in three places in the tree** — the two
   commit bodies and, worse, as a **source comment** in `src/edn_shim.rs` (both
   the Stone-1 record arm and the Stone-2 HashMap arm). It is wrong. This is
   itself an instance of a class the project has written down (a comment shipping
   a claim as a fact). **Flag it to the builder; I did not edit `wat-rs`.** The
   correct sentence is: *the last production caller was `readln' -> :T`'s
   coercion, deleted 2026-07-22 by `1212c9ae6`; arc 258 Stone 258.5b deleted the
   `recv'`/`select'` caller on 2026-06-16.*
2. **I did not run the floor.** Every floor number here (4173 / 4175 / 4178 /
   4169 / 4163) is quoted from a commit body that says the orchestrator weighed it
   by its own `--release`. I did not re-run `scripts/floor.sh`. If the post
   quotes a number, it is quoting the record, and should say so.
3. **I did not re-run the DoS probe.** The before/after outputs are quoted from
   commit bodies and the preserved probe file. `probe-arc278-wire-dos-service-killed.wat`
   is still in `wat-scripts/scratch-pad/` — the post *could* be written on a live
   re-run of the sanitized version, which would be stronger. Builder's call
   whether that is worth the cycle.
4. **The `Store::PutRequest` / journal-write breakage is a 29-of-36 number I did
   not independently reproduce** — it is from `b9d61bd67`'s body. It is the most
   vivid number in the whole strand and it deserves a citation stronger than a
   commit body if the post leans on it.
5. **Did the record-blind walker ever actually break a `readln'` user?** I proved
   the *structural* fact (live caller, record-blind branch, four weeks). I did
   **not** find a corpus site doing `(readln' cap -> :SomeRecord)`. If one exists
   it is a live bug that shipped for four weeks; if none exists, that is precisely
   why nobody noticed. Either finding sharpens §"a caller is not traffic" — worth
   ten minutes with the corpus before drafting.
6. **The eight-opaque-paths hole was recorded, not fixed** (builder: *"i'm not
   chasing it now"*). At today's HEAD I have not checked whether it was later
   closed — `1948eaa04` (2026-08-08, *"a registered Rust opaque READS IMPURE, and
   it enrolls itself"*) looks like the closure but I did not verify it. If it
   was closed, that is a good final beat for the post: the law found it, and the
   fix was enrollment-by-construction rather than a longer hand-list.
7. **Adjacency, noted and not narrated.** The same day carries parametric
   `defservice` (`7336464e9`, `10107da93`, `9a5e65190`, `1ac85d969`), cache
   Stone 1 (`a86f521ce`), arc 170's stdio-as-defservice close (`eae450014`,
   `15f8f08fe`), and three 296 NOTEs. The DoS strand is *interleaved* with them —
   `7deed6a55` (instance #3 of the law) sits between the parametric commits and
   was found *while grounding cache Stone 2*. The post should say the day was
   busy and the incident was not the plan; it should not narrate the other work.
   One genuinely load-bearing adjacency: **cache Stone 1's own primitive
   (`:wat::cache::Lru`) is one of the three probes proving the opaque-paths
   hole** — the substrate's six-hour-old code smuggled through its own
   containment wall. That is a beat.
8. **Slug.** I used `uiol-006-dos-incident` as given. Series placement, title and
   song are the builder's.
