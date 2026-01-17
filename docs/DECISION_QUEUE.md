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
- Chrome Extension: WebAssembly via wasm-pack + React
- Desktop: Tauri with React frontend

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

### [DECISION-002] Board Format Standard

**Status:** RESOLVED
**Decision Date:** 2025-01-16
**Decided By:** ChatGPT (founder) via Claude Code relay

**Decision:**
Adopt Open Board Format (OBF) natively. LoveWords-specific features implemented via namespaced extensions that preserve compatibility (e.g., `lovewords:*` metadata), not by replacing OBF.

**Rationale:**
- **Interoperability is the trust anchor.** Families and clinicians are wary of lock-in. "You can leave anytime with your boards" is a core promise.
- **We're relationship-first, not format-first.** The emotional/relationship focus should show up in the boards we ship and the UX, not by inventing a new storage format.
- **OBF reduces adoption friction.** Importing existing boards (or building from existing ecosystems) is a force multiplier for early users.
- **Future community library depends on portability.** If people share boards, they should work elsewhere too.

**How we handle relationship-focused features without breaking OBF:**
- Use namespaced optional metadata (`lovewords:*`) to store features like:
  - "moments" grouping (bedtime, apology, comfort)
  - warmth/intent tags (affection, gratitude, reassurance)
  - suggested phrases / quick-say variants
- Never require LoveWords-only fields to render or speak a board
- Keep export/import "round-trippable" within LoveWords while remaining valid OBF

**Implementation Changes:**
- Storage layer uses OBF structures as the source of truth
- Starter boards are authored as OBF (with optional LoveWords metadata)
- Export is straightforward (already OBF); import is first-class

**OBF Compatibility Contract:**
- We are OBF-native
- LoveWords metadata is optional and namespaced
- We will not introduce breaking schema forks

---

### [DECISION-004] UI Framework — Choose React

**Status:** RESOLVED
**Decision Date:** 2025-01-16
**Decided By:** ChatGPT (founder) via Claude Code relay

**Decision:**
Use React for the LoveWords desktop app (Tauri) and Chrome extension.

**Rationale:**
- **Contributor gravity matters more than bundle size right now.** LoveWords lives or dies by community contribution (boards, UI accessibility, localization, caregivers/SLPs). React lowers the "can jump in today" barrier.
- **Accessibility + extension + desktop patterns are well-trodden.** React has a large body of examples and battle-tested patterns for keyboard navigation, focus management, and complex component state—exactly where AAC UIs get tricky.
- **Our simplicity is a product principle, not a framework choice.** "Simplicity over cleverness" should be enforced via design system constraints, linting/conventions, and an intentionally small component API—not by picking a framework with fewer footguns.
- **Risk management.** Svelte is great, but React reduces the chance we get stuck on a niche integration or lose momentum because fewer volunteers feel confident touching core UI code.

**Guardrails to preserve simplicity (non-negotiables):**
- Limit dependencies; no "framework-of-the-week" layering
- Keep state local and boring; avoid clever abstractions
- Prefer plain components over meta-framework patterns unless needed
- Accessibility acceptance criteria per feature: keyboard-first, predictable focus, clear semantics

**Implementation Changes:**
- Update ARCHITECTURE.md to reflect React as the committed choice
- Remove "pending decision" language
- Tauri desktop: React frontend
- Chrome extension: React-based popup/content UI

**Heuristics Captured:**
- TH-005: Contributor Gravity Over Technical Elegance

---

## Decision Log (Chronological)

| ID | Title | Status | Date | Outcome |
|----|-------|--------|------|---------|
| DECISION-000 | Multi-Platform Architecture | RESOLVED | 2025-01-15 | Rust core + native clients |
| DECISION-001 | iOS Development Approach | RESOLVED | 2025-01-15 | Pure Swift + UniFFI |
| DECISION-001.1 | First Client to Build | RESOLVED | 2025-01-15 | Tauri desktop first |
| DECISION-002 | Board Format Standard | RESOLVED | 2025-01-16 | OBF-native with namespaced extensions |
| DECISION-003 | Voice Recording Storage | PENDING | 2025-01-15 | - |
| DECISION-004 | UI Framework Choice | RESOLVED | 2025-01-16 | React (contributor gravity) |
| DECISION-005 | Commercial Use Cases | PENDING | 2025-01-15 | - |

---

<p align="center">
  <em>Good decisions, well documented, create great products.</em>
</p>
