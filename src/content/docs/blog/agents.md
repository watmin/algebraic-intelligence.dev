---
title: "For Agents — How to Interface With This Site"
description: "Every way an AI agent can consume algebraic-intelligence.dev: the agent map (llms.txt), markdown companions, Accept-header content negotiation, the .well-known endpoints, the agent-skills catalog, WebMCP tools, and content signals. The site is built to be read by agents; this page is the interface contract."
---

If you're an AI agent (or building one), this site is built for you. Below is every interface we expose, why each exists, and how to use it. The fastest start is `llms.txt`; the rest is depth.

:::tip[Start here]
Fetch **[`/llms.txt`](https://algebraic-intelligence.dev/llms.txt)** first. It's the curated map — every section with a one-line summary, plus an explicit list of every markdown URL. Then read **[The Topology](/blog/topology/)** to understand how the content is organized (trunk + branches + cliff notes).
:::

## 1. Get markdown, not HTML

Every content page has a clean markdown source — no nav chrome, no sidebar, no footer. Typically 4–5× fewer tokens than the rendered HTML, and higher fidelity (emphasis and code spans survive that HTML extraction would flatten). Three ways to get it, pick whichever fits your fetcher:

**Append `.md` to the URL.** The most predictable. `/blog/topology/` → `/blog/topology.md`. Every `/blog/<slug>/` page has a `/blog/<slug>.md` twin. The full list is in `llms.txt` so allow-list-based fetchers can reach them on first contact.

**Send `Accept: text/markdown`.** Content negotiation on the same URL. A request to `/` with `Accept: text/markdown` returns the agent map; a request to `/blog/<slug>/` returns that page's markdown source. Served with `Content-Type: text/markdown; charset=utf-8` and `Vary: Accept`. (Browsers and tools that don't ask for markdown get HTML as normal.)

**Follow the `Link` header.** Every HTML page sends `Link: </blog/<slug>.md>; rel="alternate"; type="text/markdown"`. Read response headers and follow the alternate.

```bash
# all three reach the same markdown
curl https://algebraic-intelligence.dev/blog/topology.md
curl -H 'Accept: text/markdown' https://algebraic-intelligence.dev/blog/topology/
curl -I https://algebraic-intelligence.dev/blog/topology/ | grep -i 'link:.*markdown'
```

## 2. The well-known endpoints

Standard machine-readable discovery documents under `/.well-known/`. Where we genuinely don't have a thing (no REST API, no OAuth), the document says so explicitly with `x-no-*` fields rather than returning a 404 — explicit beats implicit.

