import React, { ReactNode } from 'react';
import '../../styles/common/RightPanel.scss';

interface RightPanelProps {
  children?: ReactNode;
}

export const RightPanel: React.FC<RightPanelProps> = ({ children }) => {
  return <aside className="right-panel">{children}</aside>;
};