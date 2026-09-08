//
// posts — one discovery for both narrative guards.
//
// check-nav and check-contributions both need "every narrative post on the
// site." They each used a non-recursive readdir over blog/story, which was
// correct while the trunk was the only narrative track. It is not any more:
// front tracks live at blog/fronts/<front>/NNN-slug.md (STORY-BRANCHING.md §3.2).
//
// A non-recursive readdir returns "fronts" as a bare directory name, which fails
// the `.mdx?$` filter and is SILENTLY SKIPPED. Both guards would have reported
// green over posts they never saw — which is precisely the failure check-nav was
// built to prevent (its own header: "that is exactly how series-007-005 and
// 007-006 shipped unseen"). Hence one discovery, shared, recursive.

import { readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const ROOTS = [
  { dir: "src/content/docs/blog/story", kind: "story", recursive: false },
  { dir: "src/content/docs/blog/fronts", kind: "front", recursive: true },
];

async function walk(dir, recursive, prefix = "") {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${e.name}` : e.name;
    if (e.isDirectory()) {
      if (recursive) out.push(...(await walk(join(dir, e.name), true, rel)));
    } else if (/\.mdx?$/.test(e.name)) {
      out.push(rel);
    }
  }
  return out;
}

// Every narrative post, as { file, slug, kind, isLanding }.
//   file      — path from repo root, for error messages
//   slug      — the content-collection slug astro.config.mjs would reference
//   kind      — "story" (the trunk) | "front" (a live workstream track)
//   isLanding — an index page: a track's overview, not a post
export async function discoverPosts() {
  const posts = [];
  for (const root of ROOTS) {
    const base = root.dir.replace(/^src\/content\/docs\//, "");
    for (const rel of (await walk(root.dir, root.recursive)).sort()) {
      const noExt = rel.replace(/\.mdx?$/, "");
      posts.push({
        file: `${root.dir}/${rel}`,
        slug: `${base}/${noExt}`,
        kind: root.kind,
        isLanding: /(^|\/)index$/.test(noExt),
      });
    }
  }
  return posts;
}
