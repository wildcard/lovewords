/**
 * Template Picker Modal Component
 *
 * Allows users to browse and select board templates.
 */

import React, { useEffect, useState, useMemo } from 'react';
import type { TemplateMetadata, TemplateManifest } from '../types/template-catalog';
import { loadTemplateManifest, filterTemplates, getCategories } from '../utils/template-loader';
import { TemplateCard } from './TemplateCard';
import { TemplatePreviewModal } from './TemplatePreviewModal';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface TemplatePickerModalProps {
  onSelectTemplate: (templateId: string) => void;
  onClose: () => void;
}

export function TemplatePickerModal({ onSelectTemplate, onClose }: TemplatePickerModalProps) {
  const [manifest, setManifest] = useState<TemplateManifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Preview state
  const [previewTemplate, setPreviewTemplate] = useState<TemplateMetadata | null>(null);

  const modalRef = useFocusTrap<HTMLDivElement>();

  // Load manifest on mount
  useEffect(() => {
    let mounted = true;

    async function loadManifest() {
      setLoading(true);
      setError(null);

      try {
        const data = await loadTemplateManifest();
        if (mounted) {
          setManifest(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load templates');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadManifest();

    return () => {
      mounted = false;
    };
  }, []);

  // Get available categories
  const categories = useMemo(() => {
    if (!manifest) return ['All'];
    return getCategories(manifest.templates);
  }, [manifest]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    if (!manifest) return [];

    return filterTemplates(manifest.templates, {
      query: searchQuery,
      category: selectedCategory,
      featured: showFeaturedOnly || undefined,
    });
  }, [manifest, searchQuery, selectedCategory, showFeaturedOnly]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && !previewTemplate) {
      onClose();
    }
  };

  const handlePreview = (templateId: string) => {
    const template = manifest?.templates.find((t) => t.id === templateId);
    if (template) {
      setPreviewTemplate(template);
    }
  };

  const handleUseTemplate = (templateId: string) => {
    setPreviewTemplate(null);
    onSelectTemplate(templateId);
  };

  const handleClosePreview = () => {
    setPreviewTemplate(null);
  };

  return (
    <>
      <div
        className="modal-overlay"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="template-picker-title"
      >
        <div
          ref={modalRef}
          className="modal-content template-picker-modal"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
        >
          {/* Header */}
          <div className="modal-header">
            <h2 id="template-picker-title">📋 Choose a Template</h2>
            <button
              type="button"
              className="close-button"
              onClick={onClose}
              aria-label="Close template picker"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="modal-body">
            {loading && <div className="loading">Loading templates...</div>}

            {error && (
              <div className="error-message">
                <p>{error}</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="btn-secondary"
                >
                  Reload Page
                </button>
              </div>
            )}

            {!loading && !error && manifest && (
              <>
                {/* Filters */}
                <div className="template-filters">
                  {/* Search */}
                  <div className="filter-search">
                    <input
                      type="text"
                      placeholder="Search templates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="search-input"
                      aria-label="Search templates"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        className="clear-search"
                        onClick={() => setSearchQuery('')}
                        aria-label="Clear search"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Category tabs */}
                  <div className="filter-tabs" role="tablist" aria-label="Template categories">
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        role="tab"
                        aria-selected={selectedCategory === category}
                        aria-controls="template-grid"
                        className={`tab-button ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  {/* Featured toggle */}
                  <div className="filter-featured">
                    <label>
                      <input
                        type="checkbox"
                        checked={showFeaturedOnly}
                        onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                        aria-label="Show featured templates only"
                      />
                      <span>⭐ Featured only</span>
                    </label>
                  </div>
                </div>

                {/* Results count */}
                <div className="template-results-info">
                  <p>
                    Showing {filteredTemplates.length} of {manifest.templates.length} templates
                  </p>
                </div>

                {/* Template grid */}
                <div className="template-grid" id="template-grid" role="tabpanel">
                  {filteredTemplates.length === 0 ? (
                    <div className="no-results">
                      <p>No templates found matching your criteria.</p>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('All');
                          setShowFeaturedOnly(false);
                        }}
                      >
                        Clear Filters
                      </button>
                    </div>
                  ) : (
                    filteredTemplates.map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        onPreview={handlePreview}
                        onUse={handleUseTemplate}
                      />
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Preview modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onUse={handleUseTemplate}
          onClose={handleClosePreview}
        />
      )}
    </>
  );
}
