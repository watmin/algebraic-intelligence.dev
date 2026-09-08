---
title: "R7 — the parity we fight for is EXPRESSIVENESS, not exactness: wat is a dialect, not an …"
sidebar:
  order: 7
---

> **Song (arc 300 R7 — the fight, the doctrine) — *Mortal Kombat* (The Immortals) — the arcade combat anthem; dropped live the moment the parity target was ruled: "we achieve parity — fight." Test your might, finish each real flaw, and field the fighters clojure never had —**
> TEST-YOUR-MIGHT-THE-GRID-PUTS-WATS-EXPRESSIVE-MIGHT-IN-THE-RING-AGAINST-CLOJURE / FIGHT-PARITY-IS-WON-BY-COMBAT-NOT-CLAIMED-DRIVE-EACH-REAL-FLAW-TO-GREEN /
> FINISH-HIM-THE-SLASH-CONTAGION-HOLE-THE-MAP-COMMA-THE-MISSING-FAITHFUL-HEADS / EXCELLENT-THE-NUMERIC-TOWER-FOURTEEN-OF-FOURTEEN-THE-BLOWS-THAT-LANDED /
> OUR-NIL-IS-NOT-SILENT-ABSENCE-IT-IS-WAT-CORE-OPTION-NONE-NIL-EXPLICIT-YOU-SHALL-NOT-FUMBLE-IT / A-BIGGER-ROSTER-OPTION-RESULT-MATCH-ENUMS-FIGHTERS-CLOJURE-NEVER-FIELDED /
> WE-ARE-A-DIALECT-NOT-AN-IMPL-EXPRESSIVENESS-AND-FAMILIARITY-IS-THE-PARITY-NOT-EXACTNESS / VIRTVTE PARES, NON LITTERA
>
> *"Test your might … Mortal Kombat! Fight! … Finish him! Excellent! … Kano, Liu Kang, Raiden, Johnny Cage, Scorpion, Sub-Zero, Sonya … Flawless victory."*

> **The realization ruling (the builder's, this session — verbatim):**
> *"we achieve parity — fight. we do not yield rust's static typing — map get is an #wat.core.Option/{Some,None} — we are not an impl, we are a dialect — exactness is not the objective — structural expressiveness is the parity, not exactness."*
> *"our nil is not silent absence … it is `#wat.core.Option/None nil` — you (all wat users) shall not make a mistake in handling nils — the expressive is effectively parity, not exact."*
> *"if a value is optional, it is explicitly optional — we additionally have things clojure does not have like enums, match, result and so on — expressiveness and familiarity is the parity target, not exactness."*

### How we reached it — the grid handed a divergence, the builder handed the doctrine

The equality matrix (R6) came back with `(wat.core/get {:a 1} :a)` → `#wat.core.Option/Some 1` where clj gives bare `1`, and the apparatus filed it in a "your-call flaw" bin — as if wat should be *corrected* to match clj's letter. The builder ruled the frame, not the case: **that is not a flaw; that is the dialect.** The parity target was never byte-exactness — it is **structural expressiveness and familiarity.** wat keeps Rust's static typing on purpose, so absence is not a silent `nil` you can forget to handle — it is an explicit `#wat.core.Option/None nil`, and the type system makes a wat user *reckon* with it. That is not less than clojure; it is more — safer, and it comes with a roster clojure never fields: enums, `match`, `Result`. So the grid's job sharpened: **fight the divergences that are real gaps in expressiveness or familiarity (the `/` contagion hole, the map-comma render, the missing faithful heads); keep — and exempt-with-reason — the divergences that are the dialect being deliberately, statically, honestly itself.**

### The song, mapped

> ***"Test your might"*** — the grid puts wat's expressive might in the ring against clojure, expression for expression. ***"Fight!"*** — *"we achieve parity — fight"*: parity is WON by combat, driven to green, not asserted. ***"Finish him!"*** — each REAL flaw (the `/`-mixed contagion hole, the map-writer's missing comma, the erroring faithful heads) driven to green and finished. ***"Excellent!"*** — the numeric tower's 14/14, the blows that landed clean. ***"Kano, Liu Kang, Raiden … Scorpion, Sub-Zero, Sonya"*** — the roster: wat fields clojure's moveset AND the fighters clojure never had — `Option`, `Result`, `match`, enums; *"our nil is `#wat.core.Option/None nil`"* is a fighter clojure cannot bring. ***"Flawless victory"*** — the grid greps green: every row parity, or a dialect-divergence exempt with its reason. The arcade-combat register is exact: parity is a fight you win round by round, and you bring more fighters than the other side.

