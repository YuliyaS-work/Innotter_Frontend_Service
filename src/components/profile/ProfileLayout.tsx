import React, { ReactNode } from 'react';
import { Sidebar } from '../common/Sidebar';
import { RightPanel } from '../common/RightPanel';
import '../../styles/profile/Profile.scss';

interface ProfileLayoutProps {
  children: ReactNode;
}

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  return (
    <div className="profile-container">
      <Sidebar activeTab="profile" />

      <main className="profile-main">
        {children}
      </main>

      <RightPanel />
    </div>
  );
};
