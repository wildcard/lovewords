# Sprint 3 GitHub Issues - Sharing & Templates

**Sprint:** Sprint 3 - Board Sharing, Templates, and Advanced Features
**Estimated Duration:** 2-3 weeks
**Prerequisites:** Sprint 2 complete

---

## Issue 1: Board Export/Import (OBF File Format)

**Title:** Implement board export/import using OBF format

**Labels:** `enhancement`, `sprint-3`, `feature`

**Description:**

Enable users to export their custom boards as OBF (Open Board Format) files and import boards from files or URLs.

**Acceptance Criteria:**

- [ ] Export custom board as .obf JSON file
- [ ] Download exported file to device
- [ ] Import board from .obf file upload
- [ ] Import board from URL (e.g., shared board link)
- [ ] Validate imported OBF format (schema validation)
- [ ] Handle import errors gracefully with user feedback
- [ ] Preserve all board data (buttons, images, grid layout)
- [ ] Base64 images converted correctly on import/export
- [ ] Merge imported board with existing boards (no overwrites)
- [ ] Show import success/failure message
- [ ] Add "📥 Import Board" button in navigation
- [ ] Add "📤 Export Board" option in board library

**Technical Details:**

```typescript
// Export API
interface ExportOptions {
  includeImages: boolean;
  format: 'obf' | 'obz'; // obf = JSON, obz = compressed
}

function exportBoard(boardId: string, options: ExportOptions): Blob;

// Import API
interface ImportOptions {
  overwrite: boolean; // if board with same ID exists
  validateImages: boolean;
}

function importBoard(file: File | string, options: ImportOptions): Promise<ObfBoard>;
```

**Implementation Notes:**

- Use File API for export/import
- Validate OBF schema against Open Board Format spec
- Consider compression for large boards (.obz format)
- Handle duplicate board IDs (append timestamp or prompt user)
- Preserve custom extensions (ext_lovewords_*)

**Testing:**

- Export board, import in new browser session
- Export board with 20+ images, verify size
- Import board from external source (OBF library)
- Import invalid file, verify error handling
- Import board with duplicate ID

**Estimated Effort:** 2-3 days

---

## Issue 2: Image Library (Reusable Images)

**Title:** Create image library for reusing images across boards

**Labels:** `enhancement`, `sprint-3`, `feature`

**Description:**

Build a centralized image library so users can upload images once and reuse them across multiple boards, reducing localStorage usage.

**Acceptance Criteria:**

- [ ] Global image library stored in localStorage
- [ ] Image library UI (modal with grid of images)
- [ ] Upload images to library (not tied to specific board)
- [ ] Browse and select images from library when editing buttons
- [ ] Delete images from library (with usage check)
- [ ] Show which boards use each image
- [ ] Prevent deletion of in-use images (or cascade delete option)
- [ ] Tag/categorize images (optional)
- [ ] Search images by name or tag
- [ ] Display image metadata (size, upload date, usage count)
- [ ] Migrate existing button images to library (one-time migration)
- [ ] Export/import library with boards

**Technical Details:**

```typescript
interface ImageLibrary {
  images: ImageEntry[];
}

interface ImageEntry {
  id: string;
  name: string;
  data: string; // Base64
  content_type: string;
  width: number;
  height: number;
  uploaded_at: string;
  tags: string[];
  usage_count: number; // calculated
}

interface ImageUsage {
  imageId: string;
  boards: { boardId: string; buttonIds: string[] }[];
}
```

**Implementation Notes:**

- Store library in `localStorage['lovewords-image-library']`
- Reference images by ID (e.g., `lib:image-123`)
- Calculate usage count by scanning all boards
- Confirm before deleting in-use images
- Migration script for existing boards

**UI Components:**

- `ImageLibraryModal.tsx` - Grid view of all images
- `ImagePicker.tsx` - Select from library or upload new
- Integration with `ImageUploader.tsx`

**Testing:**

- Upload 50 images to library
- Reuse same image across 10 boards
- Delete unused image
- Attempt to delete in-use image (should warn)
- Export/import board with library images

**Estimated Effort:** 3-4 days

---

## Issue 3: Undo/Redo System

**Title:** Implement undo/redo for board editing actions

**Labels:** `enhancement`, `sprint-3`, `feature`

**Description:**

Add undo/redo functionality for board editing actions (button edits, drag-and-drop, deletions) to prevent accidental data loss.

**Acceptance Criteria:**

