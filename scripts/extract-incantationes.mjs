#!/usr/bin/env node
//
// extract-incantationes — pull every Grok Imagine prompt out of a directory of
// delivered batch files (prompts-NNN.md) into one normalized JSON.
//
// The batch files are Grok exports in MIXED formats: `### N. Heading` + fence,
// `**N. Heading**` + fence, or a single fenced prompt under a `**✅ … **` status
// line. The ONE invariant across all variants: the prompt lives in a ``` fenced
// block. So we anchor on fences and grab the nearest preceding label line for a
// best-effort title; intueri crowns the final names downstream.
//
// Usage:  node scripts/extract-incantationes.mjs [dir=/tmp]  > /tmp/incantatio-extract.json
// Emits an array of { id, file, idx, rawLabel, defaultTitle, defaultSlug, snippet, prompt }.

import { readFile, readdir } from "node:fs/promises";

const dir = process.argv[2] || "/tmp";
const MIN_PROMPT_LEN = 150; // skip tiny fences that aren't prompts

const slugify = (s) =>
  (s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
    .replace(/-+$/g, "") || "incantatio");

const cleanLabel = (raw) => {
  let t = raw.replace(/^#{1,6}\s*/, "").replace(/^\*\*/, "").replace(/\*\*$/, "").trim();
  t = t.replace(/^[^\p{L}\p{N}]+/u, "").trim(); // leading emoji / ✅ / punctuation
  t = t.replace(/^\d+\.\s*/, ""); // leading "N. "
  t = t.replace(/\s*\bprompts?\b\s*(ready)?\s*[.!]*$/i, ""); // trailing "Prompt Ready"
  t = t.replace(/[.:!]+$/, "").trim();
  return t;
};

const files = (await readdir(dir))
  .filter((f) => /^prompts-\d+\.md$/.test(f))
  .sort();

const out = [];
const slugSeen = new Map();

for (const f of files) {
  const fileNum = f.match(/(\d+)/)[1];
  const lines = (await readFile(`${dir}/${f}`, "utf-8")).split("\n");
  let i = 0;
  let idx = 0;
  while (i < lines.length) {
    if (/^```/.test(lines[i])) {
      const start = i;
      const buf = [];
      let j = i + 1;
      while (j < lines.length && !/^```/.test(lines[j])) buf.push(lines[j++]);
      const prompt = buf.join("\n").trim();
      if (prompt.length >= MIN_PROMPT_LEN) {
        idx++;
        let raw = "";
        for (let k = start - 1; k >= 0 && k > start - 8; k--) {
          const L = lines[k].trim();
          if (!L) continue;
          if (/^#{1,6}\s+\S/.test(L) || /^\*\*.+\*\*/.test(L)) {
            raw = L;
            break;
          }
        }
        const title = cleanLabel(raw) || `Incantatio ${fileNum}-${idx}`;
        let slug = slugify(title);
        const seen = slugSeen.get(slug) || 0;
        slugSeen.set(slug, seen + 1);
        if (seen > 0) slug = `${slug}-${seen + 1}`;
        out.push({
          id: `${fileNum}-${idx}`,
          file: f,
          idx,
          rawLabel: raw,
          defaultTitle: title,
          defaultSlug: slug,
          snippet: prompt.slice(0, 160).replace(/\s+/g, " "),
          prompt,
        });
      }
      i = j + 1;
    } else {
      i++;
    }
  }
}

process.stdout.write(JSON.stringify(out, null, 2) + "\n");
process.stderr.write(`extracted ${out.length} prompts from ${files.length} files\n`);
