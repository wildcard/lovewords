/**
 * MessageBar component - displays accumulated message and controls
 */

export interface MessageBarProps {
  /** Current message text */
  message: string;
  /** Callback to speak the message */
  onSpeak: () => void;
  /** Callback to clear the message */
  onClear: () => void;
  /** Callback to backspace last word */
  onBackspace: () => void;
  /** Whether speech is currently active */
  isSpeaking?: boolean;
}

export function MessageBar({
  message,
  onSpeak,
  onClear,
  onBackspace,
  isSpeaking,
}: MessageBarProps) {
  const isEmpty = !message.trim();

  return (
    <div className="message-bar mx-4 mt-4 flex items-center gap-3">
      <div
        className="flex-1 min-h-[3rem] flex items-center px-4"
        role="status"
        aria-live="polite"
        aria-label="Current message"
      >
        {isEmpty ? (
          <span className="text-gray-400 italic">Tap cells to build a message...</span>
        ) : (
          <span className="text-gray-900">{message}</span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          className="nav-button bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          onClick={onSpeak}
          disabled={isEmpty || isSpeaking}
          aria-label="Speak message"
          type="button"
        >
          {isSpeaking ? '🔊 Speaking...' : '🔊 Speak'}
        </button>

        <button
          className="nav-button bg-yellow-500 text-white hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          onClick={onBackspace}
          disabled={isEmpty}
          aria-label="Remove last word"
          type="button"
        >
          ⌫
        </button>

        <button
          className="nav-button bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          onClick={onClear}
          disabled={isEmpty}
          aria-label="Clear message"
          type="button"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
