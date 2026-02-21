import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://algebraic-intelligence.dev",
  integrations: [
    starlight({
      title: "Algebraic Intelligence",
      description:
        "Holographic memory systems, algebraic encoders, and adaptive network defense.",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/watmin",
        },
      ],
      sidebar: [
        {
          label: "The Story",
          autogenerate: { directory: "blog" },
        },
        {
          label: "The Library",
          items: [
            {
              label: "Python",
              autogenerate: { directory: "projects/holon-python" },
            },
            {
              label: "Rust",
              autogenerate: { directory: "projects/holon-rs" },
            },
            {
              label: "Ruby (planned)",
              autogenerate: { directory: "projects/holon-ruby" },
            },
            {
              label: "Go (planned)",
              autogenerate: { directory: "projects/holon-go" },
            },
            {
              label: "Java (planned)",
              autogenerate: { directory: "projects/holon-java" },
            },
            {
              label: "Clojure (planned)",
              autogenerate: { directory: "projects/holon-clojure" },
            },
          ],
        },
        {
          label: "Demos",
          items: [
            {
              label: "DDoS Lab (eBPF/XDP)",
              autogenerate: { directory: "demos/holon-lab-ddos" },
            },
            {
              label: "Baseline Lab (LLM Traffic)",
              autogenerate: { directory: "demos/holon-lab-baseline" },
            },
          ],
        },
        {
          label: "Guides",
          autogenerate: { directory: "guides" },
        },
      ],
    }),
  ],
});
