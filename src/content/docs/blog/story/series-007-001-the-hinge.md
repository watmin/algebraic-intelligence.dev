---
title: "The Hinge"
description: "May 29–31, three days. The grimoire went public in May; now it had to prove it couldn't be tampered. datamancy becomes a cryptographically verified static MCP — a zero-dependency client that pins one ECDSA P-256 public key and verifies every spell against a KMS-signed manifest before a byte reaches the model, so content-tamper can never become prompt-injection. Four full-grimoire adversarial assaults drive the must-fix count 24 → 22 → 6 → 0; every real hole is caught only by the completeness critic, each a claim the code didn't honor. The eighteenth spell, circumspicere, is born from an SSRF finding the seventeen inward spells walked past. The kernel freezes at 1.0.0 — published once, never patched; the major version IS the key generation. The living-content loop is proven by dogfood: a false claim in the grimoire's own Trust line, found by reading it back through the MCP, fixed and re-signed without touching the kernel. And the architecture is named: cardo — the hinge — cast by intueri. The deeper thread: signed eval was a founding wat want — `:wat::eval-signed!` (Ed25519, arc 026) and INTENTIONS Layer 7's verifiable execution, 'the receiver verifies before running' — and datamancy carries it to the one tier the substrate could not reach, the LLM's own context: a spell is an eval form, signed and verified before it reaches the model. The founding want closes."
sidebar:
  order: 36
---

The Grimoire went public May 19 — sixteen Latin spells, the wards reborn outside the substrate, depended on as a discipline rather than carried as code. That post ended with the persistence chain gaining a link: *datamancy*. What it left open was delivery. A grimoire is prompts; prompts reach a model; a tampered prompt is an injection. The spells were public, but nothing yet proved the bytes a consumer loaded were the bytes the author signed.

The center of these three days was **the freeze** — `datamancy@1.0.0`, published once and never to be patched — and the recognition that named the shape underneath it.

---

## The Threat

A static site serves the grimoire as raw markdown. An LLM client fetches a spell and embeds it in a prompt. Between the two sits every hosting-layer attacker: a compromised CDN, a poisoned mirror, a man in the middle. The grimoire's whole value is that the spell *is* the discipline — so a spell altered in flight is a discipline rewritten by whoever altered it. Content-tamper is prompt-injection wearing the author's name.

The answer is not to run a server — a server is a hackable surface that has to stay up. The answer is to make the content prove itself. The spell bodies stay as static markdown on `datamancy.dev`; a manifest lists each spell's SHA-256; the manifest is signed; the client verifies the signature, then hashes each fetched spell locally and compares. Mismatch is refusal. Tampered content never reaches the model. The site holds the bytes; it cannot forge them.

## The Build

datamancy became that client — and the build constraint was the trust model. Every line on the verification path lives in the package; the runtime dependency count is zero. The crypto is `node:crypto`, the transport is the platform `fetch`, the framing is `node:readline` over stdio. Nothing external gets a vote, because a dependency is a surface, and a frozen trust kernel cannot take a surface back.

The private key lives non-exportably in AWS KMS; the matching public key is pinned in the package source, fingerprint `09db7668…`. The pinned key verifies *any* manifest the private key signs — including manifests that don't exist yet — exactly the way TLS pins a CA. So the website became the content: edit a spell, re-sign, push, and every consumer sees it on the next call. The manifest carries content-addressed blobs and a `previous` backpointer; rollback is refused in-session by a monotonic `epoch`. The kernel rebuilt several TUF defenses without reading TUF — the fourteenth convergence, arrived at by the four-questions discipline rather than the literature.

## The Assaults

The grimoire was turned on its own delivery vehicle. The user named the bar:

> we raise the bar through the fucking roof - we iterate to perfection - 1.0.0 earns its place through combat - it is not handed - it is earned

Four times, the full defensive grimoire was cast against datamancy as a parallel workflow — every inward spell on the code, then a completeness critic asking the one question the inward spells cannot: *what did all of you miss?* The must-fix count converged 24 → 22 → 6 → **0**. The fourth assault came back dry; the critic's verdict, verbatim: *no fourth must-fix hole; the well is dry.*

