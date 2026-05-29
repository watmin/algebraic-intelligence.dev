# auth.md — algebraic-intelligence.dev

> This site has no agent registration system: no accounts, no credentials, no
> tokens. The document exists to signal that explicitly — same doctrine as our
> [oauth-authorization-server](/.well-known/oauth-authorization-server) and
> [oauth-protected-resource](/.well-known/oauth-protected-resource) — rather
> than rely on a missing file to imply the same thing.

## Audience

Agents and humans that want to read documentation hosted at
`https://algebraic-intelligence.dev`. The site is the public face of a
single-author research/writing project; nothing on it is gated.

## Registration

**None required.** There is no register endpoint, no provisioning flow, no
account creation. Agents access content with anonymous GET requests; the same
`curl` you'd use against any static page is sufficient.

## Supported methods

| identity type | credential | flow |
|---|---|---|
| `anonymous` | *(none)* | unauthenticated GET against any URL |

The same `anonymous` identity type is advertised in
[`/.well-known/oauth-authorization-server`](/.well-known/oauth-authorization-server)
under `agent_auth.identity_types_supported`. The `anonymous.credential_types_supported`
array is intentionally empty there — no credentials issued, by design.

## Credentials issued

**None.** This site issues no API keys, no access tokens, no bearer credentials.
Nothing to claim. Nothing to revoke. The companion
[`/.well-known/oauth-protected-resource`](/.well-known/oauth-protected-resource)
declares the same shape: empty `authorization_servers`, `scopes_supported`, and
`bearer_methods_supported`.

## Why this file exists

The Cloudflare *isitagentready* checker expects an `auth.md` companion to OAuth
metadata, even when the operational answer is "no auth." Following the same
discipline as the site's other `.well-known` documents, this file is **explicit
rather than absent** — structurally empty, not accidentally missing. An agent
that fetches `auth.md` reads exactly this, and knows.

## Pointers

- **Agent map:** [/llms.txt](https://algebraic-intelligence.dev/llms.txt)
- **Site topology:** [/blog/topology/](https://algebraic-intelligence.dev/blog/topology/)
- **OAuth Authorization Server metadata:** [/.well-known/oauth-authorization-server](https://algebraic-intelligence.dev/.well-known/oauth-authorization-server) — see the `agent_auth` block for the JSON companion to this document.
- **OAuth Protected Resource metadata:** [/.well-known/oauth-protected-resource](https://algebraic-intelligence.dev/.well-known/oauth-protected-resource)
- **API catalog:** [/.well-known/api-catalog](https://algebraic-intelligence.dev/.well-known/api-catalog)
- **MCP server card:** [/.well-known/mcp/server-card.json](https://algebraic-intelligence.dev/.well-known/mcp/server-card.json)
- **Agent skills index:** [/.well-known/agent-skills/index.json](https://algebraic-intelligence.dev/.well-known/agent-skills/index.json)
