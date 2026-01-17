//! User profile types.
//!
//! Profiles store user-specific settings like voice preferences,
//! scanning configuration, and accessibility options.

use serde::{Deserialize, Serialize};
use std::time::Duration;

use crate::input::ScanMode;
use crate::speech::{VoiceConfig, VoiceGender, VoiceQuality};

/// Unique identifier for a profile.
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct ProfileId(pub String);

impl ProfileId {
    /// Create a new profile ID.
    pub fn new(id: impl Into<String>) -> Self {
        Self(id.into())
    }

    /// Generate a new unique profile ID.
    pub fn generate() -> Self {
        Self(uuid::Uuid::new_v4().to_string())
    }
}

impl AsRef<str> for ProfileId {
    fn as_ref(&self) -> &str {
        &self.0
    }
}

impl std::fmt::Display for ProfileId {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.0)
    }
}

/// A user profile with personalized settings.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Profile {
    /// Unique identifier.
    pub id: ProfileId,

    /// Display name.
    pub name: String,

    /// ID of the home board for this profile.
    pub home_board_id: Option<String>,

    /// Personalized settings.
    pub settings: ProfileSettings,

    /// Profile creation timestamp.
    pub created_at: chrono::DateTime<chrono::Utc>,

    /// Last modified timestamp.
    pub updated_at: chrono::DateTime<chrono::Utc>,
}

impl Profile {
    /// Create a new profile with the given name.
    pub fn new(name: impl Into<String>) -> Self {
        let now = chrono::Utc::now();
        Self {
            id: ProfileId::generate(),
            name: name.into(),
            home_board_id: None,
            settings: ProfileSettings::default(),
            created_at: now,
            updated_at: now,
        }
    }

    /// Create a profile with a specific ID.
    pub fn with_id(id: ProfileId, name: impl Into<String>) -> Self {
        let now = chrono::Utc::now();
        Self {
            id,
            name: name.into(),
            home_board_id: None,
            settings: ProfileSettings::default(),
            created_at: now,
            updated_at: now,
        }
    }

    /// Set the home board.
    pub fn with_home_board(mut self, board_id: impl Into<String>) -> Self {
        self.home_board_id = Some(board_id.into());
        self
    }

    /// Update the modified timestamp.
    pub fn touch(&mut self) {
        self.updated_at = chrono::Utc::now();
    }
}

/// User-specific settings.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct ProfileSettings {
    /// Voice settings for speech synthesis.
    pub voice: VoiceSettings,

    /// Accessibility settings.
    pub accessibility: AccessibilitySettings,

    /// Display settings.
    pub display: DisplaySettings,

    /// Input settings.
    pub input: InputSettings,
}

/// Voice/speech settings.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VoiceSettings {
    /// Preferred voice ID (platform-specific).
    pub voice_id: Option<String>,

    /// Speaking rate multiplier.
    pub rate: f32,

    /// Pitch multiplier.
    pub pitch: f32,

    /// Volume level (0.0 to 1.0).
    pub volume: f32,

    /// Preferred locale (e.g., "en-US").
    pub locale: Option<String>,

    /// Preferred gender.
    pub gender: Option<VoiceGender>,

    /// Preferred quality.
    pub quality: VoiceQuality,
}

impl Default for VoiceSettings {
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

impl VoiceSettings {
    /// Convert to a VoiceConfig for speech synthesis.
    pub fn to_voice_config(&self) -> VoiceConfig {
        VoiceConfig {
            voice_id: self.voice_id.clone(),
            rate: self.rate,
            pitch: self.pitch,
            volume: self.volume,
            locale: self.locale.clone(),
            gender: self.gender,
            quality: self.quality,
        }
    }
}

/// Accessibility settings.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AccessibilitySettings {
    /// Enable switch scanning.
    pub switch_scanning_enabled: bool,

    /// Scanning mode when enabled.
    pub scan_mode: ScanMode,

    /// Time between automatic scan advances.
    #[serde(with = "duration_millis")]
    pub scan_interval: Duration,

    /// Enable dwell selection (hover to select).
    pub dwell_enabled: bool,

    /// Time to hover before selection.
    #[serde(with = "duration_millis")]
    pub dwell_time: Duration,

    /// Enable visual feedback for focus.
    pub visual_feedback: bool,

    /// Enable audio feedback.
    pub audio_feedback: bool,

    /// Enable haptic feedback (on supported devices).
    pub haptic_feedback: bool,

    /// Minimum touch target size in logical pixels.
    pub min_touch_target: u32,
}

