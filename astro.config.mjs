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
          label: "Holon Core",
          autogenerate: { directory: "holon-rs" },
        },
        {
          label: "DDoS Lab",
          autogenerate: { directory: "holon-lab-ddos" },
        },
      ],
    }),
  ],
});
