# BRIEF — M1.D — Scaffold datamancer.dev identity site

**Goal**: Ship the practitioner identity site. Raw markdown, zero
rendering, three pointers (chronicle / grimoire / source). Ready for
Cloudflare Pages connection once DNS propagates.

**Estimated effort**: 15 minutes

**Dependencies**: GitHub repo `github.com/watmin/datamancer.dev` exists
(user created it). DNS propagation in progress (doesn't block scaffold,
does block Cloudflare Pages connection at the end).

## Deliverables

Working directory: `~/work/holon/datamancer.dev/` (clone the GitHub repo
if not present locally).

### Files

**`index.md`** — the practitioner's identity card. Bare markdown. No
rendering. Should answer "who is the datamancer" and "where do their
artifacts live."

Suggested structure (voice-discipline-applies if it gets long):

```markdown
# datamancer

The practitioner of [datamancy](https://datamancy.dev) — the practice
of composing focused, hash-verifiable spells for LLMs.

## Where to find the work

- **[algebraic-intelligence.dev](https://algebraic-intelligence.dev)** — the chronicle. The story of building the substrate.
- **[datamancy.dev](https://datamancy.dev)** — the grimoire. 18 spells served as raw markdown with an Ed25519-signed MCP manifest.
- **[github.com/watmin](https://github.com/watmin)** — source repos.

## Identity

watmin / john shields. AWS Shield Cognition / wat-rs / holon / Aetherium Datavatum lineage.

## Contact

[john@shields.wtf](mailto:john@shields.wtf)
```

(User refines the body — this is a starting draft.)

**`_headers`** — same MIME config as datamancy.dev:

```
/*.md
  Content-Type: text/markdown; charset=utf-8
```

**`.gitignore`** — defensive (no `.pem`, no `node_modules`):

```
.DS_Store
node_modules/
*.pem
*.key
```

**`README.md`** — brief mention that this is the source for
`datamancer.dev`, raw markdown idiom, pointers at the chronicle and
grimoire.

## Acceptance

- `index.md` written in user's voice (review before pushing)
- `_headers` configured for `text/markdown`
- Committed + pushed to `github.com/watmin/datamancer.dev`
- Cloudflare Pages connection ready to be made once DNS resolves
  (separate user-side step in the Cloudflare dashboard)

## Out of scope

- Cloudflare Pages connection itself (M1.E — user does in dashboard)
- Designing a multi-page identity site — single index.md only
- Any styling, JS, framework — bare markdown only
