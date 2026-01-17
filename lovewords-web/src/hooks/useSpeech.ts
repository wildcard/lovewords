/**
 * React hook for speech synthesis
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { WebSpeechEngine, waitForVoices } from '../speech/web-speech';
import type { SpeechSettings } from '../types/profile';

export interface UseSpeechResult {
  /** Speak the given text */
  speak: (text: string) => Promise<void>;
  /** Stop any ongoing speech */
  stop: () => void;
  /** Available voices */
  voices: SpeechSynthesisVoice[];
  /** Whether speech is currently active */
  isSpeaking: boolean;
  /** Whether speech synthesis is supported */
  isSupported: boolean;
}

export function useSpeech(settings: SpeechSettings): UseSpeechResult {
  const engineRef = useRef<WebSpeechEngine>(new WebSpeechEngine());
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported] = useState(() => engineRef.current.isSupported());

  // Load voices on mount
  useEffect(() => {
    if (!isSupported) return;

    waitForVoices().then(setVoices);
  }, [isSupported]);

  const speak = useCallback(async (text: string) => {
    if (!text.trim()) return;

    setIsSpeaking(true);
    try {
      await engineRef.current.speak(text, settings);
    } catch (error) {
      console.error('Speech error:', error);
    } finally {
      setIsSpeaking(false);
    }
  }, [settings]);

  const stop = useCallback(() => {
    engineRef.current.stop();
    setIsSpeaking(false);
  }, []);

  return {
    speak,
    stop,
    voices,
    isSpeaking,
    isSupported,
  };
}
