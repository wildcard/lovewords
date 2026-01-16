# LoveWords Development Roadmap

> From vision to "I love you, mom" on every device

---

## Overview

This roadmap outlines the path from documentation-only to a fully functional multi-platform AAC application. Each phase builds on the previous, with clear deliverables and success criteria.

```
Current State: 3,000+ lines of vision/design docs, zero code
Target State: Working AAC app on desktop, iOS, Chrome, with full accessibility
```

---

## Phase 1: Foundation (Rust Core)

**Focus:** Build the shared logic that powers all clients

**Milestone:** v0.1 - Core Engine

### Deliverables

- [ ] Initialize Cargo workspace with `lovewords-core` crate
- [ ] Define Board and Cell data structures
- [ ] Implement board JSON serialization/deserialization
- [ ] Create storage trait for platform-agnostic persistence
- [ ] Define Speech trait for TTS abstraction
- [ ] Build input event system
- [ ] Create navigation logic (cell selection, board switching)
- [ ] First starter boards as JSON (Love & Affection)
- [ ] Unit tests for all core logic
- [ ] Documentation with rustdoc

### Crate Structure

```
lovewords-core/
├── Cargo.toml
├── src/
│   ├── lib.rs              # Public API
│   ├── board/              # Board model
│   │   ├── mod.rs
│   │   ├── cell.rs
│   │   ├── layout.rs
│   │   └── navigation.rs
│   ├── speech/             # TTS abstraction
│   │   ├── mod.rs
│   │   ├── trait.rs
│   │   └── recording.rs
│   ├── storage/            # Persistence
│   │   ├── mod.rs
│   │   ├── profile.rs
│   │   └── export.rs
│   ├── input/              # Input system
│   │   ├── mod.rs
│   │   ├── event.rs
│   │   └── scanning.rs
│   ├── accessibility/      # A11y utilities
│   │   └── mod.rs
│   └── symbols/            # Symbol registry
│       ├── mod.rs
│       └── registry.rs
└── tests/
```

### Success Criteria

- [ ] `cargo build` succeeds
- [ ] `cargo test` passes with >80% coverage on core logic
- [ ] Board can be loaded, navigated, and serialized
- [ ] Speech trait defined with clear platform hook points

---

## Phase 2: First Client (Tauri Desktop)

**Focus:** Proof of concept with working UI

**Milestone:** v0.2 - First Client

### Deliverables

- [ ] Initialize Tauri project with React frontend
- [ ] Integrate lovewords-core via Tauri's Rust backend
- [ ] Build board rendering component
- [ ] Implement cell selection and message bar
- [ ] Add TTS using system voices
- [ ] Create basic settings panel
- [ ] Package for macOS (.dmg)
- [ ] Test with keyboard navigation

### Architecture

```
lovewords-tauri/
├── src-tauri/
│   ├── Cargo.toml          # Depends on lovewords-core
│   ├── src/
│   │   ├── main.rs
│   │   ├── commands.rs     # Tauri commands
│   │   └── tts.rs          # Platform TTS
│   └── tauri.conf.json
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── Board.tsx
│   │   ├── Cell.tsx
│   │   ├── MessageBar.tsx
│   │   └── Settings.tsx
│   └── lib/
│       └── tauri-bridge.ts
└── package.json
```

### Success Criteria

- [ ] User can open app, see a board, tap cells
- [ ] Message bar shows selected phrases
- [ ] Speak button plays TTS
- [ ] Basic keyboard navigation works
- [ ] App runs offline

---

## Phase 3: Apple Platform

**Focus:** Native iOS experience with full accessibility

**Milestone:** v0.3 - iOS MVP

### Deliverables

- [ ] Set up Xcode project with Swift Package Manager
- [ ] Generate UniFFI bindings from lovewords-core
- [ ] Build SwiftUI board view
- [ ] Implement AVSpeechSynthesis for TTS
- [ ] Add VoiceOver support
- [ ] Create Switch Control compatibility
- [ ] Design for iPad as primary device
- [ ] iPhone companion app
- [ ] TestFlight beta distribution

### Architecture

```
lovewords-apple/
├── LoveWords.xcodeproj
├── Shared/                 # Shared code
│   ├── LoveWordsCore/      # UniFFI Swift bindings
│   ├── Views/
│   │   ├── BoardView.swift
│   │   ├── CellView.swift
│   │   └── MessageBarView.swift
│   ├── Services/
│   │   ├── SpeechService.swift
│   │   └── StorageService.swift
│   └── Models/
├── iOS/                    # iOS-specific
├── iPadOS/                 # iPad-specific
└── watchOS/                # Apple Watch
```

### Success Criteria

- [ ] VoiceOver announces all elements correctly
- [ ] Switch Control can navigate entire app
- [ ] TTS speaks with natural voice
- [ ] Works offline completely
- [ ] Installs via TestFlight

