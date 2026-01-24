/**
 * Template Catalog Types
 *
 * Type definitions for board templates system.
 */

import type { ObfBoard } from './obf';

export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  category: string;
  featured: boolean;
  grid: {
    rows: number;
    columns: number;
  };
  buttonCount: number;
  file: string;
  thumbnail?: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface TemplateManifest {
  version: string;
  updated: string;
  templates: TemplateMetadata[];
}

export interface TemplateFilterOptions {
  query?: string;
  category?: string;
  featured?: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface LoadTemplateResult {
  success: boolean;
  board?: ObfBoard;
  error?: string;
}
