/**
 * Settings component - voice, speech, and display settings
 */

import { useState, useEffect } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import type { Profile, SpeechSettings, DisplaySettings, ScanningSettings } from '../types/profile';

export interface SettingsProps {
  /** Current profile settings */
  profile: Profile;
  /** Available voices from Web Speech API */
  voices: SpeechSynthesisVoice[];
  /** Callback when settings change */
  onChange: (profile: Profile) => void;
  /** Callback to close settings */
  onClose: () => void;
  /** Callback to test speech with current settings */
  onTestSpeech: () => void;
}

export function Settings({
  profile,
  voices,
  onChange,
  onClose,
  onTestSpeech,
}: SettingsProps) {
  const [localProfile, setLocalProfile] = useState<Profile>(profile);
  const dialogRef = useFocusTrap<HTMLDivElement>({ active: true, onEscape: onClose });

  // Update local state when profile prop changes
  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

  const updateSpeech = (updates: Partial<SpeechSettings>) => {
    const updated = {
      ...localProfile,
      speech: { ...localProfile.speech, ...updates },
    };
    setLocalProfile(updated);
    onChange(updated);
  };

  const updateDisplay = (updates: Partial<DisplaySettings>) => {
    const updated = {
      ...localProfile,
      display: { ...localProfile.display, ...updates },
    };
    setLocalProfile(updated);
    onChange(updated);
  };

  const updateScanning = (updates: Partial<ScanningSettings>) => {
    const updated = {
      ...localProfile,
      scanning: { ...localProfile.scanning!, ...updates },
    };
    setLocalProfile(updated);
    onChange(updated);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        aria-describedby="settings-description"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-4 rounded-t-lg">
          <h2 id="settings-title" className="text-2xl font-bold">Settings</h2>
          <p id="settings-description" className="text-sm opacity-90">
            Customize your LoveWords experience
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Speech Settings */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Speech Settings</h3>

            {/* Voice Selection */}
            <div className="mb-4">
              <label htmlFor="voice-select" className="block text-sm font-medium text-gray-700 mb-2">
                Voice
              </label>
              <select
                id="voice-select"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={localProfile.speech.voice || ''}
                onChange={(e) => updateSpeech({ voice: e.target.value || undefined })}
              >
                <option value="">Default Voice</option>
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            {/* Rate Slider */}
            <div className="mb-4">
              <label htmlFor="rate-slider" className="block text-sm font-medium text-gray-700 mb-2">
                Speed: {localProfile.speech.rate.toFixed(1)}x
              </label>
              <input
                id="rate-slider"
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={localProfile.speech.rate}
                onChange={(e) => updateSpeech({ rate: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Slow</span>
                <span>Normal</span>
                <span>Fast</span>
              </div>
            </div>

            {/* Pitch Slider */}
            <div className="mb-4">
              <label htmlFor="pitch-slider" className="block text-sm font-medium text-gray-700 mb-2">
                Pitch: {localProfile.speech.pitch.toFixed(1)}
              </label>
              <input
                id="pitch-slider"
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={localProfile.speech.pitch}
                onChange={(e) => updateSpeech({ pitch: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low</span>
                <span>Normal</span>
                <span>High</span>
              </div>
            </div>

            {/* Volume Slider */}
            <div className="mb-4">
              <label htmlFor="volume-slider" className="block text-sm font-medium text-gray-700 mb-2">
                Volume: {Math.round(localProfile.speech.volume * 100)}%
              </label>
              <input
                id="volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={localProfile.speech.volume}
                onChange={(e) => updateSpeech({ volume: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Quiet</span>
                <span>Normal</span>
                <span>Loud</span>
              </div>
            </div>

            {/* Test Speech Button */}
            <button
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={onTestSpeech}
              type="button"
            >
              🔊 Test Speech
            </button>
          </section>

          {/* Display Settings */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Display Settings</h3>

            {/* Theme Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['light', 'dark', 'auto'] as const).map((theme) => (
                  <button
                    key={theme}
                    className={`px-4 py-2 rounded-md border-2 transition-colors ${
                      localProfile.display.theme === theme
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => updateDisplay({ theme })}
                    type="button"
                  >
                    {theme === 'light' && '☀️ Light'}
                    {theme === 'dark' && '🌙 Dark'}
                    {theme === 'auto' && '🔄 Auto'}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Size Slider */}
            <div className="mb-4">
              <label htmlFor="textsize-slider" className="block text-sm font-medium text-gray-700 mb-2">
                Text Size: {Math.round(localProfile.display.textSize * 100)}%
              </label>
              <input
                id="textsize-slider"
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={localProfile.display.textSize}
                onChange={(e) => updateDisplay({ textSize: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Small</span>
                <span>Normal</span>
                <span>Large</span>
              </div>
            </div>

            {/* Show Labels Toggle */}
            <div className="mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localProfile.display.showLabels}
                  onChange={(e) => updateDisplay({ showLabels: e.target.checked })}
                  className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Show button labels
                </span>
              </label>
            </div>

            {/* Show Images Toggle */}
            <div className="mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localProfile.display.showImages}
                  onChange={(e) => updateDisplay({ showImages: e.target.checked })}
                  className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Show button images
                </span>
              </label>
            </div>
          </section>

          {/* Accessibility Settings */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Accessibility Settings</h3>

            {/* Switch Scanning Toggle */}
            <div className="mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localProfile.scanning?.enabled ?? false}
                  onChange={(e) => updateScanning({ enabled: e.target.checked })}
                  className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Enable Switch Scanning
                </span>
              </label>
              <p className="ml-8 mt-1 text-xs text-gray-500">
                Automatically highlights cells for single-switch access
              </p>
            </div>

            {/* Scan Speed Slider */}
            {localProfile.scanning?.enabled && (
              <div className="mb-4 ml-8">
                <label htmlFor="scan-speed-slider" className="block text-sm font-medium text-gray-700 mb-2">
                  Scan Speed: {((localProfile.scanning.scanSpeed || 2000) / 1000).toFixed(1)}s per cell
                </label>
                <input
                  id="scan-speed-slider"
                  type="range"
                  min="500"
                  max="5000"
                  step="100"
                  value={localProfile.scanning.scanSpeed || 2000}
                  onChange={(e) => updateScanning({ scanSpeed: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Fast (0.5s)</span>
                  <span>Medium (2.5s)</span>
                  <span>Slow (5s)</span>
                </div>
              </div>
            )}
          </section>

          {/* Keyboard Shortcuts */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Keyboard Shortcuts</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-700">Navigate cells</span>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono">
                  Arrow Keys
                </kbd>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-700">Activate cell (or select during scan)</span>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono">
                  Enter / Space
                </kbd>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-700">Skip to main board</span>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono">
                  Tab (from page top)
                </kbd>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-700">Close settings</span>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono">
                  Escape
                </kbd>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-lg border-t border-gray-200">
          <div className="flex justify-end gap-3">
            <button
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={onClose}
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
