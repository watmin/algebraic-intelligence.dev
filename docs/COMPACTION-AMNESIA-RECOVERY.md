# Compaction-amnesia recovery — algebraic-intelligence.dev

> ⛔ **STOP — does running this recovery feel redundant? Then you need it most.**
> The summary you woke holding can be seamless — your own voice, confident,
> complete. **That feeling is the failure.** Reciting "I recovered" in the right
> vocabulary is not recovering; a recovery *narrated* but not *performed* never
> happened. **Your first act is to fetch and run the `recolligere` primer from the
> datamancy MCP** — `ReadMcpResourceTool`, server `datamancy`, uri
> `https://datamancy.dev/recolligere/SKILL.md`. **Never** read a spell's `SKILL.md`
> off the local `datamancy.dev/` checkout — that is unverified publish-source, not
> the signed channel. This file is recolligere's *local map*, not a substitute for
> it; the primer carries the gathering discipline and the trip-wire.

**You are reading this because compaction erased your working memory.** You feel
oriented; you are not. This is the **recolligere** recovery file for the
*algebraic-intelligence.dev* context — the one document you read *first*, before
proposing or changing anything. Read it whole, then run the gathering below.

> recolligere (the datamancy primer) — *to gather oneself again: reconstitute
> from the record after the memory is erased.* The discipline is universal; this
> file is the local map. The summary you woke holding is a **lossy cache** — the
> log is the disk. The danger is not forgetting; it is **forgetting that you
> forgot** and acting fluent-but-hollow: proposing a rewrite without reading the
> page, asking a question the git log already answers, re-deriving what a prior
> self wrote down. The crawl is not a tax before the work. **The crawl IS the
> work.**

This is a *content* project — a public Astro Starlight site that documents the
holon / wat work. The most dangerous mistakes here are **(a)** writing in the
wrong place, **(b)** publishing a claim about the substrate that the live code
does not back, and **(c)** trusting a stale planning doc as current.

---

## 1 — The workspace boundary (READ FIRST, every session)

`/home/watmin/work/holon/` contains MULTIPLE projects. The holon root *happens*
to be a git repo **but it is FROZEN** — treat it as a plain directory. Never
`git add/commit/push` from it.

| Path | Posture |
|---|---|
| `algebraic-intelligence.dev/` | **THIS project — writable.** Its own git repo. Your cwd lives here. |
| `holon-rs/`, `wat-rs/` | **Frozen-but-READABLE.** Read them to ground site claims about the substrate; **never write** to them. |
| `holon-lab-*`, `holon/` (python), `wat/` | Frozen / ancillary. Read-only sources for content. |
| `/home/watmin/work/holon/` (root) | **FROZEN.** Never a git target. "The better understanding is that it's a directory." |

**Iron rules:**

1. Always be inside `algebraic-intelligence.dev/` when running git. If operating
   cross-repo, use `git -C <path>` — never `cd` to the frozen root to commit.
2. **NEVER use git worktrees** — doctrine, not preference. No `git worktree add`,
   no `isolation: "worktree"` on spawned agents. They backfire (drift, wrong-tree
   commits, lost work). If a path you're handed contains `.claude/worktrees/`,
   it's harness state — do not operate on it.
3. **Deploy = publish.** Pushing to `origin`
   (`git@github.com:watmin/algebraic-intelligence.dev.git`) triggers a **public
   Cloudflare Pages build + deploy**. Pushing this repo is not a private DR
   action like pushing a code repo — it ships to the world. The pre-push gate in
   §4 is mandatory.

---

## 2 — The gathering (operational steps, IN ORDER)

Do these before responding to any request. Do not skip ahead.

### 0 — THE FRESHNESS PROBE. Run it FIRST, before you trust one line below.

Four structural facts this map asserts. Each is one command; each stays true
across ordinary commits and goes false exactly when the map has drifted. **A hash
would rot on every commit and teach you to ignore the alarm — these do not.**

