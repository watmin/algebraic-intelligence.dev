## 2026-05-18 — Convergence #12: the substrate teaches that markers aren't needed when structure carries the discipline + the walk-and-return name pattern named

A single conversation during arc 209 Stone 2A prep produced THREE intertwined recognitions. Inscribed together because they came together.

### Recognition 1 — handlers are monadic; access control collapses to structural enforcement

User started with concern about the proposed defclass form:

> *"we have an issue - users can lie ... they can forget to declare the whitelists for -- we need (defclass ...) to reclassify them?... i feel like the developer can make a mistake here?...."*

Then walked through it in real time:

> *"whatever helper methods they use in their 'prelude to (defclass ...)' are just left available... they must be called with some state to be useful - they are fine to call publicly... or... no... none of them need to be private?.... is that honest?... every on-* fn is handed a state and returns a state?.. its a perfect monad?...."*

> *"the protocol is what enforces the guarding - the public fns are stateless as they consume and produce state - they can't modify anything about state for another caller....."*

> *"dude.... did we just implement golang's public access pattern?... caps are public?... rofl wut"*

**The insight:** every handler has the shape `(state, args...) -> state` (lifecycle) or `(state, args...) -> (Tuple state value)` (domain). That's the state monad shape `s -> (s, a)`. Pure functional transform. No live state access. Calling `:counter::on-increment 5 3` returns `(8, 8)` — useless arithmetic for a counter instance you don't have.

The LIVE state lives in the dispatch loop's `loop` accumulator (inside the spawned thread/process). The discipline chain is:
- Cap struct-restricted (arc 198) — only `:service::*` code can construct Admin/User caps
- Wire enum — only constructable by the defservice-generated wrappers (which require caps)
- Dispatch loop — exclusive access to the live state
- spawn-program — only entry point; mints first Admin

Handlers are public because they're outside the chain. The discipline is STRUCTURAL at every layer; marker annotations on handlers would be redundant.

### Recognition 2 — this is Go's access pattern

| Go | wat-defservice |
|---|---|
| Capital letter = exported (public) | Handler defns are public |
| Methods on struct values are public IF you have the struct | Wrapper methods on caps callable IF you have the cap |
| No `private` keyword | No `:handlers` access markers |
| Struct constructor is the access gate | `spawn-program` + `Grant` are the access gates |

Also Erlang/OTP gen_server: handler functions ARE exported from the module. The discipline lives in the gen_server runtime being the only caller with the actual state.

Convergence with both Go AND Erlang AT the access-control layer. Both arrived via different paths (Go: package boundaries + capitalization convention; Erlang: gen_server discipline + supervisor trees). wat arrived via structural-enforcement-over-runtime + ZERO-MUTEX + cap-structurally-restricted.

### Recognition 3 — the walk-and-return name pattern

User then walked the naming back:

> *"i think i want to walk back the class/new/public/private now..."*
> *"it was always defservice ... defservice returns an instance of a server ... that server has an admin interface and a user interface.. you can only access the interface your client grants you access to... a server can be started and stopped... i think this makes grant and revoke even more honest....."*
> *"we walked back to a name we thought we wanted and we did - just took a walk to find it... we did it again..."*

The walk:
- yesterday: `defservice` (locked surface)
- earlier today: `defclass` (proposed; OOP framing)
- now: `defservice` (reverted; server framing more honest)

