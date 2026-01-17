//! Accessibility utilities and timing configuration.
//!
//! This module provides helpers for accessibility-related functionality
//! that spans multiple other modules.

use std::time::Duration;

/// Timing configuration for accessibility features.
///
/// These values are based on accessibility research and can be
/// customized per-user in their profile settings.
#[derive(Debug, Clone)]
pub struct TimingConfig {
    /// Minimum time for a tap to register (debounce).
    pub tap_debounce: Duration,

    /// Maximum time between taps for a double-tap.
    pub double_tap_window: Duration,

    /// Time to hold for a long press.
    pub long_press_threshold: Duration,

    /// Time to dwell before selection.
    pub dwell_threshold: Duration,

    /// Time between scan advances.
    pub scan_interval: Duration,

    /// Extra delay on first item after scan wrap.
    pub scan_first_item_delay: Duration,

    /// Minimum time to display feedback.
    pub feedback_duration: Duration,
}

impl Default for TimingConfig {
    fn default() -> Self {
        Self {
            tap_debounce: Duration::from_millis(50),
            double_tap_window: Duration::from_millis(300),
            long_press_threshold: Duration::from_millis(500),
            dwell_threshold: Duration::from_millis(1000),
            scan_interval: Duration::from_millis(1000),
            scan_first_item_delay: Duration::from_millis(500),
            feedback_duration: Duration::from_millis(200),
        }
    }
}

impl TimingConfig {
    /// Create a "relaxed" timing config with longer thresholds.
    ///
    /// Good for users who need more time.
    pub fn relaxed() -> Self {
        Self {
            tap_debounce: Duration::from_millis(100),
            double_tap_window: Duration::from_millis(500),
            long_press_threshold: Duration::from_millis(800),
            dwell_threshold: Duration::from_millis(1500),
            scan_interval: Duration::from_millis(1500),
            scan_first_item_delay: Duration::from_millis(750),
            feedback_duration: Duration::from_millis(300),
        }
    }

    /// Create a "quick" timing config with shorter thresholds.
    ///
    /// Good for experienced users who want faster interaction.
    pub fn quick() -> Self {
        Self {
            tap_debounce: Duration::from_millis(30),
            double_tap_window: Duration::from_millis(250),
            long_press_threshold: Duration::from_millis(350),
            dwell_threshold: Duration::from_millis(600),
            scan_interval: Duration::from_millis(600),
            scan_first_item_delay: Duration::from_millis(300),
            feedback_duration: Duration::from_millis(150),
        }
    }
}

/// Focus indicator style for visual feedback.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub enum FocusStyle {
    /// Standard border highlight.
    #[default]
    Border,
    /// Glow/shadow effect.
    Glow,
    /// Invert colors.
    Invert,
    /// Scale up slightly.
    Scale,
    /// Underline (for text-heavy cells).
    Underline,
}

/// Contrast level for visual accessibility.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub enum ContrastLevel {
    /// Standard contrast.
    #[default]
    Normal,
    /// Medium-high contrast.
    Medium,
    /// Maximum contrast (often black/white/yellow).
    High,
}

impl ContrastLevel {
    /// Get a minimum contrast ratio for this level.
    ///
    /// Based on WCAG guidelines.
    pub fn min_ratio(&self) -> f32 {
        match self {
            ContrastLevel::Normal => 4.5, // WCAG AA for normal text
            ContrastLevel::Medium => 7.0, // WCAG AAA
            ContrastLevel::High => 10.0,  // High visibility
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_timing_presets() {
        let default = TimingConfig::default();
        let relaxed = TimingConfig::relaxed();
        let quick = TimingConfig::quick();

        // Relaxed should be slower
        assert!(relaxed.scan_interval > default.scan_interval);

        // Quick should be faster
        assert!(quick.scan_interval < default.scan_interval);
    }

    #[test]
    fn test_contrast_ratios() {
        assert!(ContrastLevel::High.min_ratio() > ContrastLevel::Medium.min_ratio());
        assert!(ContrastLevel::Medium.min_ratio() > ContrastLevel::Normal.min_ratio());
    }
}