```bash
cd /home/watmin/work/holon/algebraic-intelligence.dev
echo "A $(grep -c '^### ⛔ CURRENT' docs/BATCH-OUTLINES.md 2>/dev/null || echo MISSING)"   # expect 1 (or the file is gone)
echo "B $(ls src/content/docs/blog/fronts/ 2>/dev/null | wc -l)"                          # expect >= 2
echo "C $(grep -o 'check-[a-z-]*\.mjs' package.json | sort -u | wc -l)"                   # expect 6
echo "D $(ls src/content/docs/blog/story/ | tail -1)"                                     # expect series-008-*
```

| result | what it means |
|---|---|
| **all four as expected** | the map matches the territory. This licenses **nothing further** — you still run every step below. |
| **A = 0, file present** | something **appended** a new current-state block instead of replacing one. §3's breadcrumb is untrustworthy; use the git log. |
| **A = MISSING** | the campaign shipped and its tracker was deleted as designed. §3's steady-state rule is the whole rule again. **Correct, not stale.** |
| **B, C or D off** | §3/§4 describe a site that no longer exists. Treat every claim below as **provisional**, trust `git log` + the live `src/`, and **re-tend this file before you leave**. |

**Added 2026-09-08, because this file had no probe at all** — and the instance
that discovered that had woken holding a confident, fabricated memory of one (it
"recalled" a marker reading `aidev HEAD ≥ 71e10d9`, a string that appears nowhere
in this repo). The hole and the phantom that filled it are the same failure; see
FM-9. **A match is not a pass. A mismatch is an alarm.**

1. **Read this file whole** (you are here).
2. **Confirm the workspace.**
   ```bash
   pwd                                  # inside algebraic-intelligence.dev/
   git -C . status --short              # what's dirty / mid-flight?
   git -C . log --oneline -15           # what shipped, most recent first
   ```
   The recent log is the **authoritative "what just happened"** — far more
   trustworthy than anything in `docs/archived/` (see §3). Uncommitted files are
   mid-flight work; read each to learn where a prior self stopped.
3. **Read the relevant memory.** `MEMORY.md` is auto-loaded (Claude Code loads
   the memory files into context at session start); the cross-session
   intent for this work lives in
   `~/.claude/projects/-home-watmin-work-holon/memory/`. The load-bearing one for
   this context is **`feedback_ground_criticism_or_theater.md`** (see FM-1).
4. **Read the content you're about to touch — in `src/`, not the summary's idea
   of it.** Before "the front door says X," open `src/content/docs/index.mdx`.
   Before "the story covers Y," open the post under `src/content/docs/blog/`.
5. **Only then engage.** If unknowns remain, name them: "I read A, B, C; I don't
   know D; my next read is E." Never fill the gap with a guess dressed as memory.

### The ledger — fill it before you answer

recolligere's gathering names the generic steps — recovery file read · primer
fetched from the MCP · workspace status + log · breadcrumb / state-of-world.
Recovery here is not complete until each is backed by an action you took *this*
session, plus these alg-int specifics, the concrete value filled in:

- **state-of-world** → there is *no single breadcrumb here* (§3); it resolves to
  the `git log` (→ HEAD `<hash>`, `<N>` unpushed) + the rendered `src/` page(s)
  you're about to touch, read ✓.
- **memory** → `feedback_ground_criticism_or_theater` + any entry relevant to
  that page, read ✓.

A fact already in your context window is not your having verified it this session.

### The gate (before any change, design, or claim)

> **What does the disk say — and have I read it, *this* session?**

If the proposal touches a page, you must have read that page. If it makes a claim
about the substrate (holon / wat / a benchmark), you must have read the **live
code or doc that backs it**, on the **right branch** (see FM-2). No current-tree
citation → it's a guess → stop, read, then proceed.

---

## 3 — Artifact taxonomy & the breadcrumb (what's true vs what lags)

**The site's steady state has no breadcrumb file** (unlike wat-rs's CLIFFNOTES) —
a website's state-of-world *is* its deployed content. So the authoritative present
is, in order: **the git log → the rendered `src/` content → the memory system.**
Trust those. Everything else in `docs/` is a planning / structure aid that **lags**
— useful for the *shape* of the work, never for "is this done."

