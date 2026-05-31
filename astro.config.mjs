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
            {
              label: "The Datamancer",
              collapsed: true,
              items: [
                { slug: "blog/story/series-006-001-the-thought-machine" },
                { slug: "blog/story/series-006-002-the-conviction-curve" },
                { slug: "blog/story/series-006-003-the-enterprise" },
                { slug: "blog/story/series-006-004-the-datamancer" },
                { slug: "blog/story/series-006-005-the-forging" },
                { slug: "blog/story/series-006-006-the-guide" },
                { slug: "blog/story/series-006-007-the-foundation" },
                { slug: "blog/story/series-006-008-xx" },
                { slug: "blog/story/series-006-009-the-detour" },
                { slug: "blog/story/series-006-010-the-descent" },
                { slug: "blog/story/series-006-011-the-recognition" },
                { slug: "blog/story/series-006-012-the-surface" },
                { slug: "blog/story/series-006-013-the-resolve" },
                { slug: "blog/story/series-006-014-the-language" },
                { slug: "blog/story/series-006-015-the-discipline" },
                { slug: "blog/story/series-006-016-the-loop-closes" },
                { slug: "blog/story/series-006-017-the-grimoire" },
                { slug: "blog/story/series-006-018-the-first-intermission" },
                { slug: "blog/story/series-006-019-records-become-types" },
                { slug: "blog/story/series-006-020-the-closures-and-the-coincidence" },
                { slug: "blog/story/series-006-021-cold-boot" },
              ],
            },
            {
              label: "The Static MCP",
              collapsed: true,
              items: [
                { slug: "blog/story/series-007-001-the-hinge" },
                { slug: "blog/story/series-007-002-the-watch-learns" },
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
            { link: "/blog/book/", label: "The Book (trunk)" },
            {
              label: "Branches",
              collapsed: true,
              items: [
                { link: "/blog/arc-170-cliffnotes/", label: "Arc 170 — Cliff Notes" },
                { link: "/blog/arc-170-realizations/", label: "Arc 170 — Full Realizations" },
              ],
            },
            { link: "/blog/guide/", label: "The Guide" },
            { link: "/blog/circuit/", label: "The Circuits" },
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
