# Static MCP — DESIGN

**Status**: Multi-arc plan. Master design captured 2026-05-30. Updated
2026-05-30 to reflect the three-domain split: `algebraic-intelligence.dev`
(chronicle), `datamancer.dev` (identity), `datamancy.dev` (grimoire +
MCP server).

## The idea

A cryptographically verifiable static MCP server hosted as plain
markdown files on a dedicated domain (`datamancy.dev`). The instruction
set (datamancy spells, the consonare voice discipline, any future
skills) becomes a **provably immutable, publicly auditable prompt
distribution channel**.

Trust root = the SHA-256 of each file content, published in a manifest. A
client adapter verifies every fetch against the manifest before any content
reaches an LLM. Tampering = hash mismatch = rejection.

The **raw-markdown end-to-end** decision matters: zero transformation
between source and served means the SHA-256 of the file on disk = the
SHA-256 of what's served = the SHA-256 of what the LLM consumes. No
template engine, no Astro, no markdown processor, no `.md → .html`
divergence. The file IS the artifact. Trust property collapses to "file
bytes match the manifest's hash."

### Why this is novel

| Live MCP server | Static + hashed MCP |
|---|---|
| Trust = "the server I'm talking to right now is honest" | Trust = "this content's SHA-256 matches the manifest" |
| Compromise = server pwn → arbitrary prompt injection | Compromise = needs simultaneous content + manifest swap (detectable if pinned) |
| Bot-blockable (e.g. GitHub blocks scrapers) | Open static hosting on Cloudflare Pages, no blocking |
| State, sessions, credentials | None — pure GET-only static |

The user has been building this without naming it for a while: see
`public/.well-known/agent-skills/index.json` (already has 16 datamancy
spells with SHA-256 hashes against their GitHub source).

## Three-domain architecture

Three distinct domains, each with a single purpose. All static. All
Cloudflare Pages-hosted.

```
┌──────────────────────────────────────────────────────────┐
│ algebraic-intelligence.dev — CHRONICLE                   │
│ (Astro/Starlight, rendered, voice-disciplined story)     │
│                                                          │
│   - The build chronicle (series-006-*)                   │
│   - Discovery card: .well-known/mcp/server-card.json     │
│     (points at datamancer.dev as MCP server location)    │
│   - agent-skills/index.json (mirrors datamancy.dev URLs) │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ datamancer.dev — IDENTITY                                │
│ (raw markdown, zero rendering, the practitioner's card)  │
│                                                          │
│   - index.md (who the datamancer is, what they do)       │
│   - Pointers to algebraic-intelligence.dev (chronicle)   │
│     and datamancy.dev (grimoire)                         │
│   - Possibly contact, links, a short bio                 │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ datamancy.dev — GRIMOIRE + MCP SERVER                    │
│ (raw markdown, zero rendering, hash-verified)            │
│                                                          │
│   - <spell-name>.md per spell (or <spell-name>/SKILL.md) │
│   - .well-known/mcp/manifest.json (THE manifest)         │
│   - _headers (Content-Type: text/markdown for *.md)      │
│   - scripts/generate-manifest.mjs (build-time hashing)   │
└──────────────────────────────────────────────────────────┘
```

### MCP consumption flow

```
┌──────────────────────────────────────────────────────────┐
│ datamancy.dev: static content + manifest                 │
│ (Cloudflare Pages, raw markdown, no build framework)     │
└──────────────────────────────────────────────────────────┘
                       │ HTTP GET
                       ▼
┌──────────────────────────────────────────────────────────┐
│ npm adapter (consumer machine)                           │
│                                                          │
│ npx -y @<scope>/datamancy-mcp                            │
│   1. Fetch manifest                                      │
│   2. (Tier 3) Verify manifest sha == hash pinned in src  │
│   3. (Tier 2) Verify manifest.sig against pinned pubkey  │
│   4. On any tool/resource request: fetch content,        │
│      sha256, compare to manifest entry. Mismatch=REJECT. │
│   5. Match → expose via real MCP JSON-RPC stdio          │
└──────────────────────────────────────────────────────────┘
                       │ MCP JSON-RPC stdio
                       ▼
┌──────────────────────────────────────────────────────────┐
│ LLM consumer (Claude / Cursor / etc.)                    │
│                                                          │
│ Standard MCP client. No knowledge of static backend or   │
│ hashes — sees a normal MCP server.                       │
└──────────────────────────────────────────────────────────┘
```

