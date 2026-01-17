//! Error types for LoveWords core library.
//!
//! This module provides a unified error type [`LoveWordsError`] that encompasses
//! all possible error conditions in the library.

use thiserror::Error;

/// A specialized Result type for LoveWords operations.
pub type Result<T> = std::result::Result<T, LoveWordsError>;

/// The main error type for all LoveWords operations.
#[derive(Error, Debug)]
pub enum LoveWordsError {
    /// Error occurred while working with a board.
    #[error("Board error: {0}")]
    Board(#[from] BoardError),

    /// Error occurred during storage operations.
    #[error("Storage error: {0}")]
    Storage(#[from] StorageError),

    /// Error occurred during speech synthesis.
    #[error("Speech error: {0}")]
    Speech(#[from] SpeechError),

    /// Error occurred during OBF parsing or serialization.
    #[error("OBF format error: {0}")]
    Obf(#[from] ObfError),

    /// Error occurred during input processing.
    #[error("Input error: {0}")]
    Input(#[from] InputError),
}

/// Errors related to board operations.
#[derive(Error, Debug)]
pub enum BoardError {
    /// The requested cell position is out of bounds.
    #[error("Cell position ({row}, {col}) is out of bounds for grid size ({rows}x{cols})")]
    CellOutOfBounds {
        row: usize,
        col: usize,
        rows: usize,
        cols: usize,
    },

    /// The requested button ID was not found.
    #[error("Button with ID '{0}' not found")]
    ButtonNotFound(String),

    /// The board has an invalid grid configuration.
    #[error("Invalid grid: {0}")]
    InvalidGrid(String),

    /// Navigation stack is empty when trying to go back.
    #[error("Cannot navigate back: already at root board")]
    NavigationStackEmpty,
}

/// Errors related to storage operations.
#[derive(Error, Debug)]
pub enum StorageError {
    /// The requested board was not found.
    #[error("Board '{0}' not found")]
    BoardNotFound(String),

    /// The requested profile was not found.
    #[error("Profile '{0}' not found")]
    ProfileNotFound(String),

    /// An I/O error occurred.
    #[error("I/O error: {0}")]
    Io(#[from] std::io::Error),

    /// JSON serialization/deserialization error.
    #[error("JSON error: {0}")]
    Json(#[from] serde_json::Error),

    /// The storage backend is not available.
    #[error("Storage backend unavailable: {0}")]
    Unavailable(String),
}

/// Errors related to speech synthesis.
#[derive(Error, Debug)]
pub enum SpeechError {
    /// The requested voice was not found.
    #[error("Voice '{0}' not found")]
    VoiceNotFound(String),

    /// Speech synthesis failed.
    #[error("Synthesis failed: {0}")]
    SynthesisFailed(String),

    /// The speech engine is not available.
    #[error("Speech engine unavailable: {0}")]
    EngineUnavailable(String),

    /// Speech was interrupted.
    #[error("Speech interrupted")]
    Interrupted,
}

/// Errors related to OBF format parsing and validation.
#[derive(Error, Debug)]
pub enum ObfError {
    /// The OBF format version is not supported.
    #[error("Unsupported OBF format: {0}")]
    UnsupportedFormat(String),

    /// The OBF file is missing required fields.
    #[error("Missing required field: {0}")]
    MissingField(String),

    /// The OBF file contains invalid data.
    #[error("Invalid OBF data: {0}")]
    InvalidData(String),

    /// JSON parsing error.
    #[error("JSON parse error: {0}")]
    JsonParse(#[from] serde_json::Error),
}

/// Errors related to input handling.
#[derive(Error, Debug)]
pub enum InputError {
    /// The scanning mode is not supported.
    #[error("Unsupported scan mode: {0}")]
    UnsupportedScanMode(String),

    /// Invalid timing configuration.
    #[error("Invalid timing: {0}")]
    InvalidTiming(String),

    /// Input device not available.
    #[error("Input device unavailable: {0}")]
    DeviceUnavailable(String),
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_error_display() {
        let err = BoardError::CellOutOfBounds {
            row: 5,
            col: 3,
            rows: 4,
            cols: 4,
        };
        assert_eq!(
            err.to_string(),
            "Cell position (5, 3) is out of bounds for grid size (4x4)"
        );
    }

    #[test]
    fn test_error_conversion() {
        let board_err = BoardError::ButtonNotFound("btn_1".to_string());
        let lw_err: LoveWordsError = board_err.into();
        assert!(matches!(lw_err, LoveWordsError::Board(_)));
    }
}
