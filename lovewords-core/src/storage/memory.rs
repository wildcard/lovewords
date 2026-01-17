//! In-memory storage backend for testing.
//!
//! This implementation stores boards and profiles in memory,
//! making it ideal for unit tests and development.

use std::collections::HashMap;
use std::sync::RwLock;

use crate::error::StorageError;
use crate::obf::ObfBoard;

use super::{BoardId, Profile, ProfileId, StorageBackend};

/// In-memory storage backend.
///
/// Thread-safe via `RwLock`. Data is lost when the instance is dropped.
///
/// # Example
///
/// ```rust
/// use lovewords_core::{MemoryStorage, StorageBackend, ObfBoard};
/// use lovewords_core::storage::BoardId;
///
/// let storage = MemoryStorage::new();
/// let board = ObfBoard::new("test-board", 2, 3);
///
/// storage.save_board(&board).unwrap();
///
/// let loaded = storage.load_board(&BoardId::new("test-board")).unwrap();
/// assert_eq!(loaded.id, "test-board");
/// ```
#[derive(Debug, Default)]
pub struct MemoryStorage {
    boards: RwLock<HashMap<String, ObfBoard>>,
    profiles: RwLock<HashMap<String, Profile>>,
    default_profile: RwLock<Option<String>>,
}

impl MemoryStorage {
    /// Create a new empty in-memory storage.
    pub fn new() -> Self {
        Self::default()
    }

    /// Create a storage pre-populated with boards.
    pub fn with_boards(boards: Vec<ObfBoard>) -> Self {
        let storage = Self::new();
        for board in boards {
            storage.save_board(&board).unwrap();
        }
        storage
    }

    /// Create a storage pre-populated with profiles.
    pub fn with_profiles(profiles: Vec<Profile>) -> Self {
        let storage = Self::new();
        for profile in profiles {
            storage.save_profile(&profile).unwrap();
        }
        storage
    }

    /// Get the number of stored boards.
    pub fn board_count(&self) -> usize {
        self.boards.read().unwrap().len()
    }

    /// Get the number of stored profiles.
    pub fn profile_count(&self) -> usize {
        self.profiles.read().unwrap().len()
    }

    /// Clear all stored data.
    pub fn clear(&self) {
        self.boards.write().unwrap().clear();
        self.profiles.write().unwrap().clear();
        *self.default_profile.write().unwrap() = None;
    }
}

impl StorageBackend for MemoryStorage {
    fn load_board(&self, id: &BoardId) -> Result<ObfBoard, StorageError> {
        self.boards
            .read()
            .unwrap()
            .get(&id.0)
            .cloned()
            .ok_or_else(|| StorageError::BoardNotFound(id.0.clone()))
    }

    fn save_board(&self, board: &ObfBoard) -> Result<(), StorageError> {
        self.boards
            .write()
            .unwrap()
            .insert(board.id.clone(), board.clone());
        Ok(())
    }

    fn delete_board(&self, id: &BoardId) -> Result<(), StorageError> {
        self.boards.write().unwrap().remove(&id.0);
        Ok(())
    }

    fn list_boards(&self) -> Result<Vec<BoardId>, StorageError> {
        Ok(self
            .boards
            .read()
            .unwrap()
            .keys()
            .map(|k| BoardId::new(k.clone()))
            .collect())
    }

    fn board_exists(&self, id: &BoardId) -> Result<bool, StorageError> {
        Ok(self.boards.read().unwrap().contains_key(&id.0))
    }

    fn load_profile(&self, id: &ProfileId) -> Result<Profile, StorageError> {
        self.profiles
            .read()
            .unwrap()
            .get(&id.0)
            .cloned()
            .ok_or_else(|| StorageError::ProfileNotFound(id.0.clone()))
    }

    fn save_profile(&self, profile: &Profile) -> Result<(), StorageError> {
        self.profiles
            .write()
            .unwrap()
            .insert(profile.id.0.clone(), profile.clone());
        Ok(())
    }

    fn delete_profile(&self, id: &ProfileId) -> Result<(), StorageError> {
        self.profiles.write().unwrap().remove(&id.0);
        Ok(())
    }

    fn list_profiles(&self) -> Result<Vec<ProfileId>, StorageError> {
        Ok(self
            .profiles
            .read()
            .unwrap()
            .keys()
            .map(|k| ProfileId::new(k.clone()))
            .collect())
    }

    fn default_profile_id(&self) -> Result<Option<ProfileId>, StorageError> {
        Ok(self
            .default_profile
            .read()
            .unwrap()
            .as_ref()
            .map(|s| ProfileId::new(s.clone())))
    }

    fn set_default_profile(&self, id: &ProfileId) -> Result<(), StorageError> {
        *self.default_profile.write().unwrap() = Some(id.0.clone());
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_memory_storage_boards() {
        let storage = MemoryStorage::new();

        // Save a board
        let board = ObfBoard::new("test", 2, 3);
        storage.save_board(&board).unwrap();

        // Load it back
        let loaded = storage.load_board(&BoardId::new("test")).unwrap();
        assert_eq!(loaded.id, "test");

        // List boards
        let boards = storage.list_boards().unwrap();
        assert_eq!(boards.len(), 1);

        // Delete
        storage.delete_board(&BoardId::new("test")).unwrap();
        assert!(storage.load_board(&BoardId::new("test")).is_err());
    }

    #[test]
    fn test_memory_storage_not_found() {
        let storage = MemoryStorage::new();
        let result = storage.load_board(&BoardId::new("nonexistent"));
        assert!(matches!(result, Err(StorageError::BoardNotFound(_))));
    }

    #[test]
    fn test_memory_storage_thread_safety() {
        use std::sync::Arc;
        use std::thread;

        let storage = Arc::new(MemoryStorage::new());

        let handles: Vec<_> = (0..10)
            .map(|i| {
                let storage = Arc::clone(&storage);
                thread::spawn(move || {
                    let board = ObfBoard::new(format!("board-{}", i), 2, 2);
                    storage.save_board(&board).unwrap();
                })
            })
            .collect();

        for handle in handles {
            handle.join().unwrap();
        }

        assert_eq!(storage.board_count(), 10);
    }
}
