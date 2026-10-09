import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../api/auth';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { logout } from '../../store/authSlice';
import '../../styles/common/Sidebar.scss';
import '../../styles/common/Common.scss';

interface SidebarProps {
  activeTab?: 'home' | 'explore' | 'profile' | 'admin' | 'moderator';
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab = 'profile' }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // take roles from redux or localstorage
  const authUser = useAppSelector((state) => state.auth.user);
  
  const savedRoles = localStorage.getItem('user_roles');
  const userRoles: string[] = authUser?.roles || (savedRoles ? JSON.parse(savedRoles) : []);

  // checking roles
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

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      // 1. request to backend for deleting of HttpOnly cookies
      await logoutUser();
    } catch (error) {
      console.error('Logout failed on server:', error);
    } finally {
      // 2. Clean Redux-state and localstorage
      dispatch(logout()); 
      localStorage.clear(); 

      // 3. Redirect to login
      navigate('/login');
    }
  };

  return (
    <aside className="sidebar">
      <h1 className="sidebar-title">💬 Innotter</h1>

      <nav className="sidebar-nav">
        <Link to="/home" className={getClassName('home')}>
          <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 24 }}>home</span> Home
        </Link>
        <Link to="/explore" className={getClassName('explore')}>
          <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 24 }}>search</span> Explore
        </Link>
        <Link to="/me" className={getClassName('profile')}>
          <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 24 }}>person</span> Profile
        </Link>

        {isAdmin && (
          <Link to="/admin" className={getClassName('admin')}>
            <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 24 }}>admin_panel_settings</span> Admin Panel
          </Link>
        )}

        {isModerator && (
          <Link to="/moderator" className={getClassName('moderator')}>
            <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 24 }}>shield</span> Group Users
          </Link>
        )}

        <a href="/login" className={getClassName('login')} onClick={handleLogout}>
          <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 24 }}>logout</span> Log Out
        </a>
      </nav>
    </aside>
  );
};