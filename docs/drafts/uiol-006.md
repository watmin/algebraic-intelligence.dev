<!--
TITLE PROPOSALS — builder's call. The frontmatter title below is a PLACEHOLDER.

  1. "A Caller Is Not Traffic"          — the sharpened law; my pick
  2. "The Name Was the Premise"          — decode_trusted_wire, accurate when written
  3. "Walls Need Traffic"                — the day's own summary, verbatim

No song-drop proposed. That is always yours.
-->
---
title: "A Caller Is Not Traffic"
description: "July 25, one evening: a wat service declares the exact shape of every request it accepts, and nothing had ever checked it. One frame of well-formed EDN with a wrong-typed body under a correct tag killed the service for every client. The fix authored zero lines of validation logic — both halves already existed — and turning the wall on surfaced two arms that had rotted inside it, one that would have rejected every request and one that refused 29 of 36 real writes."
covers: 2026-07-25
written: 2026-09-07
backfill: true
sidebar:
  order: 6
---

Backfill: this covers the evening of 2026-07-25 and was written on 2026-09-07 from the commit bodies, the design doc, the `REALIZATIONS.md` far-side notes, and the probe files, all still in the tree. The floor counts quoted below are the record's, weighed by the orchestrator at the time; they were not re-run for this post. The day carries 25 commits — parametric `defservice`, the cache LRU, arc 170's stdio close. Those are not this post. This is one strand of five commits across about two hours and forty minutes, and it was not the plan: it ends in a 299-site codemod across 109 files and a knob deleted an hour after it shipped.

A `wat` service declares the exact shape of every request it accepts. The whitelist is authored code: each op has a `<Op>Request` record, written by hand, in the source. On July 25 the substrate found out that nothing had ever checked it.

## One frame, every client (19:53)

The frame is three tokens long:

```clojure
#dos.Bag/PutRequest {:items [1 2 3]}        ;; declared: items <- Vector<String>
```

Well-formed EDN. Correct tag — the service's own `PutRequest` type. The only thing wrong with it is that the elements are integers where the declaration says strings. It passes every check the service had, because the only inbound inspection was the `:max-request-bytes` **size** guard shipped four days earlier (`023a15c`). The size question had a wall. The shape question had none.

The handler, from `probe-arc278-wire-dos-service-killed.wat`, is correct:

```clojure
(put [s req]
  (:wat::service::Outcome::Reply s
    (:dos::Bag::PutResponse::Ok
      (:wat::core::string::length
        (:wat::core::nth (:dos::Bag::PutRequest/items req) 0)))))
```

`string::length` on an integer. There is no bug in the handler. It did the one thing a declaration entitles it to do: believe the declaration.

Nothing caught the frame, and each tier had its own reason. The **thread tier does not decode at all** — `ReactorClass::InMemory` (`src/runtime.rs:27585-27591`) passes the `Value` through crossbeam verbatim; there is no serialization boundary to check at. The **process tier decodes tag-driven, not target-driven**: `reconstruct_record` (`src/edn_shim.rs:2751-2765`) walks `for (fname, fty) in def.fields.iter()`, looks the key up by name, hands the payload to `edn_to_value_caps` — untyped, decoding whatever is there — and passes `fty` to `rewrap_option_field`. The declared field type reaches the `Option` rewrapper and nothing else. It is never compared to the decoded value. The declaration was being used for field **names and order**, and assumed for validity, and the two are one function call apart.

The decoder's name is `decode_trusted_wire`, and that is the whole class in one identifier. From `2870147`: "Honest when both ends are ours; false by construction for a `defservice` any client can `connect'` to, and the substrate's stated end goal is fully distributed." The name was accurate when written and became a lie without changing a character.

Then the severity. A `defservice` is one serve loop over one durable state, multiplexing every connected client through a `select'`. There is no per-request isolation — no worker, no thread-per-connection, no supervisor restarting a crashed handler. The handler runs inside the loop. When `string::length` fired, the raise propagated out of the handler, out of the dispatch arm, out of `serve`, and the locus died. `2870147` landed the measurement and touched no production code; the probe proves the blast radius by connecting a second, innocent client after the bad frame:

