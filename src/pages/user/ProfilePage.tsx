// src/pages/ProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, UserResponse } from '../../api/user';
import { logoutUser } from '../../api/auth';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await getMe();
        setUser(data);
      } catch (err: any) {
        console.error('Failed to fetch user:', err);
        setError('Unauthorized or session expired.');
        // if a user is not authenticated
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
        <h2>Loading profile...</h2>
      </div>
    );
  }

  if (error || !user) {
    return null;
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px' }}>
      <h1>User Profile</h1>
      
      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Full Name:</strong> {user.name} {user.surname}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone_number || 'N/A'}</p>
        <p><strong>Status:</strong> {user.is_blocked ? 'Blocked' : 'Active'}</p>
        
        {user.roles && user.roles.length > 0 && (
          <p>
            <strong>Roles:</strong> {user.roles.map((role) => role.role_name).join(', ')}
          </p>
        )}
      </div>

      <button
        onClick={handleLogout}
        style={{
          backgroundColor: '#ff6b00',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '4px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Log Out
      </button>
    </div>
  );
};