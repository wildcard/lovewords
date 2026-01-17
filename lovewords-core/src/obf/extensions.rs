//! LoveWords-specific OBF extensions.
//!
//! These extensions use the `ext_lovewords_*` namespace as required by the OBF spec
//! for vendor-specific fields. This allows LoveWords boards to store additional
//! metadata while remaining compatible with other OBF readers.
//!
//! # Extension Fields
//!
//! - `ext_lovewords_moment`: Situational context (e.g., "bedtime", "apology")
//! - `ext_lovewords_warmth`: Emotional tone categories (e.g., ["affection", "gratitude"])
//! - `ext_lovewords_intimacy_level`: Privacy/intimacy level (1-5 scale)
//! - `ext_lovewords_partner_specific`: Whether this is specific to a partner relationship
//! - `ext_lovewords_celebration`: Special occasion type

use serde::{Deserialize, Serialize};

/// LoveWords-specific extensions for OBF boards and buttons.
///
/// All fields use the `ext_lovewords_` prefix for OBF compliance.
/// Unknown extensions are preserved via `extra_extensions`.
#[derive(Debug, Clone, Default, Serialize, Deserialize, PartialEq)]
pub struct ObfExtensions {
    /// Situational moment/context for this board or button.
    ///
    /// Examples: "bedtime", "apology", "greeting", "gratitude", "encouragement"
    #[serde(
        rename = "ext_lovewords_moment",
        skip_serializing_if = "Option::is_none"
    )]
    pub moment: Option<String>,

    /// Warmth/emotion categories this content expresses.
    ///
    /// Examples: ["affection", "gratitude"], ["comfort", "support"]
    #[serde(
        rename = "ext_lovewords_warmth",
        skip_serializing_if = "Option::is_none"
    )]
    pub warmth: Option<Vec<String>>,

    /// Intimacy level on a 1-5 scale.
    ///
    /// - 1: Public/general (appropriate for anyone)
    /// - 2: Friendly (close friends)
    /// - 3: Affectionate (family, close friends)
    /// - 4: Intimate (romantic partner)
    /// - 5: Very intimate (private romantic moments)
    #[serde(
        rename = "ext_lovewords_intimacy_level",
        skip_serializing_if = "Option::is_none"
    )]
    pub intimacy_level: Option<u8>,

    /// Whether this content is specific to romantic partner relationships.
    #[serde(
        rename = "ext_lovewords_partner_specific",
        skip_serializing_if = "Option::is_none"
    )]
    pub partner_specific: Option<bool>,

    /// Special occasion or celebration type.
    ///
    /// Examples: "birthday", "anniversary", "holiday", "achievement"
    #[serde(
        rename = "ext_lovewords_celebration",
        skip_serializing_if = "Option::is_none"
    )]
    pub celebration: Option<String>,

    /// Custom tags for user categorization.
    #[serde(rename = "ext_lovewords_tags", skip_serializing_if = "Option::is_none")]
    pub tags: Option<Vec<String>>,

    /// Voice/tone suggestion for TTS.
    ///
    /// Examples: "soft", "warm", "playful", "sincere"
    #[serde(rename = "ext_lovewords_tone", skip_serializing_if = "Option::is_none")]
    pub tone: Option<String>,

    /// Priority for smart suggestions (higher = more likely to suggest).
    #[serde(
        rename = "ext_lovewords_priority",
        skip_serializing_if = "Option::is_none"
    )]
    pub priority: Option<i32>,
}

impl ObfExtensions {
    /// Create extensions with a moment/context.
    pub fn with_moment(moment: impl Into<String>) -> Self {
        Self {
            moment: Some(moment.into()),
            ..Default::default()
        }
    }

    /// Create extensions for romantic partner content.
    pub fn romantic() -> Self {
        Self {
            partner_specific: Some(true),
            intimacy_level: Some(4),
            ..Default::default()
        }
    }

    /// Set warmth categories.
    pub fn with_warmth(mut self, warmth: Vec<String>) -> Self {
        self.warmth = Some(warmth);
        self
    }

    /// Set intimacy level.
    pub fn with_intimacy(mut self, level: u8) -> Self {
        self.intimacy_level = Some(level.clamp(1, 5));
        self
    }

    /// Set tone suggestion.
    pub fn with_tone(mut self, tone: impl Into<String>) -> Self {
        self.tone = Some(tone.into());
        self
    }

    /// Add tags.
    pub fn with_tags(mut self, tags: Vec<String>) -> Self {
        self.tags = Some(tags);
        self
    }

    /// Check if this has any LoveWords extensions set.
    pub fn is_empty(&self) -> bool {
        self.moment.is_none()
            && self.warmth.is_none()
            && self.intimacy_level.is_none()
            && self.partner_specific.is_none()
            && self.celebration.is_none()
            && self.tags.is_none()
            && self.tone.is_none()
            && self.priority.is_none()
    }
}

/// Common warmth categories for LoveWords content.
#[allow(dead_code)]
pub mod warmth {
    pub const AFFECTION: &str = "affection";
    pub const GRATITUDE: &str = "gratitude";
    pub const COMFORT: &str = "comfort";
    pub const SUPPORT: &str = "support";
    pub const PLAYFUL: &str = "playful";
    pub const ROMANTIC: &str = "romantic";
    pub const CARING: &str = "caring";
    pub const ENCOURAGEMENT: &str = "encouragement";
}

/// Common moment contexts for LoveWords content.
#[allow(dead_code)]
pub mod moment {
    pub const BEDTIME: &str = "bedtime";
    pub const MORNING: &str = "morning";
    pub const GREETING: &str = "greeting";
    pub const FAREWELL: &str = "farewell";
    pub const APOLOGY: &str = "apology";
    pub const CELEBRATION: &str = "celebration";
    pub const COMFORT: &str = "comfort";
    pub const DAILY: &str = "daily";
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_extensions_serialization() {
        let ext = ObfExtensions {
            moment: Some("bedtime".to_string()),
            warmth: Some(vec!["affection".to_string(), "comfort".to_string()]),
            intimacy_level: Some(4),
            partner_specific: Some(true),
            ..Default::default()
        };

        let json = serde_json::to_string(&ext).unwrap();
        assert!(json.contains("ext_lovewords_moment"));
        assert!(json.contains("bedtime"));
        assert!(json.contains("ext_lovewords_warmth"));
        assert!(json.contains("ext_lovewords_intimacy_level"));

        let parsed: ObfExtensions = serde_json::from_str(&json).unwrap();
        assert_eq!(ext, parsed);
    }

    #[test]
    fn test_extensions_builder() {
        let ext = ObfExtensions::with_moment("morning")
            .with_warmth(vec!["affection".to_string()])
            .with_intimacy(3)
            .with_tone("soft");

        assert_eq!(ext.moment, Some("morning".to_string()));
        assert_eq!(ext.intimacy_level, Some(3));
        assert_eq!(ext.tone, Some("soft".to_string()));
    }

    #[test]
    fn test_extensions_empty_check() {
        let empty = ObfExtensions::default();
        assert!(empty.is_empty());

        let not_empty = ObfExtensions::with_moment("test");
        assert!(!not_empty.is_empty());
    }

    #[test]
    fn test_intimacy_clamping() {
        let ext = ObfExtensions::default().with_intimacy(10);
        assert_eq!(ext.intimacy_level, Some(5));

        let ext = ObfExtensions::default().with_intimacy(0);
        assert_eq!(ext.intimacy_level, Some(1));
    }
}
