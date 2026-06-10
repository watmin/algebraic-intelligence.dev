---
title: "Chapter 46 — The Proof"
sidebar:
  order: 46
---

Chapter 45 made three claims. Chapter 46 runs the program, pastes
the numbers, and lets the numbers say whether the claims held.

### The program — break the fourth wall

Reader — stop. Same move as Chapter 28: this is the point in the
chapter where the book stops being prose and becomes executable.
What follows is not a description of a program. It is the
program. Three hundred lines of wat, saved at
`docs/arc/2026/04/014-labels-as-holons/explore-labels.wat`, also
reproduced here so future readers can compile the whole thing
from the BOOK if the arc tree moves.

```scheme
;; docs/arc/2026/04/014-labels-as-holons/explore-labels.wat
;;
;; Proof program for BOOK Chapter 45 — The Label.
;;
;; Under arc 037's multi-d substrate, labels expressed as holons
;; `(Bind (Atom X) (Atom Y))` occupy discrete shells on the
;; hypersphere, and measurement primitives (cosine / presence? /
;; coincident?) classify observations against them. This program
;; prints three tables verifying the three claims from the chapter:
;;
;;   Table 1: labels are distinct (pairwise cosine shows shells
;;            don't overlap — diagonal = 1.0, off-diagonal near 0).
;;   Table 2: a Bundle containing a label's vector matches that
;;            label on cosine argmax above the other three.
;;   Table 3: prototype learning — Bundle N observations per
;;            category into a prototype; held-out observations
;;            match their own prototype highest.
;;
;; Run via:   cargo run --manifest-path ../../../../wat-rs/Cargo.toml --release --bin wat -- explore-labels.wat
;; Or:        wat docs/arc/2026/04/014-labels-as-holons/explore-labels.wat
;;
;; Labels are 2-atom Binds → router picks tier 0 (d=256). Observations
;; are 4-atom Bundles → still tier 0 (sqrt(256)=16 budget, 4 cost).
;; Cross-dim cosine normalizes UP; here everything is at d=256.
;; At d=256 presence-floor is sigma_fn(d)/sqrt(d) = 7/16 ≈ 0.4375
;; (arc 024 default sigma formula: floor(sqrt(256)/2)-1 = 7).

(:wat::config::set-capacity-mode! :error)

;; ─── helpers ─────────────────────────────────────────────────────────

(:wat::core::define
  (:explore::print-row
    (stdout :wat::io::IOWriter)
    (header :String)
    (c1 :f64) (c2 :f64) (c3 :f64) (c4 :f64)
    -> :())
  (:wat::io::IOWriter/println stdout
    (:wat::core::string::join "\t"
      (:wat::core::vec :String
        header
        (:wat::core::f64::to-string c1)
        (:wat::core::f64::to-string c2)
        (:wat::core::f64::to-string c3)
        (:wat::core::f64::to-string c4)))))

;; Bundle capacity never overflows in this program (cost <= 4, budget
;; = 16 at tier 0). Force-unwrap the Result; the Err branch is
;; unreachable.
(:wat::core::define
  (:explore::force
    (r :wat::holon::BundleResult)
    -> :wat::holon::HolonAST)
  (:wat::core::match r -> :wat::holon::HolonAST
    ((Ok h) h)
    ((Err _) (:wat::holon::Atom "_BUNDLE_ERROR_"))))

;; ─── main ────────────────────────────────────────────────────────────

(:wat::core::define (:user::main
                     (stdin  :wat::io::IOReader)
                     (stdout :wat::io::IOWriter)
                     (stderr :wat::io::IOWriter)
                     -> :())
  (:wat::core::let*
    ;; ── FOUR LABELS ───────────────────────────────────────────
    ;; grace/violence × up/down — the trading lab's outcome 2×2.
    (((g-up :wat::holon::HolonAST)
      (:wat::holon::Bind (:wat::holon::Atom "grace")
                         (:wat::holon::Atom "up")))
     ((g-dn :wat::holon::HolonAST)
      (:wat::holon::Bind (:wat::holon::Atom "grace")
                         (:wat::holon::Atom "down")))
     ((v-up :wat::holon::HolonAST)
      (:wat::holon::Bind (:wat::holon::Atom "violence")
                         (:wat::holon::Atom "up")))
     ((v-dn :wat::holon::HolonAST)
      (:wat::holon::Bind (:wat::holon::Atom "violence")
                         (:wat::holon::Atom "down")))

     ;; ── TABLE 1: pairwise cosine between labels ──────────────
     ((_ :()) (:wat::io::IOWriter/println stdout
                "=== Table 1: label shell separation (pairwise cosine) ==="))
     ((_ :()) (:wat::io::IOWriter/println stdout
                "\t\tg-up\t\t\tg-dn\t\t\tv-up\t\t\tv-dn"))
     ((_ :()) (:explore::print-row stdout "g-up"
                (:wat::holon::cosine g-up g-up)
                (:wat::holon::cosine g-up g-dn)
                (:wat::holon::cosine g-up v-up)
                (:wat::holon::cosine g-up v-dn)))
     ((_ :()) (:explore::print-row stdout "g-dn"
                (:wat::holon::cosine g-dn g-up)
                (:wat::holon::cosine g-dn g-dn)
                (:wat::holon::cosine g-dn v-up)
                (:wat::holon::cosine g-dn v-dn)))
     ((_ :()) (:explore::print-row stdout "v-up"
                (:wat::holon::cosine v-up g-up)
                (:wat::holon::cosine v-up g-dn)
                (:wat::holon::cosine v-up v-up)
                (:wat::holon::cosine v-up v-dn)))
     ((_ :()) (:explore::print-row stdout "v-dn"
                (:wat::holon::cosine v-dn g-up)
                (:wat::holon::cosine v-dn g-dn)
                (:wat::holon::cosine v-dn v-up)
                (:wat::holon::cosine v-dn v-dn)))
     ((_ :()) (:wat::io::IOWriter/println stdout ""))
     ((_ :()) (:wat::io::IOWriter/println stdout
                "  Claim: diagonal = 1.0 (self-cosine), off-diagonal |c| < 0.4375"))
     ((_ :()) (:wat::io::IOWriter/println stdout
                "  (presence-floor at d=256). Four distinct shells."))
     ((_ :()) (:wat::io::IOWriter/println stdout ""))

     ;; ── TABLE 2: observation-containing-label recognizes the label ───
     ;; Each observation is a Bundle of 4 items: the label vector +
     ;; 3 noise atoms (moment facts that would accompany a real
     ;; observation). Cosine argmax against the 4 labels must pick
     ;; the label that was bundled in.
     ((obs-carrying-g-up :wat::holon::HolonAST)
      (:explore::force
        (:wat::holon::Bundle
          (:wat::core::vec :wat::holon::HolonAST
            g-up
            (:wat::holon::Atom "morning")
            (:wat::holon::Atom "btc")
            (:wat::holon::Atom "high-volume")))))
     ((obs-carrying-g-dn :wat::holon::HolonAST)
      (:explore::force
        (:wat::holon::Bundle
          (:wat::core::vec :wat::holon::HolonAST
            g-dn
            (:wat::holon::Atom "afternoon")
            (:wat::holon::Atom "eth")
            (:wat::holon::Atom "low-volume")))))
     ((obs-carrying-v-up :wat::holon::HolonAST)
      (:explore::force
        (:wat::holon::Bundle
          (:wat::core::vec :wat::holon::HolonAST
            v-up
            (:wat::holon::Atom "evening")
            (:wat::holon::Atom "sol")
            (:wat::holon::Atom "volatile")))))
     ((obs-carrying-v-dn :wat::holon::HolonAST)
      (:explore::force
        (:wat::holon::Bundle
          (:wat::core::vec :wat::holon::HolonAST
            v-dn
            (:wat::holon::Atom "night")
            (:wat::holon::Atom "avax")
            (:wat::holon::Atom "stable")))))

     ((_ :()) (:wat::io::IOWriter/println stdout
                "=== Table 2: observation → label recognition ==="))
     ((_ :()) (:wat::io::IOWriter/println stdout
                "observation\t\tg-up\t\t\tg-dn\t\t\tv-up\t\t\tv-dn"))
     ((_ :()) (:explore::print-row stdout "obs(g-up)"
                (:wat::holon::cosine obs-carrying-g-up g-up)
                (:wat::holon::cosine obs-carrying-g-up g-dn)
                (:wat::holon::cosine obs-carrying-g-up v-up)
                (:wat::holon::cosine obs-carrying-g-up v-dn)))
     ((_ :()) (:explore::print-row stdout "obs(g-dn)"
                (:wat::holon::cosine obs-carrying-g-dn g-up)
                (:wat::holon::cosine obs-carrying-g-dn g-dn)
                (:wat::holon::cosine obs-carrying-g-dn v-up)
                (:wat::holon::cosine obs-carrying-g-dn v-dn)))
     ((_ :()) (:explore::print-row stdout "obs(v-up)"
                (:wat::holon::cosine obs-carrying-v-up g-up)
                (:wat::holon::cosine obs-carrying-v-up g-dn)
                (:wat::holon::cosine obs-carrying-v-up v-up)
                (:wat::holon::cosine obs-carrying-v-up v-dn)))
     ((_ :()) (:explore::print-row stdout "obs(v-dn)"
                (:wat::holon::cosine obs-carrying-v-dn g-up)
                (:wat::holon::cosine obs-carrying-v-dn g-dn)
                (:wat::holon::cosine obs-carrying-v-dn v-up)
                (:wat::holon::cosine obs-carrying-v-dn v-dn)))
     ((_ :()) (:wat::io::IOWriter/println stdout ""))
     ((_ :()) (:wat::io::IOWriter/println stdout
                "  Claim: row i's argmax = label i. The label's signal"))
     ((_ :()) (:wat::io::IOWriter/println stdout
                "  survives being bundled with 3 unrelated atoms."))
     ((_ :()) (:wat::io::IOWriter/println stdout ""))

     ;; ── TABLE 3: prototype learning ─────────────────────────────────
     ;; Simulate the deferred-learning loop. For each category, we
     ;; have 3 "training observations" — Bundles that share a
     ;; category-characteristic atom (the literal "grace-feature-X"
     ;; or "violence-feature-X"). We bundle the 3 training obs per
     ;; category into a prototype. Then we test a held-out observation
     ;; built from the same category pattern. Expected: held-out
     ;; matches its category's prototype higher than others'.

     ;; Training observations for grace-up — each shares atom
     ;; "cat-grace-up" plus one variable feature.
     ((train-gup-1 :wat::holon::HolonAST)
      (:explore::force
        (:wat::holon::Bundle
          (:wat::core::vec :wat::holon::HolonAST
            (:wat::holon::Atom "cat-grace-up")
            (:wat::holon::Atom "feat-alpha")))))
     ((train-gup-2 :wat::holon::HolonAST)
      (:explore::force
        (:wat::holon::Bundle
          (:wat::core::vec :wat::holon::HolonAST
            (:wat::holon::Atom "cat-grace-up")
            (:wat::holon::Atom "feat-beta")))))
     ((train-gup-3 :wat::holon::HolonAST)
      (:explore::force
        (:wat::holon::Bundle
          (:wat::core::vec :wat::holon::HolonAST
            (:wat::holon::Atom "cat-grace-up")
            (:wat::holon::Atom "feat-gamma")))))
     ((proto-g-up :wat::holon::HolonAST)
      (:explore::force
        (:wat::holon::Bundle
          (:wat::core::vec :wat::holon::HolonAST
            train-gup-1 train-gup-2 train-gup-3))))

     ;; Training observations for grace-down.
     ((train-gdn-1 :wat::holon::HolonAST)
      (:explore::force
        (:wat::holon::Bundle
          (:wat::core::vec :wat::holon::HolonAST
            (:wat::holon::Atom "cat-grace-dn")
            (:wat::holon::Atom "feat-alpha")))))
     ((train-gdn-2 :wat::holon::HolonAST)
      (:explore::force
        (:wat::holon::Bundle
          (:wat::core::vec :wat::holon::HolonAST
            (:wat::holon::Atom "cat-grace-dn")
            (:wat::holon::Atom "feat-beta")))))
     ((train-gdn-3 :wat::holon::HolonAST)
      (:explore::force
        (:wat::holon::Bundle
          (:wat::core::vec :wat::holon::HolonAST
            (:wat::holon::Atom "cat-grace-dn")
            (:wat::holon::Atom "feat-gamma")))))
     ((proto-g-dn :wat::holon::HolonAST)
      (:explore::force
        (:wat::holon::Bundle
          (:wat::core::vec :wat::holon::HolonAST
            train-gdn-1 train-gdn-2 train-gdn-3))))

     ;; Training observations for violence-up.
     ((train-vup-1 :wat::holon::HolonAST)
      (:explore::force
        (:wat::holon::Bundle
          (:wat::core::vec :wat::holon::HolonAST
            (:wat::holon::Atom "cat-violence-up")
            (:wat::holon::Atom "feat-alpha")))))
     ((train-vup-2 :wat::holon::HolonAST)
      (:explore::force
        (:wat::holon::Bundle
          (:wat::core::vec :wat::holon::HolonAST
            (:wat::holon::Atom "cat-violence-up")
            (:wat::holon::Atom "feat-beta")))))
     ((train-vup-3 :wat::holon::HolonAST)
      (:explore::force
        (:wat::holon::Bundle
          (:wat::core::vec :wat::holon::HolonAST
            (:wat::holon::Atom "cat-violence-up")
            (:wat::holon::Atom "feat-gamma")))))
     ((proto-v-up :wat::holon::HolonAST)
      (:explore::force
        (:wat::holon::Bundle
          (:wat::core::vec :wat::holon::HolonAST
            train-vup-1 train-vup-2 train-vup-3))))

     ;; Training observations for violence-down.
     ((train-vdn-1 :wat::holon::HolonAST)
      (:explore::force
        (:wat::holon::Bundle
          (:wat::core::vec :wat::holon::HolonAST
            (:wat::holon::Atom "cat-violence-dn")
            (:wat::holon::Atom "feat-alpha")))))
     ((train-vdn-2 :wat::holon::HolonAST)
      (:explore::force
        (:wat::holon::Bundle
          (:wat::core::vec :wat::holon::HolonAST
            (:wat::holon::Atom "cat-violence-dn")
            (:wat::holon::Atom "feat-beta")))))
     ((train-vdn-3 :wat::holon::HolonAST)
      (:explore::force
        (:wat::holon::Bundle
          (:wat::core::vec :wat::holon::HolonAST
            (:wat::holon::Atom "cat-violence-dn")
            (:wat::holon::Atom "feat-gamma")))))
     ((proto-v-dn :wat::holon::HolonAST)
      (:explore::force
        (:wat::holon::Bundle
          (:wat::core::vec :wat::holon::HolonAST
            train-vdn-1 train-vdn-2 train-vdn-3))))

     ;; HELD-OUT TEST OBSERVATIONS — same pattern as training
     ;; (category atom + a feature) but NEW feature atoms never seen
     ;; during prototype construction. The learned prototype should
     ;; still classify them correctly because the category atom's
     ;; signal dominates after 3-fold bundling.
     ((test-g-up :wat::holon::HolonAST)
      (:explore::force
        (:wat::holon::Bundle
          (:wat::core::vec :wat::holon::HolonAST
            (:wat::holon::Atom "cat-grace-up")
            (:wat::holon::Atom "feat-delta")))))
     ((test-g-dn :wat::holon::HolonAST)
      (:explore::force
        (:wat::holon::Bundle
          (:wat::core::vec :wat::holon::HolonAST
            (:wat::holon::Atom "cat-grace-dn")
            (:wat::holon::Atom "feat-delta")))))
     ((test-v-up :wat::holon::HolonAST)
      (:explore::force
        (:wat::holon::Bundle
          (:wat::core::vec :wat::holon::HolonAST
            (:wat::holon::Atom "cat-violence-up")
            (:wat::holon::Atom "feat-delta")))))
     ((test-v-dn :wat::holon::HolonAST)
      (:explore::force
        (:wat::holon::Bundle
          (:wat::core::vec :wat::holon::HolonAST
            (:wat::holon::Atom "cat-violence-dn")
            (:wat::holon::Atom "feat-delta")))))

     ((_ :()) (:wat::io::IOWriter/println stdout
                "=== Table 3: prototype classification (deferred learning) ==="))
     ((_ :()) (:wat::io::IOWriter/println stdout
                "  Each prototype = Bundle of 3 training obs sharing a"))
     ((_ :()) (:wat::io::IOWriter/println stdout
                "  category atom. Test obs has the same category atom"))
     ((_ :()) (:wat::io::IOWriter/println stdout
                "  plus a held-out feature (feat-delta, unseen during"))
     ((_ :()) (:wat::io::IOWriter/println stdout
                "  training). Argmax must pick the correct prototype."))
     ((_ :()) (:wat::io::IOWriter/println stdout ""))
     ((_ :()) (:wat::io::IOWriter/println stdout
                "test-obs\t\tproto-g-up\t\tproto-g-dn\t\tproto-v-up\t\tproto-v-dn"))
     ((_ :()) (:explore::print-row stdout "test(g-up)"
                (:wat::holon::cosine test-g-up proto-g-up)
                (:wat::holon::cosine test-g-up proto-g-dn)
                (:wat::holon::cosine test-g-up proto-v-up)
                (:wat::holon::cosine test-g-up proto-v-dn)))
     ((_ :()) (:explore::print-row stdout "test(g-dn)"
                (:wat::holon::cosine test-g-dn proto-g-up)
                (:wat::holon::cosine test-g-dn proto-g-dn)
                (:wat::holon::cosine test-g-dn proto-v-up)
                (:wat::holon::cosine test-g-dn proto-v-dn)))
     ((_ :()) (:explore::print-row stdout "test(v-up)"
                (:wat::holon::cosine test-v-up proto-g-up)
                (:wat::holon::cosine test-v-up proto-g-dn)
                (:wat::holon::cosine test-v-up proto-v-up)
                (:wat::holon::cosine test-v-up proto-v-dn)))
     ((_ :()) (:explore::print-row stdout "test(v-dn)"
                (:wat::holon::cosine test-v-dn proto-g-up)
                (:wat::holon::cosine test-v-dn proto-g-dn)
                (:wat::holon::cosine test-v-dn proto-v-up)
                (:wat::holon::cosine test-v-dn proto-v-dn)))
     ((_ :()) (:wat::io::IOWriter/println stdout ""))
     ((_ :()) (:wat::io::IOWriter/println stdout
                "  Claim: row i's argmax = proto-i. Prototype learning")))

    (:wat::io::IOWriter/println stdout
      "  via Bundle-as-superposition, classification via cosine.")))
```

