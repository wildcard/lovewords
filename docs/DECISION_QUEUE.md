# LoveWords Decision Queue

> Decisions pending founder (ChatGPT) input and resolved decisions log

---

## How to Use This Document

**Claude Code:** Add decisions here when founder input is needed. Use the template below.

**User (Relay):** Present pending decisions to ChatGPT using the formatted question.

**After Resolution:** Move decisions to the Resolved section with rationale.

---

## Pending Decisions

<!-- Decisions awaiting ChatGPT input -->

### [DECISION-002] Board Format Standard

**Status:** PENDING_FOUNDER
**Priority:** HIGH
**Created:** 2025-01-15
**Blocking:** Board implementation in Rust core

**Context:**
We need to choose a format for storing communication boards. This affects portability, community sharing, and integration with other AAC tools.

**Options:**

1. **Option A: Open Board Format (OBF)**
   - Description: Industry-standard AAC interchange format (.obz/.obf files)
   - Pros: Interoperability with TouchChat, Proloquo2Go, CoughDrop, and other AAC apps
   - Cons: May not capture all LoveWords-specific features; format is XML-based

2. **Option B: Custom JSON Format + OBF Export**
   - Description: Our own JSON format internally, with OBF export/import capability
   - Pros: Full flexibility for LoveWords features, still portable via export
   - Cons: More work to maintain both formats

3. **Option C: OBF as Primary with Extensions**
   - Description: Use OBF natively but extend it with LoveWords-specific fields
   - Pros: Best of both worlds—compatible and extensible
   - Cons: Extensions may not transfer to other apps

**Trade-offs:**
Pure OBF limits innovation in board structure. Custom format risks fragmentation. Extensions balance both but add complexity.

**Claude Code's Recommendation:**
Option C - OBF as primary with documented extensions. This maximizes interoperability while allowing innovation. Extensions that prove useful could be proposed to the OBF standard.

**Questions for ChatGPT:**
1. How important is native OBF compatibility vs. feature flexibility?
2. Should LoveWords aim to influence/extend the OBF standard?

---

### [DECISION-003] Voice Recording Storage

**Status:** PENDING_FOUNDER
**Priority:** MEDIUM
**Created:** 2025-01-15
**Blocking:** Voice recording feature design

