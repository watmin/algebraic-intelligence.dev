---
title: "2026-05-23 afternoon — Layered honesty doctrine: source-form vs evaluated-form; Atom-as-…"
sidebar:
  order: 95
---

After arc 225 reshape to Option A (narrow Atom to constructor), user pushed deeper. The thread surfaced more substrate-doctrine asymmetry that arc 224's audit hadn't fully resolved.

### The chain of probes

**User question 1:** *"so :wat::holon::{Atom,Bundle,Bind,...} still exist?.. atomize returns an Atom?.."*

The hidden assertion: if a verb is named after a HolonAST variant, it should produce that variant. `atomize` (proposed rename of `:wat::holon::Atom`) does NOT always return `HolonAST::Atom` — most input arms produce leaves/Bundles/composites. Same family of lie as the original, just less obvious.

This stopped Stone 225.1's first sonnet flight. ~396 lines of rename work reverted.

**User question 2:** *"I would say Atom's sig is (Atom :HolonAST) -> :Atom?"*

The honest direction: narrow `:wat::holon::Atom` to a SINGLE-shape constructor matching the sibling Pascal-Case verb family (Bundle, Bind, Permute, Thermometer, Blend, Tag — all single-shape constructors). The verb's name should match the variant it constructs.

Sibling audit confirmed: `eval_algebra_bundle` takes exactly `Value::Vec<HolonAST>` and produces `HolonAST::Bundle(...)`. Single shape; honest. Atom was the outlier in being polymorphic.

**User question 3:** *"is Atom's ret val just a HolonAST?"*

YES. All Pascal-Case algebra constructors return `:HolonAST` (the enum). The Rust variant is an implementation detail; the user-visible type is `HolonAST`. Same as `Result<T,E>` returning `Result` not `Result::Ok`.

**User question 4:** *"what is the holon (:wat::core::unquote :WatAST) ?... seeing Tag being named but Quote, Unquote, Quasiquote, Splice not being named is strange... leaf is a bad term now? ... our names are finding themselves but they are not found yet"*

The asymmetry call. If Tag gets a substrate variant (EDN spec primitive), what about the macro sigils? Tag at substrate carries naming data. Macro sigils ARE syntactic-marker forms — at EDN data layer they're list-of-symbol-and-payload (verb-application Bundles).

### My first attempt was dishonest

I proposed:
- `'x` → `Atom(x)` — Quote special; matches user's "Atom IS quote" doctrine
- `` `x ``, `~x`, `~@x` → `Bind(Tag("quasiquote"), x)`, etc.

User caught the lie: *"Tag is abused here?... Tag is '#whatever some-expr' .. that is not what... what is Tag under the hood?... it itself is just (String 'some-tag')."*

The user's unfold:

```
#whatever :foobar
=> (Bind (Tag "whatever") (Keyword "foobar"))
=> (Bind (Bind (String "Tag") (String "whatever")) (Bind (String "Keyword") (String "foobar")))
```

Even Tag-the-variant is structurally `(Bind (String "Tag") (String "whatever"))` at the deepest layer. Variants are CONVENIENCES — Rust enum discriminators standing in for nested Bind-of-String compositions. Tag's variant exists because EDN spec gives `#tag value` primitive status. **Using Tag for macro sigils REUSES the EDN-data-dispatch mechanism for code-evaluation-deferral semantics. Different things; same shape; dishonest.**

### User question 5 — the asymmetry call I'd missed

*"why does Quote continue to be free while its peers are shackled in confusion.... the EDN side and the wat side show consistency - why is the Holon side inconsistent?... they should be familiar and obvious in all forms?... all of the quote families just defer expansion, right?.. that makes they are all satisfied via Atom under the hood? and the 'undo' are just an expansion of a deferred expr?..."*

Sharp. My proposal had Quote = Atom (special) and Quasiquote/Unquote/Splice = Bundle-of-verb (sibling). Asymmetric. Wat side has parallel literals `'` `` ` `` `~` `~@` — Holon side should be parallel too.

### The layered resolution

The asymmetry was a LAYER-CONFLATION error on my part. Two layers:

**Layer 1 — Source form (parsed, pre-evaluation):** ALL four macro sigils are Bundle-of-verb at substrate source-encoding level. CONSISTENT:

```
'x       → (Bundle (Keyword "wat::core::quote") x_h)
`x       → (Bundle (Keyword "wat::core::quasiquote") x_h)
~x       → (Bundle (Keyword "wat::core::unquote") x_h)
~@x      → (Bundle (Keyword "wat::core::splice") x_h)
```

**Layer 2 — Evaluated form (after the evaluator runs):** All four reduce to Atom-wrapped substrate forms. ALSO CONSISTENT:

```
(quote x)             → Atom(x_h)                                    ; bare hold
(quasiquote template) → Atom(<template with unquote-holes filled>)   ; held expanded form
(unquote y) IN qq     → consumed by quasiquote expansion; y evaluates in context
(splice y) IN qq      → consumed; y evaluates and splices
(unquote y) outside qq → ERROR — syntactic marker only valid inside qq
(splice y) outside qq  → ERROR — same
```

**At substrate, there is no `Quasiquote` / `Unquote` / `Splice` primitive.** They're CONSUMED by the quasiquote evaluator at expansion time. The Atom-wrapped result is the substrate's view.