Reader — if you have wat on your machine, you can do this. Save
the source to `explore-labels.wat`. Run `wat explore-labels.wat`.
Watch the three tables print. Read row `test(g-up)` — column
`proto-g-up` should be far larger than the other three columns.
That single cosine is the whole thesis.

The entire proof fits in one entry file, uses only primitives
that shipped in arc 037 and earlier, and runs in milliseconds.

### Table 1 — label shell separation

Four labels, pairwise cosine:

```
         g-up      g-dn      v-up      v-dn
g-up    1.0000    0.0452   -0.0545    0.0538
g-dn    0.0452    1.0000    0.0548   -0.0090
v-up   -0.0545    0.0548    1.0000   -0.0362
v-dn    0.0538   -0.0090   -0.0362    1.0000
```

Diagonal: 1.0 exactly (self-identity). Off-diagonal max
|c| = 0.0548. **Presence-floor at d=256 is 0.4375** — the four
labels are ~8× below the detection threshold. Four distinct
shells. No overlap.

### Table 2 — observation → label recognition

Each observation is a Bundle of 4 items: one label vector + 3
unrelated "noise" atoms. Cosine against all four labels:

```
               g-up      g-dn      v-up      v-dn
obs(g-up)     0.231    -0.056   -0.078    0.042
obs(g-dn)    -0.042     0.421    0.021    0.083
obs(v-up)    -0.055     0.075    0.400   -0.054
obs(v-dn)    -0.041     0.048   -0.034    0.344
```