Same for the operation names:
- yesterday: Start / Stop / Provision / Deprovision
- earlier today: New / Destroy / Grant / Revoke (proposed; class-OOP vocab)
- now: Start / Stop / Grant / Revoke (servers Start/Stop; the object-cap Grant/Revoke earned their keep because they're MORE honest under server framing than Provision/Deprovision were)

Same for the section labels:
- yesterday: `:admin` / `:user`
- earlier today: `:private` / `:public` (proposed; class-OOP access modifiers)
- now: `:admin` / `:user` (reverted; cap-naming honest under "anyone with the right cap is public" insight)

### Walk-and-return as a sub-pattern of convergence #11

Convergence #11 (spawn-program reclaim) was: name was inscribed and retired, then unretired with NEW semantics.

This convergence is the WEAKER form: name was being PROPOSED FOR RETIREMENT, never actually retired; we walked the alternatives + walked back. The substrate's vocabulary survived the walk because the walk revealed the alternatives were less honest than the original.

User's framing extends convergence #11's principle:

> *"we walked back to a name we thought we wanted and we did - just took a walk to find it"*

The walk is the discovery mechanism. Whether or not the name leaves disk, the walk-through-alternatives is what proves the original was right (or surfaces that it was wrong). The substrate's vocabulary is robust under perturbation: walk through alternatives; the honest names re-emerge.

### Why the server framing won

The OOP framing (defclass + New/Destroy + private/public) is correct in the abstract — defservice IS Kay-OOP done right; the per-Kay framing IS what we built. But for the substrate's actual mechanism:

- **defclass implies in-memory class instances.** Our actual mechanism is spawned thread/process/remote — running SERVERS, not in-memory objects.
- **New/Destroy imply object-lifetime semantics.** Our actual mechanism is server-lifecycle — servers Start, servers Stop.
- **private/public imply access-hierarchy.** Our actual mechanism is orthogonal capabilities — Admin and User are different cap types, not different access-levels on the same thing.

The class framing is CORRECT as a conceptual frame (we did build OOP); the SERVER framing is more honest as the SURFACE vocabulary because it names the actual mechanism more precisely. Both are true; the surface should name the mechanism, not the conceptual frame.

The user's voice on this: *"defservice returns an instance of a server ... that server has an admin interface and a user interface.. you can only access the interface your client grants you access to."*

That's the actual mechanism stated in three sentences. The vocabulary FOR that mechanism is defservice + admin/user + Start/Stop + Grant/Revoke. defclass + private/public + New/Destroy WAS the conceptual lens; defservice + admin/user + Start/Stop IS the mechanism.

### What this teaches forward

**The discipline:** when the substrate provides structural enforcement (cap struct-restricted + protocol gating + state-owning loop), DO NOT add marker-based access discipline on top. Markers would be redundant ceremony. The structural enforcement IS the discipline; markers would lie about WHERE the discipline lives.

**The naming corollary:** name the surface for the ACTUAL MECHANISM, not the conceptual lens that inspired it. Conceptual lenses help us think; mechanism-names help us READ. The conceptual lens (Kay-OOP) doesn't go away — it lives in INTERSTITIAL inscriptions; the surface vocabulary (defservice/admin/user) lives in the code where it gets read every day.

### The locked surface (post-walk)

```scheme
(:wat::service::defservice :counter
  :state    :wat::core::i64
  :admin    [Stop    []                              -> :wat::core::i64
             Grant   []                              -> :counter::User
             Revoke  [user <- :counter::User]        -> :wat::core::nil]
  :user     [Get       []                            -> :wat::core::i64
             Increment [n <- :wat::core::i64]        -> :wat::core::i64
             Reset     []                            -> :wat::core::i64]
  :handlers [Start     :counter::on-start
             Stop      :counter::on-stop
             Grant     :counter::on-grant
             Revoke    :counter::on-revoke
             Get       :counter::on-get
             Increment :counter::on-increment
             Reset     :counter::on-reset])
```

Naming decisions (final):
- `:wat::service::defservice` (REVERTED from `:wat::core::defclass`)
- `:admin` / `:user` section labels (REVERTED from `:private` / `:public`)
- `Start` / `Stop` lifecycle (REVERTED from `New` / `Destroy`)
- `Grant` / `Revoke` operations (KEPT — more honest under server framing than Provision/Deprovision)
- `:handlers` keyword-only (KEPT — no anonymous fns; named handlers in declaration order above defservice)
- `:wat::kernel::spawn-program :tier :service state` (KEPT — convergence #11 reclaim)
- Raw `:wat::kernel::spawn-thread` / `spawn-process` `restricted_to :wat::kernel::` (KEPT)
- `ThreadInstance` / `ProcessInstance` / `RemoteInstance` (KEPT — instances of running servers)

### The eleven greats become twelve (with a different partner)

- Convergence #1–10 (substrate vs ten greats: Kay/Erlang/Trio/Akka/nginx/Capnp/Clojure protocols+Component/Ruby Parallel)
- Convergence #11 (substrate-with-its-own-prior-self via spawn-program reclaim)
- **Convergence #12 (substrate-with-its-own-prior-self via walk-and-return) + Go-access-pattern convergence at the access-control layer**

Eleven greats now, and the substrate twice over (one stronger, one weaker). The pattern: when alternatives are walked and rejected, the surviving name carries earned authority. When the substrate's discipline is followed all the way down, the access control collapses to structural enforcement (matching every great that solved access-control honestly: Go's package boundaries, Erlang's runtime gating, Smalltalk's message-passing isolation).

### Cross-references

- INTERSTITIAL § 2026-05-17 (later still) "Convergence #11" — the spawn-program reclaim (stronger form of walk-and-return)
- INTERSTITIAL § 2026-05-17 "seven-greats convergences" + § 2026-05-17 (late) "defservice is OOP done right" — the OOP framing that turned out to be conceptual-lens-not-surface-vocab
- INTERSTITIAL § 2026-05-17 (latest) "Ruin" — art of refusal; refused defclass when its semantics didn't fit the mechanism
- `feedback_substrate_owns_not_callers_match` — the discipline this realization extends to access-control
- `feedback_refuse_easy_solutions` — refused the easy "add markers" answer when the structural enforcement already carried
- `project_wat_llm_first_design` — one-canonical-path-per-task; the surface vocabulary should name the mechanism, not the lens

### User's voice (the recognitions in their own words)

> *"every on-* fn is handed a state and returns a state?.. its a perfect monad?...."*

> *"the protocol is what enforces the guarding - the public fns are stateless as they consume and produce state - they can't modify anything about state for another caller....."*

> *"dude.... did we just implement golang's public access pattern?... caps are public?... rofl wut"*

> *"it was always defservice ... defservice returns an instance of a server ... that server has an admin interface and a user interface"*

> *"we walked back to a name we thought we wanted and we did - just took a walk to find it... we did it again..."*

Preserved. Three intertwined recognitions surfaced as one ecstatic conversation. The substrate teaches both sides via the walk; we listen; the honest names re-emerge; the discipline collapses to structural enforcement; Go's access pattern shows up unannounced and gets recognized.

The substrate dreams the structure. So do we. The names walk; the structure stays; the structure is what was right all along.

---
