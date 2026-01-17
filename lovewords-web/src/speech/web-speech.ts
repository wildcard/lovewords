/**
 * Web Speech API implementation
 */

import type { SpeechEngine } from './types';
import type { SpeechSettings } from '../types/profile';

export class WebSpeechEngine implements SpeechEngine {
  private synth: SpeechSynthesis;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  async speak(text: string, settings: SpeechSettings): Promise<void> {
    return new Promise((resolve, reject) => {
      // Cancel any ongoing speech
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Apply settings
      utterance.rate = settings.rate;
      utterance.pitch = settings.pitch;
      utterance.volume = settings.volume;

      // Set voice if specified
      if (settings.voice) {
        const voice = this.getVoices().find(v => v.name === settings.voice);
        if (voice) {
          utterance.voice = voice;
        }
      }

      // Set up event handlers
      utterance.onend = () => resolve();
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        reject(new Error(`Speech synthesis failed: ${event.error}`));
      };

      // Speak
      this.synth.speak(utterance);
    });
  }

  stop(): void {
    this.synth.cancel();
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.synth.getVoices();
  }

  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }
}

/**
 * Wait for voices to load (Chrome requires this)
 */
export function waitForVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();

    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    // Chrome needs time to load voices
    synth.addEventListener('voiceschanged', () => {
      resolve(synth.getVoices());
    }, { once: true });
  });
}
