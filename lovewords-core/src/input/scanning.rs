//! Switch scanning input method.
//!
//! Switch scanning is an accessibility input method where users with limited
//! motor control can navigate and select cells using one or two switches.
//!
//! # Scanning Modes
//!
//! - **Row-Column**: First scan highlights rows, then columns within selected row
//! - **Linear**: Scan through cells one at a time
//! - **Block**: Scan through groups of cells
//!
//! # Timing
//!
//! - **Scan Rate**: How fast the highlight moves
//! - **First Item Delay**: Extra time on first item after wrap
//! - **Auto-Scan**: Automatic progression vs manual switch advances

use std::time::Duration;

/// Scanning mode for switch access.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default, serde::Serialize, serde::Deserialize)]
pub enum ScanMode {
    /// Row-column scanning: first select a row, then a cell within that row.
    #[default]
    RowColumn,

    /// Linear scanning: move through cells one at a time in row-major order.
    Linear,

    /// Column-row scanning: first select a column, then a cell within that column.
    ColumnRow,

    /// Block scanning: scan through groups of cells (requires block definitions).
    Block,
}

/// Current state of the scanner.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ScanState {
    /// Not currently scanning.
    Idle,

    /// Scanning through rows (row-column mode).
    ScanningRows { current_row: usize },

    /// Scanning through columns in a selected row.
    ScanningColumns { row: usize, current_col: usize },

    /// Linear scanning through all cells.
    ScanningLinear { row: usize, col: usize },

    /// Scanning through columns (column-row mode).
    ScanningCols { current_col: usize },

    /// Scanning through rows in a selected column.
    ScanningRowsInCol { col: usize, current_row: usize },

    /// Cell is selected, awaiting confirmation or next action.
    Selected { row: usize, col: usize },
}

impl ScanState {
    /// Get the currently highlighted position, if any.
    pub fn highlighted_position(&self) -> Option<(usize, usize)> {
        match self {
            ScanState::ScanningColumns { row, current_col } => Some((*row, *current_col)),
            ScanState::ScanningLinear { row, col } => Some((*row, *col)),
            ScanState::ScanningRowsInCol { col, current_row } => Some((*current_row, *col)),
            ScanState::Selected { row, col } => Some((*row, *col)),
            _ => None,
        }
    }

    /// Get the currently highlighted row, if any.
    pub fn highlighted_row(&self) -> Option<usize> {
        match self {
            ScanState::ScanningRows { current_row } => Some(*current_row),
            ScanState::ScanningColumns { row, .. } => Some(*row),
            ScanState::ScanningLinear { row, .. } => Some(*row),
            ScanState::Selected { row, .. } => Some(*row),
            _ => None,
        }
    }

    /// Check if scanning is active.
    pub fn is_scanning(&self) -> bool {
        !matches!(self, ScanState::Idle | ScanState::Selected { .. })
    }
}

/// Configuration for the scanner.
#[derive(Debug, Clone)]
pub struct ScanConfig {
    /// Time between automatic scan advances.
    pub scan_interval: Duration,

    /// Extra delay on first item after wrap.
    pub first_item_delay: Duration,

    /// Whether scanning auto-advances or requires switch press.
    pub auto_scan: bool,

    /// Number of complete scan cycles before stopping.
    pub max_cycles: u8,

    /// Whether to include empty cells in linear scan.
    pub skip_empty: bool,
}

impl Default for ScanConfig {
    fn default() -> Self {
        Self {
            scan_interval: Duration::from_millis(1000),
            first_item_delay: Duration::from_millis(500),
            auto_scan: true,
            max_cycles: 3,
            skip_empty: true,
        }
    }
}

/// Switch scanner for accessibility input.
#[derive(Debug, Clone)]
pub struct Scanner {
    /// Scanning mode.
    mode: ScanMode,

    /// Current state.
    state: ScanState,

    /// Grid dimensions.
    rows: usize,
    cols: usize,

    /// Configuration.
    config: ScanConfig,

    /// Current cycle count.
    cycle_count: u8,
}

impl Scanner {
    /// Create a new scanner for a grid with the given dimensions.
    pub fn new(rows: usize, cols: usize) -> Self {
        Self {
            mode: ScanMode::default(),
            state: ScanState::Idle,
            rows,
            cols,
            config: ScanConfig::default(),
            cycle_count: 0,
        }
    }

    /// Set the scanning mode.
    pub fn with_mode(mut self, mode: ScanMode) -> Self {
        self.mode = mode;
        self
    }

