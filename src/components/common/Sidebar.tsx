import React from 'react';
import { logoutUser } from '../../api/auth';
import '../../styles/common/Sidebar.scss';
import '../../styles/common/Common.scss';
import { ICONS } from '../../constants/icons';

interface SidebarProps {
  activeTab?: 'home' | 'explore' | 'profile';
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab = 'profile' }) => {
  const getClassName = (tab: string) =>
    `sidebar-link ${activeTab === tab ? 'sidebar-link--active' : ''}`;

  return (
    <aside className="sidebar">
      <h1 className="sidebar-title">💬 Innotter</h1>

      <nav className="sidebar-nav">
        <a href="/home" className={getClassName('home')}>
          <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 24 }}>home</span> Home
        </a>
        <a href="/explore" className={getClassName('explore')}>
          <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 24 }}>search</span> Explore
        </a>
        <a href="/me" className={getClassName('profile')}>
          <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 24 }}>person</span> Profile
        </a>
        <a
          href="/login"
          className={getClassName('login')}
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
           <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 24 }}>logout</span>Log Out
        </a>
      </nav>
    </aside>
  );
};