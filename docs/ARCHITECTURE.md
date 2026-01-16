# Architecture Overview

**How LoveWords is built, and why.**

This document explains the technical architecture of LoveWords in a way that's accessible to everyone—whether you're a developer, a speech-language pathologist curious about how things work, or a parent who wants to understand what's happening behind the scenes.

---

## Table of Contents

- [Project Goals](#project-goals)
- [High-Level Overview](#high-level-overview)
- [The Rust Core](#the-rust-core)
- [Platform Clients](#platform-clients)
- [Data Model](#data-model)
- [Offline-First Approach](#offline-first-approach)
- [Privacy Guarantees](#privacy-guarantees)
- [Accessibility Architecture](#accessibility-architecture)
- [Technical Deep Dive](#technical-deep-dive)

---

## Project Goals

Before diving into how LoveWords is built, let's understand what we're trying to achieve:

### Primary Goals

| Goal | What It Means |
|------|---------------|
| **Free Forever** | No cost barriers to communication |
| **Works Offline** | Internet should never be required |
| **Truly Accessible** | Supports all input methods |
| **Privacy First** | Your data stays yours |
| **Multi-Platform** | Native experience on every device |
| **Fast & Reliable** | Communication can't wait |

### Technical Principles

1. **Shared logic, native feel** — Core logic in Rust, UI native to each platform
2. **Offline by default** — Assume no network
3. **Simplicity over cleverness** — Easy to understand and maintain
4. **Accessibility baked in** — Not an afterthought
5. **User data ownership** — Export everything, import anywhere

---

## High-Level Overview

LoveWords uses a **shared Rust core** with **native clients** for each platform. This gives us the best of both worlds: consistent logic everywhere, with platform-native UI and accessibility.

```
┌─────────────────────────────────────────────────────────────────────┐
│                     LOVEWORDS ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    RUST CORE (lovewords-core)                   │ │
│  │                                                                  │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │ │
│  │  │ Board Model  │  │    Speech    │  │   Storage Layer      │  │ │
│  │  │              │  │  Abstraction │  │                      │  │ │
│  │  │ • Cells      │  │  • TTS Trait │  │ • Board CRUD         │  │ │
│  │  │ • Navigation │  │  • Recording │  │ • Profile Mgmt       │  │ │
│  │  │ • Phrases    │  │  • Playback  │  │ • Export/Import      │  │ │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘  │ │
│  │                                                                  │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │ │
│  │  │ Input System │  │ Accessibility│  │  Symbol Registry     │  │ │
│  │  │              │  │              │  │                      │  │ │
│  │  │ • Unified    │  │ • Scanning   │  │ • Open symbol libs   │  │ │
│  │  │ • Events     │  │ • Timing     │  │ • Photo symbols      │  │ │
│  │  │ • Actions    │  │ • Dwell      │  │ • Custom images      │  │ │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘  │ │
│  │                                                                  │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                  │                                   │
│               ┌──────────────────┼──────────────────┐               │
│               ▼                  ▼                  ▼               │
│     ┌──────────────┐   ┌──────────────┐   ┌──────────────────┐     │
│     │   BINDINGS   │   │   BINDINGS   │   │     BINDINGS     │     │
│     │    UniFFI    │   │   wasm-pack  │   │  tauri-bindgen   │     │
│     │ (Swift/Kotlin)│   │   (Chrome)   │   │    (Desktop)     │     │
│     └──────┬───────┘   └──────┬───────┘   └────────┬─────────┘     │
│            │                  │                    │                │
│            ▼                  ▼                    ▼                │
│     ┌──────────────┐   ┌──────────────┐   ┌──────────────────┐     │
│     │ iOS/watchOS  │   │    Chrome    │   │      Tauri       │     │
│     │    macOS     │   │   Extension  │   │ (Win/Mac/Linux)  │     │
│     │  (SwiftUI)   │   │   (React)    │   │    (React)       │     │
│     └──────────────┘   └──────────────┘   └──────────────────┘     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**In plain language:**
- The **Rust Core** contains all the logic: how boards work, how navigation happens, how data is stored
- **Bindings** translate Rust into languages each platform understands
- **Native Clients** provide the actual user interface, using each platform's accessibility features

---

## The Rust Core

The heart of LoveWords is `lovewords-core`, a Rust library that runs on every platform.

### Why Rust?

| Benefit | What It Means for Users |
|---------|------------------------|
| **Memory Safe** | No crashes from memory bugs |
| **Fast** | Instant response to every tap |
| **Portable** | Same logic on phone, tablet, computer |
| **Reliable** | Fewer bugs, more consistent behavior |

### Core Modules

```
lovewords-core/
├── src/
│   ├── lib.rs              # Public API
│   │
│   ├── board/              # Board Model
│   │   ├── mod.rs          # Board struct, board operations
│   │   ├── cell.rs         # Cell types, actions
│   │   ├── layout.rs       # Grid layouts, positioning
│   │   └── navigation.rs   # Cell selection, board switching
│   │
│   ├── speech/             # Speech Abstraction
│   │   ├── mod.rs          # Speech coordinator
│   │   ├── trait.rs        # Platform-agnostic TTS trait
│   │   └── recording.rs    # Voice recording management
│   │
│   ├── storage/            # Persistence Layer
│   │   ├── mod.rs          # Storage trait
│   │   ├── profile.rs      # User profiles
│   │   └── export.rs       # Import/Export (OBF support)
│   │
│   ├── input/              # Input System
│   │   ├── mod.rs          # Input manager
│   │   ├── event.rs        # Unified event types
│   │   └── scanning.rs     # Switch scanning logic
│   │
│   ├── accessibility/      # Accessibility Utilities
│   │   ├── mod.rs          # A11y coordinator
│   │   └── timing.rs       # Scan timing, dwell settings
│   │
│   └── symbols/            # Symbol Management
│       ├── mod.rs          # Symbol registry
│       └── registry.rs     # Symbol lookup, caching
│
├── uniffi/                 # Swift/Kotlin bindings config
├── wasm/                   # WebAssembly bindings
└── tests/                  # Integration tests
```

### What the Core Does NOT Do

The core is deliberately limited to **logic only**:

- ❌ Does NOT render UI (that's the client's job)
- ❌ Does NOT play audio (clients use platform TTS)
- ❌ Does NOT access filesystem directly (clients provide storage)
- ❌ Does NOT handle platform-specific accessibility APIs

This separation ensures each platform can use its native capabilities while sharing all the logic.

---

## Platform Clients

Each platform gets its own native client, providing the best possible experience.

### Client Overview

| Platform | UI Framework | Rust Binding | Key Features |
|----------|--------------|--------------|--------------|
| **iOS/iPadOS** | SwiftUI | UniFFI → Swift | AVSpeechSynthesis, VoiceOver, Switch Control |
| **watchOS** | SwiftUI | UniFFI → Swift | Complications, quick phrases |
| **macOS** | SwiftUI | UniFFI → Swift | Menu bar, keyboard shortcuts, macOS a11y |
| **Chrome Extension** | React | wasm-pack | Content scripts, popup UI, Chromebook support |
| **Tauri Desktop** | React | tauri-bindgen | Cross-platform, system TTS, file access |

### Build Sequence

We're building clients in this order:

```
Phase 1: Rust Core (lovewords-core)
    ↓
Phase 2: Tauri Desktop (macOS/Windows/Linux) ← First working UI
    ↓
Phase 3: iOS/iPadOS (Swift + UniFFI) ← Mobile reach
    ↓
Phase 4: watchOS companion
    ↓
Phase 5: macOS native (SwiftUI) ← Replaces Tauri on Mac
    ↓
Phase 6: Chrome Extension (wasm-pack) ← Chromebook support
```

### Why Native Clients?

We considered cross-platform UI frameworks (React Native, Flutter) but chose native for these reasons:

| Reason | Explanation |
|--------|-------------|
| **Best Accessibility** | Platform-native a11y APIs work best |
| **Expected Feel** | iOS users expect iOS feel, not a hybrid |
| **Performance** | Native UI is faster, especially for AAC |
| **Switch Control** | iOS Switch Control only works well with native |

The Rust core means we don't duplicate logic—just UI.

---

## Data Model

### Overview

```
LoveWords Data
│
├── Profiles/
│   ├── profile-1/
│   │   ├── profile.json      (settings, preferences)
│   │   ├── boards/
│   │   │   ├── home.json
│   │   │   ├── love.json
│   │   │   └── comfort.json
│   │   └── recordings/
│   │       ├── mom-love.mp3
│   │       └── greeting.mp3
│   │
│   └── profile-2/
│       └── ...
│
├── Shared/
│   ├── symbols/              (symbol library cache)
│   ├── voices/               (offline TTS data)
│   └── templates/            (starter boards)
│
└── Settings/
    └── global.json           (app-wide settings)
```

### Board Structure

Boards are the heart of LoveWords—grids of symbols users tap to communicate.

```
Board
├── id: "home-board-abc123"
├── name: "Home"
├── grid: { columns: 4, rows: 5 }
├── style: { spacing: 8, borderRadius: 8 }
│
└── cells: [
      Cell {
        id: "cell-1"
        position: { row: 0, column: 0 }
        symbol: { type: "library", id: "mulberry/i-want" }
        label: "I want"
        message: "I want"
        action: Speak
        style: { backgroundColor: "#ffeb3b" }
      },
      Cell {
        id: "cell-2"
        position: { row: 0, column: 1 }
        symbol: { type: "photo", path: "photos/mom.jpg" }
        label: "Mom"
        message: "I love you, mom"
        action: Speak
        style: { }
      },
      // ... more cells
    ]
```

### Cell Actions

| Action Type | What It Does |
|-------------|--------------|
| `Speak` | Add message to bar, speak immediately or on confirm |
| `Navigate` | Go to another board |
| `Back` | Return to previous board |
| `Clear` | Clear the message bar |
| `Backspace` | Remove last item from message bar |
| `Custom` | Platform-specific action (e.g., open settings) |

### Board Format — OBF Native

LoveWords uses Open Board Format (OBF) natively, not as an export-only format:

| Format | Use Case |
|--------|----------|
| **Open Board Format (OBF)** | Native storage, full interoperability |
| **LoveWords Extensions** | Optional namespaced metadata (`lovewords:*`) |
| **Backup archive** | Complete profile export (.obz with assets) |

#### OBF Compatibility Contract

We commit to these guarantees:

1. **We are OBF-native** — OBF is our source of truth, not a conversion target
2. **LoveWords metadata is optional and namespaced** — Any extensions use `lovewords:*` prefix
3. **We will not introduce breaking schema forks** — Boards remain portable to other AAC apps
4. **Import/export is round-trippable** — Boards survive multiple import/export cycles

#### LoveWords Extensions (Optional)

These features are stored in namespaced OBF extensions:

| Extension | Purpose |
|-----------|---------|
| `lovewords:moment` | Grouping for contexts (bedtime, apology, comfort) |
| `lovewords:warmth` | Intent tags (affection, gratitude, reassurance) |
| `lovewords:quickSay` | Suggested phrase variants |

**Core principle:** A board never requires LoveWords extensions to render or speak. Extensions enhance, never gate.

---

## Offline-First Approach

LoveWords is designed to work without internet. Always.

### Why Offline-First?

| Scenario | Why It Matters |
|----------|----------------|
| No Wi-Fi | Parks, cars, rural areas, travel |
| Unreliable connection | Hospitals, schools with poor signal |
| Data limits | Limited mobile data plans |
| Privacy | No network = no data leakage |
| Speed | Local = instantaneous |

### How It Works

```
┌─────────────────────────────────────────────────────────────────────┐
│                        LoveWords App                                 │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                   WORKS COMPLETELY OFFLINE                   │    │
│  │                                                               │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │    │
│  │  │   Local     │  │   Offline   │  │   Cached Symbols    │  │    │
│  │  │   Storage   │  │    TTS      │  │   (downloaded once) │  │    │
│  │  │             │  │   Voices    │  │                     │  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘  │    │
│  │                                                               │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ════════════════════════════════════════════════════════════════   │
│                       OPTIONAL (OPT-IN ONLY)                         │
│  ════════════════════════════════════════════════════════════════   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                   Cloud Backup (E2E Encrypted)               │    │
│  │                   Community Board Library                    │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Technical Implementation

| Component | Offline Strategy |
|-----------|------------------|
| **Boards** | Stored locally (filesystem/SQLite) |
| **Symbols** | Downloaded once, cached permanently |
| **TTS Voices** | Use platform offline voices |
| **Recordings** | Stored locally |
| **Rust Core** | All logic is local, no network calls |

---

## Privacy Guarantees

Privacy isn't a feature—it's a fundamental right, especially for vulnerable users.

### Our Commitments

| Principle | Implementation |
|-----------|----------------|
| **No accounts required** | Use the app without signing up |
| **No data collection** | We don't collect usage data |
| **No analytics** | No tracking, no metrics |
| **No network by default** | Works offline, never phones home |
| **Local storage** | All data stays on your device |
| **Open source** | Verify our claims yourself |

### What We Never Do

- ❌ Track what symbols are used
- ❌ Record messages composed
- ❌ Collect device information
- ❌ Store data on remote servers
- ❌ Sell or share any data
- ❌ Use analytics or tracking scripts
- ❌ Require login or registration

### Optional Cloud Features (Future)

If we add cloud features (backup, sync), they will be:
- **Strictly opt-in** (off by default)
- **End-to-end encrypted** (we can't read your data)
- **Transparent** (clear about what's stored)
- **Deletable** (remove your data anytime)
- **Portable** (export and leave anytime)

---

## Accessibility Architecture

Accessibility is fundamental to LoveWords—it's an AAC tool, after all.

### Input Method Support

```
┌─────────────────────────────────────────────────────────────────────┐
│                        INPUT MANAGER (Rust Core)                     │
│                                                                      │
│                         Unified Event System                         │
│                               │                                      │
│    ┌────────────┬─────────────┼─────────────┬────────────┐          │
│    ▼            ▼             ▼             ▼            ▼          │
│ ┌──────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│ │Touch │  │ Keyboard │  │  Switch  │  │ Eye Gaze │  │  Mouse   │   │
│ │      │  │          │  │ Scanning │  │          │  │ (Dwell)  │   │
│ └──────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                               │                                      │
│                               ▼                                      │
│                    ┌─────────────────────┐                          │
│                    │   Same Actions      │                          │
│                    │   Regardless of     │                          │
│                    │   Input Method      │                          │
│                    └─────────────────────┘                          │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Key principle:** Every action is possible through every input method.

### Platform-Specific Accessibility

| Platform | Native A11y Features Used |
|----------|--------------------------|
| **iOS** | VoiceOver, Switch Control, AssistiveTouch, Dynamic Type |
| **macOS** | VoiceOver, Switch Control, Keyboard Navigation, Reduce Motion |
| **Chrome** | ChromeVox, Chromebook accessibility settings |
| **Tauri** | Platform-native screen readers, keyboard navigation |

### Switch Scanning

The core implements switch scanning logic:

```rust
// Scanning modes (implemented in Rust core)
enum ScanningMode {
    Linear,      // One cell at a time
    RowColumn,   // Highlight row, then cell in row
    Group,       // Hierarchical groups
}

struct ScanningConfig {
    mode: ScanningMode,
    scan_rate_ms: u32,        // Time per item
    auto_scan: bool,          // Auto-advance or manual
    loops_before_exit: u8,    // How many times to loop
    audio_cue: bool,          // Play sound on each item
}
```

### Timing Adjustability

All timing is configurable for motor needs:

| Setting | Purpose | Range |
|---------|---------|-------|
| Scan rate | Time on each cell | 200ms - 5000ms |
| Dwell time | Hold to select | 200ms - 3000ms |
| Selection delay | After selection, pause | 0ms - 2000ms |
| Auto-scan | Automatic or switch-triggered | On/Off |

---

## Technical Deep Dive

*This section is for developers. Skip if you prefer the plain-language overview above.*

### Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Core Language** | Rust | Memory safety, performance, cross-platform |
| **Core Serialization** | serde + JSON | Portable, debuggable |
| **Board Format** | Open Board Format (OBF) | Industry standard, interoperability |
| **iOS/macOS Bindings** | UniFFI | Automatic Swift/Kotlin generation |
| **Web Bindings** | wasm-pack + wasm-bindgen | WebAssembly for Chrome |
| **Desktop Framework** | Tauri | Rust backend, web frontend, small binary |
| **Web UI Framework** | React | Contributor gravity, accessibility patterns |
| **iOS/macOS UI** | SwiftUI | Modern, declarative, great a11y |
| **Testing** | cargo test, XCTest, Playwright | Platform-appropriate |

### Rust Core API

```rust
// Core types
pub struct Board {
    pub id: BoardId,
    pub name: String,
    pub grid: GridSpec,
    pub cells: Vec<Cell>,
    pub style: BoardStyle,
}

pub struct Cell {
    pub id: CellId,
    pub position: Position,
    pub symbol: Symbol,
    pub label: String,
    pub message: String,
    pub action: CellAction,
    pub style: CellStyle,
}

// Speech trait - implemented by each platform
pub trait SpeechEngine {
    fn speak(&self, text: &str, voice: &VoiceConfig) -> Result<(), SpeechError>;
    fn stop(&self);
    fn list_voices(&self) -> Vec<Voice>;
}

// Storage trait - implemented by each platform
pub trait StorageBackend {
    fn load_board(&self, id: &BoardId) -> Result<Board, StorageError>;
    fn save_board(&self, board: &Board) -> Result<(), StorageError>;
    fn load_profile(&self, id: &ProfileId) -> Result<Profile, StorageError>;
    // ...
}

// Input events - unified across all input methods
pub enum InputEvent {
    Select { cell_id: CellId },
    Back,
    Speak,
    Clear,
    Navigate { board_id: BoardId },
    ScanNext,
    ScanSelect,
}
```

### Directory Structure

```
lovewords/
├── Cargo.toml                 # Workspace root
├── README.md
├── CONTRIBUTING.md
│
├── core/                      # lovewords-core crate
│   ├── Cargo.toml
│   ├── src/
│   └── tests/
│
├── tauri/                     # Tauri desktop app
│   ├── src-tauri/
│   │   ├── Cargo.toml
│   │   └── src/
│   ├── src/                   # React frontend
│   └── package.json
│
├── apple/                     # iOS/macOS/watchOS
│   ├── LoveWords.xcodeproj
│   ├── Shared/
│   ├── iOS/
│   ├── macOS/
│   └── watchOS/
│
├── chrome/                    # Chrome extension
│   ├── manifest.json
│   ├── src/
│   └── package.json
│
├── boards/                    # Starter board JSON files
│   ├── love-and-affection.json
│   ├── gratitude.json
│   └── ...
│
└── docs/                      # Documentation
    ├── ARCHITECTURE.md        # This file
    ├── VISION.md
    ├── ROADMAP.md
    ├── ACCESSIBILITY.md
    └── ...
```

### Performance Targets

| Metric | Target | Why |
|--------|--------|-----|
| First paint | < 500ms | Communication can't wait |
| Time to interactive | < 1s | Must be usable quickly |
| Cell tap → message | < 16ms | Smooth, responsive |
| TTS latency | < 100ms | Natural conversation flow |
| Memory usage | < 50MB | Works on older devices |
| App size | < 20MB | Quick download, less storage |

### CI/CD Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                           GitHub Actions                             │
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  │
│  │ Rust Core   │  │   Tauri     │  │    iOS      │  │  Chrome   │  │
│  │   Tests     │  │   Build     │  │   Build     │  │   Build   │  │
│  │             │  │             │  │             │  │           │  │
│  │ cargo test  │  │ tauri build │  │ xcodebuild  │  │ npm build │  │
│  │ cargo clippy│  │             │  │             │  │           │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘  │
│         │                │                │               │         │
│         └────────────────┴────────────────┴───────────────┘         │
│                                  │                                   │
│                                  ▼                                   │
│                         Release Artifacts                            │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Contributing

We welcome contributions. See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

### For Technical Contributors

1. Fork the repository
2. Set up development environment
3. Find an issue labeled `good-first-issue` or `help-wanted`
4. Submit a pull request

### Areas Needing Help

- **Rust Core** — Board logic, storage, accessibility
- **iOS/SwiftUI** — Native iOS app development
- **Accessibility Testing** — Real-world testing with AAC users
- **Symbol Design** — Open-licensed communication symbols

### For Non-Technical Contributors

Your input shapes our architecture decisions:
- Share what features matter most to you
- Report usability issues
- Help us understand real-world usage

---

<p align="center">
  <em>Good architecture serves users, not developers.</em>
  <br><br>
  <strong>Every technical decision we make is in service of helping people communicate.</strong>
</p>
