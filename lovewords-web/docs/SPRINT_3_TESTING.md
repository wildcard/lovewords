# Sprint 3: Export/Import Testing Guide

## Overview
This guide provides step-by-step instructions for testing the board export and import functionality.

## Prerequisites
- Development server running (`npm run dev`)
- At least one custom board created
- Browser with developer console open (for debugging)

---

## Test 1: Export Custom Board

### Steps
1. **Navigate to Board Library**
   - Click the "📚 My Boards" button in the navigation bar

2. **Locate a Custom Board**
   - Scroll to "My Custom Boards" section
   - Find any custom board (create one first if none exist)

3. **Click Export Button**
   - Click the green "📤" button next to the board

4. **Verify Download**
   - Check that a `.obf` file downloads
   - Filename should be sanitized board name (e.g., `my-board.obf`)

5. **Verify File Contents**
   - Open the downloaded file in a text editor
   - Verify it's valid JSON
   - Check required fields exist:
     - `format: "open-board-0.1"`
     - `id`, `name`, `buttons`, `images`, `sounds`, `grid`

### Expected Results
✅ File downloads successfully
✅ Filename matches board name (sanitized)
✅ JSON is valid and properly formatted
✅ Screen reader announces: "Exported [Board Name]"

---

## Test 2: Import from File

### Steps
1. **Open Board Library**
   - Click "📚 My Boards"

2. **Click Import Button**
   - Click "📥 Import Board" in the header

3. **Select File Tab**
   - Ensure "📁 File Upload" tab is active

4. **Choose File**
   - Click "📁 Choose File" button
   - Select the `.obf` file you exported in Test 1

5. **Verify Preview**
   - Check that board preview appears
   - Verify board name, button count, grid size shown

6. **Click Import**
   - Click the "Import" button
   - Modal should close

7. **Verify Import**
   - Board Library should close
   - App should navigate to the imported board
   - Board should appear in custom boards list

### Expected Results
✅ File loads successfully
✅ Board preview displays correct information
✅ Import button is enabled
✅ Board appears in library after import
✅ Screen reader announces: "Imported [Board Name]"

---

## Test 3: Import from URL

### Setup
First, you need a publicly accessible `.obf` file. You can:
- Upload the exported file to a GitHub gist
- Use a file hosting service
- Run a local HTTP server

**Quick local server:**
```bash
cd lovewords-web/dist
python3 -m http.server 8080
# Place your .obf file in dist folder
# URL: http://localhost:8080/board.obf
```

### Steps
1. **Open Import Modal**
   - Board Library → "📥 Import Board"

2. **Switch to URL Tab**
   - Click "🔗 From URL"

3. **Enter URL**
   - Paste URL to `.obf` file
   - Example: `http://localhost:8080/board.obf`

4. **Fetch Board**
   - Click "Fetch" button
   - Wait for loading indicator

5. **Verify Preview**
   - Board preview should appear
   - Check board details are correct

6. **Import Board**
   - Click "Import"
   - Verify navigation to imported board

### Expected Results
✅ URL fetch succeeds
✅ Board preview loads
✅ Import completes successfully
✅ Error handling works for invalid URLs

---

## Test 4: ID Collision Detection

### Steps
1. **Import a Board**
   - Import any `.obf` file (as in Test 2)

2. **Import Same Board Again**
   - Without closing the app, import the same file again
   - Import modal should show ⚠️ ID collision warning

3. **Test Rename Strategy**
   - Select "Rename - Keep both boards"
   - Click "Import"
   - Verify two boards exist with different IDs
   - New board should have timestamp suffix in ID

4. **Test Replace Strategy**
   - Import the same file a third time
   - Select "Replace - Overwrite existing board"
   - Click "Import"
   - Verify only one instance exists (the latest)

### Expected Results
✅ Collision warning appears on duplicate import
✅ Rename creates new board with unique ID
✅ Replace overwrites existing board
✅ Both strategies work correctly

