//! Speech synthesis abstraction.
//!
//! This module provides platform-agnostic traits for text-to-speech,
//! allowing different implementations for iOS, Android, desktop, and web.

mod r#trait;

pub use r#trait::{SpeechEngine, Voice, VoiceConfig, VoiceGender, VoiceQuality};
