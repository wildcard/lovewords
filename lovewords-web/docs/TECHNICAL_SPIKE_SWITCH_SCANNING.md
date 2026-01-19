# Technical Spike: Switch Scanning Implementation

**Date**: January 2026
**Purpose**: Research and plan implementation approach for switch scanning in LoveWords
**Duration**: 2-3 days

---

## Executive Summary

**Finding**: No off-the-shelf React library exists specifically for AAC switch scanning. We'll implement it ourselves using React hooks and browser APIs.

**Recommended Approach**: Custom implementation using `setInterval`, CSS transitions, and keyboard event handlers.

**Estimated Effort**: Medium (1-2 weeks for MVP)

**Risk Level**: Low (well-understood problem, platform implementations exist as reference)

---

## Research Findings

### 1. Library Landscape

**Libraries Evaluated**:
- [React Aria](https://react-spectrum.adobe.com/react-aria/) - Focus management, but no switch scanning
- [Reakit](https://reakit.io/) - Low-level accessible primitives, no switch scanning
- [Reach UI](https://reach.tech/) - Accessible components, no switch scanning

**Conclusion**: React accessibility libraries focus on focus management and ARIA semantics, not switch scanning. **We need to build this ourselves.**

### 2. Platform Implementations (Reference)

Existing platforms with switch scanning:
- **iOS/iPadOS Switch Control**: [User Guide](https://www.ablenetinc.com/content/html/Downloads/Switch_Downloads/ios_14_switch_control_user_guide_english.pdf)
- **Android Switch Access**: [Tips for using Switch Access](https://support.google.com/accessibility/android/answer/6395627?hl=en)
- **Chrome OS Switch Access**: [Developer Guide](https://chromium.googlesource.com/chromium/src/+/c93bea9af5a/docs/accessibility/os/switch_access.md)

**Key Takeaways**:
- All platforms support both automatic and manual scanning
- Configurable scan speed (0.5s - 5s typical range)
- Multiple scan patterns (linear, row-column, circular)
- Visual and auditory feedback

### 3. Scanning Methods

#### Single-Switch Automatic Scanning
- Cursor/highlight moves automatically through items
- User presses switch when desired item is highlighted
- **Implementation**: `setInterval` advances highlight every N milliseconds

#### Two-Switch Step Scanning
- Switch 1: Advance to next item
- Switch 2: Select current item
- **Implementation**: Keyboard event handlers (`keydown`)

#### Scan Patterns

| Pattern | Description | Use Case |
|---------|-------------|----------|
| **Linear** | Left-to-right, top-to-bottom | Simple, predictable (our MVP) |
| **Row-Column** | Select row, then column | Faster for large grids |
| **Circular** | Items arranged in circle | Not applicable for grid layout |

**Recommendation**: Start with linear scanning (MVP), add row-column in Phase 2.

---

## Technical Approach

### Architecture

```
┌─────────────────────────────────────────────────────┐
│                    App.tsx                          │
│  - Manages global scan state                       │
│  - Provides scan settings from Profile             │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│              useScanner Hook                        │
│  - Manages scan timer (setInterval)                │
│  - Tracks current highlighted cell                 │
│  - Provides startScanning(), stopScanning()        │
│  - Provides selectCell()                           │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│              Board Component                        │
│  - Receives scanHighlightedCell from useScanner    │
│  - Passes isScanHighlighted to Cell                │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│              Cell Component                         │
│  - Renders .scan-highlight class when highlighted  │
│  - CSS transition for smooth highlighting          │
└─────────────────────────────────────────────────────┘
```

### Core Hook: `useScanner`

```typescript
// src/hooks/useScanner.ts

export interface ScannerConfig {
  enabled: boolean;
  scanSpeed: number; // milliseconds (500-5000)
  scanPattern: 'linear' | 'row-column'; // MVP: linear only
}

export interface ScanState {
  isScanning: boolean;
  highlightedCell: { row: number; col: number } | null;
}

export function useScanner(
  board: ObfBoard,
  config: ScannerConfig,
  onSelect: (row: number, col: number) => void
) {
  const [scanState, setScanState] = useState<ScanState>({
    isScanning: false,
    highlightedCell: null,
  });

  const timerRef = useRef<number | null>(null);

  // Start scanning
  const startScanning = useCallback(() => {
    setScanState({ isScanning: true, highlightedCell: { row: 0, col: 0 } });

    timerRef.current = window.setInterval(() => {
      advanceHighlight();
    }, config.scanSpeed);
  }, [config.scanSpeed]);

  // Advance to next cell (linear pattern)
  const advanceHighlight = useCallback(() => {
    setScanState((prev) => {
      if (!prev.highlightedCell) return prev;

      const { row, col } = prev.highlightedCell;
      const grid = board.grid;

      // Linear: left-to-right, top-to-bottom
      let nextCol = col + 1;
      let nextRow = row;

      if (nextCol >= grid.columns) {
        nextCol = 0;
        nextRow = row + 1;
      }

      if (nextRow >= grid.rows) {
        nextRow = 0; // Wrap to start
      }

      return {
        ...prev,
        highlightedCell: { row: nextRow, col: nextCol },
      };
    });
  }, [board]);

  // Select current cell
  const selectCell = useCallback(() => {
    if (scanState.highlightedCell) {
      onSelect(scanState.highlightedCell.row, scanState.highlightedCell.col);
    }
  }, [scanState.highlightedCell, onSelect]);

  // Stop scanning
  const stopScanning = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setScanState({ isScanning: false, highlightedCell: null });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    scanState,
    startScanning,
    stopScanning,
    selectCell,
  };
}
```

### Visual Highlighting

**CSS Approach**:
```css
/* src/styles/index.css */

.cell-button {
  transition: all 0.2s ease-in-out;
  border: 2px solid transparent;
}

.cell-button.scan-highlight {
  border: 3px solid #3B82F6; /* Blue border */
  background-color: rgba(59, 130, 246, 0.1); /* Light blue background */
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3); /* Outer glow */
  transform: scale(1.05); /* Slightly larger */
  z-index: 10;
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  .cell-button {
    transition: none;
  }
  .cell-button.scan-highlight {
    transform: none; /* No scaling */
  }
}
```

**Component Integration**:
```typescript
// src/components/Cell.tsx

export interface CellProps {
  button?: ObfButton;
  onClick: () => void;
  isFocused?: boolean;
  isScanHighlighted?: boolean; // NEW
  // ... other props
}

export function Cell({ button, onClick, isScanHighlighted, ...props }: CellProps) {
  const className = `cell-button ${isScanHighlighted ? 'scan-highlight' : ''}`;

  return (
    <div role="gridcell">
      <button className={className} onClick={onClick}>
        {button?.label}
      </button>
    </div>
  );
}
```

### Selection Mechanism

**Screen Touch as Switch**:
```typescript
// src/App.tsx

function App() {
  const { scanState, selectCell } = useScanner(/* ... */);

  // Handle screen tap/click when scanning
  useEffect(() => {
    if (!scanState.isScanning) return;

    const handleGlobalClick = (e: MouseEvent) => {
      e.preventDefault();
      selectCell(); // Select highlighted cell
    };

    document.addEventListener('click', handleGlobalClick, { capture: true });

    return () => {
      document.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, [scanState.isScanning, selectCell]);

  // ...
}
```

**Keyboard Mapping**:
```typescript
// src/App.tsx

useEffect(() => {
  if (!scanState.isScanning) return;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      selectCell();
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}, [scanState.isScanning, selectCell]);
```

### Settings Integration

**Profile Type Update**:
```typescript
// src/types/profile.ts

export interface Profile {
  // ... existing fields
  switchScanning: {
    enabled: boolean;
    scanSpeed: number; // milliseconds (default: 2000)
    scanPattern: 'linear' | 'row-column'; // default: 'linear'
  };
}
```

**Settings UI**:
```typescript
// src/components/Settings.tsx

function Settings({ profile, onChange }: SettingsProps) {
  return (
    <div>
      {/* ... existing settings */}

      <section>
        <h3>Switch Scanning</h3>

        <label>
          <input
            type="checkbox"
            checked={profile.switchScanning.enabled}
            onChange={(e) => onChange({
              ...profile,
              switchScanning: {
                ...profile.switchScanning,
                enabled: e.target.checked,
              },
            })}
          />
          Enable Switch Scanning
        </label>

        {profile.switchScanning.enabled && (
          <>
            <label>
              Scan Speed: {(profile.switchScanning.scanSpeed / 1000).toFixed(1)}s
              <input
                type="range"
                min={500}
                max={5000}
                step={100}
                value={profile.switchScanning.scanSpeed}
                onChange={(e) => onChange({
                  ...profile,
                  switchScanning: {
                    ...profile.switchScanning,
                    scanSpeed: parseInt(e.target.value, 10),
                  },
                })}
              />
            </label>

            <p>
              Tap anywhere on the screen or press Space/Enter to select the highlighted button.
            </p>
          </>
        )}
      </section>
    </div>
  );
}
```

---

## Performance Considerations

### Optimization Strategies

1. **CSS Transitions Over JavaScript Animation**
   - Use CSS `transition` for highlight movement (GPU-accelerated)
   - Avoid frequent DOM manipulation

2. **`useCallback` for Event Handlers**
   - Memoize `selectCell`, `startScanning`, `stopScanning`
   - Prevent unnecessary re-renders

3. **Timer Cleanup**
   - Always clear `setInterval` on unmount
   - Use `useRef` to track timer ID

4. **Debounce Rapid Selections**
   - Prevent double-selection if user taps multiple times
   - Add 200ms cooldown after selection

### Performance Targets

- **60fps** during scanning (no dropped frames)
- **<50ms** latency from switch press to selection
- **<2MB** additional bundle size

---

## Accessibility Considerations

### ARIA Announcements

```typescript
// Announce when scanning starts
announce("Switch scanning started. Tap to select highlighted button.", "polite");

// Announce current cell when highlighted
announce(`Highlighted: ${button.label}`, "polite");

// Announce when cell selected
announce(`Selected: ${button.label}`, "assertive");
```

### Reduced Motion

Respect `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  .cell-button.scan-highlight {
    transition: none;
    transform: none;
  }
}
```

### High Contrast Mode

Ensure highlight visible in high contrast:
```css
@media (prefers-contrast: high) {
  .cell-button.scan-highlight {
    border: 4px solid currentColor;
    outline: 2px solid CanvasText;
  }
}
```

---

## Testing Strategy

### Unit Tests

```typescript
// src/hooks/__tests__/useScanner.test.ts

describe('useScanner', () => {
  it('should initialize with idle state', () => {
    const { result } = renderHook(() => useScanner(board, config, jest.fn()));
    expect(result.current.scanState.isScanning).toBe(false);
  });

  it('should start scanning when startScanning called', () => {
    const { result } = renderHook(() => useScanner(board, config, jest.fn()));
    act(() => {
      result.current.startScanning();
    });
    expect(result.current.scanState.isScanning).toBe(true);
  });

  it('should advance highlight on timer', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() =>
      useScanner(board, { enabled: true, scanSpeed: 1000, scanPattern: 'linear' }, jest.fn())
    );

    act(() => {
      result.current.startScanning();
    });

    expect(result.current.scanState.highlightedCell).toEqual({ row: 0, col: 0 });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.scanState.highlightedCell).toEqual({ row: 0, col: 1 });

    jest.useRealTimers();
  });

  it('should cleanup timer on unmount', () => {
    const { result, unmount } = renderHook(() => useScanner(board, config, jest.fn()));
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    act(() => {
      result.current.startScanning();
    });

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
```

### Integration Tests

```typescript
// src/components/__tests__/Board.scanning.test.tsx

describe('Board with Switch Scanning', () => {
  it('should highlight cells in linear order', async () => {
    const { getByRole } = render(<App />);

    // Enable switch scanning
    fireEvent.click(getByRole('button', { name: /settings/i }));
    fireEvent.click(getByRole('checkbox', { name: /enable switch scanning/i }));

    // Wait for scan to advance
    await waitFor(() => {
      const highlightedCell = document.querySelector('.scan-highlight');
      expect(highlightedCell).toBeInTheDocument();
    });
  });

  it('should select cell when screen tapped', async () => {
    const { getByRole, container } = render(<App />);

    // Enable switch scanning
    fireEvent.click(getByRole('button', { name: /settings/i }));
    fireEvent.click(getByRole('checkbox', { name: /enable switch scanning/i }));

    // Wait for cell to be highlighted
    await waitFor(() => {
      expect(document.querySelector('.scan-highlight')).toBeInTheDocument();
    });

    // Tap screen (click anywhere)
    fireEvent.click(container);

    // Verify cell action triggered (e.g., message added)
    expect(getByRole('status')).toHaveTextContent(/speaking/i);
  });
});
```

### Manual Testing Checklist

- [ ] Scanning starts when enabled in Settings
- [ ] Highlight moves smoothly through cells
- [ ] Scan speed changes reflect immediately
- [ ] Screen tap selects highlighted cell
- [ ] Space/Enter keys select highlighted cell
- [ ] Scanning stops when disabled
- [ ] Works on touch devices (mobile/tablet)
- [ ] Works with external switches (keyboard adapters)
- [ ] No console errors or warnings
- [ ] Performance: 60fps maintained

---

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Timer drift** (scan speed inconsistent over time) | Medium | Low | Use `requestAnimationFrame` + elapsed time calculation |
| **Performance issues** on low-end devices | High | Medium | Profile on Android mid-range phone, optimize CSS |
| **Switch double-trigger** (user taps twice by accident) | Medium | Medium | Add 200ms debounce after selection |
| **Conflicts with keyboard navigation** | Medium | Low | Disable arrow key nav when scanning active |
| **Highlight not visible** in some color schemes | Medium | Low | Test with high contrast mode, ensure border visible |

---

## Recommended Implementation Order

### Week 1: Core Implementation
1. Create `useScanner` hook
2. Add visual highlight to Cell component
3. Implement scan timer and advancement
4. Add Settings UI for enable/disable and scan speed

### Week 2: Selection & Testing
5. Implement screen tap selection
6. Add keyboard mapping (Space/Enter)
7. Write unit tests for `useScanner`
8. Write integration tests for scanning flow
9. Manual testing on multiple devices

### Week 3: Polish & User Testing
10. Add ARIA announcements
11. Optimize performance (if needed)
12. User testing with 3-5 motor-impaired users
13. Iterate based on feedback

---

## Success Criteria

- [ ] User can enable switch scanning in Settings
- [ ] Scan highlight moves through cells automatically
- [ ] User can select cell by tapping screen
- [ ] Scan speed is configurable (0.5s - 5s)
- [ ] All tests pass (unit + integration)
- [ ] No accessibility regressions (jest-axe)
- [ ] Performance: 60fps on mid-range Android phone
- [ ] User testing: 3/5 users can use successfully

---

## Alternative Approaches Considered

### 1. Use Platform Switch Access APIs
**Pros**: Leverage native OS features
**Cons**: Not available in web browsers, would require native app
**Decision**: Rejected - we need web-based solution

### 2. Use Third-Party Scanning Library
**Pros**: Less code to write
**Cons**: No suitable library exists for AAC scanning
**Decision**: Rejected - build custom

### 3. Use CSS Animations Instead of JavaScript Timer
**Pros**: GPU-accelerated, potentially smoother
**Cons**: Harder to control timing, synchronization issues
**Decision**: Rejected - JavaScript timer more flexible

---

## Next Steps

1. **This Week**: Implement `useScanner` hook (Issue #1)
2. **This Week**: Add visual highlight to Board/Cell (Issue #2)
3. **Next Week**: Implement selection mechanism (Issue #5)
4. **Next Week**: Write tests (Issue #7)

---

## Resources & References

**Research Sources**:
- [iOS Switch Control User Guide](https://www.ablenetinc.com/content/html/Downloads/Switch_Downloads/ios_14_switch_control_user_guide_english.pdf)
- [Android Switch Access Tips](https://support.google.com/accessibility/android/answer/6395627?hl=en)
- [Chrome OS Switch Access Developer Guide](https://chromium.googlesource.com/chromium/src/+/c93bea9af5a/docs/accessibility/os/switch_access.md)
- [Switch Access Scanning - Wikipedia](https://en.wikipedia.org/wiki/Switch_access_scanning)
- [AAC Switch Scanning Resources](https://sites.google.com/cps.edu/assistive-technology-resources/alternate-access/switch-scanning)
- [React Aria - Focus Management](https://react-spectrum.adobe.com/react-aria/accessibility.html)

**Related Documentation**:
- PRODUCT_ROADMAP.md (Phase 1, Milestone 1.1)
- COMPETITIVE_ANALYSIS.md (Switch scanning gap)
- USER_TESTING_PLAN.md (Phase 1 testing scenarios)

---

**Technical Spike Complete**: ✅
**Recommendation**: Proceed with custom implementation using React hooks
**Estimated Effort**: 1-2 weeks for MVP
**Risk Level**: Low
