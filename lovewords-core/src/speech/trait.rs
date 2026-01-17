//! Speech engine trait and related types.
//!
//! Platform-specific implementations will provide concrete types
//! that implement [`SpeechEngine`].

use crate::error::SpeechError;

/// A text-to-speech engine.
///
/// Implementations should be thread-safe (`Send + Sync`) to allow
/// speech to be triggered from any thread.
///
/// # Platform Implementations
///
/// - **iOS**: AVSpeechSynthesizer
/// - **Android**: TextToSpeech
/// - **macOS**: NSSpeechSynthesizer
/// - **Web**: SpeechSynthesis API
/// - **Windows**: SAPI or OneCore voices
///
/// # Example
///
/// ```rust,ignore
/// use lovewords_core::{SpeechEngine, VoiceConfig};
///
/// fn speak_greeting(engine: &dyn SpeechEngine) {
///     let config = VoiceConfig::default();
///     engine.speak("Hello!", &config).unwrap();
/// }
/// ```
pub trait SpeechEngine: Send + Sync {
    /// Speak the given text with the specified configuration.
    ///
    /// This should queue the utterance if speech is already in progress.
    fn speak(&self, text: &str, config: &VoiceConfig) -> Result<(), SpeechError>;

    /// Speak the given text immediately, interrupting any current speech.
    fn speak_immediate(&self, text: &str, config: &VoiceConfig) -> Result<(), SpeechError> {
        self.stop();
        self.speak(text, config)
    }

    /// Stop any current speech.
    fn stop(&self);

    /// Pause current speech (if supported).
    fn pause(&self) {
        // Default: no-op, not all platforms support pause
    }

    /// Resume paused speech (if supported).
    fn resume(&self) {
        // Default: no-op
    }

    /// Check if speech is currently in progress.
    fn is_speaking(&self) -> bool;

    /// Check if speech is paused.
    fn is_paused(&self) -> bool {
        false
    }

    /// List available voices.
    fn list_voices(&self) -> Vec<Voice>;

    /// Get the default voice for a locale.
    fn default_voice(&self, locale: &str) -> Option<Voice> {
        self.list_voices()
            .into_iter()
            .find(|v| v.locale.starts_with(locale))
    }

    /// Set the callback for speech events (optional).
    fn set_callback(&self, _callback: Box<dyn SpeechCallback>) {
        // Default: no-op, not all implementations support callbacks
    }
}

/// Callback for speech events.
pub trait SpeechCallback: Send + Sync {
    /// Called when speech starts.
    fn on_start(&self, text: &str);

    /// Called when speech finishes.
    fn on_finish(&self, text: &str);

    /// Called when speech is interrupted.
    fn on_cancel(&self, text: &str);

    /// Called when a word boundary is reached (if supported).
    fn on_word(&self, _text: &str, _word_start: usize, _word_length: usize) {
        // Default: no-op
    }

    /// Called on speech error.
    fn on_error(&self, error: SpeechError);
}

/// Configuration for speech output.
#[derive(Debug, Clone)]
pub struct VoiceConfig {
    /// Voice identifier (platform-specific).
    pub voice_id: Option<String>,

    /// Speaking rate multiplier (0.5 = half speed, 2.0 = double speed).
    /// Default: 1.0
    pub rate: f32,

    /// Pitch multiplier (0.5 = lower, 2.0 = higher).
    /// Default: 1.0
    pub pitch: f32,

    /// Volume (0.0 to 1.0).
    /// Default: 1.0
    pub volume: f32,

    /// Locale for voice selection (e.g., "en-US").
    pub locale: Option<String>,

    /// Preferred voice gender.
    pub gender: Option<VoiceGender>,

    /// Preferred voice quality.
    pub quality: VoiceQuality,
}

impl Default for VoiceConfig {
    fn default() -> Self {
        Self {
            voice_id: None,
            rate: 1.0,
            pitch: 1.0,
            volume: 1.0,
            locale: None,
            gender: None,
            quality: VoiceQuality::Default,
        }
    }
}

