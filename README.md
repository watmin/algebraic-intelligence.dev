# algebraic-intelligence.dev

The documentation site for **Holon** — a VSA/HDC substrate, the `wat` language, and the labs built on them. Starlight + Astro static site, deployed on Cloudflare Pages (git push → build → deploy).

Live: <https://algebraic-intelligence.dev>

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # full production build (runs the postbuild pipeline below)
npm run preview  # serve the built dist/
```

**Node 24 is required.** Pinned in `.node-version` (and in the Cloudflare dashboard `NODE_VERSION=24`). Don't drop below it — see "Deploy gotcha" below.

## Build pipeline

`npm run build` is `rm -rf .astro && astro build`, then `postbuild` runs four scripts in order:

| Script | Does |
|---|---|
| `scripts/copy-markdown.mjs` | Mirrors every `src/content/docs/blog/**/*.md` into `dist/blog/**/*.md` — the markdown companions agents fetch (e.g. `/blog/topology.md`). |
| `scripts/generate-llms-companions.mjs` | Regenerates the explicit `.md` URL list in `public/llms.txt` between sentinel markers, from what's on disk. Keeps llms.txt in sync as posts are added. |
| `scripts/check-functions.mjs` | esbuild-parses every `functions/*.ts` (the same toolchain Cloudflare uses) — fails the build on a syntax error so a broken Pages Function can't deploy. |
| `scripts/check-pages.mjs` | **The guard.** Counts content sources under `src/content/docs/` and verifies each rendered an `index.html` in `dist/`. Any miss fails the build — an incomplete build can never deploy. |

`npm run skills:regen` (manual) regenerates `public/.well-known/agent-skills/index.json` from the sibling `../datamancy` grimoire. Run it when the grimoire changes; not chained into the build because datamancy isn't available in Cloudflare's build env.

## Content structure

Markdown/MDX under `src/content/docs/`:

- `index.mdx` — homepage
- `blog/story/` — the chronological narrative track (`prologue` → `series-006-NNN-*`)
- `blog/primers/` — VSA/HDC technical primers
- `blog/topology.md` — **read first**: how the Book grows (trunk + branches + cliff notes)
- `blog/book.mdx` — lightweight landing for the Book; links to the full text
- `blog/guide.md`, `blog/circuit.md` — the Guide, the Circuits
- `blog/arc-170-cliffnotes.md`, `blog/arc-170-realizations.md` — the first "branch" off the Book trunk

**The Book's full text (~36k lines) lives at `public/blog/book.md`, not in the content collection.** It rendered to 4.2MB of HTML and was a build-memory hog; it's now served as a static markdown file with a small landing page (`blog/book.mdx`) pointing at it. Don't move it back into `src/content/docs/`.

Sidebar is configured in `astro.config.mjs`. The Book section uses `link:` refs (not `slug:`) to avoid Starlight's slug-validation, which was failing on Cloudflare.

## Agent-discovery layer

The site is built to be consumed by AI agents. All of this is intentional:

- **`public/llms.txt`** — the agent map. Curated sections + an auto-generated explicit list of every `.md` companion URL. Advertised via `Link: rel="describedby"` and an HTML `<link>`.
- **Markdown companions** — every `/blog/<slug>/` HTML page has a `/blog/<slug>.md` twin serving the raw source (4–5× cheaper for agents, higher fidelity than HTML extraction).
- **`functions/_middleware.ts`** — Cloudflare Pages middleware: on `Accept: text/markdown` it serves the `.md` companion for `/blog/*` and `llms.txt` for `/`. Same URL, content-negotiated.
- **`public/_headers`** — RFC 8288 `Link` headers, `Content-Signal: search=yes, ai-input=yes, ai-train=yes`, content-types for the `.well-known` files and `.md` companions.
- **`public/.well-known/`** — `api-catalog` (RFC 9727), `oauth-authorization-server` (RFC 8414), `oauth-protected-resource` (RFC 9728), `mcp/server-card.json`, `agent-skills/index.json` (the 16 datamancy wards). Each is an explicit, honest minimal document — empty/`x-no-*` where we genuinely don't have the thing, rather than a 404.
- **`public/webmcp.js`** — registers `navigator.modelContext.provideContext()` tools (markdown alternate, agent map, skills index) for in-browser agents. Feature-detected; no-ops where WebMCP is absent.
- **`public/robots.txt`** — open allow + sitemap + Content Signals.

## Deploy

Cloudflare Pages, git-integrated: push to `main` → Cloudflare builds → deploys. The build output is `dist/`. `functions/` deploys as Pages Functions automatically.

### Deploy gotcha (the expensive lesson)

**The build must run on Node 24.** Under Node 20 in Cloudflare's build container, Astro 5's content layer silently truncated the collection — `getCollection` returned ~22 of 49 entries, only those routes generated, and the build reported `Complete!` with two-thirds of the pages missing (they 404'd in production). It was *not* reproducible locally (Node 20 builds fine with memory headroom; only Cloudflare's tighter container triggered it). Node 24's better GC/memory behavior cleared it.

If pages start 404ing after a deploy:
1. Check the build log for `N page(s) built` — should be 50. If it's ~22, content truncated.
2. The `check-pages` guard should have *failed* that build (refusing to deploy a partial site, keeping the last good deploy live). If it didn't, the guard's source→dist mapping needs updating.
3. Confirm `NODE_VERSION` (dashboard) and `.node-version` (repo) both say 24.

The guard is the durable backstop: a truncated/incomplete build fails rather than shipping a broken site.

## Layout

```
src/content/docs/    content (markdown/mdx) — story, primers, book landing, etc.
public/              static assets — book.md (full), llms.txt, _headers, .well-known/, webmcp.js
functions/           Cloudflare Pages Functions (_middleware.ts — markdown content negotiation)
scripts/             build pipeline (copy-markdown, generate-*, check-*)
astro.config.mjs     Starlight config — sidebar, head injections (Link tags, webmcp script)
.node-version        24 — required; do not lower
```
