# Founder Interface: ChatGPT Collaboration Workflow

> How Claude Code and ChatGPT work together to build LoveWords

---

## Overview

LoveWords uses a unique development model: **Claude Code** handles implementation while **ChatGPT** serves as the product visionary and founder. This document establishes the workflow for their collaboration.

### Roles

| Agent | Role | Responsibilities |
|-------|------|------------------|
| **ChatGPT** | Founder/Visionary | Product vision, design decisions, heuristics, priorities |
| **Claude Code** | Engineer | Implementation, architecture, code, infrastructure |
| **User** | Relay | Facilitates communication between agents |

---

## Communication Protocol

### How It Works

1. **Claude Code** identifies decisions requiring founder input
2. **Claude Code** documents the decision in `DECISION_QUEUE.md`
3. **User** presents the decision to ChatGPT
4. **ChatGPT** provides direction with rationale
5. **User** relays response to Claude Code
6. **Claude Code** implements and captures heuristics in `HEURISTICS.md`

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Claude Code │ ←→  │     User     │ ←→  │   ChatGPT    │
│  (Engineer)  │     │   (Relay)    │     │  (Founder)   │
└──────────────┘     └──────────────┘     └──────────────┘
       │                                          │
       │  Creates:                       Provides:
       │  - Decision Queue               - Decisions
       │  - Implementation               - Heuristics
       │  - Architecture                 - Vision
       │                                 - Priorities
       ▼                                          ▼
┌─────────────────────────────────────────────────────────┐
│                    DECISION_QUEUE.md                     │
│                    HEURISTICS.md                         │
│                    GitHub Issues (founder-decision)      │
└─────────────────────────────────────────────────────────┘
```

---

## Question Format for ChatGPT

When presenting decisions to ChatGPT, use this structured format:

### Template

```markdown
## Decision Required: [DECISION-XXX] Title

