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

| ID | Item | Status | Notes |
|---|---|---|---|
| M1.E | DNS propagation + Cloudflare Pages setup for `datamancy.dev` + `datamancer.dev` | ⏸️ | User-side: nameserver delegation propagating. Hours typical. |

## Up next (when M1.E unblocks)

| ID | Item | Status | Brief | Dependency |
|---|---|---|---|---|
| M1.C | Cross-references on algebraic-intelligence.dev — repoint `agent-skills/index.json` URLs + flip `mcp/server-card.json` to `x-static-server: true` + add `consonare` entry | ✅ | shipped — see `INSCRIPTIONS.md` | (was unblocked, shipped during DNS prop) |
| M1.D | Scaffold `datamancer.dev` identity site — `index.md` + `_headers` + Cloudflare Pages connection | ✅ | shipped — see `INSCRIPTIONS.md` | (repo + push done; Cloudflare Pages connection still waits for DNS — that's M1.E) |
| M1.F | End-to-end smoke test once both domains are live (curl manifest, curl signature, `npx -y datamancy`) | 📋 | None yet (~5 min ad-hoc test) | M1.E + M1.D landed |

## Then (arc opens after M1 closes)

| ID | Item | Status | Brief | Dependency |
|---|---|---|---|---|
| M3 | Tier 3 — pin manifest SHA-256 in npm package source. Bump to `v0.0.2`. Trust matrix closes its last cell. | 📋 | [BRIEFS/C-tier3-pinning.md](BRIEFS/C-tier3-pinning.md) | M1.F (the manifest must be live + verified end-to-end first) |

## Deferred (intentional)

| ID | Item | Status | Why deferred |
|---|---|---|---|
| M4 | Test suite for npm package — fixture-based tests for Tier 1 + Tier 2 verification | 💤 | Lower value-per-minute than shipping M1 + M3 first. The logic is small and testable; tests codify it but don't unblock anything. |
| M5 | Chronicle entry — story post about static-MCP work | 💤 | Creative, requires `/consonare` voice pass. Best written once the dust settles and the user is in writing mode. Will probably land as `series-007-001-the-static-mcp.md` or similar (next series block). |

## Momentum-ordering notes

Per the doctrine: when multiple items are free of artifact-dependency,
finish the path you're on. Current hot context: the chronicle's
cross-reference layer (M1.C). Pick that first while DNS propagates.

M1.D (datamancer.dev scaffold) can be done in parallel with M1.C since
they touch disjoint repos. Either order is fine; momentum says do M1.C
first because we're already in the chronicle repo's design.
