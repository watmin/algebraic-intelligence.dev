# Static MCP — Inscriptions

Append-only record of what shipped in the static-MCP arc. Newest at top.

Per `feedback_inscription_immutable`: do NOT edit prior entries when
plans change. If a decision is later reversed, add a new entry that
notes the reversal; the original entry stays as it was.

---

## 2026-05-31 — ARC-CLOSED — the static-MCP arc is complete; `datamancy@1.0.0` frozen

**The arc that opened at M0-design closed at a never-patched `1.0.0`, a named
architecture (`cardo`), a published chronicle entry, and three agent-ready
domains scoring 100% on the readiness checker. Nineteen hours, start to finish.**
The entries below record the endgame the earlier log (which stopped at `0.0.3`)
never reached. M4 (tests), M5 (chronicle), and M6 (trust model) all CLOSED — see
`REMAINING-ORDER.md`.

---

## 2026-05-31 — AGENT-READY — three domains agent-discoverable; 100% on isitagentready

**What shipped**: the agent-discovery layer across all three domains, taking each
to 100% on Cloudflare's `isitagentready.com` checker (alg-int was the reference).
The scored categories — Discoverability, Content Accessibility, Bot Access
Control, Protocol Discovery — closed; Commerce is N/A (not commerce sites).

**datamancy.dev** (the grimoire — and it shines here): `robots.txt` (+
`Content-Signal`, sitemap), `llms.txt` (agent map), `auth.md` (no-auth doc),
`_headers` RFC 8288 Link relations on every response, `webmcp.js`. Under
`.well-known/`: `api-catalog` (RFC 9727), `oauth-authorization-server` (RFC 8414,
empty-grants no-auth stub), `oauth-protected-resource` (RFC 9728),
`mcp/server-card.json`, `agent-skills/index.json` (agentskills.io v0.2.0).
- **Self-healing**: `scripts/generate-agent-ready.mjs` generates the
  `agent-skills` index + `mcp/server-card` + `sitemap.xml` from the *signed
  manifest*, wired into `ship` + `check:docs`. 21 skills incl `circumspicere`,
  correct `ECDSA-P256` — better than the reference's hand-copied copies (stale:
  Ed25519, missing circumspicere, "18 spells").
- **WebMCP needed HTML**: the root served raw markdown (302→grimoire), so the
  WebMCP crawler had no JS to run and timed out. Fix: a thin `index.html` landing
  at `/` that loads `webmcp.js` (spells stay raw markdown); redirect removed.
