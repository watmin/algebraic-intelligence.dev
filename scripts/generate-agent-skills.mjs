// Build public/.well-known/agent-skills/index.json from alg-int's OWN skills.
//
// This site (the chronicle) hosts its own skills and certifies them itself.
// Each entry's `sha256` covers a SKILL.md THIS site controls — so the digest is
// self-consistent and never drifts when an external library changes. The first
// (and currently only) skill is `datamancy-grimoire`: a pointer that references
// the datamancy grimoire BY URL, never by a pinned datamancy digest. datamancy's
// own content is proven against datamancy's own KMS-signed manifest; this site
// never chases datamancy's hash, so there is no cross-domain touch point.
//
// Adding a native skill: drop a SKILL.md under public/skills/<name>/ and add an
// entry to SKILLS below. No network, no sibling-repo dependency — runs anywhere,
// including the Cloudflare Pages build. Chained into `npm run build` so astro
// copies the fresh index into dist/.

import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const SITE = "https://algebraic-intelligence.dev";
const OUTPUT = "public/.well-known/agent-skills/index.json";

// alg-int's own skills. `file` is hashed; `path` is where this site serves it.
const SKILLS = [
  {
    name: "datamancy-grimoire",
    type: "grimoire-index",
    description:
      "Pointer to the datamancy grimoire — the authoritative, KMS-signed library of Latin-named code-review wards. Reach the live catalog at datamancy.dev, verify each ward against the signed manifest, and cast it by value into a subagent. This chronicle does not mirror the catalog; it points at it.",
    file: "public/skills/datamancy-grimoire/SKILL.md",
    path: "/skills/datamancy-grimoire/SKILL.md",
  },
];

const POINTERS = {
  "agent-map": `${SITE}/llms.txt`,
  topology: `${SITE}/blog/topology/`,
  "mcp-card": `${SITE}/.well-known/mcp/server-card.json`,
  "api-catalog": `${SITE}/.well-known/api-catalog`,
  "oauth-authorization-server": `${SITE}/.well-known/oauth-authorization-server`,
  "oauth-protected-resource": `${SITE}/.well-known/oauth-protected-resource`,
};

async function main() {
  const skills = [];
  for (const s of SKILLS) {
    const bytes = await readFile(s.file); // hashes OUR file — self-consistent, drift-free
    skills.push({
      name: s.name,
      type: s.type,
      description: s.description,
      url: SITE + s.path,
      sha256: createHash("sha256").update(bytes).digest("hex"),
    });
  }

  const index = {
    $schema: "https://agentskills.io/schema/v0.2.0.json",
    skills,
    "x-authoritative-grimoire": "https://datamancy.dev/.well-known/agent-skills/index.json",
    "x-grimoire-manifest": "https://datamancy.dev/.well-known/mcp/manifest.json",
    "x-grimoire-manifest-signature": "https://datamancy.dev/.well-known/mcp/manifest.json.sig",
    "x-note":
      "algebraic-intelligence.dev is the chronicle, not the grimoire. These are this site's own skills, each with a sha256 over a SKILL.md this site hosts (self-certifying, drift-free). The `datamancy-grimoire` skill is a pointer that references the datamancy grimoire by URL — this site never mirrors datamancy's catalog nor pins datamancy's digest. The wards' authoritative, always-current, KMS-signed home is datamancy.dev (see x-authoritative-grimoire); verify each ward there against x-grimoire-manifest-signature.",
    "x-pointers": POINTERS,
  };

  await writeFile(OUTPUT, JSON.stringify(index, null, 2) + "\n");
  console.error(
    `generate-agent-skills: wrote ${skills.length} self-certified skill(s) [${skills.map((s) => s.name).join(", ")}] → ${OUTPUT}`,
  );
}

main().catch((e) => {
  console.error("generate-agent-skills: FATAL", e instanceof Error ? e.message : e);
  process.exit(1);
});