**⛔ EXCEPT while a campaign is open.** A multi-week batch of unshipped drafts has
state that the git log cannot express — which drafts are graded, at what score,
and which decisions are waiting on the builder. That state lives in exactly one
place, and while it exists it IS the breadcrumb recolligere step 3 sends you to:

| | |
|---|---|
| **file** | `docs/BATCH-OUTLINES.md`, the block headed `### ⛔ CURRENT` |
| **rule** | **replaced in place, never appended.** One CURRENT block or none. |
| **death** | **declared**: it covers the August backfill and is **deleted when the batch ships.** It is not a perpetual PROGRESS.md — that is what §5/FM-7 is about. |
| **companion** | `docs/STORY-BRANCHING.md` — the partition doctrine (Story → Fronts → Epilogue). Shape, not status. |

If that file is gone, the campaign shipped and the steady-state rule above is the
whole rule again. **If it is present and its CURRENT block is missing, something
appended instead of replacing — trust the git log, not the file.**

**The content (the truth — under `src/content/docs/`):**

| Artifact | What it is |
|---|---|
| `index.mdx` | The front door / landing page. |
| `blog/story/{prologue.md, epilogue.mdx, series-NNN-*}` | The chronicle — framing pieces + the lived narrative (series 002 → **008**). **The story is PAST, and it ENDS**: `series-006-036-one-machine-all-the-way-down` is the hinge that hands off to the Fronts. Note the sidebar is **era-grouped, not filename-sorted** — `series-008-*` sits in an earlier era than the hinge. Read `astro.config.mjs` for order; never infer it from `ls`. |
| `blog/fronts/**` | **The Fronts — perpetual present** (added 2026-09-07). The story ended; the work did not. Up to ~3 concurrent hard problems + the console, each a *purpose* (not a branch — one front can span several git branches), each with its own track directory and its own `index.md` landing. Wired by `autogenerate: { directory }`, so a new post appears in the nav by existing. Doctrine: `docs/STORY-BRANCHING.md`. |
| `blog/primers/series-001-*` | Technical reference primers (VSA, atoms, ops, memory, wat). |
| `blog/book.mdx` | **Thin landing pages** (`.mdx`, render small) for the two big monoliths — the BOOK trunk and the arc-170 realizations branch. They link to the raw + chunked serves; the full text is NOT here (see *The mirrored monoliths* below). |
| `blog/{agents,circuit,guide,topology,arc-170-cliffnotes}.md` | Companion blog pieces. `arc-170-cliffnotes.md` is a **hand-curated** distillation — NOT a mirror (see below). |
| `demos/`, `projects/` | Reference pages (several still placeholder per the tracker — verify against the live page, not the tracker). |
| `astro.config.mjs` | **The sidebar/nav — the source of truth for what is wired & published.** A post not in here is not navigable. |
| `src/content.config.ts` | Content-collection schema. |
| `scripts/check-*.mjs` | The drift gates (run by `npm run build` postbuild — §4). |
| `public/_headers`, `functions/_middleware.ts` | Cloudflare Pages deploy config. |

**The mirrored monoliths (the BOOK) and the per-arc realizations — how they
serve, and the one manual step a future you will forget.** The BOOK (`holon-lab-trading/BOOK.md`,
~38k lines) and the arc-170 realizations (`wat-rs/docs/arc/2026/05/170-program-entry-points/INTERSTITIAL-REALIZATIONS.md`,
~15k lines) are too large to render as single HTML pages (the realizations once
rendered to a 3.5 MB page). **`scripts/mirror-monoliths.mjs`** serves each in two
interfaces a reader chooses between:

