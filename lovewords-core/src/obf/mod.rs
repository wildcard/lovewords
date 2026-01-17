//! Open Board Format (OBF) types.
//!
//! This module provides types that conform to the OBF v1.0 specification,
//! enabling interoperability with other AAC applications.
//!
//! See: <https://www.openboardformat.org/>

mod board;
mod extensions;

pub use board::{ObfBoard, ObfButton, ObfGrid, ObfImage, ObfLoadBoard, ObfSound};
pub use extensions::ObfExtensions;
