# Sprint 3 GitHub Issues - Quick Reference

**Sprint:** Sprint 3 - Board Sharing, Templates, and Advanced Features
**Created:** 2026-01-18
**Total Issues:** 5 core features

---

## How to Create These Issues on GitHub

### Option 1: Use GitHub Web UI

1. Go to https://github.com/YOUR_USERNAME/lovewords/issues
2. Click "New Issue"
3. Select the appropriate template:
   - **[Sprint 3] Board Export/Import (OBF File Format)**
   - **[Sprint 3] Image Library (Reusable Images)**
   - **[Sprint 3] Undo/Redo System for Board Editing**
   - **[Sprint 3] Board Templates (Emotions, Needs, Activities)**
   - **[Sprint 3] Share Boards via Link or QR Code**
4. Review the pre-filled content
5. Make any necessary adjustments
6. Click "Submit new issue"

### Option 2: Use GitHub CLI

```bash
# Install GitHub CLI if not already installed
# brew install gh  (macOS)

# Create all Sprint 3 issues at once
gh issue create --template sprint3_export_import.yml
gh issue create --template sprint3_image_library.yml
gh issue create --template sprint3_undo_redo.yml
gh issue create --template sprint3_board_templates.yml
gh issue create --template sprint3_sharing.yml
```

---

## Issues Summary

### 1. Board Export/Import 📥📤
**File:** `sprint3_export_import.yml`
**Priority:** High (Foundation for sharing)
**Effort:** 2-3 days
**Labels:** `enhancement`, `sprint-3`, `feature`, `export-import`

**What it does:**
Enable users to export custom boards as OBF files and import boards from files or URLs.

**Key Features:**
- Export as .obf JSON
- Import from file upload
- Import from URL
- Schema validation
- Handle duplicate IDs

---

### 2. Image Library 🖼️
**File:** `sprint3_image_library.yml`
**Priority:** Medium
**Effort:** 3-4 days
**Labels:** `enhancement`, `sprint-3`, `feature`, `image-management`

**What it does:**
Centralized image library for reusing images across boards, reducing localStorage usage.

**Key Features:**
- Global image library
- Upload once, use everywhere
- Image metadata tracking
- Usage tracking
- Delete protection for in-use images

---

### 3. Undo/Redo System ⏪⏩
**File:** `sprint3_undo_redo.yml`
**Priority:** Medium
**Effort:** 2-3 days
**Labels:** `enhancement`, `sprint-3`, `feature`, `ux-improvement`

**What it does:**
Add undo/redo functionality for board editing to prevent accidental data loss.

**Key Features:**
- Undo/redo buttons in edit mode
- Keyboard shortcuts (Cmd+Z, Ctrl+Y)
- 50-action stack
- Action descriptions
- Tracks all edit actions

---

### 4. Board Templates 📋
**File:** `sprint3_board_templates.yml`
**Priority:** High (High user value)
**Effort:** 4-5 days (includes content creation)
**Labels:** `enhancement`, `sprint-3`, `feature`, `content`, `templates`

**What it does:**
Pre-built board templates for common AAC scenarios.

**Templates:**
- Emotions (20 buttons)
- Basic Needs (16 buttons)
- Activities (20 buttons)
- Social (12 buttons)
- Medical (16 buttons)
- School (20 buttons)

**Key Features:**
- Template gallery
- Preview before use
- Customize before creating
- Search by category
- Combine templates

---

### 5. Share Boards 🔗📱
**File:** `sprint3_sharing.yml`
**Priority:** Medium (After export/import)
**Effort:** 3-4 days
**Labels:** `enhancement`, `sprint-3`, `feature`, `sharing`
**Dependencies:** Issue #1 (Export/Import)

**What it does:**
Share custom boards via shareable links and QR codes.

**Key Features:**
- Generate shareable link (Base64 encoded)
- QR code generation
- Import from link
- Board preview before importing
- Copy to clipboard
- Download QR code as PNG

---

## Implementation Order

### Phase 1: Foundation (Week 1)
1. **Export/Import** (2-3 days) - Foundation for all sharing features
2. **Board Templates** (4-5 days) - High user value, can work in parallel

### Phase 2: Enhancement (Week 2)
3. **Image Library** (3-4 days) - Improves UX and storage efficiency
4. **Undo/Redo** (2-3 days) - Polish and safety net

### Phase 3: Sharing (Week 3)
5. **Share via Link/QR** (3-4 days) - Requires export/import complete

**Total Estimated Time:** 14-19 days (~3 weeks)

---

## Dependencies Graph

```
Export/Import (1)
    ↓
Share via Link/QR (5)

Image Library (2)
    ↓
Board Templates (4) ← can use library images

Undo/Redo (3) ← independent
```

---

## Success Metrics

After Sprint 3 completion, users should be able to:

- ✅ Create a board from an emotions template in <1 minute
- ✅ Share a board with a friend via QR code
- ✅ Import a board shared by the community
- ✅ Reuse the same 10 images across 5 different boards
- ✅ Undo an accidental button deletion
- ✅ Export their entire board collection

---

## Testing Requirements

Each issue has detailed testing checklists. Key areas:

1. **Export/Import:**
   - Cross-browser import/export
   - Large boards (36 buttons, 20+ images)
   - Invalid file handling

2. **Image Library:**
   - 50+ images in library
   - Delete in-use image (should warn)
   - Migration from existing boards

3. **Undo/Redo:**
   - 50+ consecutive actions
   - Undo to beginning, redo to end
   - Keyboard shortcuts

4. **Templates:**
   - All 6 categories load correctly
   - Customization works
   - Images display properly

5. **Sharing:**
   - QR code scan on mobile
   - URL length limits
   - Compression effectiveness

---

## Notes

- All features are client-side only (no backend required)
- localStorage is the primary storage (5-10MB limit)
- Image library helps stay within quota
- OBF format ensures compatibility with other AAC tools
- Privacy-first: no tracking, no external servers (except optional short URLs)

---

## After Sprint 3

**Sprint 4 Candidates:**
- Offline PWA support
- Multi-language support
- Cloud sync (optional backend)
- Voice recording for buttons
- Usage analytics (opt-in)
- Contextual board suggestions

**MVP Completion:**
Sprint 3 completes the core MVP feature set. After Sprint 3, LoveWords will be feature-complete for initial release.
