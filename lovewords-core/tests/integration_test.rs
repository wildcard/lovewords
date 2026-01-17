//! Integration tests for lovewords-core.
//!
//! These tests verify the complete workflow of loading boards,
//! navigating, and interacting with cells.

use lovewords_core::storage::BoardId;
use lovewords_core::{
    Board, BoardNavigator, CellAction, InputEvent, MemoryStorage, ObfBoard, ObfButton, Scanner,
    StorageBackend,
};

/// Test loading the bundled starter board.
#[test]
fn test_load_starter_board() {
    let json = include_str!("../boards/love-and-affection.json");
    let obf: ObfBoard = serde_json::from_str(json).expect("Failed to parse starter board");

    assert_eq!(obf.id, "love-and-affection");
    assert_eq!(obf.name, "Love & Affection");
    assert_eq!(obf.grid.rows, 3);
    assert_eq!(obf.grid.columns, 4);

    // Check we have all 12 buttons
    assert_eq!(obf.buttons.len(), 12);

    // Check extensions were parsed
    assert_eq!(obf.extensions.moment, Some("daily".to_string()));
}

/// Test creating a board, navigating, and selecting cells.
#[test]
fn test_board_navigation_flow() {
    // Create a home board
    let mut home = ObfBoard::new("home", 2, 2);
    home.name = "Home".to_string();
    home.add_button(ObfButton::speak("hello", "Hello"));
    home.add_button(ObfButton::navigate("more", "More", "sub-board"));
    home.place_button_at("hello", 0, 0);
    home.place_button_at("more", 0, 1);

    // Create a sub-board
    let mut sub = ObfBoard::new("sub-board", 2, 2);
    sub.name = "Sub Board".to_string();
    sub.add_button(ObfButton::speak("goodbye", "Goodbye"));
    sub.add_button(ObfButton::back("back"));
    sub.place_button_at("goodbye", 0, 0);
    sub.place_button_at("back", 0, 1);

    // Start navigation
    let mut nav = BoardNavigator::new(home);
    assert!(nav.is_at_home());
    assert_eq!(nav.breadcrumbs(), vec!["Home"]);

    // Navigate to sub-board
    nav.push(sub);
    assert!(!nav.is_at_home());
    assert_eq!(nav.depth(), 1);
    assert_eq!(nav.breadcrumbs(), vec!["Home", "Sub Board"]);

    // Go back
    let left = nav.pop().unwrap();
    assert_eq!(left.id, "sub-board");
    assert!(nav.is_at_home());
}

/// Test cell actions from the starter board.
#[test]
fn test_cell_actions() {
    let json = include_str!("../boards/love-and-affection.json");
    let obf: ObfBoard = serde_json::from_str(json).unwrap();
    let board = Board::from_obf(obf);

    // First cell should speak "I love you"
    let cell = board.cell_at(0, 0).expect("Cell at 0,0 should exist");
    assert_eq!(cell.label(), "I love you");
    match cell.action() {
        CellAction::Speak(text) => assert_eq!(text, "I love you"),
        other => panic!("Expected Speak action, got {:?}", other),
    }

    // Last cell should be back
    let back = board.cell_at(2, 3).expect("Cell at 2,3 should exist");
    assert_eq!(back.label(), "Back");
    assert_eq!(back.action(), CellAction::Back);
}

/// Test storage round-trip.
#[test]
fn test_storage_roundtrip() {
    let storage = MemoryStorage::new();

    // Load starter board and save to storage
    let json = include_str!("../boards/love-and-affection.json");
    let original: ObfBoard = serde_json::from_str(json).unwrap();
    storage.save_board(&original).unwrap();

    // Load it back
    let loaded = storage
        .load_board(&BoardId::new("love-and-affection"))
        .unwrap();

    // Verify it's the same
    assert_eq!(original.id, loaded.id);
    assert_eq!(original.buttons.len(), loaded.buttons.len());
    assert_eq!(original.grid.rows, loaded.grid.rows);
    assert_eq!(original.grid.columns, loaded.grid.columns);
}

/// Test OBF serialization round-trip.
#[test]
fn test_obf_roundtrip() {
    let json = include_str!("../boards/love-and-affection.json");
    let original: ObfBoard = serde_json::from_str(json).unwrap();

    // Serialize and deserialize
    let serialized = serde_json::to_string_pretty(&original).unwrap();
    let roundtrip: ObfBoard = serde_json::from_str(&serialized).unwrap();

    assert_eq!(original.id, roundtrip.id);
    assert_eq!(original.buttons.len(), roundtrip.buttons.len());

    // Verify extensions survived
    assert_eq!(original.extensions.moment, roundtrip.extensions.moment);
}

/// Test input event handling.
#[test]
fn test_input_events() {
    let tap = InputEvent::tap(1, 2);
    assert_eq!(tap.cell_position(), Some((1, 2)));
    assert!(tap.is_selection());

    let switch = InputEvent::switch_press();
    assert!(switch.is_selection());
    assert!(switch.cell_position().is_none());
}

/// Test switch scanning flow.
#[test]
fn test_scanning_flow() {
    let json = include_str!("../boards/love-and-affection.json");
    let obf: ObfBoard = serde_json::from_str(json).unwrap();

    let mut scanner = Scanner::new(obf.grid.rows, obf.grid.columns);
    scanner.start();

    // Should be scanning rows
    assert!(scanner.is_scanning());

    // Press to select row 0
    let result = scanner.on_switch_press();
    assert!(result.is_none()); // Now scanning columns

    // Press to select column 0
    let result = scanner.on_switch_press();
    assert_eq!(result, Some((0, 0))); // Selected cell (0, 0)
}

/// Test finding cells by extensions.
#[test]
fn test_find_cells_by_warmth() {
    let json = include_str!("../boards/love-and-affection.json");
    let obf: ObfBoard = serde_json::from_str(json).unwrap();
    let board = Board::from_obf(obf);

    // Find romantic cells
    let romantic = board.cells_with_warmth("romantic");
    assert!(!romantic.is_empty());

    // All romantic cells should have intimacy level
    for cell in &romantic {
        assert!(cell.extensions().intimacy_level.is_some());
    }
}
