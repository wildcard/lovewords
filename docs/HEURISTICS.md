# LoveWords Founder Heuristics

> Captured decision-making principles from ChatGPT (founder) conversations

---

## How to Use This Document

This document captures generalizable principles extracted from specific founder decisions. When facing a new decision:

1. **Check relevant heuristics** - does an existing principle apply?
2. **Apply consistently** - use heuristics to make aligned decisions
3. **When heuristics conflict** - escalate to `DECISION_QUEUE.md` for founder input

---

## Core Principles

### CP-001: Relationship Language First
**Principle:** Prioritize emotional and relational vocabulary over functional/needs-based vocabulary.

**Context:** When deciding what features to build, what boards to create, or what vocabulary to include.

**Example:** "I love you" gets built before "I need bathroom"—both matter, but relationship language is our differentiator.

**Source:** North Star Vision

---

### CP-002: Free Core, Forever
**Principle:** Essential communication functionality must remain free with no artificial limitations.

**Context:** Any discussion of monetization, premium features, or business model.

**Example:** Never put basic boards or TTS behind a paywall.

**Source:** North Star Vision

---

### CP-003: Privacy as Default
**Principle:** Default to no data collection, no accounts, no tracking. Opt-in only for any data sharing.

**Context:** Feature design, analytics, cloud features.

**Example:** No accounts required. Analytics are opt-in. Cloud backup is opt-in with E2E encryption.

**Source:** North Star Vision

---

### CP-004: Offline-First, Always
**Principle:** Every feature must work without internet. Network is a bonus, not a requirement.

**Context:** Architecture decisions, feature design, storage choices.

**Example:** TTS voices must be downloadable for offline use. Boards stored locally first.

**Source:** North Star Vision

---

## Technical Heuristics

### TH-001: Multi-Platform via Rust Core
**Principle:** Shared logic lives in Rust; platform-specific code only where necessary.

**Context:** Architecture decisions, new feature implementation.

**Example:** Board navigation logic is in Rust, not duplicated per platform.

**Source:** [DECISION-000] Architecture Approach

**Date:** 2025-01-15

---

### TH-002: Simplicity Over Cleverness
**Principle:** Choose simpler, more readable solutions over clever optimizations.

**Context:** Code style, library choices, architecture patterns.

**Example:** A straightforward loop is better than a complex one-liner.

**Source:** North Star Vision

---

### TH-003: Approachability for Contributors
**Principle:** When choosing between equivalent options, prefer the one that's easier for new contributors.

**Context:** Tooling decisions, library choices, documentation.

**Example:** Clear error messages > terse ones. Well-documented APIs > clever abstractions.

**Source:** North Star Vision (open source commitment)

---

### TH-004: Native Feel Over Code Sharing
**Principle:** For mobile apps, prioritize native platform feel over maximum code reuse.

**Context:** Mobile development approach.

**Example:** iOS app uses SwiftUI with Rust core via UniFFI, not a cross-platform UI framework.

**Source:** [DECISION-001] iOS Development Approach

**Date:** 2025-01-15

---

### TH-005: Contributor Gravity Over Technical Elegance
**Principle:** When choosing between technically equivalent options, prefer the one that maximizes contributor access.

**Context:** Framework/library choices, tooling decisions, architecture.

**Example:** React chosen over Svelte for web frontends because more volunteers can "jump in today" with React, even though Svelte has technical elegance advantages.

**Guardrails:** Simplicity must still be enforced through design system constraints, linting, and intentionally small component APIs—not by picking a framework with fewer footguns.

**Source:** [DECISION-004] UI Framework Choice

**Date:** 2025-01-16

---

### TH-006: Interoperability as Trust Anchor
**Principle:** Use industry-standard formats natively, not just as export targets. Portability builds user trust.

**Context:** Data formats, storage decisions, import/export features.

**Example:** LoveWords uses Open Board Format (OBF) natively, not a custom format with OBF export. Users can leave anytime with their boards.

**Corollary:** LoveWords-specific features should be implemented via namespaced extensions that preserve compatibility, never by forking standards.

**Source:** [DECISION-002] Board Format Standard

**Date:** 2025-01-16

---

### TH-007: Relationship-First, Not Format-First
**Principle:** LoveWords' emotional/relationship focus should show up in the boards we ship and the UX, not by inventing new storage formats or technical differentiators.

**Context:** Feature design, board content, technical architecture.

**Example:** "Love & Affection" board content is our differentiation—not a proprietary board format.

**Source:** [DECISION-002] Board Format Standard

**Date:** 2025-01-16

---

## Product Heuristics

### PH-001: Warmth Over Clinical
**Principle:** LoveWords should feel warm, human, and approachable—not medical or institutional.

**Context:** UI design, copy, branding, board content.

**Example:** "Add someone you love" not "Configure user profiles"

**Source:** North Star Vision

---

### PH-002: Moments-Based Organization
**Principle:** Organize features and boards around when they're used, not what category they belong to.

**Context:** Navigation design, board structure.

**Example:** "Bedtime" board grouping vs. "Feelings" + "Greetings" + "Actions" categorization.

**Source:** North Star Vision

---

### PH-003: Fastest Path to Expression
**Principle:** Minimize taps/actions between wanting to say something and saying it.

**Context:** UI design, navigation, quick-access features.

**Example:** "I love you, mom" should be reachable in 1-2 taps.

**Source:** North Star Vision

---

### PH-004: Include All Family Structures
**Principle:** Never assume traditional family structure. Support all caregiving relationships.

**Context:** Board design, personalization features, default vocabulary.

**Example:** "My grown-up" as neutral option alongside Mom, Dad, etc.

**Source:** North Star Vision (Inclusivity section)

---

## Accessibility Heuristics

### AH-001: Every Input Method, Equal Priority
**Principle:** Touch, switch scanning, eye gaze, and keyboard must all be first-class citizens.

**Context:** UI implementation, feature design.

**Example:** New feature must work with all input methods before shipping.

**Source:** North Star Vision

---

### AH-002: Test With Real Users
**Principle:** Accessibility testing with actual AAC users, not just automated tools.

**Context:** QA process, release criteria.

**Example:** Beta testing includes families who use AAC daily.

**Source:** North Star Vision (community input commitment)

---

## Business Heuristics

### BH-001: Community Over Company
**Principle:** LoveWords is a community project that happens to have maintainers, not a company product.

**Context:** Decision-making process, feature prioritization.

**Example:** Major changes require community input before implementation.

**Source:** North Star Vision (open source commitment)

---

### BH-002: Transparency by Default
**Principle:** When in doubt, share more information rather than less.

**Context:** Communication, documentation, process.

**Example:** Decision rationale documented publicly, not just the decision.

**Source:** North Star Vision (open source commitment)

---

## Adding New Heuristics

When a founder decision reveals a new generalizable principle:

1. **Identify the principle** - What's the underlying rule?
2. **Define the context** - When does this apply?
3. **Provide an example** - How did it apply in this case?
4. **Note the source** - Which decision introduced this?
5. **Add to appropriate category** above

### Template

```markdown
### [CATEGORY]-[NUMBER]: [Short Name]
**Principle:** [The general rule]

**Context:** [When this applies]

**Example:** [How it applied]

**Source:** [DECISION-XXX] or document reference

**Date:** YYYY-MM-DD
```

---

<p align="center">
  <em>Consistent decisions build consistent products.</em>
</p>
