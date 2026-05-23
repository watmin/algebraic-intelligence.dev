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
          label: "The Foundation",
          collapsed: true,
          autogenerate: { directory: "blog/primers" },
        },
        {
          label: "The Story",
          collapsed: true,
          autogenerate: { directory: "blog/story" },
        },
        {
          label: "The Book",
          items: [
            { slug: "blog/topology", label: "The Topology" },
            { slug: "blog/book", label: "The Book (trunk)" },
            {
              label: "Branches",
              collapsed: true,
              items: [
                { slug: "blog/arc-170-cliffnotes", label: "Arc 170 — Cliff Notes" },
                { slug: "blog/arc-170-realizations", label: "Arc 170 — Full Realizations" },
              ],
            },
            { slug: "blog/guide" },
            { slug: "blog/circuit" },
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
