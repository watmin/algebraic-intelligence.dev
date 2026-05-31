# Static MCP — Remaining Order (live tracker)

Updated as work lands. Per the **momentum-ordering doctrine**: when items
are free of artifact-dependency, finish the path you're on. When ordered
by dependency, the dependency wins.

## Status legend

- ✅ **DONE** — shipped, see `INSCRIPTIONS.md`
- 🔨 **IN-PROGRESS** — actively being worked
- ⏸️ **BLOCKED** — waiting on external (DNS, user action, etc.)
- 📋 **PENDING** — ready to start, just not started
- 💤 **DEFERRED** — explicitly chosen to wait

## Now

**ARC CLOSED — 2026-05-31. Nothing remains.** The static-MCP arc ran from
`M0-design` to a never-patched `datamancy@1.0.0`, a named architecture
(**`cardo`**), a published chronicle entry, and three agent-ready domains at
100% on Cloudflare's readiness checker — **nineteen hours, start to finish.**
Full record in `INSCRIPTIONS.md` (newest at top).

Live state, for the record:
- `datamancy@1.0.0` on npm — `latest`, SLSA `provenance/v1` attested,
  registry-signed, **never to be patched**. The major version IS the key
  generation (`1.x` trusts the pinned key `09db7668…`; a new key = a new major).
- **21 resources** in the ECDSA P-256-signed manifest (was 20 + the generated
  `grimoire` index; `circumspicere` is the 18th spell).
- Three domains agent-discoverable (robots / llms / `_headers` Link / `auth.md` /
  WebMCP / `.well-known/{api-catalog, oauth-*, mcp/server-card, agent-skills}` /
  DNS-AID under DNSSEC / markdown content-negotiation).

## Milestones — all closed

| ID | Item | Status | Closed | Detail |
|---|---|---|---|---|
| M0 | Multi-arc DESIGN.md | ✅ | 05-30 | `INSCRIPTIONS.md` |
| M1 | Both domains live on Cloudflare Pages; MCP proven through a real client | ✅ | 05-30 | `INSCRIPTIONS.md` |
| M2 | npm zero-dep adapter | ✅ | 05-30 | folded into M1 |
| M3 | Tier 3 — pin manifest SHA-256 in package source; trust matrix complete | ✅ | 05-30 | superseded by the living model (M6) + 1.0.0 freeze |
| M-hardening | 0.0.4 → 0.0.13: four full-grimoire assaults (24→22→6→0), `circumspicere` born, provenance pipeline, frozen-doc review | ✅ | 05-30→31 | `INSCRIPTIONS.md` |
| M6 | **Living vs sealed trust model — DECIDED: living.** Content dynamic, kernel frozen; reload+memo subsumed (re-fetch+verify every call). | ✅ | 05-31 | [BRIEFS/F-living-reload-memo.md](BRIEFS/F-living-reload-memo.md) |
| M-freeze | `1.0.0` frozen — promote byte-identical `0.0.13`; key model decided (single key, loss→new major); cold-room measured | ✅ | 05-31 | `INSCRIPTIONS.md` |
| M-cardo | The architecture named by `intueri`: **`cardo`** — the hinge. Signed-eval founding thread recognized (`eval-signed!` arc 026). | ✅ | 05-31 | `INSCRIPTIONS.md`, memory `project_signed_eval_thread` |
| M5 | Chronicle entry — "The Hinge" (`series-007-001`), 6× cold consonare MATCHES/9 | ✅ | 05-31 | `/blog/story/series-007-001-the-hinge.md` |
| M4 | Test suite for the npm package — **115 tests** (T1 + T2 + rigidity + ssrf + rollback + zero-dep + …) | ✅ | 05-30→31 | gates the publish workflow |
| M-agent-ready | Three domains agent-discoverable; 100% on isitagentready | ✅ | 05-31 | `INSCRIPTIONS.md` |

## Deferred (intentional, post-arc)

| Item | Status | Note |
|---|---|---|
| Publish a realizations/cliffnotes **branch** on the site (like arc-170) | 💤 | The story post (The Hinge) carries the public narrative; the build log lives in `docs/static-mcp/`. Publish only if the detailed journal is wanted live. |
| Refresh the alg-int `.well-known` agent-skills/server-card (stale: Ed25519, missing circumspicere, "18 spells") | 💤 | The reference's own copies drifted; datamancy.dev's are generated + correct. Cosmetic for the reference's accuracy. |

## Momentum-ordering notes (historical)

The arc closed on the path it was on: hardening → freeze → name → chronicle →
agent-ready, each finishing before the next opened (the no-regression-until-arc-
done discipline). The one branch was the agent-readiness sweep, which surfaced its
own requirements (WebMCP needs HTML; HTML breaks markdown-negotiation) and was
pivoted forward into rather than deferred.
