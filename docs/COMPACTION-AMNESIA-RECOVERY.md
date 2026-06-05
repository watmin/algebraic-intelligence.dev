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

**There is no single always-current breadcrumb file here** (unlike wat-rs's
CLIFFNOTES). A website's state-of-world *is* its deployed content. So the
authoritative present is, in order: **the git log → the rendered `src/` content →
the memory system.** Trust those. Everything in `docs/` is a planning / structure
aid that **lags** — useful for the *shape* of the work, never for "is this done."

**The content (the truth — under `src/content/docs/`):**

| Artifact | What it is |
|---|---|
| `index.mdx` | The front door / landing page. |
| `blog/story/{prologue.md, epilogue.mdx, series-NNN-*}` | The chronicle — framing pieces + the lived narrative (series 002→007). |
| `blog/primers/series-001-*` | Technical reference primers (VSA, atoms, ops, memory, wat). |
| `blog/book.mdx` | The book trunk. |
| `blog/{agents,circuit,guide,topology,arc-170-*}.md` | Companion blog pieces. |
| `demos/`, `projects/` | Reference pages (several still placeholder per the tracker — verify against the live page, not the tracker). |
| `astro.config.mjs` | **The sidebar/nav — the source of truth for what is wired & published.** A post not in here is not navigable. |
| `src/content.config.ts` | Content-collection schema. |
| `scripts/check-*.mjs` | The drift gates (run by `npm run build` postbuild — §4). |
| `public/_headers`, `functions/_middleware.ts` | Cloudflare Pages deploy config. |

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
   npm run build      # astro build + postbuild guards:
                      #   check-functions, check-pages, check-nav, check-contributions
   ```
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
3. **Push = deploy.** `git push origin` → Cloudflare Pages builds & serves. There
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

---

*Scattered by the gap, gather yourself from the record — the git log, the live
pages under `src/`, the memory, this map — and only then move. Compaction is a
non-event to a practitioner who keeps the trail and walks it home.*
