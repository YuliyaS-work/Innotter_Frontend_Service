import React from 'react';
import '../../styles/common/RightPanel.scss';
import { Button } from './Button_profile';

export const RightPanel: React.FC = () => {
  return (
    <aside className="right-panel">
      <Button
        bgColor="#ff6b00"
        fullWidth
        onClick={() => alert('Create Page modal')}
      >
        Create Page
      </Button>

      <div style={{ marginTop: '30px' }}>
        <h2 className="right-panel-title">My Pages</h2>
        <p className="right-panel-text">No pages created yet.</p>
      </div>
    </aside>
  );
};