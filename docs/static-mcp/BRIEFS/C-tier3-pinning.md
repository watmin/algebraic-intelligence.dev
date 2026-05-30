# BRIEF — M3 — Tier 3: pin manifest SHA-256 in npm package source

**Goal**: Close the last unfilled cell of the trust matrix. After M3,
even if datamancy.dev is fully compromised AND the offline private key
is stolen, tampering is detectable because the npm publish chain must
also be compromised to change the pinned manifest hash.

**Estimated effort**: 30 minutes (mostly testing + bump-and-publish)

**Dependencies**: M1.F — datamancy.dev must be live and the end-to-end
smoke test (T1 + T2 verification path) must pass with the v0.0.1
package. Pin only after the manifest format is settled.

## Deliverables

### 1. Add `src/pinned-manifest-hash.ts` to the datamancy npm package

```typescript
/**
 * SHA-256 of the manifest at datamancy.dev/.well-known/mcp/manifest.json
 * at the time this version of the npm package was published.
 *
 * The boot sequence hashes the fetched manifest bytes and compares to
 * this constant BEFORE signature verification runs. Mismatch = either
 * the manifest changed and this package needs a republish, OR the
 * manifest was tampered with. Either way: reject.
 *
 * Updated by scripts/pin-current-manifest.mjs at npm prepublish time.
 *
 * Captured: <date>
 * From: https://datamancy.dev/.well-known/mcp/manifest.json
 * Manifest version (git short SHA): <short SHA from datamancy.dev>
 */

export const PINNED_MANIFEST_SHA256 =
  "<64-char hex computed from current live manifest>";
```

### 2. Update `src/index.ts` to verify pinned hash

Insert after manifest bytes fetched, before signature verify:

```typescript
import { createHash } from 'node:crypto';
import { PINNED_MANIFEST_SHA256 } from './pinned-manifest-hash.js';

// ...

const actualManifestHash = createHash('sha256').update(manifestBytes).digest('hex');
if (actualManifestHash !== PINNED_MANIFEST_SHA256) {
  throw new Error(
    `Manifest hash mismatch. Expected ${PINNED_MANIFEST_SHA256} (pinned in package), ` +
    `got ${actualManifestHash} (from live manifest). ` +
    `This means the manifest at datamancy.dev has changed since this npm package was published. ` +
    `Update to the latest npm version: \`npm update datamancy\` or \`npx -y datamancy@latest\`.`
  );
}
log('manifest SHA-256 matches pinned value');
```

### 3. Add `scripts/pin-current-manifest.mjs`

Build-time helper that fetches the live manifest, computes its
SHA-256, rewrites `src/pinned-manifest-hash.ts` with the current hash
and metadata. Run before each npm publish.

### 4. Update `package.json` prepublish

```json
"scripts": {
  "build": "tsc",
  "pin": "node scripts/pin-current-manifest.mjs",
  "prepublishOnly": "npm run clean && npm run pin && npm run build"
}
```

So every `npm publish` automatically pulls the current manifest hash
and bakes it in. Forgetting is impossible.

### 5. Bump to v0.0.2 + publish

```bash
cd ~/work/holon/datamancy
npm version patch  # 0.0.1 → 0.0.2
npm publish
```

Verify on npm registry that v0.0.2 has the pinned hash and works
end-to-end.

## Acceptance

- `src/pinned-manifest-hash.ts` exists and matches the live manifest's
  SHA-256
- Boot sequence verifies pinned hash before signature verify
- Hash mismatch produces a clear, actionable error (tells user to
  `npm update`)
- `npm publish` triggers `pin` automatically
- v0.0.2 published, `npm view datamancy versions` shows both 0.0.1 and 0.0.2
- v0.0.2 boots successfully against the live datamancy.dev
- Tampering test: modify the live manifest locally (in CDN cache or
  Cloudflare KV — or just edit the file in the repo and republish),
  v0.0.2 should reject with the new error

## Trust matrix after M3

| Attack | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| Tamper one spell | ✓ | ✓ | ✓ |
| Tamper manifest + spells | ✗ | ✓ | ✓ |
| Website fully compromised | ✗ | ✓ | ✓ |
| Website + private key both compromised | ✗ | ✗ | ✓ (npm pin still holds) |
| Website + key + npm publish all compromised | ✗ | ✗ | ✗ (game over) |

## Versioning policy after M3

Each time the manifest at datamancy.dev changes (new spell added, spell
edited, etc.), bump npm package to a new version. Coupled release
cycle. Consumers update via `npm update datamancy` or just always
run `npx -y datamancy@latest`.

## Out of scope

- Detached signature on the npm package itself (npm provenance / sigstore — separate trust layer entirely)
- Hash agility (supporting both SHA-256 and BLAKE3) — defer until needed
