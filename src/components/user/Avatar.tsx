import React, { useState, useEffect } from 'react';

interface AvatarProps {
  avatarUrl: string | null;
  firstName?: string;
  lastName?: string;
  size?: number;
  onEditClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  avatarUrl,
  firstName = '',
  lastName = '',
  size = 150,
  onEditClick,
}) => {
  const [imageError, setImageError] = useState(false);

  // Reset the error when changing the link
  useEffect(() => {
    setImageError(false);
  }, [avatarUrl]);
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || 'U';

  return (
    <div style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          onError={() => setImageError(true)}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            backgroundColor: '#555',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `${Math.round(size / 3.4)}px`,
            fontWeight: 'bold',
            userSelect: 'none',
          }}
        >
          {initials}
        </div>
      )}

      {/* Edit button */}
      {onEditClick && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEditClick();
          }}
          style={{
            position: 'absolute',
            bottom: '4px',
            right: '4px',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: '#ff6b00',
            border: '3px solid #ffffff',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
          title="Change Photo"
        >
          {/* icon to edit photo */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </button>
      )}
    </div>
  );
};