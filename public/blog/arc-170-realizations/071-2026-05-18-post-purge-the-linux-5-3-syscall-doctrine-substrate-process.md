## 2026-05-18 (post-PURGE) — The Linux 5.3+ syscall doctrine: substrate process-management gets articulated

The δ-comm-purge cascade closure (workspace 2 → 0 + dual-failure recognition) opened the next dragon: production orphans observed surviving `cargo test`. Initially framed as arc 213 "pressure-flake." Then sharpened twice by user direction into THE foundational substrate-process-management doctrine.

### The walk

**Initial mis-framing (orchestrator):** *"1% race window in the lifeline mechanism — possible on Linux"*

**User rejection:** *"we've been down this road before - yes - this is possible on linux - but no, not in our system - we are /always/ lock step - we do not allow protocol violations - there's a failure in our system - find it - destroy it for eternity"*

The "race condition possible on Linux" framing was the EXACT trap arc 212 had just taught us to reject — same easy-out as "Single-shape-walker because reasons." The substrate's claim that "every fork-spawned child has a lifeline" is either true or a lie; "kernel races sometimes" is capitulation.

**The audit (using the new weapon):**
- Three `libc::fork()` sites in src/fork.rs: 153 / 614 / 920
- Sites 614 + 920: install lifeline ✓
- Site 153 (`run_in_fork`): NO LIFELINE — bypasses the mechanism entirely
- 9 callers of run_in_fork across substrate + tests; one of them spawns a grandchild via spawn-process; when cargo test exits, run_in_fork-child (no lifeline) survives; grandchild also survives (its lifeline_w is held by un-dyingable parent)

THE GAP: substrate has TWO fork paths; only ONE installs the lifeline; the substrate's "every spawn has a lifeline" guarantee is a LIE; the orphans we observed are the gap surfacing in production.

### The second sharpening — "eventual consistency" rejected

Mid-investigation, orchestrator described /proc/PID/stat reads as "eventually consistent."

**User rejection:** *"divide by zero - this screams we aren't interfacing with the kernel correctly - the kernel knows and provides all we need immediately - i don't even want to entertain reading more content after that statement"*

Right. "Eventual consistency" was capitulation again — same trap, different surface. The kernel knows the truth instantly via syscall (`waitid(P_PIDFD, pidfd, WEXITED)` returns the moment the process exits). `/proc/PID/stat` is a TEXT PUBLICATION layer that lags behind the syscall reality. Reading /proc isn't "asking the kernel" — it's reading a text view the kernel updates eventually.

The probe's 1/100 flake is from the probe's `/proc/PID/stat` read racing the kernel's procfs publication window — NOT from the lifeline mechanism failing. Mechanism = sound. Observation method = wrong oracle.

### The third sharpening — "what is the correct longterm syscall pattern"

User: *"we are linux first - we leverage the best of breed at all times - what is the correct longterm syscall pattern - we are approaching the goal"* + *"my os is linux 6 ... 5.3 is from 2019 - we use the tools we have - zero doubt - do it perfect"*.

This is the doctrine moment. Substrate-honest articulation of the canonical Linux 5.3+ process primitives:

| Capability | Goal primitive | Why |
|---|---|---|
| Process creation | `clone3() + CLONE_PIDFD + CLONE_CLEAR_SIGHAND` | Atomic pidfd; clean signal state |
| Exit observation | `poll(pidfd, POLLIN)` / `waitid(P_PIDFD, pidfd, WEXITED)` | Kernel-event-driven; race-free |
| Signaling | `pidfd_send_signal(pidfd, sig)` | PID-reuse-safe |
| Parent-death detection | Lifeline pipe inherited atomically via clone3 | Setup pre-fork; no install-race |
| Signal handling (when needed) | `signalfd()` in poll loop | No async-signal-safety trap |
| **NEVER USE** | `pidfd_open(pid)`, `kill(pid)`, `waitpid(pid)`, async signal handlers, `/proc/PID/*` for state | Each has its own race or fuzzy-oracle defect |

### The substrate's L2 enforcement (parallel to arc 212's `WatAST::children()` newtype wall)

Same shape, applied to fork primitives:
- `libc::fork`, `libc::clone3`, `libc::waitpid`, `libc::waitid`, `libc::kill`, `libc::pidfd_*`, `libc::signalfd` — all module-private
- ONE canonical helper: `wat::fork::spawn_lifelined(args) -> (Pid, Pidfd, LifelineWriter)`
- `Pidfd` type has NO `from_pid` constructor — typestate-equivalent for "you have a verified non-stale handle"
- "Fork without lifeline" cannot be expressed (compile error)
- "Signal a PID-reused process" cannot be expressed (no kill-by-pid public path)
- "Observe via /proc" cannot be expressed (no /proc-reading public helper)

