import React from 'react';
import { logoutUser } from '../api/auth';
import { Button } from './Button';

export const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await logoutUser();
      console.log('Logged out, cookies cleared by backend.');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Button 
      onClick={handleLogout} 
      bgColor="#ff6b00" 
      fullWidth
    >
      Log Out
    </Button>
  );
};