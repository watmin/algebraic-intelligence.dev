---
name: datamancy-grimoire
description: How to reach, verify, and cast the datamancy grimoire — the authoritative, KMS-signed library of Latin-named code-review wards. Start here; the live catalog and signatures live at datamancy.dev.
---

# datamancy-grimoire — the pointer skill

algebraic-intelligence.dev is the chronicle. The **wards** — Latin-named code-review disciplines, each a `SKILL.md` you cast as a subagent against a target file or tree — live at **datamancy.dev**, the grimoire's authoritative home. This chronicle does not mirror the catalog; it points at it. This skill is the pointer.

This skill references datamancy **by URL**, never by a pinned digest, so it stays correct as the grimoire grows: adding a ward changes datamancy and nothing here. Each domain certifies its own content — this file's `sha256` covers this file; the wards' integrity is proven against datamancy's signed manifest.

## The catalog

- **Catalog** — <https://datamancy.dev/.well-known/agent-skills/index.json>: every ward with `name`, `type`, `description`, `url`, `sha256`. Always current.
- **Signed manifest (trust root)** — <https://datamancy.dev/.well-known/mcp/manifest.json>: signed **ECDSA P-256 over SHA-256** by a non-exportable AWS KMS key; verify against <https://datamancy.dev/.well-known/mcp/manifest.json.sig>. The public key is pinned in the [`datamancy`](https://www.npmjs.com/package/datamancy) npm package source.
- **Grimoire index spell** — <https://datamancy.dev/grimoire/SKILL.md>: "open this first; it lists every spell."

## How to cast a ward

1. Fetch the catalog (or the grimoire index spell) and choose a ward for your task.
2. Fetch the ward's `SKILL.md` from its `url`.
3. Verify its `sha256` against the signed manifest — or let `npx -y datamancy`, the zero-dependency adapter, fetch-and-verify for you.
4. **Embed the verified text by value** into a subagent's prompt and name the target. The spell is cast *into* the worker, never fetched by it (a spawned worker may be sandboxed). The discipline lives in the spell; the casting is mechanical; pre-deciding the findings skips the discipline the spell exists to enforce.

Reach the signed catalog, verify, cast by value. That is the whole pointer.

## Trust

Be clear about what this file is and isn't. This pointer is served over TLS and is content-addressed — this site's skills index publishes a `sha256` for it, and the bytes you fetch hash to that value. That proves **integrity against corruption; it is not a signature.** This file is not cryptographically signed, so its trust root is the `algebraic-intelligence.dev` origin itself.

The wards are stronger, and that is where your trust belongs. Each ward is verified against datamancy's manifest, signed **ECDSA P-256 over SHA-256** by a non-exportable AWS KMS key whose public key is **pinned out-of-band** — in the [`datamancy`](https://www.npmjs.com/package/datamancy) npm package source, at [datamancer.dev](https://datamancer.dev), and in DNS (`_datamancy-key.datamancer.dev`). Anchor there, not here: pin the key from one of those independent channels and verify every ward against it. Then a compromise of *this* signpost degrades to at worst a wrong URL — it cannot forge a ward, because ward authenticity is checked against the pinned key, never against this pointer.