**The substrate stays at 16 variants. Atom carries the "this is held" semantic for the entire quote-family at evaluated form.**

The "Quote IS Atom" doctrine the user articulated holds — but at the EVALUATED layer, not the source layer. My earlier conflation was treating source-form Bundle for Quote AS IF it were the evaluated Atom-wrap.

### The doctrine landed

```
EDN-level form         Wat-surface              Substrate composition (post-eval)
──────────────         ──────────────────       ──────────────────────────────────
{k v ...}              (Map k v ...)            (Bundle (Bind k_h v_h) ...)
#{x ...}               (Set x ...)              (Bundle x_h ...)            ; set-shape
[x ...]                (Vector x ...)           (Bundle (Bind 0 x_h) ...)   ; positional
(x ...)                (List x ...)             (Bundle x_h ...)            ; sequential
#tag v                 (Tagged tag v)           (Bind (Tag tag) v_h)        ; data-dispatch ONLY
'x                     (Quote x)                (Atom x_h)                  ; held; full defer
`(template)            (Quasiquote template)    (Atom <expanded template>)  ; held; defer w/ holes
~y INSIDE qq           consumed                 y_evaluated substituted in template
~@y INSIDE qq          consumed                 y_evaluated spliced into template
```

Two layers, both consistent. The substrate IS algebra. The wat layer hosts BOTH literal forms (terse) AND verb-forms (explicit). Reader macros (`'` `` ` `` `~` `~@`) expand at parse time to verb-form Bundles; the evaluator handles the deferred-evaluation semantics; the Atom-wrapped result is what survives to substrate.

### Why `leaf` retires

Each variant has its own Pascal-Case constructor (`(:wat::holon::Bool b)`, `(:wat::holon::I64 n)`, etc.). The polymorphic `:wat::holon::leaf v` operation-verb dispatches by input Value-type to the right constructor — that's a CONVENIENCE, not a substrate distinction. Per the doctrine, leaf can:
- Stay as a polymorphic-dispatch operation-verb (lowercase = operation = polymorphism honest)
- OR retire entirely in favor of explicit Pascal-Case constructors per variant

Either honest. The category-name "leaf" was never a substrate distinction — it was a convenience grouping.

### Tag reaffirmed as EDN-only

Tag-the-substrate-variant is reserved for EDN tagged literals (`#name value`). It carries the tag name as data; it composes with Bind to form tagged values. Reusing it for macro sigils was the dishonesty.

### Where this lands

- Substrate stays at 16 HolonAST variants — no expansion
- Each variant has a Pascal-Case constructor verb (`(:wat::holon::Bool b)`, ..., `(:wat::holon::Atom h)`)
- `:wat::holon::Atom` narrows from polymorphic to single-shape (Stone 225.1's scope)
- `:wat::core::atom-value` renames to `:wat::holon::materialize` (lowercase operation; polymorphic decode honest)
- EDN forms (Map / Set / Vector / List / Tagged) compile to substrate compositions; arc 222's territory
- Reader macros (`'` `` ` `` `~` `~@`) expand at parse time to verb-form Bundles; evaluator produces Atom-wrapped results
- `leaf` retires as a category-name

### What `:wat::core::quote` evaluator becomes (implementation work; future arc)

Current behavior: `(quote x)` returns x as a wat Value (the inner unevaluated).

After the doctrine lands: `(quote x)` evaluates to `Atom(x_holon)` at substrate when atomized; the wat Value can still be the inner if useful at intermediate stages. The doctrine specifies the SUBSTRATE encoding; the wat Value tier is a runtime convenience.

For quasiquote: the evaluator traverses the template, identifies Unquote/Splice markers (which are Bundle-of-verb at source), evaluates their inner forms, substitutes the results, and Atom-wraps the final expanded structure. Unquote/Splice are CONSUMED during expansion — they don't survive to substrate.

This evaluator-side work is downstream of arc 225 — likely arc 226 or folded into arc 222's evaluator coverage.

### Cross-references

- arc 222 DESIGN.md — the EDN-form ↔ substrate-composition doctrine inscribed here
- arc 225 DESIGN.md — narrow Atom + rename atom-value → materialize (the substrate-rename work)
- arc 223 DESIGN.md — WatAST primitive-layer honesty (literal-form parser work)
- arc 224 AGGREGATE-FINDINGS.md — the audit that surfaced this convergence
- [[atom-is-holder]] memory — substrate doctrine (refreshed)
- `feedback_inscription_immutable` — this entry stays as historical record
- `feedback_sonnet_no_realization_voice` — entry orchestrator-direct
- Songs #19/#20/#21 — the trilogy through which doctrine emerged

### Closing

User: *"our names are finding themselves but they are not found yet"* — found now. The 16-variant substrate + Pascal-Case-constructor-per-variant + lowercase-operations + EDN-forms-as-surface-with-substrate-compositions + reader-macros-as-parse-time-sugar IS the doctrine.

The substrate dreams the algebra. The wat surface hosts the literal forms. The evaluator handles the deferred-expansion semantics. The substrate sees only the Atom-wrapped result. Layered, consistent, honest.

*The disk remembers what we inscribe. The doctrine landed today. The exprs will reveal the honesty.*

---
