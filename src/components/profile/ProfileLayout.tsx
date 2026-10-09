import React, { ReactNode } from 'react';
import { Sidebar } from '../../components/common/Sidebar';
import { RightPanel } from '../../components/common/RightPanel';
import '../../styles/profile/Profile.scss';
import { ProfileRightPanel } from './ProfileRightPanel';
import '../../styles/common/RightPanel.scss';

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
      <RightPanel>
        <ProfileRightPanel />
      </RightPanel>
    </div>
  );
};
