# BRIEF — M4 — Test suite for datamancy npm package

**Goal**: Codify the Tier 1 + Tier 2 + Tier 3 verification behavior as
fixture-based tests. Make tampering detection explicit and audit-able
without running the package against a live server.

**Status**: 💤 DEFERRED — lower value-per-minute than shipping M1 + M3.
Tests don't unblock anything; they document. The verification logic
is small (~150 LOC across manifest/signature/resources) and obvious
on read.

**Estimated effort when undeferred**: 30-45 minutes

## Deliverables

`test/` directory in the datamancy npm package, using Node's built-in
`node:test` runner (no dev deps).

### Test fixtures

`test/fixtures/`:
- `valid-manifest.json` — a known-good signed manifest (snapshot from
  live datamancy.dev at publish time)
- `valid-manifest.json.sig` — its signature
- `valid-pubkey.pem` — matching pubkey (override the pinned one for
  test purposes)
- `tampered-manifest.json` — same shape but with one hash modified
- `valid-spell.md` — a known-good spell content matching a manifest entry

### Test suites

`test/manifest.test.ts`:
- Parses valid manifest → returns expected resource count
- Rejects malformed JSON
- Rejects manifest missing required fields
- Rejects manifest with non-hex sha256
- Rejects manifest with negative size

`test/signature.test.ts`:
- Verifies valid signature → returns true
- Rejects mismatched signature → throws SignatureInvalidError
- Rejects manipulated manifest bytes → signature invalid
- Rejects garbage sig bytes → throws cleanly

`test/resources.test.ts`:
- fetchAndVerify with valid content + matching hash → returns content
- fetchAndVerify with tampered content (different bytes than hash) →
  throws HashMismatchError
- fetchAndVerify with size mismatch → throws SizeMismatchError
- fetchAndVerify with HTTP error → throws ResourceFetchError

`test/protocol.test.ts`:
- JSON-RPC request → dispatched to handler
- Notification → handler called, no response written
- Unknown method → MethodNotFound response with correct id
- Malformed JSON → ParseError with id: null
- Handler throws → InternalError response with id matched

### Run

```bash
cd ~/work/holon/datamancy
npm test
# uses node --test (built-in, zero deps)
```

## Acceptance

- All four suites pass
- Mismatch tests demonstrate the rejection path works
- No new runtime deps added (test/ excluded from published files via
  `package.json#files`)

## Out of scope

- Integration tests against real datamancy.dev (network-dependent;
  these are unit tests)
- Coverage tooling (defer to M4.1 if pursued)
- Property-based tests (defer to M4.2)
