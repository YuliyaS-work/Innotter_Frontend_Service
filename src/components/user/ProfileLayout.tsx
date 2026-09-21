import React, { ReactNode } from 'react';
import { Sidebar } from '../../components/common/Sidebar';
import { RightPanel } from '../../components/common/RightPanel';
import '../../styles/user/Profile.scss';

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
