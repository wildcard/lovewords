# LoveWords Web Client

A React/TypeScript web application for LoveWords - an AAC (Augmentative and Alternative Communication) board for expressing love and affection.

## Features

### Core Functionality
- 🎨 **Visual Communication Board**: Customizable grid layouts (3×3, 4×4, 5×4, 6×6)
- 🔊 **Text-to-Speech**: Web Speech API for speaking phrases
- 💬 **Message Building**: Compose messages word-by-word with message bar
- ⌨️ **Keyboard Navigation**: Arrow keys + Enter for accessibility
- 🔄 **Switch Scanning**: Single-switch row-column scanning for accessibility
- ♿ **Fully Accessible**: ARIA labels, keyboard support, focus management
- 📱 **Mobile-Friendly**: Touch interactions and responsive layout

### Custom Boards (Sprint 2)
- ➕ **Create Custom Boards**: Design your own communication boards
- ✏️ **Edit Buttons**: Add, edit, and delete buttons with custom labels
- 🎨 **Color Customization**: Custom background and border colors
- 📸 **Image Upload**: Upload images from device or camera
- 📷 **Camera Integration**: Take photos directly on mobile devices
- 🖼️ **Auto-Optimization**: Images automatically resized and compressed
- 🔀 **Drag-and-Drop**: Reorder buttons by dragging (edit mode)
- 📚 **Board Library**: Manage all your boards in one place
- 🔍 **Search Boards**: Quickly find boards by name or description

### Settings & Personalization
- 💾 **Local Storage**: All boards and settings persist across sessions
- 🎵 **Voice Selection**: Choose from available system voices
- ⚡ **Speech Controls**: Adjust rate, pitch, and volume
- 🌓 **Theme Options**: Light, dark, or auto mode
- 📏 **Text Size**: Customize button label sizes (50%-200%)
- 👁️ **Display Toggles**: Show/hide labels and images

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
- **📚 My Boards**: View and manage all boards
- **➕ Create Board**: Create a new custom board
- **⚙️ Settings**: Open settings panel

### Custom Board Creation

Click the **➕ Create Board** button to create your own communication board:

1. **Enter board name** (required, 3-50 characters)
2. **Enter description** (optional)
3. **Select grid size**: Choose from 3×3, 4×4, 5×4, or 6×6
4. Click **Create Board**
5. Navigate to your new board automatically

### Editing Custom Boards

On custom boards, click **✏️ Edit Board** to enter edit mode:

**Add/Edit Buttons:**
1. Click any cell to open the Button Editor
2. Enter label text (required)
3. Enter vocalization text (optional, defaults to label)
4. Select action type (Speak, Add to Message, Navigate, etc.)
5. Customize colors (background, border)
6. Upload an image (optional)
7. Click **Save Button**

**Delete Buttons:**
1. In edit mode, click existing button
2. Click **🗑️ Delete Button**
3. Confirm deletion

**Reorder Buttons (Drag-and-Drop):**
1. In edit mode, drag buttons to new positions
2. Buttons swap positions automatically
3. Changes save immediately

**Exit Edit Mode:**
- Click **✓ Done Editing** when finished

### Image Upload

When editing a button, you can add images:

**From Device:**
1. Click **Upload Image** button
2. Select image file (JPG, PNG, GIF, WebP)
3. Image automatically optimized to ~200×200px, <100KB
4. Preview appears
5. Click **Save Button**

**From Camera (Mobile Only):**
1. Click **📷 Take Photo** button (appears on mobile)
2. Grant camera permission (first time)
3. Take photo with rear camera
4. Photo automatically optimized
5. Click **Save Button**

**Replace/Remove:**
- **Replace Image**: Upload a new image
- **Remove Image**: Delete the image from button

### Board Library

Click **📚 My Boards** to manage all boards:

**Features:**
- View all default and custom boards
- Search boards by name or description
- Navigate to any board
- Edit custom board metadata
- Delete custom boards (with confirmation)
- Default boards are protected (cannot edit/delete)

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

