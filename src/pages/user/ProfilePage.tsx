// src/pages/ProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RightPanel } from '../../components/common/RightPanel';
import { deleteMe, getMe, UserResponse } from '../../api/user';
import { logoutUser } from '../../api/auth';
import { Sidebar } from '../../components/common/Sidebar';
import { EditProfileModal } from '../../components/user/EditProfileModal';
import { ICONS } from '../../constants/icons';
import { Button } from '../../components/user/Button';

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

  if (loading) return <div style={{ padding: '20px' }}>Loading profile...</div>;

  const avatarUrl = user?.image_s3_path
    ? user.image_s3_path
    : `https://ui-avatars.com/api/?name=${user?.name}+${user?.surname}&background=666&color=fff&size=128`;

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Left Sidebar (20%) */}
      <Sidebar activeTab="profile" />

      {/*Center Profile Main Content (60%)*/}
      <main style={{ width: '60%', padding: '40px', boxSizing: 'border-box' }}>
        {error && <div style={{ color: '#a21313', marginBottom: '20px' }}>{error}</div>}

        <div style={{ display: 'flex', gap: '40px', paddingTop: '20px', alignItems: 'flex-start' }}>

          <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '20px', alignItems: 'center', textAlign: 'center', minWidth: '140px' }}>
            <img
              src={avatarUrl}
              alt="Avatar"
              style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', marginBottom: '16px' }}
            />
            <h3 style={{ margin: 0, color: '#1a1a1a', fontSize: '20px' }}>{user?.name} {user?.surname}</h3>
            <p style={{ margin: '4px 0 0', color: '#666', fontSize: '16px' }}>{user?.email}</p>
          </div>

          <div style={{ flex: 1, display: 'flex', padding: '40px', flexDirection: 'column', gap: '24px' }}>
            {[
              { label: 'Name:', value: `${user?.name || ''} ` },
              { label: 'Surname:', value: `${user?.surname || ''}` },
              { label: 'Email:', value: user?.email },
              { label: 'Mobile number:', value: user?.phone_number || 'Add number' },
              { label: 'Username:', value: `@${user?.username || ''}` },
            ].map((field, index) => (
              <div key={index} style={{ borderBottom: '1px solid #66666633', paddingBottom: '12px', display: 'flex' }}>
                <span style={{ color: '#666', fontSize: '18px', width: '140px', flexShrink: 0 }}>{field.label}</span>
                <strong style={{ color: '#333', fontSize: '18px' }}>{field.value}</strong>
              </div>
            ))}

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <Button onClick={() => setIsModalOpen(true)} bgColor="#ff6b00">
                Edit Profile
              </Button>
              <Button onClick={handleDelete} bgColor="#a21313">
                Delete Profile
              </Button>
            </div>
          </div>

        </div>
      </main>

      {/* Right Panel (20%) */}
      <RightPanel />

      {/* Edit Profile Modal */}
      {user && (
        <EditProfileModal
          user={user}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={(updatedUser) => setUser(updatedUser)}
        />
      )}
    </div>
  );
};