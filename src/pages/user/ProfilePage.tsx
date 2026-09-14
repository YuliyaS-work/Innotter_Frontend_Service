import React, { useEffect, useState } from 'react';
import { deleteMe, getMe, UserResponse } from '../../api/user';
import { EditProfileModal } from '../../components/user/EditProfileModal';
import { ProfileLayout } from '../../components/user/ProfileLayout';
import { ProfileInfo } from '../../components/user/ProfileInfo';
import { ProfileFields } from '../../components/user/ProfileFields';
import { Button } from '../../components/common/Button_profile';

import { Button } from '../../components/user/Button';
import { Avatar } from '../../components/user/Avatar';
import { AvatarModal } from '../../components/user/AvatarModal';

export const ProfilePage = () => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Flag to control the visibility of the AvatarModal and EditProfileModal
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // User data fetching
  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMe();
      setUser(data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        window.location.href = '/login';
        return;
      }
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  // Avatar fetching
  const fetchAvatar = async () => {
    try {
      const data = await getAvatarUrl();
      setAvatarUrl(data?.presigned_url || null);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setAvatarUrl(null);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchAvatar();
  }, []);

  // Deleting user profile 
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      try {
        await deleteMe();
        window.location.href = '/login';
      } catch (err: any) {
        if (err.response?.status === 401) {
          window.location.href = '/login';
          return;
        }
        setError('Failed to delete profile');
      }
    }
  };

  if (loading) {
    return (
      <ProfileLayout>
        <div style={{ padding: '20px' }}>Loading profile...</div>
      </ProfileLayout>
    );
  }

  if (!user) {
    return (
      <ProfileLayout>
        <div className="profile-error">Profile not found</div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      {error && <div className="profile-error">{error}</div>}

      <div className="profile-content">
        <ProfileInfo user={user} />

        <div style={{ flex: 1 }}>
          <ProfileFields user={user} />

          <div className="profile-actions">
            <Button onClick={() => setIsModalOpen(true)} bgColor="#ff6b00">
              Edit Profile
            </Button>
            <Button onClick={handleDelete} bgColor="#a21313">
              Delete Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Modal window for changing avatar */}
      <AvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onSuccess={fetchAvatar}
        hasAvatar={Boolean(avatarUrl)}
      />

      {/* Modal window for editing profile text */}
      {user && (
        <EditProfileModal
          user={user}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={(updatedUser) => setUser(updatedUser)}
        />
      )}
    </ProfileLayout>
  );
};