**Board Navigation:**
- `Arrow Keys`: Navigate between cells
- `Enter` or `Space`: Activate focused cell
- `Tab`: Move focus through interface

**Edit Mode (Custom Boards):**
- `Space`: Grab/drop button for drag-and-drop
- `Arrow Keys`: Move grabbed button
- `Escape`: Close modals

**Accessibility:**
- `S`: Toggle switch scanning mode
- `Any key`: Select cell in switch scanning mode

## Architecture

### Technology Stack

- **React 18**: UI framework with hooks
- **TypeScript**: Type safety and IntelliSense
- **Vite**: Build tool and dev server (HMR)
- **Tailwind CSS**: Utility-first styling
- **Web Speech API**: Text-to-speech synthesis
- **@dnd-kit**: Accessible drag-and-drop
- **Canvas API**: Image optimization

### Project Structure

```
lovewords-web/
├── public/
│   └── boards/              # Board JSON files
│       └── love-and-affection.json
├── src/
│   ├── components/          # React components
│   │   ├── Board.tsx        # Grid display with drag-and-drop
│   │   ├── Cell.tsx         # Individual button (draggable)
│   │   ├── MessageBar.tsx   # Message display
│   │   ├── Navigation.tsx   # Nav controls
│   │   ├── Settings.tsx     # Settings panel
│   │   ├── BoardCreator.tsx # Custom board creation
│   │   ├── ButtonEditor.tsx # Button add/edit/delete
│   │   ├── ImageUploader.tsx # Image upload & camera
│   │   └── BoardLibrary.tsx # Board management
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

## Sprint Roadmap

### ✅ Sprint 1 - MVP Core Features (Complete)
- [x] Settings panel (voice selection, rate, pitch, volume)
- [x] Theme customization (light/dark mode)
- [x] Switch scanning mode for single-switch users

### ✅ Sprint 2 - Custom Boards & Images (Complete)
- [x] Custom board creation with grid size selection
- [x] Button editor (add, edit, delete with colors)
- [x] Image upload from device
- [x] Camera integration (mobile devices)
- [x] Board library (view, search, manage boards)
- [x] Drag-and-drop button repositioning

### 📋 Sprint 3 - Sharing & Templates (Planned)
- [ ] Board export/import (OBF file format)
- [ ] Image library (reuse images across boards)
- [ ] Undo/redo system
- [ ] Board templates (emotions, needs, activities)
- [ ] Share boards via link or QR code

### 🚀 Future Enhancements
- [ ] Offline PWA support
- [ ] Multi-language support
- [ ] Cloud sync (optional backend)
- [ ] Export message history
- [ ] Voice recording (custom audio for buttons)
- [ ] Usage analytics and learning suggestions
- [ ] Multi-user support with profiles
- [ ] Contextual board suggestions (time, location, activity)

## Testing

### Manual Testing Checklists
Comprehensive testing guides are available in the `docs/` directory:

- **[SPRINT_2_TESTING_CHECKLIST.md](docs/SPRINT_2_TESTING_CHECKLIST.md)** - Full feature testing (~100 test cases)
- **[DRAG_DROP_TESTING_GUIDE.md](docs/DRAG_DROP_TESTING_GUIDE.md)** - Detailed drag-and-drop testing
- **[MOBILE_CAMERA_TESTING.md](docs/MOBILE_CAMERA_TESTING.md)** - Camera integration testing

### Test Environments
- Desktop browsers: Chrome, Firefox, Safari, Edge
- Mobile browsers: iOS Safari, Android Chrome
- Accessibility: NVDA, VoiceOver, TalkBack

### Running Tests
```bash
# Unit tests (when available)
npm test

# Type checking
npm run typecheck

# Production build test
npm run build
npm run preview
```

## License

Part of the LoveWords project - see the main repository for license information.

## Credits

Built with ❤️ using:
- [React](https://react.dev/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [dnd kit](https://dndkit.com/) - Accessible drag-and-drop
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) - Text-to-speech
