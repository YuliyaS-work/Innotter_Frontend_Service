import React from 'react';
import { logoutUser } from '../api/auth';

export const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await logoutUser();
      console.log('Logged out, cookies cleared by backend.');
      // В будущем тут будет редирект на страницу входа: window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      style={{
        padding: '8px 16px',
        backgroundColor: '#e74c3c',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Log Out
    </button>
  );
};