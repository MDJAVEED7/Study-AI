import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Trash2, Loader } from 'lucide-react';
import { generateShareLink, revokeShareLink } from '../../services/share.service';

const ShareModal = ({ isOpen, onClose, resourceType, resourceId, resourceTitle }) => {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expiryDays, setExpiryDays] = useState('');

  useEffect(() => {
    if (isOpen) {
      generateLink();
    }
  }, [isOpen]);

  const generateLink = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await generateShareLink(resourceType, resourceId, expiryDays || null);
      setShareUrl(response.data.shareUrl);
    } catch (err) {
      setError(err.error || 'Failed to generate share link');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const handleRevoke = async () => {
    if (!window.confirm('Are you sure you want to revoke this share link?')) return;

    setLoading(true);
    try {
      const token = shareUrl.split('/').pop();
      await revokeShareLink(token);
      setShareUrl('');
      onClose();
    } catch (err) {
      setError(err.error || 'Failed to revoke share link');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Share {resourceType}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Resource Title */}
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
          <p className="text-sm text-gray-600">Resource</p>
          <p className="text-sm font-semibold text-gray-900 line-clamp-2">{resourceTitle}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Share URL */}
        {shareUrl ? (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Share Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={copyToClipboard}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        ) : null}

        {/* Expiry Settings */}
        {!shareUrl && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Expiry (Optional - days)
            </label>
            <input
              type="number"
              value={expiryDays}
              onChange={(e) => setExpiryDays(e.target.value)}
              placeholder="Leave empty for no expiry"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {shareUrl ? (
            <>
              <button
                onClick={handleRevoke}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Revoke
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
              >
                Done
              </button>
            </>
          ) : (
            <>
              <button
                onClick={generateLink}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                {loading ? 'Generating...' : 'Generate Link'}
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
