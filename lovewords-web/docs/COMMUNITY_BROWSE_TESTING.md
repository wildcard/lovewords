# Community Browse Feature - Test Plan

## Quick Test (5 minutes)

### 1. Open the App
- Navigate to: http://localhost:5173 (or your deployment URL)
- Or run: `cd lovewords-web && npm run dev`

### 2. Access Community Browse
1. Click **"Board Library"** button (📚 icon)
2. Click **"🌐 Browse Community"** button (purple)

**Expected:** Modal opens showing community board catalog

### 3. Verify Catalog Loads
**Should see:**
- "Community Boards" title
- Category tabs: All Boards (5), ⭐ Featured (3), 😊 Emotions & Feelings (2), 🏠 Daily Life (1), 💬 Social & Conversation (1), ♿ Accessibility (1)
- Search bar
- Grid size filter dropdown
- Sort dropdown
- "Showing 5 boards" count

**If you see "Failed to Load":**
- Wait 30 seconds (GitHub CDN cache)
- Check browser console for errors
- Verify catalog URL works: https://raw.githubusercontent.com/wildcard/lovewords-boards/main/catalog.json
- Try hard refresh: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)

### 4. Test Filtering
- Click **"⭐ Featured"** tab
  - Should show 3 boards: Basic Emotions, Feelings Scale, Conversation Starters
- Click **"😊 Emotions & Feelings"** tab
  - Should show 2 boards: Basic Emotions, Feelings Scale
- Click back to **"All Boards"**

### 5. Test Search
- Type "emotion" in search bar
  - Should filter to Basic Emotions board
- Clear search

### 6. Test Sort
- Change sort to "Most Buttons"
  - Should reorder boards (4×4 boards first)
- Change sort to "Name (A-Z)"
  - Should show alphabetical order

### 7. Test Import
1. Click **"Import"** button on **"Basic Emotions"** board
2. **Expected:**
   - Modal closes
   - Screen reader announces: "Imported Basic Emotions from community"
   - Board appears in your Board Library
3. Navigate to Board Library again
4. **Verify:** Basic Emotions board is now in your Custom Boards section
5. Click on Basic Emotions to open it
6. **Test:** Click each button (Happy, Sad, Angry, etc.)
   - Should add to message bar
   - Should speak when clicked (if speech enabled)

### 8. Test Board Preview (Optional)
- Open Browse Community again
- Click on a board card (not the Import button, but the card itself)
- **Expected:** Preview modal opens showing:
  - Board name and description
  - Author info
  - Grid size, button count, downloads
  - All tags
  - Import button

---

## Issues & Fixes

### Issue: "Failed to fetch catalog"

**Possible causes:**
1. GitHub CDN not cached yet (wait 30-60 seconds)
2. CORS issue (shouldn't happen with raw.githubusercontent.com)
3. Repository is private (verify it's public)

**Check:**
```bash
# Verify catalog is accessible
curl -I https://raw.githubusercontent.com/wildcard/lovewords-boards/main/catalog.json

# Should return: HTTP/2 200
```

### Issue: Boards don't display

**Check browser console:**
- Press F12 → Console tab
- Look for errors

**Common fixes:**
- Hard refresh the page
- Clear browser cache
- Wait 1-2 minutes for CDN propagation

### Issue: Import fails

**Possible causes:**
1. Storage quota exceeded
2. Invalid board format
3. Network error

**Check:**
- Browser console for error messages
- Try importing a different board
- Check localStorage usage

---

## Success Criteria

- [x] Modal opens without errors
- [x] 5 boards display
- [x] Category counts correct (5, 3, 2, 1, 1, 1)
- [x] Featured filter shows 3 boards
- [x] Search filters boards
- [x] Sort changes order
- [x] Import works
- [x] Imported board is usable
- [x] All buttons work in imported board

---

## Report Results

After testing, report:
1. ✅ All tests passed
2. ⚠️ Issues found (describe what went wrong)

If all tests pass, proceed to configure repository settings and close issue!