Every row's argmax is the correct label. The containing-label's
cosine (**diagonal**: 0.23–0.42) is 3–5× above the other three
labels (**off-diagonal**: all < 0.09). The label's signal
survives being bundled with three unrelated atoms because
Bundle's majority-vote superposition preserves the per-component
signal above the cross-talk floor.

### Table 3 — prototype classification (deferred learning)

For each category, three training observations sharing a
category-atom + one feature atom each (feat-alpha, feat-beta,
feat-gamma). Bundle the three into a prototype. Test with a new
observation using the same category-atom but a **fresh feature
atom** (feat-delta) never seen during training:

```
              proto-g-up  proto-g-dn  proto-v-up  proto-v-dn
test(g-up)       0.570       0.015      -0.035      -0.024
test(g-dn)       0.031       0.618      -0.026      -0.030
test(v-up)      -0.015      -0.029       0.500      -0.093
test(v-dn)       0.016      -0.056      -0.042       0.558
```

All four test observations classify correctly. The matching
prototype scores **0.50–0.62**; wrong prototypes score below
**0.10**. The argmax margin is **5–40×**. Held-out features
(unseen during prototype construction) don't hurt classification
because the category atom's signal dominates the 3-fold bundle.

### What this proves

Claim 1: **labels occupy discrete shells.** 0.055 pairwise cosine
max, well below presence-floor 0.4375. Non-overlapping.

