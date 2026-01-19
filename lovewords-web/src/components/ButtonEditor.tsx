/**
 * ButtonEditor component - modal for adding/editing buttons
 */

import { useState, useEffect } from 'react';
import type { ObfButton, ObfBoard } from '../types/obf';
import { ImageUploader } from './ImageUploader';

export interface ButtonEditorProps {
  /** The board being edited */
  board: ObfBoard;
  /** Row position of the cell (0-indexed) */
  row: number;
  /** Column position of the cell (0-indexed) */
  col: number;
  /** Existing button (if editing), undefined for new button */
  button?: ObfButton;
  /** Callback when button is saved */
  onSave: (button: ObfButton, row: number, col: number, imageDataUrl?: string) => void;
  /** Callback to close the editor */
  onClose: () => void;
  /** Callback to delete button (only for existing buttons) */
  onDelete?: (buttonId: string, row: number, col: number) => void;
}

type ButtonAction =
  | 'speak'
  | 'add-to-message'
  | 'navigate'
  | 'back'
  | 'home'
  | 'clear'
  | 'backspace';

const ACTION_OPTIONS: { value: ButtonAction; label: string }[] = [
  { value: 'speak', label: 'Speak' },
  { value: 'add-to-message', label: 'Add to Message' },
  { value: 'navigate', label: 'Navigate to Board' },
  { value: 'back', label: 'Back' },
  { value: 'home', label: 'Home' },
  { value: 'clear', label: 'Clear' },
  { value: 'backspace', label: 'Backspace' },
];

