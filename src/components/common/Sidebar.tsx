import React, { useEffect, useState } from 'react';
import { logoutUser } from '../../api/auth';
import '../../styles/common/Sidebar.scss';
import '../../styles/common/Common.scss';
import { getMe } from '../../api/user';

interface SidebarProps {
  activeTab?: 'home' | 'explore' | 'profile' | 'admin' | 'moderator';
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab = 'profile' }) => {
  const [userRoles, setUserRoles] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const userData = await getMe();
        setUserRoles(userData.roles || []);
      } catch (error) {
        setUserRoles([]);
      }
    };

    fetchUserRoles();
  }, []);

  // Safe type-agnostic role check (handles string or object with name/title)
  const hasRole = (roleName: string) => {
    return userRoles.some((role: any) => {
      if (typeof role === 'string') return role === roleName;
      return role?.role_name === roleName || role?.title === roleName;
    });
  };

  const isAdmin = hasRole('ADMIN');
  const isModerator = hasRole('MODERATOR');

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

        {isAdmin && (
          <a href="/admin" className={getClassName('admin')}>
            <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 24 }}>admin_panel_settings</span> Admin Panel
          </a>
        )}

        {isModerator && (
          <a href="/moderator" className={getClassName('moderator')}>
            <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 24 }}>shield</span> Group Users
          </a>
        )}

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
          <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 24 }}>logout</span> Log Out
        </a>
      </nav>
    </aside>
  );
};