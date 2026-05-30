# BRIEF — F — Living trust model + reload tool + write-only-on-verified memo

**Status**: DESIGN CAPTURED, not built. One decision is OPEN (living vs
sealed); the two runtime features (reload, memo) are specced and compose
with the living model.

**Origin**: design conversation 2026-05-30, after M1 + M3 shipped. The
user reasoned to the shape; this brief records it before compaction.

---

## The through-line

One idea — **the website is the content, the npm package is a frozen
trust kernel** — expressed at three moments:

- **boot** → the trust model (living vs sealed)
- **runtime** → the `reload` tool (the `load!` verb)
- **at rest / under failure** → the write-only-on-verified memo

They are independent to build but they are the same idea. The reload tool
and the memo only fully come alive in the **living** model.

---

## DECISION (OPEN) — living vs sealed trust model

What the npm package pins decides what is "welded" to a version release:

- **Pinned hash (T3, what M3 shipped) = welded to the exact content.**
  Every spell edit changes the manifest hash → npm republish required.
  Maximum security: survives even offline-key theft, blocks rollback.
  Cost: the republish tax lands on every act of writing a spell.

- **Pinned pubkey only (T1 + T2) = welded only to the KEY.** The pubkey
  verifies ANY manifest the key signs, including ones that don't exist
  yet (it's a verifier function, not a fixed value — same as TLS pinning
  a CA, SSH a host key, sigstore a signing key). Edit/add spells → re-sign
  → `git push` → every `npx datamancy` sees it next boot, verified, with
  **zero npm republish.** The content is dynamic; the package never moves.

**The attack surface, honestly counted:**

| Model | Minimum compromise to serve accepted malicious content |
|---|---|
| Living (T1+T2) | signing key **AND** (GitHub **or** Cloudflare) — 2 secrets, each 2FA-backed; key is offline |
| Sealed (T1+T2+T3) | key **AND** hosting **AND** npm account — 3 factors, plus free anti-rollback |

**The one honest seam:** authentic ≠ fresh. A signed *old* manifest is
genuinely signed, so a host-only attacker (no key) could *replay* it to
roll you back. Sealed/T3 blocks this by construction. The living model
can close it WITHOUT freezing content via a **signed monotonic
version/timestamp inside the manifest** (already has `serverInfo.version`;
make it monotonic + refuse anything older than the newest seen). That
yields the true ideal: **T1 + T2 + signed-freshness = live updates +
authenticity + anti-rollback, no npm coupling to content.**

**Recommendation (mine, not yet decided by user)**: living + signed
freshness. For a personal grimoire played like a video game
([[creation_is_the_point]]), the republish tax taxes the creative act
itself; the third factor defends a low-probability offline-key theft.
The dynamism is the prize. **User still chewing on this — do not build
until decided.**

---

## FEATURE 1 — the `reload` tool (the `load!` verb)

**Problem**: the server fetches + verifies the manifest once in `main()`
and caches `byUri` for the life of the process — `require` semantics
(load once, idempotent). A long-running stdio server (Claude Code keeps
it alive the whole session) never sees a spell added mid-session.

**Fix**: add a `load!` / `(require … :reload)` verb. In MCP, a verb is a
**tool**, NOT a resource. Do not mask it as a resource read: resources are
contractually idempotent, side-effect-free reads — clients cache,
prefetch, and dedupe them, so a side-effecting "reload resource" fires
unpredictably. The protocol gives `tools` for exactly this; using it is
the honest move (same category-honesty as no-verb-through-noun).

**Shape**:
```
initialize → advertise capabilities.tools (alongside resources)
tools/list → [{ name: "reload",
                description: "Re-fetch + re-verify the signed grimoire
                              manifest; pick up new/edited spells without
                              restart." }]
tools/call reload →
    fetch manifest bytes → verify sig vs PINNED_PUBKEY → parse → rebuild byUri
    return "grimoire reloaded: 20 → 21 spells, version a564b07 → 7f3e1c2"
    emit notifications/resources/list_changed   // tell client to re-list
```

**Trust-preserving**: runs the IDENTICAL verification path as boot. Can
only refresh the *verified* set; cannot introduce unverified content.

**Alternative considered**: always-fresh (re-verify manifest on every
list/read, no cache, no verb). Zero staleness, ~1 fetch+verify per op.
Valid, but the explicit `reload` matches the user's stated `load!` model
and is cheaper. Build reload, not always-fresh.

---

## FEATURE 2 — write-only-on-verified in-memory memo

**Problem**: a network blip mid-session shouldn't blank the grimoire.

**Rule (the core invariant)**: **only verified-good results are ever
remembered.** The memo is a write-only-on-verified set — a trust ratchet.
It can never hold forged content, so serving from it is always serving
authentic content.

**NOT a disk cache.** In-memory only (a `Map` in the running process).
Disk persistence (survive restart offline) is a different, bigger feature
nobody asked for. RAM is inside the trust boundary, so the memo needs NO
re-verification on serve — it was verified when it entered. (Disk would
need verify-on-load because disk is outside the boundary; RAM isn't. An
attacker who can rewrite process RAM already owns the pinned pubkey next
to it — game over either way.)

**Behavior**:
```
const memo = new Map();  // uri -> verified content, this session only

read(uri):
  try:
    content = fetchAndVerify(resource)   // live fetch + hash check
    memo.set(uri, content)               // fresh overwrites — only good results
    return content
  catch:
    if memo.has(uri): return memo.get(uri)   // last-known-good, provably authentic
    else: throw                              // cold start, nothing good to fall back to
```

Always fetch first; the memo is **pure fallback**, fresh always wins, so
the happy path never serves stale. Optionally memo the manifest too so
`resources/list` survives a blip (cold-boot-offline still fails — correct).

**Transport vs tamper — same behavior, different SIGNAL** (this is the
honesty piece):
```
verified success     → overwrite memo, serve fresh
transport failure    → serve last-good · log INFO  "offline, serving cached vX"
verification failure → serve last-good · log LOUD  "VERIFY FAILED — possible
                                          tampering, serving last-known-good vX"
no memo yet          → refuse (cold start under failure)
```
A tamper attempt degrades to the SAME graceful path as an outage (the
ratchet rejects the bad bytes, you keep serving the prior good one) — an
attacker can neither poison the memo nor deny service, reduced to a no-op.
BUT a verification failure is a **"scary event just happened"** and must
be flagged LOUD — never let an active tamper be silent. Content stays
authentic; the operator still learns someone is serving bad signatures.

---

## Acceptance (when built)

- `reload` exposed as an MCP **tool** (capabilities.tools advertised);
  re-runs full verification; emits `resources/list_changed`; picks up a
  newly-added spell mid-session without restart.
- Memo: only verified content stored; fresh always overwrites; transport
  failure serves last-good (INFO log); verification failure serves
  last-good with a LOUD "possible tamper" log; empty memo + failure
  refuses.
- Negative test: point the server at a manifest whose signature is broken
  after a good load → it keeps serving the last-good set AND logs the loud
  tamper warning; the memo is never overwritten with the bad bytes.

## Dependencies / ordering

- The living-vs-sealed DECISION gates how much these matter (reload + memo
  shine in living; near-pointless in sealed). Decide trust model first.
- Independent of M4 (tests) and M5 (chronicle post).

## Out of scope

- Disk persistence / offline cold-start (content-addressed on-disk store —
  considered and explicitly dropped as over-built for the stated need).
- Signed-freshness monotonic guard is noted under the trust decision, not
  here; build it with the living-model choice if made.