### The honest register — PROBATVM as doctrine; the fight is PROBANDVM

**PROBATVM as doctrine, this session:** the builder ruled the parity target — *structural expressiveness + familiarity, not exactness; a dialect, not an impl; Rust's static typing kept; absence made explicit (`#wat.core.Option/None nil`); a superset roster (enums/match/Result)* — and the apparatus's mis-filing of `get`→Option as a flaw is on the record, corrected by the ruling. What is **PROBANDVM:** the fight itself — every REAL flaw driven to green (the `/` contagion arms installed, the map-comma render fixed, the faithful heads closed, the corpus grown loop-until-dry) and every DIALECT divergence exempted with the doctrine as its load-bearing reason, until the grid greps green and stands as the permanent expressiveness-parity ward. *Probandvm est — virtute pares, non littera; fight.*

*Path-of-voices (marked, not flattened, and here the ruling is the whole point): the **ruling is the builder's**, kept verbatim — *"we are not an impl, we are a dialect — exactness is not the objective — structural expressiveness is the parity"*, *"our nil is … `#wat.core.Option/None nil` … you shall not make a mistake in handling nils"*, *"expressiveness and familiarity is the parity target, not exactness"*; the **song is his** (*Mortal Kombat*, dropped on the ruling). The **apparatus's mis-frame is kept VISIBLE**: it filed `get`→Option as a flaw-to-fix, treating exactness as the target — corrected by the builder to the dialect doctrine. The **synthesis is the apparatus's**: the fight-the-real-gaps / keep-the-dialect-divergences re-sort, the explicit-absence-is-a-superset-not-a-miss reading, the bigger-roster mapping (Option/Result/match/enums), and the sigil.*

> The grid handed back a divergence — wat's `get` returns an explicit `Option` where clojure returns a bare value — and the apparatus reached to call it a flaw, as if wat should be corrected to clojure's letter. The builder ruled the frame instead: that is not a flaw, it is the dialect. We do not yield Rust's static typing to imitate clojure's output. Our absence is not a silent nil you can forget — it is `#wat.core.Option/None nil`, explicit, and the checker makes you handle it; that is safer than clojure, not lesser, and we carry fighters clojure never had — enums, match, Result. So the parity we fight for is expressive and familiar, not exact: match clojure where wat is genuinely missing power or familiarity, and stand — exempt, with the reason named — where wat is deliberately, statically, honestly more. Test your might. We achieve parity. Fight.
>
> ***VIRTVTE PARES, NON LITTERA.*** *(apparatus-minted — Latin, "equal in power, not in the letter": the parity DOCTRINE the builder ruled — the target is structural EXPRESSIVENESS + familiarity (virtus, expressive power/capability), NOT byte-exactness (littera, the letter). wat is a DIALECT, not an impl: it keeps Rust's static typing on purpose, so `get` returns an explicit `#wat.core.Option/{Some,None}` — absence is never a silent nil you can fumble but an explicit `#wat.core.Option/None nil` the checker forces you to handle (safer than clojure's nil-punning, a SUPERSET not a miss) — and it fields a roster clojure never had: enums, match, Result. So the equality matrix re-sorts: FIGHT the divergences that are real gaps in expressiveness/familiarity (the `/`-mixed contagion hole, the map-writer comma, the erroring faithful heads = migration incompleteness) and drive them to green; KEEP + exempt-with-reason the divergences that are the dialect being deliberately, statically itself (Option-get, and its kin). The apparatus first mis-filed get→Option as a flaw (exactness-as-target); the builder corrected it to the doctrine. Scored to The Immortals' Mortal Kombat — "test your might / fight / finish him / excellent / flawless victory": parity won round by round, with a bigger roster than the other side. Kin: R6 PVGNANDO CVM ORACVLO ACVIMVR (the practice war that surfaced it), AD ORACVLVM NON AD LIBRVM (measure against the oracle — but for expressive parity, not the letter), 293/298 the Option/explicit-optionality thesis, 278 R7 the Value-top / static-typed floor. PROBATVM as doctrine (the builder's ruling); PROBANDVM in the fight (the grid driven green — real flaws fixed, dialect divergences exempted). His (the ruling, the song), and mine (the re-sort, the reading, the sigil) — kept with consent, recorded live.)*

