# Static MCP for algebraic-intelligence.dev — DESIGN

**Status**: Multi-arc plan. Master design captured 2026-05-30.

## The idea

A cryptographically verifiable static MCP server hosted as plain files on
the website. The instruction set (datamancy spells, the consonare voice
discipline, any future skills) becomes a **provably immutable, publicly
auditable prompt distribution channel**.

Trust root = the SHA-256 of each file content, published in a manifest. A
client adapter verifies every fetch against the manifest before any content
reaches an LLM. Tampering = hash mismatch = rejection.

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

## Architecture — three layers

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: Static content + manifest (website, Cloudflare)  │
│                                                             │
│  algebraic-intelligence.dev/                                │
│    ├── mcp/skills/<name>.md         ← skill content         │
│    ├── mcp/spells/<name>.md         ← grimoire content      │
│    ├── .well-known/mcp/manifest.json  ← discovery + hashes  │
│    └── mcp/manifest.json.sig        ← (Tier 2) signature    │
└─────────────────────────────────────────────────────────────┘
                          │ HTTP GET
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 2: npm adapter (consumer machine)                    │
│                                                             │
│  npx -y @datamancy/mcp                                      │
│    1. Fetch manifest                                        │
│    2. (Tier 3) Verify manifest sha == hash pinned in src    │
│    3. (Tier 2) Verify manifest.sig against pinned pubkey    │
│    4. On any tool/resource request: fetch content, sha256,  │
│       compare to manifest entry. Mismatch → REJECT.         │
│    5. Match → expose via real MCP JSON-RPC stdio            │
└─────────────────────────────────────────────────────────────┘
                          │ MCP JSON-RPC stdio
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 3: LLM consumer (Claude / Cursor / etc.)             │
│                                                             │
│  Standard MCP client. No knowledge of static backend or     │
│  hashes — sees a normal MCP server.                         │
└─────────────────────────────────────────────────────────────┘
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

What's already in the repo:

**`public/.well-known/agent-skills/index.json`** — 16 datamancy spells with
SHA-256 hashes already computed. URLs currently point at
`raw.githubusercontent.com` (bot-blockable). Schema:
`https://agentskills.io/schema/v0.2.0.json`. Already implements T1 trust
for the agent-skills.io ecosystem.

**`public/.well-known/mcp/server-card.json`** — MCP discovery card,
currently flagged `x-no-server: true` with `x-recommended-resources`
pointing at `llms.txt`, blog `/topology/`, and a `github.com/watmin/scratch`
future-mcp-design pointer. Will flip to `x-static-server: true` with
`manifest_url` once Arc M1 ships.

**`public/auth.md`** — agent_auth metadata for the website (closed-vocabulary
markers for no-registration, anonymous-api-key flow). Inscribed during the
isitagentready spelunking.

**`.claude/skills/consonare/SKILL.md`** — voice-discipline spell, lives in
the website repo (scoped to website's story chronicle). Will be mirrored
to `public/mcp/skills/consonare.md` in Arc M1.

**Build chain** (`package.json` postbuild):
`copy-markdown → generate-llms-companions → check-functions → check-pages`.
Will gain `generate-mcp-manifest` step in Arc M1.

**Existing deps**: `@astrojs/starlight`, `astro`, `astro-mermaid`, `mermaid`,
`@mermaid-js/layout-elk`, `rehype-external-links`, `sharp`. No dep changes
needed for Arc M1 (Node `node:crypto` is built-in).

## Arcs

### Arc M1 — Static manifest + build automation (server side, T1)

**Goal**: Ship the cryptographically verifiable static MCP, server-side
complete. The site begins serving a real manifest; the consumer side is
deferred to Arc M2.

**Deliverables**:
- Mirror existing datamancy spells from `github.com/watmin/datamancy/` to
  `public/mcp/skills/` (16 files, content matches what's in the existing
  agent-skills index)
- Mirror `consonare.md` from `.claude/skills/consonare/SKILL.md` to
  `public/mcp/skills/consonare.md`
- `scripts/generate-mcp-manifest.mjs` — postbuild script that:
  - Reads every `.md` in `public/mcp/skills/` (and `public/mcp/spells/` if
    added)
  - Computes SHA-256 + byte size per file
  - Captures `git rev-parse --short HEAD` as version
  - Emits `public/.well-known/mcp/manifest.json`
- Wire generate-mcp-manifest into `package.json` postbuild chain
- Flip `public/.well-known/mcp/server-card.json`:
  - `x-no-server: true` → `x-static-server: true`
  - Add `x-manifest-url: "/.well-known/mcp/manifest.json"`
  - Update `x-note` to describe the static-MCP model
  - Update `x-recommended-resources` to point at the live manifest
- Update `public/.well-known/agent-skills/index.json` to mirror datamancy
  URLs from raw.githubusercontent.com → algebraic-intelligence.dev
  (unblock bots, same verifiable hashes)

**Manifest schema (target)**:

```json
{
  "serverInfo": {
    "name": "algebraic-intelligence.dev/datamancy",
    "version": "<git short SHA at build time>"
  },
  "trust": {
    "algorithm": "SHA-256",
    "tier": 1,
    "signed": false
  },
  "resources": [
    {
      "name": "consonare",
      "uri": "https://algebraic-intelligence.dev/mcp/skills/consonare.md",
      "mimeType": "text/markdown",
      "sha256": "<hex>",
      "size": 14234,
      "version": "<git short SHA at build time>"
    }
  ]
}
```

**Acceptance**: Cloudflare Pages serves `manifest.json`. Each `sha256`
field matches the actual content of the URL it points at. A curl-based
verification script can fetch + verify any single entry by hand.

**Out of scope for M1**: signing, npm package, T3 pinning.

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

## Open questions

1. **npm scope/org name**. Options:
   - `@datamancy/mcp` (would need to claim `@datamancy` scope on npm)
   - `@watmin/datamancy-mcp` (uses existing username scope)
   - Unscoped `datamancy-mcp`
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

## Update protocol

This file evolves. As arcs land, add per-arc files:

- `docs/static-mcp/M1-BRIEF.md` — when M1 starts
- `docs/static-mcp/M1-INSCRIPTION.md` — when M1 ships
- (etc. for M2, M3, M4)

This DESIGN.md stays current as the master picture. Per-arc files capture
specifics + completion record.