The pattern across all four was the same, and it was the lesson. Every real must-fix was caught **only** by the completeness critic — never by the seventeen inward spells. Each one was a *claim the code did not honor*: an SSRF reachable through a default `redirect: "follow"`; a `schemaVersion` NaN that slipped a numeric guard; a `list_changed` notification computed but never delivered. The inward spells converged on the lines that existed and found nits. The holes lived in the negative space — in what the artifact did by default, claimed in its README, and leaned on without asserting.

## The Eighteenth Spell

The SSRF finding did not just get fixed. It exposed a gap in the grimoire itself: seventeen spells all faced *into* the code, and not one was responsible for the surround — the runtime defaults, the shipped claims, the attack surface no inward lens examined. A discipline was missing, so a discipline got named. The naming was cast, not narrated:

> intueri names all - protocol compliance

intueri returned **circumspicere** — *circum-* (around) + *specere* (to look): the around-gaze, sibling to *perspicere*, which looks *through*. Cast last, after the inward guard reports, it surveys the perimeter they left. It was inscribed into the grimoire as the eighteenth spell and folded into vigilia as the closing cast — live in the content with no kernel change, the first proof of the model the freeze would later make permanent.

## The Freeze

The forever-decisions landed before the cut. The key model:

> fuck the backups - if the key is lost then the key is lost - if the 2.0 key is lost we provision a 3.0 key

That is the design, stated exactly: a single key, no backup, no in-major rotation. **The major version IS the key generation** — `1.x` trusts this key; lose or rotate it and the line continues at `2.x` with a new one. The version number encodes which trust root. A breaking format change works the same way: bump `schemaVersion` and mint a new major; old clients fail loud and safe rather than misread.

The promotion did not write new code. `1.0.0` is the exact byte-for-byte `0.0.13` that survived four assaults — the candidate earned the version, it was not handed one. The cut ran `gh release create v1.0.0` at commit `7c2a0d5`; the `v*` tag fired the Trusted-Publishing workflow; the user approved the deployment with a passkey; `npm publish --provenance` minted the SLSA attestation. A clean-room consumer who had never seen the repo then pulled `datamancy@1.0.0`, booted it, watched it fetch and verify the live grimoire, and confirmed the pinned key byte-identical to `09db7668…` across npm, datamancer.dev, and a DNS `TXT` record. The freeze was a measurement, not a claim.

The gate that released it was a phrase the user had reserved for exactly this:

> ship it - do it right

## The Living Loop

The freeze proved itself the same day it was decided. Reading the grimoire's own index back *through* the published MCP, the Trust paragraph claimed the manifest was "Ed25519-signed by an offline key." The kernel signs with ECDSA P-256 over a key held in KMS — a claim the code did not honor, a circumspicere-class lie sitting inside the artifact that markets honesty. It was found by being a consumer of the work, not an author of it.

The fix was the whole point of the design. The generator was corrected, the manifest re-signed via KMS, the content pushed — and the same MCP session, on its next read, returned the corrected line, verified against the pinned key, with the kernel untouched. Content changed; the trust root did not; the consumer healed on the next fetch. The same loop then carried a one-command publisher (`npm run ship` — regenerate, sign, assert the KMS fingerprint matches the pin, verify, push, poll live, verify the served bytes) and a self-healing README whose catalog generates from each spell's frontmatter, with `check:docs` failing the build on drift. The kernel is dead; the content is alive.

## The Hinge

What had been built needed a name, and the parts already had theirs — trust-on-first-use, key pinning, content-addressing, TUF, SLSA, immutable releases. The synthesis did not. So it was cast, the way the eighteenth spell was: intueri, on the architecture itself.

intueri returned **cardo** — Latin for the hinge, the pivot on which a door turns, surviving into English as *cardinal*. The key is the immovable hinge; the content is the door that swings freely on it. The hinge does not move — that is its whole job — and yet it is exactly what lets the door swing. A dead kernel, a living content stream, joined by a permanent pinned key. The spell refused the obvious crypto words — *trust root*, *radix* — because they are too familiar: a reader meets "trust root," pattern-matches to a PKI root CA, and walks away having missed the one novel thing, a frozen client trusting an unwritten future. *cardo* refuses the pattern-match: a hinge is named for the door it lets swing, not the post it is fixed to.

