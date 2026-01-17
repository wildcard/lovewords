//! Input events from various sources.
//!
//! Input events are platform-agnostic representations of user actions
//! that can trigger cell activation or navigation.

use std::time::Duration;

/// An input event from any source.
#[derive(Debug, Clone, PartialEq)]
pub enum InputEvent {
    /// Direct tap/click on a cell at (row, col).
    Tap { row: usize, col: usize },

    /// Long press on a cell.
    LongPress {
        row: usize,
        col: usize,
        duration: Duration,
    },

    /// Dwell selection (hovered long enough to select).
    Dwell {
        row: usize,
        col: usize,
        dwell_time: Duration,
    },

    /// Switch press (for scanning input).
    SwitchPress {
        /// Which switch was pressed (0 = primary, 1 = secondary, etc.)
        switch_id: u8,
    },

    /// Switch release.
    SwitchRelease { switch_id: u8 },

    /// Keyboard navigation.
    Key(KeyEvent),

    /// Scroll/swipe gesture.
    Scroll { dx: i32, dy: i32 },

    /// Voice command activation.
    Voice { command: String },
}

impl InputEvent {
    /// Create a tap event.
    pub fn tap(row: usize, col: usize) -> Self {
        Self::Tap { row, col }
    }

    /// Create a primary switch press event.
    pub fn switch_press() -> Self {
        Self::SwitchPress { switch_id: 0 }
    }

    /// Create a secondary switch press event.
    pub fn switch_secondary() -> Self {
        Self::SwitchPress { switch_id: 1 }
    }

    /// Create a dwell event.
    pub fn dwell(row: usize, col: usize, dwell_time: Duration) -> Self {
        Self::Dwell {
            row,
            col,
            dwell_time,
        }
    }

    /// Check if this is a selection event (tap, dwell, or switch).
    pub fn is_selection(&self) -> bool {
        matches!(
            self,
            InputEvent::Tap { .. } | InputEvent::Dwell { .. } | InputEvent::SwitchPress { .. }
        )
    }

    /// Get the cell position if this is a direct selection.
    pub fn cell_position(&self) -> Option<(usize, usize)> {
        match self {
            InputEvent::Tap { row, col }
            | InputEvent::LongPress { row, col, .. }
            | InputEvent::Dwell { row, col, .. } => Some((*row, *col)),
            _ => None,
        }
    }
}

/// Keyboard navigation events.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum KeyEvent {
    /// Move focus up.
    Up,
    /// Move focus down.
    Down,
    /// Move focus left.
    Left,
    /// Move focus right.
    Right,
    /// Activate the focused cell.
    Enter,
    /// Go back / cancel.
    Escape,
    /// Tab to next cell.
    Tab,
    /// Shift+Tab to previous cell.
    ShiftTab,
    /// Space to activate.
    Space,
}

impl KeyEvent {
    /// Check if this is a navigation key.
    pub fn is_navigation(&self) -> bool {
        matches!(
            self,
            KeyEvent::Up
                | KeyEvent::Down
                | KeyEvent::Left
                | KeyEvent::Right
                | KeyEvent::Tab
                | KeyEvent::ShiftTab
        )
    }

    /// Check if this is an activation key.
    pub fn is_activation(&self) -> bool {
        matches!(self, KeyEvent::Enter | KeyEvent::Space)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_tap_event() {
        let event = InputEvent::tap(1, 2);
        assert_eq!(event.cell_position(), Some((1, 2)));
        assert!(event.is_selection());
    }

    #[test]
    fn test_switch_event() {
        let event = InputEvent::switch_press();
        assert!(event.is_selection());
        assert!(event.cell_position().is_none());
    }

    #[test]
    fn test_key_event() {
        assert!(KeyEvent::Up.is_navigation());
        assert!(!KeyEvent::Up.is_activation());
        assert!(KeyEvent::Enter.is_activation());
        assert!(!KeyEvent::Enter.is_navigation());
    }
}
