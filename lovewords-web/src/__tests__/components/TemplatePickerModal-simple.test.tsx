/**
 * Simplified Template Picker Modal Tests
 *
 * Core functionality tests for template selection UI.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TemplatePickerModal } from '../../components/TemplatePickerModal';
import * as templateLoader from '../../utils/template-loader';
import type { TemplateManifest } from '../../types/template-catalog';

// Mock implementation
const mockLoadTemplateManifest = vi.fn();
const mockFilterTemplates = vi.fn((templates, options) => {
  let filtered = [...templates];
  if (options?.query) {
    const query = options.query.toLowerCase();
    filtered = filtered.filter(t =>
      t.name.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query)
    );
  }
  if (options?.category && options.category !== 'All') {
    filtered = filtered.filter(t => t.category === options.category);
  }
  if (options?.featured !== undefined) {
    filtered = filtered.filter(t => t.featured === options.featured);
  }
  return filtered;
});
const mockGetCategories = vi.fn((templates) => {
  const categories = new Set(templates.map(t => t.category));
  return ['All', ...Array.from(categories).sort()];
});

vi.mock('../../utils/template-loader', () => ({
  loadTemplateManifest: () => mockLoadTemplateManifest(),
  filterTemplates: (templates: any, options: any) => mockFilterTemplates(templates, options),
  getCategories: (templates: any) => mockGetCategories(templates),
}));

const mockManifest: TemplateManifest = {
  version: '1.0',
  updated: '2026-01-24',
  templates: [
    {
      id: 'basic-emotions',
      name: 'Basic Emotions',
      description: 'Express feelings',
      category: 'Emotions',
      featured: true,
      grid: { rows: 3, columns: 3 },
      buttonCount: 9,
      file: '/templates/basic-emotions.obf',
      tags: ['emotions'],
      difficulty: 'beginner',
    },
    {
      id: 'core-needs',
      name: 'Core Needs',
      description: 'Basic needs',
      category: 'Daily Life',
      featured: false,
      grid: { rows: 4, columns: 4 },
      buttonCount: 16,
      file: '/templates/core-needs.obf',
      tags: ['needs'],
      difficulty: 'beginner',
    },
  ],
};

describe('TemplatePickerModal', () => {
  const mockOnSelectTemplate = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockLoadTemplateManifest.mockResolvedValue(mockManifest);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should display templates after loading', async () => {
    render(
      <TemplatePickerModal
        onSelectTemplate={mockOnSelectTemplate}
        onClose={mockOnClose}
      />
    );

    // Wait for templates to load
    await waitFor(() => {
      expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByText('Core Needs')).toBeInTheDocument();
  });

  it('should call onClose when close button clicked', async () => {
    render(
      <TemplatePickerModal
        onSelectTemplate={mockOnSelectTemplate}
        onClose={mockOnClose}
      />
    );

    const closeButton = screen.getByLabelText('Close template picker');
    await userEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onSelectTemplate when use button clicked', async () => {
    render(
      <TemplatePickerModal
        onSelectTemplate={mockOnSelectTemplate}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
    }, { timeout: 3000 });

    const useButtons = screen.getAllByText('✨ Use Template');
    await userEvent.click(useButtons[0]);

    expect(mockOnSelectTemplate).toHaveBeenCalledWith('basic-emotions');
  });

  it('should display error on load failure', async () => {
    mockLoadTemplateManifest.mockRejectedValue(new Error('Load failed'));

    render(
      <TemplatePickerModal
        onSelectTemplate={mockOnSelectTemplate}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Load failed/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should have proper ARIA attributes', () => {
    render(
      <TemplatePickerModal
        onSelectTemplate={mockOnSelectTemplate}
        onClose={mockOnClose}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'template-picker-title');
  });
});
