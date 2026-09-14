import React, { useState, useEffect } from 'react';
import { UserResponse, getAvatarUrl } from '../../api/user';

import { Avatar } from './Avatar';
import { AvatarModal } from './AvatarModal';

import '../../styles/user/Profile.scss';

interface ProfileInfoProps {
  user: UserResponse;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // Fetch avatar (presigned URL)
  const fetchAvatar = async () => {
    try {
      const data = await getAvatarUrl();
      setAvatarUrl(data?.presigned_url || null);
    } catch {
      setAvatarUrl(null);
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, []);

  return (
    <div className="profile-avatar-block">
      <Avatar
        avatarUrl={avatarUrl}
        firstName={user.name}
        lastName={user.surname}
        size={150}
        onEditClick={() => setIsAvatarModalOpen(true)}
      />

      <h3 className="profile-name">
        {user.name} {user.surname}
      </h3>

      <p className="profile-email">{user.email}</p>

      <AvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onSuccess={fetchAvatar}
        hasAvatar={Boolean(avatarUrl)}
      />
    </div>
  );
};