- [ ] Undo button in edit mode (⏪ or Ctrl+Z)
- [ ] Redo button in edit mode (⏩ or Ctrl+Y)
- [ ] Undo/redo stack with max 50 actions
- [ ] Actions tracked: button add/edit/delete, drag-and-drop, image upload
- [ ] Visual feedback (button disabled when no undo/redo available)
- [ ] Clear undo stack on exit edit mode (or persist?)
- [ ] Keyboard shortcuts: Cmd+Z (Mac) / Ctrl+Z (Windows)
- [ ] Keyboard shortcuts: Cmd+Shift+Z / Ctrl+Y for redo
- [ ] Show current action description (e.g., "Undo: Delete button 'Hello'")
- [ ] Undo/redo works across page refresh (optional)

**Technical Details:**

```typescript
interface UndoAction {
  type: 'button-add' | 'button-edit' | 'button-delete' | 'button-reorder';
  timestamp: string;
  before: BoardState; // snapshot before action
  after: BoardState; // snapshot after action
  description: string; // human-readable
}

interface UndoStack {
  actions: UndoAction[];
  currentIndex: number; // -1 = latest, 0 = oldest undo
}

function undo(): void;
function redo(): void;
function pushAction(action: UndoAction): void;
function clearStack(): void;
```

**Implementation Notes:**

- Use immutable snapshots (clone board state)
- Limit stack to 50 actions to prevent memory issues
- Consider using `immer` library for efficient snapshots
- Store stack in React state (or sessionStorage for persistence)
- Clear stack on "Done Editing" or keep across sessions?

**UI Changes:**

- Add undo/redo buttons to Navigation when in edit mode
- Show tooltip with action description on hover
- Grey out buttons when stack empty

**Testing:**

- Add button, undo, verify button removed
- Delete button, undo, verify button restored
- Drag-and-drop 5 buttons, undo 5 times
- Undo to beginning, redo to end
- Max out undo stack (51 actions), verify oldest action dropped

**Estimated Effort:** 2-3 days

---

## Issue 4: Board Templates

**Title:** Create pre-built board templates for common AAC scenarios

**Labels:** `enhancement`, `sprint-3`, `content`, `feature`

**Description:**

Provide users with ready-to-use board templates for common AAC use cases (emotions, needs, activities, etc.) to speed up board creation.

**Acceptance Criteria:**

**Template Categories:**
- [ ] Emotions (happy, sad, angry, excited, scared, etc.) - 20 buttons
- [ ] Basic Needs (hungry, thirsty, tired, bathroom, help, etc.) - 16 buttons
- [ ] Activities (play, read, watch TV, go outside, eat, sleep, etc.) - 20 buttons
- [ ] Social (hello, goodbye, please, thank you, yes, no, etc.) - 12 buttons
- [ ] Medical (pain, medicine, doctor, nurse, emergency, etc.) - 16 buttons
- [ ] School (teacher, student, homework, recess, lunch, etc.) - 20 buttons

**Features:**
- [ ] "Use Template" option in board creation
- [ ] Preview template before creating
- [ ] Customize template name/grid size before creating
- [ ] Templates use image library (stock illustrations)
- [ ] Templates stored in `public/templates/` as OBF files
- [ ] Search templates by category or keyword
- [ ] Combine multiple templates into one board

**Technical Details:**

```typescript
interface BoardTemplate {
  id: string;
  name: string;
  description: string;
  category: 'emotions' | 'needs' | 'activities' | 'social' | 'medical' | 'school';
  preview_image?: string; // screenshot or icon
  board: ObfBoard; // complete board definition
  tags: string[];
}

function loadTemplate(templateId: string): Promise<BoardTemplate>;
function createBoardFromTemplate(template: BoardTemplate, customizations: Partial<ObfBoard>): ObfBoard;
```

**Implementation Notes:**

- Store templates as OBF files in `public/templates/`
- Use open-source AAC symbol libraries (e.g., Mulberry Symbols, ARASAAC)
- Ensure images are optimized (<100KB each)
- Allow users to edit template after creation
- Templates should use semantic color coding (emotions = varied, needs = blue, etc.)

**UI Components:**

- `TemplateGallery.tsx` - Grid of template previews
- `TemplatePreview.tsx` - Full preview with details
- Integration with `BoardCreator.tsx`

**Content Creation:**

- Design 6 template boards
- Source/create 100+ AAC symbols
- Write button labels and vocalizations
- Set appropriate colors for each category

**Testing:**

- Create board from each template category
- Verify all buttons have images
- Verify all buttons speak correctly
- Edit template-created board
- Combine 2 templates into one board

