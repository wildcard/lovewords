/**
 * DragOverlay component - Visual feedback during drag-and-drop
 * Shows a full-screen overlay when files are dragged over the app
 */

export interface DragOverlayProps {
  /** Whether the overlay should be visible */
  visible: boolean;
}

export function DragOverlay({ visible }: DragOverlayProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none"
      role="presentation"
      aria-label="Drop files to import"
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-blue-500 bg-opacity-10 backdrop-blur-sm animate-pulse" />

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-2xl p-8 border-4 border-blue-500 border-dashed">
          <div className="text-center">
            <div className="text-6xl mb-4">📥</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Drop Board Files Here
            </h3>
            <p className="text-gray-600">
              Import one or more <code>.obf</code> files
            </p>
          </div>
        </div>
      </div>

      {/* Corner indicators */}
      <div className="absolute top-4 left-4 text-blue-600 opacity-75">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </div>
      <div className="absolute top-4 right-4 text-blue-600 opacity-75">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </div>
      <div className="absolute bottom-4 left-4 text-blue-600 opacity-75">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 14l-5-5-5 5z" />
        </svg>
      </div>
      <div className="absolute bottom-4 right-4 text-blue-600 opacity-75">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 14l-5-5-5 5z" />
        </svg>
      </div>
    </div>
  );
}
