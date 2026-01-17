# LoveWords Web Client

A React/TypeScript web application for LoveWords - an AAC (Augmentative and Alternative Communication) board for expressing love and affection.

## Features

- 🎨 **Visual Communication Board**: 3x4 grid layout with colorful cells
- 🔊 **Text-to-Speech**: Web Speech API for speaking phrases
- ⌨️ **Keyboard Navigation**: Arrow keys + Enter for accessibility
- 💾 **Local Storage**: Profile settings persist across sessions
- ♿ **Accessible**: ARIA labels, keyboard support, focus management
- 📱 **Responsive**: Mobile-friendly layout with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
cd lovewords-web
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Production Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### Type Checking

Run TypeScript type checking:

```bash
npm run typecheck
```

### Testing

Run tests (when available):

```bash
npm test
```

## Usage

### Basic Interaction

1. **Click a cell** to speak the phrase
2. **Use arrow keys** to navigate between cells
3. **Press Enter** to activate the focused cell
4. **Build messages** using the message bar at the top

### Message Bar

- **🔊 Speak**: Speak the accumulated message
- **⌫ Backspace**: Remove the last word
- **Clear**: Clear the entire message

### Navigation

- **← Back**: Return to the previous board
- **🏠 Home**: Return to the home board
- **⚙️ Settings**: Open settings panel

### Settings

Click the **⚙️ Settings** button to customize your experience:

**Speech Settings:**
- **Voice**: Select from available system voices
- **Speed**: Adjust speech rate (0.1x - 2x)
- **Pitch**: Adjust voice pitch (0 - 2)
- **Volume**: Control speech volume (0% - 100%)
- **Test Speech**: Preview your settings

**Display Settings:**
- **Theme**: Choose light, dark, or auto mode
- **Text Size**: Adjust button label size (50% - 200%)
- **Show Labels**: Toggle button text labels
- **Show Images**: Toggle button images

All settings are automatically saved to localStorage.

### Keyboard Shortcuts

- `Arrow Keys`: Navigate between cells
- `Enter` or `Space`: Activate focused cell
- `Escape`: (reserved for future use)

## Architecture

### Technology Stack

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling
- **Web Speech API**: Text-to-speech synthesis

### Project Structure

```
lovewords-web/
├── public/
│   └── boards/              # Board JSON files
│       └── love-and-affection.json
├── src/
│   ├── components/          # React components
│   │   ├── Board.tsx        # Grid display
│   │   ├── Cell.tsx         # Individual button
│   │   ├── MessageBar.tsx   # Message display
│   │   ├── Navigation.tsx   # Nav controls
│   │   └── Settings.tsx     # Settings panel
│   ├── core/                # Core logic
│   │   ├── board-navigator.ts  # Navigation state
│   │   └── cell-action.ts      # Action logic
│   ├── hooks/               # React hooks
│   │   └── useSpeech.ts     # Speech synthesis
│   ├── speech/              # Speech engine
│   │   ├── types.ts
│   │   └── web-speech.ts
│   ├── storage/             # Storage backend
│   │   ├── types.ts
│   │   └── local-storage.ts
│   ├── types/               # TypeScript types
│   │   ├── obf.ts           # OBF format
│   │   ├── cell.ts          # Cell actions
│   │   └── profile.ts       # User profile
│   ├── styles/              # CSS
│   │   └── index.css
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
└── README.md
```

### Type System

The web client uses TypeScript types that mirror the Rust core types:

- **ObfBoard**: Open Board Format board definition
- **CellAction**: Union type for cell actions (Speak, Navigate, Back, etc.)
- **Profile**: User profile with speech and display settings

### State Management

- **BoardNavigator**: State machine for board navigation and message building
- **React useState**: Component-level state
- **localStorage**: Persistent settings

## Browser Support

- Chrome/Edge 33+ (Web Speech API)
- Firefox 49+ (Web Speech API)
- Safari 14.1+ (Web Speech API)
- Mobile browsers with Web Speech API support

## Accessibility

- ♿ **ARIA labels**: All interactive elements have descriptive labels
- ⌨️ **Keyboard navigation**: Full keyboard support
- 🎯 **Focus management**: Visible focus indicators
- 🔊 **Screen reader**: Compatible with screen readers

## Future Enhancements

- [x] Settings panel (voice selection, rate, pitch, volume)
- [x] Theme customization (light/dark mode)
- [ ] Switch scanning mode for single-switch users
- [ ] Custom board creation
- [ ] Board sharing and import
- [ ] Offline PWA support
- [ ] Multi-language support
- [ ] Additional boards (emotions, needs, activities)
- [ ] Export message history

## License

Part of the LoveWords project - see the main repository for license information.

## Credits

Built with ❤️ using:
- React
- TypeScript
- Vite
- Tailwind CSS
- Web Speech API
