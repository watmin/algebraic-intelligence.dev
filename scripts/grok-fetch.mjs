#!/usr/bin/env node
//
// grok-fetch — incrementally download your liked Grok Imagine images + prompts.
//
// Pages POST https://grok.com/rest/media/post/list (source = LIKED), downloads
// each NEW image from its mediaUrl, and records the prompt that made it. It is
// IDEMPOTENT: a manifest of already-fetched post ids is the checkpoint, so a
// re-run after you generate more images only pulls the new ones. Burn your daily
// gen limit, queue more prompts, re-run — it picks up where it left off.
//
// SECRETS stay OUT of the repo. Auth is read from ~/grok-imagine/auth.json:
//   { "cookie": "<full Cookie header>", "statsigId": "<x-statsig-id>", "userAgent": "<UA>" }
// Downloads + manifest also live under ~/grok-imagine/ (outside the git tree).
//
// Usage:  node scripts/grok-fetch.mjs
//   env:  GROK_DIR (default ~/grok-imagine) · GROK_SOURCE (default ...LIKED)
//         GROK_MAX_PAGES (default 200, safety cap) · GROK_SLEEP_MS (default 250)

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const ROOT = process.env.GROK_DIR || join(homedir(), "grok-imagine");
const MEDIA = join(ROOT, "media");
const MANIFEST = join(ROOT, "manifest.json");
const AUTH = join(ROOT, "auth.json");
const LIST_URL = "https://grok.com/rest/media/post/list";
const SOURCE = process.env.GROK_SOURCE || "MEDIA_POST_SOURCE_LIKED";
const MAX_PAGES = Number(process.env.GROK_MAX_PAGES || 200);
const SLEEP_MS = Number(process.env.GROK_SLEEP_MS || 250);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

if (!existsSync(AUTH)) {
  console.error(`missing ${AUTH} — create it with { cookie, statsigId, userAgent }`);
  process.exit(1);
}
const auth = JSON.parse(await readFile(AUTH, "utf-8"));
await mkdir(MEDIA, { recursive: true });

const manifest = existsSync(MANIFEST)
  ? JSON.parse(await readFile(MANIFEST, "utf-8"))
  : { posts: {} };
const seen = manifest.posts; // id -> { createTime, prompt, file, width, height }

const listHeaders = {
  accept: "*/*",
  "content-type": "application/json",
  origin: "https://grok.com",
  referer: "https://grok.com/imagine/saved",
  "user-agent": auth.userAgent,
  cookie: auth.cookie,
  ...(auth.statsigId ? { "x-statsig-id": auth.statsigId } : {}),
};

async function listPage(cursor) {
  const body = { limit: 40, filter: { source: SOURCE, safeForWork: false } };
  if (cursor) body.cursor = cursor;
  const res = await fetch(LIST_URL, {
    method: "POST",
    headers: listHeaders,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`list HTTP ${res.status} ${res.statusText} — ${(await res.text()).slice(0, 300)}`);
  }
  return res.json();
}

async function downloadImage(post) {
  const ext = (post.mimeType || "image/jpeg").split("/")[1].replace("jpeg", "jpg");
  const file = join(MEDIA, `${post.id}.${ext}`);
  if (existsSync(file)) return file;
  const res = await fetch(post.mediaUrl, {
    headers: {
      cookie: auth.cookie,
      "user-agent": auth.userAgent,
      referer: "https://grok.com/",
    },
  });
  if (!res.ok) throw new Error(`image HTTP ${res.status} for ${post.id}`);
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
  return file;
}

let cursor;
let page = 0;
let fetched = 0;
let skipped = 0;
let errors = 0;
try {
  do {
    const data = await listPage(cursor);
    const posts = data.posts || [];
    if (posts.length === 0) break;
    for (const p of posts) {
      if (p.mediaType !== "MEDIA_POST_TYPE_IMAGE") continue;
      if (seen[p.id]) {
        skipped++;
        continue;
      }
      try {
        const file = await downloadImage(p);
        seen[p.id] = {
          createTime: p.createTime,
          prompt: p.prompt || p.images?.[0]?.prompt || "",
          file: file.slice(ROOT.length + 1),
          width: p.resolution?.width,
          height: p.resolution?.height,
        };
        fetched++;
      } catch (e) {
        errors++;
        console.error(`\n  ! ${p.id}: ${e.message}`);
      }
      process.stdout.write(`\r  page ${page + 1}: ${fetched} new, ${skipped} known, ${errors} err   `);
    }
    await writeFile(MANIFEST, JSON.stringify(manifest, null, 2)); // checkpoint per page
    cursor = data.nextCursor;
    page++;
    if (cursor) await sleep(SLEEP_MS);
  } while (cursor && page < MAX_PAGES);
} finally {
  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
}

console.log(
  `\n\ndone: +${fetched} new, ${skipped} already had, ${errors} errors over ${page} page(s).` +
    `\ntotal in manifest: ${Object.keys(seen).length}` +
    `\nmedia:    ${MEDIA}\nmanifest: ${MANIFEST}`,
);
