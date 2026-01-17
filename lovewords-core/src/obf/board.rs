//! OBF board types conforming to Open Board Format v1.0 specification.
//!
//! These types serialize/deserialize to valid OBF JSON, enabling import/export
//! with other AAC applications like CoughDrop, OpenBoard, and Board Builder.

use serde::{Deserialize, Serialize};

use super::extensions::ObfExtensions;

/// The format string for OBF v1.0.
pub const OBF_FORMAT: &str = "open-board-0.1";

/// An OBF board containing buttons arranged in a grid.
///
/// This is the top-level type for OBF files. Each board has:
/// - A unique ID
/// - A name/locale
/// - Buttons with actions
/// - A grid layout
/// - Optional images and sounds
///
/// # Example
///
/// ```rust
/// use lovewords_core::ObfBoard;
///
/// let json = r#"{
///   "format": "open-board-0.1",
///   "id": "love-board",
///   "name": "Love & Affection",
///   "locale": "en",
///   "buttons": [],
///   "images": [],
///   "sounds": [],
///   "grid": { "rows": 2, "columns": 3, "order": [[null, null, null], [null, null, null]] }
/// }"#;
///
/// let board: ObfBoard = serde_json::from_str(json).unwrap();
/// assert_eq!(board.id, "love-board");
/// ```
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ObfBoard {
    /// Format identifier, should be "open-board-0.1".
    pub format: String,

    /// Unique identifier for this board.
    pub id: String,

    /// Human-readable name for the board.
    #[serde(default)]
    pub name: String,

    /// Locale code (e.g., "en", "en-US").
    #[serde(default)]
    pub locale: String,

    /// Optional description text.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description_html: Option<String>,

    /// Buttons on this board.
    #[serde(default)]
    pub buttons: Vec<ObfButton>,

    /// Images referenced by buttons.
    #[serde(default)]
    pub images: Vec<ObfImage>,

    /// Sounds referenced by buttons.
    #[serde(default)]
    pub sounds: Vec<ObfSound>,

    /// Grid layout defining button positions.
    pub grid: ObfGrid,

    /// License information.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub license: Option<ObfLicense>,

    /// LoveWords-specific extensions.
    #[serde(flatten, default)]
    pub extensions: ObfExtensions,
}

impl ObfBoard {
    /// Create a new empty board with the given ID and grid dimensions.
    pub fn new(id: impl Into<String>, rows: usize, columns: usize) -> Self {
        let id = id.into();
        Self {
            format: OBF_FORMAT.to_string(),
            id: id.clone(),
            name: id,
            locale: "en".to_string(),
            description_html: None,
            buttons: Vec::new(),
            images: Vec::new(),
            sounds: Vec::new(),
            grid: ObfGrid::new(rows, columns),
            license: None,
            extensions: ObfExtensions::default(),
        }
    }

    /// Get a button by its ID.
    pub fn button(&self, id: &str) -> Option<&ObfButton> {
        self.buttons.iter().find(|b| b.id == id)
    }

    /// Get the button ID at a specific grid position, if any.
    pub fn button_id_at(&self, row: usize, col: usize) -> Option<&str> {
        self.grid
            .order
            .get(row)
            .and_then(|r| r.get(col))
            .and_then(|id| id.as_deref())
    }

    /// Get the button at a specific grid position, if any.
    pub fn button_at(&self, row: usize, col: usize) -> Option<&ObfButton> {
        self.button_id_at(row, col).and_then(|id| self.button(id))
    }

    /// Add a button to the board.
    pub fn add_button(&mut self, button: ObfButton) {
        self.buttons.push(button);
    }

    /// Place a button at a specific grid position.
    ///
    /// Returns `false` if the position is out of bounds.
    pub fn place_button_at(
        &mut self,
        button_id: impl Into<String>,
        row: usize,
        col: usize,
    ) -> bool {
        if row < self.grid.rows && col < self.grid.columns {
            self.grid.order[row][col] = Some(button_id.into());
            true
        } else {
            false
        }
    }
}

/// A button on an OBF board.
#[derive(Debug, Clone, Default, Serialize, Deserialize, PartialEq)]
pub struct ObfButton {
    /// Unique identifier for this button.
    pub id: String,

    /// Display label for the button.
    #[serde(default)]
    pub label: String,

    /// Text to speak (if different from label).
    #[serde(skip_serializing_if = "Option::is_none")]
    pub vocalization: Option<String>,

    /// Reference to an image ID.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub image_id: Option<String>,

    /// Reference to a sound ID.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub sound_id: Option<String>,

    /// Built-in action (e.g., ":speak", ":back", ":clear", ":home").
    #[serde(skip_serializing_if = "Option::is_none")]
    pub action: Option<String>,

    /// Board to load when pressed.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub load_board: Option<ObfLoadBoard>,

    /// Background color as CSS color string.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub background_color: Option<String>,

    /// Border color as CSS color string.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub border_color: Option<String>,

    /// Whether this button is hidden.
    #[serde(default, skip_serializing_if = "std::ops::Not::not")]
    pub hidden: bool,

    /// LoveWords-specific extensions for this button.
    #[serde(flatten, default)]
    pub extensions: ObfExtensions,
}

impl ObfButton {
    /// Create a new button with the given ID and label.
    pub fn new(id: impl Into<String>, label: impl Into<String>) -> Self {
        Self {
            id: id.into(),
            label: label.into(),
            vocalization: None,
            image_id: None,
            sound_id: None,
            action: None,
            load_board: None,
            background_color: None,
            border_color: None,
            hidden: false,
            extensions: ObfExtensions::default(),
        }
    }