**Estimated Effort:** 4-5 days (includes content creation)

---

## Issue 5: Share Boards via Link or QR Code

**Title:** Enable board sharing via shareable links and QR codes

**Labels:** `enhancement`, `sprint-3`, `feature`, `sharing`

**Description:**

Allow users to share their custom boards with others via a shareable link or QR code, without requiring a backend.

**Acceptance Criteria:**

**Share via Link:**
- [ ] Generate shareable link for any custom board
- [ ] Link contains board data encoded in URL (Base64 or compressed)
- [ ] Recipient can import board by opening link
- [ ] Link opens board preview before importing
- [ ] "Add to My Boards" button after preview
- [ ] Support for short URLs (optional, requires backend)
- [ ] Copy link to clipboard button
- [ ] Share via email, messaging, social media

**Share via QR Code:**
- [ ] Generate QR code for board link
- [ ] Display QR code in modal
- [ ] Download QR code as PNG
- [ ] Print-friendly QR code view
- [ ] Scan QR code with mobile device to import board

**Technical Details:**

```typescript
// Client-side sharing (no backend)
interface ShareOptions {
  method: 'link' | 'qr';
  includeImages: boolean;
  compress: boolean;
}

function generateShareLink(boardId: string, options: ShareOptions): string;
// Returns: https://lovewords.app/#/import?board=BASE64_DATA

function generateQRCode(link: string): string;
// Returns: data URL of QR code PNG

function importFromLink(url: string): Promise<ObfBoard>;
```

**Implementation Notes:**

- Encode board as Base64 JSON in URL fragment (#/import?board=...)
- Use LZ-string library for compression (reduce URL length)
- QR code generation via `qrcode` npm package
- URL length limit: ~2000 characters (may limit large boards)
- For large boards, show "Board too large to share via link, use export instead"
- Optional: Backend API for short URLs (POST board, GET short code)

**URL Format:**
```
https://lovewords.app/#/import?board=<base64-compressed-obf-json>

Example:
https://lovewords.app/#/import?board=N4IgdghgtgpiBcIAKBh...
```

**UI Components:**

- `ShareBoardModal.tsx` - Share options (link, QR)
- `QRCodeDisplay.tsx` - QR code with download button
- `ImportPreview.tsx` - Preview board before importing
- "🔗 Share Board" button in board library

**Testing:**

- Share small board (10 buttons, no images)
- Share large board (36 buttons with images)
- Share board with 20 images, verify URL length
- Scan QR code on mobile, verify import works
- Copy link, open in different browser, import board
- Test URL compression effectiveness

**Estimated Effort:** 3-4 days

---

## Issue 6: Board Sharing Analytics (Optional)

**Title:** Track board usage and popularity (privacy-preserving)

**Labels:** `enhancement`, `sprint-3`, `analytics`, `optional`

**Description:**

Add optional, privacy-preserving analytics to track board usage and identify popular templates (opt-in only).

**Acceptance Criteria:**

- [ ] Opt-in analytics toggle in settings
- [ ] Track button click frequency (locally, no server)
- [ ] Identify most-used buttons per board
- [ ] Suggest frequently-used buttons for quick access
- [ ] Export usage data as JSON (for personal analysis)
- [ ] Clear usage data option
- [ ] Privacy-first: no PII, no tracking IDs, no external servers
- [ ] Usage heatmap visualization (optional)

**Technical Details:**

```typescript
interface UsageData {
  boardId: string;
  buttons: {
    buttonId: string;
    clickCount: number;
    lastUsed: string;
  }[];
  sessions: number;
  totalClicks: number;
}

function trackButtonClick(buttonId: string): void;
function getUsageReport(boardId: string): UsageData;
function clearUsageData(): void;
```

**Estimated Effort:** 2 days

---

## Sprint 3 Summary

**Total Issues:** 6 (5 core + 1 optional)
**Estimated Duration:** 2-3 weeks
**Priority Order:**
1. Board Export/Import (foundation for sharing)
2. Board Templates (high user value)
3. Share via Link/QR (depends on export)
4. Image Library (improves UX, reduces storage)
5. Undo/Redo (polish, prevents mistakes)
6. Analytics (optional, low priority)

**Dependencies:**
- Issue 5 (Share) depends on Issue 1 (Export/Import)
- Issue 4 (Templates) benefits from Issue 2 (Image Library)

**Success Criteria:**
- Users can create boards from templates
- Users can share boards with others easily
- Users can undo mistakes while editing
- localStorage usage optimized via image library
