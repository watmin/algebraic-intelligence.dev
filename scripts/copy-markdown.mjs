// Postbuild: mirror every .md source file from src/content/docs/blog into dist/blog
// at the same path, so each HTML page (/blog/foo/) has a markdown companion at
// /blog/foo.md. Skips .mdx (MDX has component imports — not pure markdown).
//
// Agents that prefer markdown can hit the companion URL directly. The companion
// is also advertised via Link: rel="alternate"; type="text/markdown" in _headers
// and the llms.txt agent map.

import { mkdir, readdir, copyFile } from "node:fs/promises";
import { join, relative, dirname } from "node:path";
import { existsSync } from "node:fs";

const SRC = "src/content/docs/blog";
const DST = "dist/blog";

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      out.push(full);
    }
  }
  return out;
}

if (!existsSync(SRC)) {
  console.error(`copy-markdown: source directory missing: ${SRC}`);
  process.exit(1);
}
if (!existsSync(DST)) {
  console.error(`copy-markdown: dist directory missing: ${DST} (did astro build run first?)`);
  process.exit(1);
}

const sources = await walk(SRC);
let copied = 0;
for (const src of sources) {
  const rel = relative(SRC, src);
  const dst = join(DST, rel);
  await mkdir(dirname(dst), { recursive: true });
  await copyFile(src, dst);
  copied++;
}

console.log(`copy-markdown: mirrored ${copied} .md file${copied === 1 ? "" : "s"} to ${DST}`);