    /// Create a speak button that vocalizes its label.
    pub fn speak(id: impl Into<String>, label: impl Into<String>) -> Self {
        let label = label.into();
        Self {
            id: id.into(),
            label: label.clone(),
            vocalization: Some(label),
            action: Some(":speak".to_string()),
            ..Default::default()
        }
    }

    /// Create a navigation button that loads another board.
    pub fn navigate(
        id: impl Into<String>,
        label: impl Into<String>,
        board_id: impl Into<String>,
    ) -> Self {
        Self {
            id: id.into(),
            label: label.into(),
            load_board: Some(ObfLoadBoard {
                id: Some(board_id.into()),
                ..Default::default()
            }),
            ..Default::default()
        }
    }

    /// Create a back button.
    pub fn back(id: impl Into<String>) -> Self {
        Self {
            id: id.into(),
            label: "Back".to_string(),
            action: Some(":back".to_string()),
            ..Default::default()
        }
    }

    /// Set the vocalization text.
    pub fn with_vocalization(mut self, text: impl Into<String>) -> Self {
        self.vocalization = Some(text.into());
        self
    }

    /// Set the background color.
    pub fn with_background_color(mut self, color: impl Into<String>) -> Self {
        self.background_color = Some(color.into());
        self
    }

    /// Get the text to speak for this button.
    ///
    /// Returns vocalization if set, otherwise falls back to label.
    pub fn speak_text(&self) -> &str {
        self.vocalization.as_deref().unwrap_or(&self.label)
    }
}

/// Grid layout for button positioning.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ObfGrid {
    /// Number of rows in the grid.
    pub rows: usize,

    /// Number of columns in the grid.
    pub columns: usize,

    /// 2D array mapping positions to button IDs.
    /// `None` indicates an empty cell.
    pub order: Vec<Vec<Option<String>>>,
}

impl ObfGrid {
    /// Create a new empty grid with the given dimensions.
    pub fn new(rows: usize, columns: usize) -> Self {
        Self {
            rows,
            columns,
            order: vec![vec![None; columns]; rows],
        }
    }

    /// Check if a position is valid within this grid.
    pub fn is_valid_position(&self, row: usize, col: usize) -> bool {
        row < self.rows && col < self.columns
    }

    /// Get the total number of cells.
    pub fn cell_count(&self) -> usize {
        self.rows * self.columns
    }
}

/// Reference to a board to load.
#[derive(Debug, Clone, Default, Serialize, Deserialize, PartialEq)]
pub struct ObfLoadBoard {
    /// ID of the board to load.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// URL to load the board from.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub url: Option<String>,

    /// Path to load the board from.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub path: Option<String>,

    /// Data URL containing the board JSON.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data_url: Option<String>,
}

/// An image resource.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ObfImage {
    /// Unique identifier for this image.
    pub id: String,

    /// URL to the image.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub url: Option<String>,

    /// Path to the image file.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub path: Option<String>,

    /// Data URL containing the image.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data_url: Option<String>,

    /// Content type (e.g., "image/png").
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content_type: Option<String>,

    /// Image width in pixels.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub width: Option<u32>,

    /// Image height in pixels.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub height: Option<u32>,

    /// Symbol set this image belongs to.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub symbol_set: Option<String>,

    /// License information for this image.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub license: Option<ObfLicense>,
}

/// A sound resource.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ObfSound {
    /// Unique identifier for this sound.
    pub id: String,

    /// URL to the sound.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub url: Option<String>,

    /// Path to the sound file.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub path: Option<String>,

    /// Data URL containing the sound.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data_url: Option<String>,

    /// Content type (e.g., "audio/mpeg").
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content_type: Option<String>,

    /// Duration in seconds.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub duration: Option<f32>,

    /// License information for this sound.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub license: Option<ObfLicense>,
}

/// License information for OBF content.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ObfLicense {
    /// License type (e.g., "CC BY-SA 4.0").
    #[serde(rename = "type", skip_serializing_if = "Option::is_none")]
    pub license_type: Option<String>,

    /// URL to the license.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub url: Option<String>,

    /// Copyright holder.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub copyright_notice_url: Option<String>,

    /// Author or creator.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub author_name: Option<String>,

    /// Author's URL.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub author_url: Option<String>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_obf_board_creation() {
        let board = ObfBoard::new("test-board", 3, 4);
        assert_eq!(board.id, "test-board");
        assert_eq!(board.grid.rows, 3);
        assert_eq!(board.grid.columns, 4);
        assert_eq!(board.format, OBF_FORMAT);
    }

    #[test]
    fn test_obf_button_speak() {
        let button = ObfButton::speak("btn_1", "Hello");
        assert_eq!(button.speak_text(), "Hello");
        assert_eq!(button.action, Some(":speak".to_string()));
    }

    #[test]
    fn test_obf_board_serialization() {
        let mut board = ObfBoard::new("test", 2, 2);
        let button = ObfButton::speak("btn_1", "Test");
        board.add_button(button);
        board.place_button_at("btn_1", 0, 0);

        let json = serde_json::to_string_pretty(&board).unwrap();
        let parsed: ObfBoard = serde_json::from_str(&json).unwrap();

        assert_eq!(board, parsed);
    }

    #[test]
    fn test_obf_grid_navigation() {
        let mut board = ObfBoard::new("nav-test", 2, 3);
        board.add_button(ObfButton::speak("btn_1", "One"));
        board.add_button(ObfButton::speak("btn_2", "Two"));
        board.place_button_at("btn_1", 0, 0);
        board.place_button_at("btn_2", 1, 2);

        assert_eq!(board.button_id_at(0, 0), Some("btn_1"));
        assert_eq!(board.button_id_at(1, 2), Some("btn_2"));
        assert_eq!(board.button_id_at(0, 1), None);
        assert_eq!(board.button_id_at(5, 5), None);
    }
}
