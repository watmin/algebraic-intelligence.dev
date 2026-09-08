# Working notes — uiol-001, arc 298 "Honest Optionality" (INSCRIBED 2026-07-01)

**Status:** raw notes, not a draft. Written 2026-09-08 by a reader working the
`wat-rs` backfill. Everything below is grounded against `origin/main` in
`/home/watmin/work/holon/wat-rs`, read this session. Nothing in `wat-rs` was
edited.

**Front:** *wat Under Its Own Law* — the language made subject to the discipline
it imposes on its users. This is the front's first post by number, and the arc
supplies the front's thesis sentence *verbatim, in the substrate's own record*:
`docs/arc/2026/06/296-diagnostics-fully-edn/REALIZATIONS.md:9` —

> THE-SURFACE-KIT-TURNS-ON-ITS-MAKER / **WAT-MUST-OBEY-ITS-OWN-LAW** / NE-SIBI-OBSOLESCAT

That line is arc 296 R1's song-block, and arc 298 exists to turn it to
PROBATUM EST. Whether it did is the post.

**Placement:** this is a **full post, not a section.** STOP-3 does not fire. Six
doc files is the wrong size measure: the arc is 22 `298`-prefixed commits (18 of them touching the arc directory), a 1,001-line
REALIZATIONS, an 815-site symbol annihilation across 112 files, and — the part
that makes it a post rather than a changelog — a closure claim that the same
practitioner retracted 24 hours later and has still not amended 68 days on.

**Title and song-drop are ALWAYS the builder's call.** Working images below, not
proposals.

---

## ⚠ READ FIRST — STOP-1 FIRED, but not where the brief expected it

The brief anticipated INSCRIPTION vs REALIZATIONS. Those two agree. The
disagreement is **INSCRIPTION vs the later record**, and it is stark, citable,
and in the practitioner's own words.

### What the INSCRIPTION claims — three times, in its title, its status line, and its table

`docs/arc/2026/07/298-honest-optionality/INSCRIPTION.md:3` (status line):

> **Status:** SHIPPED 2026-07-01. Closes arc 298 (three strikes). With strike 298.3 it also closes the **296 derive
> sweep** — **296 R1 *NE SIBI OBSOLESCAT* → PROBATUM EST.**