    /// Set the scan configuration.
    pub fn with_config(mut self, config: ScanConfig) -> Self {
        self.config = config;
        self
    }

    /// Get the current state.
    pub fn state(&self) -> ScanState {
        self.state
    }

    /// Get the scanning mode.
    pub fn mode(&self) -> ScanMode {
        self.mode
    }

    /// Get the scan configuration.
    pub fn config(&self) -> &ScanConfig {
        &self.config
    }

    /// Update grid dimensions (e.g., when changing boards).
    pub fn set_grid_size(&mut self, rows: usize, cols: usize) {
        self.rows = rows;
        self.cols = cols;
        self.reset();
    }

    /// Start scanning.
    pub fn start(&mut self) {
        self.cycle_count = 0;
        self.state = match self.mode {
            ScanMode::RowColumn => ScanState::ScanningRows { current_row: 0 },
            ScanMode::Linear => ScanState::ScanningLinear { row: 0, col: 0 },
            ScanMode::ColumnRow => ScanState::ScanningCols { current_col: 0 },
            ScanMode::Block => ScanState::ScanningRows { current_row: 0 }, // Fallback
        };
    }

    /// Stop scanning and return to idle.
    pub fn stop(&mut self) {
        self.state = ScanState::Idle;
        self.cycle_count = 0;
    }

    /// Reset to initial state.
    pub fn reset(&mut self) {
        self.stop();
    }

    /// Check if scanning is active.
    pub fn is_scanning(&self) -> bool {
        self.state.is_scanning()
    }

    /// Handle a switch press.
    ///
    /// Returns the selected position if a cell was selected.
    pub fn on_switch_press(&mut self) -> Option<(usize, usize)> {
        match self.state {
            ScanState::Idle => {
                self.start();
                None
            }

            ScanState::ScanningRows { current_row } => {
                // Select this row, start scanning columns
                self.state = ScanState::ScanningColumns {
                    row: current_row,
                    current_col: 0,
                };
                None
            }

            ScanState::ScanningColumns { row, current_col } => {
                // Select this cell
                let pos = (row, current_col);
                self.state = ScanState::Selected {
                    row,
                    col: current_col,
                };
                Some(pos)
            }

            ScanState::ScanningLinear { row, col } => {
                // Select this cell
                let pos = (row, col);
                self.state = ScanState::Selected { row, col };
                Some(pos)
            }

            ScanState::ScanningCols { current_col } => {
                // Select this column, start scanning rows
                self.state = ScanState::ScanningRowsInCol {
                    col: current_col,
                    current_row: 0,
                };
                None
            }

            ScanState::ScanningRowsInCol { col, current_row } => {
                // Select this cell
                let pos = (current_row, col);
                self.state = ScanState::Selected {
                    row: current_row,
                    col,
                };
                Some(pos)
            }

            ScanState::Selected { .. } => {
                // Already selected, restart scanning
                self.start();
                None
            }
        }
    }

    /// Handle a secondary switch press (usually to go back/cancel).
    pub fn on_secondary_switch(&mut self) {
        match self.state {
            ScanState::ScanningColumns { .. } | ScanState::ScanningRowsInCol { .. } => {
                // Go back to row/column scanning
                self.start();
            }
            ScanState::Selected { .. } => {
                // Cancel selection, restart
                self.start();
            }
            _ => {
                // Stop scanning
                self.stop();
            }
        }
    }