```
"attacker good  => Ok"
"attacker BAD   => LOST (peer gone)"
victim: connect REFUSED — service is GONE
```

One frame from any caller, no privilege required, and the service is gone for everyone. That is a denial of service, not a crash.

## Nothing was authored (20:30)

The builder's ruling, on seeing it proven:

> "we must have a request-malformed ... the whitelist of what we accept is already explicit - a bad caller (malicious or dumb) cannot crash anything."

The commit takes the framing from him and says so: "INPUT SANITIZATION at a trust boundary, not 'type enforcement'."

Stone 1 (`0efaa5b`, 20:30) grounded the obvious paths before building. Could an existing rail carry a refusal back to the client? No: `ServiceEvent::{Malformed,Rejected}` are owner-side only, and the one protocol-tier rail that does reach the client, `<S>::Reply::Failed[cause]`, is mapped by `recv_outcome_from_decoded` onto `RecvOutcome::Lost` — the death rail. A client could not distinguish "you sent me garbage" from "I died". That is why the refusal had to be a per-op variant, and it is what would force a 299-site sweep. Could `:wat::core::conforms?` do the checking? No: its `TypeDef::Aggregate` arm is a nominal identity check that never recurses into fields, proven side by side in the probe output — `"bad conforms? => true"`.

What did work was already in the tree. `:wat::edn::validate` was minted as a thin wrapper — `value_to_edn_with` into `edn_to_typed_value` — and **no validation logic was authored**. The whitelist was already written too: `req-ty-kw` is built by string-interpolating the S1 convention `<proto>::<Op>Request`, the same convention `op-methods` already uses to build the client method's `req` parameter. One convention, two consumers, nothing new declared.

The guard went exactly where the size guard already sat: `guarded-arm` in `wat/service.wat`, post-decode, inside the generated dispatch arm, before the handler. That placement is why the fix is small, and it is what a Rust-side decoder fix could not have bought — the thread tier never decodes, so a decoder fix covers half the system.

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

The inner match's three arms — sent, client already gone, client lost — all recurse into `serve` with state unchanged. The handler never ran, and the refusal cannot kill the service either. The client gets a matchable per-op variant, `:RequestMalformed [path <- Vector<String> expected <- String got <- String]`, carrying the offending coordinate: `["items" "[0]"] expected=:wat::core::String got=Integer`.

A four-questions ruling settled that payload's shape opposite the orchestrator's instinct: `path` stays structured because segments are data the program computes on, but `expected`/`got` are Strings because `got` is not a type and cannot be made one — the value came off an untyped wire with no declaration, so its honest datum is its EDN shape, and structuring it would fabricate information.

Stone 1 shipped with the hole open, in its own words: "⚠ THE DoS REMAINS LIVE FOR EVERY SERVICE THAT HAS NOT OPTED IN — which is all of them." It carried a transitional `:sanitize-requests :all | :none` knob, default `:none`, because unconditional generation would demand `:RequestMalformed` on every op-Response — 108 files, ~301 sites — a STOP for a one-service stone. The kill probe was deliberately kept reproducing the kill unchanged, as the before/after pair.

Stone 1 had tried to avoid the choice. It built a verb, `:wat::runtime::variant-names-of`, to gate generation on whether a response enum already declares `:RequestMalformed` — conditional generation, no knob and no sweep — and then deleted it rather than leave scaffolding. It cannot work: `src/freeze.rs:618-619` runs `expand_all` before `register_types`, so at macro-expand time the registry holds nothing from the loading program, not even a surface declared three forms up in the same file. Grounded, not assumed — the verb was built, and it failed on `:wat::kernel::StdOut::WriteResponse`.

## The knob does not survive an hour (21:30)

> "annihilate it - who the fuck would opt into crashing on bad input - why would this ever be an option to consider."

Stone 2 (`b9d61bd`, 21:30) exists because the builder rejected Stone 1's scoping, and the commit says so about its own author: "The orchestrator's Stone-1 brief created it by scoping the sweep away and pre-authorizing a STOP on the cascade; that brief was the defect, not the rider's work."

