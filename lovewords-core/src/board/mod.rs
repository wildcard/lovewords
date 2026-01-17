//! Board model for LoveWords.
//!
//! This module provides a high-level interface for working with communication boards,
//! wrapping the low-level OBF types with navigation and interaction capabilities.

mod cell;
mod navigation;

pub use cell::{Cell, CellAction};
pub use navigation::BoardNavigator;

use crate::error::{BoardError, Result};
use crate::obf::{ObfBoard, ObfButton, ObfExtensions};

/// A communication board with cells arranged in a grid.
///
/// `Board` wraps an [`ObfBoard`] and provides methods for accessing cells,
/// handling interactions, and building navigation state.
///
/// # Example
///
/// ```rust
/// use lovewords_core::{Board, ObfBoard, ObfButton};
///
/// // Create a 2x2 board
/// let mut obf = ObfBoard::new("my-board", 2, 2);
/// obf.add_button(ObfButton::speak("btn_1", "Hello"));
/// obf.place_button_at("btn_1", 0, 0);
///
/// let board = Board::from_obf(obf);
///
/// // Access cells
/// if let Some(cell) = board.cell_at(0, 0) {
///     assert_eq!(cell.label(), "Hello");
/// }
/// ```
#[derive(Debug, Clone)]
pub struct Board {
    /// The underlying OBF board data.
    obf: ObfBoard,
}

impl Board {
    /// Create a Board from OBF data.
    pub fn from_obf(obf: ObfBoard) -> Self {
        Self { obf }
    }

    /// Create a new empty board with the given dimensions.
    pub fn new(id: impl Into<String>, rows: usize, cols: usize) -> Self {
        Self {
            obf: ObfBoard::new(id, rows, cols),
        }
    }

    /// Get the underlying OBF board.
    pub fn obf(&self) -> &ObfBoard {
        &self.obf
    }

    /// Get mutable access to the underlying OBF board.
    pub fn obf_mut(&mut self) -> &mut ObfBoard {
        &mut self.obf
    }

    /// Consume the Board and return the underlying OBF board.
    pub fn into_obf(self) -> ObfBoard {
        self.obf
    }

    /// Get the board's unique ID.
    pub fn id(&self) -> &str {
        &self.obf.id
    }

    /// Get the board's display name.
    pub fn name(&self) -> &str {
        &self.obf.name
    }

    /// Get the number of rows in the grid.
    pub fn rows(&self) -> usize {
        self.obf.grid.rows
    }

    /// Get the number of columns in the grid.
    pub fn cols(&self) -> usize {
        self.obf.grid.columns
    }

    /// Get the total number of cells.
    pub fn cell_count(&self) -> usize {
        self.obf.grid.cell_count()
    }

    /// Get the LoveWords extensions for this board.
    pub fn extensions(&self) -> &ObfExtensions {
        &self.obf.extensions
    }