impl VoiceConfig {
    /// Create a config with a specific voice ID.
    pub fn with_voice(voice_id: impl Into<String>) -> Self {
        Self {
            voice_id: Some(voice_id.into()),
            ..Default::default()
        }
    }

    /// Create a config with a specific locale.
    pub fn with_locale(locale: impl Into<String>) -> Self {
        Self {
            locale: Some(locale.into()),
            ..Default::default()
        }
    }

    /// Set the speaking rate.
    pub fn rate(mut self, rate: f32) -> Self {
        self.rate = rate.clamp(0.1, 4.0);
        self
    }

    /// Set the pitch.
    pub fn pitch(mut self, pitch: f32) -> Self {
        self.pitch = pitch.clamp(0.5, 2.0);
        self
    }

    /// Set the volume.
    pub fn volume(mut self, volume: f32) -> Self {
        self.volume = volume.clamp(0.0, 1.0);
        self
    }

    /// Set the preferred gender.
    pub fn gender(mut self, gender: VoiceGender) -> Self {
        self.gender = Some(gender);
        self
    }

    /// Set the voice quality preference.
    pub fn quality(mut self, quality: VoiceQuality) -> Self {
        self.quality = quality;
        self
    }
}

/// Voice gender preference.
#[derive(Debug, Clone, Copy, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub enum VoiceGender {
    Male,
    Female,
    Neutral,
}

/// Voice quality preference.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default, serde::Serialize, serde::Deserialize)]
pub enum VoiceQuality {
    /// Use whatever is available.
    #[default]
    Default,
    /// Prefer compact/fast voices.
    Compact,
    /// Prefer high-quality voices.
    Enhanced,
    /// Prefer premium/neural voices.
    Premium,
}

/// Information about an available voice.
#[derive(Debug, Clone)]
pub struct Voice {
    /// Platform-specific voice identifier.
    pub id: String,

    /// Human-readable voice name.
    pub name: String,

    /// Locale code (e.g., "en-US").
    pub locale: String,

    /// Voice gender, if known.
    pub gender: Option<VoiceGender>,

    /// Voice quality level.
    pub quality: VoiceQuality,

    /// Whether this is a network/cloud voice.
    pub is_network: bool,
}

impl Voice {
    /// Create a new voice descriptor.
    pub fn new(id: impl Into<String>, name: impl Into<String>, locale: impl Into<String>) -> Self {
        Self {
            id: id.into(),
            name: name.into(),
            locale: locale.into(),
            gender: None,
            quality: VoiceQuality::Default,
            is_network: false,
        }
    }

    /// Set the gender.
    pub fn with_gender(mut self, gender: VoiceGender) -> Self {
        self.gender = Some(gender);
        self
    }

    /// Set the quality.
    pub fn with_quality(mut self, quality: VoiceQuality) -> Self {
        self.quality = quality;
        self
    }

    /// Mark as a network voice.
    pub fn network(mut self) -> Self {
        self.is_network = true;
        self
    }

    /// Check if this voice matches a locale prefix.
    pub fn matches_locale(&self, prefix: &str) -> bool {
        self.locale.starts_with(prefix)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_voice_config_defaults() {
        let config = VoiceConfig::default();
        assert_eq!(config.rate, 1.0);
        assert_eq!(config.pitch, 1.0);
        assert_eq!(config.volume, 1.0);
    }

    #[test]
    fn test_voice_config_clamping() {
        let config = VoiceConfig::default().rate(10.0).pitch(0.1).volume(5.0);
        assert_eq!(config.rate, 4.0); // Clamped
        assert_eq!(config.pitch, 0.5); // Clamped
        assert_eq!(config.volume, 1.0); // Clamped
    }

    #[test]
    fn test_voice_creation() {
        let voice = Voice::new("com.apple.voice.samantha", "Samantha", "en-US")
            .with_gender(VoiceGender::Female)
            .with_quality(VoiceQuality::Enhanced);

        assert_eq!(voice.name, "Samantha");
        assert!(voice.matches_locale("en"));
        assert!(!voice.matches_locale("fr"));
    }
}