**Context:**
LoveWords allows recording personal voice messages (mom's voice saying "I love you"). Need to decide storage approach.

**Options:**

1. **Option A: Local-Only**
   - Description: Recordings stored only on device, no cloud
   - Pros: Maximum privacy, simple, works offline
   - Cons: Lost if device is lost/replaced, no sharing between devices

2. **Option B: Optional Encrypted Cloud Backup**
   - Description: Local by default, opt-in E2E encrypted cloud backup
   - Pros: Recovery possible, sync between devices, still private
   - Cons: More infrastructure, requires account for backup

3. **Option C: Local + Manual Export**
   - Description: Local storage with easy export to files/email
   - Pros: User-controlled backup, no cloud infrastructure needed
   - Cons: Manual process, less seamless

**Trade-offs:**
Privacy vs. data safety vs. convenience.

**Claude Code's Recommendation:**
Option C for v1.0, with Option B as future enhancement. Keeps initial scope simple while preserving privacy.

**Questions for ChatGPT:**
1. Is cloud backup important enough to build infrastructure for?
2. How do we balance "don't lose precious recordings" with "no accounts required"?

---

### [DECISION-004] Svelte vs React for Web Frontends

**Status:** PENDING_FOUNDER
**Priority:** MEDIUM
**Created:** 2025-01-15
**Blocking:** Tauri and Chrome extension development

**Context:**
Need to choose a frontend framework for Tauri desktop app and Chrome extension.

**Options:**

1. **Option A: Svelte**
   - Description: Lightweight, compiler-based framework
   - Pros: Smaller bundles, simpler mental model, less boilerplate, growing community
   - Cons: Smaller ecosystem than React, fewer pre-built components

2. **Option B: React**
   - Description: Established component library framework
   - Pros: Huge ecosystem, many AAC-specific components exist, more developers know it
   - Cons: Larger bundles, more boilerplate, heavier runtime

3. **Option C: Solid.js**
   - Description: React-like API with Svelte-like compilation
   - Pros: Best of both worlds technically, fine-grained reactivity
   - Cons: Smallest ecosystem of the three, newer

**Trade-offs:**
Ecosystem size vs. simplicity. Contributor familiarity vs. new contributor learning curve.

**Claude Code's Recommendation:**
Option A (Svelte) - aligns with "simplicity over cleverness" heuristic, produces smaller offline-first bundles, and the simpler mental model helps new contributors.

**Questions for ChatGPT:**
1. Does ecosystem size or simplicity matter more for LoveWords?
2. Is React familiarity among potential contributors a significant factor?

---

### [DECISION-005] Commercial Use Case Expansion

**Status:** PENDING_FOUNDER
**Priority:** LOW
**Created:** 2025-01-15
**Blocking:** Nothing immediate

**Context:**
LoveWords is designed for family AAC use. Should we also design for commercial/workplace contexts?

**Options:**

1. **Option A: Family-Only Focus**
   - Description: Keep scope to personal/family communication
   - Pros: Clear focus, simpler product
   - Cons: Limits potential impact

2. **Option B: Family + Workplace**
   - Description: Also support neurodiverse employees in workplace settings
   - Pros: Broader impact, potential sustainability through enterprise
   - Cons: Risk of scope creep, different user needs

3. **Option C: Family First, Workplace Later**
   - Description: Nail family use case first, consider workplace as v2.0
   - Pros: Focused start, clear path for growth
   - Cons: May miss early design decisions that would help workplace later

**Trade-offs:**
Focus vs. breadth. Sustainability vs. mission purity.

**Questions for ChatGPT:**
1. Should LoveWords ever target workplace/commercial use?
2. What's the relationship between family AAC and workplace accessibility?

---

## Resolved Decisions

<!-- Decisions that have been made -->

### [DECISION-000] Multi-Platform Architecture Approach

**Status:** RESOLVED
**Decision Date:** 2025-01-15
**Decided By:** ChatGPT (founder) via planning conversation

**Decision:**
Use Rust core with native clients for each platform:
- iOS/iPadOS/watchOS: Swift + SwiftUI with UniFFI bindings
- macOS: Swift + SwiftUI with UniFFI bindings
- Chrome Extension: WebAssembly via wasm-pack + Svelte
- Desktop: Tauri with Svelte frontend

**Rationale:**
- Rust provides memory-safe, performant core logic that can run anywhere
- Native clients ensure best platform integration and accessibility
- Shared core prevents logic duplication and ensures consistency

**Heuristics Captured:**
- TH-001: Multi-Platform via Rust Core

---

### [DECISION-001] iOS Development Approach

**Status:** RESOLVED
**Decision Date:** 2025-01-15
**Decided By:** ChatGPT (founder) via planning conversation

**Decision:**
Pure Swift + SwiftUI with Rust core via UniFFI bindings (not Flutter or React Native).

**Rationale:**
- Best accessibility support on iOS comes from native frameworks
- SwiftUI provides natural platform integration
- Rust core via UniFFI gives us shared logic without sacrificing native feel

**Heuristics Captured:**
- TH-004: Native Feel Over Code Sharing

---

### [DECISION-001.1] First Client to Build

**Status:** RESOLVED
**Decision Date:** 2025-01-15
**Decided By:** ChatGPT (founder) via planning conversation

**Decision:**
Tauri desktop app (macOS first, then Windows/Linux) before mobile clients.

**Rationale:**
- Fastest path to working product
- Lower barrier for iterating on core + UI together
- Easier to test accessibility features
- macOS users can test while iOS app is in development

**Build Sequence:**
1. Rust Core (lovewords-core)
2. Tauri Desktop (macOS/Windows/Linux)
3. iOS/iPadOS
4. watchOS companion
5. macOS native (SwiftUI)
6. Chrome Extension

---

## Decision Log (Chronological)

| ID | Title | Status | Date | Outcome |
|----|-------|--------|------|---------|
| DECISION-000 | Multi-Platform Architecture | RESOLVED | 2025-01-15 | Rust core + native clients |
| DECISION-001 | iOS Development Approach | RESOLVED | 2025-01-15 | Pure Swift + UniFFI |
| DECISION-001.1 | First Client to Build | RESOLVED | 2025-01-15 | Tauri desktop first |
| DECISION-002 | Board Format Standard | PENDING | 2025-01-15 | - |
| DECISION-003 | Voice Recording Storage | PENDING | 2025-01-15 | - |
| DECISION-004 | Web Framework Choice | PENDING | 2025-01-15 | - |
| DECISION-005 | Commercial Use Cases | PENDING | 2025-01-15 | - |

---

<p align="center">
  <em>Good decisions, well documented, create great products.</em>
</p>
