# Accessibility Standards

**Accessibility isn't a feature. It's the foundation.**

LoveWords exists to give voice to people who communicate differently. If our app isn't accessible, we've failed our core mission. This document outlines our commitment to accessibility, our standards, and how we achieve them.

---

## Table of Contents

- [Our Commitment](#our-commitment)
- [WCAG 2.1 Compliance](#wcag-21-compliance)
- [Motor Accessibility](#motor-accessibility)
- [Sensory Accessibility](#sensory-accessibility)
- [Cognitive Accessibility](#cognitive-accessibility)
- [Neurodivergent-Affirming Design](#neurodivergent-affirming-design)
- [Testing & Validation](#testing--validation)
- [Reporting Issues](#reporting-issues)
- [Resources](#resources)

---

## Our Commitment

### Accessibility Principles

We follow the four POUR principles from WCAG:

| Principle | Meaning | Our Approach |
|-----------|---------|--------------|
| **Perceivable** | Information must be presentable to users | Multiple formats: visual, auditory, tactile feedback |
| **Operable** | Interface must be operable by all users | Keyboard, switch, eye gaze, touch—all supported |
| **Understandable** | Information and operation must be understandable | Clear language, consistent behavior, predictable UI |
| **Robust** | Content must work with assistive technologies | Standards-compliant HTML, ARIA when needed |

### Our Promise

1. **No accessibility regressions.** New features cannot break existing accessibility.
2. **Accessibility from day one.** Every feature is designed accessible, not retrofitted.
3. **User involvement.** People with disabilities guide our development.
4. **Continuous improvement.** We regularly audit and improve.
5. **Transparency.** We publicly document our accessibility status.

---

## WCAG 2.1 Compliance

We target **WCAG 2.1 Level AA** as our minimum standard, with many AAA criteria met where possible.

### Compliance Roadmap

#### Level A (Minimum - Must Have)

| Criterion | Description | Status |
|-----------|-------------|--------|
| 1.1.1 | Non-text content has text alternatives | ✅ Target |
| 1.2.1 | Audio/video alternatives | ✅ Target |
| 1.3.1 | Info and relationships programmatically determined | ✅ Target |
| 1.3.2 | Meaningful sequence | ✅ Target |
| 1.3.3 | Sensory characteristics not sole identifiers | ✅ Target |
| 1.4.1 | Color not sole means of conveying info | ✅ Target |
| 1.4.2 | Audio control | ✅ Target |
| 2.1.1 | Keyboard accessible | ✅ Target |
| 2.1.2 | No keyboard trap | ✅ Target |
| 2.2.1 | Timing adjustable | ✅ Target |
| 2.2.2 | Pause, stop, hide moving content | ✅ Target |
| 2.3.1 | No content flashes more than 3x/second | ✅ Target |
| 2.4.1 | Skip navigation | ✅ Target |
| 2.4.2 | Page titles | ✅ Target |
| 2.4.3 | Focus order | ✅ Target |
| 2.4.4 | Link purpose clear | ✅ Target |
| 3.1.1 | Language of page defined | ✅ Target |
| 3.2.1 | No change on focus | ✅ Target |
| 3.2.2 | No change on input (without warning) | ✅ Target |
| 3.3.1 | Error identification | ✅ Target |
| 3.3.2 | Labels or instructions | ✅ Target |
| 4.1.1 | Valid HTML parsing | ✅ Target |
| 4.1.2 | Name, role, value for UI components | ✅ Target |

#### Level AA (Standard - Target)

| Criterion | Description | Status |
|-----------|-------------|--------|
| 1.3.4 | Orientation not restricted | ✅ Target |
| 1.3.5 | Input purpose identifiable | ✅ Target |
| 1.4.3 | Contrast minimum 4.5:1 | ✅ Target |
| 1.4.4 | Text resizable to 200% | ✅ Target |
| 1.4.5 | Images of text avoided | ✅ Target |
| 1.4.10 | Content reflows (no horizontal scroll) | ✅ Target |
| 1.4.11 | Non-text contrast 3:1 | ✅ Target |
| 1.4.12 | Text spacing adjustable | ✅ Target |
| 1.4.13 | Content on hover/focus dismissible | ✅ Target |
| 2.4.5 | Multiple ways to find pages | ✅ Target |
| 2.4.6 | Headings and labels descriptive | ✅ Target |
| 2.4.7 | Focus visible | ✅ Target |
| 3.1.2 | Language of parts identified | ✅ Target |
| 3.2.3 | Consistent navigation | ✅ Target |
| 3.2.4 | Consistent identification | ✅ Target |
| 3.3.3 | Error suggestion | ✅ Target |
| 3.3.4 | Error prevention (legal, financial, data) | ✅ Target |
| 4.1.3 | Status messages announced | ✅ Target |

#### Level AAA (Enhanced - Where Possible)

| Criterion | Description | Status |
|-----------|-------------|--------|
| 1.4.6 | Enhanced contrast 7:1 | 🎯 Goal |
| 2.2.3 | No timing | 🎯 Goal |
| 2.2.4 | Interruptions can be postponed | 🎯 Goal |
| 2.4.8 | Location within site shown | 🎯 Goal |
| 2.4.9 | Link purpose from link text alone | 🎯 Goal |
| 3.2.5 | Change only on request | 🎯 Goal |
| 3.3.5 | Context-sensitive help | 🎯 Goal |

---

## Motor Accessibility

Many of our users have motor differences that affect how they interact with devices. We support multiple input methods.

### Switch Scanning

Switch scanning allows users to navigate using one or two switches (buttons).

#### How It Works

```
Single Switch Scanning:
┌─────┐   ┌─────┐   ┌─────┐
│  1  │ → │  2  │ → │  3  │ → ...
└─────┘   └─────┘   └─────┘
   ↑         ↑         ↑
   └─────────┴─────────┴── Automatic scanning moves focus
                           Press switch to SELECT
```

```
Two-Switch Scanning:
Switch 1: Move to next item
Switch 2: Select current item
```

```
Row-Column Scanning:
Step 1: Scan highlights rows
┌─────────────────────────┐
│ ▶ [1] [2] [3] [4] [5]   │  ← Highlighted row
├─────────────────────────┤
│   [6] [7] [8] [9] [10]  │
├─────────────────────────┤
│   [11][12][13][14][15]  │
└─────────────────────────┘

Step 2: After selection, scan items in row
┌─────────────────────────┐
│   [1]▶[2] [3] [4] [5]   │  ← Scanning within row
├─────────────────────────┤
```

#### Our Implementation

| Feature | Setting | Range |
|---------|---------|-------|
| Scan speed | Adjustable | 0.5s - 10s per item |
| Scan pattern | Selectable | Linear, Row-Column, Group |
| Auto-restart | Optional | On/Off |
| Loops before stop | Configurable | 1-10 or infinite |
| First item delay | Adjustable | 0-5 seconds extra |
| Audio feedback | Optional | Beep, spoken, or none |
| Visual highlight | Customizable | Color, thickness, style |

#### Best Practices

- **Logical scan order:** Left-to-right, top-to-bottom
- **Clear visual indicator:** High contrast highlight
- **Auditory option:** Speak item name on focus
- **Escape route:** Always a way to exit/cancel
- **Fewer items = faster access:** Consider board density

### Eye Gaze / Eye Tracking

Eye gaze systems track where users look and select items through dwell time (looking at something for a set duration).

#### Requirements for Eye Gaze Support

| Requirement | Our Approach |
|-------------|--------------|
| Large targets | Minimum 60×60px, recommended 80×80px |
| Generous spacing | Minimum 16px between targets |
| Dwell indicator | Visual countdown/fill animation |
| Dwell time | Adjustable from 0.3s to 3s |
| Rest areas | Safe zones that don't trigger |
| Calibration area | Nothing critical in corners |

#### Visual Dwell Feedback

```
Dwell Progress Indicator:

Start:        25%:         50%:         75%:         Activated:
┌──────┐     ┌──────┐     ┌──────┐     ┌──────┐     ┌──────┐
│      │     │░     │     │░░    │     │░░░   │     │░░░░░░│
│ HOME │     │ HOME │     │ HOME │     │ HOME │     │ HOME │
│      │     │      │     │      │     │      │     │ ✓    │
└──────┘     └──────┘     └──────┘     └──────┘     └──────┘
```

### Keyboard Navigation

Full keyboard access is non-negotiable.

#### Required Keyboard Support

| Key | Action |
|-----|--------|
| `Tab` | Move to next interactive element |
| `Shift + Tab` | Move to previous element |
| `Enter` / `Space` | Activate focused element |
| `Escape` | Close modal/cancel action |
| `Arrow keys` | Navigate within grids/menus |
| `Home` / `End` | Jump to first/last item |

#### Focus Management

- **Visible focus:** Always show where keyboard focus is
- **Logical order:** Tab order matches visual order
- **Focus trap (modals):** Focus stays in modal until closed
- **Focus return:** After closing modal, return focus to trigger
- **Skip links:** Jump past navigation to main content

### Touch Accessibility

Not all touch is the same. We accommodate various touch needs.

| Feature | Implementation |
|---------|----------------|
| Large touch targets | Minimum 44×44px |
| Touch-and-hold delay | Adjustable activation delay |
| Accidental touch rejection | Edge rejection zones |
| No required gestures | Swipe/pinch optional, not required |
| Touch feedback | Visual and optional audio confirmation |

### Head Tracking & Pointer Alternatives

For users using head tracking, joysticks, or mouth-controlled pointers:

- **Dwell-to-click** option available
- **Large targets** reduce precision required
- **Edge avoidance** keeps important items away from edges
- **No hover-required interactions**

---

## Sensory Accessibility

### Visual Accessibility

#### For Users with Low Vision

| Feature | Implementation |
|---------|----------------|
| Text scaling | Supports 200% without breaking |
| High contrast mode | Light and dark high-contrast themes |
| Customizable colors | User-defined color schemes |
| Large symbols | Scalable symbols up to 200% |
| No color-only info | Always paired with text/icons |

#### Contrast Requirements

```
Standard Mode:
┌─────────────────────────────────┐
│  Text: #333333 on #FFFFFF       │  ← 12.6:1 ratio
│  Large text: #666666 on #FFF    │  ← 5.7:1 ratio
│  UI elements: #444444 on #FFF   │  ← 9.7:1 ratio
└─────────────────────────────────┘

High Contrast Mode:
┌─────────────────────────────────┐
│  Text: #000000 on #FFFFFF       │  ← 21:1 ratio
│  Or: #FFFFFF on #000000         │  ← 21:1 ratio
│  Focus: #FFFF00 on #000000      │  ← 19.6:1 ratio
└─────────────────────────────────┘
```

#### For Color Blindness

We avoid problematic color combinations:

| Avoid | Instead |
|-------|---------|
| Red/Green distinction | Use Red/Blue or add icons |
| Color as only indicator | Pair with shape, pattern, text |
| Saturated colors without borders | Add visible borders |

#### Screen Reader Support

Full compatibility with:
- **VoiceOver** (macOS, iOS)
- **NVDA** (Windows, free)
- **JAWS** (Windows)
- **TalkBack** (Android)

Requirements:
- All images have appropriate alt text
- All buttons have accessible names
- Dynamic content changes announced via ARIA live regions
- Form labels properly associated
- Heading hierarchy logical (h1 → h2 → h3)

### Auditory Accessibility

#### For Deaf and Hard of Hearing Users

| Feature | Implementation |
|---------|----------------|
| Visual feedback | All audio cues have visual equivalent |
| Captions | Any instructional videos captioned |
| Text output | Message bar shows what TTS will say |
| Vibration option | Haptic feedback on mobile |

#### For Hearing Users

| Feature | Implementation |
|---------|----------------|
| Sound feedback | Optional confirmation sounds |
| Spoken focus | Items can be spoken when focused |
| TTS preview | Hear before sending |

---

## Cognitive Accessibility

Clear, predictable interfaces help everyone, especially users with cognitive differences.

### Clarity

#### Simple Language
- Use plain language in all UI text
- Avoid jargon and technical terms
- Keep instructions short and direct
- Use active voice

#### Visual Clarity
- Uncluttered layouts
- Clear visual hierarchy
- Consistent iconography
- Adequate whitespace

### Predictability

#### Consistent Behavior
- Same action = same result everywhere
- Buttons that look the same work the same
- No surprises or unexpected changes

#### Stable Layout
- Core navigation stays in place
- Important elements don't move
- No content shifting after load

### Memory Support

| Feature | Implementation |
|---------|----------------|
| Visible state | Always show current selection/status |
| Breadcrumbs | Show path through boards |
| Recently used | Quick access to recent symbols |
| Undo | Reverse actions easily |

### Error Prevention

| Strategy | Implementation |
|----------|----------------|
| Confirmation | Destructive actions require confirmation |
| Undo | All actions can be reversed |
| Clear errors | Errors explained in plain language |
| Recovery | Easy path back from errors |

### Focus Support

| Feature | Implementation |
|---------|----------------|
| Reduced motion | Respects `prefers-reduced-motion` |
| No auto-advance | User controls pace |
| Pause/resume | Can pause any timed activity |
| Focus mode | Hide non-essential elements |

---

## Neurodivergent-Affirming Design

LoveWords is designed to work *with* different neurotypes, not against them.

### For Autistic Users

#### Sensory Considerations
- **Minimal animations:** Reduced or eliminated movement
- **Sound control:** All sounds optional, adjustable volume
- **Visual calm:** Options for reduced visual complexity
- **No flashing:** Never above 3 flashes per second
- **Predictable interaction:** No surprises

#### Communication Support
- **Diverse vocabulary:** Including specific interests
- **Scripts & phrases:** Pre-composed messages available
- **Literal language:** Clear, direct symbol meanings
- **No forced eye contact prompts:** Respect for different communication styles

#### Routine & Consistency
- **Consistent layouts:** Same place every time
- **Customizable routines:** Create sequences for regular activities
- **Change warnings:** If something must change, warning provided
- **Personal customization:** Deep control over appearance/behavior

### For ADHD Users

| Challenge | Our Approach |
|-----------|--------------|
| Distraction | Clean interface, focus modes |
| Working memory | Visible message bar, undo support |
| Time awareness | No hidden timers, visible progress |
| Organization | Clear categories, search function |
| Hyperfocus support | Don't interrupt with notifications |

### For Users with Learning Differences

| Support | Implementation |
|---------|----------------|
| Multi-modal | Symbol + text + audio options |
| Scaffolding | Simple → complex board progression |
| Repetition | Consistent placement aids learning |
| Personalization | Adapt to individual learning style |

### Universal Design Principles

| Principle | Application |
|-----------|-------------|
| Flexibility | Multiple ways to do everything |
| Simplicity | Core functions obvious |
| Tolerance | Forgiving of mistakes |
| Low effort | Minimize repetitive actions |
| Size & space | Comfortable for all abilities |

---

## Testing & Validation

We don't guess about accessibility—we test it.

### Automated Testing

| Tool | Purpose | Frequency |
|------|---------|-----------|
| axe-core | WCAG compliance | Every commit |
| Lighthouse | Performance + accessibility | Every build |
| pa11y | Accessibility audit | Weekly |
| ESLint a11y | Code-level checks | Every commit |

### Manual Testing Protocol

#### Keyboard Testing
1. Navigate entire app using only keyboard
2. Verify all functions accessible
3. Check visible focus indicator
4. Confirm logical tab order
5. Test all keyboard shortcuts

#### Screen Reader Testing
1. Test with NVDA (Windows)
2. Test with VoiceOver (Mac/iOS)
3. Test with TalkBack (Android)
4. Verify all content announced
5. Check reading order

#### Switch Access Testing
1. Enable switch scanning
2. Navigate all boards
3. Test all actions
4. Time common tasks
5. Check for scan traps

#### Visual Testing
1. Test at 200% zoom
2. Test high contrast mode
3. Test with color blindness simulator
4. Verify contrast ratios
5. Check forced-colors mode

### User Testing

We regularly test with:
- AAC users with various access methods
- Speech-language pathologists
- Occupational therapists
- Assistive technology specialists

---

## Reporting Issues

Found an accessibility barrier? Please tell us!

### How to Report

1. **GitHub Issues:** Create an issue with the `accessibility` label
2. **Email:** [accessibility@lovewords.example.com]
3. **In-app:** Use the feedback form (accessible via all input methods)

### What to Include

```markdown
**Summary:**
Brief description of the accessibility barrier

**Steps to Reproduce:**
1. Step one
2. Step two
3. ...

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Assistive Technology:**
- Screen reader / switch system / eye gaze / etc.
- Brand and version

**Device & Browser:**
- Device type
- Operating system
- Browser (if web)

**Impact:**
How this affects your ability to use LoveWords
```

### Response Commitment

| Severity | Response Time | Resolution Target |
|----------|---------------|-------------------|
| Critical (blocker) | 24 hours | 1 week |
| Major (difficult to use) | 72 hours | 2 weeks |
| Minor (inconvenient) | 1 week | 1 month |
| Enhancement | 2 weeks | Roadmap |

**Critical issues** that prevent communication will be prioritized above all other work.

---

## Resources

### Standards & Guidelines
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Cognitive Accessibility Guidance](https://www.w3.org/TR/coga-usable/)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/)
- [WAVE](https://wave.webaim.org/)
- [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)
- [NoCoffee Vision Simulator](https://accessgarage.wordpress.com/)

### Learning Resources
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [Inclusive Components](https://inclusive-components.design/)
- [Deque University](https://dequeuniversity.com/)

### Assistive Technology
- [NVDA Screen Reader](https://www.nvaccess.org/) (free)
- [Switch Access Setup (Android)](https://support.google.com/accessibility/android/answer/6122836)
- [Switch Control (iOS)](https://support.apple.com/en-us/HT201370)

---

<p align="center">
  <em>Accessibility is not a barrier to innovation—it is the catalyst.</em>
  <br><br>
  <strong>Everyone deserves to be heard.</strong>
</p>