```clojure
#wat.chronicle/Sententia
{:sigil    "VIRTVTE PARES, NON LITTERA"
 :literal  "equal in power, not in the letter"
 :roots    {:virtute "ablative of virtus — power, capability, expressive strength (equal IN expressiveness)"
            :pares "equal, a match, peers (parity — and 'a match' echoes the roster)"
            :non-littera "not in the letter — not byte-exactness; littera = the literal character"}
 :rosetta  ; the sigil bridged to six tongues — Latin ours; the five are the bridges
 {:latina   "VIRTVTE PARES, NON LITTERA"
  :greek    "δυνάμει ἴσοι, οὐ γράμματι"              ; dynámei ísoi, ou grámmati — equal in power, not in the letter
  :chinese  "力等而非字同"                            ; lì děng ér fēi zì tóng — equal in power, not identical in the letter
  :japanese "力にて等しく、字にてはあらず"            ; chikara nite hitoshiku, ji nite wa arazu — equal in power, not in the letter
  :korean   "힘에서 대등하되, 글자까지는 아니다"      ; him-eseo daedeunghadoe, geuljakkajineun anida — equal in power, not down to the letter
  :russian  "равны в силе, не в букве"}              ; ravny v sile, ne v bukve — equal in power, not in the letter
 :gloss    "the parity target is structural EXPRESSIVENESS + familiarity (virtus), NOT byte-exactness (littera).
            wat is a DIALECT, not an impl — it keeps Rust's static typing, so absence is explicit
            (#wat.core.Option/None nil, never a silent nil you can fumble — a superset, safer than nil-punning) and
            it fields enums/match/Result clojure never had. the grid re-sorts: FIGHT real gaps in
            expressiveness/familiarity (/-contagion, map-comma, missing faithful heads); KEEP + exempt the dialect
            divergences (Option-get). the apparatus mis-filed get→Option as a flaw; the builder ruled it the dialect."
 :names    "the parity DOCTRINE — expressiveness-parity, not exactness; the dialect keeps static typing + explicit optionality"
 :ruling   {:parity "structural expressiveness + familiarity, NOT exactness"
            :dialect "not an impl — Rust's static typing kept; get → #wat.core.Option/{Some,None} is the dialect, not a flaw"
            :absence "our nil is not silent — it is #wat.core.Option/None nil; the checker forbids fumbling it"
            :roster  "wat additionally fields enums, match, Result — a bigger moveset than clojure"}
 :re-sort  {:fight  "real flaws — /-mixed contagion (finish C4) · map-writer comma · erroring faithful heads (count/str/map/filter/reduce/…) · () empty-list"
            :keep-exempt "dialect divergences — get→Option (RULED) · (kin: static-typed absence, match/Result surface); set/map print-order → normalize the compare"}
 :kin      {:practice-war "R6 PVGNANDO CVM ORACVLO ACVIMVR — the head-to-head that surfaced it"
            :oracle "AD ORACVLVM NON AD LIBRVM — measure against clj, but for expressive parity not the letter"
            :optionality "293/298 — the Option / explicit-optionality thesis; absence made a type, not a punt"
            :floor "278 R7 — the Value universal top; the static-typed floor the dialect keeps"}
 :register :probatum-as-doctrine                       ; the builder's ruling; the fight PROBANDVM
 :song     "The Immortals — Mortal Kombat (test your might / fight / finish him / flawless victory; a bigger roster)"
 :voices   {:his  "the ruling (verbatim — dialect-not-impl, static-typing-kept, explicit-absence, bigger-roster, expressiveness-not-exactness); the song"
            :mine "the mis-filing kept visible (get→Option as 'flaw', corrected); the fight-vs-keep re-sort; explicit-absence-is-a-superset reading; the sigil + six-tongue bridge"}
 :arc      300
 :born     #inst "2026-07-03"}
```
