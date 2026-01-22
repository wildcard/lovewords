/**
 * ShareModal component - Generate shareable links and QR codes for boards
 */

import { useState, useEffect } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import type { ObfBoard } from '../types/obf';
import {
  generateShareableLink,
  generateQRCode,
  copyToClipboard,
  downloadDataUrl,
} from '../utils/board-sharing';

export interface ShareModalProps {
  /** The board to share */
  board: ObfBoard;
  /** Callback to close modal */
  onClose: () => void;
}

export function ShareModal({ board, onClose }: ShareModalProps) {
  const [shareableUrl, setShareableUrl] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const dialogRef = useFocusTrap<HTMLDivElement>({ active: true, onEscape: onClose });

  // Generate shareable link and QR code on mount
  useEffect(() => {
    async function generate() {
      try {
        setLoading(true);
        setError(null);

        // Generate shareable URL
        const url = generateShareableLink(board);
        setShareableUrl(url);

        // Generate QR code
        const qr = await generateQRCode(url);
        setQrCodeUrl(qr);

        setLoading(false);
      } catch (err) {
        console.error('Failed to generate share link:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to generate share link'
        );
        setLoading(false);
      }
    }

    generate();
  }, [board]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleCopyLink = async () => {
    try {
      await copyToClipboard(shareableUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      alert('Failed to copy link. Please copy manually.');
    }
  };

  const handleDownloadQR = () => {
    const filename = `${board.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-qr.png`;
    downloadDataUrl(qrCodeUrl, filename);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-labelledby="share-modal-title"
      aria-modal="true"
    >
      <div
        ref={dialogRef}
        className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-300">
          <div className="flex items-center justify-between">
            <h2 id="share-modal-title" className="text-2xl font-bold">
              Share Board
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded"
              aria-label="Close share modal"
              type="button"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Share "{board.name}" with others
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center text-gray-600 py-8">
              Generating share link...
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-900">{error}</p>
              <p className="text-xs text-red-700 mt-2">
                Try using Export instead for large boards.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Shareable Link */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Shareable Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareableUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono"
                    onClick={(e) => e.currentTarget.select()}
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      copied
                        ? 'bg-green-600 text-white'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    type="button"
                  >
                    {copied ? '✓ Copied' : '📋 Copy'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Anyone with this link can import this board
                </p>
              </div>

              {/* QR Code */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  QR Code
                </label>
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-white border-2 border-gray-300 rounded-lg">
                    <img
                      src={qrCodeUrl}
                      alt="QR code for board share link"
                      className="w-48 h-48"
                    />
                  </div>
                  <button
                    onClick={handleDownloadQR}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium transition-colors"
                    type="button"
                  >
                    📥 Download QR Code
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    Scan with a mobile device to import this board
                  </p>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  How to use:
                </h3>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Copy the link and send it via email, text, or messaging app</li>
                  <li>• Download the QR code and print or display it</li>
                  <li>• Recipients can scan the QR code or click the link to import</li>
                  <li>• The board data is encoded in the URL (no server required)</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-300 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            type="button"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
