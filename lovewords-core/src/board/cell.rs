//! Cell types for board interactions.
//!
//! A cell represents a single button position on a board, with associated
//! actions and metadata.

use crate::obf::{ObfButton, ObfExtensions};

/// A cell on a communication board.
///
/// Cells wrap OBF buttons with position information and provide
/// methods to query their behavior.
#[derive(Debug, Clone)]
pub struct Cell<'a> {
    /// The underlying button data.
    button: &'a ObfButton,
    /// Row position in the grid.
    row: usize,
    /// Column position in the grid.
    col: usize,
}

impl<'a> Cell<'a> {
    /// Create a new cell from a button and position.
    pub fn new(button: &'a ObfButton, row: usize, col: usize) -> Self {
        Self { button, row, col }
    }

    /// Get the button's unique ID.
    pub fn id(&self) -> &str {
        &self.button.id
    }

    /// Get the display label.
    pub fn label(&self) -> &str {
        &self.button.label
    }

    /// Get the text to speak.
    ///
    /// Returns vocalization if set, otherwise the label.
    pub fn speak_text(&self) -> &str {
        self.button.speak_text()
    }

    /// Get the row position.
    pub fn row(&self) -> usize {
        self.row
    }

    /// Get the column position.
    pub fn col(&self) -> usize {
        self.col
    }

    /// Get the position as a tuple (row, col).
    pub fn position(&self) -> (usize, usize) {
        (self.row, self.col)
    }

    /// Get the background color, if set.
    pub fn background_color(&self) -> Option<&str> {
        self.button.background_color.as_deref()
    }

    /// Get the border color, if set.
    pub fn border_color(&self) -> Option<&str> {
        self.button.border_color.as_deref()
    }

    /// Check if this cell is hidden.
    pub fn is_hidden(&self) -> bool {
        self.button.hidden
    }

    /// Get the image ID, if set.
    pub fn image_id(&self) -> Option<&str> {
        self.button.image_id.as_deref()
    }

    /// Get the sound ID, if set.
    pub fn sound_id(&self) -> Option<&str> {
        self.button.sound_id.as_deref()
    }

    /// Get the LoveWords extensions.
    pub fn extensions(&self) -> &ObfExtensions {
        &self.button.extensions
    }

    /// Get the action this cell will perform when activated.
    pub fn action(&self) -> CellAction {
        // Check for explicit action
        if let Some(action) = &self.button.action {
            match action.as_str() {
                ":speak" => return CellAction::Speak(self.speak_text().to_string()),
                ":back" => return CellAction::Back,
                ":clear" => return CellAction::Clear,
                ":home" => return CellAction::Home,
                ":backspace" => return CellAction::Backspace,
                ":space" => return CellAction::AddWord(" ".to_string()),
                other => return CellAction::Custom(other.to_string()),
            }
        }

        // Check for navigation
        if let Some(load_board) = &self.button.load_board {
            if let Some(board_id) = &load_board.id {
                return CellAction::Navigate(board_id.clone());
            }
            if let Some(path) = &load_board.path {
                return CellAction::NavigatePath(path.clone());
            }
        }

        // Default: speak the label/vocalization
        CellAction::Speak(self.speak_text().to_string())
    }

    /// Check if this cell will speak when activated.
    pub fn is_speakable(&self) -> bool {
        matches!(self.action(), CellAction::Speak(_))
    }

    /// Check if this cell navigates to another board.
    pub fn is_navigation(&self) -> bool {
        matches!(
            self.action(),
            CellAction::Navigate(_)
                | CellAction::NavigatePath(_)
                | CellAction::Back
                | CellAction::Home
        )
    }
}

/// Actions that can be triggered by activating a cell.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum CellAction {
    /// Speak the given text.
    Speak(String),

    /// Navigate to another board by ID.
    Navigate(String),

    /// Navigate to another board by file path.
    NavigatePath(String),

    /// Go back to the previous board.
    Back,

    /// Go to the home/root board.
    Home,

    /// Clear the message bar.
    Clear,

    /// Remove the last word from the message bar.
    Backspace,

    /// Add a word to the message bar without speaking.
    AddWord(String),

    /// Play a sound.
    PlaySound(String),

    /// Custom action (platform-specific).
    Custom(String),
}

impl CellAction {
    /// Check if this action speaks text.
    pub fn is_speak(&self) -> bool {
        matches!(self, CellAction::Speak(_))
    }

    /// Check if this action navigates.
    pub fn is_navigate(&self) -> bool {
        matches!(
            self,
            CellAction::Navigate(_)
                | CellAction::NavigatePath(_)
                | CellAction::Back
                | CellAction::Home
        )
    }

    /// Get the text to speak, if this is a speak action.
    pub fn speak_text(&self) -> Option<&str> {
        match self {
            CellAction::Speak(text) => Some(text),
            _ => None,
        }
    }

    /// Get the target board ID, if this is a navigate action.
    pub fn target_board(&self) -> Option<&str> {
        match self {
            CellAction::Navigate(id) => Some(id),
            _ => None,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_cell_action_speak() {
        let button = ObfButton::speak("btn_1", "Hello");
        let cell = Cell::new(&button, 0, 0);

        assert_eq!(cell.action(), CellAction::Speak("Hello".to_string()));
        assert!(cell.is_speakable());
        assert!(!cell.is_navigation());
    }

    #[test]
    fn test_cell_action_navigate() {
        let button = ObfButton::navigate("nav_btn", "More", "board_2");
        let cell = Cell::new(&button, 0, 0);

        assert_eq!(cell.action(), CellAction::Navigate("board_2".to_string()));
        assert!(!cell.is_speakable());
        assert!(cell.is_navigation());
    }

    #[test]
    fn test_cell_action_back() {
        let button = ObfButton::back("back_btn");
        let cell = Cell::new(&button, 0, 0);

        assert_eq!(cell.action(), CellAction::Back);
        assert!(cell.is_navigation());
    }

    #[test]
    fn test_cell_vocalization() {
        let button = ObfButton::new("btn_1", "Hi").with_vocalization("Hello there!");
        let cell = Cell::new(&button, 0, 0);

        assert_eq!(cell.label(), "Hi");
        assert_eq!(cell.speak_text(), "Hello there!");
    }

    #[test]
    fn test_cell_action_methods() {
        let speak = CellAction::Speak("Hello".to_string());
        assert!(speak.is_speak());
        assert!(!speak.is_navigate());
        assert_eq!(speak.speak_text(), Some("Hello"));
        assert_eq!(speak.target_board(), None);

        let nav = CellAction::Navigate("board_2".to_string());
        assert!(!nav.is_speak());
        assert!(nav.is_navigate());
        assert_eq!(nav.speak_text(), None);
        assert_eq!(nav.target_board(), Some("board_2"));
    }
}
