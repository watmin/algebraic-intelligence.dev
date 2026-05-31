// Build public/.well-known/agent-skills/index.json — the chronicle's OWN skills
// index. This site does NOT mirror datamancy's grimoire (that would make the
// chronicle claim the grimoire's catalog as its own). Instead the index carries:
//
//   1. one POINTER skill — "the datamancy grimoire, start here" — whose url is
//      datamancy's `grimoire` index spell (itself a real, castable SKILL.md:
//      "open this first; it lists every spell"). Its sha256 is resolved fresh
//      from datamancy's authoritative catalog at build time, so the pointer
//      stays honest as the grimoire grows.
//
//   2. LOCAL_SKILLS — alg-int's own native skills, added over time. Empty today.
//
// datamancy remains the single source of truth for the wards; this index points
// at it with one entry and never mirrors the list. Adding a spell at datamancy
// changes nothing here (the pointer's target is the index spell, not the list);
// only the grimoire spell's own sha256 refreshes, automatically, at build.
//
// Network-only (no sibling-repo dependency) → runs in the Cloudflare Pages build.
// Chained into `npm run build` before astro copies public/ → dist/. Fail-soft:
// if datamancy is unreachable, the last-committed snapshot is kept; the build
// only fails if there is no usable snapshot at all.

import { readFile, writeFile } from "node:fs/promises";

const CATALOG = "https://datamancy.dev/.well-known/agent-skills/index.json";
const MANIFEST = "https://datamancy.dev/.well-known/mcp/manifest.json";
const MANIFEST_SIG = "https://datamancy.dev/.well-known/mcp/manifest.json.sig";
const OUTPUT = "public/.well-known/agent-skills/index.json";

// alg-int's own native skills go here as they're written. Each must carry the
// v0.2.0 fields: name, type, description, url, sha256.
const LOCAL_SKILLS = [];

const POINTER_DESCRIPTION =
  "The datamancy grimoire — Latin-named code-review wards, each a SKILL.md you cast as a subagent against a target file or tree. This chronicle does not mirror the catalog; this one entry points you at the grimoire's index spell — load it to get the full, live, KMS-signed (ECDSA P-256 over SHA-256) list, then fetch and verify each ward you need. Start here. To cast a ward: fetch its SKILL.md, verify its sha256 against the signed manifest, then embed the text by value into a subagent's prompt and name the target — the spell is cast into the worker, never fetched by it.";

const POINTERS = {
  "agent-map": "https://algebraic-intelligence.dev/llms.txt",
  topology: "https://algebraic-intelligence.dev/blog/topology/",
  "mcp-card": "https://algebraic-intelligence.dev/.well-known/mcp/server-card.json",
  "api-catalog": "https://algebraic-intelligence.dev/.well-known/api-catalog",
  "oauth-authorization-server":
    "https://algebraic-intelligence.dev/.well-known/oauth-authorization-server",
  "oauth-protected-resource":
    "https://algebraic-intelligence.dev/.well-known/oauth-protected-resource",
};

const REQUIRED = ["name", "type", "description", "url", "sha256"];

function index(skills) {
  return {
    $schema: "https://agentskills.io/schema/v0.2.0.json",
    skills,
    "x-authoritative-source": CATALOG,
    "x-manifest": MANIFEST,
    "x-manifest-signature": MANIFEST_SIG,
    "x-note":
      "algebraic-intelligence.dev is the chronicle, not the grimoire. This index carries a single pointer to the datamancy grimoire (the wards' authoritative, KMS-signed home at datamancy.dev) plus any native chronicle skills. It deliberately does not mirror datamancy's catalog — a mirror drifts; the signed source cannot. For the full live ward list, follow the pointer skill or x-authoritative-source.",
    "x-pointers": POINTERS,
  };
}

async function snapshotIsUsable() {
  try {
    const cur = JSON.parse(await readFile(OUTPUT, "utf8"));
    return Array.isArray(cur.skills) && cur.skills.length > 0;
  } catch {
    return false;
  }
}

async function main() {
  let pointer;
  try {
    const res = await fetch(CATALOG, { redirect: "error" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const cat = await res.json();
    const grimoire = (cat.skills || []).find((s) => s.name === "grimoire");
    if (!grimoire || !grimoire.url || !grimoire.sha256)
      throw new Error("grimoire entry missing from source catalog");
    pointer = {
      name: "datamancy-grimoire",
      type: "grimoire-index",
      description: POINTER_DESCRIPTION,
      url: grimoire.url,
      sha256: grimoire.sha256,
      "x-documentation": grimoire["x-documentation"],
      "x-authoritative-catalog": CATALOG,
    };
  } catch (err) {
    console.error(
      `generate-agent-skills: ⚠️  could not resolve the grimoire pointer from ${CATALOG} (${err.message}).`,
    );
    if (await snapshotIsUsable()) {
      console.error("generate-agent-skills: keeping committed snapshot (has skills) — ok.");
      return;
    }
    console.error("generate-agent-skills: no usable snapshot — failing build rather than ship an empty index.");
    process.exit(1);
  }

  const skills = [pointer, ...LOCAL_SKILLS].filter((s) => REQUIRED.every((k) => s[k]));
  await writeFile(OUTPUT, JSON.stringify(index(skills), null, 2) + "\n");
  console.error(
    `generate-agent-skills: wrote ${skills.length} skill(s) [1 datamancy pointer + ${LOCAL_SKILLS.length} native] → ${OUTPUT}`,
  );
}

main().catch((e) => {
  console.error("generate-agent-skills: FATAL", e instanceof Error ? e.message : e);
  process.exit(1);
});
