# Site Plan

Internal planning notes — not deployed.

## Content Sections

### Projects
Project-level documentation for each repo.

- **holon-rs** — Rust core library (encoder, accumulator, vector, subspace, memory)
- **holon-lab-ddos** — eBPF/XDP adaptive DDoS mitigation lab
- *(future)* Python bindings / tooling
- *(future)* Ruby, Go integrations

### Guides
Long-form walkthroughs and tutorials.

- Getting started with Holon
- Building a WAF from scratch
- eBPF + XDP pipeline walkthrough
- Algebraic encoding explained
- Holographic memory internals

### Demos
Code-forward pages showcasing specific features.

- Encoder visualizations
- Accumulator operations
- Engram memory formation
- Traffic classification in real-time

### Blog
Updates, design decisions, feature announcements.

- Release notes
- Architecture deep-dives
- Benchmark results
- "Building in public" posts

## Languages / Ecosystems

Current:
- Rust (holon-rs)
- C / eBPF (holon-lab-ddos)

Planned:
- Python
- Ruby
- Go

## Deployment

- **Host**: Cloudflare Pages
- **Source**: GitHub (algebraic-intelligence.dev repo)
- **Framework**: Astro + Starlight
- **Build**: `npm run build` → `dist/`

## TODO

- [ ] Port holon-rs README content into project docs
- [ ] Port holon-lab-ddos engram memory docs
- [ ] Write getting started guide
- [ ] First real blog post
- [ ] Demo page with code examples
- [ ] Custom landing page styling
- [ ] Favicon / branding
