# Sprint 2 Weeks 2-3 Detailed Plan
## Button Editor, Images, and Board Management

**Sprint**: 2
**Weeks**: 2-3 (Days 3-15)
**Status**: Planning Complete
**Updated**: January 18, 2026

---

## Week 2: Button Editor & Image Upload (Days 3-11)

### Day 3-5: Button Editor Component

**Goal**: Users can add, edit, and delete buttons on custom boards

#### Features

**Button Editor Modal** (`src/components/ButtonEditor.tsx`):
- Click empty cell → "Add Button" modal opens
- Click existing button → "Edit Button" modal opens
- Form fields:
  - Label (text shown on button) - required
  - Vocalization (text spoken) - defaults to label
  - Action (dropdown):
    - Speak (default)
    - Add to Message
    - Navigate to Board (with board selector)
    - Back
    - Home
    - Clear
    - Backspace
  - Background color (color picker)
  - Border color (color picker) - optional
  - Image (upload button - Week 2 Day 6+)
- Delete button (with confirmation)
- Save/Cancel buttons

**Implementation Tasks**:
- [ ] Create `ButtonEditor.tsx` component
- [ ] Add form validation (label required)
- [ ] Color picker integration (HTML5 `<input type="color">`)
- [ ] Action dropdown with conditional fields (Navigate shows board selector)
- [ ] Generate unique button ID (`button-${Date.now()}`)
- [ ] Update board's `buttons` array
- [ ] Update board's `grid.order` matrix
- [ ] Save updated board to localStorage
- [ ] Re-render board with new/updated button

**Acceptance Criteria**:
- ✅ User clicks empty cell → modal opens
- ✅ User fills form → button created
- ✅ Button displays with correct label and colors
- ✅ Button speaks when clicked
- ✅ User can edit existing button
- ✅ User can delete button (with "Are you sure?" confirmation)
- ✅ Changes persist after page reload

---

### Day 6-8: Image Upload from Device

**Goal**: Users can upload photos from their device for buttons

#### Features

**Image Uploader** (`src/components/ImageUploader.tsx`):
- "Upload Image" button in ButtonEditor
- File picker accepts: `.jpg`, `.png`, `.gif`, `.webp`
- Image preview before saving
- Image optimization:
  - Resize to max 200×200px
  - Compress to <100KB (JPEG 80% quality)
  - Convert to data URL (base64)
- Associate image with button

**Technical Implementation**:
```typescript
// Image upload handler
async function handleImageUpload(file: File) {
  // 1. Read file as data URL
  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = async () => {
    const dataUrl = reader.result as string;

    // 2. Optimize image
    const optimized = await optimizeImage(dataUrl, {
      maxWidth: 200,
      maxHeight: 200,
      quality: 0.8
    });

    // 3. Create ObfImage
    const imageId = `image-${Date.now()}`;
    const image: ObfImage = {
      id: imageId,
      url: optimized, // data URL
      content_type: file.type,
      width: 200,
      height: 200
    };

    // 4. Add to board's images array
    board.images.push(image);

    // 5. Set button's image_id
    button.image_id = imageId;

    // 6. Save board
    await storage.saveBoard(board);
  };
}

// Image optimization (canvas-based)
function optimizeImage(dataUrl: string, options: {
  maxWidth: number;
  maxHeight: number;
  quality: number;
}): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = dataUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      // Calculate dimensions
      let { width, height } = img;
      if (width > options.maxWidth || height > options.maxHeight) {
        const ratio = Math.min(
          options.maxWidth / width,
          options.maxHeight / height
        );
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      const optimized = canvas.toDataURL('image/jpeg', options.quality);

      resolve(optimized);
    };
  });
}
```

**Implementation Tasks**:
- [ ] Create `ImageUploader.tsx` component
- [ ] Add file input with accept filter
- [ ] Implement FileReader to read file as data URL
- [ ] Create image optimization function (canvas-based)
- [ ] Preview image before saving
- [ ] Create `ObfImage` object
- [ ] Update Cell component to display images
- [ ] Handle image loading errors (fallback to label)
- [ ] Test with various image formats and sizes

**Acceptance Criteria**:
- ✅ User clicks "Upload Image" → file picker opens
- ✅ User selects image → preview shows
- ✅ Image optimized to <100KB
- ✅ Image displays on button
- ✅ Image persists after page reload
- ✅ Large images (>5MB) are optimized without crashing
- ✅ Unsupported formats show error message

---

### Day 9-11: Camera Integration (Mobile)

**Goal**: Mobile users can take photos with their device camera

#### Features

**Camera Button** (in ImageUploader):
- Show "Take Photo" button on mobile devices only
- Opens device camera
- User takes photo
- Photo immediately used for button
- Works on iOS Safari and Android Chrome

