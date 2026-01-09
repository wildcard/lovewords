# Board Design Guide

**Creating communication boards that empower expression.**

A well-designed communication board can be the difference between frustration and connection. This guide will help you create boards that are accessible, intuitive, and deeply personal to the communicator who uses them.

Whether you're designing your first board or your hundredth, these principles will help you create something meaningful.

---

## Table of Contents

- [Design Philosophy](#design-philosophy)
- [Anatomy of a Board](#anatomy-of-a-board)
- [Accessibility Requirements](#accessibility-requirements)
- [Symbol Systems](#symbol-systems)
- [Personalization](#personalization)
- [Example Layouts](#example-layouts)
- [Testing Your Board](#testing-your-board)
- [Cultural Considerations](#cultural-considerations)
- [Quick Reference Checklist](#quick-reference-checklist)

---

## Design Philosophy

Before placing a single symbol, consider these guiding principles:

### 1. Communication First, Aesthetics Second

A beautiful board that's hard to use is a failed board. Prioritize:
- **Findability:** Can the user quickly locate what they need?
- **Accuracy:** Does each symbol clearly represent its meaning?
- **Speed:** Can common messages be expressed efficiently?

### 2. Presume Competence

Never underestimate what someone can learn or communicate. Design boards that:
- Offer room to grow
- Include a range of vocabulary (not just basic needs)
- Allow for expressing complex thoughts and emotions

### 3. Honor the Individual

Every communicator is unique. Consider:
- Their interests, relationships, and daily life
- Motor abilities and access method
- Visual and cognitive needs
- Cultural and linguistic background

### 4. Consistency Creates Confidence

Predictable layouts reduce cognitive load:
- Keep core words in the same location across boards
- Use consistent color coding
- Maintain similar button sizes and spacing

### 5. Less Can Be More (But Not Always)

Some users thrive with minimal choices; others need extensive vocabulary. The right amount is whatever helps *this person* communicate effectively.

---

## Anatomy of a Board

Understanding the components of a communication board helps you design with intention.

### Board Structure

```
┌─────────────────────────────────────────────────────────┐
│                    Navigation Bar                        │
│  [Home] [Back] [Categories] [Settings]                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│   │          │  │          │  │          │             │
│   │  Symbol  │  │  Symbol  │  │  Symbol  │   ...       │
│   │          │  │          │  │          │             │
│   │  Label   │  │  Label   │  │  Label   │             │
│   └──────────┘  └──────────┘  └──────────┘             │
│                                                          │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│   │          │  │          │  │          │             │
│   │  Symbol  │  │  Symbol  │  │  Symbol  │   ...       │
│   │          │  │          │  │          │             │
│   │  Label   │  │  Label   │  │  Label   │             │
│   └──────────┘  └──────────┘  └──────────┘             │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                    Message Bar                           │
│  [ I want to go to the park today.            ] [Speak] │
└─────────────────────────────────────────────────────────┘
```

### Key Components

#### Navigation Bar
The top area for moving between boards and accessing settings.

| Element | Purpose | Design Tips |
|---------|---------|-------------|
| Home | Return to main board | Always visible, consistent position |
| Back | Return to previous board | Clear arrow icon |
| Categories | Access topic boards | Organized logically |
| Settings | Adjust preferences | Gear icon, less prominent |

#### Symbol Grid
The main area containing communication symbols.

| Element | Purpose | Design Tips |
|---------|---------|-------------|
| Symbol/Image | Visual representation | Clear, unambiguous, consistent style |
| Label | Text description | Readable font, adequate size |
| Button area | Touch/click target | Minimum 44x44px, adequate spacing |
| Background | Visual organization | Use color purposefully |

#### Message Bar
Where composed messages appear before speaking.

| Element | Purpose | Design Tips |
|---------|---------|-------------|
| Message display | Shows constructed message | Large, clear text |
| Clear button | Erase message | Obvious but not too easy to hit accidentally |
| Speak button | Output message via TTS | Prominent, easy to reach |
| Backspace | Remove last word | Near message area |

### Button Anatomy

A single button contains multiple elements:

```
┌────────────────────────┐
│      ┌────────┐        │  ← Background (color-coded)
│      │        │        │
│      │ Symbol │        │  ← Symbol/Image (visual meaning)
│      │        │        │
│      └────────┘        │
│                        │
│       "drink"          │  ← Label (text description)
│                        │
└────────────────────────┘
     ↑
   Touch target area
   (extends beyond visible button)
```

---

## Accessibility Requirements

Every board must be usable by everyone. These aren't suggestions—they're requirements.

### Color & Contrast

#### Minimum Contrast Ratios (WCAG 2.1 AA)

| Element | Minimum Ratio | Example |
|---------|---------------|---------|
| Body text | 4.5:1 | Dark gray (#333) on white |
| Large text (18pt+) | 3:1 | Medium gray (#666) on white |
| UI components | 3:1 | Button borders, icons |
| Focus indicators | 3:1 | Visible keyboard focus |

#### Testing Contrast

Use these free tools:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)
- Browser DevTools (Accessibility panel)

#### Color Coding

Color can enhance usability but must never be the *only* way to convey information.

**Fitzgerald Key (common AAC color system):**

| Color | Word Type | Example Words |
|-------|-----------|---------------|
| Yellow | People/Pronouns | I, you, he, she, we |
| Green | Actions/Verbs | go, want, eat, play |
| Orange | Adjectives/Adverbs | big, happy, more, fast |
| Blue | Descriptors/Questions | what, where, when, why |
| Pink | Social/Interjections | please, thank you, hi, wow |
| White | Nouns | ball, dog, water, home |
| Red | Important/Negation | stop, no, don't, help |

**Important:** Always pair color with another indicator (icon, position, label).

### Size Requirements

#### Touch Targets

| Standard | Minimum Size | Recommended |
|----------|--------------|-------------|
| WCAG 2.1 AA | 44 × 44 px | 48 × 48 px |
| Apple HIG | 44 × 44 pt | — |
| Material Design | 48 × 48 dp | — |

For users with motor difficulties, consider 60×60px or larger.

#### Spacing

| Element | Minimum | Recommended |
|---------|---------|-------------|
| Between buttons | 8px | 12-16px |
| Button padding | 8px | 12px |
| Grid margins | 16px | 24px |

Adequate spacing prevents accidental activation and reduces visual clutter.

#### Text Size

| Element | Minimum | Recommended |
|---------|---------|-------------|
| Button labels | 14px | 16-18px |
| Message bar | 18px | 24px |
| Navigation | 14px | 16px |

Always use relative units (rem/em) so users can scale text.

### Motor Accessibility

Design for all access methods:

#### Touch Users
- Large, well-spaced targets
- No gestures required (swipe, pinch)
- Tap-and-hold optional, not required
- Avoid edges of screen (hard to reach)

#### Switch Users
- Logical scan order (left-to-right, top-to-bottom)
- Visual highlight on focused item
- Auditory cue option on focus
- Reasonable number of items (fewer = faster scanning)

#### Eye Gaze Users
- Extra large targets (recommend 80×80px+)
- Generous spacing (prevents mis-selection)
- Dwell time indicators
- Rest areas (places to look without triggering)

#### Keyboard Users
- Full Tab navigation
- Visible focus indicator
- Logical focus order
- Enter/Space to activate

### Visual Accessibility

#### For Low Vision
- High contrast option (light and dark themes)
- Scalable interface (up to 200% without breaking)
- No information conveyed by color alone
- Clear, simple symbols

#### For Color Blindness
- Don't rely on red/green distinction
- Use patterns or icons alongside color
- Test with color blindness simulators

---

## Symbol Systems

Symbols are the vocabulary of AAC. Understanding different systems helps you make informed choices.

### Common Symbol Libraries

#### Open-Licensed (Free)

| System | Style | Best For |
|--------|-------|----------|
| **Mulberry Symbols** | Simple, clear line drawings | General use, teens/adults |
| **ARASAAC** | Colorful, detailed pictographs | Children, multilingual |
| **Sclera** | High contrast, black & white | Low vision, simplicity |
| **OpenMoji** | Emoji-style | Casual communication, teens |

#### Commercial (Licensed)

| System | Style | Notes |
|--------|-------|-------|
| **PCS (Boardmaker)** | Industry standard pictographs | Most widely recognized |
| **SymbolStix** | Colorful, animated style | Engaging for children |
| **Widgit** | UK-focused, curriculum-aligned | Educational settings |

### Choosing Symbols

#### Clarity
- Can the meaning be understood without the label?
- Is it distinct from similar concepts?
- Does it avoid cultural/regional confusion?

#### Consistency
- Use the same style throughout a board
- Maintain consistent perspective (front view, side view)
- Keep visual complexity similar across symbols

#### Appropriateness
- Age-appropriate imagery
- Culturally respectful representation
- Diverse representation of people

### When to Use Photos

Photos can be powerful for:
- **People:** Family members, friends, caregivers
- **Places:** Home, school, specific locations
- **Personal items:** Favorite toys, foods, belongings
- **Pets:** The family dog, not a generic dog

**Photo Guidelines:**
- Clear, well-lit images
- Simple backgrounds
- Consistent framing
- Regular updates (people change!)

---

## Personalization

The most effective boards feel personal. Here's how to customize meaningfully.

### Vocabulary Selection

#### Core Vocabulary
High-frequency words used across contexts. These should be prominent and consistent:

| Category | Examples |
|----------|----------|
| Pronouns | I, you, it, we, they |
| Verbs | want, go, like, help, stop |
| Descriptors | more, all done, different |
| Questions | what, where, who, why |
| Social | hi, bye, please, thank you |

Core words make up 80% of what we say. Prioritize these.

#### Fringe Vocabulary
Specific words for topics, interests, and contexts:

- **Favorite things:** specific games, shows, foods
- **People's names:** family, friends, teachers
- **Places:** school, grandma's house, park
- **Current events:** birthday party, field trip, holiday

### Personal Photos

Adding personal photos creates connection:

```
Instead of:              Use:
┌──────────────┐        ┌──────────────┐
│   [generic   │        │  [photo of   │
│    mom icon] │   →    │  their mom]  │
│              │        │              │
│    "Mom"     │        │    "Mom"     │
└──────────────┘        └──────────────┘
```

**Tips for photo symbols:**
- Crop faces clearly
- Use consistent backgrounds
- Update seasonally/yearly
- Include pets!

### Voice Recording

Personal voice messages add warmth:

**Good candidates for recordings:**
- Greetings ("Hi Grandma!")
- Personal phrases ("I love you")
- Names (pronounced correctly)
- Inside jokes or family sayings
- Requests specific to the person

**Recording tips:**
- Quiet environment
- Consistent volume
- Natural tone (not robotic)
- Consider whose voice (parent, sibling, self)

### Creating Topic Boards

Build boards around the person's life:

| Topic | Vocabulary Ideas |
|-------|------------------|
| **Mealtime** | Specific foods they eat, more, all done, hot, cold, yummy |
| **School** | Teacher names, subjects, locations, activities |
| **Bedtime** | Routine items, feelings, requests, comfort words |
| **Play** | Specific toys, games, playmates, actions |
| **Medical** | Body parts, symptoms, comfort needs, doctor names |

---

## Example Layouts

### Starter Board (Beginning Communicator)

A simple 3×3 grid for early AAC users:

```
┌─────────────────────────────────────┐
│                                     │
│   [want]      [more]      [stop]    │
│                                     │
│   [help]      [go]        [all done]│
│                                     │
│   [yes]       [no]        [hi/bye]  │
│                                     │
└─────────────────────────────────────┘
```

**Design notes:**
- Large buttons (minimum 80×80px)
- High contrast colors
- Core words only
- Consistent positions

### Core Word Board (Intermediate)

A 5×6 grid with organized core vocabulary:

```
┌────────────────────────────────────────────────────────┐
│  [I]       [you]      [want]     [go]       [more]    │
│  YELLOW    YELLOW     GREEN      GREEN      ORANGE    │
├────────────────────────────────────────────────────────┤
│  [it]      [that]     [like]     [make]     [all done]│
│  YELLOW    YELLOW     GREEN      GREEN      ORANGE    │
├────────────────────────────────────────────────────────┤
│  [he/she]  [we]       [help]     [get]      [different│
│  YELLOW    YELLOW     GREEN      GREEN      ORANGE    │
├────────────────────────────────────────────────────────┤
│  [what]    [where]    [look]     [put]      [same]    │
│  BLUE      BLUE       GREEN      GREEN      ORANGE    │
├────────────────────────────────────────────────────────┤
│  [not]     [can]      [turn]     [eat]      [good]    │
│  RED       WHITE      GREEN      GREEN      ORANGE    │
├────────────────────────────────────────────────────────┤
│  [PEOPLE]  [PLACES]   [THINGS]   [FEELINGS] [ACTIONS] │
│  →folder   →folder    →folder    →folder    →folder   │
└────────────────────────────────────────────────────────┘
```

**Design notes:**
- Color-coded by word type
- Core words prominent
- Category folders for fringe vocabulary
- Consistent grid layout

### Topic Board (Example: Mealtime)

```
┌────────────────────────────────────────────────────────┐
│  [← Back]   [Home]              MEALTIME               │
├────────────────────────────────────────────────────────┤
│  [I want]   [more]     [all done]  [help]    [yucky]   │
├────────────────────────────────────────────────────────┤
│  [water]    [milk]     [juice]     [hot]     [cold]    │
├────────────────────────────────────────────────────────┤
│  [pizza]    [chicken]  [pasta]     [fruit]   [veggies] │
├────────────────────────────────────────────────────────┤
│  [spoon]    [fork]     [napkin]    [hungry]  [full]    │
├────────────────────────────────────────────────────────┤
│  [yummy]    [more please] [different] [too much] [cut] │
└────────────────────────────────────────────────────────┘
```

**Design notes:**
- Core words included (want, more, help)
- Context-specific vocabulary
- Mix of nouns, verbs, adjectives
- Navigation back to main board

### Quick Chat / Social Board

```
┌────────────────────────────────────────────────────────┐
│                    QUICK CHAT                          │
├────────────────────────────────────────────────────────┤
│                                                        │
│   [Hi!]           [How are you?]        [Bye!]        │
│                                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│   [I'm good]      [What's up?]          [See you!]    │
│                                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│   [Thank you]     [Please]              [Sorry]       │
│                                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│   [That's funny!] [Cool!]               [I don't know]│
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Design notes:**
- Complete phrases for quick social exchanges
- Large buttons for fast access
- Age-appropriate language
- Can be customized with personal greetings

---

## Testing Your Board

Before sharing a board, test it thoroughly.

### Self-Testing Checklist

#### Visual Check
- [ ] All text readable at arm's length?
- [ ] Colors pass contrast requirements?
- [ ] Symbols clearly distinguishable?
- [ ] Nothing cut off or overlapping?

#### Navigation Check
- [ ] Can reach all buttons via keyboard (Tab)?
- [ ] Is focus indicator clearly visible?
- [ ] Logical tab order (left→right, top→bottom)?
- [ ] Back/Home buttons work correctly?

#### Motor Access Check
- [ ] Touch targets at least 44×44px?
- [ ] Adequate spacing between buttons?
- [ ] Test switch scanning order?
- [ ] No accidental activation of adjacent buttons?

### Testing with Assistive Technology

#### Screen Reader Testing
1. Turn on VoiceOver (Mac/iOS) or NVDA/JAWS (Windows)
2. Navigate the entire board
3. Verify all symbols are announced correctly
4. Check button labels make sense in isolation

#### Switch Scanning Testing
1. Enable switch scanning in settings
2. Go through entire board with one switch
3. Time how long it takes to reach common words
4. Identify any awkward scan patterns

#### Eye Gaze Testing
If possible, test with eye tracking:
1. Can all buttons be reliably selected?
2. Are buttons large enough to distinguish?
3. Is there a place to rest gaze without triggering?

### Real-World Testing

The most important test: use with the actual communicator.

**Observe:**
- Do they find words quickly?
- Are they using unexpected symbols (might indicate vocabulary gaps)?
- What words do they reach for that aren't there?
- Are they frustrated by any interactions?

**Ask (if possible):**
- What words are missing?
- What would make this easier?
- What do you like?
- What's confusing?

---

## Cultural Considerations

Communication is deeply cultural. Design with awareness and respect.

### Language & Dialect

- Include regional vocabulary variations
- Consider formal vs. informal registers
- Respect dialectal differences (not "incorrect")
- Support multilingual users (code-switching is valid!)

### Symbols & Imagery

#### Religious & Spiritual
- Include diverse religious symbols if relevant
- Avoid assumptions about celebrations/holidays
- Respect dietary restrictions vocabulary

#### Family Structures
- Don't assume "Mom and Dad" household
- Include diverse family vocabulary (two moms, grandparent caregivers, etc.)
- Respect varied living situations

#### Foods & Daily Life
- Include culturally relevant foods
- Recognize different daily routines
- Consider regional activities and interests

### Representation in Symbols

- People symbols should reflect the user's identity
- Include diverse skin tones, hair types, abilities
- Avoid stereotypical representations
- Update symbols to reflect the user (their wheelchair, their family)

### Working with Translators

When creating boards for other languages:
- Work with native speakers
- Consider cultural meaning, not just word translation
- Test with users from that cultural background
- Be aware of right-to-left languages (Arabic, Hebrew)

---

## Quick Reference Checklist

Print this and check off as you design:

### Before You Start
- [ ] Who is this board for? (age, abilities, interests)
- [ ] What access method(s) will they use?
- [ ] What contexts will they use this board in?
- [ ] What vocabulary is most important for them?

### Visual Design
- [ ] Text contrast ratio ≥ 4.5:1
- [ ] Button contrast ratio ≥ 3:1
- [ ] Touch targets ≥ 44×44px
- [ ] Spacing between buttons ≥ 8px
- [ ] Consistent symbol style throughout
- [ ] Color coding with secondary indicators

### Accessibility
- [ ] Works with keyboard only
- [ ] Logical focus/scan order
- [ ] Visible focus indicator
- [ ] Screen reader compatible
- [ ] High contrast mode available
- [ ] Scales to 200% without breaking

### Content
- [ ] Core vocabulary prominently placed
- [ ] Fringe vocabulary organized logically
- [ ] Personal vocabulary included
- [ ] Age-appropriate language
- [ ] Culturally appropriate symbols

### Testing
- [ ] Tested on target device(s)
- [ ] Tested with intended access method
- [ ] Tested with assistive technology
- [ ] Tested with actual user (if possible)
- [ ] Gathered feedback and iterated

---

## Resources

### Symbol Libraries
- [Mulberry Symbols](https://mulberrysymbols.org/)
- [ARASAAC](https://arasaac.org/)
- [Sclera Symbols](https://www.sclera.be/)
- [OpenMoji](https://openmoji.org/)

### Accessibility Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WAVE Web Accessibility Evaluator](https://wave.webaim.org/)
- [axe DevTools](https://www.deque.com/axe/)

### Further Reading
- [USSAAC - Core Vocabulary](https://ussaac.org/)
- [PrAACtical AAC](https://praacticalaac.org/)
- [AssistiveWare - Core Word Resources](https://www.assistiveware.com/)

---

<p align="center">
  <em>A well-designed board doesn't just enable communication—it invites it.</em>
  <br><br>
  <strong>Happy designing!</strong>
</p>
