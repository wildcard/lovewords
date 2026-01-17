//! Storage abstraction for boards and profiles.
//!
//! This module provides platform-agnostic storage traits and an in-memory
//! implementation for testing.

mod memory;
mod profile;

use crate::error::StorageError;
use crate::obf::ObfBoard;

pub use memory::MemoryStorage;
pub use profile::{Profile, ProfileId, ProfileSettings};

/// Unique identifier for a board.
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct BoardId(pub String);

impl BoardId {
    /// Create a new board ID.
    pub fn new(id: impl Into<String>) -> Self {
        Self(id.into())
    }
}

impl From<String> for BoardId {
    fn from(s: String) -> Self {
        Self(s)
    }
}

impl From<&str> for BoardId {
    fn from(s: &str) -> Self {
        Self(s.to_string())
    }
}

impl AsRef<str> for BoardId {
    fn as_ref(&self) -> &str {
        &self.0
    }
}

impl std::fmt::Display for BoardId {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.0)
    }
}

/// Backend for persistent storage of boards and profiles.
///
/// Implementations should be thread-safe (`Send + Sync`) for concurrent access.
///
/// # Platform Implementations
///
/// - **iOS/macOS**: Core Data or file-based
/// - **Android**: Room database or file-based
/// - **Web**: IndexedDB or localStorage
/// - **Desktop**: SQLite or file-based
pub trait StorageBackend: Send + Sync {
    /// Load a board by ID.
    fn load_board(&self, id: &BoardId) -> Result<ObfBoard, StorageError>;

    /// Save a board.
    fn save_board(&self, board: &ObfBoard) -> Result<(), StorageError>;

    /// Delete a board.
    fn delete_board(&self, id: &BoardId) -> Result<(), StorageError>;

    /// List all board IDs.
    fn list_boards(&self) -> Result<Vec<BoardId>, StorageError>;

    /// Check if a board exists.
    fn board_exists(&self, id: &BoardId) -> Result<bool, StorageError> {
        Ok(self.list_boards()?.contains(id))
    }

    /// Load a profile by ID.
    fn load_profile(&self, id: &ProfileId) -> Result<Profile, StorageError>;

    /// Save a profile.
    fn save_profile(&self, profile: &Profile) -> Result<(), StorageError>;

    /// Delete a profile.
    fn delete_profile(&self, id: &ProfileId) -> Result<(), StorageError>;

    /// List all profile IDs.
    fn list_profiles(&self) -> Result<Vec<ProfileId>, StorageError>;

    /// Get the default profile ID, if set.
    fn default_profile_id(&self) -> Result<Option<ProfileId>, StorageError>;

    /// Set the default profile ID.
    fn set_default_profile(&self, id: &ProfileId) -> Result<(), StorageError>;
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_board_id() {
        let id = BoardId::new("test-board");
        assert_eq!(id.as_ref(), "test-board");
        assert_eq!(id.to_string(), "test-board");
    }

    #[test]
    fn test_board_id_from() {
        let id: BoardId = "my-board".into();
        assert_eq!(id.0, "my-board");

        let id: BoardId = String::from("another-board").into();
        assert_eq!(id.0, "another-board");
    }
}