impl Default for AccessibilitySettings {
    fn default() -> Self {
        Self {
            switch_scanning_enabled: false,
            scan_mode: ScanMode::RowColumn,
            scan_interval: Duration::from_millis(1000),
            dwell_enabled: false,
            dwell_time: Duration::from_millis(1000),
            visual_feedback: true,
            audio_feedback: true,
            haptic_feedback: true,
            min_touch_target: 44, // iOS/Android recommended minimum
        }
    }
}

/// Display settings.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DisplaySettings {
    /// Show labels on buttons.
    pub show_labels: bool,

    /// Show images on buttons.
    pub show_images: bool,

    /// Button text size (small, medium, large, extra-large).
    pub text_size: TextSize,

    /// Color theme.
    pub theme: Theme,

    /// High contrast mode.
    pub high_contrast: bool,

    /// Reduced motion (minimize animations).
    pub reduced_motion: bool,
}

impl Default for DisplaySettings {
    fn default() -> Self {
        Self {
            show_labels: true,
            show_images: true,
            text_size: TextSize::Medium,
            theme: Theme::System,
            high_contrast: false,
            reduced_motion: false,
        }
    }
}

/// Text size options.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default, Serialize, Deserialize)]
pub enum TextSize {
    Small,
    #[default]
    Medium,
    Large,
    ExtraLarge,
}

impl TextSize {
    /// Get the scale factor for this text size.
    pub fn scale(&self) -> f32 {
        match self {
            TextSize::Small => 0.85,
            TextSize::Medium => 1.0,
            TextSize::Large => 1.25,
            TextSize::ExtraLarge => 1.5,
        }
    }
}

/// Color theme options.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default, Serialize, Deserialize)]
pub enum Theme {
    /// Follow system setting.
    #[default]
    System,
    /// Light mode.
    Light,
    /// Dark mode.
    Dark,
}

/// Input settings.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InputSettings {
    /// Enable long press for additional options.
    pub long_press_enabled: bool,

    /// Duration for long press detection.
    #[serde(with = "duration_millis")]
    pub long_press_duration: Duration,

    /// Enable swipe gestures for navigation.
    pub swipe_navigation: bool,

    /// Primary switch action (for single-switch users).
    pub primary_switch_action: SwitchAction,

    /// Secondary switch action (for two-switch users).
    pub secondary_switch_action: SwitchAction,
}

impl Default for InputSettings {
    fn default() -> Self {
        Self {
            long_press_enabled: true,
            long_press_duration: Duration::from_millis(500),
            swipe_navigation: true,
            primary_switch_action: SwitchAction::Select,
            secondary_switch_action: SwitchAction::Back,
        }
    }
}

/// Switch action options.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum SwitchAction {
    /// Select the current item.
    Select,
    /// Go back.
    Back,
    /// Advance to next item.
    Next,
    /// Go to previous item.
    Previous,
    /// Speak the current item.
    Speak,
}

/// Serialization helper for Duration as milliseconds.
mod duration_millis {
    use serde::{Deserialize, Deserializer, Serialize, Serializer};
    use std::time::Duration;

    pub fn serialize<S>(duration: &Duration, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        duration.as_millis().serialize(serializer)
    }

    pub fn deserialize<'de, D>(deserializer: D) -> Result<Duration, D::Error>
    where
        D: Deserializer<'de>,
    {
        let millis = u64::deserialize(deserializer)?;
        Ok(Duration::from_millis(millis))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_profile_creation() {
        let profile = Profile::new("Test User");
        assert_eq!(profile.name, "Test User");
        assert!(profile.home_board_id.is_none());
    }

    #[test]
    fn test_profile_with_home_board() {
        let profile = Profile::new("User").with_home_board("love-board");
        assert_eq!(profile.home_board_id, Some("love-board".to_string()));
    }

    #[test]
    fn test_voice_settings_to_config() {
        let settings = VoiceSettings {
            rate: 1.5,
            pitch: 0.8,
            volume: 0.9,
            ..Default::default()
        };

        let config = settings.to_voice_config();
        assert_eq!(config.rate, 1.5);
        assert_eq!(config.pitch, 0.8);
        assert_eq!(config.volume, 0.9);
    }

    #[test]
    fn test_profile_serialization() {
        let profile = Profile::new("Test");
        let json = serde_json::to_string(&profile).unwrap();
        let parsed: Profile = serde_json::from_str(&json).unwrap();
        assert_eq!(profile.name, parsed.name);
    }

    #[test]
    fn test_text_size_scale() {
        assert_eq!(TextSize::Small.scale(), 0.85);
        assert_eq!(TextSize::Medium.scale(), 1.0);
        assert_eq!(TextSize::Large.scale(), 1.25);
        assert_eq!(TextSize::ExtraLarge.scale(), 1.5);
    }
}
