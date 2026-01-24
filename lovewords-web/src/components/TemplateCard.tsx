/**
 * Template Card Component
 *
 * Displays a single template in the template picker grid.
 */

import React from 'react';
import type { TemplateMetadata } from '../types/template-catalog';

interface TemplateCardProps {
  template: TemplateMetadata;
  onPreview: (templateId: string) => void;
  onUse: (templateId: string) => void;
}

export function TemplateCard({ template, onPreview, onUse }: TemplateCardProps) {
  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  return (
    <div className="template-card">
      {/* Template thumbnail or placeholder */}
      <div className="template-thumbnail">
        {template.thumbnail ? (
          <img src={template.thumbnail} alt={template.name} />
        ) : (
          <div className="template-placeholder">
            <span className="template-grid-size">
              {template.grid.rows}×{template.grid.columns}
            </span>
          </div>
        )}
      </div>

      {/* Template info */}
      <div className="template-info">
        <div className="template-header">
          <h3 className="template-name">{template.name}</h3>
          {template.featured && (
            <span className="template-badge featured" aria-label="Featured template">
              ⭐
            </span>
          )}
        </div>

        <p className="template-description">{template.description}</p>

        {/* Metadata */}
        <div className="template-metadata">
          <span className="template-category">{template.category}</span>
          <span className="template-button-count">{template.buttonCount} buttons</span>
          <span className="template-difficulty">{template.difficulty}</span>
        </div>

        {/* Actions */}
        <div className="template-actions">
          <button
            type="button"
            className="template-preview-btn"
            onClick={() => onPreview(template.id)}
            onKeyDown={(e) => handleKeyDown(e, () => onPreview(template.id))}
            aria-label={`Preview ${template.name} template`}
          >
            👁️ Preview
          </button>
          <button
            type="button"
            className="template-use-btn"
            onClick={() => onUse(template.id)}
            onKeyDown={(e) => handleKeyDown(e, () => onUse(template.id))}
            aria-label={`Use ${template.name} template`}
          >
            ✨ Use Template
          </button>
        </div>
      </div>
    </div>
  );
}
