//! # LoveWords Core
//!
//! Core library for the LoveWords AAC (Augmentative and Alternative Communication) application.
//!
//! This crate provides:
//! - **OBF Support**: Full compatibility with the Open Board Format standard
//! - **Board Model**: Navigation and interaction with communication boards
//! - **Speech Abstraction**: Platform-agnostic TTS trait
//! - **Storage Abstraction**: Flexible persistence backends
//! - **Input Handling**: Support for touch, switch scanning, and dwell selection
//!
//! ## Quick Start
//!
//! ```rust,no_run
//! use lovewords_core::{Board, ObfBoard, MemoryStorage, StorageBackend};
//!
//! // Load a board from OBF JSON
//! let json = include_str!("../boards/love-and-affection.json");
//! let obf: ObfBoard = serde_json::from_str(json).unwrap();
//! let board = Board::from_obf(obf);
//!
//! // Get a cell and its action
//! if let Some(cell) = board.cell_at(0, 0) {
//!     println!("Cell label: {:?}", cell.label());
//! }
//! ```

pub mod accessibility;
pub mod board;
pub mod error;
pub mod input;
pub mod obf;
pub mod speech;
pub mod storage;

// Re-export main types for convenience
pub use board::{Board, BoardNavigator, Cell, CellAction};
pub use error::{LoveWordsError, Result};
pub use input::{InputEvent, ScanMode, Scanner};
pub use obf::{ObfBoard, ObfButton, ObfExtensions, ObfGrid, ObfImage, ObfLoadBoard};
pub use speech::{SpeechEngine, Voice, VoiceConfig};
pub use storage::{MemoryStorage, Profile, ProfileSettings, StorageBackend};
