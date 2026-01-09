# Architecture Overview

**How LoveWords is built, and why.**

This document explains the technical architecture of LoveWords in a way that's accessible to everyone—whether you're a developer, a speech-language pathologist curious about how things work, or a parent who wants to understand what's happening behind the scenes.

---

## Table of Contents

- [Project Goals](#project-goals)
- [High-Level Overview](#high-level-overview)
- [Core Components](#core-components)
- [Data Model](#data-model)
- [Offline-First Approach](#offline-first-approach)
- [Privacy Guarantees](#privacy-guarantees)
- [Cross-Platform Strategy](#cross-platform-strategy)
- [Future Extensibility](#future-extensibility)
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
| **Cross-Platform** | Works on any device |
| **Fast & Reliable** | Communication can't wait |

### Technical Principles

1. **Simplicity over cleverness** — Easy to understand and maintain
2. **Offline by default** — Assume no network
3. **Progressive enhancement** — Works everywhere, enhanced where possible
4. **Accessibility baked in** — Not an afterthought
5. **User data ownership** — Export everything, import anywhere

---

## High-Level Overview

Here's how LoveWords fits together at the highest level:

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────┐ │
│  │ Board View  │  │ Message Bar  │  │ Settings & Customization│ │
│  └─────────────┘  └──────────────┘  └─────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                      APPLICATION LAYER                          │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────┐ │
│  │ Board Logic │  │ Speech Engine│  │ Profile Management      │ │
│  └─────────────┘  └──────────────┘  └─────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                        DATA LAYER                               │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────┐ │
│  │Local Storage│  │ File System  │  │ Import/Export           │ │
│  └─────────────┘  └──────────────┘  └─────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                      PLATFORM LAYER                             │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────┐ │
│  │ Web Browser │  │   Mobile OS  │  │ Desktop OS              │ │
│  └─────────────┘  └──────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**In plain language:**
- The **User Interface** is what you see and interact with
- The **Application Layer** handles the logic (what happens when you tap a symbol)
- The **Data Layer** stores your boards, settings, and preferences locally
- The **Platform Layer** lets LoveWords run on different devices

---

## Core Components

### 1. Communication Boards

Boards are the heart of LoveWords—the grids of symbols users tap to communicate.

```
Board Structure:
┌─────────────────────────────────────────────┐
│  Board                                      │
│  ├── Name: "Home Board"                     │
│  ├── Grid: 4 columns × 5 rows               │
│  ├── Style: colors, fonts, spacing          │
│  │                                          │
│  └── Cells: [                               │
│        ├── Cell 1: {symbol, label, action}  │
│        ├── Cell 2: {symbol, label, action}  │
│        ├── Cell 3: {symbol, label, action}  │
│        └── ... more cells                   │
│      ]                                      │
└─────────────────────────────────────────────┘
```

**What boards contain:**
- **Cells** — Individual buttons with symbols
- **Layout** — How cells are arranged (rows × columns)
- **Navigation** — Links to other boards (folders/categories)
- **Style** — Colors, sizes, spacing

**What cells contain:**
- **Symbol** — Image (from library or personal photo)
- **Label** — Text shown below the symbol
- **Message** — What gets spoken when selected
- **Action** — What happens (speak, navigate, special function)
- **Style** — Individual cell appearance

### 2. User Profiles

Profiles allow multiple people to use LoveWords on the same device, or one person to have different setups.

```
Profile Structure:
┌─────────────────────────────────────────────┐
│  Profile                                    │
│  ├── Name: "Jamie's Profile"                │
│  ├── Avatar: photo or icon                  │
│  │                                          │
│  ├── Boards: [references to boards]         │
│  │                                          │
│  ├── Settings:                              │
│  │   ├── Voice: selected TTS voice          │
│  │   ├── Speech rate: 0.8                   │
│  │   ├── Access method: touch               │
│  │   ├── Theme: high-contrast-dark          │
│  │   └── ... more settings                  │
│  │                                          │
│  └── History:                               │
│      ├── Recent words                       │
│      └── Usage statistics (local only)      │
└─────────────────────────────────────────────┘
```

**Why profiles matter:**
- **Different users** — Siblings can share a tablet
- **Different contexts** — One setup for school, another for home
- **Different access methods** — Touch at home, switch at therapy
- **Easy switching** — Change profiles without losing anything

### 3. Speech Engine

The speech engine converts selected symbols into spoken words.

```
Speech Flow:
┌──────────┐    ┌───────────────┐    ┌──────────────┐    ┌─────────┐
│ User taps│ →  │ Message added │ →  │ User presses │ →  │ Speech  │
│ symbol   │    │ to bar        │    │ speak button │    │ output  │
└──────────┘    └───────────────┘    └──────────────┘    └─────────┘
```

**Speech options:**
- **Text-to-Speech (TTS)** — Computer-generated voice
- **Recorded messages** — Personal voice recordings
- **Hybrid** — TTS with personal recordings for names/phrases

**TTS Features:**
- Multiple voice options (male, female, child-like)
- Adjustable speech rate (slower ↔ faster)
- Pitch adjustment
- Offline voices (no internet needed)

### 4. Customization System

Deep customization makes LoveWords truly personal.

```
Customization Layers:
┌─────────────────────────────────────────────┐
│  Global Settings (affects everything)       │
│  ├── Theme (colors, contrast)               │
│  ├── Font size and style                    │
│  ├── Default button size                    │
│  └── Access method settings                 │
├─────────────────────────────────────────────┤
│  Board Settings (per board)                 │
│  ├── Grid dimensions                        │
│  ├── Board-specific colors                  │
│  └── Category organization                  │
├─────────────────────────────────────────────┤
│  Cell Settings (individual buttons)         │
│  ├── Symbol choice                          │
│  ├── Custom message                         │
│  ├── Size override                          │
│  └── Style override                         │
└─────────────────────────────────────────────┘
```

**Customization = Independence.** The more someone can personalize their communication tool, the more it becomes truly theirs.

### 5. Input System

Supporting multiple ways to interact is crucial.

```
Input Methods:
┌─────────────────────────────────────────────────────────────┐
│                      Input Manager                          │
│                           │                                 │
│    ┌──────────┬───────────┼───────────┬──────────┐         │
│    ▼          ▼           ▼           ▼          ▼         │
│ ┌──────┐ ┌────────┐ ┌──────────┐ ┌────────┐ ┌────────┐    │
│ │Touch │ │Keyboard│ │  Switch  │ │Eye Gaze│ │ Mouse  │    │
│ │      │ │        │ │ Scanner  │ │        │ │(Dwell) │    │
│ └──────┘ └────────┘ └──────────┘ └────────┘ └────────┘    │
│                           │                                 │
│                           ▼                                 │
│                  Unified Action System                      │
│                  (same result regardless                    │
│                   of input method)                          │
└─────────────────────────────────────────────────────────────┘
```

**Key principle:** Every action should be possible through every input method. Tap, keyboard press, switch activation, and eye dwell all trigger the same underlying action.

---

## Data Model

Here's how information is organized in LoveWords:

### Overview

```
LoveWords Data
│
├── Profiles/
│   ├── profile-1/
│   │   ├── profile.json (settings, preferences)
│   │   ├── boards/
│   │   │   ├── home-board.json
│   │   │   ├── food-board.json
│   │   │   └── school-board.json
│   │   └── recordings/
│   │       ├── greeting.mp3
│   │       └── mom-name.mp3
│   │
│   └── profile-2/
│       └── ...
│
├── Shared/
│   ├── symbols/ (symbol library)
│   ├── voices/ (offline TTS data)
│   └── templates/ (starter boards)
│
└── Settings/
    └── global-settings.json
```

### Board Data Format

Boards are stored as JSON (a standard data format):

```json
{
  "id": "home-board-123",
  "name": "Home",
  "version": 1,
  "grid": {
    "columns": 4,
    "rows": 5
  },
  "cells": [
    {
      "id": "cell-1",
      "position": { "row": 0, "column": 0 },
      "symbol": {
        "type": "library",
        "id": "mulberry/i-want"
      },
      "label": "I want",
      "message": "I want",
      "action": { "type": "speak" },
      "style": {
        "backgroundColor": "#ffeb3b"
      }
    },
    {
      "id": "cell-2",
      "position": { "row": 0, "column": 1 },
      "symbol": {
        "type": "photo",
        "path": "photos/mom.jpg"
      },
      "label": "Mom",
      "message": "Mom",
      "action": { "type": "speak" },
      "style": {}
    }
  ],
  "style": {
    "cellSpacing": 8,
    "borderRadius": 8
  }
}
```

**Why JSON?**
- Human-readable (you can open and understand it)
- Universal (works across platforms)
- Easy to import/export
- Version-controllable

### Portability

Your data belongs to you. LoveWords supports:

| Format | Use Case |
|--------|----------|
| **Full export** | Complete backup of profile + boards |
| **Board export** | Share individual boards |
| **Open Board Format** | Industry-standard AAC interchange |
| **Plain JSON** | For developers and power users |

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
Offline-First Architecture:

┌─────────────────────────────────────────────────────────────┐
│                        USER                                 │
│                          │                                  │
│                          ▼                                  │
│                   ┌─────────────┐                           │
│                   │ LoveWords   │                           │
│                   │    App      │                           │
│                   └──────┬──────┘                           │
│                          │                                  │
│    ┌─────────────────────┼─────────────────────┐           │
│    ▼                     ▼                     ▼           │
│ ┌──────────┐      ┌─────────────┐      ┌─────────────┐    │
│ │  Local   │      │   Offline   │      │   Cached    │    │
│ │  Storage │      │    TTS      │      │   Symbols   │    │
│ │ (boards, │      │   Voices    │      │             │    │
│ │ settings)│      │             │      │             │    │
│ └──────────┘      └─────────────┘      └─────────────┘    │
│                                                             │
│    ════════════════════════════════════════════════════    │
│                     NO INTERNET NEEDED                      │
│    ════════════════════════════════════════════════════    │
│                                                             │
│    ┌─────────────────────────────────────────────────┐     │
│    │             Optional Cloud Sync                  │     │
│    │        (only if user explicitly opts in)        │     │
│    └─────────────────────────────────────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Technical Implementation

| Component | Offline Strategy |
|-----------|------------------|
| **Boards** | Stored locally (IndexedDB/filesystem) |
| **Symbols** | Downloaded once, cached permanently |
| **TTS Voices** | Offline voices bundled/downloaded |
| **Recordings** | Stored locally |
| **App itself** | Service Worker for full offline access |

**Service Workers** (web version) allow the app to:
- Load without internet after first visit
- Cache all assets locally
- Work identically online and offline

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

### Optional Cloud Features

If we add cloud features (backup, sync), they will be:
- **Strictly opt-in** (off by default)
- **End-to-end encrypted** (we can't read your data)
- **Transparent** (clear about what's stored)
- **Deletable** (remove your data anytime)
- **Portable** (export and leave anytime)

### Verification

Don't trust—verify:
- Source code is publicly available
- No network requests in offline mode
- Data stored in inspectable local storage
- Third-party security audits welcome

---

## Cross-Platform Strategy

LoveWords runs everywhere because communication shouldn't depend on device.

### Platform Support

```
LoveWords Platform Support:

                        ┌─────────────────┐
                        │   Web (PWA)     │
                        │  Any browser    │
                        └────────┬────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Desktop     │    │     Mobile      │    │     Tablet      │
│  Windows/Mac/   │    │   iOS/Android   │    │   iPad/Android  │
│     Linux       │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Implementation Approach

| Approach | Description | Benefit |
|----------|-------------|---------|
| **PWA Core** | Progressive Web App as foundation | Works in any browser immediately |
| **Native wrappers** | Capacitor/Electron for app stores | Native features, app store presence |
| **Shared codebase** | One codebase for all platforms | Consistent features everywhere |
| **Responsive design** | Adapts to screen size | Same app, any device |

### Progressive Web App (PWA)

The web version is a "Progressive Web App" which means:
- **Installable** — Add to home screen like an app
- **Offline capable** — Works without internet
- **Updateable** — Always the latest version
- **No app store needed** — Access via URL

### Why Web-First?

| Reason | Explanation |
|--------|-------------|
| **Universal access** | No download needed, just a URL |
| **No gatekeepers** | No app store approval delays |
| **Instant updates** | Fixes available immediately |
| **Lower barriers** | Anyone with a browser can use it |
| **Shareability** | Send a link to share a board |

---

## Future Extensibility

LoveWords is designed to grow and adapt.

### Planned Enhancements

#### Communication Features
- **Word prediction** — Suggest likely next words
- **Sentence building** — Grammar support for building sentences
- **Conversation history** — Review past conversations
- **Quick replies** — Context-aware response suggestions

#### Accessibility Features
- **Eye gaze integration** — Direct support for popular eye trackers
- **Head tracking** — Camera-based pointer control
- **Voice control** — Navigate by voice
- **Brain-computer interface** — Future BCI support

#### Personalization
- **Machine learning** — Learn from usage patterns (locally only)
- **Dynamic boards** — Boards that adapt to context/time
- **Theme creator** — Build and share visual themes
- **Symbol editor** — Create custom symbols in-app

#### Integration
- **Open Board Format** — Full import/export compatibility
- **External switches** — Bluetooth switch support
- **Smart home** — Control home devices through AAC
- **Education tools** — Curriculum integration

### Plugin Architecture

We're designing for extensibility:

```
Future Plugin System:
┌─────────────────────────────────────────────────────────────┐
│                     LoveWords Core                          │
├─────────────────────────────────────────────────────────────┤
│                      Plugin API                             │
├──────────────┬──────────────┬──────────────┬───────────────┤
│   Symbol     │    Voice     │   Access     │   Board       │
│   Packs      │   Packs      │   Methods    │  Templates    │
└──────────────┴──────────────┴──────────────┴───────────────┘
```

Plugins could add:
- New symbol libraries
- Additional TTS voices
- Alternative access methods
- Specialized board templates
- Integration with external services

---

## Technical Deep Dive

*This section is for developers. Skip if you prefer the plain-language overview above.*

### Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **UI Framework** | React | Component-based, accessible, large ecosystem |
| **State Management** | Redux Toolkit | Predictable state, good DevTools |
| **Styling** | CSS Modules + CSS Variables | Theming support, no runtime overhead |
| **Storage** | IndexedDB (Dexie.js) | Large storage, good performance |
| **TTS** | Web Speech API + fallbacks | Native browser support |
| **Build** | Vite | Fast builds, modern defaults |
| **Testing** | Vitest + Testing Library | Fast, accessibility-focused |
| **PWA** | Workbox | Reliable offline, caching strategies |

### Code Architecture

```
src/
├── components/           # React components
│   ├── Board/           # Board display components
│   ├── Cell/            # Individual cell components
│   ├── MessageBar/      # Message composition area
│   ├── Navigation/      # Navigation components
│   └── Settings/        # Settings UI
│
├── features/            # Feature-based modules
│   ├── boards/          # Board state and logic
│   ├── profiles/        # Profile management
│   ├── speech/          # TTS and recordings
│   ├── input/           # Input method handling
│   └── accessibility/   # A11y utilities
│
├── services/            # Core services
│   ├── storage/         # IndexedDB operations
│   ├── speech/          # Speech synthesis
│   └── import-export/   # Data portability
│
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── types/               # TypeScript definitions
└── styles/              # Global styles and themes
```

### Key Design Decisions

#### 1. Offline-First Storage

```typescript
// Using Dexie.js for IndexedDB
const db = new Dexie('LoveWords');
db.version(1).stores({
  profiles: '++id, name',
  boards: '++id, profileId, name',
  cells: '++id, boardId',
  recordings: '++id, profileId'
});
```

#### 2. Accessible by Default

```typescript
// All interactive components include accessibility
interface ButtonProps {
  label: string;           // Always required
  ariaLabel?: string;      // Optional override
  ariaPressed?: boolean;   // For toggle buttons
  // ... other props
}
```

#### 3. Input Method Abstraction

```typescript
// Unified action system
interface ActionEvent {
  type: 'select' | 'back' | 'speak' | 'clear';
  target?: string;
  source: 'touch' | 'keyboard' | 'switch' | 'eyegaze';
}

// All input methods emit the same events
inputManager.on('action', (event: ActionEvent) => {
  // Handle identically regardless of source
});
```

### Performance Targets

| Metric | Target | Why |
|--------|--------|-----|
| First paint | < 1s | Communication can't wait |
| Time to interactive | < 2s | Must be usable quickly |
| Symbol render | < 16ms | Smooth scrolling/scanning |
| TTS latency | < 100ms | Natural conversation flow |
| Memory usage | < 100MB | Works on older devices |

### Accessibility Testing

```bash
# Automated accessibility checks
npm run test:a11y

# Manual testing checklist
npm run test:manual

# Screen reader testing
# (Manual with NVDA, VoiceOver, TalkBack)
```

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

### For Technical Contributors

1. Fork the repository
2. Set up development environment (see CONTRIBUTING.md)
3. Find an issue labeled `good first issue` or `help wanted`
4. Submit a pull request

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
