/**
 * Open Board Format (OBF) TypeScript types
 * Matches the OBF 0.1 specification with LoveWords extensions
 */

export interface ObfBoard {
  /** Format version (e.g., "open-board-0.1") */
  format: string;
  /** Unique board identifier */
  id: string;
  /** Human-readable board name */
  name: string;
  /** Locale code (e.g., "en", "es") */
  locale: string;
  /** Optional HTML description */
  description_html?: string;
  /** Optional plain text description (for custom boards) */
  description?: string;
  /** Buttons on this board */
  buttons: ObfButton[];
  /** Images referenced by buttons */
  images: ObfImage[];
  /** Sounds referenced by buttons */
  sounds: ObfSound[];
  /** Grid layout definition */
  grid: ObfGrid;
  /** License information */
  license?: ObfLicense;

  // LoveWords extensions (flattened at board level)
  /** When this board is most relevant (e.g., "daily", "morning", "bedtime") */
  ext_lovewords_moment?: string;
  /** Emotional warmth categories for the whole board */
  ext_lovewords_warmth?: string[];
  /** Flag to identify custom (user-created) boards */
  ext_lovewords_custom?: boolean;
  /** Timestamp when board was created (ISO 8601) */
  ext_lovewords_created_at?: string;
  /** Timestamp when board was last updated (ISO 8601) */
  ext_lovewords_updated_at?: string;
}

export interface ObfButton {
  /** Unique button identifier */
  id: string;
  /** Display text on button */
  label: string;
  /** Text to speak (defaults to label if missing) */
  vocalization?: string;
  /** Action to perform (e.g., ":speak", ":back", ":home") */
  action?: string;
  /** Board to navigate to */
  load_board?: { id?: string; name?: string; path?: string };
  /** Background color (hex or named) */
  background_color?: string;
  /** Border color */
  border_color?: string;
  /** Image reference */
  image_id?: string;
  /** Sound reference */
  sound_id?: string;
  /** Whether button is hidden */
  hidden?: boolean;

  // LoveWords extensions
  /** Emotional warmth tags (e.g., ["affection", "romantic"]) */
  ext_lovewords_warmth?: string[];
  /** Intimacy level 1-5 (1=casual, 5=deeply intimate) */
  ext_lovewords_intimacy_level?: number;
  /** True if phrase is partner-specific */
  ext_lovewords_partner_specific?: boolean;
  /** Tone of phrase (e.g., "warm", "playful", "sincere") */
  ext_lovewords_tone?: string;
}

export interface ObfImage {
  /** Unique image identifier */
  id: string;
  /** Image URL or data URI */
  url?: string;
  /** Data URI for embedded image */
  data?: string;
  /** MIME type */
  content_type?: string;
  /** Image width in pixels */
  width?: number;
  /** Image height in pixels */
  height?: number;
}

export interface ObfSound {
  /** Unique sound identifier */
  id: string;
  /** Sound URL or data URI */
  url?: string;
  /** Data URI for embedded sound */
  data?: string;
  /** MIME type */
  content_type?: string;
  /** Duration in milliseconds */
  duration?: number;
}

export interface ObfGrid {
  /** Number of rows */
  rows: number;
  /** Number of columns */
  columns: number;
  /** 2D array of button IDs (null for empty cells) */
  order: (string | null)[][];
}

export interface ObfLicense {
  /** License type (e.g., "CC BY-SA 4.0") */
  type: string;
  /** License URL */
  url?: string;
  /** Author name */
  author_name?: string;
  /** Author URL */
  author_url?: string;
  /** Copyright notice */
  copyright_notice_url?: string;
}

/**
 * Helper to get button by ID from a board
 */
export function getButton(board: ObfBoard, buttonId: string): ObfButton | undefined {
  return board.buttons.find(btn => btn.id === buttonId);
}

/**
 * Helper to check if a cell is empty
 */
export function isEmpty(board: ObfBoard, row: number, col: number): boolean {
  if (row < 0 || row >= board.grid.rows || col < 0 || col >= board.grid.columns) {
    return true;
  }
  return board.grid.order[row]?.[col] === null;
}
