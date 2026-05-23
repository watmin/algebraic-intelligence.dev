// Postbuild: parse-check every Cloudflare Pages Function with esbuild — the
// same toolchain Cloudflare uses to bundle them at deploy time.
//
// Why this exists: `astro build` doesn't touch the `functions/` directory.
// Without this check, a function with a syntax error builds locally clean,
// pushes happily, and then fails on Cloudflare. Lost two deploys to that on
// 2026-05-23 before adding this gate.
//
// Cheap: each .ts file goes through esbuild with --write=false (parse-only).
// On any parse error, exit non-zero so postbuild fails the whole `npm run
// build` chain and the user can't accidentally `git push` a broken function.

import { readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const ROOT = "functions";

if (!existsSync(ROOT)) {
  console.log(`check-functions: no ${ROOT}/ directory; nothing to check.`);
  process.exit(0);
}

async function walkTsFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walkTsFiles(full)));
    } else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".js"))) {
      out.push(full);
    }
  }
  return out;
}

const files = await walkTsFiles(ROOT);
if (files.length === 0) {
  console.log(`check-functions: no .ts/.js files under ${ROOT}/; nothing to check.`);
  process.exit(0);
}

let failures = 0;
for (const file of files) {
  const rel = relative(".", file);
  const result = spawnSync(
    "npx",
    [
      "--no-install",
      "esbuild",
      file,
      "--bundle",
      "--platform=neutral",
      "--format=esm",
      "--target=es2022",
      "--outfile=/dev/null",
      "--log-level=warning",
    ],
    { encoding: "utf8" },
  );

  if (result.status !== 0) {
    console.error(`check-functions: ✘ ${rel}`);
    if (result.stdout) console.error(result.stdout);
    if (result.stderr) console.error(result.stderr);
    failures++;
  } else {
    console.log(`check-functions: ✓ ${rel}`);
  }
}

if (failures > 0) {
  console.error(`check-functions: ${failures} file${failures === 1 ? "" : "s"} failed esbuild parse. Fix before pushing — Cloudflare Pages will reject the deploy.`);
  process.exit(1);
}

console.log(`check-functions: all ${files.length} file${files.length === 1 ? "" : "s"} parse cleanly.`);
