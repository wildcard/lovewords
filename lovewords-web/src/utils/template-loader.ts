/**
 * Template Loader Utilities
 *
 * Functions for loading and filtering board templates.
 */

import type {
  TemplateManifest,
  TemplateMetadata,
  TemplateFilterOptions,
  LoadTemplateResult,
} from '../types/template-catalog';
import type { ObfBoard } from '../types/obf';
import { validateBoard } from './board-validation';

const MANIFEST_URL = '/templates/templates-manifest.json';

// In-memory cache for manifest (no localStorage needed)
let cachedManifest: TemplateManifest | null = null;

/**
 * Load template manifest from server
 */
export async function loadTemplateManifest(): Promise<TemplateManifest> {
  // Return cached manifest if available
  if (cachedManifest) {
    return cachedManifest;
  }

  try {
    const response = await fetch(MANIFEST_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch manifest: ${response.statusText}`);
    }

    const manifest: TemplateManifest = await response.json();

    // Validate manifest structure
    if (!manifest.version || !Array.isArray(manifest.templates)) {
      throw new Error('Invalid manifest format');
    }

    // Cache the manifest
    cachedManifest = manifest;

    return manifest;
  } catch (error) {
    console.error('Failed to load template manifest:', error);
    throw new Error('Could not load templates. Please try again later.');
  }
}

/**
 * Load a specific template by ID
 */
export async function loadTemplate(templateId: string): Promise<LoadTemplateResult> {
  try {
    // Load manifest to get template file path
    const manifest = await loadTemplateManifest();
    const template = manifest.templates.find((t) => t.id === templateId);

    if (!template) {
      return {
        success: false,
        error: `Template "${templateId}" not found`,
      };
    }

    // Fetch the template OBF file
    const response = await fetch(template.file);

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to load template: ${response.statusText}`,
      };
    }

    const board: ObfBoard = await response.json();

    // Validate OBF structure
    const validation = validateBoard(board);
    if (!validation.valid) {
      return {
        success: false,
        error: `Invalid template format: ${validation.errors.join(', ')}`,
      };
    }

    return {
      success: true,
      board: validation.board,
    };
  } catch (error) {
    console.error('Failed to load template:', error);
    return {
      success: false,
      error: 'Could not load template. Please try again.',
    };
  }
}

/**
 * Filter templates by search query, category, featured status, etc.
 */
export function filterTemplates(
  templates: TemplateMetadata[],
  options: TemplateFilterOptions = {}
): TemplateMetadata[] {
  let filtered = [...templates];

  // Filter by search query (name, description, tags)
  if (options.query) {
    const query = options.query.toLowerCase();
    filtered = filtered.filter((template) => {
      const nameMatch = template.name.toLowerCase().includes(query);
      const descMatch = template.description.toLowerCase().includes(query);
      const tagMatch = template.tags.some((tag) => tag.toLowerCase().includes(query));
      return nameMatch || descMatch || tagMatch;
    });
  }

  // Filter by category
  if (options.category && options.category !== 'All') {
    filtered = filtered.filter((template) => template.category === options.category);
  }

  // Filter by featured status
  if (options.featured !== undefined) {
    filtered = filtered.filter((template) => template.featured === options.featured);
  }

  // Filter by difficulty
  if (options.difficulty) {
    filtered = filtered.filter((template) => template.difficulty === options.difficulty);
  }

  return filtered;
}

/**
 * Get unique categories from templates
 */
export function getCategories(templates: TemplateMetadata[]): string[] {
  const categories = new Set(templates.map((t) => t.category));
  return ['All', ...Array.from(categories).sort()];
}

/**
 * Get featured templates
 */
export function getFeaturedTemplates(templates: TemplateMetadata[]): TemplateMetadata[] {
  return templates.filter((t) => t.featured);
}

/**
 * Clear cached manifest (useful for testing or forcing reload)
 */
export function clearManifestCache(): void {
  cachedManifest = null;
}