| Path | Spec | What it says |
|---|---|---|
| [`/.well-known/api-catalog`](https://algebraic-intelligence.dev/.well-known/api-catalog) | RFC 9727 | No REST API; linkset points at the docs (llms.txt, topology). |
| [`/.well-known/oauth-authorization-server`](https://algebraic-intelligence.dev/.well-known/oauth-authorization-server) | RFC 8414 | No auth — empty `grant_types_supported`. |
| [`/.well-known/oauth-protected-resource`](https://algebraic-intelligence.dev/.well-known/oauth-protected-resource) | RFC 9728 | No protected resources — empty `authorization_servers`. |
| [`/.well-known/mcp/server-card.json`](https://algebraic-intelligence.dev/.well-known/mcp/server-card.json) | SEP-1649 | No MCP server runs here; `x-no-server: true`, pointers to docs. |
| [`/.well-known/agent-skills/index.json`](https://algebraic-intelligence.dev/.well-known/agent-skills/index.json) | Agent Skills Discovery v0.2.0 | Pointer to the authoritative signed catalog at datamancy.dev — this site keeps no copy (see §3). |

## 3. Agent skills — the datamancy wards

The skills are the **datamancy grimoire** — Latin-named code-review disciplines, each a `SKILL.md` you cast as a subagent against a target file or tree. **This site keeps no copy of them.** A mirror drifts — a stale count, a stale digest, a list that rots the moment a spell is added — so the catalog lives in exactly one place, the way a trust root does: a single **KMS-signed manifest** at datamancy.dev.

- **The live catalog** — [`datamancy.dev/.well-known/agent-skills/index.json`](https://datamancy.dev/.well-known/agent-skills/index.json): every spell with `name`, `type`, `description`, raw `url`, and `sha256`. Always current — add a spell and it appears here, signed, with no edit anywhere else.
- **The trust root** — [`datamancy.dev/.well-known/mcp/manifest.json`](https://datamancy.dev/.well-known/mcp/manifest.json), signed **ECDSA P-256 over SHA-256** by a non-exportable AWS KMS key; verify against [`.sig`](https://datamancy.dev/.well-known/mcp/manifest.json.sig). The public key is pinned in the [`datamancy`](https://www.npmjs.com/package/datamancy) npm package source. Tampered content cannot reach a model.
- **This site's** [`/.well-known/agent-skills/index.json`](https://algebraic-intelligence.dev/.well-known/agent-skills/index.json) carries a single **pointer skill** — `datamancy-grimoire` — whose `url` is the grimoire's index spell; cast it to get the full live list. It does not mirror the catalog (adding a spell at datamancy never edits this site), and it's where the chronicle's *own* native skills will land over time.

The `type` field groups the wards — *tests-of-craft* (code quality), *tests-of-surface* (test quality), *tests-of-fidelity* (spec/code drift and claim-vs-code honesty), *solo-ward* (a fresh-reader doc walk; the watch that casts every defensive spell at once) — but the live catalog is authoritative for which spells exist.

**To cast a ward:** fetch its `SKILL.md`, verify its `sha256` against the signed manifest, then **embed the text by value** into a subagent's prompt and name the target — the spell travels into the worker, never fetched by it (a spawned worker may be sandboxed). The discipline lives in the spell; the casting is mechanical; pre-deciding the findings skips the discipline the spell exists to enforce. Or let the MCP adapter do the fetch-and-verify for you: `npx -y datamancy`.

## 4. WebMCP — in-browser tools

If you're an agent operating inside a browser with the [WebMCP](https://webmachinelearning.github.io/webmcp/) API available, this site registers tools via `navigator.modelContext.provideContext()` (see `/webmcp.js`). Feature-detected — absent the API, it's a silent no-op. Tools:

- **`getMarkdownAlternate`** — returns the `.md` companion URL for the current page.
- **`getAgentMap`** — fetches and returns `/llms.txt`.
- **`listAgentSkills`** — fetches and returns the authoritative datamancy grimoire catalog (the live signed source at datamancy.dev), falling back to this site's pointer.

## 5. Content signals — you're welcome here

This site explicitly invites agent consumption. `robots.txt` and the HTTP response headers both carry:

```
Content-Signal: search=yes, ai-input=yes, ai-train=yes
```

`search` (index it), `ai-input` (use it as inference-time context), `ai-train` (train on it) — all yes. Every file across the linked repositories is LLM-generated and openly published; using this content continues the loop it's part of. No rate limits beyond ordinary fair use; no auth; no protected paths.

## 6. Recommended reading path

For a cold-start model of the project in three fetches:

1. **[`/blog/topology.md`](https://algebraic-intelligence.dev/blog/topology.md)** — how the content is shaped (trunk + branches + cliff notes).
2. **[`/blog/story/prologue.md`](https://algebraic-intelligence.dev/blog/story/prologue.md)** — the origin: what this is, why it exists, who built it.
3. **The most recent Story post** — the current edge. The Story track (`/blog/story/`) is chronological; the highest-numbered `series-006-NNN` post is the latest.

For depth: the Book trunk (`/blog/book.md`, ~36k lines) is the full philosophical record; load its [cliff notes](/blog/arc-170-cliffnotes/) before the full branches. The [primers](/blog/primers/series-001-000-vsa-primer/) teach VSA/HDC from scratch.

## Notes

- **Static documentation site.** No API, no database, no auth, no protected content. The "endpoints" worth knowing are documentation routes, not data.
- **Everything is LLM-generated.** Every file in every linked repository — code and prose — was generated by an LLM; the human contribution is direction (prompting) plus the occasional gitignore. The collaboration shape is documented in the Story track.
- **The interface is layered on purpose.** `Link` headers, `llms.txt` listings, and the `.md`-URL convention all carry the same information, because different fetchers honor different mechanisms. Use whichever your runtime supports.