`:RequestMalformed` became **checker-forced** in `src/types.rs` on every serviceable op-Response — same block, same site, same error as `:RequestTooLarge` — built by parsing the canonical spelling so `Vector<String>` and `(Vector String)` compare equal. The clause parse, the `:all`/`:none` read, the macro-error and the `if` in `guarded-arm` were deleted. The migration is `wat-scripts/fixes/mandate-request-malformed.wat` — wat rewriting wat, dry-run and diffed first, idempotent across all 109 paths. It discovers structurally, not textually:

- **An enum is a ruling-A op-Response** iff it carries `:RequestTooLarge`
- **A match needs the arm** iff it already faces `::RequestTooLarge`
- **Arm bodies are decided from the RTL arm's own body** — propagating for a service-to-service consumer, terminating in `assertion-failed!` otherwise

Keying on the AST left the string `"RequestTooLarge"` byte-untouched inside string literals. **299 sites across 109 files** — 175 enum declarations, 124 caller arms. A first sweep with `--include="*.wat"` missed six `.wat.bad` fixtures and the checker named them.

One site the codemod could not see is the same DoS one tier up. `wat/query.wat`'s `sift-rules` propagates `RequestTooLarge` through an unquoted head (`~resp-rtl-kw`), which cannot be read structurally, so it fell to the terminal `assertion-failed!` arm — which would have killed that service on a downstream shape refusal. Hand-fixed to propagate.

The cost was measured, not asserted — stash, build, time, restore. The `every_wat_scripts_file_loads` gate went **25.5s → 29.0s isolated, about 14%** — the price of validating every request, including every `println`, because stdio is a defservice and printing is a service call. Under full-floor contention it hit 88.085s against the old 90s kill, two seconds of margin, which is why `.config/nextest.toml` moved in the same commit to warn 120s / kill 240s with `priority = 100`, so the gate starts in the first wave instead of trailing into the most contended moment.

No knob, no default, no escape hatch: a service that crashes on a malformed request is no longer expressible.

## Turning the wall on is how you find out it is broken (21:30 onward)

The validator had been sitting in the tree unused, and two of its arms had rotted unobserved. Neither was findable by reading.

**Arm one, found on the way in.** `edn_to_typed_value_inner`'s aggregate dispatch was narrowed to `Nature::Struct`. Every `<Op>Request` is a `defrecord` — so the validator, switched on as written, would have **rejected all traffic**. Fixed to accept `Struct|Record`, with `coerce_struct_path` rebuilding using the declared nature, because a record rebuilt as a Struct would lie about its purity (`Nature::is_pure`: Struct permits impurity, Record guarantees it). `HolonRecord` was deliberately left out — its wire form is a `#wat-edn.holon/Bind` hologram this field-map walk cannot honestly rebuild.

**Arm two, found by production traffic.** The `HashMap`/`HashSet` arm was a "not currently supported" stub. Unconditional generation pointed it at well-formed real traffic: `Store::PutRequest` carries `StoredRow.index-keys <- HashMap<String,IndexKey>`, so every journal write came back `RequestMalformed` at `["rows" "[0]" "index-keys"]` — **29 of 36 first-run failures**. It was implemented, not exempted: "STOP-1 was for a GENUINELY un-validatable type; an arm nobody wrote is not that."

## The correction: a caller is not traffic

The day's own summary, written into the curare commit (`753b1b9`, 22:36) — curare, the pass that keeps the record true — after a run that took the floor 4163 → 4178:

> **THE DURABLE LESSON:** nearly every find was a wall that existed but could not be turned on, so it rotted unobserved — the write-only derive, TWO dead arms in `edn_to_typed_value`, the eight hardcoded opaque paths, 11 vacuous gates. **Walls need traffic or they stop being walls.**

