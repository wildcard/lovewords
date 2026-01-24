/**
 * Template Preview Modal Component
 *
 * Shows a preview of template content before user commits to using it.
 */

import React, { useEffect, useState } from 'react';
import type { ObfBoard } from '../types/obf';
import type { TemplateMetadata } from '../types/template-catalog';
import { loadTemplate } from '../utils/template-loader';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface TemplatePreviewModalProps {
  template: TemplateMetadata;
  onUse: (templateId: string) => void;
  onClose: () => void;
}

export function TemplatePreviewModal({ template, onUse, onClose }: TemplatePreviewModalProps) {
  const [board, setBoard] = useState<ObfBoard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useFocusTrap<HTMLDivElement>();

  useEffect(() => {
    let mounted = true;

    async function loadTemplateData() {
      setLoading(true);
      setError(null);

      const result = await loadTemplate(template.id);

      if (!mounted) return;

      if (result.success && result.board) {
        setBoard(result.board);
      } else {
        setError(result.error || 'Failed to load template');
      }

      setLoading(false);
    }

    loadTemplateData();

    return () => {
      mounted = false;
    };
  }, [template.id]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  const handleUse = () => {
    onUse(template.id);
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="template-preview-title"
    >
      <div
        ref={modalRef}
        className="modal-content template-preview-modal"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="modal-header">
          <h2 id="template-preview-title">Preview: {template.name}</h2>
          <button
            type="button"
            className="close-button"
            onClick={onClose}
            aria-label="Close preview"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="modal-body">
          {loading && <div className="loading">Loading template...</div>}

          {error && <div className="error-message">{error}</div>}

          {board && !loading && !error && (
            <>
              {/* Template metadata */}
              <div className="template-preview-info">
                <p className="template-description">{template.description}</p>
                <div className="template-stats">
                  <span>
                    📐 Grid: {template.grid.rows}×{template.grid.columns}
                  </span>
                  <span>🔘 Buttons: {template.buttonCount}</span>
                  <span>📁 Category: {template.category}</span>
                  <span>📊 Level: {template.difficulty}</span>
                </div>
              </div>

              {/* Board preview */}
              <div className="template-preview-board">
                <div
                  className="board-grid"
                  style={{
                    gridTemplateRows: `repeat(${board.grid.rows}, 1fr)`,
                    gridTemplateColumns: `repeat(${board.grid.columns}, 1fr)`,
                  }}
                >
                  {board.grid.order.flat().map((buttonId) => {
                    const button = board.buttons.find((b) => b.id === buttonId);
                    if (!button) return null;

                    return (
                      <div
                        key={button.id}
                        className="preview-button"
                        style={{
                          backgroundColor: button.background_color || '#E0E0E0',
                          borderColor: button.border_color || '#999',
                        }}
                      >
                        <span className="button-label">{button.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleUse}
            disabled={loading || !!error}
          >
            ✨ Use This Template
          </button>
        </div>
      </div>
    </div>
  );
}
