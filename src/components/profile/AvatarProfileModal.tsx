import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

import { getPresignedPostAvatar, confirmAvatar, deleteAvatar } from '../../api/user';

import '../../styles/profile/AvatarModal.scss';

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  hasAvatar?: boolean;
}

export const AvatarModal: React.FC<AvatarModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  hasAvatar = false,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFile(null);
      setError('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const { url, fields, key } = await getPresignedPostAvatar();

      const formData = new FormData();
      Object.keys(fields).forEach((fieldName) => {
        formData.append(fieldName, fields[fieldName]);
      });

      formData.set('key', key);
      formData.append('file', file);

      await axios.post(url, formData);
      await confirmAvatar({ key });

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Avatar upload error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your current avatar?')) return;

    setLoading(true);
    setError('');

    try {
      await deleteAvatar();
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Avatar delete error:', err);
      setError('Failed to delete image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="avatar-modal-overlay">
      <div className="avatar-modal">
        <h3 className="avatar-modal-title">Change profile picture</h3>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="avatar-modal-file-input"
        />

        <button
          type="button"
          className="avatar-modal-upload-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>

          <span>{file ? file.name : 'Upload new photo'}</span>
        </button>

        {hasAvatar && (
          <button
            type="button"
            className="avatar-modal-delete-btn"
            onClick={handleDelete}
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a21313" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>

            <span>Remove current photo</span>
          </button>
        )}

        {file && (
          <button
            type="button"
            className="avatar-modal-save-btn"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save new photo'}
          </button>
        )}

        {error && <p className="avatar-modal-error">{error}</p>}

        <button
          type="button"
          className="avatar-modal-cancel-btn"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};