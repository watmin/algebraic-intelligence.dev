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
          label: "Overview",
          items: [{ label: "Introduction", slug: "" }],
        },
        {
          label: "Projects",
          items: [
            {
              label: "Holon Core (Rust)",
              autogenerate: { directory: "projects/holon-rs" },
            },
            {
              label: "DDoS Lab (eBPF/XDP)",
              autogenerate: { directory: "projects/holon-lab-ddos" },
            },
          ],
        },
        {
          label: "Guides",
          autogenerate: { directory: "guides" },
        },
        {
          label: "Demos",
          autogenerate: { directory: "demos" },
        },
        {
          label: "Blog",
          autogenerate: { directory: "blog" },
        },
      ],
    }),
  ],
});