---

## Test 5: Error Handling

### Test 5.1: Invalid JSON File
1. Create a text file with invalid JSON: `{invalid`
2. Save as `bad.obf`
3. Try to import
4. **Expected:** "The file is not valid JSON." error

### Test 5.2: Invalid OBF Structure
1. Create a JSON file missing required fields:
   ```json
   {
     "format": "open-board-0.1",
     "name": "Test"
   }
   ```
2. Save as `incomplete.obf`
3. Try to import
4. **Expected:** "Invalid board format. Missing..." error

### Test 5.3: Invalid URL
1. Open import modal → URL tab
2. Enter invalid URL: `https://nonexistent.example.com/board.obf`
3. Click Fetch
4. **Expected:** "Could not fetch board from URL" error

### Test 5.4: Storage Quota
1. Import many large boards (with embedded images)
2. Continue until storage is full
3. **Expected:** "Storage is full. Delete boards to make room." error

### Expected Results
✅ Clear error messages for all failure cases
✅ App remains stable after errors
✅ User can retry after fixing issues

---

## Test 6: Accessibility

### Keyboard Navigation
1. Open import modal
2. Press `Tab` to navigate through controls
3. Press `Escape` to close
4. **Expected:** Focus trap works, all controls accessible

### Screen Reader Announcements
1. Enable screen reader (VoiceOver on Mac, NVDA on Windows)
2. Perform export operation
3. **Expected:** "Exported [Board Name]" announced
4. Perform import operation
5. **Expected:** "Imported [Board Name]" announced

### Expected Results
✅ All buttons have aria-labels
✅ Modal has proper ARIA attributes
✅ Focus trap prevents tabbing outside modal
✅ Escape key closes modal
✅ Screen reader announcements work

---

## Test 7: Edge Cases

### Empty Board
1. Create a custom board with no buttons
2. Export it
3. Import the exported file
4. **Expected:** Works correctly with 0 buttons

### Large Board
1. Create a 6×6 board (36 cells)
2. Fill all cells with buttons
3. Add images to all buttons
4. Export the board
5. Check file size
6. Import the board
7. **Expected:** Large boards work (may be slow)

### Special Characters in Name
1. Create board with name: `Test "Board" & <Special>`
2. Export
3. **Expected:** Filename sanitized: `test-board-special.obf`
4. Import
5. **Expected:** Original name preserved in board data

### Expected Results
✅ Edge cases handled gracefully
✅ No data loss or corruption
✅ Performance acceptable for large boards

---

## Test Checklist

- [ ] Export custom board
- [ ] Import from file
- [ ] Import from URL
- [ ] ID collision - rename strategy
- [ ] ID collision - replace strategy
- [ ] Invalid JSON error
- [ ] Invalid OBF structure error
- [ ] Invalid URL error
- [ ] Storage quota error
- [ ] Keyboard navigation works
- [ ] Screen reader announces exports
- [ ] Screen reader announces imports
- [ ] Empty board export/import
- [ ] Large board (36 cells) export/import
- [ ] Special characters in board name

---

## Reporting Issues

If you find bugs during testing, create a GitHub issue with:
- Test case that failed
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS version
- Console errors (if any)

Template:
```markdown
## Bug Report

**Test Case:** [Test name]
**Steps to Reproduce:**
1. ...
2. ...

**Expected:** ...
**Actual:** ...

**Environment:**
- Browser: Chrome 120
- OS: macOS 14
- Build: [git commit hash]

**Console Errors:**
```
[paste errors]
```
```

---

## Success Criteria

Sprint 3 is considered complete when:
- ✅ All export tests pass
- ✅ All import tests pass
- ✅ Collision detection works correctly
- ✅ Error handling covers all cases
- ✅ Accessibility requirements met
- ✅ Edge cases handled
- ✅ No console errors during normal operation
