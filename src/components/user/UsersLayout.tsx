import React from 'react';
import { Sidebar } from '../../components/common/Sidebar';

interface UsersLayoutProps {
  title: string;
  activeTab: 'admin' | 'moderator';
  children: React.ReactNode;
}

export const UsersLayout: React.FC<UsersLayoutProps> = ({ title, activeTab, children }) => {
  return (
    <div className="users-layout" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar activeTab={activeTab} />

      <main className="users-content" style={{ flex: 1, padding: '24px' }}>
        <header className="users-header">
          <h2>{title}</h2>
        </header>

        {children}
      </main>
    </div>
  );
};
