// Generate public/.well-known/agent-skills/index.json from the datamancy
// grimoire (sibling repo at ../datamancy). Each spell directory has a
// SKILL.md with frontmatter (name + description). The Agent Skills Discovery
// RFC v0.2.0 wants: name, type, description, url, sha256 digest per skill.
//
// This is NOT chained into the build (datamancy lives in a sibling repo and
// won't be available in Cloudflare Pages' build environment). Invoke
// manually via `npm run skills:regen` whenever the grimoire changes.

import { readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { existsSync } from "node:fs";

const SOURCE_REPO = "../datamancy";
const OUTPUT_FILE = "public/.well-known/agent-skills/index.json";

// Categorization mirrors datamancy/README.md groupings.
const CATEGORIES = {
  // Tests of craft — defensive against code quality
  intueri:    "tests-of-craft",
  struere:    "tests-of-craft",
  solvere:    "tests-of-craft",
  purgare:    "tests-of-craft",
  temperare:  "tests-of-craft",
  secare:     "tests-of-craft",
  sequi:      "tests-of-craft",

  // Tests of surface — defensive against test quality
  perspicere: "tests-of-surface",
  vocare:     "tests-of-surface",
  complectens: "tests-of-surface",
  mora:       "tests-of-surface",

  // Tests of fidelity — defensive against drift
  conferre:   "tests-of-fidelity",
  probare:    "tests-of-fidelity",
  cernere:    "tests-of-fidelity",

  // Solo wards — special-purpose
  nesciens:   "solo-ward",
  vigilia:    "solo-ward",
};

const RAW_URL_BASE = "https://raw.githubusercontent.com/watmin/datamancy/main";
const HUMAN_URL_BASE = "https://github.com/watmin/datamancy/blob/main";

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return {};
  const body = match[1];
  const result = {};
  // Naive YAML parse — handles flat key: value pairs, which is all the
  // SKILL.md frontmatter uses.
  let currentKey = null;
  let currentValue = "";
  for (const line of body.split("\n")) {
    const m = line.match(/^([\w-]+):\s*(.*)$/);
    if (m) {
      if (currentKey) result[currentKey] = currentValue.trim();
      currentKey = m[1];
      currentValue = m[2];
    } else if (currentKey) {
      currentValue += " " + line.trim();
    }
  }
  if (currentKey) result[currentKey] = currentValue.trim();
  return result;
}

if (!existsSync(SOURCE_REPO)) {
  console.error(`generate-agent-skills: source repo missing: ${SOURCE_REPO}`);
  console.error(`Expected to find datamancy as a sibling directory.`);
  process.exit(1);
}

const entries = await readdir(SOURCE_REPO, { withFileTypes: true });
const spellDirs = entries
  .filter((e) => e.isDirectory() && CATEGORIES[e.name])
  .map((e) => e.name)
  .sort();

const missingFromMap = entries
  .filter((e) => e.isDirectory() && !CATEGORIES[e.name] && !e.name.startsWith("."))
  .map((e) => e.name);

if (missingFromMap.length > 0) {
  console.error(`generate-agent-skills: ⚠️  spell directories not in CATEGORIES map: ${missingFromMap.join(", ")}`);
  console.error(`Add them to scripts/generate-agent-skills.mjs CATEGORIES.`);
  process.exit(1);
}

const skills = [];
for (const dirName of spellDirs) {
  const skillPath = join(SOURCE_REPO, dirName, "SKILL.md");
  if (!existsSync(skillPath)) {
    console.error(`generate-agent-skills: missing SKILL.md in ${dirName}/`);
    continue;
  }
  const content = await readFile(skillPath, "utf8");
  const fm = extractFrontmatter(content);
  const hash = createHash("sha256").update(content).digest("hex");

  skills.push({
    name: fm.name || dirName,
    type: CATEGORIES[dirName],
    description: fm.description || "",
    url: `${RAW_URL_BASE}/${dirName}/SKILL.md`,
    sha256: hash,
    "x-documentation": `${HUMAN_URL_BASE}/${dirName}/SKILL.md`,
  });
}

const index = {
  $schema: "https://agentskills.io/schema/v0.2.0.json",
  skills,
  "x-source": "https://github.com/watmin/datamancy",
  "x-source-version": "main",
  "x-note": "These are the wards from the datamancy grimoire — Latin-named defensive spells, each a SKILL.md the datamancer casts as a subagent against a target file or tree. The grimoire is the practice's tools; each spell encodes one discipline; severity is L1 (blocks) / L2 (fix-now) / L3 (taste). Categories (`type` field): tests-of-craft (defensive against code quality — Hickey + Beckman lineage), tests-of-surface (defensive against test quality), tests-of-fidelity (defensive against spec/code drift), solo-ward (nesciens walks the docs as a fresh reader; vigilia casts every defensive spell in parallel). The sha256 lets agents verify content integrity against the raw GitHub URL. Regenerate via `npm run skills:regen` when the grimoire changes.",
  "x-pointers": {
    "agent-map": "https://algebraic-intelligence.dev/llms.txt",
    topology: "https://algebraic-intelligence.dev/blog/topology/",
    "mcp-card": "https://algebraic-intelligence.dev/.well-known/mcp/server-card.json",
    "api-catalog": "https://algebraic-intelligence.dev/.well-known/api-catalog",
    "oauth-authorization-server": "https://algebraic-intelligence.dev/.well-known/oauth-authorization-server",
    "oauth-protected-resource": "https://algebraic-intelligence.dev/.well-known/oauth-protected-resource",
  },
};

await writeFile(OUTPUT_FILE, JSON.stringify(index, null, 2) + "\n");
console.log(`generate-agent-skills: emitted ${skills.length} skills to ${OUTPUT_FILE}`);
console.log(`  categories: ${[...new Set(skills.map((s) => s.type))].sort().join(", ")}`);
