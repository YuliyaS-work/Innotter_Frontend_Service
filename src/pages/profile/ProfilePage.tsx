import React, { useEffect, useState } from 'react';
import { deleteMe, getMe, UserResponse } from '../../api/user';
import { EditProfileModal } from '../../components/profile/EditProfileModal';
import { ProfileLayout } from '../../components/profile/ProfileLayout';
import { ProfileInfo } from '../../components/profile/ProfileInfo';
import { ProfileFields } from '../../components/profile/ProfileFields';
import { Button } from '../../components/common/Button_profile';


export const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchUserData();
  }, []);

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