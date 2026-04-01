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
            { slug: "blog/book" },
          ],
        },
        {
          label: "Guides",
          collapsed: true,
          autogenerate: { directory: "guides" },
        },
        {
          label: "Implementations",
          collapsed: true,
          items: [
            {
              label: "Python (reference)",
              collapsed: true,
              autogenerate: { directory: "projects/holon-python" },
            },
            {
              label: "Rust",
              collapsed: true,
              autogenerate: { directory: "projects/holon-rs" },
            },
            {
              label: "Clojure",
              collapsed: true,
              autogenerate: { directory: "projects/holon-clojure" },
            },
            {
              label: "Ruby",
              collapsed: true,
              autogenerate: { directory: "projects/holon-ruby" },
            },
            {
              label: "Go",
              collapsed: true,
              autogenerate: { directory: "projects/holon-go" },
            },
            {
              label: "Java",
              collapsed: true,
              autogenerate: { directory: "projects/holon-java" },
            },
          ],
        },
        {
          label: "Demos",
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
