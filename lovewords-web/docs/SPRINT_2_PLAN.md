# Sprint 2 Plan - Custom Boards & Image Support

**Sprint Goal**: Enable users to create personalized boards with photos
**Duration**: 3 weeks (15 working days)
**Priority**: P0 (Blocker for MVP)
**Status**: Planning

---

## Context

**Problem**: Users cannot personalize LoveWords with their own vocabulary and photos. Current boards are generic and don't fit individual needs.

**Solution**: Build a custom board editor that allows users to:
- Create new boards from scratch
- Add buttons with custom labels, vocalizations, colors
- Upload photos from their device or take photos with camera
- Organize buttons in a grid
- Save boards to localStorage

**Why now**: This is the #1 feature gap preventing MVP launch. Without custom boards, LoveWords is just a static demo.

---

## Sprint Backlog

### Week 1: Board Creation Foundation

#### Day 1-2: Board Creation UI

**Features**:
- "Create Board" button in navigation
- Modal/page for board creation with form:
  - Board name (text input, required)
  - Description (textarea, optional)
  - Grid size (dropdown: 3x3, 4x4, 5x4, 6x6)
  - Locale (default: en-US)
- "Create" button generates empty OBF board
- Save to localStorage
- Add to navigation menu

**Technical Tasks**:
- [ ] Create `BoardCreator` component with form
- [ ] Add validation (name required, grid size valid)
- [ ] Generate OBF structure from form data
- [ ] Save to `localStorage.boards` array
- [ ] Update `BoardNavigator` to load custom boards
- [ ] Add custom boards to navigation breadcrumbs

**Acceptance Criteria**:
- User can create an empty board with a name and grid size
- Board appears in navigation
- Board persists after page reload

---

#### Day 3-5: Button Editor

**Features**:
- Click on empty cell to add button
- Modal with button editor form:
  - Label (text shown on button)
  - Vocalization (text spoken, defaults to label)
  - Action (dropdown: Speak, AddWord, Navigate, Back, Home, Clear)
  - Background color (color picker)
  - Border color (color picker, optional)
- Grid position (auto-filled based on clicked cell)
- "Save" adds button to board
- Click on existing button to edit
- Delete button option

**Technical Tasks**:
- [ ] Create `ButtonEditor` component with form
- [ ] Add color picker (use HTML5 `<input type="color">` or library)
- [ ] Generate `ObfButton` from form data
- [ ] Update board's `buttons` array and `grid.order`
- [ ] Re-render board with new button
- [ ] Implement edit mode (populate form with existing button)
- [ ] Implement delete (remove from `buttons` and `grid.order`)

**Acceptance Criteria**:
- User can add a button to any empty cell
- Button displays with correct label and color
- Button speaks when clicked
- User can edit button after creation
- User can delete button

---

### Week 2: Image Upload & Display

#### Day 6-8: Image Upload

**Features**:
- "Upload Image" button in Button Editor
- File picker (accepts .jpg, .png, .gif, .webp)
- Image preview before saving
- Crop/resize UI (optional for MVP, can defer)
- Image stored as base64 data URL in OBF
- Image displayed on button

**Technical Tasks**:
- [ ] Add `<input type="file" accept="image/*">` to ButtonEditor
- [ ] Use `FileReader` API to read image as data URL
- [ ] Add `image_id` to button, create `ObfImage` object
- [ ] Store image in board's `images` array
- [ ] Update `Cell` component to display images
- [ ] Handle image loading errors (fallback to label)
- [ ] Optimize image size (resize to max 200x200px before storing)

**Acceptance Criteria**:
- User can upload an image from their device
- Image displays on button
- Image persists after page reload
- Image size is <100KB (optimized)

---

#### Day 9-10: Camera Integration (Mobile)

**Features**:
- "Take Photo" button in Button Editor (mobile only)
- Opens device camera
- User takes photo
- Photo used for button image
- Works on iOS Safari and Android Chrome

