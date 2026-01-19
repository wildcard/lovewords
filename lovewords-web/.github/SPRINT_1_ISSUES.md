# Sprint 1 Issues - Phase 1: Switch Scanning Foundation

**Sprint Goal**: Implement single-switch automatic scanning

**Duration**: Weeks 1-4

---

## Issue 1: [P0] Create useScanner hook for switch scanning state management

**Description**:
Create a React hook that manages switch scanning state, including scan timer, current highlighted cell, and scan mode.

**Acceptance Criteria**:
- [ ] `useScanner` hook created in `src/hooks/useScanner.ts`
- [ ] Hook manages scan state (idle, scanning, selecting)
- [ ] Hook manages current highlighted cell coordinates
- [ ] Hook provides `startScanning()`, `stopScanning()`, `selectCell()` methods
- [ ] Hook accepts configuration: scan speed, scan pattern
- [ ] Unit tests for hook logic

**Technical Approach**:
- Use `useState` for scan state
- Use `useEffect` with `setInterval` for scan timer
- Use `useRef` to track timer ID
- Return state and control functions

**Estimated Effort**: M (Medium - 1-2 days)

**Labels**: `P0`, `feature`, `accessibility`, `switch-scanning`

---

## Issue 2: [P0] Implement visual scan highlight in Board component

**Description**:
Add visual highlighting to cells as the scanner moves through the board.

