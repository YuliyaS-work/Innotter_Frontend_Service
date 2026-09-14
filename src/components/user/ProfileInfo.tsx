import React from 'react';
import { UserResponse } from '../../api/user';
import '../../styles/user/Profile.scss';

interface ProfileInfoProps {
  user: UserResponse;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  const avatarUrl = user.image_s3_path
    ? user.image_s3_path
    : `https://ui-avatars.com/api/?name=${user.name}+${user.surname}&background=666&color=fff&size=128`;

  return (
    <div className="profile-avatar-block">
      <img
        src={avatarUrl}
        alt="Avatar"
        className="profile-avatar"
      />
      <h3 className="profile-name">
        {user.name} {user.surname}
      </h3>
      <p className="profile-email">{user.email}</p>
    </div>
  );
};