    /// Advance to the next position (for auto-scan or manual advance).
    ///
    /// Returns `false` if max cycles reached and scanning should stop.
    pub fn advance(&mut self) -> bool {
        match self.state {
            ScanState::ScanningRows { current_row } => {
                let next_row = current_row + 1;
                if next_row >= self.rows {
                    self.cycle_count += 1;
                    if self.cycle_count >= self.config.max_cycles {
                        self.stop();
                        return false;
                    }
                    self.state = ScanState::ScanningRows { current_row: 0 };
                } else {
                    self.state = ScanState::ScanningRows {
                        current_row: next_row,
                    };
                }
            }

            ScanState::ScanningColumns { row, current_col } => {
                let next_col = current_col + 1;
                if next_col >= self.cols {
                    self.cycle_count += 1;
                    if self.cycle_count >= self.config.max_cycles {
                        // Go back to row scanning
                        self.cycle_count = 0;
                        self.state = ScanState::ScanningRows { current_row: 0 };
                        return true;
                    }
                    self.state = ScanState::ScanningColumns {
                        row,
                        current_col: 0,
                    };
                } else {
                    self.state = ScanState::ScanningColumns {
                        row,
                        current_col: next_col,
                    };
                }
            }

            ScanState::ScanningLinear { row, col } => {
                let (next_row, next_col) = if col + 1 < self.cols {
                    (row, col + 1)
                } else if row + 1 < self.rows {
                    (row + 1, 0)
                } else {
                    self.cycle_count += 1;
                    if self.cycle_count >= self.config.max_cycles {
                        self.stop();
                        return false;
                    }
                    (0, 0)
                };
                self.state = ScanState::ScanningLinear {
                    row: next_row,
                    col: next_col,
                };
            }

            ScanState::ScanningCols { current_col } => {
                let next_col = current_col + 1;
                if next_col >= self.cols {
                    self.cycle_count += 1;
                    if self.cycle_count >= self.config.max_cycles {
                        self.stop();
                        return false;
                    }
                    self.state = ScanState::ScanningCols { current_col: 0 };
                } else {
                    self.state = ScanState::ScanningCols {
                        current_col: next_col,
                    };
                }
            }

            ScanState::ScanningRowsInCol { col, current_row } => {
                let next_row = current_row + 1;
                if next_row >= self.rows {
                    self.cycle_count += 1;
                    if self.cycle_count >= self.config.max_cycles {
                        self.cycle_count = 0;
                        self.state = ScanState::ScanningCols { current_col: 0 };
                        return true;
                    }
                    self.state = ScanState::ScanningRowsInCol {
                        col,
                        current_row: 0,
                    };
                } else {
                    self.state = ScanState::ScanningRowsInCol {
                        col,
                        current_row: next_row,
                    };
                }
            }

            ScanState::Idle | ScanState::Selected { .. } => {
                // No-op
            }
        }

        true
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_row_column_scanning() {
        let mut scanner = Scanner::new(3, 4);
        scanner.start();

        assert!(matches!(
            scanner.state(),
            ScanState::ScanningRows { current_row: 0 }
        ));

        // Advance through rows
        scanner.advance();
        assert!(matches!(
            scanner.state(),
            ScanState::ScanningRows { current_row: 1 }
        ));

        // Select row 1
        let result = scanner.on_switch_press();
        assert!(result.is_none());
        assert!(matches!(
            scanner.state(),
            ScanState::ScanningColumns {
                row: 1,
                current_col: 0
            }
        ));

        // Advance through columns
        scanner.advance();
        assert!(matches!(
            scanner.state(),
            ScanState::ScanningColumns {
                row: 1,
                current_col: 1
            }
        ));

        // Select cell (1, 1)
        let result = scanner.on_switch_press();
        assert_eq!(result, Some((1, 1)));
    }

    #[test]
    fn test_linear_scanning() {
        let mut scanner = Scanner::new(2, 2).with_mode(ScanMode::Linear);
        scanner.start();

        assert!(matches!(
            scanner.state(),
            ScanState::ScanningLinear { row: 0, col: 0 }
        ));

        // Advance through cells
        scanner.advance(); // (0, 1)
        scanner.advance(); // (1, 0)
        scanner.advance(); // (1, 1)

        assert!(matches!(
            scanner.state(),
            ScanState::ScanningLinear { row: 1, col: 1 }
        ));

        // Select
        let result = scanner.on_switch_press();
        assert_eq!(result, Some((1, 1)));
    }

    #[test]
    fn test_max_cycles() {
        let mut scanner = Scanner::new(2, 2);
        scanner.config.max_cycles = 2;
        scanner.start();

        // Complete 2 cycles through 2 rows
        for _ in 0..4 {
            scanner.advance();
        }

        assert!(matches!(scanner.state(), ScanState::Idle));
    }

    #[test]
    fn test_secondary_switch_cancels() {
        let mut scanner = Scanner::new(3, 3);
        scanner.start();

        // Select a row
        scanner.on_switch_press();
        assert!(matches!(scanner.state(), ScanState::ScanningColumns { .. }));

        // Secondary switch goes back
        scanner.on_secondary_switch();
        assert!(matches!(scanner.state(), ScanState::ScanningRows { .. }));
    }

    #[test]
    fn test_highlighted_position() {
        let mut scanner = Scanner::new(2, 3);
        scanner.start();

        // Row scanning doesn't highlight a specific cell
        assert!(scanner.state().highlighted_position().is_none());
        assert_eq!(scanner.state().highlighted_row(), Some(0));

        // After selecting a row
        scanner.on_switch_press();
        assert_eq!(scanner.state().highlighted_position(), Some((0, 0)));
    }
}