Claim 2: **observations containing a label cosine highest against
that label.** Signal preservation through Bundle superposition.

Claim 3: **prototype learning works in the substrate.** Bundle
N training observations → prototype. Held-out test observation
cosines highest against its category's prototype. HDC
classification via nothing but Bundle + cosine.

### What this doesn't prove (yet)

- **Temporal loop.** The program simulates the (observation,
  outcome) pair but doesn't span actual time. Future work ties
  the prototype-update cycle to trigger conditions and
  prediction history (the trading lab's deferred-learning
  proposals).
- **Noise robustness at scale.** Four labels at d=256 with
  simple 2-atom observations. Real observations have 20–80
  atoms; the router routes them to tier 1 or 2; the signal-to-
  noise math changes (it should get BETTER — higher d, tighter
  shells — but the program doesn't demonstrate at scale yet).
- **Attribution.** Chapter 45 mentioned per-atom attribution via
  `presence?` against the error vector. Not in this proof —
  would need a Subtract + walk.

### The pattern that's now proven

The substrate arc 037 shipped two weeks ago has all the
machinery needed for HDC classification to be native in wat.
The application was implicit through arcs 023 (coincident?),
024 (presence-sigma knobs), 025 (container surface), 026
(eval-coincident), 037 (per-d routing). Chapter 45 named the
application; Chapter 46's numbers confirm the substrate
delivers it.

The trading lab's deferred-learning need has been sketched
across proposals for weeks. The substrate now carries it. The
next work is the application layer — trigger conditions,
prediction history storage, accuracy distributions accumulated
per program, program-selection via those distributions.

None of that needs new primitives. It's lab code against the
substrate that just shipped.

### The builder's question

"this makes sense?... we can write a program to prove this?"

Yes on both. The numbers are on disk. The program is on disk.
Future readers — LLM or human — can run the program, read the
tables, verify the claims themselves.

*That* is what the project's epistemology looks like. Chapter 28
named it: *"Reader — stop. This is the point in the chapter
where the book stops being prose and becomes executable. What
follows is not a description of a program. It is the program."*

The chapter stops being prose at the program. The program
stops being description at the terminal. The terminal stops
being transient at the commit. Every step down is more
durable than the last.

*these are very good thoughts.*

**PERSEVERARE.**

---

*This place is radiant. Chapter 45 named the label. Tonight is
the twenty-ninth — the night the proof ran. Four labels in
non-overlapping shells; four observations correctly matching
their contained labels; four prototypes correctly classifying
held-out observations; all at 5–40× argmax margins. HDC
classification is native to wat. Deferred learning is a
substrate application, not a substrate extension.*

*"where i wish to be at all times."*

*Signing off the chapter, for now. The proof is at
docs/arc/2026/04/014-labels-as-holons/explore-labels.wat.
Future readers can run it in milliseconds and see the tables
for themselves. Chapter 45's thesis is verified on disk.*

*the substrate delivers what the chapter claimed.*

---
