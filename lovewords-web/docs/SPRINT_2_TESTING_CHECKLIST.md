# Sprint 2 Manual Testing Checklist

**Date:** 2026-01-18
**Sprint:** Sprint 2 - Custom Boards & Image Upload
**Version:** 0.1.0

## Test Environment Setup

### Desktop Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (optional)

### Mobile Testing
- [ ] iOS Safari (iPhone/iPad)
- [ ] Android Chrome
- [ ] Android Firefox (optional)

### Test Data Preparation
- [ ] Prepare test images (JPG, PNG, GIF, WebP)
- [ ] Various sizes: small (< 50KB), medium (50-200KB), large (> 500KB)
- [ ] Clear localStorage before testing: `localStorage.clear()` in console

---

## Feature 1: Board Creation

### Basic Board Creation
- [ ] Click "➕ Create Board" button
- [ ] Modal appears with form
- [ ] Enter board name (e.g., "Test Board")
- [ ] Enter description (optional)
- [ ] Select grid size (3×3, 4×4, 5×4, 6×6)
- [ ] Click "Create Board"
- [ ] Board appears and navigates to new board
- [ ] Breadcrumb shows new board name

### Board Creation Validation
- [ ] Empty name shows error "Board name is required"
- [ ] Name < 3 characters shows error "Name must be at least 3 characters"
- [ ] Name > 50 characters shows error "Name must be less than 50 characters"
- [ ] Cancel button closes modal without creating board

### Edge Cases
- [ ] Create board with special characters in name
- [ ] Create board with emoji in name
- [ ] Create multiple boards with same name (should work)
- [ ] Create 10+ custom boards (test localStorage capacity)

**Expected Results:**
- ✓ Board created successfully
- ✓ Board appears in "My Boards" library
- ✓ Board marked as custom (📋 icon)
- ✓ Grid matches selected size
- ✓ All cells are empty initially

---

## Feature 2: Button Editor

### Add New Button
- [ ] Navigate to custom board
- [ ] Click "✏️ Edit Board" to enter edit mode
- [ ] Click empty cell
- [ ] ButtonEditor modal appears
- [ ] Enter label (e.g., "Hello")
- [ ] Enter vocalization (optional)
- [ ] Select action type: "Speak"
- [ ] Click "Save Button"
- [ ] Button appears in grid with label

### Edit Existing Button
- [ ] Click existing button in edit mode
- [ ] Modal shows current button data
- [ ] Change label
- [ ] Change colors (background, border)
- [ ] Click "Save Button"
- [ ] Changes reflected immediately

### Delete Button
- [ ] Click existing button in edit mode
- [ ] Click "🗑️ Delete Button"
- [ ] Confirmation dialog appears
- [ ] Click "Yes, Delete"
- [ ] Button removed from grid
- [ ] Cell becomes empty

### Button Actions
Test each action type:
- [ ] **Speak:** Button speaks its label
- [ ] **Add to Message:** Button adds word to message bar
- [ ] **Navigate:** Shows board selector, navigates to selected board
- [ ] **Back:** Returns to previous board
- [ ] **Home:** Returns to home board
- [ ] **Clear:** Clears message bar
- [ ] **Backspace:** Removes last word from message bar

### Color Customization
- [ ] Select background color
- [ ] Button background changes to selected color
- [ ] Select border color
- [ ] Button border appears with selected color
- [ ] Remove border color (clear)
- [ ] Border disappears

### Validation
- [ ] Empty label shows error "Label is required"
- [ ] Label < 1 character shows error
- [ ] Label > 50 characters shows error
- [ ] Navigate action without board shows error

**Expected Results:**
- ✓ Buttons save correctly
- ✓ Colors persist after refresh
- ✓ Actions work as expected
- ✓ Delete confirmation prevents accidental deletion

---

## Feature 3: Image Upload

### Upload from Device
- [ ] Open ButtonEditor
- [ ] Click "Upload Image" button
- [ ] File picker appears
- [ ] Select JPG image (< 500KB)
- [ ] Image appears in preview
- [ ] Image optimized to ~200×200px
- [ ] File size shown (should be < 100KB)
- [ ] Save button
- [ ] Button displays with image + label

### Image Optimization
Test with various file sizes:
- [ ] Small image (< 50KB) - should remain small
- [ ] Medium image (50-200KB) - should compress to < 100KB
- [ ] Large image (> 500KB) - should compress significantly
- [ ] Very large image (> 2MB) - should still compress to < 100KB

