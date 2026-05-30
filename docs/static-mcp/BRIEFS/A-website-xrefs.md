# BRIEF — M1.C — Cross-references on algebraic-intelligence.dev

**Goal**: Update the chronicle site's discovery artifacts to point at
`datamancy.dev` and include `consonare`. The chronicle stops claiming
"no MCP server here" and starts pointing at the live one.

**Estimated effort**: 15-20 minutes

**Dependencies**: None. The new URLs (e.g.
`https://datamancy.dev/cernere/SKILL.md`) won't resolve until DNS
propagates, but writing the references is unblocked. They auto-go-live
once DNS resolves.

## Deliverables

### 1. Update `public/.well-known/agent-skills/index.json`

Repoint every existing entry's `url` field from
`https://raw.githubusercontent.com/watmin/datamancy/main/<spell>/SKILL.md`
to `https://datamancy.dev/<spell>/SKILL.md`. Hashes don't change
(same files, just different URL).

Add a new 18th entry for `consonare`:

```json
{
  "name": "consonare",
  "type": "tests-of-voice",
  "description": "Hear whether new prose rings in tune with the chronicle's voice. The datamancer consonat the draft against the gold anchors — does each line carry the substrate-event register? Does the close earn its verdict?",
  "url": "https://datamancy.dev/consonare/SKILL.md",
  "sha256": "<copy from datamancy.dev/.well-known/mcp/manifest.json>",
  "x-documentation": "https://github.com/watmin/datamancy.dev/blob/main/consonare/SKILL.md"
}
```

**Where to get the SHA-256**: open
`~/work/holon/datamancy.dev/.well-known/mcp/manifest.json`, find the
`consonare` entry, copy its `sha256` field.

### 2. Update `public/.well-known/mcp/server-card.json`

Flip the static-MCP posture:

```json
{
  "serverInfo": {
    "name": "algebraic-intelligence.dev",
    "version": "0.1.0"
  },
  "capabilities": {
    "resources": {}
  },
  "x-static-server": true,
  "x-server-url": "https://datamancy.dev",
  "x-manifest-url": "https://datamancy.dev/.well-known/mcp/manifest.json",
  "x-note": "Algebraic-intelligence.dev is the chronicle (story, polished, rendered). The actual MCP server is at datamancy.dev — a cryptographically verifiable static MCP serving the datamancy grimoire. Manifest is Ed25519-signed; npm adapter at `npx -y datamancy` verifies before any content reaches the LLM. See https://github.com/watmin/datamancy for the consumption client.",
  "x-recommended-resources": [
    {
      "name": "datamancy-mcp-manifest",
      "uri": "https://datamancy.dev/.well-known/mcp/manifest.json",
      "mimeType": "application/json",
      "description": "The signed MCP manifest — 18 spells, SHA-256 verified, Ed25519 signed."
    },
    {
      "name": "datamancer.dev",
      "uri": "https://datamancer.dev",
      "mimeType": "text/markdown",
      "description": "The practitioner's identity card."
    },
    {
      "name": "llms.txt",
      "uri": "https://algebraic-intelligence.dev/llms.txt",
      "mimeType": "text/markdown",
      "description": "Agent map for this chronicle site."
    },
    {
      "name": "topology",
      "uri": "https://algebraic-intelligence.dev/blog/topology/",
      "mimeType": "text/html",
      "description": "How to read this site — trunk + branches + cliff notes."
    }
  ]
}
```

(Replace the old `x-no-server: true` + future-mcp-design pointer.)

### 3. Update `docs/static-mcp/DESIGN.md`

Reflect the fact that M2 (npm adapter) shipped inline with M1, and M4
(signing) was folded in as well. Add a short note at the top of the
"Arcs" section that M1 status is now "datamancy.dev scaffold +
npm package both shipped; awaiting Cloudflare Pages + DNS for go-live."

## Acceptance

- `public/.well-known/agent-skills/index.json` has 18 entries, all with
  `datamancy.dev` URLs
- `public/.well-known/mcp/server-card.json` has `x-static-server: true`
  and points at datamancy.dev
- DESIGN.md status line updated
- `npm run build` clean
- Commit + push

## Out of scope

- Actually testing the URLs (waits for DNS)
- Writing the chronicle story post (deferred to M5)
- Changing the website itself (chronicle stays Astro/rendered; this is
  just discovery metadata)