---

## Phase 4: Accessibility Deep Dive

**Focus:** Full accessibility for all input methods

**Milestone:** v0.4 - Accessibility

### Deliverables

- [ ] Switch scanning with configurable timing
- [ ] Eye gaze integration (research phase)
- [ ] High contrast themes
- [ ] Large text support (Dynamic Type on iOS)
- [ ] Reduced motion mode
- [ ] Screen reader optimization audit
- [ ] User testing with AAC users
- [ ] Accessibility documentation

### Key Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Switch Scanning | Row-column, linear, and group scanning | P0 |
| Dwell Click | Hold to select for head/eye tracking | P0 |
| Timing Adjustments | Configurable scan speed, dwell time | P0 |
| High Contrast | WCAG AAA color contrast | P0 |
| Large Targets | Minimum 44pt touch targets | P0 |
| Eye Gaze | Integration with Tobii, etc. | P1 |

### Success Criteria

- [ ] 3 AAC users complete usability testing successfully
- [ ] All WCAG 2.1 AA criteria met
- [ ] Switch scanning works reliably
- [ ] At least one eye gaze system integrated

---

## Phase 5: Chrome Extension

**Focus:** Browser-based access for Chromebooks and shared devices

**Milestone:** v0.5 - Chrome Extension

### Deliverables

- [ ] WebAssembly build of lovewords-core
- [ ] Chrome extension manifest v3
- [ ] React popup UI
- [ ] Content script for on-page communication
- [ ] Keyboard shortcuts
- [ ] Chromebook accessibility testing
- [ ] Chrome Web Store submission

### Architecture

```
lovewords-chrome/
├── manifest.json
├── src/
│   ├── popup/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── content/
│   │   └── content.ts
│   ├── background/
│   │   └── service-worker.ts
│   └── wasm/
│       └── lovewords_core.wasm
├── public/
└── vite.config.ts
```

### Success Criteria

- [ ] Extension installs from Chrome Web Store
- [ ] Works offline (service worker)
- [ ] Chromebook keyboard/switch navigation works
- [ ] Popup is usable at minimum 300px width

---

## Phase 6: Family Ready

**Focus:** Polish, personalization, and first public release

**Milestone:** v1.0 - Family Ready

### Deliverables

- [ ] All 6 starter boards implemented
- [ ] "My People" photo personalization
- [ ] Voice recording feature
- [ ] Profile management (multiple users per device)
- [ ] Board import/export (OBF compatible, pending [DECISION-002])
- [ ] Onboarding flow
- [ ] Help documentation
- [ ] Marketing site
- [ ] App Store submission (iOS)
- [ ] Public launch

### Starter Boards

| Board | Status |
|-------|--------|
| Love & Affection | Phase 1 |
| Gratitude & Appreciation | Phase 6 |
| Comfort & Reassurance | Phase 6 |
| Apology & Repair | Phase 6 |
| Missing Someone | Phase 6 |
| Moments (Bedtime, Goodbye, etc.) | Phase 6 |

### Success Criteria

- [ ] 10 families using daily for 2+ weeks
- [ ] App Store rating ≥4.5
- [ ] Zero critical bugs
- [ ] <2s cold start time
- [ ] Works fully offline

---

## Future Phases (Post-1.0)

### v1.1 - Community
- Community board library
- Board sharing/remixing
- Contributor recognition

### v1.2 - Intelligence
- Word prediction
- Frequent phrase learning
- Context-aware suggestions (all local)

### v1.3 - Integration
- Open Board Format improvements
- External switch Bluetooth pairing
- Smart home integration

### v2.0 - Platform
- Android support
- Wear OS
- Web app (full PWA)

---

## Timeline Visualization

```
         Phase 1        Phase 2         Phase 3        Phase 4
         ═══════        ═══════         ═══════        ═══════
         Rust Core      Tauri           iOS            A11y
            │              │               │              │
            ▼              ▼               ▼              ▼
┌──────────────────────────────────────────────────────────────────┐
│ ██████████ ▓▓▓▓▓▓▓▓▓▓ ░░░░░░░░░░ ░░░░░░░░░░ ░░░░░░░░░░ ░░░░░░░░░░│
│ v0.1       v0.2        v0.3        v0.4        v0.5       v1.0   │
└──────────────────────────────────────────────────────────────────┘
                                                   ▲          ▲
                                                   │          │
                                              Chrome      Family
                                              Ext.        Ready
```

---

## Contributing

Each phase has GitHub issues labeled by milestone. Look for:
- `good-first-issue` - Great starting points
- `help-wanted` - We need community help
- `core-rust` - Rust core work
- `accessibility` - A11y features

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

<p align="center">
  <em>Every phase brings us closer to helping families connect.</em>
</p>
