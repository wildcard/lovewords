//! Board navigation state machine.
//!
//! The [`BoardNavigator`] manages the navigation stack and current position
//! as users interact with nested boards.

use crate::error::{BoardError, Result};
use crate::obf::ObfBoard;

/// Manages navigation state across a hierarchy of boards.
///
/// The navigator maintains:
/// - A stack of previously visited boards
/// - The current board
/// - Optional cursor position for keyboard/switch navigation
///
/// # Example
///
/// ```rust
/// use lovewords_core::{BoardNavigator, ObfBoard};
///
/// let home = ObfBoard::new("home", 2, 3);
/// let mut nav = BoardNavigator::new(home);
///
/// // Navigate to a sub-board
/// let sub_board = ObfBoard::new("sub", 2, 2);
/// nav.push(sub_board);
///
/// // Go back
/// nav.pop().unwrap();
/// ```
#[derive(Debug, Clone)]
pub struct BoardNavigator {
    /// Stack of previous boards (most recent at end).
    stack: Vec<ObfBoard>,
    /// The currently displayed board.
    current: ObfBoard,
    /// Current cursor position (row, col) for scanning/keyboard nav.
    cursor: Option<(usize, usize)>,
    /// ID of the home board for :home action.
    home_id: String,
}

impl BoardNavigator {
    /// Create a new navigator with the given root/home board.
    pub fn new(home: ObfBoard) -> Self {
        let home_id = home.id.clone();
        Self {
            stack: Vec::new(),
            current: home,
            cursor: None,
            home_id,
        }
    }

    /// Get the current board.
    pub fn current(&self) -> &ObfBoard {
        &self.current
    }

    /// Get mutable access to the current board.
    pub fn current_mut(&mut self) -> &mut ObfBoard {
        &mut self.current
    }

    /// Get the home board ID.
    pub fn home_id(&self) -> &str {
        &self.home_id
    }

    /// Get the navigation stack depth.
    pub fn depth(&self) -> usize {
        self.stack.len()
    }

    /// Check if we're at the root/home board.
    pub fn is_at_home(&self) -> bool {
        self.stack.is_empty()
    }

    /// Navigate to a new board, pushing current onto the stack.
    pub fn push(&mut self, board: ObfBoard) {
        let old = std::mem::replace(&mut self.current, board);
        self.stack.push(old);
        self.cursor = None;
    }

    /// Go back to the previous board.
    ///
    /// Returns the board we're leaving, or an error if at root.
    pub fn pop(&mut self) -> Result<ObfBoard> {
        match self.stack.pop() {
            Some(prev) => {
                let leaving = std::mem::replace(&mut self.current, prev);
                self.cursor = None;
                Ok(leaving)
            }
            None => Err(BoardError::NavigationStackEmpty.into()),
        }
    }

    /// Go back to the previous board, or return `None` if at root.
    pub fn try_pop(&mut self) -> Option<ObfBoard> {
        self.pop().ok()
    }

    /// Navigate to the home board, clearing the stack.
    ///
    /// Returns all boards that were on the stack.
    pub fn go_home(&mut self) -> Vec<ObfBoard> {
        if self.stack.is_empty() {
            return Vec::new();
        }

        // First board in stack is home
        let home = self.stack.remove(0);
        let mut popped = std::mem::take(&mut self.stack);
        popped.push(std::mem::replace(&mut self.current, home));
        self.cursor = None;
        popped
    }

    /// Get the current cursor position.
    pub fn cursor(&self) -> Option<(usize, usize)> {
        self.cursor
    }

    /// Set the cursor position.
    pub fn set_cursor(&mut self, row: usize, col: usize) {
        if row < self.current.grid.rows && col < self.current.grid.columns {
            self.cursor = Some((row, col));
        }
    }

    /// Clear the cursor.
    pub fn clear_cursor(&mut self) {
        self.cursor = None;
    }

    /// Move cursor up.
    pub fn cursor_up(&mut self) {
        if let Some((row, col)) = self.cursor {
            if row > 0 {
                self.cursor = Some((row - 1, col));
            }
        } else {
            // Start at bottom-left
            let row = self.current.grid.rows.saturating_sub(1);
            self.cursor = Some((row, 0));
        }
    }

    /// Move cursor down.
    pub fn cursor_down(&mut self) {
        if let Some((row, col)) = self.cursor {
            if row + 1 < self.current.grid.rows {
                self.cursor = Some((row + 1, col));
            }
        } else {
            // Start at top-left
            self.cursor = Some((0, 0));
        }
    }

    /// Move cursor left.
    pub fn cursor_left(&mut self) {
        if let Some((row, col)) = self.cursor {
            if col > 0 {
                self.cursor = Some((row, col - 1));
            }
        } else {
            // Start at top-right
            let col = self.current.grid.columns.saturating_sub(1);
            self.cursor = Some((0, col));
        }
    }

    /// Move cursor right.
    pub fn cursor_right(&mut self) {
        if let Some((row, col)) = self.cursor {
            if col + 1 < self.current.grid.columns {
                self.cursor = Some((row, col + 1));
            }
        } else {
            // Start at top-left
            self.cursor = Some((0, 0));
        }
    }

