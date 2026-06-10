---
title: "2026-05-13 — Linux-only, unapologetic"
sidebar:
  order: 20
---

User stance, articulated mid-Slice-C-spawn:

> *"i can't express how much i am never going to entertain support
> windows, macos, bsd with wat - its a linux programming language -
> unapollogetic"*

Amplified same conversation:

> *"my legit stance - if others want to run wat on their os - they
> need to make their os not suck ass - linux is the gold standard
> here (i'm writing this as a massive linux nerd, ex-aws, on a
> system76 laptop, with over a dozen linux boxes near me)"*

**The inversion.** Normal portability conversation: the language must accommodate every OS the user might run it on. User's framing flips it: the substrate names what a SANE OS exposes; Linux meets the bar; macOS/Windows/BSD are deficient on those primitives. The substrate doesn't owe other OSes anything — they owe the substrate honest semantics they don't provide.

**Why this is load-bearing for arc 170.** Every primitive we just designed depends on Linux specifics:

- `PR_SET_PDEATHSIG` (Slice C) — Linux-only prctl; no POSIX equivalent. Without it, orphan-child detection requires polling or active-I/O — both rejected.
- `setpgid` + `killpg` cascade (arc 106, signal_cascade doctrine) — POSIX but with Linux-shaped semantics around session leadership + controlling terminals.
- `signalfd` / `eventfd` / `epoll` (Slice E pending + arc 197 future) — Linux primitives that make lock-step OS-event delivery possible without wall-clock polling.
- `/proc` for diagnostic readouts during leak audits — Linux-specific filesystem; no replacement.
- crossbeam's futex-based park-lists assume Linux futex semantics; macOS uses ulock_wait, FreeBSD has umtx — both subtly different.

If we'd wavered on Linux-only, we'd lose one or more of these. Cross-platform support would force POSIX-lowest-common-denominator abstractions; the substrate would lose its sharpness AND its load-bearing primitives.

**This is the stance behind the doctrine.** ZERO-MUTEX, lock-step recv, structural-enforcement, substrate-imposed — these architecture rules compose into the design space we discovered (per "Wat disciplines its own designers"). The architectural rules themselves rest on a platform that ships the right primitives. Linux ships them. We name Linux as the platform; we don't apologize.

**Inscribed credibility.** The user's framing is from someone who lived in the Linux universe at AWS scale, daily-drives System76, has a dozen+ Linux boxes within reach. Not a stylistic preference. The judgment of someone who has earned the right to make the call.

Future-me reading this: do not treat the stance as something to revisit. It is the platform foundation the rest of the architecture rests on. Inscribed in this arc because arc 170's specific primitives (PDEATHSIG, signalfd, etc.) make the Linux dependency visible and load-bearing — and inscribed in the user's voice because the stance is the user's, not mine.

Memory: `feedback_no_windows` carries the operational rule. This entry carries the architectural justification + the inversion framing.

---