    /// Get the cell at the specified position.
    ///
    /// Returns `None` if the position is out of bounds or the cell is empty.
    pub fn cell_at(&self, row: usize, col: usize) -> Option<Cell<'_>> {
        let button = self.obf.button_at(row, col)?;
        Some(Cell::new(button, row, col))
    }

    /// Get the cell at the specified position, returning an error if out of bounds.
    pub fn cell_at_checked(&self, row: usize, col: usize) -> Result<Option<Cell<'_>>> {
        if row >= self.rows() || col >= self.cols() {
            return Err(BoardError::CellOutOfBounds {
                row,
                col,
                rows: self.rows(),
                cols: self.cols(),
            }
            .into());
        }
        Ok(self.cell_at(row, col))
    }

    /// Check if a position is within the grid bounds.
    pub fn is_valid_position(&self, row: usize, col: usize) -> bool {
        row < self.rows() && col < self.cols()
    }

    /// Iterate over all cells in row-major order.
    ///
    /// Empty cells are skipped.
    pub fn cells(&self) -> impl Iterator<Item = Cell<'_>> + '_ {
        (0..self.rows())
            .flat_map(move |row| (0..self.cols()).filter_map(move |col| self.cell_at(row, col)))
    }

    /// Iterate over all positions in row-major order, including empty cells.
    pub fn positions(&self) -> impl Iterator<Item = (usize, usize)> + '_ {
        (0..self.rows()).flat_map(move |row| (0..self.cols()).map(move |col| (row, col)))
    }

    /// Get all non-empty cells as a vector.
    pub fn all_cells(&self) -> Vec<Cell<'_>> {
        self.cells().collect()
    }

    /// Count non-empty cells.
    pub fn filled_cell_count(&self) -> usize {
        self.cells().count()
    }

    /// Add a button and place it at the specified position.
    pub fn add_cell(&mut self, button: ObfButton, row: usize, col: usize) -> Result<()> {
        if !self.is_valid_position(row, col) {
            return Err(BoardError::CellOutOfBounds {
                row,
                col,
                rows: self.rows(),
                cols: self.cols(),
            }
            .into());
        }

        let button_id = button.id.clone();
        self.obf.add_button(button);
        self.obf.place_button_at(button_id, row, col);
        Ok(())
    }

    /// Find cells matching a predicate.
    pub fn find_cells<F>(&self, predicate: F) -> Vec<Cell<'_>>
    where
        F: Fn(&Cell<'_>) -> bool,
    {
        self.cells().filter(predicate).collect()
    }

    /// Find cells by warmth category.
    pub fn cells_with_warmth(&self, warmth: &str) -> Vec<Cell<'_>> {
        self.find_cells(|cell| {
            cell.extensions()
                .warmth
                .as_ref()
                .is_some_and(|w| w.iter().any(|s| s == warmth))
        })
    }

    /// Find cells by moment/context.
    pub fn cells_for_moment(&self, moment: &str) -> Vec<Cell<'_>> {
        self.find_cells(|cell| {
            cell.extensions()
                .moment
                .as_ref()
                .is_some_and(|m| m == moment)
        })
    }
}

impl From<ObfBoard> for Board {
    fn from(obf: ObfBoard) -> Self {
        Self::from_obf(obf)
    }
}

impl From<Board> for ObfBoard {
    fn from(board: Board) -> Self {
        board.into_obf()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn create_test_board() -> Board {
        let mut obf = ObfBoard::new("test", 2, 3);
        obf.add_button(ObfButton::speak("btn_1", "Hello"));
        obf.add_button(ObfButton::speak("btn_2", "World"));
        obf.place_button_at("btn_1", 0, 0);
        obf.place_button_at("btn_2", 0, 1);
        Board::from_obf(obf)
    }

    #[test]
    fn test_board_dimensions() {
        let board = create_test_board();
        assert_eq!(board.rows(), 2);
        assert_eq!(board.cols(), 3);
        assert_eq!(board.cell_count(), 6);
    }

    #[test]
    fn test_cell_access() {
        let board = create_test_board();

        let cell = board.cell_at(0, 0).unwrap();
        assert_eq!(cell.label(), "Hello");

        let cell = board.cell_at(0, 1).unwrap();
        assert_eq!(cell.label(), "World");

        // Empty cell
        assert!(board.cell_at(1, 0).is_none());

        // Out of bounds
        assert!(board.cell_at(5, 5).is_none());
    }

    #[test]
    fn test_cell_iteration() {
        let board = create_test_board();
        let cells: Vec<_> = board.cells().collect();
        assert_eq!(cells.len(), 2);
    }

    #[test]
    fn test_add_cell() {
        let mut board = Board::new("test", 2, 2);
        let button = ObfButton::speak("btn_1", "Test");

        board.add_cell(button, 0, 0).unwrap();

        let cell = board.cell_at(0, 0).unwrap();
        assert_eq!(cell.label(), "Test");
    }

    #[test]
    fn test_add_cell_out_of_bounds() {
        let mut board = Board::new("test", 2, 2);
        let button = ObfButton::speak("btn_1", "Test");

        let result = board.add_cell(button, 5, 5);
        assert!(result.is_err());
    }
}