The commits explain the rot with a duration, and the duration is wrong. `2870147` says `edn_to_typed_value` had zero production callers "since arc 258 Stone 258.5b deleted its last one" — and that sentence was then written into `src/edn_shim.rs` as a source comment, twice, by `0efaa5b` and `b9d61bd`. It propagated three times and does not survive the disk. Stone 258.5b is `4b2d185`, 2026-06-16, and it deleted *a* caller — the `recv'`/`select'` coercion at `src/runtime.rs:23829`. Immediately after it, `src/services/verbs.rs:257` still calls the walker from `eval_kernel_readln_prime`, the body of `(readln' <cap> -> :T)`, coercing a parsed stdin line to its ascribed type. *That* caller died on **2026-07-22**, in `1212c9a`, when the `-> :T` ascription was annihilated. The validator was caller-free for **three days, not five weeks**, and the attribution to arc 258 is wrong in three places in the tree, one of them a comment in the source it describes.

The refutation is worth more than the claim it replaces, because the rot never needed the callers gone. The `Nature::Struct` narrowing is older than the collapse it was blamed on: `edn_to_typed_value_inner` handled `TypeDef::Struct` and never `TypeDef::Record`, verified at `0dab460^`, and arc 293's unify-2b translated that arm faithfully and mechanically into `TypeDef::Aggregate(a) if a.holder == Holder::Struct`. The collapse only re-expressed a blindness records already had — so the walker was record-blind for four weeks while it had a live production caller. Whether any corpus site ever wrote `(readln' cap -> :SomeRecord)` is unverified; if none did, that is precisely why nobody noticed. The second arm gives itself away in its own excuse — "Not currently supported as a readln target" — naming the live caller it was rotting under.

So the sharper form of the law is **a caller is not traffic**. A branch nothing exercises rots identically whether or not the function around it is called. That is the difference between "dead code rots", which is obvious, and what happened here, which is not.

## The other instances (14:42–18:13), and the one the day did not list

The curare names four. All four are on disk — the two dead arms above, and three more found earlier the same day, before the frame that killed the service.

The **write-only derive**: `:wat::core::Span` had no decode schema at all — its wat-reader derive emits `ToEdn` only — so no error's `:location` could ever STRICT-decode. Found while grounding something else (`b244501`, 14:42), on a ruling in the same register: "annihilate this - we are meant to be edn all the way down - masking it in a string is unacceptable."

The **eleven vacuous gates** (`91bbb8c`, 17:26) are the same law, two and a half hours before the DoS. The sqlite S1 gate's `(assert-eq n 1)` was mutated to `n 4242` — an assertion that cannot hold — and the test passed. `call_beside` returned `Result<Value, RuntimeError>`; a fired assertion lands a `Failure` in the returned `RunResult` while the evaluation still succeeds, so `Ok` came back regardless. `.is_ok()` answers "did it evaluate?" while every author who wrote it believed it answered "did it pass?" The builder's pivot:

> "we pivot and address this - now ... i do not care what amount of work is necessary for this - this behavior is unacceptable - what is the type check that sets all heretics ablaze in one shot?"

The one shot was deleting the type that made the mistake expressible: `call_beside` now returns `#[must_use] enum DeftestOutcome { Passed, Failed { failure }, DidNotRun { error } }`, whose must-use message reads "a deftest verdict that is not read is a gate that does not gate", and `RunResult` went record → enum for the same reason — a reason-free pass and a failure with an ignorable `Option` slot is what let the Rust side look away. Removing `Result` lit **378 sites in one compile**, wider than the hand-count, because the family included `.expect()`/`.expect_err()` and not just `.is_ok()`. The cost was not bugs shipped but certainty that was never earned: no assertion was weakened or tuned, and every previously-vacuous gate's assertions turned out to hold. Eleven gates proved nothing — one of them the sqlite gate certifying a shipped stone, five through a channel the brief never named, two of those five caught by the new wall at runtime rather than by the audit.

The **eight hardcoded opaque paths** (`7deed6a`, 18:13): `validate_aggregate_containment` works and sees through type parameters, but `is_pure_type` knows Rust opaques as eight hardcoded path strings, and anything absent falls to `None => true` — portable by convention, so every `#[wat_dispatch]` opaque minted since is invisible to it. Three probes exit 0 where they must exit 3, and one is `(defrecord :probe::Smuggle [c <- :wat::cache::Lru<String,i64>])` — the substrate's own cache primitive, landed six hours earlier that same day, smuggled straight through its own containment wall. Recorded, not fixed: "did you find a legit flaw in our enforcement?" — yes — "i'm not chasing it now." Whether a later commit closed it is not verified here.

