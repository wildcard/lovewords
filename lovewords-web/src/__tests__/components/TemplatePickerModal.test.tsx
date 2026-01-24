/**
 * Template Picker Modal Tests
 *
 * Tests for template selection UI component.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TemplatePickerModal } from '../../components/TemplatePickerModal';
import * as templateLoader from '../../utils/template-loader';
import type { TemplateManifest, TemplateMetadata, TemplateFilterOptions } from '../../types/template-catalog';

// Mock template loader
vi.mock('../../utils/template-loader', () => ({
  loadTemplateManifest: vi.fn(),
  filterTemplates: vi.fn((templates: TemplateMetadata[], options?: TemplateFilterOptions) => {
    let filtered = [...templates];
    if (options?.query) {
      const query = options.query.toLowerCase();
      filtered = filtered.filter((t: TemplateMetadata) =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.tags.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }
    if (options?.category && options.category !== 'All') {
      filtered = filtered.filter((t: TemplateMetadata) => t.category === options.category);
    }
    if (options?.featured !== undefined) {
      filtered = filtered.filter((t: TemplateMetadata) => t.featured === options.featured);
    }
    return filtered;
  }),
  getCategories: vi.fn((templates: TemplateMetadata[]) => {
    const categories = new Set(templates.map((t: TemplateMetadata) => t.category));
    return ['All', ...Array.from(categories).sort()];
  }),
}));

const mockManifest: TemplateManifest = {
  version: '1.0',
  updated: '2026-01-24',
  templates: [
    {
      id: 'basic-emotions',
      name: 'Basic Emotions',
      description: 'Express basic feelings',
      category: 'Emotions',
      featured: true,
      grid: { rows: 3, columns: 3 },
      buttonCount: 9,
      file: '/templates/basic-emotions.obf',
      tags: ['emotions', 'feelings'],
      difficulty: 'beginner',
    },
    {
      id: 'core-needs',
      name: 'Core Needs',
      description: 'Basic needs',
      category: 'Daily Life',
      featured: true,
      grid: { rows: 4, columns: 4 },
      buttonCount: 16,
      file: '/templates/core-needs.obf',
      tags: ['needs', 'requests'],
      difficulty: 'beginner',
    },
    {
      id: 'daily-routine',
      name: 'Daily Routine',
      description: 'Daily activities',
      category: 'Daily Life',
      featured: false,
      grid: { rows: 4, columns: 4 },
      buttonCount: 16,
      file: '/templates/daily-routine.obf',
      tags: ['routine', 'schedule'],
      difficulty: 'beginner',
    },
    {
      id: 'questions',
      name: 'Questions',
      description: 'Ask questions',
      category: 'Social',
      featured: false,
      grid: { rows: 3, columns: 4 },
      buttonCount: 12,
      file: '/templates/questions.obf',
      tags: ['questions', 'conversation'],
      difficulty: 'intermediate',
    },
  ],
};

describe('TemplatePickerModal', () => {
  const mockOnSelectTemplate = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(templateLoader.loadTemplateManifest).mockResolvedValue(mockManifest);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render template picker modal', async () => {
    render(
      <TemplatePickerModal
        onSelectTemplate={mockOnSelectTemplate}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('📋 Choose a Template')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search templates...')).toBeInTheDocument();
  });

  it('should load and display templates', async () => {
    render(
      <TemplatePickerModal
        onSelectTemplate={mockOnSelectTemplate}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      expect(screen.getByText('Core Needs')).toBeInTheDocument();
      expect(screen.getByText('Daily Routine')).toBeInTheDocument();
      expect(screen.getByText('Questions')).toBeInTheDocument();
    });
  });

  it('should display loading state', () => {
    vi.mocked(templateLoader.loadTemplateManifest).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(
      <TemplatePickerModal
        onSelectTemplate={mockOnSelectTemplate}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Loading templates...')).toBeInTheDocument();
  });

  it('should display error state on load failure', async () => {
    vi.mocked(templateLoader.loadTemplateManifest).mockRejectedValue(
      new Error('Network error')
    );

    render(
      <TemplatePickerModal
        onSelectTemplate={mockOnSelectTemplate}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });

  it('should filter templates by search query', async () => {
    const user = userEvent.setup();

    render(
      <TemplatePickerModal
        onSelectTemplate={mockOnSelectTemplate}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search templates...');
    await user.type(searchInput, 'emotions');

    await waitFor(() => {
      expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      expect(screen.queryByText('Core Needs')).not.toBeInTheDocument();
    });
  });

  it('should clear search query', async () => {
    const user = userEvent.setup();

    render(
      <TemplatePickerModal
        onSelectTemplate={mockOnSelectTemplate}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search templates...');
    await user.type(searchInput, 'emotions');

    await waitFor(() => {
      expect(screen.queryByText('Core Needs')).not.toBeInTheDocument();
    });

    const clearButton = screen.getByLabelText('Clear search');
    await user.click(clearButton);

    await waitFor(() => {
      expect(screen.getByText('Core Needs')).toBeInTheDocument();
    });
  });

  it('should filter by category', async () => {
    const user = userEvent.setup();

    render(
      <TemplatePickerModal
        onSelectTemplate={mockOnSelectTemplate}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
    });

    const dailyLifeTab = screen.getByRole('tab', { name: 'Daily Life' });
    await user.click(dailyLifeTab);

    await waitFor(() => {
      expect(screen.getByText('Core Needs')).toBeInTheDocument();
      expect(screen.getByText('Daily Routine')).toBeInTheDocument();
      expect(screen.queryByText('Basic Emotions')).not.toBeInTheDocument();
    });
  });

  it('should filter by featured status', async () => {
    const user = userEvent.setup();

    render(
      <TemplatePickerModal
        onSelectTemplate={mockOnSelectTemplate}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Daily Routine')).toBeInTheDocument();
    });

    const featuredCheckbox = screen.getByLabelText('Show featured templates only');
    await user.click(featuredCheckbox);

    await waitFor(() => {
      expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      expect(screen.getByText('Core Needs')).toBeInTheDocument();
      expect(screen.queryByText('Daily Routine')).not.toBeInTheDocument();
    });
  });

  it('should display template count', async () => {
    render(
      <TemplatePickerModal
        onSelectTemplate={mockOnSelectTemplate}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Showing 4 of 4 templates')).toBeInTheDocument();
    });
  });

  it('should show "no results" when filters match nothing', async () => {
    const user = userEvent.setup();

    render(
      <TemplatePickerModal
        onSelectTemplate={mockOnSelectTemplate}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search templates...');
    await user.type(searchInput, 'nonexistent');

    await waitFor(() => {
      expect(screen.getByText('No templates found matching your criteria.')).toBeInTheDocument();
    });
  });

  it('should clear all filters', async () => {
    const user = userEvent.setup();

    render(
      <TemplatePickerModal
        onSelectTemplate={mockOnSelectTemplate}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
    });

    // Apply filters
    const searchInput = screen.getByPlaceholderText('Search templates...');
    await user.type(searchInput, 'nonexistent');

    await waitFor(() => {
      expect(screen.getByText('No templates found matching your criteria.')).toBeInTheDocument();
    });

    const clearFiltersButton = screen.getByText('Clear Filters');
    await user.click(clearFiltersButton);

    await waitFor(() => {
      expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
    });
  });

  it('should call onSelectTemplate when "Use Template" is clicked', async () => {
    const user = userEvent.setup();

    render(
      <TemplatePickerModal
        onSelectTemplate={mockOnSelectTemplate}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
    });

    const useButtons = screen.getAllByText('✨ Use Template');
    await user.click(useButtons[0]);

    expect(mockOnSelectTemplate).toHaveBeenCalledWith('basic-emotions');
  });

  it('should close modal when close button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <TemplatePickerModal
        onSelectTemplate={mockOnSelectTemplate}
        onClose={mockOnClose}
      />
    );

    const closeButton = screen.getByLabelText('Close template picker');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should close modal when overlay is clicked', async () => {
    const user = userEvent.setup();

    render(
      <TemplatePickerModal
        onSelectTemplate={mockOnSelectTemplate}
        onClose={mockOnClose}
      />
    );

    const overlay = screen.getByRole('dialog').parentElement!;
    await user.click(overlay);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should not close modal when content is clicked', async () => {
    const user = userEvent.setup();

    render(
      <TemplatePickerModal
        onSelectTemplate={mockOnSelectTemplate}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
    });

    const modal = screen.getByRole('dialog');
    await user.click(modal);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should have proper ARIA attributes', async () => {
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

  it('should display template metadata', async () => {
    render(
      <TemplatePickerModal
        onSelectTemplate={mockOnSelectTemplate}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
    });

    expect(screen.getByText('Express basic feelings')).toBeInTheDocument();
    expect(screen.getByText('Emotions')).toBeInTheDocument();
    expect(screen.getByText('9 buttons')).toBeInTheDocument();
  });
});