**Technical Implementation**:
```typescript
// Detect mobile device
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

// Camera input (HTML5)
<input
  type="file"
  accept="image/*"
  capture="camera" // Opens camera on mobile
  onChange={handleCameraCapture}
  style={{ display: 'none' }}
  ref={cameraInputRef}
/>

// Trigger camera
function handleTakePhoto() {
  cameraInputRef.current?.click();
}

// Handle captured photo (same as file upload)
function handleCameraCapture(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (file) {
    handleImageUpload(file); // Reuse upload logic
  }
}
```

**Platform Testing Required**:
- [ ] iOS Safari (most restrictive)
- [ ] Android Chrome
- [ ] Android Firefox
- [ ] iPad Safari

**Implementation Tasks**:
- [ ] Add mobile detection function
- [ ] Show "Take Photo" button only on mobile
- [ ] Add file input with `capture="camera"` attribute
- [ ] Handle camera permissions (user approval required)
- [ ] Test on iOS Safari (camera permissions can be tricky)
- [ ] Test on Android Chrome
- [ ] Handle camera access denial gracefully
- [ ] Fallback to file upload if camera fails

**Acceptance Criteria**:
- ✅ "Take Photo" button visible on mobile only
- ✅ Button opens device camera
- ✅ User takes photo → preview shows
- ✅ Photo used for button
- ✅ Works on iOS Safari (tested on real device)
- ✅ Works on Android Chrome (tested on real device)
- ✅ Camera permission denial shows helpful message

---

## Week 3: Polish & Testing (Days 12-15)

### Day 12-13: Board Management UI

**Goal**: Users can manage all their custom boards in one place

#### Features

