# Drag-and-Drop Testing Guide

**Feature:** Button reordering via drag-and-drop
**Library:** @dnd-kit (accessible drag-and-drop)
**Status:** Sprint 2 Week 3 Day 14 - Complete

## Overview

Custom boards support drag-and-drop reordering of buttons when in edit mode. This guide covers how to test the feature thoroughly.

---

## Quick Test

1. **Create a custom board** (➕ Create Board)
2. **Add 4-6 buttons** with different labels
3. **Enter edit mode** (✏️ Edit Board)
4. **Drag a button** to a new position
5. **Verify** the buttons swap positions
6. **Exit edit mode** (✓ Done Editing)
7. **Refresh page** - verify positions persist

---

## Desktop Testing

### Mouse Interaction

**Test 1: Basic Drag**
```
Initial:  [A] [B] [C]
          [D] [E] [F]

Action:   Drag [A] to [F]'s position
Expected: [F] [B] [C]
          [D] [E] [A]
```

**Steps:**
1. Click "✏️ Edit Board"
2. Hover over button [A] - cursor should change to "move"
3. Click and hold on button [A]
4. Button should become semi-transparent (50% opacity)
5. Drag to button [F]'s position
6. Release mouse
7. Buttons should swap positions
8. Screen reader announces "Button positions updated"

**Test 2: Activation Distance (8px)**
```
This prevents accidental drags during normal clicks
```

**Steps:**
1. Click on a button (without moving mouse)
2. Button should NOT start dragging
3. Click and move mouse 5px - should NOT drag
4. Click and move mouse 10px - SHOULD start dragging

**Verify:**
- Small mouse movements don't trigger drag
- Clicking buttons still works normally
- Must drag at least 8px before drag starts

**Test 3: Visual Feedback**

**During drag:**
- [ ] Dragged button shows 50% opacity
- [ ] Cursor shows "move" icon (four arrows)
- [ ] Other buttons remain at 100% opacity
- [ ] Button follows cursor smoothly

**After drop:**
- [ ] Button returns to 100% opacity
- [ ] Cursor returns to normal
- [ ] Positions update immediately
- [ ] No visual glitches

### Keyboard Interaction

**Test 4: Keyboard Drag (Accessibility)**

**Steps:**
1. Enter edit mode
2. Press Tab to focus first button
3. Press Space bar to "grab" button
4. Press Arrow keys to move (Up/Down/Left/Right)
5. Press Space bar again to "drop"
6. Verify positions swapped

**Verify:**
- [ ] Tab focuses buttons in order
- [ ] Space grabs/drops button
- [ ] Arrow keys move selection
- [ ] Focus visible on current button
- [ ] Works without mouse

---

## Mobile Testing

### Touch Interaction

**Test 5: Touch Drag (iOS Safari)**

**Steps:**
1. Open LoveWords on iPhone/iPad
2. Navigate to custom board
3. Tap "✏️ Edit Board"
4. Long press (500ms) on a button
5. Drag finger to new position
6. Release finger
7. Verify swap occurred

**Verify:**
- [ ] Long press activates drag (not immediate)
- [ ] Button follows finger during drag
- [ ] Visual feedback appears (50% opacity)
- [ ] Drop works on release
- [ ] Smooth 60fps animation

**Test 6: Touch Drag (Android Chrome)**

Same steps as iOS Safari.

**Verify:**
- [ ] Same behavior as iOS
- [ ] No lag or stuttering
- [ ] Haptic feedback (if device supports)

### Gesture Conflicts

**Test 7: No Conflicts with Scroll**

**Steps:**
1. Create board with 20+ buttons (scroll required)
2. Enter edit mode
3. Try to scroll up/down
4. Verify scrolling still works
5. Try to drag a button
6. Verify drag still works

**Verify:**
- [ ] Can scroll without triggering drag
- [ ] Can drag without triggering scroll
- [ ] 8px activation prevents conflicts

---

## Edge Cases

### Test 8: Drag to Same Position
```
Action:   Drag [A] to [A]'s position (no movement)
Expected: No change, no error
```

**Verify:**
- [ ] No position change
- [ ] No announcement
- [ ] No errors in console

### Test 9: Drag Empty Cell
```
Action:   Try to drag an empty cell
Expected: Nothing happens (empty cells not draggable)
```

**Verify:**
- [ ] Empty cells have no drag cursor
- [ ] Clicking empty cell opens ButtonEditor
- [ ] Cannot drag empty cells

### Test 10: Rapid Consecutive Drags
```
Action:   Drag [A]→[B], immediately drag [B]→[C], immediately drag [C]→[A]
Expected: All swaps occur correctly, no glitches
```

**Verify:**
- [ ] All swaps execute
- [ ] No position corruption
- [ ] No visual artifacts
- [ ] Final state correct

### Test 11: Drag During Speech
```
Action:   Click button to start speech, immediately drag button
Expected: Both actions work independently
```

**Verify:**
- [ ] Speech continues playing
- [ ] Drag works normally
- [ ] No interference

### Test 12: Default Board Protection
```
Action:   Try to drag on "Love and Affection" (default board)
Expected: Edit mode button not shown, cannot drag
```

**Verify:**
- [ ] "✏️ Edit Board" button not shown for defaults
- [ ] Cannot enter edit mode
- [ ] Drag-and-drop disabled

