import React from 'react';
import { logoutUser } from '../../api/auth';

interface SidebarProps {
  activeTab?: 'home' | 'explore' | 'profile';
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab = 'profile' }) => {
  const getStyle = (tab: string) => ({
    textDecoration: 'none',
    color: activeTab === tab ? '#ff6b00' : '#fff',
    fontWeight: activeTab === tab ? 'bold' : 'normal',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '20px',
    paddingLeft: '20px'
  });

  return (
    <aside style={{ width: '20%', padding: '40px 0 0 40px ', backgroundColor: '#333', borderRight: '1px solid #eee', minHeight: '100vh' }}>
      <h1 style={{ color: '#ff6b00', marginBottom: '30px', marginTop: 0 }}>💬 Innotter</h1>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '35px', marginBottom: '30px' }}>
        <a href="/home" style={getStyle('home')}>Home</a>
        <a href="/explore" style={getStyle('explore')}>Explore</a>
        <a href="/me" style={getStyle('profile')}>Profile</a>
        <a
          href="/login"
          style={getStyle('login')}
          onClick={async (e) => {
            e.preventDefault();
            try {
              await logoutUser();
              window.location.href = '/login';
            } catch (error) {
              console.error('Logout failed:', error);
            }
          }}
        >
          Log Out
        </a>
      </nav>


    </aside>
  );
};