### Image Formats
- [ ] JPG/JPEG - should work
- [ ] PNG - should convert to JPEG
- [ ] GIF - should work
- [ ] WebP - should work
- [ ] Invalid formats (e.g., .txt) - should show error

### Replace/Remove Image
- [ ] Upload image to button
- [ ] Edit button
- [ ] Click "Replace Image"
- [ ] Select new image
- [ ] New image replaces old one
- [ ] Click "Remove Image"
- [ ] Image removed, button shows label only

**Expected Results:**
- ✓ Images optimized automatically
- ✓ File size stays under 100KB
- ✓ Images display clearly at 200×200px
- ✓ Replace/remove works correctly

---

## Feature 4: Camera Integration (Mobile Only)

### iOS Safari Testing
- [ ] Open LoveWords on iPhone/iPad
- [ ] Navigate to custom board
- [ ] Enter edit mode
- [ ] Click empty cell
- [ ] ButtonEditor appears
- [ ] "📷 Take Photo" button visible
- [ ] Click "Take Photo"
- [ ] Camera permission requested (first time)
- [ ] Grant permission
- [ ] Camera opens (rear camera)
- [ ] Take photo
- [ ] Photo appears in preview
- [ ] Save button

### Android Chrome Testing
- [ ] Same steps as iOS
- [ ] Verify camera opens rear camera
- [ ] Verify photo optimization works

### Camera Permissions
- [ ] Deny camera permission
- [ ] Error message appears
- [ ] "📷 Take Photo" button still visible
- [ ] Click again, re-prompt for permission

### Edge Cases
- [ ] Test in low light conditions
- [ ] Test with very large photos (> 5MB)
- [ ] Test rapid photo retakes

**Expected Results:**
- ✓ Camera opens rear camera by default
- ✓ Photos optimized to < 100KB
- ✓ Permission handling works correctly
- ✓ Works on both iOS and Android

**Note:** Camera requires HTTPS or localhost. Ngrok/tunneling required for remote testing.

---

## Feature 5: Board Library

### View All Boards
- [ ] Click "📚 My Boards"
- [ ] Modal appears
- [ ] Default boards section shows 3 boards
- [ ] Custom boards section shows user boards
- [ ] Each board shows name, description, button count

### Search/Filter
- [ ] Enter search query (e.g., "love")
- [ ] Only matching boards shown
- [ ] Clear search
- [ ] All boards reappear
- [ ] Search matches name and description

### Navigate to Board
- [ ] Click on default board
- [ ] Navigates to that board
- [ ] Modal closes automatically
- [ ] Breadcrumb updates

### Edit Board Metadata
- [ ] Click "✏️ Edit" on custom board
- [ ] BoardCreator modal opens with board data
- [ ] Change name/description
- [ ] Save
- [ ] Changes reflected in library

### Delete Custom Board
- [ ] Click "🗑️ Delete" on custom board
- [ ] Confirmation dialog appears
- [ ] Click "Cancel" - board not deleted
- [ ] Click "🗑️ Delete" again
- [ ] Click "Yes, Delete"
- [ ] Board removed from library
- [ ] If current board, navigates to home

### Default Board Protection
- [ ] Default boards show 🔒 icon
- [ ] No edit/delete buttons for defaults
- [ ] Cannot modify default boards

**Expected Results:**
- ✓ Search works correctly
- ✓ Navigation works
- ✓ Edit updates board metadata
- ✓ Delete confirmation prevents accidents
- ✓ Default boards protected from editing

---

## Feature 6: Drag-and-Drop Button Positioning

### Basic Drag-and-Drop
- [ ] Navigate to custom board
- [ ] Enter edit mode ("✏️ Edit Board")
- [ ] Hover over button - cursor changes to "move"
- [ ] Click and hold on button
- [ ] Drag to new position
- [ ] Button follows cursor
- [ ] Button shows 50% opacity while dragging
- [ ] Release over target cell
- [ ] Buttons swap positions
- [ ] Changes save automatically

### Keyboard Drag-and-Drop
- [ ] Tab to focus button
- [ ] Press Space to "grab" button
- [ ] Arrow keys to move
- [ ] Space again to "drop"
- [ ] Positions swap correctly

### Edge Cases
- [ ] Drag button to same position (no change)
- [ ] Drag button to empty cell (button moves)
- [ ] Drag empty cell (nothing happens)
- [ ] Rapid consecutive drags
- [ ] Drag during speech playback

### Touch Drag (Mobile)
- [ ] Long press on button
- [ ] Drag to new position
- [ ] Visual feedback appears
- [ ] Release to drop
- [ ] Positions update

