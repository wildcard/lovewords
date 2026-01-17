//! Input handling for various interaction methods.
//!
//! This module provides abstractions for different input methods:
//! - Direct touch/click
//! - Switch scanning (row/column, linear)
//! - Dwell selection (hover to select)

mod event;
mod scanning;

pub use event::InputEvent;
pub use scanning::{ScanMode, ScanState, Scanner};