## Trust tiers

| Tier | What it adds | Defeats | Effort |
|---|---|---|---|
| **T1: Hashes in manifest** | SHA-256 per file, manifest authoritative | Single-file tampering | Medium (build script) |
| **T2: Sign the manifest** | GPG/Sigstore signature, public key static-served | Full website compromise (attacker can't forge signature) | High (key mgmt, rotation, ops) |
| **T3: Pin manifest hash in npm pkg source** | Adapter source baked with expected manifest hash | Full website compromise (attacker can't tamper without ALSO compromising npm publish) | Low (~5 lines in adapter) |

**T2 and T3 are independent**, not sequential. Either covers the
"website-fully-compromised" attack via different trust roots:
- T2 trust root = the private signing key
- T3 trust root = the npm publish chain

**Recommended endpoint: T1 + T3.** Covers realistic attack surface for
this project's threat model (personal/artistic, no enterprise consumers
needing attestation chains). T2 is optional, deferred unless threat
model changes.

## Threat model

**In scope:**
- Random internet adversary tampering with content on the website
- MITM injecting alternate content over the wire
- npm package tampering between publish and install

**Out of scope:**
- Compromise of both Cloudflare Pages AND npm publish simultaneously (T3 already requires this for breach)
- LLM-side prompt injection from user input (orthogonal concern, not what this defends)
- Side-channel attacks (timing, cache, etc.)
- Compromise of consumer's local machine after install

## Current state (2026-05-30)

**Domains owned**: `algebraic-intelligence.dev` (chronicle, live);
`datamancer.dev` (identity, registered, not yet published);
`datamancy.dev` (grimoire, registered, not yet published).

**`github.com/watmin/datamancy`** — 16 datamancy spells already in
`<name>/SKILL.md` structure. This repo is the source-of-truth for the
grimoire content. Will be:
- Connected to Cloudflare Pages
- Published as `datamancy.dev`
- Gain `_headers` for MIME types, `scripts/generate-manifest.mjs`, and
  the generated `.well-known/mcp/manifest.json`

**`algebraic-intelligence.dev/public/.well-known/agent-skills/index.json`**
— 16 datamancy spells with SHA-256 hashes already computed. URLs
currently point at `raw.githubusercontent.com` (bot-blockable). In Arc M1
these get repointed at `datamancy.dev/<spell>.md` URLs (unblock bots;
same verifiable hashes since the content is the same files).

**`algebraic-intelligence.dev/public/.well-known/mcp/server-card.json`**
— MCP discovery card, currently flagged `x-no-server: true`. In Arc M1
flips to `x-static-server: true` with `x-server-url: "https://datamancy.dev"`
and a pointer at the manifest hosted there.

**`algebraic-intelligence.dev/public/auth.md`** — agent_auth metadata for
the website. Stays as-is for the website; `datamancy.dev` may or may not
need its own depending on whether it advertises any auth surface (it's
fully public, so probably just a `_headers`-based `text/markdown` MIME
config and no auth machinery).

**`algebraic-intelligence.dev/.claude/skills/consonare/SKILL.md`** —
voice-discipline spell, lives in the website repo (scoped to website's
story chronicle). Mirrored to `github.com/watmin/datamancy/consonare/SKILL.md`
during Arc M1.

**`algebraic-intelligence.dev` build chain** (`package.json` postbuild):
`copy-markdown → generate-llms-companions → check-functions → check-pages`.
Unchanged by Arc M1 (the manifest generation lives in the datamancy repo,
not here).

**`algebraic-intelligence.dev` deps**: unchanged. Node `node:crypto`
suffices for any hash-related work on either side.

**`datamancer.dev`**: no repo yet. Will be a minimal new repo with just
`index.md` + `_headers` + maybe a few related markdown files (about,
links). Connected to Cloudflare Pages, published as `datamancer.dev`.

## Arcs

### Arc M1 — Static manifest + datamancer.dev/datamancy.dev publishing (T1 server side)

**Goal**: Ship the cryptographically verifiable static MCP, server-side
complete, across the three-domain split. Both new domains live; the
existing chronicle site gains its discovery pointers updated. Consumer
side deferred to Arc M2.

**Deliverables — `github.com/watmin/datamancy` repo (→ datamancy.dev)**:
- Mirror `consonare.md` from `algebraic-intelligence.dev/.claude/skills/consonare/SKILL.md`
  to `consonare/SKILL.md` in this repo
- `_headers` file (Cloudflare Pages format) setting
  `Content-Type: text/markdown; charset=utf-8` for `*.md` and `*/SKILL.md`
- `scripts/generate-manifest.mjs` — build-time script that:
  - Walks `*/SKILL.md` (each spell's directory)
  - Computes SHA-256 + byte size per file
  - Captures `git rev-parse --short HEAD` as version
  - Emits `.well-known/mcp/manifest.json`
- Run generate-manifest as part of the publish flow (Cloudflare Pages
  build command, or pre-commit hook, or GitHub Action — decision TBD)
- Cloudflare Pages connection: repo → datamancy.dev with appropriate
  build/publish config

**Deliverables — new datamancer.dev repo**:
- New repo at e.g. `github.com/watmin/datamancer.dev`
- `index.md` — bare markdown, the practitioner's identity card. Three
  pointers minimum:
  - chronicle → `algebraic-intelligence.dev`
  - grimoire → `datamancy.dev`
  - source repos → github.com/watmin (or specific repos)
- `_headers` file for MIME type (same as datamancy.dev)
- Cloudflare Pages connection: repo → datamancer.dev

**Deliverables — `algebraic-intelligence.dev` repo**:
- Update `public/.well-known/agent-skills/index.json`: change each spell's
  `url` field from `raw.githubusercontent.com/watmin/datamancy/main/<spell>/SKILL.md`
  to `https://datamancy.dev/<spell>/SKILL.md` (or flat `https://datamancy.dev/<spell>.md`
  depending on URL shape decision). Hashes don't change (same files).
- Add consonare entry to `agent-skills/index.json` pointing at its new
  datamancy.dev location
- Update `public/.well-known/mcp/server-card.json`:
  - Flip `x-no-server: true` → `x-static-server: true`
  - Add `x-server-url: "https://datamancy.dev"`
  - Add `x-manifest-url: "https://datamancy.dev/.well-known/mcp/manifest.json"`
  - Update `x-note` to describe the static-MCP model + the
    practitioner/grimoire/chronicle split
  - Update `x-recommended-resources` to point at the live manifest
    and the three domain entry points

**Manifest schema (target — lives at `datamancy.dev/.well-known/mcp/manifest.json`)**:

```json
{
  "serverInfo": {
    "name": "datamancy.dev",
    "version": "<git short SHA at build time>"
  },
  "practitioner": "https://datamancer.dev",
  "trust": {
    "algorithm": "SHA-256",
    "tier": 1,
    "signed": false
  },
  "resources": [
    {
      "name": "consonare",
      "uri": "https://datamancy.dev/consonare/SKILL.md",
      "mimeType": "text/markdown",
      "sha256": "<hex>",
      "size": 14234,
      "version": "<git short SHA at build time>"
    }
  ]
}
```

**Acceptance**:
- `datamancy.dev/.well-known/mcp/manifest.json` resolves and is served as
  `application/json`
- Every spell URL in the manifest resolves and serves
  `text/markdown; charset=utf-8`
- Each `sha256` field matches the actual SHA-256 of the URL's content
  (curl + sha256sum verifiable by hand)
- `datamancer.dev/index.md` resolves and serves `text/markdown`
- `algebraic-intelligence.dev/.well-known/mcp/server-card.json` advertises
  datamancy.dev as the server and links manifest URL
- `algebraic-intelligence.dev/.well-known/agent-skills/index.json` points
  at datamancy.dev URLs with same hashes

**Out of scope for M1**: signing, npm package, T3 pinning, complex
manifest features (versioning beyond git SHA, schemas, sub-categories).

### Arc M2 — npm adapter (`@datamancy/mcp`)

**Goal**: Ship the consumer surface. After M2, anyone can add the static
MCP to their Claude/Cursor MCP config and have it work, with hashes
verified on every fetch.

**Deliverables**:
- New package: scope + name TBD (see Open Questions). Working title
  `@datamancy/mcp`.
- Uses `@modelcontextprotocol/sdk` for stdio MCP transport (the standard
  Anthropic SDK).
- Boot sequence:
  1. Fetch manifest from `algebraic-intelligence.dev/.well-known/mcp/manifest.json`
  2. Cache locally (with TTL or version-pinned) — implementation TBD
  3. Expose each manifest entry as an MCP resource
  4. On resource fetch: GET the URL, SHA-256, compare to manifest entry
  5. Mismatch → reject with structured error to Claude
  6. Match → return content as MCP resource payload
- Error handling for hash mismatch (clear error, doesn't fall through to LLM)
- README documenting how to add to Claude Code / Cursor MCP config
- Tests: at minimum, a mismatch-rejection test using fixture data

**Acceptance**: `npx -y <package> @datamancy/mcp` in a Claude Code MCP
config produces a working MCP server. `consonare` and all datamancy
spells are listable + fetchable. Hash mismatch test passes.

**Estimated size**: ~150 LOC TypeScript + tests + README.

**Out of scope for M2**: T3 pinning (lands in M3), signing (lands in M4).

### Arc M3 — T3 pinning (npm package hardens trust)

**Goal**: Make the npm package the trust root. Even if the website is
fully compromised, tampering is detectable because the npm package
source contains the expected manifest hash.

**Deliverables**:
- Build script in `@datamancy/mcp` that, at npm-publish time, reads the
  current manifest from the website and bakes its SHA-256 into a
  generated source file (e.g. `src/pinned-manifest-hash.ts`)
- Runtime check: before consuming the fetched manifest, verify its
  SHA-256 matches the pinned value
- Mismatch → reject, log clearly, refuse to serve any resources
- Version policy: each npm publish pins the current manifest. Updates
  flow as new npm versions (consumers opt-in via `npx`).

**Acceptance**: Tamper test passes — locally modify the website's
manifest, run the adapter, confirm rejection with clear error.

### Arc M4 — T2 signing (optional, deferred)

**Goal**: Sign the manifest with a long-lived private key. Public key is
served as a static file (and pinned in npm). Trust root extends to the
key.

**Deliverables**:
- Decide on signing tooling: GPG vs Sigstore vs minisign vs raw Ed25519
- Key generation + secure storage workflow
- Build-time signing step (after manifest generation)
- Public key publication on the website
- Adapter verification of signature
- Key rotation policy doc

**Acceptance**: Sigverify against pinned pubkey succeeds; tampered
manifest is rejected.

**Decision gate before M4 work begins**: is T1 + T3 sufficient for the
project's threat model? If yes, skip M4 indefinitely.

## Repo layout (confirmed 2026-05-30)

Three repos, three artifacts:

| Repo | Becomes | Published as |
|---|---|---|
| `github.com/watmin/datamancy.dev` (renamed from existing `datamancy`) | Published grimoire site, raw markdown spells, hash-verified manifest | `datamancy.dev` (Cloudflare Pages) |
| `github.com/watmin/datamancy` (NEW after rename) | Node tooling — MCP adapter, T3 pinning, eventually T2 signing tooling | npm registry — name TBD (see Open Questions) |
| `github.com/watmin/datamancer.dev` (NEW) | Published identity site, raw markdown | `datamancer.dev` (Cloudflare Pages) |

Naming is self-documenting: repo name matches the artifact's primary
identity. `datamancy.dev` repo → datamancy.dev site. `datamancer.dev`
repo → datamancer.dev site. `datamancy` repo (no suffix) → canonical
"datamancy as code," published to npm.

### What's in `github.com/watmin/datamancy` (the node tooling repo)

The MCP adapter package. Structure (target for Arc M2):

```
datamancy/                             ← the npm package source
├── package.json                       ← @watmin/datamancy or plain `datamancy`
├── src/
│   ├── index.ts                       ← entry point; stdio MCP server boot
│   ├── manifest.ts                    ← fetch + (T3) pin-verify manifest
│   ├── resources.ts                   ← MCP resource handler; fetch + sha256 + verify
│   ├── pinned-manifest-hash.ts        ← (T3, generated at publish time)
│   └── errors.ts                      ← structured rejection errors
├── tests/
│   ├── manifest-fetch.test.ts
│   ├── hash-verify.test.ts
│   └── mismatch-rejection.test.ts     ← fixture: tampered content rejected
├── scripts/
│   └── pin-manifest.mjs               ← (T3, npm prepublish hook): fetch live
│                                        manifest, SHA-256 it, write to
│                                        pinned-manifest-hash.ts
├── README.md                          ← how to add to Claude Code / Cursor MCP config
└── LICENSE
```

Boot sequence (per design):

1. Fetch `https://datamancy.dev/.well-known/mcp/manifest.json`
2. (T3) SHA-256 the fetched manifest body; compare to value pinned in
   `src/pinned-manifest-hash.ts`. Mismatch → fatal startup error.
3. (T2 future) Verify `manifest.sig` against pinned public key.
4. Parse manifest's `resources` array; register each as an MCP resource.
5. On resource read: fetch the resource URL, SHA-256, compare to the
   manifest entry's `sha256`. Mismatch → structured MCP error to consumer
   ("resource X failed integrity verification"), do NOT pass content.
6. Match → return content as MCP resource payload.

## Open questions

1. **npm package name**. Options:
   - Plain `datamancy` (clean: `npx -y datamancy`). Depends on name being
     available on npm.
   - `@watmin/datamancy` (uses username scope; guaranteed available).
   - `@datamancer/mcp` (would need to claim `@datamancer` scope).
   - Other
2. **Manifest schema versioning**. Add a top-level `schemaVersion` field?
   Use the existing agent-skills.io schema URL? Define our own at e.g.
   `https://algebraic-intelligence.dev/schema/mcp-static/v1.json`?
3. **Hash algorithm: stick with SHA-256?** Universal, no edge cases.
   BLAKE3 is faster but less ubiquitous. Default to SHA-256 unless
   reason to change.
4. **What to do on hash mismatch at runtime**: log + reject with
   structured MCP error (preferred), or noisy crash, or silent fallback?
   Preferred: structured MCP error that explicitly tells Claude "this
   resource failed integrity verification."
5. **Cache policy on website**: short cache for `manifest.json` (so
   updates propagate fast), long cache for content (it's hash-keyed via
   version field so content-at-version is immutable).
6. **Versioning strategy**: git short SHA for `manifest.version`.
   Optionally also semver-tagged manifest snapshots (e.g.
   `manifest-v1.json`, `manifest-v2.json`) for stable pinning. TBD.
7. **Do we publish all 16 datamancy spells via the website mirror?**
   They're hosted on GitHub today. Mirroring them under our domain means
   we serve them, but the canonical source is still the datamancy repo.
   Need a sync policy: build-time pull from GitHub? Manual copy on each
   spell update? Or fork into the website repo and accept divergence?

## Notes from this session (2026-05-30)

- User confirmed: "this is your site as much as it's mine" → model has
  authoring/proposal authority on this design.
- User confirmed scope: "we're going to do all of this — this is an arc
  or few" → multi-arc plan, not a single-shot deliverable.
- User asked whether T1 → T2 → T3 is logical stepping-stone ordering.
  Answer: T1 is foundation, T2 and T3 are independent parallel trust
  layers, not sequential. Recommended order: T1 → npm adapter → T3
  → optionally T2.
- The npm adapter is a hard dependency for actually consuming this. T3
  pinning is cheap (~5 LOC in adapter source) once M2 is in place.
- **2026-05-30 mid-session**: User bought `datamancer.dev`. Original plan
  had the MCP server hosted under `algebraic-intelligence.dev/mcp/...`;
  user pivoted to a dedicated domain.
- **2026-05-30 mid-session**: User bought `datamancy.dev`. The plan now
  splits across three domains: `algebraic-intelligence.dev` (chronicle —
  unchanged role), `datamancer.dev` (identity card, raw markdown),
  `datamancy.dev` (grimoire + MCP server, raw markdown, hash-verified).
- **2026-05-30 mid-session**: User specified "datamancer.dev be another
  markdown site who just points to datamancy" — datamancer.dev is the
  practitioner's identity card; datamancy.dev is the spell library.
  Separation of concerns: who-the-datamancer-is vs what-tools-they-cast.
- **Raw markdown end-to-end** decision: both datamancer.dev and
  datamancy.dev serve bare `.md` files with `Content-Type: text/markdown`.
  No Astro, no Starlight, no rendering layer. The file IS the artifact.
  Hash property is exact (no `.md → .html` transform divergence).

## Update protocol

This file evolves. As arcs land, add per-arc files:

- `docs/static-mcp/M1-BRIEF.md` — when M1 starts
- `docs/static-mcp/M1-INSCRIPTION.md` — when M1 ships
- (etc. for M2, M3, M4)

This DESIGN.md stays current as the master picture. Per-arc files capture
specifics + completion record.