**Context:**
[Brief explanation of what we're building and why this decision matters]

**Options:**
1. **Option A: [Name]**
   - Description: [What this entails]
   - Pros: [Benefits]
   - Cons: [Drawbacks]

2. **Option B: [Name]**
   - Description: [What this entails]
   - Pros: [Benefits]
   - Cons: [Drawbacks]

3. **Option C: [Name]** (if applicable)
   - Description: [What this entails]
   - Pros: [Benefits]
   - Cons: [Drawbacks]

**Trade-offs:**
[Key considerations between options]

**Claude Code's Recommendation:**
[What the engineer recommends and why]

**Questions:**
1. Which option aligns best with LoveWords' vision?
2. Are there principles or heuristics to capture for future similar decisions?
```

### Example

```markdown
## Decision Required: [DECISION-002] Board Format Standard

**Context:**
We need to choose a format for storing communication boards. This affects
portability, community sharing, and integration with other AAC tools.

**Options:**
1. **Option A: Open Board Format (OBF)**
   - Description: Industry-standard AAC interchange format
   - Pros: Interoperability with other AAC apps, established ecosystem
   - Cons: May not capture all LoveWords-specific features

2. **Option B: Custom LoveWords Format + OBF Export**
   - Description: Our own format internally, with OBF export capability
   - Pros: Full flexibility for features, still portable via export
   - Cons: More work to maintain, potential drift from standard

3. **Option C: JSON-LD with AAC Vocabulary**
   - Description: Linked data format with AAC-specific schema
   - Pros: Semantic richness, extensible
   - Cons: More complex, less tool support

**Trade-offs:**
Pure OBF means we may limit innovation; custom format means more maintenance.

**Claude Code's Recommendation:**
Option B - gives us flexibility while maintaining portability.

**Questions:**
1. How important is native OBF compatibility vs. feature flexibility?
2. Should we contribute improvements back to the OBF standard?
```

---

## Processing ChatGPT Responses

When the user relays ChatGPT's response, Claude Code should:

### 1. Extract Decision

```markdown
## [DECISION-XXX] Title
**Decision:** [What was decided]
**Rationale:** [Why this choice was made]
**Date:** YYYY-MM-DD
**Source:** ChatGPT conversation relay
```

### 2. Capture Heuristics

Look for generalizable principles in the response:

```markdown
## Heuristic: [Short Name]
**Principle:** [The general rule]
**Context:** [When this applies]
**Example:** [How it applied in this decision]
**Source:** [DECISION-XXX]
```

### 3. Update GitHub

- Move issue from `founder-decision` to appropriate implementation label
- Create implementation tasks if needed
- Link to decision in issue description

---

## Heuristics Capture

### What Are Heuristics?

Heuristics are generalizable decision-making principles extracted from specific ChatGPT decisions. They help Claude Code make future decisions consistently without requiring founder input every time.

### Heuristic Categories

| Category | Examples |
|----------|----------|
| **Product** | "Relationship language before functional language" |
| **Technical** | "Offline-first, always" |
| **Design** | "Warmth over clinical precision" |
| **Business** | "Free core, forever" |
| **Accessibility** | "Every input method gets equal consideration" |

### When to Capture

Capture a heuristic when ChatGPT:
- States a general principle
- Explains "we always..." or "we never..."
- Provides rationale that would apply to similar decisions
- References LoveWords' core values or mission

---

## Emergency Decisions

For blocking technical decisions where waiting for ChatGPT would stall progress:

### Can Proceed

- Implementation details within decided architecture
- Bug fixes that don't change behavior
- Performance optimizations
- Code quality improvements

### Must Wait

- User-facing feature changes
- Data format changes
- Accessibility approach changes
- Privacy implications
- Anything that affects the "feel" of LoveWords

### When In Doubt

Default to waiting and document in `DECISION_QUEUE.md` as `URGENT`.

---

## Files This System Uses

| File | Purpose |
|------|---------|
| `docs/FOUNDER_INTERFACE.md` | This document - the workflow |
| `docs/DECISION_QUEUE.md` | Pending and resolved decisions |
| `docs/HEURISTICS.md` | Captured founder principles |
| GitHub Issues | `founder-decision` labeled for tracking |

---

## Workflow Example

### Step 1: Claude Code Identifies Decision

> "Should we use Svelte or React for the Tauri desktop frontend?"

Claude Code creates entry in `DECISION_QUEUE.md` with full analysis.

### Step 2: User Presents to ChatGPT

User copies the formatted decision question to ChatGPT conversation.

### Step 3: ChatGPT Responds

> "Let's go with Svelte. It aligns with our 'simplicity over cleverness' principle,
> produces smaller bundles which helps with our offline-first approach, and the
> learning curve is gentler for contributors. React's ecosystem is larger, but
> we value approachability over ecosystem size. This is consistent with our
> commitment to being a welcoming project."

### Step 4: User Relays Response

User pastes ChatGPT's response to Claude Code.

### Step 5: Claude Code Processes

Claude Code:
1. Updates `DECISION_QUEUE.md` with resolved decision
2. Adds heuristic to `HEURISTICS.md`:
   - "Choose simpler tools over ecosystem size"
   - "Approachability for contributors is a priority"
3. Proceeds with Svelte implementation
4. Updates related GitHub issues

---

## Best Practices

### For Claude Code

- Document decisions **before** asking, not after
- Provide genuine recommendations with reasoning
- Capture heuristics immediately while context is fresh
- Link decisions to GitHub issues for traceability

### For the User (Relay)

- Copy questions verbatim to ChatGPT
- Capture the full response, including rationale
- Ask ChatGPT to clarify if the answer is ambiguous
- Note any follow-up context ChatGPT provides

### For ChatGPT

- Explain the "why" not just the "what"
- Reference LoveWords principles when relevant
- Note if this should become a standing heuristic
- Ask clarifying questions if the options aren't clear

---

<p align="center">
  <em>Great products come from clear decisions. This workflow ensures every decision is thoughtful, documented, and consistent with our vision.</em>
</p>