**Acceptance Criteria**:
- [ ] Highlighted cell has distinct visual indicator (blue ring + background)
- [ ] Highlight moves automatically based on scan timer
- [ ] Highlight respects scan pattern (linear row-by-row)
- [ ] Smooth CSS transitions (not jarring)
- [ ] High contrast for low vision users
- [ ] Works with keyboard focus (doesn't conflict)

**Technical Approach**:
- Add `isScanning` and `scanHighlightedCell` props to Board
- Update Cell component to accept `isScanHighlighted` prop
- Use CSS class `.scan-highlight` with distinct styling
- Use CSS transitions for smooth highlight movement

**Estimated Effort**: S (Small - half day)

**Labels**: `P0`, `feature`, `accessibility`, `switch-scanning`, `UI`

---

## Issue 3: [P0] Implement scan timer and automatic advancement

**Description**:
Create the scan timer that automatically advances the highlight through cells at configurable intervals.

**Acceptance Criteria**:
- [ ] Scan timer advances highlight every N milliseconds (configurable)
- [ ] Timer starts when scanning enabled
- [ ] Timer stops when scanning disabled
- [ ] Timer pauses when cell selected
- [ ] No memory leaks (timer cleaned up properly)
- [ ] Performance: 60fps maintained during scanning

**Technical Approach**:
- Use `setInterval` in `useScanner` hook
- Clear interval on unmount or stop
- Use `useCallback` for scan advancement function
- Optimize with `requestAnimationFrame` if needed

**Estimated Effort**: M (Medium - 1 day)

**Labels**: `P0`, `feature`, `accessibility`, `switch-scanning`

---

## Issue 4: [P0] Add scan speed configuration to Settings

**Description**:
Add UI controls in Settings modal for users to configure scan speed.

**Acceptance Criteria**:
- [ ] "Switch Scanning" section added to Settings modal
- [ ] "Enable Switch Scanning" toggle (on/off)
- [ ] "Scan Speed" slider (0.5s - 5s range)
- [ ] Real-time preview of scan speed
- [ ] Settings persist in localStorage
- [ ] Clear labels and descriptions

**Technical Approach**:
- Add `switchScanning` settings to Profile type
- Update Settings component with new section
- Add slider input with min=500, max=5000, step=100
- Display current speed in milliseconds and seconds
- Save to localStorage on change

**Estimated Effort**: S (Small - half day)

**Labels**: `P0`, `feature`, `accessibility`, `switch-scanning`, `UI`

---

## Issue 5: [P0] Implement screen touch as switch (selection)

**Description**:
Allow users to tap/click anywhere on screen to select the currently highlighted cell.

**Acceptance Criteria**:
- [ ] When scanning active, screen tap selects highlighted cell
- [ ] Works on touch devices (mobile/tablet)
- [ ] Works with mouse click (desktop)
- [ ] Visual feedback on selection (flash or animation)
- [ ] Selection triggers cell action (speak, navigate, etc.)
- [ ] Doesn't interfere with direct cell clicks when scanning off

**Technical Approach**:
- Add click handler to main app container (when scanning active)
- On click, get currently highlighted cell
- Trigger `onCellClick` with highlighted cell coordinates
- Prevent propagation to avoid double-triggers
- Add CSS animation for selection feedback

**Estimated Effort**: S (Small - 1 day)

**Labels**: `P0`, `feature`, `accessibility`, `switch-scanning`

---

## Issue 6: [P1] Add keyboard mapping for switch simulation

**Description**:
Map keyboard keys (Space, Enter) to switch actions for testing and accessibility.

**Acceptance Criteria**:
- [ ] Space key acts as switch (selects highlighted cell)
- [ ] Enter key also acts as switch (alternative)
- [ ] Works when scanning is active
- [ ] Doesn't interfere with existing keyboard nav
- [ ] Documented in keyboard shortcuts (Settings)

**Technical Approach**:
- Add global `keydown` event listener (when scanning active)
- Check for Space or Enter key
- Trigger selection of highlighted cell
- Update keyboard shortcuts documentation in Settings

**Estimated Effort**: S (Small - half day)

**Labels**: `P1`, `feature`, `accessibility`, `switch-scanning`

---

## Issue 7: [P0] Write tests for switch scanning functionality

**Description**:
Add comprehensive tests for switch scanning features.

**Acceptance Criteria**:
- [ ] Unit tests for `useScanner` hook
- [ ] Integration tests for scan highlight movement
- [ ] Integration tests for selection
- [ ] Accessibility tests (no new ARIA violations)
- [ ] Test scan speed changes
- [ ] Test enable/disable scanning

**Test Cases**:
```typescript
describe('useScanner', () => {
  it('should initialize with idle state', () => {});
  it('should start scanning when startScanning called', () => {});
  it('should advance highlight on timer', () => {});
  it('should select cell on selectCell call', () => {});
  it('should stop scanning when stopScanning called', () => {});
  it('should cleanup timer on unmount', () => {});
});

describe('Switch Scanning Integration', () => {
  it('should highlight cells in linear order', () => {});
  it('should select cell when screen tapped', () => {});
  it('should respect scan speed setting', () => {});
});
```

**Estimated Effort**: M (Medium - 1 day)

**Labels**: `P0`, `testing`, `accessibility`, `switch-scanning`

---

## Issue 8: [P1] Update documentation for switch scanning

**Description**:
Update user guide and developer guide with switch scanning documentation.

**Acceptance Criteria**:
- [ ] USER_GUIDE.md updated with "Switch Scanning" section
- [ ] Instructions on how to enable switch scanning
- [ ] Explanation of how to use (tap to select)
- [ ] DEVELOPER_GUIDE.md updated with switch scanning architecture
- [ ] Code examples for `useScanner` hook

**Estimated Effort**: S (Small - half day)

**Labels**: `P1`, `documentation`, `switch-scanning`

---

## Sprint 1 Summary

**Total Issues**: 8
**P0 Issues**: 6 (must complete)
**P1 Issues**: 2 (nice to have)

**Total Estimated Effort**: 6-8 days

**Success Criteria**:
- [ ] User can enable switch scanning in Settings
- [ ] Scan highlight automatically moves through cells
- [ ] User can select cell by tapping screen
- [ ] Scan speed is configurable
- [ ] All tests pass
- [ ] No accessibility regressions

**How to Create These Issues**:

1. Go to GitHub repository
2. For each issue above, create a new issue:
   - Copy the title
   - Copy the description and acceptance criteria
   - Add the labels listed
   - Assign to Sprint 1 milestone
   - Add to project board

Or use GitHub CLI:
```bash
gh issue create --title "[P0] Create useScanner hook for switch scanning state management" --body "..." --label "P0,feature,accessibility,switch-scanning"
```