Wrong shape becomes structurally impossible at the kernel-interface layer.

### Two distinct failures resolved by one doctrine

| Failure | Class | Resolution via doctrine |
|---|---|---|
| Production orphans (run_in_fork bypasses lifeline) | Substrate non-compliance | Canonical `spawn_lifelined` helper; L2 enforces all fork paths use it |
| 1/100 probe flake (/proc/PID/stat reads) | Fuzzy-oracle cheat | Probes migrate to `pidfd` + `waitid(P_PIDFD)`; L2 enforces no /proc in substrate observation |

### Why this matters beyond arc 213

This doctrine moment formalizes the substrate's commitment to **best-of-breed kernel interfaces over portable POSIX cargo-cult**:

- `feedback_no_windows` unlocks using Linux primitives without compatibility layers
- We're already on Linux 6+; Linux 5.3 (Sep 2019) provided every primitive above; 5+ years of kernel stability
- The substrate's "lock-step / zero-mutex / structural-enforcement" doctrines compose with kernel-event-driven primitives — they're the same shape of correctness at different layers
- Other arcs in flight (arc 170 D-stones; arc 209 Stone A; arc 210) all spawn processes — they ALL benefit from the canonical helper being available

### The arc 213 stone chain (post-expansion)

| Stone | Layer | What |
|---|---|---|
| α | L0 substrate | Mint `Pidfd` + `spawn_lifelined` (clone3+CLONE_PIDFD+CLONE_CLEAR_SIGHAND) |
| β | L1 migration | run_in_fork → spawn_lifelined (production orphan fix) |
| γ | L1 migration | 3 fork sites → spawn_lifelined |
| δ | L1 migration | waitpid/kill → Pidfd methods |
| ε | L1 migration | /proc probes → pidfd observation |
| ζ | L2 enforcement | libc::* process primitives module-private |
| η | INSCRIPTION | Doctrine etched; arc 213 closes |

Arc 213 closure unblocks arc 211 closure (with arc 212). Many downstream arcs (170 cascade, 209, 210) benefit from the canonical fork primitive once it exists.

### The methodology paying out across consecutive arcs

| Arc | Substrate gap | Discovery | Resolution |
|---|---|---|---|
| 212 | walker recursion can skip Vector | δ-comm-positions sharpening | `WatAST::children()` newtype wall (L4) |
| 212 cascade | comm Result `_`-discard | δ-comm-positions extended coverage | Test fixture migration to Result/expect; L1 enforcement via walker |
| **213** | **fork without lifeline + /proc as oracle** | **post-PURGE audit** | **Canonical Pidfd primitive + L2 enforcement on all process syscalls** |

Three arcs, three substrate-honest gaps, three structural eliminations. The methodology is reproducible. The substrate gets honest one cascade at a time.

### What's left standing after η

After arc 213 closes:
- Every process the substrate creates is atomic with its pidfd (no PID-reuse race possible)
- Every process the substrate observes is via kernel-direct syscall (no /proc as oracle)
- Every process the substrate signals is via pidfd (no PID-reuse race possible)
- Every child detects parent death via fork-inherited pipe-EOF (unrace-able)
- Every process group cascades cleanly on parent exit (existing setpgid + killpg discipline)
- Every wrong shape (libc::fork directly, pidfd_open(pid), /proc observation) is a COMPILE ERROR

The orphan-leak class becomes structurally extinct. The PID-reuse-race class becomes structurally extinct. The fuzzy-oracle class becomes structurally extinct. The "Linux is racy" capitulation cannot be invoked because Linux GIVES us race-free primitives — we just have to use them.

### Cross-references

- INTERSTITIAL § 2026-05-18 (post-spawn) "NO FEAR" — song #13 (FEARLESSNESS); raised the bar to L4 for arc 212
- INTERSTITIAL § 2026-05-18 (mid-cascade) "PURGE" — song #14; the cascade closure pattern that just unlocked this arc 213 discovery
- Arc 213 DESIGN § "Scope EXPANDED 2026-05-18" — the locked stone chain
- Arc 212 DESIGN § "Scope EXPANDED 2026-05-18 (post-L4-conversation)" — sibling pattern at the walker layer
- `feedback_no_windows` — the Linux-first commitment this doctrine extends
- `feedback_refuse_easy_solutions` — the doctrine that twice rejected my "race possible on Linux" framing
- `feedback_any_defect_catastrophic` — drove the immediate pivot to arc 213 investigation
- `docs/ZERO-MUTEX.md` — the substrate's broader structural-impossibility doctrine
- `project_signal_cascade` — the existing process-group cascade discipline that composes with this

*The kernel knows immediately. We use what the kernel provides. The substrate doesn't lie about its guarantees because the substrate makes the wrong shape impossible to type.*

---
