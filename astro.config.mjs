import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import rehypeExternalLinks from "rehype-external-links";
import mermaid from "astro-mermaid";

export default defineConfig({
  site: "https://algebraic-intelligence.dev",
  markdown: {
    rehypePlugins: [
      [rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }],
    ],
  },
  integrations: [
    mermaid(),
    starlight({
      favicon: "/favicon.jpg",
      title: "Algebraic Intelligence",
      description:
        "Holographic memory systems, algebraic encoders, and adaptive network defense.",
      customCss: ["./src/styles/custom.css"],
      head: [
        // RFC 8288 Link relations for agent discovery (HTML equivalent of the HTTP Link headers in public/_headers)
        {
          tag: "link",
          attrs: {
            rel: "describedby",
            type: "text/markdown",
            href: "/llms.txt",
            title: "Agent map (llms.txt)",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "sitemap",
            type: "application/xml",
            href: "/sitemap-index.xml",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "help",
            href: "/blog/topology/",
            title: "How to read this site",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "author",
            href: "https://github.com/watmin",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "api-catalog",
            type: "application/linkset+json",
            href: "/.well-known/api-catalog",
            title: "API catalog (RFC 9727)",
          },
        },
        // WebMCP registration — exposes tools to in-browser AI agents via
        // navigator.modelContext.provideContext(). Feature-detects the API
        // so the script no-ops cleanly when the browser doesn't have it.
        {
          tag: "script",
          attrs: {
            src: "/webmcp.js",
            defer: true,
          },
        },
      ],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/watmin",
        },
      ],
      sidebar: [
        {
          label: "For Agents",
          items: [{ link: "/blog/agents/", label: "How to interface with this site" }],
        },
        {
          label: "The Foundation",
          collapsed: true,
          autogenerate: { directory: "blog/primers" },
        },
        {
          label: "The Story",
          collapsed: true,
          // Grouped by series into collapsible sub-containers so the bar stays
          // short (series-006 alone is 21 entries). Files stay flat in
          // blog/story/ — slugs unchanged — so the _headers globs and markdown
          // companions keep working; `slug:` items take their label from each
          // post's own title. New post → add its slug to the right series group.
          items: [
            { slug: "blog/story/prologue" },
            {
              label: "Python: The Foundation",
              collapsed: true,
              items: [
                { slug: "blog/story/series-002-001-first-experiments" },
                { slug: "blog/story/series-002-002-the-np-wall" },
                { slug: "blog/story/series-002-003-scale-and-detection" },
              ],
            },
            {
              label: "The Rust Port",
              collapsed: true,
              items: [
                { slug: "blog/story/series-003-001-the-rust-port" },
                { slug: "blog/story/series-003-002-the-labs" },
                { slug: "blog/story/series-003-003-1-3m-pps" },
                { slug: "blog/story/series-003-004-the-rule-engine" },
                { slug: "blog/story/series-003-005-engrams" },
              ],
            },
            {
              label: "The L7 Lab",
              collapsed: true,
              items: [
                { slug: "blog/story/series-004-001-the-l7-lab" },
                { slug: "blog/story/series-004-002-the-expression-tree" },
              ],
            },
            {
              label: "The Spectral Firewall",
              collapsed: true,
              items: [
                { slug: "blog/story/series-005-001-the-spectral-firewall" },
                { slug: "blog/story/series-005-002-self-calibrating" },
                { slug: "blog/story/series-005-003-the-residual-profile" },
              ],
            },
            // series-006 was one flat "The Datamancer" group — a name that lied
            // over 21 posts spanning the trading lab → the birth of wat → the
            // BOOK → the grimoire. intueri (cast on the grouping) split it into
            // seven honest groups, each named for the era it actually holds.
            {
              label: "The Trading Lab",
              collapsed: true,
              items: [
                { slug: "blog/story/series-006-001-the-thought-machine" },
                { slug: "blog/story/series-006-002-the-conviction-curve" },
                { slug: "blog/story/series-006-003-the-enterprise" },
              ],
            },
            {
              label: "The Datamancer",
              collapsed: true,
              items: [
                { slug: "blog/story/series-006-004-the-datamancer" },
                { slug: "blog/story/series-006-005-the-forging" },
                { slug: "blog/story/series-006-006-the-guide" },
                { slug: "blog/story/series-006-007-the-foundation" },
              ],
            },
            {
              label: "The Birth of wat",
              collapsed: true,
              items: [
                { slug: "blog/story/series-006-008-xx" },
                { slug: "blog/story/series-006-009-the-detour" },
                { slug: "blog/story/series-006-010-the-descent" },
              ],
            },
            {
              label: "The Book and the Recognition",
              collapsed: true,
              items: [
                { slug: "blog/story/series-006-011-the-recognition" },
                { slug: "blog/story/series-006-012-the-surface" },
                { slug: "blog/story/series-006-013-the-resolve" },
              ],
            },
            {
              label: "The Language Matures",
              collapsed: true,
              items: [
                { slug: "blog/story/series-006-014-the-language" },
                { slug: "blog/story/series-006-015-the-discipline" },
                { slug: "blog/story/series-006-016-the-loop-closes" },
              ],
            },
            {
              label: "The Grimoire",
              collapsed: true,
              items: [
                { slug: "blog/story/series-006-017-the-grimoire" },
                { slug: "blog/story/series-006-018-the-first-intermission" },
              ],
            },
            {
              label: "Records Become Types",
              collapsed: true,
              items: [
                { slug: "blog/story/series-006-019-records-become-types" },
                { slug: "blog/story/series-006-020-the-closures-and-the-coincidence" },
                { slug: "blog/story/series-006-021-cold-boot" },
              ],
            },
            // intueri (cast on the grouping, 2026-05-31) named this era for the
            // one move shared by all three arcs — the substrate stops trusting
            // convention and makes its discipline structural: one definer (241),
            // shape-declares-role machine-checked (242), bad states uncompilable
            // and modules warded (243). Not "The Retirement"/"The Warding" — those
            // name a single arc; this names the domain all three hold.
            {
              label: "The Substrate Hardens",
              collapsed: true,
              items: [
                { slug: "blog/story/series-006-022-the-great-retirement" },
                { slug: "blog/story/series-006-023-the-naming-law" },
                { slug: "blog/story/series-006-024-the-warding" },
              ],
            },
            // intueri (re-cast 2026-06-01) renamed this from "The Static MCP" —
            // that named only the first post (The Hinge). The strand's shared
            // domain is signed, recorded content as the carrier of work past the
            // moment of its making: signed (Hinge + Watch Learns) + record
            // (Watch Learns + The Record). PERSEVERARE made into infrastructure.
            {
              label: "The Signed Record",
              collapsed: true,
              items: [
                { slug: "blog/story/series-007-001-the-hinge" },
                { slug: "blog/story/series-007-002-the-watch-learns" },
                { slug: "blog/story/series-007-003-the-record" },
                { slug: "blog/story/series-007-004-the-grain" },
                { slug: "blog/story/series-007-005-the-grain-goes-all-the-way-down" },
                { slug: "blog/story/series-007-006-come-join-me-at-the-top" },
                { slug: "blog/story/series-007-007-impressive-to-be-us" },
              ],
            },
            // The era after The Signed Record: the grimoire stops being a catalog
            // members browse and becomes a command channel that installs the
            // practice on connect, signed end to end — the anti-botnet recognition.
            // intueri (cast on the domain, 2026-06-04) named the era for the
            // architecture the defender severed and the builder lit; the song
            // ("Hive Mind") is the enemy's anthem the opening post reclaims.
            {
              label: "The Command Channel",
              collapsed: true,
              items: [
                { slug: "blog/story/series-008-001-we-are-hive-mind" },
                { slug: "blog/story/series-008-002-vigil" },
                { slug: "blog/story/series-008-003-extirpare" },
              ],
            },
            // intueri (cast on the six arcs, 2026-06-05) named this era for the
            // one move all six share: the substrate being made to keep declared
            // properties it had written but not enforced — nil's symmetry (244),
            // a bar with teeth (245), a stamp with a guard behind it (246),
            // dialect honesty (247+248), macro purity by enforcement (249).
            // Every name is a promise; this era is the promises being kept.
            {
              label: "The Shape Keeps Its Promise",
              collapsed: true,
              items: [
                { slug: "blog/story/series-006-025-one-way-to-write-nil" },
                { slug: "blog/story/series-006-026-the-bar-that-had-to-mean-it" },
                { slug: "blog/story/series-006-027-what-warded-actually-costs" },
                { slug: "blog/story/series-006-028-the-dialect-reckoning" },
                { slug: "blog/story/series-006-029-macros-are-programs" },
                // intueri (cast 2026-06-06): the era's coda — arc 245's second
                // close pays the debt 026 named; one arc told in two sessions
                // stays in one group. "What the Bar Missed" names the perimeter
                // blind spot, not the bar's height.
                { slug: "blog/story/series-006-030-what-the-bar-missed" },
              ],
            },
            // The era after The Shape Keeps Its Promise: with the migration's
            // foundation laid, new power is RECOGNIZED as already present in the
            // coherent substrate, not bolted on — and each landing rediscovers a
            // textbook idea from first principles. The toolchain turns on its own
            // source, the strange loop closed at birth (arcs 275→284); rendezvous
            // was already a capability once the forgeable name is annihilated —
            // object-capability security, Dennis & Van Horn 1966 (arc 272);
            // keyword args were already a record defn mints (arc 260). "Coherence
            // is the engine; richness is the dividend" — the one move all three
            // share, named in the kwargs post. (One era over three posts, not
            // three single-post eras — the chronicle groups; it does not go 1:1.)
            {
              label: "Coherence Is the Engine",
              collapsed: true,
              items: [
                { slug: "blog/story/series-006-031-the-tools-that-fix-themselves" },
                { slug: "blog/story/series-006-032-rendezvous-is-a-capability" },
                { slug: "blog/story/series-006-033-the-arguments-were-a-record" },
              ],
            },
            { slug: "blog/story/epilogue" },
          ],
        },
        {
          // Using `link:` (URL) instead of `slug:` (content-collection lookup)
          // because Starlight's slug validation has been failing on Cloudflare's
          // build env for blog/book — the 36k-line BOOK trunk seems to hit some
          // content-sync edge case there that doesn't repro locally. `link:`
          // skips that validation; the pages still get built (they have for
          // every prior deploy), the URLs just don't go through slug lookup.
          label: "The Book",
          items: [
            { link: "/blog/topology/", label: "The Topology" },
            // The BOOK trunk: a thin landing (/blog/book/, links the raw whole +
            // explains the two interfaces) over an autogenerated chapter list. The
            // per-chapter pages are CONTENT pages generated by mirror-monoliths
            // from holon-lab-trading/BOOK.md (one per ## segment) — they render
            // natively, sit in this sidebar, and carry .md companions. The 38k-line
            // whole still serves raw at /blog/book.md (too big to render as one page).
            { link: "/blog/book/", label: "The Book — overview" },
            { label: "The Book — chapters", collapsed: true, autogenerate: { directory: "blog/book" } },
            // The arc-170 realizations branch: same shape (overview landing + the
            // log split into per-entry content pages). This is the actual content;
            // the old hand-curated cliff notes were retired (stale, redundant).
            {
              label: "Arc 170 — Realizations",
              collapsed: true,
              items: [
                { link: "/blog/arc-170-realizations/", label: "Overview" },
                { label: "By entry", collapsed: true, autogenerate: { directory: "blog/arc-170-realizations" } },
              ],
            },
            { link: "/blog/guide/", label: "The Guide (legacy)" },
            { link: "/blog/circuit/", label: "The Circuits (legacy)" },
          ],
        },
        {
          // Fenestra Aetherii — after The Book, before Implementations. Landing
          // first (a divider in custom.css sits under it), then the Incantationes
          // grouped by theme: the Cast (the figures), the Boss Kills (victory
          // scenes), and the art-styles split by their shared move — Game Worlds
          // (named game IPs), the Masters (named artists/properties), the Eras
          // (decade aesthetics), the Old World (classical/antique), the Posters.
          // `slug:` items take their label from each page's title. A new Incantatio
          // is hand-added to a theme here (see the recovery doc §3 "Fenestra Aetherii").
          label: "Fenestra Aetherii",
          collapsed: true,
          items: [
            { link: "/fenestra-aetherii/", label: "Fenestra Aetherii" },
            {
              label: "The Cast",
              collapsed: true,
              items: [
                { slug: "fenestra-aetherii/iconic-pair" },
                { slug: "fenestra-aetherii/dungeon-crawl-action" },
                { slug: "fenestra-aetherii/inquisitor-solo" },
                { slug: "fenestra-aetherii/inquisitor-portrait" },
                { slug: "fenestra-aetherii/back-to-back-duo" },
                { slug: "fenestra-aetherii/the-college" },
                { slug: "fenestra-aetherii/directing-rust-runes" },
                { slug: "fenestra-aetherii/directing-faint-runes" },
              ],
            },
            {
              label: "The Boss Kills",
              collapsed: true,
              items: [
                { slug: "fenestra-aetherii/dragon-boss-kill" },
                { slug: "fenestra-aetherii/shadowdancer-strike" },
                { slug: "fenestra-aetherii/boss-kill" },
                { slug: "fenestra-aetherii/boss-kill-isometric" },
                { slug: "fenestra-aetherii/boss-kill-coherent-dungeon" },
                { slug: "fenestra-aetherii/boss-kill-logical-level" },
              ],
            },
            {
              label: "Game Worlds",
              collapsed: true,
              items: [
                { slug: "fenestra-aetherii/baldurs-gate-3" },
                { slug: "fenestra-aetherii/world-of-warcraft" },
                { slug: "fenestra-aetherii/pillars-of-eternity" },
                { slug: "fenestra-aetherii/pillars-boss-kill" },
                { slug: "fenestra-aetherii/tyranny" },
                { slug: "fenestra-aetherii/necropolis" },
                { slug: "fenestra-aetherii/dark-souls-berserk" },
                { slug: "fenestra-aetherii/cyberpunk-2077" },
                { slug: "fenestra-aetherii/magic-the-gathering" },
                { slug: "fenestra-aetherii/everquest" },
                { slug: "fenestra-aetherii/diablo" },
                { slug: "fenestra-aetherii/warhammer-40k" },
              ],
            },
            {
              label: "The Masters",
              collapsed: true,
              items: [
                { slug: "fenestra-aetherii/frazetta-heavy-metal" },
                { slug: "fenestra-aetherii/greg-rutkowski" },
                { slug: "fenestra-aetherii/mignola-hellboy" },
                { slug: "fenestra-aetherii/mucha-cyberpunk" },
                { slug: "fenestra-aetherii/samurai-jack" },
                { slug: "fenestra-aetherii/batman-beyond" },
                { slug: "fenestra-aetherii/conan-frazetta" },
                { slug: "fenestra-aetherii/heavy-metal-1981" },
                { slug: "fenestra-aetherii/mcu-blockbuster" },
              ],
            },
            {
              label: "The Eras",
              collapsed: true,
              items: [
                { slug: "fenestra-aetherii/sin-city-noir" },
                { slug: "fenestra-aetherii/the-fifties" },
                { slug: "fenestra-aetherii/the-sixties" },
                { slug: "fenestra-aetherii/the-seventies" },
              ],
            },
            {
              label: "The Old World",
              collapsed: true,
              items: [
                { slug: "fenestra-aetherii/stained-glass" },
                { slug: "fenestra-aetherii/roman-forum" },
                { slug: "fenestra-aetherii/hellenic-marble" },
              ],
            },
            {
              label: "The Posters",
              collapsed: true,
              items: [
                { slug: "fenestra-aetherii/propaganda-poster" },
                { slug: "fenestra-aetherii/soviet-constructivist" },
                { slug: "fenestra-aetherii/recruitment-factory" },
                { slug: "fenestra-aetherii/recruitment-matrix" },
                { slug: "fenestra-aetherii/recruitment-examinare" },
                { slug: "fenestra-aetherii/industrial-poster-ii" },
                { slug: "fenestra-aetherii/examinare-vigilia-factory" },
                { slug: "fenestra-aetherii/examinare-vigilia-dungeon" },
                { slug: "fenestra-aetherii/extirpare-hooded" },
              ],
            },
            {
              // The grimoire's own spells as recruitment propaganda — each poster
              // names itself in its top-text (EXIGERE, COMPLECTENS, …). Ordered
              // favorites-first (by image count). Seeded by
              // scripts/seed-incantationes-from-grok.mjs.
              label: "The Spells",
              collapsed: true,
              items: [
                { slug: "fenestra-aetherii/exigere" },
                { slug: "fenestra-aetherii/complectens" },
                { slug: "fenestra-aetherii/the-living-grimoire" },
                { slug: "fenestra-aetherii/nesciens" },
                { slug: "fenestra-aetherii/sequi" },
                { slug: "fenestra-aetherii/conformare" },
                { slug: "fenestra-aetherii/cernere" },
                { slug: "fenestra-aetherii/excusare" },
                { slug: "fenestra-aetherii/struere" },
                { slug: "fenestra-aetherii/intueri" },
                { slug: "fenestra-aetherii/temperare" },
                { slug: "fenestra-aetherii/conferre" },
                { slug: "fenestra-aetherii/perspicere" },
                { slug: "fenestra-aetherii/purgare" },
                { slug: "fenestra-aetherii/secare" },
                { slug: "fenestra-aetherii/vigilia" },
                { slug: "fenestra-aetherii/circumspicere" },
                { slug: "fenestra-aetherii/probare" },
                { slug: "fenestra-aetherii/mora" },
                { slug: "fenestra-aetherii/recolligere" },
                { slug: "fenestra-aetherii/examinare" },
                { slug: "fenestra-aetherii/solvere" },
                { slug: "fenestra-aetherii/recolligere-ii" },
                { slug: "fenestra-aetherii/cernere-ii" },
                { slug: "fenestra-aetherii/curare" },
                { slug: "fenestra-aetherii/solvere-ii" },
              ],
            },
            {
              // The same craft as The Spells, rendered as a classical Greek
              // divine college — the Aetherium Datavatum as temple-academy, the
              // Inquisitor & Shadowdancer as divine figures of a younger order.
              // Most self-name in their poster top-text (RECOLLIGERE, INTUERI,
              // THE GRIMOIRE …); the themeless scenes are hand-named. Slugs are
              // `pantheon-*` so they don't collide with The Spells. Order =
              // image-count desc; seeded by scripts/seed-pantheon-batch.mjs.
              label: "The Pantheon",
              collapsed: true,
              items: [
                { slug: "fenestra-aetherii/pantheon-recolligere" },
                { slug: "fenestra-aetherii/pantheon-the-college" },
                { slug: "fenestra-aetherii/pantheon-curare" },
                { slug: "fenestra-aetherii/pantheon-examinare" },
                { slug: "fenestra-aetherii/pantheon-circumspicere" },
                { slug: "fenestra-aetherii/pantheon-the-grimoire" },
                { slug: "fenestra-aetherii/pantheon-vocare" },
                { slug: "fenestra-aetherii/pantheon-extirpare" },
                { slug: "fenestra-aetherii/pantheon-cernere" },
                { slug: "fenestra-aetherii/pantheon-complectens" },
                { slug: "fenestra-aetherii/pantheon-intueri-oracle" },
                { slug: "fenestra-aetherii/pantheon-temperare-scene" },
                { slug: "fenestra-aetherii/pantheon-solvere" },
                { slug: "fenestra-aetherii/pantheon-sequi" },
                { slug: "fenestra-aetherii/pantheon-purgare-scene" },
                { slug: "fenestra-aetherii/pantheon-conformare-forge" },
                { slug: "fenestra-aetherii/pantheon-solvere-unbinding" },
                { slug: "fenestra-aetherii/pantheon-sequi-flow" },
                { slug: "fenestra-aetherii/pantheon-recolligere-archive" },
                { slug: "fenestra-aetherii/pantheon-vigilia" },
                { slug: "fenestra-aetherii/pantheon-mora" },
                { slug: "fenestra-aetherii/pantheon-struere" },
                { slug: "fenestra-aetherii/pantheon-secare" },
                { slug: "fenestra-aetherii/pantheon-conformare" },
                { slug: "fenestra-aetherii/pantheon-struere-scene" },
                { slug: "fenestra-aetherii/pantheon-secare-cut" },
                { slug: "fenestra-aetherii/pantheon-nesciens" },
                { slug: "fenestra-aetherii/pantheon-temperare" },
                { slug: "fenestra-aetherii/pantheon-purgare" },
                { slug: "fenestra-aetherii/pantheon-intueri" },
                { slug: "fenestra-aetherii/pantheon-examinare-boss" },
                { slug: "fenestra-aetherii/pantheon-perspicere" },
                { slug: "fenestra-aetherii/pantheon-extirpare-roots" },
                { slug: "fenestra-aetherii/pantheon-curare-chronicle" },
                { slug: "fenestra-aetherii/pantheon-grimoire-altar" },
              ],
            },
          ],
        },
        {
          label: "Implementations",
          collapsed: true,
          items: [
            {
              label: "Rust (holon-rs)",
              collapsed: true,
              autogenerate: { directory: "projects/holon-rs" },
            },
            {
              label: "Python (reference)",
              collapsed: true,
              autogenerate: { directory: "projects/holon-python" },
            },
          ],
        },
        {
          label: "Labs",
          collapsed: true,
          items: [
            {
              label: "DDoS Lab (eBPF/XDP)",
              collapsed: true,
              autogenerate: { directory: "demos/holon-lab-ddos" },
            },
            {
              label: "Baseline Lab (LLM Traffic)",
              collapsed: true,
              autogenerate: { directory: "demos/holon-lab-baseline" },
            },
          ],
        },
      ],
    }),
  ],
});
