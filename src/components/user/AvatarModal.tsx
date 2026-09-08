import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { getPresignedPostAvatar, confirmAvatar, deleteAvatar } from '../../api/user';

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

  // Ref for the hidden native file input element
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

  // Handles uploading the avatar file to AWS S3 using presigned POST data
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

      // Ensure the generated key matches the backend payload
      formData.set('key', key);
      formData.append('file', file);

      await axios.post(url, formData);
      await confirmAvatar({ key });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Avatar upload error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handles deleting the current avatar from S3, Redis, and the database
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your current avatar?')) return;

    setLoading(true);
    setError('');

    try {
      await deleteAvatar();
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Avatar delete error:', err);
      setError('Failed to delete image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '28px',
          borderRadius: '16px',
          width: '380px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#1a1a1a', textAlign: 'center', fontSize: '20px' }}>
          Change profile picture
        </h3>

        {/* Hidden native HTML file input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          style={{ display: 'none' }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Full-width file picker trigger button with gallery icon */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 16px',
              backgroundColor: '#f5f5f7',
              border: '1px solid #e0e0e0',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '15px',
              color: '#333',
            }}
          >
            {/* SVG Gallery Icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span style={{ flexGrow: 1, textAlign: 'left', fontWeight: 500 }}>
              {file ? file.name : 'Upload new photo'}
            </span>
          </button>

          {/* Option to remove the current photo (shown only if avatar exists) */}
          {hasAvatar && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 16px',
                backgroundColor: '#fff1f1',
                border: '1px solid #fecdcd',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '15px',
                color: '#a21313',
              }}
            >
              {/* Trash Icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a21313" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              <span style={{ fontWeight: 500 }}>Remove current photo</span>
            </button>
          )}

          {/* Save button (shown when a file is selected) */}
          {file && (
            <button
              type="button"
              onClick={handleUpload}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#ff6b00',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '4px',
              }}
            >
              {loading ? 'Saving...' : 'Save new photo'}
            </button>
          )}
        </div>

        {error && <p style={{ color: '#a21313', fontSize: '13px', marginTop: '12px', textAlign: 'center' }}>{error}</p>}

        {/* Cancel button placed at the very bottom */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#666',
              fontSize: '15px',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              padding: '8px 16px',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};