    /// Move cursor to next cell in row-major order.
    pub fn cursor_next(&mut self) {
        if let Some((row, col)) = self.cursor {
            let cols = self.current.grid.columns;
            let rows = self.current.grid.rows;

            if col + 1 < cols {
                self.cursor = Some((row, col + 1));
            } else if row + 1 < rows {
                self.cursor = Some((row + 1, 0));
            } else {
                // Wrap to beginning
                self.cursor = Some((0, 0));
            }
        } else {
            self.cursor = Some((0, 0));
        }
    }

    /// Move cursor to previous cell in row-major order.
    pub fn cursor_prev(&mut self) {
        if let Some((row, col)) = self.cursor {
            let cols = self.current.grid.columns;
            let rows = self.current.grid.rows;

            if col > 0 {
                self.cursor = Some((row, col - 1));
            } else if row > 0 {
                self.cursor = Some((row - 1, cols - 1));
            } else {
                // Wrap to end
                self.cursor = Some((rows - 1, cols - 1));
            }
        } else {
            let rows = self.current.grid.rows;
            let cols = self.current.grid.columns;
            self.cursor = Some((rows.saturating_sub(1), cols.saturating_sub(1)));
        }
    }

    /// Get the button under the cursor, if any.
    pub fn cursor_button(&self) -> Option<&crate::obf::ObfButton> {
        let (row, col) = self.cursor?;
        self.current.button_at(row, col)
    }

    /// Get the breadcrumb trail (board names from home to current).
    pub fn breadcrumbs(&self) -> Vec<&str> {
        let mut crumbs: Vec<&str> = self.stack.iter().map(|b| b.name.as_str()).collect();
        crumbs.push(&self.current.name);
        crumbs
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn make_board(id: &str, rows: usize, cols: usize) -> ObfBoard {
        ObfBoard::new(id, rows, cols)
    }

    #[test]
    fn test_navigator_basic() {
        let home = make_board("home", 2, 3);
        let nav = BoardNavigator::new(home);

        assert_eq!(nav.current().id, "home");
        assert!(nav.is_at_home());
        assert_eq!(nav.depth(), 0);
    }

    #[test]
    fn test_navigator_push_pop() {
        let home = make_board("home", 2, 3);
        let mut nav = BoardNavigator::new(home);

        let sub = make_board("sub", 2, 2);
        nav.push(sub);

        assert_eq!(nav.current().id, "sub");
        assert!(!nav.is_at_home());
        assert_eq!(nav.depth(), 1);

        let popped = nav.pop().unwrap();
        assert_eq!(popped.id, "sub");
        assert_eq!(nav.current().id, "home");
        assert!(nav.is_at_home());
    }

    #[test]
    fn test_navigator_go_home() {
        let home = make_board("home", 2, 3);
        let mut nav = BoardNavigator::new(home);

        nav.push(make_board("level1", 2, 2));
        nav.push(make_board("level2", 2, 2));
        nav.push(make_board("level3", 2, 2));

        assert_eq!(nav.depth(), 3);

        let popped = nav.go_home();
        assert_eq!(popped.len(), 3);
        assert!(nav.is_at_home());
        assert_eq!(nav.current().id, "home");
    }

    #[test]
    fn test_navigator_cursor() {
        let home = make_board("home", 3, 4);
        let mut nav = BoardNavigator::new(home);

        assert!(nav.cursor().is_none());

        nav.set_cursor(1, 2);
        assert_eq!(nav.cursor(), Some((1, 2)));

        nav.cursor_right();
        assert_eq!(nav.cursor(), Some((1, 3)));

        nav.cursor_down();
        assert_eq!(nav.cursor(), Some((2, 3)));

        // Can't go beyond bounds
        nav.cursor_right();
        assert_eq!(nav.cursor(), Some((2, 3))); // Still at edge
    }

    #[test]
    fn test_navigator_cursor_wrap() {
        let home = make_board("home", 2, 2);
        let mut nav = BoardNavigator::new(home);

        nav.set_cursor(0, 0);

        // Next through all cells
        nav.cursor_next(); // (0,1)
        assert_eq!(nav.cursor(), Some((0, 1)));

        nav.cursor_next(); // (1,0)
        assert_eq!(nav.cursor(), Some((1, 0)));

        nav.cursor_next(); // (1,1)
        assert_eq!(nav.cursor(), Some((1, 1)));

        nav.cursor_next(); // wrap to (0,0)
        assert_eq!(nav.cursor(), Some((0, 0)));
    }

    #[test]
    fn test_navigator_breadcrumbs() {
        let mut home = make_board("home", 2, 3);
        home.name = "Home".to_string();

        let mut nav = BoardNavigator::new(home);

        let mut level1 = make_board("level1", 2, 2);
        level1.name = "Emotions".to_string();
        nav.push(level1);

        let mut level2 = make_board("level2", 2, 2);
        level2.name = "Happy".to_string();
        nav.push(level2);

        assert_eq!(nav.breadcrumbs(), vec!["Home", "Emotions", "Happy"]);
    }

    #[test]
    fn test_pop_at_root_fails() {
        let home = make_board("home", 2, 3);
        let mut nav = BoardNavigator::new(home);

        let result = nav.pop();
        assert!(result.is_err());
    }
}
