# Accessibility Testing

This document describes the accessibility testing strategy for LoveWords.

## Automated Tests

We use Vitest with @testing-library/react and jest-axe for automated accessibility testing.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui
```

### Test Coverage

#### Component-Level Tests

1. **Cell Component** (`Cell.accessibility.test.tsx`)
   - No accessibility violations (via axe)
   - Proper ARIA gridcell role
   - Correct row/column indices
   - Accessible labels from vocalization or label
   - Empty cells marked as disabled and hidden

2. **Board Component** (`Board.accessibility.test.tsx`)
   - No accessibility violations (via axe)
   - Proper ARIA grid role
   - Descriptive aria-label with board name
   - All cells have gridcell role

3. **Settings Modal** (`Settings.accessibility.test.tsx`)
   - No accessibility violations (via axe)
   - Proper dialog role with aria-modal
   - Labeled by title and description
   - Escape key closes modal
   - Keyboard shortcuts documentation
   - Proper form labels

4. **ScreenReaderAnnouncer** (`ScreenReaderAnnouncer.test.tsx`)
   - Polite and assertive live regions
   - Screen reader only styling
   - Proper ARIA attributes

### Key Accessibility Features Tested

- **Keyboard Navigation**: Arrow keys, Enter, Space
- **ARIA Semantics**: Grid, gridcell, dialog, live regions
- **Focus Management**: Focus trap in modals, skip links
- **Screen Reader Support**: Live announcements, proper labels
- **Form Accessibility**: Labels, descriptions, keyboard interaction

## Manual Testing Checklist

### Screen Reader Testing

Test with at least one screen reader:
- **macOS**: VoiceOver (Cmd+F5)
- **Windows**: NVDA or JAWS
- **Linux**: Orca

#### Test Cases

- [ ] Navigate cells using arrow keys
- [ ] Hear cell labels announced correctly
- [ ] Hear navigation announcements (board changes)
- [ ] Hear message updates when adding words
- [ ] Settings modal is properly announced
- [ ] Skip link works (Tab from top of page)

### Keyboard-Only Testing

Unplug mouse and use only keyboard:

- [ ] Tab through all interactive elements
- [ ] Use arrow keys to navigate grid
- [ ] Press Enter/Space to activate cells
- [ ] Open Settings with keyboard
- [ ] Navigate Settings form with Tab
- [ ] Close Settings with Escape
- [ ] Focus trap works in Settings (Tab cycles through modal)
- [ ] Skip link appears on Tab focus

### Visual Testing

- [ ] Focus indicators are visible (blue ring)
- [ ] Sufficient color contrast (check with browser DevTools)
- [ ] Text is readable at 200% zoom
- [ ] No content hidden by keyboard navigation

## Accessibility Standards

LoveWords aims to meet WCAG 2.1 Level AA standards:

- ✅ 1.4.3 Contrast (Minimum) - AA
- ✅ 2.1.1 Keyboard - A
- ✅ 2.1.2 No Keyboard Trap - A
- ✅ 2.4.1 Bypass Blocks - A (skip link)
- ✅ 2.4.3 Focus Order - A
- ✅ 2.4.7 Focus Visible - AA
- ✅ 3.2.1 On Focus - A
- ✅ 4.1.2 Name, Role, Value - A
- ✅ 4.1.3 Status Messages - AA (live regions)

## Tools

### Browser DevTools

- **Chrome**: Lighthouse accessibility audit
- **Firefox**: Accessibility Inspector
- **All browsers**: Inspect ARIA attributes

### Testing Libraries

- `jest-axe` - Automated accessibility violation detection
- `@testing-library/react` - User-centric testing
- `@testing-library/user-event` - Realistic user interactions

## Future Improvements

- [ ] Add integration tests for App component (requires fetch mocking)
- [ ] Test with multiple screen readers
- [ ] Add visual regression testing
- [ ] Test with speech recognition input
- [ ] Test switch scanning mode (when implemented)
