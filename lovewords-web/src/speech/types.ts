/**
 * Speech synthesis interface
 */

import type { SpeechSettings } from '../types/profile';

export interface SpeechEngine {
  /**
   * Speak the given text
   */
  speak(text: string, settings: SpeechSettings): Promise<void>;

  /**
   * Stop any ongoing speech
   */
  stop(): void;

  /**
   * Get available voices
   */
  getVoices(): SpeechSynthesisVoice[];

  /**
   * Check if speech synthesis is supported
   */
  isSupported(): boolean;
}
