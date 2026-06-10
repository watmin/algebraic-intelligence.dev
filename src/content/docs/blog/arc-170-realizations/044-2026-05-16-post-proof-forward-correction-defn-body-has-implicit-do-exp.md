---
title: "2026-05-16 (post-proof) — Forward correction: defn body has implicit-do; explicit `do` a…"
sidebar:
  order: 44
---

**User's framing 2026-05-16, post-Counter-actor-proof:** *"in the most recent tests we added to show the thread and server process doing counting - we used do blocks in the function bodies - this is unnecessary as (defn ...) implemented a do block in its macro form?.. we don't need an explicit do?..."*

**Yes.** `:wat::core::fn` has implicit-do at its body slot per arc 168 — `synthesize_fn_body` (src/runtime.rs:5113) wraps multi-form bodies in `(:wat::core::do ...)` automatically. `:wat::core::defn` expands to `(:wat::core::def name (:wat::core::fn sig body))` (wat/core.wat:201-206), so it inherits this. Writing `(:wat::core::do (form1) (form2))` at the top of a defn body is pure ceremony — `(form1) (form2)` directly is equivalent and substrate-honest.

### Where the redundancy lives in the inscribed Counter example

The inscribed `:counter/shutdown` wrapper above (§ 2026-05-16 deeper, line ~2572) carries this redundancy:

```scheme
(:wat::core::defn :counter/shutdown
  [peer! <- :wat::kernel::ThreadPeer<Counter/Request, Counter/Response>]
  -> :wat::core::i64
  (do                                                                ;; ← redundant — defn has implicit-do
    (:wat::kernel::Thread/println peer! (Counter/Request/Shutdown))
    (match (:wat::kernel::Thread/readln peer!)
      ((Counter/Response/Final state) state))))
```

The honest form drops the `do`:

```scheme
(:wat::core::defn :counter/shutdown
  [peer! <- :wat::kernel::ThreadPeer<Counter/Request, Counter/Response>]
  -> :wat::core::i64
  (:wat::kernel::Thread/println peer! (Counter/Request/Shutdown))
  (match (:wat::kernel::Thread/readln peer!)
    ((Counter/Response/Final state) state)))
```

Per `feedback_inscription_immutable`: the inscribed example above stays as historical record; this entry names the correction; subsequent Counter examples and USER-GUIDE write-ups should use the honest form.

### What still needs the `do` (the discriminating rule)

**Match arms** require single-form arm body (runtime.rs:11741 enforces `arm_items.len() != 2`). Multi-form arm body MUST wrap explicitly:

```scheme
(match (recv server-rx!)
  ((Counter/Request/Get)
     (:wat::core::do                                                 ;; ← REQUIRED — match arm is single-form
       (send server-tx! (Counter/Response/Value state))
       (:counter/dispatch server-rx! server-tx! state)))
  ...)
```

The inscribed `:counter/dispatch` (§ 2026-05-16 deeper, line ~2350) correctly uses `do` inside match arms — those are NOT redundant. The Get / Reset arms have two sibling forms (send-reply + tail-recur); match's grammar forces the wrap.

### The taxonomy

| Position | Implicit-do? | Source |
|---|---|---|
| `:wat::core::fn` body slot | YES | arc 168 `synthesize_fn_body` |
| `:wat::core::defn` body slot | YES | inherited via macro expansion to `fn` |
| `:wat::core::let` body slot | YES | `synthesize_let_body` (runtime.rs:20055) |
| `:wat::core::match` arm body | **NO** | runtime.rs:11741 — arm shape is exactly `(pattern body)` |

Reach for explicit `do` ONLY at positions where the grammar requires single-form. Everywhere else: multi-form is the form.

### Where the correction landed in code

`wat-tests/counter-actor-proof-thread.wat` and `wat-tests/counter-actor-proof-process.wat` originally shipped (uncommitted) with 8 redundant `do` wraps (4 per file, all in the client wrapper defns: `:counter/get`, `:counter/increment`, `:counter/reset`, `:counter/shutdown`). Stripped in place pre-commit. Match-arm `do`s in the dispatch loops stayed (correctly).

### Cross-references

- arc 168 — implicit-do for fn/let body slots
- `synthesize_fn_body` — src/runtime.rs:5113 (the substrate proof)
- `synthesize_let_body` — src/runtime.rs:20055 (same shape for let)
- `eval_match` arm shape check — src/runtime.rs:11741 (the discriminating rule)
- wat/core.wat:201-206 — defn-as-macro expansion to fn
- docs/USER-GUIDE.md:890 — let body's implicit-do documented
- INTERSTITIAL § 2026-05-16 (deeper) — the inscribed Counter example this corrects forward

---
