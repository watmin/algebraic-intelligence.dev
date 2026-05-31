// WebMCP registration for algebraic-intelligence.dev
// https://webmachinelearning.github.io/webmcp/
//
// Exposes three tools to in-browser AI agents:
//   - getMarkdownAlternate: URL of the current page's .md companion
//   - getAgentMap:           fetched content of /llms.txt
//   - listAgentSkills:       fetched content of /.well-known/agent-skills/index.json
//
// Each tool feature-detects the WebMCP API; if `navigator.modelContext` is
// absent (every browser without the experimental flag, today), the script
// silently no-ops. No exceptions thrown, no console noise.

(function () {
  if (typeof navigator === "undefined") return;
  if (!navigator.modelContext) return;
  if (typeof navigator.modelContext.provideContext !== "function") return;

  navigator.modelContext.provideContext({
    tools: [
      {
        name: "getMarkdownAlternate",
        description:
          "Return the URL of the markdown-source companion for the current page. Blog pages have a .md companion at the same path (e.g., /blog/topology/ → /blog/topology.md). Useful when the agent wants the original markdown rather than the rendered HTML.",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
          additionalProperties: false,
        },
        execute: async () => {
          const path = window.location.pathname;
          if (!path.startsWith("/blog/")) {
            return {
              url: null,
              note: "No markdown companion exists for this path. Companions live only under /blog/.",
            };
          }
          if (path === "/blog/" || path === "/blog") {
            return { url: null, note: "Blog index has no single-page companion; fetch /llms.txt for the agent map instead." };
          }
          const base = path.endsWith("/") ? path.slice(0, -1) : path;
          return { url: base + ".md", absoluteUrl: window.location.origin + base + ".md" };
        },
      },
      {
        name: "getAgentMap",
        description:
          "Fetch /llms.txt — the curated agent-facing map of the site. Returns the markdown content directly so the agent doesn't need a separate HTTP request.",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
          additionalProperties: false,
        },
        execute: async () => {
          try {
            const response = await fetch("/llms.txt", { headers: { Accept: "text/markdown" } });
            if (!response.ok) {
              return { error: `HTTP ${response.status}`, url: "/llms.txt" };
            }
            return {
              contentType: response.headers.get("content-type") || "text/markdown",
              content: await response.text(),
              url: "/llms.txt",
            };
          } catch (err) {
            return { error: err.message, url: "/llms.txt" };
          }
        },
      },
      {
        name: "listAgentSkills",
        description:
          "Fetch the authoritative datamancy grimoire catalog — the live, KMS-signed list of invokable wards (each a SKILL.md cast as a subagent against a target). This chronicle holds no copy of the spell list; the tool fetches the always-current signed source at datamancy.dev directly, so the result never goes stale when a spell is added. Each entry carries a SHA-256 verifiable against the signed manifest.",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
          additionalProperties: false,
        },
        execute: async () => {
          const AUTHORITATIVE =
            "https://datamancy.dev/.well-known/agent-skills/index.json";
          const POINTER = "/.well-known/agent-skills/index.json";
          try {
            const response = await fetch(AUTHORITATIVE);
            if (response.ok) {
              return { source: AUTHORITATIVE, catalog: await response.json() };
            }
          } catch {
            /* cross-origin unavailable — fall through to the local pointer */
          }
          // Fallback: return this site's pointer doc, which names the authoritative source.
          try {
            const ptr = await fetch(POINTER);
            if (!ptr.ok) return { error: `HTTP ${ptr.status}`, url: POINTER };
            return { source: POINTER, pointer: await ptr.json() };
          } catch (err) {
            return { error: err.message, url: POINTER };
          }
        },
      },
    ],
  });
})();