**Technical Tasks**:
- [ ] Add `<input type="file" accept="image/*" capture="camera">` for mobile
- [ ] Detect mobile device (show "Take Photo" button only on mobile)
- [ ] Handle camera permissions
- [ ] Same data URL handling as file upload
- [ ] Test on iOS Safari and Android Chrome

**Acceptance Criteria**:
- Mobile users can take a photo with their device camera
- Photo displays on button
- Works on iOS Safari (most restrictive browser)

---

#### Day 11: Icon Library Integration (Optional)

**Features**:
- "Choose Icon" button in Button Editor
- Modal with icon library (OpenMoji or ARASAAC)
- Search icons by keyword
- Select icon to use as button image
- Icon downloaded and stored as data URL

**Technical Tasks**:
- [ ] Integrate OpenMoji library (https://openmoji.org/)
- [ ] Create `IconPicker` component with search
- [ ] Download selected icon as data URL
- [ ] Store in `ObfImage` format

**Acceptance Criteria**:
- User can search and select from 1000+ icons
- Icon displays on button
- Works offline (icon stored as data URL)

**Priority**: P1 (nice-to-have, can defer if time is short)

---

### Week 3: Polish & Testing

#### Day 12-13: Grid Positioning & Drag-and-Drop

**Features**:
- Drag-and-drop button positioning (optional, can defer)
- Reorder buttons by dragging
- Swap button positions
- Move button to empty cell

**Technical Tasks**:
- [ ] Integrate drag-and-drop library (react-dnd or dnd-kit)
- [ ] Add drag handles to buttons in edit mode
- [ ] Update `grid.order` when button is dropped
- [ ] Save changes to localStorage

**Acceptance Criteria**:
- User can reorder buttons by dragging
- Changes persist after page reload

**Priority**: P1 (nice-to-have, can defer for MVP)

---

#### Day 14: Board Management UI

**Features**:
- "My Boards" page listing all boards
- Show custom boards + default boards
- Edit board button (opens BoardCreator in edit mode)
- Delete board button (with confirmation)
- Search/filter boards

**Technical Tasks**:
- [ ] Create `BoardLibrary` component
- [ ] List all boards from localStorage + default boards
- [ ] Implement edit mode for BoardCreator
- [ ] Implement delete with confirmation dialog
- [ ] Add simple search (filter by name)

**Acceptance Criteria**:
- User can see all their boards in one place
- User can edit board metadata (name, description, grid size)
- User can delete custom boards (not default boards)
- Search filters boards by name

---

#### Day 15: Testing & Bug Fixes

**Features**:
- Manual testing of all features
- Fix any bugs found
- Performance optimization
- Documentation update

**Testing Checklist**:
- [ ] Create a board with 6-12 buttons
- [ ] Upload 6+ images
- [ ] Take a photo with mobile camera (iOS + Android)
- [ ] Edit existing buttons
- [ ] Delete buttons
- [ ] Reorder buttons (drag-and-drop)
- [ ] Delete board
- [ ] Reload page (verify persistence)
- [ ] Test on mobile (iOS Safari, Android Chrome)
- [ ] Test on desktop (Chrome, Firefox, Safari)

**Acceptance Criteria**:
- All features work on desktop and mobile
- No critical bugs
- Performance is acceptable (<2s to load board)
- Documentation updated (USER_GUIDE.md)

---

## Technical Architecture

### Data Model

```typescript
// Extended OBF Board structure
interface CustomBoard extends ObfBoard {
  id: string; // UUID
  name: string;
  locale: string;
  grid: {
    rows: number;
    columns: number;
    order: (string | null)[][]; // button IDs
  };
  buttons: ObfButton[]; // Array of buttons
  images: ObfImage[]; // Array of images (data URLs)
  ext_lovewords_custom: true; // Flag for custom boards
  ext_lovewords_created_at: string; // ISO timestamp
  ext_lovewords_updated_at: string; // ISO timestamp
}

// ObfImage with data URL
interface ObfImage {
  id: string;
  url: string; // data URL (base64)
  content_type: string; // image/png, image/jpeg
  width?: number;
  height?: number;
}

// ObfButton with image reference
interface ObfButton {
  id: string;
  label: string;
  vocalization?: string;
  action?: string; // :speak, :add_word, :navigate, :back, :home, :clear
  load_board?: { id?: string };
  background_color?: string;
  border_color?: string;
  image_id?: string; // References ObfImage
}
```

### Storage

```typescript
// localStorage structure
interface LocalStorage {
  'lovewords.profile': Profile; // User settings
  'lovewords.boards': CustomBoard[]; // Custom boards array
}

// Save board
function saveBoard(board: CustomBoard) {
  const boards = JSON.parse(localStorage.getItem('lovewords.boards') || '[]');
  const index = boards.findIndex((b) => b.id === board.id);

  if (index >= 0) {
    boards[index] = board; // Update
  } else {
    boards.push(board); // Create
  }

  localStorage.setItem('lovewords.boards', JSON.stringify(boards));
}

// Load boards
function loadBoards(): CustomBoard[] {
  return JSON.parse(localStorage.getItem('lovewords.boards') || '[]');
}
```

### Components

```
src/components/
├── BoardCreator.tsx       # Create/edit board UI
├── ButtonEditor.tsx       # Add/edit button UI
├── ImageUploader.tsx      # Upload/camera UI
├── IconPicker.tsx         # Icon library UI (optional)
├── BoardLibrary.tsx       # List/manage boards UI
└── ColorPicker.tsx        # Color picker component
```

---

## Success Criteria

- [ ] User can create a custom board with name and grid size
- [ ] User can add 6-12 buttons with custom labels and colors
- [ ] User can upload 6+ photos from device
- [ ] User can take photos with mobile camera (iOS + Android)
- [ ] User can edit existing buttons
- [ ] User can delete buttons
- [ ] User can delete boards
- [ ] Boards persist in localStorage after page reload
- [ ] Images are optimized (<100KB each)
- [ ] Performance is acceptable (<2s to load board with 12 images)
- [ ] Works on mobile (iOS Safari, Android Chrome)
- [ ] Documentation updated (USER_GUIDE.md)

---

## Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| **localStorage size limit (5-10MB)** | Optimize images (resize to 200x200px, compress to JPEG 80% quality), warn user if approaching limit |
| **iOS Safari camera issues** | Test thoroughly, provide fallback (file upload), document known issues |
| **Image loading performance** | Lazy-load images, use `loading="lazy"`, cache data URLs in memory |
| **Drag-and-drop complexity** | Use proven library (dnd-kit), defer to Sprint 3 if too complex |
| **Data loss (localStorage cleared)** | Warn users to backup (export) regularly, implement export in Sprint 3 |

---

## Dependencies

- None (all features can be built with existing tech stack)

---

## Out of Scope (Deferred to Sprint 3)

- Import/export boards (Sprint 3, Week 1)
- Cloud sync (v2.0)
- Audio recording (v2.1)
- Advanced image editing (crop, filters) (v2.1)
- Board sharing (v2.3)

---

## Definition of Done

Sprint 2 is complete when:
- [ ] All acceptance criteria met
- [ ] Manual testing passed on desktop + mobile
- [ ] No critical bugs
- [ ] Code review passed
- [ ] Documentation updated
- [ ] Demo video recorded (show board creation flow)
- [ ] Sprint 2 retrospective complete

---

## Next Sprint Preview

**Sprint 3 (Weeks 4-6)**: Import/Export & Expanded Content
- Export boards as OBF JSON
- Import boards from JSON
- Backup all boards (ZIP download)
- Create 10-12 new default boards
- Add 200+ new phrases (basic needs, emotions, questions, romantic, daily, emergency)
- Board library enhancements

---

**Ready to start Sprint 2!** 🚀