**My Boards Page** (`src/components/BoardLibrary.tsx`):
- List all boards (default + custom)
- Visual distinction:
  - Default boards: Lock icon (can't delete)
  - Custom boards: Edit/Delete buttons
- Search/filter boards by name
- Click board → navigate to it
- Edit board metadata (name, description)
- Delete custom board (with confirmation)

**UI Layout**:
```
┌─────────────────────────────────────┐
│ My Boards                      🔍   │ ← Search box
├─────────────────────────────────────┤
│ Default Boards                      │
├─────────────────────────────────────┤
│ [🔒] Love & Affection     →        │
│ [🔒] Core Words           →        │
│ [🔒] Basic Needs          →        │
├─────────────────────────────────────┤
│ My Custom Boards                    │
├─────────────────────────────────────┤
│ [📋] My Family            ✏️ 🗑️  →│
│      Created: Jan 15, 2026          │
│      12 buttons                     │
│                                     │
│ [📋] Daily Routine        ✏️ 🗑️  →│
│      Created: Jan 16, 2026          │
│      8 buttons                      │
└─────────────────────────────────────┘
```

**Implementation Tasks**:
- [ ] Create `BoardLibrary.tsx` component
- [ ] List default boards (from storage.listBoards())
- [ ] List custom boards (from storage.listCustomBoards())
- [ ] Add search filter (filter by name)
- [ ] Click board → navigate to it
- [ ] Edit button → open BoardCreator in edit mode
- [ ] Delete button → confirm dialog → remove from localStorage
- [ ] Show board stats (button count, created date)
- [ ] Add route/navigation for "My Boards" page

**Acceptance Criteria**:
- ✅ User can see all boards in one place
- ✅ Search filters boards by name
- ✅ User can navigate to any board by clicking
- ✅ User can edit custom board metadata
- ✅ User can delete custom boards
- ✅ Default boards cannot be deleted
- ✅ Delete confirmation prevents accidents

---

### Day 14: Drag-and-Drop Button Positioning (Optional)

**Goal**: Users can reorder buttons by dragging

**Priority**: P1 (Nice-to-have, can defer to Sprint 3 if time-constrained)

#### Features

**Drag-and-Drop** (using `dnd-kit` library):
- Edit mode toggle in board view
- Drag button to new position
- Visual feedback during drag (ghost image)
- Drop to swap positions
- Save new order to localStorage

**Technical Implementation**:
```bash
npm install @dnd-kit/core @dnd-kit/sortable
```

```typescript
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';

function Board({ board, editMode }) {
  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      // Swap button positions in grid.order
      const oldIndex = getIndexFromId(active.id);
      const newIndex = getIndexFromId(over.id);

      const newOrder = arrayMove(board.grid.order, oldIndex, newIndex);
      board.grid.order = newOrder;

      // Save board
      storage.saveBoard(board);
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <SortableContext items={buttonIds}>
        {/* Render cells */}
      </SortableContext>
    </DndContext>
  );
}
```

**Implementation Tasks (if time permits)**:
- [ ] Install `dnd-kit` library
- [ ] Add "Edit Mode" toggle in board view
- [ ] Wrap board in DndContext
- [ ] Make cells draggable (SortableContext)
- [ ] Handle drag end → update grid.order
- [ ] Save updated board
- [ ] Visual feedback (ghost image, drop zones)

**Acceptance Criteria**:
- ✅ User enables edit mode
- ✅ User drags button → visual feedback
- ✅ User drops button → positions swap
- ✅ Changes persist after page reload
- ✅ Edit mode disabled by default (prevent accidental drags)

**Fallback**: If time runs short, skip drag-and-drop. Users can delete and re-add buttons to reorder.

---

### Day 15: Manual Testing & Bug Fixes

**Goal**: Ensure all Sprint 2 features work on desktop and mobile

#### Testing Checklist

**Desktop Testing (Chrome, Firefox, Safari)**:
- [ ] Create new board (various grid sizes)
- [ ] Add 6-12 buttons with labels and colors
- [ ] Upload 6+ images from device
- [ ] Edit existing buttons
- [ ] Delete buttons
- [ ] Navigate to custom board
- [ ] Board persists after page reload
- [ ] Search boards in My Boards page
- [ ] Delete custom board

**Mobile Testing (iOS Safari, Android Chrome)**:
- [ ] Create board on mobile
- [ ] Add buttons (touch interface)
- [ ] Take photo with camera
- [ ] Upload image from photos
- [ ] Edit button (touch)
- [ ] Delete button (touch)
- [ ] Navigate boards (touch)
- [ ] Board persists after app close

**Performance Testing**:
- [ ] Create board with 36 buttons (6×6 grid)
- [ ] Add images to all 36 buttons
- [ ] Measure load time (<2 seconds acceptable)
- [ ] Check localStorage size (warn if >5MB)
- [ ] Test on low-end Android device (performance)

**Edge Cases**:
- [ ] Upload 10MB image → should optimize to <100KB
- [ ] Upload unsupported format (.bmp, .tiff) → error message
- [ ] Fill localStorage (create 100+ boards) → warning
- [ ] Delete board while viewing it → redirect to home
- [ ] Edit board name to empty string → validation error

#### Bug Fix Process

**For each bug found**:
1. Document: Screenshot + steps to reproduce
2. Prioritize: Critical (blocks release) or Minor (can defer)
3. Fix: Test fix on desktop and mobile
4. Re-test: Verify fix doesn't break other features

**Common Issues to Watch**:
- Image optimization crashes on large files
- Camera doesn't work on iOS Safari
- localStorage quota exceeded
- Drag-and-drop interferes with scroll (mobile)
- Button colors not accessible (low contrast)

---

## Success Criteria (Sprint 2 Complete)

- [x] Week 1: Board creation working
- [ ] Week 2: Button editor functional
- [ ] Week 2: Image upload from device
- [ ] Week 2: Camera integration (mobile)
- [ ] Week 3: Board management UI
- [ ] Week 3: All manual tests pass
- [ ] Week 3: 0 critical bugs
- [ ] Week 3: Documentation updated

---

## Documentation Updates

**Files to Update**:
- [ ] `docs/USER_GUIDE.md` - Add section on creating custom boards
- [ ] `docs/SPRINT_2_PROGRESS.md` - Final progress report
- [ ] `README.md` - Update feature list

**Video Tutorial** (optional, nice-to-have):
- Record 2-3 minute screencast showing:
  1. Create board
  2. Add buttons with images
  3. Use board to communicate
- Upload to YouTube
- Embed in README

---

## GitHub Issues Alignment

**Create issues for**:
- [ ] Button Editor component (#TBD)
- [ ] Image upload feature (#TBD)
- [ ] Camera integration (#TBD)
- [ ] Board management UI (#TBD)
- [ ] Manual testing checklist (#TBD)

**Link to Epic**:
- Epic: Sprint 2 - Custom Boards & Images

---

## Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **iOS camera permissions fail** | Medium | High | Test early on real device, provide clear error messages |
| **localStorage quota exceeded** | Low | Medium | Warn users at 80% capacity, provide export option |
| **Image optimization slow** | Low | Medium | Show loading spinner, optimize in Web Worker |
| **Drag-and-drop too complex** | High | Low | Make it optional, defer to Sprint 3 if needed |

---

## Next Sprint Preview

**Sprint 3 (Import/Export & Content)**:
- Export boards as OBF JSON
- Import boards from JSON
- Backup all boards (ZIP download)
- Create 10-12 new default boards
- Add 200+ new phrases
- Prepare for MVP launch

---

**Sprint 2 Weeks 2-3 ready to execute!** 🚀
