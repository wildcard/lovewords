# LoveWords Developer Guide

This guide covers the technical architecture, development setup, and contribution guidelines for LoveWords.

## Table of Contents

1. [Project Architecture](#project-architecture)
2. [Development Setup](#development-setup)
3. [Project Structure](#project-structure)
4. [Open Board Format (OBF)](#open-board-format-obf)
5. [Adding New Boards](#adding-new-boards)
6. [Component API](#component-api)
7. [Testing](#testing)
8. [Contributing](#contributing)

---

## Project Architecture

### Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Testing**: Vitest + @testing-library/react + jest-axe
- **Speech**: Web Speech API
- **Storage**: LocalStorage API
- **Deployment**: Vercel

### Design Principles

1. **Accessibility First**: WCAG 2.1 Level AA compliance
2. **Offline Capable**: Works without internet after initial load
3. **Privacy Focused**: No data sent to servers, all local storage
4. **Standard Compliant**: Open Board Format (OBF) specification
5. **Extensible**: Easy to add new boards and customize

---

## Development Setup

### Prerequisites

- Node.js 18+ and npm 9+
- Modern browser (Chrome, Firefox, Safari, or Edge)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/wildcard/lovewords.git
cd lovewords/lovewords-web

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/`

### Available Scripts

```bash
npm run dev          # Start development server with HMR
npm run build        # Build for production
npm run preview      # Preview production build
npm run typecheck    # Type-check without building
npm test             # Run tests
npm run test:ui      # Run tests with UI
```

---

## Project Structure

```
lovewords-web/
├── public/
│   └── boards/              # OBF board JSON files
│       ├── love-and-affection.json
│       ├── core-words.json
│       ├── basic-needs.json
│       ├── people.json
│       ├── feelings.json
│       ├── activities.json
│       ├── questions.json
│       └── time.json
├── src/
│   ├── components/          # React components
│   │   ├── Board.tsx        # Main board grid
│   │   ├── Cell.tsx         # Individual cell button
│   │   ├── MessageBar.tsx   # Message composition
│   │   ├── Navigation.tsx   # Top navigation
│   │   ├── Settings.tsx     # Settings modal
│   │   └── ScreenReaderAnnouncer.tsx
│   ├── core/                # Core logic
│   │   ├── board-navigator.ts    # Navigation state machine
│   │   └── cell-action.ts        # Action dispatch logic
│   ├── hooks/               # React hooks
│   │   ├── useSpeech.ts     # Web Speech API wrapper
│   │   ├── useAnnouncer.ts  # Screen reader announcements
│   │   └── useFocusTrap.ts  # Modal focus trapping
│   ├── storage/             # Storage layer
│   │   ├── types.ts         # Storage interface
│   │   └── local-storage.ts # LocalStorage implementation
│   ├── types/               # TypeScript types
│   │   ├── obf.ts           # OBF format types
│   │   ├── cell.ts          # Cell action types
│   │   └── profile.ts       # User profile types
│   ├── styles/
│   │   └── index.css        # Tailwind CSS + custom styles
│   ├── test/                # Test utilities
│   │   └── setup.ts         # Vitest configuration
│   ├── App.tsx              # Root component
│   └── main.tsx             # Application entry point
├── docs/
│   ├── USER_GUIDE.md        # User documentation
│   ├── DEVELOPER_GUIDE.md   # This file
│   └── OBF_SPECIFICATION.md # OBF format details
├── vitest.config.ts         # Test configuration
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

---

## Open Board Format (OBF)

### What is OBF?

The Open Board Format is a JSON-based standard for AAC communication boards. It enables interoperability between different AAC applications.

**Specification**: https://www.openboardformat.org/

### Board Structure

```typescript
interface ObfBoard {
  format: string;              // "open-board-0.1"
  id: string;                  // Unique identifier
  name: string;                // Display name
  locale: string;              // Language code (e.g., "en-US")
  description_html?: string;   // Optional description
  buttons: ObfButton[];        // Array of buttons
  images: ObfImage[];          // Image assets
  sounds: ObfSound[];          // Sound assets
  grid: ObfGrid;               // Layout configuration
  license?: ObfLicense;        // Licensing information

  // LoveWords extensions
  ext_lovewords_moment?: string;       // "daily", "intimate", etc.
  ext_lovewords_warmth?: string[];     // Tags like "romantic", "playful"
}
```

### Button Actions

LoveWords recognizes these OBF actions:

| Action | Behavior | Example |
|--------|----------|---------|
| `:speak` | Speak the vocalization immediately | "I love you" |
| `:add` | Add word to message bar | "I", "want", "help" |
| `:back` | Navigate to previous board | Back button |
| `:home` | Navigate to home board | Home button |
| `:clear` | Clear the message bar | Clear button |
| `:backspace` | Remove last word from message | ⌫ button |
| `load_board` | Navigate to another board | Load "core-words" |

### LoveWords Extensions

We use the `ext_lovewords_` prefix for custom properties:

```json
{
  "ext_lovewords_moment": "daily",
  "ext_lovewords_warmth": ["affection", "romantic"],
  "ext_lovewords_intimacy_level": 4,
  "ext_lovewords_partner_specific": true,
  "ext_lovewords_tone": "warm"
}
```

These extensions help categorize and filter boards for different contexts.

---

## Adding New Boards

### Step 1: Create the OBF JSON File

Create a new file in `public/boards/your-board-name.json`:

```json
{
  "format": "open-board-0.1",
  "id": "your-board-name",
  "name": "Your Board Name",
  "locale": "en-US",
  "description_html": "<p>Description of your board.</p>",
  "buttons": [
    {
      "id": "btn_example",
      "label": "Example",
      "vocalization": "This is an example",
      "action": ":speak",
      "background_color": "#FFB6C1"
    }
  ],
  "images": [],
  "sounds": [],
  "grid": {
    "rows": 4,
    "columns": 4,
    "order": [
      ["btn_example", null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null]
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

### Step 2: Register the Board

Edit `src/storage/local-storage.ts`:

```typescript
async listBoards(): Promise<string[]> {
  return [
    'love-and-affection',
    'core-words',
    'basic-needs',
    'people',
    'feelings',
    'activities',
    'questions',
    'time',
    'your-board-name'  // Add your board here
  ];
}
```

### Step 3: Add Navigation Links

Add navigation buttons to relevant boards:

```json
{
  "id": "btn_your_board",
  "label": "Your Board",
  "load_board": {
    "id": "your-board-name"
  },
  "background_color": "#87CEEB"
}
```

### Step 4: Test Your Board

```bash
npm run dev
# Navigate to your new board
# Test all buttons
# Check accessibility with keyboard and screen reader
```

### Design Guidelines

**Button Colors:**
- Pink shades (#FFB6C1, #FF69B4): Love/affection
- Blue shades (#87CEEB, #B0E0E6): Neutral/pronouns
- Green shades (#98FB98, #90EE90): Actions/needs
- Yellow (#FFD700): Emotions/positive
- Red/Coral (#FF6B6B, #FFA07A): Important/editing
- Purple (#DDA0DD): Questions/misc
- Gray (#D3D3D3): Navigation/system

**Grid Layouts:**
- Most boards: 4-5 rows × 4 columns
- Leave bottom row for navigation buttons
- Include Back/Home buttons

**Accessibility:**
- Provide clear, concise labels
- Include vocalization for screen readers
- Use high-contrast colors
- Test with keyboard navigation

---

## Component API

### Board Component

```typescript
interface BoardProps {
  board: ObfBoard;                    // Board data
  onCellClick: (row: number, col: number) => void;
  focusedCell?: { row: number; col: number };
}

<Board
  board={currentBoard}
  onCellClick={handleCellClick}
  focusedCell={{ row: 0, col: 0 }}
/>
```

### Cell Component

```typescript
interface CellProps {
  button?: ObfButton;                 // Button data (undefined for empty cells)
  onClick: () => void;
  isFocused?: boolean;
  cellRef?: React.RefObject<HTMLButtonElement>;
  rowIndex?: number;                  // ARIA grid index (1-based)
  colIndex?: number;                  // ARIA grid index (1-based)
}

<Cell
  button={button}
  onClick={() => handleClick()}
  isFocused={true}
  rowIndex={1}
  colIndex={1}
/>
```

### MessageBar Component

```typescript
interface MessageBarProps {
  message: string;                    // Current message text
  onSpeak: () => void;               // Speak message callback
  onClear: () => void;               // Clear message callback
  onBackspace: () => void;           // Backspace callback
  isSpeaking?: boolean;              // Speech active state
}

<MessageBar
  message={currentMessage}
  onSpeak={speak}
  onClear={clear}
  onBackspace={backspace}
  isSpeaking={false}
/>
```

### Settings Component

```typescript
interface SettingsProps {
  profile: Profile;                   // Current profile settings
  voices: SpeechSynthesisVoice[];    // Available voices
  onChange: (profile: Profile) => void;
  onClose: () => void;
  onTestSpeech: () => void;
}

<Settings
  profile={currentProfile}
  voices={availableVoices}
  onChange={updateProfile}
  onClose={closeSettings}
  onTestSpeech={testSpeech}
/>
```

### Custom Hooks

```typescript
// useSpeech - Web Speech API wrapper
const { speak, isSpeaking, voices } = useSpeech(speechSettings);

// useAnnouncer - Screen reader announcements
const { announcement, announce } = useAnnouncer();
announce("Message text", "polite" | "assertive");

// useFocusTrap - Modal focus management
const dialogRef = useFocusTrap<HTMLDivElement>(true);
```

---

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test Cell.accessibility.test

# Watch mode
npm test -- --watch

# UI mode
npm run test:ui
```

### Test Structure

```typescript
describe('Component Name', () => {
  it('should do something', () => {
    // Arrange
    const props = { /* test props */ };

    // Act
    render(<Component {...props} />);

    // Assert
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

### Accessibility Testing

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('should have no accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing Checklist

Before submitting a PR:

- [ ] Test with keyboard only (no mouse)
- [ ] Test with screen reader (VoiceOver/NVDA)
- [ ] Test at 200% browser zoom
- [ ] Test on mobile device
- [ ] Verify no console errors
- [ ] Run automated tests
- [ ] Check accessibility with Lighthouse

---

## Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Write tests for new features
   - Update documentation
   - Follow code style guidelines
4. **Run tests**
   ```bash
   npm test
   npm run typecheck
   ```
5. **Commit with descriptive messages**
   ```bash
   git commit -m "Add new feelings board with 15 emotions"
   ```
6. **Push and create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style

**TypeScript:**
- Use strict TypeScript (no `any`)
- Define interfaces for all component props
- Use type imports: `import type { ... }`

**React:**
- Functional components with hooks
- Props destructuring in parameters
- Use `useCallback` for event handlers
- Use `useMemo` for expensive computations

**CSS:**
- Use Tailwind utility classes
- Custom styles in `src/styles/index.css`
- Follow existing color patterns

**Accessibility:**
- Always include ARIA labels
- Test with keyboard navigation
- Ensure screen reader compatibility
- Maintain focus order

### Pull Request Guidelines

**PR Title Format:**
```
[Type] Brief description

Examples:
[Feature] Add weather-themed communication board
[Fix] Resolve keyboard navigation bug in Settings
[Docs] Update developer guide with OBF examples
[A11y] Improve screen reader announcements
```

**PR Description Should Include:**
- What changed and why
- How to test the changes
- Screenshots/videos if UI changed
- Accessibility testing results
- Related issues (fixes #123)

### Review Process

All PRs require:
1. Passing automated tests
2. No TypeScript errors
3. Accessibility review
4. Code review approval
5. Documentation updates (if needed)

---

## Architecture Decisions

### Why React?

- **Component-based**: Natural fit for grid-based UI
- **Accessibility support**: Good ARIA integration
- **Ecosystem**: Rich tooling and testing libraries
- **Performance**: Efficient updates with Virtual DOM

### Why Vite?

- **Fast HMR**: Instant feedback during development
- **Modern**: Native ESM support
- **Simple**: Minimal configuration
- **Production-ready**: Optimized builds

### Why LocalStorage?

- **Privacy**: All data stays on device
- **Offline**: Works without internet
- **Simple**: No backend required
- **Standard**: Widely supported API

### Why Web Speech API?

- **Built-in**: No external dependencies
- **High-quality**: Native voices on all platforms
- **Accessible**: Screen reader compatible
- **Customizable**: Rate, pitch, volume control

---

## Performance Optimization

### Current Optimizations

1. **Code Splitting**: Vite automatically splits chunks
2. **Tree Shaking**: Unused code removed in production
3. **Lazy Loading**: Boards loaded on-demand
4. **Memoization**: `useCallback` and `useMemo` for expensive operations

### Future Optimizations

- [ ] Preload adjacent boards
- [ ] Image lazy loading
- [ ] Service worker for offline caching
- [ ] WASM for Rust core integration

---

## Deployment

### Vercel Deployment

The project is deployed to Vercel automatically:

1. **Main branch**: Deploys to production
   - URL: https://lovewords-web.vercel.app/
2. **Pull requests**: Deploy previews
   - URL: https://lovewords-web-{pr-id}.vercel.app/

### Manual Deployment

```bash
# Build for production
npm run build

# Output directory: dist/
# Deploy dist/ to any static hosting service
```

### Environment Variables

None required! The app is entirely client-side.

---

## Troubleshooting

### Build Errors

**TypeScript errors:**
```bash
npm run typecheck  # Find type errors
```

**Vite errors:**
```bash
rm -rf node_modules/.vite  # Clear Vite cache
npm install                # Reinstall dependencies
```

### Test Failures

**Clear test cache:**
```bash
npm test -- --clearCache
```

**Update snapshots:**
```bash
npm test -- --updateSnapshot
```

---

## Resources

### Documentation

- [OBF Specification](https://www.openboardformat.org/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Community

- GitHub Issues: Report bugs and request features
- Discussions: Ask questions and share ideas
- Pull Requests: Contribute code

---

**Happy coding!** 🚀

If you have questions, open an issue or start a discussion on GitHub.