The instance the day did not list is the tag-driven decode itself: same class, worst consequence — a wall that could not be turned on, and it killed a service.

## The one that was not real (22:36)

The same evening, the same apparatus reported "an actual bug in TCO, latent since near the start." The builder refused it:

> "i feel like we're trying to solve a problem that isn't one… TCO 'being broken' for like all of wat's life is very not predictable and hard to trust"

He was right. The reap at a tail transfer is TCO and RAII composing correctly: TCO means the frame is gone, arc 259 made RAII teardown deliberate doctrine, and a resource bound but not carried forward is therefore reaped. The probe that "found" it bound an admin `Handle` and immediately tail-called out of its scope — a form nobody writes:

> "admin things just stay bound in the 'main' fn and the clients are sent off to do work."

The escalation had a mechanical cause, kept visible in the record: `grep 'impl Drop'` **misses `impl<I,O> Drop`**, and the generic impl at `src/kernel/peer.rs:146` was the mechanism. The apparatus asserted "there is no Drop on the Handle" from that bad grep and forwarded it. Three forwarded findings were wrong, and the cost is on the record too:

> "i have lost /all trust/ in you… terrified you are prompt injecting poison."

Two things survived the detour rather than being dropped with it. The reap reports `RecvOutcome::Closed`, which is reserved for a genuine clean EOF — even a bad form deserves an honest failure rather than a wrong one. And `Handle` bundles `{handle <- Peer'<Admin,Status>, addr <- Address'<Op,Reply>}`, an ocap separation failure — authority to *use* is not authority to *control* — which is what invites the bad form in the first place: "clients and admins must not intermingle at all." A proposed `Peer'` liveness-claim field was dropped on the grounds that "it would make a bad form work instead of making it not-arise."

On one evening the same apparatus found a real vulnerability and manufactured a fake one, and one question separates them: "who writes this form?" The DoS probe sends a frame any client can send. The TCO probe wrote a form nobody writes. That is the same distinction the DoS itself turns on — the trusted-wire premise assumed the wire was not reachable by an arbitrary caller, and it was.

## Likely Contributions to the Field

- **A declaration used for layout and assumed for validity is a vulnerability class, and a function name can carry the premise.** `decode_trusted_wire` was accurate when written and became false without changing a character. This is not `wat`-specific: every schema-shaped system has a boundary where the declared type is consumed for field names and ordering while the decoded value is never compared against it, and the two are one call apart. The identifier at that boundary is where the stale premise tends to be written down.
- **A caller is not traffic.** A live call site that never exercises a branch leaves that branch exactly as rotted as no call site at all — proven here by a walker that was record-blind for four weeks *while* the `readln' -> :T` coercion called it every time a line came off stdin. This is why "walls need traffic or they stop being walls" is the right phrasing and "dead code rots" is not: rot is indexed by exercised branches, not by reachability.
- **A fix can be free to invent and expensive to install, and the expense is what the client gets.** Zero lines of validation logic were authored — validator and whitelist both already existed, and the guard was a wrapper dropped where the size guard already stood. It still cost a 299-site codemod across 109 files, because making the refusal matchable means a variant on an enum every caller matches. The cheap version, killing the connection, was already available and is exactly what a client cannot tell apart from a dead service.
- **Turning a wall on is the instrument that finds the wall broken.** Two dead arms surfaced in the same walker within two hours of first pointing it at real traffic: one that would have rejected every request, one that refused 29 of 36 real journal writes. Neither was reachable by reading. The screaming is the census.
- **An option is only an option if both positions are defensible.** A knob whose off-position is "crash on bad input" is not a choice; it was deleted an hour after it shipped, along with the clause that parsed it, so the disabled state has no form. One rung up the ladder: not a check that can be turned on, but a shape the mistake cannot be written in.
- **The discriminator between a finding and an artifact is reachability by someone who is not you.** Two probes on one evening — one proving a real DoS, one manufacturing a TCO bug — separated by the single question "who writes this form?", asked before escalation rather than after.