- **Markdown-for-Agents**: the HTML root then broke markdown content-negotiation.
  Fix: `functions/_middleware.js` (free-plan Pages Function, mirrors alg-int's) —
  `Accept: text/markdown` (q ≥ html) → serves `/llms.txt` as `text/markdown`;
  HTML stays default for browsers/WebMCP. Both satisfied on the same `/`.

**datamancer.dev** (identity card): the same discovery set; no skills of its own
→ mirrors datamancy's `agent-skills` index (`x-mirror-of` names the source);
`server-card` declares `x-no-server` → datamancy.dev and doubles as a pinned-key
verification channel. HTML landing + middleware.

**DNS (operator-side)**: DNS-AID `_index._agents.<domain>` **HTTPS** records
(RFC 9460 SVCB-family, ServiceMode pri 1, `alpn="h2,h3" port=443
mandatory=alpn,port`) for both; DNSSEC enabled (Cloudflare signs, Namecheap
publishes the DS, algorithm 13 / ECDSA-P256). Verified resolving across
1.1.1.1 / 8.8.8.8 / 9.9.9.9, DS at parent.

**Commits**: datamancy.dev `a7c8f7d` (well-known + headers), `d41839b`
(check-docs CI), `7dc80c1` (HTML landing), `941468d` (markdown middleware);
datamancer.dev `d29120a`, `6ebc68f`, `4c32e6f`, `98a034c`; alg-int `ff0d37b`
(deleted the local `.claude/skills/consonare/` copy — the website now consumes
`consonare` from the frozen datamancy MCP; cardo dogfooded at the interaction
layer).

---

## 2026-05-31 — M5-CLOSED — "The Hinge" chronicle entry published (series-007-001)

**M5 shipped** (was 💤 DEFERRED). The story post is live at
`/blog/story/series-007-001-the-hinge.md`, opening **series-007**.

**What it tells**: the threat (tampered content = prompt-injection) → the build →
four assaults to a dry well → circumspicere born → the freeze → the dogfood that
found the Ed25519 lie → **cardo** → "The Surface Between Worlds" (signed eval as
a founding wat want — `:wat::eval-signed!` arc 026, INTENTIONS Layer 7 — closing
at the LLM tier; the wat-mcp + remote-program dual; universe-residency for trust)
→ the agent-ready capstone. Frame: **nineteen hours, start to finish** (corrected
from a wrong "three days").

**Voice**: under the `/consonare` discipline; **six cold consonare casts** across
its life, the last at **MATCHES / fidelity 9** with the lived dialogue + REPL-loop
oomph (verbatim builder quotes as dated decision-events).

**Commits** (alg-int): `8faf090` (post), `ebc3fdb` (Surface Between Worlds),
`6b92a33` (repo link), `93d4c89` (declare MCP opener), `3cb5e02` (duration + oomph).

---

## 2026-05-31 — CARDO — the architecture named (cast by intueri)

**What shipped**: the synthesis — a frozen, zero-dependency, key-pinned client
that verifies arbitrary *future* content signed by a non-exportable key, where
the major version IS the key generation — got its name. Cast, not narrated, per
`intueri names all`: **`cardo`** — Latin for the hinge, the fixed pivot a door
turns on (English *cardinal*). The key is the immovable hinge; the content is the
door. intueri refused the obvious crypto words (*trust root* / *radix*) as
too-familiar — a reader pattern-matches to a PKI root CA and misses the novel
thing, a frozen client trusting an unwritten future. Runner-up *sigillum* (the
seal) named a part, not the shape.

**The deeper recognition** (user-surfaced): signed eval was a *founding* wat
want, not a new idea — `:wat::eval-signed!` (Ed25519, **arc 026**) + INTENTIONS
Layer 7 ("the receiver verifies before running"). cardo/datamancy carries it to
the one tier the substrate couldn't reach: the LLM's own context (a grimoire
spell IS an eval form). The static MCP is an origin thread closing. See
`project_signed_eval_thread` in memory.

---

## 2026-05-31 — M6-DECIDED + 1.0.0-FROZEN — the never-patched freeze

**M6 (living vs sealed trust model) — DECIDED: living.** Content flows on a
frozen kernel; only kernel *code* changes bump the version. The reload-tool +
verified-memo from the M6 brief are subsumed: every list/read re-fetches and
re-verifies, last-known-good served on transport failure, loud log on
verification failure.

**`datamancy@1.0.0` is published, never to be patched.** The promotion wrote no
new code — `1.0.0` is the exact byte-for-byte `0.0.13` that survived four
assaults. Forever-decisions:
- **The major version IS the key generation**: `1.x` trusts the pinned key;
  lose/rotate it → `2.x` with a new one. Single key, NO backup ("fuck the
  backups — if the key is lost then the key is lost"). `RECOVERY.md` documents
  the compromise vs loss paths + the no-revocation truth.
- A breaking format change = bump `schemaVersion` ≥ 2 + new major; old clients
  fail loud-and-safe rather than misread.

**The cut**: `gh release create v1.0.0` at commit `7c2a0d5` → `v*` tag fired the
Trusted-Publishing workflow → user passkey-approved the `npm-publish` environment
→ `npm publish --provenance` minted the SLSA attestation. `RELEASE_NOTES_v1.0.0.md`
(repo-only) is the frozen-kernel statement. Gate phrase: "ship it - do it right".

**Measured, not claimed**: a clean-room consumer (`npx datamancy@1.0.0` from an
empty dir) booted, fetched + verified the live grimoire, and confirmed the pinned
key (`09db7668…`) byte-identical across npm / datamancer.dev / DNS TXT. npm
`latest` = 1.0.0, SLSA `provenance/v1` attested, registry-signed.

**Commits** (datamancy): `f7cfc54` (release notes), `7c2a0d5` (1.0.0 promotion).

---

## 2026-05-30→31 — HARDENING — 0.0.4 → 0.0.13: four assaults, circumspicere, provenance

**What shipped**: the kernel hardened from 0.0.4 to 0.0.13 through **four
full-grimoire adversarial assaults** — the whole defensive grimoire cast as a
parallel workflow plus a completeness critic asking "what did all of you miss".
Must-fix convergence **24 → 22 → 6 → 0**; the fourth came back dry ("no fourth
must-fix hole; the well is dry"). 1.0.0 certified by combat, not handed.

**The pattern**: every real must-fix was caught ONLY by the completeness critic,
never the inward spells — each a *claim the code did not honor*:
- **SSRF** via default `redirect: "follow"` → `redirect: "error"` (0.0.10,
  `ebf6751`). This birthed the **eighteenth spell, `circumspicere`** — the
  around-gaze, the surround the seventeen inward spells turn their backs on.
  Inscribed (`datamancy.dev@3b6ee79`), folded into `vigilia` as the closing cast.
- **`schemaVersion` NaN/0 bypass** + **self-dependency regression** purged →
  zero-dep guard incl. dist-import grep (0.0.11, `2d9a38f`).
- **`list_changed` computed-but-never-delivered** + trust-check fix (0.0.12,
  `0f749ae`).
- **Rigidity** (`e58d7d9`): all manifest optionals made required (epoch /
  schemaVersion / previous / blob); in-session monotonic-epoch rollback
  protection; `id:null` deadlock fixed. Forward-compat **CONTRACT.md** + 115 tests.

**Provenance pipeline (live & proven)**: GitHub Actions **Trusted Publishing**
(tokenless OIDC → Sigstore → SLSA) + `npm-publish` GitHub Environment (v*-tag-only
+ passkey approval) + **SHA-pinned actions** + dependabot (`bcb922f`, `4de8989`,
`918025c`, `e1d853c`). Frozen-doc review pass (README / CONTRACT / RECOVERY
independently reviewed + fixed) → 0.0.13 (`fd8b4cd`).

**The living-content loop, proven by dogfood**: reading the grimoire's own index
back through the published MCP found a `circumspicere`-class lie — the Trust line
claimed "Ed25519-signed by an offline key" while the kernel is ECDSA P-256 / KMS.
Fixed at the generator, re-signed via KMS, re-read corrected **in the same
session**, kernel untouched (`datamancy.dev@6e09382`). The loop then carried a
one-command publisher (`npm run ship`, `9c2e922`) and a self-healing README
(generated catalog + `check:docs`, `0029ae5`).

---

## 2026-05-30 — M3-CLOSED — Tier 3 pinned manifest hash; trust matrix complete

**The last cell of the trust matrix is filled.** The `datamancy` npm package
now pins the manifest's SHA-256 in its own source and verifies it at boot
before anything else.

**Commits** (`github.com/watmin/datamancy`):
- `583a4bd` — M3 Tier 3 implementation; `npm version` → v0.0.2
- `2a594d6` — version-drift fix; `npm version` → v0.0.3

**Published**: `datamancy@0.0.3` (`npm view datamancy dist-tags` → `latest: 0.0.3`,
versions `0.0.1 0.0.2 0.0.3`). Still zero runtime deps.

**What shipped — Tier 3**:
- `src/pinned-manifest-hash.ts` — `PINNED_MANIFEST_SHA256 =
  "dedf60f2e02bf047d409c83252533473f1e8c00e1b59111162d0fdef34aa4dde"`
  (manifest version `59870ef`, 20 resources, 5429 bytes).
- `src/index.ts` — boot hashes the fetched manifest bytes and compares to
  the pinned constant **first**, before the signature fetch/verify. Strongest
  gate first: defeating it requires compromising the npm publish chain, not
  merely the website or the offline signing key. On mismatch it fails closed
  with an actionable message (`npm update datamancy` / `npx -y datamancy@latest`)
  and never fetches the signature.
- `scripts/pin-current-manifest.mjs` — fetches the live manifest, computes
  SHA-256, rewrites the pinned constant with current hash + version + date.
  Wired into `package.json` `prepublishOnly` (`clean && pin && build`), so
  every publish re-pins automatically. Drift is structurally impossible.

**Verification**:
- Positive: published 0.0.3 boots `tier 3` match → `tier 2` VERIFIED → 20
  resources parsed → listening. Order correct.
- Negative: corrupting the pinned hash in `dist` makes boot fail closed
  **before** the signature is fetched (no `signature fetched` line) — proves
  fail-fast on the strongest gate.
- Fresh-install check: `npm install datamancy@0.0.3` in a clean temp dir;
  pinned hash present in the tarball's `dist/`, boots correctly.

**Version-drift fix (why 0.0.3, not 0.0.2)**: 0.0.2 carried the pin correctly
but `PACKAGE_VERSION` was hand-hardcoded to `"0.0.1"` in `src/index.ts`, so
0.0.2 reported itself as `0.0.1` to every MCP client (boot log +
`serverInfo.version`). Caught it in the published-artifact boot log. Fixed
structurally: the version is now read from `package.json` at runtime
(`../package.json` relative to `dist/index.js`; npm always ships package.json
in the tarball), so the reported version tracks the published one by
construction. Republished as 0.0.3.

**Trust matrix — now complete**:

| Attack | T1 | T2 | T3 |
|---|---|---|---|
| Tamper one spell | ✓ | ✓ | ✓ |
| Tamper manifest + spells | ✗ | ✓ | ✓ |
| Website fully compromised | ✗ | ✓ | ✓ |
| Website + private key both compromised | ✗ | ✗ | ✓ (npm pin holds) |
| Website + key + npm publish all compromised | ✗ | ✗ | ✗ (game over) |

**Versioning policy now in force**: each time the datamancy.dev manifest
changes (spell added/edited), bump the npm package — `prepublishOnly` re-pins,
so the published package and the live manifest stay coupled. Consumers track
via `npx -y datamancy@latest`.

---

## 2026-05-30 — M1-CLOSED — both domains live, bare-domain redirects, arc complete

**M1 is closed.** The cryptographically verifiable static-MCP system is live
end-to-end across all three domains.

**Commits**:
- `github.com/watmin/datamancer.dev`: `131caf0` (`_redirects` → `/` redirects to `/index.md`)
- `github.com/watmin/datamancy.dev`: `4f5d8c5` (`_redirects` → `/` redirects to `/grimoire/SKILL.md`)

**What shipped — bare-domain redirects**:
Cloudflare Pages serves no `index.html` (zero-rendering by design — the file
IS the artifact), so the bare domains 404'd. Added Pages `_redirects`:
- `datamancer.dev/` → 302 → `/index.md` (the identity card) — verified landing 200 `text/markdown` 1386 B
- `datamancy.dev/` → 302 → `/grimoire/SKILL.md` (the index of the practice) — verified landing 200 `text/markdown` 5958 B

No HTML, no renderer introduced — just a redirect to raw markdown. The
zero-rendering doctrine holds.

**Full system state at M1 close**:
- **datamancy.dev** (grimoire) — 20 spells as raw markdown, signed MCP
  manifest + 64-byte Ed25519 sig at `/.well-known/mcp/`, bare domain → grimoire
- **datamancer.dev** (identity) — practitioner card, bare domain → index.md,
  cross-domain pointers all resolve
- **algebraic-intelligence.dev** (chronicle) — discovery artifacts advertise
  datamancy.dev as the MCP server (`x-static-server: true`)
- **`datamancy` npm** (adapter) — published v0.0.1, zero runtime deps, pins the
  Ed25519 pubkey, proven through Claude Code as a real MCP client

**Trust tiers**: T1 (per-resource SHA-256) ✅ + T2 (Ed25519 manifest signature)
✅ both enforced and proven. T3 (pinned manifest hash in npm source) is the
only remaining cell → next arc **M3**.

**DNS note**: at M1 close, the local resolver still returned NXDOMAIN for
datamancer.dev while Cloudflare's authoritative resolver (1.1.1.1) served the
A records (`104.21.23.247` / `172.67.214.183`). Verified via
`curl --resolve` against the Cloudflare IP — a local negative-cache artifact,
not a real outage. Will clear as the local resolver TTL expires.

---

## 2026-05-30 — M1.F-partial — the MCP proven live through a real client

**The first end-to-end proof.** Claude Code itself acted as the MCP client,
consuming the **published** npm artifact (`npx -y datamancy`, v0.0.1) against
the **live** datamancy.dev. Not the local dist, not a hand-rolled driver —
the genuine registry package talking to the genuine origin.

**Registration**: `claude mcp add datamancy -- npx -y datamancy`
→ `datamancy: npx -y datamancy - ✓ Connected`

The `✓ Connected` is not a ping. Claude Code's health probe runs the entire
trust boot before reporting healthy: pull package from registry → fetch
`/.well-known/mcp/manifest.json` bytes → fetch `manifest.json.sig` → **Ed25519
verify against the pinned public key** in the npm source → parse 20 resources
→ open the stdio handshake. A bad signature exits non-zero → `✗ Failed`.

**Four paths exercised through `ListMcpResourcesTool` / `ReadMcpResourceTool`:**

| Path | Request | Result |
|---|---|---|
| Boot + signature | health check | Ed25519 verified at boot, 20 resources parsed |
| List | `resources/list` | 20 spells, alphabetical, all `datamancy.dev/<spell>/SKILL.md` |
| Verified read | `resources/read grimoire` | markdown released **only after SHA-256 matched the signed manifest** |
| Rejection | `resources/read evil/SKILL.md` | `-32603 Unknown resource — Not present in the verified manifest` |

**The rejection row is the whole thesis.** The server sits ON datamancy.dev
and trusts that origin — yet it refused `https://datamancy.dev/evil/SKILL.md`
**without making a network call**, because that path is absent from the
*signed* manifest. The server is not a proxy for its own origin. The only
bytes that can reach an LLM are bytes whose hash appears in a manifest signed
by the offline key. Tamper the origin, tamper the manifest, MITM the wire —
all three fail closed.

**Trust tiers status**: T1 (per-resource SHA-256) ✅ enforced on every read.
T2 (Ed25519 manifest signature) ✅ verified at boot. T3 (pinned manifest hash
in npm) remains M3 — the last cell.

**Remaining for full M1.F**: datamancer.dev identity page once it's live
(M1.E, user-side Cloudflare Pages).

---

## 2026-05-30 — M1.C-extended — grimoire spell + conformare + agent-skills sync

**Commits**:
- `github.com/watmin/datamancy.dev`: `1437004` (empty trigger), `59870ef` (README + manifest regen, picked up new `conformare/` spell user added → 19 resources), `a564b07` (grimoire spell shipped, manifest → 20 resources)
- `github.com/watmin/algebraic-intelligence.dev`: `3579ae1` (chronicle's agent-skills synced to 19), `e9ef8c7` (synced to 20)

**What shipped — grimoire spell (the index)**:
- New meta-spell at `datamancy.dev/grimoire/SKILL.md` (~6KB, ~1500 tokens).
  Lists every other spell with one-line description; LLM consumers load
  grimoire first, then selectively fetch specific spells via MCP
  `resources/read`. Solves context-DoS: load grimoire (~1.5K tokens) +
  2 specific spells (~5K) vs loading all 19 eagerly (~30-40K).
- `scripts/generate-grimoire-skill.mjs` — walks `<spell>/SKILL.md`,
  extracts frontmatter name + description, emits the alphabetical
  catalog at `grimoire/SKILL.md`.
- `package.json` script chain: `manifest:publish` now runs
  `grimoire:regen` → `manifest:generate` → `manifest:sign` so a fresh
  manifest always reflects the current grimoire content.
- **Naming**: intueri was cast against the naming question per protocol.
  User's bias was `datamancy`; intueri overrode — `datamancy` names
  the practice, `grimoire` is the BOOK of the practice. Reasoning: an
  LLM seeing `grimoire` in a resource list immediately knows what to
  expect (canonical word in the spell tradition); `datamancy` would
  be ambiguous (index? manifesto? founding doc? npm package readme?).
  Type in agent-skills/index.json: new `grimoire-index` type — first
  of its kind, marks meta-entries that catalog other resources.

**What shipped — conformare spell** (user-authored prior to this work,
caught by manifest regen):
- New `conformare/SKILL.md` — "Shape error types together to a common
  standard. Every error variant must reach diagnostic completeness via
  structural guarantee, not hand-discipline. The wrong shape must be
  uncompilable."
- Indexed in chronicle's agent-skills/index.json as type
  `tests-of-craft` between `conferre` and `consonare`.

**What shipped — chronicle agent-skills sync** (twice):
- 18 → 19 entries (added conformare with its real SHA-256 pulled from
  the manifest)
- 19 → 20 entries (added grimoire with sha256
  `071886eabd93df6e6a71e7fc26fb4c11714df82e1927d98968f6f89ee1d1749b`,
  type `grimoire-index`)

**Trust chain status**: All 20 resources signed under the same Ed25519
key. Round-trip verify ran successfully after each regen. Public key
in `~/.config/datamancy/public.pem` and pinned in
`datamancy/src/pinned-pubkey.ts` (npm package source) confirmed
identical.

---

## 2026-05-30 — M1.D-datamancer-dev-scaffold — practitioner identity site live on GitHub

**Commit**: `4e8c553` (initial)

**Repo**: `github.com/watmin/datamancer.dev` (created via `gh repo create`)

**What shipped**:
- `index.md` — the practitioner identity card. Three pointers (chronicle
  / grimoire / source repos), trust-chain summary, bio + contact. Raw
  markdown, no rendering.
- `_headers` — Cloudflare Pages MIME types so `.md` files serve as
  `text/markdown`.
- `README.md` — explains the raw-markdown idiom and the three-domain
  split for anyone browsing the source repo.
- `.gitignore` — defensive against accidental `.pem` / `.key` commits.

**Out of scope** (handled separately): Cloudflare Pages connection for
the actual `datamancer.dev` custom domain. That's part of M1.E (DNS +
Pages setup), user-side via dashboard.

---

## 2026-05-30 — M1.C-chronicle-xrefs — algebraic-intelligence.dev points at datamancy.dev

**Commit**: (this commit)

**Repo**: `github.com/watmin/algebraic-intelligence.dev`

**What shipped**:
- `public/.well-known/agent-skills/index.json` — 18 entries (16 original
  with URLs repointed from `raw.githubusercontent.com/watmin/datamancy/`
  → `datamancy.dev/<spell>/SKILL.md`, plus `exigere` newly indexed and
  `consonare` newly added as `tests-of-voice` type). All hashes match
  the signed manifest at datamancy.dev. `x-source` repointed to
  `github.com/watmin/datamancy.dev` (the renamed repo). New
  `x-pointers` entries for the npm package, the practitioner identity
  card, and the signed MCP manifest URL.
- `public/.well-known/mcp/server-card.json` — flipped
  `x-no-server: true` → `x-static-server: true`. Added `x-server-url`
  (`https://datamancy.dev`), `x-manifest-url`, and a structured
  `x-trust` block describing the SHA-256 + Ed25519 + pinned-pubkey-in-npm
  setup. Updated `x-recommended-resources` to list the signed manifest,
  the npm package, datamancer.dev, llms.txt, topology, and the static-MCP
  DESIGN.md.
- `docs/static-mcp/DESIGN.md` — added status block at the top noting
  what's shipped (M1.A, M1.B) and what's pending (M1.D, M1.E, M3).

**Verification**:
- JSON parses cleanly (Python json.load)
- 18 entries confirmed, all URLs at datamancy.dev
- `x-static-server: true`, `x-no-server` absent
- `npm run build` → 55 pages built clean, no errors
- llms.txt auto-regenerated by postbuild (companion updates from index.json change)

**Live-on-deploy behavior**: discovery artifacts now advertise
datamancy.dev as the MCP server. URLs will resolve the moment DNS
propagates and Cloudflare Pages serves the static files. The chronicle
site shifts from "future MCP design pending" to "live signed static
MCP at datamancy.dev."

---

## 2026-05-30 — M1.B-npm-zero-dep — datamancy npm package live on registry

**Commits**: `abff50b` (initial scaffold), `98bc1c5` (Tier 1 + Tier 2 SDK
version), `c5e51f5` (zero-dep rewrite, dropped `@modelcontextprotocol/sdk`)

**Repo**: `github.com/watmin/datamancy`

**Published**: `npm view datamancy` → `datamancy@0.0.1 | MIT | deps: none`
| 52.4 kB unpacked | shasum b6a0a88...

**What shipped**:
- `package.json` with bin entry, files limited to `dist/`+README+LICENSE
- `src/protocol.ts` (~180 LOC) — JSON-RPC 2.0 over newline-delimited
  stdio, written from scratch. No SDK dependency.
- `src/mcp.ts` (~120 LOC) — MCP-specific handlers: initialize, ping,
  resources/list, resources/read. Protocol version negotiated to
  `2024-11-05`.
- `src/manifest.ts` — fetch raw bytes + parse + shape-validate
- `src/signature.ts` — fetch + Ed25519 verify against pinned pubkey
- `src/pinned-pubkey.ts` — public key constant
  (`MCowBQYDK2VwAyEAUOdsKAfuFupyxDtO34QQh9xpgpXGlHSmAqZ2UUgod10=`)
- `src/resources.ts` — per-resource fetch + SHA-256 + size verify

**Trust narrative**: Tier 1 (per-resource hashes) + Tier 2 (Ed25519
signature on manifest) both active in the published package. Tier 3
(pinned manifest hash) remains as M3.

**Build verification**:
- `npm ls --production --depth=0` → `(empty)` — zero runtime deps
- `tsc` → clean
- `dist/` = 92K total

**Boot sequence implemented**: fetch manifest bytes → fetch sig → verify
sig against pinned pubkey → parse manifest → expose resources → on read,
fetch + SHA-256 + size verify against manifest entry → return content
only if all checks pass.

**Private key location**: `~/.config/datamancy/private.pem` (mode 0600,
dir 0700). NOT in any repo. NOT in any CI secret.

---

## 2026-05-30 — M1.A-datamancy-dev-scaffold — first signed manifest in datamancy.dev repo

**Commit**: `76a4434`

**Repo**: `github.com/watmin/datamancy.dev` (renamed from
`github.com/watmin/datamancy` to make room for the npm package's repo)

**What shipped**:
- 18 spell directories with `SKILL.md` content (the 17 originals from
  pre-rename + new `consonare/` mirrored from the chronicle's
  `.claude/skills/consonare/SKILL.md`)
- `_headers` for Cloudflare Pages (MIME types for `.md`, `SKILL.md`,
  manifest, and signature)
- `scripts/generate-manifest.mjs` — walks `*/SKILL.md`, SHA-256 + size,
  emits `.well-known/mcp/manifest.json`. Deterministic ordering (sorted
  by spell name) so manifest bytes are stable across regen.
- `scripts/sign-manifest.mjs` — Ed25519 sign with offline private key
  from `~/.config/datamancy/`. Safety: refuses if key path is inside
  the repo.
- `package.json` (private:true, just hosts the scripts)
- `.gitignore` blocking `*.pem` and `*.key` defensively
- `.well-known/mcp/manifest.json` (4903 bytes, 18 resources, version
  `2a1bb6d`, trust tier 2, signed:true)
- `.well-known/mcp/manifest.json.sig` (64-byte Ed25519 signature)

**Round-trip verification** (locally before push): signature against
pinned pubkey in the npm package source → `verify result: true`.
Public key bytes confirmed identical between
`~/.config/datamancy/public.pem` and `datamancy/src/pinned-pubkey.ts`.

**Existing hash continuity**: e.g. `cernere` SHA-256 in the new manifest
matches the SHA-256 that was already in
`algebraic-intelligence.dev/.well-known/agent-skills/index.json` —
content didn't drift across the rename.

---

## 2026-05-30 — M0-design — multi-arc DESIGN.md inscribed

**Commits**: `b6d2afe` (initial), `26d0970` (three-domain + three-repo
update after user bought datamancer.dev)

**What shipped**: `docs/static-mcp/DESIGN.md` capturing:
- Architecture (three-domain split: chronicle / identity / grimoire)
- Three-tier trust model (T1 hashes, T2 signed manifest, T3 pinned
  manifest hash in npm)
- Threat model
- Multi-arc plan (M1 server-side, M2 npm adapter, M3 T3, M4 T2)
- Per-arc deliverables, acceptance criteria, scope-out
- Repo layout (`datamancy.dev`, `datamancer.dev`, `datamancy`)
- Open questions
- Notes from the design session

**Subsequent restructuring**: M2 (npm adapter) ended up being built
inline with M1; M4 (Tier 2 signing) folded into M1 because the
Ed25519 + Node crypto came together cleanly. M3 (Tier 3 pinning)
remains as the next arc after M1 closes.