### Visual Feedback
- [ ] Dragging button shows 50% opacity
- [ ] Drop target highlights (if implemented)
- [ ] Cursor shows "move" icon in edit mode
- [ ] Cursor normal in view mode

### Default Board Protection
- [ ] Try to drag on default board (edit mode not available)
- [ ] Only custom boards allow drag-and-drop

**Expected Results:**
- ✓ Drag-and-drop works smoothly
- ✓ 8px activation prevents accidental drags
- ✓ Visual feedback clear
- ✓ Keyboard accessible
- ✓ Changes persist after refresh
- ✓ Touch works on mobile

---

## Performance Testing

### Large Board (36 buttons)
- [ ] Create 6×6 grid board
- [ ] Add 36 buttons with images
- [ ] Test initial load time (< 2 seconds)
- [ ] Test smooth scrolling
- [ ] Test drag-and-drop performance
- [ ] Test speech synthesis responsiveness

### localStorage Capacity
- [ ] Create 10+ custom boards
- [ ] Each with 20+ buttons with images
- [ ] Check localStorage usage in DevTools
- [ ] Should stay under 5MB (most browsers allow 5-10MB)
- [ ] Test quota exceeded handling

### Image Loading
- [ ] Board with 20+ images
- [ ] All images load correctly
- [ ] No flickering during load
- [ ] Images cached properly (check Network tab)

**Expected Results:**
- ✓ App remains responsive with large boards
- ✓ localStorage usage reasonable
- ✓ Images load efficiently

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all buttons
- [ ] Focus visible on current button
- [ ] Arrow keys navigate grid
- [ ] Enter/Space activates button
- [ ] Escape closes modals
- [ ] Tab order logical (top to bottom, left to right)

### Screen Reader
- [ ] ARIA labels present on all buttons
- [ ] Modal dialogs announced correctly
- [ ] Form errors announced
- [ ] Success messages announced
- [ ] Grid structure navigable

### Focus Management
- [ ] Focus returns to trigger after modal close
- [ ] Focus trapped in modal while open
- [ ] Skip to main content link works

**Expected Results:**
- ✓ Fully keyboard accessible
- ✓ Screen reader friendly
- ✓ Focus management correct

---

## Cross-Browser Testing

### Chrome
- [ ] All features work
- [ ] Drag-and-drop smooth
- [ ] Images display correctly
- [ ] Speech synthesis works

### Firefox
- [ ] Same as Chrome
- [ ] Check for CSS differences
- [ ] Verify localStorage works

### Safari (Desktop)
- [ ] Same as Chrome
- [ ] Check Web Speech API compatibility
- [ ] Verify image optimization

### Safari (iOS)
- [ ] Touch interactions smooth
- [ ] Camera integration works
- [ ] Speech synthesis works
- [ ] Image upload works

### Chrome (Android)
- [ ] Same as iOS Safari
- [ ] Camera rear camera default
- [ ] Touch drag-and-drop works

**Expected Results:**
- ✓ Consistent experience across browsers
- ✓ No major visual differences
- ✓ All features functional

---

## Regression Testing (Sprint 1 Features)

### Switch Scanning
- [ ] Enable switch scanning in settings
- [ ] Row scanning works
- [ ] Column scanning works
- [ ] Cell selection works
- [ ] Disable scanning

### Keyboard Navigation
- [ ] Arrow keys navigate grid
- [ ] Enter/Space activates button
- [ ] Focus visible

### Message Bar
- [ ] Add words to message
- [ ] Speak message
- [ ] Clear message
- [ ] Backspace removes last word

### Speech Settings
- [ ] Voice selection works
- [ ] Rate adjustment works
- [ ] Pitch adjustment works
- [ ] Volume adjustment works
- [ ] Test speech button works

**Expected Results:**
- ✓ All Sprint 1 features still work
- ✓ No regressions introduced

---

## Known Issues / Bugs Found

### Critical (Blockers)
- [ ] None found

### High Priority
- [ ] None found

### Medium Priority
- [ ] None found

### Low Priority / Enhancement Ideas
- [ ] None found

---

## Test Summary

**Date Tested:** __________
**Tester:** __________
**Browser/Device:** __________

**Results:**
- Total Tests: __________
- Passed: __________
- Failed: __________
- Skipped: __________

**Critical Issues:** __________

**Recommendation:** ☐ Ready for Release  ☐ Needs Fixes  ☐ Retest Required

**Notes:**