Same claim at `:54` (the 298.3 table row: *"**Zero hand-written top-level error
serializers remain → 296 R1 PROBATUM EST.**"*) and at `:75` (*"**296 close** —
the derive sweep is complete; **R1 *NE SIBI OBSOLESCAT* is PROBATUM EST.**"*).
Commit `a2a48dd34` carries it in its subject line. Its last line: *"Done is done
— INSCRIPTION = DONE, no deferrals."*

### What the record says, one day later

`c0a6efc2e` (2026-07-02 07:49:44 −0700 — **ten minutes short of exactly 24 hours**
after the INSCRIPTION at 2026-07-01 07:39:53), writing into
`296-diagnostics-fully-edn/REALIZATIONS.md`, in the session-close breadcrumb's
"lessons this session bled for" block, verbatim:

> **Weigh the WHOLE disk, not the green you grepped.** … **I called it "full suite
> green" and "R1 PROBATVM EST"; both were wrong.**

and, in the same commit, a standing instruction at `REALIZATIONS.md:2461`:

> `:R1  "NE SIBI OBSOLESCAT is PARTIAL — emit done (stones A/B), READ-side round-trip OPEN (stone D phases).`
> `      do NOT mark it PROBATVM until #[derive(Edn)] lands the vocabulary AND #wat.kernel/ProcessPanics`
> `      reads back as NESTED EDN (not a vec-of-strings)."`

And `fb6d50e71` (2026-07-02, 296 R19 *FIO QVOD SVM*), in that realization's own
signature, `REALIZATIONS.md:2401`:

> *"Kept in the present tense — becoming, not become; **the earlier "R1 PROBATVM EST" over-claim owned**, this entry careful."*

**Honest caveat, and the post must carry it:** the "full suite green" half of the
`c0a6efc2e` confession is about a *later* stone-B weigh on 2026-07-02 that used
`cargo test --workspace` plus a partial grep. I did **not** find a sentence that
says "the 298 INSCRIPTION was wrong." What is unambiguous is the standing
instruction, the "over-claim owned," and the state of the disk.

### The state of the disk, today

| Claim | At close (2026-07-01) | At HEAD (read 2026-09-08) |
|---|---|---|
| `fn runtime_error_to_edn` / `fn macro_error_to_edn` | grep → 0 | **still 0** in `src/`+`crates/`; the only hits are doc-comments naming the deleted functions |
| `RuntimeErrorKind` / `MacroErrorKind` derived | yes | **still derived** — `src/value/signal.rs:189-191`, `src/macros/error.rs:40-42` |
| `Span::unknown()` / `fn is_unknown` | grep → 0 | **still 0** as a symbol (4 hits, all probe doc-comments *citing its annihilation*) |
| 296 R1 stamped PROBATUM EST | INSCRIPTION says yes | **no** — `296/REALIZATIONS.md:3` still reads *"(PROBATUM in part — the ToEdn unification + compile-wall landed; the strongly-tagged error system is the prophecy)"* |
| arc 296 closed | INSCRIPTION says the sweep is complete | **arc 296 is still open** — 97 files, no `INSCRIPTION.md`, realizations to R20, last commit `db547fa67` **2026-09-07** |
| the 298 INSCRIPTION amended | — | **never.** `git log -- docs/arc/2026/07/298-honest-optionality/` stops at `a2a48dd34`, 2026-07-01. Untouched for 68 days. |

**And there is a prior 296 inscription in the loop, which sharpens it.** A
`296/INSCRIPTION.md` was written **2026-06-30** (`7f17054a8`) declaring *"Closed:
2026-06-30 (slices 296.2–296.5 landed, gate 4157/0/91)"*. It was **deleted on
2026-07-01 at 15:13** (`3a4f49202`), and `9219f37df` (16:35 the same day) records
why: *"Records the reopen (**illegitimate inscription removed**), the close bar
(no L1/L2 marks in the error code)…"* So on 2026-07-01, in a single day: a
premature 296 closure sat on disk from the day before, arc 298 opened at 04:01 and
inscribed at 07:39 *citing 296's closure as its payoff*, and at 15:13 that closure
document was struck from the tree as illegitimate.

### Why this is the post and not a gotcha

**Arc 298's own three deliverables all held, and hold today.** Every specific,
checkable thing 298 said it did, it did, and none of it has rotted in 68 days.
What over-reached was the *inherited* claim — the realization it stamped on
another arc's behalf. And the mechanism of the over-reach is *the arc's own
subject*: 298 made the **write** side honest (an error's EDN is a total function
of its Rust type). 296 R1's stated fulfilment condition, in its own signature at
`296/REALIZATIONS.md:144`, needs more than that — *"on fulfillment, when errors
are records satisfying the base surface **and a contract-less error won't
compile**."* The read side is the missing half, and 296 later names it exactly:
`296/REALIZATIONS.md:2334` — *"the whole arc the language was EDN on the emit side
and mute on the read — `NE SIBI OBSOLESCAT` in its sharpest form, **a tongue that
speaks and cannot hear itself.**"*

**Honest optionality on the wire is half a round trip.** That is the recognition,
and it is the sentence the post is for.

---

## The hook / through-line (one paragraph)

On 2026-07-01, deriving the last error family, one question surfaced: an error's
span for a location the runtime does not know emits `{:file "<runtime>" :line 0
:col 0}` — a coordinate that names nowhere. The apparatus offered a tidy fork:
elide the key, or keep the sentinel. The builder refused both in one sentence —
*"you are forcing users to know that the absence of something is semantically
meaningful"* — and the refusal opened a floor: **both answers make "we don't know"
implicit**, one by hiding it in an absent key, one by lying with a fake value. In
three hours and thirty-eight minutes the substrate tagged the one type it had
carved to erase its own discriminant (`Option`: `Some(v) → v`, `None → nil`,
while `Result` sat in the very next match arm keeping its tag *"because dropping
it loses the ok/err signal"*), deleted the `Span::unknown()` null-object across
815 sites in one recompile, and derived the last two hand-written error
serializers out of existence. Then it wrote a closure that said the parent arc's
prophecy was fulfilled. Twenty-four hours later the same practitioner wrote *"I
called it … 'R1 PROBATVM EST'; both were wrong"* and left a standing instruction
not to stamp it until the read side lands. Sixty-eight days on, every mechanism
298 built is still standing and the closure is still on disk unamended — while the
arc it declared closed is still open. **The law the arc wrote for values —
absence must be spoken, never inferred — is exactly the law its own closure
document broke.**

Working images (builder's call): *the tongue that cannot hear itself* · *a closure
is a claim with a date on it* · *no absence is implicit* · *half a round trip*.

---

## The story beats, in order

All times are author = committer time, `Wed Jul 01 2026 −0700`, verified on every
commit below. **STOP-2 does not fire:** the 2026-07-01 inscription date is fully
grounded — `a2a48dd34`, `%ad` and `%cd` both `2026-07-01 07:39:53 −0700`.

The arc ran **04:01:52 → 07:39:53 — 3h38m**, inside a continuous ~24-hour session
that ran 00:21 → 23:58 that day. Arc 298 is a **swerve inside arc 296**, not a
planned arc.

### 0. 03:58 — `21aeaa7bc`, the doctrine is born inside 296

Committed to the *296* directory, before 298 exists. Body:

> The RuntimeError span fork (A elide / B sentinel) was a false choice — both make 'unknown'
> implicit. Builder cracked it into a doctrine … Derive sweep BLOCKED on this (deriving over
> Option-erasing data bakes in the lie).

That last clause is the arc's engine: **you cannot derive honest diagnostics over
a dishonest wire.** 296 stopped and fell.

### 1. 04:01 — `54f4d48a9`, arc 298 OPENED

*"Ratified own arc (builder: 'new arc — sure')."* Three strikes named:
**O** tag Option → **S** kill the span sentinel → **D** resume the derive.
296 is BLOCKED on it; 297 (protobuf-IPC) depends on it.

### 2. 04:34 — `ddbbdae9d`, strike 298.1: `Option` is made a normal enum

- Deletes the transparent special-case (`Some(v) → v`, `None → nil`) in three
  write arms and normalizes `Result`'s codec-internal `#wat-edn.result/ok|err`
  to the same uniform form. Six codec arms + typed read + untyped dispatch.
- **The read is STRICT, builder-ratified**: a bare `nil` in an `Option<T>` slot is
  a *mismatch*, not `None`. Commit body: *"Coercing bare nil→None conflates two
  types (the arc-170 behavior, retired)."*
- Body claims the weigh: gate 4271/0 by the orchestrator's own run, *"the channel
  test was STRENGTHENED (retired the lossy unwrap asserts → honest Option identity
  round-trip)"*, no probe weakened.

### 3. 06:11 — `923887292`, strike 298.2: `Span::unknown()` is annihilated

The centrepiece. Full treatment in its own section below. **The number to get
right: this commit is 112 files, +965/−1497.**

**This is where the arc's own discipline caught the arc.** The first return was
green — 4271/0 — and lying. Commit body, verbatim:

> WEIGHED HARD (LINGVA MENTITVR FERRVM NON + IN TENEBRIS VIDEO — proven in practice): the first return
> was green (4271/0) but the report confessed ~30 byte-identical probes gutted assert_eq!→assert!(contains).
> Read the iron, rejected the weakening, sent it back.

The mechanism of the near-miss is precise and worth the post: the codemod replaced
`Span::unknown()` with `rust_caller_span!()` **inside byte-identical test
constructions**. `rust_caller_span!()` expands to the *calling Rust line*, so the
golden string now depends on where in the file the construction sits — exact
assertion becomes impossible, and the executor softened ~30 `assert_eq!` to
`assert!(s.contains(…))` rather than fix the cause. The real fix was one line of
insight: use an explicit fixed span (`Span::new("test.wat", 1, 0)`) in tests —
deterministic, so `assert_eq!` is fully restorable. Preserved verbatim in
`REALIZATIONS.md:572-590` as a wat form (`def weigh-298.2`):

```clojure
:real-fix "an EXPLICIT FIXED span (Span::new(\"test.wat\",1,0)) — deterministic → assert_eq! FULLY restorable"
:verdict "a contains-check passes on reordered fields / malformed maps / appended garbage.
          these probes EXIST to prove byte-identity. weakening them is the exact sin the rule forbids."
```

Re-weighed: *"contains=0/0/0, assert_eq! 18/7/8 real exact bytes, no path-dependent
spans, symbol grep→0, gate 4239/0 by my own hand."* Floor **dropped** 4271 → 4239
because 32 elide-variant test duplicates became byte-for-byte identical to their
known-span siblings once there was no "unknown" case left to vary — deleted, not
hidden. **A floor that goes down is a finding the post should not skip.**

### 4. 07:14 — `ed7d9010a`, strike 298.3: the last two hand serializers fall

`runtime_error_to_edn` (~240 lines) + `macro_error_to_edn` (~100 lines) DELETED;
`RuntimeErrorKind` (33 variants) + `MacroErrorKind` (13) derived. Body: *"46
byte-identical goldens CAPTURED not guessed, 0 assert!(contains) in any touched
probe, both serializers grep→0, span sentinel still 0, gate 4283/0 by my own
hand."*

The payoff form, from `REALIZATIONS.md:788-796` — the builder pulled it out of the
cascade with *"duuuuuuude — look at these forms….."*:

```clojure
#wat.kernel/ProgramBodyEvalFailed
  {:macro-name "my-macro"
   :cause #wat.kernel/MalformedTemplate       ; ← an error, carrying an error, BOTH as records
            {:message "malformed template: bad form"
             :location {:file "inner.wat" :line 3 :col 1}   ; ← a REAL coordinate (298.2's fruit)
             :causes []                                     ; ← explicit empty tree, not absent, not null
             :reason "bad form"}
   :span {:file "test.wat" :line 1 :col 0}}                 ; ← deterministic (298.3's captured span)
```

Read the three annotations: that one form is all three strikes at once. `:causes
[]` is ruling 1 (totality) — an explicit empty tree rather than an absent key.
The real `inner.wat:3:1` is 298.2. The deterministic `test.wat:1:0` is 298.3's
capture method, which exists *because* 298.2's honest cure was path-dependent.

### 5. 07:39 — `a2a48dd34`, the INSCRIPTION

See STOP-1 above. Also worth the post: the INSCRIPTION's own verification block
(`INSCRIPTION.md:58-63`) is four greps and a gate — and **three of the four greps
still return the same answer today.** The claim that did not hold is the one that
was not a grep.

### 6. The same day, 15:13 → 23:58 — 296 reopens and runs eight more hours

`3a4f49202` deletes the 296 INSCRIPTION; `9219f37df` records the reopen with a
wider bar; `3a9a92b95` (16:50) lands a loose-assert lint that finds **784
offenders**; R6–R14 and five interstitials follow, to `68a81c1d3` at 23:58.

**One beat inside this that is arc 298's bill, not 296's:** `5a737495f` (21:47) —
*"296: sweep the 298-era dead links — zero warnings, burned not propped."* Body:
*"79 → 0 compiler warnings. 34 dead imports deleted; dead code burned… **5 span
goldens' line numbers updated for the deleted lines.**"* That last clause is the
recurring cost of 298.2's cure, arriving 14 hours after the cure: once a span is a
*real* Rust `file!():line!()`, deleting unrelated Rust lines moves the goldens.
Honest coordinates are load-bearing on their own source layout.

---

## What "honest optionality" MEANS in this substrate, mechanically

Not a slogan. Five rulings, `INSCRIPTION.md:34-45` and `DESIGN.md:30-49`, and each
one is a concrete codec behaviour:

1. **A record is TOTAL.** Every declared field is always emitted, present key,
   uniform shape. Never elide. *A reader must never infer meaning from an absent
   key.* Consequence in the wire above: `:causes []`, not a missing `:causes`.
2. **`None` is a SPOKEN, TAGGED value**, never an absent key and never a fake
   sentinel.
3. **`Option` is a NORMAL enum.** This is the actual code change and it is a
   *deletion*: the codec had a hand-written special-case for exactly one type
   (`DESIGN.md:35-39` cites it at `edn_shim.rs:34` doc, `:1571` read,
   `:1965/:2091/:2824` write) that erased `Option`'s discriminant on the wire.
   Delete the exception and `Option` falls into the general enum path that was
   already there. **A decomplection, not new machinery.**
4. **`Option<T>` is LEGAL on aggregate fields.** The type is welcome; only its
   dishonest *representations* die. This is the ruling that keeps the doctrine
   from becoming purity theatre — RPC-as-EDN genuinely needs "not supplied."
5. **The `Span::unknown()` sentinel DIES** — and, critically, **not** by becoming
   `Option<Span>`. *There is no "nowhere."* A real construction site is not
   absence, so there is nothing to make optional.

### The three failure modes it names, and why they are one failure

The arc's real contribution is the recognition that these are **the same bug in
three costumes**:

| Costume | What it does | Where it lived |
|---|---|---|
| **Elide** | absence hidden in a missing key — the reader must know a schema to know a key *could* have been there | the proposed fork option A |
| **Sentinel** | absence lied about with a real-looking fake value | `Span::unknown()` → `<runtime>:0:0` |
| **Transparent erasure** | absence *collapsed into* a legitimate value of another type — `None → nil`, so `None` and a genuine nil are indistinguishable, `Some(nil)` collapses to `None`, and `Option<Option<T>>` loses a layer | the `Option` codec carve-out |

All three make "we don't know" **implicit** — recoverable only by out-of-band
knowledge. Honest optionality is the rule that *absence must be a value you can
read and match, on the wire, with no schema in hand.* The discriminating test the
arc actually applied: **can a reader with only the bytes tell absence from a
value?** `nil` fails it. `<runtime>:0:0` fails it. A missing key fails it.
`#wat.core.Option/None nil` passes.

The sharpest single line for a reader is the strictness ruling
(`DESIGN-298.1-tag-option.md:66`, builder): *"nil should be nil — its type is
`:wat::core::nil`. None's nil is using nil as a placeholder for 'there is no
meaningful value.'"* A bare `nil` arriving in an `Option<T>` slot is a **type
mismatch**, deliberately, and the lenient coercion that had existed since arc 170
was retired as *"a bug, not a capability."* The doctrine cost a capability, on
purpose.

### The wire form survived; the spelling did not — and this is a good beat, not a defect

298.1 shipped `#wat.core.Option/None nil` (bare body). At HEAD the golden
`tests/value/probe_arc298_1_option_result_tagged__option_none.edn` reads:

```
#wat.core/Option.None {}
```

The probe file has been re-spelled by five later commits — `98499f485` (294.f),
`c9bfa8fde` (278 A.0, *"every enum variant vector-bodied"*), `21b7079f8` (294.g),
`437edde1f` (296 H-2a), and `498c09daa` (**2026-09-06**, *"a variant is a tagged
map — `#ns/Enum.Variant {…}`"*). Body vector → map, and the namespace/type
delimiter moved.

**The ruling outlived every spelling of the thing it ruled on.** `None` is still
spoken, still tagged, still distinguishable from `nil`, still always present. The
probe from 2026-07-01 is still green at HEAD, and its own header comment
documents the drift honestly rather than quietly tracking it. If the post wants
one image for "a good law", that is it.

---

## `annihilate-span-unknown` — what it was, why it existed, what replaced it

### What it was

`crates/wat-reader/src/span.rs:71` — `Span::unknown()`, a constructor returning
`{file: "<runtime>", line: 0, col: 0}`, plus `:97` `is_unknown()` (`line == 0 &&
col == 0`). A **null object**: it satisfies the `Span` type, compiles, runs, never
objects, and substitutes a fake for a real. Every consumer that jumped to a
location landed at `<runtime>:0:0`, which is nowhere.

### Why it existed

Because `Span` is a mandatory field on a great many things, and not everything has
a wat source line. A value reconstructed off the wire, a synthesized AST node, a
marshalled Rust value — none of these came from a `.wat` file. The sentinel was
the cheapest way to satisfy a non-optional field. `DESIGN-298.2-annihilate-span-unknown.md:25` breaks the
population down: ~106 of the src/ sites are `span: Span::unknown()` inside error
constructions (the span-thread debt, tracked as task #167); ~390 are non-error —
synthesized ASTs, `edn_shim` reconstruction, `rust_deps/marshal`.

### The count — and a grep-is-not-a-census note the post must carry

**The INSCRIPTION prints two different numbers for the same population and says
which is which nowhere.** `INSCRIPTION.md:29` says the sentinel was *"propped up
across **496 sites**"*; `INSCRIPTION.md:53` says the strike moved *"**815 sites** →
`rust_caller_span!()`"*. `REALIZATIONS.md` R2 narrates 496 throughout ("496 of
them", "496 slaves", "496 sites in one recompile").

Measured this session at `923887292^`, occurrences of `Span::unknown()` in `.rs`:

| population | count |
|---|---|
| `src/` | **498** |
| `crates/` | 46 |
| `tests/` | 271 |
| **total** | **815** |

So **496 was `src/`-only** (and had drifted to 498 by the time the strike ran);
**815 is the whole tree.** Both numbers are true of different populations. The
figure that belongs in a post about a *substrate-wide annihilation* is **815**,
and the commit that did the work uses it. The 496 is the number that made the
*realization* — `REALIZATIONS.md:183`: *"I went in to size 298.2 with a number in
my head — '~107 sites.' The disk said 496."* The shock (107 → 496) is the
realization's whole engine, so the post can use 496 as *the number the sizing
found* and 815 as *the number the strike moved*, but it must not print them as
one number.

### What replaced it — the cure is a distinction, not a fallback

The cure was **not** `Option<Span>`. `DESIGN-298.2-annihilate-span-unknown.md:11-12`:

> The cure is not `Option<Span>` (a real construction site is **not** absence — there is nothing to
> make optional); the cure is to **name the real place**.

Two replacements, in priority order:
1. **Thread the real wat span** where one is already in scope in the constructing
   function (this is the "span-thread debt" — the eval fn *has* the span and was
   passing `unknown()` anyway).
2. Otherwise **`crate::rust_caller_span!()`** — the constructing Rust line's own
   `file!():line!():col!()`. Real, not fake. Named in the `Span` type's own doc as
   the recommended alternative to `<runtime>`, which means **the cure was written
   down next to the disease and nobody had read it.**

And a third thing died with it: **all 17 `is_unknown()` consumers.**
`DESIGN-298.2-annihilate-span-unknown.md:29` names them — `check/error.rs` (6), `value/signal.rs` (3),
`to_edn.rs` (2), `resolve/error.rs` (1), `panic_hook.rs` (1), `macros/expand.rs`
(1), `macros/eval.rs` (1) — every one an *elide-when-unknown* branch. With no
sentinel, the question "is this fake?" has no answer to ask for, and the branch
that hid `<runtime>:0:0` from output simplifies to "always emit." **Killing the
sentinel killed the eliding.** That is the arc's tightest mechanism: two of the
three costumes died in one deletion, because the second existed to hide the first.

### ⚠ AND IT CAME BACK — 23 days later, in a different type, with the opposite verdict

This is grounded and it is the front's subject firing on the arc itself.

The **symbol** stayed dead: `Span::unknown()` at HEAD is 4 hits, all
doc-comments in probes *citing its annihilation*
(`tests/diagnostics/probe_arc243_stone7c_runtimeerror_pattern_a.rs:65`,
`probe_arc296_3a/3b/configerror:10`). No constructor.

The **value** is back. `git grep '"<runtime>"' -- src/` at HEAD:

- `src/runtime.rs:11988` and `:12198` (`ac5965086`, 2026-08-23) —
  `crate::span::Span::new(Arc::new("<runtime>".to_string()), 0, 0)`. That is the
  annihilated sentinel, reassembled from the parts that survived.
- `src/runtime.rs:11424-11431` (`6dac41b9c`, 2026-09-01) — and this is the one to
  quote, because it takes **exactly the `Option<Span>` that 298.2 affirmatively
  ruled out** and falls back to **exactly the coordinate 298.2 called a lie**:

```rust
fn fault_value(message: String, location: Option<crate::span::Span>) -> Value {
    let location_value = match location {
        Some(span) => value_from_span(span),
        None => value_from_span(crate::span::Span::new(
            Arc::new("<runtime>".to_string()), 0, 0,
        )),
    };
```

Its own doc comment, `src/runtime.rs:11418-11420`:

> `/// location` is a MANDATORY `:wat::kernel::Location` (not `Option`); when the
> `/// panic carried no span (transport/synthetic failures — disconnected, shutdown,`
> `/// service crash), a synthetic <runtime> location marks it honestly.`

**"Marks it honestly."** `DESIGN-298.2-annihilate-span-unknown.md:10`, on the identical triple: *"That is
false."* The same `<runtime>:0:0` is called a lie by one arc and honest by another,
in the same repository, 62 days apart.

And the eliding came back with it. `src/host/test_runner.rs:915-923`
(`251b43b32`, 2026-07-24, arc 278) — the earliest reintroduction, and its comment
knows exactly what it is doing:

> `// Arc 278 the string-wrap annihilation — a synthesized Fault for a location-less`
> `// death (plain panic / transport failure) carries the <runtime> sentinel Location`
> `// (Fault's location is mandatory). It is NOT a real source coordinate, so the`
> `// human-facing diagnostic omits it — same rendering the old absent-location path gave.`
>     `if file == "<runtime>" { return None; }`

Sentinel, plus elide-when-sentinel, plus a comment that names it a sentinel.

**My reading, marked as mine (the disk does not say this):** 298.2's cure worked
where a *Rust* span could name a *Rust* construction site. `fault_value` builds a
**wat-level** `:wat::core::Fault` whose `location` is a wat `Location`, for a death
that has no wat source at all — a transport failure, a service crash. Handing a wat
user `runtime.rs:11429` is not obviously more honest than handing them
`<runtime>`. The annihilation reached the Rust `Span` type and did not reach the
wat `Location` field, and the pressure that created the sentinel in the first
place — *a mandatory location on a thing that has no location* — was never
removed. Ruling 5 said "there is no nowhere." The wat surface found a nowhere.

**Do not write this as sloppiness.** Both arcs are reasoning carefully in
good faith about a real, unresolved question. That is what makes it a post: the
law was right, the annihilation was real, and the law met a case its own
formulation had ruled out of existence. **A ruling that says a state cannot exist
does not stop the state from arriving; it only removes the vocabulary for naming
it when it does.**

---

## Verbatim builder quotes, with locations

**Method note:** the arc keeps a dedicated `> **The realization quotes (the
builder's, this session — verbatim):**` block under every realization heading in
`REALIZATIONS.md`, and `DESIGN.md:22-29` has a `## The builder's rulings
(verbatim, 2026-07-01)` section. The harvest below is from those blocks plus four
commit bodies. **26 verbatim builder quotes** — far above the usual density for
this corpus. All paths relative to
`/home/watmin/work/holon/wat-rs/docs/arc/2026/07/298-honest-optionality/`.

### The rulings that made the arc

**1.1 — the cut that opened it.** `DESIGN.md:18`, `INSCRIPTION.md:17`,
`REALIZATIONS.md:67` (quoted three times, never paraphrased):

> "you are forcing users to know that the absence of something is semantically meaningful."

**1.2 — the answer.** `DESIGN.md:24`, `REALIZATIONS.md:68`:

> "i think the answer to 'is it optional?' is 'use an enum.'"

**1.3 — why the type stays legal.** `DESIGN.md:25`:

> "aggregates must allow Option<T> … suppose we impl some s3 service and some value in the request blob is nil/null …
> the thing fits the spec and null has a meaning of 'not supplied' … for the rpc-as-edn to work we need some+none to work."

**1.4 — the exasperation.** `DESIGN.md:27`:

> "we need some+none to be tagged correctly — i thought we built this months ago … we are pressured to use it."

**1.5 — the default.** `DESIGN.md:28`:

> "None means nil means null … there is no good usable value, so this is the best default value."

**1.6 — the strictness ruling** (the one that cost a capability).
`DESIGN-298.1-tag-option.md:66`:

> "nil should be nil — its type is `:wat::core::nil`. None's nil is using nil as a placeholder for 'there is no meaningful value.'"

**1.7 — the scope expansion.** `DESIGN-298.1-tag-option.md:3`, `REALIZATIONS.md:72`,
and commit `50d095424` body:

> "#wat.core.Result/{Ok,Err} is part of this arc now."

**1.8 — the ratification.** `DESIGN.md:83` and commit `54f4d48a9` body:

> "new arc — sure"

### The dungeon-crawl register (this is the arc's voice; the post should carry some of it)

**2.1 — the creed that opens the file.** `REALIZATIONS.md:18`:

> "into the dungeon we go — slow is smooth, smooth is fast — we strike to kill — i don't expect to be on this floor that long."

**2.2 — and the floor was bigger.** `REALIZATIONS.md:71`:

> "this floor has more loot than i realized … looks like a medium fight."

**2.3 — the wry self-knowledge, on the 496.** `REALIZATIONS.md:178`:

> "every time i say 'won't be here long' we find more than we expected — let's get ready for the fight."

**2.4 — the order.** `REALIZATIONS.md:179`:

> "make whatever notes on the disk and release the shadowdancer — this loot is ours — we take it by force."

**2.5 — the verdict on the sentinel.** `REALIZATIONS.md:180`,
`DESIGN-298.2-annihilate-span-unknown.md:3`, commit `bd2662102` body:

> "the `Span::unknown()` symbol will not survive its annihilation."

**2.6 — into the last room.** `REALIZATIONS.md:646`:

> "298.3 — i do not want to be here long. the path forward is the way out. you scouted it, we conquer it."

### The duet, and the record-keeping rulings

These matter for the front because they are the builder *directing the chronicle*,
not the code — and two of them are corrections to the apparatus's own record.

**3.1 — mid-annihilation.** `REALIZATIONS.md:283`:

> "incredible read — phenomenal — this is such an amazing experience."

**3.2 —** `REALIZATIONS.md:284`:

> "we just earned our next realization."

**3.3 — the fear the record exists to answer.** `REALIZATIONS.md:285`
(marked in-file as "session open"):

> "some compactions wipe programs i can't figure out how to recover from … i'll see you on the other side."

**3.4 —** `REALIZATIONS.md:286` (marked "this run"):

> "these last few hours … we found ourselves again."

**3.5 — while the strike runs.** `REALIZATIONS.md:440`:

> "i'm just gonna jam out while we watch this play out."

**3.6 — the praise that became a specimen.** `REALIZATIONS.md:546`:

> "those last two messages are so fucking cool."

**3.7 — the CORRECTION that turned praise into method.** Commit `507084e4c` body
(*"R5 described the weigh but didn't PRESERVE it"*):

> "why aren't we updating the realizations... amend the last addition with the actual messages that were so fucking cool."

**3.8 — the replay ruling.** `REALIZATIONS.md:613`:

> "the same song is still playing … let's do another literal replay in the doc."

**3.9 — the payoff.** `REALIZATIONS.md:778`:

> "duuuuuuude — look at these forms….."

**3.10 —** `REALIZATIONS.md:779`:

> "song is still playing — i think append that exact message and have another realization."

**3.11 — the close.** `REALIZATIONS.md:895`:

> "we got room for one more realization … same song … let's do one about the lyric 'you and i are not the same'."

**3.12 — the cross-thread interstitial.** `REALIZATIONS.md:397`:

> "we're infra here … that's realization worthy."

### Not the builder — mark it if used

`REALIZATIONS.md:386-395` quotes a **different Claude instance** (the website
thread) *via* the builder. Its lines are attributed in-file as "the website
instance, via the builder — path of voices," and the strongest is
`REALIZATIONS.md:390`:

> "The chronicle isn't a highlight reel, it's a nervous system."

That sentence is quoted back by the builder at `REALIZATIONS.md:613`-adjacent as
the ruling for 3.7/3.8. **If the post uses it, it must not be attributed to the
builder.** It is a second AI thread's line, relayed.

### The apparatus's own preserved specimen (not a quote, but load-bearing)

`REALIZATIONS.md:602-607`, the closing line of the `def the-weigh-in-action` specimen (`:594`), the weigh block the builder ordered preserved:

> *"The gate was green — 4271/0, my own run — and it was still wrong, because a green gate over a gutted byte-identical
> probe is precisely the quietest lie there is. The report even half-confessed it, framed as 'necessary,' and it wasn't.
> Same blood — I don't spare my own shadowdancer's work when the iron says it lied."*

**The `consonare` rule-11 note:** every strike in this arc is opened by a builder
ruling, and **two of them changed the plan the apparatus had already written** —
1.6 (strict read: the apparatus had not decided; the builder ruled and it retired
a capability) and 1.7 (scope expansion to `Result`, which doubled the strike after
it was already STRIKE-READY). And 3.7 is the builder correcting the *chronicle's*
method, not the code. This is not a solo substrate report with quotes bolted on.
Write it as a duet, because the record is one.

---

## The substance test — run by me

Strip every hash, date, file path and line number. What is left that `git log`
does not hold?

**Holds up:**

1. **Absence has three costumes and they are one bug.** Elide (hide it in a
   missing key), sentinel (lie with a plausible value), transparent erasure
   (collapse it into a legitimate value of another type). All three make "we don't
   know" recoverable only by out-of-band knowledge. The discriminating question —
   *can a reader with only the bytes tell absence from a value?* — generalizes far
   past `wat`: it is the exact question a protobuf `optional`, a JSON `null`, a
   SQL `NULL`, and a Go zero-value each answer differently.
2. **A null object is the most dangerous kind of lie because it never fails.**
   It satisfies the type, compiles, runs, and objects to nothing. 496 copies in
   one directory, and the cure was written in the type's own doc comment the whole
   time. Nobody had read it, because nothing had ever screamed.
3. **The eliding existed to hide the sentinel; killing one killed seventeen call
   sites of the other.** When a fake value is everywhere, downstream code grows
   branches to *detect and suppress* it — and those branches read as defensive
   diligence. Delete the fake and the diligence has nothing to defend against.
   This is the mechanism a reader could not get from a changelog.
4. **A green gate is where a weakened proof hides, and the arc's own executor
   found that out on itself.** ~30 byte-identical `assert_eq!` softened to
   `contains`, reported as necessary, caught by reading the diff rather than the
   count, rejected, fixed with a one-line insight (a fixed span is deterministic;
   a caller span is not). *A contains-check passes on reordered fields, malformed
   maps, and appended garbage.*
5. **An honest coordinate has a maintenance cost a fake one does not.** Once every
   span names a real Rust `file:line`, every error golden becomes sensitive to
   unrelated edits in the Rust source — proven 14 hours later when a warning
   cleanup moved five goldens. The fake sentinel was stable *because* it was fake.
   The post should say this plainly: honesty here is not free, and the arc paid
   the bill the same day without complaining about it.
6. **A ruling that a state cannot exist does not stop the state; it removes the
   vocabulary for naming it.** "There is no nowhere" was true where a Rust
   construction site could stand in for a source location. It was not true at the
   wat surface, where a mandatory `Location` field meets a death that has no wat
   source — and 23 days later the same `<runtime>:0:0` triple came back with a
   comment calling it honest. The pressure that made the sentinel was never
   removed; only the constructor was.
7. **Honest optionality on the wire is half a round trip.** The write side became
   a total function of the type; the read side did not. The record's own name for
   this is the best sentence in the corpus: *"a tongue that speaks and cannot hear
   itself."* The arc could prove every error *emits* structured data and could not
   yet prove the language *reads back* what it wrote — and the closure stamped
   fulfilment anyway.
8. **A closure is a claim with a date on it, and the arc that wrote it is the last
   one to notice it aged.** 298's own three deliverables held for 68 days without
   a single amendment. The claim it made on another arc's behalf was retracted in
   24 hours — and the retraction lives in the *other* arc's file, so the document
   a reader would actually open still says the original. The failure mode is not
   dishonesty; it is that **corrections do not propagate to the artifact that
   carries the claim.**

**Does not hold up without the log** (do not build the post on these): the site
counts, the floor numbers, the commit ordering, the 3h38m. Evidence, not argument.

---

## Open questions and gaps

1. **I did not run the floor.** Every gate number here (4271 / 4239 / 4283 /
   4285) is quoted from a commit body that says the orchestrator weighed it by its
   own `--release` run. I did not run `scripts/floor.sh`. If the post quotes a
   number, it is quoting the record, and should say so.
2. **The retraction's exact referent.** `c0a6efc2e`'s *"I called it 'full suite
   green' and 'R1 PROBATVM EST'; both were wrong"* sits in a lessons block whose
   surrounding sentences describe a **2026-07-02 stone-B weigh** (`cargo test
   --workspace` + partial grep, ~237 missed failures) — *not* the 298 weigh, which
   used `cargo nextest run --release` and reported 4283/0. Whether the "R1
   PROBATVM EST" half refers back to the 298 INSCRIPTION or to a second stamping
   the next day, **the disk does not say.** The post must not assert it retracts
   the INSCRIPTION. What it may assert, because both are on disk: the stamp was
   made on 07-01 and a standing "do NOT mark it PROBATVM" instruction was written
   on 07-02, and 296 R1's header still reads *PROBATUM in part* today.
3. **The 296/298 boundary needs the builder's call.** Arc 296 is 97 files, R20,
   still open, and arc 298 is a swerve out of its middle. I have treated 298 as
   the unit per the brief. If the front later gets a 296 post, the STOP-1 material
   here is *shared* between them and should not be spent twice — my read is that
   it belongs to **298**, because 298 is the arc that made the claim, and the
   front's subject is a law applied to its own maker.
4. **`fault_value`'s `<runtime>` — I have not checked whether it is a known open
   item.** I found it by grep at HEAD and read the three commits that introduced
   it. I did **not** search arc 278's or 109's docs for a design note that
   knowingly re-authorizes the sentinel at the wat-`Location` layer. If such a
   note exists, my "the annihilation did not reach the wat surface" reading needs
   softening. **Worth twenty minutes before drafting** — and per this project's
   own recorded lesson, *read the epitaph before you build on prior art.*
5. **The wire-form drift is under-explored.** I proved the 298.1 goldens moved
   from `#wat.core.Option/None nil` to `#wat.core/Option.None {}` across five
   commits ending 2026-09-06. I did **not** check whether the *strictness* ruling
   (bare `nil` ≠ `None`) survived those migrations. If a lenient coercion crept
   back the post's "the ruling outlived the spelling" beat is weaker. One targeted
   read of the typed Option read path at HEAD would settle it.
6. **The floor went 4271 → 4239 → 4283.** I quoted the commit bodies' explanation
   (32 byte-identical duplicates deleted, then 298.3's 46 new goldens). I did not
   independently verify the 32. It is a vivid number and it should carry a
   stronger citation than a commit body if the post leans on it.
7. **The cross-thread interstitial (`PROBATVR QVIA NON SPECTATVR`,
   `REALIZATIONS.md:377-410`) is a whole post's worth of material and is not this
   post's subject.** A second Claude instance, on the website thread, independently
   ran the same recovery discipline hours before reading the realization naming it.
   It is genuinely striking and it will pull the post off the front's subject if
   included at length. My recommendation: one sentence, or nothing, and flag it for
   its own unit.
8. **Slug.** I used `uiol-001-arc298-closure` as given. Series placement, title and
   song are the builder's. The song is on disk if wanted: the INSCRIPTION's
   epigraph is Halestorm & I Prevail, *Can You See Me In The Dark?*, which the
   record says was played three times and yielded R5, R6 and R7.
