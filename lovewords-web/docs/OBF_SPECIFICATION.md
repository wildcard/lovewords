# Open Board Format (OBF) Specification for LoveWords

This document details how LoveWords implements the Open Board Format specification, including standard features and custom extensions.

## Table of Contents

1. [OBF Overview](#obf-overview)
2. [Board Structure](#board-structure)
3. [Button Types](#button-types)
4. [Actions](#actions)
5. [Grid Layout](#grid-layout)
6. [LoveWords Extensions](#lovewords-extensions)
7. [Examples](#examples)
8. [Validation](#validation)

---

## OBF Overview

### What is OBF?

The **Open Board Format** (OBF) is an open specification for AAC communication boards. It uses JSON to define boards, making them:

- **Portable**: Work across different AAC applications
- **Human-readable**: Easy to create and edit
- **Extensible**: Support custom properties
- **Interoperable**: Share boards between applications

**Official Specification**: https://www.openboardformat.org/

### LoveWords Implementation

LoveWords implements **OBF version 0.1** with custom extensions for relationship-focused communication.

**Supported Features:**
- ✅ Button grid layouts
- ✅ Multiple action types (`:speak`, `:add`, load_board, etc.)
- ✅ Images and sounds (structure defined, not yet implemented)
- ✅ Localization support
- ✅ Custom extensions via `ext_lovewords_*` prefix

---

## Board Structure

### Minimal Board

```json
{
  "format": "open-board-0.1",
  "id": "example-board",
  "name": "Example Board",
  "locale": "en",
  "buttons": [],
  "images": [],
  "sounds": [],
  "grid": {
    "rows": 1,
    "columns": 1,
    "order": [[null]]
  }
}
```

### Full Board Schema

```typescript
interface ObfBoard {
  // Required fields
  format: string;              // Must be "open-board-0.1"
  id: string;                  // Unique identifier (kebab-case recommended)
  name: string;                // Display name
  locale: string;              // Language code (e.g., "en-US", "en")
  buttons: ObfButton[];        // Array of button definitions
  images: ObfImage[];          // Image assets (can be empty array)
  sounds: ObfSound[];          // Sound assets (can be empty array)
  grid: ObfGrid;               // Layout configuration

  // Optional fields
  description_html?: string;   // HTML description
  url?: string;                // Source URL
  license?: ObfLicense;        // Licensing information

  // LoveWords custom extensions
  ext_lovewords_moment?: string;
  ext_lovewords_warmth?: string[];
  ext_lovewords_intimacy_level?: number;
  ext_lovewords_partner_specific?: boolean;
  ext_lovewords_tone?: string;
}
```

---

## Button Types

### Standard Button

```json
{
  "id": "btn_hello",
  "label": "Hello",
  "vocalization": "Hello, how are you?",
  "action": ":speak",
  "background_color": "#FFB6C1",
  "border_color": "#FF69B4",
  "hidden": false
}
```

### Button with Load Board

```json
{
  "id": "btn_navigate",
  "label": "Core Words",
  "load_board": {
    "id": "core-words",
    "url": "/boards/core-words.json"
  },
  "background_color": "#B0E0E6"
}
```

### Button Schema

```typescript
interface ObfButton {
  // Required
  id: string;                  // Unique within the board

  // Display
  label: string;               // Text displayed on button
  vocalization?: string;       // Text spoken (defaults to label)
  image_id?: string;           // Reference to images array
  sound_id?: string;           // Reference to sounds array
  background_color?: string;   // Hex color (e.g., "#FFB6C1")
  border_color?: string;       // Hex color for border

  // Actions
  action?: string;             // ":speak", ":add", ":back", etc.
  load_board?: {               // Navigate to another board
    id?: string;
    url?: string;
    data_url?: string;
  };

  // Behavior
  hidden?: boolean;            // Hide button (false by default)

  // LoveWords extensions
  ext_lovewords_warmth?: string[];
  ext_lovewords_intimacy_level?: number;
  ext_lovewords_partner_specific?: boolean;
  ext_lovewords_tone?: string;
}
```

---

## Actions

LoveWords supports these button actions:

### `:speak` - Immediate Speech

Speak the button's vocalization immediately.

```json
{
  "id": "btn_love",
  "label": "I love you",
  "vocalization": "I love you",
  "action": ":speak",
  "background_color": "#FFB6C1"
}
```

**Behavior:**
- Speaks vocalization (or label if no vocalization)
- Does not add to message bar
- Used for complete phrases

### `:add` - Add to Message

Add the button's label/vocalization to the message bar.

```json
{
  "id": "btn_i",
  "label": "I",
  "action": ":add",
  "background_color": "#87CEEB"
}
```

**Behavior:**
- Adds word to message bar
- User can build sentences
- Speak when "Speak" button pressed

### `:back` - Navigate Back

Return to the previous board.

```json
{
  "id": "btn_back",
  "label": "Back",
  "action": ":back",
  "background_color": "#D3D3D3"
}
```

### `:home` - Navigate Home

Return to the home board (love-and-affection).

```json
{
  "id": "btn_home",
  "label": "Home",
  "action": ":home",
  "background_color": "#D3D3D3"
}
```

### `:clear` - Clear Message

Clear all words from the message bar.

```json
{
  "id": "btn_clear",
  "label": "Clear",
  "action": ":clear",
  "background_color": "#F08080"
}
```

### `:backspace` - Remove Last Word

Remove the last word from the message bar.

```json
{
  "id": "btn_backspace",
  "label": "⌫",
  "vocalization": "Backspace",
  "action": ":backspace",
  "background_color": "#FFA07A"
}
```

### `load_board` - Navigate to Board

Load another board.

```json
{
  "id": "btn_feelings",
  "label": "Feelings",
  "load_board": {
    "id": "feelings"
  },
  "background_color": "#FFD700"
}
```

---

## Grid Layout

### Grid Structure

```typescript
interface ObfGrid {
  rows: number;                // Number of rows
  columns: number;             // Number of columns
  order: (string | null)[][];  // 2D array of button IDs or null
}
```

### Example: 2x3 Grid

```json
{
  "grid": {
    "rows": 2,
    "columns": 3,
    "order": [
      ["btn_1", "btn_2", "btn_3"],
      ["btn_4", null, "btn_6"]
    ]
  }
}
```

**Notes:**
- `null` represents an empty cell
- Grid dimensions must match order array
- Button IDs must exist in buttons array

### Common Layouts

**4x4 Grid** (Most common in LoveWords):
```json
{
  "rows": 4,
  "columns": 4,
  "order": [
    ["btn_1", "btn_2", "btn_3", "btn_4"],
    ["btn_5", "btn_6", "btn_7", "btn_8"],
    ["btn_9", "btn_10", "btn_11", "btn_12"],
    ["btn_back", "btn_home", null, null]
  ]
}
```

**5x4 Grid** (Extended layout):
```json
{
  "rows": 5,
  "columns": 4,
  "order": [
    ["btn_1", "btn_2", "btn_3", "btn_4"],
    ["btn_5", "btn_6", "btn_7", "btn_8"],
    ["btn_9", "btn_10", "btn_11", "btn_12"],
    ["btn_13", "btn_14", "btn_15", "btn_16"],
    ["btn_back", "btn_home", "btn_nav1", "btn_nav2"]
  ]
}
```

---

## LoveWords Extensions

LoveWords adds custom properties using the `ext_lovewords_` prefix.

### Board-Level Extensions

```json
{
  "ext_lovewords_moment": "daily",
  "ext_lovewords_warmth": ["affection", "caring"]
}
```

**`ext_lovewords_moment`**
- **Type**: `string`
- **Values**: `"daily"`, `"intimate"`, `"playful"`, `"supportive"`
- **Purpose**: Categorize boards by context/mood

**`ext_lovewords_warmth`**
- **Type**: `string[]`
- **Values**: `["affection", "romantic", "playful", "caring", "gratitude", "comfort"]`
- **Purpose**: Tag emotional tone of board

### Button-Level Extensions

```json
{
  "ext_lovewords_warmth": ["romantic"],
  "ext_lovewords_intimacy_level": 4,
  "ext_lovewords_partner_specific": true,
  "ext_lovewords_tone": "warm"
}
```

**`ext_lovewords_warmth`**
- **Type**: `string[]`
- **Purpose**: Emotional tags for the button

**`ext_lovewords_intimacy_level`**
- **Type**: `number` (1-5 scale)
- **Purpose**: Indicates intimacy level (1=casual, 5=very intimate)

**`ext_lovewords_partner_specific`**
- **Type**: `boolean`
- **Purpose**: Indicates if phrase is for romantic partner only

**`ext_lovewords_tone`**
- **Type**: `string`
- **Values**: `"warm"`, `"playful"`, `"soft"`, `"sincere"`, `"casual"`
- **Purpose**: Tone of the phrase

---

## Examples

### Complete Example: Simple Board

```json
{
  "format": "open-board-0.1",
  "id": "greetings",
  "name": "Greetings",
  "locale": "en-US",
  "description_html": "<p>Common greetings and farewells.</p>",
  "buttons": [
    {
      "id": "btn_hello",
      "label": "Hello",
      "vocalization": "Hello!",
      "action": ":speak",
      "background_color": "#98FB98"
    },
    {
      "id": "btn_goodbye",
      "label": "Goodbye",
      "vocalization": "Goodbye, see you later!",
      "action": ":speak",
      "background_color": "#B0E0E6"
    },
    {
      "id": "btn_back",
      "label": "Back",
      "action": ":back",
      "background_color": "#D3D3D3"
    },
    {
      "id": "btn_home",
      "label": "Home",
      "action": ":home",
      "background_color": "#D3D3D3"
    }
  ],
  "images": [],
  "sounds": [],
  "grid": {
    "rows": 2,
    "columns": 2,
    "order": [
      ["btn_hello", "btn_goodbye"],
      ["btn_back", "btn_home"]
    ]
  },
  "license": {
    "type": "CC BY-SA 4.0",
    "url": "https://creativecommons.org/licenses/by-sa/4.0/",
    "author_name": "LoveWords Project",
    "author_url": "https://github.com/wildcard/lovewords"
  }
}
```

### Complete Example: Word Building Board

```json
{
  "format": "open-board-0.1",
  "id": "simple-sentences",
  "name": "Simple Sentences",
  "locale": "en",
  "buttons": [
    {
      "id": "btn_i",
      "label": "I",
      "action": ":add",
      "background_color": "#FFE4B5"
    },
    {
      "id": "btn_want",
      "label": "want",
      "action": ":add",
      "background_color": "#98FB98"
    },
    {
      "id": "btn_help",
      "label": "help",
      "action": ":add",
      "background_color": "#87CEEB"
    },
    {
      "id": "btn_backspace",
      "label": "⌫",
      "vocalization": "Backspace",
      "action": ":backspace",
      "background_color": "#FFA07A"
    }
  ],
  "images": [],
  "sounds": [],
  "grid": {
    "rows": 2,
    "columns": 2,
    "order": [
      ["btn_i", "btn_want"],
      ["btn_help", "btn_backspace"]
    ]
  }
}
```

---

## Validation

### Required Fields Checklist

**Board Level:**
- [ ] `format` = "open-board-0.1"
- [ ] `id` (unique, lowercase with hyphens)
- [ ] `name` (display name)
- [ ] `locale` (valid language code)
- [ ] `buttons` (array, can be empty)
- [ ] `images` (array, can be empty)
- [ ] `sounds` (array, can be empty)
- [ ] `grid` (valid grid structure)

**Button Level:**
- [ ] `id` (unique within board)
- [ ] `label` (display text)
- [ ] One of: `action`, `load_board`, or both

**Grid Level:**
- [ ] `rows` (positive integer)
- [ ] `columns` (positive integer)
- [ ] `order` (2D array matching dimensions)
- [ ] All button IDs in `order` exist in `buttons`

### Common Validation Errors

**Error**: Button ID not found
```json
// WRONG: btn_missing not in buttons array
"order": [["btn_missing", null]]
```

**Error**: Grid dimensions mismatch
```json
// WRONG: order has 3 columns but columns is 2
"columns": 2,
"order": [["btn_1", "btn_2", "btn_3"]]
```

**Error**: Invalid action
```json
// WRONG: :invalid is not a recognized action
"action": ":invalid"
```

### TypeScript Validation

Use the provided TypeScript types for compile-time validation:

```typescript
import type { ObfBoard } from './types/obf';

const myBoard: ObfBoard = {
  format: "open-board-0.1",
  id: "my-board",
  name: "My Board",
  locale: "en",
  buttons: [],
  images: [],
  sounds: [],
  grid: {
    rows: 1,
    columns: 1,
    order: [[null]]
  }
};
```

---

## Best Practices

### IDs

- Use lowercase with hyphens: `love-and-affection`
- Prefix buttons: `btn_love`, `btn_home`
- Be descriptive: `btn_i_love_you` not `btn_1`

### Colors

- Use hex colors: `#FFB6C1`
- Ensure sufficient contrast (WCAG AA: 4.5:1 minimum)
- Follow LoveWords color scheme for consistency

### Vocalization

- Provide clear, complete phrases
- Include punctuation for natural speech
- Test with Web Speech API

### Labels

- Keep short (1-4 words)
- Use title case or sentence case consistently
- Consider button size when labeling

### Grid Layout

- Reserve bottom row for navigation
- Group related concepts together
- Leave empty cells for visual spacing

---

## Resources

- **OBF Specification**: https://www.openboardformat.org/
- **LoveWords Repository**: https://github.com/wildcard/lovewords
- **Example Boards**: `/public/boards/` directory

---

**Questions?** Open an issue on GitHub!