export function ButtonEditor({
  board: _board, // TODO: Use to fetch available custom boards for navigation
  row,
  col,
  button,
  onSave,
  onClose,
  onDelete,
}: ButtonEditorProps) {
  const isEditMode = !!button;

  // Get existing image if button has one
  const getExistingImage = (): string | undefined => {
    if (button?.image_id && _board) {
      const image = _board.images.find(img => img.id === button.image_id);
      return image?.data || image?.url;
    }
    return undefined;
  };

  // Form state
  const [label, setLabel] = useState(button?.label || '');
  const [vocalization, setVocalization] = useState(button?.vocalization || '');
  const [action, setAction] = useState<ButtonAction>('speak');
  const [navigateToBoard, setNavigateToBoard] = useState('');
  const [backgroundColor, setBackgroundColor] = useState(
    button?.background_color || '#e0e0e0'
  );
  const [borderColor, setBorderColor] = useState(button?.border_color || '');
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>(getExistingImage());
  const [errors, setErrors] = useState<{ label?: string }>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Initialize action from existing button
  useEffect(() => {
    if (button) {
      // Determine action from button data
      if (button.action === '+') {
        setAction('add-to-message');
      } else if (button.load_board) {
        setAction('navigate');
        setNavigateToBoard(button.load_board.id || '');
      } else if (button.action === ':home') {
        setAction('home');
      } else if (button.action === ':back') {
        setAction('back');
      } else if (button.action === ':clear') {
        setAction('clear');
      } else if (button.action === ':backspace') {
        setAction('backspace');
      } else {
        setAction('speak');
      }
    }
  }, [button]);

  const validate = (): boolean => {
    const newErrors: { label?: string } = {};

    if (!label.trim()) {
      newErrors.label = 'Label is required';
    }

    if (action === 'navigate' && !navigateToBoard) {
      newErrors.label = 'Please select a board to navigate to';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Build ObfButton based on action
    const newButton: ObfButton = {
      id: button?.id || `button-${Date.now()}`,
      label: label.trim(),
      vocalization: vocalization.trim() || label.trim(),
      background_color: backgroundColor,
      border_color: borderColor || undefined,
    };

    // Set action field based on selected action
    switch (action) {
      case 'speak':
        // Default - no action field needed
        break;
      case 'add-to-message':
        newButton.action = '+';
        break;
      case 'navigate':
        newButton.load_board = { id: navigateToBoard };
        break;
      case 'back':
        newButton.action = ':back';
        break;
      case 'home':
        newButton.action = ':home';
        break;
      case 'clear':
        newButton.action = ':clear';
        break;
      case 'backspace':
        newButton.action = ':backspace';
        break;
    }

    // If there's an image, set a placeholder image_id (parent will create the actual image)
    if (imageDataUrl) {
      newButton.image_id = button?.image_id || `image-${Date.now()}`;
    }

    onSave(newButton, row, col, imageDataUrl);
  };

  const handleDelete = () => {
    if (button && onDelete) {
      onDelete(button.id, row, col);
    }
  };

  // Get list of available boards for navigation
  // TODO: In future, fetch from storage to include custom boards
  const availableBoards = [
    { id: 'love-and-affection', name: 'Love & Affection' },
    { id: 'core-words', name: 'Core Words' },
    { id: 'basic-needs', name: 'Basic Needs' },
  ];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-labelledby="button-editor-title"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 id="button-editor-title" className="text-2xl font-bold mb-4">
            {isEditMode ? 'Edit Button' : 'Add Button'}
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Label */}
            <div className="mb-4">
              <label htmlFor="label" className="block font-medium mb-2">
                Label <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.label ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Text shown on button"
                autoFocus
              />
              {errors.label && (
                <p className="text-red-500 text-sm mt-1">{errors.label}</p>
              )}
            </div>

            {/* Vocalization */}
            <div className="mb-4">
              <label htmlFor="vocalization" className="block font-medium mb-2">
                Vocalization
              </label>
              <input
                type="text"
                id="vocalization"
                value={vocalization}
                onChange={(e) => setVocalization(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Text to speak (defaults to label)"
              />
              <p className="text-gray-500 text-sm mt-1">
                Leave empty to use the label
              </p>
            </div>

            {/* Action */}
            <div className="mb-4">
              <label htmlFor="action" className="block font-medium mb-2">
                Action
              </label>
              <select
                id="action"
                value={action}
                onChange={(e) => setAction(e.target.value as ButtonAction)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {ACTION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Navigate to Board (conditional) */}
            {action === 'navigate' && (
              <div className="mb-4 ml-4">
                <label htmlFor="navigate-board" className="block font-medium mb-2">
                  Select Board
                </label>
                <select
                  id="navigate-board"
                  value={navigateToBoard}
                  onChange={(e) => setNavigateToBoard(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">-- Choose a board --</option>
                  {availableBoards.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Background Color */}
            <div className="mb-4">
              <label htmlFor="bg-color" className="block font-medium mb-2">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="bg-color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                  placeholder="#e0e0e0"
                />
              </div>
            </div>

            {/* Border Color */}
            <div className="mb-6">
              <label htmlFor="border-color" className="block font-medium mb-2">
                Border Color (optional)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="border-color"
                  value={borderColor || '#000000'}
                  onChange={(e) => setBorderColor(e.target.value)}
                  className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={borderColor}
                  onChange={(e) => setBorderColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                  placeholder="Leave empty for no border"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <ImageUploader
                currentImage={imageDataUrl}
                onImageUploaded={setImageDataUrl}
                onImageRemoved={() => setImageDataUrl(undefined)}
              />
            </div>

            {/* Preview */}
            <div className="mb-6">
              <label className="block font-medium mb-2">Preview</label>
              <div className="flex justify-center p-4 bg-gray-50 rounded-md">
                <button
                  type="button"
                  className="cell-button"
                  style={{
                    backgroundColor,
                    borderColor: borderColor || undefined,
                    borderWidth: borderColor ? '2px' : undefined,
                  }}
                  disabled
                >
                  {label || 'Button'}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center">
              <div>
                {isEditMode && onDelete && !showDeleteConfirm && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                )}
                {showDeleteConfirm && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Are you sure?</span>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Yes, Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