---

## Persistence Testing

### Test 13: Persist After Refresh
```
Action:   Drag buttons, refresh page (F5 or Cmd+R)
Expected: Positions remain as reordered
```

**Steps:**
1. Create custom board with 6 buttons
2. Drag [A]→[F], [B]→[E], [C]→[D]
3. Refresh page
4. Navigate back to custom board
5. Verify positions match reordered state

**Verify:**
- [ ] Positions saved to localStorage
- [ ] Reload preserves order
- [ ] No corruption of board data

### Test 14: Persist Across Sessions
```
Action:   Drag buttons, close browser, reopen
Expected: Positions still match reordered state
```

**Verify:**
- [ ] Same as Test 13
- [ ] Works even after browser close

---

## Performance Testing

### Test 15: Large Board Drag Performance
```
Action:   Create 6×6 board (36 buttons), drag buttons
Expected: Smooth 60fps drag with no lag
```

**Steps:**
1. Create 6×6 grid
2. Add 36 buttons (with images)
3. Enter edit mode
4. Drag buttons around
5. Monitor performance in DevTools

**Verify:**
- [ ] Drag animation smooth (60fps)
- [ ] No frame drops
- [ ] No stuttering
- [ ] Responsive to input

**DevTools Check:**
- Open Performance tab
- Record while dragging
- Check for frame rate drops
- Target: 60fps, no red bars

### Test 16: Memory Leaks
```
Action:   Drag 50+ times consecutively, check memory
Expected: No memory growth
```

**Steps:**
1. Open DevTools → Memory tab
2. Take heap snapshot
3. Drag buttons 50 times
4. Take another heap snapshot
5. Compare snapshots

**Verify:**
- [ ] No significant memory growth
- [ ] Event listeners cleaned up
- [ ] No detached DOM nodes

---

## Browser Compatibility

### Chrome
- [ ] Drag-and-drop works
- [ ] Smooth 60fps
- [ ] Visual feedback correct
- [ ] Keyboard accessible

### Firefox
- [ ] Same as Chrome
- [ ] CSS transitions smooth
- [ ] No visual glitches

### Safari (Desktop)
- [ ] Same as Chrome
- [ ] Check for webkit-specific issues

### Safari (iOS)
- [ ] Touch drag works
- [ ] Long press activates drag
- [ ] Smooth on retina displays

### Chrome (Android)
- [ ] Touch drag works
- [ ] Performance acceptable
- [ ] No input lag

---

## Accessibility Testing

### Test 17: Screen Reader Compatibility
```
Tool:   VoiceOver (iOS/macOS), TalkBack (Android), NVDA (Windows)
```

**Steps:**
1. Enable screen reader
2. Navigate to custom board
3. Enter edit mode
4. Use keyboard to drag (Space + Arrows)
5. Verify announcements

**Verify:**
- [ ] "Edit mode enabled" announced
- [ ] Button labels announced on focus
- [ ] "Grabbed" announced when Space pressed
- [ ] "Dropped" announced when released
- [ ] "Button positions updated" announced after swap

### Test 18: High Contrast Mode
```
Windows High Contrast, macOS Increase Contrast
```

**Verify:**
- [ ] Drag cursor visible
- [ ] Focus indicator visible
- [ ] 50% opacity still distinguishable
- [ ] All buttons readable

### Test 19: Reduced Motion
```
Preference: prefers-reduced-motion
```

**Steps:**
1. Enable "Reduce Motion" in OS settings
2. Drag buttons
3. Verify animations disabled but function works

**Verify:**
- [ ] Drag still works
- [ ] No smooth transitions
- [ ] Instant position swap
- [ ] Functionality intact

---

## Known Limitations

1. **Cannot drag from one board to another** - by design, drag only works within a single board
2. **Cannot undo drag** - no undo/redo system yet
3. **No multi-select drag** - can only drag one button at a time
4. **No snap-to-grid animation** - buttons swap instantly on drop

---

## Bug Reporting Template

If you find a bug during testing:

```markdown
**Title:** [Brief description]

**Severity:** Critical / High / Medium / Low

**Environment:**
- Browser:
- OS:
- Device:

**Steps to Reproduce:**
1.
2.
3.

**Expected Result:**

**Actual Result:**

**Screenshot/Video:** (if applicable)

**Console Errors:** (if any)

**Workaround:** (if found)
```

---

## Test Completion Checklist

**Date:** __________
**Tester:** __________

### Desktop (✓ / ✗ / N/A)
- [ ] Mouse drag (Tests 1-3)
- [ ] Keyboard drag (Test 4)
- [ ] Edge cases (Tests 8-12)
- [ ] Performance (Tests 15-16)

### Mobile (✓ / ✗ / N/A)
- [ ] Touch drag iOS (Test 5)
- [ ] Touch drag Android (Test 6)
- [ ] Gesture conflicts (Test 7)

### Persistence (✓ / ✗ / N/A)
- [ ] Refresh (Test 13)
- [ ] Cross-session (Test 14)

### Accessibility (✓ / ✗ / N/A)
- [ ] Screen reader (Test 17)
- [ ] High contrast (Test 18)
- [ ] Reduced motion (Test 19)

**Issues Found:** __________

**Ready for Release:** ☐ Yes  ☐ No (needs fixes)