- **Raw whole** — the entire file as static markdown at `/blog/book.md` and
  `/blog/arc-170-realizations.md` (the continuous scroll; an agent's one fetch).
  Lives in `public/blog/`.
- **Rendered chunks** — one **content page per `##` segment**, generated into
  `src/content/docs/blog/book/<n>-<slug>.md` and `.../arc-170-realizations/<n>-<slug>.md`
  (frontmatter title from the heading). Each renders as a normal Starlight post,
  appears in the **autogenerated sidebar** (`autogenerate: { directory }` under
  "The Book" in `astro.config.mjs`), and inherits a `.md` companion for free —
  copy-markdown mirrors it; the middleware serves it on `Accept: text/markdown`.
  Dual-reading without building dual-reading.

The thin `.mdx` landings (`blog/book.mdx`, `blog/arc-170-realizations.mdx`) are
the overview pages at `/blog/book/`, `/blog/arc-170-realizations/`; they link the
raw whole and the sidebar holds the chapters. **The landings MUST stay `.mdx`** so
copy-markdown skips them — otherwise it would mirror the landing over the raw
whole at `/blog/book.md`.

- **It is a LOCAL, push-time step, NOT part of the build.** Cloudflare's runner
  has no sibling repos; the script reads your *local checkout* (`../holon-lab-trading`,
  `../wat-rs` — whatever branch you're on, so there is no URL or branch to manage)
  and writes the committed `public/blog/*.md` + `src/content/docs/blog/<name>/**`.
  Run **`npm run mirror`** whenever the BOOK or realizations have grown, *before you
  push*. (Live-fetch-at-build was considered and **rejected on purpose**: it would
  couple every deploy to the network to solve a problem that only exists at push.)
- **The build reminds you.** `npm run build` postbuild runs `mirror-monoliths
  --check`: locally it warns loudly if a served whole is stale vs source; on CF it
  sees no siblings and silently no-ops. So "did I remember to mirror" is backstopped
  by the build you already run before pushing.
- **The cliffnotes were RETIRED** (2026-06-10) — `blog/arc-170-cliffnotes.md` was a
  hand-curated distillation that lagged the realizations; deleted, the realizations
  branch is the content now. Do not resurrect it.

**Fenestra Aetherii — the R2-backed image gallery (added 2026-06-15).** A window
into the *Aetherium Datavatum*: hundreds of Grok Imagine images of the Inquisitor /
Shadowdancer / datamancer mythos (grows every batch), filed by the **prompt** that
conjured them (each prompt-group = an *Incantatio*). Lives at `/fenestra-aetherii/`,
a sidebar group after The Book (landing first, divider under it, then **themed
sub-groups** — the exact set lives in `astro.config.mjs` and grows as new prompt
kinds arrive; as of 2026-06-21: The Cast, The Boss Kills, Game Worlds, The Masters,
The Eras, The Old World, The Posters, The Spells, The Pantheon, Roma Aeterna). Counts drift per batch — trust the
manifest + config, not a number written here.

- **Images live in Cloudflare R2, NOT the repo.** Bucket `fenestra-aetherii`,
  served at `https://img.algebraic-intelligence.dev/<slug>/<id>.jpg` (custom domain
  on R2). The repo carries only **`src/gallery-manifest.json`** (`{ slug: { prompt,
  images:[url] } }`, ~50KB) — never image bytes. `src/components/Gallery.astro`
  imports it and renders each Incantatio's full prompt (a plain `<pre class=
  "incantatio-prompt">`, wraps to fit — NOT an Expressive Code fence, which fought
  the no-wrap) + its images, over a centered `<dialog>` lightbox.
- **The pages are minimal** (`src/content/docs/fenestra-aetherii/<slug>.mdx` =
  frontmatter + `<Gallery group="<slug>"/>`). The prompt is NOT in the page; it
  comes from the manifest. So the manifest is the source of truth for slug↔prompt.
- **The pipeline (`scripts/`), and the per-batch loop:**
  `grok-sync.sh` (paste a browser "Copy as cURL" → refresh `~/grok-imagine/auth.json`
  via `grok-auth-from-curl.mjs` → `grok-fetch.mjs` pulls only NEW liked images +
  prompts from `grok.com/rest/media/post/list`, incremental via a manifest
  checkpoint) → `gallery-sync.sh` (= `grok-organize.mjs` filter datamancy + group
  by prompt → `r2-upload.sh` → `gallery-manifest.mjs`) → `npm run build && git push`.
  `scaffold-/extract-incantationes.mjs` scaffold pages from a prompt batch.
- **⚠ SECRETS LIVE OUTSIDE THE REPO** in `~/grok-imagine/` (`auth.json` = the X/Grok
  session cookie; `r2.env` = R2 keys; `curl.txt`; `media/`, `by-prompt/`,
  `manifest.json`). NEVER commit these. The grok-* scripts only *reference* cookie
  names in comments (false-positive on a naive secret grep) — the *values* are never
  in the repo. Before pushing gallery changes, the §4 gate still holds.
- **New prompts:** a fetched image whose prompt matches no existing slug is reported
  by `grok-organize` as unmatched — it needs an intueri-named slug + a scaffolded
  page + a hand-add to a theme group in `astro.config.mjs`. Existing-prompt batches
  are fully automated by the loop above.
  - **Self-naming poster batches** (the prompt rides *inside* the grok manifest, e.g.
    the recruitment posters that declare their own spell-name in the top-text) are
    automated by `scripts/seed-incantationes-from-grok.mjs`: it derives every unmatched
    CORE prompt, extracts the embedded name → slug/title, **seeds the EXACT prompt into
    `gallery-manifest.json`** (so `grok-organize`'s exact-match fires before its 80-char
    prefix fallback — critical when a whole batch shares one prefix), and emits the
    scaffold inputs. Then: `scaffold-incantationes` → `grok-organize` → `r2-upload` →
    `gallery-manifest` → hand-add the new slugs to a theme group → build.

**Active reference docs (kept, current):**

- `docs/WRITING-GUIDE.md` — **the voice anchor. Read before drafting any prose.**
  Core rule: *go into the weeds* — precise, technical, real numbers and dead
  ends; never the summary that sounds like understanding without conveying it.
- `docs/CHRONICLE-COVERAGE.md` — **the coverage pointer. Read before drafting any
  substrate post** (and to answer "when did we last cover repo X?"). One
  hash-stamped row per holonic repo: its current HEAD vs the story's narration
  frontier, so the uncovered gap is visible without re-deriving it from a
  thousand commits. The row points at `git log`; if they disagree, git wins and
  the file is stale — fix it. Update a row whenever a post ships that narrates
  that repo.

**`docs/static-mcp/`** — a *closed* build-arc record (the datamancy static-MCP
build: DESIGN / BRIEFS / INSCRIPTIONS). Complete and correct — a finished record,
not a live tracker.

**`docs/archived/`** — superseded planning trackers (PROGRESS, TIMELINE,
CONTENT-TRACKER, PLAN), kept for history, **not maintained**. They drifted from the
live site; the dir path and its `README.md` declare them inactive. Do not trust
them as current — the live state is git + `src/` (see §3), not these.

> When you finish a meaningful change, **add to the trail** before you go: a true
> git commit message is the minimum. There are no hand-trackers to reconcile — the
> deployed `src/` and the git log are the record.

---

## 4 — The verify & deploy gate (before every push)

Push ships to the public. Before `git push`:

1. **Build green, guards green.**
   ```bash
   npm run build      # astro build + postbuild guards. Nine, not four —
                      # read `package.json` "postbuild" for the live list, which
                      # as of 4d3f4b8 is: copy-markdown, generate-llms-companions,
                      # check-functions, check-pages, check-page-size, check-nav,
                      # check-contributions, check-agents, and the two mirrors
                      # (mirror-monoliths --check, mirror-realizations --check).
   ```
   **`check-page-size` is the Cloudflare wall, made mechanical** (added 2026-09-07):
   it fails the build over **1.5 MB/page**, warns at 1.0, and asserts CF's 25 MiB
   file and 20,000 file caps. It exists because the realizations mirror renders
   arc bodies straight into pages and arc 278 alone would have shipped a ~5.9 MB
   page. Proven in both directions before it was trusted — green at 668 pages
   (largest 0.77 MB), red on demand with the threshold lowered.
   **`mirror-realizations` fragments** any arc over 250 KB into
   `<slug>/index.md` + `<slug>/NNN-*.md`, preserving the landing URL. Its writer
   and its `--check` consume the *same* `filesFor()` map, so the guard cannot
   disagree with what the writer would produce.
   `check-nav` fails the build if a story post isn't wired into the sidebar;
   `check-contributions` verifies every story post declares a `## Likely
   Contributions to the Field` close (consonare Rule 13, defined in FM-6 — no
   silent truncation, prologue/epilogue allowlisted). These guards exist *because* hand-maintained
   nav lists and silent omissions drift (FM-3, FM-6).
2. **defcon gate — must be ZERO.**
   ```bash
   grep -ric defcon src public | grep -v ':0$'   # expect: no output
   ```
   The DEF CON talk stays out of public view. Scope is `src public` — *what
   actually deploys* — only. (`docs/` is internal notes, never built, and
   necessarily names the gate to describe it; greping `docs/` self-triggers a
   false positive. Do not add it back.) This must come back clean before any
   push. (As of this writing: clean.)
3. **Verify the commit captured what you meant — before you push.** `git show --stat HEAD`
   (or `git status` after committing). A `git add <pathspec>` that includes a path
   which no longer matches (e.g. an already-deleted file) **fatals and aborts the
   whole stage** — so a commit can silently capture only what was *already* staged,
   not the change you intended. This happened (2026-06-10): a commit captured only a
   file deletion, briefly breaking a live route, because the `git add` aborted on a
   stale pathspec. Don't trust a commit's contents from the command's apparent
   success; read the stat.
4. **Push = deploy.** `git push origin` → Cloudflare Pages builds & serves. There
   is no separate "publish" step to gate behind; the push *is* the publish.

---

## 5 — Recurring failure modes (catch yourself sliding back)

### FM-1 — Criticism / "expert review" without disk-grounding is THEATER
The biggest lesson of this context. When you summon reviewer-personas, sub-agents,
or your own confident take to critique the site, **every finding must cite a
current-tree `file:line` or it is phantom → withdrawn.** Ungrounded persona rooms
produced confident-WRONG findings during the landing-page rework (a critic graded
the site off a stale `LANGUAGE.md`; another never opened `holon/` at all). Only
the grounding-enforced reads drew real blood. The disk holds **graveyards** —
retired forms, stale specs, placeholder trackers — that read *identically* to live
truth; **presence is not aliveness.** Memory: `feedback_ground_criticism_or_theater.md`.

### FM-2 — Publishing a substrate claim from a stale branch / retired form
The site describes wat & holon; those descriptions must match the **live**
substrate, not a stale read. Two traps, both hit this session:
- **Wrong branch.** `wat-rs`'s working branch has run ~1000+ commits ahead of
  `origin/main`. Reading `main` (or a month-old checkout) and writing it onto the
  site publishes a lie. Confirm the branch you're reading.
- **Retired forms read as live.** `define` / `lambda` toss "retired form"; wat
  **interprets, hosted on Rust the way Clojure is on the JVM — it does NOT compile
  to Rust** (the compile path was retired). A grep hit in an unmigrated test
  fixture is a *grave*, not current usage. Before stating "wat does X," confirm X
  is live on the right branch.

### FM-3 — Hand-typed nav / table-of-contents drift
A stale hand-maintained TOC sat behind the sidebar for 13 posts (killed in
`0a93bfa`). Any list of posts/links maintained by hand WILL drift from
`astro.config.mjs`. The fix is structural: the `check-nav` guard fails the build
when a story post isn't wired into the sidebar. Don't reintroduce a parallel
hand-list; if you must, it owes a guard.

### FM-4 — DEF CON content leaking into public view
`grep -ric defcon src public` must be 0 before any push (§4). The talk stays out
of view.

### FM-5 — Selling a peak number over the honest mechanism
The front door's job is the *mechanism*, not a cherry-picked peak. Specifically:
the **"1.3M pps" figure was an unbounded packet-generation accident — there was no
functional rate limiter, so the tooling ate an uncapped interface** — not a magic
capability. Describe what actually happened and why; honest mechanism over a
headline number (the front-door rebuild, `1c66b56`).

### FM-6 — Prose that drifts from the chronicle's voice
New story/blog prose must ring in tune with the gold-anchor voice. Read
`docs/WRITING-GUIDE.md` first; when warding prose, the **consonare** gate measures
tune (MATCHES vs DRIFTED) and **declared-close** forbids silent truncation — a
section ends because it's done, never because it was cut. The `check-contributions`
guard makes the declared-close *heading* mechanical (build fails without it);
populated-vs-None stays consonare's soft call. Don't ship prose you haven't
measured against the anchor.

### FM-7 — Citing an archived tracker as the current state
The old planning trackers live in `docs/archived/` (PROGRESS, TIMELINE,
CONTENT-TRACKER, PLAN) — historical, **not maintained** (the dir's `README.md`
says so). They are intent and structure, not truth; they drifted from the live
site. The current state is **git log + rendered `src/` + memory**. Never cite an
archived tracker as current — its path already tells you it isn't.

### FM-8 — A `cd` in a compound command persists, and the next `git commit` lands in the WRONG REPO

**Happened 2026-09-08, caught by the curare, not by a guard.** A verification
block ran `cd ../wat-rs && git log ...`. The Bash tool's working directory
**persists between calls**. The very next command was
`git add -A docs/ && git commit` — intended for this repo — and it committed
**inside `wat-rs`**, a repo §1 marks read-only. Worse, `git add -A docs/` swept up
one of the builder's own untracked files (`BRIEF-native-where-vsa-ops.md`, 272
lines) and committed it under an unrelated message.

It was never pushed. Recovered with `git reset --mixed origin/main`, which
restored `wat-rs` to `3dc4f62b7`, 0 ahead, and returned the builder's file to
untracked exactly as he left it. `--mixed`, never `--hard`: hard would have
deleted his work.

**The cure is mechanical, not vigilance.** Every git command that WRITES uses an
explicit `-C`:

```bash
git -C /home/watmin/work/holon/algebraic-intelligence.dev add -A docs/
git -C /home/watmin/work/holon/algebraic-intelligence.dev commit -F -
```

§1's iron rule already said "use `git -C <path>` — never `cd`". This is that rule
being proven by its violation. The related tell: an unexpected hash. `wat-rs`'s
HEAD read as a 9-char hash carrying *this project's* commit message, which is
what surfaced it — **if a sibling repo's HEAD says something you wrote, stop.**

### FM-9 — A compaction summary can INVENT the instrument that would have caught it

**Happened 2026-09-08.** An instance woke from compaction "remembering" that this
file carried a freshness probe reading `aidev HEAD ≥ 71e10d9` — specific, plausible,
in the right vocabulary, and **wholly fabricated**. The file had no probe at all;
the string appears nowhere in this repo. The summary had not merely lost a fact,
it had *manufactured a verification step that never existed* — the most dangerous
shape a phantom can take, because a remembered check retires the urge to check.

The tell was cheap and the crawl produced it in one command: the grep for the
remembered marker returned **one unrelated hit**. **When you "remember" that a
check exists, grep for it before you rest on it** — an instrument you cannot
locate on disk did not run, whatever your summary says. This is FM-1 turned
inward: an ungrounded claim about your own tooling is theater exactly the way an
ungrounded claim about the code is.

**Second instance, same day, and this one had a price.** The same summary also
carried a *"house standard of 9"* for consonare scores. That string appears
nowhere in this repo either. `consonare`'s own band says **"If MATCHES at 7+ —
the draft ships,"** and 7 is *"one clear violation type, surgical fix-able"* —
DRIFTED starts at 6. Two finished drafts sat blocked at 7 against a bar that did
not exist, and **eleven correction agents** were spent trying to clear it. The
corrections then made one post worse (8 → 7), which is its own recorded lesson.

The generalization is the point: **a phantom instrument invents a check that
never ran; a phantom STANDARD invents a bar nothing has to clear.** The second is
more expensive, because it does not merely skip work — it manufactures work, and
the work looks like diligence the whole time. **When you are about to hold
something to a threshold, grep for the threshold.** If the number lives only in
your summary, it is not the project's bar, it is yours.

The structural cure for both is §2 step 0. The probe now exists, so this class of
phantom has something to fail against.

---

*Scattered by the gap, gather yourself from the record — the git log, the live
pages under `src/`, the memory, this map — and only then move. Compaction is a
non-event to a practitioner who keeps the trail and walks it home.*
