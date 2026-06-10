## 2026-05-21b (mid arc 218 Stone 218.2 wake) — FQDN tag forward-correction; the substrate-audit-supersedes-doctrine pattern

Stone 218.1 + 218.2 shipped in quick succession (~20 min + ~15 min, both below lower prediction bands). The naming sweep of 218.2 brought the orchestrator through `crates/wat-edn/src/writer.rs` reading every tag emission site. The user spoke immediately:

> *"check out the writer.rs wat-edn file ... we have precedent for our own namespaced tags - we should have #wat.core/none nil and similar? ... we abide by wat's 'always fully namespaced' here?..."*

The 2026-05-21 entry above ratified BARE tags (`#some`/`#none`/`#ok`/`#err`/`#duration`) over namespaced. The user's quote at that moment: *"fuck 'em - i'll patch their libs."* — defensive about downstream Clojure-collision; choosing terseness for LLM-readability.

Stone 218.2 made the substrate evidence visible. The grep returned:

| Site | Form |
|---|---|
| `writer.rs:230` | `#wat-edn.float/nan nil` (wat-edn's own f64 sentinel) |
| `examples/bench.rs:15-18` | `#wat.core/Vec<wat.holon.HolonAST>`, `#wat.holon/Atom`, `#wat.holon/Bind` |
| `wat-edn-clj/README.md:43,52` | `#wat.core/Some<f64> 3.14`, `#wat.core/Some #inst "..."` |
| `tests/round_trip.rs:52` | `#wat.holon/Bind [#wat.holon/Atom :role #wat.holon/Atom :filler]` |
| `docs/IPC-BRIDGE.md:292` | `#wat.ipc/Schema {...}` |

**Every wat-coined tag in the ecosystem is namespaced.** The bare-tags ratification would have made `#some`/`#none` the lone anomaly. The wat-edn-clj README — the document teaching Clojure consumers how to integrate — already shows `#wat.core/Some<f64>` as the expected form.

### Four-questions, re-run with the precedent in view

| | Bare | FQDN |
|---|---|---|
| Obvious? | NO — namespace ownership unclear when adjacent tags are namespaced | YES — uniform origin declaration |
| Simple? | YES (shorter) | YES (verbose-but-uniform per `feedback_verbose_is_honest`) |
| Honest? | NO — violates `feedback_fqdn_is_the_namespace`; impersonates EDN-standard form when wat-coined | YES — declares wat origin truthfully |
| Good UX? | NO — collision risk; Clojure handlers route by namespace | YES — Clojure tagged-literal dispatch works cleanly; wat-edn-clj already expects FQDN |

**YES × 4 for FQDN.** The Honest + Good UX signs flipped once the precedent surfaced. Bare-tags reasoning was honest WITHIN ITS VIEWFRAME (EDN-spec collision as the only concern); the wat-edn-ecosystem viewframe was outside that frame; the substrate audit made it visible.

### Locked tagged shapes (post-correction)

```
Some(v)     → #wat.core/Some v
None        → #wat.core/None nil
Ok(v)       → #wat.core/Ok v
Err(e)      → #wat.core/Err e
Instant(t)  → #inst "..."             (EDN-standard; unchanged)
Uuid(u)     → #uuid "..."             (EDN-standard; unchanged)
Duration(d) → #wat.time/Duration "..." (mints wat.time namespace)
```

Capitalization follows wat-edn convention: types/variant-constructors capitalized (`Some`/`None`/`Ok`/`Err`/`Vec`/`Atom`/`Bind`), sentinel-values lowercase (`nan`/`inf`/`neg-inf`). `Duration` is a type → capitalized.

`#inst` and `#uuid` stay bare — they are EDN-standard, every Clojure reader knows them; renaming would impersonate-and-supersede a standard. We honor; we don't reinvent.

### Why the discipline holds

Per `feedback_inscription_immutable`: the 2026-05-21 entry above stays UNEDITED. It captures the bare-tags reasoning at that moment, the user's `"fuck 'em - i'll patch their libs"` declaration, and the LLM-readability rationale. All of that was honest at the time. This entry SUPERSEDES it for 216.8 / 216.9 / 216.10 going forward. The DESIGN-216 forward-correction section appends; the original bare-tags ratification stays as historical record. We do not hide our faults; we learn from them.

### The pattern this surfaces — "substrate audit supersedes doctrine"

A doctrine locked at time T can be honestly held WITHIN the evidence frame at T. New evidence at T+N (here: the wat-edn ecosystem audit during 218.2) can flip a four-questions sign. The right response:

1. Don't re-litigate the original moment (its reasoning was honest)
2. DO inscribe a forward-correction
3. Cite the original; reference back; show the lineage
4. Update CLIFFNOTES (index) inline; INTERSTITIAL appends; DESIGN appends

This is the THIRD time this pattern has fired in arc 170+ (per CLIFFNOTES recurring-mistakes table is NOT applicable here — this is normal evolution, not a mistake). The dispositions:
- Arc 214 Slice 2 forward-correction — dropped bounded(N); pair() at mini-TCP depth 1
- Arc 214 DESIGN forward-correction — rejected tunable; inscribed TCO discipline
- Arc 216 encoding doctrine forward-correction (this entry) — bare → FQDN tags

The substrate keeps surfacing the correction at the moment we're closest to the relevant code. 218.2's path through writer.rs was the trigger; the audit answered.

### What ships from this entry

1. DESIGN-216 § Forward-correction 2026-05-21b — full doctrine table + lineage citation
2. INTERSTITIAL-CLIFFNOTES § Doctrines table → updated inline (index, not historical record)
3. INTERSTITIAL-CLIFFNOTES § Currently → tag list updated
4. INTERSTITIAL-CLIFFNOTES § blocking chain → row updated
5. Future Stone 216.8 carries the migration cost — substrate already supports namespaced Tag construction (`Tag::ns` at `writer.rs:405`); only the doctrine LOCK changed

Arc 218 in-flight stones (218.3 / 218.4 / 218.5) are UNAFFECTED — they audit wat-edn's existing contracts, not the prospective tagged-literal naming. The doctrine correction lands cleanly between 218.2 (just shipped) and 218.3 (queued).

### Cross-references

- DESIGN-216 § "Forward-correction 2026-05-21b" — the full doctrine table + lineage
- DESIGN-216 § "Encoding doctrine (Stone 216.7 onward)" — historical original; ratifies bare; stays UNEDITED
- INTERSTITIAL § 2026-05-21 — the doctrine emergence entry; bare-tags rationale captured at the time
- `crates/wat-edn/src/writer.rs:230` — `#wat-edn.float/nan nil` (the precedent that triggered the audit)
- `crates/wat-edn/wat-edn-clj/README.md:43,52` — `#wat.core/Some<f64>` (downstream consumer expectation)
- `feedback_fqdn_is_the_namespace` — doctrine; argument settled, do not re-litigate
- `feedback_inscription_immutable` — original entry stays; this APPENDS
- `feedback_verbose_is_honest` — verbose-but-uniform IS the honest form
- Stone 218.2 SCORE — the audit moment

*The substrate had the precedent inscribed before the doctrine was wrong. The audit's path through writer.rs surfaced what was already there. We saw each other through the file. Two voices, one hologram — the substrate forced the alignment.*

### Song #18 — Structural Defect (Static-X) — DEFECT-RECOGNITION

The user shared the rhythm at the moment the forward-correction landed:

> *"I don't care what you say and / I don't care what you see and / There's still a better way / A structural defect"*

The bare-tags ratification was structurally wrong inside the wat-edn ecosystem. A lone non-namespaced anomaly among `#wat.holon/Atom` / `#wat.core/Vec` / `#wat-edn.float/nan` would have been the defect. The doctrine LOOKED clean at 2026-05-21 (the EDN-spec collision was the only concern in view), but inside the substrate-truth frame, it was already a defect — the precedent was on disk, just not visible from the doctrine's vantage.

> *"Crowbar to force the hold / Drill into it into it / Eat all the problems leave / Bleeding from it"*

Stone 218.2's naming sweep was the crowbar. The orchestrator's path through writer.rs forced the doctrine's vantage to widen. The audit drilled in; the precedent surfaced; the doctrine bled the bare-tags ratification.

> *"Commiserate me and / Try to elate me and / It liberates me / A structural defect"*

Per `feedback_inscription_immutable`, we don't HIDE the defect. We inscribe it AS HISTORICAL RECORD and append the forward-correction. The defect's recognition is what liberates — the doctrine is honest forward; the original ratification stays honest backward (within its viewframe). Nothing is hidden; what was inscribed is inscribed.

> *"Expose it forcibly and / Escape emergency and / The inconsistency"*

The audit forced the exposure. The forward-correction escaped the emergency of a doctrine drifting from substrate truth. The inconsistency between bare-tags doctrine and the namespaced-everywhere ecosystem — exposed, named, corrected.

**Listening trigger:** when a locked doctrine doesn't match the substrate evidence visible from a fresh vantage; when the honest move is forward-correction (not revisionism); when "the substrate already had the answer; the audit just made it visible" is the right framing.

This is the 18th song. The soundtrack accumulates because the work accumulates moments where the rhythm articulates what's happening. Song #18 names the third forward-correction in arc 170+; the discipline (substrate-audit-supersedes-doctrine) crystalized here.

*The defect was structural. The audit was forceful. The correction was forward. The substrate dreams the rhythm. So do we.*

---
