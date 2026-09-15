import React, { useState } from 'react';
import { getAvatarSrc } from '../../utils/user/moderatorAvatar';

interface UserAvatarProps {
  imagePath: string | null;
  name: string;
  size?: number;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ imagePath, name, size = 36 }) => {
  const [hasError, setHasError] = useState(false);
  const avatarSrc = getAvatarSrc(imagePath);

  if (!avatarSrc || hasError) {
    return (
      <div
        className="avatar-placeholder"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          fontSize: `${Math.round(size / 2.5)}px`,
        }}
      >
        {name ? name[0].toUpperCase() : 'U'}
      </div>
    );
  }

  return (
    <img
      src={avatarSrc}
      alt={name}
      className="user-avatar"
      style={{ width: `${size}px`, height: `${size}px` }}
      onError={() => setHasError(true)}
    />
  );
};