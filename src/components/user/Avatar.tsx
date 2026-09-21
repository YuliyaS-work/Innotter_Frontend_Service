import React, { useState, useEffect } from 'react';

import '../../styles/user/Avatar.scss';

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

  useEffect(() => {
    setImageError(false);
  }, [avatarUrl]);

  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || 'U';

  const showFallback = imageError || !avatarUrl;

  return (
    <div className="avatar" style={{ width: size, height: size }}>
      {showFallback ? (
        <div className="avatar-fallback" style={{ fontSize: size / 3.4 }}>
          {initials}
        </div>
      ) : (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="avatar-img"
          onError={() => setImageError(true)}
        />
      )}

      {onEditClick && (
        <button
          type="button"
          className="avatar-edit-btn"
          onClick={(e) => {
            e.stopPropagation();
            onEditClick();
          }}
          title="Change Photo"
        >
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