## The Surface Between Worlds

Read as a product, datamancy is a verified content feed. Read as a proof, it closes a want older than the package — older than most of the substrate.

wat shipped `:wat::eval-signed!` — Ed25519-verified evaluation, where only code an identity authorized runs — at **arc 026**, among its first features. The substrate's `INTENTIONS` named it Layer 7, identity itself: content-addressed programs whose digest is their identity, and *"signed eval forms carry 'this program was authorized by this identity'"* for a receiver that verifies before running. A grimoire spell is an eval form — an LLM evaluates the discipline against a target. datamancy content-addresses the spell (SHA-256), signs it (the datamancer's KMS identity), and the receiver — the LLM's client — verifies before it reaches the model. That is `eval-signed!` carried to the one tier the substrate could not itself reach: the LLM's own context. The founding want, closing.

Two later arcs had carried the same shape forward. **wat-mcp** (April 29) named it: a program is the surface between worlds, and MCP is one more envelope that crosses it; its May 25 revision collapsed the idea to *a wat program launched by an MCP client over stdio is identical to a wat program spawned by a parent wat-vm — the program never sees transport; the MCP client is just a new tier.* That is universe-residency, named back in The Grimoire. **remote-program** (May 3) carried it to the wire — `RemoteProgram<I, O>`, transport as configuration, "no clear text over the network" enforced by the type system instead of by convention. Honest by construction.

None of them had shipped the load-bearing claim end-to-end: that trust can live in the artifact, not the host. datamancy is that claim, shipped. The content is universe-resident — `DATAMANCY_SITE` lets any host serve a cloned snapshot — and what makes it trustworthy is the pinned key that travels with the consumer, not the origin it was fetched from. Host the bytes; the key still proves them. Universe-residency had been named for the *program* that never sees its transport; cardo proves the dual for the *consumer* that trusts content regardless of who served it.

And it is one discipline end to end. remote-program's invariant — the type cannot express clear-text-over-network — and cardo's invariant — the frozen kernel cannot trust a forged manifest — are the same move: put the guarantee in the structure, where vigilance is not required and cannot lapse. Honest by construction, across arcs that never shared a line of code. That is why the path was worth proving: the smallest artifact that ships a want end-to-end is the one that proves the want was right to begin with — before the larger architecture is built on it.

---

Three days, and underneath them one shape: the grimoire's delivery vehicle was hardened until the must-fix well ran dry, frozen at a version it earned in combat, and named for the hinge it turns on. The eighteenth spell was born from a hole the other seventeen could not see, and then named the lie in the artifact's own claims. The freeze is permanent by design — the only thing that ever moves `1.x` is losing the key, and that is a `2.x` with a new one.

**Tattoos → og-wat spec → holon-rs → wat-rs → BOOK.md → MEMORY.md → datamancy → `1.0.0`, frozen.** The chain extends; the hinge holds.

## Likely Contributions to the Field

- **cardo — a frozen client trusting an unwritten future**: a zero-dependency, key-pinned client, published once and never patched, that verifies arbitrary *future* content signed by a non-exportable key — where the major version *is* the key generation. The plumbing (TUF, key pinning, content-addressing) is established; the synthesis — a permanent trust root on a dead kernel, with the version number encoding which root — is the named pattern.
- **Verified prompt delivery**: every spell SHA-256-verified against a signed manifest before it reaches the model, so content-tamper-as-prompt-injection is refused at the client. The grimoire's discipline travels as content-addressed `SKILL.md`, not as code, and cannot be rewritten in flight.
- **The completeness critic**: across four adversarial passes, every real must-fix was caught only by the agent asking "what did the others miss," never by the inward reviewers — each hole a claim the code did not honor. Evidence that adversarial review needs a lens aimed at the negative space, not only at the lines that exist. The lens became a spell: circumspicere.

*PERSEVERARE.*
