/**
 * User profile and settings types
 */

export interface Profile {
  /** User's name */
  name?: string;
  /** Speech synthesis settings */
  speech: SpeechSettings;
  /** Display settings */
  display: DisplaySettings;
  /** Scanning settings for accessibility */
  scanning?: ScanningSettings;
}

export interface SpeechSettings {
  /** Voice to use (voice name from Web Speech API) */
  voice?: string;
  /** Speech rate (0.1 - 10, default 1) */
  rate: number;
  /** Speech pitch (0 - 2, default 1) */
  pitch: number;
  /** Speech volume (0 - 1, default 1) */
  volume: number;
}

export interface DisplaySettings {
  /** Theme mode */
  theme: 'light' | 'dark' | 'auto';
  /** Text size multiplier (0.5 - 2, default 1) */
  textSize: number;
  /** Show button labels */
  showLabels: boolean;
  /** Show button images */
  showImages: boolean;
}

export interface ScanningSettings {
  /** Enable switch scanning mode */
  enabled: boolean;
  /** Scan speed in milliseconds (500-5000, default: 2000) */
  scanSpeed: number;
  /** Scan pattern (MVP: linear only) */
  scanPattern: 'linear' | 'row-column';
}

/**
 * Default profile settings
 */
export const DEFAULT_PROFILE: Profile = {
  speech: {
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
  },
  display: {
    theme: 'auto',
    textSize: 1.0,
    showLabels: true,
    showImages: true,
  },
  scanning: {
    enabled: false,
    scanSpeed: 2000, // 2 seconds per cell
    scanPattern: 'linear',
  },
};
