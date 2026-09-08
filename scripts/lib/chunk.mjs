//
// chunk — the shared segmentation used by both mirrors.
//
// A markdown document too large to render as one page is split on its top-level
// headings into one page per segment. mirror-monoliths has done this since the
// arc-170 realizations rendered to ~3.5 MB and the BOOK to 4.2 MB — both
// build-memory hogs. mirror-realizations now does it too, for per-arc logs that
// have grown into the same territory (arc 278: 1,469 KB source → ~5.9 MB).
//
// These helpers lived inside mirror-monoliths.mjs and were lifted here verbatim
// so the second caller shares the behaviour rather than reimplementing it. The
// chunker is one thing; it should exist once.

// A heading line → a stable, filesystem- and URL-safe slug.
export function slugify(heading) {
  return heading
    .replace(/^#+\s*/, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // unwrap [text](url) -> text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70)
    .replace(/-+$/g, "");
}

// A heading line → a clean page/sidebar title: marker stripped, any markdown link
// unwrapped, trailing caps-slash facet run dropped (keep the first two " — "
// fields), and length-capped so song entries don't dump 80 chars into the sidebar.
export function chunkTitle(heading) {
  const bare = heading
    .replace(/^#+\s*/, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .trim();
  const beforeFacets = bare.split(" — ").slice(0, 2).join(" — ");
  return beforeFacets.length > 90 ? beforeFacets.slice(0, 88) + "…" : beforeFacets;
}

// Line indices of every top-level segment boundary.
export function segmentBounds(lines, segment = /^## /) {
  const bounds = [];
  lines.forEach((line, i) => {
    if (segment.test(line)) bounds.push(i);
  });
  return bounds;
}

// Is this document safe to split on `segment`?
//
// The split is only sound when every match is a genuine TOP-LEVEL divider. A
// document that uses `## ` for subheadings *inside* an entry would have its
// entries torn in half, silently — the chunks would still build, still render,
// and still be wrong. mirror-monoliths states this assumption for its two
// sources as verified-by-hand; a mirror that discovers sources automatically
// cannot hand-verify, so it must refuse instead.
//
// The signals, all cheap and all structural:
//   - at least MIN_SEGMENTS boundaries (one or two "segments" is not a segmented
//     document, it is a document with a couple of headings)
//   - a deeper level (`###`) is in use, which is what an entry's *internal*
//     headings should be; its absence means `##` may be doing double duty
//   - no boundary lands in the first line (a leading `## ` before any body)
export function splitSafety(lines, segment = /^## /, { minSegments = 4 } = {}) {
  const bounds = segmentBounds(lines, segment);
  const hasDeeper = lines.some((l) => /^### /.test(l));
  if (bounds.length < minSegments) {
    return { safe: false, bounds, why: `only ${bounds.length} top-level segment(s) (need ${minSegments})` };
  }
  if (!hasDeeper) {
    return {
      safe: false,
      bounds,
      why: `no '### ' headings anywhere — '## ' may be serving as an in-entry subheading, and splitting would tear entries`,
    };
  }
  return { safe: true, bounds, why: "" };
}

// Segment a document into { num, slug, title, body } pages. `bounds` comes from
// segmentBounds/splitSafety. The heading line itself is dropped from the body:
// the frontmatter title becomes the rendered H1, so keeping it would duplicate.
export function chunkPages(lines, bounds) {
  const seen = new Set();
  return bounds.map((start, c) => {
    const end = c + 1 < bounds.length ? bounds[c + 1] : lines.length;
    const heading = lines[start];
    const num = String(c + 1).padStart(3, "0");
    let slug = slugify(heading);
    if (!slug || seen.has(slug)) slug = `${slug || "segment"}-${num}`;
    seen.add(slug);
    const body =
      lines
        .slice(start + 1, end)
        .join("\n")
        .replace(/^\n+/, "")
        .replace(/\s+$/, "") + "\n";
    return { num, slug, title: chunkTitle(heading), body, order: c + 1 };
  });
}
