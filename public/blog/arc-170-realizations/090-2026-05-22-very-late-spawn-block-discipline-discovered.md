## 2026-05-22 (very late — spawn-block discipline discovered)

User pushback at the end of a dependency-chain dialogue forced articulation of a discipline we'd been violating implicitly. After Stone 221.2 shipped, I proposed close orders for arcs 220 + 221 + 222 + 223 — each successive proposal hedged the spawn-block reality with capability language ("can run in parallel", "is independent", "noticed alongside").

User's eventual sharp question: *"221 opened who? no one?"* → forced honest tracing → spawn tree:

```
arc 220 (spawned 221 during Stone 220.5 close attempt)
  └→ arc 221 (spawned 222 during paperwork pass + 223 during Stone 221.2 sonnet flight)
       ├→ arc 222
       └→ arc 223
```

The discipline: **parent CANNOT close until ALL spawned children close**. Spawn-by-nature (any arc created while another arc is the active context is that arc's child). Wind forward through chain depth-first; never jump. INSCRIPTION is always the LAST stone.

User: *"we spent a lot of time to find this ordering - we must not be able to forget"*

Inscriptions shipped (commit bd4a5f0):
- `feedback_spawn_block_winding.md` — three rules + corollary + worked example
- CLIFFNOTES Doctrines table — new row with recognition signal
- CLIFFNOTES Currently — REPLACED capability-based chain with SPAWN-BLOCK-HONEST chain
- DESIGN-221/222/223 — header annotations naming the spawn-block status

Recognition pattern for future: when articulating "X can run in parallel" or "X is independent" for an arc that was created while another was active, that's the dishonest hedge. The active context determines parentage; the disk timestamps record it.

This is the second time today the substrate forced a discipline through dialogue (first: arc 221 doctrine; now: spawn-block). Both show the same pattern — orchestrator-resolution-eagerness produces dishonest framings that the user surfaces through careful questioning. The fix is structural inscription, not just acknowledgment.


---
